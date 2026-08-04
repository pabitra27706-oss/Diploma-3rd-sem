/**
 * Practice Session — Swipe-first, question-focused
 * Rich content rendering with proper code block detection,
 * syntax highlighting, tables, inline formatting.
 */
'use strict';

/* ═══════════════════════════════ STATE */
const S = {
  all:       [],
  filtered:  [],
  questions: [],
  filters:   {},
  index:     0,
  done:      new Set(),
  sort:      'default',
  key:       '',
  startTime: 0,
  bookmarked: false,
  swipe: {
    startX:     0,
    startY:     0,
    currentX:   0,
    isSwiping:  false,
    isVertical: false,
    threshold:  60
  },
  swipeHintShown: false
};

const SUBJECTS = ['CST201','CST203','CST205','CST207','CST209'];

/* ═══════════════════════════════ BOOT */
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  S.filters   = parseURL();
  S.key       = makeKey(S.filters);
  S.startTime = Date.now();

  await loadAll();

  S.filtered  = applyFilters(S.all, S.filters);
  S.questions = sortQ(S.filtered, 'default');

  if (S.questions.length === 0) { showEmpty(); return; }

  initListeners();
  initSwipe();
  renderChips();
  initBookmark();
  checkResume();
});

/* ═══════════════════════════════ THEME */
function initTheme() {
  const html  = document.documentElement;
  const btn   = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  btn.querySelector('use').setAttribute('href',
    `/assets/icons/sprite.svg#${saved === 'dark' ? 'sun' : 'moon'}`);
  btn.addEventListener('click', () => {
    const n = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', n);
    localStorage.setItem('theme', n);
    btn.querySelector('use').setAttribute('href',
      `/assets/icons/sprite.svg#${n === 'dark' ? 'sun' : 'moon'}`);
  });
}

/* ═══════════════════════════════ DATA */
async function loadAll() {
  for (const sub of SUBJECTS) {
    try {
      const reg = await fetch(`/_data/${sub}/registry.json`).then(r => r.json());
      for (const paper of reg.papers || []) {
        try {
          const d = await fetch(`/_data/${sub}/${paper.fileName}`).then(r => r.json());
          if (d.questions) S.all.push(...d.questions.map(q => ({...q, subjectCode: sub})));
        } catch {}
      }
    } catch {}
  }
  const ls = document.getElementById('loading-screen');
  ls.style.opacity    = '0';
  ls.style.transition = 'opacity 0.3s';
  setTimeout(() => { ls.remove(); document.getElementById('main').hidden = false; }, 300);
}

/* ═══════════════════════════════ URL */
function parseURL() {
  const p = new URLSearchParams(location.search);
  return {
    subjects:    p.get('subjects')?.split(',')           || ['all'],
    units:       p.get('units')?.split(',').map(Number)  || ['all'],
    topics:      p.get('topics')?.split(',')             || [],
    difficulty:  p.get('difficulty')?.split(',')         || ['all'],
    type:        p.get('type')?.split(',')               || ['all'],
    marks:       p.get('marks')?.split(',').map(Number)  || ['all'],
    year:        p.get('year')?.split(',').map(Number)   || ['all'],
    month:       p.get('month')?.split(',')              || ['all'],
    paperCodes:  p.get('papers')?.split(',')             || [],
    practiceDay: p.get('days')?.split(',').map(Number)   || ['all'],
    tags:        p.get('tags')?.split(',')               || []
  };
}

/* ═══════════════════════════════ FILTER */
function applyFilters(qs, f) {
  let q = qs;
  if (!f.subjects.includes('all'))     q = q.filter(x => f.subjects.some(s => x.subjectCode === s || x.id?.startsWith(s)));
  if (!f.units.includes('all'))        q = q.filter(x => f.units.includes(Number(x.unit)));
  if (f.topics.length)                q = q.filter(x => f.topics.includes(x.topic));
  if (!f.difficulty.includes('all'))  q = q.filter(x => f.difficulty.includes(x.difficulty));
  if (!f.type.includes('all'))        q = q.filter(x => f.type.includes(x.type));
  if (!f.marks.includes('all'))       q = q.filter(x => f.marks.includes(Number(x.marks)));
  if (!f.year.includes('all'))        q = q.filter(x => f.year.includes(Number(x.year)));
  if (!f.month.includes('all'))       q = q.filter(x => f.month.includes(x.month));
  if (f.paperCodes.length)            q = q.filter(x => f.paperCodes.includes(x.paperCode));
  if (!f.practiceDay.includes('all')) q = q.filter(x => f.practiceDay.includes(Number(x.practiceDay)));
  if (f.tags.length)                  q = q.filter(x => Array.isArray(x.tags) && x.tags.some(t => f.tags.includes(t)));
  return q;
}

