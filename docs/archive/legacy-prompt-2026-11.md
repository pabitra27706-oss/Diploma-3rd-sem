Got it.

```
1. Replace old basic JSON with new paper registry format → YES
2. 10-day practice map → Full section in MD → YES
3. Subject unit maps → Fully included in MD → YES

Generating complete updated MD file now.
One full reply with everything merged.
```

---

# Diploma 3rd Semester Web App - Complete Project Skeleton & Discussion Summary

---

## Project Overview

This is a **Progressive Web App (PWA)** for West Bengal State Council Diploma 3rd Semester (Computer Science & Technology stream). The app provides study materials, practice questions, previous year questions (PYQs), quizzes, and a revision roadmap.

---

## Core Philosophy & Design Decisions

### 1. **Self-Contained Pages**
```
Each page owns its functionality
HTML + CSS + JS together
No complex dependencies
Easy to build across multiple chats
```

### 2. **Template-Based Development**
```
Build foundation once in Chat 1
Copy template structure for all new pages
Ensures consistency without repetition
```

### 3. **Unified Data Structure**
```
One JSON file per subject per paper (year + month)
Same question used in multiple contexts:
- Filter by year      → PYQ
- Filter by day       → Practice
- Filter by unit      → Unit Quiz
- Filter by difficulty → General Quiz

One source of truth, multiple uses
Paper codes are permanent and never renamed
```

### 4. **Multi-Chat Development Strategy**
```
Chat 1  → Foundation + Templates
Chat 2  → Subject CST201 + CST201 data JSONs
Chat 3  → Subject CST203 + CST203 data JSONs
Chat 4  → Subject CST205 + CST205 data JSONs
Chat 5  → Subject CST207 + CST207 data JSONs
Chat 6  → Subject CST209 + CST209 data JSONs
Chat 7  → PYQ System
Chat 8  → Practice System
Chat 9  → Quiz System
Chat 10 → Roadmap + Bookmarks + Suggestions + Info pages
Chat 11 → Real question data entry (fill all JSONs properly)
```

### 5. **No Emoji - All SVG Icons**
```
All icons in one sprite sheet: assets/icons/sprite.svg
Usage: <svg class="icon"><use href="/assets/icons/sprite.svg#home"></use></svg>
Consistent, scalable, theme-friendly
```

### 6. **Common Unit Styles**
```
Each subject has:
- units/common.css  → Shared styles for all units
- units/common.js   → Shared functionality for all units
- units/unit-X.html → Unit-specific content with inline styles
```

---

## Complete Project Skeleton

```
Diploma-3rd-sem/
│
├── 📄 index.html                           ← Main dashboard/homepage
├── 📄 manifest.json                        ← PWA manifest file
├── 📄 sw.js                                ← Service Worker for offline support
├── 📄 offline.html                         ← Offline fallback page
├── 📄 README.md                            ← Project documentation
│
│
├── 📁 _templates/                          ← REUSABLE TEMPLATES (build once, copy everywhere)
│   ├── 📄 base-structure.html              ← HTML skeleton for all pages
│   ├── 📄 variables.css                    ← CSS variables to copy into every CSS file
│   ├── 📄 theme-toggle.js                  ← Theme toggle script snippet
│   └── 📄 README.md                        ← How to use templates
│
│
├── 📁 assets/                              ← Static assets
│   ├── 📁 icons/
│   │   └── 📄 sprite.svg                   ← All SVG icons in one sprite sheet
│   ├── 📁 images/
│   │   └── 📁 questions/                   ← Question diagram images
│   │       └── 📄 {QUESTION_ID}.png        ← Named by question ID
│   └── 📁 pwa/
│       ├── 📄 icon-72x72.png
│       ├── 📄 icon-96x96.png
│       ├── 📄 icon-144x144.png
│       ├── 📄 icon-192x192.png
│       ├── 📄 icon-384x384.png
│       └── 📄 icon-512x512.png
│
│
├── 📁 _data/                               ← ALL QUESTION DATA
│   │
│   ├── 📄 subjects.json                    ← Master index listing all subjects
│   │
│   ├── 📁 CST201/                          ← C Programming
│   │   ├── 📄 meta.json                    ← Subject metadata
│   │   ├── 📄 registry.json               ← Paper code registry for CST201
│   │   ├── 📄 CST201-P001-2021-03.json
│   │   ├── 📄 CST201-P002-2022-06.json
│   │   ├── 📄 CST201-P003-2023-03.json
│   │   ├── 📄 CST201-P004-2024-01.json
│   │   └── 📄 CST201-P005-2024-12.json
│   │
│   ├── 📁 CST203/                          ← Python/Scripting Languages
│   │   ├── 📄 meta.json
│   │   ├── 📄 registry.json
│   │   ├── 📄 CST203-P001-YYYY-MM.json
│   │   └── 📄 ...
│   │
│   ├── 📁 CST205/                          ← Data Structures
│   │   ├── 📄 meta.json
│   │   ├── 📄 registry.json
│   │   ├── 📄 CST205-P001-YYYY-MM.json
│   │   └── 📄 ...
│   │
│   ├── 📁 CST207/                          ← Computer System Organization
│   │   ├── 📄 meta.json
│   │   ├── 📄 registry.json
│   │   ├── 📄 CST207-P001-YYYY-MM.json
│   │   └── 📄 ...
│   │
│   └── 📁 CST209/                          ← Algorithms
│       ├── 📄 meta.json
│       ├── 📄 registry.json
│       ├── 📄 CST209-P001-YYYY-MM.json
│       └── 📄 ...
│
│
├── 📁 subjects/                            ← ALL 5 SUBJECTS
│   │
│   ├── 📁 CST201/                          ← Computer Programming in C
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css
│   │   │   ├── 📄 common.js
│   │   │   ├── 📄 unit-1.html
│   │   │   ├── 📄 unit-2.html
│   │   │   ├── 📄 unit-3.html
│   │   │   ├── 📄 unit-4.html
│   │   │   └── 📄 unit-5.html
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   ├── 📁 CST203/                          ← Scripting Languages (Python)
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css
│   │   │   ├── 📄 common.js
│   │   │   ├── 📄 unit-1.html
│   │   │   ├── 📄 unit-2.html
│   │   │   ├── 📄 unit-3.html
│   │   │   ├── 📄 unit-4.html
│   │   │   └── 📄 unit-5.html
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   ├── 📁 CST205/                          ← Data Structures
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css
│   │   │   ├── 📄 common.js
│   │   │   ├── 📄 unit-1.html
│   │   │   ├── 📄 unit-2.html
│   │   │   ├── 📄 unit-3.html
│   │   │   └── 📄 unit-4.html             ← CST205 has only 4 units
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   ├── 📁 CST207/                          ← Computer System Organization
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css
│   │   │   ├── 📄 common.js
│   │   │   ├── 📄 unit-1.html
│   │   │   ├── 📄 unit-2.html
│   │   │   ├── 📄 unit-3.html
│   │   │   ├── 📄 unit-4.html
│   │   │   └── 📄 unit-5.html
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   └── 📁 CST209/                          ← Algorithms
│       ├── 📄 index.html
│       ├── 📄 index.css
│       ├── 📄 index.js
│       ├── 📁 units/
│       │   ├── 📄 common.css
│       │   ├── 📄 common.js
│       │   ├── 📄 unit-1.html
│       │   ├── 📄 unit-2.html
│       │   ├── 📄 unit-3.html
│       │   ├── 📄 unit-4.html
│       │   └── 📄 unit-5.html
│       └── 📁 resources/
│           ├── 📄 formula-sheet.html
│           ├── 📄 formula-sheet.css
│           └── 📄 formula-sheet.js
│
│
├── 📁 pyq/
│   ├── 📄 index.html
│   ├── 📄 index.css
│   ├── 📄 index.js
│   ├── 📄 viewer.html
│   ├── 📄 viewer.css
│   └── 📄 viewer.js
│
│
├── 📁 practice/
│   ├── 📄 index.html
│   ├── 📄 index.css
│   ├── 📄 index.js
│   ├── 📄 session.html
│   ├── 📄 session.css
│   └── 📄 session.js
│
│
├── 📁 quiz/
│   ├── 📄 index.html
│   ├── 📄 index.css
│   ├── 📄 index.js
│   ├── 📄 play.html
│   ├── 📄 play.css
│   ├── 📄 play.js
│   ├── 📄 result.html
│   ├── 📄 result.css
│   └── 📄 result.js
│
│
├── 📁 roadmap/
│   ├── 📄 index.html
│   ├── 📄 index.css
│   └── 📄 index.js
│
│
├── 📁 bookmarks/
│   ├── 📄 index.html
│   ├── 📄 index.css
│   └── 📄 index.js
│
│
├── 📁 suggestions/
│   ├── 📄 index.html
│   ├── 📄 index.css
│   ├── 📄 index.js
│   └── 📁 subjects/
│       ├── 📁 CST201/
│       │   └── 📄 tips.html
│       ├── 📁 CST203/
│       │   └── 📄 tips.html
│       ├── 📁 CST205/
│       │   └── 📄 tips.html
│       ├── 📁 CST207/
│       │   └── 📄 tips.html
│       └── 📁 CST209/
│           └── 📄 tips.html
│
│
├── 📁 info/
│   ├── 📄 about.html
│   ├── 📄 about.css
│   ├── 📄 usage-guide.html
│   ├── 📄 usage-guide.css
│   ├── 📄 contact.html
│   ├── 📄 contact.css
│   ├── 📄 credits.html
│   ├── 📄 credits.css
│   └── 📄 shared.js                        ← One shared JS for all info pages
│
│
└── 📁 _dev/
    ├── 📄 README.md
    ├── 📄 chat-progress.md
    ├── 📄 structure-notes.md
    ├── 📄 syllabus.pdf
    └── 📄 todo.txt
```

