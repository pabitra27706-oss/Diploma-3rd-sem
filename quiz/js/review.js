/* ============================================================
   quiz/js/review.js
   Review page: display all answers, allow editing,
   filter by status, palette navigation, export link
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */

const reviewState = {
  result:          null,   // Loaded from localStorage quiz-result
  questions:       [],
  answers:         {},
  config:          null,
  currentFilter:   'all',  // 'all' | 'answered' | 'unanswered'
  editingQuestionId: null  // ID of question being edited in modal
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
  loadReviewData();
});

function cacheDOMRefs() {
  dom = {
    loadingState:       qs('#loading-state'),
    noDataState:        qs('#no-data-state'),
    reviewMain:         qs('#review-main'),
    reviewSubtitle:     qs('#review-subtitle'),
    reviewHeaderStats:  qs('#review-header-stats'),
    reviewInfoBanner:   qs('#review-info-banner'),
    reviewQuestionList: qs('#review-question-list'),

    // Action bar
    btnShowPalette:     qs('#btn-show-palette'),
    filterPills:        qsa('.filter-pill'),

    // Palette panel
    paletteOverlay:     qs('#review-palette-overlay'),
    palettePanel:       qs('#review-palette-panel'),
    palettePanelGrid:   qs('#palette-panel-grid'),
    btnClosePalettePanel: qs('#btn-close-palette-panel'),

    // Edit modal
    editModalOverlay:   qs('#edit-modal-overlay'),
    editModalQuestion:  qs('#edit-modal-question'),
    editAnswerTextarea: qs('#edit-answer-textarea'),
    editCharCount:      qs('#edit-char-count'),
    btnCancelEdit:      qs('#btn-cancel-edit'),
    btnSaveEdit:        qs('#btn-save-edit'),
    closeEditModal:     qs('#close-edit-modal'),

    // Bottom actions
    btnRetryQuiz:       qs('#btn-retry-quiz')
  };
}

/* ══════════════════════════════════════════════════════════════
   DATA LOADING
══════════════════════════════════════════════════════════════ */

function loadReviewData() {
  const result = getFromStorage('quiz-result');

  if (!result || !result.questions || result.questions.length === 0) {
    showNoData();
    return;
  }

  // Only show review for All Types mode
  // If MCQ mode landed here redirect to result
  if (result.config && result.config.mode === 'mcq') {
    window.location.href = 'result.html';
    return;
  }

  reviewState.result    = result;
  reviewState.questions = result.questions || [];
  reviewState.answers   = result.answers   || {};
  reviewState.config    = result.config    || {};

  hideEl(dom.loadingState);
  showEl(dom.reviewMain);

  renderPageHeader();
  renderInfoBanner();
  renderQuestionList();
  buildPalettePanel();
  bindEvents();
  updateRetryLink();
}

function showNoData() {
  hideEl(dom.loadingState);
  showEl(dom.noDataState);
}

/* ══════════════════════════════════════════════════════════════
   PAGE HEADER
══════════════════════════════════════════════════════════════ */

function renderPageHeader() {
  const cfg         = reviewState.config;
  const questions   = reviewState.questions;
  const answers     = reviewState.answers;

  // Subtitle
  if (dom.reviewSubtitle) {
    const subjectName = getSubjectName(cfg.subject || 'all');
    const unitLabel   = !cfg.unit || cfg.unit === 'all'
      ? 'All Units'
      : Array.isArray(cfg.unit)
        ? cfg.unit.map(u => getUnitTitle(cfg.subject, u)).join(', ')
        : getUnitTitle(cfg.subject, cfg.unit);
    dom.reviewSubtitle.textContent =
      `${subjectName} · ${unitLabel} · ${questions.length} Question${questions.length !== 1 ? 's' : ''}`;
  }

  // Stats
  if (dom.reviewHeaderStats) {
    const answeredCount = Object.keys(answers).filter(id => answers[id]).length;
    const unanswered    = questions.length - answeredCount;
    const totalMarks    = questions.reduce((s, q) => s + (q.marks || 0), 0);

    dom.reviewHeaderStats.innerHTML = `
      <div class="review-stat">
        <span class="review-stat-value accent">${questions.length}</span>
        <span class="review-stat-label">Total</span>
      </div>
      <div class="review-stat">
        <span class="review-stat-value green">${answeredCount}</span>
        <span class="review-stat-label">Answered</span>
      </div>
      <div class="review-stat">
        <span class="review-stat-value gray">${unanswered}</span>
        <span class="review-stat-label">Blank</span>
      </div>
      <div class="review-stat">
        <span class="review-stat-value accent">${totalMarks}</span>
        <span class="review-stat-label">Total Marks</span>
      </div>
    `;
  }
}

