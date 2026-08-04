/* ============================================================
   quiz/js/common.js
   Shared utilities, data definitions, and helper functions
   ============================================================ */

'use strict';

/* ── Subject & Unit Data ────────────────────────────────────── */

const SUBJECTS = {
  CST201: {
    code: 'CST201',
    name: 'Computer Programming in C',
    credits: 2,
    units: 5
  },
  CST203: {
    code: 'CST203',
    name: 'Scripting Languages (Python)',
    credits: 2,
    units: 5
  },
  CST205: {
    code: 'CST205',
    name: 'Data Structures',
    credits: 2,
    units: 4
  },
  CST207: {
    code: 'CST207',
    name: 'Computer System Organization',
    credits: 4,
    units: 5
  },
  CST209: {
    code: 'CST209',
    name: 'Algorithms',
    credits: 4,
    units: 5
  }
};

const UNIT_TITLES = {
  CST201: {
    1: 'Basics of C',
    2: 'Decision Control & Looping',
    3: 'User Defined Functions',
    4: 'Arrays & Strings',
    5: 'Pointers in C'
  },
  CST203: {
    1: 'Variables & Data Types',
    2: 'Control Structures',
    3: 'Functions, Modules & Packages',
    4: 'File I/O & Regular Expressions',
    5: 'Frameworks (Django)'
  },
  CST205: {
    1: 'Introduction and Stacks',
    2: 'Queues, Recursion and Linked Lists',
    3: 'Trees and Graphs',
    4: 'BST, Hashing and Shortest Path'
  },
  CST207: {
    1: 'Structure of Computers + Data Representation',
    2: 'Control Unit + Pipelines',
    3: 'Microprocessor Architecture (8086)',
    4: 'Assembly Language Programming',
    5: 'Memory & Digital Interfacing'
  },
  CST209: {
    1: 'Fundamentals + Complexity',
    2: 'Sorting Algorithms',
    3: 'Searching + BST + Hashing',
    4: 'Graph Algorithms',
    5: 'String Algorithms'
  }
};

/* ── Question Type Labels ───────────────────────────────────── */
const QUESTION_TYPES = {
  mcq:       'Multiple Choice',
  theory:    'Theory',
  program:   'Programming',
  numerical: 'Numerical',
  short:     'Short Answer'
};

/* ── Difficulty Labels ──────────────────────────────────────── */
const DIFFICULTY_LABELS = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard'
};

/* ── Timer Config ───────────────────────────────────────────── */
const TIMER_MARKS_MAP = {
  1: 1,   // 1 mark  = 1 min
  2: 2,   // 2 marks = 2 min
  4: 3,   // 4 marks = 3 min
  6: 4,   // 6 marks = 4 min
  8: 5,   // 8+ marks = 5 min
  10: 5
};

/* ── Storage Keys ───────────────────────────────────────────── */
const STORAGE_KEYS = {
  THEME:    'quiz-theme',
  HISTORY:  'quiz-history',
  SETTINGS: 'quiz-settings',
  AUTOSAVE_PREFIX: 'quiz-autosave-'
};

/* ══════════════════════════════════════════════════════════════
   SUBJECT & UNIT HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * Get full subject display name from code
 * @param {string} code - Subject code (e.g. "CST205")
 * @returns {string} Full name or code if not found
 */
function getSubjectName(code) {
  if (code === 'all') return 'All Subjects';
  return SUBJECTS[code] ? SUBJECTS[code].name : code;
}

/**
 * Get unit title string (e.g. "Unit 1: Introduction and Stacks")
 * @param {string} subjectCode
 * @param {number} unitNumber
 * @returns {string}
 */
function getUnitTitle(subjectCode, unitNumber) {
  if (unitNumber === 'all') return 'All Units';
  const titles = UNIT_TITLES[subjectCode];
  if (!titles || !titles[unitNumber]) return `Unit ${unitNumber}`;
  return `Unit ${unitNumber}: ${titles[unitNumber]}`;
}

/**
 * Get all unit options for a given subject code
 * Returns array of { value, label }
 * @param {string} subjectCode
 * @returns {Array<{value: number, label: string}>}
 */
function getUnitOptions(subjectCode) {
  if (!SUBJECTS[subjectCode]) return [];
  const count = SUBJECTS[subjectCode].units;
  const options = [];
  for (let i = 1; i <= count; i++) {
    options.push({
      value: i,
      label: getUnitTitle(subjectCode, i)
    });
  }
  return options;
}

