# Blind Judge Evaluation — Run 2

Two procedurally/AI-generated sci-fi worlds scored against the emergent-storyteller rubric.
Judged blind. World A = `pure-llm-world.json`. World B = `hybrid-world.json`. (Filenames noted
for the record only; scoring is on artifact quality, not provenance.)

---

## Structural audit (what's actually in the graph)

### World A (Aethel)
- **60 nodes**, 7 distinct types (location, faction, colonist, power, belief, curse, artifact, lore, event, arc).
- **Two parallel causal spines:**
  - Lore-fragment chain (6 links, strictly linear): `frag-the-mineral-was-a-mind → frag-the-vael-tapped-it → frag-the-delvers-cut-deep → frag-the-mind-woke-in-pain → frag-the-silence-spread → frag-the-keepers-recorded-it`. Each link is an explicit `caused_by` edge.
  - Event chain (6 links): `vael-first-tap → delver-deep-bore → the-waking → the-great-silencing → the-final-encoding → human-arrival`. Cleanly mirrors the lore chain at the event layer.
- **Cross-layer wiring is real, not decorative:** `frag-the-delvers-cut-deep reveals event/the-waking`; `frag-the-silence-spread reveals curse/the-unmaking-silence`; `frag-the-mineral-was-a-mind reveals belief/the-singing-is-alive`. The mystery answers actually light up other parts of the graph.
- **Artifact→lore drops triangulate:** the 6 hidden mystery fragments are each dropped by 2 different artifacts (e.g. `frag-the-mineral-was-a-mind` from BOTH `the-first-tuning-fork` and `orchard-memory-seed`; `frag-the-keepers-recorded-it` from `orchard-memory-seed` and `sefas-river-stone`). That redundancy means multiple artifact-hunt paths reach the same truth — strong for emergent play.
- **Living present-tense stakes:** Elara (suspects warning), Tovar (wants extraction, "aliens died of weakness"), Sefa (latent psychic, the only one who can read the Memory Seed), the still-spreading `unmaking-silence`, and an explicit `arc/the-warning-not-the-treasure`. The dead-civ history feeds a live, undecided drama.

**Weaknesses found in A:**
- `colony-landing-bishop located_at the-hollow-spire` — a settlement located *inside* a kilometers-deep ruin "lined with petrified bodies" is awkward; meant "in the lee of," but the edge literally nests the colony in the death-shaft.
- `faction/aethel-survey-corps worships lore/human-repeat-mistake` and `orchard-keepers worships belief/...` overload `worships` as a generic verb; the Survey Corps does not "worship" its own mistake. Verb hygiene is loose.
- Lore split into "fragment" (revealed:false) vs "context" (revealed:true) is clean, but several context-lore nodes (`vael-paradise-built`, `delver-contract`) are thin restatements of faction `desc` fields — mild filler.
- The 6-link chain is strictly linear: no branching. Causal *depth* is good; causal *branching* is nil.

### World B (Resonance / The Shroud)
- **40 nodes**, fewer types (faction, location, event, artifact, colonist, lore).
- **Mechanical event chain is long and dense:** 21 numbered events (`0-discovery` … `20-cascade`), each `exploitation` event `caused_by` its paired `discovery`, plus war events `caused_by` prior exploitations. Tracing it: there are ~15 `caused_by` event edges forming an interleaved 4-civ braid across 3 time-steps (day 100/200/300), converging on `events/20-cascade` (tension 1.0).
- **The mystery chain itself is short — only 3 fragments:** `fall-of-the-shroud → fall-of-the-deep-architects → fall-of-the-ephemera`, linear `caused_by`. The Luminaries (the survivor/witness) have NO fall fragment in the mystery `order` — correct in-fiction (they survived) but it means the mystery is a 3-beat reveal, half the length of A's.
- **A large pool of 14 lore fragments** (most `revealed:false`) sits *outside* the 3-fragment mystery `order`: `the-drowned-god`, `the-choir-learns-to-say-i`, `the-salted-seam`, `the-frozen-second`, `the-seers-warning`, `the-honest-lattice-betrayal`, `the-bedrock-that-forgot`, `the-deep-certainty-hunger`, `the-loop-that-was-never-theirs`, `the-broadcast-that-still-arrives`, `the-borrowed-centuries`. These are rich and they `reveal` specific nodes, but they are NOT in `mystery.order` — so the "ordered reveal" is only 3 beats and the other 11 fragments are unordered supporting texture.
- **Artifact→lore drops are well-distributed:** `mind-archive-9` drops 4 (shroud-side), `void-anchor-14` drops 6 (including the deep-architect + seer + lattice fragments), `last-broadcast-20` drops 4 (ephemera-side). Each artifact illuminates a coherent thematic cluster.
- **One unifying cause, exquisitely seeded:** `the-drowned-god` (psychic-ruin = pulverized murdered Aeon Coalition hive-mind that wants to be whole by dissolving all borders) is the WHY under every over-extraction. `the-salted-seam` is a genuinely clever vector mechanic (contagion rides "safe" stellar-dust). Strong thematic spine.

