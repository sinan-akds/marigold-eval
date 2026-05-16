import fs from 'node:fs';
import { execSync } from 'node:child_process';

export const silentExec = (cmd: string, cwd: string) => {
  try { execSync(cmd, { cwd, stdio: 'pipe' }); } catch { /* ok */ }
};

export const silentRm = (target: string) => {
  try { fs.rmSync(target, { recursive: true, force: true }); } catch { /* ok */ }
};

export const silentUnlink = (target: string) => {
  try { fs.unlinkSync(target); } catch { /* ok */ }
};
