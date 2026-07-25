/**
 * Main Application Logic
 * Handles welcome screen, navigation, subjects data, and UI interactions
 */

// ================================
// App State & Configuration
// ================================

const APP_STATE = {
  firstLaunch: true,
  studentName: '',
  lastVisited: {},
  subjects: [
    {
      code: 'CST201',
      name: 'Computer Programming in C',
      credits: 2,
      units: 5,
      icon: '💻',
      color: '#3b82f6',
      colorLight: '#60a5fa',
      path: 'subjects/CST201/index.html'
    },
    {
      code: 'CST203',
      name: 'Scripting Languages (Python)',
      credits: 2,
      units: 5,
      icon: '🐍',
      color: '#10b981',
      colorLight: '#34d399',
      path: 'subjects/CST203/index.html'
    },
    {
      code: 'CST205',
      name: 'Data Structures',
      credits: 2,
      units: 4,
      icon: '📊',
      color: '#8b5cf6',
      colorLight: '#a78bfa',
      path: 'subjects/CST205/index.html'
    },
    {
      code: 'CST207',
      name: 'Computer System Organization',
      credits: 4,
      units: 5,
      icon: '⚙️',
      color: '#f59e0b',
      colorLight: '#fbbf24',
      path: 'subjects/CST207/index.html'
    },
    {
      code: 'CST209',
      name: 'Algorithms',
      credits: 4,
      units: 5,
      icon: '🧮',
      color: '#ec4899',
      colorLight: '#f472b6',
      path: 'subjects/CST209/index.html'
    }
  ]
};

// ================================
// LocalStorage Management
// ================================

const Storage = {
  keys: {
    firstLaunch: 'diploma-3rd-sem-first-launch',
    studentName: 'diploma-3rd-sem-student-name',
    lastVisited: 'diploma-3rd-sem-last-visited',
    bookmarks: 'diploma-3rd-sem-bookmarks',
    practiceProgress: 'diploma-3rd-sem-practice-progress',
    quizScores: 'diploma-3rd-sem-quiz-scores'
  },

  get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  clear() {
    try {
      Object.values(this.keys).forEach(key => this.remove(key));
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }
};

// ================================
// Welcome Screen Logic
// ================================

class WelcomeScreen {
  constructor() {
    this.screen = document.getElementById('welcomeScreen');
    this.appContainer = document.getElementById('appContainer');
    this.startBtn = document.getElementById('startBtn');
    this.nameInput = document.getElementById('studentName');
    
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
      this.nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleStart();
        }
      });

      // Auto-focus name input
      setTimeout(() => {
        this.nameInput.focus();
      }, 500);
    }
  }

  handleStart() {
    const name = this.nameInput ? this.nameInput.value.trim() : '';
    
    if (name) {
      Storage.set(Storage.keys.studentName, name);
      APP_STATE.studentName = name;
    } else {
      Storage.set(Storage.keys.studentName, 'Student');
      APP_STATE.studentName = 'Student';
    }
    
    Storage.set(Storage.keys.firstLaunch, true);
    
    this.hideWelcome();
    setTimeout(() => this.showApp(), 300);
  }

  hideWelcome() {
    if (this.screen) {
      this.screen.classList.add('hidden');
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
  loadStudentName();
  renderGreeting();
  renderDate();
  renderSubjects();
  checkContinueCard();
  setupNavigation();
  setupMenu();
  calculateExamCountdown();
}

// ================================
// Greeting & Date Display
// ================================

function loadStudentName() {
  const name = Storage.get(Storage.keys.studentName);
  APP_STATE.studentName = name || 'Student';
}

function renderGreeting() {
  const hour = new Date().getHours();
  const greetingTitle = document.getElementById('greetingTitle');
  const greetingName = document.getElementById('greetingName');
  const profileName = document.getElementById('profileName');
  const profileAvatar = document.getElementById('profileAvatar');

  let greeting = 'Good Morning';
  let emoji = '🌅';
  
  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
    emoji = '☀️';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good Evening';
    emoji = '🌆';
  } else if (hour >= 21 || hour < 5) {
    greeting = 'Good Night';
    emoji = '🌙';
  }

  if (greetingTitle) {
    greetingTitle.textContent = `${greeting} ${emoji}`;
  }

  if (greetingName) {
    greetingName.textContent = `Hey ${APP_STATE.studentName}, ready to study?`;
  }

  if (profileName) {
    profileName.textContent = APP_STATE.studentName;
  }

  if (profileAvatar) {
    const initial = APP_STATE.studentName.charAt(0).toUpperCase();
    profileAvatar.textContent = initial;
  }
}

