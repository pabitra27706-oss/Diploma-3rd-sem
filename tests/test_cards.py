"""Phase 5.1 card-eligibility gate: deterministic, source-preserving cards.

Every assertion here reads the committed archive and the committed card output;
nothing is regenerated with new content. Cards may only copy a stored model
answer or an existing keyed MCQ explanation — this suite proves that, the skip
accounting, the per-unit report, and byte-identical regeneration.
"""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / 'scripts') not in sys.path:
    sys.path.insert(0, str(ROOT / 'scripts'))

RAW_CODE_RE = re.compile(r'\b(?:CST\d{3}|SI201)\b')
RAW_QID_RE = re.compile(r'\bCST\d{3}-(?:P\d{3}-|U\d+-)?Q\d+\b')
VERIFICATION_CODES = {'model-answer-not-certified', 'keyed-explanation-unverified-mapping'}


def load_cards():
    manifest = json.loads((ROOT / 'assets/cards/manifest.json').read_text(encoding='utf-8'))
    cards = {}
    for code, meta in manifest['subjects'].items():
        rows = json.loads((ROOT / 'assets/cards' / meta['file']).read_text(encoding='utf-8'))
        cards[code] = rows
    return manifest, cards


class CardEligibilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from data_pipeline import duplicates, stores
        cls.papers, cls.banks = stores()
        cls.aliases, _, _ = duplicates(cls.papers)
        cls.paper_questions = {q['id']: q for _, paper in cls.papers for q in paper['questions']}
        cls.bank_questions = {q['id']: (bank, q) for _, bank in cls.banks for q in bank['questions']}
        cls.manifest, cls.cards = load_cards()
        cls.all_cards = [card for rows in cls.cards.values() for card in rows]

    def test_every_card_copies_an_eligible_source_verbatim(self):
        self.assertTrue(self.all_cards)
        for card in self.all_cards:
            self.assertIn(card['verification'], VERIFICATION_CODES, card['id'])
            self.assertTrue(card['front'].strip(), card['id'])
            self.assertTrue(card['back'].strip(), card['id'])
            # A card without a visible citation is a defect.
            self.assertTrue(card['citation'], card['id'])
            self.assertTrue(card['citationLabel'], card['id'])
            self.assertIn(card['sourceId'], self.paper_questions | self.bank_questions, card['id'])
            if card['sourceType'] == 'pyq':
                source = self.paper_questions[card['sourceId']]
                self.assertEqual(source.get('answerStatus'), 'model-answer', card['id'])
                self.assertNotIn(card['sourceId'], self.aliases, card['id'])
                self.assertEqual(card['back'], source['answer'], card['id'])
                self.assertEqual(card['front'], source['question'].strip(), card['id'])
                self.assertTrue(card['paperId'], card['id'])
            else:
                bank, source = self.bank_questions[card['sourceId']]
                self.assertEqual(source.get('type'), 'mcq', card['id'])
                self.assertIn(source['correct'], source['options'], card['id'])
                self.assertTrue(source.get('explanation'), card['id'])
                self.assertEqual(card['back'], source['explanation'], card['id'])
                self.assertTrue(card['citationLabel'].startswith('Quiz bank'), card['id'])
            self.assertEqual(card['verification'], 'model-answer-not-certified'
                             if card['sourceType'] == 'pyq' else 'keyed-explanation-unverified-mapping')
            self.assertEqual(card['unit'] is None, False, card['id'])

    def test_citation_labels_never_print_internal_identifiers(self):
        for card in self.all_cards:
            self.assertNotRegex(card['citationLabel'], RAW_CODE_RE, card['id'])
            self.assertNotRegex(card['citationLabel'], RAW_QID_RE, card['id'])
        for code, meta in self.manifest['subjects'].items():
            self.assertNotRegex(meta['subjectLabel'], RAW_CODE_RE, code)
            self.assertEqual(meta['subjectLabel'], {'CST201': 'C', 'CST203': 'Python', 'CST205': 'DS',
                                                    'CST207': 'CSO', 'CST209': 'Algorithms'}[code])

    def test_skip_accounting_is_explicit_and_complete(self):
        totals = self.manifest['totals']
        self.assertEqual(totals['cards'], len(self.all_cards))
        self.assertEqual(totals['cards'], totals['fromPyq'] + totals['fromQuiz'])
        # The frozen archive: 924 raw PYQs, 1 exact alias, all unique PYQs keyed as
        # model answers; 872 quiz items of which 416 are keyed MCQs.
        self.assertEqual(totals['fromPyq'], 923)
        self.assertEqual(totals['fromQuiz'], 416)
        self.assertEqual(totals['cards'], 1339)
        self.assertEqual(self.manifest['skippedReasons'].get('alias'), 1)
        self.assertEqual(self.manifest['skippedReasons'].get('quiz-not-mcq'), 456)
        self.assertEqual(totals['skipped'], 457)
        # CST207 has no quiz bank: its cards are previous-year questions only.
        self.assertEqual(self.manifest['subjects']['CST207']['sources']['quiz'], 0)
        self.assertEqual(self.manifest['subjects']['CST207']['sources']['pyq'], 195)
        self.assertTrue(any('CST207' in note and 'no quiz bank' in note for note in self.manifest['notes']))
        self.assertTrue(any('456' in note for note in self.manifest['notes']))
        self.assertNotIn('quiz-not-mcq', self.manifest['subjects']['CST207'].get('skippedReasons', {}))
        for code, meta in self.manifest['subjects'].items():
            self.assertEqual(sum(meta['skippedReasons'].values()), meta['skipped'], code)
            self.assertEqual(meta['count'], len(self.cards[code]), code)

    def test_per_unit_counts_match_the_cards_and_the_report(self):
        for code, meta in self.manifest['subjects'].items():
            self.assertEqual(sum(meta['units'].values()), meta['count'], code)
            seen = {}
            for card in self.cards[code]:
                key = str(card['unit'])
                seen[key] = seen.get(key, 0) + 1
            self.assertEqual(seen, meta['units'], code)
        report = (ROOT / 'docs/data/cards.md').read_text(encoding='utf-8')
        self.assertIn('## Cards per subject and unit', report)
        self.assertIn('## Skipped items and why', report)
        for code, meta in self.manifest['subjects'].items():
            for unit, count in meta['units'].items():
                self.assertIn(f"| {meta['subjectLabel']} | {unit} | {count} |", report, f'{code} unit {unit}')
        self.assertIn('456', report)
        self.assertIn('not newly verified facts', report)

    def test_regeneration_is_byte_identical(self):
        def snapshot():
            files = sorted((ROOT / 'assets/cards').glob('*.json')) + [ROOT / 'docs/data/cards.md']
            return {path: hashlib.sha256(path.read_bytes()).hexdigest() for path in files}

        before = snapshot()
        result = subprocess.run([sys.executable, str(ROOT / 'scripts/build_cards.py')],
                                check=True, capture_output=True, text=True)
        self.assertIn('1339 created', result.stdout)
        self.assertIn('457 skipped', result.stdout)
        self.assertEqual(before, snapshot())

    def test_manifest_is_compact_and_self_describing(self):
        for path in (ROOT / 'assets/cards').glob('CST*.json'):
            raw = path.read_bytes()
            self.assertTrue(raw.endswith(b'\n'), path.name)
            self.assertNotIn(b'\n ', raw, f'{path.name} must stay minified (no indentation)')
            parsed = json.loads(raw.decode('utf-8'))
            self.assertEqual(parsed, sorted(parsed, key=lambda card: card['id']), f'{path.name} must be id-ordered')
            self.assertLess(len(raw), 420_000, f'{path.name} on-demand subject shard must stay compact (<420 KB)')
        total = sum(len((ROOT / 'assets/cards' / meta['file']).read_bytes())
                    for meta in self.manifest['subjects'].values())
        # Phase 18 Mode B expands PYQ model answers (mirrored verbatim into card['back']);
        # each subject shard is fetched lazily one-at-a-time (<420 KB) with a <1.85 MB 5-shard ceiling.
        self.assertLess(total, 1_850_000, 'card shards must stay a compact checked-in payload')
        for code, note in self.manifest['verificationNotes'].items():
            self.assertIn(code, VERIFICATION_CODES)
            self.assertTrue(note)


if __name__ == '__main__':
    unittest.main()
