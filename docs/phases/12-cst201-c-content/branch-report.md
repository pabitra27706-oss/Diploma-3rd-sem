# Branch report — `arena/08838a66-diploma-3rd-sem`

Complete accounting of every change on this branch, measured with `git` against the
recorded base `d9fe014` (`main`). Written 2026-11-18 for the phase-12 owner review.

- **HEAD:** `99942c0` · **commits:** `11` · **files touched:** `52`
- **Lines:** `+5,908 / −5,577` (net `+331`) · **new files:** `2` · **deleted files:** `0`

---

## 1. Why the added and deleted counts are nearly equal

`+5,908` vs `−5,577` is a ratio of **1.06**. That is not a coincidence and it is not
suspect. Three separate properties of this branch produce it.

### 1.1 Most of the diff is *rewritten in place*, and Git counts a rewrite as one deletion + one addition

A modified line is always counted twice — once dead, once born. A branch that
restructures existing material therefore tends toward 1:1 no matter how large the
change is. Concretely, from `git diff --numstat`:

| File | Added | Deleted | What actually happened |
| :--- | ---: | ---: | :--- |
| `subjects/CST201/units/unit-3.html` | 396 | 397 | Line count **identical** (1,785 → 1,785); ~22% of the page was reordered and reworded |
| `docs/data/answer-key-candidates.json` | 71 | 71 | One generated field per record |
| `_data/practice-days.json` | 122 | 122 | Deterministic scheduler rebalanced after the unit retag |
| `_data/CST201/CST201-P003…json` | 14 | 14 | **14 questions moved unit — and nothing else** |

The 44 unit retags are the cleanest example. Each retag rewrites exactly one JSON
line (`"unit": 3` → `"unit": 4`), so it contributes exactly `+1 / −1`. Forty-four
retags produce `44 / 44` — perfectly balanced, because a value changed rather than
data being created or destroyed.

### 1.2 Minified single-line files collapse a whole-file change into `1 / 1`

Generated artifacts are written as one long line. So when a single byte changes
anywhere in `coverage.html` or `assets/data/coverage.json`, Git reports `1 / 1` and
the diff looks trivial while the file is meaningfully different:

| File | Added | Deleted |
| :--- | ---: | ---: |
| `assets/data/coverage.json` | 1 | 1 |
| `coverage.html` | 1 | 1 |
| `assets/search/index-CST201.json` | 1 | 1 |
| `assets/cards/CST201.json` | 1 | 1 |
| `docs/ROADMAP.md` | 1 | 1 |

Ten such files account for `10 / 10` while carrying real content changes. Line
counts are a poor proxy here; the hashes are what matter.

### 1.3 The one genuine "rebalance" — Unit 5 — was deliberately a cut

Part 12.5 was a right-sizing pass: `−1,160w`, the only unit that got *shorter*.
Everything else grew. The two effects partly cancel across the branch:

| Unit | Words (plain tag-strip) | Change |
| :--- | ---: | ---: |
| unit-1 | 4,909 → 5,669 | **+760** |
| unit-2 | 4,957 → 6,646 | **+1,689** |
| unit-3 | 5,149 → 5,370 | **+221** |
| unit-4 | 6,086 → 6,439 | **+353** |
| unit-5 | 6,732 → 5,572 | **−1,160** |
| **total** | **27,833 → 29,696** | **+1,863 (+6.7%)** |

### 1.4 Where the asymmetry actually comes from

So the near-equality is confined to the rewritten and regenerated material. The
real growth is concentrated and visible:

```
bucket                                         files  added  deleted      net
----------------------------------------------------------------------------
A. CST201 unit pages (rewritten prose)             5   3722     4174     -452
B. quiz banks (whole-file swap)                    2   1066      986      +80
C. _data sources (unit retags + integrity)         7    380      176     +204
D. generated artifacts                            13     36       21      +15
E. shipped JS                                      2     48        9      +39
F. tests                                           5    137        9     +128
G. scripts                                         2    168       22     +146
H. docs / record                                  15    348      177     +171
I. other                                           1      3        3       +0
----------------------------------------------------------------------------
TOTAL                                             52   5908     5577     +331
```

The `+331` net is almost entirely **new tests, a new script, and the audit trail**
(`+445` across F/G/H). The content pages are net `−452` words of HTML *lines*,
which is why the headline number looks flat: this phase rewrote and redistributed
prose rather than inflating it.

---

## 2. Commit by commit

