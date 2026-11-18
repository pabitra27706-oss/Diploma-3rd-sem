"""Phase 7 regression locks for the measured accessibility audit.

These tests read the checked-in baseline written by
`scripts/audit_accessibility.py --baseline` and fail if the tree moves away from
it. They do not assert WCAG conformance — only that the measured numbers in
`docs/phases/07-inclusion-trust/record.md` still describe this tree.
"""

import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / 'docs/phases/07-inclusion-trust/audit-baseline.json'


def audit() -> dict:
    output = subprocess.check_output(
        [sys.executable, str(ROOT / 'scripts/audit_accessibility.py'), '--json'],
        cwd=ROOT,
    )
    return json.loads(output)


class AccessibilityAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = audit()
        cls.baseline = json.loads(BASELINE.read_text(encoding='utf-8'))

    def test_page_count_matches_baseline(self):
        self.assertEqual(self.data['pages'], self.baseline['pages'])
        # Phase 11 replaced a placeholder and added ten guide pages.
        self.assertEqual(self.data['pages'], 84)

    def test_every_page_has_one_main_and_one_h1_and_a_skip_link(self):
        self.assertEqual(self.data['no_main'], [])
        self.assertEqual(self.data['no_skip'], [])
        self.assertEqual(self.data['h1_not_one'], [])

    def test_no_heading_order_jumps(self):
        self.assertEqual(self.data['heading_jump_total'], 0)
        self.assertEqual(self.data['heading_jump_pages'], [])

    def test_no_unlabelled_controls_and_no_duplicate_ids(self):
        self.assertEqual(self.data['controls']['unlabelled'], [])
        self.assertEqual(self.data['controls']['duplicate_ids'], [])

    def test_contrast_pairs_all_meet_their_requirement(self):
        failing = [(row['label'], row['ratio'], row['required'])
                   for row in self.data['contrast'] if not row['pass']]
        self.assertEqual(failing, [])
        # The measurement must stay honest about how many pairs it covers.
        self.assertEqual(len(self.data['contrast']), self.baseline['contrast_measured'])
        # Phase 11 adds checks for Suggestions links, hints, stars and priorities.
        self.assertEqual(self.baseline['contrast_measured'], 74)

    def test_contrast_measurement_reads_real_tokens(self):
        rows = {row['label']: row for row in self.data['contrast']}
        # Spot-check that aliases resolved to hex rather than being skipped.
        self.assertEqual(rows['body text (dark)']['fg'], '#f8fafc')
        self.assertEqual(rows['white on success']['bg'], '#047857')
        self.assertEqual(rows['tertiary text (light)']['fg'], '#5a5e78')

    def test_every_animating_sheet_is_reduced_motion_guarded(self):
        motion = self.data['motion']
        self.assertEqual(motion['animated_without_local_rule'], [])
        # Every shipped page loads the global, preference-aware override too.
        self.assertEqual(motion['pages_with_global_reduced_motion'], motion['pages'])

    def test_no_control_is_pinned_below_24_css_px(self):
        self.assertEqual(self.data['targets']['below_24'], [])

    def test_language_catalogs_have_identical_keys(self):
        import json as _json
        en = _json.loads((ROOT / 'assets/i18n/en.json').read_text(encoding='utf-8'))
        bn = _json.loads((ROOT / 'assets/i18n/bn.json').read_text(encoding='utf-8'))
        self.assertEqual(set(en), set(bn))
        self.assertGreaterEqual(len(en), 38)

    def test_every_data_i18n_key_exists_in_the_catalog(self):
        import re
        catalog = json.loads((ROOT / 'assets/i18n/en.json').read_text(encoding='utf-8'))
        missing = []
        for page in ROOT.rglob('*.html'):
            parts = set(page.relative_to(ROOT).parts)
            if parts & {'webflow', 'docs', 'tests', 'node_modules'}:
                continue
            text = page.read_text(encoding='utf-8', errors='replace')
            for key in re.findall(r'data-i18n="([^"]+)"', text):
                if key not in catalog:
                    missing.append(f'{page.relative_to(ROOT)}:{key}')
        self.assertEqual(missing, [])

    def test_audit_is_quiet_on_the_current_tree(self):
        result = subprocess.run(
            [sys.executable, str(ROOT / 'scripts/audit_accessibility.py'), '--fail'],
            cwd=ROOT, capture_output=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout.decode())


if __name__ == '__main__':
    unittest.main()
