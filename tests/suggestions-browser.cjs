/* Phase 11 smoke: base-path navigation, workbook and reading links, archival evidence and offline policy. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const base = new URL(process.env.TEST_BASE || 'http://127.0.0.1:8010/Diploma-3rd-sem/');
const subjects = [
  { name: 'C', slug: 'c', code: 'CST201', order: [2, 3, 1, 4, 5], read: 'loops', bankSource: 'CST201-P006-Q18', bankPattern: /program to add 1/ },
  { name: 'Python', slug: 'python', code: 'CST203', order: [2, 1, 3, 5, 4], read: 'loops' },
  { name: 'Data Structures', slug: 'data-structures', code: 'CST205', order: [2, 3, 1, 4], read: 'stacks-operations-on-stack' },
  { name: 'Computer System Organization', slug: 'cso', code: 'CST207', order: [3, 1, 5, 4, 2], read: 'block-diagram' },
  { name: 'Algorithms', slug: 'algorithms', code: 'CST209', order: [3, 2, 1, 4], read: 'binary-search', bankSource: 'CST209-P006-Q20' },
];
const hub = new URL('suggestions/index.html', base).href;
const bank = 'important-questions';
const easy = 'easy-read';
const guideUrl = ({ slug }, kind) => new URL(`suggestions/${slug}/${kind}.html`, base).href;

async function assertReflow(page) {
  assert(await page.evaluate(() => {
    const main = document.querySelector('main');
    return document.documentElement.scrollWidth <= innerWidth && (!main || main.scrollWidth <= main.clientWidth);
  }), `horizontal overflow at ${page.viewportSize().width}px: ${page.url()}`);
}

async function followSource(link, page, expectedId) {
  const dest = new URL(await link.getAttribute('href'), page.url());
  assert.equal(dest.pathname, new URL('pyq/answers.html', base).pathname);
  const id = dest.searchParams.get('q');
  if (expectedId) assert.equal(id, expectedId);
  await link.press('Enter');
  await page.locator(`.question-card[data-question-id="${id}"][data-deeplink="active"]`).waitFor();
  assert.equal(page.url(), dest.href);
}

async function assertJump(page, target) {
  await page.locator(`a[href="#${target}"]`).press('Enter');
  assert.equal(new URL(page.url()).hash, `#${target}`);
  assert(await page.locator(`#${target}`).evaluate(el => document.activeElement === el &&
    el.getBoundingClientRect().top >= document.querySelector('.suggestions-header').getBoundingClientRect().bottom),
  `Jump must focus ${target} without putting it behind the header`);
}

async function assertBank(page, subject, width) {
  const syllabusOrder = [...subject.order].sort((a, b) => a - b);
  const jumps = page.getByRole('navigation', { name: 'Jump to a syllabus unit' }).getByRole('link');
  assert.deepEqual(await jumps.evaluateAll(links => links.map(link => link.hash)),
    syllabusOrder.map(unit => `#unit-${unit}`));
  for (const [i, label] of (await jumps.allTextContents()).entries()) {
    assert.match(label, new RegExp(`^Unit ${syllabusOrder[i]} .+`), 'Jump links name the unit, not only its number');
  }
  const groups = await page.locator('.suggestions-bank-unit').evaluateAll(units => units.map(unit => {
    const prompts = unit.querySelector('.suggestions-workbook-prompts').getBoundingClientRect();
    const reference = unit.querySelector('.suggestions-workbook-reference').getBoundingClientRect();
    return {
      across: reference.left >= prompts.right - 1 && Math.abs(reference.top - prompts.top) < 1,
      stacked: reference.top >= prompts.bottom - 1,
      facts: unit.querySelectorAll('.suggestions-workbook-example').length,
      rows: Array.from(unit.querySelectorAll('.suggestions-pattern'), row => ({
        number: Number(row.querySelector('.suggestions-workbook-number').textContent),
        count: Number(row.dataset.sessionCount),
        stars: row.querySelector('.suggestions-stars').getAttribute('aria-label'),
        dates: Array.from(row.querySelectorAll('a.suggestions-question time'), time => time.dateTime)
      }))
    };
  }));
  assert.equal(groups.length, syllabusOrder.length);
  for (const { across, stacked, facts, rows } of groups) {
    assert(width < 500 ? stacked : across, 'Quick reference stacks on phones and sits alongside on desktop');
    assert(facts >= 3 && rows.length >= 4);
    for (const [i, { number, count, stars, dates }] of rows.entries()) {
      assert.equal(number, i + 1);
      assert.deepEqual(dates, [...new Set(dates)].sort());
      assert.equal(count, dates.length);
      assert.equal(stars, `${Math.min(count, 5)} out of 5 stars`);
      assert(i === 0 || count <= rows[i - 1].count, 'Most-cited patterns should appear first');
    }
  }
  const height = await page.locator('.suggestions-question').first().evaluate(el => el.getBoundingClientRect().height);
  assert(height >= (width < 500 ? 44 : 24), 'Date chips need a usable target');
}

async function assertEasy(page, subject, width) {
  const table = page.getByRole('table', { name: 'What to study first' });
  assert.deepEqual(await table.getByRole('columnheader').allTextContents(),
    ['Rank', 'Syllabus unit', 'Prep effort', 'First practice']);
  const rankRows = await table.locator('tbody tr').all();
  assert.equal(rankRows.length, subject.order.length);
  assert.equal(await rankRows[0].evaluate(el => getComputedStyle(el).display), width < 500 ? 'grid' : 'table-row');
  assert.equal(await rankRows[0].locator('.suggestions-priority-practice .suggestions-priority-field').isVisible(), width < 500);
  const steps = await page.locator('.suggestions-step').all();
  assert.equal(steps.length, subject.order.length);
  for (const [i, unit] of subject.order.entries()) {
    const row = rankRows[i];
    const step = steps[i];
    assert.equal(await row.locator('.suggestions-priority-rank').evaluate(el => Number(el.firstChild.lastChild.textContent)), i + 1);
    const link = row.getByRole('rowheader').getByRole('link');
    assert.match(await link.textContent(), new RegExp(`^Unit ${unit} · .+`));
    assert.equal(await link.getAttribute('href'), `#step-unit-${unit}`);
    const prep = row.locator('.suggestions-priority-prep');
    assert((await prep.evaluate(el => el.lastChild.textContent.trim())).length > 0);
    if (i === 0) assert.equal(await prep.evaluate(el => el.lastChild.textContent), 'Quick win');
    assert.match(await step.getByRole('heading', { level: 3 }).textContent(),
      new RegExp(`^${i === 0 ? 'Start here' : `Rank ${i + 1}`} · Unit ${unit}:`));
    await step.getByRole('heading', { name: 'What’s important', exact: true }).waitFor();
    await step.getByRole('heading', { name: 'What to read first', exact: true }).waitFor();
    assert(await step.locator('.suggestions-focus-list > li').count() >= 2);
    const notes = await step.locator('.suggestions-reading-links a').evaluateAll(links => links.map(a => a.getAttribute('href')));
    assert.equal(new Set(notes).size, 2);
    assert(notes.every(href => href.startsWith(`../../subjects/${subject.code}/units/unit-${unit}.html#`)));
    assert.equal(await step.locator('.suggestions-example time').count(), 2);
    assert.equal(await step.getByRole('link', { name: /^Practice questions/ }).getAttribute('href'), `important-questions.html#unit-${unit}`);
  }
  const first = steps[0];
  assert.equal(await first.locator('.suggestions-study-prep').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
    width < 500 ? 1 : 2);
  await first.getByRole('heading', { name: 'Try it', exact: true }).waitFor();
  await page.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
}

async function assertContrast(page, kind) {
  // Selected rendered pairs supplement the static token audit. Check the
  // active palette, including the 320px high contrast overrides.
  const pairs = kind === bank ? [
    ['.suggestions-panel-heading h2', '.suggestions-panel-heading'],
    ['.suggestions-question time', '.suggestions-question'],
    ['.suggestions-pattern .suggestions-stars', '.suggestions-bank-unit'],
    ['.suggestions-workbook-fact strong', '.suggestions-workbook-fact'],
    ['.suggestions-workbook-example', '.suggestions-workbook-fact']
  ] : [
    ['.suggestions-priority-table thead th', '.suggestions-priority-table thead th'],
    ['.suggestions-priority-table tbody a', '.suggestions-priority-table tbody tr'],
    ['.suggestions-priority-prep', '.suggestions-priority-table tbody tr'],
    ['.suggestions-reading-links a', '.suggestions-step'],
    ['.suggestions-reading-links span', '.suggestions-step'],
    ['.suggestions-step--first .suggestions-task p', '.suggestions-step--first .suggestions-task'],
    ['.suggestions-example time', '.suggestions-example']
  ];
  const ratios = await page.evaluate(pairs => {
    const luma = color => {
      const channels = color.match(/[\d.]+/g).map(Number);
      if (channels.length !== 3 || !color.startsWith('rgb(')) throw new Error(`Expected opaque rgb color, got ${color}`);
      const linear = channels.map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
      return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
    };
    return pairs.map(([ink, surface]) => {
      const a = luma(getComputedStyle(document.querySelector(ink)).color);
      const b = luma(getComputedStyle(document.querySelector(surface)).backgroundColor);
      return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    });
  }, pairs);
  ratios.forEach((ratio, i) => assert(ratio >= 4.5, `${pairs[i][0]}: ${ratio.toFixed(2)}:1 in ${page.url()}`));
}

async function checkHub(browser) {
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await phone.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base.href);
  if (await page.locator('#startBtn').isVisible()) await page.locator('#startBtn').click();
  await page.getByRole('link', { name: 'Go to Suggestions' }).click();
  await page.getByRole('heading', { name: 'Study Suggestions' }).waitFor();
  assert.equal(page.url(), hub);
  const cards = page.locator('.suggestions-grid > details');
  assert.equal(await cards.count(), subjects.length);
  assert.equal(await page.locator('.suggestions-grid > details[open]').count(), 0);
  await assertReflow(page);
  for (const [i, { name, slug }] of subjects.entries()) {
    const card = cards.nth(i);
    const summary = card.locator('summary');
    assert.equal(await summary.locator('.suggestions-subject-name').innerText(), name);
    assert.equal(await card.getByRole('link').count(), 0, 'closed panel links must not be exposed');
    await summary.press(i % 2 ? 'Space' : 'Enter');
    assert.equal(await page.locator('.suggestions-grid > details[open]').count(), 1);
    assert.equal(await card.getByRole('link').count(), 2);
    assert.equal(await card.getByRole('link', { name: /^Important Questions/ }).getAttribute('href'), `${slug}/${bank}.html`);
    assert.equal(await card.getByRole('link', { name: /^Easy Read/ }).getAttribute('href'), `${slug}/${easy}.html`);
  }
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), 'algorithms/important-questions.html');

  const themeBefore = await page.locator('html').getAttribute('data-theme');
  const expectedTheme = themeBefore === 'dark' ? 'light' : 'dark';
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), expectedTheme);
  await cards.nth(1).locator('summary').click();
  await cards.nth(1).getByRole('link', { name: /^Easy Read/ }).click();
  await page.getByRole('heading', { name: 'Python: Easy Read' }).waitFor();
  assert.equal(await page.locator('html').getAttribute('data-theme'), expectedTheme);

  await page.goto(base.href);
  await page.locator('#menuBtn').click();
  await page.locator('#sideMenu').getByRole('link', { name: 'Suggestions' }).click();
  assert.equal(page.url(), hub);
  assert.deepEqual(errors, []);
  await phone.close();
}

async function checkReadingLink(link, page, subject) {
  const destination = new URL(await link.getAttribute('href'), page.url());
  const notes = new URL(`subjects/${subject.code}/units/unit-${subject.order[0]}.html#${subject.read}`, base);
  assert.equal(destination.href, notes.href);
  await link.press('Enter');
  await page.locator(`[id="${subject.read}"]`).waitFor();
  assert.equal(page.url(), notes.href);
}

async function checkGuideMatrix(browser) {
  for (const width of [320, 390, 1280]) {
    const review = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', hasTouch: width < 500 });
    const page = await review.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(hub);
    await assertReflow(page);
    const columns = await page.locator('.suggestions-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(columns, width < 500 ? 1 : 2);
    for (const theme of ['light', 'dark']) {
      const prefs = { theme, fontScale: width === 320 ? 130 : 100, contrast: width === 320 ? 'high' : 'normal' };
      for (const subject of subjects) {
        const first = subject.order[0];
        for (const [kind, title] of [[bank, 'Important Questions'], [easy, 'Easy Read']]) {
          assert.equal((await page.goto(guideUrl(subject, kind))).status(), 200);
          await page.evaluate(value => StudyStorage.setPrefs(value), prefs);
          assert.equal(await page.locator('html').getAttribute('data-theme'), prefs.theme);
          assert.equal(await page.locator('html').getAttribute('data-contrast'), prefs.contrast);
          assert.equal(await page.locator('html').evaluate(el => el.style.fontSize), `${prefs.fontScale}%`);
          await page.getByRole('heading', { name: `${subject.name}: ${title}`, exact: true }).waitFor();
          await assertReflow(page);
          await (kind === bank ? assertBank(page, subject, width) : assertEasy(page, subject, width));
          await assertContrast(page, kind);
          await assertJump(page, kind === bank ? `unit-${first}` : `step-unit-${first}`);
          if (width !== 1280 || theme !== 'light') continue;
          if (kind === bank) {
            await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')),
              `../../subjects/${subject.code}/units/unit-${first}.html`);
            const unit = page.locator(`section[aria-labelledby="unit-${first}"]`);
            // A full question can be evidence for distinct subparts. If this
            // sample has two links, pick the intended prompt, not any match.
            const scope = subject.bankPattern ? unit.locator('.suggestions-pattern').filter({ hasText: subject.bankPattern }) : unit;
            const source = subject.bankSource ? scope.locator(`a[href$="q=${subject.bankSource}"]`) : scope.locator('.suggestions-question').last();
            if (subject.slug === 'algorithms') assert.equal(await unit.getByRole('link', { name: 'Jan 2024 · Q6' }).count(), 1);
            await followSource(source, page, subject.bankSource);
          } else {
            const start = page.locator('.suggestions-step--first');
            await checkReadingLink(start.locator('.suggestions-reading-links a').first(), page, subject);
            await page.goBack();
            const show = subject.slug === 'algorithms' ? 'CST209-P004-Q20' : undefined;
            await followSource(start.locator('.suggestions-example').first(), page, show);
            await page.goBack();
            if (subject.slug === 'algorithms') {
              assert.match(await start.locator('.suggestions-task').textContent(), /Find 7 in \[1, 3, 5, 7, 9\]/);
              await followSource(start.locator('.suggestions-example').last(), page, 'CST209-P003-Q32');
              await page.goBack();
            }
            await start.getByRole('link', { name: /^Practice questions/ }).press('Enter');
            assert.equal(page.url(), guideUrl(subject, bank) + `#unit-${first}`);
          }
        }
      }
    }
    assert.deepEqual(errors, [], `browser page errors at ${width}px`);
    await review.close();
  }
}

async function checkOffline(browser) {
  // The hub is precached; guides and notes are not fetched on its behalf.
  const offline = await browser.newContext();
  const page = await offline.newPage();
  await page.goto(hub);
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  const sourceRequests = [];
  offline.on('request', request => {
    if (/\/(?:_data|pyq|subjects)\/|\.pdf$/.test(new URL(request.url()).pathname)) sourceRequests.push(request.url());
  });
  for (const subject of subjects) {
    for (const kind of [bank, easy]) {
      assert.equal(await page.evaluate(async url => Boolean(await caches.match(url)), guideUrl(subject, kind)), false);
    }
    await page.goto(guideUrl(subject, bank));
    await page.getByRole('link', { name: 'Easy Read', exact: true }).click();
    assert.equal(page.url(), guideUrl(subject, easy));
  }
  assert.deepEqual(sourceRequests, []);
  await offline.setOffline(true);
  for (const subject of subjects) {
    const first = subject.order[0];
    await page.goto(hub, { waitUntil: 'domcontentloaded' });
    const card = page.locator('details').filter({ has: page.getByText(subject.name, { exact: true }) });
    await card.locator('summary').press('Space');
    await card.getByRole('link', { name: /^Easy Read/ }).press('Enter');
    assert.equal(page.url(), guideUrl(subject, easy));
    await page.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
    await page.locator(`a[href="${bank}.html#unit-${first}"]`).press('Enter');
    assert.equal(page.url(), guideUrl(subject, bank) + `#unit-${first}`);
    await page.getByRole('complementary', { name: `Unit ${first} quick reference` }).waitFor();
  }
  assert.deepEqual(sourceRequests, []);
  await offline.close();
}

async function checkWithoutJS(browser) {
  const withoutJS = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  const page = await withoutJS.newPage();
  for (const subject of [subjects[0], subjects.at(-1)]) {
    const first = subject.order[0];
    await page.goto(hub);
    await page.getByText(subject.name, { exact: true }).click();
    await page.getByRole('link', { name: /^Important Questions/ }).click();
    await assertJump(page, `unit-${first}`);
    await page.getByRole('complementary', { name: `Unit ${first} quick reference` }).waitFor();
    await page.getByRole('link', { name: 'Easy Read', exact: true }).click();
    await assertJump(page, `step-unit-${first}`);
    await checkReadingLink(page.locator('.suggestions-step--first .suggestions-reading-links a').first(), page, subject);
  }
  await withoutJS.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, args: ['--no-sandbox'] });
  try {
    await checkHub(browser);
    await checkGuideMatrix(browser);
    await checkOffline(browser);
    await checkWithoutJS(browser);
    console.log('PASS Suggestions: both Home entries, five pairs at 320/390/1280px, light/dark and 130% high contrast, focused jumps, five note sections and eleven archive jumps, no-JS navigation and warm offline for all pairs without source prefetch');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
