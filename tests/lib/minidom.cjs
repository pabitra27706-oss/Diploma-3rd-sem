/* Shared deterministic zero-dependency DOM + repo-fetch harness for the
   Node UI regressions (discovery-dom, study-dom, study-offline). It implements
   only the DOM surface those scripts actually use, so an accidental innerHTML,
   layout or network dependency fails loudly instead of passing silently. */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');

const flush = async (rounds = 8) => {
  for (let i = 0; i < rounds; i += 1) {
    await new Promise(resolve => setImmediate(resolve));
  }
};

/* ── Minimal deterministic DOM implementation for VM execution ── */
function createMiniDom(initialUrl) {
  let currentHref = initialUrl;
  const winListeners = new Map();
  const docListeners = new Map();
  const historyStack = [initialUrl];
  let historyIdx = 0;
  let activeEl = null;

  function makeClassList(el) {
    return {
      _set() {
        return new Set(String(el.className || '').split(/\s+/).filter(Boolean));
      },
      _sync(s) {
        el.className = [...s].join(' ');
      },
      add(...names) {
        const s = this._set();
        names.filter(Boolean).forEach(n => s.add(n));
        this._sync(s);
      },
      remove(...names) {
        const s = this._set();
        names.forEach(n => s.delete(n));
        this._sync(s);
      },
      toggle(name, force) {
        const s = this._set();
        const on = force === undefined ? !s.has(name) : Boolean(force);
        if (on) s.add(name);
        else s.delete(name);
        this._sync(s);
        return on;
      },
      contains(name) {
        return this._set().has(name);
      }
    };
  }

  class MiniNode {
    constructor(nodeType, tagName, text) {
      this.nodeType = nodeType;
      this.tagName = tagName ? String(tagName).toUpperCase() : '';
      this._text = text || '';
      this.children = [];
      this.parentNode = null;
      this.attributes = new Map();
      this.dataset = new Proxy({}, {
        set: (obj, prop, val) => {
          obj[prop] = String(val);
          const kebab = 'data-' + String(prop).replace(/[A-Z]/g, m => '-' + m.toLowerCase());
          this.attributes.set(kebab, String(val));
          return true;
        },
        get: (obj, prop) => obj[prop]
      });
      this.listeners = new Map();
      this.style = {};
      this.hidden = false;
      this.tabIndex = 0;
      this.value = '';
      this.options = [];
      this.onclick = null;
      this.onsubmit = null;
      this.onchange = null;
      this.oninput = null;
      this.classList = makeClassList(this);
      this._selected = false;
      this._scrolled = false;
    }

    get isConnected() {
      let cur = this;
      while (cur) {
        if (cur === doc.body || cur === doc.documentElement) return true;
        cur = cur.parentNode;
      }
      return false;
    }

    get id() { return this.attributes.get('id') || ''; }
    set id(v) { if (v) this.attributes.set('id', String(v)); else this.attributes.delete('id'); }

    get className() { return this.attributes.get('class') || ''; }
    set className(v) { this.attributes.set('class', String(v || '')); }

    // Real DOM: childNodes contains text nodes too, and unlike `children` it has
    // no attribute nodes. Callers that walk it to read a heading's own words
    // (assets/js/section-notes.js:labelFor) therefore need this alias.
    get childNodes() { return this.children; }

    get href() { return this.attributes.get('href') || ''; }
    set href(v) { this.attributes.set('href', String(v)); }

    get textContent() {
      if (this.nodeType === 3) return this._text;
      return this.children.map(c => c.textContent).join('');
    }
    set textContent(v) {
      this.children.forEach(c => { c.parentNode = null; });
      this.children = [];
      const str = v === null || v === undefined ? '' : String(v);
      if (str.length) {
        const tn = new MiniNode(3, '', str);
        tn.parentNode = this;
        this.children.push(tn);
      }
    }

    set innerHTML(_v) {
      throw new Error('Unexpected innerHTML sink invoked');
    }

    hasAttribute(name) {
      return this.attributes.has(String(name));
    }

    setAttribute(name, value) {
      const k = String(name);
      const v = String(value);
      this.attributes.set(k, v);
      if (k.startsWith('data-')) {
        const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        this.dataset[camel] = v;
      }
    }
    getAttribute(name) {
      return this.attributes.has(name) ? this.attributes.get(name) : null;
    }
    removeAttribute(name) {
      this.attributes.delete(name);
    }

    appendChild(child) {
      const node = typeof child === 'string' ? new MiniNode(3, '', child) : child;
      if (node.parentNode) node.remove();
      node.parentNode = this;
      this.children.push(node);
      if (this.tagName === 'SELECT' && node.tagName === 'OPTION') {
        this.options.push(node);
      }
      return node;
    }
    append(...items) {
      items.forEach(item => this.appendChild(typeof item === 'string' ? new MiniNode(3, '', item) : item));
    }
    prepend(...items) {
      const nodes = items.map(item => {
        const n = typeof item === 'string' ? new MiniNode(3, '', item) : item;
        if (n.parentNode) n.remove();
        n.parentNode = this;
        return n;
      });
      this.children.unshift(...nodes);
    }
    replaceChildren(...items) {
      this.children.forEach(c => { c.parentNode = null; });
      this.children = [];
      if (this.tagName === 'SELECT') this.options = [];
      this.append(...items);
    }
    remove() {
      if (!this.parentNode) return;
      const idx = this.parentNode.children.indexOf(this);
      if (idx >= 0) this.parentNode.children.splice(idx, 1);
      this.parentNode = null;
    }
    add(optionEl) {
      this.appendChild(optionEl);
    }
    cloneNode(deep) {
      const copy = new MiniNode(this.nodeType, this.tagName, this._text);
      for (const [k, v] of this.attributes.entries()) copy.attributes.set(k, v);
      if (deep) {
        this.children.forEach(ch => copy.appendChild(ch.cloneNode(true)));
      }
      return copy;
    }

    focus() { activeEl = this; }
    blur() { if (activeEl === this) activeEl = doc.body; }
    select() { this._selected = true; }
    scrollIntoView() { this._scrolled = true; }

    addEventListener(type, fn) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(fn);
    }
    dispatchEvent(evt) {
      const e = Object.assign({
        target: this,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }
      }, evt);
      const prop = 'on' + e.type;
      if (typeof this[prop] === 'function') this[prop](e);
      (this.listeners.get(e.type) || []).forEach(fn => fn(e));
      return !e.defaultPrevented;
    }
    click() {
      this.dispatchEvent({ type: 'click' });
    }

    matches(selector) {
      if (this.nodeType !== 1) return false;
      return selector.split(',').map(s => s.trim()).filter(Boolean).some(part => matchCompound(this, part));
    }

    closest(selector) {
      let cur = this;
      while (cur && cur.nodeType === 1) {
        if (cur.matches(selector)) return cur;
        cur = cur.parentNode;
      }
      return null;
    }

    querySelectorAll(selector) {
      const parts = selector.split(',').map(s => s.trim()).filter(Boolean);
      const out = [];
      const walk = node => {
        for (const ch of node.children) {
          if (ch.nodeType === 1) {
            if (parts.some(p => matchChain(ch, p, this))) out.push(ch);
            walk(ch);
          }
        }
      };
      walk(this);
      return out;
    }

    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    }
  }

  function matchCompound(el, compound) {
    let rest = compound;
    const attrs = [];
    rest = rest.replace(/\[([^\]=^]+)([\^=]*)(?:"([^"]*)")?\]/g, (_, name, op, val) => {
      attrs.push({ name, op, val });
      return '';
    });
    const idMatch = rest.match(/#([A-Za-z0-9_-]+)/);
    if (idMatch && el.id !== idMatch[1]) return false;
    rest = rest.replace(/#[A-Za-z0-9_-]+/g, '');
    const classes = [...rest.matchAll(/\.([A-Za-z0-9_-]+)/g)].map(m => m[1]);
    for (const cls of classes) {
      if (!el.classList.contains(cls)) return false;
    }
    rest = rest.replace(/\.[A-Za-z0-9_-]+/g, '').trim();
    if (rest && rest !== '*' && el.tagName !== rest.toUpperCase()) return false;
    for (const a of attrs) {
      const actual = el.getAttribute(a.name);
      if (!a.op) {
        if (actual === null) return false;
      } else if (a.op === '=') {
        if (actual !== a.val) return false;
      } else if (a.op === '^=') {
        if (actual === null || !actual.startsWith(a.val)) return false;
      }
    }
    return true;
  }

  function matchChain(el, chain, scopeRoot) {
    const tokens = chain.trim().split(/\s+/);
    if (!matchCompound(el, tokens[tokens.length - 1])) return false;
    let cur = el.parentNode;
    for (let i = tokens.length - 2; i >= 0; i -= 1) {
      while (cur && cur.nodeType === 1 && !matchCompound(cur, tokens[i])) {
        if (cur === scopeRoot) return false;
        cur = cur.parentNode;
      }
      if (!cur || cur.nodeType !== 1) return false;
      cur = cur.parentNode;
    }
    return true;
  }

  const locationObj = {
    get href() { return currentHref; },
    set href(v) { currentHref = new URL(v, currentHref).href; },
    get origin() { return new URL(currentHref).origin; },
    get pathname() { return new URL(currentHref).pathname; },
    get search() { return new URL(currentHref).search; },
    get hash() { return new URL(currentHref).hash; },
    set hash(v) {
      const u = new URL(currentHref);
      u.hash = v;
      currentHref = u.href;
    }
  };

  const historyObj = {
    replaceState(_state, _title, url) {
      currentHref = new URL(String(url), currentHref).href;
      historyStack[historyIdx] = currentHref;
    },
    pushState(_state, _title, url) {
      currentHref = new URL(String(url), currentHref).href;
      historyStack.splice(historyIdx + 1);
      historyStack.push(currentHref);
      historyIdx = historyStack.length - 1;
    },
    back() {
      if (historyIdx > 0) {
        historyIdx -= 1;
        currentHref = historyStack[historyIdx];
        win.dispatchEvent({ type: 'popstate' });
      }
    }
  };

  const documentElement = new MiniNode(1, 'html');
  const body = new MiniNode(1, 'body');
  documentElement.appendChild(body);
  activeEl = body;

  const head = new MiniNode(1, 'head');
  documentElement.insertBefore ? documentElement.insertBefore(head, body) : documentElement.appendChild(head);

  const doc = {
    title: '',
    currentScript: null,
    documentElement,
    head,
    body,
    get activeElement() { return activeEl; },
    createElement: tag => new MiniNode(1, tag),
    createTextNode: text => new MiniNode(3, '', String(text)),
    querySelector: sel => documentElement.querySelector(sel),
    querySelectorAll: sel => documentElement.querySelectorAll(sel),
    getElementById: id => documentElement.querySelectorAll('*').find(n => n.id === id) || null,
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    },
    dispatchEvent(evt) {
      const e = Object.assign({
        target: activeEl,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; }
      }, evt);
      (docListeners.get(e.type) || []).forEach(fn => fn(e));
      return !e.defaultPrevented;
    }
  };

  class OptionCtor extends MiniNode {
    constructor(text, value) {
      super(1, 'option');
      this.textContent = text;
      this.value = value !== undefined ? String(value) : String(text);
      this.setAttribute('value', this.value);
    }
  }

  const win = {
    document: doc,
    location: locationObj,
    history: historyObj,
    URL,
    URLSearchParams,
    Option: OptionCtor,
    performance: { now: () => 100 },
    matchMedia: () => ({ matches: false }),
    setTimeout,
    clearTimeout,
    requestAnimationFrame: fn => fn(),
    navigator: {},
    console,
    addEventListener(type, fn) {
      if (!winListeners.has(type)) winListeners.set(type, []);
      winListeners.get(type).push(fn);
    },
    dispatchEvent(evt) {
      (winListeners.get(evt.type) || []).forEach(fn => fn(evt));
    },
    setUrlAndPop(nextUrl) {
      currentHref = new URL(nextUrl, currentHref).href;
      win.dispatchEvent({ type: 'popstate' });
    }
  };
  win.window = win;
  win.self = win;

  return { win, doc, MiniNode };
}

