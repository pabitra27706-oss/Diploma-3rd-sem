# Phase 18 Authoring Standard — PYQ Answer Depth, Problem Bulleting & Comparison Boxes

This document is the binding authoring specification for **Phase 18 (`docs/phases/18-pyq-answer-expansion/`)**. Every PYQ `answer` edited in `_data/CST{201,203,205,207,209}/*.json` must obey every rule below.

---

## 1. The Iron Rule: 100% Direct Agent Authoring (No Python Answer Scripts)

1. **Read before writing:** Open the target paper JSON with `read_file` in small slices (`10–15` questions at a time) alongside the relevant unit study page (`subjects/CST20x/units/unit-*.html`) so definitions, formulas, notation (e.g., 0-based vs 1-based indexing, `front`/`rear` conventions, Booth register names `A, Q, Q_-1, M`, Lomuto vs Hoare partition), and complexity bounds match the Study Hub's unit notes.
2. **Edit directly with `edit_file`:** Write every expanded `answer` by hand using `edit_file`.
3. **Never script prose:** Do **not** write or run Python/Node/shell scripts, template formatters, dictionary mappers, or regex bulk-replacers to populate or expand `answer` strings.
4. **Verify every program & calculation live:**
   - **C (`CST201` & `CST205`):** Compile every standalone program in a temporary file outside `_data/` with `gcc -std=c99 -Wall -Wextra -Werror` and run it on the sample input before transcribing its exact output into `edit_file`, then remove the temporary file.
   - **Python (`CST203`):** Execute every code snippet with `python3` to verify exact output, edge cases, and exception types.
   - **CSO (`CST207`) & Algorithms (`CST209`):** Verify binary/hex/2's-complement arithmetic, IEEE-754 bit fields, page-replacement fault counts, postfix stacks, and graph edge weights step by step before writing the trace table.
5. **Preserve source truth & uncertified status:**
   - Keep `"answerStatus": "model-answer"` unchanged (`0/924` certified).
   - Never alter `question`, `options`, `correct`, `marks`, `markSplit`, `subparts`, `unit`, `topic`, `sourcePage`, `sourceNote`, or `syllabusNote`.
   - When a question has a recorded `sourceNote` or `syllabusNote` (e.g., ambiguous 0-based vs 1-based array index in `CST205-P005-Q12/Q16`, undefined behaviour in `CST201-P002-Q51`, printed bitwise code under a logical-operator prompt in `CST203-P006-Q20`, or missing printed ambiguity), state **both** the textbook/classroom evaluation and the technical note clearly inside the answer.
   - Never print raw course codes (`CST201`–`CST209`) or internal question IDs (`CST201-P005-Q16`) inside `answer` prose; use display subject names (`C`, `Python`, `DS`, `CSO`, `Algorithms`).

---

## 2. Mark-Proportional Depth & Structure Matrix

Every answer's length and structure must match the marks printed on the paper so a student knows how much to write in a real 3-hour WBSCTE examination:

