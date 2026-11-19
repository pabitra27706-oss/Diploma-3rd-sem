"""Guard the explicit topic -> section map for CST205 (Data Structures).

Modelled on tests/test_topic_map_cst203.py per docs/phases/topic-map-standard.md.
Differences: the window is 106 questions over 4 units; the stored unit tags in
this subject are systematically shifted (Stacks/Queues tagged U1, Linked Lists
U2, Trees U3), so the map is expected to re-point most landings across units.
Generic landings are measured as landings on a bare section card (overview /
introduction section ids), because this subject's named concept headings inside
the introduction section (introduction-structure-of-a-node and friends) are
specific teaching headings, not coarse cards.
"""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))

import audit_topic_routing as routing  # noqa: E402

MAP_DIR = ROOT / 'assets' / 'data'
SUBJECT = 'CST205'
WINDOW = 'P00[3-6]'
GENERIC_CARDS = frozenset({'overview', 'introduction', 'trees', 'binary-trees',
                           'graphs', 'queues', 'stacks', 'recursion', 'singly',
                           'doubly', 'circular-singly', 'circular-doubly'})
PAPER_SECTIONS = frozenset({
    'mcqs', 'short-questions', 'long-questions', 'practice', 'revision',
    'videos', 'formulas', 'definitions', 'comparisons',
})

AUTHORED_ANCHORS = {
    1: ('arrays-and-index-addressing',),
    2: ('infix-postfix-and-prefix-conversion', 'postfix-evaluation-using-stack',
        'circular-queues-deques-and-priority-queues',
        'recursion-gcd-and-hanoi-worked-traces'),
    3: ('singly-linked-lists-searching-and-traversal',
        'doubly-linked-lists-insertion-and-deletion',
        'header-linked-lists-and-polynomials'),
    4: ('binary-trees-array-and-linked-representation',
        'binary-tree-properties-proofs-and-catalan-counts',
        'threaded-binary-trees-exam-note', 'binary-tree-reconstruction',
        'binary-search-tree-bst-property-and-operations',
        'avl-trees-balance-factor-and-rotations',
        'b-trees-order-m-and-construction', 'bfs-and-dfs-worked-trace',
        'graph-traversal-bfs-vs-dfs'),
}


def normalise(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip().lower()


def load_map(subject):
    path = MAP_DIR / f'topic-map-{subject}.json'
    return json.loads(path.read_text(encoding='utf-8'))


class CST205TopicMapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load_map(SUBJECT)
        cls.map = cls.data['map']
        cls.units = routing.load_units(SUBJECT)
        cls.questions = routing.questions(SUBJECT, WINDOW)

    def test_window_is_106_questions(self):
        self.assertEqual(len(self.questions), 106)

    def test_every_entry_points_at_an_anchor_that_exists(self):
        for topic, (unit, anchor) in self.map.items():
            anchors = {a for _t, a in self.units.get(unit, [])}
            self.assertIn(anchor, anchors,
                          f'"{topic}" -> U{unit} #{anchor} does not exist')

    def test_every_entry_names_a_declared_unit(self):
        for topic, (unit, _anchor) in self.map.items():
            self.assertIn(unit, self.units, f'"{topic}" names unit {unit}')
            self.assertIn(unit, (1, 2, 3, 4))

    def test_every_question_in_the_window_is_mapped(self):
        missing = [q['id'] for q in self.questions
                   if normalise(q.get('topic')) not in self.map]
        self.assertEqual(missing, [], f'{len(missing)} question(s) have no map entry')

    def test_keys_are_normalised_so_lookup_can_be_exact(self):
        for topic in self.map:
            self.assertEqual(topic, normalise(topic), f'key not normalised: {topic!r}')

    def test_no_entry_points_at_a_paper_section(self):
        offenders = {t: a for t, (_u, a) in self.map.items() if a in PAPER_SECTIONS}
        self.assertEqual(offenders, {}, f'map points at paper sections: {offenders}')

    def test_no_generic_card_landings(self):
        generic = [q['id'] for q in self.questions
                   if self.map[normalise(q.get('topic'))][1] in GENERIC_CARDS]
        self.assertEqual(generic, [], f'map sends questions to coarse cards: {generic}')

    def test_map_actually_changes_most_landings_not_a_handful(self):
        changed = 0
        for q in self.questions:
            topic = normalise(q.get('topic'))
            current = q.get('unit') or 1
            _s, fuzzy_anchor, _t, fuzzy_home = routing.route(self.units, current, topic)
            unit, anchor = self.map[topic]
            if (unit, anchor) != (fuzzy_home, fuzzy_anchor):
                changed += 1
        self.assertGreaterEqual(changed, 50,
                                f'only {changed} landings differ from the matcher; '
                                'the map is not doing its job')

    def test_map_is_not_empty_or_accidentally_truncated(self):
        self.assertGreaterEqual(len(self.map), 75)

    def test_authored_anchors_for_this_map_resolve(self):
        for unit, anchors in AUTHORED_ANCHORS.items():
            present = {a for _t, a in self.units[unit]}
            for anchor in anchors:
                self.assertIn(anchor, present,
                              f'#{anchor} was authored in Phase 14 and has gone missing')

    def test_multi_part_questions_with_unequal_marks_record_a_decision(self):
        # Mirrors tests/test_topic_map_cst203.py: decisions are keyed by the
        # normalised topic, and every multi-part topic whose subparts disagree
        # on marks must have a written reason. Equal-mark composites do not
        # trip this probe, so they are documented in the builder ledger too.
        decisions = self.data.get('decisions', {})
        self.assertGreaterEqual(len(decisions), 20)
        needs = {}
        for q in self.questions:
            topic = normalise(q.get('topic'))
            if not re.search(r'[/;]', topic):
                continue
            marks = [sp.get('marks') for sp in (q.get('subparts') or []) if sp.get('marks')]
            if len(marks) < 2 or len(set(marks)) < 2:
                continue
            needs.setdefault(topic, []).append(q['id'])
        unrecorded = {t: ids for t, ids in needs.items() if t not in decisions}
        self.assertEqual(unrecorded, {},
                         f'questions with unequal subpart marks lack a recorded decision: {unrecorded}')
        self.assertGreaterEqual(len(needs), 8,
                                f'only {len(needs)} unequal-mark topics found; the probe is broken')

    def test_wrong_unit_traps_land_on_reviewed_concepts(self):
        # Questions whose fuzzy landing was demonstrably wrong at baseline.
        traps = {
            'CST205-P003-Q24': (2, 'circular-queues-deques-and-priority-queues'),
            'CST205-P005-Q12': (4, 'binary-trees-array-and-linked-representation'),
            'CST205-P003-Q11': (4, 'binary-search-tree-bst-property-and-operations'),
            'CST205-P005-Q9': (4, 'b-trees-order-m-and-construction'),
            'CST205-P006-Q21': (4, 'avl-trees-balance-factor-and-rotations'),
        }
        by_id = {q['id']: q for q in self.questions}
        for qid, expected in traps.items():
            topic = normalise(by_id[qid].get('topic'))
            self.assertEqual(tuple(self.map[topic]), expected, qid)


if __name__ == '__main__':
    unittest.main()
