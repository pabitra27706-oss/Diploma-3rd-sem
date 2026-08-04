/* ============================================================
   quiz/js/index.js
   Home page logic: presets, subject cards, history, stats
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   PRESET DEFINITIONS
══════════════════════════════════════════════════════════════ */

const PRESETS = {
  'quick-mcq': {
    label:      '10 MCQ Quick Test',
    subject:    'all',
    unit:       'all',
    mode:       'mcq',
    count:      10,
    difficulty: 'mixed',
    source:     'all',
    marks:      [],
    year:       null,
    order:      'random',
    balance:    'random',
    timer:      true,
    types:      ['mcq'],
    needsSubject: false
  },
  'unit-quiz': {
    label:      'Unit Quiz',
    subject:    null,           // user must pick
    unit:       null,           // user must pick
    mode:       'all',
    count:      10,
    difficulty: 'mixed',
    source:     'all',
    marks:      [],
    year:       null,
    order:      'grouped',
    balance:    'random',
    timer:      true,
    types:      [],
    needsSubject: true,
    needsUnit:    true
  },
  'pyq': {
    label:      'PYQ Practice',
    subject:    null,
    unit:       'all',
    mode:       'all',
    count:      10,
    difficulty: 'mixed',
    source:     'PYQ',
    marks:      [],
    year:       null,
    order:      'random',
    balance:    'random',
    timer:      true,
    types:      [],
    needsSubject: true
  },
  'full-subject': {
    label:      'Full Subject Test',
    subject:    null,
    unit:       'all',
    mode:       'all',
    count:      20,
    difficulty: 'mixed',
    source:     'all',
    marks:      [],
    year:       null,
    order:      'grouped',
    balance:    'balanced',
    timer:      true,
    types:      [],
    needsSubject: true
  },
  'hard-only': {
    label:      'Hard Challenge',
    subject:    'all',
    unit:       'all',
    mode:       'all',
    count:      15,
    difficulty: 'hard',
    source:     'all',
    marks:      [],
    year:       null,
    order:      'random',
    balance:    'random',
    timer:      true,
    types:      [],
    needsSubject: false
  },
  'theory': {
    label:      'Theory Practice',
    subject:    null,
    unit:       'all',
    mode:       'all',
    count:      5,
    difficulty: 'mixed',
    source:     'all',
    marks:      [],
    year:       null,
    order:      'random',
    balance:    'random',
    timer:      true,
    types:      ['theory', 'short'],
    needsSubject: true
  }
};

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */

let _activePreset     = null;   // current preset key
let _modalStep        = 'subject'; // 'subject' | 'unit'
let _pickedSubject    = null;
let _subjectModalEl   = null;
let _subjectModalOver = null;

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderSubjectCards();
  renderHistoryList();
  renderStats();
  checkAutosave();
  bindPresetCards();
  bindSubjectModal();
  bindResumeButtons();
});

/* ══════════════════════════════════════════════════════════════
   PRESET CARDS
══════════════════════════════════════════════════════════════ */

function bindPresetCards() {
  const grid = qs('#preset-grid');
  if (!grid) return;

  grid.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const presetKey = card.dataset.preset;
      handlePresetClick(presetKey);
    });

    // Keyboard: enter / space
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/**
 * Handle preset card click
 * @param {string} presetKey
 */
function handlePresetClick(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  _activePreset  = presetKey;
  _pickedSubject = null;
  _modalStep     = 'subject';

  if (preset.needsSubject) {
    // Need to pick a subject first
    openSubjectModal('subject', presetKey);
  } else {
    // No subject needed — go straight to setup/play
    launchPreset(preset, null, null);
  }
}

/**
 * Launch a preset by navigating to setup.html with config in URL params
 * For simple presets (no unit selection needed) go straight.
 * @param {Object} preset
 * @param {string|null} subject
 * @param {number|string|null} unit
 */
