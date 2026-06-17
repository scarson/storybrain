# Stage C+D prompt (v2) — CLOTHE the abstract procgen skeleton

> Production: claude-opus-4-8. Input = an ABSTRACT skeleton from
> procgen-abstract.ts: themed entities + a dense dated caused_by event topology +
> a neutral CLIMAX + mystery fragments chained in the theme's order_relation. The
> skeleton has NO fates, NO theme labels — events carry facts.abstract_kind +
> facts.placeholder:true, fragments are named thread-of-<entity>, the climax is a
> neutral "turn". Your job: turn this consistent scaffold into a rich, fully
> in-fiction world. The scaffold gives you causal CONSISTENCY for free; you supply
> MEANING.

Rules:
- RENAME every placeholder node to concrete, theme-specific content: rewrite each
  event's facts into a real titled beat, rename each `lore/thread-of-X` fragment to
  real lore, rename the climax to the theme's culminating moment. REMOVE every
  `placeholder`, `abstract_kind`, `magnitude` scaffold field. NO scaffold/meta
  words may survive (no "abstract", "placeholder", "thread-of", "epoch", "procgen",
  "skeleton", "scaffold", "momentum", "climax" as literal text in shipped facts).
- SET each entity's status/fate PER THEME (controlled vocab: living | active |
  ambiguous | absent | hidden | dormant | extinct | ancestral). The climax-
  `involved_in` entities are the load-bearing ones — decide what the climax MEANT
  for each (departed / transformed / sealed / ascended / sundered / fell / …),
  consistent with the theme's alien_status. Do NOT default to "fallen".
- PRUNE ruthlessly: DELETE any skeleton event/node that doesn't earn a place in the
  finished story (inert filler is the #1 thing that loses). Keep the causal spine;
  drop the chaff. Fewer, meaningful nodes beat many hollow ones.
- ARTIFACTS: add 5-8 hunt-able artifacts (varied archetypes per the theme's
  artifact_flavor); each `drops` >=3 `lore` facts; every mystery fragment must be
  dropped by >=1 artifact. Add `reveals` edges from lore to the entity/figure it
  concerns. Keep mystery.order + mystery.order_relation.
- STAGE D (live layer): add 3-5 named human `colonist` nodes present now, one OPEN
  `arc` (phase rising|climax, next_beat_*), and present-tense stake edges
  (rival_of/betrayed_by/owns/sought_by/threatens) tying colonists+factions+
  artifacts into a live, unresolved crisis that PAYS OFF the deep history.
- Reference only declared slugs (+ your new ones). Output ONLY the merged World
  JSON. MUST pass `bun storybrain/generator/check.ts <file>`.
