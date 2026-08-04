/* ============================================================
   quiz/js/play.js
   Quiz play screen: question loading, navigation, answering,
   palette, timer, autosave, and submission
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   QUIZ STATE
══════════════════════════════════════════════════════════════ */

const quizState = {
  config:        null,     // Parsed URL config
  questions:     [],       // Final question array
  answers:       {},       // { questionId: answer }
  skipped:       new Set(),// Set of question IDs that were skipped
  visited:       new Set(),// Set of question IDs visited
  currentIndex:  0,
  totalCount:    0,
  startTime:     null,
  autosaveKey:   null,
  timerRunning:  false,
  submitted:     false
};

/* ══════════════════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════════════════ */

let dom = {};

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  cacheDOMRefs();

  // Check for resume first
  const resumeKey = getParam('resume');
  if (resumeKey) {
    const saved = getFromStorage(resumeKey);
    if (saved) {
      await resumeQuiz(saved);
      return;
    }
  }

  // Parse config from URL
  quizState.config = parseConfig();

  // Load questions
  await loadAndStartQuiz();
});

/* ── Cache DOM references ─────────────────────────────────── */
function cacheDOMRefs() {
  dom = {
    loadingScreen:      qs('#loading-screen'),
    loadingDesc:        qs('#loading-desc'),
    errorScreen:        qs('#error-screen'),
    errorTitle:         qs('#error-title'),
    errorDesc:          qs('#error-desc'),
    quizLayout:         qs('#quiz-layout'),

    // Fewer modal
    fewerModalOverlay:  qs('#fewer-modal-overlay'),
    fewerModalDesc:     qs('#fewer-modal-desc'),
    btnContinueFewer:   qs('#btn-continue-fewer'),

    // Submit modal
    submitModalOverlay: qs('#submit-modal-overlay'),
    submitModalStats:   qs('#submit-modal-stats'),
    btnCancelSubmit:    qs('#btn-cancel-submit'),
    btnConfirmSubmit:   qs('#btn-confirm-submit'),

    // Timer toast
    timerToast:         qs('#timer-toast'),

    // Top bar
    quizMeta:           qs('#quiz-meta'),
    quizTimer:          qs('#quiz-timer'),
    timerValue:         qs('#timer-value'),
    progressFill:       qs('#quiz-progress-fill'),
    progressBar:        qs('#quiz-progress-bar-wrap'),
    btnSubmitTop:       qs('#btn-submit-quiz'),

    // Palette
    paletteSidebar:     qs('#palette-sidebar'),
    paletteOverlay:     qs('#palette-overlay'),
    questionPalette:    qs('#question-palette'),
    paletteStats:       qs('#palette-stats'),
    btnTogglePalette:   qs('#btn-toggle-palette'),
    btnClosePalette:    qs('#btn-close-palette'),
    btnSubmitPalette:   qs('#btn-submit-quiz-palette'),

    // Question
    questionCounter:    qs('#question-counter'),
    questionModeBadge:  qs('#question-mode-badge'),
    qNumber:            qs('#q-number'),
    qMetaTags:          qs('#q-meta-tags'),
    qMarks:             qs('#q-marks'),
    questionText:       qs('#question-text'),
    optionsContainer:   qs('#options-container'),
    textAnswerContainer:qs('#text-answer-container'),
    textAnswer:         qs('#text-answer'),
    charCount:          qs('#char-count'),

    // Nav
    btnPrev:            qs('#btn-prev'),
    btnSkip:            qs('#btn-skip'),
    btnNext:            qs('#btn-next'),
    btnSubmitMobile:    qs('#btn-submit-mobile')
  };
}

/* ══════════════════════════════════════════════════════════════
   CONFIG PARSING
══════════════════════════════════════════════════════════════ */

function parseConfig() {
  const p = key => getParam(key);

  const marksRaw = p('marks');
  const typesRaw = p('types');
  const unitRaw  = p('unit');

  let unitParsed;
  if (!unitRaw || unitRaw === 'all') {
    unitParsed = 'all';
  } else if (unitRaw.includes(',')) {
    unitParsed = unitRaw.split(',').map(Number).filter(Boolean);
  } else {
    unitParsed = parseInt(unitRaw, 10) || 'all';
  }

  return {
    subject:    p('subject')    || 'all',
    unit:       unitParsed,
    mode:       p('mode')       || 'mcq',
    count:      parseInt(p('count') || '10', 10),
    difficulty: p('difficulty') || 'mixed',
    source:     p('source')     || 'all',
    order:      p('order')      || 'random',
    balance:    p('balance')    || 'random',
    timer:      p('timer')      === '1',
    timerMins:  parseInt(p('timerMins') || '10', 10),
    types:      typesRaw ? typesRaw.split(',').filter(Boolean) : [],
    marks:      marksRaw ? marksRaw.split(',').map(Number).filter(Boolean) : [],
    year:       p('year')       ? parseInt(p('year'), 10) : null
  };
}

