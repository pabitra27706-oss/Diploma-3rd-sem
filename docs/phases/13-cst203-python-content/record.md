# Phase 13 Record — Scripting Languages (Python)

- **Status:** 🚧 In progress — part **13.1 (Unit 1)** executed and pushed; parts 13.2–13.6 outstanding. Blueprint calibrated 2026-11-18, baseline re-measured 2026-11-19 (§3.1). Originally: 📋 Planned (blueprint calibrated 2026-11-18 to strict **2023–2026** PYQ weights: `P003–P006`, `4` papers, `104` Qs, `387` printed set marks; `P001-2022-06` excluded).
- **Syllabus authority:** `CST203` (`2` credits, L–T–P `2-0-0`, `30h = 7+5+6+6+6`, PDF pp. 5–7); paired lab `CST213` (`2` credits, `0-0-4`, 8 practical areas, PDF pp. 16–18).
- **Syllabus-boundary verification:** `pandas` (`0m`), `scipy` (`0m`), `matplotlib` (`0m`), `threading` (`0m`), and OOP chapters (`0m`) excluded; `lambda`/recursion (`15m`), `numpy` (`3m`), `set` (`2m`), and `Django vs Flask` (`2m`) isolated in badged **Tier E** callouts.
- **Shipped files modified during planning:** `0` (nothing committed, pushed, PR'd, merged, or deployed).
- **Shipped files modified by part 13.1:** `subjects/CST203/units/unit-1.html`, plus the canonical rebuild outputs (`assets/data/coverage.json`, `assets/data/data-version.json`, `assets/search/*`, `assets/vendor/fontawesome/*`, `coverage.html`) and the `unitAnchored` lock in `tests/test_discovery.py`. Nothing else. No PR, no merge, no deploy.

---

## 1. Reuse Scan (`rule.md` §4.3)
- **DEPEND:** `subjects/units-com/common.css`, `assets/css/{variables,base,hub}.css`, `assets/js/{shell.bundle,section-notes,unit-discovery}.js`.
- **ADAPT:** `assets/js/unit-discovery.js` `focusQuestionTopic()` heading match via newly authored `<h3 id>` anchors across Units 1–5; `docs/revision-sheets/CST203.json`.
- **BUILD:** `python3`-verified code blocks, output traces, inline token-safe SVGs, and 28 semantic `<h3 id>` subheadings inside `subjects/CST203/units/unit-{1..5}.html`.
- **REJECT:** `<iframe>` embeds, `i.ytimg.com` thumbnails, hardcoded colours, and unexamined `pandas`/`scipy`/`matplotlib`/OOP/threading bloat.

---

## 2. Per-Unit Calibration & Verification Ledger (fill at execution)

| Unit | 2023–2026 Weight | Words Before | Target Budget | Words After | `<h3 id>`s Added | Locked `guides.json` Anchors | `<section id>` Count | `python3` Check |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| Unit 1 | `152m` (39.3%) | 5,438w | ~7,200–8,000w | **10,837w** ⚠️ over | **12** | `#collections`, `#strings` ✅ | 15 / 15 ✅ (see §4) | **31/31 parse, 22 run clean** |
| Unit 2 | `64m` (16.5%) | 2,912w | **~4,600w** (weight) | **6,024w** ⚠️ over | **8** (plan: 5) | `#loops`, `#loop-control` ✅ | 13 / 13 ✅ | **44/44 parse, 38 run clean** |
| Unit 3 | `92m` (23.8%) | 4,340w | ~5,800–6,400w | _TBD_ | _TBD_ (plan: 6) | `#parameters`, `#modules` | 14 / 14 | _TBD_ |
| Unit 4 | `49m` (12.7%) | 4,805w | ~4,800–5,300w | _TBD_ | _TBD_ (plan: 4) | `#fileio`, `#regex` | 12 / 12 | _TBD_ |
| Unit 5 | `30m` (7.8%) | 5,657w | ~3,800–4,300w | _TBD_ | _TBD_ (plan: 4) | `#mvc`, `#urls-templates` | 13 / 13 | _TBD_ (`ast.parse`) |
| **Total** | **`387m` (100%)** | **23,018w** | **~26.2–29.2kw** | _TBD_ | _TBD_ (plan **31**, was 28) | **10 / 10 preserved** | **65 / 65** | _TBD_ |

> **Anchor-count plan revised, 2026-11-19.** The blueprint planned **28** `<h3 id>`s
> across the five units (9 for Unit 1). Unit 1 shipped **12**, because `#intro` and
> `#operators` each needed two headings for their questions to reach a correct landing
> — a single heading per section could not separate `Keywords` from `Built-in functions`,
> or arithmetic operators from bitwise/precedence. Carry the same test into Units 2–5:
> **author a heading when a stored topic has nowhere correct to land, not to hit a count.**
> Whatever the final total, the `unitAnchored` lock in `tests/test_discovery.py` must be
> bumped in the same commit (it moved `580 → 592` for Unit 1).

---

## 3. Live-Verified YouTube Curation Log (14 slots, plain `<a>` only)

| Unit | Slot # | Topic Cluster | Tier & Weight | Target Section | Channel & Video Title | Live-Verified URL | Duration | Verified On |
| :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: |
| U1 | 1 | Lists, tuples, sets & dictionaries compared (Tier A · `54m`) | `#collections` | Programming and Math Tutorials | Python: Data Structures — Lists, Tuples, Sets & Dictionaries | `https://www.youtube.com/watch?v=R-HLU9Fl5ug` | 19:01 | 2026-11-19 |
| U1 | 2 | Strings: indexing, slicing, methods, formatting (Tier A · `25m`) | `#strings` | Corey Schafer | Strings — Working with Textual Data | `https://www.youtube.com/watch?v=k9TUPpGqYTo` | 21:11 | 2026-11-19 |
| U1 | 3 | Immutability + a tuple holding a mutable list (Tier A · sub-cluster) | `#tuples-and-sequences` | Real Python | Immutable vs Mutable Objects in Python | `https://www.youtube.com/watch?v=p9ppfvHv2Us` | 09:55 | 2026-11-19 |
| U1 | 4 | Precedence and associativity, incl. right-associative `**` (Tier A · `23m`) | `#operators` | Neso Academy | Precedence and Associativity of Arithmetic Operators | `https://www.youtube.com/watch?v=i2i8YkFyLVs` | 09:05 | 2026-11-19 |
| U1 | 5 | Bitwise `&` and `\|`, traced in binary (Tier A · sub-cluster) | `#operators` | Neso Academy | Bitwise Operators in Python — Part 1 | `https://www.youtube.com/watch?v=F_UIOvfmsew` | 09:21 | 2026-11-19 |
| U2–U5 | 6–14 | _Populate at execution after live verification_ | — | — | — | _No URLs stored before live check_ | — | _TBD_ |

---

## 3.1 Baseline correction, re-measured 2026-11-19 (phase-level, before part 13.1)

The phase blueprint states the Python routing baseline as **`42` same-unit / `7` redirect / `55` unmatched**. That figure is **stale**. It describes the matcher *before* the Phase 12 tie-break rule (`_rank()` in `scripts/audit_topic_routing.py`, which ranks by segments-covered first and score second). Re-running the repository's own reproducible gauge against `main` at `9b13f13`:

```
$ python3 scripts/audit_topic_routing.py --subject CST203
CST203 P00[3-6]: 104 questions
  same-unit=78 · redirect=11 · unmatched=15
```

The corrected baseline, and the granularity breakdown that the pass/fail triple cannot show:

| Measure | Value |
| :--- | ---: |
| Same-unit | 78 (`75.0%`) |
| Redirect | 11 (`10.6%`) |
| Unmatched | **15** (`14.4%`) |
| Landing on a **named `<h3 id>`** heading | 12 / 104 |
| Landing on a **coarse `<section id>`** chapter title | **61 / 104** |
| Landing on a truly generic card (`#overview-*` / `#intro`) | 5 / 104 |

**This is the Phase 12 lesson in a different costume.** Phase 12's failure was 35 questions silently landing on `overview-*` while the counts read "103 same-unit, 0 unmatched". Python's failure is 61 questions silently landing on a chapter title — `#collections` alone absorbs 15 questions covering 56 marks — while the counts read 78/11/15. Neither defect is visible in the triple, because a section-level anchor is still a "same-unit hit".

Corrected in place: `13/README.md` §1, `docs/phases/README.md` matrix row 13 (with a dated footnote). The original `42 / 7 / 55` is retained in `docs/phases/README.md` as dated history only.

---

## 4. 2023–2026 PYQ ↔ Unit Routing Audit (`104` Questions)

- **Sync mode used:** Mode A (`_data/CST203/*.json` untouched) / Mode B (owner approval date: _N/A_)
- **Baseline (`f52d2f6`, superseded — see §3.1):** `42` same-unit (`40.4%`) · `7` redirect (`6.7%`) · **`55` unmatched (`52.9%`)** · `0` out-of-unit
- **Baseline re-measured on `main` at `9b13f13` (§3.1):** `78` same-unit · `11` redirect · **`15` unmatched** 
- **Post-13.1 (Unit 1 only):** `89` same-unit · `10` redirect · **`5` unmatched** · U1 named-heading landings **12 → 36** · all-104 named-heading landings **12 → 41** · coarse-section landings **61**
- **But a named landing is not a correct landing (added after the audit below).** Judged question by question against the stems, Unit 1's 51 questions are **34 genuinely right on a named heading**, **1 right via a section id**, **3 on a named heading that does not answer the question** (`P003-Q29`, `P004-Q12`, `P004-Q17`), **11 on a coarse chapter title**, **2 unmatched**. The named-landing count `36` is therefore **3 too generous** as a proxy for "answered". See §4.1.3b.
- **Post-Phase-13 result:** _TBD_ same-unit · _TBD_ accurate redirect · `0` unmatched (needs 13.2–13.6; the remaining 5 all live in Units 4–5, see §4.2)

---

## 4.1 Part 13.1 result — Unit 1 (Introduction), `152m / 39.3%`

### 4.1.1 What shipped

`subjects/CST203/units/unit-1.html` rewritten on the weight order the blueprint specifies.

| Section | Before | After | Δ | Tier | Marks |
| :--- | ---: | ---: | ---: | :--- | ---: |
| `#collections` | 662w | **1,625w** | +963 | A (+E) | 54m + 2m |
| `#operators` | 619w | **1,393w** | +774 | A | 23m |
| `#intro` | 373w | **1,164w** | +791 | A (+S) | 23m |
| `#strings` | 313w | **1,052w** | +739 | A | 25m |
| `#variables` | 275w | **854w** | +579 | A + C | 21m + 4m |
| `#mcqs` | 442w | 865w | +423 | 10 → 14 items | 64m MCQ cluster |
| `#long-questions` | 727w | 1,580w | +853 | 5 → 6 worked 8m | 88m Group B |
| `#short-questions` | 372w | 683w | +311 | 8 → 6 items, longer answers | — |
| `#practice` | 394w | 593w | +199 | 5 → 6 programs | — |
| `#formulas` | 161w | 130w | −31 | condensed | — |
| `#definitions` | 277w | 197w | −80 | condensed | — |
| `#comparisons` | 187w | 74w | −113 | now an index into the five tables | — |
| `#revision` / `#overview` / `#videos` | 568w | 566w | ⇄ | `#videos` 78 → 132w for 5 links | — |
| **Total** | **5,438w** | **10,837w** | **+5,399** | | |

- **12 `<h3 id>` anchors**, verified by `grep -o '<h3[^>]*id="[^"]*"'` on the written file, not from a heading list:
  `python-basics-indentation-keywords-and-comments`, `running-python-interactive-script-mode-and-builtin-functions`, `data-types-mutability-and-type-conversion`, `datetime-in-python`, `string-slicing-indexing-and-methods`, `string-formatting-and-immutability`, `lists-slicing-methods-and-copy-semantics`, `tuples-and-sequences`, `dictionaries-keys-and-methods`, `arithmetic-string-and-assignment-operators`, `logical-identity-and-membership-operators`, `bitwise-operators-and-precedence`.
- **2 inline SVGs** with `role="img"` + prose `aria-label`: the index/slice window on `"Python"` (in `#strings`) and alias vs shallow vs deep copy (in `#collections`).
- **5 comparison tables**: Python 2 vs 3, interactive vs script mode, indexing vs slicing, list vs tuple vs dict, `==` vs `is`, plus shallow vs deep copy — the blueprint asked for six and `%`/`.format()`/f-string became a table row inside `#string-formatting-and-immutability`.
- **All 15 `<section id>`s preserved** (the blueprint listed 14; the page has 15 because `#videos` exists). Both locked `guides.json` anchors, `#collections` and `#strings`, still resolve — checked against `docs/suggestions/guides.json`, not against memory.
- **Zero** raw `CST203`/`CST213`/`P00x` strings in rendered text, zero `pandas`/`scipy`/`matplotlib`/`threading`, zero `<iframe>`, zero `i.ytimg.com`.

### 4.1.2 The anchors are what fixed it — proved by ablation

Per `rule.md` §4 and the standing lesson, the mechanism was validated by **removing** it. With the identical matcher and the 12 anchors stripped from the written file:

| | Routing triple | U1 questions reaching a named heading |
| :--- | :--- | ---: |
| Unit 1 as shipped (12 anchors) | 89 same-unit · 10 redirect · 5 unmatched | **36 / 51** named — but only **34** of those named landings actually answer the question (§4.1.3b) |
| Unit 1 with `<h3 id>` deleted | 89 same-unit · 10 redirect · 5 unmatched | **0 / 51** |

The triple is **byte-identical in both runs**. Only the granularity measure moves. That is direct proof that (a) the anchors are what improve routing quality rather than the word count, and (b) the pass/fail triple would have reported success either way. The file was restored from a copy afterwards and re-grepped to confirm 12 anchors.

All-104 granularity moved from 12 named / 61 coarse / 5 generic / 15 unmatched to **41 named / 61 coarse / 2 generic / 5 unmatched**. Unmatched 15 → 5; generic (`#overview-*`, `#intro`) 5 → 2.

### 4.1.3 The five remaining misses are not Unit 1's

`P005-Q10` (`print() / sep`), `P005-Q11` (`Django static files`), `P005-Q13` (`Sets / union`), `P005-Q14` (`List mutation during iteration`), `P005-Q20` (`File object methods`). Four belong to Units 4–5 and close in 13.4/13.5. `P005-Q13` and `P005-Q14` are Unit 1 content whose headings exist but whose names do not contain the topic's words — they are the correct first entries for `assets/data/topic-map-CST203.json` in part 13.6, which is exactly what the map is for. **No `_data/` edit was made** (Mode A).

### 4.1.3a A new matcher defect found by reading individual landings (not by counting)

While spot-checking the post-rewrite landings rather than trusting the triple, one
resolution turned out to be **wrong content**, not merely coarse:

| Question | Stored topic | Stem | Lands on | Should land on |
| :--- | :--- | :--- | :--- | :--- |
| `P003-Q19` | `Built-ins / all` | `print(all([10, 8, 6, 4, 0]))` | `#collections` | the built-in-functions heading |

**Cause.** `score_against()` in `scripts/audit_topic_routing.py` (and its JS twin in
`assets/js/unit-discovery.js`) awards the 90-point "topic appears in the heading"
score with a bare substring test, `target in title`. The topic segment `all` is
therefore found inside the word **"shallow"** — in the heading *"Aliasing, shallow
copy and deep copy"* — and 90 points beats the 0.5 that the correct heading scores
on the same topic. It is the same class of failure Phase 12 described: a *plausible*
wrong section, invisible in the counts.

**Why it is not fixed here.** A word-boundary test (`\b`-anchored match) was
prototyped and measured across all five subjects. Routing triples do not move
anywhere, but **19 individual questions change landing** (3 in Python), and the change
is not a clean win:

- Clearly better: `P003-Q19` (fixed — this is the one the map would otherwise pin); `CST209-P005-Q22` (`#dag-topo` → `#shortest-path-…-floyd-warshall`).
- Clearly worse: `P003-Q27` and `P005-Q22` would move **out of** the string heading
  and into `#data-types-mutability-and-type-conversion`. Both are 8-mark composites
  whose marks sit mostly on strings (for `P003-Q27`: 3m `join`/`split` + 3m string
  immutability against 2m mutability classification), so the current landing is the
  correct one and the "fix" would break it.
- Neutral heading differences on the other 16, all in the four subjects this phase does not own.

(All three of these are pinned by `tests/test_routing_order.py`, so the claim cannot rot.)

So the defect is real, affects one confirmed question in this subject, and the
correct fix is **scoped, not global**: the explicit map in part 13.6 is consulted
before the matcher and can pin `Built-ins / all` without disturbing 18 other
questions in subjects this phase does not own. The matcher change belongs in a
dedicated cross-check phase (17) where all five maps can be re-validated together.
**Flagged for the owner in §6.**

### 4.1.3b The tie-break is document-order dependent — measured, not suspected

`_pick()` in `scripts/audit_topic_routing.py` (and `entriesFor()` / `bestMatch()` in
`assets/js/unit-discovery.js`) walks the heading list in document order and replaces
the incumbent only when a candidate is **strictly** better:

```python
if _better(title, best[2] or '', needle):
    best = (score_title(title, needle), anchor, title, home)
```

`_better()` compares `(segments_covered, score)`, and *coverage* is a function of the
whole stored topic string, not of the heading being compared. So for any topic whose
segments are spread across two different headings, every such heading scores the same
coverage, and the winner is whichever one the author happened to write **first**.

**Proof (this is the test that should have been run in Phase 12).** Landing must not
depend on authoring order. Reversing each unit page's heading list and re-routing the
same stored topics:

| Subject | Questions whose landing changes when the page order is reversed |
| :--- | ---: |
| CST201 (C) | **36** |
| CST203 (Python) | **29** |
| CST205 | **35** |
| CST207 | **10** |
| CST209 | **50** |
| **All five** | **160 of 523 (`30.6%`)** |

Three Python examples, each landing on a heading that does **not** answer it:

| Question | Stored topic | Lands on | Why it is wrong |
| :--- | :--- | :--- | :--- |
| `P004-Q12` (2m) | `Lists / literals` | `#string-slicing-indexing-and-methods` | *"create a list containing numbers from 1 to 5"* — `literals` only matches the **string**-literals heading, and that heading is written before the lists one |
| `P004-Q17` (8m) | `Slicing / dictionaries` | `#string-slicing-indexing-and-methods` | the stem is **list** slicing + dictionaries. `Slicing` matches both the string and the list heading at 90; the string one comes first |
| `P003-Q29` (8m) | `Dictionaries / sequences` | `#tuples-and-sequences` | a) dictionaries, b) tuple vs list — the dictionary half gets no coverage, `sequences` does, and documents order decides |

