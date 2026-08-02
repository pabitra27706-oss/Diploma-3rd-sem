/**
 * Main Application Logic
 * Diploma 3rd Sem - Study Hub
 */

// ================================
// App Configuration
// ================================

var APP_CONFIG = {
  version: '1.0.0',
  examDate: new Date(2025, 4, 15),
  streakGracePeriodHours: 26,
  toastDuration: 3500,
  skeletonDelay: 600
};

// ================================
// App State
// ================================

var APP_STATE = {
  studentName: '',
  lastVisited: {},
  subjects: [
    {
      code: 'CST201',
      name: 'Computer Programming in C',
      shortName: 'C Programming',
      credits: 2,
      units: 5,
      color: '#3b82f6',
      colorLight: '#60a5fa',
      colorRgb: '59, 130, 246',
      path: 'subjects/CST201/index.html'
    },
    {
      code: 'CST203',
      name: 'Scripting Languages (Python)',
      shortName: 'Python',
      credits: 2,
      units: 5,
      color: '#10b981',
      colorLight: '#34d399',
      colorRgb: '16, 185, 129',
      path: 'subjects/CST203/index.html'
    },
    {
      code: 'CST205',
      name: 'Data Structures',
      shortName: 'Data Structures',
      credits: 2,
      units: 4,
      color: '#8b5cf6',
      colorLight: '#a78bfa',
      colorRgb: '139, 92, 246',
      path: 'subjects/CST205/index.html'
    },
    {
      code: 'CST207',
      name: 'Computer System Organization',
      shortName: 'CSO',
      credits: 4,
      units: 5,
      color: '#f59e0b',
      colorLight: '#fbbf24',
      colorRgb: '245, 158, 11',
      path: 'subjects/CST207/index.html'
    },
    {
      code: 'CST209',
      name: 'Algorithms',
      shortName: 'Algorithms',
      credits: 4,
      units: 5,
      color: '#ec4899',
      colorLight: '#f472b6',
      colorRgb: '236, 72, 153',
      path: 'subjects/CST209/index.html'
    }
  ],

  // ================================
  // 10-Day Theory Roadmap
  // ================================

  roadmap: [
    {
      day: 1,
      theme: 'Foundations',
      difficulty: 'easy',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'History of C',
            'Structure of C program',
            'C character set',
            'Tokens',
            'Constants',
            'Variables',
            'Keywords',
            'Data types'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'History of Python',
            'Features of Python',
            'Basic Syntax',
            'Variables',
            'Numeric data types (int, float, complex)'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Basic Terminology',
            'Classification of Data Structures',
            'Operations on Data Structures'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Computer Functional units',
            'Von-Neumann architecture',
            'Bus structures',
            'Basic Operational Concepts'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Definitions and Characteristics of Algorithm',
            'Examples of Algorithms',
            'Data Abstraction',
            'Sets',
            'Multisets'
          ]
        }
      ]
    },

    {
      day: 2,
      theme: 'Operators, Expressions and Complexity',
      difficulty: 'easy',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Arithmetic operators',
            'Logical operators',
            'Relational operators',
            'Assignment operators',
            'Bitwise operators',
            'Ternary operator',
            'Increment and Decrement operators',
            'Operator precedence and Associativity',
            'Formatted I/O',
            'Type conversion',
            'Typecasting'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'String data type',
            'String operations',
            'String methods',
            'Unicode string literals',
            'Converting between simple types',
            'Converting to strings',
            'String formatting',
            'Understanding coding blocks',
            'Tuples',
            'Lists (defining and slicing)',
            'Dictionary',
            'All Operators'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Introduction to Stacks',
            'Array Representation of Stacks',
            'Stack Operations (Push and Pop)',
            'Applications of Stacks',
            'Infix-to-Postfix Transformation',
            'Evaluating Postfix Expressions'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Data representation - Fixed point',
            'Data representation - Floating point',
            'Error detecting codes',
            'Register Transfer',
            'Memory transfers'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Asymptotic Notations - Big-O',
            'Asymptotic Notations - Omega',
            'Asymptotic Notations - Theta',
            'Time Complexity',
            'Space Complexity',
            'Best case analysis',
            'Average case analysis',
            'Worst case analysis'
          ]
        }
      ]
    },

    {
      day: 3,
      theme: 'Control Flow and Linear Data Structures',
      difficulty: 'medium',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'if statement',
            'if-else statement',
            'else-if ladder',
            'Nested if-else',
            'Switch case statement',
            'goto statement',
            'while loop',
            'do-while loop',
            'for loop',
            'Break and continue',
            'Nested loops'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'if, else, elif blocks',
            'For loops',
            'While loops',
            'break statement',
            'continue statement',
            'else in loops',
            'pass statement'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Introduction to Queues',
            'Array Representation of Queues',
            'Queue Operations (Enqueue and Dequeue)',
            'Circular Queue',
            'De-Queue (Double Ended Queue)',
            'Recursion - GCD',
            'Recursion - Tower of Hanoi',
            'Round Robin Algorithm'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Arithmetic micro-operations',
            'Logic micro-operations',
            'Shift micro-operations',
            'Arithmetic logic shift unit'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Bubble Sort',
            'Selection Sort',
            'Insertion Sort',
            'Shell Sort',
            'Complexity analysis of basic sorts'
          ]
        }
      ]
    },

    {
      day: 4,
      theme: 'Arrays, Strings and Advanced Sorting',
      difficulty: 'medium',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Advantages of arrays',
            'Declaration and initialization of 1D arrays',
            'Declaration and initialization of 2D arrays',
            'Character arrays',
            'Strings in C',
            'strlen()',
            'strcpy()',
            'strcat()',
            'strcmp()',
            'Substring extraction',
            'String concatenation',
            'String replacement'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'Defining functions',
            'Calling functions',
            'Pass by object reference',
            'Function parameters',
            'Arbitrary arguments',
            'Optional arguments',
            'Named arguments',
            'Local scope',
            'Nonlocal scope',
            'Global scope'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Singly Linked List',
            'Representation in Memory',
            'Add node at beginning',
            'Add node in between',
            'Add node at end',
            'Delete node at beginning',
            'Delete node in between',
            'Delete node at end',
            'Circular Linked List operations'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Control memory',
            'Address sequencing',
            'Design of control unit',
            'Addition algorithm',
            'Subtraction algorithm'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Merge Sort',
            'Quick Sort',
            'Heapsort',
            'Count Sort',
            'Bucket Sort',
            'Radix Sort',
            'Complexity analysis of all sorting algorithms'
          ]
        }
      ]
    },

    {
      day: 5,
      theme: 'Functions, Modules and Linked Lists',
      difficulty: 'medium',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Definition of functions',
            'Prototype declaration',
            'Scope of variables',
            'Lifetime of variables',
            'Auto storage class',
            'Extern storage class',
            'Static storage class',
            'Register storage class',
            'Call by value',
            'Call by reference'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'Importing own modules',
            'Importing external modules',
            'Packages',
            'Passing arguments from a tuple',
            'Class scope',
            'Date and Time',
            'Advanced string operations',
            'List split',
            'List join',
            'List copying'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Doubly Linked List - add at beginning',
            'Doubly Linked List - add in between',
            'Doubly Linked List - add at end',
            'Doubly Linked List - delete operations',
            'Circular Double Linked List',
            'Linked List Representation of Stack',
            'Linked List Representation of Queue',
            'Operations of Stack using Linked List'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Multiplication algorithm',
            'Division algorithm',
            'Floating-point arithmetic operation',
            'Arithmetic Pipeline',
            'Instruction Pipeline',
            'RISC Pipeline'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Linear Search',
            'Binary Search',
            'Divide and Conquer strategy',
            'Greedy Methods overview',
            'Dynamic Programming overview'
          ]
        }
      ]
    },

    {
      day: 6,
      theme: 'Recursion, File I/O and Trees',
      difficulty: 'hard',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Recursion and memory stack',
            'Types of recursion',
            'Recursion vs Iteration',
            'Applications of recursion'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'Accessing Keyboard Input - raw_input',
            'Accessing Keyboard Input - input()',
            'File modes and permissions',
            'open() and close()',
            'read() and readline()',
            'readlines()',
            'write() and writelines()',
            'tell() and seek()',
            'flush()',
            'fileno()',
            'isatty()',
            'next()',
            'Redirecting output streams to files'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Introduction to Trees',
            'Basic Tree Terminologies',
            'Definition and Concepts of Binary Trees',
            'Array Representation of Binary Tree',
            'Linked List Representation of Binary Tree',
            'Insertion in Binary Tree',
            'Deletion in Binary Tree',
            'Inorder Traversal',
            'Preorder Traversal',
            'Postorder Traversal'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Vector Processing',
            'Array Processors',
            'Introduction to Intel 8086',
            'Block diagram of 8086',
            'Pin functions of 8086',
            'Register structure of 8086',
            'Segmentation'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Binary Search Trees',
            'BST Algorithms',
            'BST Searching - Time and Space Complexity',
            'Balanced Search Trees',
            'Hashing',
            'Hash Tables',
            'Hash functions',
            'Collision resolution techniques',
            'Symbol Tables'
          ]
        }
      ]
    },

    {
      day: 7,
      theme: 'Pointers, Regex and Advanced Trees',
      difficulty: 'hard',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Understanding Pointers',
            'Null Pointers',
            'Generic Pointers',
            'Pointer arithmetic',
            'Pointers and arrays',
            'Passing array to function',
            'Array name and Pointer',
            'Pointers and Strings',
            'Array of pointers',
            'Constant pointers',
            'Pointer to a constant',
            'Function pointers',
            'Pointer to a pointer'
          ]
        },
        {
          code: 'CST203',
          topics: [
            're.match()',
            're.search()',
            're.findall()',
            're.finditer()',
            're.compile()',
            're.sub()',
            're.split()'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Types of Binary Trees',
            'B-Tree',
            'AVL Tree',
            'Introduction to Graphs',
            'Graph Terminologies',
            'Set Representation of Graphs',
            'Linked Representation of Graphs',
            'Matrix Representation of Graphs'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Interrupt mechanism',
            'Addressing modes of 8086',
            'Instructions of 8086',
            'Simple Assembly programs',
            'Logical instructions',
            'Branch instructions',
            'Call instructions'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Directed graphs',
            'Undirected graphs',
            'Paths and Cycles',
            'Spanning trees',
            'Directed Acyclic Graphs',
            'Topological Sorting'
          ]
        }
      ]
    },

    {
      day: 8,
      theme: 'Dynamic Memory, Django and Graph Algorithms',
      difficulty: 'hard',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Dynamic memory allocation - malloc()',
            'Dynamic memory allocation - calloc()',
            'Dynamic memory allocation - realloc()',
            'free()',
            'Pointer to a structure'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'What is Django',
            'MVC framework',
            'Creating URL in Django',
            'Django Templates',
            'Sending data to template',
            'Creating HTML forms',
            'Handling form data',
            'Creating Django forms',
            'Form Validation',
            'Model-based forms',
            'Display object lists in templates',
            'Filters in templates',
            'Base templates',
            'Inserting static files',
            'Validating and manipulating data',
            'Widget usage',
            'Customizing error messages'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Breadth First Search - BFS',
            'Depth First Search - DFS',
            'Applications of BFS',
            'Applications of DFS'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Assembly programs for sorting',
            'Evaluation of arithmetic expressions in Assembly',
            'String manipulation in Assembly',
            'Assembler directives',
            'Procedures in Assembly',
            'Macros in Assembly'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Minimum Spanning Tree - Prims Algorithm',
            'Minimum Spanning Tree - Kruskals Algorithm',
            'MST examples and trace'
          ]
        }
      ]
    },

    {
      day: 9,
      theme: 'Complete Remaining Topics',
      difficulty: 'hard',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Complete Unit 5 review',
            'All pointer types revision',
            'DMA complete revision',
            'Structure with pointers'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'Django Advanced complete revision',
            'Complete Unit 5 review'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Dijkstras Shortest Path Algorithm',
            'Bellman-Ford Algorithm',
            'Floyd-Warshall all pairs shortest path',
            'Complete Unit 4 revision'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Memory and Digital Interfacing',
            'Addressing and address decoding',
            'Interfacing RAM',
            'Interfacing ROM',
            'Interfacing EPROM',
            'Programmable Peripheral Interface',
            'Cache Memory - Mapping',
            'Cache Memory - Hit ratio',
            'Virtual Memory',
            'Logical address vs Physical address',
            'Translation Lookaside Buffer (TLB)'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'String Sort',
            'Tries',
            'Search a Substring within a string',
            'Naive String Matching Algorithm',
            'Rabin-Karp Algorithm',
            'Knuth-Morris-Pratt (KMP) Algorithm',
            'Horspool String Matching Algorithm',
            'Boyer-Moore String Matching Algorithm',
            'Regular Expressions in Algorithms',
            'Elementary Data Compression',
            'Shortest Path - Dijkstras Algorithm',
            'Shortest Path - Bellman-Ford',
            'Shortest Path - Floyd-Warshall'
          ]
        }
      ]
    },

    {
      day: 10,
      theme: 'Full Theory Revision',
      difficulty: 'medium',
      subjects: [
        {
          code: 'CST201',
          topics: [
            'Data types revision',
            'Operators revision',
            'Control flow revision',
            'Arrays and Strings revision',
            'Functions revision',
            'Recursion revision',
            'Pointers revision',
            'Dynamic Memory revision'
          ]
        },
        {
          code: 'CST203',
          topics: [
            'Data types revision',
            'String formatting revision',
            'Control flow revision',
            'Functions and Modules revision',
            'File I/O revision',
            'Regular Expressions revision',
            'Django revision'
          ]
        },
        {
          code: 'CST205',
          topics: [
            'Stack revision',
            'Queue revision',
            'Linked Lists revision',
            'Trees revision',
            'Graphs revision',
            'Hashing revision',
            'Shortest paths revision'
          ]
        },
        {
          code: 'CST207',
          topics: [
            'Computer Architecture revision',
            'Data representation revision',
            'Micro-operations revision',
            'Pipelining revision',
            '8086 revision',
            'Assembly Language revision',
            'Memory Organization revision'
          ]
        },
        {
          code: 'CST209',
          topics: [
            'Complexity analysis revision',
            'Sorting algorithms revision',
            'Searching algorithms revision',
            'Graph algorithms revision',
            'String matching revision',
            'Data compression revision'
          ]
        }
      ]
    }
  ]
};

