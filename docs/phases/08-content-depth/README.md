# Phase 8 — Content depth and syllabus coverage

**Status:** **`✅*`** — 8.1, 8.3, 8.4, 8.5 implemented and gate-verified; 8.2 and 8.6 built but **uncertified**; owner-accepted on a smoke use pass 2026-11-17 (see [`record.md`](record.md) and `docs/DECISIONS.md`) · **Parts:** 6 · **Depends on:** 2, 7 · **Owner gates:** content verification (8.2, 8.6) — still open

> The asterisk: acceptance covers the implementation, not the content. 0 of 44
> revision entries and 0 of 924 answers are source-verified, and no real
> print/PDF export has been observed. Those are Phase 10 / owner-sign-off items.

## Goal

Use the syllabus now in the repo to answer the questions students actually ask:
what is in the syllabus, what is covered, what is missing, what is likely to be
asked, what should I memorise, and what can I print.

## Why now — the measured evidence (re-measured 2026-11-17, see `record.md`)

- The syllabus declares 5 theory courses, 3 labs and an internship. Lab and
  internship pages **do** exist (CST211/CST213/CST215/SI201) but were four thin
  lines each with no hours, credits or assessment fields. **Corrected:** an
  earlier draft of this file said they did not exist.
- CST205 and CST209 each declare **four** units. CST205 ships 4 unit pages;
  CST209 ships **5** (one out-of-syllabus page) and has 35 quiz items in a Unit-5
  bank. CST201's unit *pages* already follow the syllabus order (U3 Arrays,
  U4 Functions); its **quiz bank** is reversed. **Corrected:** the pages were
  never the problem.
- The ESE pattern is published (1/2/6-mark mix, 60 marks). The paper totals
  **do** reconcile with each paper's own printed quotas (28/28) — the earlier
  "totals differ" was a comparison error.
- PYQ distribution is skewed to Unit 1: 496 of 924 (53.7%). CST201 112/198,
  CST203 **117/170** (not 140/204), CST205 100/194, CST207 86/195, CST209 81/167.
- "formula" appears in **64** files; there is no per-subject revision sheet and
  no glossary. Print rules live in 4 of 6 first-party `assets/css` sheets, but
  only **33 of 68 pages loaded `print.css`** — that was the real defect.

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

**Sub-phase [8A — Answer prose and subject labels](sub-phase-8A-answer-prose-and-ui-labels/README.md)**
(2026-11-17) records owner-requested work that 8.6 gates but does not sequence:
the explanation prose on every MCQ/PYQ answer, two duplicate-reprint removals,
and the display-only switch from course codes to subject names. It adds no part
to this phase and leaves the 8.6 verification gate open.

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
