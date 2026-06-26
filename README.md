# marigold-eval

This is the evaluation pipeline for a bachelor's thesis at the University of Freiburg. The thesis studies how self-correcting LLM agents can make generated React UI code follow the rules of the Marigold design system. The thesis is written in German.

The repository exists so the results can be inspected and, where the tools are available, reproduced.

## What it measures

Each run gives one Claude model a single UI task. The model writes one component into src/TestApp.tsx. The same task runs under three setups that differ only in the tools the model may use.

- bare. no tools
- mcp-stack. Marigold documentation and a Playwright browser
- full-stack. mcp-stack plus the marigold validate CLI in a self-correction loop

The main question is whether documentation alone already helps much, or whether the validation loop is what produces the real quality gain.

## The matrix

There are 3 models, 3 setups, 10 prompts and 3 runs each, which is 270 runs. The model ids and setups are defined in evals.json.

- Models are claude-haiku-4-5, claude-sonnet-4-6 and claude-opus-4-8.
- Prompts are P-01 to P-10 in prompts/, rising in difficulty.
- Setups are the three system prompts in configs/.

## Metrics

There is no single score. The analysis reports raw numbers only.

- Render rate, whether the component compiles and renders.
- Error count per source, such as compiler, props, composition, design system usage, spatial and accessibility.
- Assertion pass rate, the main metric, which does not depend on the validate tool.
- Convergence, how the error count falls across the self-correction loop.

## Layout

```
evals.json            source of truth for models, setups, prompts and run count
prompts/              the 10 tasks (P-01 to P-10)
configs/              the three system prompts and their settings
src/                  the runner, written in TypeScript
docker/               the hermetic run environment (see docker/README.md)
scripts/              tool-blocking hooks for the bare and mcp tiers, plus helpers
results/              per-run output, result.json and source.tsx
benchmark.json        aggregated results across all runs
iteration-data.json   per-iteration error counts for convergence
make_thesis_plots.py  the thesis figures
sensitivity-assertions.py  robustness check for the assertion pass rate
```

## Reproducing

Runs happen inside a Docker image so each one starts from a clean state. A run on the host machine would inherit the local Claude setup and leak Marigold knowledge into every tier, which would invalidate the experiment. The full setup is described in docker/README.md.

```bash
docker/build.sh                 # build the image
docker/run-until-complete.sh    # run all open combinations, resumable
docker/run.sh --filter <combo>  # run a single combination
```

From the host you can check progress and build the figures.

```bash
pnpm install
pnpm eval:status
pnpm plots
pnpm test
```

### What is reproducible

- bare and mcp-stack only need Claude Code and the public Marigold documentation, so they reproduce directly.
- full-stack also needs the marigold validate CLI. That tool belongs to an internal Reservix repository and is not included here, so full-stack cannot be run again without it.
- Every run still has its result.json and its source.tsx under results/, so the outcomes can be read directly. Raw agent transcripts are not published.

## Citation

Please cite the thesis by Sinan Akdesir, University of Freiburg, 2026.

## License

MIT, see the LICENSE file.