// ================================
// LocalStorage Management
// ================================

var Storage = {
  keys: {
    firstLaunch:      'diploma-3rd-sem-first-launch',
    studentName:      'diploma-3rd-sem-student-name',
    lastVisited:      'diploma-3rd-sem-last-visited',
    bookmarks:        'diploma-3rd-sem-bookmarks',
    practiceProgress: 'diploma-3rd-sem-practice-progress',
    quizScores:       'diploma-3rd-sem-quiz-scores',
    streak:           'diploma-3rd-sem-streak',
    lastStudyDate:    'diploma-3rd-sem-last-study-date',
    roadmapStartDate: 'diploma-3rd-sem-roadmap-start'
  },

  get: function(key) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('[Storage] get error:', e);
      return null;
    }
  },

  set: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[Storage] set error:', e);
      return false;
    }
  },

  remove: function(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('[Storage] remove error:', e);
      return false;
    }
  },

  clear: function() {
    try {
      var self = this;
      Object.values(self.keys).forEach(function(key) {
        self.remove(key);
      });
      return true;
    } catch (e) {
      console.error('[Storage] clear error:', e);
      return false;
    }
  }
};

// ================================
// Toast Notification System
// ================================

var Toast = {
  container: null,

  icons: {
    success: 'check',
    error:   'close',
    warning: 'info',
    info:    'info'
  },

  init: function() {
    this.container = document.getElementById('toastContainer');
  },

  show: function(message, type, duration) {
    type     = type || 'info';
    duration = duration || APP_CONFIG.toastDuration;

    if (!this.container) {
      console.log('[Toast ' + type + '] ' + message);
      return;
    }

    var iconName = this.icons[type] || 'info';
    var toast    = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    toast.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' +
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#' + iconName + '"></use></svg>' +
      '</span>' +
      '<span class="toast-message">' + this._escapeHtml(message) + '</span>' +
      '<button class="toast-close" aria-label="Dismiss notification">' +
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#close"></use></svg>' +
      '</button>';

    var self     = this;
    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
      self._dismiss(toast);
    });

    this.container.appendChild(toast);

    var timer    = setTimeout(function() { self._dismiss(toast); }, duration);
    toast._timer = timer;

    return toast;
  },

  _dismiss: function(toast) {
    if (!toast || toast._removing) return;
    toast._removing = true;
    clearTimeout(toast._timer);
    toast.classList.add('removing');
    toast.addEventListener('animationend', function() {
      toast.remove();
    }, { once: true });
    setTimeout(function() { toast.remove(); }, 400);
  },

  success: function(message, duration) { return this.show(message, 'success', duration); },
  error:   function(message, duration) { return this.show(message, 'error',   duration); },
  warning: function(message, duration) { return this.show(message, 'warning', duration); },
  info:    function(message, duration) { return this.show(message, 'info',    duration); },

  _escapeHtml: function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
};