---

## The 5 Subjects Based on Actual Syllabus

```
CST201 → Computer Programming in C (2 credits)
         Unit 1: Basics of C
         Unit 2: Decision Control & Looping
         Unit 3: User Defined Functions
         Unit 4: Arrays & Strings
         Unit 5: Pointers in C

CST203 → Scripting Languages - Python (2 credits)
         Unit 1: Variables & Data Types
         Unit 2: Control Structures
         Unit 3: Functions, Modules & Packages
         Unit 4: File I/O & Regular Expressions
         Unit 5: Frameworks (Django)

CST205 → Data Structures (2 credits)
         Unit 1: Introduction + Stacks
         Unit 2: Queues + Recursion + Linked Lists
         Unit 3: Trees + Graphs + BFS + DFS
         Unit 4: BST + Hashing + Shortest Path + MST

CST207 → Computer System Organization (4 credits)
         Unit 1: Structure of Computers + Data Representation
         Unit 2: Control Unit + Pipelines
         Unit 3: Microprocessor Architecture (8086)
         Unit 4: Assembly Language Programming
         Unit 5: Memory & Digital Interfacing

CST209 → Algorithms (4 credits)
         Unit 1: Fundamentals + Complexity
         Unit 2: Sorting Algorithms
         Unit 3: Searching + BST + Hashing
         Unit 4: Graph Algorithms
         Unit 5: String Algorithms
```

---

## Question Data System

This section defines how all question data is created, named, stored, and used across the app.

---

### Paper Registry System

#### Core Rule
```
Each subject has its own permanent paper registry
Papers are assigned codes: P001, P002, P003...
Once assigned, a code NEVER changes
System is append-only

CST201 → P001, P002, P003... (independent sequence)
CST203 → P001, P002, P003... (independent sequence)
CST205 → P001, P002, P003... (independent sequence)
CST207 → P001, P002, P003... (independent sequence)
CST209 → P001, P002, P003... (independent sequence)
```

#### How Paper Codes Are Assigned
```
When creating registry for first time:
1. Sort all papers of that subject by year ascending
2. Then by month number ascending within same year
3. Assign P001, P002, P003... in that sorted order

After registry is created:
- Never change old paper codes
- New papers discovered later get NEXT available code
- Example: If P001-P005 exist, new paper gets P006
- Do NOT renumber existing files
```

---

### Canonical File Naming Rule

```
Format:
{SUBJECT_CODE}-{PAPER_CODE}-{YEAR}-{MONTH_2DIGIT}.json

Examples:
CST201-P001-2021-03.json
CST201-P002-2022-06.json
CST205-P003-2023-03.json
CST207-P004-2024-01.json
CST209-P005-2024-12.json

Rules:
- Use month NUMBER not month name in file name
- Month number must be zero-padded: 01 to 12
- Do NOT use E1, E2, attempt, or dynamic exam naming
- Same year multiple exams handled by unique paperCode + month
```