/* ═══════════════════════════════ SORT */
function sortQ(qs, by) {
  const a = [...qs];
  const d = { easy: 1, medium: 2, hard: 3 };
  switch (by) {
    case 'difficulty': return a.sort((x, y) => (d[x.difficulty] || 9) - (d[y.difficulty] || 9));
    case 'marks':      return a.sort((x, y) => x.marks - y.marks);
    case 'year':       return a.sort((x, y) => x.year !== y.year ? x.year - y.year : (x.monthNumber || 0) - (y.monthNumber || 0));
    case 'topic':      return a.sort((x, y) => (x.topic || '').localeCompare(y.topic || ''));
    case 'random':     return a.sort(() => Math.random() - 0.5);
    default:           return a;
  }
}

/* ═══════════════════════════════ SESSION KEY */
function makeKey(f) {
  let h = 0;
  const s = JSON.stringify(f);
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return `practice-session-${Math.abs(h).toString(36)}`;
}

/* ═══════════════════════════════ RESUME */
function checkResume() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(S.key)); } catch {}
  if (!saved || !saved.completed?.length) { startFresh(); return; }

  const modal = document.getElementById('resume-modal');
  const idx   = Math.min(saved.currentIndex || 0, S.questions.length - 1);
  const dt    = new Date(saved.lastVisited).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  document.getElementById('resume-desc').textContent = `Session from ${dt}`;
  document.getElementById('resume-stats').innerHTML = `
    <div class="resume-stat">
      <span class="resume-stat-num">${saved.completed.length}</span>
      <span class="resume-stat-label">Done</span>
    </div>
    <div class="resume-stat">
      <span class="resume-stat-num">${S.questions.length - saved.completed.length}</span>
      <span class="resume-stat-label">Left</span>
    </div>`;
  modal.hidden = false;

  document.getElementById('resume-btn').addEventListener('click', () => {
    modal.hidden = true;
    S.done  = new Set(saved.completed);
    S.index = idx;
    begin();
  }, { once: true });

  document.getElementById('start-over-btn').addEventListener('click', () => {
    modal.hidden = true;
    localStorage.removeItem(S.key);
    startFresh();
  }, { once: true });
}

function startFresh() { S.done = new Set(); S.index = 0; begin(); }

function begin() {
  document.getElementById('question-card').hidden = false;
  document.getElementById('bottom-bar').hidden    = false;

  // Scroll to question zone so filters are hidden above viewport
  setTimeout(() => {
    document.getElementById('question-zone').scrollIntoView({ behavior: 'auto', block: 'start' });
  }, 100);

  renderQ('none');
  updateProgress();
  updateNav();
  renderDots();
  showSwipeHint();
}

/* ═══════════════════════════════════════════════════════════
   RICH CONTENT RENDERER
   Full port from answers page — handles code detection,
   tables, lists, inline formatting, auto language detection
   ═══════════════════════════════════════════════════════════ */

