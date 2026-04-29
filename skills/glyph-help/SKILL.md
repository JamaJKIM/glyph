---
name: glyph-help
description: >
  Quick-reference card for glyph mode. Shows all levels, format selectors,
  visual primitives, and toggle commands. One-shot display, not a persistent mode.
  Trigger: /glyph-help, "glyph help", "what glyph commands", "how do I use glyph".
---

```
┌────────────────────────────────────────────────────────────────────┐
│  glyph — visual + terse output mode                                │
│  speak less. show more.                                            │
└────────────────────────────────────────────────────────────────────┘
```

## Toggle

| Command | Effect |
|---------|--------|
| `/glyph` | Activate at default level (full) |
| `/glyph lite` | Tight prose, tables for comparison |
| `/glyph full` | Caveman text + ASCII diagrams (default) |
| `/glyph ultra` | Maximum compression, every output visual |
| `/glyph-help` | This card |
| `stop glyph` / `normal mode` | Disable |

## Format selector (visual layer picks shape)

| Content shape | Format |
|---|---|
| Compare 2+ options | Table |
| Branching logic | Decision tree |
| Hierarchy | Indented tree |
| Sequence | Numbered list with `→` |
| State / flow | Boxes + arrows |
| Tradeoffs (2 axes) | 2x2 grid |
| File / code structure | Directory tree |
| Numeric series | Sparklines |
| Counts / proportions | Block bars |
| Single fact | Plain caveman sentence |

## Lexical layer (caveman rules — always on)

```
drop:    articles, filler, pleasantries, hedging
keep:    technical terms, code, errors verbatim
pattern: [thing] [action] [reason] → [next]
```

## Visual chars cheat sheet

```
boxes:      ┌─┐│└┘├┤┬┴┼  ╔═╗║╚╝╠╣╦╩╬  ─│┃━
trees:      ├── └── │
arrows:     → ← ↑ ↓ ▶ ◀ ▲ ▼ ─▶ ═▶
sparkline:  ▁▂▃▄▅▆▇█
bars:       █▓▒░ ▏▎▍▌▋▊▉
status:     ✅ ❌ ⚠ ⭐ 🔴 🟡 🟢
```

## When NOT to use glyph

```
exception              behavior
──────────             ──────────
security warning       plain bold + full sentences
single-fact answer     one terse sentence
error message          quote verbatim
code review comment    one line per issue
destructive confirm    full grammar + warning
```
