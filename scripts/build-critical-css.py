#!/usr/bin/env python3
"""Extract above-the-fold CSS for inline critical rendering."""

from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "css" / "style.css"
OUTPUT = ROOT / "css" / "critical.css"

LINE_RANGES = [
    (1, 43),
    (45, 56),
    (77, 119),
    (133, 228),
    (304, 545),
    (548, 692),
    (694, 716),
]

MOBILE_768_LINES = [
    (2183, 2185),
    (2187, 2189),
    (2208, 2233),
    (2344, 2437),
]


def extract_lines(path: Path, ranges: list[tuple[int, int]]) -> str:
    lines = path.read_text(encoding="utf-8").splitlines()
    chunks: list[str] = []
    for start, end in ranges:
        chunks.extend(lines[start - 1 : end])
    return "\n".join(chunks)


def main() -> None:
    base = extract_lines(SOURCE, LINE_RANGES)
    mobile = extract_lines(SOURCE, MOBILE_768_LINES)
    css = f"{base}\n\n@media (max-width: 768px) {{\n{mobile}\n}}\n"
    OUTPUT.write_text(css, encoding="utf-8")

    minified = subprocess.check_output(
        ["npx", "--yes", "clean-css-cli", str(OUTPUT)],
        cwd=ROOT,
        text=True,
    )
    OUTPUT.write_text(minified, encoding="utf-8")
    print(f"wrote {OUTPUT} ({len(minified)} bytes)")


if __name__ == "__main__":
    main()
