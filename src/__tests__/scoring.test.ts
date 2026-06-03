import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ScoreResult } from '../types';
import { locateTargetFile } from '../scoring';
import { STUB_CONTENT } from '../worktree';

describe('locateTargetFile basename constraint', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'locate-'));
  const srcDir = path.join(tmp, 'src');
  const expected = path.join(srcDir, 'TestApp.tsx');
  const mainApp = path.join(tmp, 'main-TestApp.tsx');

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('does NOT return a newer unrelated helper .tsx when target is a stub', () => {
    fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
    // Expected target is still the stub (agent never wrote real content there).
    fs.writeFileSync(expected, STUB_CONTENT);
    // A NEWER helper component exists — must NOT be scored.
    const helper = path.join(srcDir, 'components', 'Fancy.tsx');
    fs.writeFileSync(helper, 'export const Fancy = () => null;\n');
    const newer = Date.now() / 1000 + 100;
    fs.utimesSync(helper, newer, newer);
    // main app is empty/absent so the copy-back branch does not fire.

    const result = locateTargetFile(expected, tmp, mainApp, '[test]');
    expect(path.basename(result)).toBe('TestApp.tsx');
    expect(result).not.toBe(helper);
  });

  it('returns the expected path immediately when it has real content', () => {
    fs.mkdirSync(srcDir, { recursive: true });
    fs.writeFileSync(expected, 'const TestApp = () => <Real/>;\nexport default TestApp;\n');
    const result = locateTargetFile(expected, tmp, mainApp, '[test]');
    expect(result).toBe(expected);
  });

  it('finds a relocated target by exact basename in a subdir', () => {
    fs.mkdirSync(path.join(srcDir, 'nested'), { recursive: true });
    // Expected path is a stub; the real TestApp.tsx was written into a subdir.
    fs.writeFileSync(expected, STUB_CONTENT);
    const relocated = path.join(srcDir, 'nested', 'TestApp.tsx');
    fs.writeFileSync(relocated, 'const TestApp = () => <X/>;\nexport default TestApp;\n');
    const result = locateTargetFile(expected, tmp, mainApp, '[test]');
    expect(path.basename(result)).toBe('TestApp.tsx');
  });
});

describe('ScoreResult contract', () => {
  it('score is null when scoring failed, not 0', () => {
    const failed: ScoreResult = {
      score: null,
      assertionPassRate: null,
      error: 'Result file not found',
    };
    expect(failed.score).toBeNull();
  });

  it('score is a number when scoring succeeded', () => {
    const success: ScoreResult = {
      score: 72,
      assertionPassRate: 0.85,
    };
    expect(success.score).toBe(72);
  });
});
