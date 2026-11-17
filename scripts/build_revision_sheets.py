#!/usr/bin/env python3
"""Build the per-subject revision sheets from authored sources (Phase 8.2).

A sheet entry may only ship when it can be traced to the syllabus:

  * `citationQuote` must be a verbatim substring of one of that unit's
    transcribed topic phrases in docs/syllabus/syllabus.json;
  * `unit` must be a unit the syllabus declares for that course;
  * `syllabusPage` must equal the page the syllabus gives for that course;
  * a `formula` entry must carry the formula itself and a symbol legend — a
    formula with no legend is rejected rather than printed.

The one-line meaning is an agent draft. Nothing is certified here: an entry is
"verified" only when docs/revision-sheets/signoff.json records it with a
citation and a date. Sheets are generated so the printed page and the counts
cannot drift apart.
"""
from __future__ import annotations

import json
import sys
from html import escape as e
from pathlib import Path

from data_pipeline import ROOT, load, subject_label
from build_search_index import encode

SOURCE_DIR = 'docs/revision-sheets'
SIGNOFF = 'docs/revision-sheets/signoff.json'
SUBTITLE = 'Definitions and formulas — draft sheet'


class SourceError(ValueError):
    """An authored entry that cannot be traced to the syllabus."""


def _syllabus_index(root: Path):
    syllabus = load(root / 'docs/syllabus/syllabus.json')
    index = {}
    for subject in syllabus['subjects']:
        index[subject['code']] = {
            'title': subject['title'],
            'page': subject['page'],
            'units': {u['unit']: u for u in subject['units']},
        }
    return syllabus, index


def load_sources(root: Path, index):
    """Load and validate every authored sheet. Raises SourceError with the reason."""
    subjects = []
    for code in index:
        path = root / SOURCE_DIR / f'{code}.json'
        if not path.is_file():
            subjects.append({'code': code, 'missing': True, 'entries': []})
            continue
        doc = load(path)
        entries = []
        seen = set()
        for raw in doc.get('entries', []):
            entry_id = raw.get('id') or ''
            if not entry_id:
                raise SourceError(f'{path.name}: an entry has no id')
            if entry_id in seen:
                raise SourceError(f'{path.name}: duplicate entry id {entry_id}')
            seen.add(entry_id)
            unit = raw.get('unit')
            declared = index[code]['units']
            if unit not in declared:
                raise SourceError(f'{path.name}: {entry_id} unit {unit!r} is not declared for {code}')
            if raw.get('syllabusPage') != index[code]['page']:
                raise SourceError(f'{path.name}: {entry_id} syllabusPage {raw.get("syllabusPage")!r} '
                                  f'is not the syllabus page {index[code]["page"]}')
            quote = raw.get('citationQuote') or ''
            topics = declared[unit].get('topics', [])
            if not any(quote and quote in topic for topic in topics):
                raise SourceError(f'{path.name}: {entry_id} citationQuote is not a verbatim '
                                  f'{code} unit {unit} syllabus topic: {quote!r}')
            kind = raw.get('kind')
            if kind not in {'definition', 'formula'}:
                raise SourceError(f'{path.name}: {entry_id} kind {kind!r} not definition/formula')
            if not (raw.get('term') or '').strip():
                raise SourceError(f'{path.name}: {entry_id} has no term')
            meaning = (raw.get('meaning') or '').strip()
            if not meaning:
                raise SourceError(f'{path.name}: {entry_id} has no one-line meaning')
            if len(meaning) > 240:
                raise SourceError(f'{path.name}: {entry_id} meaning is longer than one line')
            record = {
                'id': entry_id,
                'kind': kind,
                'term': raw['term'].strip(),
                'meaning': meaning,
                'unit': unit,
                'syllabusPage': index[code]['page'],
                'citationQuote': quote,
            }
            if kind == 'formula':
                formula = (raw.get('formula') or '').strip()
                symbols = [s for s in (raw.get('symbols') or []) if (s.get('symbol') or '').strip()]
                if not formula:
                    raise SourceError(f'{path.name}: {entry_id} is a formula entry with no formula')
                if not symbols:
                    raise SourceError(f'{path.name}: {entry_id} is a formula entry with no symbol legend')
                record.update({'formula': formula, 'symbols': symbols,
                               'formulaStatus': raw.get('formulaStatus') or 'agent draft'})
            entries.append(record)
        subjects.append({'code': code, 'title': index[code]['title'], 'page': index[code]['page'],
                         'missing': False, 'entries': entries,
                         'draftedOn': doc.get('draftedOn'), 'status': doc.get('status')})
    return subjects


def load_signoffs(root: Path):
    path = root / SIGNOFF
    data = load(path) if path.is_file() else {'signoffs': []}
    checked = {}
    for batch in data.get('signoffs', []):
        citation = (batch.get('citation') or '').strip()
        verified_on = (batch.get('verifiedOn') or '').strip()
        if not citation or not verified_on:
            raise SourceError(f'{SIGNOFF}: a sign-off has no citation or no date; it cannot certify anything')
        for entry_id in batch.get('entryIds', []):
            checked[entry_id] = {'verifiedOn': verified_on, 'citation': citation,
                                 'reviewer': batch.get('reviewer') or 'owner'}
    return data, checked


