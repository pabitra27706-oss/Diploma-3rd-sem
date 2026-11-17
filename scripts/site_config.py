#!/usr/bin/env python3
"""The one place that knows where the site is published.

Everything a base-path change touches is derived from here:

    SITE_ORIGIN  the host (a custom domain is a different value)
    BASE_PATH    the sub-path the site is served from (`/` for a root deploy)
    SITE         their concatenation, with a trailing slash

Pages themselves stay base-agnostic: every internal `href`/`src` is relative, the
manifest uses `./`, and the worker derives its scope from `self.location`. So a
base-path change is this file plus a regeneration of presence metadata, the
sitemap and robots.txt — `scripts/check_root_rewrite.py` proves that by running
the site checker on a `/`-rooted copy.

Nothing here buys, registers or configures a domain (that is an owner gate).
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SITE_ORIGIN = "https://pabitra27706-oss.github.io"
BASE_PATH = "/Diploma-3rd-sem/"
SITE = SITE_ORIGIN + BASE_PATH

# The one image social previews point at, relative to the site root.
SOCIAL_IMAGE = "docs/phases/01-platform/screenshots/after-home.png"


def url_for(relative_path: str) -> str:
    """Absolute URL for a path inside the site."""
    return SITE + relative_path.lstrip("/")


def relative_to_root(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def rewrite_for_base(text: str, base_path: str = "/", origin: str = SITE_ORIGIN) -> str:
    """Rewrite absolute site URLs to another base path (used by the / proof)."""
    target = origin.rstrip("/") + "/" + base_path.strip("/")
    if not target.endswith("/"):
        target += "/"
    return text.replace(SITE, target)


if __name__ == "__main__":
    print(f"site: {SITE}")
    print(f"origin: {SITE_ORIGIN}")
    print(f"base path: {BASE_PATH}")
