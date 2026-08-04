/* ═══════════════════════════════════════════════════════════
   ANSWERS PAGE — Review + Practice Modes
   Rich Content Rendering + Swipe Navigation
   v3 — Fixed code blocks + toggle answer + swipe
   ═══════════════════════════════════════════════════════════ */

// ─── Theme ───────────────────────────────────────────────
const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);

const themeIcon = document.getElementById('themeIcon');

function updateThemeIcon(t) {
  if (!themeIcon) return;
  themeIcon.innerHTML = t === 'dark'
    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}

updateThemeIcon(savedTheme);

document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});


// ─── Constants ───────────────────────────────────────────
const SUBJECT_NAMES = {
  CST201: 'Computer Programming in C',
  CST203: 'Scripting Languages (Python)',
  CST205: 'Data Structures',
  CST207: 'Computer System Organization',
  CST209: 'Algorithms'
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const TYPE_LABELS = {
  theory: 'Theory',
  program: 'Program',
  numerical: 'Numerical',
  short: 'Short Answer',
  mcq: 'MCQ'
};


// ─── URL Params ──────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const subjectCode = params.get('subject');
const paperCode = params.get('paper');


// ─── State ───────────────────────────────────────────────
let questions = [];
let currentIndex = 0;
let currentMode = 'practice';
let paperMeta = null;
let visibleAnswers = new Set();

const storageKey = (type) => `pyq_${subjectCode}_${paperCode}_${type}`;
let userAnswers = {};
let userResults = {};
let bookmarks = [];

function loadState() {
  try {
    userAnswers = JSON.parse(localStorage.getItem(storageKey('answers'))) || {};
    userResults = JSON.parse(localStorage.getItem(storageKey('results'))) || {};
    bookmarks = JSON.parse(localStorage.getItem(storageKey('bookmarks'))) || [];
  } catch {
    userAnswers = {};
    userResults = {};
    bookmarks = [];
  }
}

function saveState() {
  localStorage.setItem(storageKey('answers'), JSON.stringify(userAnswers));
  localStorage.setItem(storageKey('results'), JSON.stringify(userResults));
  localStorage.setItem(storageKey('bookmarks'), JSON.stringify(bookmarks));
}


// ─── Utilities ───────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escapeHtmlForCode(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function showError(msg) {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('errorScreen').classList.remove('hidden');
  document.getElementById('errorMessage').textContent = msg;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ═══════════════════════════════════════════════════════════
//  RICH CONTENT RENDERER
// ═══════════════════════════════════════════════════════════

function renderRichContent(text) {
  if (!text) return '<p style="color:var(--text-muted)">No content available.</p>';

  // Normalize line endings
  let normalized = text;
  normalized = normalized.replace(/\\n/g, '\n');
  normalized = normalized.replace(/\\t/g, '\t');

  const lines = normalized.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Explicit code block with ``` ──
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```

      const codeContent = escapeHtmlForCode(codeLines.join('\n'));
      const langLabel = lang || detectLanguage(codeLines.join('\n'));
      html += buildCodeBlockHtml(codeContent, langLabel);
      continue;
    }

    // ── Auto-detect multi-line code blocks ──
    if (isCodeLine(trimmed) && trimmed !== '') {
      const codeStartIndex = i;
      const codeLines = [];

      while (i < lines.length) {
        const cl = lines[i];
        const clTrimmed = cl.trim();

        // Empty line inside code — check if more code follows
        if (clTrimmed === '') {
          let hasMoreCode = false;
          for (let peek = i + 1; peek < Math.min(i + 4, lines.length); peek++) {
            const peekLine = lines[peek].trim();
            if (peekLine === '') continue;
            if (isCodeLine(peekLine) || peekLine === '{' || peekLine === '}') {
              hasMoreCode = true;
            }
            break;
          }

          if (hasMoreCode) {
            codeLines.push(cl);
            i++;
            continue;
          }
          break;
        }

        // Check if line is code-like
        if (isCodeLine(clTrimmed) || clTrimmed === '{' || clTrimmed === '}' ||
            clTrimmed === '};' || clTrimmed === ');' || clTrimmed === ')' ||
            clTrimmed.startsWith('//') || clTrimmed.startsWith('/*') ||
            clTrimmed.startsWith('*') || clTrimmed === '*/') {
          codeLines.push(cl);
          i++;
        } else {
          break;
        }
      }

      // Only treat as code block if 2+ lines
      if (codeLines.length >= 2) {
        while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === '') {
          codeLines.pop();
        }
        const codeContent = escapeHtmlForCode(codeLines.join('\n'));
        const langLabel = detectLanguage(codeLines.join('\n'));
        html += buildCodeBlockHtml(codeContent, langLabel);
      } else {
        for (const codeLine of codeLines) {
          if (codeLine.trim() !== '') {
            html += `<p>${formatInline(codeLine.trim())}</p>`;
          }
        }
      }
      continue;
    }

    // ── Table detection ──
    if (trimmed.includes('|') && trimmed.split('|').filter(c => c.trim()).length >= 2) {
      const tableRows = [];
      while (i < lines.length) {
        const tl = lines[i].trim();
        if (tl.includes('|') && tl.split('|').filter(c => c.trim()).length >= 2) {
          tableRows.push(tl);
          i++;
        } else {
          break;
        }
      }
      html += buildTableHtml(tableRows);
      continue;
    }

    // ── Empty line ──
    if (trimmed === '') {
      i++;
      continue;
    }

    // ── Numbered list ──
    if (/^\d+[\.\)]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s/, ''));
        i++;
      }
      html += `<ol>${items.map(li => `<li>${formatInline(li)}</li>`).join('')}</ol>`;
      continue;
    }

    // ── Bullet list ──
    if (/^[\-\*\•]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[\-\*\•]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[\-\*\•]\s/, ''));
        i++;
      }
      html += `<ul>${items.map(li => `<li>${formatInline(li)}</li>`).join('')}</ul>`;
      continue;
    }

    // ── Regular paragraph ──
    html += `<p>${formatInline(trimmed)}</p>`;
    i++;
  }

  return html;
}