---

### Registry File Structure

Each subject folder contains a `registry.json`:

```json
{
  "subject": "CST205",
  "totalPapers": 5,
  "papers": [
    {
      "paperIndex": 1,
      "paperCode": "P001",
      "fileName": "CST205-P001-2021-03.json",
      "sourcePaperCode": "332(S)",
      "year": 2021,
      "month": "March",
      "monthNumber": 3
    },
    {
      "paperIndex": 2,
      "paperCode": "P002",
      "fileName": "CST205-P002-2022-06.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2022,
      "month": "June",
      "monthNumber": 6
    },
    {
      "paperIndex": 3,
      "paperCode": "P003",
      "fileName": "CST205-P003-2023-03.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2023,
      "month": "March",
      "monthNumber": 3
    },
    {
      "paperIndex": 4,
      "paperCode": "P004",
      "fileName": "CST205-P004-2024-01.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2024,
      "month": "January",
      "monthNumber": 1
    },
    {
      "paperIndex": 5,
      "paperCode": "P005",
      "fileName": "CST205-P005-2024-12.json",
      "sourcePaperCode": "307/1(N)",
      "year": 2024,
      "month": "December",
      "monthNumber": 12
    }
  ]
}
```

---

### Question Paper JSON Structure

#### Root Level Fields

```json
{
  "subject": "CST205",
  "paperIndex": 3,
  "paperCode": "P003",
  "fileName": "CST205-P003-2023-03.json",
  "sourcePaperCode": "307/1(N)",
  "year": 2023,
  "month": "March",
  "monthNumber": 3,
  "totalQuestions": 10,
  "questions": []
}
```

#### Root Field Rules

```
subject         → Subject code string. Example: CST205
paperIndex      → Integer. Permanent sequence number. Starts from 1
paperCode       → String. Format P + 3 digit zero-padded. Example: P003
fileName        → Must exactly follow naming rule above
sourcePaperCode → Exact printed paper code from exam paper. Example: 307/1(N)
year            → Integer. Example: 2023
month           → Full month name string. Example: March
monthNumber     → Integer 1 to 12. Must match month correctly
totalQuestions  → Exact count of questions in questions array
```

#### Question Level Fields

```json
{
  "id": "CST205-P003-Q1",
  "paperCode": "P003",
  "paperIndex": 3,
  "unit": 2,
  "topic": "Stack Operations",
  "question": "What is a Stack? Explain PUSH and POP operations with examples.",
  "answer": "A Stack is a linear data structure that follows the LIFO principle...\n\nPUSH Operation:\n1. Check if stack is full\n2. If full, print overflow error\n3. Else increment top by 1\n4. Insert element at top\n\nPOP Operation:\n1. Check if stack is empty\n2. If empty, print underflow error\n3. Else remove element at top\n4. Decrement top by 1",
  "marks": 6,
  "type": "theory",
  "difficulty": "easy",
  "year": 2023,
  "month": "March",
  "monthNumber": 3,
  "hasImage": false,
  "image": null,
  "tags": ["stack", "lifo", "push", "pop", "data-structures"],
  "practiceDay": 2
}
```

#### Question Field Rules

```
id              → Format: {SUBJECT_CODE}-{PAPER_CODE}-Q{NUMBER}
                  Must be unique inside the paper
                  Q number starts from 1
                  Example: CST205-P003-Q1

paperCode       → Same as root paperCode

paperIndex      → Same as root paperIndex

unit            → Integer 1 to 5
                  Match topic to correct unit using subject unit maps
                  CST205 has only 4 units

topic           → Specific topic name within the unit
                  Keep concise 2 to 5 words
                  Match exactly to topic names in subject unit maps

question        → Exact question text from paper
                  Do not modify or summarize
                  Keep all sub-parts in one string
                  Use \n between sub-parts
                  Use (a), (b), (c) for sub-parts if present

answer          → Complete detailed answer
                  Exam-ready — student can write directly
                  Use \n for new lines
                  Use \n\n for paragraph gaps
                  Include examples where helpful
                  For programs: include full working code
                  For numerical: show all steps clearly
                  For theory: definition + explanation + example

marks           → Integer only
                  Typical values: 2, 4, 6, 8, 10
                  Match marks from original paper if known

type            → "theory"    = definition, explanation, comparison
                  "program"   = write a code or program
                  "numerical" = trace, calculate, show steps, draw diagram
                  "short"     = 2 mark quick answer

difficulty      → "easy"   = direct recall, simple definition
                  "medium" = application, multi-step, moderate program
                  "hard"   = complex program, advanced concept, long derivation

year            → Integer. Same as root year

month           → String. Same as root month

monthNumber     → Integer. Same as root monthNumber

hasImage        → false for all text questions
                  true only if question needs a diagram image

image           → null if hasImage is false
                  "assets/images/questions/{ID}.png" if hasImage is true

tags            → Array of lowercase strings
                  2 to 6 tags per question
                  Include topic keywords, operation names, concept names
                  Use tags from tag reference list below

practiceDay     → Integer 1 to 10
                  Maps question to correct study day
                  Use 10-DAY PRACTICE MAP below
                  Every question must have a practiceDay
                  If topic appears in multiple days use earliest day
```

---

### Answer Quality Rules

#### For THEORY Questions
```
1. Start with a clear one-line definition
2. Add explanation in numbered points
3. Give a real example
4. Add diagram description in text if needed
5. End with applications if relevant
```

#### For PROGRAM Questions
```
1. Include all required headers
2. Write complete working code
3. Add comments on key lines
4. Show sample output after code
5. Explain logic briefly after code
```

#### For NUMERICAL Questions
```
1. Show every step — no skipping
2. Label each pass or iteration clearly
3. Show intermediate values
4. State final answer clearly
5. Mention time/space complexity if relevant
```

#### For SHORT Questions (2 marks)
```
1. One clear sentence definition
2. One example or key point
3. Keep under 5 lines total
```

---

### How Data Flows Through The System

