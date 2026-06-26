#!/usr/bin/env python3
"""Kuratiertes Thesis-Plot-Set. Score-frei.

Liest die result.json direkt von Platte (autoritativ, deckt sich mit der
benchmark.json nach rebuild) plus iteration-data.json fuer Konvergenz und
Tool-Nutzung.

Stil-Vorgaben (Nutzer):
  - Legende IMMER unter der Abbildung
  - Titel klar und knapp, KEINE Klammer-Zusatzinfos (n=, configs ...) im Titel
  - KEINE Zahlen ueber den Balken
  - durchgaengig „pro Lauf“ (nicht „pro Run“)

Erzeugt (nur fuer Modelle mit Daten, n=3/Kombination -> 30 Laeufe je Config):
  errors_<model>.png        Fehleranzahl je Kategorie (NUR Fehler)   [Haupttext]
  warnings_<model>.png      Warnungen je Kategorie                   [Anhang]
  consistency_<model>.png   Assertion Pass Rate je Prompt            [Konsistenz]
  convergence.png           Fehler je validate-Aufruf, alle Punkte + Trend
  complexity.png            Fehler nach Prompt-Komplexitaet
  render.png                Render-Rate je Modell x Konfiguration
  tool_usage.png            Ø Werkzeugaufrufe je Konfiguration
  assertion_table.tex/.csv  Assertion Pass Rate als Tabelle (statt Heatmap)

Konvergenz nutzt nur Laeufe mit verfuegbarem Session-Transkript (Container-Laeufe
persistieren keins); das n im Label ist daher kleiner als 30 und ehrlich so
ausgewiesen. Re-run, sobald sonnet/opus fertig sind.
"""
import json
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(ROOT, "results")
OUT = os.path.join(ROOT, "plots")
os.makedirs(OUT, exist_ok=True)

MODELS = ["haiku", "sonnet", "opus"]
MODEL_LABELS = {"haiku": "Haiku", "sonnet": "Sonnet", "opus": "Opus"}
MODEL_COLORS = {"haiku": "#4878CF", "sonnet": "#E8963E", "opus": "#6ACC65"}
TIERS = ["bare", "mcp-stack", "full-stack"]
TIER_LABELS = {"bare": "Bare", "mcp-stack": "MCP-Stack", "full-stack": "Full-Stack"}
TIER_COLORS = {"bare": "#4878CF", "mcp-stack": "#E8963E", "full-stack": "#6ACC65"}
PROMPTS = [f"P-{i:02d}" for i in range(1, 11)]
COMPLEXITY = {"P-01": "niedrig", "P-02": "niedrig", "P-03": "niedrig", "P-04": "niedrig",
              "P-05": "mittel", "P-06": "mittel", "P-07": "mittel", "P-08": "mittel",
              "P-09": "hoch", "P-10": "hoch"}
COMPLEXITY_ORDER = ["niedrig", "mittel", "hoch"]

SRC_LABELS = {
    "compiler": "Compiler", "prop-validator": "Props",
    "composition-validator": "Composition", "design-system-usage": "DS Usage",
    "theme-variant-validator": "Theme/Variant", "accessible-name": "Acc. Name",
    "token-compliance": "Tokens", "responsive-checker": "Responsive",
    "runtime": "Runtime", "aom-extractor": "A11y (AOM)", "overlap-detector": "Overlap",
    "keyboard-a11y": "Keyboard", "overflow-detector": "Overflow",
    "layout-usage": "Layout", "table-usage": "Table", "collection-id": "Collection-ID",
    "component-conventions": "Konventionen", "other": "Sonstige",
}

plt.rcParams.update({
    "font.size": 11, "axes.titlesize": 13, "axes.titleweight": "bold",
    "axes.labelsize": 11, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.alpha": 0.25, "figure.facecolor": "white",
    "figure.dpi": 300, "savefig.dpi": 300,
})


