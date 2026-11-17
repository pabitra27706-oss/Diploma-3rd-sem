/* Phase 6.4 — plain-text notes on unit pages, practice sessions and quiz review.
 *
 * Static audit plus deterministic DOM execution against tests/lib/minidom.cjs:
 *   - every unit page still loads section-notes.js (24 pages);
 *   - practice session and quiz review load it and mount one note per question;
 *   - the widget saves plain text (debounced, flushed on blur/flush), never HTML;
 *   - records keep the `section-note:` group and the documented shape;
 *   - a reload shows the saved note, and clearing removes the record;
 *   - the unit-page key shape stays what discovery.js already indexes.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, createMiniDom, runScriptIn } = require('./lib/minidom.cjs');

const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function stubStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    api: {
      get: (key, fallback = null) => (map.has(key) ? JSON.parse(map.get(key)) : fallback),
      set: (key, value) => { map.set(key, JSON.stringify(value)); return value; },
      remove: key => { map.delete(key); },
      keys: () => [...map.keys()]
    }
  };
}

function mountFixture(relPath, { url, storage, headings = 0 }) {
  const { win, doc, MiniNode } = createMiniDom(url);
  if (headings) {
    const main = new MiniNode(1, 'main');
    doc.body.appendChild(main);
    for (let i = 1; i <= headings; i += 1) {
      const heading = new MiniNode(1, 'h2');
      heading.className = 'section-title';
      heading.textContent = `Topic ${i}`;
      main.appendChild(heading);
    }
  }
  win.StudyStorage = storage.api;
  win.confirm = () => true;
  runScriptIn(win, relPath);
  return { win, doc };
}

(async () => {
  /* ── Static audit ───────────────────────────────────────────────────── */
  const notesSource = read('assets/js/section-notes.js');
  assert(!/\.(?:innerHTML|outerHTML)\s*=/.test(notesSource), 'section-notes.js must never assign HTML');
  assert(!/insertAdjacentHTML|document\.write/.test(notesSource), 'section-notes.js must never insert raw HTML');
  assert(!/localStorage\s*[.\[]/.test(notesSource), 'section-notes.js must go through the storage boundary');

  const unitPages = fs.readdirSync(path.join(ROOT, 'subjects'))
    .flatMap(subject => {
      const dir = path.join(ROOT, 'subjects', subject, 'units');
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir).filter(name => /^unit-\d+\.html$/.test(name)).map(name => `subjects/${subject}/units/${name}`);
    });
  assert.equal(unitPages.length, 24, `expected 24 unit pages, found ${unitPages.length}`);
  for (const page of unitPages) {
    assert(read(page).includes('section-notes.js'), `${page} must load section-notes.js`);
  }

  for (const [page, needle] of [
    ['practice/session.html', 'section-notes.js'],
    ['quiz/review.html', 'section-notes.js']
  ]) {
    const html = read(page);
    assert(html.includes(needle), `${page} must load the shared note widget`);
    assert(html.indexOf(needle) < html.indexOf('js/' + (page.startsWith('practice') ? 'session' : 'review') + '.js'),
      `${page} must load notes before its page script`);
  }
  assert(/SectionNotes\.keyFor\(`practice\/\$\{q\.id\}`\)/.test(read('practice/js/session.js')), 'practice note key is per question');
  assert(/SectionNotes\.keyFor\(`quiz-review\/\$\{q\.id\}`\)/.test(read('quiz/js/review.js')), 'review note key is per question');
  assert(/SectionNotes\?\.flush\(\)/.test(read('practice/js/session.js')), 'practice flushes pending notes before re-render');
  assert(/SectionNotes\?\.flush\(\)/.test(read('quiz/js/review.js')), 'review flushes pending notes before re-render');
  console.log('PASS notes loaded on 24 unit pages, practice session and quiz review');

  /* ── Practice-style per-question note ──────────────────────────────── */
  {
    const storage = stubStorage();
    const { win } = mountFixture('assets/js/section-notes.js', {
      url: 'https://example.test/Diploma-3rd-sem/practice/session.html',
      storage
    });
    assert.equal(win.SectionNotes.keyFor('/practice/CST201-P001-Q1'), 'section-note:practice/CST201-P001-Q1');

    const note = win.SectionNotes.mount({ key: win.SectionNotes.keyFor('practice/CST201-P001-Q1'), title: 'My note for this question' });
    win.document.body.appendChild(note);
    const textarea = note.querySelector('textarea');
    assert(textarea, 'widget exposes a textarea');
    assert.equal(textarea.getAttribute('aria-describedby'), textarea.id + '-status', 'textarea is labelled for screen readers');
    assert(note.querySelector('summary').textContent === 'My note for this question', 'summary names the note');

    textarea.value = 'Line one <b>not markup</b>\nLine two';
    textarea.dispatchEvent({ type: 'input' });
    assert.equal(storage.map.size, 0, 'debounced: nothing saved on the first keystroke');
    await sleep(450);
    const saved = JSON.parse(storage.map.get('section-note:practice/CST201-P001-Q1'));
    assert.equal(saved.text, 'Line one <b>not markup</b>\nLine two', 'text is stored verbatim, never parsed as HTML');
    assert.equal(typeof saved.updatedAt, 'number');
    assert.equal(saved.title, 'My note for this question');
    assert.equal(note.querySelector('[role="status"]').textContent, 'Saved on this device');

    // Reload: a fresh mount in the same origin shows the stored text.
    const again = win.SectionNotes.mount({ key: 'section-note:practice/CST201-P001-Q1' });
    assert.equal(again.querySelector('textarea').value, saved.text, 'saved note reappears');

    // Pending edits are flushed before the host re-renders (practice/quiz do this).
    textarea.value = 'edited then navigated';
    textarea.dispatchEvent({ type: 'input' });
    win.SectionNotes.flush();
    assert.equal(JSON.parse(storage.map.get('section-note:practice/CST201-P001-Q1')).text, 'edited then navigated');

    // Clearing removes the record.
    const clear = [...note.querySelectorAll('button')].find(button => /Clear/.test(button.textContent));
    clear.click();
    assert.equal(storage.map.has('section-note:practice/CST201-P001-Q1'), false, 'clear removes the note record');
    console.log('PASS practice-style note: debounce, verbatim text, reload, flush, clear');
  }

  /* ── Unit-page behaviour unchanged ─────────────────────────────────── */
  {
    const storage = stubStorage();
    const { doc } = mountFixture('assets/js/section-notes.js', {
      url: 'https://example.test/Diploma-3rd-sem/subjects/CST201/units/unit-2.html',
      storage,
      headings: 2
    });
    const details = doc.querySelectorAll('details.section-note');
    assert.equal(details.length, 2, 'one note per .section-title heading');
    const key = details[0].querySelector('textarea').id;
    const note = details[0].querySelector('textarea');
    note.value = 'unit note';
    note.dispatchEvent({ type: 'input' });
    await sleep(450);
    const keys = [...storage.map.keys()];
    assert.deepEqual(keys, ['section-note:CST201/units/unit-2.html#section-1']);
    assert.match(keys[0], /^section-note:CST\d+\/units\/unit-\d+\.html#section-\d+$/, 'unit key shape is unchanged');
    assert.equal(JSON.parse(storage.map.get(keys[0])).url, '/Diploma-3rd-sem/subjects/CST201/units/unit-2.html#section-1');

    // discovery.js indexes this shape; keep the pattern in sync.
    const discovery = read('assets/js/discovery.js');
    assert(/section-note:/.test(discovery), 'discovery still reads the section-note group');
    console.log('PASS unit-page notes: 2 headings, stable key shape, URL recorded');
  }

  /* ── No auto-mount outside unit pages ──────────────────────────────── */
  {
    const storage = stubStorage();
    const { doc, win } = mountFixture('assets/js/section-notes.js', {
      url: 'https://example.test/Diploma-3rd-sem/settings.html',
      storage,
      headings: 2
    });
    assert.equal(doc.querySelectorAll('details.section-note').length, 0, 'only unit pages auto-mount notes');
    assert.equal(typeof win.SectionNotes.mount, 'function');
    console.log('PASS notes do not auto-mount outside unit pages');
  }
})().catch(error => { console.error(error); process.exit(1); });
