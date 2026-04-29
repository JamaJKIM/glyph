#!/usr/bin/env node
// glyph-mode-tracker — UserPromptSubmit hook
//
// Detects /glyph commands and "stop glyph" in user input. Updates
// ~/.claude/.glyph-mode so next SessionStart picks up the change.
// Also emits inline ruleset for the new mode so the change takes effect
// immediately within the current turn.

const { setMode, getDefaultMode, VALID_MODES } = require('./glyph-config');

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch (e) { process.exit(0); }

  const prompt = (input.user_prompt || input.prompt || '').toLowerCase().trim();

  // Toggle off
  if (/\b(stop glyph|normal mode)\b/.test(prompt)) {
    try { setMode('off'); } catch (e) {}
    process.stdout.write('GLYPH MODE: off — reverting to normal Claude Code output');
    process.exit(0);
  }

  // /glyph-help is a separate skill — bail before /glyph regex eats it
  if (/\/glyph-help\b/.test(prompt)) {
    process.stdout.write('');
    process.exit(0);
  }

  // /glyph or /glyph <level>. Lookahead requires whitespace or end-of-string
  // so /glyph-foo doesn't match /glyph with level=undefined.
  const match = prompt.match(/\/glyph(?=\s|$)(?:\s+(\S+))?/);
  if (match) {
    const level = match[1] || 'full';
    if (VALID_MODES.has(level)) {
      try { setMode(level); } catch (e) {}
      process.stdout.write('GLYPH MODE: ' + level + ' — applied. Visual + terse output active.');
    } else {
      process.stdout.write('GLYPH MODE: invalid level "' + level + '". Valid: lite, full, ultra, off.');
    }
    process.exit(0);
  }

  // No-op for non-glyph prompts
  process.stdout.write('');
});
