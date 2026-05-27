"""CLI entry point: python -m src.plots [--out-dir plots/]"""

import argparse
import os

from .data import load, load_all_runs
from .generate import generate_all


def main():
    parser = argparse.ArgumentParser(description="Generate thesis plots from benchmark data")
    parser.add_argument("--out-dir", default="plots", help="Output directory (default: plots/)")
    parser.add_argument("--root", default=None, help="Project root (default: auto-detect)")
    args = parser.parse_args()

    root = args.root or os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    out_dir = args.out_dir if os.path.isabs(args.out_dir) else os.path.join(root, args.out_dir)

    df = load(root)
    if df.empty:
        print("No scored runs in benchmark.json — nothing to plot.")
        return

    df_all = load_all_runs(root)
    generate_all(df, df_all, out_dir)


if __name__ == "__main__":
    main()
