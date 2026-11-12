#!/usr/bin/env python3
"""Derived syllabus coverage/provenance pages. Raw papers remain immutable."""
from collections import Counter
from html import escape as e
from pathlib import Path
from data_pipeline import ROOT,stores,load
from build_search_index import encode


def page(title,body,prefix=''):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} — Study Hub</title><link rel="stylesheet" href="{prefix}assets/css/variables.css"><link rel="stylesheet" href="{prefix}assets/css/discovery.css"><link rel="stylesheet" href="{prefix}assets/css/print.css"><script defer src="{prefix}assets/js/pwa.js"></script></head><body><main class="discovery"><nav><a href="{prefix}index.html">Study Hub</a><a href="{prefix}coverage.html">Coverage</a><a href="{prefix}exam-pattern.html">Exam pattern</a><a href="{prefix}courses.html">Practical courses</a></nav><h1>{e(title)}</h1>{body}<p><button type="button" onclick="window.print()">Print this page</button></p></main></body></html>\n'''


def build(root=ROOT):
    syllabus=load(root/'docs/syllabus/syllabus.json');papers,banks=stores(root);rows=[];provenance=[]
    body='<p>Theory coverage uses stored tags, not verified topic mappings. Labs are listed separately; completed lab solutions are pending. Count includes all archived appearances, including aliases.</p><p>Unit-1 skew includes June-2022 source tagging. Historical paper tags and current-course syllabus mappings are not automatically reconciled.</p>'
    for subject in syllabus['subjects']:
        code=subject['code'];qs=[q for _,p in papers if p['subject']==code for q in p['questions']];bq=[q for _,b in banks if b['subject']==code for q in b['questions']];cardfile=root/f'assets/cards/{code}.json';cards=load(cardfile) if cardfile.exists() else []
        declared={u['unit'] for u in subject['units']};outside=Counter(q.get('unit') for q in qs+bq if q.get('unit') not in declared)
        body+=f'<h2>{e(code)} — {e(subject["title"])}</h2><p>Syllabus reference: Revised 2022, p.{subject["page"]}. Out-of-syllabus stored tags: {e(str(dict(outside)))}.</p><table><caption>{e(code)} theory inventory</caption><thead><tr><th scope="col">Unit</th><th scope="col">Notes</th><th scope="col">PYQs</th><th scope="col">Quiz</th><th scope="col">Cards</th><th scope="col">Flags</th></tr></thead><tbody>'
        for unit in subject['units']:
            n=unit['unit'];path=f'subjects/{code}/units/unit-{n}.html';pyq=sum(q.get('unit')==n for q in qs);quiz=sum(q.get('unit')==n for q in bq);card=sum(c.get('unit')==n for c in cards);notes=(root/path).is_file();flags=[]
            if not notes:flags.append('missing notes')
            if pyq+quiz<5:flags.append('thin data')
            if code=='CST201' and n in (3,4):flags.append('known mapping review')
            row={'subject':code,'unit':n,'title':unit['title'],'hasNotes':notes,'pyqCount':pyq,'quizCount':quiz,'cardCount':card,'lastUpdated':None,'flags':flags,'sourcePage':subject['page']};rows.append(row)
            link=f'<a href="{path}">{n}: {e(unit["title"])}</a>' if notes else f'{n}: {e(unit["title"])}'
            body+=f'<tr><th scope="row">{link}</th><td>{"present, not certified" if notes else "missing"}</td><td><a href="search.html?subject={code}&amp;unit={n}">{pyq}</a></td><td>{quiz}</td><td>{card}</td><td>{e(", ".join(flags) or "no inventory flag")}</td></tr>'
        body+='</tbody></table>'
        verified=sum(bool(q.get('verifiedOn') and q.get('sourcePage') and q.get('answerStatus')=='verified') for q in qs)
        provenance.append({'subject':code,'rawQuestions':len(qs),'verifiedAnswers':verified,'notCertified':len(qs)-verified,'missingAnswers':sum(not q.get('answer') or q.get('answerStatus')=='missing' for q in qs)})
    out=root/'assets/data';out.mkdir(parents=True,exist_ok=True);(out/'coverage.json').write_text(encode({'schemaVersion':1,'source':'docs/syllabus/syllabus.json','units':rows,'provenance':provenance}))
    body+='<h2>Answer verification status</h2><p>Scan verification is not answer certification. Only an explicit verified answer status with a source page and verification date counts as certified here. No new sign-off is inferred.</p><ul>'+''.join(f'<li>{p["subject"]}: {p["verifiedAnswers"]} certified / {p["rawQuestions"]} archived; {p["notCertified"]} not certified; {p["missingAnswers"]} missing answers.</li>' for p in provenance)+'</ul><p>Update dates are unknown unless recorded; no wall-clock build date is used as a content verification date.</p>'
    (root/'coverage.html').write_text(page('Syllabus coverage and verification',body))
    assessment=syllabus['assessment'];body=f'<p>Source: <a href="docs/syllabus/syllabus-3rd-sem-2022.pdf#page={assessment["esePatternPage"]}">Revised 2022 syllabus, p.{assessment["esePatternPage"]}</a>. Internal {assessment["internal"]["total"]}; end-semester {assessment["endSemester"]}; maximum {assessment["maxMarks"]}.</p><table><caption>Transcribed end-semester pattern</caption><thead><tr><th scope="col">Question type</th><th scope="col">Set</th><th scope="col">Answer</th><th scope="col">Total marks</th></tr></thead><tbody>'
    for item in assessment['esePattern']:body+=f'<tr><td>{e(item["questionType"])}</td><td>{item["toSet"]}</td><td>{item["toAnswer"]}</td><td>{item["marks"]}</td></tr>'
    body+='</tbody></table><h2>Historical paper totals — unresolved</h2><p>Archived printed maxima are source facts, not permission to replace them with the current syllabus total. Differences may reflect regulation, session or paper choice rules; these causes are not certified here. Paper practice displays an unverified-total warning and awards no automatic overall paper marks. Answer length expectations and explanation-mark splits need a cited marking scheme; they are not invented.</p><ul>'
    for path,paper in papers:
        maximum=paper.get('fullMarks');body+=f'<li>{e(path.name)}: printed maximum {e(str(maximum))}; set-question sum {sum(q.get("marks",0) for q in paper["questions"])}; reconciliation unverified.</li>'
    body+='</ul>';(root/'exam-pattern.html').write_text(page('Exam pattern and historical totals',body))
    courses='<p>Syllabus tasks only; no claim of completed practical solutions.</p><ul>'
    for lab in syllabus['labs']:
        folder=root/'subjects'/lab['code'];folder.mkdir(exist_ok=True);path=f'subjects/{lab["code"]}/index.html';courses+=f'<li><a href="{path}">{e(lab["code"])} — {e(lab["title"])} (practical)</a></li>'
        content=f'<p>Practical course. Source: <a href="../../docs/syllabus/syllabus-3rd-sem-2022.pdf#page={lab["page"]}">Revised 2022 syllabus, p.{lab["page"]}</a>. Listed areas are transcribed tasks, not completed solutions.</p><ul>'+''.join('<li>'+e(task)+'</li>' for task in lab['practicalAreas'])+'</ul>'
        (folder/'index.html').write_text(page(lab['code']+' — '+lab['title'],content,'../../'))
    internship=syllabus['internship'];folder=root/'subjects'/internship['code'];folder.mkdir(exist_ok=True)
    (folder/'index.html').write_text(page(internship['code']+' — '+internship['title'],f'<p>Source: <a href="../../docs/syllabus/syllabus-3rd-sem-2022.pdf#page={internship["page"]}">Revised 2022 syllabus, p.{internship["page"]}</a>.</p><p>{e(internship["timing"])}</p><p>{e(internship["note"])}</p><p>Suggested personal checklist (not an official requirement): keep dated work notes, training confirmation and any institution-provided assessment or completion documents. Ask your institution for the actual submission requirements.</p>','../../'))
    courses+='<li><a href="subjects/SI201/index.html">SI201 — Summer Internship-I</a></li></ul>';(root/'courses.html').write_text(page('Practical courses and internship',courses))
    print(f'Coverage: {len(rows)} theory units; {len(syllabus["labs"])} practical course pages; no source edits')
if __name__=='__main__':build()
