"""Load benchmark.json + evals.json into a pandas DataFrame."""

import json
import os
import pandas as pd
from .config import COMPLEXITY, PRESCRIPTIVE_IDS


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

        row = {
            "evalId": r["evalId"],
            "model": r["model"],
            "config": r["config"],
            "runNumber": r["runNumber"],
            "score": r["score"],
            "assertionPassRate": r.get("assertionPassRate"),
            "renderSuccess": detail.get("renderSuccess", False),
            "linesOfCode": detail.get("linesOfCode"),
            "costUsd": eff.get("costUsd"),
            "durationMs": eff.get("durationMs"),
            "totalTokens": eff.get("totalTokens"),
            "numTurns": eff.get("numTurns"),
            "complexity": COMPLEXITY.get(r["evalId"], "unknown"),
            "specificity": "prescriptive" if r["evalId"] in PRESCRIPTIVE_IDS else "intent",
        }

        for cat_id in ["A", "B", "C", "D", "E"]:
            cat = cats.get(cat_id, {})
            row[f"cat_{cat_id}"] = cat.get("score", 0) if cat else None
            row[f"cat_{cat_id}_errors"] = cat.get("errorCount", 0)
            row[f"cat_{cat_id}_warnings"] = cat.get("warningCount", 0)

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
            "renderSuccess": detail.get("renderSuccess", False),
            "error": r.get("error"),
        })

    df = pd.DataFrame(rows)
    if not df.empty:
        df["model"] = pd.Categorical(df["model"], categories=["haiku", "sonnet", "opus"], ordered=True)
        df["config"] = pd.Categorical(df["config"], categories=["bare", "mcp-stack", "full-stack"], ordered=True)
    return df