function launchPreset(preset, subject, unit) {
  const config = Object.assign({}, preset);

  if (subject) config.subject = subject;
  if (unit !== null && unit !== undefined) config.unit = unit;

  // Serialise config into URL for setup.html to read
  const params = {
    preset:     _activePreset || 'custom',
    subject:    config.subject   || 'all',
    unit:       config.unit      !== null ? config.unit : 'all',
    mode:       config.mode      || 'mcq',
    count:      config.count     || 10,
    difficulty: config.difficulty|| 'mixed',
    source:     config.source    || 'all',
    order:      config.order     || 'random',
    balance:    config.balance   || 'random',
    timer:      config.timer     ? '1' : '0',
    types:      (config.types || []).join(','),
    marks:      (config.marks || []).join(',')
  };

  const url = buildURL('setup.html', params);
  window.location.href = url;
}

/* ══════════════════════════════════════════════════════════════
   SUBJECT MODAL
══════════════════════════════════════════════════════════════ */

function bindSubjectModal() {
  _subjectModalOver = qs('#subject-modal-overlay');
  _subjectModalEl   = qs('#subject-modal');

  const closeBtn = qs('#close-subject-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSubjectModal);
  }

  // Close on overlay click
  if (_subjectModalOver) {
    _subjectModalOver.addEventListener('click', e => {
      if (e.target === _subjectModalOver) closeSubjectModal();
    });
  }

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && _subjectModalOver?.classList.contains('open')) {
      closeSubjectModal();
    }
  });
}

/**
 * Open the subject picker modal
 * @param {string} step - 'subject' | 'unit'
 * @param {string} presetKey
 */
function openSubjectModal(step, presetKey) {
  _modalStep = step;
  const body = qs('#subject-modal-body');
  const title = qs('#subject-modal-title');
  if (!body || !_subjectModalOver) return;

  if (step === 'subject') {
    title.textContent = 'Choose Subject';
    body.innerHTML = '';
    renderSubjectOptions(body, presetKey);
  } else if (step === 'unit') {
    title.textContent = 'Choose Unit';
    body.innerHTML = '';
    renderUnitOptions(body, _pickedSubject, presetKey);
  }

  _subjectModalOver.classList.add('open');

  // Focus trap: focus first button
  requestAnimationFrame(() => {
    const first = body.querySelector('button');
    if (first) first.focus();
  });
}

function closeSubjectModal() {
  if (_subjectModalOver) {
    _subjectModalOver.classList.remove('open');
  }
}

/**
 * Render subject option buttons inside modal body
 */
function renderSubjectOptions(container, presetKey) {
  const list = createElement('div', 'subject-option-list');

  Object.values(SUBJECTS).forEach(sub => {
    const btn = document.createElement('button');
    btn.className = 'subject-option-btn';
    btn.setAttribute('aria-label', `Select ${sub.name}`);
    btn.innerHTML = `
      <span class="subject-option-code">${sub.code}</span>
      <span class="subject-option-info">
        <span class="subject-option-name">${sub.name}</span>
        <span class="subject-option-meta">${sub.units} units · ${sub.credits} credits</span>
      </span>
      <span aria-hidden="true">→</span>
    `;

    btn.addEventListener('click', () => {
      _pickedSubject = sub.code;
      const preset   = PRESETS[presetKey];

      if (preset && preset.needsUnit) {
        // Need unit selection next
        openSubjectModal('unit', presetKey);
      } else {
        closeSubjectModal();
        launchPreset(preset, sub.code, preset.unit || 'all');
      }
    });

    list.appendChild(btn);
  });

  container.appendChild(list);
}

/**
 * Render unit option buttons inside modal body
 */