function renderDate() {
  const dateDisplay = document.getElementById('dateDisplay');
  
  if (dateDisplay) {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const today = new Date().toLocaleDateString('en-US', options);
    dateDisplay.textContent = today;
  }
}

function calculateExamCountdown() {
  const examCountdown = document.getElementById('examCountdown');
  
  if (!examCountdown) return;

  // Set your exam date here (Year, Month-1, Day)
  const examDate = new Date(2025, 4, 15); // May 15, 2025
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);
  
  const diffTime = examDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    examCountdown.innerHTML = `<svg class="icon"><use href="assets/icons/sprite.svg#calendar"></use></svg> ${diffDays} days until exams`;
  } else if (diffDays > 0 && diffDays <= 30) {
    examCountdown.innerHTML = `<svg class="icon"><use href="assets/icons/sprite.svg#clock"></use></svg> ${diffDays} days left!`;
    examCountdown.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else if (diffDays === 0) {
    examCountdown.innerHTML = `<svg class="icon"><use href="assets/icons/sprite.svg#target"></use></svg> Exam today!`;
    examCountdown.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  } else {
    examCountdown.style.display = 'none';
  }
}

// ================================
// Subject Cards Rendering
// ================================

function renderSubjects() {
  const grid = document.getElementById('subjectGrid');
  
  if (!grid) return;

  grid.innerHTML = APP_STATE.subjects.map(subject => `
    <a href="${subject.path}" class="subject-card" style="--subject-color: ${subject.color}; --subject-color-light: ${subject.colorLight};">
      <div class="subject-header">
        <div class="subject-icon">${subject.icon}</div>
        <div class="subject-code">${subject.code}</div>
      </div>
      <h3 class="subject-name">${subject.name}</h3>
      <div class="subject-meta">
        <div class="meta-item">
          <svg class="icon"><use href="assets/icons/sprite.svg#layers"></use></svg>
          <span>${subject.units} Units</span>
        </div>
        <div class="meta-item">
          <svg class="icon"><use href="assets/icons/sprite.svg#award"></use></svg>
          <span>${subject.credits} Credits</span>
        </div>
      </div>
    </a>
  `).join('');

  // Add click tracking for "Continue" feature
  const subjectCards = grid.querySelectorAll('.subject-card');
  subjectCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const subject = APP_STATE.subjects[index];
      Storage.set(Storage.keys.lastVisited, {
        subjectCode: subject.code,
        subjectName: subject.name,
        subjectIcon: subject.icon,
        timestamp: Date.now()
      });
    });
  });
}

// ================================
// Continue Card Logic
// ================================

function checkContinueCard() {
  const continueCard = document.getElementById('continueCard');
  const lastVisited = Storage.get(Storage.keys.lastVisited);

  if (!continueCard || !lastVisited) return;

  const { subjectCode, subjectName, subjectIcon, timestamp } = lastVisited;
  
  // Show continue card if last visit was within 7 days
  const daysSinceVisit = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
  
  if (daysSinceVisit <= 7 && subjectCode) {
    const subject = APP_STATE.subjects.find(s => s.code === subjectCode);
    
    if (subject) {
      const continueIconEl = document.getElementById('continueIcon');
      const continueSubjectEl = document.getElementById('continueSubject');
      
      if (continueIconEl) {
        continueIconEl.textContent = subjectIcon || subject.icon;
      }
      
      if (continueSubjectEl) {
        continueSubjectEl.textContent = subjectName || subject.name;
      }
      
      continueCard.style.display = 'flex';
      
      // Make card clickable
      continueCard.style.cursor = 'pointer';
      continueCard.addEventListener('click', () => {
        window.location.href = subject.path;
      });
    }
  } else {
    continueCard.style.display = 'none';
  }
}

