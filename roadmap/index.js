/* ============================================================
   ROADMAP PAGE — index.js
   ============================================================ */

'use strict';

/* ── Storage key ── */
const STORAGE_KEY = 'practice-progress';

/* ── Subject meta ── */
const SUBJECT_META = {
  CST201: 'Computer Programming in C',
  CST203: 'Scripting Languages (Python)',
  CST205: 'Data Structures',
  CST207: 'Computer System Organization',
  CST209: 'Algorithms',
};

/* ============================================================
   ROADMAP DATA — 10 days × 5 subjects
   ============================================================ */
const ROADMAP = [
  {
    day: 1,
    title: 'Foundations',
    subjects: {
      CST201: [
        'History of C',
        'Structure of C program',
        'C character set',
        'Tokens, Constants, Variables, Keywords',
        'Data types',
      ],
      CST203: [
        'History and Features of Python',
        'Basic Syntax',
        'Variables',
        'Numeric data types — int, float, complex',
      ],
      CST205: [
        'Basic Terminology',
        'Classification of Data Structures',
        'Operations on Data Structures',
      ],
      CST207: [
        'Computer Functional units',
        'Von-Neumann architecture',
        'Bus structures',
        'Basic Operational Concepts',
      ],
      CST209: [
        'Definitions and Characteristics of Algorithm',
        'Data Abstraction',
        'Sets, Multisets',
      ],
    },
  },

  {
    day: 2,
    title: 'Operators, Expressions & Complexity',
    subjects: {
      CST201: [
        'All Operators — arithmetic, logical, relational, assignment, bitwise, ternary, increment/decrement',
        'Operator precedence and Associativity',
        'Formatted I/O',
        'Type conversion and Typecasting',
      ],
      CST203: [
        'String data type, operations, methods',
        'Unicode string literals',
        'Converting between simple types',
        'Converting to strings and String formatting',
        'Understanding coding blocks',
        'Tuples, Lists (defining and slicing), Dictionary',
        'All Operators — arithmetic, relational, assignment, logical, bitwise, membership, identity',
      ],
      CST205: [
        'Introduction to Stacks',
        'Array Representation of Stacks',
        'Stack Operations — Push and Pop',
        'Applications of Stacks',
        'Infix-to-Postfix Transformation',
        'Evaluating Postfix Expressions',
      ],
      CST207: [
        'Data representation — Fixed point and Floating point',
        'Error detecting codes',
        'Register Transfer',
        'Memory transfers',
      ],
      CST209: [
        'Asymptotic Notations — Big-O, Omega, Theta',
        'Time Complexity, Space Complexity',
        'Best case, Average case, Worst case analysis',
      ],
    },
  },

  {
    day: 3,
    title: 'Control Flow & Linear DS',
    subjects: {
      CST201: [
        'if, if-else, else-if ladder, nested if-else',
        'Switch case, goto',
        'while, do-while, for loop',
        'Break, continue, Nested loops',
        'Entry and Exit controlled loops',
      ],
      CST203: [
        'Conditional blocks — if, else, elif',
        'For loops, While loops',
        'Loop manipulation — break, continue, else, pass',
      ],
      CST205: [
        'Introduction to Queues',
        'Array Representation of Queues',
        'Queue Operations — Enqueue and Dequeue',
        'Circular Queue, De-Queue',
        'Recursion — GCD, Tower of Hanoi',
        'Round Robin Algorithm',
        'Applications of Queues',
      ],
      CST207: [
        'Arithmetic micro-operations',
        'Logic micro-operations',
        'Shift micro-operations',
        'Arithmetic logic shift unit',
      ],
      CST209: [
        'Bubble Sort',
        'Selection Sort',
        'Insertion Sort',
        'Shell Sort',
        'Complexity analysis of basic sorts',
      ],
    },
  },

  {
    day: 4,
    title: 'Arrays, Strings & Advanced Sorting',
    subjects: {
      CST201: [
        '1D and 2D arrays, Multidimensional arrays',
        'Character arrays and Strings in C',
        'String functions — strlen, strcpy, strcat, strcmp',
        'Substring extraction, concatenation, replacement',
      ],
      CST203: [
        'Defining and Calling Functions',
        'Pass by object reference',
        'Parameters — arbitrary, optional, named',
        'Variable Scope — Local, Nonlocal, Global',
      ],
      CST205: [
        'Singly Linked List and Representation in Memory',
        'Add node — beginning, in-between, end',
        'Delete node — beginning, in-between, end',
        'Circular Linked List Operations',
      ],
      CST207: [
        'Control memory and Address sequencing',
        'Design of control unit',
        'Addition and Subtraction algorithms',
      ],
      CST209: [
        'Merge Sort',
        'Quick Sort',
        'Heapsort',
        'Count Sort, Bucket Sort, Radix Sort',
        'Complexity analysis of all advanced sorts',
      ],
    },
  },

  {
    day: 5,
    title: 'Functions, Modules & Linked Lists',
    subjects: {
      CST201: [
        'Definition of functions and Prototype declaration',
        'Scope and lifetime of variables',
        'Storage Classes — Auto, Extern, Static, Register',
        'Call by value vs Call by reference',
      ],
      CST203: [
        'Importing own and external modules',
        'Packages',
        'Passing arguments from a tuple',
        'Class scope',
        'Date and Time',
        'Advanced string operations',
        'List manipulation — split, join, copying',
      ],
      CST205: [
        'Doubly Linked List — add/delete at beginning, in-between, end',
        'Circular Double Linked List',
        'Linked List Representation of Stack and Queue',
        'Stack operations using Linked List',
      ],
      CST207: [
        'Multiplication and Division algorithms',
        'Floating-point arithmetic operation',
        'Arithmetic Pipeline, Instruction Pipeline, RISC Pipeline',
      ],
      CST209: [
        'Linear Search',
        'Binary Search',
        'Divide and Conquer strategy',
        'Greedy Methods overview',
        'Dynamic Programming overview',
      ],
    },
  },

  {
    day: 6,
    title: 'Recursion, File I/O & Trees',
    subjects: {
      CST201: [
        'Recursion and memory stack',
        'Types of recursion',
        'Recursion vs Iteration',
        'Applications of recursion',
      ],
      CST203: [
        'Accessing Keyboard Input — raw_input and input()',
        'File modes and permissions',
        'open(), close(), read(), readline(), readlines()',
        'write(), writelines()',
        'tell(), seek(), flush()',
        'fileno(), isatty(), next()',
        'Redirecting output streams to files',
      ],
      CST205: [
        'Introduction to Trees and Basic Terminologies',
        'Binary Trees — Array and Linked List Representation',
        'Insertion and Deletion in Binary Tree',
        'Inorder, Preorder, Postorder Traversal',
      ],
      CST207: [
        'Vector Processing and Array Processors',
        'Introduction to Intel 8086',
        'Block diagram, Pin functions, Register structure',
        'Segmentation',
      ],
      CST209: [
        'Binary Search Trees and BST Algorithms',
        'Searching Complexity',
        'Balanced Search Trees',
        'Hashing, Hash Tables, Hash functions',
        'Collision resolution techniques',
        'Symbol Tables',
      ],
    },
  },

  {
    day: 7,
    title: 'Pointers, Regex & Advanced Trees',
    subjects: {
      CST201: [
        'Pointers, Null Pointers, Generic Pointers',
        'Pointer arithmetic',
        'Pointers and arrays, Passing array to function',
        'Pointers and Strings, Array of pointers',
        'Constant pointers, Function pointers, Pointer to pointer',
      ],
      CST203: [
        're.match(), re.search(), re.findall()',
        're.finditer(), re.compile()',
        're.sub(), re.split()',
      ],
      CST205: [
        'Types of Binary Trees',
        'B-Tree, AVL Tree',
        'Introduction to Graphs and Graph Terminologies',
        'Representation of Graphs — Set, Linked, Matrix',
      ],
      CST207: [
        'Interrupt mechanism',
        'Addressing modes of 8086',
        'Instructions of 8086',
        'Simple Assembly programs',
        'Logical, branch, and call instructions',
      ],
      CST209: [
        'Directed and Undirected graphs',
        'Paths, Cycles, Spanning trees',
        'Directed Acyclic Graphs',
        'Topological Sorting',
      ],
    },
  },

  {
    day: 8,
    title: 'Dynamic Memory, Django & Graph Algorithms',
    subjects: {
      CST201: [
        'Dynamic memory allocation — malloc, calloc, realloc, free',
        'Pointer to a structure',
      ],
      CST203: [
        'What is Django, MVC framework',
        'Creating URL in Django',
        'Django Templates and Sending data to template',
        'Creating HTML forms, Handling form data',
        'Creating Django forms, Form Validation',
        'Model-based forms',
        'Display object lists in templates',
        'Filters, Base templates, Static files',
        'Widget usage, Customize error messages',
      ],
      CST205: [
        'Breadth First Search — BFS with Applications',
        'Depth First Search — DFS with Applications',
      ],
      CST207: [
        'Assembly programs for sorting',
        'Evaluation of arithmetic expressions in Assembly',
        'String manipulation in Assembly',
        'Assembler directives',
        'Procedures and Macros in Assembly',
      ],
      CST209: [
        "Minimum Spanning Tree — Prim's Algorithm",
        "Minimum Spanning Tree — Kruskal's Algorithm",
        'MST examples and trace',
      ],
    },
  },

  {
    day: 9,
    title: 'Complete Remaining Topics',
    subjects: {
      CST201: [
        'Complete Unit 5 review — all pointer types',
        'DMA complete revision',
        'Structure with pointers',
      ],
      CST203: [
        'Django Advanced complete revision',
        'Complete Unit 5 review',
      ],
      CST205: [
        "Dijkstra's Shortest Path Algorithm",
        'Bellman-Ford Algorithm',
        'Floyd-Warshall all-pairs shortest path',
      ],
      CST207: [
        'Memory and Digital Interfacing',
        'Addressing and address decoding',
        'Interfacing RAM, ROM, EPROM',
        'Programmable Peripheral Interface',
        'Cache Memory — Mapping and Hit ratio',
        'Virtual Memory, TLB',
      ],
      CST209: [
        'String Sort, Tries',
        'Search a Substring within a string',
        'Naive String Matching Algorithm',
        'Rabin-Karp Algorithm',
        'Knuth-Morris-Pratt (KMP) Algorithm',
        'Horspool String Matching Algorithm',
        'Boyer-Moore String Matching Algorithm',
        'Regular Expressions in Algorithms',
        'Elementary Data Compression',
      ],
    },
  },

  {
    day: 10,
    title: 'Full Theory Revision',
    subjects: {
      CST201: [
        'Data types → Operators → Control flow',
        'Arrays → Strings → Functions → Recursion',
        'Pointers → Dynamic Memory Allocation',
      ],
      CST203: [
        'Data types → String formatting → Control flow',
        'Functions → Modules → File I/O → Regex → Django',
      ],
      CST205: [
        'Stack → Queue → Linked Lists',
        'Trees → Graphs → Hashing → Shortest Paths',
      ],
      CST207: [
        'Architecture → Data representation → Micro-operations',
        'Pipelining → 8086 → Assembly → Memory',
      ],
      CST209: [
        'Complexity → Sorting → Searching → BST → Hashing',
        'Graph algorithms → String matching → Compression',
      ],
    },
  },
];

