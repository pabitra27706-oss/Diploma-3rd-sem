/* Home/roadmap regression, on a disposable local origin. See tests/README.md. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');
const base = new URL(process.env.TEST_BASE || 'http://127.0.0.1:8000/Diploma-3rd-sem/');
assert(['127.0.0.1', 'localhost'].includes(base.hostname));
const url = path => new URL(path, base).href;
const hour = 3_600_000;

async function clockAndVisits(page) {
  // Noon in Kolkata is 06:30 UTC: an implementation based on UTC cannot pass.
  await page.clock.install({ time: new Date('2026-11-18T11:50:00+05:30') });
  await page.goto(url('index.html'));
  await page.locator('#startBtn').click();
  await page.locator('#focusCard').waitFor();
  const greeting = page.locator('#greetingTitle');
  await page.clock.pauseAt(new Date('2026-11-18T11:59:59+05:30'));
  assert.equal(await greeting.textContent(), 'Good Morning');
  for (const [elapsed, expected] of [[1500, 'Good Afternoon'], [5 * hour, 'Good Evening'],
    [4 * hour, 'Good Night'], [3 * hour, 'Good Night'], [5 * hour, 'Good Morning']]) {
    await page.clock.fastForward(elapsed);
    assert.equal(await greeting.textContent(), expected);
    if (elapsed === 3 * hour) assert.equal(await page.locator('#dateDisplay').textContent(), 'Thu, Nov 19');
  }
  assert.equal(await page.locator('#dateDisplay').textContent(), 'Thu, Nov 19');

  // A suspended page can miss every timer. Restoration must use the current
  // clock, not replay the timer that was pending before suspension.
  await page.clock.setSystemTime(new Date('2026-12-05T18:00:00+05:30'));
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  assert.equal(await greeting.textContent(), 'Good Evening');
  await page.clock.setSystemTime(new Date('2026-12-06T03:00:00+05:30'));
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  assert.equal(await greeting.textContent(), 'Good Night');
  await page.reload();
  assert.match(await page.locator('#focusDay').textContent(), /Day 1 of 10/);
  assert.equal(await page.locator('#streakValue').textContent(), '0');
  for (const key of ['practice-progress', 'diploma-3rd-sem-roadmap-start', 'diploma-3rd-sem-streak']) {
    assert.equal(await page.evaluate(k => StudyStorage.get(k), key), null, `visiting wrote ${key}`);
  }
}

async function manualChecklist(context, home) {
  await home.goto(url('index.html'));
  await home.locator('#startBtn').click();
  await home.locator('#focusCard').waitFor();
  // An older installation: keep the explicit Day 3 mark, not the elapsed
  // days or login streak. Only the ten known, boolean checkmarks count.
  await home.evaluate(() => {
    StudyStorage.set('diploma-3rd-sem-roadmap-start', '2020-01-01T00:00:00Z');
    StudyStorage.set('diploma-3rd-sem-streak', { count: 10, lastDate: StudyStore.day() });
    localStorage.setItem('practice-progress', JSON.stringify({ 'day-3': true, 'day-2': 'false', 'day-11': true }));
  });
  await home.reload();
  assert.match(await home.locator('#focusDay').textContent(), /Day 1 of 10/);
  assert.equal(await home.locator('#streakValue').textContent(), '0');
  assert.equal(await home.locator('#focusProgress').textContent(), '1 of 10 done');
  await home.locator('#focusCard').press('Enter');
  const mark = (page, day) => page.getByRole('button', { name: `Mark day ${day} done`, exact: true });
  await mark(home, 1).waitFor();
  assert.equal(await home.locator('#days-done').textContent(), '1');
  assert.equal(await mark(home, 3).getAttribute('aria-pressed'), 'true');
  const topics = home.getByRole('button', { name: 'Day 1 — Foundations' });
  await topics.click();
  assert.equal(await topics.getAttribute('aria-expanded'), 'true');
  assert.equal(await home.locator('#days-done').textContent(), '1', 'opening topics must not check the day');
  await mark(home, 1).press('Space');
  assert.equal(await mark(home, 1).getAttribute('aria-pressed'), 'true');
  assert(await mark(home, 1).evaluate(el => el === document.activeElement));
  assert.equal(await topics.getAttribute('aria-expanded'), 'true');
  assert.equal(await home.locator('#progress-pct').textContent(), '20%');
  await home.goBack();
  assert.match(await home.locator('#focusDay').textContent(), /Day 2 of 10/);

  const roadmap = await context.newPage();
  await roadmap.goto(url('roadmap/index.html'));
  for (const day of [2, 4, 5, 6, 7, 8, 9, 10]) await mark(roadmap, day).click();
  assert.equal(await roadmap.locator('#days-done').textContent(), '10');
  await home.waitForFunction(() => document.querySelector('#focusDay').textContent.includes('Complete!'));
  assert.equal(await home.locator('.subject-progress-value').first().textContent(), '100%');
  await mark(roadmap, 3).click();
  await home.waitForFunction(() => document.querySelector('#focusDay').textContent.includes('Day 3 of 10'));
  await roadmap.reload();
  await mark(roadmap, 3).waitFor();
  assert.equal(await roadmap.locator('#days-left').textContent(), '1');
  roadmap.once('dialog', dialog => dialog.accept());
  await roadmap.locator('#btn-reset').click();
  assert.equal(await roadmap.locator('#progress-pct').textContent(), '0%');
  await home.waitForFunction(() => document.querySelector('#focusDay').textContent.includes('Day 1 of 10'));

  await home.goto(url('cards.html'));
  await home.locator('#reveal-card').click();
  await home.locator('[data-rating="good"]').click();
  await home.goto(url('index.html'));
  assert.equal(await home.locator('#streakValue').textContent(), '1', 'a real review should count');
  assert.match(await home.locator('#focusDay').textContent(), /Day 1 of 10/, 'a review is not a theory checkmark');
}

async function installedShell(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url('index.html'));
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 30000 });
  await context.setOffline(true);
  await page.reload();
  const images = await page.evaluate(async () => {
    const manifestUrl = document.querySelector('[rel="manifest"]').href;
    const manifest = await (await fetch(manifestUrl)).json();
    const sources = [document.querySelector('.welcome-icon').src,
      document.querySelector('[rel="icon"]').href, document.querySelector('[rel="apple-touch-icon"]').href,
      ...manifest.icons.filter(icon => ['192x192', '512x512'].includes(icon.sizes))
        .map(icon => new URL(icon.src, manifestUrl).href)];
    return Promise.all(sources.map(async src => {
      const image = new Image(); image.src = src; await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }));
  });
  assert.deepEqual(images, [128, 32, 180, 192, 512, 512].map(size => [size, size]));
  await page.locator('#startBtn').click();
  await page.locator('#focusCard').click();
  await page.getByRole('button', { name: 'Mark day 1 done', exact: true }).click();
  await page.goto(url('index.html'));
  assert.match(await page.locator('#focusDay').textContent(), /Day 2 of 10/);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, args: ['--no-sandbox'] });
  try {
    const options = { timezoneId: 'Asia/Kolkata', serviceWorkers: 'block', viewport: { width: 390, height: 844 } };
    const clockPage = await browser.newPage(options);
    await clockAndVisits(clockPage);
    await clockPage.close();
    console.log('PASS local greeting boundaries, midnight, resume, and no progress from visits');
    const context = await browser.newContext(options);
    const errors = [];
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    await manualChecklist(context, await context.newPage());
    assert.deepEqual(errors, []);
    console.log('PASS legacy marks, keyboard check/uncheck, Back, cross-tab completion/reset, and activity-based streak');
    await context.close();
    await installedShell(browser);
    console.log('PASS offline checklist and decoded home, tab, touch, install and maskable icons');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
