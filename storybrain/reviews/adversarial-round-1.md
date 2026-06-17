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

---
