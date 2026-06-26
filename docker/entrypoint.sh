#!/usr/bin/env bash
set -euo pipefail

# The eval repo (code + configs + results) is bind-mounted at /work/eval.
cd /work/eval

# install the eval's deps if the bind-mounted node_modules is absent, frozen to the lockfile
if [ ! -d node_modules ]; then
  echo "[entrypoint] installing eval deps..."
  pnpm install --frozen-lockfile
fi

# the mounted credentials file seeds each run's throwaway CLAUDE_CONFIG_DIR
export CLAUDE_CREDENTIALS_SRC="${CLAUDE_CREDENTIALS_SRC:-/secrets/.credentials.json}"
if [ ! -f "$CLAUDE_CREDENTIALS_SRC" ]; then
  echo "[entrypoint] WARNING: no credentials at $CLAUDE_CREDENTIALS_SRC, runs will fail to auth." >&2
fi

# toolchain paths are baked into the image. EVAL_IN_CONTAINER lets the runner reap stray browsers (safe only here)
export EVAL_IN_CONTAINER=1
# per-run worktrees live outside the eval repo so the agent cannot read other runs or tiers
export WORKTREE_BASE=/home/node/eval-worktrees
mkdir -p "$WORKTREE_BASE"
# concurrency 1 by default for a race-free run, override via args
echo "[entrypoint] starting eval (validate=$MARIGOLD_VALIDATE_PKG, app=$MARIGOLD_PROJECT_DIR)"
exec pnpm eval --concurrency 1 "$@"
