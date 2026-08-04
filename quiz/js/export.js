/* ============================================================
   quiz/js/export.js
   Export page: format selection, content generation, preview,
   download, copy, and full history management
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */

const exportState = {
  result:          null,     // from quiz-result
  questions:       [],
  answers:         {},
  config:          null,
  selectedFormat:  'md',     // 'md' | 'txt' | 'json'
  generatedContent:'',
  filename:        '',
  activeTab:       'export', // 'export' | 'history'
  deletingEntryId: null      // for single delete modal
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
  loadExportData();
  renderHistoryList();
  bindEvents();

  // Check if we should open history tab directly
  const showTab = getParam('tab');
  if (showTab === 'history') {
    switchTab('history');
  }
});

function cacheDOMRefs() {
  dom = {
    // Tabs
    tabExport:          qs('#tab-export'),
    tabHistory:         qs('#tab-history'),
    panelExport:        qs('#panel-export'),
    panelHistory:       qs('#panel-history'),

    // Export
    exportEmptyState:   qs('#export-empty-state'),
    exportContent:      qs('#export-content'),
    exportSummaryGrid:  qs('#export-summary-grid'),
    filenamePreview:    qs('#filename-preview'),
    exportPreviewContent: qs('#export-preview-content'),
    btnCopyExport:      qs('#btn-copy-export'),
    btnDownloadExport:  qs('#btn-download-export'),
    copyToast:          qs('#copy-toast'),

    // Format radios
    formatRadios:       qsa('input[name="format"]'),

    // History
    historyCount:       qs('#history-count'),
    historyEmptyState:  qs('#history-empty-state'),
    historyFullList:    qs('#history-full-list'),
    btnClearHistory:    qs('#btn-clear-history'),

    // Clear history modal
    clearModalOverlay:  qs('#clear-modal-overlay'),
    closeClearModal:    qs('#close-clear-modal'),
    btnCancelClear:     qs('#btn-cancel-clear'),
    btnConfirmClear:    qs('#btn-confirm-clear'),

    // Delete single modal
    deleteModalOverlay: qs('#delete-modal-overlay'),
    closeDeleteModal:   qs('#close-delete-modal'),
    btnCancelDelete:    qs('#btn-cancel-delete'),
    btnConfirmDelete:   qs('#btn-confirm-delete')
  };
}

/* ══════════════════════════════════════════════════════════════
   DATA LOADING
══════════════════════════════════════════════════════════════ */

function loadExportData() {
  const result = getFromStorage('quiz-result');

  if (!result || !result.questions || result.questions.length === 0) {
    showEl(dom.exportEmptyState);
    hideEl(dom.exportContent);
    return;
  }

  exportState.result    = result;
  exportState.questions = result.questions || [];
  exportState.answers   = result.answers   || {};
  exportState.config    = result.config    || {};

  hideEl(dom.exportEmptyState);
  showEl(dom.exportContent);

  renderSummary();
  updateExportPreview();
}

/* ══════════════════════════════════════════════════════════════
   TABS
══════════════════════════════════════════════════════════════ */

