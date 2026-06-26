#!/bin/bash
# PreToolUse hook (Bash) for the bare config.
# Bare uses only the model's own knowledge, so this blocks shell access to Marigold API knowledge:
#   - marigold validate
#   - type-checking and building (tsc, vite build, pnpm build), which surface Marigold types
#   - inspecting the installed @marigold package or a Marigold source checkout
# A bare run still has Bash/Read/Write/Edit for its own files.
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$CMD" ] && CMD="$INPUT"

deny() { echo "$1" >&2; exit 2; }

# 1) Validation CLI
echo "$CMD" | grep -qiE 'marigold[ ._-]validate' \
  && deny "The marigold validate CLI is not available in this configuration."

# 2) Type-checking / building (leaks Marigold API via @marigold typedefs)
echo "$CMD" | grep -qiE '(^|[^a-z])(tsc|tsgo)([^a-z]|$)|--noEmit|vite +build|(pnpm|npm|npx|yarn)( +exec| +run)? +(build|tsc|typecheck|type-check)' \
  && deny "Type-checking and building are not available in this configuration. Write the component from your own knowledge."

# 3) Introspecting the installed package or a Marigold source checkout
echo "$CMD" | grep -qiE "node_modules/@marigold|require\(['\"]@marigold|reservix/marigold|/marigold/packages/components|@marigold/[a-z-]+/(dist|src)" \
  && deny "Inspecting the installed Marigold package is not available in this configuration."

exit 0