// ================================
// Navigation & Menu
// ================================

function setupNavigation() {
  const backBtn = document.getElementById('backBtn');
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }
}

function setupMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  const sideMenu = document.getElementById('sideMenu');
  const resetAppBtn = document.getElementById('resetAppBtn');

  function openMenu() {
    if (menuOverlay && sideMenu) {
      menuOverlay.classList.add('active');
      sideMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    if (menuOverlay && sideMenu) {
      menuOverlay.classList.remove('active');
      sideMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  if (resetAppBtn) {
    resetAppBtn.addEventListener('click', () => {
      const confirmReset = confirm(
        'Are you sure you want to reset all app data?\n\n' +
        'This will clear:\n' +
        '• Your name\n' +
        '• Bookmarks\n' +
        '• Practice progress\n' +
        '• Quiz scores\n' +
        '• Theme preference\n\n' +
        'This action cannot be undone!'
      );
      
      if (confirmReset) {
        Storage.clear();
        
        // Show success message
        alert('✅ App data has been reset successfully!\n\nThe page will now reload.');
        
        // Reload page to show welcome screen again
        window.location.reload();
      }
    });
  }

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sideMenu && sideMenu.classList.contains('active')) {
        closeMenu();
      }
    }
  });

  // Prevent menu from closing when clicking inside it
  if (sideMenu) {
    sideMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// ================================
// Utility Functions
// ================================

/**
 * Format a date to relative time (e.g., "2 days ago")
 */
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if device is mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if app is installed as PWA
 */
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Show a toast notification (can be implemented later)
 */
function showToast(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // TODO: Implement visual toast notification in future update
}

/**
 * Get subject by code
 */
function getSubjectByCode(code) {
  return APP_STATE.subjects.find(s => s.code === code);
}

/**
 * Calculate total study progress (placeholder for future)
 */
function calculateOverallProgress() {
  // This will be implemented when practice and quiz systems are ready
  const practiceProgress = Storage.get(Storage.keys.practiceProgress) || {};
  const quizScores = Storage.get(Storage.keys.quizScores) || [];
  
  // Placeholder calculation
  return {
    practice: Object.keys(practiceProgress).length,
    quizzes: quizScores.length,
    totalDays: 30
  };
}

// ================================
// Event Listeners for App Lifecycle
// ================================

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Update greeting and date when user returns to app
    renderGreeting();
    renderDate();
    calculateExamCountdown();
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  showToast('You are back online!', 'success');
});

window.addEventListener('offline', () => {
  showToast('You are offline. Some features may be limited.', 'warning');
});

// Update date at midnight
function scheduleNextMidnightUpdate() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeUntilMidnight = tomorrow - now;
  
  setTimeout(() => {
    renderDate();
    renderGreeting();
    calculateExamCountdown();
    scheduleNextMidnightUpdate(); // Schedule next update
  }, timeUntilMidnight);
}

// ================================
// Initialize Everything on DOM Load
// ================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize welcome screen (which decides whether to show app or welcome)
  new WelcomeScreen();
  
  // Schedule midnight updates
  scheduleNextMidnightUpdate();
  
  // Log app info in console
  console.log('%c📚 Diploma 3rd Sem - Study Hub', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cVersion 1.0.0', 'color: #94a3b8; font-size: 12px;');
  console.log('%cMade for WB Polytechnic Students', 'color: #94a3b8; font-size: 12px;');
  
  if (isPWA()) {
    console.log('%c✅ Running as installed PWA', 'color: #10b981; font-size: 12px;');
  }
  
  if (isMobile()) {
    console.log('%c📱 Mobile device detected', 'color: #3b82f6; font-size: 12px;');
  }
});

// ================================
// Export for use in other scripts (if needed)
// ================================

// Make certain functions globally available
window.APP = {
  state: APP_STATE,
  storage: Storage,
  utils: {
    formatRelativeTime,
    debounce,
    isMobile,
    isPWA,
    showToast,
    getSubjectByCode
  }
};