`P004-Q12` moved from `#lists-…` to `#string-…` purely because reversing the page put
the string heading later. Nothing about the question changed.

**The same defect reproduced in the shipped browser code, not just in the audit
script.** The pure scoring helpers (`scoreAgainst`, `segmentsCovered`, `better`,
`scoreTitle`) were extracted out of `assets/js/unit-discovery.js` and re-run over the
real Unit 1 heading list (38 headings) with the real stored topics — i.e. the same
`for` loop the browser runs over `entriesFor()`, which returns `h2, h3, h4` in
document order. **16 of 51 Unit-1 questions change landing when the page order is
reversed.**

**Reversing is not a fix — it is the other side of the same coin.** Each of the 16 was
read against its stem: the forward order is right on **5** and arguably right on **3**,
the reversed order is right on **6**, and **2** are unmatched either way. A coin flip
that is 50/50 is not a tie-break. This is exactly why the fix cannot be "sort the
headings differently".

**Why this is the same failure as Phase 12, one level down.** Phase 12 replaced a
fuzzy scorer with a coverage-first tie-break and reported `103/2/0`. Coverage-first was
the right *idea* and it did fix the `#overview-recursion` collapse it was written for,
but it introduced a silent dependency on document order that the pass/fail counts
cannot see — the same blind spot the phase set out to remove. The lesson from §6.1
applies to the fix as much as to the original bug: **a rule that cannot be falsified by
the numbers being reported is not verified.**

