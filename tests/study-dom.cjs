/* Deterministic zero-dependency Node DOM regression suite for Phase 5 Study System:
   - cards.html: subject/unit filter from the URL, popstate restore, progress,
     answer-first → reveal → rate flow, 1–4/Space/Esc keys, saved-before-advance
   - honest provenance on every card (verification sentence + visible citation)
     and zero raw CST20x codes / internal question ids in UI-authored text
   - clean empty-due-queue state with actionable fallbacks (mistakes, weak unit,
     practice set, Today) and the new-card allowance explained
   - today.html: due/new plan, primary "what now" action, configurable daily goal,
     local streak + reset start, deterministic question of the day
   - weak areas: correct/attempted denominators, attempt counts, minimum sample
     rule (no percentage below 5), generic-topic collapse, trend copy, links
   - study-ui.js/study-store.js contain no HTML injection sinks
*/
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ROOT, assert, createMiniDom, createRepoFetch, runScriptIn, flush } = require('./lib/minidom.cjs');

const BASE = 'https://example.test/Diploma-3rd-sem/';
const RAW_CODE_RE = /\b(?:CST\d{3}|SI201)\b/;
const RAW_QID_RE = /\bCST\d{3}-(?:P\d{3}-|U\d+-)?Q\d+\b/;
const DAY = 86400000;

const SCRIPTS = ['assets/js/subject-labels.js', 'assets/js/study-store.js', 'assets/js/study-ui.js'];

function makeStorage(seed) {
  const data = new Map(Object.entries(seed || {}));
  return {
    data,
    legacy: {
      getItem: key => (data.has(key) ? data.get(key) : null),
      setItem: (key, value) => { data.set(key, String(value)); },
      removeItem: key => { data.delete(key); }
    }
  };
}

function el(doc, tag, id) {
  const element = doc.createElement(tag);
  if (id) element.id = id;
  doc.body.appendChild(element);
  return element;
}

function assertHtmlHas(file, ids) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  for (const id of ids) assert(html.includes(`id="${id}"`), `${file} is missing #${id} used by study-ui.js`);
}

const CARDS_IDS = ['study-status', 'card-subject', 'card-unit', 'start-cards', 'card-session', 'card-progress',
  'card-front', 'reveal-card', 'card-answer', 'card-back', 'card-citation', 'card-source', 'card-ratings', 'card-empty'];
const TODAY_IDS = ['study-status', 'plan-detail', 'primary-action', 'primary-why', 'due-count', 'mistake-count',
  'goal-form', 'goal', 'new-limit', 'save-goal', 'save-limit', 'goal-meter', 'goal-progress', 'new-limit-help',
  'streak', 'streak-reset-note', 'reset-streak', 'daily-question', 'daily-citation', 'daily-link',
  'another-question', 'weak-summary', 'weak-areas'];

function mountCards(win, doc) {
  const main = el(doc, 'main', 'study-main-content');
  el(doc, 'p', 'study-status');
  const subject = el(doc, 'select', 'card-subject');
  subject.add(new win.Option('All subjects', ''));
  const unit = el(doc, 'select', 'card-unit');
  el(doc, 'button', 'start-cards');
  const session = el(doc, 'section', 'card-session');
  session.hidden = true;
  el(doc, 'h2', 'card-front');
  el(doc, 'p', 'card-progress');
  const reveal = el(doc, 'button', 'reveal-card');
  const answer = el(doc, 'div', 'card-answer');
  answer.hidden = true;
  el(doc, 'p', 'card-back');
  el(doc, 'p', 'card-citation');
  const source = el(doc, 'a', 'card-source');
  source.href = 'search.html';
  el(doc, 'div', 'card-ratings');
  const empty = el(doc, 'section', 'card-empty');
  empty.hidden = true;
  return { main, subject, unit, session, reveal, answer, source, empty };
}

