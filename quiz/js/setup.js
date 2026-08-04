/* ============================================================
   quiz/js/setup.js
   Setup page logic: filter management, validation,
   timer calculation, summary preview, quiz launch
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */

const state = {
  subject:    '',
  units:      [],       // selected unit numbers; empty = all
  mode:       'mcq',
  count:      10,
  countMode:  '10',     // '5'|'10'|'15'|'20'|'auto'|'custom'
  difficulty: 'mixed',
  source:     'all',
  marks:      [],
  year:       null,
  types:      [],
  order:      'random',
  balance:    'random',
  timerEnabled: true,
  timerMinutes: 10,
  timerAuto:   true     // true = auto-calculated from marks
};

/* ══════════════════════════════════════════════════════════════
   DOM REFERENCES
══════════════════════════════════════════════════════════════ */

let formEl, subjectEl, unitOptionsEl, unitControlsEl;
let customCountGroup, customCountEl, autoCountInfo, countHiddenEl;
let timerToggleEl, timerDurationGroup, timerMinEl, timerPreviewEl;
let summaryBodyEl, summaryStatusEl;
let setupWarningEl, setupWarningText, setupErrorEl, setupErrorText;

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  cacheDOMRefs();
  readURLParams();
  bindAllEvents();
  updateSummary();
});

function cacheDOMRefs() {
  formEl            = qs('#setup-form');
  subjectEl         = qs('#subject-select');
  unitOptionsEl     = qs('#unit-options');
  unitControlsEl    = qs('#unit-controls');
  customCountGroup  = qs('#custom-count-group');
  customCountEl     = qs('#custom-count');
  autoCountInfo     = qs('#auto-count-info');
  countHiddenEl     = qs('#question-count');
  timerToggleEl     = qs('#timer-toggle');
  timerDurationGroup= qs('#timer-duration-group');
  timerMinEl        = qs('#timer-minutes');
  timerPreviewEl    = qs('#timer-preview');
  summaryBodyEl     = qs('#quiz-summary-body');
  summaryStatusEl   = qs('#summary-status');
  setupWarningEl    = qs('#setup-warning');
  setupWarningText  = qs('#setup-warning-text');
  setupErrorEl      = qs('#setup-error');
  setupErrorText    = qs('#setup-error-text');
}

/* ══════════════════════════════════════════════════════════════
   READ URL PARAMS (from preset or index page)
══════════════════════════════════════════════════════════════ */

