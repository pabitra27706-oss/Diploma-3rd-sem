# PYQ paper schema — rebuilt-paper `v1`

This document describes the schema used by rebuilt papers. The first pilot was December 2024 Python; the January 2024 batch applied it to five more papers, the December 2024 follow-up applied it to the remaining four subjects, the March 2023 batch applied it to five attached scans, the June 2022 batch added a three-group A/B/C format, and the January 2026 batch added five new `P006` registry papers:

- Pilot paper: `_data/CST203/CST203-P005-2024-12.json`
- January 2024 batch: `_data/CST{201,203,205,207,209}/*-P004-2024-01.json`
- December 2024 follow-up: `_data/CST{201,205,207,209}/*-P005-2024-12.json`
- March 2023 attached-scan batch: `_data/CST{201,203,205,207,209}/*-P003-2023-03.json`
- June 2022 attached-scan batch: `_data/CST201/CST201-P002-2022-06.json`, `_data/CST203/CST203-P001-2022-06.json`, `_data/CST205/CST205-P002-2022-06.json`, `_data/CST207/CST207-P002-2022-06.json`, `_data/CST209/CST209-P001-2022-06.json`
- January 2026 attached-scan batch: `_data/CST{201,203,205,207,209}/*-P006-2026-01.json`
- Registry entry: `_data/CST203/registry.json` → `P005`
- Source: user-attached `Python, Dec 2024.pdf`
- Printed paper code: `307/2(N)`
- Printed scan/set number: `3096266` — **not** a paper code
- Session: December 2024, 3 hours, full marks 60
- Schema: `pilot-v1`

Twenty-five papers are rebuilt so far; the five remaining legacy records are intentionally left in their legacy format for now. They continue to work through the viewer/practice fallback paths. March 2023 papers use 25 one-mark Group A MCQs (answer any 20) plus nine eight-mark Group B questions (answer any five), `2.5 Hours`. June 2022 papers use Group A (Q1 MCQs, Q2 fill-in-the-blanks, Q3 short answers; answer any 10 from each section), Group B (Q4, answer any six at 2 marks), and Group C (Q5–Q7, answer any one of three 6-mark alternatives from each question), `3 Hours`. January 2026 papers use 15 two-mark Group A MCQs (answer any 10; 1 mark for the answer and 1 mark for the explanation) plus nine eight-mark Group B questions (answer any five), `2.5 Hours`. All June 2022 Group C alternatives are separate question objects with `choiceSet` metadata. March 2023, June 2022, and January 2026 use `regulation: null`; for January 2026 the attached scans do not explicitly print a regulation, so it is not inferred from the separate syllabus PDF.

---

## Why this schema exists

The legacy paper files collapse the exam paper into a flat `questions` array. That loses:

- Group A / Group B boundaries
- "Any ten of fifteen" / "any five of eight" choice rules
- per-question mark splits
- structured MCQ options and a machine-readable correct choice
- source-page provenance and transcription notes
- syllabus-deviation notes

The pilot schema restores those facts explicitly for one paper so the website can render an exam-paper-like layout and a real practice/review mode.

### Source-fidelity policy

The attached PDF is the source of truth. OCR plus visual proofreading of all three pages was used. HTML entities, typographic quotes, obvious print artifacts, and capitalization were normalized to valid Python/English; every such normalization is recorded in `sourceNote` at paper or question level.

Examples:

- `&quot;` → `sep="/"`
- `&#39;` → straight quotes in `x = ['ab', 'cd']`
- `Print(A[1:])` → `print(A[1:])`
- `readlineO` → `readline()`
- `('tao', 93, 99, 'time')` preserved as a tuple

The repository's earlier version of this paper had several source errors, including a set instead of a list in Q4, a corrupted tuple in Q7, and a changed character in Q13. Those are corrected and annotated.

### No official answer key

No official answer key was supplied. Every `answer` in this pilot is a **model answer** derived from the question text. The root field is explicit:

```json
"answerKeyStatus": "no-official-key; model answers"
```

Do not present these as official WBSCTE answers.

---

## Root fields

