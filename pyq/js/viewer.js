// ─── Theme ───────────────────────────────────────────────
const savedTheme = StudyStorage.legacy.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);

// ─── URL Params ──────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const subjectCode = params.get('subject');
const paperCode = params.get('paper');

// ─── Subject Names ───────────────────────────────────────
const SUBJECT_NAMES = {
  CST201: 'Computer Programming in C',
  CST203: 'Scripting Languages (Python)',
  CST205: 'Data Structures',
  CST207: 'Computer System Organization',
  CST209: 'Algorithms'
};

// ─── Validate Params ─────────────────────────────────────
function showError(msg) {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('errorState').classList.remove('hidden');
  document.getElementById('errorMessage').textContent = msg;
}

if (!subjectCode || !paperCode) {
  showError('Invalid paper URL. Subject or paper code missing.');
}

// ─── Load Data ───────────────────────────────────────────
async function loadPaper() {
  try {
    // Step 1: Load registry to get fileName
    const regRes = await fetch(`../_data/${subjectCode}/registry.json`);
    if (!regRes.ok) throw new Error('Registry not found');
    const registry = await regRes.json();

    const paperMeta = registry.papers.find(p => p.paperCode === paperCode);
    if (!paperMeta) throw new Error(`Paper ${paperCode} not found in registry`);

    // Step 2: Load the actual paper JSON
    const paperRes = await fetch(`../_data/${subjectCode}/${paperMeta.fileName}`);
    if (!paperRes.ok) throw new Error('Paper file not found');
    const paperData = await paperRes.json();

    // Step 3: Render
    renderPaper(paperData, paperMeta);

  } catch (err) {
    console.error(err);
    showError(err.message || 'Failed to load question paper.');
  }
}

// ─── Render Paper ────────────────────────────────────────
function renderPaper(data, meta) {
  const subjectName = SUBJECT_NAMES[data.subject] || data.subject;
  const session = data.examSession || meta.examSession || `${meta.month} ${meta.year}`;
  const duration = data.duration || (data.paperFormat && data.paperFormat.timeAllowed) || meta.duration || '3 Hours';
  const sourceCode = data.sourcePaperCode || meta.sourcePaperCode || '—';
  const setNumber = data.scanSetNumber || meta.scanSetNumber || '';

  // Update toolbar
  document.getElementById('toolbarTitle').textContent =
    `${data.subject} · ${session} · ${data.paperCode}`;
  document.title = `${data.subject} ${session} | PYQ`;

  const practiceLink = document.getElementById('practiceLink');
  if (practiceLink) {
    practiceLink.href = `answers.html?subject=${subjectCode}&paper=${paperCode}`;
  }

  let attempt = document.getElementById('attempt-paper-link');
  if (!attempt) {
    attempt = document.createElement('a'); attempt.id='attempt-paper-link'; attempt.className='tool-btn';
    attempt.textContent='Attempt this paper';
    document.getElementById('practiceLink')?.parentElement.append(attempt);
  }
  attempt.href='../quiz/play.html?'+new URLSearchParams({subject:subjectCode,paperFile:meta.fileName});

  // Fill paper header
  document.getElementById('paperSubjectName').textContent =
    `${subjectName} (${data.subject})`;
  document.getElementById('paperSourceCode').textContent =
    `Paper Code: ${sourceCode}${setNumber ? ` · Set ${setNumber}` : ''}`;
  document.getElementById('paperMonthYear').textContent = session;

  const paperDuration = document.getElementById('paperDuration');
  if (paperDuration) paperDuration.textContent = `Time: ${duration}`;

  // Calculate total marks
  const totalMarks = data.fullMarks ||
    (data.paperFormat && data.paperFormat.totalMarks) ||
    data.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  document.getElementById('paperTotalMarks').textContent =
    `Full Marks: ${totalMarks}`;

  const sourceNote = document.getElementById('paperSourceNote');
  if (sourceNote) {
    const noteParts = [];
    if (data.sourceFile) noteParts.push(`Source: ${data.sourceFile}`);
    if (data.sourceStatus) noteParts.push(data.sourceStatus);
    if (data.answerKeyStatus) noteParts.push(data.answerKeyStatus);
    if (data.sourceNote) noteParts.push(data.sourceNote);
    sourceNote.textContent = noteParts.join(' · ');
  }

  // Render full exam paper for print / Save as PDF
  const body = document.getElementById('paperBody');
  body.innerHTML = '';

  if (data.paperFormat && data.paperFormat.groups) {
    // Use paperFormat for structured rendering
    renderWithFormat(body, data);
  } else {
    // Fallback: group by marks
    renderWithFallback(body, data);
  }

  // Render a compact question overview for screen reading
  const overview = document.getElementById('paperOverview');
  if (overview) {
    renderOverview(overview, data);
  }

  // Show paper
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('paperWrapper').classList.remove('hidden');
}

