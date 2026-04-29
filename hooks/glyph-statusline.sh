#!/usr/bin/env bash
# glyph-statusline.sh — outputs [GLYPH], [GLYPH:LITE], [GLYPH:ULTRA], or empty
# Reads ~/.claude/.glyph-active (written by glyph-activate.js)

flag="$HOME/.claude/.glyph-active"

if [[ ! -f "$flag" ]]; then
  exit 0
fi

mode="$(cat "$flag" 2>/dev/null)"

case "$mode" in
  full)  printf "\033[38;5;208m[GLYPH]\033[0m" ;;
  lite)  printf "\033[38;5;215m[GLYPH:LITE]\033[0m" ;;
  ultra) printf "\033[38;5;196m[GLYPH:ULTRA]\033[0m" ;;
  off)   ;;
  *)     ;;
esac