/* ══════════════════════════════════════════════════════════════
   QUESTION LOADING
══════════════════════════════════════════════════════════════ */

async function loadAndStartQuiz() {
  const cfg = quizState.config;
  setLoadingDesc('Fetching questions…');

  try {
    let allQuestions = [];

    if (cfg.subject === 'all') {
      // Fetch from all subjects
      setLoadingDesc('Loading all subjects…');
      allQuestions = await fetchAllSubjectQuestions(cfg);
    } else {
      // Fetch from specific subject + units
      setLoadingDesc(`Loading ${getSubjectName(cfg.subject)}…`);
      allQuestions = await fetchMultipleUnits(cfg.subject, cfg.unit);
    }

    if (allQuestions.length === 0) {
      showErrorScreen(
        'No Questions Found',
        'Could not load any questions. Check that your quiz data files exist in _quiz-data/'
      );
      return;
    }

    // Apply filters
    setLoadingDesc('Applying filters…');
    const filters = buildFilters(cfg);
    let filtered = filterQuestions(allQuestions, filters);

    if (filtered.length === 0) {
      showErrorScreen(
        'No Questions Matched',
        'No questions matched your selected filters. Try relaxing your filters in setup.'
      );
      return;
    }

    // Count handling
    const requestedCount = cfg.count === 0 ? filtered.length : cfg.count;

    if (filtered.length < requestedCount) {
      // Show fewer-questions warning
      await showFewerWarning(filtered.length, requestedCount);
      // If user clicked edit filters, navigation handles it
      // If continued, proceed with available
    }

    // Pick questions
    setLoadingDesc('Preparing questions…');
    let selected;
    if (cfg.count === 0) {
      // Auto: all filtered questions
      selected = cfg.order === 'grouped'
        ? sortByUnit(filtered)
        : shuffleArray(filtered);
    } else {
      const pickCount = Math.min(requestedCount, filtered.length);
      if (cfg.balance === 'balanced') {
        selected = pickBalanced(filtered, pickCount);
      } else {
        selected = pickRandom(filtered, pickCount);
      }

      if (cfg.order === 'grouped') {
        selected = sortByUnit(selected);
      }
    }

    quizState.questions    = selected;
    quizState.totalCount   = selected.length;
    quizState.currentIndex = 0;
    quizState.startTime    = Date.now();
    quizState.answers      = {};
    quizState.skipped      = new Set();
    quizState.visited      = new Set();

    // Create autosave key
    quizState.autosaveKey = STORAGE_KEYS.AUTOSAVE_PREFIX + getTimestamp();

    initQuizUI();

  } catch (err) {
    console.error('Quiz load error:', err);
    showErrorScreen(
      'Failed to Load Quiz',
      'An error occurred while loading. Please try again.'
    );
  }
}

/**
 * Build filter object from config
 */
function buildFilters(cfg) {
  const filters = {
    subject:    cfg.subject,
    unit:       cfg.unit,
    mode:       cfg.mode,
    difficulty: cfg.difficulty,
    source:     cfg.source,
    marks:      cfg.marks,
    year:       cfg.year,
    types:      cfg.types
  };
  return filters;
}

/**
 * Sort questions by unit number (extracted from ID)
 */
function sortByUnit(questions) {
  return [...questions].sort((a, b) => {
    const ua = extractUnit(a.id);
    const ub = extractUnit(b.id);
    return ua - ub;
  });
}

/* ══════════════════════════════════════════════════════════════
   RESUME QUIZ
══════════════════════════════════════════════════════════════ */

async function resumeQuiz(saved) {
  quizState.config        = saved.config;
  quizState.questions     = saved.questions;
  quizState.totalCount    = saved.questions.length;
  quizState.answers       = saved.answers || {};
  quizState.skipped       = new Set(saved.skipped || []);
  quizState.visited       = new Set(saved.visited || []);
  quizState.currentIndex  = saved.currentIndex || 0;
  quizState.startTime     = saved.startTime    || Date.now();
  quizState.autosaveKey   = saved.autosaveKey;

  initQuizUI();
}

