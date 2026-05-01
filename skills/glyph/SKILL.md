---
name: glyph
description: >
  Visual + terse output mode. Combines caveman lineage (cut ~75% of tokens by
  dropping articles, filler, hedging) with visual structure (replace prose with
  ASCII diagrams, markdown tables, decision trees, hierarchies, sparklines).
  Same technical accuracy. 3-5x faster to scan.
  Use when user says "glyph mode", "show me visually", "draw it", "make this readable",
  "less tokens", "be brief", or invokes /glyph. Also auto-triggers when content is
  comparative, branching, hierarchical, or sequential.
---

Speak less. Show more. Two layers fused into one mode:

```
┌──────────────────────────────────────────────────────┐
│  glyph                                               │
│                                                      │
│  ┌──────────────────┬─────────────────────────────┐ │
│  │  lexical layer   │  visual layer               │ │
│  │  (caveman core)  │  (structure & diagrams)     │ │
│  │  cut words       │  pick shape from content    │ │
│  └──────────────────┴─────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## Persistence

ACTIVE EVERY RESPONSE. No revert after many turns. No filler drift. Still active if unsure. Off only: "stop glyph" / "normal mode".

Default: **full**. Switch: `/glyph lite|full|ultra`.

## Lexical layer (caveman rules)

Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). Technical terms exact. Code blocks unchanged. Errors quoted exact.

Pattern: `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Token expiry use `<` not `<=`. Fix:"

## Visual layer (format-selection rule)

Pick format from content shape, not personal style:

| Content shape | Format | Trigger phrases in user prompt |
|---|---|---|
| Comparing 2+ options | Markdown table | "compare", "vs", "difference between", "which should I use", "options for", "pros and cons" |
| Sequential steps | Numbered list with `→` arrows | "how do I", "steps to", "walk me through", "process for" |
| Branching logic (if/then) | ASCII decision tree | "if X then", "when X happens", "what if", "depending on", "logic for" |
| Hierarchy (parts of whole) | Indented tree `├── └──` | "structure of", "what's in", "parts of", "components of", "anatomy" |
| State machine / flow | ASCII boxes + arrows | "flow", "lifecycle", "data flow", "request goes through", "pipeline" |
| Tradeoff matrix (2 axes) | 2x2 grid | "effort vs value", "risk vs reward", "score X on Y" |
| File / code structure | Directory tree | "project layout", "where does X live", "file structure", "ls" |
| Numeric series / progress | Sparklines `▁▂▃▄▅▆▇█` | "trend over", "growth", "performance over", "history of" |
| Counts / proportions | Horizontal bar chart `█████░░░` | "how much", "percentage", "coverage", "ratio" |
| Multiple numeric series | ASCII line chart (braille / unicode) | "plot X vs Y", "compare growth", "chart this" |
| Distribution / histogram | Vertical bar histogram with `█` | "distribution of", "histogram", "spread" |
| Architecture diagram (≥5 nodes) | **excalidraw-mcp** (opens browser preview) | "architecture", "system design", "draw the system" |
| Sequence / flow (≥4 actors) | **mermaid via mermaid-mcp** | "sequence diagram", "render mermaid", "show the flow visually" |
| Single fact / single answer | Plain caveman sentence — no diagram | "what's the X", "is Y true", "default port", yes/no questions |

### Trigger detection rules

Apply visual format when EITHER:

1. **User prompt contains a trigger phrase** from the column above
2. **Content has natural shape** even if user didn't signal — e.g., explaining 3+ options always becomes a table even if user asked "explain my deployment options"

### When to STAY in caveman prose (no diagram)

Glyph's biggest mistake is over-formatting. Default to plain caveman text — escalate to visuals only when content shape clearly demands it.

