/* ============================================================
   quiz/js/result.js
   Result page: score display, question review, explanation
   toggle, performance chart, history view, retry
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */

const resultState = {
  result:         null,    // Loaded from localStorage quiz-result
  questions:      [],
  answers:        {},
  config:         null,
  explMode:       'all',   // 'all' | 'wrong' | 'none'
  qFilter:        'all',   // 'all' | 'correct' | 'incorrect' | 'unanswered'
  scoreData:      null,    // { score, total, correct, incorrect, unanswered, percentage }
  viewingHistory: false    // true when loaded from history page
};

/* ══════════════════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════════════════ */

let dom = {};

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  cacheDOMRefs();

  // Check if we're viewing a history entry
  const historyId = getParam('historyId');
  if (historyId) {
    loadFromHistory(historyId);
  } else {
    loadCurrentResult();
  }
});

function cacheDOMRefs() {
  dom = {
    loadingState:       qs('#loading-state'),
    noDataState:        qs('#no-data-state'),
    resultMain:         qs('#result-main'),

    // Score hero
    resultBadgeWrap:    qs('#result-badge-wrap'),
    scoreFraction:      qs('#score-fraction'),
    scorePercentage:    qs('#score-percentage'),
    scoreTitle:         qs('#score-hero-title'),
    scoreSubtitle:      qs('#score-subtitle'),
    statCorrect:        qs('#stat-correct'),
    statIncorrect:      qs('#stat-incorrect'),
    statUnanswered:     qs('#stat-unanswered'),
    statTime:           qs('#stat-time'),
    scoreActions:       qs('.score-actions'),

    // Performance
    perfBarList:        qs('#perf-bar-list'),

    // Explanation controls
    explBtns:           qsa('.expl-btn'),

    // Question review
    qFilterPills:       qsa('[data-qfilter]'),
    resultQuestionList: qs('#result-question-list'),

    // Bottom actions
    btnRetryBottom:     qs('#btn-retry-bottom'),
    btnRetrySame:       qs('#btn-retry-same'),

    // History modal
    historyModalOverlay:qs('#history-modal-overlay'),
    historyModalBody:   qs('#history-modal-body'),
    closeHistoryModal:  qs('#close-history-modal'),
    closeHistoryModalFooter: qs('#close-history-modal-footer')
  };
}

/* ══════════════════════════════════════════════════════════════
   DATA LOADING
══════════════════════════════════════════════════════════════ */

function loadCurrentResult() {
  const result = getFromStorage('quiz-result');

  if (!result || !result.questions || result.questions.length === 0) {
    showNoData();
    return;
  }

  // If All Types mode, redirect to review page
  if (result.config && result.config.mode !== 'mcq') {
    window.location.href = 'review.html';
    return;
  }

  applyResult(result);
}

function loadFromHistory(historyId) {
  const entry = getHistoryEntry(historyId);
  if (!entry) {
    showNoData();
    return;
  }

  resultState.viewingHistory = true;

  // History entries may not have full question data — show summary view
  applyHistoryEntry(entry);
}

function applyResult(result) {
  resultState.result    = result;
  resultState.questions = result.questions || [];
  resultState.answers   = result.answers   || {};
  resultState.config    = result.config    || {};

  // Recalculate score
  resultState.scoreData = calculateScore(
    resultState.questions,
    resultState.answers
  );

  hideEl(dom.loadingState);
  showEl(dom.resultMain);

  renderScoreHero();
  renderPerformanceBars();
  renderQuestionList();
  bindEvents();
  updateRetryLinks();
}

