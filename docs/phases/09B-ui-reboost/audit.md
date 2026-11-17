# Phase 9B — source and owner-screenshot audit

2026-11-17 · base `816ef84` · **research, not a visual sign-off**. The owner supplied ten phone screenshots of the deployed interface, including home, C subject and unit, practice, quiz and papers. No desktop or print screenshot was supplied. This environment has no browser/Chromium/Lighthouse; the agent has not rendered or visually tested the site. Screenshots are evidence of those particular displayed states, not proof of every viewport. See [full reproducible value and selector inventory](inventory.md); `PYTHONPATH=<tinycss2-1.5.1-install> python3 docs/phases/09B-ui-reboost/inventory.py` regenerates it. The dependency is analysis-only, not a site/build dependency.

## Measurements and limitations

| Source measure, 20 first-party stylesheets | Distinct raw values | Declaration occurrences |
|---|---:|---:|
| font-size | 80 | 694 |
| line-height | 20 | 140 |
| font-weight | 11 | 359 |
| letter-spacing | 15 | 100 |
| font-family | 18 | 68 |
| padding and longhands | 270 | 623 |
| margin and longhands | 93 | 398 |
| gap and longhands | 43 | 442 |
| border-radius and longhands | 36 | 439 |
| box-shadow | 84 | 223 |
| z-index | 39 | 88 |

These are syntactic values, not resolved dimensions; e.g. `0`, `0px`, `1rem`, shorthands, custom-property references and `calc()` remain different. The inventory lists each value, property, count and file, sorted lexically; that avoids pretending unlike units can be ordered as physical lengths. CSS `font` shorthand, custom-property definitions, inline styles, media applicability, inheritance, dynamic markup and browser defaults are not resolved. **Actual number of font sizes used on a phone cannot be computed from source alone**: it depends on the page, viewport width, cascade, computed values and visible DOM. A browser/computed-style capture on specified pages and width is needed; 80 is the tree-wide raw `font-size` value count, not a phone count. The substantial number of distinct spacings is evidence against a consistently enforced 4/8 scale, not proof that each is visually different.

### Colour and alpha

The inventory counts `var(--c-...)` references in first-party CSS (not page/JS inline references): 735 references, of which `--c-white` has 132, `--c-black` 15; 49 of the 302 palette entries have **zero CSS references**. This does not mean 49 unused site-wide: the strict checker also scans shipped HTML/JS and reports 0 unused palette entries. Frequency is source reference frequency, not pixels or screen frequency. See the full 302-row table for each token and files.

Prior Phase 9 documents recorded **373 `rgba()` occurrences / 188 distinct**. Recounting parsed declaration values now yields **384 occurrences / 197 distinct serialized expressions**, including custom property declarations and nested functions; a simple comment-stripped regex reports 385 / 197. Those counts use different extraction methods; the prior method was not recorded, so the difference is **not** attributed to a UI change. No CSS has been changed. The complete parsed list and locations are in the inventory. This does not include `rgb()` or inline style/JS values. **Decision:** tokenise alpha colours in this phase, but first extend the strict checker and negative tests to cover all first-party CSS, inline styles and relevant JS style literals, with explicit justified exceptions; only then migrate in small color-equivalent batches. Do not claim alpha coverage until the new gate proves it. Use alpha-capable tokens in `variables.css`, not a second token file. Run contrast audit before and after; it measures token pairs, not composited gradients/overlays.

## Components and states

The linked inventory lists each matching component class by file. Lexical candidate counts (file/class pairs, including sub-elements and modifiers, **not** independent visual variants): button 87, card 110, pill/badge/chip 86, panel/notice/alert 26, table 5, form 19. They are an upper-bound proxy, not an exhaustive semantic count: plain element selectors and dynamically named components are also used. Concrete duplicated implementations include home `.cta-btn`, `.icon-btn`, `.stat-card` (`assets/css/main.css`); practice `.action-btn`, `.chip`, `.preset-card` (`practice/css/index.css`) and `.q-card` (`practice/css/session.css`); quiz `.btn`, `.card`, `.badge`, `.option-card` (`quiz/css/common.css`); PYQ `.filter-btn`, `.subject-header`, `.paper-item` (`pyq/css/index.css`); study `.navbar`, `.info-item`, `.section-card`, topic cards and tables (`subjects/units-com/common.css`); discovery native controls, `.candidate-badge`, `.topic-chip` and tables (`assets/css/discovery.css`). JS creates notes and mistake queue controls without matching shared visual systems (`assets/js/section-notes.js`, `assets/js/quiz-support.bundle.js`). Native table/form selectors are not captured by class counts. Deriving a true number of visual variants requires rendered states; do not treat these lexical counts as that number.

- **Hover/focus/active/disabled:** quiz explicitly has `.btn` focus/disabled/active and variant hover (`quiz/css/common.css:355–516`); practice has action/button/chip focus and active and action disabled (`practice/css/index.css:470–479, 631–649, 767`). Discovery declares a general focus ring (`assets/css/discovery.css:8`) but no discovery-specific hover/active/disabled selectors; browser/global behavior may still apply. PYQ index declares hover for navigation/filter/subject/paper (`pyq/css/index.css:77–78, 138, 168, 232`), but no index-specific `:focus-visible`/`:disabled`/`:active` selector; global/browser styles may apply. Full selector counts are in the inventory, not element-by-element coverage.
- **Empty/loading/error:** practice defines `.empty-state`, `.loading-screen`, dropdown empty (`practice/css/index.css:174, 591, 665`); PYQ defines `.loading-state`/`.error-state` (`pyq/css/index.css:286`); quiz has independently styled states in its sheets. Discovery uses status text and dynamic results (`search.html:28`), without a named shared state system. Screenshot examples show unstyled-looking mistake queue and note controls, but this observation is limited to those supplied states. Verify dynamic failure, disabled and empty states with owner screenshots before saying each is styled.
- **Shared print/update:** print button is injected by `assets/js/accessibility.js:25–34`, and only its print-hide rule was found in the CSS (`assets/css/base.css:68`); screenshots show different native-looking presentations. `.pwa-panel` has its own sticky surface (`assets/css/base.css:107–113`); the supplied home screenshot shows it occupying space above bottom navigation. Never suppress the update warning or unsafe-quiz message.

