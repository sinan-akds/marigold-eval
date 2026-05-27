import fs from 'node:fs';
import path from 'node:path';
import { ROOT, RESULTS_DIR, DEV_SERVER_PORT_BASE, DEFAULT_CLAUDE_TIMEOUT_MS } from './paths';
import { log } from './log';
import { addRun } from './benchmark';
import { createWorktree, removeWorktree, killDevServerOnPort, resetMainTestApp, STUB_CONTENT } from './worktree';
import { createRunMcpConfig, cleanupRunMcpConfig } from './mcp';
import { buildClaudeArgs, ClaudeTimeoutError, runClaude } from './claude';
import { runScore, locateTargetFile, extractEfficiency } from './scoring';
import { extractRunDetail } from './result-parsing';
import type { BenchmarkFile, BenchmarkRun, ClaudeOutput, Combination, Efficiency, EvalsConfig, RunResult } from './types';

let shuttingDown = false;

export const installShutdownHandler = () => {
  const handler = () => {
    if (shuttingDown) {
      log('\nForce exit.\n');
      process.exit(1);
    }
    shuttingDown = true;
    log('\nShutting down gracefully — waiting for in-flight runs to finish...\n');
  };
  process.on('SIGINT', handler);
  process.on('SIGTERM', handler);
};

const buildRunDir = (combo: Combination): string =>
  path.join(RESULTS_DIR, `${combo.model}-${combo.config}`, combo.evalId, `run-${combo.run}`);

const mergeAndSaveResult = (
  combo: Combination,
  runDir: string,
  efficiency: Efficiency,
  sessionId: string | null,
  ts: string
): Record<string, unknown> => {
  const scoringResultPath = path.join(RESULTS_DIR, 'runs', combo.id, combo.evalId, 'result.json');
  const resultData: Record<string, unknown> = (() => {
    try { return JSON.parse(fs.readFileSync(scoringResultPath, 'utf-8')); }
    catch { return {}; }
  })();
  resultData.efficiency = efficiency;
  if (sessionId) resultData.sessionId = sessionId;
  resultData.timestamp = ts;
  fs.writeFileSync(path.join(runDir, 'result.json'), JSON.stringify(resultData, null, 2) + '\n');
  return resultData;
};

