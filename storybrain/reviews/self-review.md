# StoryBrain — 5-round self-review (multi-perspective)

Each round adopts a distinct perspective, finds real weaknesses in `DESIGN.md`
v1, and records the resulting changes. Findings flow back into DESIGN.md (v2)
and DECISIONS.md.

---

## Round 1 — The Game Designer ("is this actually fun?")

**Findings:**

1. **Escalation treadmill.** The artifact→lore→event→artifact spiral as drawn
   only ever *escalates*. Every find spawns a threat that points at the next
   find. Players need arcs that *close* — catharsis, downtime, a won feud.
   Without resolution the spiral is exhausting, not exciting.
2. **Tension has no valence.** §5's `tension_budget` treats everything as
   threat-intensity. But discovery, reunion, a festival, a windfall artifact are
   *positive* beats. A good Director alternates valence (relief after dread), not
   just magnitude. (This is literally why Rimworld has "good events.")
3. **No foreshadowing.** Artifact hunting is fun because of the *approach* — a
   rumor, a torn map, a dying trader's hint — not just the pickup. The model
   jumps straight to "discovered." Need a pre-discovery `rumor` beat that drops
   *partial* lore and seeds desire.
4. **Player agency under-modeled.** Emergent directors railroad. If the player
   ignores, sells, or destroys an artifact, that *choice* must become graph
   state the Director respects (a destroyed artifact's faction seeks revenge for
   its destruction, not its theft).

**Decisions → DESIGN v2:**
- Add an **arc lifecycle**: `seed → rumor → rising → climax → resolution →
  dormant`, stamped on `chapter`/arc frontmatter. The Director can *close* arcs.
- Add **valence** (`+`/`−`) to the pacing model; alternate, don't just ramp.
- Add a **`rumor`** lore subtype: partial fragment revealed *before* discovery.
- Add player-choice edges: `destroyed`, `sold`, `ignored`, `sealed` (artifact
  fate) so agency feeds the graph.

---

## Round 2 — The Systems / Performance Engineer ("will it run?")

**Findings:**

1. **PGLite is single-writer.** `serve` + per-tick synchronous writes contend
   for one write lock (CLAUDE.md and the README both flag this for sync). A game
   writing an event page every incident *will* stall.
2. **Embedding on the hot path is a non-starter.** Even *local* embeddings burn
   CPU/GPU that the game's sim+render need. Thousands of events × embedding =
   frame hitches.
3. **Save bloat.** Thousands of event pages (markdown + chunks + vectors) per
   long playthrough. Unbounded.
4. **Crash durability.** Sidecar crash mid-write = lost history. We stripped
   Minions (gbrain's crash-safe two-phase persistence) in §6 — that may be a
   mistake for the write path.

**Decisions → DESIGN v2:**
- **Async batched write queue.** Game keeps an in-memory ring of recent history
  (authoritative for the current session) and flushes event pages to gbrain in
  batches off the hot path. Reads can run concurrently against the last flush.
- **Graph + keyword (BM25) first; vector OPTIONAL.** The graph self-wires with
  no model; BM25 needs no model. Reserve embeddings for a *small, scoped* index
  (recent-event dedup + lore-contradiction, see R3), not full-corpus retrieval.
  This removes the single biggest cost/latency objection.
- **Chapter compaction** (the dream-cycle analog we kept): periodically fold old
  raw events into a `chapter` summary and soft-delete the raw events. Bounds save
  size; gbrain's soft-delete + versions support it.
- **Keep a thin durable write path** (append-only event journal the game owns;
  gbrain flush is downstream of it). Re-add a minimal crash-safe write, don't
  rely on gbrain's stripped queue.

---

## Round 3 — The Narrative Director ("does it feel like a *story*?")

**Findings:**

1. **"Stuff happening" ≠ story.** Maximizing local `callback_strength` produces
   *non-sequiturs that reference the past* — not a narrative with throughline.
   What's missing is **theme/throughline**: the Director needs a *current plot* it
   is steering toward, not just locally-resonant picks.
2. **Emergent lore self-contradicts.** Two fragments may name different forgers
   for the same artifact. Players notice. We have a tool: gbrain ships
   `find_contradictions` — repurpose it for lore consistency.
3. **Legibility.** "Drops lore" only matters if the player *sees* the codex grow
   and feels the connections. That's UI, but the data model must make "what's
   newly revealed and how it connects" trivially queryable (it does, via the
   graph + `revealed_on_day`).
4. **Tension with R2.** R2 deprioritized vectors, but good semantic
   dedup/contradiction *needs* embeddings. Resolve, don't ignore.

**Decisions → DESIGN v2:**
- **Arcs as attractors.** Promote `chapter`/arc objects to *active plots*: the
  Director keeps 1–3 open arcs and biases scoring toward `arc_advance` over raw
  local callback. This is "the Director has a plot in mind." (Strengthens the §5
  scorer: `arc_advance` is now a primary term, not a minor one.)