function applyHistoryEntry(entry) {
  // Build a minimal result from history
  const syntheticResult = {
    config:     { subject: entry.subject, unit: entry.unit, mode: entry.mode },
    questions:  [],  // No full question data in history
    answers:    entry.answers || {},
    score:      entry.score,
    total:      entry.total,
    correct:    entry.score,
    incorrect:  (entry.total || 0) - (entry.score || 0),
    unanswered: 0,
    percentage: entry.percentage,
    elapsed:    entry.elapsed,
    completedAt:entry.completedAt
  };

  resultState.result    = syntheticResult;
  resultState.questions = [];
  resultState.answers   = entry.answers || {};
  resultState.config    = syntheticResult.config;
  resultState.scoreData = {
    score:      entry.score      || 0,
    total:      entry.total      || 0,
    correct:    entry.score      || 0,
    incorrect:  (entry.total || 0) - (entry.score || 0),
    unanswered: 0,
    percentage: entry.percentage || 0
  };

  hideEl(dom.loadingState);
  showEl(dom.resultMain);

  renderScoreHero();
  renderPerformanceBars();

  // No question data — show a note
  if (dom.resultQuestionList) {
    dom.resultQuestionList.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon" aria-hidden="true">📋</span>
        <p class="empty-state-title">Full review not available</p>
        <p class="empty-state-desc">
          Detailed question review is only available immediately after completing a quiz.
          History entries show score summary only.
        </p>
      </div>
    `;
  }

  bindEvents();
  updateRetryLinks();
}

function showNoData() {
  hideEl(dom.loadingState);
  showEl(dom.noDataState);
}

/* ══════════════════════════════════════════════════════════════
   SCORE HERO
══════════════════════════════════════════════════════════════ */

function renderScoreHero() {
  const sd  = resultState.scoreData;
  const cfg = resultState.config;
  const res = resultState.result;

  if (!sd) return;

  const pct   = sd.percentage;
  const grade = getGrade(pct);

  // Result badge
  if (dom.resultBadgeWrap) {
    dom.resultBadgeWrap.innerHTML = `
      <span class="result-badge ${grade.cls}" role="status">
        <span aria-hidden="true">${grade.emoji}</span>
        ${grade.label}
      </span>
    `;
  }

  // Score fraction
  if (dom.scoreFraction) {
    dom.scoreFraction.textContent = `${sd.score}/${sd.total}`;
    dom.scoreFraction.className   = `score-fraction ${grade.cls}`;
  }

  // Percentage
  if (dom.scorePercentage) {
    dom.scorePercentage.textContent = `${pct}%`;
  }

  // Title
  if (dom.scoreTitle) {
    dom.scoreTitle.textContent = grade.title;
  }

  // Subtitle
  if (dom.scoreSubtitle) {
    const subjectName = getSubjectName(cfg.subject || 'all');
    const unitLabel   = !cfg.unit || cfg.unit === 'all'
      ? 'All Units'
      : Array.isArray(cfg.unit)
        ? cfg.unit.map(u => `U${u}`).join(', ')
        : getUnitTitle(cfg.subject, cfg.unit);
    const dateStr = formatDate(res.completedAt || Date.now());
    dom.scoreSubtitle.textContent =
      `${subjectName} · ${unitLabel} · ${dateStr}`;
  }

  // Stats
  if (dom.statCorrect)   dom.statCorrect.textContent   = sd.correct;
  if (dom.statIncorrect) dom.statIncorrect.textContent  = sd.incorrect;
  if (dom.statUnanswered)dom.statUnanswered.textContent = sd.unanswered;
  if (dom.statTime) {
    const elapsed = res.elapsed || 0;
    dom.statTime.textContent = formatElapsed(elapsed);
  }
}

/**
 * Get grade object based on percentage
 */
function getGrade(pct) {
  if (pct >= 80) return {
    cls: 'excellent', emoji: '🏆',
    label: 'Excellent',
    title: 'Outstanding work!'
  };
  if (pct >= 60) return {
    cls: 'good', emoji: '👍',
    label: 'Good',
    title: 'Good job!'
  };
  if (pct >= 40) return {
    cls: 'average', emoji: '📚',
    label: 'Average',
    title: 'Keep practising!'
  };
  return {
    cls: 'poor', emoji: '💪',
    label: 'Needs Work',
    title: 'Don\'t give up — try again!'
  };
}

/**
 * Format elapsed seconds as human-readable
 * @param {number} seconds
 * @returns {string}
 */
function formatElapsed(seconds) {
  if (!seconds || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

/* ══════════════════════════════════════════════════════════════
   PERFORMANCE BARS
══════════════════════════════════════════════════════════════ */

function renderPerformanceBars() {
  if (!dom.perfBarList) return;

  const sd    = resultState.scoreData;
  const total = sd ? sd.total : 0;

  if (!sd || total === 0) {
    dom.perfBarList.innerHTML =
      '<p class="text-secondary text-sm">No performance data available.</p>';
    return;
  }

  const bars = [
    {
      label:  'Correct',
      count:  sd.correct,
      total:  total,
      colour: 'green'
    },
    {
      label:  'Incorrect',
      count:  sd.incorrect,
      total:  total,
      colour: 'red'
    },
    {
      label:  'Unanswered',
      count:  sd.unanswered,
      total:  total,
      colour: 'gray'
    }
  ];

  dom.perfBarList.innerHTML = '';

  bars.forEach(bar => {
    const pct = total > 0 ? Math.round((bar.count / total) * 100) : 0;
    const item = document.createElement('div');
    item.className = 'perf-bar-item';
    item.setAttribute('role', 'listitem');
    item.innerHTML = `
      <div class="perf-bar-row">
        <span class="perf-bar-label">${bar.label}</span>
        <div
          class="perf-bar-track"
          role="progressbar"
          aria-valuenow="${pct}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="${bar.label}: ${bar.count} of ${total}"
        >
          <div
            class="perf-bar-fill ${bar.colour}"
            style="width: 0%"
            data-target-width="${pct}%"
          ></div>
        </div>
        <span class="perf-bar-count">${bar.count}/${total}</span>
      </div>
    `;
    dom.perfBarList.appendChild(item);
  });

  // Animate bars after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dom.perfBarList.querySelectorAll('.perf-bar-fill').forEach(fill => {
        fill.style.width = fill.dataset.targetWidth;
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   QUESTION REVIEW LIST
══════════════════════════════════════════════════════════════ */

function renderQuestionList() {
  if (!dom.resultQuestionList) return;
  dom.resultQuestionList.innerHTML = '';

  const filtered = getFilteredQuestions();

  if (filtered.length === 0) {
    dom.resultQuestionList.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon" aria-hidden="true">🔍</span>
        <p class="empty-state-title">No questions in this filter</p>
        <p class="empty-state-desc">Try selecting a different category above.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((q, i) => {
    const globalIndex = resultState.questions.indexOf(q);
    const card = buildResultQuestionCard(q, globalIndex + 1);
    dom.resultQuestionList.appendChild(card);
  });

  // Apply current explanation mode after render
  applyExplMode(resultState.explMode);
}

/**
 * Filter questions by current qFilter state
 */
function getFilteredQuestions() {
  const questions = resultState.questions;
  const answers   = resultState.answers;

  switch (resultState.qFilter) {
    case 'correct':
      return questions.filter(q => answers[q.id] === q.correct);
    case 'incorrect':
      return questions.filter(q =>
        answers[q.id] && answers[q.id] !== q.correct
      );
    case 'unanswered':
      return questions.filter(q => !answers[q.id]);
    default:
      return questions;
  }
}

/* ── Build Single Result Question Card ──────────────────────── */
function buildResultQuestionCard(q, displayNum) {
  const userAnswer = resultState.answers[q.id] || null;
  const isCorrect  = userAnswer === q.correct;
  const isAnswered = !!userAnswer;

  let statusCls, statusIcon, statusLabel;
  if (!isAnswered) {
    statusCls   = 'unanswered';
    statusIcon  = '—';
    statusLabel = 'Unanswered';
  } else if (isCorrect) {
    statusCls   = 'correct';
    statusIcon  = '✓';
    statusLabel = 'Correct';
  } else {
    statusCls   = 'incorrect';
    statusIcon  = '✗';
    statusLabel = 'Incorrect';
  }

  const card = createElement('div', `result-q-card ${statusCls}`);
  card.id = `result-q-${q.id}`;

  // ── Header
  const header = document.createElement('div');
  header.className = 'result-q-header';
  header.innerHTML = `
    <div class="result-q-header-left">
      <span class="result-q-number">Q${displayNum}</span>
      <span class="result-status-icon" aria-hidden="true">${statusIcon}</span>
      ${buildMetaTagsHTML(q)}
    </div>
    <div class="result-q-header-right">
      <span class="result-status-badge ${statusCls}">
        ${statusIcon} ${statusLabel}
      </span>
    </div>
  `;
  card.appendChild(header);

  // ── Body
  const body = document.createElement('div');
  body.className = 'result-q-body';

  // Tags
  const tagsHTML = buildTagsHTML(q);
  if (tagsHTML) {
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'result-q-tags';
    tagsDiv.innerHTML = tagsHTML;
    body.appendChild(tagsDiv);
  }

  // Question text
  body.appendChild(createElement('p', 'result-q-text', q.question));

  // MCQ options (show full list with correct/incorrect highlighted)
  if (q.type === 'mcq' && q.options) {
    const optionsEl = buildMCQResultOptions(q, userAnswer);
    body.appendChild(optionsEl);

    // Answer comparison row (compact)
    const compareRow = buildAnswerCompareRow(q, userAnswer, isCorrect, isAnswered);
    body.appendChild(compareRow);
  }

  // Explanation
  const explEl = buildExplanationEl(q);
  if (explEl) body.appendChild(explEl);

  card.appendChild(body);
  return card;
}

/**
 * Build meta tags HTML string for a question
 */
function buildMetaTagsHTML(q) {
  let html = '';
  const colours = { easy: 'badge-success', medium: 'badge-warning', hard: 'badge-error' };
  if (q.difficulty) {
    html += `<span class="badge ${colours[q.difficulty] || 'badge-neutral'}">
      ${DIFFICULTY_LABELS[q.difficulty] || q.difficulty}
    </span>`;
  }
  if (q.marks) {
    html += `<span class="question-marks">${q.marks} mark${q.marks !== 1 ? 's' : ''}</span>`;
  }
  return html;
}

/**
 * Build tags HTML for topic, year, source
 */
function buildTagsHTML(q) {
  let html = '';
  if (q.topic) html += `<span class="tag">${q.topic}</span>`;
  if (q.source === 'PYQ' && q.year) {
    html += `<span class="badge badge-neutral">PYQ ${q.year}</span>`;
  }
  if (q.tags && Array.isArray(q.tags)) {
    q.tags.slice(0, 3).forEach(t => {
      html += `<span class="tag">#${t}</span>`;
    });
  }
  return html;
}

