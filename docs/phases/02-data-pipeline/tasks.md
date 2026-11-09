# Phase 2 — Tasks

Data edits are the highest-risk edits in this repo. Each part must be
**idempotent** (running it twice changes nothing), **reproducible** (same input,
same output), and **recorded** (what changed, how many records, and the script
that did it).

## 2.1 — `scripts/validate_data.py`

**Goal:** one script that knows every rule the data must obey.

**Checks**
- every JSON parses; ids unique per store and globally;
- MCQ: exactly four options (or declared count), `correct` ∈ options,
  non-empty `explanation`;
- non-MCQ: no `correct`/`options`; `answerStatus` ∈ {model-answer, missing};
- `unit` is an integer within the syllabus unit count for that subject
  (join `docs/syllabus/syllabus.json`);
- `practiceDay` ∈ 1..10; `difficulty` ∈ {easy, medium, hard};
- declared `totalQuestions`/`totalPapers` equals actual;
- normalised duplicate detector that reports clusters, never deletes;
- paper `duration`/`fullMarks` present and consistent with the registry.

**Acceptance:** runs in CI; `--strict` fails on any violation; the current tree
is either clean or has every exception listed in `record.md` with a plan.

## 2.2 — Practice day map

**Goal:** ten real days.

**Steps**
1. Choose and document the rule, e.g.: sort questions by
   `(difficulty rank, unit, hash(id + seed))`; deal them round-robin into ten
   buckets sized by total/10; within a bucket sort by unit then id.
2. Keep every question exactly once; keep a paper's questions mostly together
   so a day feels like a session, or deliberately interleave by unit — choose
   one and record why.
3. Write the mapping to `practiceDay` with a single script
   (`scripts/build_practice_days.py`), committed, with `--seed` and `--dry-run`.
4. Regenerate the roadmap page's day metadata from the same script output.

**Acceptance:** 992 distributed, no empty day, no duplicate inside a day, day
sizes within ±15% of the mean, re-running the script changes nothing, and the
distribution is explained in one paragraph in the record.

## 2.3 — Counts, topics and unit maps

**Steps**
1. Replace every typed count with a computed one (subject cards, unit headers,
   quiz setup preview).
2. Fix the four known count mismatches by recomputing, not by editing the copy.
3. Replace placeholder topics: derive from `question`/`tags`/`sourceNumber`
   where a human can confirm, otherwise mark `topicQuality: "generic"` so
   analytics can exclude them rather than mislead.
4. Correct CST201 quiz unit titles to syllabus order (U3 Arrays, U4 Functions).
5. Re-tag or remove the seven unit-5 records (CST205 ×4, CST209 ×3) after
   reading each question against the syllabus unit text.
6. Align every subject/unit title with `docs/syllabus/syllabus.json`.

**Acceptance:** `validate_syllabus.py --strict` → 0 errors; zero `totalQuestions`
mismatches; CST201 unit titles match the syllabus; no record tagged Unit 5 in a
four-unit course unless the owner records an exception.

## 2.4 — Duplicates and reprints

**Steps**
1. Generate the cluster report (86 clusters / 182 records) into
   `docs/data/duplicates.md` (committed, generated).
2. For each cluster pick a canonical id — prefer the earliest paper with a
   verified answer — and add `alsoAppearedIn` to it.
3. Mark reprint papers (CST203 P002/P003, CST209 P002/P003) as
   `paperStatus: "reprint"` and exclude them from counts and practice maps.
4. Keep aliases: old ids must still resolve to the canonical record.

**Acceptance:** no duplicate contributes twice to a count or a practice day; a
bookmarked old id still opens the right question; the cluster report is
regenerable.

## 2.5 — Answer-key coverage (owner gate)

**Steps**
1. Join quiz non-MCQs to PYQ answers by **source id** first
   (`sourceNumber`, paper code), then by exact normalised text (90 known).
2. Mark every unmatched item `answerStatus: "missing"` and make the UI exclude
   it from scoring.
3. Ask the owner to verify or supply keys for the remainder in batches (max 40
   per chat), each with its source citation.
4. Record the count: matched / owner-verified / missing, in the record.

**Acceptance:** no item is graded without a key; every key has a source; the
"no key" state is visible in the UI, not hidden; the counts are in the record.

## 2.6 — Bank currency

**Steps**
1. Add the 120 January-2026 PYQs to quiz banks where the question type allows,
   or record why not.
2. Decide CST207: create a bank from its 195 PYQs, or remove it from the
   selector until one exists. Never offer an empty quiz.
3. Derive year/source filter options from the data (kills the empty 2019/2020
   options and the hidden `EXTRA` source).
4. Record what "no data" looks like for each subject in the record.

**Acceptance:** every selectable filter yields ≥1 question; CST207 either works
or is not offered; 2026 is represented or explicitly explained.

## Phase checks

```sh
python3 scripts/validate_data.py --strict
python3 scripts/validate_syllabus.py --strict
python3 scripts/validate_pyq.py
python3 scripts/check_site.py --strict
```

**Not verifiable here:** whether a key is pedagogically correct. That is 2.5's
owner gate and 8.6's sign-off.
