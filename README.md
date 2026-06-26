# marigold-eval

Evaluation pipeline for the bachelor's thesis *Iterative UI-Code-Generierung
durch selbstkorrigierende LLM-Agenten — Einhaltung von Design-System-Vorgaben
durch strukturelle Laufzeitanalyse am Beispiel von Marigold* (Sinan Akdesir,
Albert-Ludwigs-Universität Freiburg, Technische Fakultät).

The pipeline benchmarks how well Claude models generate React UI code for the
[Marigold](https://www.npmjs.com/org/marigold) design system, and whether adding
a deterministic validation tool to the agent's self-correction loop improves the
result beyond what documentation access alone achieves.

This repository exists so the thesis results can be inspected and, where the
required tooling is available, reproduced. The thesis itself is written in German.

## What is measured

Each run gives a model one prescriptive UI task and lets it produce a single
component (`src/TestApp.tsx`). The same task is run under three configuration
tiers that differ only in the tools the agent may use:

| Tier | Tools available to the agent |
|---|---|
| **bare** | none (no docs, no browser, no validation) |
| **mcp-stack** | Marigold documentation MCP + Playwright browser MCP |
| **full-stack** | mcp-stack **plus** the `marigold validate` CLI in a self-correction loop |

The core question: documentation alone (mcp-stack) barely moves quality over
bare, while the iterative validation loop (full-stack) with deterministic
feedback produces the actual quality jump.

### Evaluation matrix

3 models × 3 config tiers × 10 prompts × 3 runs = **270 runs**. The pinned model
IDs and tiers are the single source of truth in [`evals.json`](evals.json):

- **Models:** `claude-haiku-4-5`, `claude-sonnet-4-6`, `claude-opus-4-8`
- **Prompts:** `P-01`…`P-10`, ascending complexity ([`prompts/`](prompts/))
- **Tiers:** the three system prompts in [`configs/`](configs/)

### Metrics (score-free)

There is no composite score. The analysis reports raw metrics only:

- **render rate** — does the generated component compile and render
- **error count by source** — prop validator, compiler, composition, design-system usage, spatial, accessibility, …
- **assertion pass rate** — the primary, tool-independent quality metric
- **convergence** — error count across the self-correction iterations

## Repository layout

```
evals.json            # source of truth: models, tiers, prompts, run count
prompts/              # the 10 prescriptive tasks (P-01 … P-10)
configs/              # the three system prompts (bare / mcp-stack / full-stack) + settings
src/                  # the runner (TypeScript): orchestration, scoring, benchmark aggregation
docker/               # hermetic run environment (see docker/README.md)
scripts/              # tool-blocking hooks for the bare/mcp tiers + run helpers
results/              # per-run output: result.json (scored outcome) + source.tsx (final component)
benchmark.json        # aggregated results across all runs
iteration-data.json   # per-iteration error counts (convergence)
make_thesis_plots.py  # the curated thesis figures
sensitivity-assertions.py  # robustness check for the assertion-pass-rate metric
rebuild-benchmark.ts  # re-aggregate benchmark.json from results/
rescore.ts            # re-score existing runs after a scoring change
extract-iterations.ts # build iteration-data.json from the run transcripts
```

## Reproducing the runs

Runs execute inside a hermetic Docker image. This is not optional: a host run
inherits the ambient `~/.claude` state (shared memory, installed plugins, the
user `CLAUDE.md`), which leaks Marigold knowledge into every tier and silently
invalidates the experiment. The container gives each run a fresh, empty
`CLAUDE_CONFIG_DIR` with only the auth token mounted in. See
[`docker/README.md`](docker/README.md) for the full setup.

```bash
docker/build.sh                 # build the image
docker/run-until-complete.sh    # run all open combinations (resumable)
docker/run.sh --filter <combo>  # run a single combination
```

Status and analysis from the host:

```bash
pnpm install
pnpm eval:status   # progress
pnpm plots         # rebuild aggregates + render the thesis figures
pnpm test          # unit tests for the runner
```

### What is reproducible, and what is not

- **bare** and **mcp-stack** rely only on Claude Code and the public Marigold
  documentation MCP, so they reproduce directly.
- **full-stack** additionally requires the `marigold validate` CLI
  (`@marigold/cli`), which is part of Reservix's internal Marigold monorepo and
  is **not** included here. Without it, the full-stack tier cannot be re-run.
- Regardless of re-running, every run's scored outcome (`result.json`) and final
  component (`source.tsx`) are committed under [`results/`](results/), so the
  results themselves can be inspected directly. Raw agent transcripts are not
  published.

## Citation

If you reference these results, please cite the thesis (Sinan Akdesir,
Albert-Ludwigs-Universität Freiburg, 2026).
