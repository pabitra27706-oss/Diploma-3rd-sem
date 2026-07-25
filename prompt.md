Analysis my plan
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
One JSON file per subject per year
Same question used in multiple contexts:
- Filter by year    → PYQ
- Filter by day     → Practice
- Filter by unit    → Unit Quiz
- Filter by difficulty → General Quiz

One source of truth, multiple uses
```

### 4. **Multi-Chat Development Strategy**
```
Chat 1  → Foundation + Templates
Chat 2  → Subject CST201
Chat 3  → Subject CST203
Chat 4  → Subject CST205
Chat 5  → Subject CST207
Chat 6  → Subject CST209
Chat 7  → PYQ System
Chat 8  → Practice System
Chat 9  → Quiz System
Chat 10 → Roadmap + Bookmarks + Info pages
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
│   ├── 📄 manifest.json                    ← Master index listing all subjects
│   │
│   ├── 📁 CST201/                          ← C Programming
│   │   ├── 📄 meta.json                    ← Subject metadata (name, units, credits)
│   │   ├── 📄 2021.json                    ← All 2021 questions
│   │   ├── 📄 2022.json                    ← All 2022 questions
│   │   ├── 📄 2023.json                    ← All 2023 questions
│   │   ├── 📄 2024.json                    ← All 2024 questions
│   │   └── 📄 2025.json                    ← All 2025 questions
│   │
│   ├── 📁 CST203/                          ← Python/Scripting Languages
│   │   ├── 📄 meta.json
│   │   ├── 📄 2021.json
│   │   ├── 📄 2022.json
│   │   ├── 📄 2023.json
│   │   ├── 📄 2024.json
│   │   └── 📄 2025.json
│   │
│   ├── 📁 CST205/                          ← Data Structures
│   │   ├── 📄 meta.json
│   │   ├── 📄 2021.json
│   │   ├── 📄 2022.json
│   │   ├── 📄 2023.json
│   │   ├── 📄 2024.json
│   │   └── 📄 2025.json
│   │
│   ├── 📁 CST207/                          ← Computer System Organization
│   │   ├── 📄 meta.json
│   │   ├── 📄 2021.json
│   │   ├── 📄 2022.json
│   │   ├── 📄 2023.json
│   │   ├── 📄 2024.json
│   │   └── 📄 2025.json
│   │
│   └── 📁 CST209/                          ← Algorithms
│       ├── 📄 meta.json
│       ├── 📄 2021.json
│       ├── 📄 2022.json
│       ├── 📄 2023.json
│       ├── 📄 2024.json
│       └── 📄 2025.json
│
│
├── 📁 subjects/                            ← ALL 5 SUBJECTS
│   │
│   ├── 📁 CST201/                          ← Computer Programming in C
│   │   ├── 📄 index.html                   ← Subject homepage (unit list)
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   │
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css               ← Shared CSS for all CST201 units
│   │   │   ├── 📄 common.js                ← Shared JS for all CST201 units
│   │   │   │
│   │   │   ├── 📄 unit-1.html              ← Unit 1: Basics of C (with inline specific styles)
│   │   │   ├── 📄 unit-2.html              ← Unit 2: Decision Control & Looping
│   │   │   ├── 📄 unit-3.html              ← Unit 3: Arrays & Strings
│   │   │   ├── 📄 unit-4.html              ← Unit 4: User Defined Functions
│   │   │   └── 📄 unit-5.html              ← Unit 5: Pointers in C
│   │   │
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html       ← C syntax quick reference
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   │
│   ├── 📁 CST203/                          ← Scripting Languages (Python)
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   │
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css               ← Shared CSS for all CST203 units
│   │   │   ├── 📄 common.js                ← Shared JS for all CST203 units
│   │   │   │
│   │   │   ├── 📄 unit-1.html              ← Unit 1: Variables & Data Types
│   │   │   ├── 📄 unit-2.html              ← Unit 2: Control Structures
│   │   │   ├── 📄 unit-3.html              ← Unit 3: Functions, Modules & Packages
│   │   │   ├── 📄 unit-4.html              ← Unit 4: File I/O & Regular Expressions
│   │   │   └── 📄 unit-5.html              ← Unit 5: Frameworks (Django)
│   │   │
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html       ← Python syntax reference
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   │
│   ├── 📁 CST205/                          ← Data Structures
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   │
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css               ← Shared CSS for all CST205 units
│   │   │   ├── 📄 common.js                ← Shared JS for all CST205 units
│   │   │   │
│   │   │   ├── 📄 unit-1.html              ← Unit 1: Introduction to Data Structures
│   │   │   ├── 📄 unit-2.html              ← Unit 2: Linear Data Structures
│   │   │   ├── 📄 unit-3.html              ← Unit 3: Linked Lists
│   │   │   └── 📄 unit-4.html              ← Unit 4: Non-Linear Data Structures
│   │   │
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html       ← Complexity cheat sheet
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   │
│   ├── 📁 CST207/                          ← Computer System Organization
│   │   ├── 📄 index.html
│   │   ├── 📄 index.css
│   │   ├── 📄 index.js
│   │   │
│   │   ├── 📁 units/
│   │   │   ├── 📄 common.css               ← Shared CSS for all CST207 units
│   │   │   ├── 📄 common.js                ← Shared JS for all CST207 units
│   │   │   │
│   │   │   ├── 📄 unit-1.html              ← Unit 1: Structure of Computers
│   │   │   ├── 📄 unit-2.html              ← Unit 2: Microprogrammed Control
│   │   │   ├── 📄 unit-3.html              ← Unit 3: Microprocessor Architecture
│   │   │   ├── 📄 unit-4.html              ← Unit 4: Assembly Language Programming
│   │   │   └── 📄 unit-5.html              ← Unit 5: Memory & Digital Interfacing
│   │   │
│   │   └── 📁 resources/
│   │       ├── 📄 formula-sheet.html       ← 8086 instruction set reference
│   │       ├── 📄 formula-sheet.css
│   │       └── 📄 formula-sheet.js
│   │
│   │
│   └── 📁 CST209/                          ← Algorithms
│       ├── 📄 index.html
│       ├── 📄 index.css
│       ├── 📄 index.js
│       │
│       ├── 📁 units/
│       │   ├── 📄 common.css               ← Shared CSS for all CST209 units
│       │   ├── 📄 common.js                ← Shared JS for all CST209 units
│       │   │
│       │   ├── 📄 unit-1.html              ← Unit 1: Fundamentals of Algorithms
│       │   ├── 📄 unit-2.html              ← Unit 2: Sorting Algorithms
│       │   ├── 📄 unit-3.html              ← Unit 3: Searching Algorithms
│       │   ├── 📄 unit-4.html              ← Unit 4: Graph Algorithms
│       │   └── 📄 unit-5.html              ← Unit 5: String Algorithms
│       │
│       └── 📁 resources/
│           ├── 📄 formula-sheet.html       ← Big-O notation cheat sheet
│           ├── 📄 formula-sheet.css
│           └── 📄 formula-sheet.js
│
│
├── 📁 pyq/                                 ← PREVIOUS YEAR QUESTIONS VIEWER
│   ├── 📄 index.html                       ← Subject + Year selector page
│   ├── 📄 index.css
│   ├── 📄 index.js
│   │
│   ├── 📄 viewer.html                      ← Question viewer/display page
│   ├── 📄 viewer.css
│   └── 📄 viewer.js
│
│
├── 📁 practice/                            ← PRACTICE SYSTEM (Day-wise)
│   ├── 📄 index.html                       ← Practice roadmap + day selector
│   ├── 📄 index.css
│   ├── 📄 index.js
│   │
│   ├── 📄 session.html                     ← Active practice session page
│   ├── 📄 session.css
│   └── 📄 session.js
│
│
├── 📁 quiz/                                ← QUIZ SYSTEM (Difficulty-based)
│   ├── 📄 index.html                       ← Subject + difficulty selector
│   ├── 📄 index.css
│   ├── 📄 index.js
│   │
│   ├── 📄 play.html                        ← Active quiz session
│   ├── 📄 play.css
│   ├── 📄 play.js
│   │
│   ├── 📄 result.html                      ← Quiz result + review page
│   ├── 📄 result.css
│   └── 📄 result.js
│
│
├── 📁 roadmap/                             ← 30-DAY REVISION ROADMAP
│   ├── 📄 index.html                       ← Visual roadmap page
│   ├── 📄 index.css
│   └── 📄 index.js
│
│
├── 📁 bookmarks/                           ← BOOKMARKED PAGES VIEWER
│   ├── 📄 index.html                       ← List of saved/bookmarked pages
│   ├── 📄 index.css
│   └── 📄 index.js
│
│
├── 📁 suggestions/                         ← STUDY TIPS & SUGGESTIONS
│   ├── 📄 index.html                       ← Subject selector for tips
│   ├── 📄 index.css
│   ├── 📄 index.js
│   │
│   └── 📁 subjects/
│       ├── 📁 CST201/
│       │   ├── 📄 tips.html                ← C Programming tips
│       │   ├── 📄 tips.css
│       │   └── 📄 tips.js
│       │
│       ├── 📁 CST203/
│       │   ├── 📄 tips.html                ← Python tips
│       │   ├── 📄 tips.css
│       │   └── 📄 tips.js
│       │
│       ├── 📁 CST205/
│       │   ├── 📄 tips.html                ← Data Structures tips
│       │   ├── 📄 tips.css
│       │   └── 📄 tips.js
│       │
│       ├── 📁 CST207/
│       │   ├── 📄 tips.html                ← CSO tips
│       │   ├── 📄 tips.css
│       │   └── 📄 tips.js
│       │
│       └── 📁 CST209/
│           ├── 📄 tips.html                ← Algorithms tips
│           ├── 📄 tips.css
│           └── 📄 tips.js
│
│
├── 📁 info/                                ← APP INFORMATION PAGES
│   ├── 📄 about.html                       ← About this app
│   ├── 📄 about.css
│   │
│   ├── 📄 usage-guide.html                 ← How to use the app
│   ├── 📄 usage-guide.css
│   │
│   ├── 📄 contact.html                     ← Contact/Feedback page
│   ├── 📄 contact.css
│   │
│   ├── 📄 credits.html                     ← Credits & acknowledgments
│   └── 📄 credits.css
│
│
└── 📁 _dev/                                ← DEVELOPMENT FILES (not for production)
    ├── 📄 README.md                        ← Developer notes & instructions
    ├── 📄 chat-progress.md                 ← Track what you built in which chat
    ├── 📄 structure-notes.md               ← Architecture decisions
    ├── 📄 syllabus.pdf                     ← Official syllabus PDF
    └── 📄 todo.txt                         ← Future improvements list
