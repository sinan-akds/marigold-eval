import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { WORKTREE_BASE } from './paths';
import { log } from './log';
import { silentExec, silentRm } from './utils';

export const EMPTY_TEST_APP = 'export default () => null;\n';

export const STUB_CONTENT = [
  'const TestApp = () => {',
  '  return <div>TODO</div>;',
  '};',
  '',
  'export default TestApp;',
  '',
].join('\n');

export const resetMainTestApp = (appDir: string, targetFile: string) => {
  fs.writeFileSync(path.join(appDir, targetFile), EMPTY_TEST_APP);
};

export const createWorktree = (id: string, appDir: string): string => {
  const wtPath = path.join(WORKTREE_BASE, `worktree-${id}`);
  const branch = `eval/${id}`;

  silentExec('git', ['worktree', 'remove', wtPath, '--force'], appDir);
  silentRm(wtPath);
  silentExec('git', ['worktree', 'prune'], appDir);
  silentExec('git', ['branch', '-D', branch], appDir);

  execFileSync('git', ['worktree', 'add', wtPath, '-b', branch], { cwd: appDir, stdio: 'pipe', timeout: 60_000 });

  const mainNm = path.join(appDir, 'node_modules');
  const wtNm = path.join(wtPath, 'node_modules');
  if (fs.existsSync(mainNm) && !fs.existsSync(wtNm)) {
    fs.symlinkSync(mainNm, wtNm, 'junction');
  }

  return wtPath;
};

/**
 * Kill leftover Chromium/headless-shell processes after a run. Playwright (MCP
 * for the agent, and the validate render harness for scoring) can leave browser
 * processes alive if a run is killed mid-flight; over 180 runs these accumulate
 * and exhaust RAM, leading to an OOM kill. Safe inside the container, where the
 * only Chromium processes belong to the eval itself. Best-effort.
 */
export const killStrayBrowsers = () => {
  for (const pat of ['headless_shell', 'chrome-headless', 'chromium', 'ms-playwright']) {
    try {
      execFileSync('pkill', ['-9', '-f', pat], { stdio: 'ignore', timeout: 10_000 });
    } catch { /* no match → pkill exits non-zero; fine */ }
  }
};

export const killDevServerOnPort = (port: number) => {
  try {
    const pids = execFileSync('lsof', ['-ti', `:${port}`], {
      stdio: 'pipe',
    }).toString().trim();
    if (pids) {
      for (const pid of pids.split('\n').filter(Boolean)) {
        try { process.kill(Number(pid), 'SIGKILL'); } catch { /* already dead */ }
      }
    }
  } catch { /* ok — lsof exits non-zero when no matches */ }
};

export const removeWorktree = (id: string, appDir: string) => {
  const wtPath = path.join(WORKTREE_BASE, `worktree-${id}`);
  const branch = `eval/${id}`;
  const nmLink = path.join(wtPath, 'node_modules');

  try {
    if (fs.lstatSync(nmLink).isSymbolicLink()) {
      fs.unlinkSync(nmLink);
    }
  } catch { /* symlink already gone or never created */ }

  const nmStillExists = (() => {
    try { return fs.lstatSync(nmLink).isSymbolicLink(); }
    catch { return false; }
  })();

  if (nmStillExists) {
    log(`WARNING: could not unlink node_modules symlink at ${nmLink}; skipping worktree removal to prevent data loss.\n`);
    return;
  }

  silentExec('git', ['worktree', 'remove', wtPath, '--force'], appDir);
  silentRm(wtPath);
  silentExec('git', ['worktree', 'prune'], appDir);
  silentExec('git', ['branch', '-D', branch], appDir);
};