function readURLParams() {
  const subject    = getParam('subject');
  const unit       = getParam('unit');
  const mode       = getParam('mode');
  const count      = getParam('count');
  const difficulty = getParam('difficulty');
  const source     = getParam('source');
  const order      = getParam('order');
  const balance    = getParam('balance');
  const timer      = getParam('timer');
  const types      = getParam('types');
  const marks      = getParam('marks');

  // Apply subject
  if (subject && subjectEl) {
    // Find the matching option
    const opt = subjectEl.querySelector(`option[value="${subject}"]`);
    if (opt) {
      subjectEl.value = subject;
      state.subject   = subject;
      handleSubjectChange(subject);
    }
  }

  // Apply unit (after subject rendered)
  if (unit && unit !== 'all') {
    const unitNums = unit.split(',').map(Number).filter(Boolean);
    setTimeout(() => {
      unitNums.forEach(u => {
        const cb = unitOptionsEl?.querySelector(`input[value="${u}"]`);
        if (cb) cb.checked = true;
      });
      state.units = unitNums;
    }, 50);
  }

  // Mode
  if (mode === 'mcq' || mode === 'all') {
    state.mode = mode;
    const modeInput = document.querySelector(`input[name="mode"][value="${mode}"]`);
    if (modeInput) modeInput.checked = true;
    handleModeChange(mode);
  }

  // Count
  if (count) {
    const countNum = parseInt(count, 10);
    if (!isNaN(countNum) && countNum > 0) {
      state.count = countNum;
      const preset = [5, 10, 15, 20].includes(countNum) ? String(countNum) : 'custom';
      setActiveCountBtn(preset === 'custom' ? 'custom' : String(countNum));
      if (preset === 'custom') {
        showEl(customCountGroup);
        if (customCountEl) customCountEl.value = countNum;
      }
      state.countMode = preset;
      if (countHiddenEl) countHiddenEl.value = countNum;
    }
  }

  // Difficulty
  if (difficulty) {
    state.difficulty = difficulty;
    const diffInput = document.querySelector(`input[name="difficulty"][value="${difficulty}"]`);
    if (diffInput) diffInput.checked = true;
  }

  // Source
  if (source) {
    state.source = source;
    const srcInput = document.querySelector(`input[name="source"][value="${source}"]`);
    if (srcInput) srcInput.checked = true;
  }

  // Order
  if (order) {
    state.order = order;
    const orderInput = document.querySelector(`input[name="order"][value="${order}"]`);
    if (orderInput) orderInput.checked = true;
  }

  // Balance
  if (balance) {
    state.balance = balance;
    const balInput = document.querySelector(`input[name="balance"][value="${balance}"]`);
    if (balInput) balInput.checked = true;
  }

  // Timer
  if (timer !== null) {
    state.timerEnabled = timer === '1';
    if (timerToggleEl) timerToggleEl.checked = state.timerEnabled;
    if (!state.timerEnabled && timerDurationGroup) {
      hideEl(timerDurationGroup);
    }
  }

  // Types
  if (types) {
    const typeArr = types.split(',').filter(Boolean);
    state.types = typeArr;
    typeArr.forEach(t => {
      const cb = document.querySelector(`input[name="types"][value="${t}"]`);
      if (cb) cb.checked = true;
    });
  }

  // Marks
  if (marks) {
    const marksArr = marks.split(',').map(Number).filter(Boolean);
    state.marks = marksArr;
    marksArr.forEach(m => {
      const cb = document.querySelector(`input[name="marks"][value="${m}"]`);
      if (cb) cb.checked = true;
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   EVENT BINDING
══════════════════════════════════════════════════════════════ */

function bindAllEvents() {
  bindSubjectSelect();
  bindUnitControls();
  bindModeCards();
  bindCountButtons();
  bindCountCustomInput();
  bindDifficultyChips();
  bindSourceChips();
  bindMarksChips();
  bindMarksPresets();
  bindYearFilter();
  bindTypeChips();
  bindOrderChips();
  bindBalanceChips();
  bindTimer();
  bindFormSubmit();
}

/* ── Subject ──────────────────────────────────────────────────  */
function bindSubjectSelect() {
  if (!subjectEl) return;
  subjectEl.addEventListener('change', e => {
    state.subject = e.target.value;
    handleSubjectChange(e.target.value);
    clearFieldError('subject-error');
    updateSummary();
  });
}

function handleSubjectChange(subjectCode) {
  if (!unitOptionsEl) return;

  if (!subjectCode || subjectCode === 'all') {
    unitOptionsEl.innerHTML =
      '<p class="text-secondary text-sm">Select a specific subject to filter by unit.</p>';
    hideEl(unitControlsEl);
    state.units = [];
    return;
  }

  // Render unit checkboxes
  renderUnits(subjectCode, unitOptionsEl, state.units);
  showEl(unitControlsEl);

  // Re-bind checkbox changes
  unitOptionsEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      state.units = Array.from(
        unitOptionsEl.querySelectorAll('input:checked')
      ).map(c => parseInt(c.value, 10));
      updateTimerIfAuto();
      updateSummary();
    });
  });

  // Auto-calculate timer
  updateTimerIfAuto();
  updateSummary();
}

