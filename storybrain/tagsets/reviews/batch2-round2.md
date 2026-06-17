# batch2.json — Round 2 adversarial review

Reviewer posture: HOSTILE. ROUND 2 of 3. Round 1 ran and applied 5 fixes; this
round verifies those held and finds what is STILL weak without repeating round 1.

Purpose recap: these tag sets are SEEDS for a world-gen pipeline meant to produce
DIVERSE sci-fi worlds (artifact-hunting + alien civilizations + resource
discovery). Each must be distinct from the others, from batch1's five
(first-contact / bio-symbiosis / machine-successor / time-war / generation-ship),
and from theme #0 (the marrow/Velt/Choir world: fallen-civ + resource-exploitation
-gone-wrong + overt psychic + reconstruct-the-linear-fall). The decisive test is
the MYSTERY SPINE: a structurally different story shape than #0's linear autopsy.

## The thing round 1 under-weighted: read the actual mystery PRIMITIVE

I read `generator/schema.ts` and `generator/prompt-canon.md` directly this round.
The pipeline's mystery is NOT free-form. It is `mystery = { fragments[], order[] }`
where `order` MUST be a permutation of `fragments`, and the deterministic
`reconstructFall()` returns the revealed fragments IN ORDER. `prompt-canon.md`
further hard-codes the order as a `caused_by` chain (cause → escalation →
point-of-no-return → collapse).

This sharpens the round-1 bar. Every seed, no matter its prose "spine," must
eventually be expressed as an ORDERED SEQUENCE OF FRAGMENTS. So the real round-2
question for each set is NOT "does the prose sound different from #0" — round 1
already settled that — it is: **what does `order` MEAN for this seed, and is that
meaning structurally different from #0's death-cause chain?** A seed whose
fragments-in-order secretly reconstruct "how the civ died" is a re-skinned #0
even if the prose never says "fall."

Classifying each set by what its `order` axis actually IS:

| Set | What `order` reconstructs | Same as #0's death-cause chain? |
|---|---|---|
| megastructure | PURPOSE reveal — region-by-region, what the machine is FOR | No — assembly toward a function, not a death |
| plague | **DANGER: could be the death-autopsy chain** (how the vector spread → consumed them) OR the containment recipe (what to assemble to stop it). The two are different `order` axes and the seed must FORCE the second. | At risk — see V1 |
| trade | PROVENANCE chain — the real history of one artifact, claim by claim | Structurally novel BUT weak as an `order` (see V2) |
| uplift | INTENT/method reveal — what the gardeners are doing and why | No — purpose reveal, like megastructure |

This table exposes the two genuinely-live problems this round (V1, V2) and one
NEW sibling-overlap round 1 did not flag (V3).

## Verifying round-1 fixes held

- **megastructure (R1 P2):** HELD. Flavor now says exploitation is "instrumental,
  not the point"; the "no bodies, not a fall, not us" line locks it apart from #0
  and gen-ship. Resource `high` is justified as power-UP-a-machine vs strip-mine-a
  -corpse. No regression. (But see V3 — its `order` axis now collides with uplift.)
- **plague (R1 P1/P3):** PARTIALLY held. Prose is re-anchored on the present-tense
  containment race and resource dropped to `low`. But the STATUS is still
  `extinct` and the flavor still invites cracking relics that "reseed the plague" —
  which a `{fragments, order}` generator can still render as the death-autopsy
  chain. R2-A is NOT resolved by prose alone. See V1.
- **trade (R1 P4/P6):** HELD on generativity (faction web + commodity) and on the
  find-and-authenticate hunt loop. But R2-B (does a SOCIAL mystery satisfy the
  `{fragments, order}` shape) is NOT resolved — the current commodity has no
  latent ordered hook. See V2.
- **uplift (R1 P4/P5):** HELD. Gardener-INTENT generative variable and the
  "sensing aimed-ness / gardener attention" psychic register are both locked and
  distinct from precog/ancestral-memory. No regression. (See V3 for the new
  overlap with megastructure's `order` axis.)
- **_note (R1 P7):** HELD. Controlled vocabulary + pipeline caveat are both
  present and now richer than batch1's (it enumerates the full status enum and
  names the four spines).

## NEW / RESIDUAL problems found this round

### V1 (BIGGEST — R2-A confirmed): plague's `extinct` status + relic-cracking STILL reconstructs #0's death chain
Round 1 re-anchored the PROSE on containment but left two structural tells that a
`{fragments, order}` generator will read straight back into a #0 autopsy:

1. **Status `extinct` + "their death is settled backstory" + relics that "drop a
   fragment."** The path of least resistance for the generator is: fragment[0] =
   "they touched/built the vector," fragment[1] = "it escalated," fragment[2] =
   "it consumed them." That is `caused_by` cause→collapse — #0 with a virus
   instead of marrow. The containment race is a GAMEPLAY layer on top; the
   `mystery.order` underneath is still their death.
2. The hook still spends a sentence on HOW they failed to contain it
   ("consumed by a self-replicating extinction-vector it failed to contain"),
   which is an invitation to make that failure the fragment chain.

