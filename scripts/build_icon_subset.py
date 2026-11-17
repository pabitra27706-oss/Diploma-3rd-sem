#!/usr/bin/env python3
"""Ship only the Font Awesome CSS rules this site actually uses.

The vendored `all.min.css` (102,641 B) defines ~1,900 rules for the whole Free
icon set. The tree uses a few hundred class names. This script keeps

  * the license banner (the CSS is MIT; the banner must stay),
  * every rule that is not an icon `content` declaration — the base `.fa`/`.fas`
    rules, sizing, list, rotation, animation and stacking utilities,
  * the `@font-face` rules for families this site renders (they keep pointing at
    the unmodified vendored webfonts — the fonts are NOT subset here, see
    docs/DECISIONS.md, because SIL OFL reserved-name rules would force a rename),
  * one `content:"\\fxxx"` rule per icon class the tree actually names,

and writes `assets/vendor/fontawesome/css/used.min.css`.

Deterministic: input files + the set of used class names fully determine the
bytes. `tests/test_icon_subset.py` fails when a page or script names an icon
that the subset does not carry, i.e. when the generated file is stale.

Usage:
    python3 scripts/build_icon_subset.py                 # rewrite the subset
    python3 scripts/build_icon_subset.py --check         # exit 1 when stale
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENDOR = ROOT / "assets/vendor/fontawesome"
SOURCE_CSS = VENDOR / "css/all.min.css"
OUTPUT_CSS = VENDOR / "css/used.min.css"
MANIFEST = VENDOR / "used-icons.json"
SKIP_DIRS = {".git", "node_modules", "webflow", ".github", "tests", "assets/vendor"}

# Classes that select a style/family or a utility, never an icon codepoint.
STYLE_CLASSES = {
    "fa", "fas", "far", "fab", "fal", "fat", "fad", "fass", "fasr", "fasl",
    "fa-solid", "fa-regular", "fa-brands", "fa-light", "fa-thin", "fa-duotone",
    "fa-sharp", "fa-classic",
}

ICON_RULE = re.compile(r'content:"\\([0-9a-fA-F]+)"')


def used_classes() -> dict[str, int]:
    """Every `fa-…` class name the shipped HTML/JS names, with a use count."""
    counts: dict[str, int] = {}
    for path in ROOT.rglob("*"):
        if path.suffix not in (".html", ".js") or set(path.relative_to(ROOT).parts) & SKIP_DIRS:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for name in re.findall(r"\bfa-[a-z0-9-]+\b", text):
            counts[name] = counts.get(name, 0) + 1
    return counts


def split_rules(text: str) -> list[str]:
    """Split a minified flat stylesheet into rule strings (media blocks kept whole)."""
    rules, i = [], 0
    while i < len(text):
        open_brace = text.find("{", i)
        if open_brace == -1:
            break
        prelude = text[i:open_brace]
        if prelude.lstrip().startswith("@media"):
            depth, j = 0, open_brace
            while j < len(text):
                if text[j] == "{":
                    depth += 1
                elif text[j] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            rules.append(text[i:j + 1])
            i = j + 1
            continue
        close = text.find("}", open_brace)
        rules.append(text[i:close + 1])
        i = close + 1
    return rules


def filter_icon_rule(rule: str, keep: set[str]) -> str | None:
    """Keep only the selectors whose icon class is in `keep`."""
    open_brace = rule.index("{")
    selectors = rule[:open_brace].split(",")
    kept = []
    for selector in selectors:
        classes = re.findall(r"\.(fa-[a-z0-9-]+)", selector)
        if any(name in keep for name in classes):
            kept.append(selector)
    if not kept:
        return None
    return ",".join(kept) + rule[open_brace:]


def build() -> tuple[str, dict]:
    source = SOURCE_CSS.read_text(encoding="utf-8")
    banner_match = re.match(r"/\*!.*?\*/", source, re.S)
    banner = banner_match.group(0) if banner_match else ""
    body = source[len(banner):]

    used = used_classes()
    icon_map: dict[str, str] = {}
    for rule in split_rules(body):
        if ICON_RULE.search(rule):
            for name in re.findall(r"\.(fa-[a-z0-9-]+)", rule[:rule.index("{")]):
                icon_map.setdefault(name, ICON_RULE.search(rule).group(1).lower())

    known = {name for name in used if name in icon_map}
    unknown = sorted(name for name in used if name not in icon_map and name not in STYLE_CLASSES)

    out: list[str] = []
    families: list[str] = []
    for rule in split_rules(body):
        if rule.startswith("@media"):
            inner_open = rule.index("{")
            inner = rule[inner_open + 1:rule.rindex("}")]
            kept_inner = []
            for inner_rule in split_rules(inner):
                if ICON_RULE.search(inner_rule):
                    filtered = filter_icon_rule(inner_rule, known)
                    if filtered:
                        kept_inner.append(filtered)
                else:
                    kept_inner.append(inner_rule)
            if kept_inner:
                out.append(rule[:inner_open + 1] + "".join(kept_inner) + "}")
            continue
        if "@font-face" in rule:
            # Only the families this site sets: Free (solid) and Brands.
            if '"Font Awesome 6 Brands"' in rule or ('"Font Awesome 6 Free"' in rule and "font-weight:900" in rule):
                families.append(rule)
            continue
        if ICON_RULE.search(rule):
            filtered = filter_icon_rule(rule, known)
            if filtered:
                out.append(filtered)
            continue
        out.append(rule)

    header = (
        banner
        + "\n/* Generated by scripts/build_icon_subset.py from all.min.css — "
          "edit the generator or the icon usage, never this file.\n"
        + "   Contains the utility rules plus the "
        + str(len(known))
        + " icon rules this site names; the webfonts are the unmodified vendored ones.\n"
        + "   Icon classes: "
        + ", ".join(sorted(known))
        + "\n   Source sha256: "
        + hashlib.sha256(source.encode("utf-8")).hexdigest()
        + " */\n"
    )
    css = header + "".join(families) + "".join(out)
    manifest = {
        "generatedBy": "scripts/build_icon_subset.py",
        "sourceCss": SOURCE_CSS.relative_to(ROOT).as_posix(),
        "sourceSha256": hashlib.sha256(source.encode("utf-8")).hexdigest(),
        "outputCss": OUTPUT_CSS.relative_to(ROOT).as_posix(),
        "outputBytes": len(css.encode("utf-8")),
        "sourceBytes": len(source.encode("utf-8")),
        "ruleCount": len(split_rules(css[len(header):])),
        "sourceRuleCount": len(split_rules(body)),
        "icons": {name: icon_map[name] for name in sorted(known)},
        "utilityClasses": sorted(set(used) & STYLE_CLASSES),
        "unmatchedClasses": unknown,
        "fontsKept": sorted(re.findall(r'font-family:"([^"]+)"', "".join(families))),
    }
    return css, manifest


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="exit 1 when the committed subset is stale")
    args = parser.parse_args()
    css, manifest = build()
    payload = json.dumps(manifest, indent=2, sort_keys=True) + "\n"
    if args.check:
        stale = []
        if not OUTPUT_CSS.exists() or OUTPUT_CSS.read_text(encoding="utf-8") != css:
            stale.append(str(OUTPUT_CSS.relative_to(ROOT)))
        if not MANIFEST.exists() or MANIFEST.read_text(encoding="utf-8") != payload:
            stale.append(str(MANIFEST.relative_to(ROOT)))
        if stale:
            print("stale generated icon files: " + ", ".join(stale))
            print("run: python3 scripts/build_icon_subset.py")
            return 1
        print(f"icon subset current: {manifest['outputBytes']:,} B, {len(manifest['icons'])} icons")
        return 0
    OUTPUT_CSS.write_text(css, encoding="utf-8")
    MANIFEST.write_text(payload, encoding="utf-8")
    print(f"wrote {OUTPUT_CSS.relative_to(ROOT)}: {manifest['outputBytes']:,} B "
          f"(from {manifest['sourceBytes']:,} B), {len(manifest['icons'])} icons, "
          f"{manifest['ruleCount']} rules")
    if manifest["unmatchedClasses"]:
        print("note: named classes with no icon rule (kept out): " + ", ".join(manifest["unmatchedClasses"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
