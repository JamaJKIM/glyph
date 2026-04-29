// glyph-config.js — caveman-style split: persistent default vs per-session flag.
//
// Persistent default (rarely changed):
//   1. GLYPH_DEFAULT_MODE env var
//   2. defaultMode in $XDG_CONFIG_HOME/glyph/config.json
//      (mac/linux: ~/.config/glyph/config.json, win: %APPDATA%\glyph\config.json)
//   3. 'full'
//
// Per-session flag at ~/.claude/.glyph-active:
//   - Written by SessionStart and /glyph commands
//   - Deleted by "stop glyph" / "normal mode" — default re-asserts next session
//   - Read by statusline

const fs = require('fs');
const path = require('path');
const os = require('os');

const VALID_MODES = new Set(['off', 'lite', 'full', 'ultra']);
const DEFAULT_MODE = 'full';

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'glyph');
  }
  if (process.platform === 'win32') {
    return path.join(
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
      'glyph'
    );
  }
  return path.join(os.homedir(), '.config', 'glyph');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getDefaultMode() {
  const env = process.env.GLYPH_DEFAULT_MODE;
  if (env && VALID_MODES.has(env.toLowerCase())) return env.toLowerCase();

  try {
    const cfg = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
    if (cfg.defaultMode && VALID_MODES.has(cfg.defaultMode.toLowerCase())) {
      return cfg.defaultMode.toLowerCase();
    }
  } catch (e) { /* missing/invalid — fall through */ }

  return DEFAULT_MODE;
}

function sessionFlagPath() {
  return path.join(os.homedir(), '.claude', '.glyph-active');
}

function getSessionMode() {
  try {
    const raw = fs.readFileSync(sessionFlagPath(), 'utf8').trim();
    if (VALID_MODES.has(raw)) return raw;
  } catch (e) { /* no active session */ }
  return null;
}

function setSessionMode(mode) {
  if (!VALID_MODES.has(mode)) {
    throw new Error(`Invalid glyph mode: ${mode}. Valid: ${[...VALID_MODES].join(', ')}`);
  }
  const flag = sessionFlagPath();
  fs.mkdirSync(path.dirname(flag), { recursive: true });
  fs.writeFileSync(flag, mode);
}

function clearSessionMode() {
  try { fs.unlinkSync(sessionFlagPath()); } catch (e) { /* already gone */ }
}

// Legacy alias — kept so external callers don't break. Re-routes to session API.
function setMode(mode) {
  if (mode === 'off') return clearSessionMode();
  return setSessionMode(mode);
}

module.exports = {
  getDefaultMode,
  getSessionMode,
  setSessionMode,
  clearSessionMode,
  setMode,
  getConfigDir,
  getConfigPath,
  VALID_MODES,
  DEFAULT_MODE,
};