| Question Category | Printed Marks | Target Word Range | Mandatory Structural Elements |
| :--- | :---: | :---: | :--- |
| **1-Mark Objective MCQ** (`2021–2023` Group A) | `1m` | **`45–80 words`** | `**Correct Answer: <Key>) <Option>**` + **2–3 `- ` bullets**: (1) core rule/calculation proving the key, (2) why the main distractor(s) fail. |
| **2-Mark Objective MCQ with `1+1` Split** (`2024–2026` Group A) | `2m` (`1+1`) | **`65–120 words`** | `**Correct Option:** **<Key>) <Option>** *(1 mark)*` + `**Explanation *(1 mark)*:**` with **2–4 `- **Lead-in:**` bullets** (including expression evaluation / dry-run step + distractor elimination) ready for loose-script writing. |
| **1-Mark Short Answer** (`2021–2023`) | `1m` | **`35–65 words`** | Crisp 1-sentence formal definition + **2 `- ` key-point bullets** (or 1 syntax/formula/example snippet). Zero `**Model answer:**` prefix. |
| **2-Mark Short Answer / Output Trace** (`2021–2023`) | `2m` | **`65–135 words`** | Exact definition or `**Output:**` header + **3–4 `- **Lead-in:**` bullets** + syntax/mini-code/step-by-step trace (or a 3–4 row `[!COMPARE]` box if comparison is asked). |
| **Subpart within a Long Question** | `2m` subpart | **`65–120 words`** | Definition/rule + **2–3 `- **Lead-in:**` bullets** + 1 concise example/formula (or 3–4 row `[!COMPARE]` box). |
| **Subpart within a Long Question** | `3m` subpart | **`95–160 words`** | Definition + **3–4 `- **Lead-in:**` bullets** + worked example / algorithm / 4–5 row `[!COMPARE]` box. |
| **Subpart within a Long Question** | `4m` subpart | **`125–210 words`** | Structured explanation + **4–5 `- **Lead-in:**` bullets** + complete runnable code / trace table / ASCII diagram / 5–6 row `[!COMPARE]` box. |
| **Subpart within a Long Question** | `5–6m` subpart | **`160–280 words`** | Complete treatment: concept summary + algorithm/architecture diagram or full runnable program + step-by-step dry-run table/trace + complexity/key-takeaway callout (or 6–8 row `[!COMPARE]` box). |
| **Whole 6-Mark Long Question** (`2022` Group C) | `6m` | **`220–360 words`** | Mark-split callout (if multi-part) + subpart headings + bullets + required comparison box / code / trace / diagram. |
| **Whole 8-Mark Long Question** (`2023–2026` Group B) | `8m` | **`260–480 words`** | Exact `[!MARKS]` mark-split callout matching `q.subparts` + bold subpart headings (`**a) ... [3 marks]**`) + structured bullets + required comparison boxes, runnable programs, trace tables, and diagrams. |
| **Whole 10-Mark Long Question** (`2021` Group C) | `10m` | **`320–550 words`** | Exact `[!MARKS]` mark-split callout + bold subpart headings + structured bullets + complete runnable code / full trace tables / comparison boxes / ASCII diagrams. |

*(Word ranges are exam-calibrated guidelines, not mechanical padding targets: never pad with repetitive filler, and never truncate a required Booth table, sorting pass trace, or compilable C program just to stay short.)*

---

## 3. Problem Bulleting Rules ("Structured Exam Bulleting")

1. **Always use hyphen-space (`- `) for unordered bullets** and `1. `, `2. `, `3. ` for ordered steps/algorithms. **Never use `* ` for bullets** (prevents C pointer/comment lexer collisions and keeps Markdown canonical across all 28 files).
2. **Bold lead-in stem on every conceptual bullet:** Every conceptual bullet point must start with a **bold 2–5 word label** followed by a colon so examiners and students can scan marking points instantly:
   - Good:
     ```markdown
     - **Compile-Time Evaluation:** `sizeof` is evaluated by the compiler at compile time (except for C99 variable-length arrays), so `sizeof(i++)` does **not** increment `i`.
     - **Return Type (`size_t`):** Yields the storage size in bytes as an unsigned integer of type `size_t` (printed with `%zu`).
     ```
   - Bad:
     ```markdown
     `sizeof(int)` gives the implementation's byte count for `int`, commonly 4.
     ```
3. **Maximum 3 sentences per paragraph:** Any prose paragraph longer than 3 lines must be broken into structured `- **Lead-in:**` bullets, numbered steps, or a table.
4. **Exact Subpart Headings & Mark Tags:** Multi-part questions (`subparts` array present) must open with a `[!MARKS]` line whose numbers **sum to `q.marks` and match `q.subparts[i].marks` 1-to-1**, followed by bold subpart headings matching the paper's labels (`a)`, `b)`, or `i)`, `ii)`):
   ```markdown
   > [!MARKS] Mark Distribution — Total 8 marks: a) 3 marks + b) 5 marks

   **a) Differences Between `while` and `do-while` Loop [3 Marks]**
   ...
   **b) C Program to Find the Sum of Digits of an Integer [5 Marks]**
   ```

---

## 4. Comparison Box Standard (`[!COMPARE]`)

