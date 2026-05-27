import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './paths';
import type { AssertionDef, EvalsConfig } from './types';

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

const VALID_SEVERITIES = new Set(['required', 'recommended', 'important', 'nice-to-have']);
const VALID_CHECK_TYPES = new Set(['import', 'component', 'text-content', 'absence', 'composite']);

const validateAssertion = (a: AssertionDef, evalId: string): void => {
  const id = a.id ?? '(no id)';

  if (a.severity && !VALID_SEVERITIES.has(a.severity)) {
    throw new Error(`evals.json: assertion "${evalId}.${id}" has invalid severity "${a.severity}" (expected: ${[...VALID_SEVERITIES].join(', ')})`);
  }

  const check = a.check;
  if (!check) return;

  if (check.type && !VALID_CHECK_TYPES.has(check.type)) {
    throw new Error(`evals.json: assertion "${evalId}.${id}" has invalid check type "${check.type}" (expected: ${[...VALID_CHECK_TYPES].join(', ')})`);
  }

  if (typeof check.pattern === 'string') {
    validateRegexPattern(check.pattern, `${evalId}.${id}`);
  }

  if (check.type === 'composite' && Array.isArray(check.checks)) {
    for (const sub of check.checks) {
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
  if (!d.targetFile) throw new Error('evals.json: defaults.targetFile is required');
  if (!d.validatePackage) throw new Error('evals.json: defaults.validatePackage is required');
  if (!Number.isInteger(d.runsPerCombination) || d.runsPerCombination < 1) {
    throw new Error('evals.json: defaults.runsPerCombination must be a positive integer');
  }
  if (!Number.isInteger(d.concurrency) || d.concurrency < 1) {
    throw new Error('evals.json: defaults.concurrency must be a positive integer');
  }

  for (const model of d.models) {
    if (!SAFE_ID.test(model)) throw new Error(`evals.json: model "${model}" contains unsafe characters`);
  }
  for (const cfg of d.configs) {
    if (!SAFE_ID.test(cfg)) throw new Error(`evals.json: config "${cfg}" contains unsafe characters`);
  }

  for (const cfg of d.configs) {
    if (cfg !== 'bare') {
      const mcpPath = path.join(ROOT, 'configs', `${cfg}-mcp.json`);
      if (!fs.existsSync(mcpPath)) {
        throw new Error(`evals.json: MCP config not found for config "${cfg}" at ${mcpPath}`);
      }
    }
    const promptPath = path.join(ROOT, 'configs', `${cfg}.md`);
    if (!fs.existsSync(promptPath)) {
      throw new Error(`evals.json: config prompt not found for config "${cfg}" at ${promptPath}`);
    }
  }

  for (const evalDef of config.evals) {
    if (!SAFE_ID.test(evalDef.id)) {
      throw new Error(`evals.json: eval id "${evalDef.id}" contains unsafe characters`);
    }
    if (!evalDef.promptFile) {
      throw new Error(`evals.json: eval "${evalDef.id}" missing promptFile`);
    }

    for (const assertion of evalDef.assertions) {
      validateAssertion(assertion, evalDef.id);
    }
  }
};

export const validateFilesExist = (config: EvalsConfig): void => {
  const d = config.defaults;

  const validateBin = path.join(d.validatePackage, 'dist', 'bin', 'marigold-validate.mjs');
  if (!fs.existsSync(validateBin)) {
    throw new Error(`Validate binary not found at ${validateBin}. Run: pnpm -F @marigold-ui/validate build`);
  }

  for (const evalDef of config.evals) {
    const promptPath = path.join(ROOT, evalDef.promptFile);
    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt file "${evalDef.promptFile}" not found at ${promptPath}`);
    }
  }
};
