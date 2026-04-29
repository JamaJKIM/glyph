// glyph-config.js — reads default mode from ~/.claude/.glyph-mode (or fallback "full")
// Mirrors caveman-config.js pattern.

const fs = require('fs');
const path = require('path');
const os = require('os');

const VALID_MODES = new Set(['off', 'lite', 'full', 'ultra']);
// First-run default is 'full' — auto-activates on every SessionStart, same
// pattern as caveman. Users who want explicit activation can run /glyph off
// or "stop glyph" once. Most installs benefit from immediate visual output.
const DEFAULT_MODE = 'full';

function getDefaultMode() {
  const modePath = path.join(os.homedir(), '.claude', '.glyph-mode');
  try {
    const raw = fs.readFileSync(modePath, 'utf8').trim();
    if (VALID_MODES.has(raw)) return raw;
  } catch (e) { /* file missing — use default */ }
  return DEFAULT_MODE;
}

function setMode(mode) {
  if (!VALID_MODES.has(mode)) {
    throw new Error(`Invalid glyph mode: ${mode}. Valid: ${[...VALID_MODES].join(', ')}`);
  }
  const claudeDir = path.join(os.homedir(), '.claude');
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(path.join(claudeDir, '.glyph-mode'), mode);
}

module.exports = { getDefaultMode, setMode, VALID_MODES, DEFAULT_MODE };
