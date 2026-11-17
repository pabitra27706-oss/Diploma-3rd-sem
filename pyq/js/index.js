// ─── Theme ───────────────────────────────────────────────
const savedTheme = StudyStorage.theme();

document.documentElement.setAttribute('data-theme', savedTheme);

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function updateThemeIcon(theme) {
  if (!themeIcon) return;
  
  if (theme === 'dark') {
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    `;
  } else {
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3
      7 7 0 0 0 21 12.79z"/>
    `;
  }
}

updateThemeIcon(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', next);
    StudyStorage.setTheme(next);
    updateThemeIcon(next);
  });
}

// ─── Subject Data ────────────────────────────────────────
const SUBJECTS_META = [
  { code: 'CST201', name: 'Computer Programming in C', short: 'C' },
  { code: 'CST203', name: 'Scripting Languages (Python)', short: 'Python' },
  { code: 'CST205', name: 'Data Structures', short: 'DS' },
  { code: 'CST207', name: 'Computer System Organization', short: 'CSO' },
  { code: 'CST209', name: 'Algorithms', short: 'Algorithms' }
];

let allSubjectData = [];

// ─── Load One Registry Safely ────────────────────────────
async function loadRegistrySafe(subject) {
  try {
    const url = `../_data/${subject.code}/registry.json`;
    const res = await fetch(url);
    
    if (!res.ok) {
      console.warn(`Registry missing for ${subject.code}: ${url}`);
      return {
        ...subject,
        papers: [],
        registryAvailable: false
      };
    }
    
    const registry = await res.json();
    
    return {
      ...subject,
      papers: registry.papers || [],
      registryAvailable: true
    };
    
  } catch (err) {
    console.warn(`Failed to load registry for ${subject.code}`, err);
    
    return {
      ...subject,
      papers: [],
      registryAvailable: false
    };
  }
}

// ─── Load All Registries Without Breaking ────────────────
async function loadAllRegistries() {
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  
  try {
    const results = await Promise.all(
      SUBJECTS_META.map(subject => loadRegistrySafe(subject))
    );
    
    allSubjectData = results;
    
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    
    renderSubjects(allSubjectData);
    
  } catch (err) {
    console.error(err);
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
  }
}

// ─── Render Subjects ─────────────────────────────────────
function renderSubjects(subjects) {
  const container = document.getElementById('subjectsContainer');
  
  // Remove old cards but keep loading/error states
  const oldCards = container.querySelectorAll('.subject-card');
  oldCards.forEach(card => card.remove());
  
  subjects.forEach(subject => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.dataset.subject = subject.code;
    
    const sortedPapers = [...subject.papers].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.monthNumber - a.monthNumber;
    });
    
    const papersHtml = sortedPapers.length > 0 ?
      sortedPapers.map(paper => `
          <a class="paper-item"
             href="select.html?subject=${subject.code}&paper=${paper.paperCode}"
             aria-label="${subject.name} ${paper.month} ${paper.year}">
            <div class="paper-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="paper-info">
              <div class="paper-title">${paper.month} ${paper.year}</div>
              <div class="paper-meta">Code: ${paper.paperCode} · ${paper.sourcePaperCode || 'No source code'}</div>
            </div>
            <span class="paper-code-badge">${paper.paperCode}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </a>
        `).join('') :
      `
          <div class="empty-paper-list">
            <p>No papers added yet.</p>
            <small>No papers are registered for ${subject.name} yet.</small>
          </div>
        `;
    
    card.innerHTML = `
      <div class="subject-header">
        <span class="subject-code">${subject.short || subject.name}</span>
        <span class="subject-name">${subject.name}</span>
        <span class="subject-count">${subject.papers.length} papers</span>
        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      <div class="papers-list">
        ${papersHtml}
      </div>
    `;
    
    card.querySelector('.subject-header').addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
    
    container.appendChild(card);
  });
}

// ─── Filter & URL Handoff (subject / unit / topic) ──────
const shardCache = new Map();

function displaySubject(code) {
  if (typeof window !== 'undefined' && typeof window.subjectLabel === 'function') {
    return window.subjectLabel(code);
  }
  const found = SUBJECTS_META.find(s => s.code === code);
  return found ? found.short : 'Subject';
}

function makeEl(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (k === 'class') el.className = v;
      else el.setAttribute(k, String(v));
    });
  }
  children.flat().forEach(ch => {
    if (ch === null || ch === undefined || ch === false) return;
    el.append(ch.nodeType ? ch : document.createTextNode(String(ch)));
  });
  return el;
}

function parseFilterUrl() {
  const p = new URLSearchParams(window.location.search);
  const rawSubj = (p.get('subject') || '').trim().toUpperCase();
  const validCodes = new Set(SUBJECTS_META.map(s => s.code));
  const subject = validCodes.has(rawSubj) ? rawSubj : 'ALL';
  const invalidSubject = Boolean(rawSubj && !validCodes.has(rawSubj));
  const rawUnit = (p.get('unit') || '').trim();
  const parsedUnit = rawUnit && /^\d+$/.test(rawUnit) ? Number(rawUnit) : null;
  const topic = (p.get('topic') || '').trim().slice(0, 120);
  return { subject, invalidSubject, unit: parsedUnit, topic };
}

