/* PYQ viewer regression: mobile paper width, toolbar icon cluster, and exactly one print control. */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
    args: ['--no-sandbox']
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.TEST_BASE || 'http://127.0.0.1:8001/';
    console.log('SMOKE: opening the paper viewer');
    await page.goto(`${base}pyq/viewer.html?subject=CST201&paper=P001`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => {
      const wrapper = document.querySelector('#paperWrapper');
      const error = document.querySelector('#errorState');
      return (wrapper && !wrapper.classList.contains('hidden')) || (error && !error.classList.contains('hidden'));
    });
    assert.equal(await page.locator('#errorState:not(.hidden)').count(), 0,
      `paper viewer error: ${await page.locator('#errorMessage').textContent()}`);

    const geometry = await page.evaluate(() => {
      const paper = document.querySelector('#paper');
      const toolbar = document.querySelector('.toolbar');
      return {
        viewport: document.documentElement.clientWidth,
        paperWidth: paper.getBoundingClientRect().width,
        paperLeft: paper.getBoundingClientRect().left,
        paperRight: paper.getBoundingClientRect().right,
        toolbarIcons: toolbar.querySelectorAll('svg').length,
        printControls: document.querySelectorAll('#printBtn, #printPaperBtn, [data-print-control]').length
      };
    });
    assert(geometry.paperWidth > 0, 'rendered paper must have nonzero width');
    assert(geometry.paperLeft >= -1 && geometry.paperRight <= geometry.viewport + 1,
      `paper overflows viewport: left=${geometry.paperLeft}, right=${geometry.paperRight}, viewport=${geometry.viewport}`);
    assert(geometry.toolbarIcons >= 3, `expected toolbar icon cluster, got ${geometry.toolbarIcons} SVG icons`);
    assert.equal(geometry.printControls, 1, `expected one print control, got ${geometry.printControls}`);
    assert.deepEqual(errors, [], `browser page errors: ${errors.join('; ')}`);

    // An answer card's former copy-link action now opens its exact unit with
    // topic context, and the destination scrolls to/highlights related content.
    console.log('SMOKE: checking answer-card topic link and authored anchor');
    await page.goto(`${base}pyq/answers.html?paper=CST203-P006-2026-01&q=CST203-P006-Q11`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.question-share .unit-topic-link');
    const topic = await page.evaluate(() => questions[currentIndex].topic);
    const unitLink = page.locator('.question-share .unit-topic-link');
    const rawHref = await unitLink.getAttribute('href');
    assert.equal(new URL(rawHref, page.url()).searchParams.get('topic'), topic);
    assert.equal(new URL(rawHref, page.url()).hash, '#modules');
    assert.equal(await page.locator('.question-share .copy-question-link').count(), 0);
    await unitLink.click();
    await page.waitForFunction(() => document.querySelector('.pyq-topic-target'));
    assert.equal(new URL(page.url()).searchParams.get('topic'), topic);
    assert.match(new URL(page.url()).pathname, /subjects\/CST203\/units\/unit-3\.html$/);
    // The landing is the reviewed Phase 13.6 map anchor for "Modules" (topic-map-CST203.json).
    // The link's own #modules fragment is only a synthetic fallback and is replaced on arrival.
    assert.equal(topic, 'Modules');
    assert.equal(new URL(page.url()).hash, '#creating-and-importing-modules', 'the landing must be the reviewed map anchor');
    assert.equal(await page.evaluate(() => Boolean(document.getElementById('creating-and-importing-modules'))), true, 'the reviewed destination must exist on the page');
    assert.deepEqual(errors, [], `browser page errors: ${errors.join('; ')}`);
    console.log(`PASS PYQ viewer at ${geometry.viewport}px: paper ${geometry.paperWidth}px, ${geometry.toolbarIcons} toolbar icons, one print control; answer-to-topic link verified`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  const message = String(error && error.stack || error).replace(/[\r\n]+/g, ' ');
  console.error(error);
  console.log(`::error title=PYQ browser smoke::${message}`);
  process.exitCode = 1;
});