/* ============================================================
   STATE
   ============================================================ */
let progress   = {};   // { 'day-1': true, 'day-3': true, ... }
let activeFilter = 'all';

/* ============================================================
   PROGRESS HELPERS
   ============================================================ */
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    progress = raw ? JSON.parse(raw) : {};
  } catch {
    progress = {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function toggleDay(dayKey) {
  progress[dayKey] = !progress[dayKey];
  saveProgress();
  renderAll();
}

function resetProgress() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  progress = {};
  saveProgress();
  renderAll();
}

/* ============================================================
   RENDER
   ============================================================ */
function renderAll() {
  renderCards();
  renderProgressBar();
}

/* ── Progress bar ── */
function renderProgressBar() {
  const done  = Object.values(progress).filter(Boolean).length;
  const total = ROADMAP.length;                          // 10
  const pct   = Math.round((done / total) * 100);

  document.getElementById('days-done').textContent   = done;
  document.getElementById('days-left').textContent   = total - done;
  document.getElementById('progress-pct').textContent = pct + '%';

  const fill = document.getElementById('progress-fill');
  fill.style.width = pct + '%';

  const bar = document.getElementById('overall-bar');
  bar.setAttribute('aria-valuenow', pct);
}

/* ── Day cards ── */
function renderCards() {
  const container = document.getElementById('roadmap-container');
  container.innerHTML = '';

  ROADMAP.forEach(dayData => {
    const key       = `day-${dayData.day}`;
    const isDone    = !!progress[key];
    const isOpen    = dayData._open || false;

    const card = document.createElement('article');
    card.className  = 'day-card' + (isDone ? ' completed' : '') + (isOpen ? ' open' : '');
    card.dataset.day = dayData.day;

    /* ── Header ── */
    const header = document.createElement('div');
    header.className = 'day-header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    header.innerHTML = `
      <div class="day-number">${isDone ? '✓' : dayData.day}</div>
      <div class="day-info">
        <div class="day-title">Day ${dayData.day} — ${dayData.title}</div>
        <div class="day-subtitle">${Object.keys(dayData.subjects).length} subjects</div>
      </div>
      <div class="day-actions">
        <button class="btn-done" data-key="${key}" aria-label="${isDone ? 'Mark incomplete' : 'Mark complete'}">
          ${isDone ? 'Done ✓' : 'Mark Done'}
        </button>
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    `;

    /* ── Body ── */
    const body = document.createElement('div');
    body.className = 'day-body';

    Object.entries(dayData.subjects).forEach(([code, topics]) => {
      const hidden = (activeFilter !== 'all' && activeFilter !== code) ? ' hidden' : '';
      const row = document.createElement('div');
      row.className = `subject-row${hidden}`;
      row.dataset.subject = code;

      row.innerHTML = `
        <div class="subject-label">
          <span class="subject-pill pill-${code}">${code}</span>
          <span class="subject-name">${SUBJECT_META[code] || code}</span>
        </div>
        <ul class="topic-list">
          ${topics.map(t => `
            <li class="topic-item">
              <span class="topic-dot dot-${code}"></span>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      `;

      body.appendChild(row);
    });

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);

    /* ── Toggle open/close on header click ── */
    header.addEventListener('click', e => {
      /* Don't toggle card if "Mark Done" button was clicked */
      if (e.target.closest('.btn-done')) return;
      dayData._open = !dayData._open;
      card.classList.toggle('open', dayData._open);
      header.setAttribute('aria-expanded', dayData._open ? 'true' : 'false');
    });

    /* ── Keyboard support ── */
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });

    /* ── Mark Done button ── */
    const btnDone = header.querySelector('.btn-done');
    btnDone.addEventListener('click', e => {
      e.stopPropagation();
      toggleDay(key);
    });
  });
}

/* ============================================================
   FILTER
   ============================================================ */
function applyFilter(subject) {
  activeFilter = subject;

  /* Update button states */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subject === subject);
  });

  /* Show/hide subject rows */
  document.querySelectorAll('.subject-row').forEach(row => {
    const match = subject === 'all' || row.dataset.subject === subject;
    row.classList.toggle('hidden', !match);
  });
}

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  const saved = localStorage.getItem('theme');
  const pref  = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', saved || pref);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  initTheme();
  loadProgress();
  renderAll();

  /* Theme toggle */
  document.getElementById('btn-theme')
    .addEventListener('click', toggleTheme);

  /* Back button */
  document.getElementById('btn-back')
    .addEventListener('click', () => history.back());

  /* Filter buttons */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.subject));
  });

  /* Reset */
  document.getElementById('btn-reset')
    .addEventListener('click', resetProgress);
}

document.addEventListener('DOMContentLoaded', init);