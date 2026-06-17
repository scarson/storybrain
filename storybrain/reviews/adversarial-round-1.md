# StoryBrain — Adversarial Review, Round 1 of 3

> Hostile expert review of `storybrain/DESIGN.md` (v2). Mandate: find fatal flaws.
> Each finding is appended as discovered (container may restart). Severity scale:
> FATAL / HIGH / MEDIUM / LOW.

## Method

- Read DESIGN.md v2 + self-review.md in full.
- Verifying every gbrain capability claim against source: `src/core/operations.ts`,
  `src/core/search/*`, `src/core/schema-pack/*`, link extraction, contradiction
  detection, trajectory, traversal, soft-delete/compaction.

## Findings

### R1-01 — FATAL — The typed-edge auto-wiring the whole design rests on does NOT work for storybrain's slug namespaces

**Attacks:** §2 ("gbrain's graph builds itself from `[[type/slug]]` wikilinks on every write, with no LLM calls — that zero-cost self-wiring is the property that makes emergence affordable"), §3 ("Edges auto-wire from wikilinks"), §4.2 ("That one write wires the graph (edges to artifact, colonist, smith, faction — no LLM)"), and D2 in DECISIONS.md ("zero-LLM self-wiring graph").

**Why it's wrong (source evidence):** The wikilink that produces a *typed, dir-recognized* graph edge is gated by a **hardcoded constant** in `src/core/link-extraction.ts:86`:

```
const DIR_PATTERN = '(?:people|companies|meetings|concepts|deal|civic|project|projects|source|media|yc|tech|finance|personal|openclaw|entities)';
```

`WIKILINK_RE` (line 111-114) only matches `[[dir/slug]]` when `dir` is in that set. The design's example write (§4.2) uses `[[artifact/ashmark]]`, `[[colonist/vera]]`, `[[lore/the-grey-smith]]`, `[[faction/iron-empire]]`. **None of `artifact`, `colonist`, `lore`, `faction`, `location`, `belief`, `event`, `arc`, `power`, `curse` are in DIR_PATTERN.** So those wikilinks are NOT matched by the typed extractor. They fall through to the generic `[[bare-name]]` pass (2c, line 354-383) which:
  - requires the opt-in `link_resolution.global_basename` flag (default OFF, `isGlobalBasenameEnabled`, line 1219),
  - emits the edge with a single fixed `linkType: 'wikilink_basename'` (line 502, `WIKILINK_BASENAME_LINK_TYPE`), NOT the relationship type the design needs, and
  - resolves by **basename uniqueness** — `[[artifact/ashmark]]` would have to be reduced to its tail `ashmark` and matched against a global basename index, with multi-match ambiguity.

Critically, **the schema pack's `path_prefixes` does NOT extend `DIR_PATTERN`** — grep confirms `DIR_PATTERN` is a module constant referenced nowhere near pack loading; the active pack never mutates it. So authoring `storybrain-base.yaml` with `path_prefixes: [artifact/, colonist/, ...]` changes type *classification* but does nothing for wikilink edge extraction.

The design conflates two separate gbrain facts: (a) a pack declares `link_types` with `inverse` names (true, see gbrain-base-v2.yaml:305), and (b) edges auto-wire from `[[type/slug]]`. (b) only holds for the VC dirs baked into DIR_PATTERN. The relationship *types* the design lists (`killed`, `betrayed_by`, `guarded_by`, `grants`, `bears`, `forged_by`, `sought_by`...) are never inferred from prose: `inferLinkType` (link-extraction.ts:694-724) only ever returns `founded | invested_in | advises | works_at | mentions`. There is a pack-extension hook (`inferLinkTypeFromPack` via `link_types[].inference.regex`, link-inference.ts), but it does per-edge regex over the 240-char context window AFTER the wikilink has already been matched by DIR_PATTERN — it does not widen which wikilinks get extracted, and it requires hand-authoring a regex per verb that competes with the same brittleness as the VC regexes.

**Net:** the "free, zero-LLM, typed self-wiring graph" is the single load-bearing claim of the whole "use a brain not a flat wiki" thesis (D2), and for storybrain's actual namespaces it is **largely false out of the box.** To get it you must FORK gbrain (edit DIR_PATTERN, or rewrite the extractor to be pack-driven) — which contradicts the "unmodified fork" framing and the "strip, don't modify" integration plan (§6).

