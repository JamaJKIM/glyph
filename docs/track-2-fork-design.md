# Track 2 — Custom Ink components in forked Claude Code

Skills hit a ceiling: emit text only, render limited to what `Markdown.tsx` already handles. Forking CC unlocks native React-rendered fenced blocks for richer visuals.

## Source structure (from leaked CC breakdown)

```
claude-code/
├── components/
│   ├── Markdown.tsx              ← dispatch lives here
│   ├── MarkdownTable.tsx         ← model for custom block components
│   ├── HighlightedCode.tsx       ← syntax highlighting reference
│   └── StructuredDiff.tsx        ← complex Ink component example
├── ink/
│   ├── ink.tsx                   ← exports Box, Text, Ansi, useTheme
│   ├── render-node-to-output.ts  ← rendering pipeline
│   ├── stringWidth.ts            ← unicode width handling
│   ├── wrapAnsi.ts
│   └── reconciler.ts
└── hooks/
    └── useTerminalSize.ts        ← responsive layout
```

## The dispatch (current behavior, line 143-151 of Markdown.tsx)

```js
for (const token of tokens) {
  if (token.type === "table") {                 // ← only "table" gets React component
    flushNonTableContent();
    elements.push(<MarkdownTable key={...} token={token} highlight={highlight} />);
  } else {
    nonTableContent += formatToken(token, ...); // ← everything else → ANSI string
  }
}
```

This is the **entire** extension surface. CC currently special-cases exactly one token type.

## Patch (Track 2)

```diff
 for (const token of tokens) {
   if (token.type === "table") {
     flushNonTableContent();
     elements.push(<MarkdownTable key={...} token={token} highlight={highlight} />);
+  } else if (token.type === "code" && token.lang?.startsWith("glyph:")) {
+    flushNonTableContent();
+    const variant = token.lang.split(":")[1];
+    elements.push(<GlyphBlock key={elements.length} variant={variant} text={token.text} />);
   } else {
     nonTableContent += formatToken(token, ...);
   }
 }
```

That's it. Three lines. Now ` ```glyph:tree ` fenced blocks render via `<GlyphBlock>`.

## `<GlyphBlock>` component sketch

Modeled after `MarkdownTable.tsx`:

```tsx
import React from 'react';
import { Box, Ansi, useTheme } from '../ink.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { stringWidth } from '../ink/stringWidth.js';
import { wrapAnsi } from '../ink/wrapAnsi.js';

type Props = {
  variant: 'tree' | 'flow' | 'chart' | 'spark' | 'matrix' | 'seq';
  text: string;
};

export function GlyphBlock({ variant, text }: Props) {
  const [theme] = useTheme();
  const { columns: termWidth } = useTerminalSize();

  switch (variant) {
    case 'tree':   return <GlyphTree   text={text} width={termWidth} theme={theme} />;
    case 'flow':   return <GlyphFlow   text={text} width={termWidth} theme={theme} />;
    case 'chart':  return <GlyphChart  text={text} width={termWidth} theme={theme} />;
    case 'spark':  return <GlyphSpark  text={text} width={termWidth} theme={theme} />;
    case 'matrix': return <GlyphMatrix text={text} width={termWidth} theme={theme} />;
    case 'seq':    return <GlyphSeq    text={text} width={termWidth} theme={theme} />;
    default:       return <Ansi>{text}</Ansi>;
  }
}
```

## Variants

| Variant | Fenced syntax | Output | Parser |
|---------|---------------|--------|--------|
| `tree` | indented bullets | ASCII decision tree with `├── └──` | YAML-like indent parser |
| `flow` | `A -> B\nB -> C` | boxes + arrows in flexbox layout | edge-list parser |
| `chart` | `label  42\nlabel  88` | horizontal bar chart with `█` | tab-separated parser |
| `spark` | `1,2,4,8,16,8,4` | sparkline `▁▂▃▅█▅▃` | CSV parser |
| `matrix` | axis labels + 4 cells | 2x2 tradeoff grid | YAML parser |
| `seq` | `actor: msg` | sequence diagram (text) | line-by-line parser |

## Sample input/output

### `glyph:tree`

````
```glyph:tree
- token expired?
  - yes
    - reject
  - no
    - signature valid?
      - yes
        - accept
      - no
        - reject
```
````

Renders:

```
            token expired?
                │
        ┌───────┴───────┐
       yes              no
        │               │
     reject       signature valid?
                        │
                ┌───────┴───────┐
               yes              no
                │               │
             accept          reject
```

### `glyph:flow`

````
```glyph:flow
User -> AuthService
AuthService -> TokenStore
TokenStore -> AuthService
AuthService -> User
```
````

Renders:

```
┌──────┐  ┌──────────────┐  ┌────────────┐
│ User │─▶│ AuthService  │─▶│ TokenStore │
└──────┘  └──────────────┘  └────────────┘
   ▲              ▲                │
   │              └────────────────┘
   └─────────────────────┘
```

### `glyph:chart`

````
```glyph:chart
React 18    44
React 19    50
Vue 3       34
Svelte 5    16
```
````

Renders:

```
React 18    ███████████████████████████████████████████  44 KB
React 19    █████████████████████████████████████████████████  50 KB
Vue 3       █████████████████████████████████  34 KB
Svelte 5    ███████████████  16 KB
```

## Build sequence

```
1. clone https://github.com/JamaJKIM/claude-code (leaked source)
2. set up Ink + React build pipeline locally
3. add GlyphBlock.tsx + GlyphTree.tsx
4. patch Markdown.tsx dispatch (3 lines)
5. write fixture-based tests (snapshot ASCII output)
6. ship as separate fork "glyph-code" — CC + native glyph blocks
```

## Risks

| Risk | Mitigation |
|------|------------|
| Leaked source license unclear | Don't redistribute Anthropic code. Ship as a patch/diff, not a fork binary |
| Anthropic ships their own version | Position glyph as upstream-friendly — small diff, easy to maintain rebase |
| Parser ambiguity | Strict syntax for each variant. Fail loudly on parse errors |
| Terminal width constraints | All variants must respect `useTerminalSize()` and wrap |
| Color theming | Use `useTheme()` not hardcoded colors |

## Decision

Track 1 (skill) ships first. Validates demand on stock CC. Track 2 unlocks visually next-level output but requires fork — only viable if Track 1 has user pull.

Ship Track 1. Measure. Decide on Track 2 with data.
