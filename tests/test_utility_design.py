"""Source contracts for the four utility pages; not a browser or visual test."""
from pathlib import Path
from html.parser import HTMLParser
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from audit_accessibility import contrast, css_vars, resolve

class UtilityDesignTests(unittest.TestCase):
    def test_pages_use_scoped_utilities_and_existing_controls(self):
        for page, controls in {
            'search.html': ('search-form', 'query', 'subject', 'unit', 'type', 'search-results'),
            'today.html': ('goal-form', 'save-goal', 'another-question', 'weak-areas'),
            'settings.html': ('prefs-form', 'preview-import', 'apply-import', 'clear-data'),
            'coverage.html': ('flags', 'answer-verification-status', 'open-findings'),
        }.items():
            html = (ROOT / page).read_text()
            self.assertIn('class="discovery utility-page', html, page)
            for control in controls:
                self.assertIn('id="' + control + '"', html, (page, control))
            self.assertIn('aria-hidden="true"', html, page)

    def test_phone_forms_tables_and_hidden_states_are_explicit(self):
        css = (ROOT / 'assets/css/discovery.css').read_text()
        for term in ('utility-page', '#search-form', 'overflow-x:auto', '[hidden]', '@media'):
            self.assertIn(term, css)
        self.assertIn('data-theme="dark"', css)

    def test_search_fields_are_separate_labelled_controls(self):
        class Fields(HTMLParser):
            def __init__(self):
                super().__init__()
                self.depth = 0
                self.fields = []
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                if tag == 'div' and attrs.get('class') == 'search-field':
                    self.depth += 1
                    self.fields.append([])
                    self.assert_separate()
                elif self.depth and tag in ('label', 'input', 'select'):
                    self.fields[-1].append(attrs.get('for') or attrs.get('id'))
            def assert_separate(self):
                if self.depth != 1:
                    raise AssertionError('nested search fields')
            def handle_endtag(self, tag):
                if tag == 'div' and self.depth:
                    self.depth -= 1
        parser = Fields()
        parser.feed((ROOT / 'search.html').read_text())
        self.assertEqual(parser.fields, [[x, x] for x in ('query', 'subject', 'unit', 'type')])

    def test_new_link_and_button_colour_pairs(self):
        # Token-resolved opaque pairs; not proof of rendered contrast.
        tokens = css_vars(ROOT / 'assets/css/variables.css')
        for fg, bg, dark in (
            ('--accent-primary', '--bg-primary', False),
            ('--accent-primary', '--bg-secondary', False),
            ('--c-indigo-300', '--bg-primary', True),
            ('--c-indigo-300', '--bg-card', True),
            ('--c-indigo-300', '--bg-secondary', True),
            ('--c-white', '--accent-primary', False),
            ('--c-white', '--accent-secondary', False),
        ):
            foreground = resolve(tokens, fg, dark=dark)
            background = resolve(tokens, bg, dark=dark)
            self.assertIsNotNone(foreground, fg)
            self.assertIsNotNone(background, bg)
            self.assertGreaterEqual(contrast(foreground, background), 4.5, (fg, bg, dark))

    def test_coverage_scope_is_generated(self):
        builder = (ROOT / 'scripts/build_coverage.py').read_text()
        self.assertIn('utility-page utility-coverage', builder)

if __name__ == '__main__':
    unittest.main()
