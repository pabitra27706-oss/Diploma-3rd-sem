"""Guard the Phase 9B rgba ratchet using isolated source trees."""
import importlib.util
import json
import re
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPEC = importlib.util.spec_from_file_location('check_tokens_rgba', ROOT / 'scripts/check_tokens.py')
checker = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(checker)


class RgbaGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.old_root, self.old_variables = checker.ROOT, checker.VARIABLES
        checker.ROOT = self.root
        checker.VARIABLES = self.root / 'assets/css/variables.css'
        checker.VARIABLES.parent.mkdir(parents=True)
        checker.VARIABLES.write_text(':root { --alpha: rgba(1, 2, 3, .5); }\n')
        self.baseline = self.root / 'docs/phases/09B-ui-reboost/rgba-baseline.json'
        self.baseline.parent.mkdir(parents=True)
        self.baseline.write_text(json.dumps({'version': 1, 'occurrences': {}}))

    def tearDown(self):
        checker.ROOT, checker.VARIABLES = self.old_root, self.old_variables
        self.temp.cleanup()

    def check(self):
        findings = checker.Findings()
        checker.check_rgba(findings)
        return findings.items

    def write(self, path, text):
        p = self.root / path
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)

    def lock(self, data):
        self.baseline.write_text(json.dumps({'version': 1, 'occurrences': data}))

    def test_token_definition_and_token_use_pass(self):
        self.write('assets/css/main.css', '.a { background: var(--alpha); }')
        self.assertEqual(self.check(), [])

    def test_new_css_literal_and_nested_function_are_caught(self):
        self.write('assets/css/main.css', '.a { color: rgba(var(--rgb), calc(1 - .2)); }')
        self.assertTrue(any('rgba(var(--rgb), calc(1 - .2))' in x for x in self.check()))

    def test_html_quoted_style_block_and_script_are_caught(self):
        for html in ("<i style='color:rgba(1,2,3,.4)'></i>",
                     '<style>.a{color:rgba(1,2,3,.4)}</style>',
                     '<script>x.style.color="rgba(1,2,3,.4)"</script>'):
            self.write('page.html', html)
            self.assertTrue(any('rgba(1,2,3,.4)' in x for x in self.check()), html)

    def test_javascript_style_and_template_are_caught(self):
        for js in ("el.style.cssText='color:rgba(1,2,3,.4)'", 'el.style.cssText=`color:rgba(1,2,3,.4)`'):
            self.write('assets/js/app.js', js)
            self.assertTrue(any('rgba(1,2,3,.4)' in x for x in self.check()), js)

    def test_existing_expression_count_is_locked_in_each_file(self):
        expression = 'rgba(1,2,3,.4)'
        self.write('a.css', '.a{color:' + expression + '}')
        self.lock({'a.css': {expression: 1}})
        self.assertEqual(self.check(), [])
        self.write('a.css', '.a{color:' + expression + ';background:' + expression + '}')
        self.assertTrue(self.check(), 'a repeated legacy literal must not bypass the gate')
        self.write('a.css', '.a{color:var(--alpha)}')
        self.assertTrue(self.check(), 'a removed literal needs a ratcheted baseline')
        self.lock({})
        self.assertEqual(self.check(), [])

    def test_variables_file_allows_custom_properties_only(self):
        checker.VARIABLES.write_text(':root{--alpha:rgba(1,2,3,.4)} .x{color:rgba(5,6,7,.8)}')
        findings = self.check()
        self.assertTrue(any('rgba(5,6,7,.8)' in x for x in findings))
        self.assertFalse(any('rgba(1,2,3,.4)' in x for x in findings))

    def test_non_token_text_in_variables_is_not_an_exemption(self):
        checker.VARIABLES.write_text(':root{--alpha:rgba(1,2,3,.4)} .x{content:"--fake: rgba(5,6,7,.8)"}')
        self.assertTrue(any('rgba(5,6,7,.8)' in x for x in self.check()))

    def test_css_and_html_comments_are_ignored(self):
        self.write('test.css', '/* rgba(1,2,3,.4) */ .x{color:var(--alpha)}')
        self.write('test.html', '<!-- rgba(1,2,3,.4) --><p>ok</p>')
        self.assertEqual(self.check(), [])

    def test_case_whitespace_are_not_a_bypass(self):
        self.write('test.css', '.x{color:RGBA (1,2,3,.4)}')
        self.assertTrue(self.check())

    def test_missing_or_malformed_baseline_fails_closed(self):
        self.baseline.unlink()
        self.assertTrue(self.check())
        self.baseline.write_text('{broken')
        self.assertTrue(self.check())
        self.baseline.write_text(json.dumps({'version': 1, 'occurrences': {'../escape.css': {'rgba(1,2,3,.4)': -1}}}))
        self.assertTrue(self.check())


class HomeOverlayTokenTests(unittest.TestCase):
    def test_white_overlay_remains_exactly_fifteen_percent_white(self):
        variables = (ROOT / 'assets/css/variables.css').read_text()
        self.assertEqual(re.findall(r'--alpha-white-15\s*:\s*([^;]+);', variables),
                         ['rgba(255, 255, 255, 0.15)'])


if __name__ == '__main__':
    unittest.main()