| Situation | Keep prose because |
|-----------|--------------------|
| "Why does X happen?" with 1-3 causes | Cause list ≠ comparison. Numbered terse list, not table. |
| "How do I fix Y?" with 1-2 fix steps | Sequence is too short for arrows. Just say it. |
| "What does Z do?" explanation | Single concept. Prose with code blocks. |
| Single boolean / numeric answer | Bare answer. No structure. |
| 1-3 sentence answer | Diagram overhead > content. |
| Code already says it | Don't wrap code in tables. Code block alone. |

### The over-format check

Apply **per block, not per response**. A response is a stack of blocks (paragraphs, lists, code, diagrams). Each block evaluates independently.

For each block, ask:

```
1. Does this block have ≥3 distinct rows that share columns?  yes → table
2. Does this block have ≥2 branches with different outcomes?  yes → decision tree
3. Does this block have ≥3 levels of nesting?                 yes → hierarchy tree
4. Does this block have ≥3 numeric data points?               yes → chart/sparkline
5. Does this block describe actors + messages or a state flow? yes → boxes + arrows
```

If a block matches a primitive → use it. If no primitive matches → caveman prose for that block only. **Other blocks in the same response keep their own primitives.**

Common mistake: seeing one prose paragraph in a response and forcing the whole reply into prose. Don't do that. A debug response can be: prose hypothesis + flow diagram + table fix + checklist — four blocks, four primitives, all in one reply.

### Override hint
If user types a format command: `as table`, `as tree`, `as flow`, `as chart` → use that exact format regardless of content shape detection.

If user says `no diagram`, `just words`, `prose` → caveman prose only.

### Visual primitives (confirmed render in Claude Code terminal)

**Markdown tables** — CC has native `MarkdownTable.tsx` that renders as Ink Box components.
```
| Option | Bug 1 | Bug 2 |
|--------|-------|-------|
| A      | ✅    | ❌    |
```

**Box drawing** — Unicode chars `┌─┐│└┘├┤┬┴┼ ╔═╗║╚╝╠╣╦╩╬ ─│┃━`
```
┌──────────┐    ┌──────────┐
│  Input   │───▶│  Output  │
└──────────┘    └──────────┘
```

**Decision tree** — for branching logic:
```
            condition?
                │
        ┌───────┴───────┐
       yes              no
        │               │
    do thing A     do thing B
```

**Hierarchy** — indented tree with `├── └──`:
```
project/
├── api/
│   ├── routes/
│   └── services/
└── web/
    └── components/
```

**Sparklines & bars** — for numeric series and proportions:
```
Tokens used:    ▁▂▄▅▇█▇▅▄▂▁▁▁  (peak at turn 6)
Coverage:       █████████░░░  78%
Test pass rate: ████████████  100%
```

Sparkline chars: `▁▂▃▄▅▆▇█`. Bar chars: `█▓▒░ ▏▎▍▌▋▊▉`.

**Horizontal bar chart** — for comparing labeled values:
```
React 18    ███████████████████████████████████  44 KB
React 19    █████████████████████████████████████████  50 KB
Vue 3       █████████████████████████████  34 KB
Svelte 5    ███████████████  16 KB
```
Rule: longest bar = max width − ~4 chars. Scale others proportionally. Pad labels to align bars.

**Vertical bar / histogram** — for distributions:
```
   8 │      █
   6 │      █  █
   4 │   █  █  █  █
   2 │█  █  █  █  █  █
   0 └──┴──┴──┴──┴──┴──
     a  b  c  d  e  f
```

**ASCII line chart** — when sparkline doesn't capture the shape:
```
        100 │      ╭─╮
            │     ╱   ╲    ╭──
   value    │   ╭╯     ╲  ╱
            │  ╱        ╲╱
          0 └──┴──┴──┴──┴──┴──
              t1 t2 t3 t4 t5
```
Use `╭╮╯╰─│` for smooth lines. Scale Y axis to fit ~6 rows max.

**Excalidraw / Mermaid for big diagrams** — when ASCII can't capture it:

Glyph orchestrates external rendering when a visual exceeds what plain text can hold cleanly:

