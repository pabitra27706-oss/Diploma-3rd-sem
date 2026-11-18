# CST209 Unit 5 (Supplementary) — String Matching & Tries (CO5)

> **Target file:** `subjects/CST209/units/unit-5.html` (current: `6,477w` → target: **`~4,600–5,200w` [refocused on the `42m` examined CO5 core]**)  
> **Syllabus authority (`docs/syllabus/syllabus-3rd-sem-2022.pdf` p. 12):** Declared by Course Outcome **CO5** (*"Learn various string processing algorithms"*), while the printed Revised-2022 PDF omits a Unit 5 topic table. Keep `SYLLABUS_UNITS.CST209 = 4` (and `unit-4.html` Prev/Next nav strictly `1..4`); connect existing `unit-5.html` via `SUPPLEMENTARY_UNITS = { CST209: [5] }` in `focusQuestionTopic()`.  
> **2023–2026 Exam Weight (`P003–P006` only):** **`42 / 395` marks (`10.6%` of Algorithms — tested in ALL `4/4` papers, with `36m` of Group B questions!)** · avg **`10.5m/paper`** · **`6m` MCQ + `36m` 8m-subparts** (`2021–2022` `P001` excluded)  
> **Locked `guides.json` anchors:** `0` (guides stay strictly on official Units 1–4)  
> **Existing `<section id>`s to preserve (18):** `overview`, `string-sort`, `tries`, `naive-search`, `rabin-karp`, `kmp`, `horspool`, `boyer-moore`, `regex`, `compression`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve:** all `6` (`string-sort-lsd-radix-sort-for-strings`, `string-sort-msd-radix-sort-for-strings`, `compression-1-huffman-coding`, `compression-2-run-length-encoding-rle`, `comparisons-all-substring-search-algorithms`, `comparisons-kmp-vs-boyer-moore-vs-rabin-karp`; add `5` CO5 routing `<h3 id>`s)

---

## 1. Honest Syllabus Boundary & Validation Invariants
- **Why this page exists and stays supplementary:** PDF p. 12 lists 4 official units (`6 + 16 + 18 + 20 = 60h`) yet prints CO5 on string processing, and WBSCTE asked string/trie questions in **every single 2023–2026 paper (`4/4`, `42m`)**.
- **Strict boundary rule:** Devote ~82% of concept prose to the **4 examined CO5 topics** (`#rabin-karp` `15m`, `#kmp` `11m`, `#naive-search` `8m`, `#tries` `8m`). Keep all **5 unexamined `0m` sections** (`#string-sort`, `#horspool`, `#boyer-moore`, `#regex`, `#compression` + their `4` existing `<h3 id>`s) as concise ~80–120w background stubs so zero `section-notes.js` keys break, explicitly noted as unexamined in `2023–2026`.
- **Gate invariants preserved untouched (Mode A):** `SYLLABUS_UNITS.CST209 === 4`; `CST209-P003-Q34` (`unit`) and `_quiz-data/CST209/unit-5.json` (`bank-unit`) stay recorded in `docs/data/validation-exceptions.json`; `syllabusNote` strings on `P004-Q15,Q23`, `P005-Q23,Q24`, `P006-Q22` remain untouched; `tests/discovery-dom.cjs:405–421` (`unit-4.html` never renders `Next: Unit 5`) stays green.

---

## 2. Current Page Audit & Defects (`subjects/CST209/units/unit-5.html`)
- **Live metrics:** `6,477` words · `8` `<pre>` blocks · `16` `<table>`s · **`0` `<svg>`s** · `18` `<section id>`s · `6` `<h3 id>`s · `12` MCQs · `10` short Qs · `7` long Qs · `0` YouTube links · `0` raw code leaks.
- **Inverted word split today:** The 5 **`0m`** sections consume **`1,418w`** (`#string-sort` `300w`, `#horspool` `252w`, `#boyer-moore` `282w`, `#regex` `195w`, `#compression` `389w`) — **more than the 4 `42m` examined sections combined (`1,023w`:** `#rabin-karp` `282w`, `#kmp` `289w`, `#tries` `262w`, `#naive-search` `190w`)!
- **Discovery disconnect:** `0 / 8` CO5 questions route here today — `P003-Q34` fails as `out-of-unit` (`unit: 5`), while `P004-Q15,Q23`, `P005-Q11,Q15,Q23,Q24`, and `P006-Q22` are completely unmatched because `focusQuestionTopic()` only checks Units `1..4`.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`42m`)