def summarise(subjects, checked):
    rows = []
    for subject in subjects:
        entries = subject['entries']
        verified = [x for x in entries if x['id'] in checked]
        rows.append({
            'code': subject['code'],
            'subjectLabel': subject_label(subject['code']),
            'title': subject.get('title') or '',
            'syllabusPage': subject.get('page'),
            'sheetShipped': bool(entries),
            'draftedOn': subject.get('draftedOn'),
            'entryCount': len(entries),
            'definitionCount': sum(1 for x in entries if x['kind'] == 'definition'),
            'formulaCount': sum(1 for x in entries if x['kind'] == 'formula'),
            'verifiedCount': len(verified),
            'unverifiedCount': len(entries) - len(verified),
            'unitsCovered': sorted({x['unit'] for x in entries}),
        })
    return rows


def page(title, body, prefix=''):
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{e(title)} — Study Hub</title>'
            f'<link rel="stylesheet" href="{prefix}assets/css/variables.css">'
            f'<link rel="stylesheet" href="{prefix}assets/css/discovery.css">'
            
            f'<script defer src="{prefix}assets/js/pwa.js"></script>'
            f'<link rel="stylesheet" href="{prefix}assets/css/base.css">'
            f'<link rel="stylesheet" href="{prefix}assets/css/hub.css"></head>'
            f'<body data-page="revision" data-page-family="revision">'
            f'<a class="skip-study-content" href="#study-main-content">Skip to study content</a>'
            f'<main class="discovery" id="study-main-content"><nav><a href="{prefix}index.html">Study Hub</a>'
            f'<a href="{prefix}coverage.html">Coverage</a>'
            f'<a href="{prefix}exam-pattern.html">Exam pattern</a>'
            f'<a href="{prefix}courses.html">Practical courses</a></nav>'
            f'<h1>{e(title)}</h1>{body}'
            f'<p><button type="button" class="print-page-btn" onclick="window.print()">Print this sheet</button></p>'
            f'</main></body></html>\n')


