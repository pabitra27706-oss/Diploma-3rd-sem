/* Study review UI for cards.html (session) and today.html ("what now").
 * Rendering is textContent-only: no innerHTML, no template strings as HTML.
 * All progress comes from StudyStore (one namespaced key, schemaVersion 1);
 * all labels come from subjectLabel(), so no card ever shows a raw course code
 * or an internal question id. Honest framing: a card's answer is a stored model
 * answer or an existing keyed explanation, never a newly certified key.
 */
(() => {
  'use strict';
  const base = new URL('../../', document.currentScript.src);
  const $ = selector => document.querySelector(selector);
  const status = $('#study-status');
  const node = (tag, text, parent) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (parent) parent.append(element);
    return element;
  };
  const label = code => (typeof window.subjectLabel === 'function' ? window.subjectLabel(code) : 'Subject');
  const link = (text, target, parent) => {
    const anchor = node('a', text, parent);
    anchor.href = new URL(target, base).href;
    return anchor;
  };
  const to = (path, params) => {
    const url = new URL(path, base);
    if (params) url.search = new URLSearchParams(params).toString();
    return url.href;
  };
  const unitText = unit => (unit === null || unit === undefined || unit === '' ? 'Unit not recorded' : `Unit ${unit}`);
  const DEFAULT_VERIFICATION = {
    'model-answer-not-certified': 'Model answer, not independently certified',
    'keyed-explanation-unverified-mapping': 'Existing keyed explanation; the source mapping may remain unverified'
  };

  async function json(path) {
    const response = await fetch(new URL(path, base));
    if (!response.ok) throw Error('Study material unavailable. Reconnect and reload; existing progress was retained.');
    return response.json();
  }

  async function load() {
    const manifest = await json('assets/cards/manifest.json');
    const cards = (await Promise.all(Object.values(manifest.subjects).map(subject => json('assets/cards/' + subject.file)))).flat();
    const notes = Object.assign({}, DEFAULT_VERIFICATION, manifest.verificationNotes || {});
    return { manifest, cards, notes };
  }

  const attemptHistory = () => (globalThis.QuizAttempts ? QuizAttempts.history() : []);
  const mistakeItems = () => (globalThis.QuizAttempts ? Object.keys(QuizAttempts.mistakes().items || {}) : []);

  function sourceLink(card) {
    if (card.sourceType === 'pyq') {
      return to('pyq/answers.html', { paper: card.paperId || card.subject, q: card.sourceId });
    }
    return to('quiz/setup.html', { subject: card.subject, unit: card.unit });
  }

  /* ── cards.html — answer first, reveal, rate ───────────────────────────── */
  function cardsPage({ manifest, cards, notes }) {
    const subjectSelect = $('#card-subject');
    const unitSelect = $('#card-unit');
    const sessionPanel = $('#card-session');
    const emptyPanel = $('#card-empty');
    const ratings = $('#card-ratings');
    const revealButton = $('#reveal-card');
    const sourceAnchor = $('#card-source');
    const session = globalThis.crypto?.randomUUID?.() || `s-${Date.now().toString(36)}`;
    let queue = [];
    let index = 0;
    let revealed = false;
    let lastPlan = null;

    Object.keys(manifest.subjects).forEach(code => subjectSelect.add(new Option(label(code), code)));
    unitSelect.add(new Option('All units', ''));
    for (const unit of [1, 2, 3, 4, 5]) unitSelect.add(new Option(unitText(unit), String(unit)));

    function filters() {
      const params = new URLSearchParams(location.search);
      return { subject: subjectSelect.value || params.get('subject') || '', unit: params.get('unit') || '' };
    }

    function filtered(criteria = filters()) {
      return cards.filter(card => (!criteria.subject || card.subject === criteria.subject)
        && (!criteria.unit || String(card.unit) === String(criteria.unit)));
    }

    function syncFromUrl() {
      const params = new URLSearchParams(location.search);
      const subject = params.get('subject') || '';
      const unit = params.get('unit') || '';
      subjectSelect.value = Object.hasOwn(manifest.subjects, subject) ? subject : '';
      unitSelect.value = /^[1-9]$/.test(unit) ? unit : '';
    }

    function syncUrl() {
      const url = new URL(location.href);
      const subject = subjectSelect.value;
      const unit = unitSelect.value;
      if (subject) url.searchParams.set('subject', subject); else url.searchParams.delete('subject');
      if (unit) url.searchParams.set('unit', unit); else url.searchParams.delete('unit');
      if (url.href !== location.href) history.pushState(null, '', url.href);
    }

    function start() {
      const plan = StudyStore.plan(filtered());
      lastPlan = plan;
      queue = [...plan.due, ...plan.fresh];
      index = 0;
      render();
    }

    function emptyState() {
      const plan = lastPlan || StudyStore.plan(filtered());
      const rows = mistakeItems();
      const areas = StudyStore.weak(attemptHistory());
      const weakest = areas.find(row => row.attempted >= StudyStore.MIN_SAMPLE) || areas[0] || null;
      emptyPanel.replaceChildren();
      node('h3', 'No more due or new cards in this session', emptyPanel);
      node('p', `Progress is saved locally. ${plan.dueCount} card(s) are due later and ${plan.newRemaining} of today's new-card allowance `
        + `(${StudyStore.read().newLimit}) is unused for this filter.`, emptyPanel);
      const list = node('ul', undefined, emptyPanel);
      const item = (text, target) => { const li = node('li', undefined, list); link(text, target, li); };
      item(rows.length
        ? `Practise ${rows.length} saved mistake${rows.length === 1 ? '' : 's'}`
        : 'Open the local mistake queue (nothing saved yet)', 'quiz/index.html');
      if (weakest) {
        const place = `${label(weakest.subject)} ${unitText(weakest.unit)}`;
        item(`Practise the weakest recorded area — ${place} (${weakest.correct}/${weakest.attempted} correct)`,
          to('quiz/setup.html', { subject: weakest.subject, unit: weakest.unit }));
        item(`Review cards for ${place}`, to('cards.html', { subject: weakest.subject, unit: weakest.unit }));
      }
      if (filters().subject || filters().unit) item('Clear the subject/unit filter and check every subject', 'cards.html');
      item('Start a practice set from the previous-year papers', 'practice/index.html');
      item('Open Today for the daily goal, streak and next action', 'today.html');
    }

    function render() {
      revealed = false;
      $('#card-answer').hidden = true;
      revealButton.hidden = false;
      ratings.replaceChildren();
      const card = queue[index];
      sessionPanel.hidden = !card;
      emptyPanel.hidden = Boolean(card);
      if (!card) {
        emptyState();
        status.textContent = 'No more due or new cards in this session. Progress is saved locally. '
          + 'Pick another subject or unit above, or use one of the fallbacks below.';
        return;
      }
      const plan = lastPlan || { dueCount: 0, newRemaining: 0 };
      $('#card-progress').textContent = `${index + 1} / ${queue.length}`;
      $('#card-front').textContent = card.front;
      $('#card-back').textContent = card.back;
      const verification = notes[card.verification] || notes['model-answer-not-certified'];
      $('#card-citation').textContent = `${verification} · Source: ${card.citationLabel}`
        + (card.marks ? ` · ${card.marks} mark${card.marks === 1 ? '' : 's'}` : '');
      sourceAnchor.href = sourceLink(card);
      sourceAnchor.textContent = card.sourceType === 'pyq' ? 'Open this paper and question' : 'Practise this unit again';
      status.textContent = `${label(card.subject)} ${unitText(card.unit)} · ${plan.dueCount} due · ${plan.newRemaining} of `
        + `${StudyStore.read().newLimit} new cards left today. Space reveals the answer; keys 1–4 rate; Esc saves progress and exits.`;
      revealButton.focus();
    }

    function reveal() {
      const card = queue[index];
      if (!card || revealed) return;
      revealed = true;
      $('#card-answer').hidden = false;
      revealButton.hidden = true;
      ratings.replaceChildren();
      const prior = StudyStore.read().cards[card.id];
      StudyStore.RATINGS.forEach((rating, position) => {
        const interval = StudyStore.next(prior, rating).interval;
        const button = node('button', `${position + 1} · ${rating} · ${interval} day${interval === 1 ? '' : 's'}`, ratings);
        button.type = 'button';
        button.setAttribute('data-rating', rating);
        button.onclick = () => rate(rating);
      });
      status.textContent = 'Answer revealed. Rate your recall — each button names the next interval. Nothing is sent anywhere.';
      const first = ratings.querySelector('button');
      if (first) first.focus();
    }

    function rate(rating) {
      const card = queue[index];
      if (!revealed || !card) return;
      try {
        StudyStore.rate(card.id, rating, `${session}:${card.id}`);
        index += 1;
        render();
      } catch (error) {
        status.textContent = `Could not save rating: ${error.message}`;
      }
    }

    revealButton.addEventListener('click', reveal);
    $('#start-cards').addEventListener('click', () => { syncUrl(); start(); });
    subjectSelect.addEventListener('change', () => { unitSelect.value = ''; syncUrl(); start(); });
    unitSelect.addEventListener('change', () => { syncUrl(); start(); });
    document.addEventListener('keydown', event => {
      const tag = document.activeElement?.tagName || '';
      if (/INPUT|SELECT|TEXTAREA/.test(tag)) return;
      if (event.key === 'Escape') { location.href = to('today.html'); return; }
      if ((event.code === 'Space' || event.key === ' ') && !revealed && queue[index]) {
        event.preventDefault();
        reveal();
        return;
      }
      if (revealed && /^[1-4]$/.test(event.key)) {
        event.preventDefault();
        rate(StudyStore.RATINGS[Number(event.key) - 1]);
      }
    });
    window.addEventListener('popstate', () => { syncFromUrl(); start(); });
    syncFromUrl();
    start();
  }

  /* ── today.html — one screen answering "what now" ──────────────────────── */
  function todayPage({ cards }) {
    const goalInput = $('#goal');
    const limitInput = $('#new-limit');
    const goalMeter = $('#goal-meter');

    function weakestRows() {
      const areas = StudyStore.weak(attemptHistory());
      const ready = areas.filter(row => row.attempted >= StudyStore.MIN_SAMPLE);
      return { areas, ready };
    }

    function saveField(field, input, minimum, maximum) {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < minimum || value > maximum) {
        status.textContent = `Choose a whole number from ${minimum} to ${maximum}. Your saved settings were not changed.`;
        return false;
      }
      const current = StudyStore.read();
      current[field] = value;
      StudyStore.write(current);
      render();
      return true;
    }

    let offset = 0;
    function render() {
      const current = StudyStore.read();
      const attempts = attemptHistory();
      const plan = StudyStore.plan(cards, Date.now(), current);
      const goal = StudyStore.goalProgress(current, attempts, Date.now());
      const streak = StudyStore.streak(current, attempts, Date.now());
      const rows = mistakeItems();
      const { areas, ready } = weakestRows();

      goalInput.value = current.goal;
      limitInput.value = current.newLimit;
      goalMeter.max = current.goal;
      goalMeter.value = Math.min(goal.total, current.goal);
      goalMeter.textContent = `${goal.total} of ${current.goal} activities`;
      $('#goal-progress').textContent = `${goal.total} / ${current.goal} activities today `
        + `(${goal.cards} card reviews + ${goal.questions} answered questions across ${goal.attempts} attempt`
        + `${goal.attempts === 1 ? '' : 's'}). `
        + (goal.met ? 'Daily goal reached — anything more is optional.' : `${goal.remaining} to go; any pace is fine.`);
      $('#new-limit-help').textContent = `New cards per day (${plan.introducedToday} introduced today, `
        + `${plan.newRemaining} still allowed). Due cards are never capped.`;

      $('#plan-detail').textContent = `${plan.dueCount} card${plan.dueCount === 1 ? '' : 's'} due now · `
        + `${plan.newCount} new card${plan.newCount === 1 ? '' : 's'} available in this allowance · `
        + `${rows.length} unresolved local mistake${rows.length === 1 ? '' : 's'}.`;

      const primary = $('#primary-action');
      primary.replaceChildren();
      let actionText, actionTarget, actionWhy;
      if (plan.dueCount > 0) {
        actionText = `Review ${plan.dueCount} due card${plan.dueCount === 1 ? '' : 's'}`;
        actionTarget = 'cards.html';
        actionWhy = 'Scheduled from your own ratings on this device; no server decides this queue.';
      } else if (plan.newCount > 0) {
        actionText = `Start ${plan.newCount} new card${plan.newCount === 1 ? '' : 's'}`;
        actionTarget = 'cards.html';
        actionWhy = `Nothing is due yet; today's new-card allowance has ${plan.newRemaining} place${plan.newRemaining === 1 ? '' : 's'} left.`;
      } else if (rows.length) {
        actionText = `Practise ${rows.length} saved mistake${rows.length === 1 ? '' : 's'}`;
        actionTarget = 'quiz/index.html';
        actionWhy = 'No cards are waiting, so the saved mistake queue is the next honest step.';
      } else if (ready.length) {
        actionText = `Practise ${label(ready[0].subject)} ${unitText(ready[0].unit)}`;
        actionTarget = to('quiz/setup.html', { subject: ready[0].subject, unit: ready[0].unit });
        actionWhy = 'Your weakest sample-qualified area on this device.';
      } else {
        actionText = 'Start a practice set';
        actionTarget = 'practice/index.html';
        actionWhy = 'No cards or local practice history yet, so a short practice set comes first.';
      }
      link(actionText, actionTarget, primary);
      node('p', actionWhy, $('#primary-why'));

      $('#due-count').textContent = `${plan.dueCount} due now; ${plan.newCount} new card${plan.newCount === 1 ? '' : 's'} `
        + `within today's allowance of ${current.newLimit}.`;
      $('#mistake-count').textContent = rows.length
        ? `${rows.length} unresolved local mistake${rows.length === 1 ? '' : 's'} saved on this device.`
        : 'No unresolved mistakes saved yet. Quizzes add them automatically.';

      $('#streak').textContent = streak.days
        ? `${streak.days} consecutive local activity day${streak.days === 1 ? '' : 's'} `
          + `(${streak.activeDays} day${streak.activeDays === 1 ? '' : 's'} with recorded local activity in total). `
          + 'Any pace is welcome; a missed day is not a failure.'
        : 'No local activity recorded yet, so the streak is 0 days. It counts only days this device recorded.';
      $('#streak-reset-note').textContent = current.streakStart
        ? `Counting starts from ${current.streakStart}; earlier days are ignored on purpose.`
        : 'Resetting only sets a new start date; saved reviews stay intact.';

      const container = $('#weak-areas');
      container.replaceChildren();
      if (!areas.length) {
        node('p', 'No keyed MCQ practice history yet, so there is nothing to rank. Try a quiz first.', container);
        link('Open the quiz setup', 'quiz/setup.html', container);
      } else {
        const summary = $('#weak-summary');
        summary.textContent = ready.length
          ? `${ready.length} area${ready.length === 1 ? '' : 's'} with at least ${StudyStore.MIN_SAMPLE} observations can show a percentage; `
            + `${areas.length - ready.length} more below that sample size. Counts are always shown.`
          : `No area has ${StudyStore.MIN_SAMPLE} observations yet, so no percentage is shown. Counts are always shown.`;
        const trends = StudyStore.trends(attempts);
        for (const row of areas.slice(0, 10)) {
          const article = node('article', undefined, container);
          const place = `${label(row.subject)} · ${unitText(row.unit)} · ${row.topic === 'Unspecified' ? 'Topic not recorded (generic placeholder collapsed)' : row.topic}`;
          node('h3', place, article);
          const percent = row.attempted >= StudyStore.MIN_SAMPLE
            ? `${Math.round(100 * row.correct / row.attempted)}% correct (practice history on this device, not a prediction).`
            : `Not enough data for a percentage (minimum ${StudyStore.MIN_SAMPLE} observations).`;
          node('p', `${row.correct} correct / ${row.attempted} attempted · ${row.skipped} skipped · `
            + `${row.attempts} attempt${row.attempts === 1 ? '' : 's'}. ${percent}`, article);
          const trend = trends.get(StudyStore.areaKey({ subject: row.subject }, { unit: row.unit, topic: row.genericTopic ? 'General' : row.topic }));
          if (trend) {
            const windows = `Last 7 local days: ${trend.recent.correct}/${trend.recent.attempted}; previous 7: ${trend.previous.correct}/${trend.previous.attempted}. `;
            node('p', windows + (trend.delta === null
              ? `No trend yet: both windows need ${StudyStore.MIN_SAMPLE} observations.`
              : `Change: ${trend.delta > 0 ? '+' : ''}${trend.delta} percentage points (descriptive, not a learning-gain claim).`), article);
          } else {
            node('p', 'No observations in the last two 7-day windows.', article);
          }
          if (row.unit) {
            const unitCards = cards.filter(card => card.subject === row.subject && Number(card.unit) === Number(row.unit));
            const keyed = unitCards.some(card => card.sourceType === 'quiz');
            if (keyed) link('Practise this unit', to('quiz/setup.html', { subject: row.subject, unit: row.unit }), article);
            else link('Find archived questions for this unit', to('search.html', { subject: row.subject, unit: row.unit }), article);
            if (unitCards.length) link('Review related cards', to('cards.html', { subject: row.subject, unit: row.unit }), article);
            else node('p', 'No source-eligible cards exist for this stored unit.', article);
          }
        }
      }

      const card = StudyStore.questionOfDay(cards, Date.now(), offset);
      $('#daily-question').textContent = card
        ? `${card.front}`
        : 'No sourced question is available offline yet.';
      $('#daily-citation').textContent = card ? `Source: ${card.citationLabel}` : '';
      if (card) $('#daily-link').href = sourceLink(card);
      $('#another-question').hidden = !card;

      status.textContent = 'Local-only summary; question counts cover the retained history (up to 50 attempts). '
        + 'No long-term usage tracking and no upload.';
    }

    goalMeter.className = 'study-meter';
    goalMeter.setAttribute('role', 'img');
    $('#save-goal').addEventListener('click', () => saveField('goal', goalInput, 1, 500));
    $('#save-limit').addEventListener('click', () => saveField('newLimit', limitInput, 0, 100));
    $('#another-question').addEventListener('click', () => { offset += 1; render(); });
    $('#reset-streak').addEventListener('click', () => {
      const question = 'Start counting activity days from today? Saved reviews and goals stay intact.';
      if (typeof globalThis.confirm === 'function' && !globalThis.confirm(question)) return;
      StudyStore.resetStreak(StudyStore.read(), Date.now());
      render();
    });
    $('#goal-form').addEventListener('submit', event => event.preventDefault());
    render();
  }

  async function init() {
    try {
      const { manifest, cards, notes } = await load();
      if ($('#card-subject')) cardsPage({ manifest, cards, notes });
      else todayPage({ cards, manifest });
      if (navigator.serviceWorker?.controller) navigator.serviceWorker.controller.postMessage({ type: 'WARM_STUDY' });
    } catch (error) {
      status.textContent = error.message;
    }
  }

  init();
})();
