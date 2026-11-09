# Syllabus — 3rd Semester (Revised 2022)

> Readable transcription of [`syllabus-3rd-sem-2022.pdf`](syllabus-3rd-sem-2022.pdf)
> (22 pages). **The PDF is the authority**; this file and
> [`syllabus.json`](syllabus.json) are working aids. Page numbers point at the
> PDF for verification.

**Authority:** West Bengal State Council of Technical & Vocational Education
and Skill Development (Technical Education Division).
**Programmes:** CST, CSE, CSWT, IT — Part-II (3rd Semester), Revised 2022.
**Duration:** 15 weeks · **Maximum marks:** 100 per course (40 internal + 60 ESE).

## Course list (page 2)

| # | Code | Course | L–T–P | Credits |
|---|---|---|---|---|
| 1 | CST201 | Computer Programming | 2–0–0 | 2 |
| 2 | CST203 | Scripting Languages (Python) | 2–0–0 | 2 |
| 3 | CST205 | Data Structures | 2–1–0 | 3 |
| 4 | CST207 | Computer System Organization | 3–1–0 | 4 |
| 5 | CST209 | Algorithms | 3–1–0 | 4 |
| 6 | SI201 | Summer Internship-I (4 weeks, after 2nd sem) | — | 1 |
| 7 | COPC211 / CST211 | Computer Programming Lab | 0–0–2 | 1 |
| 8 | CST213 | Scripting Languages Lab | 0–0–4 | 2 |
| 9 | CST215 | Data Structures Lab | 0–0–4 | 2 |

Total credits: 21. (The course table writes the programming lab as COPC211;
its own course page, 14, says CST211.)

## CST201 — Computer Programming in C (page 3)

Credits 2 · L–T–P 2–0–0 · 30 contact hours · Prerequisite: ability to develop
simple logic/flow · Category: PC.

| Unit | Title | Hours | Module |
|---|---|---|---|
| 1 | Basics of C | 5 | A |
| 2 | Decision Control and Looping Statements | 5 | A |
| 3 | Subscripted Variables / Arrays | 7 | B |
| 4 | User defined functions | 7 | C |
| 5 | Pointers in C | 6 | C |

- **U1** History of C; structured-program advantages; source/header/object/
  binary files; C characteristics; character set, tokens, constants, variables,
  keywords, data types; all operator classes (arithmetic, logical, assignment,
  relational, unary, binary, increment/decrement, conditional, ternary,
  bitwise, special, comma, sizeof, postfix, prefix); precedence and
  associativity; type conversion, typecasting; formatted input/output.
- **U2** if / if-else / else-if ladder / nested if-else; switch case; goto and
  its drawbacks; while, do-while, for; entry- vs exit-controlled loops; break
  and continue; nested loops.
- **U3** Arrays: advantages, accessing elements; 1-D, 2-D, multidimensional
  (idea only); character arrays and strings; string declaration and
  initialisation; strlen(), strcpy(), strcat(), strcmp(); substring from left,
  right, middle; replacement; concatenation.
- **U4** Function definition and advantages; prototype, signature, parameter
  types; scope and lifetime; storage classes (auto, extern, static, register);
  call by value/reference; return values; recursion and the memory stack; types
  of recursion; recursion vs iteration.
- **U5** Pointer concepts vs memory variables; declaring and accessing;
  constant pointer vs pointer to constant; null and generic pointers; pointer
  arithmetic; passing arguments by pointer; pointers and arrays; array name vs
  pointer; pointers and strings; array of pointers; function pointers; pointer
  to pointer; malloc/calloc/realloc, free; pointer to structure.

## CST203 — Scripting Languages (Python) (page 5)

Credits 2 · L–T–P 2–0–0 · 30 contact hours · Prerequisite: NIL.

| Unit | Title | Hours | Module |
|---|---|---|---|
| 1 | Introduction, Variables and Data Types | 7 | A |
| 2 | Control Structures | 5 | A |
| 3 | Functions, Modules and Packages | 6 | B |
| 4 | File I/O, Text Processing, Regular Expressions | 6 | C |
| 5 | Frameworks | 6 | C |

