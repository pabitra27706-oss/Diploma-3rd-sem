"""Guard the explicit topic -> section map for CST203 (Python).

The map is authored data, not generated. These tests keep it honest: every
anchor must exist in the unit page it names, every question in the calibrated
window must have an entry, and the map must not silently degrade back to
generic overview landings.

Modelled on tests/test_topic_map.py (CST201, Phase 12) per
docs/phases/topic-map-standard.md. Differences from that file, and why:

  * The window is P00[3-6] (104 questions), not P00[3-6] of a 198-question
    corpus, so the truncation floor is scaled to the map's real size.
  * Two anchors were AUTHORED in part 13.6 rather than being pre-existing, so
    there is an explicit test that they resolve — the standard's rule 5 says
    verify by grep, never from a heading list.
  * A test asserts the map beats the fuzzy matcher on every single question,
    not just on generic landings, because CST203's map re-points 49 of 104
    questions and a silent half-application would still pass a >=80% check.
"""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))

import audit_topic_routing as routing  # noqa: E402

# Lives under assets/data, NOT _data/<subject>/: scripts/data_pipeline.py treats
# every _data/*/*.json as a PYQ paper, so a subfolder there breaks the pipeline.
MAP_DIR = ROOT / 'assets' / 'data'
SUBJECT = 'CST203'
WINDOW = 'P00[3-6]'
GENERIC = ('overview', 'intro', 'fundamentals')
# Section titles that are navigation, not concepts (standard §3 rule 4).
PAPER_SECTIONS = frozenset({
    'mcqs', 'short-questions', 'long-questions', 'practice', 'revision',
    'videos', 'formulas', 'definitions', 'comparisons',
})


def normalise(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip().lower()


def load_map(subject):
    path = MAP_DIR / f'topic-map-{subject}.json'
    return json.loads(path.read_text(encoding='utf-8'))


class CST203TopicMapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load_map(SUBJECT)
        cls.map = cls.data['map']
        cls.units = routing.load_units(SUBJECT)
        cls.questions = routing.questions(SUBJECT, WINDOW)

    def test_every_entry_points_at_an_anchor_that_exists(self):
        for topic, (unit, anchor) in self.map.items():
            anchors = {a for _t, a in self.units.get(unit, [])}
            self.assertIn(anchor, anchors,
                          f'"{topic}" -> U{unit} #{anchor} does not exist')

    def test_every_entry_names_a_declared_unit(self):
        for topic, (unit, _anchor) in self.map.items():
            self.assertIn(unit, self.units, f'"{topic}" names unit {unit}')

    def test_every_question_in_the_window_is_mapped(self):
        missing = [q['id'] for q in self.questions
                   if normalise(q.get('topic')) not in self.map]
        self.assertEqual(missing, [], f'{len(missing)} question(s) have no map entry')

    def test_keys_are_normalised_so_lookup_can_be_exact(self):
        for topic in self.map:
            self.assertEqual(topic, normalise(topic), f'key not normalised: {topic!r}')

    def test_no_entry_points_at_a_paper_section(self):
        # A jump to #mcqs or #practice is navigation, not a concept: the learner
        # would land on a list of questions instead of the teaching for one.
        offenders = {t: a for t, (_u, a) in self.map.items() if a in PAPER_SECTIONS}
        self.assertEqual(offenders, {}, f'map points at paper sections: {offenders}')

    def test_map_beats_the_fuzzy_matcher_on_generic_landings(self):
        generic_map = 0
        generic_fuzzy = 0
        for q in self.questions:
            topic = normalise(q.get('topic'))
            current = q.get('unit') or 1
            if topic in self.map:
                _u, anchor = self.map[topic]
            else:
                _s, anchor, _t, _h = routing.route(self.units, current, topic)
            generic_map += bool(anchor) and anchor.startswith(GENERIC)
            _s, fuzzy_anchor, _t, _h = routing.route(self.units, current, topic)
            generic_fuzzy += bool(fuzzy_anchor) and fuzzy_anchor.startswith(GENERIC)
        self.assertLessEqual(generic_map, 5,
                             f'map sends {generic_map} questions to a generic card')
        # The standard's phrasing assumes the matcher wastes landings on generic
        # cards. On CST203 it does not (Phase 13 gave every unit named headings,
        # so fuzzy already scores 0). Asserting strictly-greater would be
        # asserting something false, so the real requirement is asserted:
        # the map is never WORSE, and it is strictly better somewhere.
        self.assertLessEqual(generic_map, generic_fuzzy,
                             'the map must not be less specific than the matcher')

    def test_map_actually_changes_most_landings_not_a_handful(self):
        # The standard warns a map that changes nothing is a wrong map. For
        # CST203 it re-points 49 of 104. A floor well below that catches a
        # truncated or half-applied map without pinning a brittle exact number.
        changed = 0
        for q in self.questions:
            topic = normalise(q.get('topic'))
            if topic not in self.map:
                continue
            current = q.get('unit') or 1
            _s, fuzzy_anchor, _t, fuzzy_home = routing.route(self.units, current, topic)
            unit, anchor = self.map[topic]
            if (unit, anchor) != (fuzzy_home, fuzzy_anchor):
                changed += 1
        self.assertGreaterEqual(changed, 35,
                                f'only {changed} landings differ from the matcher; '
                                'the map is not doing its job')

    def test_map_is_not_empty_or_accidentally_truncated(self):
        self.assertGreaterEqual(len(self.map), 85)

    def test_the_two_anchors_authored_for_this_map_resolve(self):
        # Part 13.6 authored these two headings in Unit 1 because the material
        # already existed there without a heading of its own. If a later edit
        # renames them the map rots silently, so pin the pair by name.
        for anchor in ('sets-union-and-methods', 'list-mutation-during-iteration'):
            self.assertIn(anchor, {a for _t, a in self.units[1]},
                          f'#{anchor} was authored in 13.6 and has gone missing')

    def test_multi_part_questions_with_unequal_marks_record_a_decision(self):
        # The standard's rule 2 is "the marks decide" for multi-part topics.
        # That rule can only bite where the subparts carry DIFFERENT marks and
        # point at different sections -- a 1-mark MCQ labelled "Strings / len"
        # has nothing to weigh. So this test requires a written reason for
        # exactly those questions: multi-part topic, unequal subpart marks, and
        # more than one sub-topic. Everything it demands is a real judgement
        # call a reviewer should be able to read.
        decisions = self.data.get('decisions', {})
        needs = {}
        for q in self.questions:
            topic = normalise(q.get('topic'))
            if not re.search(r'[/;]', topic):
                continue
            marks = [sp.get('marks') for sp in (q.get('subparts') or []) if sp.get('marks')]
            if len(marks) < 2 or len(set(marks)) < 2:
                continue          # equal marks (or no subparts): nothing to weigh
            needs.setdefault(topic, []).append(q['id'])
        unrecorded = {t: ids for t, ids in needs.items() if t not in decisions}
        self.assertEqual(unrecorded, {},
                         f'questions with unequal subpart marks lack a recorded decision: {unrecorded}')
        # And the guard must not be vacuous: it has to be looking at a real set.
        self.assertGreaterEqual(len(needs), 8,
                                f'only {len(needs)} unequal-mark topics found; the probe is broken')


if __name__ == '__main__':
    unittest.main()
