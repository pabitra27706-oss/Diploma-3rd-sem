#!/usr/bin/env python3
"""Source-preserving revision cards — deterministic, eligibility-first.

A card may only be built from content the frozen archive already contains:

* a previous-year question whose stored ``answerStatus`` is ``model-answer`` and
  whose answer text is non-empty, or
* a quiz-bank MCQ that has both a stored key inside its own ``options`` and an
  explanation.

Nothing is written, summarised, re-worded or newly certified here. The model
answers and keyed explanations are copied byte-for-byte; ``verification`` says
what they are and is never upgraded. ``citation`` keeps the raw provenance for
audit, while ``citationLabel`` is the display-safe line the review UI shows
(short subject name + session/panel + printed question number), never a course
code or an internal question id.

Every skipped item is counted with a reason, per subject and per unit, and the
counts are written to ``assets/cards/manifest.json`` and
``docs/data/cards.md``. The report is generated, never hand-edited, and two
runs over the same sources produce identical bytes.
"""
import argparse
from pathlib import Path

from build_search_index import encode
from data_pipeline import ROOT, duplicates, stores, subject_label

# Ordered so the report always prints the reasons in the same sequence.
SKIP_REASONS = {
    'alias': 'exact duplicate alias (kept once, canonical record only)',
    'pyq-missing-answer': 'PYQ has no stored model answer',
    'quiz-not-mcq': 'quiz item is not a keyed MCQ (subjective / written; no stored key)',
    'quiz-no-explanation': 'quiz MCQ has no stored explanation',
    'quiz-no-key': 'quiz MCQ has no stored key inside its options',
}
SKIP_ORDER = ['alias', 'pyq-missing-answer', 'quiz-not-mcq', 'quiz-no-explanation', 'quiz-no-key']

# Short codes keep 1,339 cards compact; the honest sentence lives once in the
# manifest and the review UI renders it next to every answer.
VERIFICATION = {
    'pyq': 'model-answer-not-certified',
    'quiz': 'keyed-explanation-unverified-mapping',
}
VERIFICATION_NOTES = {
    'model-answer-not-certified': 'Model answer, not independently certified',
    'keyed-explanation-unverified-mapping':
        'Existing keyed explanation; the source mapping may remain unverified',
}

NOTES = [
    'Cards are copies of stored model answers and keyed MCQ explanations; '
    'no answer, key or unit was created, corrected or newly certified.',
    'CST207 has no quiz bank, so its cards come from previous-year questions only.',
    '456 quiz-bank items carry no stored key; they are skipped here and stay manual self-review.',
    'Exact duplicate aliases are excluded; their canonical record is kept once.',
]


def _paper_label(paper, question):
    code = str(paper.get('paperCode') or '')
    number = code[1:] if code[:1] in {'P', 'p'} and code[1:].isdigit() else code
    session = paper.get('examSession') or ' '.join(
        part for part in (paper.get('month'), paper.get('year')) if part
    ) or 'Session not recorded'
    printed = question.get('sourceNumber') or ''
    tail = f' · {printed}' if printed else ''
    return f"{subject_label(paper.get('subject'))} · {session} · Paper {number}{tail}"


def _quiz_label(bank, question):
    unit = bank.get('unit')
    title = bank.get('unitTitle')
    suffix = f' ({title})' if title else ''
    return (f"Quiz bank · {subject_label(bank.get('subject'))} · Unit {unit}{suffix}"
            f" · key {question.get('correct')}")


def _skip(report, subject, reason):
    row = report.setdefault(subject, {'skipped': {}, 'units': {}, 'sources': {'pyq': 0, 'quiz': 0}})
    row['skipped'][reason] = row['skipped'].get(reason, 0) + 1


