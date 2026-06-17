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

- 2026-06-17: Adversarial round 1 (Opus subagent) — 1 FATAL, 4 HIGH, 2 MEDIUM,
  2 LOW. Stood up a REAL PGLite brain + activated the pack + ran the graph
  experiment (findings 01, 02) to resolve the FATAL finding empirically.
  Key correction (D2 revised): the typed graph is real/zero-LLM/multi-hop BUT
  edges are ENGINE-EMITTED via explicit `link` (add_link), NOT self-wired from
  prose wikilinks (DIR_PATTERN is VC-only). For a game this is better.
  DESIGN v2→v3: dropped find_contradictions/find_trajectory/whoknows as relied-on
  ops (they do other things); fixed compaction to be edge-safe (purge cascades
  through page_links); specified callback_strength formula + falsifiable
  blind-rater metric; honest re-cost (R1-08) → SQLite edges-table is the real
  ship deliverable, gbrain is an agent-REPL accelerator for the prototype.
  D-revised: recommendation is now GRADUATED, leaning toward "SQLite store is the
  artifact; gbrain validates fun cheaply."

- 2026-06-17: Adversarial round 2 (Opus) — 4 FATAL (compaction still broken,
  scorer hides hard problem in tension, lore GENERATION unspecified, determinism
  contradiction), 4 HIGH, mediums. Built + RAN the Director prototype end-to-end
  (findings 03/04) to ground the response. DESIGN v3→v4 with major changes:
  * NEW §5 Lore Generation: canon = structured FACTS; prose = deterministic
    render of facts; LLM = optional CACHED renderer, never author of canon.
    Resolves R2-05 (generation), R2-06 (determinism — Director keys off facts not
    prose), R2-01/R1-05 (compaction = drop prose bodies, keep facts/edges forever,
    never purge), and the old contradiction problem (structured canon can't
    self-contradict).
  * COMMITTED the recommendation (R2-07): build SQLite edges store as the durable
    artifact; gbrain is a ~1-week agent-REPL accelerator only. No more hedge.
  * Added §4 hunt-as-fun-loop: location uncertainty, expedition cost, rival-race
    clock, curse trade-off, fate choices that feed the scorer (R2-08).
  * tension made concrete (game sim-state in memory, no N+1; demo values
    illustrative) (R2-04). Arc state machine specified (R2-09). Save = journal +
    snapshot, not live PGLite dir (R2-10).
  * Fixed stale header (R2-11).
  Decision shift: the SQLite store is now THE deliverable; gbrain demoted to
  prototype accelerator. The lore-as-facts reframe is the strongest single
  contribution of the exploration.

- 2026-06-17: Adversarial round 3 (Opus) — 2 FATAL (prototype didn't reproduce
  from its own recipe; non-idempotent multi-tick), 4 HIGH (emergence not met,
  scorer unnormalized, formula mismatch, procgen hand-waved). Answered each by
  RUNNING code:
  * Fixed seed.sh to be self-contained (init+activate, no error-swallowing);
    re-verified 3.197 reproduces from a CLEAN brain (R3-01).
  * Built ship/storybrain.ts: self-contained SQLite store, 10-query catalog,
    Director tick at PARITY with gbrain (3.197) — finding 06. Proves the
    recommended ship path concretely.
  * Built ship/sim.ts: 5-tick NORMALIZED scorer (terms in [0,1], stable scale),
    top-K callback (finding 05 bug fix), valence implemented, arc single additive
    term (no double-count), repetition/fixation guards that engage; emergence demo
    (same myth, two colonies -> raid-iron vs raid-ash) — finding 07. Fixes
    R3-02/03/04/05.
  * DESIGN v4->v5: added §5.5 Emergence (combinatorial weave = Rimworld's model;
    content budget; procgen honestly costed as a separate large project); §5.4
    contradiction-scope honesty; normalized scorer spec; un-hedged recommendation
    (build SQLite first, gbrain optional/marginal); risks updated; flagged the
    blind-rater "is it fun" gate as the key UNRUN validation and lore-content
    pipeline as the friend's core open work.
  FINAL POSITION: store/graph/selection half is proven, small, portable
  (findings 01-07). The two things that decide the game — is it FUN (blind-rater
  gate) and can coherent lore be authored/generated at scale — are game-design +
  content, not substrate, and remain the friend's calls. The substrate won't block
  them.

