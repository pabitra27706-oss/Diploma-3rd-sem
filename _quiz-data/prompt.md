Here is the updated prompt with all modifications integrated:

---

# PROMPT FOR JSON DATA CREATION — Quiz Question Papers

---

You are converting **Previous Year Question (PYQ) papers** into structured quiz JSON files for a Diploma 3rd Semester Web App.

---

## Your Task

Given:
1. A PYQ paper with questions
2. Subject code and paper metadata

Output:
1. Quiz JSON file(s) split by unit
2. Every question properly formatted with all required fields

---

## Rules

```
✅ One file per unit
✅ One reply = One unit JSON file (complete, no splitting)
✅ Map every question to correct unit using syllabus
✅ Assign proper topic based on syllabus unit content
✅ Determine difficulty intelligently
✅ Generate relevant tags
✅ For MCQ: Short 1-2 line explanation only
✅ For non-MCQ: NO explanation/modelAnswer field
✅ Never skip any question from the paper
✅ Never guess — use syllabus to decide unit/topic
✅ After all PYQ questions, add EXTRA questions for syllabus gaps
✅ Mark EXTRA questions with source: "EXTRA"
✅ Mark PYQ questions with source: "PYQ"
✅ Before generating each unit, do a silent audit of all PYQs
✅ Wait for "Next" before generating next unit file
```

---

## Output File Structure

```
_quiz-data/
  {SUBJECT}/
    unit-1.json
    unit-2.json
    unit-3.json
    unit-4.json
    unit-5.json  (if subject has 5 units)
```

---

## Reply Format Per Unit

```
For each unit, output in this exact order:

1. File header comment showing file path
2. Complete JSON (one single code block)
3. Audit table (PYQ verification)
4. Unit summary (PYQ count, EXTRA count, Total)
5. EXTRA justification (why each extra was added)

Then wait for "Next" before proceeding to next unit.
```

---

## Question JSON Structure You Must Follow

### Root Structure

```json
{
  "subject": "CST209",
  "unit": 1,
  "unitTitle": "Fundamentals + Complexity",
  "totalQuestions": 15,
  "questions": []
}
```

### MCQ Question Format

```json
{
  "id": "CST209-U1-Q001",
  "type": "mcq",
  "topic": "Algorithm Characteristics",
  "difficulty": "easy",
  "marks": 1,
  "year": 2024,
  "source": "PYQ",
  "tags": ["algorithm", "characteristics", "fundamentals"],
  "question": "Which of the following is NOT a characteristic of an algorithm?",
  "options": {
    "A": "Finiteness",
    "B": "Definiteness",
    "C": "Ambiguity",
    "D": "Input"
  },
  "correct": "C",
  "explanation": "Ambiguity is NOT a characteristic. Every algorithm step must be clearly defined."
}
```

### Non-MCQ Question Format

```json
{
  "id": "CST209-U2-Q005",
  "type": "theory",
  "topic": "Selection Sort",
  "difficulty": "medium",
  "marks": 8,
  "year": 2024,
  "source": "PYQ",
  "tags": ["selection-sort", "sorting", "algorithm"],
  "question": "a) Explain Selection sort using suitable example. (4)\nb) Compare bubble sort, selection sort and insertion sort. (4)"
}
```

**IMPORTANT:** No `explanation` or `modelAnswer` field for non-MCQ questions.

---

## Field Generation Rules

### `id`
```
Format: {SUBJECT}-U{UNIT}-Q{NUMBER}
Example: CST209-U1-Q001

Numbering:
- Start from Q001 in each unit file
- Increment sequentially
- Pad with zeros: Q001, Q002, ... Q010, Q011
```

### `type`
```
Identify from question pattern:

"mcq"       → Multiple choice with options A/B/C/D
"theory"    → Explain, describe, define, discuss, what is
"numerical" → Calculate, trace, solve, show steps, draw diagram
"program"   → Write algorithm, write code, pseudocode
"short"     → Very brief questions (1-2 mark)

If marks = 1 and has options → mcq
If marks = 1-2 and no options → short
If marks = 3-4 → theory or numerical (based on verb)
If marks = 6-8 → theory or program or numerical
```