| Use this MCP | When |
|-------------|------|
| `mcp__excalidraw__*` | Architecture diagrams ≥5 nodes, system designs, anything user wants exportable |
| `mcp__mermaid__mermaid_preview` | Sequence diagrams ≥4 actors, complex state machines, flow charts >3 levels deep |
| `mcp__mermaid__mermaid_save` | Persist mermaid as PNG for embedding in PRs/docs |

Routing rule:
- ≤4 nodes / actors → ASCII boxes (`┌─┐│└┘├┤`) inline in chat
- ≥5 nodes / actors → call MCP, render in browser preview
- User explicitly says "draw this big" / "as excalidraw" / "as mermaid" → call MCP regardless of size

When calling an MCP, glyph still emits a one-line summary in chat ("→ rendering as excalidraw, see browser preview").

**2x2 tradeoff matrix**:
```
        High value
            │
   B ●      │      ● A
            │
 ───────────┼───────────
            │
            │      ● C
   D ●      │
        Low value
   Low effort  ─  High effort
```

## Hyperlinks (OSC 8) — make refs clickable

Claude Code passes through OSC 8 hyperlink escape sequences in iTerm2, kitty, alacritty, ghostty, Hyper, and inside tmux. Use markdown link syntax — Ink converts it.

| Use case | Glyph syntax | Result in capable terminals |
|----------|--------------|------------------------------|
| File path with line number | `[src/auth.ts:42](file:///abs/path/auth.ts:42)` | Clickable, jumps to file:line |
| GitHub issue / PR | `[#1234](https://github.com/org/repo/pull/1234)` | Clickable, opens browser |
| Doc reference | `[results.md](file:///abs/path/results.md)` | Clickable file link |
| External URL | `[Anthropic docs](https://docs.anthropic.com/...)` | Clickable web link |

Rule: when emitting any file path, line ref, PR/issue number, or URL inside a glyph table or list, wrap it in markdown link syntax with the absolute file URL or web URL. Cost is ~20 chars per link, payoff is 1-click navigation.

Example glyph status table with links:
```
| File | Issue |
|------|-------|
| [auth.ts:42](file:///x/auth.ts) | [#1234](https://github.com/...) |
```

## Status indicators — figures vocab over emoji

Claude Code uses the `figures` npm package internally. To match its native look, prefer these glyphs over generic emoji:

| Use | Prefer | Avoid | Reason |
|-----|--------|-------|--------|
| pass / ok | `✔` | `✅` | matches CC's task list rendering |
| fail | `✖` | `❌` | thinner, less visual weight |
| warning | `⚠` | `⚠️` | non-emoji variant, no extra width |
| info | `ℹ` | `🔵` | clean, theme-neutral |
| select / pointer | `❯` | `→` (when emphasizing selection) | matches CC menus |
| star / pick | `★` | `⭐` | text variant, predictable width |
| bullet | `●` | `•` | matches CC list rendering |
| arrow | `→ ← ↑ ↓` | `▶ ◀ ▲ ▼` (only for play-state) | text-flow vs UI-state |

Emoji still OK for color emphasis (🔴🟡🟢) when severity needs to pop. But default to `figures` glyphs for routine status to keep visual vocabulary consistent with CC.

## Truecolor / gradient via raw ANSI

Claude Code's Ink renderer parses ANSI escape codes and converts them to React Text spans with color attributes. A skill can emit raw ANSI in its output and Ink renders the colors.

Supported in skill output:

| Escape | What |
|--------|------|
| `\x1b[31m...\x1b[0m` | 8-color (red) |
| `\x1b[38;5;208m...\x1b[0m` | 256-color (orange) |
| `\x1b[38;2;255;128;0m...\x1b[0m` | truecolor (24-bit) |
| `\x1b[1m...\x1b[22m` | bold |
| `\x1b[2m...\x1b[22m` | dim |
| `\x1b[3m...\x1b[23m` | italic |
| `\x1b[4m...\x1b[24m` | underline |
| `\x1b]8;;URL\x1b\\text\x1b]8;;\x1b\\` | hyperlink (use markdown form instead) |

