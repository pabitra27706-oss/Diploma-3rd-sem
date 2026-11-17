/* ═══════════════════════════════════════════════════════════
   ANSWERS PAGE — Review + Practice Modes
   Rich Content Rendering + Swipe Navigation
   v3 — Fixed code blocks + toggle answer + swipe
   ═══════════════════════════════════════════════════════════ */

// ─── Theme ───────────────────────────────────────────────
const savedTheme = (() => { try { return StudyStorage.theme(); } catch { return document.documentElement.getAttribute('data-theme') || 'light'; } })();
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
  try { StudyStorage.setTheme(next); } catch (e) { console.warn('[theme] save failed:', e.message); }
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

/**
 * Normalize legacy string-array options, pilot object-array options, and
 * quiz-style object-map options into { key, text, index } records.
 */
function getOptions(q) {
  if (!q || !q.options) return null;

  if (Array.isArray(q.options)) {
    return q.options.map((opt, i) => {
      const fallback = OPTION_LETTERS[i] || String.fromCharCode(65 + i);
      if (typeof opt === 'string') {
        return { key: fallback, text: opt, index: i };
      }
      return {
        key: opt.key || opt.label || fallback,
        text: opt.text || opt.value || '',
        index: i
      };
    });
  }

  if (typeof q.options === 'object') {
    return Object.entries(q.options).map(([key, text], i) => ({
      key: key,
      text: String(text),
      index: i
    }));
  }

  return null;
}

/** Resolve numeric, letter, or object-key correct values to an option index. */
function getCorrectIndex(q, options) {
  if (!options || options.length === 0) return -1;

  if (typeof q.correct === 'number' && q.correct >= 0 && q.correct < options.length) {
    return q.correct;
  }

  if (typeof q.correct === 'string') {
    const target = q.correct.trim().toLowerCase();
    if (/^\d+$/.test(target)) {
      const n = parseInt(target, 10);
      if (n >= 0 && n < options.length) return n;
    }
    const byKey = options.findIndex(o => String(o.key).toLowerCase() === target);
    if (byKey >= 0) return byKey;
    const upper = target.toUpperCase();
    const byLetter = options.findIndex((o, i) =>
      (OPTION_LETTERS[i] || '').toUpperCase() === upper ||
      String(o.key).toUpperCase() === upper
    );
    if (byLetter >= 0) return byLetter;
  }

  return -1;
}


const TYPE_LABELS = {
  theory: 'Theory',
  program: 'Program',
  numerical: 'Numerical',
  short: 'Short Answer',
  mcq: 'MCQ'
};


// ─── URL Params ──────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const paperParam = params.get('paper') || '';
const queryQ = params.get('q') || '';
const queryQMatch = queryQ.match(/^(CST\d{3})-(P\d{3})-Q\d+$/);
const subjectCode = params.get('subject')
  || (/^CST\d{3}-/.test(paperParam) ? paperParam.split('-')[0] : null)
  || (queryQMatch ? queryQMatch[1] : null);
const paperCode = paperParam.match(/(?:^|-)(P\d{3})(?:-|$)/)?.[1]
  || (paperParam || (queryQMatch ? queryQMatch[2] : ''));

function shortSubject(code) {
  if (typeof window !== 'undefined' && typeof window.subjectLabel === 'function') {
    return window.subjectLabel(code);
  }
  return SUBJECT_NAMES[code] || 'Subject';
}

function canonicalPaperId() {
  if (paperMeta && paperMeta.fileName) {
    return paperMeta.fileName.replace(/\.json$/, '');
  }
  return subjectCode && paperCode ? `${subjectCode}-${paperCode}` : paperCode;
}

function canonicalQuestionUrl(q) {
  const url = new URL('answers.html', window.location.href);
  url.hash = '';
  url.search = new URLSearchParams({ paper: canonicalPaperId(), q: q.id }).toString();
  return url.href;
}


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
    userAnswers = JSON.parse(StudyStorage.legacy.getItem(storageKey('answers'))) || {};
    userResults = JSON.parse(StudyStorage.legacy.getItem(storageKey('results'))) || {};
    bookmarks = JSON.parse(StudyStorage.legacy.getItem(storageKey('bookmarks'))) || [];
  } catch {
    userAnswers = {};
    userResults = {};
    bookmarks = [];
  }
}

