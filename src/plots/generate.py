"""Generate 10 thesis-ready plots from benchmark data."""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns

from .config import (
    COLORS, LABELS, MODELS, CONFIGS, CAT_IDS, CAT_NAMES,
    COMPLEXITY_ORDER,
)


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


def _label_bars(ax, bars, fmt="{:.0f}", offset=1.5, fontsize=8):
    for bar in bars:
        h = bar.get_height()
        if h > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2, h + offset,
                fmt.format(h), ha="center", va="bottom",
                fontsize=fontsize, fontweight="bold",
            )


def _scores(df: pd.DataFrame, model: str, config: str) -> list[float]:
    mask = (df["model"] == model) & (df["config"] == config)
    return df.loc[mask, "score"].dropna().tolist()


# ──────────────────────────────────────────────────────────────
# Plot 1: Main Result — Score by Model x Config
# ──────────────────────────────────────────────────────────────

def plot_main_result(df: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(8, 4.5))
    x = np.arange(len(MODELS))
    w = 0.24

    for i, cfg in enumerate(CONFIGS):
        per_model = [_scores(df, m, cfg) for m in MODELS]
        vals = [np.mean(s) if s else 0 for s in per_model]
        stds = [np.std(s) if s else 0 for s in per_model]
        bars = ax.bar(
            x + i * w, vals, w, yerr=stds, color=COLORS[cfg],
            label=LABELS[cfg], capsize=3, edgecolor="white", lw=0.5,
            error_kw={"lw": 1},
        )
        for bi, (bar, val) in enumerate(zip(bars, vals)):
            n = len(per_model[bi])
            lbl = f"{val:.0f}" if n >= 20 else f"{val:.0f}\n(n={n})"
            if val > 0:
                ax.text(
                    bar.get_x() + bar.get_width() / 2,
                    val + stds[bi] + 1.5, lbl,
                    ha="center", fontsize=8, fontweight="bold",
                )

    ax.set_ylabel("Quality Score (0–100)")
    ax.set_xticks(x + w)
    ax.set_xticklabels([m.capitalize() for m in MODELS])
    ax.set_ylim(0, 105)
    ax.legend(frameon=False, fontsize=10)
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Quality Score by Model and Configuration Tier")
    _save(fig, "01_main_result.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 2: Incremental Lift — Stacked Waterfall
# ──────────────────────────────────────────────────────────────

def plot_incremental_lift(df: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(7, 4.5))

    for mi, m in enumerate(MODELS):
        b = np.mean(s) if (s := _scores(df, m, "bare")) else 0
        mc = np.mean(s) if (s := _scores(df, m, "mcp-stack")) else 0
        f = np.mean(s) if (s := _scores(df, m, "full-stack")) else 0

        ax.bar(mi, b, 0.5, color=COLORS["bare"],
               label="Bare" if mi == 0 else None)
        # Deltas can be negative if a tier regresses — clamp to 0 for stacking
        mcp_delta = max(mc - b, 0)
        fs_delta = max(f - mc, 0)
        ax.bar(mi, mcp_delta, 0.5, bottom=b, color=COLORS["mcp-stack"],
               label="+ MCP Docs" if mi == 0 else None)
        ax.bar(mi, fs_delta, 0.5, bottom=b + mcp_delta, color=COLORS["full-stack"],
               label="+ Validate" if mi == 0 else None)

        top = b + mcp_delta + fs_delta
        ax.text(mi, top + 1.5, f"{f:.0f}", ha="center", fontsize=11, fontweight="bold")
        if b > 5:
            ax.text(mi, b / 2, f"{b:.0f}", ha="center", fontsize=9,
                    color="white", fontweight="bold")
        if mc - b > 5:
            ax.text(mi, b + (mc - b) / 2, f"+{mc - b:.0f}", ha="center",
                    fontsize=9, color="white", fontweight="bold")
        if f - mc > 5:
            ax.text(mi, mc + (f - mc) / 2, f"+{f - mc:.0f}", ha="center",
                    fontsize=9, color="white", fontweight="bold")

    ax.set_xticks(range(len(MODELS)))
    ax.set_xticklabels([m.capitalize() for m in MODELS])
    ax.set_ylim(0, 100)
    ax.set_ylabel("Quality Score")
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.legend(frameon=False, loc="upper left", fontsize=10)
    ax.set_title("Incremental Value of Each Configuration Tier")
    _save(fig, "02_incremental_lift.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 3: Category Breakdown — Per-category scores by config
# ──────────────────────────────────────────────────────────────

def plot_category_breakdown(df: pd.DataFrame, out_dir: str):
    fig, axes = plt.subplots(1, 3, figsize=(15, 4.5), sharey=True)

    for ai, m in enumerate(MODELS):
        ax = axes[ai]
        x = np.arange(len(CAT_IDS))
        w = 0.25

        for ci, cfg in enumerate(CONFIGS):
            mask = (df["model"] == m) & (df["config"] == cfg)
            vals = []
            for cat in CAT_IDS:
                col = f"cat_{cat}"
                series = df.loc[mask, col].dropna()
                vals.append(series.mean() if len(series) > 0 else 0)
            ax.bar(
                x + ci * w, vals, w, color=COLORS[cfg],
                label=LABELS[cfg] if ai == 0 else None,
                edgecolor="white", lw=0.5,
            )

        ax.set_xticks(x + w)
        ax.set_xticklabels([CAT_NAMES[c] for c in CAT_IDS], fontsize=9)
        ax.set_ylim(0, 105)
        ax.set_title(m.capitalize())
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0].set_ylabel("Category Score (0–100)")
    axes[0].legend(frameon=False, fontsize=9)
    fig.suptitle("Score by Quality Category", y=1.02, fontsize=14, fontweight="bold")
    fig.tight_layout()
    _save(fig, "03_category_breakdown.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 4: Complexity Scaling
# ──────────────────────────────────────────────────────────────

def plot_complexity_scaling(df: pd.DataFrame, out_dir: str):
    fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), sharey=True)

    for ai, m in enumerate(MODELS):
        ax = axes[ai]
        mdf = df[df["model"] == m]

        for cfg in CONFIGS:
            cdf = mdf[mdf["config"] == cfg]
            means = cdf.groupby("complexity", observed=True)["score"].mean()
            stds = cdf.groupby("complexity", observed=True)["score"].std().fillna(0)

            x_vals = [COMPLEXITY_ORDER.index(c) for c in means.index]
            ax.errorbar(
                x_vals, means.values, yerr=stds.values,
                marker="o", color=COLORS[cfg], label=LABELS[cfg] if ai == 0 else None,
                linewidth=2, capsize=4, markersize=6,
            )

        ax.set_xticks(range(len(COMPLEXITY_ORDER)))
        ax.set_xticklabels([c.capitalize() for c in COMPLEXITY_ORDER])
        ax.set_ylim(0, 100)
        ax.set_xlabel("Task Complexity")
        ax.set_title(m.capitalize())
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0].set_ylabel("Quality Score")
    axes[0].legend(frameon=False, fontsize=9)
    fig.suptitle("Score Scaling with Task Complexity", y=1.02, fontsize=14, fontweight="bold")
    fig.tight_layout()
    _save(fig, "04_complexity_scaling.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 5: Prescriptive vs Intent-driven
# ──────────────────────────────────────────────────────────────

def plot_prescriptive_vs_intent(df: pd.DataFrame, out_dir: str):
    fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), sharey=True)
    spec_colors = {"prescriptive": "#5B8BD0", "intent": "#D05B8B"}

    for ai, m in enumerate(MODELS):
        ax = axes[ai]
        mdf = df[df["model"] == m]
        x = np.arange(len(CONFIGS))
        w = 0.35

        for si, spec in enumerate(["prescriptive", "intent"]):
            sdf = mdf[mdf["specificity"] == spec]
            means = [sdf[sdf["config"] == c]["score"].mean() for c in CONFIGS]
            stds = [sdf[sdf["config"] == c]["score"].std(ddof=0) for c in CONFIGS]
            stds = [0 if np.isnan(s) else s for s in stds]
            bars = ax.bar(
                x + si * w, means, w, yerr=stds,
                color=spec_colors[spec],
                label=spec.capitalize() if ai == 0 else None,
                capsize=3, edgecolor="white", lw=0.5, error_kw={"lw": 1},
            )
            _label_bars(ax, bars)

        ax.set_xticks(x + w / 2)
        ax.set_xticklabels([LABELS[c] for c in CONFIGS], fontsize=9)
        ax.set_ylim(0, 105)
        ax.set_title(m.capitalize())
        ax.grid(axis="y", alpha=0.15, lw=0.8)
        ax.set_axisbelow(True)

    axes[0].set_ylabel("Quality Score")
    axes[0].legend(frameon=False, fontsize=9)
    fig.suptitle("Prescriptive vs Intent-driven Prompts", y=1.02, fontsize=14, fontweight="bold")
    fig.tight_layout()
    _save(fig, "05_prescriptive_vs_intent.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 6: Render Success Rate
# ──────────────────────────────────────────────────────────────

def plot_render_success(df_all: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(8, 4.5))

    groups = []
    success_rates = []
    colors = []

    for m in MODELS:
        for cfg in CONFIGS:
            mask = (df_all["model"] == m) & (df_all["config"] == cfg)
            subset = df_all[mask]
            if len(subset) == 0:
                continue
            rate = subset["renderSuccess"].sum() / len(subset) * 100
            groups.append(f"{m[:3].capitalize()}\n{LABELS[cfg]}")
            success_rates.append(rate)
            colors.append(COLORS[cfg])

    x = np.arange(len(groups))
    bars = ax.bar(x, success_rates, color=colors, edgecolor="white", lw=0.5)

    for bar, rate in zip(bars, success_rates):
        ax.text(
            bar.get_x() + bar.get_width() / 2, rate + 1.5,
            f"{rate:.0f}%", ha="center", fontsize=9, fontweight="bold",
        )

    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontsize=8)
    ax.set_ylim(0, 110)
    ax.set_ylabel("Render Success Rate (%)")
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Component Render Success Rate")
    _save(fig, "06_render_success.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 7: Cost vs Quality — Scatter
# ──────────────────────────────────────────────────────────────

def plot_cost_vs_quality(df: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(8, 5))
    markers = {"haiku": "o", "sonnet": "s", "opus": "D"}

    for cfg in CONFIGS:
        for m in MODELS:
            mask = (df["model"] == m) & (df["config"] == cfg)
            subset = df[mask]
            if subset.empty:
                continue
            ax.scatter(
                subset["costUsd"], subset["score"],
                c=COLORS[cfg], marker=markers[m], s=40, alpha=0.7,
                edgecolors="white", linewidths=0.5,
            )

    cfg_handles = [mpatches.Patch(color=COLORS[c], label=LABELS[c]) for c in CONFIGS]
    model_handles = [
        plt.Line2D([0], [0], marker=markers[m], color="gray", linestyle="",
                   markersize=7, label=m.capitalize())
        for m in MODELS
    ]
    ax.legend(
        handles=cfg_handles + model_handles, frameon=True,
        fontsize=9, loc="lower right", ncol=2,
    )

    ax.set_xlabel("Cost per Run (USD)")
    ax.set_ylabel("Quality Score")
    ax.grid(alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Cost–Quality Tradeoff")
    _save(fig, "07_cost_vs_quality.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 8: Assertion Pass Rate — Heatmap
# ──────────────────────────────────────────────────────────────

def plot_assertion_heatmap(df: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(6, 3.5))

    pivot = df.pivot_table(
        values="assertionPassRate", index="model", columns="config",
        aggfunc="mean", observed=True,
    )
    pivot = pivot.reindex(index=MODELS, columns=CONFIGS) * 100

    sns.heatmap(
        pivot, annot=True, fmt=".0f", cmap="Greens",
        vmin=50, vmax=100, linewidths=1, linecolor="white",
        cbar_kws={"label": "Pass Rate (%)", "shrink": 0.8},
        ax=ax, annot_kws={"fontsize": 12, "fontweight": "bold"},
    )

    ax.set_xticklabels([LABELS[c] for c in CONFIGS], fontsize=10)
    ax.set_yticklabels([m.capitalize() for m in MODELS], fontsize=10, rotation=0)
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.set_title("Assertion Pass Rate (%)")
    fig.tight_layout()
    _save(fig, "08_assertion_heatmap.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 9: Error Source Distribution
# ──────────────────────────────────────────────────────────────

def plot_error_sources(df: pd.DataFrame, out_dir: str):
    top_sources = [
        "prop-validator", "compiler", "design-system-usage",
        "composition-validator", "aom-extractor", "responsive-checker",
        "keyboard-a11y", "overlap-detector",
    ]
    short_names = [
        "Props", "Compiler", "DS Usage", "Composition",
        "A11y (AOM)", "Responsive", "Keyboard", "Overlap",
    ]
    source_colors = sns.color_palette("Set2", len(top_sources))

    fig, ax = plt.subplots(figsize=(10, 5))

    groups = []
    bottoms = []

    for m in MODELS:
        for cfg in CONFIGS:
            mask = (df["model"] == m) & (df["config"] == cfg)
            subset = df[mask]
            n_runs = len(subset)
            if n_runs == 0:
                continue

            groups.append(f"{m[:3].capitalize()}/{LABELS[cfg]}")
            source_counts = {}
            for sources in subset["issueSources"]:
                if not isinstance(sources, dict):
                    continue
                for src, count in sources.items():
                    source_counts[src] = source_counts.get(src, 0) + count

            normalized = [source_counts.get(s, 0) / n_runs for s in top_sources]
            bottoms.append(normalized)

    x = np.arange(len(groups))
    bottom_acc = np.zeros(len(groups))

    for si, (src, short) in enumerate(zip(top_sources, short_names)):
        vals = [b[si] for b in bottoms]
        ax.bar(
            x, vals, bottom=bottom_acc, color=source_colors[si],
            label=short, edgecolor="white", lw=0.3,
        )
        bottom_acc += np.array(vals)

    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontsize=8, rotation=45, ha="right")
    ax.set_ylabel("Issues per Run")
    ax.legend(
        fontsize=8, frameon=True, loc="upper right",
        bbox_to_anchor=(1.0, 1.0), ncol=2,
    )
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Error Source Distribution (per Run)")
    fig.tight_layout()
    _save(fig, "09_error_sources.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Plot 10: Score Distribution — Violin
# ──────────────────────────────────────────────────────────────

def plot_score_distribution(df: pd.DataFrame, out_dir: str):
    fig, ax = plt.subplots(figsize=(10, 5))

    plot_df = df.copy()
    plot_df["group"] = plot_df["model"].astype(str) + " / " + plot_df["config"].astype(str)
    order = [f"{m} / {c}" for m in MODELS for c in CONFIGS]
    palette = {f"{m} / {c}": COLORS[c] for m in MODELS for c in CONFIGS}

    present = [g for g in order if g in plot_df["group"].values]

    sns.violinplot(
        data=plot_df, x="group", y="score", hue="group", order=present,
        palette=palette, inner="quartile", cut=0, ax=ax,
        linewidth=0.8, legend=False,
    )

    ax.set_xticks(range(len(present)))
    ax.set_xticklabels(
        [g.replace(" / ", "\n") for g in present],
        fontsize=8,
    )
    ax.set_xlabel("")
    ax.set_ylabel("Quality Score")
    ax.set_ylim(0, 105)
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)
    ax.set_title("Score Distribution by Model and Configuration")
    fig.tight_layout()
    _save(fig, "10_score_distribution.png", out_dir)


# ──────────────────────────────────────────────────────────────
# Runner
# ──────────────────────────────────────────────────────────────

ALL_PLOTS = [
    ("01 Main Result", plot_main_result, False),
    ("02 Incremental Lift", plot_incremental_lift, False),
    ("03 Category Breakdown", plot_category_breakdown, False),
    ("04 Complexity Scaling", plot_complexity_scaling, False),
    ("05 Prescriptive vs Intent", plot_prescriptive_vs_intent, False),
    ("06 Render Success", plot_render_success, True),
    ("07 Cost vs Quality", plot_cost_vs_quality, False),
    ("08 Assertion Heatmap", plot_assertion_heatmap, False),
    ("09 Error Sources", plot_error_sources, False),
    ("10 Score Distribution", plot_score_distribution, False),
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
