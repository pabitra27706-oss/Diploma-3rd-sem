/**
 * Practice Hub — Dashboard Logic (Enhanced)
 * Chip-based filters, live count, animated UI, presets, roadmap
 */
'use strict';

/* ═══════════════════════════════ STATE */
const S = {
  all:       [],   // All questions from data
  filtered:  [],   // Current filtered set
  filters: {
    subjects:    ['all'],
    units:       ['all'],
    difficulty:  ['all'],
    type:        ['all'],
    marks:       ['all'],
    year:        ['all'],
    month:       ['all'],
    practiceDay: ['all'],
    topics:      [],
    paperCodes:  [],
    tags:        []
  },
  presets:   [],
  debounce:  null,
  totalCompletedAll: 0
};

const SUBJECTS = ['CST201','CST203','CST205','CST207','CST209'];
const NUMERIC   = new Set(['units','marks','year','practiceDay']);

/* ═══════════════════════════════ BOOT */
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await loadAllData();
  hideLoading();
  renderStats();
  renderRoadmapCards();
  initChipFilters();
  initDynamicDropdowns();
  initEventListeners();
  updateAll();
  loadPresetsFromStorage();
});

/* ═══════════════════════════════ THEME */
function initTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  syncThemeIcon(btn, saved);
  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncThemeIcon(btn, next);
  });
}
function syncThemeIcon(btn, theme) {
  btn.querySelector('use').setAttribute('href',
    `/assets/icons/sprite.svg#${theme === 'dark' ? 'sun' : 'moon'}`);
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

/* ═══════════════════════════════ DATA LOADING */
async function loadAllData() {
  const bar    = document.getElementById('load-bar');
  const status = document.getElementById('load-status');
  const total  = SUBJECTS.length;
  let loaded   = 0;

  for (const sub of SUBJECTS) {
    status.textContent = `Fetching ${sub}...`;
    try {
      const reg = await fetch(`/_data/${sub}/registry.json`).then(r => r.json());
      if (!reg.papers) { loaded++; continue; }

      for (const paper of reg.papers) {
        try {
          const data = await fetch(`/_data/${sub}/${paper.fileName}`).then(r => r.json());
          if (data.questions) {
            S.all.push(...data.questions.map(q => ({ ...q, subjectCode: sub })));
          }
        } catch (e) { console.warn('Paper error:', e.message); }
      }
    } catch (e) { console.warn('Registry error:', e.message); }

    loaded++;
    bar.style.width = `${Math.round((loaded / total) * 100)}%`;
    await tick(); // Let browser breathe
  }

  // Compute total completed across all sessions
  S.totalCompletedAll = computeTotalCompleted();
  S.filtered = [...S.all];
}

function tick() { return new Promise(r => setTimeout(r, 0)); }

function computeTotalCompleted() {
  const allIds = new Set(S.all.map(q => q.id));
  const done   = new Set();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('practice-session-')) continue;
    try {
      const sess = JSON.parse(localStorage.getItem(key));
      if (sess.completed) sess.completed.forEach(id => { if (allIds.has(id)) done.add(id); });
    } catch {}
  }
  return done.size;
}

function hideLoading() {
  const screen = document.getElementById('loading-screen');
  screen.style.opacity = '0';
  screen.style.transition = 'opacity 0.3s';
  setTimeout(() => {
    screen.remove();
    document.getElementById('main').hidden = false;
  }, 320);
}

/* ═══════════════════════════════ STATS */
function renderStats() {
  animateNumber('stat-total', S.all.length);
  animateNumber('stat-completed', S.totalCompletedAll);
  document.getElementById('total-count-header').textContent =
    `${S.all.length} questions loaded`;
}

