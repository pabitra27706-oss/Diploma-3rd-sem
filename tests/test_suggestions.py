"""Phase 11: static guide coverage, provenance, routing and freshness."""
import json
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

    def test_each_question_cites_the_expected_archived_record(self):
        subjects = read_json(guides.SYLLABUS)['subjects']
        choices = read_json(guides.CURATION)
        for subject in subjects:
            code = subject['code']
            slug = guides.SUBJECTS[code][0]
            with self.subTest(subject=code):
                page = Page(f'suggestions/{slug}/important-questions.html')
                unit_links = [url for url in page.links() if url.startswith('#unit-')]
                self.assertEqual(unit_links, [f"#unit-{u['unit']}" for u in subject['units']])
                expected = [pick['id'] for u in subject['units'] for pick in choices[code]['units'][str(u['unit'])]['questions']]
                self.assertEqual(len(set(expected)), len(expected))
                registry = read_json(f'_data/{code}/registry.json')['papers']
                archived = {}
                for entry in registry:
                    paper = read_json(f"_data/{code}/{entry['fileName']}")
                    for q in paper['questions']:
                        date = f"{entry['year']:04d}-{entry['monthNumber']:02d}"
                        archived[q['id']] = (Path(entry['fileName']).stem, date, entry['examSession'])
                cites = [urlsplit(url) for url in page.links() if url.startswith('../../pyq/answers.html?')]
                self.assertEqual(len(cites), len(expected))
                self.assertEqual(len(page.times), len(expected))
                for citation, shown_time, question_id in zip(cites, page.times, expected):
                    paper_id, date, session = archived[question_id]
                    self.assertEqual(parse_qs(citation.query), {'paper': [paper_id], 'q': [question_id]})
                    self.assertEqual(shown_time, (date, session))

    def test_easy_read_links_each_step_to_the_corresponding_unit(self):
        choices = read_json(guides.CURATION)
        for code, (slug, _, _) in guides.SUBJECTS.items():
            with self.subTest(subject=code):
                easy = Page(f'suggestions/{slug}/easy-read.html')
                important = Page(f'suggestions/{slug}/important-questions.html')
                order = choices[code]['studyOrder']
                self.assertIn('Last-minute checklist</h2>', easy.text)
                self.assertEqual(easy.text.count('<strong>Try it:</strong>'), len(order))
                jump_links = [href for href in easy.links() if href.startswith('important-questions.html#')]
                self.assertEqual(jump_links, [f'important-questions.html#unit-{unit}' for unit in order])
                for unit in order:
                    self.assertIn(f'unit-{unit}', {h['id'] for h in important.elements('h2')})
                    notes = f'subjects/{code}/units/unit-{unit}.html'
                    self.assertIn('../../' + notes, easy.links())
                    self.assertTrue((ROOT / notes).is_file())

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
        mutations = (
            (lambda c: c['CST201']['units']['1']['questions'][0].update(id='CST203-P006-Q18'), 'unknown archived question'),
            (lambda c: c['CST201']['units']['1']['questions'].append(c['CST201']['units']['1']['questions'][0]), 'duplicate selection'),
            (lambda c: c['CST201'].update(studyOrder=[1, 2, 3, 4, 4]), 'cover the syllabus once each'),
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
