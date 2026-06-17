# Generalized theme-driven world prompt (replaces #0-hardcoded prompt-canon.md)

> Production: `claude-opus-4-8` (seed/canon) or per-stage. Parameterized by a TAG
> SET from storybrain/tagsets/*.json. Generates a world honoring the set's
> alien_status, optional psychic, and — critically — its mystery ORDER RELATION
> (the spine), NOT a forced resource-fall. validateWorld stays the contract.

INPUTS (from the tag set): id, hook, tags, alien_status, psychic, resource_centrality,
artifact_flavor, and the spine's order_relation + meaning.

Generate a World JSON { nodes, edges, mystery } where:

- **Alien civilization(s)** match the set's `alien_status` exactly — `living`
  (present, agency now), `active` (operating, indifferent), `dormant` (sleeping,
  wakeable), `absent` (makers gone, no corpse), `hidden` (present, unseen),
  `ambiguous` (alive-or-dead undecided), `extinct`/`fallen`, or `ancestral`. Do NOT
  force a fall unless the status says so.
- **Psychic** only if `psychic` ≠ "none". If "none", no psychic powers at all
  (vary the corpus — most sets are none).
- **Resource** presence scaled to `resource_centrality` (none→core). Only make the
  resource the story spine if centrality is high/core.
- **The mystery is a chain of `lore` fragments linked by the set's
  `order_relation`** (`caused_by` death-chain | `enables` purpose-build |
  `prerequisite` containment-recipe | `precedes` provenance | `reveals`), and its
  reconstruction MEANS the spine (where-they-went / what-it's-for / how-to-contain
  / true-provenance / it-was-us), NOT necessarily a fall. Stamp
  `mystery.order_relation`. `mystery.order` is the reconstruction sequence.
- **Artifacts** (5-8, varied archetypes per the set's artifact_flavor) are
  hunt-able; each `drops` ≥3 `lore` facts; every `mystery.fragment` is dropped by
  ≥1 artifact (validateWorld requirement). Add `reveals` edges from lore to the
  civ/figure/structure concerned.
- Use storybrain slugs + link verbs. Output ONLY the JSON. MUST pass
  `bun storybrain/generator/check.ts <file>`.