| Topic Cluster | Marks | % of U5 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Rabin-Karp rolling-hash string matching** | **15m** | **35.7%** | 3.8% | **4/4** | **Tier B (CO5)** | `P003-Q34a(6m Rabin-Karp algo) + Q34b(1m RK vs KMP)`; `P004-Q15` (2m); `P005-Q11` (2m rolling hash / spurious hit); `P006-Q22b(4m Rabin-Karp)` |
| **Knuth-Morris-Pratt (KMP) algorithm, LPS table & RK vs KMP** | **11m** | **26.2%** | 2.8% | 2/4 | **Tier B (CO5)** | `P003-Q34b(1m RK vs KMP)`; `P005-Q15` (2m), `P005-Q24a(3m explain KMP),Q24b(5m KMP + LPS on ababcabcabababd & ababd)` |
| **Naive (brute-force) string matching & binary shift trace** | **8m** | 19.0% | 2.0% | 1/4 | **Tier C (CO5)** | `P004-Q23a(4m Naive pseudocode),Q23b(4m trace P=101110 in T=1110101011101100)` |
| **Tries (prefix trees): representation, string storage & construction** | **8m** | 19.0% | 2.0% | 1/4 | **Tier C (CO5)** | `P005-Q23a(3m what are tries & string storage),Q23b(5m build trie for {bat, ball, doll, dork, do, dorm, send, sense})` |
| **Legacy sections: string sort, Horspool, Boyer-Moore, regex, compression** | **0m** | 0.0% | 0.0% | 0/4 | **Stub (`0m`)** | _Preserve `<section id>`s & `4` `<h3 id>`s; condense to ~80–120w background stubs_ |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#overview` — Transparent CO5 Disclosure & Notation (~6% prose)
- Plain-English syllabus banner (zero raw `CST209` or `P00x-Qy` strings): notes that Algorithms has 4 official syllabus units while Course Outcome 5 covers string processing regularly tested in semester exams; defines text `T[0..n-1]`, pattern `P[0..m-1]`, alphabet `Σ` (`|Σ| = d`), and valid shift `0 <= s <= n - m`.

### 4.2 `#rabin-karp` — Rolling Hash & Spurious Hits (Tier B/CO5 · `4/4` papers · ~26% prose)
- Horner preprocessing `O(m)`, **`O(1)` rolling-hash recurrence** `t_{s+1} = (d·(t_s - T[s]·h) + T[s+m]) mod q` with `h = d^(m-1) mod q` and prime `q`.
- Formal `RABIN-KARP-MATCHER(T, P, d, q)` pseudocode (`P003-Q34a`, `P006-Q22b`), explicit **spurious hit** definition (`p == t_s` yet `P[0..m-1] ≠ T[s..s+m-1]` — `P005-Q11`), full worked `mod 11` window table illustrating both a spurious hit and a verified hit, expected `O(n + m)` vs worst-case `O((n - m + 1)m)` (`P004-Q15`), and plagiarism/multi-pattern use.

### 4.3 `#kmp` — Prefix Function (LPS) & Linear-Time Matching (Tier B/CO5 · ~26% prose)
- Proper prefix vs proper suffix, **LPS / `π[0..m-1]`** definition, formal `COMPUTE-PREFIX-FUNCTION(P)` (`Θ(m)`) and `KMP-MATCHER(T, P)` (`Θ(n)`, guaranteed worst-case **`Θ(n + m)`**, text pointer `i` never retreats — `P005-Q15,Q24a`).
- **Exact Worked Exam Trace (`P005-Q24b`):** LPS construction for `P = "ababd"` → **`[0, 0, 1, 2, 0]`**, followed by complete step-by-step `(i, j, T[i] vs P[j], action)` trace on `T = "ababcabcabababd"` (`n = 15`) matching at 0-based index **`10`** (`T[10..14] = "ababd"`).
- Dedicated **7-row Naive vs Rabin-Karp vs KMP Table** in `#comparisons` (`P003-Q34b`).

