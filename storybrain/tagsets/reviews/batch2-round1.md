# batch2.json — Round 1 adversarial review

Reviewer posture: hostile. ROUND 1 of 3. Purpose: SEEDS for a sci-fi world-gen
pipeline meant to produce DIVERSE worlds. Pillars: artifact-hunting (story
driver), alien civilizations (need NOT be fallen), resource discovery/exploitation.
Every set: sci-fi + artifacts + alien civ. Resources good but not universal.
Psychic optional, not all. Must be DISTINCT from theme #0 (fallen-civ /
resource-exploitation-gone-wrong / overt-psychic / piece-together-the-fall),
from batch 1's five sets, and from each other.

Batch 1 (avoid overlap): first-contact-diplomacy (living, gatekept hunt),
bio-symbiosis (living, host/symbiote bonding, overt psychic), machine-successor
(active machines mid-project), time-war (ambiguous, re-sequence contradictory
evidence), generation-ship (absent makers, it-was-us reveal, accumulate-to-reckoning).

The bar from batch 1's review: a good seed must give the world-gen a
STRUCTURALLY DIFFERENT MYSTERY SPINE than #0's linear "they exploited X, it
killed them, reconstruct the fall." A seed that collapses back into that shape
is weak.

## Cross-set distribution audit (as received)

| Set | alien_status | psychic | resource | mystery spine |
|---|---|---|---|---|
| megastructure-absent-architects | absent | none | high | awe / where-did-they-go / what-was-it-for |
| extinction-plague-vector | extinct | none | moderate | outbreak-containment race |
| crowded-trade-federation | living | none | moderate | mercantile/social web — who-to-trust |
| uplift-nursery-world | hidden | subtle | core | stewardship / are-we-the-experiment |

First read: the distribution is genuinely good. Statuses are all distinct from
each other AND fill gaps batch 1 left (absent appears once in batch1 via
gen-ship, but the SPINE there is "it was us"; here it's "what's-it-for" — no
collision). extinct, hidden, and a crowded-living galaxy are net-new. Psychic is
3 none / 1 subtle — correctly NOT piled on. Resource spans moderate/moderate/
high/core — better than batch1's monoculture, but the two `moderate`s are a soft
spot (see P3). No set is a #0 autopsy on its face. This is a strong draft; my
job is to find the real cracks.

## Problems found

