#!/usr/bin/env bash
# Runs the eval inside the hermetic container.
#   docker/run.sh                          # full pending matrix, concurrency 1
#   docker/run.sh --filter haiku-bare-P-01 # pass-through eval flags
set -euo pipefail

EVAL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CREDS="${CLAUDE_CREDENTIALS:-$HOME/.claude/.credentials.json}"

[ -f "$CREDS" ] || { echo "No credentials at $CREDS"; exit 1; }

# use a TTY only when attached to one, so background runs don't fail with "not a TTY"
TTY=""
[ -t 0 ] && [ -t 1 ] && TTY="-it"

docker run --rm $TTY \
  -v "$EVAL_ROOT":/work/eval \
  -v "$CREDS":/secrets/.credentials.json:ro \
  marigold-eval:latest "$@"
