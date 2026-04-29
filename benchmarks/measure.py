"""
Offline token + structure measurement for glyph benchmark samples.

Reads samples/results.json (produced by llm_run.py), counts tokens with tiktoken,
detects format usage (table/tree/sparkline/etc), and writes summary to results.md.

Usage:
    uv run --with tiktoken python measure.py
"""
import json
import re
from pathlib import Path

try:
    import tiktoken
except ImportError:
    raise SystemExit("tiktoken not installed. Run: uv run --with tiktoken python measure.py")

ENC = tiktoken.get_encoding("cl100k_base")
SAMPLES = Path(__file__).parent / "samples" / "results.json"
OUTPUT = Path(__file__).parent / "results.md"


def count_tokens(text: str) -> int:
    return len(ENC.encode(text))


def detect_formats(text: str) -> list[str]:
    """Return list of visual primitives detected in output."""
    formats = []
    if re.search(r"^\|.*\|.*\|", text, re.MULTILINE):
        formats.append("table")
    if "├──" in text or "└──" in text:
        formats.append("tree")
    if re.search(r"[┌┐└┘─│┬┴┼]", text):
        formats.append("box")
    if re.search(r"[▁▂▃▄▅▆▇█]{3,}", text):
        formats.append("sparkline")
    if re.search(r"[█▓▒░]{3,}", text):
        formats.append("bar")
    if "→" in text or "▶" in text:
        formats.append("arrow")
    return formats or ["prose"]


def main():
    if not SAMPLES.exists():
        raise SystemExit(f"No samples found at {SAMPLES}. Run llm_run.py first.")

    data = json.loads(SAMPLES.read_text())

    # data is dict[prompt_id, dict[arm_name, output_str]]
    rows = []
    arm_totals = {}

    for pid, arms in data.items():
        for arm, output in arms.items():
            tokens = count_tokens(output)
            formats = detect_formats(output)
            rows.append({"id": pid, "arm": arm, "tokens": tokens, "formats": ",".join(formats)})
            arm_totals.setdefault(arm, []).append(tokens)

    # Render markdown
    lines = ["# glyph benchmark results", "", "## Per-prompt", "",
             "| Prompt | Arm | Tokens | Formats |",
             "|--------|-----|-------:|---------|"]
    for r in rows:
        lines.append(f"| {r['id']} | {r['arm']} | {r['tokens']} | {r['formats']} |")

    lines += ["", "## Arm averages", "",
              "| Arm | Avg tokens | Vs normal |",
              "|-----|-----------:|----------:|"]

    normal_avg = sum(arm_totals.get("normal", [0])) / max(len(arm_totals.get("normal", [1])), 1)
    for arm, vals in arm_totals.items():
        avg = sum(vals) / len(vals)
        if arm == "normal":
            pct = "—"
        else:
            saved = (normal_avg - avg) / normal_avg * 100 if normal_avg else 0
            pct = f"{saved:.0f}% saved"
        lines.append(f"| {arm} | {avg:.0f} | {pct} |")

    OUTPUT.write_text("\n".join(lines))
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
