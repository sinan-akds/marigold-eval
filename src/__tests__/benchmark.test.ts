import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { BenchmarkFile, BenchmarkRun } from '../types';

vi.mock('node:fs', () => ({
  default: {
    existsSync: () => false,
    writeFileSync: () => {},
    readFileSync: () => '{}',
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

  it('replaces a prior failed run with the same identity', () => {
    const bm = emptyBm();
    const failed = makeRun({ score: null, error: 'timeout' });
    const retried = makeRun({ score: 65 });

    addRun(bm, failed);
    expect(bm.runs).toHaveLength(1);
    expect(bm.runs[0].error).toBe('timeout');

    addRun(bm, retried);
    expect(bm.runs).toHaveLength(1);
    expect(bm.runs[0].score).toBe(65);
    expect(bm.runs[0].error).toBeUndefined();
  });

  it('does not replace runs with different identity', () => {
    const bm = emptyBm();
    addRun(bm, makeRun({ runNumber: 1 }));
    addRun(bm, makeRun({ runNumber: 2 }));
    expect(bm.runs).toHaveLength(2);
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