// ─── Compact screen overview ──────────────────────────────
function renderOverview(container, data) {
  container.innerHTML = '';

  const intro = document.createElement('div');
  intro.className = 'overview-intro';
  const introTitle = document.createElement('strong');
  introTitle.textContent = 'Screen overview';
  const introText = document.createElement('span');
  introText.textContent = ' MCQ options and code snippets are shown below. Use Print / Save as PDF for the complete exam paper with full wording, subparts, and print layout.';
  intro.appendChild(introTitle);
  intro.appendChild(introText);
  container.appendChild(intro);

  const groups = buildOverviewGroups(data);

  groups.forEach(group => {
    const card = document.createElement('section');
    card.className = 'overview-group';

    const heading = document.createElement('h2');
    heading.textContent = group.groupLabel;
    card.appendChild(heading);

    const meta = document.createElement('div');
    meta.className = 'overview-meta';
    if (Array.isArray(group.sections) && group.sections.length > 0) {
      meta.textContent =
        `${group.totalSet} question${group.totalSet === 1 ? '' : 's'} · answer any ${group.answerAny} · mixed marks by section · ${group.maxMarks} marks total`;
    } else {
      meta.textContent =
        `${group.totalSet} question${group.totalSet === 1 ? '' : 's'} · answer any ${group.answerAny} · ${group.marksEach} mark${group.marksEach === 1 ? '' : 's'} each · ${group.maxMarks} marks total`;
    }
    card.appendChild(meta);

    const list = document.createElement('ol');
    list.className = 'overview-list';

    group.questions.forEach((q, i) => {
      const item = document.createElement('li');
      item.className = 'overview-item';

      const num = document.createElement('span');
      num.className = 'overview-num';
      num.textContent = q.sourceNumber || `${i + 1}`;

      const text = document.createElement('div');
      text.className = 'overview-text';
      appendOverviewContent(text, q);

      const marks = document.createElement('span');
      marks.className = 'overview-marks';
      marks.textContent = `${q.marks}m`;

      item.appendChild(num);
      item.appendChild(text);
      item.appendChild(marks);
      list.appendChild(item);
    });

    card.appendChild(list);
    container.appendChild(card);
  });

  const note = document.createElement('div');
  note.className = 'overview-print-note';
  note.textContent = 'Use Print / Save as PDF to view or export the complete exam paper.';
  container.appendChild(note);
}

function buildOverviewGroups(data) {
  if (data.paperFormat && Array.isArray(data.paperFormat.groups)) {
    const byId = new Map(data.questions.map(q => [q.id, q]));
    return data.paperFormat.groups.map((group, i) => {
      let questions = [];
      if (Array.isArray(group.questionIds) && group.questionIds.length > 0) {
        questions = group.questionIds.map(id => byId.get(id)).filter(Boolean);
      } else if (Array.isArray(group.marksFilter)) {
        questions = data.questions.filter(q => group.marksFilter.includes(q.marks));
      }
      const marksEach = group.marksEach || (questions[0] && questions[0].marks) || 0;
      const answerAny = group.answerAny || questions.length;
      return {
        groupLabel: group.groupLabel || group.title || `Group ${group.id || i + 1}`,
        totalSet: group.totalSet || questions.length,
        answerAny,
        marksEach,
        maxMarks: group.maxMarks || marksEach * answerAny,
        sections: Array.isArray(group.sections) ? group.sections : null,
        questions
      };
    }).filter(group => group.questions.length > 0);
  }

  // Legacy fallback: group by marks
  const buckets = {};
  data.questions.forEach(q => {
    const m = q.marks || 0;
    if (!buckets[m]) buckets[m] = [];
    buckets[m].push(q);
  });

  return Object.keys(buckets)
    .map(Number)
    .sort((a, b) => a - b)
    .map(m => ({
      groupLabel: `Group (${m} mark${m === 1 ? '' : 's'})`,
      totalSet: buckets[m].length,
      answerAny: buckets[m].length,
      marksEach: m,
      maxMarks: m * buckets[m].length,
      questions: buckets[m]
    }));
}

