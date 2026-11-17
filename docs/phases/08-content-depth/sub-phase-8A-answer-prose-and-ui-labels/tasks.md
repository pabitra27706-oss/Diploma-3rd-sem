# Sub-phase 8A — tasks

Parts are `8A.N`. Each part lists the steps, the acceptance criteria and the
evidence to quote. Nothing here authorizes a key change, a retag or a deploy.

---

## 8A.1 — Python pilot (branch `arena/858a50c7-diploma-3rd-sem`, PR #9, merged)

**Status:** ✅ merged to `main` as `365b8f7` (content commit `c47a0f7`, pin
commit `e53e4c5`).

**Steps**

1. Read the stored answers in `_data/CST203/CST203-P001-2022-06.json` and
   `CST203-P003-2023-03.json`; 40 MCQ answers were one-liners.
2. Rewrite each as: key statement, then a reason the key holds and why the
   near-miss option fails (~30–40 words).
3. Do the same for the 79 keyed MCQs in `_quiz-data/CST203/unit-1..5.json`,
   editing `explanation` only.
4. Leave `CST203-P004..P006` alone — they already carried multi-sentence
   answers.
5. Record the pattern in `docs/DECISIONS.md` so the next pass can copy it.

**Acceptance criteria**

- `git diff` for the two papers and the five bank files touches `answer` /
  `explanation` strings only.
- A 1-mark item fits in 2–3 sentences and does not restate the whole unit.

**Evidence to quote:** `docs/DECISIONS.md` — "Longer Python MCQ explanations and
duplicate-paper removal — 2026-11-17" (79 bank MCQs, 40 paper answers).

---

## 8A.2 — Quiz-bank explanations, every subject (branch `arena/637a5a31-diploma-3rd-sem`)

**Status:** ✅ shipped in `664674b`.

**Steps**

1. Inventory the banks: CST201 127 MCQs (units 47/16/21/19/24), CST205 102
   (22/20/37/23), CST209 108 (19/23/20/28/18). CST203 was done in 8A.1; CST207
   has no bank (`docs/data/README.md`).
2. Write the explanation against the **stored** key. Where two options are
   near-duplicates (CST205-U1-Q004 vs U1-Q019, U2-Q014 vs U2-Q018), say which
   distinction actually decides it.
3. Where the printed options are corrupted (`CST205-U3-Q010` prints
   `2^(h+1)-1`, `U3-Q012` prints `2^n`, `U4-Q002`, `CST209-U4-Q013` prints
   `O(VVV)`), explain the concept and name the stored key instead of retyping an
   option.
4. Apply with a scripted, id-checked merge (`apply(bank, {id: prose})`) and count
   the matches per unit; a mismatch is a bug, not a silent skip.

**Acceptance criteria**

- 127 + 102 + 108 = **337** explanations replaced in this branch, 100 % of the
  MCQs that have a bank.
- Diff against `365b8f7` for `_quiz-data/**`: `correct`, `options`, `question`,
  `marks`, `topic`, `unit`, `difficulty` unchanged; only `explanation` differs.
- No explanation is longer than ~45 words.

**Evidence to quote**

```text
quiz explanations rewritten: 337 structural problems: 0
```

---

## 8A.3 — PYQ answer prose (same branch)

**Status:** ✅ shipped in `664674b`.

**Steps**

1. Full rewrites for the terse papers: CST201 P001–P003, CST205 P001–P003,
   CST207 P001–P003, CST209 P001 and P003.
2. Expand only the shortest answers in the 2024/2026 papers (any answer under
   ~15 words) rather than rewriting papers that were already adequate.
3. Keep the existing "**Correct answer: X)**" prefix and its "**Model answer:**"
   variant — those markers are load-bearing in the UI and in the tests.
4. Where the paper itself is wrong (`CST207-P002-Q2` 0110+0110, `CST201-P001-Q8`
   2-byte `int`, `CST209-P001-Q7` imprecise wording, `CST207-P003-Q17` two true
   statements), say so inside the prose and keep the stored key.

**Acceptance criteria**

- **226** answers rewritten.
- Against `365b8f7`: zero changes to `question`, `options`, `correct`, `type`,
  `marks`, `unit`, `topic`, `difficulty`; only `answer` differs.
- Every paper now averages ≥ 16 words per MCQ answer (was 6.3 on
  CST207-P002 and 7.1 on CST209-P001).

**Evidence to quote**

```text
field changes (should be none): [] 0
answers rewritten: 226
```

---

## 8A.4 — Duplicate reprint removal, only where 2021 is missing

**Status:** ✅ both cases shipped (CST203 in 8A.1, CST209 in `664674b`).

**Owner rule (verbatim):** "only if 2021 is not available so a duplicate paper
was add you can remove a duplicate but don't do it if any other paper it not
available of a subject".

**Steps**

1. Establish which subjects have a 2021 sitting. Only **CST203** and **CST209**
   lack one; CST201, CST205 and CST207 each hold a 2021 paper.
2. Confirm the duplicate is byte-level content-identical to its twin and that the
   surviving copy is the better scan (CST203 P003 carries printed set `3013`).
3. Delete the file, remove its identity block from `scripts/validate_pyq.py`,
   and rewrite the registry (`totalPapers`).
4. Leave every other subject untouched — the rule does not permit deleting a
   2022/2023 paper whose year is otherwise present.

**Acceptance criteria**

- `python3 scripts/validate_pyq.py` → PASS, 28 papers / 924 questions, 0 warnings.
- The deleted paper has no unique question: every MCQ matches its twin on
  `question`, `options` and `correct`.
