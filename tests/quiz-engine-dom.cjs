/* Deterministic Phase 3 quiz/exam engine contract tests (exports, honest labels,
 * setup/viewer wiring, script load order, and bundle freshness) — zero external deps.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// 1. Honest labels: zero fictional "AI" labels across quiz/*.html and quiz/js/*.js
const quizFiles = [
  ...fs.readdirSync(path.join(ROOT, 'quiz')).filter(f => f.endsWith('.html')).map(f => 'quiz/' + f),
  ...fs.readdirSync(path.join(ROOT, 'quiz/js')).filter(f => f.endsWith('.js')).map(f => 'quiz/js/' + f)
];
for (const rel of quizFiles) {
  const txt = read(rel);
  assert(!/\bAI\b/.test(txt), `Unexpected "AI" label in ${rel}`);
}
console.log('PASS honest labels: zero fictional AI references across quiz HTML/JS');

// 2. Export format explanations on quiz/export.html (each format has a clear explanation)
const exportHtml = read('quiz/export.html');
for (const label of ['Markdown (.md)', 'Plain Text (.txt)', 'JSON (.json)', 'Print / Save as PDF:', 'id="btn-print-export"']) {
  assert(exportHtml.includes(label), `quiz/export.html missing format explanation: ${label}`);
}
console.log('PASS export format cards and descriptions present on quiz/export.html');

// 3. Script load order in quiz/index.html & bundle parity
const quizIndexHtml = read('quiz/index.html');
const storeIdx = quizIndexHtml.indexOf('js/attempt-store.js');
const mistakesIdx = quizIndexHtml.indexOf('js/mistakes.js');
assert(storeIdx !== -1 && mistakesIdx !== -1 && storeIdx < mistakesIdx, 'attempt-store.js must load before mistakes.js in quiz/index.html');

const { execFileSync } = require('node:child_process');
execFileSync('python3', [path.join(ROOT, 'scripts/build_runtime_bundles.py'), '--check'], { stdio: 'pipe' });
console.log('PASS script load order and runtime bundle byte parity verified');

// 4. PYQ viewer -> Mock Paper entry link + Setup paper selector + Storage reset-list inclusion
const viewerJs = read('pyq/js/viewer.js');
assert(viewerJs.includes('paperFile:meta.fileName') && viewerJs.includes('../quiz/play.html?'), 'PYQ viewer must link directly to mock paper play URL');
const setupHtml = read('quiz/setup.html');
assert(setupHtml.includes('id="paper-mode-title"') && setupHtml.includes('id="start-paper"'), 'quiz/setup.html must expose paper practice selector');
assert(!/2019|2020/.test(setupHtml), 'quiz/setup.html must not hardcode nonexistent 2019/2020 year chips');
const storageJs = read('assets/js/storage.js');
assert(storageJs.includes("'diploma-3rd-sem-quiz-mistakes'"), 'assets/js/storage.js reset/schema list must include diploma-3rd-sem-quiz-mistakes');
console.log('PASS PYQ viewer entry, setup paper selector, no static 2019/2020 years, and reset-list inclusion');

// 5. Export serializers (common.js): wrong vs unanswered, 2-mark MCQ explanation export, attempt-specific metadata
const map = new Map();
const localStorage = new Proxy({
  getItem: k => map.has(k) ? map.get(k) : null,
  setItem: (k, v) => map.set(k, String(v)),
  removeItem: k => map.delete(k)
}, { ownKeys: () => [...map.keys()], getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }) });

const sandbox = {
  window: {},
  document: {
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    documentElement: { setAttribute: () => {}, dataset: {}, style: { setProperty: () => {} } }
  },
  localStorage,
  StudyStorage: { legacy: localStorage, theme: () => 'light', setTheme: () => {} },
  location: { search: '', pathname: '/Diploma-3rd-sem/quiz/export.html' },
  URL,
  URLSearchParams,
  Date,
  Math,
  JSON,
  Set,
  Map,
  Array,
  Object,
  String,
  Number,
  Boolean,
  RegExp,
  Error,
  parseInt,
  parseFloat,
  isNaN,
  encodeURIComponent,
  decodeURIComponent,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  console
};
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
vm.runInNewContext(read('quiz/js/attempt-store.js'), sandbox);
const commonExports = vm.runInNewContext(
  read('quiz/js/common.js') + '\n;({ generateExport });',
  sandbox
);

const exportData = {
  subject: 'CST205',
  unit: 'all',
  mode: 'all',
  questions: [
    {
      id: 'CST205-P006-Q01',
      type: 'mcq',
      question: 'Which normal form removes transitive dependency?',
      options: { A: '1NF', B: '2NF', C: '3NF', D: 'BCNF' },
      correct: 'C',
      explanation: '3NF eliminates transitive functional dependencies.',
      marks: 2,
      optionMarks: 1,
      explanationMarks: 1
    },
    {
      id: 'CST205-P006-Q02',
      type: 'mcq',
      question: 'Unanswered MCQ question?',
      options: { A: 'Opt A', B: 'Opt B' },
      correct: 'A',
      explanation: 'Opt A is right.',
      marks: 2,
      optionMarks: 1,
      explanationMarks: 1
    },
    {
      id: 'CST205-P006-Q16',
      type: 'theory',
      question: 'Explain ACID properties.',
      modelAnswer: 'Atomicity, Consistency, Isolation, Durability.',
      marks: 8
    }
  ],
  answers: {
    'CST205-P006-Q01': 'B',
    'CST205-P006-Q16': 'Atomicity means all-or-nothing.'
  },
  explanations: {
    'CST205-P006-Q01': 'Because non-prime attributes depend on superkey.'
  },
  score: null,
  total: 3,
  totalMarks: 12,
  metadata: { attemptId: 'hist-attempt-demo', date: 1800000000000 }
};

const md = commonExports.generateExport('md', exportData);
assert(md.includes('**User Explanation (1 mark — manual review):**'));
assert(md.includes('Because non-prime attributes depend on superkey.'));
assert(md.includes('Correct option: C — 3NF eliminates transitive functional dependencies.'));

const txt = commonExports.generateExport('txt', exportData);
assert(txt.includes('Your Expl.   : Because non-prime attributes depend on superkey.'));

const jsonStr = commonExports.generateExport('json', exportData);
const parsed = JSON.parse(jsonStr);
assert.equal(parsed.quiz.attemptId, 'hist-attempt-demo');
assert.equal(parsed.questions[0].isCorrect, false); // wrong MCQ -> false
assert.equal(parsed.questions[0].userExplanation, 'Because non-prime attributes depend on superkey.');
assert.equal(parsed.questions[1].isCorrect, null);  // unanswered MCQ -> null (never conflated with wrong!)
assert.equal(parsed.questions[2].isCorrect, null);  // subjective -> null
console.log('PASS export serializers preserve wrong vs unanswered, 1-mark written explanations, and attemptId metadata');
