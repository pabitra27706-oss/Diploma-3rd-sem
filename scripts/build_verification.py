#!/usr/bin/env python3
"""Derive the answer-verification ledger (Phase 8.6).

Sources of truth, in this order:

  * `_data/<subject>/*.json` (frozen) — what exists: answer text, stored
    `answerStatus`, `sourceStatus`, `sourcePage`, `verifiedOn`.
  * `_quiz-data/<subject>/*.json` (frozen) — keyed or unkeyed items.
  * `docs/data/answer-verification.json` — the owner sign-off register.

The script never certifies anything. It refuses to accept a sign-off batch that
has no citation or no date, names an unknown question, or exceeds the recorded
batch size, so a stray edit cannot quietly publish "verified" answers.

Output: `assets/data/verification.json`.
"""
from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

from data_pipeline import ROOT, load, stores, subject_label
from build_search_index import encode

REGISTER = 'docs/data/answer-verification.json'
ISO_DATE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
DEFAULT_MAX_BATCH = 40


class RegisterError(ValueError):
    """The sign-off register cannot be trusted as written."""


def load_register(root: Path):
    path = root / REGISTER
    if not path.is_file():
        return {'schemaVersion': 1, 'batches': [], 'maxBatchSize': DEFAULT_MAX_BATCH}
    return load(path)


def validate_register(register, known_ids):
    max_batch = int(register.get('maxBatchSize') or DEFAULT_MAX_BATCH)
    problems = []
    seen_batches = set()
    certified = {}
    for batch in register.get('batches', []):
        batch_id = batch.get('id') or ''
        if not batch_id:
            problems.append('a batch has no id')
        elif batch_id in seen_batches:
            problems.append(f'duplicate batch id {batch_id}')
        seen_batches.add(batch_id)
        citation = (batch.get('citation') or '').strip()
        if not citation:
            problems.append(f'{batch_id or "(no id)"}: no citation, so it cannot certify anything')
        verified_on = (batch.get('verifiedOn') or '').strip()
        if not ISO_DATE.match(verified_on):
            problems.append(f'{batch_id or "(no id)"}: verifiedOn {verified_on!r} is not an ISO date')
        elif verified_on > date.today().isoformat():
            problems.append(f'{batch_id or "(no id)"}: verifiedOn {verified_on} is in the future')
        targets = batch.get('targets') or []
        if not targets:
            problems.append(f'{batch_id or "(no id)"}: no targets')
        if len(targets) > max_batch:
            problems.append(f'{batch_id or "(no id)"}: {len(targets)} targets exceeds the '
                            f'{max_batch}-item review batch limit')
        for target in targets:
            if target not in known_ids:
                problems.append(f'{batch_id or "(no id)"}: unknown question id {target}')
                continue
            if target in certified:
                problems.append(f'{target} is signed off twice')
                continue
            certified[target] = {'verifiedOn': verified_on, 'citation': citation,
                                 'batch': batch_id, 'reviewer': batch.get('reviewer') or 'owner'}
    if problems:
        # Fail closed: one bad batch means this register certifies nothing.
        return problems, {}
    return problems, certified


