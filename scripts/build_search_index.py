#!/usr/bin/env python3
"""Read-only, deterministic discovery sidecars. Never edits authoritative sources."""
import hashlib
import json
import re
import unicodedata
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode, urlsplit
from data_pipeline import ROOT, stores, duplicates, load, generic_topic, normal

INDEXED_INFO_PAGES = {
    # Theory subject overview hubs (5)
    'subjects/CST201/index.html': {'category': 'Subject overview', 'subject': 'CST201'},
    'subjects/CST203/index.html': {'category': 'Subject overview', 'subject': 'CST203'},
    'subjects/CST205/index.html': {'category': 'Subject overview', 'subject': 'CST205'},
    'subjects/CST207/index.html': {'category': 'Subject overview', 'subject': 'CST207'},
    'subjects/CST209/index.html': {'category': 'Subject overview', 'subject': 'CST209'},
    # Practical lab & internship pages (4)
    'subjects/CST211/index.html': {'category': 'Practical course', 'subject': 'CST211', 'relatedSubject': 'CST201'},
    'subjects/CST213/index.html': {'category': 'Practical course', 'subject': 'CST213', 'relatedSubject': 'CST203'},
    'subjects/CST215/index.html': {'category': 'Practical course', 'subject': 'CST215', 'relatedSubject': 'CST205'},
    'subjects/SI201/index.html': {'category': 'Internship', 'subject': 'SI201'},
    # Syllabus & exam reference pages (3)
    'coverage.html': {'category': 'Syllabus & coverage'},
    'exam-pattern.html': {'category': 'Syllabus & coverage'},
    'courses.html': {'category': 'Syllabus & coverage'},
    # Study tool & schedule pages (5)
    'cards.html': {'category': 'Study tool'},
    'repeated.html': {'category': 'Study tool'},
    'roadmap/index.html': {'category': 'Study tool'},
    'settings.html': {'category': 'Study tool'},
    'today.html': {'category': 'Study tool'},
    # Site information, privacy, legal & support pages (9)
    'info/about.html': {'category': 'Site guide & policy'},
    'info/contact-support.html': {'category': 'Site guide & policy'},
    'info/credits.html': {'category': 'Site guide & policy'},
    'info/disclaimer-notice.html': {'category': 'Site guide & policy'},
    'info/privacy-policy.html': {'category': 'Site guide & policy'},
    'info/professional-hub.html': {'category': 'Site guide & policy'},
    'info/send-feedback.html': {'category': 'Site guide & policy'},
    'info/terms-conditions.html': {'category': 'Site guide & policy'},
    'info/usage-guide.html': {'category': 'Site guide & policy'},
}

EXCLUDED_PAGES = {
    'dynamicShells': [
        'index.html',
        'practice/index.html',
        'practice/session.html',
        'pyq/answers.html',
        'pyq/index.html',
        'pyq/select.html',
        'pyq/viewer.html',
        'quiz/export.html',
        'quiz/index.html',
        'quiz/play.html',
        'quiz/result.html',
        'quiz/review.html',
        'quiz/setup.html',
        'search.html',
    ],
    'placeholders': [
        'bookmarks/index.html',
        'suggestions/index.html',
    ],
    'fallbacks': [
        '404.html',
        'offline.html',
    ],
}

COVERAGE_ANCHOR_SUBJECT = {
    'subject-c': 'CST201',
    'subject-python': 'CST203',
    'subject-ds': 'CST205',
    'subject-cso': 'CST207',
    'subject-algorithms': 'CST209',
}

WRAPPER_IDS = {'study-main-content', 'mainContent', 'main', 'appContainer', 'welcomeScreen'}
VOID_TAGS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
SKIP_TEXT_TAGS = {'script', 'style', 'noscript', 'svg', 'button', 'select', 'option'}
DIFF_LABELS = [
    ('question', 'stem casing/spacing'),
    ('options', 'options'),
    ('correct', 'answer key'),
    ('answer', 'answer prose'),
    ('explanation', 'explanation'),
    ('type', 'question type'),
    ('marks', 'marks'),
    ('unit', 'stored unit'),
]
CODE_RE = re.compile(r'\b(?:CST2\d{2}|SI201)\b')


