# StoryBrain — an AI storyteller knowledgebase on gbrain

> Status: **v4** (post 5-round self-review + adversarial rounds 1–2, with a WORKING
> prototype: a Director tick runs sense→score→fire→writeback against a live brain).
> Evidence: `storybrain/findings/01–04` (measured, not asserted). Reviews:
> `storybrain/reviews/`. Decisions: `storybrain/DECISIONS.md`.

Designs **gbrain** (this repo) — or a small store like it — as the persistent
world-memory for a **Rimworld-style AI storyteller + lore generator**, with
**artifact-hunting that drops lore and drives the story** as the headline mechanic
and **emergent** (history-driven) narrative.

---

## 0. The decision, up front (no hedge)

**Build a small SQLite/libSQL `edges` store (the §10 query catalog) as the durable
artifact. Use gbrain only as a week-one agent-drivable REPL to validate the fun,
then stop.** The evidence forced this (findings 02/04, R1-08, R2-07): gbrain's
one hard-to-replicate feature — prose→typed-graph extraction — *doesn't work for a
game domain anyway* (it's hardcoded to VC dirs), and every other gbrain
differentiator (hybrid ranking, LLM contradiction, salience, trajectory) this use
case discards. What remains is "stand up a world and interrogate it by talking to
an agent, no engine code" — real, but a one-week accelerator, not a foundation.

The two things that ARE the design, and are substrate-independent:
1. **A typed-edge graph the Director queries at decision time** — proven to work
   (multi-hop, custom verbs, zero-LLM) via explicit edge writes (finding 02), and
   demonstrated driving a coherent Director pick (finding 03).
2. **Lore as a pre-structured fact skeleton, revealed progressively, with prose
   rendered deterministically from facts** (§5) — the move that makes "artifacts
   drop lore" coherent, cheap, deterministic, and save-safe.

Everything else below serves those two.

---

## 1. Two machines, do not conflate them

A storyteller = a **Director** (decides what happens next, on a tension budget —
*you build this*) + a **World-Memory** (remembers everything, queryably — the store).
Cassandra/Phoebe/Randy are Directors, not knowledgebases. The Director keeps the
LLM **out of the per-tick loop** (graph + arithmetic only); the LLM appears solely
as a cached lore/narration **renderer** (§5) and overnight recap writer.

---

## 2. Why "emergent" forces a typed graph (verified)

Emergence means answering relational questions about the past *at decision time*:
"who holds a grudge against the raiders who just appeared, and do we own something
they want?" A flat wiki can't without an LLM re-reading the corpus each tick; a
typed graph answers in microseconds. Finding 02 verified the graph works; finding
03 showed it producing a legible, plot-advancing Director pick (raid scored 3.197
citing 3 real high-tension edges + an arc multiplier; a no-history disaster sank to
0.210).

---

## 3. The world schema (the `edges` model)

Authored as a gbrain pack (`storybrain/schema/storybrain-base.yaml`, validated &
active — finding 02) AND directly portable to a SQLite schema. Node types:
`colonist, faction, location, artifact, lore, belief, event, arc, chapter, power,
curse`. Relationship verbs (31): social (`rival_of`, `kin_of`, `ally_of`,
`lover_of`, `member_of`), history (`killed`, `betrayed`, `saved`, `involves`,
`caused_by`), spatial (`located_at`, `occurred_at`), the **artifact spine**
(`hidden_at`, `rumored_at`, `sought_by`, `guarded_by`, `grants`, `bears`,
`fragment_of`, `forged_by`, `owned_by`, `lost_in`, `drops`, `reveals`),
**player-choice fate** (`destroyed`, `sold`, `sealed`, `ignored`), arc wiring
(`advances`, `resolves`, `worships`).

**Edge mechanics (corrected, measured — finding 02):**
- Edges are **engine-emitted explicitly** (`add_link(from, verb, to)`), NOT
  self-wired from prose. Zero LLM. For a game this is *better* — deterministic, no
  NLP guessing; the engine already knows the relationship.
- **Write one direction; query the other with directional traversal**
  (`--direction in` / backlinks). Do NOT materialize inverse edges — that doubles
  write volume for no gain (R2-03). Reverse queries work without it (finding 02).
- Per incident the engine emits ~5–15 edges, **async-batched off the hot path**
  (§7). At store level these are sub-ms (finding 04: traversal cost is dominated by
  fixed connect overhead, not edge count).

The ship target is literally `edges(src TEXT, verb TEXT, dst TEXT, day INT)` +
`nodes(slug TEXT PK, type TEXT, body TEXT NULL, facts JSON)` + FTS over bodies. The
§10 catalog is recursive-CTE SQL over that. gbrain's `traverse_graph` IS such a CTE.

---

## 4. Artifacts & the hunt — a fun loop, not just a schema (R2-08)

Hunting must be *fun*, not merely tracked. The loop has stakes at every step:

```
 RUMOR (lore/rumor)  — reveals the artifact EXISTS + a FUZZY location region,
   │  not the exact site. Multiple rumors NARROW it (triangulation = gameplay).
   │  rumored_at → region;  tension seed planted.
   ▼
 DECISION TO HUNT — costs: send N colonists for M days (opportunity cost while
   │  the colony is undefended), supplies, travel risk. A real trade-off.
   ▼
 THE SITE — guarded_by faction/beast (a fight or a heist), hazards, a RIVAL
   │  faction racing you (a clock: rival_progress advances each day you delay).
   │  Get there late → the artifact is sought_by/owned_by the rival now → new arc.
   ▼
 THE FIND — artifact grants POWER, bears CURSE (risk/reward decision), maybe
   │  fragment_of a set (collect arc). drops its FIRST lore fact.
   ▼
 STUDY / USE — reveals deeper lore facts progressively (§5). Each reveal can
   │  spawn the next rumor or threat.
   ▼
 FATE CHOICE — keep / destroy / sell / seal. Writes a fate edge the Director and
      future factions respect (destroying a relic enrages its seekers differently
      than keeping it). The choice has narrative consequence via the scorer (§6).
```

Every box is a player decision with a cost and a consequence the graph records.
Location *uncertainty* + the *rival clock* + the *curse trade-off* + the *fate
choice* are what make it a loop rather than a fetch quest. None of this is
substrate work — it's game design the store merely remembers.

---

## 5. Lore generation & determinism (the headline — and the crux R2 fix)

The friend's vision is "artifacts drop lore that drives the story." Round 2
correctly flagged that earlier versions never said *where lore text comes from* or
how it stays coherent/deterministic. The resolution reframes the problem:

> **Canon is structured FACTS. Prose is a deterministic rendering of facts. The
> LLM is an optional, cached renderer — never the author of canon.**

### 5.1 Three layers

1. **Fact skeleton (authoritative, save-critical, deterministic).** Each artifact
   ships (hand-authored by designer/modder, or procgen at world-gen like Dwarf
   Fortress legends) a bundle of *latent lore facts*, stored as edges + structured
   frontmatter with `revealed: false`. Example for the Ashmark:
   `forged_by → grey-smith`, `purpose: end-dynasty`, `target → iron-empire`,
   `owned_by (history): [...]`, `bears → the-hunger`, `lost_in → siege-of-...`.
   These are EDGES and FIELDS — tiny, consistent by construction, in the save.
2. **Reveal state (gameplay-driven).** "Dropping lore" = flipping the next latent
   fact to `revealed: true` (found → fact 1; studied → fact 2; used-in-crisis →
   fact 3). Pure state change. The Director reads *revealed facts* (§6).
3. **Prose (presentation, regenerable, NOT save-critical).** Rendered FROM the
   revealed facts, two modes:
   - **Templated (default, free, fully deterministic):** *"The {artifact} was
     forged by {forger} to end the line of {target}."* Zero LLM, instant,
     reproducible. Good enough to ship.
   - **LLM-polished (optional flavor):** an LLM rewrites the template into richer
     prose. Determinism preserved by **caching keyed on (facts_hash, seed,
     model_id)**: generate once, store in save, reuse on reload, regenerate only
     if the underlying facts change. So prose is a deterministic function of facts
     given fixed seed+model.

### 5.2 Why this resolves the round-2 FATALs

- **R2-05 (generation unspecified):** lore generation = procgen/authored fact
  skeletons + progressive reveal + fact→prose rendering. Concrete and cheap.
- **R2-06 (determinism contradiction):** prose can be both "regenerable
  presentation" AND safe, because the **Director keys off FACTS, never prose**.
  Regenerating prose on reload cannot change selection or the causal graph — the
  facts are unchanged. "Regenerable narration" is now true *because* canon is
  structured.
- **R2-01 / R1-05 (compaction):** since prose regenerates from facts, **compaction
  = drop/blank old prose bodies, keep all facts (edges + frontmatter) forever**
  (edges are tiny). No "re-home edges" needed (that was incoherent for
  `caused_by` event→event chains). Never call `purge_deleted_pages`. In the SQLite
  store, `UPDATE nodes SET body=NULL` — trivial, no cascade. Bounds save size
  while preserving the entire queryable graph.
- **Contradiction problem (old R1-02):** largely *vanishes*. If canon is a
  consistent fact skeleton, the LLM can't invent a contradictory forger — it only
  renders given facts. No LLM-judged contradiction probe needed.

### 5.3 The artifact → lore → Director spiral, now well-defined

Find artifact → reveal fact (state flip) → fact is an edge (`reveals → faction`)
→ Director's next-tick graph query sees the new high-tension edge → fires an event
that cites it → the event reveals/seeds the next fact. The spiral runs on FACTS
(deterministic, cheap); prose is painted on top (cached). This is exactly the
Ashmark→Iron-Empire chain demonstrated in finding 03.

---

## 6. The Director (you build) — one term specified, proven

Loop: `1. pacing state (game) → 2. sense (graph queries) → 3. score → 4. fire →
5. write back (event + edges + advance arc)`. LLM never in this loop.

`resonance = w1·arc_advance + w2·callback_strength + w3·character_stakes +
w4·valence_fit + w5·tension_fit − w6·repetition − w7·fixation`

**`callback_strength` specified and RUN (finding 03):**
```
callback_strength(candidate→F) = Σ over revealed edges e into F of
    tension(from(e)) · recency_decay(e.day)            (× arc multiplier if the
recency_decay(d) = 0.5 ^ ((today − d)/HALF_LIFE)        candidate advances an open arc)
```
`tension(node)` is **engine sim-state held in game memory** (combat danger, mood
swings, deaths, reveals stamp it) — NOT a graph field, so NO N+1 fan-out (R2-04):
the game already holds node state; the store supplies only structure. The demo
values (`world.json`) are illustrative game-design inputs, not derived. Quality of
the Director = quality of how the real game stamps tension; that is the genuine
game-design work, and the store cannot do it for you (honest).

`arc_advance` = candidate matches an open arc's `next_beat` (arc frontmatter,
NOT find_trajectory). `repetition`/`fixation` read `recent_events(n)`. **Fate
choices feed the scorer:** a `destroyed` artifact raises its seekers' faction
tension (revenge-for-destruction beats); `sealed` lowers it (the threat is
deferred) — so §4's fate choice has mechanical narrative consequence.