**Why it is not fixed in part 13.1.** A correct tie-break needs a real priority, not
document order — e.g. prefer the candidate that covers the *most* segments, then the
candidate whose *matched* segments carry more of the topic's own weight, then fall back
to position only as an explicit last resort. That is a scoring change, it moves
questions in all five subjects (160 at minimum), and it must be validated against all
five maps, not just Python's. It is filed for **Phase 17 (cross-subject matcher)**;
part 13.6's explicit topic map is the correct scoped mitigation in the meantime,
because a map entry bypasses the scorer entirely.

**This means the Phase 12 routing result (`103/2/0`) is weaker evidence than it was
presented as**, and the owner should be told that plainly. The counts are reproducible;
they are just not order-independent, and roughly a third of the corpus is sitting on a
coin-flip the counts cannot show.

### 4.2 Budget re-based to the exam weights — owner decision, 2026-11-19

The owner's instruction was **"set word budget as per your need"**. The blueprint's
per-unit budgets are replaced by a single rule: **each unit's word count is
proportional to its 2023–2026 mark weight**, anchored on Unit 1's shipped size, which
the owner accepted.

`152m / 387m = 39.3%` and Unit 1 is `10,837w`, so the phase total is
**`10,837 / 0.393 ≈ 27,600w`** and every other unit follows from its own weight:

| Unit | Marks | Weight | Budget | Before | Target delta | Action |
| :--- | ---: | ---: | ---: | ---: | ---: | :--- |
| U1 Introduction | `152m` | 39.3% | **10,837w** | 10,837w | ±0 | shipped |
| U2 Control statements | `64m` | 16.5% | **~4,600w** | 2,912w | **+1,650** | grow |
| U3 Functions & modules | `92m` | 23.8% | **~6,600w** | 4,340w | **+2,220** | grow |
| U4 File handling & regex | `49m` | 12.7% | **~3,500w** | 4,805w | **−1,300** | **trim** |
| U5 Django | `30m` | 7.8% | **~2,150w** | 5,657w | **−3,500** | **trim** |

**Two consequences, both accepted rather than hidden.**

1. **Units 4 and 5 must get shorter.** They are today the *longest* pages in the
   subject (`U5` at 5,657w for 7.8% of the marks). Trimming is a real edit, not a
   re-label: content that is not tested and not on the syllabus leaves the page.
   Every trim is listed in its part's record section with what was removed.
2. **Unit 2 grows from the shortest page in the repository to a real one.** `2,912w`
   for 16.5% of the marks was the largest single distortion in the subject.

**A tolerance, stated so it is not a moving goal.** Each unit may land within
**±10%** of its budget. A unit outside that band gets an explicit paragraph in its
part's record saying why, as Unit 1 has in §4.1.6. There is no other escape clause.

