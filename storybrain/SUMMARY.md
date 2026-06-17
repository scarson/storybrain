# StoryBrain — wake-up brief

What I did overnight, the bottom line, and what's left. Full detail in `DESIGN.md`
(read §0, §4.1, §5, §5.5, §6) and `findings/`.

## The question
Can gbrain (this fork) be the basis for a Rimworld-style AI **storyteller + lore
generator** for your friend's game — emergent narrative, **artifact-hunting that
drops lore** as the headline mechanic — vs. Karpathy's flat "llm wiki"?

## The answer (one line)
**Yes, the model works — but build it on a tiny SQLite `edges` store, not on
gbrain.** A storyteller = a *Director* (picks events; you build it) + a
*World-Memory* (a typed-edge graph; small and portable). The flat wiki can't
answer the relational "who holds a grudge against the raiders who just appeared"
questions emergence needs; a typed graph can. gbrain's one special feature
(prose→graph auto-wiring) turned out **not to work for game data anyway**
(hardcoded to its creator's VC domain), so its only residual value is a ~1-week
"explore by talking to an agent" REPL — marginal. **Start with the SQLite store.**

## What I actually proved (not asserted — I stood up a live brain and ran code)
- Schema pack validates + activates against real gbrain (finding 01).
- Typed graph works: custom verbs, multi-hop, zero-LLM — via **explicit edge
  writes**, not prose wikilinks (finding 02, resolved a FATAL review finding).
- A **Director tick runs end-to-end** and picks coherently: an arc-aligned raid
  scores 3.197 vs a no-history disaster 0.210 (finding 03).
- Scale: traversal cost is fixed overhead, not graph size (finding 04).
- Found + fixed a **real scorer bug** (volume-domination) via a perturbation test;
  proved the pick is input-driven, not a rigged demo (finding 05).
- The **SQLite ship store** reproduces gbrain's exact pick (3.197) in ~200 lines,
  zero gbrain (finding 06) — the recommendation, made concrete.
- A **5-tick sim** shows the normalized scorer + anti-treadmill guards, and
  **emergence**: the same artifact myth tells a different story in two different
  colonies (finding 07).

## The best idea that came out of it
**Lore = a structured fact-skeleton revealed progressively; prose is rendered
deterministically from facts; the LLM is an optional cached renderer, never the
author of canon** (§5). This makes "artifacts drop lore" coherent, cheap,
deterministic, save-safe — and makes emergence the *combinatorial weave* of
authored myth × emergent colony chronicle, which is exactly how Rimworld's own
emergence works (§5.5). Eight artifact archetypes (weapon-relic, shard-set, lost
codex, cursed idol, key/map, faction heirloom, living relic, prophecy-object) are
catalogued in §4.1 — "various sorts," as you asked.

## What's genuinely still open (the friend's calls, not substrate)
1. **Is it FUN?** The blind-rater gate (§6) is the make-or-break test and is still
   UNRUN — needs a richer world + human raters.
2. **How the game stamps `tension`** — the scorer is only as good as this.
3. **The lore-content pipeline** — hand-author ~150–250 facts first (§5.5 budget);
   procgen (DF-legends) is a real, separate, large project to attempt only after
   hand-authored proves fun.

## Process / housekeeping
- 5 self-review rounds + **3 adversarial Opus rounds** (each found real problems
  and drove a revision; records in `reviews/`). Decision trail in `DECISIONS.md`.
- Committed + pushed after every unit (ephemeral container) — ~15 commits.
- Installed `superpowers` + your `agent-skills` plugins (project scope, persisted
  via `.claude/settings.json`); `/brainstorming` + `/writing-plans-enhanced` will
  be live next session. I applied their methodology and self-answered (you were
  asleep), per your instruction.

## If you want me to keep going
The obvious next task is #1 above: build a richer multi-tick world and actually run
the blind-rater "is it fun" experiment — the one thing the outside-in analysis
can't settle.
</content>
