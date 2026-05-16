import { comboId, isCompleted } from './benchmark';
import type { BenchmarkFile, Combination, EvalsConfig } from './types';

export const generateCombinations = (
  config: EvalsConfig,
  bm: BenchmarkFile,
  filter: string
): Combination[] => {
  const combos: Combination[] = [];
  const d = config.defaults;
  for (const model of d.models) {
    for (const cfg of d.configs) {
      for (const evalDef of config.evals) {
        const runs = evalDef.runsPerCombination ?? d.runsPerCombination;
        for (let run = 1; run <= runs; run++) {
          const id = comboId(model, cfg, evalDef.id, run);
          if (isCompleted(bm, id)) continue;
          if (filter && !id.includes(filter)) continue;
          combos.push({ id, model, config: cfg, evalId: evalDef.id, evalDef, run });
        }
      }
    }
  }
  return combos;
};
