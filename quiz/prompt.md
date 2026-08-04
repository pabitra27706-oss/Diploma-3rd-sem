# PROMPT FOR CODING CHAT — Quiz System HTML/CSS/JS

---

You are building a **self-contained quiz system** for a Diploma 3rd Semester Web App.

---

## Rules

```
✅ Create in parts
✅ Every part: 3 to 4 files minimum per reply
✅ Never stop in the middle of code
✅ Complete each file fully before moving to next
✅ System font stack only (no imports)
✅ Mobile-first responsive design
✅ Dark/light theme based on system preference
✅ Self-contained (no external dependencies)
```

---

## File Structure to Build

```
quiz/
  ├── index.html
  ├── setup.html
  ├── play.html
  ├── review.html
  ├── result.html
  ├── export.html
  ├── css/
  │   ├── common.css      ← Shared variables and base styles
  │   ├── index.css
  │   ├── setup.css
  │   ├── play.css
  │   ├── review.css
  │   ├── result.css
  │   └── export.css
  └── js/
      ├── common.js       ← Shared utilities
      ├── index.js
      ├── setup.js
      ├── play.js
      ├── review.js
      ├── result.js
      └── export.js
```

Total: 6 HTML + 7 CSS + 7 JS = **20 files**

---

## Design System

### Colors
```css
/* Light theme */
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--text-primary: #1a1a1a;
--text-secondary: #666666;
--accent: #3b82f6;        /* Blue */
--accent-hover: #2563eb;
--success: #10b981;
--error: #ef4444;
--warning: #f59e0b;
--border: #e5e5e5;

/* Dark theme */
--bg-primary: #1a1a1a;
--bg-secondary: #2d2d2d;
--text-primary: #ffffff;
--text-secondary: #a3a3a3;
--accent: #60a5fa;
--accent-hover: #3b82f6;
--success: #34d399;
--error: #f87171;
--warning: #fbbf24;
--border: #404040;
```

### Typography
```css
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
```

### Spacing
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
```

### Border Radius
```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-full: 9999px;
```

### Other
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--transition: 200ms ease;
```

---

## Complete Quiz System Specification

### Data Structure

Quiz questions are stored in:
```
_quiz-data/{SUBJECT}/unit-{N}.json
```

**Question ID format:** `CST205-U1-Q001`

**MCQ Question Fields:**
```json
{
  "id": "CST205-U1-Q001",
  "type": "mcq",
  "topic": "Stack Operations",
  "difficulty": "easy",
  "marks": 1,
  "year": 2023,
  "source": "PYQ",
  "tags": ["stack", "lifo"],
  "question": "Which principle does a Stack follow?",
  "options": {
    "A": "FIFO",
    "B": "LIFO",
    "C": "FILO",
    "D": "LILO"
  },
  "correct": "B",
  "explanation": "Stack follows LIFO..."
}
```

**Non-MCQ Question Fields:**
```json
{
  "id": "CST205-U1-Q003",
  "type": "theory",
  "topic": "Applications of Stacks",
  "difficulty": "medium",
  "marks": 6,
  "year": 2022,
  "source": "PYQ",
  "tags": ["stack", "applications"],
  "question": "Explain any three applications of Stack.",
  "modelAnswer": "1. Expression Evaluation...\n2. Function Call Stack..."
}
```

---

### Two Quiz Modes

**Mode 1: MCQ Only**
- Only MCQ questions
- Select options (A/B/C/D)
- Instant score after submission
- Review with explanations

**Mode 2: All Types**
- MCQ + theory + program + numerical + short
- Type answers in textarea
- Everything exported for AI evaluation
- No instant scoring

---

### Filters Available

```
Subject       → One subject OR "All Subjects Mix"
Unit          → All units / one unit / multiple units
Type          → Advanced filter (include/exclude types)
Difficulty    → Easy / Medium / Hard / Mixed
Marks         → Checkboxes (2,4,6,8,10) + Range presets (low/medium/high)
Year          → Filter actual years; original questions excluded if year used
Source        → PYQ only / Original only / Mixed
```

