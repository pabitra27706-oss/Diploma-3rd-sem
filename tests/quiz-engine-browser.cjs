/* Optional browser integration tests. Requires development-only playwright-core.
 * NODE_PATH=/path/to/node_modules CHROMIUM_EXECUTABLE=/path/to/chromium
 * TEST_BASE=http://127.0.0.1:8001/after/Diploma-3rd-sem/ node tests/quiz-engine-browser.cjs
 */
const {chromium}=require('playwright-core');
const assert=require('node:assert/strict');
(async()=>{
  const base=process.env.TEST_BASE || 'http://127.0.0.1:8001/after/Diploma-3rd-sem/';
  assert(['127.0.0.1','localhost'].includes(new URL(base).hostname));
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE || undefined,args:['--no-sandbox']});
  try {
    const context=await browser.newContext({serviceWorkers:'block'}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install({time:Date.now()});
    await page.goto(base+'quiz/play.html?subject=CST201&unit=all&mode=mcq&count=5&timer=1&timerMins=10');
    await page.waitForFunction(()=>quizState.questions.length===5 && quizState.attemptId);
    const before=await page.evaluate(()=>{ const q=quizState.questions[0]; selectMCQOption(q.id,q.correct); quizState.flags[q.id]=true; goToQuestion(2);doAutosave();return {ids:quizState.questions.map(q=>q.id),key:quizState.autosaveKey,endsAt:quizState.endsAt,answers:quizState.answers};});
    await page.clock.fastForward(30000);await page.reload();await page.waitForFunction(()=>quizState.currentIndex===2);
    let resumed=await page.evaluate(()=>({ids:quizState.questions.map(q=>q.id),answers:quizState.answers,remaining:quizState.endsAt-Date.now(),flags:quizState.flags}));
    assert.deepEqual(resumed.ids,before.ids);assert.deepEqual(resumed.answers,before.answers);assert(resumed.flags[before.ids[0]]);assert(Math.abs(resumed.remaining-570000)<2500);
    await page.clock.fastForward(270000);await page.reload();await page.waitForFunction(()=>quizState.currentIndex===2);
    assert(Math.abs(await page.evaluate(()=>quizState.endsAt-Date.now())-300000)<3000);
    await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
    assert((await page.evaluate(()=>QuizAttempts.get(quizState.autosaveKey).remainingMs))<=301000);
    console.log('PASS 30-second/5-minute virtual-clock reload, deadline/index/flags/answers, visibility save');
    await page.evaluate(()=>{submitQuiz();});await page.waitForURL('**/result.html');
    const entry=await page.evaluate(()=>QuizAttempts.current());assert.equal(entry.questions.length,5);assert.equal(entry.unanswered,4);assert.equal(entry.incorrect,0);
    await page.goto(base+'quiz/play.html?retry='+entry.historyId);await page.waitForFunction(()=>quizState.questions.length===5);
    assert.deepEqual(await page.evaluate(()=>quizState.questions.map(q=>q.id)),before.ids);
    console.log('PASS submit distinguishes unanswered from incorrect; exact retry');
    await page.clock.resume();
    await page.goto(base+'quiz/setup.html?subject=CST201&mode=all');await page.waitForFunction(()=>setupQuestions.length===872);
    const marks=await page.locator('input[name=marks]').evaluateAll(inputs=>inputs.map(i=>Number(i.value)));
    const actual=await page.evaluate(()=>[...new Set(setupQuestions.map(q=>Number(q.marks)))].sort((a,b)=>a-b));assert.deepEqual(marks,actual);
    console.log('PASS marks options derived from data');
    const preview=await page.evaluate(()=>({ids:previewQuestions.map(q=>q.id),marks:previewQuestions.reduce((s,q)=>s+q.marks,0),minutes:state.timerMinutes}));
    await page.locator('#btn-start-quiz').click({timeout:5000});await page.waitForURL('**/play.html?resume=*');await page.waitForFunction(()=>quizState.questions.length>0);
    assert.deepEqual(await page.evaluate(()=>quizState.questions.map(q=>q.id)),preview.ids);
    assert.equal(await page.evaluate(()=>quizState.questions.reduce((s,q)=>s+q.marks,0)),preview.marks);
    console.log('PASS setup preview starts exactly the selected snapshot and marks');

    // Three independent snapshots, with a different current result, must export selected IDs.
    const histories=await page.evaluate(()=>[0,1,2].map(i=>{const q={id:'CST201-test-'+i,type:'theory',question:'Distinct snapshot '+i,marks:2};return QuizAttempts.finish(QuizAttempts.save({config:{subject:'CST201',unit:'all',mode:'all',timer:false},questions:[q],answers:{[q.id]:'Answer '+i}}));}));
    for(let i=0;i<3;i++) {
      await page.goto(base+'quiz/export.html?historyId='+histories[i].historyId);
      await page.waitForFunction(()=>exportState.questions.length===1);
      const exported=await page.evaluate(()=>({text:exportState.generatedContent,file:exportState.filename}));
      assert(exported.text.includes('Distinct snapshot '+i));assert(exported.text.includes('Answer '+i));assert(exported.file.includes(histories[i].historyId));
    }
    await page.goto(base+'quiz/review.html?historyId='+histories[0].historyId);
    await page.waitForFunction(()=>reviewState.questions.length===1);
    await page.evaluate(()=>{openEditModal(reviewState.questions[0]);dom.editAnswerTextarea.value='Linked edit';saveEditedAnswer();});
    assert.equal(await page.evaluate(id=>QuizAttempts.historyEntry(id).answers['CST201-test-0'],histories[0].historyId),'Linked edit');
    console.log('PASS three selected exports, unique filenames, linked review edit');
    await page.route('**/_quiz-data/CST201/unit-1.json',route=>route.abort());
    await page.goto(base+'quiz/play.html?subject=CST201&unit=1&mode=mcq&count=5');
    await page.getByText('Failed to Load Quiz',{exact:true}).waitFor();
    assert((await page.locator('#error-desc').textContent()).includes('CST201 unit 1'));await page.unroute('**/_quiz-data/CST201/unit-1.json');
    console.log('PASS forced bank failure is explicit, not partial/empty success');
    await page.goto(base+'quiz/play.html?subject=CST205&paperFile=CST205-P006-2026-01.json');
    await page.waitForFunction(()=>quizState.questions.length===24);
    const paper=await page.evaluate(()=>({count:quizState.questions.length,minutes:quizState.config.timerMins,set:quizState.config.paper.setMarks,sum:quizState.questions.reduce((s,q)=>s+q.marks,0)}));
    assert.equal(paper.minutes,150);assert.equal(paper.set,paper.sum);
    await page.getByText(/Unverified overall total/).waitFor();
    await page.evaluate(()=>submitQuiz());await page.waitForURL('**/review.html');
    await page.getByText(/no automatic overall grade/).waitFor();
    console.log('PASS immutable paper practice, source duration/set marks, explicit marking limitation');
    await page.goto(base+'quiz/index.html');await page.getByRole('heading',{name:'Practice my mistakes'}).waitFor();
    assert.deepEqual(errors,[]);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
