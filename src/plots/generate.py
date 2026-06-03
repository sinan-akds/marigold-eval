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
import matplotlib.patches as mpatches
import seaborn as sns

from .config import (
    COLORS, LABELS, MODELS, CONFIGS, CAT_NAMES,
    COMPLEXITY_ORDER, ISSUE_SOURCE_LABELS, JITTER_SEED,
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

# Categories that actually carry errors/warnings. E (functional completeness)
# is derived from assertion pass rate, not from findings, so it is excluded
# from the error-by-category view (shown separately in the assertion heatmap).
CAT_IDS_ERR = ["A", "B", "C", "D"]


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


def _annotate_n(ax, x_positions, counts, y=0.0, fontsize=7):
    """Annotate per-cell sample size below each bar/marker so tiny n (≤4) is
    never hidden behind an aggregate."""
    for x, n in zip(x_positions, counts):
        ax.annotate(f"n={n}", (x, y), xytext=(0, -12), textcoords="offset points",
                    ha="center", va="top", fontsize=fontsize, color="#555",
                    clip_on=False)


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
    # Gate on render success: a non-rendering run never ran the dynamic checks,
    # so its category-D zeros are "not checked", not "clean".
    df_r = _rendered(df)
    pm = _present_models(df_r) or _present_models(df)
    fig, axes = plt.subplots(1, len(pm), figsize=(5 * len(pm), 4.7),
                             sharey=True, squeeze=False)
    x = np.arange(len(CAT_IDS_ERR))
    w = 0.25

    for ai, m in enumerate(pm):
        ax = axes[0][ai]
        n_rendered = int(((df_r["model"] == m)).sum())
        n_total = int(((df["model"] == m)).sum())
        for ci, cfg in enumerate(CONFIGS):
            mask = (df_r["model"] == m) & (df_r["config"] == cfg)
            meds, lo, hi = [], [], []
            for cat in CAT_IDS_ERR:
                vals = df_r.loc[mask, f"cat_{cat}_errors"].dropna().tolist()
                med, l, h = _median_iqr(vals)
                meds.append(med); lo.append(l); hi.append(h)
            ax.bar(x + ci * w, meds, w, color=COLORS[cfg],
                   yerr=[lo, hi], capsize=2, error_kw={"lw": 0.8},
                   label=LABELS[cfg] if ai == 0 else None,
                   edgecolor="white", lw=0.5)
        ax.set_xticks(x + w)
        ax.set_xticklabels([CAT_NAMES[c] for c in CAT_IDS_ERR], fontsize=9)
        rate = (n_rendered / n_total * 100) if n_total else 0
        ax.set_title(f"{m.capitalize()}\nrendered {n_rendered}/{n_total} ({rate:.0f}%)",
                     fontsize=11)
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0][0].set_ylabel("Median errors per run (IQR bars)")
    axes[0][0].legend(frameon=False, fontsize=9)
    fig.suptitle("Errors per Run by Category (rendered runs only)",
                 y=1.03, fontsize=14, fontweight="bold")
    fig.tight_layout()
    _save(fig, "01_errors_by_category.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 02: Error-count distribution by model x config
# ──────────────────────────────────────────────────────────────

def plot_error_distribution(df: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(10, 5.3))

    # Distribution of raw errors: gate on render success so non-rendering
    # runs' unchecked zeros are not shown as a clean cluster.
    plot_df = _rendered(df).copy()
    plot_df["group"] = plot_df["model"].astype(str) + " / " + plot_df["config"].astype(str)
    order = [f"{m} / {c}" for m in _present_models(df) for c in CONFIGS]
    palette = {f"{m} / {c}": COLORS[c] for m in MODELS for c in CONFIGS}
    present = [g for g in order if g in plot_df["group"].values]

    sns.boxplot(data=plot_df, x="group", y="n_errors", hue="group", order=present,
                palette=palette, ax=ax, linewidth=0.8, fliersize=2, legend=False)
    np.random.seed(JITTER_SEED)  # reproducible jitter (finding 9)
    sns.stripplot(data=plot_df, x="group", y="n_errors", order=present,
                  ax=ax, color="#333", size=2.5, alpha=0.35, jitter=0.2)

    counts = [int((plot_df["group"] == g).sum()) for g in present]
    ax.set_xticks(range(len(present)))
    ax.set_xticklabels([g.replace(" / ", "\n") for g in present], fontsize=8)
    _annotate_n(ax, range(len(present)), counts, y=0.0)
    ax.set_xlabel("")
    ax.set_ylabel("Errors per run (symlog)")
    _symlog_errors(ax)
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Error-Count Distribution by Model and Configuration\n"
                 "(rendered runs only; n per cell annotated)")
    fig.tight_layout()
    _save(fig, "02_error_distribution.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 03: Errors per run vs task complexity
# ──────────────────────────────────────────────────────────────

def plot_complexity_scaling(df: pd.DataFrame, out_dir: str):
    df_r = _rendered(df)
    pm = _present_models(df_r) or _present_models(df)
    fig, axes = plt.subplots(1, len(pm), figsize=(4.7 * len(pm), 4.7),
                             sharey=True, squeeze=False)

    for ai, m in enumerate(pm):
        ax = axes[0][ai]
        mdf = df_r[df_r["model"] == m]
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
        n_rendered = int((df_r["model"] == m).sum())
        n_total = int((df["model"] == m).sum())
        ax.set_xticks(range(len(COMPLEXITY_ORDER)))
        ax.set_xticklabels([c.capitalize() for c in COMPLEXITY_ORDER])
        ax.set_xlabel("Task Complexity")
        _symlog_errors(ax)
        ax.set_title(f"{m.capitalize()}  (rendered {n_rendered}/{n_total})", fontsize=11)
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0][0].set_ylabel("Median errors per run (IQR, symlog)")
    axes[0][0].legend(frameon=False, fontsize=9)
    fig.suptitle("Errors per Run by Task Complexity (rendered runs only)",
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


def plot_error_sources(df: pd.DataFrame, out_dir: str):
    # Dynamically derive the source list from the data (finding 8): rank by
    # total count, keep top 10, bucket the remainder into "other". This drops
    # the phantom required-ancestor/section-header rows and restores real
    # sources (theme-variant-validator, runtime, overflow-detector, ...).
    top_sources = _rank_issue_sources(df, top_n=10)
    series = top_sources + ["other"]
    short_names = [_source_label(s) for s in series]
    source_colors = sns.color_palette("tab20", len(series))

    fig, ax = plt.subplots(figsize=(11, 5))
    groups, stacks = [], []

    for m in MODELS:
        for cfg in CONFIGS:
            mask = (df["model"] == m) & (df["config"] == cfg)
            subset = df[mask]
            n_runs = len(subset)
            if n_runs == 0:
                continue
            groups.append(f"{m[:3].capitalize()}/{LABELS[cfg]}")
            counts = {}
            for sources in subset["issueSources"]:
                if not isinstance(sources, dict):
                    continue
                for src, count in sources.items():
                    counts[src] = counts.get(src, 0) + count
            row = [counts.get(s, 0) / n_runs for s in top_sources]
            # everything not in the top list goes to the "other" bucket
            other = sum(c for s, c in counts.items() if s not in top_sources) / n_runs
            row.append(other)
            stacks.append(row)

    x = np.arange(len(groups))
    bottom_acc = np.zeros(len(groups))
    for si, short in enumerate(short_names):
        vals = [s[si] for s in stacks]
        ax.bar(x, vals, bottom=bottom_acc, color=source_colors[si],
               label=short, edgecolor="white", lw=0.3)
        bottom_acc += np.array(vals)

    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontsize=8, rotation=45, ha="right")
    ax.set_ylabel("Issues per run")
    ax.legend(fontsize=8, frameon=True, loc="upper right",
              bbox_to_anchor=(1.0, 1.0), ncol=2)
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Issue Source Distribution (per Run)")
    fig.tight_layout()
    _save(fig, "06_error_sources.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 07: Cost vs error count — scatter
# ──────────────────────────────────────────────────────────────

def plot_cost_vs_errors(df: pd.DataFrame, out_dir: str):
    # Errors are only meaningful where the component rendered (dynamic checks
    # ran), so gate on render success; cost is still per-run.
    df_r = _rendered(df)
    fig, ax = plt.subplots(figsize=(8, 5))
    markers = {"haiku": "o", "sonnet": "s", "opus": "D"}

    for cfg in CONFIGS:
        for m in MODELS:
            mask = (df_r["model"] == m) & (df_r["config"] == cfg)
            subset = df_r[mask]
            if subset.empty:
                continue
            ax.scatter(subset["costUsd"], subset["n_errors"],
                       c=COLORS[cfg], marker=markers[m], s=40, alpha=0.7,
                       edgecolors="white", linewidths=0.5)

    cfg_handles = [mpatches.Patch(color=COLORS[c], label=LABELS[c]) for c in CONFIGS]
    model_handles = [
        plt.Line2D([0], [0], marker=markers[m], color="gray", linestyle="",
                   markersize=7, label=m.capitalize())
        for m in _present_models(df)
    ]
    ax.legend(handles=cfg_handles + model_handles, frameon=True,
              fontsize=9, loc="upper right", ncol=2)

    ax.set_xlabel("Cost per Run (USD)")
    ax.set_ylabel("Errors per run (symlog)")
    _symlog_errors(ax)
    ax.grid(alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Cost vs Error Count")
    _save(fig, "07_cost_vs_errors.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 14: Completeness × Cleanliness — the anti-"underbuild" centerpiece
# ──────────────────────────────────────────────────────────────

def plot_completeness_vs_cleanliness(df: pd.DataFrame, out_dir: str):
    """x = completeness (assertion pass rate %), y = cleanliness (errors per
    100 LOC). A model that "did less" lands at low x and can no longer hide a
    clean-looking y. Gated on render success so y reflects real dynamic checks."""
    df_r = _rendered(df).copy()
    fig, ax = plt.subplots(figsize=(8.5, 6))
    markers = {"haiku": "o", "sonnet": "s", "opus": "D"}

    # y metric: errors per 100 LOC; fall back to raw n_errors only if LOC is
    # missing for ALL rendered runs (noted in the axis label/title).
    use_norm = df_r["errors_per_100loc"].notna().any()
    ycol = "errors_per_100loc" if use_norm else "n_errors"
    ylabel = ("Errors per 100 LOC (cleanliness →)" if use_norm
              else "Errors per run (LOC missing) (cleanliness →)")

    plot_df = df_r[df_r["assertionPassRate"].notna() & df_r[ycol].notna()]
    for m in _present_models(plot_df):
        for cfg in CONFIGS:
            sub = plot_df[(plot_df["model"] == m) & (plot_df["config"] == cfg)]
            if sub.empty:
                continue
            ax.scatter(sub["assertionPassRate"] * 100, sub[ycol],
                       c=COLORS[cfg], marker=markers[m], s=55, alpha=0.75,
                       edgecolors="white", linewidths=0.6)

    # Quadrant guides: ideal corner = high completeness, low error (bottom-right).
    x_mid, y_mid = 80, plot_df[ycol].median() if not plot_df.empty else 0
    ax.axvline(x_mid, color="#bbb", lw=0.8, ls="--")
    ax.axhline(y_mid, color="#bbb", lw=0.8, ls="--")
    ax.annotate("ideal: complete & clean", (99, 0), xytext=(-4, 6),
                textcoords="offset points", ha="right", va="bottom",
                fontsize=8, color="#2a8")
    ax.annotate("did-less region", (1, ax.get_ylim()[1]), xytext=(4, -6),
                textcoords="offset points", ha="left", va="top",
                fontsize=8, color="#a55")

    cfg_handles = [mpatches.Patch(color=COLORS[c], label=LABELS[c]) for c in CONFIGS]
    model_handles = [
        plt.Line2D([0], [0], marker=markers[m], color="gray", linestyle="",
                   markersize=7, label=m.capitalize())
        for m in _present_models(plot_df)
    ]
    ax.legend(handles=cfg_handles + model_handles, frameon=True, fontsize=9,
              loc="upper right", ncol=2)
    ax.set_xlabel("Assertion pass rate % (completeness →)")
    ax.set_ylabel(ylabel)
    ax.set_xlim(0, 102)
    ax.set_ylim(bottom=0)
    ax.grid(alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    n = len(plot_df)
    ax.set_title("Completeness × Cleanliness "
                 f"(rendered runs, n={n})")
    _save(fig, "14_completeness_vs_cleanliness.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 15: Per-category error-free rate (% of runs with 0 errors in a category)
# ──────────────────────────────────────────────────────────────

def plot_category_errorfree_rate(df: pd.DataFrame, out_dir: str):
    """% of runs with zero errors in each category A–D, per model × config.
    A–C are static (every scored run counts); D is dynamic-dependent so it is
    computed over rendered runs only (else non-rendering runs inflate it)."""
    pm = _present_models(df)
    cats = ["A", "B", "C", "D"]
    fig, axes = plt.subplots(1, len(pm), figsize=(5 * len(pm), 4.7),
                             sharey=True, squeeze=False)
    x = np.arange(len(cats))
    w = 0.25
    df_r = _rendered(df)

    for ai, m in enumerate(pm):
        ax = axes[0][ai]
        for ci, cfg in enumerate(CONFIGS):
            rates = []
            for cat in cats:
                src = df_r if cat == "D" else df
                sub = src[(src["model"] == m) & (src["config"] == cfg)]
                col = f"cat_{cat}_errorfree"
                rates.append(sub[col].mean() * 100 if len(sub) else 0)
            ax.bar(x + ci * w, rates, w, color=COLORS[cfg],
                   label=LABELS[cfg] if ai == 0 else None,
                   edgecolor="white", lw=0.5)
        ax.set_xticks(x + w)
        ax.set_xticklabels([CAT_NAMES[c] for c in cats], fontsize=9)
        ax.set_title(m.capitalize())
        ax.set_ylim(0, 105)
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0][0].set_ylabel("Error-free runs (%)")
    axes[0][0].legend(frameon=False, fontsize=9)
    fig.suptitle("Per-Category Error-Free Rate  (D over rendered runs only)",
                 y=1.03, fontsize=14, fontweight="bold")
    fig.tight_layout()
    _save(fig, "15_category_errorfree_rate.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 16: Wilcoxon signed-rank — bare vs full-stack within each model
# ──────────────────────────────────────────────────────────────

def _paired_bare_full(df: pd.DataFrame, model: str, metric: str):
    """Pair bare vs full-stack runs of one model on (evalId, runNumber). Returns
    (bare_vals, full_vals) aligned; only cells present in BOTH configs."""
    mdf = df[df["model"] == model]
    bare = mdf[mdf["config"] == "bare"].set_index(["evalId", "runNumber"])[metric]
    full = mdf[mdf["config"] == "full-stack"].set_index(["evalId", "runNumber"])[metric]
    common = bare.index.intersection(full.index)
    b = bare.loc[common].dropna()
    f = full.loc[common].dropna()
    common2 = b.index.intersection(f.index)
    return b.loc[common2].tolist(), f.loc[common2].tolist()


def plot_wilcoxon_bare_vs_full(df: pd.DataFrame, out_dir: str):
    """Paired Wilcoxon signed-rank test (bare vs full-stack) per model on two
    metrics: n_errors (rendered runs) and assertionPassRate (all runs). Writes a
    CSV and a compact forest-style figure. Guards n<6 / missing scipy with a
    labeled descriptive-only fallback so significance is never over-claimed."""
    import csv

    metrics = [
        ("n_errors", _rendered(df), "Errors/run (rendered)"),
        ("assertionPassRate", df, "Assertion pass rate"),
    ]
    rows = []  # for CSV + plot
    for metric, mdf, label in metrics:
        for model in _present_models(df):
            bare, full = _paired_bare_full(mdf, model, metric)
            n = len(bare)
            med_b = float(np.median(bare)) if bare else float("nan")
            med_f = float(np.median(full)) if full else float("nan")
            W, p, note = None, None, ""
            diffs = [f - b for b, f in zip(bare, full)]
            nonzero = [d for d in diffs if d != 0]
            if _HAS_SCIPY and len(nonzero) >= 6:
                try:
                    res = _scipy_wilcoxon(bare, full, zero_method="wilcox")
                    W, p = float(res.statistic), float(res.pvalue)
                except Exception as e:  # pragma: no cover
                    note = f"wilcoxon failed: {e}"
            else:
                note = WILCOXON_FALLBACK_NOTE
            rows.append({
                "model": model, "metric": metric, "label": label,
                "n_pairs": n, "median_bare": med_b, "median_full": med_f,
                "W": W, "p": p, "note": note,
            })

    # CSV
    csv_path = os.path.join(out_dir, "wilcoxon_tests.csv")
    with open(csv_path, "w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=[
            "model", "metric", "label", "n_pairs",
            "median_bare", "median_full", "W", "p", "note"])
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    print(f"  wilcoxon_tests.csv ({len(rows)} rows)")

    # Forest-style plot: median delta (full - bare) with significance stars.
    fig, ax = plt.subplots(figsize=(8, 0.6 + 0.6 * len(rows)))
    ylabels, deltas, colors = [], [], []
    for r in rows:
        delta = r["median_full"] - r["median_bare"]
        deltas.append(delta)
        star = ""
        if r["p"] is not None:
            star = "***" if r["p"] < 0.001 else "**" if r["p"] < 0.01 else "*" if r["p"] < 0.05 else "ns"
        tag = f"{r['model']} · {r['label']} (n={r['n_pairs']})" + (f" {star}" if star else " [desc]")
        ylabels.append(tag)
        colors.append("#6ACC65" if delta <= 0 and r["metric"] == "n_errors" else
                       "#4878CF" if delta >= 0 and r["metric"] == "assertionPassRate" else "#E8963E")

    y = np.arange(len(rows))
    ax.barh(y, deltas, color=colors, edgecolor="white", lw=0.5)
    ax.axvline(0, color="#333", lw=0.8)
    ax.set_yticks(y)
    ax.set_yticklabels(ylabels, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("Median delta (full-stack − bare)")
    ax.grid(axis="x", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    sub = "\n(*** p<.001, ** p<.01, * p<.05, ns; [desc] = descriptive only, see CSV)"
    ax.set_title("Bare vs Full-Stack — Wilcoxon Signed-Rank" + sub)
    fig.tight_layout()
    _save(fig, "16_wilcoxon_bare_vs_full.png", out_dir)


# ──────────────────────────────────────────────────────────────
# 17: Desktop width utilisation — "does the app use the desktop width"
# ──────────────────────────────────────────────────────────────

def plot_width_utilization(df: pd.DataFrame, out_dir: str):
    """Desktop width utilisation (0..1) per model × config, over rendered runs
    (the metric only exists when the page rendered). Low = content stuck in a
    narrow, mobile-shaped band on desktop. The 0.6 line is the warning
    threshold. RELATIVE signal across configs (a centred max-width column also
    scores low), not an absolute quality measure."""
    d = _rendered(df).copy()
    d = d[d["widthUtilization"].notna()]
    if d.empty:
        print(
            "  SKIP 17 Width Utilization: no widthUtilization data yet — "
            "needs an eval/rescore with the current validator."
        )
        return

    pm = _present_models(d)
    rng = np.random.default_rng(0)  # seeded jitter for reproducible figures
    fig, axes = plt.subplots(
        1, len(pm), figsize=(5 * len(pm), 4.7), sharey=True, squeeze=False
    )
    for ai, m in enumerate(pm):
        ax = axes[0][ai]
        for ci, cfg in enumerate(CONFIGS):
            vals = d[(d["model"] == m) & (d["config"] == cfg)][
                "widthUtilization"
            ].tolist()
            if not vals:
                continue
            jitter = rng.normal(ci, 0.06, len(vals))
            ax.scatter(
                jitter, vals, s=28, color=COLORS[cfg], alpha=0.6,
                edgecolor="white", lw=0.5,
                label=LABELS[cfg] if ai == 0 else None,
            )
            ax.scatter(
                ci, float(np.median(vals)), marker="_", s=900,
                color=COLORS[cfg], lw=2.5,
            )
        ax.axhline(0.6, color="#b00", ls="--", lw=1, alpha=0.6)
        ax.set_xticks(range(len(CONFIGS)))
        ax.set_xticklabels([LABELS[c] for c in CONFIGS], fontsize=9)
        ax.set_title(m.capitalize())
        ax.set_ylim(0, 1.05)
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0][0].set_ylabel("Desktop width utilisation (0–1)")
    axes[0][0].legend(frameon=False, fontsize=9)
    fig.suptitle(
        "Desktop Width Utilisation  (rendered runs; — = median, dashed = warning ≤0.6)",
        y=1.03, fontsize=14, fontweight="bold",
    )
    fig.tight_layout()
    _save(fig, "17_width_utilization.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Runner
# ──────────────────────────────────────────────────────────────

ALL_PLOTS = [
    ("00 Score Overview (internal)", plot_score_overview, False),
    ("01 Errors by Category", plot_errors_by_category, False),
    ("02 Error Distribution", plot_error_distribution, False),
    ("03 Complexity Scaling", plot_complexity_scaling, False),
    ("04 Render Success", plot_render_success, True),
    ("05 Assertion Heatmap", plot_assertion_heatmap, False),
    ("06 Error Sources", plot_error_sources, False),
    ("07 Cost vs Errors", plot_cost_vs_errors, False),
    ("14 Completeness vs Cleanliness", plot_completeness_vs_cleanliness, False),
    ("15 Category Error-Free Rate", plot_category_errorfree_rate, False),
    ("16 Wilcoxon Bare vs Full", plot_wilcoxon_bare_vs_full, False),
    ("17 Width Utilization", plot_width_utilization, False),
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
