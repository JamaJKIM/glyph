#!/usr/bin/env bash
# glyph standalone hook installer (no plugin system)
# Installs SessionStart + UserPromptSubmit hooks into ~/.claude/settings.json
# and copies hook scripts to ~/.claude/hooks/

set -euo pipefail

CLAUDE_DIR="$HOME/.claude"
HOOKS_DIR="$CLAUDE_DIR/hooks"
SETTINGS="$CLAUDE_DIR/settings.json"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$HOOKS_DIR"

cp "$SOURCE_DIR/glyph-activate.js"      "$HOOKS_DIR/"
cp "$SOURCE_DIR/glyph-mode-tracker.js"  "$HOOKS_DIR/"
cp "$SOURCE_DIR/glyph-config.js"        "$HOOKS_DIR/"
cp "$SOURCE_DIR/glyph-statusline.sh"    "$HOOKS_DIR/"
chmod +x "$HOOKS_DIR/glyph-statusline.sh"

echo "glyph hooks copied to $HOOKS_DIR/"
echo ""
echo "Next: add the following to $SETTINGS under \"hooks\":"
echo ""
cat <<'JSON'
{
  "hooks": {
    "SessionStart": [
      { "hooks": [ { "type": "command", "command": "node ~/.claude/hooks/glyph-activate.js", "timeout": 5 } ] }
    ],
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node ~/.claude/hooks/glyph-mode-tracker.js", "timeout": 5 } ] }
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/hooks/glyph-statusline.sh"
  }
}
JSON
echo ""
echo "Done. Restart Claude Code. Statusline shows [GLYPH] when active."
