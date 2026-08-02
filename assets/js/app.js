/**
 * Main Application Logic
 * Diploma 3rd Sem - Study Hub
 * Enhanced: Streak system, Toast notifications,
 * Today's Focus, Progress tracking, Accessibility
 */

// ================================
// App Configuration
// ================================

const APP_CONFIG = {
  version: '1.0.0',
  examDate: new Date(2027, 1, 15), // May 15, 2025 — update as needed
  streakGracePeriodHours: 26,      // Allow slight delay before streak breaks
  toastDuration: 3500,             // ms before toast auto-dismisses
  skeletonDelay: 600,              // ms before replacing skeletons
};

// ================================
// App State
// ================================

const APP_STATE = {
  studentName: '',
  lastVisited: {},
  subjects: [
    {
      code: 'CST201',
      name: 'Computer Programming in C',
      shortName: 'C Programming',
      credits: 2,
      units: 5,
      icon: '💻',
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
      icon: '🐍',
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
      icon: '📊',
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
      icon: '⚙️',
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
      icon: '🧮',
      color: '#ec4899',
      colorLight: '#f472b6',
      colorRgb: '236, 72, 153',
      path: 'subjects/CST209/index.html'
    }
  ],

  // 30-day roadmap focus data
  // Each day: title + which subjects to focus on
  roadmap: [
    { day: 1,  title: 'C Basics & Python Intro',          subjects: ['CST201', 'CST203'] },
    { day: 2,  title: 'C Control Flow & Python Syntax',   subjects: ['CST201', 'CST203'] },
    { day: 3,  title: 'Functions in C & Python',          subjects: ['CST201', 'CST203'] },
    { day: 4,  title: 'Arrays & Lists',                   subjects: ['CST201', 'CST203'] },
    { day: 5,  title: 'Pointers & Python OOP Basics',     subjects: ['CST201', 'CST203'] },
    { day: 6,  title: 'Structures & File Handling',       subjects: ['CST201', 'CST203'] },
    { day: 7,  title: 'Revision — C & Python',            subjects: ['CST201', 'CST203'] },
    { day: 8,  title: 'Intro to Data Structures',         subjects: ['CST205'] },
    { day: 9,  title: 'Arrays & Linked Lists',            subjects: ['CST205'] },
    { day: 10, title: 'Stacks & Queues',                  subjects: ['CST205'] },
    { day: 11, title: 'Trees — Binary & BST',             subjects: ['CST205'] },
    { day: 12, title: 'Graphs & Hashing',                 subjects: ['CST205'] },
    { day: 13, title: 'DS Revision + PYQs',               subjects: ['CST205'] },
    { day: 14, title: 'Mixed Revision — Week 2',          subjects: ['CST201', 'CST203', 'CST205'] },
    { day: 15, title: 'Number Systems & Boolean Algebra', subjects: ['CST207'] },
    { day: 16, title: 'Logic Gates & Combinational',      subjects: ['CST207'] },
    { day: 17, title: 'Sequential Circuits',              subjects: ['CST207'] },
    { day: 18, title: 'Memory & I/O Organization',        subjects: ['CST207'] },
    { day: 19, title: 'CPU Architecture & Pipelining',    subjects: ['CST207'] },
    { day: 20, title: 'CSO Revision + PYQs',              subjects: ['CST207'] },
    { day: 21, title: 'Algorithm Analysis & Sorting',     subjects: ['CST209'] },
    { day: 22, title: 'Divide & Conquer',                 subjects: ['CST209'] },
    { day: 23, title: 'Greedy Algorithms',                subjects: ['CST209'] },
    { day: 24, title: 'Dynamic Programming',              subjects: ['CST209'] },
    { day: 25, title: 'Graph Algorithms',                 subjects: ['CST209'] },
    { day: 26, title: 'Algorithms Revision + PYQs',       subjects: ['CST209'] },
    { day: 27, title: 'Full Revision — All Subjects',     subjects: ['CST201', 'CST203', 'CST205', 'CST207', 'CST209'] },
    { day: 28, title: 'PYQ Marathon — Day 1',             subjects: ['CST201', 'CST205'] },
    { day: 29, title: 'PYQ Marathon — Day 2',             subjects: ['CST207', 'CST209'] },
    { day: 30, title: 'Final Revision & Rest',            subjects: ['CST201', 'CST203', 'CST205', 'CST207', 'CST209'] },
  ]
};

