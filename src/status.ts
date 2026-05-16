import { comboId, runComboId } from './benchmark';
import { out } from './log';
import type { BenchmarkFile, BenchmarkSummary, EvalsConfig } from './types';

const findSummary = (bm: BenchmarkFile, model: string, config: string, evalId?: string): BenchmarkSummary | undefined =>
  bm.summaries.find(s => s.model === model && s.config === config && (!evalId || s.evalId === evalId));

const avgOf = (nums: number[]): number =>
  nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

const fmtScore = (n: number | null): string =>
  n !== null ? n.toFixed(1) : '-';

const fmtPassRate = (r: number | null): string =>
  r !== null ? `${Math.round(r * 100)}%` : '-';

const fmtScoreWithAssertions = (score: number | null, passRate: number | null): string => {
  if (score === null) return '-';
  const s = score.toFixed(1);
  if (passRate !== null) return `${s} (${Math.round(passRate * 100)}%)`;
  return s;
};

const fmtDuration = (ms: number | undefined): string =>
  ms ? `${(ms / 1000).toFixed(0)}s` : '-';

const fmtCost = (usd: number | undefined): string =>
  usd ? `$${usd.toFixed(4)}` : '-';

export const showStatus = (config: EvalsConfig, bm: BenchmarkFile) => {
  const d = config.defaults;
  const total = d.models.length * d.configs.length
    * config.evals.reduce((sum, e) => sum + (e.runsPerCombination ?? d.runsPerCombination), 0);

  const completedRuns = bm.runs.filter(r => !r.error);
  const failedRuns = bm.runs.filter(r => !!r.error);
  const pending = total - completedRuns.length - failedRuns.length;

  out(`\nEval Progress\n`);
  out(`─────────────────────────────\n`);
  out(`Total combinations: ${total}\n`);
  out(`Completed:          ${completedRuns.length}\n`);
  out(`Failed:             ${failedRuns.length}\n`);
  out(`Pending:            ${pending}\n\n`);

  for (const model of d.models) {
    for (const cfg of d.configs) {
      const matching = bm.runs.filter(r => r.model === model && r.config === cfg);
      if (matching.length === 0) continue;

      const groupSummaries = bm.summaries.filter(s => s.model === model && s.config === cfg);
      const totalCompleted = groupSummaries.reduce((s, g) => s + g.completed, 0);
      const totalFailed = groupSummaries.reduce((s, g) => s + g.failed, 0);
      const groupScores = groupSummaries.map(s => s.avgScore).filter((s): s is number => s !== null);
      const avg = groupScores.length > 0 ? avgOf(groupScores).toFixed(1) : '-';
      const groupPassRates = groupSummaries.map(s => s.avgAssertionPassRate).filter((p): p is number => p !== null);
      const avgPR = groupPassRates.length > 0 ? `${Math.round(avgOf(groupPassRates) * 100)}%` : '-';
      const completed = matching.filter(r => !r.error);
      const failed = matching.filter(r => !!r.error);
      const totalCost = completed.reduce((s, r) => s + (r.efficiency?.costUsd ?? 0), 0);

      out(`  ${model}/${cfg} (avg: ${avg}, assertions: ${avgPR}, runs: ${totalCompleted}/${matching.length}, cost: $${totalCost.toFixed(4)})\n`);
      out(`  ${'─'.repeat(85)}\n`);
      out(`  ${'Run'.padEnd(35)} ${'Score'.padEnd(8)} ${'Assert'.padEnd(8)} ${'Time'.padEnd(9)} ${'Cost'.padEnd(10)} Status\n`);

      for (const r of completed.sort((a, b) => runComboId(a).localeCompare(runComboId(b)))) {
        const id = runComboId(r);
        out(`  ${id.padEnd(35)} ${fmtScore(r.score).padEnd(8)} ${fmtPassRate(r.assertionPassRate).padEnd(8)} ${fmtDuration(r.efficiency?.durationMs).padEnd(9)} ${fmtCost(r.efficiency?.costUsd).padEnd(10)} done\n`);
      }

      for (const r of failed) {
        const id = runComboId(r);
        const reason = (r.error ?? 'unknown').slice(0, 50);
        out(`  ${id.padEnd(35)} ${'-'.padEnd(8)} ${'-'.padEnd(8)} ${'-'.padEnd(9)} ${'-'.padEnd(10)} FAILED: ${reason}\n`);
      }

      for (const evalDef of config.evals) {
        const runs = evalDef.runsPerCombination ?? d.runsPerCombination;
        for (let run = 1; run <= runs; run++) {
          const id = comboId(model, cfg, evalDef.id, run);
          if (matching.some(r => runComboId(r) === id)) continue;
          out(`  ${id.padEnd(35)} ${'-'.padEnd(8)} ${'-'.padEnd(8)} ${'-'.padEnd(9)} ${'-'.padEnd(10)} pending\n`);
        }
      }

      out('\n');
    }
  }

  // Score matrix
  const evalIds = config.evals.map(e => e.id);
  const shortEval = (id: string) => id.replace(/^P-0?/, 'P');
  const col = 14;
  const label = 25;
  const divider = label + evalIds.length * col + col;

  out(`  Score Matrix — score (assertion%) per eval\n`);
  out(`  ${'─'.repeat(divider)}\n`);
  out(`  ${'Model / Config'.padEnd(label)}`);
  for (const eid of evalIds) out(shortEval(eid).padStart(col));
  out('           Avg\n');
  out(`  ${'─'.repeat(divider)}\n`);

  for (const model of d.models) {
    for (const cfg of d.configs) {
      out(`  ${`${model}/${cfg}`.padEnd(label)}`);
      const rowScores: number[] = [];
      const rowPassRates: number[] = [];

      for (const eid of evalIds) {
        const summary = findSummary(bm, model, cfg, eid);
        if (summary && summary.avgScore !== null) {
          rowScores.push(summary.avgScore);
          if (summary.avgAssertionPassRate !== null) rowPassRates.push(summary.avgAssertionPassRate);
          out(fmtScoreWithAssertions(summary.avgScore, summary.avgAssertionPassRate).padStart(col));
        } else {
          out('-'.padStart(col));
        }
      }

      if (rowScores.length > 0) {
        const avgS = avgOf(rowScores);
        const avgP = rowPassRates.length > 0 ? avgOf(rowPassRates) : null;
        out(fmtScoreWithAssertions(avgS, avgP).padStart(col) + '\n');
      } else {
        out('-'.padStart(col) + '\n');
      }
    }
  }
  out('\n');

  // Aggregated summary
  out(`  ${'Summary'.padEnd(25)} Done  Avg     Assert  AvgTime   AvgCost\n`);
  out(`  ${'─'.repeat(75)}\n`);
  for (const model of d.models) {
    for (const cfg of d.configs) {
      const groupSummaries = bm.summaries.filter(s => s.model === model && s.config === cfg);
      const totalCompleted = groupSummaries.reduce((s, g) => s + g.completed, 0);
      if (totalCompleted === 0) continue;

      const groupScores = groupSummaries.map(s => s.avgScore).filter((s): s is number => s !== null);
      const avg = groupScores.length > 0 ? avgOf(groupScores).toFixed(1) : '-';
      const groupPassRates = groupSummaries.map(s => s.avgAssertionPassRate).filter((p): p is number => p !== null);
      const avgPR = groupPassRates.length > 0 ? fmtPassRate(avgOf(groupPassRates)) : '-';
      const completedRuns = bm.runs.filter(r => r.model === model && r.config === cfg && !r.error);
      const durations = completedRuns.map(r => r.efficiency?.durationMs).filter((d): d is number => !!d);
      const avgDur = durations.length > 0 ? `${avgOf(durations) / 1000 | 0}s` : '-';
      const costs = completedRuns.map(r => r.efficiency?.costUsd).filter((c): c is number => !!c);
      const avgCost = costs.length > 0 ? `$${avgOf(costs).toFixed(4)}` : '-';

      out(`  ${`${model}/${cfg}`.padEnd(25)} ${String(totalCompleted).padEnd(5)} ${String(avg).padEnd(7)} ${avgPR.padEnd(7)} ${String(avgDur).padEnd(9)} ${avgCost}\n`);
    }
  }
  out('\n');
};