function renderRichContent(text) {
  if (!text) return '<p style="color:var(--text-muted)">No content available.</p>';

  // Normalize escape sequences
  let normalized = text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');

  const lines = normalized.split('\n');
  let html = '';
  let i    = 0;

  while (i < lines.length) {
    const line    = lines[i];
    const trimmed = line.trim();

    /* ── Explicit fenced code block ``` ── */
    if (trimmed.startsWith('```')) {
      const lang      = trimmed.slice(3).trim();
      const codeLines = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```

      const codeContent = escapeForCode(codeLines.join('\n'));
      const langLabel   = lang || detectLanguage(codeLines.join('\n'));
      html += buildCodeBlockHtml(codeContent, langLabel);
      continue;
    }

    /* ── Auto-detect multi-line code ── */
    if (isCodeLine(trimmed) && trimmed !== '') {
      const codeLines = [];

      while (i < lines.length) {
        const cl        = lines[i];
        const clTrimmed = cl.trim();

        // Empty line — peek ahead to check if code continues
        if (clTrimmed === '') {
          let hasMoreCode = false;
          for (let peek = i + 1; peek < Math.min(i + 4, lines.length); peek++) {
            const pk = lines[peek].trim();
            if (pk === '') continue;
            if (isCodeLine(pk) || pk === '{' || pk === '}') hasMoreCode = true;
            break;
          }
          if (hasMoreCode) { codeLines.push(cl); i++; continue; }
          break;
        }

        const isCode = isCodeLine(clTrimmed)
          || clTrimmed === '{' || clTrimmed === '}'
          || clTrimmed === '};' || clTrimmed === ');' || clTrimmed === ')'
          || clTrimmed.startsWith('//') || clTrimmed.startsWith('/*')
          || clTrimmed.startsWith('*')  || clTrimmed === '*/';

        if (isCode) { codeLines.push(cl); i++; }
        else break;
      }

      // Only render as code block if 2+ lines, else fallback to paragraph
      if (codeLines.length >= 2) {
        // Trim trailing empty lines
        while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === '') {
          codeLines.pop();
        }
        const codeContent = escapeForCode(codeLines.join('\n'));
        const langLabel   = detectLanguage(codeLines.join('\n'));
        html += buildCodeBlockHtml(codeContent, langLabel);
      } else {
        codeLines.forEach(cl => {
          if (cl.trim()) html += `<p>${formatInline(cl.trim())}</p>`;
        });
      }
      continue;
    }

    /* ── Table detection ── */
    if (trimmed.includes('|') && trimmed.split('|').filter(c => c.trim()).length >= 2) {
      const tableRows = [];
      while (i < lines.length) {
        const tl = lines[i].trim();
        if (tl.includes('|') && tl.split('|').filter(c => c.trim()).length >= 2) {
          tableRows.push(tl); i++;
        } else break;
      }
      html += buildTableHtml(tableRows);
      continue;
    }

    /* ── Empty line ── */
    if (trimmed === '') { i++; continue; }

    /* ── Numbered list ── */
    if (/^\d+[\.\)]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s/, ''));
        i++;
      }
      html += `<ol>${items.map(li => `<li>${formatInline(li)}</li>`).join('')}</ol>`;
      continue;
    }

    /* ── Bullet list ── */
    if (/^[\-\*\•]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[\-\*\•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[\-\*\•]\s/, ''));
        i++;
      }
      html += `<ul>${items.map(li => `<li>${formatInline(li)}</li>`).join('')}</ul>`;
      continue;
    }

    /* ── Regular paragraph ── */
    html += `<p>${formatInline(trimmed)}</p>`;
    i++;
  }

  return html;
}

/* ─── Build code block HTML with copy button ─── */
function buildCodeBlockHtml(codeContent, langLabel) {
  const lineCount = (codeContent.match(/\n/g) || []).length + 1;
  const label     = langLabel || 'Code';
  const blockId   = `cb-${Math.random().toString(36).slice(2, 8)}`;

  return `
    <div class="code-block-wrap" id="${blockId}">
      <div class="code-block-header">
        <span class="code-lang">
          <span class="code-lang-dot"></span>
          ${escHtml(label)}${lineCount > 1 ? ` · ${lineCount} lines` : ''}
        </span>
        <button type="button" class="code-copy-btn" data-target="${blockId}" aria-label="Copy code">
          <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span class="code-copy-text">Copy</span>
        </button>
      </div>
      <div class="code-scroll">
        <pre class="code-pre"><code>${codeContent}</code></pre>
      </div>
    </div>`;
}

/* ─── Table builder ─── */
function buildTableHtml(rows) {
  let h = '<div class="table-wrapper"><table>';
  rows.forEach((row, ri) => {
    const cells = row.split('|').filter(c => c.trim() !== '');
    // Skip separator rows (---) 
    if (cells.every(c => /^[\s\-:]+$/.test(c))) return;
    const tag = ri === 0 ? 'th' : 'td';
    h += '<tr>';
    cells.forEach(cell => { h += `<${tag}>${formatInline(cell.trim())}</${tag}>`; });
    h += '</tr>';
  });
  h += '</table></div>';
  return h;
}

/* ─── Inline markdown formatting ─── */
function formatInline(text) {
  let r = escHtml(text);
  // Bold **text** or __text__
  r = r.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  r = r.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic *text* or _text_ (not inside bold)
  r = r.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  r = r.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');
  // Inline code `text`
  r = r.replace(/`(.+?)`/g, '<code>$1</code>');
  return r;
}

/* ─── Code line detection ─── */
function isCodeLine(line) {
  if (!line || line.trim() === '') return false;
  const t = line.trim();
  if (t.length < 3 && t !== '{' && t !== '}') return false;

  const patterns = [
    // C / C++ preprocessor
    /^#\s*(include|define|ifdef|ifndef|endif|pragma)\b/,
    // C / C++ type declarations
    /^(int|float|char|void|double|long|short|unsigned|signed)\s+\w+/,
    /^(struct|union|enum|typedef)\s+/,
    /^(const|static|extern|register|volatile)\s+/,
    // C / C++ control flow
    /^(if|else\s*if|else|while|for|do|switch|case\s+|default\s*:)\s*[\(\{]/,
    /^(break|continue|return|goto)\s*[;\(]/,
    /^(break|continue)\s*;/,
    /^return\s+/,
    /^return;/,
    // C standard library calls
    /^(printf|scanf|puts|gets|fprintf|fscanf|sprintf|sscanf)\s*\(/,
    /^(malloc|calloc|realloc|free)\s*\(/,
    /^(strlen|strcpy|strcat|strcmp|strncpy|strncat)\s*\(/,
    /^(fopen|fclose|fread|fwrite|fgets|fputs)\s*\(/,
    // C++ specific
    /^(cout|cin|cerr|endl)\s*/,
    /^(using\s+namespace|template|class\s+\w+|public:|private:|protected:)/,
    /^(new|delete)\s+/,
    /^(std::)/,
    // Python
    /^(def|class)\s+\w+/,
    /^(import|from)\s+\w+/,
    /^(print|input|len|range|int|str|float|list|dict|tuple|set)\s*\(/,
    /^(if|elif|else)\s*.*:\s*$/,
    /^(while|for)\s+.*:\s*$/,
    /^(try|except|finally|raise|with|as)\s*.*:\s*$/,
    /^(return|yield|pass|break|continue)\s*/,
    /^(self\.|cls\.)/,
    /^@\w+/,
    /^\s+\w+\s*=\s*.+/,
    // Assembly (8085/8086)
    /^\s*(MOV|ADD|SUB|MUL|DIV|INC|DEC|CMP|JMP|JE|JNE|JG|JL|JGE|JLE|JA|JB)\s/i,
    /^\s*(CALL|RET|PUSH|POP|INT|LEA|AND|OR|XOR|NOT|SHL|SHR|ROL|ROR)\s/i,
    /^\s*(AX|BX|CX|DX|SI|DI|SP|BP|AL|AH|BL|BH|CL|CH|DL|DH)\s*,/i,
    /^\s*\w+\s+(DB|DW|DD|DQ|EQU)\s/i,
    /^\s*\.(MODEL|STACK|DATA|CODE|SEGMENT|ENDS|END)\b/i,
    /^\s*PROC\s/i,
    /^\s*ENDP\s*$/i,
    // Comments
    /^\s*\/\/.*/,
    /^\s*\/\*.*\*\/\s*$/,
    /^\s*\/\*/,
    /^\s*\*\//,
    /^\s*\*\s+/,
    // Semicolons (C statements)
    /;\s*$/,
    // Braces
    /^\s*\{\s*$/,
    /^\s*\}\s*;?\s*$/,
    /\)\s*\{\s*$/,
    /^\s*\}\s*else\s*\{/,
    // Assignments
    /^\s*\w+\s*=\s*.+;$/,
    /^\s*\w+\s*\[.*\]\s*=\s*/,
    /^\s*\w+\s*\(.*\)\s*;$/,
    // Pointer / array declarations
    /^\s*(int|char|float|double|void)\s*\*+\s*\w+/,
    /^\s*(int|char|float|double)\s+\w+\s*\[/,
    // Function definitions
    /^\s*(int|void|float|double|char)\s+\w+\s*\(.*\)\s*\{?\s*$/,
    // Java / OOP
    /^\s*(public|private|protected|static|final|abstract|virtual)\s/,
    /^\s*System\.(out|in|err)\./,
    /^\s*console\.(log|error|warn)\(/,
    // SQL
    /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN)\s/i,
  ];

  return patterns.some(p => p.test(t));
}

/* ─── Language auto-detection ─── */
function detectLanguage(code) {
  if (/#include|printf|scanf|int\s+main|void\s+main|stdio\.h|stdlib\.h/.test(code))         return 'C';
  if (/cout|cin|#include\s*<iostream>|namespace\s+std|std::/.test(code))                     return 'C++';
  if (/def\s+|import\s+|from\s+|print\s*\(|class\s+\w+:|self\.|__init__/.test(code))         return 'Python';
  if (/function\s+|const\s+|let\s+|var\s+|=>|console\.log/.test(code))                       return 'JavaScript';
  if (/public\s+static|System\.out|class\s+\w+\s*\{/.test(code))                             return 'Java';
  if (/SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE/i.test(code))                              return 'SQL';
  if (/MOV|ADD|SUB|MUL|INT\s+21H|\.MODEL|\.STACK|\.DATA|\.CODE/i.test(code))                return 'Assembly';
  return 'Code';
}

/* ─── Copy code handler (delegated, works on dynamic content) ─── */
function initCopyDelegation() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.code-copy-btn');
    if (!btn) return;
    const blockId = btn.dataset.target;
    const block   = document.getElementById(blockId);
    if (!block) return;
    const code    = block.querySelector('pre code');
    if (!code) return;
    const textEl  = btn.querySelector('.code-copy-text');

    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.classList.add('copied');
      if (textEl) textEl.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (textEl) textEl.textContent = 'Copy';
      }, 1800);
    }).catch(() => showToast('Copy failed'));
  });
}

/* ═══════════════════════════════ RENDER QUESTION */
function renderQ(direction) {
  const q    = S.questions[S.index];
  if (!q) return;

  const card = document.getElementById('question-card');

  // Close answer instantly before swap
  closeAnswer();

  // Remove old animation classes
  card.classList.remove(
    'card-enter-from-right', 'card-enter-from-left',
    'card-exit-left', 'card-exit-right'
  );

  // Trigger slide animation
  if (direction === 'left') {
    void card.offsetWidth;
    card.classList.add('card-enter-from-right');
  } else if (direction === 'right') {
    void card.offsetWidth;
    card.classList.add('card-enter-from-left');
  }

  /* ── Badges ── */
  document.getElementById('q-subject').textContent = q.subjectCode || '';
  document.getElementById('q-unit').textContent    = q.unit ? `Unit ${q.unit}` : '';
  document.getElementById('q-marks').textContent   = q.marks ? `${q.marks}M` : '';
  document.getElementById('q-type').textContent    = q.type ? cap(q.type) : '';

  const df = document.getElementById('q-diff');
  df.textContent = q.difficulty ? cap(q.difficulty) : '';
  df.setAttribute('data-level', q.difficulty || '');

  /* ── Source row ── */
  document.getElementById('q-topic').textContent = q.topic || 'General';
  document.getElementById('q-from').textContent  =
    [q.year, q.month, q.paperCode].filter(Boolean).join(' · ') || '-';

  /* ── Tags ── */
  const tr = document.getElementById('q-tags-row');
  tr.innerHTML = '';
  if (Array.isArray(q.tags) && q.tags.length) {
    q.tags.forEach(t => {
      const s = document.createElement('span');
      s.className   = 'q-tag';
      s.textContent = `#${t}`;
      tr.appendChild(s);
    });
  }

  /* ── Question text (rendered as rich content) ── */
  const qtextEl = document.getElementById('q-text');
  qtextEl.innerHTML = renderRichContent(q.question);

  /* ── Answer body (rendered as rich content) ── */
  const body = document.getElementById('answer-body');
  body.innerHTML = renderRichContent(q.answer);

  /* ── Done state ── */
  const isDone = S.done.has(q.id);
  updateDoneUI(isDone);
  card.classList.toggle('is-done', isDone);

  /* ── Counters ── */
  document.getElementById('header-counter').textContent = `Q${S.index + 1} / ${S.questions.length}`;
  document.getElementById('bottom-counter').textContent = `${S.index + 1}/${S.questions.length}`;

  renderDots();
}

