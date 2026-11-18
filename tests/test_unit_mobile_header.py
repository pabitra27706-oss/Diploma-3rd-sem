"""Source-level guardrails for unit-page mobile header alignment."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parent.parent
CSS = (ROOT / 'subjects/units-com/common.css').read_text(encoding='utf-8')


class UnitMobileHeaderTests(unittest.TestCase):
    def test_mobile_theme_and_menu_controls_stay_at_far_right(self):
        responsive = CSS[CSS.index('/* ── Tablet (≤ 768px) ── */'):]
        mobile = re.search(r'@media\s*\(max-width:\s*768px\)(.*?)(?=@media|\Z)', responsive, re.S)
        self.assertIsNotNone(mobile)
        self.assertRegex(mobile.group(1), r'\.mobile-menu-btn\s*\{[^}]*display:\s*flex')
        self.assertRegex(mobile.group(1), r'\.nav-right\s*\{[^}]*margin-left:\s*auto')

    def test_python_subject_mark_is_centered_inside_its_badge(self):
        rule = re.search(
            r'\[data-page="subject"\]\s+\.header-content\s+h1\s*>\s*\.fa-python\s*\{([^}]*)\}',
            CSS,
            re.S,
        )
        self.assertIsNotNone(rule)
        self.assertRegex(rule.group(1), r'display:\s*inline-flex')
        self.assertRegex(rule.group(1), r'align-items:\s*center')
        self.assertRegex(rule.group(1), r'justify-content:\s*center')
        self.assertRegex(rule.group(1), r'border-radius:\s*50%')
        self.assertRegex(rule.group(1), r'width:\s*2\.75rem')
        self.assertRegex(rule.group(1), r'height:\s*2\.75rem')


if __name__ == '__main__':
    unittest.main()
