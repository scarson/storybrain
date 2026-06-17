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

- 2026-06-17: Completed 5-round self-review (game-designer, systems-engineer,
  narrative-director, skeptic, player/QA). Findings in reviews/self-review.md.
  DESIGN v1→v2. Biggest reframe (R4): PHASE-SPLIT recommendation — gbrain for
  prototype+reference-impl, embedded SQLite/libSQL store for ship (specified by
  a 10-query Query Catalog). Added: arcs-as-attractors w/ lifecycle, valence,
  rumor/foreshadow, player-choice fate edges, graph+BM25-first (vector scoped),
  async batched writes + durable journal, chapter compaction,
  find_contradictions for lore, cold-start + fixation guards, modding via packs.
  Next: 3 rounds adversarial Opus review.

## Plugin install (Sam's mid-run request, 2026-06-17)

- Installed at PROJECT scope via `claude plugin`: marketplaces `superpowers-dev`
  (obra/superpowers) + `scarson-agent-skills` (scarson/agent-skills); plugins
  `superpowers`, `project-setup`, `superpowers-plus`, `utility`.
- NOTE: `.claude/settings.json` is gitignored by the upstream gbrain repo. Sam
  asked for persistence across container restarts, which requires the project
  settings to be committed, so I **force-added** `.claude/settings.json`
  (`git add -f`). On a fresh container, the committed `extraKnownMarketplaces` +
  `enabledPlugins` drive Claude Code to re-clone the marketplaces and re-enable
  the plugins. If you'd rather not track this file, `git rm --cached
  .claude/settings.json` and re-add the gitignore — but then plugins won't
  auto-restore on restart.
- Per Sam's instruction: use /writing-plans-enhanced for plans and /brainstorming
  to think through ideas, but ANSWER ALL QUESTIONS MYSELF (no AskUserQuestion —
  Sam is asleep; blocking would stall everything).
