import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT } from './paths';
import type { ClaudeOutput, Combination, EvalsConfig } from './types';

const DEV_SERVER_PORT_BASE = 5173;

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
  fs.writeFileSync(tmpPromptFile, systemPrompt);

  return [
    '-p', promptText,
    '--model', combo.model,
    '--output-format', 'json',
    '--dangerously-skip-permissions',
    '--disable-slash-commands',
    '--strict-mcp-config', '--mcp-config', mcpConfigPath,
    '--append-system-prompt-file', tmpPromptFile,
    '--no-session-persistence',
  ];
};

export const runClaude = (args: string[], cwd: string, timeoutMs = 300_000): Promise<ClaudeOutput> => {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
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

    child.stdout.on('data', (chunk: Buffer) => { stdout += chunk; });
    child.stderr.on('data', (chunk: Buffer) => { stderr += chunk; });

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
      const output = parsed ?? { result: stdout, session_id: null };
      output._stderr = stderr;
      resolve(output);
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
};