def _safe_load(path):
    try:
        return json.load(open(path))
    except Exception:
        return None  # halb geschriebene Datei (laufender Container) -> ueberspringen


def load(model, tier):
    runs = []
    for p in PROMPTS:
        for rn in (1, 2, 3):
            f = os.path.join(RES, f"{model}-{tier}", p, f"run-{rn}", "result.json")
            if not os.path.exists(f):
                continue
            d = _safe_load(f)
            if d is None:
                continue
            rep = d.get("report") or {}
            be, bw = {}, {}
            for e in (rep.get("errors") or []):
                be[e.get("source", "?")] = be.get(e.get("source", "?"), 0) + 1
            for w in (rep.get("warnings") or []):
                bw[w.get("source", "?")] = bw.get(w.get("source", "?"), 0) + 1
            a = d.get("assertions") or {}
            runs.append({"prompt": p, "render": bool((d.get("quality") or {}).get("renderSuccess")),
                         "errBySrc": be, "warnBySrc": bw, "nErr": sum(be.values()),
                         "pr": a.get("passRate")})
    return runs


DATA = {m: {t: load(m, t) for t in TIERS} for m in MODELS}
PRESENT = [m for m in MODELS if any(DATA[m][t] for t in TIERS)]


def save(fig, name):
    fig.savefig(os.path.join(OUT, name), bbox_inches="tight", pad_inches=0.18)
    plt.close(fig)
    print("  ->", name)


def legend_below(ax, handles, labels, ncol=3, y=-0.16):
    ax.legend(handles, labels, loc="upper center", bbox_to_anchor=(0.5, y),
              ncol=ncol, frameon=False, handlelength=1.4, columnspacing=1.6)


def tier_handles():
    return ([plt.Rectangle((0, 0), 1, 1, color=TIER_COLORS[t]) for t in TIERS],
            [TIER_LABELS[t] for t in TIERS])


def mean(xs):
    return float(np.mean(xs)) if len(xs) else 0.0


# ── Fehler / Warnungen je Kategorie, je Modell ─────────────────────────
def _source_plot(model, key, fname, ylabel, title, top=None):
    if not any(DATA[model][t] for t in TIERS):
        return
    totals = {}
    for t in TIERS:
        for r in DATA[model][t]:
            for s, c in r[key].items():
                totals[s] = totals.get(s, 0) + c
    srcs = [s for s, _ in sorted(totals.items(), key=lambda kv: -kv[1])]
    if top and len(srcs) > top:
        srcs = srcs[:top]
    means = {t: [mean([r[key].get(s, 0) for r in DATA[model][t]]) for s in srcs]
             for t in TIERS}
    x = np.arange(len(srcs))
    w = 0.26
    fig, ax = plt.subplots(figsize=(8.6, 4.9))
    for i, t in enumerate(TIERS):
        ax.bar(x + (i - 1) * w, means[t], w, color=TIER_COLORS[t],
               edgecolor="white", linewidth=0.5)
    ax.set_xticks(x)
    ax.set_xticklabels([SRC_LABELS.get(s, s) for s in srcs], rotation=20, ha="right")
    ax.set_ylabel(ylabel)
    ax.set_title(f"{title} — {MODEL_LABELS[model]}")
    legend_below(ax, *tier_handles(), ncol=3, y=-0.26)
    save(fig, fname)


def plot_errors():
    for m in PRESENT:
        _source_plot(m, "errBySrc", f"errors_{m}.png", "Ø Fehler pro Lauf",
                     "Fehleranzahl je Kategorie")


def plot_warnings():
    for m in PRESENT:
        _source_plot(m, "warnBySrc", f"warnings_{m}.png", "Ø Warnungen pro Lauf",
                     "Warnungen je Kategorie", top=10)