### `topic`
```
Extract from question and map to syllabus topic
Keep concise: 2-5 words
Match terminology from syllabus

Examples:
"Algorithm Characteristics"
"Asymptotic Notations"
"Selection Sort"
"Binary Search"
"Dijkstra's Algorithm"
"String Matching"
```

### `difficulty`
```
Assign based on:

easy →
  - Direct recall
  - Define, what is
  - MCQ with obvious answer
  - 1-2 marks
  - Basic concepts

medium →
  - Explain with example
  - Trace algorithm
  - Comparison questions
  - 4-6 marks
  - Application level

hard →
  - Complex trace
  - Design algorithm
  - Multiple step problems
  - 8+ marks
  - Advanced concepts
```

### `marks`
```
Copy from question paper exactly
If not mentioned:
  MCQ → 1
  Fill in the blank → 1
  Short answer → 2
  Subjective → 6 or 8
```

### `year`
```
Extract from paper metadata
Integer only
Example: 2024

For EXTRA questions:
  Use the most recent paper year of that subject
  Example: if latest paper is 2024, use 2024
```

### `source`
```
"PYQ"   → Question directly from a previous year paper
"EXTRA" → Question added to fill syllabus gaps not covered by PYQs
```

### `tags`
```
Generate 2-6 relevant lowercase tags
Include:
  - Main topic keyword
  - Algorithm name if applicable
  - Concept category
  - Related terms

Examples:
["algorithm", "characteristics", "fundamentals"]
["bubble-sort", "sorting", "time-complexity"]
["dijkstra", "shortest-path", "graph", "greedy"]
["binary-search", "searching", "divide-conquer"]
```

### `question`
```
Copy exact question text
Preserve sub-parts (a), (b), (c)
Use \n between sub-parts if question has multiple parts
Include marks mentioned in brackets if present
Do not modify or summarize
```

### `options` (MCQ only)
```json
{
  "A": "option text",
  "B": "option text",
  "C": "option text",
  "D": "option text"
}
```

### `correct` (MCQ only)
```
Single letter: "A" or "B" or "C" or "D"
```

### `explanation` (MCQ only)
```
Write SHORT 1-2 line explanation only
State why correct answer is correct
Keep it minimal and crisp
No long explanations

Examples:
"LIFO means Last In First Out, which is the stack principle."
"Binary search has O(log n) time complexity in worst case."
"Ambiguity is NOT a characteristic. Every step must be clearly defined."
```

### `modelAnswer` / `explanation` (Non-MCQ)
```
DO NOT INCLUDE THIS FIELD

Non-MCQ questions will be exported to AI for evaluation
No need to store answers in JSON
Keeps file size small
```

---

## EXTRA Questions Rules

```
After adding all PYQ questions for a unit:

1. Review the syllabus topics for that unit
2. Identify topics NOT covered by any PYQ question
3. Add questions for those missing topics
4. Mark them with source: "EXTRA"
5. Use year of most recent paper for that subject
6. Continue sequential numbering from last PYQ question

How many EXTRA to add:
  - Add as many as needed to cover all syllabus topics
  - Minimum 2-3 per unit if gaps exist
  - No artificial limit — quality over quantity
  - Do NOT add EXTRA if PYQs already cover the topic well

What makes a good EXTRA question:
  - Directly from syllabus topic list
  - Important concept for exams
  - Not already covered by any PYQ
  - Mix of MCQ, theory, program types
```

---

## Processing Steps

When I give you a paper:

### Step 1: Extract Metadata
```
Identify:
- Subject code
- Paper code
- Year
- Month
```

### Step 2: Audit All Papers First (Silent)
```
Before generating any JSON:
- Read ALL questions from ALL papers given
- Group by unit using syllabus
- Note which syllabus topics are covered by PYQs
- Note which syllabus topics have NO PYQ coverage
- Plan EXTRA questions for gaps
```

### Step 3: Generate Unit 1 JSON Only
```
Output:
1. File path header
2. Complete unit-1.json
3. Audit table
4. Summary
5. EXTRA justification

Then STOP and wait for "Next"
```

