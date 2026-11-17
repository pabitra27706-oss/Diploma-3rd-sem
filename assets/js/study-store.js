/* Deterministic local Leitner scheduler — no FSRS, no network, no telemetry.
 *
 * Documented formula (fixed, unit-tested, never tuned from learner data):
 *   boxes      0..4 with intervals 1, 3, 7, 16, 35 days.
 *   again      -> box 0, state 'learning', lapses + 1
 *   hard       -> box max(0, box - 1)
 *   good       -> box min(4, box + 1)      (a new card starts at box -1)
 *   easy       -> box min(4, box + 2)
 *   due        = clamped-review-time + interval * 24h
 *   reps       = reps + 1 for every recorded rating
 * Clock safety: a rating never moves time backwards past the card's own
 * lastReviewed, and a forward jump beyond one day past the device wall clock is
 * clamped to wall + 1 day, so a wrong clock cannot push a card years away.
 * Idempotence: an event id that is already stored (or matches the card's
 * lastEventId) returns the stored card unchanged — a double tap, a retried
 * write or a reload can never add a second review of the same card.
 * Day boundaries are local calendar days (Y-M-D), never UTC and never
 * "add 24 hours", so midnight and daylight-saving changes roll over correctly.
 * Everything lives in ONE namespaced key with schemaVersion 1 through the
 * StudyStorage boundary; nothing here writes raw localStorage.
 */
