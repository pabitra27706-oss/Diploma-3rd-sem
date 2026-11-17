# Phase 8 — Tasks

Content here must be **sourced**. A formula, a syllabus claim, or an answer
without a citation is not ready to ship — say so in the record instead.

**Status 2026-11-17** (evidence in [`record.md`](record.md)):

| Part | State | What proves it |
|---|---|---|
| 8.1 Coverage map | ✅ implemented | `build_coverage.py` + `coverage.json` v2 + `coverage.html`; 74-page tree, 23 declared units, 2 out-of-syllabus rows listed, Unit-1 skew table, determinism test |
| 8.2 Formula/definition sheets | ⛔ owner gate (structure built) | 44 authored entries, every `citationQuote` validated verbatim against the syllabus; 3 formulas each with a symbol legend; **0 verified**, not in navigation |
| 8.3 Print | ✅ static side | `print.css` on 74/74 pages, answers-on-new-page toggle, shared print control, break control; **no real PDF export observed** (Phase 10) |
| 8.4 Labs/internship | ✅ implemented | 3 lab pages + SI201 with credits/L-T-P/hours/assessment/task areas and syllabus page anchors |
| 8.5 Exam pattern + marks | ✅ implemented | ESE table sums to 60; 28/28 paper maxima reconciled from each paper's own quotas; decision recorded |
| 8.6 Verification workflow | ⛔ owner gate (structure built) | Register + fail-closed validator + derived ledger + expandable per-answer source line; **0 of 924 certified** |

Steps below are kept as written; where the tree already satisfied a step the
record says so instead of the step being quietly dropped.

## 8.1 — Syllabus coverage map

**Steps**
1. `scripts/build_coverage.py` joins `docs/syllabus/syllabus.json` with
   `_data/**`, `_quiz-data/**`, unit pages and generated cards; emits
   `assets/data/coverage.json`.
2. Per subject/unit: `hasNotes`, `pyqCount`, `quizCount`, `cardCount`,
   `lastUpdated`, `flags` (thin, missing, out-of-syllabus).
3. Page: table per subject, coloured only alongside text (never colour-only),
   with a legend and an explicit "theory content only; labs pending" note.
4. Link each row to its unit page and its filtered PYQ view.
5. Show the PYQ-per-unit distribution so the Unit-1 skew is visible and
   explained (June-2022 tagging).

**Acceptance:** regenerating the JSON twice is identical; the page's numbers
equal `validate_syllabus.py`'s; a unit with zero content is listed, not hidden.

## 8.2 — Formula and definition sheets

**Steps**
1. Per subject, collect the definitions and formulas the syllabus implies
   (e.g. CST209 complexity classes and recurrences; CST205 tree/graph terms;
   CST207 cache hit ratio, error codes; CST201/203 syntax reference).
2. Each entry: term/formula, one-line meaning, unit reference, source
   (syllabus page or textbook chapter).
3. One page per subject, printable, anchor-linked, searchable (Phase 4 index
   rebuild).
4. Owner verifies each sheet before it is linked from navigation.

**Acceptance:** every entry has a source; the sheet prints on two pages or
fewer; no formula is presented without a symbol legend.

## 8.3 — Print everything worth printing

**Steps**
1. One print stylesheet with: hidden nav/footer/buttons, black text on white,
   visible URLs, page-break control (`break-inside: avoid` for questions),
   margins, and a header/footer with subject/unit.
2. Print actions: "Print this unit", "Print this paper", "Print with answers",
   "Print formula sheet".
3. Answers print on a separate page so a question sheet can be handed out.
4. Verify a real export to PDF on a phone and record the page count.

**Acceptance:** printed unit has no dark background; answers start on a new page;
no question splits across pages; the record includes the observed PDF result.

## 8.4 — Labs and internship pages

**Steps**
1. Add `subjects/CST211`, `subjects/CST213`, `subjects/CST215` pages listing the
   syllabus practical areas and sample programs (from pages 14–21).
2. Add an SI201 internship page (what it is, when, what evidence a student keeps).
3. Link labs from the subject list and mark them clearly as "practical".
4. Do not invent lab solutions; either cite a source or list the task only.

**Acceptance:** labs appear in navigation and in the course list page; each page
cites its syllabus page number; no claim of completed solutions.

## 8.5 — Exam pattern and marks reconciliation

**Steps**
1. Add an "Exam pattern" page reproducing the ESE table (1/2/6-mark mix, 60
   marks, internal 40) with the syllabus page reference.
2. Reconcile paper `fullMarks` with the pattern: either the data is right
   (different regulation) or the labels are wrong. Record the finding.
3. Until reconciled, mock-paper totals and any "out of N" text carry an
   "unverified" marker.
4. Add a per-question marks explanation (what a 2-mark vs 6-mark answer expects,
   sourced).

**Acceptance:** the pattern page matches the PDF table exactly; no page claims a
paper total that the data does not support; the reconciliation decision is in
`docs/DECISIONS.md`.

## 8.6 — Verification workflow (owner gate)

**Steps**
1. Per answer record: `answerStatus`, `sourceStatus`, `sourcePage`, and a
   `verifiedOn` date (already partly present in the schema).
2. Surface provenance in the UI: a small "source" line per answer, expandable.
3. Owner sign-off batches (≤40 items per chat) with the citation, recorded in
   the phase record.
4. A "what is unverified" page/section listing counts per subject; regen from
   the data.

**Acceptance:** the count of verified vs unverified is published and derived;
no answer displays as verified without a source and a date; sign-off is recorded.

## Phase checks

```sh
python3 scripts/build_coverage.py && git diff --exit-code assets/data/
python3 scripts/validate_syllabus.py --strict
python3 scripts/check_site.py --strict
# print: export one unit, one paper, one sheet to PDF and record page counts
```

**Not verifiable here:** whether a formula is pedagogically right (owner gate),
and real print output on a phone (owner pass).
