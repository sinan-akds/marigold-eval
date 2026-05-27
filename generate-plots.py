#!/usr/bin/env python3
"""Generate 10 thesis-ready plots from benchmark data."""

import json, os, glob
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

script_dir = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(script_dir, "plots")
os.makedirs(OUT, exist_ok=True)
bm = json.load(open(os.path.join(script_dir, "benchmark.json")))
ev = json.load(open(os.path.join(script_dir, "evals.json")))

runs_all = bm.get("runs", [])
if not runs_all:
    print("No runs in benchmark.json — nothing to plot.")
    exit(0)

complexity = {e["id"]: e["complexity"] for e in ev["evals"]}
pairs = [("P-01","P-02"), ("P-03","P-04"), ("P-05","P-06"), ("P-07","P-08"), ("P-09","P-10"), ("P-11","P-12")]
pair_names = ["Contact\nForm", "Profile\nCard", "Ticket\nShop", "Settings\nPage", "EventHub\nDash.", "Booking\nMgmt"]

runs = [r for r in bm["runs"] if r.get("score") is not None]

R, O, G = "#D94F4F", "#E8963E", "#3EAF6E"
C = {"bare": R, "mcp-stack": O, "full-stack": G}
CL = {"bare": "Bare", "mcp-stack": "MCP-Stack", "full-stack": "Full-Stack"}
MODELS = ["haiku", "sonnet", "opus"]
CONFIGS = ["bare", "mcp-stack", "full-stack"]

plt.rcParams.update({
    "font.size": 11, "axes.titlesize": 13, "axes.labelsize": 11,
    "figure.dpi": 100, "savefig.dpi": 150, "figure.facecolor": "white",
    "axes.spines.top": False, "axes.spines.right": False,
})

def sc(model, config, pids=None):
    return [r["score"] for r in runs
            if r["model"] == model and r["config"] == config
            and (pids is None or r["evalId"] in pids)]

def save(fig, name):
    fig.savefig(f"{OUT}/{name}", bbox_inches="tight", pad_inches=0.15)
    plt.close(fig)
    print(f"  {name}")

def grid_y(ax):
    ax.grid(axis="y", alpha=0.15, lw=0.8)
    ax.set_axisbelow(True)

def n_label(model, config):
    n = len(sc(model, config))
    return f"(n={n})" if n < 20 else ""


# ──────────────────────────────────────────────────────────────
# 1. MAIN RESULT — Score by Model × Config
# ──────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 4.5))
x = np.arange(len(MODELS)); w = 0.24
for i, cfg in enumerate(CONFIGS):
    vals = [np.mean(sc(m, cfg)) if sc(m, cfg) else 0 for m in MODELS]
    stds = [np.std(sc(m, cfg)) if sc(m, cfg) else 0 for m in MODELS]
    bars = ax.bar(x+i*w, vals, w, yerr=stds, color=C[cfg], label=CL[cfg],
                  capsize=3, edgecolor="white", lw=0.5, error_kw={"lw": 1})
    for bi, (b, v) in enumerate(zip(bars, vals)):
        m = MODELS[bi]
        n = len(sc(m, cfg))
        lbl = f"{v:.0f}" if n >= 20 else f"{v:.0f}\n(n={n})"
        if v > 0: ax.text(b.get_x()+b.get_width()/2, v+stds[bi]+1.5, lbl,
                          ha="center", fontsize=8, fontweight="bold")
ax.set_ylabel("Quality Score (0–100)")
ax.set_xticks(x+w); ax.set_xticklabels([m.capitalize() for m in MODELS])
ax.set_ylim(0, 105); ax.legend(frameon=False, fontsize=10); grid_y(ax)
ax.set_title("Quality Score by Model and Configuration Tier")
save(fig, "01_main_result.png")


