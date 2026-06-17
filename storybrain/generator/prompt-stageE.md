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
