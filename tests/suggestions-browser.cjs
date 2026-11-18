/* Phase 11 smoke: base-path navigation, native disclosures and archived sources. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

const base = new URL(process.env.TEST_BASE || 'http://127.0.0.1:8010/Diploma-3rd-sem/');
const subjects = [
  ['C', 'c'], ['Python', 'python'], ['Data Structures', 'data-structures'],
  ['Computer System Organization', 'cso'], ['Algorithms', 'algorithms']
];
const hub = new URL('suggestions/index.html', base).href;

async function assertReflow(page) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    `horizontal overflow at ${page.viewportSize().width}px: ${page.url()}`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
    args: ['--no-sandbox']
  });
  try {
    const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
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
    await page.locator('a[href="important-questions.html#unit-4"]').click();
    assert.equal(new URL(page.url()).hash, '#unit-4');
    const question = page.locator('section[aria-labelledby="unit-4"] .suggestions-question').first();
    const sourceLink = new URL(await question.getAttribute('href'), page.url());
    assert.equal(sourceLink.pathname, new URL('pyq/answers.html', base).pathname);
    await question.click();
    const id = sourceLink.searchParams.get('q');
    await page.locator(`.question-card[data-question-id="${id}"]`).waitFor();
    assert.equal(page.url(), sourceLink.href);

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
      for (const [name, slug] of subjects) {
        for (const [path, title] of [['important-questions', 'Important Questions'], ['easy-read', 'Easy Read']]) {
          const reply = await page.goto(new URL(`suggestions/${slug}/${path}.html`, base).href);
          assert.equal(reply.status(), 200);
          await page.getByRole('heading', { name: `${name}: ${title}`, exact: true }).waitFor();
          await assertReflow(page);
        }
      }
    }

    // Guides remain static. The precached dashboard and a guide visited
    // while controlled by the worker can both be revisited offline.
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await phone.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Algorithms: Easy Read' }).waitFor();
    await page.goto(hub, { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Study Suggestions' }).waitFor();
    assert.deepEqual(errors, [], `browser page errors: ${errors.join('; ')}`);
    await phone.close();

    const withoutJS = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await withoutJS.newPage();
    await staticPage.goto(hub);
    await staticPage.getByText('Algorithms', { exact: true }).click();
    await staticPage.getByRole('link', { name: /^Important Questions/ }).click();
    await staticPage.getByRole('heading', { name: 'Algorithms: Important Questions' }).waitFor();
    await withoutJS.close();
    console.log('PASS Suggestions: both Home entries, keyboard and script-free disclosures, ten guides at phone/desktop widths, source deep link and warm offline navigation');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