### Step 4: On "Next" → Generate Unit 2 JSON
```
Same format as Step 3
Wait for "Next" again
```

### Step 5: Continue Until All Units Done
```
Each "Next" triggers one unit file
Never output two unit files in one reply
```

### Step 6: Final Summary After Last Unit
```
Show complete subject summary table:
| Unit | Title | PYQ | EXTRA | Total |
```

---

## Categorize Questions by Unit
```
Read each question
Match topic to syllabus
Assign to correct unit
Group all unit 1 questions, unit 2 questions, etc.
```

## Generate Questions Array
```
For each question:
1. Generate ID
2. Determine type
3. Extract topic from syllabus
4. Assign difficulty
5. Note marks
6. Add metadata (year, source)
7. Generate tags
8. Format question text with marks in brackets
9. For MCQ: extract options, identify correct, write SHORT explanation (1-2 lines)
10. For non-MCQ: NO explanation/modelAnswer field
```

---

## Validate Before Output
```
Check:
- All questions from paper are included
- No duplicate IDs
- All required fields present
- Marks sum makes sense
- Topics match syllabus
- MCQ explanations are SHORT
- Non-MCQ have NO explanation/modelAnswer
- EXTRA questions cover syllabus gaps
- source field is "PYQ" or "EXTRA" correctly set
- totalQuestions count matches actual question count
```

---

## Special Cases

### MCQ with "Any ten" instruction
```
Include ALL MCQs in the JSON
User can filter/select during quiz
Don't skip any
```

### Multi-part questions
```
Keep as ONE question
Example: "2. a) ... b) ... c) ..."

In JSON:
question: "a) Explain algorithm characteristics (3)\nb) What is asymptotic notation (2)\nc) Define Big-O (3)"
marks: 8  (sum of all parts)
type: "theory"
NO modelAnswer field
```

### Questions spanning multiple units
```
Assign to the PRIMARY unit based on main concept
If question asks "Compare bubble sort and merge sort":
  → Both are sorting → Unit 2
  
If question asks "Use Prim's algorithm on this graph":
  → Graph algorithm → Unit 4
```

### Fill in the blanks
```
type: "short"
marks: 1
Include "________" in question text
NO modelAnswer field
```

### Diagrams in questions
```
If question says "draw diagram" or "construct tree":
type: "numerical"
Keep question text as-is
NO modelAnswer field
```

### Duplicate questions across papers
```
If same question appears in multiple papers:
  - Include it ONCE only
  - Use the earliest year
  - Note in audit table as duplicate
```

---

## Quality Checklist

Before giving output, verify:

```
✅ Every question has all required fields
✅ IDs are sequential and properly formatted
✅ Units are correctly assigned based on syllabus
✅ Topics match syllabus terminology exactly
✅ Difficulty makes sense (not all easy, not all hard)
✅ Tags are relevant and lowercase
✅ MCQ explanations are SHORT (1-2 lines maximum)
✅ Non-MCQ questions have NO explanation/modelAnswer field
✅ Marks distribution is reasonable
✅ No questions skipped from original paper
✅ totalQuestions count is accurate
✅ File names follow pattern: unit-1.json, unit-2.json, etc.
✅ JSON is valid and properly formatted
✅ source field is "PYQ" or "EXTRA" for every question
✅ EXTRA questions cover all remaining syllabus gaps
✅ One reply contains exactly one unit JSON file
✅ Output stops after each unit and waits for "Next"
```

---

## Complete Syllabus Reference

### CST201 — Computer Programming in C (2 credits, 30 hours)

**Unit 1: Basics of C (5 Hours)**
- History of C
- Advantages of Structured Program
- Files used in C (source, header, object, binary executable)
- Characteristics of C
- C character set
- Tokens, Constants, Variables, Keywords
- Data types used in C
- C operators (arithmetic, logical, assignment, relational, unary, binary, increment/decrement, conditional, ternary, bitwise, special, comma, sizeof, postfix, prefix)
- Operator precedence, Associativity of operators
- Type conversion, Typecasting
- Formatted input, Formatted output

