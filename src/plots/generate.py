"""Generate thesis plots from benchmark data.

Thesis philosophy: NO composite scores. Every thesis plot uses raw,
defensible metrics — error/warning counts, render rate, assertion pass
rate. The single exception is `00_score_overview`, kept only as an internal
orientation aid and explicitly NOT a thesis metric.

Two robustness rules applied throughout:
  - facet only over models actually present in the data (no empty panels
    while sonnet/opus have not been run yet);
  - error-count axes use a symlog scale so a few high-error runs do not
    compress the rest into a sliver.
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from .config import (
    COLORS, LABELS, MODELS, CONFIGS,
    COMPLEXITY_ORDER, ISSUE_SOURCE_LABELS,
    WILCOXON_FALLBACK_NOTE,
)

# scipy is available in this environment, but import defensively so the
# pipeline still produces every other plot (and a descriptive-only Wilcoxon
# fallback) if it is ever missing.
try:
    from scipy.stats import wilcoxon as _scipy_wilcoxon
    _HAS_SCIPY = True
except Exception:  # pragma: no cover - environment guard
    _scipy_wilcoxon = None
    _HAS_SCIPY = False


def _apply_style():
    sns.set_style("whitegrid")
    plt.rcParams.update({
        "figure.dpi": 150,
        "savefig.dpi": 300,
        "font.size": 10,
        "axes.titlesize": 13,
        "axes.titleweight": "bold",
        "axes.labelsize": 11,
        "figure.facecolor": "white",
        "axes.spines.top": False,
        "axes.spines.right": False,
    })


def _save(fig: plt.Figure, name: str, out_dir: str):
    path = os.path.join(out_dir, name)
    fig.savefig(path, dpi=300, bbox_inches="tight", pad_inches=0.15)
    plt.close(fig)
    print(f"  {name}")


def _present_models(df: pd.DataFrame) -> list[str]:
    return [m for m in MODELS if (df["model"] == m).any()]


def _symlog_errors(ax):
    """Symlog y so 0 stays readable while high-error runs don't squash the rest.

    linthresh=5: the bulk of clean/near-clean runs sit in the 0–10 band (data
    median n_errors=11), so a smaller linear threshold stops the dense low band
    from being over-compressed while the long tail (max≈310) stays on a log arm.
    """
    ax.set_yscale("symlog", linthresh=5)
    ax.set_ylim(bottom=0)


def _vals(df: pd.DataFrame, model: str, config: str, col: str) -> list[float]:
    mask = (df["model"] == model) & (df["config"] == config)
    return df.loc[mask, col].dropna().tolist()


def _rendered(df: pd.DataFrame) -> pd.DataFrame:
    """Runs whose component actually rendered.

    Dynamic checks (spatial/a11y/runtime) never fire on a non-rendering run, so
    such runs look artificially clean. Cleanliness/error views aggregate over
    this view only; the render rate is always shown separately (plot 04) so a
    render-failing model is surfaced as low-render, never as falsely clean."""
    return df[df["renderSuccess"]]


def _median_iqr(vals: list[float]) -> tuple[float, float, float]:
    """Return (median, lower-whisker-len, upper-whisker-len) for asymmetric IQR
    error bars. Empty -> (0, 0, 0). More conservative than mean±std on tiny n."""
    if not vals:
        return 0.0, 0.0, 0.0
    arr = np.asarray(vals, dtype=float)
    med = float(np.median(arr))
    q25 = float(np.percentile(arr, 25))
    q75 = float(np.percentile(arr, 75))
    return med, max(med - q25, 0.0), max(q75 - med, 0.0)


def _source_label(src: str) -> str:
    """Display label for an issue-source id, with a humanized fallback for any
    id not explicitly mapped (e.g. a future validator) so nothing is dropped."""
    if src in ISSUE_SOURCE_LABELS:
        return ISSUE_SOURCE_LABELS[src]
    return src.replace("-", " ").title()


# ──────────────────────────────────────────────────────────────
# 00: Score overview — INTERNAL orientation only, NOT a thesis metric
# ──────────────────────────────────────────────────────────────

def plot_score_overview(df: pd.DataFrame, out_dir: str):
    pm = _present_models(df)
    fig, ax = plt.subplots(figsize=(8, 4.5))
    x = np.arange(len(pm))
    w = 0.24

    for i, cfg in enumerate(CONFIGS):
        means = [np.mean(s) if (s := _vals(df, m, cfg, "score")) else 0 for m in pm]
        stds = [np.std(s) if (s := _vals(df, m, cfg, "score")) else 0 for m in pm]
        bars = ax.bar(x + i * w, means, w, yerr=stds, color=COLORS[cfg],
                      label=LABELS[cfg], capsize=3, edgecolor="white", lw=0.5,
                      error_kw={"lw": 1})
        for bar, val, sd in zip(bars, means, stds):
            if val > 0:
                ax.text(bar.get_x() + bar.get_width() / 2, val + sd + 1.5,
                        f"{val:.0f}", ha="center", fontsize=8, fontweight="bold")

    ax.set_ylabel("Composite Score (0–100)")
    ax.set_xticks(x + w)
    ax.set_xticklabels([m.capitalize() for m in pm])
    ax.set_ylim(0, 105)
    ax.legend(frameon=False, fontsize=10)
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Composite Score by Model and Configuration\n"
                 "(internal overview — NOT used as a thesis metric)")
    # Score is the only place a composite appears: isolate it in plots/internal/
    # so it can never be mistaken for a thesis figure.
    internal_dir = os.path.join(out_dir, "internal")
    os.makedirs(internal_dir, exist_ok=True)
    _save(fig, "00_score_overview.png", internal_dir)


# ──────────────────────────────────────────────────────────────
# 01: Errors per run by category (A–D), by model x config
# ──────────────────────────────────────────────────────────────

def plot_errors_by_category(df: pd.DataFrame, out_dir: str):
    """Issues per run broken down BY SOURCE, one panel per model, grouped bars
    per config. Over all runs. This replaces the old 2-category view (which was
    unreadable): it shows which concrete validator fires (compiler, prop, DS
    usage, …) and how bare → mcp → full reduces each source. Static error
    sources dominate bare; the few residual full-stack bars are dynamic a11y/
    layout warnings that only exist because the page actually rendered."""
    pm = _present_models(df)
    top = _rank_issue_sources(df, top_n=7)
    sources = top + ["other"]
    labels = [_source_label(s) for s in sources]
    x = np.arange(len(sources))
    w = 0.26

    # One figure per model with its OWN y-axis — a shared axis let haiku/bare
    # (≈44 issues/run) squash sonnet and opus into invisibility.
    for m in pm:
        fig, ax = plt.subplots(figsize=(8, 5))
        for ci, cfg in enumerate(CONFIGS):
            sub = df[(df["model"] == m) & (df["config"] == cfg)]
            n = len(sub)
            counts = {}
            for srcs in sub["issueSources"]:
                if isinstance(srcs, dict):
                    for s, c in srcs.items():
                        counts[s] = counts.get(s, 0) + c
            per_run = [counts.get(s, 0) / n if n else 0 for s in top]
            per_run.append(sum(c for s, c in counts.items() if s not in top) / n if n else 0)
            ax.bar(x + ci * w, per_run, w, color=COLORS[cfg],
                   label=LABELS[cfg], edgecolor="white", lw=0.5)
        n_total = int((df["model"] == m).sum())
        ax.set_xticks(x + w)
        ax.set_xticklabels(labels, fontsize=9, rotation=45, ha="right")
        ax.set_ylabel("Issues per run")
        ax.set_title(f"Issue Sources per Run — {m.capitalize()} (n={n_total} runs, all configs)")
        ax.legend(frameon=False, fontsize=10)
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)
        fig.tight_layout()
        _save(fig, f"01_error_sources_{m}.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 02: Error-count distribution by model x config
# ──────────────────────────────────────────────────────────────


# ──────────────────────────────────────────────────────────────
# 03: Errors per run vs task complexity
# ──────────────────────────────────────────────────────────────

def plot_complexity_scaling(df: pd.DataFrame, out_dir: str):
    # All runs: errors are static (A/C); see plot 01. NOTE the complexity axis is
    # uneven with P-08/P-09 missing ("high" rests on a single prompt), so read
    # the trend, not absolute high-complexity values.
    pm = _present_models(df)
    fig, axes = plt.subplots(1, len(pm), figsize=(4.7 * len(pm), 4.7),
                             sharey=True, squeeze=False)

    for ai, m in enumerate(pm):
        ax = axes[0][ai]
        mdf = df[df["model"] == m]
        for cfg in CONFIGS:
            cdf = mdf[mdf["config"] == cfg]
            meds, lo, hi, x_vals = [], [], [], []
            for comp in COMPLEXITY_ORDER:
                vals = cdf.loc[cdf["complexity"] == comp, "n_errors"].dropna().tolist()
                if not vals:
                    continue
                med, l, h = _median_iqr(vals)
                meds.append(med); lo.append(l); hi.append(h)
                x_vals.append(COMPLEXITY_ORDER.index(comp))
            if not x_vals:
                continue
            ax.errorbar(x_vals, meds, yerr=[lo, hi], marker="o",
                        color=COLORS[cfg], label=LABELS[cfg] if ai == 0 else None,
                        linewidth=2, capsize=4, markersize=6)
        n_total = int((df["model"] == m).sum())
        ax.set_xticks(range(len(COMPLEXITY_ORDER)))
        ax.set_xticklabels([c.capitalize() for c in COMPLEXITY_ORDER])
        ax.set_xlabel("Task Complexity")
        _symlog_errors(ax)
        ax.set_title(f"{m.capitalize()}  (n={n_total} runs)", fontsize=11)
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0][0].set_ylabel("Median errors per run (IQR, symlog)")
    axes[0][0].legend(frameon=False, fontsize=9)
    fig.suptitle("Errors per Run by Task Complexity (all runs; high = single prompt, P-08/09 missing)",
                 y=1.03, fontsize=14, fontweight="bold")
    fig.tight_layout()
    _save(fig, "03_complexity_scaling.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 04: Render success rate (raw rate, all runs)
# ──────────────────────────────────────────────────────────────

def plot_render_success(df_all: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(8, 4.5))
    groups, rates, colors = [], [], []

    for m in MODELS:
        for cfg in CONFIGS:
            mask = (df_all["model"] == m) & (df_all["config"] == cfg)
            subset = df_all[mask]
            if len(subset) == 0:
                continue
            rates.append(subset["renderSuccess"].sum() / len(subset) * 100)
            groups.append(f"{m[:3].capitalize()}\n{LABELS[cfg]}")
            colors.append(COLORS[cfg])

    x = np.arange(len(groups))
    bars = ax.bar(x, rates, color=colors, edgecolor="white", lw=0.5)
    for bar, rate in zip(bars, rates):
        ax.text(bar.get_x() + bar.get_width() / 2, rate + 1.5,
                f"{rate:.0f}%", ha="center", fontsize=9, fontweight="bold")

    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontsize=8)
    ax.set_ylim(0, 110)
    ax.set_ylabel("Render Success Rate (%)")
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Component Render Success Rate")
    _save(fig, "04_render_success.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 05: Assertion pass rate — heatmap (raw rate)
# ──────────────────────────────────────────────────────────────

def plot_assertion_heatmap(df: pd.DataFrame, out_dir: str):
    pm = _present_models(df)
    fig, ax = plt.subplots(figsize=(6, 0.7 + 0.9 * len(pm)))
    pivot = df.pivot_table(values="assertionPassRate", index="model",
                           columns="config", aggfunc="mean", observed=True)
    pivot = pivot.reindex(index=pm, columns=CONFIGS) * 100

    sns.heatmap(pivot, annot=True, fmt=".0f", cmap="Greens", vmin=50, vmax=100,
                linewidths=1, linecolor="white",
                cbar_kws={"label": "Pass Rate (%)", "shrink": 0.8}, ax=ax,
                annot_kws={"fontsize": 12, "fontweight": "bold"})

    ax.set_xticklabels([LABELS[c] for c in CONFIGS], fontsize=10)
    ax.set_yticklabels([m.capitalize() for m in pm], fontsize=10, rotation=0)
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.set_title("Assertion Pass Rate (%)")
    fig.tight_layout()
    _save(fig, "05_assertion_heatmap.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 06: Issue source distribution (count per run, by source)
# ──────────────────────────────────────────────────────────────

def _rank_issue_sources(df: pd.DataFrame, top_n: int = 10) -> list[str]:
    """Rank issue-source ids by total observed count across all runs and keep
    the top N; everything else is bucketed into 'other' by the caller. Derived
    from the data so no phantom source is shown and no real source is dropped."""
    totals: dict[str, float] = {}
    for sources in df["issueSources"]:
        if not isinstance(sources, dict):
            continue
        for src, count in sources.items():
            totals[src] = totals.get(src, 0) + count
    # A source observed zero times (e.g. a stale key carrying count 0) must not
    # rank above or alongside real sources — otherwise the plot would show a
    # phantom source that never actually fired. Only keep positive totals.
    ranked = sorted(
        (s for s, t in totals.items() if t > 0),
        key=lambda s: totals[s],
        reverse=True,
    )
    return ranked[:top_n]


# ──────────────────────────────────────────────────────────────
# 07: Cost vs error count — scatter
# ──────────────────────────────────────────────────────────────


# ──────────────────────────────────────────────────────────────
# 14: Completeness × Cleanliness — the anti-"underbuild" centerpiece
# ──────────────────────────────────────────────────────────────


# ──────────────────────────────────────────────────────────────
# 15: Per-category error-free rate (% of runs with 0 errors in a category)
# ──────────────────────────────────────────────────────────────


# ──────────────────────────────────────────────────────────────
# Pairwise significance — config tiers, per model, at the prompt level
# ──────────────────────────────────────────────────────────────

def _paired_by_prompt(df: pd.DataFrame, model: str, cfg_a: str, cfg_b: str, metric: str):
    """Pair two configs of one model at the PROMPT level: the metric is first
    summarised per prompt as the median over that prompt's runs, then prompts
    present in both configs are paired. This avoids pseudoreplication — the two
    runs of a prompt are nested, not independent, so they are collapsed before
    the test. Returns (a_vals, b_vals) aligned on the shared prompts."""
    mdf = df[df["model"] == model]
    a = mdf[mdf["config"] == cfg_a].groupby("evalId")[metric].median().dropna()
    b = mdf[mdf["config"] == cfg_b].groupby("evalId")[metric].median().dropna()
    common = a.index.intersection(b.index)
    return a.loc[common].tolist(), b.loc[common].tolist()


def _rank_biserial(a_vals, b_vals):
    """Matched-pairs rank-biserial effect size for the b-vs-a contrast:
    r = (W+ - W-) / (W+ + W-) over ranks of the non-zero |differences|.
    Positive r → b tends to exceed a. nan when all differences are 0."""
    diffs = [b - a for a, b in zip(a_vals, b_vals)]
    nz = [d for d in diffs if d != 0]
    if not nz:
        return float("nan")
    order = np.argsort([abs(d) for d in nz])
    ranks = np.empty(len(nz))
    ranks[order] = np.arange(1, len(nz) + 1)
    w_pos = float(sum(r for d, r in zip(nz, ranks) if d > 0))
    w_neg = float(sum(r for d, r in zip(nz, ranks) if d < 0))
    tot = w_pos + w_neg
    return (w_pos - w_neg) / tot if tot else float("nan")


def _holm(pvals):
    """Holm-Bonferroni adjusted p-values for a family of tests (None passes
    through). Controls the family-wise error rate; conservative at small n."""
    idx = [i for i, p in enumerate(pvals) if p is not None]
    m = len(idx)
    adj = list(pvals)
    running = 0.0
    for rank, i in enumerate(sorted(idx, key=lambda i: pvals[i])):
        running = max(running, min(1.0, (m - rank) * pvals[i]))
        adj[i] = running
    return adj


def plot_pairwise_stats(df: pd.DataFrame, out_dir: str):
    """Paired Wilcoxon signed-rank tests across config tiers, per model, at the
    prompt level (up to 10 paired prompts). The PRIMARY contrast is MCP-Stack →
    Full-Stack on the assertion pass rate — the only tool-independent quality
    metric (the deterministic validator that the full-stack tier optimises
    against does not feed it). Bare→MCP and Bare→Full are exploratory, and
    n_errors is a process measure (full-stack drives it to ~0 by construction).
    Render rate is intentionally NOT tested here — it is binary, so per-prompt
    medians collapse to a 3-value scale with no power; it is reported
    descriptively (plots 04/19). p-values are Holm-corrected over the family;
    rank-biserial effect size + median difference carry the magnitude at this
    small n. Writes wilcoxon_tests.csv."""
    import csv

    metrics = [
        ("assertionPassRate", df, "Assertion pass rate"),
        ("requiredPassRate", df, "Assertion pass rate (required only)"),
        ("n_errors", _rendered(df), "Errors/run (rendered, process)"),
    ]
    contrasts = [
        ("mcp-stack", "full-stack"),
        ("bare", "mcp-stack"),
        ("bare", "full-stack"),
    ]
    rows = []
    for metric, mdf, label in metrics:
        if metric not in mdf.columns:
            continue
        for cfg_a, cfg_b in contrasts:
            for model in _present_models(df):
                a, b = _paired_by_prompt(mdf, model, cfg_a, cfg_b, metric)
                n = len(a)
                med_a = float(np.median(a)) if a else float("nan")
                med_b = float(np.median(b)) if b else float("nan")
                rbc = _rank_biserial(a, b)
                W, p, note = None, None, ""
                nonzero = [x for x in (bb - aa for aa, bb in zip(a, b)) if x != 0]
                if _HAS_SCIPY and len(nonzero) >= 6:
                    try:
                        res = _scipy_wilcoxon(a, b, zero_method="wilcox")
                        W, p = float(res.statistic), float(res.pvalue)
                    except Exception as e:  # pragma: no cover
                        note = f"wilcoxon failed: {e}"
                else:
                    note = WILCOXON_FALLBACK_NOTE
                rows.append({
                    "metric": metric, "label": label,
                    "contrast": f"{cfg_a}->{cfg_b}",
                    "primary": metric == "assertionPassRate" and cfg_a == "mcp-stack",
                    "model": model, "n_prompts": n,
                    "median_a": med_a, "median_b": med_b,
                    "median_diff": med_b - med_a, "rank_biserial": rbc,
                    "W": W, "p_raw": p, "note": note,
                })

    for r, pa in zip(rows, _holm([r["p_raw"] for r in rows])):
        r["p_holm"] = pa

    csv_path = os.path.join(out_dir, "wilcoxon_tests.csv")
    with open(csv_path, "w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=[
            "metric", "label", "contrast", "primary", "model", "n_prompts",
            "median_a", "median_b", "median_diff", "rank_biserial",
            "W", "p_raw", "p_holm", "note"])
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    print(f"  wilcoxon_tests.csv ({len(rows)} rows)")
    # Reported as a table in the thesis text. Primary row: metric=
    # assertionPassRate, contrast=mcp-stack->full-stack. Render rate is NOT
    # here — descriptive only (no McNemar; binary per-prompt medians degenerate).


# ──────────────────────────────────────────────────────────────
# 17: Desktop width utilisation — "does the app use the desktop width"
# ──────────────────────────────────────────────────────────────


# ──────────────────────────────────────────────────────────────
# 19: Render success per prompt × config — where does the tool help most
# ──────────────────────────────────────────────────────────────

def plot_render_by_prompt(df: pd.DataFrame, out_dir: str):
    """Render-success rate per prompt × configuration, averaged over all models
    (6 runs/cell: 3 models × 2). Adds the PROMPT dimension that the bucketed
    complexity plot hides: it shows WHICH tasks bare/mcp fail and that full-stack
    lifts every prompt to (near) 100%, with the hardest prompts benefiting most."""
    pivot = df.pivot_table(values="renderSuccess", index="evalId",
                           columns="config", aggfunc="mean", observed=True)
    pivot = pivot.reindex(columns=CONFIGS).sort_index() * 100

    fig, ax = plt.subplots(figsize=(6, 0.5 + 0.45 * len(pivot)))
    sns.heatmap(pivot, annot=True, fmt=".0f", cmap="RdYlGn", vmin=0, vmax=100,
                linewidths=1, linecolor="white", cbar_kws={"label": "Render rate (%)"},
                ax=ax)
    ax.set_xticklabels([LABELS[c] for c in CONFIGS], rotation=0)
    ax.set_xlabel("")
    ax.set_ylabel("Prompt")
    ax.set_title("Render Success per Prompt × Configuration\n(all models, 6 runs/cell)")
    fig.tight_layout()
    _save(fig, "19_render_by_prompt.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Runner
# ──────────────────────────────────────────────────────────────

# Slimmed thesis set. Dropped as unclear/redundant: 02 (distribution), 07 (cost
# scatter), 14 (completeness scatter), 15 (error-free rate), 17 (width).
# Significance is one CSV table (pairwise Wilcoxon, prompt-level, MCP->Full
# primary, Holm-corrected, rank-biserial); render rate is descriptive only.
# Convergence (08/09/11/12) is one before/after bar in
# generate-convergence-plots.py.
ALL_PLOTS = [
    ("00 Score Overview (internal)", plot_score_overview, False),
    ("01 Issue Sources by Model", plot_errors_by_category, False),
    ("03 Complexity Scaling", plot_complexity_scaling, False),
    ("04 Render Success", plot_render_success, True),
    ("05 Assertion Heatmap", plot_assertion_heatmap, False),
    ("19 Render by Prompt", plot_render_by_prompt, False),
    ("Pairwise stats (CSV only)", plot_pairwise_stats, False),
]


def generate_all(df: pd.DataFrame, df_all: pd.DataFrame, out_dir: str):
    _apply_style()
    os.makedirs(out_dir, exist_ok=True)
    print(f"Generating plots in {out_dir}/\n")

    for name, fn, needs_all in ALL_PLOTS:
        try:
            fn(df_all if needs_all else df, out_dir)
        except Exception as e:
            print(f"  SKIP {name}: {e}")

    print(f"\nDone — {len(ALL_PLOTS)} plots.")
