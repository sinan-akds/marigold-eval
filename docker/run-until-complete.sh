#!/usr/bin/env bash
# Resilient full-matrix runner. The container can be OOM-killed, so each run is
# saved to benchmark.json immediately and completed combos are skipped. Relaunch
# until the matrix is complete, reaping orphaned browsers between attempts.
#
#   docker/run-until-complete.sh [TARGET] [MAX_ATTEMPTS]
#   TARGET        expected run count (default 270)
#   MAX_ATTEMPTS  give up after this many container launches (default 40)
#
# Optional FILTER env var restricts the eval and the progress count to combos
# whose id contains the substring, e.g. FILTER=sonnet docker/run-until-complete.sh 90
set -uo pipefail

EVAL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-270}"
MAX_ATTEMPTS="${2:-40}"
FILTER="${FILTER:-}"

count() {  # valid (non-error) runs in benchmark.json, restricted to FILTER if set
  python3 -c "
import json
f='$FILTER'
runs=json.load(open('$EVAL_ROOT/benchmark.json')).get('runs',[])
cid=lambda r: f\"{r['model']}-{r['config']}-{r['evalId']}-r{r['runNumber']}\"
print(len([r for r in runs if (not r.get('error')) and (f in cid(r))]))
" 2>/dev/null || echo 0
}

reap() {  # kill host-orphaned eval browsers (NOT the developer's own sessions)
  pkill -9 -f "ms-playwright.*headless_shell" 2>/dev/null || true
  pkill -9 -f "/work/test-app" 2>/dev/null || true
  pkill -9 -f "marigold-validate" 2>/dev/null || true
}

attempt=0
while [ "$(count)" -lt "$TARGET" ] && [ "$attempt" -lt "$MAX_ATTEMPTS" ]; do
  attempt=$((attempt + 1))
  have=$(count)
  echo "attempt $attempt/$MAX_ATTEMPTS, $have/$TARGET runs done${FILTER:+ (filter: $FILTER)}"
  if [ -n "$FILTER" ]; then
    "$EVAL_ROOT/docker/run.sh" --filter "$FILTER" || echo "  (container exited non-zero, likely OOM, relaunching)"
  else
    "$EVAL_ROOT/docker/run.sh" || echo "  (container exited non-zero, likely OOM, relaunching)"
  fi
  reap
  sleep 3   # let the kernel reclaim before the next container
done

final=$(count)
if [ "$final" -ge "$TARGET" ]; then
  echo "✓ complete: $final/$TARGET runs"
else
  echo "✗ stopped at $final/$TARGET after $attempt attempts, inspect before retrying"
  exit 1
fi
