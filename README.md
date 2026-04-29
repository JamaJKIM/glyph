<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/spiral-shell_1f41a.png" width="120" alt="glyph" />
</p>

<h1 align="center">glyph</h1>

<p align="center">
  <strong>speak less. show more.</strong>
</p>

<p align="center">
  <a href="https://github.com/JamaJKIM/glyph/stargazers"><img src="https://img.shields.io/github/stars/JamaJKIM/glyph?style=flat&color=yellow" alt="Stars"></a>
  <a href="https://github.com/JamaJKIM/glyph/commits/main"><img src="https://img.shields.io/github/last-commit/JamaJKIM/glyph?style=flat" alt="Last Commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/JamaJKIM/glyph?style=flat" alt="License"></a>
  <a href="https://github.com/JuliusBrussee/caveman"><img src="https://img.shields.io/badge/built%20on-caveman-orange" alt="Built on caveman"></a>
</p>

<p align="center">
  <a href="#tradeoff">Tradeoff</a> •
  <a href="#before--after">Before/After</a> •
  <a href="#install">Install</a> •
  <a href="#levels">Levels</a> •
  <a href="#skills">Skills</a> •
  <a href="#benchmarks">Benchmarks</a> •
  <a href="#ecosystem">Ecosystem</a>
</p>

---

