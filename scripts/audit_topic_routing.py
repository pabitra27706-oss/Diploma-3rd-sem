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
  python3 scripts/audit_topic_routing.py --maps         # Phase 17: all five maps,
                                                        # runtime (map-first) view
  python3 scripts/audit_topic_routing.py --maps --fail  # non-zero on any violation

--maps reports, per subject: entries, calibrated-window questions, mapped,
no-jump (explicit decision), unmapped, unit corrections and generic landings
on the runtime (map-first) path, plus the matcher-only full-corpus gauge against
the 2026-11-18 baseline in docs/phases/topic-map-standard.md section 6.
"""
import argparse
import html
import json
import re
import sys
from html.parser import HTMLParser
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


def _rank(title, needle):
    """Rank a heading by (segments covered, score).

    Coverage must outrank the score. Taking the plain maximum over segments
    means one exact segment match (100) beats a heading that covers BOTH
    segments at 90 -- so "Recursion / stack" landed on the one-line
    `#overview-recursion` card instead of the full `#functions-and-recursion`
    section, and "Storage classes / parameter passing" likewise lost the
    section that answers it. Breadth first, then quality.
    """
    return (segments_covered(title, needle), score_title(title, needle))


def _better(candidate, incumbent, needle):
    cref, iref = _rank(candidate, needle), _rank(incumbent, needle)
    if cref[0] == 0 and iref[0] == 0:
        return cref[1] > iref[1]
    return cref > iref


def _pick(entries, needle, home, best):
    """Best entry by coverage-then-score, independent of document order."""
    for title, anchor in entries:
        if _better(title, best[2] or '', needle):
            best = (score_title(title, needle), anchor, title, home)
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


# ---------------------------------------------------------------------------
# Phase 17: runtime mirror and the cross-subject map report.
# ---------------------------------------------------------------------------

# Mirrors of SYLLABUS_UNITS / SUPPLEMENTARY_UNITS in assets/js/unit-discovery.js.
# tests/test_topic_map.py asserts these equal the JavaScript literals.
DECLARED_UNITS = {'CST201': 5, 'CST203': 5, 'CST205': 4, 'CST207': 5, 'CST209': 4}
SUPPLEMENTARY_UNITS = {'CST209': [5]}
PAPER_SECTION_ANCHORS = frozenset({'mcqs', 'short-questions', 'long-questions',
                                   'practice', 'revision', 'videos'})
WINDOW = 'P00[3-6]'
FULL_CORPUS = 'P'

# Matcher-only baseline measured 2026-11-18, full corpus (standard section 6).
# (same-unit, redirect, unmatched, generic-landings, questions)
BASELINE = {
    'CST201': (167, 11, 20, 40, 198),
    'CST203': (129, 11, 30, 5, 170),
    'CST205': (112, 64, 18, 0, 194),
    'CST207': (77, 60, 58, 0, 195),
    'CST209': (124, 29, 14, 9, 167),
}


def normalise(value):
    """Same key rule as the runtime: collapse whitespace, trim, lowercase."""
    return re.sub(r'\s+', ' ', str(value or '')).strip().lower()


def is_generic(anchor):
    """Overview / intro / fundamentals cards: no routing information."""
    return bool(anchor) and (anchor.startswith('overview') or anchor in ('intro', 'fundamentals'))


class _RuntimeHeadings(HTMLParser):
    """Faithful mirror of entriesFor() in assets/js/unit-discovery.js.

    Every h2/h3/h4 with text is an entry. Its anchor is its own id; a missing id
    or a runtime `section-N` id falls back to the nearest ancestor section that
    has an id. Headings inside `.section-anchor-link` are ignored, as
    cleanHeadingText() does. Every id on the page is collected too, so an anchor
    that exists but is not a heading entry (which the runtime silently skips)
    can be told apart from one that is missing.
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.entries = []
        self._sections = []          # ids of open <section> elements ('' if none)
        self._heading = None         # open h2/h3/h4 tag
        self._heading_id = ''
        self._heading_section = ''
        self._text = []
        self._anchor_link_depth = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id') is not None:
            self.ids.add(a['id'])
        classes = (a.get('class') or '').split()
        if tag == 'section':
            self._sections.append(a.get('id') or '')
        if self._heading is not None and 'section-anchor-link' in classes:
            self._anchor_link_depth += 1
        elif self._heading is None and tag in ('h2', 'h3', 'h4'):
            self._heading = tag
            self._heading_id = a.get('id') or ''
            named = [sid for sid in self._sections if sid]
            self._heading_section = named[-1] if named else ''
            self._text = []
            self._anchor_link_depth = 0

    def handle_endtag(self, tag):
        if self._heading is not None and tag == self._heading:
            title = normalise(''.join(self._text))
            anchor = self._heading_id
            if not anchor or re.fullmatch(r'section-\d+', anchor):
                anchor = self._heading_section
            if title and anchor and not re.fullmatch(r'section-\d+', anchor):
                self.entries.append((title, anchor))
            self._heading = None
        elif self._heading is not None and self._anchor_link_depth and tag != self._heading:
            self._anchor_link_depth -= 1
        elif tag == 'section' and self._sections:
            self._sections.pop()

    def handle_data(self, data):
        if self._heading is not None and not self._anchor_link_depth:
            self._text.append(data)


