#!/bin/bash
# PreToolUse hook (Bash matcher) for the STRICT bare config.
# Bare = parametric model knowledge only: the model may use its environment to
# build its OWN code, but must not extract Marigold API knowledge through any
# tool. This blocks, via the shell:
#   - marigold validate (the validation CLI)
#   - type-checking / building (tsc, vite build, pnpm build) — these surface
#     Marigold API correctness from the bundled @marigold type declarations
#   - direct introspection of the installed package (node -e require('@marigold'),
#     cat/grep/head/less/find over node_modules/@marigold or a marigold source repo)
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
