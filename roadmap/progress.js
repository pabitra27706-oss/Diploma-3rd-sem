/* The theory checklist on Home and Roadmap uses the existing manual marks.
 * Practice question sessions and the old automatic start date are unrelated. */
(() => {
  'use strict';
  const key = 'practice-progress';

  function read() {
    const marks = StudyStorage.get(key, {});
    if (!marks || typeof marks !== 'object' || Array.isArray(marks)) {
      throw Error('The saved roadmap checklist is unreadable. It has not been changed.');
    }
    return marks;
  }

  const isDone = (marks, day) => marks[`day-${day}`] === true;
  function setDone(day, done) {
    // Read at click time so marking one day doesn't overwrite another tab's work.
    StudyStorage.set(key, { ...read(), [`day-${day}`]: done });
  }

  function onChange(refresh) {
    window.addEventListener('storage', event => {
      if (event.key === null || event.key === 'd3s:' + key || event.key === key) refresh();
    });
    window.addEventListener('study-storage-hydrated', refresh);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
    window.addEventListener('pageshow', event => { if (event.persisted) refresh(); });
  }

  window.RoadmapProgress = { read, isDone, setDone, reset: () => StudyStorage.remove(key), onChange };
})();
