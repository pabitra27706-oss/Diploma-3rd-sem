# CST209 Unit 4 — Graphs

> **Target file:** `subjects/CST209/units/unit-4.html` (current: `6,512w` → target: **`~6,800–7,500w`**)  
> **Syllabus (`syllabus.json`, PDF p. 12):** **20 contact hours** (of `60h`, `4` credits, L–T–P `3-1-0` — largest official unit in Algorithms)  
> **2023–2026 Exam Weight (`P003–P006` only):** **`93 / 395` marks (`23.5%`, #1 HIGHEST-WEIGHT UNIT IN ALGORITHMS — 100% OF CLUSTERS HIT `4/4` PAPERS!)** · avg **`23.2m/paper`** · **`4/4` papers** · **`29m` MCQ + `64m` 8m-subparts** (`2021–2022` `P001` excluded)  
> **Locked `guides.json` & test anchors (must preserve):** `#mst`, `#shortest-path`, `#shortest-path-1-dijkstra-s-algorithm` (and add `#dijkstras-algorithm` matching `tests/discovery-dom.cjs:365`)  
> **Existing `<section id>`s to preserve (13):** `overview`, `graph-basics`, `dag-topo`, `mst`, `shortest-path`, `formulas`, `definitions`, `comparisons`, `mcqs`, `short-questions`, `long-questions`, `practice`, `revision`  
> **Existing `<h3 id>`s to preserve:** all `8` (`mst-1-prim-s-algorithm`, `mst-2-kruskal-s-algorithm`, `shortest-path-1-dijkstra-s-algorithm`, `shortest-path-2-bellman-ford-algorithm`, `shortest-path-3-floyd-warshall-algorithm`, `comparisons-prim-s-vs-kruskal-s`, `comparisons-dijkstra-vs-bellman-ford-vs-floyd-warshall`, `comparisons-adjacency-matrix-vs-adjacency-list`; add `4` new `<h3 id>`s)

---

## 1. Verbatim Revised-2022 Syllabus Scope (PDF p. 12)
- **Graph Definitions & Representations:** Undirected, directed, weighted, simple, multigraph, complete, connected, path, cycle, tree, spanning tree (`|V| - 1` edges); adjacency matrix & adjacency list; brief BFS/DFS traversal recap.
- **Directed Acyclic Graphs & Ordering:** **DAG** definition, properties, applications, and **Topological Sorting** (Kahn's in-degree & DFS finish-time algorithms).
- **Minimum Spanning Trees (MST):** Cut/cycle intuition, **Prim's Algorithm**, and **Kruskal's Algorithm** (with Disjoint-Set Union-Find).
- **Shortest Path Algorithms:** Single-source — **Dijkstra's Algorithm** (non-negative weights) and **Bellman-Ford Algorithm** (negative weights & cycle detection); All-pairs — **Floyd-Warshall Algorithm** (DP matrix recurrence).

---

## 2. Current Page Audit & Gaps (`subjects/CST209/units/unit-4.html`)
- **Live metrics:** `6,512` words · `7` `<pre>` blocks · `14` `<table>`s · **`0` `<svg>`s** · `8` `<h3 id>`s · `15` MCQs · `12` short Qs · `8` long Qs · `0` YouTube links · `0` raw code leaks.
- **Concept-section word split today:** `#graph-basics` `347w`, `#dag-topo` `351w`, `#mst` `533w`, `#shortest-path` `744w` (`1,975w` concept prose vs **`3,513w` practice bank** — nearly 2:1 inverted!).
- **Specific gaps to fix:**
  1. **Zero SVGs on a Graphs unit (`0`):** Add step-by-step weighted-graph SVGs for Prim's, Kruskal's, Dijkstra's, Bellman-Ford (with negative edge), Floyd-Warshall, and DAG topological sort.
  2. Rebalance ~900w from repetitive short/long questions into `#mst` (`38m`, `4/4`) and `#shortest-path` (`35m`, `4/4`) so every one of the 5 named graph algorithms carries formal CLRS-style pseudocode, a complete step/matrix table, and complexity proof.
  3. **9 Unit 4 `2023–2026` PYQs fail to match** (including all 4 `Shortest paths / Dijkstra` questions `P003-Q23,Q25,Q33`, `P004-Q11`, plus `P003-Q6,Q22`, `P004-Q6,Q8`, `P006-Q24`), and `P004-Q12` (`Graphs / trees`) false-matches `U3#bst`.
  4. **Prev/Next boundary invariant (`tests/discovery-dom.cjs:405–421`):** `unit-4.html`'s footer discovery nav must **never** render `Next: Unit 5`; point learners to CO5 String Matching & Tries via a clearly labelled in-body callout card instead.

---

## 3. 2023–2026 Exam Weight Breakdown & Tier Calibration (`93m`)

| Topic Cluster | Marks | % of U4 | % of Exam | Papers | Tier | Exact 2023–2026 Question IDs (`P003–P006`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Minimum Spanning Trees (MST): Prim's & Kruskal's algorithms** | **38m** | **40.9%** | **9.6%** | **4/4** | **Tier A** | `P003-Q7,Q15,Q24` (3×1m), `P003-Q30a(3m Prim),Q30b(5m Kruskal trace)`; `P004-Q7` (2m), `P004-Q18a(4m Prim algo),Q18b(4m Prim steps + ex)`; `P005-Q10` (2m), `P005-Q21a(2m define MST),Q21b(6m Kruskal trace)`; `P006-Q13` (2m), `P006-Q23b(5m Prim w/ ex)` |
| **Shortest paths: Dijkstra, Bellman-Ford & Floyd-Warshall** | **35m** | **37.6%** | **8.9%** | **4/4** | **Tier A** | `P003-Q23,Q25` (2×1m), `P003-Q33a(5m Dijkstra algo),Q33b(3m ex)`; `P004-Q11` (2m), `P004-Q22a(4m Bellman-Ford algo),Q22b(4m negative-edge trace)`; `P005-Q9` (2m), `P005-Q22b(6m Floyd-Warshall w/ ex)`; `P006-Q14` (2m), `P006-Q24a(5m Dijkstra w/ ex)` |
| **Graph definitions, types, cycles, trees & spanning trees (`V - 1` edges)** | **12m** | 12.9% | 3.0% | **4/4** | **Tier B** | `P003-Q6` (1m cycle); `P004-Q6,Q9,Q12` (3×2m); `P005-Q13` (2m); `P006-Q23a(3m define graph & types w/ ex)` |
| **Directed Acyclic Graphs (DAG) & Topological Sorting** | **8m** | 8.6% | 2.0% | **4/4** | **Tier C** | `P003-Q22` (1m DAG); `P004-Q8` (2m topo requires DAG); `P005-Q22a(2m DAG w/ ex)`; `P006-Q24b(3m note on Topological Sorting)` |

---

## 4. Section-by-Section Weight-Calibrated Blueprint

### 4.1 `#mst` [LOCKED] — Minimum Spanning Trees: Prim's & Kruskal's (Tier A · ~36% prose)
- Spanning tree vs MST (`|E_T| = |V| - 1`, connected, acyclic, minimum edge-weight sum, tie non-uniqueness — `P004-Q6`, `P005-Q21a`) and safe-edge cut intuition.
- **`#mst-1-prim-s-algorithm` (`P003-Q24,Q30a`, `P004-Q7,Q18`, `P005-Q10`, `P006-Q23b`):** `MST-PRIM(G, w, r)` pseudocode (starts from **any** arbitrary vertex `r`), full step-by-step `(u, key[], parent[], MST edge)` table + 6-vertex SVG, `O(V^2)` (array/matrix) vs `O(E log V)` (binary min-heap + adjacency list).
- **`#mst-2-kruskal-s-algorithm` (`P003-Q7,Q30b`, `P005-Q21b`):** `MST-KRUSKAL(G, w)` pseudocode with Union-Find (`MAKE-SET, FIND-SET, UNION`), sorted-edge accept/reject-cycle table + 7-vertex SVG, `O(E log E) = O(E log V)`.
- Preserved 7-row `#comparisons-prim-s-vs-kruskal-s` (dense vs sparse, single growing tree vs merging forest, priority queue vs Union-Find).

### 4.2 `#shortest-path` [LOCKED] — Dijkstra, Bellman-Ford & Floyd-Warshall (Tier A · ~40% prose)
- `INITIALIZE-SINGLE-SOURCE` & edge relaxation `if d[v] > d[u] + w(u,v) then d[v] = d[u] + w(u,v); π[v] = u`.
- **`#shortest-path-1-dijkstra-s-algorithm` (`P003-Q23,Q25,Q33`, `P004-Q11`, `P006-Q24a`):** greedy min-priority-queue pseudocode, `w(u,v) >= 0` requirement + 3-vertex negative-edge failure diagram, full 5-vertex `(S, u, d[], π[])` table, `O(V^2)` vs `O((V + E) log V)`.
- **`#shortest-path-2-bellman-ford-algorithm` (`P004-Q22`):** DP relaxation across `|V| - 1` passes + `|V|`-th pass negative-weight cycle detection, full pseudocode, complete pass-by-pass trace on a 5-vertex directed graph with negative weights, `O(VE)`.
- **`#shortest-path-3-floyd-warshall-algorithm` (`P005-Q22b`):** all-pairs DP recurrence `D^(k)[i][j] = min(D^(k-1)[i][j], D^(k-1)[i][k] + D^(k-1)[k][j])`, 5-line triple-loop pseudocode, complete `D^(0) → D^(1) → D^(2) → D^(3) → D^(4)` 4×4 matrix sequence + `D[i][i] < 0` check, `Θ(V^3)` time, `Θ(V^2)` space.
- Preserved 8-row `#comparisons-dijkstra-vs-bellman-ford-vs-floyd-warshall`.

### 4.3 `#graph-basics` (Tier B · ~13%) & `#dag-topo` (Tier C · ~11%)
- `#graph-basics`: Definitions + mini-examples of undirected, directed, weighted, complete (`V(V-1)/2`), connected, cyclic/acyclic, tree (`V-1` edges, connected acyclic), and spanning tree (`P003-Q6`, `P004-Q6,Q9,Q12`, `P005-Q13`, `P006-Q23a`); adjacency matrix vs list table; concise BFS/DFS `O(V+E)` recap; in-body CO5 note linking to `subjects/CST209/units/unit-5.html` (see [`../unit-5-supplementary/README.md`](../unit-5-supplementary/README.md)) for string/trie study.
- `#dag-topo`: DAG definition + prerequisite/build-system example (`P003-Q22`, `P005-Q22a`); Topological Sort (valid **iff** DAG — `P004-Q8`), Kahn's in-degree queue pseudocode + DFS reverse finish-time note, 6-vertex trace, `O(V + E)` (`P006-Q24b`).

### 4.4 Practice & Revision Bank
- `10` MCQs, `4` short answers, and `5` worked 8m model answers (`Prim + Kruskal`, `Dijkstra`, `Bellman-Ford`, `DAG + Floyd-Warshall`, `Graph types + Topological Sort`).

---

## 5. Diagrams, Worked Traces & Comparison Tables Checklist
- [ ] **Inline SVGs (4):** (1) Prim's vs Kruskal's MST growth on a weighted graph; (2) Dijkstra's 5-vertex SSSP + 3-node negative-weight failure; (3) Bellman-Ford negative-edge directed graph + 4-vertex Floyd-Warshall graph; (4) 6-vertex course-prerequisite DAG + linear topological ordering.
- [ ] **Python-verified traces (6):** Prim (`6` vertices); Kruskal (`7` vertices, Union-Find); Dijkstra (`5` vertices); Bellman-Ford (`5` vertices, `4` passes); Floyd-Warshall (`D^(0)..D^(4)` 4×4); Kahn's Topological Sort (`6` vertices).
- [ ] **Comparison tables (3):** Prim vs Kruskal (7 rows); Dijkstra vs Bellman-Ford vs Floyd-Warshall (8 rows); Adjacency Matrix vs Adjacency List.

---

## 6. Quiz-Bank, Revision-Sheet & Cross-Subject Links
- Link `#practice` to `_quiz-data/CST209/unit-4.json` (`45` items — largest quiz bank in Algorithms) and sync the Unit 4 card in `docs/revision-sheets/CST209.json`; cross-link Data Structures (`CST205`) Unit 4 for full BFS/DFS queue/stack walkthroughs.

---

## 7. YouTube Video Curation Slots (verify live at execution — plain `<a>` only)

| Slot | Topic Focus | Tier & Weight | Target Section | Selection & Verification Rules |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Minimum Spanning Trees: Prim's & Kruskal's Algorithms (with Union-Find) | **Tier A** (`38m`) | `#mst` | Works full weighted-graph examples + `O(E log V)` complexity; verify live |
| **2** | Single-Source Shortest Paths: Dijkstra's & Bellman-Ford Algorithms | **Tier A** (`35m`) | `#shortest-path` | Shows relaxation table, negative-edge trap & negative-cycle check; plain `<a>` |
| **3** | Floyd-Warshall All-Pairs Shortest Path (`D^(k)` Matrices) & DAG Topological Sort | **Tier A/C** (sub) | `#shortest-path` | Clear 4×4 matrix update + Kahn's in-degree ordering; zero embeds |

---

## 8. 2023–2026 PYQ ↔ Unit Anchor Routing Table (Mode A)

Preserve all `8` existing `<h3 id>`s and add `4` new `<h3 id>`s closing all `9` unmatched Unit 4 PYQs plus keeping `tests/discovery-dom.cjs` & `tests/test_discovery.py` (`dijkstra`) green:

| Question ID(s) | Marks | Stored Unit & `topic` | Baseline Status | Target Unit 4 `<h3 id>` & Authored Heading |
| :--- | :---: | :--- | :--- | :--- |
| `P003-Q6`, `P004-Q6,Q9,Q12`, `P005-Q13` | 1–2m | U3/U4 `Graphs / cycles`, `Graphs / spanning trees`, `Graphs / trees` | `P003-Q6`, `P004-Q6` Unmatched; `Q12` hit `U3#bst` | `#graphs-cycles-and-spanning-trees` — *Graphs, Cycles, Trees and Spanning Trees* |
| `P003-Q22`, `P004-Q8`, `P005-Q22a` | 1,2,2m | U3/U4 `Graphs / DAG`, `Graphs / topological sort` | `P003-Q22`, `P004-Q8` Unmatched | `#dag-and-topological-sort` — *Graphs: Directed Acyclic Graph (DAG) and Topological Sort* |
| `P003-Q23,Q25,Q33`, `P004-Q11`, `P006-Q14` | 1–8m | U3/U4 `Shortest paths / Dijkstra`, `Shortest paths` | 4 Dijkstra Qs Unmatched! | `#dijkstras-algorithm` — *Shortest Paths: Dijkstra's Single-Source Algorithm* (alongside preserved `#shortest-path-1-dijkstra-s-algorithm`) |
| `P006-Q24` | 8m | U4 `Shortest paths / topological sort` | Unmatched | `#shortest-paths-and-topological-sort-notes` — *Shortest Paths and Topological Sort Summary* |
