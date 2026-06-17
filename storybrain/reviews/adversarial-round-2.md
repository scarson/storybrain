# StoryBrain — Adversarial Review, Round 2 of 3

> Hostile expert review of `storybrain/DESIGN.md` (v3). Mandate: verify the
> round-1 fixes are CORRECT, then find what is STILL wrong or NEWLY wrong.
> Each finding appended as discovered (container may restart). Severity:
> FATAL / HIGH / MEDIUM / LOW.

## Method

- Read DESIGN.md v3, round-1 review, self-review, findings 01 & 02, schema pack.
- Re-verify new v3 claims (compaction cascade, link write path, tension field,
  graph traversal cost) against gbrain source.
- Attack the empirical finding 02 itself: was the experiment sound? what did it
  NOT test?

## Findings

### R2-01 — FATAL — "Re-home load-bearing edges onto durable entity pages" is undefined for the two edge classes that matter most (`caused_by` event→event, and any edge whose temporal context lives ON the event)

**Attacks:** §6 compaction bullet (b): "before compacting an old event, **re-home its
load-bearing edges onto durable entity pages** (move `owned_by`/`caused_by` onto the
artifact/colonist) so they survive"; Risk #3 "**Resolved in design**"; §0/§8's claim that
the artifact spiral's provenance survives compaction.

**Why it's wrong (source-verified):** `purgeDeletedPages` (pglite-engine.ts:1090) hard-deletes
a page and FK-cascades every `links` row where the page is `from_page_id` **OR** `to_page_id`.
So an edge survives compaction-of-event-E only if NEITHER endpoint is E. "Re-home onto a durable
entity" therefore requires rewriting BOTH endpoints to non-event pages. Walk the actual edge classes:

- **`caused_by` is event→event.** The whole §6.6 Query #5 (`causal_chain`) is `caused_by*` over
  the *event* graph: "raid → caused_by → famine → caused_by → blight." Both endpoints are events.
  You cannot "move `caused_by` onto the artifact/colonist" — there is no entity endpoint to move it
  to. If you compact the intermediate event, the chain breaks at that node. The design names
  `caused_by` as a thing to re-home in the very same sentence that makes re-homing impossible for it.
  This is internally contradictory.
- **`involves` is event→colonist; `occurred_at` is event→location.** These have one entity
  endpoint, but the event endpoint is the one being deleted. Re-homing means turning
  `event --involves--> vera` into… what? `vera --participated_in--> {deleted event}`? The target is
  gone. You'd have to invent a synthetic "this colonist was in some now-compacted event" edge that
  has lost its WHEN (the event's `day`), its WHY (the event's prose, deleted in step c), and its
  co-participants. That is not the same edge; it is a lossy summary masquerading as graph structure.
- **`owned_by`/`lost_in` (the artifact provenance the headline depends on)** is the one case that
  half-works: `ashmark --owned_by--> vera` already has two entity endpoints, so it never needed
  re-homing — it was never on an event page to begin with. The design's own finding-02 example writes
  `owned_by` directly artifact→colonist. So the *only* edge re-homing trivially "works" for is the one
  that was never at risk, and the edges actually at risk (`caused_by`, `involves`, `occurred_at`) are
  exactly the ones re-homing cannot preserve without information loss.

**The temporal-context loss is the deeper bug.** Even where an endpoint is durable, the edge's
meaning is anchored to the event's `day`/`context`. `links` rows carry a `context` string but no
first-class temporal stamp tied to the event's day; `traverseGraph` returns no day, no context, no
frontmatter (verified: it returns only `{slug,title,type,depth,links{to_slug,link_type}}`,
pglite-engine.ts:2822-2828). Re-homing `vera --rival_of--> iron-empire` off the raid event that
*created* the rivalry loses the answer to "since WHEN, and over WHAT?" — which is precisely the
"a raid arrives with a reason the player can read" payoff §4.2 sells.

**Net:** "edge-safe compaction via re-homing" is hand-waving that is (a) impossible for `caused_by`
chains, (b) lossy for `involves`/`occurred_at`, and (c) unnecessary for the artifact provenance it
cites as the example. The R1-05 fix is not resolved; it has been restated in a form that doesn't
survive contact with the edge taxonomy in the same document.

