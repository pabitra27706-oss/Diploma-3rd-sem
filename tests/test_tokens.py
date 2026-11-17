"""Phase 9.2 — one token file, no stray literals, no dangling custom properties.

These tests guard the *checker*, not only the tree: each rule is exercised on a
temporary copy so a future refactor of `scripts/check_tokens.py` cannot pass by
accident.
"""

from __future__ import annotations

import importlib.util
import re
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_checker():
    spec = importlib.util.spec_from_file_location("check_tokens", ROOT / "scripts/check_tokens.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class TokenTreeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.checker = load_checker()

    def test_tree_has_no_findings(self) -> None:
        findings = self.checker.Findings()
        self.checker.check_literals(findings)
        self.checker.check_palette(findings)
        self.checker.check_definitions(findings)
        self.checker.check_page_order(findings)
        self.assertEqual(findings.items, [], "colour-token gate is not clean")

    def test_palette_has_one_entry_per_colour(self) -> None:
        palette = self.checker.palette_entries()
        self.assertGreater(len(palette), 250, "palette unexpectedly small")
        self.assertEqual(len(set(palette.values())), len(palette),
                         "two palette entries define the same colour; one is redundant")
        for name, value in palette.items():
            self.assertRegex(name, r"^--c-[a-z0-9-]+$")
            self.assertRegex(value, r"^#[0-9a-f]{3,8}$")

    def test_every_page_loads_variables_first(self) -> None:
        pages = self.checker.shipped_pages()
        self.assertGreaterEqual(len(pages), 70)
        for page in pages:
            text = page.read_text(encoding="utf-8")
            links = re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"', text)
            links += re.findall(r'<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"', text)
            first_party = [href for href in links if "assets/vendor/" not in href]
            if not first_party:
                continue
            self.assertTrue(first_party[0].endswith("assets/css/variables.css"),
                            f"{page.relative_to(ROOT)} loads {first_party[0]} before the token file")


class CheckerCatchesRegressions(unittest.TestCase):
    """A temp tree exercises each rule; the real tree is never modified."""

    def setUp(self) -> None:
        self.checker = load_checker()
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "assets/css").mkdir(parents=True)
        (self.root / "assets/css/variables.css").write_text(
            ":root {\n  --c-white: #ffffff;\n}\n", encoding="utf-8")
        (self.root / "page.html").write_text(
            '<html><head><link rel="stylesheet" href="assets/css/variables.css"></head>'
            '<body><p style="color: var(--c-white)">ok</p></body></html>', encoding="utf-8")
        self._root = self.checker.ROOT
        self.checker.ROOT = self.root
        self.checker.VARIABLES = self.root / "assets/css/variables.css"

    def tearDown(self) -> None:
        self.checker.ROOT = self._root
        self.checker.VARIABLES = self._root / "assets/css/variables.css"
        self.tmp.cleanup()

    def findings(self) -> list[str]:
        f = self.checker.Findings()
        self.checker.check_literals(f)
        self.checker.check_palette(f)
        self.checker.check_definitions(f)
        self.checker.check_page_order(f)
        return f.items

    def test_clean_miniature_passes(self) -> None:
        self.assertEqual(self.findings(), [])

    def test_stray_stylesheet_literal_is_caught(self) -> None:
        (self.root / "assets/css/extra.css").write_text(".a { color: #123456; }\n", encoding="utf-8")
        self.assertTrue(any("#123456" in item for item in self.findings()))

    def test_inline_style_literal_is_caught(self) -> None:
        page = self.root / "page.html"
        page.write_text(page.read_text().replace('style="color: var(--c-white)"',
                                                 'style="color: #abcdef"'), encoding="utf-8")
        self.assertTrue(any("#abcdef" in item for item in self.findings()))

    def test_undefined_variable_is_caught(self) -> None:
        page = self.root / "page.html"
        page.write_text(page.read_text().replace("var(--c-white)", "var(--c-missing)"),
                        encoding="utf-8")
        self.assertTrue(any("--c-missing" in item for item in self.findings()))

    def test_variable_with_fallback_is_not_a_finding(self) -> None:
        page = self.root / "page.html"
        page.write_text(page.read_text().replace("var(--c-white)",
                                                 "var(--c-theme-hook, var(--c-white))"),
                        encoding="utf-8")
        self.assertEqual(self.findings(), [])

    def test_unused_palette_entry_is_caught(self) -> None:
        variables = self.root / "assets/css/variables.css"
        variables.write_text(variables.read_text().replace(
            "  --c-white: #ffffff;\n", "  --c-white: #ffffff;\n  --c-unused: #010203;\n"),
            encoding="utf-8")
        self.assertTrue(any("--c-unused" in item for item in self.findings()))

    def test_page_without_token_file_is_caught(self) -> None:
        (self.root / "bare.html").write_text(
            '<html><head><link rel="stylesheet" href="assets/css/extra.css"></head></html>',
            encoding="utf-8")
        (self.root / "assets/css/extra.css").write_text(".a{color:var(--c-white)}\n", encoding="utf-8")
        self.assertTrue(any("bare.html" in item for item in self.findings()))


if __name__ == "__main__":
    unittest.main()
