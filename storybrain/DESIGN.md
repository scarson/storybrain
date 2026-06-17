# StoryBrain — an AI storyteller knowledgebase on gbrain

> Status: **v1 design** (pre-review). Refined across 5 self-review rounds and 3
> adversarial review rounds — see `storybrain/reviews/`. Decision log in
> `storybrain/DECISIONS.md`. Findings from executed experiments in
> `storybrain/findings/`.

This document evaluates and designs the use of **gbrain** (this repo, an
unmodified fork of "brain") as the persistent world-memory layer for a
**Rimworld-style AI storyteller and lore generator** in a video game, with
**artifact-hunting** as a major story-driving mechanic.

It is written for two readers: the game designer (my friend) deciding whether
this is worth building, and the engineer who would build it.

---

## 0. The one-paragraph answer

A Rimworld storyteller is really **two machines**: a *Director* (a control loop
that decides what event fires and when, modulated by a tension budget) and a
*World-Memory* (persistent, queryable continuity of who did what, who hates whom,
what was found where). **gbrain is the World-Memory half — and a genuinely strong
fit for it — but it is not the Director.** Its self-wiring typed-edge knowledge
graph turns gameplay history into queryable structure with *zero LLM cost per
write*, which is exactly what emergent, callback-rich narrative needs and what a
flat lore file (Karpathy's "llm wiki") cannot do. The recommendation: run a
**stripped gbrain as a sidecar** for memory, **build the Director yourself** (it
is ~hundreds of lines of deterministic game code that *queries* the memory), and
make **artifacts first-class entities whose discovery spills lore that the
Director reads as high-value callback material** — closing an artifact → lore →
event → artifact spiral that is the engine of the game's story.

---

## 1. Two machines, do not conflate them

| | **Director** | **World-Memory** |
|---|---|---|
| Job | Decide *what happens next* and *when* | Remember *everything that happened* |
| Shape | Control loop + tension budget + scoring | Knowledge store + retrieval + graph |
| Determinism | Must be deterministic (save/load, replay) | Reads deterministic; writes append-only |
| Latency | Real-time (per tick) | Sub-second reads; writes async |
| LLM in loop? | **No** (arithmetic + graph queries) | Only for narration & overnight summaries |
| Who builds it | **You** (game code) | gbrain (stripped) |

Rimworld's Cassandra/Phoebe/Randy are *Directors*. They are not knowledgebases.
gbrain and llm-wiki are *World-Memories*. They are not Directors. Evaluating
gbrain as "a storyteller" is a category error; evaluate it as the memory the
storyteller reads from. (This framing survived all review rounds and is the
single most important decision in the document.)

---

## 2. Why "emergent" forces a graph (and rules out the flat wiki)

The designer has committed to **emergent** narrative: story that arises from
gameplay history, not from a hand-authored tree. Emergence has one hard
requirement — the Director must be able to ask **relational questions about the
past**:

- "Does any colonist have an unresolved `rival_of` / `betrayed_by` edge to
  someone in the incoming raider faction?"
- "Who last `owned` the artifact the player just dug up, and how did they die?"
- "What event `caused_by`-chains back to the famine three winters ago?"

A flat markdown wiki (llm-wiki pattern: `index.md` + pages, no graph, no vector
search) **cannot answer these** without an LLM re-reading the corpus every tick —
too slow, too expensive, non-deterministic. gbrain answers them with a typed-edge
graph that **builds itself from wikilinks on every page write, with no LLM
calls**. That zero-cost self-wiring is the property that makes emergence
affordable at game tick rates. This is the core technical reason to prefer gbrain
over the flat-wiki pattern for *this* game.

The flat wiki still wins for a *small, hand-curated* lore bible. It loses the
moment story must compound from play. The designer wants the latter.

---

## 3. The `storybrain-base` schema pack

gbrain packs are YAML: `page_types` (each with a `primitive`, `path_prefixes`,
optional `subtypes`, `extractable`, `expert_routing`) plus `link_types` (with an
`inverse`). Edges auto-wire from `[[type/slug]]` wikilinks in page bodies. The
authored pack lives at `storybrain/schema/storybrain-base.yaml`; this section is
the rationale.

### 3.1 Page types

| Type | primitive | Why |
|---|---|---|
| `colonist` | entity | The dramatis personae. `expert_routing: true` so "who knows surgery" routes to a pawn. |
| `faction` | entity | Raiders, tribes, empires. Carries reputation/standing in frontmatter. |
| `location` | entity | Rooms, biomes, ruins, dungeon sites, the map itself. |
| `artifact` | entity | **First-class McGuffin.** See §4 — the story engine. |
| `lore` | media | World-building + **lore fragments** dropped by artifacts. Subtypes: `fragment`, `myth`, `codex`, `prophecy`. `extractable: true`. |
| `belief` | concept | Ideoligion / deity / cultural meme a faction or colonist `worships`. |
| `event` | temporal | THE workhorse. Every incident becomes one. `temporal` ⇒ feeds `timeline` + `find_trajectory`. Subtypes: `raid`, `social`, `disaster`, `quest`, `discovery`. `extractable: true`. |
| `chapter` | temporal | Arc/era summary, LLM-written overnight. The "Legends" view. |
| `power` | concept | A boon/ability an artifact `grants`. Kept a page (not just frontmatter) so it can carry its own lore + balance notes. |
| `curse` | concept | The dark side an artifact `bears`. Drives risk/reward in artifact hunting. |

Note: gbrain's bundled `gbrain-base-v2` already has a `lore` *atom subtype*; we
author `storybrain-base` as a **standalone pack** (`extends: null`), not an
extension of the VC-flavored default, so we own the whole taxonomy.

### 3.2 Link types (the relationship graph)

Social: `kin_of`↔`kin_of`, `rival_of`↔`rival_of`, `ally_of`↔`ally_of`,
`lover_of`↔`lover_of`, `member_of`↔`has_member`.

Action/history: `killed`↔`killed_by`, `betrayed`↔`betrayed_by`,
`saved`↔`saved_by`, `involves`↔`involved_in` (event→colonist),
`caused_by`↔`caused` (**event→event causal chains**).

Spatial: `located_at`↔`location_of`, `occurred_at`↔`site_of`.

Artifact (the story spine, §4): `hidden_at`↔`hides`, `sought_by`↔`seeks`,
`guarded_by`↔`guards`, `grants`↔`granted_by`, `bears`↔`borne_by` (curse),
`fragment_of`↔`has_fragment`, `forged_by`↔`forged`, `owned_by`↔`owns`,
`reveals`↔`revealed_by` (lore→figure/event), `drops`↔`dropped_by`
(artifact→lore fragment).

---

## 4. Artifacts: the story engine (the designer's headline feature)

The designer's stated centerpiece: **hunting for artifacts that drop lore and
drive the story.** This is not a cosmetic item system — it is the primary
narrative pump. StoryBrain models it as a self-reinforcing spiral:

```
   ┌──────────────────────────────────────────────────────────────┐
   │                                                                │
   │   ARTIFACT  ──hidden_at──►  LOCATION                           │
   │      │  sought_by ▲                  ▲ the hunt sends pawns    │
   │      │  guarded_by│                  │ here (a quest event)    │
   │      │            FACTION            │                         │
   │      │ drops                                                   │
   │      ▼                                                         │
   │   LORE FRAGMENT  ──reveals──►  FIGURE / ERA / past EVENT       │
   │      │                              │                          │
   │      │ the Director reads freshly-  │ named enemy, lost city,  │
   │      │ revealed lore as high        │ buried crime, prophecy   │
   │      │ callback_strength material   │                          │
   │      ▼                              ▼                          │
   │   NEW EVENT / QUEST  ──────►  often points at the NEXT artifact│
   │   (descendants seek revenge, the prophecy must be stopped,     │
   │    the other fragment must be found before the rivals get it)  │
   │      │                                                         │
   └──────┘  spiral repeats, each loop richer than the last        │
```

### 4.1 Anatomy of an artifact (frontmatter + graph)

An `artifact` page carries:

- `lore_fragments: [slug, …]` — the lore it can drop, **revealed progressively**.
  Found → reveal fragment 1; studied at a research bench → fragment 2; *used* in
  a crisis → fragment 3. Each reveal is a `drops`/`dropped_by` edge becoming
  *active* (frontmatter `revealed: true` on the fragment page).
- `power` / `curse` edges — a +X boon and a risk. The risk is what makes the hunt
  a *decision*, not a pickup.
- `fragment_of` — collect-them-all arcs. Three shards of one greater relic, each
  `hidden_at` a different site, `sought_by` a rival faction. Assembling them is a
  multi-chapter arc.
- `provenance` — `forged_by` an ancient figure, `owned_by` a chain of past
  owners (each death a lore beat), `lost_in` a past `event`.

### 4.2 The lore-drop mechanic, concretely

When an artifact is discovered or studied, the game engine writes a `lore`
page (subtype `fragment`) with body text like:

```markdown
---
type: lore
subtype: fragment
revealed: true
revealed_on_day: 412
tension: 0.7
---
# The Ashmark Was Forged to Kill a King

The blade [[artifact/ashmark]] bears an inscription in old imperial script.
[[colonist/vera]] translated it: it was [[lore/forged_by|forged]] by the
smith [[lore/the-grey-smith]] to end the line of [[faction/iron-empire]].
The Empire still hunts every shard. They will know it has surfaced.
```

That single write does three things automatically:
1. **Wires the graph** — edges to the artifact, the colonist, the smith, the
   faction appear with no LLM call.
2. **Becomes searchable** — vector + keyword, so "what do we know about the Iron
   Empire's enemies" surfaces it.
3. **Raises a flag the Director sees next tick** — a fresh, high-`tension` lore
   page mentioning a live faction is prime `callback_strength` material. The
   Director can spin an Iron-Empire raid whose *narration already has a reason*.

### 4.3 Why this is better on a graph than in a flat file

The payoff is **continuity the player feels was authored but wasn't**. Because
provenance and seekers are *edges*, the Director can ask at raid time: "is the
incoming faction `sought_by`-linked to any artifact the colony now `owns`?" If
yes, the raid is *about the artifact*, the narration cites the fragment, and the
player experiences a plot. A flat wiki has the text but cannot *query the
relationship at decision time* — so the connection never fires mechanically.

---

## 5. The Director (the piece you build)

gbrain is the sensorium; the Director is the will. The loop, each stage bound to
a real gbrain operation:

```
   ── every game-day tick (or incident slot) ───────────────────────────
   1. READ PACING STATE      (pure game code, no gbrain, no LLM)
        tension_budget = f(colony wealth, #colonists, days-since-hardship,
                           avg mood, current arc phase)
        decide: fire? how hard? what register (raid/social/discovery/quest)?

   2. SENSE DRAMATIC POTENTIAL   (gbrain reads — fast, deterministic, free)
        • get_recent_salience / search(tension-sorted) → what's hot
        • traverse_graph  → open grudges, debts, unrequited bonds,
                            artifacts owned vs. sought
        • find_trajectory → arcs ripe to pay off (rising rivalry, hunt nearing end)
        • find_anomalies  → surprising state worth dramatizing

   3. GENERATE + SCORE CANDIDATES   (game code; arithmetic over query results)
        resonance = w1·tension_fit       (matches the budget?)
                  + w2·callback_strength  (cites real graph history?)
                  + w3·character_stakes   (hits high-salience pawns?)
                  + w4·arc_advance        (moves an open artifact/feud arc?)
                  − w5·repetition         (too similar to recent events?)

   4. FIRE → engine resolves the chosen event in-game

   5. WRITE BACK → put_page events/… with [[…]] mentions
        graph self-wires → step 2 next tick sees the new history.  EMERGENT.

   (overnight / on chapter break) think + put_page chapter/… → "Legends" recap
   ────────────────────────────────────────────────────────────────────────────
```

**Tension model** (step 1): pure Rimworld, ~200 lines, no LLM, no gbrain.
Cassandra ramps, Phoebe lulls, Randy randomizes. You own it.

**Resonance scorer** (step 3): where gbrain earns its place. The naïve director
fires a wealth-scaled random raid. The emergent director asks the graph for a
raid that *pays off an open edge* — and the narration writes itself.

---

## 6. Integration architecture

- **Sidecar, not in-process.** gbrain is Bun/TS + PGLite (Postgres-in-WASM). A
  Unity/Godot/C++/C# game cannot embed it. Run `gbrain serve --http` as a child
  process; the game talks to it over local HTTP/MCP. The DB ships *with the save*
  (the PGLite data dir is per-save-game state).
- **Keep the LLM out of the tick loop.** Steps 1–3 are retrieval + graph +
  arithmetic: fast, free, deterministic. LLM (`think`) is reserved for *narration
  text* after an event is chosen, and overnight `chapter` summaries. Narration is
  cosmetic/regenerable — not part of save-state — which sidesteps LLM
  non-determinism.
- **Local embeddings.** A game generating thousands of events cannot pay
  per-write API embedding costs. gbrain ships Ollama / llama.cpp embedding
  recipes — use a local model so writes are free. (Or: defer embedding; the graph
  works without it, only vector search needs it.)
- **Determinism / save-load.** Graph queries and resonance math are
  deterministic. The PGLite dir + the brain git repo *are* the save. Only LLM
  narration is non-deterministic; treat it as a presentation layer.

### What to strip from gbrain (≈80% is overhead for a single-player game)

OAuth / HTTP auth, company-brain multi-user scoping + access control, the
skillpack system, the eval framework, the cron "dream cycle" (replace with your
own overnight chapter job), the MCP client matrix, most of the 136 ops. You need:
`put_page`, `get_page`, `search`, `traverse_graph` / `graph`, `find_trajectory`,
`get_timeline`, `add_link`, `get_links`, schema-pack load, and `think` for
narration. ~12 of 136 ops.

---

## 7. Honest risks & gaps (carried into the reviews)

1. **gbrain `salience` ≠ dramatic salience.** Built-in salience scores knowledge
   centrality, not narrative charge. We define our own `tension` frontmatter
   signal and query it; do not expect the built-in op to know a death out-weighs
   a trade. *(open — addressed in reviews)*
2. **Write throughput.** Human-brain pacing (meetings/emails) vs game tick rate.
   Auto-link is zero-LLM (fine), but embedding + any extraction must be batched /
   deferred / local. *(open)*
3. **PGLite single-writer.** `serve` + heavy writes contend for the write lock.
   A game's write pattern must be serialized or batched. *(open)*
4. **The Director is unbuilt.** gbrain gives memory, not will. The resonance
   scorer is the actual game-design work and the hard, fun part. *(by design)*
5. **Determinism of retrieval ranking.** Vector ranking can drift across
   embedding-model versions; pin the model per save. *(open)*
6. **Scope/complexity.** Adopting a 136-op company-brain to find out if a
   narrative loop is fun is backwards. Validate the loop cheaply first. *(open)*

---

## 8. Recommendation

Build the **emergent** version on gbrain-as-stripped-sidecar, with **artifacts as
the first-class story pump** (§4) and a **hand-built Director** (§5). Prove the
spine cheaply first: author `storybrain-base.yaml`, stand up a PGLite brain, seed
a tiny world, and run *one* artifact → lore → event loop end-to-end to confirm
the resonance query fires (see `storybrain/findings/`). Only then commit to the
full sidecar integration.
</content>
</invoke>