def runtime_units(subject):
    """{unit: (entries, ids)} as the browser sees each unit page."""
    out = {}
    for unit in range(1, 6):
        path = ROOT / f'subjects/{subject}/units/unit-{unit}.html'
        if not path.exists():
            continue
        parser = _RuntimeHeadings()
        parser.feed(path.read_text(encoding='utf-8'))
        out[unit] = (parser.entries, parser.ids)
    return out


def load_register(subject):
    """(map, noJump) from assets/data/topic-map-<subject>.json. Never _data/."""
    path = ROOT / 'assets' / 'data' / f'topic-map-{subject}.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    return data.get('map', {}), data.get('noJump', {})


def route_runtime(units, mapping, no_jump, unit, topic):
    """What the browser does for one question (assets/js/unit-discovery.js).

    1. A noJump key: no jump, no highlight (the question opens at the unit top).
    2. An exact map key whose anchor is a real heading entry: that heading,
       in its mapped unit (a stored-unit correction if the unit differs).
    3. Otherwise, or when the mapped anchor is stale: the matcher.
    Returns (kind, landing_unit, anchor, score).
    """
    needle = normalise(topic)
    if needle in no_jump:
        return ('no-jump', None, None, None)
    if needle in mapping:
        mapped_unit, anchor = mapping[needle]
        if anchor in {a for _t, a in units.get(mapped_unit, ([], set()))[0]}:
            return ('mapped', mapped_unit, anchor, 100.0)
    matcher_units = {u: list(entries) for u, (entries, _ids) in units.items()}
    score, anchor, _title, home = route(matcher_units, unit, topic)
    if score < FLOOR:
        return ('unmatched', None, None, score)
    return ('matcher', home, anchor, score)


PLACEHOLDER_TOPICS = ('short answer', 'group a / objective', 'group c / long answer')
SUPPLEMENTARY_NOTE = ('CO5 supplementary unit: topic lookup only, never Prev/Next. '
                      'The official syllabus declares units 1-4; validate_syllabus.py '
                      'reports the PYQ records tagged to unit 5 as an open finding.')


def no_jump_register(subject):
    """Explicit "no jump, no topic" decisions for one subject (Phase 17, 17.4).

    The stored label is a paper-section name, not a concept. Assigning it a
    section would need topic inference from the stem (not permitted here) or a
    paper-section anchor (navigation, forbidden by standard section 3.4). So the
    question opens at the unit top without a jump, and the register says so.
    """
    counts = {}
    for q in questions(subject, FULL_CORPUS):
        key = normalise(q.get('topic'))
        counts[key] = counts.get(key, 0) + 1
    register = {}
    if subject == 'CST207':
        register['short notes'] = (
            'No jump, no topic: an unlabelled choice pool that spans two units '
            '(CST207-P006-Q24). decisions["P006-Q24"] records the reason.')
    for label in PLACEHOLDER_TOPICS:
        if counts.get(label):
            register[label] = (
                f'Placeholder label, not a topic: {counts[label]} archived question(s) '
                'store this paper-section name. No concept can be assigned without '
                'inferring from the stem, and the paper-section anchors are navigation. '
                'The question opens at the unit top with no jump and no highlight.')
    return dict(sorted(register.items()))


