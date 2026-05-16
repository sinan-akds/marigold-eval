# Claude Code Briefing — Hardening the BA Eval Pipeline

## Who you are and what to do

You are a code-quality agent working on the **Bachelor-thesis eval pipeline** in
`/home/sinan/GitHub/private/uni/Bachelorarbeit/`. Your job is to address the
findings in [`todo.md`](todo.md) — a manual audit of every file in `src/`,
`run-eval.ts`, `rescore.ts`, `rebuild-benchmark.ts`, plus `evals.json` and the
config files in `configs/`.

The pipeline is going into "production" use for the thesis. Correctness of
`benchmark.json` is the single most important thing. Speed, polish, and elegance
matter, but never at the cost of data integrity.

## Context (read before touching anything)

1. **`CLAUDE.md`** at repo root — describes what the pipeline does, the config
   tiers, the matrix, the test app it targets, and known issues. Read this first.
2. **`todo.md`** — the audit. Items are tagged `BUG`, `RISK`, `SMELL`, or `NIT`,
   with file/line references. **Do not invent new findings**; work the list.
3. **`evals.json`** — the single source of truth for the eval matrix, the
   per-prompt checklists, and the deterministic assertions. Schema is not
   well-typed; the audit calls this out (A23, A34, B12).
4. **External package — `/home/sinan/GitHub/reservix/marigold/packages/validate/`**
   — provides `marigold-validate` and `marigold-score` CLIs. **It already has
   its own `BRIEFING.md` and `TODO.md`. Do NOT modify that package from here.**
   If you find that a finding in this repo's `todo.md` is actually rooted in the
   validate package, note it in `todo.md` and stop — bring it to Sinan.
5. **Test project** at `/home/sinan/GitHub/test/marigold-test-project/marigold-test-app`
   — the React app Claude writes into. Worktrees are spun off this project.

## Ground rules

- **Do not refactor speculatively.** The audit lists what is wrong. Fix what is
  listed. Don't bundle "while I'm here" cleanups into the same diff.
- **Don't introduce abstractions for hypothetical future needs.** This is a
  thesis pipeline, not a SaaS product. Three similar lines beat a premature
  helper.
- **Don't add comments that restate the code.** Add comments only where the
  *why* is non-obvious (a workaround, a constraint, a foot-gun).
- **TypeScript: strict mode is on.** Use `type`, not `interface` (per global
  preference). Do not introduce new `as any` casts; remove existing ones when
  the affected finding (e.g. A30) gets fixed.
- **Tooling: `pnpm`, not `npm`.** Scripts: `pnpm eval`, `pnpm eval:status`,
  `pnpm eval:dry-run`. Add a `pnpm typecheck` script if you change `package.json`.
- **No new files unless the audit calls for them.** Edit existing modules in
  place.
- **No emojis** in code or output unless explicitly asked.
- **Per CLAUDE.md, prompts/configs/evals.json are versioned artifacts.** Don't
  change semantics of an assertion or a prompt without first asking — that
  invalidates prior runs.

## How to work the list

Do one item, verify it, commit, move on. Recommended ordering is at the bottom
of `todo.md` ("Priority order") — start there.

For every item:
1. **Re-read the affected file** end-to-end. The audit may miss context.
2. **Decide if the fix is local or needs a discussion.** If a fix would require
   changing the shape of `benchmark.json` (schema migration), changing the
   semantics of `evals.json` (re-scoring needed), or touching the external
   validate package — stop and ask Sinan.
3. **Implement the smallest fix** that closes the finding.
4. **Sanity-check** with at least:
   - `pnpm tsx run-eval.ts --dry-run` — should not throw, should list the matrix.
   - `pnpm tsx run-eval.ts --status` — should render against existing `benchmark.json`.
   - If you can: a single-combo smoke run, e.g.
     `pnpm tsx run-eval.ts --filter haiku-bare-P-01-r1`.
