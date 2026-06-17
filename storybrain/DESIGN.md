# StoryBrain — an AI storyteller knowledgebase on gbrain

> Status: **v5 (final)** (post 5-round self-review + 3 adversarial rounds, with a
> reproducible prototype, a self-contained SQLite ship store at behavioral parity,
> and a multi-tick emergence sim). Evidence: `storybrain/findings/01–07` (measured;
> each adversarial round was answered by RUNNING something, not by prose). Reviews:
> `storybrain/reviews/`. Decisions: `storybrain/DECISIONS.md`.

Designs **gbrain** (this repo) — or a small store like it — as the persistent
world-memory for a **Rimworld-style AI storyteller + lore generator**, with
**artifact-hunting that drops lore and drives the story** as the headline mechanic
and **emergent** (history-driven) narrative.

---

## 0. The decision, up front (no hedge)

**Build a small SQLite/libSQL `edges` store (the §10 query catalog) as the durable
artifact — and you can start there on day one.** The SQLite store is *proven*: a
self-contained ~200-line implementation reproduces the gbrain prototype's exact
Director pick (finding 06: 3.197, behavioral parity) with all catalog queries
incl. recursive-CTE traversal. gbrain's one hard-to-replicate feature —
prose→typed-graph extraction — *doesn't work for a game domain anyway* (hardcoded
to VC dirs, finding 02), and every other gbrain differentiator (hybrid ranking,
LLM contradiction, salience, trajectory) this use case discards. So gbrain's only
residual value is "stand up a world and interrogate it by talking to an agent, no
engine code." That is real but **marginal** — and adversarial round 3 showed it
comes with footguns (a stateful brain that prior experiments polluted, breaking
reproducibility until the seed was made self-contained). **Honest call: if you're
comfortable in SQL, skip gbrain and build the `edges` store directly (finding 06
is your starting point). Use gbrain only if agent-driven exploration genuinely
beats writing SQL for you.**

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

### 5.4 Scope of the "contradictions vanish" claim (R3 honesty)