```

---

## The 5 Subjects Based on Actual Syllabus

```
CST201 → Computer Programming in C (2 credits)
         Unit 1: Basics of C
         Unit 2: Decision Control & Looping
         Unit 3: Arrays & Strings
         Unit 4: User Defined Functions
         Unit 5: Pointers in C

CST203 → Scripting Languages - Python (2 credits)
         Unit 1: Variables & Data Types
         Unit 2: Control Structures
         Unit 3: Functions, Modules & Packages
         Unit 4: File I/O & Regular Expressions
         Unit 5: Frameworks (Django)

CST205 → Data Structures (2 credits)
         Unit 1: Introduction to Data Structures
         Unit 2: Linear Data Structures (Stacks, Queues)
         Unit 3: Linked Lists
         Unit 4: Non-Linear Data Structures (Trees, Graphs)

CST207 → Computer System Organization (4 credits)
         Unit 1: Structure of Computers
         Unit 2: Microprogrammed Control
         Unit 3: Microprocessor Architecture (8086)
         Unit 4: Assembly Language Programming
         Unit 5: Memory & Digital Interfacing

CST209 → Algorithms (4 credits)
         Unit 1: Fundamentals of Algorithms
         Unit 2: Sorting Algorithms
         Unit 3: Searching Algorithms
         Unit 4: Graph Algorithms
         Unit 5: String Algorithms