function summarizeQuestion(q) {
  let text = String(q.question || '')
    .replace(/```[\s\S]*?```/g, ' [code] ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text && q.topic) text = q.topic;
  if (text.length > 120) text = text.slice(0, 117).trim() + '…';
  return text || 'Question';
}

function appendOverviewContent(container, q) {
  const summary = document.createElement('div');
  summary.className = 'overview-summary';
  summary.textContent = summarizeQuestion(q);
  container.appendChild(summary);

  const questionText = String(q.question || '');
  const subpartText = Array.isArray(q.subparts)
    ? q.subparts.map(sp => (sp && sp.text) ? String(sp.text) : '').join('\n')
    : '';
  const sourceText = [questionText, subpartText].filter(Boolean).join('\n');
  const codeBlocks = extractOverviewCodeBlocks(sourceText);

  if (codeBlocks.length > 0) {
    codeBlocks.forEach(code => {
      const pre = document.createElement('pre');
      pre.className = 'overview-code';
      pre.textContent = code;
      container.appendChild(pre);
    });
  } else if (looksLikeCode(questionText)) {
    const pre = document.createElement('pre');
    pre.className = 'overview-code';
    pre.textContent = questionText.trim();
    container.appendChild(pre);
  }

  const options = normalizeOptions(q);
  if (options.length > 0) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'overview-options';
    options.forEach(opt => {
      const option = document.createElement('div');
      option.className = 'overview-option';
      option.textContent = `${opt.key}) ${opt.text}`;
      optionsDiv.appendChild(option);
    });
    container.appendChild(optionsDiv);
  }
}

function extractOverviewCodeBlocks(text) {
  const blocks = [];
  const pattern = /```[ \t]*[A-Za-z0-9+#_-]*[ \t]*\r?\n?([\s\S]*?)```/g;
  let match;
  while ((match = pattern.exec(String(text || ''))) !== null) {
    const code = match[1].trim();
    if (code) blocks.push(code);
  }
  return blocks;
}