# ── Per-Prompt-Konsistenz: Assertion Pass Rate je Prompt ───────────────
def plot_consistency():
    for m in PRESENT:
        if not any(DATA[m][t] for t in TIERS):
            continue
        fig, ax = plt.subplots(figsize=(8.4, 4.6))
        x = np.arange(len(PROMPTS))
        any_line = False
        for t in TIERS:
            ys = []
            for p in PROMPTS:
                vals = [r["pr"] for r in DATA[m][t] if r["prompt"] == p and r["pr"] is not None]
                ys.append(100 * np.median(vals) if vals else np.nan)
            if np.all(np.isnan(ys)):
                continue
            ax.plot(x, ys, marker="o", color=TIER_COLORS[t], linewidth=2, label=TIER_LABELS[t])
            any_line = True
        if not any_line:
            plt.close(fig)
            continue
        ax.set_xticks(x)
        ax.set_xticklabels(PROMPTS, rotation=30, ha="right")
        ax.set_ylabel("Assertion Pass Rate (%)")
        ax.set_ylim(0, 105)
        ax.set_title(f"Assertion Pass Rate je Prompt — {MODEL_LABELS[m]}")
        legend_below(ax, *tier_handles(), ncol=3)
        save(fig, f"consistency_{m}.png")


# ── Per-Prompt: Render-Rate je Prompt ──────────────────────────────────
def plot_render_per_prompt():
    for m in PRESENT:
        if not any(DATA[m][t] for t in TIERS):
            continue
        fig, ax = plt.subplots(figsize=(8.4, 4.6))
        x = np.arange(len(PROMPTS))
        any_line = False
        for t in TIERS:
            ys = []
            for p in PROMPTS:
                runs = [r for r in DATA[m][t] if r["prompt"] == p]
                ys.append(100 * mean([1 if r["render"] else 0 for r in runs])
                          if runs else np.nan)
            if np.all(np.isnan(ys)):
                continue
            ax.plot(x, ys, marker="o", color=TIER_COLORS[t], linewidth=2,
                    label=TIER_LABELS[t])
            any_line = True
        if not any_line:
            plt.close(fig)
            continue
        ax.set_xticks(x)
        ax.set_xticklabels(PROMPTS, rotation=30, ha="right")
        ax.set_ylabel("Render-Rate (%)")
        ax.set_ylim(0, 105)
        ax.set_title(f"Render-Rate je Prompt — {MODEL_LABELS[m]}")
        legend_below(ax, *tier_handles(), ncol=3)
        save(fig, f"render_perprompt_{m}.png")