# ──────────────────────────────────────────────────────────────
# 2. INCREMENTAL LIFT — Stacked waterfall
# ──────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(7, 4.5))
for mi, m in enumerate(MODELS):
    b = np.mean(sc(m, "bare")) if sc(m, "bare") else 0
    mc = np.mean(sc(m, "mcp-stack")) if sc(m, "mcp-stack") else 0
    f = np.mean(sc(m, "full-stack")) if sc(m, "full-stack") else 0
    ax.bar(mi, b, 0.5, color=R, label="Bare" if mi==0 else None)
    ax.bar(mi, mc-b, 0.5, bottom=b, color=O, label="+ MCP Docs" if mi==0 else None)
    ax.bar(mi, f-mc, 0.5, bottom=mc, color=G, label="+ Validate" if mi==0 else None)
    ax.text(mi, f+1.5, f"{f:.0f}", ha="center", fontsize=11, fontweight="bold")
    ax.text(mi, b/2, f"{b:.0f}", ha="center", fontsize=9, color="white", fontweight="bold")
    if mc-b > 4: ax.text(mi, b+(mc-b)/2, f"+{mc-b:.0f}", ha="center", fontsize=9, color="white", fontweight="bold")
    if f-mc > 4: ax.text(mi, mc+(f-mc)/2, f"+{f-mc:.0f}", ha="center", fontsize=9, color="white", fontweight="bold")
ax.set_xticks(range(len(MODELS))); ax.set_xticklabels([m.capitalize() for m in MODELS])
ax.set_ylim(0, 100); ax.set_ylabel("Quality Score"); grid_y(ax)
ax.legend(frameon=False, loc="upper left", fontsize=10)
ax.set_title("Incremental Value of Each Configuration Tier")
save(fig, "02_incremental_lift.png")


# ──────────────────────────────────────────────────────────────
# 3. CATEGORY BREAKDOWN — Where does the tool help?
# ──────────────────────────────────────────────────────────────
cat_labels = {"A": "API\nUsage", "B": "Token\nCompl.", "C": "DOM\nStruct.", "D": "Spatial\nA11y", "E": "Func.\nCompl."}
cat_ids = ["A", "B", "C", "D", "E"]
cat_data = {}
for rfile in glob.glob(os.path.join(script_dir, "results/*/P-*/run-*/result.json")):
    parts = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(rfile)))).split("-", 1)
    if len(parts) < 2: continue
    model, config = parts
    try:
        r = json.load(open(rfile))
        cats = r.get("quality", {}).get("categories", {})
        if not cats: continue
        key = (model, config)
        cat_data.setdefault(key, {c: [] for c in cat_ids})
        for c in cat_ids:
            if c in cats: cat_data[key][c].append(cats[c].get("score", 0))
    except: pass

fig, axes = plt.subplots(1, 3, figsize=(15, 4.5), sharey=True)
for ai, m in enumerate(MODELS):
    ax = axes[ai]; x = np.arange(len(cat_ids)); w = 0.25
    for ci, cfg in enumerate(CONFIGS):
        key = (m, cfg)
        if key not in cat_data: continue
        vals = [np.mean(cat_data[key][c]) if cat_data[key][c] else 0 for c in cat_ids]
        ax.bar(x+ci*w, vals, w, color=C[cfg], label=CL[cfg] if ai==0 else None, edgecolor="white", lw=0.5)
    ax.set_xticks(x+w); ax.set_xticklabels([cat_labels[c] for c in cat_ids], fontsize=9)
    ax.set_ylim(0, 100); ax.set_title(m.capitalize()); grid_y(ax)
axes[0].set_ylabel("Category Score (0–100)")
axes[0].legend(frameon=False, fontsize=9)
fig.suptitle("Score by Quality Category", y=1.02, fontsize=14)
fig.tight_layout()
save(fig, "03_category_breakdown.png")


# ──────────────────────────────────────────────────────────────
# 4. ERROR SOURCES — What does the tool eliminate?
#    Static checks: normalized per run (all runs have these)
#    Spatial checks: normalized per RENDERED run only
# ──────────────────────────────────────────────────────────────
static_src = ["design-system-usage", "prop-validator", "compiler", "composition-validator"]
spatial_src = ["responsive-checker", "keyboard-a11y", "overlap-detector", "overflow-detector"]
top_src = static_src + spatial_src
short_src = ["DS Usage", "Props", "Compiler", "Composition", "Responsive", "Keyboard", "Overlap", "Overflow"]

src_issues = {}   # (model, config) -> source -> [errors, warnings]
n_total = {}      # (model, config) -> total runs
n_rendered = {}   # (model, config) -> runs that rendered (renderTimeMs > 0)