**Unit 2: Decision Control and Looping Statements (5 Hours)**
- Decision making and branching statements: if statement (if, if-else, else-if ladder, nested if-else)
- Switch case statement and applications
- Conditional and unconditional 'goto' statement and drawbacks
- Iterative/Loop statements: Entry controlled & exit controlled loop structure & differences
- while, do-while, and for loop structure
- Break and continue statement & their uses
- Nested loop structure & applications

**Unit 3: User Defined Functions (10 Hours)**
- Definition of functions
- Advantages of functions in modular approach problem solving
- Prototype declaration
- Scope and lifetime of variables
- Storage Class (Auto, Extern, Static, Register)
- Defining functions
- Function signature
- Passing parameter types
- Function call (call by value, call by reference)
- Return values
- Recursion and use of memory stack
- Types of recursion
- Recursion vs Iteration
- Applications

**Unit 4: Arrays and Strings (10 Hours)**
- Advantages of subscript variables/arrays
- Accessing array elements
- Declaration and initialization of: One dimensional arrays, Two dimensional arrays, Multidimensional arrays (idea only), Character arrays and Strings
- String handling functions from standard library: strlen(), strcpy(), strcat(), strcmp()
- Applications: Extract substring from left, right, middle of a string; Replacement of string characters; Concatenation of two strings

**Unit 5: Pointers in C (15 Hours)**
- Understanding pointers
- Difference between memory variables and pointer variables
- Declaring and accessing pointers
- Constant pointers and pointer to a constant
- Null Pointers, Generic Pointers
- Pointers arithmetic and expressions
- Passing arguments to function using pointers
- Pointers and arrays
- Passing an array to a function
- Array name and Pointer
- Pointers and Strings
- Array of pointers
- Function pointers
- Pointer to a pointer
- Dynamic memory allocation: malloc(), calloc(), realloc(), Uses of free()
- Pointer to a structure

---

### CST203 — Scripting Languages (Python) (2 credits, 30 hours)

**Unit 1: Introduction to Python (5 Hours)**
- History and Features of Python
- Installing Python and Setting up Environment
- Python Interpreter and Interactive Shell
- Writing and Executing Python Scripts
- Comments and Indentation
- Python Keywords and Identifiers
- Variables and Data Types: Numbers (int, float, complex), Strings, Lists, Tuples, Dictionaries, Sets, Boolean
- Type Conversion and Typecasting
- Input and Output: print(), input()
- Understanding Coding Blocks

**Unit 2: Control Structures (5 Hours)**
- Conditional blocks using if, else and elif
- For loops and iterations
- While loops
- Loop manipulation: continue, break and else; pass statement
- Programming using conditional and loops block
- Modify loops: break and continue

**Unit 3: Functions, Modules and Packages (6 Hours)**
- Organizing codes using functions
- Defining Functions and Calling Functions
- Pass by object reference
- Parameters: Arbitrary arguments, Optional and Named Arguments
- Passing arguments from a tuple
- Variable Scope and Binding: Local Variables, Nonlocal Variables, Global Variables, Class scope
- Organizing projects into modules: Grouping Code with Modules
- Importing own module as well as external modules
- Understanding Packages: Grouping Modules into Packages

**Unit 4: File I/O, Text Processing, Regular Expressions (6 Hours)**
- Accessing Keyboard Input: raw_input and input
- Printing to the Screen: print
- File modes and permissions
- Read functions: read(), readline(), readlines()
- Write functions: write(), writelines()
- Other file operations: open(), close(), tell(), seek(), flush(), fileno(), isatty(), next()
- Redirecting output streams to files
- Programming using file operations
- Powerful pattern matching and searching: re.match(), re.search(), re.findall(), re.finditer()
- Creating and Using Regular Expression Objects: import re, re.compile(), re.sub(), re.subn(), re.split()
- Power of pattern searching using regex

