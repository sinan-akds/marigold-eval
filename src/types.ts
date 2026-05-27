export type AssertionCheck = {
  type: 'import' | 'component' | 'text-content' | 'absence' | 'composite';
  pattern?: string;
  checks?: AssertionCheck[];
  [key: string]: unknown;
};

export type AssertionDef = {
  id: string;
  description?: string;
  severity?: 'required' | 'recommended' | 'important' | 'nice-to-have';
  check?: AssertionCheck;
};

export type ChecklistItem = {
  id: string;
  text: string;
};

export type EvalDefinition = {
  id: string;
  name: string;
  promptFile: string;
  complexity: 'low' | 'medium' | 'high';
  runsPerCombination?: number;
  tags: string[];
  checklist: ChecklistItem[];
  assertions: AssertionDef[];
};

export type EvalsConfig = {
  version: number;
  defaults: {
    models: string[];
    configs: string[];
    runsPerCombination: number;
    concurrency: number;
    projectDir: string;
    targetFile: string;
    validatePackage: string;
    themePath?: string;
    claudeTimeoutMs?: number;
    scoreTimeoutMs?: number;
    modelConcurrency?: Record<string, number>;
  };
  evals: EvalDefinition[];
};

export type Efficiency = {
  durationMs: number;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
  totalTokens: number;
  numTurns: number;
};

export type CategoryScore = {
  score: number;
  errorCount: number;
  warningCount: number;
};

export type RunDetail = {
  categories?: Record<string, CategoryScore>;
  renderSuccess?: boolean;
  renderTimeMs?: number;
  componentsFound?: string[];
  issueSources?: Record<string, number>;
  linesOfCode?: number;
  assertionsPassed?: number;
  assertionsFailed?: number;
};

export type BenchmarkRun = {
  evalId: string;
  model: string;
  config: string;
  runNumber: number;
  timestamp: string;
  score: number | null;
  assertionPassRate: number | null;
  sessionId: string | null;
  efficiency?: Efficiency;
  detail?: RunDetail;
  resultFile?: string;
  sourceFile?: string;
  error?: string;
};

export type BenchmarkSummary = {
  evalId: string;
  model: string;
  config: string;
  avgScore: number | null;
  avgAssertionPassRate: number | null;
  runs: number;
  completed: number;
  failed: number;
};

export type BenchmarkFile = {
  version: number;
  runs: BenchmarkRun[];
  summaries: BenchmarkSummary[];
  lastUpdated: string;
};

export type Combination = {
  id: string;
  model: string;
  config: string;
  evalId: string;
  evalDef: EvalDefinition;
  run: number;
};

export type RunResult = {
  id: string;
  score: number | null;
  assertionPassRate: number | null;
  sessionId?: string | null;
  efficiency?: Efficiency;
  error?: string;
};

export type ScoreResult = {
  score: number | null;
  assertionPassRate: number | null;
  quality?: Record<string, unknown>;
  assertions?: Record<string, unknown>;
  error?: string;
};

export type ClaudeOutput = {
  result?: string;
  session_id?: string | null;
  is_error?: boolean;
  error?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
  duration_ms?: number;
  total_cost_usd?: number;
  num_turns?: number;
  _stderr?: string;
};
