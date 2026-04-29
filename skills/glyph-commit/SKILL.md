---
name: glyph-commit
description: >
  Terse, visually-structured commit message generator. Conventional Commits format.
  Subject ≤50 chars. Body uses bullets/tables only when scope spans multiple files.
  Drops the "what" (visible in diff), keeps the "why".
  Use when user says "write a commit", "commit message", "/commit", "/glyph-commit",
  or invokes /glyph-commit. Auto-triggers when staging changes.
---

## Format

```
<type>(<scope>): <subject>           ← ≤50 chars, imperative, no period

<body>                                ← optional. only when "why" non-obvious
                                       use bullets/tables for multi-file scope
```

## Types

| Type | When |
|------|------|
| feat | new user-visible capability |
| fix | bug fix |
| refactor | restructure without behavior change |
| perf | performance improvement |
| docs | docs only |
| test | tests only |
| chore | deps/config/build |
| style | formatting only |

## Rules

- Subject: imperative ("add" not "added"), lowercase, no period, ≤50 chars
- Drop articles in subject ("add retry mechanism" not "add a retry mechanism")
- Body only when reason is non-obvious from diff
- Wrap body at 72 chars
- For multi-file refactors, use a table:

```
refactor(auth): extract token validation into service

| File | Change |
|------|--------|
| middleware/auth.ts | calls TokenService.validate |
| services/token.ts (new) | owns validation logic |
| tests/auth.test.ts | updated to mock TokenService |
```

## Examples

**Good:**
```
feat(stride): add retry on gemini stream timeout
fix(pdf): correct scroll container offset on mount
refactor(assignments): extract submission logic to service
chore(deps): bump firebase-admin to v12.0.0
```

**Bad:**
```
fixed stuff                        ← vague
WIP                                ← non-descriptive
update assignments page            ← what changed?
Added a new retry mechanism        ← past tense, article
```

## When body is needed

Add body when:
- Fix references a specific bug/incident worth recording
- Refactor has non-obvious motivation
- Breaking change exists (use `BREAKING CHANGE:` footer)
- Performance fix has measurable impact (include numbers)

Skip body when:
- Subject already tells the whole story
- Diff makes the "what" obvious

## Output structure

```
<type>(<scope>): <subject>
[blank line]
[optional body — bullets or table if multi-file]
[blank line]
[optional footer: Closes #123, BREAKING CHANGE:, Co-Authored-By:]
```
