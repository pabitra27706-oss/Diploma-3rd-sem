# Phase 8 — Content depth and syllabus coverage

**Status:** 🚧 implementation in progress · **Parts:** 6 · **Depends on:** 2, 7 · **Owner gates:** content verification (8.1, 8.6)

## Goal

Use the syllabus now in the repo to answer the questions students actually ask:
what is in the syllabus, what is covered, what is missing, what is likely to be
asked, what should I memorise, and what can I print.

## Why now — the measured evidence

- The syllabus declares 5 theory courses, 3 labs and an internship; the site
  covers theory only — no lab pages, no internship page.
- CST205 and CST209 each have **four** units; CST201's unit order is
  Arrays (U3) then Functions (U4) — content disagrees in both places.
- The ESE pattern is published (1/2/6-mark mix, 60 marks), but no page explains
  it; the data's paper totals differ, which silently undermines any mock paper.
- PYQ distribution is heavily skewed to Unit 1 (CST203 140/204, CST201 112/198),
  consistent with the June-2022 papers tagging almost everything Unit 1 — a
  coverage map makes that visible instead of invisible.
- "formula" appears in 25 files but there is no per-subject revision sheet; no
  glossary exists; print styles exist in only 4 CSS files.

## Scope

- **In:** coverage map, formula/definition sheets, printable revision sheets and
  paper printing, lab and internship pages, exam-pattern page, verification
  workflow and source citations.
- **Out:** writing new question content beyond verified keys, translations.

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 8.1 | Syllabus coverage map | Every unit shows covered / thin / missing, from data |
| 8.2 | Formula and definition sheets | One sheet per subject, sourced and printable |
| 8.3 | Print everything worth printing | Unit, paper, answer key, formula sheet all print cleanly |
| 8.4 | Labs and internship pages | CST211/CST213/CST215/SI201 exist as real pages |
| 8.5 | Exam pattern and marks reconciliation | The number on screen is the syllabus number |
| 8.6 | Verification workflow | Every answer can be traced to a source and a date |

Details: [`tasks.md`](tasks.md).

## Done means

- `python3 scripts/build_coverage.py` regenerates the coverage data; the page
  matches it exactly; the method ("theory only, labs pending") is stated.
- Coverage distinguishes: has notes, has PYQs, has quiz items, has cards; a unit
  with none of these is visibly "not covered".
- Formula/definition sheets exist for all five subjects or a recorded reason why
  not; each item cites its unit/section.
- Print output for one unit, one paper, one answer key, one sheet: no navigation,
  no dark background, URLs shown for external links, page breaks in sane places.
- Lab pages list the syllabus practicals; internship page explains SI201.
- Exam pattern page reproduces the ESE table and states the 60-mark reconciliation.
- Answer records carry `sourceStatus` and a visible "last verified" date.

## Risks

- Coverage percentages invite false conclusions: a unit may be "covered" by one
  thin note. Report counts, not a single score.
- Formula sheets are content with accuracy risk: every formula needs a source
  (syllabus unit or a named textbook chapter), or it does not ship.
- Printing from a phone is browser-dependent; test at least one real print/PDF
  export and record the result.