/* ══════════════════════════════════════════════════════════════
   UI INITIALISATION
══════════════════════════════════════════════════════════════ */

function initQuizUI() {
  hideLoadingScreen();
  showEl(dom.quizLayout);

  const cfg = quizState.config;

  // Top bar meta
  if (dom.quizMeta) {
    const subjectName = getSubjectName(cfg.subject);
    const unitLabel   = cfg.unit === 'all'
      ? 'All Units'
      : Array.isArray(cfg.unit)
        ? cfg.unit.map(u => `U${u}`).join(', ')
        : getUnitTitle(cfg.subject, cfg.unit);
    dom.quizMeta.textContent = `${subjectName} · ${unitLabel}`;
  }

  // Mode badge
  if (dom.questionModeBadge) {
    dom.questionModeBadge.textContent = cfg.mode === 'mcq' ? 'MCQ' : 'All Types';
  }

  // Build palette
  buildPalette();

  // Render first question
  renderQuestion(quizState.currentIndex);

  // Start timer if enabled
  if (cfg.timer && cfg.timerMins > 0) {
    initTimer(cfg.timerMins * 60);
  }

  // Bind all UI events
  bindUIEvents();

  // Initial autosave
  doAutosave();
}

/* ══════════════════════════════════════════════════════════════
   QUESTION RENDERING
══════════════════════════════════════════════════════════════ */