function animateNumber(id, target) {
  const el  = document.getElementById(id);
  const dur  = 600;
  const start = Date.now();
  function step() {
    const p = Math.min((Date.now() - start) / dur, 1);
    el.textContent = Math.round(easeOut(p) * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ═══════════════════════════════ ROADMAP CARDS */
function renderRoadmapCards() {
  const grid = document.getElementById('day-cards-grid');
  grid.innerHTML = '';

  // Count per day
  const counts = {};
  for (let d = 1; d <= 10; d++) counts[d] = 0;
  S.all.forEach(q => { if (q.practiceDay >= 1 && q.practiceDay <= 10) counts[q.practiceDay]++; });

  let totalDone = 0, totalAll = 0;

  for (let day = 1; day <= 10; day++) {
    const count = counts[day] || 0;
    const prog  = getDayProgress(day);
    const doneCount = prog ? prog.completed.length : 0;
    const status = doneCount === 0 ? 'none' : doneCount >= count ? 'done' : 'active';

    totalAll  += count;
    totalDone += doneCount;

    const a = document.createElement('a');
    a.href  = `session.html?days=${day}`;
    a.className = `day-card${status === 'done' ? ' day-card--done' : status === 'active' ? ' day-card--active' : ''}`;
    a.setAttribute('role', 'listitem');
    a.setAttribute('aria-label', `Day ${day}: ${count} questions, ${status}`);

    let statusIcon = '';
    if (status === 'done') {
      statusIcon = `<span class="day-card__status-icon" aria-hidden="true">
        <svg class="icon"><use href="/assets/icons/sprite.svg#check"></use></svg></span>`;
    } else if (status === 'active') {
      statusIcon = `<span class="day-card__status-icon" aria-hidden="true">
        <svg class="icon"><use href="/assets/icons/sprite.svg#refresh"></use></svg></span>`;
    }

    a.innerHTML = `${statusIcon}
      <span class="day-card__day-num">${day}</span>
      <span class="day-card__label">Day</span>
      <span class="day-card__count">${count}Q</span>`;
    grid.appendChild(a);
  }

  // Overall roadmap progress
  const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
  document.getElementById('roadmap-pct').textContent = `${pct}%`;
  document.getElementById('roadmap-bar-fill').style.width = `${pct}%`;
}

function getDayProgress(day) {
  try {
    const raw = localStorage.getItem(`practice-day-${day}`);
    return raw ? JSON.parse(raw) : { completed: [] };
  } catch { return { completed: [] }; }
}

/* ═══════════════════════════════ CHIP FILTERS */
function initChipFilters() {
  document.getElementById('filter-form').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    const group = chip.dataset.group;
    const value = chip.dataset.value;
    const selector = `#chips-${group}`;

    toggleChip(chip, group, value, selector);
  });
}

function toggleChip(chip, group, value, selector) {
  const allChips = document.querySelectorAll(`${selector} .chip`);
  const stateKey = mapGroupToKey(group);

  if (value === 'all') {
    // Select "All": deactivate all others
    allChips.forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    S.filters[stateKey] = ['all'];
  } else {
    // Deactivate "All"
    const allBtn = document.querySelector(`${selector} .chip--all`);
    allBtn?.classList.remove('chip--active');

    // Toggle this chip
    const isActive = chip.classList.contains('chip--active');
    if (isActive) {
      chip.classList.remove('chip--active');
    } else {
      chip.classList.add('chip--active');
    }

    // Read all active
    const active = [...document.querySelectorAll(`${selector} .chip--active:not(.chip--all)`)]
      .map(c => NUMERIC.has(stateKey) ? Number(c.dataset.value) : c.dataset.value);

    if (active.length === 0) {
      // Fall back to "All"
      allBtn?.classList.add('chip--active');
      S.filters[stateKey] = ['all'];
    } else {
      S.filters[stateKey] = active;
    }
  }

  updateFilterGroupCount(group, stateKey);
  scheduleUpdate();
}

function mapGroupToKey(group) {
  const map = {
    subject: 'subjects', unit: 'units', difficulty: 'difficulty',
    type: 'type', marks: 'marks', year: 'year', month: 'month', day: 'practiceDay'
  };
  return map[group] || group;
}

function updateFilterGroupCount(group, key) {
  const el = document.getElementById(`fg-count-${group}`);
  if (!el) return;
  const vals = S.filters[key];
  el.textContent = vals.includes('all') ? 'All' : vals.join(', ');
}

/* ═══════════════════════════════ DYNAMIC DROPDOWNS */
function initDynamicDropdowns() {
  ['topic', 'paper', 'tags'].forEach(id => {
    const trigger = document.getElementById(`${id}-trigger`);
    const panel   = document.getElementById(`${id}-panel`);
    const search  = document.getElementById(`${id}-search`);

    // Open/close
    trigger.addEventListener('click', () => togglePanel(id));
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(id); }
    });

    // Search filter
    search?.addEventListener('input', () => filterDropdownOptions(id, search.value));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    ['topic','paper','tags'].forEach(id => {
      const wrap = document.getElementById(`${id}-wrapper`);
      if (wrap && !wrap.contains(e.target)) closePanel(id);
    });
  });
}

