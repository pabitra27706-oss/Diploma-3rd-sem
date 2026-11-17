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
  result:          null,   // Loaded from StudyStorage.legacy quiz-result
  questions:       [],
  answers:         {},
  explanations:    {},
  config:          null,
  currentFilter:   'all',  // 'all' | 'answered' | 'unanswered'
  editingQuestionId: null, // ID of question being edited in modal
  editingField:    'answer'// 'answer' | 'explanation'
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

function inferSubjectCode(q) {
  if (q && q.subjectCode) return q.subjectCode;
  if (q && q.id) {
    const m = String(q.id).match(/^(CST\d{3})-/);
    if (m) return m[1];
  }
  const cfgSubj = reviewState.config && reviewState.config.subject;
  return cfgSubj && cfgSubj !== 'all' ? cfgSubj : '';
}

function shortSubjectName(code) {
  if (code && typeof window !== 'undefined' && typeof window.subjectLabel === 'function') {
    return window.subjectLabel(code);
  }
  return 'Quiz';
}

function buildReviewDeepLink(q) {
  const url = new URL('review.html', window.location.href);
  url.hash = '';
  const p = new URLSearchParams();
  const hid = getParam('historyId') || (reviewState.result && reviewState.result.id);
  if (hid) p.set('historyId', hid);
  if (q && q.id) p.set('q', q.id);
  url.search = p.toString();
  return url.href;
}

function buildCanonicalPaperLink(q) {
  if (!q || !q.id) return null;
  const m = String(q.id).match(/^(CST\d{3})-(P\d{3})-Q\d+$/);
  if (!m) return null;
  const url = new URL('../pyq/answers.html', window.location.href);
  url.hash = '';
  const fileName = reviewState.config && reviewState.config.paper && reviewState.config.paper.fileName;
  const paperId = fileName ? fileName.replace(/\.json$/, '') : '';
  if (paperId && paperId.startsWith(`${m[1]}-${m[2]}`)) {
    url.search = new URLSearchParams({ paper: paperId, q: q.id }).toString();
  } else {
    url.search = new URLSearchParams({ subject: m[1], paper: m[2], q: q.id }).toString();
  }
  return url.href;
}

function buildReviewShareBar(q, index) {
  const bar = createElement('div', 'question-share');
  const code = inferSubjectCode(q);
  const shortName = shortSubjectName(code);
  const cleanStem = String(q.question || '').replace(/\s+/g, ' ').trim();
  const localUrl = buildReviewDeepLink(q);
  const paperUrl = buildCanonicalPaperLink(q);
  const shareUrl = paperUrl || localUrl;
  const shareTitle = `${shortName} · Q${index + 1} Review`;
  const shareText = paperUrl
    ? `${shortName}: ${cleanStem.slice(0, 120)}`
    : `${shortName} (opens on the device storing this quiz attempt): ${cleanStem.slice(0, 110)}`;

  const copyBtn = createElement('button', 'copy-question-link', 'Copy review link (this device)');
  copyBtn.type = 'button';

  const shareBtn = createElement(
    'button',
    'share-question-link',
    paperUrl ? 'Share question' : 'Share review link (this device)'
  );
  shareBtn.type = 'button';

  const statusEl = createElement('span', 'share-status');
  statusEl.setAttribute('role', 'status');
  statusEl.setAttribute('aria-live', 'polite');

  copyBtn.addEventListener('click', () => {
    window.StudyShare.copy(localUrl, {
      button: copyBtn,
      container: bar,
      statusEl: statusEl,
      inputLabel: 'Quiz review link (this device) — select and copy'
    });
  });

  shareBtn.addEventListener('click', () => {
    window.StudyShare.share(
      { title: shareTitle, text: shareText, url: shareUrl },
      {
        button: shareBtn,
        copyButton: copyBtn,
        container: bar,
        statusEl: statusEl,
        inputLabel: paperUrl
          ? 'Canonical paper question link — select and copy'
          : 'Quiz review link (this device) — select and copy'
      }
    );
  });

  bar.appendChild(copyBtn);
  bar.appendChild(shareBtn);
  if (paperUrl) {
    const openPaper = createElement('a', 'open-paper-link', `Open in ${shortName} paper`);
    openPaper.href = paperUrl;
    bar.appendChild(openPaper);
  }
  bar.appendChild(statusEl);
  const scopeNote = createElement(
    'p',
    '',
    paperUrl
      ? 'Review links reopen this attempt on this device; Share question uses the public archive link without your answers.'
      : 'Quiz attempts stay in browser storage on this device; review links carry no personal answers.'
  );
  bar.appendChild(scopeNote);
  return bar;
}

