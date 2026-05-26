import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT, DEV_SERVER_PORT_BASE } from './paths';
import type { ClaudeOutput, Combination, EvalsConfig } from './types';

export class ClaudeTimeoutError extends Error {
  stderr: string;
  constructor(timeoutMs: number, stderr: string) {
    super(`claude timed out after ${Math.round(timeoutMs / 1000)}s`);
    this.stderr = stderr;
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
    '--model', combo.model,
    '--output-format', 'json',
    '--dangerously-skip-permissions',
    '--append-system-prompt-file', tmpPromptFile,
  ];

  if (combo.config === 'bare') {
    args.push(
      '--disable-slash-commands',
      '--strict-mcp-config', '--mcp-config', mcpConfigPath,
    );
  } else {
    args.push('--mcp-config', mcpConfigPath);
  }

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

    const timer = setTimeout(() => {
      killed = true;
      killGroup('SIGTERM');
      setTimeout(() => killGroup('SIGKILL'), 5000);
    }, timeoutMs);

    const MAX_BUFFER = 10 * 1024 * 1024;
    child.stdout.on('data', (chunk: Buffer) => { if (stdout.length < MAX_BUFFER) stdout += chunk; });
    child.stderr.on('data', (chunk: Buffer) => { if (stderr.length < MAX_BUFFER) stderr += chunk; });

    child.on('close', (code) => {
      clearTimeout(timer);

      if (killed) {
        reject(new ClaudeTimeoutError(timeoutMs, stderr));
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
