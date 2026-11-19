#!/usr/bin/env python3
"""Mode A editorial Algorithms map, authored LAST after Phase 16 headings.

Question groups were read against stems/subpart marks, not inferred from stored
unit tags or fuzzy scores. Regeneration never writes frozen papers/quiz banks.
"""
import argparse
import json
from pathlib import Path

from audit_topic_routing import ROOT, SUPPLEMENTARY_NOTE, load_units, no_jump_register, questions

# unit, concept anchor, then question numbers in P003, P004, P005, P006.
GROUPS = (
 (1,'data-abstraction','1 12','','',''),
 (1,'power-sets-and-multiset-multiplicity','2 9 10','','2',''),
 (1,'complexity','11 18','','','1'),
 (1,'loop-counting-and-recurrence-substitution','27','','17',''),
 (1,'algorithm-characteristics-with-examples','','','1','4'),
 (1,'asymptotic-polynomial-witness-proof','','3','16','2 16'),
 (1,'asymptotic','26','','',''),
 (1,'stack-push-pop-pseudocode','21','1 16','',''),
 (1,'programming-models-divide-and-conquer','','5','6','3'),
 (1,'programming-models-dynamic-programming-dp','5','','5','17'),
 (1,'programming-models-greedy-method','','','','15'),
 (2,'elementary-3-insertion-sort','8 16','','',''),
 (2,'elementary-2-selection-sort','13','17','18','8'),
 (2,'elementary-1-bubble-sort','17','','','18'),
 (2,'efficient','', '2','4','5'),
 (2,'efficient-1-merge-sort','31','','','7'),
 (2,'quicksort-exam-partition-trace','20','','12 19',''),
 (2,'heaps-and-linear-build-max-heap','','','14',''),
 (2,'linear-3-bucket-sort','','19','',''),
 (2,'linear-2-radix-sort','','','7','6 19'),
 (3,'searching-linear-and-binary','3 4 28','4 20','3','9 20'),
 (3,'linear-search','','','','10'),
 (3,'bst','','14','','11 21'),
 (3,'balanced','29','13','','12'),
 (3,'hashing-search-and-collision-overview','14','10','',''),
 (3,'hashing-collision-resolution-techniques','19 32','21','8 20',''),
 (4,'graph-types-cycles-and-spanning-trees','6','6 9 12','13',''),
 (4,'dag-topo','22','8','',''),
 (4,'mst','15','','',''),
 (4,'mst-1-prim-s-algorithm','24','7 18','10','23'),
 (4,'mst-2-kruskal-s-algorithm','7 30','','21','13'),
 (4,'dijkstras-algorithm','23 25 33','11','','24'),
 (4,'shortest-path','','','9','14'),
 (4,'bellman-ford-exam-trace','','22','',''),
 (4,'floyd-warshall-intermediate-matrices','','','22',''),
 (5,'rabin-karp-string-matching','34','15','11','22'),
 (5,'naive-string-matching-algorithm','','23','',''),
 (5,'kmp-string-matching-and-lps','','','15 24',''),
 (5,'tries-prefix-trees','','','23',''),
)

