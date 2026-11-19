#!/usr/bin/env python3
"""Render the editorial CST207 topic map from question groups, not fuzzy scores."""
import json
from collections import Counter

from audit_topic_routing import ROOT, load_units, questions

SUBJECT = 'CST207'
WINDOW = 'P00[3-6]'
# Each row is an audited concept destination and four per-paper question lists.
# Duplicate topic labels must agree. Omitted 6:24 has no single topic.
GROUPS = (
    (1, 'von-neumann-architecture-and-cpu-organization', '1 5 26', '1 7 16', '8', '1 16'),
    (1, 'system-bus-cpu-registers-and-memory-write-cycle', '11 14 19 21', '13', '', '3 5 14'),
    (1, 'digital-logic-parity-and-error-codes', '3', '', '', ''),
    (1, 'micro-operations-and-shift-operations', '6', '', '13', ''),
    (1, 'floating-point-and-ieee-754', '20', '22', '5', '21'),
    (1, 'number-representation-fixed-point-and-twos-complement', '', '', '20', ''),
    (2, 'control-unit-control-memory-and-instruction-cycle', '9 34', '', '9', '9 10 23'),
    (2, 'risc-pipeline-and-risc-vs-cisc', '4 8 16 30', '20', '', '7'),
    (2, 'pipeline-speedup-and-hazards', '22 31', '23', '4 11 21', '11 18'),
    (2, 'booth-multiplication-and-restoring-division', '27', '', '14 16', '22'),
    (2, 'flynn-taxonomy-and-vector-processing', '', '8', '22', ''),
    (3, '8086-architecture-biu-eu-pinout-and-modes', '32', '18 21', '10 17', '15 19'),
    (3, '8086-status-register-flags', '', '', '', '6'),
    (3, '8086-addressing-modes-and-effective-address', '24', '', '1 7 15', '12 17'),
    (3, 'instruction-formats-and-zero-address-stack-instructions', '', '2 17', '', ''),
    (4, 'assembly-mov-add-and-simple-programs', '', '5', '3', ''),
    (5, 'memory-hierarchy-organization-and-memory-size', '2 12 13 17 23', '9 10 14', '', '2 13'),
    (5, 'io-transfer-and-direct-memory-access', '18 25', '', '', ''),
    (5, 'cache-hit-miss-ratio-and-average-access-time', '7 10 28', '11 12 19', '6 12', '8'),
    (5, 'cache-memory-mapping-and-write-policies', '29', '', '19', '20'),
    (5, 'virtual-memory-paging-and-tlb', '15 33', '3 4 6 15', '2', '4'),
    (5, 'fifo-and-lru-page-replacement', '', '', '18', ''),
)

