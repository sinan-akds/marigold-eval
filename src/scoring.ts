import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { EVALS_PATH, DEFAULT_SCORE_TIMEOUT_MS, SCORE_MAX_BUFFER, MAX_STDERR_SLICE } from './paths';
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

const readPackageVersion = (pkgDir: string): string | null => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
    return pkg.version ?? null;
  } catch { return null; }
};

const readPlaywrightVersion = (validatePkg: string): string | null => {
  return readPackageVersion(path.join(validatePkg, 'node_modules', '@playwright', 'test'));
};

export const runScore = (targetFile: string, opts: ScoreOpts): ScoreResult => {
  const scoreBin = path.join(opts.validatePackage, 'dist', 'bin', 'marigold-validate.mjs');

  if (!fs.existsSync(targetFile)) {
    return { score: null, assertionPassRate: null, error: 'Target file not found after claude run' };
  }

  const resultFilePath = path.join(opts.outputDir, 'runs', opts.runId, opts.evalId, 'result.json');

  const scoreArgs = [
    scoreBin, 'score', targetFile,
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
  let scoreExitInfo = '';
  try {
    execFileSync('node', scoreArgs, {
      cwd: path.dirname(targetFile),
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: opts.scoreTimeoutMs ?? DEFAULT_SCORE_TIMEOUT_MS,
      maxBuffer: SCORE_MAX_BUFFER,
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object') {
      if ('stderr' in err) scoreStderr = String((err as { stderr: unknown }).stderr).slice(0, MAX_STDERR_SLICE);
      if ('status' in err) scoreExitInfo = `exit=${(err as { status: unknown }).status}`;
      if ('signal' in err && (err as { signal: unknown }).signal) scoreExitInfo = `signal=${(err as { signal: unknown }).signal}`;
    }
  }

  try {
    const saved: Record<string, unknown> = JSON.parse(fs.readFileSync(resultFilePath, 'utf-8'));
    const quality = (saved.quality ?? {}) as Record<string, unknown>;
    const assertions = (saved.assertions ?? undefined) as Record<string, unknown> | undefined;

    saved.validatePackageVersion = readPackageVersion(opts.validatePackage);
    saved.playwrightVersion = readPlaywrightVersion(opts.validatePackage);
    fs.writeFileSync(resultFilePath, JSON.stringify(saved, null, 2) + '\n');

    const result = {
      score: (quality.overall as number) ?? null,
      assertionPassRate: (assertions?.passRate as number) ?? null,
      quality,
      assertions,
    };

    if (scoreExitInfo) {
      return { ...result, error: `Scoring process ${scoreExitInfo}${scoreStderr ? `: ${scoreStderr}` : ''}` };
    }
    return result;
  } catch {
    const parts = [scoreExitInfo, scoreStderr].filter(Boolean).join(' ');
    const detail = parts ? `: ${parts}` : '';
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
      const sorted = found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
      log(`${tag} Target not at expected path, found at: ${path.relative(wtPath, sorted[0])}\n`);
      return sorted[0];
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