A Claude Code skill/plugin that picks **the right visual shape** for each answer. Built on [Julius Brussee's caveman](https://github.com/JuliusBrussee/caveman) — caveman cuts words, glyph adds visual structure on top.

```
┌─────────────────────────────────────────────────────────────┐
│  glyph                                                      │
│                                                             │
│  ┌─────────────────────┬───────────────────────────────┐   │
│  │  lexical layer      │  visual layer                 │   │
│  │  (caveman lineage)  │  (structure & diagrams)       │   │
│  │                     │                               │   │
│  │  drop articles      │  pick format from content     │   │
│  │  drop filler        │  shape: tables, trees,        │   │
│  │  drop hedging       │  boxes, sparklines, arrows    │   │
│  │  fragments OK       │                               │   │
│  └─────────────────────┴───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Tradeoff

Benchmarked across 8 dev prompts. Claude Opus 4.7 as judge.

```
┌──────────────────────────────────────────────┐
│  vs NORMAL CLAUDE                            │
│  TOKENS SAVED          ████████      43%     │
│  READABILITY GAIN      ████████   +1.8/10    │
│  FORMAT-FIT GAIN       ████████   +2.0/10    │
├──────────────────────────────────────────────┤
│  vs CAVEMAN                                  │
│  TOKENS COST           ███             +8%   │
│  READABILITY GAIN      ████        +0.6/10   │
│  FORMAT-FIT GAIN       ████████    +1.7/10   │
└──────────────────────────────────────────────┘
```

| Metric | Normal | Caveman | Glyph |
|--------|-------:|--------:|------:|
| Avg output tokens | 872 | **458** ⭐ | 495 |
| Readability (1-10) | 7.2 | 8.4 | **9.0** ⭐ |
| Completeness (1-10) | **9.8** ⭐ | 8.6 | 8.6 |
| Format-fit (1-10) | 7.5 | 7.8 | **9.5** ⭐ |

**Glyph is NOT the smallest output** — caveman wins on raw tokens. Glyph trades 8% extra tokens (visual chars: `┌─┐`, `|`, `✅`) for shape-correct structure that's faster to scan.

| Pick this | When |
|-----------|------|
| **glyph** | comparing options, branching logic, file structure, daily dev work |
| **caveman** | minimum-token output, single-fact answers, terminal output you'll grep |
| **normal** | research mode where every nuance matters |

## Before / After

Real benchmark prompt: *"compare three caching strategies for a high-traffic API"*. Token counts via tiktoken on actual API responses.

<table>
<tr>
<td width="50%">

### 🗣️ Normal Claude (1216 tokens)

> "When evaluating caching strategies for a high-traffic API, you have three primary options: in-memory LRU, Redis, and CDN edge cache. Each comes with distinct tradeoffs that should be weighed against your specific requirements. In-memory LRU caches store data directly within the application process, providing extremely low latency..."

</td>
<td width="50%">

### 🐚 Glyph (538 tokens)

```
| Strategy   | Latency  | Cost  | Invalidation |
|------------|---------:|-------|--------------|
| LRU        | ~0.1ms   | $     | manual       |
| Redis      | ~1ms     | $$    | TTL + evict  |
| CDN edge   | ~50ms    | $$$   | tag-based    |
```

> Pick LRU for hot path, Redis for shared state, CDN for static assets.

</td>
</tr>
<tr>
<td>

### 🗣️ Normal — branching logic

> "First check if the token is expired. If it is, reject the request. Otherwise, validate the signature. If the signature is invalid, reject. Otherwise, accept."

</td>
<td>

### 🐚 Glyph — same content

```
        token expired?
            │
    ┌───────┴───────┐
   yes              no
    │               │
 reject     signature valid?
                    │
            ┌───────┴───────┐
           yes              no
            │               │
         accept          reject
```

</td>
</tr>
<tr>
<td>

### 🗣️ Normal — single concept

> "Your component is re-rendering because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

</td>
<td>

### 🐚 Glyph — same content

> Inline obj prop → new ref each render → re-render. `useMemo`.

*(no diagram — single explanation, glyph stays in caveman prose)*

</td>
</tr>
</table>

**Same answer. Right shape for the question.**

## Install

One command. Auto-activates on every session after that.

| Agent | Install |
|-------|---------|
| **Claude Code** | `claude plugin marketplace add JamaJKIM/glyph && claude plugin install glyph@glyph` |
| Codex | _(planned)_ |
| Gemini CLI | _(planned)_ |
| Cursor / Windsurf | _(planned)_ |

**Auto-activation built in.** glyph fires on every SessionStart via Claude Code's hook system — no `/glyph` typing each session. The statusline shows `[GLYPH]`, `[GLYPH:LITE]`, or `[GLYPH:ULTRA]` so you always know which mode is active.

Switch level any time: `/glyph lite | full | ultra`. Disable: `stop glyph` or `normal mode`.

### What you get

| Feature | Status |
|---------|:------:|
| Visual + terse output mode | ✔ |
| Auto-activate every session | ✔ |
| `/glyph` slash command | ✔ |
| Mode switching (lite / full / ultra) | ✔ |
| Statusline badge | ✔ |
| Sub-skills: commit / review / debug / status / scaffold / render / explain | ✔ |
| Excalidraw MCP routing for big diagrams | ✔ |
| Mermaid MCP routing for sequence / state | ✔ |
| OSC 8 hyperlinks (clickable file refs in capable terminals) | ✔ |
| Truecolor / 256-color charts | ✔ |

## How auto-activation works

Once installed, glyph runs on every Claude Code session automatically — no slash command needed at the start of each session. Here's the mechanism:

```
user runs:  claude plugin install glyph@glyph
                       │
                       ▼
       plugin.json registers SessionStart + UserPromptSubmit hooks
                       │
   ┌───────────────────┴───────────────────┐
   ▼                                       ▼
SessionStart (every CC start)      UserPromptSubmit (every prompt)
fires hooks/glyph-activate.js      fires hooks/glyph-mode-tracker.js
   │                                       │
   ▼                                       ▼
reads ~/.claude/.glyph-mode         parses /glyph commands
(default: 'full')                   updates ~/.claude/.glyph-mode
   │
   ▼
emits the SKILL.md ruleset as
hidden session context — glyph
mode is now active for this session
   │
   ▼
statusline reads ~/.claude/.glyph-active
shows [GLYPH], [GLYPH:LITE], or [GLYPH:ULTRA]
```

**No setup beyond install.** The plugin manifest (`/.claude-plugin/plugin.json`) wires the hooks. Default mode is `full`. To opt out: `stop glyph` or `normal mode`.

## Verify it's running

After installing + restarting Claude Code, check three things:

```bash
# 1. mode file exists and is set to 'full' (default)
cat ~/.claude/.glyph-mode
# expected: full

# 2. active flag is written by SessionStart hook
cat ~/.claude/.glyph-active
# expected: full

# 3. plugin is installed at user scope
claude plugin list | grep glyph
# expected: ❯ glyph@glyph
```

In the CC UI, look for `[GLYPH:FULL]` in your statusline. If you don't see it, the statusline isn't configured — glyph will offer to set it up automatically on first interaction (the activate hook detects missing `statusLine` config in `~/.claude/settings.json` and emits a setup nudge).

If glyph still isn't responding visually, run `/reload-plugins` in CC, or restart the session.

## Standalone install (no plugin system)

For users who don't want the marketplace + plugin system, glyph ships a self-contained installer:

```bash
git clone https://github.com/JamaJKIM/glyph
cd glyph
bash hooks/install.sh
```

The script:
1. Copies hook scripts to `~/.claude/hooks/`
2. Prints a JSON snippet to add to `~/.claude/settings.json` for SessionStart, UserPromptSubmit, and the statusline command
3. You paste the snippet, restart Claude Code, done

Same auto-activation behavior — fires on SessionStart, statusline shows `[GLYPH]`. Difference: you maintain the install yourself instead of via `claude plugin update`.

To uninstall standalone: `bash hooks/uninstall.sh` then remove the JSON entries from `~/.claude/settings.json`.

### Activation

| Trigger | Effect |
|---------|--------|
| `/glyph` or `/glyph:glyph` | Activate at default level (`full`) |
| `/glyph lite` | Tight prose, tables for comparison only |
| `/glyph full` | Caveman text + ASCII diagrams (default) |
| `/glyph ultra` | Maximum compression, every output visual |
| `/glyph-help` | Quick-reference cheat sheet |
| `stop glyph` / `normal mode` | Disable |

## Levels

Pick your level of structure:

<table>
<tr>
<td width="33%">

### 🪶 Lite

```
Component re-renders
because you create new
object reference each
render. Wrap in `useMemo`.
```

Drop filler. Keep grammar.

</td>
<td width="33%">

### 🐚 Full ⭐

```
| Cause       | Fix         |
|-------------|-------------|
| New ref     | `useMemo`   |
| Inline obj  | move out    |
| Parent re   | memoize     |
```

Default. Picks shape.

</td>
<td width="33%">

### 🔥 Ultra

```
inline obj → new ref
→ re-render. useMemo.
```

Telegraphic. Arrows for cause.

</td>
</tr>
</table>

## Skills

| Skill | What it does | Trigger |
|-------|--------------|---------|
| **glyph** | Visual + terse output mode (this is the main one) | `/glyph` |
| **glyph-help** | Quick-reference card. All modes, primitives, commands | `/glyph-help` |
| **glyph-commit** | Conventional Commits with terse subjects + body tables for multi-file scope | `/glyph-commit` |
| **glyph-review** | One-line PR comments with severity icons: `L42: 🔴 bug: user null. Add guard.` | `/glyph-review` |
| **glyph-debug** | Parse stack traces into one-line summary + 3-line context. Replaces wall-of-text errors | `/glyph-debug` |
| **glyph-status** | Project state at a glance (git, tests, build, deps) as a table | `/glyph-status` |
| **glyph-scaffold** | Idea → ASCII spec card (file tree, data flow, sequence). Planning before coding | `/glyph-scaffold` |
| **glyph-render** | Routes "draw this big" to excalidraw-mcp or mermaid-mcp. Falls back to ASCII inline | `/glyph-render` |
| **glyph-explain** | Force a visual-first explanation of any concept / library / pattern | `/glyph-explain <topic>` |

## Format-selection rule

Glyph picks the format from content shape:

| Content shape | Format | Trigger phrases in user prompt |
|---|---|---|
| Comparing 2+ options | Markdown table | "compare", "vs", "options for" |
| Sequential steps | Numbered list with `→` arrows | "how do I", "steps to" |
| Branching logic | ASCII decision tree | "if X then", "what if" |
| Hierarchy | Indented tree `├── └──` | "structure of", "what's in" |
| State / flow | Boxes + arrows | "flow", "lifecycle" |
| Tradeoffs (2 axes) | 2x2 grid | "effort vs value" |
| File / code structure | Directory tree | "project layout" |
| Numeric series | Sparklines `▁▂▃▄▅▆▇█` | "trend over", "growth" |
| Counts / proportions | Block bars `█████░░░` | "how much", "%" |
| Single fact | Plain caveman sentence | "what's the X" — no diagram |

**Auto-clarity:** glyph drops to plain prose for security warnings, single-fact answers, error messages, code review comments, and destructive confirmations.

## What survives the Claude Code render pipeline

CC is built on Ink (React for CLI). Its markdown renderer (`Markdown.tsx` → `MarkdownTable.tsx`) handles:

| Primitive | Renders | Source proof |
|-----------|---------|--------------|
| Markdown tables | ✅ native | `MarkdownTable.tsx` |
| Code fences (monospace) | ✅ | `HighlightedCode.tsx` |
| Unicode box-drawing `┌─┐│└┘` | ✅ always | terminal text |
| Bold/italic/headings | ✅ | `Markdown.tsx` |
| Sparklines `▁▂▃▄▅▆▇█` | ✅ always | terminal text |
| Block bars `█▓▒░` | ✅ always | terminal text |
| Mermaid blocks | ❌ inline | text only |
| Inline images | ❌ | Ink owns pipeline |

Glyph uses only the ✅ primitives. No fork required for Track 1.

## Benchmarks

Real token counts from the Claude API. Three-arm methodology (normal vs caveman vs glyph) — comparing terse-with-shape against terse-only avoids conflating "glyph wins" with "anything terse wins". Reproducible by anyone with an API key.

| Prompt | Normal | Caveman | Glyph | Glyph vs Caveman |
|--------|-------:|--------:|------:|:----------------:|
| compare-options (caching) | 1216 | 571 | 538 | **-33** |
| branching-logic (JWT) | 1093 | 564 | 405 | **-159** |
| hierarchy (Next.js) | 1324 | 1189 | 1275 | +86 |
| numeric-series (bundles) | 816 | 400 | 458 | +58 |
| state-flow (OAuth) | 1311 | 438 | 684 | +246 |
| single-fact (port) | 11 | 2 | 2 | tie |
| react-rerender | 557 | 228 | 246 | +18 |
| tradeoff-matrix (DB) | 649 | 269 | 353 | +84 |
| **Average** | **872** | **458** | **495** | **+37** |

```bash
# Reproduce yourself
export ANTHROPIC_API_KEY=sk-ant-...
cd benchmarks
uv run python llm_run.py                       # generate samples (~5 min, ~$0.50)
uv run --with tiktoken python measure.py       # token counts → results.md
uv run --with anthropic python judge.py        # claude-as-judge → judge_results.md
```

> [!IMPORTANT]
> Glyph wins on **comparison** and **branching** content (where structure pays for itself). Glyph loses tokens on **prose-heavy / state-flow** content where ASCII boxes add chars without proportional clarity gain. The skill knows this and falls back to caveman prose when content is genuinely linear.

## Honest weakness

Found by the benchmark itself: glyph occasionally over-formats simple cause lists (forces table when prose suffices). SKILL.md was tightened in v0.1 with a 5-question pre-flight check before adding visuals. See `benchmarks/judge_results.md` for per-prompt judge notes.

## Roadmap

- [x] Track 1 — skill + hooks (works on stock CC)
- [x] All 7 sub-skills (glyph, help, commit, review, debug, status, scaffold)
- [x] Three-arm benchmark + LLM-judge harness
- [x] Real numbers in README — no marketing claims
- [ ] Codex / Gemini / Cursor / Windsurf ports (skill files only — no auto-activation hook system)
- [ ] Track 2 fork — custom Ink components for ` ```glyph:tree `, ` ```glyph:flow `, ` ```glyph:chart ` fenced blocks (renders native React in terminal). See `docs/track-2-fork-design.md`

## Ecosystem

Glyph stays narrow — it owns the message. For the rest:

| Need | Use |
|------|-----|
| Cut output tokens (text-only) | [caveman](https://github.com/JuliusBrussee/caveman) — glyph's lexical layer is built on caveman |
| Compress memory files | [caveman-compress](https://github.com/JuliusBrussee/caveman) (cuts ~46% of input tokens) |
| Cross-session memory | [claude-mem](https://github.com/thedotmack/claude-mem) |
| HUD chrome around chat | [claude-hud](https://github.com/jarrodwatts/claude-hud) |
| TDD enforcement hook | [tdd-guard](https://github.com/nizos/tdd-guard) |
| Excalidraw export | [excalidraw-mcp](https://github.com/excalidraw/excalidraw-mcp) |

Glyph composes with all of the above. No conflicts.

## Star this repo

If glyph helps you scan dev docs faster — leave a star ⭐

## Credits

- [Julius Brussee](https://github.com/JuliusBrussee) — original [caveman](https://github.com/JuliusBrussee/caveman) plugin. Glyph absorbs caveman's lexical compression rules and adds the visual layer.
- Anthropic — Claude Code source structure (Ink, Markdown.tsx, MarkdownTable.tsx) informed the visual primitive selection.

## License

MIT — same as caveman.
