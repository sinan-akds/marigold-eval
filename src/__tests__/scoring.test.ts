import { describe, it, expect } from 'vitest';
import type { ScoreResult } from '../types';

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
