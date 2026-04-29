"""
Generate benchmark samples by calling Claude API in three arms:
  - normal: no system prompt (baseline)
  - caveman: caveman ruleset only (lexical compression)
  - glyph: caveman + visual ruleset (full glyph)

Writes outputs to samples/results.json keyed by prompt_id then arm.

Usage:
    export ANTHROPIC_API_KEY=...
    uv run python llm_run.py
"""
import json
import os
from pathlib import Path

try:
    from anthropic import Anthropic
except ImportError:
    raise SystemExit("anthropic not installed. Run: uv run --with anthropic python llm_run.py")

PROMPTS = Path(__file__).parent / "prompts.json"
SAMPLES_DIR = Path(__file__).parent / "samples"
SKILL_PATH = Path(__file__).parent.parent / "skills" / "glyph" / "SKILL.md"

MODEL = "claude-opus-4-7"

CAVEMAN_PROMPT = """Respond terse like smart caveman. All technical substance stay. Only fluff die.

Drop articles (a/an/the), filler (just/really/basically), pleasantries, hedging.
Fragments OK. Short synonyms. Technical terms exact. Code unchanged. Errors quoted.
Pattern: [thing] [action] [reason]. [next step]."""


def load_glyph_prompt() -> str:
    """Read SKILL.md, strip frontmatter."""
    raw = SKILL_PATH.read_text()
    return raw.split("---", 2)[2].strip() if raw.startswith("---") else raw


def run_arm(client: Anthropic, prompt: str, system: str | None) -> str:
    msg = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        system=system or "",
        messages=[{"role": "user", "content": prompt}],
    )
    return "".join(block.text for block in msg.content if block.type == "text")


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise SystemExit("ANTHROPIC_API_KEY not set")

    SAMPLES_DIR.mkdir(exist_ok=True)
    client = Anthropic()
    prompts = json.loads(PROMPTS.read_text())["prompts"]
    glyph_system = load_glyph_prompt()

    results: dict[str, dict[str, str]] = {}

    for spec in prompts:
        pid = spec["id"]
        prompt = spec["prompt"]
        print(f"  {pid}...", flush=True)

        results[pid] = {
            "normal": run_arm(client, prompt, None),
            "caveman": run_arm(client, prompt, CAVEMAN_PROMPT),
            "glyph": run_arm(client, prompt, glyph_system),
        }

    out = SAMPLES_DIR / "results.json"
    out.write_text(json.dumps(results, indent=2))
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
