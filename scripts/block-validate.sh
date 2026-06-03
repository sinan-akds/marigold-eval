#!/bin/bash
# PreToolUse hook: blocks marigold validate commands.
# Used in bare/mcp-stack eval configs to prevent tool contamination.
INPUT=$(cat)
# Inspect only the Bash command being run, not the whole JSON envelope.
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$CMD" ] && CMD="$INPUT"
if echo "$CMD" | grep -qiE 'marigold[ ._-]validate'; then
  echo "The marigold validate CLI is not available in this configuration."
  exit 2
fi
exit 0
