# Finding 07 — Multi-tick sim: normalization, guards, and emergence (answers round 3)

Code: `storybrain/ship/sim.ts` (self-contained `bun:sqlite`, fully reproducible).
Run: `bun storybrain/ship/sim.ts`. Resolves adversarial round-3 R3-02/03/04/05.

## R3-03 normalization & R3-04 formula — FIXED

Every resonance term is now ∈ [0,1]; resonance has a stable, tunable scale
(weights sum 0.90 positive, ≤0.50 penalty → resonance ∈ [−0.5, 0.9]). Observed
range across the run: ~0.17–0.65. `valence_fit` is implemented (R3-04); `arc` is a
single additive term (no double-count multiplier, R3-04); `character_stakes` is
capped+normalized (no longer raw inbound count, R3-03). `callback_strength` is the
top-K mean (finding 05).

## R3-02 idempotency/fixation — guards engage, treadmill avoided

Running 5 ticks, writing each fired event back into the same store:

```
Colony A: raid → disaster → raid → raid → social   (3/4 kinds, repetition/fixation
          penalties climb 0.00→0.50→0.67 on repeated raids; relief beat fired)
```

The repetition+fixation penalties demonstrably rise as a kind/faction repeats
(rep/fix 0.00 → 0.50 → 0.67), and the Director diverges to a disaster (tick 2) and
a relief `social` (tick 5) — NOT the "iron-raided every tick" degeneration R3-02
predicted. *Honest caveat:* it is still raid-leaning (3/5) because the open-arc
pull is strong at these weights; the balance between arc-advance and
anti-repetition is exactly the **weight-tuning game-design work** (§6), not a
solved constant. The mechanism works; the tuning is the designer's.

## R3-05 emergence — demonstrated

The SAME authored artifact MYTH (Ashmark, Weeping Crown, the forged-to-kill-a-king
lore) is run under TWO different EMERGENT colony chronicles:

```
Colony A (Vera survived, grudge vs Empire): day 430 → FIRE raid-iron
Colony B (Vera died, Bjorn's Ash-Clan feud): day 430 → FIRE raid-ash
```

Identical canon, different stories — because the Director weaves the fixed myth
into the *gameplay-produced* graph (who lived, who holds a grudge, who owns what).
**This is precisely how Rimworld's own praised emergence works**: a fixed pool of
authored event templates combined with emergent colony state. StoryBrain's
"fact-skeleton + reveal" is not a retreat from emergence — it IS the genre's
emergence model, applied to lore. (Procgen of the fact-skeletons themselves — DF
legends — is a further, larger, optional layer; see DESIGN v5 § on emergence for
the honest cost.)

*Caveat:* the two demo colonies are structurally symmetric, so their sequence
SHAPES rhyme (raid→disaster→raid→raid→social) while the factions/stakes differ.
Real gameplay variance (different deaths, romances, betrayals, hunt outcomes)
would diverge the shapes too; the demo isolates the one variable (which colony
chronicle) to make the weave legible.

## Net

The Director's full dynamics — normalized scoring, anti-degeneration guards, and
emergent per-colony divergence — now run reproducibly in the ship store. Round 3's
two FATALs (non-reproducible recipe; non-idempotent) are addressed: the gbrain
recipe was made self-contained (seed.sh, re-verified 3.197 from a clean brain),
and the multi-tick dynamics are demonstrated here without degeneration. What
remains genuinely open is weight TUNING (game design) and the lore-generation
CONTENT pipeline (§5) — both the friend's work, neither a store problem.
</content>