**Concrete fix:** Stop trying to re-home. Two honest options: (1) **Never hard-delete edge-bearing
pages, ever** — never call `purge_deleted_pages`; compact only the *prose body* of an event by
`put_page`-overwriting it with a one-line stub while keeping the page row and all its edges (the
page persists, its body shrinks, edges survive, `day` survives in frontmatter). This actually bounds
the dominant cost (markdown + chunks) without touching `links`. (2) In the SQLite ship store,
`event` rows and `edges` rows are separate tables; compaction = `UPDATE events SET body=NULL` and the
edges are untouched by construction. The design already half-says this ("delete event body blob, keep
edge rows") — make THAT the primary mechanism for both phases and delete the re-homing language
entirely. Re-homing is a wrong idea that should not appear in v4.

---

### R2-02 — HIGH — finding-02's empirical proof is ~5 hand-written edges; it validates the API SHAPE, not that the model scales, performs, or is writable at game volume

**Attacks:** finding-02 "the core bet survives"; §0 "Measured result (finding 02): gbrain's typed
graph genuinely delivers this"; §4.2 "the lore-drop mechanic (measured end-to-end)"; Risk #2 framing
that the only unmeasured thing is write throughput.

**Why it's overclaimed:** finding-02 wrote exactly 5 `link` calls and ran 3 read queries against a
brain with a handful of pages. That proves: custom verbs are accepted, multi-hop traversal returns
correct rows, `--direction in` works. It does NOT prove anything the word "scales"/"end-to-end"
implies:

1. **Edge volume.** A real playthrough is not 5 edges. Every incident emits multiple edges
   (`event --involves--> {n colonists}`, `--occurred_at-->`, `--caused_by-->`, arc `--advances-->`,
   plus artifact spine edges on discoveries). At even ~10 edges/incident × thousands of incidents,
   that's 10k–100k+ `links` rows per save. finding-02 measured traversal correctness at depth 2 on a
   ~5-edge graph — it says NOTHING about traversal latency on a hub node (e.g. a long-lived faction
   with thousands of inbound edges) where the recursive CTE's per-layer fanout (the `frontierCap` in
   traverseGraph exists precisely because hub-fanout blows up, pglite-engine.ts:2766) becomes the
   bottleneck. The Director runs these on the hot path (`graph-query --direction in on live
   factions/artifacts`, §5 step 2). A faction the player has fought 200 times is a 200+-inbound-edge
   hub queried every incident slot. Unmeasured.

2. **Write throughput is dismissed, not measured.** Risk #2 says "unmeasured, step-1 TODO" — but the
   write path is the riskier half and the design leans on "async batched writes" as if batching makes
   PGLite-single-writer free. `addLink` is one INSERT-with-ON-CONFLICT per edge (pglite-engine.ts:2463);
   `addLinksBatch` exists but the design never commits to using it or sizing the batch. With inverse
   duplication (R2-03) the write count doubles. None of this is measured; the design treats a known-hard
   problem (CLAUDE.md ships an entire checkpoint/lock-heartbeat subsystem because PGLite writes under
   load are fiddly) as a footnote.

3. **"Measured end-to-end" (§4.2) is false.** What was measured is one query returning the right rows
   AFTER a human typed 5 perfect edges. The "end-to-end" loop the design sells — engine *emits* edges
   from gameplay, Director *scores* candidates, narration *renders* — was not run. No Director code, no
   scorer, no spiral. Calling §4.2 "measured end-to-end" is the same category of overclaim R1-04 caught
   ("answers all ten today"), just narrowed to one query.

**Concrete fix:** Rename finding-02's status from "the core bet survives" to "the API shape is
validated on a toy graph." Add an explicit, numbered prototype gate BEFORE any substrate decision:
seed a synthetic graph at realistic scale (≥50k edges, a hub faction with ≥1k inbound), then measure
(a) `graph-query --direction in` p99 latency on the hub, (b) batched write throughput for a simulated
1000-incident burst, (c) save-dir size. Until those three numbers exist, "scales / end-to-end /
measured" must not appear in the doc. The design has fixed the *correctness* claim (R1-01) but
inherited a new *scale* overclaim.

