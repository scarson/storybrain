# StoryBrain — Design & Implementation Specification

> **For agentic workers:** REQUIRED SUB-SKILL: Use a subagent-driven or
> sequential plan-execution workflow to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking. This document is fully
> self-contained — it assumes no prior context and references no external
> artifacts.

**Goal:** Build the persistent **world-memory** and **storytelling Director** for
a Rimworld-style sci-fi colony/expedition game in which **hunting artifacts that
drop lore and drive the story** is a headline mechanic and the narrative is
**emergent** (history-driven, never the same twice).

**Architecture:** A storyteller is two machines that must never be conflated. A
**Director** is a deterministic event-picker (graph queries + arithmetic, no LLM
in the per-tick loop). A **World-Memory** is a typed-edge graph store the Director
queries at decision time. Worlds are produced by a **four-stage generation
pipeline** (LLM theme-seed → deterministic abstract procedural causal-history
generator → LLM theme-clothing pass → LLM character & polish pass) and validated
by two hard gates before they ever load. Lore is stored as **structured facts**
(edges + frontmatter), revealed progressively during play; prose is a
deterministic, cached *rendering* of those facts — the LLM is a renderer and a
worldgen author, never the runtime author of canon.

**Tech Stack:** TypeScript, the [Bun](https://bun.sh) runtime, an embedded SQLite
store (`bun:sqlite`, or libSQL if you want replication later), and any frontier
LLM API used **only** for the offline generation and evaluation stages. No
server, no WASM, no network at runtime.

## Global Constraints

These are project-wide invariants. Every task's requirements implicitly include
this section.

- **The LLM is never in the per-tick Director loop.** The runtime is deterministic
  graph traversal plus bounded arithmetic. The LLM appears only in offline world
  generation, in optional cached prose rendering, and in the offline evaluation
  harness.
- **Canon is facts; prose is a render.** Authoritative, save-critical state is
  structured facts (typed edges + node frontmatter). Prose narration is a
  deterministic function of revealed facts, cached on `(facts_hash, seed,
  model_id)`. Regenerating prose can never change selection, the causal graph, or
  the save.
- **Every generated world MUST pass both gates before load:** the structural
  validator (`validateWorld`) and the character/quality lint (`characterLint`).
  Failure exits non-zero with precise errors. There is no silent success.
- **Determinism by seed.** The procedural generator and both bond rollers take an
  explicit integer seed and use the same `mulberry32` PRNG. Identical seed +
  identical input ⇒ identical output.
- **No theme-forcing in the procedural layer.** The deterministic generator emits a
  *neutral* causal topology (abstract event kinds, no theme verbs, no forced
  fate). All theme meaning is applied by a later LLM stage. This is load-bearing —
  forcing a theme in the procedural layer measurably degrades output quality.
- **Saves are forward context, not a phase here.** A robust save is a consistent
  store snapshot plus an append-only journal (flush, snapshot, replay-on-load;
  never snapshot a live store mid-write-batch). This plan does **not** build the
  save/journal system — it is noted so the store and runtime are designed to allow
  it later.

---

## Keeping this document current

This is a living document. Whoever implements a phase should leave it reflecting
reality, so the next reader does not have to reconstruct state from commit
history:

- **When you start a phase,** flip its Execution Status banner to 🚧 IN PROGRESS.
- **When you finish a phase,** flip the banner to ✅ DONE with the commit
  reference, and update the Execution Status table near the top.
- **If you defer a phase,** mark it ⏸ DEFERRED and write, in plain prose, the
  condition that must be met before it can be picked up.
- **If you deviate from the written plan** (drop a task, reorder, restructure),
  note the deviation inline in the affected task and add a one-line "Deviations"
  entry to the Execution Status table.
- **If you discover pre-existing problems** while implementing, add a
  "Discoveries" note near the top so later work does not re-find them.

The bookkeeping above is project ceremony — adapt the exact form (commit refs,
PR links, branch names) to your own workflow. The point is only that the document
stays honest about what is built and what is not. Writing this at the moment of
change is cheap; reconstructing it later is expensive.

---

## Execution Status

**Overall:** Not started.

| Phase | Status | Ship SHA(s) | Notes |
|---|---|---|---|
| 1 — World schema & validator | ⬜ Not started | — | — |
| 2 — Embedded edges store & query catalog | ⬜ Not started | — | — |
| 3 — Abstract procedural generator | ⬜ Not started | — | — |
| 4 — LLM generation pipeline | ⬜ Not started | — | — |
| 5 — Character & quality lint | ⬜ Not started | — | — |
| 6 — Director resonance loop | ⬜ Not started | — | — |
| 7 — Firsthand artifact↔character bonds | ⬜ Not started | — | — |
| 8 — Secondhand (inherited) bonds | ⬜ Not started | — | — |
| 9 — Blind evaluation harness | ⬜ Not started | — | — |
| 10 — Runtime hunt-loop integration | ⬜ Not started | — | — |

---

# Part I — Design

Part I explains the *why* and the *what* so a reviewing agent can judge, adapt,
or extend the approach before building. Part II turns it into bite-sized,
test-first tasks. Read Part I in full first.

## 1. Two machines, never conflated

A storyteller = a **Director** (decides what happens next, on a tension budget —
*you build this*) + a **World-Memory** (remembers everything, queryably — the
store). Named AI storytellers in the genre are Directors, not knowledgebases.

The Director keeps the LLM **out of the per-tick loop** (graph queries +
arithmetic only). The LLM appears solely as (a) an offline world generator, (b)
an optional cached lore/narration renderer, and (c) an overnight recap writer.
This split is what makes the runtime cheap, deterministic, and save-safe.

## 2. Why "emergent" forces a typed graph

Emergence means answering *relational questions about the past at decision time*:
"who holds a grudge against the raiders who just appeared, and do we own something
they want?" A flat wiki cannot answer that without an LLM re-reading the whole
corpus every tick; a **typed-edge graph** answers it in microseconds with a
recursive SQL query.

So the substrate is a graph of typed edges, written explicitly by the engine (the
engine already knows the relationship — no NLP guessing), queried in both
directions (write one direction, traverse the other; do **not** materialize
inverse edges).

## 3. The world data model

The world is JSON with three top-level keys:

```ts
type WorldNode = {
  slug: string;            // unique id, conventionally "type/name", e.g. "colonists/bren"
  type: string;            // see node types below
  tension?: number;        // dramatic charge ∈ [0,1] (engine-stamped at runtime)
  day?: number;            // in-world day this node came into being
  facts?: Record<string, any>;   // structured frontmatter (skills, want, alien_type, ...)
};

type Edge = [string, string, string] | [string, string, string, number]; // [src, verb, dst, day?]

type World = {
  nodes: WorldNode[];
  edges: Edge[];
  mystery: { fragments: string[]; order: string[]; order_relation?: OrderRelation };
};
```

### 3.1 Node types

`colonist` · `faction` · `location` · `artifact` · `lore` · `belief` · `event` ·
`arc` · `chapter` · `power` · `curse` · `figure` (a named historical/ancestral
person) · `note`.

**Alien civilizations are `faction` nodes** carrying `facts.alien_type`. A
single controlled vocabulary on `facts.alien_status` keeps alien presence varied
across worlds rather than always "a fallen civilization":

`living` (present, has agency now) · `active` (operating, indifferent) ·
`dormant` (sleeping, wakeable) · `absent` (makers gone, no corpse) · `hidden`
(present, unseen) · `ambiguous` (alive-or-dead undecided) · `extinct` / `fallen` ·
`ancestral`.

Optional, deliberately *not* always present: `facts.psychic ∈ {none, subtle,
overt}` (default `none` for most worlds — psychic powers are a flavor, not a
mandate). `facts.resource_centrality ∈ {none, low, moderate, high, core}` scales
how much a resource-exploitation theme drives the world.

### 3.2 Edge verbs

Edges are plain string verbs. The working set, grouped by role:

- **Social:** `kin_of`, `rival_of`, `ally_of`, `lover_of`, `member_of`, `owes`,
  `grudge_against`, `betrayed_by`, `estranged_from`.
- **Directional relationship (richer cast wiring — see §9):** `mentor_of` /
  `mentored_by`, `role_model_of` / `reveres`, `protege_of`,
  `predecessor_of` / `successor_of` (held the same post), `ancestor_of` /
  `descendant_of` (explicit lineage), `commands` / `served`.
- **History:** `killed`, `killed_by`, `saved`, `involves`, `caused_by`.
- **Spatial:** `located_at`, `occurred_at`.
- **Artifact spine:** `hidden_at`, `rumored_at`, `sought_by`, `guarded_by`,
  `grants` (→ power), `bears` (→ curse), `fragment_of`, `forged_by`, `owned_by`,
  `lost_in`, `drops` (→ lore), `reveals` (→ the entity a lore fact concerns),
  `wielded`, `bonded_to`, `died_for`, `sealed`, `covets`.
- **Player-choice fate:** `destroyed`, `sold`, `sealed`, `ignored`.
- **Arc wiring:** `advances`, `resolves`, `worships`.

Write one direction; query the other with backlink traversal.

### 3.3 The central mystery (generalized)

Every world has one central mystery: a chain of `lore` fragments. `fragments`
lists the fragment slugs; `order` is the *reconstruction sequence*;
`order_relation` is the edge verb linking consecutive fragments and naming what
the sequence *means* for this world:

| `order_relation` | The mystery is… |
|---|---|
| `caused_by` | a cause chain (what led to what — e.g. why something fell) |
| `enables` | a purpose-build (what this was *for*) |
| `prerequisite` | a containment/recipe (how to seal or assemble) |
| `precedes` | a provenance/timeline (true ordering of events) |
| `reveals` | a slow disclosure ("it was us all along") |

Generalizing past a single "why it fell" chain is important: it lets the same
machinery carry diverse stories. The reconstruction = the revealed fragments in
declared order:

```ts
function reconstructMystery(w: World): string[] {
  const revealed = new Set(w.nodes.filter(n => n.facts?.revealed === true).map(n => n.slug));
  return w.mystery.order.filter(f => revealed.has(f));
}
```

## 4. Lore as facts (the headline mechanic, made coherent)

"Artifacts drop lore that drives the story" only stays coherent, cheap, and
save-safe if you separate three layers:

1. **Fact skeleton (authoritative, deterministic).** Each artifact ships a bundle
   of *latent lore facts* — edges + structured frontmatter with `revealed: false`.
   These are tiny and consistent by construction.
2. **Reveal state (gameplay-driven).** "Dropping lore" = flipping the next latent
   fact to `revealed: true` (found → fact 1; studied → fact 2; used-in-crisis →
   fact 3). A pure state change. The Director reads only *revealed* facts.
3. **Prose (presentation, regenerable, NOT save-critical).** Rendered from
   revealed facts. Default mode is **templated** (`"The {artifact} was forged by
   {forger} to end the line of {target}."`) — zero LLM, instant, reproducible.
   Optional mode is **LLM-polished**, with determinism preserved by caching keyed
   on `(facts_hash, seed, model_id)`.

This resolves three otherwise-hard problems at once:

- **Determinism vs regenerable narration:** both are true because the Director
  keys off facts, never prose. Regenerating prose cannot change selection.
- **Compaction:** drop/blank old prose bodies, keep all facts (edges +
  frontmatter) forever. Never delete the graph. In SQL: `UPDATE nodes SET
  body=NULL`.
- **Contradictions:** a renderer given a consistent fact skeleton cannot invent a
  contradictory forger. (It does not prevent a *designer or generator* authoring
  two conflicting facts — that is a cheap deterministic lint over the fact table,
  not an LLM probe.)

### 4.1 Is this actually emergent?

Yes — **combinatorially**, which is exactly how the genre's celebrated emergence
works. Rimworld does not invent new event *types* per playthrough; it draws from a
fixed authored pool. The emergence is the **weave**: authored templates × the
genuinely emergent colony state. StoryBrain applies the same model to lore:

- **Myth layer (authored or generated): stable canon.** Artifacts and their
  fact-skeletons. Finite, consistent, deterministic.
- **Chronicle layer (emergent): novel every run.** The colony graph — deaths,
  grudges, romances, betrayals, who went on which hunt, who wielded the cursed
  blade when their mood broke. Invented by gameplay.
- **The story = the weave.** The Director threads the fixed myth through the
  emergent chronicle. The *same* artifact myth produces a raid on one colonist's
  grudge in one colony and a raid on another's feud in a second, purely because
  the chronicles differ. No author wrote either sentence.

Content budget (if hand-authoring the myth layer): roughly 30–60 artifacts × 3–5
latent facts each, plus 10–20 rumor/threat templates. Because the weave is
combinatorial against an unbounded chronicle, that modest corpus yields
effectively unbounded distinct stories. Generating the myth layer instead is the
generation pipeline of §6 — the store does not change either way.

## 5. The artifact hunt loop

Hunting must be a *loop with stakes at every step*, not a fetch quest:

```
 RUMOR        a lore/rumor reveals the artifact EXISTS + a FUZZY region (not the
   │          exact site). Multiple rumors triangulate. (rumored_at → region)
   ▼
 DECIDE TO    costs: send N colonists for M days (the colony is undefended),
 HUNT │       supplies, travel risk. A real trade-off.
   ▼
 THE SITE     guarded_by faction/beast (fight or heist), hazards, and a RIVAL
   │          faction racing you on a clock. Arrive late → it's owned_by the
   │          rival now → a new arc.
   ▼
 THE FIND     grants POWER, bears CURSE (risk/reward), maybe fragment_of a set
   │          (collect arc). Drops its FIRST lore fact.
   ▼
 STUDY / USE  reveals deeper facts progressively. Each reveal can spawn the next
   │          rumor or threat.
   ▼
 FATE CHOICE  keep / destroy / sell / seal. Writes a fate edge the Director and
              factions respect (destroying a relic enrages its seekers; sealing
              calms them).
```

Location *uncertainty* + the *rival clock* + the *curse trade-off* + the *fate
choice* are what make it a loop. None of this is store work — it is game design
the store merely remembers.

### 5.1 Artifact archetypes

Same `artifact` node type, different fact-skeleton + edge profile, so the store
handles them uniformly while they play distinctly. A world mixes these:

| Archetype | Edge/fact profile | How it drives story |
|---|---|---|
| **Weapon-relic** | `grants` power, `bears` curse, `forged_by`, `sought_by` | a usable boon whose history makes you a target |
| **Shard-set** | `fragment_of` a greater relic; each shard `hidden_at` + `sought_by` a rival | a multi-chapter collect-arc with a race |
| **Lost codex** | `drops` many `reveals` facts, no power | a pure lore engine — found to *read* |
| **Cursed idol** | heavy `bears` curse, weak `grants` | risk-forward slow burn the Director escalates |
| **Key / map** | `reveals` → `location`, `rumored_at` | unlocks the NEXT hunt site — chains hunts |
| **Faction heirloom** | `owned_by` → faction (history), `sought_by` original owner | a diplomacy lever / fate fork |
| **Living relic** | facts reveal on a timer / after N uses; `tension` rises each reveal | grows more dangerous the longer held |
| **Prophecy-object** | `reveals` → a future-tagged arc | seeds a foretold arc (dramatic irony) |

## 6. The generation pipeline (four stages)

Worlds are generated offline by a four-stage pipeline. This shape is a
recommendation, not a proven optimum: in earlier exploration, single-shot LLM
generation, a theme-forcing procedural step, and a neutral procedural step were
compared with the blind-judge method of §10 and the configuration below came out
ahead — but you should re-validate it with your own models and content using the
Phase 9 harness before treating it as settled.

```
 STAGE 1  THEME SEED (LLM)
   │  Input: a small "tag set" — id, hook, tags, alien_status, psychic,
   │  resource_centrality, artifact_flavor, and the mystery order_relation.
   │  Output: theme parameters that downstream stages honor.
   ▼
 STAGE 2  ABSTRACT PROCEDURAL GENERATOR (deterministic, no LLM)
   │  Emits a dense, internally-consistent causal TOPOLOGY: entities + dated
   │  caused_by event chains + a guaranteed climax + a mystery-fragment chain in
   │  the configured order_relation. NEUTRAL throughout — abstract event kinds
   │  (initiative/interaction/commitment/turn), NO theme verbs, NO forced fate,
   │  NO leak fields. Seeded ⇒ reproducible.
   ▼
 STAGE 3  THEME CLOTHING (LLM)
   │  Renames the neutral events per theme, honors alien_status / psychic /
   │  resource_centrality, builds 5–8 hunt-able artifacts (varied archetypes per
   │  artifact_flavor) that DROP the mystery fragments, prunes scaffolding.
   │  Must keep the mystery spine intact. MUST pass validateWorld.
   ▼
 STAGE 4  CHARACTERS & POLISH (LLM)
   │  Deepens the cast WITHOUT touching the mystery/artifact spine: skills + a
   │  want on every colonist, a dense colonist↔colonist social graph, 1–2 named
   │  alien characters, richer directional relationships + seeded secondhand
   │  chains (§9). Fixes quality nits. MUST pass validateWorld AND characterLint.
   ▼
 World JSON → embedded SQLite edges store.
```

**Why the abstract (neutral) procedural layer matters.** A procedural step that
hard-codes a theme mechanic (e.g. "resource over-extraction → collapse") leaks
its scaffolding labels and forced fate into the final world and *measurably lowers
quality* on themes that are not about that mechanic. Removing every forcing
function while keeping the procedural *value* (a deterministic, consistent causal
skeleton at a scale the LLM does not have to invent or keep straight) is the
winning configuration.

### 6.1 The abstract procedural generator (reference implementation)

```ts
// Emits a neutral causal topology the LLM later clothes. Seeded ⇒ reproducible.
import type { World, WorldNode, Edge, OrderRelation } from "./schema";

export type Templates = {
  civs: { name: string; archetype: string; trait: string; greed: number }[];
  resources: { name: string; danger: number }[];
  epochs: number;
  cascadeThreshold: number;
  order_relation?: OrderRelation;   // MUST be a valid relation — the pipeline passes only these
};

// NOTE: this layer emits three *neutral* structural verbs outside the §3.2 working
// set — `involves`, `concerns`, `involved_in` — plus `caused_by` and the mystery
// `order_relation`. Stage 3 (theme clothing) is responsible for rewriting events
// into final form; these neutral verbs are not expected by the Director or lint.

// The canonical seeded PRNG (mulberry32) lives in `src/util/rng.ts` and is shared
// by the procedural generator AND both bond rollers — every seeded path in the
// project MUST import this one function so determinism is uniform:
//
//   // src/util/rng.ts
//   export function mulberry32(seed: number) {
//     let s = seed >>> 0;
//     return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
//       t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
//   }
import { mulberry32 } from "../util/rng";
const rng = mulberry32;
const slug = (t: string, n: string) => `${t}/${n}`;

// NEUTRAL structural roles, not theme actions. Stage 3 renames them.
type AbsKind = "initiative" | "interaction" | "commitment" | "turn";

export function runProcgen(tpl: Templates, seed: number): World {
  const r = rng(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const nodes: WorldNode[] = [];
  const edges: Edge[] = [];
  const add = (n: WorldNode) => { nodes.push(n); return n.slug; };
  const link = (s: string, v: string, d: string, day: number) => { edges.push([s, v, d, day]); };
  const REL = tpl.order_relation ?? "caused_by";

  // entities: themed names, NO fate forced, NO scaffolding fields.
  add({ slug: "factions/humans", type: "faction", tension: 0.4, facts: { role: "newcomers" } });
  for (const c of tpl.civs)
    add({ slug: slug("civs", c.name), type: "faction", tension: 0.55,
          facts: { alien_type: c.archetype, trait: c.trait } });
  for (const res of tpl.resources)
    add({ slug: slug("locations", res.name + "-site"), type: "location",
          tension: 0.3 + res.danger * 0.25, facts: { subject: res.name } });

  const ents = tpl.civs.map(c => ({ name: c.name, weight: c.greed, last: "" as string }));
  let momentum = 0, day = 0, n = 0;
  const fragments: string[] = [];
  let climaxed = false;

  const event = (kind: AbsKind, actor: string, mag: number, cause?: string) => {
    const s = slug("events", `${n++}-${kind}`);
    add({ slug: s, type: "event", tension: 0.4 + mag * 0.3,
          facts: { abstract_kind: kind, actor, magnitude: Number(mag.toFixed(2)), placeholder: true } });
    link(s, "involves", slug("civs", actor), day);
    if (cause) link(s, "caused_by", cause, day);
    return s;
  };

  const fireClimax = () => {
    climaxed = true;
    const climax = event("turn", ents[0].name, 0.95);
    (nodes.find(x => x.slug === climax)!.facts as any).climax = true;
    let prev = climax;
    const involved = ents.slice().sort((a, b) => b.weight - a.weight).slice(0, Math.min(4, ents.length));
    for (const ent of involved) {
      const frag = add({ slug: slug("lore", `thread-of-${ent.name}`), type: "lore", tension: 0.8,
        facts: { subtype: "fragment", revealed: false, about: ent.name, placeholder: true } });
      link(frag, REL, prev, day);                                  // chain in the configured relation
      link(slug("civs", ent.name), "involved_in", climax, day);    // neutral, not "fell to"
      fragments.push(frag); prev = frag;
    }
  };

  for (let e = 0; e < tpl.epochs; e++) {
    day += 100;
    for (const ent of ents) {
      const roll = r();
      const kind: AbsKind = roll < 0.5 ? "commitment" : roll < 0.8 ? "interaction" : "initiative";
      const mag = 0.3 + r() * 0.6 * ent.weight;
      const ev = event(kind, ent.name, mag, ent.last || undefined);
      if (kind === "commitment") {
        const res = pick(tpl.resources);
        link(ev, "concerns", slug("locations", res.name + "-site"), day);
        momentum += res.danger * ent.weight * 0.5;
      }
      if (kind === "interaction") {
        const other = pick(ents.filter(o => o.name !== ent.name) ?? ents);
        if (other && other.last) link(ev, "caused_by", other.last, day);
      }
      ent.last = ev;
    }
    if (momentum >= tpl.cascadeThreshold) { fireClimax(); break; }   // neutral climax
  }
  if (!climaxed) fireClimax();   // guarantee a climax + mystery even if momentum stayed low

  return { nodes, edges, mystery: { fragments, order: [...fragments], order_relation: REL as any } };
}
```

### 6.2 Skill profiles — match the world's frame

Skills must match the premise. Stamp `facts.skill_profile` and use the fitting
axis set:

- **Ship-crew / expedition** (spacefaring, salvage, survey, generation-ship,
  merchant, explorers): `piloting`, `navigation`, `engineering`, `sensors`,
  `gunnery`, `life_support`, `eva`, `xeno` (xenolinguistics/xenology), `command`.
  Stamp `facts.crew_role` (pilot/engineer/navigator/gunner/medic/envoy/…).
- **Colonist / settler** (planetside homestead/colony): `medicine`, `research`,
  `social`, `construction`, `growing`, `crafting`, `combat`. Stamp
  `facts.colony_role`.

Mixed casts may blend; set `skill_profile: "mixed"`. **Skill levels are authored
on a 0–20 scale** (`facts.skills` is a map like `{ engineering: 14, xeno: 6 }`),
which is what the bond roller's `sk()` normalizer (§8.1) divides by — generated
skills MUST stay in that range.

**Social-graph density is defined once, here, so the generator and the lint
agree:** `density = (number of colonist↔colonist relationship edges) / (number of
colonist nodes)`. A relationship edge counts if both endpoints are `colonist`
nodes and the verb is in the credited relationship set (§3.2 social + directional
verbs). The Phase-4 generator targets `density ≥ 1.0`; the Phase-5 lint fails
below it. Count each edge once (do not double-count by also counting its reverse).

## 7. The Director (you build this)

Loop: `1. pacing state → 2. sense (graph queries) → 3. score → 4. fire → 5. write
back (event + edges + advance arc)`. The LLM is never in this loop.

All terms are normalized to `[0,1]` so resonance has a stable, comparable scale:

```
resonance = w_arc·arc_advance + w_cb·callback_strength + w_char·character_stakes
          + w_val·valence_fit  + w_tens·tension_fit
          − w_rep·repetition   − w_fix·fixation

worked weights: arc .25, cb .30, char .10, val .10, tens .15, rep .25, fix .25
⇒ resonance ∈ roughly [−0.5, 0.9]; weights are tunable, scores comparable.
```

**`callback_strength` — top-K, NOT a full sum:**

```
callback_strength(candidate→F) =
  ( Σ over the TOP-K highest-charge revealed STAKE edges into F of
        tension(from(e)) · recency_decay(e.day) ) / K            ∈ [0,1]

recency_decay(d) = 0.5 ^ ((today − d) / HALF_LIFE)
```

Why top-K and not Σ-all: an unbounded sum lets a hub of many low-charge edges
(say 60 anonymous grunts) swamp a few high-charge ones, so the Director fixates on
whoever has the most connections regardless of drama. Narration cites a few
*named* stakes; so should the scorer. Count **stake edges** (grudges, seekers,
reveals, provenance), never the Director's own `involves` bookkeeping — that would
snowball the target's score every tick it fires.

Other terms:

- `tension(node)` **originates as engine sim-state held in game memory** (combat,
  mood, deaths, reveals stamp it) — that is where the game-design work lives, and
  no store can derive it for you. But the Director reads it through the store
  (`callbackTopK` selects `tension` from the `nodes` table), so the engine
  **mirrors** the current value into the `nodes.tension` column whenever it
  changes (e.g. `discover` in Phase 10 does `UPDATE nodes SET tension=? WHERE
  slug=?` for the bonded character). "Not a graph field" means tension is never
  *computed* from edges and never the subject of a join — it is a denormalized
  scalar the engine owns and pushes down, so there is no N+1 query.
- `arc_advance` is a single additive 0/1 term (matches an open arc's `next_beat`;
  no multiplier).
- `valence_fit = 1 − |cand.valence − budget_valence| / 2` (alternate dread/relief).
- `repetition` / `fixation` = fraction of the last N events sharing the
  candidate's kind / faction — the anti-treadmill guards.
- **Fate choices feed the scorer:** a `destroyed` artifact raises its seekers'
  faction tension (revenge); `sealed` lowers it.

**Arc state machine:** `seed → rumor → rising → climax → resolution → dormant`. A
matching fired event advances the phase and resets `days_since_advance`;
`days_since_advance > θ` with no progress forces toward `resolution` (anti-stall);
`resolution` writes a `chapter` and goes `dormant`. Keep 1–3 arcs open at once;
per-faction/arc cooldowns + a max-share cap prevent fixation.

**Success metric (the key open validation gate):** a blind rater shown N Director
picks interleaved with N hand-authored beats cannot reliably tell them apart
(target: near chance). The normalized scorer makes this computable; running it on
a rich multi-tick world with real tension stamping is the make-or-break test.

### 7.1 Director tick (reference implementation)

This is the **authoritative** signature set — Phase 6 implements exactly these.
The weights match the §7 formula term-for-term (all seven terms present). The
**candidate list is an input**, not hardcoded: the game produces the beats it
could fire this tick, each tagged with a `valence` (its dread/relief charge) and
whether it `advancesArc`. `budgetValence` is the pacing target (alternate dread
and relief across ticks).

```ts
// One Director step over the SQLite store. Deterministic; no LLM.
const HALF = 40, TOPK = 3;
const W = { arc: 0.25, cb: 0.30, char: 0.10, val: 0.10, tens: 0.15, rep: 0.25, fix: 0.25 };

// Stake edges carry narratable drama. NEVER include `involves` (the Director's own
// event bookkeeping) — counting it would snowball a target's score every tick it fires.
const STAKE_VERBS = new Set([
  "rival_of", "grudge_against", "betrayed_by", "killed_by", "sought_by",
  "owned_by", "forged_by", "reveals", "worships",
]);

type Candidate = {
  id: string;
  kind: string;
  faction?: string;
  valence: number;       // [-1,1] — dread(−)/relief(+) charge the game assigns each beat kind
  advancesArc: boolean;  // true if this beat matches an open arc's next_beat
};
type Arc = {
  slug: string;
  phase: "seed" | "rumor" | "rising" | "climax" | "resolution" | "dormant";
  next_beat: { kind: string; faction?: string };
  days_since_advance: number;
};

const tens = (db: any, s: string) => (db.query("SELECT tension FROM nodes WHERE slug=?").get(s) as any)?.tension ?? 0.2;
const rec  = (d: number, today: number) => Math.pow(0.5, (today - d) / HALF);

function callbackTopK(db: any, F: string, today: number) {
  const inc = (db.query("SELECT src,verb,day FROM edges WHERE dst=?").all(F) as any[])
              .filter(e => STAKE_VERBS.has(e.verb));
  const c = inc.map(e => ({ v: tens(db, e.src) * rec(e.day, today), col: e.src.startsWith("colonists/") ? e.src : null }))
               .sort((a, b) => b.v - a.v).slice(0, TOPK);
  return { cb: c.reduce((s, x) => s + x.v, 0) / TOPK, chars: new Set(c.map(x => x.col).filter(Boolean)).size };
}

// scoreCandidates returns EVERY candidate with its resonance `r`, sorted best-first.
// tick is just its head. Phase 10's loop-closing test (and any UI that wants to show
// "why this beat") reads the full array, so a non-winning candidate's `r` is available.
function scoreCandidates(db: any, cands: Candidate[], history: { kind: string; faction?: string }[],
                         today: number, budgetValence: number): (Candidate & { r: number })[] {
  const recent = history.slice(-4);
  return cands.map(c => {
    const F = c.faction;
    const { cb, chars } = F ? callbackTopK(db, F, today) : { cb: 0, chars: 0 };
    const tensFit = F ? 1 - Math.abs(tens(db, F) - 0.7) : 0.4;
    const valFit  = 1 - Math.abs(c.valence - budgetValence) / 2;
    const arc     = c.advancesArc ? 1 : 0;
    const rep = recent.filter(h => h.kind === c.kind).length / Math.max(recent.length, 1);
    const fix = F ? recent.filter(h => h.faction === F).length / Math.max(recent.length, 1) : 0;
    const r = W.arc * arc + W.cb * cb + W.char * (Math.min(chars, 3) / 3) + W.val * valFit
            + W.tens * tensFit - W.rep * rep - W.fix * fix;
    return { ...c, r };
  }).sort((a, b) => b.r - a.r);
}

function tick(db: any, cands: Candidate[], history: { kind: string; faction?: string }[],
              today: number, budgetValence: number) {
  return scoreCandidates(db, cands, history, today, budgetValence)[0];   // the winning beat
}

// Arc state machine: a matching fired beat advances the phase; a stall forces resolution.
const PHASES = ["seed", "rumor", "rising", "climax", "resolution", "dormant"] as const;
function advanceArc(arc: Arc, fired: Candidate, stallTheta: number): Arc {
  const matched = fired.kind === arc.next_beat.kind && fired.faction === arc.next_beat.faction;
  if (matched) {
    const i = PHASES.indexOf(arc.phase);
    return { ...arc, phase: PHASES[Math.min(i + 1, PHASES.length - 1)], days_since_advance: 0 };
  }
  if (arc.days_since_advance > stallTheta && arc.phase !== "dormant")
    return { ...arc, phase: "resolution", days_since_advance: 0 };  // anti-stall
  return { ...arc, days_since_advance: arc.days_since_advance + 1 };
}
```

## 8. Firsthand artifact↔character bonds

When an item is discovered, the system rolls a *potential* relationship to an
existing character — but only where they already resonate on a concrete signal,
and it **declines by default** when nothing fits. That gate is what makes the
links feel earned, not forced. **Never roll flat. Roll resonance, decline by
default. No signal → no bond — the item stays an item.**

**Fit signals, in priority order:**

1. **Provenance (strongest):** the item is tied (via `forged_by`/`owned_by`/
   `sought_by`) to someone the character is tied to (their faction, kin, rival).
   Relations: `heir_to` (its maker is their people/kin), `vendetta_over` (its
   maker is a rival), `recognizes` (a looser tie), `denies_to` (a faction they
   oppose also wants it).
2. **Skill/role:** the item suits what they are good at — `decoded` (a codex, by
   xeno/research), `wields` (a weapon, by gunnery/combat), `operates` (a key/core,
   by engineering).
3. **Passion/power:** `attuned_to` when the artifact's `grants` power matches a
   passion.
4. **Want:** `covets` when the artifact answers the character's `want`.
5. **Curse/valence:** `haunted_by` for the vulnerable when it `bears` a curse.

**Dials that keep it sparse and interesting:** a fit threshold (the unforced
gate); a rarity probability (even a fitting item only sometimes bonds, so bonds
feel special); a per-character cap (spreads bonds across the cast); a dramatic
bonus (a candidate scores higher if forming it creates conflict — a rival claim,
or a bond cutting against an existing social tie). Everything is a seeded,
reproducible roll.

A bond is **callback fuel**: when a bonded artifact surfaces in an event, the
bonded character's `tension` spikes, raising the Director's `callback_strength`
for events involving them — so the Director naturally stages a beat around the
person with a stake in that object. The hunt becomes personal.

### 8.1 Firsthand roller (reference implementation)

> The block below shows the fit/candidate logic. The shipped function MUST
> **return** a structured `Bond[]` (`{char, rel, artifact, fit, why}`) rather than
> print — printing is only for the offline calibration CLI. The caller (the
> runtime, §5/Phase 10) writes the chosen bonds into the store as edges.

```ts
// Resonance-gated; declines by default. Seeded ⇒ reproducible.
const THRESHOLD = 0.5;   // below this, no bond — the unforced gate
const P_BOND = 0.7;      // rarity: even with a fit, only sometimes does a bond form
const CAP = 2;           // per-character cap

const sk = (c: any, ...keys: string[]) => Math.max(0, ...keys.map(k => (c.facts?.skills?.[k] ?? 0))) / 20;
const wantHas = (c: any, ...kw: string[]) => { const t = (c.facts?.want ?? "").toLowerCase(); return kw.some(k => t.includes(k)) ? 1 : 0; };
const artText = (a: any) => ((a.facts?.title || "") + " " + (a.facts?.detail || "") + " " + (a.facts?.archetype || "")).toLowerCase();

function candidates(c: any, a: any, out: (s: string, v: string) => string[], social: (c: string) => any[]) {
  const cands: { rel: string; fit: number; why: string }[] = [];
  const arche = (a.facts?.archetype || "").toLowerCase();
  const maker = out(a.slug, "forged_by").concat(out(a.slug, "owned_by"));
  const seekers = out(a.slug, "sought_by");
  const curses = out(a.slug, "bears"); const powers = out(a.slug, "grants");
  const soc = social(c.slug);
  const tiedTo = (slug: string) => soc.find(e => e[2] === slug);
  const isOfFaction = (f: string) => c.facts?.faction === f || soc.some(e => e[1] === "member_of" && e[2] === f);

  // 1) PROVENANCE — strongest
  for (const m of maker) {
    if (isOfFaction(m)) cands.push({ rel: "heir_to", fit: 0.9, why: `made by their own people (${m.split("/").pop()})` });
    const t = tiedTo(m);
    if (t) { const v = t[1];
      if (v === "kin_of") cands.push({ rel: "heir_to", fit: 0.85, why: `its maker is their kin` });
      else if (v === "rival_of" || v === "grudge_against") cands.push({ rel: "vendetta_over", fit: 0.8, why: `its maker is a rival` });
      else cands.push({ rel: "recognizes", fit: 0.62, why: `its maker is tied to them (${v})` });
    }
  }
  for (const f of seekers) { const t = tiedTo(f); if (t && (t[1] === "rival_of" || t[1] === "grudge_against"))
    cands.push({ rel: "denies_to", fit: 0.72, why: `a faction they oppose also wants it` }); }

  // 2) SKILL/ROLE
  if (/codex|tablet|ledger|record|archive|stele|chart|log/.test(arche) || /inscri|decode|glyph|map/.test(artText(a)))
    { const s = sk(c, "xeno", "research", "sensors"); if (s > 0) cands.push({ rel: "decoded", fit: 0.4 + 0.5 * s, why: `a specialist who reads it` }); }
  if (/weapon|blade|gun|sword|lance/.test(arche + artText(a)))
    { const s = sk(c, "gunnery", "combat", "melee", "eva"); if (s > 0) cands.push({ rel: "wields", fit: 0.4 + 0.5 * s, why: `a fighter who can wield it` }); }
  if (/key|sigil|core|control|engine|loom|machine/.test(arche + artText(a)))
    { const s = sk(c, "engineering", "piloting", "crafting"); if (s > 0) cands.push({ rel: "operates", fit: 0.4 + 0.5 * s, why: `an engineer who can run it` }); }

  // 3) PASSION/POWER
  for (const p of powers) { const dom = p.split("/").pop()!.replace(/-/g, " ");
    if ((c.facts?.passions || []).some((ps: string) => dom.includes(ps) || artText(a).includes(ps)))
      cands.push({ rel: "attuned_to", fit: 0.6, why: `its power resonates with their passion` }); }

  // 4) WANT
  if (wantHas(c, ...artText(a).split(/\W+/).filter(x => x.length > 5).slice(0, 8)))
    cands.push({ rel: "covets", fit: 0.66, why: `it speaks to their want` });

  // 5) CURSE/VALENCE
  if (curses.length && (wantHas(c, "fear", "lose", "lost", "guilt", "grief") || sk(c, "life_support", "social") < 0.35))
    cands.push({ rel: "haunted_by", fit: 0.58, why: `it bears a curse and they are exposed` });

  return cands;
}
```

The outer driver wires the accessors (built from `world.edges`, where every edge
is a `[src, verb, dst, day?]` tuple — `verb` at index 1, `dst` at index 2),
applies the gate/rarity/cap dials, and assembles the returned `Bond[]`. It uses
the same seeded `mulberry32` PRNG as the procedural generator (factor it into a
shared util and import it everywhere a seed is consumed):

```ts
import { mulberry32 } from "../util/rng";   // the rng() factory shown in §6.1, shared
type Bond = { char: string; rel: string; artifact: string; fit: number; why: string };

export function rollFirsthand(world: { nodes: any[]; edges: any[] }, seed: number): Bond[] {
  const r = mulberry32(seed);
  const cast = world.nodes.filter(n => n.type === "colonist");
  const arts = world.nodes.filter(n => n.type === "artifact");
  const out = (s: string, v: string) => world.edges.filter(e => e[0] === s && e[1] === v).map(e => e[2]);
  const SOCIAL_VERBS = ["kin_of","rival_of","grudge_against","owes","lover_of","ally_of","member_of"];
  const social = (c: string) => world.edges.filter(e => e[0] === c && SOCIAL_VERBS.includes(e[1]));

  const bonds: Bond[] = [];
  const perChar = new Map<string, number>();
  const BONDED_VERBS = ["heir_to","vendetta_over","covets","wields","decoded","operates","attuned_to","haunted_by","recognizes","denies_to"];

  for (const a of arts) {
    const existingBonders = new Set(world.edges.filter(e => e[2] === a.slug && BONDED_VERBS.includes(e[1])).map(e => e[0]));
    // gated, scored candidate pool across the cast
    let pool: { c: any; rel: string; fit: number; why: string; score: number }[] = [];
    for (const c of cast) {
      if ((perChar.get(c.slug) ?? 0) >= CAP) continue;
      for (const cand of candidates(c, a, out, social)) {
        if (cand.fit < THRESHOLD) continue;                       // the unforced gate
        const dramatic = existingBonders.size > 0 ? 0.3 : 0;       // rival-claim tension bonus
        pool.push({ c, rel: cand.rel, fit: cand.fit, why: cand.why, score: cand.fit + 0.25 * dramatic });
      }
    }
    if (pool.length === 0) continue;                              // no signal → stays an item
    if (r() > P_BOND) continue;                                   // rarity: a fitting item still may not bond
    pool.sort((x, y) => y.score - x.score);
    const top = pool.slice(0, 3);
    const tot = top.reduce((s, p) => s + p.score, 0);
    let pickPt = r() * tot, chosen = top[0];
    for (const p of top) { pickPt -= p.score; if (pickPt <= 0) { chosen = p; break; } }
    perChar.set(chosen.c.slug, (perChar.get(chosen.c.slug) ?? 0) + 1);
    bonds.push({ char: chosen.c.slug, rel: chosen.rel, artifact: a.slug, fit: chosen.fit, why: chosen.why });
  }
  return bonds;
}
```

> The `sk()` helper normalizes by 20 because skills are authored on a **0–20
> scale** (see §6.2 — the generation prompt MUST emit skill levels in that range,
> or fit scores will be wrong).

> **Honest limitation & planned upgrade:** the `want` match above is keyword
> overlap, which over-fires `covets`. Replacing it with an embedding/LLM
> *semantic* match (computed offline, cached) makes `covets` fire only on genuine
> alignment. Thresholds, rarity, and cap want playtest calibration.

## 9. Secondhand (inherited) bonds + richer relationships

A character can inherit a relationship to an artifact **through** someone they are
tied to: a chain `C --R1--> P --R2--> artifact` (or `P`'s own people made/held
it). The secondhand bond's **type and valence are a function of the PAIR** of
relations — the carrier-class of `R1` × the artifact-class of `R2`:

| carrier (R1) | × `held` | × `fate` (died_for/sealed) | × `wants` |
|---|---|---|---|
| **lineage** (ancestor/descendant/successor) | `heir_to` | `burdened_by` | `inherits_the_hunt_for` |
| **legacy** (mentor/role-model/protégé/reveres) | `lives_up_to` | `must_finish` | `chases_their_mentors_dream_of` |
| **antagonism** (rival/grudge/betrayed/estranged) | `spites` | `vindicated_by` | `denies_to` |
| **grief** (lover) | `grieves_through` | `mourns_through` | `haunted_by_their_wish_for` |
| **obligation** (owes/served/commands/ally) | `obligated_over` | `bound_by` | `owes_the_pursuit_of` |

Transmission strength = `closeness(R1) × intensity(R2)`; below threshold, no bond.
**Unforced by construction:** both links (`C→P` and `P→artifact`) must already
exist — the system never invents a tie, it only propagates a real one. Direction
matters (a protégé inherits a mentor's burden, not the reverse), which is why the
**richer directional relationship verbs** of §3.2 exist: they are what create the
chains.

This produces intergenerational object-weight: *a drill-chief is `burdened_by` the
map his grandmother died finishing; a medic `must_finish` the graft his mentor
bonded to and died completing; an heir is `heir_to` the vault holding her
ancestor's sealed memory.* Secondhand bonds are even richer Director fuel than
firsthand: when one surfaces, the inheriting character's tension spikes *and* the
dead forebear's story is in scope, so the Director can pay off two generations in
one beat. They also deepen over play (a `lives_up_to` becomes `must_finish` if the
mentor dies), reusing the same resonance check.

### 9.1 Secondhand roller (reference implementation)

> As in §8.1, the shipped function MUST **return** a structured
> `SecondhandBond[]` (`{char, rel, artifact, via, R1, R2, transmission}`), not
> print. De-dupe on `(char, rel, artifact)`.

```ts
const THRESHOLD = 0.5;
const SOCIAL = new Set(["kin_of","descendant_of","ancestor_of","successor_of","predecessor_of",
  "mentored_by","mentor_of","reveres","role_model_of","protege_of","lover_of","rival_of",
  "grudge_against","owes","ally_of","betrayed_by","served","commands","estranged_from"]);
const ARTREL = new Set(["forged","forged_by","owned","owned_by","wielded","bonded_to","covets",
  "heir_to","sought_by","destroyed","sealed","died_for","haunted_by","created"]);

const CLOSE: Record<string, number> = { kin_of:1, descendant_of:1, ancestor_of:.9, successor_of:.8, predecessor_of:.7,
  lover_of:.95, mentored_by:.85, mentor_of:.8, reveres:.8, role_model_of:.8, protege_of:.8,
  rival_of:.7, grudge_against:.75, betrayed_by:.8, owes:.6, ally_of:.5, served:.6, commands:.55, estranged_from:.7 };
const INTENS: Record<string, number> = { forged:1, forged_by:1, created:1, died_for:1, destroyed:1, bonded_to:.85,
  wielded:.8, owned:.7, owned_by:.7, heir_to:.7, sealed:.7, haunted_by:.7, covets:.6, sought_by:.55 };

function carrierClass(R1: string) {
  if (["kin_of","descendant_of","ancestor_of","successor_of","predecessor_of"].includes(R1)) return "lineage";
  if (["mentored_by","mentor_of","reveres","role_model_of","protege_of"].includes(R1)) return "legacy";
  if (["rival_of","grudge_against","betrayed_by","estranged_from"].includes(R1)) return "antagonism";
  if (R1 === "lover_of") return "grief";
  if (["owes","served","commands","ally_of"].includes(R1)) return "obligation";
  return "tie";
}
function artClass(R2: string) {
  if (["forged","forged_by","created","wielded","bonded_to","owned","owned_by","heir_to"].includes(R2)) return "held";
  if (["died_for","destroyed","sealed","haunted_by"].includes(R2)) return "fate";
  if (["covets","sought_by"].includes(R2)) return "wants";
  return "held";
}
const MAP: Record<string, Record<string, string>> = {
  lineage:    { held: "heir_to",         fate: "burdened_by",    wants: "inherits_the_hunt_for" },
  legacy:     { held: "lives_up_to",     fate: "must_finish",    wants: "chases_their_mentors_dream_of" },
  antagonism: { held: "spites",          fate: "vindicated_by",  wants: "denies_to" },
  grief:      { held: "grieves_through", fate: "mourns_through", wants: "haunted_by_their_wish_for" },
  obligation: { held: "obligated_over",  fate: "bound_by",       wants: "owes_the_pursuit_of" },
  tie:        { held: "recognizes",      fate: "marked_by",      wants: "drawn_to" },
};
// transmission = CLOSE[R1] * INTENS[R2]; emit MAP[carrierClass(R1)][artClass(R2)] when >= THRESHOLD.

// Resolve every artifact P is tied to, via three paths:
//   (a) direct      P --R2--> artifact
//   (b) P as maker  artifact --forged_by|owned_by--> P
//   (c) P's people  artifact --forged_by|owned_by--> F, where P is in faction F
function pArtifactTies(P: string, world: { nodes: any[]; edges: any[] }) {
  const isArt = (s: string) => world.nodes.find(n => n.slug === s)?.type === "artifact";
  const facts = (s: string) => world.nodes.find(n => n.slug === s)?.facts ?? {};
  const out: { a: string; R2: string; via: string }[] = [];
  for (const e of world.edges) {
    if (e[0] === P && ARTREL.has(e[1]) && isArt(e[2])) out.push({ a: e[2], R2: e[1], via: "direct" });
    if (isArt(e[0]) && (e[1] === "forged_by" || e[1] === "owned_by") && e[2] === P)
      out.push({ a: e[0], R2: e[1] === "forged_by" ? "forged" : "owned", via: "as maker/holder" });
  }
  const fac = facts(P).faction;     // P's people: facts.faction (or a member_of edge)
  if (fac) for (const e of world.edges)
    if (isArt(e[0]) && (e[1] === "forged_by" || e[1] === "owned_by") && e[2] === fac)
      out.push({ a: e[0], R2: e[1] === "forged_by" ? "forged" : "owned", via: `their people (${fac})` });
  return out;
}
// Outer loop: for each colonist C, each social edge C --R1--> P (P is any tied
// entity — a living colonist OR, more often, a deceased `figure` forebear/mentor;
// do NOT require P to be a colonist, or the lineage/legacy carriers can't fire),
// each tie in pArtifactTies(P): if CLOSE[R1]*INTENS[R2] >= THRESHOLD, emit the
// mapped relation. De-dupe on (C, rel, artifact). Seed only matters if you add
// rarity; the base walk is fully deterministic.
```

> **Map exhaustiveness (guard in Phase 8):** every verb in `SOCIAL` MUST have a
> `CLOSE` entry and every verb in `ARTREL` MUST have an `INTENS` entry — a missing
> key makes `transmission` `NaN`, which silently drops the bond and hides bugs.
> Add a test that asserts both key sets are fully covered.

## 10. Evaluating generation quality (blind LLM-as-judge)

Because the pipeline's shape was chosen empirically, the evaluation method is part
of the spec — re-run it whenever you change a stage.

- **Blind A/B:** sanitize two world variants into leak-free files, randomize which
  is "A" and which is "B" (swap labels across runs), and ask a strong judge model
  which is the better world. **Strip every provenance signal first** — remove all
  underscore-prefixed bookkeeping keys (`_arm`, `_pipeline`, etc.) and any field
  that names the generator. A single leaked field invalidates the run.
- **Five-dimension rubric:** coherence, causal depth, thematic richness, novelty,
  dramatic potential. Score each, then an overall preference.
- **Breadth:** run across a set of distinct themes (≈10 tag sets spanning alien
  statuses, with and without psychic, varying resource centrality) so a result is
  not an artifact of one premise.
- **Honesty discipline:** count only clean, reproducible runs; if a blinding leak
  or an unreliable model run is discovered, fix the sanitizer and re-judge before
  reporting. Do not aggregate compromised runs.

This method is what the §6 pipeline ordering and the §8/§9 bond designs were
chosen against; re-run it whenever you change a stage so the choice stays
evidence-backed rather than assumed.

---

# Part II — Implementation Plan

Each phase below is independently testable and ends with a commit. **Use a
test-first (TDD) workflow throughout:** write the failing test, run it to confirm
it fails for the right reason, write the minimal implementation, run it green,
commit. Where a test is timing- or randomness-sensitive, fix it with deterministic
seeding or synchronization — **never** by weakening or deleting the assertion.

**Recommended project layout** — file paths are adaptable to your conventions,
but the **exported symbol names** in each phase's "Interfaces produced" block are
a fixed contract (later phases import them by exact name; renaming `validateWorld`,
`loadWorld`, `callbackTopK`, etc. breaks cross-phase imports). Do NOT rename or
restructure produced interfaces while implementing a phase.

```
src/
  schema.ts              # World/Node/Edge types, ORDER_RELATIONS, validateWorld, reconstructMystery
  util/rng.ts            # the shared mulberry32 seeded PRNG (used by procgen + both rollers)
  store.ts               # embedded SQLite edges store + query catalog
  director.ts            # resonance scorer + tick loop + arc state machine
  generator/
    procgen.ts           # abstract deterministic causal-topology generator
    pipeline.ts          # orchestrates LLM seed → procgen → clothe → characters
    prompts/             # seed.md, clothe.md, characters.md
  lint/
    check.ts             # CLI wrapper over validateWorld
    character-lint.ts    # character/quality gate
  bonds/
    firsthand.ts         # resonance-gated bond roller
    secondhand.ts        # transitive bond roller
  eval/
    judge.ts             # blind LLM-as-judge harness
tests/
  *.test.ts
```

---

## Phase 1 — World schema & validator

**Execution Status:** ⬜ NOT STARTED

The contract between the (non-deterministic) LLM generator and the
(deterministic) store: if `validateWorld().ok`, the world is loadable AND
internally coherent.

**Files:**
- Create: `src/schema.ts`
- Create: `src/lint/check.ts` (CLI)
- Test: `tests/schema.test.ts`

**Interfaces produced:** `WorldNode`, `Edge`, `World`, `OrderRelation`,
`ORDER_RELATIONS`, `validateWorld(w): {ok, errors}`, `reconstructMystery(w):
string[]`.

- [ ] **Step 1: Write the failing test.** Cover: (a) a minimal valid world passes;
  (b) duplicate slug fails; (c) an edge whose `src`/`dst` is undeclared fails; (d)
  an artifact dropping fewer than 3 lore facts fails; (e) a mystery fragment that
  is not a `lore` node, or not dropped by any artifact, fails; (f) `mystery.order`
  not a permutation of `mystery.fragments` fails; (g) an invalid `order_relation`
  fails; (h) `reconstructMystery` returns only revealed fragments in declared
  order. The code block below is **partial** (it shows four cases) — implement a
  failing-case assertion for every rule (a)–(h), not just the ones shown.

```ts
import { validateWorld, reconstructMystery, type World } from "../src/schema";

const base: World = {
  nodes: [
    { slug: "artifacts/codex", type: "artifact" },
    { slug: "lore/a", type: "lore" }, { slug: "lore/b", type: "lore" }, { slug: "lore/c", type: "lore" },
  ],
  edges: [["artifacts/codex","drops","lore/a"],["artifacts/codex","drops","lore/b"],["artifacts/codex","drops","lore/c"]],
  mystery: { fragments: ["lore/a","lore/b"], order: ["lore/a","lore/b"], order_relation: "reveals" },
};

test("valid world passes", () => expect(validateWorld(base).ok).toBe(true));
test("duplicate slug fails", () => {
  const w = { ...base, nodes: [...base.nodes, { slug: "lore/a", type: "lore" }] };
  expect(validateWorld(w).ok).toBe(false);
});
test("under-dropped artifact fails", () => {
  const w = { ...base, edges: [["artifacts/codex","drops","lore/a"]] as any };
  expect(validateWorld(w).ok).toBe(false);
});
test("reconstructMystery returns revealed in order", () => {
  const w = structuredClone(base);
  w.nodes.find(n => n.slug === "lore/b")!.facts = { revealed: true };
  w.nodes.find(n => n.slug === "lore/a")!.facts = { revealed: true };
  expect(reconstructMystery(w)).toEqual(["lore/a","lore/b"]);
});
```

- [ ] **Step 2: Run the test, confirm it fails** (`bun test tests/schema.test.ts`)
  with "validateWorld is not a function" or similar.

- [ ] **Step 3: Implement `src/schema.ts`** — the types from §3, `ORDER_RELATIONS =
  ["caused_by","enables","prerequisite","precedes","reveals"]`, `validateWorld`
  enforcing every rule the tests assert (unique slugs; edges reference declared
  nodes; each `artifact` drops ≥3 `lore`; each `mystery.fragment` exists, is
  `lore`, and is dropped by some artifact; `order` is a permutation of
  `fragments`; `order_relation` valid if present), and `reconstructMystery`.

- [ ] **Step 4: Run the test, confirm green.**

- [ ] **Step 5: Implement `src/lint/check.ts`** — reads a JSON path, runs
  `validateWorld`, prints `VALID: …` on success / `INVALID (N errors): …` and
  exits non-zero on failure. No silent success.

- [ ] **Step 6: Commit.** `git add src/schema.ts src/lint/check.ts tests/schema.test.ts && git commit -m "feat: world schema + structural validator"`

**Before marking complete:** verify error-path coverage (every validator rule has
a failing-case test); run the suite green.

---

## Phase 2 — Embedded edges store & query catalog

**Execution Status:** ⬜ NOT STARTED

The durable World-Memory: an in-process SQLite store plus the relational query
catalog the Director needs.

**Files:**
- Create: `src/store.ts`
- Test: `tests/store.test.ts`

**Interfaces produced** (function names AND return shapes are a fixed contract —
later phases and the runtime read these fields by name, so do not improvise the
row shape). All catalog functions take `db` as their first argument:

| Function | Returns |
|---|---|
| `loadWorld(db, world)` | `void` |
| `openGrudges(db, faction)` | `{ src: string; verb: string; day: number }[]` |
| `ownedButSought(db)` | `{ artifact: string; owner: string; seeker: string }[]` |
| `freshLore(db, sinceDay, minTension)` | `{ slug: string; tension: number; day: number }[]` (lore with `facts.revealed===true`, `day >= sinceDay`, `tension >= minTension`) |
| `arcCandidates(db)` | `{ slug: string; phase: string }[]` (arc nodes with `facts.phase ∈ {rising,climax}`; the caller applies the stall threshold from engine state) |
| `causalChain(db, eventSlug)` | `string[]` (slugs along the `caused_by` chain, nearest cause first) |
| `relationshipBetween(db, a, b)` | `string \| null` (shortest typed path serialized as `\|a\|verb\|b\|…`, or `null`) |
| `recentEvents(db, n)` | `{ slug: string; day: number }[]` (newest first) |
| `artifactProvenance(db, slug)` | `{ verb: string; dst: string; day: number }[]` (`forged_by`/`owned_by`/`lost_in`) |
| `whoHasSkill(db, skill)` | `{ slug: string; level: number }[]` (colonists ranked by `facts.skills.<skill>` desc) |
| `rivalHuntProgress(db, artifactSlug)` | `{ faction: string; day: number }[]` (`sought_by` edges; engine state augments the clock) |

Note: `arcCandidates` reads `facts.phase` on `type:"arc"` nodes — the graph-resident
arc node mirrors the in-memory `Arc` struct's phase (§7.1) so the store can answer
the query; the `days_since_advance` stall check stays in engine memory.

- [ ] **Step 1: Write the failing test.** Load a small fixture world into an
  in-memory DB; assert each catalog query returns the expected rows. Key cases:
  `causalChain` walks a 3-deep `caused_by` chain via a recursive CTE;
  `relationshipBetween` returns a shortest typed path across ≥2 hops;
  `artifactProvenance` returns `forged_by`/`owned_by`/`lost_in`.

```ts
import { Database } from "bun:sqlite";
import { loadWorld, causalChain, artifactProvenance } from "../src/store";

test("causalChain walks caused_by recursively", () => {
  const db = new Database(":memory:");
  loadWorld(db, {
    nodes: [{slug:"events/1",type:"event"},{slug:"events/2",type:"event"},{slug:"events/3",type:"event"}],
    edges: [["events/3","caused_by","events/2"],["events/2","caused_by","events/1"]],
    mystery: { fragments: [], order: [] },
  } as any);
  expect(causalChain(db, "events/3")).toEqual(["events/2","events/1"]);
});
```

- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/store.ts`.** Schema: `nodes(slug PK, type, tension
  REAL, day INT, facts TEXT, body TEXT)` and `edges(src, verb, dst, day INT,
  PRIMARY KEY(src,verb,dst))` with an index on `edges(dst)` for backlink
  traversal. The `body` column holds rendered prose and is **nullable and not
  save-critical** — compaction (§4) blanks it with `UPDATE nodes SET body=NULL`
  while keeping all facts. `loadWorld` inserts nodes (default `tension` 0.2, `day`
  0, `body` NULL) and edges (default `day` 0). Each catalog function is a
  parameterized query; `causalChain` and `relationshipBetween` use recursive CTEs.
  For `relationshipBetween`, walk a recursive CTE that accumulates the path string
  and **guards against revisiting a node already in the path** (so cycles
  terminate), ordering by path length and taking the shortest.
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: embedded edges store + query catalog"`

**Before marking complete:** confirm the recursive-CTE queries terminate on
cyclic data (add a cycle fixture and assert no infinite loop / bounded depth).

---

## Phase 3 — Abstract procedural generator

**Execution Status:** ⬜ NOT STARTED

The deterministic Stage-2 generator that emits a neutral causal topology (§6.1).

**Files:**
- Create: `src/util/rng.ts` (the shared `mulberry32`, first needed here)
- Create: `src/generator/procgen.ts`
- Test: `tests/procgen.test.ts`

**Interfaces produced:** `mulberry32(seed)`, `Templates`, `runProcgen(tpl, seed): World`.

- [ ] **Step 1: Write the failing test.** Assert: (a) same `(tpl, seed)` ⇒
  byte-identical output (determinism); (b) different seeds ⇒ different output; (c)
  output always has a climax node (`facts.climax === true`) even when momentum
  stays below threshold (use a low-danger/low-greed/low-epoch template so the
  fallback `fireClimax` fires) AND when momentum **does** cross the threshold (use
  high danger/greed/epochs + a low `cascadeThreshold` so the momentum-triggered
  path fires) — cover both climax paths, not just the fallback; (d)
  `mystery.fragments` is non-empty and chained by the
  configured `order_relation`; (e) **no theme-forcing leak** — no node carries a
  `status: "fallen"` fact, no `fell_to` edge, and every event's `facts.placeholder
  === true`; (f) **do NOT call `validateWorld` on procgen output** — it will fail
  the artifact-drop and mystery-coverage rules by design (no artifacts exist until
  Stage 3). Instead assert topology properties directly: every `mystery.fragment`
  is a declared `lore` node, consecutive fragments are linked by `order_relation`,
  and every edge references a declared node.

```ts
import { runProcgen, type Templates } from "../src/generator/procgen";

const tpl: Templates = {
  civs: [{name:"vurn",archetype:"hive",trait:"patient",greed:0.8},{name:"sel",archetype:"machine",trait:"cold",greed:0.5}],
  resources: [{name:"marrow",danger:0.7}],
  epochs: 6, cascadeThreshold: 3, order_relation: "reveals",
};

test("deterministic by seed", () =>
  expect(JSON.stringify(runProcgen(tpl, 42))).toEqual(JSON.stringify(runProcgen(tpl, 42))));
test("always climaxes", () =>
  expect(runProcgen(tpl, 1).nodes.some(n => (n.facts as any)?.climax === true)).toBe(true));
test("no theme-forcing leak", () => {
  const w = runProcgen(tpl, 7);
  expect(w.nodes.every(n => n.type !== "faction" || (n.facts as any)?.status === undefined)).toBe(true);
  expect(w.edges.every(e => e[1] !== "fell_to")).toBe(true);
});
```

- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/generator/procgen.ts`** exactly as §6.1 (the
  `mulberry32` rng, neutral `AbsKind` events, momentum-driven `fireClimax`, the
  guaranteed-climax fallback, fragment chaining in `order_relation`).
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: abstract deterministic procedural generator"`

**Before marking complete:** re-read the "no theme-forcing" constraint in Global
Constraints; confirm no neutral label (`initiative`/`interaction`/`commitment`/
`turn`) was renamed to a theme verb anywhere in this layer.

---

## Phase 4 — LLM generation pipeline

**Execution Status:** ⬜ NOT STARTED

Orchestrates the four stages into a finished, gate-passing world. The LLM stages
are prompt-driven; keep prompts as files so they are reviewable and versionable.

**Files:**
- Create: `src/generator/prompts/seed.md`, `clothe.md`, `characters.md`
- Create: `src/generator/pipeline.ts`
- Test: `tests/pipeline.test.ts`

**Interfaces produced:** `generateWorld(tagSet, seed, llm): Promise<World>` where
`llm` is an injectable async function `(prompt: string) => Promise<string>` (so
tests can stub it deterministically).

- [ ] **Step 1: Write the failing test** with a **stubbed `llm`** so no network is
  hit. The stub returns canned Stage-3/Stage-4 JSON for given prompts. Assert: the
  pipeline runs Stage 2 (procgen) deterministically, feeds it to the (stubbed) LLM
  stages, and the **final output passes both `validateWorld` and `characterLint`**
  (import the Phase-5 lint once it exists; until then assert `validateWorld` only
  and add the `characterLint` assertion in Phase 5). Also assert the pipeline
  **rejects** a stub that returns a world failing `validateWorld` (it must throw,
  not silently pass). **Also assert the wiring, not just the gates:** spy on the
  stub's inputs and assert the Stage-2 procgen output (e.g. its fragment slugs)
  actually appears in the prompt handed to the clothing stage, and the clothing
  output is what the character stage receives — proving the stages are chained,
  not run independently.
- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Write the three prompt files** per §6:
  - `seed.md`: tag set → theme parameters (honor `alien_status` exactly; psychic
    only if not `none`; resource scaled to `resource_centrality`; declare the
    `order_relation` and what its reconstruction *means*).
  - `clothe.md`: rename neutral events per theme; build 5–8 hunt-able artifacts of
    varied archetypes that each `drops` ≥3 lore and collectively cover every
    mystery fragment; do **not** alter the mystery spine; output only World JSON
    that passes the validator.
  - `characters.md`: add `facts.skills` + `facts.want` to every colonist; a dense
    colonist↔colonist social graph (density ≥1.0) using both basic and directional
    verbs; 1–2 named alien characters (`facts.species: "alien"`, `facts.faction`
    set); seeded secondhand chains (a forebear/mentor with a real artifact tie);
    pick the §6.2 skill profile and stamp `facts.skill_profile`; fix lore
    over-spread and malformed edges; keep the spine; output only merged World JSON
    passing both gates.
- [ ] **Step 4: Implement `src/generator/pipeline.ts`.** Run Stage 2, then call
  `llm` for Stages 1/3/4 in sequence, parsing JSON between stages and calling
  `validateWorld` after Stage 3 and both gates after Stage 4 — throwing with the
  precise errors if a gate fails. **Inter-stage handoff contract** (fix it so two
  implementers interoperate): each LLM stage receives a single prompt string built
  by interpolating the prompt template with `JSON.stringify` of its input (Stage 3
  gets the Stage-2 `World` and the Stage-1 theme params; Stage 4 gets the Stage-3
  `World`), and each LLM stage MUST return a fenced ```` ```json ```` block holding
  one `World` object. Parse by extracting the first JSON code block and
  `JSON.parse`-ing it; if no parseable `World` is found, throw (do not silently
  pass partial output downstream).
- [ ] **Step 5: Run, confirm green.**
- [ ] **Step 6: Commit.** `git commit -m "feat: four-stage generation pipeline + prompts"`

**Before marking complete:** the test MUST use a stubbed `llm` (no live calls in
CI). Confirm a gate failure throws rather than returning an invalid world.

---

## Phase 5 — Character & quality lint

**Execution Status:** ⬜ NOT STARTED

The second hard gate: depth and polish beyond loadability.

**Files:**
- Create: `src/lint/character-lint.ts`
- Test: `tests/character-lint.test.ts`

**Interfaces produced:** `characterLint(w): {ok, issues}` and a CLI wrapper.

- [ ] **Step 1: Write the failing test.** Assert each rule independently flags its
  violation and a healthy world passes: (a) a colonist missing `facts.skills`
  fails; (b) a colonist missing a want/drive (`want`/`drive`/`goal`/`motive`)
  fails; (c) a thin social graph (colonist↔colonist relationship-edge density <
  1.0) fails; (d) zero named alien characters fails; (e) any mystery fragment
  dropped by > 3 artifacts fails (over-spread dilutes attribution); (f) a
  malformed edge (e.g. a person-verb whose subject is an `artifact`, or "X owns a
  faction") fails.
- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/lint/character-lint.ts`.** The relationship-edge
  set credited for density MUST include both the basic verbs (`kin_of`,
  `rival_of`, `lover_of`, `ally_of`, `owes`, `grudge_against`, `betrayed_by`,
  `killed`, `saved`) and the directional verbs (`mentor_of`, `mentored_by`,
  `role_model_of`, `reveres`, `protege_of`, `predecessor_of`, `successor_of`,
  `ancestor_of`, `descendant_of`, `commands`, `served`, `estranged_from`). An
  alien character = a colonist whose `facts.faction` is an alien faction (a
  `faction` node with `facts.alien_type`) or whose `facts.species === "alien"`.
  Rule (f) **malformed-edge policy** (apply exactly this so two implementers
  agree): every relationship verb above requires BOTH endpoints to be a person
  (`colonist` or `figure`) — flag it otherwise; and `owned_by` requires an ownable
  subject (`artifact`/`location`/`power`/`curse`/`lore`) — flag "X owns a faction"
  and a person being owned. Endpoints whose node is not declared are skipped (that
  is the validator's job, not the lint's).
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Go back to Phase 4's test and add the `characterLint` assertion** to
  the pipeline output. Run green.
- [ ] **Step 6: Commit.** `git commit -m "feat: character & quality lint gate"`

---

## Phase 6 — Director resonance loop

**Execution Status:** ⬜ NOT STARTED

The deterministic event-picker (§7).

**Files:**
- Create: `src/director.ts`
- Test: `tests/director.test.ts`

**Interfaces produced** (signatures are fixed by §7.1; implement exactly these):
`callbackTopK(db, F, today): {cb, chars}`, `scoreCandidates(db, cands: Candidate[],
history, today, budgetValence): (Candidate & {r})[]` (all candidates, sorted),
`tick(...)` (its head — the winning beat), and the arc state-machine helper
`advanceArc(arc: Arc, fired: Candidate, stallTheta): Arc`. The `Candidate` and
`Arc` types are defined in §7.1.

- [ ] **Step 1: Write the failing test.** Cover the load-bearing behaviors: (a)
  **top-K, not Σ-all** — a faction with 60 low-tension stake edges scores *below*
  a faction with 3 high-tension ones (this is the exact bug top-K prevents); (b)
  recency decay reduces an old stake edge's contribution; (c) the
  repetition/fixation penalties climb on repeated kinds/factions so the winner
  rotates (assert distinct targets over several ticks — "not a treadmill"); (d)
  `involves` edges are **excluded** from callback (firing an event must not
  snowball its own target's future score); (e) the arc state machine advances on a
  matching event and forces toward `resolution` after `days_since_advance > θ`.

```ts
import { Database } from "bun:sqlite";
import { loadWorld } from "../src/store";      // Phase 2 — reuse it so schemas cannot drift
import { callbackTopK } from "../src/director";

test("top-K beats a low-charge hub", () => {
  const db = new Database(":memory:");
  const nodes: any[] = [
    { slug: "factions/hub", type: "faction", tension: 0.5, day: 400 },
    { slug: "factions/dram", type: "faction", tension: 0.5, day: 400 },
  ];
  const edges: any[] = [];
  for (let i = 0; i < 60; i++) {                // hub: 60 low-tension grudges
    nodes.push({ slug: `colonists/g${i}`, type: "colonist", tension: 0.1, day: 400 });
    edges.push([`colonists/g${i}`, "rival_of", "factions/hub", 400]);
  }
  for (let i = 0; i < 3; i++) {                 // dram: 3 high-tension grudges
    nodes.push({ slug: `colonists/h${i}`, type: "colonist", tension: 0.95, day: 400 });
    edges.push([`colonists/h${i}`, "rival_of", "factions/dram", 400]);
  }
  loadWorld(db, { nodes, edges, mystery: { fragments: [], order: [] } } as any);
  expect(callbackTopK(db, "factions/dram", 400).cb).toBeGreaterThan(callbackTopK(db, "factions/hub", 400).cb);
});
```

Add separate tests for: (b) recency decay (an old high-tension edge contributes
less than a fresh one); (d) an `involves` edge into a faction does **not** raise
its `cb`; (e) `advanceArc` advances the phase on a matching `fired` beat and flips
to `resolution` once `days_since_advance > stallTheta`.

- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/director.ts`** per §7.1 (the `STAKE_VERBS` set
  excludes `involves`; `callbackTopK` sorts by `tension·recency` and averages the
  top K; `tick` applies the full seven-term normalized weighted sum from §7;
  `advanceArc` is the arc state machine).
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: Director resonance loop + arc state machine"`

**Before marking complete:** this is timing/ordering-sensitive. If a rotation test
flakes, fix it with a fixed seed / fixed `today`, **never** by loosening the
"distinct targets" assertion. Keep the mechanism assertion (top-K beats the hub),
not just a symptom bound.

---

## Phase 7 — Firsthand artifact↔character bonds

**Execution Status:** ⬜ NOT STARTED

The resonance-gated, decline-by-default firsthand roller (§8).

**Files:**
- Create: `src/bonds/firsthand.ts`
- Test: `tests/firsthand.test.ts`

**Interfaces produced:** `rollFirsthand(world, seed): Bond[]` where `Bond = {char,
rel, artifact, fit, why}`.

- [ ] **Step 1: Write the failing test.** Cover: (a) **provenance fires** — a
  colonist whose faction forged an artifact rolls `heir_to`; (b) **decline by
  default** — an artifact with no resonant character produces *no* bond (assert the
  count of unbonded items > 0 on a world built to have non-resonant items); (c)
  **determinism** — same `(world, seed)` ⇒ identical bond list; (d) **per-character
  cap** — no character exceeds the cap; (e) skill bonds map correctly (a codex →
  `decoded` by a high-`xeno` colonist; a weapon → `wields` by a high-`combat`
  colonist).
- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/bonds/firsthand.ts`** = the `candidates` fit
  function AND the `rollFirsthand` outer driver, both shown in §8.1 (the
  `THRESHOLD` gate, `P_BOND` rarity roll, `CAP` per character, dramatic bonus for
  rival claims, seeded weighted pick via the shared `mulberry32`).
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: firsthand artifact-character bond roller"`

**Before marking complete:** the "decline by default" test is the heart of the
feature — confirm it asserts that a non-resonant item stays unbonded, not merely
that *some* bonds form.

---

## Phase 8 — Secondhand (inherited) bonds

**Execution Status:** ⬜ NOT STARTED

The transitive roller typed by the relation pair (§9).

**Files:**
- Create: `src/bonds/secondhand.ts`
- Test: `tests/secondhand.test.ts`

**Interfaces produced:** `rollSecondhand(world, seed): SecondhandBond[]` where each
bond records `{char, rel, artifact, via, R1, R2, transmission}`.

- [ ] **Step 1: Write the failing test.** Cover: (a) **lineage × fate ⇒
  `burdened_by`** — a colonist `descendant_of` a forebear who `died_for` an
  artifact inherits `burdened_by`; (b) **legacy × held ⇒ `lives_up_to`** — a
  `protege_of` a mentor who `bonded_to` an artifact inherits `lives_up_to`; (c)
  **antagonism × held ⇒ `spites`** via a rival whose *people* forged it (the
  maker-people path); (d) **unforced** — remove either link in the chain and no
  bond forms; (e) **threshold** — a low-closeness × low-intensity chain falls below
  threshold and forms nothing; (f) determinism by seed; (g) **map exhaustiveness**
  — assert every verb in `SOCIAL` has a `CLOSE` entry and every verb in `ARTREL`
  has an `INTENS` entry, so no chain silently produces a `NaN` transmission.
- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/bonds/secondhand.ts`** per §9.1: walk `C --R1--> P`
  (P a colonist), resolve P's artifact ties (direct edge, P as individual
  maker/holder via `forged_by`/`owned_by`, or P's faction as maker), compute
  `transmission = CLOSE[R1] · INTENS[R2]`, and emit `MAP[carrierClass][artClass]`
  when `transmission ≥ THRESHOLD`. De-dupe on `(char, rel, artifact)`.
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: secondhand inherited bond roller"`

**Before marking complete:** confirm the "unforced" test removes a link and
asserts zero bonds — propagation must require a real chain.

---

## Phase 9 — Blind evaluation harness

**Execution Status:** ⬜ NOT STARTED

The offline judge used to validate any change to the generation pipeline (§10).

**Files:**
- Create: `src/eval/judge.ts`
- Test: `tests/judge.test.ts`

**Interfaces produced:** `sanitize(world): object` (leak-free), `judge(worldA,
worldB, llm, seed): Promise<{winner, scores, label_map}>`.

- [ ] **Step 1: Write the failing test** with a **stubbed `llm`**. Assert: (a)
  `sanitize` strips every underscore-prefixed key recursively and removes any
  generator-identifying field; (b) `judge` randomizes the A/B label assignment per
  `seed` (so a given seed maps worlds to labels deterministically but the mapping
  varies across seeds); (c) the returned `winner` is de-anonymized back to the real
  world via `label_map`; (d) `judge` never sends an unsanitized field to the
  `llm` (spy on the stub's input and assert no `_`-prefixed key appears). Make (b)
  and (c) a concrete **round-trip** so they cannot pass trivially: for a fixed
  seed, have the stub pick a label, then assert `label_map` inverts that label back
  to the specific input world you intended it to choose (not merely that "a winner
  was returned").
- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/eval/judge.ts`** — recursive sanitizer, seeded label
  swap, a prompt embedding the five-dimension rubric (coherence, causal depth,
  thematic richness, novelty, dramatic potential), and de-anonymization of the
  verdict.
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: blind LLM-as-judge evaluation harness"`

**Before marking complete:** the leak test is the whole point — confirm it asserts
the `llm` stub received zero `_`-prefixed keys. A leaked field invalidates real
runs.

---

## Phase 10 — Runtime hunt-loop integration

**Execution Status:** ⬜ NOT STARTED

Wires the pieces into the live game: artifact discovery → bond roll → progressive
reveal → fate edge → Director response. This phase has the most game-specific
surface; treat the steps as a scaffold to adapt.

**Scope fence — build ONLY the three named functions below and the loop-closing
test.** Do NOT build a UI, a real-time game loop, an entity/component system, or
the save/journal/snapshot system (that is forward context in Global Constraints,
not part of this plan). `tension` lives in engine memory; this phase only
*adjusts* it through the named functions, it does not design the tension model.

**Files:**
- Create: `src/runtime/hunt.ts`
- Test: `tests/hunt.test.ts`

**Interfaces produced:** `discover(db, artifactSlug, seed)` (reveals fact 1, rolls
firsthand + secondhand bonds, writes bond edges), `studyArtifact(db,
artifactSlug)` (reveals the next latent fact), `chooseFate(db, artifactSlug, fate)`
(writes the fate edge and adjusts seeker-faction tension).

- [ ] **Step 1: Write the failing test.** Cover: (a) `discover` flips the
  artifact's first latent lore fact to `revealed: true` and writes any rolled bond
  edges into the store; (b) `studyArtifact` reveals exactly the next latent fact,
  in order, and is idempotent once all are revealed; (c) `chooseFate("destroyed")`
  raises seeker-faction tension while `chooseFate("sealed")` lowers it; (d) after a
  bond exists and the bonded character's `tension` is raised, the **bonded
  candidate's own resonance `r`** (read it from `scoreCandidates(...)` — §7.1 — by
  finding that candidate in the returned array, NOT from `tick`'s single winner) is
  higher than the same candidate's `r` computed before the bond raised tension —
  closing the loop. `discover` must mirror the raised tension into `nodes.tension`
  (see §7's tension note) so `callbackTopK` sees it.
- [ ] **Step 2: Run, confirm fail.**
- [ ] **Step 3: Implement `src/runtime/hunt.ts`** using the Phase 2 store, the
  Phase 7/8 rollers, and the Phase 6 Director. `tension` adjustments are engine
  state (held in memory, persisted in the save), not graph fields.
- [ ] **Step 4: Run, confirm green.**
- [ ] **Step 5: Commit.** `git commit -m "feat: runtime hunt loop integration"`

**Before marking complete:** confirm the loop-closing assertion (d) — a bond must
measurably raise the bonded character's Director relevance, or the bond mechanic
is decorative.

---

## After completing any group of phases

Review the batch from multiple perspectives. Minimum 3 review rounds. If round 3
still finds issues, keep going until clean. Specifically check:

1. **Determinism:** every seeded function (procgen, both rollers, the judge's
   label swap) returns identical output for identical input. No `Date.now()`,
   no unseeded `Math.random()` in any path that touches a save or a test.
2. **The two gates:** every generated world passes both `validateWorld` and
   `characterLint` before it can load. No bypass.
3. **No LLM in the runtime loop:** grep the Director and runtime modules — they
   must contain no LLM calls.
4. **Assertion rigor:** no test was weakened to pass. Concurrency/timing tests use
   seeds or synchronization, not loosened bounds.

---

## Appendix A — Tag set shape (Stage 1 input)

A tag set is the small hand-authored seed that steers a generated world. Vary
these across worlds to get breadth:

```json
{
  "id": "uplift-nursery-world",
  "title": "The Nursery",
  "tags": ["sci-fi", "alien-uplift", "bioengineering", "guardianship"],
  "hook": "A world seeded with deliberately uplifted species — and the makers who left instructions.",
  "alien_status": "absent",
  "psychic": "none",
  "resource_centrality": "moderate",
  "artifact_flavor": "gene-looms, growth-charts, dormant guardians, instruction-steles",
  "order_relation": "enables"
}
```

Requirements for any tag set: it must be sci-fi, involve artifacts, and involve at
least one alien civilization (which need *not* be fallen). Resource tie-ins are
welcome but should not dominate every world. Psychic is optional and should be
absent in most.

## Appendix B — Query catalog reference

The Director and runtime read the world exclusively through these (all are
recursive-CTE-or-simpler SQL over the Phase-2 store):

1. `openGrudges(faction)` — `rival_of`/`betrayed_by`/`killed_by` into a faction.
2. `ownedButSought()` — artifacts the colony `owns` that a faction `seeks`.
3. `freshLore(sinceDay, minTension)` — recently `revealed` facts/fragments.
4. `arcCandidates()` — open arcs in `rising`/`climax` past their stall threshold.
5. `causalChain(event)` — recursive `caused_by` walk.
6. `relationshipBetween(a, b)` — shortest typed path.
7. `recentEvents(n)` — repetition/fixation input.
8. `artifactProvenance(artifact)` — `forged_by`/`owned_by`/`lost_in`.
9. `whoHasSkill(skill)` — colonists ranked by `facts.skills.<skill>` (a JSON
   lookup over the `nodes.facts` column; the live game may instead read its own
   in-memory skill stats, but the store can answer it from authored facts).
10. `rivalHuntProgress(artifact)` — the §5 race clock (engine state + `sought_by`).

There is intentionally **no** contradiction-finder: structured canon (§4) makes
intra-artifact contradictions impossible by construction, and cross-fact conflicts
are caught by a cheap deterministic lint, not an LLM probe.

## Appendix C — Maturity of each idea, and what is open

The claims below summarize an earlier prototype-and-evaluation pass by the
author. They are offered as orientation, **not** as results you can reproduce
from this document alone — re-establish any that matter to you with the Phase 9
harness and your own playtests.

**Held up well in prototyping:**
- The typed-edge graph answers the Director's relational questions deterministically
  and cheaply, including multi-hop traversal.
- The four-stage pipeline (neutral procgen + theme clothing + character pass)
  blind-beat single-shot and theme-forcing variants across a diverse theme set.
- Both bond mechanics produced earned, unforced links, with a healthy "not
  everything bonds" rate.
- The Director's top-K scorer and anti-treadmill guards behaved correctly under
  test.

**Open — the work that decides whether the stories are fun:**
- **How the game stamps `tension`.** The scorer is only as good as this signal,
  and no store can derive it. This is the central game-design task.
- **The blind-rater gate on Director output** (Director picks vs hand-authored
  beats) on a rich multi-tick world with real tension. Until run, "the stories
  feel authored" is unproven.
- **Calibration** of bond thresholds, rarity, caps, and the semantic `want` match
  (replace keyword overlap with embeddings) — needs playtest data.
- **Myth-layer content** (hand-author first; attempt full procedural canon only
  after hand-authored proves fun).

The substrate is small and portable. Spend effort on tension, lore content, and
tuning — not on the database.