function mountToday(doc) {
  const main = el(doc, 'main', 'study-main-content');
  el(doc, 'p', 'study-status');
  el(doc, 'p', 'plan-detail');
  el(doc, 'p', 'primary-action');
  el(doc, 'div', 'primary-why');
  el(doc, 'p', 'due-count');
  el(doc, 'p', 'mistake-count');
  el(doc, 'form', 'goal-form');
  el(doc, 'input', 'goal');
  el(doc, 'input', 'new-limit');
  el(doc, 'button', 'save-goal');
  el(doc, 'button', 'save-limit');
  el(doc, 'progress', 'goal-meter');
  el(doc, 'p', 'goal-progress');
  el(doc, 'p', 'new-limit-help');
  el(doc, 'p', 'streak');
  el(doc, 'p', 'streak-reset-note');
  el(doc, 'button', 'reset-streak');
  el(doc, 'p', 'daily-question');
  el(doc, 'p', 'daily-citation');
  const dailyLink = el(doc, 'a', 'daily-link');
  dailyLink.href = 'search.html';
  el(doc, 'button', 'another-question');
  el(doc, 'p', 'weak-summary');
  el(doc, 'div', 'weak-areas');
  return { main };
}

async function boot(win) {
  for (const script of SCRIPTS) runScriptIn(win, script, BASE + script);
  await flush(30);
}

function visibleText(doc, ids) {
  return ids.map(id => doc.getElementById(id)?.textContent || '').join(' ');
}

