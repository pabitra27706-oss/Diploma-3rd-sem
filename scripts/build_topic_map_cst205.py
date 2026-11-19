#!/usr/bin/env python3
"""Mode A editorial Data Structures (CST205) map, authored LAST after Phase 14 headings.

Every 2023-2026 (P003-P006) question was read against its stem and subpart
marks; stored unit tags were not trusted (they shift Stacks/Queues into U1,
Linked Lists into U2 and Trees into U3). Regeneration never writes frozen
papers or quiz banks. Run with --check to verify the committed JSON.
"""
import argparse
import json
from pathlib import Path

from audit_topic_routing import ROOT, load_units, no_jump_register, questions

# normalized stored topic -> [true syllabus unit, concept anchor]
MAP = {
    'adt / stacks': [2, 'stacks-operations-on-stack'],
    'adt / threaded trees / traversal': [4, 'threaded-binary-trees-exam-note'],
    'arrays': [1, 'arrays-and-index-addressing'],
    'arrays / index': [1, 'arrays-and-index-addressing'],
    'arrays / linked lists': [3, 'introduction-array-vs-linked-list'],
    'avl / b-trees': [4, 'avl-trees-balance-factor-and-rotations'],
    'avl / balance factor': [4, 'avl-trees-balance-factor-and-rotations'],
    'avl trees': [4, 'avl-trees-balance-factor-and-rotations'],
    'b-trees': [4, 'b-trees-order-m-and-construction'],
    'binary trees': [4, 'binary-trees-array-and-linked-representation'],
    'binary trees / array representation': [4, 'binary-trees-array-and-linked-representation'],
    'binary trees / bst': [4, 'binary-search-tree-bst-property-and-operations'],
    'binary trees / height': [4, 'binary-tree-properties-proofs-and-catalan-counts'],
    'binary trees / leaves': [4, 'trees-tree-terminology'],
    'binary trees / levels': [4, 'binary-tree-properties-proofs-and-catalan-counts'],
    'binary trees / reconstruction': [4, 'binary-tree-reconstruction'],
    'binary trees / terminology': [4, 'trees-tree-terminology'],
    'bst / inorder': [4, 'binary-search-tree-bst-property-and-operations'],
    'bst / stack / queue / b-tree': [4, 'binary-search-tree-bst-property-and-operations'],
    'bst property': [4, 'binary-search-tree-bst-property-and-operations'],
    'bst traversal': [4, 'binary-search-tree-bst-property-and-operations'],
    'circular / singly linked lists': [3, 'singly-insertion-operations'],
    'circular linked list': [3, 'circular-singly-traversal-of-circular-linked-list'],
    'circular linked lists': [3, 'circular-singly-traversal-of-circular-linked-list'],
    'circular queue': [2, 'circular-queues-deques-and-priority-queues'],
    'circular queues': [2, 'circular-queues-deques-and-priority-queues'],
    'circular queues / deque': [2, 'circular-queues-deques-and-priority-queues'],
    'data structure classification': [1, 'classification'],
    'data structures / arrays': [1, 'classification'],
    'data structures / classification': [1, 'classification'],
    'data structures / operations': [1, 'operations'],
    'data structures / storage': [1, 'terminology-4-data-structure'],
    'deques': [2, 'circular-queues-deques-and-priority-queues'],
    'doubly linked list / polynomial / arrays': [3, 'header-linked-lists-and-polynomials'],
    'doubly linked lists': [3, 'doubly-linked-lists-insertion-and-deletion'],
    'doubly linked lists / insertion': [3, 'doubly-linked-lists-insertion-and-deletion'],
    'expressions / postfix': [2, 'infix-postfix-and-prefix-conversion'],
    'full binary trees': [4, 'tree-types-1-full-binary-tree'],
    'graph traversal': [4, 'graph-traversal-bfs-vs-dfs'],
    'graphs': [4, 'graphs-graph-terminology'],
    'graphs / bfs': [4, 'graph-traversals-bfs-breadth-first-search'],
    'graphs / classification': [1, 'classification'],
    'graphs / connectivity': [4, 'graphs-graph-terminology'],
    'graphs / degree': [4, 'graphs-graph-terminology'],
    'graphs / representation': [4, 'graphs-graph-representations'],
    'infix / queue / graph traversal': [2, 'infix-postfix-and-prefix-conversion'],
    'linked lists': [3, 'introduction-structure-of-a-node'],
    'linked lists / applications': [3, 'applications-1-stack-using-linked-list'],
    'linked lists / polynomials': [3, 'header-linked-lists-and-polynomials'],
    'linked lists / searching': [3, 'singly-linked-lists-searching-and-traversal'],
    'linked-list node': [3, 'introduction-structure-of-a-node'],
    'queue': [2, 'queues-introduction-to-queue'],
    'queues': [2, 'queues-types-of-queues'],
    'queues / complexity': [2, 'queues-operations-on-queue'],
    'queues / fifo': [2, 'queues-introduction-to-queue'],
    'queues / operations': [2, 'queues-operations-on-queue'],
    'queues / types': [2, 'queues-types-of-queues'],
    'recursion / linked list': [2, 'recursion-gcd-and-hanoi-worked-traces'],
    'recursion / postfix': [2, 'recursion-gcd-and-hanoi-worked-traces'],
    'recursion / postfix evaluation': [2, 'comparisons-recursion-vs-iteration'],
    'recursion / stack': [2, 'recursion-introduction-to-recursion'],
    'recursion / tower of hanoi': [2, 'recursion-gcd-and-hanoi-worked-traces'],
    'singly linked list': [3, 'singly-traversal-and-display'],
    'stack / queue / deque': [2, 'stacks-operations-on-stack'],
    'stack operations': [2, 'stacks-operations-on-stack'],
    'stacks': [2, 'stacks-operations-on-stack'],
    'stacks / applications': [2, 'stacks-applications-of-stack'],
    'stacks / lifo': [2, 'stacks-introduction-to-stack'],
    'stacks / overflow': [2, 'stacks-operations-on-stack'],
    'stacks / postfix': [2, 'postfix-evaluation-using-stack'],
    'stacks / prefix conversion': [2, 'infix-postfix-and-prefix-conversion'],
    'threaded binary trees': [4, 'threaded-binary-trees-exam-note'],
    'tree reconstruction': [4, 'binary-tree-reconstruction'],
    'tree reconstruction / linked lists': [4, 'binary-tree-reconstruction'],
    'tree traversal': [4, 'comparisons-all-tree-traversals-compared'],
    'tree traversal / bfs': [4, 'traversals'],
    'trees': [4, 'trees-tree-terminology'],
    'trees / depth': [4, 'trees-tree-terminology'],
    'trees / reconstruction': [4, 'binary-tree-reconstruction'],
    'trees / traversal': [4, 'comparisons-all-tree-traversals-compared'],
}

