/* Display-only subject labels and zero-dependency question deep-link share/copy helpers.
   Internal identifiers (course codes, file paths, storage keys, URLs) stay exactly
   as they are; SUBJECT_LABELS only decides what a learner reads on screen. */
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

  function subjectLabel(code) {
    return LABELS[code] || 'Subject';
  }

  function showFallbackInput(url, opts) {
    var container = opts && opts.container;
    var statusEl = opts && opts.statusEl;
    var button = opts && opts.button;
    var copiedText = (opts && opts.copiedText) || 'Link copied';
    var inputLabel = (opts && opts.inputLabel) || 'Question link — select and copy';
    var field = container && container.querySelector ? container.querySelector('.share-fallback-input') : null;
    if (!field && container) {
      field = document.createElement('input');
      field.type = 'text';
      field.readOnly = true;
      field.className = 'share-fallback-input';
      container.appendChild(field);
    }
    if (field) {
      field.value = url;
      field.setAttribute('aria-label', inputLabel);
      if (typeof field.focus === 'function') field.focus();
      if (typeof field.select === 'function') field.select();
    }
    var execOk = false;
    try {
      execOk = Boolean(typeof document !== 'undefined' && typeof document.execCommand === 'function' && document.execCommand('copy'));
    } catch (_) {
      execOk = false;
    }
    // Never overwrite an icon-only button; the status region reports the state.
    if (execOk && button && !button.querySelector('svg')) button.textContent = copiedText;
    if (statusEl) {
      statusEl.textContent = execOk
        ? 'Link copied to clipboard.'
        : 'Clipboard unavailable — link selected to copy.';
    }
    return { method: execOk ? 'execCommand' : 'input', url: url };
  }

  async function copyLink(url, opts) {
    var options = opts || {};
    var button = options.button;
    var statusEl = options.statusEl;
    var container = options.container;
    var copiedText = options.copiedText || 'Link copied';
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(url);
        // Text buttons still swap their label, as before. Icon-only buttons
        // keep their glyph and report through the live region instead.
        if (button && !button.querySelector('svg')) button.textContent = copiedText;
        if (statusEl) statusEl.textContent = 'Link copied to clipboard.';
        var old = container && container.querySelector ? container.querySelector('.share-fallback-input') : null;
        if (old && typeof old.remove === 'function') old.remove();
        return { method: 'clipboard', url: url };
      } catch (_) {
        return showFallbackInput(url, options);
      }
    }
    return showFallbackInput(url, options);
  }

  async function shareLink(payload, opts) {
    var options = opts || {};
    var url = payload.url;
    var data = { url: url };
    if (payload.title) data.title = payload.title;
    if (payload.text) data.text = payload.text;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share(data);
        if (options.button && !options.button.querySelector('svg')) {
          options.button.textContent = options.sharedText || 'Link shared';
        }
        if (options.statusEl) options.statusEl.textContent = 'Link shared.';
        return { method: 'share', url: url };
      } catch (err) {
        if (err && err.name === 'AbortError') {
          if (options.statusEl) options.statusEl.textContent = 'Share cancelled.';
          return { method: 'aborted', url: url };
        }
      }
    }
    return copyLink(url, {
      button: options.copyButton || options.button,
      container: options.container,
      statusEl: options.statusEl,
      inputLabel: options.inputLabel,
      copiedText: options.copiedText || 'Link copied'
    });
  }

  function highlightTarget(el, opts) {
    if (!el) return;
    var options = opts || {};
    el.tabIndex = -1;
    if (el.classList) {
      el.classList.add('is-deeplink-target', 'is-deeplink-flash');
    }
    if (typeof el.setAttribute === 'function') {
      el.setAttribute('data-deeplink', 'active');
    }
    if (options.focus !== false && typeof el.focus === 'function') {
      try { el.focus({ preventScroll: true }); } catch (_) { try { el.focus(); } catch (__) {} }
    }
    if (options.scroll !== false && typeof el.scrollIntoView === 'function') {
      try { el.scrollIntoView({ block: 'center' }); } catch (_) {}
    }
    if (typeof setTimeout === 'function' && el.classList) {
      setTimeout(function () {
        el.classList.remove('is-deeplink-flash');
      }, 2400);
    }
  }

  window.SUBJECT_LABELS = LABELS;
  window.subjectLabel = subjectLabel;
  window.StudyShare = {
    copy: copyLink,
    share: shareLink,
    highlight: highlightTarget
  };
})();