/**
 * Render unit checkboxes into a container element
 * @param {string} subjectCode
 * @param {HTMLElement} container
 * @param {Array<number>} [selectedUnits] - pre-selected units
 */
function renderUnits(subjectCode, container, selectedUnits = []) {
  container.innerHTML = '';

  if (!subjectCode || subjectCode === 'all') {
    container.innerHTML = '<p class="text-secondary text-sm">Select a specific subject to filter by unit.</p>';
    return;
  }

  const options = getUnitOptions(subjectCode);
  if (options.length === 0) {
    container.innerHTML = '<p class="text-secondary text-sm">No units found.</p>';
    return;
  }

  options.forEach(({ value, label }) => {
    const labelEl = document.createElement('label');
    labelEl.className = 'check-label';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'unit';
    input.value = value;
    if (selectedUnits.includes(value)) input.checked = true;

    const span = document.createElement('span');
    span.textContent = label;

    labelEl.appendChild(input);
    labelEl.appendChild(span);
    container.appendChild(labelEl);
  });
}

/* ══════════════════════════════════════════════════════════════
   THEME MANAGEMENT
══════════════════════════════════════════════════════════════ */

/**
 * Initialise theme from localStorage or system preference
 */
function initTheme() {
  const saved = getFromStorage(STORAGE_KEYS.THEME);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  }
  // If no saved preference, CSS media query handles it automatically
}

/**
 * Apply a specific theme
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveToStorage(STORAGE_KEYS.THEME, theme);
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let next;
  if (current === 'dark') {
    next = 'light';
  } else if (current === 'light') {
    next = 'dark';
  } else {
    // No explicit theme set — override based on system
    next = systemDark ? 'light' : 'dark';
  }

  applyTheme(next);
}

/* ══════════════════════════════════════════════════════════════
   LOCALSTORAGE HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * Save data to localStorage as JSON
 * @param {string} key
 * @param {*} data
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

/**
 * Read and parse data from localStorage
 * @param {string} key
 * @returns {*} Parsed data or null
 */
function getFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('localStorage read failed:', e);
    return null;
  }
}

/**
 * Remove a key from localStorage
 * @param {string} key
 */
function clearStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('localStorage remove failed:', e);
  }
}

/* ══════════════════════════════════════════════════════════════
   DATE & TIME UTILITIES
══════════════════════════════════════════════════════════════ */

/**
 * Format a Date object to readable string
 * @param {Date|string|number} date
 * @returns {string} e.g. "15 Jan 2025"
 */
function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format date + time
 * @param {Date|string|number} date
 * @returns {string} e.g. "15 Jan 2025, 10:30 AM"
 */
function formatDateTime(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get current Unix timestamp
 * @returns {number}
 */
function getTimestamp() {
  return Date.now();
}

/**
 * Format seconds into MM:SS string
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ══════════════════════════════════════════════════════════════
   TIMER UTILITIES
══════════════════════════════════════════════════════════════ */

let _timerInterval = null;
let _timerRemaining = 0;
let _timerPaused = false;

/**
 * Calculate default timer duration based on question marks array
 * @param {Array<{marks: number}>} questions
 * @returns {number} Total seconds
 */
function calculateTimerDuration(questions) {
  let totalMinutes = 0;
  questions.forEach(q => {
    const marks = q.marks || 1;
    if (marks <= 1)      totalMinutes += TIMER_MARKS_MAP[1];
    else if (marks <= 2) totalMinutes += TIMER_MARKS_MAP[2];
    else if (marks <= 4) totalMinutes += TIMER_MARKS_MAP[4];
    else if (marks <= 6) totalMinutes += TIMER_MARKS_MAP[6];
    else                 totalMinutes += TIMER_MARKS_MAP[8];
  });
  return totalMinutes * 60;
}

/**
 * Start a countdown timer
 * @param {number} durationSeconds
 * @param {function} onTick - called every second with (remaining, formatted)
 * @param {function} onWarning - called when <= 300 seconds remain
 * @param {function} onExpire - called when timer reaches 0
 */
function startTimer(durationSeconds, onTick, onWarning, onExpire) {
  stopTimer();
  _timerRemaining = durationSeconds;
  _timerPaused = false;

  _timerInterval = setInterval(() => {
    if (_timerPaused) return;

    _timerRemaining--;
    const formatted = formatTime(_timerRemaining);

    if (typeof onTick === 'function') {
      onTick(_timerRemaining, formatted);
    }

    if (_timerRemaining === 300 && typeof onWarning === 'function') {
      onWarning();
    }

    if (_timerRemaining <= 0) {
      stopTimer();
      if (typeof onExpire === 'function') {
        onExpire();
      }
    }
  }, 1000);
}

/**
 * Pause the running timer
 */
function pauseTimer() {
  _timerPaused = true;
}

/**
 * Resume a paused timer
 */
function resumeTimer() {
  _timerPaused = false;
}

/**
 * Stop and clear the timer
 */
function stopTimer() {
  if (_timerInterval) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }
  _timerPaused = false;
}

