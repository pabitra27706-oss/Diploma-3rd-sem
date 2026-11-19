"""Phase 16 source/data regressions, not rendered or device assertions."""
import hashlib
import json
import re
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
import build_topic_map_cst209 as topic_map
import verify_cst209_graphs as graphs
import verify_cst209_traces as algorithms

EVIDENCE=ROOT/'docs/phases/16-cst209-algorithms-content/evidence'


class AlgorithmsContentTests(unittest.TestCase):
    def test_note_keys_and_guide_locks_survive(self):
        before=json.loads((EVIDENCE/'anchors-before.json').read_text())
        for name,entry in before.items():
            raw=(ROOT/'subjects/CST209/units'/name).read_text()
            for anchor in entry['sections']+entry['h3']:
                self.assertIn(f'id="{anchor}"',raw,(name,anchor))
        locks={1:['asymptotic','complexity'],2:['elementary','efficient'],3:['binary-search','hashing-collision-resolution-techniques'],4:['mst','shortest-path','shortest-path-1-dijkstra-s-algorithm','dijkstras-algorithm']}
        for unit,anchors in locks.items():
            raw=(ROOT/f'subjects/CST209/units/unit-{unit}.html').read_text()
            for anchor in anchors:self.assertIn(f'id="{anchor}"',raw)

    def test_both_frozen_trees_byte_identical(self):
        before=json.loads((EVIDENCE/'frozen-before.json').read_text())
        after={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest()
               for directory in ['_data','_quiz-data'] for p in (ROOT/directory).rglob('*') if p.is_file()}
        self.assertEqual(before,after)

    def test_map_contract_complete_normalized_named_targets_and_marks(self):
        data=json.loads((ROOT/'assets/data/topic-map-CST209.json').read_text())
        self.assertEqual(data,topic_map.build())
        self.assertEqual(len(data['map']),85)
        self.assertEqual(data['schemaVersion'],1)
        self.assertEqual(data['subject'],'CST209')
        qs=topic_map.questions('CST209','P00[3-6]');self.assertEqual(len(qs),105)
        forbidden={'overview','intro','fundamentals','mcqs','short-questions','long-questions','practice','revision','videos','formulas','comparisons'}
        for topic,(unit,anchor) in data['map'].items():
            self.assertEqual(topic,' '.join(topic.lower().split()))
            self.assertIn(unit,range(1,6))
            self.assertNotIn(anchor,forbidden)
            self.assertFalse(anchor.startswith('overview-'))
            raw=(ROOT/f'subjects/CST209/units/unit-{unit}.html').read_text()
            self.assertIn(f'id="{anchor}"',raw)
        co5=[]
        for q in qs:
            topic=' '.join(q['topic'].lower().split());self.assertIn(topic,data['map'])
            if data['map'][topic][0]==5:co5.append(q['id'])
            if len({part['marks'] for part in q.get('subparts',[])})>1:
                self.assertIn(q['id'].split('-',1)[1],data['decisions'])
        self.assertEqual(len(co5),8)
        # Independent editorial traps: a valid hash alone cannot satisfy these.
        expected={'graphs / trees':[4,'graph-types-cycles-and-spanning-trees'],
                  'binary search / hashing':[3,'hashing-collision-resolution-techniques'],
                  'dag / floyd-warshall':[4,'floyd-warshall-intermediate-matrices'],
                  'hashing / string matching':[5,'rabin-karp-string-matching'],
                  'algorithm basics / sets / stacks':[1,'stack-push-pop-pseudocode']}
        for topic,ref in expected.items():self.assertEqual(data['map'][topic],ref)

    def test_runtime_evidence_specificity_not_just_resolution(self):
        before=json.loads((EVIDENCE/'runtime-before.json').read_text())
        after=json.loads((EVIDENCE/'runtime-after.json').read_text())
        self.assertEqual(len(before),105);self.assertEqual(len(after),105)
        mapped=topic_map.build()['map']
        for row in after:self.assertEqual([row['unit'],row['anchor']],mapped[' '.join(row['topic'].lower().split())])
        generic=lambda rs:sum(r['anchor'].startswith(('overview','intro','fundamentals')) for r in rs)
        self.assertEqual(generic(before),9);self.assertEqual(generic(after),0)
        self.assertEqual(sum(not r['anchor'] for r in before),8)
        self.assertEqual(sum(not r['anchor'] for r in after),0)
        expected={r['id']:r for r in after}
        wrong=sum(bool(r['anchor']) and r['unit']!=expected[r['id']]['unit'] for r in before)
        self.assertEqual(wrong,9)

    def test_computed_traces_reproduce_evidence(self):
        self.assertEqual(graphs.printable(graphs.traces()),json.loads((EVIDENCE/'graph-traces.json').read_text()))
        self.assertEqual(algorithms.traces(),json.loads((EVIDENCE/'algorithm-traces.json').read_text()))
        # Bind the executing algorithm to the learner-facing trace rows too.
        u2=(ROOT/'subjects/CST209/units/unit-2.html').read_text()
        for row in algorithms.traces()['quickDecember2024']:
            self.assertIn(', '.join(map(str,row[-1])),u2)
        for _,row,_ in algorithms.traces()['bubbleJanuary2026']:
            self.assertIn(', '.join(map(str,row)),u2)
        for _,row in algorithms.traces()['radixJanuary2026']:
            self.assertIn(', '.join(map(str,row)),u2)
        u5=(ROOT/'subjects/CST209/units/unit-5.html').read_text()
        self.assertIn('18 nodes',u5);self.assertIn('[0,0,1,2,0]',u5)

    def test_plain_verified_links_accessible_figures_and_prose_hygiene(self):
        for unit,count in [(1,2),(2,3),(3,3),(4,4),(5,2)]:
            raw=(ROOT/f'subjects/CST209/units/unit-{unit}.html').read_text()
            visible=re.sub(r'<(?:script|style)\b[^>]*>.*?</(?:script|style)>','',raw,flags=re.S)
            visible=re.sub(r'<[^>]+>',' ',visible)
            self.assertNotRegex(visible,r'CST20\d|P00\d-Q\d|`')
            self.assertNotRegex(raw,r'<iframe|ytimg\.com|youtube-nocookie')
            links=re.findall(r'href="https://www.youtube.com/watch\?v=[^\"]+"',raw)
            self.assertEqual(len(links),3)
            svgs=re.findall(r'<svg\b.*?</svg>',raw,re.S);self.assertEqual(len(svgs),count)
            for svg in svgs:
                self.assertIn('role="img"',svg);self.assertIn('<title ',svg);self.assertIn('<desc ',svg)

    def test_official_supplementary_boundary(self):
        source=(ROOT/'assets/js/unit-discovery.js').read_text()
        self.assertRegex(source,r'CST209:\s*4')
        self.assertIn('SUPPLEMENTARY_UNITS = { CST209: [5] }',source)
        self.assertIn('unit < maxSyllabusUnit',source)
        self.assertIn('CO5 Supplementary Unit 5',(ROOT/'subjects/CST209/index.html').read_text())
        self.assertIn('CO5 Supplementary Unit 5',(ROOT/'coverage.html').read_text())


if __name__=='__main__':unittest.main()
