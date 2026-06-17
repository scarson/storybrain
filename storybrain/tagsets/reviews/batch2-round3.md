# batch2.json — Round 3 adversarial review (FINAL)

Reviewer posture: HOSTILE. ROUND 3 of 3 (final). Round 1 applied 5 fixes; round 2
applied 4 (status flip + two order-axis re-pins + a sibling-overlap split). This round
verifies rounds 1–2 held, resolves the round-2 residuals (R3-A…R3-E), makes the plague
status call, and finalizes to shippable. Source files (`schema.ts`, `prompt-canon.md`,
`check.ts`, `world-scifi.json`, `batch1.json`) were re-read directly this round, not
taken on the prior reviewer's word.

## Source re-verification (the claims rounds 1–2 rested on)

- **The contract really does assume ONE order relation.** `schema.ts:18` types
  `mystery.order` with the comment "the why-it-fell chain"; `reconstructFall()`
  (`schema.ts:71–77`) is named for and reasons about `caused_by`-ordered reveals.
  `prompt-canon.md:30,42` hard-code the fragment roles `cause|escalation|
  point-of-no-return|collapse` and state "fragment[i] `caused_by` fragment[i-1]."
  `check.ts` exits nonzero on validation failure. **R3-D is real and confirmed at the
  source.** The seeds are the SPEC for generalizing this relation, not conformant input.
- **#0's order is a pure linear death chain.** `world-scifi.json:109–124`:
  marrow-was-alive → extraction-was-amputation → wound-sang → choir-tried-to-sing-it-down
  → resonance-cascade, wired by four `caused_by` edges. This is exactly the spine all
  four batch2 seeds must structurally diverge from. Confirmed baseline.
- **No batch1 status is reused-the-same-way by batch2.** batch1 statuses: living (x2:
  first-contact, bio-symbiosis), active (machine-successor), ambiguous (time-war), absent
  (generation-ship). batch2 now: absent (megastructure), dormant (plague), living (trade),
  hidden (uplift). `living` recurs (trade vs first-contact/bio-symbiosis) but the SPINE
  and order-axis differ (mercantile provenance vs diplomacy vs symbiosis-horror); `absent`
  recurs (megastructure vs generation-ship) but megastructure's distinct_from_siblings
  already nails the split (genuinely-OTHER vanished makers + retrospective/outward purpose
  vs it-was-us ancestral). No collision.

## Round-2 residuals — resolution

### R3-A (plague status: `ambiguous` vs `dormant`) — DECIDED: `dormant`. APPLIED.
Round 2 flipped plague `extinct`→`ambiguous`, which created two `ambiguous` sets across
the 10-set sample (plague + time-war) defended only by "different reasons for the same
status." That defense is a smell when a cleaner status exists. Evaluated `dormant`
("sleeping/sealed, wakeable") against the controlled vocab and the seed's actual texture:

- **For `dormant`:** (1) net-new across all 10 sets — maximizes status breadth, which is
  the entire point of the batch; (2) kills the corpse-autopsy posture HARDER than
  `ambiguous` — sleepers are not a corpse to dissect, there is nothing to autopsy, only a
  clock; (3) de-doubles `ambiguous` (time-war keeps sole ownership); (4) fits the seed's
  real menace better than the prior reviewer assumed — the live threat in an outbreak
  thriller is precisely sealed carriers/sleepers whose WAKING restarts the plague, which
  IS the present-tense containment clock.
- **The one cost (handled):** `dormant` describes a sleeping civ, so I had to move the
  "are any makers still alive" question from the STATUS into FLAVOR. Done — the makers are
  now sealed quarantine-sleepers (dormant), and "can they be safely woken as allies, or
  are they themselves carriers" is the per-world generative variable. The undecided-life
  flavor survives without leaning on `ambiguous`.

Applied: `alien_status` → `dormant`; hook rewritten around sealed sleepers + dormant
carriers (waking-is-the-threat); tags gain `sealed sleepers` + `waking-is-the-threat`;
flavor + distinct_from_siblings rewritten. This also strengthens the forward spine: the
order axis is now unambiguously "race to seal before something wakes," not "reconstruct
whether they're dead."

