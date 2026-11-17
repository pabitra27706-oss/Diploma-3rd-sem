#!/usr/bin/env python3
"""One token file, no stray colour literals, no dangling custom properties.

Phase 9.2 made `assets/css/variables.css` the single source of every colour in
the tree. This check is what keeps it that way:

  1. no first-party stylesheet, inline `style=` attribute or `<style>` block
     contains a `#rgb`/`#rrggbb`/`#rrggbbaa` literal;
  2. the palette entries are defined exactly once, in the one `:root` palette
     block of `variables.css`, and every palette entry is actually referenced;
  3. every `var(--name)` used by first-party CSS or an inline style resolves to
     a definition somewhere in the tree (a typo is a silent broken colour);
  4. every page loads `variables.css` before any other first-party stylesheet,
     so an area sheet that aliases a palette entry can always resolve it.

Allowlist (each entry is a browser requirement, not styling):

  * `assets/vendor/**` — third-party Font Awesome CSS and the vendored source it
    is generated from; its literals are not ours to tokenise.
  * `<meta name="theme-color" content="#…">` — a meta tag cannot take `var()`.
  * `assets/js/theme.js` — writes that same meta tag at runtime; its two values
    must be literals for the same reason. The check counts them and fails if the
    number grows.

Usage:
    python3 scripts/check_tokens.py            # report
    python3 scripts/check_tokens.py --strict   # exit 1 on any finding
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VARIABLES = ROOT / "assets/css/variables.css"
SKIP_DIRS = {".git", "node_modules", "webflow", ".github", "tests"}
SKIP_PREFIXES = ("assets/vendor/",)

HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")
DECL = re.compile(r"(?P<lead>^|[;{])(?P<space>\s*)(?P<prop>[\w-]+)(?P<colon>\s*:\s*)(?P<val>[^;{}]+)(?=[;}])")
PALETTE_DEF = re.compile(r"^\s*(--c-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;", re.M)
VAR_USE = re.compile(r"var\(\s*(--[\w-]+)")
VAR_USE_STRICT = re.compile(r"var\(\s*(--[\w-]+)\s*\)")
CUSTOM_DEF = re.compile(r"(\-\-[\w-]+)\s*:")
STYLE_ATTR = re.compile(r"style\s*=\s*\"([^\"]*)\"")
STYLE_BLOCK = re.compile(r"<style\b[^>]*>(.*?)</style>", re.S | re.I)
THEME_META = re.compile(r'<meta\s+name="theme-color"\s+content="(#[0-9a-fA-F]{3,8})"')
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)
CSS_COMMENT = re.compile(r"/\*.*?\*/", re.S)

THEME_JS_LITERAL_BUDGET = 2  # light + dark meta theme-color values in theme.js


class Findings:
    def __init__(self) -> None:
        self.items: list[str] = []

    def add(self, where: str, message: str) -> None:
        self.items.append(f"{where}: {message}")

    def __len__(self) -> int:
        return len(self.items)


def shipped_css() -> list[Path]:
    out = []
    for path in sorted(ROOT.rglob("*.css")):
        rel = path.relative_to(ROOT).as_posix()
        if set(path.relative_to(ROOT).parts) & SKIP_DIRS or rel.startswith(SKIP_PREFIXES):
            continue
        out.append(path)
    return out


def shipped_pages() -> list[Path]:
    out = []
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if set(path.relative_to(ROOT).parts) & SKIP_DIRS or rel.startswith(SKIP_PREFIXES):
            continue
        out.append(path)
    return out


def declarations(text: str) -> list[re.Match]:
    return list(DECL.finditer(CSS_COMMENT.sub(lambda m: " " * len(m.group(0)), text)))


def palette_entries() -> dict[str, str]:
    return {name: value.lower() for name, value in PALETTE_DEF.findall(VARIABLES.read_text(encoding="utf-8"))}


def _blank(text: str, start: int, end: int) -> str:
    return text[:start] + " " * (end - start) + text[end:]


def check_literals(f: Findings) -> None:
    """No colour literal in first-party CSS, inline styles or <style> blocks."""
    palette_text = VARIABLES.read_text(encoding="utf-8")
    for path in shipped_css():
        rel = path.relative_to(ROOT).as_posix()
        text = CSS_COMMENT.sub(lambda m: " " * len(m.group(0)), path.read_text(encoding="utf-8", errors="replace"))
        if path == VARIABLES:
            # Only the leading palette block may define literals; blank it out.
            start = text.find(":root {")
            depth, i = 0, start
            while i < len(text) and start != -1:
                if text[i] == "{":
                    depth += 1
                elif text[i] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                i += 1
            text = _blank(text, start, i + 1)
        for match in HEX.finditer(text):
            line = text[:match.start()].count("\n") + 1
            f.add(f"{rel}:{line}", f"colour literal {match.group(0)} (use a palette token)")

    for page in shipped_pages():
        rel = page.relative_to(ROOT).as_posix()
        text = page.read_text(encoding="utf-8", errors="replace")
        for match in HTML_COMMENT.finditer(text):
            text = _blank(text, match.start(), match.end())
        allowed: set[int] = set()
        for match in THEME_META.finditer(text):
            allowed.add(match.start(1))
        inline_ranges = [(m.start(1), m.end(1)) for m in STYLE_ATTR.finditer(text)]
        inline_ranges += [(m.start(1), m.end(1)) for m in STYLE_BLOCK.finditer(text)]
        for match in HEX.finditer(text):
            if match.start() in allowed:
                continue
            line = text[:match.start()].count("\n") + 1
            where = "inline style" if any(a <= match.start() < b for a, b in inline_ranges) else "markup"
            f.add(f"{rel}:{line}", f"colour literal {match.group(0)} in {where}")

    theme_js = ROOT / "assets/js/theme.js"
    if theme_js.exists():
        count = len(HEX.findall(CSS_COMMENT.sub("", theme_js.read_text(encoding="utf-8"))))
        if count > THEME_JS_LITERAL_BUDGET:
            f.add("assets/js/theme.js",
                  f"{count} colour literals; the allowlist is the {THEME_JS_LITERAL_BUDGET} "
                  "values written into <meta name=\"theme-color\">")


def check_palette(f: Findings) -> None:
    entries = palette_entries()
    if not entries:
        f.add("assets/css/variables.css", "no palette entries (--c-*: #rrggbb) found")
        return
    text = VARIABLES.read_text(encoding="utf-8")
    for name, value in entries.items():
        duplicates = len(re.findall(rf"(?m)^\s*{re.escape(name)}\s*:", text))
        if duplicates > 1:
            f.add("assets/css/variables.css", f"palette entry {name} defined {duplicates} times")
    referenced: set[str] = set()
    for path in shipped_css():
        referenced |= set(VAR_USE.findall(path.read_text(encoding="utf-8", errors="replace")))
    for page in shipped_pages():
        text = page.read_text(encoding="utf-8", errors="replace")
        for match in STYLE_ATTR.finditer(text):
            referenced |= set(VAR_USE.findall(match.group(1)))
        for match in STYLE_BLOCK.finditer(text):
            referenced |= set(VAR_USE.findall(match.group(1)))
    for path in sorted(ROOT.rglob("*.js")):
        if set(path.relative_to(ROOT).parts) & (SKIP_DIRS - {"tests"}):
            continue
        referenced |= set(VAR_USE.findall(path.read_text(encoding="utf-8", errors="replace")))
    unused = sorted(set(entries) - referenced)
    if unused:
        f.add("assets/css/variables.css", f"{len(unused)} unused palette entries: {', '.join(unused[:10])}"
              + (" …" if len(unused) > 10 else ""))


def check_definitions(f: Findings) -> None:
    defined: dict[str, str] = {}
    for path in sorted(ROOT.rglob("*.css")):
        rel = path.relative_to(ROOT).as_posix()
        if set(path.relative_to(ROOT).parts) & {"node_modules", ".git", "webflow"}:
            continue
        text = CSS_COMMENT.sub(lambda m: " " * len(m.group(0)), path.read_text(encoding="utf-8", errors="replace"))
        for match in re.finditer(r"(\-\-[\w-]+)\s*:", text):
            defined.setdefault(match.group(1), rel)
    used: dict[str, str] = {}
    for path in shipped_css():
        rel = path.relative_to(ROOT).as_posix()
        for match in VAR_USE.finditer(CSS_COMMENT.sub("", path.read_text(encoding="utf-8", errors="replace"))):
            used.setdefault(match.group(1), rel)
    for page in shipped_pages():
        rel = page.relative_to(ROOT).as_posix()
        text = page.read_text(encoding="utf-8", errors="replace")
        for match in STYLE_ATTR.finditer(text):
            for name in VAR_USE.findall(match.group(1)):
                used.setdefault(name, rel)
        for match in STYLE_BLOCK.finditer(text):
            for name in VAR_USE.findall(match.group(1)):
                used.setdefault(name, rel)
    strict: dict[str, str] = {}
    for path in shipped_css():
        for match in VAR_USE_STRICT.finditer(CSS_COMMENT.sub("", path.read_text(encoding="utf-8", errors="replace"))):
            strict.setdefault(match.group(1), path.relative_to(ROOT).as_posix())
    for page in shipped_pages():
        text = page.read_text(encoding="utf-8", errors="replace")
        for match in list(STYLE_ATTR.finditer(text)) + list(STYLE_BLOCK.finditer(text)):
            for name in VAR_USE_STRICT.findall(match.group(1)):
                strict.setdefault(name, page.relative_to(ROOT).as_posix())
    for name, where in sorted(strict.items()):
        if name not in defined:
            f.add(where, f"var({name}) is never defined in the tree")


def check_page_order(f: Findings) -> None:
    base = ("variables.css",)
    for page in shipped_pages():
        rel = page.relative_to(ROOT).as_posix()
        text = page.read_text(encoding="utf-8", errors="replace")
        links = re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', text, re.I)
        links += re.findall(r'<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>', text, re.I)
        first_party = [href for href in links if "assets/vendor/" not in href]
        if not first_party:
            continue
        if not any(href.endswith(base[0]) for href in first_party):
            f.add(rel, "does not load assets/css/variables.css")
            continue
        index = next(i for i, href in enumerate(first_party) if href.endswith(base[0]))
        if index != 0:
            f.add(rel, f"variables.css is stylesheet #{index + 1}; it must be first so "
                       "the palette is defined before an area sheet aliases it")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="exit 1 on any finding")
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args()

    f = Findings()
    check_literals(f)
    check_palette(f)
    check_definitions(f)
    check_page_order(f)

    entries = palette_entries()
    if not args.quiet:
        print(f"palette entries in assets/css/variables.css: {len(entries)}")
        print(f"first-party stylesheets inspected: {len(shipped_css())}; pages: {len(shipped_pages())}")
        print(f"colour literals outside the token file: {sum(1 for item in f.items if 'literal' in item)}")
        print(f"findings: {len(f)}")
        for item in f.items:
            print("  " + item)
    if args.strict and len(f):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
