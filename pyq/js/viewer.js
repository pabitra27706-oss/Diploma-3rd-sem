// ─── Theme ───────────────────────────────────────────────
const savedTheme = localStorage.getItem('theme') ||
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
  
  // Update toolbar
  document.getElementById('toolbarTitle').textContent =
    `${data.subject} · ${meta.month} ${meta.year}`;
  document.title = `${data.subject} ${meta.month} ${meta.year} | PYQ`;
  
  // Fill paper header
  document.getElementById('paperSubjectName').textContent =
    `${subjectName} (${data.subject})`;
  document.getElementById('paperSourceCode').textContent =
    `Paper Code: ${data.sourcePaperCode}`;
  document.getElementById('paperMonthYear').textContent =
    `${meta.month} ${meta.year}`;
  
  // Calculate total marks
  const totalMarks = data.paperFormat ?
    data.paperFormat.totalMarks :
    data.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  document.getElementById('paperTotalMarks').textContent =
    `Full Marks: ${totalMarks}`;
  
  // Render body
  const body = document.getElementById('paperBody');
  
  if (data.paperFormat && data.paperFormat.groups) {
    // Use paperFormat for structured rendering
    renderWithFormat(body, data);
  } else {
    // Fallback: group by marks
    renderWithFallback(body, data);
  }
  
  // Show paper
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('paperWrapper').classList.remove('hidden');
}

// ─── Render with paperFormat ─────────────────────────────
function renderWithFormat(container, data) {
  data.paperFormat.groups.forEach((group, groupIndex) => {
    // Filter questions for this group
    const groupQuestions = data.questions.filter(q =>
      group.marksFilter.includes(q.marks)
    );
    
    if (groupQuestions.length === 0) return;
    
    const section = document.createElement('div');
    section.className = 'group-section';
    
    // Group heading
    const heading = document.createElement('div');
    heading.className = 'group-heading';
    heading.textContent = group.groupLabel;
    section.appendChild(heading);
    
    // Instruction
    if (group.instruction) {
      const instruction = document.createElement('div');
      instruction.className = 'group-instruction';
      instruction.textContent = group.instruction;
      section.appendChild(instruction);
    }
    
    // Marks note
    const marksNote = document.createElement('div');
    marksNote.className = 'group-marks-note';
    const marksEach = group.marksFilter[0];
    marksNote.textContent = `[${marksEach} × ${groupQuestions.length} = ${marksEach * groupQuestions.length}]`;
    section.appendChild(marksNote);
    
    // Questions
    groupQuestions.forEach((q, i) => {
      section.appendChild(buildQuestionElement(q, i + 1));
    });
    
    // Divider between groups
    if (groupIndex < data.paperFormat.groups.length - 1) {
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
      section.appendChild(buildQuestionElement(q, i + 1));
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
function buildQuestionElement(q, displayNum) {
  const item = document.createElement('div');
  item.className = 'question-item';
  
  // Number
  const num = document.createElement('div');
  num.className = 'question-number';
  num.textContent = `${displayNum}.`;
  item.appendChild(num);
  
  // Content
  const content = document.createElement('div');
  content.className = 'question-content';
  
  const text = document.createElement('div');
  text.className = 'question-text';
  text.textContent = q.question;
  content.appendChild(text);
  
  // MCQ options if present
  if (q.options && Array.isArray(q.options)) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'mcq-options';
    const labels = ['(a)', '(b)', '(c)', '(d)'];
    q.options.forEach((opt, i) => {
      const optEl = document.createElement('div');
      optEl.className = 'mcq-option';
      optEl.textContent = `${labels[i] || `(${i + 1})`} ${opt}`;
      optionsDiv.appendChild(optEl);
    });
    content.appendChild(optionsDiv);
  }
  
  item.appendChild(content);
  
  // Marks
  const marks = document.createElement('div');
  marks.className = 'question-marks';
  marks.textContent = `[${q.marks}]`;
  item.appendChild(marks);
  
  return item;
}

// ─── Print Button ────────────────────────────────────────
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// ─── Init ────────────────────────────────────────────────
if (subjectCode && paperCode) {
  loadPaper();
}