/* ── MCQ Options for Result View ────────────────────────────── */
function buildMCQResultOptions(q, userAnswer) {
  const container = createElement('div', 'result-options');

  Object.entries(q.options || {}).forEach(([key, text]) => {
    const isUserSelected = key === userAnswer;
    const isCorrectAns   = key === q.correct;

    let cls = 'result-option';
    let indicator = '';

    if (isCorrectAns && isUserSelected) {
      cls += ' correct-answer user-selected';
      indicator = '<span class="result-option-indicator" style="color:var(--success)">✓ Your answer</span>';
    } else if (isCorrectAns) {
      cls += ' correct-answer';
      indicator = '<span class="result-option-indicator" style="color:var(--success)">✓ Correct</span>';
    } else if (isUserSelected) {
      cls += ' user-selected';
      indicator = '<span class="result-option-indicator" style="color:var(--error)">✗ Your answer</span>';
    }

    const option = document.createElement('div');
    option.className = cls;
    option.innerHTML = `
      <span class="result-option-label">${key}</span>
      <span class="result-option-text">${text}</span>
      ${indicator}
    `;

    container.appendChild(option);
  });

  return container;
}

/* ── Answer Compare Row ─────────────────────────────────────── */
function buildAnswerCompareRow(q, userAnswer, isCorrect, isAnswered) {
  const row = createElement('div', 'answer-compare-row');

  // User answer box
  const userBox  = document.createElement('div');
  userBox.className = 'answer-compare-box user-answer';

  const userKeyClass = !isAnswered ? 'user-key' : isCorrect ? 'user-key correct' : 'user-key wrong';
  const userDisplay  = userAnswer
    ? `<span class="answer-key-badge ${userKeyClass}">${userAnswer}</span>
       <span>${q.options?.[userAnswer] || ''}</span>`
    : `<span class="text-secondary">No answer given</span>`;

  userBox.innerHTML = `
    <span class="answer-compare-label">Your Answer</span>
    <span class="answer-compare-value">${userDisplay}</span>
  `;

  // Correct answer box
  const corrBox = document.createElement('div');
  corrBox.className = 'answer-compare-box correct-answer';
  corrBox.innerHTML = `
    <span class="answer-compare-label">Correct Answer</span>
    <span class="answer-compare-value">
      <span class="answer-key-badge correct-key">${q.correct}</span>
      <span>${q.options?.[q.correct] || ''}</span>
    </span>
  `;

  row.appendChild(userBox);
  row.appendChild(corrBox);
  return row;
}

