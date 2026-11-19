"""Invariants the PYQ -> unit-heading matcher must satisfy.

Both assertions here began as findings recorded in
`docs/phases/13-cst203-python-content/record.md` §4.1.3a and §4.1.3b:

  * a topic segment must match whole words, not substrings -- `all` must not
    match inside "shallow";
  * a landing must not depend on the order the author wrote the headings in.

The second one is a MEASURED ratchet, not a passing invariant. The tie-break
defect is real. Phase 17 (2026-11-19) decided to keep it pinned, not to fix it:
a tie-break that removes the order dependence (generic-preference, then shorter
heading, then anchor) moves about 175 archived landings. Reading a 12-case
sample against the stems: 3 clearly better, 2 clearly worse, 5 unclear, and 2
placeholder landings that were nonsense either way. The reasoning, the measurements
and the owner question are in docs/phases/17-topic-map-crosscheck/record.md
§4.2. What Phase 17 DID establish is that the defect cannot reach the
calibrated window at runtime, because every window question is routed by the
authored map first. That is asserted below, not assumed.
"""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / 'scripts') not in sys.path:
    sys.path.insert(0, str(ROOT / 'scripts'))

import audit_topic_routing as routing  # noqa: E402

SUBJECTS = ('CST201', 'CST203', 'CST205', 'CST207', 'CST209')
PAPERS = 'P00[3-6]'
# Full-corpus (archived P001-P006) order dependence of the matcher, measured
# 2026-11-19 with the same reversal test. Archived questions and stale-anchor
# fallbacks are the only runtime paths still exposed to it.
ARCHIVED_ORDER_DEPENDENT = {'CST201': 50, 'CST203': 30, 'CST205': 45, 'CST207': 30, 'CST209': 49}

# Measured 2026-11-19. Not a target -- a ratchet.
# CST205 moved 35 -> 33 in Phase 14 (17 new <h3 id> anchors across the four
# units removed two ties the coarse sections used to win by position; the
# authored topic map now routes CST205, so this measures fuzzy fallback debt
# only). Matcher unchanged.
# CST203 moved 31 -> 29 in part 13.3 (Unit 3's 12 new <h3 id> anchors remove
# ties between a named heading and a coarse section) and 29 -> 32 in part 13.4
# (Unit 4's 6 anchors plus the extra section headings added more candidate
# headings, hence more ties), then 32 -> 30 in part 13.5 (Unit 5's 5 anchors
# removed two more ties). This number measures the SIZE of the unfixed
# tie-break defect, not its correctness -- Phase 17 fixes the defect itself. Any change here means the
# matcher's behaviour moved and must be explained in a phase record.
ORDER_DEPENDENT = {
    'CST201': 36,
    'CST203': 30,
    'CST205': 33,
    'CST207': 25,
    'CST209': 49,  # Phase 16 content anchors: 50→48→47→50→49→49; matcher unchanged.
}


# Anchors that belong to a heading whose unit differs from where the question
# is filed. A "fix" that lands one of these is a cross-unit regression.
FOREIGN_UNIT_ANCHORS = frozenset({
    'data-types-mutability-and-type-conversion',
})


def _boundary_match(target, title):
    """Would a whole-word test find `target` in `title`?"""
    return re.search(r'(?<!\w)' + re.escape(target) + r'(?!\w)', title) is not None


class SubstringMatchingTests(unittest.TestCase):
    def test_all_must_not_match_inside_shallow(self):
        """The exact defect: `all` scoring 90 against "…shallow copy…"."""
        self.assertFalse(_boundary_match('all', 'aliasing, shallow copy and deep copy'))

    def test_known_substring_misfire_is_documented(self):
        """Pin the live behaviour so the fix has to be deliberate.

        `Built-ins / all` resolving to the collections section is wrong, but it
        is *currently* what ships. When this assertion starts failing, the
        matcher was fixed -- update record.md §4.1.3a and this test together.
        """
        units = routing.load_units('CST203')
        score, anchor, title, _home = routing.route(units, 1, 'Built-ins / all')
        self.assertEqual(anchor, 'collections')
        self.assertIn('shallow', title or '')

    def test_word_boundary_variant_would_regress_two_questions(self):
        """Proof that the obvious fix is not safe, so it is not shipped blind.

        A `\\b`-anchored test moves P003-Q27 and P005-Q22 out of the string
        heading and into the data-types heading. Both are 8-mark composites
        whose marks favour strings (6m to 2m for Q27), so the current landing
        is the correct one.
        """
        units = routing.load_units('CST203')
        original = routing.score_against

        def boundary(title, target, target_terms):
            if title == target:
                return 100.0
            if _boundary_match(target, title):
                return 90.0
            title_words = set(routing.terms_for(title))
            matched = sum(1 for term in target_terms if term in title_words)
            return matched / len(target_terms) if target_terms else 0.0

        def snapshot():
            out = {}
            for q in routing.questions('CST203', PAPERS):
                home = q.get('unit') or 1
                out[q['id']] = routing.route(units, home, q.get('topic'))[1]
            return out

        current = snapshot()
        try:
            routing.score_against = boundary
            moved = snapshot()
        finally:
            routing.score_against = original

        # P003-Q27 must leave the string heading under the naive fix. If it does
        # not, the "fix is unsafe" claim in the record is wrong and must be
        # retracted.
        #
        # P005-Q22 USED to regress too. Part 13.2 authored a `range()` heading in
        # Unit 2, which now out-scores the mutability section for that topic, so
        # the regression is cured -- by content, not by a matcher change. The test
        # is updated because the measurement changed, not to make it pass.
        self.assertEqual(moved['CST203-P003-Q27'], 'data-types-mutability-and-type-conversion')
        self.assertEqual(current['CST203-P005-Q22'], 'for-loops-while-loops-and-range')
        self.assertEqual(moved['CST203-P005-Q22'], 'for-loops-while-loops-and-range')

        # Exactly two Python landings move now. One is the desired fix; the other
        # is the regression. (It was three until part 13.2 added the range()
        # heading in Unit 2 -- see the note above.)
        self.assertEqual(sorted(k for k in current if current[k] != moved[k]),
                         ['CST203-P003-Q19', 'CST203-P003-Q27'])
        # P003-Q19 is the good change -- keep it visible so a future reader does
        # not mistake the word-boundary test for a pure regression.
        self.assertEqual(current['CST203-P003-Q19'], 'collections')
        self.assertEqual(moved['CST203-P003-Q19'],
                         'running-python-interactive-script-mode-and-builtin-functions')
        self.assertIn(moved['CST203-P003-Q27'], FOREIGN_UNIT_ANCHORS)


