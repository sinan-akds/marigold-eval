#!/usr/bin/env bash
# Delete a single eval run from disk and rebuild benchmark.json, so the combo
# is open again on the next `pnpm eval`.
#
#   bash scripts/del-run.sh <model> <config> <prompt> <run>
#
# Examples (short or long form both work):
#   bash scripts/del-run.sh haiku full p10 r3
#   bash scripts/del-run.sh haiku full-stack P-10 3
#
# config:  bare | mcp | full   (or bare | mcp-stack | full-stack)
# prompt:  p10 | P-10 | 10
# run:     r3  | 3
#
# With --rerun it queues a fresh run of the same combo right after.
set -euo pipefail
cd "$(dirname "$0")/.."

rerun=0
args=()
for a in "$@"; do
  if [ "$a" = "--rerun" ]; then rerun=1; else args+=("$a"); fi
done

if [ "${#args[@]}" -ne 4 ]; then
  echo "usage: bash scripts/del-run.sh <model> <config> <prompt> <run> [--rerun]" >&2
  echo "  e.g. bash scripts/del-run.sh haiku full p10 r3" >&2
  exit 2
fi

m="${args[0]}"
c="${args[1]}"
p="${args[2]}"
r="${args[3]}"

case "$c" in
  bare)            c=bare ;;
  mcp|mcp-stack)   c=mcp-stack ;;
  full|full-stack) c=full-stack ;;
  *) echo "unknown config: $c (use bare|mcp|full)" >&2; exit 2 ;;
esac

p="${p#[pP]}"; p="${p#-}"          # p10 / P-10 / 10 -> 10
p=$((10#$p))                         # force base 10 (08/09 would be invalid octal)
p="$(printf 'P-%02d' "$p")"         # 9 -> P-09
r="${r#[rR]}"                        # r3 -> 3

combo="$m-$c-$p-r$r"
dir="results/$m-$c/$p/run-$r"
mirror="results/runs/$combo"

# never touch benchmark.json while an eval container is writing it
if docker ps --format '{{.Image}}' 2>/dev/null | grep -q '^marigold-eval'; then
  echo "ABORT: a marigold-eval container is running and writing benchmark.json." >&2
  echo "Stop it first (pkill -f run-until-complete.sh; docker stop ...), then retry." >&2
  exit 3
fi

had_dir=0
[ -d "$dir" ] || [ -d "$mirror" ] && had_dir=1

cp -f benchmark.json benchmark.json.bak

# 1) remove the run directories if present
rm -rf "$dir" "$mirror"

# 2) remove the record straight from benchmark.json, this also catches phantom
#    records that have no result.json on disk
node -e '
const fs=require("fs");
const combo=process.argv[1];
const bm=JSON.parse(fs.readFileSync("benchmark.json","utf8"));
const cid=r=>`${r.model}-${r.config}-${r.evalId}-r${r.runNumber}`;
const before=bm.runs.length;
bm.runs=bm.runs.filter(r=>cid(r)!==combo);
fs.writeFileSync("benchmark.json",JSON.stringify(bm,null,2)+"\n");
console.error(`  benchmark.json: removed ${before-bm.runs.length} record(s) for ${combo}`);
' "$combo"

# 3) rebuild the summaries from the cleaned-up disk state
tsx rebuild-benchmark.ts >/dev/null

if [ "$had_dir" -eq 1 ]; then
  echo "deleted: $combo (directory + record, benchmark.json rebuilt, backup: benchmark.json.bak)"
else
  echo "no directory for $combo, removed record/phantom from benchmark.json only (backup: benchmark.json.bak)"
fi

if [ "$rerun" -eq 1 ]; then
  echo "starting rerun for $combo ..."
  pnpm eval --filter "$combo"
fi
