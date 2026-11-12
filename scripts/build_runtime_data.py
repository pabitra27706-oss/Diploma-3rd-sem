#!/usr/bin/env python3
"""Derived compact runtime pools, removing serial paper/bank request fanout."""
from data_pipeline import ROOT,stores,duplicates,schedule
from build_search_index import encode

def build(root=ROOT):
    papers,banks=stores(root);aliases,_,_=duplicates(papers);assignments,_=schedule(papers)
    practice=[dict(q,subjectCode=paper['subject'],practiceDay=assignments[q['id']]) for _,paper in papers for q in paper['questions'] if q['id'] not in aliases]
    quiz=[dict(q,subject=bank['subject'],unit=bank['unit']) for _,bank in banks for q in bank['questions']]
    out=root/'assets/data';out.mkdir(parents=True,exist_ok=True)
    for name,rows in [('practice-pool',practice),('quiz-pool',quiz)]:
        rows.sort(key=lambda q:q['id']);payload=encode({'schemaVersion':1,'questions':rows});(out/(name+'.json')).write_text(payload);print(f'{name}: {len(rows)} questions / {len(payload.encode())} bytes')
if __name__=='__main__':build()