function togglePanel(id) {
  const panel   = document.getElementById(`${id}-panel`);
  const trigger = document.getElementById(`${id}-trigger`);
  const isOpen  = !panel.hidden;

  ['topic','paper','tags'].forEach(otherId => {
    if (otherId !== id) closePanel(otherId);
  });

  panel.hidden = isOpen;
  trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  if (!isOpen) {
    document.getElementById(`${id}-search`)?.focus();
    populateDropdown(id);
  }
}

function closePanel(id) {
  const panel   = document.getElementById(`${id}-panel`);
  const trigger = document.getElementById(`${id}-trigger`);
  if (panel)   panel.hidden = true;
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function populateAllDropdowns() {
  // Get base-filtered set (without dynamic selections applied)
  const base = applyFilters(S.all, { ...S.filters, topics: [], paperCodes: [], tags: [] });
  populateDropdown('topic', base);
  populateDropdown('paper', base);
  populateDropdown('tags',  base);
}

function populateDropdown(id, source) {
  source = source || applyFilters(S.all, { ...S.filters, topics: [], paperCodes: [], tags: [] });
  const listbox = document.getElementById(`${id}-listbox`);
  if (!listbox) return;

  let options = [];
  const keyMap = { topic: 'topics', paper: 'paperCodes', tags: 'tags' };
  const selKey = keyMap[id];

  if (id === 'topic') {
    options = [...new Set(source.map(q => q.topic).filter(Boolean))].sort();
  } else if (id === 'paper') {
    const map = new Map();
    source.forEach(q => {
      if (q.paperCode && !map.has(q.paperCode)) {
        map.set(q.paperCode, `${q.paperCode}${q.year ? ` — ${q.year} ${q.month || ''}`.trim() : ''}`);
      }
    });
    options = [...map.entries()].sort((a,b) => a[0].localeCompare(b[0]));
  } else if (id === 'tags') {
    const tagSet = new Set();
    source.forEach(q => { if (Array.isArray(q.tags)) q.tags.forEach(t => tagSet.add(t)); });
    options = [...tagSet].sort();
  }

  renderDropdownOptions(id, options, S.filters[selKey]);

  // Update trigger text
  const sel = S.filters[selKey];
  const trigText = document.getElementById(`${id}-trigger-text`);
  trigText.textContent = sel.length === 0
    ? `All ${id}s (dynamic)`
    : sel.length === 1 ? sel[0] : `${sel.length} selected`;

  // Update count badge
  const countEl = document.getElementById(`fg-count-${id}`);
  if (countEl) countEl.textContent = sel.length === 0 ? 'Dynamic' : `${sel.length} selected`;
}

function renderDropdownOptions(id, options, selected) {
  const listbox = document.getElementById(`${id}-listbox`);
  const keyMap  = { topic: 'topics', paper: 'paperCodes', tags: 'tags' };
  listbox.innerHTML = '';

  if (options.length === 0) {
    listbox.innerHTML = `<p class="dropdown-empty">No options for current filters</p>`;
    return;
  }

  options.forEach(opt => {
    const value  = Array.isArray(opt) ? opt[0] : opt;
    const label  = Array.isArray(opt) ? opt[1] : opt;
    const isSel  = selected.includes(value);

    const btn = document.createElement('button');
    btn.type  = 'button';
    btn.className = `dropdown-opt${isSel ? ' is-selected' : ''}`;
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', isSel ? 'true' : 'false');
    btn.setAttribute('data-value', value);
    btn.innerHTML = `<span class="opt-checkbox" aria-hidden="true"></span>${esc(label)}`;
    btn.addEventListener('click', () => toggleDropdownOption(id, value));
    listbox.appendChild(btn);
  });
}

function filterDropdownOptions(id, query) {
  const q    = query.toLowerCase();
  const opts = document.querySelectorAll(`#${id}-listbox .dropdown-opt`);
  opts.forEach(opt => {
    const match = opt.textContent.toLowerCase().includes(q);
    opt.style.display = match ? '' : 'none';
  });
}

function toggleDropdownOption(id, value) {
  const keyMap = { topic: 'topics', paper: 'paperCodes', tags: 'tags' };
  const key    = keyMap[id];
  const arr    = S.filters[key];
  const idx    = arr.indexOf(value);

  if (idx === -1) arr.push(value);
  else arr.splice(idx, 1);

  // Re-render this dropdown
  populateDropdown(id);
  // Render pills
  renderPills(id);
  scheduleUpdate();
}

function renderPills(id) {
  const keyMap  = { topic: 'topics', paper: 'paperCodes', tags: 'tags' };
  const key     = keyMap[id];
  const pills   = document.getElementById(`${id}-pills`);
  if (!pills) return;
  pills.innerHTML = '';

  S.filters[key].forEach(val => {
    const pill = document.createElement('span');
    pill.className = 'sel-pill';
    pill.innerHTML = `${esc(val)}<button class="sel-pill-remove" aria-label="Remove ${esc(val)}">
      <svg class="icon icon-sm" aria-hidden="true"><use href="/assets/icons/sprite.svg#close"></use></svg>
    </button>`;
    pill.querySelector('.sel-pill-remove').addEventListener('click', () => {
      toggleDropdownOption(id, val);
    });
    pills.appendChild(pill);
  });
}

/* ═══════════════════════════════ FILTER ENGINE */
function applyFilters(questions, filters) {
  let q = questions;

  if (!filters.subjects.includes('all')) {
    q = q.filter(item => filters.subjects.some(s =>
      item.subjectCode === s || (item.id && item.id.startsWith(s))
    ));
  }
  if (!filters.units.includes('all'))
    q = q.filter(item => filters.units.includes(Number(item.unit)));
  if (filters.topics.length > 0)
    q = q.filter(item => filters.topics.includes(item.topic));
  if (!filters.difficulty.includes('all'))
    q = q.filter(item => filters.difficulty.includes(item.difficulty));
  if (!filters.type.includes('all'))
    q = q.filter(item => filters.type.includes(item.type));
  if (!filters.marks.includes('all'))
    q = q.filter(item => filters.marks.includes(Number(item.marks)));
  if (!filters.year.includes('all'))
    q = q.filter(item => filters.year.includes(Number(item.year)));
  if (!filters.month.includes('all'))
    q = q.filter(item => filters.month.includes(item.month));
  if (filters.paperCodes.length > 0)
    q = q.filter(item => filters.paperCodes.includes(item.paperCode));
  if (!filters.practiceDay.includes('all'))
    q = q.filter(item => filters.practiceDay.includes(Number(item.practiceDay)));
  if (filters.tags.length > 0)
    q = q.filter(item => Array.isArray(item.tags) && item.tags.some(t => filters.tags.includes(t)));

  return q;
}

/* ═══════════════════════════════ UPDATE UI */
function scheduleUpdate() {
  clearTimeout(S.debounce);
  S.debounce = setTimeout(updateAll, 280);
}

function updateAll() {
  S.filtered = applyFilters(S.all, S.filters);
  updateLiveBanner();
  populateAllDropdowns();
  updateStartButton();
  updateStatMatched();
}

function updateLiveBanner() {
  const count = S.filtered.length;
  const total = S.all.length;
  const pct   = total > 0 ? (count / total) * 100 : 0;
  const banner = document.getElementById('live-count-banner');
  const numEl  = document.getElementById('live-count');
  const sub    = document.getElementById('live-count-sub');

  // Animate number bump
  numEl.classList.remove('bump');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      numEl.textContent = count.toLocaleString();
      numEl.classList.add('bump');
      setTimeout(() => numEl.classList.remove('bump'), 300);
    });
  });

  document.getElementById('live-count-bar').style.width = `${pct}%`;

  banner.classList.toggle('is-zero', count === 0);

  if (count === 0) {
    sub.textContent = 'No questions match — try fewer filters';
  } else if (count === total) {
    sub.textContent = 'Showing all questions — apply filters to narrow down';
  } else {
    const pctStr = Math.round(pct);
    sub.textContent = `${pctStr}% of total question bank`;
  }
}

