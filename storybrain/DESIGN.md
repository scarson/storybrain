# StoryBrain — an AI storyteller knowledgebase on gbrain

> Status: **v3** (post 5-round self-review + adversarial round 1, with an
> EMPIRICAL prototype run against a live PGLite brain). Review records in
> `storybrain/reviews/`. Decisions in `storybrain/DECISIONS.md`. Hard evidence in
> `storybrain/findings/` — read findings 01–02 before trusting any gbrain claim
> here; they are measured, not asserted.

Evaluates and designs **gbrain** (this repo) as the persistent world-memory layer
for a **Rimworld-style AI storyteller + lore generator**, with **artifact-hunting**
as the headline story mechanic and **emergent** (history-driven) narrative.

---

## 0. The one-paragraph answer (revised after measurement)

A Rimworld storyteller is two machines: a **Director** (decides what happens next,
on a tension budget — you build this) and a **World-Memory** (remembers everything,
queryably — this is the gbrain question). The emergent half needs to ask
*relational questions about the past at decision time* ("does anyone hold a grudge
against the raiders who just appeared, and do we own something they want?"), which
a flat lore file cannot do and a **typed graph** can. **Measured result
(finding 02): gbrain's typed graph genuinely delivers this — custom relationship
verbs, multi-hop, zero LLM — but ONLY via explicit `add_link` edge writes, NOT via
the advertised "self-wiring from `[[wikilinks]]`," which is hardcoded to
VC-domain directories and does nothing for game namespaces.** That correction
matters: the mechanism is the game engine *emitting explicit edges it already
knows* (better for a game — deterministic, no NLP guessing), not prose extraction.
Once that's true, gbrain's remaining unique value is **instant stand-up + an
agent-drivable CLI/MCP surface you can prototype against by talking to it** — not
its retrieval intelligence, most of which this use case discards. So the honest
recommendation is a **graduated bet**: the *real artifact you need either way* is a
small SQLite/libSQL `edges` table + FTS + the 9-query catalog in §6.6;
**gbrain earns its place only as a fast design-REPL to validate the fun before you
commit engine code** — and if you're comfortable in SQL, building that store
first and exploring with an LLM agent against *it* is a defensible alternative.
Artifacts are the spine throughout: rumor → hunt → find → lore drop → the Director
turns the drop into the next threat.

---

## 1. Two machines, do not conflate them

| | **Director** | **World-Memory** |
|---|---|---|
| Job | Decide *what happens next* and *when* | Remember *everything that happened* |
| Shape | Control loop + tension budget + scoring | Typed-edge store + text search |
| Determinism | Must be deterministic (save/load) | Reads deterministic; writes append-only |
| Latency | Real-time (per tick) | Sub-second reads; writes async/batched |
| LLM in loop? | **No** (arithmetic + graph queries) | Only for narration & overnight recaps |
| Who builds it | **You** (game code) | gbrain (prototype) → SQLite store (ship) |

Cassandra/Phoebe/Randy are *Directors*, not knowledgebases. Evaluating gbrain "as
a storyteller" is a category error. (Survived every review round; foundational.)

---

## 2. Why "emergent" forces a typed graph

Emergence requires answering **relational questions about the past at decision
time**: "who has an unresolved `rival_of`/`betrayed_by`/`killed_by` edge into the
incoming faction?", "who last `owned` the artifact we just dug up?", "what
`caused_by`-chains back to the famine?" A flat wiki (llm-wiki: `index.md` + pages)
cannot without an LLM re-reading the corpus every tick (slow, costly,
non-deterministic). A typed graph answers in microseconds. **This is the whole
reason to prefer a graph store over a flat wiki** — and it is verified to work
(finding 02). What is NOT true is that the graph builds itself for free from prose;
see §3.3.

---

## 3. The `storybrain-base` schema pack — VALIDATED & ACTIVE

Authored at `storybrain/schema/storybrain-base.yaml`; **loaded, validated, and
activated against a live PGLite brain** (finding 02: 12 page types, 31 link verbs).

### 3.1 Page types

`colonist` (entity, `expert_routing`), `faction` (entity), `location` (entity;
subtypes settlement/ruin/huntsite), **`artifact`** (entity; the McGuffin, §4),
`lore` (media; subtypes rumor/fragment/myth/codex/prophecy), `belief` (concept),
`event` (temporal; subtypes raid/social/disaster/quest/discovery), `arc`
(temporal; an active plot, §5), `chapter` (temporal; recap/compaction target),
`power` (concept), `curse` (concept), `note` (concept catch-all).

### 3.2 Link types (the relationship graph)

31 verbs across: social (`kin_of`, `rival_of`, `ally_of`, `lover_of`,
`member_of`), action/history (`killed`, `betrayed`, `saved`, `involves`,
`caused_by`), spatial (`located_at`, `occurred_at`), the **artifact spine**
(`hidden_at`, `rumored_at`, `sought_by`, `guarded_by`, `grants`, `bears`,
`fragment_of`, `forged_by`, `owned_by`, `lost_in`, `drops`, `reveals`),
**player-choice fate** (`destroyed`, `sold`, `sealed`, `ignored`), and arc wiring
(`advances`, `resolves`, `worships`).

### 3.3 How edges actually form (corrected — see finding 02)

- ✅ **Explicit `gbrain link <from> <to> --link-type <verb>` works for ALL custom
  verbs**, persists, traverses multi-hop in both directions, zero LLM. *This is
  the mechanism the game uses.* The engine knows "Vera now rivals the Empire" and
  writes that edge directly.
- ❌ **Prose `[[colonist/vera]]` wikilinks wire ZERO edges** for our dirs. The
  extractor's `DIR_PATTERN` (`src/core/link-extraction.ts:86`) is hardcoded to VC
  dirs; the pack does not retarget it; `inferLinkType` only emits VC verbs. Getting
  prose extraction would require a ~5-line fork (regenerate `DIR_PATTERN` from the
  active pack's `path_prefixes`) — unnecessary for a game and contrary to
  "unmodified fork."
- ⚠️ **`inverse:` in the pack is NOT auto-materialized on write.** Writing
  `ashmark --owned_by--> vera` does not create a `vera --owns--> ashmark` row.
  Reverse queries use **directional traversal** (`backlinks`, `graph-query
  --direction in`), which works (finding 02). If the game wants both as outgoing
  edges, it writes both (cheap).

**Net:** drop all "self-wiring from wikilinks" language. The graph is real,
typed, zero-LLM, and **engine-emitted**.

---

## 4. Artifacts: the story engine (the headline feature)

Hunting artifacts that drop lore and drive the story — the primary narrative pump,
modeled as a self-reinforcing spiral *with a closeable arc*:

```
  RUMOR ──rumored_at──► LOCATION         (foreshadow: a torn map, a dying
    │  partial lore, seeds desire         trader's hint — the *approach*)
    ▼
  HUNT (quest event) ──occurred_at──► LOCATION ──guarded_by──► FACTION/beast
    ▼
  ARTIFACT ──grants──► POWER  ──bears──► CURSE   (the find is a *decision*:
    │  fragment_of ► greater relic         boon vs. risk vs. who else wants it)
    │  drops
    ▼
  LORE FRAGMENT ──reveals──► FIGURE / ERA / past EVENT
    │  Director reads freshly-revealed, high-tension lore as callback fuel
    ▼
  NEW EVENT / NEXT RUMOR ──advances──► ARC ──(eventually)──► RESOLUTION
    (descendants seek revenge; the prophecy must be stopped; a rival races you
     to the last shard) — then the arc CLOSES (catharsis, downtime)
    │
    └──► often points at the next artifact: spiral repeats, richer each loop
```

### 4.1 Anatomy of an artifact

Frontmatter: `tier` (relic/mundane), `fragment_of_set`, `lore_fragments: [...]`
(revealed progressively: found → 1; studied → 2; used-in-crisis → 3). Edges:
`grants`→power, `bears`→curse, `fragment_of`→greater relic, `forged_by`→figure,
`owned_by`→owner chain, `lost_in`→past event, `sought_by`→faction, `hidden_at`→
site, plus player-choice `destroyed`/`sold`/`sealed`/`ignored`.

### 4.2 The lore-drop mechanic (measured end-to-end)

On discovery/study the engine writes a `lore` (subtype `fragment`) page AND emits
the edges explicitly. From the live brain (finding 02), after writing the Ashmark
fragment + edges, `graph-query factions/iron-empire --direction in` returns:

```
factions/iron-empire
  <-sought_by-- artifacts/ashmark
    <-reveals-- lore/ashmark-forged
  <-rival_of-- colonists/vera
    <-owned_by-- artifacts/ashmark
```

That is the Director's raid-time question answered for real: the Iron Empire is
`sought_by`-linked to an artifact the colony holds, and `colonist/vera`
`rival_of`s them. A raid now arrives *with a reason the player can read*. This is
the payoff a flat wiki can't produce — the relationship is queryable at decision
time.

---

## 5. The Director (the piece you build) — with one term specified

gbrain is the sensorium; the Director is the will.

```
  ── per incident slot ──────────────────────────────────────────────────────
  1. READ PACING STATE      (pure game code; no store, no LLM)
       tension_budget, target VALENCE (relief vs dread), register
  2. SENSE                  (store reads — fast, deterministic, cheap)
       • arc_candidates()   → open arcs in {rising,climax}, stale-since-advance
       • graph-query --direction in on live factions/artifacts → grudges,
         owned-but-sought, provenance (finding 02 shows these work)
       • recent_events(n)   → for repetition/fixation scoring
  3. SCORE CANDIDATES       (game code; arithmetic over query results)
       resonance = w1·arc_advance + w2·callback_strength + w3·character_stakes
                 + w4·valence_fit + w5·tension_fit − w6·repetition − w7·fixation
  4. FIRE → engine resolves; 5. WRITE BACK event page + emit edges + advance arc
  (overnight) think → chapter recap; compaction (§6, edge-safe)
  ────────────────────────────────────────────────────────────────────────────
```

**One term specified end-to-end (per R1-07).** The fear is that maximizing local
callbacks yields non-sequiturs. Concrete definition that ties callbacks to the
*active plot* and to *dramatic charge*:

```
callback_strength(candidate) =
    Σ over edges e that the candidate's narration would cite of
        tension(target(e)) · recency_decay(e.day) · arc_bonus(e)
  where tension(node)   = node.frontmatter.tension ∈ [0,1]   (engine-stamped)
        recency_decay(d)= 0.5 ^ ((today − d) / HALF_LIFE_DAYS)
        arc_bonus(e)    = ARC_W if e advances an OPEN arc else 1.0
```

Worked example over §4.2: a candidate "Iron Empire raid" would cite
`vera --rival_of--> iron-empire` (tension 0.6, recent) and `ashmark --sought_by-->
iron-empire` (tension 0.7, recent, advances the open `iron-empire-reckoning` arc).
Its callback_strength is high *and* concentrated on one arc → coherent, not
word-salad. A candidate "random toolbox theft" cites nothing high-tension → scores
low. `arc_advance` is then defined as `max over open arcs of (does this candidate
satisfy that arc's next beat predicate)` — the arc page's frontmatter declares
its `next_beat` (e.g. `kind: raid, faction: iron-empire`); a candidate matching it
advances the arc. `repetition` uses the small scoped vector index (§6) OR a cheap
type+faction+location key match if you skip vectors entirely.

**Falsifiable success metric** (replaces "feels authored"): show a human rater 10
Director picks interleaved with 10 hand-authored beats, blind; success = rater
cannot beat chance at telling them apart (≤ ~60% accuracy).

Plus: **arcs as attractors** (1–3 open arcs, lifecycle
seed→rumor→rising→climax→resolution→dormant, must progress or force-close);
**valence** (alternate relief/dread); **cold-start baseline pool** until the graph
is dense; **fixation/diversity guards** (per-faction/arc cooldowns, max-share cap).

---

## 6. Integration architecture

- **Phase-1 prototype = gbrain sidecar.** `gbrain init --pglite --no-embedding`
  (verified: brain up in seconds, no API key); `gbrain serve` for MCP. The PGLite
  dir is per-save state. Value here is *validating the fun with near-zero engine
  code*, driving the brain from an agent or thin client.
- **Keep the LLM out of the tick loop.** Steps 1–3 are graph + arithmetic. LLM
  (`think`) only for narration after selection + overnight recaps. Narration is
  presentation — cached in save, seeded, regenerable — never authoritative state.
- **Graph + BM25 first; vectors optional & scoped.** Confirmed: embeddings are
  optional in gbrain. Graph needs no model; keyword needs no model. Reserve a
  small vector index (few hundred rows) only for recent-event dedup. Local
  Ollama/llama.cpp if you want vectors at all.
- **Async batched writes.** Game owns an in-memory authoritative ring + a durable
  append-only journal; flushes pages+edges to the store in batches off the hot
  path. Respects PGLite single-writer. (Throughput unmeasured at game rates — a
  step-1 prototype TODO, R1-10; the ship store removes the constraint.)
- **Compaction must be EDGE-SAFE (corrected per R1-05).** gbrain soft-delete is a
  72h staging area; `purge_deleted_pages` then HARD-deletes and **cascades through
  `page_links`** — which would sever the `caused_by`/`owned_by`/`involves`
  provenance the Director walks. So: (a) NEVER call `purge_deleted_pages` on
  edge-bearing event pages; (b) before compacting an old event, **re-home its
  load-bearing edges onto durable entity pages** (move `owned_by`/`caused_by` onto
  the artifact/colonist) so they survive; (c) compaction folds event *prose* into
  a `chapter` and may delete the prose, but the edge rows persist. In the SQLite
  ship store, compaction = "delete event body blob, keep edge rows" (trivial; no
  cascade).
- **Determinism.** Graph + resonance math are deterministic; pin the embedding
  model per save if vectors are on.

### What gbrain ops are actually usable (corrected per R1-02/03/06/09)

USE: `put`/`put_page`, `get_page`, `search` (BM25/hybrid), `link`/`add_link`
(the workhorse), `graph`/`graph-query`/`backlinks` (traversal, both directions),
`get_links`, `get_timeline`, schema-pack load, `think` (narration only).

DO **NOT** rely on (they do something other than the design needs):
- `find_contradictions` — a cached reader of an offline **LLM-judged** eval probe
  (`anthropic:claude-haiku-4-5`), non-deterministic, costs money, batch-only, does
  NOT port. Lore-consistency is an optional overnight LLM job, not a free query.
- `find_trajectory` — a numeric VC-metric time-series engine (MRR/ARR/team_size),
  unrelated to "arcs ripe to pay off." Arc readiness = read `arc` frontmatter
  (`phase`, `days_since_advance`), a trivial query you own.
- `whoknows` — its ranking multiplies in built-in `salience` (emotional_weight +
  take_count), which is ~uniform for game pages, degenerating to keyword+recency.
  "Who's the best surgeon" is a colonist **skill-stat lookup in game code**, not a
  retrieval problem. Drop it.

### 6.5 The honest re-costing: gbrain vs. SQLite-from-day-one (R1-08)

Finding 02 changes the calculus. The single hardest-to-replicate gbrain feature —
prose→typed-graph extraction — *doesn't work for this domain anyway*. Walking the
catalog (§6.6): 8 of 9 queries are **plain SQL over `edges(src,type,dst,day)` + a
recursive CTE** — gbrain's `traverse_graph` IS a recursive CTE; you'd write the
same in SQLite in an afternoon. FTS handles `fresh_lore`. The genuinely
gbrain-only differentiators (hybrid RRF ranking, contradiction-via-LLM, salience,
trajectory, synthesis) are all things this design **deprioritized or discarded**.

So gbrain's real, honest value here is narrow but not zero: **a zero-setup,
agent-drivable design REPL** — you can stand up a world and interrogate the graph
*by talking to an agent*, no engine code, today. That is worth real money *if* your
validation loop is agent-driven. If you're fluent in SQL, writing the `edges`
table + 9 queries first (you need them for ship regardless) and exploring with an
LLM agent against *that* is a defensible — arguably leaner — path, because the
prototype becomes the ship artifact instead of throwaway.

**Recommendation:** treat gbrain as an optional accelerator for the design-REPL
phase, not as the World-Memory you build on. Build the SQLite `edges` store as the
durable artifact. Use gbrain (already stood up — findings 01/02) to *keep
prototyping the artifact spiral cheaply while the store is written*.

### 6.6 Query Catalog (the port spec — the real deliverable)

1. `open_grudges(faction)` — colonists with `rival_of`/`betrayed_by`/`killed_by`
   into faction. *(verified via `graph-query --direction in` + `backlinks`)*
2. `owned_but_sought()` — artifacts colony `owns` that a faction `seeks`. *(verified)*
3. `fresh_lore(since_day, min_tension)` — recent `revealed` fragments (FTS+filter).
4. `arc_candidates()` — open `arc`s where `phase∈{rising,climax}` and
   `days_since_advance>θ` (arc frontmatter; NOT find_trajectory).
5. `causal_chain(event)` — `caused_by`* recursive walk.
6. `relationship_between(a,b)` — shortest typed path. *(verified multi-hop)*
7. `recent_events(n)` — repetition/fixation scoring input.
8. `artifact_provenance(artifact)` — `forged_by`/`owned_by`/`lost_in` chain. *(verified)*
9. `who_has_skill(skill)` — colonist skill-stat lookup in **game code** (replaces
   whoknows).

(`contradictions` is intentionally NOT here — it's an optional LLM batch, not a
deterministic query; R1-02.)

---

## 7. Risks & gaps — status

1. Dramatic salience ≠ gbrain salience → define `tension`/`valence` frontmatter;
   don't use `whoknows`/built-in salience. **Resolved.**
2. Write throughput at game rates → async batch + journal; **unmeasured**, step-1
   TODO (R1-10). Ship store removes PGLite constraint.
3. Compaction severs edges → edge-safe compaction, never purge edge-bearing pages
   (R1-05). **Resolved in design; needs prototype confirmation.**
4. The Director is unbuilt → by design; §5 now specifies `callback_strength` +
   `arc_advance` + a falsifiable metric (R1-07). The scorer is the real work.
5. Prose self-wiring false → edges are engine-emitted via `add_link` (R1-01,
   finding 02). **Resolved.**
6. `find_contradictions`/`find_trajectory`/`whoknows` misapplied → dropped/
   reframed (R1-02/03/06). **Resolved.**
7. gbrain-vs-SQLite → honest re-cost (R1-08): SQLite `edges` store is the
   deliverable; gbrain is an optional agent-REPL accelerator. **Resolved.**

---

## 8. Recommendation (graduated)

1. **Validate the fun (now, cheaply).** The brain + pack are already up
   (findings 01/02). Build a thin Director harness that issues the §6.6 catalog
   and runs ONE full artifact spiral (rumor → hunt → find → lore drop → payoff
   raid). Apply the §5 `callback_strength` formula. Judge with the blind-rater
   metric. *(Next executed task — see findings/03+.)*
2. **Decide the substrate from evidence.** If agent-driven prototyping is fast and
   valuable, keep gbrain for exploration; in parallel write the SQLite `edges`
   store (the ship artifact) against the §6.6 spec. If you're SQL-fluent, you may
   skip straight to the store.
3. **Build the real Director** (tension model + scorer + arcs + guards) as game
   code against whichever store, LLM out of the tick loop.

The artifact spiral (§4) — affordable because typed edges are free to write and
fast to traverse — is the case for a graph store over a flat wiki. gbrain proves
the model quickly; SQLite ships it.
</content>
