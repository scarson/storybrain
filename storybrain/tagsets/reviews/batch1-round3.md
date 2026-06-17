# batch1.json — Round 3 adversarial review (FINAL)

Reviewer posture: hostile. ROUND 3 of 3 — finalize and leave shippable.
Purpose of artifact: SEEDS for a sci-fi world-gen pipeline meant to produce
DIVERSE worlds. Pillars: artifact-hunting (story driver), alien civilizations
(need NOT be fallen), resource discovery/exploitation. Every set: sci-fi +
artifacts + alien civ. Resources good but not universal. Psychic optional, not
all. Distinct from each other and from theme #0 (fallen-civ /
resource-exploitation-gone-wrong / overt-psychic / piece-together-the-fall).

## Verifying round-2's fixes held

Round 2's intended changes ARE present in the file this round (machine→`active`,
gen-ship→`absent`, bio de-collided from #0 and dropped to `moderate`,
first-contact sharpened to triangulate-and-earn, `_note` carrying the
controlled status vocabulary + the pipeline caveat). All held. Confirmed
against the live file and a JSON parse.

| Round-2 fix | Held? | Notes |
|---|---|---|
| machine → `active`, mid-project, indifferent; dormant-AI-god killed | YES | status `active`; "is-it-really-dead"/"dormant AI" framing gone; "von Neumann project", "active megastructure", "no-negotiation" tags. |
| gen-ship → `absent` (makers gone by choice); generativity on the secret's moral weight | YES | status `absent`; hook foregrounds WHAT-was-buried + defensible-or-monstrous; "it was us" is the frame, not the variable. |
| bio de-collided from #0; resource `core`→`moderate` | YES | "harvest the body, the whole feels it" cut; re-anchored on host/symbiote bonding + grown organs; cost paid in self, not the organism's flesh. |
| first-contact hunt → triangulate-and-earn | YES | gifts double as encoded clues to scattered, locatable, sealed caches. |
| `_note` declares status controlled vocabulary + pipeline mismatch | YES | full vocab (living/active/ambiguous/absent/fallen) + resource bands + the spec-not-conforming note. |

## I read the pipeline down to the schema. The enum mismatch is a HARD fail, not prose.

Round 2 read the prompts; I verified against `schema.ts` + `check.ts` +
`load.ts`. The contract is stricter than "the prompt prefers fallen":

- `World.mystery = { fragments: string[]; order: string[] }` — the TYPE itself is
  "the why-it-fell chain." There is no other mystery shape the loader models.
- `validateWorld()` HARD-FAILS unless every `artifact` drops ≥3 `lore` fragments
  AND those fragments form a `caused_by` permutation in `mystery.order`
  (cause → escalation → point-of-no-return → collapse). `check.ts` exits nonzero;
  `load.ts` refuses to load on violation.
- `prompt-canon.md` mandates `status:"fallen|extant"`, a MANDATORY psychic power
  tied to a civ, and "the spine of the fall is resource exploitation gone wrong."