---

### R2-03 — HIGH — The "engine emits explicit edges" model silently makes the GAME responsible for thousands of hand-specified edge writes per playthrough — and doubles them for bidirectional queries — with no accounting of that burden

**Attacks:** §0/§3.3 "the mechanism is the game engine *emitting explicit edges it already knows*
(better for a game — deterministic…)"; finding-02 point 2 "For a game this is *better* than prose
extraction"; §3.3 ⚠️ bullet "If the game wants both as outgoing edges, it writes both (cheap)."

**Why "better/cheap" is doing a lot of unexamined work:** R1-01's fix replaced "free self-wiring from
prose" with "the game writes every edge explicitly." That is presented as a pure upgrade
("deterministic, no NLP"). It is also a *cost transfer the design never books*: the prose-extraction
fantasy, had it worked, was ONE `put_page` per incident and the graph filled itself. The replacement
is N explicit `add_link` calls per incident, each requiring the game to (a) know the exact `from`/`to`
slugs, (b) choose the right verb from 31, (c) issue the write. For a discovery incident that's easily
5–10 edges. The design never states "the game must author an edge-emission rule for every incident
type × every relationship it implies" — which is real, ongoing content-engineering work, the kind that
silently balloons. "Better for a game" is true for *determinism* but false for *authoring burden*, and
the doc only mentions the upside.

**Inverse duplication makes it worse, and the doc is inconsistent about it.** §3.3 ⚠️ correctly notes
inverses are NOT auto-materialized (verified: `addLink` writes one row, no inverse; pglite-engine.ts:2463).
finding-02 says reverse queries work via `--direction in`, so you DON'T need to write both. But §3.3
also says "If the game wants both as outgoing edges, it writes both (cheap)." Pick one: if the Director
always uses `--direction in` for reverse queries (as §5/§6.6 do), the game should write each edge ONCE
and the "writes both" sentence is dead weight inviting a 2× write blowup. If any query path needs the
inverse as an *outgoing* edge, name it — otherwise the "writes both (cheap)" escape hatch is an
unpriced 2× on the very write throughput Risk #2 already can't account for.

**Concrete fix:** Add an "edge-emission contract" subsection: for each `event` subtype (raid/social/
disaster/quest/discovery), enumerate the exact edges the engine emits. This is the real spec the game
must implement and the real measure of authoring burden — surface it instead of hiding it behind
"the engine already knows." Then state a single inverse policy: "write each edge once; all reverse
queries use `--direction in`" and DELETE the "writes both (cheap)" sentence. If something genuinely
needs a materialized inverse, that's a named exception, not a casual aside.

---

### R2-04 — FATAL — The resonance scorer relocates the entire hard problem ("what is dramatically charged?") into a `tension` frontmatter field that NOTHING populates, NOTHING reads, and whose worked example is circular

**Attacks:** §5 `callback_strength` formula `Σ tension(target(e))·recency_decay·arc_bonus` where
`tension(node) = node.frontmatter.tension ∈ [0,1] (engine-stamped)`; the worked example over §4.2;
Risk #1 "**Resolved**"; the one-paragraph framing that §5 now "specifies one term end-to-end (per R1-07)."

**Why it's still hand-waving (source + logic):**