**What this is not.** It is not a quota to pad with words. The *content* rule from
Unit 1 carries over unchanged: a section is as long as the marks it answers, and a
heading is authored where a stored topic has nowhere correct to land. Per the owner,
**Phase 17 is the cross-subject matcher check and runs after all phases end**, so
parts 13.2–13.6 use the topic map as the scoped mitigation and do not touch the scorer.

### 4.3 Part 13.2 result — Unit 2 (Control statements), `64m / 16.5%`

**What shipped.** `subjects/CST203/units/unit-2.html` went from 2,912w and **zero**
`<h3 id>` anchors to **6,024w / 4,638 prose** and **8** anchors. It was the shortest
unit page in the entire repository for the third-heaviest unit in the subject; that
inversion is now gone.

| Section | Before | After |
| :--- | ---: | ---: |
| `#overview` | 84 | 84 |
| `#conditionals` | 313 | 675 |
| `#loops` | 430 | 1,167 |
| `#loop-control` | 473 | 945 |
| `#formulas` | 53 | 105 |
| `#definitions` | 133 | 225 |
| `#comparisons` | 71 | 161 |
| `#mcqs` | 287 | 652 (5 &rarr; **10**) |
| `#short-questions` | 231 | 478 (5 &rarr; **5**, rewritten) |
| `#long-questions` | 346 | 659 (3 &rarr; **3**, rewritten as 8-mark answers) |
| `#practice` | 210 | 406 (0 &rarr; **4** worked programs) |
| `#revision` | 272 | 378 |
| `#videos` | 69 | 114 (0 &rarr; **4 verified**) |

