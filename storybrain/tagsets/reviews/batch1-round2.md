# batch1.json — Round 2 adversarial review

Reviewer posture: hostile. ROUND 2 of 3. Building on round 1, not repeating it.
Purpose of artifact: SEEDS for a sci-fi world-gen pipeline meant to produce
DIVERSE worlds. Pillars: artifact-hunting (story driver), alien civilizations
(need NOT be fallen), resource discovery/exploitation. Every set: sci-fi +
artifacts + alien civ. Resources good but not universal. Psychic optional, not
all. Distinct from each other and from theme #0 (fallen-civ /
resource-exploitation-gone-terribly-wrong / psychic / piece-together-the-fall).

## NEW context this round changes everything (round 1 never read the pipeline)

I read the actual generator the seeds feed:
`storybrain/generator/prompt-canon.md`, `prompt-artifacts.md`, and the canonical
world `world-scifi.json` (which IS theme #0 — the marrow/Velt/Choir world).

Three facts that re-frame the whole review:

1. **The pipeline's DEFAULT spine is theme #0, hard-coded into the prompts.**
   `prompt-canon.md` mandates: `status: "fallen|extant"`, a psychic power that
   matters, and "an ancient mystery: a once-great civilization fell. The spine
   of the fall is resource exploitation gone wrong" decomposed into an ORDERED
   `caused_by` chain (cause → escalation → point-of-no-return → collapse).
   `prompt-artifacts.md` makes every artifact "drop lore facts that piece
   together why the ancient civilization fell."
   => The seeds exist precisely to BREAK this mono-theme. So the real test of a
   seed is not "is it sci-fi with artifacts and aliens" (trivially yes) — it is
   **does the seed give world-gen a structurally DIFFERENT mystery spine than
   the linear `caused_by` autopsy of a resource-driven fall?** A seed that still
   resolves to "find artifact → drops fragment → reconstruct the linear fall"
   has failed even if its flavor words differ.

2. **`alien_status` vocabulary mismatch is now concrete, not hypothetical.**
   The pipeline enum is `fallen|extant`. Round 1 introduced
   living/dormant/ambiguous/ancestral. NONE of those four match the pipeline
   enum. This is FINE if (and only if) these seeds are understood to drive a
   pipeline EXPANSION (the seeds are the spec for new statuses). But the seed
   file should say so explicitly, and the values must be a clean controlled
   vocabulary, not ad-hoc prose. Round 1's "ambiguous" was flagged as possibly
   unusable; the right fix is to declare the vocabulary in `_note`, not to
   retreat to `fallen|extant`.

3. **#0's actual signature is sharper than round 1 assumed.** #0 is not just
   "fallen civ + psychic." It is specifically: a RESOURCE that was secretly a
   LIVING organism's body; EXTRACTION = injury FELT by the whole; the injury
   propagates a psychic cascade that kills the civ; you reconstruct it via a
   linear cause→collapse chain. Any seed that reproduces "harvest a living
   thing's body, the whole feels it" is colliding with #0 on its core, not its
   surface.

## Verifying round-1 fixes held

| Round-1 fix | Held? | Notes |
|---|---|---|
| resource_centrality spread to 5 distinct bands | YES | none/low/moderate/high/core all present, one each. |
| time-war re-anchored off "why they fell", status→ambiguous | YES | hook now causality/sequence-driven; no autopsy phrasing. |
| first-contact gained an earned-tier HUNT loop | PARTIAL | hunt restored in prose, but the loop ("prove worthy to unlock the next tier") is still a gating mechanic more than a find/assemble hunt; sharpened this round. |
| generation-ship artifact substrate diversified | YES | substrate now varied (memory-cores, bio-vaults, star-charts, monuments, wills). |
| machine-successor cores encode divergent intent | YES | generativity helped. But trope (dormant-AI-god) survived — round 1 flagged it for me; addressed this round. |
| psychic spread none/overt/none/subtle/subtle | YES | range used, not all psychic. |

Round 1's mechanical rebalancing (the distribution table) is solid and I am
keeping its skeleton. The problems left are CONCEPTUAL — collisions with #0 and
with the pipeline default that a distribution table can't catch.

## Problems found THIS round

### P1 (BIGGEST) — bio-symbiosis collides with #0 on its CORE, not its surface.
Round 1 declared bio "clear of #0" because "its horror is becoming, not
extinction." But its `artifact_flavor` and `distinct_from_siblings` literally
read: "the resource IS the organism's living tissue, and harvesting it is felt
by the whole." That is #0's spine verbatim — #0's marrow IS a living organism's
nerve-tissue, and "every bore-shaft severed living tissue… the world woke, in
pieces, in pain." Both are: living planet-scale organism + harvest its body +
the whole feels the injury + overt psychic register. The ONLY difference is
#0's organism dies and bio's absorbs you. For a world-gen that already defaults
to #0's structure, this seed will pull worlds RIGHT BACK toward #0. FIX: keep
the symbiosis/becoming horror but cut the "harvest a living planet's body, the
whole feels it" framing. Re-anchor on the symbiote/host RELATIONSHIP and the
artifacts being grown organs you bond with — the resource you exploit is your
own transformation/bandwidth, not the organism's flesh. Drop resource from
`core` to `moderate` so it stops being "strip-mine a living thing," which is
exactly #0.

### P2 — Two `living` sets AND no `absent` status (round-1 residual).
first-contact (living, present, negotiating) and bio (living, present, absorbing)
are both "the aliens are HERE and reacting to you." Round 1 said they're
behaviorally opposite; true, but the STATUS axis (the field world-gen keys on)
showed living/living and the batch had NO `absent` seed — round 1 flagged this
itself. The cleanest breadth win without adding a 6th set: deliver `absent` by
reframing generation-ship. Its makers (the colonists' own ancestors) are GONE —
deliberately, completely — so the present-day alien-civ status is `absent`, not
`ancestral`. The relationship (it-was-us) is carried in tags; the STATUS the
pipeline keys on becomes `absent`. Combined with machine→`active` (P3), the
five sets now span living / living / active / ambiguous / absent — four distinct
statuses, both round-1 residuals resolved, no strong set sacrificed, no 6th set.
The surviving two-`living` is justified: persons-with-agency (first-contact) vs
an-environment-you're-inside-of (bio) drive different world-gen generators.

### P3 — machine-successor "dormant AI god" trope survived round 1.
Round 1 flagged it for me explicitly (Reapers / Horizon's GAIA). The
intent-fragment loop is good but the FRAME — ancient AI sleeping, you wake it —
is the single most-trodden sci-fi AI beat. Round 1's own suggestion: the
machines are MID-TASK, not asleep. I am taking it further: the machine
civilization never stopped. It is **actively, visibly running a galaxy-scale
project right now** — disassembling dead worlds, building something whose
purpose you can read only by collecting the work-orders (the artifacts). It is
not dead, not dormant, not a god to awaken; it is a contractor mid-contract,
indifferent to you, and you can READ or DIVERT the project but not negotiate
with it. Status becomes `dormant-active`→ rename to **`active`** (busy,
non-communicative). This kills the "is it really dead / wake the god" cliché
(round 1's "is-it-really-dead" tag is the tell) and makes the hunt "collect the
work-orders to learn what it's building before it finishes." Resource stays
high (you compete with it for the same matter it's eating).

### P4 — generation-ship still hinges on ONE macro reveal (generativity).
Round 1 diversified the artifact substrate but the SEED is still "the aliens
are us." A world-gen that knows the punchline tends to retell it. Round 1 asked
me to verify variety BEFORE the reveal lands. The fix: make the seed's
generative engine the *specific* thing each colony buried AND why burying it was
defensible-or-monstrous — so even pre-reveal, world A is "they erased a war
crime," world B is "they erased a cure they couldn't share fairly," world C is
"they erased the location of where they came from because it's still hunting
them." The reveal ("it was us") becomes the FRAME, and the VARIABLE is the moral
weight of the secret — which drives different factions, different stakes,
different hunts per world. Re-wrote the hook + artifact_flavor to foreground the
variable, not the punchline.

### P5 — first-contact's "hunt" is still a gate, not a hunt.
Round 1 added "prove worthy to unlock the next tier." That is a permission
mechanic. A HUNT is find / earn / assemble a thing that exists in the world.
Sharpened: the withheld caches are REAL, LOCATABLE, and SCATTERED — the aliens
won't give you the map, so you triangulate cache locations from the lent gifts
(each gift is a clue to where a cache is AND a test of whether you'll be allowed
to keep it). Now it's a genuine find-and-earn hunt with a living gatekeeper,
not a dialogue tree.

### P6 — anti-collision sweep across artifact HUNTS (does each support find/earn/assemble?).
- first-contact: triangulate + earn scattered caches — YES (post-P5).
- bio: bond grown organs, assemble a symbiote-set that reconfigures you — YES.
- machine(active): collect scattered work-orders to read/divert the project — YES.
- time(ambiguous): assemble out-of-order anachronisms; later finds re-order
  earlier ones — YES, and it's a DIFFERENT hunt-shape (re-sequencing, not
  accumulation).
- absent-makers (new): pure xeno-archaeology — find the relics the gone makers
  left, follow them toward WHERE the makers went — YES.
- generation-ship: recover your own redacted record — YES (recovery hunt).
  Risk: "recover scattered records" is structurally similar to time-war's
  "assemble scattered finds." Differentiated: time-war finds CONTRADICT and
  re-order; generation-ship finds ACCUMULATE toward a moral reckoning. Different
  feel, flagged for round 3.

## Breadth check — do the 5 give real thematic range?

| Axis | Coverage after rewrite |
|---|---|
| Tone | wary-diplomacy / intimate body-horror / cold-indifferent-industrial / vertiginous-causality / lonely-archaeology / introspective-guilt — six distinct registers across five sets (two sets carry a secondary tone). |
| Scale | personal-relationship (first-contact) → planetary organism (bio) → galaxy-industrial (active machine) → causal/4D (time) → "where did a whole people GO" (absent) → one ship's history (gen-ship). Good spread. |
| Alien relationship | gatekeeper you negotiate with / parasite-partner you fuse with / indifferent contractor you can't talk to / combatant-out-of-time / GONE, only traces / it-was-us. Five genuinely different relationships. |
| What hunting FEELS like | triangulate-and-earn / bond-and-transform / collect-and-decode / re-sequence-and-reinterpret / track-the-departed / recover-and-reckon. No two hunts feel the same. |

This is real breadth. The weakest overlaps now are (a) gen-ship vs time-war
both being "assemble scattered finds" (mitigated by contradiction-vs-accumulation)
and (b) two sets carrying `subtle` psychic — acceptable but flat (see round-3
concerns).

## What I changed (round 2)

**Decision (clean):** stay at 5 sets. Final statuses are
living / living / active / ambiguous / absent. This delivers BOTH round-1
residuals (a true `absent` seed; a fresher status than `dormant`) without a 6th
set and without gutting any strong member.

1. **machine → `active`, mid-project, indifferent (P3).** Killed the
   dormant-AI-god / "is-it-really-dead" / wake-the-sleeping-god frame entirely.
   The machine civ never stopped; it is visibly executing a galaxy-scale project
   right now, indifferent to you. Status `dormant`→`active`. This is the fresher
   angle round 1 asked me to find.

2. **generation-ship reframed to deliver `absent` (P2/P4).** The MAKERS (the
   colonists' own ancestors) are gone — deliberately, by choice — so the
   present-day alien-civ status is `absent`, not `ancestral`. (`ancestral`
   described the relationship; `absent` describes the status the world-gen keys
   on. The relationship is captured in tags.) Generativity moved onto the moral
   WEIGHT of the specific buried secret, so worlds diverge before the "it was
   us" reveal lands, not just after.

3. **De-collided bio from #0 (P1, the biggest catch).** Cut "harvest the living
   planet's body, the whole feels it" — that was #0's spine. Re-anchored on the
   host/symbiote PARTNERSHIP: artifacts are grown organs you bond with, the
   resource you exploit is your own transformed bandwidth, not the organism's
   flesh. resource `core`→`moderate`.

4. **first-contact hunt sharpened to triangulate-and-earn (P5).** Withheld
   caches are real, locatable, scattered; lent gifts double as clues to cache
   locations AND tests of worthiness. A genuine hunt with a living gatekeeper,
   not a permission dialog.

5. **alien_status declared as a controlled vocabulary in `_note`** so the
   pipeline-enum mismatch (`fallen|extant` in `prompt-canon.md`) is intentional
   and documented, not accidental.

The two `living` sets are now JUSTIFIED, not merely tolerated: first-contact's
aliens are external PERSONS with agency you negotiate with (world-gen generates
a faction-with-agency); bio's "alien" is an ENVIRONMENT you are inside of
(world-gen generates a location-that-is-the-faction). Different generators,
different worlds.

## Round-2 final distribution

| Set | alien_status | psychic | resource | hunt-shape |
|---|---|---|---|---|
| first-contact-diplomacy | living | none | moderate | triangulate + earn scattered caches |
| bio-symbiosis-horror | living | overt | moderate | bond + assemble symbiote-set |
| machine-successor (active) | active | none | high | collect + decode work-orders |
| time-war | ambiguous | subtle | none | re-sequence contradictory finds |
| generation-ship-identity | absent | subtle | low | recover + reckon with own record |

Final statuses: living / living / active / ambiguous / absent — four distinct
values across five sets. Delivers the round-1-requested `absent` and the fresher
`active` (kills the `dormant` trope) without a sixth set or gutting a strong
member. The two `living` are justified (see "What I changed").
Resource bands: moderate / moderate / high / none / low — bio dropped from
`core` to moderate to de-collide from #0, so there are now two `moderate`; that
is an acceptable, deliberate trade (de-#0-collision > a perfectly-unique
resource band) and is flagged for round 3.

## Residual concerns for ROUND 3

1. **Two `living` sets persist.** Justified (negotiate-with-persons vs
   inside-an-organism), but round 3 should pressure-test whether world-gen
   actually generates non-sibling worlds from two `living` seeds, or whether the
   status field alone causes collision regardless of flavor. If it collides,
   push bio to a distinct status (e.g. `living` but `embedded`/`environmental`
   sub-tag).
2. **gen-ship vs time-war both "assemble scattered finds."** Mitigated
   (contradict-and-reorder vs accumulate-toward-reckoning) but it is the closest
   remaining hunt-shape pair. Round 3: confirm the contradiction mechanic in
   time-war is strong enough that no one mistakes it for gen-ship's recovery arc.
3. **Pipeline enum mismatch is documented but NOT resolved.** The seeds use
   living/active/ambiguous/absent/ancestral; `prompt-canon.md` only knows
   `fallen|extant` and hard-codes the resource-fall mystery + mandatory psychic.
   These seeds are a SPEC for pipeline work that doesn't exist yet. Round 3 (or
   an eng task) must decide: do the prompts get generalized to honor these
   statuses + non-fall mysteries, or are the seeds aspirational? As written, the
   pipeline would coerce all five back toward #0. This is the single biggest
   real-world risk and it is OUTSIDE the JSON's control.
4. **psychic axis still flat-ish** (none/overt/none/subtle/subtle). Range is
   used (good) but three sets are none-or-whisper. Acceptable per "not all
   psychic"; round 3 could give one more set a DISTINCT psychic register (e.g.
   machine's `active` project could be readable only via a non-biological,
   mathematical "psychic" — a different flavor of the power) if more variety is
   wanted. Deliberately left alone to avoid over-tuning.
5. **`active` machine indifference vs first-contact reactivity** are both
   "aliens with agency present now." Different (indifferent-industrial vs
   attentive-gatekeeper) but round 3 should verify they don't both generate
   "negotiate/interact with live aliens" worlds.
</content>
</invoke>
