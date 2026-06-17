# Finding 17 — Stage E (characters + frame-correct skills) wins 10/10, blind

The confirmation for the character work: does the Stage-E cast layer raise *judged*
quality? Blind clean-Opus judge, hybrid-v3 (Stage E: skills + social graph + alien
characters + polish, with frame-correct ship-crew/colonist skill profiles) vs
hybrid-v2 (pre-character-work), all 10 themes, leak-free, A/B randomized.

## Result: hybrid-v3 wins ALL 10

| Theme | v3 | v2 | margin |
|---|---|---|---|
| the-living-marrow | 44 | 37 | +7 |
| first-contact-diplomacy | 43 | 36 | +7 |
| bio-symbiosis-horror | 44 | 37 | +7 |
| machine-successor | 45 | 32 | +13 |
| time-war | 45 | 33 | +12 |
| generation-ship-identity | 43 | 36 | +7 |
| megastructure-absent-architects | 43 | 37 | +6 |
| extinction-plague-vector | 44 | 32 | +12 |
| crowded-trade-federation | 44 | 33 | +11 |
| uplift-nursery-world | 43 | 37 | +6 |

**10/10 for v3. Aggregate 438 vs 350 (+88; avg +8.8/theme).** Winning side flipped
between A/B per the randomized blinding (no fixed slot), and v3 still won every time.

## Why (both judges, blind, independently)

Each pair shares a near-identical mystery/faction/artifact backbone — so the verdict
"turned almost entirely on the CAST layer." The winning (v3) variant every time:
- gives colonists **quantified `skills` + passions + `crew_role`/`colony_role` + a
  pointed `want`**,
- adds **alien/ancestor/trace colonists** that turn absent/dormant/hidden/indifferent
  factions into playable characters,
- wires a **dense, arc-relevant social web** (lover/kin/owes/grudge/ally/rival).

The thin (v2) variant "strips skills to bare arrays or drops them, deletes those
colonists and flavor-lore, thins the social web" and carried **more graph defects**
(trade-v2's `colonist owns her own faction`, reversed `sought_by`; plague-v2's
out-of-order `drops`). The single strongest cast node cited: uplift's
`the-ripening-child` — a gene-loom-bent native daughter reading as a finished
Gardeners' cultivar.

## What this settles

The "make the best versions better" question is answered: **the character pass is a
large, unanimous, measured quality gain** (not just better lint metrics — better
*judged* worlds, +8.8/theme). Combined with finding 14 (abstract-procgen hybrid-v2
already beat pure 6–4), the current recommended generator is:

**Stage A (Opus seed) → `procgen-abstract` (deterministic neutral causal topology)
→ Stage C+D (clothe + prune + live present layer) → Stage E (characters & polish:
frame-correct skills, dense social graph, named alien cast) → SQLite edges store.**

Skills are frame-matched (Sam's note): **ship-crew axes** (piloting/navigation/
engineering/sensors/gunnery/life_support/eva/xeno/command) for the spacefaring,
expedition, salvage, merchant, and generation-ship worlds; **colonist/settler axes**
(medicine/research/social/construction/growing/crafting/combat) for the four
planetside colonies. `facts.skill_profile` makes it explicit per colonist.

## Honest caveats

- Single judge model (Opus) again — Codex/cross-model still pending; but the result
  is unanimous (10/10) with wide margins and a leak-free blind, so it's robust to
  the usual single-judge worry far more than a narrow split would be.
- The comparison is v3-vs-v2 (does the cast layer help — yes). v3-vs-pure (new
  state of the art vs the simple baseline) isn't re-run here; pure also lacks the
  cast layer, so v3 would very likely extend its finding-14 lead — worth a
  confirming pass when convenient.
- v2 carried a few graph defects v3 fixed (polish), so part of the margin is
  cleanliness, not only cast — both are real Stage-E contributions.

## Net arc (the whole generator thread)

f09 hybrid wins (1 theme, contested) → f12 pure 9–1 (fall-procgen leaks) → f13/f14
abstract procgen → hybrid 6–4 → **f17 + Stage E characters → hybrid-v3 10–0 over its
pre-character self.** The generator is now: abstract procgen for consistent causal
scale, LLM clothing for meaning, Stage D for live present stakes, Stage E for a
real cast with frame-correct skills and a social graph the Director can weave.
</content>