Whenever a question or subpart asks to **differentiate, distinguish, compare, contrast, state differences, `A` vs `B`**, or **compare 3+ schemes** (e.g., `while` vs `do-while`, `==` vs `=`, `malloc()` vs `calloc()`, Structure vs Union, Call by Value vs Call by Reference, List vs Tuple vs Dict, Module vs Package, Array vs Linked List, Linear vs Circular Queue, Stack vs Queue, Recursion vs Iteration, Direct vs Associative vs Set-Associative Cache, Write-Through vs Write-Back, RISC vs CISC, Fixed vs Floating Point, Bubble vs Selection vs Insertion Sort, Linear vs Binary Search, Prim's vs Kruskal's, Chaining vs Open Addressing):

1. **Wrap the comparison table inside a `[!COMPARE]` Comparison Box** (parsed by the shared rich-content renderer into `<div class="comparison-box">` with header badge + horizontally scrollable `.table-wrapper`):
   ```markdown
   > [!COMPARE] Structure vs Union in C
   > | Parameter | `struct` (Structure) | `union` (Union) |
   > |---|---|---|
   > | **Keyword** | Declared using the `struct` keyword. | Declared using the `union` keyword. |
   > | **Memory Allocation** | Allocates **separate** memory for every member; total size $\ge$ sum of member sizes (plus alignment padding). | Allocates **one shared** memory block equal to the size of its **largest** member. |
   > | **Active Members** | **All** members store independent values simultaneously. | **Only one** member holds a valid value at any given instant; writing a new member overwrites the shared bytes. |
   > | **Member Addresses** | Each member has a distinct offset/address from the base. | Every member starts at the **same base address** (offset `0`). |
   > | **Initialization** | Multiple or all members can be initialized together: `struct S s = {10, 'A'};`. | Only the **first** (or one designated) member is initialized at a time. |
   > | **Typical Use Case** | Grouping heterogeneous attributes of an entity (e.g., a `Student` record with roll, name, marks). | Memory-saving variant records, hardware register overlays, or type inspection. |
   ```
2. **Mandatory Parameter Column:** Every comparison table **must** have a left-hand **`Parameter` / `Basis` / `Feature`** column. Two-column parameter-less tables (`| Array | Linked List |`) are **not permitted** because rows lose alignment of what attribute is being compared.
3. **Pipe-Escape Rule:** Never place a raw unescaped `|` inside a table cell. Write `\|` (or spell `OR` outside backticks alongside escaped `` `a \| b` ``); `audit_pyq_answers.py` verifies that every row in every Markdown table has the exact same cell count as its header row.
4. **Follow with a 2–4 line concrete code/example contrast** when the subpart carries `>= 3` marks.

---

## 5. Callout Box Syntax (`[!KEY]`, `[!FORMULA]`, `[!TRAP]`, `[!MARKS]`)

Use clean GitHub-alert-style blockquotes (gracefully readable even as plain Markdown in Quiz TXT/MD export, and rendered as semantic themed callout cards in PYQ, Practice, Print, Quiz Review, and Cards):

```markdown
> [!MARKS] Mark Distribution — Total 8 marks: a) 3 marks + b) 5 marks

> [!FORMULA] Row-Major Address of `A[i][j]` in an `M × N` Matrix
> `Address(A[i][j]) = Base(A) + w × [ (i - L_r) × N + (j - L_c) ]`
> - `Base(A)`: Starting byte address (`3500`) · `w`: Element size in bytes (`4`) · `N`: Number of columns (`3`) · `L_r, L_c`: Lower row/column index bounds (`0` for 0-based, `1` for 1-based).

> [!TRAP] Exam Pitfall — Operand Pop Order in Postfix `-`, `/`, and `^`
> When evaluating `op` on a stack, the **first** `pop()` yields the **right** operand (`op2`) and the **second** `pop()` yields the **left** operand (`op1`). Always compute `op1 - op2` and `op1 / op2`, never `op2 - op1`.

> [!KEY] Complexity Summary — Quick Sort
> - **Best & Average Time:** `O(n log n)` (balanced pivot splits) · **Worst Time:** `O(n²)` (sorted/reverse-sorted input with extreme pivot) · **Auxiliary Space:** `O(log n)` average recursion stack (`O(n)` worst case) · **Stability:** Not stable (in standard in-place partition).
```

