#!/bin/bash
# PreToolUse hook (Bash|Read|Grep|Glob) for all tiers.
# The eval repo is mounted at /work/eval. Without this hook the agent could read
# prior runs' solutions, the other tiers' prompts, or the harness code, which
# would invalidate the experiment. Block any tool access into /work/eval.
INPUT=$(cat)
TARGET=$(echo "$INPUT" | jq -r '[.tool_input.command, .tool_input.file_path, .tool_input.path, .tool_input.glob, .tool_input.pattern] | map(select(. != null)) | join(" ")' 2>/dev/null)
[ -z "$TARGET" ] && TARGET="$INPUT"

# the worktree lives elsewhere, so a legitimate run never needs /work/eval
if echo "$TARGET" | grep -qE '/work/eval(/|[[:space:]]|$)'; then
  echo "Access to the eval harness directory is not available in this configuration." >&2
  exit 2
fi
exit 0