## Shell map

| Family | Header/navigation and breadcrumb | Footer | Width and heading evidence |
|---|---|---|---|
| Home | `index.html:122–177` title/breadcrumb, four direct links, theme/menu; bottom nav `:376` | menu footer `:491` | `assets/css/variables.css:446` 1200px max; page-specific greeting and heading in `assets/css/main.css` |
| Discovery/search | inline links inside `<main>`; no shared app header/breadcrumb (`search.html:28`) | no common footer in that page | `assets/css/discovery.css:2` 960px; native h1 sizing |
| Practice | separate back, centered logo/title/count, search/theme (`practice/index.html:41–61`, session `:40–63`) | no shared site footer | `practice/css/index.css:64` 900px; page-specific title; session counter is header with screen-reader h1 |
| Quiz | QuizApp logo, search, history, theme (`quiz/index.html:41–100`); no shared breadcrumb | `quiz/index.html:575–581` | `quiz/css/common.css:346` 768px container, 480px narrow container; separate hero heading `quiz/index.html:119` |
| PYQ | back, Previous Year Papers, search/theme and horizontal filters (`pyq/index.html:36–59`); no breadcrumb | no common footer on index | `pyq/css/index.css:102` 768px; header h1 |
| Subject / unit | `.navbar`, drawer, separate decorative hero (`subjects/CST201/index.html:256–272, 309–332`; `subjects/CST201/units/unit-1.html:152–165`); unit discovery adds context | drawer footer, page-specific footer | `subjects/units-com/common.css:476, 979, 1137` 1100px; headings `:320–368`, hero `:986` |
| Roadmap | separate `.app-header`, back and theme (`roadmap/index.html:40–55`) | page-specific | `roadmap/index.css:158,255` 640/720px |

The owner screenshots also show mismatched light/dark chrome in quiz, oversized/fragmented home header at phone width, distinct orange and blue unit shells, and native-looking note/mistake/print controls. They do not show desktop or a reliable printed output.

## Accessibility baseline

On this checkout `python3 scripts/audit_accessibility.py --fail` reports 74 pages with main, skip link and one h1; 47 token contrast pairs, 0 below requirement; 14/20 sheets animate, 19/20 have reduced-motion rules, all 74 pages load the global override; 0 declared control rules below 24×24; 0 findings. `assets/css/base.css:52–104` retains print rules. Static checks do not prove actual target sizes, composited contrast, visible focus, motion, reflow, or print on devices. `python3 scripts/check_tokens.py --strict`: 302 palette entries, 0 findings, **hex gate only**. `python3 scripts/audit_page_weight.py --budget`: pass; this checks CSS/JS byte budgets, not all dynamic per-view requests.

## Ranked issues — impact / risk

1. Phone home header crowding and clipped menu, supplied screenshot + `index.html:122–177`: fit priority actions into a responsive header and keep all links reachable.
2. Note controls appear browser-default in unit and practice screenshots; `assets/js/section-notes.js:26–28` has no shared note treatment: style the existing controls without changing storage.
3. Mistake queue looks detached in practice/quiz screenshots; `assets/js/quiz-support.bundle.js` injects it: use an existing panel and button language.
4. Print action appears inconsistent/native in several screenshots; `assets/js/accessibility.js:25–34`: style the existing control, preserve print rules.
5. Update banner crowds home bottom nav in owner screenshot; `assets/css/base.css:107`: coordinate safe layout, retain message and action.
6. Five independent header systems (shell table): align typography, spacing and action hierarchy without removing navigation.
7. Quiz screenshot has light header on dark body; `quiz/css/common.css` theme aliases: align surfaces, measure both themes.
8. Subject hero has particles, motion and many badges (`subjects/CST201/index.html:309–332`): quiet the decoration without dropping metadata.
9. Unit screen contains multiple floating actions and progress overlay (supplied screenshot; `subjects/units-com/common.css`): coordinate spacing/z-order without hiding actions.
10. 80 raw font-size and 270 padding values: converge on a small scale in reviewed areas, avoid blind global rewrite.
11. 84 raw shadow and 36 radius values: reduce styles in reviewed components, preserving selected, error and focus cues.
12. Practice question screenshot has many competing high-contrast badges and action groups (`practice/session.html:199–202`): use calmer secondary treatments while preserving meaning.
13. Discovery has a different native form/table vocabulary (`assets/css/discovery.css:5–14`): adopt shared controls and empty/error hierarchy.
14. Colour references span 302 palette entries and 197 alpha expressions: introduce semantic alpha tokens safely, prove exact equivalence and contrast before reducing palette choices.


## Batch 1A update

The strict token checker initially used a conservative per-file `rgba()` legacy ledger of 397 occurrences outside token definitions (369 CSS, 25 HTML, 3 JS); batch 1B removed five and leaves 392. It rejects changed/added/removal-count mismatches until the ledger is intentionally ratcheted and allows alpha definitions in `variables.css`. Zero findings means **the legacy inventory matches**, not that alpha colours are tokenised. This scanner does not parse all JS-generated/escaped colours or modern `rgb()` alpha syntax; see the batch record. No rendered colours changed.
