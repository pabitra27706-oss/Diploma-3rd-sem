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
    // Phase 8 added six revision-sheet pages, so 50/68 became 56/74 indexed/excluded.
    assert(scopeEl.textContent.includes('56 of 74') && scopeEl.textContent.includes('18'));
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

    // Every surface wires StudyShare.copy + StudyShare.share + StudyShare.highlight + graceful missing-q notice
    for (const [name, src] of [
      ['pyq/js/answers.js', answersSrc],
      ['practice/js/session.js', practiceSrc],
      ['quiz/js/review.js', reviewSrc],
      ['quiz/js/result.js', resultSrc]
    ]) {
      assert(src.includes('StudyShare.copy('), `${name} must use StudyShare.copy`);
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