```
┌─────────────────────────────────────────────────────┐
│  User Action                                        │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────┬─────────────┐
        │                     │              │             │
   ┌────▼────┐          ┌─────▼─────┐  ┌────▼────┐  ┌────▼────┐
   │ View    │          │ Practice  │  │   Quiz  │  │   PYQ   │
   │ Unit    │          │ Day 5     │  │  Medium │  │  2023   │
   └────┬────┘          └─────┬─────┘  └────┬────┘  └────┬────┘
        │                     │              │             │
        │              ┌──────▼──────────────▼─────────────▼──────┐
        │              │  Fetch from _data/CST205/*.json          │
        │              │  Apply filter:                           │
        │              │   - practiceDay = 5                      │
        │              │   - difficulty = "medium"                │
        │              │   - year = 2023                          │
        │              │   - unit = 2                             │
        │              └──────────────────────────────────────────┘
        │                                  │
        ▼                                  ▼
  Show notes content              Show filtered questions
```

---

### Two Modes of Data Creation

#### Mode 1 — Registry Mode
```
User gives list of papers for a subject
AI creates a fixed permanent registry
Assigns paper codes P001, P002, P003...
Sorted by year ascending then month ascending
Output is ONLY the registry JSON
No question files are created in this mode
After registry is approved it is used forever
```

#### Mode 2 — File Creation Mode
```
Registry already exists and is approved
User gives one paper at a time with questions
AI creates ONE JSON file per reply
Uses exact paperCode and fileName from registry
Output is ONLY the question JSON
No explanation before or after
```

---

## 10-Day Practice Map

Every question in every JSON file must have a `practiceDay` field.
Use this map to assign the correct day based on question topic.
If a topic appears in multiple days, use the earliest day.

---

### DAY 1 — Foundations

```
CST201: History of C, Structure of C program, C character set,
        Tokens, Constants, Variables, Keywords, Data types

CST203: History of Python, Features of Python, Basic Syntax,
        Variables, Numeric data types (int, float, complex)

CST205: Basic Terminology, Classification of Data Structures,
        Operations on Data Structures

CST207: Computer Functional units, Von-Neumann architecture,
        Bus structures, Basic Operational Concepts

CST209: Definitions and Characteristics of Algorithm,
        Examples of Algorithms, Data Abstraction,
        Sets, Multisets
```

### DAY 2 — Operators, Expressions and Complexity

```
CST201: Arithmetic operators, Logical operators,
        Relational operators, Assignment operators,
        Bitwise operators, Ternary operator,
        Increment and Decrement operators,
        Operator precedence, Associativity,
        Formatted I/O, Type conversion, Typecasting

CST203: String data type, String operations, String methods,
        Unicode string literals,
        Converting between simple types,
        Converting to strings, String formatting,
        Understanding coding blocks,
        Tuples, Lists (defining and slicing), Dictionary,
        Operators (Arithmetic, Relational, Assignment,
        Logical, Bitwise, Membership, Identity)

CST205: Introduction to Stacks,
        Array Representation of Stacks,
        Stack Operations (Push and Pop),
        Applications of Stacks,
        Infix-to-Postfix Transformation,
        Evaluating Postfix Expressions

CST207: Data representation Fixed point,
        Data representation Floating point,
        Error detecting codes,
        Register Transfer, Memory transfers

CST209: Asymptotic Notations Big-O,
        Asymptotic Notations Omega,
        Asymptotic Notations Theta,
        Time Complexity, Space Complexity,
        Best case analysis, Average case analysis,
        Worst case analysis
```

### DAY 3 — Control Flow and Linear Data Structures

```
CST201: if statement, if-else statement, else-if ladder,
        Nested if-else, Switch case statement, goto statement,
        while loop, do-while loop, for loop,
        Break and continue, Nested loops,
        Entry controlled loop, Exit controlled loop

CST203: if else elif blocks, For loops, While loops,
        break statement, continue statement,
        else in loops, pass statement

CST205: Introduction to Queues,
        Array Representation of Queues,
        Queue Operations (Enqueue and Dequeue),
        Circular Queue, De-Queue,
        Recursion GCD, Recursion Tower of Hanoi,
        Round Robin Algorithm,
        Applications of Queues

CST207: Arithmetic micro-operations,
        Logic micro-operations,
        Shift micro-operations,
        Arithmetic logic shift unit

CST209: Bubble Sort, Selection Sort,
        Insertion Sort, Shell Sort,
        Complexity analysis of basic sorts
```

### DAY 4 — Arrays, Strings and Advanced Sorting

```
CST201: Advantages of arrays,
        Declaration and initialization of 1D arrays,
        Declaration and initialization of 2D arrays,
        Multidimensional arrays,
        Character arrays, Strings in C,
        strlen(), strcpy(), strcat(), strcmp(),
        Substring extraction,
        String concatenation, String replacement

CST203: Defining functions, Calling functions,
        Pass by object reference,
        Function parameters, Arbitrary arguments,
        Optional arguments, Named arguments,
        Local scope, Nonlocal scope, Global scope

CST205: Singly Linked List, Representation in Memory,
        Add node at beginning,
        Add node in between, Add node at end,
        Delete node at beginning,
        Delete node in between, Delete node at end,
        Circular Linked List operations

CST207: Control memory, Address sequencing,
        Design of control unit,
        Addition algorithm, Subtraction algorithm

CST209: Merge Sort, Quick Sort, Heapsort,
        Count Sort, Bucket Sort, Radix Sort,
        Complexity analysis of all sorting algorithms
```

### DAY 5 — Functions, Modules and Linked Lists

```
CST201: Definition of functions, Prototype declaration,
        Scope of variables, Lifetime of variables,
        Auto storage class, Extern storage class,
        Static storage class, Register storage class,
        Call by value, Call by reference

CST203: Importing own modules,
        Importing external modules, Packages,
        Passing arguments from a tuple,
        Class scope, Date and Time,
        Advanced string operations,
        List split, List join, List copying

CST205: Doubly Linked List add at beginning,
        Doubly Linked List add in between,
        Doubly Linked List add at end,
        Doubly Linked List delete operations,
        Circular Double Linked List,
        Linked List Representation of Stack,
        Linked List Representation of Queue,
        Operations of Stack using Linked List

CST207: Multiplication algorithm, Division algorithm,
        Floating-point arithmetic operation,
        Arithmetic Pipeline, Instruction Pipeline,
        RISC Pipeline

CST209: Linear Search, Binary Search,
        Divide and Conquer strategy,
        Greedy Methods overview,
        Dynamic Programming overview
```

