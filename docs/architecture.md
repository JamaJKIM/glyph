# Architecture

How glyph is wired and why.

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     glyph                                    │
│                                                              │
│  ┌──────────────────┬─────────────────────────────────────┐ │
│  │  lexical layer   │  visual layer                       │ │
│  │  (caveman)       │  (shape picker)                     │ │
│  │                  │                                     │ │
│  │  drop articles   │  content shape → format             │ │
│  │  drop filler     │   compare       → table              │ │
│  │  drop hedging    │   branching     → decision tree     │ │
│  │  fragments OK    │   hierarchy     → indented tree     │ │
│  │                  │   numeric       → bars / sparkline  │ │
│  │                  │   ≥5 nodes      → MCP route         │ │
│  └──────────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                  Claude Code Ink renderer
                  (markdown tables, ANSI, hyperlinks)
```

## Repo layout

```
glyph/
├── .claude-plugin/
│   ├── marketplace.json       # marketplace listing
│   └── plugin.json            # hook registration (SessionStart + UserPromptSubmit)
├── skills/
│   ├── glyph/SKILL.md         # core mode — single source of truth
│   ├── glyph-help/SKILL.md    # cheat sheet
│   ├── glyph-commit/SKILL.md  # terse commit messages
│   ├── glyph-review/SKILL.md  # one-line PR comments
│   ├── glyph-debug/SKILL.md   # stack-trace parser
│   ├── glyph-status/SKILL.md  # project state table
│   ├── glyph-scaffold/SKILL.md # idea → spec card
│   ├── glyph-render/SKILL.md  # excalidraw / mermaid routing
│   └── glyph-explain/SKILL.md # visual concept explanations
├── hooks/
│   ├── glyph-activate.js      # SessionStart — emits ruleset
│   ├── glyph-mode-tracker.js  # UserPromptSubmit — parses /glyph commands
│   ├── glyph-config.js        # reads/writes ~/.claude/.glyph-mode
│   ├── glyph-statusline.sh    # renders [GLYPH:FULL] badge
│   ├── install.sh             # standalone installer (no plugin system)
│   └── uninstall.sh
├── benchmarks/
│   ├── prompts.json           # 8-prompt test set
│   ├── llm_run.py             # generate three-arm samples
│   ├── measure.py             # tiktoken counts
│   ├── judge.py               # claude-as-judge readability scores
│   └── samples/               # generated outputs (results.json, judge.json)
└── docs/
    ├── architecture.md        # this file
    ├── track-2-fork-design.md # forked-CC roadmap
    ├── benchmarks.md          # methodology + reproducibility
    └── contributing.md        # how to propose changes
```

## State files

Glyph keeps two flag files in `~/.claude/`:

| File | Written by | Read by | Purpose |
|------|-----------|---------|---------|
| `.glyph-mode` | `glyph-mode-tracker.js` | `glyph-config.js` | persisted user choice (`off` / `lite` / `full` / `ultra`) |
| `.glyph-active` | `glyph-activate.js` | `glyph-statusline.sh` | current-session active mode |

## Activation flow

```
SessionStart hook → glyph-activate.js
    ├── reads ~/.claude/.glyph-mode (default: 'full')
    ├── writes ~/.claude/.glyph-active (so statusline reads it)
    ├── reads skills/glyph/SKILL.md
    ├── filters intensity table to active level
    └── emits filtered ruleset → injected as session context

UserPromptSubmit hook → glyph-mode-tracker.js
    ├── matches /glyph [level] in user prompt
    ├── matches "stop glyph" / "normal mode"
    └── persists new mode to ~/.claude/.glyph-mode
```

## Why SKILL.md is the source of truth

The activate hook reads `skills/glyph/SKILL.md` at runtime. Edits to that file propagate without needing to rebuild the plugin. This avoids drift between the documented behavior (in SKILL.md) and the runtime ruleset.

Trade: each session start does a tiny file read. Negligible (<5ms).

## Coding conventions

- Plain Node.js for hooks. Zero deps. Mirrors caveman.
- ASCII-only in `SKILL.md` examples (portability).
- Don't break the dispatch pattern in `glyph-activate.js` — the mode-row filter keeps the SessionStart payload small.
- Don't put behavior in hooks that should live in `SKILL.md`. SKILL.md is the source of truth.

## Boundaries

Glyph stays narrow on purpose:

| Adjacent need | Use this instead |
|---------------|------------------|
| Cut output tokens (text only) | [caveman](https://github.com/JuliusBrussee/caveman) — glyph's lexical layer is built on caveman |
| Compress memory files | [caveman-compress](https://github.com/JuliusBrussee/caveman) |
| Cross-session memory | [claude-mem](https://github.com/thedotmack/claude-mem) |
| HUD chrome | [claude-hud](https://github.com/jarrodwatts/claude-hud) |
| TDD enforcement | [tdd-guard](https://github.com/nizos/tdd-guard) |
| Excalidraw / Mermaid render | excalidraw-mcp / mermaid-mcp (glyph routes to these for ≥5-node diagrams) |
