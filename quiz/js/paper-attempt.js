/* Read-only paper adapter. Raw records, option wording and keys are unchanged;
 * only runtime option representation is adapted for the quiz renderer.
 */
(() => {
  const base = new URL('../../_data/', document.currentScript.src);
  async function read(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Paper resource unavailable (${response.status}). Open it online before attempting offline.`);
    return response.json();
  }
  async function registry(subject) {
    if (!/^CST20[13579]$/.test(subject)) throw new Error('Unknown paper subject');
    return read(new URL(subject+'/registry.json',base));
  }
  function minutes(duration) {
    const match = /^\s*(\d+(?:\.\d+)?)\s*Hours?\s*$/i.exec(duration || '');
    if (!match) throw new Error('Paper duration could not be read; no invented timer was applied.');
    return Number(match[1])*60;
  }
  async function load(subject,fileName) {
    const index=await registry(subject);
    const meta=index.papers.find(p=>p.fileName===fileName);
    if(!meta) throw new Error('Paper not in the subject registry');
    const paper=await read(new URL(subject+'/'+meta.fileName,base));
    const questions=paper.questions.map(q=>{
      let options=q.options;
      if(Array.isArray(options)) options=Object.fromEntries(options.map((opt,i)=>[typeof opt==='string' ? String.fromCharCode(65+i) : opt.key || opt.label || String.fromCharCode(65+i),typeof opt==='string' ? opt : opt.text || opt.value || '']));
      const correct=typeof q.correct==='number' ? Object.keys(options || {})[q.correct] : q.correct;
      return {...q,subject,source:'PYQ',autoMarking:false,options,correct,explanation:q.explanation || q.answer,modelAnswer:q.type!=='mcq' ? q.answer : undefined};
    });
    const setMarks=questions.reduce((sum,q)=>sum+Number(q.marks||0),0);
    return {questions,config:{subject,unit:'all',mode:'all',count:questions.length,timer:true,timerMins:minutes(meta.duration),source:'PYQ',
      paper:{fileName:meta.fileName,examSession:meta.examSession,duration:meta.duration,fullMarks:meta.fullMarks,setMarks,
        instructions:paper.paperFormat?.generalInstructions || [],groups:paper.paperFormat?.groups || [],
        notice:'Paper practice uses supplied model answers, not official marking. All set questions are shown; answer-any/group rules are not automatically enforced. MCQ correctness can be checked; automatic paper marks are not awarded because explanation splits and answer-any rules require review.'}}};
  }
  globalThis.QuizPaper={registry,load,minutes};
})();
