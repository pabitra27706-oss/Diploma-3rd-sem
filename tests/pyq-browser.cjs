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
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.TEST_BASE || 'http://127.0.0.1:8001/';
    await page.goto(`${base}pyq/viewer.html?subject=CST201&paper=CST201-P001`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => !document.querySelector('#paperWrapper').classList.contains('hidden'));

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
    await page.goto(`${base}pyq/answers.html?paper=CST201-P001-2021-03&q=CST201-P001-Q1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.question-share .unit-topic-link');
    const topic = await page.evaluate(() => questions[currentIndex].topic);
    const unitLink = page.locator('.question-share .unit-topic-link');
    assert.equal(new URL(await unitLink.getAttribute('href'), page.url()).searchParams.get('topic'), topic);
    assert.equal(await page.locator('.question-share .copy-question-link').count(), 0);
    await unitLink.click();
    await page.waitForFunction(() => document.querySelector('.pyq-topic-target'));
    assert.equal(new URL(page.url()).searchParams.get('topic'), topic);
    assert.deepEqual(errors, [], `browser page errors: ${errors.join('; ')}`);
    console.log(`PASS PYQ viewer at ${geometry.viewport}px: paper ${geometry.paperWidth}px, ${geometry.toolbarIcons} toolbar icons, one print control; answer-to-topic link verified`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
