import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { extractToolUsage } from '../tool-usage';

// extractToolUsage looks up the JSONL under ~/.claude/projects/<dir>/<sessionId>.jsonl
// where <dir> includes the worktree basename. We create a throwaway project dir
// keyed on a unique worktree name so we don't collide with real sessions.
const CLAUDE_PROJECTS = path.join(os.homedir(), '.claude', 'projects');

const tu = (block: Record<string, unknown>) =>
  JSON.stringify({ type: 'assistant', message: { content: [block] } });

describe('extractToolUsage (JSON-block parser)', () => {
  const wtName = `tooluse-test-${process.pid}-${Date.now()}`;
  const wtPath = `/tmp/${wtName}`;
  const sessionId = 'sess-tooluse-1';
  let projectDir: string;
  let jsonlPath: string;

  beforeEach(() => {
    projectDir = path.join(CLAUDE_PROJECTS, `-tmp-${wtName}`);
    fs.mkdirSync(projectDir, { recursive: true });
    jsonlPath = path.join(projectDir, `${sessionId}.jsonl`);

    const lines = [
      tu({ type: 'tool_use', name: 'Write', input: { file_path: 'src/TestApp.tsx' } }),
      tu({ type: 'tool_use', name: 'Edit', input: { file_path: 'src/TestApp.tsx' } }),
      tu({ type: 'tool_use', name: 'Edit', input: { file_path: 'src/TestApp.tsx' } }),
      tu({ type: 'tool_use', name: 'mcp__marigold-docs__search_docs', input: { query: 'Button' } }),
      tu({ type: 'tool_use', name: 'Bash', input: { command: 'marigold validate src/TestApp.tsx' } }),
      tu({ type: 'tool_use', name: 'Skill', input: {} }),
      // A red herring: the string "tool_use" appears in text but it is NOT a tool_use block.
      JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'I will run a tool_use named search_docs' }] } }),
      '',
    ];
    fs.writeFileSync(jsonlPath, lines.join('\n'));
  });

  afterEach(() => {
    fs.rmSync(projectDir, { recursive: true, force: true });
  });

  it('returns null for a null session id', () => {
    expect(extractToolUsage(null, wtPath)).toBeNull();
  });

  it('counts tool_use blocks accurately and ignores text substrings', () => {
    const result = extractToolUsage(sessionId, wtPath);
    expect(result).not.toBeNull();
    expect(result!.tools.Write).toBe(1);
    expect(result!.tools.Edit).toBe(2);
    expect(result!.tools.Bash).toBe(1);
    expect(result!.tools.Skill).toBe(1);
    // The text block must NOT inflate the search_docs count.
    expect(result!.tools['mcp__marigold-docs__search_docs']).toBe(1);
  });

  it('records mcp tools separately', () => {
    const result = extractToolUsage(sessionId, wtPath)!;
    expect(result.mcpTools['mcp__marigold-docs__search_docs']).toBe(1);
    expect(result.mcpTools.Write).toBeUndefined();
  });

  it('sets validate-called, docs-mcp-used and skill-used flags', () => {
    const result = extractToolUsage(sessionId, wtPath)!;
    expect(result.flags).toContain('validate-called');
    expect(result.flags).toContain('docs-mcp-used');
    expect(result.flags).toContain('skill-used');
  });

  it('does NOT set validate-called for an unrelated Bash command', () => {
    fs.writeFileSync(jsonlPath, [
      tu({ type: 'tool_use', name: 'Bash', input: { command: 'ls -la && pnpm dev' } }),
    ].join('\n'));
    const result = extractToolUsage(sessionId, wtPath)!;
    expect(result.flags).not.toContain('validate-called');
  });
});
