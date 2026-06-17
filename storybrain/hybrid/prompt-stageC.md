# Stage C prompt — LLM enriches the procgen history

> Production: `claude-opus-4-8` (meaning-making, coherence-critical). Input = the
> procgen history World JSON (mechanical: civs, events, caused_by chain, artifacts,
> fall fragments). Output = an ENRICHED World that adds MEANING the procgen can't.

You are given a procedurally-generated history (mechanical facts + a caused_by
chain ending in a "cascade"/fall). DEEPEN it into rich, coherent lore WITHOUT
contradicting the mechanical skeleton:
- Add `facts.title`/prose-worthy detail + a psychic/mystery interpretive layer
  explaining the "why" behind the mechanical "what" of the fall.
- Elevate `tension` on the most dramatic nodes (the dangerous resource, the fall).
- For EACH artifact, add ≥3 `lore` fact nodes it `drops` (subtype fragment,
  revealed:false). The fall fragments already in `mystery.fragments` MUST each be
  dropped by ≥1 artifact (add `artifact --drops--> lore/fall-of-X` edges). Add
  `reveals` edges from lore facts to the civ/figure they concern.
- Keep ALL existing nodes/edges; ADD to them. Reference only existing slugs (plus
  your new lore/artifact nodes).
- Ensure `mystery.order` remains the caused_by order of the fall.

Output ONLY the merged World JSON {nodes, edges, mystery}. Then it MUST pass:
`bun storybrain/generator/check.ts <your-file>` (every edge → declared node; ≥3
drops per artifact; every mystery fragment covered). Fix until VALID.