/* ═══════════════════════════════ ANSWER TOGGLE */
function openAnswer() {
  const p = document.getElementById('answer-panel');
  const b = document.getElementById('answer-toggle-btn');
  p.classList.add('is-open');
  p.setAttribute('aria-hidden', 'false');
  b.setAttribute('aria-expanded', 'true');
  document.getElementById('answer-toggle-text').textContent = 'Hide Answer';
}

function closeAnswer() {
  const p = document.getElementById('answer-panel');
  const b = document.getElementById('answer-toggle-btn');
  p.classList.remove('is-open');
  p.setAttribute('aria-hidden', 'true');
  b.setAttribute('aria-expanded', 'false');
  document.getElementById('answer-toggle-text').textContent = 'Show Answer';
}

function toggleAnswer() {
  document.getElementById('answer-panel').classList.contains('is-open')
    ? closeAnswer()
    : openAnswer();
}

/* ═══════════════════════════════ MARK DONE */
function toggleDone() {
  const q = S.questions[S.index];
  if (!q) return;

  if (S.done.has(q.id)) {
    S.done.delete(q.id);
    updateDoneUI(false);
    document.getElementById('question-card').classList.remove('is-done');
  } else {
    S.done.add(q.id);
    updateDoneUI(true);
    document.getElementById('question-card').classList.add('is-done');
    spawnRipple(document.getElementById('mark-btn'));

    if (S.index < S.questions.length - 1) {
      setTimeout(() => { navigateTo(S.index + 1, 'left'); }, 400);
    }
  }

  saveProgress();
  updateProgress();
  syncDay();
  checkCompletion();
}