function renderUnitOptions(container, subjectCode, presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset || !subjectCode) return;

  const subInfo = SUBJECTS[subjectCode];
  if (!subInfo) return;

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'btn btn-secondary btn-sm mb-4';
  backBtn.textContent = '← Back to Subjects';
  backBtn.addEventListener('click', () => openSubjectModal('subject', presetKey));
  container.appendChild(backBtn);

  // Subject label
  const subLabel = createElement('p', 'text-sm text-secondary mb-4');
  subLabel.textContent = `Subject: ${subInfo.name}`;
  container.appendChild(subLabel);

  // All units option
  const allBtn = document.createElement('button');
  allBtn.className = 'subject-option-btn';
  allBtn.setAttribute('aria-label', 'Select all units');
  allBtn.innerHTML = `
    <span class="subject-option-code">ALL</span>
    <span class="subject-option-info">
      <span class="subject-option-name">All Units</span>
      <span class="subject-option-meta">Questions from every unit</span>
    </span>
    <span aria-hidden="true">→</span>
  `;
  allBtn.addEventListener('click', () => {
    closeSubjectModal();
    launchPreset(preset, subjectCode, 'all');
  });

  const list = createElement('div', 'subject-option-list');
  list.appendChild(allBtn);

  // Individual units
  const unitOptions = getUnitOptions(subjectCode);
  unitOptions.forEach(({ value, label }) => {
    const btn = document.createElement('button');
    btn.className = 'subject-option-btn';
    btn.setAttribute('aria-label', `Select ${label}`);
    btn.innerHTML = `
      <span class="subject-option-code">U${value}</span>
      <span class="subject-option-info">
        <span class="subject-option-name">${label}</span>
        <span class="subject-option-meta">${subInfo.name}</span>
      </span>
      <span aria-hidden="true">→</span>
    `;
    btn.addEventListener('click', () => {
      closeSubjectModal();
      launchPreset(preset, subjectCode, value);
    });
    list.appendChild(btn);
  });

  container.appendChild(list);
}

/* ══════════════════════════════════════════════════════════════
   SUBJECT CARDS (Browse by Subject)
══════════════════════════════════════════════════════════════ */

