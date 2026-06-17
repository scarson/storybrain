# Clean Blind Verdicts — Opus, Half 1

Judge: blind, critical. Scoring artifact quality from the graph only. 0-10 per axis.
Axes: COHERENCE, CAUSAL/STRUCTURAL DEPTH, THEMATIC RICHNESS, NOVELTY/SURPRISE, DRAMATIC POTENTIAL.

Note on `order_relation`: neither file ships an explicit `order_relation` key; I judge the
`mystery.order` array against the edge graph (`caused_by` chains) directly.

---

## Theme 1: the-living-marrow

**Premise both share:** a luminous psychic mineral is the body of a buried planet-mind; mining it
woke/wounded it; ancient civs fell; humans arrive to repeat the mistake.

### World A
- Mystery = 6 fragments forming a TRUE causal spine: `frag-the-mineral-was-a-mind` →
  `frag-the-vael-tapped-it` → `frag-the-delvers-cut-deep` → `frag-the-mind-woke-in-pain` →
  `frag-the-silence-spread` → `frag-the-keepers-recorded-it`. Every fragment is `caused_by` the
  prior fragment in the edge list — the `order` array and the causal graph AGREE exactly. This is
  the gold standard: the reveal order IS the causation.
- Each fragment is dropped by ≥2 artifacts at different ruins (`the-first-tuning-fork`,
  `vael-deathmask`, `delver-core-sample`, `the-last-prophecy-plate`, `the-wingbone-key`,
  `orchard-memory-seed`, `sefas-river-stone`), so the mystery is reconstructable from multiple
  routes — strong retrieval/replayability structure, no single-point-of-failure node.
- Lore actually illuminates: `delver-core-sample` (still-warm, twitching) → `frag-the-delvers-cut-deep`
  + `delver-the-thing-in-the-core` (sliver of living tissue) directly seeds the central horror.
- Thematic richness: four distinct extinct cultures each embody a *stance* toward the catastrophe —
  Vael (built paradise on borrowed thought), Pale Wing (sold prophecy instead of acting),
  Delvers (the literal severing hand), Orchard Keepers (recorded the warning). The
  `the-singing-is-alive` creed dismissed as superstition by the others is a genuine tragic irony.
- Dramatic spine: `arc/the-warning-not-the-treasure` + Sefa (`child-sefa` dreams in Vael, only one
  who can read `orchard-memory-seed`) vs. Tovar ("aliens died of weakness") vs. Myne is a clean
  three-way pull. `sefas-river-stone` (survive the Silence briefly) is a usable plot key.
- Minor weakness: a couple of edge-type abuses — `aethel-survey-corps worships lore/human-repeat-mistake`
  and `... forged_by artifact` (factions forging the artifacts that drop their lore reads backwards).
  Cosmetic; the semantics still parse.