**Falsifiable success metric** (replaces "feels authored"): a blind rater shown 10
Director picks interleaved with 10 hand-authored beats cannot beat ~60% accuracy.

**Arc state machine (R2-09):** `seed → rumor → rising → climax → resolution →
dormant`. Transitions: a matching fired event advances phase + resets
`days_since_advance`; `days_since_advance > θ` with no progress forces toward
`resolution` (anti-stall); `resolution` writes a `chapter` and sets `dormant`.
1–3 arcs open at once; cold-start uses a baseline event pool until the graph is
dense; per-faction/arc cooldowns + a max-share cap prevent fixation.

---

## 7. Integration & determinism

- **Prototype:** gbrain sidecar (`init --pglite --no-embedding`, up in seconds —
  finding 02). **Ship:** in-process SQLite/libSQL; no Bun/WASM/HTTP bundled with
  the game.
- **Writes async-batched** off the hot path through ONE persistent connection
  (never CLI-per-edge; finding 04 shows CLI latency is spawn/connect overhead,
  ~0.64s, irrelevant in-process). The game owns an in-memory authoritative ring +
  a durable append-only journal; the store is downstream.
- **Save model (R2-10):** the save = the journal + a store snapshot taken at a
  consistent point (flush, then snapshot). NOT "the live PGLite dir mid-batch" —
  that risks torn writes. Snapshot-on-save, replay-journal-on-load.