const runSingle = async (
  combo: Combination,
  config: EvalsConfig,
  bm: BenchmarkFile,
  workerIndex: number
): Promise<RunResult> => {
  const tag = `[${combo.id}]`;
  const d = config.defaults;
  const appDir = d.projectDir;
  const runDir = buildRunDir(combo);
  const ts = new Date().toISOString();
  log(`${tag} Starting...\n`);

  let wtPath: string | undefined;
  try {
    const port = DEV_SERVER_PORT_BASE + workerIndex;
    killDevServerOnPort(port);

    log(`${tag} Creating worktree...\n`);
    wtPath = createWorktree(combo.id, appDir);

    const targetFile = path.join(wtPath, d.targetFile);
    fs.writeFileSync(targetFile, STUB_CONTENT);

    const runMcpConfig = createRunMcpConfig(combo, workerIndex);
    log(`${tag} Running claude -p (model: ${combo.model}, config: ${combo.config})...\n`);

    const claudeArgs = buildClaudeArgs(combo, config, wtPath, runMcpConfig, workerIndex);
    const extraEnv: Record<string, string> = combo.config !== 'full-stack' ? { MARIGOLD_VALIDATE_DISABLED: '1' } : {};
    const claudeResult = await runClaude(claudeArgs, wtPath, d.claudeTimeoutMs ?? DEFAULT_CLAUDE_TIMEOUT_MS, extraEnv);

    const sessionId = claudeResult.session_id ?? null;
    const efficiency = extractEfficiency(claudeResult);

    log(`${tag} Claude finished in ${(efficiency.durationMs / 1000).toFixed(1)}s, $${efficiency.costUsd.toFixed(4)} (session: ${sessionId ?? 'unknown'}).\n`);

    const mainTarget = path.join(appDir, d.targetFile);
    const actualTarget = locateTargetFile(targetFile, wtPath, mainTarget, tag);
    resetMainTestApp(appDir, d.targetFile);

    log(`${tag} Scoring...\n`);
    const scoreResult = runScore(actualTarget, {
      evalId: combo.evalId,
      model: combo.model,
      config: combo.config,
      runId: combo.id,
      outputDir: RESULTS_DIR,
      validatePackage: d.validatePackage,
      themePath: d.themePath,
      scoreTimeoutMs: d.scoreTimeoutMs,
    });

    const scoreLabel = scoreResult.score !== null ? `${scoreResult.score}/100` : 'null (scoring failed)';
    const assertLabel = scoreResult.assertionPassRate !== null
      ? ` | Assertions: ${Math.round(scoreResult.assertionPassRate * 100)}%`
      : '';
    log(`${tag} Score: ${scoreLabel}${assertLabel}${scoreResult.error ? ` (error: ${scoreResult.error})` : ''}\n`);

    fs.mkdirSync(runDir, { recursive: true });
    if (claudeResult._stderr) {
      fs.writeFileSync(path.join(runDir, 'claude-stderr.log'), claudeResult._stderr);
    }
    try {
      const src = fs.readFileSync(actualTarget, 'utf-8');
      fs.writeFileSync(path.join(runDir, 'source.tsx'), src);
    } catch { /* ok */ }

    const resultData = mergeAndSaveResult(combo, runDir, efficiency, sessionId, ts);
    const detail = extractRunDetail(resultData);

    const bmRun: BenchmarkRun = {
      evalId: combo.evalId,
      model: combo.model,
      config: combo.config,
      runNumber: combo.run,
      timestamp: ts,
      score: scoreResult.score,
      assertionPassRate: scoreResult.assertionPassRate,
      sessionId,
      efficiency,
      detail,
      resultFile: path.relative(ROOT, path.join(runDir, 'result.json')),
      sourceFile: path.relative(ROOT, path.join(runDir, 'source.tsx')),
      ...(scoreResult.error ? { error: scoreResult.error } : {}),
    };
    addRun(bm, bmRun);

    return { id: combo.id, score: scoreResult.score, assertionPassRate: scoreResult.assertionPassRate, sessionId, efficiency, ...(scoreResult.error ? { error: scoreResult.error } : {}) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`${tag} FAILED: ${msg}\n`);

    if (err instanceof ClaudeTimeoutError && err.stderr) {
      fs.mkdirSync(runDir, { recursive: true });
      fs.writeFileSync(path.join(runDir, 'timeout-stderr.log'), err.stderr);
      log(`${tag} Stderr saved to ${path.relative(ROOT, path.join(runDir, 'timeout-stderr.log'))}\n`);
    }

    let score: number | null = null;
    let assertionPassRate: number | null = null;
    let timeoutEfficiency: Efficiency | undefined;
    let detail: BenchmarkRun['detail'];

    if (err instanceof ClaudeTimeoutError && wtPath) {
      const targetFile = path.join(wtPath, d.targetFile);
      const mainTarget = path.join(appDir, d.targetFile);
      const actualTarget = locateTargetFile(targetFile, wtPath, mainTarget, tag);
      resetMainTestApp(appDir, d.targetFile);

      const content = fs.existsSync(actualTarget) ? fs.readFileSync(actualTarget, 'utf-8').trim() : '';
      const isStub = content === STUB_CONTENT.trim() || content.length === 0;
      if (!isStub) {
        log(`${tag} Scoring timed-out run (file exists)...\n`);
        fs.mkdirSync(runDir, { recursive: true });
        fs.writeFileSync(path.join(runDir, 'source.tsx'), content);

        const scoreResult = runScore(actualTarget, {
          evalId: combo.evalId,
          model: combo.model,
          config: combo.config,
          runId: combo.id,
          outputDir: RESULTS_DIR,
          validatePackage: d.validatePackage,
          themePath: d.themePath,
          scoreTimeoutMs: d.scoreTimeoutMs,
        });
        score = scoreResult.score;
        assertionPassRate = scoreResult.assertionPassRate;

        let parsedOutput: ClaudeOutput | undefined;
        try { parsedOutput = JSON.parse(err.stdout); } catch { /* truncated JSON */ }
        timeoutEfficiency = parsedOutput
          ? extractEfficiency(parsedOutput)
          : { durationMs: d.claudeTimeoutMs ?? DEFAULT_CLAUDE_TIMEOUT_MS, costUsd: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheCreationTokens: 0, totalTokens: 0, numTurns: 0 };

        const resultData = mergeAndSaveResult(combo, runDir, timeoutEfficiency, null, ts);
        detail = extractRunDetail(resultData);

        const assertLabel = assertionPassRate !== null
          ? ` | Assertions: ${Math.round(assertionPassRate * 100)}%`
          : '';
        log(`${tag} Timeout score: ${score !== null ? `${score}/100` : 'null'}${assertLabel}\n`);
      }
    }

    const bmRun: BenchmarkRun = {
      evalId: combo.evalId,
      model: combo.model,
      config: combo.config,
      runNumber: combo.run,
      timestamp: ts,
      score,
      assertionPassRate,
      sessionId: null,
      error: msg,
      ...(timeoutEfficiency ? { efficiency: timeoutEfficiency } : {}),
      ...(detail ? { detail } : {}),
      resultFile: path.relative(ROOT, path.join(runDir, 'result.json')),
      sourceFile: path.relative(ROOT, path.join(runDir, 'source.tsx')),
    };
    addRun(bm, bmRun);

    return { id: combo.id, score, assertionPassRate, error: msg };
  } finally {
    const port = DEV_SERVER_PORT_BASE + workerIndex;
    killDevServerOnPort(port);
    cleanupRunMcpConfig(combo);
    if (wtPath) {
      log(`${tag} Cleaning up worktree...\n`);
      removeWorktree(combo.id, config.defaults.projectDir);
    }
  }
};