- Exactly one paper deleted per qualifying subject, and no other file removed.

**Evidence to quote**

```text
INFO validated 28 paper files: 28 rebuilt pilot-v1, 0 legacy
INFO validated 924 question objects
RESULT: PASS — all 28 registry papers are rebuilt and schema-valid
```

---

## 8A.5 — Subject names instead of course codes (UI only)

**Status:** ✅ shipped in `4e906e2`.

**Owner instruction (verbatim):** "this is only to apply in the ui no inner path
or code change … everywhere the subjects are in their code like cst20x it's hard
find the real subjects can you replace it with subjects name … in only the ui".
Follow-up answers: **short names** and **hide raw IDs**.

**Steps**

1. Fix the label map: CST201 → **C**, CST203 → **Python**, CST205 → **DS**,
   CST207 → **CSO**, CST209 → **Algorithms**.
2. Static pages: rewrite **text nodes and label attributes only** — `href`,
   `src`, `id`, `class`, `data-*`, `value`, canonical/OG URLs and every
   `<script>` body are skipped by the rewriter.
3. Subject hubs (5) and unit pages (24): nav brand, drawer header, breadcrumb and
   prose. The redundant `Code:` meta row is removed from the five hubs.
4. JS-rendered labels: `assets/js/app.js` card corner uses `shortName`;
   `quiz/js/common.js` gains `shortName` for the quiz pickers; `pyq/js/index.js`,
   `viewer.js`, `answers.js` print the subject name; a new
   `assets/js/subject-labels.js` provides `subjectLabel()` to search, repeated,
   cards, today and practice-session pages.
5. Hide raw IDs: paper rows show "March 2021 · P001 · Set 3013", toolbars show
   "Computer System Organization · March 2023 · P003", duplicate notes list
   session + paper only, and the two review aria-labels stop naming a question id.
6. Generated pages: `scripts/build_coverage.py` emits display labels for
   coverage, exam-pattern, courses and lab pages — the only source-code file the
   pass touches, and a label change only.
7. Regenerate search index, cards, bundles and presence; then prove the data
   layer did not move.

**Acceptance criteria**

- No page text contains `CST20n` (`grep` over stripped HTML text nodes = 0).
- `git show --stat 4e906e2` lists **no** `_data/` or `_quiz-data/` file, and no
  rename.
- `data-subject="CST201"`, `?subject=CST201`, `unit_progress_CST201` and
  `pyq_CST209_P003_*` are unchanged, so saved progress and deep links still work.
- `check_platform.py` 0 errors; `check_site.py --strict` no new finding versus
  `main`.

**Evidence to quote**

```text
data-subject="CST201">C / data-subject="CST207">CSO      (filter value kept, label changed)
git show --stat HEAD | grep -E "_data/|_quiz-data/|rename"   → (no output)
check_platform: 0 error(s)
```

---

## 8A.6 — Derived data, pins and gates

**Status:** ✅ shipped in `49758b6`, `1dcc57a`, `9b66c31`, `4e906e2`.

**Steps**

1. Regenerate in dependency order: catalog → practice days → catalog →
   search/repeat → cards → runtime pools → bundles → coverage → presence.
2. Re-anchor `_data/pyq-integrity.json` to the content commit in a **separate**
   commit, so the prose/deletion change stays reviewable.
3. Update `docs/data/validation-exceptions.json`: drop the finding whose paper no
   longer exists (`unit CST209-P002-Q34`), re-anchor the fingerprint of
   `CST205-P001-Q3`, keep every other code/target/message open.
4. Update the pinned expectations that the change invalidates: 958 → 924 records
   (`tests/test_data_pipeline.py`), 29 → 28 papers and 6 → 5 timed papers
   (`tests/attempt-store.cjs`), 35 → 1 alias (`tests/data-pipeline-consumers.cjs`),
   quiz base commit → `664674b`.
5. Update the current-state docs: `README.md`, `docs/data/README.md`,
   `prompt.md`, `rule.md`, `docs/DECISIONS.md`.

**Acceptance criteria**

- Running the generators twice changes nothing (idempotent).
- `validate_data.py --check-baseline` prints "Baseline matches source-review
  ledger"; `--strict` still fails on exactly the nine open findings.
- Python `unittest` 13 PASS; Node `attempt-store`, `storage`,
  `storage-recovery`, `study-store`, `data-pipeline-consumers`,
  `quiz-engine-dom` PASS.
- `check_site.py --strict`: 37 output lines on `main` and 37 here, differing only
  in the scanned path.

**Evidence to quote**

```text
catalog: 924 raw / 923 exact-unique PYQs; 872 quiz items; 456 missing keys
practice-pool: 923 questions · quiz-pool: 872 questions
check_pyq_integrity.py: 0 changed/added/missing files
Ran 13 tests … OK
```

---

## Not done in this sub-phase (stays open)

- The six CST203 key conflicts (`CST203-U1-Q014/Q024/Q035`, `U3-Q002/Q005`,
  `U4-Q030`) are still unfixed — a key change is 8.6 content verification and
  needs explicit approval.
- CST207 still has no quiz bank.
- The 2026-11-06 accessibility findings in `check_site.py --strict` (missing
  `<main>`/skip links on info pages, two unlabelled controls) are untouched;
  they belong to phase 7.
- Browser suites (`cards-offline`, `data-browser`, `paper-offline`,
  `platform-browser`, `quiz-engine-browser`, `discovery-study-browser`,
  `feedback-browser`) need Playwright, which is not installed here — CI runs
  them, and "Checks + preview" is green on PR #10.
