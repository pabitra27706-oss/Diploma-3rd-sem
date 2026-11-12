/* Optional Playwright integration: warmed-cache paper practice offline; no production edits. */
const {chromium}=require('playwright-core'),assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,args:['--no-sandbox']});
try{
const c=await browser.newContext(),p=await c.newPage(),base=process.env.TEST_BASE || 'http://127.0.0.1:8001/after/Diploma-3rd-sem/';
assert(['127.0.0.1','localhost'].includes(new URL(base).hostname));
await p.goto(base+'quiz/index.html');await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.waitForFunction(()=>navigator.serviceWorker.controller);
const url=base+'quiz/play.html?subject=CST205&paperFile=CST205-P006-2026-01.json';
await p.goto(url);await p.waitForFunction(()=>quizState.questions.length===24);await p.evaluate(()=>submitQuiz());await p.waitForURL('**/review.html');await p.waitForFunction(()=>reviewState.questions.length===24);
await p.goto(base+'quiz/index.html');await c.setOffline(true);await p.goto(url);await p.waitForFunction(()=>quizState.questions.length===24);
await p.evaluate(()=>{const q=quizState.questions[0];selectMCQOption(q.id,q.correct);submitQuiz();});await p.waitForURL('**/review.html');await p.waitForFunction(()=>reviewState.questions.length===24);assert((await p.locator('body').innerText()).includes('no automatic overall grade'));
console.log('PASS previously cached paper, registry, engine and review attempted end-to-end offline');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
