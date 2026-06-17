# StoryBrain — an AI storyteller knowledgebase on gbrain

> Status: **v2** (post 5-round self-review; pre adversarial review). Review
> records in `storybrain/reviews/`. Decision log in `storybrain/DECISIONS.md`.
> Findings from executed experiments in `storybrain/findings/`.

This document evaluates and designs the use of **gbrain** (this repo, an
unmodified fork of "brain") as the persistent world-memory layer for a
**Rimworld-style AI storyteller and lore generator** in a video game, with
**artifact-hunting** as a major story-driving mechanic.

Written for two readers: the game designer (my friend) deciding whether this is
worth building, and the engineer who would build it.

---

## 0. The one-paragraph answer

A Rimworld storyteller is really **two machines**: a *Director* (a control loop
that decides what event fires and when, modulated by a tension budget) and a
*World-Memory* (persistent, queryable continuity of who did what, who hates whom,
what was found where). **gbrain is the World-Memory half — a genuinely strong fit
for it — but it is not the Director.** Its self-wiring typed-edge knowledge graph
turns gameplay history into queryable structure with *zero LLM cost per write*,
which is exactly what emergent, callback-rich narrative needs and what a flat lore
file (Karpathy's "llm wiki") cannot do. The recommendation is **phase-split**: use
gbrain to *prototype and validate the fun* and as the **reference implementation**
of the schema + query set (you can drive the whole thing by talking to an agent,
no engine code); then **port the proven query set to an embedded in-process store**
(SQLite+FTS5 / libSQL) for the shipped game, because bundling a Bun+PGLite sidecar
with a retail title is heavy. Throughout, make **artifacts first-class entities
whose discovery spills lore the Director reads as high-value callback material** —
closing an artifact → rumor → hunt → lore → event → artifact spiral that is the
engine of the game's story.

---

## 1. Two machines, do not conflate them

| | **Director** | **World-Memory** |
|---|---|---|
| Job | Decide *what happens next* and *when* | Remember *everything that happened* |
| Shape | Control loop + tension budget + scoring | Knowledge store + retrieval + graph |
| Determinism | Must be deterministic (save/load, replay) | Reads deterministic; writes append-only |
| Latency | Real-time (per tick) | Sub-second reads; writes async/batched |
| LLM in loop? | **No** (arithmetic + graph queries) | Only for narration & overnight summaries |
| Who builds it | **You** (game code) | gbrain (prototype) → embedded store (ship) |

Rimworld's Cassandra/Phoebe/Randy are *Directors*, not knowledgebases. gbrain and
llm-wiki are *World-Memories*, not Directors. Evaluating gbrain "as a storyteller"
is a category error; evaluate it as the memory the storyteller reads from.

---

## 2. Why "emergent" forces a graph (and rules out the flat wiki)

The designer has committed to **emergent** narrative: story that arises from
gameplay history, not a hand-authored tree. Emergence has one hard requirement —
the Director must ask **relational questions about the past** at decision time:

- "Does any colonist have an unresolved `rival_of` / `betrayed_by` edge to
  someone in the incoming raider faction?"
- "Who last `owned` the artifact the player just dug up, and how did they die?"
- "What chain `caused_by` the famine three winters ago?"

A flat markdown wiki (llm-wiki: `index.md` + pages, no graph, no search index)
**cannot answer these** without an LLM re-reading the corpus every tick — too
slow, too costly, non-deterministic. A graph answers them directly. gbrain's graph
**builds itself from `[[type/slug]]` wikilinks on every write, with no LLM calls**
— that zero-cost self-wiring is the property that makes emergence affordable at
tick rates. The flat wiki still wins for a *small, hand-curated lore bible*; it
loses the moment story must compound from play. The designer wants the latter.

---

## 3. The `storybrain-base` schema pack

gbrain packs are YAML: `page_types` (each with a `primitive`, `path_prefixes`,
optional `subtypes`, `extractable`, `expert_routing`) plus `link_types` (with an
`inverse`). Edges auto-wire from wikilinks. Authored pack:
`storybrain/schema/storybrain-base.yaml`; rationale below.

### 3.1 Page types

| Type | primitive | Why |
|---|---|---|
| `colonist` | entity | Dramatis personae. `expert_routing: true` ("who knows surgery"). |
| `faction` | entity | Raiders, tribes, empires; reputation/standing in frontmatter. |
| `location` | entity | Rooms, biomes, ruins, dungeon/hunt sites, the map. |
| `artifact` | entity | **First-class McGuffin.** See §4 — the story engine. |
| `lore` | media | World-building + dropped fragments. Subtypes: `rumor`, `fragment`, `myth`, `codex`, `prophecy`. `extractable: true`. |
| `belief` | concept | Ideoligion / deity / meme a faction or colonist `worships`. |
| `event` | temporal | Workhorse: every incident becomes one. `temporal` ⇒ `timeline`+`find_trajectory`. Subtypes: `raid`,`social`,`disaster`,`quest`,`discovery`. `extractable: true`. |
| `arc` | temporal | An **active plot** the Director steers (see §5). Lifecycle in frontmatter. |
| `chapter` | temporal | Arc/era recap, LLM-written overnight (the "Legends" view, also compaction target). |
| `power` | concept | Boon an artifact `grants`; a page so it carries lore + balance notes. |
| `curse` | concept | The dark side an artifact `bears`; drives risk/reward in hunts. |

We author `storybrain-base` as a **standalone pack** (`extends: null`), not an
extension of gbrain's VC-flavored `gbrain-base-v2`, so we own the whole taxonomy.

### 3.2 Link types (the relationship graph)

- **Social:** `kin_of`↔`kin_of`, `rival_of`↔`rival_of`, `ally_of`↔`ally_of`,
  `lover_of`↔`lover_of`, `member_of`↔`has_member`.
- **Action/history:** `killed`↔`killed_by`, `betrayed`↔`betrayed_by`,
  `saved`↔`saved_by`, `involves`↔`involved_in` (event→colonist),
  `caused_by`↔`caused` (**event→event causal chains**).
- **Spatial:** `located_at`↔`location_of`, `occurred_at`↔`site_of`.
- **Artifact spine (§4):** `hidden_at`↔`hides`, `sought_by`↔`seeks`,
  `guarded_by`↔`guards`, `grants`↔`granted_by`, `bears`↔`borne_by` (curse),
  `fragment_of`↔`has_fragment`, `forged_by`↔`forged`, `owned_by`↔`owns`,
  `reveals`↔`revealed_by` (lore→figure/event), `drops`↔`dropped_by`
  (artifact→lore), `rumored_at`↔`rumor_of` (foreshadow).
- **Player-choice fate (agency feeds the graph):** `destroyed`↔`destroyed_by`,
  `sold`↔`sold_by`, `sealed`↔`sealed_by`, `ignored`↔`ignored_by`.
- **Arc wiring:** `advances`↔`advanced_by` (event→arc), `resolves`↔`resolved_by`.

---

## 4. Artifacts: the story engine (the designer's headline feature)

The designer's centerpiece: **hunting artifacts that drop lore and drive the
story.** Not a cosmetic item system — the primary narrative pump. StoryBrain
models it as a self-reinforcing spiral *with a closeable arc* (so it builds
tension and then pays off, instead of escalating forever):

```
  RUMOR ──rumored_at──► LOCATION        (foreshadow: a torn map, a dying
    │  partial lore, seeds desire        trader's hint — the *approach*)
    ▼
  HUNT (quest event) ──occurred_at──► LOCATION ──guarded_by──► FACTION/beast
    │
    ▼
  ARTIFACT  ──grants──► POWER   ──bears──► CURSE   (the find is a *decision*:
    │  fragment_of ► greater relic (collect arcs)   boon vs. risk vs. who wants it)
    │  drops
    ▼
  LORE FRAGMENT ──reveals──► FIGURE / ERA / past EVENT
    │  Director reads freshly-revealed, high-tension lore as callback fuel
    ▼
  NEW EVENT / NEXT RUMOR ──advances──► ARC ──(eventually)──► RESOLUTION
    (descendants seek revenge; the prophecy must be stopped; the rival faction
     races you to the last shard) — then the arc CLOSES (catharsis, downtime)
    │
    └──► often points at the next artifact: spiral repeats, richer each loop
```

### 4.1 Anatomy of an artifact (frontmatter + graph)

- `lore_fragments: [slug, …]` — revealed **progressively**: found → fragment 1;
  studied at a bench → fragment 2; *used in a crisis* → fragment 3. Each reveal
  flips the fragment page's `revealed: true` and lights its `drops`/`dropped_by`
  edge.
- `power` / `curse` edges — a boon and a risk. The risk makes the hunt a
  *decision*, not a pickup.
- `fragment_of` — collect-them-all arcs: shards `hidden_at` different sites,
  `sought_by` a rival faction; assembly is a multi-chapter arc.
- provenance — `forged_by` an ancient figure, `owned_by` a chain of past owners
  (each death a lore beat), `lost_in` a past `event`.
- **fate** — once the player acts, a `destroyed`/`sold`/`sealed`/`ignored` edge
  records the *choice*, which the Director respects (a faction avenges a
  *destroyed* relic differently than a *stolen* one).

### 4.2 The lore-drop mechanic, concretely

On discovery/study the engine writes a `lore` page (subtype `fragment`):

```markdown
---
type: lore
subtype: fragment
revealed: true
revealed_on_day: 412
tension: 0.7
valence: -1            # ominous reveal
arc: arcs/iron-empire-reckoning
---
# The Ashmark Was Forged to Kill a King

The blade [[artifact/ashmark]] bears old imperial script. [[colonist/vera]]
translated it: [[lore/the-grey-smith|the Grey Smith]] forged it to end the line
of [[faction/iron-empire]]. The Empire still hunts every shard. They will know
it has surfaced.
```

That one write: (1) **wires the graph** (edges to artifact, colonist, smith,
faction — no LLM); (2) **becomes searchable** (BM25 now, vector optionally); (3)
**raises a flag the Director sees next tick** — a fresh, high-`tension` lore page
naming a live faction is prime `callback_strength`/`arc_advance` fuel, so the next
Iron-Empire raid arrives *with a reason the player can read*.

### 4.3 Why this beats a flat file

The payoff is **continuity the player feels was authored but wasn't.** Because
provenance and seekers are *edges*, the Director can ask at raid time: "is the
incoming faction `sought_by`-linked to any artifact the colony now `owns`?" If
yes, the raid is *about the artifact*, narration cites the fragment, and the
player experiences a plot. A flat wiki has the text but cannot query the
relationship *at decision time*, so the connection never fires mechanically.

---

## 5. The Director (the piece you build)

gbrain is the sensorium; the Director is the will. Loop, each stage bound to a
real query:

```
  ── every game-day tick (or incident slot) ─────────────────────────────────
  1. READ PACING STATE          (pure game code; no gbrain, no LLM)
       tension_budget = f(wealth, #colonists, days-since-hardship, avg mood,
                          active-arc phase)
       choose: fire? how hard? which VALENCE (relief vs. dread)? which register?

  2. SENSE DRAMATIC POTENTIAL   (gbrain reads — fast, deterministic, cheap)
       • active arcs           → which open plots can advance now
       • traverse_graph        → open grudges/debts/bonds; owned-vs-sought
                                 artifacts; freshly-revealed lore
       • find_trajectory       → arcs ripe to pay off
       • search(tension-sorted)/find_anomalies → hot or surprising state

  3. GENERATE + SCORE CANDIDATES   (game code; arithmetic over query results)
       resonance = w1·arc_advance       (moves an OPEN active plot — primary)
                 + w2·callback_strength  (cites real graph history)
                 + w3·character_stakes   (hits high-salience pawns)
                 + w4·valence_fit        (matches the pacing target sign)
                 + w5·tension_fit        (matches the budget magnitude)
                 − w6·repetition         (semantic dup of recent events)
                 − w7·fixation           (over-used faction/arc penalty)

  4. FIRE → engine resolves the chosen event in-game

  5. WRITE BACK → put_page events/… with [[…]] mentions; advances/resolves arc
       graph self-wires → step 2 next tick sees it.  EMERGENT.

  (overnight / chapter break) think → chapter recap + COMPACT old events;
       find_contradictions → flag lore conflicts (mystery beat or author fix)
  ────────────────────────────────────────────────────────────────────────────
```

- **Arcs as attractors.** The Director holds 1–3 open `arc`s and biases toward
  `arc_advance` — this is what turns "stuff happening that references the past"
  into a *story with throughline*. Arcs have a lifecycle
  (`seed→rumor→rising→climax→resolution→dormant`) and *must* progress or be
  force-closed.
- **Valence.** Alternate relief and dread; don't only ramp magnitude.
- **Cold-start guard.** Until the graph crosses a density threshold, draw from a
  hand-authored baseline event pool; blend in resonance as history accrues.
- **Fixation/diversity guards.** Per-faction/per-arc cooldowns; a max-share cap
  so no single thread dominates.
- **Tension model** (step 1): pure Rimworld, ~200 lines, no LLM, no gbrain — you
  own it.

---

## 6. Integration architecture

- **Phase 1 (prototype): gbrain sidecar.** `gbrain serve` as a child process;
  drive it from an agent or a thin client. The PGLite dir is per-save state. This
  is where you *validate the fun* with near-zero engine code.
- **Keep the LLM out of the tick loop.** Steps 1–3 are retrieval + graph +
  arithmetic. LLM (`think`) only for *narration text* after selection and
  overnight `chapter` recaps. Narration is presentation — cached in save,
  seeded, regenerable — never authoritative save state. Sidesteps LLM
  non-determinism.
- **Graph + BM25 first; vector scoped.** The graph needs no model; BM25 needs no
  model. Reserve embeddings for a *small* index — recent-event dedup +
  lore-contradiction (a few hundred rows) — not full-corpus retrieval. Removes the
  biggest cost/latency objection. (Local Ollama/llama.cpp recipe if you do want
  vectors; or defer entirely.)
- **Async batched writes.** Game owns an in-memory authoritative ring of recent
  history + a durable append-only journal; flushes event pages to gbrain in
  batches off the hot path. Respects PGLite's single-writer constraint.
- **Chapter compaction.** Periodically fold old raw events into a `chapter`
  summary and soft-delete the raw events. Bounds save size.
- **Determinism / save-load.** Graph queries + resonance math are deterministic;
  PGLite dir + brain git repo *are* the save. Pin the embedding model per save so
  ranking doesn't drift across versions.

### What to strip from gbrain (≈80% is overhead for a single-player game)

Auth/OAuth, company-brain multi-user scoping + access control, skillpacks, eval
framework, cron dream-cycle (replace with your overnight chapter job), the MCP
client matrix. You need ~12 of 136 ops: `put_page`, `get_page`, `search`,
`traverse_graph`/`graph`, `find_trajectory`, `get_timeline`, `add_link`,
`get_links`, `find_contradictions`, schema-pack load, `think` (narration).

### 6.5 Alternative: roll your own (the shipped-game target)

Everything the Director needs is, at bottom, a relations table + a text index:

- `edges(src, type, dst, day, weight)` — the graph
- FTS5 (SQLite) / equivalent — keyword search
- a tiny vector index (optional) — dedup + contradiction
- markdown blobs — the lore/event bodies

That is embeddable **in-process** in any engine, no Bun, no WASM Postgres, no
sidecar — which matters because **shipping a Bun+PGLite+HTTP sidecar with a retail
title is a real footprint/support/AV liability.** So: **gbrain for the prototype +
as the reference implementation**; **embedded store (SQLite/libSQL) for the ship**,
specified by the **Query Catalog** below. The schema pack (YAML) + the catalog are
the spec the embedded store must satisfy.

### 6.6 Query Catalog (the ~10 queries the Director issues — the port spec)

1. `open_grudges(faction)` → colonists with `rival_of`/`betrayed_by`/`killed_by`
   edges into `faction`.
2. `owned_but_sought()` → artifacts the colony `owns` that some faction `seeks`.
3. `fresh_lore(since_day, min_tension)` → recently `revealed` fragments.
4. `arc_candidates()` → open `arc`s + their next advanceable beat.
5. `causal_chain(event)` → `caused_by`* walk.
6. `relationship_between(a, b)` → shortest typed path.
7. `who_knows(topic)` → `expert_routing` over colonists (`whoknows`).
8. `recent_events(n)` for repetition/fixation scoring.
9. `artifact_provenance(artifact)` → `forged_by`/`owned_by`/`lost_in` chain.
10. `contradictions(scope)` → conflicting lore (`find_contradictions`).

If the embedded store answers these, the Director is portable. gbrain answers all
ten today; that's the value of building the prototype on it.

---

## 7. Honest risks & gaps (status after self-review)

1. **gbrain `salience` ≠ dramatic salience.** *Resolved:* define our own
   `tension`/`valence` frontmatter and query it; don't lean on built-in salience.
2. **Write throughput vs tick rate.** *Mitigated:* async batched writes + durable
   journal + graph/BM25-first (no hot-path embedding).
3. **PGLite single-writer.** *Mitigated:* serialized batched flush; in the
   shipped phase the embedded store removes the constraint.
4. **The Director is unbuilt.** *By design:* gbrain gives memory, not will. The
   resonance scorer is the real game-design work.
5. **Retrieval-ranking determinism.** *Mitigated:* pin embedding model per save;
   graph/BM25 paths are deterministic regardless.
6. **Shipping a sidecar.** *Resolved via phase-split:* prototype on gbrain, port
   to embedded store for ship (§6.5).
7. **Emergent lore self-contradiction.** *Mitigated:* `find_contradictions` pass;
   contradictions can be *used* as mystery beats.
8. **Cold start / fixation.** *Mitigated:* baseline pool + diversity guards (§5).

---

## 8. Recommendation (phase-split)

1. **Validate the fun cheaply (gbrain, days not weeks).** Author
   `storybrain-base.yaml`, stand up a PGLite brain, seed a tiny world (a few
   colonists, two factions, one artifact arc), and drive *one full spiral* —
   rumor → hunt → artifact → lore drop → Director fires the payoff raid — by
   issuing the Query Catalog calls. Confirm the resonance pick *feels authored*.
2. **If it's fun, harden it.** Build the real Director (tension model + scorer) as
   game code against the gbrain sidecar. Add arcs, valence, guards.
3. **For ship, port the memory** to an embedded store satisfying §6.6, keeping
   gbrain as the reference + the design/agent-operable tool.

Artifacts are the spine throughout (§4): rumor foreshadows, the hunt is the
gameplay, the lore drop is the reward, the Director turns the reward into the next
threat. That spiral — affordable only because the graph self-wires for free — is
the case for building this on a brain instead of a flat wiki.
</content>
