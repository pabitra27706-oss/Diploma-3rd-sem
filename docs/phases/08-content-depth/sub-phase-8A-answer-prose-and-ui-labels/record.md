<!-- SPDX-License-Identifier: MIT -->

# Sub-phase 8A — Answer prose and subject labels

- Status: ✅ shipped, awaiting owner acceptance · Date: 2026-11-17
- Branch: `arena/858a50c7-diploma-3rd-sem` (PR #9, merged) and
  `arena/637a5a31-diploma-3rd-sem` (PR #10, open), branched from
  `365b8f7bc4769691c032ae93b969f9db931ce091`
- CI: PR #10 run `44015939058` "Checks + preview" green · Netlify deploy preview
  `deploy-preview-10--diploma-3rd-sem` pass
- **Preview:** static preview served from the working tree
  (`python3 -m http.server 8000 --bind 0.0.0.0`); *shows: subject cards reading
  C · Python · DS · CSO · Algorithms, code-free filter buttons on PYQ/Roadmap,
  subject hubs and unit pages titled by name, and coverage/exam-pattern pages
  without course codes.*

## Parts

- 8A.1 — Python pilot (`arena/858a50c7…`, PR #9) — ✅ merged as `365b8f7`
- 8A.2 — quiz-bank explanations, all subjects (337 MCQs) — ✅ `664674b`
- 8A.3 — PYQ answer prose (226 answers) — ✅ `664674b`
- 8A.4 — duplicate reprint removal, owner rule — ✅ `c47a0f7` (CST203) and
  `664674b` (CST209)
- 8A.5 — subject names instead of course codes, UI only — ✅ `4e906e2`
- 8A.6 — derived data, pins, ledger, gates — ✅ `49758b6`, `1dcc57a`, `9b66c31`

## Reused (reuse scan for this sub-phase)

- Explanations — **BUILD** (hand-written prose; no generated text, no external
  model, no third-party licence involved).
- Duplicate detection — **DEPEND** on the existing exact-alias fingerprint in
  `scripts/data_pipeline.py` (`fingerprint`, `duplicates`); no new matcher.
- Prose application — **BUILD** a throwaway merge script in `/tmp` (id-checked,
  prints "n of m" so a missed id fails loudly); nothing added to `scripts/`.
- Subject labels — **BUILD** a 20-line `assets/js/subject-labels.js`; **REJECT**
  pulling a formatting library for a five-entry map.
- Derived pages — **DEPEND** on the existing `build_*.py` generators; the only
  generator edited is `scripts/build_coverage.py`, and only its display strings.

## Evidence (before the change)

- Terse answers, measured before the pass: CST207-P002-2022-06 averaged 6.3
  words per MCQ answer, CST209-P001-2022-06 7.1, CST201-P002-2022-06 9.5.
  Example: `_data/CST201/CST201-P002-2022-06.json` → `**Correct answer: B)
  High level language.**` with no reason.
- Duplicates confirmed in the tree: `_data/CST209/CST209-P002-2023-03.json` was a
  content duplicate of `CST209-P003-2023-03.json` (25 MCQs + 9 short answers),
  matching 34 exact-alias fingerprints before deletion.
- Codes in the UI, read from the files: `index.html` cards →
  `assets/js/app.js:1416` `'<div class="subject-code">' + subject.code`;
  `pyq/index.html:57-61` and `roadmap/index.html` filter buttons were literal
  `CST201…CST209`; `pyq/js/viewer.js:66` printed
  `` `${data.subject} · ${session} · ${data.paperCode}` ``;
  `exam-pattern.html` listed `CST201-P001-2021-03.json`.
- Generated-page trap: `scripts/build_coverage.py:20` emitted
  `<h2>{code} — {title}</h2>` and `:39` `{path.name}`, so an HTML-only edit would
  have been reverted by the next rebuild.

## What shipped

**Prose (no key, option, stem or mark touched)**

| Surface | Items | Files |
|---|---|---|
| Quiz-bank explanations | 337 (CST201 127, CST205 102, CST209 108) | `_quiz-data/{CST201,CST205,CST209}/unit-*.json` |
| PYQ answers | 226 (CST201 52, CST205 49, CST207 52, CST209 37, plus 36 shortest 2024/2026 answers) | `_data/CST*/CST*-P00*.json` |
| Python pilot (previous branch) | 79 bank + 40 paper answers | `_quiz-data/CST203/*`, `_data/CST203/P001,P003` |

**Duplicate removal** — `_data/CST203/CST203-P002-2023-03.json` (PR #9) and
`_data/CST209/CST209-P002-2023-03.json` (PR #10). Both subjects lack a 2021
sitting; CST201/CST205/CST207 do have one and were left alone.

**Counts after the deletion** — 28 papers, 924 raw PYQ records, 923 unique
practice questions, **1** exact alias (was 35), 5 timed papers, 872 quiz items,
456 items without an automatic key.

**Labels** — 5 subject hubs, 24 unit pages, 3 lab pages, 1 internship page,
home/quiz/PYQ/roadmap/practice/search/repeated/cards/today surfaces. New file
`assets/js/subject-labels.js`; `scripts/build_coverage.py` display strings.

**Data layer untouched by the label pass:**

```text
git show --stat 4e906e2 | grep -E "_data/|_quiz-data/|rename"   → (no output)
```

## Checks (no-device gate — knowledge/quality-without-a-device.md §1)

- JS parse: PASS (all touched scripts load in the Node DOM suite) · JSON: PASS
  (`validate_pyq.py`, 924 objects)
- Links/assets: `check_site.py --strict` → **37 output lines here and 37 on
  `main`**, differing only in the scanned path (17 pre-existing accessibility
  labels, listed below)
- HTML/a11y: unchanged findings — `<main>`/skip-link missing on `info/*`,
  `offline.html`, `pyq/viewer.html`; unlabelled controls `searchInput`
  (`pyq/answers.html`) and `import-prefs` (`settings.html`); no `<h1>` on
  `practice/session.html`, `pyq/viewer.html`
- Budgets: `.json` 78 files / 5,188,161 bytes, largest
  `assets/data/practice-pool.json` 979,550 bytes; `.js` largest
  `quiz-setup.bundle.js` 97,791 bytes (bundle regenerated, size unchanged in kind)
- Suites: Python `unittest` **13 PASS**; Node `attempt-store`, `storage`,
  `storage-recovery`, `study-store`, `data-pipeline-consumers`,
  `quiz-engine-dom` **PASS**
- Integrity: `validate_pyq.py` PASS (28 papers / 924 questions, 0 warnings);
  `check_pyq_integrity.py` 0 changed/added/missing; `check_platform.py` 0 errors;
  `validate_data.py --check-baseline` → "Baseline matches source-review ledger";
  `validate_data.py --strict` fails on the same 9 open findings by design
- **Not run / not verifiable here:** the seven Playwright browser suites
  (`cards-offline`, `data-browser`, `discovery-study-browser`,
  `feedback-browser`, `paper-offline`, `platform-browser`,
  `quiz-engine-browser`) — Playwright is not installed in this sandbox; CI runs
  them and PR #10's "Checks + preview" job is green. No real-device pass and no
  print/PDF export was observed (phase 10 owns that).

## Design comparison (UI phases only)

- Against `docs/DESIGN.md`: subject identity was carried by a monospace code
  chip, which is a data label, not a student-facing name. Now the compact chip
  carries the short name and the card/hub heading carries the full syllabus
  name, so the card still reads as one identity block. No layout, colour token
  or spacing rule changed; only text content and one removed meta row.
- Exception recorded: the address bar, share links and offline storage keys still
  contain the course codes. That is deliberate — changing them would break saved
  progress and deep links, which the owner ruled out.

## Real-phone pass (launch phases only)

- Not performed. Owner testing is via Termux (`python -m http.server`) per
  `rule.md` §7; commands for that are in `prompt.md` and the chat report.

## Next-chat prompt

- [x] Printed IN CHAT at sub-phase end (2026-11-17); `prompt.md` updated in
      this commit as backup.

## Follow-ups

- Six CST203 stored-key conflicts await an owner decision (content verification,
  8.6).
- CST207 still has no quiz bank; 456 quiz items still have no automatic key.
- The accessibility findings above belong to phase 7 and were not re-scoped here.
- If the owner wants the codes gone from URLs too, that is a breaking migration
  (bookmarks, saved progress, offline keys) and must be planned as its own phase.
