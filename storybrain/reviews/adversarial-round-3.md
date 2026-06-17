# StoryBrain — Adversarial Review, Round 3 of 3 (FINAL)

> Hostile expert review of `storybrain/DESIGN.md` (v4). Mandate: VERIFY rounds 1–2
> fixes are actually resolved in v4, then find what is STILL wrong, NEWLY broken by
> v4's changes, or never addressed. Do not re-litigate resolved findings; verify
> them. Each finding appended as discovered (container may restart). Severity:
> FATAL / HIGH / MEDIUM / LOW.

## Method

- Read DESIGN.md v4 in full; rounds 1 & 2 reviews; findings 01–04; the actual
  prototype code (`director.ts`, `seed.sh`, generated `world.json`); DECISIONS.md.
- Re-derived the prototype scores by hand to check the finding-03 claims and
  whether the result is cherry-picked by construction.
- Attacked the emergence claim, the procgen hand-wave, reveal-order determinism,
  the §0 recommendation, and v4-internal consistency.

## Findings

### R3-01 — FATAL — The committed prototype does NOT reproduce finding 03 from its own documented recipe; the numbers in finding 03 are a transient, now-corrupted brain snapshot

**Attacks:** finding 03 ("Reproduce: `GBRAIN_HOME=/tmp/storybrain-brain bash seed.sh; bun director.ts`" → raid-iron 3.197, raid-ash 0.989, flare 0.210); §0/§2 ("demonstrated driving a coherent Director pick (finding 03)"); the entire "EMPIRICALLY verified / measured not asserted" framing the v4 status line leans on.

**Why it's wrong (executed, not asserted):** I ran the documented recipe verbatim on a fresh brain home and got **every candidate scoring rawCb 0.000** — raid-iron won at **0.770**, purely on the arc multiplier and tension_fit, with the trace literally printing `cites: (none — no graph history) → cold/random beat` while *still* emitting the hard-coded narration "They have not forgotten the Ashmark." The reason: **`seed.sh` never runs `gbrain init` and never copies/activates the pack.** It assumes a brain already exists at `GBRAIN_HOME`. Its helper `GB(){ bun src/cli.ts "$@" >/dev/null 2>&1; }` swallows ALL stdout/stderr and then unconditionally `echo`s fake success ("page colonists/vera", "edge …"), so a totally failed seed reports a clean run. On a clean container the seed silently writes nothing.

**Worse — the brain finding 03 was recorded against is now corrupted and gives a DIFFERENT number.** Running the recipe against the only brain that actually exists on this machine (`/tmp/storybrain-brain`, hand-initialized in a prior session) yields **raid-iron = 37.157**, not 3.197 — because finding 04's 64 grunt-hub edges and prior director write-backs accumulated in the same brain. `char_stakes` reads **61** (it counts all 60 grunt colonists). raid-ash/heist are **4.989**, not 0.989. So the committed evidence file reports numbers that are reproducible from NEITHER the committed seed on a clean brain NOR the actual brain on disk.

I *can* reproduce 3.197 exactly — but only by performing the steps the recipe omits: `gbrain init --pglite --no-embedding`, `mkdir -p $HOME/.gbrain/schema-packs/storybrain-base && cp storybrain-base.yaml …/pack.yaml`, `schema use storybrain-base`, THEN seed, THEN director. Finding 03's recipe is missing the three load-bearing setup steps, and finding 03 doesn't mention them.

**Net:** the headline "WORKING prototype, measured not asserted" is true only under undocumented manual setup, and the recorded numbers came from a brain that has since been mutated by other experiments. This is exactly the R1-04 disease ("nothing was run / asserted as settled") in a subtler form: something WAS run, once, by hand, and the committed artifact can't reproduce it.

**Concrete fix:** (1) Make `seed.sh` self-contained and fail-loud: run `gbrain init --pglite --no-embedding` against a *fresh ephemeral* `GBRAIN_HOME` it creates (`mktemp -d`), copy+activate the pack, and STOP swallowing errors — replace `>/dev/null 2>&1` with `|| { echo "FAILED: $*" >&2; exit 1; }`. (2) Have it run in an isolated brain dir every time so it can't read stale state. (3) Re-run the recipe clean and rewrite finding 03 with the numbers a fresh run actually produces, plus the exact setup commands. (4) Add a one-line assertion in `director.ts` that aborts if `backlinks(target)` is empty for the seeded target, so a silent-empty-brain run can never again be reported as a coherent pick.