function pushFilterUrl({ subject, unit, topic }, replace = false) {
  const p = new URLSearchParams();
  if (subject && subject !== 'ALL') p.set('subject', subject);
  if (unit !== null && unit !== undefined && unit !== '') p.set('unit', String(unit));
  if (topic) p.set('topic', topic);
  const next = p.toString() ? `${window.location.pathname}?${p}` : window.location.pathname;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', next);
}

function applySubjectPillFilter(selected) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.subject === selected);
  });
  document.querySelectorAll('.subject-card').forEach(card => {
    const match = selected === 'ALL' || card.dataset.subject === selected;
    card.classList.toggle('hidden', !match);
    if (selected !== 'ALL' && match) {
      card.classList.add('expanded');
    }
  });
}

async function fetchSubjectPyqs(code) {
  if (!shardCache.has(code)) {
    shardCache.set(
      code,
      fetch(`../assets/search/index-${code}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(rows => rows.filter(r => r.type === 'pyq').map(r => ({ ...r, subject: code })))
        .catch(err => {
          shardCache.delete(code);
          throw err;
        })
    );
  }
  return shardCache.get(code);
}

async function renderFilteredPyqPanel(filter) {
  const panel = document.getElementById('filteredPyqPanel');
  if (!panel) return;
  panel.replaceChildren();

  if (filter.invalidSubject) {
    panel.classList.remove('hidden');
    panel.append(
      makeEl('p', { role: 'status' }, 'Requested subject filter was not recognized; showing all archived papers.')
    );
    return;
  }

  const hasQuestionFilter = filter.unit !== null || Boolean(filter.topic);
  if (!hasQuestionFilter) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  panel.append(makeEl('p', { role: 'status' }, 'Loading filtered questions…'));

  const targetCodes = filter.subject === 'ALL'
    ? SUBJECTS_META.map(s => s.code)
    : [filter.subject];

  let rows = [];
  try {
    const chunks = await Promise.all(targetCodes.map(fetchSubjectPyqs));
    rows = chunks.flat();
  } catch (_) {
    panel.replaceChildren();
    const errP = makeEl('p', { role: 'alert' }, 'Filtered questions could not load right now. ');
    const retry = makeEl('button', { type: 'button', class: 'retry-btn' }, 'Retry');
    retry.addEventListener('click', () => renderFilteredPyqPanel(filter));
    errP.append(retry);
    panel.append(errP);
    return;
  }

  const unitScoped = filter.unit !== null
    ? rows.filter(r => Number(r.unit) === filter.unit)
    : rows;
  const topicLower = filter.topic.toLowerCase();
  const matched = filter.topic
    ? unitScoped.filter(r => !r.genericTopic && String(r.topic || '').toLowerCase() === topicLower)
    : unitScoped;

  matched.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));

  panel.replaceChildren();
  const headingBits = [];
  if (filter.subject !== 'ALL') headingBits.push(displaySubject(filter.subject));
  else headingBits.push('All Subjects');
  if (filter.unit !== null) headingBits.push(`Unit ${filter.unit}`);
  if (filter.topic) headingBits.push(filter.topic);

  panel.append(
    makeEl(
      'h2',
      { style: 'font-size:1.12rem;margin:0 0 .45rem;' },
      `${headingBits.join(' · ')} — Past Questions (${matched.length})`
    )
  );

  // Action bar: clear filter, practice handoff, search handoff, back to unit notes.
  const actions = makeEl('div', {
    style: 'display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;margin:0 0 .75rem;font-size:.86rem;'
  });

  const clearBtn = makeEl('button', { type: 'button', class: 'filter-btn' }, 'Clear question filter');
  clearBtn.addEventListener('click', () => {
    const next = { subject: filter.subject, invalidSubject: false, unit: null, topic: '' };
    pushFilterUrl(next);
    applySubjectPillFilter(next.subject);
    renderFilteredPyqPanel(next);
  });
  actions.append(clearBtn);

  if (filter.topic && filter.unit !== null) {
    const showAllUnit = makeEl('button', { type: 'button', class: 'filter-btn' }, `All Unit ${filter.unit} questions`);
    showAllUnit.addEventListener('click', () => {
      const next = { subject: filter.subject, invalidSubject: false, unit: filter.unit, topic: '' };
      pushFilterUrl(next);
      renderFilteredPyqPanel(next);
    });
    actions.append(showAllUnit);
  }

  const practiceParams = new URLSearchParams();
  if (filter.subject !== 'ALL') practiceParams.set('subjects', filter.subject);
  if (filter.unit !== null) practiceParams.set('units', String(filter.unit));
  if (filter.topic) practiceParams.set('topics', filter.topic);
  if (matched.length > 0) {
    actions.append(
      makeEl(
        'a',
        { href: `../practice/session.html?${practiceParams}` },
        `Practice these (${matched.length})`
      )
    );
  }

  const searchParams = new URLSearchParams({ type: 'pyq' });
  if (filter.subject !== 'ALL') searchParams.set('subject', filter.subject);
  if (filter.topic) searchParams.set('topic', filter.topic);
  else if (filter.unit !== null) searchParams.set('q', `unit ${filter.unit}`);
  actions.append(makeEl('a', { href: `../search.html?${searchParams}` }, 'Open in Search'));

  if (filter.subject !== 'ALL' && filter.unit !== null) {
    const maxUnits = { CST201: 5, CST203: 5, CST205: 4, CST207: 5, CST209: 5 }[filter.subject] || 4;
    if (filter.unit >= 1 && filter.unit <= maxUnits) {
      actions.append(
        makeEl(
          'a',
          { href: `../subjects/${filter.subject}/units/unit-${filter.unit}.html` },
          `Unit ${filter.unit} notes`
        )
      );
    }
  }
  panel.append(actions);

  // Topic filter chips inside the unit view
  const topicCounts = new Map();
  unitScoped.forEach(r => {
    if (r.genericTopic || !r.topic) return;
    topicCounts.set(r.topic, (topicCounts.get(r.topic) || 0) + 1);
  });
  if (topicCounts.size > 0) {
    const topicBar = makeEl('div', {
      style: 'display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 .85rem;'
    });
    [...topicCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
      .forEach(([topicName, count]) => {
        const isCurrent = topicName.toLowerCase() === topicLower;
        const chip = makeEl(
          'button',
          {
            type: 'button',
            class: `filter-btn${isCurrent ? ' active' : ''}`,
            'aria-pressed': isCurrent ? 'true' : 'false'
          },
          `${topicName} (${count})`
        );
        chip.addEventListener('click', () => {
          const next = {
            subject: filter.subject,
            invalidSubject: false,
            unit: filter.unit,
            topic: isCurrent ? '' : topicName
          };
          pushFilterUrl(next);
          renderFilteredPyqPanel(next);
        });
        topicBar.append(chip);
      });
    panel.append(topicBar);
  }

  if (matched.length === 0) {
    panel.append(
      makeEl(
        'p',
        { role: 'status' },
        '0 archived exam questions match this filter. Clear the filter above or pick a full paper below.'
      )
    );
    return;
  }

  function paperIdFor(subjectCode, paperCode) {
    const subj = allSubjectData.find(s => s.code === subjectCode);
    const found = subj && Array.isArray(subj.papers)
      ? subj.papers.find(p => p.paperCode === paperCode)
      : null;
    return found && found.fileName ? found.fileName.replace(/\.json$/, '') : '';
  }

  const list = makeEl('ol', {
    class: 'filtered-pyq-list',
    style: 'margin:0;padding-left:1.35rem;display:grid;gap:.55rem;'
  });
  matched.forEach(r => {
    const fullPaperId = r.paperId || paperIdFor(r.subject, r.paper);
    const params = fullPaperId
      ? new URLSearchParams({ paper: fullPaperId, q: r.id })
      : new URLSearchParams({ subject: r.subject, paper: r.paper, q: r.id });
    const relHref = r.url
      ? (String(r.url).startsWith('pyq/') ? r.url.slice(4) : `../${r.url}`)
      : `answers.html?${params.toString()}`;
    const cleanTitle = String(r.title || '').replace(
      /\b(?:CST2\d{2}|SI201)\b/gi,
      m => displaySubject(m.toUpperCase())
    );
    const metaParts = [displaySubject(r.subject)];
    if (r.unit) metaParts.push(`Unit ${r.unit}`);
    if (r.topic && !r.genericTopic) metaParts.push(r.topic);
    if (r.month && r.year) metaParts.push(`${r.month} ${r.year}`);
    else if (r.year) metaParts.push(String(r.year));
    if (r.marks) metaParts.push(`${r.marks}m`);
    const item = makeEl(
      'li',
      null,
      makeEl('a', { href: relHref }, cleanTitle),
      makeEl(
        'div',
        { style: 'font-size:.82rem;opacity:.82;margin-top:.12rem;' },
        metaParts.join(' · ')
      )
    );
    list.append(item);
  });
  panel.append(list);
}

function applyUrlFilters() {
  const filter = parseFilterUrl();
  applySubjectPillFilter(filter.subject);
  renderFilteredPyqPanel(filter);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = btn.dataset.subject;
    if (!selected) return;
    const next = { subject: selected, invalidSubject: false, unit: null, topic: '' };
    pushFilterUrl(next);
    applySubjectPillFilter(selected);
    renderFilteredPyqPanel(next);
  });
});

window.addEventListener('popstate', applyUrlFilters);

// ─── Retry ───────────────────────────────────────────────
const retryBtn = document.getElementById('retryBtn');

if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
    loadAllRegistries().then(applyUrlFilters);
  });
}

// ─── Init ────────────────────────────────────────────────
loadAllRegistries().then(applyUrlFilters);