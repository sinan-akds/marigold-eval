#!/bin/bash
# PreToolUse hook: in the full-stack eval config, REQUIRE that marigold validate
# runs ALL checks. Reject `marigold validate ... --checks technical|spatial|a11y`
# (the deprecated staged subsets) and tell the agent to run the full suite.
# A bare `marigold validate src/TestApp.tsx` (no --checks) passes through.
INPUT=$(cat)
# Inspect only the Bash command being run, not the whole JSON envelope, so a
# mention of validate in some other field can never trigger a false block.
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$CMD" ] && CMD="$INPUT"
if echo "$CMD" | grep -qiE 'marigold[ ._-]validate' \
  && echo "$CMD" | grep -qiE -- '--checks[= ]+"?(technical|spatial|a11y)'; then
  echo "Do not pass --checks. Run the full validation suite with all checks: marigold validate src/TestApp.tsx"
  exit 2
fi
exit 0
