"""Phase 9.5 — the base path lives in one constant and the site survives a move.

`scripts/site_config.py` is the single place that knows the published URL. This
test proves both halves of that claim:

* nothing else hard-codes the host/sub-path (so a change is one edit); and
* the site checker passes on a `/`-rooted copy of the tree, i.e. the internal
  links, manifest and worker scope are genuinely base-path independent.
"""

from __future__ import annotations

import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from site_config import BASE_PATH, SITE, SITE_ORIGIN  # noqa: E402

# Generated outputs carry the absolute URL by design; they are regenerated from
# the constant, never hand-edited.
ALLOWED = {
    "scripts/site_config.py",
    "sitemap.xml",
    "robots.txt",
    # A 404 page can be served at any depth, so its asset URLs must be absolute.
    "404.html",
}
PRESENCE = re.compile(r"<!-- presence:v1 -->.*?<!-- /presence -->", re.S)
TEXT_SUFFIXES = {".py", ".html", ".xml", ".txt", ".js", ".json", ".css"}


class BasePathTests(unittest.TestCase):
    def test_one_constant_defines_the_site(self) -> None:
        self.assertEqual(SITE, SITE_ORIGIN + BASE_PATH)
        self.assertTrue(BASE_PATH.startswith("/") and BASE_PATH.endswith("/"))

    def test_no_other_file_hard_codes_the_site_url(self) -> None:
        offenders = []
        for path in ROOT.rglob("*"):
            rel = path.relative_to(ROOT).as_posix()
            if path.suffix not in TEXT_SUFFIXES or not path.is_file():
                continue
            if set(path.relative_to(ROOT).parts) & {".git", "node_modules", "webflow", "docs", "tests", "_data"}:
                continue
            if rel in ALLOWED:
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            if path.suffix == ".html":
                text = PRESENCE.sub("", text)
            if SITE in text or SITE.rstrip("/") in text:
                offenders.append(rel)
        self.assertEqual(offenders, [], "these files hard-code the published URL; use scripts/site_config.py")

    def test_rewritten_root_copy_passes_the_site_checker(self) -> None:
        result = subprocess.run([sys.executable, str(ROOT / "scripts/check_root_rewrite.py")],
                                capture_output=True, text=True, cwd=ROOT)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("site-check: 0 error(s), 0 warning(s)", result.stdout)


class ManifestAndWorkerScopeTests(unittest.TestCase):
    def test_manifest_stays_relative(self) -> None:
        import json
        manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
        for key in ("id", "start_url", "scope"):
            self.assertEqual(manifest.get(key), "./", f"manifest {key} must be base-path independent")

    def test_worker_derives_its_base(self) -> None:
        sw = (ROOT / "sw.js").read_text(encoding="utf-8")
        self.assertIn("new URL('./', self.location.href)", sw)
        self.assertNotRegex(sw, r"https?://pabitra27706-oss\.github\.io")


if __name__ == "__main__":
    unittest.main()
