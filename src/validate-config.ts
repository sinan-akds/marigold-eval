import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './paths';
import type { EvalsConfig } from './types';

const SAFE_ID = /^[A-Za-z0-9_-]+$/;

const validateRegexPattern = (pattern: string, location: string): void => {
  const raw = pattern.startsWith('/') && pattern.endsWith('/')
    ? pattern.slice(1, -1)
    : pattern.startsWith('/')
      ? pattern.slice(1, pattern.lastIndexOf('/'))
      : pattern;
  try {
    new RegExp(raw);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid regex in ${location}: ${pattern} — ${msg}`);
  }
};

const validateAssertion = (a: Record<string, unknown>, evalId: string): void => {
  const id = String(a.id ?? '(no id)');
  const check = a.check as Record<string, unknown> | undefined;
  if (!check) return;

  if (typeof check.pattern === 'string') {
    validateRegexPattern(check.pattern, `${evalId}.${id}`);
  }

  if (check.type === 'composite' && Array.isArray(check.checks)) {
    for (const sub of check.checks as Record<string, unknown>[]) {
      if (typeof sub.pattern === 'string') {
        validateRegexPattern(sub.pattern, `${evalId}.${id} (composite)`);
      }
    }
  }
};

export const validateEvalsConfig = (config: EvalsConfig): void => {
  const d = config.defaults;

  if (!d.models?.length) throw new Error('evals.json: defaults.models must be non-empty');
  if (!d.configs?.length) throw new Error('evals.json: defaults.configs must be non-empty');
  if (!d.projectDir) throw new Error('evals.json: defaults.projectDir is required');
  if (!d.validatePackage) throw new Error('evals.json: defaults.validatePackage is required');

  for (const model of d.models) {
    if (!SAFE_ID.test(model)) throw new Error(`evals.json: model "${model}" contains unsafe characters`);
  }
  for (const cfg of d.configs) {
    if (!SAFE_ID.test(cfg)) throw new Error(`evals.json: config "${cfg}" contains unsafe characters`);
  }

  for (const evalDef of config.evals) {
    if (!SAFE_ID.test(evalDef.id)) {
      throw new Error(`evals.json: eval id "${evalDef.id}" contains unsafe characters`);
    }
    if (!evalDef.promptFile) {
      throw new Error(`evals.json: eval "${evalDef.id}" missing promptFile`);
    }

    for (const assertion of evalDef.assertions as Record<string, unknown>[]) {
      validateAssertion(assertion, evalDef.id);
    }
  }
};

export const validateFilesExist = (config: EvalsConfig): void => {
  const d = config.defaults;

  const scoreBin = path.join(d.validatePackage, 'dist', 'bin', 'marigold-score.mjs');
  if (!fs.existsSync(scoreBin)) {
    throw new Error(`Scoring binary not found at ${scoreBin}. Run: pnpm -F @marigold-ui/validate build`);
  }

  for (const evalDef of config.evals) {
    const promptPath = path.join(ROOT, evalDef.promptFile);
    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt file "${evalDef.promptFile}" not found at ${promptPath}`);
    }
  }
};
