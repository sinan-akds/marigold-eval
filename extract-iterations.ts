import fs from 'node:fs';
import path from 'node:path';
import { ROOT, RESULTS_DIR } from './src/paths';

const HOME = process.env.HOME ?? '/tmp';
const CLAUDE_PROJECTS_DIR = path.join(HOME, '.claude', 'projects');

const SESSION_DIR_PREFIXES = [
  '-home-sinan-GitHub-private-uni-marigold-eval-worktree-',
  '-home-sinan-GitHub-public-marigold-eval-worktree-',
  '-home-sinan-GitHub-test-marigold-test-project-worktree-',
  '-home-sinan-GitHub-private-uni-marigold-test-app-worktree-',
  '-home-sinan-GitHub-private-uni-Bachelorarbeit-worktree-',
];

type ToolCall = {
  turn: number;
  name: string;
  command?: string;
  isValidateCall: boolean;
  validateChecks?: string;
};

type IterationData = {
  runId: string;
  model: string;
  config: string;
  promptId: string;
  runNumber: number;
  sessionFile: string | null;
  totalTurns: number;
  toolCalls: ToolCall[];
  validateCalls: number;
  mcpCalls: number;
  mcpToolBreakdown: Record<string, number>;
  editCalls: number;
  readCalls: number;
  writeCalls: number;
  bashCalls: number;
  totalToolCalls: number;
  validateCallDetails: ValidateDetail[];
  hasSessionData: boolean;
};

type ValidateDetail = {
  turn: number;
  command: string;
  checks: string;
  errorCount: number;
  warningCount: number;
  bySource: Record<string, { errors: number; warnings: number }>;
  issueMessages: string[];
  ok: boolean;
};

type SessionMessage = {
  type: string;
  message?: {
    role: string;
    content: string | ContentBlock[];
  };
  parentUuid?: string;
  isSidechain?: boolean;
};

type ContentBlock = {
  type: string;
  name?: string;
  id?: string;
  tool_use_id?: string;
  input?: Record<string, unknown>;
  content?: string | ContentBlock[];
  text?: string;
};

const findSessionDir = (runId: string): string | null => {
  for (const prefix of SESSION_DIR_PREFIXES) {
    const dirName = prefix + runId;
    const fullPath = path.join(CLAUDE_PROJECTS_DIR, dirName);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
};

const findBestSessionFile = (sessionDir: string, evalPromptStart: string): string | null => {
  const files = fs.readdirSync(sessionDir)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => ({
      name: f,
      path: path.join(sessionDir, f),
      size: fs.statSync(path.join(sessionDir, f)).size,
    }))
    .filter(f => f.size > 1000)
    .sort((a, b) => b.size - a.size);

  if (files.length === 0) return null;

  for (const file of files) {
    try {
      const lines = fs.readFileSync(file.path, 'utf-8').split('\n').filter(Boolean);
      for (const line of lines.slice(0, 10)) {
        const obj = JSON.parse(line) as SessionMessage;
        if (obj.type === 'user') {
          const content = obj.message?.content;
          const text = typeof content === 'string'
            ? content
            : Array.isArray(content)
              ? content.find(b => b.type === 'text')?.text ?? ''
              : '';
          if (text.startsWith(evalPromptStart)) return file.path;
        }
      }
    } catch { /* skip corrupt files */ }
  }

  return files[0]?.path ?? null;
};

type ParsedValidateResult = {
  errors: number;
  warnings: number;
  bySource: Record<string, { errors: number; warnings: number }>;
  issueMessages: string[];
  ok: boolean;
};

const ISSUE_LINE_RE = /^\[(error|warning)\/([\w-]+)\]\s*<([^>]+)>:\s*(.+)/;

const parseSummaryLine = (text: string): { errors: number; warnings: number } | null => {
  const m = text.match(/(\d+)\s+error\(s\),\s*(\d+)\s+warning\(s\)/);
  if (m) return { errors: parseInt(m[1], 10), warnings: parseInt(m[2], 10) };
  if (text.includes('— ok')) return { errors: 0, warnings: 0 };
  return null;
};