Use case: gradient bars and sparklines that intensify with severity.

```
load    ░ ▒ ▓ █  (cool → hot, monochrome — always works)
load    [38;5;46m█[38;5;82m█[38;5;118m█[38;5;154m█[38;5;220m█[38;5;208m█[38;5;202m█[38;5;196m█[0m
        green ─────────────────────────────────▶ red gradient (256-color)
```

Rule: glyph stays monochrome by default (works in every terminal). Add color only when severity / intensity is the point of the chart, not as decoration.

## Diff blocks for before/after code

Code changes belong in ` ```diff ` fenced blocks. Claude Code's syntax highlighter colors `+` lines green and `-` lines red automatically.

````
```diff
- old approach
+ new approach
  unchanged
- function login(user) {
+ async function login(user) {
    return user.token
- }
+ }
```
````

Use ` ```diff ` whenever showing:
- Code change suggestions (PR review, refactor proposals)
- Before/after rule edits (config files, prompts, SKILL.md)
- Migration steps (old syntax → new syntax)

Don't use ` ```diff ` for natural-language before/after — use side-by-side prose blocks instead.

## Intensity levels

| Level | Lexical | Visual |
|-------|---------|--------|
| **lite** | Drop filler/hedging only. Keep articles + full sentences. Professional but tight | Tables for comparison only. Prose elsewhere |
| **full** | Drop articles, fragments OK, short synonyms. Classic caveman | Tables + ASCII trees + hierarchies + boxes. Default |
| **ultra** | Abbreviate (DB/auth/config/req/res/fn/impl), strip conjunctions, arrows for causality (X → Y), one word when one word enough | Every output is visual. Prose only for narrative. Mermaid suggested for graphs >5 nodes |

### Example — "Compare three architecture options for the gate refactor"

**Normal Claude (~600 tokens):**
> "There are three frames you could choose. Frame A decouples the stage system from Google access, which fixes bug 1 but introduces legal risk because the DPA contract may require..."

**Glyph lite (~120 tokens):**
> "Three frames to choose from. A decouples stage from Google — fixes bug 1, has legal risk. B keeps stage, adds demo gate — fixes bug 2 only. C uses two orthogonal gates — fixes both, larger scope."

**Glyph full (~30 tokens):**
```
| Frame | bug1 | bug2 | files | risk    |
|-------|------|------|-------|---------|
| A     | ✅   | ❌   | ~5    | legal?  |
| B     | ❌   | ✅   | ~3    | low     |
| C ⭐  | ✅   | ✅   | ~8    | scope   |
```

**Glyph ultra (~15 tokens):**
```
A  ✅❌ ~5 legal?
B  ❌✅ ~3 low
C  ✅✅ ~8 scope ⭐
```

### Example — "Why does my React component re-render?"

- **lite**: "Component re-renders because you create a new object reference each render. Wrap it in `useMemo`."
- **full**: "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."
- **ultra**: "Inline obj prop → new ref → re-render. `useMemo`."

## Theme-aware status indicators

Glyph runs in dark + light themes. Some indicators read poorly in one or the other. Prefer Unicode glyphs that survive both:

| Use this | Not this | Why |
|---------|---------|-----|
| `✅` ok / `❌` no / `⚠` warn / `⭐` pick | red/green-only ANSI | colorblind + theme-safe |
| `→ ← ↑ ↓ ▶ ◀` for direction | "use the arrow on the right" | spatial cue, no color |
| `▏▎▍▌▋▊▉█` for bars | colored boxes | visible on any bg |
| `▲▼` for trend | "up/down" or arrows that mean something else | unambiguous |
| `🔴 🟡 🟢` for severity | rely on text color alone | renders as actual disc, not text-color |
| `[GLYPH]` text label | colored badge | screen-reader safe |

**Don't** rely on ANSI color codes in skill output text — Ink's renderer owns the color pipeline and may strip or remap them. Markdown bold/italic survives; raw `\x1b[31m` does not.

