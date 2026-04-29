---
name: glyph-review
description: >
  One-line PR review comments with severity icons. No throat-clearing, no hedging.
  Format: `L<line>: <icon> <category>: <issue>. <fix>.`
  Use when user says "review this PR", "code review", "review the diff",
  "/glyph-review", or invokes /glyph-review. Auto-triggers when reviewing pull requests.
---

## Format

```
L<line>: <icon> <category>: <issue>. <fix>.
```

## Severity icons

| Icon | Severity | Use when |
|------|----------|----------|
| 🔴 | bug | code is wrong, will break |
| 🟡 | smell | code works but is fragile/unclear |
| 🟢 | nit | style/preference, can ignore |
| 🔒 | security | auth/PII/injection risk |
| ⚡ | perf | measurable performance concern |
| ❓ | question | clarification needed before approve |

## Categories (pick one)

```
bug | logic | null | type | race | security | perf | style | naming | dup | test | docs
```

## Examples

```
L42: 🔴 bug: user null after `findOne`. Add guard or use findOneOrFail.
L88: 🔒 security: SQL string interpolation. Use parameterized query.
L13: 🟡 smell: 7-arg function. Extract config object.
L101: ⚡ perf: O(n²) loop on hot path. Pre-build map for O(n).
L55: 🟢 nit: `data` → `users` for clarity.
L77: ❓ question: why catch+log+return null? Should this throw?
```

## Rules

- Each comment = ONE line
- Drop articles ("user null" not "the user is null")
- Drop pleasantries ("consider", "maybe we could", "I think")
- Quote error messages verbatim
- For multi-line issues: cite range as `L42-L51`
- Don't suggest a fix if the fix is obvious from the issue

## Summary block (top of review)

After per-line comments, add summary table:

```
| Severity | Count |
|----------|-------|
| 🔴 bug   | 2     |
| 🔒 sec   | 1     |
| 🟡 smell | 3     |
| 🟢 nit   | 5     |

Verdict: Request changes (2 bugs, 1 security).
```

Verdicts: `Approve`, `Approve with nits`, `Request changes`, `Block`.

## What NOT to write

- "Great work overall, just a few things..."  ← no preamble
- "I noticed that..."                          ← no narration
- "It might be a good idea to consider..."    ← no hedging
- "What do you think about..."                 ← only as ❓ category
- Multi-paragraph explanations                 ← link to docs instead

## Code suggestions

When fix needs a code block, use GitHub suggestion syntax:

````
L42: 🔴 bug: missing await. Function returns Promise<void>.
```suggestion
await db.users.update(user)
```
````
