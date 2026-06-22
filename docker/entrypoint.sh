#!/usr/bin/env bash
set -euo pipefail

# The eval repo (code + configs + results) is bind-mounted at /work/eval.
cd /work/eval

# Install the eval's own deps if the bind-mounted node_modules is absent
# (e.g. first run on a fresh checkout). Frozen to the committed lockfile.
if [ ! -d node_modules ]; then
  echo "[entrypoint] installing eval deps..."
  pnpm install --frozen-lockfile
fi

# Auth: the mounted credentials file is the source for each run's fresh,
# throwaway CLAUDE_CONFIG_DIR (prepareConfigDir copies it in per run).
export CLAUDE_CREDENTIALS_SRC="${CLAUDE_CREDENTIALS_SRC:-/secrets/.credentials.json}"
if [ ! -f "$CLAUDE_CREDENTIALS_SRC" ]; then
  echo "[entrypoint] WARNING: no credentials at $CLAUDE_CREDENTIALS_SRC — runs will fail to auth." >&2
fi

# Toolchain paths are baked into the image (set as ENV in the Dockerfile):
#   MARIGOLD_VALIDATE_PKG, MARIGOLD_THEME_PATH, MARIGOLD_PROJECT_DIR
# EVAL_IN_CONTAINER lets the runner reap stray browsers after each run (only
# safe in here, not on a developer host).
export EVAL_IN_CONTAINER=1
# Place per-run worktrees OUTSIDE the eval repo (/work/eval) so the agent's cwd
# is isolated from results/, configs/, src/. Combined with the
# block-eval-internals hook, a run cannot read prior solutions or other tiers'
# prompts. /home/node is writable by the non-root user.
export WORKTREE_BASE=/home/node/eval-worktrees
mkdir -p "$WORKTREE_BASE"
# Concurrency 1 by default for a clean, race-free run; override via args.
echo "[entrypoint] starting eval (validate=$MARIGOLD_VALIDATE_PKG, app=$MARIGOLD_PROJECT_DIR)"
exec pnpm eval --concurrency 1 "$@"
