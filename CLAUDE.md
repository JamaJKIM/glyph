# glyph — project memory

This file auto-loads when Claude Code opens a project rooted at this repo.
Treat it as live spec for contributors and AI assistants.

## What glyph is

Visual + terse output mode for Claude Code. Two layers fused:
- **Lexical** — caveman lineage. Drop articles, filler, hedging. Fragments OK.
- **Visual** — pick format from content shape. Tables, ASCII trees, boxes, sparklines.

Goal: same accuracy, ~75% fewer tokens, 3-5x faster scan time vs default Claude prose.

## Architecture

```
glyph/
├── .claude-plugin/
│   ├── marketplace.json     ← marketplace listing
│   └── plugin.json          ← hook registration (SessionStart + UserPromptSubmit)
├── skills/
│   ├── glyph/SKILL.md       ← single source of truth for behavior
│   └── glyph-help/SKILL.md  ← cheat sheet
├── hooks/
│   ├── glyph-activate.js    ← reads SKILL.md, emits filtered ruleset on session start
│   ├── glyph-mode-tracker.js ← parses /glyph commands from user input
│   ├── glyph-config.js      ← reads/writes ~/.claude/.glyph-mode
│   ├── glyph-statusline.sh  ← shows [GLYPH], [GLYPH:LITE], [GLYPH:ULTRA]
│   ├── install.sh           ← standalone (non-plugin) installer
│   └── uninstall.sh
└── docs/
    └── before-after.md      ← (planned) more demo cases
```

## State files

- `~/.claude/.glyph-active` — written by activate hook, read by statusline
- `~/.claude/.glyph-mode` — persisted user choice (lite/full/ultra/off)

## How activation works

```
SessionStart hook → glyph-activate.js
  ├── reads default mode from ~/.claude/.glyph-mode
  ├── writes flag to ~/.claude/.glyph-active
  ├── reads SKILL.md, filters intensity table to active level
  └── emits ruleset to stdout (becomes hidden session context)

UserPromptSubmit hook → glyph-mode-tracker.js
  ├── matches /glyph [level] in user input
  ├── matches "stop glyph" / "normal mode"
  └── persists new mode + emits inline confirmation
```

## Coding conventions

- Plain Node.js for hooks (no deps). Mirrors caveman.
- ASCII-only in `SKILL.md` examples for portability.
- Don't break the dispatch pattern in `glyph-activate.js` — mode-row filter is what makes the SessionStart payload small.

## Don't

- Don't add new dependencies (keep zero-deps for fast hook startup).
- Don't change `~/.claude/.glyph-mode` filename without updating both `glyph-config.js` and statusline.
- Don't put behavior in hooks that should live in `SKILL.md` — SKILL.md is the source of truth.

## Roadmap (Track 2 — fork CC)

To add native Ink-rendered fenced blocks (` ```glyph:tree `, ` ```glyph:flow `, etc.):

1. Fork [Anthropic Claude Code](https://github.com/JamaJKIM/claude-code) (leaked source breakdown).
2. Edit `components/Markdown.tsx` line 144 dispatch to recognize `code` tokens with `lang.startsWith("glyph:")`.
3. Add `<GlyphBlock>` component modeled after `MarkdownTable.tsx` — uses `Box`, `Ansi`, `useTheme`, `useTerminalSize`, `stringWidth`, `wrapAnsi` from `ink.js`.
4. Variants: `tree` (decision tree from indented bullets), `flow` (boxes + arrows), `chart` (bar chart), `spark` (sparkline), `matrix` (2x2).

## Credits

Built on [caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee. Glyph absorbs caveman's lexical rules and adds the visual layer.
