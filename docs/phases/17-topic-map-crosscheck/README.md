# Phase 17 — Topic-map cross-check across all five subjects

> **Why this phase exists.** Phases 13–16 each author a
> `assets/data/topic-map-<subject>.json` as their final part. Four maps made by four
> passes, weeks apart, will drift: an anchor gets renamed during a later content
> edit and its map entry silently rots. The runtime hides this — a stale entry falls
> through to the matcher, so the page still "works" and nothing fails.
>
> This phase re-audits all five together and **fixes what it finds in place**. It
> authors no new content and rewrites no unit pages.

- **Scope:** `assets/data/topic-map-{CST201,CST203,CST205,CST207,CST209}.json`,
  `tests/test_topic_map.py`, `scripts/audit_topic_routing.py`, `record.md`.
- **Does not reopen:** Phases 12–16 content, `_data/`, `_quiz-data/`, any unit page.
  A map edit is the only permitted source change.
- **Standard:** [`docs/phases/topic-map-standard.md`](../topic-map-standard.md).

---

## Part 17.1 — Conformance and completeness audit

**Checklist:**
- [ ] All five map files exist at `assets/data/topic-map-<subject>.json` (not
  `_data/`, which `data_pipeline.py` globs as papers) and match the schema in the
  standard.
- [ ] Keys are normalised (lowercase, collapsed whitespace) — assert, don't eyeball.
- [ ] **Zero raw paper-section anchors** (`mcqs`, `short-questions`, `long-questions`,
  `practice`, `revision`, `videos`) in any map.
- [ ] **Zero unmapped questions** in each subject's `P00[3-6]` window.
- [ ] Each map's unit numbers are all declared syllabus units for that subject
  (`CST205` and `CST209` have 4 declared units; `unit 5` for CST209 is the CO5
  supplementary unit and is legitimate, but must be labelled as such).

**Done means:** a single script run prints, per subject, `entries / questions /
unmapped / generic-landings` and every unmapped count is `0`.

---

## Part 17.2 — Anchor rot check (the reason this phase exists)

- [ ] For every entry in every map, verify the anchor still exists in the named
  unit page, by reading the file — not by trusting the heading list.
- [ ] Where an anchor has been **renamed**, fix the map entry (not the page).
- [ ] Where a heading was **removed**, decide: re-point to the nearest surviving
  section, or delete the entry so the matcher handles it. Record which.
- [ ] Extend `tests/test_topic_map.py` to cover **all five subjects**, not just
  CST201, so this check runs on every future commit instead of once.

**Done means:** all five maps pass the anchor-existence test, and that test is in
the suite rather than in this phase's shell history.

---

## Part 17.3 — Quality audit against the Phase 12 baseline

Compare each subject against the baselines in the standard (§6), measured
2026-11-18 with the matcher alone:

| Subject | Unmatched (baseline) | Generic landings (baseline) |
| :--- | ---: | ---: |
| CST201 | 20 of 198 | 40 |
| CST203 | 30 of 170 | 5 |
| CST205 | 18 of 194 | 0 |
| CST207 | 58 of 195 | 0 |
| CST209 | 14 of 167 | 9 |

- [ ] No subject's **unmatched** count exceeds its baseline.
- [ ] No subject's **generic-landing** count exceeds its baseline.
- [ ] **CST207 specifically:** 118 of 195 questions failed to land same-unit at
  baseline. Confirm the map materially improves that, and state the number.
- [ ] Spot-read **10 random map entries per subject** against the question stem.
  A map can be complete and still be wrong; this is the only check that catches
  that.

**Done means:** every subject at or better than baseline, with the 50-entry
spot-read recorded in `record.md` including anything the owner should re-decide.

---

## Part 17.4 — The 321 placeholder topics

**35% of the corpus has no topic.** These are the near-total routing failures, and
no map fixes them because there is nothing to map:

| Placeholder | Count |
| :--- | ---: |
| `Short answer` | 207 |
| `Group A / objective` | 69 |
| `Group C / long answer` | 45 |

- [ ] Decide explicitly, per subject, and record it: either
  **(a)** map the placeholder to a stable section (e.g. the unit's practice block),
  or **(b)** leave it unmapped and let the question open without a jump.
- [ ] Whatever is chosen, **state it in the UI-visible behaviour** — a question that
  does not jump should not look like a broken link.
- [ ] Do **not** infer topics from question text in this phase. That is content
  authoring, needs the owner, and belongs in its own phase.

**Done means:** an explicit recorded decision per subject, and no placeholder that
silently lands on a nonsense section.

---

## Part 17.5 — Gate and close

- [ ] `python3 -m unittest discover -s tests -p "test_*.py"` — all pass.
- [ ] `node tests/discovery-dom.cjs` — all pass, including the map cases.
- [ ] `check_pyq_integrity.py` = `0` changed/added/missing (maps add files; they
  never edit a paper).
- [ ] `check_site.py --strict --quiet`, `check_tokens.py --strict`,
  `validate_pyq.py`, `validate_data.py --check-baseline`,
  `validate_syllabus.py` — all exit `0`.
- [ ] `build_data_version.py` run **last** (the maps are inside its hashed parts,
  so the version changes).
- [ ] `record.md` populated; `ROADMAP.md`, `STATUS.md`, `prompt.md` updated;
  **"What to test on the website"** + `rule.md` §7 Termux block printed; pause for
  owner sign-off.

---

## Acceptance summary

1. Five maps, conformant, complete, every anchor resolving.
2. Anchor-existence enforced by a test, not by a one-off shell run.
3. Every subject at or better than its 2026-11-18 baseline on unmatched and
   generic landings.
4. The 50-entry spot-read recorded, with uncertain entries flagged for the owner.
5. The placeholder-topic decision recorded per subject.
6. Full gate suite green; `check_pyq_integrity.py` unchanged at `0` drift.
