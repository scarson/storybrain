# StoryBrain — exploration index

Can **gbrain** (this fork) be the basis for a **Rimworld-style AI storyteller +
lore generator** for a friend's game, with **artifact-hunting that drops lore** as
the headline mechanic and **emergent** narrative? This directory is the worked
answer: a design, three adversarial review rounds, and a **working prototype run
against a live brain** that found and fixed real bugs.

> TL;DR (current, v4→v5): **Yes, the model works — but build it on a small SQLite
> `edges` store, not gbrain.** gbrain's one hard-to-copy feature (prose→graph
> extraction) doesn't work for game namespaces anyway; use gbrain as a ~1-week
> agent-drivable REPL to validate the fun, then ship the SQLite store. The two
> durable ideas: (1) a typed-edge graph the Director queries at decision time
> (proven), and (2) **lore as a structured fact-skeleton revealed progressively,
> with prose rendered deterministically from facts** (the move that makes
> "artifacts drop lore" coherent, cheap, deterministic, and save-safe).

## Read in this order

1. **`DESIGN.md`** — the full design (latest version). Start at §0 (the decision)
   and §5 (lore generation — the crux).
2. **`findings/`** — empirical evidence (everything below was actually RUN against
   a live PGLite gbrain, not asserted):
   - `01` — the schema pack validates against gbrain's real parser.
   - `02` — **the central experiment**: prose wikilinks wire ZERO edges in custom
     dirs (a hardcoded VC-only pattern); explicit `link` with custom verbs works
     multi-hop, zero-LLM. Thesis survives, mechanism corrected.
   - `03` — the Director loop runs end-to-end; a coherent, arc-aligned pick.
   - `04` — scale/latency: traversal cost is fixed overhead, not graph size.
   - `05` — robustness test found+fixed a real volume-domination bug in the
     scorer; proved the pick is input-driven, not a flattering seed.
3. **`reviews/`** — `self-review.md` (5 perspectives) + `adversarial-round-1/2/3.md`
   (hostile Opus reviews; each drove a design revision).
4. **`DECISIONS.md`** — the running decision log + why each call was made.
5. **`schema/storybrain-base.yaml`** — the world taxonomy (validated, active).
6. **`prototype/`** — `seed.sh` (builds a world), `director.ts` (one tick:
   sense→score→fire→writeback), `robustness.ts` (perturbation test). Run:
   ```
   GBRAIN_HOME=/tmp/storybrain-brain bash storybrain/prototype/seed.sh
   GBRAIN_HOME=/tmp/storybrain-brain bun  storybrain/prototype/director.ts
   GBRAIN_HOME=/tmp/storybrain-brain bun  storybrain/prototype/robustness.ts
   ```

## Process note

Built per Sam's charter: 5 self-review rounds → 3 adversarial Opus rounds →
prototype → autonomous follow-ups, committing/pushing after every unit (ephemeral
container). The reviews were genuinely adversarial — round 1 found a FATAL flaw
(the self-wiring claim), round 2 found the under-served lore-generation half, round
3 stress-tested the result. The design is stronger for having survived them.
</content>
