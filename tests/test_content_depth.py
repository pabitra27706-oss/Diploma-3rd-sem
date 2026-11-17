"""Phase 8 regression locks: coverage, print, practical pages, sheets, marks, verification.

Each test recomputes a number from the frozen data or the syllabus and compares
it with what the generated page / JSON claims. None of them certifies content:
they prove the page cannot drift from the data it is supposed to report.
"""

import hashlib
import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / 'scripts') not in sys.path:
    sys.path.insert(0, str(ROOT / 'scripts'))

from data_pipeline import load, stores  # noqa: E402
from build_coverage import describe_paper_totals  # noqa: E402
from build_verification import validate_register  # noqa: E402

SYLLABUS = load(ROOT / 'docs/syllabus/syllabus.json')
RAW_CODE_RE = re.compile(r'\bCST\d{3}\b|\bSI201\b')
RAW_QID_RE = re.compile(r'\bCST\d{3}-P\d{3}-Q\d+\b|\bP\d{3}-Q\d+\b')
SHIPPED = sorted(
    p for p in ROOT.rglob('*.html')
    if not (set(p.relative_to(ROOT).parts) & {'webflow', '.git', 'node_modules', 'docs', 'tests', 'scripts', 'assets'})
)


def visible_text(path: Path) -> str:
    """Text a learner reads: tags and every attribute removed."""
    raw = path.read_text(encoding='utf-8')
    raw = re.sub(r'<script\b.*?</script>', ' ', raw, flags=re.S | re.I)
    raw = re.sub(r'<style\b.*?</style>', ' ', raw, flags=re.S | re.I)
    raw = re.sub(r'<[a-zA-Z][^>]*>', ' ', raw)
    return re.sub(r'&[a-z]+;', ' ', raw)


def regenerate(script: str):
    subprocess.run([sys.executable, str(ROOT / 'scripts' / script)], check=True, capture_output=True)


class CoverageMapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load(ROOT / 'assets/data/coverage.json')
        cls.papers, cls.banks = stores()

    def test_coverage_file_is_reproducible(self):
        # The committed pages are generator output *plus* the shared head block
        # that scripts/generate_presence.py injects, so reproduction follows the
        # documented order (build -> presence) and leaves the tree unchanged.
        assets = [ROOT / 'assets/data/coverage.json', ROOT / 'coverage.html',
                  ROOT / 'exam-pattern.html', ROOT / 'courses.html',
                  ROOT / 'subjects/CST211/index.html', ROOT / 'subjects/SI201/index.html']
        before = [hashlib.sha256(p.read_bytes()).hexdigest() for p in assets]
        regenerate('build_coverage.py')
        data_once = (ROOT / 'assets/data/coverage.json').read_bytes()
        regenerate('build_coverage.py')
        self.assertEqual(data_once, (ROOT / 'assets/data/coverage.json').read_bytes(),
                         'coverage.json is not deterministic')
        # The documented order runs presence twice; a freshly generated page
        # needs the second pass to reach its stable byte layout.
        regenerate('generate_presence.py')
        regenerate('generate_presence.py')
        after = [hashlib.sha256(p.read_bytes()).hexdigest() for p in assets]
        self.assertEqual(before, after, 'build_coverage.py + presence is not reproducible')

    def test_every_declared_unit_is_listed_even_with_no_content(self):
        declared = {(s['code'], u['unit']) for s in SYLLABUS['subjects'] for u in s['units']}
        listed = {(row['subject'], row['unit']) for row in self.data['units'] if not row.get('outOfSyllabus')}
        self.assertEqual(declared - listed, set(), 'a declared unit is missing from the coverage map')
        # Nothing is silently dropped: units the syllabus does not declare appear too.
        out = {(row['subject'], row['unit']) for row in self.data['units'] if row.get('outOfSyllabus')}
        self.assertEqual(out, {('CST205', 5), ('CST209', 5)})

    def test_counts_equal_validate_syllabus_join(self):
        for row in self.data['units']:
            code, unit = row['subject'], row['unit']
            pyq = sum(1 for _, paper in self.papers if paper['subject'] == code
                      for q in paper['questions'] if q.get('unit') == unit)
            quiz = sum(len(bank['questions']) for _, bank in self.banks
                       if bank['subject'] == code and bank.get('unit') == unit)
            self.assertEqual(row['pyqCount'], pyq, f'{code} U{unit} PYQ count')
            self.assertEqual(row['quizCount'], quiz, f'{code} U{unit} quiz count')

    def test_syllabus_and_page_totals_are_counted(self):
        totals = self.data['syllabusTotals']
        self.assertEqual(totals['theoryCourses'], len(SYLLABUS['subjects']))
        self.assertEqual(totals['labs'], len(SYLLABUS['labs']))
        self.assertEqual(totals['internships'], 1)
        self.assertEqual(totals['declaredUnits'], sum(len(s['units']) for s in SYLLABUS['subjects']))
        pages = self.data['pageTotals']
        self.assertEqual(pages['theoryHubs'], 5)
        self.assertEqual(pages['labPages'], 3)
        self.assertEqual(pages['internshipPages'], 1)

    def test_unit_one_skew_is_reported_not_hidden(self):
        total = sum(row['total'] for row in self.data['skew'])
        self.assertEqual(total, sum(len(p['questions']) for _, p in self.papers))
        for row in self.data['skew']:
            self.assertEqual(row['unit1'], row['byUnit'].get('1', 0))
            self.assertAlmostEqual(row['unit1Share'], row['unit1'] / row['total'], places=4)
        # The page must name the skew and explain it, not just print a percentage.
        text = visible_text(ROOT / 'coverage.html')
        self.assertIn('Unit-1', text)
        self.assertIn('June-2022', text)

    def test_page_numbers_equal_the_json(self):
        text = visible_text(ROOT / 'coverage.html')
        verification = self.data['verification']
        self.assertIn(f'{verification["totalPyq"]}', text)
        self.assertIn(f'Certified answers: {verification["certified"]}', text)
        self.assertEqual(verification['totalPyq'], sum(len(p['questions']) for _, p in self.papers))
        self.assertEqual(verification['certified'], 0, 'nothing is certified without an owner sign-off batch')

    def test_new_pages_print_no_raw_course_code_or_question_id(self):
        for name in ('coverage.html', 'exam-pattern.html', 'courses.html', 'revision/index.html',
                     'subjects/CST211/index.html', 'subjects/CST213/index.html',
                     'subjects/CST215/index.html', 'subjects/SI201/index.html'):
            text = visible_text(ROOT / name)
            self.assertIsNone(RAW_CODE_RE.search(text), f'{name} prints a raw course code')
            self.assertIsNone(RAW_QID_RE.search(text), f'{name} prints a raw question id')

    def test_quiz_bank_reversal_is_disclosed_on_both_units(self):
        rows = {row['unit']: row for row in self.data['units'] if row['subject'] == 'CST201'}
        for unit in (3, 4):
            self.assertTrue(any('reversed' in flag for flag in rows[unit]['flags']), f'CST201 U{unit}')
            self.assertNotEqual(rows[unit]['quizCount'], rows[unit]['quizCountSyllabusUnit'])
        # The counts must be swaps of each other, not invented numbers.
        self.assertEqual(rows[3]['quizCountSyllabusUnit'], rows[4]['quizCount'])
        self.assertEqual(rows[4]['quizCountSyllabusUnit'], rows[3]['quizCount'])


