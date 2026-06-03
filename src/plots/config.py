"""Shared visual identity and constants for thesis plots."""

COLORS = {
    "bare": "#4878CF",
    "mcp-stack": "#E8963E",
    "full-stack": "#6ACC65",
}

LABELS = {
    "bare": "Bare",
    "mcp-stack": "MCP-Stack",
    "full-stack": "Full-Stack",
}

MODELS = ["haiku", "sonnet", "opus"]
CONFIGS = ["bare", "mcp-stack", "full-stack"]

CAT_IDS = ["A", "B", "C", "D", "E"]
CAT_NAMES = {
    "A": "API Usage",
    "B": "Token Compl.",
    "C": "DOM Structure",
    "D": "Spatial & A11y",
    "E": "Func. Compl.",
}

COMPLEXITY = {
    "P-01": "low", "P-02": "low",
    "P-03": "low", "P-04": "low",
    "P-05": "medium", "P-06": "medium",
    "P-07": "medium", "P-08": "medium",
    "P-09": "high", "P-10": "high",
}

COMPLEXITY_ORDER = ["low", "medium", "high"]

# Short display labels for the issue-source ids actually emitted by the
# validator (verified against benchmark.json). The dynamic source plot (06)
# ranks sources by observed frequency and labels them here; any id not listed
# falls back to a humanized form and unranked sources are bucketed into "other".
# No phantom ids (required-ancestor/section-header) are hardcoded any more.
ISSUE_SOURCE_LABELS = {
    "compiler": "Compiler",
    "prop-validator": "Props",
    "composition-validator": "Composition",
    "design-system-usage": "DS Usage",
    "theme-variant-validator": "Theme/Variant",
    "accessible-name": "Acc. Name",
    "token-compliance": "Tokens",
    "responsive-checker": "Responsive",
    "runtime": "Runtime",
    "aom-extractor": "A11y (AOM)",
    "overlap-detector": "Overlap",
    "keyboard-a11y": "Keyboard",
    "overflow-detector": "Overflow",
    "other": "Other",
}

# Fixed RNG seed so stripplot jitter (and any other jittered scatter) is
# reproducible across regenerations — figures should be byte-stable.
JITTER_SEED = 42

# Note appended to the Wilcoxon figure/CSV when scipy is unavailable or a cell
# is under-powered (n < 6 pairs), so the reader is not misled by a missing test.
WILCOXON_FALLBACK_NOTE = (
    "Descriptive median delta only — Wilcoxon signed-rank test not reported "
    "(scipy unavailable or n < 6 paired runs)."
)
