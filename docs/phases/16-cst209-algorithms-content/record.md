# Phase 16 — Execution Record (`record.md`)

> **Phase:** 16 — Algorithms (`CST209`) Weight-Calibrated Content, Video Curation & PYQ Sync  
> **Current State:** 📋 **Planned — Not Yet Executed** (0 shipped website/data files modified)  
> **PYQ Calibration Window:** Strict `2023–2026` (`P003-2023-03` .. `P006-2026-01` — `4` papers, `105` Qs, `395` printed set marks; `P001-2022-06` excluded)  
> **PYQ Data Mode:** **Mode A** (read-only `_data/CST209/*.json` & `validation-exceptions.json`; `SYLLABUS_UNITS.CST209 = 4` immutable)

---

## 1. Pre-Execution Baseline Snapshot (Captured 2026-11-18)

| File | Role | True 2023–26 Marks | Baseline Words | Target Words | `<section>`s | `<h3 id>`s (Base → +New) | `<pre>` / `<table>` / `<svg>` | Quiz Bank |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `unit-1.html` | Official U1 (`6h`) | `89m` (`22.5%`) | `4,572w` | `~5,800–6,400w` | `16` | `26 → +6` | `13 / 11 / 0` (+2 SVG) | `34` Qs |
| `unit-2.html` | Official U2 (`16h`) | `79m` (`20.0%`) | `6,248w` | `~6,200–6,800w` | `14` | `13 → +2` | `10 / 6 / 0` (+3 SVG) | `42` Qs |
| `unit-3.html` | Official U3 (`18h`) | `92m` (`23.3%`) | `5,915w` | `~6,600–7,200w` | `15` | `8 → +2` | `6 / 10 / 0` (+3 SVG) | `40` Qs |
| `unit-4.html` | Official U4 (`20h`) | `93m` (`23.5%`) | `6,512w` | `~6,800–7,500w` | `13` | `8 → +4` | `7 / 14 / 0` (+4 SVG) | `45` Qs |
| `unit-5.html` | **CO5 Supp.** | `42m` (`10.6%`) | `6,477w` | `~4,600–5,200w` | `18` | `6 → +5` | `8 / 16 / 0` (+2 SVG) | `35` Qs* |
| **Total** | **4 Off. + 1 CO5** | **`395m` (`100%`)** | **`29,724w`** | **`~30.0–33.1kw`** | **`76`** | **`61 → +19`** | **`44 / 57 / 0` (+14 SVG)** | **`196` Qs** |

- **PYQ routing baseline (`105` Qs):** `56` same-unit (`53.3%`) · `22` cross-unit redirects (`21.0%`) · `26` unmatched (`24.8%`) · `1` out-of-unit (`P003-Q34`) · `0 / 8` CO5 questions reaching `unit-5.html` → **Target:** `105 / 105` (`100%`) resolved to exact concept headings.
- **Locked `guides.json` anchors (8):** `asymptotic`, `complexity`, `elementary`, `efficient`, `binary-search`, `hashing-collision-resolution-techniques`, `mst`, `shortest-path`.
- **Revision sheet (`docs/revision-sheets/CST209.json`):** `8` entries (`U1: 4, U2: 1, U3: 2, U4: 1`). *\*`_quiz-data/CST209/unit-5.json` tracked in `validation-exceptions.json` (`bank-unit`).*

---

## 2. Part-by-Part Execution Log (Fill In During Execution)

| Part | Scope | Completed Date | Post-Edit Words | SVGs / New `<h3 id>`s | Traces Verified | Notes |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | Unit 4 (`unit-4.html`) | _pending_ | _pending_ | `0/4` · `0/4` | _pending_ | Preserve `#dijkstras-algorithm` & no `Next: Unit 5` |
| **2** | Unit 3 (`unit-3.html`) | _pending_ | _pending_ | `0/3` · `0/2` | _pending_ | Binary Search + Hashing + BST/Balanced |
| **3** | Unit 1 (`unit-1.html`) | _pending_ | _pending_ | `0/2` · `0/6` | _pending_ | `O/Ω/Θ`, D&C/DP/Greedy, `T(n)=2T(n/2)+1` |
| **4** | Unit 2 (`unit-2.html`) | _pending_ | _pending_ | `0/3` · `0/2` | _pending_ | Quick 12-item, Bubble 8-item, Radix 9-item |
| **5** | Unit 5 CO5 + routing | _pending_ | _pending_ | `0/2` · `0/5` | _pending_ | `SUPPLEMENTARY_UNITS={CST209:[5]}`; `SYLLABUS_UNITS=4` |
| **6** | YouTube + 13 Gates | _pending_ | _pending_ | `15` plain `<a>` | _pending_ | Search/presence/version + DOM & unit tests |

