# Sub-phase 8A — Answer prose and subject labels

**Status:** ✅ shipped, awaiting owner acceptance · **Parts:** 6 · **Depends on:** 2, 8
· **Owner gates:** content verification (8.6) stays open

Parent phase: [8 — Content depth and syllabus coverage](../README.md). This
folder exists because the owner asked for work that phase 8 describes as a
gate but does not sequence: the *prose* students read on a 1-mark item, and the
*names* shown for a subject. Both are content/truth changes rather than new
capabilities, so they are recorded here instead of adding a seventh part to
phase 8 (see "a phase needs a seventh part? the scope was wrong", `../README.md`).

## Goal

Make every multiple-choice question explain itself in 2–3 sentences sized for a
1-mark answer, and make the five courses readable as subjects (C, Python, DS,
CSO, Algorithms) instead of course codes (CST201…CST209) — without touching a
single stored key, option, question stem, file path or internal identifier.

## Why now — the measured evidence

- Before the Python pilot, MCQ explanations were one clause: e.g.
  `_quiz-data/CST203/unit-2.json` carried "Else block executes when if is false"
  for a 1-mark item, and `_data/CST201/CST201-P002-2022-06.json` answers such as
  `**Correct answer: D) \`\n\`.**` had no reason at all.
- The owner's wording fixed the budget: "a little detailed but it's 1 mark" —
  roughly 30–40 words, not an essay.
- Two subjects carried a duplicated reprint paper: CST203-P002 duplicated P003
  and CST209-P002 duplicated P003. Both were byte-level duplicates, so removing
  them lost no unique content — but the owner restricted deletion to a subject
  with **no 2021 paper** (see 8A.4).
- Every page in the site labelled a subject by its code. `index.html` subject
  cards rendered `subject.code`, `pyq/index.html` filter buttons and
  `roadmap/index.html` filters were literally `CST201…CST209`, and
  `exam-pattern.html` listed `CST201-P001-2021-03.json`. A first-time visitor
  could not tell CST207 from CST205.
- Generated pages would have re-introduced codes: `scripts/build_coverage.py`
  writes `coverage.html`, `exam-pattern.html`, `courses.html` and the lab pages
  from `docs/syllabus/syllabus.json`, so editing the HTML alone would have been
  overwritten on the next rebuild.

## Scope

- **In:** quiz-bank `explanation` prose for all five subjects that have a bank;
  PYQ `answer` prose for every subject/paper; removal of a duplicate reprint
  paper under the owner's rule; display-only subject naming across every page a
  learner sees; regeneration of derived data, pins, ledger and test
  expectations that those changes invalidate.
- **Out:** any change to `correct`, `options`, `question`, `marks`, `topic`,
  `unit`, `difficulty`; any rename of a folder, file, question/paper ID, URL
  parameter, `data-*` value, storage key or JSON key; any new answer
  certification; any retagging of the open source-review findings; any deploy.

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 8A.1 | Python pilot | A 1-mark item reads as a short, complete explanation — on one subject, before the pattern is repeated |
| 8A.2 | Quiz-bank explanations, all subjects | 337 MCQs across CST201/CST205/CST209 explain themselves, with no key edit |
| 8A.3 | PYQ answer prose | 226 archived answers carry a reason, and every non-prose field is byte-identical |
| 8A.4 | Duplicate reprint removal | A paper is deleted only where the subject has no 2021 sitting, and no unique question is lost |
| 8A.5 | Subject names in the UI | A learner never reads a course code, and no path, ID, URL or storage key changes |
| 8A.6 | Derived data, pins and gates | Stale counts cannot survive: catalog, days, search, cards, pools, ledger and tests all agree |

Details: [`tasks.md`](tasks.md). What actually shipped: [`record.md`](record.md).

## Branches

| Branch | PR | Result |
|---|---|---|
| `arena/858a50c7-diploma-3rd-sem` | #9 | merged to `main` as `365b8f7` (content `c47a0f7`, pin `e53e4c5`) |
| `arena/637a5a31-diploma-3rd-sem` | #10 | open; branched from `365b8f7` (`664674b`, `49758b6`, `1dcc57a`, `9b66c31`, `4e906e2`) |

## Gates

- **Content verification (8.6) is unchanged and still open.** Prose was added
  around the stored key, never instead of it. The nine source-review findings in
  `docs/data/validation-exceptions.json` remain open; one of them
  (`unit CST209-P002-Q34`) closed because its paper was deleted, which is
  recorded rather than hidden.
- **Owner acceptance** for this sub-phase has not been given yet.
- **No deploy.** This branch does not authorize Pages/domain changes
  (`../DECISIONS.md`, 2026-11-06).

## Risks

- Explanation prose can drift into inventing a fact. Mitigation: the key is
  restated from the stored answer, and corrupted printed options
  (`CST205-U3-Q010`, `CST205-U3-Q012`, `CST205-U4-Q002`, `CST209-U4-Q013`) are
  explained *around* the stored key instead of being "corrected".
- Short subject labels can read as cryptic ("C", "DS"). Mitigation: compact
  chrome uses the short label; headings, page titles, drawer headers and quiz
  `<option>`s keep the full syllabus name.
- Deleting a paper invalidates derived counts. Mitigation: 8A.6 regenerates
  everything and re-pins the integrity file in a separate commit.

## Done means

- Every MCQ in a bank has a 2–3 sentence explanation; every PYQ answer states a
  reason; diff against the base commit shows no change to any non-prose field.
- At most one duplicate reprint is removed per subject, and only where a 2021
  sitting is genuinely missing.
- No page renders a course code in its text; deep links and storage keys still
  contain them and still work.
- `validate_pyq.py` PASS, `check_pyq_integrity.py` clean, `validate_data.py
  --check-baseline` matches the ledger, `check_platform.py` 0 errors, Python and
  Node regression suites green, `check_site.py --strict` no worse than `main`.
- This folder holds `README.md`, `tasks.md` and `record.md`, `docs/STATUS.md`
  and `prompt.md` name the sub-phase, and the next-chat prompt is printed in
  chat.