| Commit | Added | Deleted | Files | What it did |
| :--- | ---: | ---: | ---: | :--- |
| `8ee97c1` | 1,065 | 1,095 | 13 | 12.4 — rewrite Unit 4 (Functions) to the blueprint |
| `14dcfb1` | 1,217 | 1,035 | 13 | 12.2 — rewrite Unit 2 (Decision & Loops) |
| `b6b0784` | 450 | 203 | 13 | 12.1 — rewrite Unit 1 (Introduction to C) |
| `90b4c5f` | 442 | 419 | 11 | 12.3 — rewrite Unit 3 (Arrays & Strings) |
| `5b93f8c` | 3,902 | 4,250 | 21 | 12.5 — right-size Unit 5 (Pointers), `−1,160w` |
| `74f9395` | 0 | 0 | 0 | Merge of remote 12.1–12.3 history; tree already superseded it |
| `701f70c` | 9 | 7 | 1 | Point `rule.md` §7 at this branch |
| `28225f0` | 7 | 1 | 1 | Record the owner's 12.5 pass |
| `3440211` | 246 | 5 | 3 | **Part B** — fix topic routing (segments + singular); add the routing audit script and its tests |
| `9a37d5e` | 1,665 | 1,321 | 34 | **Part C** — swap the reversed quiz banks, remove the stale disclosure, add the overview tie-break, fix 2 latent test failures, regenerate |
| `99942c0` | 103 | 17 | 5 | Record the 12.6 evidence; submit for sign-off |

---

## 3. What changed, by area

### 3.1 Content — five C unit pages

All five pages carry the 2023–2026 PYQ weights (U4 `97m` 24.6%, U2 `95m` 24.1%,
U1 `86m` 21.8%, U3 `66m` 16.7%, U5 `51m` 12.9%).

**Anchor safety verified against the base commit:**

| Guarantee | Result |
| :--- | :--- |
| `<section id>` count | `83 → 83`, **0 lost** |
| `overview-*` `<h3 id>` count | `26 → 26`, **0 lost** |
| `guides.json` anchors | 10 intact |
| Total ids | `258 → 279` (net `+21`) |

The `30` ids that did disappear are **practice-item ids only** (`mcq9`–`mcq15`,
`sq5`–`sq10`, `pp5`) — the practice sets were renumbered when their length changed.
No deep-link anchor, section id or `overview-*` id was lost.

### 3.2 Discovery — `assets/js/unit-discovery.js` (`+45 / −6`)

Two independent defects had to be fixed together; fixing either alone still missed:

1. **Whole-topic matching.** A stored topic like `"Switch / Armstrong numbers"` only
   scored if the entire string appeared as a heading. Topics are now split on
   `/ , ;` and each segment is scored separately (best wins).
2. **No stemming.** Headings say "loop", topics say "loops". Terms are now
   singularised before comparison.
3. **Overview tie-break (new).** `"Arrays / loops"` scored `90` against both the
   generic `#overview` card and the specific `#arrays-initialization-memory-and-loops`
   section, and document order picked the overview. Ties are now broken on **how
   many of the topic's own segments the heading covers**. 17 anchors improve, none
   regress.

### 3.2b How the three scoring rules depend on each other

The rules are not independent, and measuring them by pass/fail totals hides that.
Contribution of each stage on the **current** (already re-tagged) data:

| Config | same-unit | redirect | unmatched |
| :--- | ---: | ---: | ---: |
| whole-string matching, no stemming | 96 | 6 | 3 |
| **+ segment split** | 103 | 2 | 0 |
| + singularisation | 103 | 2 | 0 |
| + overview tie-break (shipped) | 103 | 2 | 0 |

That table suggests singularisation contributes nothing. It is wrong, and the
reason matters: the totals only count *pass/fail and same-unit*, not **which
anchor** was chosen. Singularisation fires on exactly two stored topics —

- `"Arrays / loops"` (`P003-Q8`): `loops` matches the heading word `loop` **only**
  after singularisation.
- `"Switch / Armstrong numbers"` (`P004-Q23`): `numbers` / `number`.

Without singularisation, `#arrays-initialization-memory-and-loops` covers only
`1/2` of the topic's segments instead of `2/2`, so it **ties** with the generic
`#overview` and loses the tie-break — `P003-Q8` lands on the overview instead of
the specific section. The tie-break therefore depends on the stemming rule to
have anything to break. The original test for this
(`test_plural_topic_matches_singular_heading`) only asserted "resolves somewhere
in unit 2", which passed via an unrelated heading; it now asserts the score
against the singular heading directly and the coverage counts that decide the tie.

### 3.2c Known limitations of the matcher (found by auditing every question, not by testing)

The matcher is much better than it was, but it is **not** "every question lands on its
best section". Auditing all 105 questions old-vs-new found 15 changed anchors:
4 gained segment coverage, 1 lost it, and 10 changed within equal coverage. Three
defects are known and *not* fixed:

1. **Coverage-first fixed the worst case but introduced one regression.**
   `P004-Q1` ("Global variables / initialization", filed U1) now lands on
   U1 `#identifiers-and-keywords` (1/2, score 0.50) instead of U4
   `#global-and-local-variables-initialization` (2/2, score 90). Cause: the in-unit
   search accepts a partial match that clears the `0.5` floor, so the cross-unit
   fallback never runs. A global search was tried and rejected — it redirects 17
   questions and sends every bare "Functions" topic to a stray
   `U5 #overview-functions` card (cov=1, score=100).
2. **The score scale is inconsistent.** Exact-title = 100, substring = 90,
   term-ratio = 0–1. A term-ratio match can therefore never outrank a substring
   match, and ties fall through to document order. That is why `P005-Q24`
   ("Pointers / parameter passing") lands on U5 `#overview` rather than
   `#understanding-pointers-and-addresses`: both score 90 on 1/2 coverage.
