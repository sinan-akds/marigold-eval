import fs from 'node:fs';
import path from 'node:path';
import { BENCHMARK_PATH } from './paths';
import { log } from './log';
import type { BenchmarkFile, BenchmarkRun } from './types';

const BACKUP_PATH = BENCHMARK_PATH + '.bak';

const emptyBenchmark = (): BenchmarkFile => ({
  version: 1, runs: [], summaries: [], lastUpdated: '',
});

export const loadBenchmark = (): BenchmarkFile => {
  if (!fs.existsSync(BENCHMARK_PATH)) return emptyBenchmark();

  try {
    return JSON.parse(fs.readFileSync(BENCHMARK_PATH, 'utf-8')) as BenchmarkFile;
  } catch {
    log('Warning: benchmark.json is corrupt, trying backup...\n');
    try {
      if (fs.existsSync(BACKUP_PATH)) {
        return JSON.parse(fs.readFileSync(BACKUP_PATH, 'utf-8')) as BenchmarkFile;
      }
    } catch { /* backup also corrupt */ }
    log('Warning: no usable benchmark found, starting fresh.\n');
    return emptyBenchmark();
  }
};

export const saveBenchmark = (bm: BenchmarkFile) => {
  bm.lastUpdated = new Date().toISOString();
  const data = JSON.stringify(bm, null, 2) + '\n';
  const tmpPath = BENCHMARK_PATH + '.tmp';
  fs.writeFileSync(tmpPath, data);
  if (fs.existsSync(BENCHMARK_PATH)) {
    fs.copyFileSync(BENCHMARK_PATH, BACKUP_PATH);
  }
  fs.renameSync(tmpPath, BENCHMARK_PATH);
};

export const comboId = (model: string, config: string, evalId: string, run: number) =>
  `${model}-${config}-${evalId}-r${run}`;

export const isCompleted = (bm: BenchmarkFile, id: string): boolean =>
  bm.runs.some(r => comboId(r.model, r.config, r.evalId, r.runNumber) === id && !r.error);

export const avgOf = (nums: number[]): number =>
  nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

export const recomputeSummaries = (bm: BenchmarkFile) => {
  const groups = new Map<string, BenchmarkRun[]>();
  for (const run of bm.runs) {
    const key = `${run.evalId}::${run.model}::${run.config}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(run);
  }

  bm.summaries = [];
  for (const [, runs] of groups) {
    const first = runs[0];
    const completed = runs.filter(r => !r.error);
    const scores = completed.map(r => r.score).filter((s): s is number => s !== null);
    const passRates = completed.map(r => r.assertionPassRate).filter((p): p is number => p !== null);

    bm.summaries.push({
      evalId: first.evalId,
      model: first.model,
      config: first.config,
      avgScore: scores.length > 0 ? Math.round(avgOf(scores) * 100) / 100 : null,
      avgAssertionPassRate: passRates.length > 0 ? Math.round(avgOf(passRates) * 10000) / 10000 : null,
      runs: runs.length,
      completed: completed.length,
      failed: runs.filter(r => !!r.error).length,
    });
  }
};

export const addRun = (bm: BenchmarkFile, run: BenchmarkRun) => {
  const id = comboId(run.model, run.config, run.evalId, run.runNumber);
  bm.runs = bm.runs.filter(r => comboId(r.model, r.config, r.evalId, r.runNumber) !== id);
  bm.runs.push(run);
  recomputeSummaries(bm);
  saveBenchmark(bm);
};
