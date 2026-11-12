# Phase 3 — Quiz and exam engine

**Status:** 🚧 implemented in part; paper-rule enforcement pending (see record.md) · **Parts:** 6 · **Depends on:** 2 · **Owner gates:** none (marks reconciliation needs 8.5)

## Goal

Turn the quiz from a generated set of questions into a trustworthy exam
machine: attempts that survive a reload, papers that behave like real papers,
history that is not silently zeroed, exports that export what you chose, and a
mistake queue that turns errors into practice.

## Why now — the measured evidence

| Defect | Where |
|---|---|
| Autosave omits remaining time; resume restores full duration | quiz play/autosave logic |
| Resume labels a single-subject quiz "All Subjects" (`saved.subject` vs `saved.config.subject`) | quiz resume path |
| Failed subject fetch becomes an empty bank | quiz setup/play loader |
| CST207 selectable with no bank (0 records) | quiz setup |
| Marks options omit 3/5/7 although 68 records match those marks | quiz setup |
| Source filter hides 163 `EXTRA` records; 2019/2020 offered empty | quiz setup |
| Clearing a typed answer leaves `""` counted as answered | play/submit |
| All-types history turns `null` score into 0 and paints it poor; unanswered counted wrong | `quiz/js/result.js:107-167` |
| Export always loads current `quiz-result`, not the selected `historyId` | `quiz/js/export.js:94` |
| Retry regenerates from config, not stored ids; "reshuffled" ≈ "fresh" | retry path |
| Review edits never update history | review path |
| "AI Eval" exposes only external prompts — nothing is evaluated | export page |

## Scope

- **In:** attempt state machine, setup/filters, mock-paper mode, history/export/
  retry/review, mistake queue, honest labels.
- **Out:** question content (Phase 2), search (Phase 4), scheduling (Phase 5).

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 3.1 | Attempt state machine | A reload inside a timed quiz loses nothing |
| 3.2 | Setup and filters | No option can produce an empty quiz |
| 3.3 | Mock paper mode | A real paper, real duration, real marks |
| 3.4 | History, export, retry, review | What you see is what you export |
| 3.5 | Mistake queue | Wrong answers become a practice set |
| 3.6 | Honest labels | No feature claims more than it does |

Details: [`tasks.md`](tasks.md).

## Done means

- Kill the tab mid-quiz, reopen: the same questions, the same answers, the
  remaining time (within one autosave interval), the same subject name.
- A subject that fails to load says so; it does not become an empty quiz.
- Every marks option offered returns questions; every year offered returns
  questions.
- Export from history produces the quiz you clicked, with its own answers.
- History shows "not scored" as its own state, never 0/0%.
- Mock paper: N questions, M marks, T minutes, from one real paper, marked
  against that paper's total.
- Mistakes are stored, listed, and re-practicable; clearing works.
- The word "AI" does not appear in any feature that has no model.

## Risks

- The state machine touches autosave, resume, submit, history, export, and
  review at once. Do it behind one module with a schema version, and migrate
  old attempts rather than dropping them.
- Mock-paper marks depend on the syllabus reconciliation (8.5). If the data's
  paper totals are wrong, the phase must display "unverified total" rather than
  inventing one.