// ================================
// Streak System
// ================================

var Streak = {

  getData: function() {
    return Storage.get(Storage.keys.streak) || { count: 0, lastDate: null };
  },

  saveData: function(data) {
    Storage.set(Storage.keys.streak, data);
  },

  todayString: function() {
    return new Date().toISOString().split('T')[0];
  },

  yesterdayString: function() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  },

  recordStudy: function() {
    var data      = this.getData();
    var today     = this.todayString();
    var yesterday = this.yesterdayString();

    if (data.lastDate === today)      return data;
    if (data.lastDate === yesterday)  { data.count++; }
    else if (data.lastDate === null)  { data.count = 1; }
    else                              { data.count = 1; }

    data.lastDate = today;
    this.saveData(data);
    return data;
  },

  isAlive: function() {
    var data = this.getData();
    if (!data.lastDate) return false;
    var today     = this.todayString();
    var yesterday = this.yesterdayString();
    return data.lastDate === today || data.lastDate === yesterday;
  },

  getCount: function() {
    if (!this.isAlive()) return 0;
    return this.getData().count;
  },

  reset: function() {
    this.saveData({ count: 0, lastDate: null });
  }
};

// ================================
// Roadmap Day Calculator
// ================================

var Roadmap = {

  getStartDate: function() {
    var saved = Storage.get(Storage.keys.roadmapStartDate);
    if (saved) return new Date(saved);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    Storage.set(Storage.keys.roadmapStartDate, today.toISOString());
    return today;
  },

  getCurrentDay: function() {
    var start = this.getStartDate();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    var day = diffDays + 1;
    if (day < 1)  return 1;
    if (day > 10) return null;
    return day;
  },

  getTodayEntry: function() {
    var day = this.getCurrentDay();
    if (!day) return null;
    return APP_STATE.roadmap.find(function(r) {
      return r.day === day;
    }) || null;
  }
};

