# glyph-statusline.ps1 — Windows statusline badge
# Outputs [GLYPH], [GLYPH:LITE], [GLYPH:ULTRA], or nothing.
# Reads ~/.claude/.glyph-active (written by glyph-activate.js).

$flag = Join-Path $HOME ".claude/.glyph-active"

if (-not (Test-Path $flag)) { exit 0 }

$mode = (Get-Content $flag -Raw -ErrorAction SilentlyContinue).Trim()

# ANSI 256-color escape — mirrors glyph-statusline.sh
$esc = [char]27

switch ($mode) {
    'full'  { Write-Host -NoNewline "$esc[38;5;208m[GLYPH]$esc[0m" }
    'lite'  { Write-Host -NoNewline "$esc[38;5;215m[GLYPH:LITE]$esc[0m" }
    'ultra' { Write-Host -NoNewline "$esc[38;5;196m[GLYPH:ULTRA]$esc[0m" }
    default { }
}