- **Determinism:** facts + edges + resonance math are deterministic; prose is a
  cached deterministic function of facts (§5); pin embedding model per save if
  vectors are used at all (they're optional).

---

## 8. gbrain ops: use / avoid (corrected, measured)

USE (prototype): `put`/`put_page`, `get_page`, `link` (workhorse),
`graph`/`graph-query`/`backlinks` (both directions), `get_links`, `search` (BM25),
schema-pack load, `think` (overnight recaps only). DO NOT rely on
`find_contradictions` (cached LLM eval probe — non-deterministic, paid,
non-portable), `find_trajectory` (VC numeric metrics, unrelated to arcs),
`whoknows` (salience-weighted; "best surgeon" is a skill-stat lookup in game code).

---

## 9. Risks — status

1. Dramatic tension is game sim-state, not derivable — **the real game-design
   work**, can't be outsourced to the store. *Acknowledged, not hand-waved.*
2. Write throughput at tick rate — async batch; store ops sub-ms (finding 04);
   end-to-end batch throughput still a pre-ship TODO.
3. Compaction — drop prose bodies, keep facts/edges; never purge (R2-01). *Resolved.*
4. Lore generation + determinism — fact-skeleton + deterministic render (§5).
   *Resolved.*
5. Recommendation hedge — now a clear call (§0): SQLite store is the build (R2-07).
   *Resolved.*
6. Hunt fun — uncertainty + rival clock + curse trade-off + fate choice (§4).
   *Resolved in design; needs playtest.*
7. Mega-hub traversal blowup — cap fan-out, avoid one-node hubs (finding 04). *Noted.*

---

## 10. Query Catalog (the SQLite port spec — the real deliverable)

1. `open_grudges(faction)` — `rival_of`/`betrayed_by`/`killed_by` into faction. *(verified)*
2. `owned_but_sought()` — artifacts colony `owns` that a faction `seeks`. *(verified)*
3. `fresh_lore(since_day, min_tension)` — recently `revealed` facts/fragments.
4. `arc_candidates()` — open arcs `phase∈{rising,climax}`, `days_since_advance>θ`.
5. `causal_chain(event)` — `caused_by`* recursive CTE.
6. `relationship_between(a,b)` — shortest typed path. *(verified multi-hop)*
7. `recent_events(n)` — repetition/fixation input.
8. `artifact_provenance(artifact)` — `forged_by`/`owned_by`/`lost_in`. *(verified)*
9. `who_has_skill(skill)` — colonist skill-stat lookup in **game code**.
10. `rival_hunt_progress(artifact)` — the §4 race clock (engine state + `sought_by`).

(`contradictions` is intentionally absent — structured canon makes it
unnecessary; §5.2.)

---

## 11. Recommendation (the path)

1. **Validate fun cheaply (gbrain, ~1 week).** Already started: brain + pack up,
   Director spiral runs (findings 02/03). Extend to a multi-tick playthrough with
   the §4 hunt loop and §5 fact-reveal; judge with the blind-rater metric.
2. **Build the SQLite `edges` store** (the §10 catalog) as the durable artifact,
   in-process. Port the proven queries; drop gbrain.
3. **Build the Director** (tension stamping + scorer + arcs + guards) and the lore
   fact-skeleton + renderer (§5) as game code.

The artifact spiral — affordable because typed edges are free to write/traverse
and lore is structured facts rendered on demand — is the case for a graph store
over a flat wiki. gbrain proves the model in a week; SQLite ships it.
</content>
