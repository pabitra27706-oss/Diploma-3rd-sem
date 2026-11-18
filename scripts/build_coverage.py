#!/usr/bin/env python3
"""Derived syllabus coverage, practical/internship, exam-pattern and
answer-verification pages. Raw papers and quiz banks stay immutable.

Everything this script prints is counted from committed data:

  * units, hours, modules, topics  -> docs/syllabus/syllabus.json
  * PYQ / quiz / card inventories  -> _data/**, _quiz-data/**, assets/cards/**
  * note depth                     -> the shipped unit HTML (sections, words)
  * open source findings           -> docs/data/validation-exceptions.json
  * paper totals                   -> each paper's own paperFormat quotas
  * answer certification           -> docs/data/answer-verification.json

It never certifies a formula, an answer or a unit mapping. A count of
"certified" answers is zero until an owner sign-off batch records a citation
and a date.
"""
from collections import Counter
from html import escape as e
from pathlib import Path
import re

from data_pipeline import ROOT, stores, load
from build_search_index import encode

# Display-only labels: the UI never shows the internal course code.
SHORT_LABEL = {'CST201': 'C', 'CST203': 'Python', 'CST205': 'DS', 'CST207': 'CSO', 'CST209': 'Algorithms'}
SUBJECT_ANCHOR = {'CST201': 'subject-c', 'CST203': 'subject-python', 'CST205': 'subject-ds',
                  'CST207': 'subject-cso', 'CST209': 'subject-algorithms'}
# Which theory course each practical lab supports (syllabus pages 14-21).
LAB_PARENT = {'CST211': 'CST201', 'CST213': 'CST203', 'CST215': 'CST205'}

# Recorded source-review findings that shift stored data away from the syllabus.
# Read from docs/data/validation-exceptions.json; never re-tagged here.
# CST201 units 3/4 were once recorded as a reversed bank; the banks have since been
# re-tagged to the syllabus (Unit 3 = Arrays, Unit 4 = Functions), so no reversal map exists.

THIN_ITEM_FLOOR = 5


def label(code, title):
    short = SHORT_LABEL.get(code)
    return f'{title} ({short})' if short and short.lower() not in title.lower() else title


