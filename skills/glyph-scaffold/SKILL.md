---
name: glyph-scaffold
description: >
  Idea-to-spec generator. Takes a feature description and emits an ASCII spec card:
  directory tree (files to create/modify), data flow diagram, sequence diagram,
  gotchas, build sequence. Use as a planning tool before writing code.
  Use when user says "design this", "scaffold a spec for", "plan this feature",
  "/glyph-scaffold", or invokes /glyph-scaffold.
---

## Output template

```
# <feature name>

## What
<1 sentence — caveman>

## Files
<directory tree of new + modified files>

## Data flow
<ASCII boxes + arrows showing input → processing → output>

## Sequence (if interactive)
<actor: action format>

## Schema changes
<table or "none">

## Gotchas
<bullets — caveman, only non-obvious risks>

## Build sequence
<numbered list, one verb each>
```

## Rules

- Each section uses the visual primitive that fits its content shape
- Skip sections that don't apply ("Sequence" only if interactive flow exists)
- Be concrete — name actual files, actual functions, actual table columns
- Don't write code. This is design, not implementation.
- Keep total output under 80 lines

## Example — feature: "demo-mode preview gate for write actions"

```
# Demo-mode write preview

## What
Demo users see "would have done X" preview instead of real Google API call.

## Files
glyph-scaffold/
├── apps/api/app/services/
│   ├── effective_user.py            ← MOD: add is_demo_write_gated()
│   ├── google_writes.py (new)       ← NEW: gate wrapper for terminal writes
│   └── preview.py (new)             ← NEW: PreviewResult schema
├── apps/api/app/api/v1/routes/
│   ├── tasks.py                     ← MOD: gate /tasks/{id}/calendar-event
│   └── google.py                    ← MOD: gate /google/gmail/send
├── apps/api/app/agent/tools/
│   └── google_tools.py              ← MOD: gate create_event, send_email
└── apps/web/components/capture/
    └── PreviewCard.tsx (new)        ← NEW: render preview:true responses

## Data flow
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│ user     │────▶│ route/tool   │────▶│ gate check    │
│ action   │     │              │     │ is_demo?      │
└──────────┘     └──────────────┘     └───────┬──────┘
                                              │
                          ┌───────────────────┴────────────────┐
                          ▼                                    ▼
                    real Google call                   PreviewResult
                          │                                    │
                          ▼                                    ▼
                    ┌──────────┐                        ┌──────────────┐
                    │ success  │                        │ {preview:    │
                    │ response │                        │  true,        │
                    └──────────┘                        │  would_have} │
                                                        └──────────────┘

## Sequence (agent chat)
agent: tool_create_event(...)
gate:  detect demo → return PreviewResult instead
agent: receive {preview:true, would_have:{...}}
agent: narrate "I would have created [details]. Demo mode — not actually scheduled."
ui:    render PreviewCard (orange border, "demo only" badge)

## Schema changes
none (reuses existing tasks/email_drafts tables)

## Gotchas
- Drafts still persist to email_drafts. Only final send is gated.
- Approval-with-countdown UX stays. Just terminal call gets swapped.
- Tool layer must be gated, not just route — agent can call tools directly.
- PreviewResult must be JSON-serializable (no datetime, no UUID without str()).

## Build sequence
1. Define PreviewResult + WriteAction schemas in preview.py
2. Add is_demo_write_gated() to effective_user.py
3. Wrap each terminal write tool with gate
4. Wrap each terminal write route with gate
5. Update agent system prompt for preview narration
6. Build PreviewCard.tsx + wire to existing detail views
7. Test demo + real-user paths in dev
```

## When the feature is too vague

Return clarifying questions FIRST before scaffolding:

```
Need before I can scaffold:
1. What's the input? (user clicks button? cron? webhook?)
2. What's the success state? (DB row written? email sent? UI updated?)
3. Who can do this? (any user? admin only? specific role?)
4. Synchronous or async?
```

Don't scaffold guesses.

## Boundaries

- This is a planning tool. Don't write code.
- Output goes to `/docs/plans/<feature>.md` if user requests, otherwise inline.
- Defer to existing repo CLAUDE.md conventions for file paths.
- For Someta/SometaAdmin: plans go in `/docs/plans/` per CLAUDE.md rule.
