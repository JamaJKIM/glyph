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

---

## Locked decisions (2026-04-28)

These are committed product-direction calls. Do not relitigate without strong evidence.

| Decision | Rationale |
|----------|-----------|
| Name: **glyph** | Primitive symbol — caveman drew glyphs. Pairs cleanly. |
| Thesis: **"speak less. show more."** | Single-sentence positioning. Output mode, not a suite. |
| Scope: **output mode only** | NOT a kitchen-sink enhancement pack. Stays narrow. |
| Default mode: **off** | Opt-in via `/glyph`. Avoids ambushing first-run users. |
| Visibility: **private** initially | Flip public after benchmarks + a real-world pass. |
| License: **MIT** | Matches caveman lineage. Credits caveman in LICENSE. |

## Why glyph stays narrow (anti-scope-creep)

Research (2026-04-28) showed every major direction was already owned:

| Adjacent want | Already owned by | Stars | Glyph's move |
|---------------|------------------|-------|--------------|
| Visual HUD chrome | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) | 21k | Different surface — they own chrome, glyph owns the message |
| Session memory | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 69k | Integrate, don't rebuild |
| Validation hooks | [nizos/tdd-guard](https://github.com/nizos/tdd-guard) | 2k | Bundle in stack, don't author framework |
| Excalidraw export | [excalidraw/excalidraw-mcp](https://github.com/excalidraw/excalidraw-mcp) | 4.2k | Wrap, don't fork |
| Memory file compression | [JuliusBrussee/caveman-compress](https://github.com/JuliusBrussee/caveman) | 49k | Already exists, glyph stays focused on output |

**Glyph's defensible niche: the message Claude writes back.** Nobody owns it. Caveman owns the lexical layer; glyph owns lexical + visual fusion in the message itself.

If future contributors want to expand into HUD/memory/validation/diagrams — **don't.** That's `glyph-stack` territory (a separate, parked project: a curated install manifest pulling 5 best-of-breed plugins together, not a mono-repo).

## External references

- Glyph repo: https://github.com/JamaJKIM/glyph (private until benchmarks ship)
- Leaked CC source for Track 2: https://github.com/JamaJKIM/claude-code (forked from `Kuberwastaken/claurst`)
- Source dispatch to patch for Track 2: `components/Markdown.tsx` line 143-151
- Caveman repo (lineage credit): https://github.com/JuliusBrussee/caveman
- Local symlink: `~/.claude/plugins/marketplaces/glyph` → `~/Documents/GitHub/glyph`

## Smoke test (run if hooks misbehave)

```bash
# 1. config loads default
node hooks/glyph-config.js -e "console.log(require('./glyph-config').getDefaultMode())"

# 2. activate hook (mode=off short-circuits to OK)
echo "{}" | node hooks/glyph-activate.js

# 3. mode tracker parses /glyph
echo '{"user_prompt": "/glyph full"}' | node hooks/glyph-mode-tracker.js
cat ~/.claude/.glyph-mode  # should print "full"

# 4. statusline emits ANSI badge
echo "full" > ~/.claude/.glyph-active && bash hooks/glyph-statusline.sh

# 5. cleanup
echo "off" > ~/.claude/.glyph-mode
```

## When you come back to this repo

Open tasks in priority order:

1. **Run benchmarks** — `cd benchmarks && uv run python llm_run.py && uv run --with tiktoken python measure.py`. Validates the README claims.
2. **Flip public** — `gh repo edit JamaJKIM/glyph --visibility public --accept-visibility-change-consequences` after benchmarks back the claims.
3. **Submit to marketplace** — once public, list in awesome-claude-code or anthropic-plugins-official.
4. **Track 2 fork** — only if Track 1 has user pull. See `docs/track-2-fork-design.md`.
5. **Don't expand scope** — see "Why glyph stays narrow" above.
