Documentation checkpoint: **2026-11-18 — Phases 1–10 administratively closed by owner direction**. The controlling closure table is [`PROJECT-CLOSURE.md`](PROJECT-CLOSURE.md): implemented work keeps its recorded pass evidence; remaining tests/content checks are marked skipped or unverified, never promoted to passes. Detailed phase evidence remains historical and is superseded for scheduling by that closure decision.

## Home maintenance — 2026-11-18 (working tree)

The theory roadmap now follows existing manual checkmarks rather than the date
of first launch. Home and Today agree on study streaks. The local greeting
updates at its time boundaries and on resume; the welcome screen, Home, tab
and install surfaces share one book-and-code logo. The focused Chromium
regression covers these flows and the cached checklist offline; it is not a
physical launcher, device or deployment sign-off.

## Owner closure — 2026-11-18

**Phases 1–10 are closed at the owner's direction.** No further tests are to be
run in this scope. This is an administrative closeout, not a blanket technical
pass: remaining requirements are explicitly skipped or left unverified in
[`PROJECT-CLOSURE.md`](PROJECT-CLOSURE.md). Phase 10's device report is partial;
content remains uncertified; no new deploy is authorized.

## Phases 12–16 — 2023–2026 PYQ Weight-Calibrated Content, Video Curation & PYQ Sync Blueprints (2026-11-18) — 📋 planned

Five documentation-only subject blueprints are planned on
`arena/d77ff9fd-diploma-3rd-sem` (from `main` at `f52d2f6`) without touching any
shipped HTML, CSS, JS, Python, `_data/`, or `_quiz-data/` file and without
reopening closed Phases 1–10. By owner direction, topic depth and exam weights
are calibrated strictly to the **2023–2026 WBSCTE PYQ window** (`P003-2023-03`,
`P004-2024-01`, `P005-2024-12`, `P006-2026-01` per subject — **20 papers, 523
scan-verified questions, 1,965 printed set marks**; excluding the 8 older
`2021–2022` `P001`/`P002` papers = 401 questions) paired with verbatim
Revised-2022 syllabus scope (`docs/syllabus/syllabus.json`, PDF pp. 3–13):

- **[Phase 12 — Computer Programming in C](phases/12-cst201-c-content/README.md)** (`unit-1/`–`unit-5/`, 6 parts · 2 cr, 30h [5+5+7+7+6], p. 3 · 4 papers / 105 Qs / 395m: U4 `97m` 24.6%, U2 `95m` 24.1%, U1 `86m` 21.8%, U3 `66m` 16.7%, U5 `51m` 12.9%) — 🚧 **all six parts shipped (12.4, 12.2, 12.1, 12.3, 12.5 and 12.6)**; 12.6 is awaiting the owner verdict. All five unit pages are rewritten to the PYQ weights, `105/105` 2023–2026 C PYQs route to a syllabus heading (`103` same-unit, `2` correct cross-unit redirects, `0` unmatched, from `46/29/30` at baseline), and the recorded CST201 U3↔U4 tag inversion is **resolved at source** in both `_data/` and `_quiz-data/` rather than merely disclosed
- **[Phase 13 — Scripting Languages (Python)](phases/13-cst203-python-content/README.md)** (`unit-1/`–`unit-5/`, 6 parts · 2 cr, 30h [7+5+6+6+6], pp. 5–7 · 4 papers / 104 Qs / 387m: U1 `152m` 39.3%, U3 `92m` 23.8%, U2 `64m` 16.5%, U4 `49m` 12.7%, U5 `30m` 7.8%)
- **[Phase 14 — Data Structures](phases/14-cst205-ds-content/README.md)** (`unit-1/`–`unit-4/`, 5 parts · 3 cr, 45h [3+12+15+15], p. 7 · 4 papers / 106 Qs / 403m: U4 `145m` 36.0%, U2 `143m` 35.5%, U3 `75m` 18.6%, U1 `40m` 9.9%)
- **[Phase 15 — Computer System Organization](phases/15-cst207-cso-content/README.md)** (`unit-1/`–`unit-5/`, 6 parts · 4 cr, 60h [6+20+10+9+15], p. 10 · 4 papers / 103 Qs / 385m: U2 `112m` 29.1%, U5 `110m` 28.6%, U1 `81m` 21.0%, U3 `78m` 20.3%, U4 `4m` 1.0%)
- **[Phase 16 — Algorithms](phases/16-cst209-algorithms-content/README.md)** (`unit-1/`–`unit-4/` + `unit-5-supplementary/`, 6 parts · 4 cr, 60h [6+16+18+20], p. 12 · 4 papers / 105 Qs / 395m: U4 `93m` 23.5%, U3 `92m` 23.3%, U1 `89m` 22.5%, U2 `79m` 20.0%, CO5 U5 `42m` 10.6%)