// ================================
// LocalStorage Management
// ================================

const Storage = {
  keys: {
    firstLaunch:      'diploma-3rd-sem-first-launch',
    studentName:      'diploma-3rd-sem-student-name',
    lastVisited:      'diploma-3rd-sem-last-visited',
    bookmarks:        'diploma-3rd-sem-bookmarks',
    practiceProgress: 'diploma-3rd-sem-practice-progress',
    quizScores:       'diploma-3rd-sem-quiz-scores',
    streak:           'diploma-3rd-sem-streak',
    lastStudyDate:    'diploma-3rd-sem-last-study-date',
    roadmapStartDate: 'diploma-3rd-sem-roadmap-start',
  },

  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('[Storage] get error:', e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[Storage] set error:', e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('[Storage] remove error:', e);
      return false;
    }
  },

  clear() {
    try {
      Object.values(this.keys).forEach(key => this.remove(key));
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

const Toast = {
  container: null,
  queue: [],

  icons: {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️'
  },

  init() {
    this.container = document.getElementById('toastContainer');
  },

  show(message, type = 'info', duration = APP_CONFIG.toastDuration) {
    if (!this.container) {
      // Fallback if container not ready
      console.log(`[Toast ${type}] ${message}`);
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${this.icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${this._escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Dismiss notification">×</button>
    `;

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this._dismiss(toast));

    this.container.appendChild(toast);

    // Auto dismiss
    const timer = setTimeout(() => this._dismiss(toast), duration);

    // Store timer on element for early dismissal
    toast._timer = timer;

    return toast;
  },

  _dismiss(toast) {
    if (!toast || toast._removing) return;
    toast._removing = true;

    clearTimeout(toast._timer);
    toast.classList.add('removing');

    toast.addEventListener('animationend', () => {
      toast.remove();
    }, { once: true });

    // Fallback remove if animation doesn't fire
    setTimeout(() => toast.remove(), 400);
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
};

// ================================
// Streak System
// ================================

const Streak = {

  /**
   * Get current streak data from storage
   */
  getData() {
    return Storage.get(Storage.keys.streak) || {
      count: 0,
      lastDate: null
    };
  },

  /**
   * Save streak data
   */
  saveData(data) {
    Storage.set(Storage.keys.streak, data);
  },

  /**
   * Get today's date string YYYY-MM-DD
   */
  todayString() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Get yesterday's date string YYYY-MM-DD
   */
  yesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  },

  /**
   * Record that user studied today.
   * Call this when user opens a subject or completes practice.
   */
  recordStudy() {
    const data  = this.getData();
    const today = this.todayString();
    const yesterday = this.yesterdayString();

    // Already recorded today — no change
    if (data.lastDate === today) return data;

    if (data.lastDate === yesterday) {
      // Continued from yesterday — increment
      data.count++;
    } else if (data.lastDate === null) {
      // First ever study
      data.count = 1;
    } else {
      // Gap detected — reset streak
      data.count = 1;
    }

    data.lastDate = today;
    this.saveData(data);

    return data;
  },

  /**
   * Check if streak is still alive.
   * Streak breaks if last study was before yesterday.
   */
  isAlive() {
    const data = this.getData();
    if (!data.lastDate) return false;

    const today     = this.todayString();
    const yesterday = this.yesterdayString();

    return data.lastDate === today || data.lastDate === yesterday;
  },

  /**
   * Get current streak count (0 if broken)
   */
  getCount() {
    if (!this.isAlive()) return 0;
    return this.getData().count;
  },

  /**
   * Reset streak (used in app reset)
   */
  reset() {
    this.saveData({ count: 0, lastDate: null });
  }
};

// ================================
// Roadmap Day Calculator
// ================================

const Roadmap = {

  /**
   * Get or create the roadmap start date.
   * Start date = first time user launched the app.
   */
  getStartDate() {
    const saved = Storage.get(Storage.keys.roadmapStartDate);
    if (saved) return new Date(saved);

    // First launch — set start date to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    Storage.set(Storage.keys.roadmapStartDate, today.toISOString());
    return today;
  },

  /**
   * Get current roadmap day (1–30).
   * Returns null if beyond day 30.
   */
  getCurrentDay() {
    const start = this.getStartDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs   = today - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const day      = diffDays + 1; // Day 1 on launch day

    if (day < 1)  return 1;
    if (day > 30) return null; // Roadmap complete
    return day;
  },

  /**
   * Get today's roadmap entry
   */
  getTodayEntry() {
    const day = this.getCurrentDay();
    if (!day) return null;
    return APP_STATE.roadmap.find(r => r.day === day) || null;
  }
};

// ================================
// Welcome Screen
// ================================

class WelcomeScreen {
  constructor() {
    this.screen       = document.getElementById('welcomeScreen');
    this.appContainer = document.getElementById('appContainer');
    this.startBtn     = document.getElementById('startBtn');
    this.nameInput    = document.getElementById('studentName');

    this.init();
  }

  init() {
    const hasLaunched = Storage.get(Storage.keys.firstLaunch);

    if (hasLaunched) {
      this.hideWelcome();
      this.showApp();
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.handleStart());
    }

    if (this.nameInput) {
      this.nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleStart();
      });

      // Focus name input after welcome animation
      setTimeout(() => {
        if (this.nameInput) this.nameInput.focus();
      }, 700);
    }
  }

  handleStart() {
    const rawName = this.nameInput ? this.nameInput.value.trim() : '';
    const name    = rawName.length > 0 ? rawName : 'Student';

    // Sanitize — strip HTML tags
    const safeName = name.replace(/<[^>]*>/g, '').slice(0, 20);

    Storage.set(Storage.keys.studentName, safeName);
    Storage.set(Storage.keys.firstLaunch, true);
    APP_STATE.studentName = safeName;

    // Record first study day for streak + roadmap
    Streak.recordStudy();

    // Animate button
    if (this.startBtn) {
      this.startBtn.style.opacity = '0.7';
      this.startBtn.disabled = true;
    }

    this.hideWelcome();
    setTimeout(() => this.showApp(), 350);
  }

  hideWelcome() {
    if (this.screen) {
      this.screen.classList.add('hidden');
      // Remove from accessibility tree
      this.screen.setAttribute('aria-hidden', 'true');
    }
  }

  showApp() {
    if (this.appContainer) {
      this.appContainer.classList.remove('hidden');
      initApp();
    }
  }
}

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

  // Render subjects after brief delay
  // Gives skeleton loaders time to show
  setTimeout(() => {
    renderSubjects();
  }, APP_CONFIG.skeletonDelay);

  // Update streak — user opened the app
  Streak.recordStudy();
}

// ================================
// Student Name
// ================================

function loadStudentName() {
  const name = Storage.get(Storage.keys.studentName);
  APP_STATE.studentName = name || 'Student';
}

// ================================
// Greeting
// ================================

function renderGreeting() {
  const hour = new Date().getHours();

  const greetings = [
    { range: [5,  12], text: 'Good Morning',   emoji: '🌅' },
    { range: [12, 17], text: 'Good Afternoon',  emoji: '☀️' },
    { range: [17, 21], text: 'Good Evening',    emoji: '🌆' },
    { range: [21, 24], text: 'Good Night',      emoji: '🌙' },
    { range: [0,  5],  text: 'Still Studying?', emoji: '🌙' },
  ];

  const match = greetings.find(g => hour >= g.range[0] && hour < g.range[1]);
  const { text, emoji } = match || greetings[0];

  const greetingTitle  = document.getElementById('greetingTitle');
  const greetingName   = document.getElementById('greetingName');
  const profileName    = document.getElementById('profileName');
  const profileAvatar  = document.getElementById('profileAvatar');

  if (greetingTitle) {
    greetingTitle.textContent = `${text} ${emoji}`;
  }

  if (greetingName) {
    // Inject name with accent highlight span
    greetingName.innerHTML = `Hey <span class="name-highlight">${_escapeHtml(APP_STATE.studentName)}</span>, ready to study?`;
  }

  if (profileName) {
    profileName.textContent = APP_STATE.studentName;
  }

  if (profileAvatar) {
    const initial = APP_STATE.studentName.charAt(0).toUpperCase();
    profileAvatar.textContent = initial;
  }
}

// ================================
// Date Display
// ================================

function renderDate() {
  const dateDisplay = document.getElementById('dateDisplay');
  if (!dateDisplay) return;

  const today = new Date();
  const options = {
    weekday: 'short',
    month:   'short',
    day:     'numeric'
  };

  dateDisplay.textContent = today.toLocaleDateString('en-US', options);
}

// ================================
// Exam Countdown
// ================================

function calculateExamCountdown() {
  const examCountdown = document.getElementById('examCountdown');
  if (!examCountdown) return;

  const today    = new Date();
  const examDate = new Date(APP_CONFIG.examDate);

  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    examCountdown.innerHTML = `
      <svg class="icon" aria-hidden="true">
        <use href="assets/icons/sprite.svg#calendar"></use>
      </svg>
      ${diffDays}d to exams
    `;
    examCountdown.style.background = '';
  } else if (diffDays > 0) {
    examCountdown.innerHTML = `
      <svg class="icon" aria-hidden="true">
        <use href="assets/icons/sprite.svg#clock"></use>
      </svg>
      ${diffDays}d left!
    `;
    examCountdown.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else if (diffDays === 0) {
    examCountdown.innerHTML = `
      <svg class="icon" aria-hidden="true">
        <use href="assets/icons/sprite.svg#target"></use>
      </svg>
      Exam today!
    `;
    examCountdown.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else {
    // Exams over
    examCountdown.innerHTML = `
      <svg class="icon" aria-hidden="true">
        <use href="assets/icons/sprite.svg#check"></use>
      </svg>
      Exams done!
    `;
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
  const streakValue = document.getElementById('streakValue');
  const streakCard  = document.getElementById('streakCard');
  if (!streakValue || !streakCard) return;

  const count   = Streak.getCount();
  const isAlive = Streak.isAlive();

  streakValue.textContent = count;

  // Update icon based on streak state
  const iconEl = streakCard.querySelector('.stat-card-icon');
  if (iconEl) {
    iconEl.textContent = count >= 3 ? '🔥' : count > 0 ? '✨' : '💤';
  }

  // Visual state
  streakCard.classList.toggle('streak-active', isAlive && count > 0);
  streakCard.classList.toggle('streak-zero',   !isAlive || count === 0);

  // Update aria-label
  streakCard.setAttribute(
    'aria-label',
    count > 0
      ? `${count} day study streak — keep it up!`
      : 'No streak yet — study today to start one!'
  );
}

function renderPracticeCount() {
  const practiceValue = document.getElementById('practiceValue');
  if (!practiceValue) return;

  const progress = Storage.get(Storage.keys.practiceProgress) || {};
  const done     = Object.values(progress).filter(p => p.completed).length;

  practiceValue.textContent = done;
}

function renderQuizCount() {
  const quizValue = document.getElementById('quizValue');
  if (!quizValue) return;

  const scores = Storage.get(Storage.keys.quizScores) || [];
  quizValue.textContent = scores.length;
}

// ================================
// Today's Focus Card
// ================================

function renderTodayFocus() {
  const focusCard     = document.getElementById('focusCard');
  const focusDay      = document.getElementById('focusDay');
  const focusTitle    = document.getElementById('focusTitle');
  const focusSubjects = document.getElementById('focusSubjects');

  if (!focusCard) return;

  const entry = Roadmap.getTodayEntry();

  if (!entry) {
    // Beyond day 30 — roadmap complete
    if (focusDay)   focusDay.textContent   = '🎉 Complete!';
    if (focusTitle) focusTitle.textContent = 'You\'ve finished the 30-day roadmap. Keep revising!';
    if (focusSubjects) focusSubjects.innerHTML = '';

    focusCard.setAttribute('aria-label', 'Roadmap complete — keep revising!');
    focusCard.onclick = () => window.location.href = 'roadmap/index.html';
    return;
  }

  if (focusDay)   focusDay.textContent   = `Day ${entry.day} of 30`;
  if (focusTitle) focusTitle.textContent = entry.title;

  if (focusSubjects) {
    focusSubjects.innerHTML = entry.subjects.map(code => {
      const subject = APP_STATE.subjects.find(s => s.code === code);
      return subject
        ? `<span class="focus-subject-tag">${subject.icon} ${subject.shortName}</span>`
        : '';
    }).join('');
  }

  // Navigate to roadmap on click or Enter key
  const navigate = () => window.location.href = 'roadmap/index.html';
  focusCard.addEventListener('click', navigate);
  focusCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate();
    }
  });

  focusCard.setAttribute(
    'aria-label',
    `Today's focus: Day ${entry.day} — ${entry.title}. Tap to view roadmap.`
  );
}

// ================================
// Subject Cards
// ================================

function renderSubjects() {
  const grid = document.getElementById('subjectGrid');
  if (!grid) return;

  // Read practice progress for progress bars
  const practiceProgress = Storage.get(Storage.keys.practiceProgress) || {};

  grid.innerHTML = APP_STATE.subjects.map(subject => {

    // Calculate progress for this subject
    // Days 1–30 tagged to subjects in roadmap
    const subjectDays = APP_STATE.roadmap
      .filter(r => r.subjects.includes(subject.code))
      .map(r => r.day);

    const completedDays = subjectDays.filter(day => {
      const key = `day${day}`;
      return practiceProgress[key]?.completed === true;
    });

    const progressPct = subjectDays.length > 0
      ? Math.round((completedDays.length / subjectDays.length) * 100)
      : 0;

    return `
      <a
        href="${subject.path}"
        class="subject-card"
        role="listitem"
        aria-label="${subject.name} — ${subject.units} units, ${subject.credits} credits, ${progressPct}% complete"
        style="
          --subject-color: ${subject.color};
          --subject-color-light: ${subject.colorLight};
          --subject-color-rgb: ${subject.colorRgb};
        "
      >
        <div class="subject-header">
          <div class="subject-icon" aria-hidden="true">${subject.icon}</div>
          <div class="subject-code">${subject.code}</div>
        </div>

        <h3 class="subject-name">${subject.name}</h3>

        <div class="subject-meta">
          <div class="meta-item">
            <svg class="icon" aria-hidden="true">
              <use href="assets/icons/sprite.svg#layers"></use>
            </svg>
            <span>${subject.units} Units</span>
          </div>
          <div class="meta-item">
            <svg class="icon" aria-hidden="true">
              <use href="assets/icons/sprite.svg#award"></use>
            </svg>
            <span>${subject.credits} Credits</span>
          </div>
        </div>

        <div class="subject-progress" aria-hidden="true">
          <div class="subject-progress-header">
            <span class="subject-progress-label">Progress</span>
            <span class="subject-progress-value">${progressPct}%</span>
          </div>
          <div class="progress-bar-track">
            <div
              class="progress-bar-fill"
              style="width: ${progressPct}%"
            ></div>
          </div>
        </div>
      </a>
    `;
  }).join('');

  // Track subject visits for Continue card
  const subjectCards = grid.querySelectorAll('.subject-card');
  subjectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const subject = APP_STATE.subjects[index];
      Storage.set(Storage.keys.lastVisited, {
        subjectCode: subject.code,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        subjectPath: subject.path,
        timestamp:   Date.now()
      });
      // Record study for streak
      Streak.recordStudy();
    });
  });
}

// ================================
// Continue Card
// ================================

function checkContinueCard() {
  const continueCard    = document.getElementById('continueCard');
  const lastVisited     = Storage.get(Storage.keys.lastVisited);

  if (!continueCard) return;

  if (!lastVisited) {
    continueCard.style.display = 'none';
    return;
  }

  const { subjectCode, subjectName, subjectIcon, subjectPath, timestamp } = lastVisited;
  const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);

  if (daysSince <= 7 && subjectCode) {
    const subject = APP_STATE.subjects.find(s => s.code === subjectCode);
    if (!subject) {
      continueCard.style.display = 'none';
      return;
    }

    const continueIconEl    = document.getElementById('continueIcon');
    const continueSubjectEl = document.getElementById('continueSubject');

    if (continueIconEl)    continueIconEl.textContent    = subjectIcon || subject.icon;
    if (continueSubjectEl) continueSubjectEl.textContent = subjectName || subject.name;

    // Set the href directly — it's now an <a> tag
    continueCard.setAttribute(
      'href',
      subjectPath || subject.path
    );

    continueCard.setAttribute(
      'aria-label',
      `Continue studying ${subjectName || subject.name}`
    );

    continueCard.style.display = 'flex';

  } else {
    continueCard.style.display = 'none';
  }
}

