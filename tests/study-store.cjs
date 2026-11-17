/* Deterministic zero-dependency scheduler + analytics suite for Phase 5.
   Fixed inputs only: no browser, no network, no wall-clock guessing beyond the
   documented clamps. New sections use fresh stores so earlier assertions stay
   exactly as they were. */
'use strict';
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const DAY = 86400000;

function makeStore(initial = null) {
  const box = { raw: initial };
  const context = { localStorage: { getItem: () => box.raw, setItem: (_key, value) => { box.raw = value; } }, console, Date };
  context.StudyStorage = { legacy: context.localStorage };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('assets/js/study-store.js', 'utf8'), context);
  return { S: context.StudyStore, box };
}

const { S } = makeStore();
const now = Date.now();

/* ── 1. Fixed Leitner ladder, idempotence, clamp, cap, weak denominators ── */
for (const [rating, days] of [['again', 1], ['hard', 1], ['good', 1], ['easy', 3]]) {
  const value = S.next(null, rating, now, 'event');
  assert.equal(value.interval, days);
  assert.equal(value.due, now + days * DAY);
  assert.equal(S.next(value, rating, now, 'event'), value);
}
const first = S.rate('card', 'good', 'one');
assert.equal(S.rate('card', 'good', 'one').reps, 1);
const later = S.next(first, 'good', first.lastReviewed - 900000, 'two');
assert(later.lastReviewed >= first.lastReviewed);
assert.equal(later.interval, 3);
const state = S.read();
state.newLimit = 2;
S.write(state);
assert.equal(S.queue([{ id: 'a' }, { id: 'b' }, { id: 'c' }]).length, 1);
assert.equal(S.weak([{ outcome: 'abandoned', questions: [{ type: 'mcq' }] }]).length, 0);
const weak = S.weak([{ config: { subject: 'CST201' }, questions: [{ id: 'q', unit: 1, type: 'mcq', correct: 'A', options: { A: 'yes' } }], answers: {} }])[0];
assert.equal(weak.attempted, 1);
assert.equal(weak.skipped, 1);
console.log('PASS Leitner rating intervals, due dates, idempotence, backward clock clamp, cap, weak denominators');

/* ── 2. Local 7-day windows, minimum samples, generic-topic collapse ───── */
const clock = new Date(2026, 10, 9, 12, 0, 0).getTime();
const question = { id: 'q', subject: 'CST201', unit: 1, topic: 'Arrays', type: 'mcq', correct: 'A', options: { A: 'yes', B: 'no' } };
function entry(offset, answer) {
  const date = new Date(clock);
  date.setDate(date.getDate() + offset);
  return { completedAt: date.getTime(), questions: [question], answers: { q: answer } };
}
const history = [...Array.from({ length: 5 }, () => entry(0, 'A')), ...Array.from({ length: 5 }, () => entry(-7, 'B')), entry(-14, 'A'), entry(1, 'A'), { ...entry(0, 'A'), outcome: 'abandoned' }];
const trend = S.trends(history, clock).get('CST201|1|Arrays');
assert.equal(trend.recent.attempted, 5);
assert.equal(trend.previous.attempted, 5);
assert.equal(trend.delta, 100);
assert.equal(S.trends(history.slice(0, 4), clock).get('CST201|1|Arrays').delta, null);
assert.equal(S.weak([entry(0, '   ')])[0].skipped, 1);
const midnight = new Date(2026, 10, 9, 0, 0, 0).getTime();
assert.equal(S.trends([entry(-6, 'A')], midnight).get('CST201|1|Arrays').recent.attempted, 1);
const genericAttempt = {
  completedAt: clock,
  questions: [
    { id: 'g1', subject: 'CST201', unit: 1, topic: 'General', type: 'mcq', correct: 'A', options: { A: 'yes', B: 'no' } },
    { id: 'g2', subject: 'CST201', unit: 1, topic: 'Unit 1', type: 'mcq', correct: 'A', options: { A: 'yes', B: 'no' } }
  ],
  answers: { g1: 'B', g2: 'B' }
};
const genericWeak = S.weak([genericAttempt]);
assert.equal(genericWeak.length, 1);
assert.equal(genericWeak[0].topic, 'Unspecified');
assert.equal(genericWeak[0].genericTopic, true);
assert.equal(genericWeak[0].attempted, 2);
console.log('PASS local 7-day windows, minimum samples, skipped whitespace, future/abandoned exclusion, generic topic collapse');