**Concrete fix:** Either (1) explicitly scope the design to a FORKED extractor: replace the hardcoded `DIR_PATTERN` with one generated from the active pack's `path_prefixes`, and replace `inferLinkType`'s VC verb cascade with the pack's `link_types` (this is real engineering work, not "strip 80%"); OR (2) abandon prose-wikilink inference and have the game write edges *explicitly* via the `add_link` op (which the Query Catalog already needs) — at which point the "self-wiring from wikilinks" selling point evaporates and the comparison vs. flat-wiki must be re-argued on different grounds. The design must pick one and stop claiming the free typed graph.

### R1-02 — HIGH — `find_contradictions` is not a live consistency checker; it's a cached reader of an LLM eval probe that costs money and is non-deterministic

**Attacks:** §5 ("`find_contradictions` → flag lore conflicts"), §6.6 Query #10 (`contradictions(scope)`), Risk #7 ("Mitigated: `find_contradictions` pass"), R3 self-review ("we have a tool: gbrain ships `find_contradictions` — repurpose it for lore consistency"), and the claim "gbrain answers all ten [queries] today."

**Why it's wrong (source evidence):** `find_contradictions` (operations.ts:3434-3498) does NOT scan or compare lore. Its own inline comment: *"Reads eval_contradictions_runs.report_json for the latest run... No new probe is triggered; the agent surfaces what's already on disk."* The op calls `loadContradictionsTrend(30)` and filters a cached JSON report. If no probe has run in 30 days it returns `[]` with a note to run `gbrain eval suspected-contradictions`.

The *actual* detection is `eval-contradictions/runner.ts`, which: runs `hybridSearch` (embedding cost), generates candidate pairs, and judges each pair with an **LLM** (`DEFAULT_JUDGE_MODEL = 'anthropic:claude-haiku-4-5'`, runner.ts:56) under a USD budget ceiling. So "lore consistency" is: (a) not deterministic, (b) per-run LLM spend, (c) only as good as retrieval surfacing the conflicting pair into the top-K, and (d) batch/offline, not a queryable graph fact. This is fine for "run overnight" framing, but the design repeatedly treats it as a cheap deterministic query in the Director's toolbox and as a Query-Catalog primitive the embedded SQLite port must satisfy. **The embedded port would have to reimplement an LLM-judged retrieval probe** — exactly the expensive, non-portable part the §6.5 "it's just a relations table + FTS5" steelman waves away.

**Concrete fix:** Move contradiction detection out of the per-tick Director loop entirely (it already implies LLM cost). Re-scope Risk #7 honestly: lore consistency is an overnight LLM batch job with running cost, not a free graph query, and it does NOT port to the embedded store without bringing an LLM judge along. Drop `contradictions(scope)` from the "10 deterministic queries" catalog or flag it as the one LLM-bound, non-portable outlier.

### R1-03 — HIGH — `find_trajectory` is hardwired to numeric VC metric-claims (MRR/ARR/runway), not narrative/causal chains

**Attacks:** §5 ("`find_trajectory` → arcs ripe to pay off"), §3.1 (`event` type: "`temporal` ⇒ `timeline`+`find_trajectory`"), §6.6 Query #4 (`arc_candidates`) leaning on it, and the "answers all ten today" claim.

**Why it's wrong (source evidence):** `FIND_TRAJECTORY_DESCRIPTION` (operations-descriptions.ts:93-101): *"return the chronological claim trajectory for an entity (typed metric values over time...). Use this when the user asks 'how has Acme's MRR trended'..."* The op returns `{points: [{metric, value, unit, period...}], regressions: [{metric, from_value, to_value, delta_pct}]}` and supports `metric` filters like `mrr`, `arr`, `team_size` and a `kind: 'metric'|'event'` switch (operations.ts:3513-3520). This is a **typed-claim time-series engine for structured numeric facts**, computed via `computeTrajectoryStats`. It has nothing to do with "which arcs are ripe to pay off" — there is no notion of arc phase, tension, or dramatic readiness in it. Using it for storybrain would require populating the typed-claim/fact tables with numeric metrics, which storybrain pages won't have.

**Concrete fix:** Delete `find_trajectory` from the Director's sensorium (§5) and Query Catalog. "Arcs ripe to pay off" is a trivial query the design already needs anyway — read `arc` pages where frontmatter `phase ∈ {rising, climax}` and `days_since_advance > threshold`. Write that as a first-class catalog query (`arc_candidates`) and stop borrowing a VC-metrics op that does something else.