function loadReviewData() {
  const historyId = getParam('historyId');
  const result = historyId ? QuizAttempts.historyEntry(historyId) : QuizAttempts.current();

  if (!result || !result.questions || result.questions.length === 0) {
    showNoData();
    return;
  }

  // Only show review for All Types mode
  // If MCQ mode landed here redirect to result (preserving deep-link query params)
  if (result.config && result.config.mode === 'mcq') {
    window.location.href = `result.html${window.location.search || ''}`;
    return;
  }

  reviewState.result       = result;
  reviewState.questions    = result.questions || [];
  reviewState.answers      = result.answers   || {};
  reviewState.explanations = result.explanations || {};
  reviewState.config       = result.config    || {};

  hideEl(dom.loadingState);
  showEl(dom.reviewMain);

  renderPageHeader();
  renderPaperSummaryNote();
  renderInfoBanner();
  renderQuestionList();
  const targetId = getParam('q');
  if (targetId) {
    const targetIdx = reviewState.questions.findIndex(item => item.id === targetId);
    const target = [...document.querySelectorAll('[data-question-id]')].find(el => el.dataset.questionId === targetId);
    if (target) {
      if (window.StudyShare && typeof window.StudyShare.highlight === 'function') {
        window.StudyShare.highlight(target);
      } else {
        target.tabIndex = -1;
        target.focus();
        target.scrollIntoView({ block: 'center' });
      }
      if (targetIdx >= 0) {
        const tq = reviewState.questions[targetIdx];
        const shortName = shortSubjectName(inferSubjectCode(tq));
        const cleanStem = String(tq.question || '').replace(/\s+/g, ' ').trim();
        document.title = `${shortName} · Q${targetIdx + 1} — ${cleanStem.slice(0, 60)}`;
      }
    } else {
      const note = document.createElement('p');
      note.className = 'deeplink-notice';
      note.textContent = 'Requested question is not in this local quiz attempt; showing the saved review.';
      note.setAttribute('role', 'status');
      dom.reviewMain.prepend(note);
    }
  }
  buildPalettePanel();
  bindEvents();
  updateRetryLink();
}