### DAY 6 — Recursion, File I/O and Trees

```
CST201: Recursion and memory stack,
        Types of recursion,
        Recursion vs Iteration,
        Applications of recursion

CST203: Accessing Keyboard Input raw_input,
        Accessing Keyboard Input input(),
        File modes and permissions,
        open() and close(),
        read() and readline(), readlines(),
        write() and writelines(),
        tell() and seek(), flush(),
        fileno(), isatty(), next(),
        Redirecting output streams to files

CST205: Introduction to Trees, Basic Tree Terminologies,
        Definition and Concepts of Binary Trees,
        Array Representation of Binary Tree,
        Linked List Representation of Binary Tree,
        Insertion in Binary Tree, Deletion in Binary Tree,
        Inorder Traversal, Preorder Traversal,
        Postorder Traversal

CST207: Vector Processing, Array Processors,
        Introduction to Intel 8086,
        Block diagram of 8086, Pin functions of 8086,
        Register structure of 8086, Segmentation

CST209: Binary Search Trees, BST Algorithms,
        BST Searching Time and Space Complexity,
        Balanced Search Trees,
        Hashing, Hash Tables, Hash functions,
        Collision resolution techniques, Symbol Tables
```

### DAY 7 — Pointers, Regex and Advanced Trees

```
CST201: Understanding Pointers, Null Pointers,
        Generic Pointers, Pointer arithmetic,
        Pointers and arrays,
        Passing array to function,
        Array name and Pointer,
        Pointers and Strings, Array of pointers,
        Constant pointers, Pointer to a constant,
        Function pointers, Pointer to a pointer

CST203: re.match(), re.search(), re.findall(),
        re.finditer(), re.compile(),
        re.sub(), re.split()

CST205: Types of Binary Trees, B-Tree, AVL Tree,
        Introduction to Graphs, Graph Terminologies,
        Set Representation of Graphs,
        Linked Representation of Graphs,
        Matrix Representation of Graphs

CST207: Interrupt mechanism,
        Addressing modes of 8086,
        Instructions of 8086,
        Simple Assembly programs,
        Logical instructions,
        Branch instructions, Call instructions

CST209: Directed graphs, Undirected graphs,
        Paths and Cycles, Spanning trees,
        Directed Acyclic Graphs,
        Topological Sorting
```

### DAY 8 — Dynamic Memory, Django and Graph Algorithms

```
CST201: Dynamic memory allocation malloc(),
        Dynamic memory allocation calloc(),
        Dynamic memory allocation realloc(),
        free(), Pointer to a structure

CST203: What is Django, MVC framework,
        Creating URL in Django,
        Django Templates,
        Sending data to template,
        Creating HTML forms,
        Handling form data,
        Creating Django forms,
        Form Validation, Model-based forms,
        Display object lists in templates,
        Filters in templates, Base templates,
        Inserting static files,
        Validating and manipulating data,
        Widget usage,
        Customizing error messages

CST205: Breadth First Search BFS,
        Depth First Search DFS,
        Applications of BFS,
        Applications of DFS

CST207: Assembly programs for sorting,
        Evaluation of arithmetic expressions in Assembly,
        String manipulation in Assembly,
        Assembler directives,
        Procedures in Assembly,
        Macros in Assembly

CST209: Minimum Spanning Tree Prims Algorithm,
        Minimum Spanning Tree Kruskals Algorithm,
        MST examples and trace
```

### DAY 9 — Complete Remaining Topics

```
CST201: Complete Unit 5 review,
        All pointer types revision,
        DMA complete revision,
        Structure with pointers

CST203: Django Advanced complete revision,
        Complete Unit 5 review

CST205: Dijkstras Shortest Path Algorithm,
        Bellman-Ford Algorithm,
        Floyd-Warshall all pairs shortest path,
        Complete Unit 4 revision

CST207: Memory and Digital Interfacing,
        Addressing and address decoding,
        Interfacing RAM, Interfacing ROM,
        Interfacing EPROM,
        Programmable Peripheral Interface,
        Cache Memory Mapping,
        Cache Memory Hit ratio,
        Virtual Memory,
        Logical address vs Physical address,
        Translation Lookaside Buffer TLB

CST209: String Sort, Tries,
        Search a Substring within a string,
        Naive String Matching Algorithm,
        Rabin-Karp Algorithm,
        Knuth-Morris-Pratt KMP Algorithm,
        Horspool String Matching Algorithm,
        Boyer-Moore String Matching Algorithm,
        Regular Expressions in Algorithms,
        Elementary Data Compression,
        Shortest Path Dijkstras Algorithm,
        Shortest Path Bellman-Ford,
        Shortest Path Floyd-Warshall
```

### DAY 10 — Full Theory Revision

```
ALL SUBJECTS:
  Any topic that is a revision or summary question
  covering multiple units or the full subject

  Use practiceDay 10 for questions like:
  - "Explain all sorting algorithms with complexity"
  - "Compare all tree types"
  - "Write short notes on any three topics"
  - "Differentiate between X and Y and Z"
    when X Y Z span multiple units
```

---

## Subject Unit Maps

Use these maps to assign correct `unit` number to every question.

---

### CST201 — Computer Programming in C

```
Unit 1:
  History of C, Structure of C program,
  C character set, Tokens, Constants,
  Variables, Keywords, Data types,
  Operators (arithmetic, logical, assignment,
  relational, increment/decrement, ternary, bitwise),
  Operator precedence, Associativity,
  Formatted input, Formatted output,
  Type conversion, Typecasting

Unit 2:
  if, if-else, else-if ladder, nested if-else,
  Switch case, goto,
  while, do-while, for loop,
  Break, continue, Nested loops,
  Entry controlled loop, Exit controlled loop

Unit 3:
  Definition of functions, Prototype declaration,
  Scope and lifetime of variables,
  Storage Classes (Auto, Extern, Static, Register),
  Call by value, Call by reference,
  Recursion, Types of recursion,
  Recursion vs Iteration,
  Applications of recursion

Unit 4:
  1D arrays, 2D arrays, Multidimensional arrays,
  Character arrays, Strings,
  strlen(), strcpy(), strcat(), strcmp(),
  Substring extraction,
  String concatenation, String replacement

Unit 5:
  Pointers, Null Pointers, Generic Pointers,
  Pointer arithmetic,
  Pointers and arrays, Passing array to function,
  Array name and Pointer,
  Pointers and Strings, Array of pointers,
  Constant pointers, Pointer to a constant,
  Function pointers, Pointer to a pointer,
  Dynamic memory allocation
  malloc(), calloc(), realloc(), free(),
  Pointer to a structure
```

