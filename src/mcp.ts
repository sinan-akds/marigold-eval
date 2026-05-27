import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './paths';
import { silentRm, silentUnlink } from './utils';
import type { Combination } from './types';

type McpServerEntry = {
  args?: string[];
  oauth?: { callbackPort?: number };
  [key: string]: unknown;
};

type McpConfig = {
  mcpServers?: Record<string, McpServerEntry>;
  [key: string]: unknown;
};

export const createRunMcpConfig = (combo: Combination, workerIndex: number): string | null => {
  if (combo.config === 'bare') return null;

  const baseConfig: McpConfig = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'configs', `${combo.config}-mcp.json`), 'utf-8')
  );

  if (baseConfig.mcpServers?.playwright) {
    const args = [...(baseConfig.mcpServers.playwright.args ?? [])];
    args.push('--user-data-dir', path.join(ROOT, `.pw-data-${combo.id}`));
    baseConfig.mcpServers.playwright = { ...baseConfig.mcpServers.playwright, args };
  }

  for (const server of Object.values(baseConfig.mcpServers ?? {})) {
    if (server.oauth?.callbackPort) {
      server.oauth.callbackPort = server.oauth.callbackPort + workerIndex;
    }
  }

  const tmpPath = path.join(ROOT, `.mcp-run-${combo.id}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify(baseConfig, null, 2));
  return tmpPath;
};

export const cleanupRunMcpConfig = (combo: Combination) => {
  silentUnlink(path.join(ROOT, `.mcp-run-${combo.id}.json`));
  silentUnlink(path.join(ROOT, `.system-prompt-${combo.id}.md`));
  silentRm(path.join(ROOT, `.pw-data-${combo.id}`));
};