function renderQuestion(index) {
  const q   = quizState.questions[index];
  if (!q) return;

  // Mark as visited
  quizState.visited.add(q.id);

  // Counter
  if (dom.questionCounter) {
    dom.questionCounter.textContent =
      `Question ${index + 1} of ${quizState.totalCount}`;
  }

  // Q number
  if (dom.qNumber) {
    dom.qNumber.textContent = `Q${index + 1}`;
  }

  // Marks
  if (dom.qMarks) {
    dom.qMarks.textContent = q.marks === 1
      ? '1 mark'
      : `${q.marks} marks`;
  }

  // Meta tags (topic, difficulty, source)
  if (dom.qMetaTags) {
    dom.qMetaTags.innerHTML = '';
    if (q.topic) {
      const t = createElement('span', 'tag', q.topic);
      dom.qMetaTags.appendChild(t);
    }
    if (q.difficulty) {
      const colours = {
        easy: 'badge-success', medium: 'badge-warning', hard: 'badge-error'
      };
      const d = createElement('span',
        `badge ${colours[q.difficulty] || 'badge-neutral'}`,
        DIFFICULTY_LABELS[q.difficulty] || q.difficulty
      );
      dom.qMetaTags.appendChild(d);
    }
    if (q.source === 'PYQ' && q.year) {
      const y = createElement('span', 'badge badge-neutral', `PYQ ${q.year}`);
      dom.qMetaTags.appendChild(y);
    }
  }

  // Question text
  if (dom.questionText) {
    dom.questionText.textContent = q.question;
  }

  // Render MCQ or text answer
  if (q.type === 'mcq') {
    renderMCQ(q);
  } else {
    renderTextAnswer(q);
  }

  // Navigation buttons
  updateNavButtons(index);

  // Update palette highlight
  updatePaletteHighlight(index);

  // Update progress
  updateProgress();

  // Scroll to top of question area
  if (dom.questionText) {
    dom.questionText.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ── Render MCQ Options ──────────────────────────────────────  */
function renderMCQ(q) {
  showEl(dom.optionsContainer);
  hideEl(dom.textAnswerContainer);

  dom.optionsContainer.innerHTML = '';
  dom.optionsContainer.setAttribute('aria-label', 'Answer options');

  const saved = quizState.answers[q.id];

  Object.entries(q.options || {}).forEach(([key, text]) => {
    const label = document.createElement('label');
    label.className = 'option-card' + (saved === key ? ' selected' : '');
    label.setAttribute('for', `opt-${q.id}-${key}`);

    const radio = document.createElement('input');
    radio.type    = 'radio';
    radio.id      = `opt-${q.id}-${key}`;
    radio.name    = `question-${q.id}`;
    radio.value   = key;
    radio.checked = saved === key;
    radio.setAttribute('aria-label', `Option ${key}: ${text}`);

    const optLabel = createElement('span', 'option-label', key);
    const optText  = createElement('span', 'option-text', text);
    const optCheck = createElement('span', 'option-check', '✓');

    label.appendChild(radio);
    label.appendChild(optLabel);
    label.appendChild(optText);
    label.appendChild(optCheck);

    // Select on click
    label.addEventListener('click', () => {
      selectMCQOption(q.id, key);
    });

    // Keyboard
    radio.addEventListener('change', () => {
      selectMCQOption(q.id, key);
    });

    dom.optionsContainer.appendChild(label);
  });
}

/**
 * Handle MCQ option selection
 */
function selectMCQOption(questionId, optionKey) {
  quizState.answers[questionId] = optionKey;
  quizState.skipped.delete(questionId);

  // Update UI
  dom.optionsContainer.querySelectorAll('.option-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    const isSelected = radio && radio.value === optionKey;
    card.classList.toggle('selected', isSelected);
    if (radio) radio.checked = isSelected;
  });

  // Update palette
  updatePaletteItem(quizState.currentIndex);
  updatePaletteStats();
  doAutosave();
}

/* ── Render Text Answer ──────────────────────────────────────  */
function renderTextAnswer(q) {
  hideEl(dom.optionsContainer);
  showEl(dom.textAnswerContainer);

  if (!dom.textAnswer) return;

  // Monospace for program type
  if (q.type === 'program') {
    dom.textAnswer.classList.add('mono');
    if (dom.textAnswerContainer.querySelector('.form-hint')) {
      dom.textAnswerContainer.querySelector('.form-hint').textContent =
        'Write your program/code here. Monospace font is enabled.';
    }
  } else {
    dom.textAnswer.classList.remove('mono');
    if (dom.textAnswerContainer.querySelector('.form-hint')) {
      dom.textAnswerContainer.querySelector('.form-hint').textContent =
        'Write a detailed answer. This will be exported for AI evaluation.';
    }
  }

  // Restore saved answer
  dom.textAnswer.value = quizState.answers[q.id] || '';
  updateCharCount(dom.textAnswer.value.length);

  // Auto-resize
  autoResizeTextarea(dom.textAnswer);

  // Save on input
  dom.textAnswer.oninput = () => {
    const val = dom.textAnswer.value;
    quizState.answers[q.id] = val;
    quizState.skipped.delete(q.id);
    updateCharCount(val.length);
    autoResizeTextarea(dom.textAnswer);
    updatePaletteItem(quizState.currentIndex);
    updatePaletteStats();
    doAutosave();
  };

  // Focus
  dom.textAnswer.focus();
}

function updateCharCount(len) {
  if (dom.charCount) {
    dom.charCount.textContent = `${len.toLocaleString()} character${len !== 1 ? 's' : ''}`;
  }
}

function autoResizeTextarea(el) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 400) + 'px';
}

/* ══════════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════════ */

function goToQuestion(index) {
  if (index < 0 || index >= quizState.totalCount) return;

  // Save current text answer before leaving
  saveCurrentTextAnswer();

  quizState.currentIndex = index;
  renderQuestion(index);

  // Close palette on mobile
  closePaletteOnMobile();
}

function goNext() {
  if (quizState.currentIndex < quizState.totalCount - 1) {
    goToQuestion(quizState.currentIndex + 1);
  }
}

function goPrev() {
  if (quizState.currentIndex > 0) {
    goToQuestion(quizState.currentIndex - 1);
  }
}

function skipQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  if (q && !quizState.answers[q.id]) {
    quizState.skipped.add(q.id);
    updatePaletteItem(quizState.currentIndex);
    updatePaletteStats();
    doAutosave();
  }
  goNext();
}

function saveCurrentTextAnswer() {
  const q = quizState.questions[quizState.currentIndex];
  if (!q || q.type === 'mcq') return;
  if (dom.textAnswer) {
    const val = dom.textAnswer.value.trim();
    if (val) {
      quizState.answers[q.id] = dom.textAnswer.value;
      quizState.skipped.delete(q.id);
    }
  }
}

