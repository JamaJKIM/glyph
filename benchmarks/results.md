# glyph benchmark results

## Per-prompt

| Prompt | Arm | Tokens | Formats |
|--------|-----|-------:|---------|
| compare-options | normal | 1216 | table,arrow |
| compare-options | caveman | 571 | arrow |
| compare-options | glyph | 538 | table,box,arrow |
| branching-logic | normal | 1093 | table,tree,box,arrow |
| branching-logic | caveman | 564 | box,arrow |
| branching-logic | glyph | 405 | table,tree,box,arrow |
| hierarchy | normal | 1324 | table,tree,box |
| hierarchy | caveman | 1189 | prose |
| hierarchy | glyph | 1275 | table,tree,box,arrow |
| numeric-series | normal | 816 | table,sparkline,bar |
| numeric-series | caveman | 400 | table |
| numeric-series | glyph | 458 | table,sparkline,bar,arrow |
| state-flow | normal | 1311 | table,box,arrow |
| state-flow | caveman | 438 | arrow |
| state-flow | glyph | 684 | table,tree,box,arrow |
| single-fact | normal | 11 | prose |
| single-fact | caveman | 2 | prose |
| single-fact | glyph | 2 | prose |
| react-rerender | normal | 557 | prose |
| react-rerender | caveman | 228 | arrow |
| react-rerender | glyph | 246 | table,box,arrow |
| tradeoff-matrix | normal | 649 | table |
| tradeoff-matrix | caveman | 269 | table,arrow |
| tradeoff-matrix | glyph | 353 | table,tree,box,sparkline,bar,arrow |

## Arm averages

| Arm | Avg tokens | Vs normal |
|-----|-----------:|----------:|
| normal | 872 | — |
| caveman | 458 | 48% saved |
| glyph | 495 | 43% saved |