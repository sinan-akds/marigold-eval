import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const EVALS_PATH = path.join(ROOT, 'evals.json');
export const BENCHMARK_PATH = path.join(ROOT, 'benchmark.json');
export const RESULTS_DIR = path.join(ROOT, 'results');
export const DEV_SERVER_PORT_BASE = 5173;