// ================================
// Navigation
// ================================

function setupNavigation() {
  const backBtn = document.getElementById('backBtn');
  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  });
}

// ================================
// Side Menu
// ================================

function setupMenu() {
  const menuBtn     = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const menuOverlay  = document.getElementById('menuOverlay');
  const sideMenu     = document.getElementById('sideMenu');
  const resetAppBtn  = document.getElementById('resetAppBtn');

  // ── Open ──
  function openMenu() {
    if (!menuOverlay || !sideMenu) return;
    menuOverlay.classList.add('active');
    sideMenu.classList.add('active');
    sideMenu.setAttribute('aria-hidden', 'false');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus first item in menu
    setTimeout(() => {
      const firstItem = sideMenu.querySelector('a, button');
      if (firstItem) firstItem.focus();
    }, 300);
  }

  // ── Close ──
  function closeMenu() {
    if (!menuOverlay || !sideMenu) return;
    menuOverlay.classList.remove('active');
    sideMenu.classList.remove('active');
    sideMenu.setAttribute('aria-hidden', 'true');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Return focus to menu button
    if (menuBtn) menuBtn.focus();
  }

  if (menuBtn)      menuBtn.addEventListener('click', (e) => { e.stopPropagation(); openMenu(); });
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); closeMenu(); });
  if (menuOverlay)  menuOverlay.addEventListener('click', closeMenu);

  // Prevent clicks inside menu from closing it
  if (sideMenu) {
    sideMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  // ESC key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu?.classList.contains('active')) {
      closeMenu();
    }
  });

  // Trap focus inside menu when open
  if (sideMenu) {
    sideMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusable = sideMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // ── Reset App ──
  if (resetAppBtn) {
    resetAppBtn.addEventListener('click', () => {
      if (!confirm(
        'Reset all app data?\n\n' +
        'This clears:\n' +
        '• Your name\n' +
        '• Bookmarks\n' +
        '• Practice progress\n' +
        '• Quiz scores\n' +
        '• Study streak\n\n' +
        'Cannot be undone!'
      )) return;

      Storage.clear();
      Streak.reset();

      Toast.success('App data reset. Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    });
  }
}

// ================================
// Midnight Update Scheduler
// ================================

function scheduleNextMidnightUpdate() {
  const now       = new Date();
  const tomorrow  = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow - now;

  setTimeout(() => {
    renderDate();
    renderGreeting();
    calculateExamCountdown();
    renderTodayFocus();
    renderStatsBar();
    scheduleNextMidnightUpdate();
  }, msUntilMidnight);
}

// ================================
// Utility Functions
// ================================

/**
 * Escape HTML to prevent XSS
 */
function _escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/**
 * Format timestamp to relative time string
 */
function formatRelativeTime(timestamp) {
  const diff    = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (days > 0)    return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0)   return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Debounce
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Check if mobile device
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);
}

/**
 * Check if running as installed PWA
 */
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Get subject by code
 */
function getSubjectByCode(code) {
  return APP_STATE.subjects.find(s => s.code === code) || null;
}

// ================================
// App Lifecycle Events
// ================================

// Refresh UI when user returns to tab
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  renderGreeting();
  renderDate();
  calculateExamCountdown();
  renderStatsBar();
});

// Online / Offline toasts
window.addEventListener('online', () => {
  Toast.success('You are back online!');
});

window.addEventListener('offline', () => {
  Toast.warning('You are offline. Content may be limited.');
});

// ================================
// DOM Ready — Bootstrap
// ================================

document.addEventListener('DOMContentLoaded', () => {
  new WelcomeScreen();

  // Console branding
  console.log(
    '%c📚 Diploma 3rd Sem — Study Hub',
    'color:#6366f1;font-size:18px;font-weight:bold;'
  );
  console.log('%cv' + APP_CONFIG.version, 'color:#94a3b8;font-size:11px;');
  console.log(
    '%cMade for WB Polytechnic Students',
    'color:#94a3b8;font-size:11px;'
  );

  if (isPWA())   console.log('%c✅ Running as PWA',    'color:#10b981;font-size:11px;');
  if (isMobile()) console.log('%c📱 Mobile detected',  'color:#3b82f6;font-size:11px;');
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
    formatRelativeTime,
    debounce,
    isMobile,
    isPWA,
    getSubjectByCode,
  }
};