for rfile in glob.glob(os.path.join(script_dir, "results/*/P-*/run-*/result.json")):
    parts = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(rfile)))).split("-", 1)
    if len(parts) < 2: continue
    model, config = parts
    try:
        r = json.load(open(rfile))
        cats = r.get("quality", {}).get("categories", {})
        key = (model, config)
        n_total[key] = n_total.get(key, 0) + 1
        rendered = r.get("renderTimeMs", 0) > 0
        if rendered:
            n_rendered[key] = n_rendered.get(key, 0) + 1
        for cat in cats.values():
            for issue in cat.get("issues", []):
                src = issue.get("source", "unknown")
                src_issues.setdefault(key, {})
                src_issues[key].setdefault(src, [0, 0])
                idx = 0 if issue.get("severity") == "error" else 1
                src_issues[key][src][idx] += 1
    except: pass

fig, axes = plt.subplots(1, 3, figsize=(15, 4.5), sharey=True)
for mi, m in enumerate(MODELS):
    ax = axes[mi]
    x = np.arange(len(top_src)); w = 0.25
    for ci, cfg in enumerate(CONFIGS):
        key = (m, cfg)
        vals = []
        for s in top_src:
            raw = (src_issues.get(key, {}).get(s, [0,0])[0] +
                   src_issues.get(key, {}).get(s, [0,0])[1])
            if s in spatial_src:
                denom = n_rendered.get(key, 1)
            else:
                denom = n_total.get(key, 1)
            vals.append(raw / max(denom, 1))
        ax.bar(x+ci*w, vals, w, color=C[cfg], label=CL[cfg] if mi==0 else None,
               edgecolor="white", lw=0.5)
    ax.set_xticks(x+w); ax.set_xticklabels(short_src, fontsize=7, rotation=35, ha="right")
    ax.axvline(x=3.625, color="black", lw=0.6, ls=":", alpha=0.4)
    ax.set_title(m.capitalize()); grid_y(ax)
axes[0].set_ylabel("Avg Issues per Run")
axes[0].legend(fontsize=8, frameon=False)
fig.suptitle("Issue Sources by Configuration\n(spatial checks normalized per rendered run)", y=1.04, fontsize=13)
fig.tight_layout()
save(fig, "04_error_sources.png")


# ──────────────────────────────────────────────────────────────
# 5. COMPLEXITY × TIER INTERACTION — Line chart
# ──────────────────────────────────────────────────────────────
comps = ["low", "medium", "high"]
comp_x = [0, 1, 2]
comp_labels = ["Simple", "Medium", "Complex"]

fig, ax = plt.subplots(figsize=(8, 5))
ls = {"bare": "--", "mcp-stack": "-.", "full-stack": "-"}
mk = {"haiku": "o", "sonnet": "s", "opus": "D"}
alphas = {"haiku": 0.45, "sonnet": 0.8, "opus": 1.0}
lws = {"haiku": 1.5, "sonnet": 2.0, "opus": 2.5}
for m in MODELS:
    for cfg in CONFIGS:
        vals = []
        for comp in comps:
            pids = [p for p, c in complexity.items() if c == comp]
            s = sc(m, cfg, pids)
            vals.append(np.mean(s) if s else np.nan)
        if all(np.isnan(v) for v in vals): continue
        ax.plot(comp_x, vals, color=C[cfg], marker=mk[m], markersize=7, lw=lws[m],
                linestyle=ls[cfg], alpha=alphas[m], label=f"{m.capitalize()}/{CL[cfg]}")
ax.set_xticks(comp_x); ax.set_xticklabels(comp_labels)
ax.set_ylim(0, 100); ax.set_ylabel("Quality Score"); grid_y(ax)
ax.legend(fontsize=7, ncol=3, frameon=False, loc="upper right")
ax.set_title("Quality vs. Task Complexity")
save(fig, "05_complexity_interaction.png")