```

---

## Data Structure Pattern

### Master Manifest (_data/manifest.json)
```json
{
  "semester": 3,
  "subjects": [
    {
      "code": "CST201",
      "name": "Computer Programming in C",
      "credits": 2,
      "folder": "CST201"
    },
    {
      "code": "CST203",
      "name": "Scripting Languages (Python)",
      "credits": 2,
      "folder": "CST203"
    },
    {
      "code": "CST205",
      "name": "Data Structures",
      "credits": 2,
      "folder": "CST205"
    },
    {
      "code": "CST207",
      "name": "Computer System Organization",
      "credits": 4,
      "folder": "CST207"
    },
    {
      "code": "CST209",
      "name": "Algorithms",
      "credits": 4,
      "folder": "CST209"
    }
  ],
  "years": [2021, 2022, 2023, 2024, 2025]
}
```

### Subject Metadata (_data/CST205/meta.json)
```json
{
  "code": "CST205",
  "name": "Data Structures",
  "credits": 2,
  "units": [
    {
      "unit": 1,
      "title": "Introduction to Data Structures",
      "topics": ["Basic Terminology", "Classification", "Operations"]
    },
    {
      "unit": 2,
      "title": "Linear Data Structures",
      "topics": ["Stacks", "Queues", "Recursion"]
    },
    {
      "unit": 3,
      "title": "Linked Lists",
      "topics": ["Singly", "Doubly", "Circular"]
    },
    {
      "unit": 4,
      "title": "Non-Linear Data Structures",
      "topics": ["Trees", "Graphs", "BFS", "DFS"]
    }
  ]
}
```

### Year Questions (_data/CST205/2023.json)
```json
{
  "year": 2023,
  "subject": "CST205",
  "questions": [
    {
      "id": "CST205-2023-Q1",
      "unit": 2,
      "topic": "Stack",
      "question": "What is a Stack? Explain PUSH and POP operations.",
      "answer": "A Stack is a linear data structure that follows LIFO...",
      "marks": 6,
      "type": "theory",
      "difficulty": "easy",
      "day": 5,
      "image": null
    },
    {
      "id": "CST205-2023-Q2",
      "unit": 3,
      "topic": "Singly Linked List",
      "question": "Write a C program to insert a node at beginning.",
      "answer": "```c\nvoid insertAtBeginning(...) {...}```",
      "marks": 6,
      "type": "practical",
      "difficulty": "medium",
      "day": 8,
      "image": null
    }
  ]
}
```

---

## Unit Page Structure (New Pattern)

### Common Files for Each Subject
```
subjects/CST205/units/common.css
subjects/CST205/units/common.js
```

### Individual Unit Files
```html
<!-- subjects/CST205/units/unit-2.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Unit 2: Linear Data Structures - CST205</title>
  <link rel="stylesheet" href="common.css">
  
  <!-- Unit-specific inline styles -->
  <style>
    .stack-diagram {
      border: 2px solid var(--accent-blue);
      padding: 1rem;
    }
    .queue-example {
      background: var(--bg-secondary);
    }
  </style>
