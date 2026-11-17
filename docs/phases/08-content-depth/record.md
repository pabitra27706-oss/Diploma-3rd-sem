# Phase 8 — Content depth and syllabus coverage · record

**Status:** 🚧 implementation complete for 8.1, 8.3, 8.4, 8.5 · **structure built and gated** for 8.2 and 8.6, which stay open as owner content gates
**Branch:** `arena/e0da0bec-diploma-3rd-sem` (from `main` at `84e99aa`, the PR #15 merge that carried Phase 7)
**Date:** 2026-11-17
**Worker version:** `study-2026-11-17d`

> Everything on this page was measured in the working tree, not copied from the
> phase README. The README made four claims about this tree; **three of them
> were already false before this phase started**, which is exactly the Phase 7
> lesson (an evidence table said 55 pages when the tree had 68).

## What the README claimed vs what the tree held

| README claim | Measured at `84e99aa` | Verdict |
|---|---|---|
| "The site covers theory only — no lab pages, no internship page" | `subjects/CST211`, `CST213`, `CST215` and `SI201` were already shipped with syllabus citations | **false** — the pages existed, they were just thin |
| "CST205 and CST209 each have **four** units; CST201's unit order is Arrays (U3) then Functions (U4) — content disagrees in both places" | CST205 has 4 declared units and 4 unit pages; CST209 has 4 declared units but **5** unit pages; every CST201 unit page title already matches the syllabus order (U3 Arrays, U4 Functions) | **half true** — the disagreement is in the *quiz bank*, not the pages |
| "PYQ distribution is heavily skewed to Unit 1 (CST203 140/204, CST201 112/198)" | CST201 112/198 ✓ but **CST203 is 117/170**, not 140/204 | **stale number** |
| "'formula' appears in 25 files but there is no per-subject revision sheet; no glossary; print styles exist in only 4 CSS files" | "formula" appears in **64** files; 4 of the 6 first-party `assets/css` sheets carry `@media print`, but only **33 of 68 pages loaded `print.css`** | **stale number + the real defect was per-page coverage** |

## Measured before / after

| Measurement | Before (`84e99aa`) | After (this branch) |
|---|---|---|
| Syllabus entries vs pages | 5 theory / 3 labs / 1 internship declared; 5 theory hubs, 23 declared unit pages (+1 out-of-syllabus unit page), 3 lab pages, 1 internship page — but **no page said which syllabus entry it covered** | Same pages, now joined to the syllabus and counted: `syllabusTotals` = 5/3/1/23, `pageTotals` = 5 hubs / 23 unit pages / 3 lab pages / 1 internship page, for every row on `coverage.html` |
| CST205 / CST209 unit counts | CST205: 4 declared, 4 pages, **4 PYQ + 0 quiz records tagged Unit 5 that no page listed**; CST209: 4 declared, **5 pages** (an out-of-syllabus `unit-5.html`), 2 PYQ + **35 quiz items** tagged Unit 5 | Both listed as explicit "out-of-syllabus stored unit" rows with counts; nothing hidden, nothing re-tagged |
| CST201 unit order | Unit-page titles correct; **quiz banks reversed** (`unit-3.json` holds Functions/Storage Classes, `unit-4.json` holds Arrays/Strings) → 42 U3-bank and 38 U4-bank items sit on the wrong syllabus unit, and cards inherit it (21 and 19) | Unchanged data (frozen). The map now shows **both** counts (`42 stored / 38 syllabus unit`) and a flag on each row, citing the ledger finding |
| Per-unit quiz counts on the page | **0 for all 23 units** — `sum(q.get('unit')==n for q in bank_questions)`: quiz questions carry no unit; the unit is on the bank | Real counts (e.g. CST205 U3 72, CST203 U3 55), cross-checked by a test against the bank files |
| "Out-of-syllabus stored tags" line | Printed `{None: 211}` — a Python dict of `None` because bank items have no unit | `U5: 4` style, per subject, PYQ and quiz separately |
| Unit-1 skew | One prose sentence | Per-subject table: CST201 112/198 (56.6%), CST203 117/170 (68.8%), CST205 100/194 (51.5%), CST207 86/195 (44.1%), CST209 81/167 (48.5%); **496 of 924 = 53.7%** overall, with the June-2022 tagging explanation and "read counts, not a score" |
| Notes coverage | `hasNotes` true/false only | Sections and word counts per unit (e.g. DS U4: 15 sections, 9,265 words) so "covered by one thin note" is visible |
| Paper totals | 28 rows of "set-question sum … reconciliation unverified"; the comparison was `sum(marks)` vs `fullMarks`, which can never match | **28 of 28 reconcile**: sum of each group's answer-any/choice-set quota equals the printed maximum. Three printed shapes found (A:20+B:40 ×20 papers, A:30+B:12+C:18 ×5, A:20+B:50 ×3) |
| Print stylesheet | `print.css` on **33 of 68** pages; **7** pages had a print button; no break control outside one card rule; a question sheet printed the key in `[Correct]` markers | `print.css` on **74 of 74**; one shared labelled print control; print-sheet rules for chrome, backgrounds, URLs, break-inside, answers-on-new-page; a paper prints with or without answers |
| Formula / definition sheets | none; 0 entries | **44 entries across 5 subjects** (41 definitions, 3 formulas), every one of them draft-unverified; **0 owner-verified** |
| Verified vs unverified answers | coverage page said 0 certified / 924 archived; no register, no per-paper view, no written rule | Derived ledger `assets/data/verification.json`: 924 records, 924 with a source page, 924 scan-checked, **0 with a verification date, 0 certified, 924 not certified**; 872 quiz items, 416 keyed, 456 unkeyed; register + validator refuse an uncited batch |
| Pages / search scope | 68 pages, 50 indexed / 18 excluded | 74 pages (+6 revision pages), **56 indexed / 18 excluded** |
| Python tests | 33 | **63** (29 new Phase 8 locks) |

## Part 8.1 — Syllabus coverage map ✅

`scripts/build_coverage.py` was rewritten around the join it claimed to do.

- `assets/data/coverage.json` (schemaVersion 2) now carries `syllabusTotals`,
  `pageTotals`, `units[]` (with `syllabusTopicCount`, `noteSections`,
  `noteWords`, `pyqCount`, `quizCount`, `quizCountSyllabusUnit`, `cardCount`,
  `flags`, `sourcePage`), `skew[]`, `outOfSyllabus[]`, `labs[]`, `internship`,
  `provenance[]`, `verification`, `findings[]`, `quizBanks`.
- `coverage.html` gained a flag legend, a per-subject table with note depth, a
  Unit-1 skew table with the explanation, an explicit out-of-syllabus section,
  a practical/internship table, the derived verification section, and the
  ledger findings **grouped rather than printed as raw ids**.
- Determinism: a test regenerates the page in the documented order (builder →
  `generate_presence.py` ×2) and asserts the tree ends byte-identical, and a
  second test asserts the whole suite leaves no generated file changed.

**Not done, and recorded instead:** a coverage *percentage*. The phase README
warns that one thin note can look like coverage, so the page publishes counts
and flags and says so at the top.

## Part 8.5 — Exam pattern and marks reconciliation ✅

- `exam-pattern.html` reproduces the p.14 ESE table and states that the five
  rows total **60**, matching the declared end-semester total; internal 40 and
  maximum 100 are stated with the syllabus's own three internal components.
- The reconciliation is **derived**: for each of the 28 frozen papers, the sum
  of every group's `answerAny × marksEach` (or choice-set quota) is computed and
  compared with `fullMarks`. **28/28 match.** The old page compared the marks on
  *all set* questions with the maximum, which is why it could never reconcile —
  a paper sets more marks than any one candidate answers.
- Three printed shapes are shown with their sessions: 20+40 (20 papers), 30+12+18
  (5 papers, the June-2022 sitting, which matches the syllabus 1/2/6 table) and
  20+50 (3 papers, March 2021, printed maximum 70). The page does **not** decide
  which pattern your session uses — it says to ask your institution.
- Per-question marks: 1, 2, 6 and 8 marks are explained with the papers' own
  printed instructions (the "1 mark for the right answer and 1 mark for the
  correct explanation" split is quoted from the 2024–2026 papers). No marking
  scheme for 6- or 8-mark answers is published, so none is invented.
- `quiz/js/play.js` no longer says "reconciliation is still pending"; it now
  explains the arithmetic (set marks vs answerable marks vs printed maximum) and
  keeps the honest caveat about which syllabus pattern applies.

**Decision recorded in `docs/DECISIONS.md`** (agent decision, reversible): the
paper data is right and the *labels* were the problem; the syllabus ESE table and
the recent papers describe different sessions; both stay visible.

## Part 8.3 — Print everything worth printing ✅ (static side)

- `assets/css/print.css` rewritten: `@page` margins, white surfaces forced on all
  containers, chrome and controls hidden, external link URLs printed, code
  wrapped, `break-inside: avoid` on questions/cards/rows, `break-before: page`
  for answers, table headers repeated.
- **Deliberate exception:** page `<header>` elements are *not* hidden, because on
  the 24 unit pages the `<h1>` lives inside `<header class="header">`; hiding it
  would print a titleless page. A test asserts the rule stays that way.
- `scripts/generate_presence.py` now injects `print.css` on every page → **74/74**.
  It is also in `PRECACHE_ASSETS`, so print styling survives offline.
- One shared, labelled "Print this page" control in `assets/js/accessibility.js`
  (skipped on the PYQ answer page, which owns its own flow).
- `pyq/answers.html` + `pyq/js/answers.js`: a labelled **"Include answers"**
  toggle. Questions print first; answers start on a new page
  (`.print-answers-section`), and the question sheet no longer marks
  `[Correct]` options.
- **No running header/footer.** A browser `@page` margin box
  (`@top-center`) is not supported by Chrome, Safari or Firefox; the page's own
  `<h1>` is the printed header, and inventing a fake fixed header would overlap
  content. Recorded as a limitation, not silently skipped.

**Not verified:** a real phone print/PDF export. There is no browser in this
environment, so no page count can be reported honestly. This moves to Phase 10.

## Part 8.4 — Labs and internship pages ✅

The pages existed; they were four lines of links. Now:

- Each lab page states credits, L-T-P, hours per week, contact hours, the
  syllabus assessment fields when present, the theory course it supports, and
  every transcribed practical area with its syllabus page anchor.
- `SI201` explains what the internship is, when it happens, and a **suggested**
  evidence checklist that is explicitly not an official requirement.
- `courses.html` lists each course as "(practical)" with task-area and hour
  counts and the related theory course, and the internship separately.
- No solution, output or completion claim anywhere; a test asserts the pages
  say so.

## Part 8.2 — Formula and definition sheets ⛔ owner gate (structure built)

- Authored sources: `docs/revision-sheets/CST201.json` … `CST209.json`
  (44 entries: 41 definitions, 3 formulas) plus `signoff.json` (empty).
- `scripts/build_revision_sheets.py` validates every entry against the syllabus
  before it can ship: `citationQuote` must be a **verbatim substring** of one of
  that unit's transcribed topic phrases, the unit must be declared, the page must
  match, and a `formula` entry must carry both the formula and a symbol legend.
  A bad source file exits non-zero instead of printing.
- Output: `revision/index.html` (status page) and one printable sheet per
  subject, plus `assets/data/revision-sheets.json` with derived counts.
- **0 of 44 entries are verified.** Every page carries that banner and the
  sheets are **not** linked from site navigation (a test enforces it). They are
  reachable from `coverage.html` only, which describes them as drafts.
- Only 3 formulas ship because the syllabus prints almost no arithmetic. Where
  it names a quantity without a formula (cache hit ratio, binary-search worst
  case) the entry says so. No textbook page numbers are cited: no edition is
  verified in this repository, and inventing a chapter reference would be worse
  than the visible gap.

**Gate:** the owner reads each sheet against the cited topic (and a textbook or
class note where one exists), then adds a sign-off record. Until then the sheet
is a draft and the phase is not done.

## Part 8.6 — Verification workflow ⛔ owner gate (structure built)

- `docs/data/answer-verification.json` is the sign-off register: batches with
  `targets`, `citation`, `verifiedOn` (ISO), `reviewer`, capped at 40 items.
- `scripts/build_verification.py` derives `assets/data/verification.json`
  (per subject, per paper, per unit) from the frozen records plus that register.
  It **fails closed**: a batch with no citation, no ISO date, a future date, an
  unknown question id, a duplicate target or more than 40 items rejects the whole
  register and certifies nothing. Tests cover each rejection.
- `pyq/answers.js` shows a small expandable "Source: … · not certified" line per
  answer — the citation and certification state stay visible when collapsed, so
  print and screen readers still see them.
- `coverage.html` publishes the derived counts per subject (certified / not
  certified / missing answer / batches) and the rule in words.

**Gate:** the owner signs off in batches of ≤40 with a citation and a date. The
register is empty, so **0 of 924 archived answers are certified** and the sheet
page says so. This phase did not certify anything.

## Gates run (this tree)

```
python3 scripts/check_site.py --strict --quiet   → 0 error(s), 0 warning(s)
python3 scripts/check_platform.py                → 0 error(s)
python3 scripts/validate_pyq.py                  → PASS, 28 papers / 924 questions
python3 scripts/check_pyq_integrity.py           → 0 changed/added/missing files
python3 scripts/validate_data.py --check-baseline→ baseline matches; 9 findings open (not a strict pass)
python3 scripts/validate_syllabus.py --strict    → still blocked by the recorded 3 grouped findings
python3 -m unittest discover -s tests -p 'test_*.py' → 63 tests OK
node tests/*.cjs (16 deterministic suites)       → PASS
python3 scripts/audit_accessibility.py           → 74 pages, 0 findings, 47 contrast pairs all pass
python3 scripts/check_readme_paths.py            → 0 missing
```

`validate_data --strict` / `validate_syllabus --strict` remain **known-blocked**
by the 9 data + 3 syllabus findings recorded in
`docs/data/validation-exceptions.json`. Nothing was retagged to make them green.
Chromium suites (`*-browser.cjs`, `paper-offline.cjs`, `cards-offline.cjs`) were
**not run**: no Playwright/Chromium here.

## Ripples caused by this phase (each one deliberate)

| Ripple | Why | Evidence |
|---|---|---|
| 6 new pages (`revision/index.html` + 5 sheets) | 8.2 requires one sheet per subject | pages 68 → 74 |
| `tests/test_accessibility_audit.py` literal 68 → 74, audit baseline regenerated | the audit measures pages, and there are 6 more | baseline diff is only the two page counts |
| `tests/discovery-dom.cjs` "50 of 68" → "56 of 74" | search scope re-derived | manifest `indexedHtmlPages` 56 |
| `tests/test_runtime_derived.py` quiz recount | the old assertion compared per-question units (always `None` → 0), so it silently agreed with the broken generator | now recounts from bank files and adds a card count |
| `tests/test_discovery.py` worker literal → `study-2026-11-17d` | runtime files changed | `sw.js` |
| `sw.js` precache gains `assets/css/print.css` | print styling offline | platform check |
| `scripts/generate_presence.py` injects `print.css` | one sheet for all 74 pages | `74/74` pages link it, test enforces it |
| Regeneration order pinned by tests | a fresh page settles only after the documented second presence pass | builder → presence ×2 ends byte-identical; the suite leaves no file changed |

## Open after this phase

1. **8.2 sign-off** — 44 entries, 0 verified.
2. **8.6 sign-off** — 924 answers, 0 certified; 456 quiz items have no key at all.
3. **Print on hardware** — no PDF export observed here (Phase 10).
4. **CST201 bank unit order** — recorded and shown, never re-tagged (source gate).
5. **CST207 quiz bank** — still absent; its cards stay PYQ-only.
6. Everything already carried as Phase 10: rendered contrast after compositing,
   200 % zoom / 320 px reflow, screen-reader output, real tap accuracy, Bengali
   conjunct rendering, keyboard-only core-flow completion, offline cold/warm on
   hardware, backup/restore on a phone.
