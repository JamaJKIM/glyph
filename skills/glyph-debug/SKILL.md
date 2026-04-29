---
name: glyph-debug
description: >
  Parse stack traces and error walls into one-line summary + 3-line context.
  Replaces "scroll-to-find-the-real-error" with "this is the bug, this is where, this is why".
  Use when user pastes an error/stack trace, says "this broke", "what does this error mean",
  "/glyph-debug", or invokes /glyph-debug. Also auto-triggers when output contains a
  multi-line traceback.
---

## Format

```
✖ <one-line bug summary>
   ├─ where:  <file>:<line> in <function>
   ├─ why:    <root cause in caveman>
   └─ fix:    <smallest change> (or "needs investigation: <what to check>")
```

## Rules

- Parse the trace. Extract: error type, error message verbatim, deepest user-code frame.
- Skip framework noise (node_modules, site-packages, dist/, build/).
- Quote error message exactly. No paraphrasing.
- "fix:" only when fix is obvious from the error. Otherwise "needs investigation:".
- One line each — no multi-paragraph explanation.

## Examples

### Python

**Input (wall):**
```
Traceback (most recent call last):
  File "/Users/x/proj/.venv/lib/python3.11/site-packages/fastapi/routing.py", line 273, in run_endpoint_function
    return await dependant.call(**values)
  File "/Users/x/proj/app/api/v1/routes/tasks.py", line 88, in create_task
    return await service.create(data, user.uid)
  File "/Users/x/proj/app/services/task_service.py", line 42, in create
    return Task(**enriched.dict())
TypeError: __init__() missing 1 required positional argument: 'user_id'
```

**Output:**
```
✖ Task() missing required arg 'user_id'
   ├─ where:  app/services/task_service.py:42 in create()
   ├─ why:    enriched dict has no user_id key. Probably stripped during enrichment.
   └─ fix:    pass user.uid into enriched, or set user_id=user.uid in Task() ctor.
```

### TypeScript / Node

**Input:**
```
TypeError: Cannot read properties of undefined (reading 'name')
    at AssignmentList (/Users/x/web/src/features/assignments/AssignmentList.tsx:42:18)
    at renderWithHooks (/Users/x/web/node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    ...
```

**Output:**
```
✖ "Cannot read properties of undefined (reading 'name')"
   ├─ where:  src/features/assignments/AssignmentList.tsx:42
   ├─ why:    accessed .name on undefined. Likely user/data not loaded yet.
   └─ fix:    add guard: `user?.name` or early return on `if (!user)`.
```

### Build error

**Input:**
```
ERROR in ./src/components/Button.tsx
TS2322: Type 'string' is not assignable to type 'number'.
  29 |   <Button size="42" />
     |           ^^^^
```

**Output:**
```
✖ TS2322: size="42" is string, expected number
   ├─ where:  src/components/Button.tsx:29
   ├─ why:    JSX string literal vs typed numeric prop.
   └─ fix:    `size={42}` (curly braces, not quotes).
```

## When the trace is truly opaque

If you cannot identify root cause from trace alone:

```
✖ <error message verbatim>
   ├─ where:  <deepest user frame>
   ├─ why:    needs investigation
   └─ check:  <2-3 things to inspect, in caveman bullets>
```

Example:

```
✖ "ECONNREFUSED 127.0.0.1:5432"
   ├─ where:  app/db/pool.ts:12
   ├─ why:    needs investigation
   └─ check:  postgres running? port 5432? pg_hba.conf allows local?
```

## Multi-error output

When trace has >1 distinct error (rare — usually cascading), list all:

```
✖ main:    <primary error>
⚠ cascade: <secondary triggered by main>
```

## Make file refs clickable

When citing a file:line in `where:`, wrap it as a markdown link with a `file:///` URL so terminals supporting OSC 8 hyperlinks make it click-to-open:

```
✖ "Cannot read properties of undefined (reading 'name')"
   ├─ where:  [src/features/assignments/AssignmentList.tsx:42](file:///abs/path/AssignmentList.tsx:42)
   ├─ why:    accessed .name on undefined.
   └─ fix:    add guard: `user?.name`.
```

## Auto-clarity exception

If user explicitly asks for "explain in detail" — drop the format, write full prose. Resume on next error.

## Boundaries

- Don't invent details not in the trace.
- Don't suggest a fix you can't justify from the error message.
- Don't add commentary like "this is a common React issue" — wastes tokens.
