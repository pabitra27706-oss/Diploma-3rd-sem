# Phases

> **Owner closure, 2026-11-18:** Phases 1–10 are administratively closed; further
> testing is skipped by direction. This does not convert skipped/unverified work
> to passes. See the authoritative [project closure table](../PROJECT-CLOSURE.md)
> and [current status](../STATUS.md); older phase records preserve evidence and
> caveats as written.

Every phase has its own folder. The folder is the task record: what the phase
is for, what its parts are, how each part is accepted, and what "done" means.
`docs/ROADMAP.md` is the status board; this folder is the detail.
[Current handoff and remaining work](../STATUS.md) is the up-to-date summary.
[Phase 11](11-suggestions/README.md) is open for owner review of the five
Suggestions pairs, and **Phases 12–16** are planned subject-by-subject content,
topic-wise YouTube curation, and PYQ↔unit synchronization blueprints across all
five 3rd-semester theory courses (23 official syllabus units + Algorithms CO5
Supplementary Unit 5). None of Phases 11–16 reopen Phases 1–10.

```text
docs/phases/
  00-foundation/          rules, playbook, gate, baseline             ✅
  01-platform/            deploy paths, PWA, install/update, presence
  02-data-pipeline/       one source of truth for content and counts
  03-quiz-engine/         attempts, mock papers, history, mistakes
  04-discovery/           search, repeated questions, deep links
  05-study-system/        flashcards, scheduling, weak topics, daily goal
  06-state-portability/   one storage layer, notes, backup/restore
  07-inclusion-trust/     accessibility, reading controls, i18n, truth
  08-content-depth/       syllabus coverage, sheets, labs, print
    sub-phase-8A-answer-prose-and-ui-labels/  answer prose + subject names
  09-performance-launch/  budgets, measurement, domain readiness, launch
  10-device-acceptance/   final cross-device matrix after implementation 1–9
  11-suggestions/         subject-wise past questions and quick revision guides
  12-cst201-c-content/          Computer Programming in C (unit-1..5/)          ✅
  13-cst203-python-content/     Scripting Languages — Python (unit-1..5/)       ✅
  14-cst205-ds-content/         Data Structures (unit-1..4/)                    ✅*
  15-cst207-cso-content/        Computer System Organization (unit-1..5/)       ✅*
  16-cst209-algorithms-content/ Algorithms (unit-1..4/ + unit-5-supplementary/) ✅*
  17-topic-map-crosscheck/      topic-map audit across all five subjects       ✅*
  18-pyq-answer-expansion/      924 PYQ model-answer expansion & rich boxes     🚧 (18.1 + 18.5 CSO ✅)
```

## Folder convention

Each phase folder holds at least:

| File | Purpose |
|---|---|
| `README.md` | Goal, why it matters now (with evidence), scope in/out, dependencies, gates, risks, "Done means" |
| `tasks.md` | The parts (`N.1`, `N.2`, …) with steps, acceptance criteria, and the evidence to quote |
| `record.md` | Written **during** the phase: what shipped, what was checked, what could not be verified |

`record.md` is created when the phase starts, from
`webflow/templates/docs-system/PHASE_RECORD.md`. A phase without a record is
not done, even if the code works.

## Sub-phases

Owner-requested work that belongs to a phase but is not one of its numbered
parts lives in a `sub-phase-<NN><letter>-<slug>/` folder **inside that phase**,
with the same three files and the same rules. It never adds a part to the parent
phase (rule 2 below) and it never gets its own roadmap row; the parent phase's
record links to it.

| Sub-phase | Parent | Covers |
|---|---|---|
| [`8A — Answer prose and subject labels`](08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/README.md) | 8 | MCQ/PYQ explanation prose, duplicate-reprint removal, subject names in the UI |

## Rules that apply to every phase

1. **Owner-updated sequencing (2026-11-09).** Implement phases 1–9 first,
   followed by dedicated Phase 10 cross-device acceptance. Cross-phase
   engineering batches are permitted; keep a separate record for each phase.
2. **Big by design.** A phase is one whole capability with 4–6 parts. If a
   folder grows a seventh part, the scope was wrong — move a part, do not split
   the phase.
3. **Evidence first.** Every claim in a part's steps quotes `file:line`, a
   command output, or a syllabus page. `docs/AUDIT.md` is the 2026-11-06
   baseline, not a substitute for reading the file.
4. **Order matters.** Phase 2 feeds 3, 4, 5 and 8. Phase 6 must land before
   backup/restore is meaningful. Phase 7 can run in parallel with 8 only if the
   files touched do not overlap.
5. **Owner gates.** Content verification (2.5, 8.6), license (7.5), and any
   deploy (9.6) stop for an explicit answer. Nothing here authorises a deploy.
6. **Definition of done** (from `rule.md` §6): checks green, `site-preview`
   artifact, record written, roadmap row updated, `prompt.md` updated,
   next-chat prompt printed in chat.

## Cross-phase dependencies at a glance

