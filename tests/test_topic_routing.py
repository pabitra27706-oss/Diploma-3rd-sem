"""Lock the PYQ -> unit-heading routing so a regression cannot pass silently.

`scripts/audit_topic_routing.py` mirrors `focusQuestionTopic()` in
`assets/js/unit-discovery.js`. These tests pin the behaviours that were broken
before the topic-segment + singular fix, and the current routing totals.
"""
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('audit_topic_routing',
                                               ROOT / 'scripts/audit_topic_routing.py')
routing = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(routing)


class TopicRoutingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.units = routing.load_units('CST201')

    def test_multi_subtopic_topic_matches_one_segment(self):
        # "Switch / Armstrong numbers" used to score 0 because the whole string
        # had to appear as a heading. One segment matching is now enough.
        score, anchor, _title, unit = routing.route(self.units, 2, 'Switch / Armstrong numbers')
        self.assertGreaterEqual(score, routing.FLOOR)
        self.assertEqual(unit, 2)
        self.assertEqual(anchor, 'switch')

    def test_plural_topic_matches_singular_heading(self):
        # Headings say "loop"; stored topics say "loops".
        score, _anchor, _title, unit = routing.route(self.units, 2, 'Conditionals / loops / GCD')
        self.assertGreaterEqual(score, routing.FLOOR)
        self.assertEqual(unit, 2)

    def test_topic_spanning_three_subtopics_still_resolves(self):
        score, _a, _t, unit = routing.route(self.units, 2, 'Conditional operator / parameters / leap year')
        self.assertGreaterEqual(score, routing.FLOOR)
        self.assertEqual(unit, 2)

    def test_no_question_is_unmatched(self):
        counts = {'same-unit': 0, 'redirect': 0, 'unmatched': 0}
        for q in routing.questions('CST201', 'P00[3-6]'):
            current = q.get('unit') or 1
            score, _a, _t, home = routing.route(self.units, current, q.get('topic'))
            if score < routing.FLOOR:
                counts['unmatched'] += 1
            elif home == current:
                counts['same-unit'] += 1
            else:
                counts['redirect'] += 1
        self.assertEqual(counts['unmatched'], 0)
        self.assertEqual(sum(counts.values()), 105)
        # Same-unit coverage must not regress below the post-fix figure.
        self.assertGreaterEqual(counts['same-unit'], 77)

    def test_resolved_redirects_land_on_a_real_anchor(self):
        for q in routing.questions('CST201', 'P00[3-6]'):
            current = q.get('unit') or 1
            score, anchor, _t, home = routing.route(self.units, current, q.get('topic'))
            if score < routing.FLOOR:
                continue
            anchors = {a for _title, a in self.units[home]}
            self.assertIn(anchor, anchors, q['id'])


if __name__ == '__main__':
    unittest.main()