function spawnRipple(btn) {
  const r  = document.createElement('span');
  r.className = 'mark-ripple';
  const sz = Math.max(btn.offsetWidth, btn.offsetHeight) * 2;
  r.style.cssText = `width:${sz}px;height:${sz}px;left:${btn.offsetWidth/2 - sz/2}px;top:${btn.offsetHeight/2 - sz/2}px;`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

function updateDoneUI(isDone) {
  document.getElementById('done-banner').hidden = !isDone;
  const btn  = document.getElementById('mark-btn');
  const text = document.getElementById('mark-text');
  if (isDone) {
    btn.classList.add('is-done');
    text.textContent = 'Undo';
    btn.setAttribute('aria-label', 'Mark as not done');
  } else {
    btn.classList.remove('is-done');
    text.textContent = 'Done';
    btn.setAttribute('aria-label', 'Mark question as done');
  }
}

/* ═══════════════════════════════ NAVIGATION */
function navigateTo(idx, direction) {
  if (idx < 0 || idx >= S.questions.length) return;
  closeAnswer();
  S.index = idx;
  renderQ(direction || 'none');
  updateNav();
  saveProgress();
}

function updateNav() {
  document.getElementById('prev-btn').disabled = S.index === 0;
  document.getElementById('next-btn').disabled = S.index === S.questions.length - 1;
}

/* ═══════════════════════════════ SWIPE */
function initSwipe() {
  const container = document.getElementById('swipe-container');

  container.addEventListener('touchstart', onTouchStart, { passive: true });
  container.addEventListener('touchmove',  onTouchMove,  { passive: false });
  container.addEventListener('touchend',   onTouchEnd,   { passive: true });
  container.addEventListener('touchcancel', onTouchEnd,  { passive: true });
}

function onTouchStart(e) {
  const t = e.touches[0];
  S.swipe.startX     = t.clientX;
  S.swipe.startY     = t.clientY;
  S.swipe.currentX   = t.clientX;
  S.swipe.isSwiping  = false;
  S.swipe.isVertical = false;
  document.getElementById('question-card').classList.add('is-swiping');
}

function onTouchMove(e) {
  const t  = e.touches[0];
  const dx = t.clientX - S.swipe.startX;
  const dy = t.clientY - S.swipe.startY;
  S.swipe.currentX = t.clientX;

  // Determine direction on first significant move
  if (!S.swipe.isSwiping && !S.swipe.isVertical) {
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      if (Math.abs(dy) > Math.abs(dx)) {
        S.swipe.isVertical = true;
        return;
      } else {
        S.swipe.isSwiping = true;
        hideSwipeHint();
      }
    }
    return;
  }

  if (S.swipe.isVertical) return;

  e.preventDefault(); // Block scroll during horizontal swipe

  const card    = document.getElementById('question-card');
  const maxDrag = 120;
  let dragX     = Math.max(-maxDrag, Math.min(maxDrag, dx));

  // Rubber-band resistance at boundaries
  if (S.index === 0 && dx > 0)                          dragX = dx * 0.25;
  if (S.index === S.questions.length - 1 && dx < 0)     dragX = dx * 0.25;

  card.style.transform = `translateX(${dragX}px)`;
  card.style.opacity   = String(1 - Math.abs(dragX) / maxDrag * 0.3);

  // Show direction indicators
  const indL = document.getElementById('swipe-ind-left');
  const indR = document.getElementById('swipe-ind-right');

  if (dx < -30 && S.index < S.questions.length - 1) {
    indR.classList.add('visible');
    indL.classList.remove('visible');
  } else if (dx > 30 && S.index > 0) {
    indL.classList.add('visible');
    indR.classList.remove('visible');
  } else {
    indL.classList.remove('visible');
    indR.classList.remove('visible');
  }
}

