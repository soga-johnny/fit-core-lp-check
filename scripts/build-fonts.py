#!/usr/bin/env python3
"""Build self-hosted Noto Sans JP subset from page charset."""

from __future__ import annotations

import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FONTS_DIR = ROOT / "assets" / "fonts"
CSS_PATH = ROOT / "css" / "fonts.css"
UA = (
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
)


def collect_charset() -> str:
    parts = [
        (ROOT / "index.html").read_text(encoding="utf-8"),
        (ROOT / "css" / "style.css").read_text(encoding="utf-8"),
        (ROOT / "js" / "main.js").read_text(encoding="utf-8"),
    ]
    text = re.sub(r"<[^>]+>", "", parts[0]) + parts[1] + parts[2]
    chars = sorted({ch for ch in text if ord(ch) > 31 and ch not in "\r\n\t"})
    extra = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@._-+%:/?=&"
    for ch in extra:
        if ch not in chars:
            chars.append(ch)
    return "".join(chars)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req) as res:
        return res.read()


def main() -> None:
    charset = collect_charset()
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    (FONTS_DIR / "charset.txt").write_text(charset, encoding="utf-8")

    css_url = (
        "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700"
        f"&display=swap&text={urllib.parse.quote(charset)}"
    )
    remote_css = fetch(css_url).decode("utf-8")

    urls = re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+\.woff2[^)]*)\)", remote_css)
    if not urls:
        urls = re.findall(r"url\((https://fonts\.gstatic\.com/l/font\?[^)]+)\)", remote_css)
    if not urls:
        raise SystemExit("No font URLs found in Google Fonts response")

    unique_urls = list(dict.fromkeys(urls))
    local_files: list[str] = []

    for index, url in enumerate(unique_urls, start=1):
        suffix = "" if len(unique_urls) == 1 else f"-{index}"
        filename = f"noto-sans-jp-subset{suffix}.woff2"
        target = FONTS_DIR / filename
        target.write_bytes(fetch(url))
        local_files.append(filename)
        print(f"saved {filename} ({target.stat().st_size // 1024}KB)")

    primary = local_files[0]
    css_lines = [
        '@font-face {',
        '  font-family: "Noto Sans JP";',
        '  font-style: normal;',
        '  font-weight: 400 700;',
        '  font-display: swap;',
        f'  src: url("../assets/fonts/{primary}") format("woff2");',
        '}',
        "",
    ]
    CSS_PATH.write_text("\n".join(css_lines), encoding="utf-8")
    print(f"wrote {CSS_PATH}")


if __name__ == "__main__":
    main()