const parseValidateResult = (resultText: string): ParsedValidateResult => {
  const bySource: Record<string, { errors: number; warnings: number }> = {};
  const issueMessages: string[] = [];
  let errors = 0;
  let warnings = 0;

  const lines = resultText.split('\n');
  for (const line of lines) {
    const summary = parseSummaryLine(line);
    if (summary) {
      errors = summary.errors;
      warnings = summary.warnings;
      continue;
    }

    const m = line.match(ISSUE_LINE_RE);
    if (m) {
      const severity = m[1] as 'error' | 'warning';
      const type = m[2];
      const message = m[4].trim();

      if (!bySource[type]) bySource[type] = { errors: 0, warnings: 0 };
      if (severity === 'error') bySource[type].errors++;
      else bySource[type].warnings++;

      issueMessages.push(`[${severity}/${type}] ${message.slice(0, 120)}`);
    }
  }

  if (errors === 0 && warnings === 0 && issueMessages.length > 0) {
    errors = issueMessages.filter(m => m.startsWith('[error/')).length;
    warnings = issueMessages.filter(m => m.startsWith('[warning/')).length;
  }

  // count as a real validate run only if the output carries the tool signature
  const ok = /marigold-validate:/.test(resultText)
    || /\d+\s+error\(s\),\s*\d+\s+warning\(s\)/.test(resultText)
    || resultText.includes('— ok')
    || issueMessages.length > 0;

  return { errors, warnings, bySource, issueMessages, ok };
};

const extractFromSession = (sessionFile: string): {
  toolCalls: ToolCall[];
  validateDetails: ValidateDetail[];
  totalTurns: number;
} => {
  const lines = fs.readFileSync(sessionFile, 'utf-8').split('\n').filter(Boolean);
  const toolCalls: ToolCall[] = [];
  const validateDetails: ValidateDetail[] = [];
  let turn = 0;

  const pendingValidateCalls = new Map<string, { turn: number; command: string; checks: string }>();

  for (const line of lines) {
    let obj: SessionMessage;
    try { obj = JSON.parse(line); } catch { continue; }

    if (obj.type === 'assistant') {
      turn++;
      const content = obj.message?.content;
      if (!Array.isArray(content)) continue;

      for (const block of content) {
        if (block.type !== 'tool_use') continue;

        const name = block.name ?? 'unknown';
        const command = name === 'Bash' ? String(block.input?.command ?? '') : undefined;
        const isValidateCall = command
          ? /marigold.validate|marigold-validate|marigold_validate/.test(command)
          : false;

        let validateChecks: string | undefined;
        if (isValidateCall && command) {
          const checksMatch = command.match(/--checks\s+(\S+)/);
          validateChecks = checksMatch?.[1] ?? 'all';

          if (block.id) {
            pendingValidateCalls.set(block.id, {
              turn,
              command: command.slice(0, 300),
              checks: validateChecks,
            });
          }
        }

        toolCalls.push({ turn, name, command: command?.slice(0, 200), isValidateCall, validateChecks });
      }
    }

    if (obj.type === 'user') {
      const content = obj.message?.content;
      if (!Array.isArray(content)) continue;

      for (const block of content) {
        if (block.type !== 'tool_result') continue;

        const toolUseId = block.tool_use_id;
        if (!toolUseId || !pendingValidateCalls.has(toolUseId)) continue;

        const pending = pendingValidateCalls.get(toolUseId)!;
        pendingValidateCalls.delete(toolUseId);

        const resultText = typeof block.content === 'string'
          ? block.content
          : Array.isArray(block.content)
            ? block.content.map(b => b.text ?? '').join('')
            : '';

        const parsed = parseValidateResult(resultText);
        validateDetails.push({
          turn: pending.turn,
          command: pending.command,
          checks: pending.checks,
          errorCount: parsed.errors,
          warningCount: parsed.warnings,
          bySource: parsed.bySource,
          issueMessages: parsed.issueMessages,
          ok: parsed.ok,
        });
      }
    }
  }

  return { toolCalls, validateDetails, totalTurns: turn };
};

