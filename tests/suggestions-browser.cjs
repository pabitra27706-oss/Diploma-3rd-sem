/* Phase 11 smoke: base-path navigation, distinct guide layouts, evidence and offline policy. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const base = new URL(process.env.TEST_BASE || 'http://127.0.0.1:8010/Diploma-3rd-sem/');
const subjects = [
  ['C', 'c', 2], ['Python', 'python', 2], ['Data Structures', 'data-structures', 2],
  ['Computer System Organization', 'cso', 3], ['Algorithms', 'algorithms', 3]
];
const hub = new URL('suggestions/index.html', base).href;
const guideUrl = (slug, kind) => new URL(`suggestions/${slug}/${kind}.html`, base).href;

async function assertReflow(page) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    `horizontal overflow at ${page.viewportSize().width}px: ${page.url()}`);
}

async function followSource(link, page, viaKeyboard = false) {
  const dest = new URL(await link.getAttribute('href'), page.url());
  assert.equal(dest.pathname, new URL('pyq/answers.html', base).pathname);
  const id = dest.searchParams.get('q');
  if (viaKeyboard) await link.press('Enter');
  else await link.click();
  await page.locator(`.question-card[data-question-id="${id}"][data-deeplink="active"]`).waitFor();
  assert.equal(page.url(), dest.href);
}

async function assertBank(page, width) {
  const unit = page.locator('.suggestions-bank-unit').first();
  assert.equal(await unit.locator('.suggestions-bank-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
    width === 320 ? 1 : 2);
  for (const group of await page.locator('.suggestions-bank-unit').all()) {
    const rows = await group.locator('.suggestions-pattern').evaluateAll(elements => elements.map(row => ({
      count: Number(row.dataset.sessionCount),
      stars: row.querySelector('.suggestions-stars').getAttribute('aria-label'),
      dates: Array.from(row.querySelectorAll('a.suggestions-question time'), el => el.dateTime)
    })));
    assert(rows.length >= 4);
    for (const [i, { count, stars, dates }] of rows.entries()) {
      assert.equal(count, dates.length);
      assert.equal(count, new Set(dates).size);
      assert.equal(stars, `${Math.min(count, 5)} out of 5 stars`);
      assert(i === 0 || count <= rows[i - 1].count, 'Most-cited patterns should appear first');
    }
  }
}

async function assertEasy(page, slug, firstUnit, width) {
  const first = page.locator('.suggestions-step').first();
  if (slug === 'algorithms') {
    const table = page.getByRole('table', { name: 'What to study first' });
    assert.deepEqual(await table.getByRole('columnheader').allTextContents(),
      ['Rank', 'Syllabus unit', 'Prep effort', 'First practice']);
    assert.deepEqual(await table.getByRole('rowheader').allTextContents(),
      ['Unit 3 · Searching', 'Unit 2 · Sorting', 'Unit 1 · Fundamentals', 'Unit 4 · Graphs']);
    assert.deepEqual(await table.locator('.suggestions-priority-prep').evaluateAll(cells =>
      cells.map(cell => cell.lastChild.textContent)), ['Quick win', 'Trace practice', 'Short theory', 'Longer practice']);
    assert.equal(await first.getByRole('heading').textContent(), 'Start here · Unit 3: Searching');
    assert.match(await first.locator('.suggestions-task').textContent(), /Find 7 in \[1, 3, 5, 7, 9\]/);
  } else {
    const route = page.getByRole('navigation', { name: 'Suggested revision order' });
    assert.equal(await route.locator('a').first().getAttribute('href'), `#step-unit-${firstUnit}`);
    assert((await first.locator('.suggestions-unit').textContent()).startsWith(`Start here · Unit ${firstUnit}`));
    assert.equal(await first.locator('.suggestions-effort').innerText(), 'Quick win');
  }
  assert.equal(await first.locator('.suggestions-step-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
    width === 320 ? 1 : 2);
  assert.equal(await first.locator('.suggestions-example time').count(), 2);
  await first.locator('.suggestions-task').waitFor();
  await page.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
}

async function assertPilotJump(page, target) {
  await page.locator(`a[href="#${target}"]`).press('Enter');
  assert.equal(new URL(page.url()).hash, `#${target}`);
  assert(await page.locator(`#${target}`).evaluate(el => document.activeElement === el &&
    el.getBoundingClientRect().top >= document.querySelector('.suggestions-header').getBoundingClientRect().bottom),
    `Jump must focus ${target} without putting it behind the header`);
}

async function assertPilotPresentation(page, bank, width) {
  await assertReflow(page);
  assert(await page.locator('main').evaluate(el => el.scrollWidth <= el.clientWidth), 'Pilot content must not be clipped');
  if (bank) {
    const jump = page.getByRole('navigation', { name: 'Jump to a syllabus unit' });
    assert.deepEqual(await jump.getByRole('link').allTextContents(),
      ['Unit 1 Fundamentals', 'Unit 2 Sorting', 'Unit 3 Searching', 'Unit 4 Graphs']);
    for (const unit of await page.locator('.suggestions-bank-unit').all()) {
      const props = await unit.evaluate(el => {
        const prompts = el.querySelector('.suggestions-workbook-prompts').getBoundingClientRect();
        const reference = el.querySelector('.suggestions-workbook-reference').getBoundingClientRect();
        return { across: reference.left >= prompts.right - 1 && Math.abs(reference.top - prompts.top) < 1,
          stacked: reference.top >= prompts.bottom - 1, facts: el.querySelectorAll('.suggestions-workbook-fact').length };
      });
      assert(width < 500 ? props.stacked : props.across, 'Quick reference must stack on narrow screens only');
      assert(props.facts >= 3);
    }
    const height = await page.locator('.suggestions-question').first().evaluate(el => el.getBoundingClientRect().height);
    assert(height >= (width < 500 ? 44 : 24), 'Date chips need a usable target');
  } else {
    const table = page.getByRole('table', { name: 'What to study first' });
    assert.equal(await table.getByRole('columnheader').count(), 4, 'Keep table semantics at phone width');
    assert.equal(await table.locator('tbody tr').first().evaluate(el => getComputedStyle(el).display),
      width < 500 ? 'grid' : 'table-row');
    assert.equal(await table.locator('.suggestions-priority-practice .suggestions-priority-field').first().isVisible(), width < 500);
  }
  // Check the rendered palette of the new surfaces, including the theme and
  // high-contrast overrides, as well as the repository-wide token audit in CI.
  const pairs = bank ? [
    ['.suggestions-panel-heading h2', '.suggestions-panel-heading'],
    ['.suggestions-question time', '.suggestions-question'],
    ['.suggestions-pattern .suggestions-stars', '.suggestions-bank-unit'],
    ['.suggestions-workbook-fact strong', '.suggestions-workbook-fact'],
    ['.suggestions-workbook-example', '.suggestions-workbook-fact']
  ] : [
    ['.suggestions-priority-table thead th', '.suggestions-priority-table thead th'],
    ['.suggestions-priority-table tbody a', '.suggestions-priority-table tbody tr'],
    ['.suggestions-priority-prep', '.suggestions-priority-table tbody tr'],
    ['.suggestions-step--first .suggestions-task p:last-child', '.suggestions-step--first .suggestions-task'],
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

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
    args: ['--no-sandbox']
  });
  try {
    const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce' });
    const page = await phone.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base.href);
    if (await page.locator('#startBtn').isVisible()) await page.locator('#startBtn').click();
    await page.getByRole('link', { name: 'Go to Suggestions' }).click();
    await page.getByRole('heading', { name: 'Study Suggestions' }).waitFor();
    assert.equal(page.url(), hub);
    assert.equal(await page.locator('.suggestions-grid > details').count(), subjects.length);
    assert.equal(await page.locator('.suggestions-grid > details[open]').count(), 0);
    await assertReflow(page);

    const cards = page.locator('.suggestions-grid > details');
    for (const [i, [subject, slug]] of subjects.entries()) {
      const card = cards.nth(i);
      const summary = card.locator('summary');
      assert.equal(await summary.locator('.suggestions-subject-name').innerText(), subject);
      assert.equal(await card.getByRole('link').count(), 0, 'closed panel links must not be exposed');
      await summary.press(i % 2 ? 'Space' : 'Enter');
      assert.equal(await page.locator('.suggestions-grid > details[open]').count(), 1);
      assert.equal(await card.getByRole('link').count(), 2);
      const important = card.getByRole('link', { name: /^Important Questions/ });
      const easy = card.getByRole('link', { name: /^Easy Read/ });
      assert.equal(await important.getAttribute('href'), `${slug}/important-questions.html`);
      assert.equal(await easy.getAttribute('href'), `${slug}/easy-read.html`);
    }
    // Tab reaches the links of an open disclosure, not hidden controls.
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
    await page.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
    const order = page.getByRole('navigation', { name: 'Suggested revision order' });
    await order.locator('a').first().press('Enter');
    assert.equal(new URL(page.url()).hash, '#step-unit-2');
    await followSource(page.locator('.suggestions-step--first .suggestions-example').first(), page, true);
    await page.goBack();
    await page.locator('a[href="important-questions.html#unit-4"]').press('Enter');
    assert.equal(new URL(page.url()).hash, '#unit-4');
    await followSource(page.locator('section[aria-labelledby="unit-4"] .suggestions-question').first(), page, true);

    // Both Home entries are reachable. The same test checks all guides at
    // phone width and desktop width under the real GitHub Pages subpath.
    await page.goto(base.href);
    await page.locator('#menuBtn').click();
    await page.locator('#sideMenu').getByRole('link', { name: 'Suggestions' }).click();
    assert.equal(page.url(), hub);
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 880 });
      await page.goto(hub);
      await assertReflow(page);
      const columns = await page.locator('.suggestions-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
      assert.equal(columns, width === 320 ? 1 : 2);
      for (const [name, slug, firstUnit] of subjects) {
        for (const [kind, title] of [['important-questions', 'Important Questions'], ['easy-read', 'Easy Read']]) {
          const reply = await page.goto(guideUrl(slug, kind));
          assert.equal(reply.status(), 200);
          await page.getByRole('heading', { name: `${name}: ${title}`, exact: true }).waitFor();
          await assertReflow(page);
          if (kind === 'important-questions') await assertBank(page, width);
          else await assertEasy(page, slug, firstUnit, width);
          if (width === 320) {
            await page.evaluate(() => StudyStorage.setPrefs({ fontScale: 130, contrast: 'high' }));
            await assertReflow(page);
            await page.evaluate(() => StudyStorage.setPrefs({ fontScale: 100, contrast: 'normal' }));
          } else if (kind === 'important-questions') {
            // Independent browser navigation into each subject's own archive.
            await followSource(page.locator('.suggestions-question').last(), page);
          }
        }
      }
    }
    assert.deepEqual(errors, [], `browser page errors: ${errors.join('; ')}`);
    await phone.close();

    // Pilot only: exercise both real palettes and the scaled high contrast
    // path at a narrow width, then follow original Searching questions.
    for (const width of [320, 390, 1280]) {
      const review = await browser.newContext({ viewport: { width, height: 900 },
        reducedMotion: 'reduce', hasTouch: width < 500 });
      const pilotPage = await review.newPage();
      const pilotErrors = [];
      pilotPage.on('pageerror', error => pilotErrors.push(error.message));
      for (const theme of ['light', 'dark']) {
        for (const kind of ['important-questions', 'easy-read']) {
          const bank = kind === 'important-questions';
          const reply = await pilotPage.goto(guideUrl('algorithms', kind));
          assert.equal(reply.status(), 200);
          const prefs = { theme, fontScale: width === 320 ? 130 : 100, contrast: width === 320 ? 'high' : 'normal' };
          await pilotPage.evaluate(value => StudyStorage.setPrefs(value), prefs);
          assert.equal(await pilotPage.locator('html').getAttribute('data-theme'), prefs.theme);
          assert.equal(await pilotPage.locator('html').getAttribute('data-contrast'), prefs.contrast);
          assert.equal(await pilotPage.locator('html').evaluate(el => el.style.fontSize), `${prefs.fontScale}%`);
          await assertPilotPresentation(pilotPage, bank, width);
          await assertPilotJump(pilotPage, bank ? 'unit-3' : 'step-unit-3');
          if (width === 1280 && theme === 'light') {
            if (bank) {
              await pilotPage.keyboard.press('Tab');
              assert.equal(await pilotPage.evaluate(() => document.activeElement.getAttribute('href')),
                '../../subjects/CST209/units/unit-3.html');
              const firstPrompt = pilotPage.locator('#unit-3-pattern-1').locator('..');
              assert.equal(await firstPrompt.getByRole('link', { name: 'Jan 2024 · Q6' }).count(), 1);
              await followSource(firstPrompt.getByRole('link', { name: /^Jan 2026/ }), pilotPage, true);
              assert.equal(new URL(pilotPage.url()).searchParams.get('q'), 'CST209-P006-Q20');
            } else {
              const sources = pilotPage.locator('.suggestions-step--first .suggestions-example');
              await followSource(sources.first(), pilotPage, true);
              assert.equal(new URL(pilotPage.url()).searchParams.get('q'), 'CST209-P004-Q20');
              await pilotPage.goBack();
              await followSource(sources.last(), pilotPage, true);
              assert.equal(new URL(pilotPage.url()).searchParams.get('q'), 'CST209-P003-Q32');
              await pilotPage.goBack();
              await pilotPage.locator('.suggestions-step--first a[href="important-questions.html#unit-3"]').press('Enter');
              assert.equal(pilotPage.url(), guideUrl('algorithms', 'important-questions') + '#unit-3');
            }
          }
        }
      }
      assert.deepEqual(pilotErrors, []);
      await review.close();
    }

    // In a fresh cache, the worker keeps the hub and only visits to the guides.
    // Paper data and notes are not downloaded by reading a guide.
    const offline = await browser.newContext();
    const saved = await offline.newPage();
    await saved.goto(hub);
    await saved.waitForFunction(() => navigator.serviceWorker.controller);
    const warmPairs = [['Python', 'python'], ['Algorithms', 'algorithms']];
    const sourceRequests = [];
    offline.on('request', request => {
      if (/\/(?:_data|pyq|subjects)\/|\.pdf$/.test(new URL(request.url()).pathname)) sourceRequests.push(request.url());
    });
    for (const [, slug] of warmPairs) {
      const bank = guideUrl(slug, 'important-questions');
      const easy = guideUrl(slug, 'easy-read');
      for (const url of [bank, easy]) {
        assert.equal(await saved.evaluate(async url => Boolean(await caches.match(url)), url), false);
      }
      await saved.goto(bank);
      await saved.getByRole('link', { name: 'Easy Read', exact: true }).click();
      assert.equal(saved.url(), easy);
    }
    assert.deepEqual(sourceRequests, []);
    await offline.setOffline(true);
    for (const [name, slug] of warmPairs) {
      await saved.goto(hub, { waitUntil: 'domcontentloaded' });
      const card = saved.locator('details').filter({ has: saved.getByText(name, { exact: true }) });
      await card.locator('summary').press('Space');
      await card.getByRole('link', { name: /^Important Questions/ }).press('Enter');
      assert.equal(saved.url(), guideUrl(slug, 'important-questions'));
      await saved.locator('.suggestions-stars[role="img"]').first().waitFor();
      await saved.getByRole('link', { name: 'Easy Read', exact: true }).click();
      assert.equal(saved.url(), guideUrl(slug, 'easy-read'));
      await saved.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
    }
    await saved.locator('a[href="important-questions.html#unit-3"]').press('Enter');
    assert.equal(saved.url(), guideUrl('algorithms', 'important-questions') + '#unit-3');
    await saved.getByRole('complementary', { name: 'Unit 3 quick reference' }).waitFor();
    assert.equal(await saved.evaluate(async url => Boolean(await caches.match(url)), guideUrl('c', 'easy-read')), false);
    assert.deepEqual(sourceRequests, []);
    await offline.close();

    const withoutJS = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await withoutJS.newPage();
    await staticPage.goto(hub);
    await staticPage.getByText('Algorithms', { exact: true }).click();
    await staticPage.getByRole('link', { name: /^Important Questions/ }).click();
    await staticPage.getByRole('heading', { name: 'Algorithms: Important Questions' }).waitFor();
    await staticPage.locator('.suggestions-stars[role="img"]').first().waitFor();
    await assertPilotJump(staticPage, 'unit-3');
    await staticPage.getByRole('complementary', { name: 'Unit 3 quick reference' }).waitFor();
    await staticPage.getByRole('link', { name: 'Easy Read', exact: true }).click();
    await assertPilotJump(staticPage, 'step-unit-3');
    await staticPage.locator('.suggestions-step--first .suggestions-task').waitFor();
    await withoutJS.close();
    console.log('PASS Suggestions: Home and ten guides; Algorithms workbook and priority table at 320/390/1280px, both themes, 130% high contrast, focused jumps, ten archive deep links, keyboard/script-free navigation and warm offline revisits without source prefetch');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
