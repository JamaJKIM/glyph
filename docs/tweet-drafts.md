# Tweet drafts for glyph launch

Three angles. Pick the one that sounds most like you.

---

## Option A — the data hook (recommended)

**Tweet 1:**
```
what if Claude wrote less but you understood more?

i benchmarked it.

normal claude:  872 tokens, 7.2/10 readability
caveman terse:  458 tokens, 8.4/10
glyph (mine):   495 tokens, 9.0/10 ⭐

shipped: github.com/JamaJKIM/glyph
```

**Tweet 2 (reply):**
```
glyph = caveman's lexical compression + auto-selected visuals.

content shape → format:
- comparing options       → table
- branching logic         → ASCII decision tree
- numeric series          → sparkline
- single fact             → plain sentence

it picks the shape so you don't have to.
```

**Tweet 3 (reply):**
```
why this works:

prose paragraphs hide the answer in flow.
visuals show the answer in space.

trade: 8% more tokens than caveman.
gain: +0.6 readability, +1.7 format-fit (claude-as-judge).

worth it for the daily "compare X vs Y" flow.
```

**Tweet 4 (reply, install + cta):**
```
install:
claude plugin marketplace add JamaJKIM/glyph
claude plugin install glyph@glyph
/glyph

built on @JuliusBrussee's caveman. credits in LICENSE.

repo, benchmarks, design docs all open: github.com/JamaJKIM/glyph
```

---

## Option B — the comparison hook (visual-first)

**Tweet 1 (paste this as image or code block):**
```
how three modes answer "compare 3 caching strategies":

normal claude:  prose dump. 1216 tokens. read it line by line.

caveman:        terse bullets. 571 tokens. scan in 5 sec.

glyph:          | strategy | latency | cost | invalidation |
                |----------|---------|------|--------------|
                | LRU      | 0.1ms   | $    | manual       |
                | Redis    | 1ms     | $$   | TTL+evict    |
                | CDN      | 50ms    | $$$  | tag-based    |
                
                538 tokens. decide in 2 sec.

glyph: github.com/JamaJKIM/glyph
```

---

## Option C — the philosophy hook

**Tweet 1:**
```
LLMs default to prose because training data is prose.

but most dev questions aren't narrative. they're:
- comparing options
- branching logic
- file structure
- counts and trends

each has a natural visual shape that prose obscures.

glyph picks the shape: github.com/JamaJKIM/glyph
```

**Tweet 2 (reply):**
```
benchmark: 8 dev prompts, 3 modes (normal / caveman / glyph), claude-as-judge.

readability:  glyph 9.0  > caveman 8.4 > normal 7.2
format-fit:   glyph 9.5  > caveman 7.8 > normal 7.5
tokens:       caveman 458 < glyph 495 < normal 872

glyph trades 8% more tokens than caveman for major scan-speed gains.
```

---

## Posting tips

```
1. post Option A in 4-tweet thread (most engagement)
2. take a screenshot of the README's "Measured results" table — attach to tweet 1
3. tag @JuliusBrussee in tweet 4 (caveman credit)
4. don't tag anthropic — they're sensitive to leaked-source references
5. best time: tue-thu morning PT
6. if it gains traction, post a follow-up with a concrete demo gif
```

## Hashtags (use sparingly)

```
primary:    #ClaudeCode
secondary:  #DeveloperTools #AIcoding
skip:       #LLM #AI (too broad, dilutes signal)
```

## What NOT to claim

```
✗ "75% token savings"           → benchmark says 43% vs normal, 8% MORE vs caveman
✗ "best Claude Code plugin"     → you don't know that
✗ "replaces caveman"             → glyph is built on caveman, credit it
✗ "cuts costs by N%"             → output tokens are tiny portion of API cost; misleading
```