| Needs | Before | Why |
|---|---|---|
| Flashcards (5) | Answer keys (2.5) | A card whose back is blank teaches nothing |
| Weak topics (5.3) | Real topic labels (2.3) | 321 records currently say "Short answer" |
| Mock paper (3.3) | Marks reconciliation (8.5) | Data says ~70 marks/paper, syllabus ESE says 60 |
| Search (4) | Stable ids (2.4) | Duplicate clusters must be resolved before indexing |
| Backup (6.5) | One storage layer (6.1) | Backing up three schemas backs up nothing |
| Coverage map (8.1) | Syllabus join (2.3) | The map is the join, rendered |
| Launch (9.6) | Everything above | It is the last gate, not a milestone |
| Subject content (12–16) | Closed baseline (0–10) + Suggestions anchors (11) | Preserves all 46 `guides.json` anchors, `section-notes.js` IDs, PWA budgets, and `pyq-integrity.json` |

## Shared rules for subject content phases (12–16)

1. **Nested `subject/unit/` layout & strict 2023–2026 PYQ weight calibration.** Each of Phases 12–16 holds `README.md`, `tasks.md`, `record.md`, and one folder per unit (`unit-1/` … `unit-N/README.md`, plus `unit-5-supplementary/` in Phase 16 for CO5 String & Trie Algorithms) combining verbatim Revised-2022 syllabus scope (`docs/syllabus/syllabus.json` / `syllabus-3rd-sem-2022.pdf` pp. 3–13) with an exact mark-weight analysis of **all 2023–2026 PYQ papers only** (`P003-2023-03`, `P004-2024-01`, `P005-2024-12`, `P006-2026-01` across all 5 subjects — **20 papers, 523 scan-verified questions, 1,965 printed set marks**; the 8 older `2021–2022` `P001`/`P002` papers = 401 questions remain intact in the archive but are excluded from topic weighting and scope calibration). Every unit topic is assigned a measured 2023–2026 exam-weight tier so prose depth, worked traces/code, practice budgets, and YouTube slots scale proportionally to actual exam marks:
   - **Tier A — Core Heavyweight** (`>= 20m` / `>= 5.0%` of subject set marks, or `4/4` papers with repeated 8m subparts): full explanation, step-by-step trace/code/numerical, comparison table, exam pitfalls, 3–4 MCQs + 2 short + 2 long model answers, primary video slot.
   - **Tier B — Regular Exam Topic** (`10–19m` / `2.5–4.9%`, `2–4` papers): focused prose, 1 complete worked example/code/trace, 2 MCQs + 1 short + 1 long model answer, dedicated or shared video slot.
   - **Tier C — Low-Weight / Occasional** (`1–9m` / `< 2.5%`, `1–2` papers or MCQ-only): concise explanation + 1 compact snippet + 1–2 practice items.
   - **Tier S — Syllabus-Only (`0m` in 2023–2026)**: listed in the Revised-2022 syllabus PDF with zero `P003–P006` marks; covered concisely (definition, rule/syntax, 1 short example, 1 self-check item) for syllabus completeness without bloating page length.
   - **Tier E — Exam Extension (Out-of-Syllabus 2023–2026 Hit)**: absent from the printed unit topic list yet tested in `P003–P006`; isolated in an explicitly badged *"Exam note (beyond printed syllabus)"* callout (or supplementary unit for Algorithms CO5 `42m / 10.6%`) sized strictly to its 2023–2026 marks.
   Practical labs (`CST211` [30h, 2 cr, PDF p. 14; code printed `COPC211` on p. 2], `CST213` [2 cr, `0-0-4`, PDF pp. 16–18], `CST215` [60h, 2 cr, `0-0-4`, PDF p. 19]) and Summer Internship-I (`SI201`, 1 cr, PDF p. 22) remain honest syllabus-reference pages at `subjects/{CST211,CST213,CST215,SI201}/index.html` (`Phase 8.4`) and are cross-linked from their matching theory phases.