# ── Konvergenz: alle Punkte + Trendkurve, 3 Modelle ────────────────────
def plot_convergence():
    it = _safe_load(os.path.join(ROOT, "iteration-data.json"))
    if it is None:
        return
    rng = np.random.default_rng(42)
    MIN_RUNS = 5  # Trend nur zeigen, solange so viele Läufe den Aufruf erreichen
    fig, ax = plt.subplots(figsize=(7.4, 4.8))
    handles, labels = [], []
    xmax = 1
    for m in MODELS:
        runs = [r for r in it["runs"] if r["model"] == m and r["config"] == "full-stack"
                and r.get("hasSessionData") and r.get("validateCallDetails")]
        series = []
        for r in runs:
            # Nur echte validate-Laeufe (ok), Fehlinvokationen ausschliessen.
            seq = [c.get("errorCount", 0) for c in r["validateCallDetails"]
                   if c.get("ok") and (c.get("checks") == "all" or c.get("scope") == "all")]
            if seq:
                series.append(seq)
        if not series:
            continue
        # Cutoff = letzter Aufruf, den noch mindestens MIN_RUNS Läufe erreichen.
        maxlen = max(len(s) for s in series)
        reach = [sum(1 for s in series if len(s) > i) for i in range(maxlen)]
        cutoff = max((i + 1 for i in range(maxlen) if reach[i] >= MIN_RUNS), default=1)
        xmax = max(xmax, cutoff)
        # Streuung nur bis zum Cutoff (danach nur noch Einzelläufe).
        px, py = [], []
        for s in series:
            for i, v in enumerate(s[:cutoff]):
                px.append(i + 1 + rng.uniform(-0.10, 0.10))
                py.append(v)
        ax.scatter(px, py, s=16, color=MODEL_COLORS[m], alpha=0.30, edgecolors="none")
        # Trend = Mittelwert je Aufruf ueber forward-gefuellte Serien
        # (konvergierte Laeufe bleiben bei 0). Mittelwert statt Median, weil
        # der Median bei den sauberen Modellen schon ab Aufruf 1 auf 0 liegt
        # und die Konvergenz dann nicht sichtbar waere.
        mat = np.array([s + [s[-1]] * (maxlen - len(s)) for s in series], dtype=float)
        med = np.mean(mat, axis=0)[:cutoff]
        idx = np.arange(1, cutoff + 1)
        line, = ax.plot(idx, med, color=MODEL_COLORS[m], linewidth=2.6, marker="o")
        handles.append(line)
        labels.append(f"{MODEL_LABELS[m]} – Mittelwert (n={len(series)})")
    if not handles:
        plt.close(fig)
        return
    ax.set_xlim(0.5, xmax + 0.5)
    ax.set_xlabel("validate-Aufruf im Loop (Scope „all“)")
    ax.set_ylabel("Fehler im Aufruf")
    ax.set_yscale("symlog", linthresh=1)
    ax.set_yticks([0, 1, 10, 100])
    ax.set_yticklabels(["0", "1", "10", "100"])
    ax.set_ylim(0, 300)
    ax.set_title("Konvergenz der Fehler im Loop")
    ax.annotate("Punkte = einzelne Läufe; Skala symlog (0, 1, 10, 100); "
                "Trend bis mind. fünf Läufe den Aufruf erreichen",
                xy=(0.5, 0.98), xycoords="axes fraction", ha="center", va="top",
                fontsize=7.5, color="gray")
    legend_below(ax, handles, labels, ncol=len(handles))
    save(fig, "convergence.png")


# ── Komplexitaets-Skalierung ───────────────────────────────────────────
def plot_complexity():
    fig, ax = plt.subplots(figsize=(7.4, 4.6))
    x = np.arange(len(COMPLEXITY_ORDER))
    w = 0.26
    for i, t in enumerate(TIERS):
        ys = []
        for comp in COMPLEXITY_ORDER:
            vals = [r["nErr"] for m in PRESENT for r in DATA[m][t]
                    if COMPLEXITY[r["prompt"]] == comp]
            ys.append(mean(vals))
        ax.bar(x + (i - 1) * w, ys, w, color=TIER_COLORS[t], edgecolor="white", linewidth=0.5)
    ax.set_xticks(x)
    ax.set_xticklabels([c.capitalize() for c in COMPLEXITY_ORDER])
    ax.set_xlabel("Aufgaben-Komplexität")
    ax.set_ylabel("Ø Fehler pro Lauf")
    ax.set_title("Fehler nach Aufgaben-Komplexität")
    legend_below(ax, *tier_handles(), ncol=3)
    save(fig, "complexity.png")


# ── Render-Rate je Modell x Tier ───────────────────────────────────────
def plot_render():
    fig, ax = plt.subplots(figsize=(7.4, 4.6))
    x = np.arange(len(PRESENT))
    w = 0.26
    for i, t in enumerate(TIERS):
        ys = [100 * mean([1 if r["render"] else 0 for r in DATA[m][t]]) if DATA[m][t]
              else 0 for m in PRESENT]
        ax.bar(x + (i - 1) * w, ys, w, color=TIER_COLORS[t], edgecolor="white", linewidth=0.5)
    ax.set_xticks(x)
    ax.set_xticklabels([MODEL_LABELS[m] for m in PRESENT])
    ax.set_ylabel("Render-Rate (%)")
    ax.set_ylim(0, 105)
    ax.set_title("Render-Rate je Modell und Konfiguration")
    legend_below(ax, *tier_handles(), ncol=3)
    save(fig, "render.png")