| Field | Meaning |
|---|---|
| `subject`, `paperIndex`, `paperCode`, `fileName` | Existing repository identity fields |
| `sourcePaperCode` | Printed paper code, e.g. `307/2(N)` |
| `examSession`, `scanSetNumber`, `regulation` | Session, printed scan/set number, and regulation/cohort label; March 2023, June 2022, and January 2026 use `null` for regulation |
| `year`, `month`, `monthNumber` | Existing date fields |
| `duration`, `fullMarks`, `totalQuestions` | Exam metadata and actual number of question objects |
| `sourceFile`, `sourceStatus`, `sourceNote` | Provenance and verification details |
| `answerKeyStatus` | Explicit disclaimer that answers are model answers |
| `schemaVersion` | `pilot-v1`; enables strict validation |
| `paperFormat` | Group/choice/marks metadata |
| `questions` | 23 objects in older Jan/Dec papers (15 Group A + 8 Group B; CST207 Dec has 14 + 8); 34 objects in March 2023 papers (25 Group A + 9 Group B); 62–66 objects in June 2022 papers; 24 objects in January 2026 papers (15 Group A + 9 Group B) |

---

## `paperFormat`

```json
{
  "timeAllowed": "3 Hours",
  "totalMarks": 60,
  "generalInstructions": ["..."],
  "groups": [
    {
      "id": "A",
      "groupLabel": "GROUP-A",
      "title": "Group A — Multiple Choice",
      "instruction": "Choose the correct answer from the given alternatives and explain your answer (any ten): 2 × 10 = 20",
      "additionalInstruction": "Answer to Question No. 1 of Group A must be written in the main answer script. 1 mark is for the right answer and 1 mark is for the correct explanation.",
      "questionIds": ["CST203-P005-Q1", "..."],
      "marksFilter": [2],
      "totalSet": 15,
      "answerAny": 10,
      "marksEach": 2,
      "markSplit": "1 mark answer + 1 mark explanation",
      "maxMarks": 20
    },
    {
      "id": "B",
      "groupLabel": "GROUP-B",
      "title": "Group B — Subjective",
      "instruction": "Answer any Five (05) questions.",
      "questionIds": ["CST203-P005-Q16", "..."],
      "marksFilter": [8],
      "totalSet": 8,
      "answerAny": 5,
      "marksEach": 8,
      "markSplit": "Subpart marks are shown with each question",
      "maxMarks": 40
    }
  ]
}
```

`marksFilter` is retained for backward compatibility with the existing viewer's group-by-marks code. `questionIds` is authoritative for the pilot.

---

## Question fields

All pilot questions include the legacy fields plus:

| Field | Meaning |
|---|---|
| `group` | `A` or `B` |
| `sourceNumber` | Printed source number, e.g. `i`, `2`, `9` |
| `sourcePage` | Attached PDF page and source question number |
| `sourceStatus` | `verified-against-attached-scan` |
| `answerStatus` | `model-answer` |
| `topic`, `tags`, `difficulty`, `practiceDay` | Practice/filter metadata |
| `markSplit` | MCQ `1+1`, or Group B subpart split such as `5+3` |
| `sourceNote` | Optional transcription/HTML-entity normalization note |
| `syllabusNote` | Optional note where the exam deviates from or extends the attached syllabus |

### Group A — MCQ

```json
{
  "type": "mcq",
  "options": [
    { "key": "A", "text": "..." },
    { "key": "B", "text": "..." },
    { "key": "C", "text": "..." },
    { "key": "D", "text": "..." }
  ],
  "correct": "B",
  "answer": "**Correct answer: B) ...** ... explanation ...",
  "marks": 2,
  "markSplit": "1+1"
}
```

`correct` accepts a letter/key (`"B"`) in the pilot. The UI also accepts numeric indices and legacy string-array options. Older Jan/Dec and January 2026 MCQs are 2 marks with `markSplit: "1+1"`; March 2023 and June 2022 Q1 MCQs are 1 mark with `markSplit: "1"`; June 2022 short answers and Q5–Q7 alternatives use single whole-mark splits.

### Group B — subjective

```json
{
  "type": "theory",
  "question": "i) ...\\nii) ...",
  "subparts": [
    { "label": "i", "text": "...", "marks": 5 },
    { "label": "ii", "text": "...", "marks": 3 }
  ],
  "markSplit": "5+3",
  "marks": 8,
  "answer": "..."
}
```

The exam-paper viewer renders `subparts` with their printed mark splits. Practice/review mode renders `question` and `answer` through the existing rich-content renderer.

---

## UI behavior

### Exam paper viewer

`pyq/viewer.html`, `pyq/js/viewer.js`, `pyq/css/viewer.css`:

- on screen, shows a compact question-list overview with group choice rules and one-line question summaries
- **Print / Save as PDF** shows the full exam paper with `paperFormat.generalInstructions`, Group A and Group B headings, instructions, choice rules, and marks notes
- the full print paper numbers Group A by Roman source number and Group B by printed source number
- the full print paper renders code blocks, structured options, subparts, source notes, and syllabus notes
- shows the attached source file and verification status
- links to practice mode
- falls back to the original group-by-marks renderer for the other 24 papers

### Practice / answers mode

`pyq/answers.html`, `pyq/js/answers.js`, `pyq/css/answers.css`:

- normalizes all three option shapes:
  - pilot object array: `[{ "key": "A", "text": "..." }]`
  - legacy string array: `["...", "..."]`
  - quiz-style object map: `{ "A": "...", "B": "..." }`
- resolves `correct` as a numeric index, letter, or option key
- supports interactive MCQ feedback, Show Answer for theory, review mode, and print mode
- shows Group / Source / mark-split badges where present
- shows source and syllabus notes
- uses `examSession` and `scanSetNumber` in the header when available
- falls back cleanly for legacy papers without `paperFormat`

### Mode selector

`pyq/select.html` now shows the exam session, scan/set number, and source status for the pilot paper while leaving legacy entries unchanged.

---

## Batch status

| Batch | Status |
|---|---|
| December 2024 Python pilot (`CST203 / P005`) | Done |
| January 2024, all five subjects (`P004`) | Done — 5 papers, 115 questions |
| December 2024, remaining four subjects (`P005`) | Done — 4 papers, 95 questions; CST207 has 14 MCQs as printed |
| March 2023 attached scans (`CST201`, `CST203`, `CST205`, `CST207`, `CST209` / `P003`) | Done — 5 papers, 170 questions; 25 one-mark MCQs + 9 theory questions each |
| March 2023 duplicate/mislabelled mappings | Canonical `P003` entries rebuilt from attached scans; `2235`, `3013`, `526` recorded as scan/set numbers; duplicate `P002` legacy records left untouched |
| March 2023 Algorithms (`CST209`) | Done after user supplied `Algorithms, March 2023.pdf`; generic `Algorithms .pdf` is January 2026 and was not used |
| June 2022 attached scans (`CST201` / `P002`, `CST203` / `P001`, `CST205` / `P002`, `CST207` / `P002`, `CST209` / `P001`) | Done — 5 papers, 321 questions; A/B/C format, 3 Hours, full marks 60; `regulation: null`; printed set numbers `1459`, `1438`, `1441`, `1466`, `1455`; all Q5–Q7 a/b/c alternatives separately modeled |
| Papers without attached scans | Paused; user chose to supply/stop for scans before touching them |
| January 2026 attached PDFs (`CST{201,203,205,207,209}` / `P006`) | Done — 5 new registry papers, 120 questions; 15 two-mark MCQs + 9 theory questions each, 2.5 Hours, full marks 60; `regulation: null` because no regulation is printed; set numbers `5966`, `5906`, `5933`, `5926`, `5927` |

## Validation

```bash
python3 scripts/validate_pyq.py
```

The validator:

- checks all five registries and all 30 paper JSON files
- strictly validates all 25 `pilot-v1` papers, their group/section/choice-set math, question coverage, MCQ options/correct values, subpart mark sums, provenance, and no-official-key disclaimer
- allows March 2023, June 2022, and January 2026 `regulation: null` while still requiring `"Revised 2022"` for Jan/Dec 2024 papers
- checks exact source-file, paper-code, and scan/set-number identity for Dec 2024, all five March 2023 papers, all five June 2022 papers, and all five January 2026 papers
- checks that registry entries do not mistake printed scan/set numbers for paper codes
- checks all legacy papers for viewer/practice fallback compatibility
- reports legacy inconsistencies as **warnings**, not errors

A successful run ends with:

```text
RESULT: PASS — rebuilt papers valid; legacy warnings are non-fatal fallback-compatibility notes
```

Known legacy warnings are deliberately non-fatal at this stage: declared-vs-actual `totalQuestions` mismatches and a legacy image path.

---

## Scope boundaries

This staged rebuild does **not**:

- rebuild the remaining five legacy papers without user-supplied scans
- resolve the wider legacy vs Revised-2022 regulation ambiguity
- silently normalize the CST209 Unit 5 or credit/hour conflicts between the attached syllabus and other evidence
- merge legacy `(S)`, special `305-*`/`307-S-N`, or January 2026 cohorts into regular-paper evidence
- claim 100% verbatim accuracy; all answers are model answers and official keys were not supplied

Those remain separate evidence categories for a later, separately approved expansion.
