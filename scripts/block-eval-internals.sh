#!/bin/bash
# PreToolUse hook (Bash|Read|Grep|Glob) for ALL tiers.
# The agent's cwd is its own worktree (outside /work/eval when WORKTREE_BASE is
# set). The eval repo is still mounted at /work/eval, so without this hook the
# agent could read prior runs' solutions (results/), the other tiers' system
# prompts (configs/), the harness/scoring code (src/), or benchmark.json — all
# of which would invalidate the experiment. This blocks any tool access whose
# target points into /work/eval. The agent only ever needs its worktree +
# node_modules + the theme, none of which are under /work/eval.
INPUT=$(cat)
TARGET=$(echo "$INPUT" | jq -r '[.tool_input.command, .tool_input.file_path, .tool_input.path, .tool_input.glob, .tool_input.pattern] | map(select(. != null)) | join(" ")' 2>/dev/null)
[ -z "$TARGET" ] && TARGET="$INPUT"

# Block references to the eval repo internals. The worktree lives elsewhere
# (WORKTREE_BASE=/work), so a legitimate run never needs /work/eval.
if echo "$TARGET" | grep -qE '/work/eval(/|[[:space:]]|$)'; then
  echo "Access to the eval harness directory is not available in this configuration." >&2
  exit 2
fi
exit 0
