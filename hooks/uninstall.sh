#!/usr/bin/env bash
# glyph uninstaller — removes hook files and the .glyph-active / .glyph-mode flags

set -euo pipefail

CLAUDE_DIR="$HOME/.claude"

rm -f "$CLAUDE_DIR/hooks/glyph-activate.js"
rm -f "$CLAUDE_DIR/hooks/glyph-mode-tracker.js"
rm -f "$CLAUDE_DIR/hooks/glyph-config.js"
rm -f "$CLAUDE_DIR/hooks/glyph-statusline.sh"
rm -f "$CLAUDE_DIR/.glyph-active"
rm -f "$CLAUDE_DIR/.glyph-mode"

echo "glyph hooks removed."
echo "Manual step: remove glyph entries from $CLAUDE_DIR/settings.json"