function buildCodeBlockHtml(codeContent, langLabel) {
  const lineCount = (codeContent.match(/\n/g) || []).length + 1;
  const showLabel = langLabel || 'Code';

  return `<div class="code-block-wrapper">
    <div class="code-block-header">
      <span>${showLabel}${lineCount > 1 ? ` · ${lineCount} lines` : ''}</span>
      <button class="code-block-copy" onclick="copyCode(this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span>Copy</span>
      </button>
    </div>
    <pre><code>${codeContent}</code></pre>
  </div>`;
}

function buildTableHtml(rows) {
  let h = '<div class="table-wrapper"><table>';
  rows.forEach((row, ri) => {
    const cells = row.split('|').filter(c => c.trim() !== '');
    if (cells.every(c => /^[\s\-:]+$/.test(c))) return;
    const tag = ri === 0 ? 'th' : 'td';
    h += '<tr>';
    cells.forEach(cell => { h += `<${tag}>${formatInline(cell.trim())}</${tag}>`; });
    h += '</tr>';
  });
  h += '</table></div>';
  return h;
}

function formatInline(text) {
  let r = escapeHtml(text);
  // Bold
  r = r.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  r = r.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic — use lookbehind/ahead to avoid matching inside bold
  r = r.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  r = r.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>');
  // Inline code
  r = r.replace(/`(.+?)`/g, '<code>$1</code>');
  return r;
}

