import fs from 'node:fs';
import path from 'node:path';

const CLAUDE_PROJECTS_DIR = path.join(process.env.HOME!, '.claude', 'projects');
const RESULTS_DIR = path.join(import.meta.dirname, 'results');

const SESSION_DIR_PREFIXES = [
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
  errorCount: number | null;
  warningCount: number | null;
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

const parseValidateResult = (resultText: string): { errors: number; warnings: number } => {
  const jsonMatch = resultText.match(/\{[\s\S]*"file"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const json = JSON.parse(jsonMatch[0]);
      return {
        errors: (json.errors ?? []).length,
        warnings: (json.warnings ?? []).length,
      };
    } catch { /* fall through */ }
  }
  const errorMatches = resultText.match(/"severity"\s*:\s*"error"/g);
  const warningMatches = resultText.match(/"severity"\s*:\s*"warning"/g);
  if (errorMatches || warningMatches) {
    return { errors: errorMatches?.length ?? 0, warnings: warningMatches?.length ?? 0 };
  }
  return { errors: -1, warnings: -1 };
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
          ? /marigold-validate|marigold_validate/.test(command)
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

        const { errors, warnings } = parseValidateResult(resultText);
        validateDetails.push({
          turn: pending.turn,
          command: pending.command,
          checks: pending.checks,
          errorCount: errors,
          warningCount: warnings,
        });
      }
    }
  }

  return { toolCalls, validateDetails: validateDetails, totalTurns: turn };
};

const getEvalPromptStart = (promptId: string): string => {
  const promptFile = path.join(import.meta.dirname, 'prompts', `${promptId}.md`);
  if (!fs.existsSync(promptFile)) return '';
  const text = fs.readFileSync(promptFile, 'utf-8');
  return text.slice(0, 80);
};

const main = () => {
  const resultDirs = fs.readdirSync(RESULTS_DIR).filter(d => {
    const full = path.join(RESULTS_DIR, d);
    return fs.statSync(full).isDirectory() && d !== 'node_modules';
  });

  const allIterations: IterationData[] = [];
  let found = 0;
  let missing = 0;

  for (const comboDir of resultDirs) {
    const [model, config] = comboDir.split('-', 2) as [string, string];
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
        const sessionDir = findSessionDir(runId);

        if (!sessionDir) {
          allIterations.push({
            runId, model, config: configPart, promptId: promptDir, runNumber,
            sessionFile: null, totalTurns: 0, toolCalls: [], validateCalls: 0,
            mcpCalls: 0, mcpToolBreakdown: {}, editCalls: 0, readCalls: 0,
            writeCalls: 0, bashCalls: 0, totalToolCalls: 0, validateCallDetails: [],
            hasSessionData: false,
          });
          missing++;
          continue;
        }

        const sessionFile = findBestSessionFile(sessionDir, promptStart);
        if (!sessionFile) {
          allIterations.push({
            runId, model, config: configPart, promptId: promptDir, runNumber,
            sessionFile: null, totalTurns: 0, toolCalls: [], validateCalls: 0,
            mcpCalls: 0, mcpToolBreakdown: {}, editCalls: 0, readCalls: 0,
            writeCalls: 0, bashCalls: 0, totalToolCalls: 0, validateCallDetails: [],
            hasSessionData: false,
          });
          missing++;
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

  const output = {
    extractedAt: new Date().toISOString(),
    totalRuns: allIterations.length,
    withSessionData: found,
    withoutSessionData: missing,
    runs: allIterations.map(({ toolCalls, ...rest }) => rest),
  };

  const outPath = path.join(import.meta.dirname, 'iteration-data.json');
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
    for (const v of run.validateCallDetails) {
      const errs = v.errorCount !== null ? `${v.errorCount}E` : '?E';
      const warns = v.warningCount !== null ? `${v.warningCount}W` : '?W';
      console.log(`  turn ${String(v.turn).padStart(3)}: [${v.checks}] ${errs} ${warns}`);
    }
    console.log();
  }
};

main();