/* ── Unit Controls ────────────────────────────────────────────  */
function bindUnitControls() {
  const selectAllBtn = qs('#btn-select-all-units');
  const clearBtn     = qs('#btn-clear-units');

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      unitOptionsEl?.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
      });
      state.units = Array.from(
        unitOptionsEl?.querySelectorAll('input[type="checkbox"]') || []
      ).map(c => parseInt(c.value, 10));
      updateSummary();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      unitOptionsEl?.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      state.units = [];
      updateSummary();
    });
  }
}

/* ── Mode ─────────────────────────────────────────────────────  */
function bindModeCards() {
  document.querySelectorAll('input[name="mode"]').forEach(input => {
    input.addEventListener('change', e => {
      state.mode = e.target.value;
      handleModeChange(e.target.value);
      updateSummary();
    });
  });
}

function handleModeChange(mode) {
  const typeGroup = qs('#type-filter-group');
  if (!typeGroup) return;

  if (mode === 'mcq') {
    // In MCQ mode: auto-lock type to mcq only
    const mcqTypeCheck = typeGroup.querySelector('input[value="mcq"]');
    typeGroup.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.value !== 'mcq') {
        cb.checked = false;
        cb.disabled = true;
        cb.closest('.chip-label')?.classList.add('disabled-chip');
      } else {
        cb.checked = true;
        cb.disabled = false;
        cb.closest('.chip-label')?.classList.remove('disabled-chip');
      }
    });
    state.types = ['mcq'];
  } else {
    // All Types mode: enable all
    typeGroup.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.disabled = false;
      cb.closest('.chip-label')?.classList.remove('disabled-chip');
    });
    // Reset to URL-provided types or empty
    state.types = Array.from(
      typeGroup.querySelectorAll('input:checked')
    ).map(cb => cb.value);
  }
}

/* ── Count Buttons ────────────────────────────────────────────  */
function bindCountButtons() {
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.count;
      setActiveCountBtn(val);
      state.countMode = val;

      if (val === 'custom') {
        showEl(customCountGroup);
        hideEl(autoCountInfo);
        customCountEl?.focus();
        const n = parseInt(customCountEl?.value || '10', 10);
        state.count = isNaN(n) ? 10 : n;
      } else if (val === 'auto') {
        hideEl(customCountGroup);
        showEl(autoCountInfo);
        state.count = 0; // 0 = auto (all)
      } else {
        hideEl(customCountGroup);
        hideEl(autoCountInfo);
        state.count = parseInt(val, 10);
      }

      if (countHiddenEl) {
        countHiddenEl.value = state.count;
      }

      updateTimerIfAuto();
      updateSummary();
    });
  });
}

function setActiveCountBtn(val) {
  document.querySelectorAll('.count-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.count === val);
    b.setAttribute('aria-pressed', b.dataset.count === val ? 'true' : 'false');
  });
}

/* ── Custom Count Input ───────────────────────────────────────  */
function bindCountCustomInput() {
  if (!customCountEl) return;
  customCountEl.addEventListener('input', () => {
    const n = parseInt(customCountEl.value, 10);
    if (!isNaN(n) && n >= 1 && n <= 100) {
      state.count = n;
      if (countHiddenEl) countHiddenEl.value = n;
      clearFieldError('custom-count-error');
    } else {
      showFieldError('custom-count-error', 'Enter a number between 1 and 100');
    }
    updateTimerIfAuto();
    updateSummary();
  });
}

/* ── Difficulty ───────────────────────────────────────────────  */
function bindDifficultyChips() {
  document.querySelectorAll('input[name="difficulty"]').forEach(input => {
    input.addEventListener('change', e => {
      state.difficulty = e.target.value;
      updateSummary();
    });
  });
}

/* ── Source ───────────────────────────────────────────────────  */
function bindSourceChips() {
  document.querySelectorAll('input[name="source"]').forEach(input => {
    input.addEventListener('change', e => {
      state.source = e.target.value;
      updateSummary();
    });
  });
}