/* ══════════════════════════════════════════════════════════════
   INFO BANNER
══════════════════════════════════════════════════════════════ */

function renderInfoBanner() {
  // Banner only needed for All Types mode (already enforced by redirect)
  if (!dom.reviewInfoBanner) return;
  showEl(dom.reviewInfoBanner);
}

/* ══════════════════════════════════════════════════════════════
   QUESTION LIST RENDERING
══════════════════════════════════════════════════════════════ */

function renderQuestionList() {
  if (!dom.reviewQuestionList) return;
  dom.reviewQuestionList.innerHTML = '';

  const filtered = getFilteredQuestions();

  if (filtered.length === 0) {
    dom.reviewQuestionList.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon" aria-hidden="true">🔍</span>
        <p class="empty-state-title">No questions match this filter</p>
        <p class="empty-state-desc">Try selecting a different filter above.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((q, i) => {
    const card = buildQuestionCard(q, i + 1);
    dom.reviewQuestionList.appendChild(card);
  });
}

/**
 * Get questions filtered by current filter state
 */
function getFilteredQuestions() {
  switch (reviewState.currentFilter) {
    case 'answered':
      return reviewState.questions.filter(q =>
        reviewState.answers[q.id] && reviewState.answers[q.id].trim()
      );
    case 'unanswered':
      return reviewState.questions.filter(q =>
        !reviewState.answers[q.id] || !reviewState.answers[q.id].trim()
      );
    default:
      return reviewState.questions;
  }
}

/* ── Build Single Question Card ─────────────────────────────── */
function buildQuestionCard(q, displayNum) {
  const userAnswer  = reviewState.answers[q.id] || '';
  const hasAnswer   = userAnswer.trim().length > 0;
  const isMCQ       = q.type === 'mcq';

  const card = createElement('div', `review-question-card ${hasAnswer ? '' : 'unanswered'}`);
  card.id = `review-q-${q.id}`;
  card.setAttribute('data-question-id', q.id);

  // ── Header
  const header = buildCardHeader(q, displayNum, hasAnswer, isMCQ);
  card.appendChild(header);

  // ── Body
  const body = document.createElement('div');
  body.className = 'review-q-body';

  // Tags row
  const tagsRow = buildTagsRow(q);
  if (tagsRow) body.appendChild(tagsRow);

  // Question text
  const qText = createElement('p', 'review-q-text', q.question);
  body.appendChild(qText);

  // Answer display
  if (isMCQ) {
    const optionsEl = buildMCQOptionsReview(q, userAnswer);
    body.appendChild(optionsEl);
  } else {
    const answerBox = buildTextAnswerBox(q, userAnswer, hasAnswer);
    body.appendChild(answerBox);

    // Model answer (collapsible)
    if (q.modelAnswer) {
      const modelBox = buildModelAnswerBox(q);
      body.appendChild(modelBox);
    }
  }

  card.appendChild(body);

  // ── Footer
  const footer = buildCardFooter(q, hasAnswer, isMCQ);
  card.appendChild(footer);

  return card;
}

/* ── Card Header ─────────────────────────────────────────────  */
function buildCardHeader(q, displayNum, hasAnswer, isMCQ) {
  const header = createElement('div', 'review-q-header');

  const left = createElement('div', 'review-q-header-left');

  const qNum = createElement('span', 'review-q-number', `Q${displayNum}`);
  left.appendChild(qNum);

  const typeLabel = QUESTION_TYPES[q.type] || q.type;
  const typeBadge = createElement('span', 'review-q-type-badge', typeLabel);
  left.appendChild(typeBadge);

  const right = createElement('div', 'review-q-header-right');

  const marksBadge = createElement('span', 'review-q-marks',
    q.marks === 1 ? '1 mark' : `${q.marks} marks`
  );
  right.appendChild(marksBadge);

  const statusBadge = createElement('span',
    `review-status-badge ${hasAnswer ? 'answered' : 'unanswered'}`,
    hasAnswer ? '✓ Answered' : '○ Unanswered'
  );
  right.appendChild(statusBadge);

  header.appendChild(left);
  header.appendChild(right);

  return header;
}

/* ── Tags Row ────────────────────────────────────────────────── */
function buildTagsRow(q) {
  const hasAny = q.topic || q.difficulty || q.source || q.year;
  if (!hasAny) return null;

  const row = createElement('div', 'review-q-tags');

  if (q.topic) {
    row.appendChild(createElement('span', 'tag', q.topic));
  }

  if (q.difficulty) {
    const colours = {
      easy: 'badge-success', medium: 'badge-warning', hard: 'badge-error'
    };
    row.appendChild(createElement('span',
      `badge ${colours[q.difficulty] || 'badge-neutral'}`,
      DIFFICULTY_LABELS[q.difficulty] || q.difficulty
    ));
  }

  if (q.source === 'PYQ' && q.year) {
    row.appendChild(createElement('span', 'badge badge-neutral', `PYQ ${q.year}`));
  }

  if (q.tags && Array.isArray(q.tags)) {
    q.tags.slice(0, 3).forEach(tag => {
      row.appendChild(createElement('span', 'tag', `#${tag}`));
    });
  }

  return row;
}

/* ── MCQ Options Review (read-only) ─────────────────────────── */
function buildMCQOptionsReview(q, selectedKey) {
  const container = createElement('div', 'review-options');

  Object.entries(q.options || {}).forEach(([key, text]) => {
    const isSelected = key === selectedKey;
    const option = createElement('div',
      `review-option${isSelected ? ' selected' : ''}`
    );

    const label = createElement('span', 'review-option-label', key);
    const textEl = createElement('span', 'review-option-text', text);

    option.appendChild(label);
    option.appendChild(textEl);

    if (isSelected) {
      const check = createElement('span', 'review-option-check', '✓');
      option.appendChild(check);
    }

    container.appendChild(option);
  });

  return container;
}

/* ── Text Answer Box ─────────────────────────────────────────── */
function buildTextAnswerBox(q, userAnswer, hasAnswer) {
  const box = createElement('div', 'review-answer-box');

  // Header
  const boxHeader = createElement('div', 'review-answer-box-header');
  const boxTitle  = createElement('span', 'review-answer-box-title', 'Your Answer');

  // Edit button
  const editBtn = createElement('button', 'btn-edit-answer');
  editBtn.innerHTML = '<span aria-hidden="true">✏️</span> Edit';
  editBtn.setAttribute('aria-label', `Edit answer for question ${q.id}`);
  editBtn.addEventListener('click', () => openEditModal(q));

  boxHeader.appendChild(boxTitle);
  boxHeader.appendChild(editBtn);
  box.appendChild(boxHeader);

  // Answer content
  if (hasAnswer) {
    const isMono = q.type === 'program';
    const answerEl = createElement('div',
      `review-answer-text${isMono ? ' mono' : ''}`,
      userAnswer
    );
    box.appendChild(answerEl);
  } else {
    const emptyEl = createElement('p', 'review-answer-empty',
      'No answer provided. Click Edit to add one.'
    );
    box.appendChild(emptyEl);
  }

  return box;
}

/* ── Model Answer Box (collapsible) ─────────────────────────── */
function buildModelAnswerBox(q) {
  const box = createElement('div', 'review-model-answer');

  const modelHeader = createElement('div', 'review-model-header');
  const modelTitle  = createElement('span', 'review-model-title', '📖 Model Answer');

  const toggleBtn = createElement('button', 'review-model-toggle', 'Show');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-controls', `model-text-${q.id}`);

  modelHeader.appendChild(modelTitle);
  modelHeader.appendChild(toggleBtn);
  box.appendChild(modelHeader);

  const modelText = createElement('div', 'review-model-text', q.modelAnswer || '');
  modelText.id = `model-text-${q.id}`;
  modelText.setAttribute('hidden', '');
  box.appendChild(modelText);

  // Toggle
  toggleBtn.addEventListener('click', () => {
    const isHidden = modelText.hasAttribute('hidden');
    if (isHidden) {
      modelText.removeAttribute('hidden');
      toggleBtn.textContent = 'Hide';
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      modelText.setAttribute('hidden', '');
      toggleBtn.textContent = 'Show';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  return box;
}

/* ── Card Footer ─────────────────────────────────────────────── */
function buildCardFooter(q, hasAnswer, isMCQ) {
  const footer = createElement('div', 'review-q-footer');

  const left = createElement('div', 'review-q-footer-left');

  // Source info
  if (q.source) {
    left.appendChild(createElement('span', 'tag',
      q.source === 'PYQ' ? `📜 PYQ ${q.year || ''}` : '✨ Original'
    ));
  }

  // Question ID
  if (q.id) {
    left.appendChild(createElement('span', 'text-xs text-secondary', q.id));
  }

  const right = createElement('div', 'review-q-footer-right');

  // Edit button for non-MCQ
  if (!isMCQ) {
    const editBtn = createElement('button', 'btn-edit-answer');
    editBtn.innerHTML = '<span aria-hidden="true">✏️</span> Edit Answer';
    editBtn.setAttribute('aria-label', `Edit answer for question ${q.id}`);
    editBtn.addEventListener('click', () => openEditModal(q));
    right.appendChild(editBtn);
  }

  footer.appendChild(left);
  footer.appendChild(right);

  return footer;
}

/* ══════════════════════════════════════════════════════════════
   PALETTE PANEL
══════════════════════════════════════════════════════════════ */

function buildPalettePanel() {
  if (!dom.palettePanelGrid) return;
  dom.palettePanelGrid.innerHTML = '';

  reviewState.questions.forEach((q, i) => {
    const hasAnswer = !!(reviewState.answers[q.id] && reviewState.answers[q.id].trim());

    const btn = createElement('button',
      `palette-panel-btn${hasAnswer ? ' answered' : ''}`,
      String(i + 1)
    );
    btn.setAttribute('aria-label', `Go to question ${i + 1}`);
    btn.setAttribute('data-qid', q.id);

    btn.addEventListener('click', () => {
      closePalettePanel();
      scrollToQuestion(q.id);
    });

    dom.palettePanelGrid.appendChild(btn);
  });
}

function openPalettePanel() {
  showEl(dom.paletteOverlay);
  showEl(dom.palettePanel);
  dom.paletteOverlay?.removeAttribute('aria-hidden');
  dom.btnShowPalette?.setAttribute('aria-expanded', 'true');
}

function closePalettePanel() {
  hideEl(dom.paletteOverlay);
  hideEl(dom.palettePanel);
  dom.paletteOverlay?.setAttribute('aria-hidden', 'true');
  dom.btnShowPalette?.setAttribute('aria-expanded', 'false');
}

function scrollToQuestion(questionId) {
  const el = qs(`#review-q-${questionId}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ══════════════════════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════════════════════ */

function openEditModal(q) {
  reviewState.editingQuestionId = q.id;

  if (dom.editModalQuestion) {
    dom.editModalQuestion.textContent = q.question;
  }

  if (dom.editAnswerTextarea) {
    const current = reviewState.answers[q.id] || '';
    dom.editAnswerTextarea.value = current;

    // Monospace for program
    if (q.type === 'program') {
      dom.editAnswerTextarea.classList.add('mono');
    } else {
      dom.editAnswerTextarea.classList.remove('mono');
    }

    updateEditCharCount(current.length);
    autoResizeEditTextarea();
  }

  dom.editModalOverlay?.classList.add('open');

  requestAnimationFrame(() => {
    dom.editAnswerTextarea?.focus();
  });
}

function closeEditModal() {
  dom.editModalOverlay?.classList.remove('open');
  reviewState.editingQuestionId = null;
}

function saveEditedAnswer() {
  const qId    = reviewState.editingQuestionId;
  const newVal = dom.editAnswerTextarea?.value || '';

  if (!qId) return;

  // Update state
  reviewState.answers[qId] = newVal;

  // Persist to quiz-result in storage
  const result = getFromStorage('quiz-result');
  if (result) {
    result.answers = reviewState.answers;
    saveToStorage('quiz-result', result);
  }

  closeEditModal();

  // Re-render question card
  refreshQuestionCard(qId);

  // Update palette panel
  buildPalettePanel();

  // Update header stats
  renderPageHeader();
}

/**
 * Refresh a single question card in-place
 */
function refreshQuestionCard(questionId) {
  const oldCard = qs(`#review-q-${questionId}`);
  if (!oldCard) return;

  const q = reviewState.questions.find(q => q.id === questionId);
  if (!q) return;

  // Find display number
  const allCards = dom.reviewQuestionList?.querySelectorAll('.review-question-card');
  let displayNum = 1;
  if (allCards) {
    Array.from(allCards).forEach((card, i) => {
      if (card.dataset.questionId === questionId) displayNum = i + 1;
    });
  }

  const newCard = buildQuestionCard(q, displayNum);
  oldCard.replaceWith(newCard);
}

function updateEditCharCount(len) {
  if (dom.editCharCount) {
    dom.editCharCount.textContent =
      `${len.toLocaleString()} character${len !== 1 ? 's' : ''}`;
  }
}

function autoResizeEditTextarea() {
  const el = dom.editAnswerTextarea;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 500) + 'px';
}

/* ══════════════════════════════════════════════════════════════
   FILTER
══════════════════════════════════════════════════════════════ */

function setFilter(filter) {
  reviewState.currentFilter = filter;

  // Update pill active states
  dom.filterPills.forEach(pill => {
    const isActive = pill.dataset.filter === filter;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  renderQuestionList();
}

/* ══════════════════════════════════════════════════════════════
   RETRY LINK
══════════════════════════════════════════════════════════════ */

function updateRetryLink() {
  if (!dom.btnRetryQuiz) return;
  const cfg = reviewState.config;
  if (!cfg) return;

  const params = {
    subject:    cfg.subject   || 'all',
    unit:       Array.isArray(cfg.unit) ? cfg.unit.join(',') : (cfg.unit || 'all'),
    mode:       cfg.mode      || 'all',
    count:      cfg.count     || 10,
    difficulty: cfg.difficulty|| 'mixed',
    source:     cfg.source    || 'all',
    order:      cfg.order     || 'random',
    balance:    cfg.balance   || 'random',
    timer:      cfg.timer     ? '1' : '0',
    timerMins:  cfg.timerMins || 10,
    types:      (cfg.types || []).join(','),
    marks:      (cfg.marks || []).join(','),
    year:       cfg.year || ''
  };

  dom.btnRetryQuiz.href = buildURL('play.html', params);
}

/* ══════════════════════════════════════════════════════════════
   EVENT BINDING
══════════════════════════════════════════════════════════════ */

function bindEvents() {
  // Palette panel
  dom.btnShowPalette?.addEventListener('click', openPalettePanel);
  dom.btnClosePalettePanel?.addEventListener('click', closePalettePanel);
  dom.paletteOverlay?.addEventListener('click', closePalettePanel);

  // Filter pills
  dom.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      setFilter(pill.dataset.filter);
    });
  });

  // Edit modal
  dom.editModalOverlay?.addEventListener('click', e => {
    if (e.target === dom.editModalOverlay) closeEditModal();
  });
  dom.closeEditModal?.addEventListener('click', closeEditModal);
  dom.btnCancelEdit?.addEventListener('click', closeEditModal);
  dom.btnSaveEdit?.addEventListener('click', saveEditedAnswer);

  // Edit textarea events
  dom.editAnswerTextarea?.addEventListener('input', () => {
    const len = dom.editAnswerTextarea.value.length;
    updateEditCharCount(len);
    autoResizeEditTextarea();
  });

  // Escape key closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dom.editModalOverlay?.classList.contains('open')) {
        closeEditModal();
      } else if (!dom.palettePanel?.classList.contains('hidden')) {
        closePalettePanel();
      }
    }
  });
}