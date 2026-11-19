import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
import unittest
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / 'scripts') not in sys.path:
    sys.path.insert(0, str(ROOT / 'scripts'))


class _IdCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        if attr_map.get('id'):
            self.ids.add(attr_map['id'])


class DiscoveryTests(unittest.TestCase):
    def test_builders_idempotent_and_compact(self):
        files = sorted(
            list((ROOT / 'assets/search').glob('*.json'))
            + list((ROOT / 'assets/cards').glob('*.json'))
        )
        before = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
        for script in ('build_search_index.py', 'build_cards.py'):
            subprocess.run(['python3', str(ROOT / 'scripts' / script)], check=True, capture_output=True)
        after = {
            p: hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(
                list((ROOT / 'assets/search').glob('*.json'))
                + list((ROOT / 'assets/cards').glob('*.json'))
            )
        }
        self.assertEqual(before, after)

        manifest = json.loads((ROOT / 'assets/search/manifest.json').read_text(encoding='utf-8'))
        for subject, meta in manifest['subjects'].items():
            raw = (ROOT / 'assets/search' / meta['file']).read_bytes()
            self.assertEqual(meta['bytes'], len(raw), subject)
            self.assertEqual(meta['sha256'], hashlib.sha256(raw).hexdigest(), subject)
            self.assertEqual(meta['count'], len(json.loads(raw.decode('utf-8'))), subject)
            self.assertLessEqual(meta['bytes'], meta['sourceBytes'] * 0.4, subject)

        pages_meta = manifest['pages']
        pages_raw = (ROOT / 'assets/search' / pages_meta['file']).read_bytes()
        self.assertEqual(pages_meta['bytes'], len(pages_raw))
        self.assertEqual(pages_meta['sha256'], hashlib.sha256(pages_raw).hexdigest())
        self.assertEqual(pages_meta['count'], len(json.loads(pages_raw.decode('utf-8'))))
        self.assertLessEqual(pages_meta['bytes'], pages_meta['sourceBytes'] * 0.4, 'pages')

        rep_meta = manifest['repeated']
        rep_raw = (ROOT / 'assets/search' / rep_meta['file']).read_bytes()
        self.assertEqual(rep_meta['bytes'], len(rep_raw))
        self.assertEqual(rep_meta['sha256'], hashlib.sha256(rep_raw).hexdigest())

    def test_scope_partitions_all_shipped_html_and_anchors(self):
        manifest = json.loads((ROOT / 'assets/search/manifest.json').read_text(encoding='utf-8'))
        scope = manifest['scope']
        skip = {'webflow', '.git', 'node_modules', 'assets', 'docs', 'tests', 'scripts', '_data', '_quiz-data'}
        shipped = {
            p.relative_to(ROOT).as_posix()
            for p in ROOT.rglob('*.html')
            if not (set(p.relative_to(ROOT).parts) & skip)
        }
        self.assertEqual(scope['shippedHtmlPages'], len(shipped))

        # Collect actual indexed HTML file targets across subject unit entries + pages shard.
        indexed_unit_files = set()
        for meta in manifest['subjects'].values():
            for row in json.loads((ROOT / 'assets/search' / meta['file']).read_text(encoding='utf-8')):
                if row['type'] == 'unit':
                    indexed_unit_files.add(urlsplit(row['url']).path)
        indexed_info_files = {
            urlsplit(row['url']).path
            for row in json.loads((ROOT / 'assets/search' / manifest['pages']['file']).read_text(encoding='utf-8'))
        }
        self.assertEqual(len(indexed_unit_files), scope['unitPages'])
        self.assertEqual(len(indexed_unit_files), 24)
        self.assertEqual(len(indexed_info_files), scope['infoAndHubPages'])
        self.assertEqual(len(indexed_unit_files | indexed_info_files), scope['indexedHtmlPages'])

        excluded_map = scope['excludedPages']
        excluded = set()
        for group in ('dynamicShells', 'placeholders', 'fallbacks'):
            paths = set(excluded_map[group])
            self.assertFalse(excluded & paths, f'overlap in excluded {group}')
            excluded |= paths

        indexed = indexed_unit_files | indexed_info_files
        self.assertFalse(indexed & excluded, 'indexed and excluded pages must be disjoint')
        self.assertEqual(indexed | excluded, shipped, 'scope must partition 100% of shipped HTML pages')
        self.assertIn('section-note:*', json.dumps(scope['clientSideOnly']))
        self.assertEqual(scope['papers'], 28)
        self.assertEqual(scope['pyqQuestions'], 924)
        self.assertEqual(scope['quizQuestions'], 872)
        self.assertEqual(scope['missingQuizSubjects'], ['CST207'])

        # All unit content h2/h3 headings resolve to authored HTML anchors (never runtime section-N IDs).
        anchors = scope['headingAnchors']
        self.assertEqual(anchors['unitPageTopNoAnchor'], 24)
        self.assertEqual(anchors['unitDrawerChromeExcluded'], 24)
        self.assertEqual(anchors['unitAnchored'], 632)

    def test_every_search_entry_and_anchor_resolves(self):
        from data_pipeline import stores

        papers, banks = stores()
        paper_by_stem = {path.stem: paper for path, paper in papers}
        paper_q = {
            (path.parent.name, paper['paperCode'], q['id'])
            for path, paper in papers
            for q in paper['questions']
        }
        paper_q_by_stem = {
            (path.stem, q['id'])
            for path, paper in papers
            for q in paper['questions']
        }
        quiz_q = {
            (path.parent.name, q['id'])
            for path, bank in banks
            for q in bank['questions']
        }

        html_ids_cache = {}

        def ids_for(rel_path):
            if rel_path not in html_ids_cache:
                parser = _IdCollector()
                parser.feed((ROOT / rel_path).read_text(encoding='utf-8'))
                html_ids_cache[rel_path] = parser.ids
            return html_ids_cache[rel_path]

        manifest = json.loads((ROOT / 'assets/search/manifest.json').read_text(encoding='utf-8'))
        all_rows = []
        for subject, meta in manifest['subjects'].items():
            rows = json.loads((ROOT / 'assets/search' / meta['file']).read_text(encoding='utf-8'))
            for r in rows:
                row = dict(r, subject=subject)
                all_rows.append(row)
                if row['type'] == 'pyq':
                    self.assertIn((subject, row['paper'], row['id']), paper_q)
                    if row.get('paperId'):
                        self.assertIn(row['paperId'], paper_by_stem)
                        self.assertIn((row['paperId'], row['id']), paper_q_by_stem)
                elif row['type'] == 'quiz':
                    self.assertIn((subject, row['id']), quiz_q)
                elif row['type'] == 'unit':
                    parts = urlsplit(row['url'])
                    self.assertTrue((ROOT / parts.path).is_file(), row['url'])
                    if parts.fragment:
                        self.assertFalse(re.match(r'^section-\d+$', parts.fragment), row['url'])
                        self.assertIn(parts.fragment, ids_for(parts.path), row['url'])
                    else:
                        self.assertTrue(row.get('noAnchor'), f'unanchored unit row must record noAnchor: {row}')

        page_rows = json.loads((ROOT / 'assets/search' / manifest['pages']['file']).read_text(encoding='utf-8'))
        all_rows.extend(page_rows)
        for row in page_rows:
            self.assertEqual(row['type'], 'page')
            parts = urlsplit(row['url'])
            self.assertTrue((ROOT / parts.path).is_file(), row['url'])
            if parts.fragment:
                self.assertIn(parts.fragment, ids_for(parts.path), row['url'])
            else:
                self.assertTrue(row.get('noAnchor'), f'unanchored page row must record noAnchor: {row}')

        # Representative query 'dijkstra' reaches unit notes (with #anchor), PYQs, and quiz items.
        dijkstra = [r for r in all_rows if 'dijkstra' in r['text']]
        self.assertTrue(any(r['type'] == 'pyq' for r in dijkstra))
        self.assertTrue(any(r['type'] == 'quiz' for r in dijkstra))
        self.assertTrue(any(r['type'] == 'unit' and '#' in r.get('url', '') for r in dijkstra))

        # Representative informational queries reach newly indexed non-unit pages.
        for term, expected_path in (
            ('internship', 'subjects/SI201/index.html'),
            ('privacy', 'info/privacy-policy.html'),
            ('coverage', 'coverage.html'),
            ('leitner', 'cards.html'),
            ('credits', 'info/credits.html'),
            ('practical', 'subjects/CST211/index.html'),
        ):
            hits = [r for r in page_rows if term in r['text']]
            self.assertTrue(any(r['url'].startswith(expected_path) for r in hits), term)

    def test_repeats_and_cards_resolve(self):
        from data_pipeline import duplicates, stores

        papers, banks = stores()
        aliases, _, candidate_clusters = duplicates(papers)
        data = json.loads((ROOT / 'assets/search/repeated.json').read_text(encoding='utf-8'))

        # Exact alias invariants (28-paper / 924-PYQ tree: 1 exact group, 1 alias).
        self.assertEqual(data['aliasCount'], len(aliases))
        self.assertEqual(data['aliasCount'], 1)
        self.assertEqual(len(data['groups']), len(set(aliases.values())))
        self.assertEqual(sum(len(g['appearances']) - 1 for g in data['groups']), len(aliases))
        self.assertEqual(data['groups'][0]['canonical']['id'], 'CST203-P001-Q43')
        self.assertIn('CST203-P001-Q44', [a['id'] for a in data['groups'][0]['appearances']])

        # Normalized-text candidate cluster invariants (15 clusters, 32 records, never claimed verified).
        self.assertEqual(data['candidateCount'], len(candidate_clusters))
        self.assertEqual(data['candidateCount'], 15)
        self.assertEqual(len(data['candidates']), 15)
        self.assertEqual(data['candidateRecordCount'], 32)
        self.assertEqual(sum(len(c['appearances']) for c in data['candidates']), 32)
        self.assertIn('unverified candidate', data['candidateMethod'].lower())
        self.assertIn('not a confirmed duplicate', data['candidateMethod'].lower())

        expected_by_subject = {
            'CST201': (2, 5),
            'CST203': (3, 6),
            'CST205': (2, 4),
            'CST207': (4, 8),
            'CST209': (4, 9),
        }
        for code, (exp_clusters, exp_records) in expected_by_subject.items():
            sc = data['candidateSubjectCounts'][code]
            self.assertEqual((sc['clusters'], sc['records']), (exp_clusters, exp_records), code)

        paper_stems = {path.stem for path, _ in papers}
        lookup = {q['id']: q for _, paper in papers for q in paper['questions']}
        for collection, require_unverified in ((data['groups'], False), (data['candidates'], True)):
            for entry in collection:
                if require_unverified:
                    self.assertEqual(entry.get('status'), 'unverified-candidate')
                    self.assertIn('unverified candidate', entry.get('label', '').lower())
                for app in entry['appearances']:
                    self.assertIn(app['id'], lookup)
                    if app.get('paperId'):
                        self.assertIn(app['paperId'], paper_stems)
                    if app.get('url'):
                        parsed = urlsplit(app['url'])
                        self.assertEqual(parsed.path, 'pyq/answers.html')
                        qs = parse_qs(parsed.query)
                        self.assertEqual(qs.get('q'), [app['id']])

        lookup.update({q['id']: q for _, bank in banks for q in bank['questions']})
        for file in (ROOT / 'assets/cards').glob('CST*.json'):
            for card in json.loads(file.read_text(encoding='utf-8')):
                q = lookup[card['sourceId']]
                self.assertEqual(card['back'], q['answer'] if card['sourceType'] == 'pyq' else q['explanation'])

    def test_service_worker_caches_discovery_offline(self):
        sw = (ROOT / 'sw.js').read_text(encoding='utf-8')
        versions = re.findall(r"const VERSION = '([^']+)'", sw)
        self.assertEqual(len(versions), 1, 'worker must have one shell version')
        self.assertRegex(versions[0], r'^study-[a-z0-9-]+$')
        for name in ('index.html', 'search.html', 'today.html'):
            page = (ROOT / name).read_text(encoding='utf-8')
            self.assertIn(f'<meta name="app-build" content="{versions[0]}">', page,
                          f'{name} must report the worker shell version')
        for asset in (
            'search.html',
            'repeated.html',
            'coverage.html',
            'exam-pattern.html',
            'assets/css/discovery.css',
            'assets/js/discovery.js',
            'assets/js/unit-discovery.js',
            'assets/js/subject-labels.js',
            # Phase 7.3 UI language layer travels with the same worker; Phase 9.2
            # merged accessibility/i18n/pwa into one deferred shell bundle.
            'assets/js/shell.bundle.js',
            'assets/search/manifest.json',
            'assets/search/repeated.json',
            'assets/search/index-pages.json',
            # Phase 5 study shell travels with the same worker.
            'cards.html',
            'today.html',
            'assets/js/study-store.js',
            'assets/js/study-ui.js',
            'quiz/js/attempt-store.js',
            'assets/cards/manifest.json',
        ):
            self.assertIn(f"'{asset}'", sw, f'missing discovery precache entry: {asset}')
        self.assertIn('WARM_SEARCH', sw)
        self.assertIn('WARM_STUDY', sw)
        self.assertIn('warmStudyCards', sw)
        self.assertIn("if (isData && !key.searchParams.has('v'))", sw)


if __name__ == '__main__':
    unittest.main()
