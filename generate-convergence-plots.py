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

COLORS = {"haiku": "#2196F3", "sonnet": "#FF9800", "opus": "#4CAF50"}


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


# --- Plot: self-correction before/after (replaces the iteration-axis plots) ---
def plot_convergence_summary():
    """Errors at the FIRST vs the LAST validate call, per model (full-stack).

    Convergence happens in ~2 calls, so an iteration axis up to 12–15 was
    misleading (mostly empty/noisy tails). This collapses it to the honest
    before/after: mean errors when the agent first validated vs at its last
    validate call, over the FULL call history (any scope — so a run that ended
    clean in a narrow scope is not misreported as stuck). Annotated with the
    share of runs that end error-free and the median number of validate calls."""
    fs = [r for r in data["runs"]
          if r["config"] == "full-stack" and r["hasSessionData"]
          and len(r.get("validateCallDetails", [])) >= 1]
    models = sorted({r["model"] for r in fs})

    fig, ax = plt.subplots(figsize=(7.5, 5))
    x = np.arange(len(models))
    w = 0.38
    first_means, last_means, ann = [], [], []
    for m in models:
        runs_m = [r for r in fs if r["model"] == m]
        firsts = [r["validateCallDetails"][0]["errorCount"] for r in runs_m]
        lasts = [r["validateCallDetails"][-1]["errorCount"] for r in runs_m]
        first_means.append(np.mean(firsts))
        last_means.append(np.mean(lasts))
        clean = sum(1 for v in lasts if v == 0) / len(lasts) * 100
        med_calls = int(np.median([len(r["validateCallDetails"]) for r in runs_m]))
        ann.append((len(runs_m), clean, med_calls))

    b1 = ax.bar(x - w / 2, first_means, w, label="First validate call",
                color="#C0392B", edgecolor="white", lw=0.5)
    b2 = ax.bar(x + w / 2, last_means, w, label="Last validate call",
                color="#27AE60", edgecolor="white", lw=0.5)
    for bar, v in list(zip(b1, first_means)) + list(zip(b2, last_means)):
        ax.text(bar.get_x() + bar.get_width() / 2, v + 0.15, f"{v:.1f}",
                ha="center", fontsize=9, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels([f"{m}\n(n={n}; {c:.0f}% end clean;\nmedian {mc} calls)"
                        for m, (n, c, mc) in zip(models, ann)], fontsize=9)
    ax.set_ylabel("Mean errors per run")
    ax.set_ylim(bottom=0)
    ax.legend(frameon=False)
    ax.grid(axis="y", alpha=0.3)
    ax.set_title("Self-Correction: errors at first vs last validate call (full-stack)")
    fig.tight_layout()
    fig.savefig(os.path.join(OUT_DIR, "08_convergence_summary.png"), dpi=150)
    plt.close(fig)
    print("  → 08_convergence_summary.png")


print("Generating convergence plots...")
plot_convergence_summary()
plot_validate_call_count()
plot_tool_usage_by_config()
print("Done.")
