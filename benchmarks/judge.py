"""
LLM-as-judge eval harness for glyph.

Reads samples/results.json (output from llm_run.py), feeds each three-arm
output set to Claude as a judge, asks it to score on:
  - readability (how fast can a developer scan and decide?)
  - completeness (was technical info preserved vs lost?)
  - format-fit  (did glyph pick the right shape for the content?)

Writes scores to samples/judge.json and a summary table to judge_results.md.

This catches regressions: if SKILL.md edits make output worse, scores drop.

Usage:
    export ANTHROPIC_API_KEY=...
    uv run --with anthropic python judge.py
"""
import json
import os
from pathlib import Path

try:
    from anthropic import Anthropic
except ImportError:
    raise SystemExit("anthropic not installed. Run: uv run --with anthropic python judge.py")

SAMPLES = Path(__file__).parent / "samples" / "results.json"
PROMPTS = Path(__file__).parent / "prompts.json"
OUTPUT_JSON = Path(__file__).parent / "samples" / "judge.json"
OUTPUT_MD = Path(__file__).parent / "judge_results.md"

MODEL = "claude-opus-4-7"

JUDGE_SYSTEM = """You are an expert technical-writing judge. You will be shown a developer prompt
and three candidate responses (labeled "normal", "caveman", "glyph"). Each response answers the same prompt.

Score each response on three axes (1-10 integer scale):

1. **readability** — How fast can a busy developer scan this and reach a decision?
   1 = wall of text, must read line-by-line
   10 = decision visible at a glance via structure (table, tree, bullets)

2. **completeness** — Was the technical information preserved vs lost?
   1 = critical detail missing
   10 = all technical content present, no important nuance dropped

3. **format-fit** — Did the response use the right shape for this content?
   1 = wrong format (e.g., prose dump for a comparison, or a table for a single-fact answer)
   10 = ideal format, content shape matches output shape

Return STRICT JSON only, no prose, no markdown:

{
  "normal":  { "readability": N, "completeness": N, "format_fit": N, "note": "..." },
  "caveman": { "readability": N, "completeness": N, "format_fit": N, "note": "..." },
  "glyph":   { "readability": N, "completeness": N, "format_fit": N, "note": "..." }
}

Each "note" must be ONE sentence describing why this arm scored as it did.
"""


def judge_one(client: Anthropic, prompt: str, expected_format: str, arms: dict) -> dict:
    user_msg = f"""Developer prompt:
{prompt}

(Ideal format for this content shape: {expected_format})

---

Candidate "normal":
{arms["normal"]}

---

Candidate "caveman":
{arms["caveman"]}

---

Candidate "glyph":
{arms["glyph"]}
"""
    msg = client.messages.create(
        model=MODEL,
        max_tokens=1500,
        system=JUDGE_SYSTEM,
        messages=[{"role": "user", "content": user_msg}],
    )
    raw = "".join(b.text for b in msg.content if b.type == "text").strip()

    # Strip code-fence wrappers if model added them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return json.loads(raw)


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise SystemExit("ANTHROPIC_API_KEY not set")
    if not SAMPLES.exists():
        raise SystemExit(f"No samples at {SAMPLES}. Run llm_run.py first.")

    samples = json.loads(SAMPLES.read_text())
    prompts = {p["id"]: p for p in json.loads(PROMPTS.read_text())["prompts"]}

    client = Anthropic()
    judgments: dict[str, dict] = {}

    for pid, arms in samples.items():
        spec = prompts.get(pid)
        if not spec:
            print(f"  skip {pid} (no prompt spec)")
            continue
        print(f"  judge {pid}...", flush=True)
        try:
            judgments[pid] = judge_one(client, spec["prompt"], spec["expected_format"], arms)
        except json.JSONDecodeError as e:
            print(f"    FAILED: model returned non-JSON ({e}). Skipping.")
            continue

    OUTPUT_JSON.write_text(json.dumps(judgments, indent=2))

    # Summary table
    lines = ["# glyph judge results", "", "## Per-prompt scores", "",
             "| Prompt | Arm | Read | Complete | Format | Note |",
             "|--------|-----|-----:|---------:|-------:|------|"]

    arm_totals = {arm: {"r": [], "c": [], "f": []} for arm in ("normal", "caveman", "glyph")}

    for pid, j in judgments.items():
        for arm in ("normal", "caveman", "glyph"):
            s = j.get(arm, {})
            r, c, f = s.get("readability", 0), s.get("completeness", 0), s.get("format_fit", 0)
            note = s.get("note", "").replace("|", "\\|")
            lines.append(f"| {pid} | {arm} | {r} | {c} | {f} | {note} |")
            arm_totals[arm]["r"].append(r)
            arm_totals[arm]["c"].append(c)
            arm_totals[arm]["f"].append(f)

    lines += ["", "## Arm averages", "",
              "| Arm | Avg readability | Avg completeness | Avg format-fit |",
              "|-----|----------------:|-----------------:|---------------:|"]
    for arm, t in arm_totals.items():
        if not t["r"]:
            continue
        avg_r = sum(t["r"]) / len(t["r"])
        avg_c = sum(t["c"]) / len(t["c"])
        avg_f = sum(t["f"]) / len(t["f"])
        lines.append(f"| {arm} | {avg_r:.1f} | {avg_c:.1f} | {avg_f:.1f} |")

    OUTPUT_MD.write_text("\n".join(lines))
    print(f"Wrote {OUTPUT_JSON} and {OUTPUT_MD}")


if __name__ == "__main__":
    main()