# ── Assertion Pass Rate als TABELLE (statt Heatmap) ────────────────────
def make_assertion_table():
    rows = []
    for m in PRESENT:
        cells = []
        for t in TIERS:
            vals = [r["pr"] for r in DATA[m][t] if r["pr"] is not None]
            cells.append(100 * mean(vals) if vals else None)
        rows.append((m, cells))
    # CSV
    with open(os.path.join(OUT, "assertion_table.csv"), "w") as f:
        f.write("model," + ",".join(TIERS) + "\n")
        for m, cells in rows:
            f.write(m + "," + ",".join("" if c is None else f"{c:.1f}" for c in cells) + "\n")
    # LaTeX (booktabs), Werte als Prozent mit Dezimalkomma
    lines = [r"\begin{tabular}{lrrr}", r"\toprule",
             "Modell & " + " & ".join(TIER_LABELS[t] for t in TIERS) + r" \\", r"\midrule"]
    for m, cells in rows:
        cstr = " & ".join("--" if c is None else f"{c:.1f}".replace(".", ",") for c in cells)
        lines.append(f"{MODEL_LABELS[m]} & {cstr} " + r"\\")
    lines += [r"\bottomrule", r"\end{tabular}"]
    with open(os.path.join(OUT, "assertion_table.tex"), "w") as f:
        f.write("\n".join(lines) + "\n")
    print("  -> assertion_table.tex / .csv")
    print("     Assertion Pass Rate (%) je Modell x Config:")
    for m, cells in rows:
        print("       " + MODEL_LABELS[m].ljust(7)
              + "  ".join("  --  " if c is None else f"{c:5.1f}" for c in cells))


# ── Tool-Nutzung je Konfiguration ──────────────────────────────────────
def plot_tool_usage():
    it = _safe_load(os.path.join(ROOT, "iteration-data.json"))
    if it is None:
        return
    kinds = [("validateCalls", "validate"), ("mcpCalls", "MCP"),
             ("editCalls", "Edit"), ("readCalls", "Read"),
             ("writeCalls", "Write"), ("bashCalls", "Bash")]
    tiers_present = [t for t in TIERS
                     if any(r["config"] == t and r.get("hasSessionData") for r in it["runs"])]
    if not tiers_present:
        return
    x = np.arange(len(tiers_present))
    bottoms = np.zeros(len(tiers_present))
    cmap = plt.get_cmap("tab10")
    fig, ax = plt.subplots(figsize=(7.0, 4.6))
    handles = []
    for k, (field, lbl) in enumerate(kinds):
        ys = [mean([r.get(field, 0) for r in it["runs"]
                    if r["config"] == t and r.get("hasSessionData")]) for t in tiers_present]
        b = ax.bar(x, ys, 0.6, bottom=bottoms, color=cmap(k), edgecolor="white")
        bottoms += np.array(ys)
        handles.append(b)
    ax.set_xticks(x)
    ax.set_xticklabels([TIER_LABELS[t] for t in tiers_present])
    ax.set_ylabel("Ø Werkzeugaufrufe pro Lauf")
    ax.set_title("Werkzeugnutzung je Konfiguration")
    legend_below(ax, handles, [lbl for _, lbl in kinds], ncol=len(kinds))
    save(fig, "tool_usage.png")


if __name__ == "__main__":
    print("Vorhandene Modelle:", ", ".join(PRESENT) or "(keine)")
    for m in PRESENT:
        print("  " + m + ": " + ", ".join(f"{t}={len(DATA[m][t])}" for t in TIERS))
    print("Erzeuge:")
    plot_errors()
    plot_warnings()
    plot_consistency()
    plot_render_per_prompt()
    plot_convergence()
    plot_complexity()
    plot_render()
    plot_tool_usage()
    make_assertion_table()
    print("fertig.")