5. **Update `todo.md`**: strike the item with `~~A4~~`, leave a one-line note on
   what you did and where (commit SHA or file:line).
6. **Commit** with a short message referencing the audit item id
   (e.g. `fix(scoring): treat marigold-score crash as run error [A2, A12]`).

## Items that need a decision before you start (Sinan must answer)

These appear in `todo.md` but are policy calls, not coding tasks:

- **A39** — Should `assertionPassRate` weight required vs. recommended assertions
  differently? Right now it doesn't. The thesis methodology document decides this.
- **A8 / A9** — Should `pnpm eval` (no flags) still wipe `benchmark.json`? Or
  should it be opt-in via `--clean`? Either is defensible. Pick one and document.
- **A36** — How portable does the pipeline need to be? Should `evals.json`
  support env-var expansion / a `.local.json` override file, or is the hardcoded
  `/home/sinan/...` path fine because it only runs on Sinan's machine?
- **A37 / A38** — The "no raw HTML" assertions use bare strings like
  `"input"`, `"form"`, `"button"` with `scope: "jsx"`. Verify in the validate
  package how this is matched. If case-insensitive, P-03's `a-no-raw-form` will
  flag a Marigold `<Form>` — that's a silent bug.

Bring these to Sinan before changing behavior.

## Data-integrity invariants (don't break these)

1. `benchmark.json.runs[]` is **append-only across a single eval run**, but
   **dedupable by `(model, config, evalId, runNumber)`** — at most one row per
   tuple. Today A3 violates this; the fix is to dedupe on `addRun`.
2. `score` in a `BenchmarkRun` is `null` when the run failed; a number when it
   succeeded. Today A2 violates this by writing `0` on scoring failure.
3. `assertionPassRate` is `null` when no assertions ran; a number in [0, 1]
   otherwise. Currently respected.
4. `summaries[]` is rebuilt from `runs[]` — never the other way round. Don't
   add fields that exist only in `summaries`.
5. `result.json` per-run file is the **detailed record**; `benchmark.json` is
   the **aggregate**. If detail is needed in the aggregate, it should still be
   derivable from `result.json` so `rebuild-benchmark.ts` can reproduce it.

## What "done" looks like

The pipeline can be run end-to-end on a fresh checkout with:

```
pnpm install
pnpm tsx run-eval.ts --dry-run     # lists all combos, no errors
pnpm tsx run-eval.ts               # runs the matrix (or --resume to continue)
pnpm tsx run-eval.ts --status      # shows the matrix table
```

… and produces a `benchmark.json` where:

- every failed run has `error` set and `score: null` (A2)
- every (model, config, eval, runNumber) tuple appears at most once (A3)
- every successful run has non-zero `efficiency.durationMs` and `costUsd` (A28)
- summaries match what `--status` displays (A10)
- no zombie `node`/`chrome`/`pnpm` processes are left behind (A6)
- no `.system-prompt-*.md`, `.mcp-run-*.json`, `worktree-*` directories remain
  at repo root after a clean exit (cleanup paths)
- `--resume` / `--filter` invocations do NOT wipe previous data (A9)

## Things to push back on

If Sinan asks for a sweeping refactor, push back with: "Audit lists N items;
let's close those first, then decide if a refactor is still warranted."

If a finding turns out to be a non-issue on re-reading, **say so and remove it
from `todo.md`** with a one-line justification. Do not silently skip items.

## Reference

- Audit: [`todo.md`](todo.md)
- Project context: [`CLAUDE.md`](CLAUDE.md)
- Pipeline entrypoint: [`run-eval.ts`](run-eval.ts) → [`src/main.ts`](src/main.ts)
- Scoring wrapper: [`src/scoring.ts`](src/scoring.ts)
- Worker loop: [`src/runner.ts`](src/runner.ts)
- Benchmark IO: [`src/benchmark.ts`](src/benchmark.ts)
- External scoring CLI (read-only): `/home/sinan/GitHub/reservix/marigold/packages/validate/src/bin/marigold-score.ts`
