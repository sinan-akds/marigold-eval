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
const validatePkg = evals.defaults.validatePackage;
const themePath = evals.defaults.themePath;
const scoreTimeoutMs = evals.defaults.scoreTimeoutMs;

let updated = 0;
let failed = 0;

for (const run of bm.runs) {
  const sourceFile = run.sourceFile ? path.join(ROOT, run.sourceFile) : null;
  if (!sourceFile || !fs.existsSync(sourceFile)) {
    console.log(`SKIP ${run.evalId}/${run.model}-${run.config}/run-${run.runNumber} — no source file`);
    failed++;
    continue;
  }

  const runId = runComboId(run);
  const outputDir = path.join(RESULTS_DIR, `${run.model}-${run.config}`, run.evalId, `run-${run.runNumber}`);

  const scoreResult = runScore(sourceFile, {
    evalId: run.evalId,
    model: run.model,
    config: run.config,
    runId,
    outputDir: RESULTS_DIR,
    validatePackage: validatePkg,
    themePath,
    scoreTimeoutMs,
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

console.log(`\nDone: ${updated} re-scored, ${failed} failed/skipped`);
console.log(`Summaries: ${bm.summaries.length} groups`);