1. **`tension` is invented; gbrain neither reads nor stamps it.** Grep across `src/core` finds no
   `tension` frontmatter concept (the only `tension` hits are search-mode/relational-intent noise).
   `traverseGraph` returns `{slug,title,type,depth,links}` — NO frontmatter (pglite-engine.ts:2822).
   So to compute `tension(target(e))` for each cited edge, the Director must, per candidate, per edge,
   issue a separate `get_page` to fetch the target's frontmatter (graph-query won't surface it). That's
   an N+1 read amplification on the hot path the design swore to keep cheap (§6 "Steps 1–3 are graph +
   arithmetic"). The "one specified term" quietly requires a fan-out of page fetches the cost model
   ignores.

2. **"engine-stamped" hides the actual unsolved problem.** WHO sets `tension`, HOW? The phrase
   "engine-stamped (∈[0,1])" appears once and is never defined. This is the R1-07 fear ("the scorer is
   100% novel work") relabeled, not resolved: the design moved "what makes a beat dramatically charged"
   out of the scorer and into a per-node scalar it declares exists without saying how it's produced. If
   `tension` is hand-authored per page, it's the same authoring burden as R2-03 plus subjective tuning.
   If it's computed (recency? edge degree? arc membership?), then `callback_strength` is partly circular
   — it scores candidates by a field that already encodes "is this dramatic," which is the thing the
   scorer was supposed to compute. Either way the hard problem is unsolved; it's been renamed `tension`.

3. **The worked example is circular and self-confirming.** §5 picks `tension 0.6` for the rival edge
   and `0.7` for the sought_by edge, then concludes the Iron-Empire-raid candidate "scores high → coherent."
   But those tension numbers were *chosen by the author to make the example come out right*. A "random
   toolbox theft cites nothing high-tension → scores low" only because the author assigned the toolbox
   nothing. Swap the numbers and the example inverts. A worked example whose inputs are hand-picked to
   produce the desired output proves nothing about whether the formula produces good stories from
   *organically-generated* tension values — and how those get generated is exactly the undefined part.

4. **Six of seven resonance terms remain undefined.** R1-07 asked for "at least ONE term end-to-end."
   v3 gives one term that itself depends on an undefined field. `character_stakes`, `valence_fit`,
   `tension_fit`, `fixation` are still names. The weights w1–w7 still have no values, no tuning method.
   R1-07 is partially addressed in form, not in substance.

**Concrete fix:** Define `tension` production explicitly or stop calling §5 "specified." A defensible
non-circular definition: `tension` is a deterministic function of graph-structural facts the Director
ALREADY has from the traversal — e.g. `tension(node) = clamp(α·open_arc_membership + β·recent_edge_count
+ γ·player_investment)` — computed at score time from the same edge set, never a stored field, never a
get_page fan-out. Show the worked example with tension *derived* from the toy graph, not assigned. And
demote Risk #1 from "Resolved" to "one term sketched; production of `tension` and 6/7 terms still open"
— honesty per the doc's own North Star.

---

### R2-05 — HIGH — The lore-GENERATION half — where the actual dropped lore TEXT comes from — is unspecified, and it is the harder, more expensive, more coherence-fragile problem than the memory graph the doc obsesses over

**Attacks:** the entire framing (title "AI storyteller + **lore generator**"); §4 "Hunting artifacts
that **drop lore**"; §4.2 "the engine writes a `lore` (subtype `fragment`) page"; §4.1 "`lore_fragments:
[...]` (revealed progressively)"; the friend's stated vision ("artifacts that DROP LORE").

**Why this is the under-served core:** The friend's headline is artifacts that *drop lore*. The lore is
the deliverable — the prose a player reads, the thing that must feel mythic, coherent across a 100-hour
save, non-repetitive, and on-theme. The design spends ~95% of its words on the *memory* (graph, edges,
traversal, compaction) and the *selection* (Director scorer), and essentially zero on **where the lore
TEXT comes from**. §4.2 says "the engine writes a `lore` page" — written by WHAT? Three possibilities,
all problematic and none chosen:

- **Hand-authored lore pool.** Then it's not emergent and not infinite; a fixed corpus exhausts and
  repeats — the exact thing artifact-hunting must avoid. The design's whole pitch is *emergent* narrative.
- **LLM-generated at drop time.** Then every artifact discovery blocks on an LLM call (latency, cost),
  and the design's own "keep the LLM out of the loop" rule is violated — or it's async, and the player
  finds an artifact whose lore appears seconds later. More importantly: **LLM-generated lore has no
  built-in coherence.** Fragment 2 of an artifact must agree with fragment 1 (same forger, same era);
  fragment 3 must not contradict the codex. The design's ONLY coherence mechanism is `find_contradictions`,
  which it correctly dropped as an offline LLM batch (R1-02). So lore coherence is *unsolved*: there is
  no mechanism keeping LLM-generated drops self-consistent, on-theme, or non-repetitive. This is the
  genuinely hard generative problem and the doc doesn't engage it.
- **Templated/Tracery-style grammar.** Cheap and deterministic but flat; "drops lore" becomes mad-libs.
  Not discussed.

The graph (gbrain or SQLite) helps you *select* and *connect* lore; it does nothing to *generate
coherent lore text*. The doc has thoroughly answered "which lore do I surface" and entirely skipped
"who writes the lore and how does it stay coherent" — which is what the friend actually asked for.

**Concrete fix:** Add a first-class "Lore generation" section that picks an approach and owns its costs.
The defensible design is probably **constrained LLM generation seeded by the graph**: when an artifact
drops fragment K, build a prompt from the graph facts already committed (`forged_by`, `lost_in`, prior
fragments' committed claims) so the LLM is *filling in prose consistent with locked structured facts*,
not inventing free-floating lore. The structured edges become the consistency contract; the LLM only
renders. State the cost (one async LLM call per drop, cached in save), the latency handling (drop the
structured fact instantly, render prose async), and the determinism consequence (see R2-06). Without
this section the doc answers the wrong question.

---

### R2-06 — FATAL — Save/load determinism contradiction: if lore TEXT is LLM-generated AND "regenerable, not authoritative," replaying a save can produce DIFFERENT lore, breaking the artifact→lore→Director causal chain that depends on specific lore content

**Attacks:** §6 "Narration is presentation — cached in save, seeded, regenerable — never authoritative
state"; self-review R5 "Narration is presentation, cached in save, regenerable, seeded"; §1 table
"Director … Must be deterministic (save/load)"; §4 spiral "Director reads freshly-revealed, high-tension
lore as callback fuel"; §5 `callback_strength` cites edges "the candidate's narration would cite."

**The contradiction:** The design draws a clean line — *structured state* (pages, edges, arc phases) is
authoritative and deterministic; *narration/lore text* is "presentation, regenerable, never
authoritative." That line is coherent ONLY if narration is causally inert. But the headline mechanic
makes lore causally active:

1. The Director scores candidates partly by `callback_strength`, defined over "edges the candidate's
   **narration** would cite" (§5). Narration choices feed selection.
2. The spiral (§4) has the Director read "freshly-revealed lore as callback fuel" → lore drives the
   next beat.
3. `lore_fragments` are revealed progressively and `reveals`-linked to figures/events — i.e. lore TEXT
   asserts structured facts ("forged by the Grey Smith") that become graph edges and provenance.

So lore is NOT mere presentation; it is an input to deterministic selection and a source of structured
facts. If lore text is LLM-generated and "regenerable," then **loading a save and continuing produces
a different world than the original run**: regenerated fragment 2 might name a different forger, which
either contradicts the committed `forged_by` edge (incoherence) or, if the edge is re-derived from text,
silently changes the provenance graph the Director walks. The "deterministic save/load" guarantee (§1)
is violated by the "regenerable lore" claim (§6) the moment lore carries any causal weight — and the
whole point of the design is that it does.

**This is not nitpicking shared saves.** A single player who quits and reloads must see the SAME lore
they read before, or the artifact they hunted means something different on reload. "Cached in save"
papers over it only if the cache is authoritative — but then lore is NOT "regenerable," it's
load-bearing state, contradicting §6's own claim. The doc wants lore to be both disposable presentation
AND the causal spine of the story. It can't be both.

**Concrete fix:** Resolve the contradiction explicitly. The correct rule: **the structured facts a lore
drop asserts are authoritative and committed as edges/frontmatter at drop time; the PROSE rendering of
those facts is cached-and-regenerable-from-the-locked-facts-with-a-fixed-seed.** I.e. regeneration must
be a deterministic function of (locked structured facts + fixed per-drop seed + pinned model), so
re-rendering yields the same prose, and even if the model changes, the *facts* (and thus the Director's
causal chain) are unchanged because they live in edges, not text. This forces R2-05's "constrained
generation seeded by graph facts" design and pins the model+seed per save (the doc already pins embedding
model per save; extend that to the narration model). State plainly: lore *facts* are authoritative
state; lore *prose* is regenerable ONLY because it's a pure function of those facts + seed. Drop the
unqualified "regenerable, never authoritative" framing.

---

### R2-07 — HIGH — The graduated recommendation has hedged itself into giving no decision; if the honest answer is "SQLite from day one," the doc lacks the courage to say it

**Attacks:** §0 "graduated bet … gbrain earns its place only as a fast design-REPL … and if you're
comfortable in SQL, building that store first … is a defensible alternative"; §6.5 "treat gbrain as an
optional accelerator … not as the World-Memory you build on"; §8 "If you're SQL-fluent, you may skip
straight to the store."

**Why it's a non-answer:** Read §0, §6.5, and §8 together and the recommendation is: "use gbrain, unless
you'd rather not, in which case use SQLite, both are defensible." That is not a recommendation; it's a
description of the option space with the decision handed back to the reader. The doc has done the
analysis to MAKE the call and then declines to. Its own evidence points one way:

- finding-02 + R1-08: the single hardest-to-replicate gbrain feature (prose→typed-graph) doesn't work
  here and isn't used.
- §6.5: 8 of 9 catalog queries are "plain SQL over `edges` + a recursive CTE… you'd write the same in
  SQLite in an afternoon."
- §6.6 #9 and the `tension` reads (R2-04) push logic into game code anyway.
- The ship store is SQLite REGARDLESS; the gbrain prototype is, by the doc's own words, throwaway.
- The genuinely gbrain-unique features are all deprioritized/discarded.

When the only retained value is "agent-drivable design REPL" and the SQLite store is needed regardless
and is "an afternoon" of work, the parsimonious conclusion is: **build the SQLite `edges` store first,
explore with an LLM agent against THAT, skip gbrain.** The doc gets within one sentence of this (§8.2
"you may skip straight to the store") then retreats to "graduated." The charter ("explore gbrain as
basis") is keeping a recommendation alive that the evidence has killed.

**Concrete fix:** Make the call. State a default with a single explicit branch: "**Default: build the
SQLite `edges` store first (you need it regardless; it's ~a day) and explore with an LLM agent against
it.** Use gbrain ONLY if you are NOT comfortable writing SQL and want to interrogate a world by talking
to an agent in the next hour — in which case it buys you a few days of zero-setup exploration before you
write the same store anyway." That's a real recommendation with a named tiebreaker (SQL comfort), not a
hedge. If the author believes gbrain is the default, then say THAT and defend it against §6.5's own
"afternoon" concession — but the doc cannot keep both as co-equal "defensible" paths and claim to have
recommended anything.

---

### R2-08 — HIGH — Artifact-hunting is modeled as trackable, not FUN: the design has the bookkeeping for a hunt and none of the loop that makes hunting a Rimworld-storyteller's headline mechanic

**Attacks:** §4 "Hunting artifacts … the primary narrative pump"; §0 "Artifacts are the spine
throughout"; the friend's vision (HUNTING is the headline).

**Why it's under-served:** Everything in §4 is *state about an artifact* — tiers, fragments, the
`grants`/`bears`/`hidden_at` edges, the spiral diagram. That is the database view of a hunt. None of it
is the *hunt as gameplay*. A Rimworld hunt that's fun needs decisions and friction the design never
models:

1. **The approach / partial information.** §4 has a `rumor` subtype but never models the player
   ASSEMBLING a location from incomplete clues — multiple rumors that triangulate, false leads, a map
   fragment that's wrong. "rumored_at → location" is one edge; a hunt is the *uncertainty* over which
   location, resolved by play. No mechanic for partial/contradictory location knowledge.
2. **Cost and risk of the hunt itself.** The fun of hunting is the expedition: do I send my best
   colonist, can I afford to lose them, is the `guarded_by` faction worth fighting NOW. The design has
   `guarded_by` as an edge but no model of the *decision* to mount the hunt vs. the Director's pacing —
   the hunt is just "HUNT (quest event)" in the diagram, an atom, not a loop.
3. **Competition / urgency.** §4 mentions "a rival races you to the last shard" in prose but there's no
   mechanic: no `also_sought_by` race state, no clock, no consequence if the rival gets it first. The
   most exciting hunt pressure is named and not modeled.
4. **The payoff being a CHOICE.** §4.1 lists player-fate edges (`destroyed`/`sold`/`sealed`/`ignored`)
   — good — but the boon/curse/who-wants-it decision is asserted ("the find is a *decision*") and never
   given stakes the Director responds to differently. What does selling vs. sealing actually change in
   the scorer? Undefined.

The design has built an excellent *ontology* for hunts and zero *game loop* for them. For the friend
whose ENTIRE pitch is hunting, that's the gap that matters most — and it's neither a gbrain nor a
SQLite question, so neither substrate addresses it and the doc doesn't flag that.

**Concrete fix:** Add a "Hunt loop" section orthogonal to the memory question: model (a) location
uncertainty as a set of weighted candidate `rumored_at` edges the player narrows through play, (b) the
hunt as a multi-step expedition with cost/risk the Director paces against the tension budget, (c) a
rival-race clock (`also_sought_by` + a deadline the Director advances), (d) explicit scorer
consequences for each fate edge. Flag clearly that this is GAME-DESIGN work independent of the store —
the doc's biggest omission is treating its headline mechanic as a data schema instead of a loop.

---

### R2-09 — MEDIUM — `arc_advance` / `next_beat` predicate matching is asserted as trivial but is an unspecified mini-planner, and "must progress or force-close" has no defined trigger

**Attacks:** §5 "`arc_advance` = max over open arcs of (does this candidate satisfy that arc's next beat
predicate)"; "the arc page's frontmatter declares its `next_beat` (e.g. `kind: raid, faction: iron-empire`)";
§6.6 #4 `arc_candidates` "days_since_advance > θ"; §5 "must progress … or force-close."

**Why it's thinner than claimed:** Matching a candidate to `next_beat: {kind: raid, faction: iron-empire}`
is easy ONLY if `next_beat` is a static literal. But arcs are "attractors" with a lifecycle
seed→rumor→rising→climax→resolution. Who advances `next_beat` from one beat to the next, and to WHAT?
That's a mini story-planner — after a raid fires, the arc's next beat is… a counterattack? a betrayal? a
revelation? The design says the arc "declares its next_beat" but never says who computes the *next*
next_beat after one fires, or how the climax→resolution transition is decided. `arc_advance` is "trivial"
only by assuming away the arc progression logic, which is the actual narrative-design work. Likewise
"must progress or force-close" names a guard with no trigger: what's the threshold, what does force-close
DO to the graph (write a `resolves` edge to what?), and does a force-closed arc leave dangling
`sought_by`/`guarded_by` edges pointing at a dead plot?

**Concrete fix:** Specify the arc state machine: for each arc archetype (revenge, prophecy, race),
enumerate the beat sequence and the transition rule (what advances rising→climax, what the resolution
beat writes). Define force-close: trigger (`days_since_advance > θ_kill`), action (write `resolves`
edge + flip phase to dormant + optionally spawn a "loose end" lore fragment), and edge cleanup. Until
the arc machine exists, `arc_advance` is the same "names the antidote, doesn't compute it" pattern
R1-07 flagged.

---

### R2-10 — MEDIUM — "PGLite dir is the save" collides with async-batched-writes + in-memory authoritative ring: on crash, the save on disk is BEHIND the authoritative game state

**Attacks:** §6 "The PGLite dir is per-save state"; §6 "Game owns an in-memory authoritative ring + a
durable append-only journal; flushes pages+edges to the store in batches off the hot path"; §1 table
"Reads deterministic; writes append-only."

**Why it's inconsistent:** Two claims that can't both hold. If the PGLite dir IS the save, then the save
must contain all authoritative state — but the design also says the in-memory ring is "authoritative for
the current session" and flushes to PGLite in batches "off the hot path." So between flushes, the PGLite
dir is STALE relative to the authoritative game state. A crash (or the player hitting save) mid-batch
yields a PGLite dir missing the last K incidents — unless the "durable append-only journal" is also part
of the save and replayed on load. But then the SAVE is "PGLite dir + journal + ring snapshot," not "the
PGLite dir," and load must reconcile them. The design names all three components and never specifies the
save/load reconciliation, while simultaneously asserting the simple "PGLite dir is the save." For a game,
save/load correctness is non-negotiable and this is hand-waved.

**Concrete fix:** Define the save artifact precisely: either (a) the journal is the save and PGLite is a
rebuildable read-cache (load = replay journal into a fresh PGLite), or (b) saving forces a full
synchronous flush so the PGLite dir is always complete at save points (accept the flush latency at the
save action, which is fine — players expect a save to take a beat). Pick one; "PGLite dir is the save" +
"writes are async-batched off the hot path" is currently a latent save-corruption bug.

---

### R2-11 — LOW — Schema-pack `extractable: true` on `lore`/`event`/`note`/`belief` is now inert and slightly misleading given finding-02

**Attacks:** schema/storybrain-base.yaml `extractable: true` on lore (139), belief (153), event (186),
note (244); the pack header comment line 9 "Edges auto-wire from [[type/slug]] wikilinks in page bodies."

**Why it's a (minor) leftover:** finding-02 established that prose wikilink extraction does NOTHING for
these custom dirs (not in `DIR_PATTERN`). `extractable: true` controls whether the page body is run
through extraction — which for these dirs produces zero typed edges. So the flag is now a no-op for its
intended purpose, and the pack's own header still says "Edges auto-wire from [[type/slug]] wikilinks"
(then walks it back three lines later). A reader who trusts the header is misled; the design body (§3.3)
got the correction but the pack file header didn't fully. Not load-bearing, but the doc's North Star is
honesty and this is a stale claim sitting in the artifact a user would actually load.

**Concrete fix:** Rewrite the pack header's line 9 to lead with the truth ("Edges are emitted
explicitly via `gbrain link`; prose [[wikilink]] auto-extraction does NOT fire for these dirs — see
finding 02") and either set `extractable: false` everywhere (since prose extraction is unused) or add a
comment that `extractable: true` is retained only for future BM25/chunking, not edge wiring.

---

## Verdict

**Round-1 fixes: partially sound, two regressed.** R1-01 is genuinely resolved and well-evidenced (the
shift to engine-emitted edges is correct and finding-02 proves the API shape). R1-02/03/06 (dropping
`find_contradictions`/`find_trajectory`/`whoknows`) are correctly resolved. But **R1-05 (compaction)
was not fixed — it was restated as "re-home edges," which is impossible for `caused_by` chains and lossy
for `involves`/`occurred_at` (R2-01, FATAL)**, and **R1-07 (the scorer) was fixed only in form: the
"one specified term" depends on a `tension` field nothing populates or reads, with a circular worked
example (R2-04, FATAL).**

**Newly fatal in v3:** the design has, across five self-review rounds and two adversarial rounds,
optimized the half of the problem that is well-understood (memory graph + Director selection) and never
engaged the half the friend actually asked for: **lore GENERATION** (R2-05) and its **determinism
consequence** (R2-06). If artifacts "drop lore" and lore is LLM-generated, the doc has neither a
coherence mechanism nor a consistent save/load story, and those two failures compound — regenerated lore
can silently rewrite the causal graph the whole design rests on. The headline mechanic (HUNTING) is
modeled as a schema, not a fun loop (R2-08).

**Is the core recommendation sound and actionable? No — it's a hedge (R2-07).** The doc's own evidence
(prose-extraction unused, 8/9 queries are an afternoon of SQL, ship store is SQLite regardless, every
gbrain-unique feature discarded) converges on "build the SQLite `edges` store first and skip gbrain
unless you specifically want agent-driven exploration without writing SQL" — but the doc declines to say
it, leaving two co-equal "defensible" paths and no decision.

**Single most important remaining change:** **Add a "Lore generation" section that makes structured
facts authoritative and prose a deterministic (seed+model-pinned) function of those facts** — this one
move simultaneously (a) answers the friend's actual question (where does dropped lore come from),
(b) resolves the determinism contradiction (R2-06), (c) gives lore a coherence contract (R2-05),
and (d) makes "regenerable narration" actually true. Everything else in the doc is plumbing for a story
engine whose story-text source is currently undefined. Second: fix compaction by deleting the re-homing
idea and keeping page rows with emptied bodies (R2-01). Third: make the substrate call instead of hedging
it (R2-07).