---

### Subject and Unit Display Names

**IMPORTANT: Always show full names in UI, never codes**

**Subjects:**
```javascript
const SUBJECTS = {
  "CST201": {
    code: "CST201",
    name: "Computer Programming in C",
    credits: 2,
    units: 5
  },
  "CST203": {
    code: "CST203",
    name: "Scripting Languages (Python)",
    credits: 2,
    units: 5
  },
  "CST205": {
    code: "CST205",
    name: "Data Structures",
    credits: 2,
    units: 4
  },
  "CST207": {
    code: "CST207",
    name: "Computer System Organization",
    credits: 4,
    units: 5
  },
  "CST209": {
    code: "CST209",
    name: "Algorithms",
    credits: 4,
    units: 5
  }
};
```

**Unit Titles by Subject:**

```javascript
const UNIT_TITLES = {
  "CST201": {
    1: "Basics of C",
    2: "Decision Control & Looping",
    3: "User Defined Functions",
    4: "Arrays & Strings",
    5: "Pointers in C"
  },
  "CST203": {
    1: "Variables & Data Types",
    2: "Control Structures",
    3: "Functions, Modules & Packages",
    4: "File I/O & Regular Expressions",
    5: "Frameworks (Django)"
  },
  "CST205": {
    1: "Introduction and Stacks",
    2: "Queues, Recursion and Linked Lists",
    3: "Trees and Graphs",
    4: "BST, Hashing and Shortest Path"
  },
  "CST207": {
    1: "Structure of Computers + Data Representation",
    2: "Control Unit + Pipelines",
    3: "Microprocessor Architecture (8086)",
    4: "Assembly Language Programming",
    5: "Memory & Digital Interfacing"
  },
  "CST209": {
    1: "Fundamentals + Complexity",
    2: "Sorting Algorithms",
    3: "Searching + BST + Hashing",
    4: "Graph Algorithms",
    5: "String Algorithms"
  }
};
```

**Display Logic:**

```javascript
// In filter UI, always show full names:
"Computer Programming in C" NOT "CST201"
"Unit 1: Basics of C" NOT "Unit 1"

// In subject selection dropdown:
<select name="subject">
  <option value="">Select Subject</option>
  <option value="CST201">Computer Programming in C</option>
  <option value="CST203">Scripting Languages (Python)</option>
  <option value="CST205">Data Structures</option>
  <option value="CST207">Computer System Organization</option>
  <option value="CST209">Algorithms</option>
  <option value="all">All Subjects Mix</option>
</select>

// In unit checkboxes (example for CST201):
<label>
  <input type="checkbox" name="unit" value="1">
  Unit 1: Basics of C
</label>
<label>
  <input type="checkbox" name="unit" value="2">
  Unit 2: Decision Control & Looping
</label>
// ... up to 5 units

// After subject selection, show only valid units:
// If CST205 selected → show only 4 units
// If others selected → show 5 units

// Dynamic unit rendering:
function renderUnits(subjectCode) {
  const unitCount = SUBJECTS[subjectCode].units;
  const titles = UNIT_TITLES[subjectCode];
  
  for (let i = 1; i <= unitCount; i++) {
    // render checkbox with title
  }
}
```

---

### Quiz Flow

```
1. index.html → Quiz home
   - Quick presets (10 MCQ test, Unit quiz, PYQ quiz)
   - Advanced filters button

2. setup.html → Advanced setup page
   - All filters
   - Mode selection
   - Question count: 5/10/15/20/Custom or Auto
   - Order: Random or Grouped
   - Balance: Random or Balanced
   - Timer: Optional, auto-calculated by marks, user adjustable
   - Start Quiz button

3. play.html → Quiz play screen
   - One question per screen
   - Question palette (Q1 Q2 Q3... with status colors)
   - Navigation: Previous / Next / Skip
   - Timer (if enabled)
   - Submit button
   - Autosave to localStorage

4. review.html → Review page (All Types mode only)
   - See all questions
   - See typed answers
   - Edit if needed
   - Export button

5. result.html → Result page
   - MCQ mode: Score + time + accuracy + question review
   - All Types mode: Redirect to export
   
6. export.html → Export page
   - Format selection: TXT / MD / JSON
   - Filename preview: {subject}-{unit}-{mode}-{count}q-{date}.md
   - Download button
   - History button
```