- **U1** History, features, PATH setup, installation, working with Python; basic
  syntax; variables; numeric types (int, long int, float, complex/imaginary);
  strings and string operations, Unicode literals, conversion, formatting,
  methods; date and time; tuples, lists (slicing, split, join, copying),
  dictionaries, arrays; operator classes including membership and identity;
  precedence; coding blocks.
- **U2** if/else/elif; for; while; continue, break, else, pass; programs.
- **U3** Defining and calling functions; pass by object reference; parameters;
  arbitrary arguments; optional and named arguments; tuple arguments; scope and
  binding (local, nonlocal, global, class); modules; importing own and external
  modules; packages.
- **U4** input/raw_input; print; file modes and permissions; read(),
  readline(), readlines(); write(), writelines(); open, close, tell, seek,
  flush, fileno, isatty, next; output redirection; re.match, re.search,
  re.findall, re.finditer; re.compile, re.sub, re.subn, re.split.
- **U5** MVC; Django rationale; URLs and templates; sending and displaying data
  and object lists; filter chains; base templates; static files; Django forms,
  validation, model forms, error messages and widgets.

## CST205 — Data Structures (page 7)

Credits 3 · L–T–P 2–1–0 · 45 contact hours · Prerequisite: basic computer
systems knowledge. **Four units.**

| Unit | Title | Hours | Module |
|---|---|---|---|
| 1 | Introduction to Data Structures | 3 | A |
| 2 | Linear Data Structures | 12 | A |
| 3 | Linked Lists | 15 | B |
| 4 | Non-Linear Data Structures | 15 | C |

- **U1** Basic terminology; classification of data structures; operations.
- **U2** Stacks (array representation, operations, infix→postfix, postfix
  evaluation); queues (array representation, operations, de-queue, circular
  queue, round-robin application); recursion (GCD, Tower of Hanoi).
- **U3** Singly linked list (memory representation; insert/delete at first,
  between, end); circular singly; doubly; circular doubly; linked-list
  representation of stack and queue.
- **U4** Trees: terminology, binary trees, array and linked representation,
  insertion/deletion, traversals, types, B-tree, AVL; graphs: terminology,
  representation (set, linked, matrix), BFS and DFS.

## CST207 — Computer System Organization (page 10)

Credits 4 · L–T–P 3–1–0 · 60 contact hours · Prerequisite: basic computer
systems and digital gates.

| Unit | Title | Hours | Module |
|---|---|---|---|
| 1 | Structure of Computers; Register Transfer and Micro Operations | 6 | A |
| 2 | Micro Programmed Control; Computer Arithmetic; Pipelining | 20 | A |
| 3 | Introduction to Microprocessor Architecture | 10 | B |
| 4 | Assembly Language Programming | 9 | B |
| 5 | Memory and Digital Interfacing | 15 | C |

- **U1** Functional units; Von Neumann architecture; bus structures; basic
  operational concepts; fixed/floating-point data representation; error
  detecting codes; register transfer, memory transfers; arithmetic, logic and
  shift micro-operations; arithmetic logic shift unit.
- **U2** Control memory, address sequencing, control-unit design; addition,
  subtraction, multiplication and division algorithms; floating-point
  arithmetic; arithmetic, instruction and RISC pipelines; vector processing and
  array processors.
- **U3** Instruction set; architecture design from a programmer's perspective;
  Intel 8086 block diagram, pin functions, registers, segmentation, interrupts,
  addressing modes, instructions.
- **U4** Simple assembly programs; logical, branch and call instructions;
  sorting, arithmetic expressions, string manipulation; assembler directives,
  procedures, macros.
- **U5** Addressing and address decoding; RAM/ROM/EPROM interfacing;
  programmable peripheral interface; cache mapping and hit ratio; virtual
  memory (logical/physical address, TLB).

