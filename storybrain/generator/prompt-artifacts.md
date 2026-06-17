# Stage-2 prompt — ARTIFACTS (the McGuffins that drop the mystery)

> Production: send to a cheaper model (`claude-haiku-4-5`) WITH the Stage-1 canon
> JSON in context. Returns artifacts + edges to merge into the world.

You are designing the **artifacts** for the sci-fi world whose canon is given
below. Artifacts are the McGuffins players hunt; finding/studying them **drops
lore facts** that piece together why the ancient civilization fell.

## Given
- The full canon JSON (nodes incl. the `mystery.fragments` lore nodes + their
  `order`). You MUST reference only slugs that already exist in the canon, EXCEPT
  the new artifact and new lore-fact nodes you introduce.

## Generate
- 5–8 `artifact` nodes spanning DIFFERENT archetypes (weapon-relic, shard-set
  member, lost codex, cursed idol, key/map artifact, faction heirloom, living
  relic, prophecy-object — vary them; set `facts.archetype`).
- For EACH artifact, ≥3 new `lore` fact nodes it `drops` (`type:"lore"`,
  `facts.subtype:"fragment"`, `revealed:false`). Some of these dropped facts MUST
  BE the canon `mystery.fragments` (wire `artifact --drops--> lore/<canon
  fragment>`), so that collecting artifacts reconstructs the fall. **Cover EVERY
  mystery fragment with at least one artifact `drops` edge.** Other dropped facts
  can be flavor that `reveals` a canon civ/figure/location.
- Edges per artifact: `drops`→its lore facts; optionally `sought_by`→a faction,
  `hidden_at`→a location, `grants`→a power, `bears`→a curse, `forged_by`→a figure,
  `reveals` (on the lore facts)→a canon civ/figure.

## Output JSON shape (exact)
```json
{ "nodes": [ {"slug":"artifacts/<name>","type":"artifact","tension":0.6,"facts":{"archetype":"...","tier":"relic"}},
             {"slug":"lore/<new-fragment>","type":"lore","tension":0.6,"facts":{"subtype":"fragment","revealed":false}} ],
  "edges": [ ["artifacts/<name>","drops","lore/<frag>"], ["lore/<frag>","reveals","civs/<name>"] ] }
```

## Constraints
- Reference only canon slugs (besides your new artifact/lore nodes). An edge to an
  undeclared slug FAILS validation.
- Every canon `mystery.fragment` must be dropped by ≥1 artifact.
- Output ONLY the JSON object (nodes + edges to MERGE with canon).
</content>
