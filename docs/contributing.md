# Contributing

Glyph is small and opinionated. Most contributions land as small tweaks; some get rejected on scope. Here's the bar.

## What's in scope

| ✔ Welcome | ✗ Out of scope |
|-----------|----------------|
| New format detection rules in core SKILL.md | New skill that's not about visual output |
| Improved per-terminal compatibility | New plugin features unrelated to glyph |
| Bug fixes in hooks (`hooks/*.js`) | Reimplementing tools that exist (claude-mem, tdd-guard, etc.) |
| Benchmark prompts that expose real weaknesses | Marketing/SEO-only changes |
| Fork-track work (`docs/track-2-fork-design.md`) | License changes |
| Doc improvements (architecture, examples) | |

If you're not sure, open an issue first.

## Development setup

```bash
git clone https://github.com/jamesjoonkim/glyph
cd glyph

# Test the hooks locally
node -e "console.log(require('./hooks/glyph-config').getDefaultMode())"
echo "{}" | node hooks/glyph-activate.js

# Symlink into your CC marketplace dir for live editing
ln -sfn "$(pwd)" ~/.claude/plugins/marketplaces/glyph

# Reinstall to pick up changes
claude plugin uninstall glyph@glyph
claude plugin install glyph@glyph

# Or in Claude Code:
/reload-plugins
```

## Testing changes

For SKILL.md edits — invoke the skill in Claude Code and verify the output matches expectations.

For hook changes — run the smoke test:

```bash
# 1. config loads
node -e "console.log(require('./hooks/glyph-config').getDefaultMode())"
# expected: full

# 2. activate hook emits ruleset
echo "{}" | node hooks/glyph-activate.js | head -10
# expected: GLYPH MODE ACTIVE — level: full

# 3. mode tracker parses /glyph
echo '{"user_prompt": "/glyph lite"}' | node hooks/glyph-mode-tracker.js
# expected: GLYPH MODE: lite — applied

# 4. statusline emits ANSI badge
echo "full" > ~/.claude/.glyph-active && bash hooks/glyph-statusline.sh
# expected: ANSI-orange [GLYPH]

# Cleanup
echo "off" > ~/.claude/.glyph-mode
```

For benchmark changes — run the full three-step harness against your branch and compare to main:

```bash
cd benchmarks
export ANTHROPIC_API_KEY=sk-ant-...
uv run python llm_run.py
uv run --with tiktoken python measure.py
uv run --with anthropic python judge.py
```

## Code conventions

- **Plain Node.js** for hooks. No dependencies. Boot time matters.
- **ASCII-only** in `SKILL.md` examples. UTF-8 box-drawing chars are fine; no emoji-only examples.
- **No behavior in hooks that should live in SKILL.md.** SKILL.md is the source of truth.
- **No version bumps** without ranging the change in CHANGELOG.md (when it exists).

## Commit style

Conventional Commits. Subject ≤50 chars, imperative, no period.

```
feat(skill): add 2x2 tradeoff format
fix(hook): mode tracker ignored /glyph-help
docs(readme): correct benchmark numbers
chore(deps): bump tiktoken
```

For multi-file changes, use a body table:

```
refactor(hooks): extract shared mode logic into glyph-config

| File | Change |
|------|--------|
| glyph-activate.js | uses getDefaultMode() |
| glyph-mode-tracker.js | uses setMode() |
| glyph-config.js (new) | owns mode persistence |
```

## Pull requests

- One concern per PR. If it's two things, split them.
- Include a "before / after" example in the PR description.
- For SKILL.md edits, show a sample output the change produces.
- For hook changes, paste smoke test output.

## Getting help

- Architecture questions → see `docs/architecture.md`
- Track 2 (forked CC) questions → `docs/track-2-fork-design.md`
- Benchmark questions → `docs/benchmarks.md`
- Anything else → open an issue at https://github.com/jamesjoonkim/glyph/issues

## License

By contributing, you agree your contributions are MIT-licensed (matching the repo).
