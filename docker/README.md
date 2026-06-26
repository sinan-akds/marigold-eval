# Hermetic eval environment

Runs the 270-run benchmark in a reproducible, isolated container. This exists
because a host run inherits the ambient `~/.claude` state (shared project
memory, installed plugins/skills, the user `CLAUDE.md`), which leaks Marigold
knowledge into every tier and silently invalidates the experiment. The
container removes that: each run gets a fresh, empty `CLAUDE_CONFIG_DIR` with
only the auth token copied in.

## What is in the image vs. mounted

**Baked in** (frozen, reproducible toolchain):
- Node 22, pnpm 10.15.1, Claude Code CLI, `jq`, git
- The validate tool + its sibling `@marigold/cli` as self-contained `pnpm deploy`
  bundles (real dependency closure, exact `@marigold` versions, Playwright),
  under `/opt/marigold/{validate,cli}`
- `@marigold/theme-rui` at `/opt/theme-rui`
- The Vite/React test-app with installed deps, as a git repo, at `/work/test-app`
- Chromium (`playwright install`) at `/ms-playwright`

**Mounted at run time:**
- the eval repo → `/work/eval` (code + configs editable, `results/` + `benchmark.json` persist to the host)
- `~/.claude/.credentials.json` → `/secrets/.credentials.json` (read-only; the only secret)

Runs as the non-root `node` user (uid 1000): Claude Code refuses
`--dangerously-skip-permissions` as root, and uid 1000 matches the host owner of
the bind-mounted repo so output stays writable.

## Build

```bash
docker/build.sh            # stages the deploys + test-app, then docker build
FORCE_DEPLOY=1 docker/build.sh   # re-deploy the validate tool (after rebuilding it)
```

`build.sh` runs `pnpm --filter … deploy` for validate and cli **package-scoped**
(never a monorepo-root build — that turbo cascade crashes the laptop). The
deploy is cached in `docker/marigold/`; delete it or set `FORCE_DEPLOY=1` to
refresh after rebuilding the tool in the Marigold repo.

## Run

```bash
docker/run.sh                          # full pending matrix, concurrency 1
docker/run.sh --filter haiku-bare-P-01 # one combo (substring on the run id)
docker/run.sh --reset=haiku-bare-P-01  # drop a combo's runs so it re-runs
```

Stop: `docker kill $(docker ps -q --filter ancestor=marigold-eval:latest)`.

**Do not `/login` while a run is active** — it rotates the OAuth token and the
mounted copy goes stale (subsequent runs 401).

## Isolation guarantees (per tier)

- **Fresh `CLAUDE_CONFIG_DIR` per run** → no shared/auto-loaded memory, no
  plugins, no user `CLAUDE.md`; `--setting-sources project` loads only the
  per-run hook settings.
- **Bare** (strict, model knowledge only): PreToolUse hooks block
  `marigold validate`, type-checking/building (`tsc`, `vite build`), and reading
  the installed `@marigold` package.
- **MCP-Stack**: docs MCP + Playwright; `marigold validate` blocked via
  `MARIGOLD_VALIDATE_DISABLED=1`.
- **Full-Stack**: adds `marigold validate` in the correction loop.
- **Measurement** runs `marigold validate` post-hoc for *every* tier (the
  disable flag is dropped for scoring), so the metric is independent of whether
  the tier had the tool during generation.

## Verifying a run is clean

Set `KEEP_CONFIG_DIR=1` and `CLAUDE_CONFIG_BASE=<bind-mounted dir>` to preserve
the session transcripts, then grep them for reads of `/memory/`, `plugins/`,
`rx-frontend`, `node_modules/@marigold`, or a Marigold source checkout — there
should be none. Omit both for real runs (config dirs are then discarded).
