#!/usr/bin/env node
// Deterministic production resolver audit, NOT a browser/rendered test.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {ROOT, createMiniDom, createRepoFetch, runScriptIn, flush} = require('../tests/lib/minidom.cjs');
const BASE = 'https://example.test/Diploma-3rd-sem/';
const baseline = process.argv.includes('--baseline');
const base = '47d801b660cea9b417e62f81c2be0803ddc66312';
const original = rel => execFileSync('git', ['show', `${base}:${rel}`], {cwd:ROOT,encoding:'utf8'});
const originalScript = baseline ? original('assets/js/unit-discovery.js') : '';
const unitCache = new Map();
function readUnit(unit) {
  if (!unitCache.has(unit)) {
    const rel=`subjects/CST209/units/unit-${unit}.html`;
    unitCache.set(unit,baseline ? original(rel) : fs.readFileSync(path.join(ROOT,rel),'utf8'));
  }
  return unitCache.get(unit);
}
(async () => {
    const unitDir = 'subjects/CST209/units/';
    const units = Array.from({ length: 5 }, (_, i) => readUnit(i + 1));
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
      const fragment = topic === 'Short notes' ? '#short-notes' : '';
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
        if (baseline && url.includes('topic-map-CST209')) return { ok: false, status: 404 };
        if (baseline && /unit-[1-5]\.html/.test(url)) {
          const number = Number(url.match(/unit-([1-5])\.html/)[1]);
          return { ok: true, text: async () => readUnit(number) };
        }
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
      if (baseline) require('node:vm').runInNewContext(originalScript, win);
      else runScriptIn(win, 'assets/js/unit-discovery.js');
      await flush(4);
      return dom;
    }

 const paperDir=path.join(ROOT,'_data/CST209');
 const qs=fs.readdirSync(paperDir).filter(p=>/-P00[3-6]-.*\.json$/.test(p)).flatMap(p=>JSON.parse(fs.readFileSync(path.join(paperDir,p),'utf8')).questions);
 const rows=[];
 for (const q of qs) {
   const dom=await openTopic(q.unit,q.topic);
   rows.push({id:q.id,topic:q.topic,storedUnit:q.unit,unit:Number(dom.win.location.pathname.match(/unit-(\d+)\.html/)[1]),anchor:dom.win.location.hash.slice(1)});
 }
 const output=path.join(ROOT,'docs/phases/16-cst209-algorithms-content/evidence',baseline?'runtime-before.json':'runtime-after.json');
 fs.writeFileSync(output,JSON.stringify(rows,null,2)+'\n');
 console.log(`${baseline?'baseline':'current'} production resolver: ${rows.length} questions audited -> ${path.relative(ROOT,output)}`);
})().catch(error=>{console.error(error);process.exitCode=1;});
