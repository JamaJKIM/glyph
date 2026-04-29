# benchmarks

Token + scan-time measurements for glyph vs caveman vs normal Claude.

## What we measure

| Metric | How |
|--------|-----|
| Output tokens | tiktoken count via `measure.py` |
| Scan time | (planned) human-judge eval — time-to-first-decision |
| Information retention | (planned) LLM-judge — "can a fresh model answer Qs from this output?" |

## Running

```bash
# Generate samples (needs ANTHROPIC_API_KEY)
uv run python llm_run.py

# Measure offline (no API key)
uv run --with tiktoken python measure.py
```

## Three-arm design

Critical: don't compare glyph to verbose Claude — that conflates "visual structure" with "generic terseness". Three arms:

```
arm A: normal Claude (control)
arm B: caveman alone (lexical compression baseline)
arm C: glyph (caveman + visual structure)
```

Glyph wins only if `tokens(C) < tokens(B)` AND scan-time(C) < scan-time(B).

## Prompts

See `prompts.json` for the test set. Targets content shapes glyph claims to handle:
- comparing options
- branching logic
- hierarchy
- numeric series
- single fact (control — glyph should NOT add diagram here)
