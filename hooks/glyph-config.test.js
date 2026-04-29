// glyph-config tests — caveman-style split between persistent default and session flag.
// Run with: node --test hooks/glyph-config.test.js

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

function freshHome(t) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'glyph-test-'));
  const prev = {
    HOME: process.env.HOME,
    XDG: process.env.XDG_CONFIG_HOME,
    DEF: process.env.GLYPH_DEFAULT_MODE,
  };
  process.env.HOME = tmp;
  delete process.env.XDG_CONFIG_HOME;
  delete process.env.GLYPH_DEFAULT_MODE;
  delete require.cache[require.resolve('./glyph-config')];

  t.after(() => {
    process.env.HOME = prev.HOME;
    if (prev.XDG !== undefined) process.env.XDG_CONFIG_HOME = prev.XDG;
    if (prev.DEF !== undefined) process.env.GLYPH_DEFAULT_MODE = prev.DEF;
    fs.rmSync(tmp, { recursive: true, force: true });
    delete require.cache[require.resolve('./glyph-config')];
  });

  return tmp;
}

// Captures the persistence bug: "stop glyph" must NOT permanently disable.
// Caveman parity — clearing the session flag reverts to default 'full', not 'off'.
test('clearSessionMode reverts to default on next read', (t) => {
  freshHome(t);
  const cfg = require('./glyph-config');

  cfg.setSessionMode('off');
  assert.equal(cfg.getSessionMode(), 'off');

  cfg.clearSessionMode();
  assert.equal(cfg.getSessionMode(), null);
  assert.equal(cfg.getDefaultMode(), 'full');
});