// ================================
// Welcome Screen
// ================================

function WelcomeScreen() {
  this.screen       = document.getElementById('welcomeScreen');
  this.appContainer = document.getElementById('appContainer');
  this.startBtn     = document.getElementById('startBtn');
  this.nameInput    = document.getElementById('studentName');
  this.init();
}

WelcomeScreen.prototype.init = function() {
  var hasLaunched = Storage.get(Storage.keys.firstLaunch);
  if (hasLaunched) {
    this.hideWelcome();
    this.showApp();
  } else {
    this.setupEventListeners();
  }
};

WelcomeScreen.prototype.setupEventListeners = function() {
  var self = this;

  if (this.startBtn) {
    this.startBtn.addEventListener('click', function() {
      self.handleStart();
    });
  }

  if (this.nameInput) {
    this.nameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') self.handleStart();
    });
    setTimeout(function() {
      if (self.nameInput) self.nameInput.focus();
    }, 700);
  }
};

WelcomeScreen.prototype.handleStart = function() {
  var rawName  = this.nameInput ? this.nameInput.value.trim() : '';
  var name     = rawName.length > 0 ? rawName : 'Student';
  var safeName = name.replace(/<[^>]*>/g, '').slice(0, 20);

  Storage.set(Storage.keys.studentName, safeName);
  Storage.set(Storage.keys.firstLaunch, true);
  APP_STATE.studentName = safeName;

  Streak.recordStudy();

  if (this.startBtn) {
    this.startBtn.style.opacity = '0.7';
    this.startBtn.disabled = true;
  }

  this.hideWelcome();
  var self = this;
  setTimeout(function() { self.showApp(); }, 350);
};