class DocumentOrderIndependenceTests(unittest.TestCase):
    def test_order_dependence_is_measured_and_ratcheted(self):
        """A landing must not depend on where the author put the heading.

        This is the failing invariant. Keep it failing until Phase 17 fixes the
        tie-break; the assertion message states the remedy so it is not
        "fixed" by reordering a page.
        """
        measured = {}
        for subject in SUBJECTS:
            forward = routing.load_units(subject)
            reverse = {unit: list(reversed(entries)) for unit, entries in forward.items()}
            moved = 0
            for q in routing.questions(subject, PAPERS):
                home = q.get('unit') or 1
                a = routing.route(forward, home, q.get('topic'))[1]
                b = routing.route(reverse, home, q.get('topic'))[1]
                if a != b:
                    moved += 1
            measured[subject] = moved

        self.assertEqual(
            measured,
            ORDER_DEPENDENT,
            'Document-order dependence changed. A landing is now decided by the '
            'position of the heading in the page, not by which heading answers '
            'the question. Do not fix this by reordering a unit page -- fix '
            '_pick()/_better() in scripts/audit_topic_routing.py and better() '
            'in assets/js/unit-discovery.js, then re-validate all five subject '
            'topic maps. See record.md §4.1.3b.',
        )

    def test_reversing_is_not_a_fix(self):
        """The two orders must disagree, not one of them be 'more correct'.

        P003-Q29 is right in reverse order and wrong forward; P003-Q24 is right
        forward and wrong reversed. A 50/50 split is not a tie-break.
        """
        units = routing.load_units('CST203')
        reverse = {unit: list(reversed(entries)) for unit, entries in units.items()}
        topics = {q['id']: q.get('topic') for q in routing.questions('CST203', PAPERS)}
        # forward order answers the question ...
        self.assertEqual(routing.route(units, 1, topics['CST203-P003-Q24'])[1],
                         'python-basics-indentation-keywords-and-comments')
        # ... and reverse order breaks it ...
        self.assertEqual(routing.route(reverse, 1, topics['CST203-P003-Q24'])[1], 'intro')
        # ... while the opposite holds for this one.
        self.assertEqual(routing.route(units, 1, topics['CST203-P003-Q29'])[1],
                         'tuples-and-sequences')
        self.assertEqual(routing.route(reverse, 1, topics['CST203-P003-Q29'])[1],
                         'dictionaries-keys-and-methods')


class MapFirstRuntimeOrderTests(unittest.TestCase):
    """Phase 17: what the browser actually does, for the calibrated window."""

    def test_runtime_window_landings_do_not_depend_on_heading_order(self):
        for subject in SUBJECTS:
            mapping, no_jump = routing.load_register(subject)
            forward = routing.runtime_units(subject)
            reverse = {unit: (list(reversed(entries)), ids)
                       for unit, (entries, ids) in forward.items()}
            for q in routing.questions(subject, PAPERS):
                home = q.get('unit') or 1
                a = routing.route_runtime(forward, mapping, no_jump, home, q.get('topic'))
                b = routing.route_runtime(reverse, mapping, no_jump, home, q.get('topic'))
                self.assertEqual(a, b, f'{q["id"]} landing depends on heading order')

    def test_archived_order_dependence_is_measured_and_ratcheted(self):
        measured = {}
        for subject in SUBJECTS:
            forward = routing.load_units(subject)
            reverse = {unit: list(reversed(entries)) for unit, entries in forward.items()}
            moved = 0
            for q in routing.questions(subject, 'P'):
                home = q.get('unit') or 1
                if routing.route(forward, home, q.get('topic'))[1] != routing.route(reverse, home, q.get('topic'))[1]:
                    moved += 1
            measured[subject] = moved
        self.assertEqual(measured, ARCHIVED_ORDER_DEPENDENT,
                         'Archived order dependence changed. Explain it in record.md §4.2 before re-pinning.')


if __name__ == '__main__':
    unittest.main()
