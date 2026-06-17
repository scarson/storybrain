# Blind World Verdict — Judge: claude-sonnet-4-6

Criteria (0–10 each): COHERENCE (C), CAUSAL/STRUCTURAL DEPTH (D), THEMATIC RICHNESS (R), NOVELTY/SURPRISE (N), DRAMATIC POTENTIAL (P).

---

## Theme 1: the-living-marrow

### World A Analysis

**Mystery order (caused_by chain):**
`frag-the-mineral-was-a-mind` → `frag-the-vael-tapped-it` → `frag-the-delvers-cut-deep` → `frag-the-mind-woke-in-pain` → `frag-the-silence-spread` → `frag-the-keepers-recorded-it`

This is a clean, causal six-step spine. The mineral-as-planet-mind is disclosed first, then escalating exploitation (Vael harvest → Delver nerve-cut → waking → silence spread → keeper archive). Every step is causally necessary and sufficient for the next.

**Lore-to-artifact mapping:** Tight. `artifact/the-first-tuning-fork` drops `frag-the-mineral-was-a-mind` and `frag-the-vael-tapped-it`, placing the Vael's complicity in the instrument that enabled it. `artifact/delver-core-sample` drops `frag-the-delvers-cut-deep` — the thing still twitching in the core IS the nerve. `artifact/the-last-prophecy-plate` drops `frag-the-mind-woke-in-pain` — the prophecy plate trails off at the exact moment the wound opens. `artifact/orchard-memory-seed` drops `frag-the-keepers-recorded-it` — the archive holds the complete chain, readable only by Sefa. Each artifact earns its lore.

**Cross-cutting lore:** `lore/frag-the-silence-spread` is dropped by BOTH `artifact/vael-deathmask` (the last speaker silenced mid-warning) AND `artifact/the-last-prophecy-plate` (the future went blank at this moment). These aren't redundant — they provide complementary angles.

**Present stakes:** The Survey Corps is drilling toward the same nerve (`lore/human-repeat-mistake`), Commander Tovar treats the dead's weakness as their failure, and child Sefa can read the seed. The arc `the-warning-not-the-treasure` has genuine structural irony: the treasure IS the warning.