</head>
<body>
  <!-- Content here -->
  
  <script src="common.js"></script>
  
  <!-- Unit-specific inline scripts -->
  <script>
    // Unit 2 specific functionality
    function demonstrateStack() {
      // ...
    }
  </script>
</body>
</html>
```

---

## How Data Flows Through The System

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
        │              ┌──────▼──────────────▼─────────────▼─────┐
        │              │  Fetch from _data/CST205/*.json         │
        │              │  Apply filter:                          │
        │              │   - day = 5                             │
        │              │   - difficulty = "medium"               │
        │              │   - year = 2023                         │
        │              └─────────────────────────────────────────┘
        │                                  │
        │                                  │
        ▼                                  ▼
  Show notes content              Show filtered questions
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

<svg class="icon">
  <use href="/assets/icons/sprite.svg#bookmark"></use>
</svg>

<svg class="icon">
  <use href="/assets/icons/sprite.svg#moon"></use>
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
```

---

## Development Strategy Across Chats

### Chat 1: Foundation
```
Build:
- index.html (dashboard)
- _templates/ (all template files)
- assets/icons/sprite.svg
- _data/manifest.json
- manifest.json (PWA)
- sw.js (service worker)
- offline.html

Deliverable: Working dashboard with navigation skeleton
```

### Chat 2-6: Individual Subjects
```
Pattern for each:
"Give me complete CST201 with all units"

Build:
- subjects/CST201/index.html
- subjects/CST201/units/common.css
- subjects/CST201/units/common.js
- subjects/CST201/units/unit-1.html (with inline specific styles)
- subjects/CST201/units/unit-2.html (with inline specific styles)
- ... all units
- subjects/CST201/resources/formula-sheet.html

Each subject is independent
Copy template structure
Add subject-specific content
```