DECISIONS = {
    # Unequal-mark multi-part topics (the standard's probe set).
    'data structures / classification': '3+3+2 (primitive/non-primitive; linear/non-linear; data type vs data structure): classification heading covers all three.',
    'circular queues / deque': '5m circular queue + 3m deque: the combined circular-queues/deques heading covers both, majority first.',
    'graphs / bfs': '3m post-order traversal + 2m BFS: BFS heading chosen as the distinctive second half; post-order is in the locked traversals section of the same unit.',
    'linked lists / polynomials': 'Polynomial representation heading serves the polynomial question; linked-list basics are the preceding sections of the same unit.',
    'queues / operations': '5m insert/delete + 3m false-overflow: false-overflow diagnosis lives inside the locked queue-types heading.',
    'graphs / representation': 'Flagged cross-unit: adjacency representation shares the label with a Unit-2 MCQ on O(n^2) array bounds; the graph representation sections are the richer target (title lists both).',
    'adt / stacks': '2m ADT + 2m LIFO + 4m PUSH/POP: stack-operations heading wins on marks; the ADT minority is a read-time cross-unit compromise, flagged.',
    'stacks / postfix': '5m infix-to-postfix algorithm-conversion: conversion heading wins over evaluation on marks.',
    'arrays / linked lists': '3m array vs linked list + 5m insert-at-beginning: comparison heading chosen as the shared entry; the majority insertion algorithm is the locked heading in the next section. Flagged.',
    'circular / singly linked lists': '2m draw circular list + 6m insert-at-end (singly): locked singly-insertion heading wins on marks; circular drawing is in the following section.',
    'data structures / operations': '2m location/UB-LB objective plus define-operations paper item: operations heading covers both.',
    'stack / queue / deque': '6m stack PUSH/POP + queue applications, 2m deque: stack-operations wins clearly on marks; deque note is in the Queues section of the same unit.',
    'doubly linked list / polynomial / arrays': '2m DLL advantages + 3m polynomial + 3m linked-list vs array: header/polynomial heading chosen for the distinctive middle part; all three live in Unit 3.',
    'tree reconstruction / linked lists': '6m tree reconstruction + 2m linked-list advantages: reconstruction wins on marks; its table traces this exact In/Pre pair.',
    'bst / stack / queue / b-tree': '5m BST concept + 3m stack vs queue: BST heading wins on marks. The stored topic also names B-trees, which the stem does not ask; no B-tree landing is forced.',
    'infix / queue / graph traversal': '5m infix + queue deletion, 3m BFS vs DFS: infix-conversion heading wins on marks and sits in the same unit as queue operations; the BFS-vs-DFS minority is in Unit 4. Flagged.',
    # Equal-mark or cross-unit judgements worth a written reason.
    'avl / b-trees': 'Equal 4+4 (AVL from month names; B-tree definition): AVL heading chosen because it traces the exact month sequence; the B-tree heading follows immediately in the same section. (P003-Q32)',
    'tree traversal / bfs': 'Equal 4+4 (tree pre/post traversal; BFS algorithm): locked traversals section chosen; its level-order part is BFS on a tree and the graph BFS heading follows later in the unit. (P005-Q25)',
    'recursion': 'Shared label spans factorial/GCD/Hanoi questions; GCD/Hanoi traces heading chosen as the worked-example home.',
    'linked lists': 'One stored label serves a definition MCQ, a header/circular/insert composite, a four-pointer objective and two "implements stack/queue" items. A topic-only map cannot split them; the node-structure heading is the least-wrong single entry and the specific headings are one section away. Recorded, not hidden.',
    'queues': 'One label serves a definition MCQ, a priority/circular composite and a linear-vs-circular composite: routed to the locked queue-types heading inside the Queues section, whose earlier headings carry the definition and operations.',
    'graphs / classification': 'March 2023 item asks which structure is non-linear: Unit 1 classification with a graph as example; the map corrects the stored Unit 4 tag at read time.',
    'trees / tree construction': 'Flagged: post-order alone (P003-Q12) does not determine a unique tree; reconstruction opening states that limit instead of inventing a shape.',
}