DECISIONS = {
 'P003-Q26':'Equal 2+2+2+2: asymptotic notation is the most specific named concept; time/space definitions remain in the same unit. Flagged: no one anchor answers every subpart.',
 'P003-Q27':'Equal 4+4: choose the exact doubling-loop derivation; D&C is in the same unit, not stored Sorting Unit 2.',
 'P003-Q28':'2+4+2: binary algorithm/proof carries 6m; the shared search heading covers linear preference too.',
 'P003-Q29':'Equal 4+4: height balancing is the distinctive conceptual half; BST insertion remains in the neighbouring section.',
 'P003-Q30':'3m Prim / 5m Kruskal: select Kruskal, whose section leads to the exact March 2023 edge-set trace.',
 'P003-Q32':'2m hashing / 6m collision methods: choose the locked collision heading, not the generic hash overview.',
 'P003-Q33':'5m Dijkstra algorithm / 3m example: Dijkstra landing includes predecessor/relaxation and the full table.',
 'P003-Q34':'6m Rabin–Karp / 2m comparison: RK wins. Blueprint split of the comparison into 1+1 is a weighting convention, not the printed subpart allocation.',
 'P004-Q9':'Flagged disputed frozen key: the stem says circuit, conventionally a cycle, while its stored answer says path. Route to definitions and visible caution, never edit the paper.',
 'P004-Q16':'2m definition / 2m sets / 4m stack: route to exact PUSH/POP pseudocode. Related introductory topics remain nearby.',
 'P004-Q17':'3m algorithm / 3m trace / 2m complexity all concern Selection Sort; choose its named section.',
 'P004-Q19':'2m significance / 2m limitations / 4m Bucket: Bucket is the specific worked half; the same section contains linear-sort assumptions.',
 'P004-Q20':'4m recursive algorithm / 1m unsorted pitfall / 3m complexity: search heading covers all three; do not land in Sorting despite stored unit 2.',
 'P004-Q21':'2m hashing / 3m uses / 3m chaining: collision heading prioritises the specific chaining request; all are in the same hash section.',
 'P004-Q22':'Equal 4+4: exact six-vertex Bellman–Ford trace beside the algorithm; blueprint five-vertex target superseded by recorded printed edges.',
 'P005-Q16':'3m characteristics / 5m asymptotic notations: polynomial witness proof wins, not the characteristics overview.',
 'P005-Q17':'3m D&C / 3m recurrence / 2m loop count: analysis subparts total 5m, so choose the exact recurrence/loop derivation.',
 'P005-Q18':'Equal 4+4: named Selection Sort section plus the comparison table later in the same unit.',
 'P005-Q20':'3m binary algorithm / 5m hashing collisions: route to collision techniques despite stored Sorting tag.',
 'P005-Q21':'2m MST definition / 6m Kruskal graph: named Kruskal section leads to the exact seven-vertex trace and total 39.',
 'P005-Q22':'2m DAG / 6m Floyd–Warshall: intermediate-matrix heading wins; DAG has a separate in-unit section.',
 'P005-Q23':'3m tries definition / 5m construction: exact eight-word prefix-tree construction wins.',
 'P005-Q24':'3m KMP explanation / 5m exact trace: choose the full LPS and comparison table, not a string-matching overview.',
 'P006-Q16':'Equal 4+4: polynomial proof is the more specific notation heading; traits are in the same introductory unit.',
 'P006-Q17':'Equal 4+4: choose DP as the distinctive comparison target; dedicated D&C/DP table is in the same section.',
 'P006-Q19':'3m efficient-sort comparison / 5m Radix trace: named Radix section leads to all three exact digit passes.',
 'P006-Q20':'5m binary / 3m comparison: shared search heading contains proof, hit/miss trace and linear tradeoffs.',
 'P006-Q21':'5m BST insert/delete / 3m balancing significance: BST operations win over AVL-only heading.',
 'P006-Q22':'Flagged equal 4+4 across units: choose the specific RK string matcher in CO5, with a visible link back to Unit 3 collision resolution. This is not a claim all 8 marks belong to CO5.',
 'P006-Q23':'3m graph types / 5m Prim: named Prim section wins over generic graph basics.',
 'P006-Q24':'5m Dijkstra / 3m topological sorting: Dijkstra wins; topo remains separately linked in the same unit.',
 'shared:searching / complexity':'Flagged shared label: March 2023 asks binary complexity; January 2024 asks linear worst case. A topic-only map cannot distinguish them. Shared search heading explicitly covers both.',
 'shared:shortest paths':'Flagged shared label: December 2024 asks negative-edge Bellman–Ford; January 2026 asks Dijkstra failure. Named shortest-path choice section covers both; mapping only to Dijkstra would be wrong.',
 'shared:string matching':'Both stems name Rabin–Karp; March 2023 majority is 6m RK, January 2024 is an RK MCQ. Do not use an overview just because the stored topic is generic.',
}


def build():
    qs=questions('CST209','P00[3-6]');by_id={q['id']:q for q in qs}
    result={};seen=set();anchors={u:{a for _,a in hs} for u,hs in load_units('CST209').items()}
    for unit,anchor,*papers in GROUPS:
        assert anchor in anchors[unit],(unit,anchor)
        for paper,nums in zip(range(3,7),papers):
            for num in nums.split():
                qid=f'CST209-P{paper:03d}-Q{num}';assert qid not in seen,qid;seen.add(qid)
                topic=' '.join(by_id[qid]['topic'].lower().split())
                if topic in result:assert result[topic]==[unit,anchor],topic
                result[topic]=[unit,anchor]
    assert seen==set(by_id),(set(by_id)-seen,seen-set(by_id))
    return {'schemaVersion':1,'subject':'CST209','window':'P003–P006 (2023–2026); P001 excluded','mode':'A — frozen paper and quiz bytes','map':dict(sorted(result.items())),'noJump':no_jump_register('CST209'),'supplementaryUnits':{'5':SUPPLEMENTARY_NOTE},'decisions':DECISIONS}


if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--check',action='store_true');args=ap.parse_args()
    path=ROOT/'assets/data/topic-map-CST209.json';text=json.dumps(build(),ensure_ascii=False,indent=2)+'\n'
    if args.check:assert path.read_text()==text,'CST209 topic map is stale'
    else:path.write_text(text)
    print(f'CST209: {len(build()["map"])} normalized topics, 105 question assignments, {len(DECISIONS)} decisions')