function looksLikeCode(text) {
  const value = String(text || '');
  if (!value.includes('\n')) return false;
  return /(\b(?:printf|scanf|#include|#define|main\(|def |print\(|import |return|class )|[{;]|\b(?:int|float|char|void)\s+\w)/.test(value);
}

// ─── Render with paperFormat ─────────────────────────────
function renderWithFormat(container, data) {
  const format = data.paperFormat || {};

  if (Array.isArray(format.generalInstructions) && format.generalInstructions.length > 0) {
    const instructions = document.createElement('div');
    instructions.className = 'paper-instructions';
    instructions.innerHTML = '<strong>General instructions</strong>';
    const list = document.createElement('ul');
    format.generalInstructions.forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      list.appendChild(li);
    });
    instructions.appendChild(list);
    container.appendChild(instructions);
  }

  const byId = new Map(data.questions.map(q => [q.id, q]));

  format.groups.forEach((group, groupIndex) => {
    let groupQuestions = [];

    if (Array.isArray(group.questionIds) && group.questionIds.length > 0) {
      groupQuestions = group.questionIds.map(id => byId.get(id)).filter(Boolean);
    } else if (Array.isArray(group.marksFilter) && group.marksFilter.length > 0) {
      groupQuestions = data.questions.filter(q => group.marksFilter.includes(q.marks));
    }

    if (groupQuestions.length === 0) return;

    const section = document.createElement('section');
    section.className = 'group-section exam-group';

    // Group heading
    const heading = document.createElement('div');
    heading.className = 'group-heading';
    heading.textContent = group.groupLabel || group.title || `Group ${group.id || groupIndex + 1}`;
    section.appendChild(heading);

    // Instruction
    if (group.instruction) {
      const instruction = document.createElement('div');
      instruction.className = 'group-instruction';
      instruction.textContent = group.instruction;
      section.appendChild(instruction);
    }

    if (group.additionalInstruction) {
      const extra = document.createElement('div');
      extra.className = 'group-extra-instruction';
      extra.textContent = group.additionalInstruction;
      section.appendChild(extra);
    }

    if (Array.isArray(group.sections) && group.sections.length > 0) {
      const sectionInfo = document.createElement('div');
      sectionInfo.className = 'group-extra-instruction';
      sectionInfo.textContent = group.sections.map(s =>
        `${s.id}: ${s.title} — answer any ${s.answerAny} of ${s.totalSet}`
      ).join(' · ');
      section.appendChild(sectionInfo);
    }

    if (Array.isArray(group.choiceSets) && group.choiceSets.length > 0) {
      const choiceInfo = document.createElement('div');
      choiceInfo.className = 'group-extra-instruction';
      choiceInfo.textContent = `Choice sets: ${group.choiceSets.map(cs =>
        `${cs.id} (${cs.totalSet} alternatives, answer any ${cs.answerAny})`
      ).join(' · ')}`;
      section.appendChild(choiceInfo);
    }

    // Marks / choice note
    const marksNote = document.createElement('div');
    marksNote.className = 'group-marks-note';
    const choiceNote = group.answerAny && group.totalSet
      ? ` · answer any ${group.answerAny} of ${group.totalSet}`
      : '';
    if (Array.isArray(group.sections) && group.sections.length > 0) {
      const sectionMarks = group.sections.map(s =>
        `${s.marksEach} × ${s.answerAny} = ${s.maxMarks}`
      ).join(' + ');
      marksNote.textContent = `[${sectionMarks} = ${group.maxMarks}]${choiceNote}`;
    } else {
      marksNote.textContent =
        `[${group.marksEach || groupQuestions[0].marks} × ${group.answerAny || groupQuestions.length} = ${group.maxMarks || (group.marksEach || groupQuestions[0].marks) * (group.answerAny || groupQuestions.length)}]${choiceNote}`;
    }
    if (group.markSplit) {
      const split = document.createElement('span');
      split.className = 'group-mark-split';
      split.textContent = ` · ${group.markSplit}`;
      marksNote.appendChild(split);
    }
    section.appendChild(marksNote);

    // Questions
    groupQuestions.forEach((q, i) => {
      section.appendChild(buildQuestionElement(q, i + 1, group));
    });

    // Divider between groups
    if (groupIndex < format.groups.length - 1) {
      const divider = document.createElement('hr');
      divider.className = 'group-divider';
      section.appendChild(divider);
    }

    container.appendChild(section);
  });
}

// ─── Fallback Render (no paperFormat) ────────────────────
function renderWithFallback(container, data) {
  // Group questions by marks
  const groups = {};
  data.questions.forEach(q => {
    const m = q.marks || 0;
    if (!groups[m]) groups[m] = [];
    groups[m].push(q);
  });

  // Sort mark groups ascending
  const sortedMarks = Object.keys(groups).map(Number).sort((a, b) => a - b);

  const groupLabels = {
    1: 'Group A',
    2: 'Group B',
    5: 'Group C',
    6: 'Group D',
    10: 'Group E'
  };

  sortedMarks.forEach((marks, idx) => {
    const qs = groups[marks];
    const section = document.createElement('div');
    section.className = 'group-section';

    const label = groupLabels[marks] || `Group (${marks} marks)`;

    const heading = document.createElement('div');
    heading.className = 'group-heading';
    heading.textContent = label;
    section.appendChild(heading);

    const marksNote = document.createElement('div');
    marksNote.className = 'group-marks-note';
    marksNote.textContent = `[${marks} × ${qs.length} = ${marks * qs.length}]`;
    section.appendChild(marksNote);

    qs.forEach((q, i) => {
      section.appendChild(buildQuestionElement(q, i + 1, null));
    });

    if (idx < sortedMarks.length - 1) {
      const divider = document.createElement('hr');
      divider.className = 'group-divider';
      section.appendChild(divider);
    }

    container.appendChild(section);
  });
}