---

### R3-02 — FATAL — The prototype is non-idempotent: each Director tick writes back into the brain it scores against, so scores drift on re-run and the "demonstration" is path-dependent

**Attacks:** §6 ("write back: event page + edges + advance arc"); finding 03's single-number result table; the implicit claim that the tick is a clean function of seeded state.

**Why it's wrong (executed):** On the clean correctly-seeded brain the first tick gives raid-iron **3.197**; the *second* tick on the same brain (no re-seed) gives **3.557**. The write-back step emits `events/430-raid-iron --involves--> factions/iron-empire` and re-`put`s the arc to `phase: climax` with `days_since_advance: 0`. So the very next sense step sees a NEW inbound edge on iron-empire (the event it just fired, recency r=1.00) and counts it as a fresh callback — the Director cites its own previous output as "graph history." It also pins the arc into `climax` with `next_beat_faction: factions/iron-empire` forever, so raid-iron keeps matching the arc every tick: a self-reinforcing fixation loop with no `days_since_advance` advance-gate actually firing (the demo never exercises the anti-stall logic §6.4 claims).

This is not a toy artifact; it's the **fixation failure mode the design names as a guard** (§6 "per-faction/arc cooldowns + a max-share cap prevent fixation"). The prototype demonstrates the disease, and the guard is unimplemented — `repetition`/`fixation` are hard-coded to `0` in `director.ts` ("tick 1: no history"). So the one term that would stop the colony getting raided by the Iron Empire every single tick is stubbed out, and the multi-tick playthrough §11 step 1 calls the validation gate has never been run because it would immediately expose this.

**Concrete fix:** (1) Separate the read-brain from the write-log in the prototype, or snapshot-and-restore the brain between ticks, so scoring is a pure function of seeded state. (2) Actually implement `repetition`/`fixation` against `recent_events(n)` and run ≥10 ticks; show the colony does NOT get iron-raided 10× in a row. Until a multi-tick run exists, §2's "producing a legible, plot-advancing Director pick" is a single-frame screenshot of a loop that hasn't been shown to loop without degenerating.

---

### R3-03 — HIGH — `char_stakes` counts raw inbound-colonist edges, so it rewards hub-pollution and scales with colony size, not drama — and the scorer has no normalization anywhere

**Attacks:** §6 resonance formula (`w3·character_stakes`); finding 04's grunt hub; the claim the scorer produces "coherent" picks.

**Why it's wrong (executed):** `charStakes = colonists.size` = the count of distinct `colonists/*` slugs with an edge into the target faction (director.ts:69,75). On the polluted brain this read **61**. Multiplied by w=0.2 that's +12.2 to resonance — larger than the entire arc bonus. So a faction that many colonists happen to be linked to (a big colony, or finding 04's grunts) wins on `char_stakes` regardless of dramatic relevance. Worse, `callback_strength` ALSO sums over those same grunt edges (each contributing `tension·recency`), so `rawCb` on the polluted brain was **13.437** — every grunt double-counts into two terms. There is no per-term normalization, no cap on edge count, no distinction between "Vera, who has a translated-inscription grudge" and "grunt-37, auto-linked." A graph store that makes edges free to write (the design's whole pitch) makes this term unbounded: the more the game records, the more every faction's score inflates. The resonance value has no fixed scale (3.197 here, 37.157 there) so the weights w1–w7 cannot be tuned against any stable target — and §6's "blind rater can't beat 60%" metric is uncomputable without a stable score distribution.

**Concrete fix:** Normalize. `char_stakes` should be `Σ over inbound colonists of tension(colonist)` capped, or the count of colonists above a tension threshold, not raw cardinality. Cap `callback_strength`'s edge sum (top-K by tension·recency) so a hub can't dominate. Define the resonance scale (e.g. normalize each term to [0,1] before weighting) so weights mean something across worlds. None of this is store work — it's the Director math the design keeps deferring as "the real game-design work" while presenting unnormalized sums as a working demo.

---

