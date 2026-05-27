import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, RESULTS_DIR } from './paths';
import { log } from './log';
import { emptyBenchmark, saveBenchmark } from './benchmark';
import { silentExec, silentRm } from './utils';
import { resetMainTestApp } from './worktree';
import type { EvalsConfig } from './types';

export const cleanAll = (config: EvalsConfig) => {
  const appDir = config.defaults.projectDir;
  log('Cleaning up ALL previous run data...\n');

  saveBenchmark(emptyBenchmark());
  log('  benchmark.json reset\n');

  if (fs.existsSync(RESULTS_DIR)) {
    for (const entry of fs.readdirSync(RESULTS_DIR)) {
      const full = path.join(RESULTS_DIR, entry);
      if (entry === 'node_modules') continue;
      silentRm(full);
    }
  }
  log('  results/ cleaned\n');

  for (const entry of fs.readdirSync(ROOT)) {
    if (/^(worktree-|\.pw-data-|\.mcp-run-|\.system-prompt-)/.test(entry)) {
      silentRm(path.join(ROOT, entry));
    }
  }
  log('  temp files cleaned\n');

  silentExec('git', ['worktree', 'prune'], appDir);
  const models = config.defaults.models.join('|');
  const configs = config.defaults.configs.join('|');
  const evalBranchPattern = new RegExp(`^eval/(${models})-(${configs})-\\S+-r\\d+$`);
  try {
    const branches = execFileSync('git', ['branch', '--list', 'eval/*'], { cwd: appDir, stdio: 'pipe' })
      .toString().trim().split('\n').map(b => b.trim()).filter(Boolean);
    let pruned = 0;
    for (const branch of branches) {
      if (evalBranchPattern.test(branch)) {
        silentExec('git', ['branch', '-D', branch], appDir);
        pruned++;
      }
    }
    if (pruned) log(`  ${pruned} eval branches deleted\n`);
  } catch { /* ok */ }

  resetMainTestApp(appDir, config.defaults.targetFile);
  log('  TestApp.tsx reset\n');
  log('Clean.\n\n');
};
