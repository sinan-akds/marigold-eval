import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { ROOT, DEV_SERVER_PORT_BASE, KILL_GRACE_MS } from './paths';
import type { ClaudeOutput, Combination, EvalsConfig } from './types';

// each run gets a fresh, empty CLAUDE_CONFIG_DIR so no ambient state leaks in. only the auth token is copied
export const prepareConfigDir = (comboId: string): string => {
  // CLAUDE_CONFIG_BASE puts the config dir on a persistent path for inspection, defaults to the temp dir
  const base = process.env.CLAUDE_CONFIG_BASE || os.tmpdir();
  const dir = path.join(base, `cc-eval-cfg-${comboId}-${process.pid}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const credSrc =
    process.env.CLAUDE_CREDENTIALS_SRC ??
    path.join(os.homedir(), '.claude', '.credentials.json');
  if (fs.existsSync(credSrc)) {
    fs.copyFileSync(credSrc, path.join(dir, '.credentials.json'));
  }
  return dir;
};

export const cleanupConfigDir = (dir: string | undefined): void => {
  if (!dir || process.env.KEEP_CONFIG_DIR) return;
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    /* best effort */
  }
};

// resolve the model alias to the pinned model id, fall back to the alias
export const resolveModelId = (combo: Combination, config: EvalsConfig): string =>
  config.defaults.modelIds?.[combo.model] ?? combo.model;

let cachedCliVersion: string | null | undefined;

// capture `claude --version` once for the run record, null if the CLI is missing
export const getClaudeCliVersion = (): string | null => {
  if (cachedCliVersion !== undefined) return cachedCliVersion;
  try {
    cachedCliVersion = execFileSync('claude', ['--version'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30_000,
    }).toString().trim();
  } catch {
    cachedCliVersion = null;
  }
  return cachedCliVersion;
};

export class ClaudeTimeoutError extends Error {
  stderr: string;
  stdout: string;
  constructor(timeoutMs: number, stderr: string, stdout: string) {
    super(`claude timed out after ${Math.round(timeoutMs / 1000)}s`);
    this.stderr = stderr;
    this.stdout = stdout;
  }
}

export const buildClaudeArgs = (
  combo: Combination,
  config: EvalsConfig,
  wtPath: string,
  mcpOverride: string | null,
  workerIndex: number
): string[] => {
  const d = config.defaults;
  const promptText = fs.readFileSync(path.join(ROOT, combo.evalDef.promptFile), 'utf-8');
  const configPromptFile = path.join(ROOT, 'configs', `${combo.config}.md`);
  const mcpConfigPath = mcpOverride ?? path.join(ROOT, 'configs', `${combo.config}-mcp.json`);

  const port = DEV_SERVER_PORT_BASE + workerIndex;
  let systemPrompt = fs.readFileSync(configPromptFile, 'utf-8');
  systemPrompt = systemPrompt.replace(/localhost:5173/g, `localhost:${port}`);
  systemPrompt = systemPrompt.replace(/pnpm dev\b/g, `pnpm dev --port ${port}`);

  const targetAbsolute = path.join(wtPath, d.targetFile);
  systemPrompt += `\n\nIMPORTANT: Your working directory is ${wtPath}. Write all files there. The target file is ${targetAbsolute}. Do not write to any other directory.\n`;

  if (combo.config !== 'bare') {
    systemPrompt += `Start the dev server in the background: pnpm dev --port ${port} &\n`;
    systemPrompt += `Wait a moment for it to start, then navigate to http://localhost:${port} with Playwright to verify your work.\n`;
  }

  const tmpPromptFile = path.join(ROOT, `.system-prompt-${combo.id}.md`);
  fs.writeFileSync(tmpPromptFile, systemPrompt, { flush: true });
  if (!fs.existsSync(tmpPromptFile)) {
    throw new Error(`Failed to write system prompt file: ${tmpPromptFile}`);
  }

  const args = [
    '-p', promptText,
    '--model', resolveModelId(combo, config),
    '--output-format', 'json',
    '--dangerously-skip-permissions',
    '--append-system-prompt-file', tmpPromptFile,
  ];

  // all tiers run isolated from ambient MCP servers with the tier's own --mcp-config
  args.push(
    '--disable-slash-commands',
    // load only the per-run project settings (tier hooks), never user or local settings
    '--setting-sources', 'project',
    '--strict-mcp-config', '--mcp-config', mcpConfigPath,
  );

  return args;
};

export const runClaude = (args: string[], cwd: string, timeoutMs = 300_000, extraEnv: Record<string, string> = {}): Promise<ClaudeOutput> => {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...extraEnv },
      detached: true,
    });

    let stdout = '';
    let stderr = '';
    let killed = false;

    const killGroup = (signal: NodeJS.Signals) => {
      try {
        if (child.pid) process.kill(-child.pid, signal);
      } catch {
        try { child.kill(signal); } catch { /* already dead */ }
      }
    };

    let killTimer: NodeJS.Timeout | undefined;
    const timer = setTimeout(() => {
      killed = true;
      killGroup('SIGTERM');
      killTimer = setTimeout(() => killGroup('SIGKILL'), KILL_GRACE_MS);
    }, timeoutMs);

    const MAX_BUFFER = 10 * 1024 * 1024;
    child.stdout.on('data', (chunk: Buffer) => { if (stdout.length < MAX_BUFFER) stdout += chunk; });
    child.stderr.on('data', (chunk: Buffer) => { if (stderr.length < MAX_BUFFER) stderr += chunk; });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);

      if (killed) {
        reject(new ClaudeTimeoutError(timeoutMs, stderr, stdout));
        return;
      }

      let parsed: ClaudeOutput | undefined;
      try { parsed = JSON.parse(stdout); } catch { /* ignore */ }

      if (parsed?.is_error) {
        reject(new Error(`claude error: ${parsed.result ?? parsed.error ?? JSON.stringify(parsed).slice(0, 300)}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`claude exited with code ${code}: ${(stderr || stdout).slice(0, 2000)}`));
        return;
      }
      if (!parsed) {
        reject(new Error(`claude produced non-JSON stdout (${stdout.length} bytes): ${stdout.slice(0, 500)}`));
        return;
      }
      parsed._stderr = stderr;
      resolve(parsed);
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
};