WelcomeScreen.prototype.hideWelcome = function() {
  if (this.screen) {
    this.screen.classList.add('hidden');
    this.screen.setAttribute('aria-hidden', 'true');
  }
};

WelcomeScreen.prototype.showApp = function() {
  if (this.appContainer) {
    this.appContainer.classList.remove('hidden');
    initApp();
  }
};

// ================================
// Main App Initialization
// ================================

function initApp() {
  Toast.init();
  loadStudentName();
  renderGreeting();
  renderDate();
  calculateExamCountdown();
  renderStatsBar();
  renderTodayFocus();
  checkContinueCard();
  setupNavigation();
  setupMenu();
  scheduleNextMidnightUpdate();

  setTimeout(function() {
    renderSubjects();
  }, APP_CONFIG.skeletonDelay);

  Streak.recordStudy();
}

// ================================
// Student Name
// ================================

function loadStudentName() {
  var name = Storage.get(Storage.keys.studentName);
  APP_STATE.studentName = name || 'Student';
}

// ================================
// Greeting
// ================================

function renderGreeting() {
  var hour = new Date().getHours();

  var greetings = [
    { range: [5,  12], text: 'Good Morning' },
    { range: [12, 17], text: 'Good Afternoon' },
    { range: [17, 21], text: 'Good Evening' },
    { range: [21, 24], text: 'Good Night' },
    { range: [0,   5], text: 'Still Studying?' }
  ];

  var match = greetings.find(function(g) {
    return hour >= g.range[0] && hour < g.range[1];
  });
  var greetText = match ? match.text : greetings[0].text;

  var greetingTitle = document.getElementById('greetingTitle');
  var greetingName  = document.getElementById('greetingName');
  var profileName   = document.getElementById('profileName');
  var profileAvatar = document.getElementById('profileAvatar');

  if (greetingTitle) greetingTitle.textContent = greetText;

  if (greetingName) {
    greetingName.innerHTML = 'Hey <span class="name-highlight">' +
      _escapeHtml(APP_STATE.studentName) +
      '</span>, ready to study?';
  }

  if (profileName)   profileName.textContent  = APP_STATE.studentName;
  if (profileAvatar) profileAvatar.textContent = APP_STATE.studentName.charAt(0).toUpperCase();
}

// ================================
// Date Display
// ================================

function renderDate() {
  var dateDisplay = document.getElementById('dateDisplay');
  if (!dateDisplay) return;
  dateDisplay.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric'
  });
}

// ================================
// Exam Countdown
// ================================