**Weaknesses found in B:**
- **`day` is degenerate.** 19 of 21 events are stamped `day: 100/200/300` in three flat buckets; nearly everything happens "on day 300." For an emergent storyteller that wants temporal texture, this is near-useless chronology — the ordering lives in slug numbers, not time.
- **The `lore.order` undersells the content.** Only 3 fragments are in `mystery.order`, yet 14 exist. A storyteller driving "reveal in order" gets a 3-beat arc; the other 11 are reachable but unsequenced. The mystery *structure* is thinner than the lore *volume* suggests.
- **No living present-tense stakes.** Humans are "salvagers among graves they cannot read" — passive. There is exactly one named figure (`the-luminaries-seer-9`), and she is already dead/dimming. There is no equivalent of A's Sefa/Tovar/Elara tension, no active threat the players can still avert. The drama is entirely post-mortem.
- **Structural repetition.** The discovery→exploitation(→war) template is applied near-identically to all four civs. Beautiful prose masks a very regular machine: every civ over-extracts, every fall is "the drowned god's hunger." Less surprising on the second civ than the first.
- **Edge verb `fell_to` all point to one node** (`events/20-cascade`); three civs `fell_to` the same event — coherent, but flattens individual fall-causality into one shared sink.

---

## Per-dimension scores

| Dimension | A | B | Rationale |
|---|---|---|---|
| **1. Coherence** | 8 | 9 | Both internally tight. B's single-cause discipline (`the-drowned-god` under every over-extraction, `the-salted-seam` explaining cross-contamination) is airtight and self-correcting. A loses a point for verb overloading (`worships` on `human-repeat-mistake`) and the colony-nested-in-the-death-shaft `located_at` edge. |
| **2. Causal depth** | 8 | 8 | A has TWO clean 6-link spines (lore + event) that mirror and cross-reveal each other. B has a denser, longer interwoven event braid (~15 `caused_by` edges, 4 civs, converging on the cascade) but its *mystery* chain is only 3 links and strictly linear; depth in the machinery, shallower in the reveal. Even. |
| **3. Thematic richness** | 7 | 9 | B is denser and more distinctive: hive-soul "drinking a dissolved sibling," certainty-hunger as the lever, a recorded broadcast that "dissolves mid-sentence into a plea." A's planet-mind-flayed-awake is strong and the psychic layer (Dreamtide/Deep-Sight/Silence-Touch) is well-differentiated, but the alien civs lean on familiar molds (cetacean telepaths, chitinous miners, avian oracles). |
| **4. Novelty / surprise** | 7 | 8 | B's "they were un-remembered, not buried — surveyors found unbroken rock where cities are recorded to have stood" (`the-bedrock-that-forgot`) and individuation-as-contagion are genuinely fresh recontextualizations. A's "warning sold as treasure" and "second drilling repeats the first mistake" are sharp but more recognizable tragic-irony beats. B edges it, though its rigid discovery→exploitation template caps the surprise. |
| **5. Dramatic potential** | 9 | 7 | A wins decisively. It seeds a LIVE, undecided story: Sefa (only reader of the Seed) vs Tovar (drill on schedule) vs the still-spreading `unmaking-silence`, with `arc/the-warning-not-the-treasure` as the question and dual artifact-paths to each truth. B's drama is entirely in the past tense — a magnificent autopsy with no patient left to save and no active human agency. For *emergent* play and artifact hunts that change an outcome, A gives a storyteller far more to work with. |

**Totals:** A = 39/50 · B = 41/50

---

## Overall winner: **World B (hybrid-world.json)** — narrowly

World B is the stronger *artifact* on the page: it commits to a single, ruthless causal engine
(`the-drowned-god` — psychic-ruin as a murdered hive-mind that dissolves all borders to make itself
whole) and earns every fall from it, with standout conceits like the salted-seam contagion vector and
civilizations that are "un-remembered" rather than destroyed. That coherence + thematic density carries
two dimensions outright. But the win is narrow and comes with a real cost: B's chronology is degenerate
(nearly everything stamped day 300), its mystery `order` exposes only 3 of 14 fragments as a sequenced
reveal, and — most damaging for an *emergent storyteller* — it has no living stakes, only a beautifully
documented graveyard. World A is the better *engine for stories*: it pairs a clean dual causal spine with
a present-tense, undecided arc (Sefa/Tovar/Elara, the spreading Silence, redundant artifact-paths to each
truth), which is exactly what a storyteller exploits to generate divergent runs. If the rubric weighted
dramatic potential and artifact-hunt branching more heavily, A would take it.

**Single biggest quality difference:** World B has the richer, more disciplined *lore* (one unifying
murdered-god cause, denser texture), while World A has the richer *playable drama* (a still-open, human-stakes
arc with multiple artifact paths to each revealed truth) — B wins the page, A wins the table.
