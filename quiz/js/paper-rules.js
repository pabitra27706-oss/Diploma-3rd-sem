/* Pure paper-choice rule adapter. Uses explicit structured paperFormat metadata;
 * it never edits the immutable papers or awards/infers marks.
 */
(() => {
  'use strict';

  function uniqueIds(values) {
    return [...new Set((Array.isArray(values) ? values : []).filter(id => typeof id === 'string' && id))];
  }

  function build(groups, questions, generalInstructions = []) {
    const questionById = new Map((questions || []).map(q => [q.id, q]));
    const constraints = [];
    const unsupported = [];
    const timedRules = [];
    const unsupportedTimed = [];
    const claimed = new Set();

    function addConstraint({id, label, questionIds, answerAny}, groupId) {
      const ids = uniqueIds(questionIds);
      if (!Number.isInteger(answerAny) || answerAny < 1 || answerAny > ids.length) {
        unsupported.push({groupId, id, reason: 'Invalid or incomplete answer-any quota.'});
        return false;
      }
      if (ids.length !== (questionIds || []).length || ids.some(qid => !questionById.has(qid))) {
        unsupported.push({groupId, id, reason: 'Question IDs are missing, duplicated, or unavailable.'});
        return false;
      }
      if (ids.some(qid => claimed.has(qid))) {
        unsupported.push({groupId, id, reason: 'Choice pools overlap; enforcement withheld for this pool.'});
        return false;
      }
      ids.forEach(qid => claimed.add(qid));
      constraints.push({id, label, questionIds: ids, answerAny});
      return true;
    }

    for (const group of Array.isArray(groups) ? groups : []) {
      const groupId = String(group.id || group.title || 'paper-group');
      const ids = uniqueIds(group.questionIds);
      if (!ids.length) {
        unsupported.push({groupId, reason: 'No question-ID pool is recorded.'});
        continue;
      }

      const sections = Array.isArray(group.sections) ? group.sections : [];
      if (sections.length) {
        const parentSet = new Set(ids);
        const sectionIds = sections.flatMap(section => Array.isArray(section.questionIds) ? section.questionIds : []);
        const sameMembership = sectionIds.length === ids.length && new Set(sectionIds).size === ids.length && sectionIds.every(qid => parentSet.has(qid));
        const quotaSum = sections.reduce((sum, section) => sum + Number(section.answerAny || 0), 0);
        if (!sameMembership || !Number.isInteger(group.answerAny) || quotaSum !== group.answerAny) {
          unsupported.push({groupId, reason: 'Nested section membership or quotas do not reconcile with the parent group; enforcement withheld.'});
          continue;
        }
        const before = constraints.length;
        let valid = true;
        for (const section of sections) {
          valid = addConstraint({
            id: `${groupId}:${section.id || section.title || constraints.length}`,
            label: `${group.title || `Group ${groupId}`} — ${section.title || section.id || 'section'}`,
            questionIds: section.questionIds,
            answerAny: section.answerAny
          }, groupId) && valid;
        }
        if (!valid) {
          constraints.splice(before);
          ids.forEach(qid => claimed.delete(qid));
        }
        continue;
      }

      // Some papers state one alternative from each numbered question. The
      // metadata stores a group-level total; preserve the source-number pools
      // rather than reducing this to an incorrect global quota.
      const instruction = String(group.instruction || '');
      if (/one alternative from each/i.test(instruction)) {
        const questionNumbers = [...new Set([...instruction.matchAll(/\bQ(\d+)\b/gi)].map(match => match[1]))];
        const pools = questionNumbers.map(number => ({
          number,
          questionIds: ids.filter(qid => {
            const sourceNumber = String(questionById.get(qid)?.sourceNumber || '');
            return new RegExp(`^Q${number}\\s*\\(`, 'i').test(sourceNumber);
          })
        }));
        const pooledIds = pools.flatMap(pool => pool.questionIds);
        if (questionNumbers.length === Number(group.answerAny) && pooledIds.length === ids.length && new Set(pooledIds).size === ids.length && pools.every(pool => pool.questionIds.length > 1)) {
          const before = constraints.length;
          let valid = true;
          for (const pool of pools) {
            valid = addConstraint({
              id: `${groupId}:Q${pool.number}`,
              label: `${group.title || `Group ${groupId}`} — Q${pool.number} alternatives`,
              questionIds: pool.questionIds,
              answerAny: 1
            }, groupId) && valid;
          }
          if (!valid) {
            constraints.splice(before);
            ids.forEach(qid => claimed.delete(qid));
          }
          continue;
        }
        unsupported.push({groupId, reason: 'Alternative-question pools could not be reconciled to source-number labels; enforcement withheld.'});
        continue;
      }

      addConstraint({
        id: groupId,
        label: group.title || `Group ${groupId}`,
        questionIds: group.questionIds,
        answerAny: group.answerAny
      }, groupId);
    }

    const timedInstruction = (Array.isArray(generalInstructions) ? generalInstructions : [])
      .map(text => String(text || '').match(/maximum time allowed is (\d+) minutes?, after which .*?(?:scripts|script) will be collected/i))
      .find(Boolean);
    if (timedInstruction) {
      const durationMinutes = Number(timedInstruction[1]);
      const candidates = (Array.isArray(groups) ? groups : []).filter(group => {
        const additional = String(group.additionalInstruction || '');
        const within = additional.match(/answered first .*?within (\d+) minutes?/i);
        return within && Number(within[1]) === durationMinutes && Array.isArray(group.questionIds) && group.questionIds.length;
      });
      if (candidates.length === 1) {
        const group = candidates[0];
        const ids = uniqueIds(group.questionIds);
        if (ids.length === group.questionIds.length && ids.every(id => questionById.has(id))) {
          timedRules.push({
            id: `timed-${group.id || 'section'}`,
            label: group.title || `Group ${group.id}`,
            questionIds: ids,
            durationMs: durationMinutes * 60000,
            instruction: group.additionalInstruction
          });
        } else {
          unsupportedTimed.push('The timed section question IDs are invalid; its time limit is shown but not enforced.');
        }
      } else {
        unsupportedTimed.push('A printed timed-section instruction is present but does not map to exactly one structured question group; it is shown but not enforced.');
      }
    }

    const uncoveredQuestionIds = [...questionById.keys()].filter(id => !claimed.has(id));
    return {schemaVersion: 1, constraints, unsupported, uncoveredQuestionIds, timedRules, unsupportedTimed};
  }

  function validate(rules, selectedIds) {
    const selected = uniqueIds(selectedIds);
    const allowed = new Set((rules?.constraints || []).flatMap(rule => rule.questionIds || []));
    const unknown = selected.filter(id => !allowed.has(id));
    const violations = unknown.map(id => ({id, reason: 'Question is outside the verified choice rules.'}));
    for (const rule of rules?.constraints || []) {
      const pool = new Set(rule.questionIds || []);
      const count = selected.filter(id => pool.has(id)).length;
      if (count > rule.answerAny) violations.push({id: rule.id, reason: `Select no more than ${rule.answerAny} for ${rule.label}.`});
    }
    return {valid: violations.length === 0, violations};
  }

  function constraintFor(rules, questionId) {
    return (rules?.constraints || []).find(rule => rule.questionIds?.includes(questionId)) || null;
  }

  function status(rules, selectedIds) {
    const selected = new Set(uniqueIds(selectedIds));
    return (rules?.constraints || []).map(rule => ({
      ...rule,
      selectedCount: rule.questionIds.filter(id => selected.has(id)).length,
      remaining: Math.max(0, rule.answerAny - rule.questionIds.filter(id => selected.has(id)).length)
    }));
  }

  globalThis.QuizPaperRules = {build, validate, constraintFor, status};
})();