function switchTab(tab) {
  exportState.activeTab = tab;

  // Update tab buttons
  const tabs = [
    { btn: dom.tabExport,  panel: dom.panelExport,  key: 'export' },
    { btn: dom.tabHistory, panel: dom.panelHistory, key: 'history' }
  ];

  tabs.forEach(t => {
    const isActive = t.key === tab;
    if (t.btn) {
      t.btn.classList.toggle('active', isActive);
      t.btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
    if (t.panel) {
      if (isActive) {
        showEl(t.panel);
      } else {
        hideEl(t.panel);
      }
    }
  });

  if (tab === 'history') {
    renderHistoryList();
  }
}

/* ══════════════════════════════════════════════════════════════
   EXPORT SUMMARY
══════════════════════════════════════════════════════════════ */

function renderSummary() {
  if (!dom.exportSummaryGrid || !exportState.config) return;

  const cfg  = exportState.config;
  const res  = exportState.result;
  const qs2  = exportState.questions;

  const subjectName = getSubjectName(cfg.subject || 'all');
  const unitLabel   = !cfg.unit || cfg.unit === 'all'
    ? 'All Units'
    : Array.isArray(cfg.unit)
      ? cfg.unit.map(u => getUnitTitle(cfg.subject, u)).join(', ')
      : getUnitTitle(cfg.subject, cfg.unit);
  const modeLabel   = cfg.mode === 'mcq' ? 'MCQ Only' : 'All Types';
  const dateStr     = formatDate(res.completedAt || Date.now());
  const totalMarks  = qs2.reduce((s, q) => s + (q.marks || 0), 0);

  let scoreText = '—';
  if (cfg.mode === 'mcq' && res.score !== undefined && res.score !== null) {
    scoreText = `${res.score}/${res.total} (${res.percentage || 0}%)`;
  }

  const items = [
    { label: 'Subject',        value: subjectName },
    { label: 'Unit',           value: unitLabel },
    { label: 'Mode',           value: modeLabel, accent: true },
    { label: 'Questions',      value: qs2.length },
    { label: 'Total Marks',    value: totalMarks },
    { label: 'Score',          value: scoreText, accent: cfg.mode === 'mcq' },
    { label: 'Date',           value: dateStr },
    { label: 'Difficulty',     value: cfg.difficulty ? capitalise(cfg.difficulty) : 'Mixed' },
    { label: 'Source',         value: cfg.source ? capitalise(cfg.source) : 'All' }
  ];

  dom.exportSummaryGrid.innerHTML = items.map(item =>
    `<div class="export-summary-item">
      <span class="export-summary-label">${item.label}</span>
      <span class="export-summary-value${item.accent ? ' accent' : ''}">${item.value}</span>
    </div>`
  ).join('');
}

function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ══════════════════════════════════════════════════════════════
   EXPORT PREVIEW & GENERATION
══════════════════════════════════════════════════════════════ */

function updateExportPreview() {
  if (!exportState.result) return;

  const format = exportState.selectedFormat;
  const cfg    = exportState.config;
  const data   = {
    subject:   cfg.subject    || 'all',
    unit:      cfg.unit       || 'all',
    mode:      cfg.mode       || 'mcq',
    questions: exportState.questions,
    answers:   exportState.answers,
    score:     exportState.result.score,
    total:     exportState.result.total,
    totalMarks:exportState.questions.reduce((s, q) => s + (q.marks || 0), 0),
    metadata:  {
      date: exportState.result.completedAt || Date.now()
    }
  };

  // Generate content
  const content = generateExport(format, data);
  exportState.generatedContent = content;

  // Generate filename
  const filename = generateFilename({
    subject: cfg.subject || 'all',
    unit:    Array.isArray(cfg.unit) ? cfg.unit.join('-') : (cfg.unit || 'all'),
    mode:    cfg.mode    || 'mcq',
    count:   exportState.questions.length,
    format:  format
  });
  exportState.filename = filename;

  // Render filename
  if (dom.filenamePreview) {
    dom.filenamePreview.innerHTML = `
      <span class="filename-label">Filename:</span>
      <span class="filename-value">${filename}</span>
    `;
  }

  // Render preview content
  if (dom.exportPreviewContent) {
    // For long content, truncate in preview
    const maxPreview = 5000;
    let preview = content;
    if (preview.length > maxPreview) {
      preview = preview.substring(0, maxPreview) + '\n\n... (truncated preview — full content in download)';
    }
    dom.exportPreviewContent.textContent = preview;
  }
}

/* ══════════════════════════════════════════════════════════════
   DOWNLOAD & COPY
══════════════════════════════════════════════════════════════ */

function doDownload() {
  if (!exportState.generatedContent || !exportState.filename) return;
  downloadFile(exportState.filename, exportState.generatedContent);
}

async function doCopy() {
  if (!exportState.generatedContent) return;

  try {
    await navigator.clipboard.writeText(exportState.generatedContent);
    showCopyToast();
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = exportState.generatedContent;
    textarea.style.position = 'fixed';
    textarea.style.opacity  = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopyToast();
    } catch (e) {
      alert('Copy failed. Please select the text manually.');
    }
    document.body.removeChild(textarea);
  }
}

function showCopyToast() {
  if (!dom.copyToast) return;
  showEl(dom.copyToast);
  setTimeout(() => hideEl(dom.copyToast), 2500);
}

/* ══════════════════════════════════════════════════════════════
   HISTORY LIST
══════════════════════════════════════════════════════════════ */

function renderHistoryList() {
  const history = getHistory();

  // Count
  if (dom.historyCount) {
    dom.historyCount.textContent =
      `${history.length} quiz${history.length !== 1 ? 'zes' : ''}`;
  }

  if (!dom.historyFullList) return;
  dom.historyFullList.innerHTML = '';

  if (history.length === 0) {
    showEl(dom.historyEmptyState);
    return;
  }

  hideEl(dom.historyEmptyState);

  history.forEach(entry => {
    const card = buildHistoryCard(entry);
    dom.historyFullList.appendChild(card);
  });
}

/**
 * Build a single history card element
 */
