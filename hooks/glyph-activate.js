#!/usr/bin/env node
// glyph — Claude Code SessionStart activation hook
//
// Runs on every session start:
//   1. Writes flag file at ~/.claude/.glyph-active (statusline reads this)
//   2. Emits glyph ruleset (caveman + visual rules) as hidden SessionStart context
//   3. Detects missing statusline config and emits setup nudge

const fs = require('fs');
const path = require('path');
const os = require('os');
const { getDefaultMode, getSessionMode, setSessionMode, clearSessionMode } = require('./glyph-config');

const claudeDir = path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.glyph-active');
const settingsPath = path.join(claudeDir, 'settings.json');

// Session flag wins for stickiness across resumes; default re-asserts when missing.
const mode = getSessionMode() || getDefaultMode();

if (mode === 'off') {
  clearSessionMode();
  process.stdout.write('OK');
  process.exit(0);
}

// 1. Persist active mode to flag (idempotent — also what statusline reads)
try { setSessionMode(mode); } catch (e) { /* best-effort */ }

// 2. Emit ruleset filtered to active intensity. Reads SKILL.md so edits propagate.
let skillContent = '';
try {
  skillContent = fs.readFileSync(
    path.join(__dirname, '..', 'skills', 'glyph', 'SKILL.md'), 'utf8'
  );
} catch (e) { /* standalone install — fallback below */ }

let output;

if (skillContent) {
  const body = skillContent.replace(/^---[\s\S]*?---\s*/, '');

  // Filter intensity table: keep header rows + only active level row
  const filtered = body.split('\n').reduce((acc, line) => {
    const tableRowMatch = line.match(/^\|\s*\*\*(\S+?)\*\*\s*\|/);
    if (tableRowMatch) {
      if (tableRowMatch[1] === mode) acc.push(line);
      return acc;
    }
    const exampleMatch = line.match(/^- \*\*(\S+?)\*\*:\s/);
    if (exampleMatch) {
      if (exampleMatch[1] === mode) acc.push(line);
      return acc;
    }
    acc.push(line);
    return acc;
  }, []);

  output = 'GLYPH MODE ACTIVE — level: ' + mode + '\n\n' + filtered.join('\n');
} else {
  // Fallback minimum ruleset
  output =
    'GLYPH MODE ACTIVE — level: ' + mode + '\n\n' +
    'Speak less. Show more. Two layers fused:\n\n' +
    '## Lexical (caveman)\n' +
    'Drop articles, filler, pleasantries, hedging. Fragments OK. Short synonyms. ' +
    'Technical terms exact. Code unchanged. Errors quoted exact. ' +
    'Pattern: [thing] [action] [reason] → [next].\n\n' +
    '## Visual (format-selection)\n' +
    'Pick format from content shape:\n' +
    '- Comparing options → markdown table\n' +
    '- Branching logic → ASCII decision tree\n' +
    '- Hierarchy → indented tree (├── └──)\n' +
    '- Sequence → numbered list with → arrows\n' +
    '- Numeric series → sparklines (▁▂▃▄▅▆▇█)\n' +
    '- Counts → block bars (█████░░░)\n' +
    '- Single fact → plain caveman sentence\n\n' +
    '## Persistence\n' +
    'ACTIVE EVERY RESPONSE. No revert. No drift. ' +
    'Off only: "stop glyph" / "normal mode". ' +
    'Switch level: /glyph lite|full|ultra.\n\n' +
    '## Auto-clarity\n' +
    'Drop visual mode for: security warnings, errors, single-fact answers, destructive confirmations. ' +
    'Resume after.\n\n' +
    '## Boundaries\n' +
    'Code/commits/PRs: normal markdown. Level persists until changed or session end.';
}

// 3. Statusline nudge
try {
  let hasStatusline = false;
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    if (settings.statusLine) hasStatusline = true;
  }

  if (!hasStatusline) {
    const isWindows = process.platform === 'win32';
    const scriptName = isWindows ? 'glyph-statusline.ps1' : 'glyph-statusline.sh';
    const scriptPath = path.join(__dirname, scriptName);
    const command = isWindows
      ? `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`
      : `bash "${scriptPath}"`;
    const snippet =
      '"statusLine": { "type": "command", "command": ' + JSON.stringify(command) + ' }';
    output += "\n\n" +
      "STATUSLINE SETUP NEEDED: glyph plugin includes a statusline badge ([GLYPH], [GLYPH:ULTRA]). " +
      "Not configured yet. To enable, add to ~/.claude/settings.json: " +
      snippet + " " +
      "Proactively offer to set this up on first interaction.";
  }
} catch (e) { /* silent */ }

process.stdout.write(output);
