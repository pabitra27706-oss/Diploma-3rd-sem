# Phase 2 — Truthful data pipeline

**Status:** 📋 planned · **Parts:** 6 · **Depends on:** 1 · **Owner gates:** content verification (2.5, 2.6)

## Goal

Make the data the product's single source of truth. After this phase, every
number on screen is computed, every item is gradable or honestly marked
ungradable, every unit tag matches the syllabus, and a script — not a reviewer —
catches the next mistake.

## Why now — the measured evidence

| Symptom | Number | Source |
|---|---|---|
| PYQs all scheduled on practice day 1 | 992 / 992 | `practiceDay` across `_data/**` |
| Duplicate question text across papers | 86 clusters / 182 records | normalised-text clustering |
| Placeholder topic labels (`Short answer`, `Group A / objective`, `Group C / long answer`) | 321 records | `topic` field |
| Units without any PYQ | e.g. CST203 U2 20, U4 11 | `validate_syllabus.py` |
| Quiz items with no answer, model answer, or explanation | 456 / 872 | `_quiz-data/**` |
| Declared vs actual quiz counts | CST201 U1 46/53, U2 31/36; CST203 U3 42/55; CST205 U1 40/56 | `totalQuestions` vs array length |
| Out-of-syllabus unit tags | CST205 ×4, CST209 ×3 (unit 5 in four-unit courses) | `validate_syllabus.py` |
| Unit order reversed vs syllabus | CST201 quiz U3=Functions, U4=Arrays | `_quiz-data/CST201/*` |
| Duplicate reprint papers | CST203 P002/P003, CST209 P002/P003 | paper metadata |
| 2026 January papers missing from quiz banks | 120 PYQs, 0 quiz records | cross-tab |

## Scope

- **In:** validators, practice scheduling, computed counts, topic labels, unit
  maps, duplicate handling, answer keys, quiz-bank currency.
- **Out:** the quiz UI (Phase 3), search (Phase 4), flashcards (Phase 5).
  This phase changes data and scripts; screens change only to stop lying.

## Parts

| Part | Title | The one thing it must prove |
|---|---|---|
| 2.1 | `scripts/validate_data.py` | Every invariant is machine-checked in CI |
| 2.2 | Practice day map | Days 1–10 are real, deterministic, and balanced |
| 2.3 | Counts, topics, unit maps | No displayed count is typed; no tag is out of syllabus |
| 2.4 | Duplicates and reprints | One canonical question, with known reprints attached |
| 2.5 | Answer-key coverage | Every gradable item has a key; the rest say "no key" |
| 2.6 | Bank currency | Years/sources in the UI come from the data |

Details: [`tasks.md`](tasks.md).

## The hard constraint

Content truth is the owner's job. The agent may restructure, deduplicate, map
by **source id**, and flag; it may not invent an answer, a year, or a unit tag.
Where a key cannot be derived from an existing verified answer, the item is
marked `answerStatus: "missing"` and excluded from scoring — never guessed.

## Done means

- `validate_data.py --strict` runs in CI and fails on any of: duplicate ids,
  MCQ without a valid `correct`, declared count ≠ actual, unit outside the
  syllabus, `topic` missing, answer key missing where `answerStatus` claims one.
- Practice days 1–10 each hold a non-trivial, deterministic set; the same
  question never appears twice in one day; the distribution is reproducible
  from a seed.
- Every count in the UI is computed at runtime or from the same validator.
- Duplicate map committed: canonical id + `alsoAppearedIn: [ids]`.
- 456 non-MCQ items either have an owner-verified key or an explicit
  "no key — not graded" state.
- `validate_syllabus.py --strict` → 0 errors.

## Risks

- Rewriting `practiceDay` across 992 records can silently reorder a student's
  day 3. Record the algorithm and its seed; make the change idempotent.
- Deduplication can delete a paper a student has bookmarked. Keep reprints as
  aliases, not deletions.
- Answer-key mapping by text similarity is unreliable (only 90/456 matched);
  use `sourceNumber`/`id` joins, and stop when the join is ambiguous.