function showNoData() {
  hideEl(dom.loadingState);
  showEl(dom.noDataState);
  const targetId = getParam('q');
  if (targetId && dom.noDataState && !dom.noDataState.querySelector('.deeplink-notice')) {
    const note = document.createElement('p');
    note.className = 'deeplink-notice';
    note.setAttribute('role', 'status');
    note.textContent = 'Quiz review links open attempts stored locally on the device where the quiz was taken. No matching local attempt was found here.';
    const m = String(targetId).match(/^(CST\d{3})-(P\d{3})-Q\d+$/);
    if (m) {
      note.appendChild(document.createTextNode(' '));
      const link = document.createElement('a');
      const url = new URL('../pyq/answers.html', window.location.href);
      url.search = new URLSearchParams({ subject: m[1], paper: m[2], q: targetId }).toString();
      link.href = url.href;
      link.textContent = `Open this ${shortSubjectName(m[1])} question in PYQ Answers`;
      note.appendChild(link);
    }
    dom.noDataState.appendChild(note);
  }
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
    const answeredCount = questions.filter(q => QuizAttempts.hasAnswer(answers[q.id]) || QuizAttempts.hasAnswer(reviewState.explanations[q.id])).length;
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

function renderPaperSummaryNote() {
  if (!reviewState.config?.paper) return;
  let note = document.getElementById('paper-review-summary');
  if (!note) {
    note = document.createElement('section');
    note.id = 'paper-review-summary';
    note.setAttribute('role', 'status');
    note.style.cssText = 'margin:0 0 1rem;padding:0.85rem 1rem;border-radius:10px;border:1px solid var(--border,var(--c-slate-300));';
    dom.reviewMain.prepend(note);
  }
  note.replaceChildren();
  const a = QuizAttempts.score(reviewState.questions, reviewState.answers);
  const ps = QuizAttempts.paperSummary({
    ...reviewState.result,
    config: reviewState.config,
    questions: reviewState.questions,
    answers: reviewState.answers,
    explanations: reviewState.explanations
  });
  const lead = document.createElement('p');
  lead.style.margin = '0 0 0.35rem';
  const optPart = ps && ps.optionMarksMax > 0
    ? ` · Verified MCQ option marks (within section quotas): ${ps.optionMarksEarned} / ${ps.optionMarksMax}`
    : '';
  const explPart = ps && ps.explanationMarksPending > 0
    ? ` · Written 1-mark MCQ explanations: ${ps.explanationWrittenCount} written (${ps.explanationMarksPending} marks pending manual self-review)`
    : '';
  lead.textContent = `Keyed MCQs: ${a.correct} correct, ${a.incorrect} wrong, ${a.unanswered} unanswered${optPart}${explPart}. Printed paper maximum ${reviewState.config.paper.fullMarks}; subjective and explanation components require manual review, so there is no automatic overall grade.`;
  note.appendChild(lead);

  if (ps && ps.rules.length) {
    const quotaText = ps.rules.map(r => `${r.label}: ${r.answeredCount}/${r.answerAny}`).join(' · ');
    const quotas = document.createElement('p');
    quotas.style.cssText = 'margin:0.25rem 0 0;font-size:0.88rem;';
    quotas.textContent = `Section quotas: ${quotaText}.`;
    note.appendChild(quotas);
  }
  if (ps && ps.hasPatternMismatch) {
    const mismatch = document.createElement('p');
    mismatch.style.cssText = 'margin:0.25rem 0 0;font-size:0.86rem;';
    mismatch.textContent = Number(ps.printedMax) !== 60
      ? `Historical paper pattern notice: printed maximum (${ps.printedMax}) differs from the current 60-mark ESE syllabus pattern.`
      : `Choice-paper total notice: all set questions sum to ${ps.setMarks} marks while printed maximum after answer-any choices is ${ps.printedMax} marks.`;
    note.appendChild(mismatch);
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
  // Flush any pending note drafts before the cards are rebuilt.
  window.SectionNotes?.flush();
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
  const hasAny = id => QuizAttempts.hasAnswer(reviewState.answers[id]) || QuizAttempts.hasAnswer(reviewState.explanations[id]);
  switch (reviewState.currentFilter) {
    case 'answered':
      return reviewState.questions.filter(q => hasAny(q.id));
    case 'unanswered':
      return reviewState.questions.filter(q => !hasAny(q.id));
    default:
      return reviewState.questions;
  }
}

/* ── Build Single Question Card ─────────────────────────────── */
function buildQuestionCard(q, displayNum) {
  const userAnswer  = reviewState.answers[q.id] || '';
  const userExpl    = reviewState.explanations[q.id] || '';
  const hasAnswer   = userAnswer.trim().length > 0 || userExpl.trim().length > 0;
  const isMCQ       = q.type === 'mcq';

  const card = createElement('div', `review-question-card ${hasAnswer ? '' : 'unanswered'}`);
  card.id = `review-q-${q.id}`;
  card.setAttribute('data-question-id', q.id);

  // ── Header
  const header = buildCardHeader(q, displayNum, hasAnswer, isMCQ);
  card.appendChild(header);
  const copyLink=document.createElement('button');copyLink.type='button';copyLink.textContent='Copy review link (this device)';
  copyLink.onclick=async()=>{const url=new URL(location.href);url.search=new URLSearchParams({historyId:reviewState.result?.historyId || getParam('historyId') || '',q:q.id}).toString();try{await navigator.clipboard.writeText(url.href);copyLink.textContent='Review link copied';}catch{const field=document.createElement('input');field.value=url.href;field.setAttribute('aria-label','Review link — select and copy');card.append(field);field.focus();field.select();}};
  card.append(copyLink);


  // ── Body
  const body = document.createElement('div');
  body.className = 'review-q-body';

  // Tags row
  const tagsRow = buildTagsRow(q);
  if (tagsRow) body.appendChild(tagsRow);

  // Question text
  const qText = createElement('p', 'review-q-text', q.question);
  body.appendChild(qText);

  if (q.sourcePage) body.appendChild(createElement('p','text-secondary',`Source: ${q.sourcePage}`));

  // Answer display
  if (isMCQ) {
    const optionsEl = buildMCQOptionsReview(q, userAnswer);
    body.appendChild(optionsEl);
    if (q.explanationMarks > 0) {
      const explBox = buildTextAnswerBox(q, userExpl, userExpl.trim().length > 0, 'explanation', 'Your 1-mark Explanation (manual self-review)');
      body.appendChild(explBox);
    }
    if (q.explanation) {
      const modelBox = buildModelAnswerBox({ id: `${q.id}-expl`, modelAnswer: q.explanation }, '📖 Supplied Answer Explanation');
      body.appendChild(modelBox);
    }
  } else {
    const answerBox = buildTextAnswerBox(q, userAnswer, hasAnswer);
    body.appendChild(answerBox);

    body.appendChild(createElement('p', 'badge badge-neutral', q.modelAnswer ? 'Supplied model answer — self-review only' : 'No key — not graded'));

    // Model answer (collapsible)
    if (q.modelAnswer) {
      const modelBox = buildModelAnswerBox(q);
      body.appendChild(modelBox);
    }
  }

  // Share & canonical deep-link controls
  body.appendChild(buildReviewShareBar(q, Math.max(0, displayNum - 1)));

  card.appendChild(body);

  // ── Private note for this question (Phase 6.4)
  if (window.SectionNotes) {
    const note = SectionNotes.mount({
      key: SectionNotes.keyFor(`quiz-review/${q.id}`),
      title: 'My note for this question'
    });
    note.classList.add('question-note');
    card.appendChild(note);
  }

  // ── Footer
  const footer = buildCardFooter(q, hasAnswer, isMCQ, Math.max(0, displayNum - 1));
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
    const isCorrect = Boolean(q.correct && key === q.correct);
    const option = createElement('div',
      `review-option${isSelected ? ' selected' : ''}${isCorrect ? ' correct' : ''}`
    );

    const label = createElement('span', 'review-option-label', key);
    const textEl = createElement('span', 'review-option-text', text);

    option.appendChild(label);
    option.appendChild(textEl);

    if (isSelected && isCorrect) {
      option.appendChild(createElement('span', 'review-option-check', '✓ Correct'));
    } else if (isSelected) {
      option.appendChild(createElement('span', 'review-option-check', '✗ Your choice'));
    } else if (isCorrect) {
      option.appendChild(createElement('span', 'review-option-check', '✓ Key'));
    }

    container.appendChild(option);
  });

  return container;
}

