import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const GIT_TIMEOUT_MS = 60_000;
const DEBUG = !!process.env.EVAL_DEBUG;

export const silentExec = (cmd: string, args: string[], cwd: string) => {
  try { execFileSync(cmd, args, { cwd, stdio: 'pipe', timeout: GIT_TIMEOUT_MS }); }
  catch (err) { if (DEBUG) console.error(`[silentExec] ${cmd} ${args.join(' ')}:`, err); }
};

export const silentRm = (target: string) => {
  try { fs.rmSync(target, { recursive: true, force: true }); } catch { /* ok */ }
};

export const silentUnlink = (target: string) => {
  try { fs.unlinkSync(target); } catch { /* ok */ }
};
