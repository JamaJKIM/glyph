# Benchmarks

How glyph's claims were measured. How to reproduce them.

## Methodology

Three-arm benchmark across 8 dev prompts. Each prompt gets answered three times:

| Arm | System prompt | What it tests |
|-----|---------------|---------------|
| `normal` | (none) | default Claude prose |
| `caveman` | caveman lexical rules | terse text without visuals |
| `glyph` | full glyph SKILL.md | terse text + auto-selected visuals |

Two scoring passes:

1. **Token count** (`measure.py`) — tiktoken cl100k_base on each output. Offline, deterministic.
2. **LLM-as-judge** (`judge.py`) — Claude Opus 4.7 scores each output on three axes (1-10):
   - **readability** — how fast can a busy developer scan and decide?
   - **completeness** — was technical info preserved vs lost?
   - **format-fit** — did the response use the right shape for the content?

Why three arms: comparing glyph only to verbose Claude conflates "glyph wins" with "anything terse wins". Caveman as a control isolates the visual-structure contribution.

## Headline results

| Metric | Normal | Caveman | Glyph |
|--------|-------:|--------:|------:|
| Avg output tokens | 872 | **458** ⭐ | 495 |
| Tokens vs normal | — | -48% | -43% |
| Readability (1-10) | 7.2 | 8.4 | **9.0** ⭐ |
| Completeness (1-10) | **9.8** ⭐ | 8.6 | 8.6 |
| Format-fit (1-10) | 7.5 | 7.8 | **9.5** ⭐ |

**Glyph is NOT the smallest output** — caveman wins on raw tokens. Glyph trades 8% extra tokens for shape-correct structure (visual chars: `┌─┐`, `|`, `✅`).

## Per-prompt detail

Where glyph wins on tokens AND quality, where it loses:

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

Pattern:
- **Comparison + branching** content → glyph wins both tokens and quality (table/tree pays for itself)
- **Prose-flow content** (state-flow) → caveman wheels-up cheaper because ASCII boxes add chars without proportional clarity gain
- **Single fact** → tie (no diagram, both modes drop to terse prose)

## Where glyph loses (and why we kept it)

`react-rerender` shipped at 7/10 format-fit (vs caveman's 9). The judge note: "table and flow diagram are scannable but the ASCII flow is overkill for a simple cause list."

This is the **over-format bug**. SKILL.md was tightened in v0.1 to push back on it via a 5-question pre-flight check before adding visuals. Future benchmarks should show this regress upward.

## Reproduce

```bash
# Setup
git clone https://github.com/jamesjoonkim/glyph
cd glyph/benchmarks
export ANTHROPIC_API_KEY=sk-ant-...

# Generate 8 prompts × 3 arms → samples/results.json (~5 min, ~$0.30 in API)
uv run python llm_run.py

# Token counts → results.md (offline, instant)
uv run --with tiktoken python measure.py

# Judge scores → judge_results.md (~3 min, ~$0.20 in API)
uv run --with anthropic python judge.py
```

Total cost: ~$0.50 per full run. Variance: LLM judge has ±5% inter-run noise. Token counts are deterministic.

## Outputs

| File | Contents |
|------|----------|
| `benchmarks/samples/results.json` | raw three-arm outputs per prompt |
| `benchmarks/samples/judge.json` | per-prompt judge scores |
| `benchmarks/results.md` | token table per prompt + arm averages |
| `benchmarks/judge_results.md` | readability/completeness/format-fit averages + per-prompt notes |

## Limitations

- 8 prompts is a small sample. Coverage skews toward dev-task patterns (comparison, debugging, planning). Won't generalize to creative writing or long-form prose.
- Single judge model (Opus 4.7). Could be biased toward its own format preferences. Cross-model judging is future work.
- Glyph's `react-rerender` weakness shows the over-format bug; v0.1 SKILL.md tightening hasn't been re-benchmarked yet.
- Caveman comparison uses a minimal lexical-only system prompt, not the full caveman plugin (which would inject more rules per session). Numbers are best-effort approximations of caveman's behavior.

## Adding new prompts

Edit `benchmarks/prompts.json`:

```json
{
  "id": "your-prompt-id",
  "shape": "comparing | branching | hierarchy | etc",
  "prompt": "the actual question text",
  "expected_format": "what format glyph should pick"
}
```

Re-run `llm_run.py` and `measure.py`. Judge scores require a second `judge.py` pass.
