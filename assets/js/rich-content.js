/* Shared structured answer & rich-content parser/renderer (Phase 18.1).
   Zero-dependency AST with two output backends:
     - renderDom(doc, container, text, opts): pure createElement/createTextNode (zero innerHTML)
     - renderHtml(text, opts) / renderPrintHtml(text): escaped HTML string for legacy views & print
   Supports headings, bullet/numbered lists, pipe-safe GFM tables, fenced code/ASCII diagrams,
   blockquotes, horizontal rules, > [!COMPARE] comparison boxes, and > [!MARKS|FORMULA|KEY|TRAP] callouts. */
(function (root) {
  'use strict';

  var CALLOUT_BADGES = {
    marks: 'Mark Allocation',
    formula: 'Key Formula',
    key: 'Key Takeaway',
    trap: 'Exam Watchout'
  };

  var LANG_LABELS = {
    c: 'C',
    cpp: 'C++',
    'c++': 'C++',
    py: 'Python',
    python: 'Python',
    js: 'JavaScript',
    javascript: 'JavaScript',
    sql: 'SQL',
    bash: 'Shell',
    sh: 'Shell',
    pseudo: 'Pseudocode',
    pseudocode: 'Pseudocode',
    asm: 'Assembly',
    assembly: 'Assembly',
    rtl: 'Register Transfer',
    ascii: 'Diagram',
    diagram: 'Diagram',
    text: 'Listing',
    plaintext: 'Listing',
    txt: 'Listing'
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeInput(text) {
    if (!text) return '';
    return String(text)
      .replace(/\r\n?/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
  }

  /* Split a Markdown table row on unescaped `|` outside inline backtick spans. */
  function splitTableRow(line) {
    var s = String(line || '').trim();
    if (!s || s.indexOf('|') === -1) return [];
    var cells = [];
    var cur = '';
    var inTick = false;
    var i = 0;
    while (i < s.length) {
      var ch = s[i];
      if (ch === '\\' && i + 1 < s.length && (s[i + 1] === '|' || s[i + 1] === '`' || s[i + 1] === '\\')) {
        cur += s[i + 1];
        i += 2;
        continue;
      }
      if (ch === '`') {
        inTick = !inTick;
        cur += ch;
        i += 1;
        continue;
      }
      if (ch === '|' && !inTick) {
        cells.push(cur.trim());
        cur = '';
        i += 1;
        continue;
      }
      cur += ch;
      i += 1;
    }
    cells.push(cur.trim());
    if (s[0] === '|' && cells.length && cells[0] === '') cells.shift();
    if (s[s.length - 1] === '|' && (s.length < 2 || s[s.length - 2] !== '\\') && cells.length && cells[cells.length - 1] === '') {
      cells.pop();
    }
    return cells;
  }

  function isTableSeparator(cells) {
    if (!cells || cells.length < 2) return false;
    for (var i = 0; i < cells.length; i += 1) {
      if (!/^:?-{2,}:?$/.test(cells[i].trim())) return false;
    }
    return true;
  }

  function parseAlignments(cells) {
    return cells.map(function (raw) {
      var c = raw.trim();
      var left = c.charAt(0) === ':';
      var right = c.charAt(c.length - 1) === ':';
      if (left && right) return 'center';
      if (right) return 'right';
      if (left) return 'left';
      return '';
    });
  }

  function looksLikeTableStart(lines, idx) {
    var line = lines[idx] ? lines[idx].trim() : '';
    if (!line || line.indexOf('|') === -1) return false;
    var firstCells = splitTableRow(line);
    if (firstCells.length < 2) return false;
    var nextLine = idx + 1 < lines.length ? lines[idx + 1].trim() : '';
    if (!nextLine || nextLine.indexOf('|') === -1) return false;
    var secondCells = splitTableRow(nextLine);
    if (isTableSeparator(secondCells)) return true;
    return line.charAt(0) === '|' && nextLine.charAt(0) === '|' && secondCells.length === firstCells.length;
  }

  /*Conservative legacy unfenced code detector — checked ONLY after headings,
     callouts, tables, blockquotes, rules, and bullet/numbered lists. */
  function isLegacyCodeLine(line) {
    if (!line) return false;
    var t = line.trim();
    if (!t || (t.length < 3 && t !== '{' && t !== '}' && t !== '};')) return false;
    if (/^(?:[-•]|\*(?!\*))\s+/.test(t) || /^\d+[\.\)]\s+/.test(t)) return false;
    return (
      /^#\s*(?:include|define|ifdef|ifndef|endif|pragma)\b/.test(t) ||
      /^(?:int|float|char|void|double|long|short|unsigned|signed|struct|union|enum|typedef)\s+\w+/.test(t) ||
      /^(?:if|else\s+if|while|for|switch)\s*\(/.test(t) ||
      /^(?:printf|scanf|puts|malloc|calloc|realloc|free)\s*\(/.test(t) ||
      /^(?:def|class|from|import|elif)\s+\w+/.test(t) ||
      /^print\s*\(/.test(t) ||
      /^return(?:\s+[^a-zA-Z]|;|$)/.test(t) ||
      /[{};]\s*$/.test(t)
    );
  }

  function detectLanguageLabel(code, rawLang) {
    if (rawLang) {
      var key = String(rawLang).trim().toLowerCase();
      return LANG_LABELS[key] || rawLang.trim();
    }
    if (!code) return 'Code';
    if (/[┌┐└┘├┤┬┴┼─│╔╗╚╝═║]/.test(code) || /\+--[-+]+/.test(code)) return 'Diagram';
    if (/#include\s*</.test(code) || /\bprintf\s*\(/.test(code)) return 'C';
    if (/\bdef\s+\w+\s*\(/.test(code) || /\bimport\s+\w+/.test(code)) return 'Python';
    if (/\bSELECT\b[\s\S]*\bFROM\b/i.test(code)) return 'SQL';
    return 'Code';
  }

  /* Inline tokenizer: protects `code` spans first, then parses **bold** and *italic*. */
  function parseEmphasisSegment(seg) {
    var out = [];
    var re = /\*\*([\s\S]+?)\*\*|__(?!_)([\s\S]+?)__|\*(?!\s|\*)([^*\n]+?)(?<!\s)\*/g;
    var last = 0;
    var m;
    while ((m = re.exec(seg)) !== null) {
      if (m.index > last) {
        out.push({ type: 'text', value: seg.slice(last, m.index) });
      }
      if (m[1] !== undefined || m[2] !== undefined) {
        var inner = m[1] !== undefined ? m[1] : m[2];
        out.push({ type: 'strong', children: [{ type: 'text', value: inner }] });
      } else if (m[3] !== undefined) {
        out.push({ type: 'em', children: [{ type: 'text', value: m[3] }] });
      }
      last = re.lastIndex;
    }
    if (last < seg.length) {
      out.push({ type: 'text', value: seg.slice(last) });
    }
    return out;
  }

  function parseInlines(str) {
    var s = String(str == null ? '' : str);
    if (!s) return [];
    var tokens = [];
    var tickRe = /`([^`\n]+)`/g;
    var last = 0;
    var m;
    while ((m = tickRe.exec(s)) !== null) {
      if (m.index > last) {
        var before = parseEmphasisSegment(s.slice(last, m.index));
        for (var b = 0; b < before.length; b += 1) tokens.push(before[b]);
      }
      tokens.push({ type: 'code', value: m[1] });
      last = tickRe.lastIndex;
    }
    if (last < s.length) {
      var tail = parseEmphasisSegment(s.slice(last));
      for (var t = 0; t < tail.length; t += 1) tokens.push(tail[t]);
    }
    return tokens;
  }

  function parseTableBlock(rawRows, isCompare) {
    if (!rawRows || !rawRows.length) return null;
    var parsedRows = rawRows.map(splitTableRow).filter(function (r) { return r.length >= 2; });
    if (!parsedRows.length) return null;
    var headers = parsedRows[0].map(parseInlines);
    var alignments = [];
    var startRow = 1;
    if (parsedRows.length >= 2 && isTableSeparator(parsedRows[1])) {
      alignments = parseAlignments(parsedRows[1]);
      startRow = 2;
    }
    var bodyRows = [];
    for (var r = startRow; r < parsedRows.length; r += 1) {
      if (isTableSeparator(parsedRows[r])) continue;
      var rowCells = [];
      var colCount = headers.length;
      for (var c = 0; c < colCount; c += 1) {
        rowCells.push(parseInlines(parsedRows[r][c] !== undefined ? parsedRows[r][c] : ''));
      }
      bodyRows.push(rowCells);
    }
    return {
      type: 'table',
      headers: headers,
      alignments: alignments,
      rows: bodyRows,
      isCompare: Boolean(isCompare)
    };
  }

  function parseBlocks(text, depth) {
    var levelDepth = depth || 0;
    var normalized = normalizeInput(text);
    if (!normalized.trim()) return [];
    var lines = normalized.split('\n');
    var blocks = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];
      var trimmed = line.trim();

      if (!trimmed) {
        i += 1;
        continue;
      }

      /* 1. Fenced code / ASCII diagram block */
      if (trimmed.slice(0, 3) === '```') {
        var rawLang = trimmed.slice(3).trim();
        var codeLines = [];
        i += 1;
        while (i < lines.length && lines[i].trim().slice(0, 3) !== '```') {
          codeLines.push(lines[i]);
          i += 1;
        }
        if (i < lines.length) i += 1;
        var rawCode = codeLines.join('\n');
        blocks.push({
          type: 'code',
          rawLang: rawLang.toLowerCase(),
          langLabel: detectLanguageLabel(rawCode, rawLang),
          raw: rawCode
        });
        continue;
      }

      /* 2. Admonition / [!COMPARE] / Blockquote */
      if (trimmed.charAt(0) === '>' && levelDepth < 3) {
        var quoteLines = [];
        while (i < lines.length && lines[i].trim().charAt(0) === '>') {
          quoteLines.push(lines[i].replace(/^\s*>\s?/, ''));
          i += 1;
        }
        var firstQuote = quoteLines[0] ? quoteLines[0].trim() : '';
        var alertMatch = firstQuote.match(/^\[!(COMPARE|MARKS|FORMULA|KEY|TRAP)\]\s*(.*)$/i);
        if (alertMatch) {
          var tag = alertMatch[1].toLowerCase();
          var titleText = (alertMatch[2] || '').trim();
          var innerText = quoteLines.slice(1).join('\n');
          var innerBlocks = parseBlocks(innerText, levelDepth + 1);
          if (tag === 'compare') {
            for (var ib = 0; ib < innerBlocks.length; ib += 1) {
              if (innerBlocks[ib].type === 'table') innerBlocks[ib].isCompare = true;
            }
            blocks.push({
              type: 'compare',
              title: titleText,
              titleInlines: titleText ? parseInlines(titleText) : [],
              children: innerBlocks
            });
          } else {
            blocks.push({
              type: 'callout',
              kind: tag,
              badge: CALLOUT_BADGES[tag] || 'Note',
              title: titleText,
              titleInlines: titleText ? parseInlines(titleText) : [],
              children: innerBlocks.length ? innerBlocks : (titleText ? [] : [{ type: 'p', inlines: parseInlines(firstQuote) }])
            });
          }
        } else {
          var bqChildren = parseBlocks(quoteLines.join('\n'), levelDepth + 1);
          blocks.push({ type: 'blockquote', children: bqChildren });
        }
        continue;
      }

      /* 3. Horizontal rule */
      if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        blocks.push({ type: 'hr' });
        i += 1;
        continue;
      }

      /* 4. Heading (# .. #### clamped to h4/h5 inside cards) */
      var headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        var hashes = headingMatch[1].length;
        blocks.push({
          type: 'heading',
          level: hashes <= 3 ? 4 : 5,
          inlines: parseInlines(headingMatch[2].trim())
        });
        i += 1;
        continue;
      }

      /* 5. Pipe-safe GFM table */
      if (looksLikeTableStart(lines, i)) {
        var tableLines = [];
        while (i < lines.length) {
          var tl = lines[i].trim();
          if (tl && tl.indexOf('|') !== -1 && splitTableRow(tl).length >= 2) {
            tableLines.push(tl);
            i += 1;
          } else {
            break;
          }
        }
        var tbl = parseTableBlock(tableLines, false);
        if (tbl) blocks.push(tbl);
        continue;
      }

      /* 6. Ordered list */
      if (/^\d+[\.\)]\s+/.test(trimmed)) {
        var olItems = [];
        while (i < lines.length && /^\d+[\.\)]\s+/.test(lines[i].trim())) {
          var itemText = lines[i].trim().replace(/^\d+[\.\)]\s+/, '');
          i += 1;
          while (i < lines.length) {
            var cont = lines[i];
            var contTrim = cont.trim();
            if (!contTrim || /^(?:```|>|#{1,4}\s|\d+[\.\)]\s+|(?:[-•]|\*(?!\*))\s+)/.test(contTrim) || looksLikeTableStart(lines, i)) {
              break;
            }
            if (/^\s{2,}\S/.test(cont)) {
              itemText += ' ' + contTrim;
              i += 1;
            } else {
              break;
            }
          }
          olItems.push(parseInlines(itemText));
        }
        blocks.push({ type: 'ol', items: olItems });
        continue;
      }

      /* 7. Unordered list (checked BEFORE legacy code heuristic) */
      if (/^(?:[-•]|\*(?!\*))\s+/.test(trimmed)) {
        var ulItems = [];
        while (i < lines.length && /^(?:[-•]|\*(?!\*))\s+/.test(lines[i].trim())) {
          var uText = lines[i].trim().replace(/^(?:[-•]|\*(?!\*))\s+/, '');
          i += 1;
          while (i < lines.length) {
            var uCont = lines[i];
            var uContTrim = uCont.trim();
            if (!uContTrim || /^(?:```|>|#{1,4}\s|\d+[\.\)]\s+|(?:[-•]|\*(?!\*))\s+)/.test(uContTrim) || looksLikeTableStart(lines, i)) {
              break;
            }
            if (/^\s{2,}\S/.test(uCont)) {
              uText += ' ' + uContTrim;
              i += 1;
            } else {
              break;
            }
          }
          ulItems.push(parseInlines(uText));
        }
        blocks.push({ type: 'ul', items: ulItems });
        continue;
      }

      /* 8. Conservative legacy unfenced multi-line code fallback */
      if (isLegacyCodeLine(trimmed)) {
        var cLines = [];
        while (i < lines.length) {
          var cl = lines[i];
          var clTrim = cl.trim();
          if (!clTrim) {
            var moreCode = false;
            for (var pk = i + 1; pk < Math.min(i + 4, lines.length); pk += 1) {
              var pkTrim = lines[pk].trim();
              if (!pkTrim) continue;
              if (isLegacyCodeLine(pkTrim) || pkTrim === '{' || pkTrim === '}') moreCode = true;
              break;
            }
            if (moreCode) {
              cLines.push(cl);
              i += 1;
              continue;
            }
            break;
          }
          if (isLegacyCodeLine(clTrim) || clTrim === '{' || clTrim === '}' || clTrim === '};' || clTrim === ');' || clTrim.slice(0, 2) === '//') {
            cLines.push(cl);
            i += 1;
          } else {
            break;
          }
        }
        while (cLines.length && !cLines[cLines.length - 1].trim()) cLines.pop();
        if (cLines.length >= 2) {
          var joinedCode = cLines.join('\n');
          blocks.push({
            type: 'code',
            rawLang: '',
            langLabel: detectLanguageLabel(joinedCode, ''),
            raw: joinedCode
          });
        } else {
          for (var lc = 0; lc < cLines.length; lc += 1) {
            if (cLines[lc].trim()) blocks.push({ type: 'p', inlines: parseInlines(cLines[lc].trim()) });
          }
        }
        continue;
      }

      /* 9. Regular paragraph */
      blocks.push({ type: 'p', inlines: parseInlines(trimmed) });
      i += 1;
    }

    return blocks;
  }

  /* ── HTML string backend ──────────────────────────────────────────────── */
  function inlinesToHtml(inlines) {
    if (!inlines || !inlines.length) return '';
    var html = '';
    for (var i = 0; i < inlines.length; i += 1) {
      var tok = inlines[i];
      if (tok.type === 'code') {
        html += '<code>' + escapeHtml(tok.value) + '</code>';
      } else if (tok.type === 'strong') {
        html += '<strong>' + inlinesToHtml(tok.children) + '</strong>';
      } else if (tok.type === 'em') {
        html += '<em>' + inlinesToHtml(tok.children) + '</em>';
      } else {
        html += escapeHtml(tok.value);
      }
    }
    return html;
  }

  function defaultCodeBlockHtml(raw, langLabel) {
    var escaped = escapeHtml(raw);
    var lineCount = (raw.match(/\n/g) || []).length + 1;
    var label = langLabel || 'Code';
    return (
      '<div class="code-block-wrapper">' +
        '<div class="code-block-header">' +
          '<span>' + escapeHtml(label) + (lineCount > 1 ? ' · ' + lineCount + ' lines' : '') + '</span>' +
        '</div>' +
        '<pre><code>' + escaped + '</code></pre>' +
      '</div>'
    );
  }

  function blocksToHtml(blocks, opts) {
    var options = opts || {};
    var isPrint = Boolean(options.print);
    var html = '';

    for (var i = 0; i < blocks.length; i += 1) {
      var b = blocks[i];
      if (b.type === 'p') {
        html += '<p>' + inlinesToHtml(b.inlines) + '</p>';
      } else if (b.type === 'heading') {
        var hTag = b.level === 5 ? 'h5' : 'h4';
        html += '<' + hTag + ' class="rich-heading">' + inlinesToHtml(b.inlines) + '</' + hTag + '>';
      } else if (b.type === 'hr') {
        html += '<hr class="rich-divider">';
      } else if (b.type === 'ul' || b.type === 'ol') {
        var lTag = b.type;
        html += '<' + lTag + ' class="rich-list">';
        for (var li = 0; li < b.items.length; li += 1) {
          html += '<li>' + inlinesToHtml(b.items[li]) + '</li>';
        }
        html += '</' + lTag + '>';
      } else if (b.type === 'code') {
        if (isPrint) {
          html += '<div class="print-code-block"><pre><code>' + escapeHtml(b.raw) + '</code></pre></div>';
        } else if (typeof options.renderCodeBlock === 'function') {
          html += options.renderCodeBlock(b.raw, b.langLabel, b.rawLang);
        } else {
          html += defaultCodeBlockHtml(b.raw, b.langLabel);
        }
      } else if (b.type === 'table') {
        var wrapCls = b.isCompare ? 'compare-table-wrap table-wrapper' : 'rich-table-wrap table-wrapper';
        var tblCls = b.isCompare ? 'compare-table rich-table' : 'rich-table';
        html += '<div class="' + wrapCls + '"><table class="' + tblCls + '"><thead><tr>';
        for (var h = 0; h < b.headers.length; h += 1) {
          var alignH = b.alignments[h] ? ' data-align="' + b.alignments[h] + '"' : '';
          html += '<th scope="col"' + alignH + '>' + inlinesToHtml(b.headers[h]) + '</th>';
        }
        html += '</tr></thead><tbody>';
        for (var r = 0; r < b.rows.length; r += 1) {
          html += '<tr>';
          for (var c = 0; c < b.rows[r].length; c += 1) {
            var alignC = b.alignments[c] ? ' data-align="' + b.alignments[c] + '"' : '';
            if (b.isCompare && c === 0) {
              html += '<th scope="row" class="compare-param"' + alignC + '>' + inlinesToHtml(b.rows[r][c]) + '</th>';
            } else {
              html += '<td' + alignC + '>' + inlinesToHtml(b.rows[r][c]) + '</td>';
            }
          }
          html += '</tr>';
        }
        html += '</tbody></table></div>';
      } else if (b.type === 'compare') {
        html += '<figure class="compare-box">';
        html += '<figcaption class="compare-box-header">';
        html += '<span class="compare-box-badge">Comparison</span>';
        if (b.titleInlines && b.titleInlines.length) {
          html += '<span class="compare-box-title">' + inlinesToHtml(b.titleInlines) + '</span>';
        }
        html += '</figcaption>';
        html += '<div class="compare-box-body">' + blocksToHtml(b.children, options) + '</div>';
        html += '</figure>';
      } else if (b.type === 'callout') {
        html += '<aside class="rich-callout rich-callout--' + escapeHtml(b.kind) + '">';
        html += '<div class="rich-callout-header">';
        html += '<span class="rich-callout-badge">' + escapeHtml(b.badge) + '</span>';
        if (b.titleInlines && b.titleInlines.length) {
          html += '<span class="rich-callout-title">' + inlinesToHtml(b.titleInlines) + '</span>';
        }
        html += '</div>';
        if (b.children && b.children.length) {
          html += '<div class="rich-callout-body">' + blocksToHtml(b.children, options) + '</div>';
        }
        html += '</aside>';
      } else if (b.type === 'blockquote') {
        html += '<blockquote class="rich-quote">' + blocksToHtml(b.children, options) + '</blockquote>';
      }
    }
    return html;
  }

  function renderHtml(text, opts) {
    var blocks = parseBlocks(text, 0);
    if (!blocks.length) return '<p class="rich-empty">No content available.</p>';
    return blocksToHtml(blocks, opts || {});
  }

  function renderPrintHtml(text) {
    var blocks = parseBlocks(text, 0);
    if (!blocks.length) return '';
    return '<div class="print-rich-content rich-content">' + blocksToHtml(blocks, { print: true }) + '</div>';
  }

  /* ── Pure DOM backend (element and text-node construction only) ───────── */
  function el(doc, tag, cls, text) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function appendInlinesDom(doc, parent, inlines) {
    if (!inlines || !inlines.length) return;
    for (var i = 0; i < inlines.length; i += 1) {
      var tok = inlines[i];
      if (tok.type === 'code') {
        parent.appendChild(el(doc, 'code', '', tok.value));
      } else if (tok.type === 'strong') {
        var st = el(doc, 'strong');
        appendInlinesDom(doc, st, tok.children);
        parent.appendChild(st);
      } else if (tok.type === 'em') {
        var em = el(doc, 'em');
        appendInlinesDom(doc, em, tok.children);
        parent.appendChild(em);
      } else if (typeof doc.createTextNode === 'function') {
        parent.appendChild(doc.createTextNode(tok.value));
      } else {
        parent.appendChild(el(doc, 'span', '', tok.value));
      }
    }
  }

  function appendBlocksDom(doc, parent, blocks) {
    for (var i = 0; i < blocks.length; i += 1) {
      var b = blocks[i];
      if (b.type === 'p') {
        var p = el(doc, 'p');
        appendInlinesDom(doc, p, b.inlines);
        parent.appendChild(p);
      } else if (b.type === 'heading') {
        var h = el(doc, b.level === 5 ? 'h5' : 'h4', 'rich-heading');
        appendInlinesDom(doc, h, b.inlines);
        parent.appendChild(h);
      } else if (b.type === 'hr') {
        parent.appendChild(el(doc, 'hr', 'rich-divider'));
      } else if (b.type === 'ul' || b.type === 'ol') {
        var list = el(doc, b.type, 'rich-list');
        for (var liIdx = 0; liIdx < b.items.length; liIdx += 1) {
          var li = el(doc, 'li');
          appendInlinesDom(doc, li, b.items[liIdx]);
          list.appendChild(li);
        }
        parent.appendChild(list);
      } else if (b.type === 'code') {
        var wrap = el(doc, 'div', 'code-block-wrapper');
        var hdr = el(doc, 'div', 'code-block-header');
        var lineCount = (b.raw.match(/\n/g) || []).length + 1;
        hdr.appendChild(el(doc, 'span', '', (b.langLabel || 'Code') + (lineCount > 1 ? ' · ' + lineCount + ' lines' : '')));
        wrap.appendChild(hdr);
        var pre = el(doc, 'pre');
        var codeEl = el(doc, 'code', '', b.raw);
        pre.appendChild(codeEl);
        wrap.appendChild(pre);
        parent.appendChild(wrap);
      } else if (b.type === 'table') {
        var tWrap = el(doc, 'div', b.isCompare ? 'compare-table-wrap table-wrapper' : 'rich-table-wrap table-wrapper');
        var tbl = el(doc, 'table', b.isCompare ? 'compare-table rich-table' : 'rich-table');
        var thead = el(doc, 'thead');
        var hRow = el(doc, 'tr');
        for (var hc = 0; hc < b.headers.length; hc += 1) {
          var th = el(doc, 'th');
          th.setAttribute('scope', 'col');
          if (b.alignments[hc]) th.setAttribute('data-align', b.alignments[hc]);
          appendInlinesDom(doc, th, b.headers[hc]);
          hRow.appendChild(th);
        }
        thead.appendChild(hRow);
        tbl.appendChild(thead);
        var tbody = el(doc, 'tbody');
        for (var r = 0; r < b.rows.length; r += 1) {
          var tr = el(doc, 'tr');
          for (var c = 0; c < b.rows[r].length; c += 1) {
            var isParam = b.isCompare && c === 0;
            var cell = el(doc, isParam ? 'th' : 'td', isParam ? 'compare-param' : '');
            if (isParam) cell.setAttribute('scope', 'row');
            if (b.alignments[c]) cell.setAttribute('data-align', b.alignments[c]);
            appendInlinesDom(doc, cell, b.rows[r][c]);
            tr.appendChild(cell);
          }
          tbody.appendChild(tr);
        }
        tbl.appendChild(tbody);
        tWrap.appendChild(tbl);
        parent.appendChild(tWrap);
      } else if (b.type === 'compare') {
        var fig = el(doc, 'figure', 'compare-box');
        var cap = el(doc, 'figcaption', 'compare-box-header');
        cap.appendChild(el(doc, 'span', 'compare-box-badge', 'Comparison'));
        if (b.titleInlines && b.titleInlines.length) {
          var cTitle = el(doc, 'span', 'compare-box-title');
          appendInlinesDom(doc, cTitle, b.titleInlines);
          cap.appendChild(cTitle);
        }
        fig.appendChild(cap);
        var cBody = el(doc, 'div', 'compare-box-body');
        appendBlocksDom(doc, cBody, b.children);
        fig.appendChild(cBody);
        parent.appendChild(fig);
      } else if (b.type === 'callout') {
        var aside = el(doc, 'aside', 'rich-callout rich-callout--' + b.kind);
        var aHdr = el(doc, 'div', 'rich-callout-header');
        aHdr.appendChild(el(doc, 'span', 'rich-callout-badge', b.badge));
        if (b.titleInlines && b.titleInlines.length) {
          var aTitle = el(doc, 'span', 'rich-callout-title');
          appendInlinesDom(doc, aTitle, b.titleInlines);
          aHdr.appendChild(aTitle);
        }
        aside.appendChild(aHdr);
        if (b.children && b.children.length) {
          var aBody = el(doc, 'div', 'rich-callout-body');
          appendBlocksDom(doc, aBody, b.children);
          aside.appendChild(aBody);
        }
        parent.appendChild(aside);
      } else if (b.type === 'blockquote') {
        var bq = el(doc, 'blockquote', 'rich-quote');
        appendBlocksDom(doc, bq, b.children);
        parent.appendChild(bq);
      }
    }
  }

  function clearContainer(container) {
    if (typeof container.replaceChildren === 'function') {
      container.replaceChildren();
    } else {
      while (container.firstChild) container.removeChild(container.firstChild);
    }
  }

  function renderDom(doc, container, text, opts) {
    if (!doc || !container) return;
    clearContainer(container);
    var options = opts || {};
    var blocks = parseBlocks(text, 0);
    if (!blocks.length) {
      if (text) container.textContent = String(text);
      return;
    }
    if (options.compactCard && blocks.length > 5) {
      appendBlocksDom(doc, container, blocks.slice(0, 4));
      var details = el(doc, 'details', 'card-more-detail');
      details.appendChild(el(doc, 'summary', 'card-more-summary', 'Show complete step-by-step derivation'));
      var restWrap = el(doc, 'div', 'card-more-body');
      appendBlocksDom(doc, restWrap, blocks.slice(4));
      details.appendChild(restWrap);
      container.appendChild(details);
      return;
    }
    appendBlocksDom(doc, container, blocks);
  }

  var api = {
    splitTableRow: splitTableRow,
    isTableSeparator: isTableSeparator,
    parseInlines: parseInlines,
    parseBlocks: parseBlocks,
    renderHtml: renderHtml,
    renderPrintHtml: renderPrintHtml,
    renderDom: renderDom
  };

  root.StudyRichContent = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