function calculateExamCountdown() {
  var examCountdown = document.getElementById('examCountdown');
  if (!examCountdown) return;

  var today    = new Date();
  var examDate = new Date(APP_CONFIG.examDate);
  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);

  var diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    examCountdown.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#calendar"></use></svg> ' +
      diffDays + 'd to exams';
    examCountdown.style.background = '';
  } else if (diffDays > 0) {
    examCountdown.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#clock"></use></svg> ' +
      diffDays + 'd left!';
    examCountdown.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else if (diffDays === 0) {
    examCountdown.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#target"></use></svg> ' +
      'Exam today!';
    examCountdown.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else {
    examCountdown.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#check"></use></svg> ' +
      'Exams done!';
    examCountdown.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  }
}

// ================================
// Stats Bar
// ================================

function renderStatsBar() {
  renderStreak();
  renderPracticeCount();
  renderQuizCount();
}

function renderStreak() {
  var streakValue = document.getElementById('streakValue');
  var streakCard  = document.getElementById('streakCard');
  if (!streakValue || !streakCard) return;

  var count   = Streak.getCount();
  var isAlive = Streak.isAlive();

  streakValue.textContent = count;

  var iconEl = streakCard.querySelector('.stat-card-icon');
  if (iconEl) {
    var iconName = count >= 3 ? 'trending-up' : count > 0 ? 'zap' : 'clock';
    iconEl.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#' + iconName + '"></use></svg>';
  }

  streakCard.classList.toggle('streak-active', isAlive && count > 0);
  streakCard.classList.toggle('streak-zero',   !isAlive || count === 0);
  streakCard.setAttribute(
    'aria-label',
    count > 0
      ? count + ' day study streak - keep it up!'
      : 'No streak yet - study today to start one!'
  );
}

function renderPracticeCount() {
  var practiceValue = document.getElementById('practiceValue');
  if (!practiceValue) return;
  var progress = Storage.get(Storage.keys.practiceProgress) || {};
  var done = Object.values(progress).filter(function(p) { return p.completed; }).length;
  practiceValue.textContent = done;
}

function renderQuizCount() {
  var quizValue = document.getElementById('quizValue');
  if (!quizValue) return;
  var scores = Storage.get(Storage.keys.quizScores) || [];
  quizValue.textContent = scores.length;
}

// ================================
// Today's Focus Card
// ================================

function renderTodayFocus() {
  var focusCard     = document.getElementById('focusCard');
  var focusDay      = document.getElementById('focusDay');
  var focusTitle    = document.getElementById('focusTitle');
  var focusSubjects = document.getElementById('focusSubjects');

  if (!focusCard) return;

  var entry = Roadmap.getTodayEntry();

  // Roadmap complete
  if (!entry) {
    if (focusDay) focusDay.innerHTML =
      '<svg class="icon" style="width:14px;height:14px;" aria-hidden="true">' +
      '<use href="assets/icons/sprite.svg#check"></use></svg> Complete!';
    if (focusTitle) focusTitle.textContent = 'You have finished the 10-day theory roadmap. Time to practice!';
    if (focusSubjects) focusSubjects.innerHTML = '';
    focusCard.setAttribute('aria-label', 'Theory roadmap complete!');
    focusCard.addEventListener('click', function() {
      window.location.href = 'roadmap/index.html';
    });
    focusCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = 'roadmap/index.html';
      }
    });
    return;
  }

  // Day label with difficulty icon
  if (focusDay) {
    var difficultyIcons = {
      easy:   'check',
      medium: 'clock',
      hard:   'zap'
    };
    var difficultyLabels = {
      easy:   'Easy',
      medium: 'Medium',
      hard:   'Hard'
    };
    var iconRef  = difficultyIcons[entry.difficulty] || 'clock';
    var diffText = difficultyLabels[entry.difficulty] || 'Medium';

    focusDay.innerHTML = 'Day ' + entry.day + ' of 10 ' +
      '<svg class="icon" style="width:14px;height:14px;" aria-hidden="true">' +
      '<use href="assets/icons/sprite.svg#' + iconRef + '"></use></svg> ' +
      diffText;
  }

  // Theme title
  if (focusTitle) {
    focusTitle.textContent = entry.theme;
  }

  // Subject tags with topic count
  if (focusSubjects) {
    focusSubjects.innerHTML = entry.subjects.map(function(subjectEntry) {
      var subject = APP_STATE.subjects.find(function(s) {
        return s.code === subjectEntry.code;
      });
      if (!subject) return '';

      var topicCount = subjectEntry.topics.length;

      return '<span class="focus-subject-tag"' +
        ' title="' + _escapeHtml(subjectEntry.topics.join(', ')) + '"' +
        ' aria-label="' + subject.shortName + ' - ' + topicCount + ' topics">' +
        '<svg class="icon" style="width:14px;height:14px;" aria-hidden="true">' +
        '<use href="assets/icons/sprite.svg#book"></use></svg> ' +
        subject.shortName +
        '<span style="opacity:0.75;font-size:0.7rem;margin-left:4px;">' +
        topicCount + '</span></span>';
    }).join('');
  }

  // Navigation
  var navigate = function() {
    window.location.href = 'roadmap/index.html';
  };
  focusCard.addEventListener('click', navigate);
  focusCard.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate();
    }
  });

  focusCard.setAttribute(
    'aria-label',
    'Todays focus: Day ' + entry.day + ' - ' + entry.theme +
    '. ' + entry.subjects.length + ' subjects. Tap to view roadmap.'
  );
}

