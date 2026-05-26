#!/usr/bin/env tsx

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, RESULTS_DIR, BENCHMARK_PATH } from './src/paths';
import { avgOf, saveBenchmark } from './src/benchmark';
import type { BenchmarkFile, BenchmarkRun, BenchmarkSummary, RunDetail } from './src/types';

const runs: BenchmarkRun[] = [];

const configDirs = fs.readdirSync(RESULTS_DIR).filter(d => {
  const p = path.join(RESULTS_DIR, d);
  return fs.statSync(p).isDirectory() && d !== 'runs';
});

for (const configDir of configDirs) {
  const parts = configDir.split('-');
  const model = parts[0];
  const config = parts.slice(1).join('-');

  const evalDirs = fs.readdirSync(path.join(RESULTS_DIR, configDir)).filter(d =>
    fs.statSync(path.join(RESULTS_DIR, configDir, d)).isDirectory()
  );

  for (const evalId of evalDirs) {
    const runDirs = fs.readdirSync(path.join(RESULTS_DIR, configDir, evalId)).filter(d =>
      d.startsWith('run-') && fs.statSync(path.join(RESULTS_DIR, configDir, evalId, d)).isDirectory()
    );

    for (const runDir of runDirs) {
      const runNumber = parseInt(runDir.replace('run-', ''), 10);
      const resultPath = path.join(RESULTS_DIR, configDir, evalId, runDir, 'result.json');
      const sourcePath = path.join(RESULTS_DIR, configDir, evalId, runDir, 'source.tsx');

      if (!fs.existsSync(resultPath)) continue;

      try {
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
        const quality = result.quality ?? {};
        const assertions = result.assertions ?? null;

        const report = result.report ?? {};
        const metadata = report.metadata ?? {};
        const categories = quality.categories ?? {};
        const sourceCode = result.sourceCode ?? '';

        const catScores: Record<string, { score: number; errorCount: number; warningCount: number }> = {};
        for (const [key, cat] of Object.entries(categories) as [string, Record<string, unknown>][]) {
          catScores[key] = {
            score: (cat.score as number) ?? 0,
            errorCount: (cat.errorCount as number) ?? 0,
            warningCount: (cat.warningCount as number) ?? 0,
          };
        }

        const issueSources: Record<string, number> = {};
        for (const issue of [...(report.errors ?? []), ...(report.warnings ?? [])]) {
          const src = issue.source ?? 'unknown';
          issueSources[src] = (issueSources[src] ?? 0) + 1;
        }

        const detail: RunDetail = {
          categories: Object.keys(catScores).length > 0 ? catScores : undefined,
          renderSuccess: quality.renderSuccess ?? undefined,
          renderTimeMs: result.renderTimeMs ?? metadata.renderTimeMs ?? undefined,
          componentsFound: result.componentsFound ?? metadata.componentsFound ?? undefined,
          issueSources: Object.keys(issueSources).length > 0 ? issueSources : undefined,
          linesOfCode: sourceCode ? sourceCode.split('\n').length : undefined,
          assertionsPassed: (assertions?.passed ?? []).length || undefined,
          assertionsFailed: (assertions?.failed ?? []).length || undefined,
        };

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
        };

        if (result.efficiency) {
          bmRun.efficiency = result.efficiency;
        }

        runs.push(bmRun);
        console.log(`OK   ${model}-${config}-${evalId}-r${runNumber}`.padEnd(40) + `score: ${bmRun.score}  assertions: ${bmRun.assertionPassRate}`);
      } catch (err) {
        console.log(`FAIL ${model}-${config}-${evalId}-r${runNumber}`.padEnd(40) + `${err}`);
      }
    }
  }
}

const groups = new Map<string, BenchmarkRun[]>();
for (const run of runs) {
  const key = `${run.evalId}::${run.model}::${run.config}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key)!.push(run);
}

const summaries: BenchmarkSummary[] = [];
for (const [, grp] of groups) {
  const completed = grp.filter(r => !r.error);
  const scores = completed.map(r => r.score).filter((s): s is number => s != null);
  const assertRates = completed.map(r => r.assertionPassRate).filter((s): s is number => s != null);
  summaries.push({
    evalId: grp[0].evalId,
    model: grp[0].model,
    config: grp[0].config,
    avgScore: scores.length > 0 ? Math.round(avgOf(scores) * 100) / 100 : null,
    avgAssertionPassRate: assertRates.length > 0 ? Math.round(avgOf(assertRates) * 10000) / 10000 : null,
    runs: grp.length,
    completed: completed.length,
    failed: grp.filter(r => !!r.error).length,
  });
}

const bm: BenchmarkFile = {
  version: 1,
  runs,
  summaries,
  lastUpdated: '',
};

saveBenchmark(bm);
console.log(`\nRebuilt benchmark.json: ${runs.length} runs, ${summaries.length} summary groups`);
