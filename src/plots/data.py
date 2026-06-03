"""Load benchmark.json + evals.json into a pandas DataFrame."""

import json
import os
import pandas as pd
from .config import COMPLEXITY


def load(root_dir: str) -> pd.DataFrame:
    bm_path = os.path.join(root_dir, "benchmark.json")
    with open(bm_path) as f:
        bm = json.load(f)

    rows = []
    for r in bm.get("runs", []):
        if r.get("score") is None:
            continue

        detail = r.get("detail") or {}
        eff = r.get("efficiency") or {}
        cats = detail.get("categories") or {}

        loc = detail.get("linesOfCode")
        # requiredPassRate is part of the data contract (area C emits it into
        # result.json; rebuild-benchmark plumbs it onto detail). Read it
        # defensively from detail first, then top-level, default None: old
        # benchmark.json data simply lacks it.
        required_pass_rate = detail.get("requiredPassRate")
        if required_pass_rate is None:
            required_pass_rate = r.get("requiredPassRate")

        row = {
            "evalId": r["evalId"],
            "model": r["model"],
            "config": r["config"],
            "runNumber": r["runNumber"],
            "score": r["score"],
            "assertionPassRate": r.get("assertionPassRate"),
            "requiredPassRate": required_pass_rate,
            "renderSuccess": bool(detail.get("renderSuccess", False)),
            "linesOfCode": loc,
            # Desktop width utilisation (0..1); None for runs scored before the
            # metric existed or that did not render.
            "widthUtilization": detail.get("widthUtilization"),
            "costUsd": eff.get("costUsd"),
            "durationMs": eff.get("durationMs"),
            "totalTokens": eff.get("totalTokens"),
            "numTurns": eff.get("numTurns"),
            "complexity": COMPLEXITY.get(r["evalId"], "unknown"),
        }

        for cat_id in ["A", "B", "C", "D", "E"]:
            cat = cats.get(cat_id)
            present = bool(cat)
            row[f"cat_{cat_id}"] = cat.get("score", 0) if present else None
            row[f"cat_{cat_id}_errors"] = cat.get("errorCount", 0) if present else None
            row[f"cat_{cat_id}_warnings"] = cat.get("warningCount", 0) if present else None
            # Error-free flag per category: a deterministic read of the raw error
            # count, not a new check. An ABSENT category (never evaluated) is None,
            # NOT 1 — otherwise a result.json that omits a category would be
            # reported as 100% error-free, the exact "looks clean but was never
            # checked" false positive this pipeline must avoid. plot 15 averages
            # this flag and pandas skips None/NaN, so an absent category is
            # excluded rather than inflating the error-free rate. Whether D is
            # meaningful is additionally gated on renderSuccess at plot time.
            row[f"cat_{cat_id}_errorfree"] = int(row[f"cat_{cat_id}_errors"] == 0) if present else None

        # Raw totals (score-free metrics): summed across all categories. An absent
        # category contributes no observed errors/warnings (None treated as 0 here)
        # — the total is over what was actually evaluated.
        row["n_errors"] = sum(row[f"cat_{c}_errors"] or 0 for c in ["A", "B", "C", "D", "E"])
        row["n_warnings"] = sum(row[f"cat_{c}_warnings"] or 0 for c in ["A", "B", "C", "D", "E"])

        # Errors per 100 LOC: normalizes raw error counts by component size so a
        # large component is not unfairly penalized vs a tiny one. None (never 0
        # or inf) when LOC is missing/non-positive — divide-by-zero is impossible
        # and a missing-LOC run is excluded from the normalized view rather than
        # scored as flawless.
        if loc and loc > 0:
            row["errors_per_100loc"] = row["n_errors"] / loc * 100
        else:
            row["errors_per_100loc"] = None

        issue_sources = detail.get("issueSources") or {}
        row["issueSources"] = issue_sources

        rows.append(row)

    df = pd.DataFrame(rows)
    if df.empty:
        return df

    df["model"] = pd.Categorical(df["model"], categories=["haiku", "sonnet", "opus"], ordered=True)
    df["config"] = pd.Categorical(df["config"], categories=["bare", "mcp-stack", "full-stack"], ordered=True)
    df["complexity"] = pd.Categorical(df["complexity"], categories=["low", "medium", "high"], ordered=True)

    return df


def load_all_runs(root_dir: str) -> pd.DataFrame:
    """Load all runs including those with score=None (for render success rate)."""
    bm_path = os.path.join(root_dir, "benchmark.json")
    with open(bm_path) as f:
        bm = json.load(f)

    rows = []
    for r in bm.get("runs", []):
        detail = r.get("detail") or {}
        rows.append({
            "evalId": r["evalId"],
            "model": r["model"],
            "config": r["config"],
            "score": r.get("score"),
            "renderSuccess": bool(detail.get("renderSuccess", False)),
            "error": r.get("error"),
        })

    df = pd.DataFrame(rows)
    if not df.empty:
        df["model"] = pd.Categorical(df["model"], categories=["haiku", "sonnet", "opus"], ordered=True)
        df["config"] = pd.Categorical(df["config"], categories=["bare", "mcp-stack", "full-stack"], ordered=True)
    return df
