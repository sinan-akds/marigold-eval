import fs from 'node:fs';
import path from 'node:path';
import { BENCHMARK_PATH } from './paths';
import { log } from './log';
import type { BenchmarkFile, BenchmarkRun } from './types';

const BACKUP_PATH = BENCHMARK_PATH + '.bak';

export const emptyBenchmark = (): BenchmarkFile => ({
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

export const runComboId = (r: BenchmarkRun): string =>
  comboId(r.model, r.config, r.evalId, r.runNumber);

export const DEFAULT_MAX_ATTEMPTS = 2;

/**
 * A combo identity is "completed" (should NOT be re-run) once either:
 *   - it has at least one successful (non-error) record, OR
 *   - it has reached the configured attempt budget (maxAttempts) of failures.
 *
 * This makes the retry policy EXPLICIT and bounded — failures are retried up to
 * maxAttempts, never silently forever. Failed attempts are kept as distinct
 * records (see addRun), so `n` stays honest (no survivorship bias).
 */
export const isCompleted = (
  bm: BenchmarkFile,
  id: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS
): boolean => {
  const records = bm.runs.filter(r => runComboId(r) === id);
  if (records.some(r => !r.error)) return true;
  return records.length >= maxAttempts;
};

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

    // `attempts` = true number of attempts across every combo identity in this
    // group, INCLUDING failures that a later success superseded (those rows were
    // dropped from `runs`, but the surviving success carries the real `attempt`
    // number). So a success-on-retry counts its retries; no survivorship bias.
    // `runs` stays the physical record count for backwards compatibility.
    const byIdentity = new Map<string, BenchmarkRun[]>();
    for (const r of runs) {
      const idKey = runComboId(r);
      if (!byIdentity.has(idKey)) byIdentity.set(idKey, []);
      byIdentity.get(idKey)!.push(r);
    }
    let attempts = 0;
    for (const [, identityRuns] of byIdentity) {
      const success = identityRuns.find(r => !r.error);
      attempts += success
        ? Math.max(success.attempt ?? identityRuns.length, identityRuns.length)
        : identityRuns.length;
    }

    bm.summaries.push({
      evalId: first.evalId,
      model: first.model,
      config: first.config,
      avgScore: scores.length > 0 ? Math.round(avgOf(scores) * 100) / 100 : null,
      avgAssertionPassRate: passRates.length > 0 ? Math.round(avgOf(passRates) * 10000) / 10000 : null,
      runs: runs.length,
      attempts,
      completed: completed.length,
      failed: runs.filter(r => !!r.error).length,
    });
  }
};

/**
 * Record a run for a combo identity (model-config-evalId-rN).
 *
 * Explicit, honest retry semantics:
 *   - A SUCCESS (no error) supersedes any prior records for the identity — the
 *     run has converged, so earlier failed attempts are dropped in favour of the
 *     final answer (keeps avg metrics clean, one row per completed identity).
 *   - A FAILURE is APPENDED as a distinct attempt record (never overwrites a
 *     prior attempt) so the true number of attempts is preserved (no
 *     survivorship bias). The `attempt` field counts attempts for the identity.
 */
export const addRun = (bm: BenchmarkFile, run: BenchmarkRun) => {
  const id = comboId(run.model, run.config, run.evalId, run.runNumber);
  const sameIdentity = (r: BenchmarkRun) =>
    comboId(r.model, r.config, r.evalId, r.runNumber) === id;

  if (!run.error) {
    // Success: replace all prior records for this identity, but preserve the
    // TRUE attempt number on the surviving row (prior failures + this success)
    // so a success-after-retry is not misrecorded as a first-try pass.
    const priorAttempts = bm.runs.filter(sameIdentity).length;
    bm.runs = bm.runs.filter(r => !sameIdentity(r));
    bm.runs.push({ ...run, attempt: run.attempt ?? priorAttempts + 1 });
  } else {
    // Failure: keep prior attempts, append this one with the next attempt number.
    const priorAttempts = bm.runs.filter(sameIdentity).length;
    bm.runs.push({ ...run, attempt: run.attempt ?? priorAttempts + 1 });
  }

  recomputeSummaries(bm);
  saveBenchmark(bm);
};
