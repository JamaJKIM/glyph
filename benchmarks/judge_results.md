# glyph judge results

## Per-prompt scores

| Prompt | Arm | Read | Complete | Format | Note |
|--------|-----|-----:|---------:|-------:|------|
| compare-options | normal | 7 | 10 | 8 | Comprehensive with a strong summary table, but long prose sections require reading to extract details. |
| compare-options | caveman | 8 | 9 | 6 | Terse bullets are scannable and cover all axes, but a comparison table would fit the content shape better. |
| compare-options | glyph | 9 | 9 | 10 | Multiple tables, decision tree, and stack diagram match the comparison shape ideally and enable instant scanning. |
| branching-logic | normal | 7 | 10 | 8 | Comprehensive with ASCII tree and supporting tables, but length slows scanning despite strong structure. |
| branching-logic | caveman | 9 | 9 | 9 | Tight decision tree with terse per-check notes hits the ideal shape with minimal fluff. |
| branching-logic | glyph | 9 | 7 | 9 | Visually striking tree plus summary table, but omits parsing step and details like alg:none and clock skew. |
| hierarchy | normal | 7 | 8 | 7 | Good structure with tree plus sections, but appears truncated at the end and mixes many formats. |
| hierarchy | caveman | 7 | 9 | 7 | Comprehensive coverage including PPR and rendering modes, but heavier on prose sections than the ideal tree-centric shape. |
| hierarchy | glyph | 9 | 9 | 10 | Tree-first layout with supporting tables and ASCII diagrams perfectly matches the requested indented-tree shape. |
| numeric-series | normal | 7 | 10 | 7 | Comprehensive with tables and one block-bar chart, but the prose-heavy structure slows scanning compared to a unified visual. |
| numeric-series | caveman | 7 | 8 | 6 | Terse and scannable but lacks the visual sparkline/bar shape ideal for size comparisons. |
| numeric-series | glyph | 9 | 9 | 10 | Unified table plus block-bar chart matches the ideal shape exactly, enabling instant visual comparison. |
| state-flow | normal | 7 | 10 | 7 | Comprehensive with diagram and tables but lengthy and ends mid-sentence in summary. |
| state-flow | caveman | 8 | 7 | 6 | Concise and scannable but lacks the boxes+arrows shape ideal for flow content. |
| state-flow | glyph | 9 | 9 | 10 | ASCII sequence diagram plus parameter table perfectly matches the flow shape. |
| single-fact | normal | 9 | 10 | 8 | Clear sentence with bolded answer, slightly more than needed for a single fact. |
| single-fact | caveman | 10 | 10 | 10 | Bare number is the ideal minimal answer for a single-fact question. |
| single-fact | glyph | 10 | 10 | 10 | Same minimal answer, perfectly matches the question shape. |
| react-rerender | normal | 6 | 10 | 6 | Thorough and well-organized but long; requires scrolling to scan all causes. |
| react-rerender | caveman | 9 | 9 | 9 | Terse numbered list with code and fixes matches the troubleshooting shape well. |
| react-rerender | glyph | 8 | 8 | 7 | Table and flow diagram are scannable but the ASCII flow is overkill for a simple cause list. |
| tradeoff-matrix | normal | 8 | 10 | 9 | Comprehensive table plus detailed prose reasoning, slightly long but well-structured for decision-making. |
| tradeoff-matrix | caveman | 9 | 8 | 9 | Tight table and terse bullets hit the decision fast, though some nuance (GSI cost, vacuum) is trimmed. |
| tradeoff-matrix | glyph | 9 | 8 | 10 | Bar-chart table plus decision tree visually conveys tradeoffs at a glance, ideal shape for this comparison. |

## Arm averages

| Arm | Avg readability | Avg completeness | Avg format-fit |
|-----|----------------:|-----------------:|---------------:|
| normal | 7.2 | 9.8 | 7.5 |
| caveman | 8.4 | 8.6 | 7.8 |
| glyph | 9.0 | 8.6 | 9.5 |