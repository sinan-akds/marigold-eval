import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT } from './paths';
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
  const wtPath = path.join(ROOT, `worktree-${id}`);
  const branch = `eval/${id}`;

  silentExec(`git worktree remove "${wtPath}" --force`, appDir);
  silentRm(wtPath);
  silentExec('git worktree prune', appDir);
  silentExec(`git branch -D "${branch}"`, appDir);

  execSync(`git worktree add "${wtPath}" -b "${branch}"`, { cwd: appDir, stdio: 'pipe' });

  const mainNm = path.join(appDir, 'node_modules');
  const wtNm = path.join(wtPath, 'node_modules');
  if (fs.existsSync(mainNm) && !fs.existsSync(wtNm)) {
    fs.symlinkSync(mainNm, wtNm, 'junction');
  }

  return wtPath;
};

export const killDevServerOnPort = (port: number) => {
  try {
    const pids = execSync(
      `lsof -ti :${port} 2>/dev/null || true`,
      { stdio: 'pipe' }
    ).toString().trim();
    if (pids) {
      for (const pid of pids.split('\n').filter(Boolean)) {
        try { process.kill(Number(pid), 'SIGKILL'); } catch { /* already dead */ }
      }
    }
  } catch { /* ok */ }
};

export const removeWorktree = (id: string, appDir: string) => {
  const wtPath = path.join(ROOT, `worktree-${id}`);
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

  silentExec(`git worktree remove "${wtPath}" --force`, appDir);
  silentRm(wtPath);
  silentExec('git worktree prune', appDir);
  silentExec(`git branch -D "${branch}"`, appDir);
};