function updateStatMatched() {
  const el = document.getElementById('stat-matched');
  if (el) el.textContent = S.filtered.length.toLocaleString();
}

function updateStartButton() {
  const btn   = document.getElementById('start-session');
  const badge = document.getElementById('btn-count-badge');
  const count = S.filtered.length;

  btn.disabled     = count === 0;
  badge.textContent = count.toLocaleString();
}

/* ═══════════════════════════════ RESET */
function resetAllFilters() {
  S.filters = {
    subjects: ['all'], units: ['all'], difficulty: ['all'],
    type: ['all'], marks: ['all'], year: ['all'], month: ['all'],
    practiceDay: ['all'], topics: [], paperCodes: [], tags: []
  };

  // Reset all chips to "All"
  document.querySelectorAll('.chip-selector').forEach(sel => {
    sel.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
    sel.querySelector('.chip--all')?.classList.add('chip--active');
  });

  // Reset filter group counts
  ['subject','unit','difficulty','type','marks','year','month','day'].forEach(g => {
    const el = document.getElementById(`fg-count-${g}`);
    if (el) el.textContent = 'All';
  });

  // Clear dynamic pills
  ['topic','paper','tags'].forEach(id => {
    renderPills(id);
    populateDropdown(id);
    document.getElementById(`${id}-search`).value = '';
  });

  updateAll();
  showToast('All filters reset');
}