function createRepoFetch(baseOriginPath, failOnceFor = null, getBaseHref = null) {
  let failedOnce = false;
  return async input => {
    const rawInput = typeof input === 'string' ? input : input.href;
    const u = getBaseHref ? new URL(rawInput, getBaseHref()) : new URL(rawInput);
    const rawRel = u.pathname.startsWith(baseOriginPath)
      ? u.pathname.slice(baseOriginPath.length)
      : u.pathname.replace(/^\//, '');
    const rel = rawRel === '' || rawRel.endsWith('/') ? rawRel + 'index.html' : rawRel;
    if (failOnceFor && !failedOnce && rel.includes(failOnceFor)) {
      failedOnce = true;
      return { ok: false, status: 503, async json() { throw new Error('offline'); } };
    }
    const disk = path.join(ROOT, rel);
    if (!fs.existsSync(disk) || !fs.statSync(disk).isFile()) {
      return { ok: false, status: 404, async json() { throw new Error('missing'); } };
    }
    const raw = fs.readFileSync(disk, 'utf8');
    return {
      ok: true,
      status: 200,
      url: u.href,
      clone() { return this; },
      async text() { return raw; },
      async json() { return JSON.parse(raw); }
    };
  };
}

function runScriptIn(win, relPath, scriptUrl) {
  const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  if (scriptUrl) {
    const s = win.document.createElement('script');
    s.src = scriptUrl;
    win.document.currentScript = s;
  } else {
    win.document.currentScript = null;
  }
  vm.runInNewContext(code, win, { filename: relPath });
  win.document.currentScript = null;
}

module.exports = { ROOT, assert, createMiniDom, createRepoFetch, runScriptIn, flush };