- **Lore-consistency pass** using `find_contradictions`, run on lore writes /
  overnight; flag conflicting fragments for the Director to *exploit* (a
  contradiction can be a mystery beat) or for an author to fix.
- **Scoped vector index** (reconciles R2/R3): embeddings ON but only for (a)
  recent-event semantic dedup and (b) lore contradiction detection — a few
  hundred rows, not the whole history. Full retrieval stays graph+BM25.
- Document the codex legibility requirement as a UI contract on the data model.

---

## Round 4 — The Skeptic ("steelman NOT using gbrain")

**Findings:**

1. **The graph is not magic; it's a relations table.** Everything the Director
   needs from the graph could be a SQLite table `edges(src, type, dst, day)` +
   FTS5 for keyword. That's embeddable *in-process* in any engine, ~zero
   dependencies, no Bun, no sidecar, no PGLite-in-WASM.
2. **Shipping a Bun+PGLite sidecar to players is heavy and fragile.** A game
   sold to end-users now bundles a Node-class runtime + a WASM Postgres + an
   HTTP server per save. That is a real support/footprint/AV-false-positive
   liability for a shipped title.
3. **But** gbrain gives, today, for free: the schema-pack system, the self-wiring
   link extractor, hybrid retrieval, `think` synthesis, `find_contradictions`,
   `find_trajectory`, versioning, and an *agent-operable* CLI/MCP surface — i.e.
   you can prototype the entire design *by talking to it* before writing engine
   code.

**Decisions → DESIGN v2 (this is the most important reframe):**
- **Split the recommendation by phase.**
  - **Prototype / design-validation phase → use gbrain.** It is the fastest way
    to prove the schema, the queries, and the artifact spiral are *fun* — you
    drive it with an agent, no engine integration. gbrain becomes the
    **reference implementation** of the schema + query set.
  - **Shipped game → plan a port path** to an embedded store (SQLite + FTS5 +
    an `edges` table, or libSQL) that re-implements the *proven* query set
    in-process. The schema pack (YAML) and the query catalog become the spec the
    embedded store must satisfy.
- Add an explicit **"Alternative: roll your own"** section + a **query catalog**
  (the ~10 queries the Director actually issues) so the port target is concrete.
- This is more honest than "ship gbrain in the game" and more useful: it gives
  the friend a cheap path to *validate the fun* and a clear graduation path.

---

## Round 5 — Player Experience / QA / Modding ("what breaks, who extends it?")

**Findings:**

1. **Cold start.** Early game has a thin graph → no open edges → the
   resonance-driven Director starves and falls back to boring random events.
2. **Fixation / degenerate loops.** A purely resonance-greedy Director can fixate
   (same faction every time) or chase one runaway arc forever.
3. **Narration determinism.** LLM narration diverges across runs/seeds; shared
   saves confuse. Narration must not be save-critical.
4. **Modding is an unclaimed strength.** Schema packs are *data* (YAML); lore and
   artifacts are *markdown*. That is a ready-made mod system — modders add page
   types, link types, artifacts, lore with no code. The design never said so.
5. **Schema migration.** Game updates that change the pack need a migration path;
   gbrain has migrations, an embedded port would need its own.

**Decisions → DESIGN v2:**
- **Cold-start baseline generator**: a hand-authored event pool the Director uses
  until the graph crosses a density threshold; resonance scoring blends in as
  history accrues.
- **Diversity + fixation guards**: per-faction/per-arc cooldowns; a max-share
  constraint so no single thread dominates; an arc *must* progress toward
  resolution or get forcibly closed.
- **Narration is presentation, cached in save, regenerable, seeded.** Never part
  of authoritative save state.
- Add a **Modding** section: schema-pack-as-mod-system is a headline strength;
  artifacts/lore as markdown means UGC is trivial.
- Note schema-migration responsibility in both gbrain and embedded-port phases.

---

## Cross-round synthesis (what changed v1 → v2)

- Director scorer gained **`arc_advance`** as a primary term and **valence**;
  arcs became **active plots/attractors** with a **lifecycle**.
- Artifacts gained **rumor/foreshadow** pre-drops and **player-choice fate
  edges**.
- Performance: **graph+BM25 first, vector scoped**, **async batched writes**,
  **chapter compaction**, **durable write journal**.
- Consistency: **`find_contradictions` for lore**.
- **Biggest reframe (R4): phase-split recommendation** — gbrain for
  prototype/validation + reference impl; **embedded port** (SQLite/libSQL) for
  the shipped game, specified by a **query catalog**.
- **Cold-start + fixation guards**, **narration as cached presentation**,
  **modding via schema packs + markdown**.
</content>