function isCodeLine(line) {
  if (!line || line.trim() === '') return false;
  const t = line.trim();

  if (t.length < 3 && t !== '{' && t !== '}') return false;

  const patterns = [
    // C / C++ declarations and includes
    /^#\s*(include|define|ifdef|ifndef|endif|pragma)\b/,
    /^(int|float|char|void|double|long|short|unsigned|signed)\s+\w+/,
    /^(struct|union|enum|typedef)\s+/,
    /^(const|static|extern|register|volatile)\s+/,

    // C / C++ control flow
    /^(if|else\s*if|else|while|for|do|switch|case\s+|default\s*:)\s*[\(\{]/,
    /^(break|continue|return|goto)\s*[;\(]/,
    /^(break|continue)\s*;/,
    /^return\s+/,
    /^return;/,

    // C I/O and memory
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

    // Assembly
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

    // Statements ending with semicolons
    /;\s*$/,

    // Braces
    /^\s*\{\s*$/,
    /^\s*\}\s*;?\s*$/,
    /\)\s*\{\s*$/,
    /^\s*\}\s*else\s*\{/,

    // Assignments and function calls
    /^\s*\w+\s*=\s*.+;$/,
    /^\s*\w+\s*\[.*\]\s*=\s*/,
    /^\s*\w+\s*\(.*\)\s*;$/,

    // Pointer declarations
    /^\s*(int|char|float|double|void)\s*\*+\s*\w+/,

    // Array declarations
    /^\s*(int|char|float|double)\s+\w+\s*\[/,

    // Function definitions
    /^\s*(int|void|float|double|char)\s+\w+\s*\(.*\)\s*\{?\s*$/,

    // Java / other OOP
    /^\s*(public|private|protected|static|final|abstract|virtual)\s/,
    /^\s*System\.(out|in|err)\./,
    /^\s*console\.(log|error|warn)\(/,

    // SQL
    /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|JOIN)\s/i,
  ];

  return patterns.some(p => p.test(t));
}

function detectLanguage(code) {
  if (/#include|printf|scanf|int\s+main|void\s+main|stdio\.h|stdlib\.h/.test(code)) return 'C';
  if (/cout|cin|#include\s*<iostream>|namespace\s+std|std::/.test(code)) return 'C++';
  if (/def\s+|import\s+|from\s+|print\s*\(|class\s+\w+:|self\.|__init__/.test(code)) return 'Python';
  if (/function\s+|const\s+|let\s+|var\s+|=>|console\.log/.test(code)) return 'JavaScript';
  if (/public\s+static|System\.out|class\s+\w+\s*\{/.test(code)) return 'Java';
  if (/SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE/i.test(code)) return 'SQL';
  if (/MOV|ADD|SUB|MUL|INT\s+21H|\.MODEL|\.STACK|\.DATA|\.CODE/i.test(code)) return 'Assembly';
  return 'Code';
}

window.copyCode = function(btn) {
  const pre = btn.closest('.code-block-wrapper').querySelector('pre code');
  if (!pre) return;
  navigator.clipboard.writeText(pre.textContent).then(() => {
    const span = btn.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Copied!';
    setTimeout(() => { span.textContent = orig; }, 1500);
  }).catch(() => showToast('Copy failed', 'error'));
};


// ═══════════════════════════════════════════════════════════
//  SWIPE DETECTION
// ═══════════════════════════════════════════════════════════

let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

const SWIPE_THRESHOLD = 60;
const SWIPE_VERTICAL_LIMIT = 80;

function initSwipe() {
  const container = document.getElementById('questionContainer');

  container.addEventListener('touchstart', (e) => {
    if (currentMode !== 'practice') return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isSwiping || currentMode !== 'practice') return;

    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);

    if (diffY > SWIPE_VERTICAL_LIMIT) {
      isSwiping = false;
      container.classList.remove('swiping-left', 'swiping-right');
      container.classList.add('swipe-reset');
      return;
    }

    if (Math.abs(diffX) > 20) {
      container.classList.remove('swipe-reset');
      if (diffX < 0) {
        container.classList.add('swiping-left');
        container.classList.remove('swiping-right');
      } else {
        container.classList.add('swiping-right');
        container.classList.remove('swiping-left');
      }
    }
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!isSwiping || currentMode !== 'practice') {
      isSwiping = false;
      return;
    }

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = Math.abs(touchEndY - touchStartY);

    container.classList.remove('swiping-left', 'swiping-right');
    container.classList.add('swipe-reset');
    setTimeout(() => container.classList.remove('swipe-reset'), 200);

    if (Math.abs(diffX) > SWIPE_THRESHOLD && diffY < SWIPE_VERTICAL_LIMIT) {
      if (diffX < 0 && currentIndex < questions.length - 1) {
        currentIndex++;
        renderPracticeView();
        buildSidebar();
        buildNavDots();
        scrollToTop();
      } else if (diffX > 0 && currentIndex > 0) {
        currentIndex--;
        renderPracticeView();
        buildSidebar();
        buildNavDots();
        scrollToTop();
      }
    }

    isSwiping = false;
  }, { passive: true });
}


// ═══════════════════════════════════════════════════════════
//  INIT — Load Data
// ═══════════════════════════════════════════════════════════

async function init() {
  if (!subjectCode || !paperCode) return showError('Invalid URL.');

  loadState();

  try {
    const regRes = await fetch(`../_data/${subjectCode}/registry.json`);
    if (!regRes.ok) throw new Error('Registry not found');
    const registry = await regRes.json();

    paperMeta = registry.papers.find(p => p.paperCode === paperCode);
    if (!paperMeta) throw new Error(`Paper ${paperCode} not found`);

    const paperRes = await fetch(`../_data/${subjectCode}/${paperMeta.fileName}`);
    if (!paperRes.ok) throw new Error('Paper file not found');
    const paperData = await paperRes.json();

    questions = paperData.questions || [];
    if (questions.length === 0) throw new Error('No questions in this paper');

    document.getElementById('headerTitle').textContent =
      `${subjectCode} · ${paperMeta.paperCode}`;
    document.getElementById('headerSub').textContent =
      `${SUBJECT_NAMES[subjectCode] || ''} · ${paperMeta.month} ${paperMeta.year}`;
    document.getElementById('sidebarTitle').textContent =
      `${paperMeta.month} ${paperMeta.year}`;
    document.title =
      `Practice ${subjectCode} ${paperMeta.month} ${paperMeta.year}`;

    const ls = document.getElementById('loadingScreen');
    ls.classList.add('fade-out');
    setTimeout(() => {
      ls.classList.add('hidden');
      document.getElementById('appShell').classList.remove('hidden');
    }, 400);

    buildSidebar();
    buildNavDots();
    updateProgress();
    renderView();
    initSwipe();

  } catch (err) {
    showError(err.message);
  }
}


// ═══════════════════════════════════════════════════════════
//  MODE SWITCHER
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === currentMode) return;

    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = mode;

    const footer = document.getElementById('appFooter');
    const container = document.getElementById('questionContainer');

    if (mode === 'review') {
      footer.classList.add('hidden');
      container.classList.add('review-mode');
    } else {
      footer.classList.remove('hidden');
      container.classList.remove('review-mode');
    }

    renderView();
    scrollToTop();
  });
});

function renderView() {
  if (currentMode === 'practice') {
    renderPracticeView();
  } else {
    renderReviewView();
  }
}


// ═══════════════════════════════════════════════════════════
//  PRACTICE MODE
// ═══════════════════════════════════════════════════════════

function renderPracticeView() {
  const container = document.getElementById('questionContainer');
  const q = questions[currentIndex];
  if (!q) return;

  const isBookmarked = bookmarks.includes(q.id);
  const prevResult = userResults[q.id];
  const prevAnswer = userAnswers[q.id];
  const isMCQ = Array.isArray(q.options) && q.options.length > 0;
  const isAnswered = isMCQ ? prevResult !== undefined : false;
  const isAnswerVisible = visibleAnswers.has(q.id);

  const typeLabel = TYPE_LABELS[q.type] || q.type || 'Question';
  const diffClass = q.difficulty ? `q-badge-difficulty-${q.difficulty}` : '';

  let bodyHTML = '';

  if (isMCQ) {
    bodyHTML = `
      <div class="q-text rich-content">${renderRichContent(q.question)}</div>
      <div class="mcq-grid">
        ${q.options.map((opt, oi) => {
          let cardClass = 'mcq-card';
          let iconHTML = '';

          if (isAnswered) {
            cardClass += ' disabled';
            if (oi === q.correct) {
              cardClass += ' correct';
              iconHTML = `<div class="mcq-card-icon icon-correct">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>`;
            }
            if (oi === prevAnswer && prevResult === 'wrong') {
              cardClass += ' wrong';
              iconHTML = `<div class="mcq-card-icon icon-wrong">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>`;
            }
          }

          return `
            <div class="${cardClass}" data-index="${oi}" role="button" tabindex="0">
              ${iconHTML}
              <span class="mcq-letter">${OPTION_LETTERS[oi]}</span>
              <span class="mcq-text">${escapeHtml(opt)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // Theory / Program / Numerical — toggleable answer
    const btnLabel = isAnswerVisible ? 'Hide Answer' : 'Show Answer';
    const btnIcon = isAnswerVisible
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
           <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
           <line x1="1" y1="1" x2="23" y2="23"/>
         </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
           <circle cx="12" cy="12" r="3"/>
         </svg>`;

    bodyHTML = `
      <div class="q-text rich-content">${renderRichContent(q.question)}</div>
      <button class="show-answer-btn" id="toggleAnswerBtn">
        ${btnIcon}
        <span>${btnLabel}</span>
      </button>
    `;
  }

  // Feedback for MCQ after answering
  let feedbackHTML = '';
  if (isMCQ && isAnswered) {
    const fClass = prevResult === 'correct' ? 'correct' : 'wrong';
    const fLabel = prevResult === 'correct' ? 'Correct!' : 'Incorrect';
    const fIcon = prevResult === 'correct'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    const tags = (q.tags || []).slice(0, 5);

    feedbackHTML = `
      <div class="feedback-section visible">
        <div class="feedback-header ${fClass}">${fIcon}<span>${fLabel}</span></div>
        <div class="answer-block">
          <div class="answer-label">Answer</div>
          <div class="answer-content rich-content">${renderRichContent(q.answer)}</div>
        </div>
        ${tags.length > 0 ? `
          <div class="key-points">
            <div class="key-points-title">Related Topics</div>
            ${tags.map(t => `<div class="key-point"><span class="key-point-bullet"></span><span>${escapeHtml(t)}</span></div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  // Theory answer section (toggleable)
  let theoryAnswerHTML = '';
  if (!isMCQ && isAnswerVisible) {
    const tags = (q.tags || []).slice(0, 5);

    theoryAnswerHTML = `
      <div class="feedback-section visible">
        <div class="feedback-header neutral">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Answer</span>
        </div>
        <div class="answer-block">
          <div class="answer-label">Detailed Answer</div>
          <div class="answer-content rich-content">${renderRichContent(q.answer)}</div>
        </div>
        ${tags.length > 0 ? `
          <div class="key-points">
            <div class="key-points-title">Related Topics</div>
            ${tags.map(t => `<div class="key-point"><span class="key-point-bullet"></span><span>${escapeHtml(t)}</span></div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="question-card">
      <div class="q-header">
        <span class="q-number">Q${currentIndex + 1}</span>
        <span class="q-badge q-badge-type">${typeLabel}</span>
        <span class="q-badge q-badge-marks">${q.marks}m</span>
        ${q.unit ? `<span class="q-badge q-badge-unit">Unit ${q.unit}</span>` : ''}
        ${q.difficulty ? `<span class="q-badge ${diffClass}">${q.difficulty}</span>` : ''}
        <span class="q-header-spacer"></span>
        <button class="q-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" id="bookmarkBtn" aria-label="Bookmark">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div class="q-body">${bodyHTML}</div>
      ${feedbackHTML}
      ${theoryAnswerHTML}
    </div>
  `;

  attachPracticeEvents(q, isMCQ, isAnswered);
  buildNavDots();
}

function attachPracticeEvents(q, isMCQ, isAnswered) {
  // Bookmark
  document.getElementById('bookmarkBtn')?.addEventListener('click', () => {
    const idx = bookmarks.indexOf(q.id);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      showToast('Bookmark removed', 'info');
    } else {
      bookmarks.push(q.id);
      showToast('Bookmarked', 'success');
    }
    saveState();
    renderPracticeView();
    buildSidebar();
  });

  // MCQ click
  if (isMCQ && !isAnswered) {
    document.querySelectorAll('.mcq-card').forEach(card => {
      const handler = () => {
        const sel = parseInt(card.dataset.index);
        const correct = sel === q.correct;
        userAnswers[q.id] = sel;
        userResults[q.id] = correct ? 'correct' : 'wrong';
        saveState();
        updateProgress();
        showToast(correct ? 'Correct!' : 'Incorrect', correct ? 'success' : 'error');
        renderPracticeView();
        buildSidebar();
      };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handler();
      });
    });
  }

  // Toggle answer for theory questions
  if (!isMCQ) {
    document.getElementById('toggleAnswerBtn')?.addEventListener('click', () => {
      if (visibleAnswers.has(q.id)) {
        visibleAnswers.delete(q.id);
      } else {
        visibleAnswers.add(q.id);
        if (!userResults[q.id]) {
          userResults[q.id] = 'neutral';
          saveState();
          updateProgress();
          buildSidebar();
        }
      }
      renderPracticeView();
    });
  }
}


// ═══════════════════════════════════════════════════════════
//  REVIEW MODE
// ═══════════════════════════════════════════════════════════

function renderReviewView() {
  const container = document.getElementById('questionContainer');
  let html = '';

  questions.forEach((q, i) => {
    const isBookmarked = bookmarks.includes(q.id);
    const isMCQ = Array.isArray(q.options) && q.options.length > 0;
    const typeLabel = TYPE_LABELS[q.type] || q.type || 'Question';
    const diffClass = q.difficulty ? `q-badge-difficulty-${q.difficulty}` : '';

    let mcqHtml = '';
    if (isMCQ) {
      mcqHtml = '<div style="margin-top:0.5rem;">';
      q.options.forEach((opt, oi) => {
        const marker = oi === q.correct
          ? ' <strong style="color:var(--success)">[Correct]</strong>'
          : '';
        mcqHtml += `<p style="margin:0.2rem 0;font-size:0.9rem;">
          ${OPTION_LETTERS[oi]}) ${escapeHtml(opt)}${marker}
        </p>`;
      });
      mcqHtml += '</div>';
    }

    let correctOptionHtml = '';
    if (isMCQ && q.correct !== undefined && q.correct !== null) {
      correctOptionHtml = `
        <div class="review-correct-option">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Answer: ${OPTION_LETTERS[q.correct]}) ${escapeHtml(q.options[q.correct])}</span>
        </div>
      `;
    }

    html += `
      <div class="question-card" id="review-q-${i}">
        <div class="q-header">
          <span class="q-number">Q${i + 1}</span>
          <span class="q-badge q-badge-type">${typeLabel}</span>
          <span class="q-badge q-badge-marks">${q.marks}m</span>
          ${q.unit ? `<span class="q-badge q-badge-unit">Unit ${q.unit}</span>` : ''}
          ${q.difficulty ? `<span class="q-badge ${diffClass}">${q.difficulty}</span>` : ''}
          <span class="q-header-spacer"></span>
          <button class="q-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-qid="${q.id}" aria-label="Bookmark">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
        <div class="q-body">
          <div class="q-text rich-content">${renderRichContent(q.question)}</div>
          ${mcqHtml}
        </div>
        <div class="review-card-answer">
          <div class="review-answer-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Answer</span>
          </div>
          ${correctOptionHtml}
          <div class="answer-content rich-content">${renderRichContent(q.answer)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Bookmark handlers in review mode
  container.querySelectorAll('.q-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = btn.dataset.qid;
      const idx = bookmarks.indexOf(qid);
      if (idx >= 0) {
        bookmarks.splice(idx, 1);
        btn.classList.remove('bookmarked');
        showToast('Removed', 'info');
      } else {
        bookmarks.push(qid);
        btn.classList.add('bookmarked');
        showToast('Bookmarked', 'success');
      }
      saveState();
      updateBookmarkCount();
      buildSidebar();
    });
  });
}


// ═══════════════════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════════════════

const sidebarEl = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebarEl.classList.remove('hidden');
  sidebarOverlay.classList.remove('hidden');
  requestAnimationFrame(() => sidebarEl.classList.add('open'));
}

function closeSidebar() {
  sidebarEl.classList.remove('open');
  setTimeout(() => {
    sidebarEl.classList.add('hidden');
    sidebarOverlay.classList.add('hidden');
  }, 300);
}

document.getElementById('sidebarToggle').addEventListener('click', openSidebar);
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

function buildSidebar() {
  const c = document.getElementById('sidebarQuestions');
  c.innerHTML = '';

  questions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-q-item';
    if (currentMode === 'practice' && i === currentIndex) btn.classList.add('active');

    let sc = '';
    if (bookmarks.includes(q.id)) sc = 'bookmarked';
    if (userResults[q.id] === 'correct') sc = 'correct';
    if (userResults[q.id] === 'wrong') sc = 'wrong';

    const short = q.question.substring(0, 45) + (q.question.length > 45 ? '...' : '');

    btn.innerHTML = `
      <span class="q-status-dot ${sc}"></span>
      <span class="q-item-text">Q${i + 1}. ${escapeHtml(short)}</span>
      <span class="q-item-marks">${q.marks}m</span>
    `;

    btn.addEventListener('click', () => {
      if (currentMode === 'practice') {
        currentIndex = i;
        renderPracticeView();
        buildNavDots();
      } else {
        const el = document.getElementById(`review-q-${i}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      closeSidebar();
    });

    c.appendChild(btn);
  });

  updateBookmarkCount();
}

function updateProgress() {
  const answered = Object.keys(userResults).length;
  const total = questions.length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  document.getElementById('progressLabel').textContent = `${answered} / ${total} answered`;
  document.getElementById('progressPercent').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = `${pct}%`;
}

function updateBookmarkCount() {
  document.getElementById('bookmarkCount').textContent = `(${bookmarks.length})`;
}


// ═══════════════════════════════════════════════════════════
//  NAV DOTS + BUTTONS
// ═══════════════════════════════════════════════════════════

function buildNavDots() {
  const c = document.getElementById('navDots');
  c.innerHTML = '';

  questions.forEach((q, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.title = `Q${i + 1}`;
    if (i === currentIndex) dot.classList.add('active');
    if (userResults[q.id] === 'correct') dot.classList.add('correct');
    if (userResults[q.id] === 'wrong') dot.classList.add('wrong');
    if (bookmarks.includes(q.id) && !userResults[q.id]) dot.classList.add('bookmarked');

    dot.addEventListener('click', () => {
      currentIndex = i;
      renderPracticeView();
      buildSidebar();
      buildNavDots();
      scrollToTop();
    });

    c.appendChild(dot);
  });

  document.getElementById('navCounter').textContent =
    `${currentIndex + 1} / ${questions.length}`;
  document.getElementById('prevBtn').disabled = currentIndex === 0;
  document.getElementById('nextBtn').disabled = currentIndex === questions.length - 1;
}

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderPracticeView();
    buildSidebar();
    buildNavDots();
    scrollToTop();
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderPracticeView();
    buildSidebar();
    buildNavDots();
    scrollToTop();
  }
});


