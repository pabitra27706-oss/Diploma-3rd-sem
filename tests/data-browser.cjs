/* Optional development-only Playwright smoke test. No production mutation.
 * NODE_PATH=/path/to/dev/node_modules CHROMIUM_EXECUTABLE=/path/to/chromium
 * TEST_BASE=http://127.0.0.1:8000/Diploma-3rd-sem/ node tests/data-browser.cjs
 */
const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
(async () => {
  const base = process.env.TEST_BASE || 'http://127.0.0.1:8000/after/Diploma-3rd-sem/';
  assert(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Use a disposable local server');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE || undefined, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + 'practice/index.html');
    await page.waitForFunction(() => S.all.length === 923);
    assert.deepEqual(await page.evaluate(() => Array.from({length:10}, (_,i) => S.all.filter(q => q.practiceDay === i+1).length)), [93,93,93,92,92,92,92,92,92,92]);
    await page.locator('#topic-trigger').click();
    const topicOptions = await page.locator('#topic-listbox [role="option"]').evaluateAll(els => els.map(e => e.dataset.value || e.textContent.trim()));
    for (const genericLabel of ['Short Answer', 'Long Answer', 'Objective', 'Group A / Objective', 'Group C / Long Answer']) {
      assert(!topicOptions.includes(genericLabel), `Generic placeholder leaked into topic dropdown: ${genericLabel}`);
    }
    await page.goto(base + 'practice/session.html?days=10');
    await page.waitForFunction(() => S.questions.length === 92);
    await page.goto(base + 'practice/session.html?q=CST203-P001-Q44');
    await page.waitForFunction(() => S.questions.length > 0 && S.questions[S.index]?.id === 'CST203-P001-Q43');
    assert((await page.locator('#q-from').textContent()).includes('Also in: CST203-P001-Q44'));
    console.log('PASS unique Practice pool, non-generic topics, balanced days, alias deep-link + Also in badge');
    await page.goto(base + 'quiz/setup.html?subject=CST201&mode=all');
    await page.waitForFunction(() => setupQuestions.length === 872);
    const choices = await page.evaluate(() => ({ subjects: [...document.querySelector('#subject-select').options].map(o => o.value), years: [...document.querySelector('#year-filter').options].map(o => o.value), sources: [...document.querySelectorAll('[name=source]')].map(o => o.value) }));
    assert(!choices.subjects.includes('CST207'));
    assert(!choices.years.includes('2019') && !choices.years.includes('2020'));
    assert(choices.sources.includes('EXTRA'));
    await page.locator('details[data-section=filters] summary').click();
    for (const subject of ['CST201', 'CST203', 'CST205', 'CST209', 'all']) {
      await page.selectOption('#subject-select', subject);
      for (const source of choices.sources) {
        const input = page.locator(`[name=source][value="${source}"]`);
        if (await input.isEnabled()) {
          await input.locator('..').click();
          assert(await page.evaluate(() => inventorySelection().length > 0));
          const years = await page.locator('#year-filter option:not([disabled])').evaluateAll(options => options.map(o => o.value));
          for (const year of years) {
            await page.selectOption('#year-filter', year);
            assert(await page.evaluate(() => inventorySelection().length > 0));
          }
          await page.selectOption('#year-filter', '');
        }
      }
    }
    console.log('PASS bank-derived subjects/years/sources; enabled source/year combinations nonempty');
    const score = await page.evaluate(() => calculateScore([{id:'m',type:'mcq',options:{A:'yes',B:'no'},correct:'A'},{id:'t',type:'theory',answerStatus:'missing'}],{m:'A',t:'answer'}));
    assert.equal(score.total,1); assert.equal(score.correct,1); assert.equal(score.ungraded,1);
    await page.goto(base + 'quiz/play.html?subject=CST201&mode=all&types=theory&count=5&timer=0');
    await page.getByText('No key — not graded', {exact:true}).waitFor();
    console.log('PASS ungradable questions labelled and excluded from score');
    await page.evaluate(() => {
      StudyStorage.legacy.setItem('quiz-result', JSON.stringify({config:{subject:'CST201',unit:'all',mode:'all'}, questions:[{id:'test-theory',type:'theory',question:'Test fixture',answerStatus:'missing'}],answers:{'test-theory':'Test answer'},completedAt:Date.now()}));
    });
    await page.goto(base + 'quiz/result.html');
    await page.waitForURL('**/review.html');
    await page.getByText('No key — not graded', {exact:true}).waitFor();
    await page.evaluate(() => StudyStorage.legacy.setItem('quiz-history',JSON.stringify([{historyId:'test-history',subject:'CST201',unit:'all',mode:'all',score:null,total:1,completedAt:Date.now()}])));
    await page.goto(base + 'quiz/result.html?historyId=test-history');
    await page.getByText('Not graded', {exact:true}).first().waitFor();
    assert.equal(await page.locator('#stat-incorrect').textContent(), '0');
    console.log('PASS theory-only result is not a failed zero-score grade');

    await page.goto(base + 'index.html');
    await page.waitForFunction(() => document.querySelector('[data-live-count=questions]').textContent === '923');
    assert.equal(await page.locator('.section-count[data-live-count="subjects"]').textContent(), '5 subjects');
    await page.goto(base + 'pyq/answers.html?subject=CST203&paper=P001&q=CST203-P001-Q44');
    await page.locator('.question-duplicates a').first().waitFor();
    await page.goto(base + 'subjects/CST209/index.html');
    assert((await page.locator('#progressSummary').textContent()).includes('0 / 4 units visited'));
    assert((await page.locator('.unit-card[data-supplementary="true"]').textContent()).includes('Supplementary'));
    await page.goto(base + 'roadmap/index.html');
    await page.getByText('5 subjects · 93 mixed-revision questions', {exact:true}).first().waitFor();
    console.log('PASS home, PYQ duplicate cross-ref, CST209 4-unit syllabus alignment, and roadmap inventory counts');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
