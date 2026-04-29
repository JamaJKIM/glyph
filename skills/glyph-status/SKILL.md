---
name: glyph-status
description: >
  Project state at-a-glance as a table. Shows: git branch, uncommitted files,
  unpushed commits, test status, build status, dep freshness. Replaces 5
  separate "what's the state" commands.
  Use when user says "status", "what's the state", "where am I", "/glyph-status",
  or invokes /glyph-status. Run on demand, not automatic.
---

## Format

```
| Aspect      | State                          |
|-------------|--------------------------------|
| Branch      | <branch> (<ahead>↑ <behind>↓)   |
| Uncommitted | <N> files modified, <M> staged  |
| Unpushed    | <N> commits ahead of origin     |
| Tests       | <pass / fail / not run>         |
| Build       | <ok / error: ...>               |
| Deps        | <fresh / N outdated>            |
| Last commit | <hash> <subject> (<time ago>)   |
```

Emit one line of glyph commentary if anything's off. Otherwise silent.

## Commands to run (in this order)

```bash
git status --short                    # uncommitted
git log @{u}..HEAD --oneline 2>/dev/null  # unpushed
git rev-list --left-right --count @{u}...HEAD 2>/dev/null  # ahead/behind
git log -1 --pretty='%h %s (%cr)'     # last commit
```

For tests/build/deps — auto-detect:

| Indicator | Tool to run |
|-----------|-------------|
| `package.json` with `test` script | `npm test --silent` (timeout 30s) |
| `pytest.ini` / `pyproject.toml` with pytest | `pytest --co -q` (collect-only, fast) |
| `tsconfig.json` | `npx tsc --noEmit` |
| `requirements.txt` | `pip list --outdated` |
| `package.json` | `npm outdated --json` |

If tool runs >30s — skip, report `not run (slow)`.

## Output rules

- Always table format. No prose.
- Empty cells: use `—` not "none" or "0"
- Time ago: relative ("5 min ago", "yesterday", "3 days ago")
- Flag bad state with `⚠` in cell, good with `✔` only when explicitly green
- Don't list every uncommitted file — just count + first 3 names
- **Wrap file paths in markdown links** so they're clickable in capable terminals: `[auth.ts:42](file:///abs/path/auth.ts:42)`. Use absolute paths via `file:///` URL.
- For commit hashes, link to GitHub when remote is github.com: `[3aa21f7](https://github.com/org/repo/commit/3aa21f7)`

## Example output

```
| Aspect      | State                                                            |
|-------------|------------------------------------------------------------------|
| Branch      | feature/improvements-4feel (3↑ 0↓)                               |
| Uncommitted | 2 modified ([page.tsx](file:///abs/path/capture/page.tsx), …)    |
| Unpushed    | 3 commits ahead of origin                                         |
| Tests       | not run                                                           |
| Build       | ✔ tsc clean                                                       |
| Deps        | 4 outdated (firebase-admin, next, …)                              |
| Last commit | [3aa21f7](https://github.com/org/repo/commit/3aa21f7) docs(...) (2 hr ago) |

⚠ push 3 commits or stash before switching branch.
```

File paths and commit hashes wrapped in markdown links → clickable in iTerm2 / kitty / alacritty / ghostty / Hyper / VS Code terminal.

## When NOT to run

- User just committed (no value, just ran git)
- User in middle of typing a question (not asking for status)
- More than 1 invocation per minute (cache previous)

## Boundaries

- Don't run destructive commands (no `git pull`, no `npm install`)
- Read-only inspection only
- Skip slow checks rather than block — speed matters
