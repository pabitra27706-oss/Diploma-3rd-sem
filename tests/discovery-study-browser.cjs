/* Focused implementation regression, not full cross-device acceptance. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox']});try{
const c=await browser.newContext({serviceWorkers:'block'}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));const base=process.env.TEST_BASE||'http://127.0.0.1:8001/after/Diploma-3rd-sem/';
await p.goto(base+'search.html?q=arrays&subject=CST201');await p.waitForFunction(()=>document.querySelector('#search-status').textContent.includes('matches;'));assert(await p.locator('#search-results a').count()>0);
await p.locator('#query').fill('<script>');await p.locator('#search-form button').click();await p.waitForFunction(()=>document.querySelector('#search-status').textContent.includes('matches;'));assert.equal(await p.locator('#search-results script').count(),0);
await p.goto(base+'repeated.html');await p.waitForFunction(()=>document.querySelector('#repeat-status').textContent.includes('69 groups'));assert.equal(await p.locator('#repeat-results article').count(),69);
await p.locator('#repeat-results article a').first().click();await p.waitForFunction(()=>document.querySelector('.question-share'));assert(await p.title().then(t=>t.includes('CST')));
assert.equal(await p.evaluate(()=>questions[currentIndex].id),new URL(p.url()).searchParams.get('q'));
console.log('PASS search, safe query, exact repeat groups and question deep link');
await p.goto(base+'cards.html?subject=CST201');await p.waitForFunction(()=>!document.querySelector('#card-session').hidden);await p.locator('#reveal-card').click();await p.locator('#card-ratings button').nth(2).click();
assert.equal(await p.evaluate(()=>StudyStore.read().events.length),1);await p.reload();await p.waitForFunction(()=>!document.querySelector('#card-session').hidden);assert.equal(await p.evaluate(()=>StudyStore.read().events.length),1);
await p.goto(base+'today.html');await p.waitForFunction(()=>document.querySelector('#study-status').textContent.startsWith('Local-only'));assert((await p.locator('#goal-progress').textContent()).includes('1 card reviews'));
assert.deepEqual(errors,[]);console.log('PASS source card reveal/rate persistence and Today local progress');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
