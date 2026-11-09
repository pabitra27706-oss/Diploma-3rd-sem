/* One scope-relative metadata loader, memoized per page; no storage or network outside app. */
(() => {
  'use strict';
  const base = new URL('../../', document.currentScript.src);
  const pending = new Map();
  function load(path) {
    if (!pending.has(path)) pending.set(path, fetch(new URL(path, base)).then(r => {
      if (!r.ok) throw new Error(`Data unavailable: ${r.status}`);
      return r.json();
    }).catch(error => { pending.delete(path); throw error; }));
    return pending.get(path);
  }
  window.StudyData = {
    catalog: () => load('_data/catalog.json'),
    practiceDays: () => load('_data/practice-days.json')
  };
  document.addEventListener('DOMContentLoaded', async () => {
    if (!document.querySelector('[data-live-count]')) return;
    try {
      const catalog = await StudyData.catalog();
      const counts = { subjects: Object.keys(catalog.subjects).length,
        units: Object.values(catalog.subjects).reduce((n,s) => n+s.syllabusUnits,0),
        questions: catalog.uniquePyqCount };
      document.querySelectorAll('[data-live-count]').forEach(el => {
        const value = counts[el.dataset.liveCount];
        el.textContent = value.toLocaleString();
        el.setAttribute('aria-label', `${value} ${el.dataset.liveCount}`);
      });
    } catch { document.querySelectorAll('[data-live-count]').forEach(el => { el.textContent = 'Unavailable'; }); }
  });
})();