**Routing, before &rarr; after part 13.2** (`scripts/audit_topic_routing.py`, same matcher):

| | Baseline | After 13.1 | After 13.2 |
| :--- | ---: | ---: | ---: |
| same-unit / redirect / unmatched | 78 / 11 / 15 | 89 / 10 / 5 | **91 / 8 / 5** |
| all-104 named `<h3 id>` landings | 12 | 41 | **52** |
| all-104 coarse-section landings | 61 | 61 | **50** |
| Unit 2 questions on a named heading | 5 | 5 | **13 of 19** |

**Ablation proof, run again.** Deleting Unit 2's 8 `<h3 id>` attributes leaves the
routing triple **byte-identical** (91 / 8 / 5) and drops U2 named landings **13 &rarr; 0**.
Same result as 13.1: the triple cannot see the anchors, the granularity measure can.

**A defect cured by content, not by code.** In 13.1 the word-boundary "fix" for the
substring bug regressed `P005-Q22` out of the string heading. Unit 2 now has a
`range()` heading of its own, which out-scores the mutability section for that topic,
so `P005-Q22` stays correct **and** the naive fix no longer breaks it. The pinned
numbers in `tests/test_routing_order.py` were re-measured and updated (CST203
order-dependence `29 &rarr; 31`, word-boundary moves `3 &rarr; 2`). **The test was
changed because the measurement changed, and the reason is in the test's comment.**

**Honest gap: the size.** 6,024w is **31% over** the 4,600w weight budget, i.e. outside
the ±10% band declared in §4.2, so it is stated rather than waived:

- The *concept* sections total **2,787w** for **48% of the unit's marks** — that is
  the dense part and it is proportionate.
- The overrun sits in the **assessed practice bank**: 10 MCQs, 5 short answers, 3
  worked 8-mark answers and 4 fully-run programs = **2,195w**. Trimming to the band
  means *removing assessed questions*, not padding — the same trade-off already
  documented for Unit 1 in §4.1.6.
- An earlier draft reached 6,424w and was cut to 6,024w by deleting one MCQ, one short
  answer, one long answer, removing a duplicated falsy-values code box (the table
  already carried it), folding the do-while demo into prose, and compressing
  `#revision` from 12 points to 9.

**Owner decision needed:** if 4,600w is a hard ceiling, the remaining cut is the
practice bank down to 8 MCQs / 4 short / 2 long, about 700w, and it is a 10-minute edit.
Otherwise Unit 2 is complete as it stands. **Flagged, not decided unilaterally.**

**Videos shipped (4, all live-verified 2026-11-19):** `94UHCEmprCY` Mosh 14:42
(`range`, `break`, `for...else`, nested); `rRTjPnVooxE` Bro Code 06:58 (`while`,
infinite loops); `Rjjgy2QWS98` Neso 16:48 (`break`/`continue` traced); `SiECEKZDqqk`
Neso 09:40 (`if-else` + shorthand).

### 4.1.4 Code verification

Every `<pre>` block was machine-checked against Python 3.11.2 rather than eyeballed:

- **31 blocks, 31 parse cleanly** (`compile()`).
- **22 run to completion** and print what the surrounding prose claims.
- **5 are deliberate error demonstrations** (`tuple` item assignment ×2, `list[99]`, `str.index` miss, `list` key in a dict) — each caught and checked against the exception text the prose states.
- **4 need `input()` or the live clock** and cannot run headless; they were taken from the verified `s7_datetime.py` / practice scripts.
- **Two snippets were fixed as a result.** Both had live code *after* a deliberate `TypeError`/`KeyError`, which could never have executed — the error is now a comment in those blocks. One further block (`"3" + 4`) was turned into a comment for the same reason. This is the kind of defect a "0 syntax errors" check would have passed.

### 4.1.5 Videos

The three shipped links were `youtube.com/results?search_query=...` placeholders — search pages, not videos. They are replaced by **five verified `watch?v=` links**, each loaded individually and checked for public visibility, topic match and duration:

| Slot | Channel | Title | URL | Length | Verified |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 1 | Programming and Math Tutorials | Python: Data Structures — Lists, Tuples, Sets & Dictionaries | `https://www.youtube.com/watch?v=R-HLU9Fl5ug` | 19:01 | 2026-11-19 |
| 2 | Corey Schafer | Strings — Working with Textual Data | `https://www.youtube.com/watch?v=k9TUPpGqYTo` | 21:11 | 2026-11-19 |
| 3 | Real Python | Immutable vs Mutable Objects in Python | `https://www.youtube.com/watch?v=p9ppfvHv2Us` | 09:55 | 2026-11-19 |
| 4 | Neso Academy | Precedence and Associativity of Arithmetic Operators | `https://www.youtube.com/watch?v=i2i8YkFyLVs` | 09:05 | 2026-11-19 |
| 5 | Neso Academy | Bitwise Operators in Python — Part 1 | `https://www.youtube.com/watch?v=F_UIOvfmsew` | 09:21 | 2026-11-19 |