### CST203 — Scripting Languages Python

```
Unit 1:
  History of Python, Features, Installation,
  Basic Syntax, Variables,
  Numeric data types (int, float, complex),
  String data type, String operations,
  String methods, Unicode string literals,
  Converting between simple types,
  Converting to strings, String formatting,
  Understanding coding blocks,
  Tuples, Lists (defining and slicing),
  Dictionary, Arrays,
  Operators (Arithmetic, Relational, Assignment,
  Logical, Bitwise, Membership, Identity)

Unit 2:
  Conditional blocks (if, else, elif),
  For loops, While loops,
  break, continue, else in loops, pass,
  Date and Time,
  Advanced string operations,
  List manipulation (split, join, copying)

Unit 3:
  Defining and Calling Functions,
  Pass by object reference,
  Parameters, Arbitrary arguments,
  Optional arguments, Named arguments,
  Variable Scope (Local, Nonlocal, Global),
  Importing own modules,
  Importing external modules, Packages,
  Passing arguments from a tuple,
  Class scope

Unit 4:
  Accessing Keyboard Input raw_input and input(),
  File modes and permissions,
  open(), close(), read(), readline(),
  readlines(), write(), writelines(),
  tell(), seek(), flush(),
  fileno(), isatty(), next(),
  Redirecting output streams to files,
  File Processing scripts,
  Regular Expressions:
  re.match(), re.search(), re.findall(),
  re.finditer(), re.compile(),
  re.sub(), re.split()

Unit 5:
  What is Django, MVC framework,
  Creating URL in Django,
  Django Templates,
  Sending data to template,
  Creating HTML forms, Handling form data,
  Creating Django forms, Form Validation,
  Model-based forms,
  Display object lists in templates,
  Filters in templates, Base templates,
  Inserting static files,
  Validating and manipulating data,
  Widget usage, Customizing error messages
```

### CST205 — Data Structures

```
Unit 1:
  Basic Terminology,
  Classification of Data Structures,
  Operations on Data Structures,
  Introduction to Stacks,
  Array Representation of Stacks,
  Stack Operations Push and Pop,
  Applications of Stacks,
  Infix-to-Postfix Transformation,
  Evaluating Postfix Expressions

Unit 2:
  Introduction to Queues,
  Array Representation of Queues,
  Queue Operations Enqueue and Dequeue,
  Circular Queue, De-Queue,
  Recursion GCD, Tower of Hanoi,
  Applications of Queues, Round Robin Algorithm,
  Singly Linked List, Representation in Memory,
  Add and Delete operations (beginning, middle, end),
  Circular Linked List,
  Doubly Linked List operations,
  Circular Double Linked List,
  Linked List Representation of Stack and Queue,
  Operations of Stack using Linked List

Unit 3:
  Introduction to Trees, Basic Tree Terminologies,
  Binary Trees, Array Representation,
  Linked List Representation,
  Insertion and Deletion in Binary Tree,
  Inorder Traversal, Preorder Traversal,
  Postorder Traversal,
  Types of Binary Trees, B-Tree, AVL Tree,
  Introduction to Graphs, Graph Terminologies,
  Set Representation, Linked Representation,
  Matrix Representation,
  BFS, DFS, Applications of BFS and DFS

Unit 4:
  Binary Search Trees, BST Algorithms,
  BST Searching Complexity,
  Balanced Search Trees,
  Hashing, Hash Tables, Hash functions,
  Collision resolution techniques, Symbol Tables,
  Dijkstras Shortest Path Algorithm,
  Bellman-Ford Algorithm,
  Floyd-Warshall all pairs shortest path,
  Topological Sorting,
  Minimum Spanning Tree Prims Algorithm,
  Minimum Spanning Tree Kruskals Algorithm
```

### CST207 — Computer System Organization

```
Unit 1:
  Computer Functional units,
  Von-Neumann architecture, Bus structures,
  Basic Operational Concepts,
  Data representation Fixed point,
  Data representation Floating point,
  Error detecting codes,
  Register Transfer, Memory transfers,
  Arithmetic micro-operations,
  Logic micro-operations,
  Shift micro-operations,
  Arithmetic logic shift unit

Unit 2:
  Control memory, Address sequencing,
  Design of control unit,
  Addition and Subtraction algorithms,
  Multiplication and Division algorithms,
  Floating-point arithmetic operation,
  Arithmetic Pipeline, Instruction Pipeline,
  RISC Pipeline,
  Vector Processing, Array Processors

Unit 3:
  Introduction to Intel 8086,
  Block diagram of 8086,
  Pin functions of 8086,
  Register structure of 8086,
  Segmentation, Interrupt mechanism,
  Addressing modes of 8086,
  Instructions of 8086

Unit 4:
  Simple Assembly programs,
  Logical instructions,
  Branch instructions, Call instructions,
  Assembly programs for sorting,
  Evaluation of arithmetic expressions,
  String manipulation in Assembly,
  Assembler directives,
  Procedures in Assembly,
  Macros in Assembly

Unit 5:
  Memory and Digital Interfacing,
  Addressing and address decoding,
  Interfacing RAM, Interfacing ROM,
  Interfacing EPROM,
  Programmable Peripheral Interface,
  Cache Memory Mapping,
  Cache Memory Hit ratio,
  Virtual Memory,
  Logical address vs Physical address,
  Translation Lookaside Buffer TLB
```

### CST209 — Algorithms