def _pyq_card(paper, question):
    return {
        'id': 'card-' + question['id'],
        'sourceType': 'pyq',
        'sourceId': question['id'],
        'subject': paper['subject'],
        'unit': question.get('unit'),
        'topic': question.get('topic', ''),
        'front': question['question'].strip(),
        'back': question['answer'],
        'citation': question.get('sourcePage') or paper.get('fileName'),
        'citationLabel': _paper_label(paper, question),
        'paperId': str(paper.get('fileName', '')).removesuffix('.json') or None,
        'marks': question.get('marks'),
        'tags': question.get('tags', []),
        'difficulty': question.get('difficulty'),
        'verification': VERIFICATION['pyq'],
    }


def _quiz_card(bank, question):
    options = '\n'.join(f'{key}. {text}' for key, text in question['options'].items())
    return {
        'id': 'card-' + question['id'],
        'sourceType': 'quiz',
        'sourceId': question['id'],
        'subject': bank['subject'],
        'unit': bank['unit'],
        'unitTitle': bank.get('unitTitle'),
        'topic': question.get('topic', ''),
        'front': question['question'].strip() + '\n' + options,
        'back': question['explanation'],
        'citation': f"Quiz bank {bank['subject']}, unit {bank['unit']}, {question['id']}; key {question['correct']}",
        'citationLabel': _quiz_label(bank, question),
        'paperId': None,
        'marks': question.get('marks'),
        'tags': question.get('tags', []),
        'difficulty': question.get('difficulty'),
        'verification': VERIFICATION['quiz'],
    }


def collect(papers, banks):
    """Return (cards_by_subject, eligibility_report) without writing anything."""
    aliases, _, _ = duplicates(papers)
    cards, report = {}, {}
    for _, paper in papers:
        subject = paper['subject']
        report.setdefault(subject, {'skipped': {}, 'units': {}, 'sources': {'pyq': 0, 'quiz': 0}})
        for question in paper['questions']:
            if question['id'] in aliases:
                _skip(report, subject, 'alias')
                continue
            if question.get('answerStatus') != 'model-answer' or not question.get('answer'):
                _skip(report, subject, 'pyq-missing-answer')
                continue
            cards.setdefault(subject, []).append(_pyq_card(paper, question))
            row = report[subject]
            row['sources']['pyq'] += 1
            unit = str(question.get('unit') or 'none')
            row['units'][unit] = row['units'].get(unit, 0) + 1
    for _, bank in banks:
        subject = bank['subject']
        report.setdefault(subject, {'skipped': {}, 'units': {}, 'sources': {'pyq': 0, 'quiz': 0}})
        for question in bank['questions']:
            if question.get('type') != 'mcq':
                _skip(report, subject, 'quiz-not-mcq')
                continue
            if not question.get('explanation'):
                _skip(report, subject, 'quiz-no-explanation')
                continue
            if question.get('correct') not in (question.get('options') or {}):
                _skip(report, subject, 'quiz-no-key')
                continue
            cards.setdefault(subject, []).append(_quiz_card(bank, question))
            row = report[subject]
            row['sources']['quiz'] += 1
            unit = str(bank.get('unit') or 'none')
            row['units'][unit] = row['units'].get(unit, 0) + 1
    for rows in cards.values():
        rows.sort(key=lambda card: card['id'])
    return cards, report


def _manifest(cards, report):
    subjects = {}
    for subject in sorted(set(cards) | set(report)):
        rows, row = cards.get(subject, []), report[subject]
        skipped = {reason: row['skipped'][reason] for reason in SKIP_ORDER if row['skipped'].get(reason)}
        subjects[subject] = {
            'file': subject + '.json',
            'count': len(rows),
            'subjectLabel': subject_label(subject),
            'sources': row['sources'],
            'skipped': sum(skipped.values()),
            'skippedReasons': skipped,
            'units': {unit: row['units'][unit] for unit in sorted(row['units'])},
        }
    totals = {
        'cards': sum(len(rows) for rows in cards.values()),
        'fromPyq': sum(row['sources']['pyq'] for row in report.values()),
        'fromQuiz': sum(row['sources']['quiz'] for row in report.values()),
        'skipped': sum(sum(row['skipped'].values()) for row in report.values()),
    }
    eligibility = {reason: sum(row['skipped'].get(reason, 0) for row in report.values())
                   for reason in SKIP_ORDER}
    return {
        'schemaVersion': 2,
        'generatedBy': 'scripts/build_cards.py',
        'totals': totals,
        'skippedReasons': {reason: count for reason, count in eligibility.items() if count},
        'notes': NOTES,
        'verificationNotes': VERIFICATION_NOTES,
        'subjects': subjects,
    }