/* ── Marks ────────────────────────────────────────────────────  */
function bindMarksChips() {
  document.querySelectorAll('input[name="marks"]').forEach(input => {
    input.addEventListener('change', () => {
      state.marks = Array.from(
        document.querySelectorAll('input[name="marks"]:checked')
      ).map(cb => parseInt(cb.value, 10));
      updateTimerIfAuto();
      updateSummary();
    });
  });
}

function bindMarksPresets() {
  document.querySelectorAll('[data-marks-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.marksPreset;
      const allMarks = document.querySelectorAll('input[name="marks"]');

      // Uncheck all first
      allMarks.forEach(cb => { cb.checked = false; });

      if (preset === 'low') {
        checkMarksByValues([1, 2]);
      } else if (preset === 'medium') {
        checkMarksByValues([4, 6]);
      } else if (preset === 'high') {
        checkMarksByValues([8, 10]);
      }
      // 'clear' = already unchecked all

      state.marks = Array.from(
        document.querySelectorAll('input[name="marks"]:checked')
      ).map(cb => parseInt(cb.value, 10));
      updateTimerIfAuto();
      updateSummary();
    });
  });
}

function checkMarksByValues(values) {
  values.forEach(v => {
    const cb = document.querySelector(`input[name="marks"][value="${v}"]`);
    if (cb) cb.checked = true;
  });
}

/* ── Year ─────────────────────────────────────────────────────  */
function bindYearFilter() {
  const yearEl = qs('#year-filter');
  if (!yearEl) return;
  yearEl.addEventListener('change', e => {
    state.year = e.target.value ? parseInt(e.target.value, 10) : null;
    // If year is set, source must be PYQ
    if (state.year) {
      const pyqInput = document.querySelector('input[name="source"][value="PYQ"]');
      if (pyqInput) {
        pyqInput.checked = true;
        state.source = 'PYQ';
      }
    }
    updateSummary();
  });
}

/* ── Types ────────────────────────────────────────────────────  */
function bindTypeChips() {
  document.querySelectorAll('input[name="types"]').forEach(input => {
    input.addEventListener('change', () => {
      state.types = Array.from(
        document.querySelectorAll('input[name="types"]:checked')
      ).map(cb => cb.value);
      updateSummary();
    });
  });
}

/* ── Order ────────────────────────────────────────────────────  */
function bindOrderChips() {
  document.querySelectorAll('input[name="order"]').forEach(input => {
    input.addEventListener('change', e => {
      state.order = e.target.value;
      updateSummary();
    });
  });
}

/* ── Balance ──────────────────────────────────────────────────  */
function bindBalanceChips() {
  document.querySelectorAll('input[name="balance"]').forEach(input => {
    input.addEventListener('change', e => {
      state.balance = e.target.value;
      updateSummary();
    });
  });
}

/* ── Timer ────────────────────────────────────────────────────  */
function bindTimer() {
  if (!timerToggleEl) return;

  timerToggleEl.addEventListener('change', () => {
    state.timerEnabled = timerToggleEl.checked;
    if (state.timerEnabled) {
      showEl(timerDurationGroup);
    } else {
      hideEl(timerDurationGroup);
    }
    updateSummary();
  });

  if (timerMinEl) {
    timerMinEl.addEventListener('input', () => {
      const n = parseInt(timerMinEl.value, 10);
      if (!isNaN(n) && n >= 1 && n <= 300) {
        state.timerMinutes = n;
        state.timerAuto    = false;
        updateTimerPreview(n);
        updateSummary();
      }
    });
  }

  const decBtn = qs('#timer-dec');
  const incBtn = qs('#timer-inc');

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      const n = Math.max(1, state.timerMinutes - 5);
      state.timerMinutes = n;
      state.timerAuto    = false;
      if (timerMinEl) timerMinEl.value = n;
      updateTimerPreview(n);
      updateSummary();
    });
  }

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      const n = Math.min(300, state.timerMinutes + 5);
      state.timerMinutes = n;
      state.timerAuto    = false;
      if (timerMinEl) timerMinEl.value = n;
      updateTimerPreview(n);
      updateSummary();
    });
  }

  const recalcBtn = qs('#btn-recalc-timer');
  if (recalcBtn) {
    recalcBtn.addEventListener('click', () => {
      state.timerAuto = true;
      updateTimerIfAuto();
    });
  }

  // Initial preview
  updateTimerPreview(state.timerMinutes);
}