```
Unit 1:
  Definitions and Characteristics of Algorithm,
  Data Abstraction, Sets, Multisets,
  Asymptotic Notations Big-O, Omega, Theta,
  Time Complexity, Space Complexity,
  Best case, Average case, Worst case analysis

Unit 2:
  Bubble Sort, Selection Sort,
  Insertion Sort, Shell Sort,
  Merge Sort, Quick Sort, Heapsort,
  Count Sort, Bucket Sort, Radix Sort,
  Complexity analysis of all sorting algorithms

Unit 3:
  Linear Search, Binary Search,
  Divide and Conquer strategy,
  Greedy Methods,
  Dynamic Programming,
  Binary Search Trees, BST Algorithms,
  Balanced Search Trees,
  Hashing, Hash Tables, Hash functions,
  Collision resolution techniques,
  Symbol Tables

Unit 4:
  Directed graphs, Undirected graphs,
  Paths and Cycles, Spanning trees,
  Directed Acyclic Graphs,
  Topological Sorting,
  Minimum Spanning Tree Prims Algorithm,
  Minimum Spanning Tree Kruskals Algorithm,
  Shortest Path Dijkstras Algorithm,
  Shortest Path Bellman-Ford,
  Shortest Path Floyd-Warshall

Unit 5:
  String Sort, Tries,
  Search a Substring within a string,
  Naive String Matching Algorithm,
  Rabin-Karp Algorithm,
  Knuth-Morris-Pratt KMP Algorithm,
  Horspool String Matching Algorithm,
  Boyer-Moore String Matching Algorithm,
  Regular Expressions in Algorithms,
  Elementary Data Compression
```

---

## Tag Reference

Use these tags for consistent tagging across all question files.

### CST201 Tags
```
c-programming, data-types, operators, control-flow,
loops, functions, recursion, arrays, strings, pointers,
structures, dynamic-memory, malloc, calloc, realloc,
free, file-handling, storage-class, call-by-value,
call-by-reference, string-functions, typecasting,
formatted-io, operator-precedence, switch-case, goto,
pointer-arithmetic, null-pointer, function-pointer,
2d-array, nested-loop, do-while, for-loop, while-loop
```

### CST203 Tags
```
python, variables, data-types, strings, lists, tuples,
dictionary, operators, control-flow, loops, functions,
modules, packages, file-io, regular-expressions, django,
scope, list-comprehension, regex, file-processing, mvc,
templates, forms, validation, unicode, string-formatting,
type-conversion, keyboard-input, file-modes, raw-input,
class-scope, tuple-arguments, filters, static-files,
model-forms, widget, django-forms, url-routing
```

### CST205 Tags
```
data-structures, stack, queue, linked-list,
singly-linked-list, doubly-linked-list,
circular-linked-list, tree, binary-tree, bst,
avl-tree, b-tree, graph, bfs, dfs, traversal,
inorder, preorder, postorder, hashing, sorting,
searching, recursion, lifo, fifo, push, pop,
enqueue, dequeue, infix, postfix, tower-of-hanoi,
round-robin, mst, dijkstra, prim, kruskal,
topological-sort, bellman-ford, floyd-warshall,
hash-table, collision, symbol-table, spanning-tree
```

### CST207 Tags
```
computer-organization, von-neumann, bus-structure,
data-representation, floating-point, fixed-point,
error-detection, register-transfer, micro-operations,
arithmetic, logic-operations, shift-operations,
control-unit, pipelining, alu, 8086, microprocessor,
assembly-language, addressing-modes, interrupts,
memory-organization, cache-memory, virtual-memory,
tlb, ram, rom, interfacing, segmentation, pipeline,
instruction-pipeline, arithmetic-pipeline, risc,
vector-processing, array-processor, assembler,
assembler-directives, macros, procedures
```

### CST209 Tags
```
algorithms, complexity, big-o, omega, theta,
time-complexity, space-complexity, sorting, searching,
bubble-sort, selection-sort, insertion-sort, shell-sort,
merge-sort, quick-sort, heapsort, count-sort,
bucket-sort, radix-sort, linear-search, binary-search,
divide-conquer, greedy, dynamic-programming,
graph, bfs, dfs, mst, dijkstra, prim, kruskal,
bellman-ford, floyd-warshall, topological-sort,
string-matching, kmp, rabin-karp, boyer-moore,
horspool, hashing, bst, trie, data-compression,
substring-search, naive-matching, string-sort,
regular-expressions
```

---

## Master Subjects File

```json
{
  "semester": 3,
  "stream": "Computer Science & Technology",
  "subjects": [
    {
      "code": "CST201",
      "name": "Computer Programming in C",
      "credits": 2,
      "units": 5,
      "folder": "CST201"
    },
    {
      "code": "CST203",
      "name": "Scripting Languages (Python)",
      "credits": 2,
      "units": 5,
      "folder": "CST203"
    },
    {
      "code": "CST205",
      "name": "Data Structures",
      "credits": 2,
      "units": 4,
      "folder": "CST205"
    },
    {
      "code": "CST207",
      "name": "Computer System Organization",
      "credits": 4,
      "units": 5,
      "folder": "CST207"
    },
    {
      "code": "CST209",
      "name": "Algorithms",
      "credits": 4,
      "units": 5,
      "folder": "CST209"
    }
  ]
}
```

---

## Subject Metadata Pattern

```json
{
  "code": "CST205",
  "name": "Data Structures",
  "credits": 2,
  "totalUnits": 4,
  "units": [
    {
      "unit": 1,
      "title": "Introduction and Stacks",
      "topics": [
        "Basic Terminology",
        "Classification of Data Structures",
        "Operations on Data Structures",
        "Introduction to Stacks",
        "Stack Operations Push and Pop",
        "Applications of Stacks",
        "Infix-to-Postfix Transformation",
        "Evaluating Postfix Expressions"
      ]
    },
    {
      "unit": 2,
      "title": "Queues, Recursion and Linked Lists",
      "topics": [
        "Introduction to Queues",
        "Circular Queue",
        "De-Queue",
        "Recursion GCD",
        "Tower of Hanoi",
        "Singly Linked List",
        "Doubly Linked List",
        "Circular Linked List",
        "Linked List Representation of Stack and Queue"
      ]
    },
    {
      "unit": 3,
      "title": "Trees and Graphs",
      "topics": [
        "Binary Trees",
        "Tree Traversals",
        "AVL Tree",
        "B-Tree",
        "Introduction to Graphs",
        "BFS",
        "DFS"
      ]
    },
    {
      "unit": 4,
      "title": "BST, Hashing and Shortest Path",
      "topics": [
        "Binary Search Trees",
        "Hashing",
        "Collision Resolution",
        "Dijkstras Algorithm",
        "Bellman-Ford Algorithm",
        "Floyd-Warshall Algorithm",
        "Prims Algorithm",
        "Kruskals Algorithm",
        "Topological Sorting"
      ]
    }
  ]
}
```

---

## Template System Explained