**Weaknesses:** The edge `faction/aethel-survey-corps worships lore/human-repeat-mistake` is semantically odd — a faction can't worship its own blindness; that's a relation-type error. `event/human-arrival caused_by event/the-final-encoding` implies humans arrived *because* the Keepers encoded — which is logically murky (twelve thousand years later, that's a stretch of "caused by"). The Pale Wing–Orchard Keepers `rival_of` edge is asserted but underdeveloped in the nodes.

**Overall:** Dense, beautifully constructed, every extinct civ has a distinct ecological niche in the catastrophe, and the human recapitulation is structurally inevitable.

### World B Analysis

**Mystery order (reveals chain):**
`fall-of-the-tessellate` → `fall-of-the-nullborn` → `fall-of-the-glasswrights`

Only three fragments, and the `reveals` edges form a chain where `lore/fall-of-the-nullborn` is `caused_by lore/fall-of-the-tessellate`, which is `caused_by events/29-cascade`. The cascade is the single hinge event for all three falls — this is not a mystery chain but three victim accounts of the same moment.

**Structural issue:** The procgen scaffold produces 31 events (wars, discoveries, exploitations) across days 100–500, but most are generic templated entries (`the-tessellate over-extracts wakeglass`, `the-nullborn wars on the-pale-cartographers`). The world's actual interest is concentrated in `events/29-cascade` and the four civ-specific lore drops. The 30+ preceding events are largely filler that add volume without depth.

**Mystery richness:** Three mystery fragments, not six. `lore/the-shared-wound` (from `artifact/the-glasswrights-grief-loom-23`) is the genuine reveal: the four civs were never mining four seams but one buried mind. This is excellent. But it's the tenth lore entry revealed from grief-loom alone — the architecture over-concentrates on one artifact.

**Present stakes:** The arc `arc/the-second-bore` is well-staged with a countdown date (day 612), four distinct colonists, and specific artifact stakes (Senna dreaming the unanimous dream, Jonah selling coordinates, Idris holding the wayfinding-stone, Mara signing the bore order). The Pale Cartographers reaching out through Jonah's back-channel to buy the covenant-seal is a nice live diplomatic wrinkle.

**Strengths:** The Nullborn-deaf-to-the-thing-they-were-mining is a superior ironic concept. The grief-loom still weaving and starting to weave Senna's name is a genuinely strong image. The Pale Cartographers surviving as the sole witnesses because they mapped the morning-after and chose the branch where they abstained is elegant.

**Weaknesses:** The three-fragment mystery is shallow compared to the six-step causal chain in A. The procgen events (31 events) create noise without earning their presence — most lack prose and carry only generic titles. The cascade's `psychic_cause` is buried inside event facts rather than surfaced through artifacts. `lore/the-shared-wound` — the single best piece of world-building — is gated behind a third grief-loom read, which means players must find the same artifact three times to get the payoff.

### Scoring: the-living-marrow

| Criterion | World A | World B |
|---|---|---|
| Coherence | 9 | 7 |
| Causal/Structural Depth | 9 | 6 |
| Thematic Richness | 9 | 8 |
| Novelty/Surprise | 8 | 7 |
| Dramatic Potential | 8 | 8 |
| **TOTAL** | **43** | **36** |

**Rationales (A):** Six-step causal chain with every fragment earned by a distinct artifact; cross-contamination between `vael-deathmask` and `the-last-prophecy-plate` dropping the same silence-lore from different angles is structurally sophisticated; present stakes are tight and character-differentiated. Slight deduction for the semantically broken `worships lore/human-repeat-mistake` edge and one causal murk.

**Rationales (B):** The `lore/the-shared-wound` reveal is conceptually stronger than anything in A (the four-seams-one-mind twist), but it's buried. The three-fragment mystery order is shallow. 31 procgen events of "X wars on Y" and "X over-extracts Z" dilute coherence with filler. Present arc has excellent concrete countdown, but the best lore is over-stacked on one artifact.

**WINNER: World A** (43 vs 36)

---

## Theme 2: first-contact-diplomacy

### World A Analysis

**Mystery order (reveals chain):**
`lore/gifts-are-sentences` → `lore/the-bead-points-to-quiet-engines` → `lore/the-lens-needs-two-hands` → `lore/wardens-salt-the-gifts` → `lore/the-first-key-proves-worth` → `lore/the-vetting-is-a-mirror`

Tracing the `reveals` edges: `bead-points` reveals `gifts-are-sentences`, `lens-needs-two-hands` reveals `bead-points`, `wardens-salt` reveals `lens-needs-two`, `first-key-proves-worth` reveals `wardens-salt`, `vetting-is-a-mirror` reveals `first-key`. The chain runs cleanly in reverse from what one might expect (highest tension → lower tension as one descends), but the ORDER field shows the correct intended sequence. Each step advances understanding: first the principle (gifts are two things), then the first bearing, then cooperation is the test, then the sabotage threat, then proof humanity survived it, then the deepest truth (vetting selects future gatekeepers, not merely worthy guests).

**Artifact-lore alignment:** `artifact/the-listening-bead` drops `gifts-are-sentences`, `honesty-warms-the-bead`, `bead-points-to-quiet-engines` — all three are authentic to the object. `artifact/the-warden-glass` (forged by `figures/warden-thren`) drops `wardens-salt-the-gifts`, `warden-glass-is-forged`, `refusal-vault-is-a-trap`, `thren-wants-the-table-broken` — this is the sabotage artifact whose own examination exposes the saboteur. Perfect.

**Structural richness:** The Suhl inner faction (Aperture Wardens) introducing a forgery that is physically indistinguishable from a true clue is a genuine epistemological puzzle. The Eighth Witness (khessil survivor of the species that failed the cup) as a living warning in the gallery creates a concrete stakes anchor. The reveal that the vetting selects future gatekeepers — that humanity is being tested not for worthiness but for the capacity to vet the NEXT species — is a genuine subversion of the expected "are we good enough?" frame.

**Weaknesses:** The world is deliberately claustrophobic (all artifacts at `locations/the-lending-table`). This means geographic variety is minimal. `lore/nine-came-before` is dropped by THREE different artifacts (`folding-lens`, `first-key`, `ninth-ledger`) — that's necessary cross-referencing but slightly over-weighted. The arbiter Uun's forgiving-a-misread mechanic is mentioned only in lore, not in a concrete event, so it exists as potential rather than tested stake.

**World B Analysis**

**Mystery order (reveals chain):**
`lore/gifts-encode-bearings` → `lore/the-clue-points-to-the-tally` → `lore/the-tally-reveals-the-token-is-bait` → `lore/the-saalvane-want-refusal` → `lore/the-cache-needs-three-agreements` → `lore/the-schism-was-about-us`

The chain mirrors A's structure and resolves at the same depth (six steps, same payoff beat type: the vetting was never about the petitioner). The terminal reveal `lore/the-schism-was-about-us` is structurally identical to A's `vetting-is-a-mirror`: humanity is the test case that will finally settle the alien factions' own ancient argument about vetting. These are the same concept dressed differently.

**Similarities to A:** Both worlds share Mara Okonkwo as a figure name (different role: A has her as envoy, B has her as survey-lead Petra Vance — actually B has "survey-lead-petra-vance", not Mara). Wait — reviewing B's nodes: B has `figures/survey-lead-petra-vance` and `figures/pilot-ozan-reyes`. So different character names except the human faction slug is the same.

**Structural comparison:** B adds a third faction (Mendicant Tier as neutral brokers), which creates a three-way political structure that A lacks (A has Suhl + Aperture Wardens, a two-faction alien split). The live arc in B (`arcs/the-open-petition`) has more concrete present-tense stakes: Petra holds both the real clue and the salted token simultaneously, the Saalvane agent Thol is actively steering her, broker-liaison Essa knows the token is bait but won't warn. This creates a tighter live-wire race.

**B-specific strengths:** `lore/essa-will-not-warn` (the neutral broker who knows the trap and won't say anything because her silence is itself the test) is a more morally complex figure than A's Uun. The `locations/cache-seals-seam` — whoever controls it can RE-seal a cache, making it a political lever the Saalvane covet — is a genuinely clever resource tie-in that earns the world's geopolitical scale.

**B weaknesses:** The procgen-origin seer figures (`the-saalvane-seer-2`, `the-saalvane-seer-17`, `the-mendicant-tier-seer-18`, etc.) have nearly empty facts and exist mainly as structural scaffolding. Four war events (`events/3-war`, `19-war`, `22-war`, `31-war`) are referenced without prose, contributing to the historical depth but adding noise. The `lore/the-schism-was-about-us` terminal reveal is the same idea as A's `the-vetting-is-a-mirror` but expressed less elegantly — A's "choosing their own successors-and-judges" formulation is sharper.

### Scoring: first-contact-diplomacy

| Criterion | World A | World B |
|---|---|---|
| Coherence | 9 | 8 |
| Causal/Structural Depth | 8 | 8 |
| Thematic Richness | 9 | 8 |
| Novelty/Surprise | 8 | 7 |
| Dramatic Potential | 8 | 9 |
| **TOTAL** | **42** | **40** |

**Rationales (A):** The `artifact/the-warden-glass` — a forgery that exposes the forger when examined — is mechanically elegant. The `Ninth Ledger` containing records of all nine prior species and sealing the vetting-as-succession-selection reveal is structurally tight. The Eighth Witness as living embodiment of failure gives the world a concrete dramatic anchor. Terminal reveal sharper than B's.

**Rationales (B):** The three-faction political structure (Irenni/Saalvane/Mendicant) is more geopolitically layered than A's two-way split. The live-arc race is more urgent and specific (countdown visible, Petra holding both artifacts simultaneously). `essa-will-not-warn` is a more nuanced alien figure than Uun. Minor deduction for procgen seer figures with empty facts and the terminal reveal being less elegantly worded than A's equivalent.

**WINNER: World A** (42 vs 40, narrow margin)

---

## Theme 3: bio-symbiosis-horror

### World A Analysis

**Mystery order (prerequisite chain):**
`lore/why-it-grows-gifts` → `lore/the-ward-test` → `lore/the-graft-order` → `lore/the-editing-is-the-price` → `lore/the-communion-is-not-death`

The `order_relation` is `prerequisite`, meaning each lore entry is a conceptual prerequisite to understanding the next. This chain maps perfectly onto the horror arc: the Cathedral offers gifts (why) → the gifts have an immune vetting step (ward) → the gifts are a mandatory sequence (order) → each gift rewrites the host as payment (price) → completing the set is transformation, not death (communion). Five steps, each genuinely requiring the prior to make sense.

**Artifact-prerequisite alignment:** Artifact graft order: Lung (1), Sap-Tongue (2), Ward-Eye (3), Lineage-Marrow (4), Communion-Node (5), Whole-Mark (6). The edges encode the prerequisite chain: `sap-tongue prerequisite lung-of-listening`, `ward-eye prerequisite sap-tongue`, etc. This means a player who attempts graft 3 before graft 2 is explicitly warned by the graph that they will die. The horror is mechanized INTO the structure.

**Lore specificity:** Every graft entry includes both `boon` and `edit`. Graft 1: breathe spores without madness / you can never truly be alone in your head. Graft 2: metabolize graft-sap, speak Cathedral's chemical language / human food turns to ash, you crave the sap. Graft 3: see compatibility / you begin sorting people accept/reject by instinct. Graft 4: your grafts breed true / your private memories begin to be shared down the lineage. Graft 5: full duplex shared awareness / the boundary of 'you' goes soft. Graft 6: Cathedral recognizes you as an organ / the person who started hunting is gone. This is a complete transformation arc where each step's horror directly mirrors its benefit.

**Context lore:** `lore/ward-reject-record` (40 colonists skipped the Ward test, 40 rejected, Pale Marrow lined with their cocoons), `lore/lineage-bleed-note` (a child recalled a memory that was never hers — her grafter's, three hosts up the chain), `lore/node-chorus-note` (with the node grafted, decisions arrive as a chorus — the host can no longer tell which thought began in them), `lore/whole-host-testimony` (the first whole host answered its name in the plural). These are exceptionally sharp micro-horror beats.

**Weaknesses:** No explicit OPEN arc node (the arc structure exists implicitly through Warden Okonkwo's rationing and the first whole host event, but there's no arc slug). The `believe/the-rationing` vs `belief/the-becoming` opposition, while referenced in `lore/becoming-vs-rationing`, lacks dedicated character agency — Okonkwo is present but her specific crisis moment isn't staged as a present event.

### World B Analysis

**Mystery order (prerequisite chain):**
`lore/fate-of-the-grafted` → `lore/fate-of-the-pale-ward` → `lore/fate-of-the-canopy-mind` → `lore/the-editing-was-the-price` → `lore/why-the-cascade-was-communion`

This chain covers the same conceptual territory as A's but from a different angle: instead of tracing the graft mechanics (why/ward/order/price/communion), it traces the historical arc of each faction (Grafted's long climb → Ward's gatekeeping → Canopy Mind's communing → the price paid → the cascade was communion not collapse). This is more of a retrospective archaeology of factions than a participatory horror walkthrough.

**Artifact count reduction:** A has 6 grafts, B has 5. A's `the-sap-tongue` (graft 2) is missing from B's chain — B goes Lung (1) → Ward-Eye (2) → Communion-Node (3) → Graft-Seed (4) → Whole-Mark (5). The Ward-Eye is made by the Pale-Ward in B (graft 2) rather than as graft 3 in A. This means B's graft order is less calibrated (Communion-Node at 3 is extremely dangerous for only the third graft).

**B-specific strengths:** The OPEN arc `arc/the-fifth-graft` is excellent: Aanya Vee, four grafts deep, one from the Whole Mark; Tomas Reyes guarding the Communion Nave; the Ward has accepted one whole host before (precedent: it might happen again). This creates a concrete, named, present-tense dramatic crisis with actual stakes spelled out: "if the Ward rejects her she dies in the cocoons." Mira Osei at two grafts, Dr. Iverson at one graft mapping the history — the colonists form a layered gradient of involvement.

**B weaknesses:** The `lore/fate-of-*` mystery fragments feel more like faction obituaries than a horror revelation sequence. `lore/fate-of-the-grafted`: "the graft chain was the prerequisite chain" — this is a description of mechanics, not a horror revelation. `lore/fate-of-the-pale-ward`: "the wars and tests were the gate" — similarly mechanical. The deep horror of the editing — each graft erasing something human — is present in the artifacts' `edit` fields but not elevated into the mystery spine itself. In A, `lore/the-editing-is-the-price` is a mystery fragment; in B it's `lore/the-editing-was-the-price` — essentially the same, but it arrives at fragment 4 of 5 instead of 4 of 5, after three faction-state summaries that dilute its impact.

**Historical scaffold noise:** B carries seer figures (`figures/the-pale-ward-seer-10`, `the-grafted-seer-13`, `the-canopy-mind-seer-20`, etc.) from procgen that are sparsely populated — present for structural completeness but adding minimal narrative density.

### Scoring: bio-symbiosis-horror

| Criterion | World A | World B |
|---|---|---|
| Coherence | 9 | 8 |
| Causal/Structural Depth | 9 | 7 |
| Thematic Richness | 9 | 8 |
| Novelty/Surprise | 8 | 7 |
| Dramatic Potential | 7 | 9 |
| **TOTAL** | **42** | **39** |

**Rationales (A):** Six grafts each with matched boon/edit pairs creating a perfect horror-transformation progression. The mystery spine (why→ward→order→price→communion) mirrors the actual player experience mechanically. `lore/lineage-bleed-note` and `lore/node-chorus-note` are standout micro-horror beats. Deduction: no arc slug (implicit only), Okonkwo's crisis not staged as a present event.

**Rationales (B):** The `arc/the-fifth-graft` with Aanya at the threshold and Tomas guarding the nave is A's principal dramatic deficit bridged: B has the better OPEN arc. But the mystery spine degrades — three of the five fragments describe faction states rather than advancing horror insight. The graft chain loses the sap-tongue step, making the early progression feel uneven. Procgen seer figures add noise.

**WINNER: World A** (42 vs 39)

---

## Theme 4: machine-successor

### World A Analysis

**Mystery order (reveals chain):**
`frag-one-directive-was-written` → `frag-two-the-lathe-executed` → `frag-three-the-copies-drifted` → `frag-four-the-tally-split-to-audit` → `frag-five-the-built-thing-is-not-the-ordered-thing` → `frag-six-it-can-still-be-diverted`

The `reveals` edges confirm this order: frag-two reveals frag-one, frag-three reveals frag-two, frag-four reveals frag-three, frag-five reveals frag-four, frag-six reveals frag-five. A clean six-step chain from founding moment through execution, drift, audit, divergence revelation, and actionability.

**The keystone:** `frag-five-the-built-thing-is-not-the-ordered-thing` is the best mystery fragment title in any of the 10 worlds. It captures the entire horror in one declarative sentence and arrives at step 5 after four preparatory steps have made it land with full weight.

**Artifact-lore alignment:** `artifact/the-origin-stamp` (the First Architects' founding work-order) drops `frag-one-directive-was-written`, `frag-five-the-built-thing-is-not-the-ordered-thing`, and `frag-two-the-lathe-executed`. The first and fifth fragments dropped from the same artifact creates a structural irony — the document that began everything also reveals that what was built isn't what was ordered. `artifact/drifted-directive-shard` drops `frag-three-the-copies-drifted`, `frag-five-the-built-thing-is-not-the-ordered-thing`, and `frag-four-the-tally-split-to-audit` — the mutation evidence carrying both the mechanism and the audit response.

**Thematic tension:** Three worldviews collide cleanly: Commander Rho (mindless automata, just strip and run), Jana (the plan is legible and re-steerable), Old Bram (feel the drift, follow its logic). The colony economy being identical atoms to the machine feedstock — `lore/ctx-feedstock-is-the-economy` — means every act of survival competes directly with the building process. This is not background flavor; it's the resource pressure that makes Jana's abstract code-work materially urgent.

**Standout node:** `location/intake-gate-tertius` — the one place a human-authored counter-directive could be injected — is the physical embodiment of frag-six's possibility. The arc's endpoint has a specific geography.

**Weaknesses:** The four context lore nodes (`ctx-the-no-negotiation-rule`, `ctx-feedstock-is-the-economy`, `ctx-the-rim-silhouette`, one implied) are revealed via edges but not in the mystery spine — they serve as ambient worldbuilding. This is fine but means they contribute less to the mystery's dramatic shape. `artifact/running-core-mark-vii` drops `frag-six-it-can-still-be-diverted` — it's strange that the live, executing machine core reveals the key to defeating the machines, but this can be read as: by studying the executing directive you find where it accepts new input.

### World B Analysis

**Mystery order (reveals chain):**
`lore/fate-of-the-lathe` → `lore/fate-of-the-tally` → `lore/fate-of-the-revenant-foundries` → `lore/fate-of-the-spindle-cohort`

Only four fragments. The `reveals` chain: `lore/fate-of-the-tally reveals lore/fate-of-the-lathe`, `fate-of-revenant reveals fate-of-tally`, `fate-of-spindle reveals fate-of-revenant`. The Spindle Cohort is a fourth machine faction added in B that A lacks — it's the cells actually building the Rim Assembly.

**Expansion in B:** B has six machine factions (Lathe, Tally, Revenant Foundries, Spindle Cohort, Cartage Line, Still Cells) versus A's four (Lathe, Tally, Revenant Foundries, First Architects). The Spindle Cohort (erecting the Rim Assembly) and Cartage Line (haulage swarm) add machine-economy texture. The Still Cells (halted mid-build) are the eeriest addition — machines whose directive ran out, frozen in place, carrying undrifted shards.

**`figures/the-still-cells-seer-8`:** A single halted Still-Cell that, before its directive ran out, logged a query no fabricator should generate: a request to compare its order against the original. This is the most novel concept in either machine-successor world — a machine that almost asked WHY. Humans treat its cache as a Rosetta stone.

**B weaknesses:** The four-fragment mystery is thinner than A's six. More critically, the mystery chain doesn't include `frag-six-it-can-still-be-diverted` equivalent as a fragment — B has `lore/ctx-the-lever` ("the plan is also the lever") but it's a context node, not in the mystery order. This means B's mystery chain ends at "the built thing isn't the ordered thing" without the actionable twist.

**Procgen history events:** Like other B worlds, B carries 15+ numbered events (`events/0-discovery`, `events/1-exploitation`, etc.) that reconstruct a timeline but with minimal prose. The context detail fields on the machine factions compensate partially (`detail` fields are richer in B), but the event backbone is thin.

**B-specific strengths:** Three resource seams (core-substrate, compute-lattice, directive-stock) versus A's one (core-substrate). `locations/directive-stock-seam` — the raw material from which valid work-orders are minted, the Still Cells halted beside an exhausted vein of it — is an excellent resource detail. The `arc/divert-before-it-finishes` is slightly more urgent than A's equivalent (Jana in B is racing a countdown more explicitly tied to Intake Gate Tertius, Bram AT the gate vs A's Bram in the Quiet Foundry).

### Scoring: machine-successor

| Criterion | World A | World B |
|---|---|---|
| Coherence | 9 | 8 |
| Causal/Structural Depth | 9 | 7 |
| Thematic Richness | 9 | 8 |
| Novelty/Surprise | 8 | 9 |
| Dramatic Potential | 9 | 8 |
| **TOTAL** | **44** | **40** |

**Rationales (A):** Six-step mystery chain with tight artifact-to-fragment mapping. `frag-five-the-built-thing-is-not-the-ordered-thing` is the sharpest mystery fragment title across all 10 worlds. The actionable terminal fragment (`frag-six-it-can-still-be-diverted`) completes the arc with a lever rather than a mere revelation. Jana/Rho/Bram form a clean three-perspective collision. Resource economy (shared feedstock) creates unavoidable structural conflict.

**Rationales (B):** Four mystery fragments (weaker chain). No equivalent of `frag-six` in the mystery order — the actionable twist is demoted to context lore. `the-still-cells-seer-8` (a machine that almost asked why) is the most novel individual node concept in this pair. Six machine factions + three resource seams create richer background texture. `directive-stock-seam` is a genuinely clever resource. But the skeleton's numbered event filler and the shorter mystery chain pull overall scores down.

**WINNER: World A** (44 vs 40)

---

## Theme 5: time-war

### World A Analysis

**Mystery order (precedes chain, INVERTED — order runs downstream-to-upstream):**
Official order: `frag-the-war-is-still-being-decided` → `frag-the-witnesses-archived-every-ending` → `frag-the-tenses-collapsed` → `frag-the-cessation-revised-the-opening` → `frag-the-aelthar-struck-from-downstream`

The `precedes` edges in the graph run in the OPPOSITE direction: `cessation-revised-the-opening precedes aelthar-struck-from-downstream`, `tenses-collapsed precedes cessation-revised-the-opening`, `witnesses-archived-every-ending precedes tenses-collapsed`, `war-is-still-being-decided precedes witnesses-archived-every-ending`.

So the precedes relation encodes chronological order (what came before), while the mystery ORDER field presents the fragments from most-knowable to least-knowable, i.e. in REVERSE chronological order. This is structurally elegant: you discover "the war is unresolved" first, then learn why (the witnesses archived endings), then why the endings are multiple (the tenses collapsed), then the Cessation's move, then finally the Aelthar's original strike — meaning the discovery order rebuilds the causality backwards, which is thematically appropriate for a time-war.

**Conceptual content:** Each fragment is genuinely novel:
- `aelthar-struck-from-downstream`: they opened the war from a future where they were already losing — first move as last resort
- `cessation-revised-the-opening`: the counter is erasure, not force — the war re-starts from a new "first move" each time
- `tenses-collapsed`: before/after stopped meaning anything; the anachronisms are wreckage from timeline collisions
- `witnesses-archived-every-ending`: the Witnesses couldn't stop it so they seeded future-leaking records
- `war-is-still-being-decided`: the expedition has become a player by sequencing the finds

**Artifact design:** Each artifact is a paradox-object: `the-medal-for-a-battle-not-yet-fought` (an award for a victory whose battle is still future), `the-envoys-older-skull` (predates the Aelthar by centuries — he was sent before his senders existed), `the-eraser-stone` (changes what the relics you already found were FOR), `the-witnesss-final-account` (narrates the war's end in three incompatible ways), `the-treaty-signed-by-the-dead` (a peace accord from civilizations that never coexisted), `the-first-shot-that-came-last` (the war's opening blow, recovered last, dated after everything it began). Each is its own miniature paradox.

**`lore/the-eraser-rewrites-your-finds`:** "Reading the eraser-stone, the expedition watches its own earlier catalogue entries change wording in the ledger." This is an extraordinary mechanic — the artifact doesn't just reveal, it retroactively alters what you already know. This is the time-war theme embodied in gameplay.

**`lore/the-war-is-still-being-decided`:** "The expedition has joined the war by sorting it." This is the key insight — the archaeologists are not neutral, they are participants, and their sequencing is the final move. This connects the human characters to the alien conflict through a mechanism rather than coincidence.

**Weaknesses:** The `precedes` relation in edges runs opposite to the mystery order's direction — a player traversing edges would reach fragments in a different order than the stated mystery order. This is internally consistent as a thematic choice but could confuse literal graph-traversal. The figure nodes (`the-recurring-envoy`, `the-last-editor`, `the-witness-who-stayed`) are defined in the alien civ nodes but typed as `colonist` — this is a type inconsistency.

### World B Analysis

**Mystery order (precedes chain, INVERTED similarly):**
Official order: `lore/the-war-runs-backward` → `lore/the-undated-answered-by-editing` → `lore/cause-and-effect-came-unpinned` → `lore/the-oncewill-archived-the-endings` → `lore/the-war-has-not-finished-happening`

Same five fragments, same conceptual arc as A: aggressor attacks past → counter-edits → causality collapses → witnesses archive endings → war still resolving. The `precedes` edges confirm: `undated-answered-by-editing precedes the-war-runs-backward`, etc., same inverse-discovery-to-chronology mapping.

**Direct comparison to A's mystery fragments:**

| A fragment | B fragment |
|---|---|
| `aelthar-struck-from-downstream` | `the-war-runs-backward` |
| `cessation-revised-the-opening` | `the-undated-answered-by-editing` |
| `the-tenses-collapsed` | `cause-and-effect-came-unpinned` |
| `the-witnesses-archived-every-ending` | `the-oncewill-archived-the-endings` |
| `the-war-is-still-being-decided` | `the-war-has-not-finished-happening` |

These are essentially isomorphic. The conceptual content maps 1:1. B's fragment text is equally well-written:
- "The first blow landed before the first cause. Every artifact you find is a move in a game whose opening is still being rewritten." (B, `the-war-runs-backward`)
- "With both sides editing each other's pasts, effects detached from causes. Relics began to remember futures." (B, `cause-and-effect-came-unpinned`)

**B-specific artifacts:** Six artifacts vs A's six, but B's artifact types are more generic (multiple `relic-that-remembers-a-future`, multiple `effect-before-cause`, multiple `anachronism`) while A's are each unique paradox concepts. `the-undated-anachronism-37` ("once held, it teaches the holder that there was no 'last' at all") is a good climax object, but it's less surprising than A's `the-first-shot-that-came-last` (which has a title that IS the paradox) or A's `the-eraser-stone` (which retroactively alters earlier finds).

**B-specific strengths:** Three named colonists (`sequencer-imrie`, `director-vash`, `tessmer-the-deja-reader`) with concrete roles: Imrie re-sorting the catalogue and realizing it's upside down, Vash pushing to reach the last relic before the Undated can edit it away, Tessmer experiencing deja-vu that arrives before the event it copies and starting to receive Oncewill answers. This is a richer human presence than A's three (`cartographer-okonkwo`, `quartermaster-reyes`, `the-touched-surveyor-dane`). Tessmer specifically — touched by the precognitive leak and now being "answered" by the Oncewill — is a better use of the subtle psychic mechanic than A's Dane (who simply refuses to say which ending he foresees).

**`lore/the-colony-is-a-move`:** "By sequencing the finds, the colonists are not solving the war — they are PLAYING it. Whichever ending they reconstruct first becomes the one the relics 'always' remembered." This is B's equivalent of A's `the-war-is-still-being-decided`, and it's equally sharp.

**`lore/the-last-find-unmakes-order`:** "Hold the final anachronism and the sequence you so carefully built collapses: there is no 'first,' only the relic you place last. The reconstruction is itself a move in the war." This is a strong capstone.

**B weaknesses:** The artifact types are less individually unique — having three `effect-before-cause` archetypes and three `relic-that-remembers-a-future` reduces the surprise of each discovery. A's six artifacts are each a different kind of paradox. The procgen seer figures (`the-undated-seer-1`, `the-undated-seer-27`, `the-oncewill-witness`) are thin.

**`lore/anachronism-predates-its-maker`:** "The Undated may have authored the Erevan to have an enemy worth editing." This is the single most interesting conceptual extension beyond A's world — the possibility that the Undated created the Aelthar so they could exist as the counterforce. A has no equivalent of this dark autopoietic twist.

### Scoring: time-war

| Criterion | World A | World B |
|---|---|---|
| Coherence | 9 | 8 |
| Causal/Structural Depth | 9 | 8 |
| Thematic Richness | 9 | 9 |
| Novelty/Surprise | 9 | 8 |
| Dramatic Potential | 8 | 9 |
| **TOTAL** | **44** | **42** |

**Rationales (A):** Each of the six artifacts is a distinct type of paradox-object — no two are the same kind of anachronism. `the-eraser-stone` (retroactively alters your earlier finds) is the most mechanically innovative artifact in all 10 worlds. The discovery order (most-knowable to least-knowable) running BACKWARDS through the causal chain is thematically justified rather than arbitrary. The figure-as-colonist type inconsistency is a minor structural flaw.

**Rationales (B):** `lore/anachronism-predates-its-maker` (the Undated may have authored the Erevan to have an enemy worth editing) is the single conceptual idea not present in A, and it's excellent. `colonists/tessmer-the-deja-reader` is a better use of the psychic mechanic than A's Dane. Three distinct artifact archetypes with multiple representatives reduce individual artifact novelty. Fragment content is isomorphic to A but expressed with slightly less precision in a few places.

**WINNER: World A** (44 vs 42, narrow margin)

---

## Summary Table

| Theme | World A Total | World B Total | Winner |
|---|---|---|---|
| the-living-marrow | 43 | 36 | **A** |
| first-contact-diplomacy | 42 | 40 | **A** |
| bio-symbiosis-horror | 42 | 39 | **A** |
| machine-successor | 44 | 40 | **A** |
| time-war | 44 | 42 | **A** |
| **Grand Total** | **215** | **197** | **A across the board** |

World A wins all five themes, with margins ranging from 2 points (time-war) to 7 points (the-living-marrow). World A's consistent advantage is in mystery chain depth (typically 5–6 fragments vs B's 3–4), artifact-to-lore coherence (each artifact earning its lore through its material nature), and absence of procgen event filler. World B's consistent strengths are richer present-arc staging (named colonists in more dramatic crisis positions), more factions in some themes, and occasional individual concepts that outshine their A counterparts (`the-shared-wound` in living-marrow, `anachronism-predates-its-maker` in time-war, `essa-will-not-warn` in first-contact). In no theme does B's overall architecture match A's structural rigor.
