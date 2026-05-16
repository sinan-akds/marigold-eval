#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, BENCHMARK_PATH, EVALS_PATH, RESULTS_DIR } from './src/paths';
import { recomputeSummaries, saveBenchmark } from './src/benchmark';
import type { BenchmarkFile } from './src/types';

const bm = JSON.parse(fs.readFileSync(BENCHMARK_PATH, 'utf-8')) as BenchmarkFile;
const evals = JSON.parse(fs.readFileSync(EVALS_PATH, 'utf-8'));
const validatePkg = evals.defaults.validatePackage;
const scoreBin = path.join(validatePkg, 'dist', 'bin', 'marigold-score.mjs');
const themePath = evals.defaults.themePath;

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

  const scoreArgs = [
    scoreBin, sourceFile,
    '--prompt-id', run.evalId,
    '--model', run.model,
    '--config', run.config,
    '--run-id', runId,
    '--output-dir', RESULTS_DIR,
    '--evals', EVALS_PATH,
    '--eval-id', run.evalId,
    ...(themePath ? ['--theme', themePath] : []),
  ];

  try {
    execFileSync('node', scoreArgs, {
      cwd: path.dirname(sourceFile),
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 300_000,
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch {
    // may still write result
  }

  const scoredResultPath = path.join(RESULTS_DIR, 'runs', runId, run.evalId, 'result.json');

  try {
    const scored = JSON.parse(fs.readFileSync(scoredResultPath, 'utf-8'));
    const oldScore = run.score;
    const newScore = scored.quality?.overall ?? null;
    const oldAssertions = run.assertionPassRate;
    const newAssertions = scored.assertions?.passRate ?? null;

    run.score = newScore;
    run.assertionPassRate = newAssertions;

    if (run.efficiency) {
      (run.efficiency as any).totalTokens = ((run.efficiency as any).inputTokens ?? 0) + ((run.efficiency as any).outputTokens ?? 0);
    }

    if (run.efficiency) {
      scored.efficiency = run.efficiency;
    }
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'result.json'), JSON.stringify(scored, null, 2) + '\n');

    const scoreChange = oldScore !== newScore ? ` (was ${oldScore})` : '';
    const assertChange = oldAssertions !== newAssertions ? ` (was ${oldAssertions})` : '';
    console.log(`OK   ${runId.padEnd(30)} score: ${newScore}${scoreChange}  assertions: ${newAssertions}${assertChange}`);
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
