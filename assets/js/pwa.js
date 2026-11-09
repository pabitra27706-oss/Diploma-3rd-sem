/* Shared progressive enhancement. No storage, telemetry, or automatic reload. */
(() => {
  'use strict';
  const base = new URL('../../', document.currentScript.src);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const panel = document.createElement('aside');
  panel.className = 'pwa-panel';
  panel.setAttribute('aria-label', 'App installation and updates');
  document.body.append(panel);
  const button = (label, action) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label; b.addEventListener('click', action);
    panel.append(b); return b;
  };
  let promptEvent;
  const install = button('Install app', async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    console.info('[Install]', choice.outcome);
    promptEvent = null; install.hidden = true;
  });
  install.hidden = true;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); promptEvent = event;
    if (!standalone) install.hidden = false;
  });
  window.addEventListener('appinstalled', () => { install.hidden = true; });
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios && !standalone) {
    const steps = document.createElement('p');
    steps.textContent = 'Install on iOS: open in Safari, tap Share, then Add to Home Screen.';
    panel.append(steps);
  }
  if (!('serviceWorker' in navigator)) return;
  let notified = false;
  let hadController = Boolean(navigator.serviceWorker.controller);
  function showUpdate(registration) {
    if (notified) return;
    notified = true;
    const message = document.createElement('p');
    message.setAttribute('role', 'status');
    message.textContent = 'New version available. Finish and save any quiz before reloading.';
    panel.append(message);
    button('Reload to update', () => {
      if (!window.confirm('Reload now? Finish and save your quiz first; unsaved work may be lost.')) return;
      if (registration.waiting) {
        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else location.reload();
    });
  }
  navigator.serviceWorker.register(new URL('sw.js', base), { scope: base.pathname }).then(registration => {
    if (registration.waiting) showUpdate(registration);
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(registration);
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Other tabs must not reload a student's attempt automatically.
      if (hadController && navigator.serviceWorker.controller) showUpdate(registration);
      hadController = Boolean(navigator.serviceWorker.controller);
    });
  }).catch(error => console.warn('[Offline support unavailable]', error));
})();
