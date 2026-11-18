#!/usr/bin/env python3
"""Audit PYQ -> unit-topic routing for one subject, mirroring focusQuestionTopic().

focusQuestionTopic() in assets/js/unit-discovery.js resolves a stored PYQ `topic`
to an authored heading. This script reproduces that scoring from the shipped
unit pages so the routing figure can be re-run and reviewed, instead of living
in a scratch file.

Scoring (kept in lockstep with the JS):
  - a topic may be several sub-topics joined by "/" -- each segment is scored
    on its own and the best segment wins;
  - terms are singularised so "loops" matches a heading containing "loop";
  - exact title 100, substring 90, else matched-terms / total-terms;
  - the current unit's headings are preferred; when none clears 0.5 the other
    units' headings are searched too, and a win elsewhere is a redirect;
  - below 0.5 everywhere = unmatched.

Usage:
  python3 scripts/audit_topic_routing.py                # summary
  python3 scripts/audit_topic_routing.py --verbose      # per-question table
  python3 scripts/audit_topic_routing.py --fail-unmatched
"""
import argparse
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FLOOR = 0.5


def singular(word):
    return word[:-1] if len(word) > 3 and word.endswith('s') else word


def terms_for(text):
    return [singular(w) for w in re.split(r'[^\w]+', text) if len(w) > 2]


def headings(raw):
    """Every h2/h3/h4 with an id, or its nearest enclosing section id."""
    sections = [(m.group(1), m.start()) for m in re.finditer(r'<section\b[^>]*id="([^"]+)"', raw)]
    found = []
    for m in re.finditer(r'<h([234])\b([^>]*)>(.*?)</h\1>', raw, re.S | re.I):
        idm = re.search(r'id="([^"]*)"', m.group(2))
        anchor = idm.group(1) if idm else None
        if not anchor:
            prior = [s for s in sections if s[1] <= m.start()]
            anchor = prior[-1][0] if prior else None
        title = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', m.group(3)))).strip().lower()
        if title and anchor:
            found.append((title, anchor))
    return found


def score_against(title, target, target_terms):
    if title == target:
        return 100.0
    if target in title:
        return 90.0
    title_words = set(terms_for(title))
    matched = sum(1 for term in target_terms if term in title_words)
    return matched / len(target_terms) if target_terms else 0.0


def score_title(title, needle):
    segments = [p.strip() for p in re.split(r'[/,;]+', needle) if p.strip()] or [needle]
    best = 0.0
    for target in segments:
        target_terms = terms_for(target)
        if target_terms:
            best = max(best, score_against(title, target, target_terms))
    return best


def load_units(subject):
    return {u: headings((ROOT / f'subjects/{subject}/units/unit-{u}.html').read_text(encoding='utf-8'))
            for u in range(1, 6)
            if (ROOT / f'subjects/{subject}/units/unit-{u}.html').exists()}


def segments_covered(title, needle):
    """How many of the topic's own segments this heading covers."""
    covered = 0
    for segment in (p.strip() for p in re.split(r'[/,;]+', needle) if p.strip()):
        target_terms = terms_for(segment)
        if target_terms and score_against(title, segment, target_terms) > 0:
            covered += 1
    return covered


def _pick(entries, needle, home, best):
    """Best entry, breaking equal scores on segment coverage rather than order."""
    for title, anchor in entries:
        score = score_title(title, needle)
        covered = segments_covered(title, needle)
        if score > best[0] or (score == best[0] and score > 0
                               and covered > segments_covered(best[2] or '', needle)):
            best = (score, anchor, title, home)
    return best


def route(units, unit, topic):
    needle = re.sub(r'\s+', ' ', str(topic or '')).strip().lower()
    best = _pick(units.get(unit, []), needle, unit, (0.0, None, None, unit))
    if best[0] >= FLOOR:
        return best
    for other, entries in units.items():
        if other == unit:
            continue
        best = _pick(entries, needle, other, best)
    return best


def questions(subject, papers):
    rows = []
    for path in sorted((ROOT / '_data' / subject).glob(f'{subject}-{papers}*.json')):
        for q in json.loads(path.read_text(encoding='utf-8')).get('questions', []):
            rows.append(q)
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--subject', default='CST201')
    ap.add_argument('--papers', default='P00[3-6]', help='glob fragment for the paper window')
    ap.add_argument('--verbose', action='store_true')
    ap.add_argument('--fail-unmatched', action='store_true')
    args = ap.parse_args()

    units = load_units(args.subject)
    counts = {'same-unit': 0, 'redirect': 0, 'unmatched': 0}
    unmatched = []
    for q in questions(args.subject, args.papers):
        current = q.get('unit') or 1
        score, anchor, title, home = route(units, current, q.get('topic'))
        if score < FLOOR:
            kind = 'unmatched'
            unmatched.append(q)
        elif home == current:
            kind = 'same-unit'
        else:
            kind = 'redirect'
        counts[kind] += 1
        if args.verbose:
            print(f"{kind:10} {q['id']:20} u{current} {score:5.2f} -> u{home} #{anchor}  [{q.get('topic')}]")

    total = sum(counts.values())
    print(f"{args.subject} {args.papers}: {total} questions")
    print('  ' + ' · '.join(f'{k}={v}' for k, v in counts.items()))
    if unmatched:
        print('  unmatched:')
        for q in unmatched:
            print(f"    {q['id']}  topic={q.get('topic')!r}")
    if args.fail_unmatched and counts['unmatched']:
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
