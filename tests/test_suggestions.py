"""Phase 11: static guide coverage, provenance, routing and freshness."""
import json
import re
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import build_suggestions as guides
from site_config import SITE


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.starts = []
        self.times = []
        self.current_date = None
        self.text = (ROOT / path).read_text(encoding='utf-8')
        self.feed(self.text)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        self.starts.append((tag, attributes))
        if tag == 'time':
            self.current_date = attributes['datetime']
            self.current_session = ''

    def handle_data(self, data):
        if self.current_date is not None:
            self.current_session += data

    def handle_endtag(self, tag):
        if tag == 'time':
            self.times.append((self.current_date, self.current_session))
            self.current_date = None

    def elements(self, tag):
        return [attrs for element, attrs in self.starts if element == tag]

    def links(self):
        return [a['href'] for a in self.elements('a')]

    def with_class(self, tag, name):
        return [attrs for attrs in self.elements(tag) if name in attrs.get('class', '').split()]


def read_json(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))


class SuggestionsTests(unittest.TestCase):
    def test_outputs_match_the_generator(self):
        output = guides.build()
        actual = {p.relative_to(ROOT) for p in (ROOT / 'suggestions').rglob('*.html')}
        self.assertEqual(set(output), actual)
        self.assertEqual(len(output), 11)
        for path, html in output.items():
            with self.subTest(path=path):
                self.assertEqual((ROOT / path).read_text(encoding='utf-8'), html)

    def test_every_guide_is_linked_from_a_subject_disclosure(self):
        hub = Page(guides.HUB)
        details = hub.elements('details')
        self.assertEqual(len(details), 5)
        self.assertTrue(all(d.get('name') == 'suggestion-subjects' and 'open' not in d for d in details))
        self.assertEqual(len(hub.elements('summary')), len(details))
        destinations = [link for link in hub.links() if link.endswith(('easy-read.html', 'important-questions.html'))]
        self.assertEqual(sorted('suggestions/' + href for href in destinations), sorted(guides.guide_paths()))
        home = Page('index.html')
        links = [a['class'].split() for a in home.elements('a') if a['href'] == guides.HUB]
        self.assertEqual(len(links), 2)
        self.assertTrue(any('quick-card--suggestions' in classes for classes in links))
        self.assertTrue(any('menu-item' in classes for classes in links))

    def assert_archive_links(self, page, expected, archived, *, compact=False):
        cites = [urlsplit(url) for url in page.links() if url.startswith('../../pyq/answers.html?')]
        self.assertEqual(len(cites), len(expected))
        self.assertEqual(len(page.times), len(expected))
        for citation, shown_time, question_id in zip(cites, page.times, expected):
            paper_id, date, session, _ = archived[question_id]
            self.assertEqual(parse_qs(citation.query), {'paper': [paper_id], 'q': [question_id]})
            shown_session = f'{session[:3]} {date[:4]}' if compact else session
            self.assertEqual(shown_time, (date, shown_session))

    @staticmethod
    def archive(code):
        registry = read_json(f'_data/{code}/registry.json')['papers']
        archived = {}
        for entry in registry:
            paper = read_json(f"_data/{code}/{entry['fileName']}")
            date = f"{entry['year']:04d}-{entry['monthNumber']:02d}"
            for q in paper['questions']:
                archived[q['id']] = (Path(entry['fileName']).stem, date, entry['examSession'], q['marks'])
        return archived

    def test_question_patterns_are_ranked_and_cite_distinct_original_sessions(self):
        choices = read_json(guides.CURATION)
        for subject in read_json(guides.SYLLABUS)['subjects']:
            code = subject['code']
            slug = guides.SUBJECTS[code][0]
            with self.subTest(subject=code):
                page = Page(f'suggestions/{slug}/important-questions.html')
                self.assertTrue(page.with_class('main', 'suggestions-main--bank'))
                self.assertFalse(page.with_class('li', 'suggestions-step'))
                unit_links = [url for url in page.links() if url.startswith('#unit-')]
                self.assertEqual(unit_links, [f"#unit-{u['unit']}" for u in subject['units']])
                archived = self.archive(code)
                expected, counts = [], []
                for u in subject['units']:
                    items = choices[code]['units'][str(u['unit'])]['patterns']
                    self.assertGreaterEqual(len(items), 4)
                    for item in sorted(items, key=lambda item: -len(item['refs'])):
                        dates = [archived[ref][1] for ref in item['refs']]
                        self.assertEqual(len(set(dates)), len(dates))
                        self.assertGreaterEqual(len(dates), 1)
                        counts.append(len(dates))
                        expected.extend(sorted(item['refs'], key=lambda ref: archived[ref][1]))
                self.assertEqual([int(li['data-session-count']) for li in page.with_class('li', 'suggestions-pattern')], counts)
                self.assertEqual([span['aria-label'] for span in page.with_class('span', 'suggestions-stars') if span.get('role') == 'img'],
                                 [f'{min(n, 5)} out of 5 stars' for n in counts])
                self.assertEqual(page.text.count('1 cited session · no repeat cited'), counts.count(1))
                self.assertIn('not necessarily exact repeats', page.text)
                self.assert_archive_links(page, expected, archived, compact=code == 'CST209')

    def test_easy_read_prioritizes_quick_wins_with_dated_paper_examples(self):
        choices = read_json(guides.CURATION)
        for code, (slug, _, _) in guides.SUBJECTS.items():
            with self.subTest(subject=code):
                easy = Page(f'suggestions/{slug}/easy-read.html')
                important = Page(f'suggestions/{slug}/important-questions.html')
                order = choices[code]['studyOrder']
                units = choices[code]['units']
                self.assertNotEqual(order, sorted(order))
                self.assertEqual(units[str(order[0])]['effort'], 'quick')
                self.assertTrue(easy.with_class('main', 'suggestions-main--easy'))
                self.assertFalse(easy.with_class('li', 'suggestions-pattern'))
                self.assertEqual(len(easy.with_class('li', 'suggestions-step--first')), 1)
                self.assertIn('Last-minute checklist</h2>', easy.text)
                self.assertIn('Marks are for the whole linked question', easy.text)
                if code == 'CST209':
                    self.assertEqual(easy.text.count('<strong>Try it</strong>'), len(order))
                    self.assertEqual(easy.text.count('<strong>Why first?</strong>'), 1)
                    self.assertEqual(easy.text.count('<strong>Why here?</strong>'), len(order) - 1)
                else:
                    self.assertEqual(easy.text.count('<strong>Try it:</strong>'), len(order))
                    self.assertEqual(easy.text.count('<strong>Why here:</strong>'), len(order))
                self.assertEqual([a for a in easy.links() if a.startswith('#step-unit-')],
                                 [f'#step-unit-{unit}' for unit in order])
                self.assertEqual([div['id'] for div in easy.with_class('div', 'suggestions-step-heading')],
                                 [f'step-unit-{unit}' for unit in order])
                self.assertEqual([href for href in easy.links() if href.startswith('important-questions.html#')],
                                 [f'important-questions.html#unit-{unit}' for unit in order])
                archived = self.archive(code)
                expected = []
                for unit in order:
                    self.assertIn(f'unit-{unit}', {h['id'] for h in important.elements('h2') if 'id' in h})
                    notes = f'subjects/{code}/units/unit-{unit}.html'
                    self.assertIn('../../' + notes, easy.links())
                    self.assertTrue((ROOT / notes).is_file())
                    item = units[str(unit)]
                    ids = [ex['id'] for ex in item['examples']]
                    self.assertEqual(len(ids), 2)
                    self.assertEqual(len({archived[ident][1] for ident in ids}), 2)
                    self.assertLessEqual(set(ids), {ref for p in item['patterns'] for ref in p['refs']})
                    expected.extend(ids)
                self.assert_archive_links(easy, expected, archived)
                self.assertEqual([int(n) for n in re.findall(r"· (\d+) marks? total", easy.text)],
                                 [archived[ident][3] for ident in expected])

    def test_workbook_and_priority_table_are_algorithms_only(self):
        for path, code in guides.guide_paths().items():
            with self.subTest(path=path):
                page = Page(path)
                self.assertEqual(bool(page.with_class('main', 'suggestions-workbook')),
                                 code == 'CST209' and path.endswith('important-questions.html'))
                self.assertEqual(bool(page.with_class('table', 'suggestions-priority-table')),
                                 code == 'CST209' and path.endswith('easy-read.html'))
        bank = Page('suggestions/algorithms/important-questions.html')
        easy = Page('suggestions/algorithms/easy-read.html')
        short_titles = ['Fundamentals', 'Sorting', 'Searching', 'Graphs']
        for unit, title in enumerate(short_titles, 1):
            self.assertIn(f'<a href="#unit-{unit}"><span>Unit {unit}</span> {title}</a>', bank.text)
        cards = bank.with_class('li', 'suggestions-workbook-fact')
        self.assertEqual(len(cards), 13)
        self.assertEqual(len(bank.with_class('p', 'suggestions-workbook-example')), len(cards))
        self.assertEqual(len(bank.with_class('aside', 'suggestions-workbook-reference')), 4)
        self.assertEqual(len(bank.with_class('span', 'suggestions-workbook-number')), 20)
        self.assertIn('7 mod 5 = 12 mod 5 = 2', bank.text)
        self.assertEqual(len(bank.with_class('span', 'suggestions-workbook-source')), 75)
        self.assertEqual([href for href in easy.links() if href.startswith('#step-unit-')],
                         ['#step-unit-3', '#step-unit-2', '#step-unit-1', '#step-unit-4'])
        self.assertEqual([th['role'] for th in easy.elements('th') if th.get('scope') == 'col'],
                         ['columnheader'] * 4)
        self.assertEqual([th['role'] for th in easy.elements('th') if th.get('scope') == 'row'],
                         ['rowheader'] * 4)
        self.assertIn('Find 7 in [1, 3, 5, 7, 9]', easy.text)
        self.assertLess(easy.text.index('</table>'), easy.text.index('Find 7 in'))
        self.assertEqual(easy.times[:2], [('2024-01', 'January 2024'), ('2023-03', 'March 2023')])

    def test_discovery_and_presence_include_all_suggestions_pages(self):
        expected = {guides.HUB: None, **guides.guide_paths()}
        pages = read_json('assets/search/index-pages.json')
        indexed = {row['url']: row.get('subject') for row in pages if row['category'] == 'Suggestions' and '#' not in row['url']}
        self.assertEqual(indexed, expected)
        sitemap = ElementTree.parse(ROOT / 'sitemap.xml')
        urls = {loc.text for loc in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
        for path in expected:
            self.assertIn(SITE + path, urls)
            self.assertNotIn('noindex', Page(path).text)

    def test_invalid_editorial_changes_fail_closed(self):
        def unit_one(c):
            return c['CST201']['units']['1']

        mutations = (
            (lambda c: unit_one(c)['patterns'][0]['refs'].append('CST203-P006-Q18'), 'unknown archived question'),
            # Different questions from March 2021 must not count as two appearances.
            (lambda c: unit_one(c)['patterns'][0]['refs'].append('CST201-P001-Q7'), 'more than one citation for March 2021'),
            (lambda c: unit_one(c)['patterns'][0].update(refs=[]), 'cite at least one archived question'),
            (lambda c: unit_one(c)['patterns'].pop(), 'expected at least 4 question patterns'),
            (lambda c: unit_one(c)['patterns'].append(unit_one(c)['patterns'][0]), 'duplicate pattern title'),
            (lambda c: unit_one(c)['examples'][1].update(id='CST201-P006-Q22'), 'Easy Read examples must appear in this unit'),
            (lambda c: unit_one(c).update(effort='unclassified'), 'unknown preparation effort'),
            (lambda c: c['CST201'].update(studyOrder=[1, 2, 3, 4, 4]), 'cover the syllabus once each'),
            (lambda c: c['CST209']['units']['3']['quickReference'].pop(), 'at least three quick-reference examples'),
            (lambda c: c['CST209']['units']['3']['quickReference'][0].update(example=' '), 'worked example: expected non-empty text'),
            (lambda c: c['CST209']['units']['3'].update(firstPractice=' '), 'first practice: expected non-empty text'),
        )
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / 'curation.json'
            for mutate, message in mutations:
                with self.subTest(message=message):
                    choices = read_json(guides.CURATION)
                    mutate(choices)
                    target.write_text(json.dumps(choices), encoding='utf-8')
                    with patch.object(guides, 'CURATION', target), self.assertRaisesRegex(ValueError, message):
                        guides.build()


if __name__ == '__main__':
    unittest.main()
