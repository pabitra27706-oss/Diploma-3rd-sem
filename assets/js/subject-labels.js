/* Display-only subject labels.
   Internal identifiers (course codes, file paths, storage keys, URLs) stay exactly
   as they are; this map only decides what a learner reads on screen. */
(function () {
  'use strict';
  var LABELS = {
    CST201: 'C',
    CST203: 'Python',
    CST205: 'DS',
    CST207: 'CSO',
    CST209: 'Algorithms',
    CST211: 'C Lab',
    CST213: 'Python Lab',
    CST215: 'DS Lab',
    SI201: 'Internship'
  };
  window.SUBJECT_LABELS = LABELS;
  window.subjectLabel = function (code) {
    return LABELS[code] || 'Subject';
  };
})();