const createModelSemaphore = (limits: Record<string, number>) => {
  const active = new Map<string, number>();
  const waiters = new Map<string, (() => void)[]>();

  const acquire = async (model: string) => {
    const limit = limits[model];
    if (limit === undefined) return;
    while ((active.get(model) ?? 0) >= limit) {
      await new Promise<void>(resolve => {
        const queue = waiters.get(model) ?? [];
        queue.push(resolve);
        waiters.set(model, queue);
      });
    }
    active.set(model, (active.get(model) ?? 0) + 1);
  };

  const release = (model: string) => {
    const limit = limits[model];
    if (limit === undefined) return;
    active.set(model, (active.get(model) ?? 0) - 1);
    const queue = waiters.get(model);
    if (queue?.length) queue.shift()!();
  };

  return { acquire, release };
};

export const runBatch = async (
  combinations: Combination[],
  config: EvalsConfig,
  bm: BenchmarkFile,
  concurrency: number
): Promise<RunResult[]> => {
  const total = combinations.length;
  let completed = 0;
  const results: RunResult[] = [];
  let idx = 0;
  const batchStart = Date.now();

  const modelSem = createModelSemaphore(config.defaults.modelConcurrency ?? {});

  const effectiveWorkers = Math.min(concurrency, total);
  const workers = Array.from({ length: effectiveWorkers }, async (_, workerIndex) => {
    while (true) {
      if (shuttingDown) break;
      const i = idx++;
      if (i >= total) break;
      const combo = combinations[i];
      await modelSem.acquire(combo.model);
      try {
        const result = await runSingle(combo, config, bm, workerIndex);
        results.push(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        log(`  Worker ${workerIndex} crashed on ${combo.id}: ${msg}\n`);
        results.push({ id: combo.id, score: null, assertionPassRate: null, error: msg });
      } finally {
        modelSem.release(combo.model);
      }
      completed++;
      const elapsedMs = Date.now() - batchStart;
      const elapsed = (elapsedMs / 1000) | 0;
      const eta = elapsedMs > 1000
        ? (((total - completed) * (elapsedMs / completed)) / 1000) | 0
        : '?';
      log(`  Progress: ${completed}/${total} (${elapsed}s elapsed, ~${eta}s remaining)\n`);
    }
  });

  await Promise.all(workers);
  return results;
};