/* ── Explanation Element ────────────────────────────────────── */
function buildExplanationEl(q) {
  if (!q.explanation) return null;

  const box = createElement('div', 'result-explanation');
  box.dataset.explBox = 'true';
  box.innerHTML = `
    <div class="result-explanation-title">
      <span aria-hidden="true">💡</span> Explanation
    </div>
    <p class="result-explanation-text">${q.explanation}</p>
  `;
  return box;
}

/* ══════════════════════════════════════════════════════════════
   EXPLANATION TOGGLE
══════════════════════════════════════════════════════════════ */

/**
 * Apply explanation visibility mode to all rendered cards
 * @param {string} mode - 'all' | 'wrong' | 'none'
 */
function applyExplMode(mode) {
  resultState.explMode = mode;

  const questions  = resultState.questions;
  const answers    = resultState.answers;

  document.querySelectorAll('[data-expl-box]').forEach(box => {
    const card = box.closest('.result-q-card');
    if (!card) {
      // Determine from parent card id
      box.classList.remove('hidden-expl');
      if (mode === 'none') box.classList.add('hidden-expl');
      return;
    }

    const cardId = card.id.replace('result-q-', '');
    const q      = questions.find(q => q.id === cardId);
    if (!q) return;

    const userAns  = answers[q.id];
    const isWrong  = userAns !== q.correct;

    box.classList.remove('hidden-expl');

    if (mode === 'none') {
      box.classList.add('hidden-expl');
    } else if (mode === 'wrong' && !isWrong) {
      box.classList.add('hidden-expl');
    }
  });

  // Update button states
  dom.explBtns.forEach(btn => {
    const isActive = btn.dataset.expl === mode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/* ══════════════════════════════════════════════════════════════
   QUESTION FILTER
══════════════════════════════════════════════════════════════ */

function setQFilter(filter) {
  resultState.qFilter = filter;

  dom.qFilterPills.forEach(pill => {
    const isActive = pill.dataset.qfilter === filter;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  renderQuestionList();
}

/* ══════════════════════════════════════════════════════════════
   RETRY LINKS
══════════════════════════════════════════════════════════════ */

function updateRetryLinks() {
  const cfg = resultState.config;
  if (!cfg) return;

  const params = {
    subject:    cfg.subject    || 'all',
    unit:       Array.isArray(cfg.unit)
      ? cfg.unit.join(',')
      : (cfg.unit || 'all'),
    mode:       cfg.mode       || 'mcq',
    count:      cfg.count      || 10,
    difficulty: cfg.difficulty || 'mixed',
    source:     cfg.source     || 'all',
    order:      'random',
    balance:    cfg.balance    || 'random',
    timer:      cfg.timer      ? '1' : '0',
    timerMins:  cfg.timerMins  || 10,
    types:      (cfg.types  || []).join(','),
    marks:      (cfg.marks  || []).join(','),
    year:       cfg.year       || ''
  };

  const url = buildURL('play.html', params);

  if (dom.btnRetrySame) {
    dom.btnRetrySame.addEventListener('click', () => {
      window.location.href = url;
    });
  }

  if (dom.btnRetryBottom) {
    dom.btnRetryBottom.addEventListener('click', () => {
      window.location.href = url;
    });
  }

  // Export link — pass config so export page can read it
  const exportBtn = qs('#btn-export-result');
  if (exportBtn) {
    exportBtn.href = buildURL('export.html', {
      source: 'result'
    });
  }
}

/* ══════════════════════════════════════════════════════════════
   EVENT BINDING
══════════════════════════════════════════════════════════════ */

function bindEvents() {
  // Explanation mode buttons
  dom.explBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyExplMode(btn.dataset.expl);
    });
  });

  // Question filter pills
  dom.qFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      setQFilter(pill.dataset.qfilter);
    });
  });

  // History modal close
  dom.closeHistoryModal?.addEventListener('click', closeHistoryModal);
  dom.closeHistoryModalFooter?.addEventListener('click', closeHistoryModal);
  dom.historyModalOverlay?.addEventListener('click', e => {
    if (e.target === dom.historyModalOverlay) closeHistoryModal();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeHistoryModal();
  });
}

/* ══════════════════════════════════════════════════════════════
   HISTORY MODAL
══════════════════════════════════════════════════════════════ */

function closeHistoryModal() {
  if (dom.historyModalOverlay) {
    dom.historyModalOverlay.setAttribute('hidden', '');
  }
}