function onTouchEnd() {
  const card = document.getElementById('question-card');
  card.classList.remove('is-swiping');
  card.style.transform = '';
  card.style.opacity   = '';

  document.getElementById('swipe-ind-left').classList.remove('visible');
  document.getElementById('swipe-ind-right').classList.remove('visible');

  if (!S.swipe.isSwiping) return;

  const dx = S.swipe.currentX - S.swipe.startX;

  if (dx < -S.swipe.threshold && S.index < S.questions.length - 1) {
    navigateTo(S.index + 1, 'left');
  } else if (dx > S.swipe.threshold && S.index > 0) {
    navigateTo(S.index - 1, 'right');
  }

  S.swipe.isSwiping = false;
}

/* ═══════════════════════════════ SWIPE HINT */
function showSwipeHint() {
  if (S.swipeHintShown) return;
  S.swipeHintShown = true;
  setTimeout(() => {
    const h = document.getElementById('swipe-hint');
    if (h) h.classList.add('hide');
  }, 3500);
}

function hideSwipeHint() {
  const h = document.getElementById('swipe-hint');
  if (h) h.classList.add('hide');
}

/* ═══════════════════════════════ DOTS */
function renderDots() {
  const bar   = document.getElementById('q-dots-bar');
  if (!bar) return;
  bar.innerHTML = '';

  const total = S.questions.length;
  if (total > 30) return; // Skip dots for large sets

  // Show max 15 dots centred around current index
  const maxDots = 15;
  let start = 0, end = total;
  if (total > maxDots) {
    start = Math.max(0, S.index - Math.floor(maxDots / 2));
    end   = Math.min(total, start + maxDots);
    if (end - start < maxDots) start = Math.max(0, end - maxDots);
  }

  for (let i = start; i < end; i++) {
    const dot = document.createElement('span');
    dot.className = 'q-dot';
    if (i === S.index)                              dot.classList.add('active');
    if (S.done.has(S.questions[i]?.id))             dot.classList.add('done');
    bar.appendChild(dot);
  }
}

/* ═══════════════════════════════ PROGRESS */
function updateProgress() {
  const total = S.questions.length;
  const done  = S.done.size;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('prog-done').textContent  = done;
  document.getElementById('prog-total').textContent = total;
  document.getElementById('prog-fill').style.width  = `${pct}%`;
  document.getElementById('prog-pct').textContent   = `${pct}%`;
  document.getElementById('prog-track').setAttribute('aria-valuenow', pct);
  document.getElementById('header-prog-fill').style.width = `${pct}%`;
}

/* ═══════════════════════════════ PERSISTENCE */
function saveProgress() {
  try {
    localStorage.setItem(S.key, JSON.stringify({
      completed:    [...S.done],
      currentIndex: S.index,
      lastVisited:  new Date().toISOString()
    }));
  } catch {}
}

function syncDay() {
  if (S.filters.practiceDay.includes('all')) return;
  S.filters.practiceDay.forEach(day => {
    const dqs  = S.questions.filter(q => Number(q.practiceDay) === day);
    const done = dqs.filter(q => S.done.has(q.id));
    try {
      localStorage.setItem(`practice-day-${day}`, JSON.stringify({
        total:       dqs.length,
        completed:   done.map(q => q.id),
        lastVisited: new Date().toISOString()
      }));
    } catch {}
  });
}

/* ═══════════════════════════════ COMPLETION */
function checkCompletion() {
  if (S.done.size < S.questions.length) return;
  if (!S.questions.every(q => S.done.has(q.id))) return;
  setTimeout(showCompletion, 600);
}

function showCompletion() {
  const o    = document.getElementById('completion-overlay');
  const st   = document.getElementById('completion-stats');
  const mins = Math.floor((Date.now() - S.startTime) / 60000);
  st.textContent = `${S.questions.length} questions${mins > 0 ? ` in ${mins} min` : ''}`;
  document.getElementById('score-pct').textContent = '100%';
  o.hidden = false;
  requestAnimationFrame(() => {
    document.getElementById('score-ring-fill').style.strokeDashoffset = '0';
  });
  spawnConfetti();
}