/* ── Text Answer Box ─────────────────────────────────────────── */
function buildTextAnswerBox(q, userAnswer, hasAnswer, field = 'answer', titleLabel = 'Your Answer') {
  const box = createElement('div', 'review-answer-box');

  // Header
  const boxHeader = createElement('div', 'review-answer-box-header');
  const boxTitle  = createElement('span', 'review-answer-box-title', titleLabel);

  // Edit button
  const editBtn = createElement('button', 'btn-edit-answer');
  editBtn.innerHTML = '<span aria-hidden="true">✏️</span> Edit';
  editBtn.setAttribute('aria-label', `Edit ${field} for this question`);
  editBtn.addEventListener('click', () => openEditModal(q, field));

  boxHeader.appendChild(boxTitle);
  boxHeader.appendChild(editBtn);
  box.appendChild(boxHeader);

  // Answer content
  if (hasAnswer) {
    const isMono = q.type === 'program' && field === 'answer';
    const answerEl = createElement('div',
      `review-answer-text${isMono ? ' mono' : ''}`,
      userAnswer
    );
    box.appendChild(answerEl);
  } else {
    const emptyEl = createElement('p', 'review-answer-empty',
      `No ${field} provided. Click Edit to add one.`
    );
    box.appendChild(emptyEl);
  }

  return box;
}

