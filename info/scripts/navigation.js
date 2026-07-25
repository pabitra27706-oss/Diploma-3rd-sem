/* ===================================
   1st Semester Study Hub
   Navigation & More Menu Functions
   =================================== */

// Track if we're on the More menu
let isOnMoreMenu = false;
let previousScreen = 'screen1';

/**
 * Show the More Menu (Screen 4)
 */
function showMoreMenu() {
  // Save current screen before switching
  if (!isOnMoreMenu) {
    const screens = ['screen1', 'screen2', 'screen3'];
    for (let screenId of screens) {
      const screen = document.getElementById(screenId);
      if (screen && !screen.classList.contains('hidden')) {
        previousScreen = screenId;
        break;
      }
    }
  }
  
  // Hide all screens
  document.getElementById('screen1').classList.add('hidden');
  document.getElementById('screen2').classList.add('hidden');
  document.getElementById('screen3').classList.add('hidden');
  document.getElementById('screen4').classList.remove('hidden');
  
  // Update header
  document.getElementById('screenTitle').textContent = 'More';
  document.getElementById('breadcrumb').textContent = 'Settings & Information';
  
  // Update progress bar
  document.getElementById('progressFill').style.width = '100%';
  
  // Show back button
  document.getElementById('backBtn').style.visibility = 'visible';
  
  // Update footer nav buttons
  updateNavButtons(null);
  
  isOnMoreMenu = true;
}

/**
 * Close More Menu and go back to previous screen
 */
function closeMoreMenu() {
  if (isOnMoreMenu) {
    document.getElementById('screen4').classList.add('hidden');
    document.getElementById(previousScreen).classList.remove('hidden');
    isOnMoreMenu = false;
    
    // Restore header based on previous screen
    restoreScreenHeader(previousScreen);
    
    // Update nav buttons
    updateNavButtons(previousScreen);
  }
}

/**
 * Restore header text based on screen
 */
function restoreScreenHeader(screenId) {
  const headers = {
    'screen1': { title: 'Subjects', breadcrumb: 'Step 1: Choose Subject', progress: '33%' },
    'screen2': { title: 'Content Type', breadcrumb: 'Step 2: Choose Type', progress: '66%' },
    'screen3': { title: 'Content', breadcrumb: 'Step 3: Select Content', progress: '100%' }
  };
  
  const header = headers[screenId];
  if (header) {
    document.getElementById('screenTitle').textContent = header.title;
    document.getElementById('breadcrumb').textContent = header.breadcrumb;
    document.getElementById('progressFill').style.width = header.progress;
  }
}

/**
 * Update footer navigation button states
 */
function updateNavButtons(activeScreen) {
  const navBtns = document.querySelectorAll('.footer .nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));
  
  if (activeScreen === 'screen1') {
    navBtns[0].classList.add('active');
  } else if (activeScreen === 'screen2') {
    navBtns[1].classList.add('active');
  } else if (activeScreen === 'screen3') {
    navBtns[2].classList.add('active');
  }
}

/**
 * Open a section page
 */
function openSection(pageName) {
  window.location.href = 'app-resources/sections/' + pageName;
}

/**
 * Override the existing goBack function to handle Screen 4
 */
(function() {
  // Store the original goBack function
  const originalGoBack = window.goBack;
  
  // Override goBack
  window.goBack = function() {
    if (isOnMoreMenu) {
      closeMoreMenu();
    } else if (typeof originalGoBack === 'function') {
      originalGoBack();
    }
  };
})();


/* ===================================
   Section Page Helper Functions
   (Used by individual section pages)
   =================================== */

/**
 * Go back to main app (index.html)
 */
function goBackToApp() {
  window.location.href = '../../../index.html';
}

/**
 * Send email
 */
function sendEmail(email, subject, body) {
  const mailtoLink = 'mailto:' + email + '?subject=' + encodeURIComponent(subject || '') + '&body=' + encodeURIComponent(body || '');
  window.location.href = mailtoLink;
}

/**
 * Open Telegram
 */
function openTelegram(username) {
  window.location.href = 'https://t.me/' + username;
}

/**
 * Share app
 */
function shareApp() {
  const shareText = '📚 Check out 1st Semester Study Hub - Smart navigation for all your study materials! Download now and ace your exams!';
  
  if (navigator.share) {
    navigator.share({
      title: '1st Semester Study Hub',
      text: shareText,
      url: window.location.origin
    }).catch(console.error);
  } else {
    // Fallback: Copy to clipboard
    copyToClipboard(shareText);
    showToast('Share text copied to clipboard!');
  }
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(console.error);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Show toast message
 */
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #323232;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        animation: toastFade 0.3s ease;
    `;
  
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Rate app on Play Store
 */
function rateApp() {
  // Replace with your actual Play Store package name
  const packageName = 'com.yourdomain.studyhub';
  window.location.href = 'market://details?id=' + packageName;
}

/**
 * Open external link
 */
function openLink(url) {
  window.open(url, '_blank');
}

/**
 * Send feedback email with type
 */
function sendFeedback(type) {
  const subjects = {
    'bug': '[Bug Report] 1st Semester Study Hub',
    'feature': '[Feature Request] 1st Semester Study Hub',
    'general': '[Feedback] 1st Semester Study Hub'
  };
  
  const bodies = {
    'bug': 'Bug Description:\n\nSteps to Reproduce:\n1. \n2. \n3. \n\nExpected Behavior:\n\nActual Behavior:\n\nDevice Info:\n- Phone Model: \n- Android Version: ',
    'feature': 'Feature Request:\n\nDescription:\n\nWhy this would be helpful:\n',
    'general': 'Feedback:\n\n'
  };
  
  sendEmail(
    'your.email@example.com',
    subjects[type] || subjects['general'],
    bodies[type] || bodies['general']
  );
}

console.log('Navigation.js loaded successfully!');