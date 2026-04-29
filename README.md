<p align="center">
  <strong>glyph</strong>
</p>

<p align="center">
  <em>speak less. show more.</em>
</p>

<p align="center">
  <a href="#the-honest-tradeoff">Tradeoff</a> •
  <a href="#before--after-real-prompts-real-token-counts">Before/After</a> •
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
└─────────────────────────────────────────────────────────────┘
```

Built on [Julius Brussee's caveman](https://github.com/JuliusBrussee/caveman) — caveman cuts words, glyph adds visual structure on top.

## The honest tradeoff

Benchmarked across 8 dev prompts (Claude Opus 4.7 as judge):

```
                   tokens     readability    format-fit
                   ──────     ───────────    ──────────
   normal           872          7.2            7.5
   caveman          458 ⭐       8.4            7.8
   glyph            495          9.0 ⭐         9.5 ⭐
```

```
glyph vs normal:    -43% tokens, +1.8 readability, +2.0 format-fit
glyph vs caveman:   +8% tokens,  +0.6 readability, +1.7 format-fit
```

**Glyph is NOT the smallest output** — caveman wins that. Glyph trades a few extra tokens (visual chars: `┌─┐`, `|`, `✅`) for visual structure that's faster to scan and shape-correct.

| Pick this | When |
|-----------|------|
| **glyph** | comparing options, branching logic, file structure, daily dev work |
| **caveman** | minimum-token responses, single-fact answers, terminal output you'll grep |
| **normal** | research mode where every nuance matters |

Where glyph shines vs caveman (real numbers from `benchmarks/results.md`):

```
prompt              caveman    glyph     verdict
─────────           ───────    ─────     ───────
compare-options       571       538      glyph -33 tokens AND better
branching-logic       564       405      glyph -159 tokens AND better
hierarchy            1189      1275      caveman cheaper, glyph clearer
state-flow            438       684      caveman cheaper, glyph clearer
react-rerender        228       246      caveman wins (simple cause list)
single-fact             2         2      tie (no diagram needed)
```

If you only need text compression, install [caveman](https://github.com/JuliusBrussee/caveman). If you want shape-aware visuals on top, install glyph.

## Before / After (real prompts, real token counts)

Pulled from `benchmarks/samples/results.json`. Token counts via tiktoken.

### Prompt: "compare three caching strategies"

**Normal Claude — 1216 tokens, prose-heavy:**
> "When evaluating caching strategies for a high-traffic API, you have three primary options: in-memory LRU, Redis, and CDN edge cache. Each comes with distinct tradeoffs that should be weighed against your specific requirements. In-memory LRU caches store data directly within the application process, providing extremely low latency..."

**Caveman — 571 tokens, terse bullets:**
> "3 strategies. LRU: ~0.1ms, free, manual invalidation, lost on restart. Redis: ~1ms, $$, TTL+evict, network hop. CDN: ~50ms first hop, $$$, tag-based, edge cache. Pick LRU for hot path, Redis for shared state, CDN for static."

**Glyph — 538 tokens, table:**
```
| Strategy   | Latency  | Cost  | Invalidation | Failure mode    |
|------------|---------:|-------|--------------|-----------------|
| LRU        | ~0.1ms   | $     | manual       | lost on restart |
| Redis      | ~1ms     | $$    | TTL + evict  | network split   |
| CDN edge   | ~50ms    | $$$   | tag-based    | stale at edge   |
```
Glyph saved 33 tokens vs caveman AND scored higher on readability (9 vs 8) and format-fit (10 vs 6) per LLM judge. Comparison content has table shape — glyph picked it.

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
- [x] glyph-commit, glyph-review, glyph-debug, glyph-status, glyph-scaffold skills
- [x] Benchmark harness — three-arm prompt suite + tiktoken measurement
- [x] Run benchmarks + publish numbers (see [Measured results](#measured-results) below)
- [x] LLM-judge eval harness — readability/completeness/format-fit scores
- [ ] Track 2 fork — custom Ink components for ` ```glyph:tree `, ` ```glyph:flow `, ` ```glyph:chart ` fenced blocks (renders native React in terminal). See `docs/track-2-fork-design.md`

## Reproduce the benchmarks

The headline numbers in [The honest tradeoff](#the-honest-tradeoff) come from this harness:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
cd benchmarks
uv run python llm_run.py                       # generates 8 prompts × 3 arms (~5 min)
uv run --with tiktoken python measure.py       # tiktoken counts → results.md
uv run --with anthropic python judge.py        # claude-as-judge → judge_results.md
```

Outputs:
- `benchmarks/samples/results.json` — raw three-arm outputs
- `benchmarks/results.md` — token table per prompt + arm averages
- `benchmarks/samples/judge.json` — readability/completeness/format-fit per prompt
- `benchmarks/judge_results.md` — averages + per-prompt judge notes

Cost ~$0.50 against the Anthropic API. Run it yourself; numbers should match within ±5% (LLM-judge has variance).

Honest weakness identified by the benchmark: glyph occasionally over-formats simple cause lists (forces table when prose suffices). SKILL.md was tightened to push back on this in v0.1.0.

## Credits

- [Julius Brussee](https://github.com/JuliusBrussee) — original [caveman](https://github.com/JuliusBrussee/caveman) plugin. Glyph is a superset built on caveman's lexical compression rules.
- Anthropic — Claude Code source structure (Ink, Markdown.tsx, MarkdownTable.tsx) informed the visual primitive selection.

## License

MIT
