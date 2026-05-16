import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { EVALS_PATH } from './paths';
import { log, out } from './log';
import { loadBenchmark, comboId, recomputeSummaries, saveBenchmark } from './benchmark';
import { generateCombinations } from './combinations';
import { killDevServerOnPort } from './worktree';
import { runBatch } from './runner';
import { showStatus } from './status';
import { cleanAll } from './cleanup';
import type { EvalsConfig } from './types';

const USAGE = `Usage: tsx run-eval.ts [options]

Options:
  --dry-run          Show what would run without executing
  --resume           Continue from where a previous run left off
  --concurrency <n>  Override concurrency from evals.json
  --filter <str>     Only run combinations whose ID contains <str>
  --reset [filter]   Remove completed runs from benchmark.json (all, or matching filter)
  --status           Show progress summary and exit
  --help             Show this message
`;

const { values: flags } = parseArgs({
  options: {
    'dry-run': { type: 'boolean', default: false },
    resume: { type: 'boolean', default: false },
    concurrency: { type: 'string', default: '' },
    filter: { type: 'string', default: '' },
    reset: { type: 'string', default: undefined },
    status: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
  allowPositionals: true,
});

if (flags.help) {
  process.stdout.write(USAGE);
  process.exit(0);
}

const main = async () => {
  if (!fs.existsSync(EVALS_PATH)) {
    log(`Error: evals.json not found at ${EVALS_PATH}\n`);
    process.exit(2);
  }

  const config = JSON.parse(fs.readFileSync(EVALS_PATH, 'utf-8')) as EvalsConfig;
  const appDir = config.defaults.projectDir;

  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: appDir, stdio: 'pipe' });
  } catch {
    log(`Error: ${appDir} is not a git repository. Run \`git init && git add . && git commit -m "initial"\` inside it first.\n`);
    process.exit(2);
  }

  if (flags.status) {
    showStatus(config, loadBenchmark());
    process.exit(0);
  }

  if (flags.reset !== undefined) {
    const bm = loadBenchmark();
    const filter = flags.reset || '';
    const before = bm.runs.length;
    if (filter) {
      bm.runs = bm.runs.filter(r => {
        const id = comboId(r.model, r.config, r.evalId, r.runNumber);
        return !id.includes(filter);
      });
    } else {
      bm.runs = [];
    }
    const removed = before - bm.runs.length;
    recomputeSummaries(bm);
    saveBenchmark(bm);
    log(`Reset: removed ${removed} runs${filter ? ` matching "${filter}"` : ''} (${bm.runs.length} remaining)\n`);
    process.exit(0);
  }

  const isBareInvocation = !flags.resume && !flags.filter && !flags['dry-run'];
  if (isBareInvocation) {
    cleanAll(config);
  }

  const bm = loadBenchmark();
  const concurrency = flags.concurrency
    ? parseInt(flags.concurrency, 10)
    : config.defaults.concurrency ?? 3;

  const combos = generateCombinations(config, bm, flags.filter ?? '');

  if (combos.length === 0) {
    out('All combinations completed (or filtered out). Nothing to do.\n');
    showStatus(config, bm);
    process.exit(0);
  }

  log(`\nMarigold Eval Runner\n`);
  log(`────────────────────\n`);
  log(`Pending:     ${combos.length} runs\n`);
  log(`Concurrency: ${concurrency}\n`);
  log(`Models:      ${config.defaults.models.join(', ')}\n`);
  log(`Configs:     ${config.defaults.configs.join(', ')}\n`);
  log(`Evals:       ${config.evals.map(e => `${e.id} (${e.name})`).join(', ')}\n`);
  log(`Runs/combo:  ${config.evals.map(e => `${e.id}=${e.runsPerCombination ?? config.defaults.runsPerCombination}`).join(', ')}\n\n`);

  if (flags['dry-run']) {
    out('Dry run — would execute:\n\n');
    for (const c of combos) out(`  ${c.id}\n`);
    out(`\nTotal: ${combos.length} runs\n`);
    process.exit(0);
  }

  for (let i = 0; i < concurrency; i++) {
    killDevServerOnPort(5173 + i);
  }

  const results = await runBatch(combos, config, bm, concurrency);

  log('\n────────────────────\n');
  log('Run complete.\n\n');
  showStatus(config, loadBenchmark());

  process.exit(results.some(r => r.error) ? 1 : 0);
};

main().catch(err => {
  log(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(2);
});