def build(root=ROOT):
    _, index = _syllabus_index(root)
    subjects = load_sources(root, index)
    register, checked = load_signoffs(root)
    rows = summarise(subjects, checked)

    total_entries = sum(r['entryCount'] for r in rows)
    total_verified = sum(r['verifiedCount'] for r in rows)
    total_formula = sum(r['formulaCount'] for r in rows)
    data = {
        'schemaVersion': 1,
        'source': f'{SOURCE_DIR}/<course>.json',
        'generatedBy': 'scripts/build_revision_sheets.py',
        'rule': ('Each entry cites a verbatim syllabus topic phrase. Meanings are agent drafts. '
                 'An entry counts as verified only inside a recorded owner sign-off with a citation and a date.'),
        'totals': {
            'entries': total_entries,
            'definitions': sum(r['definitionCount'] for r in rows),
            'formulas': total_formula,
            'verified': total_verified,
            'unverified': total_entries - total_verified,
            'signOffBatches': len(register.get('signoffs', [])),
        },
        'subjects': rows,
    }
    out = root / 'assets/data'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'revision-sheets.json').write_text(encode(data))

    # ── status page ─────────────────────────────────────────────────────────
    body = (
        '<p>Draft revision sheets, generated from authored sources that must cite the syllabus. '
        f'<strong>{total_entries} entries</strong> exist for the {len(rows)} theory courses; '
        f'<strong>{total_verified}</strong> are owner-verified and <strong>{total_entries - total_verified}</strong> '
        'are still drafts. A draft is not a source of truth.</p>'
        '<p>Nothing on these sheets is linked from the site navigation while it is unverified, and no entry '
        'should be memorised as fact until the owner signs it off in '
        '<code>docs/revision-sheets/signoff.json</code> with a citation and a date.</p>'
        '<table><caption>Revision sheet status per subject</caption><thead><tr>'
        '<th scope="col">Subject</th><th scope="col">Syllabus page</th><th scope="col">Entries</th>'
        '<th scope="col">Definitions</th><th scope="col">Formulas</th>'
        '<th scope="col">Verified</th><th scope="col">Draft</th></tr></thead><tbody>')
    for row in rows:
        # Same display rule as the coverage page: never repeat a word that is
        # already in the title ("Scripting Languages (Python) (Python)").
        short = row['subjectLabel'] or ''
        suffix = f' ({e(short)})' if short and short.lower() not in row['title'].lower() else ''
        name = e(row['title']) + suffix
        if not row['sheetShipped']:
            body += (f'<tr><th scope="row">{name}</th><td>{row["syllabusPage"]}</td>'
                     '<td>0</td><td>0</td><td>0</td><td>0</td><td>no sheet — reason recorded</td></tr>')
            continue
        link = f'<a href="{row["code"]}.html">{name}</a>'
        body += (f'<tr><th scope="row">{link}</th><td>{row["syllabusPage"]}</td>'
                 f'<td>{row["entryCount"]}</td><td>{row["definitionCount"]}</td>'
                 f'<td>{row["formulaCount"]}</td><td>{row["verifiedCount"]}</td>'
                 f'<td>{row["unverifiedCount"]}</td></tr>')
    body += '</tbody></table>'
    body += ('<h2 id="why-formulas-are-few">Why there are so few formulas</h2>'
             f'<p>{total_formula} entries are formulas. The syllabus describes topics; it prints almost no '
             'arithmetic. Where it names a quantity without printing the formula (a cache hit ratio, a '
             'worst-case comparison count) the entry says so and carries a symbol legend. No textbook page '
             'numbers are cited, because no textbook edition has been verified in this repository — inventing '
             'a chapter reference would be worse than leaving the gap visible.</p>'
             '<h2 id="signoff">How an entry becomes verified</h2>'
             '<ul><li>The owner reads the entry against the cited syllabus topic and, where one exists, a named '
             'textbook or class note.</li>'
             '<li>The owner adds a sign-off record with the entry ids, the citation used and an ISO date.</li>'
             '<li>Re-running <code>python3 scripts/build_revision_sheets.py</code> recomputes the counts above; '
             'nothing is typed by hand.</li></ul>'
             '<p>Back to <a href="../coverage.html">syllabus coverage</a>.</p>')
    (root / 'revision').mkdir(exist_ok=True)
    (root / 'revision/index.html').write_text(page('Revision sheet status', body, '../'))

    # ── one sheet per subject ───────────────────────────────────────────────
    for subject in subjects:
        code = subject['code']
        entries = subject['entries']
        if not entries:
            continue
        verified = sum(1 for x in entries if x['id'] in checked)
        body = (f'<p class="rev-banner">Draft sheet — {verified} of {len(entries)} entries are owner-verified. '
                'Meanings are agent drafts checked only for their syllabus citation. Do not memorise a formula '
                'or a definition from this page until it is signed off.</p>'
                f'<p>Syllabus reference: <a href="../docs/syllabus/syllabus-3rd-sem-2022.pdf#page={subject["page"]}">'
                f'Revised 2022 syllabus, p.{subject["page"]}</a>. '
                'Source file: <code>docs/revision-sheets/&lt;course&gt;.json</code>. '
                f'Entry count: {len(entries)}. Owner-verified: {verified}.</p>')
        by_unit = {}
        for entry in entries:
            by_unit.setdefault(entry['unit'], []).append(entry)
        body += '<h2 id="contents">Contents</h2><ul>'
        for unit in sorted(by_unit):
            title = index[code]['units'][unit]['title']
            count = len(by_unit[unit])
            body += (f'<li><a href="#unit-{unit}">Unit {unit}: {e(title)}</a> '
                     f'({count} {"entry" if count == 1 else "entries"})</li>')
        body += '</ul>'
        for unit in sorted(by_unit):
            title = index[code]['units'][unit]['title']
            body += f'<h2 id="unit-{unit}">Unit {unit}: {e(title)}</h2>'
            body += ('<table><caption>'
                     f'{e(title)} — draft definitions and formulas'
                     '</caption><thead><tr><th scope="col">Term or formula</th>'
                     '<th scope="col">One-line meaning (draft)</th><th scope="col">Syllabus topic cited</th>'
                     '<th scope="col">Status</th></tr></thead><tbody>')
            for entry in by_unit[unit]:
                label = e(entry['term'])
                if entry['kind'] == 'formula':
                    symbols = ', '.join(f'{s.get("symbol")} = {s.get("meaning")}' for s in entry['symbols'])
                    label += (f'<br><code>{e(entry["formula"])}</code>'
                              f'<br><span class="rev-symbols">Symbols: {e(symbols)}</span>')
                status = ('owner-verified ' + checked[entry['id']]['verifiedOn']
                          if entry['id'] in checked else 'draft — unverified')
                body += (f'<tr><th scope="row">{label}</th><td>{e(entry["meaning"])}</td>'
                         f'<td>p.{entry["syllabusPage"]}: “{e(entry["citationQuote"])}”</td>'
                         f'<td>{e(status)}</td></tr>')
            body += '</tbody></table>'
        body += ('<p>Back to <a href="index.html">revision sheet status</a> · '
                 '<a href="../coverage.html">syllabus coverage</a>.</p>')
        (root / 'revision' / f'{code}.html').write_text(page(f'{subject["title"]} — revision sheet', body, '../'))

    print(f'Revision sheets: {total_entries} entries ({total_formula} formulas) across '
          f'{sum(1 for r in rows if r["sheetShipped"])} subjects; {total_verified} owner-verified; '
          'no entry certified by this script')
    return data


if __name__ == '__main__':
    try:
        build()
    except SourceError as error:
        print(f'revision-sheet source error: {error}', file=sys.stderr)
        raise SystemExit(2)