class PracticalPagesTests(unittest.TestCase):
    def test_every_lab_and_the_internship_has_a_page_citing_its_syllabus_page(self):
        for lab in SYLLABUS['labs']:
            page = ROOT / f'subjects/{lab["code"]}/index.html'
            self.assertTrue(page.is_file(), f'{lab["code"]} has no page')
            html = page.read_text(encoding='utf-8')
            self.assertIn(f'#page={lab["page"]}', html, f'{lab["code"]} does not cite its syllabus page')
            for area in lab['practicalAreas']:
                self.assertIn(area, html, f'{lab["code"]} omits a listed practical area')
        internship = SYLLABUS['internship']
        page = ROOT / f'subjects/{internship["code"]}/index.html'
        self.assertTrue(page.is_file())
        self.assertIn(f'#page={internship["page"]}', page.read_text(encoding='utf-8'))

    def test_no_completed_lab_solution_is_claimed(self):
        for lab in SYLLABUS['labs']:
            text = visible_text(ROOT / f'subjects/{lab["code"]}/index.html').lower()
            self.assertIn('not completed solutions', text.replace('nothing here is a completed solution', 'not completed solutions'))
            for banned in ('solution code', 'expected output:', 'answer key'):
                self.assertNotIn(banned, text)

    def test_practical_courses_are_linked_from_the_course_list(self):
        text = visible_text(ROOT / 'courses.html')
        for lab in SYLLABUS['labs']:
            self.assertIn(lab['title'], text)
            self.assertIn('(practical)', text)
        self.assertIn(SYLLABUS['internship']['title'], text)
        self.assertIn('internship', text.lower())


class ExamPatternTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load(ROOT / 'assets/data/coverage.json')
        cls.papers, _ = stores()

    def test_ese_table_sums_to_the_declared_total(self):
        ese = SYLLABUS['assessment']['esePattern']
        self.assertEqual(sum(item['marks'] for item in ese), SYLLABUS['assessment']['endSemester'])
        self.assertEqual(sum(item['toAnswer'] * 1 for item in ese[:3]), 30)
        text = visible_text(ROOT / 'exam-pattern.html')
        self.assertIn('The five rows total', text)
        self.assertIn(str(SYLLABUS['assessment']['endSemester']), text)

    def test_every_paper_total_reconciles_with_its_own_quotas(self):
        rows = {row['fileName']: row for row in self.data['paperTotals']}
        for path, paper in self.papers:
            recomputed = describe_paper_totals(paper)
            self.assertEqual(rows[path.name]['obtainable'], recomputed['obtainable'])
            self.assertEqual(recomputed['obtainable'], paper['fullMarks'],
                             f'{path.name}: printed maximum is not supported by its printed quotas')
            self.assertTrue(rows[path.name]['reconciled'])
            self.assertGreater(recomputed['setMarks'], recomputed['obtainable'],
                               'all set questions must exceed the answerable total, which is the explanation')

    def test_page_does_not_claim_a_total_the_data_cannot_support(self):
        text = visible_text(ROOT / 'exam-pattern.html')
        self.assertIn('28 of 28', text)
        self.assertIn('no marking scheme', text.lower())
        self.assertIn('ask your institution', text.lower())
        self.assertNotIn('unverified overall total', text.lower())


class PrintTests(unittest.TestCase):
    def test_every_shipped_page_loads_the_print_sheet(self):
        # Phase 9.2 merged print.css into the one global base sheet so a page
        # makes two fewer requests; the print rules still ship on every page.
        missing = [p.relative_to(ROOT).as_posix() for p in SHIPPED
                   if 'assets/css/base.css' not in p.read_text(encoding='utf-8')]
        self.assertEqual(missing, [])
        self.assertEqual(len(SHIPPED), 74)
        self.assertFalse((ROOT / 'assets/css/print.css').exists(),
                         'print.css must stay merged into base.css')

    def test_print_sheet_hides_chrome_and_keeps_content_breaks(self):
        css = (ROOT / 'assets/css/base.css').read_text(encoding='utf-8')
        for rule in ('@page', 'background:white', 'a[href^="http"]::after',
                     'break-inside:avoid', 'break-before:page', '.print-page-btn'):
            self.assertIn(rule, css.replace(' ', ''), rule)
        self.assertIn('nav,', css)
        # Page <header> must not be hidden: the unit h1 lives inside it.
        self.assertNotRegex(css, r'nav,header,footer,button')

    def test_paper_print_can_leave_answers_out_and_starts_them_on_a_new_page(self):
        source = (ROOT / 'pyq/js/answers.js').read_text(encoding='utf-8')
        self.assertIn('printIncludeAnswers', source)
        self.assertIn('print-answers-section', source)
        html = (ROOT / 'pyq/answers.html').read_text(encoding='utf-8')
        self.assertIn('id="printIncludeAnswers"', html)
        self.assertIn('for="printIncludeAnswers"', html, 'the toggle must stay labelled')
        # A question sheet must not leak the key through option markers: the
        # marker survives elsewhere in the page, so check the print builder only.
        start = source.index('function printAnswerBody')
        end = source.index('// ═══', start)
        self.assertNotIn('[Correct]', source[start:end])

    def test_shared_print_control_is_labelled_and_never_duplicated(self):
        source = (ROOT / 'assets/js/accessibility.js').read_text(encoding='utf-8')
        self.assertIn('print-page-btn', source)
        self.assertIn('Print this page', source)
        self.assertIn('#printAllBtn', source, 'the PYQ answer page owns its own print flow')


class RevisionSheetTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load(ROOT / 'assets/data/revision-sheets.json')
        cls.topics = {s['code']: {u['unit']: u['topics'] for u in s['units']} for s in SYLLABUS['subjects']}
        cls.pages = {s['code']: s['page'] for s in SYLLABUS['subjects']}

    def test_every_entry_cites_a_verbatim_syllabus_topic(self):
        for code in self.pages:
            source = load(ROOT / f'docs/revision-sheets/{code}.json')
            for entry in source['entries']:
                unit = entry['unit']
                self.assertIn(unit, self.topics[code], f'{entry["id"]} cites an undeclared unit')
                hits = [t for t in self.topics[code][unit] if entry['citationQuote'] in t]
                self.assertTrue(hits, f'{entry["id"]} citation is not verbatim for {code} U{unit}')
                self.assertEqual(entry['syllabusPage'], self.pages[code], entry['id'])

    def test_formulas_carry_a_symbol_legend(self):
        formulas = 0
        for code in self.pages:
            for entry in load(ROOT / f'docs/revision-sheets/{code}.json')['entries']:
                if entry['kind'] != 'formula':
                    continue
                formulas += 1
                self.assertTrue(entry.get('formula'), entry['id'])
                self.assertTrue(entry.get('symbols'), f'{entry["id"]} has no symbol legend')
                self.assertTrue(all(s.get('symbol') and s.get('meaning') for s in entry['symbols']))
        self.assertEqual(formulas, self.data['totals']['formulas'])

    def test_sheets_are_reproducible(self):
        assets = sorted((ROOT / 'revision').glob('*.html')) + [ROOT / 'assets/data/revision-sheets.json']
        before = [hashlib.sha256(p.read_bytes()).hexdigest() for p in assets]
        regenerate('build_revision_sheets.py')
        regenerate('generate_presence.py')
        regenerate('generate_presence.py')
        after = [hashlib.sha256(p.read_bytes()).hexdigest() for p in assets]
        self.assertEqual(before, after, 'revision sheets are not reproducible')

    def test_counts_are_derived_and_nothing_is_certified(self):
        totals = self.data['totals']
        self.assertEqual(totals['verified'], 0, 'no entry may be certified without an owner sign-off')
        self.assertEqual(totals['unverified'], totals['entries'])
        self.assertEqual(totals['entries'], sum(row['entryCount'] for row in self.data['subjects']))
        self.assertEqual(totals['formulas'], sum(row['formulaCount'] for row in self.data['subjects']))
        index_text = visible_text(ROOT / 'revision/index.html')
        self.assertIn(f'{totals["entries"]} entries', index_text)
        self.assertIn(f'{totals["verified"]}', index_text)

    def test_sheets_are_not_linked_from_site_navigation(self):
        navs = []
        for page in SHIPPED:
            raw = page.read_text(encoding='utf-8')
            for match in re.finditer(r'<nav\b.*?</nav>', raw, re.S | re.I):
                navs.append((page.relative_to(ROOT).as_posix(), match.group(0)))
        offenders = [name for name, nav in navs if 'revision/' in nav]
        self.assertEqual(offenders, [], 'revision sheets must not be in navigation before sign-off')

    def test_every_sheet_prints_its_unverified_banner(self):
        for code in self.pages:
            text = visible_text(ROOT / f'revision/{code}.html')
            self.assertIn('Draft sheet', text)
            self.assertIn('0 of', text)
            self.assertIn('owner-verified', text)


class VerificationWorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = load(ROOT / 'assets/data/verification.json')
        cls.register = load(ROOT / 'docs/data/answer-verification.json')
        cls.papers, cls.banks = stores()

    def test_counts_are_derived_from_the_frozen_records(self):
        papers, banks = self.papers, self.banks
        records = [q for _, paper in papers for q in paper['questions']]
        totals = self.data['totals']
        self.assertEqual(totals['records'], len(records))
        self.assertEqual(totals['certified'], 0)
        self.assertEqual(totals['notCertified'], len(records))
        self.assertEqual(totals['withSourcePage'], sum(1 for q in records if q.get('sourcePage')))
        self.assertEqual(totals['withVerifiedOn'], sum(1 for q in records if q.get('verifiedOn')))
        self.assertEqual(totals['quizItems'], sum(len(b['questions']) for _, b in banks))
        self.assertEqual(totals['quizKeyed'], sum(1 for _, b in banks for q in b['questions'] if q.get('correct')))
        self.assertEqual(len(self.data['papers']), len(papers))
        self.assertEqual(sum(row['records'] for row in self.data['papers']), len(records))

    def test_per_subject_totals_match_the_coverage_provenance(self):
        coverage = load(ROOT / 'assets/data/coverage.json')
        provenance = {row['subject']: row for row in coverage['provenance']}
        for row in self.data['subjects']:
            self.assertEqual(row['records'], provenance[row['subject']]['rawQuestions'])
            self.assertEqual(row['certified'], provenance[row['subject']]['certifiedAnswers'])

    def test_register_refuses_an_uncited_batch(self):
        known = {q['id'] for _, paper in self.papers for q in paper['questions']}
        bad = [
            ({'batches': [{'id': 'b1', 'targets': [sorted(known)[0]], 'verifiedOn': '2026-11-17'}]}, 'no citation'),
            ({'batches': [{'id': 'b2', 'targets': [sorted(known)[0]], 'citation': 'class note'}]}, 'not an ISO date'),
            ({'batches': [{'id': 'b3', 'targets': ['CST201-P999-Q1'], 'citation': 'x',
                           'verifiedOn': '2026-11-17'}]}, 'unknown question id'),
            ({'batches': [{'id': 'b4', 'targets': sorted(known)[:41], 'citation': 'x',
                           'verifiedOn': '2026-11-17'}]}, 'exceeds the 40-item review batch limit'),
            ({'batches': [{'id': 'b5', 'targets': sorted(known)[:1], 'citation': 'x',
                           'verifiedOn': '2999-01-01'}]}, 'is in the future'),
        ]
        for register, needle in bad:
            problems, certified = validate_register(register, known)
            self.assertTrue(problems, f'accepted a bad register: {needle}')
            self.assertIn(needle, ' '.join(problems))
            self.assertEqual(certified, {}, 'a rejected register must certify nothing')

    def test_register_accepts_a_cited_batch_and_counts_it(self):
        known = {q['id'] for _, paper in self.papers for q in paper['questions']}
        target = sorted(known)[0]
        register = {'maxBatchSize': 40, 'batches': [{'id': 'phase8-demo', 'subject': target.split('-')[0],
                                                     'targets': [target], 'citation': 'syllabus p.3 + class note',
                                                     'verifiedOn': '2026-11-17', 'reviewer': 'owner'}]}
        problems, certified = validate_register(register, known)
        self.assertEqual(problems, [])
        self.assertIn(target, certified)
        self.assertEqual(certified[target]['verifiedOn'], '2026-11-17')

    def test_answers_page_shows_an_expandable_source_line(self):
        source = (ROOT / 'pyq/js/answers.js').read_text(encoding='utf-8')
        self.assertIn("createElement('details')", source)
        self.assertIn('not certified', source)
        self.assertIn('sourcePage', source)

    def test_coverage_page_publishes_the_unverified_counts(self):
        text = visible_text(ROOT / 'coverage.html')
        self.assertIn('Answer verification status', text)
        self.assertIn('Certified answers:', text)
        self.assertIn('not certified', text.lower())
        for row in self.data['subjects']:
            self.assertIn(row['subjectLabel'] if row['subjectLabel'] != 'C' else 'C', text)


if __name__ == '__main__':
    unittest.main()
