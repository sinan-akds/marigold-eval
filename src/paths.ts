import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const EVALS_PATH = path.join(ROOT, 'evals.json');
export const BENCHMARK_PATH = path.join(ROOT, 'benchmark.json');
export const RESULTS_DIR = path.join(ROOT, 'results');
// per-run git worktrees. in the container these live outside the eval repo so a run cannot read other runs or tiers
export const WORKTREE_BASE = process.env.WORKTREE_BASE || ROOT;
export const DEV_SERVER_PORT_BASE = 5173;

export const DEFAULT_CLAUDE_TIMEOUT_MS = 3_600_000;
export const DEFAULT_SCORE_TIMEOUT_MS = 300_000;
export const KILL_GRACE_MS = 5_000;
export const MAX_STDERR_SLICE = 2_000;
export const SCORE_MAX_BUFFER = 50 * 1024 * 1024;