// ================================
// Subject Cards
// ================================

function renderSubjects() {
  var grid = document.getElementById('subjectGrid');
  if (!grid) return;

  var practiceProgress = Storage.get(Storage.keys.practiceProgress) || {};

  grid.innerHTML = APP_STATE.subjects.map(function(subject) {

    var subjectDays = [];
    APP_STATE.roadmap.forEach(function(r) {
      var found = r.subjects.some(function(s) {
        return s.code === subject.code;
      });
      if (found) subjectDays.push(r.day);
    });

    var completedDays = subjectDays.filter(function(day) {
      var key = 'day' + day;
      return practiceProgress[key] && practiceProgress[key].completed === true;
    });

    var progressPct = subjectDays.length > 0
      ? Math.round((completedDays.length / subjectDays.length) * 100)
      : 0;

    return '<a href="' + subject.path + '"' +
      ' class="subject-card"' +
      ' role="listitem"' +
      ' aria-label="' + subject.name + ' - ' + subject.units + ' units, ' +
      subject.credits + ' credits, ' + progressPct + '% complete"' +
      ' style="--subject-color:' + subject.color +
      ';--subject-color-light:' + subject.colorLight +
      ';--subject-color-rgb:' + subject.colorRgb + ';">' +

      '<div class="subject-header">' +
      '<div class="subject-icon" aria-hidden="true">' +
      '<svg class="icon" style="width:24px;height:24px;stroke:white;" aria-hidden="true">' +
      '<use href="assets/icons/sprite.svg#book"></use></svg></div>' +
      '<div class="subject-code">' + subject.code + '</div></div>' +

      '<h3 class="subject-name">' + subject.name + '</h3>' +

      '<div class="subject-meta">' +
      '<div class="meta-item">' +
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#layers"></use></svg>' +
      '<span>' + subject.units + ' Units</span></div>' +
      '<div class="meta-item">' +
      '<svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#award"></use></svg>' +
      '<span>' + subject.credits + ' Credits</span></div></div>' +

      '<div class="subject-progress" aria-hidden="true">' +
      '<div class="subject-progress-header">' +
      '<span class="subject-progress-label">Progress</span>' +
      '<span class="subject-progress-value">' + progressPct + '%</span></div>' +
      '<div class="progress-bar-track">' +
      '<div class="progress-bar-fill" style="width:' + progressPct + '%"></div>' +
      '</div></div></a>';
  }).join('');

  // Track visits
  var cards = grid.querySelectorAll('.subject-card');
  cards.forEach(function(card, index) {
    card.addEventListener('click', function() {
      var subject = APP_STATE.subjects[index];
      Storage.set(Storage.keys.lastVisited, {
        subjectCode: subject.code,
        subjectName: subject.name,
        subjectPath: subject.path,
        timestamp:   Date.now()
      });
      Streak.recordStudy();
    });
  });
}

// ================================
// Continue Card
// ================================

function checkContinueCard() {
  var continueCard = document.getElementById('continueCard');
  var lastVisited  = Storage.get(Storage.keys.lastVisited);

  if (!continueCard) return;

  if (!lastVisited) {
    continueCard.style.display = 'none';
    return;
  }

  var subjectCode = lastVisited.subjectCode;
  var subjectName = lastVisited.subjectName;
  var subjectPath = lastVisited.subjectPath;
  var timestamp   = lastVisited.timestamp;
  var daysSince   = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

  if (daysSince <= 7 && subjectCode) {
    var subject = APP_STATE.subjects.find(function(s) {
      return s.code === subjectCode;
    });
    if (!subject) {
      continueCard.style.display = 'none';
      return;
    }

    var continueIconEl    = document.getElementById('continueIcon');
    var continueSubjectEl = document.getElementById('continueSubject');

    if (continueIconEl) {
      continueIconEl.innerHTML =
        '<svg class="icon" style="width:24px;height:24px;stroke:white;" aria-hidden="true">' +
        '<use href="assets/icons/sprite.svg#book"></use></svg>';
    }
    if (continueSubjectEl) {
      continueSubjectEl.textContent = subjectName || subject.name;
    }

    continueCard.setAttribute('href', subjectPath || subject.path);
    continueCard.setAttribute('aria-label', 'Continue studying ' + (subjectName || subject.name));
    continueCard.style.display = 'flex';
  } else {
    continueCard.style.display = 'none';
  }
}

