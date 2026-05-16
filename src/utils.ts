import fs from 'node:fs';
import { execSync } from 'node:child_process';

const GIT_TIMEOUT_MS = 60_000;

export const silentExec = (cmd: string, cwd: string) => {
  try { execSync(cmd, { cwd, stdio: 'pipe', timeout: GIT_TIMEOUT_MS }); } catch { /* ok */ }
};

export const silentRm = (target: string) => {
  try { fs.rmSync(target, { recursive: true, force: true }); } catch { /* ok */ }
};

export const silentUnlink = (target: string) => {
  try { fs.unlinkSync(target); } catch { /* ok */ }
};
