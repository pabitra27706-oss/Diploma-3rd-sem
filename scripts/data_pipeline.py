#!/usr/bin/env python3
"""Shared deterministic data transformations. Never infers an answer or unit.
Raw paper IDs remain addressable. Exact aliases require equal question, key,
options, answer, type, marks and stored unit, within the same subject.
"""
import hashlib
import json
import re
from collections import defaultdict, Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SEED = 'diploma-phase2-v1'


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def dump(data):
    return json.dumps(data, ensure_ascii=False, indent=2) + '\n'


def stores(root=ROOT):
    papers = [(p, load(p)) for p in sorted((root/'_data').glob('*/*.json')) if p.name != 'registry.json']
    banks = [(p, load(p)) for p in sorted((root/'_quiz-data').glob('*/*.json'))]
    return papers, banks


def normal(text):
    # Candidate grouping only. Never use case-folded/punctuation-stripped code to merge.
    return re.sub(r'\s+', ' ', str(text)).strip().casefold()


def fingerprint(subject, q):
    keys = ('question', 'options', 'correct', 'answer', 'explanation', 'type', 'marks', 'unit')
    return json.dumps([subject, {k: q.get(k) for k in keys}], sort_keys=True, ensure_ascii=False)


def duplicates(papers):
    exact, candidates = defaultdict(list), defaultdict(list)
    for path, paper in papers:
        for q in paper['questions']:
            item = (paper.get('year', 9999), paper.get('monthNumber', 0), q['id'])
            exact[fingerprint(paper['subject'], q)].append(item)
            candidates[(paper['subject'], normal(q['question']))].append(q['id'])
    aliases, canonical = {}, {}
    for group in exact.values():
        ids = [item[2] for item in sorted(group)]
        canonical[ids[0]] = ids[1:]
        aliases.update({qid: ids[0] for qid in ids[1:]})
    clusters = [sorted(ids) for ids in candidates.values() if len(ids)>1]
    return aliases, canonical, sorted(clusters)


def schedule(papers, seed=DEFAULT_SEED):
    aliases, canonical, _ = duplicates(papers)
    rows = [(paper['subject'], q) for _, paper in papers for q in paper['questions'] if q['id'] not in aliases]
    rank = {'easy': 0, 'medium': 1, 'hard': 2}
    rows.sort(key=lambda item: (item[0], rank.get(item[1].get('difficulty'), 3), item[1].get('unit', 0), hashlib.sha256((seed+'\0'+item[1]['id']).encode()).hexdigest()))
    # Carry round-robin across subject/difficulty/unit strata: every ten get one per day.
    mapping = {q['id']: i % 10 + 1 for i, (_, q) in enumerate(rows)}
    mapping.update({qid: mapping[target] for qid, target in aliases.items()})
    days = []
    for day in range(1, 11):
        selected = [(s,q) for s,q in rows if mapping[q['id']] == day]
        days.append({'day':day, 'count':len(selected), 'subjects':dict(sorted(Counter(s for s,q in selected).items())), 'difficulty':dict(sorted(Counter(q['difficulty'] for s,q in selected).items())), 'ids':sorted(q['id'] for s,q in selected)})
    return mapping, {'schemaVersion':1, 'seed':seed, 'algorithm':'subject/difficulty/unit/hash round-robin; exact-content aliases excluded', 'rawCount':sum(len(b['questions']) for _,b in papers), 'uniqueCount':len(rows), 'days':days}


def generic_topic(q):
    topic = normal(q.get('topic',''))
    return not topic or topic in {'short answer', 'group a / objective', 'group c / long answer', 'long answer', 'objective'}


def inventory(papers, banks, root=ROOT):
    syllabus = load(root/'docs/syllabus/syllabus.json')
    aliases, canonical, clusters = duplicates(papers)
    subjects = {}
    for s in syllabus['subjects']:
        code = s['code']
        raw = [q for _,p in papers if p['subject']==code for q in p['questions']]
        unique = [q for q in raw if q['id'] not in aliases]
        bs = [(p,b) for p,b in banks if b['subject']==code]
        qs = [q for _,b in bs for q in b['questions']]
        subjects[code] = {'title':s['title'], 'credits':s['credits'], 'syllabusUnits':len(s['units']), 'rawPyqCount':len(raw), 'uniquePyqCount':len(unique), 'quizCount':len(qs), 'quizMcqCount':sum(q['type']=='mcq' for q in qs), 'missingKeyCount':sum(q.get('answerStatus')=='missing' for q in qs), 'years':sorted({q['year'] for q in qs if q.get('year')}), 'sources':sorted({q['source'] for q in qs}), 'banks':[{'unit':b['unit'], 'title':b.get('unitTitle',''), 'file':p.relative_to(root).as_posix(), 'count':len(b['questions'])} for p,b in bs]}
    return {'schemaVersion':1, 'subjects':subjects, 'rawPyqCount':sum(s['rawPyqCount'] for s in subjects.values()), 'uniquePyqCount':sum(s['uniquePyqCount'] for s in subjects.values()), 'quizCount':sum(s['quizCount'] for s in subjects.values()), 'aliases':dict(sorted(aliases.items())), 'canonical':[{'id':qid, 'alsoAppearedIn':other} for qid,other in sorted(canonical.items()) if other], 'normalizedCandidateClusters':clusters}