### R1-04 — HIGH — The authored schema pack and prototype the design repeatedly cites DO NOT EXIST

**Attacks:** §3 ("Authored pack: `storybrain/schema/storybrain-base.yaml`; rationale below"), §6.6 ("gbrain answers all ten today; that's the value of building the prototype on it"), Recommendation step 1 ("Author `storybrain-base.yaml`, stand up a PGLite brain... drive *one full spiral*... Confirm the resonance pick *feels authored*").

**Why it's risky:** `storybrain/schema/` and `storybrain/prototype/` are **both empty directories** (verified). `findings/` is empty. So every claim of gbrain capability in the design is asserted from reading source, NOT from a single executed `put_page`/`search`/`graph` call against a real storybrain brain. The design presents itself as "post 5-round self-review" and asserts "gbrain answers all ten today" — but nothing was run. Given R1-01 (the wikilink extraction would have produced `wikilink_basename` edges or nothing, not the typed graph), even a 30-minute prototype would have caught the central flaw. The most important validation — "does the resonance pick feel authored" — is pure assertion.

**Concrete fix:** Before any further design polish, execute the §8 step-1 prototype for real: author the pack, seed ~10 pages with the design's own example wikilinks, run `gbrain extract`/`put_page`, and run `gbrain graph artifact/ashmark` + `gbrain whoknows`. Record actual output in `findings/`. The design's credibility depends on at least one end-to-end spiral having actually run.

### R1-05 — HIGH — Chapter compaction via soft-delete will HARD-DELETE the raw events AND their edges after 72h — destroying the provenance graph

**Attacks:** §6 ("Chapter compaction: periodically fold old raw events into a `chapter` summary and **soft-delete the raw events**. Bounds save size."), R2 self-review ("gbrain's soft-delete + versions support it"), Risk-table framing of compaction as safe archival.

**Why it's wrong (source evidence):** gbrain soft-delete is NOT archival — it is a 72h staging area before permanent destruction. `soft_delete_page` (operations.ts:1255): *"recoverable via restore_page within 72h. The autopilot purge phase hard-deletes after the recovery window."* `purge_deleted_pages` (operations.ts:1313-1326): *"Hard-deletes pages whose deleted_at is older than older_than_hours (default 72). **Cascades through content_chunks, page_links, chunk_relations.**"*

So the design's compaction plan, run on gbrain as-is, does this: fold raw events into a `chapter`, soft-delete the raw events → 72 hours later the autopilot purge **hard-deletes those pages and CASCADE-DELETES every graph edge touching them** (`page_links`). But the edges on raw events ARE the emergent graph — `caused_by` chains, `involves` colonist links, artifact `owned_by`/`lost_in` provenance, `advances`→arc. The Director's §5 step-2 queries (`causal_chain`, `artifact_provenance`, `open_grudges`) walk exactly these edges. Compaction as specified silently severs the throughline the design spent §4 building. The `chapter` summary text survives, but the *queryable structure* — the thing that justified using a graph over a flat wiki (D2) — is gone.

**Concrete fix:** Compaction must NOT soft-delete edge-bearing event pages. Options: (a) before compacting, promote the load-bearing edges onto durable entity pages (re-home `owned_by`/`caused_by` onto the artifact/colonist pages so they survive event deletion); (b) disable the autopilot purge entirely (`purge_deleted_pages` is the only purge surface; the game owns the brain so it can simply never call it) and accept unbounded soft-deleted rows — but then "bounds save size" is false; (c) in the embedded port, redefine compaction as "detach raw event bodies, keep edge rows" which gbrain's schema does not support without a fork. The design currently claims a free lunch (bound size AND keep the graph) that gbrain's delete semantics do not provide.

### R1-06 — MEDIUM — The design cannot fully escape gbrain `salience`; Query #7 (`whoknows`) bakes it into ranking

**Attacks:** Risk #1 ("gbrain `salience` ≠ dramatic salience. *Resolved:* define our own `tension`/`valence` frontmatter and query it; **don't lean on built-in salience**.") vs §6.6 Query #7 (`who_knows(topic)` → "`whoknows`").