/**
 * Get current remaining time
 * @returns {number} seconds
 */
function getTimerRemaining() {
  return _timerRemaining;
}

/* ══════════════════════════════════════════════════════════════
   QUESTION FILTERING
══════════════════════════════════════════════════════════════ */

/**
 * Filter a flat array of questions based on filter object
 * @param {Array} questions - All available questions
 * @param {Object} filters
 * @param {string}           filters.subject     - subject code or 'all'
 * @param {number|number[]|string} filters.unit  - unit number, array, or 'all'
 * @param {string}           filters.mode        - 'mcq' | 'all'
 * @param {string|string[]}  filters.difficulty  - 'easy','medium','hard' or 'mixed'
 * @param {number[]}         filters.marks       - array of mark values to include
 * @param {number|null}      filters.year        - specific year or null
 * @param {string}           filters.source      - 'PYQ' | 'original' | 'all'
 * @param {string[]}         filters.types       - question type keys to include
 * @returns {Array} Filtered questions
 */
function filterQuestions(questions, filters) {
  return questions.filter(q => {
    // ── Subject filter
    if (filters.subject && filters.subject !== 'all') {
      // Extract subject code from question ID prefix
      const qSubject = q.id ? q.id.split('-')[0] : q.subject;
      if (qSubject !== filters.subject) return false;
    }

    // ── Unit filter
    if (filters.unit && filters.unit !== 'all') {
      const units = Array.isArray(filters.unit)
        ? filters.unit.map(Number)
        : [Number(filters.unit)];
      if (!units.includes(Number(q.unit || extractUnit(q.id)))) return false;
    }

    // ── Mode filter (MCQ only)
    if (filters.mode === 'mcq') {
      if (q.type !== 'mcq') return false;
    }

    // ── Type filter (explicit list)
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(q.type)) return false;
    }

    // ── Difficulty filter
    if (filters.difficulty && filters.difficulty !== 'mixed') {
      const diffs = Array.isArray(filters.difficulty)
        ? filters.difficulty
        : [filters.difficulty];
      if (!diffs.includes(q.difficulty)) return false;
    }

    // ── Marks filter
    if (filters.marks && filters.marks.length > 0) {
      if (!filters.marks.map(Number).includes(Number(q.marks))) return false;
    }

    // ── Year filter (excludes original if year specified)
    if (filters.year && filters.year !== null) {
      if (q.source === 'original') return false;
      if (q.year && Number(q.year) !== Number(filters.year)) return false;
    }

    // ── Source filter
    if (filters.source && filters.source !== 'all') {
      if (filters.source === 'PYQ' && q.source !== 'PYQ') return false;
      if (filters.source === 'original' && q.source !== 'original') return false;
    }

    return true;
  });
}

/**
 * Extract unit number from question ID string
 * @param {string} id - e.g. "CST205-U1-Q001"
 * @returns {number}
 */
