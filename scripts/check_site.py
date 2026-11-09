#!/usr/bin/env python3
"""Static, dependency-free checks for this site.

Implements the WebFlow no-device gate (webflow/knowledge/quality-without-a-device.md §1):
links and assets resolve, JSON parses, ids are unique, HTML has the structure
and accessibility basics, the icon sprite resolves, and payload budgets are
reported.

Only the standard library is used, so it runs on a phone or in CI with no
install step.

Usage:
    python3 scripts/check_site.py                 # report, exit 0 unless --strict
    python3 scripts/check_site.py --strict        # exit 1 on any ERROR
    python3 scripts/check_site.py --report out.txt
    python3 scripts/check_site.py --quiet

Severities:
    ERROR  the site is broken for real users (unresolvable file, bad JSON,
           duplicate id, missing sprite symbol)
    WARN   a defect or debt that must be counted and paid down (root-relative
           path, missing landmark/label/description, empty file, budget)

The current tree is expected to carry WARN debt; phase records must report the
number and the trend. Flip CI to --strict when the debt reaches zero.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

SKIP_DIRS = {".git", "node_modules", "webflow", ".github"}
EXTERNAL = ("http://", "https://", "//", "mailto:", "tel:", "data:", "javascript:", "about:")

# Bytes (uncompressed) before a file is called out.
JS_BUDGET_SINGLE = 300 * 1024
CSS_BUDGET_SINGLE = 300 * 1024
DATA_BUDGET_SINGLE = 1024 * 1024

ROOT = Path(__file__).resolve().parent.parent


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warns: list[str] = []

    def error(self, where: str, msg: str) -> None:
        self.errors.append(f"{where}: {msg}")

    def warn(self, where: str, msg: str) -> None:
        self.warns.append(f"{where}: {msg}")


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def walk(suffixes: tuple[str, ...]) -> list[Path]:
    out: list[Path] = []
    for root, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in files:
            if name.endswith(suffixes):
                out.append(Path(root) / name)
    return sorted(out)


class Page(HTMLParser):
    """Collects the structure facts the checks need."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.refs: list[tuple[str, str]] = []  # (attr, value)
        self.has_lang = False
        self.title = ""
        self.description = ""
        self.main_count = 0
        self.h1_count = 0
        self.img_missing_alt: list[str] = []
        self.inputs_missing_label: list[str] = []
        self.blank_targets: list[str] = []
        self.skip_link = False
        self._in_title = False
        self._in_main = 0
        self._labels_for: set[str] = set()
        self._aria_labelled: set[str] = set()
        self._field_ids: set[str] = set()
        self._wrapped_controls = 0
        self._label_depth = 0
        self._controls_seen = 0

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {k: (v or "") for k, v in attrs_list}
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "html" and attrs.get("lang"):
            self.has_lang = True
        if tag == "title":
            self._in_title = True
        if tag == "meta" and attrs.get("name", "").lower() == "description":
            self.description = attrs.get("content", "").strip()
        if tag == "main":
            self.main_count += 1
            self._in_main += 1
        if tag == "h1":
            self.h1_count += 1
        if tag == "img" and "alt" not in attrs:
            self.img_missing_alt.append(attrs.get("src", "?"))
        if tag == "label":
            self._label_depth += 1
            if attrs.get("for"):
                self._labels_for.add(attrs["for"])
        if tag in {"input", "select", "textarea"}:
            if attrs.get("type", "").lower() in {"hidden", "submit", "button", "reset"}:
                return
            self._controls_seen += 1
            if self._label_depth:
                self._wrapped_controls += 1
            if attrs.get("id"):
                self._field_ids.add(attrs["id"])
            if attrs.get("aria-label") or attrs.get("aria-labelledby"):
                self._aria_labelled.add(attrs.get("id") or f"anon{self._controls_seen}")
        if tag == "a":
            if "skip" in attrs.get("class", "") or attrs.get("href", "").startswith("#main"):
                self.skip_link = True
            if attrs.get("target") == "_blank":
                rel_val = attrs.get("rel", "").lower()
                if "noopener" not in rel_val:
                    self.blank_targets.append(attrs.get("href", "?"))
            if attrs.get("href"):
                self.refs.append(("href", attrs["href"]))
        if tag in {"script", "img", "source", "link", "iframe", "video", "audio", "embed"}:
            for attr in ("src", "href", "poster"):
                if attrs.get(attr):
                    self.refs.append((attr, attrs[attr]))
        if tag == "use":
            for attr in ("href", "xlink:href"):
                if attrs.get(attr):
                    self.refs.append((attr, attrs[attr]))
        if attrs.get("style"):
            for hit in re.findall(r"url\(([^)]+)\)", attrs["style"]):
                self.refs.append(("style-url", hit.strip("'\" ")))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag == "main" and self._in_main:
            self._in_main -= 1
        if tag == "label" and self._label_depth:
            self._label_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data