function renderSubjectCards() {
  const grid = qs('#subjects-grid');
  if (!grid) return;

  grid.innerHTML = '';

  Object.values(SUBJECTS).forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <span class="subject-card-code">${sub.code}</span>
      <span class="subject-card-name">${sub.name}</span>
      <div class="subject-card-meta">
        <span class="tag">${sub.units} Units</span>
        <span class="tag">${sub.credits} Credits</span>
      </div>
      <div class="subject-card-actions">
        <button
          class="btn btn-outline btn-sm"
          data-subject="${sub.code}"
          data-action="mcq"
          aria-label="Start MCQ quiz for ${sub.name}"
        >
          ⚡ MCQ Quiz
        </button>
        <button
          class="btn btn-secondary btn-sm"
          data-subject="${sub.code}"
          data-action="full"
          aria-label="Start full test for ${sub.name}"
        >
          📘 Full Test
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Bind action buttons
  grid.querySelectorAll('button[data-subject]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const code   = btn.dataset.subject;
      const action = btn.dataset.action;

      if (action === 'mcq') {
        const params = {
          preset:     'quick-mcq',
          subject:    code,
          unit:       'all',
          mode:       'mcq',
          count:      10,
          difficulty: 'mixed',
          source:     'all',
          order:      'random',
          balance:    'random',
          timer:      '1',
          types:      'mcq',
          marks:      ''
        };
        window.location.href = buildURL('setup.html', params);
      } else if (action === 'full') {
        const params = {
          preset:     'full-subject',
          subject:    code,
          unit:       'all',
          mode:       'all',
          count:      20,
          difficulty: 'mixed',
          source:     'all',
          order:      'grouped',
          balance:    'balanced',
          timer:      '1',
          types:      '',
          marks:      ''
        };
        window.location.href = buildURL('setup.html', params);
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   HISTORY LIST
══════════════════════════════════════════════════════════════ */

function renderHistoryList() {
  const list    = qs('#history-list');
  const section = qs('#history-section');
  if (!list) return;

  const history = getHistory();
  list.innerHTML = '';

  if (history.length === 0) {
    list.innerHTML = `
      <div class="history-empty" role="status" aria-label="No quiz history">
        <span class="history-empty-icon" aria-hidden="true">📭</span>
        <p class="history-empty-text">No quizzes yet. Start one above!</p>
      </div>
    `;
    return;
  }

  // Show last 5 entries
  const recent = history.slice(0, 5);

  recent.forEach(entry => {
    const item = buildHistoryItem(entry);
    list.appendChild(item);
  });
}

/**
 * Build a single history list item element
 * @param {Object} entry
 * @returns {HTMLElement}
 */
function buildHistoryItem(entry) {
  const item = document.createElement('a');
  item.className = 'history-item';
  item.href = `result.html?historyId=${entry.historyId}`;
  item.setAttribute('aria-label', `View quiz: ${getSubjectName(entry.subject)}`);

  const icon = entry.mode === 'mcq' ? '⚡' : '📝';
  const subjectName = getSubjectName(entry.subject);
  const unitLabel   = entry.unit === 'all'
    ? 'All Units'
    : getUnitTitle(entry.subject, entry.unit);
  const dateStr = formatDate(entry.completedAt);

  let scoreHTML = '';
  if (entry.mode === 'mcq' && entry.score !== undefined && entry.score !== null) {
    const pct = entry.total
      ? Math.round((entry.score / entry.total) * 100)
      : 0;
    scoreHTML = `
      <div class="history-item-score">
        <span class="history-score-value">${entry.score}/${entry.total}</span>
        <span class="history-score-label">${pct}%</span>
      </div>
    `;
  } else {
    scoreHTML = `
      <div class="history-item-score">
        <span class="history-score-value">—</span>
        <span class="history-score-label">AI Eval</span>
      </div>
    `;
  }

  item.innerHTML = `
    <div class="history-item-icon" aria-hidden="true">${icon}</div>
    <div class="history-item-body">
      <span class="history-item-title">${subjectName}</span>
      <span class="history-item-meta">${unitLabel} · ${entry.mode?.toUpperCase() || 'MCQ'} · ${dateStr}</span>
    </div>
    ${scoreHTML}
  `;

  return item;
}

/* ══════════════════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════════════════ */

function renderStats() {
  const section  = qs('#stats-section');
  const history  = getHistory();
  if (!section || history.length === 0) return;

  // Show the stats section
  section.removeAttribute('hidden');

  const total = history.length;

  // MCQ entries with scores
  const mcqEntries = history.filter(
    h => h.mode === 'mcq' && h.score !== undefined && h.total
  );

  let avgScore = '—';
  let bestScore = '—';

  if (mcqEntries.length > 0) {
    const percentages = mcqEntries.map(h =>
      Math.round((h.score / h.total) * 100)
    );
    avgScore  = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) + '%';
    bestScore = Math.max(...percentages) + '%';
  }

  const streak = calculateStreak(history);

  const statTotal  = qs('#stat-total');
  const statAvg    = qs('#stat-avg');
  const statBest   = qs('#stat-best');
  const statStreak = qs('#stat-streak');

  if (statTotal)  statTotal.textContent  = total;
  if (statAvg)    statAvg.textContent    = avgScore;
  if (statBest)   statBest.textContent   = bestScore;
  if (statStreak) statStreak.textContent = streak;
}

/**
 * Calculate current day streak from history
 * @param {Array} history
 * @returns {number}
 */
function calculateStreak(history) {
  if (!history.length) return 0;

  // Get unique dates (YYYY-MM-DD) sorted descending
  const dates = [...new Set(
    history.map(h => new Date(h.completedAt).toDateString())
  )].map(d => new Date(d));

  dates.sort((a, b) => b - a);

  const today     = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = today;

  for (const date of dates) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const diff = Math.round((cursor - d) / (1000 * 60 * 60 * 24));
    if (diff === 0 || diff === 1) {
      streak++;
      cursor = d;
    } else {
      break;
    }
  }

  return streak;
}

/* ══════════════════════════════════════════════════════════════
   AUTOSAVE / RESUME
══════════════════════════════════════════════════════════════ */

function checkAutosave() {
  const saved = loadQuizState();
  if (!saved) return;

  const section  = qs('#resume-section');
  const descEl   = qs('#resume-desc');
  if (!section) return;

  // Build description
  const subjectName = getSubjectName(saved.subject || 'all');
  const savedAt     = formatDateTime(saved.savedAt);
  const qDone       = saved.currentIndex || 0;
  const qTotal      = saved.questions?.length || 0;

  if (descEl) {
    descEl.textContent =
      `${subjectName} · Question ${qDone + 1}/${qTotal} · Saved ${savedAt}`;
  }

  section.removeAttribute('hidden');
}

function bindResumeButtons() {
  const resumeBtn  = qs('#btn-resume');
  const discardBtn = qs('#btn-discard');

  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      const saved = loadQuizState();
      if (saved && saved.autosaveKey) {
        // Navigate to play.html with autosave key
        window.location.href = buildURL('play.html', {
          resume: saved.autosaveKey
        });
      }
    });
  }

  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      clearQuizState();
      const section = qs('#resume-section');
      if (section) section.setAttribute('hidden', '');
    });
  }
}