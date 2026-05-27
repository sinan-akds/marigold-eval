import { describe, it, expect } from 'vitest';
import { validateEvalsConfig } from '../validate-config';
import type { EvalsConfig } from '../types';

const validConfig = (): EvalsConfig => ({
  version: 1,
  defaults: {
    models: ['haiku'],
    configs: ['bare'],
    runsPerCombination: 2,
    concurrency: 1,
    projectDir: '/tmp/test',
    targetFile: 'src/TestApp.tsx',
    validatePackage: '/tmp/validate',
  },
  evals: [
    {
      id: 'P-01',
      name: 'Test',
      promptFile: 'prompts/P-01.md',
      complexity: 'low',
      tags: [],
      checklist: [],
      assertions: [
        {
          id: 'a-test',
          severity: 'required',
          check: { type: 'text-content', pattern: '/onPress/' },
        },
      ],
    },
  ],
});

describe('validateEvalsConfig', () => {
  it('accepts a valid config', () => {
    expect(() => validateEvalsConfig(validConfig())).not.toThrow();
  });

  it('rejects unsafe model names', () => {
    const cfg = validConfig();
    cfg.defaults.models = ['../evil'];
    expect(() => validateEvalsConfig(cfg)).toThrow('unsafe characters');
  });

  it('rejects unsafe eval ids', () => {
    const cfg = validConfig();
    cfg.evals[0].id = 'P-01; rm -rf /';
    expect(() => validateEvalsConfig(cfg)).toThrow('unsafe characters');
  });

  it('rejects malformed regex in assertion pattern', () => {
    const cfg = validConfig();
    cfg.evals[0].assertions = [{
      id: 'a-bad-regex',
      check: { type: 'text-content', pattern: '/[invalid/' },
    }];
    expect(() => validateEvalsConfig(cfg)).toThrow('Invalid regex');
  });

  it('validates composite assertion sub-patterns', () => {
    const cfg = validConfig();
    cfg.evals[0].assertions = [{
      id: 'a-composite',
      check: {
        type: 'composite',
        checks: [
          { type: 'text-content', pattern: '/valid/' },
          { type: 'text-content', pattern: '/[broken/' },
        ],
      },
    }];
    expect(() => validateEvalsConfig(cfg)).toThrow('Invalid regex');
  });
});