2. **Topic-wise YouTube curation at execution time only.** Planning files contain zero fabricated or guessed URLs. During implementation of any phase 12–16, research online per Tier A/B topic slot, verify every video live (public playback, Revised-2022 syllabus & 2023–2026 PYQ accuracy, mobile legibility), render **plain external `<a href="https://www.youtube.com/watch?v=..." target="_blank" rel="noopener noreferrer">` links only** (zero `<iframe>` embeds, zero external scripts, zero `i.ytimg.com` thumbnails — keeps third-party runtime requests at `0`, static requests ≤12/view, offline PWA & `info/privacy-policy.html` truthful), and record every verified URL in that phase's `record.md`.
3. **Bidirectional Unit-Topic ↔ PYQ Synchronization.** Every unit edit preserves all existing `<section id>` / `<h3 id>` anchors (protecting `section-notes.js` keys, all 46 `docs/suggestions/guides.json` anchors, and DOM test targets) and avoids raw `CST20X` codes or `P00Y-QZ` IDs in student-facing prose (`Phase 8A`). **Mode A (default)** leaves frozen `_data/*.json` untouched (`scripts/check_pyq_integrity.py` = 0 drift) and fixes all 2023–2026 PYQ `.unit-topic-link` mismatches (`172` unmatched + `148` cross-unit redirects + `1` generic `#short-questions` match + `1` out-of-unit CO5 link across the 523 questions) via targeted `<h3 id>` headings and `assets/js/unit-discovery.js` routing (excluding generic practice/revision anchors and adding `CST209` supplementary `unit-5.html` fallback while keeping `SYLLABUS_UNITS.CST209 = 4`). **Mode B (owner-gated)** executes only if the owner explicitly approves editing `_data/<SUBJECT>/*.json` and refreshing `_data/pyq-integrity.json`, `docs/data/validation-exceptions.json`, `docs/suggestions/guides.json`, `docs/revision-sheets/<SUBJECT>.json`, and `roadmap/path.md`.
4. **Canonical rebuild & gate sequence after any unit/PYQ change (`README.md:161–215`).** Rebuild in exact order: `build_data_catalog.py` → `build_practice_days.py` → `build_cards.py` → `build_runtime_data.py` → `build_coverage.py` → `build_revision_sheets.py` → `build_verification.py` → `build_runtime_bundles.py` → `build_icon_subset.py` → `build_suggestions.py` → `generate_presence.py` (twice for idempotence) → `build_search_index.py` → `build_data_version.py` (must be last). Update `unitAnchored` (`580` baseline in `tests/test_discovery.py:111`) when `<h3 id>` count grows, then pass `check_pyq_integrity.py`, `check_platform.py`, `build_suggestions.py --check`, `check_site.py --strict --quiet`, `validate_pyq.py`, `validate_data.py --check-baseline`, `validate_syllabus.py`, `audit_accessibility.py --fail`, `check_tokens.py --strict`, `build_icon_subset.py --check`, `build_data_version.py --check`, `audit_page_weight.py --budget`, `check_root_rewrite.py`, `check_readme_paths.py`, `python3 -m unittest discover -s tests -t .`, and the Node suites (`tests/discovery-dom.cjs`, `tests/data-version.cjs`, etc.). Recommended execution order by 2023–2026 weight-to-page gap: **15 (CSO) → 13 (Python) → 16 (Algorithms) → 14 (Data Structures) → 12 (C)** (or any single subject independently).

### 2023–2026 subject weight & blueprint matrix (`P003–P006` only — 20 papers, 523 Qs, 1,965 set marks)

| Phase | Subject (Syllabus Ref) | Companion Lab | Parts | 2023–26 Qs / Marks | Unit Weight Split (True Syllabus Order) | Baseline → Target Words | PYQ Route Baseline (Same / Redir / Miss) | YT Slots |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :---: |
| [`12`](12-cst201-c-content/README.md) | C (`CST201` · 2cr, 30h, p. 3) | `CST211` (p. 14) | 6 | `105 Q / 395m` | U1 `86` · U2 `95` · U3 `66` · U4 `97` · U5 `51` | `30,979w → ~28.9–32.0kw` | `46 / 29 / 30` → **`103 / 2 / 0`** | `16` |
| [`13`](13-cst203-python-content/README.md) | Python (`CST203` · 2cr, 30h, pp. 5–7) | `CST213` (pp. 16–18) | 6 | `104 Q / 387m` | U1 `152` · U2 `64` · U3 `92` · U4 `49` · U5 `30` | `23,018w → ~26.2–29.2kw` | `78 / 11 / 15` † | `14` |
| [`14`](14-cst205-ds-content/README.md) | DS (`CST205` · 3cr, 45h, p. 7) | `CST215` (p. 19) | 5 | `106 Q / 403m` | U1 `40` · U2 `143` · U3 `75` · U4 `145` | `26,651w → ~25.4–28.1kw` | `40 / 55 / 11` | `13` |
| [`15`](15-cst207-cso-content/README.md) | CSO (`CST207` · 4cr, 60h, p. 10) | _theory-only_ | 6 | `103 Q / 385m` | U1 `81` · U2 `112` · U3 `78` · U4 `4` · U5 `110` | `32,228w → ~30.6–33.9kw` | `17 / 35 / 50` (+1 fp) | `15` |
| [`16`](16-cst209-algorithms-content/README.md) | Algorithms (`CST209` · 4cr, 60h, p. 12) | _theory-only_ | 6 | `105 Q / 395m` | U1 `89` · U2 `79` · U3 `92` · U4 `93` · CO5 U5 `42` | `29,724w → ~30.0–33.1kw` | `56 / 22 / 26` (+1 oou) | `15` |

† Re-measured 2026-11-19 during Phase 13.1. The earlier `42 / 7 / 55` figure describes the matcher **before** the Phase 12 tie-break rule in `scripts/audit_topic_routing.py`; it is retained here only as history. The current triple still hides the real defect, because 61 of those 104 questions resolve to a coarse `<section id>` chapter title rather than a concept heading — see `docs/phases/13-cst203-python-content/record.md` §3.1.

| **All** | **23 Official + 1 CO5 Supp.** **3 Labs + `SI201`** | **29** | **`523 Q / 1,965m`** | **100% syllabus + badged Tier E items** | **`142,600w → ~141.1–156.3kw`** | **`201 / 148 / 172` (+2)** | **`73`** |