/* ═══════════════════════════════ START SESSION */
function startSession() {
  if (S.filtered.length === 0) return;
  window.location.href = buildURL(S.filters);
}

function buildURL(filters) {
  const p = new URLSearchParams();
  if (!filters.subjects.includes('all'))    p.set('subjects',   filters.subjects.join(','));
  if (!filters.units.includes('all'))       p.set('units',      filters.units.join(','));
  if (filters.topics.length)               p.set('topics',     filters.topics.join(','));
  if (!filters.difficulty.includes('all')) p.set('difficulty', filters.difficulty.join(','));
  if (!filters.type.includes('all'))       p.set('type',       filters.type.join(','));
  if (!filters.marks.includes('all'))      p.set('marks',      filters.marks.join(','));
  if (!filters.year.includes('all'))       p.set('year',       filters.year.join(','));
  if (!filters.month.includes('all'))      p.set('month',      filters.month.join(','));
  if (filters.paperCodes.length)           p.set('papers',     filters.paperCodes.join(','));
  if (!filters.practiceDay.includes('all')) p.set('days',      filters.practiceDay.join(','));
  if (filters.tags.length)                 p.set('tags',       filters.tags.join(','));
  return `session.html?${p.toString()}`;
}

/* ═══════════════════════════════ PRESETS */
function loadPresetsFromStorage() {
  try { S.presets = JSON.parse(localStorage.getItem('practice-presets') || '[]'); }
  catch { S.presets = []; }
  renderPresets();
}

function savePresetsToStorage() {
  localStorage.setItem('practice-presets', JSON.stringify(S.presets));
}

function openPresetModal() {
  const modal = document.getElementById('preset-modal');
  const input = document.getElementById('preset-name-input');
  document.getElementById('modal-q-count').textContent = S.filtered.length;
  modal.hidden = false;
  setTimeout(() => input.focus(), 100);
}

function closePresetModal() {
  document.getElementById('preset-modal').hidden = true;
}

function savePreset() {
  const name = document.getElementById('preset-name-input').value.trim();
  if (!name) {
    document.getElementById('preset-name-input').style.borderColor = 'var(--red)';
    return;
  }
  const preset = {
    id:   Date.now(),
    name,
    filters: JSON.parse(JSON.stringify(S.filters)),
    count:   S.filtered.length,
    date:    new Date().toISOString()
  };
  S.presets.unshift(preset);
  savePresetsToStorage();
  renderPresets();
  closePresetModal();
  showToast(`Preset "${name}" saved`);
}

