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

/* --- Theme Font Stack Interception --- */
:root {
  --dsw-font-family: 'Vazirmatn-DSH-Persian', "Anthropic Sans Web Text", "Claude Style Inter", "Noto Sans SC", "Source Han Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --dsh-claude-font-serif: 'Vazirmatn-DSH-Persian', "Anthropic Serif Web Text", "Claude Style Noto Serif", Georgia, "Times New Roman", serif;
  --dsh-claude-font-prose: 'Vazirmatn-DSH-Persian', "Anthropic Serif Web Text", "Claude Style Noto Serif", Georgia, "Times New Roman", serif;
  --dsh-claude-font-code: 'Vazirmatn-DSH-Persian', "Anthropic Mono Web", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  --ds-font-family-code: 'Vazirmatn-DSH-Persian', "Anthropic Mono Web", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  --dsh-claude-font-brand: 'Vazirmatn-DSH-Persian', "Anthropic Serif Web Text", Georgia, serif;
}

/* Base Body and Text Controls */
body, input, textarea, select, button, [data-component="chat-message"] {
  font-family: 'Vazirmatn-DSH-Persian', var(--dsw-font-family, system-ui, sans-serif);
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Vazirmatn-DSH-Persian', var(--dsh-claude-font-serif, var(--dsw-font-family, system-ui, sans-serif));
}

/* --- Strict LaTeX & Math Protection (Computer Modern / Latin Modern / KaTeX) --- */
.katex,
.katex *,
.katex-display,
.katex-display *,
.katex-html,
.katex-html *,
math,
math *,
[data-katex],
[data-katex] *,
.math,
.math *,
[data-latex],
[data-latex] * {
  font-family: KaTeX_Math, KaTeX_Main, "Latin Modern Math", "Computer Modern", "STIX Two Math", "Cambria Math", serif !important;
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: isolate !important;
}

.katex .mathnormal {
  font-family: KaTeX_Math, "Latin Modern Math", "Computer Modern", serif !important;
}

.katex .amsrm {
  font-family: KaTeX_AMS, serif !important;
}

.katex .mathbf {
  font-family: KaTeX_Main, serif !important;
  font-weight: bold !important;
}

.katex .mathit {
  font-family: KaTeX_Main, serif !important;
  font-style: italic !important;
}

.katex .mathsf {
  font-family: KaTeX_SansSerif, sans-serif !important;
}

.katex .mathtt {
  font-family: KaTeX_Typewriter, monospace !important;
}

.katex .mathscr,
.katex .mathcal {
  font-family: KaTeX_Script, KaTeX_Caligraphic, serif !important;
}

.katex .mathfrak {
  font-family: KaTeX_Fraktur, serif !important;
}

/* Persian text within LaTeX \\text{} */
.katex .text {
  font-family: 'Vazirmatn-DSH-Persian', KaTeX_Main, serif !important;
}

/* --- Persian Typography Refinements --- */
:is(p, li, blockquote, div):lang(fa),
[dir="rtl"] {
  line-height: 1.75;
  letter-spacing: -0.01em;
}

/* Code blocks, terminals, and preformatted blocks stay strictly LTR */
pre, code, kbd, samp, .cm-editor, .monaco-editor, [data-code-block] {
  direction: ltr !important;
  text-align: left !important;
  font-family: 'Vazirmatn-DSH-Persian', var(--dsh-claude-font-code, "JetBrains Mono", Consolas, monospace) !important;
}
`;

const clientJs = `// dsh-plugin-persian-vazirmatn: Persian Vazirmatn Typography & LaTeX Math Protection
(function() {
  'use strict';
  var STYLE_ID = 'dsh-persian-vazirmatn-styles';
  var CSS = ${JSON.stringify(cssRules)};

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function removeStyles() {
    var el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  }

  function autoDetectPersianDir() {
    // Automatically set dir='auto' on paragraphs if not set
    var selector = '.markdown-body p, [data-component="chat-message"] p';
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n.getAttribute('dir')) {
        n.setAttribute('dir', 'auto');
      }
    }
  }

  var observer = null;
  function startObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function() {
      autoDetectPersianDir();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
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
    ctx.logger('persian-vazirmatn').info('Persian Vazirmatn font & LaTeX protection plugin initialized');
  }
}
`;

fs.writeFileSync(path.join(rootDir, 'lib', 'index.js'), hostJs, 'utf8');
console.log('Generated lib/index.js');