Consequence: as the pipeline stands today, ALL FIVE seeds would be coerced back
toward #0 — the validator rejects any world that isn't a linear resource-fall
autopsy, and the canon prompt forces `fallen|extant` + a mandatory psychic.
The seeds are therefore a SPEC for pipeline generalization that does not yet
exist:
  1. a status enum beyond `fallen|extant` (living/active/ambiguous/absent),
  2. non-linear / unresolved / introspective `mystery` shapes (time-war can't be
     a `caused_by` chain; gen-ship's mystery is a moral verdict, not a collapse;
     machine's is an in-progress plan, not a past fall),
  3. psychic made genuinely OPTIONAL (three of the five are none/none — the canon
     prompt currently requires a psychic power that matters).

The `_note` states this plainly, so a reviewer/eng is not surprised. This is the
single biggest real-world shippability risk and it is OUTSIDE the JSON's control
— it is downstream eng work, correctly tracked rather than hidden.

## Fresh hostile pass — problems found & resolved THIS round

### R3-1 — Two `living` sets had no NON-PROSE discriminator (round-2 residual #1).
first-contact and bio both carry bare `alien_status: "living"`. The prose
distinction (external persons-with-agency vs an environment-you're-inside-of) is
strong, but a status-keyed pipeline reads the field and the tags first, the prose
last. If the only signal is `living/living`, world-gen risks generating two
"interact-with-live-aliens" worlds. FIX (applied): added a load-bearing tag to
each — first-contact gets `"alien persons with agency"`, bio gets
`"alien-as-environment"` — so the discriminator survives even if prose is
ignored. The two `living` are now justified AND machine-readable-distinct.
Residual: still two bare `living` values; if a future pipeline keys ONLY on
`alien_status` and ignores tags, push bio to a distinct sub-status. Flagged, not
fatal.

### R3-2 — Two `subtle` psychic registers were the same undifferentiated whisper (round-2 residual #4).
time-war and gen-ship both said `psychic: "subtle"` with no flavor. A flat axis.
FIX (applied): made them DIFFERENT KINDS. time-war's subtle is PRECOGNITIVE
(relics leak memory-of-the-FUTURE; tag `precognition`); gen-ship's subtle is
INHERITED ancestral memory (relics bleed recollections of the PAST makers; tag
`ancestral memory`). Past-vs-future is a real register split, and it reinforces
the hunt-shape contrast (R3-3). The axis now reads none / overt / none /
precognitive-subtle / ancestral-subtle — varied without bolting overt psychic
onto sets where it doesn't belong (machine stays cold/`none` on purpose; that is
the point of the set).

### R3-3 — gen-ship vs time-war "assemble scattered finds" overlap (round-2 residual #2).
Confirmed the contradiction mechanic is strong enough. time-war finds CONTRADICT
and RE-SEQUENCE (the picture inverts under you); gen-ship finds ACCUMULATE toward
a fixed moral verdict. Both sets now explicitly cross-reference each other in
`distinct_from_siblings`, and the psychic split (future-leak vs past-bleed)
double-marks the divergence. No one will mistake re-sequence-and-reinterpret for
recover-and-reckon. Resolved.

### R3-4 — `active` machine vs `living` first-contact, both "agency present now" (round-2 residual #5).
Verified non-colliding. machine is INDIFFERENT-industrial, explicitly
`"no-negotiation"` / `"will never notice you unless you get in the way"`;
first-contact is an ATTENTIVE gatekeeper that vets and reacts to every move. One
generates a megastructure-you-race; the other a faction-you-court. Different
generators, different worlds. No change needed.

### R3-5 — Final cliché / artifact-hunt-support sweep (fresh).
- first-contact: triangulate caches from gift-clues, earn the open — concrete,
  locatable, find/earn. Supports a HUNT. No cliché (living gatekeeper as
  clue-giver is fresh, not "loot the precursor vault").
- bio: hunt grown organs, bond, assemble a set that reconfigures you — concrete
  find + assemble. Symbiote-horror is a known register but the artifact-as-organ
  + cost-paid-in-self framing keeps it off the Zerg/flood-cliché and off #0.
- machine: collect scattered work-orders, decode an in-progress plan, race the
  finish — concrete, and the active-contractor framing is the fresh angle that
  dodges the dormant-AI-god trope round 1/2 fought.
- time-war: re-sequence contradictory anachronisms — the only non-linear hunt;
  hardest to render in the current pipeline (see enum section) but the strongest
  anti-#0 seed conceptually.
- gen-ship: recover own redacted record, accumulate toward a moral verdict — the
  generative variable (moral weight of the secret) keeps it from retelling one
  punchline. "It was us" is a known twist but it's the FRAME, not the variable.

No remaining abstract/weak `artifact_flavor`: all five name concrete object
classes you can find, and a hunt VERB (triangulate / bond+assemble /
collect+decode / re-sequence / recover+reckon). Each verb is distinct.

## Breadth confirmation — do the 5 deliver real range?

| Axis | Coverage |
|---|---|
| alien_status | living / living / active / ambiguous / absent — four distinct values; the two `living` are tag-discriminated (persons vs environment). |
| psychic | none / overt / none / precognitive-subtle / ancestral-subtle — range used, NOT all psychic, and the two subtles are different kinds (future vs past). |
| resource_centrality | moderate / moderate / high / none / low — two `moderate` (bio dropped from `core` to de-#0-collide; a deliberate, correct trade). Full spread otherwise. |
| tone | wary-diplomacy / intimate body-horror / cold-indifferent-industrial / vertiginous-causality / introspective-guilt — five distinct registers. |
| scale | personal relationship → planetary organism-you're-inside → galaxy-industrial → causal/4D → one ship's buried history. Wide. |
| alien relationship | gatekeeper-you-court / parasite-partner-you-fuse-with / indifferent-contractor / combatant-out-of-time / it-was-us-and-they're-gone. Five genuinely different. |
| hunt-shape | triangulate-and-earn / bond-and-assemble / collect-and-decode / re-sequence-and-reinterpret / recover-and-reckon. No two the same. |

This is real breadth on every axis. The two soft spots (two `living`, two
`moderate`) are each a DELIBERATE trade with a documented reason (machine-readable
tag discrimination; de-#0 de-collision), not laziness.

## FINAL STATE

Per-set one-liner:

- **first-contact-diplomacy ("The Ones Still Watching")** — living alien persons
  vet humanity; you triangulate sealed caches from their lent gift-clues and earn
  the right to open them. A find/earn hunt under a live gatekeeper.
- **bio-symbiosis-horror ("The Green Cathedral")** — a living alien biosphere
  whose artifacts are grown organs you bond into yourself; assembling the set
  rewrites who you are. Cost paid in self, not in the organism's flesh (de-#0).
- **machine-successor ("The Work Is Not Finished")** — a von Neumann machine civ,
  never stopped, mid-build on a galaxy-scale project, indifferent to you; collect
  and decode its scattered work-orders to read or divert the plan before it ends.
- **time-war ("Objects Out of Order")** — an alien civ that fought through time;
  its anachronistic relics arrive out of order and CONTRADICT each other, so the
  hunt is re-sequencing, and every find can invert what the earlier ones meant.
- **generation-ship-identity ("We Were the Aliens")** — the absent makers were
  us; recovering the colony's redacted relics accumulates toward a moral verdict
  on what the ancestors chose to bury, with the secret's moral weight varying per
  world.

Breadth matrix (status / psychic / resource / tone):

| Set | alien_status | psychic | resource | tone |
|---|---|---|---|---|
| first-contact-diplomacy | living | none | moderate | wary diplomacy |
| bio-symbiosis-horror | living | overt | moderate | intimate body-horror |
| machine-successor | active | none | high | cold indifferent-industrial |
| time-war | ambiguous | subtle (precognitive) | none | vertiginous causality |
| generation-ship-identity | absent | subtle (ancestral) | low | introspective guilt |

## Residual caveats (honest, for the record)

1. **PIPELINE MISMATCH is the real risk and it's downstream.** The current
   generator (`prompt-canon.md` + `schema.ts`'s `validateWorld`) hard-codes
   `fallen|extant`, a mandatory psychic, and a linear `caused_by` fall mystery
   that the validator ENFORCES. Until the prompts + schema are generalized to
   honor these statuses and non-fall mystery shapes, the pipeline coerces all
   five seeds back toward #0. The seeds are a correct SPEC; the eng work to honor
   them does not exist yet. Documented in `_note`. This is the only thing between
   "shippable seeds" and "shippable worlds."
2. **Two `living` values** persist (tag-discriminated, justified). Safe unless a
   future pipeline keys ONLY on `alien_status` and ignores tags — then bio needs
   a distinct sub-status.
3. **Two `moderate` resource values** (first-contact, bio) — deliberate (bio
   dropped from `core` to escape #0's strip-mine spine). The right trade.

Verdict: the JSON itself is finalized and shippable. The breadth is real and
documented. The one unresolved item is pipeline eng work, which is out of scope
for the seed file and is explicitly flagged in `_note`.
