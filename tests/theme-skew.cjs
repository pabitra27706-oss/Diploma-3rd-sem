/* Regression for a real report: after a phase that adds `StudyStorage.theme()`,
 * a browser that still has the previous `assets/js/storage.js` in a service-worker
 * cache loads the new page scripts against the old module.
 *
 * Symptom before the guard: `TypeError: StudyStorage.theme is not a function`
 * thrown from a page script, which aborted PYQ/practice/quiz init and left the
 * quiz theme toggle unattached.
 *
 * The contract now: reading or saving the theme may fail, but it must never
 * abort page initialisation, and the toggle must still repaint.
 */
'use strict';

const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { ROOT } = require('./lib/minidom.cjs');

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/* ── 1. Static audit: every theme read/save is guarded ──────────────── */
{
  const guarded = {
    'pyq/js/index.js': /try \{ return StudyStorage\.theme\(\); \}/,
    'pyq/js/viewer.js': /try \{ return StudyStorage\.theme\(\); \}/,
    'pyq/js/answers.js': /try \{ return StudyStorage\.theme\(\); \}/,
    'pyq/select.html': /try \{ return StudyStorage\.theme\(\); \}/,
    'practice/js/index.js': /try \{ return StudyStorage\.theme\(\); \}/,
    'practice/js/session.js': /try \{ return StudyStorage\.theme\(\); \}/,
    'roadmap/index.js': /try \{ saved = StudyStorage\.theme\(\); \}/,
    'quiz/js/common.js': /try \{ theme = StudyStorage\.theme\(\); \}/,
    'subjects/units-com/common.js': /try \{ return StudyStorage\.theme\(\); \}/
  };
  for (const [file, pattern] of Object.entries(guarded)) {
    assert(pattern.test(read(file)), `${file} must guard StudyStorage.theme()`);
  }
  // Saves are guarded too, so a stale module cannot break a click handler.
  const saveSites = ['quiz/js/common.js','subjects/units-com/common.js','practice/js/index.js',
    'practice/js/session.js','pyq/js/index.js','pyq/js/answers.js','pyq/select.html','roadmap/index.js'];
  for (const file of saveSites) {
    assert(/try \{ StudyStorage\.setTheme\(/.test(read(file)), `${file} must guard StudyStorage.setTheme()`);
  }
  console.log('PASS every theme read and save is guarded against a stale storage module');
}

/* ── 2. Behaviour against a Phase-5-shaped module (no theme/setTheme) ── */
{
  const setThemeCalls = [];
  const sandbox = {
    window: {},
    document: {
      addEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      documentElement: {
        attrs: {},
        setAttribute(name, value) { this.attrs[name] = value; },
        getAttribute(name) { return this.attrs[name] ?? null; }
      }
    },
    // Deliberately the old surface: legacy + prefs only.
    StudyStorage: {
      legacy: { getItem: () => 'dark', setItem: () => {}, removeItem: () => {} },
      prefs: () => ({ theme: 'dark', fontScale: 100, lineHeight: 'normal', contrast: 'normal', lang: 'en', reduceMotion: 'system' })
    },
    matchMedia: () => ({ matches: false }),
    location: { search: '', pathname: '/Diploma-3rd-sem/quiz/setup.html' },
    URL, URLSearchParams, Date, Math, JSON, Set, Map, Array, Object, String, Number,
    Boolean, RegExp, Error, parseInt, parseFloat, isNaN,
    encodeURIComponent, decodeURIComponent,
    setTimeout, clearTimeout, setInterval, clearInterval,
    console: { warn: () => {}, log: () => {}, error: () => {} }
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;

  const api = vm.runInNewContext(read('quiz/js/common.js') + '\n;({ initTheme, toggleTheme, applyTheme });', sandbox);
  const root = sandbox.document.documentElement;

  assert.doesNotThrow(() => api.initTheme(), 'initTheme must survive a stale module');
  assert.equal(root.attrs['data-theme'], 'light', 'stale read falls back to a paintable theme');

  api.applyTheme('dark');
  assert.equal(root.attrs['data-theme'], 'dark', 'applyTheme repaints even when saving fails');
  setThemeCalls.push(root.attrs['data-theme']);

  api.toggleTheme();
  assert.equal(root.attrs['data-theme'], 'light', 'toggle still flips without a writable module');
  api.toggleTheme();
  assert.equal(root.attrs['data-theme'], 'dark');
  console.log('PASS toggle and init keep working when the cached module is older than the page');
}

/* ── 3. The new module still owns the decision when it is current ────── */
{
  const { createMiniDom, runScriptIn } = require('./lib/minidom.cjs');
  const { win, doc } = createMiniDom('https://example.test/Diploma-3rd-sem/quiz/setup.html');
  const store = new Map([['d3s:prefs', JSON.stringify({ theme: 'dark', fontScale: 100, lineHeight: 'normal', contrast: 'normal', lang: 'en', reduceMotion: 'system' })]]);
  win.localStorage = new Proxy({
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: key => { store.delete(key); },
    key: index => [...store.keys()][index] ?? null
  }, {
    ownKeys: () => [...store.keys()],
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true })
  });
  runScriptIn(win, 'assets/js/storage.js');
  runScriptIn(win, 'quiz/js/common.js');
  win.initTheme();
  assert.equal(doc.documentElement.getAttribute('data-theme'), 'dark', 'a current module still decides the theme');
  assert.deepEqual([...store.keys()], ['d3s:prefs'], 'no split theme key appears');
  console.log('PASS with a current module the preference record still owns the theme');
}
