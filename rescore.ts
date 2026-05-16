#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, BENCHMARK_PATH, EVALS_PATH, RESULTS_DIR } from './src/paths';
import { recomputeSummaries, saveBenchmark } from './src/benchmark';
import { runScore } from './src/scoring';
import type { BenchmarkFile } from './src/types';

const bm = JSON.parse(fs.readFileSync(BENCHMARK_PATH, 'utf-8')) as BenchmarkFile;
const evals = JSON.parse(fs.readFileSync(EVALS_PATH, 'utf-8'));
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

  const runId = `${run.model}-${run.config}-${run.evalId}-r${run.runNumber}`;
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

  const oldScore = run.score;
  const oldAssertions = run.assertionPassRate;
  run.score = scoreResult.score;
  run.assertionPassRate = scoreResult.assertionPassRate;

  if (run.efficiency) {
    run.efficiency.totalTokens = run.efficiency.inputTokens + run.efficiency.outputTokens;
  }

  const scoredResultPath = path.join(RESULTS_DIR, 'runs', runId, run.evalId, 'result.json');
  try {
    const scored = JSON.parse(fs.readFileSync(scoredResultPath, 'utf-8'));
    if (run.efficiency) scored.efficiency = run.efficiency;
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'result.json'), JSON.stringify(scored, null, 2) + '\n');

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