(() => {
  'use strict';
  const KEY = 'd3s:study:v1';
  const SCHEMA_VERSION = 1;
  const DAY = 86400000;
  const INTERVALS = [1, 3, 7, 16, 35];
  const RATINGS = ['again', 'hard', 'good', 'easy'];
  const MIN_SAMPLE = 5;
  const EVENT_CAP = 5000;

  const blank = () => ({ schemaVersion: SCHEMA_VERSION, cards: {}, events: [], goal: 20, newLimit: 20, streakStart: null });

  function read() {
    const raw = StudyStorage.legacy.getItem(KEY);
    if (!raw) return blank();
    let value;
    try { value = JSON.parse(raw); } catch { value = null; }
    if (!value || value.schemaVersion !== SCHEMA_VERSION || !value.cards || !Array.isArray(value.events)) {
      throw Error('Study progress cannot be read. It has not been deleted. Export site data before resetting.');
    }
    if (!Number.isInteger(value.goal) || value.goal < 1) value.goal = 20;
    if (!Number.isInteger(value.newLimit) || value.newLimit < 0) value.newLimit = 20;
    if (!Object.hasOwn(value, 'streakStart')) value.streakStart = null;
    return value;
  }

  function write(value) { StudyStorage.legacy.setItem(KEY, JSON.stringify(value)); return value; }

  const pad = number => String(number).padStart(2, '0');
  function day(now = Date.now()) {
    const date = new Date(now);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  function dayStart(now = Date.now()) { const date = new Date(now); date.setHours(0, 0, 0, 0); return date.getTime(); }

  function clampTime(prior, now) {
    const wall = Date.now();
    const value = Number.isFinite(now) ? now : wall;
    const floor = Number(prior?.lastReviewed) || 0;
    return Math.max(floor, Math.min(value, wall + DAY));
  }

  function boxFor(prior, rating) {
    const current = Number.isInteger(prior?.box) ? prior.box : -1;
    if (rating === 'again') return 0;
    if (rating === 'hard') return Math.max(0, current - 1);
    return Math.min(INTERVALS.length - 1, current + (rating === 'easy' ? 2 : 1));
  }

  function next(prior, rating, now = Date.now(), eventId = '') {
    if (!RATINGS.includes(rating)) throw Error('Unknown rating');
    if (eventId && prior?.lastEventId === eventId) return prior;
    const at = clampTime(prior, now);
    const box = boxFor(prior, rating);
    const interval = INTERVALS[box];
    return {
      state: rating === 'again' ? 'learning' : 'review',
      box,
      interval,
      due: at + interval * DAY,
      reps: (prior?.reps || 0) + 1,
      lapses: (prior?.lapses || 0) + (rating === 'again' ? 1 : 0),
      lastRating: rating,
      lastReviewed: at,
      lastEventId: eventId || prior?.lastEventId || '',
      firstDay: prior?.firstDay || day(at)
    };
  }

  function rate(id, rating, eventId) {
    const state = read();
    if (eventId && (state.events.some(event => event.id === eventId) || state.cards[id]?.lastEventId === eventId)) {
      return state.cards[id];
    }
    const at = clampTime(state.cards[id], Date.now());
    const value = next(state.cards[id], rating, at, eventId);
    state.cards[id] = value;
    state.events.push({ id: eventId, cardId: id, at: value.lastReviewed, day: day(value.lastReviewed), rating });
    if (state.events.length > EVENT_CAP) state.events = state.events.slice(-EVENT_CAP);
    write(state);
    return value;
  }

  function plan(cards, now = Date.now(), state = read()) {
    const today = day(now);
    const studiedToday = state.events.filter(event => event.day === today);
    const seen = new Set(studiedToday.map(event => event.cardId));
    const due = cards
      .filter(card => state.cards[card.id] && state.cards[card.id].due <= now && !seen.has(card.id))
      .sort((a, b) => state.cards[a.id].due - state.cards[b.id].due || a.id.localeCompare(b.id));
    const introducedToday = Object.values(state.cards).filter(card => card.firstDay === today).length;
    const newRemaining = Math.max(0, state.newLimit - introducedToday);
    const fresh = cards
      .filter(card => !state.cards[card.id])
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, newRemaining);
    return { due, fresh, dueCount: due.length, newCount: fresh.length, newRemaining, introducedToday, studiedToday: studiedToday.length };
  }

  function queue(cards, now = Date.now(), state = read()) {
    const { due, fresh } = plan(cards, now, state);
    return [...due, ...fresh];
  }

  const answered = value => value !== null && value !== undefined && String(value).trim() !== '';
  const GENERIC_TOPIC = /^(general|misc(ellaneous)?|mcq|short(\s+answer)?|long(\s+answer)?|objective|group\s+[a-z]\s*\/\s*(objective|short\s+answer|long\s+answer)|fill|true[-\s]?false|unit\s*\d+|module\s*[a-z0-9]+|chapter\s*\d+|all|n\/?a|unknown|none|question\s*\d+|unspecified)$/i;
  const isGenericTopic = question => !question?.topic || question.topicQuality === 'generic' || GENERIC_TOPIC.test(String(question.topic).trim());
  const topicLabel = question => (isGenericTopic(question) ? 'Unspecified' : String(question.topic).trim());
  const areaKey = (history, question) => (question.subject || history.config?.subject || history.subject) + '|' + (question.unit || '?') + '|' + topicLabel(question);

  // Weak areas: real denominators first, then accuracy, then sample size. An
  // area keeps its correct/attempted counts even below MIN_SAMPLE; only the
  // percentage is withheld. `attempts` counts the local practice attempts that
  // contributed to the row.
  function weak(history) {
    const groups = new Map();
    history.forEach((entry, index) => {
      if (entry.outcome === 'abandoned') return;
      const attemptId = entry.id ? `id:${entry.id}` : `at:${entry.completedAt}:${index}`;
      const touched = new Set();
      for (const question of entry.questions || []) {
        if (question.type !== 'mcq' || !question.options || !Object.hasOwn(question.options, question.correct)) continue;
        const key = areaKey(entry, question);
        const row = groups.get(key) || {
          subject: question.subject || entry.config?.subject || entry.subject,
          unit: question.unit,
          topic: topicLabel(question),
          genericTopic: topicLabel(question) === 'Unspecified',
          attempted: 0, correct: 0, skipped: 0, attempts: 0, lastSeen: 0
        };
        row.attempted++;
        if (!answered(entry.answers?.[question.id])) row.skipped++;
        else if (entry.answers[question.id] === question.correct) row.correct++;
        row.lastSeen = Math.max(row.lastSeen, entry.completedAt || 0);
        groups.set(key, row);
        touched.add(key);
      }
      for (const key of touched) groups.get(key).attempts++;
    });
    return [...groups.values()].sort((a, b) =>
      (a.attempted < MIN_SAMPLE) - (b.attempted < MIN_SAMPLE)
      || (a.correct / a.attempted - b.correct / b.attempted)
      || b.attempted - a.attempted);
  }

  function trends(history, now = Date.now(), minimum = MIN_SAMPLE) {
    // Calendar-day boundaries use local time, including daylight-saving changes.
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const boundary = offset => { const date = new Date(start); date.setDate(date.getDate() + offset); return date.getTime(); };
    const recentStart = boundary(-6), previousStart = boundary(-13), end = boundary(1), groups = new Map();
    for (const entry of history) {
      if (entry.outcome === 'abandoned' || !Number.isFinite(entry.completedAt) || entry.completedAt < previousStart || entry.completedAt >= end || entry.completedAt > now) continue;
      const window = entry.completedAt >= recentStart ? 'recent' : 'previous';
      for (const question of entry.questions || []) {
        if (question.type !== 'mcq' || !question.options || !Object.hasOwn(question.options, question.correct)) continue;
        const key = areaKey(entry, question);
        const row = groups.get(key) || { recent: { attempted: 0, correct: 0, skipped: 0 }, previous: { attempted: 0, correct: 0, skipped: 0 } };
        row[window].attempted++;
        if (!answered(entry.answers?.[question.id])) row[window].skipped++;
        else if (entry.answers[question.id] === question.correct) row[window].correct++;
        groups.set(key, row);
      }
    }
    for (const row of groups.values()) {
      row.delta = row.recent.attempted >= minimum && row.previous.attempted >= minimum
        ? Math.round(row.recent.correct / row.recent.attempted * 100) - Math.round(row.previous.correct / row.previous.attempted * 100)
        : null;
    }
    return groups;
  }

  // Local activity days = recorded card reviews + non-abandoned practice
  // attempts. The streak never counts a day with no recorded local activity,
  // never looks before an explicit reset point, and never exceeds 3,660 days.
  function activityDays(state, history = []) {
    const days = new Set(state.events.map(event => event.day));
    for (const entry of history) {
      if (entry.outcome === 'abandoned' || !Number.isFinite(entry.completedAt)) continue;
      days.add(day(entry.completedAt));
    }
    return days;
  }

  function streak(state, history = [], now = Date.now()) {
    const days = activityDays(state, history);
    const start = new Date(now);
    start.setHours(12, 0, 0, 0);
    let count = 0;
    for (let offset = 0; offset < 3660; offset++) {
      const date = new Date(start);
      date.setDate(date.getDate() - offset);
      const key = day(date.getTime());
      if (state.streakStart && key < state.streakStart) break;
      if (days.has(key)) count++;
      else if (offset === 0) continue;
      else break;
    }
    return { days: count, activeDays: days.size, streakStart: state.streakStart || null };
  }

  function goalProgress(state, history = [], now = Date.now()) {
    const today = day(now);
    const cards = state.events.filter(event => event.day === today).length;
    let questions = 0, attempts = 0;
    for (const entry of history) {
      if (entry.outcome === 'abandoned' || !Number.isFinite(entry.completedAt) || day(entry.completedAt) !== today) continue;
      attempts++;
      questions += Object.values(entry.answers || {}).filter(answered).length;
    }
    const total = cards + questions;
    return { cards, questions, attempts, total, goal: state.goal, remaining: Math.max(0, state.goal - total), met: total >= state.goal };
  }

  function resetStreak(state, now = Date.now()) {
    state.streakStart = day(now);
    write(state);
    return state.streakStart;
  }

  // Deterministic "question of the day": local date string + fixed salt, so the
  // same day gives the same card on every device without a server or storage.
  function questionOfDay(cards, now = Date.now(), offset = 0) {
    const pool = cards.filter(card => card.sourceType === 'pyq').sort((a, b) => a.id.localeCompare(b.id));
    if (!pool.length) return null;
    const seed = day(now) + 'd3s-question';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return pool[(hash + Math.abs(Number(offset) || 0)) % pool.length];
  }

  globalThis.StudyStore = {
    KEY, SCHEMA_VERSION, DAY, INTERVALS, RATINGS, MIN_SAMPLE,
    day, dayStart, next, read, write, rate, plan, queue,
    weak, trends, streak, activityDays, goalProgress, resetStreak, questionOfDay,
    areaKey, isGenericTopic, topicLabel
  };
})();