function buildHistoryCard(entry) {
  const card = createElement('div', 'history-card');
  card.id = `hist-${entry.historyId}`;

  const subjectName = getSubjectName(entry.subject || 'all');
  const unitLabel   = !entry.unit || entry.unit === 'all'
    ? 'All Units'
    : Array.isArray(entry.unit)
      ? entry.unit.map(u => `U${u}`).join(', ')
      : getUnitTitle(entry.subject, entry.unit);
  const dateStr = formatDateTime(entry.completedAt);
  const icon    = entry.mode === 'mcq' ? '⚡' : '📝';
  const modeLabel = entry.mode === 'mcq' ? 'MCQ' : 'All Types';

  // Score info
  let scoreHTML = '';
  let scoreBadge = '';
  if (entry.mode === 'mcq' && entry.score !== undefined && entry.score !== null) {
    const pct = entry.percentage || (entry.total ? Math.round((entry.score / entry.total) * 100) : 0);
    const grade = getHistoryGrade(pct);

    scoreBadge = `<span class="history-score-badge ${grade.cls}">
      ${entry.score}/${entry.total} · ${pct}%
    </span>`;

    scoreHTML = `
      <div class="history-stat">
        <span class="history-stat-value green">${entry.score}</span>
        <span class="history-stat-label">Correct</span>
      </div>
      <div class="history-stat">
        <span class="history-stat-value accent">${entry.total}</span>
        <span class="history-stat-label">Total</span>
      </div>
      <div class="history-stat">
        <span class="history-stat-value gray">${pct}%</span>
        <span class="history-stat-label">Score</span>
      </div>
    `;
  } else {
    scoreBadge = '<span class="history-score-badge good">AI Eval</span>';
    const totalQs = entry.questionIds ? entry.questionIds.length : '?';
    scoreHTML = `
      <div class="history-stat">
        <span class="history-stat-value accent">${totalQs}</span>
        <span class="history-stat-label">Questions</span>
      </div>
    `;
  }

  // Time
  let timeHTML = '';
  if (entry.elapsed) {
    const m = Math.floor(entry.elapsed / 60);
    const s = entry.elapsed % 60;
    const timeStr = m > 0 ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`;
    timeHTML = `
      <div class="history-stat">
        <span class="history-stat-value gray">${timeStr}</span>
        <span class="history-stat-label">Time</span>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="history-card-header">
      <div class="history-card-header-left">
        <div class="history-card-icon" aria-hidden="true">${icon}</div>
        <div class="history-card-info">
          <span class="history-card-title">${subjectName}</span>
          <span class="history-card-meta">
            ${unitLabel} · ${modeLabel} · ${dateStr}
          </span>
        </div>
      </div>
      <div class="history-card-header-right">
        ${scoreBadge}
      </div>
    </div>
    <div class="history-card-body">
      <div class="history-card-stats">
        ${scoreHTML}
        ${timeHTML}
      </div>
    </div>
    <div class="history-card-footer">
      <a
        href="result.html?historyId=${entry.historyId}"
        class="btn btn-secondary btn-sm"
        aria-label="View result for ${subjectName}"
      >
        👁️ View
      </a>
      <div class="retry-dropdown" data-history-id="${entry.historyId}">
        <button
          class="btn btn-outline btn-sm retry-trigger"
          aria-label="Retry options"
          aria-expanded="false"
          aria-haspopup="true"
        >
          🔄 Retry ▾
        </button>
        <div class="retry-menu" role="menu">
          <button
            class="retry-menu-item"
            data-retry="reshuffled"
            role="menuitem"
          >
            <span>🔀</span> Reshuffled
          </button>
          <button
            class="retry-menu-item"
            data-retry="fresh"
            role="menuitem"
          >
            <span>✨</span> Fresh Similar
          </button>
        </div>
      </div>
      <button
        class="btn btn-danger btn-sm btn-delete-entry"
        data-delete-id="${entry.historyId}"
        aria-label="Delete this quiz from history"
      >
        🗑️
      </button>
    </div>
  `;

  return card;
}

/**
 * Get grade class from percentage (for history badges)
 */
function getHistoryGrade(pct) {
  if (pct >= 80) return { cls: 'excellent' };
  if (pct >= 60) return { cls: 'good' };
  if (pct >= 40) return { cls: 'average' };
  return { cls: 'poor' };
}

/* ══════════════════════════════════════════════════════════════
   RETRY LOGIC
══════════════════════════════════════════════════════════════ */

function handleRetry(historyId, type) {
  const entry = getHistoryEntry(historyId);
  if (!entry) return;

  const params = {
    subject:    entry.subject || 'all',
    unit:       Array.isArray(entry.unit) ? entry.unit.join(',') : (entry.unit || 'all'),
    mode:       entry.mode   || 'mcq',
    count:      entry.total  || 10,
    difficulty: 'mixed',
    source:     'all',
    order:      'random',
    balance:    'random',
    timer:      '1',
    timerMins:  10,
    types:      '',
    marks:      '',
    year:       ''
  };

  if (type === 'reshuffled') {
    // Same question count and settings, reshuffled
    params.order = 'random';
  } else if (type === 'fresh') {
    // Fresh set of similar questions
    params.order   = 'random';
    params.balance = 'random';
  }

  window.location.href = buildURL('play.html', params);
}

/* ══════════════════════════════════════════════════════════════
   CLEAR HISTORY
══════════════════════════════════════════════════════════════ */

function openClearModal() {
  dom.clearModalOverlay?.classList.add('open');
}

function closeClearModal() {
  dom.clearModalOverlay?.classList.remove('open');
}

function confirmClearHistory() {
  clearHistory();
  closeClearModal();
  renderHistoryList();
}

/* ══════════════════════════════════════════════════════════════
   DELETE SINGLE ENTRY
══════════════════════════════════════════════════════════════ */

function openDeleteModal(entryId) {
  exportState.deletingEntryId = entryId;
  dom.deleteModalOverlay?.classList.add('open');
}

function closeDeleteModal() {
  dom.deleteModalOverlay?.classList.remove('open');
  exportState.deletingEntryId = null;
}

function confirmDeleteEntry() {
  if (exportState.deletingEntryId) {
    deleteHistoryEntry(exportState.deletingEntryId);

    // Remove card from DOM for smooth UX
    const card = qs(`#hist-${exportState.deletingEntryId}`);
    if (card) {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity    = '0';
      card.style.transform  = 'translateX(-20px)';
      setTimeout(() => {
        card.remove();
        updateHistoryCount();
        checkHistoryEmpty();
      }, 300);
    } else {
      renderHistoryList();
    }
  }
  closeDeleteModal();
}