# ──────────────────────────────────────────────────────────────
# 6. PROMPT SPECIFICITY GAP — Closes with validate
# ──────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 4.5))
x = np.arange(len(CONFIGS)); w = 0.25
colors_m = {"haiku": "#9CA3AF", "sonnet": "#374151", "opus": "#6366F1"}
for mi, m in enumerate(MODELS):
    deltas = []
    for cfg in CONFIGS:
        pa, ia = [], []
        for (p, i) in pairs:
            pa.extend(sc(m, cfg, [p])); ia.extend(sc(m, cfg, [i]))
        deltas.append(np.mean(pa)-np.mean(ia) if pa and ia else 0)
    bars = ax.bar(x+mi*w, deltas, w, label=m.capitalize(), color=colors_m[m], edgecolor="white", lw=0.5)
    for b, v in zip(bars, deltas):
        if abs(v) > 0.3:
            ax.text(b.get_x()+b.get_width()/2, v + (0.4 if v >= 0 else -0.6),
                    f"{v:+.1f}", ha="center", va="bottom" if v >= 0 else "top", fontsize=7.5)
ax.axhline(0, color="black", lw=0.8)
ax.set_ylabel("Score Delta (Prescriptive − Intent-driven)")
ax.set_xticks(x+w); ax.set_xticklabels([CL[c] for c in CONFIGS]); grid_y(ax)
ax.legend(frameon=False, fontsize=9)
ax.set_title("Prompt Specificity Gap by Configuration Tier")
save(fig, "06_specificity_gap.png")


# ──────────────────────────────────────────────────────────────
# 7. RENDER SUCCESS — by model × config
# ──────────────────────────────────────────────────────────────
render = {}
for rfile in glob.glob(os.path.join(script_dir, "results/*/P-*/run-*/result.json")):
    parts = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(rfile)))).split("-", 1)
    if len(parts) < 2: continue
    model, config = parts
    key = (model, config)
    try:
        r = json.load(open(rfile))
        rt = r.get("renderTimeMs", 0)
        render.setdefault(key, [0, 0])
        render[key][0 if rt > 0 else 1] += 1
    except: pass

fig, ax = plt.subplots(figsize=(8, 4.5))
x = np.arange(len(MODELS)); w = 0.24
for ci, cfg in enumerate(CONFIGS):
    pcts = []
    labels_txt = []
    for m in MODELS:
        key = (m, cfg)
        s, f = render.get(key, [0, 0])
        t = s + f
        pcts.append(s/t*100 if t else 0)
        labels_txt.append(f"{s}/{t}")
    bars = ax.bar(x+ci*w, pcts, w, color=C[cfg], label=CL[cfg], edgecolor="white", lw=0.5)
    for b, p, lt in zip(bars, pcts, labels_txt):
        ax.text(b.get_x()+b.get_width()/2, p+1.5, f"{p:.0f}%\n({lt})",
                ha="center", va="bottom", fontsize=7, fontweight="bold")
ax.set_xticks(x+w); ax.set_xticklabels([m.capitalize() for m in MODELS])
ax.set_ylim(0, 120); ax.set_ylabel("Render Success Rate (%)"); grid_y(ax)
ax.legend(frameon=False, fontsize=9)
ax.set_title("Component Render Success Rate by Model")
save(fig, "07_render_success.png")


# ──────────────────────────────────────────────────────────────
# 8. COST EFFICIENCY — Score per dollar
# ──────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(8, 5))
mkrs = {"haiku": "o", "sonnet": "s", "opus": "D"}
for m in MODELS:
    for cfg in CONFIGS:
        sub = [r for r in runs if r["model"]==m and r["config"]==cfg and r.get("efficiency")]
        if not sub: continue
        costs = [r["efficiency"]["costUsd"] for r in sub if r["efficiency"]["costUsd"] > 0]
        if not costs: continue
        avg_cost = np.mean(costs)
        avg_score = np.mean([r["score"] for r in sub])
        std_score = np.std([r["score"] for r in sub])
        ax.scatter(avg_cost, avg_score, c=C[cfg], marker=mkrs[m], s=130, zorder=5,
                   edgecolors="black", lw=0.8)
        ax.errorbar(avg_cost, avg_score, yerr=std_score, color=C[cfg], fmt="none",
                    capsize=4, lw=1, zorder=4)
        label = f"{m[0].upper()}/{CL[cfg][:4]}"
        n = len(sub)
        if n < 20: label += f" (n={n})"
        ax.annotate(label, (avg_cost, avg_score),
                    textcoords="offset points", xytext=(8, -12), fontsize=7)