### 4.4 `#naive-search` (Tier C/CO5 · ~14%) & `#tries` (Tier C/CO5 · ~18%)
- **`#naive-search`:** `NAIVE-STRING-MATCHER(T, P)` pseudocode (`P004-Q23a`), `0` preprocessing, `O(n)` best / `Θ((n - m + 1)m)` worst, and the **exact 11-shift alignment table (`s = 0..10`)** for `T = "1110101011101100"` (`n = 16`), `P = "101110"` (`m = 6`) finding the match at **`s = 6`** (`P004-Q23b`).
- **`#tries`:** Node layout (character child links + `isEndOfWord` flag), `INSERT`/`SEARCH`/`STARTS-WITH` pseudocode in `O(L)` time, autocomplete/spell-check/IP-routing uses (`P005-Q23a`), and full SVG + insertion trace for **`{"bat", "ball", "doll", "dork", "do", "dorm", "send", "sense"}`** (`P005-Q23b`), highlighting `o*` on `"do"` as an internal end-of-word node shared by `"doll"`, `"dork"`, and `"dorm"`.

### 4.5 Legacy `0m` Stubs (`#string-sort`, `#horspool`, `#boyer-moore`, `#regex`, `#compression`) & Practice (~10% prose)
- Trim each of the 5 legacy sections to ~80–120w preserving all IDs; focused practice bank of `8` MCQs, `4` short answers, and `4` full 8m model answers (`P003-Q34`, `P004-Q23`, `P005-Q23`, `P005-Q24`).

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (2):** (1) Rabin-Karp sliding hash window + KMP LPS fallback diagram on `"ababd"`; (2) Complete Trie for `{bat, ball, doll, dork, do, dorm, send, sense}` with all 8 end-of-word markers double-circled.
- [ ] **Python-verified traces (4):** Rabin-Karp `mod 11` trace; KMP LPS `[0,0,1,2,0]` + 15-char match at index `10`; Naive 11-shift binary trace matching at `s = 6`; 8-word Trie node-count & prefix sharing.
- [ ] **Comparison tables (2):** Naive vs Rabin-Karp vs KMP (7 rows); Trie vs Hash Table vs Balanced BST.

---

## 6. Quiz-Bank, Hub & `coverage.html` Cross-Links
- Link `#practice` to `_quiz-data/CST209/unit-5.json` (`35` items, retaining its transparent source-review flag in `validation-exceptions.json`); verify plain-English CO5 supplementary labelling on `subjects/CST209/index.html` and root `coverage.html` (`#subject-algorithms`, `#out-of-syllabus`).

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Rabin-Karp String Matching Algorithm (Rolling Hash, Mod `q` & Spurious Hits) | **Tier B/CO5** (`15m`) | `#rabin-karp` | Derives Horner rolling update & works numeric spurious-hit example; verify live |
| **2** | Naive vs KMP String Matching (Building LPS Array & Full `O(n+m)` Trace) | **Tier B/C/CO5** (`19m`) | `#kmp` | Clear LPS construction + non-backtracking pointer trace; plain `<a>` |
| **3** | Trie (Prefix Tree): Structure, Insert/Search & Multi-Word Construction | **Tier C/CO5** (`8m`) | `#tries` | Emphasizes `isEndOfWord` on prefix words like `"do"`/`"doll"`; zero embeds |

---

## 8. 2023–2026 CO5 PYQ ↔ Unit 5 Anchor Routing Table (Mode A + `SUPPLEMENTARY_UNITS`)

With `SUPPLEMENTARY_UNITS = { CST209: [5] }` added solely to `focusQuestionTopic()` in `assets/js/unit-discovery.js`, all `8 / 8` CO5 questions route cleanly to `unit-5.html`:

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 5 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q34`, `P004-Q15` | 8m, 2m | U5 `String matching` (exception); U4 `String matching` | `out-of-unit` + Unmatched | `#string-matching-overview` — *String Matching Algorithms Overview* |
| `P004-Q23` | 8m | U4 `Naive string matching` | Unmatched | `#naive-string-matching-algorithm` — *Naive String Matching Algorithm and Shift Trace* |
| `P005-Q11`, `P006-Q22` | 2m, 8m | U4 `String matching / Rabin-Karp`; U4 `Hashing / string matching` | Both Unmatched | `#rabin-karp-string-matching` — *Rabin-Karp Rolling Hashing and String Matching* |
| `P005-Q15,Q24` | 2m, 8m | U4 `KMP / string matching` | Both Unmatched | `#kmp-string-matching-and-lps` — *KMP (Knuth-Morris-Pratt) String Matching and LPS Table* |
| `P005-Q23` | 8m | U4 `Tries` | Unmatched | `#tries-prefix-trees` — *Tries (Prefix Trees) and String Storage* |
