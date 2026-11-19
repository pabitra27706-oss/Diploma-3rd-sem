# Topic map — authoring standard

How every subject builds its `assets/data/topic-map-<subject>.json`, and what the
cross-check phase audits. Phases 13–16 each author one map as their final part;
**Phase 17** re-audits all five together.

Worked example: the CST201 map from Phase 12 (`assets/data/topic-map-CST201.json`).
Read that file and `tests/test_topic_map.py` before starting.

---

## 1. Why a map, not better matching

A stored PYQ `topic` is a short phrase written by whoever compiled the paper. The
matcher scores it against authored headings, and scoring is a guess. Two facts make
guessing the wrong tool:

- **Topics are used once.** Across CST201's 924-question corpus, **35% of `topic`
  values are paper section labels, not topics** — `"Short answer"` alone appears
  **207** times. Of what remains, **484 distinct strings average 1.06 uses each**.
  You cannot tune a scorer to be right on ~500 things used once each; that is a
  lookup table wearing a costume.
- **Scoring fails silently.** Every routing defect found in Phase 12 was a
  *plausible* wrong section: `"Recursion / stack"` went to a one-line overview card
  instead of the section covering call stack and recursion. The pass/fail counts
  (`103 same-unit / 2 redirect / 0 unmatched`) looked perfect the entire time.
  A missing map entry, by contrast, is loud.

Measured on CST201's 105-question window, the map moved questions landing on a
generic `overview-*` card from **35/105 to 3/105**, and 59 of 105 questions gained
a more specific section.

---

## 2. Format

`assets/data/topic-map-<subject>.json`:

```json
{
  "schemaVersion": 1,
  "subject": "CST201",
  "map": {
    "arrays / loops": [3, "arrays-initialization-memory-and-loops"],
    "storage classes / parameter passing": [4, "storage-classes-and-parameter-passing"]
  }
}
```

- **Key** — the stored `topic`, normalised: lowercase, whitespace collapsed, trimmed.
- **Value** — `[unit, anchor]`. The unit may differ from the question's stored
  `unit`; that is how a stale PYQ unit gets corrected.
- **Location matters.** It lives in `assets/data/`, **not** `_data/<subject>/`.
  `scripts/data_pipeline.py` globs `_data/*/*.json` as PYQ papers, so a subfolder
  there makes every paper parse as malformed (19 test errors, caught in Phase 12).

The runtime (`assets/js/unit-discovery.js`) already reads this path generically.
**No per-subject JS work is needed.** A missing file, a failed fetch or malformed
JSON all fall back to the matcher silently.

---

## 3. Authoring rules

1. **Map every question in the calibrated window** (`P00[3-6]`), not just the
   distinct topics you find interesting. Zero unmapped is an acceptance criterion.
2. **Read the question stem before mapping an ambiguous topic.** Multi-part topics
   are the trap. Use the Phase 12 rule: *take the most specific sub-topic; generic
   words like "Functions" or "Operators" carry no routing information; if all are
   equally specific, take the first.*
3. **Prefer a named section over an `overview-*` card.** The cards are unit
   introductions; they answer nothing specific.
4. **Never map to a paper-section anchor** (`mcqs`, `short-questions`, `practice`,
   `revision`, `videos`). Those are navigation, not concepts.
5. **Verify the anchor exists** in the named unit page before committing. Do not
   trust the heading list you were reading — re-grep the file.
6. **Flag your uncertain entries in the PR/record.** Phase 12 flagged
   `type qualifiers` (U4 vs U1) and `comments / conditionals / modular programming`
   for owner review rather than quietly picking one.

---

## 4. Required tests

Copy `tests/test_topic_map.py` and repoint it at the new subject. It must assert:

| Test | Catches |
| :--- | :--- |
| every entry points at an anchor that exists | renamed/typo'd anchors |
| every entry names a declared unit | wrong unit number |
| every question in the window has an entry | incomplete map |
| keys are normalised | lookup misses from whitespace/case |
| map is more specific than the matcher | a map that changed nothing |
| map not accidentally truncated | bad merge, half-written file |

Add one DOM case in `tests/discovery-dom.cjs`: a mapped topic lands on the mapped
anchor **and is highlighted**, and a stale anchor falls through to the matcher
instead of stranding the learner.

---

## 5. Acceptance criteria

Record these in the phase's `record.md` with before/after numbers:

1. **Zero unmapped questions** in the `P00[3-6]` window.
2. **Generic `overview-*` / `intro` / `fundamentals` landings reduced**, with the
   count stated. If the map does not reduce it, the map is wrong.
3. **Zero raw paper-section anchors** in the map.
4. Every mapped anchor verified present in its unit page.
5. `check_pyq_integrity.py` reports `0` changed/added/missing files — the map adds
   a file, it never edits a paper.

---

## 6. Baselines (measured 2026-11-18, `main` + Phase 12 branch)

Full-corpus routing using the matcher alone, for comparison during cross-check:

| Subject | Questions | Same-unit | Redirect | Unmatched | Landing on a generic card |
| :--- | ---: | ---: | ---: | ---: | ---: |
| CST201 | 198 | 167 | 11 | 20 | 40 |
| CST203 | 170 | 129 | 11 | 30 | 5 |
| CST205 | 194 | 112 | 64 | 18 | 0 |
| CST207 | 195 | 77 | 60 | 58 | 0 |
| CST209 | 167 | 124 | 29 | 14 | 9 |

Within the calibrated `P00[3-6]` window, CST201 ships **103 same-unit / 2 correct
redirect / 0 unmatched** with the map consulted first.

CST207 is the worst case (58 unmatched, 60 redirects): treat its map as the hardest
authoring job and expect the largest improvement.

---

## 7. What Phase 17 cross-checks

Phase 17 does not author maps. It re-audits what Phases 13–16 produced and fixes
in place:

1. **All five maps conform** to §2 (schema, location, normalised keys, no
   paper-section anchors).
2. **All five maps are complete** — zero unmapped questions per subject.
3. **Every anchor in every map resolves** on its current unit page (they may have
   been renamed by a later content edit).
4. **Generic-landing counts** are at or below the §6 baseline for each subject.
5. **No regression against the CST201 standard** — the moment a later phase edits
   headings, its map silently rots; this is the check that catches it.
6. **The 321 placeholder topics** (`"Short answer"` ×207, `"Group A / objective"`
   ×69, `"Group C / long answer"` ×45) are handled by an explicit decision, not by
   accident: either mapped deliberately or recorded as "no jump, no topic".

Anything found broken is **fixed in the phase**, not deferred: a one-line map edit
is cheaper than a follow-up phase.