**The fix that actually changes the `order` axis** (not just the prose): make the
fragments reconstruct **the CONTAINMENT RECIPE**, not the death. The ordered chain
should be "what you must learn/assemble, in sequence, to stop it reaching you" —
a forward-facing protocol (identify the vector's nature → find its dormancy
trigger → locate the keystone relic → the assembly that seals it), NOT a backward
-facing autopsy. The aliens' death becomes ONE early fragment ("proof the vector
is real and lethal"), not the whole chain. And I am changing the STATUS from
`extinct` to `ambiguous` (per round 1's own hedge R2-A): the live question
becomes "are the makers actually all dead, or are dormant carriers/last
quarantined survivors still out there" — which (a) removes the corpse-to-autopsy
posture, (b) gives the containment race a living stakeholder, and (c) makes the
`order` chain forward (what's still out there) not backward (how they died).
This also de-duplicates `extinct` from being the one status whose entire premise
is "study the death."

### V2 (R2-B confirmed): trade's social mystery has NO valid `order` axis — it needs a latent provenance/cosmic hook
R2-B asked whether the social "whose provenance is real" satisfies `{fragments,
order}`. Reading the schema: it does NOT, as written. A social web of competing
claims is a SET, not a SEQUENCE. The generator needs an ordered fragment chain;
"who's lying" gives it a flat graph of accusations with no natural order, so the
generator will either (a) fail the permutation/coverage check, or (b) fall back
to inventing a death-chain to satisfy the contract — reintroducing #0.

The fix is the one round 1 gestured at but did not commit: give the CONTESTED
COMMODITY a latent buried truth that the provenance trail reconstructs IN ORDER.
The hunt becomes "authenticate the relic" = "trace its real chain of custody back
through the forgeries to its true origin" — and THAT origin is a small cosmic
hook (what the commodity actually is / where it actually came from / who really
made the relics everyone's been faking). So `order` = the relic's TRUE provenance
chain, oldest link to newest, recovered by stripping forgeries. This is a real
ordered reconstruction that is NOT a death-autopsy (it is a history-of-an-object,
present-tense, with living claimants) and NOT time-war's re-sequencing (the order
is fixed and singular — there's one true past — you're removing lies, not
inverting meaning). I am writing this latent-origin hook into the commodity and
the artifact_flavor explicitly.

### V3 (NEW — sibling overlap round 1 missed): megastructure and uplift now share a "PURPOSE-reveal" `order` axis
Round 1 fixed each set in isolation and did not check that megastructure's
"what-was-it-FOR" and uplift's "what-are-they-cultivating-us-FOR" are the SAME
shape of mystery: both are forward-looking PURPOSE/INTENT reveals where the
ordered chain assembles toward "the function/goal," not a death. On the `order`
axis they are siblings.

They are NOT identical (megastructure: absent makers, awe, an artifact/machine's
purpose; uplift: hidden makers, dread/moral, a biological program's purpose), and
the prose distinctions hold. But to keep the `order` axes from rhyming I am
sharpening the DIRECTION of each reveal:
- megastructure's order = OUTWARD/RETROSPECTIVE: piecing together what the
  builders BUILT IT TO DO and where they WENT (a finished/abandoned purpose —
  the answer is in the past, the makers are gone).
- uplift's order = INWARD/PROSPECTIVE: piecing together what the gardeners are
  doing TO US and what we are being grown INTO (an in-progress purpose aimed at
  the player — the answer is in the future, the makers are still acting).
This keeps "purpose" as the shared family but splits it on tense+target
(past/them vs future/us), which is enough divergence for the world-gen to produce
non-rhyming chains. I am writing this distinction into both
distinct_from_siblings fields.

### V4 (resource axis re-check): spread holds; one nuance
Post-fix resource is high (megastructure) / low (plague) / moderate (trade) /
core (uplift). With V1 keeping plague at `low`, the spread is unchanged and good
(R2-C noted no `none`, acceptable across the 10-set sample since time-war carries
`none`). No change. One nuance: trade's `moderate` is now better-earned because
V2 makes the commodity a genuine story object (its true nature is the mystery
hook), not just a thing-to-haggle-over. Leaving `moderate`.

### V5 (R2-D re-check): megastructure vs trade tonal convergence — HELD, plus a sharpening
Both are human-arrival-into-alien-situation. Awe (megastructure) vs noir (trade)
keeps them apart tonally, and V3's `order`-axis work further separates
megastructure (purpose-reveal) from trade (provenance-reveal). No convergence.
Confirmed distinct. No change beyond what V2/V3 already add.

### V6 (artifact_flavor → HUNT, re-check all four under the V1/V2 changes)
- megastructure: control-keys, each lights a region + drops a purpose fragment +
  risks waking a subsystem. Strong spatial hunt with downside. HELD.
- plague (post-V1): quarantine-relics + containment-recipe pieces; each is a live
  hazard (crack the wrong one, reseed it here). The hunt is now assemble-the-
  -recipe-before-it-arrives — a clock with a fail-state. Still a real hunt, now
  with a forward `order`. STRENGTHENED.
- trade (post-V2): find-and-authenticate; trace a relic's true provenance back
  through forgeries to its latent origin. The ordered reconstruction (strip lies
  to reach the one true past) IS the hunt's payoff now, not just flavor. HELD,
  with a clearer win condition.
- uplift: shaping-tools in the soil, each reveals method+intent, downside is
  tripping gardener attention. HELD.
All four remain distinct artifact families (control-keys / quarantine-relics+
recipe / provenance-curios / shaping-tools) — no collapse to data-core/memory-
core (R2-E confirmed clean again).

## Fixes applied this round (see rewritten batch2.json)

1. **plague (V1 / R2-A):** status `extinct` → `ambiguous`; re-pinned the mystery's
   `order` axis on the forward CONTAINMENT RECIPE (what to assemble to stop it),
   with the aliens' death demoted to one early "it's real and lethal" fragment
   and the live question reframed as "are dormant carriers / last survivors still
   out there." Hook + flavor + distinct_from_siblings rewritten to forbid the
   death-autopsy reading and contrast the forward chain against #0's backward one.
2. **trade (V2 / R2-B):** gave the contested commodity a latent true-origin hook;
   re-pinned the mystery's `order` axis on the relic's TRUE PROVENANCE CHAIN
   (strip forgeries oldest-to-newest to reach the one real past). Differentiated
   from time-war (fixed singular order, removing lies — NOT inverting meaning).
3. **megastructure + uplift (V3):** split the shared "purpose-reveal" `order` axis
   by tense+target — megastructure = retrospective/outward (what they BUILT it
   for, where they WENT, makers gone), uplift = prospective/inward (what we're
   being grown INTO, makers still acting). Written into both
   distinct_from_siblings.
4. No resource/psychic/status redistribution beyond V1's status flip (V4 spread
   holds; psychic still 3 none / 1 subtle).

## Residual concerns for ROUND 3

- **R3-A (plague status churn):** I moved plague `extinct`→`ambiguous`. Round 3
  must verify this does NOT now collide with time-war, which is ALSO `ambiguous`.
  My claim: time-war's ambiguity is "alive-or-dead is a CAUSALITY paradox, the
  war is still resolving"; plague's ambiguity is "alive-or-dead is an EPIDEMIOLOGY
  question, are there surviving carriers." Different reasons for the same status,
  and different spines (re-sequence-contradictions vs containment-race). But two
  `ambiguous` sets across the 10-set sample is a concentration round 3 should
  pressure-test — consider whether `dormant` (the makers as quarantined sleepers
  who could wake/spread) is a cleaner net-new status that also kills the autopsy
  posture without doubling `ambiguous`.
- **R3-B (V3 durability):** the megastructure/uplift purpose-reveal split is
  defended by tense+target (past/them vs future/us). Round 3 should confirm the
  world-gen actually produces non-rhyming `order` chains from these two, since
  both are still "assemble fragments toward a PURPOSE." If they rhyme in practice,
  one may need its spine re-pointed (e.g. uplift toward a STEWARDSHIP-CHOICE
  branching mystery rather than a linear intent-reveal).
- **R3-C (trade order singularity vs time-war):** V2 gives trade a fixed singular
  true-provenance order (strip lies → one real past). Round 3 should verify this
  is felt as DIFFERENT from time-war's re-sequencing and not just "a milder
  contradiction puzzle." The intended split: trade has ONE true order obscured by
  forgery (detective/authentication); time-war has NO fixed order and meaning
  inverts (paradox). Confirm the prose keeps these from blurring.
- **R3-D (does the pipeline actually need generalizing for plague's forward
  chain?):** `prompt-canon.md` hard-codes `order` as `caused_by`
  cause→escalation→collapse. A FORWARD containment-recipe chain is not a
  `caused_by` death chain — it is a "prerequisite/enables" chain. Round 3 (or the
  pipeline-generalization work) must confirm the schema's `order` permutation +
  `reconstructFall` can carry a non-`caused_by` ordered relation, or plague (and
  megastructure/uplift/trade, all non-death orders) still get coerced back toward
  #0 by the canon prompt. This is the deepest remaining risk: the SEEDS are now
  structurally diverse, but the CONTRACT still assumes one order-relation
  (`caused_by`). The seeds are correct as the SPEC; flag loudly that the order
  RELATION (not just the status enum and mystery prose) needs generalizing.
- **R3-E (none-psychic monoculture):** 3 of 4 are `psychic: none`; only uplift is
  `subtle`. Across all 10 this is fine (batch1 carries overt + 2 subtle). Not a
  defect, but round 3 may consider whether megastructure could carry a faint
  non-#0 psychic register (e.g. the structure's dormant systems "addressing" a
  sensitive) to avoid the appearance of psychic being an afterthought in batch2 —
  LOW priority, do not force it if it muddies the awe spine.
</content>
</invoke>