**Why it's a tension:** `whoknows`/`findExperts` scoring is `score = expertise × recency_decay × (0.5 + 0.5 × salience)` (src/commands/whoknows.ts:10,147). The built-in `salience` (emotional_weight + take_count, operations.ts:1480) is a multiplicative factor in the expert ranking the design adopts wholesale as Query #7. So "don't lean on built-in salience" is violated the moment you use the op the catalog lists. For storybrain pages, `emotional_weight`/`take_count` will be ~uniform/zero, so the salience factor degenerates to a constant 0.5 — `whoknows` will rank colonists almost purely by chunk-match count and recency, which may or may not match "who's the best surgeon." Not fatal, but the design's claim of clean separation from gbrain salience is inaccurate, and Query #7's usefulness for a game is unvalidated.

**Concrete fix:** Either drop `whoknows` and implement "who knows surgery" as a trivial skill-stat lookup in game code (colonists have skill numbers — this is not a retrieval problem), or accept that `whoknows` degenerates to keyword+recency for game data and validate it's good enough. Remove the "don't lean on salience" claim or qualify it.

### R1-07 — MEDIUM — The Director resonance scorer is under-specified hand-waving; the load-bearing terms have no defined computation

**Attacks:** §5 step-3 (the 7-term `resonance = w1·arc_advance + w2·callback_strength + w3·character_stakes + w4·valence_fit + w5·tension_fit − w6·repetition − w7·fixation`), the one-paragraph answer ("the resonance scorer is the real game-design work"), and Recommendation step-1's success criterion ("Confirm the resonance pick *feels authored*").

**Why it's risky:** Six of seven terms are named but never defined as a computation. `callback_strength` — "cites real graph history" — how is it scored? Number of edges touched? Edge recency? Path length to a high-tension node? Without a definition, R3's own self-review fear ("maximizing local `callback_strength` produces non-sequiturs that reference the past") is unaddressed — the design *names* the fear and then *names* `arc_advance` as the antidote without specifying how `arc_advance` is computed either ("moves an OPEN active plot" — moved how? what counts as advancing an arc beat?). `repetition` is "semantic dup of recent events" — that needs the embeddings the design tried to minimize (R2/R3 tension resurfaces). The weights w1..w7 have no values, no tuning method, no eval. "Feels authored" is not a testable criterion. This is the actual core of whether the game is fun, and it is the least-specified part of the document — appropriate to flag as game-design work, but the design overstates how much gbrain de-risks it. gbrain gives you the *inputs* (edges, search hits); it does nothing for the *scoring function*, which is 100% novel work with no reference implementation and no validation that it produces coherent stories rather than word-salad callbacks.

**Concrete fix:** Specify at least ONE term end-to-end with a concrete formula and a worked example over the §4.2 Ashmark scenario (e.g. `callback_strength(candidate) = Σ over edges the candidate's narration would cite of tension(target) · recency_decay(edge)`), then state the falsifiable success metric for the step-1 prototype (e.g. "a human rater, shown 10 Director picks blind, cannot distinguish them from 10 hand-authored beats at better than chance"). Until one term is specified and one spiral is run, "feels authored" is faith, not design.

### R1-08 — MEDIUM — The phase-split rationalization: gbrain's actual value is the part that does NOT port to the embedded SQLite store

**Attacks:** §0 / §6.5 / R4 ("port the proven query set to an embedded in-process store (SQLite+FTS5)... gbrain for the prototype + as the reference implementation"), §6.6 ("If the embedded store answers these, the Director is portable. gbrain answers all ten today; that's the value of building the prototype on it.").

**Why it's risky (steelman of "skip gbrain"):** The design's own §6.5 admits "everything the Director needs is, at bottom, a relations table + a text index." Walk the 10-query catalog against what actually ports:
  - #1,2,4,5,6,8,9 (grudges, owned-but-sought, arc candidates, causal chain, relationship path, recent events, provenance) are all **plain SQL over an `edges(src,type,dst,day)` table + recursive CTE** — trivially portable, and gbrain adds nothing you couldn't write in an afternoon against SQLite. gbrain's `traverse_graph` is a recursive CTE (operations.ts:2083); you'd write the same CTE in SQLite.
  - #3,7 (fresh_lore, who_knows) are FTS + a frontmatter filter — portable, gbrain's hybrid ranking is overkill.
  - #10 (contradictions) does NOT port (R1-02: it's an LLM judge).
  - The self-wiring typed graph (R1-01) does NOT port AND does not even work in gbrain for these namespaces without a fork.