// ═══════════════════════════════════════════════════════════
//  FILTER
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;

    if (currentMode === 'review') {
      questions.forEach((q, i) => {
        const el = document.getElementById(`review-q-${i}`);
        if (!el) return;
        let show = false;
        if (f === 'all') show = true;
        if (f === 'unanswered' && !userResults[q.id]) show = true;
        if (f === 'correct' && userResults[q.id] === 'correct') show = true;
        if (f === 'wrong' && userResults[q.id] === 'wrong') show = true;
        if (f === 'bookmarked' && bookmarks.includes(q.id)) show = true;
        el.style.display = show ? '' : 'none';
      });
    } else {
      const match = questions.findIndex(q => {
        if (f === 'all') return true;
        if (f === 'unanswered') return !userResults[q.id];
        if (f === 'correct') return userResults[q.id] === 'correct';
        if (f === 'wrong') return userResults[q.id] === 'wrong';
        if (f === 'bookmarked') return bookmarks.includes(q.id);
        return false;
      });

      if (match >= 0) {
        currentIndex = match;
        renderPracticeView();
        buildSidebar();
        buildNavDots();
        scrollToTop();
      } else {
        document.getElementById('questionContainer').innerHTML = `
          <div class="question-card">
            <div class="q-body" style="text-align:center;padding:3rem;">
              <p style="color:var(--text-muted)">No questions match this filter.</p>
            </div>
          </div>
        `;
      }
    }
  });
});


