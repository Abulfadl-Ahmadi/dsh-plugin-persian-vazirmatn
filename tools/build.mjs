import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const fontPath = path.join(rootDir, 'fonts', 'Vazirmatn[wght].woff2');
if (!fs.existsSync(fontPath)) {
  console.error(`Font file not found: ${fontPath}`);
  process.exit(1);
}

const fontBase64 = fs.readFileSync(fontPath).toString('base64');
console.log(`Read Vazirmatn variable font (${Math.round(fontBase64.length / 1024)} KB base64)`);

const cssRules = `
/* --- Vazirmatn Persian-Only Font Face --- */
@font-face {
  font-family: 'Vazirmatn-DSH-Persian';
  src: url('data:font/woff2;base64,${fontBase64}') format('woff2 supports variations'),
       url('data:font/woff2;base64,${fontBase64}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  /* Strictly Persian and Arabic script characters + Zero-Width Non-Joiner */
  unicode-range: U+0600-06FF, U+0750-077F, U+0870-089F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200F;
}

/* Override all DSH and theme font variables with high specificity */
:root,
html,
body,
body[data-dsh-claude-style],
body[data-dsh-claude-style][data-dsh-claude-typeface],
body[data-dsh-claude-style][data-dsh-claude-typeface="claude"] {
  --dsw-font-family: 'Vazirmatn-DSH-Persian', "Anthropic Sans Web Text", "Claude Style Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  --dsh-claude-font-serif: 'Vazirmatn-DSH-Persian', "Anthropic Serif Web Text", "Claude Style Noto Serif", Georgia, serif !important;
  --dsh-claude-font-prose: 'Vazirmatn-DSH-Persian', "Anthropic Serif Web Text", "Claude Style Noto Serif", Georgia, serif !important;
  --dsh-claude-font-code: 'Vazirmatn-DSH-Persian', "Anthropic Mono Web", "JetBrains Mono", Consolas, monospace !important;
  --ds-font-family-code: 'Vazirmatn-DSH-Persian', "Anthropic Mono Web", "JetBrains Mono", Consolas, monospace !important;
  --dsh-claude-font-brand: 'Vazirmatn-DSH-Persian', "Anthropic Serif Web Text", Georgia, serif !important;
}

/* Direct targeted override on ALL AI chat response and transcript elements, EXCLUDING KaTeX and Math */
[class*="_markdown_"] :is(p, li, blockquote, div):not(.katex):not(.katex *):not([class*="katex"]),
[data-component="chat-message"] :is(p, li, blockquote, div):not(.katex):not(.katex *):not([class*="katex"]),
.markdown-body :is(p, li, blockquote, div):not(.katex):not(.katex *):not([class*="katex"]) {
  font-family: 'Vazirmatn-DSH-Persian', var(--dsw-font-family), system-ui, sans-serif !important;
}

/* UI text, inputs, buttons, menus */
body, input, textarea, select, button {
  font-family: 'Vazirmatn-DSH-Persian', var(--dsw-font-family), system-ui, sans-serif !important;
}

/* Headings */
h1, h2, h3, h4, h5, h6,
[class*="_markdown_"] :where(h1,h2,h3,h4,h5,h6),
.markdown-body :where(h1,h2,h3,h4,h5,h6) {
  font-family: 'Vazirmatn-DSH-Persian', var(--dsh-claude-font-serif, var(--dsw-font-family, system-ui, sans-serif)) !important;
}

/* Code blocks: JetBrains Mono for English, Vazirmatn for Persian comments */
pre, code, kbd, samp, .cm-editor, .monaco-editor, [data-code-block],
[class*="_markdown_"] pre, [class*="_markdown_"] code:not(.katex *) {
  font-family: 'Vazirmatn-DSH-Persian', var(--ds-font-family-code, "JetBrains Mono", Consolas, monospace) !important;
  direction: ltr !important;
  text-align: left !important;
}

/* --- KATEX NATIVE PRESERVATION ---
   Do NOT override font-family on KaTeX!
   KaTeX defines its own fonts (KaTeX_Main, KaTeX_Math, KaTeX_Size1-4, KaTeX_AMS, etc.)
   Only ensure LTR direction so RTL surrounding text does not invert math equations.
*/
.katex,
.katex-display,
.katex-html {
  direction: ltr !important;
  unicode-bidi: isolate !important;
}

.katex-display {
  text-align: center !important;
}

/* Refined Persian paragraph spacing */
:is(p, li, blockquote, div):lang(fa),
[dir="rtl"] {
  line-height: 1.8 !important;
}
`;

const clientJs = `// dsh-plugin-persian-vazirmatn: Persian Vazirmatn Typography & Native KaTeX Math
(function() {
  'use strict';
  var STYLE_ID = 'dsh-persian-vazirmatn-styles';
  var CSS = ${JSON.stringify(cssRules)};

  function injectStyles() {
    var existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.textContent = CSS;
      return;
    }
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.setAttribute('data-plugin', 'dsh-plugin-persian-vazirmatn');
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  function removeStyles() {
    var el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  }

  function autoDetectPersianDir() {
    var selector = '[class*="_markdown_"] p, [data-component="chat-message"] p, .markdown-body p';
    var nodes = document.querySelectorAll(selector);
    var persianRegex = /[\\u0600-\\u06FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n.getAttribute('dir')) {
        var text = (n.textContent || '').trim();
        if (persianRegex.test(text.slice(0, 50))) {
          n.setAttribute('dir', 'rtl');
        }
      }
    }
  }

  var observer = null;
  function startObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function() {
      autoDetectPersianDir();
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Execute immediately on script injection
  try {
    injectStyles();
    if (typeof document !== 'undefined' && document.body) {
      autoDetectPersianDir();
      startObserver();
    }
  } catch (e) {
    console.error('[dsh-plugin-persian-vazirmatn] Direct injection error:', e);
  }

  function createPlugin() {
    return {
      apply: function(ctx) {
        injectStyles();
        autoDetectPersianDir();
        startObserver();

        if (ctx && typeof ctx.effect === 'function') {
          ctx.effect(function() {
            return function() {
              removeStyles();
              stopObserver();
            };
          }, 'persian-vazirmatn.cleanup');
        }
      }
    };
  }

  if (typeof window !== 'undefined' && window.__ModuleLoader__) {
    window.__ModuleLoader__.load({
      id: 'dsh-plugin-persian-vazirmatn',
      factory: function(require) {
        return createPlugin();
      }
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createPlugin();
  }
})();
`;

fs.writeFileSync(path.join(rootDir, 'lib', 'client.js'), clientJs, 'utf8');
console.log('Generated lib/client.js');

const hostJs = `// dsh-plugin-persian-vazirmatn: Host side entry
export const name = 'persianVazirmatn';

export function apply(ctx) {
  if (ctx.logger) {
    ctx.logger('persian-vazirmatn').info('Persian Vazirmatn font & native KaTeX math initialized');
  }
}
`;

fs.writeFileSync(path.join(rootDir, 'lib', 'index.js'), hostJs, 'utf8');
console.log('Generated lib/index.js');
