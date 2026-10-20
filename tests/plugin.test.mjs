import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('package.json metadata and dsh config', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  assert.equal(pkg.name, 'dsh-plugin-persian-vazirmatn');
  assert.equal(pkg.version, '1.0.0');
  assert.ok(pkg.exports['.']);
  assert.ok(pkg.exports['./client']);
  assert.ok(pkg.dsh.bundle.patch);
  assert.equal(pkg.dsh.client.platform, 'web');
});

test('cordis.patch.yml is valid', () => {
  const patch = fs.readFileSync(path.join(rootDir, 'cordis.patch.yml'), 'utf8');
  assert.ok(patch.includes('dsh-plugin-persian-vazirmatn'));
  assert.ok(patch.includes('persian-vazirmatn'));
});

test('Host entrypoint lib/index.js exports name and apply', async () => {
  const host = await import('../lib/index.js');
  assert.equal(host.name, 'persianVazirmatn');
  assert.equal(typeof host.apply, 'function');

  // Verify apply can run safely
  let logged = false;
  host.apply({
    logger: () => ({ info: () => { logged = true; } })
  });
  assert.equal(logged, true);
});

test('Client script contains unicode-range and LaTeX protection', () => {
  const client = fs.readFileSync(path.join(rootDir, 'lib', 'client.js'), 'utf8');
  assert.ok(client.includes('Vazirmatn-DSH-Persian'), 'declares Vazirmatn-DSH-Persian font');
  assert.ok(client.includes('unicode-range'), 'uses unicode-range');
  assert.ok(client.includes('U+0600-06FF'), 'covers Arabic/Persian unicode range');
  assert.ok(client.includes('U+200C'), 'covers Zero-Width Non-Joiner (ZWNJ)');
  assert.ok(client.includes('.katex'), 'protects .katex class');
  assert.ok(client.includes('KaTeX_Math'), 'preserves KaTeX_Math');
  assert.ok(client.includes('KaTeX_Main'), 'preserves KaTeX_Main');
  assert.ok(client.includes('Computer Modern'), 'preserves Computer Modern');
  assert.ok(client.includes('Latin Modern Math'), 'preserves Latin Modern Math');
  assert.ok(client.includes('direction: ltr !important'), 'forces LTR on math formulas');
});
