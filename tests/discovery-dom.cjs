/* Deterministic zero-dependency Node regression suite for Phase 4 Discovery:
   - XSS-safe query & repeated rendering (textContent-only, zero HTML sinks)
   - Keyboard completeness (/, Ctrl/Cmd+K, ArrowDown/Up, Home/End, Escape), 120ms debounce, URL/popstate, error/retry
   - Repeated-question explorer: 1 exact alias group + 15 unverified candidate clusters (32 records), badges, subject filter
   - subjectLabel() display discipline: zero raw CST20x/SI201 codes or raw question IDs in visible text; real IDs kept in URLs
   - Deep-link resolution + navigator.share / clipboard / selectable-input fallbacks across PYQ Answers, Practice, and Quiz Review/Result
   - Unit breadcrumbs, authored #section anchors, prev/next unit nav, subject-hub counts/jump list, and filtered-PYQ URL handoff
   - Service worker offline cache registration, WARM_SEARCH shard warming, and query-string navigation fallback
*/
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { ROOT, createMiniDom, createRepoFetch, runScriptIn, flush } = require('./lib/minidom.cjs');

const RAW_CODE_RE = /\b(?:CST\d{3}|SI201)\b/;
const RAW_QID_RE = /\bCST\d{3}-(?:P\d{3}-|U\d+-)?Q\d+\b/;
(async () => {
  const BASE = 'https://example.test/Diploma-3rd-sem/';

  /* ── 1. Static XSS-sink audit on discovery & unit-discovery ── */
  for (const rel of ['assets/js/discovery.js', 'assets/js/unit-discovery.js', 'assets/js/subject-labels.js']) {
    const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    assert(!/\.(?:innerHTML|outerHTML)\s*=/.test(src), `${rel} must never assign innerHTML/outerHTML`);
    assert(!/insertAdjacentHTML|document\.write/.test(src), `${rel} must never insert raw HTML`);
  }
  console.log('PASS zero HTML injection sinks across discovery.js, unit-discovery.js, and subject-labels.js');

  /* ── 2. subjectLabel() + StudyShare (share -> clipboard -> input fallbacks) ── */
  {
    const { win, doc } = createMiniDom(BASE + 'pyq/answers.html?paper=CST201-P001-2021-03&q=CST201-P001-Q1');
    runScriptIn(win, 'assets/js/subject-labels.js');

    assert.equal(win.subjectLabel('CST201'), 'C');
    assert.equal(win.subjectLabel('CST203'), 'Python');
    assert.equal(win.subjectLabel('CST205'), 'DS');
    assert.equal(win.subjectLabel('CST207'), 'CSO');
    assert.equal(win.subjectLabel('CST209'), 'Algorithms');
    assert.equal(win.subjectLabel('CST211'), 'C Lab');
    assert.equal(win.subjectLabel('CST213'), 'Python Lab');
    assert.equal(win.subjectLabel('CST215'), 'DS Lab');
    assert.equal(win.subjectLabel('SI201'), 'Internship');
    assert.equal(win.subjectLabel('CST999'), 'Subject');

    const box = doc.createElement('div');
    const copyBtn = doc.createElement('button');
    copyBtn.textContent = 'Copy question link';
    const shareBtn = doc.createElement('button');
    shareBtn.textContent = 'Share question';
    const status = doc.createElement('span');
    box.append(copyBtn, shareBtn, status);
    doc.body.appendChild(box);

    const canonUrl = BASE + 'pyq/answers.html?paper=CST201-P001-2021-03&q=CST201-P001-Q1';
    const payload = { title: 'C · Q1 (March 2021)', text: 'C (March 2021): Header file question', url: canonUrl };

    // Case A: navigator.share succeeds with exact deterministic payload
    let sharedPayload = null;
    win.navigator.share = async data => { sharedPayload = data; };
    const rShare = await win.StudyShare.share(payload, { button: shareBtn, copyButton: copyBtn, container: box, statusEl: status });
    assert.equal(rShare.method, 'share');
    assert.deepEqual({ ...sharedPayload }, payload);
    assert(!RAW_CODE_RE.test(sharedPayload.title) && !RAW_CODE_RE.test(sharedPayload.text));
    assert(sharedPayload.url.includes('CST201-P001-2021-03') && sharedPayload.url.includes('q=CST201-P001-Q1'));

    // Case B: navigator.share throws AbortError -> does NOT overwrite clipboard
    let copiedUrl = null;
    win.navigator.clipboard = { writeText: async text => { copiedUrl = text; } };
    win.navigator.share = async () => { const e = new Error('cancel'); e.name = 'AbortError'; throw e; };
    const rAbort = await win.StudyShare.share(payload, { button: shareBtn, copyButton: copyBtn, container: box, statusEl: status });
    assert.equal(rAbort.method, 'aborted');
    assert.equal(copiedUrl, null);

    // Case C: navigator.share unavailable -> falls back to clipboard.writeText
    delete win.navigator.share;
    const rClip = await win.StudyShare.share(payload, { button: shareBtn, copyButton: copyBtn, container: box, statusEl: status });
    assert.equal(rClip.method, 'clipboard');
    assert.equal(copiedUrl, canonUrl);
    assert.equal(copyBtn.textContent, 'Link copied');

    // Case D: both navigator.share and clipboard reject -> selectable readonly input fallback
    win.navigator.clipboard = { writeText: async () => { throw new Error('denied'); } };
    const rInput = await win.StudyShare.share(payload, { button: shareBtn, copyButton: copyBtn, container: box, statusEl: status });
    assert.equal(rInput.method, 'input');
    const fallbackField = box.querySelector('.share-fallback-input');
    assert(fallbackField, 'Expected selectable fallback input when share & clipboard fail');
    assert.equal(fallbackField.value, canonUrl);
    assert.equal(fallbackField._selected, true);
    assert(status.textContent.toLowerCase().includes('copy'));

    // Highlight helper sets focus ring, data-deeplink, and scrolls into view
    const card = doc.createElement('article');
    doc.body.appendChild(card);
    win.StudyShare.highlight(card);
    assert.equal(card.tabIndex, -1);
    assert(card.classList.contains('is-deeplink-target'));
    assert.equal(card.getAttribute('data-deeplink'), 'active');
    assert.equal(card._scrolled, true);
  }
  console.log('PASS subjectLabel() discipline and StudyShare share -> clipboard -> input fallbacks');

  /* ── 3. Live Search UI: dijkstra, info pages, XSS, keyboard, debounce, popstate, retry ── */
  {
    const { win, doc } = createMiniDom(BASE + 'search.html?q=dijkstra');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    win.StudyStorage = {
      keys: () => ['section-note:CST209/units/unit-4.html#section-2'],
      get: () => ({
        title: 'CST209 Dijkstra note',
        text: 'Dijkstra greedy priority queue <img src=x onerror=alert(1)>',
        url: 'subjects/CST209/units/unit-4.html#section-2'
      })
    };

    const main = doc.createElement('main');
    const scopeEl = doc.createElement('p'); scopeEl.id = 'search-scope';
    const form = doc.createElement('form'); form.id = 'search-form';
    const query = doc.createElement('input'); query.id = 'query';
    const subSel = doc.createElement('select'); subSel.id = 'subject'; subSel.add(new win.Option('All subjects', ''));
    const unitSel = doc.createElement('select'); unitSel.id = 'unit'; unitSel.add(new win.Option('All units', ''));
    const typeSel = doc.createElement('select'); typeSel.id = 'type';
    [['', 'All'], ['pyq', 'PYQ'], ['quiz', 'Quiz'], ['unit', 'Unit'], ['page', 'Page'], ['note', 'Note']]
      .forEach(([v, l]) => typeSel.add(new win.Option(l, v)));
    form.append(query, subSel, unitSel, typeSel);
    const activeFilters = doc.createElement('div'); activeFilters.id = 'search-active-filters';
    const status = doc.createElement('p'); status.id = 'search-status';
    const results = doc.createElement('div'); results.id = 'search-results';
    main.append(scopeEl, form, activeFilters, status, results);
    doc.body.appendChild(main);

    runScriptIn(win, 'assets/js/subject-labels.js', BASE + 'assets/js/subject-labels.js');
    runScriptIn(win, 'assets/js/discovery.js', BASE + 'assets/js/discovery.js');
    await flush();

    // Dijkstra hits PYQs, quiz, unit notes (#anchor), and local note
    assert(status.textContent.includes('matches; showing'));
    const groups = results.querySelectorAll('section').map(s => s.dataset.group);
    assert(groups.includes('pyq') && groups.includes('quiz') && groups.includes('unit') && groups.includes('note'));
    const unitLinks = results.querySelectorAll('section[data-group="unit"] a').map(a => a.href);
    assert(unitLinks.some(h => h.includes('subjects/CST209/units/unit-4.html#')), 'Expected #section anchor on unit hit');
    const pyqLinks = results.querySelectorAll('section[data-group="pyq"] a').map(a => a.href);
    assert(pyqLinks.every(h => h.includes('/Diploma-3rd-sem/pyq/answers.html?') && h.includes('q=CST209-')));

    // Visible text in scope, select options, status, and all results never prints raw CST20x/SI201 or raw QIDs
    assert(!RAW_CODE_RE.test(results.textContent), `Raw code leaked in search results: ${results.textContent}`);
    assert(!RAW_QID_RE.test(results.textContent), `Raw QID leaked in search results: ${results.textContent}`);
    assert(!RAW_CODE_RE.test(scopeEl.textContent), `Raw code leaked in scope disclosure: ${scopeEl.textContent}`);
    // Indexed/excluded page counts are derived from assets/search/manifest.json;
    // Phase 11 replaces the Suggestions placeholder and adds ten indexed guides.
    assert(scopeEl.textContent.includes('67 of 84') && scopeEl.textContent.includes('17'));
    assert.deepEqual(subSel.options.slice(1).map(o => o.textContent), ['C', 'Python', 'DS', 'CSO', 'Algorithms']);

    // Keyboard completeness: /, Ctrl+K, ArrowDown, ArrowUp, Home, End, Escape
    doc.body.focus();
    doc.dispatchEvent({ type: 'keydown', key: '/' });
    assert.equal(doc.activeElement, query, '/ must focus search input');
    doc.body.focus();
    doc.dispatchEvent({ type: 'keydown', key: 'k', ctrlKey: true });
    assert.equal(doc.activeElement, query, 'Ctrl+K must focus search input');
    assert.equal(query._selected, true);

    const allResultLinks = results.querySelectorAll('article a');
    assert(allResultLinks.length >= 3);
    doc.dispatchEvent({ type: 'keydown', key: 'ArrowDown' });
    assert.equal(doc.activeElement, allResultLinks[0], 'ArrowDown from input focuses first result');
    doc.dispatchEvent({ type: 'keydown', key: 'ArrowDown' });
    assert.equal(doc.activeElement, allResultLinks[1], 'ArrowDown advances to second result');
    doc.dispatchEvent({ type: 'keydown', key: 'End' });
    assert.equal(doc.activeElement, allResultLinks[allResultLinks.length - 1], 'End focuses last result');
    doc.dispatchEvent({ type: 'keydown', key: 'Home' });
    assert.equal(doc.activeElement, allResultLinks[0], 'Home focuses first result');
    doc.dispatchEvent({ type: 'keydown', key: 'ArrowUp' });
    assert.equal(doc.activeElement, query, 'ArrowUp on first result returns to search input');

    // XSS payload via live 120ms debounced input produces zero script/img elements
    query.value = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';
    query.dispatchEvent({ type: 'input' });
    await new Promise(resolve => setTimeout(resolve, 160));
    await flush();
    assert.equal(win.__xss, undefined);
    assert.equal(results.querySelectorAll('script').length, 0);
    assert.equal(results.querySelectorAll('img').length, 0);
    assert(status.textContent.startsWith('0 matches;'));
    assert(results.textContent.includes('No matching items found'));

    // Escape clears query and resets status to clean empty state
    query.focus();
    doc.dispatchEvent({ type: 'keydown', key: 'Escape' });
    await flush();
    assert.equal(query.value, '');
    assert.equal(results.querySelectorAll('article').length, 0);

    // Informational page search via popstate (back-button URL restore)
    win.setUrlAndPop(BASE + 'search.html?q=internship&type=page');
    await flush();
    const pageHits = results.querySelectorAll('section[data-group="page"] a');
    assert(pageHits.length >= 1);
    assert(pageHits.some(a => a.href.endsWith('/Diploma-3rd-sem/subjects/SI201/index.html')));
    assert(!RAW_CODE_RE.test(results.textContent));

    // Retry on network failure recovers cleanly
    const errDom = createMiniDom(BASE + 'search.html?q=arrays&subject=CST201');
    errDom.win.fetch = createRepoFetch('/Diploma-3rd-sem/', 'index-CST201.json');
    const f2 = errDom.doc.createElement('form'); f2.id = 'search-form';
    const q2 = errDom.doc.createElement('input'); q2.id = 'query';
    const s2 = errDom.doc.createElement('select'); s2.id = 'subject'; s2.add(new errDom.win.Option('All', ''));
    const u2 = errDom.doc.createElement('select'); u2.id = 'unit'; u2.add(new errDom.win.Option('All', ''));
    const t2 = errDom.doc.createElement('select'); t2.id = 'type'; t2.add(new errDom.win.Option('All', ''));
    const st2 = errDom.doc.createElement('p'); st2.id = 'search-status';
    const rs2 = errDom.doc.createElement('div'); rs2.id = 'search-results';
    f2.append(q2, s2, u2, t2);
    errDom.doc.body.append(f2, st2, rs2);
    runScriptIn(errDom.win, 'assets/js/subject-labels.js', BASE + 'assets/js/subject-labels.js');
    runScriptIn(errDom.win, 'assets/js/discovery.js', BASE + 'assets/js/discovery.js');
    await flush();
    const retryBtn = rs2.querySelector('button');
    assert(retryBtn && retryBtn.textContent === 'Retry', 'Expected Retry button on shard failure');
    retryBtn.click();
    await flush();
    assert(rs2.querySelectorAll('article a').length > 0, 'Retry must recover and render matches');
  }
  console.log('PASS search UI (dijkstra, info pages, XSS safety, keyboard nav, 120ms debounce, popstate, error/retry, zero raw CST20x)');

  /* ── 4. Repeated-question explorer: 1 exact + 15 unverified candidate clusters ── */
  {
    const { win, doc } = createMiniDom(BASE + 'repeated.html');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/');
    const form = doc.createElement('form'); form.id = 'repeat-filter-form';
    const sel = doc.createElement('select'); sel.id = 'repeat-subject'; sel.add(new win.Option('All subjects', ''));
    form.appendChild(sel);
    const status = doc.createElement('p'); status.id = 'repeat-status';
    const results = doc.createElement('div'); results.id = 'repeat-results';
    doc.body.append(form, status, results);

    runScriptIn(win, 'assets/js/subject-labels.js', BASE + 'assets/js/subject-labels.js');
    runScriptIn(win, 'assets/js/discovery.js', BASE + 'assets/js/discovery.js');
    await flush();

    assert(status.textContent.includes('1 exact-content alias group'));
    assert(status.textContent.includes('15 normalized-text candidate clusters (32 appearances — unverified candidates, not confirmed duplicates)'));
    assert.equal(results.querySelectorAll('article.repeat-exact').length, 1);
    const candCards = results.querySelectorAll('article.repeat-candidate');
    assert.equal(candCards.length, 15);
    candCards.forEach(card => {
      const badge = card.querySelector('.candidate-badge');
      assert(badge && badge.textContent === 'Unverified candidate, not a confirmed duplicate');
    });

    // Zero raw CST20x codes or raw question IDs in visible UI, while every link keeps real IDs
    assert(!RAW_CODE_RE.test(status.textContent), `Raw code in repeat status: ${status.textContent}`);
    assert(!RAW_CODE_RE.test(results.textContent), `Raw code in repeat results: ${results.textContent}`);
    assert(!RAW_QID_RE.test(results.textContent), `Raw QID in repeat results: ${results.textContent}`);
    const links = results.querySelectorAll('a');
    assert(links.length >= 1 + 2 + 15 + 32);
    links.forEach(a => {
      const u = new URL(a.href);
      assert.equal(u.pathname, '/Diploma-3rd-sem/pyq/answers.html');
      assert(RAW_QID_RE.test(u.searchParams.get('q') || ''), `Expected real question ID in URL: ${a.href}`);
    });

    // Subject filter switches cleanly to Algorithms (4 clusters, 9 appearances, 0 exact)
    sel.value = 'CST209';
    sel.dispatchEvent({ type: 'change' });
    await flush();
    assert(win.location.search.includes('subject=CST209'));
    assert.equal(results.querySelectorAll('article.repeat-exact').length, 0);
    assert.equal(results.querySelectorAll('article.repeat-candidate').length, 4);
    assert(status.textContent.includes('Showing Algorithms'));
  }
  console.log('PASS repeated explorer (1 exact alias + 15 unverified candidate clusters / 32 records, zero raw CST20x/QIDs)');

  /* ── 5. Deep-link & share verification across PYQ Answers, Practice, Quiz Review/Result ── */
  {
    const answersSrc = fs.readFileSync(path.join(ROOT, 'pyq/js/answers.js'), 'utf8');
    const practiceSrc = fs.readFileSync(path.join(ROOT, 'practice/js/session.js'), 'utf8');
    const reviewSrc = fs.readFileSync(path.join(ROOT, 'quiz/js/review.js'), 'utf8');
    const resultSrc = fs.readFileSync(path.join(ROOT, 'quiz/js/result.js'), 'utf8');

    for (const htmlRel of ['pyq/answers.html', 'practice/session.html', 'quiz/review.html', 'quiz/result.html', 'pyq/index.html']) {
      const html = fs.readFileSync(path.join(ROOT, htmlRel), 'utf8');
      assert(html.includes('assets/js/subject-labels.js'), `${htmlRel} must load subject-labels.js`);
    }

    // Verify canonical URL stability & multi-format query resolution matching pyq/js/answers.js
    function resolvePyqParams(search) {
      const p = new URLSearchParams(search);
      const paperParam = p.get('paper') || '';
      const qParam = p.get('q') || '';
      const qMatch = qParam.match(/^(CST\d{3})-(P\d{3})-Q\d+$/);
      const subjectCode = p.get('subject')
        || (/^CST\d{3}-/.test(paperParam) ? paperParam.split('-')[0] : null)
        || (qMatch ? qMatch[1] : null);
      const paperCode = paperParam.match(/(?:^|-)(P\d{3})(?:-|$)/)?.[1]
        || (paperParam || (qMatch ? qMatch[2] : ''));
      return { subjectCode, paperCode, paperParam, qParam };
    }

    assert.deepEqual(
      resolvePyqParams('?paper=CST201-P001-2021-03&q=CST201-P001-Q5'),
      { subjectCode: 'CST201', paperCode: 'P001', paperParam: 'CST201-P001-2021-03', qParam: 'CST201-P001-Q5' }
    );
    assert.deepEqual(
      resolvePyqParams('?subject=CST201&paper=P001&q=CST201-P001-Q5'),
      { subjectCode: 'CST201', paperCode: 'P001', paperParam: 'P001', qParam: 'CST201-P001-Q5' }
    );
    assert.deepEqual(
      resolvePyqParams('?q=CST209-P003-Q12'),
      { subjectCode: 'CST209', paperCode: 'P003', paperParam: '', qParam: 'CST209-P003-Q12' }
    );
    assert.deepEqual(
      resolvePyqParams('?paper=CST999-P099-2099-01&q=CST999-P099-Q1'),
      { subjectCode: 'CST999', paperCode: 'P099', paperParam: 'CST999-P099-2099-01', qParam: 'CST999-P099-Q1' }
    );

    // Verify canonical URL determinism and alias resolution against real practice-pool.json
    const pool = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/practice-pool.json'), 'utf8'));
    const buildCanonPyq = (paperStem, qid) => {
      const u = new URL('pyq/answers.html', BASE);
      u.search = new URLSearchParams({ paper: paperStem, q: qid }).toString();
      return u.href;
    };
    assert.equal(
      buildCanonPyq('CST201-P001-2021-03', 'CST201-P001-Q1'),
      buildCanonPyq('CST201-P001-2021-03', 'CST201-P001-Q1')
    );
    const aliasTarget = pool.aliases['CST203-P001-Q44'];
    assert.equal(aliasTarget, 'CST203-P001-Q43');
    const resolvedPracticeQ = pool.questions.find(item => item.id === aliasTarget);
    assert(resolvedPracticeQ && resolvedPracticeQ.subjectCode === 'CST203');
    assert.equal(pool.questions.find(item => item.id === 'CST201-P001-Q9999'), undefined);

    // Share/deep-link wiring remains on every surface. PYQ answer cards now
    // replace Copy with a direct unit/topic link; the other surfaces retain Copy.
    for (const [name, src] of [
      ['pyq/js/answers.js', answersSrc],
      ['practice/js/session.js', practiceSrc],
      ['quiz/js/review.js', reviewSrc],
      ['quiz/js/result.js', resultSrc]
    ]) {
      if (name === 'pyq/js/answers.js') {
        assert(src.includes('unit-topic-link') && src.includes('q.topic'), 'PYQ cards must link to their unit and question topic');
        assert(!src.includes('copy-question-link'), 'PYQ cards should replace the Copy action');
      } else {
        assert(src.includes('StudyShare.copy('), `${name} must use StudyShare.copy`);
      }
      assert(src.includes('StudyShare.share('), `${name} must use StudyShare.share`);
      assert(src.includes('StudyShare.highlight('), `${name} must highlight deep-link targets`);
      assert(src.includes('data-question-id'), `${name} must expose data-question-id for deep-link targeting`);
    }
    assert(answersSrc.includes('function canonicalQuestionUrl(q)'));
    assert(!answersSrc.includes('Practice ${subjectCode}'), 'PYQ title must not print raw subjectCode');
    assert(!answersSrc.includes('(${subjectCode})'), 'Print header must not print raw subjectCode');
    assert(!answersSrc.includes("document.title=q.id+'"), 'PYQ deep-link title must not print raw q.id');
    assert(!reviewSrc.includes("createElement('span', 'text-xs text-secondary', q.id)"), 'Quiz review footer must not print raw q.id');
    assert(reviewSrc.includes('this device') && resultSrc.includes('this device'), 'Quiz review/result must disclose device-local attempts');
    assert(practiceSrc.includes('function canonicalPracticeUrl(q)') && practiceSrc.includes('showDeepLinkNotice('));
  }
  console.log('PASS deep-link resolution, share/copy wiring, device-local disclosure, and label hygiene across PYQ/Practice/Quiz');

  /* ── 6. Unit discovery + Subject hub + Filtered-PYQ URL handoff ── */
  {
    // Unit page with #hash on a collapsed section (Algorithms Unit 4 #dijkstras-algorithm)
    const { win, doc } = createMiniDom(BASE + 'subjects/CST209/units/unit-4.html#dijkstras-algorithm');
    win.fetch = createRepoFetch('/Diploma-3rd-sem/', null, () => win.location.href);
    const main = doc.createElement('main'); main.id = 'study-main-content';
    const h1 = doc.createElement('h1'); h1.textContent = 'Unit 4: Graph Algorithms';
    const sec1 = doc.createElement('section'); sec1.id = 'graph-basics'; sec1.className = 'unit-section';
    const h2a = doc.createElement('h2'); h2a.id = 'section-1'; h2a.className = 'section-title'; h2a.textContent = '4.1 Graph Representation';
    sec1.appendChild(h2a);
    const sec2 = doc.createElement('section'); sec2.id = 'shortest-paths'; sec2.className = 'unit-section collapsed';
    const toggle = doc.createElement('button'); toggle.className = 'section-toggle'; toggle.setAttribute('aria-expanded', 'false');
    const h2b = doc.createElement('h2'); h2b.id = 'section-2'; h2b.className = 'section-title'; h2b.textContent = '4.2 Shortest Path Algorithms';
    const h3 = doc.createElement('h3'); h3.id = 'dijkstras-algorithm'; h3.textContent = "Dijkstra's Algorithm";
    sec2.append(toggle, h2b, h3);
    main.append(h1, sec1, sec2);
    doc.body.appendChild(main);

    runScriptIn(win, 'assets/js/subject-labels.js');
    runScriptIn(win, 'assets/js/unit-discovery.js');
    await flush();

    // Unanchored h1 recorded without fabricating ID; h2 uses <section id>, h3 uses authored id
    assert.equal(h1.id, '');
    assert.equal(h1.getAttribute('data-anchor-status'), 'page-top');
    assert.equal(h2a.querySelector('.section-anchor-link').getAttribute('href'), '#graph-basics');
    assert.equal(h2b.querySelector('.section-anchor-link').getAttribute('href'), '#shortest-paths');
    assert.equal(h3.querySelector('.section-anchor-link').getAttribute('href'), '#dijkstras-algorithm');
    assert(!sec2.classList.contains('collapsed'), '#hash arrival must expand collapsed section');
    assert.equal(toggle.getAttribute('aria-expanded'), 'true');

    // Breadcrumb Subject -> Unit -> Section updated to #dijkstras-algorithm
    const crumb = main.querySelector('.unit-breadcrumb');
    assert(crumb && crumb.textContent === "Algorithms→Unit 4→Dijkstra's Algorithm");

    // Unit discovery cross-links & Prev/Next boundary (CST209 official syllabus has 4 units)
    const box = main.querySelector('section.unit-discovery');
    assert(box && !RAW_CODE_RE.test(box.textContent) && !RAW_QID_RE.test(box.textContent));
    const boxHrefs = box.querySelectorAll('a').map(a => a.href);
    assert(boxHrefs.includes('../../../pyq/index.html?subject=CST209&unit=4'));
    assert(boxHrefs.some(h => h.startsWith('../../../pyq/index.html?subject=CST209&unit=4&topic=')));
    assert(boxHrefs.some(h => h.startsWith('../../../pyq/answers.html?subject=CST209&paper=') && h.includes('&q=CST209-')));
    const navText = box.querySelector('nav').textContent;
    assert(navText.includes('Previous: Unit 3') && navText.includes('All Algorithms units') && !navText.includes('Next: Unit 5'));

    // Verify every single shipped unit page Prev/Next link resolves to a real HTML file on disk
    for (const [code, lastSyllabusUnit] of [['CST201', 5], ['CST203', 5], ['CST205', 4], ['CST207', 5], ['CST209', 4]]) {
      const uDom = createMiniDom(`${BASE}subjects/${code}/units/unit-${lastSyllabusUnit}.html`);
      uDom.win.fetch = createRepoFetch('/Diploma-3rd-sem/', null, () => uDom.win.location.href);
      const uMain = uDom.doc.createElement('main');
      uDom.doc.body.appendChild(uMain);
      runScriptIn(uDom.win, 'assets/js/subject-labels.js');
      runScriptIn(uDom.win, 'assets/js/unit-discovery.js');
      await flush();
      const navLinks = uMain.querySelector('section.unit-discovery nav').querySelectorAll('a');
      navLinks.forEach(a => {
        const resolved = new URL(a.href, uDom.win.location.href);
        const rel = resolved.pathname.slice('/Diploma-3rd-sem/'.length);
        assert(fs.existsSync(path.join(ROOT, rel)), `Dead unit-nav link on ${code} U${lastSyllabusUnit}: ${rel}`);
      });
      assert(!navLinks.some(a => a.textContent.includes('Next: Unit')), `${code} U${lastSyllabusUnit} must not offer Next unit`);
    }

    // Subject hub: per-unit PYQ counts + jump list
    const hub = createMiniDom(BASE + 'subjects/CST209/index.html');
    hub.win.fetch = createRepoFetch('/Diploma-3rd-sem/', null, () => hub.win.location.href);
    const hubMain = hub.doc.createElement('main');
    hub.doc.body.appendChild(hubMain);
    runScriptIn(hub.win, 'assets/js/subject-labels.js');
    runScriptIn(hub.win, 'assets/js/unit-discovery.js');
    await flush();
    const jumpItems = hubMain.querySelectorAll('.hub-unit-jump-list li');
    assert.equal(jumpItems.length, 4);
    assert(!RAW_CODE_RE.test(hubMain.textContent));
    assert(hubMain.textContent.includes('PYQs') && hubMain.textContent.includes('Algorithms'));

    // Filtered-PYQ URL handoff on pyq/index.html?subject=CST209&unit=4 (+ XSS topic safety)
    const pyq = createMiniDom(BASE + 'pyq/index.html?subject=CST209&unit=4');
    pyq.win.fetch = createRepoFetch('/Diploma-3rd-sem/', null, () => pyq.win.location.href);
    pyq.win.StudyStorage = { legacy: { getItem: () => 'light', setItem: () => {} }, theme: () => 'light', setTheme: () => {} };
    const filterBar = pyq.doc.createElement('div');
    ['ALL', 'CST201', 'CST203', 'CST205', 'CST207', 'CST209'].forEach(code => {
      const b = pyq.doc.createElement('button');
      b.className = 'filter-btn';
      b.dataset.subject = code;
      filterBar.appendChild(b);
    });
    const panel = pyq.doc.createElement('section'); panel.id = 'filteredPyqPanel'; panel.className = 'hidden';
    const subjContainer = pyq.doc.createElement('div'); subjContainer.id = 'subjectsContainer';
    // Prevent renderSubjects innerHTML on paper cards from conflicting with our strict MiniNode guard
    Object.defineProperty(subjContainer, 'appendChild', { value: () => {} });
    const loading = pyq.doc.createElement('div'); loading.id = 'loadingState';
    const errEl = pyq.doc.createElement('div'); errEl.id = 'errorState';
    pyq.doc.body.append(filterBar, panel, loading, errEl, subjContainer);
    // Allow legacy paper-card template rendering in renderSubjects while panel stays 100% createElement/textContent
    Object.defineProperty(pyq.MiniNode.prototype, 'innerHTML', {
      set(_v) {
        assert.notEqual(this.id, 'filteredPyqPanel', 'filteredPyqPanel must never use innerHTML');
        const sh = pyq.doc.createElement('div');
        sh.className = 'subject-header';
        this.replaceChildren(sh);
      },
      configurable: true
    });
    runScriptIn(pyq.win, 'assets/js/subject-labels.js');
    runScriptIn(pyq.win, 'pyq/js/index.js');
    await flush(12);
    assert(!panel.classList.contains('hidden'));
    assert(panel.textContent.includes('Algorithms · Unit 4 — Past Questions ('));
    const qLinks = panel.querySelectorAll('ol.filtered-pyq-list a');
    assert(qLinks.length > 0);
    assert(qLinks.every(a => a.href.startsWith('answers.html?paper=CST209-') && a.href.includes('&q=CST209-')));
    assert(!RAW_CODE_RE.test(panel.textContent) && !RAW_QID_RE.test(panel.textContent));

    // XSS topic param on pyq/index.html renders 0 matches safely with zero script/img nodes
    pyq.win.setUrlAndPop(BASE + 'pyq/index.html?subject=CST209&unit=4&topic=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E');
    await flush(12);
    assert(panel.textContent.includes('Past Questions (0)'));
    assert.equal(panel.querySelectorAll('img').length, 0);
    assert.equal(panel.querySelectorAll('script').length, 0);
  }
  /* ── 6b. Explicit topic map is consulted first, matcher stays the fallback ── */
  let anchorCount = 0;
  {
    const topics = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'assets/data/topic-map-CST201.json'), 'utf8')).map;

    // The shim builds an empty document, so each fixture gets authored headings.
    async function unitFixture(unit, topic, headings, failOnceFor) {
      const dom = createMiniDom(`${BASE}subjects/CST201/units/unit-${unit}.html?topic=${encodeURIComponent(topic)}`);
      dom.win.fetch = createRepoFetch('/Diploma-3rd-sem/', failOnceFor || null, () => dom.win.location.href);
      const main = dom.doc.createElement('main');
      dom.doc.body.appendChild(main);
      for (const [id, text] of headings) {
        const h = dom.doc.createElement('h3');
        h.setAttribute('id', id);
        h.textContent = text;
        main.appendChild(h);
      }
      runScriptIn(dom.win, 'assets/js/subject-labels.js');
      runScriptIn(dom.win, 'assets/js/unit-discovery.js');
      await flush(20);
      return { dom, main };
    }

    // (a) A mapped topic lands on the mapped anchor and gets highlighted. The
    //     old matcher sent this to the generic #overview-parameter-passing card.
    const target = topics['storage classes / parameter passing'][1];
    const a = await unitFixture(4, 'Storage classes / parameter passing', [
      ['overview-parameter-passing', 'Parameter Passing'],
      [target, 'Parameter Passing and Storage Classes: Call by Value versus Call by Address'],
    ]);
    assert.equal(a.dom.win.location.hash, '#' + target, `map entry not honoured (hash=${a.dom.win.location.hash})`);
    assert.equal(a.main.querySelectorAll('.pyq-topic-target').length, 1, 'mapped heading must be highlighted');

    // (b) No map entry -> the matcher still routes (fallback intact).
    const b = await unitFixture(2, 'Switch / Armstrong numbers', [
      ['overview', 'Overview'],
      ['switch', 'Switch-case: multi-way branching'],
    ]);
    assert(b.dom.win.location.hash.startsWith('#'), 'matcher fallback did not fire');
    assert.notEqual(b.dom.win.location.hash, '', 'matcher fallback produced no anchor');

    // (c) Map file unreachable -> must not throw, must still route.
    const c = await unitFixture(3, 'Strings', [
      ['overview', 'Arrays and strings — unit overview'],
      ['strings', 'Strings (character arrays)'],
    ], 'topic-map-CST201.json');
    assert(c.dom.win.location.hash.startsWith('#'), 'missing map file broke routing');

    // (d) A stale entry (anchor not on the page) falls through instead of stranding.
    const d = await unitFixture(4, 'Storage classes / parameter passing', [
      ['some-other-heading', 'Parameter Passing and Storage Classes'],
    ]);
    assert(d.dom.win.location.hash !== '#' + target, 'stale map anchor must not be trusted blindly');
    assert(d.dom.win.location.hash.startsWith('#'), 'stale entry must fall back, not do nothing');

    // (e) Every mapped anchor really exists on its unit page, so the runtime
    //     "verify then trust" step can never silently fall through. Covers every
    //     authored map, so a new subject's map is checked the moment it lands.
    for (const mapFile of fs.readdirSync(path.join(ROOT, 'assets/data'))
      .filter(name => name.startsWith('topic-map-') && name.endsWith('.json'))) {
      const subject = mapFile.replace('topic-map-', '').replace('.json', '');
      const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data', mapFile), 'utf8')).map;
      for (const [topic, [unit, anchor]] of Object.entries(entries)) {
        const html = fs.readFileSync(path.join(ROOT, `subjects/${subject}/units/unit-${unit}.html`), 'utf8');
        assert(html.includes(`id="${anchor}"`), `${subject} map entry "${topic}" -> U${unit} #${anchor} not in page`);
        anchorCount += 1;
      }
    }
    assert(anchorCount >= 170, `only ${anchorCount} mapped anchors checked; a map is missing`);
  }
  console.log(`PASS topic map honoured first, matcher fallback intact, missing map tolerated, all ${anchorCount} anchors across every map present`);

  /* CST207: exercise the real resolver for every question in the strict window. */
  {
    const unitDir = 'subjects/CST207/units/';
    const units = Array.from({ length: 5 }, (_, i) => fs.readFileSync(path.join(ROOT, unitDir, `unit-${i + 1}.html`), 'utf8'));
    const sectionBlocks = raw => raw.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g);
    function mountHeadings(doc, root, raw, omit) {
      for (const [, sectionId, inner] of sectionBlocks(raw)) {
        const sec = doc.createElement('section');
        sec.id = sectionId;
        sec.className = 'section';
        root.append(sec);
        const content = doc.createElement('div');
        content.className = 'section-content collapsed';
        content.style.maxHeight = '0';
        sec.append(content);
        for (const [, tag, attrs, text] of inner.matchAll(/<(h[234])\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
          const id = attrs.match(/\bid="([^"]+)"/)?.[1];
          if (id && id === omit) continue;
          const h = doc.createElement(tag);
          if (id) h.id = id;
          h.textContent = text.replace(/<[^>]*>/g, ' ').trim();
          if (tag === 'h2') {
            h.className = 'section-title';
            h.setAttribute('aria-expanded', 'false');
            sec.append(h);
          } else content.append(h);
        }
      }
    }
    async function openTopic(unit, topic, omit) {
      // The answer-page action supplies a synthetic topic fragment. Include
      // that fragment for the no-topic case, where it should be cleared.
      const fragment = topic === 'Short notes' ? '#short-notes' : '';
      const dom = createMiniDom(`${BASE}${unitDir}unit-${unit}.html?topic=${encodeURIComponent(topic)}${fragment}`);
      const { doc, win } = dom;
      const main = doc.createElement('main');
      doc.body.append(main);
      mountHeadings(doc, main, units[unit - 1], omit);
      win.location.replace = url => { win.location.href = url; };
      win.fetch = createRepoFetch('/Diploma-3rd-sem/', null, () => win.location.href);
      win.DOMParser = class {
        parseFromString(raw) {
          const temp = createMiniDom(win.location.href).doc;
          mountHeadings(temp, temp.body, raw);
          return temp;
        }
      };
      runScriptIn(win, 'assets/js/subject-labels.js');
      runScriptIn(win, 'assets/js/unit-discovery.js');
      await flush(4);
      return dom;
    }
    const csoMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/topic-map-CST207.json'), 'utf8')).map;
    const paperDir = path.join(ROOT, '_data/CST207');
    const questions = fs.readdirSync(paperDir).filter(p => /-P00[3-6]-.*\.json$/.test(p))
      .flatMap(p => JSON.parse(fs.readFileSync(path.join(paperDir, p), 'utf8')).questions);
    let resolved = 0;
    let noTopic = 0;
    for (const q of questions) {
      const initial = await openTopic(q.unit, q.topic);
      if (q.id === 'CST207-P006-Q24') {
        assert.equal(initial.win.location.hash, '', 'Unlabelled Short notes must not jump to #short-questions');
        assert.equal(initial.doc.querySelectorAll('.pyq-topic-target').length, 0);
        noTopic += 1;
        continue;
      }
      const [unit, anchor] = csoMap[q.topic.toLowerCase().trim().replace(/\s+/g, ' ')];
      assert(initial.win.location.pathname.endsWith(`/unit-${unit}.html`), q.id);
      assert.equal(initial.win.location.hash, '#' + anchor, q.id);
      const { doc } = unit === q.unit ? initial : await openTopic(unit, q.topic);
      const node = doc.getElementById(anchor);
      assert(node?.classList.contains('pyq-topic-target'), `${q.id} must highlight the mapped heading`);
      assert(!node.closest('.section-content').classList.contains('collapsed'), `${q.id} landing is hidden`);
      assert.equal(node.closest('.section-content').style.maxHeight, '', `${q.id} retains a height cap`);
      resolved += 1;
    }
    assert.equal(resolved, 102);
    assert.equal(noTopic, 1);
    const stale = await openTopic(5, 'Memory hierarchy', 'memory-hierarchy-organization-and-memory-size');
    assert.notEqual(stale.win.location.hash, '#memory-hierarchy-organization-and-memory-size');
    assert(stale.win.location.hash || /\/unit-[1-4]\.html$/.test(stale.win.location.pathname),
      'CSO stale map target must fall back in the presence of matching headings');
    console.log('PASS CST207 102/102 concept landings, revealed highlights, stale fallback and unlabelled short notes');
  }

  /* CST209: exercise the real resolver for every question in the strict window. */
  {
    const unitDir = 'subjects/CST209/units/';
    const units = Array.from({ length: 5 }, (_, i) => fs.readFileSync(path.join(ROOT, unitDir, `unit-${i + 1}.html`), 'utf8'));
    const sectionBlocks = raw => raw.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g);
    function mountHeadings(doc, root, raw, omit) {
      for (const [, sectionId, inner] of sectionBlocks(raw)) {
        const sec = doc.createElement('section');
        sec.id = sectionId;
        sec.className = 'section';
        root.append(sec);
        const content = doc.createElement('div');
        content.className = 'section-content collapsed';
        content.style.maxHeight = '0';
        sec.append(content);
        for (const [, tag, attrs, text] of inner.matchAll(/<(h[234])\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
          const id = attrs.match(/\bid="([^"]+)"/)?.[1];
          if (id && id === omit) continue;
          const h = doc.createElement(tag);
          if (id) h.id = id;
          h.textContent = text.replace(/<[^>]*>/g, ' ').trim();
          if (tag === 'h2') {
            h.className = 'section-title';
            h.setAttribute('aria-expanded', 'false');
            sec.append(h);
          } else content.append(h);
        }
      }
    }
    async function openTopic(unit, topic, omit, mode) {
      // The answer-page action supplies a synthetic topic fragment. Include
      // that fragment for the no-topic case, where it should be cleared.
      const fragment = mode === 'failed-unit' ? '#naive-string-matching' : '';
      const dom = createMiniDom(`${BASE}${unitDir}unit-${unit}.html?topic=${encodeURIComponent(topic)}${fragment}`);
      const { doc, win } = dom;
      const main = doc.createElement('main');
      doc.body.append(main);
      mountHeadings(doc, main, units[unit - 1], omit);
      win.location.replace = url => { win.location.href = url; };
      const repoFetch = createRepoFetch('/Diploma-3rd-sem/', null, () => win.location.href);
      win.fetch = async input => {
        const url = String(input);
        if (mode === 'missing' && url.includes('topic-map-CST209')) return { ok: false, status: 404 };
        if (mode === 'malformed' && url.includes('topic-map-CST209')) return { ok: true, json: async () => { throw new SyntaxError('bad JSON'); } };
        if (mode === 'failed-unit' && url.includes('unit-5.html')) return { ok: false, status: 503 };
        return repoFetch(input);
      };
      win.DOMParser = class {
        parseFromString(raw) {
          const temp = createMiniDom(win.location.href).doc;
          mountHeadings(temp, temp.body, raw);
          return temp;
        }
      };
      runScriptIn(win, 'assets/js/subject-labels.js');
      runScriptIn(win, 'assets/js/unit-discovery.js');
      await flush(4);
      return dom;
    }
    const algoMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/topic-map-CST209.json'), 'utf8')).map;
    const paperDir = path.join(ROOT, '_data/CST209');
    const questions = fs.readdirSync(paperDir).filter(p => /-P00[3-6]-.*\.json$/.test(p))
      .flatMap(p => JSON.parse(fs.readFileSync(path.join(paperDir, p), 'utf8')).questions);
    let resolved = 0;
    let supplementary = 0;
    for (const q of questions) {
      const initial = await openTopic(q.unit, q.topic);
      const [unit, anchor] = algoMap[q.topic.toLowerCase().trim().replace(/\s+/g, ' ')];
      assert(initial.win.location.pathname.endsWith(`/unit-${unit}.html`), q.id);
      assert.equal(initial.win.location.hash, '#' + anchor, q.id);
      const { doc } = unit === q.unit ? initial : await openTopic(unit, q.topic);
      const node = doc.getElementById(anchor);
      assert(node?.classList.contains('pyq-topic-target'), `${q.id} must highlight the mapped heading`);
      const content = node.closest('.section-content') || node.querySelector('.section-content');
      assert(content && !content.classList.contains('collapsed'), `${q.id} landing is hidden`);
      assert.equal(content.style.maxHeight, '', `${q.id} retains a height cap`);
      if (unit === 5) supplementary += 1;
      resolved += 1;
    }
    assert.equal(resolved, 105);
    assert.equal(supplementary, 8);
    const stale = await openTopic(5, 'String matching', 'rabin-karp-string-matching');
    assert.notEqual(stale.win.location.hash, '#rabin-karp-string-matching');
    assert(stale.win.location.hash, 'stale RK anchor must fall back to a real matching heading');
    for (const mode of ['missing', 'malformed', 'failed-unit']) {
      const fallback = await openTopic(4, 'Naive string matching', null, mode);
      if (mode === 'failed-unit') {
        assert(fallback.win.location.pathname.endsWith('/unit-4.html'), 'failed page must not be a blind redirect');
        assert.equal(fallback.win.location.hash, '', 'failed page and unmatched concept must leave a clean no-jump fallback');
      } else {
        assert(fallback.win.location.pathname.endsWith('/unit-5.html'), `${mode} map must search supplementary candidates`);
        assert(fallback.win.location.hash.includes('naive'), `${mode} fallback must be a naive concept`);
      }
    }
    console.log('PASS CST209 105/105 concept routes, 8/8 CO5, revealed highlights, stale/missing/malformed/failed-page fallbacks');
  }

  /* CST205: exercise the real resolver for every question in the strict window. */
  {
    const unitDir = 'subjects/CST205/units/';
    const units = Array.from({ length: 4 }, (_, i) => fs.readFileSync(path.join(ROOT, unitDir, `unit-${i + 1}.html`), 'utf8'));
    const sectionBlocks = raw => raw.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g);
    function mountHeadings(doc, root, raw, omit) {
      for (const [, sectionId, inner] of sectionBlocks(raw)) {
        const sec = doc.createElement('section');
        sec.id = sectionId;
        sec.className = 'section';
        root.append(sec);
        const content = doc.createElement('div');
        content.className = 'section-content collapsed';
        content.style.maxHeight = '0';
        sec.append(content);
        for (const [, tag, attrs, text] of inner.matchAll(/<(h[234])\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
          const id = attrs.match(/\bid="([^"]+)"/)?.[1];
          if (id && id === omit) continue;
          const h = doc.createElement(tag);
          if (id) h.id = id;
          h.textContent = text.replace(/<[^>]*>/g, ' ').trim();
          if (tag === 'h2') {
            h.className = 'section-title';
            h.setAttribute('aria-expanded', 'false');
            sec.append(h);
          } else content.append(h);
        }
      }
    }
    async function openTopic(unit, topic, omit, mode) {
      const dom = createMiniDom(`${BASE}${unitDir}unit-${unit}.html?topic=${encodeURIComponent(topic)}`);
      const { doc, win } = dom;
      const main = doc.createElement('main');
      doc.body.append(main);
      mountHeadings(doc, main, units[unit - 1], omit);
      win.location.replace = url => { win.location.href = url; };
      const repoFetch = createRepoFetch('/Diploma-3rd-sem/', null, () => win.location.href);
      win.fetch = async input => {
        const url = String(input);
        if (mode === 'missing' && url.includes('topic-map-CST205')) return { ok: false, status: 404 };
        if (mode === 'malformed' && url.includes('topic-map-CST205')) return { ok: true, json: async () => { throw new SyntaxError('bad JSON'); } };
        return repoFetch(input);
      };
      win.DOMParser = class {
        parseFromString(raw) {
          const temp = createMiniDom(win.location.href).doc;
          mountHeadings(temp, temp.body, raw);
          return temp;
        }
      };
      runScriptIn(win, 'assets/js/subject-labels.js');
      runScriptIn(win, 'assets/js/unit-discovery.js');
      await flush(4);
      return dom;
    }
    const dsMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/topic-map-CST205.json'), 'utf8')).map;
    const paperDir = path.join(ROOT, '_data/CST205');
    const questions = fs.readdirSync(paperDir).filter(p => /-P00[3-6]-.*\.json$/.test(p))
      .flatMap(p => JSON.parse(fs.readFileSync(path.join(paperDir, p), 'utf8')).questions);
    assert.equal(questions.length, 106, 'CST205 strict window must hold 106 questions');
    let resolved = 0;
    let crossUnit = 0;
    for (const q of questions) {
      const initial = await openTopic(q.unit, q.topic);
      const [unit, anchor] = dsMap[q.topic.toLowerCase().trim().replace(/\s+/g, ' ')];
      assert(initial.win.location.pathname.endsWith(`/unit-${unit}.html`), q.id);
      assert.equal(initial.win.location.hash, '#' + anchor, q.id);
      const { doc } = unit === q.unit ? initial : await openTopic(unit, q.topic);
      const node = doc.getElementById(anchor);
      assert(node?.classList.contains('pyq-topic-target'), `${q.id} must highlight the mapped heading`);
      const content = node.closest('.section-content') || node.querySelector('.section-content');
      assert(content && !content.classList.contains('collapsed'), `${q.id} landing is hidden`);
      assert.equal(content.style.maxHeight, '', `${q.id} retains a height cap`);
      if (unit !== q.unit) crossUnit += 1;
      resolved += 1;
    }
    assert.equal(resolved, 106);
    assert(crossUnit >= 40, `only ${crossUnit} stored-unit corrections; the map is not correcting CST205's shifted tags`);
    // Stale map anchor: the resolver must never strand the learner on the
    // missing anchor. With the deque heading omitted, no remaining heading
    // clears the match threshold, so CST205 takes the resolver's deliberate
    // no-jump fallback (same philosophy as the CST209 dead-fragment guard):
    // no hash, no highlight, page left intact.
    const stale = await openTopic(2, 'Deques', 'circular-queues-deques-and-priority-queues');
    assert.notEqual(stale.win.location.hash, '#circular-queues-deques-and-priority-queues');
    assert.equal(stale.win.location.hash, '', 'stale anchor must not masquerade as a concept jump');
    assert.equal(stale.doc.querySelectorAll('.pyq-topic-target').length, 0, 'stale anchor must not highlight anything');
    for (const mode of ['missing', 'malformed']) {
      const fallback = await openTopic(2, 'Circular queues', null, mode);
      assert(fallback.win.location.hash.startsWith('#'), `${mode} map must still route via the matcher`);
    }
    console.log(`PASS CST205 106/106 concept landings (${crossUnit} stored-unit corrections), revealed highlights, stale/missing/malformed fallbacks`);
  }

  console.log('PASS unit breadcrumbs, authored #section anchors, prev/next nav, subject hub jump list, and filtered-PYQ URL handoff');

  /* ── 7. Service worker offline simulation (precache + WARM_SEARCH + offline fetch) ── */
  {
    const store = new Map();
    let online = true;
    const repoFetch = createRepoFetch('/Diploma-3rd-sem/');
    const swListeners = {};

    const mockCaches = {
      async open(name) {
        if (!store.has(name)) store.set(name, new Map());
        const bucket = store.get(name);
        return {
          async addAll(urls) {
            for (const u of urls) {
              const res = await repoFetch(u);
              assert(res.ok, `Precache asset missing on disk: ${u}`);
              bucket.set(u, res);
            }
          },
          async put(k, res) { bucket.set(k, res); },
          async keys() { return [...bucket.keys()].map(url => ({ url })); },
          async match(k) { return bucket.get(k); }
        };
      },
      async keys() { return [...store.keys()]; },
      async delete(k) { return store.delete(k); },
      async match(k) {
        for (const b of store.values()) {
          if (b.has(k)) return b.get(k);
        }
        return undefined;
      }
    };

    const swGlobal = {
      URL,
      URLSearchParams,
      Response: class Response {
        constructor(body, init) { this.body = body; this.status = init?.status || 200; this.ok = this.status < 400; }
      },
      caches: mockCaches,
      fetch: async req => {
        if (!online) throw new Error('offline');
        const url = typeof req === 'string' ? req : req.url;
        return repoFetch(url);
      },
      self: {
        location: { href: BASE + 'sw.js' },
        clients: { claim: async () => {} },
        skipWaiting: () => {},
        addEventListener(type, fn) { swListeners[type] = fn; }
      }
    };
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), swGlobal, { filename: 'sw.js' });

    // Install precaches search.html, repeated.html, discovery.js, manifest.json, index-pages.json, repeated.json
    let installPromise;
    swListeners.install({ waitUntil: p => { installPromise = p; } });
    await installPromise;

    // WARM_SEARCH caches all 5 subject shards keyed with exact ?v=<sha256>
    let warmPromise;
    swListeners.message({ data: { type: 'WARM_SEARCH' }, waitUntil: p => { warmPromise = p; } });
    await warmPromise;

    // Cut network completely: verify search.html?q=dijkstra and index-CST209.json?v=<sha> both serve 200 offline
    online = false;
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/search/manifest.json'), 'utf8'));

    async function swFetch(url, mode = 'cors') {
      let respPromise;
      swListeners.fetch({
        request: { url, method: 'GET', mode },
        waitUntil: () => {},
        respondWith: p => { respPromise = p; }
      });
      return respPromise;
    }

    const navSearch = await swFetch(BASE + 'search.html?q=dijkstra', 'navigate');
    assert.equal(navSearch.status, 200, 'search.html?q=dijkstra must load offline via pathname fallback');
    const navRepeat = await swFetch(BASE + 'repeated.html?subject=CST209', 'navigate');
    assert.equal(navRepeat.status, 200, 'repeated.html?subject=CST209 must load offline');
    const shardRes = await swFetch(
      BASE + 'assets/search/' + manifest.subjects.CST209.file + '?v=' + manifest.subjects.CST209.sha256
    );
    assert.equal(shardRes.status, 200, 'Warmed CST209 search shard must serve offline');
    const pagesRes = await swFetch(
      BASE + 'assets/search/' + manifest.pages.file + '?v=' + manifest.pages.sha256
    );
    assert.equal(pagesRes.status, 200, 'Warmed pages search shard must serve offline');
  }
  console.log('PASS service worker precache, WARM_SEARCH shard warming, and offline navigation/query serving');
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