def local_target(value: str) -> str | None:
    """Return the on-disk portion of a local reference, or None if external."""
    value = value.strip()
    if not value or value.startswith("#"):
        return None
    if value.lower().startswith(EXTERNAL):
        return None
    if value.startswith("/"):
        # Root-relative: still resolvable from the repo root when the base is /.
        return unquote(urlsplit(value).path.lstrip("/"))
    return unquote(urlsplit(value).path)


def resolve(base_dir: Path, target: str) -> Path | None:
    if target is None:
        return None
    candidate = (base_dir / target).resolve()
    try:
        candidate.relative_to(ROOT)
    except ValueError:
        return candidate  # outside the repo: reported by the caller
    # Case-exact existence check (Linux runners are case-sensitive).
    if candidate.exists():
        return candidate
    parent = candidate.parent
    if parent.is_dir() and candidate.name not in {p.name for p in parent.iterdir()}:
        return candidate  # exists=False but keep for the message
    return candidate


def check_json(report: Report) -> None:
    for path in walk((".json",)):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001 - report anything
            report.error(rel(path), f"invalid JSON: {exc}")
            continue
        if isinstance(data, list):
            ids = [o.get("id") for o in data if isinstance(o, dict) and o.get("id")]
            dupes = [i for i, n in Counter(ids).items() if n > 1]
            if dupes:
                report.error(rel(path), f"{len(dupes)} duplicate id(s): {dupes[:5]}")


def check_html(report: Report, sprite_symbols: set[str]) -> None:
    html_files = walk((".html",))
    for path in html_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        page = Page()
        try:
            page.feed(text)
        except Exception as exc:  # noqa: BLE001
            report.error(rel(path), f"unparseable HTML: {exc}")
            continue

        where = rel(path)
        if not page.has_lang:
            report.warn(where, "missing <html lang>")
        if not page.title.strip():
            report.warn(where, "missing or empty <title>")
        if not page.description:
            report.warn(where, "missing meta description")
        if page.main_count == 0:
            report.warn(where, "no <main> landmark")
        if page.main_count > 1:
            report.error(where, f"{page.main_count} <main> landmarks")
        if page.h1_count == 0:
            report.warn(where, "no <h1>")
        if page.h1_count > 1:
            report.warn(where, f"{page.h1_count} <h1> elements")
        if not page.skip_link:
            report.warn(where, "no skip link")
        if page.img_missing_alt:
            report.warn(where, f"{len(page.img_missing_alt)} <img> without alt")

        dupes = [i for i, n in Counter(page.ids).items() if n > 1]
        if dupes:
            report.error(where, f"duplicate id(s): {dupes[:5]}")

        unlabelled = page._field_ids - page._labels_for - page._aria_labelled
        if unlabelled:
            report.warn(where, f"{len(unlabelled)} control(s) without a label: {sorted(unlabelled)[:4]}")

        for href in page.blank_targets:
            report.warn(where, f'target="_blank" without rel=noopener: {href}')

        for attr, value in page.refs:
            root_relative = value.startswith("/") and not value.startswith("//")
            if root_relative:
                report.error(where, f"root-relative {attr} in `{value}` (breaks project-Pages subpath)")
            target = local_target(value)
            if target is None:
                continue
            if value.startswith("#") and value[1:] in sprite_symbols:
                continue
            resolved = resolve(ROOT if root_relative else path.parent, target)
            if resolved is None:
                continue
            if resolved.suffix == ".html" and not resolved.exists() and value.startswith("#"):
                continue
            if not resolved.exists():
                report.error(where, f"unresolved {attr}: `{value}`")
                continue
            try:
                resolved.relative_to(ROOT)
            except ValueError:
                report.warn(where, f"{attr} escapes the repository: `{value}`")
            if resolved.suffix == ".svg" and "#" in value:
                symbol = value.split("#", 1)[1]
                if symbol not in sprite_symbols:
                    report.error(where, f"sprite symbol `#{symbol}` does not exist in {rel(resolved)}")