Each unit blueprint grades every topic into weight tiers (**Tier A** core
heavyweight, **Tier B** regular, **Tier C** low-weight, **Tier S** syllabus-only
`0m`, and **Tier E** explicitly badged out-of-syllabus 2023–2026 exam hits),
defines execution-time online YouTube curation slots (zero pre-filled URLs;
plain external `<a>` links only, zero embeds/thumbnails/runtime requests), locks
all 46 `docs/suggestions/guides.json` and `section-notes.js` anchors, and sets a
two-mode PYQ↔unit synchronization contract (default Mode A keeps `_data/`
byte-frozen; Mode B gates any `_data/` or `pyq-integrity.json` edit on explicit
owner approval). Recommended execution order by 2023–2026 weight-to-page gap:
**15 (CSO) → 13 (Python) → 16 (Algorithms) → 14 (Data Structures) → 12 (C)**.

## Phase 11 — Subject-wise Suggestions (2026-11-18) — 🚧

After reviewing the Algorithms pilot, the owner approved applying its layout
pair to **all five theory subjects** on `arena/b06d66f8-diploma-3rd-sem`.
Each Important Questions workbook keeps syllabus order, 104 patterns and 393
linked appearances across the set, and adds worked references. Each Easy Read
starts with a ranked table and adds **What’s important** and **What to read
first** links to actual sections, with drills and dated practice retained.

See the [phase plan](phases/11-suggestions/README.md) and [rollout checks](phases/11-suggestions/record.md).
The dashboard, Home, unit-note prose, archive, quiz bank and syllabus are
unchanged. The owner has not marked Phase 11 as passed. No physical-device
acceptance, Phase 1–10 recheck or release is implied.

## Phase 9B — UI reboost (2026-11-17) — `✅*`, merged

Implemented on `arena/7e77489f-diploma-3rd-sem` (from `main` at `816ef84`) and
**merged to `main` by explicit owner command on 2026-11-17**. The asterisk is
the same honest asterisk as Phases 1–8: the CSS layer, tokens, gates and the
rendered headless sweep are complete, but **no physical-device pass exists**.
Phase 10 owns that.

What shipped:

- **One shared design layer.** `assets/css/hub.css` (~118 KB) is injected before
  `</head>` by `scripts/generate_presence.py` on all 74 pages, alongside
  `base.css`. Splitting it into per-family sheets was attempted twice and
  rejected on evidence (92 then 146 fingerprint regressions); moving rules into
  `subjects/units-com/common.css` was also rejected (load order costs a
  specificity level — 1,496 anchor colours reverted). Both dead ends are
  recorded so they are not retried.
- **`data-page` stamping.** `mark_body()` was defined but never *called* in the
  generator, so 7 pages silently kept legacy navigation colours at 2.51:1. The
  call is restored and the helper is idempotent across repeat runs.
- **Retheme.** Light `#f7f7fd` / accent `#5a4bc4`; dark `#101120` / accent text
  `#a99bf7`. 57 measured contrast pairs, all passing.
- **Per-page CSS fence raised 250 KB → 300 KB** by owner decision (Option A),
  matching the per-file ceiling already enforced by `scripts/check_site.py`.
  Heaviest page uses 171.5 KB. Rationale recorded in the
  `scripts/audit_page_weight.py` docstring and `docs/LAUNCH-CHECKLIST.md`.
- **PYQ phone fixes** (owner-reported, reproduced before changing): the paper
  viewer was 275 px wide because `accessibility.js` appended a print button
  into a `display:flex` `<main>`; copy/share/source moved into the question
  header as a 40 px icon cluster beside the bookmark; white-on-pale-lavender
  fills (2.37:1) repointed to `--hub-accent-solid` (6.48:1); `.nav-dot` got a
  24 px hit area behind its unchanged 9 px visual.

Verification actually obtained: 6/6 static gates, 113/113 unit tests on a full
clone (the one error reported in the Arena sandbox is a missing git object in
that shallow clone, not a defect), and a headless Chromium sweep at 412 px in
both themes.

Not obtained, and not claimed: any physical-device screenshot, TalkBack or
VoiceOver observation, 200 % zoom, real print-to-PDF, or a warmed-cache offline
launch. The Phase 9B docs record these as outstanding.