---

### Key Features

**Question Palette**
```
Show: Q1 Q2 Q3 Q4...
Colors:
  - Answered: green
  - Unanswered: gray
  - Current: blue border
Tap to jump to question
```

**Timer**
```
Optional
Default calculation:
  - 1 mark = 1 min
  - 2 marks = 2 min
  - 4 marks = 3 min
  - 6 marks = 4 min
  - 8+ marks = 5 min
User can adjust before starting
Shows countdown
Warning at 5 min remaining
Auto-submit at 0
```

**Autosave**
```
Save to localStorage every answer
Key: quiz-autosave-{timestamp}
Resume option on page load if autosave exists
```

**Answer Input**
```
MCQ: Radio buttons styled as option cards

Non-MCQ:
  - Program type → <textarea> with monospace font
  - Others → normal <textarea>
  - Auto-resize as user types
```

**Explanation Visibility (MCQ Result)**
```
Toggle buttons:
  - Show All
  - Wrong Only
  - Hide All
Default: Show All
```

**Quiz History**
```
localStorage key: quiz-history

Save:
  - Date
  - Mode
  - Subject (display full name in history)
  - Unit (display unit title in history)
  - Filters
  - Score (if MCQ)
  - Question IDs
  - User answers

History page shows list with full names
Tap to view past quiz
Retry options: Exact / Reshuffled / Fresh Similar
```

**Export File Content**

**For All Types mode (MD format example):**
```markdown
# Quiz Evaluation Request

## Instructions for AI
Evaluate the following quiz answers based on concept coverage, not exact wording.

**Scoring Rubric:**
- Award marks based on understanding shown
- Give partial marks for incomplete answers
- Note missing key points
- Suggest improvements

**Expected Output Format:**
For each question:
- Marks awarded / Total marks
- Missing points (if any)
- Improved answer suggestion

At the end:
- Total score
- Overall feedback

---

## Quiz Details
- Subject: Data Structures
- Unit: Unit 1: Introduction and Stacks
- Mode: All Types
- Total Questions: 10
- Date: 2025-01-15

---

## Question 1 (6 marks)
**Question:** Explain any three applications of Stack.

**User Answer:**
[User's typed answer here]

**Model Answer:**
[Model answer from JSON]

---

[Repeat for all questions]
```

**For MCQ mode export:**
```markdown
# MCQ Quiz Results

## Quiz Details
- Subject: Data Structures
- Unit: Unit 1: Introduction and Stacks
- Score: 8/10
- Date: 2025-01-15

---

## Question 1
**Question:** Which principle does a Stack follow?

**Your answer:** B
**Correct answer:** B
**Status:** ✓ Correct

---

[Repeat for all questions]
```

---

### localStorage Keys

```javascript
{
  "quiz-theme": "dark",
  "quiz-autosave-1705334400000": { /* current quiz state */ },
  "quiz-history": [ /* array of past quizzes */ ],
  "quiz-settings": {
    "defaultTimer": true,
    "soundEnabled": false
  }
}
```

---

### Filter Logic Examples

**Subject Filter:**
```javascript
// One subject
filter = { subject: "CST205" }

// All subjects mix
filter = { subject: "all" }
```

**Unit Filter:**
```javascript
// One unit
filter = { unit: 1 }

// Multiple units
filter = { unit: [1, 2, 3] }

// All units
filter = { unit: "all" }
```