function extractUnit(id) {
  if (!id) return 0;
  const match = id.match(/U(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Shuffle an array in place (Fisher-Yates)
 * @param {Array} arr
 * @returns {Array} Shuffled array
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick N random questions from array
 * @param {Array} questions
 * @param {number} count
 * @returns {Array}
 */
function pickRandom(questions, count) {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}

/**
 * Pick balanced questions (attempt equal distribution by difficulty)
 * @param {Array} questions
 * @param {number} count
 * @returns {Array}
 */
function pickBalanced(questions, count) {
  const easy   = questions.filter(q => q.difficulty === 'easy');
  const medium = questions.filter(q => q.difficulty === 'medium');
  const hard   = questions.filter(q => q.difficulty === 'hard');

  const perGroup = Math.floor(count / 3);
  const remainder = count % 3;

  const picked = [
    ...shuffleArray(easy).slice(0, perGroup + (remainder > 0 ? 1 : 0)),
    ...shuffleArray(medium).slice(0, perGroup + (remainder > 1 ? 1 : 0)),
    ...shuffleArray(hard).slice(0, perGroup)
  ];

  // If we don't have enough from balanced groups, pad from remaining
  if (picked.length < count) {
    const pickedIds = new Set(picked.map(q => q.id));
    const remaining = questions.filter(q => !pickedIds.has(q.id));
    const extra = shuffleArray(remaining).slice(0, count - picked.length);
    picked.push(...extra);
  }

  return shuffleArray(picked).slice(0, count);
}

/* ══════════════════════════════════════════════════════════════
   QUIZ STATE MANAGEMENT (autosave)
══════════════════════════════════════════════════════════════ */

/**
 * Save current quiz state to localStorage
 * @param {Object} state - Full quiz state object
 */
function saveQuizState(state) {
  const key = state.autosaveKey || (STORAGE_KEYS.AUTOSAVE_PREFIX + getTimestamp());
  state.autosaveKey = key;
  state.savedAt = getTimestamp();
  saveToStorage(key, state);
  return key;
}

/**
 * Load the most recent quiz autosave
 * @returns {Object|null} Saved quiz state or null
 */
function loadQuizState() {
  try {
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith(STORAGE_KEYS.AUTOSAVE_PREFIX)
    );
    if (keys.length === 0) return null;

    // Find most recent
    keys.sort((a, b) => {
      const tA = parseInt(a.replace(STORAGE_KEYS.AUTOSAVE_PREFIX, ''), 10);
      const tB = parseInt(b.replace(STORAGE_KEYS.AUTOSAVE_PREFIX, ''), 10);
      return tB - tA;
    });

    return getFromStorage(keys[0]);
  } catch (e) {
    return null;
  }
}

/**
 * Clear all quiz autosaves
 */
function clearQuizState() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_KEYS.AUTOSAVE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Could not clear quiz state:', e);
  }
}

/**
 * Clear a specific autosave key
 * @param {string} key
 */
function clearSpecificQuizState(key) {
  clearStorage(key);
}

/* ══════════════════════════════════════════════════════════════
   HISTORY MANAGEMENT
══════════════════════════════════════════════════════════════ */

/**
 * Save a completed quiz to history
 * @param {Object} quiz - Quiz result object
 */
function saveToHistory(quiz) {
  const history = getHistory();
  quiz.historyId = 'hist-' + getTimestamp();
  quiz.completedAt = getTimestamp();
  history.unshift(quiz); // newest first

  // Keep last 50 entries
  const trimmed = history.slice(0, 50);
  saveToStorage(STORAGE_KEYS.HISTORY, trimmed);
}

/**
 * Get all history entries
 * @returns {Array}
 */
function getHistory() {
  return getFromStorage(STORAGE_KEYS.HISTORY) || [];
}

/**
 * Clear all quiz history
 */
function clearHistory() {
  clearStorage(STORAGE_KEYS.HISTORY);
}

/**
 * Get a single history entry by ID
 * @param {string} historyId
 * @returns {Object|null}
 */
function getHistoryEntry(historyId) {
  const history = getHistory();
  return history.find(h => h.historyId === historyId) || null;
}

/**
 * Delete a single history entry
 * @param {string} historyId
 */
