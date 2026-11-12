# Diploma 3rd Semester — CST Study Hub

A first-party, zero-build static study site for West Bengal diploma CST students.
HTML, CSS, JavaScript and checked-in JSON can be served directly; no package
installation or build is required to run the site.

**Implementation is in progress, not all phases complete.** See
[Current status and remaining work](docs/STATUS.md) for the handoff,
[Roadmap](docs/ROADMAP.md) for phase status, and
[Decisions](docs/DECISIONS.md) for owner instructions and gates.

## What exists in the working tree

- Five theory subjects, unit notes and source-linked previous-year papers.
- **30 papers / 992 archived questions**; exact-content aliases retain their
  source IDs. Practice uses **923 unique questions** across ten derived days.
- **872 quiz-bank questions**: 416 keyed MCQs and 456 non-MCQ items without
  automatic grading. CST207 currently has no quiz bank.
- Timed quiz snapshots, autosave/resume, marked flags, history, exact retry,
  selected-attempt export, answer edits and a local mistake queue.
- Paper practice with original instructions and registry duration. **Answer-any
  rules and explanation-mark splits are not enforced; there is no automatic
  overall paper grade.**
- [Search](search.html), [repeated-question explorer](repeated.html), question
  deep links and related-material links on subject/unit pages. Search covers
  question stems, topics, unit headings and this device's section notes—not
  every informational page.
- **1,339 revision cards** generated from existing model answers and keyed MCQ
  explanations, a fixed Leitner scheduler, and a [Today screen](today.html)
  with local goals and sample-qualified weak-area trends. Cards are not newly
  certified answers, and no recall-improvement claim is made.
- Plain-text section notes and [settings/backup](settings.html), with namespaced
  storage, import preview, group resets and interrupted-import recovery.
  **IndexedDB migration is not implemented.**
- [Syllabus coverage](coverage.html), [exam-pattern caveats](exam-pattern.html),
  and [practical-course/internship task pages](courses.html). These do not claim
  completed lab solutions or reconciled historical paper totals.
- Shared reading/focus/reduced-motion safeguards and a small English/Bengali
  settings-label catalog. This is not full bilingual coverage or audited WCAG
  conformance.
- Scope-relative PWA support. Previously loaded resources can work offline;
  uncached first visits still need a connection. Full device/install/update
  acceptance is deferred to a dedicated final phase.

Counts above describe the current generated data, not a guarantee of verified
answers or complete syllabus coverage. Global bookmark/Study Tips placeholder
pages are not advertised as finished features.

## Authoritative content and verification

Original paper and registry files under `_data/<subject>/` are **byte-frozen**
by [_data/pyq-integrity.json](_data/pyq-integrity.json). Do not edit them or
refresh the baseline to hide a change. New schedules, indexes, cards and coverage
are derived sidecars. Unknown answers remain ungraded.

The [2022 syllabus package](docs/syllabus/README.md) supplies current-course
coverage references; it does not authorize rewriting historical papers.
Ten data findings and three grouped syllabus errors remain under source review.
An exact-baseline regression pass is **not** a full strict-data pass.

## Run locally

For a fresh clone with the repository's default directory name:

```sh
git clone --single-branch --branch arena/be3d9178-diploma-3rd-sem \
  https://github.com/pabitra27706-oss/Diploma-3rd-sem.git
python3 -m http.server 8000 --bind 127.0.0.1
```

Run the server from the directory **containing** `Diploma-3rd-sem`, then open:

**http://127.0.0.1:8000/Diploma-3rd-sem/**

Stop with Ctrl+C. If already cloned, update that checkout using `git pull
--ff-only` rather than cloning again. Unpushed Arena changes are not available
through a fresh clone or pull. The canonical publication base is
`/Diploma-3rd-sem/`; this documentation does not confirm the live site has the
current working-tree changes.

## Checks

From the repository root, with Python 3 and Node.js available:

```sh
python3 scripts/check_pyq_integrity.py
python3 scripts/check_platform.py
python3 scripts/check_site.py --strict --quiet
python3 scripts/validate_pyq.py
python3 scripts/validate_data.py --check-baseline
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/attempt-store.cjs
node tests/study-store.cjs
node tests/storage.cjs
node tests/storage-recovery.cjs
```

`validate_data.py --strict` and `validate_syllabus.py --strict` still report
recorded source-review failures. See [test instructions](tests/README.md) for
optional development-only Chromium regressions and their limits.

## Regenerating checked-in outputs

Only contributors editing sources need to regenerate. Serving the site remains
zero-build. Review the resulting diff and run the integrity guard afterwards.

```sh
python3 scripts/build_data_catalog.py
python3 scripts/build_practice_days.py
python3 scripts/build_search_index.py
python3 scripts/build_cards.py
python3 scripts/build_runtime_data.py
python3 scripts/build_coverage.py
python3 scripts/build_runtime_bundles.py
python3 scripts/generate_presence.py
python3 scripts/check_pyq_integrity.py
```

Do not edit generated bundles directly. Source scripts remain under `quiz/js/`;
concatenation has no runtime dependency. Read the
[cache policy](docs/CACHE-POLICY.md) before changing worker dependencies.

## Privacy, rights and release status

Student data is local to the browser; no third-party runtime analytics or quiz
upload endpoint is added. Backups contain private notes/answers and should be
kept private. Feedback prepares an email draft or copied text; the site cannot
confirm receipt. See [Privacy](info/privacy-policy.html) and
[Measurement](docs/MEASUREMENT.md).

**Repository license is not selected.** No blanket license is claimed for the
code or third-party educational material. Existing asset notices remain in
place; see [Credits](info/credits.html). License/content-rights review is a
release gate, not an implementation decision to invent.

The owner authorized merging the working branch on 2026-11-09. Consult Git and
the pull request for the actual merge result; a merge does not certify unfinished
phases. Device acceptance, deployment and domain configuration remain separate
gates. See [domain readiness](docs/DOMAIN.md).

## Contributor handoff

Read [rule.md](rule.md), [prompt.md](prompt.md),
[docs/STATUS.md](docs/STATUS.md), and the relevant
[phase record](docs/phases/README.md) before editing. Owner-approved sequencing
is implementation phases 1–9 first, then
[Phase 10 cross-device acceptance](docs/phases/10-device-acceptance/README.md).
Focused safety/regression checks continue during implementation.