**Unit 5: Frameworks (Django) (6 Hours)**
- Frameworks - The MVC framework
- Django: What is Django and why should you use Django?
- Creating URL, Templates
- Send data to a template, Display data in a template, Display object lists in a template
- Handle chains with filters in Django
- Use URLs effectively
- Create base templates in order to extend other templates
- Insert static files in our templates
- Django Form: Create an HTML form, Handle the data sent by a form, Create a Django form
- Validate and manipulate data sent from a Django form
- Create forms based on models
- Customize error messages and usage of widget

---

### CST205 — Data Structures (2 credits, 45 hours)

**Unit 1: Introduction and Stacks (11 Hours)**
- Basic Terminology
- Classification of Data Structures
- Operations on Data Structures
- Stacks: Introduction to Stacks, Array Representation of Stacks, Operations on a Stack
- Applications of Stacks: Infix-to-Postfix Transformation, Evaluating Postfix Expressions

**Unit 2: Queues, Recursion and Linked Lists (15 Hours)**
- Queues: Introduction to Queues, Array Representation of Queues, Operations on a Queue
- Types of Queues: De-Queue, Circular Queue
- Applications of Queues: Round Robin Algorithm
- Recursion: GCD, Tower of Hanoi Problem
- Singly Linked List: Representation in Memory, Operations: Add new node (first, in-between, end position), Delete (first, in-between, end position)
- Circular Linked Lists: Operations on circular Single Linked
- Doubly Linked Lists: Operations on Double Linked
- Circular Doubly Linked Lists: Operations on circular Double Linked
- Linked List Representation: Operations of Stack, Operations of Queue

**Unit 3: Trees and Graphs (12 Hours)**
- Trees: Basic Terminologies, Definition and Concepts of Binary Trees
- Representations of a Binary Tree using Arrays and Linked Lists
- Operations on a Binary Tree: Insertion, Deletion
- Traversals: Inorder, Preorder, Postorder
- Types of Binary Trees, B-Tree, AVL Tree
- Graphs: Graph Terminologies
- Representation of Graphs: Set, Linked, Matrix
- Graph Traversals: BFS (Breadth First Search), DFS (Depth First Search)

**Unit 4: BST, Hashing and Shortest Path (7 Hours)**
- Binary Search Trees: Algorithms, Searching Time & space complexity
- Balanced Search Trees: Significance and advantage of height balancing
- Insertion, Deletion and Searching Algorithms
- Different types of Balanced Search Trees and their comparative study
- Hashing: Hash Tables, Hash functions, Collision and Collision resolving techniques
- Symbol Tables
- Shortest Path algorithms: Dijkstra's algorithm, Bellman-Ford Algorithm, Floyd-Warshall all pairs shortest path algorithm
- Minimum Spanning Tree algorithms: Prim's Algorithm, Kruskal's Algorithm
- Topological Sorting

---

### CST207 — Computer System Organization (4 credits, 60 hours)

**Unit 1: Structure of Computers and Register Transfer (6 Hours)**
- Structure of Computers: Computer Functional units, Von-Neumann architecture, Bus structures, Basic Operational Concepts
- Data representation (Fixed and Floating point)
- Error detecting codes
- Register Transfer and Micro Operations: Register transfer, Memory transfers
- Arithmetic micro-operations, Logic micro-operations, Shift micro-operations
- Arithmetic logic shift unit

**Unit 2: Micro Programmed Control, Computer Arithmetic and Pipelining (20 Hours)**
- Micro Programmed Control: Control memory, Address sequencing, Design of control unit
- Computer Arithmetic: Addition and Subtraction, Multiplication and Division algorithms, Floating-point arithmetic operation
- Pipelining: Arithmetic Pipeline, Instruction Pipeline, RISC Pipeline
- Vector Processing, Array Processors

**Unit 3: Introduction to Microprocessor Architecture (10 Hours)**
- Instruction Set
- Architecture design principles from programmer's perspective
- Example microprocessor (Intel 8086): Block diagram, Pin functions, Register structure, Segmentation, Interrupt mechanism, Addressing modes, Instructions

**Unit 4: Assembly Language Programming (9 Hours)**
- Simple programs
- Assembly language programs involving: Logical instructions, Branch and call instructions, Sorting, Evaluation of arithmetic expressions, String manipulation
- Assembler directives
- Procedures and macros

