/* Read-only paper adapter. Raw records, option wording and keys are unchanged;
 * explicit group/section/choice-set rules, timed loose-script windows, and
 * option+explanation mark splits are derived directly from paperFormat.
 */
(() => {
  'use strict';
  const base = new URL('../../_data/', document.currentScript.src);
  const EXPLANATION_SPLIT_RE = /1\s*mark[^+;\n]*(?:right|correct)?\s*answer[^+;\n]*\+\s*1\s*mark[^+;\n]*explanation|out of 2 marks for each mcq,\s*1 mark is allotted for the right answer and 1 mark is allotted for the correct explanation/i;
  const TIMED_FIRST_SECTION_RE = /(?:within|maximum time allowed is)\s+(\d+)\s+minutes/i;

  async function read(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Paper resource unavailable (${response.status}). Open it online before attempting offline.`);
    return response.json();
  }

  async function registry(subject) {
    if (!/^CST20[13579]$/.test(subject)) throw new Error('Unknown paper subject');
    return read(new URL(subject + '/registry.json', base));
  }

  function minutes(duration) {
    const match = /^\s*(\d+(?:\.\d+)?)\s*Hours?\s*$/i.exec(duration || '');
    if (!match) throw new Error('Paper duration could not be read; no invented timer was applied.');
    return Number(match[1]) * 60;
  }

  function hasExplanationSplit(...texts) {
    return texts.some(t => typeof t === 'string' && EXPLANATION_SPLIT_RE.test(t));
  }

  function derivePaperRules(paper) {
    const pf = paper.paperFormat || {};
    const general = pf.generalInstructions || [];
    const groups = pf.groups || [];
    const rules = [];
    const qRuleMeta = new Map();
    let timedSection = null;

    for (const g of groups) {
      const groupId = String(g.id || '');
      const groupLabel = g.groupLabel || (groupId ? `Group ${groupId}` : 'Section');
      const explSplit = hasExplanationSplit(g.markSplit, g.instruction, g.additionalInstruction, ...general);
      const timeMatch = groupId === 'A'
        ? TIMED_FIRST_SECTION_RE.exec([g.additionalInstruction || '', ...general].join(' '))
        : null;
      if (timeMatch && !timedSection) {
        timedSection = {
          groupId: 'A',
          minutes: Number(timeMatch[1]),
          compulsoryFirst: /compulsory/i.test([g.instruction || '', g.additionalInstruction || '', ...general].join(' ')),
          description: g.additionalInstruction || `Group A must be answered first within ${timeMatch[1]} minutes.`
        };
      }

      if (Array.isArray(g.sections) && g.sections.length) {
        for (const sec of g.sections) {
          const secSplit = hasExplanationSplit(sec.markSplit, g.markSplit);
          const rule = {
            id: `${groupId}:${sec.id}`,
            groupId,
            kind: 'section',
            label: `${groupLabel} · ${sec.title || sec.id}`,
            instruction: sec.instruction || g.instruction || '',
            questionIds: [...(sec.questionIds || [])],
            totalSet: Number(sec.totalSet || (sec.questionIds || []).length),
            answerAny: Number(sec.answerAny ?? (sec.questionIds || []).length),
            marksEach: Number(sec.marksEach || 0),
            maxMarks: Number(sec.maxMarks || 0),
            markSplit: sec.markSplit || g.markSplit || '',
            explanationSplit: secSplit
          };
          rules.push(rule);
          for (const qid of rule.questionIds) qRuleMeta.set(qid, rule);
        }
      } else if (Array.isArray(g.choiceSets) && g.choiceSets.length) {
        for (const cs of g.choiceSets) {
          const qNumLabel = cs.sourceQuestion ? `Q${cs.sourceQuestion}` : cs.id;
          const rule = {
            id: `${groupId}:${cs.id}`,
            groupId,
            kind: 'choiceSet',
            label: `${groupLabel} · ${qNumLabel} (answer any ${cs.answerAny ?? 1} of ${cs.totalSet || (cs.questionIds || []).length})`,
            instruction: cs.instruction || g.instruction || '',
            questionIds: [...(cs.questionIds || [])],
            totalSet: Number(cs.totalSet || (cs.questionIds || []).length),
            answerAny: Number(cs.answerAny ?? 1),
            marksEach: Number(cs.marksEach || g.marksEach || 0),
            maxMarks: Number(cs.maxMarks || 0),
            markSplit: g.markSplit || '',
            explanationSplit: false
          };
          rules.push(rule);
          for (const qid of rule.questionIds) qRuleMeta.set(qid, rule);
        }
      } else {
        const cleanTitle = (g.title || '').replace(/^Group\s+[A-Z0-9]+\s*[—–-]\s*/i, '');
        const rule = {
          id: groupId || String(rules.length + 1),
          groupId,
          kind: 'group',
          label: cleanTitle && cleanTitle.toLowerCase() !== groupLabel.toLowerCase()
            ? `${groupLabel} — ${cleanTitle}`
            : groupLabel,
          instruction: g.instruction || '',
          questionIds: [...(g.questionIds || [])],
          totalSet: Number(g.totalSet || (g.questionIds || []).length),
          answerAny: Number(g.answerAny ?? (g.questionIds || []).length),
          marksEach: Number(g.marksEach || 0),
          maxMarks: Number(g.maxMarks || 0),
          markSplit: g.markSplit || '',
          explanationSplit: explSplit
        };
        rules.push(rule);
        for (const qid of rule.questionIds) qRuleMeta.set(qid, rule);
      }
    }

    return { rules, qRuleMeta, timedSection };
  }

  async function load(subject, fileName) {
    const index = await registry(subject);
    const meta = index.papers.find(p => p.fileName === fileName);
    if (!meta) throw new Error('Paper not in the subject registry');
    const paper = await read(new URL(subject + '/' + meta.fileName, base));
    const { rules, qRuleMeta, timedSection } = derivePaperRules(paper);

    const questions = paper.questions.map(q => {
      let options = q.options;
      if (Array.isArray(options)) {
        options = Object.fromEntries(options.map((opt, i) => [
          typeof opt === 'string' ? String.fromCharCode(65 + i) : opt.key || opt.label || String.fromCharCode(65 + i),
          typeof opt === 'string' ? opt : opt.text || opt.value || ''
        ]));
      }
      const correct = typeof q.correct === 'number' ? Object.keys(options || {})[q.correct] : q.correct;
      const rule = qRuleMeta.get(q.id);
      const isMcq = q.type === 'mcq';
      const hasExplSplit = Boolean(isMcq && rule?.explanationSplit && Number(q.marks) === 2);
      const optionMarks = isMcq ? (hasExplSplit ? 1 : Number(q.marks || 0)) : 0;
      const explanationMarks = hasExplSplit ? 1 : 0;
      return {
        ...q,
        subject,
        source: 'PYQ',
        autoMarking: false,
        paperRuleId: rule?.id || null,
        paperRuleLabel: rule?.label || null,
        optionMarks,
        explanationMarks,
        options,
        correct,
        explanation: q.explanation || q.answer,
        modelAnswer: q.type !== 'mcq' ? q.answer : undefined
      };
    });

    const setMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);
    const fullMarks = Number(meta.fullMarks || paper.fullMarks || 0);
    return {
      questions,
      config: {
        subject,
        unit: 'all',
        mode: 'all',
        count: questions.length,
        timer: true,
        timerMins: minutes(meta.duration),
        source: 'PYQ',
        paper: {
          fileName: meta.fileName,
          examSession: meta.examSession,
          duration: meta.duration,
          fullMarks,
          esePatternMarks: 60,
          hasPatternMismatch: fullMarks !== 60 || setMarks !== fullMarks,
          setMarks,
          instructions: paper.paperFormat?.generalInstructions || [],
          groups: paper.paperFormat?.groups || [],
          rules,
          timedSection,
          notice: 'Paper practice uses supplied model answers, not official marking. Source answer-any quotas (and any timed loose-script section window) are enforced from paperFormat. Keyed MCQ option choices are checked automatically; written 1-mark MCQ explanations and subjective answers require manual self-review, so no automatic overall paper grade is awarded.'
        }
      }
    };
  }

  globalThis.QuizPaper = { registry, load, minutes, derivePaperRules };
})();
