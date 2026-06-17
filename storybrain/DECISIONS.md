# StoryBrain — Decisions & Working Log

Running log of substantial decisions made autonomously during this exploration,
for Sam to review. Newest entries appended at the bottom of each section.

## Charter (from Sam, 2026-06-17)

- Explore gbrain (this fork) as basis for a Rimworld-style AI storyteller +
  lore-generator knowledgebase for a friend's game. Compare vs Karpathy's
  "llm wiki" flat-file pattern.
- Narrative is **emergent** (Sam's explicit note).
- **Artifacts** must be first-class: story/lore-driving McGuffins. The friend's
  headline mechanic is hunting artifacts that drop lore and drive the story.
- Process required: 5 rounds of self-review, then 3 rounds of adversarial review
  with Opus subagents, then commit, then autonomously execute interesting
  follow-up tasks and record all findings in persistent files. Commit+push
  frequently (ephemeral container). Wide latitude, no scope limits.

## Key decisions

- **D1: Storyteller = Director + World-Memory.** gbrain is the World-Memory; the
  Director is built by the game. Evaluating gbrain "as a storyteller" is a
  category error. (Foundational; tested in every review round.)
- **D2: Emergent ⇒ graph is mandatory.** Flat llm-wiki cannot answer relational
  questions at decision time; gbrain's zero-LLM self-wiring graph can. This is
  the core reason to prefer gbrain over the flat-wiki pattern for THIS game.
- **D3: Artifacts modeled as the story spine**, not an item system. The
  artifact → lore → event → artifact spiral is the primary narrative pump.
- **D4: Sidecar integration**, LLM kept out of the per-tick loop, local
  embeddings, PGLite dir = save state.
- **D5: Strip ~80% of gbrain** (auth, multi-user, skillpacks, eval, dream cron).
  ~12 of 136 ops needed.

## Log

- 2026-06-17: Wrote DESIGN.md v1. Surveyed gbrain (136 ops, schema-pack YAML
  format, self-wiring graph, relational retrieval, salience/anomaly/trajectory).
  Read Karpathy gist. Starting 5-round self-review.
