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
from unittest import mock

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


# ---------------------------------------------------------------------------
# Phase 17 (17.1-17.4): all five maps, measured through the runtime's own rules.
# ---------------------------------------------------------------------------

SUBJECTS = ('CST201', 'CST203', 'CST205', 'CST207', 'CST209')
PLACEHOLDERS = ('short answer', 'group a / objective', 'group c / long answer')
# Pinned measurements (2026-11-19). A change must be explained in record.md.
TOTAL_MAP_ENTRIES = 421          # 82 + 92 + 80 + 82 + 85
TOTAL_PLACEHOLDER_QUESTIONS = 321  # archived P001/P002 only, all five subjects
GENERIC_MAP_LANDINGS = {'CST201': 3, 'CST203': 0, 'CST205': 0, 'CST207': 0, 'CST209': 0}
CST207_CORRECTIONS = 85          # window questions whose landing unit is corrected
ARCHIVED_ORDER_DEPENDENT = {'CST201': 50, 'CST203': 30, 'CST205': 45, 'CST207': 30, 'CST209': 49}


class RuntimeMirrorTests(unittest.TestCase):
    """The mirror must count an anchor as landable only where the browser does."""

    def _entries(self, html):
        parser = routing._RuntimeHeadings()
        parser.feed(html)
        return parser.entries, parser.ids

    def test_heading_with_an_id_is_an_entry(self):
        entries, ids = self._entries('<h3 id="a-b">Title here</h3>')
        self.assertEqual(entries, [('title here', 'a-b')])
        self.assertIn('a-b', ids)

    def test_id_on_a_non_heading_is_not_landable(self):
        # The runtime only lists h2/h3/h4, so a <p id> is silently skipped.
        entries, ids = self._entries('<p id="x">text</p>')
        self.assertEqual(entries, [])
        self.assertIn('x', ids)

    def test_heading_without_id_takes_its_named_section(self):
        entries, _ = self._entries('<section id="sec"><h3>Named heading</h3></section>')
        self.assertEqual(entries, [('named heading', 'sec')])

    def test_runtime_section_number_id_falls_back_to_the_section(self):
        entries, _ = self._entries('<section id="sec"><h2 id="section-2">Two</h2></section>')
        self.assertEqual(entries, [('two', 'sec')])

    def test_anchor_link_text_is_not_part_of_the_title(self):
        entries, _ = self._entries(
            '<h3 id="t">Real <a class="section-anchor-link" href="#t">#</a> title</h3>')
        self.assertEqual(entries, [('real title', 't')])


class AllFiveMapContractTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.maps = {s: json.loads((MAP_DIR / f'topic-map-{s}.json').read_text(encoding='utf-8'))
                    for s in SUBJECTS}

    def test_every_map_lives_in_assets_data_not_the_paper_tree(self):
        for s in SUBJECTS:
            self.assertTrue((MAP_DIR / f'topic-map-{s}.json').is_file(), s)
        self.assertEqual(sorted((ROOT / '_data').glob('*/topic-map*.json')), [])

    def test_keys_are_normalised_and_unique_after_normalisation(self):
        for s, data in self.maps.items():
            for block in ('map', 'noJump'):
                keys = list(data[block])
                for key in keys:
                    self.assertEqual(key, normalise(key), f'{s} {block}: {key!r}')
                self.assertEqual(len({normalise(k) for k in keys}), len(keys), f'{s} {block}')

    def test_no_entry_points_at_a_paper_section(self):
        for s, data in self.maps.items():
            for key, (_unit, anchor) in data['map'].items():
                self.assertNotIn(anchor, routing.PAPER_SECTION_ANCHORS, f'{s}: {key!r}')

    def test_every_entry_anchor_is_a_heading_the_browser_can_land_on(self):
        """Anchor existence for ALL FIVE subjects, read from the actual page files."""
        total = 0
        for s, data in self.maps.items():
            pages = routing.runtime_units(s)
            for key, (unit, anchor) in data['map'].items():
                entries = pages.get(unit, ([], set()))[0]
                self.assertIn(anchor, {a for _t, a in entries},
                              f'{s}: "{key}" -> U{unit} #{anchor} is not a landable heading')
                total += 1
        self.assertEqual(total, TOTAL_MAP_ENTRIES)

    def test_units_are_declared_or_labelled_supplementary(self):
        for s, data in self.maps.items():
            allowed = set(range(1, routing.DECLARED_UNITS[s] + 1))
            allowed |= set(routing.SUPPLEMENTARY_UNITS.get(s, []))
            for key, (unit, _anchor) in data['map'].items():
                self.assertIn(unit, allowed, f'{s}: "{key}" names undeclared unit {unit}')
        self.assertEqual(sorted(self.maps['CST209']['supplementaryUnits']), ['5'])
        self.assertIn('CO5', self.maps['CST209']['supplementaryUnits']['5'])
        for s in ('CST201', 'CST203', 'CST205', 'CST207'):
            self.assertNotIn('supplementaryUnits', self.maps[s])

    def test_python_unit_constants_match_the_javascript(self):
        js = (ROOT / 'assets/js/unit-discovery.js').read_text(encoding='utf-8')
        block = re.search(r'const SYLLABUS_UNITS = \{(.*?)\};', js, re.S).group(1)
        declared = {k: int(v) for k, v in re.findall(r'(CST\d{3}):\s*(\d+)', block)}
        self.assertEqual(declared, routing.DECLARED_UNITS)
        supp = re.search(r'const SUPPLEMENTARY_UNITS = \{(.*?)\};', js, re.S).group(1)
        self.assertEqual({k: [int(x) for x in re.findall(r'\d+', v)]
                          for k, v in re.findall(r'(CST\d{3}):\s*(\[[^\]]*\])', supp)},
                         routing.SUPPLEMENTARY_UNITS)

    def test_calibrated_window_has_zero_unmapped_questions_for_every_subject(self):
        for s in SUBJECTS:
            report = routing.subject_report(s)
            self.assertEqual(report['problems'], [], s)
            self.assertEqual(report['window_counts']['unmapped'], 0, f'{s} has unmapped questions')
            self.assertEqual(report['window_counts']['mapped']
                             + report['window_counts']['no-jump'], report['window'], s)

    def test_no_jump_register_is_explicit_disjoint_and_reasoned(self):
        for s, data in self.maps.items():
            register = data['noJump']
            self.assertTrue(register, s)
            self.assertFalse(set(register) & set(data['map']), s)
            for key, reason in register.items():
                self.assertIsInstance(reason, str)
                self.assertGreater(len(reason.split()), 8, f'{s} {key!r} needs a reason')
            for label in PLACEHOLDERS:
                self.assertIn(label, register, f'{s} must decide "{label}" explicitly')
        self.assertIn('short notes', self.maps['CST207']['noJump'])

    def test_placeholder_labels_never_reach_the_matcher(self):
        seen = 0
        for s in SUBJECTS:
            mapping, no_jump = routing.load_register(s)
            pages = routing.runtime_units(s)
            for q in routing.questions(s, routing.FULL_CORPUS):
                if normalise(q.get('topic')) not in PLACEHOLDERS:
                    continue
                seen += 1
                kind, *_rest = routing.route_runtime(pages, mapping, no_jump,
                                                     q.get('unit') or 1, q.get('topic'))
                self.assertEqual(kind, 'no-jump', f'{q["id"]} reached the matcher')
        self.assertEqual(seen, TOTAL_PLACEHOLDER_QUESTIONS)

    def test_matcher_gauge_is_no_worse_than_the_2026_11_18_baseline(self):
        for s in SUBJECTS:
            full = routing.subject_report(s)['full']
            base = routing.BASELINE[s]
            self.assertLessEqual(full['unmatched'], base[2], f'{s} unmatched worse than baseline')
            self.assertLessEqual(full['generic'], base[3], f'{s} generic landings worse than baseline')
            self.assertEqual(full['same-unit'] + full['redirect'] + full['unmatched'], base[4], s)

    def test_map_first_generic_landings_are_pinned(self):
        generic = {s: routing.subject_report(s)['window_counts']['generic'] for s in SUBJECTS}
        self.assertEqual(generic, GENERIC_MAP_LANDINGS)

    def test_cst207_correction_count_is_pinned(self):
        self.assertEqual(routing.subject_report('CST207')['window_counts']['corrections'],
                         CST207_CORRECTIONS)


class MapAuditNegativeControlTests(unittest.TestCase):
    """Every check above must be able to fail. Each case injects one defect."""

    def _report_with(self, mapping, no_jump=None):
        real = routing.load_register

        def fake(subject):
            if subject != 'CST201':
                return real(subject)
            return mapping, (real(subject)[1] if no_jump is None else no_jump)

        with mock.patch.object(routing, 'load_register', fake):
            return routing.subject_report('CST201')

    def test_a_paper_section_anchor_is_flagged(self):
        mapping = dict(routing.load_register('CST201')[0])
        mapping['arrays'] = [3, 'short-questions']
        self.assertTrue(any('paper-section' in p for p in self._report_with(mapping)['problems']))

    def test_a_renamed_anchor_is_flagged(self):
        mapping = dict(routing.load_register('CST201')[0])
        mapping['arrays'] = [3, 'arrays-intro-renamed']
        self.assertTrue(any('not a heading entry' in p for p in self._report_with(mapping)['problems']))

    def test_an_undeclared_unit_is_flagged(self):
        mapping = dict(routing.load_register('CST201')[0])
        mapping['arrays'] = [6, 'arrays-intro']
        self.assertTrue(any('undeclared unit' in p for p in self._report_with(mapping)['problems']))

    def test_a_key_that_is_both_mapped_and_no_jump_is_flagged(self):
        mapping = dict(routing.load_register('CST201')[0])
        no_jump = {'arrays': 'duplicate decision'}
        self.assertTrue(any('both mapped and noJump' in p
                            for p in self._report_with(mapping, no_jump)['problems']))

    def test_an_unmapped_window_question_is_counted(self):
        mapping = dict(routing.load_register('CST201')[0])
        del mapping['arrays']
        report = self._report_with(mapping)
        self.assertGreater(report['window_counts']['unmapped'], 0)


if __name__ == '__main__':
    unittest.main()
