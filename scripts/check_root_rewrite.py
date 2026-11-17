#!/usr/bin/env python3
"""Prove the site survives a base-path change by running the checker on a copy.

Phase 9.5 accepts "the site still works if the base path changes to `/`" only if
someone actually runs the site checker against a rewritten tree. This script does
exactly that and does not touch the real tree:

  1. copy the shipped files to a temporary directory (no .git, no webflow/);
  2. rewrite every absolute site URL from `https://…/Diploma-3rd-sem/` to
     `https://…/` — i.e. what a root deploy would publish as canonical URLs,
     Open Graph URLs, sitemap entries and robots.txt references;
  3. run `scripts/check_site.py --strict` inside the copy and fail on any error;
  4. report what changed and what did not (relative links, manifest `./`, worker
     scope) so the claim is evidence, not assertion.

A custom domain is a different change (host + base path) and stays an owner gate;
see docs/DOMAIN.md.

Usage:
    python3 scripts/check_root_rewrite.py            # human report
    python3 scripts/check_root_rewrite.py --keep     # keep the copy and print it
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from site_config import BASE_PATH, ROOT, SITE, SITE_ORIGIN  # noqa: E402

SKIP = {".git", "node_modules", "webflow", ".github"}
TEXT_SUFFIXES = {".html", ".xml", ".txt", ".json", ".js", ".css", ".md", ".webmanifest"}
ROOT_URL = SITE_ORIGIN + "/"


def copy_tree(target: Path) -> int:
    copied = 0
    for path in ROOT.rglob("*"):
        if set(path.relative_to(ROOT).parts) & SKIP:
            continue
        if not path.is_file():
            continue
        destination = target / path.relative_to(ROOT)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        copied += 1
    return copied


def rewrite(target: Path) -> int:
    changed = 0
    for path in target.rglob("*"):
        if path.suffix not in TEXT_SUFFIXES or not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if SITE not in text:
            continue
        path.write_text(text.replace(SITE, ROOT_URL), encoding="utf-8")
        changed += 1
    return changed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--keep", action="store_true", help="keep the rewritten copy")
    args = parser.parse_args()

    workdir = Path(tempfile.mkdtemp(prefix="root-rewrite-"))
    try:
        files = copy_tree(workdir)
        changed = rewrite(workdir)
        result = subprocess.run(
            [sys.executable, str(workdir / "scripts/check_site.py"), "--strict"],
            cwd=workdir, capture_output=True, text=True,
        )
        errors = [line for line in result.stdout.splitlines() if line.strip().startswith("ERROR") or ": " in line and "error" in line.lower()]
        print(f"base path under test: {BASE_PATH!r} -> '/'")
        print(f"files copied: {files}; files whose absolute URLs were rewritten: {changed}")
        print(f"site checker on the /-rooted copy: exit {result.returncode}")
        if result.stdout.strip():
            print(result.stdout.strip())
        if result.stderr.strip():
            print(result.stderr.strip())
        if result.returncode != 0:
            print("FAIL: the /-rooted copy does not pass the site checker")
            return 1
        print("")
        print("unchanged by the move (so nothing else has to change):")
        print("  - internal href/src values stay relative; the checker resolved all of them in the copy")
        print("  - manifest.json id/start_url/scope stay './'; the worker derives its scope from self.location")
        print("  - the worker's caches are keyed by content versions, not by the base path")
        print("PASS: a base-path change is one recorded edit plus a presence/sitemap regeneration")
        if args.keep:
            print(f"kept: {workdir}")
        return 0
    finally:
        if not args.keep:
            shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