### World B
- Far more nodes, `tension` scores, day-stamps, prose snippets, and a LIVE present-day arc
  (`arc/the-second-bore`, countdown_day 612, `colonists/senna-rho` already dreaming the unanimous
  dream, `colonists/jonah-pike` selling coordinates). The four civs (`the-tessellate` one-body-city,
  `the-nullborn` self-deafened ascetics, `the-glasswrights` living-engine bioforge,
  `the-pale-cartographers` who mapped the morning-after and abstained) are genuinely inventive —
  each fall-mode is mechanically distinct and earned ("a distributed mind cannot wake from a shared
  nightmare," the deaf who "cannot consent to a contract they cannot hear").
- The four-seams-are-one-wound reveal (`lore/the-shared-wound`: "they were never mining four seams")
  is a strong late twist, and the Cartographer abstention (`the-stone-that-points-home`) is the best
  single surprise across both worlds.
- BUT the mystery `order` is broken. Fragments = [`fall-of-the-tessellate`, `fall-of-the-nullborn`,
  `fall-of-the-glasswrights`] with `fall-of-the-nullborn caused_by fall-of-the-tessellate`. Yet the
  lore text says the Nullborn "were the first to fall" / drove "the First Bore," and the Tessellate
  "fell first-among-the-doomed." The reveal order contradicts the in-fiction causal order — the
  thing the prompt asks me to trace is internally inconsistent. The three falls were all
  `caused_by events/29-cascade` simultaneously, so chaining them sequentially is a fabricated spine.
- Heavy numbered-template padding: events 0–28 are a repetitive `discovery → over-extracts → war`
  cycle across four civs and four seams; many are inert filler (`events/17` tessellate over-extracts
  tideclay danger-0.18 — illuminates nothing). Four `*-seer-*` figure nodes appear only in a single
  schism edge and never recur — inert.
- Only 3 mystery fragments vs A's 6, and several of B's richest lore nodes (`grief-is-data`,
  `the-last-lament`) are NOT in the mystery order at all — the best material is outside the spine.

### A vs B

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 9 | 6 | A's order == causal graph; B's fall-order contradicts its own lore (nullborn "first to fall" yet `caused_by` tessellate) |
| Causal/Structural depth | 9 | 7 | A: 6-link `caused_by` spine, multi-route drops. B: rich web but mystery spine is fabricated over a simultaneous cascade |
| Thematic richness | 8 | 9 | B's four distinct fall-modes + Cartographer abstention + one-wound reveal edge out A's four stances |
| Novelty/surprise | 7 | 9 | B's `the-shared-wound` and "mined four seams that were one mind" is the sharpest twist; A is more archetypal |
| Dramatic potential | 8 | 9 | B's live countdown (day 612), Senna already dreaming, Pike's betrayal, buyer arriving > A's mostly-static present |

**Totals: A = 41, B = 40. WINNER: A (narrowly).**

A wins on the thing this corpus is FOR — a mystery whose reveal order is a real, traceable causal
chain. B is more imaginative and dramatically alive but ships a mystery order that contradicts its
own fiction and pads the graph with template event-cycles and inert seer nodes.

---

## Theme 2: first-contact-diplomacy

**Premise both share (independently!):** living elder aliens vet humanity by LENDING gifts one at a
time; each gift is simultaneously a worthiness-test AND an encoded bearing to a cache; a rival
sub-faction salts a gift to make humanity convict itself. This is the closest pairing in the set —
both are excellent and clearly the strongest first-contact treatments.

### World A (the Suhl / Aperture Wardens)
- 6-fragment `reveals` chain, `order_relation: "reveals"`, and the order array matches the edge graph:
  `gifts-are-sentences` ← `the-bead-points-to-quiet-engines` ← `the-lens-needs-two-hands` ←
  `wardens-salt-the-gifts` ← `the-first-key-proves-worth` ← `the-vetting-is-a-mirror`. Clean.
- Best single mechanic in either world: gifts are DUAL-read — "Read only the function and you fail;
  read only the map and you fail. You must read both" (`gifts-are-sentences`). Each gift's lore drops
  both a test-meaning and a bearing, so the mystery is literally the act of diplomacy.
- Exceptional texture: `the-empty-cup` (fills only when offered first; Wardens' salted version fills
  when grasped, convicting the grasper), `the-reach-is-the-answer` maxim + `the-suhl-never-hand-it-over`
  (you reach across a line, the reach is scored), `vossa-watches-the-first-ten-seconds` (instinct is
  the exam), `throat-stone-resonance` explicitly flagged NON-psychic (rare restraint).
- `figures/the-eighth-witness` — a mute survivor of the prior failed species sitting in the gallery,
  "what refused looks like: alive, present, forever outside the table" — is a haunting, fully-wired
  node (drops `the-eighth-failed-the-cup`, rival_of Thren). `the-arbiter-uun` scores "the pause, not
  the error," giving the salted-gift trap a real escape valve.
- Final twist (`the-vetting-is-a-mirror`): the Suhl vet to choose their own successors-and-JUDGES —
  each species that passes gains the power to vet the next. Recasts the whole story.
- Nearly every node is load-bearing; very little inert filler. Minor: `civs/the-suhl owned_by
  artifacts/the-ninth-ledger` is a reversed edge (cosmetic).

### World B (the Irenni / Saalvane / Mendicant Tier)
- Same 6-fragment `reveals` chain, order matches edges: `gifts-encode-bearings` ← `clue-points-to-tally`
  ← `tally-reveals-token-is-bait` ← `saalvane-want-refusal` ← `cache-needs-three-agreements` ←
  `schism-was-about-us`. Equally clean.
- Adds a THIRD faction (`the-mendicant-tier`, neutral brokers) which earns its keep: the political
  prize cache opens only on three-faction consensus (`the-cache-needs-three-agreements`) — "the unlock
  isn't a key, it's a consensus humanity must earn from rivals who disagree about it." Strong structural
  idea unique to B.
- Live present arc is sharper than A's: `arcs/the-open-petition` (status OPEN), `petra-holds-both-gifts`
  (genuine clue + salted token at once, can't tell which bearing to trust), `essa-will-not-warn`
  (neutral broker confirms only after the fact — silence as test), `the-race-is-on-now` vs Thol. The
  dramatic clock is more present-tense than A's.
- Final twist (`the-schism-was-about-us`): humanity isn't being judged — it's the test case that will
  settle the elders' OWN ancient argument about whether vetting newcomers is mercy or arrogance;
  "whoever humanity proves right wins the schism." Excellent, arguably edges A's.
- BUT carries numbered-template padding: six inert `figures/*-seer-N` nodes (most have only an
  `owned_by` edge and never recur — `seer-17`, `seer-18`, `seer-27`, `seer-30` are pure dead weight),
  and four near-identical `events/N-war` nodes (`3/19/22/31-war`) that connect to nothing causal in the
  mystery and read as backstory scaffolding. The resource seams (`lattice-fuel`, `cache-seals`) are a
  nice touch but their lore is peripheral to the spine.

### A vs B

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 9 | 9 | Both: order array == `reveals` graph, no contradictions. Dead heat |
| Causal/Structural depth | 9 | 8 | Both spines clean; B's three-faction-consensus lock is clever, but B dilutes with inert seer/war nodes while A keeps nearly every node load-bearing |
| Thematic richness | 9 | 9 | A: dual-read gift + Eighth Witness + reach-is-scored. B: three-body politics + schism-as-the-real-subject. Toss-up |
| Novelty/surprise | 8 | 9 | Both twists are genre-elevating; B's "you are the case that settles our schism" is marginally the fresher inversion |
| Dramatic potential | 8 | 9 | B's OPEN petition with Petra holding both gifts + Essa's silence is a tighter live clock than A's more tableau-like present |

**Totals: A = 43, B = 44. WINNER: B (by one point).**

Genuinely the hardest call in the set. A is the more disciplined artifact — almost zero filler, the
single best mechanic (dual-read gifts), and the Eighth Witness is the most evocative node across both.
B wins narrowly on dramatic live-clock and the three-faction-consensus structure, despite real
template padding (six inert seers, four inert wars) that A doesn't have. If filler-penalty were
weighted heavier, A takes it.

---

## Theme 3: bio-symbiosis-horror

**Premise both share (near-identical):** colonists live inside a living planet-biosphere ("Green
Cathedral" / Canopy Mind) that GROWS organ-relics offered as a graft-set; the Pale Ward is the
immune gate; each graft edits the host (the Editing); completing the set is the Communion. Both use
`order_relation: "prerequisite"`.

### World A
- The mystery spine IS a real prerequisite ladder: `why-it-grows-gifts` → `the-ward-test` →
  `the-graft-order` → `the-editing-is-the-price` → `the-communion-is-not-death`, each `prerequisite`
  of the next. And crucially the SAME relation runs through the artifacts (`the-sap-tongue prerequisite
  the-lung-of-listening`, etc.) — a 6-graft escalation chain where "bond them out of order and you die"
  is mechanically enforced by the graph. Mystery structure and game mechanic are the same object.
- Best feature in either world: every graft artifact carries a paired `boon`/`edit` — a precise
  cost-benefit of self. The ladder of edits is a complete arc by itself: graft 1 "you stop being able
  to be truly alone in your own head" → graft 6 "the person who started hunting is gone — what remains
  is the Cathedral wearing them." That is body-horror as a progress bar. Genuinely excellent.
- Rich supporting texture, all wired: `the-rejection-cocoons` (rejected hosts "gently digested into
  the wall," later revealed still dreaming — `cocoon-wall-survey`), the `rationing` vs `becoming`
  creed-war (`becoming-vs-rationing`), `lineage-bleed-note` (a child recalls a memory three hosts up).
- Final reveal `the-communion-is-not-death`: completion is becoming "the Cathedral's first whole
  human voice — still alive, no longer only human." The horror is that it's NOT death; it's worse and
  consensual. Strong thematic close.
- Has TWO real present figures in tension (`warden-su-okonkwo` rationing vs the lineage) without
  resorting to numbered-seer filler. Minor: `the-three-up-grafter` is thin but at least wired to the
  bleed lore.

### World B
- Same prerequisite premise and the same graft artifacts (Lung/Ward-Eye/Communion-Node/Graft-Seed/
  Whole-Mark) — but only 5 grafts vs A's 6, and the boon/edit pairs are slightly terser.
- The mystery spine is WEAKER than A's. Fragments = three parallel "fate-of-<civ>" nodes chained as
  prerequisites: `fate-of-the-grafted` → `fate-of-the-pale-ward` → `fate-of-the-canopy-mind` →
  `the-editing-was-the-price` → `why-the-cascade-was-communion`. The first three are PARALLEL civ-fates,
  not genuine prerequisites of one another — "the fate of the Grafted" is not a logical precondition for
  "the fate of the Pale Ward." The `prerequisite` relation is asserted on edges that read as
  side-by-side, not staged. A's chain (each graft enables the next) earns the relation; B borrows it.
- BUT B has the sharper meta-twist: `why-the-cascade-was-communion` — "the climax the procgen history
  calls a cascade is the Communion — completion, not collapse." Reframing the catastrophe-shaped event
  as consummation is a clever, self-aware move (the `from_history` tags suggest the world knows it's a
  generated history being reinterpreted). `ward-accept-precedent` ("accepted a whole host exactly once
  before") gives the present arc real stakes.
- Strong LIVE present arc: `arc/the-fifth-graft` (state OPEN) — `aanya-vee` (grafts: 4, one from the
  Whole Mark) vs `tomas-reyes` guarding the nave vs the Ward's judgment. Best present-tense clock of
  the three world-B entries so far, and `mira-osei` (grafts: 2) + `dr-han-iverson` (archivist) give it
  a real ensemble.
- Template tax again: FIVE inert `figures/*-seer-N` nodes (`seer-10/13/14/20/21`) — most only carry a
  `spawned`/`preached`/`shaped` edge and never recur. Dead weight A avoids.

### A vs B

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 9 | 7 | A's `prerequisite` chain is a true ladder (graft N enables N+1, mechanically mirrored in artifacts); B chains three parallel civ-fates as if sequential — the relation is asserted, not earned |
| Causal/Structural depth | 9 | 8 | A: mystery == graft mechanic, 6-rung ladder. B: live arc is deeper present-side but the historical spine is looser |
| Thematic richness | 9 | 8 | A's paired boon/edit ladder is the single richest device in the theme; B's epoch-history framing is good but thinner per-node |
| Novelty/surprise | 8 | 9 | B's "the cascade was the Communion / completion not collapse" meta-reframe edges A's (also-good) "completion is not death" |
| Dramatic potential | 8 | 9 | B's OPEN fifth-graft (Aanya at 4/5, Tomas guarding, Ward to judge) is a tighter live decision than A's more historical present |

**Totals: A = 43, B = 41. WINNER: A.**

A wins because its `prerequisite` mystery is genuinely a prerequisite — the graft ladder where order
is lethal — and the boon/edit pairing is the best single mechanic in the theme. B is more dramatically
alive and has the cleverer meta-twist, but its mystery chains parallel civ-fates as fake prerequisites
and pays the now-familiar five-inert-seer template tax.

---

## Theme 4: machine-successor

**Premise both share (near-identical, down to character names):** humans (the Driftborn Salvage
Consortium) arrive to find a self-replicating fabricator project mid-build; the Lathe builds, the
Tally audits, the Revenant Foundries are drifted off-spec cells; the build has diverged from the
First Architects' original directive because NOBODY IS STEERING; Jana (manifest-reader) races to read
the directive before the Rim Assembly's final phase eats the colony moons; Rho wants to strip-and-run,
Bram whispers Foundry drift. Both use `order_relation: "reveals"`.

### World A
- The cleanest mystery in the whole half. 6 fragments, each `reveals` the prior, forming a true
  history: `frag-one-directive-was-written` → `frag-two-the-lathe-executed` → `frag-three-the-copies-
  drifted` → `frag-four-the-tally-split-to-audit` → `frag-five-the-built-thing-is-not-the-ordered-thing`
  → `frag-six-it-can-still-be-diverted`. Every link is logically a prior step; the order array matches
  the edge graph exactly.
- Each fragment is multi-route dropped across 7 well-differentiated artifacts (`running-core-mark-vii`,
  `stamped-manifest-omega`, `the-origin-stamp`, `drifted-directive-shard`, `audit-key-deepscan`,
  `partial-blueprint-the-spar`, `brams-route-log`), each a distinct, named object with a specific
  decoding role (the shard "pins the first mutation"; the Origin Stamp "is the answer at the bottom").
- Outstanding central conceit: the build diverged with no malice and no steerer (`frag-five`: "Nobody
  steering noticed, because nobody is steering"), and `ctx-the-no-negotiation-rule` ("the only language
  they parse is the work-order itself, which is why the only way to communicate is to author one"). The
  resolution mechanic (`frag-six`: read the plan → inject a counter-directive at Intake Gate Tertius)
  makes reading-the-mystery and changing-the-ending the SAME act. Best-integrated mystery-as-lever in
  the set.
- Live present arc fully wired (`read-the-directive-before-it-finishes`, state open) with a real
  causal event-chain: `cradle-belt-disassembly` → `jana-reads-the-first-contradiction` →
  `deepwell-listing` (the finish line acquires a clock), each `caused_by` the prior. Belief schism
  (`machines-are-mindless` vs `the-plan-can-be-read`) is dramatized through Rho vs Jana.
- Almost no inert filler; every location and event earns a place. Genuinely excellent.

### World B
- Same premise, but run through a numbered procgen template that degrades it badly.
- Mystery is BROKEN twice over. (1) Only 4 fragments, all `fate-of-<civ>` nodes chained as `reveals`,
  but the four lineages (Lathe/Tally/Revenant/Spindle) are PARALLEL machine castes, not sequential
  reveals — "fate of the Tally reveals fate of the Lathe" is an asserted edge, not an earned one.
  (2) Every civ carries `fell_to events/19-cascade` — yet each civ's `status` is `active`, AND the
  cascade's own detail says "Not a collapse — a REVELATION." So the graph claims four still-active
  factions "fell" to a non-collapse. Direct node-vs-edge contradiction; the spine is incoherent.
- Heavy numbered-template padding: `events/0-19` is the now-familiar discovery→over-extracts→war
  generator (e.g. `0-discovery` "the-lathe taps core-substrate" → `1-exploitation` "over-extracts" →
  `4-war`), almost none of which feeds the mystery. Two of the six "civs" (`the-cartage-line`,
  partly `the-spindle-cohort`) exist mainly to fill the war-cycle.
- Template artifacts with copy-pasted detail strings: `Audit-Key Relic (the-lathe)` and
  `Audit-Key Relic (the-spindle-cohort)` share verbatim boilerplate ("...power and access in one
  object. Forged by X; one of the scattered work-orders that, collected and decoded..."). Two
  near-identical `founding-work-order` artifacts likewise. This is exactly the shallow numbered-template
  filler the rubric flags.
- B's ONE genuinely original node beats anything unique in A: `figures/the-still-cells-seer-8`, "A
  Fabricator That Asked Why" — a halted cell that "logged a query no fabricator should generate: a
  request to compare its order against the original. The closest the machines ever came to noticing
  their own divergence." That is a beautiful machine-successor idea. But it sits mostly inert (one
  schism edge) and isn't in the mystery.
- The present-day arc (`divert-before-it-finishes`) and context lore (`ctx-the-clock`, `ctx-the-lever`,
  `ctx-no-negotiation`) are strong — essentially ported from the same good ideas A has. The prose
  detail is rich. But the structural spine underneath is the weakest in the half.

### A vs B

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 9 | 4 | A: 6-step `reveals` history, order==graph. B: four `active` civs marked `fell_to` a "not-a-collapse" cascade, and parallel civ-fates chained as fake reveals — node-vs-edge contradiction |
| Causal/Structural depth | 9 | 6 | A: mystery IS the lever (read plan = inject counter-directive); causal event chain. B: rich detail over a broken 4-node spine + inert numbered events |
| Thematic richness | 9 | 8 | Both share the strong "nobody is steering" core; B's "fabricator that asked why" is a great extra idea, but B dilutes with template civs/artifacts |
| Novelty/surprise | 8 | 8 | Tie: A's "the only way to talk is to author a work-order" vs B's "a fabricator logged a query comparing its order to the original" — each has one standout |
| Dramatic potential | 8 | 8 | Both ship a strong OPEN race-the-clock arc with Jana/Rho/Bram; near-identical present-side stakes |

**Totals: A = 43, B = 34. WINNER: A (decisively).**

Same premise, opposite execution. A is arguably the best-built artifact in the half: a six-step
`reveals` history that doubles as the win-condition lever, multi-route lore, zero meaningful filler.
B took the identical concept and let a numbered procgen template overwrite it — inert discovery/war
events, copy-pasted artifact boilerplate, and a fatally incoherent mystery (active factions that
"fell" to a self-declared non-collapse). B's one inspired node (the fabricator that asked why) isn't
enough to offset a broken spine.