### P1 (BIGGEST — distinctiveness): extinction-plague-vector is the closest thing to a re-skinned #0
This is the most dangerous set. #0 = "they exploited a resource, it killed them,
reconstruct the fall." extinction-plague swaps "resource they exploited" for
"plague they failed to contain" — but the SHAPE is identical: a civilization
that is `extinct` / `fallen`, a death you reconstruct by hunting relics, a
linear cause→escalation→collapse you assemble. The hook even says "didn't fall
to greed — it was consumed by..." which is an explicit "this is a DIFFERENT
fall," conceding the genre is still fall-autopsy. The pipeline's `mystery =
{fragments, order}` caused_by chain (see batch1 round-3 schema finding) will
swallow this seed WHOLE — it's the one seed here that already fits the unmodified
validator, which is exactly the tell that it isn't structurally new.

What rescues it is the OUTBREAK / containment-race spine — the live downside
(crack the wrong relic and you reseed the plague NOW) is a genuinely different
story shape from passive autopsy. So the fix is NOT to replace the set; it's to
shove ALL the weight onto the present-tense containment race and STRIP the
"reconstruct how they died" framing. The aliens being `extinct` is fine as
backstory, but the seed must not invite the world-gen to make their fall the
mystery. Re-anchor: the mystery is "can WE contain it before it takes us,"
not "how did THEY fall." Also: an `extinct` status whose whole drama is "their
death is the thing you study" is precisely #0's posture. Consider `ambiguous`
or keeping `extinct` but making the live carriers/dormant spores the present
threat so the aliens aren't purely a corpse to autopsy.

### P2 (distinctiveness, internal): megastructure vs #0's resource-exploitation, and "absent" overlap with gen-ship
megastructure-absent-architects is strong (awe spine, absent makers, no corpse)
but carries `resource_centrality: high` anchored on "the structure's stored
energy and matter," and a tag "stored power." That's the seed nudging toward
"exploit the big resource" — the #0 register. The awe/where-did-they-go spine is
what makes it distinct; if the world-gen latches onto "harvest the megastructure's
power" it drifts toward resource-exploitation-as-spine. FIX: keep resource high
(it genuinely differs from #0 — you're powering UP a working machine, not
strip-mining a corpse) but make explicit in the flavor that exploitation here
is INSTRUMENTAL to the awe-mystery (each activation lights a clue), not the point.
Also de-confuse from gen-ship's `absent`: gen-ship absent = "they erased
themselves, it was us"; megastructure absent = "they finished/left, where & why."
Current prose is okay on this but should sharpen the "no bodies, not a fall,
not us" line to lock it apart from BOTH #0 and gen-ship.

### P3 (diversity, resource axis): two `moderate`s, and the weakest is plague's
extinction-plague and crowded-trade are both `moderate`. Batch1's #1 finding was
a resource monoculture; two moderates here is a milder version of the same. The
crowded-trade `moderate` is well-justified (contested commodity is a real axis).
The plague `moderate` is the throwaway one — resource isn't really the plague
story's engine. Recommend: drop plague to `low` (or `none`) — its engine is
containment, not extraction — to spread the axis and stop pretending resource
matters there. That yields a cleaner spread: high / low / moderate / core.

### P4 (generativity): crowded-trade risks one-note "haggle simulator"; uplift risks single-twist
- crowded-trade-federation: "provenance + forgery + black market" is rich for
  TONE but thin for WORLD VARIETY if the generator reads it as "every world is a
  bazaar with forged relics." The generative engine needs to be the WEB of
  factions and the specific contested commodity — so worlds diverge on WHO's
  feuding over WHAT, not just "noir marketplace" reskinned. FIX: push the
  distinct_from_siblings + flavor toward "the generative variable is the faction
  web + the commodity," same way gen-ship was fixed on "what was worth burying."
  Also: zero psychic + zero #0-overlap is great, but make sure the artifact HUNT
  is real — "tracing or faking provenance through living factions" IS a hunt
  (social triangulation), but it edges toward first-contact-diplomacy's
  "triangulate through a living relationship." Differentiate: first-contact is
  ONE alien gatekeeper relationship; crowded-trade is MANY shallow transactional
  factions and the relic's HISTORY (not your worthiness) is the puzzle. Sharpen.

- uplift-nursery-world: "are we the experiment" is a great reveal but, like
  gen-ship's "it was us," is a SINGLE TWIST a world-gen could just retell. FIX:
  make the generative variable the gardeners' INTENT/method per world (are they
  benevolent, indifferent, harvesting, breeding-for-a-purpose, quarantining
  us?) so worlds diverge on what cultivation MEANS before the experiment frame
  lands — mirrors the gen-ship fix.

### P5 (overlap check — uplift `hidden` + subtle psychic vs batch1): acceptable, sharpen
uplift is `hidden` (net-new status) with `subtle` psychic. Batch1's subtle-psychic
sets are time-war (precognition) and gen-ship (ancestral memory). uplift's subtle
register should be its OWN flavor (e.g. sensing the gardeners' attention / the
biosphere's "aimed-ness") — NOT precog, NOT ancestral memory. Current flavor says
"possibly tripping the gardeners' attention," which is good and distinct. Lock it
so the psychic axis reads as a third distinct flavor, not a generic whisper.

### P6 (artifact_flavor → does it support a HUNT?) — per set
- megastructure: YES. Control-keys scattered, each lights a region + clue, with a
  risk (waking a system off for a reason). Strong hunt with downside.
- plague: YES on paper (cure-fragments + quarantine relics, live-hazard downside)
  but see P1 — the hunt must be a containment RACE, not a dig.
- crowded-trade: WEAKEST as a hunt. Provenance-tracing is social, not spatial; it
  can read as "buy/sell," not "hunt." Needs an explicit find-and-authenticate
  loop so it's a hunt, not a market UI.
- uplift: YES. Shaping-tools in the soil, each reveals method + intent, downside
  is tripping gardener attention. Strong.

### P7 (`_note` / pipeline honesty): batch2 `_note` does NOT carry the controlled vocabulary or pipeline caveat
Batch1's round-3 review established that the `_note` must (a) state the
alien_status controlled vocabulary and (b) warn that these seeds presume pipeline
generalization (non-`fallen|extant` status enum, non-linear `mystery` shapes)
that the validator does not yet accept. batch2's `_note` does neither. It uses
`extinct` and `hidden` — two statuses the current `prompt-canon.md` /
`schema.ts` enum (`fallen|extant`) will REJECT. FIX: bring the `_note` up to the
batch1 standard: declare the vocabulary, note plague/uplift/megastructure presume
the same pipeline work batch1 flagged.

## Fixes applied this round (see rewritten batch2.json)

1. **extinction-plague-vector (P1, P3):** re-anchored entirely on the
   present-tense containment RACE; stripped "reconstruct how they died." Status
   kept `extinct` (backstory) but the spine is explicitly "can WE contain it,"
   the live carriers/dormant spores are the present threat. Resource dropped
   `moderate` → `low`. distinct_from_siblings now contrasts the OUTBREAK spine
   against #0's autopsy directly.
2. **megastructure (P2):** flavor now states exploitation is INSTRUMENTAL to the
   awe-mystery; sharpened the "no bodies, not a fall, not us" line to separate
   from #0 AND gen-ship's absent.
3. **crowded-trade (P4, P6):** generative variable re-pinned on the faction web +
   contested commodity (worlds diverge on who/what, not "bazaar reskin"); added
   an explicit find-and-authenticate hunt loop; differentiated from
   first-contact (one gatekeeper vs many transactional factions; relic history
   vs your worthiness).
4. **uplift (P4, P5):** generative variable re-pinned on the gardeners' INTENT/
   method per world; locked the subtle psychic as "sensing aimed-ness / gardener
   attention" — distinct from precog and ancestral memory.
5. **`_note` (P7):** rewritten to carry the controlled alien_status vocabulary
   and the pipeline-generalization caveat, matching batch1's standard.

## Residual concerns for round 2

- **R2-A:** Is `extinct` still too close to #0 even after re-anchoring plague on
  containment? Round 2 should pressure-test whether the world-gen, given an
  `extinct` civ, defaults to autopsy regardless of the containment framing.
  Consider `ambiguous` (are the makers truly gone or dormant carriers?) as a
  hedge if the spine still drifts.
- **R2-B:** crowded-trade is the only set with NO existential/cosmic mystery —
  its "mystery" is social (whose provenance is real). Verify this counts as a
  distinct SPINE and not merely a tone, given the pipeline's `mystery =
  {fragments, order}` expects a why-chain. May need the contested commodity to
  carry a latent cosmic hook (what IS the commodity, really) so the generator
  has a fragments-chain to build.
- **R2-C:** resource spread is now high / low / moderate / core — good, but no
  `none`. Batch1 has time-war at `none`. Acceptable across the full 10-set
  sample; flag only if round 2 wants every batch self-balancing.
- **R2-D:** megastructure and crowded-trade both feature human ARRIVAL into an
  alien situation; verify their world-shapes don't converge tonally (awe vs
  noir should keep them apart, but watch it).
- **R2-E:** confirm none of the four artifact_flavors collapse to "data-core /
  memory-core" (the batch1 overlap risk). Current: control-keys, quarantine-
  relics/cure-fragments, provenance-curios, shaping-tools — all distinct. Good.