Related but **not** merged: the older diverging Phase 9B branch
`arena/48a2ab20-diploma-3rd-sem` (draft PR #20, 14 commits) shares a base but
overlaps 104 files with the work above. It is superseded by this merge and
should be closed rather than merged.

## Phase 9 — performance and launch (2026-11-17) — `✅*`, merged and live

Implemented on `arena/908b6b19-diploma-3rd-sem` (from `main` at `0e53a4a`) and
**merged to `main` by explicit owner command on 2026-11-17 as PR #17**
(`c898a95`); GitHub Pages built that commit and the live site serves the Phase 9
shell (`study-2026-11-17e`) and data version (`data-6b1621c45599`). The asterisk
is the whole story: 9.4's counter gate is still open and no Lighthouse/phone pass
has been recorded. Full evidence: [`phases/09-performance-launch/record.md`](phases/09-performance-launch/record.md).

- **9.1 ✅** Data fan-out unchanged from 2026-11-09 (Practice 36 → 1 JSON, quiz
  setup 20 → 2); the static side is now measured too (table below).
- **9.2 ✅** One token file: 302 palette entries in `assets/css/variables.css`,
  1,205 literals re-pointed, **0 hex literals outside the token file** and 0 value
  differences (47 contrast pairs unchanged); `rgba()` values (373 occurrences,
  188 distinct) stay outside that gate and are recorded as an open item. 71 dead rules removed. Icon CSS
  subset 102,641 → **25,890 B** (−74.8 %). Three global sheets → `base.css` and
  three global scripts → `shell.bundle.js`; the English catalog is no longer
  fetched. **No browser here: colour equivalence is static, layout was not
  re-screenshotted.**
- **9.3 ✅** Data has its own generated version and cache namespace
  (`data-6b1621c45599` over 81 files); shell `study-2026-11-17e`. A data fix now
  reaches a returning device without a shell update or a storage reset, and a
  shell update no longer discards the pools. Proved browser-free by
  `tests/data-version.cjs`.
- **9.5 ✅** `scripts/site_config.py` is the only place the published URL exists;
  `scripts/check_root_rewrite.py` rewrites a temp copy to `/` and runs
  `check_site.py --strict` inside it → 0 errors, 0 warnings. No domain action.
- **9.4 ⚪ closed without a counter (owner choice, 2026-11-18)** — no measurement
  requests or storage are authorized. The approved disclosure scope is
  prospective only and does not authorize a counter. Reopening requires a new
  explicit decision. See `docs/DECISIONS.md` + `docs/MEASUREMENT.md`.
- **9.6 🚧 in progress** — static launch gates and byte budgets pass; all pages
  remain within 340 KB CSS / 350 KB JS. Owner-reported physical Android checks
  (2026-11-18) passed several listed flows; evidence and missing device/browser
  versions are recorded in `docs/phases/10-device-acceptance/matrix.md`.
  Lighthouse/Core Web Vitals remain unrun, and this partial phone pass does not
  complete the launch or Phase 10 matrix. No new deploy is authorized or performed.

Measured from disk (74 pages, uncompressed): **592 static requests** (was 817),
**6,817,906 CSS bytes** (was 8,638,771), 7–10 static requests per page (was
9–15). Per view including its data fetch: Practice **9**, quiz setup **10**, unit
page **10**, PYQ answers **8**, home **9**, study pages **12**, quiz play **11**.

## Phase 8 — content depth and syllabus coverage (2026-11-17) — `✅*`, merged

Implemented on `arena/e0da0bec-diploma-3rd-sem` (from `main` at `84e99aa`, the
PR #15 merge). Full evidence: [`phases/08-content-depth/record.md`](phases/08-content-depth/record.md).

- **Measured first, and three of the phase README's claims were already false**
  for this tree: the lab/internship pages existed, CST201's *pages* were already
  in syllabus order (the **quiz bank** is reversed), and the CST203 skew was
  117/170, not 140/204. The old coverage page also printed `quizCount: 0` for all
  23 units and a raw `{None: 211}` out-of-syllabus dict.
- **8.1 ✅** Coverage map rebuilt: 23 declared units, both out-of-syllabus rows
  (CST205 and CST209 Unit 5) listed instead of hidden, real per-unit quiz counts,
  note sections/words per unit, flag legend, and the Unit-1 skew published as a
  table — 496 of 924 records (53.7%) — with the June-2022 tagging explanation.
- **8.5 ✅** The p.14 ESE table is reproduced and sums to 60; **all 28 paper
  maxima reconcile** with the answer-any quotas printed on the papers. The old
  comparison (marks on *all set* questions vs the maximum) could never match.
  Three printed shapes are shown; which applies to a session stays unverified.
  Decision recorded in `docs/DECISIONS.md`.
- **8.3 ✅ (static side, superseded 2026-11-17 by the merged `assets/css/base.css`)**
  the print rules now load on **74/74** pages (was 33/68),
  is precached, adds break control and answers-on-a-new-page, and one shared
  labelled print control exists. A paper prints with or without answers and no
  longer leaks `[Correct]` markers into a question sheet. No fake running header:
  browser `@page` margin boxes are unsupported. **No real PDF export observed.**
- **8.4 ✅** Lab/internship pages rewritten with credits, L-T-P, hours, assessment
  fields, the supported theory course and every transcribed task area; still no
  solution or completion claim.
- **8.2 ⛔ owner gate** 44 sourced draft entries (41 definitions, 3 formulas with
  symbol legends) across five sheets; every citation is validated as a verbatim
  syllabus topic by `scripts/build_revision_sheets.py`. **0 verified**, not linked
  from navigation.
- **8.6 ⛔ owner gate** Register (`docs/data/answer-verification.json`) plus a
  fail-closed validator and a derived ledger: **924 records, 924 with a source
  page, 0 with a verification date, 0 certified**. Per-answer provenance is now an
  expandable "Source … not certified" line.
- **Accepted `✅*` by the owner on 2026-11-17** — reported "everything is pass on
  a smoke use test, nothing breaks" — and **merged to `main` as PR #16**. The
  asterisk is the whole story: acceptance covers the implementation, not the
  content. **0 of 44** revision entries and **0 of 924** answers are
  source-verified, and no real print/PDF export was observed.
- **Owner direction (2026-11-18): no further Phase 8 answer or revision-sheet
  verification will be undertaken.** The entries remain expressly uncertified:
  0/44 revision drafts verified and 0/924 PYQ answers certified. This is a scope
  decision, not a quality pass. `info/disclaimer-notice.html` now states there is
  no guarantee of 100% accuracy and directs students to official sources.
- **Still open:** 456 unkeyed quiz items; the reversed CST201 bank units and six
  Unit-5 tags remain uncorrected/flagged; a real print export on hardware (Phase 10).

## Sub-phase 8A — answer prose and subject labels (2026-11-17)

Owner-requested work delivered on `arena/637a5a31-diploma-3rd-sem` (PR #10,
**merged 2026-11-17 as `8f6eb97`**) after the Python pilot merged as PR #9
(`365b8f7`). `main` now carries this sub-phase. Recorded in
[`phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/`](phases/08-content-depth/sub-phase-8A-answer-prose-and-ui-labels/README.md).

- **Prose:** 337 quiz-bank explanations (CST201/CST205/CST209) and 226 PYQ
  answers now carry a short reason sized for a 1-mark item. Only `explanation`
  and `answer` changed; a field-by-field diff against `365b8f7` shows zero change
  to question, options, stored key, type, unit, topic or marks.
- **Duplicates:** CST209-P002-2023-03 was deleted under the owner's rule (only
  where the subject has no 2021 sitting); CST203's duplicate went in PR #9.
  Repo now holds **28 papers / 924 raw PYQs / 923 unique / 1 alias**;
  CST201, CST205 and CST207 keep every paper.
- **Labels:** every page a learner sees names the subject (C · Python · DS · CSO ·
  Algorithms) instead of showing a course code, and raw paper/question IDs are no
  longer printed. Display only: no path, file, question ID, URL parameter,
  `data-*` value, storage key or JSON payload changed.
- **Gates:** `validate_pyq` PASS (28 papers / 924 questions),
  `check_pyq_integrity` 0 changed, `validate_data --check-baseline` matches the
  ledger (**9** open findings — the CST209-P002-Q34 finding closed with the
  deleted paper), `check_platform` 0 errors, Python `unittest` 13 PASS, six Node
  suites PASS, `check_site.py --strict` identical to `main` (17 pre-existing
  accessibility labels). Playwright browser suites run in CI only here.
- **Still open:** content verification (8.6) including the six CST203 key
  conflicts, no quiz bank for CST207, 456 unkeyed quiz items, phase 7
  accessibility findings, and device acceptance (phase 10).

## Current source reconciliation

Owner approved preserving newer main for PR #7. Papers/registries now match
`cfe3a63decb270826da40ea50b9392efc58b2f1d` byte-for-byte; the immutable manifest
pins that commit. Derived data is regenerated and all local regression suites
pass again. Existing source-review findings remain open; no new answer
certification is inferred. Delivery history below is the earlier checkpoint;
use PR #7/Git for the current CI and merge result.

## Delivery state

**Merge authorization update:** the owner authorized merging on 2026-11-09
(PR #7, `125eb94`), 2026-11-16 (PR #8, `3e3cb2e1`), and 2026-11-17 (PR #9
`365b8f7`, PR #10 `8f6eb97`, PR #11 `9d47c7c7`, PR #14 `5b7eb66`). No such
permission authorizes deployment, Pages or domain changes, and none closes an
unfinished phase gate.

- Branch: `arena/908b6b19-diploma-3rd-sem` (active session branch, branched
  from `main` at `0e53a4ad61f2aef7dbd9f188efbf15c2d05c9ff4`, the **PR #16** merge
  of the Phase 8 branch; carries the Phase 9 work, unmerged and undeployed).
  Earlier branches `arena/e0da0bec-...` (PR #16, Phase 8), `arena/c56bb630-...` (PR #15 `84e99aa`), `arena/be90e07e-...` (PR #14 `5b7eb66`), `arena/4d3997da-...`
  (PR #13 `a92a1ff`), `arena/637a5a31-...` (PR #10 `8f6eb97`, PR #11
  `9d47c7c7`), `arena/858a50c7-...` (PR #9 `365b8f7`),
  `arena/47d8bf99-...` (PR #8 `3e3cb2e1`), `arena/be3d9178-...` (PR #7
  `125eb94`), and `arena/26856d99-...` (`8405b15`) are merged and retired.
- Phase 2 engineering passed owner Termux verification (`✅*` at commit
  `021c4f2f94f387f4dd4e020d09e82a12b8720bec`, Web CI `43917224887` green);
  strict source-verification items (`9` data findings + `3` grouped syllabus
  findings) remain tracked under the separate content-verification gate.
- Phase 3 (`03-quiz-engine`) is owner-approved (`✅*`, merged via PR #11
  `9d47c7c7`), with explicit caveats recorded in
  [`phases/03-quiz-engine/record.md`](phases/03-quiz-engine/record.md) (no
  standalone CST207 quiz bank; 456 unkeyed quiz items and subjective / 1-mark
  written MCQ explanations stay manual self-review; 9 data + 3 syllabus
  source-review findings; hardware/browser acceptance in Phase 10).
- Phase 4 (`04-discovery`) is **`✅*`**: parts 4.1–4.5 gate-verified on
  `arena/80b11bcf-diploma-3rd-sem`, merged via PR #12 (`7c20a55`), and
  **owner-verified on device/Termux on 2026-11-17 ("device test pass")**; see
  [`phases/04-discovery/record.md`](phases/04-discovery/record.md).
- Phase 5 (`05-study-system`) is **`✅*`**: parts 5.1–5.5 gate-verified and
  owner-verified on device/Termux on 2026-11-17, merged to `main` on owner
  instruction; see
  [`phases/05-study-system/record.md`](phases/05-study-system/record.md). The
  offline worker version is `study-2026-11-17b`.
- Phase 6 (`06-state-portability`) is **`✅*`**: parts 6.1–6.6 gate-verified on
  `arena/be90e07e-diploma-3rd-sem` (2026-11-17) and **merged to `main` on owner
  instruction as `5b7eb66`** (PR #14; Web CI `44034450353` and Pages
  `44034449241` green): one storage boundary, one preference record with a
  pre-paint theme, registry-counted reset groups, notes on unit pages plus
  practice and quiz review, backup with `appVersion`, and an IndexedDB
  **recovery mirror** (6.6-3 partially met). Real eviction/Safari behaviour,
  private-mode IndexedDB on hardware and real-phone backup download remain
  **unverified** and move to Phase 10; see
  [`phases/06-state-portability/record.md`](phases/06-state-portability/record.md).
- Phase 7 (`07-inclusion-trust`) is **`✅*`**: parts 7.1–7.5 implemented and
  gate-verified on `arena/c56bb630-diploma-3rd-sem` (2026-11-17) and
  **accepted by the owner on 2026-11-17** after an Android/Chrome smoke pass
  reported no failures, and **merged as PR #15 (`84e99aa`)**. The acceptance rests on static
  measurement plus a general click-through, not a per-criterion device audit —
  the items named below stay open and unupgraded. Delivered: all 68 pages have
  one `<main>`, one `<h1>` and a skip link (0 of 68 missing, from 11); 134
  heading-order jumps across 32 pages are 0; the one unlabelled control is
  labelled; **all 47 measured contrast pairs pass, 27 failed before** (187
  total findings → 0); 21 of 22 first-party CSS files declare a reduced-motion
  rule (from 7) and all 68 pages
  load the global override; no control box is pinned below 24×24 CSS px; a
  38-key English/Bengali UI catalog loads on every page; and the privacy, offline
  and about claims that the build could not support are corrected. **No WCAG
  conformance claim** — rendered contrast, 200 % zoom/reflow, screen-reader
  output, real tap accuracy, Bengali glyph rendering and keyboard-only core-flow
  completion remain unverified and move to Phase 10 — the owner's Android/Chrome
  smoke pass showed the branch runs on real hardware but measured none of them.
  Worker version was `study-2026-11-17d` at Phase 8 (Phase 9 bumped the shell to
  `study-2026-11-17e`); the
  2026-11-17 Phase 7 measurement covers the 68-page tree, and Phase 8 regenerated
  the audit baseline for 74 pages with identical findings. See
  [`phases/07-inclusion-trust/record.md`](phases/07-inclusion-trust/record.md).
- Historical note: `docs/phases/02-data-pipeline/record.md` and
  `docs/phases/03-quiz-engine/record.md` still name
  `arena/be3d9178-diploma-3rd-sem` as the branch that work was performed on. That
  is accurate history and is preserved intentionally; the *active* branch is the
  one named above.
- Hosted CI evidence for the older committed tree is not evidence that the
  current changes passed hosted CI. No new PR, merge or deployment occurred.
- **Documentation handoff is updated; phases 1–9 are not all complete.**
- Owner requests implementation first, then one dedicated cross-device phase.
  Routine syntax, integrity and focused regression checks continue meanwhile.
- The 28 remaining PYQ papers and five registries are byte-frozen. Fixes/mappings
  must use derived metadata rather than editing those originals.

## Phase-by-phase implementation remainder

| Phase | Present implementation | Still needed before closing implementation |
|---|---|---|
| 1 — Platform | Subpath-safe PWA, local assets, presence metadata, install/update controller | Preserve regressions as later modules change. Original platform implementation is complete; final hardware/install acceptance moves to Phase 10. Full source/syllabus gates remain separate. |
| 2 — Data (`✅*`) | Deterministic inventory/scheduling, enriched catalog & derived pools, all 5 subject + 24 unit HTML pages syllabus-aligned & validator-checked, alias deep links & PYQ repeat cross-refs, generic topics filtered, no-key labels, source-review ledger, immutable-PYQ guard | Owner/source GATE only: resolve 9 source-backed data findings and 3 grouped syllabus errors; verify the 15 normalized-stem candidate clusters and CST207/Jan-2026 bank additions. No guessed keys or raw retags. |
| 3 — Quiz (`✅*`) | Timed snapshots/resume, flags, grading boundaries, history/export/retry/edit, mistakes, full paper practice enforcing `paperFormat` `answerAny` section/choiceSet quotas across 28 papers, 30m `2023-03` Group A loose-script window, `1m option + 1m written explanation` split, ESE pattern warnings, Print/PDF export | Owner-approved with recorded caveats: no standalone CST207 quiz bank; 456 unkeyed items and subjective/written-explanation marks remain manual self-review; Phase 10 cross-device acceptance pending. |
| 4 — Discovery (`✅*`) | 2,410 search entries across 5 subject shards + `index-pages.json` (50/68 HTML pages indexed, 18 explicitly excluded in `manifest.json`, all shards ≤ 40%), offline SW precache + `WARM_SEARCH`, XSS-safe keyboard/URL/`popstate` search UI, 1 exact alias + 15 unverified candidate repeat clusters (32 records), deep links + `navigator.share`/clipboard/input fallbacks across PYQ/Practice/Quiz, authored unit heading anchors + breadcrumbs + hub counts + filtered-PYQ URL handoff, `subjectLabel()` everywhere | Owner-verified 2026-11-17 ("device test pass") and merged via PR #12. Normalized candidate clusters remain pending source-verified dedup; physical phone latency/share-sheet/screen-reader testing stays in Phase 10. |
| 5 — Study system (`✅*`) | Source-linked cards with per-unit eligibility reporting, documented Leitner scheduling (clock/day-rollover/new-card-cap edges tested), review UI with URL+`popstate` filters and empty-queue fallbacks, Today dashboard with one primary action, weak-area denominators/attempt counts/trends, offline card caching (`WARM_STUDY`) | Owner-verified 2026-11-17 ("device test pass") and merged to `main` on owner instruction. Cards use existing model/keyed material, not new certification; answer certification stays a separate source gate. Device/screen-reader acceptance is Phase 10. |
| 6 — Storage/portability (`✅*`) | Central namespaced boundary, verified legacy copy migration, notes on 24 unit pages + practice + quiz review, one preference record, group reset with live counts, previewed backup/merge/replace, recovery journal, IndexedDB recovery mirror with `hydrate()` | Merged via PR #14 (`5b7eb66`). Still needed if IndexedDB is to become a *primary* store: an async render contract, threshold/cutover evidence, concurrent-tab transaction isolation/state sync, and typed validation of further legacy variants. Current primary API remains synchronous local storage, and 6.6-3 stays a partial meet. |
| 7 — Inclusion/trust | Static landmarks/skip links on many legacy pages, shared focus/motion/reading controls, settings en/bn labels, truthful feedback/privacy | Remaining structure/heading/form warnings, full dialog/tab keyboard behavior, measured contrast/target/zoom evidence, wider Bengali UI catalog, credits/README maintenance and license/content-rights decision. No WCAG compliance claim yet. |
| 8 — Content depth `✅*` | Measured coverage map with out-of-syllabus rows and Unit-1 skew, reconciled paper maxima, print sheet on 74/74 pages, sourced practical/internship pages, 44 cited draft sheet entries, fail-closed answer-verification register | **Owner/source GATE only:** sign off the revision sheets (0 of 44) and the answer batches (0 of 924, ≤40 per batch with citation + date); resolve the reversed CST201 bank units and the six Unit-5 tags; observe a real print/PDF export (Phase 10). |
| 9 — Performance/launch | Derived pools and checked-in bundles, measured request reduction, cache/measurement/domain docs, local-only usefulness prompt | CSS tokens/dead-code/payload consolidation, finer data loading, independent data/shell cache versioning and update regression, root-path rewritten-copy test, Lighthouse measurement and completed launch checklist. Publication remains separately authorized. |

Detailed evidence and qualifications live in each phase's `record.md` under
[phases](phases/README.md). The table is a remainder list, not a waiver of task
acceptance criteria.

## Separate verification and rights gates

These cannot be solved by declaring a feature complete:

1. **Source truth:** six archived questions have stored Unit-5 tags in
   four-unit subjects (4 in CST205, 2 in CST209); a 35-question CST209 Unit-5
   quiz bank is outside the declared course; CST201 U3/U4 bank mappings are
   reversed relative to the syllabus. The ledger contains 9 data findings /
   3 grouped syllabus errors (plus 1 warning for missing CST207 quiz bank).
   See [exceptions](data/validation-exceptions.json) and
   [source review](data/source-review-batch-01.md).
2. **Answer certification:** unknown keys remain ungraded. Existing model
   answers and scan-source verification do not establish answer certification.
   Imported keys/reprint relationships need source evidence and recorded review.
3. **Marks reconciliation:** historical printed maxima, set-question sums and
   the current 60-mark ESE pattern are not interchangeable. Keep visible warnings.
4. **Rights/license:** repository is **MIT** (chosen 2026-11-16; `LICENSE`
   added) for its own code/authored content. Third-party examination-source
   material keeps unresolved rights and is a separate gate — do not invent rights
   to that material or imply the MIT license covers it.
5. **Release:** hosted CI on the new tree, PR/merge, deployment and domain actions
   have not happened. A green local check is not permission to publish.

## Latest recorded engineering evidence

These are local results from the latest implementation checkpoint, not a claim
that documentation-only edits reran all browser suites:

- Python unittest discovery: **63 PASS** (33 before Phase 8). The 30 extra cover
  Phase 8: coverage-map determinism, the validate_syllabus recount, out-of-syllabus
  rows, the CST201 bank-reversal disclosure, exam-pattern reconciliation of all 28
  papers, print-sheet reach on 74/74 pages, lab/internship page citations, verbatim
  revision-sheet citations and symbol legends, the fail-closed verification
  register (five rejection cases plus one acceptance), and the "0 certified" lock.
  Earlier suites still cover card eligibility, discovery shard budgets, the
  74-page scope partition and SW discovery cache registration.
- Sixteen deterministic Node suites (`tests/*.cjs` minus the Chromium ones): attempt state + 28-paper rule/quota/section-timer/explanation-split verification, quiz DOM/export/label contracts, scheduler/trends/clock/day-rollover/streak/goal helpers, storage, interruption/quota recovery, Phase 2 derived-pipeline consumers, Phase 4 discovery DOM/XSS/keyboard/repeat/deep-link/share-fallback/unit/SW offline simulation (`tests/discovery-dom.cjs`), Phase 5 study DOM/UI/keyboard/popstate/empty states (`tests/study-dom.cjs`) and the study worker precache/`WARM_STUDY`/offline navigation (`tests/study-offline.cjs`) — **PASS**. The remaining `.cjs` files (`paper-offline`, `cards-offline`, and every `*-browser.cjs`) need Chromium and were **not run** here, so they are not evidence for this tree.
- Seven focused Chromium suites: Practice/data, quiz engine, discovery/study,
  storage/notes, cached-paper offline, feedback, cached 20-card offline keyboard
  review — PASS at the Phase 4 checkpoint. They were updated for the Phase 5
  markup but **not re-run** in the 2026-11-17 environment (no Chromium there); no
  broad device compatibility is inferred.
- Full parse sweep: **55 JS/CJS files and all 79 JSON files passed** (Phase 8
  added no JSON under `_data`; the new derived files are `assets/data/coverage.json`,
  `assets/data/verification.json` and `assets/data/revision-sheets.json`).
- Accessibility audit: **74 pages, 0 findings**, 47 contrast pairs all passing,
  74/74 pages load the global reduced-motion override. `check_readme_paths`: 0 missing.
- Site strict: **0 errors / 0 warnings** (the 28 warnings recorded earlier were
  paid down across Phases 6–8); platform check: **0 errors**.
- PYQ integrity: **0 changed/added/missing original files**.
- Exact data baseline matches; **full strict data/syllabus validation still
  fails on the recorded findings**.
- Phase 8 regeneration order (README): builders → `generate_presence.py` ×2 →
  `build_search_index.py` → `check_pyq_integrity.py`; the second presence pass is
  required and a test now proves the tree ends byte-identical.
- Cold local Chromium requests, service workers blocked: Practice **43 → 12**,
  quiz setup **28 → 12**. These are request counts, not real-device speed or
  Lighthouse scores. See [measurement data](phases/09-performance-launch/request-measurements.json).

For repeatable commands, see [tests](../tests/README.md). For the actual
incomplete cache guarantees, see [cache policy](CACHE-POLICY.md).

## Dedicated final device phase — in progress, partial evidence recorded

[Phase 10](phases/10-device-acceptance/README.md) consolidates actual
Android/iOS/tablet/desktop, browser, keyboard/screen-reader, zoom/reflow,
background timer/screen lock, install/update/offline, backup download, and print
acceptance. The owner supplied partial Android evidence on 2026-11-18; see the
device matrix. Emulation and actual hardware must be identified separately.
Unavailable device access is **untested**, never silently passed.

## Recommended remaining order

1. **Phase 9.4 is closed without measurement by owner choice.** Phase 9.6 still
   needs Lighthouse/Core Web Vitals. Phase 10 is underway with partial Android
   evidence; the remaining device matrix, including the untested checks listed
   above, and the separate deploy decision remain.
2. **Phase 8 verification will not continue by owner direction (2026-11-18).**
   No entries or answers are certified: 0/44 revision drafts and 0/924 PYQ
   answers. The site now carries an explicit no-100%-accuracy disclaimer; this
   scope decision is not verification or a quality pass.
3. Phase 7 is `✅*` and merged as PR #15; its acceptance left these unmeasured,
   and they remain Phase 10 items together with Phase 8's print export:
   rendered contrast after compositing, 200 % zoom/reflow on the longest unit
   page, dialog and tab focus behaviour, screen-reader output
   (NVDA/TalkBack/VoiceOver), tap accuracy, Bengali conjunct rendering and
   keyboard-only core-flow completion.
4. Finish Phase 9, then Phase 10 (one device-acceptance phase) — the last
   phase;
   retain source and rights gates explicitly if evidence is unavailable.
4. Run final implementation gates and hosted CI when the branch is pushed;
   update records with real results, not forecasts.
5. Run the dedicated Phase 10 device matrix and fix/retest failures.
6. Stop at the separate release-authorization gate. Nothing here authorizes a
   merge, domain change or deployment.
