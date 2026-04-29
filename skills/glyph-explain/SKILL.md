---
name: glyph-explain
description: >
  Explain a concept, library, codebase pattern, or topic using glyph's visual
  format. Forces a visual-first explanation regardless of current glyph mode.
  Picks the best diagram shape for the topic (analogy table, flow, hierarchy,
  decision tree). Use when user says "explain X", "what is Y", "/glyph-explain",
  "show me how Z works", or invokes /glyph-explain.
---

## What this skill does

Takes a topic and produces a one-screen explanation using glyph's visual primitives. Output is always:

```
## <topic>

<one-line caveman summary — what it IS in one sentence>

<the right visual — picked from content shape>

<3-line "why this matters" or "what's tricky">

<optional: clickable refs to docs / source — markdown links>
```

Forces glyph mode for the duration of the answer even if base glyph is `off`.

## Picking the visual

Same shape rules as base glyph, applied to explanations:

| Topic kind | Visual |
|------------|--------|
| Compare alternatives ("X vs Y") | comparison table |
| Process / pipeline ("how login works") | boxes + arrows flow |
| Hierarchy ("anatomy of React render") | indented tree |
| Decision logic ("when to use useMemo") | decision tree |
| Lifecycle / state machine | state diagram (boxes + arrows with labeled transitions) |
| API surface ("what does Stripe expose") | tree of methods grouped by domain |
| Config space / options matrix | 2x2 or NxM grid |
| Numeric tradeoffs ("perf of LRU vs LFU") | bar chart with measured values |
| Single-concept explanation | caveman prose paragraph (no diagram) — overkill kills clarity |

## Length budget

```
default:    one screen (≤25 lines visible)
deep dive:  two screens, only when user says "explain in depth"
crash:      3 lines max, when user says "tldr"
```

## Examples

### "explain useMemo"

```
## useMemo

memoize value across renders. recompute only when deps change.

| Without useMemo               | With useMemo                  |
|-------------------------------|-------------------------------|
| `const x = expensive()`       | `const x = useMemo(()=>expensive(), [a,b])` |
| runs every render             | runs only when a/b change     |
| triggers child re-render      | stable ref, child stays calm  |

When to use:
├── expensive computation in render path
├── inline obj/array passed as prop (stable ref needed)
└── deps for other hooks that depend on it

Trap: useMemo itself has overhead. Don't wrap cheap values.
```

### "explain Postgres MVCC"

```
## Postgres MVCC

multi-version concurrency. readers never block writers. each row has visibility window.

         t=1: INSERT     t=2: UPDATE         t=3: DELETE
            │                │                   │
            ▼                ▼                   ▼
       ┌────────┐       ┌────────┐         ┌──────────┐
       │ row v1 │──▶    │ row v2 │──▶      │ row v2   │
       │ xmin=1 │       │ xmin=2 │         │ xmin=2   │
       │ xmax=2 │       │ xmax=3 │         │ xmax=3   │
       └────────┘       └────────┘         └──────────┘

      txn A (started at t=2): sees v1 (still committed when A began)
      txn B (started at t=4): sees nothing (v2 deleted before B began)

Why it matters: VACUUM removes dead versions. Long-running txn = bloat.
```

### "explain Next.js app router"

```
## Next.js app router

file-system routing with server components by default. layouts compose.

app/
├── layout.tsx             ← root layout, wraps everything
├── page.tsx               ← /
├── about/
│   └── page.tsx           ← /about
├── blog/
│   ├── layout.tsx         ← wraps blog/*
│   ├── page.tsx           ← /blog
│   └── [slug]/page.tsx    ← /blog/anything (dynamic)
└── api/
    └── route.ts           ← /api (route handler, not page)

Default: server component (RSC, no JS shipped).
Add `'use client'` at top to opt into client component.
Server actions: `'use server'` async function callable from client form action.

See [docs](https://nextjs.org/docs/app)
```

## Rules

- One topic per call. If user asks 3 things, do them serially, not all at once.
- Always end with one short "trap" / "why it matters" / "gotcha" line — single sentence.
- Wrap external refs as markdown links (clickable in capable terminals).
- For library/API explanations, link to the canonical doc.
- For codebase patterns, link to the actual file with `file:///` URL.
- Never start with "Sure! Let me explain..." or any preamble. First line is the heading.

## Boundaries

- Don't explain things outside the user's domain. If user says "explain in 1 sentence", honor it.
- Don't pad. If topic fits in 5 lines, ship 5.
- Don't add a diagram when prose is clearer (e.g., explaining what a single function does).
- Don't reproduce a multi-page tutorial. Link to canonical docs.