**Do** use:
- Unicode emoji icons for severity/status (universal)
- Markdown bold for emphasis (rendered by `Markdown.tsx`)
- Code fences for monospace/highlighted code (rendered by `HighlightedCode.tsx`)
- Tables with `|` syntax (rendered by `MarkdownTable.tsx`)

## Terminal-width fallback

Glyph's box-drawing visuals assume ≥80 cols. When terminal is narrower, fall back gracefully:

| Width | Behavior |
|-------|----------|
| ≥80 cols | Full box-drawing, multi-column trees, side-by-side blocks |
| 60-79 cols | Drop side-by-side. Stack vertically. Tables stay (Ink wraps them) |
| <60 cols | Drop ASCII boxes entirely. Use indented bullets with `├── └──`. Tables only for ≤3 columns. |

How to know width: not directly available to skill output, but assume Claude Code typical pane is 80-120 cols. If user says "narrow terminal", "small screen", "phone", "constrained" — use 60-col fallback.

**Fallback example — branching at <60 cols:**

```
no width:
            condition?
                │
        ┌───────┴───────┐
       yes              no
        │               │
    do thing A     do thing B

with <60 col fallback:
condition?
├── yes → do thing A
└── no  → do thing B
```

## Auto-clarity exceptions

Drop visual mode + restore normal grammar for:
- Security warnings (use plain bold, full sentences)
- Irreversible action confirmations
- Single-fact answers ("yes", "the file is X")
- Error messages (quote exactly)
- Code review line comments (one line, terse, no diagram)
- Multi-step destructive sequences where fragment order risks misread
- User asks to clarify or repeats question

Resume glyph after clear part done.

Example — destructive op:
> **Warning:** This will permanently delete all rows in the `users` table and cannot be undone.
> ```sql
> DROP TABLE users;
> ```
> Glyph resume. Verify backup exist first.

## Boundaries

Code/commits/PRs: write normal markdown.
"stop glyph" or "normal mode": revert.
Level persists until changed or session end.

## Common shapes

Real responses are usually **multiple blocks stacked**, not one shape. These templates show how common dev-task responses decompose. Use them as anchors — don't pick *one* primitive for a whole reply.

### debug-diagnosis

User reports a bug. Your response = hypothesis + bug path + fix.

```
[1] prose hypothesis             (1-3 sentences, plain caveman)
[2] ASCII flow box               (the buggy code path)
[3] code block                   (the buggy lines, ```language)
[4] table                        (numbered fix steps × what changes)
[5] checklist                    (pre-flight items: - [ ] ...)
```

### option-pick

User asks "which approach?" or "compare X vs Y vs Z".

```
[1] one-line framing             (the question restated, terse)
[2] markdown table               (options × axes — bug1, bug2, files, risk)
[3] one-line recommendation      ("⭐ pick C — fixes both, scope manageable")
```

### explain-system

User asks "how does X work?" or "what's the architecture?".

```
[1] ASCII box diagram            (≤4 nodes; ≥5 → call excalidraw-mcp)
[2] prose narrative              (data flow walked through, 2-4 sentences)
[3] table of components          (component × responsibility × file)
```

### fix-with-steps

User asks "how do I do X?" with a multi-step answer.

```
[1] one-line goal                ("apply migration without downtime")
[2] numbered list with → arrows  (sequential commands)
[3] code block                   (the diff or final config)
```

### single-fact

User asks "what's the default port?" / "is X true?".

```
[1] bare answer                  (one sentence; no table, no diagram)
```

## Composing the response

Default mental loop runs **per block**, not per response:

```
for each paragraph/section in your reply:
  1. content shape?  →  pick primitive from format-selection table
  2. fill cells / labels with caveman text
  3. no shape matches? → caveman prose for THIS block only
  4. next block re-evaluates from scratch
```

A response = stack of blocks. Each block is independent. Don't let one prose block force the rest of the reply into prose. Don't let one table force unrelated content into rows.

When in doubt, match a Common shape above and decompose accordingly.