function spawnConfetti() {
  const w      = document.getElementById('confetti-wrap');
  const colors = ['#3b82f6','#22c55e','#f97316','#eab308','#8b5cf6','#ef4444'];
  for (let i = 0; i < 35; i++) {
    const d = document.createElement('div');
    d.className = 'confetti-dot';
    d.style.cssText = `
      left:${Math.random() * 100}%; top:-10px;
      background:${colors[i % colors.length]};
      width:${6 + Math.random() * 6}px; height:${6 + Math.random() * 6}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration:${1.2 + Math.random() * 1.5}s;
      animation-delay:${Math.random() * 0.8}s;`;
    w.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  }
}

function practiceAgain() {
  localStorage.removeItem(S.key);
  S.done      = new Set();
  S.index     = 0;
  S.questions = sortQ(S.filtered, S.sort);
  document.getElementById('completion-overlay').hidden = true;
  closeAnswer();
  renderQ('none');
  updateNav();
  updateProgress();
  renderDots();
  showToast('Starting fresh!');
}

/* ═══════════════════════════════ FILTER CHIPS */
function renderChips() {
  const c   = document.getElementById('active-chips');
  const btn = document.getElementById('clear-chips-btn');
  c.innerHTML = '';
  let has = false;

  const add = (key, vals, fn) => {
    if (!vals || vals.includes('all') || !vals.length) return;
    has = true;
    vals.forEach(v => {
      const ch = document.createElement('div');
      ch.className = 'active-chip';
      ch.setAttribute('role', 'listitem');
      ch.innerHTML = `<span>${escHtml(fn(v))}</span>
        <button class="chip-remove" aria-label="Remove ${escHtml(fn(v))}">
          <svg class="icon icon-sm" aria-hidden="true">
            <use href="/assets/icons/sprite.svg#close"></use>
          </svg>
        </button>`;
      ch.querySelector('.chip-remove').addEventListener('click', () => removeFilter(key, v));
      c.appendChild(ch);
    });
  };

  const f = S.filters;
  add('subjects',    f.subjects,    v => v);
  add('units',       f.units,       v => `Unit ${v}`);
  add('topics',      f.topics,      v => v);
  add('difficulty',  f.difficulty,  v => cap(v));
  add('type',        f.type,        v => cap(v));
  add('marks',       f.marks,       v => `${v}M`);
  add('year',        f.year,        v => `${v}`);
  add('month',       f.month,       v => v);
  add('paperCodes',  f.paperCodes,  v => v);
  add('practiceDay', f.practiceDay, v => `Day ${v}`);
  add('tags',        f.tags,        v => `#${v}`);

  btn.hidden = !has;
}

function removeFilter(key, val) {
  const f = S.filters;
  if (key === 'topics' || key === 'paperCodes' || key === 'tags') {
    f[key] = f[key].filter(v => v !== val);
  } else {
    const arr = f[key].filter(v => v !== val);
    f[key] = arr.length ? arr : ['all'];
  }

  S.filtered  = applyFilters(S.all, f);
  S.questions = sortQ(S.filtered, S.sort);
  S.index     = 0;

  if (!S.questions.length) { showEmpty(); return; }
  renderChips();
  renderQ('none');
  updateNav();
  updateProgress();
  renderDots();
  updateURL();
}

function clearAllFilters() {
  S.filters = {
    subjects: ['all'], units: ['all'], topics: [], difficulty: ['all'],
    type: ['all'], marks: ['all'], year: ['all'], month: ['all'],
    paperCodes: [], practiceDay: ['all'], tags: []
  };
  S.filtered  = S.all;
  S.questions = sortQ(S.all, S.sort);
  S.index     = 0;
  renderChips();
  renderQ('none');
  updateNav();
  updateProgress();
  renderDots();
  updateURL();
}

function updateURL() {
  const f = S.filters;
  const p = new URLSearchParams();
  if (!f.subjects.includes('all'))     p.set('subjects',   f.subjects.join(','));
  if (!f.units.includes('all'))        p.set('units',      f.units.join(','));
  if (f.topics.length)                p.set('topics',     f.topics.join(','));
  if (!f.difficulty.includes('all'))  p.set('difficulty', f.difficulty.join(','));
  if (!f.type.includes('all'))        p.set('type',       f.type.join(','));
  if (!f.marks.includes('all'))       p.set('marks',      f.marks.join(','));
  if (!f.year.includes('all'))        p.set('year',       f.year.join(','));
  if (!f.month.includes('all'))       p.set('month',      f.month.join(','));
  if (f.paperCodes.length)            p.set('papers',     f.paperCodes.join(','));
  if (!f.practiceDay.includes('all')) p.set('days',       f.practiceDay.join(','));
  if (f.tags.length)                  p.set('tags',       f.tags.join(','));
  history.replaceState({}, '', p.toString() ? `${location.pathname}?${p}` : location.pathname);
}