function deleteHistoryEntry(historyId) {
  const history = getHistory().filter(h => h.historyId !== historyId);
  saveToStorage(STORAGE_KEYS.HISTORY, history);
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS MANAGEMENT
══════════════════════════════════════════════════════════════ */

const DEFAULT_SETTINGS = {
  defaultTimer: true,
  soundEnabled: false
};

/**
 * Get user settings
 * @returns {Object}
 */
function getSettings() {
  const saved = getFromStorage(STORAGE_KEYS.SETTINGS);
  return Object.assign({}, DEFAULT_SETTINGS, saved);
}

/**
 * Save settings
 * @param {Object} settings
 */
function saveSettings(settings) {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

/* ══════════════════════════════════════════════════════════════
   EXPORT GENERATION
══════════════════════════════════════════════════════════════ */

/**
 * Generate export filename
 * @param {Object} params
 * @param {string} params.subject  - subject code
 * @param {number|string} params.unit
 * @param {string} params.mode
 * @param {number} params.count
 * @param {string} params.format   - 'txt'|'md'|'json'
 * @returns {string}
 */
function generateFilename({ subject, unit, mode, count, format }) {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const unitStr = unit === 'all' ? 'all-units' : `u${unit}`;
  const subjectStr = subject === 'all' ? 'all' : subject.toLowerCase();
  return `${subjectStr}-${unitStr}-${mode}-${count}q-${date}.${format}`;
}

/**
 * Generate Markdown export for All Types mode
 * @param {Object} data
 * @returns {string}
 */
function generateAllTypesMarkdown(data) {
  const {
    subject, unit, mode, questions, answers, metadata
  } = data;

  const subjectName  = getSubjectName(subject);
  const unitTitle    = unit === 'all'
    ? 'All Units'
    : getUnitTitle(subject, unit);
  const dateStr      = formatDate(metadata.date || Date.now());
  const total        = questions.length;

  let md = `# Quiz Evaluation Request\n\n`;
  md += `## Instructions for AI\n`;
  md += `Evaluate the following quiz answers based on concept coverage, not exact wording.\n\n`;
  md += `**Scoring Rubric:**\n`;
  md += `- Award marks based on understanding shown\n`;
  md += `- Give partial marks for incomplete answers\n`;
  md += `- Note missing key points\n`;
  md += `- Suggest improvements\n\n`;
  md += `**Expected Output Format:**\n`;
  md += `For each question:\n`;
  md += `- Marks awarded / Total marks\n`;
  md += `- Missing points (if any)\n`;
  md += `- Improved answer suggestion\n\n`;
  md += `At the end:\n`;
  md += `- Total score\n`;
  md += `- Overall feedback\n\n`;
  md += `---\n\n`;
  md += `## Quiz Details\n`;
  md += `- **Subject:** ${subjectName}\n`;
  md += `- **Unit:** ${unitTitle}\n`;
  md += `- **Mode:** All Types\n`;
  md += `- **Total Questions:** ${total}\n`;
  md += `- **Date:** ${dateStr}\n\n`;
  md += `---\n\n`;

  questions.forEach((q, i) => {
    const userAnswer = answers[q.id] || '_(No answer provided)_';
    const modelAnswer = q.modelAnswer || '_(No model answer available)_';

    md += `## Question ${i + 1} (${q.marks} marks)\n`;
    md += `**Question:** ${q.question}\n\n`;
    md += `**User Answer:**\n${userAnswer}\n\n`;
    md += `**Model Answer:**\n${modelAnswer}\n\n`;
    md += `---\n\n`;
  });

  return md;
}

/**
 * Generate Markdown export for MCQ mode
 * @param {Object} data
 * @returns {string}
 */
function generateMCQMarkdown(data) {
  const {
    subject, unit, questions, answers, score, totalMarks, metadata
  } = data;

  const subjectName = getSubjectName(subject);
  const unitTitle   = unit === 'all'
    ? 'All Units'
    : getUnitTitle(subject, unit);
  const dateStr     = formatDate(metadata.date || Date.now());

  let md = `# MCQ Quiz Results\n\n`;
  md += `## Quiz Details\n`;
  md += `- **Subject:** ${subjectName}\n`;
  md += `- **Unit:** ${unitTitle}\n`;
  md += `- **Score:** ${score}/${questions.length}\n`;
  md += `- **Date:** ${dateStr}\n\n`;
  md += `---\n\n`;

  questions.forEach((q, i) => {
    const userAns  = answers[q.id] || '—';
    const correct  = q.correct;
    const isRight  = userAns === correct;
    const status   = isRight ? '✓ Correct' : '✗ Incorrect';

    md += `## Question ${i + 1}\n`;
    md += `**Question:** ${q.question}\n\n`;
    md += `**Options:**\n`;
    Object.entries(q.options || {}).forEach(([key, val]) => {
      md += `- ${key}: ${val}\n`;
    });
    md += `\n`;
    md += `**Your answer:** ${userAns}\n`;
    md += `**Correct answer:** ${correct}\n`;
    md += `**Status:** ${status}\n`;

    if (q.explanation) {
      md += `**Explanation:** ${q.explanation}\n`;
    }

    md += `\n---\n\n`;
  });

  return md;
}

/**
 * Generate JSON export
 * @param {Object} data
 * @returns {string} Pretty-printed JSON
 */
function generateJSONExport(data) {
  const exportData = {
    exportedAt: new Date().toISOString(),
    quiz: {
      subject: getSubjectName(data.subject),
      subjectCode: data.subject,
      unit: data.unit === 'all'
        ? 'All Units'
        : getUnitTitle(data.subject, data.unit),
      mode: data.mode,
      score: data.score || null,
      totalQuestions: data.questions.length
    },
    questions: data.questions.map((q, i) => ({
      number: i + 1,
      id: q.id,
      type: q.type,
      question: q.question,
      marks: q.marks,
      userAnswer: data.answers[q.id] || null,
      correctAnswer: q.correct || null,
      isCorrect: q.type === 'mcq'
        ? (data.answers[q.id] === q.correct)
        : null,
      explanation: q.explanation || null,
      modelAnswer: q.modelAnswer || null
    }))
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Generate TXT export
 * @param {Object} data
 * @returns {string}
 */
function generateTXTExport(data) {
  const subjectName = getSubjectName(data.subject);
  const unitTitle   = data.unit === 'all'
    ? 'All Units'
    : getUnitTitle(data.subject, data.unit);
  const dateStr     = formatDate(data.metadata?.date || Date.now());

  let txt = `QUIZ EXPORT\n`;
  txt += `${'='.repeat(50)}\n`;
  txt += `Subject : ${subjectName}\n`;
  txt += `Unit    : ${unitTitle}\n`;
  txt += `Mode    : ${data.mode}\n`;
  txt += `Date    : ${dateStr}\n`;
  if (data.score !== undefined && data.score !== null) {
    txt += `Score   : ${data.score}/${data.questions.length}\n`;
  }
  txt += `${'='.repeat(50)}\n\n`;

  data.questions.forEach((q, i) => {
    const userAnswer = data.answers[q.id] || 'No answer';
    txt += `Q${i + 1}. [${q.marks} marks] ${q.question}\n`;

    if (q.options) {
      Object.entries(q.options).forEach(([k, v]) => {
        txt += `   ${k}. ${v}\n`;
      });
    }

    txt += `\n   Your Answer  : ${userAnswer}\n`;

    if (q.correct) {
      const isRight = userAnswer === q.correct;
      txt += `   Correct Ans  : ${q.correct}\n`;
      txt += `   Status       : ${isRight ? 'Correct' : 'Incorrect'}\n`;
    }

    if (q.modelAnswer) {
      txt += `\n   Model Answer :\n   ${q.modelAnswer.replace(/\n/g, '\n   ')}\n`;
    }

    if (q.explanation) {
      txt += `\n   Explanation  : ${q.explanation}\n`;
    }

    txt += `\n${'-'.repeat(50)}\n\n`;
  });

  return txt;
}

/**
 * Master export dispatcher
 * @param {string} format - 'md'|'txt'|'json'
 * @param {Object} data
 * @returns {string}
 */
function generateExport(format, data) {
  switch (format) {
    case 'json': return generateJSONExport(data);
    case 'txt':  return generateTXTExport(data);
    case 'md':
    default:
      return data.mode === 'mcq'
        ? generateMCQMarkdown(data)
        : generateAllTypesMarkdown(data);
  }
}

/**
 * Trigger file download in browser
 * @param {string} filename
 * @param {string} content
 * @param {string} [mimeType]
 */
function downloadFile(filename, content, mimeType) {
  const mime = mimeType || (
    filename.endsWith('.json') ? 'application/json' :
    filename.endsWith('.md')   ? 'text/markdown'    :
    'text/plain'
  );

  const blob = new Blob([content], { type: mime + ';charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════════════════════
   DATA LOADING
══════════════════════════════════════════════════════════════ */

/**
 * Fetch questions from JSON file
 * @param {string} subjectCode
 * @param {number} unit
 * @returns {Promise<Array>}
 */
async function fetchQuestions(subjectCode, unit) {
  const path = `../_quiz-data/${subjectCode}/unit-${unit}.json`;
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // Support both {questions: [...]} and plain array
    return Array.isArray(data) ? data : (data.questions || []);
  } catch (e) {
    console.warn(`Could not load questions for ${subjectCode} unit ${unit}:`, e);
    return [];
  }
}

/**
 * Fetch questions for multiple units
 * @param {string} subjectCode
 * @param {number[]|string} units - array of unit numbers or 'all'
 * @returns {Promise<Array>}
 */
async function fetchMultipleUnits(subjectCode, units) {
  const subjectInfo = SUBJECTS[subjectCode];
  if (!subjectInfo) return [];

  let unitList;
  if (units === 'all') {
    unitList = Array.from({ length: subjectInfo.units }, (_, i) => i + 1);
  } else {
    unitList = Array.isArray(units) ? units : [units];
  }

  const promises = unitList.map(u => fetchQuestions(subjectCode, u));
  const results  = await Promise.all(promises);
  return results.flat();
}

/**
 * Fetch questions from multiple subjects
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
async function fetchAllSubjectQuestions(filters) {
  const codes = Object.keys(SUBJECTS);
  const promises = codes.map(code =>
    fetchMultipleUnits(code, filters.unit || 'all')
  );
  const results = await Promise.all(promises);
  return results.flat();
}

/* ══════════════════════════════════════════════════════════════
   PRESET BUILDER (used by index.js)
══════════════════════════════════════════════════════════════ */

/**
 * Build a quiz config from a preset definition
 * @param {Object} preset
 * @returns {Object} Config to pass to setup/play
 */
function buildPresetConfig(preset) {
  return {
    subject:    preset.subject || 'all',
    unit:       preset.unit || 'all',
    mode:       preset.mode || 'mcq',
    count:      preset.count || 10,
    difficulty: preset.difficulty || 'mixed',
    source:     preset.source || 'all',
    marks:      preset.marks || [],
    year:       preset.year || null,
    order:      preset.order || 'random',
    balance:    preset.balance || 'random',
    timer:      preset.timer !== undefined ? preset.timer : true,
    types:      preset.types || []
  };
}

/* ══════════════════════════════════════════════════════════════
   SCORE CALCULATION
══════════════════════════════════════════════════════════════ */

/**
 * Calculate score from MCQ answers
 * @param {Array} questions
 * @param {Object} answers - { questionId: selectedOption }
 * @returns {Object} { score, total, correct, incorrect, unanswered, percentage }
 */
function calculateScore(questions, answers) {
  let correct   = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach(q => {
    const ans = answers[q.id];
    if (!ans) {
      unanswered++;
    } else if (ans === q.correct) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { score: correct, total, correct, incorrect, unanswered, percentage };
}

/* ══════════════════════════════════════════════════════════════
   DOM HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * Safely query a selector; throws a clear error if missing
 * @param {string} selector
 * @param {Element} [parent]
 * @returns {Element}
 */
function qs(selector, parent = document) {
  const el = parent.querySelector(selector);
  if (!el) {
    console.warn(`Element not found: ${selector}`);
  }
  return el;
}

/**
 * Query all matching elements
 * @param {string} selector
 * @param {Element} [parent]
 * @returns {NodeList}
 */
function qsa(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Create element with optional class and text
 * @param {string} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

/**
 * Show an element (remove hidden class)
 * @param {Element} el
 */
function showEl(el) {
  if (el) el.classList.remove('hidden');
}

/**
 * Hide an element (add hidden class)
 * @param {Element} el
 */
function hideEl(el) {
  if (el) el.classList.add('hidden');
}

/**
 * Toggle hidden state
 * @param {Element} el
 */
function toggleEl(el) {
  if (el) el.classList.toggle('hidden');
}

/**
 * Attach a theme toggle button
 * @param {HTMLElement} btn
 */
function attachThemeToggle(btn) {
  if (!btn) return;
  btn.addEventListener('click', () => {
    toggleTheme();
  });
}

/* ══════════════════════════════════════════════════════════════
   INITIALISATION HELPER
══════════════════════════════════════════════════════════════ */

/**
 * Common page init: theme, theme toggle button
 */
function commonInit() {
  initTheme();
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) attachThemeToggle(themeBtn);
}

/* ══════════════════════════════════════════════════════════════
   URL PARAM HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * Get a URL search parameter value
 * @param {string} key
 * @returns {string|null}
 */
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Build a URL with search parameters
 * @param {string} base - Base URL path
 * @param {Object} params
 * @returns {string}
 */
function buildURL(base, params) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined) url.set(k, v);
  });
  const str = url.toString();
  return str ? `${base}?${str}` : base;
}

/* ── Run common init when DOM ready ────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', commonInit);
} else {
  commonInit();
}