PAPER_SECTIONS = {'mcqs', 'short-questions', 'long-questions', 'practice', 'revision', 'videos', 'overview', 'formulas', 'definitions', 'comparisons'}


def build():
    qs = questions('CST205', 'P00[3-6]')
    assert len(qs) == 106, len(qs)
    units = load_units('CST205')
    anchors = {u: {a for _, a in hs} for u, hs in units.items()}
    seen_topics = set()
    for q in qs:
        topic = ' '.join((q.get('topic') or '').lower().split())
        seen_topics.add(topic)
        assert topic in MAP, (q['id'], topic)
    assert seen_topics == set(MAP), (seen_topics - set(MAP), set(MAP) - seen_topics)
    for topic, (unit, anchor) in MAP.items():
        assert unit in anchors, (topic, unit)
        assert anchor in anchors[unit], (topic, unit, anchor)
        assert anchor not in PAPER_SECTIONS, (topic, anchor)
    return {
        'schemaVersion': 1,
        'subject': 'CST205',
        'window': 'P003–P006 (2023–2026); P001/P002 excluded',
        'mode': 'A — frozen paper and quiz bytes',
        'map': dict(sorted((k, list(v)) for k, v in MAP.items())),
        'noJump': no_jump_register('CST205'),
        'decisions': DECISIONS,
    }


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    path = ROOT / 'assets/data/topic-map-CST205.json'
    text = json.dumps(build(), ensure_ascii=False, indent=2) + '\n'
    if args.check:
        assert path.read_text(encoding='utf-8') == text, 'CST205 topic map is stale'
    else:
        path.write_text(text, encoding='utf-8')
    built = build()
    print(f"CST205: {len(built['map'])} normalized topics, 106 question assignments, {len(DECISIONS)} decisions")