- 2026-06-17: Sam (awake briefly) corrected course: DON'T ask permission to do the
  obvious next thing; and he wants a MODEL to generate facts (not hand-authored).
  Themes: sci-fi, advanced alien civs of different types, psychic powers, ancient
  mysteries, why-a-civilization-fell, resource exploitation gone TERRIBLY wrong.
  Built the model-driven fact generator (brainstorm spec + writing-plans-enhanced
  plan + TDD):
  * generator/schema.ts + .test.ts (6/6): validateWorld contract = the model↔store
    gate (edges→declared nodes; ≥3 facts/artifact; mystery fully covered).
  * prompt-canon.md + prompt-artifacts.md: staged generation prompts (portable to
    Anthropic API: opus seed, haiku artifacts).
  * An Opus subagent GENERATED world-scifi.json (34 nodes, 2 alien civ types —
    crystalline Velt + psychic-gestalt Choir, 5-fragment mystery: they mined a
    sleeping planet-organism's nerve-tissue; it woke in agony and killed them
    both). Validated first try.
  * load.ts: loads into SQLite, runs Director multi-tick, reconstructs the mystery
    (caused_by chain ✓). Surfaced + fixed a real feedback bug (Director's own
    involves-edges snowballing callback) — callback now counts STAKE edges only.
  Finding 08. The "model generates lore that drives story" headline is demonstrated
  end-to-end. This SUPERSEDES the v5 "hand-author first" suggestion per Sam's call.

- 2026-06-17: Built + ran the hybrid LLM->procgen->LLM pipeline + blind-judge
  experiment (Sam's request). Stage A (Haiku) seeds templates -> deterministic
  procgen.ts (seed 1337, 37-node history, 19 caused_by) -> Stage C (Opus) enriches
  -> hybrid-world.json (48 nodes). Pure-LLM baseline (Opus, no procgen, size-
  matched) -> pure-llm-world.json (49 nodes). TWO blind Opus judges with A/B
  SWAPPED (counterbalanced). RESULT: hybrid won BOTH (40-35, 41-39); aggregate
  hybrid 81 vs pure 74. Hybrid wins thematic richness (+4), novelty (+4), causal
  depth (+2), ties coherence; pure-LLM wins dramatic potential (+3, live human
  stakes). Finding 09. CONCLUSION: hybrid has real judge-visible value for deep
  consistent LORE (procgen=causal scale/consistency, LLM=meaning); pure-LLM's only
  win (live drama) is a fixable gap -> proposed Stage D for present-tense colony
  stakes. Limitations: n=2, single judge model (Opus self-preference risk),
  imperfect blinding (slug style), convergent premise. Honest claim: "hybrid adds
  value for lore depth," not "dominates." Next: Stage D + multi-seed cross-model
  judging.

- 2026-06-17 (session 2 cont.): Per Sam — (1) Stage D built (live colony stakes;
  finding 10) + Opus used for seed-gen (richer templates, 28 vs 19 caused_by);
  hybrid-v2-world.json closes the dramatic-potential gap from finding 09.
  (2) Built the 10-theme SAMPLE SET (#0 + 5 batch1 + 4 batch2), each new set
  through 3 adversarial Opus rounds. Psychic kept optional (4/10) per Sam's note.
  Breadth across status/psychic/resource/tone/order-meaning (SAMPLE-SET.md,
  finding 11). Key converged finding: the GENERATOR PROMPT (not the validator,
  which is theme-agnostic) coerces toward #0; generalize the mystery order_relation
  + reconstructFall to unlock all 10. Queued next: pipeline generalization +
  multi-seed cross-model blind re-judge.
