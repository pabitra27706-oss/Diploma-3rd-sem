#!/usr/bin/env python3
"""Source-preserving revision cards. Model answers are not certified answers."""
import argparse
from collections import Counter
from pathlib import Path
from data_pipeline import ROOT, stores, duplicates
from build_search_index import encode


def build(root=ROOT,report=None):
    papers,banks=stores(root);aliases,_,_=duplicates(papers);cards={};skipped=Counter()
    for _,paper in papers:
        subject=paper['subject']
        for q in paper['questions']:
            if q['id'] in aliases:continue
            if q.get('answerStatus')!='model-answer' or not q.get('answer'):
                skipped[subject]+=1;continue
            cards.setdefault(subject,[]).append({'id':'card-'+q['id'],'sourceType':'pyq','sourceId':q['id'],'subject':subject,'unit':q.get('unit'),'topic':q.get('topic',''),'front':q['question'].strip(),'back':q['answer'],'citation':q.get('sourcePage') or paper['fileName'],'paper':paper['paperCode'],'marks':q.get('marks'),'tags':q.get('tags',[]),'difficulty':q.get('difficulty'),'verification':'Model answer, not independently certified'})
    for _,bank in banks:
        subject=bank['subject']
        for q in bank['questions']:
            if q.get('type')!='mcq' or not q.get('explanation') or q.get('correct') not in (q.get('options') or {}):
                skipped[subject]+=1;continue
            options='\n'.join(f'{k}. {v}' for k,v in q['options'].items())
            cards.setdefault(subject,[]).append({'id':'card-'+q['id'],'sourceType':'quiz','sourceId':q['id'],'subject':subject,'unit':bank['unit'],'topic':q.get('topic',''),'front':q['question'].strip()+'\n'+options,'back':q['explanation'],'citation':f'Quiz bank {subject}, unit {bank["unit"]}, {q["id"]}; key {q["correct"]}','marks':q.get('marks'),'tags':q.get('tags',[]),'difficulty':q.get('difficulty'),'verification':'Existing keyed explanation; source mapping may remain unverified'})
    out=root/'assets/cards';out.mkdir(parents=True,exist_ok=True);manifest={'schemaVersion':1,'subjects':{}}
    for subject,rows in sorted(cards.items()):
        rows.sort(key=lambda c:c['id']);(out/f'{subject}.json').write_text(encode(rows));manifest['subjects'][subject]={'file':subject+'.json','count':len(rows),'skipped':skipped[subject]}
    (out/'manifest.json').write_text(encode(manifest))
    report=report or root/'docs/data/cards.md'
    report.write_text('# Generated revision cards\n\nExisting model answers and keyed MCQ explanations only; not newly verified facts. Exact PYQ aliases are excluded. Missing answers and non-keyed quiz items are skipped. Original answer text is unchanged.\n\n| Subject | Created | Skipped (no eligible answer) |\n|---|---:|---:|\n'+''.join(f'| {s} | {len(cards.get(s,[]))} | {skipped[s]} |\n' for s in sorted(set(cards)|set(skipped))))
    print(f'Cards: {sum(map(len,cards.values()))} created; {sum(skipped.values())} skipped')
    return manifest
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--report',type=Path);args=parser.parse_args();build(report=args.report)
