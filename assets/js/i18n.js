/* UI labels only; educational source text is never translated.
 *
 * Phase 7.3: a tiny first-party loader, no build step and no third party.
 * - The catalog for the active language is fetched from assets/i18n/<lang>.json.
 *   English is never fetched: the markup is authored in English and is the
 *   fallback, so the default path costs no request.
 * - Elements carry data-i18n="key"; their English markup is the fallback, so a
 *   missing key shows the authored English text, never a raw key.
 * - <html lang> follows the active UI language; the choice is persisted in the
 *   single Phase 6 preference record (StudyStorage.prefs().lang), never a
 *   second storage key.
 * - Question and study content stays in its authored language.
 */
(() => {
  'use strict';
  const base = new URL('../../', document.currentScript.src);
  const catalogs = new Map();

  function activeLanguage() {
    try {
      const chosen = StudyStorage.prefs().lang || 'en';
      return chosen === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  }

  async function catalogFor(language) {
    if (catalogs.has(language)) return catalogs.get(language);
    const response = await fetch(new URL('assets/i18n/' + language + '.json', base));
    if (!response.ok) throw new Error('catalog unavailable');
    const catalog = await response.json();
    catalogs.set(language, catalog);
    return catalog;
  }

  async function apply() {
    const language = activeLanguage();
    document.documentElement.lang = language;
    let catalog = {};
    if (language !== 'en') {
      /* Phase 9.2: English is the authored markup, so the default language needs
         no catalog request at all (one fewer request on every page). The English
         catalog stays in assets/i18n/en.json as the reference used by the
         key-parity test, never fetched at runtime. */
      try {
        catalog = await catalogFor(language);
      } catch {
        /* English markup remains the fallback. */
      }
    }
    for (const element of document.querySelectorAll('[data-i18n]')) {
      const value = catalog[element.dataset.i18n];
      if (typeof value === 'string') element.textContent = value;
      /* Translated labels keep the page's primary language; untranslated
         elements therefore stay in English and keep English semantics. */
      if (language !== 'en') element.lang = language;
      else element.removeAttribute('lang');
    }
    document.dispatchEvent(new CustomEvent('study-language-applied', { detail: { language } }));
  }

  /* A switch from the UI persists through the Phase 6 boundary; the change
     event re-applies without a reload. */
  window.StudyI18n = {
    apply,
    setLanguage(language) {
      if (!['en', 'bn'].includes(language)) throw new Error('Unsupported UI language');
      StudyStorage.setPrefs({ lang: language });
      return language;
    },
    get language() { return activeLanguage(); }
  };

  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('study-preferences-change', apply);
})();