function updateHistoryCount() {
  const history = getHistory();
  if (dom.historyCount) {
    dom.historyCount.textContent =
      `${history.length} quiz${history.length !== 1 ? 'zes' : ''}`;
  }
}

function checkHistoryEmpty() {
  const history = getHistory();
  if (history.length === 0) {
    showEl(dom.historyEmptyState);
  }
}

/* ══════════════════════════════════════════════════════════════
   EVENT BINDING
══════════════════════════════════════════════════════════════ */

function bindEvents() {
  // Tab switching
  dom.tabExport?.addEventListener('click', () => switchTab('export'));
  dom.tabHistory?.addEventListener('click', () => switchTab('history'));

  // Format radios
  dom.formatRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      exportState.selectedFormat = radio.value;
      updateExportPreview();
    });
  });

  // Download
  dom.btnDownloadExport?.addEventListener('click', doDownload);

  // Copy
  dom.btnCopyExport?.addEventListener('click', doCopy);

  // Clear history
  dom.btnClearHistory?.addEventListener('click', openClearModal);
  dom.closeClearModal?.addEventListener('click', closeClearModal);
  dom.btnCancelClear?.addEventListener('click', closeClearModal);
  dom.btnConfirmClear?.addEventListener('click', confirmClearHistory);
  dom.clearModalOverlay?.addEventListener('click', e => {
    if (e.target === dom.clearModalOverlay) closeClearModal();
  });

  // Delete single entry
  dom.closeDeleteModal?.addEventListener('click', closeDeleteModal);
  dom.btnCancelDelete?.addEventListener('click', closeDeleteModal);
  dom.btnConfirmDelete?.addEventListener('click', confirmDeleteEntry);
  dom.deleteModalOverlay?.addEventListener('click', e => {
    if (e.target === dom.deleteModalOverlay) closeDeleteModal();
  });

  // Delegate: delete buttons in history list
  dom.historyFullList?.addEventListener('click', e => {
    const deleteBtn = e.target.closest('.btn-delete-entry');
    if (deleteBtn) {
      const id = deleteBtn.dataset.deleteId;
      if (id) openDeleteModal(id);
      return;
    }

    // Retry trigger toggle
    const retryTrigger = e.target.closest('.retry-trigger');
    if (retryTrigger) {
      e.stopPropagation();
      const dropdown = retryTrigger.closest('.retry-dropdown');
      if (dropdown) {
        closeAllRetryMenus();
        dropdown.classList.toggle('open');
        retryTrigger.setAttribute('aria-expanded',
          dropdown.classList.contains('open') ? 'true' : 'false'
        );
      }
      return;
    }

    // Retry menu item
    const retryItem = e.target.closest('.retry-menu-item');
    if (retryItem) {
      const dropdown  = retryItem.closest('.retry-dropdown');
      const historyId = dropdown?.dataset.historyId;
      const retryType = retryItem.dataset.retry;
      if (historyId && retryType) {
        handleRetry(historyId, retryType);
      }
      return;
    }
  });

  // Close retry menus when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.retry-dropdown')) {
      closeAllRetryMenus();
    }
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeClearModal();
      closeDeleteModal();
      closeAllRetryMenus();
    }
  });
}

function closeAllRetryMenus() {
  document.querySelectorAll('.retry-dropdown.open').forEach(dd => {
    dd.classList.remove('open');
    const trigger = dd.querySelector('.retry-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}