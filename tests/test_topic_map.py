"""Guard the explicit topic -> section map.

The map is authored data, not generated. These tests keep it honest: every
anchor must exist in the unit page it names, every question in the calibrated
window must have an entry, and the map must not silently degrade back to
generic overview landings.
"""
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
import sys
sys.path.insert(0, str(ROOT / 'scripts'))

import audit_topic_routing as routing  # noqa: E402

# Lives under assets/data, NOT _data/<subject>/: scripts/data_pipeline.py treats
# every _data/*/*.json as a PYQ paper, so a subfolder there breaks the pipeline.
MAP_DIR = ROOT / 'assets' / 'data'
GENERIC = ('overview', 'intro', 'fundamentals')


def normalise(value):
    return re.sub(r'\s+', ' ', str(value or '')).strip().lower()


def load_map(subject):
    path = MAP_DIR / f'topic-map-{subject}.json'
    return json.loads(path.read_text(encoding='utf-8'))


class TopicMapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.subject = 'CST201'
        cls.data = load_map(cls.subject)
        cls.map = cls.data['map']
        cls.units = routing.load_units(cls.subject)
        cls.questions = routing.questions(cls.subject, 'P00[3-6]')

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

    def test_map_beats_the_fuzzy_matcher_on_generic_landings(self):
        # The point of the map: almost nothing should land on a generic
        # overview/intro card, because those carry no routing information.
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
        self.assertLess(generic_map, generic_fuzzy,
                        'the map must be more specific than the matcher')

    def test_map_is_not_empty_or_accidentally_truncated(self):
        self.assertGreaterEqual(len(self.map), 80)


if __name__ == '__main__':
    unittest.main()
