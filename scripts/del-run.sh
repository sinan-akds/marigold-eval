#!/usr/bin/env bash
# Loescht einen einzelnen Eval-Run von Platte und baut benchmark.json neu auf,
# sodass das Combo beim naechsten `pnpm eval` wieder als offen gilt.
#
#   bash scripts/del-run.sh <model> <config> <prompt> <run>
#
# Beispiele (kurz- oder Langform werden beide akzeptiert):
#   bash scripts/del-run.sh haiku full p10 r3
#   bash scripts/del-run.sh haiku full-stack P-10 3
#
# config:  bare | mcp | full   (oder bare | mcp-stack | full-stack)
# prompt:  p10 | P-10 | 10
# run:     r3  | 3
#
# Mit --rerun haengt es direkt einen Neulauf genau dieses Combos an.
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

p="${p#[pP]}"; p="${p#-}"          # p10 / P-10 / 10  ->  10 ; p09 -> 09
p=$((10#$p))                         # Basis-10 erzwingen (sonst ist 08/09 ungueltiges Oktal)
p="$(printf 'P-%02d' "$p")"         # 9 -> P-09
r="${r#[rR]}"                        # r3 -> 3

combo="$m-$c-$p-r$r"
dir="results/$m-$c/$p/run-$r"
mirror="results/runs/$combo"

# Race-Schutz: nie benchmark.json anfassen, waehrend ein Eval-Container schreibt.
if docker ps --format '{{.Image}}' 2>/dev/null | grep -q '^marigold-eval'; then
  echo "ABBRUCH: ein marigold-eval-Container laeuft gerade — er schreibt benchmark.json." >&2
  echo "Erst stoppen (pkill -f run-until-complete.sh; docker stop ...), dann erneut." >&2
  exit 3
fi

had_dir=0
[ -d "$dir" ] || [ -d "$mirror" ] && had_dir=1

cp -f benchmark.json benchmark.json.bak

# 1) Disk-Verzeichnisse weg (falls vorhanden).
rm -rf "$dir" "$mirror"

# 2) Record direkt aus benchmark.json entfernen — faengt auch Phantom-Records
#    ab (in benchmark.json, aber ohne result.json auf Platte), die ein reiner
#    Disk-rebuild zwar ebenfalls droppt, die aber sonst nie angefasst wuerden,
#    wenn gar kein Verzeichnis existiert.
node -e '
const fs=require("fs");
const combo=process.argv[1];
const bm=JSON.parse(fs.readFileSync("benchmark.json","utf8"));
const cid=r=>`${r.model}-${r.config}-${r.evalId}-r${r.runNumber}`;
const before=bm.runs.length;
bm.runs=bm.runs.filter(r=>cid(r)!==combo);
fs.writeFileSync("benchmark.json",JSON.stringify(bm,null,2)+"\n");
console.error(`  benchmark.json: ${before-bm.runs.length} Record(s) fuer ${combo} entfernt`);
' "$combo"

# 3) Summaries konsistent neu aus der (jetzt bereinigten) Platte aufbauen.
tsx rebuild-benchmark.ts >/dev/null

if [ "$had_dir" -eq 1 ]; then
  echo "geloescht: $combo (Verzeichnis + Record, benchmark.json neu gebaut, Backup: benchmark.json.bak)"
else
  echo "kein Verzeichnis fuer $combo gefunden — nur Record/Phantom aus benchmark.json entfernt (Backup: benchmark.json.bak)"
fi

if [ "$rerun" -eq 1 ]; then
  echo "starte Neulauf fuer $combo ..."
  pnpm eval --filter "$combo"
fi
