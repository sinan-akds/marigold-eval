#!/bin/bash
# PreToolUse hook (Read|Grep|Glob matcher) for the STRICT bare config.
# Prevents the model from reading Marigold API knowledge directly off disk:
# the bundled type declarations in node_modules/@marigold, or a Marigold source
# checkout. Reading/writing its OWN files stays allowed.
INPUT=$(cat)
# Read uses file_path; Grep/Glob use path/glob/pattern. Inspect all of them.
TARGET=$(echo "$INPUT" | jq -r '[.tool_input.file_path, .tool_input.path, .tool_input.glob, .tool_input.pattern] | map(select(. != null)) | join(" ")' 2>/dev/null)
[ -z "$TARGET" ] && TARGET="$INPUT"

if echo "$TARGET" | grep -qiE "node_modules/@marigold|reservix/marigold|/marigold/packages/components|/marigold/themes"; then
  echo "Reading the installed Marigold package is not available in this configuration." >&2
  exit 2
fi
exit 0