### Why Templates?
```
Building across multiple chats means:
- You can't rely on "shared" files being available
- Each chat should give you complete, working code
- But you need consistency across all pages

Solution:
- Build templates once in Chat 1
- Copy template code into every new file
- Modify only what's specific to that page
```

### What Gets Templated?
```
✅ HTML structure (nav, footer, basic layout)
✅ CSS variables (:root definitions)
✅ Theme toggle script
✅ SVG icon usage pattern

❌ Page-specific content
❌ Page-specific styling
❌ Page-specific functionality
```

---

## SVG Icon System

### Single Sprite File
```
assets/icons/sprite.svg contains ALL icons as <symbol> elements
```

### Usage Everywhere
```html
<svg class="icon">
  <use href="/assets/icons/sprite.svg#home"></use>
</svg>
```

### Available Icons
```
#home        → Dashboard
#book        → Study materials
#practice    → Practice session
#quiz        → Quiz
#moon        → Dark mode
#sun         → Light mode
#bookmark    → Save page
#arrow-left  → Back navigation
#arrow-right → Forward navigation
#check       → Correct answer
#close       → Close/Cancel
#menu        → Hamburger menu
#settings    → Settings
#star        → Featured/important questions
#filter      → Filter questions
#sort        → Sort questions
#calendar    → Practice day view
#clock       → Time remaining in quiz
#refresh     → Retry quiz
#download    → Save/export (future feature)
#share       → Share question (future feature)
#warning     → Coming soon / empty state
#search      → Search questions
```

---

## Key Technical Decisions

### 1. No Build Process
```
Pure HTML/CSS/JS
No npm, webpack, or compilation
Works directly in browser
Easy to deploy (just upload files)
```

### 2. Service Worker Cache Strategy (Hybrid)
```
Cache Shell on install:
  index.html, sprite.svg, core CSS/JS

Cache on Use:
  Subject pages, unit pages (as user visits)

Pre-cache Data on install:
  All JSON files (small files, needed offline)
```

### 3. Client-Side Only
```
No backend required
All data in JSON files
localStorage for user data
Completely static hosting (GitHub Pages, Netlify, etc.)
```

### 4. Mobile-First
```
Designed for phone screens first
Progressive enhancement for desktop
Touch-friendly buttons and spacing
Bottom navigation for thumb reach
```

### 5. Theme Support
```
Light and dark modes
Saved to localStorage
Instant toggle
Respects system preference initially
```

### 6. 2025 Papers
```
Keep 2025.json as empty placeholder
Show "Coming Soon" in PYQ viewer
Add real data when exam happens
```

---

## Storage Strategy

```javascript
{
  // Theme preference
  "theme": "dark",

  // Bookmarked pages
  "bookmarks": [
    "/subjects/CST205/units/unit-2.html",
    "/subjects/CST209/units/unit-3.html"
  ],

  // Practice progress
  "practice-progress": {
    "day1": "completed",
    "day2": "in-progress",
    "day3": "locked"
  },

  // Quiz scores
  "quiz-scores": [
    {
      "subject": "CST205",
      "difficulty": "medium",
      "score": 8,
      "total": 10,
      "date": "2025-01-15"
    }
  ],

  // Full quiz history
  "quiz-history": [],

  // Practice streak for motivation
  "practice-streak": 0,

  // First time user guide flag
  "onboarding-done": false,

  // For future cache invalidation
  "data-version": "1.0",

  // Last visited per subject
  "last-visited": {
    "CST201": "/subjects/CST201/units/unit-3.html",
    "CST205": "/subjects/CST205/units/unit-2.html"
  }
}
```

---

## Unit Page Pattern

```html
<!-- subjects/CST205/units/unit-2.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Unit 2: Queues, Recursion and Linked Lists - CST205">
  <meta name="subject" content="CST205">
  <meta name="unit" content="2">
  <title>Unit 2: Queues, Recursion and Linked Lists - CST205</title>
  <link rel="stylesheet" href="common.css">

  <!-- Unit-specific inline styles only -->
  <style>
    .queue-diagram {
      border: 2px solid var(--accent-blue);
      padding: 1rem;
    }
  </style>
</head>
<body>

  <!-- Content here -->

  <script src="common.js"></script>

  <!-- Unit-specific inline scripts only -->
  <script>
    function demonstrateQueue() {
      // Unit 2 specific functionality
    }
  </script>
</body>
</html>
```

---

## File Count Summary

```
Root files:              5
_templates/:             4
assets/:                 9  (added images/questions/ folder)
_data/:                 27  (subjects.json + 5×meta + 5×registry + 5×5 year files - 3)
subjects/:              64  (corrected count)
pyq/:                    6
practice/:               6
quiz/:                   9
roadmap/:                3
bookmarks/:              3
suggestions/:            8  (inline styles, one shared JS)
info/:                   9  (4 HTML + 4 CSS + 1 shared JS)
_dev/:                   5
─────────────────────────
TOTAL:                ~158 files
```

---

## What This Structure Solves

```
✅ Messy 2nd sem code         → Clean organized structure
✅ Scattered files            → Logical grouping
✅ Hard to maintain           → Each page independent
✅ Hard to add content        → Just add JSON entries
✅ Separate PYQ/Practice      → One data source filtered
✅ Emoji inconsistency        → SVG sprite system
✅ Multi-chat development     → Template-based approach
✅ Common CSS duplication     → common.css per subject
✅ Unit-specific styles       → Inline in unit HTML
✅ File naming conflicts      → subjects.json not manifest.json
✅ No data JSON chat planned  → Added to Chat 2-6
✅ Missing paper system       → Full registry system added
✅ No practice day mapping    → 10-day map fully defined
✅ Inconsistent tagging       → Tag reference per subject
✅ No cache strategy          → Hybrid strategy defined
✅ Missing localStorage keys  → Full storage plan added
✅ Missing SVG icons          → Complete icon list added
```

---

## Next Steps

When ready to start building, begin a new chat and say:

**"Give me Chat 1: Foundation files"**

This will give you:
- Complete working dashboard
- All template files ready to copy
- SVG sprite with all icons
- Data structure setup
- PWA configuration

Then in subsequent chats, request each component one by one following the chat sequence defined above.

---

**This is the complete updated skeleton and discussion summary with full question data system integrated. Use this as the master reference document throughout your multi-chat development process.**