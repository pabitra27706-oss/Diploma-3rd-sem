#!/usr/bin/env python3
"""Derived compact runtime pools, removing serial paper/bank request fanout."""
from data_pipeline import ROOT, stores, duplicates, schedule, generic_topic
from build_search_index import encode


def derived_practice_question(subject, q, assignments, canonical):
    row = dict(
        q,
        subjectCode=subject,
        practiceDay=assignments[q['id']],
        topicQuality='generic' if generic_topic(q) else 'specific',
    )
    if canonical.get(q['id']):
        row['alsoAppearedIn'] = list(canonical[q['id']])
    return row


def build(root=ROOT):
    papers, banks = stores(root)
    aliases, canonical, _ = duplicates(papers)
    assignments, _ = schedule(papers)
    practice = [
        derived_practice_question(paper['subject'], q, assignments, canonical)
        for _, paper in papers
        for q in paper['questions']
        if q['id'] not in aliases
    ]
    quiz = [dict(q, subject=bank['subject'], unit=bank['unit']) for _, bank in banks for q in bank['questions']]
    out = root / 'assets/data'
    out.mkdir(parents=True, exist_ok=True)
    for name, rows, extra in [
        ('practice-pool', practice, {'aliases': dict(sorted(aliases.items()))}),
        ('quiz-pool', quiz, {}),
    ]:
        rows.sort(key=lambda q: q['id'])
        payload = encode({'schemaVersion': 1, **extra, 'questions': rows})
        (out / (name + '.json')).write_text(payload)
        print(f'{name}: {len(rows)} questions / {len(payload.encode())} bytes')


if __name__ == '__main__':
    build()
