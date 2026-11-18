#!/usr/bin/env python3
"""Per-page first-party CSS/JS weight and request counts, from the files on disk.

No browser is involved: the numbers are what a cold load of each shipped page
must fetch and parse before its own scripts run. Three columns per page:

  cssReq/cssBytes   every <link rel="stylesheet"> that resolves inside the repo
                    (inline <style> blocks are counted as bytes, not requests)
  jsReq/jsBytes     every <script src> that resolves inside the repo
                    (<script type="module"> counts, inline scripts count as bytes)
  requests          cssReq + jsReq — the static request count for the page shell;
                    runtime JSON fetches are counted separately by
                    scripts/audit_requests.py

Usage:
    python3 scripts/audit_page_weight.py                 # markdown table
    python3 scripts/audit_page_weight.py --json out.json # machine-readable
    python3 scripts/audit_page_weight.py --compare old.json   # before/after delta
    python3 scripts/audit_page_weight.py --budget            # exit 1 over budget

Budgets (uncompressed, first-party): 340 KB CSS, 350 KB JS per page. They are a
regression fence, not a Core Web Vitals claim.

The CSS fence moved from 300 KB to 340 KB with the Phase 9C unit-notes reading
layer (owner-approved: "not a problem if need exceed 340kb"). That layer lives in
subjects/units-com/common.css and is scoped with body[data-page="unit"] so the
shared sheet's other consumers are untouched. Before the raise the heaviest unit
pages measured 300,013 B against a 307,200 B fence — 13 bytes of headroom — so any
addition there failed the gate regardless of merit. The measured reclaim available
by safe deletion was only ~2 KB of genuinely dead rules; the remaining mass is
comments (12.2 KB), indentation (7.3 KB) and rules that are live on other pages
that share this stylesheet (card-glass, card-neumorphic, .particle). Minifying or
deleting those trades a maintainability loss for bytes that this fence does not
value enough to justify it. Post-raise heaviest page: see the table this script
prints; the fence is checked, not assumed.

The CSS fence previously moved from 250 KB to 300 KB with the Phase 9C design layer
(assets/css/hub.css). That layer is a single shared sheet carrying the site-wide
type scale, colour system and every component state; it added ~118 KB to the
heaviest pages, whose own area sheets (subjects/units-com/common.css is 108 KB)
already sat near the old ceiling. Splitting the layer per page-family was tried
and rejected: hub.css relies on [data-page] qualifiers for specificity over the
area sheets, so any split changes the cascade and regresses rendered colours.
The single-file ceiling in check_site.py (`CSS_BUDGET_SINGLE`) tracks this value,
so the two fences stay consistent rather than drifting apart.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

from site_config import SITE

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", "node_modules", "webflow", ".github", "tests"}
CSS_BUDGET = 340 * 1024
JS_BUDGET = 350 * 1024

LINK = re.compile(r'<link\b[^>]*>', re.I)
SCRIPT = re.compile(r'<script\b[^>]*>', re.I)
ATTR = re.compile(r'(\w[\w:-]*)\s*=\s*"([^"]*)"')


def pages() -> list[Path]:
    out = []
    for path in sorted(ROOT.rglob("*.html")):
        if set(path.relative_to(ROOT).parts) & SKIP_DIRS:
            continue
        out.append(path)
    return out


def local_url(page: Path, raw: str) -> Path | None:
    value = raw.strip()
    if not value or value.startswith(("data:", "mailto:", "tel:", "javascript:", "about:")):
        return None
    parts = urlsplit(value)
    if parts.scheme or parts.netloc:
        from urllib.parse import urlsplit as _urlsplit
        origin = _urlsplit(SITE).netloc
        base = _urlsplit(SITE).path
        if parts.netloc != origin or not parts.path.startswith(base):
            return None
        target = ROOT / parts.path[len(base):]
        return target if target.exists() else None
    if parts.path.startswith("/"):
        # Root-relative is a defect elsewhere; resolve against the project base.
        target = ROOT / parts.path.lstrip("/")
        return target if target.exists() else None
    target = (page.parent / parts.path).resolve()
    return target if target.exists() else None


def inline_bytes(text: str, tag: str) -> int:
    total = 0
    for match in re.finditer(rf"<{tag}\b[^>]*>(.*?)</{tag}>", text, re.I | re.S):
        total += len(match.group(1).encode("utf-8"))
    return total


def measure() -> dict:
    rows = {}
    for page in pages():
        text = page.read_text(encoding="utf-8", errors="replace")
        sheets: dict[str, int] = {}
        scripts: dict[str, int] = {}
        for tag in LINK.findall(text):
            attrs = dict(ATTR.findall(tag))
            if attrs.get("rel", "").lower() != "stylesheet" or "href" not in attrs:
                continue
            target = local_url(page, attrs["href"])
            if target is not None:
                key = target.relative_to(ROOT).as_posix()
                if key not in sheets:
                    sheets[key] = target.stat().st_size
        for tag in SCRIPT.findall(text):
            attrs = dict(ATTR.findall(tag))
            if "src" in attrs:
                target = local_url(page, attrs["src"])
                if target is not None:
                    key = target.relative_to(ROOT).as_posix()
                    if key not in scripts:
                        scripts[key] = target.stat().st_size
        rows[page.relative_to(ROOT).as_posix()] = {
            "cssRequests": len(sheets),
            "cssBytes": sum(sheets.values()),
            "cssFiles": sheets,
            "jsRequests": len(scripts),
            "jsBytes": sum(scripts.values()),
            "jsFiles": scripts,
            "inlineCssBytes": inline_bytes(text, "style"),
            "inlineJsBytes": inline_bytes(text, "script"),
            "requests": len(sheets) + len(scripts),
        }
    totals = {
        "pages": len(rows),
        "cssRequests": sum(r["cssRequests"] for r in rows.values()),
        "cssBytes": sum(r["cssBytes"] for r in rows.values()),
        "jsRequests": sum(r["jsRequests"] for r in rows.values()),
        "jsBytes": sum(r["jsBytes"] for r in rows.values()),
        "requests": sum(r["requests"] for r in rows.values()),
    }
    worst_css = max(rows, key=lambda k: rows[k]["cssBytes"])
    worst_js = max(rows, key=lambda k: rows[k]["jsBytes"])
    return {
        "generatedBy": "scripts/audit_page_weight.py",
        "method": "static file sizes from disk; no browser, no network, no compression",
        "budgets": {"cssBytesPerPage": CSS_BUDGET, "jsBytesPerPage": JS_BUDGET},
        "totals": totals,
        "worst": {
            "css": {"page": worst_css, **{k: rows[worst_css][k] for k in ("cssRequests", "cssBytes")}},
            "js": {"page": worst_js, **{k: rows[worst_js][k] for k in ("jsRequests", "jsBytes")}},
        },
        "pages": rows,
    }


def table(data: dict, compare: dict | None = None) -> str:
    lines = [
        f"pages: {data['totals']['pages']} · static requests: {data['totals']['requests']} "
        f"({data['totals']['cssRequests']} CSS + {data['totals']['jsRequests']} JS)",
        "",
        "| page | CSS req | CSS B | JS req | JS B | inline CSS B | inline JS B |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for name, row in data["pages"].items():
        delta = ""
        if compare and name in compare.get("pages", {}):
            old = compare["pages"][name]
            dcss = row["cssBytes"] - old.get("cssBytes", 0)
            djs = row["jsBytes"] - old.get("jsBytes", 0)
            if dcss:
                delta += f" | {dcss:+d} CSS"
            if djs:
                delta += f" | {djs:+d} JS"
        lines.append(
            f"| `{name}` | {row['cssRequests']} | {row['cssBytes']:,} | {row['jsRequests']} | "
            f"{row['jsBytes']:,} | {row['inlineCssBytes']:,} | {row['inlineJsBytes']:,}{delta} |"
        )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", metavar="PATH", help="write the full report as JSON")
    parser.add_argument("--compare", metavar="PATH", help="JSON baseline to diff against")
    parser.add_argument("--budget", action="store_true", help="exit 1 when a page exceeds budget")
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args()

    data = measure()
    compare = None
    if args.compare:
        compare = json.loads(Path(args.compare).read_text(encoding="utf-8"))
    if args.json:
        Path(args.json).write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    over = []
    for name, row in data["pages"].items():
        if row["cssBytes"] > CSS_BUDGET:
            over.append(f"{name}: CSS {row['cssBytes']:,} B > {CSS_BUDGET:,} B")
        if row["jsBytes"] > JS_BUDGET:
            over.append(f"{name}: JS {row['jsBytes']:,} B > {JS_BUDGET:,} B")
    if not args.quiet:
        print(table(data, compare))
        if compare:
            old, new = compare["totals"], data["totals"]
            print("")
            print(f"total CSS bytes: {old['cssBytes']:,} → {new['cssBytes']:,} "
                  f"({new['cssBytes'] - old['cssBytes']:+,})")
            print(f"total JS bytes:  {old['jsBytes']:,} → {new['jsBytes']:,} "
                  f"({new['jsBytes'] - old['jsBytes']:+,})")
            print(f"per-page requests: {old['requests']} → {new['requests']}")
        print("")
        if over:
            print("OVER BUDGET:")
            for line in over:
                print("  " + line)
        else:
            print(f"budget: every page within {CSS_BUDGET // 1024} KB CSS / "
                  f"{JS_BUDGET // 1024} KB JS (uncompressed, first-party)")
    if over and args.budget:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
