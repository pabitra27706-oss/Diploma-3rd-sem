/* Versioned local attempt boundary. No network; PYQ data is never written.
 * Legacy quiz keys remain readable and migration preserves the source until a
 * verified migrated attempt is completed/discarded. Question snapshots allow
 * exact retry/export without depending on a later bank revision.
 */
(() => {
  'use strict';
  const PREFIX = 'diploma-3rd-sem-attempt-';
  const LEGACY = 'quiz-autosave-';
  const HISTORY = 'quiz-history';
  const RESULT = 'quiz-result';
  const MISTAKES = 'diploma-3rd-sem-quiz-mistakes';
  const copy = value => JSON.parse(JSON.stringify(value));
  const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const read = key => {
    const raw = StudyStorage.legacy.getItem(key);
    if (raw === null) return null;
    try { return JSON.parse(raw); } catch { throw new Error(`Saved data is unreadable (${key}). It has not been deleted.`); }
  };
  const write = (key, value) => { StudyStorage.legacy.setItem(key, JSON.stringify(value)); return value; };
  const hasAnswer = value => value !== null && value !== undefined && String(value).trim() !== '';
  const cleanAnswers = (answers, ids) => Object.fromEntries(Object.entries(answers || {}).filter(([id,value]) => ids.includes(id) && hasAnswer(value)));
  function normalize(input, key = null, now = Date.now()) {
    if (!input || !input.config || !Array.isArray(input.questions) || !input.questions.length) throw new Error('Saved attempt has no question snapshot. Original data was retained.');
    const questions = copy(input.questions);
    const ids = questions.map(q => q.id);
    if (ids.some(id => !id) || new Set(ids).size !== ids.length) throw new Error('Saved attempt has invalid question IDs.');
    const config = copy(input.config);
    const startedAt = Number(input.startedAt || input.startTime) || now;
    const timed = Boolean(config.timer && Number(config.timerMins) > 0);
    const legacy = input.schemaVersion !== 1;
    const id = input.id || uid();
    const endsAt = timed ? (Number(input.endsAt) || (legacy ? startedAt + Number(config.timerMins)*60000 : now + Number(input.remainingMs ?? Number(config.timerMins)*60000))) : null;
    const status = input.status || 'active';
    return { ...copy(input), schemaVersion: 1, id, config, startedAt, startTime: startedAt,
      endsAt, remainingMs: timed ? Math.max(0, status === 'active' ? endsAt-now : Number(input.remainingMs || 0)) : null,
      questionIds: ids, questions, answers: cleanAnswers(input.answers, ids),
      flags: input.flags || {}, skipped: (input.skipped || []).filter(id => ids.includes(id)), visited: input.visited || [],
      currentIndex: Math.max(0, Math.min(Number(input.currentIndex)||0, ids.length-1)),
      status, autosaveKey: PREFIX+id, savedAt: input.savedAt || now,
      legacyKey: input.legacyKey || (legacy && key?.startsWith(LEGACY) ? key : null),
      migrationNote: input.migrationNote || (legacy && timed ? 'Legacy save had no remaining-time snapshot; deadline reconstructed from its saved start and duration, not reset to full time.' : null)
    };
  }
  function save(input) {
    const attempt = normalize(input);
    attempt.savedAt = Date.now();
    write(attempt.autosaveKey, attempt);
    return attempt;
  }
  function get(key) {
    const input = read(key);
    if (!input) return null;
    const attempt = normalize(input, key);
    if (input.schemaVersion !== 1) {
      save(attempt);
      const verified = read(attempt.autosaveKey);
      if (['questionIds','questions','answers','flags','currentIndex','endsAt'].some(field => JSON.stringify(verified[field]) !== JSON.stringify(attempt[field]))) throw new Error('Migration could not be verified; original save retained.');
    }
    return attempt;
  }
  function all() {
    const keys = Object.keys(StudyStorage.legacy);
    const migrated = keys.filter(k => k.startsWith(PREFIX)).map(k => get(k)).filter(Boolean);
    for (const key of keys.filter(k => k.startsWith(LEGACY))) {
      if (!migrated.some(a => a.legacyKey === key)) { const a=get(key); if (a) migrated.push(a); }
    }
    return migrated;
  }
  const latest = () => all().filter(a => a.status === 'active').sort((a,b) => b.savedAt-a.savedAt)[0] || null;
  const history = () => read(HISTORY) || [];
  const historyEntry = id => history().find(h => h.historyId === id) || null;
  function setHistory(entry) {
    const list = history().filter(h => h.historyId !== entry.historyId);
    list.push(copy(entry)); list.sort((a,b) => Number(b.completedAt)-Number(a.completedAt));
    write(HISTORY, list.slice(0,50)); return entry;
  }
  function score(questions, answers) {
    let correct=0, incorrect=0, unanswered=0, marksObtained=0;
    const mcqs=questions.filter(q => q.type==='mcq' && q.options && Object.prototype.hasOwnProperty.call(q.options,q.correct));
    for (const q of mcqs) {
      if (!hasAnswer(answers[q.id])) unanswered++;
      else if (answers[q.id]===q.correct) { correct++; marksObtained+=q.autoMarking===false ? 0 : Number(q.marks)||0; }
      else incorrect++;
    }
    return {score:correct, correct, incorrect, unanswered, total:mcqs.length, percentage:mcqs.length ? Math.round(correct/mcqs.length*100) : null,
      ungraded:questions.length-mcqs.length, marksObtained, gradableMarks:mcqs.reduce((sum,q)=>sum+(q.autoMarking===false ? 0 : Number(q.marks)||0),0)};
  }
  function updateMistakes(attempt) {
    const queue=read(MISTAKES) || {schemaVersion:1, resolvedCount:0, items:{}};
    if ((queue.processedIds || []).includes(attempt.id)) return;
    const now=Date.now();
    for (const q of attempt.questions) {
      const prior=queue.items[q.id];
      const gradable=q.type==='mcq' && q.options && Object.prototype.hasOwnProperty.call(q.options,q.correct);
      if (gradable && attempt.answers[q.id]===q.correct) {
        if (prior) { delete queue.items[q.id]; queue.resolvedCount++; }
      } else if ((gradable && hasAnswer(attempt.answers[q.id])) || !hasAnswer(attempt.answers[q.id]) || attempt.skipped.includes(q.id)) {
        queue.items[q.id]={subject:q.subject || q.id.split('-')[0],unit:q.unit || null,topic:q.topic || '',difficulty:q.difficulty,marks:q.marks,questionId:q.id,
          firstSeen:prior?.firstSeen || now,lastSeen:now,attempts:(prior?.attempts||0)+1,question:copy(q)};
      }
    }
    queue.items=Object.fromEntries(Object.entries(queue.items).sort((a,b)=>b[1].lastSeen-a[1].lastSeen).slice(0,200));
    queue.processedIds=[...(queue.processedIds || []).slice(-99),attempt.id];
    write(MISTAKES,queue);
  }
  function finish(input) {
    const attempt=normalize({...input,status:'submitted'});
    const assessment=score(attempt.questions,attempt.answers);
    const scored=attempt.config.mode==='mcq' && assessment.total>0;
    const result={...attempt, historyId:attempt.historyId || 'hist-'+attempt.id, completedAt:Date.now(),
      subject:attempt.config.subject,unit:attempt.config.unit,mode:attempt.config.mode,
      elapsed:Math.round((Date.now()-attempt.startedAt)/1000),assessment,
      outcome:scored ? 'scored' : 'not scored',score:scored ? assessment.score : null,total:scored ? assessment.total : attempt.questions.length,
      correct:assessment.correct,incorrect:assessment.incorrect,unanswered:assessment.unanswered,percentage:scored ? assessment.percentage : null};
    // Save exportable result/history before removing the resume entry.
    setHistory(result); write(RESULT,result); updateMistakes(attempt);
    write(attempt.autosaveKey,result);
    if (attempt.legacyKey) StudyStorage.legacy.removeItem(attempt.legacyKey);
    return result;
  }
  function abandon(key) {
    const attempt=get(key); if (!attempt) return;
    attempt.status='abandoned'; save(attempt);
    setHistory({...attempt,historyId:'hist-'+attempt.id,subject:attempt.config.subject,unit:attempt.config.unit,mode:attempt.config.mode,outcome:'abandoned',score:null,total:attempt.questions.length,completedAt:Date.now()});
    if (attempt.legacyKey) StudyStorage.legacy.removeItem(attempt.legacyKey);
  }
  function retry(entry, shuffled=false) {
    if (!entry?.questions?.length) throw new Error('This legacy history entry has no question snapshot. Exact retry is unavailable; choose a new quiz in setup.');
    let questions=copy(entry.questions);
    if (shuffled) for(let i=questions.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [questions[i],questions[j]]=[questions[j],questions[i]]; }
    return save({config:entry.config || {subject:entry.subject,unit:entry.unit,mode:entry.mode,timer:false},questions,answers:{},flags:entry.flags || {},skipped:[],visited:[],currentIndex:0,status:'active'});
  }
  function edit(id, answers) {
    const entry=historyEntry(id);
    if (!entry?.questions?.length) throw new Error('This history entry has no editable snapshot.');
    entry.answers=cleanAnswers(answers,entry.questions.map(q=>q.id));entry.editedAt=Date.now();entry.assessment=score(entry.questions,entry.answers);
    if(entry.mode==='mcq') Object.assign(entry,entry.assessment);
    setHistory(entry);
    const current=read(RESULT); if(current?.historyId===id) write(RESULT,entry);
    return entry;
  }
  globalThis.QuizAttempts={PREFIX,LEGACY,RESULT,HISTORY,MISTAKES,hasAnswer,cleanAnswers,normalize,save,get,latest,all,finish,abandon,history,historyEntry,setHistory,retry,edit,score,
    current:()=>read(RESULT), setCurrent:value=>write(RESULT,value),setPendingConfig:value=>write('quiz-pending-config',value),
    clearHistory:()=>StudyStorage.legacy.removeItem(HISTORY),deleteHistory:id=>write(HISTORY,history().filter(h=>h.historyId!==id)),
    mistakes:()=>read(MISTAKES) || {schemaVersion:1,resolvedCount:0,items:{}},clearMistakes:()=>StudyStorage.legacy.removeItem(MISTAKES),
    mistakeQuestions:(limit=40)=>Object.values((read(MISTAKES)||{items:{}}).items).sort((a,b)=>b.lastSeen-a.lastSeen || a.questionId.localeCompare(b.questionId)).slice(0,limit).map(item=>copy(item.question))};
})();
