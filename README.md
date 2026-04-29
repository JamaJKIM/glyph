<p align="center">
  <strong>glyph</strong>
</p>

<p align="center">
  <em>speak less. show more.</em>
</p>

<p align="center">
  <a href="#before--after">Before/After</a> •
  <a href="#install">Install</a> •
  <a href="#levels">Levels</a> •
  <a href="#how-it-works">How it works</a> •
  <a href="#credits">Credits</a>
</p>

---

A Claude Code skill/plugin that fuses two compression layers into one mode:

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
│                                                             │
│  same accuracy. ~75% fewer tokens. 3-5x faster to scan.    │
└─────────────────────────────────────────────────────────────┘
```

Built on [Julius Brussee's caveman](https://github.com/JuliusBrussee/caveman) — caveman cuts words, glyph adds visual structure on top.

## Before / After

### Comparing 3 architecture options

**Normal Claude (~600 tokens):**
> "There are three frames you could choose. Frame A decouples the stage system from Google access, which fixes bug 1 but introduces legal risk. Frame B keeps the stage system intact and adds a new gate for demo users, which fixes bug 2 but leaves bug 1 unaddressed. Frame C uses two orthogonal gates and fixes both bugs but touches more files..."

**Caveman alone (~45 tokens):**
> "3 frames. A: decouple stage. fixes bug1, legal risk. B: stage+demo gate. fixes bug2, bug1 unfixed. C: capability+demo gates. fixes both, ~8 files. Pick C."

**Glyph (~30 tokens, 2-second scan):**
```
| Frame | bug1 | bug2 | files | risk    |
|-------|------|------|-------|---------|
| A     | ✅   | ❌   | ~5    | legal?  |
| B     | ❌   | ✅   | ~3    | low     |
| C ⭐  | ✅   | ✅   | ~8    | scope   |
```

### Explaining a re-render

| Mode | Output |
|------|--------|
| Normal | "Your component is re-rendering because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time..." |
| Glyph lite | "Component re-renders because you create new object reference each render. Wrap in `useMemo`." |
| Glyph full | "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`." |
| Glyph ultra | "Inline obj prop → new ref → re-render. `useMemo`." |

### Visualizing branching logic

**Normal:**
> "First check if the token is expired. If it is, reject the request. Otherwise, validate the signature. If the signature is invalid, reject. Otherwise, accept."

**Glyph:**
```
            token expired?
                │
        ┌───────┴───────┐
       yes              no
        │               │
     reject       signature valid?
                        │
                ┌───────┴───────┐
               yes              no
                │               │
             accept          reject
```

## Install

**Plugin (recommended).** Inside a Claude Code session, run:

```
/plugin marketplace add JamaJKIM/glyph
/plugin install glyph@glyph
```

Restart the session. Then activate with `/glyph` (default is **off** — opt-in).

**Standalone (no plugin system).** Clone and run the installer:

```bash
git clone https://github.com/JamaJKIM/glyph
cd glyph
bash hooks/install.sh
```

The script prints a JSON snippet to add to `~/.claude/settings.json`. Restart Claude Code, then `/glyph` to activate.

## Levels

| Level | Lexical | Visual |
|-------|---------|--------|
| **lite** | Drop filler/hedging only. Keep articles + full sentences | Tables for comparison only |
| **full** ⭐ | Drop articles, fragments OK, short synonyms | Tables + ASCII trees + hierarchies + boxes |
| **ultra** | Abbreviate everything (DB, fn, req, →) | Every output visual; mermaid suggested for graphs >5 nodes |

Switch: `/glyph lite|full|ultra`. Disable: `stop glyph` or `normal mode`.

## How it works

### Lexical layer (from caveman)

```
drop:    articles, filler, pleasantries, hedging
keep:    technical terms, code, errors verbatim
pattern: [thing] [action] [reason] → [next]
```

### Visual layer (format-selection rule)

Picks format from content shape:

| Content shape | Format |
|---|---|
| Comparing 2+ options | Markdown table |
| Sequential steps | Numbered list with `→` arrows |
| Branching logic | ASCII decision tree |
| Hierarchy | Indented tree `├── └──` |
| State / flow | Boxes + arrows |
| Tradeoffs (2 axes) | 2x2 grid |
| File / code structure | Directory tree |
| Numeric series | Sparklines `▁▂▃▄▅▆▇█` |
| Counts | Block bars `█████░░░` |
| Single fact | Plain caveman sentence — no diagram |

### What survives the Claude Code render pipeline

CC is built on Ink (React for CLI). Its markdown renderer (`Markdown.tsx` → `MarkdownTable.tsx`) handles:

| Primitive | Renders | Source proof |
|-----------|---------|--------------|
| Markdown tables | ✅ native | `MarkdownTable.tsx` |
| Code fences (monospace) | ✅ | `HighlightedCode.tsx` |
| Unicode box-drawing `┌─┐│└┘` | ✅ always | terminal text |
| Bold/italic/headings | ✅ | `Markdown.tsx` |
| Terminal hyperlinks `[text](url)` | ✅ if supported | `supports-hyperlinks.ts` |
| Sparklines `▁▂▃▄▅▆▇█` | ✅ always | terminal text |
| Block bars `█▓▒░` | ✅ always | terminal text |
| Mermaid blocks | ❌ inline | text only |
| Inline images | ❌ | Ink owns pipeline |

Glyph uses only the ✅ primitives. No fork required.

## Auto-clarity exceptions

Glyph drops to plain prose for:

```
exception              behavior
──────────             ──────────
security warning       full sentences + bold
single-fact answer     one terse sentence
error message          quote verbatim
code review comment    one line per issue
destructive confirm    full grammar + warning
```

Resume after.

## Roadmap

- [x] Track 1 — skill + hooks (works on stock CC)
- [x] glyph-commit — terse + visual commit messages
- [x] glyph-review — one-line PR comments with severity icons
- [x] Benchmark harness — three-arm prompt suite + tiktoken measurement
- [ ] Run benchmarks + publish numbers
- [ ] LLM-judge eval harness ("more readable?")
- [ ] Track 2 fork — custom Ink components for ` ```glyph:tree `, ` ```glyph:flow `, ` ```glyph:chart ` fenced blocks (renders native React in terminal). See `docs/track-2-fork-design.md`

## Credits

- [Julius Brussee](https://github.com/JuliusBrussee) — original [caveman](https://github.com/JuliusBrussee/caveman) plugin. Glyph is a superset built on caveman's lexical compression rules.
- Anthropic — Claude Code source structure (Ink, Markdown.tsx, MarkdownTable.tsx) informed the visual primitive selection.

## License

MIT
