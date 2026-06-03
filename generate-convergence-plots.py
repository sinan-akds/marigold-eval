#!/usr/bin/env python3
"""Generate convergence analysis plots from iteration-data.json."""

import json
import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "iteration-data.json")
OUT_DIR = os.path.join(SCRIPT_DIR, "plots")
os.makedirs(OUT_DIR, exist_ok=True)

with open(DATA_FILE) as f:
    data = json.load(f)

# ── FINDING 6: single-scope convergence ────────────────────────────────
# ~62% of validate calls are `--checks technical`; mixing scopes and
# forward-filling a narrow scope makes a run look "converged" when whole
# check families (spatial/a11y) were simply never run. We therefore filter
# each run's validate calls to ONE coherent scope before building any
# convergence series. SCOPE="all" is the only scope that exercises every
# check family, so it is the honest default; pad only within the same scope.
SCOPE = "all"


def scope_calls(run, scope=SCOPE):
    """Validate calls of `run` restricted to a single --checks scope."""
    return [c for c in run.get("validateCallDetails", []) if c.get("checks") == scope]


TOTAL_FS = len([r for r in data["runs"] if r["config"] == "full-stack"])
TOTAL_FS_SESSION = len([r for r in data["runs"]
                        if r["config"] == "full-stack" and r["hasSessionData"]])

# Runs analyzable for convergence: full-stack, session data, and ≥2 calls in
# the chosen scope (so a trend exists within one coherent check scope).
fs_runs = [r for r in data["runs"]
           if r["config"] == "full-stack" and r["hasSessionData"]
           and len(scope_calls(r)) >= 2]

# Per-scope coverage report (finding 6): how many full-stack runs have ≥2
# same-scope calls for each scope, so the sparsity is explicit, not hidden.
print(f"Full-stack runs: {TOTAL_FS} total, {TOTAL_FS_SESSION} with session data")
for sc in ["all", "technical", "spatial", "a11y"]:
    n = len([r for r in data["runs"]
             if r["config"] == "full-stack" and r["hasSessionData"]
             and len([c for c in r.get("validateCallDetails", []) if c.get("checks") == sc]) >= 2])
    print(f"  scope '{sc}': {n} runs with ≥2 same-scope validate calls")
print(f"Convergence analyzed on scope '{SCOPE}': n={len(fs_runs)} of {TOTAL_FS} full-stack")

COV = f"scope={SCOPE}, n={len(fs_runs)} of {TOTAL_FS} full-stack runs"

COLORS = {"haiku": "#2196F3", "sonnet": "#FF9800", "opus": "#4CAF50"}

# --- Plot 1: Error convergence curve (avg errors per validate iteration) ---
def plot_convergence_curve():
    fig, ax = plt.subplots(figsize=(8, 5))

    by_model = {}
    for r in fs_runs:
        model = r["model"]
        if model not in by_model:
            by_model[model] = []
        calls = scope_calls(r)  # single scope only (finding 6)
        errors = [c["errorCount"] for c in calls]
        by_model[model].append(errors)

    max_iters = 15
    for model, all_errors in sorted(by_model.items()):
        padded = []
        for errors in all_errors:
            e = errors[:max_iters]
            # Forward-fill only within this same-scope subsequence, capped at the
            # last REAL same-scope value (never fills across scopes any more).
            if len(e) < max_iters:
                e = e + [e[-1]] * (max_iters - len(e))
            padded.append(e)

        arr = np.array(padded)
        median = np.median(arr, axis=0)
        q25 = np.percentile(arr, 25, axis=0)
        q75 = np.percentile(arr, 75, axis=0)
        x = np.arange(1, max_iters + 1)

        color = COLORS.get(model, "#999")
        ax.plot(x, median, '-o', color=color, label=f"{model} (n={len(all_errors)})", markersize=4)
        ax.fill_between(x, q25, q75, alpha=0.15, color=color)

    ax.set_xlabel("Validate Iteration (same-scope)")
    ax.set_ylabel("Error Count (median, IQR band)")
    ax.set_title(f"Error Convergence Over Validate Iterations (Full-Stack)\n{COV}")
    ax.legend()
    ax.set_xlim(1, max_iters)
    ax.set_ylim(bottom=0)
    ax.grid(True, alpha=0.3)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "08_convergence_errors.png"), dpi=150)
    plt.close(fig)
    print("  → 08_convergence_errors.png")


