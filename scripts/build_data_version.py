#!/usr/bin/env python3
"""Give the data payload its own version, independent of the service-worker shell.

The shell version in `sw.js` names the shell cache: it changes when HTML, CSS or
JS changes, and a returning student sees the "New version available" prompt.
Data is different. A corrected explanation or a regenerated pool must reach a
returning device without a shell update, a prompt or a storage reset.

So the worker asks *this* generated file for the data version and keys every
data cache entry with it:

    assets/data/data-version.json   {"dataVersion": "data-<12 hex>", ...}

The version hashes the bytes of every file the worker classifies as data
(`_data/`, `_quiz-data/`, `assets/data/`, `assets/search/`, `assets/cards/`).
Re-running this builder on an unchanged tree produces identical bytes;
`tests/test_data_version.py` fails when the committed file is stale, and
`tests/data-version.cjs` proves the runtime behaviour without a browser.

Usage:
    python3 scripts/build_data_version.py           # rewrite the generated file
    python3 scripts/build_data_version.py --check    # exit 1 when stale
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets/data/data-version.json"
DATA_DIRS = ("_data", "_quiz-data", "assets/data", "assets/search", "assets/cards")
SKIP_NAMES = {OUTPUT.name}


def data_files() -> list[Path]:
    files: list[Path] = []
    for folder in DATA_DIRS:
        base = ROOT / folder
        if not base.exists():
            continue
        for path in sorted(base.rglob("*")):
            if path.is_file() and path.name not in SKIP_NAMES:
                files.append(path)
    return files


def build() -> dict:
    digests = []
    for path in data_files():
        rel = path.relative_to(ROOT).as_posix()
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        digests.append((rel, digest))
    payload = "\n".join(f"{rel}\0{digest}" for rel, digest in digests).encode("utf-8")
    combined = hashlib.sha256(payload).hexdigest()
    return {
        "dataVersion": "data-" + combined[:12],
        "generatedBy": "scripts/build_data_version.py",
        "fileCount": len(digests),
        "filesDigest": combined,
        "parts": ["_data/", "_quiz-data/", "assets/data/", "assets/search/", "assets/cards/"],
        "note": (
            "Independent of the shell version in sw.js: a data-only change bumps "
            "dataVersion and leaves every cached shell asset alone."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="exit 1 when the committed version is stale")
    args = parser.parse_args()
    manifest = build()
    text = json.dumps(manifest, indent=2, sort_keys=True) + "\n"
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != text:
            print(f"stale data version file: {OUTPUT.relative_to(ROOT)} "
                  f"(expected {manifest['dataVersion']})")
            print("run: python3 scripts/build_data_version.py")
            return 1
        print(f"data version current: {manifest['dataVersion']} over {manifest['fileCount']} files")
        return 0
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUTPUT.relative_to(ROOT)}: {manifest['dataVersion']} "
          f"over {manifest['fileCount']} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