/* ── 3. Due ordering, per-day new-card cap, local day rollover ─────────── */
{
  const { S: T } = makeStore();
  const cards = ['c1', 'c2', 'c3', 'c4', 'c5'].map(id => ({ id }));
  T.write({ schemaVersion: 1, cards: {}, events: [], goal: 20, newLimit: 2, streakStart: null });
  let plan = T.plan(cards, now);
  assert.equal(plan.dueCount, 0);
  assert.equal(plan.newCount, 2, 'the daily new-card cap limits introduction, not due reviews');
  assert.deepEqual(plan.fresh.map(card => card.id), ['c1', 'c2'], 'new cards are introduced in a stable id order');
  T.rate('c1', 'good', 'e1');
  T.rate('c2', 'good', 'e2');
  plan = T.plan(cards, now);
  assert.equal(plan.introducedToday, 2);
  assert.equal(plan.newRemaining, 0, 'cards introduced today consume the allowance');
  assert.equal(plan.newCount, 0);

  const current = T.read();
  const earlier = now - 3 * DAY;
  current.cards.c3 = { state: 'review', box: 0, interval: 1, due: now - 6 * 3600000, reps: 1, lapses: 0, lastRating: 'good', lastReviewed: earlier, lastEventId: 'x', firstDay: T.day(earlier) };
  current.cards.c4 = { state: 'review', box: 0, interval: 1, due: now - 60 * 60000, reps: 1, lapses: 0, lastRating: 'good', lastReviewed: earlier, lastEventId: 'y', firstDay: T.day(earlier) };
  current.newLimit = 5;
  T.write(current);
  plan = T.plan(cards, now);
  assert.deepEqual(plan.due.map(card => card.id), ['c3', 'c4'], 'due cards are ordered by due date, then id');
  assert.deepEqual([...T.queue(cards, now)].map(card => card.id), ['c3', 'c4', 'c5'], 'queue = due first, then new');
  assert.deepEqual([...T.queue(cards, now)], [...T.queue(cards, now)], 'queue order is deterministic');

  // A card introduced yesterday never consumes today's allowance.
  const yesterdayLate = T.dayStart(now) - 60000;
  const rolled = makeStore();
  const seeded = rolled.S.read();
  seeded.newLimit = 1;
  seeded.cards.old = rolled.S.next(null, 'good', yesterdayLate, 'y0');
  seeded.events.push({ id: 'y0', cardId: 'old', at: yesterdayLate, day: rolled.S.day(yesterdayLate), rating: 'good' });
  rolled.S.write(seeded);
  const nextPlan = rolled.S.plan([{ id: 'fresh-1' }, { id: 'fresh-2' }, { id: 'old' }], now);
  assert.equal(nextPlan.introducedToday, 0, 'yesterday\'s intros are not today\'s');
  assert.equal(nextPlan.newRemaining, 1);
  assert.equal(nextPlan.dueCount, 0, 'a card introduced at 23:59 yesterday is not due today');
  assert.equal(nextPlan.studiedToday, 0, 'yesterday\'s reviews are not counted as studied today');
}
console.log('PASS due ordering, 20-per-day new-card cap, and local midnight rollover');

/* ── 4. Clock skew, reload survival, duplicate ratings ─────────────────── */
{
  const { S: K, box } = makeStore();
  const base = Date.now() - 5 * DAY;
  const prior = K.next(null, 'good', base, 'a');
  const backward = K.next(prior, 'good', base - 10 * DAY, 'b');
  assert(backward.lastReviewed >= prior.lastReviewed, 'a backwards clock may not move a review earlier');
  assert(backward.due >= prior.due, 'a backwards clock may not pull a card forward');
  const forward = K.next(prior, 'good', Date.now() + 100 * DAY, 'c');
  assert(forward.lastReviewed <= Date.now() + DAY + 1000, 'a forward clock jump is clamped to wall + 1 day');
  assert(forward.due <= Date.now() + 40 * DAY, 'a forward jump may not push a card years away (clamp + max interval)');
  assert(forward.due < prior.due + 100 * DAY, 'the unclamped 100-day jump must not be stored');

  const rated = K.rate('keep', 'good', 'r1');
  const duplicate = K.rate('keep', 'again', 'r1');
  assert.equal(K.read().events.length, 1, 'the same event id must never record a second review');
  assert.equal(duplicate.lastRating, rated.lastRating, 'a duplicate rating must not rewrite the stored rating');

  const reloaded = makeStore(box.raw);
  assert.equal(reloaded.S.read().events.length, 1, 'progress survives a reload');
  assert.equal(reloaded.S.read().cards.keep.reps, 1);
  assert(![...reloaded.S.queue([{ id: 'keep' }, { id: 'other' }], Date.now())].map(card => card.id).includes('keep'),
    'a reviewed card does not reappear the same day');
  assert.equal(reloaded.S.read().schemaVersion, 1, 'one schema version, no silent migration');
}
console.log('PASS backward/forward clock clamps, duplicate-rating safety, and reload survival');