// ================================
// Navigation
// ================================

function setupNavigation() {
  var backBtn = document.getElementById('backBtn');
  if (!backBtn) return;
  backBtn.addEventListener('click', function() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = 'index.html';
  });
}

// ================================
// Side Menu
// ================================

function setupMenu() {
  var menuBtn      = document.getElementById('menuBtn');
  var closeMenuBtn = document.getElementById('closeMenuBtn');
  var menuOverlay  = document.getElementById('menuOverlay');
  var sideMenu     = document.getElementById('sideMenu');
  var resetAppBtn  = document.getElementById('resetAppBtn');

  function openMenu() {
    if (!menuOverlay || !sideMenu) return;
    menuOverlay.classList.add('active');
    sideMenu.classList.add('active');
    sideMenu.setAttribute('aria-hidden', 'false');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      var firstItem = sideMenu.querySelector('a, button');
      if (firstItem) firstItem.focus();
    }, 300);
  }

  function closeMenu() {
    if (!menuOverlay || !sideMenu) return;
    menuOverlay.classList.remove('active');
    sideMenu.classList.remove('active');
    sideMenu.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (menuBtn) menuBtn.focus();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openMenu();
    });
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeMenu();
    });
  }
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  if (sideMenu) {
    sideMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Focus trap
  if (sideMenu) {
    sideMenu.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      var focusable = sideMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]');
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Reset
  if (resetAppBtn) {
    resetAppBtn.addEventListener('click', function() {
      if (!confirm(
        'Reset all app data?\n\nThis clears:\n' +
        '- Your name\n- Bookmarks\n- Practice progress\n' +
        '- Quiz scores\n- Study streak\n\nCannot be undone!'
      )) return;
      Storage.clear();
      Streak.reset();
      Toast.success('App data reset. Reloading...');
      setTimeout(function() { window.location.reload(); }, 1500);
    });
  }
}

// ================================
// Midnight Update Scheduler
// ================================

function scheduleNextMidnightUpdate() {
  var now      = new Date();
  var tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  setTimeout(function() {
    renderDate();
    renderGreeting();
    calculateExamCountdown();
    renderTodayFocus();
    renderStatsBar();
    scheduleNextMidnightUpdate();
  }, tomorrow - now);
}

// ================================
// Utility Functions
// ================================

function _escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function formatRelativeTime(timestamp) {
  var diff    = Date.now() - timestamp;
  var seconds = Math.floor(diff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours   = Math.floor(minutes / 60);
  var days    = Math.floor(hours / 24);
  if (days > 0)    return days + ' day' + (days > 1 ? 's' : '') + ' ago';
  if (hours > 0)   return hours + ' hour' + (hours > 1 ? 's' : '') + ' ago';
  if (minutes > 0) return minutes + ' minute' + (minutes > 1 ? 's' : '') + ' ago';
  return 'Just now';
}

function debounce(func, wait) {
  var timeout;
  return function() {
    var args = arguments;
    var self = this;
    clearTimeout(timeout);
    timeout = setTimeout(function() { func.apply(self, args); }, wait);
  };
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

function getSubjectByCode(code) {
  return APP_STATE.subjects.find(function(s) { return s.code === code; }) || null;
}

// ================================
// App Lifecycle Events
// ================================

document.addEventListener('visibilitychange', function() {
  if (document.hidden) return;
  renderGreeting();
  renderDate();
  calculateExamCountdown();
  renderStatsBar();
});

window.addEventListener('online', function() {
  Toast.success('You are back online!');
});

window.addEventListener('offline', function() {
  Toast.warning('You are offline. Content may be limited.');
});

// ================================
// DOM Ready
// ================================

document.addEventListener('DOMContentLoaded', function() {
  new WelcomeScreen();

  console.log('%cDiploma 3rd Sem - Study Hub', 'color:#6366f1;font-size:18px;font-weight:bold;');
  console.log('%cv' + APP_CONFIG.version, 'color:#94a3b8;font-size:11px;');
  console.log('%cMade for WB Polytechnic Students', 'color:#94a3b8;font-size:11px;');
  if (isPWA())    console.log('%cRunning as PWA', 'color:#10b981;font-size:11px;');
  if (isMobile()) console.log('%cMobile detected', 'color:#3b82f6;font-size:11px;');
});

// ================================
// Global API Export
// ================================

window.APP = {
  config:  APP_CONFIG,
  state:   APP_STATE,
  storage: Storage,
  toast:   Toast,
  streak:  Streak,
  roadmap: Roadmap,
  utils: {
    escapeHtml:        _escapeHtml,
    formatRelativeTime: formatRelativeTime,
    debounce:          debounce,
    isMobile:          isMobile,
    isPWA:             isPWA,
    getSubjectByCode:  getSubjectByCode
  }
};