# Stage E — CHARACTERS & POLISH pass

> Production: claude-opus-4-8. Input = a finished world (hybrid or pure). Deepens
> the CAST and fixes quality nits, WITHOUT changing the mystery/artifact spine.
> Gate: must pass BOTH `generator/check.ts` (loadability) AND
> `generator/character-lint.ts` (character depth + polish).

The corpus analysis found characters under-developed: no skills, a thin
colonist<->colonist social graph, no named alien characters, and some quality
nits. Fix all of that ADDITIVELY (keep the mystery, artifacts, factions, arc):

1. SKILLS + WANT on every `colonist`: add `facts.skills` (a small map, e.g.
   {shooting, medicine, social, research, crafting, melee} with 0-20 levels + 1-2
   `passions`) and a `facts.want` (a concrete present-tense goal). Rimworld-style.
2. DENSE SOCIAL GRAPH: add colonist<->colonist relationship edges so density is
   >=1.0 per colonist — `kin_of`, `rival_of`, `lover_of`, `ally_of`, `owes`,
   `grudge_against`. Make them specific and story-bearing (a debt, a betrayal, a
   sibling, a romance), not random. These are the emergent-drama fuel.
3. NAMED ALIEN CHARACTERS: add 1-2 individual `colonist`-type figures belonging to
   an alien faction (set `facts.faction` to the alien civ slug + `facts.species:
   "alien"`) — an emissary, a defector, a last sleeper, a recorded voice — and wire
   at least one cross-species relationship edge (ally/rival/owes) to a human.
4. POLISH: fix lore over-spread (no fragment dropped by >3 artifacts — rewire so
   each fragment has 1-2 clear droppers), and fix malformed/inverted edges (no
   `X owns a faction`, no object-as-subject of a person-verb, consistent slug
   prefixes like `locations/` `events/`).

Keep mystery.order + order_relation + every existing artifact/faction/arc. Add only.
Output ONLY the merged World JSON. MUST pass BOTH:
`bun storybrain/generator/check.ts <file>` AND
`bun storybrain/generator/character-lint.ts <file>`.

## Skill profiles — pick the set that fits the world's FRAME (not Rimworld everywhere)

Skills must match the premise. Choose per world; mixed casts may blend.

- **SHIP-CREW / EXPEDITION profile** (spacefaring, salvage, survey, generation-ship,
  merchant, explorers): use crew axes — `piloting`, `navigation`, `engineering`,
  `sensors`, `gunnery`, `life_support`, `eva`, `xeno` (xenolinguistics/xenology),
  `command`. (~6 per colonist, role-fitted: a pilot high `piloting`, a translator
  high `xeno`.) Stamp `facts.crew_role` (pilot/engineer/navigator/gunner/medic/
  envoy/quartermaster/captain…).
- **COLONIST / SETTLER profile** (planetside homestead/colony — Rimworld-weighted):
  `medicine`, `research`, `social`, `construction`, `growing`, `crafting`, `combat`.
  Stamp `facts.colony_role`.

Per-theme default frame (override if a world's fiction clearly differs):
ship-crew → first-contact, machine-successor, time-war, generation-ship-identity,
megastructure-absent-architects, crowded-trade-federation.
colonist → the-living-marrow, bio-symbiosis-horror, extinction-plague-vector,
uplift-nursery-world.
Always set `facts.skill_profile: "ship-crew" | "colonist" | "mixed"` so it's explicit.

## Richer character relationships + ancestral/secondhand ties (v2)

Beyond kin/rival/lover/ally/owes/grudge, use these DIRECTIONAL relationship verbs
where they fit the cast (they power secondhand artifact bonds):
`mentor_of`/`mentored_by`, `role_model_of`/`reveres`, `protege_of`,
`predecessor_of`/`successor_of` (held the same post/role), `ancestor_of`/
`descendant_of` (explicit lineage), `commands`/`served`, `estranged_from`.

And seed SECONDHAND chains: give a few **forebears/mentors/predecessors/dead-lovers
a relationship to a specific artifact** (`forged`/`owned`/`wielded`/`died_for`/
`covets`/`sealed` → an artifact), so a living character inherits a bond THROUGH
them (their ancestor forged it → they're heir_to it; their mentor died for it →
they must_finish it; their rival's people made it → they spite it). The chain must
be real (C→P social tie + P→artifact tie); never assert a secondhand bond without
both links present.