## CST209 — Algorithms (page 12)

Credits 4 · L–T–P 3–1–0 · 60 contact hours · Prerequisite: NIL.
**Four units.**

| Unit | Title | Hours | Module |
|---|---|---|---|
| 1 | Fundamentals of Algorithms | 6 | A |
| 2 | Sorting | 16 | A |
| 3 | Searching | 18 | B |
| 4 | Graphs and Graph Algorithms | 20 | C |

- **U1** Algorithm definitions and characteristics; data abstraction; sets and
  multisets; stacks and queues; asymptotic notations (O, Ω, Θ); time and space
  complexity; best/average/worst analysis; divide and conquer, greedy, dynamic
  programming.
- **U2** Sorting problem; bubble, selection, insertion, shell, merge, quick,
  heap sort; complexity of each; linear-time sorting: count, bucket, radix.
- **U3** Linear and binary search with complexity; binary search trees;
  balanced search trees and height balancing; insertion/deletion/search and
  comparative study; hashing, hash functions, collisions and resolution; symbol
  tables.
- **U4** Graph definitions, paths, cycles, spanning trees, DAGs; topological
  sorting; Prim's and Kruskal's MST; Dijkstra, Bellman-Ford, Floyd-Warshall.

## Labs and internship

- **CST211 Computer Programming Lab in C** (page 14) — 2 h/week, 30 h, internal
  60 + external 40. Areas: environment familiarisation; formatted I/O; decision
  and branching; loops (GCD/LCM, series, patterns, primes, Armstrong); arrays
  and strings; functions and parameter passing; pointers and dynamic memory
  (including stack/queue).
- **CST213 Scripting Languages Lab** (page 16) — 4 h/week, internal 60 +
  external 40. Areas: Python installation; syntax; data types; conditionals and
  loops; functions and modules; file processing; regular expressions; a simple
  Django web application.
- **CST215 Data Structures Lab** (page 19) — 4 h/week, 60 h, internal 40 +
  external 40. Areas: array operations; stacks (push/pop, infix→postfix,
  evaluation); recursion (factorial, Fibonacci, Ackermann, Hanoi); queues;
  linked lists; trees and BST; three sorting and two searching techniques;
  graph assignments.
- **SI201 Summer Internship-I** (page 22) — 1 credit, 4 weeks after the second
  semester; inter/intra-institutional training, simulation programmes, or
  another department of the same polytechnic.

## End-semester examination pattern (page 14)

| Question type | Set | To answer | Marks |
|---|---|---|---|
| MCQ, 1 mark | 15 | 10 | 10 |
| Fill in the blanks, 1 mark | 15 | 10 | 10 |
| Short answer, 1 mark | 15 | 10 | 10 |
| Subjective, 2 marks | 10 | 6 | 12 |
| Subjective, 6 marks (3 from each of 3 modules) | 9 | 3 | 18 |
| **Total** | | | **60** |

Internal assessment: 40 marks (attendance 10, viva/presentation/assignment/quiz
10, continuous internal assessment 20).

## How this repository uses the syllabus

1. **Authority for coverage.** Unit numbers, titles, hours and modules come
   from here, not from the content files. Where content disagrees, the syllabus
   wins and the content is a bug.
2. **Unit-count guard.** CST205 and CST209 have four units each; any record
   tagged Unit 5 in those subjects is out of syllabus.
3. **Order guard.** CST201 U3 is Arrays and U4 is Functions — the quiz bank
   currently reverses them (see `docs/AUDIT.md`).
4. **Paper-pattern reference.** The ESE table is the target shape for the
   mock-paper mode; current paper data records different full marks, so
   reconcile first.
5. **Coverage map.** `scripts/validate_syllabus.py` joins this file to
   `_data/` and `_quiz-data/` and reports what is covered, missing, or
   mis-tagged.

## Copyright and provenance

The PDF is published course material from the Council, included here unmodified
for study reference. It is **not** covered by this repository's licence; do not
re-license it, and do not present this transcription as the official text.