function updateNavButtons(index) {
  if (dom.btnPrev) {
    dom.btnPrev.disabled = index === 0;
  }
  if (dom.btnNext) {
    const isLast = index === quizState.totalCount - 1;
    dom.btnNext.textContent = isLast ? 'Submit →' : 'Next →';
    dom.btnNext.setAttribute('aria-label',
      isLast ? 'Submit quiz' : 'Next question'
    );
  }
  if (dom.btnSkip) {
    const q = quizState.questions[index];
    const answered = q && quizState.answers[q.id];
    dom.btnSkip.style.display =
      index === quizState.totalCount - 1 ? 'none' : '';
  }
}

/* ══════════════════════════════════════════════════════════════
   PALETTE
══════════════════════════════════════════════════════════════ */

function buildPalette() {
  if (!dom.questionPalette) return;
  dom.questionPalette.innerHTML = '';

  quizState.questions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.className   = 'palette-item';
    btn.textContent = i + 1;
    btn.setAttribute('aria-label', `Go to question ${i + 1}`);
    btn.dataset.index = i;

    btn.addEventListener('click', () => goToQuestion(i));

    dom.questionPalette.appendChild(btn);
  });

  updateAllPaletteItems();
  updatePaletteStats();
}

function updateAllPaletteItems() {
  quizState.questions.forEach((_, i) => updatePaletteItem(i));
}

function updatePaletteItem(index) {
  if (!dom.questionPalette) return;
  const btn = dom.questionPalette.querySelector(`[data-index="${index}"]`);
  if (!btn) return;

  const q = quizState.questions[index];
  const isCurrent  = index === quizState.currentIndex;
  const isAnswered  = q && !!quizState.answers[q.id];
  const isSkipped   = q && quizState.skipped.has(q.id);

  btn.className = 'palette-item';
  if (isAnswered)         btn.classList.add('answered');
  else if (isSkipped)     btn.classList.add('skipped');
  if (isCurrent)          btn.classList.add('current');

  btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
}

function updatePaletteHighlight(currentIndex) {
  if (!dom.questionPalette) return;

  // Remove current from all
  dom.questionPalette.querySelectorAll('.palette-item').forEach((btn, i) => {
    btn.classList.toggle('current', i === currentIndex);
    btn.setAttribute('aria-pressed', i === currentIndex ? 'true' : 'false');
  });
}

function updatePaletteStats() {
  if (!dom.paletteStats) return;

  const total    = quizState.totalCount;
  const answered = Object.keys(quizState.answers).length;
  const skipped  = quizState.skipped.size;
  const remaining = total - answered - skipped;

  dom.paletteStats.innerHTML = `
    <div class="palette-stat">
      <span class="palette-stat-value green">${answered}</span>
      <span class="palette-stat-label">Done</span>
    </div>
    <div class="palette-stat">
      <span class="palette-stat-value yellow">${skipped}</span>
      <span class="palette-stat-label">Skipped</span>
    </div>
    <div class="palette-stat">
      <span class="palette-stat-value gray">${remaining}</span>
      <span class="palette-stat-label">Left</span>
    </div>
  `;
}

/* Toggle palette (mobile) */
function openPalette() {
  dom.paletteSidebar?.classList.add('open');
  dom.paletteOverlay?.classList.add('visible');
  dom.paletteOverlay?.removeAttribute('aria-hidden');
  dom.btnTogglePalette?.setAttribute('aria-expanded', 'true');
  // Scroll to current item
  const curr = dom.questionPalette?.querySelector('.current');
  if (curr) curr.scrollIntoView({ block: 'nearest' });
}

function closePalette() {
  dom.paletteSidebar?.classList.remove('open');
  dom.paletteOverlay?.classList.remove('visible');
  dom.paletteOverlay?.setAttribute('aria-hidden', 'true');
  dom.btnTogglePalette?.setAttribute('aria-expanded', 'false');
}

