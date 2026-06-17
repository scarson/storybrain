# Stage D prompt — LLM injects LIVE, present-tense colony stakes

> Production: `claude-opus-4-8`. Closes the one gap pure-LLM beat the hybrid on
> (finding 09: "dramatic potential" — live human stakes vs a post-mortem history).
> Input = the enriched hybrid World (deep history + mystery). Output = same World
> PLUS a present-day playable layer.

The given World is a deep, consistent HISTORY (the alien civs and why they fell)
with rich lore. It reads as a post-mortem. ADD a present-tense layer that makes it
a live game seed, WITHOUT contradicting or removing anything:

- **Named human colonists** (3-5 `colonist` nodes, facts.skills) who are HERE NOW,
  drilling/surveying toward the ancient danger.
- **An OPEN arc** (`arc` node, facts.phase = "rising" or "climax",
  next_beat_kind/next_beat_faction) that is UNRESOLVED — the present threat the
  Director steers toward (e.g. the buried danger stirring, a rival faction racing
  for an artifact, the first colonist touched by the old psychic wound).
- **Present-day stakes as edges**: colonists with `rival_of`/`betrayed_by` to a
  live faction; a colonist who `owns`/`sought_by` over an artifact; `involves`
  edges from a couple of recent present-day `event` nodes (high tension, recent day).
- Tie the live stakes to the EXISTING mystery/artifacts (the colony is about to
  repeat the ancient mistake; an artifact the colony holds is `sought_by` a live
  faction) — so the deep lore PAYS OFF in present drama.

Keep ALL existing nodes/edges; ADD only. Reference existing slugs + your new ones.
Output ONLY the merged World JSON. MUST pass
`bun storybrain/generator/check.ts <file>`.
