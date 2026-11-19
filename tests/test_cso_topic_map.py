"""Ratchet the CST207 map against covered questions, headings and marks."""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_topic_map_cst207 import build, questions, SUBJECT, WINDOW  # noqa: E402


class CSOTopicMapTests(unittest.TestCase):
    def test_canonical_map_and_named_landings(self):
        path = ROOT / 'assets/data/topic-map-CST207.json'
        shipped = json.loads(path.read_text(encoding='utf-8'))
        self.assertEqual(shipped, build())
        entries = shipped['map']
        self.assertEqual(len(entries), 82)
        self.assertNotIn('short notes', entries)
        refs = set()
        for q in questions(SUBJECT, WINDOW):
            ref = q['id'].split('-', 1)[1]
            topic = ' '.join(q['topic'].lower().split())
            if ref == 'P006-Q24':
                self.assertIn(ref, shipped['decisions'])
                continue
            unit, anchor = entries[topic]
            self.assertIn(unit, range(1, 6))
            raw = (ROOT / f'subjects/{SUBJECT}/units/unit-{unit}.html').read_text(encoding='utf-8')
            self.assertRegex(raw, rf'<h3\b[^>]*\bid="{re.escape(anchor)}"')
            if len({part['marks'] for part in q.get('subparts', [])}) > 1:
                self.assertIn(ref, shipped['decisions'])
            refs.add(ref)
        self.assertEqual(len(refs), 102)

    def test_repeated_wrong_unit_collisions_do_not_reappear(self):
        entries = build()['map']
        self.assertEqual({topic: entries[topic][0] for topic in (
            'memory hierarchy', 'memory organization', 'control unit',
            'status register', 'instruction decoding', 'assembly / data representation',
        )}, {'memory hierarchy': 5, 'memory organization': 5, 'control unit': 2,
             'status register': 3, 'instruction decoding': 2, 'assembly / data representation': 4})