/* ── 5. Streak, daily goal, question of the day, attempt counts ────────── */
{
  const { S: G } = makeStore();
  const at = Date.now();
  const key = offset => {
    const date = new Date(at);
    date.setDate(date.getDate() - offset);
    return G.day(date.getTime());
  };
  const events = [0, 1, 2, 4].map(offset => ({ id: `e${offset}`, cardId: `card-${offset}`, at: at - offset * DAY, day: key(offset), rating: 'good' }));
  G.write({ schemaVersion: 1, cards: {}, events, goal: 20, newLimit: 20, streakStart: null });
  let streak = G.streak(G.read(), [], at);
  assert.equal(streak.days, 3, 'a gap stops the streak; today back to the last active day counts');
  assert.equal(streak.activeDays, 4);

  const started = G.read();
  started.streakStart = key(1);
  G.write(started);
  assert.equal(G.streak(G.read(), [], at).days, 2, 'a reset start date truncates older days');
  assert.equal(G.resetStreak(G.read(), at), key(0), 'resetting sets the local start day');
  assert.equal(G.streak(G.read(), [], at).days, 1, 'after a reset only today counts');

  const goalState = G.read();
  goalState.goal = 5;
  goalState.events = [
    { id: 'g1', cardId: 'card-a', at, day: key(0), rating: 'good' },
    { id: 'g2', cardId: 'card-b', at, day: key(0), rating: 'good' }
  ];
  G.write(goalState);
  const attempts = [
    { id: 'a1', completedAt: at, questions: [{ id: 'q1', type: 'mcq' }, { id: 'q2', type: 'mcq' }, { id: 'q3', type: 'mcq' }], answers: { q1: 'A', q2: 'B', q3: '   ' } },
    { id: 'a2', completedAt: at, outcome: 'abandoned', questions: [{ id: 'q4', type: 'mcq' }], answers: { q4: 'A' } },
    { id: 'a3', completedAt: at - DAY, questions: [{ id: 'q5', type: 'mcq' }], answers: { q5: 'A' } }
  ];
  const progress = G.goalProgress(G.read(), attempts, at);
  assert.equal(progress.cards, 2);
  assert.equal(progress.questions, 2, 'a blank answer is not an answered question');
  assert.equal(progress.attempts, 1, 'abandoned and other-day attempts are excluded');
  assert.equal(progress.total, 4);
  assert.equal(progress.goal, 5);
  assert.equal(progress.remaining, 1);
  assert.equal(progress.met, false);

  const pool = [
    { id: 'card-A', sourceType: 'pyq' },
    { id: 'card-B', sourceType: 'pyq' },
    { id: 'card-C', sourceType: 'pyq' },
    { id: 'card-Q', sourceType: 'quiz' }
  ];
  const pick = G.questionOfDay(pool, at);
  assert.equal(pick.id, G.questionOfDay(pool, at).id, 'the same local day always yields the same question');
  assert.notEqual(pick.sourceType, 'quiz', 'only sourced model-answer questions are offered');
  assert.notEqual(G.questionOfDay(pool, at, 1).id, pick.id, '"another question" advances deterministically');
  assert.notEqual(G.questionOfDay(pool, at + DAY).id, undefined, 'a new day still yields a question');

  const area = { id: 'q', unit: 1, topic: 'Arrays', type: 'mcq', correct: 'A', options: { A: 'yes', B: 'no' } };
  const rows = G.weak([
    { id: 'one', config: { subject: 'CST201' }, completedAt: at, questions: [area], answers: { q: 'A' } },
    { id: 'two', config: { subject: 'CST201' }, completedAt: at, questions: [area], answers: { q: 'B' } }
  ]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].attempted, 2);
  assert.equal(rows[0].correct, 1);
  assert.equal(rows[0].attempts, 2, 'attempt counts are distinct practice attempts, not observations');
  assert.equal(rows[0].lastSeen, at);
}
console.log('PASS streak boundaries/reset, daily goal arithmetic, deterministic question of the day, attempt counts');

/* ── 6. Corrupt or foreign state is reported, never silently replaced ──── */
{
  const { S: C } = makeStore(JSON.stringify({ schemaVersion: 2, cards: {}, events: [] }));
  assert.throws(() => C.read(), /cannot be read/);
  const { S: B } = makeStore('not json');
  assert.throws(() => B.read(), /cannot be read/);
}
console.log('PASS foreign/unreadable study state is reported without deleting it');