# --- Plot 2: Warning convergence curve ---
def plot_warning_convergence():
    fig, ax = plt.subplots(figsize=(8, 5))

    by_model = {}
    for r in fs_runs:
        model = r["model"]
        if model not in by_model:
            by_model[model] = []
        calls = scope_calls(r)  # single scope only (finding 6)
        warnings = [c["warningCount"] for c in calls]
        by_model[model].append(warnings)

    max_iters = 15
    for model, all_warnings in sorted(by_model.items()):
        padded = []
        for warns in all_warnings:
            w = warns[:max_iters]
            # same-scope forward-fill only
            if len(w) < max_iters:
                w = w + [w[-1]] * (max_iters - len(w))
            padded.append(w)

        arr = np.array(padded)
        median = np.median(arr, axis=0)
        q25 = np.percentile(arr, 25, axis=0)
        q75 = np.percentile(arr, 75, axis=0)
        x = np.arange(1, max_iters + 1)

        color = COLORS.get(model, "#999")
        ax.plot(x, median, '-s', color=color, label=f"{model} (n={len(all_warnings)})", markersize=4)
        ax.fill_between(x, q25, q75, alpha=0.15, color=color)

    ax.set_xlabel("Validate Iteration (same-scope)")
    ax.set_ylabel("Warning Count (median, IQR band)")
    ax.set_title(f"Warning Convergence Over Validate Iterations (Full-Stack)\n{COV}")
    ax.legend()
    ax.set_xlim(1, max_iters)
    ax.set_ylim(bottom=0)
    ax.grid(True, alpha=0.3)

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "09_convergence_warnings.png"), dpi=150)
    plt.close(fig)
    print("  → 09_convergence_warnings.png")


# --- Plot 3: Validate calls per run (violin/box by model) ---
def plot_validate_call_count():
    fig, ax = plt.subplots(figsize=(7, 5))

    # Total validate calls per run is a tool-use metric (all scopes count); use
    # full-stack runs with session data so the population matches the others.
    fs_session = [r for r in data["runs"]
                  if r["config"] == "full-stack" and r["hasSessionData"]]
    by_model = {}
    for r in fs_session:
        model = r["model"]
        if model not in by_model:
            by_model[model] = []
        by_model[model].append(len(r["validateCallDetails"]))

    models = sorted(by_model.keys())
    positions = range(len(models))

    for i, model in enumerate(models):
        counts = by_model[model]
        color = COLORS.get(model, "#999")
        bp = ax.boxplot([counts], positions=[i], widths=0.5, patch_artist=True,
                       boxprops=dict(facecolor=color, alpha=0.4),
                       medianprops=dict(color=color, linewidth=2))
        ax.scatter([i] * len(counts), counts, color=color, alpha=0.5, zorder=3, s=20)

    ax.set_xticks(list(positions))
    ax.set_xticklabels([f"{m}\n(n={len(by_model[m])})" for m in models])
    ax.set_ylabel("Validate Calls per Run (all scopes)")
    ax.set_title(f"Number of Validate Calls per Run (Full-Stack)\n"
                 f"all scopes, n={len(fs_session)} of {TOTAL_FS} full-stack runs")
    ax.grid(True, alpha=0.3, axis='y')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "10_validate_call_count.png"), dpi=150)
    plt.close(fig)
    print("  → 10_validate_call_count.png")


# --- Plot 4: Issue source breakdown across iterations (stacked area) ---
def plot_issue_source_breakdown():
    fig, ax = plt.subplots(figsize=(9, 5))

    max_iters = 12
    source_types = ["technical", "spatial", "style", "a11y"]
    source_colors = {"technical": "#E53935", "spatial": "#1E88E5", "style": "#FDD835", "a11y": "#43A047"}

    by_source_iter = {s: np.zeros(max_iters) for s in source_types}
    counts_per_iter = np.zeros(max_iters)

    for r in fs_runs:
        calls = scope_calls(r)[:max_iters]  # single scope only (finding 6)
        for i, c in enumerate(calls):
            counts_per_iter[i] += 1
            for src, counts in c.get("bySource", {}).items():
                if src in by_source_iter:
                    by_source_iter[src][i] += counts["errors"] + counts["warnings"]

    x = np.arange(1, max_iters + 1)
    safe_counts = np.where(counts_per_iter > 0, counts_per_iter, 1)

    bottoms = np.zeros(max_iters)
    for src in source_types:
        avg = by_source_iter[src] / safe_counts
        ax.bar(x, avg, bottom=bottoms, label=src, color=source_colors[src], alpha=0.8, width=0.7)
        bottoms += avg

    ax.set_xlabel("Validate Iteration (same-scope)")
    ax.set_ylabel("Avg Issues per Run")
    ax.set_title(f"Issue Sources Across Validate Iterations (Full-Stack)\n{COV}")
    ax.legend(loc="upper right")
    ax.set_xlim(0.4, max_iters + 0.6)
    ax.set_ylim(bottom=0)
    ax.grid(True, alpha=0.3, axis='y')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "11_issue_source_iterations.png"), dpi=150)
    plt.close(fig)
    print("  → 11_issue_source_iterations.png")