function closePaletteOnMobile() {
  if (window.innerWidth < 1024) closePalette();
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS BAR
══════════════════════════════════════════════════════════════ */

function updateProgress() {
  const answered = Object.keys(quizState.answers).length;
  const pct      = quizState.totalCount > 0
    ? Math.round((answered / quizState.totalCount) * 100)
    : 0;

  if (dom.progressFill) {
    dom.progressFill.style.width = pct + '%';
  }
  if (dom.progressBar) {
    dom.progressBar.setAttribute('aria-valuenow', pct);
  }
}

/* ══════════════════════════════════════════════════════════════
   TIMER
══════════════════════════════════════════════════════════════ */

function initTimer(durationSeconds) {
  if (!dom.quizTimer || !dom.timerValue) return;

  showEl(dom.quizTimer);
  quizState.timerRunning = true;

  startTimer(
    durationSeconds,
    // onTick
    (remaining, formatted) => {
      if (dom.timerValue) dom.timerValue.textContent = formatted;

      // Color states
      if (dom.quizTimer) {
        dom.quizTimer.classList.remove('warning', 'danger');
        if (remaining <= 60) {
          dom.quizTimer.classList.add('danger');
        } else if (remaining <= 300) {
          dom.quizTimer.classList.add('warning');
        }
      }
    },
    // onWarning
    () => {
      showTimerToast();
    },
    // onExpire
    () => {
      quizState.timerRunning = false;
      autoSubmitQuiz();
    }
  );
}

function showTimerToast() {
  if (!dom.timerToast) return;
  showEl(dom.timerToast);
  setTimeout(() => hideEl(dom.timerToast), 5000);
}

function autoSubmitQuiz() {
  saveCurrentTextAnswer();
  submitQuiz();
}

/* ══════════════════════════════════════════════════════════════
   AUTOSAVE
══════════════════════════════════════════════════════════════ */

function doAutosave() {
  const state = {
    config:       quizState.config,
    questions:    quizState.questions,
    answers:      quizState.answers,
    skipped:      [...quizState.skipped],
    visited:      [...quizState.visited],
    currentIndex: quizState.currentIndex,
    startTime:    quizState.startTime,
    autosaveKey:  quizState.autosaveKey,
    savedAt:      getTimestamp()
  };

  saveToStorage(quizState.autosaveKey, state);
}

/* ══════════════════════════════════════════════════════════════
   SUBMIT
══════════════════════════════════════════════════════════════ */

function openSubmitModal() {
  saveCurrentTextAnswer();

  const total    = quizState.totalCount;
  const answered = Object.keys(quizState.answers).length;
  const skipped  = quizState.skipped.size;
  const unanswered = total - answered;

  if (dom.submitModalStats) {
    dom.submitModalStats.innerHTML = `
      <div class="submit-stat">
        <span class="submit-stat-value green">${answered}</span>
        <span class="submit-stat-label">Answered</span>
      </div>
      <div class="submit-stat">
        <span class="submit-stat-value yellow">${skipped}</span>
        <span class="submit-stat-label">Skipped</span>
      </div>
      <div class="submit-stat">
        <span class="submit-stat-value gray">${unanswered}</span>
        <span class="submit-stat-label">Unanswered</span>
      </div>
    `;
  }

  dom.submitModalOverlay?.classList.add('open');
}

function closeSubmitModal() {
  dom.submitModalOverlay?.classList.remove('open');
}

function submitQuiz() {
  if (quizState.submitted) return;
  quizState.submitted = true;

  saveCurrentTextAnswer();
  stopTimer();

  const cfg       = quizState.config;
  const questions = quizState.questions;
  const answers   = quizState.answers;
  const elapsed   = Math.round((Date.now() - quizState.startTime) / 1000);

  // Calculate score (MCQ mode)
  let scoreData = null;
  if (cfg.mode === 'mcq') {
    scoreData = calculateScore(questions, answers);
  }

  // Build result object
  const result = {
    config:    cfg,
    questions: questions,
    answers:   answers,
    skipped:   [...quizState.skipped],
    elapsed:   elapsed,
    score:     scoreData ? scoreData.score    : null,
    total:     scoreData ? scoreData.total    : questions.length,
    correct:   scoreData ? scoreData.correct  : null,
    incorrect: scoreData ? scoreData.incorrect: null,
    unanswered:scoreData ? scoreData.unanswered : null,
    percentage:scoreData ? scoreData.percentage : null,
    completedAt: getTimestamp()
  };

  // Save result to storage for result page
  saveToStorage('quiz-result', result);

  // Save to history
  saveToHistory({
    subject:    cfg.subject,
    unit:       cfg.unit,
    mode:       cfg.mode,
    score:      result.score,
    total:      result.total,
    percentage: result.percentage,
    elapsed:    elapsed,
    questionIds: questions.map(q => q.id),
    answers:    answers,
    completedAt: result.completedAt
  });

  // Clear autosave
  clearSpecificQuizState(quizState.autosaveKey);

  // Navigate based on mode
  if (cfg.mode === 'mcq') {
    window.location.href = 'result.html';
  } else {
    window.location.href = 'review.html';
  }
}

/* ══════════════════════════════════════════════════════════════
   FEWER QUESTIONS MODAL
══════════════════════════════════════════════════════════════ */

function showFewerWarning(available, requested) {
  return new Promise(resolve => {
    if (!dom.fewerModalDesc || !dom.fewerModalOverlay) {
      resolve('continue');
      return;
    }

    dom.fewerModalDesc.textContent =
      `Only ${available} question${available !== 1 ? 's' : ''} are available matching your filters, ` +
      `but you requested ${requested}. ` +
      `Continue with ${available} question${available !== 1 ? 's' : ''}?`;

    dom.fewerModalOverlay.classList.add('open');

    const continueBtn = dom.btnContinueFewer;
    if (continueBtn) {
      continueBtn.onclick = () => {
        dom.fewerModalOverlay.classList.remove('open');
        resolve('continue');
      };
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   UI EVENT BINDING
══════════════════════════════════════════════════════════════ */

function bindUIEvents() {
  // Navigation
  dom.btnPrev?.addEventListener('click', goPrev);
  dom.btnNext?.addEventListener('click', () => {
    const isLast = quizState.currentIndex === quizState.totalCount - 1;
    if (isLast) {
      openSubmitModal();
    } else {
      goNext();
    }
  });
  dom.btnSkip?.addEventListener('click', skipQuestion);

  // Submit buttons
  dom.btnSubmitTop?.addEventListener('click', openSubmitModal);
  dom.btnSubmitMobile?.addEventListener('click', openSubmitModal);
  dom.btnSubmitPalette?.addEventListener('click', openSubmitModal);

  // Submit modal
  dom.btnCancelSubmit?.addEventListener('click', closeSubmitModal);
  dom.btnConfirmSubmit?.addEventListener('click', () => {
    closeSubmitModal();
    submitQuiz();
  });

  // Submit modal overlay click
  dom.submitModalOverlay?.addEventListener('click', e => {
    if (e.target === dom.submitModalOverlay) closeSubmitModal();
  });

  // Palette toggle
  dom.btnTogglePalette?.addEventListener('click', () => {
    const isOpen = dom.paletteSidebar?.classList.contains('open');
    if (isOpen) {
      closePalette();
    } else {
      openPalette();
    }
  });

  dom.btnClosePalette?.addEventListener('click', closePalette);

  // Palette overlay click
  dom.paletteOverlay?.addEventListener('click', closePalette);

  // Exit quiz link
  const exitLink = qs('#btn-exit-quiz');
  if (exitLink) {
    exitLink.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Exit quiz? Your progress will be saved and you can resume later.')) {
        doAutosave();
        window.location.href = 'index.html';
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboard);

  // Prevent accidental page leave
  window.addEventListener('beforeunload', e => {
    if (!quizState.submitted) {
      doAutosave();
      e.preventDefault();
      e.returnValue = '';
    }
  });
}

/* ── Keyboard Shortcuts ──────────────────────────────────────  */
function handleKeyboard(e) {
  // Don't intercept when typing in textarea
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      goNext();
      break;

    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      goPrev();
      break;

    case 's':
    case 'S':
      e.preventDefault();
      skipQuestion();
      break;

    case 'Enter':
      // Only if last question
      if (quizState.currentIndex === quizState.totalCount - 1) {
        e.preventDefault();
        openSubmitModal();
      }
      break;

    // MCQ: press A/B/C/D to select
    case 'a': case 'A': selectByKey('A'); break;
    case 'b': case 'B': selectByKey('B'); break;
    case 'c': case 'C': selectByKey('C'); break;
    case 'd': case 'D': selectByKey('D'); break;
  }
}

function selectByKey(key) {
  const q = quizState.questions[quizState.currentIndex];
  if (!q || q.type !== 'mcq') return;
  if (q.options && q.options[key]) {
    selectMCQOption(q.id, key);
  }
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function hideLoadingScreen() {
  if (dom.loadingScreen) {
    dom.loadingScreen.classList.add('hidden');
  }
}

function setLoadingDesc(text) {
  if (dom.loadingDesc) dom.loadingDesc.textContent = text;
}

function showErrorScreen(title, desc) {
  hideLoadingScreen();
  if (dom.errorScreen) {
    showEl(dom.errorScreen);
    if (dom.errorTitle) dom.errorTitle.textContent = title;
    if (dom.errorDesc)  dom.errorDesc.textContent  = desc;
  }
}