---

## 6. Before-and-After Gold-Standard Exemplars

### Exemplar A — 2-Mark `1+1` MCQ (`CST201-P005-Q10`)

**Before (`33 words`):**
> **Correct answer: D) *P = P + 10.**
> `*P` is an integer lvalue, while `P + 10` is a pointer; assigning a pointer to an integer without a cast is invalid. C is valid pointer arithmetic.

**After (`98 words`):**
```markdown
**Correct Option:** **D) `*P = P + 10`** *(1 mark)*

**Explanation *(1 mark)*:**
- **Type Mismatch in Option D:** Since `P` is an `int *` pointer, dereferencing `*P` produces an `int` lvalue (the integer stored at address `P`), whereas `P + 10` performs pointer arithmetic and yields an address of type `int *` (`10 * sizeof(int)` bytes ahead). Assigning a pointer (`int *`) to an `int` variable without an explicit cast violates C type checking.
- **Why Options A, B, and C Are Valid:**
  - `x = x + *P` and `y = *P + *Q` validly add dereferenced `int` values into `int` variables.
  - `P = Q + 10` validly stores an `int *` offset address into another `int *` pointer `P`.
```

### Exemplar B — 8-Mark Multi-Part Comparison + Program (`CST201-P005-Q18`, `markSplit: "3+5"`)

**Before (`52 words`, fragment without `#include`/`main`, zero comparison table, zero trace):**
> **a)** `while` tests before each iteration (may run zero times); `do-while` tests after each iteration (runs at least once).
> **b)** `int n, s = 0; scanf("%d", &n); ...`

**After (`~310 words`, complete & `gcc`-verified):**
```markdown
> [!MARKS] Mark Distribution — Total 8 marks: a) 3 marks (comparison) + b) 5 marks (program + dry run)

**a) Difference Between `while` and `do-while` Loops [3 Marks]**

> [!COMPARE] `while` Loop vs `do-while` Loop in C
> | Parameter | `while` Loop | `do-while` Loop |
> |---|---|---|
> | **Loop Category** | **Entry-controlled** (pre-test) loop. | **Exit-controlled** (post-test) loop. |
> | **Condition Evaluation** | Tested **before** executing the loop body on every pass. | Tested **after** executing the loop body on every pass. |
> | **Minimum Iterations** | **0 times** if the condition is initially false (`0`). | **At least 1 time**, even when the condition is initially false. |
> | **Syntax & Semicolon** | `while (condition) { ... }` — **no** semicolon after `)`. | `do { ... } while (condition);` — **mandatory** semicolon after `while (...)`. |
> | **Typical Use Case** | Sentinel/counter loops where zero iterations must be safe (e.g., reading until `EOF`). | Menu-driven interactive prompts or input validation that must run once first. |

**b) C Program to Calculate the Sum of Digits of an Integer [5 Marks]**

- **Core Logic:** Convert negative input to its magnitude (`n = -n`), then repeatedly extract the last digit via `n % 10`, add it to `sum`, and strip that digit via integer division `n /= 10` until `n` becomes `0`.

```c
#include <stdio.h>

int main(void) {
    int n, original, sum = 0;

    printf("Enter an integer: ");
    if (scanf("%d", &n) != 1) {
        return 1;
    }

    original = n;
    if (n < 0) {
        n = -n;   /* handle negative integers cleanly */
    }

    while (n > 0) {
        sum += n % 10;   /* add rightmost digit */
        n /= 10;         /* remove rightmost digit */
    }

    printf("Sum of digits of %d = %d\n", original, sum);
    return 0;
}
```

**Sample Run & Dry-Run Trace (`n = 4729`):**

| Pass | `n` (before) | `n % 10` (digit) | `sum` (updated) | `n / 10` (next `n`) |
|---|---|---|---|---|
| 1 | `4729` | `9` | `0 + 9 = 9` | `472` |
| 2 | `472` | `2` | `9 + 2 = 11` | `47` |
| 3 | `47` | `7` | `11 + 7 = 18` | `4` |
| 4 | `4` | `4` | `18 + 4 = 22` | `0` *(loop stops)* |

- **Output:** `Sum of digits of 4729 = 22`
```