So the genuinely gbrain-only value-adds are: hybrid RRF ranking, contradiction-via-LLM, salience, trajectory, synthesis — and the design has *already deprioritized or discarded every one of them* (vector "scoped to a few hundred rows," salience "don't lean on it," trajectory misapplied per R1-03, contradictions an overnight batch). What remains that gbrain uniquely provides for the prototype is **the agent-operable CLI/MCP surface** — i.e. you can drive it by talking to it without writing engine code. That is a real but much smaller claim than "gbrain is the right World-Memory." The honest framing: gbrain is a convenient *scaffolding/REPL for design exploration*, not a component whose retrieval intelligence you are leveraging. The flat-wiki comparison (D2) is a strawman — the real alternative is "SQLite + FTS5 + an edges table from day one," which the design's own §6.5 concedes is the ship target. The steelman "skip gbrain, use SQLite from day one" is strong: you avoid building a throwaway prototype against an API whose typed-graph and contradiction features you then have to reimplement or discard.

**Concrete fix:** Re-cost the phase-split honestly. State plainly that the prototype's value is "agent-drivable design REPL," NOT "leverage gbrain's retrieval." Then answer: is a few-days agent-driven exploration worth it vs. writing the SQLite schema + 10 queries directly (which you need anyway)? If the answer is "the SQLite version is ~the same effort and is the real artifact," the design should recommend skipping gbrain and building the embedded store first, using an LLM agent against *that* for design exploration. The current document reads as rationalizing a tool that was handed to it (DECISIONS.md charter: "Explore gbrain as basis...").

### R1-09 — LOW — "~12 of 136 ops" / "answers all ten today" overclaims given R1-01/02/03

The §6 op shortlist and §6.6 "answers all ten today" are stated as settled fact but at least 3 of the named ops do something other than the design assumes (R1-01 typed wikilinks, R1-02 find_contradictions, R1-03 find_trajectory). Combined with R1-04 (nothing was run), the confident "today" framing is not earned. Fix: soften to "claims to be verified by the step-1 prototype" and correct the three ops.

### R1-10 — LOW — PGLite single-writer + sidecar HTTP per save: the async-batch mitigation is asserted, not measured

§6 / Risk #2,3 mitigate write throughput with "async batched writes + durable journal." Plausible, and embedding-off removes the worst cost. But no number is given for batch flush latency under PGLite, and the design simultaneously wants concurrent reads "against the last flush" while a write batch holds the single writer. The CLAUDE.md sync machinery (checkpoints, lock heartbeats, `EMAXCONNSESSION`) exists precisely because PGLite-class writes under load are fiddly. Low severity because the ship target abandons PGLite anyway, but the prototype-phase write path should be measured, not assumed. Fix: add a throughput target and measure it in the step-1 prototype.

---

## Verdict

The core thesis splits cleanly into a sound half and an unsound half. **Sound:** the Director/World-Memory separation (D1) is correct and well-argued; keeping the LLM out of the per-tick loop is right; the artifact-as-graph-spine *concept* is genuinely good game design; and embeddings ARE optional in gbrain (the one major technical claim that fully checks out against source). **Unsound:** the specific reason given for choosing gbrain over a flat wiki — "free, zero-LLM, typed self-wiring graph from `[[type/slug]]` wikilinks" (D2, the foundational decision) — is **substantially false for storybrain's namespaces** (R1-01): gbrain's typed wikilink extractor is hardcoded to VC entity dirs and VC verbs, the pack's `path_prefixes`/`link_types` do not retarget it, and getting the advertised behavior requires forking the extractor — which the "unmodified fork / strip 80%" plan explicitly rules out. Two more pillars (`find_contradictions`, `find_trajectory`) do something other than claimed (R1-02, R1-03), compaction destroys the very graph it's meant to preserve (R1-05), and crucially **none of it was ever run** (R1-04) despite a design that asserts "gbrain answers all ten today."

The single most important thing that must change: **stop claiming the free typed self-wiring graph and run the prototype.** Either (a) re-scope the design around a FORKED, pack-driven link extractor and own that engineering cost honestly, or (b) drop wikilink-inference entirely, write edges explicitly via `add_link`, and re-argue gbrain-vs-SQLite on the only honest remaining ground (agent-drivable design REPL) — at which point the steelman "just build the SQLite edges-table from day one" (R1-08) likely wins. Until §8 step-1 is executed for real and recorded in `findings/`, this is a plausible-sounding document resting on an unverified, and in its central claim incorrect, model of what gbrain does.