# Store every unequal-mark decision, including composites whose subparts share
# one heading. Equal/choice items and imperfect source labels are noted too.
DECISIONS = {
    'P003-Q17': 'Flagged: D is the recorded model answer, but B is also true. Choose the RAM/ROM hierarchy explanation; do not certify or rewrite the answer.',
    'P003-Q26': 'Equal 4/4: take the specific Von Neumann diagram; IEEE layouts have their own heading in the same unit.',
    'P003-Q27': 'Equal 4/4, cross-unit: restoring division includes a worked process; BIU/EU remains in Unit 3.',
    'P003-Q28': '3m definitions / 5m EAT: hit/miss heading covers both and prioritises timing.',
    'P003-Q29': '3m mapping definition / 5m direct mapping and disadvantage: select the mapping block with the direct-placement trace.',
    'P003-Q30': 'Equal 4/4: select the RISC/CISC comparison; 8086 addressing is in Unit 3.',
    'P003-Q31': 'Equal 4/4: pipeline hazards are the first and heavier recurring cluster, with Flynn nearby.',
    'P003-Q33': 'Flagged: choose two of TLB/DMA/VM. Two choices share the paging/TLB heading, so prefer that over DMA alone.',
    'P003-Q34': '3m micro-operation / 5m microprogrammed control: the control-unit heading wins despite the Unit 1 subpart.',
    'P004-Q1': 'The stem asks about stored programs, not Flynn; ignore the unrelated label segment.',
    'P004-Q5': 'MOV immediate is an assembly operation, not a number representation question.',
    'P004-Q16': 'Equal 4/4: Von Neumann is the named architecture; its heading links directly to the bus and processor–memory material.',
    'P004-Q17': 'Equal 4/4: take the exact stack-expression code; instruction cycle also has a Unit 2 diagram.',
    'P004-Q18': 'Equal 4/4: pick the specific minimum/maximum-mode diagram and explanation; addressing has a nearby heading.',
    'P004-Q19': 'Equal 4/4: take the exact 80 ns EAT worked case, beside the mapping material. The shared label also serves hit-rate MCQs.',
    'P004-Q20': 'Flagged: 4m RISC/CISC and one of two 4m short notes; the mandatory comparison is the only common destination.',
    'P004-Q21': '2m biased exponent / 6m architecture and pinout: route to the 8086 DIP/BIU/EU material.',
    'P004-Q22': 'Equal 4/4: the narrower IEEE single/double layout is the destination; Flynn remains in Unit 2.',
    'P005-Q15': 'Equal 4/4: 8086 addressing has the exact mode examples; the architecture half is in Unit 1.',
    'P005-Q17': '5m internal architecture / 3m interrupts: use the 8086 BIU/EU heading, not the interrupt heading.',
    'P005-Q19': '5m mapping / 3m write policy: the mapping heading covers the larger part and both write policies.',
    'P005-Q20': '3m fixed/floating / 2m signed encoding / 3m DMA: related Unit 1 parts total 5m; take the fixed-point and negative-number example, not the DMA extension.',
    'P005-Q21': '3m pipeline concept / 5m hazards: the hazards/speedup heading covers both; duplicate label in P004 covers the same material at 4/4.',
    'P005-Q22': 'Flagged: choose two of Vector/RISC Pipeline/Cache hit-miss; no unique pair. Use the most distinctive Vector Processor explanation, with a second option in the same unit.',
    'P006-Q5': 'Flagged: MDR is the printed-key model answer; it is not a direct disk interface. Use the processor-memory register path, not a storage-device heading.',
    'P006-Q6': 'Status bits are flags; select the 8086 FLAGS heading (with the general CF/OF distinction), not an RTL section.',
    'P006-Q12': 'The immediate form is the operative addressing detail. The notation is generic, not native 8086 syntax.',
    'P006-Q16': '3m stored program / 5m processor-memory connection. Label is shared with P005-Q8; keep the common Von Neumann heading and put a direct processor-memory link and register-path explanation at that landing.',
    'P006-Q17': '2m definition / 6m examples: 8086 addressing heading immediately leads to eight worked forms.',
    'P006-Q18': '2m pipelining / 3m RISC/CISC / 3m hazards: pipeline concepts plus hazards carry 5m; comparison follows in the same unit.',
    'P006-Q19': '5m BIU/EU / 3m min/max: the 8086 architecture heading opens with the BIU/EU diagram and leads into the pinout/mode material.',
    'P006-Q20': '5m direct cache mapping / 3m virtual memory: select cache mapping; VM has a separate anchor.',
    'P006-Q21': 'Equal 4/4: the IEEE heading starts with the comparison table and leads into single/double layouts.',
    'P006-Q22': '2m ASR / 6m Booth: use the Booth heading with the exact −11 × −9 trace.',
    'P006-Q23': '2m instruction cycle / 6m functional control-memory diagram: choose the microprogrammed control heading and show both.',
    'P006-Q24': 'No jump, no topic. This unlabelled choice pool combines four topics across two units. Leave the stored unit overview and never highlight a practice section.',
}


def build():
    window = {q['id'].split('-', 1)[1]: q for q in questions(SUBJECT, WINDOW)}
    unit_headings = {unit: {anchor for _, anchor in entries} for unit, entries in load_units(SUBJECT).items()}
    result = {}
    seen = Counter()
    for unit, anchor, *papers in GROUPS:
        if anchor not in unit_headings[unit]:
            raise ValueError(f'Unknown destination: U{unit} #{anchor}')
        for i, paper in enumerate(papers, start=3):
            for n in paper.split():
                ref = f'P{i:03d}-Q{n}'
                seen[ref] += 1
                topic = ' '.join(window[ref]['topic'].lower().split())
                if result.setdefault(topic, [unit, anchor]) != [unit, anchor]:
                    raise ValueError(f'Conflicting topic: {topic}')
    if seen != Counter(set(window) - {'P006-Q24'}):
        raise ValueError('Editorial groups must cover each labelled question exactly once')
    for ref, q in window.items():
        if len({s['marks'] for s in q.get('subparts', [])}) > 1 and ref not in DECISIONS:
            raise ValueError(f'Missing unequal-mark decision: {ref}')
    return {'schemaVersion': 1, 'subject': SUBJECT,
            'note': 'Mode A. Strict P003–P006 window. P006-Q24 is a choice pool with no single topic; no jump. See decisions for editorial choices.',
            'map': dict(sorted(result.items())), 'decisions': DECISIONS}


if __name__ == '__main__':
    dest = ROOT / 'assets/data/topic-map-CST207.json'
    dest.write_text(json.dumps(build(), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