def check_css(report: Report) -> None:
    for path in walk((".css",)):
        text = path.read_text(encoding="utf-8", errors="replace")
        if text.count("{") != text.count("}"):
            report.error(rel(path), f"unbalanced braces ({text.count('{')} open, {text.count('}')} close)")
        for hit in re.findall(r"url\(\s*([^)]+?)\s*\)", text):
            value = hit.strip("'\" ")
            if value.lower().startswith(EXTERNAL) or value.startswith("data:"):
                continue
            target = local_target(value)
            if target is None:
                continue
            resolved = resolve(path.parent, target)
            if resolved is not None and not resolved.exists():
                report.error(rel(path), f"unresolved url(): `{value}`")


def check_js_sizes(report: Report) -> None:
    for path in walk((".js",)):
        size = path.stat().st_size
        if path.name == "sw.js":
            continue
        if size > JS_BUDGET_SINGLE:
            report.warn(rel(path), f"{size // 1024} KB exceeds the {JS_BUDGET_SINGLE // 1024} KB per-file budget")


def check_css_sizes(report: Report) -> None:
    for path in walk((".css",)):
        size = path.stat().st_size
        if size > CSS_BUDGET_SINGLE:
            report.warn(rel(path), f"{size // 1024} KB exceeds the {CSS_BUDGET_SINGLE // 1024} KB per-file budget")


def check_data_sizes(report: Report) -> None:
    for path in walk((".json",)):
        if "_data" not in path.parts and "_quiz-data" not in path.parts:
            continue
        size = path.stat().st_size
        if size > DATA_BUDGET_SINGLE:
            report.warn(rel(path), f"{size // 1024} KB exceeds the {DATA_BUDGET_SINGLE // 1024} KB data budget")


def check_empty(report: Report) -> None:
    for path in walk((".js", ".css", ".json", ".html", ".png", ".svg", ".jpg", ".webp", ".ico", "")):
        try:
            if path.is_file() and path.stat().st_size == 0:
                report.warn(rel(path), "empty file (0 bytes)")
        except OSError:
            continue


def sprite_symbols() -> set[str]:
    sprite = ROOT / "assets" / "icons" / "sprite.svg"
    if not sprite.exists():
        return set()
    text = sprite.read_text(encoding="utf-8", errors="replace")
    return set(re.findall(r'<symbol[^>]*id="([^"]+)"', text))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true", help="exit 1 on any ERROR")
    parser.add_argument("--report", metavar="PATH", help="also write the report to PATH")
    parser.add_argument("--quiet", action="store_true", help="summary only")
    args = parser.parse_args()

    report = Report()
    symbols = sprite_symbols()
    check_json(report)
    check_html(report, symbols)
    check_css(report)
    check_js_sizes(report)
    check_css_sizes(report)
    check_data_sizes(report)
    check_empty(report)

    errors = sorted(set(report.errors))
    warns = sorted(set(report.warns))

    lines = [
        f"site-check: {len(errors)} error(s), {len(warns)} warning(s)",
        f"scanned from {ROOT}",
        "",
        "ERRORS (broken for users)",
        "-----------------------",
    ]
    lines += [f"  {e}" for e in errors] or ["  none"]
    lines += ["", "WARNINGS (debt to count and pay down)", "------------------------------------"]
    lines += [f"  {w}" for w in warns] or ["  none"]

    output = "\n".join(lines)
    if not args.quiet:
        print(output)
    else:
        print(lines[0])

    if args.report:
        Path(args.report).write_text(output + "\n", encoding="utf-8")

    if args.strict and errors:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
