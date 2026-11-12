# Phase 2 data pipeline — source review pending

Committed JSON is served directly; these are maintenance commands, not a site build.

```sh
python3 scripts/build_data_catalog.py
python3 scripts/build_practice_days.py --seed diploma-phase2-v1
python3 scripts/build_data_catalog.py
python3 scripts/validate_data.py --check-baseline
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

`build_practice_days.py --dry-run` writes nothing. Repeating the maintenance
commands without source changes yields identical bytes.

- `_data/catalog.json`: computed subject counts, real quiz-bank files/years/sources,
  exact aliases, canonical `alsoAppearedIn` lists, normalized-text candidates.
- `_data/practice-days.json`: one seeded mixed-revision schedule and generated
  day metadata. Raw records keep their IDs; exact aliases inherit their canonical
  day but are omitted from Practice counts/sessions, not deleted from papers.
- `duplicates.md`: generated safe exact aliases vs manual normalized-text candidates.
- `answer-key-candidates.json`: 456 non-MCQ items, 90 text-only candidate matches,
  366 unmatched. Zero source-ID matches in the current bank; no answers copied.
  Candidate joins are not verification, including when only one match exists.
- `source-review-batch-01.md`: seven invalid PYQ unit records, bank/reprint
  decisions, and the first 40 candidate answer-key reviews with source citations.
- `validation-exceptions.json`: exact fingerprinted source-review blockers.
  **Not an approval or waiver.** `--check-baseline` rejects changed/new findings;
  `--strict` deliberately still fails. Do not replace the ledger to hide a new
  failure. Remove/update reviewed entries only with explicit source evidence.

## Unfinished gates

`validate_data.py --strict` currently reports 10 findings: seven invalid PYQ units,
one invalid CST209 quiz bank (35 questions), and two reversed CST201 unit banks.
`validate_syllabus.py --strict` reports three grouped coverage errors. No retags,
source labels, question wording/options, or answers were altered. A preservation
test compares those fields to the Phase 2 base commit. Once source-approved
migrations are implemented, extend that test with the approved migration evidence
rather than disabling it.

The four mismatched quiz totals were recomputed, 321 generic PYQ topics explicitly
flagged, and every one of the 456 keyless quiz items marked missing/ungraded.
January 2026's 120 PYQs remain accessible in Practice/PYQ; importing them into quiz
banks waits for unit/key review. CST207 has no quiz bank and is not offered in quiz
setup/presets. It remains available in Practice/PYQ.

Legacy reading-roadmap topics are unchanged; displayed practice counts come from
the shared generated mixed-revision schedule. This is not a claim that each day's
randomized questions cover that day's reading topics. Existing saved progress is
not migrated by this phase; state reconciliation remains Phase 6 work.