ax.set_xlabel("Avg Cost per Run (USD)")
ax.set_ylabel("Avg Quality Score")
ax.set_ylim(0, 100); ax.set_xlim(left=-0.1)
ax.grid(True, alpha=0.15); grid_y(ax)
ax.set_title("Cost–Quality Trade-off (avg per model×config)")
save(fig, "08_cost_efficiency.png")


# ──────────────────────────────────────────────────────────────
# 9. ITERATION OVERHEAD — Turns, Time, Tokens side by side
# ──────────────────────────────────────────────────────────────
metrics = [
    ("Avg Duration (s)", lambda r: r["efficiency"]["durationMs"]/1000),
    ("Avg Turns", lambda r: r["efficiency"]["numTurns"]),
    ("Avg Output Tokens (K)", lambda r: r["efficiency"]["outputTokens"]/1000),
    ("Avg Cost (USD)", lambda r: r["efficiency"]["costUsd"]),
]

fig, axes = plt.subplots(1, 4, figsize=(16, 4))
for axi, (label, fn) in enumerate(metrics):
    ax = axes[axi]
    x = np.arange(len(MODELS)); w = 0.22
    for ci, cfg in enumerate(CONFIGS):
        vals = []
        for m in MODELS:
            sub = [r for r in runs if r["model"]==m and r["config"]==cfg and r.get("efficiency")]
            vals.append(np.mean([fn(r) for r in sub]) if sub else 0)
        bars = ax.bar(x+ci*w, vals, w, color=C[cfg], label=CL[cfg] if axi==0 else None,
                      edgecolor="white", lw=0.5)
        for b, v in zip(bars, vals):
            if v > 0:
                fmt = f"${v:.2f}" if "Cost" in label else (f"{v:.0f}" if v >= 1 else f"{v:.1f}")
                ax.text(b.get_x()+b.get_width()/2, v*1.02+0.3, fmt, ha="center", fontsize=6.5)
    ax.set_xticks(x+w); ax.set_xticklabels([m.capitalize() for m in MODELS], fontsize=9)
    ax.set_title(label, fontsize=10); grid_y(ax)
axes[0].legend(frameon=False, fontsize=8)
fig.suptitle("Iteration Overhead by Configuration Tier", y=1.02, fontsize=13)
fig.tight_layout()
save(fig, "09_iteration_overhead.png")


# ──────────────────────────────────────────────────────────────
# 10. HEATMAP — Score per Prompt × Config
# ──────────────────────────────────────────────────────────────
pids = [e["id"] for e in ev["evals"]]
fig, axes = plt.subplots(1, 3, figsize=(17, 3.8))
for ai, m in enumerate(MODELS):
    ax = axes[ai]
    mat = []
    for cfg in CONFIGS:
        row = [np.mean(sc(m, cfg, [p])) if sc(m, cfg, [p]) else np.nan for p in pids]
        mat.append(row)
    mat = np.array(mat)
    im = ax.imshow(mat, cmap="RdYlGn", vmin=0, vmax=100, aspect="auto")
    for i in range(3):
        for j in range(len(pids)):
            v = mat[i, j]
            if not np.isnan(v):
                ax.text(j, i, f"{v:.0f}", ha="center", va="center", fontsize=7,
                        color="white" if v < 35 else "black")
            else:
                ax.text(j, i, "–", ha="center", va="center", fontsize=7, color="#999")
    ax.set_xticks(range(len(pids)))
    ax.set_xticklabels(pids, fontsize=7, rotation=45, ha="right")
    ax.set_yticks(range(3))
    ax.set_yticklabels([CL[c] for c in CONFIGS], fontsize=9)
    ax.set_title(m.capitalize(), fontsize=12)
cb = fig.colorbar(im, ax=axes.tolist(), shrink=0.85, pad=0.02)
cb.set_label("Score", fontsize=9)
fig.suptitle("Score per Prompt and Configuration", y=1.05, fontsize=13)
save(fig, "10_heatmap.png")


print(f"\nDone — {len(os.listdir(OUT))} plots in {OUT}/")
