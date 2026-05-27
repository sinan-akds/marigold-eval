import type { RunDetail } from './types';

type ResultData = Record<string, unknown>;

export const extractRunDetail = (resultData: ResultData): RunDetail => {
  const quality = (resultData.quality ?? {}) as ResultData;
  const categories = (quality.categories ?? {}) as Record<string, ResultData>;
  const report = (resultData.report ?? {}) as ResultData;
  const metadata = (report.metadata ?? {}) as ResultData;
  const assertions = (resultData.assertions ?? null) as ResultData | null;
  const sourceCode = String(resultData.sourceCode ?? '');

  const catScores: Record<string, { score: number; errorCount: number; warningCount: number }> = {};
  for (const [key, cat] of Object.entries(categories)) {
    catScores[key] = {
      score: Number(cat.score ?? 0),
      errorCount: Number(cat.errorCount ?? 0),
      warningCount: Number(cat.warningCount ?? 0),
    };
  }

  const issueSources: Record<string, number> = {};
  const errors = Array.isArray(report.errors) ? report.errors : [];
  const warnings = Array.isArray(report.warnings) ? report.warnings : [];
  for (const issue of [...errors, ...warnings]) {
    const src = String((issue as ResultData).source ?? 'unknown');
    issueSources[src] = (issueSources[src] ?? 0) + 1;
  }

  const passed = assertions ? (Array.isArray(assertions.passed) ? assertions.passed.length : 0) : undefined;
  const failed = assertions ? (Array.isArray(assertions.failed) ? assertions.failed.length : 0) : undefined;

  return {
    categories: Object.keys(catScores).length > 0 ? catScores : undefined,
    renderSuccess: typeof quality.renderSuccess === 'boolean' ? quality.renderSuccess : undefined,
    renderTimeMs: (() => {
      const v = resultData.renderTimeMs ?? metadata.renderTimeMs;
      return typeof v === 'number' ? v : undefined;
    })(),
    componentsFound: (() => {
      const v = resultData.componentsFound ?? metadata.componentsFound;
      return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : undefined;
    })(),
    issueSources: Object.keys(issueSources).length > 0 ? issueSources : undefined,
    linesOfCode: sourceCode ? sourceCode.split('\n').length : undefined,
    assertionsPassed: passed,
    assertionsFailed: failed,
  };
};
