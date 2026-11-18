/* Unit and subject-hub discovery: breadcrumbs, authored section anchors,
   per-unit PYQ counts, filtered-PYQ handoffs, and prev/next unit navigation.
   Uses textContent-only DOM construction and subjectLabel() display names. */
(() => {
  'use strict';

  const FALLBACK_LABELS = {
    CST201: 'C',
    CST203: 'Python',
    CST205: 'DS',
    CST207: 'CSO',
    CST209: 'Algorithms'
  };

  // Official WBSCTE syllabus unit counts per subject (single truth matching _data/syllabus.json).
  const SYLLABUS_UNITS = {
    CST201: 5,
    CST203: 5,
    CST205: 4,
    CST207: 5,
    CST209: 4
  };

  // Subjects that ship a dedicated quiz bank under quiz/data/.
  const QUIZ_BANK_SUBJECTS = new Set(['CST201', 'CST203', 'CST205', 'CST209']);

  function labelFor(code) {
    if (typeof window !== 'undefined' && typeof window.subjectLabel === 'function') {
      return window.subjectLabel(code);
    }
    return FALLBACK_LABELS[code] || 'Subject';
  }

  function make(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === null || v === undefined) continue;
        if (k === 'class') el.className = v;
        else el.setAttribute(k, String(v));
      }
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      el.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return el;
  }

  function cleanHeadingText(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.section-anchor-link').forEach((a) => a.remove());
    return (clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function authoredAnchorFor(heading) {
    const tag = (heading.tagName || '').toLowerCase();
    const ownId = heading.getAttribute('id') || '';
    // section-notes.js assigns runtime section-1..N IDs on h2.section-title;
    // never use generated runtime IDs as deep-link anchors.
    if (ownId && !/^section-\d+$/.test(ownId)) {
      return ownId;
    }
    if (tag === 'h2') {
      const sec = heading.closest('section[id]');
      const secId = sec ? sec.getAttribute('id') || '' : '';
      if (secId && !/^section-\d+$/.test(secId)) return secId;
    }
    return '';
  }

  function expandCollapsedSection(target) {
    if (!target || !target.closest) return;
    const sec = target.closest('.unit-section');
    if (sec && sec.classList && sec.classList.contains('collapsed')) {
      sec.classList.remove('collapsed');
      const toggle = sec.querySelector('.section-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
  }

  async function focusQuestionTopic(main, subject, currentUnit, maxUnits) {
    const topic = new URLSearchParams(window.location.search).get('topic');
    if (!topic || !topic.trim()) return;
    const normalized = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
    const needle = normalized(topic);
    const terms = needle.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 2);
    if (!terms.length) return;

    function entriesFor(doc, unit) {
      return Array.from(doc.querySelectorAll('h2, h3, h4')).map((heading) => {
        const title = normalized(cleanHeadingText(heading));
        let anchor = heading.getAttribute('id') || '';
        if (!anchor || /^section-\d+$/.test(anchor)) {
          const section = heading.closest('section[id]');
          anchor = section ? section.id : '';
        }
        return { title, anchor, unit };
      }).filter((entry) => entry.title && entry.anchor && !/^section-\d+$/.test(entry.anchor));
    }

    // A stored topic is often several sub-topics joined by "/" (for example
    // "Switch / Armstrong numbers"). The learner only needs the heading for
    // ONE of them, so each segment is scored on its own and the best wins.
    // Terms are also singularised, because headings say "loop" and topics
    // say "loops" -- an exact word match otherwise never fires.
    const singular = (word) => (word.length > 3 && /s$/u.test(word) ? word.replace(/s$/u, '') : word);
    const segments = needle.split(/[/,;]+/u).map((part) => part.trim()).filter(Boolean);
    const needles = segments.length ? segments : [needle];
    const termsFor = (text) => text.split(/[^\p{L}\p{N}]+/u)
      .filter((word) => word.length > 2)
      .map(singular);

    function scoreAgainst(title, target, targetTerms) {
      if (title === target) return 100;
      if (title.includes(target)) return 90;
      const titleWords = new Set(termsFor(title));
      const matched = targetTerms.filter((term) => titleWords.has(term)).length;
      return matched ? matched / targetTerms.length : 0;
    }

    function scoreTitle(title) {
      let best = 0;
      for (const target of needles) {
        const targetTerms = termsFor(target);
        if (!targetTerms.length) continue;
        best = Math.max(best, scoreAgainst(title, target, targetTerms));
      }
      return best;
    }

    // A unit overview heading is a broad summary, so a topic like
    // "Arrays / loops" can tie with it at 90. A heading that covers MORE of
    // the topic's segments is the better landing spot, so ties are broken on
    // that count instead of on document order.
    function segmentsCovered(title) {
      let covered = 0;
      for (const segment of needles) {
        const targetTerms = termsFor(segment);
        if (targetTerms.length && scoreAgainst(title, segment, targetTerms) > 0) covered += 1;
      }
      return covered;
    }

    let candidates = entriesFor(document, currentUnit);
    // When a stored PYQ unit is stale, search the subject's authored section
    // headings instead of sending the learner to a vaguely related overview.
    if (!candidates.some((entry) => scoreTitle(entry.title) >= 0.5)) {
      const others = await Promise.all(Array.from({ length: maxUnits }, async (_, index) => {
        const unit = index + 1;
        if (unit === currentUnit) return [];
        try {
          const url = new URL(`unit-${unit}.html`, window.location.href);
          url.search = '';
          url.hash = '';
          const response = await fetch(url.href);
          if (!response.ok) return [];
          const html = await response.text();
          const parsed = new DOMParser().parseFromString(html, 'text/html');
          return entriesFor(parsed, unit);
        } catch (_) {
          return [];
        }
      }));
      candidates = candidates.concat(...others);
    }

    let best = null;
    for (const entry of candidates) {
      const score = scoreTitle(entry.title);
      const covered = segmentsCovered(entry.title);
      if (!best || score > best.score
          || (score === best.score && score > 0 && covered > best.covered)) {
        best = { ...entry, score, covered };
      }
    }
    if (!best || best.score < 0.5) return;

    if (best.unit !== currentUnit) {
      const destination = new URL(`unit-${best.unit}.html`, window.location.href);
      destination.search = new URLSearchParams({ topic }).toString();
      destination.hash = best.anchor;
      window.location.replace(destination.href);
      return;
    }

    const target = document.getElementById(best.anchor);
    if (!target) return;
    if (window.location.hash !== `#${best.anchor}`) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${best.anchor}`);
    }
    target.classList.add('pyq-topic-target');
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    const styleId = 'pyq-topic-target-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = '.pyq-topic-target{outline:3px solid var(--hub-accent-solid);outline-offset:5px;border-radius:4px;scroll-margin-top:5rem}';
      document.head.append(style);
    }
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
    }, 0);
  }

  function decorateUnitHeadings(main) {
    const entries = [];
    // Mark unanchored top h1 explicitly without fabricating a runtime ID.
    main.querySelectorAll('h1').forEach((h1) => {
      if (!h1.getAttribute('id')) {
        h1.setAttribute('data-anchor-status', 'page-top');
      }
    });

    main.querySelectorAll('h2, h3').forEach((heading) => {
      if (heading.closest('#mobileDrawer') || heading.closest('.unit-discovery') || heading.closest('.section-note-box')) {
        return;
      }
      const title = cleanHeadingText(heading);
      if (!title) return;
      const anchor = authoredAnchorFor(heading);
      if (!anchor) {
        heading.setAttribute('data-anchor-status', 'none');
        return;
      }
      heading.setAttribute('data-anchor-id', anchor);
      if (!heading.querySelector('.section-anchor-link')) {
        const link = make(
          'a',
          {
            class: 'section-anchor-link',
            href: `#${anchor}`,
            'aria-label': `Link to section: ${title}`
          },
          '#'
        );
        heading.append(link);
      }
      entries.push({
        anchor,
        title,
        level: (heading.tagName || '').toLowerCase(),
        heading,
        target: document.getElementById(anchor) || heading
      });
    });
    return entries;
  }

  function mountUnitBreadcrumb(main, subject, unit, isSupplementary, anchoredEntries) {
    main.querySelector('.unit-breadcrumb')?.remove();
    const subjName = labelFor(subject);
    const unitText = isSupplementary ? `Unit ${unit} (Supplementary)` : `Unit ${unit}`;
    const defaultSection = (anchoredEntries.find((e) => e.level === 'h2') || anchoredEntries[0] || { title: 'Overview' }).title;
    const sectionSpan = make(
      'span',
      { 'aria-current': 'location', 'data-current-section': 'true' },
      defaultSection
    );

    const crumb = make(
      'nav',
      { class: 'unit-breadcrumb', 'aria-label': 'Breadcrumb' },
      make('a', { href: '../index.html' }, subjName),
      make('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '→'),
      make('a', { href: '#study-main-content' }, unitText),
      make('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '→'),
      sectionSpan
    );
    main.prepend(crumb);

    const byAnchor = new Map();
    for (const entry of anchoredEntries) {
      if (!byAnchor.has(entry.anchor)) byAnchor.set(entry.anchor, entry);
    }

    function applyHash(scrollIntoPlace) {
      const raw = (window.location.hash || '').replace(/^#/, '');
      if (!raw) {
        sectionSpan.textContent = defaultSection;
        return;
      }
      let decoded = raw;
      try { decoded = decodeURIComponent(raw); } catch (_) { decoded = raw; }
      const entry = byAnchor.get(decoded);
      const target = (entry && entry.target) || document.getElementById(decoded);
      if (entry) {
        sectionSpan.textContent = entry.title;
      }
      if (target) {
        expandCollapsedSection(target);
        if (scrollIntoPlace) {
          if (window.StudyShare && typeof window.StudyShare.highlight === 'function') {
            window.StudyShare.highlight(entry ? entry.heading : target);
          } else if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ block: 'start' });
          }
        }
      }
    }

    window.addEventListener('hashchange', () => applyHash(true));

    // Also update section breadcrumb when clicking any same-page anchor link (e.g., TOC).
    document.addEventListener('click', (event) => {
      const link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      const targetId = (link.getAttribute('href') || '').slice(1);
      if (!targetId) {
        sectionSpan.textContent = defaultSection;
        return;
      }
      const entry = byAnchor.get(targetId);
      if (entry) {
        expandCollapsedSection(entry.target);
        sectionSpan.textContent = entry.title;
      }
    });

    // Track current visible h2 section while scrolling.
    if (typeof IntersectionObserver === 'function') {
      const h2Entries = anchoredEntries.filter((e) => e.level === 'h2');
      if (h2Entries.length) {
        const targetToTitle = new Map(h2Entries.map((e) => [e.target, e.title]));
        const observer = new IntersectionObserver(
          (records) => {
            for (const rec of records) {
              if (rec.isIntersecting) {
                const title = targetToTitle.get(rec.target);
                if (title) sectionSpan.textContent = title;
                break;
              }
            }
          },
          { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
        );
        h2Entries.forEach((e) => {
          if (e.target) observer.observe(e.target);
        });
      }
    }

    if (window.location.hash) {
      applyHash(true);
    }
  }

  function buildUnitNav(subject, unit, maxSyllabusUnit, isSupplementary) {
    const subjName = labelFor(subject);
    const nav = make('nav', {
      'aria-label': 'Unit navigation',
      style: 'display:flex;justify-content:space-between;flex-wrap:wrap;gap:.75rem;margin-top:1rem;'
    });

    if (isSupplementary) {
      nav.append(make('a', { href: `unit-${maxSyllabusUnit}.html` }, `← Back to Unit ${maxSyllabusUnit}`));
    } else if (unit > 1) {
      nav.append(make('a', { href: `unit-${unit - 1}.html` }, `← Previous: Unit ${unit - 1}`));
    } else {
      nav.append(make('span', null, ''));
    }

    nav.append(make('a', { href: '../index.html' }, `All ${subjName} units`));

    if (!isSupplementary && unit < maxSyllabusUnit) {
      nav.append(make('a', { href: `unit-${unit + 1}.html` }, `Next: Unit ${unit + 1} →`));
    } else {
      nav.append(make('span', null, ''));
    }
    return nav;
  }

  async function runUnitPage(subject, unit) {
    const main = document.querySelector('main') || document.body;
    const maxSyllabusUnit = SYLLABUS_UNITS[subject] || 4;
    const isSupplementary = unit > maxSyllabusUnit;
    const subjName = labelFor(subject);

    const anchoredEntries = decorateUnitHeadings(main);
    mountUnitBreadcrumb(main, subject, unit, isSupplementary, anchoredEntries);
    await focusQuestionTopic(main, subject, unit, maxSyllabusUnit);

    let rows = [];
    let shardFailed = false;
    try {
      const res = await fetch(`../../../assets/search/index-${subject}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      rows = await res.json();
    } catch (_) {
      shardFailed = true;
    }

    const pyqs = rows.filter((r) => r.type === 'pyq' && Number(r.unit) === unit);
    const quizzes = rows.filter((r) => r.type === 'quiz' && Number(r.unit) === unit);
    const specificTopics = [];
    const seenTopics = new Set();
    for (const r of pyqs) {
      if (r.genericTopic || !r.topic) continue;
      const key = r.topic.toLowerCase();
      if (seenTopics.has(key)) continue;
      seenTopics.add(key);
      specificTopics.push(r.topic);
    }

    main.querySelector('section.unit-discovery')?.remove();
    const box = make('section', {
      class: 'unit-discovery',
      style: 'margin:2rem 0;padding:1.25rem;border:1px solid var(--border,rgba(120,130,150,.35));border-radius:12px;'
    });

    box.append(
      make(
        'h2',
        null,
        isSupplementary
          ? `Supplementary Unit ${unit} — Past Questions & Practice`
          : `Unit ${unit} — Past Questions & Practice`
      )
    );

    if (shardFailed) {
      box.append(
        make(
          'p',
          null,
          `Related ${subjName} question counts could not load right now; direct practice and paper links still work below.`
        )
      );
    } else if (pyqs.length === 0) {
      box.append(
        make(
          'p',
          null,
          `0 archived ${subjName} exam questions currently map to Unit ${unit}.`
        )
      );
    } else {
      const note = isSupplementary
        ? `${pyqs.length} archived ${subjName} exam question${pyqs.length === 1 ? '' : 's'} carry stored Unit ${unit} (supplementary, outside the ${maxSyllabusUnit}-unit syllabus).`
        : `${pyqs.length} archived ${subjName} exam question${pyqs.length === 1 ? '' : 's'} map to Unit ${unit}.`;
      box.append(make('p', null, note));
    }

    const pyqFilterUrl = `../../../pyq/index.html?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}`;
    const practiceUrl = `../../../practice/session.html?subjects=${encodeURIComponent(subject)}&units=${encodeURIComponent(unit)}`;
    const searchUrl = `../../../search.html?subject=${encodeURIComponent(subject)}&q=${encodeURIComponent('unit ' + unit)}`;

    const actions = make('p', {
      class: 'unit-discovery-actions',
      style: 'display:flex;gap:.75rem;flex-wrap:wrap;margin:.6rem 0;'
    });
    actions.append(
      make(
        'a',
        { href: pyqFilterUrl },
        shardFailed ? `View Unit ${unit} PYQs` : `View Unit ${unit} PYQs (${pyqs.length})`
      ),
      make('a', { href: practiceUrl }, `Practice Unit ${unit}`)
    );
    if (QUIZ_BANK_SUBJECTS.has(subject) && (!isSupplementary || quizzes.length > 0)) {
      const quizUrl = `../../../quiz/setup.html?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}&mode=all`;
      actions.append(
        make(
          'a',
          { href: quizUrl },
          quizzes.length > 0 ? `Quiz Unit ${unit} (${quizzes.length})` : `Quiz Unit ${unit}`
        )
      );
    }
    actions.append(make('a', { href: searchUrl }, `Search ${subjName}`));
    box.append(actions);

    if (specificTopics.length > 0) {
      const topicWrap = make(
        'p',
        { class: 'unit-topic-links', style: 'display:flex;gap:.45rem;flex-wrap:wrap;align-items:center;font-size:.88rem;margin:.65rem 0;' },
        make('strong', null, 'Filter PYQs by topic:')
      );
      specificTopics.slice(0, 10).forEach((topic) => {
        const href = `../../../pyq/index.html?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}&topic=${encodeURIComponent(topic)}`;
        topicWrap.append(make('a', { href }, topic));
      });
      box.append(topicWrap);
    }

    if (pyqs.length > 0) {
      const list = make('ul', { class: 'unit-pyq-preview', style: 'margin:.75rem 0;padding-left:1.2rem;' });
      pyqs.slice(0, 5).forEach((r) => {
        const meta = [
          r.month && r.year ? `${r.month} ${r.year}` : (r.year ? String(r.year) : ''),
          r.marks ? `${r.marks}m` : ''
        ].filter(Boolean).join(' · ');
        const cleanTitle = String(r.title || '').replace(/\b(?:CST2\d{2}|SI201)\b/gi, (m) => labelFor(m.toUpperCase()));
        const text = meta ? `${cleanTitle} (${meta})` : cleanTitle;
        const href = r.url
          ? `../../../${r.url}`
          : `../../../pyq/answers.html?${new URLSearchParams(
              r.paperId
                ? { paper: r.paperId, q: r.id }
                : { subject: subject, paper: r.paper, q: r.id }
            ).toString()}`;
        list.append(make('li', null, make('a', { href }, text)));
      });
      box.append(list);
    }

    box.append(buildUnitNav(subject, unit, maxSyllabusUnit, isSupplementary));
    main.append(box);
  }

  async function runSubjectHub(subject) {
    const main = document.querySelector('main') || document.body;
    const subjName = labelFor(subject);
    const maxSyllabusUnit = SYLLABUS_UNITS[subject] || 4;

    main.querySelector('.unit-breadcrumb')?.remove();
    main.prepend(
      make(
        'nav',
        { class: 'unit-breadcrumb', 'aria-label': 'Breadcrumb' },
        make('a', { href: '../../index.html' }, 'Study Hub'),
        make('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, '→'),
        make('span', { 'aria-current': 'location' }, subjName)
      )
    );

    let rows = [];
    let failed = false;
    try {
      const res = await fetch(`../../assets/search/index-${subject}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      rows = await res.json();
    } catch (_) {
      failed = true;
    }

    const pyqs = rows.filter((r) => r.type === 'pyq');
    const unitHeadings = rows.filter((r) => r.type === 'unit' && r.level === 'h1');
    const unitTitleByNum = new Map();
    for (const h of unitHeadings) {
      if (h.unit && !unitTitleByNum.has(Number(h.unit))) {
        unitTitleByNum.set(Number(h.unit), h.title);
      }
    }

    main.querySelector('section.hub-unit-discovery')?.remove();
    const box = make('section', {
      class: 'unit-discovery hub-unit-discovery',
      style: 'margin:1.75rem auto;max-width:72rem;padding:1.25rem;border:1px solid var(--border,rgba(120,130,150,.35));border-radius:12px;'
    });

    box.append(make('h2', null, `${subjName} — Unit Jump List & Past Question Counts`));

    if (failed) {
      box.append(
        make('p', null, `Per-unit ${subjName} question counts are temporarily unavailable; unit jump links remain ready below.`)
      );
    } else {
      const extraPyqs = pyqs.filter((r) => Number(r.unit) > maxSyllabusUnit);
      const summary = extraPyqs.length > 0
        ? `${pyqs.length} archived ${subjName} exam questions across ${maxSyllabusUnit} official syllabus units (including ${extraPyqs.length} stored with out-of-syllabus unit tags).`
        : `${pyqs.length} archived ${subjName} exam questions across ${maxSyllabusUnit} official syllabus units.`;
      box.append(make('p', null, summary));
    }

    const list = make('ul', {
      class: 'hub-unit-jump-list',
      style: 'margin:.75rem 0;padding-left:1.2rem;display:grid;gap:.45rem;'
    });
    for (let u = 1; u <= maxSyllabusUnit; u += 1) {
      const count = pyqs.filter((r) => Number(r.unit) === u).length;
      const rawTitle = unitTitleByNum.get(u) || `Unit ${u}`;
      const safeTitle = String(rawTitle).replace(/\b(?:CST2\d{2}|SI201)\b/gi, (m) => labelFor(m.toUpperCase()));
      const displayTitle = /^unit\s+\d+/i.test(safeTitle) ? safeTitle : `Unit ${u}: ${safeTitle}`;
      const pyqHref = `../../pyq/index.html?subject=${encodeURIComponent(subject)}&unit=${u}`;
      const practiceHref = `../../practice/session.html?subjects=${encodeURIComponent(subject)}&units=${u}`;
      list.append(
        make(
          'li',
          null,
          make('a', { href: `units/unit-${u}.html` }, displayTitle),
          ' · ',
          make(
            'a',
            { href: pyqHref },
            failed ? 'View unit PYQs' : `${count} PYQ${count === 1 ? '' : 's'}`
          ),
          ' · ',
          make('a', { href: practiceHref }, 'Practice')
        )
      );
    }
    box.append(list);

    const hubActions = make('p', {
      style: 'display:flex;gap:.85rem;flex-wrap:wrap;margin:.75rem 0 0;'
    });
    hubActions.append(
      make('a', { href: `../../pyq/index.html?subject=${encodeURIComponent(subject)}` }, `All ${subjName} papers`),
      make('a', { href: `../../search.html?subject=${encodeURIComponent(subject)}` }, `Search ${subjName}`),
      make('a', { href: '../../repeated.html' }, 'Repeated questions')
    );
    box.append(hubActions);
    main.append(box);
  }

  const unitMatch = window.location.pathname.match(/subjects\/(CST\d{3})\/units\/unit-(\d+)\.html$/);
  if (unitMatch) {
    runUnitPage(unitMatch[1], Number(unitMatch[2]));
    return;
  }

  const hubMatch = window.location.pathname.match(/subjects\/(CST20[13579])\/(?:index\.html)?$/);
  if (hubMatch) {
    runSubjectHub(hubMatch[1]);
  }
})();
