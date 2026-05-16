import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const EVALS_PATH = path.join(ROOT, 'evals.json');
export const BENCHMARK_PATH = path.join(ROOT, 'benchmark.json');
export const RESULTS_DIR = path.join(ROOT, 'results');
