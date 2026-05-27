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
    "P-11": "high", "P-12": "high",
}

PRESCRIPTIVE_IDS = {"P-01", "P-03", "P-05", "P-07", "P-09", "P-11"}
INTENT_IDS = {"P-02", "P-04", "P-06", "P-08", "P-10", "P-12"}

TASK_PAIRS = [
    ("P-01", "P-02", "Contact Form"),
    ("P-03", "P-04", "Profile Card"),
    ("P-05", "P-06", "Ticket Shop"),
    ("P-07", "P-08", "Settings Page"),
    ("P-09", "P-10", "EventHub Dashboard"),
    ("P-11", "P-12", "Booking Mgmt"),
]

COMPLEXITY_ORDER = ["low", "medium", "high"]
