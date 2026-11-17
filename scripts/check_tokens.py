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
  4. existing rgba() expressions outside token definitions match a locked
     per-file inventory; new/changed occurrences fail strict mode;
  5. every page loads `variables.css` before any other first-party stylesheet,
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
from collections import Counter
import json
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


# The Phase 9B transition is an exact, reviewable legacy inventory, not a
# claim that existing alpha colours are tokenised. Removing/migrating an entry
# requires shrinking the baseline in the same change; new/changed occurrences
# fail closed. Scan source text conservatively (including JS comments/strings),
# so this also catches CSS constructed in JavaScript or HTML templates.
RGBA_START = re.compile(r"(?<![\w-])rgba\s*\(", re.I)
CUSTOM_PROPERTY_START = re.compile(r"(?:(?<=\{)|(?<=;))\s*--[\w-]+\s*:")
RGBA_BASELINE = Path("docs/phases/09B-ui-reboost/rgba-baseline.json")


def rgba_expressions(text: str):
    """Yield (start, end, expression, balanced), tracking nested functions."""
    offset = 0
    while match := RGBA_START.search(text, offset):
        depth, i = 1, match.end()
        while i < len(text) and depth:
            if text[i] == "(":
                depth += 1
            elif text[i] == ")":
                depth -= 1
            i += 1
        if depth:
            yield match.start(), match.end(), match.group(), False
            offset = match.end()
        else:
            yield match.start(), i, text[match.start():i], True
            offset = i


def token_value_ranges(text: str):
    """Find custom-property value ranges in the token sheet, excluding comments."""
    for match in CUSTOM_PROPERTY_START.finditer(text):
        depth, i = 0, match.end()
        while i < len(text):
            if text[i] == "(":
                depth += 1
            elif text[i] == ")":
                depth -= 1
            elif depth == 0 and text[i] in ";}":
                break
            i += 1
        yield match.end(), i


def rgba_inventory():
    """Legacy rgba source occurrences by file and exact expression.

    CSS, HTML and JS are all scanned, including inline HTML/JS templates and
    generated JS. Vendor and non-shipped test/playbook directories are excluded.
    CSS/HTML comments are ignored. JS is intentionally conservative, including
    comments, so no JavaScript parser is needed in the zero-build toolchain.
    """
    paths = shipped_css() + shipped_pages()
    for path in ROOT.rglob("*.js"):
        rel = path.relative_to(ROOT)
        if set(rel.parts) & SKIP_DIRS or rel.as_posix().startswith(SKIP_PREFIXES):
            continue
        paths.append(path)
    result = {}
    malformed = []
    for path in sorted(set(paths)):
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8", errors="replace")
        if path.suffix == ".css":
            text = CSS_COMMENT.sub(lambda m: " " * len(m.group()), text)
        elif path.suffix == ".html":
            text = HTML_COMMENT.sub(lambda m: " " * len(m.group()), text)
        allowed = list(token_value_ranges(text)) if path == VARIABLES else []
        counts = Counter()
        for start, end, expression, balanced in rgba_expressions(text):
            if not balanced:
                malformed.append(f"{rel}:{text[:start].count(chr(10)) + 1}")
            elif not any(a <= start and end <= b for a, b in allowed):
                counts[expression] += 1
        if counts:
            result[rel] = dict(sorted(counts.items()))
    return result, malformed


def check_rgba(f: Findings) -> None:
    """Enforce the exact legacy ledger while permitting alpha token definitions."""
    try:
        data = json.loads((ROOT / RGBA_BASELINE).read_text(encoding="utf-8"))
        if not isinstance(data, dict) or set(data) != {"version", "occurrences"} or data["version"] != 1:
            raise ValueError("invalid baseline version or fields")
        expected = data["occurrences"]
        if not isinstance(expected, dict):
            raise ValueError("occurrences must be an object")
        for path, entries in expected.items():
            parts = Path(path).parts
            if not path or Path(path).is_absolute() or ".." in parts or not isinstance(entries, dict) or not entries:
                raise ValueError("invalid path or occurrence map")
            for expression, count in entries.items():
                parsed = list(rgba_expressions(expression))
                if (not isinstance(count, int) or isinstance(count, bool) or count < 1 or
                    len(parsed) != 1 or parsed[0][:2] != (0, len(expression)) or not parsed[0][3]):
                    raise ValueError("invalid expression or occurrence count")
    except (OSError, ValueError, TypeError, json.JSONDecodeError) as error:
        f.add(str(RGBA_BASELINE), f"invalid or missing rgba baseline: {error}")
        return

    actual, malformed = rgba_inventory()
    for where in malformed:
        f.add(where, "unbalanced rgba expression")
    for path in sorted(set(expected) | set(actual)):
        for expression in sorted(set(expected.get(path, {})) | set(actual.get(path, {}))):
            before = expected.get(path, {}).get(expression, 0)
            now = actual.get(path, {}).get(expression, 0)
            if before != now:
                f.add(path, f"rgba literal {expression}: baseline {before}, found {now}; "
                      "tokenise in variables.css and ratchet the reviewed baseline")


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
    check_rgba(f)
    check_palette(f)
    check_definitions(f)
    check_page_order(f)

    entries = palette_entries()
    if not args.quiet:
        print(f"palette entries in assets/css/variables.css: {len(entries)}")
        print(f"first-party stylesheets inspected: {len(shipped_css())}; pages: {len(shipped_pages())}")
        print(f"colour literals outside the token file: {sum(1 for item in f.items if 'literal' in item)}")
        actual, _ = rgba_inventory()
        print(f"legacy rgba occurrences outside token definitions: {sum(sum(v.values()) for v in actual.values())} (ratcheted baseline)")
        print(f"findings: {len(f)}")
        for item in f.items:
            print("  " + item)
    if args.strict and len(f):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
