import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { BenchmarkFile, BenchmarkRun } from '../types';

vi.mock('node:fs', () => ({
  default: {
    existsSync: () => false,
    writeFileSync: () => {},
    readFileSync: () => '{}',
    renameSync: () => {},
    copyFileSync: () => {},
  },
}));

const makeRun = (overrides: Partial<BenchmarkRun> = {}): BenchmarkRun => ({
  evalId: 'P-01',
  model: 'haiku',
  config: 'bare',
  runNumber: 1,
  timestamp: new Date().toISOString(),
  score: 72,
  assertionPassRate: 0.85,
  sessionId: null,
  ...overrides,
});

const emptyBm = (): BenchmarkFile => ({
  version: 1,
  runs: [],
  summaries: [],
  lastUpdated: '',
});

describe('addRun', () => {
  let addRun: typeof import('../benchmark').addRun;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../benchmark');
    addRun = mod.addRun;
  });

  it('appends a new run', () => {
    const bm = emptyBm();
    addRun(bm, makeRun());
    expect(bm.runs).toHaveLength(1);
  });

  it('KEEPS a prior failed attempt as a distinct record when retried (no survivorship bias)', () => {
    const bm = emptyBm();
    const failed = makeRun({ score: null, error: 'timeout' });
    const retriedFail = makeRun({ score: null, error: 'timeout again' });

    addRun(bm, failed);
    expect(bm.runs).toHaveLength(1);
    expect(bm.runs[0].error).toBe('timeout');
    expect(bm.runs[0].attempt).toBe(1);

    // A second failure for the SAME identity is appended, not overwritten.
    addRun(bm, retriedFail);
    expect(bm.runs).toHaveLength(2);
    expect(bm.runs[1].error).toBe('timeout again');
    expect(bm.runs[1].attempt).toBe(2);
  });

  it('a successful retry supersedes prior failed attempts (one row per converged identity)', () => {
    const bm = emptyBm();
    addRun(bm, makeRun({ score: null, error: 'timeout' }));
    addRun(bm, makeRun({ score: 65 }));

    expect(bm.runs).toHaveLength(1);
    expect(bm.runs[0].score).toBe(65);
    expect(bm.runs[0].error).toBeUndefined();
  });

  it('preserves the TRUE attempt number on a success-after-retry (not first-try)', () => {
    const bm = emptyBm();
    addRun(bm, makeRun({ score: null, error: 'timeout' })); // attempt 1 (failed)
    addRun(bm, makeRun({ score: 65 }));                      // attempt 2 (succeeded)

    expect(bm.runs).toHaveLength(1);
    expect(bm.runs[0].attempt).toBe(2);
    // The summary must reflect that it took 2 attempts, not 1.
    expect(bm.summaries[0].attempts).toBe(2);
    expect(bm.summaries[0].completed).toBe(1);
    expect(bm.summaries[0].failed).toBe(0);
  });

  it('does not replace runs with different identity', () => {
    const bm = emptyBm();
    addRun(bm, makeRun({ runNumber: 1 }));
    addRun(bm, makeRun({ runNumber: 2 }));
    expect(bm.runs).toHaveLength(2);
  });
});

describe('isCompleted', () => {
  let isCompleted: typeof import('../benchmark').isCompleted;
  let comboId: typeof import('../benchmark').comboId;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../benchmark');
    isCompleted = mod.isCompleted;
    comboId = mod.comboId;
  });

  const id = () => comboId('haiku', 'bare', 'P-01', 1);

  it('is true once there is a successful run', () => {
    const bm = emptyBm();
    bm.runs = [makeRun({ score: 70 })];
    expect(isCompleted(bm, id(), 2)).toBe(true);
  });

  it('is false while failures remain under the attempt budget', () => {
    const bm = emptyBm();
    bm.runs = [makeRun({ score: null, error: 'timeout' })];
    expect(isCompleted(bm, id(), 2)).toBe(false);
  });

  it('is true once the attempt budget is reached (bounded retry)', () => {
    const bm = emptyBm();
    bm.runs = [
      makeRun({ score: null, error: 'timeout' }),
      makeRun({ score: null, error: 'timeout again' }),
    ];
    expect(isCompleted(bm, id(), 2)).toBe(true);
  });
});

describe('recomputeSummaries attempts honesty', () => {
  let recomputeSummaries: typeof import('../benchmark').recomputeSummaries;

  beforeEach(async () => {
    vi.resetModules();
    recomputeSummaries = (await import('../benchmark')).recomputeSummaries;
  });

  it('a clean first-try success reports attempts=1 (no over-counting)', () => {
    const bm = emptyBm();
    bm.runs = [makeRun({ runNumber: 1, score: 80, attempt: 1 })];
    recomputeSummaries(bm);
    expect(bm.summaries[0].attempts).toBe(1);
    expect(bm.summaries[0].completed).toBe(1);
  });

  it('reports attempts=all records, completed=successes, failed=failures', () => {
    const bm = emptyBm();
    bm.runs = [
      makeRun({ runNumber: 1, score: 80 }),
      makeRun({ runNumber: 2, score: null, error: 'fail-a' }),
      makeRun({ runNumber: 2, score: null, error: 'fail-b' }),
    ];
    recomputeSummaries(bm);
    expect(bm.summaries).toHaveLength(1);
    expect(bm.summaries[0].attempts).toBe(3);
    expect(bm.summaries[0].runs).toBe(3);
    expect(bm.summaries[0].completed).toBe(1);
    expect(bm.summaries[0].failed).toBe(2);
    expect(bm.summaries[0].avgScore).toBe(80);
  });
});

describe('recomputeSummaries', () => {
  let recomputeSummaries: typeof import('../benchmark').recomputeSummaries;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('../benchmark');
    recomputeSummaries = mod.recomputeSummaries;
  });

  it('excludes null scores from avgScore', () => {
    const bm = emptyBm();
    bm.runs = [
      makeRun({ score: 80 }),
      makeRun({ runNumber: 2, score: null, error: 'failed' }),
      makeRun({ runNumber: 3, score: 60 }),
    ];
    recomputeSummaries(bm);
    expect(bm.summaries).toHaveLength(1);
    expect(bm.summaries[0].avgScore).toBe(70);
    expect(bm.summaries[0].completed).toBe(2);
    expect(bm.summaries[0].failed).toBe(1);
  });
});
