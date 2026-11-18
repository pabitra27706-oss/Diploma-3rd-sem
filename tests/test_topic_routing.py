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
        # After the 12.6 unit re-tag: 103 same-unit / 2 correct cross-unit
        # redirects (P004-Q8 scope->U4, P006-Q9 operator parsing->U1).
        self.assertEqual(counts['same-unit'], 103)
        self.assertEqual(counts['redirect'], 2)

    def test_the_five_reported_wrong_unit_questions_land_on_their_heading(self):
        # Part 12.6 acceptance: the five questions reported against the wrong unit
        # must resolve to their exact syllabus unit AND a specific heading, not the
        # unit overview. Expected values are the authored anchors, verified present
        # in the shipped unit pages by test_resolved_redirects_land_on_a_real_anchor.
        expected = {
            'CST201-P003-Q8': (3, 'arrays-initialization-memory-and-loops'),
            'CST201-P005-Q11': (5, 'pointers-to-structures-and-unions'),
            'CST201-P005-Q15': (4, 'storage-classes-in-c'),
            'CST201-P006-Q6': (4, 'functions-intro'),
            'CST201-P006-Q21': (4, 'overview-recursion'),
        }
        by_id = {q['id']: q for q in routing.questions('CST201', 'P00[3-6]')}
        for qid, (unit, anchor) in expected.items():
            self.assertIn(qid, by_id, f'{qid} is no longer in the paper window')
            current = by_id[qid].get('unit') or 1
            score, got_anchor, _title, home = routing.route(self.units, current, by_id[qid].get('topic'))
            self.assertGreaterEqual(score, routing.FLOOR, qid)
            self.assertEqual(home, unit, f'{qid} resolved to unit {home}, expected {unit}')
            self.assertEqual(got_anchor, anchor, qid)

    def test_a_broad_overview_never_beats_a_specific_heading_on_a_tie(self):
        # "Arrays / loops" scores 90 against both the unit overview and the
        # 1D-arrays section. Coverage of both segments must win the tie.
        _score, anchor, _title, _unit = routing.route(self.units, 3, 'Arrays / loops')
        self.assertEqual(anchor, 'arrays-initialization-memory-and-loops')

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