---

## 3. Algorithm Trace Verification Log (10 Exact Exam Datasets)

- [ ] U1 loop `while (i <= n) i = i * 2` (`O(log n)`, `P003-Q27a`) & substitution `T(n) = 2T(n/2) + 1 = 2n - 1` (`P005-Q17b`)
- [ ] U2 Quick Sort on `38, 81, 22, 48, 13, 69, 93, 14, 45, 58, 79, 72` (`P005-Q19a`)
- [ ] U2 Bubble Sort on `25, 57, 48, 37, 12, 92, 86, 33` (`P006-Q18b`)
- [ ] U2 LSD Radix Sort on `347, 142, 361, 423, 538, 126, 320, 549, 365` (`P006-Q19b`)
- [ ] U3 Shared-key Hashing trace (Chaining + Linear + Quadratic + Double Hashing)
- [ ] U4 Prim's & Kruskal's MST traces (`P003-Q30`, `P004-Q18`, `P005-Q21`, `P006-Q23b`)
- [ ] U4 Dijkstra (`P003-Q33`, `P006-Q24a`), Bellman-Ford (`P004-Q22`), & Floyd-Warshall 4×4 `D^(0)..D^(4)` (`P005-Q22b`)
- [ ] U5 Rabin-Karp mod-`q` rolling-hash trace w/ spurious hit (`P003-Q34`, `P006-Q22b`)
- [ ] U5 KMP LPS `[0,0,1,2,0]` + `"ababd"` in `"ababcabcabababd"` → index `10` (`P005-Q24b`)
- [ ] U5 Naive `"101110"` in `"1110101011101100"` → shift `6` (`P004-Q23b`) & Trie for `{bat, ball, doll, dork, do, dorm, send, sense}` (`P005-Q23b`)

---

## 4. Curated YouTube Links Log (`15` Slots — Populate Only After Live Check)

| Unit | Slot | Section | Video Title & Channel | Duration | Checked Date | Plain `<a>` Only? |
| :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| U1 | 1–3 | `#asymptotic`, `#complexity`, `#programming-models` | _populate at execution_ | — | — | [ ] |
| U2 | 1–3 | `#efficient`, `#elementary`, `#linear` | _populate at execution_ | — | — | [ ] |
| U3 | 1–3 | `#binary-search`, `#hashing`, `#bst` | _populate at execution_ | — | — | [ ] |
| U4 | 1–3 | `#mst`, `#shortest-path`, `#dag-topo` | _populate at execution_ | — | — | [ ] |
| U5 | 1–3 | `#rabin-karp`, `#kmp`, `#tries` | _populate at execution_ | — | — | [ ] |

---

## 5. Verification Gate Sign-Off

- [ ] `check_pyq_integrity.py` = `0` changed/added/missing; `validate_syllabus.py` keeps `SYLLABUS_UNITS.CST209 === 4`
- [ ] `validate_pyq.py` & `validate_data.py --check-baseline` = `0` (matches exact 9-finding ledger in `docs/data/validation-exceptions.json`)
- [ ] `build_suggestions.py --check` = `0` (`8/8` `CST209` and `46/46` repo-wide `guides.json` anchors preserved)
- [ ] `build_revision_sheets.py`, `check_platform.py`, `check_site.py --strict --quiet`, `audit_accessibility.py --fail`, `check_tokens.py --strict`, `build_icon_subset.py --check`, `build_data_version.py --check`, `audit_page_weight.py --budget`, `check_root_rewrite.py`, `check_readme_paths.py` = `0`
- [ ] `generate_presence.py` double-pass idempotent across all `84` HTML pages
- [ ] `python3 -m unittest discover -s tests -p 'test_*.py' -v` (`test_discovery.py`, `test_content_depth.py`, `test_suggestions.py`) & `node tests/discovery-dom.cjs` = `0` (`unit-4.html` has no `Next: Unit 5`; `#dijkstras-algorithm` green; `105/105` PYQs routed)
- [ ] `0` raw `CST20x` / `P00x-Qy` leaks; `0` `<iframe>` / `ytimg.com` embeds; clean `git diff` limited to Phase 16 scope