### R3-04 — HIGH — The scorer in director.ts does NOT match the formula in DESIGN §6 (different terms, different weights, undisclosed beyond a code comment)

**Attacks:** §6 (`resonance = w1·arc_advance + w2·callback_strength + w3·character_stakes + w4·valence_fit + w5·tension_fit − w6·repetition − w7·fixation`); finding 03 ("the DESIGN §5 callback_strength + resonance formula").

**Why it's wrong (code vs doc):** The doc's formula has **7 terms including `valence_fit` (w4)**. The prototype's `resonance` (director.ts:78) has **no `valence_fit` term at all** — `W = { cb, arc, char, tens, rep, fix }`, six weights, valence silently dropped. The doc also folds the arc multiplier *inside* `callback_strength` per-edge; the prototype applies it to the whole candidate (this one IS disclosed, director.ts:14-17). The weights in the doc are symbolic (w1…w7); the prototype hard-codes `cb:1.0, arc:0.5, char:0.2, tens:0.3, rep:0.4, fix:0.3` with no derivation, no tuning, no eval — and `arc_advance` is scored as a **separate additive term (w 0.5)** in the code (`+ W.arc*arcAdv`) AS WELL AS a multiplier on callback_strength, so arc-advance is double-counted relative to the doc's single formulation. A reader told "the prototype runs the §6 formula" (finding 03) is being shown a different, simpler, double-counting formula. The most consequential term the design itself flags as unsolved (`valence_fit` — does the beat's emotional tone fit the pacing target) is simply absent.

**Concrete fix:** Either update §6 to match what the prototype actually computes (6 terms, arc as multiplier-only, the listed weights) and mark `valence_fit` as not-yet-implemented, or update the prototype to the doc. State that arc-advance is applied ONCE (multiplier OR additive, not both). Stop describing the prototype as running "the §6 formula" until they're the same formula.

---

### R3-05 — HIGH — The emergence claim collapses under v4's own fact-skeleton model: this is authored content gated behind progression, not emergent narrative — and the doc never confronts it

**Attacks:** §0 line 11 / DECISIONS D2 ("**emergent** (history-driven) narrative"); §5.1 ("each artifact ships, hand-authored by designer/modder, or procgen at world-gen, a bundle of *latent lore facts* … with `revealed: false`"); §5.3 ("the spiral … now well-defined"); the friend's explicit charter requirement ("Narrative is **emergent**").

**Why it's wrong:** v4's headline fix (R2-05/06) was to make canon a **pre-authored fact skeleton** revealed in order by gameplay (found→fact1, studied→fact2). That is *exactly* the RPG lore-codex pattern: the writer authors the Ashmark's whole biography up front (`forged_by → grey-smith`, `target → iron-empire`, `bears → the-hunger`, `lost_in → siege`), and play merely flips `revealed: false → true`. **Nothing about the Ashmark's story is generated per-playthrough.** The forger, the target, the curse — identical in every save. The friend asked for emergent (history-driven) narrative; v4 delivers deterministic authored lore with a fog-of-war reveal mask. The design's defense is implicit — "emergence is in the selection/combination" (which facts the Director surfaces, in what order, against which colony) — but it never states this defense explicitly, never bounds how much novelty selection-order actually buys, and §5.3 oversells the spiral as "well-defined" emergence when it's a fixed DAG of facts uncovered in gameplay-determined order.

The honest position: there are **two** narrative layers and v4 conflates them. (a) The *colony's* history (who killed whom, which raid caused which famine) genuinely IS emergent — it's written by play, finding-02's edges prove the graph records it. (b) The *artifact's lore* is NOT emergent under §5 — it's authored and revealed. The friend's headline mechanic ("artifacts DROP LORE that drives the story") sits entirely in layer (b), the non-emergent one. So the fix that resolved the determinism FATAL (good) did so by making the headline content the *least* emergent thing in the game, and the doc presents this as compatible with "emergent narrative" without acknowledging the trade.

**Concrete fix:** State the trade explicitly in §5: "Artifact lore FACTS are authored/procgen and fixed per artifact; emergence lives in (i) the colony history graph, which IS per-playthrough, and (ii) the *order and context* of revelation and the Director's combination of artifact facts with colony facts." Then bound (ii) honestly: if the only per-playthrough variable is reveal order over a fixed fact DAG, that is weak emergence — quantify how many distinct artifacts/arcs a playthrough touches and whether reveal-order alone produces felt novelty, or commit to procgen fact-skeletons (R3-06) to get real layer-(b) emergence. Do not keep "emergent narrative" as an unqualified headline while the headline mechanic is authored-and-gated.

---

### R3-06 — HIGH — Procgen of fact skeletons "like Dwarf Fortress legends" is a four-word reference hiding the single largest unbuilt system; if hand-authored instead, the content budget to avoid one-playthrough exhaustion is never costed

**Attacks:** §5.1 ("or procgen at world-gen like Dwarf Fortress legends"); §0's claim the design reduces to "build SQLite + a 1-week REPL"; the friend's "emergent / infinite" implicit requirement.

**Why it's wrong:** The entire genuine-emergence escape hatch for artifact lore (R3-05) is the parenthetical "procgen at world-gen like Dwarf Fortress legends." DF's legends mode is one of the most complex procedural-history systems ever shipped — entity genealogies, wars, artifact provenance chains, site histories — years of work by a domain obsessive. Citing it in four words as an alternative to hand-authoring is the same move R1/R2 caught elsewhere: naming the antidote without computing it. The design provides **zero** spec for fact-skeleton procgen: no grammar, no constraint system ensuring `forged_by` and `target` and `bears` cohere into a non-contradictory myth, no theme control, no relationship to the colony's emergent graph. A typed-edge store (gbrain or SQLite) does NOTHING to generate these skeletons — it only stores them. So the design's "two things that ARE the design" (§0) quietly exclude the generator that the headline mechanic and the emergence requirement both depend on.

If the answer is "hand-author instead" (the realistic indie choice), the doc must cost it: each artifact needs ~4–8 latent facts + the prose templates + the rumor/region/guardian wiring + arc hooks; the spiral consumes one artifact's worth of reveals per arc; a single playthrough of a Rimworld-length game touches dozens of arcs. Authoring enough artifacts that the spiral doesn't visibly repeat within one 40-hour playthrough is a substantial writing project, and a *fixed* corpus by definition repeats across playthroughs — directly contradicting "emergent." The doc never states the content budget, never picks authored-vs-procgen, and bills the remaining work as "a 1-week REPL + a SQLite port."

**Concrete fix:** Add a "Lore-skeleton source" decision with real cost. Option A (author): state the per-artifact fact/template budget and the playthrough artifact count needed to avoid repetition; concede the result is finite/non-emergent and lean on colony-history emergence for novelty. Option B (procgen): spec at least a minimal constrained generator — a small grammar over (forger, motive, target, curse, fate) with a coherence constraint set — and acknowledge it as a real subsystem, NOT a parenthetical. Either way, remove "like Dwarf Fortress legends" as a stand-in for the design; it's the hardest unbuilt piece, not a citation.

---

### R3-07 — HIGH — Reveal-order non-determinism interacts badly with the Director's causal chains, and §7's save model doesn't actually fix it

**Attacks:** §5.1/§5.2 (facts revealed by gameplay: found→fact1, studied→fact2, used-in-crisis→fact3); §5.3 (spiral: reveal a fact → fact is an edge → Director sees the new edge → fires an event citing it → reveals the next fact); §7 ("facts + edges + resonance math are deterministic").

**Why it's risky:** "Found → fact1; studied → fact2; used-in-crisis → fact3" presupposes a fixed reveal sequence, but those triggers are **player-action-gated and not totally ordered**. A player can study an artifact before using it in a crisis, or never study it; two players (or one player across reloads who acts differently) reveal facts in different orders. The Director fires events that CITE revealed facts (§5.3) and writes `reveals` edges and arc advances as a function of what's revealed. So reveal order changes which edges exist at each tick, which changes scorer inputs, which changes which event fires, which changes what gets revealed next. The system is path-dependent on player action — which is FINE and even desirable for emergence — but it is NOT what §7 means when it asserts "deterministic." §7's determinism guarantee is about *save/load reproducibility given identical input*, and reveal-order path-dependence is orthogonal to that. The doc conflates two senses of determinism (replay-identical vs. action-independent) the way R2-06 conflated facts vs. prose.

The concrete hazard: if a fact whose edge participates in an open arc's `next_beat` can be revealed in either order relative to another arc-relevant fact, the Director can advance an arc to `climax` before the fact that motivates the climax has been revealed — a causal chain that fires its payoff before its setup, the "non-sequitur callback" R1-07 worried about, now reachable through reveal-order rather than scorer error. Nothing in §6's arc state machine gates `next_beat` matching on prerequisite-fact revelation.

**Concrete fix:** (1) Separate the two determinisms in §7: "save/load is replay-identical" (true, facts+edges+seed) vs. "story is intentionally path-dependent on player action" (a feature, not determinism). (2) Add a prerequisite gate to arc beats: a `next_beat` may only match if its prerequisite facts are `revealed: true`, so a climax can't fire before its setup regardless of reveal order. (3) State that reveal triggers are a partial order, and the Director must tolerate any topological order of it — then show one example where two reveal orders both produce a coherent (if different) chain.

---

### R3-08 — MEDIUM — §0 over-corrects past its own logic but then re-inflates the REPL: if gbrain's one differentiator doesn't work here and every other is discarded, the 1-week REPL is also not worth it

**Attacks:** §0 ("Use gbrain only as a week-one agent-drivable REPL to validate the fun, then stop"); §11 step 1 ("Validate fun cheaply (gbrain, ~1 week)"); R2-07's push to "make the call."

**Why it's still half-hedged:** v4 finally makes the substrate call (build SQLite, drop gbrain) — good, R2-07 is resolved in direction. But it keeps a one-week gbrain REPL phase whose justification has been hollowed out by the design's own findings. Walk it: finding 02 says the only hard-to-replicate feature (prose→graph) doesn't work here; §8 discards contradiction/trajectory/whoknows/salience/hybrid-rank; finding 04 says the CLI path is ~1.3s/op spawn-bound and the real path is in-process anyway; and the prototype this round (R3-01) shows the gbrain REPL's ergonomics are actually a *liability* — silent-empty-brain, stale-state pollution, non-idempotency, undocumented setup. The SQLite `edges` store is needed regardless and is "an afternoon" (§3/R1-08). So the honest cost comparison is: one week fighting gbrain's setup/state quirks to drive a throwaway brain by talking to an agent, VS. one-to-two days writing `edges(src,verb,dst,day)` + the §10 CTEs + an LLM agent pointed at THAT, which is the real artifact and has none of the pollution problems this round exposed.

The charter ("explore gbrain as basis") is still keeping a one-week gbrain phase alive that the doc's own evidence has reduced to "agent-drivable REPL" — and this round shows that REPL is flakier than the SQLite alternative it's meant to de-risk. The doc says "stop after a week" but never asks whether the week pays for itself versus building the store on day one and exploring against it.

**Concrete fix:** Re-cost §0/§11 honestly one more time: state the SQLite store is ~1–2 days, is needed regardless, and is more reliable to explore against (no silent-empty-brain class of bug). Recommend building it FIRST and using an LLM agent against it; keep gbrain only as an optional "if you want zero-setup interrogation in the next hour AND haven't written the schema yet" footnote — not a planned week-one phase. The prototype's value was proving the *model* (typed edges + scorer), which is now proven and portable; that does not require another week of gbrain.

---

### R3-09 — MEDIUM — The falsifiable success metric (blind-rater ~60%) is still never run, and after R3-03 it is not even computable as written

**Attacks:** §6 ("Falsifiable success metric … a blind rater shown 10 Director picks interleaved with 10 hand-authored beats cannot beat ~60% accuracy"); the v4 framing "measured, not asserted."

**Why it's a gap:** This metric has survived since R1-07 as the design's answer to "is it fun / does it feel authored," and across four versions + a prototype it has **never been run** — there is no finding for it, and the prototype produces a single tick's scores, not 10 narrated beats. Worse, R3-02/R3-03 show the scorer's output scale is unstable (3.197 / 3.557 / 37.157 depending on brain state) and the narration is a hard-coded two-branch string in director.ts:101-104 ("They have not forgotten the Ashmark" vs "Trouble rarely travels alone") — there is no actual beat-generation to show a rater. So the metric isn't just unrun; the machinery to produce the 10 picks-as-readable-beats doesn't exist yet, because beats are stubbed strings and lore generation (R3-06) is unbuilt. Calling it "falsifiable" is accurate; calling the design "measured" while the one falsifiable claim is unmeasured and currently uncomputable is not.

**Concrete fix:** Demote the "measured, not asserted" status line to "the memory+selection mechanics are demonstrated on a toy graph; the fun metric (blind-rater) is the gating experiment and has NOT been run." Then specify what must exist to run it: a real beat renderer (facts→prose, R3-06), ≥10 ticks of a multi-tick playthrough with fixation guards live (R3-02), and 10 hand-authored comparators. Until then, "feels authored" remains faith.

---

### R3-10 — MEDIUM — §5.2 claims the contradiction problem "largely vanishes," but only for intra-artifact prose; cross-artifact and fact-vs-colony-history contradictions are reintroduced by procgen and never addressed

**Attacks:** §5.2 ("Contradiction problem (old R1-02): largely *vanishes*. If canon is a consistent fact skeleton, the LLM can't invent a contradictory forger — it only renders given facts"); §10 ("`contradictions` is intentionally absent — structured canon makes it unnecessary").

**Why it's overstated:** The fact-skeleton model removes contradictions *within a single artifact's rendered prose* — true, because prose only renders locked facts. But two other contradiction classes remain and are made WORSE by procgen (R3-06):
- **Cross-artifact:** if two artifacts are procgen'd independently, both can claim `forged_by → grey-smith` as a unique once-in-history smith, or both `target → iron-empire`'s last king, or two relics each claim to be "the one that ended the dynasty." Independent skeleton generation has no global consistency constraint. Hand-authoring avoids it only by the author manually de-conflicting — i.e. the contradiction work didn't vanish, it moved to authoring time.
- **Fact-vs-emergent-history:** the artifact's authored fact `lost_in → siege-of-X` can contradict the colony's *emergent* graph (the siege never happened in this playthrough, or happened differently). Authored artifact lore and per-playthrough colony history are generated by different processes and can disagree. The design's whole pitch is that artifact lore drives the emergent story — so the two graphs MUST be reconciled, and §5.2 just asserts the problem is gone.

**Concrete fix:** Scope the §5.2 claim precisely: "intra-artifact prose contradictions vanish (prose renders locked facts)." Then add the two surviving classes and a mechanism: a world-gen-time global constraint solver for procgen skeletons (uniqueness of forgers/targets, no two relics claim the same deed), and a rule that artifact lore either references only world-gen-fixed history (not per-playthrough colony events) or is generated AFTER the relevant colony history so it can reference it consistently. Don't claim contradictions are unnecessary; claim which class is eliminated and how the rest are bounded.

---

### R3-11 — LOW — Internal inconsistencies and stale claims introduced by heavy 4-version editing

**Attacks:** several cross-section claims.

- **§0 vs §7/§2 reproducibility:** §0 calls finding 03 a "demonstrated coherent Director pick" and §2 cites exact scores (3.197, 0.210) as settled; R3-01 shows those are non-reproducible from the committed recipe. The confident citation outruns the artifact.
- **§6 char_stakes naming:** the doc says `character_stakes` (w3) but never defines it; the prototype defines it as raw colonist-edge count (R3-03). Undefined-in-doc, footgun-in-code.
- **§5.1 "tiny, consistent by construction":** facts are tiny, but "consistent by construction" is false across artifacts (R3-10) — construction is per-artifact, not global.
- **§9 risk table:** Risk 6 (hunt fun) marked "Resolved in design; needs playtest" and Risk 4 (lore gen) "Resolved" — but lore *generation* (procgen/authoring of skeletons) is NOT resolved (R3-06), only lore *rendering* (facts→prose) is. The risk table conflates the two halves R2-05 split.
- **§7 "facts + edges + resonance math are deterministic":** resonance math is deterministic *given fixed inputs*, but the prototype shows inputs drift on re-run (R3-02); the claim is true in theory, false for the artifact as written.
- **director.ts:28** `gb()` returns `(r.stdout||"") + (r.status===0?"":"")` — the nonzero-status branch appends empty string, i.e. on ANY CLI error the function returns whatever partial stdout exists (often empty) with no signal. This is the silent-failure mechanism behind R3-01; flag it as a bug, not a style nit.

**Concrete fix:** A consistency pass: scope the "Resolved" labels to rendering-not-generation; make finding-03 citations conditional on the fixed reproduction; define `character_stakes` in §6; fix `gb()` to throw on nonzero status.

---

## Verdict

**Have 3 rounds converged on something real? Partially — the MODEL is real, the EVIDENCE is not as solid as v4 claims, and the headline (emergent lore) is the least-resolved part.**

What genuinely converged and is sound: the Director/World-Memory split (D1); keeping the LLM out of the tick loop; typed edges written explicitly (finding 02 is solid and I re-verified the graph answers reverse queries correctly); lore-as-facts with prose as a deterministic render (the right fix for the R2-06 determinism FATAL); the substrate call (build SQLite, drop gbrain). Those are real gains from three rounds.

What is STILL wrong or newly broken in v4:

- **FATAL R3-01:** the "WORKING prototype, measured not asserted" centerpiece does not reproduce from its own recipe; `seed.sh` silently no-ops on a clean brain (swallows errors, fakes success, never inits), and the brain finding 03 was recorded against now yields 37.157 instead of 3.197 due to cross-experiment pollution. The empirical foundation v4 leans on is not reproducible as committed.
- **FATAL R3-02:** the prototype is non-idempotent — it scores against a brain it writes back into, so scores climb on every tick (3.197 → 3.557) by citing its own output, and the fixation guard that would stop the colony being iron-raided forever is stubbed to 0 and never exercised.
- **HIGH R3-05/R3-06:** the emergence requirement — the friend's explicit charter — is not met for the headline mechanic. v4's fact-skeleton fix makes artifact lore authored-and-gated (RPG codex), not emergent; the only escape (procgen "like DF legends") is a four-word reference to the single largest unbuilt system, uncosted either way.
- **HIGH R3-03/R3-04:** the scorer has no normalization (unbounded, hub-pollutable, unstable scale) and does not match the §6 formula (valence_fit dropped, arc double-counted).

**Is v4 sound and actionable for the friend's game?** As an *analysis of memory substrate*, yes and it's now honest (build the SQLite edges store, skip gbrain). As a *design for the friend's actual game* — an emergent storyteller whose headline is artifacts that drop lore — **no, not yet**: the two things the friend most cares about (emergent narrative, lore generation) are precisely the two things v4 either redefines away (emergence → reveal-order over authored facts) or waves at (procgen → "like DF legends"). Three rounds polished the well-understood half (memory graph + selection) to a genuinely good state and left the hard half (generate coherent, emergent, non-repeating lore) exactly where round 2 found it.

**Single most important remaining change:** Make the prototype reproducible and idempotent (fix `seed.sh` to init+activate+fail-loud; isolate read-brain from write-back; implement the fixation guard) AND run the multi-tick blind-rater experiment — because until that runs, every "measured/demonstrated/working" claim is one hand-run snapshot against a now-corrupted brain, and the design's own falsifiable metric has never been computed.

**Steelman: this whole direction is wrong; here's what the friend should build instead.** The friend wants an *emergent storyteller + lore generator*. Memory is the easy, solved part (an `edges` table + CTEs — a day's work, gbrain or not). The hard parts are (a) the Director's tension model and scorer — pure game-design, store-agnostic, and STILL unbuilt/unnormalized here — and (b) the lore *generator* — also unbuilt. So the substrate question this entire project orbits is the least important one. The friend should: (1) write the `edges` store in an afternoon and stop thinking about it; (2) spend the real effort on a constrained lore generator (a grammar/LLM that fills locked structured slots — forger, motive, curse, fate — with a world-gen-time global consistency solver so artifacts don't contradict each other, R3-10) which is what makes lore both emergent AND coherent; and (3) build and TUNE the normalized Director scorer over a multi-tick playthrough against the blind-rater metric, since that — not the database — determines whether the game is fun. The project spent three rounds proving a database can hold a graph (it can; nobody doubted it) while the two systems that actually make this a *storyteller* (generator + tuned director) remain stubs. Bending a personal-knowledge brain into a game engine was the wrong frame from the start; the right frame is "a tiny edges DB nobody needs to think about + two real game systems," and the design only half-admits this.