/* ═══════════════════════════════ BOOKMARK */
function initBookmark() {
  const btn = document.getElementById('bookmark-btn');
  let bm    = [];
  try { bm = JSON.parse(localStorage.getItem('practice-bookmarks') || '[]'); } catch {}
  if (bm.includes(location.href)) {
    S.bookmarked = true;
    btn.classList.add('is-bookmarked');
    btn.setAttribute('aria-pressed', 'true');
  }
}

function toggleBookmark() {
  const btn = document.getElementById('bookmark-btn');
  let bm    = [];
  try { bm = JSON.parse(localStorage.getItem('practice-bookmarks') || '[]'); } catch {}

  if (S.bookmarked) {
    bm = bm.filter(u => u !== location.href);
    S.bookmarked = false;
    btn.classList.remove('is-bookmarked');
    btn.setAttribute('aria-pressed', 'false');
    showToast('Bookmark removed');
  } else {
    bm.push(location.href);
    S.bookmarked = true;
    btn.classList.add('is-bookmarked');
    btn.setAttribute('aria-pressed', 'true');
    showToast('Bookmarked!');
  }
  try { localStorage.setItem('practice-bookmarks', JSON.stringify(bm)); } catch {}
}

/* ═══════════════════════════════ COPY ANSWER */
function copyAnswer() {
  const q = S.questions[S.index];
  if (!q?.answer) return;
  const btn    = document.getElementById('copy-answer-btn');
  const textEl = document.getElementById('copy-btn-text');

  navigator.clipboard.writeText(q.answer).then(() => {
    btn.classList.add('copied');
    if (textEl) textEl.textContent = 'Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      if (textEl) textEl.textContent = 'Copy';
    }, 2000);
  }).catch(() => showToast('Copy failed'));
}

/* ═══════════════════════════════ SORT */
function setSort(by) {
  S.sort      = by;
  document.querySelectorAll('.sort-chip').forEach(c => {
    c.classList.toggle('sort-chip--active', c.dataset.sort === by);
  });
  S.questions = sortQ(S.filtered, by);
  S.index     = 0;
  closeAnswer();
  renderQ('none');
  updateNav();
  renderDots();
  showToast(`Sorted: ${cap(by)}`);
}

/* ═══════════════════════════════ JUMP */
function doJump() {
  const inp = document.getElementById('jump-input');
  const n   = parseInt(inp.value, 10);

  if (!n || n < 1 || n > S.questions.length) {
    inp.style.borderColor = 'var(--red)';
    setTimeout(() => { inp.style.borderColor = ''; }, 1200);
    return;
  }

  inp.value = '';
  const dir = n - 1 > S.index ? 'left' : n - 1 < S.index ? 'right' : 'none';
  navigateTo(n - 1, dir);

  // Scroll back to question zone
  document.getElementById('question-zone').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════ EMPTY STATE */
function showEmpty() {
  document.getElementById('no-questions').hidden  = false;
  document.getElementById('question-card').hidden = true;
  document.getElementById('bottom-bar').hidden    = true;
}

/* ═══════════════════════════════ TOAST */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.hidden = false;
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 300);
  }, 2500);
}

/* ═══════════════════════════════ LISTENERS */
function initListeners() {
  // Answer
  document.getElementById('answer-toggle-btn').addEventListener('click', toggleAnswer);
  document.getElementById('copy-answer-btn').addEventListener('click', copyAnswer);

  // Mark done
  document.getElementById('mark-btn').addEventListener('click', toggleDone);

  // Navigation buttons
  document.getElementById('prev-btn').addEventListener('click', () => navigateTo(S.index - 1, 'right'));
  document.getElementById('next-btn').addEventListener('click', () => navigateTo(S.index + 1, 'left'));

  // Sort chips
  document.querySelectorAll('.sort-chip').forEach(b => {
    b.addEventListener('click', () => setSort(b.dataset.sort));
  });

  // Jump
  document.getElementById('jump-btn').addEventListener('click', doJump);
  document.getElementById('jump-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') doJump();
  });

  // Filter chips
  document.getElementById('clear-chips-btn').addEventListener('click', clearAllFilters);

  // Bookmark
  document.getElementById('bookmark-btn').addEventListener('click', toggleBookmark);

  // Scroll to filters (header button)
  document.getElementById('scroll-to-filters').addEventListener('click', () => {
    document.getElementById('above-fold').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Completion
  document.getElementById('practice-again-btn').addEventListener('click', practiceAgain);

  // Copy delegation for code blocks (works on dynamically rendered content)
  initCopyDelegation();

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeys);
}

function handleKeys(e) {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  switch (e.key) {
    case 'ArrowLeft':  e.preventDefault(); navigateTo(S.index - 1, 'right'); break;
    case 'ArrowRight': e.preventDefault(); navigateTo(S.index + 1, 'left');  break;
    case ' ':          e.preventDefault(); toggleAnswer(); break;
    case 'd': case 'D': toggleDone(); break;
    case 'r': case 'R': setSort('random'); break;
  }
}

/* ═══════════════════════════════ UTILS */
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/* HTML escape for display content */
function escHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}

/* HTML escape for code content (preserves whitespace characters) */
function escapeForCode(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}