// ─── Build Single Question Element ───────────────────────
function buildQuestionElement(q, displayNum, group) {
  const item = document.createElement('div');
  item.className = 'question-item exam-question';

  // Number
  const num = document.createElement('div');
  num.className = 'question-number';
  if (q.sourceNumber) {
    num.textContent = group && group.id === 'A'
      ? `${q.sourceNumber})`
      : `${q.sourceNumber}.`;
  } else {
    num.textContent = `${displayNum}.`;
  }
  item.appendChild(num);

  // Content
  const content = document.createElement('div');
  content.className = 'question-content';

  const subparts = Array.isArray(q.subparts) && q.subparts.length > 0
    ? q.subparts
    : null;

  if (subparts) {
    const subpartsEl = document.createElement('div');
    subpartsEl.className = 'exam-subparts';
    subparts.forEach(sp => {
      const row = document.createElement('div');
      row.className = 'exam-subpart';
      const label = document.createElement('span');
      label.className = 'exam-subpart-label';
      label.textContent = `${sp.label})`;
      const text = document.createElement('span');
      text.className = 'exam-subpart-text';
      text.textContent = sp.text;
      const mark = document.createElement('span');
      mark.className = 'exam-subpart-mark';
      mark.textContent = `[${sp.marks}]`;
      row.appendChild(label);
      row.appendChild(text);
      row.appendChild(mark);
      subpartsEl.appendChild(row);
    });
    content.appendChild(subpartsEl);
  } else {
    const text = document.createElement('div');
    text.className = 'question-text';
    appendFormattedText(text, q.question || '');
    content.appendChild(text);
  }

  // MCQ options if present
  const options = normalizeOptions(q);
  if (options.length > 0) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'mcq-options exam-options';
    options.forEach(opt => {
      const optEl = document.createElement('div');
      optEl.className = 'mcq-option exam-option';
      optEl.textContent = `${opt.key}) ${opt.text}`;
      optionsDiv.appendChild(optEl);
    });
    content.appendChild(optionsDiv);
  }

  if (q.sourceNote) {
    const note = document.createElement('div');
    note.className = 'exam-note';
    note.textContent = `Source note: ${q.sourceNote}`;
    content.appendChild(note);
  }
  if (q.syllabusNote) {
    const note = document.createElement('div');
    note.className = 'exam-note exam-syllabus-note';
    note.textContent = `Syllabus note: ${q.syllabusNote}`;
    content.appendChild(note);
  }

  item.appendChild(content);

  // Marks
  const marks = document.createElement('div');
  marks.className = 'question-marks';
  if (q.markSplit && group && group.id === 'B') {
    marks.textContent = `[${q.markSplit}=${q.marks}]`;
  } else {
    marks.textContent = `[${q.marks}]`;
  }
  item.appendChild(marks);

  return item;
}

// ─── Helpers ─────────────────────────────────────────────
function normalizeOptions(q) {
  if (!q.options) return [];

  if (Array.isArray(q.options)) {
    return q.options.map((opt, i) => {
      if (typeof opt === 'string') {
        return { key: String.fromCharCode(65 + i), text: opt };
      }
      return {
        key: opt.key || opt.label || String.fromCharCode(65 + i),
        text: opt.text || opt.value || ''
      };
    });
  }

  if (typeof q.options === 'object') {
    return Object.entries(q.options).map(([key, value]) => ({
      key: key,
      text: String(value)
    }));
  }

  return [];
}

function appendFormattedText(container, text) {
  const parts = String(text || '').split('```');
  parts.forEach((part, idx) => {
    if (!part.trim()) return;
    if (idx % 2 === 1) {
      const lines = part.split('\n');
      if (/^[A-Za-z0-9+#_-]+$/.test(lines[0].trim())) lines.shift();
      const pre = document.createElement('pre');
      pre.className = 'exam-code';
      pre.textContent = lines.join('\n').trim();
      container.appendChild(pre);
    } else {
      const div = document.createElement('div');
      div.className = 'exam-question-text';
      div.textContent = part.trim();
      container.appendChild(div);
    }
  });
}

// ─── Print Button ────────────────────────────────────────
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// ─── Init ────────────────────────────────────────────────
if (subjectCode && paperCode) {
  loadPaper();
}