### R3-B (megastructure vs uplift purpose-reveal durability) — HELD.
Both reveal a PURPOSE, but the round-2 tense+target split survives scrutiny: megastructure
= RETROSPECTIVE/OUTWARD (absent builders, what they built it FOR, where they WENT — answer
in the past), uplift = PROSPECTIVE/INWARD (hidden gardeners still acting, what we're being
grown INTO — answer in the player's future). On the actual `order` chain this means
megastructure assembles toward a finished/abandoned function (each key lights a region +
reveals a fragment of a completed plan) while uplift assembles toward a still-unfolding
goal (each tool reveals method + intent of an in-progress program). These do not rhyme:
one terminates in "this is what it was for, and they're gone"; the other in "this is what
they're doing to us, and they're watching." Both distinct_from_siblings fields state the
split explicitly. No change. (If the world-gen ever DOES produce rhyming chains in
practice, the round-2 fallback stands: re-point uplift to a branching STEWARDSHIP-CHOICE
mystery. Not needed pre-ship.)

### R3-C (trade true-provenance vs time-war re-sequencing) — HELD.
The prose keeps these apart cleanly: trade's order is a FIXED, SINGULAR past obscured by
forgery — you strip lies to reach the one real sequence (authentication/detective), and
the payoff is a latent true-origin of the contested commodity. Time-war has NO fixed
order; each find INVERTS the meaning of the others (paradox). Trade's distinct_from_siblings
says this in as many words. The plague status change made time-war the ONLY `ambiguous`
set, which incidentally sharpens this contrast further (time-war's uncertainty is now
unique). No change.

### R3-D (pipeline order-relation generalization) — CANNOT be fixed in seeds; FLAGGED LOUDLY.
This is the deepest residual and it is structural, not a seed defect. All four seeds use
non-`caused_by` order relations:
- megastructure: `enables/reveals` (retrospective purpose)
- uplift: `reveals-method` (prospective purpose)
- plague: `prerequisite/enables` (forward containment protocol)
- trade: `precedes` (true provenance, oldest→newest)

The contract (`schema.ts` + `prompt-canon.md` + `reconstructFall`) assumes ONE relation,
`caused_by`, and a death-shaped chain. `validateWorld` will still accept these (it only
checks order is a permutation of fragments), BUT `prompt-canon.md` will COERCE the LLM
back toward a cause→collapse death chain unless the canon prompt is generalized to carry a
per-seed `order_relation` (caused_by | enables | prerequisite | precedes | reveals) and
loosen the mandatory `cause|escalation|point-of-no-return|collapse` role vocabulary.
`reconstructFall` should be renamed/generalized to `reconstructMystery` and stop implying
a fall. **This is pipeline work, scoped by these seeds; it is NOT a blocker on shipping
the seeds themselves.** The _note carries this as the headline pipeline caveat. Honest
residual: until that generalization lands, running these seeds through the UNMODIFIED
canon prompt will produce #0-shaped death chains regardless of how diverse the seeds are.
The seeds are correct; the contract is the bottleneck.

### R3-E (none-psychic concentration) — ACCEPTED, no change.
3 of 4 batch2 sets are `psychic: none`; only uplift is `subtle`. Across all 10 (batch1
carries 1 overt + 2 subtle, #0 overt) the sample has overt/subtle/none all represented.
Per Sam's "psychic OPTIONAL, do not pile on" directive, leaving megastructure at `none` is
correct — forcing a faint psychic register into the awe spine would muddy it for the sake
of a quota. Not a defect. No change.

## Final hostile pass

- **Cliché:** each spine resists its nearest trope. Megastructure refuses the
  awaken-the-sleeping-god beat (builders simply GONE, no fall). Plague refuses the
  patient-zero autopsy (forward recipe, not backward cause). Trade refuses the lost-empire
  tomb (living crowded market). Uplift refuses the benevolent-precursor reveal (intent is a
  per-world variable spanning steward→breeder→culler). Clean.
- **Sibling overlap (within batch2):** four distinct statuses, four distinct order
  relations, four distinct artifact families (control-keys / quarantine-relics+recipe /
  provenance-curios / shaping-tools), four distinct tones (awe / thriller / noir /
  moral-ecological). No collapse.
- **vs batch1:** spines (awe / outbreak / mercantile / stewardship) do not duplicate
  diplomacy / symbiosis-horror / industrial-succession / time-paradox / identity-reckoning.
  Status reuse (`living`, `absent`) is differentiated by spine + order axis as noted above.
- **vs #0:** all four use a non-`caused_by`, non-death order relation and a non-fallen
  status — the decisive test passes for every set.
- **Hunt-ability of each artifact_flavor:** all four describe a concrete find loop with a
  win/lose texture — light-the-machine (megastructure, downside: wake a wrong subsystem),
  assemble-the-seal-before-it-wakes (plague, downside: reseed/wake), find-and-authenticate
  (trade, downside: closing the wrong deal / forgery), steer-the-biosphere (uplift,
  downside: trip gardener attention). None is a passive lore-dump. Clean.
- **Breadth contribution to the 10-set sample:** batch2 adds two genuinely new statuses to
  the corpus (`hidden`, `dormant`), two order relations the prior nine never used
  (`prerequisite` forward-protocol, `precedes` provenance), and the only mercantile/social
  and only moral-ecological/stewardship spines. Real breadth, not filler.

## FINAL STATE

Per-set one-liner:

- **megastructure-absent-architects (The Inheritance):** humanity inside a working
  solar-system machine whose builders simply vanished; light it region-by-region with
  control-keys to reconstruct what it was FOR and where they WENT.
- **extinction-plague-vector (The Quarantine Worlds):** an extinction-vector drove a civ
  into sealed quarantine-sleep; race to assemble a forward containment recipe before a
  dormant carrier or sleeper wakes inside your range.
- **crowded-trade-federation (The Long Bazaar):** a living, crowded mercantile galaxy
  where a relic's power is its provenance and half the provenance is forged; strip the
  lies to trace one relic's true chain of custody to the contested commodity's real origin.
- **uplift-nursery-world (The Gardeners' Patience):** a world being deliberately cultivated
  by hidden gardeners; their shaping-tools reveal, step by step, what they are growing US
  INTO — and whether the colony is guest, pest, or experiment.

Breadth matrix (one line per set):

| Set | Status | Psychic | Resource | Tone | Order-meaning (relation) |
|---|---|---|---|---|---|
| megastructure | absent | none | high | awe / dread | retrospective PURPOSE — what it was built for, where they went (`enables/reveals`) |
| plague | dormant | none | low | outbreak thriller | forward CONTAINMENT recipe — identify→trigger→keystone→seal (`prerequisite/enables`) |
| trade | living | none | moderate | mercantile noir | true PROVENANCE — oldest link to newest, lies stripped (`precedes`) |
| uplift | hidden | subtle | core | moral / ecological | prospective PURPOSE — what we're being grown into (`reveals-method`) |

vs #0: status `fallen`, psychic `overt`, resource `core`, tone tragedy/autopsy, order =
linear DEATH chain (`caused_by`, cause→collapse). Every batch2 set differs on order-meaning,
which is the decisive axis.

## Verdict: SHIPPABLE.

All round-1 and round-2 fixes held under direct source re-verification. The plague status
question is decided in favor of `dormant` (net-new, de-doubles `ambiguous`, kills the
autopsy posture, fits the seed's texture) and applied. R3-B and R3-C hold without change.
R3-E accepted. The four together add real breadth (two new statuses, two new order
relations, two new spines) to the 10-set sample and each is distinct from the others,
from batch1, and from #0 on the decisive order-meaning axis.

### Honest residual caveat (carry into pipeline work, NOT a ship blocker)

**R3-D — the contract assumes ONE order relation.** `prompt-canon.md` + `schema.ts` +
`reconstructFall` hard-code a `caused_by` death chain. `validateWorld` will ACCEPT these
seeds' permutations, but the canon prompt will COERCE generation back toward #0's
cause→collapse shape until it is generalized to carry a per-seed `order_relation`
(caused_by | enables | prerequisite | precedes | reveals) and relax the mandatory
cause/escalation/PONR/collapse role vocabulary; `reconstructFall` should be generalized
(rename to `reconstructMystery`, drop the fall assumption). The seeds are the correct SPEC
for that work. Until it lands, these seeds run through the UNMODIFIED pipeline will still
yield death-shaped mysteries — the bottleneck is the contract, not the seeds.