function saveState() {
  StudyStorage.legacy.setItem(storageKey('answers'), JSON.stringify(userAnswers));
  StudyStorage.legacy.setItem(storageKey('results'), JSON.stringify(userResults));
  StudyStorage.legacy.setItem(storageKey('bookmarks'), JSON.stringify(bookmarks));
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
  if (!subjectCode || !paperCode) {
    return showError('Requested paper was not specified. Return to the papers list to pick one.');
  }

  loadState();

  try {
    const regRes = await fetch(`../_data/${subjectCode}/registry.json`);
    if (!regRes.ok) throw new Error('Requested paper is not in the archive.');
    const registry = await regRes.json();

    paperMeta = registry.papers.find(p => p.paperCode === paperCode);
    if (!paperMeta) throw new Error('Requested paper is not in the archive.');
    if (/^CST\d{3}-P\d{3}-\d{4}-\d{2}$/.test(paperParam)
        && paperMeta.fileName.replace(/\.json$/, '') !== paperParam) {
      throw new Error('Requested paper is not in the archive.');
    }

    const paperRes = await fetch(`../_data/${subjectCode}/${paperMeta.fileName}`);
    if (!paperRes.ok) throw new Error('Requested paper file could not be loaded.');
    const paperData = await paperRes.json();

    questions = paperData.questions || [];
    if (questions.length === 0) throw new Error('No questions are recorded in this paper.');

    const sessionLabel = paperMeta.examSession || `${paperMeta.month} ${paperMeta.year}`;
    const setLabel = paperMeta.scanSetNumber ? ` · Set ${paperMeta.scanSetNumber}` : '';
    const fullName = SUBJECT_NAMES[subjectCode] || shortSubject(subjectCode);
    const shortName = shortSubject(subjectCode);

    document.getElementById('headerTitle').textContent =
      `${fullName} · ${paperMeta.paperCode}`;
    document.getElementById('headerSub').textContent =
      `${fullName} · ${sessionLabel}${setLabel}`;
    document.getElementById('sidebarTitle').textContent = sessionLabel;
    document.title =
      `${shortName} · ${sessionLabel} — PYQ Answers`;

    const ls = document.getElementById('loadingScreen');
    ls.classList.add('fade-out');
    setTimeout(() => {
      ls.classList.add('hidden');
      document.getElementById('appShell').classList.remove('hidden');
    }, 400);

    const target = params.get('q');
    let deepLinkMatched = false;
    if (target) {
      const index = questions.findIndex(q => q.id === target);
      if (index >= 0) {
        currentIndex = index;
        deepLinkMatched = true;
      } else {
        document.getElementById('headerSub').textContent +=
          ' · Requested question not found; showing this paper.';
      }
    }
    buildSidebar();
    buildNavDots();
    updateProgress();
    renderView();
    initSwipe();
    if (deepLinkMatched) {
      setTimeout(() => {
        const cards = Array.from(document.querySelectorAll('#questionContainer .question-card'));
        const card = cards.find(el => el.getAttribute('data-question-id') === target) || cards[0];
        if (window.StudyShare && typeof window.StudyShare.highlight === 'function') {
          window.StudyShare.highlight(card);
        } else if (card) {
          card.focus();
          card.scrollIntoView({ block: 'center' });
        }
      }, 450);
    }

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
  const options = getOptions(q);
  const correctIndex = getCorrectIndex(q, options);
  const isMCQ = options && options.length > 0;
  const isAnswered = isMCQ ? prevResult !== undefined : false;
  const isAnswerVisible = visibleAnswers.has(q.id);

  const typeLabel = TYPE_LABELS[q.type] || q.type || 'Question';
  const diffClass = q.difficulty ? `q-badge-difficulty-${q.difficulty}` : '';
  // Owner decision (Phase 9C): the paper's source note belongs ABOVE the
  // question, next to the action icons, not buried under the answer body.
  const sourceNoteHTML = q.sourceNote
    ? `<div class="source-note"><strong>Source note:</strong> ${escapeHtml(q.sourceNote)}</div>`
    : '';
  const syllabusNoteHTML = q.syllabusNote
    ? `<div class="syllabus-note"><strong>Syllabus note:</strong> ${escapeHtml(q.syllabusNote)}</div>`
    : '';


  let bodyHTML = '';

  if (isMCQ) {
    bodyHTML = `
      <div class="q-text rich-content">${renderRichContent(q.question)}</div>
      <div class="mcq-grid">
        ${options.map((opt, oi) => {
          let cardClass = 'mcq-card';
          let iconHTML = '';

          if (isAnswered) {
            cardClass += ' disabled';
            if (oi === correctIndex) {
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
              <span class="mcq-letter">${opt.key || OPTION_LETTERS[oi]}</span>
              <span class="mcq-text">${escapeHtml(opt.text)}</span>
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
        ${q.group ? `<span class="q-badge q-badge-group">Group ${q.group}</span>` : ''}
        ${q.sourceNumber ? `<span class="q-badge q-badge-source">Source ${q.sourceNumber}</span>` : ''}
        ${q.markSplit && q.group === 'B' ? `<span class="q-badge q-badge-split">${q.markSplit}</span>` : ''}
        ${q.unit ? `<span class="q-badge q-badge-unit">Unit ${q.unit}</span>` : ''}
        ${q.difficulty ? `<span class="q-badge ${diffClass}">${q.difficulty}</span>` : ''}
        <span class="q-header-spacer"></span>
        <button class="q-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" id="bookmarkBtn" aria-label="Bookmark">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div class="q-notices-host">${sourceNoteHTML}${syllabusNoteHTML}</div>
      <div class="q-body">${bodyHTML}</div>
      ${feedbackHTML}
      ${theoryAnswerHTML}
    </div>
  `;

  attachPracticeEvents(q, isMCQ, isAnswered, correctIndex);
  buildNavDots();
}

function attachPracticeEvents(q, isMCQ, isAnswered, correctIndex) {
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
  if (isMCQ && correctIndex >= 0 && !isAnswered) {
    document.querySelectorAll('.mcq-card').forEach(card => {
      const handler = () => {
        const sel = parseInt(card.dataset.index);
        const correct = sel === correctIndex;
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
  decorateQuestionLinks();
}


// ═══════════════════════════════════════════════════════════
//  REVIEW MODE
// ═══════════════════════════════════════════════════════════

function renderReviewView() {
  const container = document.getElementById('questionContainer');
  let html = '';

  questions.forEach((q, i) => {
    const isBookmarked = bookmarks.includes(q.id);
    const options = getOptions(q);
    const correctIndex = getCorrectIndex(q, options);
    const isMCQ = options && options.length > 0;
    const typeLabel = TYPE_LABELS[q.type] || q.type || 'Question';
    const diffClass = q.difficulty ? `q-badge-difficulty-${q.difficulty}` : '';
  const sourceNoteHTML = q.sourceNote
    ? `<div class="source-note"><strong>Source note:</strong> ${escapeHtml(q.sourceNote)}</div>`
    : '';
  const syllabusNoteHTML = q.syllabusNote
    ? `<div class="syllabus-note"><strong>Syllabus note:</strong> ${escapeHtml(q.syllabusNote)}</div>`
    : '';


    let mcqHtml = '';
    if (isMCQ) {
      mcqHtml = '<div style="margin-top:0.5rem;">';
      options.forEach((opt, oi) => {
        const marker = oi === correctIndex
          ? ' <strong style="color:var(--success)">[Correct]</strong>'
          : '';
        mcqHtml += `<p style="margin:0.2rem 0;font-size:0.9rem;">
          ${opt.key || OPTION_LETTERS[oi]}) ${escapeHtml(opt.text)}${marker}
        </p>`;
      });
      mcqHtml += '</div>';
    }

    let correctOptionHtml = '';
    if (isMCQ && correctIndex >= 0) {
      correctOptionHtml = `
        <div class="review-correct-option">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Answer: ${options[correctIndex].key || OPTION_LETTERS[correctIndex]}) ${escapeHtml(options[correctIndex].text)}</span>
        </div>
      `;
    }

    html += `
      <div class="question-card" id="review-q-${i}">
        <div class="q-header">
          <span class="q-number">Q${i + 1}</span>
          <span class="q-badge q-badge-type">${typeLabel}</span>
          <span class="q-badge q-badge-marks">${q.marks}m</span>
          ${q.group ? `<span class="q-badge q-badge-group">Group ${q.group}</span>` : ''}
          ${q.sourceNumber ? `<span class="q-badge q-badge-source">Source ${q.sourceNumber}</span>` : ''}
          ${q.markSplit && q.group === 'B' ? `<span class="q-badge q-badge-split">${q.markSplit}</span>` : ''}
          ${q.unit ? `<span class="q-badge q-badge-unit">Unit ${q.unit}</span>` : ''}
          ${q.difficulty ? `<span class="q-badge ${diffClass}">${q.difficulty}</span>` : ''}
          <span class="q-header-spacer"></span>
          <button class="q-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-qid="${q.id}" aria-label="Bookmark">
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
        <div class="q-notices-host">${sourceNoteHTML}${syllabusNoteHTML}</div>
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
  decorateQuestionLinks();
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

const printAnswersBox = document.getElementById('printIncludeAnswers');
if (printAnswersBox) {
  printAnswersBox.addEventListener('change', () => {
    if (!document.getElementById('printOverlay').classList.contains('hidden')) buildPrintContent();
  });
}

document.querySelectorAll('.print-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.print-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('printContent').dataset.size = btn.dataset.size;
  });
});

function printIncludeAnswers() {
  const box = document.getElementById('printIncludeAnswers');
  return !box || box.checked;
}

// One answer's markup, without its wrapper, so a question sheet and an answer
// key can be built from the same source text.
function printAnswerBody(q) {
  if (!q.answer) return '';
  const answerText = q.answer.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  let html = '';
  const hasExplicitCode = answerText.includes('```');

  if (hasExplicitCode) {
    html += `<div class="print-answer-label">Answer</div>`;
    const parts = answerText.split(/```\w*\n?/);
    parts.forEach((part, pi) => {
      if (pi % 2 === 0) {
        if (part.trim()) html += `<div class="print-answer-text">${escapeHtml(part)}</div>`;
      } else {
        html += `<div class="print-code-block">${escapeHtmlForCode(part)}</div>`;
      }
    });
    return html;
  }

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

  if (!hasAutoCode) {
    return `<div class="print-answer-label">Answer</div>
      <div class="print-answer-text">${escapeHtml(answerText)}</div>`;
  }

  html += `<div class="print-answer-label">Answer</div>`;
  let inCode = false;
  const codeBuffer = [];
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
      codeBuffer.length = 0;
    }
  };
  for (const al of ansLines) {
    if (isCodeLine(al.trim()) || al.trim() === '{' || al.trim() === '}' || al.trim() === '};') {
      if (!inCode) { flushText(); inCode = true; }
      codeBuffer.push(al);
    } else {
      if (inCode) { flushCode(); inCode = false; }
      textBuffer.push(al);
    }
  }
  flushText();
  flushCode();
  return html;
}

// Questions always print first. Answers, when included, start on a new page so
// a question sheet can be handed out on its own. Nothing here is an official
// marking scheme: the answers are the stored model answers.
function buildPrintContent() {
  const c = document.getElementById('printContent');
  const subName = SUBJECT_NAMES[subjectCode] || shortSubject(subjectCode);
  const includeAnswers = printIncludeAnswers();

  let html = `
    <div class="print-header">
      <h1>${escapeHtml(subName)}</h1>
      <p>Previous Year Questions with Answers</p>
      <p>${paperMeta.month} ${paperMeta.year} · Paper: ${paperMeta.sourcePaperCode || paperMeta.paperCode}</p>
      <p>Total: ${questions.length} Questions</p>
      <p>${includeAnswers ? 'Answers are stored model answers, not an official marking scheme.' : 'Question sheet only — answers left out.'}</p>
    </div>
  `;

  let answersHtml = '';

  questions.forEach((q, i) => {
    const options = getOptions(q);
    const correctIndex = getCorrectIndex(q, options);
    const isMCQ = options && options.length > 0;

    html += `<div class="print-q-block">`;
    html += `<div class="print-q-num">Q${i + 1}. [${TYPE_LABELS[q.type] || q.type}] [${q.marks}m]${q.unit ? ` [Unit ${q.unit}]` : ''}</div>`;
    html += `<div class="print-q-text">${escapeHtml(q.question)}</div>`;

    if (isMCQ) {
      html += '<div class="print-q-options">';
      options.forEach((opt, oi) => {
        html += `<div class="print-q-option">
          ${opt.key || OPTION_LETTERS[oi]}) ${escapeHtml(opt.text)}
        </div>`;
      });
      html += '</div>';
    }
    html += '</div>';

    if (includeAnswers && (q.answer || isMCQ)) {
      answersHtml += `<div class="print-q-block print-answer-item">`;
      answersHtml += `<div class="print-q-num">Q${i + 1}.</div>`;
      if (isMCQ && correctIndex >= 0) {
        const correct = options[correctIndex];
        answersHtml += `<div class="print-correct-line">Correct option: ${escapeHtml(correct.key || OPTION_LETTERS[correctIndex])}) ${escapeHtml(correct.text)}</div>`;
      }
      answersHtml += printAnswerBody(q);
      answersHtml += '</div>';
    }
  });

  if (includeAnswers) {
    html += `<section class="print-answers-section"><h2>Answers</h2>${answersHtml}</section>`;
  }

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

let repeatIndexPromise = null;
function loadRepeatIndex() {
  if (!repeatIndexPromise) {
    repeatIndexPromise = fetch('../assets/search/repeated.json')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        const map = new Map();
        for (const group of data?.groups || []) {
          const canonical = group.canonical;
          const all = group.appearances || [];
          for (const item of all) {
            map.set(item.id, {
              canonical,
              others: all.filter(other => other.id !== item.id)
            });
          }
        }
        return map;
      })
      .catch(() => new Map());
  }
  return repeatIndexPromise;
}

init();

// Canonical links contain source identity, never local answers or student data.
function decorateQuestionLinks() {
  const sessionLabel = paperMeta
    ? (paperMeta.examSession || `${paperMeta.month || ''} ${paperMeta.year || ''}`.trim())
    : '';
  const shortName = shortSubject(subjectCode);
  const targetQ = params.get('q');

  document.querySelectorAll('#questionContainer .question-card').forEach((card, index) => {
    const qIndex = currentMode === 'practice' ? currentIndex : index;
    const q = questions[qIndex];
    if (!q) return;
    card.querySelector('.question-share')?.remove();
    card.tabIndex = -1;
    card.setAttribute('data-question-id', q.id);

    const shareUrl = canonicalQuestionUrl(q);
    const cleanStem = String(q.question || '').replace(/\s+/g, ' ').trim();
    const shareTitle = `${shortName} · Q${qIndex + 1}${sessionLabel ? ` (${sessionLabel})` : ''}`;
    const shareText = `${shortName}${sessionLabel ? ` (${sessionLabel})` : ''}: ${cleanStem.slice(0, 120)}`;

    const controls = document.createElement('div');
    controls.className = 'question-share';

    // Icons are inline SVG: no new request, they inherit currentColor, and the
    // visible text label stays next to each one for screen readers and print.
    // Compact glyphs for the header action row. Each is icon-only on screen;
    // the accessible name and the tooltip carry the wording, and the label is
    // still exposed to assistive tech via aria-label on the control.
    const ICONS = {
      copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
      share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'copy-question-link q-action';
    copy.innerHTML = ICONS.copy;
    copy.setAttribute('aria-label', 'Copy link to this question');
    copy.title = 'Copy link';

    const share = document.createElement('button');
    share.type = 'button';
    share.className = 'share-question-link q-action';
    share.innerHTML = ICONS.share;
    share.setAttribute('aria-label', 'Share this question');
    share.title = 'Share';

    const status = document.createElement('span');
    status.className = 'share-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    copy.addEventListener('click', () => {
      window.StudyShare.copy(shareUrl, {
        button: copy,
        container: controls,
        statusEl: status,
        inputLabel: 'Question link — select and copy'
      });
    });

    share.addEventListener('click', () => {
      window.StudyShare.share(
        { title: shareTitle, text: shareText, url: shareUrl },
        {
          button: share,
          copyButton: copy,
          container: controls,
          statusEl: status,
          inputLabel: 'Question link — select and copy'
        }
      );
    });

    // Provenance is a <details> panel in the header action group so the
    // citation, copy and share all sit as one icon cluster next to the
    // bookmark (owner request), instead of a full-width row that pushed the
    // question text off a phone screen.
    const provenance = document.createElement('details');
    provenance.className = 'question-provenance q-action';
    const provenanceSummary = document.createElement('summary');
    provenanceSummary.innerHTML = ICONS.info;
    provenanceSummary.setAttribute('aria-label', 'Source and verification details');
    provenanceSummary.title = 'Source and verification details';
    const provenanceBody = document.createElement('p');
    provenanceBody.textContent =
      `Question wording: ${q.sourceStatus || 'unverified'}. Answer: ${q.answerStatus || 'unverified'} (stored model answer, not an official key). `
      + `Citation: ${q.sourcePage || 'not recorded'}. `
      + (q.verifiedOn
        ? `Owner-verified on ${q.verifiedOn}.`
        : 'No owner sign-off date is recorded, so this answer is not certified.');
    provenance.append(provenanceSummary, provenanceBody);
    // Keep `question-share` as the semantic hook existing tests and the
    // print sheet rely on; `q-actions` adds the compact icon-cluster layout.
    controls.className = 'question-share q-actions';
    controls.append(copy, share, provenance, status);

    // Sit the icon cluster inside the question header, immediately before the
    // bookmark, so the row reads [copy][share][info][bookmark].
    const header = card.querySelector('.q-header');
    const bookmark = header && header.querySelector('.q-bookmark-btn');
    if (bookmark && bookmark.parentNode === header) {
      bookmark.insertAdjacentElement('beforebegin', controls);
    } else if (header && header.parentNode === card) {
      header.append(controls);
    } else {
      card.prepend(controls);
    }

    loadRepeatIndex().then(repeatMap => {
      const info = repeatMap.get(q.id);
      if (!info || !controls.isConnected) return;
      const dup = document.createElement('p');
      dup.className = 'question-duplicates';
      const prefix = info.canonical.id === q.id
        ? 'Exact duplicate also appeared in: '
        : 'Also appeared identically in: ';
      dup.append(document.createTextNode(prefix));
      info.others.forEach((other, idx) => {
        if (idx > 0) dup.append(document.createTextNode(' · '));
        const link = document.createElement('a');
        const otherUrl = new URL('answers.html', window.location.href);
        otherUrl.hash = '';
        if (other.paperId) {
          otherUrl.search = new URLSearchParams({ paper: other.paperId, q: other.id }).toString();
        } else {
          otherUrl.search = new URLSearchParams({ subject: other.subject, paper: other.paper, q: other.id }).toString();
        }
        link.href = otherUrl.href;
        const labelParts = [shortSubject(other.subject), `${other.month || ''} ${other.year || ''}`.trim()].filter(Boolean);
        link.textContent = `${labelParts.join(' · ')} (${other.paper})`;
        dup.append(link);
      });
      controls.append(dup);
    });

    if (targetQ && targetQ === q.id) {
      card.classList.add('is-deeplink-target');
      card.setAttribute('data-deeplink', 'active');
      document.title = `${shortName} · Q${qIndex + 1} — ${cleanStem.slice(0, 60)}`;
    }
  });
}