def build(root=ROOT):
    register = load_register(root)
    papers, banks = stores(root)

    records = []
    for path, paper in papers:
        for question in paper['questions']:
            records.append({
                'id': question.get('id'),
                'subject': paper['subject'],
                'paperId': path.stem,
                'paperCode': paper.get('paperCode'),
                'session': paper.get('examSession'),
                'unit': question.get('unit'),
                'marks': question.get('marks'),
                'type': question.get('type'),
                'hasAnswer': bool(question.get('answer')),
                'answerStatus': question.get('answerStatus'),
                'sourceStatus': question.get('sourceStatus'),
                'sourcePage': question.get('sourcePage'),
                'verifiedOn': question.get('verifiedOn'),
            })
    known_ids = {row['id'] for row in records}
    problems, certified = validate_register(register, known_ids)
    if problems:
        raise RegisterError('; '.join(problems))

    quiz_items = []
    for path, bank in banks:
        for question in bank['questions']:
            quiz_items.append({
                'id': question.get('id'),
                'subject': bank['subject'],
                'unit': bank.get('unit'),
                'hasKey': bool(question.get('correct')),
                'sourcePage': question.get('sourcePage'),
                'sourceStatus': question.get('sourceStatus'),
                'verifiedOn': question.get('verifiedOn'),
                'answerStatus': question.get('answerStatus'),
            })

    per_subject = {}
    for row in records:
        bucket = per_subject.setdefault(row['subject'], {
            'subject': row['subject'], 'subjectLabel': subject_label(row['subject']),
            'papers': set(), 'records': 0, 'withAnswer': 0, 'withSourcePage': 0,
            'scanChecked': 0, 'withVerifiedOn': 0, 'certified': 0,
        })
        bucket['papers'].add(row['paperId'])
        bucket['records'] += 1
        bucket['withAnswer'] += 1 if row['hasAnswer'] else 0
        bucket['withSourcePage'] += 1 if row['sourcePage'] else 0
        bucket['scanChecked'] += 1 if row['sourceStatus'] == 'verified-against-attached-scan' else 0
        bucket['withVerifiedOn'] += 1 if row['verifiedOn'] else 0
        bucket['certified'] += 1 if row['id'] in certified else 0
    subject_rows = []
    for bucket in sorted(per_subject.values(), key=lambda b: b['subject']):
        bucket['papers'] = len(bucket['papers'])
        bucket['notCertified'] = bucket['records'] - bucket['certified']
        subject_rows.append(bucket)

    per_paper = {}
    for row in records:
        bucket = per_paper.setdefault(row['paperId'], {
            'paperId': row['paperId'], 'subject': row['subject'], 'subjectLabel': subject_label(row['subject']),
            'session': row['session'], 'records': 0, 'certified': 0,
        })
        bucket['records'] += 1
        bucket['certified'] += 1 if row['id'] in certified else 0
    paper_rows = []
    for bucket in sorted(per_paper.values(), key=lambda b: b['paperId']):
        bucket['notCertified'] = bucket['records'] - bucket['certified']
        paper_rows.append(bucket)

    per_unit = {}
    for row in records:
        key = (row['subject'], row['unit'])
        bucket = per_unit.setdefault(key, {'subject': row['subject'], 'unit': row['unit'],
                                           'records': 0, 'certified': 0})
        bucket['records'] += 1
        bucket['certified'] += 1 if row['id'] in certified else 0
    unit_rows = [dict(bucket, notCertified=bucket['records'] - bucket['certified'])
                 for _, bucket in sorted(per_unit.items(), key=lambda kv: (kv[0][0], str(kv[0][1])))]

    data = {
        'schemaVersion': 1,
        'generatedBy': 'scripts/build_verification.py',
        'register': REGISTER,
        'rule': ('A question counts as certified only inside a recorded owner batch with a citation and an ISO '
                 'date. A scan check of the question wording is not certification of the answer. No answer was '
                 'certified by this script.'),
        'totals': {
            'records': len(records),
            'withAnswer': sum(1 for r in records if r['hasAnswer']),
            'withSourcePage': sum(1 for r in records if r['sourcePage']),
            'scanChecked': sum(1 for r in records if r['sourceStatus'] == 'verified-against-attached-scan'),
            'withVerifiedOn': sum(1 for r in records if r['verifiedOn']),
            'certified': len(certified),
            'notCertified': len(records) - len(certified),
            'signOffBatches': len(register.get('batches', [])),
            'signedOffItems': len(certified),
            'maxBatchSize': int(register.get('maxBatchSize') or DEFAULT_MAX_BATCH),
            'quizItems': len(quiz_items),
            'quizKeyed': sum(1 for q in quiz_items if q['hasKey']),
            'quizUnkeyed': sum(1 for q in quiz_items if not q['hasKey']),
            'quizWithSourcePage': sum(1 for q in quiz_items if q['sourcePage']),
        },
        'subjects': subject_rows,
        'papers': paper_rows,
        'units': unit_rows,
        'batches': register.get('batches', []),
    }
    out = root / 'assets/data'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'verification.json').write_text(encode(data))
    print(f'Verification: {data["totals"]["records"]} PYQ records, '
          f'{data["totals"]["certified"]} certified, {data["totals"]["notCertified"]} not certified, '
          f'{data["totals"]["signOffBatches"]} owner batch(es); '
          f'{data["totals"]["quizKeyed"]}/{data["totals"]["quizItems"]} quiz items keyed; nothing certified here')
    return data


if __name__ == '__main__':
    try:
        build()
    except RegisterError as error:
        print(f'verification register error: {error}', file=sys.stderr)
        raise SystemExit(2)