/**
 * Update timer preview display
 * @param {number} minutes
 */
function updateTimerPreview(minutes) {
  if (!timerPreviewEl) return;
  const m = Math.floor(minutes);
  const s = 0;
  timerPreviewEl.textContent =
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Recalculate timer based on marks if auto mode is on
 */
function updateTimerIfAuto() {
  if (!state.timerAuto) return;

  // Estimate from count and marks
  // If marks filter is set, use those marks; otherwise estimate 2 min/question
  let totalMins;
  if (state.marks.length > 0) {
    // Average of selected marks
    const avgMarks = state.marks.reduce((a, b) => a + b, 0) / state.marks.length;
    totalMins = estimateMinutesFromMarks(avgMarks) * (state.count || 10);
  } else {
    // Default: 2 minutes per question
    totalMins = (state.count || 10) * 2;
  }

  totalMins = Math.max(1, Math.round(totalMins));
  state.timerMinutes = totalMins;

  if (timerMinEl) timerMinEl.value = totalMins;
  updateTimerPreview(totalMins);
}

/**
 * Estimate minutes from mark value
 * @param {number} marks
 * @returns {number} minutes
 */
function estimateMinutesFromMarks(marks) {
  if (marks <= 1) return 1;
  if (marks <= 2) return 2;
  if (marks <= 4) return 3;
  if (marks <= 6) return 4;
  return 5;
}

/* ── Form Submit ──────────────────────────────────────────────  */
function bindFormSubmit() {
  if (!formEl) return;
  formEl.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
      launchQuiz();
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   VALIDATION
══════════════════════════════════════════════════════════════ */

function validateForm() {
  let valid = true;

  // Clear previous errors
  hideEl(setupErrorEl);
  hideEl(setupWarningEl);
  clearFieldError('subject-error');
  clearFieldError('custom-count-error');

  // Subject is required
  if (!state.subject) {
    showFieldError('subject-error', 'Please select a subject');
    subjectEl?.focus();
    valid = false;
    return false;
  }

  // Custom count validation
  if (state.countMode === 'custom') {
    const n = parseInt(customCountEl?.value || '0', 10);
    if (isNaN(n) || n < 1 || n > 100) {
      showFieldError('custom-count-error', 'Enter a number between 1 and 100');
      customCountEl?.focus();
      valid = false;
      return false;
    }
    state.count = n;
    if (countHiddenEl) countHiddenEl.value = n;
  }

  // Timer validation
  if (state.timerEnabled) {
    const mins = parseInt(timerMinEl?.value || '0', 10);
    if (isNaN(mins) || mins < 1 || mins > 300) {
      showError('Timer must be between 1 and 300 minutes');
      timerMinEl?.focus();
      valid = false;
      return false;
    }
    state.timerMinutes = mins;
  }

  return valid;
}

/* ══════════════════════════════════════════════════════════════
   SUMMARY UPDATE
══════════════════════════════════════════════════════════════ */

function updateSummary() {
  if (!summaryBodyEl) return;

  const subjectName = state.subject
    ? getSubjectName(state.subject)
    : '(Not selected)';

  let unitLabel;
  if (!state.subject || state.subject === 'all') {
    unitLabel = 'All';
  } else if (state.units.length === 0) {
    unitLabel = 'All Units';
  } else if (state.units.length === 1) {
    unitLabel = getUnitTitle(state.subject, state.units[0]);
  } else {
    unitLabel = `${state.units.length} units selected`;
  }

  const countLabel = state.countMode === 'auto'
    ? 'All available'
    : state.count + ' questions';

  const modeLabel = state.mode === 'mcq' ? 'MCQ Only' : 'All Types';

  const diffLabel = state.difficulty === 'mixed'
    ? 'Mixed'
    : DIFFICULTY_LABELS[state.difficulty] || state.difficulty;

  const sourceLabel = {
    all:      'All Sources',
    PYQ:      'PYQ Only',
    original: 'Original Only'
  }[state.source] || 'All';

  const timerLabel = state.timerEnabled
    ? `${state.timerMinutes} min`
    : 'No timer';

  const marksLabel = state.marks.length === 0
    ? 'All'
    : state.marks.join(', ') + ' marks';

  summaryBodyEl.innerHTML = `
    <div class="summary-grid">
      <div class="summary-item">
        <span class="summary-item-label">Subject</span>
        <span class="summary-item-value ${state.subject ? '' : 'text-secondary'}">${subjectName}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Unit</span>
        <span class="summary-item-value">${unitLabel}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Mode</span>
        <span class="summary-item-value highlight">${modeLabel}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Questions</span>
        <span class="summary-item-value highlight">${countLabel}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Difficulty</span>
        <span class="summary-item-value">${diffLabel}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Source</span>
        <span class="summary-item-value">${sourceLabel}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Marks</span>
        <span class="summary-item-value">${marksLabel}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Order</span>
        <span class="summary-item-value">${state.order === 'random' ? 'Random' : 'Grouped by Unit'}</span>
      </div>
      <div class="summary-item">
        <span class="summary-item-label">Timer</span>
        <span class="summary-item-value">${timerLabel}</span>
      </div>
    </div>
  `;

  // Update status
  if (summaryStatusEl) {
    if (!state.subject) {
      summaryStatusEl.textContent = 'Select a subject to continue';
      summaryStatusEl.className = 'quiz-summary-status';
    } else {
      summaryStatusEl.textContent = '✓ Ready';
      summaryStatusEl.className = 'quiz-summary-status ready';
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   LAUNCH QUIZ
══════════════════════════════════════════════════════════════ */

function launchQuiz() {
  // Build unit param
  let unitParam;
  if (!state.subject || state.subject === 'all') {
    unitParam = 'all';
  } else if (state.units.length === 0) {
    unitParam = 'all';
  } else if (state.units.length === 1) {
    unitParam = state.units[0];
  } else {
    unitParam = state.units.join(',');
  }

  const params = {
    subject:    state.subject   || 'all',
    unit:       unitParam,
    mode:       state.mode,
    count:      state.count,
    difficulty: state.difficulty,
    source:     state.source,
    order:      state.order,
    balance:    state.balance,
    timer:      state.timerEnabled ? '1' : '0',
    timerMins:  state.timerEnabled ? state.timerMinutes : 0,
    types:      state.types.join(','),
    marks:      state.marks.join(','),
    year:       state.year || ''
  };

  // Save config for play.html to read
  saveToStorage('quiz-pending-config', params);

  const url = buildURL('play.html', params);
  window.location.href = url;
}

/* ══════════════════════════════════════════════════════════════
   ERROR / WARNING HELPERS
══════════════════════════════════════════════════════════════ */

function showError(message) {
  if (setupErrorEl && setupErrorText) {
    setupErrorText.textContent = message;
    showEl(setupErrorEl);
    setupErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function showWarning(message) {
  if (setupWarningEl && setupWarningText) {
    setupWarningText.textContent = message;
    showEl(setupWarningEl);
  }
}

function showFieldError(fieldId, message) {
  const el = qs(`#${fieldId}`);
  if (el) {
    el.textContent = message;
    el.classList.add('visible');
  }
}

function clearFieldError(fieldId) {
  const el = qs(`#${fieldId}`);
  if (el) {
    el.textContent = '';
    el.classList.remove('visible');
  }
}