The blueprint asked for **4** slots; five shipped because `#collections` and `#operators` each carry two Tier A sub-clusters. Slot 3 was chosen deliberately: its description covers "non-transitive immutability" (a tuple holding a mutable list), which is the exact `P003-Q1/Q25` trap taught in `#tuples-and-sequences`. `curl` to `youtube.com` is blocked in this sandbox but the page fetcher is not; every URL above was loaded and its metadata read. **No link ships unverified.**

### 4.1.6 Honest gap: the word budget

The page is **10,837w** against the blueprint's **7,200–8,000w**. *(Figures on this
line were re-measured directly from the committed file on 2026-11-19 after a 17-word
discrepancy was noticed between the prose and the file; the earlier `10,820w` / `6,088w`
came from summing per-section counts, which drops words in the inter-section markup.
The page total is the authoritative number.)* Concept prose `#intro…#operators` is **6,056w** against a planned 5,870w — on target. The overrun is the **practice bank**: `#mcqs` + `#long-questions` + `#short-questions` + `#practice` = **3,721w**, against roughly 2,100w at the blueprint's implied rate. Worked 8-mark answers on this page average 263 words each, because the marks are 5+3 or 4+4 and a model answer has to address every part.

The blueprint's own arithmetic is also internally inconsistent, and this was checked rather than assumed: its per-unit budgets sum correctly to 26.2–29.2kw, but Unit 1 is given **27.5%** of that budget while carrying **39.3%** of the marks. A purely weight-proportional Unit 1 at the same total is **10,300–11,475w** — which brackets what shipped. The other four units absorb the difference (U4 gets 18.3% of the words for 12.7% of the marks).

**Decision recorded rather than hidden:** the five concept sections are at budget, and I did not gut the worked answers to hit a number that contradicts the weight calibration it exists to serve. This is flagged for the owner in §6. If the owner wants the strict 8,000w ceiling, the cut is the practice bank (drop `#long-questions` to 4 items, `#mcqs` to 12), and it is a 20-minute edit — not a rewrite.

### 4.1.7 Gates after part 13.1

| Check | Result |
| :--- | :--- |
| `check_pyq_integrity.py` | ✅ 0 changed/added/missing |
| `check_site.py --strict --quiet` | ✅ 0 errors, 0 warnings |
| `audit_accessibility.py --fail` | ✅ 0 findings (0 heading-order jumps) |
| `check_tokens.py --strict` | ✅ 0 findings |
| `build_suggestions.py --check` | ✅ 11 static pages verified |
| `build_icon_subset.py --check` | ✅ current, 26,466 B, 238 icons (regenerated: 3 new icons used) |
| `build_data_version.py --check` | ✅ current, over 82 files |
| `audit_page_weight.py --budget` | ✅ within 340 KB CSS / 350 KB JS |
| `check_platform.py` / `check_root_rewrite.py` / `check_readme_paths.py` | ✅ clean |
| `python3 -m unittest discover -s tests` | ✅ **136/136 OK** |
| `node tests/*.cjs` (14 shipped suites) | ✅ **14/14 PASS** |
| `unitAnchored` lock (`tests/test_discovery.py:111`) | ✅ **580 → 592** (+12) |
| Canonical rebuild (`README.md:187–215`) | ✅ run in order; `0` drift after |

The 11 `*-browser.cjs` suites were **not run**: they require `playwright-core` and a Chromium build, neither of which exists in this sandbox. That is a pre-existing environment limit, not a regression from this part.

---

## 5. Quality-Gate & Rebuild Evidence (fill at execution)

| Check / Command | Expected | Result |
| :--- | :--- | :---: |
| `python3 scripts/check_pyq_integrity.py` | `0` changed/added/missing | _TBD_ |
| `python3 scripts/build_suggestions.py --check` | `11` static pages verified | _TBD_ |
| `python3 scripts/check_site.py --strict --quiet` | `0` errors, `0` warnings | _TBD_ |
| `python3 scripts/validate_pyq.py` & `validate_data.py --check-baseline` | PASS / matches baseline | _TBD_ |
| `python3 scripts/audit_accessibility.py --fail` & `check_tokens.py --strict` | `0` findings | _TBD_ |
| `python3 scripts/audit_page_weight.py --budget` | `84/84` within budget | _TBD_ |
| `python3 scripts/build_icon_subset.py --check` & `build_data_version.py --check` | current | _TBD_ |
| `python3 -m unittest discover -s tests` & `node tests/discovery-dom.cjs` | all pass | _TBD_ |

---