Structured canon prevents *intra-artifact* prose contradictions (the renderer
can't invent a second forger). It does NOT prevent *cross-fact* tension if a
designer authors two conflicting facts, or if procgen produces them. That's a
content-authoring lint problem (a cheap deterministic check over the fact table),
not the LLM-judged probe gbrain ships. Don't overclaim: structured canon makes
contradictions *rare and detectable*, not impossible.

---

## 5.5 Is this actually EMERGENT? (the friend's core requirement)

Adversarial round 3 pressed the hardest question: if lore is a *pre-authored* (or
procgen) fact-skeleton merely *revealed* in different orders, is that emergent — or
just an RPG codex behind a progression mask? The honest, and I think correct,
answer:

**Emergence here is combinatorial, and that is exactly how the genre's emergence
works.** Rimworld's celebrated storytelling does NOT invent new event *types* per
playthrough — it draws from a fixed, authored pool of incident templates. The
emergence everyone praises is the **weave**: authored templates × the *genuinely
emergent* colony state (who you recruited, who died, who fell in love, what you
built, what you can afford to lose). StoryBrain applies that same model to lore:

- **The myth layer (authored / procgen): stable canon.** Artifacts and their
  fact-skeletons. Finite, consistent, deterministic.
- **The chronicle layer (emergent): genuinely novel every run.** The colony graph
  — deaths, grudges, romances, betrayals, who went on which hunt, who wielded the
  cursed blade when their mood broke. This is invented by *gameplay*, not authored.
- **The story = the weave.** The Director threads the fixed myth through the
  emergent chronicle. **Demonstrated (finding 07):** the identical Ashmark myth
  produces a raid-on-Vera's-grudge in one colony and a raid-on-Bjorn's-feud in
  another, purely because the emergent chronicles differ. No author wrote either
  sentence.

So "fact-skeleton + reveal" is **not** a retreat from emergence — it is the
load-bearing structure that lets emergent gameplay state produce coherent,
non-contradictory, per-playthrough-unique narrative. Pure generative emergence
(an LLM inventing canon from nothing) is the thing to *avoid*: it's incoherent,
non-deterministic, and expensive — the opposite of what the friend wants.

**Two honest costs:**

1. **Content budget (if hand-authored).** Like Rimworld's incident pool, the myth
   layer needs enough breadth not to run dry. Rough target: ~30–60 artifacts ×
   3–5 latent facts each (~150–250 facts) + ~10–20 rumor/threat templates. Because
   the *weave* is combinatorial against an unbounded emergent chronicle, that
   modest corpus yields effectively unbounded distinct stories — again, exactly
   the Rimworld economics (a few hundred authored pieces → years of distinct runs).
2. **Procgen canon (optional, large).** Generating the fact-skeletons themselves
   at world-gen — Dwarf Fortress *legends* — is a genuine, sizeable subsystem
   (templated name/purpose/owner-death-chain generators with consistency
   constraints). It is NOT four words of hand-wave; treat it as a separate project
   to attempt *after* the hand-authored version proves fun. The store doesn't
   change either way — procgen just writes more rows.

The store (gbrain or SQLite) is **agnostic** to which layer authored a fact; it
just remembers and connects. Emergence is delivered by the Director's weave +
the emergent chronicle, both demonstrated. That answers the charter's "emergent"
requirement honestly: combinatorial emergence, the same kind Rimworld ships, not
generative-from-nothing.

---

## 6. The Director (you build) — specified, normalized, run multi-tick

Loop: `1. pacing state (game) → 2. sense (graph queries) → 3. score → 4. fire →
5. write back (event + edges + advance arc)`. LLM never in this loop.

**All terms normalized to [0,1]; resonance has a stable, tunable scale** (finding
07; fixes round-3 R3-03/04 — earlier drafts had an unbounded `Σ` and a
double-counted arc term):
```
resonance = w_arc·arc_advance + w_cb·callback_strength + w_char·character_stakes
          + w_val·valence_fit  + w_tens·tension_fit
          − w_rep·repetition   − w_fix·fixation
worked weights: arc .25, cb .30, char .10, val .10, tens .15, rep .25, fix .25
→ resonance ∈ [−0.5, 0.9]; weights are tunable and scores comparable.
```

**`callback_strength` — top-K, normalized, RUN (findings 03, 05, 07):**
```
callback_strength(candidate→F) =
  (Σ over the TOP-K highest-charge revealed edges into F of
       tension(from(e)) · recency_decay(e.day)) / K          ∈ [0,1]
recency_decay(d) = 0.5 ^ ((today − d) / HALF_LIFE)
```
**Why top-K not Σ-all (finding 05 — a real bug we caught):** an unbounded sum lets
a hub of many low-charge edges (60 anonymous grunts) swamp a few high-charge ones,
so the Director fixates on whoever has the most connections regardless of drama.
Narration cites a few NAMED stakes; so does the scorer. After the fix the winner
provably tracks inputs — it follows the open arc and the tension landscape
(finding 05 scenarios B/D flip the winner correctly).

`tension(node)` is **engine sim-state held in game memory** (combat, mood, deaths,
reveals stamp it) — NOT a graph field, so NO N+1 (R2-04). The demo values are
illustrative; **how the real game stamps tension is THE game-design work, and no
store can do it for you (honest).**

`arc_advance` = a SINGLE additive 0/1 term (matches an open arc's `next_beat`; no
multiplier — R3-04). `valence_fit` = `1 − |cand.valence − budget_valence|/2`
(alternate dread/relief). `repetition`/`fixation` = fraction of the last N events
sharing the candidate's kind/faction — the anti-treadmill guards, which
**demonstrably engage** (finding 07: penalties climb 0.00→0.50→0.67 on repeats;
the sim fires disaster + relief beats, not iron-raid-every-tick). *Honest caveat:*
balancing arc-pull vs anti-repetition is a TUNING problem, not a solved constant.
**Fate choices feed the scorer:** a `destroyed` artifact raises its seekers'
faction tension (revenge); `sealed` lowers it.

**Falsifiable success metric** (replaces "feels authored"): a blind rater shown 10
Director picks interleaved with 10 hand-authored beats cannot beat ~60% accuracy.
*Status: UNRUN* — needs a richer multi-tick world + human raters. The normalized
scorer makes it computable; it remains the key open validation gate.

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
5. Recommendation hedge — clear call (§0): build the SQLite store, gbrain optional
   (R2-07; finding 06 proves the store at parity). *Resolved.*
6. Hunt fun — uncertainty + rival clock + curse trade-off + fate choice (§4).
   *Resolved in design; needs playtest.*
7. Mega-hub traversal blowup + scorer volume-domination — cap fan-out; top-K
   scorer (finding 05). *Resolved.*
8. Emergence (charter requirement) — combinatorial weave of authored myth ×
   emergent chronicle; demonstrated two-colony divergence (§5.5, finding 07).
   *Resolved (content budget + procgen honestly costed).*
9. Reproducibility (R3-01/02) — seed.sh self-contained, 3.197 reproduces from a
   clean brain; multi-tick sim non-degenerate (findings 06/07). *Resolved.*
10. Scorer not normalized/runnable metric (R3-03/04) — normalized terms, stable
    scale, valence in, no double-count (finding 07). Blind-rater metric now
    computable but *still UNRUN* — the key open gate.
11. Lore-content pipeline (the generative half) — schema-ready (`facts` JSON +
    `revealed`), but authoring/procgen content is unbuilt; it's game-design +
    content, not store work. *Open by design — the friend's core work.*

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

The store question is settled; the open work is game design + content, in priority
order:

1. **Build the SQLite `edges` store first** (the §10 catalog) — `storybrain/ship/
   storybrain.ts` is a working starting point at parity with gbrain (finding 06).
   In-process, ships with any engine. *Skip gbrain unless agent-driven SQL-free
   exploration genuinely helps you* (and mind the stateful-brain footguns round 3
   surfaced). This is the un-hedged call.
2. **Prove the fun: run the blind-rater gate.** Build a richer multi-tick world
   (the §4 hunt loop, §5 fact-reveal, real `tension` stamping) and run the
   falsifiable metric (§6). This is the make-or-break validation and is still
   UNRUN — everything before it is plumbing.
3. **Do the genuinely hard, game-specific halves:** (a) how the game stamps
   `tension` (the scorer is only as good as this), (b) the lore-content pipeline —
   hand-author the ~150–250-fact myth corpus (§5.5 budget) first; attempt procgen
   (DF-legends) only after hand-authored proves fun.

What this exploration *proved* (findings 01–07): the World-Memory + typed-edge
graph + Director-selection half works, is small, and is portable. What it
*could not prove from the outside*: that the resulting stories are fun (the
blind-rater gate) and that authoring/generating coherent lore at scale is
tractable for this team. Those are the friend's calls — but the substrate will not
be what blocks them.

The artifact spiral — affordable because typed edges are free to write/traverse
and lore is structured facts rendered on demand — is the real case for a graph
store over a flat wiki, and it holds up. Build the small store; spend your effort
on tension, lore content, and tuning, not on the database.
</content>