def fold(value):
    decomposed = unicodedata.normalize('NFKD', str(value)).casefold()
    stripped = ''.join(c for c in decomposed if not unicodedata.combining(c))
    return ' '.join(re.sub(r'[^\w\s]', ' ', stripped).split())


def compact_terms(value, max_chars=260):
    seen = set()
    out = []
    size = 0
    for token in fold(value).split():
        if token in seen:
            continue
        seen.add(token)
        add = len(token) + (1 if out else 0)
        if size + add > max_chars:
            break
        out.append(token)
        size += add
    return ' '.join(out)


class PageParser(HTMLParser):
    """Extracts page IDs, content headings with authored/section anchors, and section body snippets."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.headings = []  # list of dict: tag, anchor, anchorSource, title, body
        self.excluded_drawer_headings = 0
        self._stack = []
        self._current_heading = None
        self._active_section = None

    def _in_chrome(self):
        for tag, aid, cls in self._stack:
            if tag in ('nav', 'footer') or aid == 'mobileDrawer':
                return True
            tokens = set(cls.split())
            if tokens & {'mobile-drawer', 'drawer-header', 'drawer-links', 'unit-discovery', 'navbar', 'skip-study-content'}:
                return True
        return False

    def _in_skipped_text(self):
        return any(tag in SKIP_TEXT_TAGS for tag, _, _ in self._stack)

    def _enclosing_anchor(self, section_only=False):
        for tag, aid, _ in reversed(self._stack[:-1]):
            if not aid or aid in WRAPPER_IDS:
                continue
            if section_only and tag != 'section':
                continue
            return aid
        return ''

    def handle_starttag(self, tag, attrs):
        d = {k: (v or '') for k, v in attrs}
        if d.get('id'):
            self.ids.add(d['id'])
        if tag in VOID_TAGS:
            return
        self._stack.append((tag, d.get('id', ''), d.get('class', '')))
        if tag in ('h1', 'h2', 'h3'):
            if self._in_chrome():
                if any(aid == 'mobileDrawer' or 'mobile-drawer' in cls for _, aid, cls in self._stack):
                    self._current_heading = {'drawer': True, 'title': ''}
                return
            own_id = d.get('id', '')
            sec_id = '' if tag == 'h1' else (self._enclosing_anchor(section_only=True) or self._enclosing_anchor(section_only=False))
            anchor = own_id or sec_id
            source = 'heading' if own_id else ('section' if sec_id else 'none')
            self._current_heading = {
                'tag': tag,
                'anchor': anchor,
                'anchorSource': source,
                'title': '',
                'body': [],
            }

    def handle_data(self, data):
        # Phase 7.1: card and sub-item labels are <p class="card-title">, not
        # headings. They still contribute body text to their enclosing section,
        # so search keeps matching them exactly as it did when they were <h4>.
        if self._current_heading is not None:
            self._current_heading['title'] += data
            return
        if self._active_section is not None and not self._in_chrome() and not self._in_skipped_text():
            chunk = ' '.join(data.split())
            if chunk:
                self._active_section['body'].append(chunk)

    def handle_endtag(self, tag):
        if self._current_heading is not None:
            if self._current_heading.get('drawer') and tag in ('h1', 'h2', 'h3'):
                if ' '.join(self._current_heading['title'].split()):
                    self.excluded_drawer_headings += 1
                self._current_heading = None
            elif self._current_heading.get('tag') == tag:
                title = ' '.join(self._current_heading['title'].split())
                entry = self._current_heading
                self._current_heading = None
                if title:
                    entry['title'] = title
                    self.headings.append(entry)
                    if tag in ('h1', 'h2'):
                        self._active_section = entry
                    elif self._active_section is not None:
                        self._active_section['body'].append(title)
        for idx in range(len(self._stack) - 1, -1, -1):
            if self._stack[idx][0] == tag:
                del self._stack[idx:]
                break


def encode(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n'


def validate_shipped_scope(root, unit_paths):
    shipped = {
        p.relative_to(root).as_posix()
        for p in root.rglob('*.html')
        if not set(p.relative_to(root).parts) & {'.git', 'node_modules', 'webflow', 'docs', 'assets'}
    }
    units = {p.relative_to(root).as_posix() for p in unit_paths}
    info = set(INDEXED_INFO_PAGES)
    excluded = {p for group in EXCLUDED_PAGES.values() for p in group}
    overlap = (units & info) | (units & excluded) | (info & excluded)
    if overlap:
        raise ValueError(f'Overlapping search scope entries: {sorted(overlap)}')
    missing = shipped - (units | info | excluded)
    extra = (units | info | excluded) - shipped
    if missing or extra:
        raise ValueError(f'Search scope mismatch — unclassified: {sorted(missing)}, missing files: {sorted(extra)}')
    return len(shipped)


def cluster_differences(raw_records):
    diffs = []
    for field, label in DIFF_LABELS:
        values = {json.dumps(rec.get(field), sort_keys=True, ensure_ascii=False) for rec in raw_records}
        if len(values) > 1:
            diffs.append(label)
    return diffs


def build(root=ROOT):
    papers, banks = stores(root)
    aliases, canonical, candidate_clusters = duplicates(papers)
    syllabus = {s['code']: s for s in load(root / 'docs/syllabus/syllabus.json')['subjects']}

    rows = {}
    lookup = {}
    raw_by_id = {}
    order_key = {}
    papers_per_subject = Counter()
    raw_per_subject = Counter()
    source_bytes = Counter()
    page_ids_cache = {}

    for path, paper in papers:
        subject = paper['subject']
        source_bytes[subject] += path.stat().st_size
        papers_per_subject[subject] += 1
        paper_id = path.stem
        for q in paper['questions']:
            raw_per_subject[subject] += 1
            raw_by_id[q['id']] = q
            order_key[q['id']] = (paper.get('year', 9999), paper.get('monthNumber', 0), q['id'])
            url = 'pyq/answers.html?' + urlencode({'subject': subject, 'paper': paper['paperCode'], 'q': q['id']})
            title = q['question'][:80]
            row = {
                'id': q['id'],
                'type': 'pyq',
                'subject': subject,
                'unit': q.get('unit'),
                'topic': q.get('topic', ''),
                'title': title,
                'text': fold(q['question'] + ' ' + q.get('topic', '')),
                'year': paper.get('year'),
                'month': paper.get('month'),
                'marks': q.get('marks'),
                'paper': paper['paperCode'],
                'url': url,
            }
            if generic_topic(q):
                row['genericTopic'] = True
            rows.setdefault(subject, []).append(row)
            rep_row = dict(row, paperId=paper_id)
            if q.get('sourceNumber'):
                rep_row['sourceNumber'] = str(q['sourceNumber'])
            lookup[q['id']] = rep_row

    for path, bank in banks:
        subject = bank['subject']
        source_bytes[subject] += path.stat().st_size
        for q in bank['questions']:
            qrow = {
                'id': q['id'],
                'type': 'quiz',
                'subject': subject,
                'unit': bank['unit'],
                'topic': q.get('topic', ''),
                'title': q['question'][:80],
                'text': fold(q['question'] + ' ' + q.get('topic', '')),
                'year': q.get('year'),
                'marks': q.get('marks'),
                'url': 'quiz/setup.html?' + urlencode({'subject': subject, 'unit': bank['unit']}),
            }
            if generic_topic(q):
                qrow['genericTopic'] = True
            rows.setdefault(subject, []).append(qrow)

    unit_paths = sorted((root / 'subjects').glob('CST20*/units/unit-*.html'))
    shipped_html_count = validate_shipped_scope(root, unit_paths)

    unit_anchored = 0
    unit_no_anchor = 0
    unit_drawer_excluded = 0

    for path in unit_paths:
        rel = path.relative_to(root).as_posix()
        subject = path.parts[-3]
        unit = int(re.search(r'unit-(\d+)', path.name)[1])
        parser = PageParser()
        parser.feed(path.read_text(encoding='utf-8'))
        page_ids_cache[rel] = parser.ids
        unit_drawer_excluded += parser.excluded_drawer_headings
        declared_units = len(syllabus[subject]['units']) if subject in syllabus else 0
        for i, h in enumerate(parser.headings):
            title = h['title']
            if CODE_RE.search(title):
                raise ValueError(f'Raw course code in unit heading title {rel}: {title}')
            anchor = h['anchor']
            url = rel + ('#' + anchor if anchor else '')
            urow = {
                'id': f'{subject}-note-{unit}-{i}',
                'type': 'unit',
                'subject': subject,
                'unit': unit,
                'title': title[:80],
                'text': fold(title),
                'url': url,
            }
            if anchor:
                unit_anchored += 1
            else:
                urow['noAnchor'] = True
                unit_no_anchor += 1
            if declared_units and unit > declared_units:
                urow['supplementary'] = True
            rows.setdefault(subject, []).append(urow)

    page_rows = []
    pages_source_bytes = 0
    page_anchored = 0
    page_no_anchor = 0

    for rel, meta in sorted(INDEXED_INFO_PAGES.items()):
        path = root / rel
        pages_source_bytes += path.stat().st_size
        parser = PageParser()
        parser.feed(path.read_text(encoding='utf-8'))
        page_ids_cache[rel] = parser.ids
        sections = [h for h in parser.headings if h['tag'] in ('h1', 'h2')]
        page_title = next((h['title'] for h in sections if h['tag'] == 'h1'), path.stem)
        slug = re.sub(r'[^a-z0-9]+', '-', rel.removesuffix('.html').lower()).strip('-')
        seen_urls = set()
        for i, h in enumerate(sections):
            anchor = h['anchor']
            url = rel + ('#' + anchor if anchor else '')
            if url in seen_urls and h['tag'] != 'h1':
                # Fold unanchored h2 headings into an explicit section row with noAnchor=True.
                pass
            seen_urls.add(url)
            raw_title = h['title'] if h['tag'] == 'h1' else f"{page_title} — {h['title']}"
            if CODE_RE.search(raw_title):
                raise ValueError(f'Raw course code in indexed page title {rel}: {raw_title}')
            body_terms = compact_terms(' '.join(h['body']), max_chars=520)
            search_text = fold(raw_title + ' ' + meta['category'] + (' ' + body_terms if body_terms else ''))
            prow = {
                'id': f'page-{slug}-{i}',
                'type': 'page',
                'category': meta['category'],
                'title': raw_title[:80],
                'text': search_text,
                'url': url,
            }
            if meta.get('subject'):
                prow['subject'] = meta['subject']
            related = meta.get('relatedSubject') or COVERAGE_ANCHOR_SUBJECT.get(anchor)
            if related:
                prow['relatedSubject'] = related
            if anchor:
                page_anchored += 1
            else:
                prow['noAnchor'] = True
                page_no_anchor += 1
            page_rows.append(prow)

    def check_target(url, require_explicit_no_anchor=False, row=None):
        parts = urlsplit(url)
        target = root / parts.path
        if not target.is_file():
            raise ValueError(f'Missing search target {target}')
        if parts.fragment:
            rel_path = parts.path
            if rel_path not in page_ids_cache:
                p = PageParser()
                p.feed(target.read_text(encoding='utf-8'))
                page_ids_cache[rel_path] = p.ids
            if parts.fragment not in page_ids_cache[rel_path]:
                raise ValueError(f'Missing HTML anchor #{parts.fragment} in {rel_path}')
        elif require_explicit_no_anchor and not (row and row.get('noAnchor') is True):
            raise ValueError(f'Unanchored entry missing explicit noAnchor record: {url}')

    output = root / 'assets/search'
    output.mkdir(parents=True, exist_ok=True)
    manifest = {'schemaVersion': 1, 'subjects': {}}

    for subject, entries in sorted(rows.items()):
        entries.sort(key=lambda r: r['id'])
        for row in entries:
            check_target(row['url'], require_explicit_no_anchor=(row['type'] == 'unit'), row=row)
            # Subject is supplied by the shard; question URLs are losslessly reconstructed.
            row.pop('subject', None)
            if row['type'] != 'unit':
                row.pop('url', None)
        payload = encode(entries)
        encoded = payload.encode('utf-8')
        digest = hashlib.sha256(encoded).hexdigest()
        (output / f'index-{subject}.json').write_text(payload, encoding='utf-8')
        manifest['subjects'][subject] = {
            'file': f'index-{subject}.json',
            'count': len(entries),
            'sha256': digest,
            'bytes': len(encoded),
            'sourceBytes': source_bytes[subject],
        }

    page_rows.sort(key=lambda r: r['id'])
    for row in page_rows:
        check_target(row['url'], require_explicit_no_anchor=True, row=row)
    pages_payload = encode(page_rows)
    pages_encoded = pages_payload.encode('utf-8')
    pages_digest = hashlib.sha256(pages_encoded).hexdigest()
    (output / 'index-pages.json').write_text(pages_payload, encoding='utf-8')
    manifest['pages'] = {
        'file': 'index-pages.json',
        'count': len(page_rows),
        'sha256': pages_digest,
        'bytes': len(pages_encoded),
        'sourceBytes': pages_source_bytes,
    }

    def public_repeat_row(qid):
        base = dict(lookup[qid], subject=qid.split('-')[0])
        base.pop('url', None)
        return base

    repeats = []
    exact_sets = set()
    for qid, other in sorted(canonical.items()):
        if not other:
            continue
        members = [qid] + other
        exact_sets.add(tuple(sorted(members)))
        for mid in members:
            check_target(lookup[mid]['url'])
        repeats.append({
            'canonical': public_repeat_row(qid),
            'appearances': [public_repeat_row(x) for x in members],
        })

    candidates = []
    cand_subject_clusters = Counter()
    cand_subject_records = Counter()
    exact_subject_groups = Counter(g['canonical']['subject'] for g in repeats)

    for cluster in candidate_clusters:
        ordered = sorted(cluster, key=lambda qid: order_key[qid])
        for mid in ordered:
            check_target(lookup[mid]['url'])
        subj = ordered[0].split('-')[0]
        is_exact = tuple(sorted(ordered)) in exact_sets
        diffs = [] if is_exact else cluster_differences([raw_by_id[x] for x in ordered])
        cand_subject_clusters[subj] += 1
        cand_subject_records[subj] += len(ordered)
        candidates.append({
            'status': 'unverified-candidate',
            'label': 'Unverified candidate, not a confirmed duplicate',
            'subject': subj,
            'exactAlias': is_exact,
            'differsIn': diffs,
            'normalizedStem': normal(raw_by_id[ordered[0]]['question'])[:120],
            'canonical': public_repeat_row(ordered[0]),
            'appearances': [public_repeat_row(x) for x in ordered],
        })

    candidate_subject_counts = {}
    for code in sorted(syllabus):
        candidate_subject_counts[code] = {
            'clusters': cand_subject_clusters[code],
            'records': cand_subject_records[code],
            'exactGroups': exact_subject_groups[code],
            'paperCount': papers_per_subject[code],
            'rawQuestions': raw_per_subject[code],
        }

    repeated_obj = {
        'method': 'Exact same subject, question, options, key, answer, type, marks and stored unit. Aliases are retained in the original papers. Counts describe this archive, not exam predictions.',
        'candidateMethod': 'Case-folded, whitespace-normalized question stem match within the same subject. Every cluster is an unverified candidate, not a confirmed duplicate: options, keys, marks, answer prose or stored units may differ, and none are merged automatically.',
        'paperCount': len(papers),
        'rawCount': len(lookup),
        'aliasCount': len(aliases),
        'groups': repeats,
        'candidateCount': len(candidates),
        'candidateRecordCount': sum(len(c['appearances']) for c in candidates),
        'candidateSubjectCounts': candidate_subject_counts,
        'candidates': candidates,
    }
    repeated_payload = encode(repeated_obj)
    repeated_encoded = repeated_payload.encode('utf-8')
    repeated_digest = hashlib.sha256(repeated_encoded).hexdigest()
    (output / 'repeated.json').write_text(repeated_payload, encoding='utf-8')

    manifest['repeated'] = {
        'file': 'repeated.json',
        'sha256': repeated_digest,
        'bytes': len(repeated_encoded),
        'exactGroupCount': len(repeats),
        'aliasCount': len(aliases),
        'candidateCount': len(candidates),
        'candidateRecordCount': repeated_obj['candidateRecordCount'],
    }
    manifest['scope'] = {
        'papers': len(papers),
        'pyqQuestions': len(lookup),
        'quizQuestions': sum(len(b['questions']) for _, b in banks),
        'quizSubjects': sorted({b['subject'] for _, b in banks}),
        'missingQuizSubjects': sorted(set(syllabus) - {b['subject'] for _, b in banks}),
        'unitPages': len(unit_paths),
        'infoAndHubPages': len(INDEXED_INFO_PAGES),
        'indexedHtmlPages': len(unit_paths) + len(INDEXED_INFO_PAGES),
        'shippedHtmlPages': shipped_html_count,
        'clientSideOnly': ['section-note:* (plain-text unit section notes stored locally on this device)'],
        'notIndexedInText': ['full PYQ model-answer bodies', 'MCQ option lists and quiz explanations', 'full unit body prose'],
        'excludedPages': EXCLUDED_PAGES,
        'headingAnchors': {
            'unitAnchored': unit_anchored,
            'unitPageTopNoAnchor': unit_no_anchor,
            'unitDrawerChromeExcluded': unit_drawer_excluded,
            'pageAnchored': page_anchored,
            'pageNoAnchor': page_no_anchor,
        },
    }
    manifest['version'] = hashlib.sha256(encode(manifest).encode('utf-8')).hexdigest()[:16]
    (output / 'manifest.json').write_text(encode(manifest), encoding='utf-8')

    total_entries = sum(len(r) for r in rows.values()) + len(page_rows)
    print(
        f'Discovery: {total_entries} entries ({len(page_rows)} page rows); '
        f'{len(repeats)} exact repeat groups / {len(aliases)} aliases; '
        f'{len(candidates)} unverified candidate clusters / {repeated_obj["candidateRecordCount"]} records'
    )
    for subject, item in manifest['subjects'].items():
        ratio = item['bytes'] / item['sourceBytes'] if item['sourceBytes'] else 0
        print(f'  {subject}: {item["bytes"]} bytes / {item["sourceBytes"]} source ({ratio:.1%})')
    pratio = manifest['pages']['bytes'] / manifest['pages']['sourceBytes'] if manifest['pages']['sourceBytes'] else 0
    print(f'  pages: {manifest["pages"]["bytes"]} bytes / {manifest["pages"]["sourceBytes"]} source ({pratio:.1%})')
    return manifest


if __name__ == '__main__':
    build()
