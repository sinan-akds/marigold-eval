#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, EVALS_PATH, RESULTS_DIR } from './src/paths';
import { loadBenchmark, recomputeSummaries, saveBenchmark, runComboId } from './src/benchmark';
import { runScore } from './src/scoring';
import { extractRunDetail } from './src/result-parsing';
import type { EvalsConfig } from './src/types';

const bm = loadBenchmark();
const evals = JSON.parse(fs.readFileSync(EVALS_PATH, 'utf-8')) as EvalsConfig;
// Honour the same env overrides as the runner (main.ts) so rescoring works
// inside the container, where the toolchain lives at baked-in paths.
const validatePkg = process.env.MARIGOLD_VALIDATE_PKG ?? evals.defaults.validatePackage;
const themePath = process.env.MARIGOLD_THEME_PATH ?? evals.defaults.themePath;
const scoreTimeoutMs = evals.defaults.scoreTimeoutMs;
const projectDir = process.env.MARIGOLD_PROJECT_DIR ?? evals.defaults.projectDir;
const targetFile = evals.defaults.targetFile;

// F3: rescoring must render inside a node_modules-bearing project dir, exactly
// like the live runner, or the browser-driven B/D (spatial/a11y) categories
// collapse to zero and the rescored numbers are not comparable to live numbers.
// If the project dir is unavailable or not a git repo, we REFUSE to overwrite
// scores rather than silently zeroing them.
const projectTarget = path.join(projectDir, targetFile);
const isGitRepo = fs.existsSync(path.join(projectDir, '.git'));
const canRender = fs.existsSync(projectDir)
  && fs.existsSync(path.join(projectDir, 'node_modules'))
  && isGitRepo;

if (!canRender) {
  console.error(
    `ABORT: cannot render-rescore. projectDir=${projectDir} must exist, be a git repo, ` +
    `and have node_modules. Refusing to overwrite scores (would zero B/D categories).`
  );
  process.exit(1);
}

// Snapshot the original target so we can restore it no matter what happens.
const hadOriginalTarget = fs.existsSync(projectTarget);
const originalTarget = hadOriginalTarget ? fs.readFileSync(projectTarget, 'utf-8') : null;

const restoreTarget = () => {
  try {
    if (originalTarget !== null) {
      fs.writeFileSync(projectTarget, originalTarget);
    } else if (fs.existsSync(projectTarget)) {
      fs.rmSync(projectTarget);
    }
  } catch (err) {
    console.error(`WARNING: failed to restore ${projectTarget}: ${err instanceof Error ? err.message : err}`);
  }
};

// Always restore the project tree, even on crash / Ctrl-C.
process.on('exit', restoreTarget);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

let updated = 0;
let failed = 0;

// Optional: restrict rescoring to a single prompt (e.g. RESCORE_ONLY_PROMPT=P-05)
// so a targeted tool fix only re-renders the affected runs and leaves every
// other (clean) run byte-identical. No-op when the env var is unset.
const onlyPrompt = process.env.RESCORE_ONLY_PROMPT;

try {
  for (const run of bm.runs) {
    if (onlyPrompt && run.evalId !== onlyPrompt) continue;
    const sourceFile = run.sourceFile ? path.join(ROOT, run.sourceFile) : null;
    if (!sourceFile || !fs.existsSync(sourceFile)) {
      console.log(`SKIP ${run.evalId}/${run.model}-${run.config}/run-${run.runNumber} — no source file`);
      failed++;
      continue;
    }

    const runId = runComboId(run);
    const outputDir = path.join(RESULTS_DIR, `${run.model}-${run.config}`, run.evalId, `run-${run.runNumber}`);

    // Render inside the project dir (which has node_modules), exactly like the
    // live eval: copy the saved source into projectDir/src/TestApp.tsx and score
    // there. The finally-block + process exit hook restore the original target.
    fs.copyFileSync(sourceFile, projectTarget);

    const scoreResult = runScore(projectTarget, {
      evalId: run.evalId,
      model: run.model,
      config: run.config,
      runId,
      outputDir: RESULTS_DIR,
      validatePackage: validatePkg,
      themePath,
      scoreTimeoutMs,
      resolvedModelId: run.resolvedModelId,
      claudeCliVersion: run.claudeCliVersion ?? null,
    });

    if (scoreResult.error || scoreResult.score === null) {
      const reason = scoreResult.error ?? 'score returned null';
      console.log(`SCORE_FAIL ${runId.padEnd(30)} ${reason} — keeping old score ${run.score}`);
      failed++;
      continue;
    }

    const oldScore = run.score;
    const oldAssertions = run.assertionPassRate;

    if (run.efficiency) {
      run.efficiency.totalTokens = run.efficiency.inputTokens + run.efficiency.outputTokens;
    }

    const scoredResultPath = path.join(RESULTS_DIR, 'runs', runId, run.evalId, 'result.json');
    try {
      const scored: Record<string, unknown> = JSON.parse(fs.readFileSync(scoredResultPath, 'utf-8'));
      if (run.efficiency) scored.efficiency = run.efficiency;

      const existingResultPath = path.join(outputDir, 'result.json');
      if (fs.existsSync(existingResultPath)) {
        try {
          const existing: Record<string, unknown> = JSON.parse(fs.readFileSync(existingResultPath, 'utf-8'));
          if (existing.sessionId) scored.sessionId = existing.sessionId;
          if (existing.timestamp) scored.timestamp = existing.timestamp;
        } catch { /* ok */ }
      }

      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(existingResultPath, JSON.stringify(scored, null, 2) + '\n');

      run.score = scoreResult.score;
      run.assertionPassRate = scoreResult.assertionPassRate;
      delete run.error;
      run.detail = extractRunDetail(scored);

      const scoreChange = oldScore !== run.score ? ` (was ${oldScore})` : '';
      const assertChange = oldAssertions !== run.assertionPassRate ? ` (was ${oldAssertions})` : '';
      console.log(`OK   ${runId.padEnd(30)} score: ${run.score}${scoreChange}  assertions: ${run.assertionPassRate}${assertChange}`);
      updated++;
    } catch (err) {
      console.log(`FAIL ${runId.padEnd(30)} ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  recomputeSummaries(bm);
  saveBenchmark(bm);
} finally {
  restoreTarget();
}

console.log(`\nDone: ${updated} re-scored, ${failed} failed/skipped`);
console.log(`Summaries: ${bm.summaries.length} groups`);