def subject_report(subject):
    mapping, no_jump = load_register(subject)
    rt = runtime_units(subject)
    declared = DECLARED_UNITS[subject]
    allowed_units = set(range(1, declared + 1)) | set(SUPPLEMENTARY_UNITS.get(subject, []))
    problems = []

    for key in mapping:
        if normalise(key) != key:
            problems.append(f'key not normalised: {key!r}')
    for key, (unit, anchor) in mapping.items():
        if anchor in PAPER_SECTION_ANCHORS:
            problems.append(f'paper-section anchor: {key!r} -> #{anchor}')
        if unit not in allowed_units:
            problems.append(f'undeclared unit {unit}: {key!r}')
        entries = rt.get(unit, ([], set()))[0]
        if anchor not in {a for _t, a in entries}:
            problems.append(f'anchor is not a heading entry: {key!r} -> U{unit} #{anchor}')
    for key in no_jump:
        if normalise(key) != key:
            problems.append(f'noJump key not normalised: {key!r}')
        if key in mapping:
            problems.append(f'key is both mapped and noJump: {key!r}')

    window = questions(subject, WINDOW)
    # unmapped = no map key and no no-jump decision, i.e. the matcher decides.
    # Acceptance (standard section 5.1) is unmapped == 0. A matcher result is
    # counted separately as a fallback, so a question that falls back cannot be
    # hidden inside a green "mapped" total.
    counts = {'mapped': 0, 'no-jump': 0, 'unmapped': 0, 'fallback-unmatched': 0,
              'generic': 0, 'corrections': 0}
    for q in window:
        kind, unit, anchor, _score = route_runtime(
            rt, mapping, no_jump, q.get('unit') or 1, q.get('topic'))
        if kind == 'no-jump':
            counts['no-jump'] += 1
            continue
        if kind == 'mapped':
            counts['mapped'] += 1
        else:
            counts['unmapped'] += 1
            if kind == 'unmatched':
                counts['fallback-unmatched'] += 1
        counts['corrections'] += int(unit is not None and unit != (q.get('unit') or 1))
        if kind in ('mapped', 'matcher') and is_generic(anchor):
            counts['generic'] += 1

    full = {'same-unit': 0, 'redirect': 0, 'unmatched': 0, 'generic': 0}
    matcher_units = {u: list(entries) for u, (entries, _ids) in rt.items()}
    for q in questions(subject, FULL_CORPUS):
        current = q.get('unit') or 1
        score, anchor, _title, home = route(matcher_units, current, q.get('topic'))
        if score < FLOOR:
            full['unmatched'] += 1
        elif home == current:
            full['same-unit'] += 1
        else:
            full['redirect'] += 1
        if score >= FLOOR and is_generic(anchor):
            full['generic'] += 1

    return {'subject': subject, 'entries': len(mapping), 'no_jump_keys': len(no_jump),
            'window': len(window), 'window_counts': counts, 'full': full,
            'full_total': sum(full[k] for k in ('same-unit', 'redirect', 'unmatched')),
            'problems': problems}


def maps_report(fail=False):
    failed = False
    print('Phase 17 topic-map report (runtime / map-first view, calibrated window '
          f'{WINDOW})')
    header = ('subject', 'entries', 'window-Qs', 'mapped', 'no-jump', 'unmapped',
              'generic', 'corrections', 'violations')
    print('  ' + ' | '.join(f'{h:>11}' for h in header))
    reports = []
    for subject in DECLARED_UNITS:
        r = subject_report(subject)
        reports.append(r)
        c = r['window_counts']
        row = (subject, r['entries'], r['window'], c['mapped'], c['no-jump'],
               c['unmapped'], c['generic'], c['corrections'], len(r['problems']))
        print('  ' + ' | '.join(f'{v:>11}' for v in row))
        failed = failed or bool(r['problems']) or c['unmapped'] > 0 or c['generic'] > 0
    print()
    print('Matcher-only gauge, full corpus, against the 2026-11-18 baseline.')
    print('  Caution: unit pages changed after that baseline (Phases 13-16), so the')
    print('  gauge is NOT like-for-like. Reconciled in docs/phases/17-topic-map-crosscheck/record.md.')
    print('  The baseline reproduces exactly when the matcher runs on the 99942c0 pages.')
    print('  subject  same/redirect/unmatched (of N)   unmatched base   generic base')
    for r in reports:
        f = r['full']
        base = BASELINE[r['subject']]
        worse = f['unmatched'] > base[2] or f['generic'] > base[3]
        failed = failed or worse
        print(f"  {r['subject']}  {f['same-unit']:>4}/{f['redirect']:>4}/{f['unmatched']:>4} "
              f"(of {r['full_total']})            {f['unmatched']:>3} vs {base[2]:<3}      "
              f"{f['generic']:>3} vs {base[3]:<3} {'WORSE' if worse else 'not worse (pages changed)'}")
    for r in reports:
        for problem in r['problems']:
            print(f"  VIOLATION {r['subject']}: {problem}")
    return 1 if (fail and failed) else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--subject', default='CST201')
    ap.add_argument('--papers', default='P00[3-6]', help='glob fragment for the paper window')
    ap.add_argument('--verbose', action='store_true')
    ap.add_argument('--fail-unmatched', action='store_true')
    ap.add_argument('--maps', action='store_true',
                    help='Phase 17: report all five topic maps (runtime view)')
    ap.add_argument('--fail', action='store_true',
                    help='with --maps: exit 1 on any violation or regression')
    args = ap.parse_args()
    if args.maps:
        return maps_report(fail=args.fail)

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