def _unit_rows(subject, row):
    units = sorted(row['units'], key=lambda unit: (unit == 'none', unit))
    return [(subject, unit, row['units'][unit]) for unit in units]


def _report_markdown(manifest):
    totals, subjects = manifest['totals'], manifest['subjects']
    lines = [
        '# Generated revision cards',
        '',
        'Generated by `scripts/build_cards.py`; never hand-edited. Cards copy stored',
        'model answers (previous-year questions) and existing keyed MCQ explanations.',
        'They are **not newly verified facts**: the `verification` field on every card',
        'states which kind of source it came from, and every card carries a visible',
        'citation to its paper/session or quiz bank unit.',
        '',
        f"Totals: **{totals['cards']} cards** "
        f"({totals['fromPyq']} from previous-year model answers, "
        f"{totals['fromQuiz']} from keyed quiz explanations); "
        f"**{totals['skipped']} items skipped**.",
        '',
        '## Per subject',
        '',
        '| Subject | Cards | From PYQ | From keyed quiz | Skipped |',
        '|---|---:|---:|---:|---:|',
    ]
    for code in sorted(subjects):
        row = subjects[code]
        lines.append(f"| {row['subjectLabel']} | {row['count']} | {row['sources']['pyq']} | "
                     f"{row['sources']['quiz']} | {row['skipped']} |")
    lines += [
        '',
        f"_Subject names are display labels only; the data keys stay `{', '.join(sorted(subjects))}`._",
        '',
        '## Skipped items and why',
        '',
        '| Reason | Items |',
        '|---|---:|',
    ]
    for reason, count in manifest['skippedReasons'].items():
        lines.append(f'| {SKIP_REASONS[reason]} (`{reason}`) | {count} |')
    lines += [
        '',
        'Per-subject breakdown: ' + '; '.join(
            f"{subjects[code]['subjectLabel']} "
            + ', '.join(f"{reason} {count}" for reason, count in subjects[code]['skippedReasons'].items())
            for code in sorted(subjects) if subjects[code]['skippedReasons']
        ) + '.',
        '',
        '## Cards per subject and unit',
        '',
        '| Subject | Unit | Cards |',
        '|---|---:|---:|',
    ]
    for code in sorted(subjects):
        for unit in sorted(subjects[code]['units'], key=lambda u: (u == 'none', u)):
            lines.append(f"| {subjects[code]['subjectLabel']} | {unit} | {subjects[code]['units'][unit]} |")
    lines += ['', '## Scope notes', '']
    lines += [f'- {note}' for note in manifest['notes']]
    lines += [
        '- Cards pass through unchanged: the front is the stored question stem, the',
        '  back is the stored answer/explanation text. No claim of improved recall is',
        '  made, and no percentage or accuracy is asserted here.',
        '',
    ]
    return '\n'.join(lines)


def build(root=ROOT, report=None):
    papers, banks = stores(root)
    cards, eligibility = collect(papers, banks)
    manifest = _manifest(cards, eligibility)
    out = root / 'assets/cards'
    out.mkdir(parents=True, exist_ok=True)
    for subject, rows in sorted(cards.items()):
        (out / f'{subject}.json').write_text(encode(rows), encoding='utf-8')
    (out / 'manifest.json').write_text(encode(manifest), encoding='utf-8')
    target = Path(report) if report else root / 'docs/data/cards.md'
    target.write_text(_report_markdown(manifest), encoding='utf-8')
    totals = manifest['totals']
    print(f"Cards: {totals['cards']} created "
          f"({totals['fromPyq']} PYQ / {totals['fromQuiz']} quiz); "
          f"{totals['skipped']} skipped")
    return manifest


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    build(report=args.report)
