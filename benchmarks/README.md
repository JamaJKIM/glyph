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
# 1. Generate samples (needs ANTHROPIC_API_KEY) — three arms per prompt
uv run python llm_run.py

# 2. Token measurement (no API key, offline)
uv run --with tiktoken python measure.py

# 3. LLM-as-judge readability/completeness/format-fit scores (needs API key)
uv run --with anthropic python judge.py
```

Outputs:
- `samples/results.json`     ← raw three-arm outputs
- `samples/judge.json`       ← per-prompt judge scores
- `results.md`               ← token counts table
- `judge_results.md`         ← readability/completeness/format scores

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
