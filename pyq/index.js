// ─── Theme ───────────────────────────────────────────────
const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

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
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

// ─── Subject Data ────────────────────────────────────────
const SUBJECTS_META = [
  { code: 'CST201', name: 'Computer Programming in C' },
  { code: 'CST203', name: 'Scripting Languages (Python)' },
  { code: 'CST205', name: 'Data Structures' },
  { code: 'CST207', name: 'Computer System Organization' },
  { code: 'CST209', name: 'Algorithms' }
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
            <small>Missing or empty registry.json for ${subject.code}</small>
          </div>
        `;
    
    card.innerHTML = `
      <div class="subject-header">
        <span class="subject-code">${subject.code}</span>
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

// ─── Filter ──────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const selected = btn.dataset.subject;
    
    document.querySelectorAll('.subject-card').forEach(card => {
      if (selected === 'ALL' || card.dataset.subject === selected) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ─── Retry ───────────────────────────────────────────────
const retryBtn = document.getElementById('retryBtn');

if (retryBtn) {
  retryBtn.addEventListener('click', () => {
    document.getElementById('errorState').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
    loadAllRegistries();
  });
}

// ─── Init ────────────────────────────────────────────────
loadAllRegistries();