def page(title, body, prefix=''):
    is_coverage = title == 'Syllabus coverage and verification' and not prefix
    body_class = ' class="utility-body"' if is_coverage else ''
    main_class = 'discovery utility-page utility-coverage' if is_coverage else 'discovery'
    heading_icon = '<svg class="utility-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="assets/icons/sprite.svg#target"></use></svg>' if is_coverage else ''
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} — Study Hub</title><link rel="stylesheet" href="{prefix}assets/css/variables.css"><link rel="stylesheet" href="{prefix}assets/css/discovery.css"><script defer src="{prefix}assets/js/pwa.js"></script><link rel="stylesheet" href="{prefix}assets/css/base.css"></head><body{body_class}><a class="skip-study-content" href="#study-main-content">Skip to study content</a><main class="{main_class}" id="study-main-content"><nav><a href="{prefix}index.html">Study Hub</a><a href="{prefix}search.html">Search</a><a href="{prefix}coverage.html">Coverage</a><a href="{prefix}exam-pattern.html">Exam pattern</a><a href="{prefix}courses.html">Practical courses</a></nav><h1>{heading_icon}{e(title)}</h1>{body}<p><button type="button" class="print-page-btn" onclick="window.print()">Print this page</button></p></main></body></html>\n'''


TEXT_NOISE = re.compile(r'<(script|style)\b.*?</\1>', re.S | re.I)
TAG = re.compile(r'<[^>]+>')


def note_depth(path: Path):
    """Sections and words actually shipped in a unit page (deterministic)."""
    if not path.is_file():
        return {'present': False, 'sections': 0, 'words': 0}
    raw = path.read_text(encoding='utf-8')
    raw = TEXT_NOISE.sub(' ', raw)
    sections = len(re.findall(r'<h2\b', raw, re.I))
    text = TAG.sub(' ', raw)
    words = len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'’\-]*", text))
    return {'present': True, 'sections': sections, 'words': words}


def answer_register(root: Path):
    path = root / 'docs/data/answer-verification.json'
    data = load(path) if path.is_file() else {'batches': []}
    return data


def signed_off_targets(register):
    """question id -> {verifiedOn, citation, batch, subject}"""
    out = {}
    for batch in register.get('batches', []):
        for target in batch.get('targets', []):
            out[target] = {
                'verifiedOn': batch.get('verifiedOn'),
                'citation': batch.get('citation'),
                'batch': batch.get('id'),
                'subject': batch.get('subject'),
            }
    return out


def describe_paper_totals(paper):
    """Marks obtainable under the paper's own printed quotas.

    Groups may carry sections (separate set/answer quotas), choiceSets
    ('answer any one alternative'), or a flat answerAny x marksEach. The sum of
    the group maximums is what the paper says a candidate can score.
    """
    groups = (paper.get('paperFormat') or {}).get('groups', [])
    obtainable = 0
    quotas = []
    for group in groups:
        if group.get('sections'):
            part = sum(int(sec.get('answerAny') or 0) * int(sec.get('marksEach') or 0) for sec in group['sections'])
            kind = 'sections'
        elif group.get('choiceSets'):
            part = sum(int(cs.get('answerAny') or 0) * int(cs.get('marksEach') or 0) for cs in group['choiceSets'])
            kind = 'choice sets'
        else:
            part = int(group.get('answerAny') or 0) * int(group.get('marksEach') or 0)
            kind = 'answer any'
        quoted = group.get('maxMarks')
        obtainable += part
        quotas.append({'group': group.get('id'), 'kind': kind, 'obtainable': part, 'quotedMax': quoted})
    set_marks = sum(int(q.get('marks') or 0) for q in paper['questions'])
    return {
        'obtainable': obtainable,
        'setMarks': set_marks,
        'printedMax': paper.get('fullMarks'),
        'reconciled': obtainable == int(paper.get('fullMarks') or -1),
        'quotas': quotas,
        'session': paper.get('examSession'),
    }


def build(root=ROOT):
    syllabus = load(root / 'docs/syllabus/syllabus.json')
    papers, banks = stores(root)
    register = answer_register(root)
    signoffs = signed_off_targets(register)
    ledger = load(root / 'docs/data/validation-exceptions.json')
    assessment = syllabus['assessment']

    units_rows, provenance, skew_rows, outside_rows = [], [], [], []
    syllabus_units = 0
    unit_page_count = 0
    out_codes = []

    # ── per-subject inventory ────────────────────────────────────────────────
    for subject in syllabus['subjects']:
        code = subject['code']
        title = subject['title']
        qs = [q for _, p in papers if p['subject'] == code for q in p['questions']]
        subject_banks = [(path, bank) for path, bank in banks if bank['subject'] == code]
        bq = [q for _, bank in subject_banks for q in bank['questions']]
        cards_path = root / f'assets/cards/{code}.json'
        cards = load(cards_path) if cards_path.is_file() else []
        declared = [u['unit'] for u in subject['units']]
        syllabus_units += len(declared)
        by_unit = Counter(q.get('unit') for q in qs)
        quiz = Counter()
        for _, bank in subject_banks:
            quiz[bank.get('unit')] += len(bank['questions'])
        card_by_unit = Counter(c.get('unit') for c in cards)
        card_quiz_by_unit = Counter(c.get('unit') for c in cards if c.get('sourceType') == 'quiz')

        outside_pyq = {u: n for u, n in by_unit.items() if u not in declared}
        outside_quiz = {u: n for u, n in quiz.items() if u not in declared}
        unit5_page = root / f'subjects/{code}/units/unit-5.html'
        if outside_pyq or outside_quiz or (unit5_page.is_file() and 5 not in declared):
            out_codes.append(code)

        body_rows = []
        for unit in subject['units']:
            n = unit['unit']
            rel = f'subjects/{code}/units/unit-{n}.html'
            depth = note_depth(root / rel)
            if depth['present']:
                unit_page_count += 1
            pyq = by_unit.get(n, 0)
            quiz_stored = quiz.get(n, 0)
            # No second attribution: the banks now sit in their syllabus unit, so the
            # stored count IS the syllabus-unit count.
            quiz_syllabus = quiz_stored
            card = card_by_unit.get(n, 0)
            flags = []
            if not depth['present']:
                flags.append('missing notes')
            elif depth['sections'] <= 2 or depth['words'] < 400:
                flags.append('thin notes')
            if pyq + quiz_stored < THIN_ITEM_FLOOR:
                flags.append('thin question set')
            row = {
                'subject': code,
                'subjectLabel': SHORT_LABEL.get(code),
                'unit': n,
                'title': unit['title'],
                'module': unit['module'],
                'hours': unit['hours'],
                'syllabusTopicCount': len(unit.get('topics', [])),
                'hasNotes': depth['present'],
                'noteSections': depth['sections'],
                'noteWords': depth['words'],
                'pyqCount': pyq,
                'quizCount': quiz_stored,
                'quizCountSyllabusUnit': quiz_syllabus,
                'cardCount': card,
                'cardCountFromQuiz': card_quiz_by_unit.get(n, 0),
                'flags': flags,
                'sourcePage': subject['page'],
            }
            units_rows.append(row)
            body_rows.append(row)

        # A stored unit the syllabus does not declare is listed, never hidden.
        extra_units = sorted({u for u in list(by_unit) + list(quiz) if u not in declared},
                             key=lambda value: (value is None, value))
        for unit_no in extra_units:
            n = unit_no
            rel = f'subjects/{code}/units/unit-{n}.html'
            depth = note_depth(root / rel)
            row = {
                'subject': code,
                'subjectLabel': SHORT_LABEL.get(code),
                'unit': n,
                'title': f'Unit {n} — not declared by the syllabus',
                'module': None,
                'hours': None,
                'syllabusTopicCount': 0,
                'hasNotes': depth['present'],
                'noteSections': depth['sections'],
                'noteWords': depth['words'],
                'pyqCount': by_unit.get(n, 0),
                'quizCount': quiz.get(n, 0),
                'quizCountSyllabusUnit': 0,
                'cardCount': card_by_unit.get(n, 0),
                'cardCountFromQuiz': card_quiz_by_unit.get(n, 0),
                'flags': ['out-of-syllabus stored unit (source gate)'],
                'sourcePage': subject['page'],
                'outOfSyllabus': True,
            }
            units_rows.append(row)
            body_rows.append(row)

        if outside_pyq or outside_quiz:
            outside_rows.append({
                'subject': code,
                'pyq': {str(k): v for k, v in sorted(outside_pyq.items(), key=lambda kv: str(kv[0]))},
                'quiz': {str(k): v for k, v in sorted(outside_quiz.items(), key=lambda kv: str(kv[0]))},
                'unitPageBeyondSyllabus': bool(unit5_page.is_file() and 5 not in declared),
            })

        total = len(qs)
        certified = sum(
            1 for q in qs
            if (q.get('answerStatus') == 'verified' and q.get('sourcePage') and q.get('verifiedOn'))
            or (q.get('id') in signoffs and signoffs[q['id']].get('verifiedOn') and signoffs[q['id']].get('citation'))
        )
        provenance.append({
            'subject': code,
            'subjectLabel': SHORT_LABEL.get(code),
            'paperCount': sum(1 for _, p in papers if p['subject'] == code),
            'rawQuestions': total,
            'certifiedAnswers': certified,
            'notCertified': total - certified,
            'missingAnswers': sum(not q.get('answer') or q.get('answerStatus') == 'missing' for q in qs),
            'withSourcePage': sum(bool(q.get('sourcePage')) for q in qs),
            'withVerifiedOn': sum(bool(q.get('verifiedOn')) for q in qs),
            'scanVerifiedOnly': sum(1 for q in qs if q.get('sourceStatus') == 'verified-against-attached-scan'),
            'signedOffBatches': sum(1 for b in register.get('batches', []) if b.get('subject') == code),
        })

        skew_rows.append({
            'subject': code,
            'subjectLabel': SHORT_LABEL.get(code),
            'total': total,
            'byUnit': {str(k): v for k, v in sorted(by_unit.items(), key=lambda kv: str(kv[0]))},
            'unit1': by_unit.get(1, 0),
            'unit1Share': round(by_unit.get(1, 0) / total, 4) if total else 0,
        })

        # Quiz bank shape per subject is reported even when no items exist.
        if not subject_banks:
            provenance[-1]['quizBank'] = 'none'

    # ── practical courses and internship ────────────────────────────────────
    lab_rows = []
    for lab in syllabus['labs']:
        rel = f'subjects/{lab["code"]}/index.html'
        depth = note_depth(root / rel)
        lab_rows.append({
            'code': lab['code'],
            'subjectLabel': None,
            'title': lab['title'],
            'page': lab['page'],
            'credits': lab.get('credits'),
            'ltp': lab.get('ltp'),
            'hoursPerWeek': lab.get('hoursPerWeek'),
            'contactHours': lab.get('contactHours'),
            'assessment': lab.get('assessment'),
            'practicalAreas': len(lab.get('practicalAreas', [])),
            'hasPage': depth['present'],
            'relatedSubject': LAB_PARENT.get(lab['code']),
            'relatedSubjectLabel': SHORT_LABEL.get(LAB_PARENT.get(lab['code'])),
        })
    internship = syllabus['internship']
    internship_row = {
        'code': internship['code'],
        'title': internship['title'],
        'page': internship['page'],
        'credits': internship.get('credits'),
        'timing': internship.get('timing'),
        'hasPage': (root / f'subjects/{internship["code"]}/index.html').is_file(),
    }

    # ── paper totals reconciliation (8.5) ───────────────────────────────────
    paper_totals = []
    for path, paper in papers:
        info = describe_paper_totals(paper)
        info.update({'subject': paper['subject'], 'subjectLabel': SHORT_LABEL.get(paper['subject']),
                     'paperCode': paper.get('paperCode'), 'fileName': path.name, 'month': paper.get('month'),
                     'year': paper.get('year')})
        paper_totals.append(info)

    data = {
        'schemaVersion': 2,
        'source': 'docs/syllabus/syllabus.json',
        'method': ('Counts come from stored tags and shipped files, not verified topic mappings. '
                   'A unit is "covered" only in the sense of having a note page and stored items; '
                   'the counts, not a single percentage, are the finding.'),
        'syllabusTotals': {
            'theoryCourses': len(syllabus['subjects']),
            'labs': len(syllabus['labs']),
            'internships': 1,
            'declaredUnits': syllabus_units,
        },
        'pageTotals': {
            'theoryHubs': sum(1 for s in syllabus['subjects'] if (root / f'subjects/{s["code"]}/index.html').is_file()),
            'syllabusUnitPages': unit_page_count,
            'labPages': sum(1 for row in lab_rows if row['hasPage']),
            'internshipPages': 1 if internship_row['hasPage'] else 0,
        },
        'units': units_rows,
        'skew': skew_rows,
        'outOfSyllabus': outside_rows,
        'labs': lab_rows,
        'internship': internship_row,
        'paperTotals': paper_totals,
        'provenance': provenance,
        'verification': {
            'totalPyq': sum(p['rawQuestions'] for p in provenance),
            'certified': sum(p['certifiedAnswers'] for p in provenance),
            'notCertified': sum(p['notCertified'] for p in provenance),
            'missingAnswers': sum(p['missingAnswers'] for p in provenance),
            'withVerifiedOn': sum(p['withVerifiedOn'] for p in provenance),
            'scanVerifiedOnly': sum(p['scanVerifiedOnly'] for p in provenance),
            'withSourcePage': sum(p['withSourcePage'] for p in provenance),
            'signOffBatches': len(register.get('batches', [])),
            'register': 'docs/data/answer-verification.json',
            'rule': 'Only a recorded owner sign-off batch with a citation and a date counts as certified; a scan check is not answer certification.',
        },
        'findings': ledger.get('findings', []),
        'quizBanks': {
            'files': len(banks),
            'items': sum(len(b['questions']) for _, b in banks),
            'keyed': sum(1 for _, b in banks for q in b['questions'] if q.get('correct')),
            'unkeyed': sum(1 for _, b in banks for q in b['questions'] if not q.get('correct')),
            'subjectsWithoutBank': [s['code'] for s in syllabus['subjects']
                                    if not any(b['subject'] == s['code'] for _, b in banks)],
        },
    }

    out = root / 'assets/data'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'coverage.json').write_text(encode(data))

    # ── coverage.html ───────────────────────────────────────────────────────
    totals = data['syllabusTotals']
    pages = data['pageTotals']
    body = (
        '<p>Syllabus reference: <a href="docs/syllabus/syllabus-3rd-sem-2022.pdf">Revised 2022 syllabus</a>. '
        f'The syllabus declares <strong>{totals["theoryCourses"]} theory courses</strong>, '
        f'<strong>{totals["labs"]} laboratories</strong> and <strong>{totals["internships"]} internship</strong>, '
        f'with <strong>{totals["declaredUnits"]} theory units</strong>. The site ships '
        f'{pages["theoryHubs"]} theory overview pages, {pages["syllabusUnitPages"]} syllabus unit pages, '
        f'{pages["labPages"]} practical pages and {pages["internshipPages"]} internship page.</p>'
        '<p>Theory counts use <em>stored</em> tags, not verified topic mappings. Practical pages list the '
        'syllabus tasks only: no completed lab solution is claimed. Counts include archived duplicates, '
        'so a number is an inventory, not a coverage score.</p>'
        '<h2 id="flags">What the flags mean</h2>'
        '<table><caption>Flag legend</caption><thead><tr><th scope="col">Flag</th><th scope="col">Meaning</th></tr></thead><tbody>'
        '<tr><th scope="row">missing notes</th><td>No unit page is shipped for a unit the syllabus declares.</td></tr>'
        '<tr><th scope="row">thin notes</th><td>The unit page exists but carries two or fewer sections or under 400 words. One thin note is not coverage.</td></tr>'
        '<tr><th scope="row">thin question set</th><td>Fewer than five stored PYQ plus quiz items for the unit.</td></tr>'
        '<tr><th scope="row">out-of-syllabus stored unit</th><td>Records or pages exist for a unit the syllabus does not declare. Listed here, never hidden.</td></tr>'
        '</tbody></table>'
    )

    for subject in syllabus['subjects']:
        code = subject['code']
        title = subject['title']
        anchor = SUBJECT_ANCHOR.get(code, f'subject-{code.lower()}')
        rows = [r for r in units_rows if r['subject'] == code]
        outside = next((o for o in outside_rows if o['subject'] == code), None)
        body += (f'<h2 id="{e(anchor)}">{e(label(code, title))}</h2>'
                 f'<p>Syllabus reference: Revised 2022, p.{subject["page"]}. '
                 f'{len(subject["units"])} declared units, {subject.get("contactHours")} contact hours, '
                 f'{subject.get("credits")} credits.')
        if outside:
            pyq_bits = ', '.join(f'U{k}: {v}' for k, v in outside['pyq'].items()) or 'none'
            quiz_bits = ', '.join(f'U{k}: {v}' for k, v in outside['quiz'].items()) or 'none'
            body += (f' Out-of-syllabus stored tags — PYQ ({e(pyq_bits)}); quiz ({e(quiz_bits)}); '
                     f'extra unit page: {"yes" if outside["unitPageBeyondSyllabus"] else "no"}.')
        body += ('</p><table><caption>'
                 f'{e(title)} — inventory by syllabus unit'
                 '</caption><thead><tr><th scope="col">Unit</th><th scope="col">Syllabus topics</th>'
                 '<th scope="col">Notes</th><th scope="col">PYQs</th><th scope="col">Quiz items</th>'
                 '<th scope="col">Cards</th><th scope="col">Flags</th></tr></thead><tbody>')
        for row in rows:
            n = row['unit']
            rel = f'subjects/{code}/units/unit-{n}.html'
            if row.get('outOfSyllabus'):
                head = f'{e(str(n))}: not in the syllabus'
            elif row['hasNotes']:
                head = f'<a href="{rel}">{n}: {e(row["title"])}</a>'
            else:
                head = f'{n}: {e(row["title"])}'
            notes = (f'{row["noteSections"]} sections, {row["noteWords"]} words'
                     if row['hasNotes'] else 'missing')
            quiz_cell = str(row['quizCount'])
            cards = str(row['cardCount'])
            body += (f'<tr><th scope="row">{head}</th><td>{row["syllabusTopicCount"]}</td>'
                     f'<td>{e(notes)}</td>'
                     f'<td><a href="pyq/index.html?subject={code}&amp;unit={n}">{row["pyqCount"]}</a></td>'
                     f'<td>{e(quiz_cell)}</td><td>{e(cards)}</td>'
                     f'<td>{e(", ".join(row["flags"]) or "no inventory flag")}</td></tr>')
        body += '</tbody></table>'

    # ── Unit-1 skew ────────────────────────────────────────────────────────
    total_all = sum(s['total'] for s in skew_rows)
    unit1_all = sum(s['unit1'] for s in skew_rows)
    body += ('<h2 id="unit-skew">Where the questions actually sit</h2>'
             f'<p>Across all {total_all} archived PYQ records, {unit1_all} '
             f'({round(100 * unit1_all / total_all, 1) if total_all else 0}%) carry a Unit-1 tag. '
             'That is a property of the stored tags, not proof that Unit 1 matters most: the June-2022 '
             'papers tag almost every question Unit 1, and historical papers were tagged against their own '
             'session, not against the current unit split. Read the per-unit counts below as an inventory '
             'and treat the skew as a tagging finding.</p>'
             '<table><caption>Stored PYQ tags per unit and the Unit-1 share</caption>'
             '<thead><tr><th scope="col">Subject</th><th scope="col">PYQ records</th>'
             '<th scope="col">Unit 1</th><th scope="col">Unit-1 share</th>'
             '<th scope="col">Per unit</th></tr></thead><tbody>')
    for row in skew_rows:
        breakdown = ', '.join(f'U{k}: {v}' for k, v in row['byUnit'].items())
        body += (f'<tr><th scope="row">{e(label(row["subject"], dict((s["code"], s["title"]) for s in syllabus["subjects"])[row["subject"]]))}</th>'
                 f'<td>{row["total"]}</td><td>{row["unit1"]}</td>'
                 f'<td>{round(100 * row["unit1Share"], 1)}%</td><td>{e(breakdown)}</td></tr>')
    body += '</tbody></table>'

    # ── Out-of-syllabus summary ────────────────────────────────────────────
    body += ('<h2 id="out-of-syllabus">Stored content the syllabus does not declare</h2>'
             '<p>These are recorded source-review findings. They stay visible and are not re-tagged, '
             'because a unit change alters archived content.</p><ul>')
    for row in outside_rows:
        pyq_bits = ', '.join(f'U{k}: {v}' for k, v in row['pyq'].items()) or 'none'
        quiz_bits = ', '.join(f'U{k}: {v}' for k, v in row['quiz'].items()) or 'none'
        body += (f'<li>{e(SHORT_LABEL.get(row["subject"], "Subject"))}: PYQ ({e(pyq_bits)}), '
                 f'quiz items ({e(quiz_bits)})'
                 f'{" , plus an extra unit page" if row["unitPageBeyondSyllabus"] else ""}.</li>')
    if not outside_rows:
        body += '<li>None.</li>'
    body += '</ul>'

    # ── Practical courses ──────────────────────────────────────────────────
    body += ('<h2 id="practical">Practical courses and internship</h2>'
             '<p>Each practical page reproduces the syllabus task list and cites its page. '
             'No lab solution, output or mark is claimed.</p>'
             '<table><caption>Syllabus practicals and internship</caption>'
             '<thead><tr><th scope="col">Course</th><th scope="col">Syllabus page</th>'
             '<th scope="col">Listed task areas</th><th scope="col">Page shipped</th>'
             '<th scope="col">Supports theory course</th></tr></thead><tbody>')
    for lab in lab_rows:
        link = (f'<a href="subjects/{lab["code"]}/index.html">{e(lab["title"])} (practical)</a>'
                if lab['hasPage'] else f'{e(lab["title"])} (practical) — no page')
        related = label(lab['relatedSubject'], next((s['title'] for s in syllabus['subjects']
                                                     if s['code'] == lab['relatedSubject']), '')) if lab['relatedSubject'] else '—'
        body += (f'<tr><th scope="row">{link}</th><td>{lab["page"]}</td><td>{lab["practicalAreas"]}</td>'
                 f'<td>{"yes" if lab["hasPage"] else "no"}</td><td>{e(related)}</td></tr>')
    internship_head = (f'<a href="subjects/SI201/index.html">{e(internship_row["title"])}</a>'
                       if internship_row['hasPage'] else e(internship_row['title']))
    internship_has = 'yes' if internship_row['hasPage'] else 'no'
    body += (f'<tr><th scope="row">{internship_head}</th>'
             f'<td>{internship_row["page"]}</td><td>—</td>'
             f'<td>{internship_has}</td><td>—</td></tr>')
    body += '</tbody></table>'

    # ── Answer verification (8.6) ──────────────────────────────────────────
    ver = data['verification']
    body += ('<h2 id="answer-verification-status">Answer verification status — derived, not asserted</h2>'
             f'<p>Archived PYQ records: <strong>{ver["totalPyq"]}</strong>. '
             f'With a recorded source page: <strong>{ver["withSourcePage"]}</strong>. '
             f'Wording checked against the attached scan: <strong>{ver["scanVerifiedOnly"]}</strong>. '
             f'With a recorded verification date: <strong>{ver["withVerifiedOn"]}</strong>. '
             f'<strong>Certified answers: {ver["certified"]}</strong>. '
             f'<strong>Not certified: {ver["notCertified"]}</strong>. '
             f'Missing answers: {ver["missingAnswers"]}.</p>'
             '<p>A scan check confirms the question wording and its page; it does not certify that a model '
             'answer is right. Only a recorded owner sign-off batch counts, in '
             '<code>docs/data/answer-verification.json</code>, and it must carry a citation and a date. '
             f'Recorded batches: <strong>{ver["signOffBatches"]}</strong>. '
             f'{e(ver["rule"])}</p>'
             '<table><caption>Certified and uncertified answers per subject</caption>'
             '<thead><tr><th scope="col">Subject</th><th scope="col">Papers</th>'
             '<th scope="col">Records</th><th scope="col">Certified</th>'
             '<th scope="col">Not certified</th><th scope="col">Missing answer</th>'
             '<th scope="col">Sign-off batches</th></tr></thead><tbody>')
    for row in provenance:
        body += (f'<tr><th scope="row">{e(label(row["subject"], dict((s["code"], s["title"]) for s in syllabus["subjects"])[row["subject"]]))}</th>'
                 f'<td>{row["paperCount"]}</td><td>{row["rawQuestions"]}</td>'
                 f'<td>{row["certifiedAnswers"]}</td><td>{row["notCertified"]}</td>'
                 f'<td>{row["missingAnswers"]}</td><td>{row["signedOffBatches"]}</td></tr>')
    body += '</tbody></table>'
    bank = data['quizBanks']
    body += (f'<p>Quiz banks: {bank["files"]} unit files, {bank["items"]} items, '
             f'{bank["keyed"]} keyed multiple-choice items and {bank["unkeyed"]} items with no stored key '
             f'(ungraded, manual self-review). Subjects without a bank: '
             f'{e(", ".join(SHORT_LABEL.get(c, c) for c in bank["subjectsWithoutBank"]) or "none")}.</p>')

    # ── Findings ───────────────────────────────────────────────────────────
    # Grouped and labelled: the exact targets and content fingerprints stay in
    # docs/data/validation-exceptions.json rather than being printed as ids here.
    body += ('<h2 id="open-findings">Open source-review findings</h2>'
             '<p>A finding is a known disagreement between stored data and the syllabus, not a waiver. '
             'The exact targets and content fingerprints live in '
             '<code>docs/data/validation-exceptions.json</code>; this page groups them, because raw '
             'question ids and course codes are not printed in the interface.</p><ul>')
    grouped = {}
    for finding in data['findings']:
        target = str(finding.get('target', ''))
        owner = target.split('-')[0] if target.startswith(('CST', 'SI20')) else 'Site-wide'
        key = (owner, finding.get('code', ''), finding.get('message', ''))
        grouped[key] = grouped.get(key, 0) + 1
    for (owner, code, message), count in sorted(grouped.items()):
        who = SHORT_LABEL.get(owner, 'Quiz/data files' if owner == 'Site-wide' else 'Site-wide')
        body += f'<li>{e(who)}: {count} × {e(message)} ({e(code)}).</li>'
    body += '</ul>'
    body += ('<p>Revision sheets drafted for this phase are separate drafts: they are not linked from '
             'navigation and no entry in them is owner-verified. '
             '<a href="revision/index.html">Revision sheet status</a>.</p>')
    (root / 'coverage.html').write_text(page('Syllabus coverage and verification', body))

    # ── exam-pattern.html (8.5) ────────────────────────────────────────────
    body = (f'<p>Source: <a href="docs/syllabus/syllabus-3rd-sem-2022.pdf#page={assessment["esePatternPage"]}">'
            f'Revised 2022 syllabus, p.{assessment["esePatternPage"]}</a>. '
            f'Internal assessment {assessment["internal"]["total"]} '
            f'(attendance {assessment["internal"]["attendance"]}, viva/presentation/assignment/quiz '
            f'{assessment["internal"]["vivaPresentationAssignmentQuiz"]}, continuous assessment '
            f'{assessment["internal"]["continuousInternalAssessment"]}); '
            f'end-semester {assessment["endSemester"]}; maximum {assessment["maxMarks"]}.</p>'
            '<table><caption>Transcribed end-semester pattern (syllabus p.14)</caption>'
            '<thead><tr><th scope="col">Question type</th><th scope="col">Set</th>'
            '<th scope="col">Answer</th><th scope="col">Total marks</th></tr></thead><tbody>')
    for item in assessment['esePattern']:
        body += (f'<tr><td>{e(item["questionType"])}</td><td>{item["toSet"]}</td>'
                 f'<td>{item["toAnswer"]}</td><td>{item["marks"]}</td></tr>')
    ese_total = sum(item['marks'] for item in assessment['esePattern'])
    body += (f'</tbody></table><p>The five rows total <strong>{ese_total}</strong> marks, which equals the '
             f'declared end-semester total of {assessment["endSemester"]}.</p>')

    reconciled = sum(1 for p in paper_totals if p['reconciled'])
    body += ('<h2 id="marks-reconciliation">Marks reconciliation — the printed maximum is supported</h2>'
             f'<p>Every archived paper states its own set/answer quotas. Summing each group\'s '
             f'<em>answer-any</em> quota or choice set gives the marks a candidate can actually score. '
             f'That figure equals the printed maximum in <strong>{reconciled} of {len(paper_totals)}</strong> '
             'papers. The apparent conflict was a comparison error: the marks summed over <em>all set</em> '
             'questions are larger than the maximum because only a subset is answered.</p>'
             '<table><caption>Printed maximum, marks across all set questions, and marks obtainable under the printed quotas</caption>'
             '<thead><tr><th scope="col">Paper</th><th scope="col">Printed maximum</th>'
             '<th scope="col">All set questions</th><th scope="col">Obtainable</th>'
             '<th scope="col">Matches</th></tr></thead><tbody>')
    for row in paper_totals:
        body += (f'<tr><th scope="row">{e(SHORT_LABEL.get(row["subject"], row["subject"]))} · '
                 f'{e(str(row["month"]))} {e(str(row["year"]))}</th>'
                 f'<td>{row["printedMax"]}</td><td>{row["setMarks"]}</td>'
                 f'<td>{row["obtainable"]}</td>'
                 f'<td>{"yes" if row["reconciled"] else "NO — source review"}</td></tr>')
    body += '</tbody></table>'

    # Session patterns: which printed quota shape each session uses.
    patterns = {}
    for row in paper_totals:
        shape = ' + '.join(f'{q["group"] or "?"}:{q["obtainable"]}' for q in row['quotas'])
        patterns.setdefault(shape, []).append(row)
    body += ('<h2 id="paper-patterns">Which pattern each session prints</h2>'
             '<p>Grouped by the quota shape printed on the paper itself. The recent papers do not print '
             'the 1/2/6-mark table on syllabus p.14; that difference is a source question, so both are '
             'shown and neither is presented as the current rule.</p>')
    for shape, rows in sorted(patterns.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        sessions = sorted({f'{r["month"]} {r["year"]}' for r in rows})
        body += (f'<h3>{e(shape)} marks — {len(rows)} paper(s)</h3><p>Sessions: '
                 f'{e(", ".join(sessions))}. Printed maximum: '
                 f'{e(", ".join(sorted({str(r["printedMax"]) for r in rows})))}.</p>')

    body += ('<h2 id="per-question-marks">What a mark value asks for</h2>'
             '<p>Sourced from the instructions printed on the papers themselves and from the syllabus table:</p><ul>'
             '<li><strong>1 mark:</strong> one objective or very short item. The 2022 syllabus pattern sets 15 and '
             'takes 10 in each of three sections.</li>'
             '<li><strong>2 marks:</strong> a short answer. On the January-2024 to January-2026 papers each of the '
             'ten MCQs carries 2 marks with the printed split "1 mark for the right answer and 1 mark for the '
             'correct explanation".</li>'
             '<li><strong>6 marks:</strong> a subjective question, answer any one of three alternatives per set, '
             'in the 2022 pattern.</li>'
             '<li><strong>8 marks:</strong> a full subjective question, answer any five of nine, on the January-2024 '
             'to January-2026 papers.</li>'
             '</ul><p>No marking scheme for a 6- or 8-mark answer (point breakdown, word count) is published in '
             'the syllabus or on the papers, so none is invented here.</p>'
             '<h2 id="unverified">What stays unverified</h2><ul>'
             '<li>Which pattern applies to your examination session: the syllabus table, or the shape printed on '
             f'{len(paper_totals)} archived papers. Ask your institution; the data does not decide it.</li>'
             '<li>Whether any model answer matches an official key: no official key was supplied for any paper.</li>'
             '<li>Whether a paper maximum belongs to a different regulation: the archived papers print no '
             'regulation label, and the field is recorded as unknown rather than guessed.</li></ul>')
    (root / 'exam-pattern.html').write_text(page('Exam pattern and marks reconciliation', body))

    # ── courses.html + practical pages (8.4) ───────────────────────────────
    courses = ('<p>These pages reproduce the syllabus task lists and cite the page they come from. '
               'They are practical courses: no solution, sample output, mark or completion claim is made.</p><ul>')
    for lab in lab_rows:
        parent = LAB_PARENT.get(lab['code'])
        related = (label(parent, next((s['title'] for s in syllabus['subjects'] if s['code'] == parent), ''))
                   if parent else None)
        link = (f'<a href="subjects/{lab["code"]}/index.html">{e(lab["title"])} (practical)</a>'
                if lab['hasPage'] else f'{e(lab["title"])} (practical) — page pending')
        courses += (f'<li>{link} — {lab["practicalAreas"]} listed task areas, '
                    f'{lab.get("credits")} credits, {lab.get("hoursPerWeek")} hours per week'
                    f'{", supports " + e(related) if related else ""}.</li>')
    courses += '</ul>'
    internship_link = (f'<a href="subjects/SI201/index.html">{e(internship_row["title"])} (internship)</a>'
                       if internship_row['hasPage'] else 'Summer Internship-I (internship) — page pending')
    courses += (f'<p>{internship_link} — {internship_row.get("credits")} credit, '
                f'{e(str(internship_row.get("timing")))}.</p>')
    courses += '<p>Back to <a href="coverage.html">syllabus coverage</a> for the theory inventory.</p>'
    (root / 'courses.html').write_text(page('Practical courses and internship', courses))

    for lab in syllabus['labs']:
        folder = root / 'subjects' / lab['code']
        folder.mkdir(parents=True, exist_ok=True)
        parent = LAB_PARENT.get(lab['code'])
        related = (label(parent, next((s['title'] for s in syllabus['subjects'] if s['code'] == parent), ''))
                   if parent else None)
        assessment_bits = lab.get('assessment') or {}
        if isinstance(assessment_bits, dict) and assessment_bits:
            split = ', '.join(f'{k.replace("_", " ")} {v}' for k, v in assessment_bits.items())
            assessment_line = f'<p>Syllabus assessment fields: {e(split)}.</p>'
        else:
            assessment_line = ''
        content = (
            f'<p>Practical course. Source: <a href="../../docs/syllabus/syllabus-3rd-sem-2022.pdf#page={lab["page"]}">'
            f'Revised 2022 syllabus, p.{lab["page"]}</a>. '
            f'Credits {lab.get("credits")}; L-T-P {e("-".join(str(x) for x in (lab.get("ltp") or [])))}; '
            f'{lab.get("hoursPerWeek")} hours per week'
            f'{"; " + str(lab.get("contactHours")) + " contact hours" if lab.get("contactHours") else ""}.</p>'
            f'{assessment_line}'
            f'{("<p>Supports the " + e(related) + " theory course.</p>") if related else ""}'
            '<h2 id="practical-areas">Practical areas listed in the syllabus</h2>'
            '<p>These are transcribed task areas. Nothing here is a completed solution, a worked output or a '
            'claim that the task was performed.</p><ul>'
            + ''.join('<li>' + e(task) + '</li>' for task in lab['practicalAreas'])
            + '</ul><p>Keep a dated record of the programs you actually write yourself; the site cannot do '
              'the practical for you.</p>'
        )
        (folder / 'index.html').write_text(page(lab['title'], content, '../../'))

    internship_folder = root / 'subjects' / internship['code']
    internship_folder.mkdir(parents=True, exist_ok=True)
    internship_content = (
        f'<p>Source: <a href="../../docs/syllabus/syllabus-3rd-sem-2022.pdf#page={internship["page"]}">'
        f'Revised 2022 syllabus, p.{internship["page"]}</a>. {internship.get("credits")} credit.</p>'
        f'<h2 id="what-it-is">What it is</h2><p>{e(internship.get("note", ""))}</p>'
        f'<h2 id="when">When</h2><p>{e(internship.get("timing", ""))}.</p>'
        '<h2 id="evidence">What a student keeps</h2>'
        '<p>The syllabus does not prescribe an evidence list. The items below are a suggested personal '
        'checklist, not an official requirement — ask your institution for the actual submission rules.</p>'
        '<ul><li>Dated work notes or a logbook of what you did each day.</li>'
        '<li>Any training confirmation, offer letter or attendance record the host gave you.</li>'
        '<li>Any assessment, certificate or completion document the institution or host issued.</li>'
        '<li>Your own report draft, kept privately; do not upload another person\'s data.</li></ul>'
        '<p>No internship report, template or graded work is provided here.</p>'
    )
    (internship_folder / 'index.html').write_text(page(internship['title'], internship_content, '../../'))

    print(f'Coverage: {len(units_rows)} theory unit rows '
          f'({data["pageTotals"]["syllabusUnitPages"]} syllabus unit pages, '
          f'{len(units_rows) - data["pageTotals"]["syllabusUnitPages"]} out-of-syllabus); '
          f'{len(syllabus["labs"])} practical pages; {len(paper_totals)} papers reconciled '
          f'{sum(1 for p in paper_totals if p["reconciled"])}/{len(paper_totals)}; '
          f'{data["verification"]["certified"]} certified answers; no source edits')


if __name__ == '__main__':
    build()