// ═══════════════════════════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════════════════════════

const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');

function toggleSearch() {
  if (searchPanel.classList.contains('hidden')) {
    searchPanel.classList.remove('hidden');
    searchInput.focus();
  } else {
    closeSearch();
  }
}

function closeSearch() {
  searchPanel.classList.add('hidden');
  searchInput.value = '';
  document.getElementById('searchResults').innerHTML =
    '<p class="search-empty">Type to search questions...</p>';
}

document.getElementById('searchToggle').addEventListener('click', toggleSearch);
document.getElementById('searchClose').addEventListener('click', closeSearch);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const rc = document.getElementById('searchResults');

  if (query.length < 2) {
    rc.innerHTML = '<p class="search-empty">Type at least 2 characters...</p>';
    return;
  }

  const matches = questions.map((q, i) => ({ q, i })).filter(({ q }) =>
    q.question.toLowerCase().includes(query) ||
    (q.answer && q.answer.toLowerCase().includes(query)) ||
    (q.topic && q.topic.toLowerCase().includes(query))
  );

  if (matches.length === 0) {
    rc.innerHTML = '<p class="search-empty">No results found.</p>';
    return;
  }

  rc.innerHTML = matches.map(({ q, i }) => {
    const highlighted = q.question.replace(
      new RegExp(`(${escapeRegex(query)})`, 'gi'),
      '<mark>$1</mark>'
    );
    return `
      <div class="search-result-item" data-index="${i}">
        <div class="sr-number">Q${i + 1} · ${q.marks}m${q.unit ? ` · Unit ${q.unit}` : ''}</div>
        <div class="sr-text">${highlighted.substring(0, 130)}${q.question.length > 130 ? '...' : ''}</div>
      </div>
    `;
  }).join('');

  rc.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      if (currentMode === 'practice') {
        currentIndex = idx;
        renderPracticeView();
        buildSidebar();
        buildNavDots();
      } else {
        const el = document.getElementById(`review-q-${idx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      closeSearch();
    });
  });
});


// ═══════════════════════════════════════════════════════════
//  STATISTICS MODAL
// ═══════════════════════════════════════════════════════════

document.getElementById('statsBtn').addEventListener('click', () => {
  closeSidebar();

  const correctCount = Object.values(userResults).filter(v => v === 'correct').length;
  const wrongCount = Object.values(userResults).filter(v => v === 'wrong').length;
  const neutralCount = Object.values(userResults).filter(v => v === 'neutral').length;
  const answered = correctCount + wrongCount + neutralCount;
  const remaining = questions.length - answered;
  const pct = questions.length > 0
    ? Math.round((answered / questions.length) * 100) : 0;
  const accuracy = (correctCount + wrongCount) > 0
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

  // By type
  const ts = {};
  questions.forEach(q => {
    const t = q.type || 'unknown';
    if (!ts[t]) ts[t] = { total: 0, correct: 0, wrong: 0, neutral: 0 };
    ts[t].total++;
    if (userResults[q.id] === 'correct') ts[t].correct++;
    if (userResults[q.id] === 'wrong') ts[t].wrong++;
    if (userResults[q.id] === 'neutral') ts[t].neutral++;
  });

  let typeHTML = '';
  Object.entries(ts).forEach(([type, d]) => {
    const tPct = d.total > 0
      ? Math.round(((d.correct + d.neutral) / d.total) * 100) : 0;
    typeHTML += `
      <div class="stat-row">
        <span style="text-transform:capitalize">${TYPE_LABELS[type] || type}</span>
        <span class="stat-value">${d.correct + d.neutral}/${d.total} (${tPct}%)</span>
      </div>
    `;
  });

  // By unit
  const us = {};
  questions.forEach(q => {
    const u = q.unit || 0;
    if (!us[u]) us[u] = { total: 0, done: 0 };
    us[u].total++;
    if (userResults[q.id]) us[u].done++;
  });

  let unitHTML = '';
  Object.entries(us).sort((a, b) => a[0] - b[0]).forEach(([unit, d]) => {
    const uPct = d.total > 0
      ? Math.round((d.done / d.total) * 100) : 0;
    unitHTML += `
      <div class="stat-row">
        <span>Unit ${unit}</span>
        <span class="stat-value">${d.done}/${d.total} (${uPct}%)</span>
      </div>
    `;
  });

  document.getElementById('statsBody').innerHTML = `
    <div class="stat-section">
      <div class="stat-section-title">Overall Progress</div>
      <div class="stat-row">
        <span>Correct</span>
        <span class="stat-value correct">${correctCount}</span>
      </div>
      <div class="stat-row">
        <span>Wrong</span>
        <span class="stat-value wrong">${wrongCount}</span>
      </div>
      <div class="stat-row">
        <span>Viewed (Theory)</span>
        <span class="stat-value">${neutralCount}</span>
      </div>
      <div class="stat-row">
        <span>Remaining</span>
        <span class="stat-value">${remaining}</span>
      </div>
      <div class="stat-bar-wrap">
        <div class="stat-bar-fill progress" style="width:${pct}%"></div>
      </div>
      <div class="stat-row" style="margin-top:0.5rem">
        <span>Accuracy (MCQ)</span>
        <span class="stat-value">${accuracy}%</span>
      </div>
    </div>
    <div class="stat-section">
      <div class="stat-section-title">By Question Type</div>
      ${typeHTML}
    </div>
    <div class="stat-section">
      <div class="stat-section-title">By Unit</div>
      ${unitHTML}
    </div>
  `;

  document.getElementById('statsModal').classList.remove('hidden');
});

document.getElementById('statsClose').addEventListener('click', () => {
  document.getElementById('statsModal').classList.add('hidden');
});


// ═══════════════════════════════════════════════════════════
//  BOOKMARKS MODAL
// ═══════════════════════════════════════════════════════════

document.getElementById('bookmarksBtn').addEventListener('click', () => {
  closeSidebar();
  renderBookmarksModal();
  document.getElementById('bookmarksModal').classList.remove('hidden');
});

document.getElementById('bookmarksClose').addEventListener('click', () => {
  document.getElementById('bookmarksModal').classList.add('hidden');
});

function renderBookmarksModal() {
  const body = document.getElementById('bookmarksBody');

  if (bookmarks.length === 0) {
    body.innerHTML = '<p class="modal-empty">No bookmarked questions yet.</p>';
    return;
  }

  body.innerHTML = bookmarks.map(qid => {
    const idx = questions.findIndex(q => q.id === qid);
    if (idx < 0) return '';
    const q = questions[idx];
    return `
      <div class="bookmark-item" data-index="${idx}">
        <div class="bookmark-item-info">
          <div class="bookmark-item-num">
            Q${idx + 1} · ${q.marks}m · ${TYPE_LABELS[q.type] || q.type}
          </div>
          <div class="bookmark-item-text">
            ${escapeHtml(q.question.substring(0, 55))}...
          </div>
        </div>
        <button class="bookmark-remove-btn" data-qid="${qid}" aria-label="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');

  // Click to navigate
  body.querySelectorAll('.bookmark-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.bookmark-remove-btn')) return;
      const idx = parseInt(item.dataset.index);
      if (currentMode === 'practice') {
        currentIndex = idx;
        renderPracticeView();
        buildSidebar();
        buildNavDots();
      } else {
        const el = document.getElementById(`review-q-${idx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.getElementById('bookmarksModal').classList.add('hidden');
    });
  });

  // Remove bookmark
  body.querySelectorAll('.bookmark-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      bookmarks = bookmarks.filter(b => b !== btn.dataset.qid);
      saveState();
      updateBookmarkCount();
      renderBookmarksModal();
      buildSidebar();
      showToast('Removed', 'info');
    });
  });
}


// ═══════════════════════════════════════════════════════════
//  RESET
// ═══════════════════════════════════════════════════════════

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset all progress for this paper? Cannot be undone.')) {
    userAnswers = {};
    userResults = {};
    bookmarks = [];
    visibleAnswers.clear();
    saveState();
    currentIndex = 0;
    updateProgress();
    buildSidebar();
    buildNavDots();
    renderView();
    closeSidebar();
    showToast('Progress reset', 'info');
  }
});


// ═══════════════════════════════════════════════════════════
//  PRINT OVERLAY
// ═══════════════════════════════════════════════════════════

document.getElementById('printAllBtn').addEventListener('click', () => {
  closeSidebar();
  buildPrintContent();
  document.getElementById('printOverlay').classList.remove('hidden');
});

document.getElementById('printCloseBtn').addEventListener('click', () => {
  document.getElementById('printOverlay').classList.add('hidden');
});

document.getElementById('printNowBtn').addEventListener('click', () => window.print());

document.querySelectorAll('.print-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.print-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('printContent').dataset.size = btn.dataset.size;
  });
});

function buildPrintContent() {
  const c = document.getElementById('printContent');
  const subName = SUBJECT_NAMES[subjectCode] || subjectCode;

  let html = `
    <div class="print-header">
      <h1>${subName} (${subjectCode})</h1>
      <p>Previous Year Questions with Answers</p>
      <p>${paperMeta.month} ${paperMeta.year} · Paper: ${paperMeta.sourcePaperCode || paperMeta.paperCode}</p>
      <p>Total: ${questions.length} Questions</p>
    </div>
  `;

  questions.forEach((q, i) => {
    const isMCQ = Array.isArray(q.options) && q.options.length > 0;

    html += `<div class="print-q-block">`;
    html += `<div class="print-q-num">Q${i + 1}. [${TYPE_LABELS[q.type] || q.type}] [${q.marks}m]${q.unit ? ` [Unit ${q.unit}]` : ''}</div>`;
    html += `<div class="print-q-text">${escapeHtml(q.question)}</div>`;

    if (isMCQ) {
      html += '<div class="print-q-options">';
      q.options.forEach((opt, oi) => {
        const isC = oi === q.correct;
        html += `<div class="print-q-option ${isC ? 'correct-option' : ''}">
          ${OPTION_LETTERS[oi]}) ${escapeHtml(opt)}${isC ? ' [Correct]' : ''}
        </div>`;
      });
      html += '</div>';
    }

    if (q.answer) {
      // Handle code in print answer
      const answerText = q.answer.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      const hasExplicitCode = answerText.includes('```');

      if (hasExplicitCode) {
        html += `<div class="print-answer-block"><div class="print-answer-label">Answer</div>`;
        const parts = answerText.split(/```\w*\n?/);
        parts.forEach((part, pi) => {
          if (pi % 2 === 0) {
            if (part.trim()) {
              html += `<div class="print-answer-text">${escapeHtml(part)}</div>`;
            }
          } else {
            html += `<div class="print-code-block">${escapeHtmlForCode(part)}</div>`;
          }
        });
        html += `</div>`;
      } else {
        // Check for auto-detected code
        const ansLines = answerText.split('\n');
        let hasAutoCode = false;
        let consecutiveCode = 0;

        for (const al of ansLines) {
          if (isCodeLine(al.trim())) {
            consecutiveCode++;
            if (consecutiveCode >= 2) { hasAutoCode = true; break; }
          } else {
            consecutiveCode = 0;
          }
        }

        if (hasAutoCode) {
          html += `<div class="print-answer-block"><div class="print-answer-label">Answer</div>`;
          let inCode = false;
          let codeBuffer = [];
          let textBuffer = [];

          const flushText = () => {
            if (textBuffer.length > 0) {
              html += `<div class="print-answer-text">${escapeHtml(textBuffer.join('\n'))}</div>`;
              textBuffer = [];
            }
          };

          const flushCode = () => {
            if (codeBuffer.length > 0) {
              html += `<div class="print-code-block">${escapeHtmlForCode(codeBuffer.join('\n'))}</div>`;
              codeBuffer = [];
            }
          };

          for (const al of ansLines) {
            if (isCodeLine(al.trim()) || al.trim() === '{' || al.trim() === '}' || al.trim() === '};') {
              if (!inCode) {
                flushText();
                inCode = true;
              }
              codeBuffer.push(al);
            } else {
              if (inCode) {
                flushCode();
                inCode = false;
              }
              textBuffer.push(al);
            }
          }
          flushText();
          flushCode();
          html += `</div>`;
        } else {
          html += `<div class="print-answer-block">
            <div class="print-answer-label">Answer</div>
            <div class="print-answer-text">${escapeHtml(answerText)}</div>
          </div>`;
        }
      }
    }

    html += '</div>';
  });

  html += `<div style="text-align:center;padding:1rem;color:#888;border-top:1px solid #ddd;margin-top:2rem;">
    Diploma 3rd Sem PYQ App · ${new Date().toLocaleDateString()}
  </div>`;

  c.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════
//  GO TO TOP
// ═══════════════════════════════════════════════════════════

const goTopBtn = document.getElementById('goTopBtn');

window.addEventListener('scroll', () => {
  if (currentMode === 'review') {
    goTopBtn.classList.toggle('hidden', window.scrollY < 400);
  } else {
    goTopBtn.classList.add('hidden');
  }
});

goTopBtn.addEventListener('click', scrollToTop);


// ═══════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (currentMode === 'practice') {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      currentIndex--;
      renderPracticeView();
      buildSidebar();
      buildNavDots();
      scrollToTop();
    }
    if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
      currentIndex++;
      renderPracticeView();
      buildSidebar();
      buildNavDots();
      scrollToTop();
    }
  }

  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggleSearch();
  }

  if (e.key === 'Escape') {
    closeSearch();
    closeSidebar();
    document.getElementById('statsModal').classList.add('hidden');
    document.getElementById('bookmarksModal').classList.add('hidden');
    document.getElementById('printOverlay').classList.add('hidden');
  }
});

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', (e) => {
    if (e.target === o) o.classList.add('hidden');
  });
});


// ═══════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════

init();