(async () => {
  /* ── 0. Static guarantees ─────────────────────────────────────────────── */
  assertHtmlHas('cards.html', CARDS_IDS);
  assertHtmlHas('today.html', TODAY_IDS);
  for (const rel of ['assets/js/study-ui.js', 'assets/js/study-store.js']) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert(!/\.(?:innerHTML|outerHTML)\s*=/.test(src), `${rel} must never assign innerHTML/outerHTML`);
    assert(!/insertAdjacentHTML|document\.write/.test(src), `${rel} must never insert raw HTML`);
    assert(!/localStorage\.(?:setItem|getItem)/.test(src), `${rel} must go through the storage boundary`);
  }
  for (const rel of ['cards.html', 'today.html']) {
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert(html.includes('assets/js/study-store.js') && html.includes('assets/js/study-ui.js'), `${rel} must load the study scripts`);
    assert(html.includes('assets/js/subject-labels.js'), `${rel} must load subject labels`);
    assert(!RAW_CODE_RE.test(html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<meta[^>]*>/g, '').replace(/<link[^>]*>/g, '').replace(/href="[^"]*"/g, '')), `${rel} must not print a raw course code`);
  }
  console.log('PASS static: markup ids, zero HTML sinks, no raw course codes in the study pages');

  /* ── 1. cards.html — filters, reveal/rate, progress, keyboard ─────────── */
  {
    const { win, doc } = createMiniDom(BASE + 'cards.html?subject=CST201');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    win.StudyStorage = makeStorage();
    const messages = [];
    win.navigator.serviceWorker = { controller: { postMessage: message => messages.push(message) } };
    mountCards(win, doc);
    await boot(win);
    assert(messages.some(message => message.type === 'WARM_STUDY'), 'a loaded study page must warm the card cache');
    const session = doc.getElementById('card-session');
    const status = doc.getElementById('study-status');
    assert.equal(session.hidden, false, 'a session must start when cards are available');
    assert.match(doc.getElementById('card-progress').textContent, /^1 \/ \d+$/, 'progress must read "1 / N"');
    assert.equal(doc.getElementById('card-unit').options.length, 6, 'unit filter must offer all units plus "All units"');
    assert.equal(doc.getElementById('card-subject').value, 'CST201', '?subject must preselect the subject');
    assert(status.textContent.startsWith('C Unit '), `status must name the subject by label: ${status.textContent}`);
    assert(status.textContent.includes('due') && status.textContent.includes('new cards left today'));
    assert(doc.getElementById('card-front').textContent.length > 0, 'front must show the stored question');
    assert.equal(doc.getElementById('card-answer').hidden, true, 'the answer must stay hidden before reveal');

    // Answer-first flow: reveal shows the stored answer + honest provenance + citation.
    doc.getElementById('reveal-card').dispatchEvent({ type: 'click' });
    const answer = doc.getElementById('card-answer');
    assert.equal(answer.hidden, false);
    assert.equal(doc.getElementById('reveal-card').hidden, true, 'reveal button must hide after reveal');
    const citation = doc.getElementById('card-citation').textContent;
    assert(/Model answer, not independently certified|Existing keyed explanation/.test(citation),
      `citation must state the provenance honestly: ${citation}`);
    assert(citation.includes('Source: '), `citation must name the visible source: ${citation}`);
    assert(!RAW_CODE_RE.test(citation), `citation must not print a raw course code: ${citation}`);
    assert(!RAW_QID_RE.test(citation), `citation must not print an internal question id: ${citation}`);
    const ratings = doc.getElementById('card-ratings').querySelectorAll('button');
    assert.equal(ratings.length, 4, 'four ratings must be offered');
    assert.deepEqual(ratings.map(b => b.getAttribute('data-rating')), ['again', 'hard', 'good', 'easy']);
    assert.equal(ratings[0].textContent, '1 · again · 1 day');
    assert.equal(ratings[3].textContent, '4 · easy · 3 days', 'a new card rated easy lands in the 3-day box');
    assert.equal(doc.activeElement, ratings[0], 'focus must move to the first rating after reveal');
    assert(status.textContent.includes('Answer revealed'));
    assert(!RAW_CODE_RE.test(visibleText(doc, CARDS_IDS)), 'no UI text may print a raw course code');
    assert(!RAW_QID_RE.test(visibleText(doc, CARDS_IDS)), 'no UI text may print an internal question id');

    // Rating saves immediately, advances, and is idempotent for the same event.
    ratings[2].dispatchEvent({ type: 'click' });
    const state = win.StudyStore.read();
    assert.equal(state.events.length, 1, 'one rating must record exactly one event');
    assert.equal(state.events[0].rating, 'good');
    const firstCardId = state.events[0].cardId;
    assert.equal(state.cards[firstCardId].interval, 1);
    assert(Math.abs(state.cards[firstCardId].due - (Date.now() + DAY)) < 60000, 'due must be one day out');
    assert.match(doc.getElementById('card-progress').textContent, /^2 \/ \d+$/);
    const dup = win.StudyStore.rate(firstCardId, 'good', state.events[0].id);
    assert.equal(win.StudyStore.read().events.length, 1, 'a repeated event id must not add a second review');
    assert.equal(dup.reps, 1);

    // Keyboard: Space reveals, 4 rates easy, Escape would leave with progress saved.
    doc.dispatchEvent({ type: 'keydown', key: ' ', code: 'Space' });
    assert.equal(doc.getElementById('card-answer').hidden, false, 'Space must reveal');
    doc.dispatchEvent({ type: 'keydown', key: '4' });
    assert.equal(win.StudyStore.read().events.length, 2, 'key 4 must rate and save');
    assert.equal(win.StudyStore.read().events[1].rating, 'easy');

    // Popstate + subject/unit filter restore from the URL.
    win.setUrlAndPop(BASE + 'cards.html?subject=CST209&unit=4');
    await flush(4);
    assert.equal(doc.getElementById('card-subject').value, 'CST209');
    assert.equal(doc.getElementById('card-unit').value, '4');
    assert(status.textContent.startsWith('Algorithms Unit 4'), `popstate must refilter: ${status.textContent}`);

    // Filter changes push a shareable URL.
    doc.getElementById('card-subject').value = 'CST205';
    doc.getElementById('card-subject').dispatchEvent({ type: 'change' });
    assert(win.location.search.includes('subject=CST205'), 'filter changes must update the URL');
    assert(!win.location.search.includes('unit='), 'clearing the unit must clear the URL parameter');
    assert(status.textContent.startsWith('DS Unit '), `status must follow the filter: ${status.textContent}`);
  }
  console.log('PASS cards.html filter/URL/popstate, answer-first reveal, four ratings, keyboard, idempotent save');

  /* ── 2. cards.html — completing the queue and the empty state ─────────── */
  {
    const { win, doc } = createMiniDom(BASE + 'cards.html?subject=CST207');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    win.StudyStorage = makeStorage();
    mountCards(win, doc);
    await boot(win);
    let rated = 0;
    while (!doc.getElementById('card-session').hidden) {
      doc.dispatchEvent({ type: 'keydown', key: ' ', code: 'Space' });
      doc.dispatchEvent({ type: 'keydown', key: '3' });
      rated += 1;
      assert(rated <= 40, 'the new-card cap (20) must stop the queue from running away');
    }
    assert.equal(rated, 20, 'the default new-card allowance is 20 cards');
    const empty = doc.getElementById('card-empty');
    assert.equal(empty.hidden, false, 'the empty state must be visible after the queue empties');
    const text = empty.textContent;
    assert(text.includes('No more due or new cards'), `expected the documented empty-state phrase: ${text}`);
    assert(text.includes('saved locally'), 'the empty state must say progress is saved');
    const hrefs = empty.querySelectorAll('a').map(a => a.href);
    assert(hrefs.includes(BASE + 'quiz/index.html'), 'empty state must offer the mistake queue');
    assert(hrefs.includes(BASE + 'practice/index.html'), 'empty state must offer a practice set');
    assert(hrefs.includes(BASE + 'today.html'), 'empty state must offer Today');
    assert(!RAW_CODE_RE.test(text) && !RAW_QID_RE.test(text), 'empty state must not print raw codes or ids');
    assert.equal(win.StudyStore.read().events.length, 20);
  }
  console.log('PASS 20-card allowance, clean empty queue, and actionable fallbacks');

  /* ── 3. cards.html — empty queue on arrival, mistakes and weakest unit ── */
  {
    const { win, doc } = createMiniDom(BASE + 'cards.html');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    const seed = { 'd3s:study:v1': JSON.stringify({ schemaVersion: 1, cards: {}, events: [], goal: 20, newLimit: 0, streakStart: null }) };
    win.StudyStorage = makeStorage(seed);
    const completedAt = Date.now() - 1000;
    const questions = Array.from({ length: 6 }, (_, i) => ({ id: `q${i}`, unit: 2, topic: 'Linked lists', type: 'mcq', correct: 'A', options: { A: 'yes', B: 'no' } }));
    win.QuizAttempts = {
      history: () => [{
        id: 'attempt-1', config: { subject: 'CST205' }, completedAt,
        questions, answers: questions.reduce((acc, q, i) => ({ ...acc, [q.id]: i < 4 ? 'A' : 'B' }), {})
      }],
      mistakes: () => ({ schemaVersion: 1, items: { 'CST205-U2-Q001': {}, 'CST205-U2-Q002': {} } })
    };
    mountCards(win, doc);
    await boot(win);
    const empty = doc.getElementById('card-empty');
    assert.equal(doc.getElementById('card-session').hidden, true, 'no session when nothing is available');
    assert.equal(empty.hidden, false);
    const text = empty.textContent;
    assert(text.includes('No more due or new cards'));
    assert(text.includes('2 saved mistakes'), `mistake fallback must use the real local count: ${text}`);
    assert(text.includes('DS Unit 2'), `weak-unit fallback must use the subject label: ${text}`);
    assert(text.includes('4/6 correct'), `weak-unit fallback must show the denominator: ${text}`);
    const hrefs = empty.querySelectorAll('a').map(a => a.href);
    assert(hrefs.includes(BASE + 'quiz/setup.html?subject=CST205&unit=2'), 'weak unit must link to its practice set');
    assert(hrefs.includes(BASE + 'cards.html?subject=CST205&unit=2'), 'weak unit must link to its cards');
    assert(!RAW_CODE_RE.test(text) && !RAW_QID_RE.test(text));
  }
  console.log('PASS empty-on-arrival state with mistake count and sample-linked weakest unit');

  /* ── 4. today.html — plan, goal, streak, question of the day ──────────── */
  const todayHistory = () => {
    const now = Date.now();
    const day = offset => {
      const date = new Date(now);
      date.setDate(date.getDate() - offset);
      return date.getTime();
    };
    const make = (subject, unit, topic, count, correct, offset, id) => {
      const questions = Array.from({ length: count }, (_, i) => ({ id: `${id}-q${i}`, unit, topic, type: 'mcq', correct: 'A', options: { A: 'yes', B: 'no' } }));
      return {
        id, config: { subject }, completedAt: day(offset), questions,
        answers: questions.reduce((acc, q, i) => ({ ...acc, [q.id]: i < correct ? 'A' : 'B' }), {})
      };
    };
    return [
      make('CST201', 1, 'Arrays', 6, 4, 0, 'attempt-arrays'),
      make('CST205', 2, 'Linked lists', 3, 1, 0, 'attempt-lists'),
      { ...make('CST201', 1, 'General', 1, 1, 0, 'attempt-generic-a') },
      { ...make('CST201', 1, 'Unit 1', 1, 0, 0, 'attempt-generic-b') },
      make('CST203', 3, 'Functions', 5, 1, 8, 'attempt-previous-window')
    ];
  };
  {
    const { win, doc } = createMiniDom(BASE + 'today.html');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    const now = Date.now();
    const dayKey = ts => {
      const date = new Date(ts);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    const seeded = {
      schemaVersion: 1, goal: 20, newLimit: 20, streakStart: null,
      cards: {
        'card-CST201-P001-Q1': { state: 'review', box: 1, interval: 3, due: now + 2 * DAY, reps: 1, lapses: 0, lastRating: 'good', lastReviewed: now - DAY, lastEventId: 'e1', firstDay: dayKey(now - DAY) }
      },
      events: [
        { id: 'e1', cardId: 'card-CST201-P001-Q1', at: now - DAY, day: dayKey(now - DAY), rating: 'good' },
        { id: 'e2', cardId: 'card-CST207-P001-Q1', at: now, day: dayKey(now), rating: 'good' },
        { id: 'e3', cardId: 'card-CST207-P001-Q2', at: now, day: dayKey(now), rating: 'hard' }
      ]
    };
    win.StudyStorage = makeStorage({ 'd3s:study:v1': JSON.stringify(seeded) });
    win.QuizAttempts = { history: todayHistory, mistakes: () => ({ schemaVersion: 1, items: { 'CST201-U1-Q001': {} } }) };
    mountToday(doc);
    await boot(win);

    const status = doc.getElementById('study-status').textContent;
    assert(status.startsWith('Local-only'), `Today must stay local-only: ${status}`);
    assert(status.includes('no upload'));

    const progress = doc.getElementById('goal-progress').textContent;
    assert(progress.includes('2 card reviews'), `goal progress must count real card reviews: ${progress}`);
    assert(progress.includes('answered questions'), 'goal progress must count answered questions');
    assert(progress.includes('/ 20 activities'), 'goal progress must show the configured target');
    const meter = doc.getElementById('goal-meter');
    assert.equal(Number(meter.max), 20);
    assert(Number(meter.value) >= 2);
    assert(meter.textContent.includes('activities'), 'the meter needs a text equivalent');

    const plan = doc.getElementById('plan-detail').textContent;
    assert(plan.includes('due now'), plan);
    assert(plan.includes('1 unresolved local mistake'), plan);
    const due = doc.getElementById('due-count').textContent;
    assert(due.includes("allowance of 20"), `due/new line must state the cap: ${due}`);
    assert(doc.getElementById('mistake-count').textContent.includes('1 unresolved local mistake'));

    const primary = doc.getElementById('primary-action').querySelector('a');
    assert(primary, 'Today needs one primary action');
    assert.equal(primary.href, BASE + 'cards.html', 'new cards available → primary action is the review session');
    assert(primary.textContent.includes('Start'), primary.textContent);
    assert(doc.getElementById('primary-why').textContent.includes('new-card allowance'));

    const streak = doc.getElementById('streak').textContent;
    assert(streak.includes('consecutive local activity day'), streak);
    assert(streak.includes('Any pace is welcome'), 'streak copy must not be guilt-based');
    assert(doc.getElementById('streak-reset-note').textContent.includes('saved reviews stay intact'));

    // Question of the day: deterministic, source-labelled, and switchable.
    const firstQuestion = doc.getElementById('daily-question').textContent;
    assert(firstQuestion.length > 0);
    assert(doc.getElementById('daily-citation').textContent.startsWith('Source: '));
    assert(!RAW_CODE_RE.test(doc.getElementById('daily-citation').textContent));
    assert(new URL(doc.getElementById('daily-link').href).pathname.endsWith('/pyq/answers.html'));
    doc.getElementById('another-question').dispatchEvent({ type: 'click' });
    assert.notEqual(doc.getElementById('daily-question').textContent, firstQuestion, '"Another question" must change the card');

    // Weak areas: denominators, attempt counts, minimum sample, generic collapse.
    const articles = doc.getElementById('weak-areas').querySelectorAll('article');
    assert(articles.length >= 3, `expected ranked weak areas: ${articles.length}`);
    const byTopic = new Map(articles.map(article => [article.querySelector('h3').textContent, article]));
    const arrays = [...byTopic.entries()].find(([heading]) => heading.includes('Arrays'));
    assert(arrays, 'Arrays row must appear');
    assert(arrays[1].textContent.includes('4 correct / 6 attempted'), arrays[1].textContent);
    assert(arrays[1].textContent.includes('1 attempt'), 'a single contributing attempt must be stated');
    assert(arrays[1].textContent.includes('67% correct'), 'a 6-observation area may show a percentage');
    assert(arrays[1].textContent.includes('Last 7 local days'), 'trend copy must appear when a window has data');
    const lists = [...byTopic.entries()].find(([heading]) => heading.includes('Linked lists'));
    assert(lists[1].textContent.includes('1 correct / 3 attempted'));
    assert(lists[1].textContent.includes('Not enough data for a percentage'), 'below 5 observations must hide the percentage');
    assert(!lists[1].textContent.includes('% correct'), 'no percentage below the minimum sample');
    const generic = [...byTopic.entries()].find(([heading]) => heading.includes('Topic not recorded'));
    assert(generic, 'generic placeholder topics must collapse into one honest row');
    assert(generic[1].textContent.includes('1 correct / 2 attempted'), generic[1].textContent);
    assert(doc.getElementById('weak-summary').textContent.includes('at least 5 observations'));
    const practiceLinks = doc.getElementById('weak-areas').querySelectorAll('a').map(a => a.href);
    assert(practiceLinks.includes(BASE + 'quiz/setup.html?subject=CST201&unit=1'), 'weak area must link to practice');
    assert(practiceLinks.includes(BASE + 'cards.html?subject=CST201&unit=1'), 'weak area must link to its cards');
    assert(!RAW_CODE_RE.test(visibleText(doc, TODAY_IDS)), 'Today must never print a raw course code');
    assert(!RAW_QID_RE.test(visibleText(doc, TODAY_IDS)), 'Today must never print an internal question id');

    // Configurable goal: rejects nonsense without changing state, accepts valid input.
    doc.getElementById('goal').value = '0';
    doc.getElementById('save-goal').dispatchEvent({ type: 'click' });
    assert(doc.getElementById('study-status').textContent.includes('whole number'), 'invalid goals must be rejected');
    assert.equal(win.StudyStore.read().goal, 20, 'a rejected goal must not be saved');
    doc.getElementById('goal').value = '25';
    doc.getElementById('save-goal').dispatchEvent({ type: 'click' });
    assert.equal(win.StudyStore.read().goal, 25, 'a valid goal must persist locally');
    assert(doc.getElementById('goal-progress').textContent.includes('/ 25 activities'));
    doc.getElementById('new-limit').value = '101';
    doc.getElementById('save-limit').dispatchEvent({ type: 'click' });
    assert.equal(win.StudyStore.read().newLimit, 20, 'out-of-range new-card caps must be rejected');
    doc.getElementById('new-limit').value = '5';
    doc.getElementById('save-limit').dispatchEvent({ type: 'click' });
    assert.equal(win.StudyStore.read().newLimit, 5);

    // Resettable streak start (no confirm() in this harness, so it applies directly).
    doc.getElementById('reset-streak').dispatchEvent({ type: 'click' });
    assert.equal(win.StudyStore.read().streakStart, win.StudyStore.day(Date.now()), 'reset must set a local start date');
    assert(doc.getElementById('streak-reset-note').textContent.includes('Counting starts from'));
  }
  console.log('PASS Today plan/primary action, goal config, streak + reset, question of the day, denominators');

  /* ── 5. today.html — honest empty state with no history at all ────────── */
  {
    const { win, doc } = createMiniDom(BASE + 'today.html');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    win.StudyStorage = makeStorage();
    win.QuizAttempts = { history: () => [], mistakes: () => ({ schemaVersion: 1, items: {} }) };
    mountToday(doc);
    await boot(win);
    assert(doc.getElementById('streak').textContent.includes('0 days'));
    assert(doc.getElementById('mistake-count').textContent.includes('No unresolved mistakes'));
    assert(doc.getElementById('weak-areas').textContent.includes('No keyed MCQ practice history yet'));
    assert.equal(doc.getElementById('primary-action').querySelector('a').href, BASE + 'cards.html');
    assert(doc.getElementById('goal-progress').textContent.includes('0 / 20 activities'));
    assert(doc.getElementById('plan-detail').textContent.includes('0 unresolved local mistakes'));
  }
  console.log('PASS Today empty states (streak, mistakes, weak areas, goal)');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
