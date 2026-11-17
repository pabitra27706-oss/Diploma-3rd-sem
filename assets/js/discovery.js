/* Search only derived shards. User/query/source text is never inserted as HTML. */
(() => {
  'use strict';
  const scriptEl = document.currentScript;
  const base = new URL('../../', scriptEl ? scriptEl.src : location.href);
  const CODE_PATTERN = /\b(?:CST2\d{2}|SI201)\b/gi;
  const GROUP_META = [
    ['pyq', 'Previous Year Questions'],
    ['quiz', 'Quiz Bank'],
    ['unit', 'Unit Notes'],
    ['page', 'Pages & Guides'],
    ['note', 'My Notes']
  ];
  const VALID_TYPES = new Set(GROUP_META.map(entry => entry[0]));

  const fold = value => String(value)
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}_\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function labelFor(code) {
    if (!code) return '';
    if (typeof window.subjectLabel === 'function') return window.subjectLabel(code);
    return 'Subject';
  }

  function scrubCodes(text) {
    return String(text || '').replace(CODE_PATTERN, match => labelFor(match.toUpperCase()));
  }

  function link(row) {
    if (row.url) {
      const url = new URL(row.url, base);
      if (url.origin === base.origin && url.pathname.startsWith(base.pathname)) return url.href;
      return new URL('settings.html', base).href;
    }
    if (row.type === 'pyq') {
      const params = row.paperId
        ? new URLSearchParams({ paper: row.paperId, q: row.id })
        : new URLSearchParams({ subject: row.subject, paper: row.paper, q: row.id });
      return new URL('pyq/answers.html?' + params.toString(), base).href;
    }
    return new URL('quiz/setup.html?' + new URLSearchParams({ subject: row.subject, unit: row.unit }).toString(), base).href;
  }

  function node(tag, text, parent, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    if (parent) parent.append(el);
    return el;
  }

  async function json(path) {
    const r = await fetch(new URL(path, base));
    if (!r.ok) throw Error(`Cannot load ${path}. Reconnect and retry.`);
    return r.json();
  }

  const cache = new Map();
  function shard(subject, meta) {
    const key = subject + ':' + meta.sha256;
    if (!cache.has(key)) {
      cache.set(
        key,
        json('assets/search/' + meta.file + '?v=' + meta.sha256)
          .then(rows => rows.map(row => ({ ...row, subject })))
          .catch(e => { cache.delete(key); throw e; })
      );
    }
    return cache.get(key);
  }

  function pageShard(meta) {
    if (!meta || !meta.file) return Promise.resolve([]);
    const key = 'pages:' + meta.sha256;
    if (!cache.has(key)) {
      cache.set(
        key,
        json('assets/search/' + meta.file + '?v=' + meta.sha256)
          .catch(e => { cache.delete(key); throw e; })
      );
    }
    return cache.get(key);
  }

  let warmRequested = false;
  function requestSearchWarm() {
    if (warmRequested) return;
    const ctrl = typeof navigator !== 'undefined' && navigator.serviceWorker && navigator.serviceWorker.controller;
    if (!ctrl || typeof ctrl.postMessage !== 'function') return;
    warmRequested = true;
    try { ctrl.postMessage({ type: 'WARM_SEARCH' }); } catch {}
  }

  function formatMarks(marks) {
    if (marks === undefined || marks === null || marks === '') return '—';
    const n = Number(marks);
    return n === 1 ? '1 mark' : `${marks} marks`;
  }

  function rowMetaText(row) {
    if (row.type === 'pyq') {
      const parts = [
        labelFor(row.subject),
        `stored unit ${row.unit ?? 'unlisted'}`,
        [row.month, row.year].filter(Boolean).join(' ') || 'archived',
        row.paper || '',
        formatMarks(row.marks)
      ].filter(Boolean);
      if (row.topic && !row.genericTopic) parts.push(scrubCodes(row.topic));
      return parts.join(' · ');
    }
    if (row.type === 'quiz') {
      const parts = [
        labelFor(row.subject),
        `stored unit ${row.unit ?? 'unlisted'}`,
        row.year ? String(row.year) : 'quiz bank',
        formatMarks(row.marks)
      ];
      if (row.topic && !row.genericTopic) parts.push(scrubCodes(row.topic));
      return parts.join(' · ');
    }
    if (row.type === 'unit') {
      const unitPart = row.supplementary ? 'supplementary notes' : `Unit ${row.unit}`;
      const anchorPart = row.noAnchor ? 'page overview' : 'section deep link';
      return `${labelFor(row.subject)} · ${unitPart} · ${anchorPart}`;
    }
    if (row.type === 'page') {
      const parts = [];
      if (row.subject) parts.push(labelFor(row.subject));
      else if (row.relatedSubject) parts.push(labelFor(row.relatedSubject));
      parts.push(row.category || 'Guide & reference');
      parts.push(row.noAnchor ? 'page link' : 'section link');
      return parts.join(' · ');
    }
    return `${labelFor(row.subject)} · Unit ${row.unit} · Private note on this device`;
  }

  function updateScopeNote(manifest) {
    const el = document.querySelector('#search-scope');
    const sc = manifest && manifest.scope;
    if (!el || !sc) return;
    const missingQuiz = (sc.missingQuizSubjects || []).map(labelFor).join(', ');
    const excludedCount = Object.values(sc.excludedPages || {}).reduce((sum, list) => sum + list.length, 0);
    const quizNote = missingQuiz ? ` (${missingQuiz} has no quiz bank yet)` : '';
    el.textContent =
      `Indexes ${sc.pyqQuestions} archived PYQ stems/topics across ${sc.papers} papers, ` +
      `${sc.quizQuestions} quiz-bank stems/topics${quizNote}, headings from ${sc.unitPages} unit note pages, ` +
      `${sc.infoAndHubPages} subject-hub, practical-lab, internship, coverage, study-tool and policy pages ` +
      `(${sc.indexedHtmlPages} of ${sc.shippedHtmlPages} shipped HTML pages), plus private section notes saved on this device. ` +
      `Deliberately not indexed: full answer/option/body prose and ${excludedCount} remaining pages ` +
      `(${(sc.excludedPages?.dynamicShells || []).length} dynamic app shells whose questions or local attempts live in their own views, ` +
      `${(sc.excludedPages?.placeholders || []).length} held Coming Soon placeholders, and ` +
      `${(sc.excludedPages?.fallbacks || []).length} fallback pages: 404 and offline). ` +
      `Stored unit tags may differ from the current syllabus; offline search works after one online load.`;
  }

  function search() {
    const input = document.querySelector('#query');
    const subject = document.querySelector('#subject');
    const unit = document.querySelector('#unit');
    const typeSelect = document.querySelector('#type');
    const activeBar = document.querySelector('#search-active-filters');
    const results = document.querySelector('#search-results');
    const status = document.querySelector('#search-status');
    let manifest = null;
    let activeTopic = '';
    let run = 0;
    let timer;

    function syncUrl(q, sub, u, tp, topic) {
      const url = new URL(location.href);
      const entries = { q, subject: sub, unit: u, type: tp, topic };
      for (const [key, value] of Object.entries(entries)) {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      }
      if (url.href !== location.href) history.pushState(null, '', url);
    }

    function renderActiveFilters(q, sub, u, tp, topic) {
      if (!activeBar) return;
      activeBar.replaceChildren();
      if (!topic) {
        activeBar.hidden = true;
        return;
      }
      activeBar.hidden = false;
      node('span', `Topic filter: ${scrubCodes(topic)}`, activeBar);
      const clearTopic = node('button', 'Clear topic filter', activeBar, 'topic-chip');
      clearTopic.type = 'button';
      clearTopic.onclick = () => {
        activeTopic = '';
        render(true);
      };
    }

    async function render(push = false) {
      const ticket = ++run;
      const q = input.value;
      const sub = subject.value;
      const u = unit.value;
      const tp = typeSelect ? (VALID_TYPES.has(typeSelect.value) ? typeSelect.value : '') : '';
      const topic = activeTopic;

      if (push) syncUrl(q, sub, u, tp, topic);
      renderActiveFilters(q, sub, u, tp, topic);

      status.textContent = 'Loading search index…';
      try {
        manifest ||= await json('assets/search/manifest.json');
        updateScopeNote(manifest);
        requestSearchWarm();

        if (subject.options.length === 1) {
          for (const code of Object.keys(manifest.subjects)) {
            subject.add(new Option(labelFor(code), code));
          }
        }
        if (sub && !manifest.subjects[sub]) {
          subject.value = '';
          throw Error('Unknown subject filter. Choose one of the listed subjects.');
        }
        subject.value = sub;

        const terms = fold(q).split(' ').filter(Boolean);
        const hasFilter = Boolean(terms.length || u || tp || topic || sub);
        if (ticket !== run) return;

        if (!terms.length && !u && !tp && !topic) {
          results.replaceChildren();
          const subHint = sub ? ` in ${labelFor(sub)}` : '';
          status.textContent = `Type a keyword${subHint}, or choose a unit or content type to browse. Shortcuts: / or Ctrl+K to focus, Up/Down arrows to move, Enter to open, Esc to clear.`;
          return;
        }

        const codes = sub ? [sub] : Object.keys(manifest.subjects);
        const needSubjectShards = !tp || tp === 'pyq' || tp === 'quiz' || tp === 'unit';
        const needPageShard = (!tp || tp === 'page') && !u && !topic && Boolean(manifest.pages);
        const needLocalNotes = (!tp || tp === 'note') && !topic;

        const [subjectChunks, pageRows] = await Promise.all([
          needSubjectShards ? Promise.all(codes.map(code => shard(code, manifest.subjects[code]))) : Promise.resolve([]),
          needPageShard ? pageShard(manifest.pages) : Promise.resolve([])
        ]);

        if (ticket !== run) return;

        const rows = subjectChunks.flat();
        if (needPageShard) {
          for (const prow of pageRows) {
            if (!sub || prow.subject === sub || prow.relatedSubject === sub) {
              rows.push(prow);
            }
          }
        }
        if (needLocalNotes && typeof StudyStorage !== 'undefined' && StudyStorage.keys) {
          for (const key of StudyStorage.keys('section-note:')) {
            const note = StudyStorage.get(key);
            const match = key.match(/section-note:(CST\d+)\/units\/unit-(\d+)/);
            if (note?.text && match && (!sub || match[1] === sub)) {
              const safeTitle = scrubCodes(note.title || 'Untitled');
              rows.push({
                id: key,
                type: 'note',
                subject: match[1],
                unit: Number(match[2]),
                title: 'Private note: ' + safeTitle,
                text: fold(note.text + ' ' + safeTitle),
                url: note.url
              });
            }
          }
        }

        const start = performance.now();
        const topicFold = topic ? fold(topic) : '';
        const hits = rows.filter(row => {
          if (tp && row.type !== tp) return false;
          if (u && String(row.unit) !== u) return false;
          if (topicFold && fold(row.topic || '') !== topicFold) return false;
          return terms.every(term => row.text.includes(term));
        });

        results.replaceChildren();
        const shown = hits.slice(0, 100);
        for (const [typeKey, heading] of GROUP_META) {
          const group = shown.filter(row => row.type === typeKey);
          if (!group.length) continue;
          const totalInGroup = hits.filter(row => row.type === typeKey).length;
          const section = node('section', undefined, results);
          section.dataset.group = typeKey;
          node('h2', `${heading} (${totalInGroup})`, section);
          for (const row of group) {
            const article = node('article', undefined, section);
            const a = node('a', scrubCodes(row.title), article);
            a.href = link(row);
            node('small', rowMetaText(row), article);
          }
        }

        if (!hits.length) {
          const topics = [...new Set(
            rows.filter(r => r.topic && !r.genericTopic).map(r => r.topic)
          )].slice(0, 8);
          node(
            'p',
            'No matching items found. Try a shorter or broader keyword, or clear a filter above.',
            results
          );
          if (topics.length) {
            const wrap = node('div', undefined, results);
            node('p', 'Nearest topics in scope:', wrap);
            const list = node('ul', undefined, wrap, 'chip-list');
            for (const t of topics) {
              const li = node('li', undefined, list);
              const btn = node('button', scrubCodes(t), li, 'topic-chip');
              btn.type = 'button';
              btn.onclick = () => {
                input.value = t;
                activeTopic = '';
                render(true);
              };
            }
          }
        }

        const elapsed = Math.round(performance.now() - start);
        if (hasFilter) {
          status.textContent = `${hits.length} matches; showing ${shown.length}. Local filtering and rendering: ${elapsed} ms.`;
        }
      } catch (error) {
        if (ticket === run) {
          results.replaceChildren();
          status.textContent = error.message;
          const retry = node('button', 'Retry', results);
          retry.type = 'button';
          retry.onclick = () => render();
        }
      }
    }

    function restore() {
      clearTimeout(timer);
      const p = new URLSearchParams(location.search);
      input.value = p.get('q') || '';
      const rawSub = p.get('subject') || '';
      if (rawSub && ![...subject.options].some(o => o.value === rawSub)) {
        const tempLabel = /^CST2\d{2}$/.test(rawSub) ? labelFor(rawSub) : 'Unknown subject';
        const opt = new Option(tempLabel, rawSub);
        opt.dataset.temp = '1';
        subject.add(opt);
      }
      subject.value = rawSub;
      unit.value = p.get('unit') || '';
      if (typeSelect) {
        const rawType = p.get('type') || '';
        typeSelect.value = VALID_TYPES.has(rawType) ? rawType : '';
      }
      activeTopic = p.get('topic') || '';
      render(false).then(() => {
        if (manifest) {
          [...subject.options].forEach(o => {
            if (o.dataset.temp === '1' && !manifest.subjects[o.value]) o.remove();
          });
        }
      });
    }

    document.querySelector('#search-form').onsubmit = e => {
      e.preventDefault();
      clearTimeout(timer);
      render(true);
    };
    input.oninput = () => {
      clearTimeout(timer);
      timer = setTimeout(() => render(true), 120);
    };
    subject.onchange = () => { clearTimeout(timer); render(true); };
    unit.onchange = () => { clearTimeout(timer); render(true); };
    if (typeSelect) typeSelect.onchange = () => { clearTimeout(timer); render(true); };
    window.addEventListener('popstate', restore);

    document.addEventListener('keydown', e => {
      const active = document.activeElement;
      const inControl = active && /INPUT|TEXTAREA|SELECT/.test(active.tagName);
      if ((e.key === '/' && !inControl && !e.ctrlKey && !e.metaKey && !e.altKey) ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        input.focus();
        if (typeof input.select === 'function') input.select();
        return;
      }
      const links = [...results.querySelectorAll('a')];
      const idx = links.indexOf(active);
      if (e.key === 'Escape' && (active === input || idx >= 0)) {
        e.preventDefault();
        clearTimeout(timer);
        if (input.value || activeTopic) {
          input.value = '';
          activeTopic = '';
          render(true);
        }
        input.focus();
        return;
      }
      if (e.key === 'ArrowDown' && (active === input || idx >= 0) && links.length) {
        e.preventDefault();
        const nextIdx = active === input ? 0 : Math.min(idx + 1, links.length - 1);
        links[nextIdx]?.focus();
        return;
      }
      if (e.key === 'ArrowUp' && idx >= 0) {
        e.preventDefault();
        (idx > 0 ? links[idx - 1] : input).focus();
        return;
      }
      if (e.key === 'Home' && idx >= 0 && links.length) {
        e.preventDefault();
        links[0]?.focus();
        return;
      }
      if (e.key === 'End' && idx >= 0 && links.length) {
        e.preventDefault();
        links[links.length - 1]?.focus();
      }
    });

    restore();
  }

  function formatAppearanceChip(row, index, allAppearances) {
    const session = [row.month, row.year].filter(Boolean).join(' ') || 'Archived paper';
    const parts = [session];
    if (row.paper) parts.push(row.paper);
    if (row.sourceNumber) {
      parts.push(`Source ${row.sourceNumber}`);
    } else {
      const samePaper = allAppearances.filter(other => other.paper === row.paper && other.year === row.year && other.month === row.month);
      if (samePaper.length > 1) {
        const pos = samePaper.indexOf(row) + 1;
        parts.push(`entry ${pos}`);
      }
    }
    if (row.marks !== undefined && row.marks !== null) parts.push(formatMarks(row.marks));
    return parts.join(' · ');
  }

  function repeated() {
    const status = document.querySelector('#repeat-status');
    const out = document.querySelector('#repeat-results');
    const filterForm = document.querySelector('#repeat-filter-form');
    const subSelect = document.querySelector('#repeat-subject');
    let data = null;

    async function loadData() {
      if (data) return data;
      try {
        const manifest = await json('assets/search/manifest.json');
        const repMeta = manifest && manifest.repeated;
        if (repMeta && repMeta.file && repMeta.sha256) {
          data = await json('assets/search/' + repMeta.file + '?v=' + repMeta.sha256);
          return data;
        }
      } catch {}
      data = await json('assets/search/repeated.json');
      return data;
    }

    function renderRepeated(selectedSub) {
      out.replaceChildren();
      const subjectCounts = data.candidateSubjectCounts || {};
      const subjectCodes = Object.keys(subjectCounts);
      const validSub = selectedSub && subjectCounts[selectedSub] ? selectedSub : '';
      if (subSelect) subSelect.value = validSub;

      const exactGroups = (data.groups || []).filter(g => !validSub || g.canonical.subject === validSub);
      const candidateClusters = (data.candidates || []).filter(c => !validSub || c.subject === validSub);
      const candidateRecordTotal = candidateClusters.reduce((sum, c) => sum + (c.appearances?.length || 0), 0);
      const paperTotal = data.paperCount || 28;
      const scopeLabel = validSub
        ? `Showing ${labelFor(validSub)} (${subjectCounts[validSub].rawQuestions} archived questions across ${subjectCounts[validSub].paperCount} papers): `
        : `Across ${data.rawCount} archived questions in ${paperTotal} papers: `;

      status.textContent =
        `${scopeLabel}${exactGroups.length} exact-content alias ${exactGroups.length === 1 ? 'group' : 'groups'} ` +
        `and ${candidateClusters.length} normalized-text candidate ${candidateClusters.length === 1 ? 'cluster' : 'clusters'} ` +
        `(${candidateRecordTotal} appearances — unverified candidates, not confirmed duplicates). ` +
        `Counts describe this archive only, not exam predictions.`;

      // 1. Per-subject summary table/list with archive sample sizes
      const summarySec = node('section', undefined, out, 'panel');
      summarySec.id = 'repeat-subject-summary';
      node('h2', 'Per-subject summary (archive sample, not prediction)', summarySec);
      node(
        'p',
        'Candidate clusters match case-folded, whitespace-normalized stems within one subject and are unverified candidates, not confirmed duplicates.',
        summarySec
      );
      const sumList = node('ul', undefined, summarySec);
      for (const code of subjectCodes) {
        if (validSub && code !== validSub) continue;
        const sc = subjectCounts[code];
        const li = node('li', undefined, sumList);
        li.dataset.subject = code;
        const cWord = sc.clusters === 1 ? 'unverified candidate cluster' : 'unverified candidate clusters';
        const eWord = sc.exactGroups === 1 ? '1 exact-content alias group' : `${sc.exactGroups} exact-content alias groups`;
        li.textContent =
          `${labelFor(code)}: ${sc.clusters} ${cWord} (${sc.records} appearances) · ` +
          `${eWord} · sample: ${sc.rawQuestions} archived questions in ${sc.paperCount} papers`;
      }

      // Stored-unit breakdown (from candidate clusters + exact aliases) with sample note
      const unitMap = new Map();
      for (const cluster of candidateClusters) {
        const u = cluster.canonical.unit ?? 'unlisted';
        const key = `${labelFor(cluster.subject)} · stored unit ${u}`;
        unitMap.set(key, (unitMap.get(key) || 0) + cluster.appearances.length);
      }
      if (unitMap.size) {
        node('h3', 'Candidate appearances by stored unit (unverified)', summarySec);
        const unitList = node('ul', undefined, summarySec);
        for (const [k, count] of [...unitMap.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
          node('li', `${k}: ${count} candidate appearances`, unitList);
        }
      }

      // 2. Exact-content aliases section
      const exactSec = node('section', undefined, out);
      exactSec.id = 'exact-repeats';
      node(
        'h2',
        `Exact-content aliases (${exactGroups.length} ${exactGroups.length === 1 ? 'group' : 'groups'})`,
        exactSec
      );
      node('p', data.method, exactSec);
      if (!exactGroups.length) {
        node('p', `No exact-content aliases in ${validSub ? labelFor(validSub) : 'this selection'}.`, exactSec);
      } else {
        for (const group of exactGroups) {
          const q = group.canonical;
          const article = node('article', undefined, exactSec, 'repeat-exact');
          node('span', 'Exact-content alias (identical stem, options, key, answer, marks and stored unit)', article, 'exact-badge');
          const headingP = node('div', undefined, article);
          const a = node('a', scrubCodes(q.title), headingP);
          a.href = link(q);
          node(
            'small',
            `${labelFor(q.subject)} · stored unit ${q.unit ?? 'unlisted'} · ${group.appearances.length} appearances`,
            article
          );
          const links = node('ul', undefined, article, 'chip-list');
          group.appearances.forEach((row, idx) => {
            const li = node('li', undefined, links);
            const chip = node('a', formatAppearanceChip(row, idx, group.appearances), li);
            chip.href = link(row);
          });
        }
      }

      // 3. Normalized-text candidate clusters (unverified)
      const candSec = node('section', undefined, out);
      candSec.id = 'candidate-repeats';
      node(
        'h2',
        `Normalized-text candidate clusters (${candidateClusters.length} ${candidateClusters.length === 1 ? 'cluster' : 'clusters'}, ${candidateRecordTotal} appearances — unverified)`,
        candSec
      );
      node(
        'p',
        data.candidateMethod || 'Case-folded, whitespace-normalized stem matches within the same subject. Each cluster below is an unverified candidate, not a confirmed duplicate.',
        candSec
      );

      const groupedBySub = new Map();
      for (const cluster of candidateClusters) {
        if (!groupedBySub.has(cluster.subject)) groupedBySub.set(cluster.subject, []);
        groupedBySub.get(cluster.subject).push(cluster);
      }

      for (const [code, clusters] of groupedBySub.entries()) {
        const subGroup = node('div', undefined, candSec);
        subGroup.dataset.subjectGroup = code;
        const recCount = clusters.reduce((s, c) => s + c.appearances.length, 0);
        node(
          'h3',
          `${labelFor(code)} — ${clusters.length} unverified candidate ${clusters.length === 1 ? 'cluster' : 'clusters'} (${recCount} appearances)`,
          subGroup
        );
        for (const cluster of clusters) {
          const q = cluster.canonical;
          const article = node('article', undefined, subGroup, 'repeat-candidate');
          node('span', 'Unverified candidate, not a confirmed duplicate', article, 'candidate-badge');
          const headingP = node('div', undefined, article);
          const a = node('a', scrubCodes(q.title), headingP);
          a.href = link(q);
          const diffNote = cluster.exactAlias
            ? 'Normalized stem match; this pair also meets the exact-content alias rule listed above'
            : (cluster.differsIn && cluster.differsIn.length
              ? `Differs across appearances in: ${cluster.differsIn.join(', ')}`
              : 'Differs in paper/session metadata; manual source review pending');
          node(
            'small',
            `${labelFor(cluster.subject)} · stored unit ${q.unit ?? 'unlisted'} · ${cluster.appearances.length} appearances · ${diffNote}`,
            article
          );
          const links = node('ul', undefined, article, 'chip-list');
          cluster.appearances.forEach((row, idx) => {
            const li = node('li', undefined, links);
            const chip = node('a', formatAppearanceChip(row, idx, cluster.appearances), li);
            chip.href = link(row);
          });
        }
      }
    }

    async function init(push = false) {
      try {
        await loadData();
        if (subSelect && subSelect.options.length === 1) {
          for (const code of Object.keys(data.candidateSubjectCounts || {})) {
            subSelect.add(new Option(labelFor(code), code));
          }
        }
        const selected = push
          ? (subSelect ? subSelect.value : '')
          : (new URLSearchParams(location.search).get('subject') || '');
        if (push) {
          const url = new URL(location.href);
          if (selected) url.searchParams.set('subject', selected);
          else url.searchParams.delete('subject');
          if (url.href !== location.href) history.pushState(null, '', url);
        }
        renderRepeated(selected);
      } catch (error) {
        out.replaceChildren();
        status.textContent = error.message;
        const retry = node('button', 'Retry', out);
        retry.type = 'button';
        retry.onclick = () => init(false);
      }
    }

    if (filterForm) {
      filterForm.onsubmit = e => { e.preventDefault(); init(true); };
    }
    if (subSelect) {
      subSelect.onchange = () => init(true);
    }
    window.addEventListener('popstate', () => init(false));
    init(false);
  }

  if (document.querySelector('#search-form')) search();
  if (document.querySelector('#repeat-results')) repeated();
})();
