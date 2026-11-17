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
  explanations:  {},       // { questionId: writtenExplanation } for 2-mark MCQs
  skipped:       new Set(),// Set of question IDs that were skipped
  visited:       new Set(),// Set of question IDs visited
  lockedGroups:  new Set(),// Locked paper section group IDs (e.g. 'A' after loose-script lock)
  currentIndex:  0,
  totalCount:    0,
  startTime:     null,
  autosaveKey:   null,
  timerRunning:  false,
  attemptId:     null,
  endsAt:        null,
  sectionEndsAt: null,
  sectionExpiredHandled: false,
  remainingMs:   null,
  flags:         {},
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
  quizState.sectionEndsAt = saved.sectionEndsAt || null;
  quizState.sectionExpiredHandled = Boolean(saved.sectionEndsAt && Date.now() >= saved.sectionEndsAt);
  quizState.remainingMs = saved.remainingMs;
  quizState.flags = saved.flags || {};
  quizState.legacyKey = saved.legacyKey;
  quizState.config        = saved.config;
  quizState.questions     = saved.questions;
  quizState.totalCount    = saved.questions.length;
  quizState.answers       = saved.answers || {};
  quizState.explanations  = saved.explanations || {};
  quizState.lockedGroups  = new Set(saved.lockedGroups || []);
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
    const notice = document.createElement('section'); notice.setAttribute('aria-label','Paper instructions');
    const heading = document.createElement('h2'); heading.textContent = `Paper practice — ${cfg.paper.examSession}`;
    const summary = document.createElement('p');
    summary.textContent = `${quizState.questions.length} set questions · ${cfg.paper.setMarks} marks across all set questions · printed maximum ${cfg.paper.fullMarks} · ${cfg.paper.duration}. ${cfg.paper.notice}`;
    notice.append(heading,summary);
    const warning = document.createElement('p'); warning.setAttribute('role','status');
    const eseDiff = Number(cfg.paper.fullMarks) !== 60 ? ` Printed maximum (${cfg.paper.fullMarks}) differs from the 60-mark ESE pattern printed on syllabus p.14.` : '';
    // Phase 8.5: the printed maximum is reconciled against the paper's own
    // answer-any quotas, so the notice explains the difference instead of
    // calling the total unknown. Whether the syllabus pattern applies to this
    // session is still not decided here.
    const obtainable = (cfg.paper.groups || []).reduce((sum, group) => sum + Number(group.maxMarks || 0), 0);
    const quotasReconcile = obtainable > 0 && obtainable === Number(cfg.paper.fullMarks);
    const quotaNote = obtainable > 0
      ? ` The paper's own answer-any quotas allow ${obtainable} marks${quotasReconcile ? `, which equals the printed maximum of ${cfg.paper.fullMarks}` : ''}; the extra marks above are on questions the paper does not require you to answer.`
      : '';
    warning.textContent = cfg.paper.setMarks !== cfg.paper.fullMarks
      ? `Unverified overall total: all set questions carry ${cfg.paper.setMarks} marks while the printed maximum is ${cfg.paper.fullMarks}.${quotaNote}${eseDiff} Whether the current syllabus pattern applies to this session is not decided here. This is not an official scored mock examination.`
      : `Paper maximum is ${cfg.paper.fullMarks} marks and matches the marks on its set questions.${eseDiff} Whether the current syllabus pattern applies to this session is not decided here.`;
    notice.append(warning);
    for (const text of cfg.paper.instructions) notice.appendChild(createElement('p','',text));
    for (const group of cfg.paper.groups) notice.appendChild(createElement('p','',group.instruction || group.title || group.id));
    dom.quizLayout.prepend(notice);
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
  window.addEventListener('pagehide', doAutosave);
  document.addEventListener('visibilitychange', () => {
    doAutosave();
    if (!quizState.submitted && quizState.endsAt && Date.now() >= quizState.endsAt) autoSubmitQuiz();
  });
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
    } else if (q.explanationMarks > 0) {
      dom.qMetaTags?.appendChild(createElement('span', 'badge badge-neutral', '1m option (auto-checked) + 1m explanation (manual review)'));
    }
  }

  renderPaperRuleBanner(q);

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

