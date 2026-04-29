// glyph-mode-tracker — UserPromptSubmit hook
//
// Detects /glyph commands and "stop glyph" in user input. Updates the
// per-session flag at ~/.claude/.glyph-active. Caveman parity:
//   - "stop glyph"  → clearSessionMode (default re-asserts next SessionStart)
//   - /glyph X      → setSessionMode(X) for current session
// Emits a confirmation line so the change is visible inside the same turn.

const { setSessionMode, clearSessionMode, VALID_MODES } = require('./glyph-config');

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch (e) { process.exit(0); }

  const prompt = (input.user_prompt || input.prompt || '').toLowerCase().trim();

  // Toggle off — clear the flag rather than persisting "off". Next session reverts to default.
  if (/\b(stop glyph|normal mode)\b/.test(prompt)) {
    clearSessionMode();
    process.stdout.write('GLYPH MODE: off (this session) — default re-asserts next session');
    process.exit(0);
  }

  // /glyph-help is a separate skill — bail before /glyph regex eats it
  if (/\/glyph-help\b/.test(prompt)) {
    process.stdout.write('');
    process.exit(0);
  }

  // /glyph or /glyph <level>
  const match = prompt.match(/\/glyph(?=\s|$)(?:\s+(\S+))?/);
  if (match) {
    const level = match[1] || 'full';
    if (VALID_MODES.has(level)) {
      try {
        if (level === 'off') {
          clearSessionMode();
          process.stdout.write('GLYPH MODE: off (this session)');
        } else {
          setSessionMode(level);
          process.stdout.write('GLYPH MODE: ' + level + ' — applied. Visual + terse output active.');
        }
      } catch (e) {
        process.stdout.write('GLYPH MODE: error — ' + e.message);
      }
    } else {
      process.stdout.write('GLYPH MODE: invalid level "' + level + '". Valid: lite, full, ultra, off.');
    }
    process.exit(0);
  }

  process.stdout.write('');
});
