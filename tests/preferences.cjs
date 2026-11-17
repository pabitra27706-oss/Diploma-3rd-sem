/* Phase 6.2 + 6.3 — one preference record, pre-paint theme, system listener,
 * and reset groups that clear exactly their own records.
 *
 * Run against assets/js/storage.js in a VM with a minimal document/matchMedia
 * stand-in, so the synchronous pre-paint behaviour is observable.
 */
'use strict';

const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');

const source = fs.readFileSync('assets/js/storage.js', 'utf8');

function harness(entries = {}, options = {}) {
  const store = new Map(Object.entries(entries));
  const listeners = new Set();
  const media = {
    matches: Boolean(options.dark),
    addEventListener(type, fn) { if (type === 'change') listeners.add(fn); },
    set(matches) { media.matches = matches; listeners.forEach(fn => fn({ matches })); }
  };
  const root = {
    attrs: {},
    style: { setProperty(name, value) { root.style[name] = value; } },
    dataset: {},
    setAttribute(name, value) { root.attrs[name] = value; }
  };
  const storage = new Proxy({
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: key => { store.delete(key); },
    key: index => [...store.keys()][index] ?? null
  }, {
    ownKeys: () => [...store.keys()],
    getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true })
  });
  const context = {
    localStorage: storage,
    indexdDB: undefined,
    matchMedia: () => media,
    document: { documentElement: root, querySelector: () => null },
    dispatchEvent: () => true,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init && init.detail; } },
    Date, console, Promise, setTimeout, clearTimeout
  };
  vm.runInNewContext(source, context);
  return { S: context.StudyStorage, store, root, media };
}

/* ── Pre-paint and system preference ─────────────────────────────────── */
{
  const { S, store, root, media } = harness();
  // Phase 9C: the adopted navy theme is the first-visit default (owner choice,
  // docs/DECISIONS.md), so a first visit paints dark without writing anything.
  assert.equal(root.attrs['data-theme'], 'dark', 'the default theme is applied synchronously at script evaluation (pre-paint)');
  assert.equal(store.size, 0, 'a first visit writes nothing just to paint the theme');
  assert.deepEqual(JSON.parse(JSON.stringify(S.prefs())), {
    theme: 'dark', fontScale: 100, lineHeight: 'normal', contrast: 'normal', lang: 'en', reduceMotion: 'system'
  }, 'one preference object owns every reading preference');

  // The OS is still honoured the moment the reader chooses "system".
  S.setTheme('system');
  assert.equal(root.attrs['data-theme'], 'light', 'system with a light OS preference paints light');
  media.set(true);
  assert.equal(root.attrs['data-theme'], 'dark', 'system preference change repaints while theme is system');
  S.setTheme('dark');
  assert.equal(root.attrs['data-theme'], 'dark');

  S.setTheme('light');
  assert.equal(root.attrs['data-theme'], 'light');
  media.set(false);
  assert.equal(root.attrs['data-theme'], 'light', 'an explicit choice ignores the OS');
  assert.deepEqual([...S.keys()], ['prefs'], 'exactly one theme/preference key is stored');
  assert.equal(store.has('theme'), false);

  S.setTheme('system');
  media.set(true);
  assert.equal(root.attrs['data-theme'], 'dark', 'switching back to system follows the OS again');
  assert.throws(() => S.setTheme('neon'), /Invalid theme/);

  S.setPrefs({ fontScale: 115, lineHeight: 'relaxed', contrast: 'high', reduceMotion: 'reduced', lang: 'bn' });
  assert.equal(root.style.fontSize, '115%', 'font scale reaches CSS');
  assert.equal(root.style['--reading-line-height'], '1.9', 'line height is a CSS custom property');
  assert.equal(root.dataset.contrast, 'high');
  assert.equal(root.dataset.motion, 'reduced');
  assert.equal(root.dataset.language, 'bn');
  assert.throws(() => S.setPrefs({ contrast: 'extreme' }), /Invalid/);
  console.log('PASS one preference record, synchronous pre-paint theme, system listener, CSS custom properties');
}

/* ── Legacy theme scalars collapse into the single record ────────────── */
{
  const { S, store } = harness({ theme: 'dark', 'quiz-theme': '"dark"', 'diploma-3rd-sem-theme': 'light' });
  assert.equal(S.theme(), 'dark');
  assert.equal(store.has('theme'), false);
  assert.equal(store.has('quiz-theme'), false);
  assert.equal(store.has('diploma-3rd-sem-theme'), false);
  assert.deepEqual([...S.keys()], ['prefs'], 'legacy theme keys are removed, leaving one record');
  S.migrate();
  assert.deepEqual([...S.keys()], ['prefs', 'schema'], 'double migration adds no theme keys');
  console.log('PASS legacy theme keys collapse to d3s:prefs and double migration stays a no-op');
}

/* ── Reset groups clear exactly their own records ────────────────────── */
{
  const { S, store, root } = harness();
  S.set('section-note:CST201/units/unit-1.html#section-1', { text: 'note', updatedAt: 1 });
  S.set('quiz-history', [{ historyId: 'h1' }]);
  S.set('practice-presets', { size: 10 });

  S.setPrefs({ contrast: 'high' });
  const before = S.estimate();
  assert.equal(before.notes.records, 1);
  assert.equal(before.progress.records, 2);
  assert.equal(before.preferences.records, 1, 'the preference record counts as preferences');
  const countedKeys = S.keys().length;
  assert.equal(Object.values(before).reduce((sum, group) => sum + group.records, 0), countedKeys,
    'group counts add up to the registry, so the dialog cannot under-report');

  S.clearGroup('notes');
  assert.deepEqual([...S.keys()], ['practice-presets', 'prefs', 'quiz-history']);
  assert.equal(S.estimate().notes.records, 0);

  S.clearGroup('progress');
  assert.deepEqual([...S.keys()], ['prefs']);

  root.attrs['data-theme'] = 'stale';
  S.clearGroup('preferences');
  assert.equal(S.keys().length, 0);
  assert.equal(root.attrs['data-theme'], 'dark', 'clearing preferences repaints the page as a first visit (default theme)');

  assert.throws(() => S.clearGroup('everything-ish'), /Unknown reset group/);
  S.set('section-note:x', { text: '', updatedAt: 1 });
  S.set('practice-presets', { size: 1 });
  S.clearAll();
  assert.equal(S.keys().length, 0);
  assert.equal(store.size, 0, 'everything leaves no d3s records behind');
  assert.deepEqual(JSON.parse(JSON.stringify(S.estimate())), { notes: { records: 0, bytes: 0 }, progress: { records: 0, bytes: 0 }, preferences: { records: 0, bytes: 0 } });
  console.log('PASS reset groups clear exactly their records, counts match the registry, everything returns to first run');
}
