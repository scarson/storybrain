# Finding 05 — Scorer is input-driven (not a tautology), and a real bug found+fixed

Addresses R3-03 preemptively ("did the world just get seeded to make raid-iron
win?") and the mega-hub/fixation risk (finding 04, R2-08). Code:
`storybrain/prototype/robustness.ts`. Same LIVE graph; only in-memory engine
inputs (pacing budget, which arc is open, per-node tension) perturbed.

## The bug: unbounded Σ over backlinks is VOLUME-dominated, not charge-dominated

The brain still held 60 low-tension "grunt" colonists rivaling `iron-empire` (from
the finding-04 hub test). With `callback_strength = Σ over ALL backlinks`, those 60
edges (tension 0.1 × recency 1.0 = 6.0 raw) **swamped** the few high-charge edges.
Result: raid-iron won EVERY scenario — even when the open arc was switched to
ash-clan, removed entirely, and tensions flipped to favor ash:

```
Σ ALL (broken):   A→raid-iron  B→raid-iron  C→raid-iron  D→raid-iron
```

This is the exact mega-hub failure flagged in finding 04: a node with many weak
edges beats a node with few strong ones. A naive `Σ` makes the Director fixate on
whoever has the most connections, regardless of drama.

## The fix: top-K cited edges

Narration cites a few NAMED stakes, not every edge ("the raiders led by the man
Vera executed, who seek the Ashmark" — 2–3 beats, not 60 grunts). So
`callback_strength` sums only the **top-K (=3) highest tension·recency edges**.
Re-run, same graph:

```
TOP-3 (fixed):    A→raid-iron  B→raid-ash  C→raid-iron  D→raid-ash
```

- **A** (arc=iron, normal tension): raid-iron — arc-aligned, high-charge. ✓
- **B** (arc switched to ash-clan): **raid-ash** — scorer FOLLOWS the open arc. ✓
- **C** (no arc): raid-iron — its top-3 edges (ashmark .7, lore .7, vera .5) are
  genuinely higher charge than ash's (crown .5, bjorn .4). ✓
- **D** (tensions flipped, ash high): **raid-ash** — scorer FOLLOWS tension. ✓

The winner changes sensibly with arc and tension. **The scorer is input-driven,
not a tautology of a flattering seed.**

## Consequences for DESIGN (→ v5)

1. **`callback_strength` MUST be top-K, not Σ-all.** Update §6 formula:
   `callback_strength = Σ over the top-K highest tension·recency revealed edges
   into F (× arc multiplier)`. This is also the fix for fixation/mega-hubs (R2-08,
   finding 04) — bounded influence per candidate.
2. **Don't link anonymous masses to one node** (60 grunts → one faction). Either
   don't model them as individual edges, or they're correctly ignored by top-K.
3. The blind-rater success metric (§6) is still unrun — top-K makes it plausible
   but does not prove "feels authored." That remains the open playtest gate.

## Verdict

The discovery is the value: a credible-looking scorer had a volume-domination bug
that only an adversarial perturbation test surfaced. Fixed with top-K, the
Director provably tracks its inputs. This is the difference between "the demo
worked once" (finding 03) and "the mechanism is sound" (this finding).
</content>