3. **Overview cards tie with real sections and win by document order.**
   **35 of 105** questions land on a generic `overview-*` / `intro` /
   `fundamentals` anchor (it was 34 before this work). For most of those the card
   is the right destination, but for topics like "Operators / modulus" the card
   is the unit introduction rather than the operator section.

Reported honestly: the headline `103/2/0` counts *whether* a question resolves and
*which unit*, not whether the anchor is the best section on the page. Scoring
quality is up sharply (strong matches ≥0.9: **59 → 102** of 105; weak 0.5–0.89:
**43 → 3**), and generic-anchor landings are flat (34 → 35). Fixing 2 and 3 means
redesigning the score as a single consistent scale; that is a separate change with
its own regression surface and is not done here.

### 3.3 Data — `_data/CST201/` (44 questions re-tagged)

**Verified mechanically against the base commit:** 44 questions changed, and the
set of changed fields is exactly `{'unit'}` — 0 questions changed anything else
(ids, order, stems, options, answers, marks, topics, tags, `subparts` all identical).

Distribution `{1:39, 2:18, 3:21, 4:22, 5:5}` → `{1:40, 2:16, 3:15, 4:21, 5:13}`.
Unit 4 landing exactly on the blueprint's `97m` is an independent confirmation.

`_data/pyq-integrity.json` (`+210 / −6`) now records all 44 `{from, to}` moves
individually, so the authorisation is auditable rather than asserted.

### 3.4 Data — `_quiz-data/CST201/` (the reversed banks)

`unit-3.json` held *User Defined Functions* and `unit-4.json` held *Arrays &
Strings*. The banks are swapped and retitled:

| File | Before | After |
| :--- | :--- | :--- |
| `unit-3.json` | Functions, 42 items | **Arrays/Strings, 38 items** |
| `unit-4.json` | Arrays/Strings, 38 items | **Functions, 42 items** |

Question ids were deliberately **not** renumbered: content moved with its id, so
stored attempt history still resolves to the same question text, and `q.unit` is
authoritative (`extractUnit(q.id)` is only a fallback).

### 3.5 Disclosure removed, not re-labelled

`scripts/build_coverage.py` (`+5 / −22`, net deletion) drops `BANK_UNIT_REVERSAL`,
both "counts shown both ways" renderers, the legend row and the hub paragraph.
`quiz/js/common.js` and its generated bundle no longer label CST201 units 3/4
"mapping under review". `docs/data/validation-exceptions.json` (`+1 / −13`) has
both `unit-order` findings removed **as resolved**, so
`validate_data.py --check-baseline` now reports *"Baseline matches source-review
ledger"* — the first time in Phase 12.

### 3.6 Two latent failures fixed (not waived)

- `tests/test_data_pipeline.py` — the guard against content tampering. It failed
  because its base commit was absent from the shallow clone **and** because it
  forbade any change. It now honours the recorded `unitMoves` list: an unlisted
  edit, a non-`unit` edit, or a grown move list still fails, quiz origins stay
  byte-identical, and the list is capped at 44.
- `tests/lib/minidom.cjs` (`+5`) — a real shim gap. `assets/js/section-notes.js`
  iterates `heading.childNodes`, which the shim never exposed (only `children`).

### 3.7 New tooling

- `scripts/audit_topic_routing.py` (`+163`, new) — reproducible routing gauge with
  `--subject`, `--papers`, `--verbose`, `--fail-unmatched`.
- `tests/test_topic_routing.py` (`+98`, new) — 7 tests pinning segment matching,
  singularisation, the overview tie-break, all 105 questions, and each of the five
  named questions against its exact anchor.

---

## 4. Verification at `99942c0`

| Gate | Result |
| :--- | :--- |
| `python3 -m unittest discover -s tests` | **130/130 pass** |
| `node tests/*.cjs` (14 suites) | **14/14 pass** |
| `check_site.py --strict --quiet` | 0 errors, 0 warnings |
| `check_tokens.py --strict` | 0 findings |
| `check_pyq_integrity.py` | 0 changed/added/missing |
| `validate_data.py --check-baseline` | matches ledger |
| `validate_syllabus.py` | 3 pre-existing out-of-syllabus errors, **0 CST201** |
| `validate_pyq.py` | PASS, 28 papers / 924 questions |
| `check_platform.py` / `check_readme_paths.py` / `check_root_rewrite.py` | 0 errors / 0 missing / PASS |
| `audit_accessibility.py --fail` / `audit_page_weight.py --budget` | 0 findings / within budget |
| `audit_topic_routing.py` | `103` same-unit · `2` redirect · `0` unmatched |

---

## 5. Reproduction

```sh
BASE=d9fe0146ad195423c12df03f7d0b2facf0b43e27
git diff --shortstat $BASE..HEAD
git diff --numstat   $BASE..HEAD | sort -k1,1nr
git log --oneline    $BASE..HEAD
```

To confirm the retags touched nothing but `unit`, diff each paper against the base
commit and compare every field except `unit` (this is what
`tests/test_data_pipeline.py` now enforces permanently).