/* ── Model Answer Box (collapsible) ─────────────────────────── */
function buildModelAnswerBox(q, headingText = '📖 Model Answer') {
  const box = createElement('div', 'review-model-answer');

  const modelHeader = createElement('div', 'review-model-header');
  const modelTitle  = createElement('span', 'review-model-title', headingText);

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
function buildCardFooter(q, hasAnswer, isMCQ, index) {
  const footer = createElement('div', 'review-q-footer');

  const left = createElement('div', 'review-q-footer-left');

  // Source info
  if (q.source) {
    left.appendChild(createElement('span', 'tag',
      q.source === 'PYQ' ? `📜 PYQ ${q.year || ''}` : '✨ Original'
    ));
  }

  // Human-readable subject label (internal ID remains on card data-question-id and URLs)
  const code = inferSubjectCode(q);
  if (code) {
    const label = shortSubjectName(code) + (q.unit ? ` · Unit ${q.unit}` : '');
    left.appendChild(createElement('span', 'text-xs text-secondary', label));
  }

  const right = createElement('div', 'review-q-footer-right');

  // Edit button for non-MCQ
  if (!isMCQ) {
    const editBtn = createElement('button', 'btn-edit-answer');
    editBtn.innerHTML = '<span aria-hidden="true">✏️</span> Edit Answer';
    editBtn.setAttribute('aria-label', 'Edit answer for this question');
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

function openEditModal(q, field = 'answer') {
  reviewState.editingQuestionId = q.id;
  reviewState.editingField = field;

  if (dom.editModalQuestion) {
    dom.editModalQuestion.textContent = q.question;
  }

  if (dom.editAnswerTextarea) {
    const current = field === 'explanation'
      ? (reviewState.explanations[q.id] || '')
      : (reviewState.answers[q.id] || '');
    dom.editAnswerTextarea.value = current;

    // Monospace for program
    if (q.type === 'program' && field === 'answer') {
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
  reviewState.editingField = 'answer';
}

function saveEditedAnswer() {
  const qId    = reviewState.editingQuestionId;
  const field  = reviewState.editingField || 'answer';
  const newVal = dom.editAnswerTextarea?.value || '';

  if (!qId) return;

  // Update state
  if (field === 'explanation') {
    if (newVal.trim()) reviewState.explanations[qId] = newVal;
    else delete reviewState.explanations[qId];
  } else {
    if (newVal.trim()) reviewState.answers[qId] = newVal;
    else delete reviewState.answers[qId];
  }

  try {
    const id = reviewState.result.historyId;
    if (id) reviewState.result = QuizAttempts.edit(id, reviewState.answers, reviewState.explanations);
    else {
      const validIds = reviewState.questions.map(q=>q.id);
      reviewState.result.answers = QuizAttempts.cleanAnswers(reviewState.answers, validIds);
      reviewState.result.explanations = QuizAttempts.cleanAnswers(reviewState.explanations, validIds);
      QuizAttempts.setCurrent(reviewState.result);
    }
  } catch (error) { alert('Edit could not be saved: '+error.message); return; }

  closeEditModal();

  // Re-render question card
  refreshQuestionCard(qId);

  // Update palette panel
  buildPalettePanel();

  // Update header stats & paper summary
  renderPageHeader();
  renderPaperSummaryNote();
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
  if (dom.btnRetryQuiz) dom.btnRetryQuiz.addEventListener('click', event => {
    event.preventDefault();
    try { const a=QuizAttempts.retry(reviewState.result); location.href=buildURL('play.html',{resume:a.autosaveKey}); }
    catch(error) { alert(error.message); }
  });
  document.querySelectorAll('a[href*="export.html"]').forEach(link => {
    link.href=buildURL('export.html',{historyId:reviewState.result.historyId || null});
  });
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