# --- Plot 5: First vs Last error count (scatter) ---
def plot_first_vs_last():
    fig, ax = plt.subplots(figsize=(6, 6))

    # Recompute first/last from same-scope calls (finding 6): the precomputed
    # convergence in iteration-data.json spans mixed scopes, which is exactly
    # the contamination we want to avoid here.
    pairs = []
    for r in fs_runs:
        calls = scope_calls(r)
        if len(calls) < 2:
            continue
        pairs.append((r["model"], calls[0]["errorCount"], calls[-1]["errorCount"]))

    for model, first_e, last_e in pairs:
        color = COLORS.get(model, "#999")
        ax.scatter(first_e, last_e, color=color, alpha=0.6, s=50,
                   label=model if model not in [a.get_label() for a in ax.collections] else "")

    max_val = (max((p[1] for p in pairs), default=0)) + 2
    ax.plot([0, max_val], [0, max_val], 'k--', alpha=0.3, label="no improvement")
    ax.set_xlabel("Errors (First same-scope Validate Call)")
    ax.set_ylabel("Errors (Last same-scope Validate Call)")
    ax.set_title(f"Error Reduction: First vs Last Validate Call\n{COV}")

    handles, labels = ax.get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    ax.legend(by_label.values(), by_label.keys())

    ax.set_xlim(-0.5, max_val)
    ax.set_ylim(-0.5, max(3, max((p[2] for p in pairs), default=0) + 1))
    ax.grid(True, alpha=0.3)
    ax.set_aspect('equal')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "12_first_vs_last_errors.png"), dpi=150)
    plt.close(fig)
    print("  → 12_first_vs_last_errors.png")


# --- Plot 6: Tool usage comparison by config ---
def plot_tool_usage_by_config():
    fig, ax = plt.subplots(figsize=(8, 5))

    configs = {}
    for r in data["runs"]:
        if not r["hasSessionData"]:
            continue
        cfg = r["config"]
        if cfg not in configs:
            configs[cfg] = {"validate": [], "mcp": [], "edit": [], "bash": [], "read": [], "write": []}
        configs[cfg]["validate"].append(r["validateCalls"])
        configs[cfg]["mcp"].append(r["mcpCalls"])
        configs[cfg]["edit"].append(r["editCalls"])
        configs[cfg]["bash"].append(r["bashCalls"])
        configs[cfg]["read"].append(r["readCalls"])
        configs[cfg]["write"].append(r["writeCalls"])

    config_order = ["bare", "mcp-stack", "full-stack"]
    tool_types = ["validate", "mcp", "edit", "write", "bash"]
    tool_colors = ["#E53935", "#1E88E5", "#43A047", "#FF9800", "#9C27B0"]

    x = np.arange(len(config_order))
    width = 0.15

    for i, (tool, color) in enumerate(zip(tool_types, tool_colors)):
        means = []
        for cfg in config_order:
            vals = configs.get(cfg, {}).get(tool, [0])
            means.append(np.mean(vals) if vals else 0)
        offset = (i - len(tool_types) / 2 + 0.5) * width
        ax.bar(x + offset, means, width, label=tool, color=color, alpha=0.8)

    ax.set_xticks(x)
    ax.set_xticklabels([f"{c}\n(n={len(configs.get(c, {}).get('validate', []))})" for c in config_order])
    ax.set_ylabel("Avg Tool Calls per Run")
    ax.set_title("Tool Usage by Configuration")
    ax.legend()
    ax.grid(True, alpha=0.3, axis='y')

    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "13_tool_usage_by_config.png"), dpi=150)
    plt.close(fig)
    print("  → 13_tool_usage_by_config.png")


print("Generating convergence plots...")
plot_convergence_curve()
plot_warning_convergence()
plot_validate_call_count()
plot_issue_source_breakdown()
plot_first_vs_last()
plot_tool_usage_by_config()
print("Done.")
