#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, RESULTS_DIR } from './src/paths';
import { recomputeSummaries, saveBenchmark } from './src/benchmark';
import { extractRunDetail } from './src/result-parsing';
import type { BenchmarkFile, BenchmarkRun } from './src/types';

const runs: BenchmarkRun[] = [];

if (!fs.existsSync(RESULTS_DIR)) {
  console.log('No results/ directory found. Nothing to rebuild.');
  process.exit(0);
}

const configDirs = fs.readdirSync(RESULTS_DIR).filter(d => {
  const p = path.join(RESULTS_DIR, d);
  return fs.statSync(p).isDirectory() && d !== 'runs' && d !== 'node_modules';
});

for (const configDir of configDirs) {
  const dashIdx = configDir.indexOf('-');
  if (dashIdx === -1) continue;
  const model = configDir.slice(0, dashIdx);
  const config = configDir.slice(dashIdx + 1);

  const evalDirs = fs.readdirSync(path.join(RESULTS_DIR, configDir)).filter(d =>
    fs.statSync(path.join(RESULTS_DIR, configDir, d)).isDirectory()
  );

  for (const evalId of evalDirs) {
    const runDirs = fs.readdirSync(path.join(RESULTS_DIR, configDir, evalId)).filter(d =>
      d.startsWith('run-') && fs.statSync(path.join(RESULTS_DIR, configDir, evalId, d)).isDirectory()
    );

    for (const runDir of runDirs) {
      const runNumber = parseInt(runDir.replace('run-', ''), 10);
      if (Number.isNaN(runNumber)) continue;

      const resultPath = path.join(RESULTS_DIR, configDir, evalId, runDir, 'result.json');
      const sourcePath = path.join(RESULTS_DIR, configDir, evalId, runDir, 'source.tsx');

      if (!fs.existsSync(resultPath)) continue;

      try {
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
        const quality = result.quality ?? {};
        const assertions = result.assertions ?? null;
        const detail = extractRunDetail(result);

        const bmRun: BenchmarkRun = {
          evalId,
          model,
          config,
          runNumber,
          timestamp: result.timestamp ?? new Date().toISOString(),
          score: quality.overall ?? null,
          assertionPassRate: assertions?.passRate ?? null,
          sessionId: result.sessionId ?? null,
          detail,
          resultFile: path.relative(ROOT, resultPath),
          sourceFile: fs.existsSync(sourcePath) ? path.relative(ROOT, sourcePath) : undefined,
          ...(result.efficiency ? { efficiency: result.efficiency } : {}),
        };

        runs.push(bmRun);
        console.log(`OK   ${model}-${config}-${evalId}-r${runNumber}`.padEnd(40) + `score: ${bmRun.score}  assertions: ${bmRun.assertionPassRate}`);
      } catch (err) {
        console.log(`FAIL ${model}-${config}-${evalId}-r${runNumber}`.padEnd(40) + `${err}`);
      }
    }
  }
}

const bm: BenchmarkFile = {
  version: 1,
  runs,
  summaries: [],
  lastUpdated: '',
};

recomputeSummaries(bm);
saveBenchmark(bm);
console.log(`\nRebuilt benchmark.json: ${runs.length} runs, ${bm.summaries.length} summary groups`);