function loadPreset(id) {
  const p = S.presets.find(x => x.id === id);
  if (!p) return;

  S.filters = JSON.parse(JSON.stringify(p.filters));
  syncChipsToState();
  ['topic','paper','tags'].forEach(dropId => {
    renderPills(dropId);
    populateDropdown(dropId);
  });
  updateAll();
  document.getElementById('filter-heading').scrollIntoView({ behavior: 'smooth' });
  showToast(`Preset "${p.name}" loaded`);
}

function syncChipsToState() {
  const groupMap = [
    { group: 'subject', key: 'subjects' }, { group: 'unit', key: 'units' },
    { group: 'difficulty', key: 'difficulty' }, { group: 'type', key: 'type' },
    { group: 'marks', key: 'marks' }, { group: 'year', key: 'year' },
    { group: 'month', key: 'month' }, { group: 'day', key: 'practiceDay' }
  ];
  groupMap.forEach(({ group, key }) => {
    const vals = S.filters[key];
    document.querySelectorAll(`#chips-${group} .chip`).forEach(c => {
      const cv  = NUMERIC.has(key) ? Number(c.dataset.value) : c.dataset.value;
      const on  = vals.includes('all') ? c.dataset.value === 'all' : vals.includes(cv);
      c.classList.toggle('chip--active', on);
    });
    updateFilterGroupCount(group, key);
  });
}

function deletePreset(id) {
  const p = S.presets.find(x => x.id === id);
  if (!p || !confirm(`Delete preset "${p.name}"?`)) return;
  S.presets = S.presets.filter(x => x.id !== id);
  savePresetsToStorage();
  renderPresets();
  showToast('Preset deleted');
}

function renderPresets() {
  const list  = document.getElementById('presets-list');
  const empty = document.getElementById('no-presets-msg');

  // Clear preset cards only
  list.querySelectorAll('.preset-card').forEach(el => el.remove());

  if (S.presets.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  S.presets.forEach(p => {
    const date = new Date(p.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="preset-icon" aria-hidden="true">
        <svg class="icon"><use href="/assets/icons/sprite.svg#bookmark"></use></svg>
      </div>
      <div class="preset-body">
        <p class="preset-name">${esc(p.name)}</p>
        <p class="preset-meta">${p.count} questions &bull; ${date}</p>
      </div>
      <div class="preset-actions">
        <button class="preset-btn preset-btn--load" data-id="${p.id}" data-action="load" aria-label="Load ${esc(p.name)}">
          <svg class="icon icon-sm"><use href="/assets/icons/sprite.svg#download"></use></svg>Load
        </button>
        <button class="preset-btn preset-btn--del" data-id="${p.id}" data-action="del" aria-label="Delete ${esc(p.name)}">
          <svg class="icon icon-sm"><use href="/assets/icons/sprite.svg#delete"></use></svg>Del
        </button>
      </div>`;
    card.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === 'load') loadPreset(id);
      if (btn.dataset.action === 'del')  deletePreset(id);
    });
    list.appendChild(card);
  });
}

/* ═══════════════════════════════ EVENT LISTENERS */
function initEventListeners() {
  document.getElementById('reset-filters').addEventListener('click', resetAllFilters);
  document.getElementById('save-preset').addEventListener('click', openPresetModal);
  document.getElementById('start-session').addEventListener('click', startSession);

  document.getElementById('modal-close').addEventListener('click', closePresetModal);
  document.getElementById('modal-cancel').addEventListener('click', closePresetModal);
  document.getElementById('modal-save').addEventListener('click', savePreset);
  document.getElementById('preset-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter')  savePreset();
    if (e.key === 'Escape') closePresetModal();
  });
  document.getElementById('preset-name-input').addEventListener('input', e => {
    e.target.style.borderColor = '';
  });

  // Modal backdrop click
  document.getElementById('preset-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('preset-modal')) closePresetModal();
  });
}

/* ═══════════════════════════════ TOAST */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.hidden = false;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2800);
}

/* ═══════════════════════════════ UTILS */
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}