## 6. Owner Verification & Open Caveats
- **URLs to verify under `/Diploma-3rd-sem/`:** `subjects/CST203/index.html`, `subjects/CST203/units/unit-{1..5}.html`, `suggestions/python/easy-read.html`, `revision/CST203.html`, `pyq/viewer.html` (spot-checking 2023–2026 Python `.unit-topic-link` jumps), and `subjects/CST213/index.html`.
- **Owner decision (`rule.md` §4.7):** _Pending execution (`mark as pass` / `add for later`)._
- **Two decisions waiting for the owner after part 13.1:**
  1. ~~**Word budget (§4.1.6).**~~ **RESOLVED by owner, 2026-11-19: "set word budget as per your need."** The budget is now **weight-proportional**, anchored on Unit 1 as shipped, and it is the live number for units 2–5 (§4.2). Unit 1 ships at 10,837w against a 7,200–8,000w target. The blueprint gives Unit 1 27.5% of the word budget for 39.3% of the marks, so a weight-proportional U1 at the same total is 10,300–11,475w. Options: (a) accept the overrun as weight-correct, (b) enforce the ceiling by cutting 4 long answers + 2 MCQs, (c) re-base the per-unit budgets to be weight-proportional for units 2–5. **Nothing has been cut that cannot be restored in one commit.**
  1a. **Unit 2's size (§4.3).** It ships at **6,024w** against a **4,600w** weight budget — 31% over, outside the ±10% band. The concept sections (2,787w) are proportionate to 48% of the unit's marks; the overrun is the assessed practice bank (2,195w). The cut to the band is 8 MCQs / 4 short / 2 long, about 700w, and it is a 10-minute edit. **Accept the density, or enforce the band?**
2. **The matcher itself is not trustworthy — this is now the biggest open item (§4.1.3a, §4.1.3b).** Two independent defects: (i) `score_against()` does a bare substring test, so `Built-ins / all` lands on the collections section because `all` occurs inside **shallow**; (ii) the tie-break between two equally-relevant headings depends on **document order**, so reversing a unit page's heading list changes the landing of **160 of 523 questions (30.6%)** across all five subjects — 16 of 51 in Unit 1 alone, reproduced in the shipped `unit-discovery.js`, not just the audit script. Reversing is not a fix: the two orders are right on 5+3 vs 6 of the 16. Both defects are invisible to the pass/fail triple and were missed in Phase 12. **Recommendation:** scoped fix now (13.6 topic map, which bypasses the scorer), real fix as a dedicated Phase 17 across all five maps — including a regression test that asserts landings are invariant under heading reorder. **This also means Phase 12's `103/2/0` result is weaker evidence than it was reported as.** Owner's call on whether Phase 17 is authorised before Phases 14–16.
- **Standing caveats:** Physical-device check stays owner-side via Termux; PYQ answer keys remain uncertified per `docs/PROJECT-CLOSURE.md`.

---

## 6.1 Common mistakes made in this phase (so they are not repeated in 13.2–13.6)

1. **I nearly validated on the routing triple.** The first measurement after the rewrite read `89/10/5` and looked finished. The ablation (delete the anchors, re-measure) showed the triple was identical without them. The triple is a **necessary, never sufficient** check; report the granularity split alongside it every time.
2. **`#formulas`/`#comparisons`/`#definitions` were left behind by Phase 12's style.** All three duplicated what the new sections now say. They were rebuilt as a compact reference, an index table and a six-definition list — 224w saved and, more importantly, no longer contradicting each other.
3. **Word counts from different eras are not comparable.** The blueprint's `5,304w` and `23,018w` came from a recipe that is not in the repo; the page measures 5,438w on the calibrated metric used here. Every number in this record uses one recipe, and the recipe is stated in §2. Anyone comparing against an older figure is comparing two instruments.
4. **A "0 syntax errors" check is not a correctness check.** Three snippets carried dead code after a deliberate exception. Compare printed output against the prose, not just `compile()`.
5. **Read individual landings; a count cannot tell you a landing is wrong.** The triple read `89/10/5` and the granularity split read `41 named`, and one of those 41 named landings was sending a question about `print(all([...]))` to the collections section because the topic word `all` occurs inside `shallow`. Every aggregate was green. Spot-check a sample of real questions against their stems every part.
6. **Test whether a result survives a change that should not matter.** Reversing a page's heading order is not a content change, so it must not change a single landing. It changes **160 of 523 (30.6%)**. That single test found a matcher defect that a `103/2/0` pass/fail triple, a `41 named` granularity count and a hand audit of 51 questions had all reported as fine. Before reporting any matcher number, run the invariance test (`tests/test_routing_order.py::test_order_dependence_is_measured_and_ratcheted`).
7. **Verify a proposed fix before believing it.** The word-boundary prototype looked obviously correct and would have silently broken two 8-mark questions whose marks favour strings over mutability. Measure the fix on the actual corpus, in both directions, before it ships.
8. **A test that asserts today's numbers is a ratchet, not a proof.** The new `tests/test_routing_order.py` pins 160 / 36 / 29 / 35 / 10 / 50 so the defect cannot drift silently; it does not make the behaviour correct. Say so when reporting a green suite.