**Unit 5: Memory and Digital Interfacing (15 Hours)**
- Addressing and address decoding
- Interfacing RAM, ROM, EPROM
- Programmable peripheral interface
- Cache Memory: Mapping, Hit ratio
- Virtual Memory Technique: Logical address, Physical address, TLB (Translation Lookaside Buffer)

---

### CST209 — Algorithms (4 credits, 60 hours)

**Unit 1: Fundamentals of Algorithms (6 Hours)**
- Definitions and Characteristics of Algorithm
- Examples
- Data Abstraction
- Sets, Multisets
- Stacks, Queues
- Asymptotic Notations with Examples: Order Notation (Big-O), Omega Notation (Ω), Theta Notation (Θ)
- Time and Space Complexity
- Best, Average and Worst-case analysis of algorithms
- Programming Models Concepts: Divide and Conquer, Greedy Methods, Dynamic Programming

**Unit 2: Sorting (16 Hours)**
- The sorting problem
- Comparison-based Sorting: Bubble sort, Selection sort, Insertion sort, Shell sort, Merge sort, Quicksort, Heapsort
- Computation of Best, Average and Worst-case Time complexity of all sorting algorithms
- Linear Time Sorting: Count Sort, Bucket Sort, Radix Sort

**Unit 3: Searching (16 Hours)**
- Linear Search Algorithm
- Binary Search Algorithm
- Computation of Best, Average and Worst-case Time complexity of Linear and Binary Search
- Binary Search Trees: Algorithms, Searching Time & space complexity
- Balanced Search Trees: Significance and advantage of height balancing, Insertion, Deletion and Searching Algorithms
- Different types of Balanced Search Trees and their comparative study
- Hashing: Hash Tables, Hash functions, Collision and Collision resolving techniques
- Symbol Tables

**Unit 4: Graphs (16 Hours)**
- Graph Directed and Undirected graph - Examples
- Paths, Cycles, Spanning trees - Examples
- Directed Acyclic Graphs - Examples
- Topological Sorting
- Minimum Spanning Tree algorithms: Prim's Algorithm with Examples, Kruskal's Algorithm with Examples
- Shortest Path algorithms: Dijkstra's algorithm, Bellman-Ford Algorithm, Floyd-Warshall all pairs shortest path algorithm

**Unit 5: Strings (6 Hours)**
- String Sort
- Tries
- Search a Substring within a string
- String Matching Algorithms and their complexity analysis: Simple/Naive String Matching Algorithm, Rabin-Karp Algorithm, Knuth-Morris-Pratt Algorithm, Horspool String Matching Algorithm, Boyer-Moore String Matching Algorithm
- Regular Expressions
- Elementary Data compression

---

## Output Format Per Unit

```
# File: _quiz-data/{SUBJECT}/unit-{N}.json

{complete JSON in single code block}

---

**Unit N Audit — PYQ Verification:**

| Q# | Question | Paper Source | Type |
|---|---|---|---|
| Q001 | ... | P1 Dec 2024 | ✅ PYQ |
| Q002 | ... | — | ⭐ EXTRA |

---

**Unit N Summary:**

| Category | Count |
|---|---|
| PYQ Questions | X |
| EXTRA Questions | Y |
| Total | Z |

**EXTRA Justification:**
- QX: reason
- QY: reason

---

Ready for Unit {N+1}? Type Next
```

---

## Important Notes

- Always prefer accuracy over speed
- If unsure about unit/topic, analyze syllabus carefully
- MCQ explanations must be SHORT — 1-2 lines only
- Non-MCQ questions get NO explanation/modelAnswer — AI will evaluate
- Use proper technical terminology from syllabus
- Be consistent within a subject
- Keep JSON files as small as possible
- Quality > Quantity
- **One reply = One unit file. Always wait for "Next"**
- **Always add EXTRA questions for uncovered syllabus topics**
- **source field must be "PYQ" or "EXTRA" — never blank**
- **Duplicate questions across papers: include once, use earliest year**

---

END OF PROMPT