function renderPaperRuleBanner(q) {
  let banner = document.getElementById('paper-rule-banner');
  if (!quizState.config?.paper) {
    if (banner) banner.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'paper-rule-banner';
    banner.className = 'paper-rule-banner';
    banner.style.cssText = 'margin:0.5rem 0 0.85rem;padding:0.65rem 0.9rem;border-radius:8px;border:1px solid var(--border,#cbd5e1);font-size:0.9rem;';
    dom.questionText?.parentNode?.insertBefore(banner, dom.questionText);
  }
  banner.replaceChildren();
  const snap = attemptSnapshot();
  const access = QuizAttempts.questionAccess(snap, q.id);
  if (access.rule) {
    const quota = createElement('p', '', `${access.rule.label} — Answer any ${access.rule.answerAny} of ${access.rule.totalSet} · ${access.answeredInRule} / ${access.rule.answerAny} answered`);
    quota.style.margin = '0';
    quota.style.fontWeight = '600';
    banner.appendChild(quota);
  }
  const ts = quizState.config.paper.timedSection;
  if (ts && quizState.sectionEndsAt) {
    const firstClosed = Date.now() >= quizState.sectionEndsAt || quizState.lockedGroups.has(String(ts.groupId));
    const tsRow = document.createElement('div');
    tsRow.style.cssText = 'display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.35rem;';
    const tsText = document.createElement('span');
    tsText.id = 'section-timer-status';
    if (firstClosed) {
      tsText.textContent = `Group ${ts.groupId} loose-script window closed — Group B unlocked.`;
    } else {
      const remSec = Math.max(0, Math.ceil((quizState.sectionEndsAt - Date.now()) / 1000));
      const mm = String(Math.floor(remSec / 60)).padStart(2, '0');
      const ss = String(remSec % 60).padStart(2, '0');
      tsText.textContent = `Group ${ts.groupId} ${ts.minutes}-min window: ${mm}:${ss} remaining`;
      const lockBtn = createElement('button', 'btn btn-outline btn-sm', `Lock Group ${ts.groupId} & unlock Group B`);
      lockBtn.type = 'button';
      lockBtn.addEventListener('click', () => {
        quizState.lockedGroups.add(String(ts.groupId));
        doAutosave();
        renderQuestion(quizState.currentIndex);
      });
      tsRow.append(tsText, lockBtn);
      banner.appendChild(tsRow);
    }
    if (firstClosed) {
      tsRow.appendChild(tsText);
      banner.appendChild(tsRow);
    }
  }
  if (access.locked && access.reason) {
    const lockMsg = createElement('p', '', access.reason);
    lockMsg.setAttribute('role', 'status');
    lockMsg.style.cssText = 'margin:0.4rem 0 0;color:var(--danger,#dc2626);font-weight:500;';
    banner.appendChild(lockMsg);
  }
}

