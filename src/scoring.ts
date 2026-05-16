import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { EVALS_PATH } from './paths';
import { log } from './log';
import { EMPTY_TEST_APP, STUB_CONTENT } from './worktree';
import type { ClaudeOutput, Efficiency, ScoreResult } from './types';

type ScoreOpts = {
  evalId: string;
  model: string;
  config: string;
  runId: string;
  outputDir: string;
  validatePackage: string;
  themePath?: string;
  scoreTimeoutMs?: number;
};

export type { ScoreOpts };

export const runScore = (targetFile: string, opts: ScoreOpts): ScoreResult => {
  const scoreBin = path.join(opts.validatePackage, 'dist', 'bin', 'marigold-score.mjs');

  if (!fs.existsSync(targetFile)) {
    return { score: null, assertionPassRate: null, error: 'Target file not found after claude run' };
  }

  const resultFilePath = path.join(opts.outputDir, 'runs', opts.runId, opts.evalId, 'result.json');

  const scoreArgs = [
    scoreBin, targetFile,
    '--prompt-id', opts.evalId,
    '--model', opts.model,
    '--config', opts.config,
    '--run-id', opts.runId,
    '--output-dir', opts.outputDir,
    '--evals', EVALS_PATH,
    '--eval-id', opts.evalId,
    ...(opts.themePath ? ['--theme', opts.themePath] : []),
  ];

  let scoreStderr = '';
  try {
    execFileSync('node', scoreArgs, {
      cwd: path.dirname(targetFile),
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: opts.scoreTimeoutMs ?? 300_000,
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'stderr' in err) {
      scoreStderr = String((err as { stderr: unknown }).stderr).slice(0, 2000);
    }
  }

  try {
    const saved = JSON.parse(fs.readFileSync(resultFilePath, 'utf-8'));
    const quality = saved.quality ?? {};
    const assertions = saved.assertions ?? null;
    return {
      score: quality.overall ?? null,
      assertionPassRate: assertions?.passRate ?? null,
      quality,
      assertions,
    };
  } catch {
    const detail = scoreStderr ? `: ${scoreStderr}` : '';
    return { score: null, assertionPassRate: null, error: `Result file not found at ${resultFilePath}${detail}` };
  }
};

export const locateTargetFile = (
  expectedPath: string,
  wtPath: string,
  mainAppPath: string,
  tag: string
): string => {
  const worktreeContent = fs.existsSync(expectedPath) ? fs.readFileSync(expectedPath, 'utf-8').trim() : '';
  const isStub = worktreeContent === STUB_CONTENT.trim() || worktreeContent.length === 0;
  const hasRealContent = !isStub;

  if (hasRealContent) return expectedPath;

  const mainContent = fs.existsSync(mainAppPath) ? fs.readFileSync(mainAppPath, 'utf-8').trim() : '';
  const mainPopulated = mainContent.length > 0
    && mainContent !== EMPTY_TEST_APP.trim()
    && mainContent !== STUB_CONTENT.trim();

  if (mainPopulated) {
    log(`${tag} Claude wrote to main app instead of worktree — copying file back.\n`);
    fs.writeFileSync(expectedPath, mainContent);
    return expectedPath;
  }

  try {
    const found = execFileSync('find', [
      path.join(wtPath, 'src'),
      '-name', '*.tsx',
      '-not', '-name', 'App.tsx',
      '-not', '-name', 'main.tsx',
      '-not', '-name', 'vite-env.d.ts',
      '-not', '-path', '*/node_modules/*',
      '-type', 'f',
    ], { stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim().split('\n').filter(Boolean);

    if (found.length > 0) {
      log(`${tag} Target not at expected path, found at: ${path.relative(wtPath, found[0])}\n`);
      return found[0];
    }
  } catch { /* ok */ }

  log(`${tag} Target file missing! No candidate .tsx files found in src/.\n`);
  return expectedPath;
};

export const extractEfficiency = (result: ClaudeOutput): Efficiency => {
  const usage = result.usage ?? {};
  const input = usage.input_tokens ?? 0;
  const output = usage.output_tokens ?? 0;
  return {
    durationMs: result.duration_ms ?? 0,
    costUsd: result.total_cost_usd ?? 0,
    inputTokens: input,
    outputTokens: output,
    cacheReadTokens: usage.cache_read_input_tokens ?? 0,
    cacheCreationTokens: usage.cache_creation_input_tokens ?? 0,
    totalTokens: input + output,
    numTurns: result.num_turns ?? 0,
  };
};
