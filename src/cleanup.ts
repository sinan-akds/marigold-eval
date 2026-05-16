import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT, RESULTS_DIR } from './paths';
import { log } from './log';
import { saveBenchmark } from './benchmark';
import { silentExec, silentRm } from './utils';
import { resetMainTestApp } from './worktree';
import type { EvalsConfig } from './types';

export const cleanAll = (config: EvalsConfig) => {
  const appDir = config.defaults.projectDir;
  log('Cleaning up previous run data...\n');

  saveBenchmark({ version: 1, runs: [], summaries: [], lastUpdated: '' });

  silentRm(path.join(RESULTS_DIR, 'runs'));

  for (const entry of fs.readdirSync(ROOT)) {
    if (/^(worktree-|\.pw-data-|\.mcp-run-|\.system-prompt-)/.test(entry)) {
      silentRm(path.join(ROOT, entry));
    }
  }

  silentExec('git worktree prune', appDir);
  try {
    const branches = execSync('git branch --list "eval/*"', { cwd: appDir, stdio: 'pipe' })
      .toString().trim().split('\n').map(b => b.trim()).filter(Boolean);
    for (const branch of branches) {
      silentExec(`git branch -D "${branch}"`, appDir);
    }
  } catch { /* ok */ }

  resetMainTestApp(appDir, config.defaults.targetFile);
  log('Clean.\n\n');
};