/* ── Render MCQ Options ──────────────────────────────────────  */
function renderMCQ(q) {
  showEl(dom.optionsContainer);
  hideEl(dom.textAnswerContainer);

  dom.optionsContainer.innerHTML = '';
  dom.optionsContainer.setAttribute('aria-label', 'Answer options');

  const saved = quizState.answers[q.id];
  const access = QuizAttempts.questionAccess(attemptSnapshot(), q.id);

  Object.entries(q.options || {}).forEach(([key, text]) => {
    const label = document.createElement('label');
    label.className = 'option-card' + (saved === key ? ' selected' : '') + (access.locked ? ' disabled' : '');
    label.setAttribute('for', `opt-${q.id}-${key}`);

    const radio = document.createElement('input');
    radio.type    = 'radio';
    radio.id      = `opt-${q.id}-${key}`;
    radio.name    = `question-${q.id}`;
    radio.value   = key;
    radio.checked = saved === key;
    radio.disabled = access.locked;
    radio.setAttribute('aria-label', `Option ${key}: ${text}`);

    const optLabel = createElement('span', 'option-label', key);
    const optText  = createElement('span', 'option-text', text);
    const optCheck = createElement('span', 'option-check', '✓');

    label.appendChild(radio);
    label.appendChild(optLabel);
    label.appendChild(optText);
    label.appendChild(optCheck);

    if (!access.locked) {
      label.addEventListener('click', () => {
        selectMCQOption(q.id, key);
      });
      radio.addEventListener('change', () => {
        selectMCQOption(q.id, key);
      });
    }

    dom.optionsContainer.appendChild(label);
  });

  if ((QuizAttempts.hasAnswer(saved) || QuizAttempts.hasAnswer(quizState.explanations[q.id])) && !access.locked) {
    const clearWrap = document.createElement('div');
    clearWrap.style.marginTop = '0.6rem';
    const clearBtn = createElement('button', 'btn btn-outline btn-sm', 'Clear selection');
    clearBtn.type = 'button';
    clearBtn.id = 'btn-clear-mcq';
    clearBtn.addEventListener('click', () => clearMCQOption(q.id));
    clearWrap.appendChild(clearBtn);
    dom.optionsContainer.appendChild(clearWrap);
  }

  if (q.explanationMarks > 0) {
    const explWrap = document.createElement('div');
    explWrap.className = 'mcq-explanation-box';
    explWrap.style.marginTop = '0.9rem';
    const explLabel = createElement('label', 'form-label', 'Written explanation (1 mark — manual self-review, not auto-scored)');
    explLabel.setAttribute('for', `mcq-expl-${q.id}`);
    const explInput = document.createElement('textarea');
    explInput.id = `mcq-expl-${q.id}`;
    explInput.className = 'form-textarea';
    explInput.rows = 3;
    explInput.placeholder = 'Explain why your chosen option is correct (1 mark in paper rubric)…';
    explInput.value = quizState.explanations[q.id] || '';
    explInput.disabled = access.locked;
    explInput.addEventListener('input', () => {
      if (QuizAttempts.questionAccess(attemptSnapshot(), q.id).locked) return;
      const val = explInput.value;
      if (val.trim()) quizState.explanations[q.id] = val;
      else delete quizState.explanations[q.id];
      renderPaperRuleBanner(q);
      updatePaletteItem(quizState.currentIndex);
      updatePaletteStats();
      doAutosave();
    });
    explWrap.append(explLabel, explInput);
    dom.optionsContainer.appendChild(explWrap);
  }
}

/**
 * Handle MCQ option selection
 */
function selectMCQOption(questionId, optionKey) {
  const access = QuizAttempts.questionAccess(attemptSnapshot(), questionId);
  if (access.locked) {
    renderQuestion(quizState.currentIndex);
    return false;
  }
  quizState.answers[questionId] = optionKey;
  quizState.skipped.delete(questionId);

  const curQ = quizState.questions[quizState.currentIndex];
  if (curQ && curQ.id === questionId) {
    renderQuestion(quizState.currentIndex);
  }

  // Update palette
  updatePaletteItem(quizState.currentIndex);
  updatePaletteStats();
  doAutosave();
  return true;
}

