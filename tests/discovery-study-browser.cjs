/* Focused browser regression for Phase 4 Discovery and Phase 5 Study System (requires playwright-core + Chromium). */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
    args: ['--no-sandbox']
  });
  try {
    const c = await browser.newContext({ serviceWorkers: 'block' });
    const p = await c.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    const base = process.env.TEST_BASE || 'http://127.0.0.1:8001/after/Diploma-3rd-sem/';

    // 1. Search (subject-filtered, multi-type dijkstra, informational page, XSS safety, zero raw CST20x)
    await p.goto(base + 'search.html?q=arrays&subject=CST201');
    await p.waitForFunction(() => document.querySelector('#search-status').textContent.includes('matches;'));
    assert((await p.locator('#search-results a').count()) > 0);
    assert(!/\b(?:CST\d{3}|SI201)\b/.test(await p.locator('#search-results').textContent()));

    await p.goto(base + 'search.html?q=dijkstra');
    await p.waitForFunction(() => document.querySelector('#search-status').textContent.includes('matches;'));
    assert((await p.locator('#search-results section[data-group="pyq"] a').count()) > 0);
    assert((await p.locator('#search-results section[data-group="quiz"] a').count()) > 0);
    assert((await p.locator('#search-results section[data-group="unit"] a[href*="#"]').count()) > 0);

    await p.goto(base + 'search.html?q=internship&type=page');
    await p.waitForFunction(() => document.querySelector('#search-status').textContent.includes('matches;'));
    assert((await p.locator('#search-results section[data-group="page"] a').count()) > 0);

    await p.locator('#query').fill('<script>window.__xss=1</script><img src=x onerror="window.__xss=2">');
    await p.locator('#search-form button[type="submit"]').click();
    await p.waitForFunction(() => document.querySelector('#search-status').textContent.includes('matches;'));
    assert.equal(await p.locator('#search-results script').count(), 0);
    assert.equal(await p.locator('#search-results img').count(), 0);
    assert.equal(await p.evaluate(() => window.__xss), undefined);

    // 2. Repeated explorer (28-paper/924-PYQ counts: 1 exact alias group + 15 unverified candidate clusters)
    await p.goto(base + 'repeated.html');
    await p.waitForFunction(() =>
      document.querySelector('#repeat-status').textContent.includes('1 exact-content alias group')
      && document.querySelector('#repeat-status').textContent.includes('15 normalized-text candidate clusters')
    );
    assert.equal(await p.locator('#repeat-results article.repeat-exact').count(), 1);
    assert.equal(await p.locator('#repeat-results article.repeat-candidate').count(), 15);
    assert.equal(await p.locator('#repeat-results .candidate-badge').count(), 15);
    assert(!/\b(?:CST\d{3}|SI201)\b/.test(await p.locator('#repeat-results').textContent()));

    // 3. Canonical PYQ question deep link + share/copy controls + clean subjectLabel title
    await p.locator('#repeat-results article.repeat-exact a').first().click();
    await p.waitForFunction(() => document.querySelector('.question-share'));
    const deepTitle = await p.title();
    assert(deepTitle.startsWith('Python · Q') && !/\bCST\d{3}\b/.test(deepTitle));
    assert.equal(await p.evaluate(() => questions[currentIndex].id), new URL(p.url()).searchParams.get('q'));
    assert((await p.locator('.question-share .share-question-link').count()) === 1);
    const unitTopicLink = p.locator('.question-share .unit-topic-link');
    assert.equal(await unitTopicLink.count(), 1, 'each answer card must link directly to its mapped unit/topic');
    const unitTopicHref = await unitTopicLink.getAttribute('href');
    assert.match(unitTopicHref, /subjects\/CST203\/units\/unit-\d+\.html\?topic=/);
    const targetTopic = await p.evaluate(() => questions[currentIndex].topic);
    assert.equal(new URL(unitTopicHref, p.url()).searchParams.get('topic'), targetTopic);
    await unitTopicLink.click();
    await p.waitForFunction(() => document.querySelector('.pyq-topic-target'));
    assert.equal(new URL(p.url()).searchParams.get('topic'), targetTopic);
    console.log('PASS search, safe query, exact + candidate repeat clusters, and question-to-topic unit link');

    // 4. Unit breadcrumb, authored #section anchor, prev/next nav, and filtered-PYQ handoff
    await p.goto(base + 'subjects/CST209/units/unit-4.html#dijkstras-algorithm');
    await p.waitForFunction(() => document.querySelector('section.unit-discovery'));
    assert((await p.locator('.unit-breadcrumb').textContent()).includes('Algorithms'));
    assert((await p.locator('.unit-breadcrumb').textContent()).includes("Dijkstra's Algorithm"));
    assert(!/\bCST\d{3}\b/.test(await p.locator('section.unit-discovery').textContent()));
    await p.locator('section.unit-discovery a[href*="pyq/index.html?subject=CST209&unit=4"]').first().click();
    await p.waitForFunction(() => document.querySelector('#filteredPyqPanel ol.filtered-pyq-list a'));
    assert(!/\bCST\d{3}\b/.test(await p.locator('#filteredPyqPanel').textContent()));
    console.log('PASS unit breadcrumb, authored anchor, and filtered-PYQ URL handoff');

    // 5. Flashcards and Today persistence (unchanged invariants)
    await p.goto(base + 'cards.html?subject=CST201');
    await p.waitForFunction(() => !document.querySelector('#card-session').hidden);
    await p.locator('#reveal-card').click();
    await p.locator('#card-ratings button').nth(2).click();
    assert.equal(await p.evaluate(() => StudyStore.read().events.length), 1);
    await p.reload();
    await p.waitForFunction(() => !document.querySelector('#card-session').hidden);
    assert.equal(await p.evaluate(() => StudyStore.read().events.length), 1);

    // Unit filter comes from the URL and stays in the URL after a filter change.
    await p.goto(base + 'cards.html?subject=CST209&unit=4');
    await p.waitForFunction(() => !document.querySelector('#card-session').hidden);
    assert((await p.locator('#study-status').textContent()).startsWith('Algorithms Unit 4'));
    assert.equal(await p.locator('#card-unit').inputValue(), '4');
    const citation = await p.locator('#card-citation');
    await p.locator('#reveal-card').click();
    const citationText = await citation.textContent();
    assert(/Model answer, not independently certified|Existing keyed explanation/.test(citationText));
    assert(!/\bCST\d{3}\b/.test(citationText) && !/\bCST\d{3}-(?:P\d{3}-|U\d+-)?Q\d+\b/.test(citationText));

    await p.goto(base + 'today.html');
    await p.waitForFunction(() => document.querySelector('#study-status').textContent.startsWith('Local-only'));
    assert((await p.locator('#goal-progress').textContent()).includes('1 card reviews'));
    assert(await p.locator('#primary-action a').count(), 'Today must offer one primary action');
    assert((await p.locator('#plan-detail').textContent()).includes('unresolved local mistake'));
    assert(!/\bCST\d{3}\b/.test(await p.locator('main').textContent()), 'Today must not print raw course codes');
    assert.deepEqual(errors, []);
    console.log('PASS source card reveal/rate persistence, URL unit filter, and Today local progress');
  } finally {
    await browser.close();
  }
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
