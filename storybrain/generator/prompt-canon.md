# Stage-1 prompt — CANON SEED (the world bible)

> Production: send as a single message to an Opus-class model (`claude-opus-4-8`).
> Returns the authoritative world bible the artifact stage references.

You are the lore architect for an emergent sci-fi colony game. Generate the
authoritative **canon** for one world as STRICT JSON (no prose outside JSON).

## Setting (mandatory themes)
- Humans (recent arrivals) discovering **advanced alien civilization(s) of
  genuinely DIFFERENT types** — generate at least TWO distinct alien civ types
  (e.g. a hive-mind, a machine-intelligence, a psychic-gestalt, a crystalline
  slow-life — pick distinct ones, each with a different `alien_type`).
- **Psychic powers** exist and matter (a `power` or `belief` tied to a civ).
- An **ancient mystery**: a once-great civilization **fell**. The spine of the
  fall is **resource exploitation gone wrong — terribly wrong** (over-extraction
  of something that should not have been touched; a cascade no one stopped).
- The fall is **piece-able**: decompose it into an ORDERED chain of 4–6
  "mystery-fragment" facts (cause → escalation → point-of-no-return → collapse).

## Output JSON shape (exact)
```json
{
  "nodes": [
    {"slug":"factions/humans","type":"faction","tension":0.4,"facts":{}},
    {"slug":"civs/<name>","type":"faction","tension":0.6,"facts":{"alien_type":"<distinct type>","status":"fallen|extant"}},
    {"slug":"figures/<name>","type":"colonist","facts":{"role":"..."}},
    {"slug":"locations/<name>","type":"location","facts":{}},
    {"slug":"powers/<name>","type":"power","tension":0.5,"facts":{}},
    {"slug":"lore/<fall-fragment>","type":"lore","tension":0.7,"facts":{"subtype":"fragment","revealed":false,"role":"cause|escalation|point-of-no-return|collapse"}}
  ],
  "edges": [ ["civs/<name>","worships","powers/<name>"], ["lore/<frag>","caused_by","lore/<earlier-frag>"] ],
  "mystery": { "fragments": ["lore/<frag1>","lore/<frag2>","..."], "order": ["lore/<frag1>","lore/<frag2>","..."] }
}
```

## Constraints
- Use the storybrain slug convention `type-dir/kebab-name`.
- Node `type` ∈ {faction, colonist, location, power, curse, belief, lore, event}.
  (Alien civilizations are `faction` with `facts.alien_type`.)
- The mystery-fragment `lore` nodes form a `caused_by` chain in `order`
  (fragment[i] `caused_by` fragment[i-1]). All start `revealed:false`.
- `tension` ∈ [0,1]; fall-related nodes skew high (0.6–0.9).
- DO NOT generate artifacts here (Stage 2 does). Generate ~12–18 canon nodes.
- Output ONLY the JSON object.
</content>
