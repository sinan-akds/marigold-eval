#!/usr/bin/env python3
"""Sensitivity analysis for the assertion pass rate (thesis leitmetrik).

The assertion pass rate is the primary, tool-independent quality metric. A few
of its criteria, however, overlap conceptually with checks the validate tool
also performs (raw-HTML avoidance, the onClick convention, importing from
@marigold/components). This script recomputes the rate with those overlapping
criteria removed and re-runs the primary MCP-Stack -> Full-Stack comparison, to
show the headline result does not hinge on the leaky criteria.

Reads results/<model>-<config>/<prompt>/run-N/result.json directly (the raw
per-assertion outcomes), independent of benchmark.json. Read-only.

Usage:  python3 sensitivity-assertions.py
"""
import glob
import json
import os
import re
import statistics as st

OVERLAP = {"a-import-marigold", "a-no-onclick-on-marigold", "a-no-raw-html"}
ROOT = os.path.dirname(os.path.abspath(__file__))

try:
    from scipy.stats import wilcoxon
    HAS_SCIPY = True
except Exception:
    HAS_SCIPY = False


def pass_rate(assertions, drop_overlap):
    """Unweighted pass rate over all criteria, optionally excluding the
    tool-overlapping ones."""
    items = (assertions.get("passed", []) or []) + (assertions.get("failed", []) or [])
    if drop_overlap:
        items = [a for a in items if a.get("id") not in OVERLAP]
    if not items:
        return None
    passed = sum(1 for a in items if a.get("passed"))
    return passed / len(items)


def collect():
    """rows: (model, config, prompt, run, apr_full, apr_no_overlap)."""
    rows = []
    for f in glob.glob(os.path.join(ROOT, "results/*-*/P-*/run-*/result.json")):
        m = re.search(r"/(haiku|sonnet|opus)-(bare|mcp-stack|full-stack)/(P-\d\d)/run-(\d)/", f)
        if not m:
            continue
        try:
            a = json.load(open(f)).get("assertions", {})
        except Exception:
            continue
        rows.append((m.group(1), m.group(2), m.group(3),
                     pass_rate(a, False), pass_rate(a, True)))
    return rows


def paired_by_prompt(rows, model, cfg_a, cfg_b, col):
    """Per-prompt median of `col` (3=full apr, 4=no-overlap apr), paired across
    the two configs on shared prompts. Returns (a_vals, b_vals)."""
    def by_prompt(cfg):
        d = {}
        for r in rows:
            if r[0] == model and r[1] == cfg and r[col] is not None:
                d.setdefault(r[2], []).append(r[col])
        return {p: st.median(v) for p, v in d.items()}
    A, B = by_prompt(cfg_a), by_prompt(cfg_b)
    common = sorted(set(A) & set(B))
    return [A[p] for p in common], [B[p] for p in common]


def main():
    rows = collect()
    print(f"runs read: {len(rows)}\n")
    print(f"{'model':7} {'metric':18} | n | med MCP | med Full | diff | p")
    for model in ["haiku", "sonnet", "opus"]:
        for label, col in [("apr (all)", 3), ("apr (no-overlap)", 4)]:
            a, b = paired_by_prompt(rows, model, "mcp-stack", "full-stack", col)
            n = len(a)
            if n == 0:
                print(f"{model:7} {label:18} | 0 | -       | -        | -    | -")
                continue
            ma, mb = st.median(a), st.median(b)
            nz = [y - x for x, y in zip(a, b) if y != x]
            p = "-"
            if HAS_SCIPY and len(nz) >= 6:
                try:
                    p = f"{wilcoxon(a, b, zero_method='wilcox').pvalue:.4f}"
                except Exception:
                    p = "n/a"
            elif n < 6:
                p = f"n<6 ({n})"
            print(f"{model:7} {label:18} | {n} | {ma:.3f}   | {mb:.3f}    | {mb-ma:+.3f} | {p}")
    print("\nReading: if 'apr (all)' and 'apr (no-overlap)' point the same way,")
    print("the MCP->Full result does not depend on the tool-overlapping criteria.")


if __name__ == "__main__":
    main()