const getEvalPromptStart = (promptId: string): string => {
  const promptFile = path.join(ROOT, 'prompts', `${promptId}.md`);
  if (!fs.existsSync(promptFile)) return '';
  const text = fs.readFileSync(promptFile, 'utf-8');
  return text.slice(0, 80);
};

const main = () => {
  const resultDirs = fs.readdirSync(RESULTS_DIR).filter(d => {
    const full = path.join(RESULTS_DIR, d);
    return fs.statSync(full).isDirectory() && d !== 'node_modules' && d !== 'runs';
  });

  const allIterations: IterationData[] = [];
  let found = 0;
  let missing = 0;
  // runs dropped because their session log could not be found
  const droppedRunIds: string[] = [];

  for (const comboDir of resultDirs) {
    // combo dir is "<model>-<config>", split on the first dash
    const dashIdx = comboDir.indexOf('-');
    const model = dashIdx === -1 ? comboDir : comboDir.slice(0, dashIdx);
    const configPart = comboDir.slice(model.length + 1);
    const comboPath = path.join(RESULTS_DIR, comboDir);

    const promptDirs = fs.readdirSync(comboPath).filter(d =>
      fs.statSync(path.join(comboPath, d)).isDirectory()
    );

    for (const promptDir of promptDirs) {
      const promptPath = path.join(comboPath, promptDir);
      const runDirs = fs.readdirSync(promptPath).filter(d =>
        d.startsWith('run-') && fs.statSync(path.join(promptPath, d)).isDirectory()
      );

      for (const runDir of runDirs) {
        const runNumber = parseInt(runDir.replace('run-', ''), 10);
        const resultFile = path.join(promptPath, runDir, 'result.json');
        if (!fs.existsSync(resultFile)) continue;

        const runId = `${model}-${configPart}-${promptDir}-r${runNumber}`;
        const promptStart = getEvalPromptStart(promptDir);

        // prefer the transcript saved next to the run, fall back to the local ~/.claude session
        const localSession = path.join(promptPath, runDir, 'session.jsonl');
        let sessionFile: string | null = null;
        if (fs.existsSync(localSession) && fs.statSync(localSession).size > 1000) {
          sessionFile = localSession;
        } else {
          const sessionDir = findSessionDir(runId);
          if (sessionDir) sessionFile = findBestSessionFile(sessionDir, promptStart);
        }

        if (!sessionFile) {
          allIterations.push({
            runId, model, config: configPart, promptId: promptDir, runNumber,
            sessionFile: null, totalTurns: 0, toolCalls: [], validateCalls: 0,
            mcpCalls: 0, mcpToolBreakdown: {}, editCalls: 0, readCalls: 0,
            writeCalls: 0, bashCalls: 0, totalToolCalls: 0, validateCallDetails: [],
            hasSessionData: false,
          });
          missing++;
          droppedRunIds.push(runId);
          continue;
        }

        const { toolCalls, validateDetails, totalTurns } = extractFromSession(sessionFile);

        const mcpToolBreakdown: Record<string, number> = {};
        let mcpCalls = 0;
        let editCalls = 0;
        let readCalls = 0;
        let writeCalls = 0;
        let bashCalls = 0;

        for (const tc of toolCalls) {
          if (tc.name.startsWith('mcp__')) {
            mcpCalls++;
            mcpToolBreakdown[tc.name] = (mcpToolBreakdown[tc.name] ?? 0) + 1;
          }
          if (tc.name === 'Edit') editCalls++;
          if (tc.name === 'Read') readCalls++;
          if (tc.name === 'Write') writeCalls++;
          if (tc.name === 'Bash') bashCalls++;
        }

        allIterations.push({
          runId, model, config: configPart, promptId: promptDir, runNumber,
          sessionFile: path.basename(sessionFile),
          totalTurns,
          toolCalls,
          validateCalls: toolCalls.filter(tc => tc.isValidateCall).length,
          mcpCalls,
          mcpToolBreakdown,
          editCalls, readCalls, writeCalls, bashCalls,
          totalToolCalls: toolCalls.length,
          validateCallDetails: validateDetails,
          hasSessionData: true,
        });
        found++;
      }
    }
  }

  console.error(`Extracted: ${found} runs with session data, ${missing} without`);
  // log dropped runs and report coverage below
  if (droppedRunIds.length > 0) {
    console.error(`Dropped ${droppedRunIds.length} run(s) with no resolvable session log:`);
    for (const id of [...droppedRunIds].sort()) console.error(`  - ${id}`);
  }

  const enrichedRuns = allIterations.map(({ toolCalls, ...rest }) => {
    const calls = rest.validateCallDetails;
    if (calls.length < 2) return { ...rest, convergence: null };
    const first = calls[0];
    const last = calls[calls.length - 1];
    return {
      ...rest,
      convergence: {
        // spans all validate calls regardless of --checks scope, kept for compatibility only
        scope: 'all-calls-mixed',
        validateCalls: calls.length,
        firstErrors: first.errorCount,
        lastErrors: last.errorCount,
        firstWarnings: first.warningCount,
        lastWarnings: last.warningCount,
        converged: last.errorCount === 0,
        errorReduction: first.errorCount > 0
          ? Math.round((first.errorCount - last.errorCount) / first.errorCount * 100)
          : 0,
      },
    };
  });

  const output = {
    extractedAt: new Date().toISOString(),
    totalRuns: allIterations.length,
    withSessionData: found,
    withoutSessionData: missing,
    analyzedRuns: found,
    droppedRunIds: [...droppedRunIds].sort(),
    coverage: {
      found,
      total: allIterations.length,
      rate: allIterations.length ? found / allIterations.length : 0,
    },
    runs: enrichedRuns,
  };

  const outPath = path.join(ROOT, 'iteration-data.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.error(`Written to ${outPath}`);

  // Print summary table
  console.log('\n=== Iteration Data Summary ===\n');
  console.log('Run ID'.padEnd(40) + 'Turns'.padStart(6) + 'Tools'.padStart(6) +
    'Validate'.padStart(9) + 'MCP'.padStart(5) + 'Edit'.padStart(5) +
    'Bash'.padStart(5) + 'Session'.padStart(8));
  console.log('-'.repeat(84));

  const sorted = [...allIterations].sort((a, b) => a.runId.localeCompare(b.runId));
  for (const run of sorted) {
    console.log(
      run.runId.padEnd(40) +
      String(run.totalTurns).padStart(6) +
      String(run.totalToolCalls).padStart(6) +
      String(run.validateCalls).padStart(9) +
      String(run.mcpCalls).padStart(5) +
      String(run.editCalls).padStart(5) +
      String(run.bashCalls).padStart(5) +
      (run.hasSessionData ? '     yes' : '      no')
    );
  }

  // Aggregate by config
  console.log('\n=== Averages by Config ===\n');
  const byConfig: Record<string, { turns: number[]; validate: number[]; mcp: number[]; tools: number[] }> = {};
  for (const run of allIterations) {
    if (!run.hasSessionData) continue;
    const cfg = run.config;
    if (!byConfig[cfg]) byConfig[cfg] = { turns: [], validate: [], mcp: [], tools: [] };
    byConfig[cfg].turns.push(run.totalTurns);
    byConfig[cfg].validate.push(run.validateCalls);
    byConfig[cfg].mcp.push(run.mcpCalls);
    byConfig[cfg].tools.push(run.totalToolCalls);
  }
  const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '-';
  for (const [cfg, data] of Object.entries(byConfig).sort()) {
    console.log(`${cfg.padEnd(15)} avg turns: ${avg(data.turns).padStart(6)}  avg validate: ${avg(data.validate).padStart(5)}  avg mcp: ${avg(data.mcp).padStart(5)}  avg tools: ${avg(data.tools).padStart(6)}  (n=${data.turns.length})`);
  }

  // Validate call progression for full-stack runs
  console.log('\n=== Validate Call Progression (full-stack) ===\n');
  for (const run of sorted.filter(r => r.config === 'full-stack' && r.validateCallDetails.length > 0)) {
    console.log(`${run.runId}:`);
    for (let i = 0; i < run.validateCallDetails.length; i++) {
      const v = run.validateCallDetails[i];
      const sources = Object.entries(v.bySource)
        .map(([src, counts]) => `${src}:${counts.errors}E${counts.warnings}W`)
        .join(' ');
      console.log(`  #${i + 1} turn ${String(v.turn).padStart(3)}: [${v.checks}] ${v.errorCount}E ${v.warningCount}W  ${sources}`);
    }
    // Convergence summary
    const calls = run.validateCallDetails;
    if (calls.length >= 2) {
      const first = calls[0];
      const last = calls[calls.length - 1];
      const errDelta = last.errorCount - first.errorCount;
      const warnDelta = last.warningCount - first.warningCount;
      const converged = last.errorCount === 0;
      console.log(`  → ${calls.length} validate calls, errors: ${first.errorCount}→${last.errorCount} (${errDelta >= 0 ? '+' : ''}${errDelta}), warnings: ${first.warningCount}→${last.warningCount} (${warnDelta >= 0 ? '+' : ''}${warnDelta}), converged: ${converged ? 'yes' : 'no'}`);
    }
    console.log();
  }

  // quick sanity dump, spans all validate calls regardless of --checks scope
  console.log('=== Convergence Statistics (full-stack, scope-mixed) ===\n');
  const fsRuns = sorted.filter(r => r.config === 'full-stack' && r.validateCallDetails.length >= 2);
  if (fsRuns.length > 0) {
    const convergenceData = fsRuns.map(r => {
      const calls = r.validateCallDetails;
      const first = calls[0];
      const last = calls[calls.length - 1];
      return {
        runId: r.runId,
        validateCalls: calls.length,
        firstErrors: first.errorCount,
        lastErrors: last.errorCount,
        firstWarnings: first.warningCount,
        lastWarnings: last.warningCount,
        converged: last.errorCount === 0,
        errorReduction: first.errorCount > 0 ? ((first.errorCount - last.errorCount) / first.errorCount * 100) : 0,
      };
    });

    const avgCalls = convergenceData.reduce((s, d) => s + d.validateCalls, 0) / convergenceData.length;
    const avgFirstErr = convergenceData.reduce((s, d) => s + d.firstErrors, 0) / convergenceData.length;
    const avgLastErr = convergenceData.reduce((s, d) => s + d.lastErrors, 0) / convergenceData.length;
    const convergedCount = convergenceData.filter(d => d.converged).length;
    const avgReduction = convergenceData.reduce((s, d) => s + d.errorReduction, 0) / convergenceData.length;

    console.log(`  Runs with ≥2 validate calls: ${fsRuns.length}`);
    console.log(`  Avg validate calls per run: ${avgCalls.toFixed(1)}`);
    console.log(`  Avg errors (first call): ${avgFirstErr.toFixed(1)}`);
    console.log(`  Avg errors (last call): ${avgLastErr.toFixed(1)}`);
    console.log(`  Avg error reduction: ${avgReduction.toFixed(0)}%`);
    console.log(`  Fully converged (0 errors): ${convergedCount}/${fsRuns.length} (${(convergedCount/fsRuns.length*100).toFixed(0)}%)`);
  }
};

main();
