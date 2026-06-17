# batch1.json — Round 1 adversarial review

Reviewer posture: hostile. Purpose of artifact: SEEDS for a sci-fi world-gen pipeline.
Game pillars: artifact-hunting (story driver), alien civilizations, resource
discovery/exploitation for the player. Every set must be sci-fi + artifacts + alien
civ. Resources good but not universal. Psychic optional, variety required. Must be
distinct from theme #0 (fallen-civ / resource-exploitation-gone-wrong / psychic /
piece-together-why-they-fell) and from each other.

## Cross-set distribution audit (as received)

| Set | alien_status | psychic | resource |
|---|---|---|---|
| first-contact-diplomacy | living | none | peripheral |
| bio-symbiosis-horror | living | subtle | core |
| machine-successor | dormant | none | peripheral |
| time-war | fallen | none | none |
| generation-ship-identity | ancestral | subtle | peripheral |

## Problems found

1. **Resource-centrality monoculture (BIGGEST diversity problem).** 3 of 5 = `peripheral`,
   1 core, 1 none. The middle band is a monoculture, and the game's stated resource
   pillar is barely exercised. Three "peripheral" sets give the world-gen the same
   resource posture three times. FIX: spread across the full range — none / low /
   moderate / high / core — and make the level mean something per set.

2. **time-war collides with #0's signature.** It is the ONLY `fallen` set (variety-OK)
   but its hook literally says "assembling the timeline means deciding which version of
   history actually happened" and distinct_from_siblings says "why they fell may not have
   happened yet" — leaning on #0's "piece-together-why-they-fell" framing. The time/
   causality twist IS distinct, but the prose anchored the set on the FALL. FIX:
   re-anchor distinctiveness on causality/anachronism; drop the "why they fell" echo;
   make the aliens' status ambiguous-in-time rather than plainly "fallen" so it stops
   reading as #0-with-a-clock. Retitled framing keeps fallen-ish but the mystery is
   sequence, not autopsy.

3. **first-contact-diplomacy undercuts the artifact-HUNT pillar.** Artifacts-as-gifts
   are handed to you; you don't hunt them. The hook is strong on distinctiveness (living
   reactive aliens, no tomb) but soft on the core game loop. FIX: add a hunt-able layer —
   the aliens withhold most of their tech; the gifts are a vetting trickle, and the real
   relics must be EARNED/found, so artifact-hunting becomes "prove worthy to unlock the
   next tier" rather than "loot a ruin." Keeps distinctiveness, restores the hunt.

4. **generation-ship is a single-twist seed (generativity risk).** "The aliens are us"
   is a great reveal but a world-gen that knows the twist may just retell it. Its
   memory-core artifacts also conceptually overlap machine-successor's code-relics and
   #0's piece-together. FIX: diversify the artifact substrate (sealed bio-vaults, edited
   star-charts, redacted monuments, not just data-cores) and make the generative engine
   "what was worth forgetting" — many different buried truths per world, not one.

5. **Psychic spread is acceptable but flat.** none/none/none/subtle/subtle — no set uses
   overt psychic. Variety rule is satisfied (not all psychic), but the axis is barely
   used. Minor: I let one set carry a more distinct psychic posture (woven, not bolt-on)
   so the axis genuinely varies rather than being a binary none/whisper.

6. **machine-successor & bio-symbiosis** are the two strongest as-is. Light touches only:
   sharpen machine artifact generativity (the cores should encode DIFFERENT fragments of
   intent so worlds diverge), confirm bio stays clear of #0's psychic-fall (it does — its
   horror is becoming, not extinction).

## What I changed

- **Rebalanced resource_centrality across the full range:** none (time/causality),
  low (generation-ship — resources are incidental to the introspection), moderate
  (first-contact — aliens gate access to high-value lent tech), high (machine-successor —
  the cores ARE the prize and the power economy), core (bio-symbiosis — unchanged, harvest
  living tissue). No two share a band now.
- **time-war:** re-anchored on non-linear causality; status changed to `ambiguous`
  (alive/dead is undecided BECAUSE of time-war) to stop reading as #0-fallen; removed
  "why they fell" phrasing; artifacts now drive a sequence-reconstruction loop where
  later finds retro-edit earlier ones.
- **first-contact-diplomacy:** added the earned-tier hunt loop; gifts are a vetting
  trickle, the real relics are withheld and must be found/unlocked; resource bumped to
  moderate (access-gated high-value tech).
- **generation-ship:** diversified artifact substrate beyond data-cores; generativity
  engine is "what each colony chose to bury" so worlds diverge; resource set to low.
- **machine-successor:** artifacts now encode divergent intent-fragments; resource bumped
  to high (cores are the power/resource economy AND the prize) to differentiate from the
  other ex-peripherals; one psychic touch deliberately withheld (stays `none` — cold/
  empathy-less is the point).
- **psychic axis:** spread to none / overt / none / subtle / subtle — bio now carries an
  OVERT shared-mind psychic register (it already had subtle; promoted so the axis isn't
  flat), the rest unchanged. This keeps "not all psychic" while actually using the range.

## Final distribution (after rewrite)

| Set | alien_status | psychic | resource |
|---|---|---|---|
| first-contact-diplomacy | living | none | moderate |
| bio-symbiosis-horror | living | overt | core |
| machine-successor | dormant | none | high |
| time-war | ambiguous | subtle | none |
| generation-ship-identity | ancestral | subtle | low |

resource: all five distinct bands. alien_status: living/living/dormant/ambiguous/ancestral
(two living, but the two living sets — reactive diplomats vs. one vast organism — share
nothing else). psychic: none/overt/none/subtle/subtle (range used, not all psychic).
No set reads as #0.

## Residual concerns for round 2

- **Two `living` sets** (first-contact, bio). They're behaviorally opposite (negotiating
  with persons vs. being absorbed by an ecosystem), but a future round could push one to
  a different status (e.g., first-contact aliens as a fleet just ARRIVING — `incoming`?)
  if the schema allows new status values.
- **machine-successor trope risk** persists: dormant-AI-god is well-trodden (Reapers,
  Horizon's GAIA). The intent-fragment artifact loop helps, but round 2 should pressure-
  test for a fresher angle (e.g., the machines are mid-task, not asleep — actively
  terraforming/disassembling for a goal you can still interrupt).
- **generation-ship** still hinges on ONE reveal at the macro level even with diversified
  artifacts; round 2 should verify the world-gen produces variety BEFORE the reveal lands,
  not just different flavors of the same epiphany.
- **No fully "absent" alien set.** Prompt allows alive/dormant/absent. We have no
  absent/never-met-them seed (artifacts only, makers gone without a fall). Could add
  variety in a later batch but out of scope for a 5-set rebalance here.
- **time-war `ambiguous` status** is a new value not in the original vocabulary; if the
  pipeline enums alien_status strictly, this may need to map to `dormant`/`fallen`.
  Flagged for schema check in round 2.
