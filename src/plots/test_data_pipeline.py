"""FP-safety tests for the score-free plot data pipeline (work group E).

These lock in the guarantees that matter for the thesis eval: a run that did
not render must never be counted as "clean", normalization must never divide by
zero, and the dynamic issue-source derivation must bucket (not drop) unknown
sources. Run with: python3 -m pytest src/plots/test_data_pipeline.py
"""

import json
import math
import os
import tempfile

import pandas as pd

from .data import load
from .generate import _rank_issue_sources, _source_label, _rendered, _median_iqr


def _write_bm(runs):
    d = tempfile.mkdtemp()
    json.dump({"runs": runs}, open(os.path.join(d, "benchmark.json"), "w"))
    return d


def _run(evalId, **detail):
    return {
        "evalId": evalId, "model": "haiku", "config": "bare", "runNumber": 1,
        "score": 50, "assertionPassRate": 0.8,
        "detail": {"categories": {}, **detail},
    }


def test_required_pass_rate_from_detail_then_toplevel_then_none():
    d = _write_bm([
        _run("P-01", requiredPassRate=0.9, renderSuccess=True, linesOfCode=100),
        {**_run("P-02", renderSuccess=False), "requiredPassRate": 0.5},
        _run("P-03", renderSuccess=True),
    ])
    df = load(d)
    by = df.set_index("evalId")["requiredPassRate"]
    assert by["P-01"] == 0.9                       # from detail
    assert by["P-02"] == 0.5                        # top-level fallback
    assert by["P-03"] is None or math.isnan(by["P-03"])  # absent -> None/NaN


def test_errors_per_100loc_none_when_loc_missing_never_zero_or_inf():
    d = _write_bm([
        _run("P-01", renderSuccess=True, linesOfCode=200,
             categories={"A": {"score": 0, "errorCount": 4, "warningCount": 0}}),
        _run("P-02", renderSuccess=True,  # LOC missing
             categories={"A": {"score": 0, "errorCount": 4, "warningCount": 0}}),
        _run("P-03", renderSuccess=True, linesOfCode=0,  # zero LOC -> no div-by-zero
             categories={"A": {"score": 0, "errorCount": 4, "warningCount": 0}}),
    ])
    df = load(d).set_index("evalId")
    assert abs(df.loc["P-01", "errors_per_100loc"] - 2.0) < 1e-9
    for ev in ("P-02", "P-03"):
        v = df.loc[ev, "errors_per_100loc"]
        assert v is None or math.isnan(v)
        assert not (isinstance(v, float) and math.isinf(v))


def test_nonrendering_runs_excluded_from_clean_view_but_render_rate_visible():
    # 3 render-fail runs (no dynamic checks ran) + 1 rendered run.
    d = _write_bm([
        _run(f"P-0{i}", renderSuccess=False) for i in (1, 2, 3)
    ] + [_run("P-04", renderSuccess=True)])
    df = load(d)
    rendered = _rendered(df)
    assert len(rendered) == 1                      # 3 non-rendering excluded
    assert df["renderSuccess"].sum() == 1          # render rate still computable
    # The non-rendering runs are NOT silently treated as clean in the gated view.
    assert (rendered["evalId"] == "P-04").all()


def test_errorfree_flags_are_deterministic_reads_of_counts():
    d = _write_bm([_run("P-01", renderSuccess=True, categories={
        "A": {"score": 0, "errorCount": 3, "warningCount": 0},
        "D": {"score": 1, "errorCount": 0, "warningCount": 0},
    })])
    row = load(d).iloc[0]
    assert row["cat_A_errorfree"] == 0
    assert row["cat_D_errorfree"] == 1


def test_issue_source_derivation_buckets_unknown_not_drops():
    df = pd.DataFrame({"issueSources": [{
        "compiler": 3, "mystery-checker": 99,
        **{c: 1 for c in "abcdefghij"},
    }]})
    top = _rank_issue_sources(df, top_n=10)
    assert "mystery-checker" in top                # highest count, kept
    assert "compiler" in top                        # real source not dropped
    # Anything outside top-N is bucketed into "other" by the caller, never lost.
    rest = [s for s in df["issueSources"].iloc[0] if s not in top]
    assert rest                                     # leftovers exist -> "other"
    # Unknown ids get a humanized label, no phantom hardcoded rows.
    assert _source_label("mystery-checker") == "Mystery Checker"


def test_no_phantom_sources_in_labels():
    # The previously-hardcoded phantoms must not be invented anywhere.
    assert _source_label("required-ancestor") == "Required Ancestor"  # humanized, not special
    # A source observed zero times must NOT rank at all — it never fired, so
    # showing it would be a phantom. A real source (positive count) in the same
    # frame must still rank.
    df = pd.DataFrame({"issueSources": [{"required-ancestor": 0, "compiler": 5}]})
    ranked = _rank_issue_sources(df, 10)
    assert "required-ancestor" not in ranked
    assert ranked == ["compiler"]


def test_absent_category_is_not_counted_as_error_free():
    # A result.json that OMITS a category must not be reported as 100% clean for
    # it. The errorfree flag is None (excluded from the mean), not 1, and the
    # error count is None — but the raw n_errors total still sums correctly over
    # the categories that WERE evaluated.
    d = _write_bm([_run("P-01", renderSuccess=True, categories={
        "A": {"score": 0, "errorCount": 2, "warningCount": 1},
        # B, C, D, E absent -> never evaluated
    })])
    row = load(d).iloc[0]
    assert row["cat_A_errorfree"] == 0          # present, has errors
    for absent in ("B", "C", "D", "E"):
        assert row[f"cat_{absent}_errorfree"] is None   # NOT 1 (not "clean")
        assert row[f"cat_{absent}_errors"] is None
    assert row["n_errors"] == 2                  # total over evaluated cats only
    assert row["n_warnings"] == 1

    # The error-free rate (plot 15) averages this flag; pandas skips None, so an
    # absent category cannot inflate the reported rate to 100%.
    df = load(d)
    assert math.isnan(df["cat_B_errorfree"].mean())  # no evaluated runs -> NaN, not 100


def test_median_iqr_conservative_and_safe_on_empty():
    assert _median_iqr([]) == (0.0, 0.0, 0.0)
    med, lo, hi = _median_iqr([1, 2, 3, 100])
    assert med == 2.5 and lo >= 0 and hi >= 0
