# StoryBrain — the 10-theme sample set

The curated seed corpus for the multi-seed, cross-model world-gen eval. Built per
Sam's request: theme #0 (already validated, findings 08/09) + 5 (batch 1) + 4
(batch 2), each new set hardened by **3 rounds of adversarial Opus review**
(`reviews/batch{1,2}-round{1,2,3}.md`). Machine-readable sets in `batch1.json` /
`batch2.json`.

Requirements honored on every set: sci-fi · artifacts (hunt-able, lore-dropping) ·
alien civilizations (NOT necessarily fallen). Resource tie-ins where they fit, not
forced. **Psychic kept optional** (only 4 of 10 carry it) per Sam.

## The breadth matrix (the whole point — no two alike on the axes that matter)

| # | Set | Alien status | Psychic | Resource | Tone | Mystery ORDER-meaning |
|---|---|---|---|---|---|---|
| 0 | fallen-civ resource-fall *(original)* | fallen | overt | core | cosmic-horror autopsy | linear `caused_by` fall |
| 1 | first-contact-diplomacy | living | none | moderate | wary diplomacy | earn-trust / read-intent |
| 2 | bio-symbiosis-horror | living | overt | moderate | intimate body-horror | bond-and-assemble |
| 3 | machine-successor | active | none | high | cold industrial | reconstruct divergent INTENT |
| 4 | time-war | ambiguous | subtle (precog) | none | vertiginous causality | non-linear re-sequence |
| 5 | generation-ship-identity | absent | subtle (ancestral) | low | introspective guilt | it-was-us reveal |
| 6 | megastructure-absent-architects | absent | none | high | awe / dread | retrospective PURPOSE |
| 7 | extinction-plague-vector | dormant | none | low | outbreak thriller | forward CONTAINMENT recipe |
| 8 | crowded-trade-federation | living | none | moderate | mercantile noir | true PROVENANCE |
| 9 | uplift-nursery-world | hidden | subtle (aimed-ness) | core | moral / ecological | prospective PURPOSE |

**Axis spread:** statuses {fallen, living×3, active, ambiguous, absent×2, dormant,
hidden}; psychic on 4/10 (none dominates); resource none→core across the range;
ten distinct tones; and — the decisive axis the reviews surfaced — **distinct
mystery-ORDER meanings**, not ten variations on #0's death-chain.

## The one thing that blocks USING this set (loud, converged finding)

The reviews independently converged on R3-D: the generation **contract assumes a
single mystery shape** — `prompt-canon.md` hard-codes a `caused_by` death chain
(roles `cause|escalation|point-of-no-return|collapse`) and `reconstructFall()` is
named for it. **Correction to the reviewers' stronger claim:** the *validator*
(`validateWorld`) is already theme-AGNOSTIC — it only checks slugs, edges→nodes,
≥3 artifact drops, and that `mystery.order` is a permutation of `fragments`. So
these seeds will VALIDATE today; the coercion risk is at *generation* time (the
canon prompt would push every seed back toward a fall).

**To make the sample set generatable** (the next eng task, fully specced by the
reviews): generalize the canon prompt to carry a per-seed `order_relation`
(`caused_by | enables | prerequisite | precedes | reveals`) + relax the role
vocabulary; rename `reconstructFall` → `reconstructMystery` and drop its
fall assumption. No schema change needed. The seeds ARE the spec for that work.

## How this set is meant to be used

Feed each set's tags/hook/spine to the (generalized) generator → produce 10
structurally diverse worlds → run the finding-09 blind cross-model judge across
them to harden "hybrid LLM→procgen→LLM beats pure-LLM" beyond n=2, and to check
the Stage-D live-stakes layer (finding 10) lifts dramatic potential across themes.
</content>
