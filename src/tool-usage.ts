import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

type ToolUsageResult = {
  sessionId: string;
  tools: Record<string, number>;
  mcpTools: Record<string, number>;
  flags: string[];
};

type ContentBlock = {
  type?: string;
  name?: string;
  input?: Record<string, unknown>;
  [key: string]: unknown;
};

type SessionLine = {
  message?: {
    content?: string | ContentBlock[];
  };
};

const findSessionJsonl = (sessionId: string, wtPath: string): string | null => {
  const claudeBase = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(claudeBase)) return null;

  const wtName = path.basename(wtPath);
  const dirs = fs.readdirSync(claudeBase).filter(d => d.includes(wtName));

  for (const dir of dirs) {
    const jsonl = path.join(claudeBase, dir, `${sessionId}.jsonl`);
    if (fs.existsSync(jsonl)) return jsonl;
  }

  for (const dir of fs.readdirSync(claudeBase)) {
    const jsonl = path.join(claudeBase, dir, `${sessionId}.jsonl`);
    if (fs.existsSync(jsonl)) return jsonl;
  }

  return null;
};

// The local marigold-docs proxy exposes `search_docs` (and the back-compat alias
// `search_components`). The mcp tool name surfaces as `mcp__marigold-docs__search_docs`.
const DOCS_TOOL_NAMES = ['search_docs', 'search_components'];
const isDocsTool = (name: string): boolean =>
  DOCS_TOOL_NAMES.some(t => name === t || name.endsWith(`__${t}`));

const VALIDATE_RE = /marigold[ ._-]validate/i;

/**
 * Parse a Claude Code session JSONL and count tool_use blocks.
 *
 * Uses the same JSON-block parsing approach as extract-iterations.ts: each line
 * is parsed as JSON and we walk message.content[] for type === 'tool_use'
 * blocks. This is strictly more accurate than line-level regex — it cannot
 * mis-count a 'tool_use' substring that appears inside an unrelated field.
 */
export const extractToolUsage = (
  sessionId: string | null,
  wtPath: string
): ToolUsageResult | null => {
  if (!sessionId) return null;

  const jsonlPath = findSessionJsonl(sessionId, wtPath);
  if (!jsonlPath) return null;

  const content = fs.readFileSync(jsonlPath, 'utf-8');
  const tools: Record<string, number> = {};
  const mcpTools: Record<string, number> = {};
  const flagSet = new Set<string>();

  for (const line of content.split('\n')) {
    if (!line.trim()) continue;

    let obj: SessionLine;
    try { obj = JSON.parse(line) as SessionLine; } catch { continue; }

    const blocks = obj.message?.content;
    if (!Array.isArray(blocks)) continue;

    for (const block of blocks) {
      if (block.type !== 'tool_use' || typeof block.name !== 'string') continue;
      const name = block.name;

      tools[name] = (tools[name] ?? 0) + 1;
      if (name.startsWith('mcp__')) {
        mcpTools[name] = (mcpTools[name] ?? 0) + 1;
      }

      if (isDocsTool(name)) flagSet.add('docs-mcp-used');
      if (name === 'Skill') flagSet.add('skill-used');

      // marigold validate runs via a Bash tool call — inspect the command input.
      if (name === 'Bash') {
        const cmd = String(block.input?.command ?? '');
        if (VALIDATE_RE.test(cmd)) flagSet.add('validate-called');
      }
    }
  }

  return { sessionId, tools, mcpTools, flags: [...flagSet] };
};