### Chat 7: PYQ System
```
Build:
- pyq/index.html (subject + year selector)
- pyq/viewer.html (displays filtered questions)
- Complete filtering logic
- Uses _data/ JSONs built in Chat 1
```

### Chat 8: Practice System
```
Build:
- practice/index.html (roadmap + day selector)
- practice/session.html (active practice)
- Filters by day field in JSON
- Tracks progress in localStorage
```

### Chat 9: Quiz System
```
Build:
- quiz/index.html (subject + difficulty)
- quiz/play.html (quiz session)
- quiz/result.html (score + review)
- Filters by difficulty field in JSON
- Stores scores in localStorage
```

### Chat 10: Finishing Touches
```
Build:
- roadmap/
- bookmarks/
- suggestions/
- info/ pages
- Polish and testing
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

### 2. Progressive Enhancement
```
Works without JavaScript (basic content)
Enhanced with JavaScript (interactive features)
Works offline (service worker)
Installable as PWA (manifest.json)
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

---

## Storage Strategy

### What Goes in localStorage
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
  
  // Last visited
  "last-visited": {
    "CST201": "/subjects/CST201/units/unit-3.html",
    "CST205": "/subjects/CST205/units/unit-2.html"
  }
}
```

---

## File Count Summary

```
Root files:                     5
_templates/:                    4
assets/:                        8
_data/:                        31 (1 manifest + 5×6 subject files)
subjects/:                    105 (5 subjects × 21 files each)
  ↳ Each subject has:
    - 1 index (HTML+CSS+JS)
    - common.css + common.js for units
    - X unit HTML files (inline styles)
    - 1 formula sheet (HTML+CSS+JS)
pyq/:                           6
practice/:                      6
quiz/:                          9
roadmap/:                       3
bookmarks/:                     3
suggestions/:                  18
info/:                          8
_dev/:                          5

TOTAL:                        ~211 files
```

---

## What This Structure Solves

```
✅ Messy 2nd sem code        → Clean organized structure
✅ Scattered files           → Logical grouping
✅ Hard to maintain          → Each page independent
✅ Hard to add content       → Just add JSON entries
✅ Separate PYQ/Practice     → One data source filtered
✅ Emoji inconsistency       → SVG sprite system
✅ Multi-chat development    → Template-based approach
✅ Common CSS duplication    → common.css per subject
✅ Unit-specific styles      → Inline in unit HTML
```

---

## Next Steps

When you're ready to start building, begin a new chat and say:

**"Give me Chat 1: Foundation files"**

This will give you:
- Complete working dashboard
- All template files ready to copy
- SVG sprite with all icons
- Data structure setup
- PWA configuration

Then in subsequent chats, request each component one by one.

---

**This is the complete skeleton and discussion summary. You can use this as reference documentation throughout your multi-chat development process.**