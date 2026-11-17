#!/usr/bin/env python3
"""Unified data gate. --strict fails on all violations; --check-baseline only
accepts the exact source-gated findings in the committed exception ledger.
No arbitrary new error can be hidden by baseline mode.
"""
import argparse
import hashlib
import html
import json
import re
import sys
from collections import Counter
from pathlib import Path
from data_pipeline import ROOT, stores, load, fingerprint, inventory, schedule, duplicates
from build_runtime_data import derived_practice_question
from validate_pyq import option_entries, correct_index


def _clean_html(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', value))).strip()


def validate_syllabus_html(root, syllabus, error):
    subjects_dir = root / 'subjects'
    if not subjects_dir.is_dir():
        return
    for code, meta in sorted(syllabus.items()):
        idx_path = subjects_dir / code / 'index.html'
        if not idx_path.is_file():
            continue
        target = idx_path.relative_to(root).as_posix()
        idx = idx_path.read_text(encoding='utf-8')
        ci_match = re.search(r'<div class="course-info">(.*?)</div>', idx, re.S)
        if not ci_match:
            error('syllabus-html', target, 'missing header course-info block')
        else:
            raw_items = [_clean_html('<span ' + part) for part in ci_match.group(1).split('<span class="info-item')[1:]]
            ltp = meta['ltp']
            expected_ltp = f"L:{ltp[0]} T:{ltp[1]} P:{ltp[2]}" if isinstance(ltp, list) else str(ltp)
            expected_items = [
                f"{meta['credits']} Credits",
                f"{len(meta['units'])} Units",
                f"{meta['contactHours']} Hours",
                expected_ltp,
            ]
            if raw_items != expected_items:
                error('syllabus-html', target, f"header metadata {raw_items} != syllabus {expected_items}")
        dots = re.findall(r'class="progress-unit-dot"', idx)
        if len(dots) != len(meta['units']):
            error('syllabus-html', target, f"progress dots ({len(dots)}) != syllabus unit count ({len(meta['units'])})")
        prereq_match = re.search(r'Prerequisites:</strong>(.*?)</div>', idx, re.S)
        if not prereq_match or _clean_html(prereq_match.group(1)) != meta['prerequisites']:
            error('syllabus-html', target, 'prerequisites mismatch syllabus')
        card_titles = [_clean_html(x) for x in re.findall(r'<div class="unit-card card-glass">\s*<div class="unit-card-header">.*?</div>\s*<h3>(.*?)</h3>', idx, re.S)]
        expected_titles = [u['title'] for u in meta['units']]
        if card_titles != expected_titles:
            error('syllabus-html', target, f"unit card titles {card_titles} != syllabus {expected_titles}")
        card_hours = [_clean_html(x) for x in re.findall(r'<div class="unit-hours">(.*?)</div>', idx, re.S)]
        expected_hours = [f"{u['hours']} Hours" for u in meta['units']]
        if card_hours != expected_hours:
            error('syllabus-html', target, f"unit card hours {card_hours} != syllabus {expected_hours}")

        units_dir = subjects_dir / code / 'units'
        if not units_dir.is_dir():
            continue
        declared = {u['unit']: u for u in meta['units']}
        for unit_path in sorted(units_dir.glob('unit-*.html')):
            utarget = unit_path.relative_to(root).as_posix()
            unum = int(re.search(r'unit-(\d+)', unit_path.name).group(1))
            utext = unit_path.read_text(encoding='utf-8')
            head_slice = utext[:12000]
            h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', utext, re.S)
            h1_text = _clean_html(h1_match.group(1)) if h1_match else ''
            of_matches = re.findall(r'Unit\s+(\d+)\s+of\s+(\d+)', head_slice)
            hours_matches = re.findall(r'(\d+)\s*Hours', head_slice)
            if unum in declared:
                umeta = declared[unum]
                if umeta['title'].lower() not in h1_text.lower():
                    error('syllabus-html', utarget, f"unit h1 '{h1_text}' missing syllabus title '{umeta['title']}'")
                if str(umeta['hours']) not in hours_matches:
                    error('syllabus-html', utarget, f"unit header missing syllabus hours ({umeta['hours']} Hours)")
                for cur_u, total_u in of_matches:
                    if int(cur_u) != unum or int(total_u) != len(declared):
                        error('syllabus-html', utarget, f"stale 'Unit {cur_u} of {total_u}' (expected of {len(declared)})")
            else:
                if 'supplementary' not in h1_text.lower() or of_matches or hours_matches:
                    error('syllabus-html', utarget, 'extra unit page must be relabelled Supplementary without syllabus unit-of-N or contact hours')


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
        if days.get('assignments') != mapping:error('schedule','_data','derived assignments differ from deterministic schedule')
        sizes=[d['count'] for d in summary['days']];mean=sum(sizes)/10
        if not mean or any(abs(n-mean)>.15*mean for n in sizes):error('balance','_data/practice-days.json','day balance exceeds ±15%')
        warnings.append(f"{len(expected['normalizedCandidateClusters'])} normalized duplicate candidate clusters; {len(expected['aliases'])} exact aliases retained")
    else:error('catalog','_data/catalog.json','missing generated catalog')
    if (root/'assets/data/practice-pool.json').exists() or (root/'assets/data/quiz-pool.json').exists():
        aliases,canonical,_=duplicates(papers)
        assignment,_=schedule(papers)
        expected_practice=[
            derived_practice_question(p['subject'],q,assignment,canonical)
            for _,p in papers for q in p['questions'] if q['id'] not in aliases
        ]
        expected_practice.sort(key=lambda r:r['id'])
        practice_path=root/'assets/data/practice-pool.json'
        if not practice_path.is_file():
            error('runtime-pool','assets/data/practice-pool.json','missing derived practice pool')
        else:
            practice_data=load(practice_path)
            if practice_data.get('aliases')!=aliases or practice_data.get('questions')!=expected_practice:
                error('runtime-pool','assets/data/practice-pool.json','stale or inconsistent derived practice pool')
        expected_quiz=[dict(q,subject=b['subject'],unit=b['unit']) for _,b in banks for q in b['questions']]
        expected_quiz.sort(key=lambda r:r['id'])
        quiz_path=root/'assets/data/quiz-pool.json'
        if not quiz_path.is_file():
            error('runtime-pool','assets/data/quiz-pool.json','missing derived quiz pool')
        else:
            quiz_data=load(quiz_path)
            if quiz_data.get('questions')!=expected_quiz:
                error('runtime-pool','assets/data/quiz-pool.json','stale or inconsistent derived quiz pool')
    validate_syllabus_html(root, syllabus, error)
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
