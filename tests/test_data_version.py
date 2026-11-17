"""Phase 9.3 — the data cache version is generated, current and independent.

`assets/data/data-version.json` is what makes a data-only update cheap: it lets
the worker key data cache entries by data bytes instead of by the shell version.
These tests keep the committed file honest and keep the two versions separate.
"""

from __future__ import annotations

import importlib.util
import json
import re
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load(module: str):
    spec = importlib.util.spec_from_file_location(module, ROOT / f"scripts/{module}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class DataVersionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.builder = load("build_data_version")
        cls.committed = json.loads((ROOT / "assets/data/data-version.json").read_text(encoding="utf-8"))
        cls.sw = (ROOT / "sw.js").read_text(encoding="utf-8")

    def test_committed_file_is_current(self) -> None:
        self.assertEqual(self.builder.build(), self.committed,
                         "assets/data/data-version.json is stale — run python3 scripts/build_data_version.py")

    def test_version_is_not_the_shell_version(self) -> None:
        shell = re.search(r"const VERSION = '([^']+)'", self.sw).group(1)
        self.assertNotEqual(self.committed["dataVersion"], shell)
        self.assertRegex(self.committed["dataVersion"], r"^data-[0-9a-f]{12}$")

    def test_digest_covers_every_data_part(self) -> None:
        self.assertGreater(self.committed["fileCount"], 50)
        self.assertEqual(sorted(self.committed["parts"]),
                         sorted(["_data/", "_quiz-data/", "assets/data/", "assets/search/", "assets/cards/"]))
        files = self.builder.data_files()
        self.assertEqual(len(files), self.committed["fileCount"])
        for path in files:
            rel = path.relative_to(ROOT).as_posix()
            self.assertTrue(rel.startswith(("_data/", "_quiz-data/", "assets/data/", "assets/search/",
                                            "assets/cards/")), rel)

    def test_worker_uses_a_separate_data_cache(self) -> None:
        self.assertIn("DATA_CACHE_PREFIX", self.sw)
        self.assertIn("dataVersion()", self.sw)
        self.assertIn("assets/data/data-version.json", self.sw)
        self.assertNotRegex(self.sw, r"searchParams\.set\('v', VERSION\)",
                            "data cache keys must not be tied to the shell version")
        self.assertRegex(self.sw, r"key\.searchParams\.set\('v', dataVersionValue\)")

    def test_a_data_change_changes_the_version(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "assets/data").mkdir(parents=True)
            (root / "assets/data/a.json").write_text('{"a":1}', encoding="utf-8")
            original_root, original_dirs = self.builder.ROOT, self.builder.DATA_DIRS
            self.builder.ROOT, self.builder.DATA_DIRS = root, ("assets/data",)
            try:
                first = self.builder.build()["dataVersion"]
                (root / "assets/data/a.json").write_text('{"a":2}', encoding="utf-8")
                second = self.builder.build()["dataVersion"]
                (root / "assets/data/b.json").write_text('{"b":1}', encoding="utf-8")
                third = self.builder.build()["dataVersion"]
            finally:
                self.builder.ROOT, self.builder.DATA_DIRS = original_root, original_dirs
        self.assertNotEqual(first, second, "editing a data file must change the data version")
        self.assertNotEqual(second, third, "adding a data file must change the data version")

    def test_generated_file_is_not_itself_hashed(self) -> None:
        names = [p.name for p in self.builder.data_files()]
        self.assertNotIn("data-version.json", names)


if __name__ == "__main__":
    unittest.main()