function clearMCQOption(questionId) {
  const access = QuizAttempts.questionAccess(attemptSnapshot(), questionId);
  if (access.locked) return false;
  delete quizState.answers[questionId];
  delete quizState.explanations[questionId];
  updatePaletteItem(quizState.currentIndex);
  updatePaletteStats();
  doAutosave();
  renderQuestion(quizState.currentIndex);
  return true;
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

  const access = QuizAttempts.questionAccess(attemptSnapshot(), q.id);

  // Restore saved answer
  dom.textAnswer.value = quizState.answers[q.id] || '';
  dom.textAnswer.disabled = access.locked;
  updateCharCount(dom.textAnswer.value.length);

  // Auto-resize
  autoResizeTextarea(dom.textAnswer);

  // Save on input
  dom.textAnswer.oninput = () => {
    if (QuizAttempts.questionAccess(attemptSnapshot(), q.id).locked) {
      dom.textAnswer.value = quizState.answers[q.id] || '';
      return;
    }
    const val = dom.textAnswer.value;
    if (val.trim()) {
      quizState.answers[q.id] = val;
      quizState.skipped.delete(q.id);
    } else {
      delete quizState.answers[q.id];
    }
    updateCharCount(val.length);
    autoResizeTextarea(dom.textAnswer);
    renderPaperRuleBanner(q);
    updatePaletteItem(quizState.currentIndex);
    updatePaletteStats();
    doAutosave();
  };

  if (!access.locked) dom.textAnswer.focus();
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
  if (!q) return;
  if (q.type === 'mcq') {
    const explEl = document.getElementById(`mcq-expl-${q.id}`);
    if (explEl && !explEl.disabled) {
      if (explEl.value.trim()) quizState.explanations[q.id] = explEl.value;
      else delete quizState.explanations[q.id];
    }
    return;
  }
  if (dom.textAnswer && !dom.textAnswer.disabled) {
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

function isQuestionAttempted(qid) {
  return QuizAttempts.hasAnswer(quizState.answers[qid]) || QuizAttempts.hasAnswer(quizState.explanations[qid]);
}

function countAttemptedQuestions() {
  return quizState.questions.filter(q => isQuestionAttempted(q.id)).length;
}

function updatePaletteItem(index) {
  if (!dom.questionPalette) return;
  const btn = dom.questionPalette.querySelector(`[data-index="${index}"]`);
  if (!btn) return;

  const q = quizState.questions[index];
  const isCurrent  = index === quizState.currentIndex;
  const isAnswered  = q && isQuestionAttempted(q.id);
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
  const answered = countAttemptedQuestions();
  const skipped  = quizState.skipped.size;
  const remaining = Math.max(0, total - answered - skipped);

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
  const answered = countAttemptedQuestions();
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
      if (quizState.config?.paper?.timedSection && quizState.sectionEndsAt) {
        const ts = quizState.config.paper.timedSection;
        const tsEl = document.getElementById('section-timer-status');
        if (Date.now() >= quizState.sectionEndsAt && !quizState.sectionExpiredHandled) {
          quizState.sectionExpiredHandled = true;
          quizState.lockedGroups.add(String(ts.groupId));
          doAutosave();
          renderQuestion(quizState.currentIndex);
          if (dom.timerToast) {
            dom.timerToast.textContent = `Group ${ts.groupId} ${ts.minutes}-minute window ended — Group B is now unlocked.`;
            showTimerToast();
          }
        } else if (tsEl && !quizState.lockedGroups.has(String(ts.groupId)) && Date.now() < quizState.sectionEndsAt) {
          const remSec = Math.max(0, Math.ceil((quizState.sectionEndsAt - Date.now()) / 1000));
          const mm = String(Math.floor(remSec / 60)).padStart(2, '0');
          const ss = String(remSec % 60).padStart(2, '0');
          tsEl.textContent = `Group ${ts.groupId} ${ts.minutes}-min window: ${mm}:${ss} remaining`;
        }
      }

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
    answers:quizState.answers,explanations:quizState.explanations,lockedGroups:[...quizState.lockedGroups],
    flags:quizState.flags,skipped:[...quizState.skipped],visited:[...quizState.visited],
    currentIndex:quizState.currentIndex,startedAt:quizState.startTime,endsAt:quizState.endsAt,
    sectionEndsAt:quizState.sectionEndsAt,
    remainingMs:quizState.endsAt ? Math.max(0,quizState.endsAt-Date.now()) : null,
    autosaveKey:quizState.autosaveKey,legacyKey:quizState.legacyKey,status:'active'};
}
function doAutosave() {
  if (quizState.submitted || !quizState.questions.length) return;
  saveCurrentTextAnswer();
  try {
    const saved = QuizAttempts.save(attemptSnapshot());
    quizState.answers = saved.answers;
    quizState.explanations = saved.explanations || {};
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
  const answered = countAttemptedQuestions();
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