**Source Filter:**
```javascript
// PYQ only
filter = { source: "PYQ" }

// Original only
filter = { source: "original" }

// Mixed
filter = { source: "all" }
```

**Year Filter:**
```javascript
// Specific year (excludes original questions)
filter = { year: 2023 }

// No year filter (includes all)
filter = { year: null }
```

---

### Empty States

**No questions found:**
```html
<div class="empty-state">
  <p>No questions found matching your filters.</p>
  <button>Edit Filters</button>
</div>
```

**Fewer questions than requested:**
```html
<div class="confirmation">
  <p>Only 7 questions available. Continue with 7 or edit filters?</p>
  <button>Continue</button>
  <button>Edit Filters</button>
</div>
```

---

### Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

---

### Common Components to Build

**Button styles:**
```
.btn-primary   → accent color
.btn-secondary → gray
.btn-success   → green
.btn-danger    → red
.btn-outline   → border only
```

**Card component:**
```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
</div>
```

**Question card:**
```html
<div class="question-card">
  <div class="question-header">
    <span class="question-number">Q1</span>
    <span class="question-marks">6 marks</span>
  </div>
  <div class="question-body">
    <p class="question-text">...</p>
  </div>
</div>
```

**Option card (MCQ):**
```html
<label class="option-card">
  <input type="radio" name="q1" value="A">
  <span class="option-label">A</span>
  <span class="option-text">FIFO</span>
</label>
```

**Question palette:**
```html
<div class="question-palette">
  <button class="palette-item answered">1</button>
  <button class="palette-item current">2</button>
  <button class="palette-item unanswered">3</button>
</div>
```

---

### JavaScript Common Utilities (js/common.js)

```javascript
// Subject and Unit data
const SUBJECTS = { /* as defined above */ };
const UNIT_TITLES = { /* as defined above */ };

// Get full subject name
function getSubjectName(code) { }

// Get unit title
function getUnitTitle(subjectCode, unitNumber) { }

// Theme management
function initTheme() { }
function toggleTheme() { }

// localStorage helpers
function saveToStorage(key, data) { }
function getFromStorage(key) { }
function clearStorage(key) { }

// Date formatting
function formatDate(date) { }
function getTimestamp() { }

// Question filtering
function filterQuestions(questions, filters) { }

// Quiz state management
function saveQuizState(state) { }
function loadQuizState() { }
function clearQuizState() { }

// Timer utilities
function startTimer(duration, callback) { }
function pauseTimer() { }
function resumeTimer() { }

// Export generation
function generateExport(format, data) { }
function downloadFile(filename, content) { }

// History management
function saveToHistory(quiz) { }
function getHistory() { }
function clearHistory() { }
```

---

## Build Order

**Part 1 (Reply 1):**
- quiz/css/common.css
- quiz/js/common.js
- quiz/index.html
- quiz/css/index.css

**Part 2 (Reply 2):**
- quiz/js/index.js
- quiz/setup.html
- quiz/css/setup.css
- quiz/js/setup.js

**Part 3 (Reply 3):**
- quiz/play.html
- quiz/css/play.css
- quiz/js/play.js

**Part 4 (Reply 4):**
- quiz/review.html
- quiz/css/review.css
- quiz/js/review.js

**Part 5 (Reply 5):**
- quiz/result.html
- quiz/css/result.css
- quiz/js/result.js

**Part 6 (Reply 6):**
- quiz/export.html
- quiz/css/export.css
- quiz/js/export.js

---

## Additional Notes

- All navigation between pages should use standard `<a>` links
- No framework dependencies
- Vanilla JavaScript only
- CSS Grid and Flexbox for layouts
- Accessible HTML (ARIA labels where needed)
- Smooth transitions (200ms ease)
- Touch-friendly tap targets (min 44px)
- Form validation with clear error messages
- Always use full subject names and unit titles in UI
- Store codes internally but display names to users

---

**Start with Part 1. Build complete files. No truncation.**

---

**END OF PROMPT**