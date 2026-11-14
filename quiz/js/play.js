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
  attemptId:     null,
  endsAt:        null,
  remainingMs:   null,
  flags:         {},
  paperSelection:new Set(),
  paperSectionEndsAt:null,
  paperSectionClosed:false,
  legacyKey:     null,
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

  try {
    if (getParam('paperFile')) {
      const data = await QuizPaper.load(getParam('subject'), getParam('paperFile'));
      await resumeQuiz(QuizAttempts.save({...data,answers:{},flags:{}})); return;
    }
    if (getParam('mistakes') === '1') {
      const questions=QuizAttempts.mistakeQuestions();
      if (!questions.length) throw new Error('Your mistake queue is empty.');
      const attempt=QuizAttempts.save({config:{subject:'all',unit:'all',mode:'all',timer:false,mistakes:true},questions,answers:{},flags:{}});
      await resumeQuiz(attempt); return;
    }
    const retryId = getParam('retry');
    if (retryId) {
      const entry = QuizAttempts.historyEntry(retryId);
      await resumeQuiz(QuizAttempts.retry(entry, getParam('shuffle') === '1'));
      return;
    }
    const resumeKey = getParam('resume');
    if (resumeKey) {
      const saved = QuizAttempts.get(resumeKey);
      if (!saved || saved.status !== 'active') throw new Error('This attempt is no longer active. Choose a new quiz.');
      await resumeQuiz(saved); return;
    }
    quizState.config = parseConfig();
    await loadAndStartQuiz();
  } catch (error) { showErrorScreen('Cannot open attempt', error.message); }

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
    const attempt = QuizAttempts.save({config:cfg,questions:selected,answers:{},flags:{},status:'active'});
    quizState.attemptId = attempt.id;
    quizState.autosaveKey = attempt.autosaveKey;
    quizState.startTime = attempt.startedAt;
    quizState.endsAt = attempt.endsAt;
    quizState.remainingMs = attempt.remainingMs;
    quizState.paperSelection = new Set(attempt.paperSelection || []);
    quizState.paperSectionEndsAt = attempt.paperSectionEndsAt || null;
    quizState.paperSectionClosed = Boolean(attempt.paperSectionClosed);

    initQuizUI();

  } catch (err) {
    console.error('Quiz load error:', err);
    showErrorScreen(
      'Failed to Load Quiz',
      err.message + ' Use Reload to retry; no partial quiz was started.'
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
  saved = QuizAttempts.normalize(saved);
  quizState.attemptId = saved.id;
  quizState.endsAt = saved.endsAt;
  quizState.remainingMs = saved.remainingMs;
  quizState.flags = saved.flags || {};
  quizState.paperSelection = new Set(saved.paperSelection || []);
  quizState.paperSectionEndsAt = saved.paperSectionEndsAt || null;
  quizState.paperSectionClosed = Boolean(saved.paperSectionClosed);
  quizState.legacyKey = saved.legacyKey;
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

  if (cfg.paper) {
    const notice = document.createElement('section');
    notice.className = 'paper-practice-notice';
    notice.setAttribute('aria-label','Paper instructions and choice tracker');
    const heading = document.createElement('h2'); heading.textContent = `Paper practice — ${cfg.paper.examSession}`;
    const summary = document.createElement('p');
    summary.textContent = `${quizState.questions.length} set questions · ${cfg.paper.setMarks} marks across all set questions · printed maximum ${cfg.paper.fullMarks} · ${cfg.paper.duration}. ${cfg.paper.notice}`;
    notice.append(heading,summary);
    const warning = document.createElement('p'); warning.setAttribute('role','status');
    warning.textContent = cfg.paper.setMarks !== cfg.paper.fullMarks ? 'Unverified overall total: set-question marks differ from the printed maximum (choice/group rules apply). This is not an official scored mock examination.' : 'Paper maximum is historical; current syllabus reconciliation is still pending.';
    notice.append(warning);
    for (const text of cfg.paper.instructions || []) notice.appendChild(createElement('p','',text));
    for (const group of cfg.paper.groups || []) notice.appendChild(createElement('p','',group.instruction || group.title || group.id));
    if (cfg.paper.rules?.unsupported?.length || cfg.paper.rules?.uncoveredQuestionIds?.length) {
      const caveat = createElement('p','paper-rule-caveat','Some answer-choice metadata could not be reconciled; those choices are not enforced. Follow the printed instructions.');
      caveat.setAttribute('role','status'); notice.appendChild(caveat);
    }
    for (const issue of cfg.paper.rules?.unsupportedTimed || []) {
      const caveat = createElement('p','paper-rule-caveat',issue); caveat.setAttribute('role','status'); notice.appendChild(caveat);
    }
    const choiceHeading = createElement('h3','paper-choice-heading','Recorded answer choices');
    notice.appendChild(choiceHeading);
    const choiceStatus = document.createElement('div'); choiceStatus.id = 'paper-choice-status'; choiceStatus.setAttribute('role','status');
    choiceStatus.setAttribute('aria-live','polite'); notice.appendChild(choiceStatus);
    const timedRule = cfg.paper.rules?.timedRules?.[0];
    if (timedRule) {
      const sectionState = document.createElement('p'); sectionState.id = 'paper-section-state'; sectionState.setAttribute('role','status');
      const endButton = createElement('button','btn btn-secondary btn-sm','Finish timed section and continue');
      endButton.type = 'button'; endButton.id = 'paper-section-end';
      endButton.addEventListener('click', () => {
        if (confirm('End this timed section now? Its questions will be collected and locked for this attempt.')) finishPaperTimedSection();
      });
      const timerLabel = document.createElement('span'); timerLabel.id = 'paper-section-timer';
      notice.append(sectionState,timerLabel,endButton);
    }
    dom.quizLayout.prepend(notice);
    renderPaperRuleNotice();
    updatePaperSectionTimer();
  }
  // Build palette
  buildPalette();

  // Render first question
  renderQuestion(quizState.currentIndex);

  // Start timer if enabled
  if (cfg.timer && cfg.timerMins > 0) {
    initTimer(Math.max(0, (quizState.endsAt - Date.now()) / 1000));
  }

  // Bind all UI events
  bindUIEvents();

  // Keep the selected attempt addressable on refresh and after reopening the tab.
  window.history.replaceState(null, '', buildURL('play.html', {resume:quizState.autosaveKey}));
  doAutosave();
  setInterval(doAutosave, 5000);
  if (cfg.paper?.rules?.timedRules?.length) setInterval(updatePaperSectionTimer, 1000);
  window.addEventListener('pagehide', doAutosave);
  document.addEventListener('visibilitychange', () => {
    updatePaperSectionTimer();
    doAutosave();
    if (!quizState.submitted && quizState.endsAt && Date.now() >= quizState.endsAt) autoSubmitQuiz();
  });
}

function renderPaperChoiceControl(question) {
  const panel = qs('#paper-choice-control');
  const toggle = qs('#paper-choice-toggle');
  const hint = qs('#paper-choice-hint');
  const rules = quizState.config?.paper?.rules;
  if (!panel || !toggle || !rules) { if (panel) panel.hidden = true; return; }
  const rule = QuizPaperRules.constraintFor(rules, question.id);
  if (!rule) { panel.hidden = true; return; }

  const selected = quizState.paperSelection.has(question.id);
  const state = QuizPaperRules.status(rules, [...quizState.paperSelection]).find(item => item.id === rule.id);
  panel.hidden = false;
  toggle.checked = selected;
  toggle.disabled = !selected && state.selectedCount >= rule.answerAny;
  hint.textContent = `${rule.label}: ${state.selectedCount} of ${rule.answerAny} selected. This records your intended choices; it does not grade answers.`;
  toggle.onchange = () => {
    const next = new Set(quizState.paperSelection);
    if (toggle.checked) next.add(question.id); else next.delete(question.id);
    const validation = QuizPaperRules.validate(rules, [...next]);
    if (!validation.valid) { toggle.checked = false; return; }
    quizState.paperSelection = next;
    doAutosave();
    renderPaperRuleNotice();
    renderPaperChoiceControl(question);
  };
}

function renderPaperRuleNotice() {
  const cfg = quizState.config;
  if (!cfg?.paper) return;
  const summary = qs('#paper-choice-status');
  if (summary) {
    summary.replaceChildren();
    const states = QuizPaperRules.status(cfg.paper.rules, [...quizState.paperSelection]);
    if (!states.length) summary.appendChild(createElement('p','', 'No structured answer-choice quotas are available for this paper; use its printed instructions.'));
    for (const state of states) summary.appendChild(createElement('p','',`${state.label}: ${state.selectedCount}/${state.answerAny} selected · ${state.remaining} remaining`));
  }
  updatePaperSectionTimer();
}

function finishPaperTimedSection() {
  const rule = quizState.config?.paper?.rules?.timedRules?.[0];
  if (!rule || quizState.paperSectionClosed) return;
  saveCurrentTextAnswer();
  quizState.paperSectionClosed = true;
  doAutosave();
  updatePaperSectionTimer();
  const timedIds = new Set(rule.questionIds);
  const nextIndex = quizState.questions.findIndex(question => !timedIds.has(question.id));
  if (nextIndex >= 0 && timedIds.has(quizState.questions[quizState.currentIndex]?.id)) goToQuestion(nextIndex);
}

function updatePaperSectionTimer() {
  const cfg = quizState.config;
  const rule = cfg?.paper?.rules?.timedRules?.[0];
  if (!rule) return;
  const state = qs('#paper-section-state');
  const timer = qs('#paper-section-timer');
  const end = qs('#paper-section-end');
  if (!quizState.paperSectionClosed && Date.now() >= Number(quizState.paperSectionEndsAt || 0)) {
    finishPaperTimedSection(false);
    return;
  }
  if (quizState.paperSectionClosed) {
    if (state) state.textContent = `${rule.label} is closed; its responses are frozen for this attempt.`;
    if (timer) timer.textContent = '';
    if (end) end.hidden = true;
    return;
  }
  const seconds = Math.max(0, Math.ceil((quizState.paperSectionEndsAt - Date.now()) / 1000));
  if (state) state.textContent = `Complete ${rule.label} first. When its source-stated time expires, its responses are collected and the remaining paper opens.`;
  if (timer) timer.textContent = `Timed section remaining: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,'0')}. `;
  if (end) end.hidden = false;
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

  if (dom.qMetaTags) {
    const flag = createElement('button', 'btn btn-outline btn-sm', quizState.flags[q.id] ? 'Unmark question' : 'Mark for review');
    flag.type = 'button'; flag.setAttribute('aria-pressed', String(Boolean(quizState.flags[q.id])));
    flag.addEventListener('click', () => { quizState.flags[q.id] = !quizState.flags[q.id]; doAutosave(); renderQuestion(index); });
    dom.qMetaTags.appendChild(flag);
  }
  // Question text
  if (dom.questionText) {
    dom.questionText.textContent = (cfgPaperLabel(q)) + q.question;
    if (q.type !== 'mcq') {
      dom.qMetaTags?.appendChild(createElement('span', 'badge badge-neutral', q.modelAnswer ? 'Supplied model answer — self-review only' : 'No key — not graded'));
    }
  }

  // Render MCQ or text answer
  if (q.type === 'mcq') {
    renderMCQ(q);
  } else {
    renderTextAnswer(q);
  }
  renderPaperChoiceControl(q);

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
        'Write a detailed answer. This will be exported for manual review.';
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
  const timedRule = quizState.config?.paper?.rules?.timedRules?.[0];
  if (timedRule) {
    const target = quizState.questions[index];
    const targetIsTimed = timedRule.questionIds.includes(target?.id);
    if (!quizState.paperSectionClosed && !targetIsTimed) {
      const state = qs('#paper-section-state');
      if (state) state.textContent = `Finish ${timedRule.label} before opening the remaining paper.`;
      return;
    }
    if (quizState.paperSectionClosed && targetIsTimed) {
      const state = qs('#paper-section-state');
      if (state) state.textContent = `${timedRule.label} has been collected and is locked for this attempt.`;
      return;
    }
  }

  // Save current text answer before leaving
  saveCurrentTextAnswer();

  quizState.currentIndex = index;
  renderQuestion(index);
  doAutosave();

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
    } else { delete quizState.answers[q.id]; }
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
  const answered = Object.values(quizState.answers).filter(QuizAttempts.hasAnswer).length;
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
  const answered = Object.values(quizState.answers).filter(QuizAttempts.hasAnswer).length;
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
    (threshold) => {
      if (dom.timerToast) dom.timerToast.textContent = threshold === 600 ? '10 minutes remaining' : '1 minute remaining';
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

function attemptSnapshot() {
  return {schemaVersion:1,id:quizState.attemptId,config:quizState.config,questions:quizState.questions,
    answers:quizState.answers,flags:quizState.flags,paperSelection:[...quizState.paperSelection],
    paperSectionEndsAt:quizState.paperSectionEndsAt,paperSectionClosed:quizState.paperSectionClosed,
    skipped:[...quizState.skipped],visited:[...quizState.visited],
    currentIndex:quizState.currentIndex,startedAt:quizState.startTime,endsAt:quizState.endsAt,
    remainingMs:quizState.endsAt ? Math.max(0,quizState.endsAt-Date.now()) : null,
    autosaveKey:quizState.autosaveKey,legacyKey:quizState.legacyKey,status:'active'};
}
function doAutosave() {
  if (quizState.submitted || !quizState.questions.length) return;
  saveCurrentTextAnswer();
  try {
    const saved = QuizAttempts.save(attemptSnapshot());
    quizState.answers = saved.answers;
    const notice = document.getElementById('attempt-save-error'); if (notice) notice.remove();
  } catch (error) {
    let notice = document.getElementById('attempt-save-error');
    if (!notice) { notice = document.createElement('p'); notice.id = 'attempt-save-error'; notice.setAttribute('role','alert'); dom.quizLayout.prepend(notice); }
    notice.textContent = 'This attempt could not be saved on this device. Keep this tab open. ' + error.message;
  }
}

/* ══════════════════════════════════════════════════════════════
   SUBMIT
══════════════════════════════════════════════════════════════ */

function openSubmitModal() {
  saveCurrentTextAnswer();

  const total    = quizState.totalCount;
  const answered = Object.values(quizState.answers).filter(QuizAttempts.hasAnswer).length;
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
  saveCurrentTextAnswer();
  const cfg = quizState.config;
  if (cfg.paper?.rules) {
    const selectionCheck = QuizPaperRules.validate(cfg.paper.rules, [...quizState.paperSelection]);
    if (!selectionCheck.valid) {
      const state = qs('#paper-section-state') || qs('#paper-choice-status');
      if (state) state.textContent = selectionCheck.violations.map(item => item.reason).join(' ');
      return;
    }
  }
  quizState.submitted = true;
  stopTimer();

  const questions   = quizState.questions;
  const answers   = quizState.answers;
  const elapsed   = Math.round((Date.now() - quizState.startTime) / 1000);

  try {
    const result = QuizAttempts.finish(attemptSnapshot());
  } catch (error) {
    quizState.submitted = false;
    showErrorScreen('Submission could not be saved', error.message + ' Your existing autosave was retained.');
    return;
  }

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
function cfgPaperLabel(q) {
  return quizState.config.paper ? `${q.group ? 'Group '+q.group+' · ' : ''}${q.sourceNumber || q.id}\n` : '';
}
