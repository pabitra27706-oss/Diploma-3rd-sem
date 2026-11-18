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

async function assertEasy(page, firstUnit, width) {
  const route = page.getByRole('navigation', { name: 'Suggested revision order' });
  assert.equal(await route.locator('a').first().getAttribute('href'), `#step-unit-${firstUnit}`);
  const first = page.locator('.suggestions-step').first();
  assert((await first.locator('.suggestions-unit').textContent()).startsWith(`Start here · Unit ${firstUnit}`));
  assert.equal(await first.locator('.suggestions-effort').innerText(), 'Quick win');
  assert.equal(await first.locator('.suggestions-step-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
    width === 320 ? 1 : 2);
  assert.equal(await first.locator('.suggestions-example time').count(), 2);
  await first.locator('.suggestions-task').waitFor();
  await page.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
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
          else await assertEasy(page, firstUnit, width);
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

    // In a fresh cache, the worker keeps the hub and only visits to the guides.
    // Paper data and notes are not downloaded by reading a guide.
    const offline = await browser.newContext();
    const saved = await offline.newPage();
    await saved.goto(hub);
    await saved.waitForFunction(() => navigator.serviceWorker.controller);
    const warmBank = guideUrl('python', 'important-questions');
    const warmEasy = guideUrl('python', 'easy-read');
    assert.equal(await saved.evaluate(async url => Boolean(await caches.match(url)), warmBank), false);
    const sourceRequests = [];
    offline.on('request', request => {
      if (/\/(?:_data|pyq|subjects)\/|\.pdf$/.test(new URL(request.url()).pathname)) sourceRequests.push(request.url());
    });
    await saved.goto(warmBank);
    await saved.getByRole('link', { name: 'Easy Read', exact: true }).click();
    assert.equal(saved.url(), warmEasy);
    assert.deepEqual(sourceRequests, []);
    await offline.setOffline(true);
    await saved.goto(hub, { waitUntil: 'domcontentloaded' });
    const python = saved.locator('details').filter({ has: saved.getByText('Python', { exact: true }) });
    await python.locator('summary').press('Space');
    await python.getByRole('link', { name: /^Important Questions/ }).press('Enter');
    assert.equal(saved.url(), warmBank);
    await saved.locator('.suggestions-stars[role="img"]').first().waitFor();
    await saved.getByRole('link', { name: 'Easy Read', exact: true }).click();
    assert.equal(saved.url(), warmEasy);
    await saved.getByRole('heading', { name: 'Last-minute checklist' }).waitFor();
    assert.equal(await saved.evaluate(async url => Boolean(await caches.match(url)), guideUrl('c', 'easy-read')), false);
    await offline.close();

    const withoutJS = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await withoutJS.newPage();
    await staticPage.goto(hub);
    await staticPage.getByText('Algorithms', { exact: true }).click();
    await staticPage.getByRole('link', { name: /^Important Questions/ }).click();
    await staticPage.getByRole('heading', { name: 'Algorithms: Important Questions' }).waitFor();
    await staticPage.locator('.suggestions-stars[role="img"]').first().waitFor();
    await staticPage.getByRole('link', { name: 'Easy Read', exact: true }).click();
    await staticPage.locator('.suggestions-step--first .suggestions-task').waitFor();
    await withoutJS.close();
    console.log('PASS Suggestions: both Home entries, keyboard and script-free disclosures, ten guides at phone/desktop widths, priority and date evidence, seven archive deep links, warm offline navigation without source prefetch');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
