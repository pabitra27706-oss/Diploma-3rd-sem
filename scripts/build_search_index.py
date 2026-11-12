#!/usr/bin/env python3
"""Read-only, deterministic discovery sidecars. Never edits authoritative sources."""
import hashlib
import json
import re
import unicodedata
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode, urlsplit
from data_pipeline import ROOT, stores, duplicates


def fold(value):
    return ' '.join(re.sub(r'[^\w\s]', ' ', ''.join(c for c in unicodedata.normalize('NFKD', str(value)).casefold() if not unicodedata.combining(c))).split())


class Headings(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows=[]; self.current=None
    def handle_starttag(self, tag, attrs):
        if tag in ('h1','h2','h3'): self.current=[dict(attrs).get('id',''), '']
    def handle_data(self, data):
        if self.current is not None: self.current[1]+=data
    def handle_endtag(self, tag):
        if tag in ('h1','h2','h3') and self.current is not None:
            self.rows.append(self.current); self.current=None


def encode(value):
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'))+'\n'


def build(root=ROOT):
    papers,banks=stores(root); aliases,canonical,_=duplicates(papers)
    rows={}; lookup={}; source_bytes=Counter()
    for path,paper in papers:
        subject=paper['subject']; source_bytes[subject]+=path.stat().st_size
        for q in paper['questions']:
            url='pyq/answers.html?'+urlencode({'subject':subject,'paper':paper['paperCode'],'q':q['id']})
            title=q['question'][:80]
            row={'id':q['id'],'type':'pyq','subject':subject,'unit':q.get('unit'), 'topic':q.get('topic',''),'title':title,
                 'text':fold(q['question']+' '+q.get('topic','')),'year':paper.get('year'),'month':paper.get('month'), 'marks':q.get('marks'),'paper':paper['paperCode'],'url':url}
            rows.setdefault(subject,[]).append(row);lookup[q['id']]=row
    for path,bank in banks:
        subject=bank['subject'];source_bytes[subject]+=path.stat().st_size
        for q in bank['questions']:
            rows.setdefault(subject,[]).append({'id':q['id'],'type':'quiz','subject':subject,'unit':bank['unit'], 'topic':q.get('topic',''),'title':q['question'][:80], 'text':fold(q['question']+' '+q.get('topic','')),'year':q.get('year'),'marks':q.get('marks'),'url':'quiz/setup.html?'+urlencode({'subject':subject,'unit':bank['unit']})})
    for path in sorted((root/'subjects').glob('*/units/unit-*.html')):
        subject=path.parts[-3]; unit=int(re.search(r'unit-(\d+)',path.name)[1]);parser=Headings();parser.feed(path.read_text())
        for i,(anchor,title) in enumerate(parser.rows):
            title=' '.join(title.split())
            if not title:continue
            rows.setdefault(subject,[]).append({'id':f'{subject}-note-{unit}-{i}','type':'unit','subject':subject,'unit':unit,'title':title[:80],'text':fold(title),'url':str(path.relative_to(root))+('#'+anchor if anchor else '')})
    output=root/'assets/search';output.mkdir(parents=True,exist_ok=True);manifest={'schemaVersion':1,'subjects':{}}
    for subject,entries in sorted(rows.items()):
        entries.sort(key=lambda r:r['id'])
        for row in entries:
            target=root/urlsplit(row['url']).path
            if not target.is_file():raise ValueError(f'Missing search target {target}')
            # Subject is supplied by the shard; question URLs are losslessly reconstructed.
            row.pop('subject',None)
            if row['type']!='unit':row.pop('url',None)
        payload=encode(entries); digest=hashlib.sha256(payload.encode()).hexdigest()
        (output/f'index-{subject}.json').write_text(payload)
        manifest['subjects'][subject]={'file':f'index-{subject}.json','count':len(entries),'sha256':digest,'bytes':len(payload.encode()),'sourceBytes':source_bytes[subject]}
    manifest['version']=hashlib.sha256(encode(manifest).encode()).hexdigest()[:16]
    (output/'manifest.json').write_text(encode(manifest))
    repeats=[]
    for qid,other in sorted(canonical.items()):
        if not other:continue
        repeats.append({'canonical':dict(lookup[qid],subject=qid.split('-')[0]), 'appearances':[dict(lookup[x],subject=x.split('-')[0]) for x in [qid]+other]})
    (output/'repeated.json').write_text(encode({'method':'Exact same subject, question, options, key, answer, type, marks and stored unit. Aliases are retained in the original papers. Counts describe this archive, not exam predictions.','rawCount':len(lookup),'aliasCount':len(aliases),'groups':repeats}))
    print(f'Discovery: {sum(len(r) for r in rows.values())} entries; {len(repeats)} exact repeat groups / {len(aliases)} aliases')
    for subject,item in manifest['subjects'].items():
        ratio=item['bytes']/item['sourceBytes'] if item['sourceBytes'] else 0
        print(f'{subject}: {item["bytes"]} bytes / {item["sourceBytes"]} source ({ratio:.1%})')
    return manifest

if __name__=='__main__':build()
