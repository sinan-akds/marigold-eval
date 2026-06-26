# Hermetic eval environment

This runs the 270 run benchmark in an isolated container. A run on the host machine would inherit the local `~/.claude` state, which includes shared memory, installed plugins and the user `CLAUDE.md`. That state leaks Marigold knowledge into every tier and would invalidate the experiment. In the container each run gets a fresh empty `CLAUDE_CONFIG_DIR` with only the auth token copied in.

## What is baked in and what is mounted

Baked into the image is the frozen toolchain.

- Node 22, pnpm 10.15.1, the Claude Code CLI, `jq` and git
- the validate tool and its sibling `@marigold/cli` as self-contained deploy bundles under `/opt/marigold`
- `@marigold/theme-rui` at `/opt/theme-rui`
- the Vite and React test-app with installed deps, as a git repo, at `/work/test-app`
- Chromium at `/ms-playwright`

Mounted at run time is the eval repo at `/work/eval`, so code and configs stay editable and results persist to the host. The credentials file is mounted read-only at `/secrets/.credentials.json` and is the only secret.

The container runs as the non-root `node` user. Claude Code refuses `--dangerously-skip-permissions` as root, and uid 1000 matches the host owner of the mounted repo so output stays writable.

## Build

```bash
docker/build.sh            # stage the deploys and test-app, then build
FORCE_DEPLOY=1 docker/build.sh   # re-deploy the validate tool after rebuilding it
```

`build.sh` deploys validate and cli package-scoped. It never runs a monorepo-root build, because that turbo cascade crashes the laptop. The deploy is cached in `docker/marigold`. Delete it or set `FORCE_DEPLOY=1` to refresh after rebuilding the tool in the Marigold repo.

## Run

```bash
docker/run.sh                          # full pending matrix, concurrency 1
docker/run.sh --filter haiku-bare-P-01 # one combo, substring on the run id
docker/run.sh --reset=haiku-bare-P-01  # drop a combo's runs so it runs again
```

Stop a run with `docker kill $(docker ps -q --filter ancestor=marigold-eval:latest)`.

Do not run `/login` while a run is active. It rotates the OAuth token and the mounted copy goes stale, so later runs fail with 401.

## Isolation per tier

- Each run gets a fresh `CLAUDE_CONFIG_DIR`, so there is no shared memory, no plugins and no user `CLAUDE.md`. The flag `--setting-sources project` loads only the per-run hook settings.
- bare allows only the model's own knowledge. PreToolUse hooks block `marigold validate`, type-checking and building, and reading the installed `@marigold` package.
- mcp-stack adds the docs MCP and Playwright. `marigold validate` stays blocked through `MARIGOLD_VALIDATE_DISABLED=1`.
- full-stack adds `marigold validate` in the correction loop.
- Measurement runs `marigold validate` afterwards for every tier, with the disable flag dropped. So the metric does not depend on whether the tier had the tool during generation.

## Verifying a run is clean

Set `KEEP_CONFIG_DIR=1` and `CLAUDE_CONFIG_BASE` to a mounted directory to keep the session transcripts. Then grep them for reads of `/memory/`, `plugins/`, `rx-frontend`, `node_modules/@marigold` or a Marigold source checkout. There should be none. Leave both unset for real runs, the config dirs are then discarded.
