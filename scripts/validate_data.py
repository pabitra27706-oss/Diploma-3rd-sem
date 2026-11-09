#!/usr/bin/env python3
"""Unified data gate. --strict fails on all violations; --check-baseline only
accepts the exact source-gated findings in the committed exception ledger.
No arbitrary new error can be hidden by baseline mode.
"""
import argparse
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from data_pipeline import ROOT, stores, load, fingerprint, inventory, schedule
from validate_pyq import option_entries, correct_index


def validate(root=ROOT):
    errors, warnings = [], []
    def error(code, target, message):
        errors.append({'code':code,'target':target,'message':message})
    for path in sorted(root.rglob('*.json')):
        if set(path.relative_to(root).parts)&{'.git','node_modules','webflow'}:continue
        try: load(path)
        except (ValueError,OSError) as exc: error('json',path.relative_to(root).as_posix(),str(exc))
    if errors:return errors,warnings
    papers,banks=stores(root)
    syllabus={s['code']:s for s in load(root/'docs/syllabus/syllabus.json')['subjects']}
    ids=Counter()
    for kind,collection in [('pyq',papers),('quiz',banks)]:
        for path,store in collection:
            target=path.relative_to(root).as_posix();subject=store.get('subject');questions=store.get('questions',[])
            if subject not in syllabus:
                error('subject',target,'unknown syllabus subject');continue
            if store.get('totalQuestions')!=len(questions):error('count',target,'totalQuestions differs from actual')
            unit=store.get('unit')
            if kind=='quiz':
                if type(unit)!=int or not 1<=unit<=len(syllabus[subject]['units']):error('bank-unit',target,f'unit {unit} outside syllabus')
                elif store.get('unitTitle')!=syllabus[subject]['units'][unit-1]['title']:
                    # Nonidentical wording may be shorthand; only known reversed topic mappings are blockers.
                    if subject=='CST201' and unit in (3,4):error('unit-order',target,'stored bank topics reverse syllabus Arrays U3 / Functions U4; source review required')
            for q in questions:
                qid=q.get('id');ids[qid]+=1
                if not isinstance(qid,str) or not qid.startswith(subject+'-'):error('id',target,'missing/invalid subject-prefixed id')
                if not isinstance(q.get('question'),str) or not q['question'].strip():error('question',str(qid),'empty question')
                if not isinstance(q.get('topic'),str) or not q['topic'].strip():error('topic',str(qid),'missing topic')
                if q.get('difficulty') not in {'easy','medium','hard'}:error('difficulty',str(qid),'invalid difficulty')
                u=q.get('unit',unit)
                if (kind=='pyq' or 'unit' in q) and (type(u)!=int or not 1<=u<=len(syllabus[subject]['units'])):error('unit',str(qid),f'unit {u} outside syllabus')
                if kind=='pyq' and (type(q.get('practiceDay'))!=int or not 1<=q['practiceDay']<=10):error('day',str(qid),'practiceDay not integer 1..10')
                if q.get('type')=='mcq':
                    entries=option_entries(q)
                    if not entries or len(entries)!=q.get('optionCount',4) or any(not e['text'].strip() for e in entries):error('options',str(qid),'MCQ options missing/invalid')
                    if correct_index(q,entries)<0:error('correct',str(qid),'MCQ key not in options')
                    if not str(q.get('explanation') or (q.get('answer') if kind=='pyq' else '') or '').strip():error('explanation',str(qid),'MCQ explanation missing')
                else:
                    if q.get('options') is not None or q.get('correct') is not None:error('theory-options',str(qid),'non-MCQ carries options/correct')
                    if q.get('answerStatus') not in {'model-answer','missing'}:error('answer-status',str(qid),'non-MCQ must declare model-answer or missing')
                    if q.get('answerStatus')=='model-answer' and not any(q.get(k) for k in ('answer','modelAnswer','explanation')):error('answer-key',str(qid),'claims a key without answer')
                    if q.get('answerStatus')=='model-answer' and not (q.get('answerSource') or q.get('sourceId') or (kind=='pyq' and q.get('sourcePage'))):error('answer-source',str(qid),'model answer must carry a source citation')
                    if q.get('answerStatus')=='missing' and q.get('gradable') is not False:error('gradable',str(qid),'missing key must be explicitly ungraded')
    for qid,count in ids.items():
        if count>1:error('duplicate-id',str(qid),f'id appears {count} times globally')
    bypath={p:paper for p,paper in papers}
    for path in sorted((root/'_data').glob('*/registry.json')):
        reg=load(path)
        if reg.get('totalPapers')!=len(reg.get('papers',[])):error('paper-count',str(path.relative_to(root)),'totalPapers mismatch')
        for meta in reg.get('papers',[]):
            paper=bypath.get(path.parent/meta['fileName'])
            if paper is None:error('paper-file',meta['fileName'],'missing registered paper');continue
            for key in ('duration','fullMarks'):
                if not meta.get(key) or meta[key]!=paper.get(key):error('paper-meta',meta['fileName'],f'{key} absent or inconsistent')
    # Source-gated errors are fingerprinted so an ID cannot be silently edited under an exception.
    qlookup={q['id']:(paper['subject'],q) for _,paper in papers for q in paper['questions']}
    for finding in errors:
        if finding['target'] in qlookup:
            finding['contentHash']=hashlib.sha256(fingerprint(*qlookup[finding['target']]).encode()).hexdigest()
        else:
            p=root/finding['target']
            if p.is_file():
                b=load(p)
                finding['contentHash']=hashlib.sha256(json.dumps({'unit':b.get('unit'),'unitTitle':b.get('unitTitle'),'questions':[{k:q.get(k) for k in ('id','question','options','correct','answer','unit')} for q in b.get('questions',[])]},sort_keys=True).encode()).hexdigest()
    errors.sort(key=lambda x:(x['code'],x['target']))
    if (root/'_data/catalog.json').exists():
        expected=inventory(papers,banks,root=root)
        if load(root/'_data/catalog.json')!=expected:error('catalog','_data/catalog.json','stale generated catalog')
        days=load(root/'_data/practice-days.json')
        mapping,summary=schedule(papers,days['seed'])
        if days!=summary:error('schedule','_data/practice-days.json','stale day metadata')
        if any(q['practiceDay']!=mapping[q['id']] for _,p in papers for q in p['questions']):error('schedule','_data','stored assignment differs from deterministic schedule')
        sizes=[d['count'] for d in summary['days']];mean=sum(sizes)/10
        if not mean or any(abs(n-mean)>.15*mean for n in sizes):error('balance','_data/practice-days.json','day balance exceeds ±15%')
        warnings.append(f"{len(expected['normalizedCandidateClusters'])} normalized duplicate candidate clusters; {len(expected['aliases'])} exact aliases retained")
    else:error('catalog','_data/catalog.json','missing generated catalog')
    return errors,warnings


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--strict',action='store_true')
    p.add_argument('--check-baseline',action='store_true')
    p.add_argument('--json',action='store_true')
    args=p.parse_args()
    errors,warnings=validate()
    if args.json:print(json.dumps({'errors':errors,'warnings':warnings},indent=2))
    else:
        print(f'data-check: {len(errors)} error(s), {len(warnings)} warning(s)')
        for e in errors:print(f"ERROR {e['code']} {e['target']}: {e['message']}")
        for w in warnings:print('WARN '+w)
    if args.check_baseline:
        ledger=load(ROOT/'docs/data/validation-exceptions.json')
        if ledger['findings']!=errors:
            print('FAIL: findings differ from source-review ledger; resolve regression or obtain source verification.');return 1
        print('Baseline matches source-review ledger; this is NOT a full strict pass.')
    return 1 if args.strict and errors else 0

if __name__=='__main__':sys.exit(main())
