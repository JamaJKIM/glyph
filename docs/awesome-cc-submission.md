# awesome-claude-code submission draft

⚠️ **Submit via WEB UI ONLY** — do NOT use `gh` CLI. Bot bans automated submissions.

URL: https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml

Below are the exact field values to paste.

---

## Display Name

```
glyph
```

## Category

```
Agent Skills
```

## Sub-Category

```
General
```

## Primary Link

```
https://github.com/JamaJKIM/glyph
```

## Description (≤350 chars target)

```
Visual + terse output mode for Claude Code. Combines caveman-style lexical compression with auto-selected ASCII visuals (tables, decision trees, hierarchies, sparklines). Benchmarked: 43% fewer tokens vs default, 9.0/10 readability vs 7.2 (claude-as-judge). Five sub-skills: glyph, glyph-commit, glyph-review, glyph-debug, glyph-status, glyph-scaffold.
```

## License

```
MIT
```

## Author Name

```
James Kim
```

## Author Link

```
https://github.com/JamaJKIM
```

## Active (still maintained?)

```
Yes
```

## Network requests / shared system files / bypass-permissions / telemetry?

```
None. Pure stdout/stdin via Claude Code hook system. No network calls. No telemetry. Reads/writes only ~/.claude/.glyph-mode and ~/.claude/.glyph-active flag files. No bypass-permissions required.
```

## Installation

```
1. claude plugin marketplace add JamaJKIM/glyph
2. claude plugin install glyph@glyph
3. /glyph     (activate; default is opt-in off)
```

## Uninstallation

```
1. claude plugin uninstall glyph@glyph
2. claude plugin marketplace remove glyph
3. rm -f ~/.claude/.glyph-mode ~/.claude/.glyph-active
```

## Evidence / claims

> "Benchmark shows..."

```
Three-arm benchmark (8 prompts × normal vs caveman vs glyph) using Claude Opus 4.7 as judge.

| Metric          | Normal | Caveman | Glyph |
|-----------------|-------:|--------:|------:|
| Avg tokens      | 872    | 458     | 495   |
| Readability     | 7.2    | 8.4     | 9.0   |
| Format-fit      | 7.5    | 7.8     | 9.5   |

Reproducible: ANTHROPIC_API_KEY=... && cd benchmarks && uv run python llm_run.py && uv run --with tiktoken python measure.py && uv run --with anthropic python judge.py

Raw outputs in benchmarks/samples/results.json. Judge scores in samples/judge.json. Generation script in benchmarks/llm_run.py (40 lines, plain-text Anthropic API calls).
```

## Demo / video / screenshot

```
README has live before/after examples comparing prose vs glyph output for:
- 3-option architecture comparison (table)
- token-expiry validation flow (decision tree)
- React re-render explanation (caveman sentence — no diagram)

Plus: design rationale + leaked CC source analysis in docs/track-2-fork-design.md showing where custom Ink components could slot into Markdown.tsx.
```

## Differentiator vs adjacent projects

```
- caveman (JuliusBrussee): owns lexical compression. glyph absorbs caveman's rules and adds visual structure layer (table/tree/box/sparkline) that picks shape from content. credits caveman in LICENSE.
- claude-hud (jarrodwatts): owns HUD chrome around chat. glyph owns the message itself.
- claude-mem: owns session memory. orthogonal to glyph.
```

---

## Submission steps

```
1. open  https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml
2. paste each field above into the matching form input
3. submit (must be web UI, not gh CLI)
4. wait for bot validation comment (5 min)
5. if validation fails, fix per bot feedback and re-submit
6. once approved, maintainer opens PR upstream
```

## After approval

Add badge to glyph README:
```markdown
[![Mentioned in Awesome Claude Code](https://awesome.re/mentioned-badge.svg)](https://github.com/hesreallyhim/awesome-claude-code)
```
