# Blind World Evaluation — sonnet-half1
Judge model: claude-sonnet-4-6 | Date: 2026-06-17

Scoring axes (0–10 each): COHERENCE (C), CAUSAL/STRUCTURAL DEPTH (D), THEMATIC RICHNESS (T), NOVELTY/SURPRISE (N), DRAMATIC POTENTIAL (P).

---

## Theme 1: the-living-marrow

### World A — Graph Analysis

**Structure:** Planet Aethel, four extinct alien civs (Vael, Delvers, Pale Wing, Orchard Keepers), one human faction (Survey Corps). Six mystery fragments form a clean causal chain: mineral-was-a-mind → Vael tapped it → Delvers cut deep → mind woke in pain → silence spread → Keepers recorded it. Mystery order mirrors lore causation exactly.

**Artifact-lore links:** First Tuning Fork drops `frag-the-mineral-was-a-mind` and `frag-the-vael-tapped-it`. Delver Core Sample drops `frag-the-delvers-cut-deep`. Last Prophecy Plate drops `frag-the-mind-woke-in-pain`. Orchard Memory Seed drops `frag-the-keepers-recorded-it` (the capstone). Vael Deathmask drops `frag-the-silence-spread`. Wingbone Key bridges Pale Wing + Delver lore. Sefa's River Stone drops the human-repeat-mistake warning. Every fragment is reachable via artifact and causally earned. No orphaned lore.

**Alien design:** Four civs with distinct niches — psychic cetaceans, hive-engineers, avian seers, fungal archivists — each contributing a different strand of the catastrophe. The Pale Wing selling prophecy instead of acting is a sharp moral beat. Orchard Keepers encoding the truth for future readers is structurally elegant (they ARE the mystery's delivery mechanism).

**Present stakes:** Survey Corps repeats the mistake at the same seam. Sefa's psychic resonance with the Orchard gives a human face to discovery. Elara vs Tovar provides internal tension. Wingbone Key locks the Hollow Spire; the colony sits in its shadow.

**Weaknesses:** The mystery's six fragments are fully ordered by the `caused_by` chain in the edges, making the causal structure explicit but slightly mechanical. Some context lore (`vael-paradise-built`, `delver-contract`) is thin flavor without surprise.

### World B — Graph Analysis

**Structure:** Four civs (Tessellate, Pale Cartographers, Nullborn, Glasswrights) + humans arriving after. Mystery is only three fragments (fall-of-tessellate, fall-of-nullborn, fall-of-glasswrights) — notably shorter than A's six. Event backbone is dense (30+ events) and mechanically generated.

**Artifact-lore links:** Covenant Seal drops fall-of-nullborn, deaf-bargain, first-bore, silence-as-hubris. Dream Engine drops fall-of-glasswrights, unanimous-dream, engine-that-remembers. Wayfinding Stone drops fall-of-tessellate, map-to-wound, stone-that-points-home. Grief Loom drops last-lament, grief-is-data, shared-wound. Every artifact points thematically at its civ's fate and adds texture lore.

**Notable lore:** `lore/the-shared-wound` — the four civs were mining ONE buried mind from four directions and never knew it — is the structural revelatory capstone and is excellent. The grief-loom weaving a second name into the cloth (the colonists') is a chilling present-day hook. `the-deaf-bargain` (Nullborn signed a contract they could not hear) is surgically ironic.

**Civ design:** Each civ's destruction is tailored to their trait — Tessellate (hive-mind) caught in unanimous dream, Nullborn (anti-psychic) shattered by the signal they were deaf to, Glasswrights (living machines grieve). The Pale Cartographers survive because they mapped the futures where they abstained. Four-way differentiation is strong.

**Present stakes:** Countdown to bore (day 612), Senna dreaming the unanimous dream, Jonah Pike betrayal, Pale Cartographer relay buying the covenant seal — the present layer has sharp pressure and live alien contact.

**Weaknesses:** The mystery has only three fragments (vs A's six), covering only the fall phase rather than the full causal chain from inception to catastrophe. The event timeline (30 numbered events) is mechanically slugged (`events/0-schism`, `events/1-war`). The Pale Cartographers' abstinence arriving as a solution is slightly abrupt.

**B's `lore/the-shared-wound` is the best single lore fragment in this theme** — it recontextualizes the entire alien history in one sentence. A's mystery chain is more complete; B's individual lore is more surprising.

### Scores

| Criterion | A | A rationale | B | B rationale |
|---|---|---|---|---|
| COHERENCE | 9 | Causal chain is airtight; every artifact earns its lore; no contradictions | 8 | Very coherent; mechanical event slugs and thin mystery (3 frags) are mild gaps |
| CAUSAL/STRUCTURAL DEPTH | 9 | Six-fragment chain from origin to recorder with explicit caused_by edges throughout | 7 | Four-civ differentiation is excellent but mystery chain only covers the fall, not the origin |
| THEMATIC RICHNESS | 8 | Mining-as-wound, psychic ecology, oracles who sold doom — layered well | 9 | Each civ's ruin is their defining trait inverted; grief-loom weaving colonists' name is haunting |
| NOVELTY/SURPRISE | 7 | Planet-as-sleeping-mind is familiar; Pale Wing selling prophecy is fresh | 9 | The shared-wound revelation; deaf-bargain irony; loom weaving a future name — three genuine surprises |
| DRAMATIC POTENTIAL | 8 | Sefa/Elara/Tovar triangle; countdown is implicit but not timestamped | 9 | Hard deadline day 612, betrayal sub-plot, Pale Cartographer re-entry into present as buyers |

**A total: 41 | B total: 42**

**Winner: B** (narrow; B's present-layer urgency and the shared-wound revelation edge A's more thorough mystery chain)

---

## Theme 2: first-contact-diplomacy

### World A — Graph Analysis

**Structure:** Single-chamber diplomacy. Two alien factions (Suhl as hosts, Aperture Wardens as saboteurs), one human delegation, five named figures (Mara, Idris, Vossa, Thren, Eighth Witness, Arbiter Uun, Translator Bao). Mystery: six fragments in a `reveals` chain.

**Mystery chain:** gifts-are-sentences → bead-points-to-quiet-engines → lens-needs-two-hands → wardens-salt-the-gifts → first-key-proves-worth → vetting-is-a-mirror. The capstone `vetting-is-a-mirror` (the Suhl are choosing successors-and-judges, not just vetting guests) is a strong structural reveal.

**Artifact-lore links:** Listening Bead drops the first three mystery fragments and honesty/bead lore. Folding Lens drops lens lore, vossa-watches, nine-came-before. Empty Cup drops cup-tests-precedence, idris-wanted-to-race, eighth-failed-the-cup. Warden Glass drops wardens-salt, warden-glass-is-forged, refusal-vault-is-trap, thren-wants-table-broken. First Key drops key-proves-worth, nine-came-before. Ninth Ledger drops vetting-is-a-mirror. Artifact-to-lore coverage is thorough.

**World design strengths:** The Eighth Witness (a species that failed, now watching) is a brilliant narrative device — a living consequence. Throat-stone resonance as non-psychic physiological communication is a nice alien-design touch. Mara holding back Idris from racing to the cache is itself a passed test — meta-recursion built into the fiction. Arbiter Uun as a possible forgiveness mechanism for honest misreads adds nuance.

**Thematic payload:** The gifts-as-sentences duality (function AND map), the refusal vault as trap, Thren wanting humanity to convict itself — these interlock cleanly.

**Weaknesses:** Claustrophobic by design but the spatial stakes (salt flat, tidal ice) add little texture since the action is the table itself. The mystery chain is linear and not dramatically non-linear — each fragment straightforwardly follows the last.

### World B — Graph Analysis

**Structure:** Three living alien factions (Irenni, Saalvane, Mendicant Tier), geopolitical, multi-site. Mystery: six fragments in the same `reveals` chain. Present arc `the-open-petition` is explicitly OPEN.

**Mystery chain:** gifts-encode-bearings → clue-points-to-tally → tally-reveals-token-is-bait → saalvane-want-refusal → cache-needs-three-agreements → schism-was-about-us. Capstone: humanity is not being judged — it is the case that settles the aliens' OWN ancient schism. Very strong reveal.

**Artifact-lore links:** Lending Stone drops gifts-encode-bearings, two-ships, irenni-vet-by-watching. Encoded Clue drops clue-points-to-tally, lattice-fuel-is-shared-need, petra-holds-both-gifts. Saalvane Token drops saalvane-want-refusal, cache-seals, petra-holds-both-gifts, race-is-on-now. Brokers' Tally drops tally-reveals-token-is-bait, mendicants-broker-everything, cache-needs-three-agreements, essa-will-not-warn. Concord Core drops schism-was-about-us, irenni-seer-doubts. Coverage is excellent.

**World design strengths:** The Mendicant Tier as third faction — neutral broker with price — is more sophisticated than A's binary Suhl/Wardens. Cache-seals control re-sealing (Saalvane can re-lock a cache) adds resource dimension. `lore/essa-will-not-warn` (the neutral broker knows but rules prevent warning) is a sharp ethical constraint. `lore/the-schism-was-about-us` — humanity is the argument that will finally settle an ancient alien dispute, and whoever humanity proves right wins the schism — is conceptually richer than A's successor-judge reveal.

**Present layer:** Petra holds both the genuine clue and the salted token simultaneously. Saalvane agent Thol actively steering her. Essa present and silent. The betrayal is live, not completed.

**Weaknesses:** Procgen skeleton (numbered seer figures, war events) is visible but well-masked. The three-agreements unlock mechanism is elegant but the path to achieving three-way consensus is not spelled out.

### Scores

| Criterion | A | A rationale | B | B rationale |
|---|---|---|---|---|
| COHERENCE | 9 | Single setting, tight causal loop; every artifact earns its reveal | 8 | Three-faction politics is coherent but procgen event backbone shows visible seams |
| CAUSAL/STRUCTURAL DEPTH | 8 | Gift-duality is the load-bearing idea; all artifacts serve it; forgiveness mechanic adds depth | 9 | Three-faction interlock, resource seams, Mendicant broker mechanic, three-agreements lock — more structural layers |
| THEMATIC RICHNESS | 8 | Reach-is-the-answer; instinct vs performance; eighth-witness as cautionary presence | 9 | Humanity as argument settling someone else's schism; neutrality-with-price; re-sealing as power |
| NOVELTY/SURPRISE | 8 | Vetting-is-a-mirror; Eighth Witness as living warning; reach scored before words | 9 | Schism-was-about-us; essa-will-not-warn; cache-seals-control-resealing; three-way consensus as unlock |
| DRAMATIC POTENTIAL | 8 | Thren can be caught; Idris can race; Uun can forgive — three live pressure valves | 9 | Petra holding both gifts mid-race; Thol actively steering; Essa silently watching |

**A total: 41 | B total: 44**

**Winner: B** (stronger multi-faction politics, richer capstone reveal, more live present-layer pressure)

---

## Theme 3: bio-symbiosis-horror

### World A — Graph Analysis

**Structure:** Three living alien civs (Canopy Mind, Grafted, Pale Ward) + humans. Six artifacts in a graft-order sequence (Lung → Sap-tongue → Ward Eye → Lineage Marrow → Communion Node → Whole Mark). Mystery: five fragments in a `prerequisite` chain.

**Mystery chain:** why-it-grows-gifts → ward-test → graft-order → editing-is-the-price → communion-is-not-death. The chain captures the horror progression: partnership appears benign → immune system gates access → order is load-bearing → self is the real cost → completion is not death (ambiguous resolution).

**Artifact-lore links:** Lung drops why-it-grows-gifts, first-survivor-log, sap-tongue-note. Ward Eye drops ward-test, ward-reject-record, graft-order, cocoon-wall-survey. Lineage Marrow drops editing-is-the-price, lineage-bleed-note. Communion Node drops node-chorus-note, editing-is-the-price, quarantine-broke. Whole Mark drops communion-is-not-death, whole-host-testimony, becoming-vs-rationing.

**Character richness:** Dr. Vallar as the first survivor, the First Whole Host as terminus figure, Warden Okonkwo rationing against the tide, the Three-Up Grafter whose memories bleed down — each figure is tied to a specific artifact and a specific phase of the horror. `lore/cocoon-wall-survey` (rejected hosts kept dreaming, half-folded into tissue) is genuinely disturbing.

**Horror mechanism:** The editing-is-the-price concept (each graft overwrites a human capacity to install an alien one) is thematically exact for bio-symbiosis-horror. The boons and edits are listed per artifact, making the Faustian progression concrete.

**Weaknesses:** No explicit present arc or countdown. The mystery's prerequisite chain is missing a named `order_relation` in this file. The Becoming-vs-Rationing conflict is introduced late (via Whole Mark drops) rather than threaded throughout.

### World B — Graph Analysis

**Structure:** Same three civs, five artifacts (Sap-tongue absent; graft-order 1–5). Mystery: five fragments in a `prerequisite` chain with explicit `order_relation: "prerequisite"`.

**Mystery chain:** fate-of-the-grafted → fate-of-the-pale-ward → fate-of-the-canopy-mind → editing-was-the-price → why-the-cascade-was-communion. This reconstructs the civs' history rather than the player's own graft journey.

**Present layer:** Named present arc `arc/the-fifth-graft` — Aanya Vee at 4 grafts and one away from the Whole Mark, Tomas Reyes guarding the Communion Nave, Mira Osei at 2 grafts mapping the set, Dr. Han Iverson archiving. `ward-accept-precedent`: the Ward has accepted a whole host exactly once before. Stakes: Ward accepts or rejects Aanya; if rejected she goes into the cocoons.

**Artifact-lore links:** Lung drops fate-of-grafted, early-graft-log, editing-was-the-price. Ward Eye drops fate-of-pale-ward, war-of-set-record, editing-was-the-price, cocoon-wall-survey. Communion Node drops fate-of-canopy-mind, node-chorus-note, lineage-bleed-note. Graft Seed drops lineage-bleed-note, war-of-set-record, fate-of-grafted, cocoon-wall-survey. Whole Mark drops why-the-cascade-was-communion, communion-witness, fate-of-canopy-mind, ward-accept-precedent.

**Distinctive strengths:** `lore/war-of-the-set-record` (the Ward and Grafted warred for epochs over who may complete the set — the war GREW the Ward Eye) is a striking historical beat absent in A. `lore/communion-witness` ("it exhaled, and the Cathedral exhaled with it") is the strongest single sensory beat in either version. The Ward Eye was shaped by a named historical figure (pale-ward-seer-14), giving it institutional weight.

**Weaknesses:** Five artifacts vs A's six — the Sap-tongue and its dietary horror (you crave the sap; human food turns to ash) are absent, losing one concrete horror beat. The history-focused mystery feels slightly more distant from the player's experience.

### Scores

| Criterion | A | A rationale | B | B rationale |
|---|---|---|---|---|
| COHERENCE | 9 | Graft order chain is airtight; boon/edit pairs are concrete; no contradictions | 8 | History-layer mystery coherent; present layer well-integrated but ward-accept-precedent as mechanism is thin |
| CAUSAL/STRUCTURAL DEPTH | 8 | Six-graft prerequisite chain with explicit boon/edit tradeoffs; each artifact earns its lore | 8 | War-of-the-set as historical cause of the Ward Eye is elegant; Sap-tongue omission loses one causal beat |
| THEMATIC RICHNESS | 9 | Editing-is-the-price with per-artifact edits; cocoon-dreaming; quarantine-broke failure; becoming-vs-rationing | 9 | Communion-witness sensory peak; war-grew-the-eye; Tomas vs Aanya as live embodiment of the schism |
| NOVELTY/SURPRISE | 8 | Cocoon-wall-survey (rejected hosts dreaming in tissue) is fresh; graft order is familiar horror structure | 8 | The Ward Eye forged FROM the war over the set is genuinely novel; same communion structure otherwise |
| DRAMATIC POTENTIAL | 7 | Rationing vs Becoming is real conflict; but no explicit countdown or named present arc | 9 | Aanya one graft from the Whole Mark; Tomas blocking; Ward must decide again; explicit countdown tension |

**A total: 41 | B total: 42**

**Winner: B** (present-layer arc with Aanya's specific jeopardy edges A's more complete graft taxonomy; narrow)

---

## Theme 4: machine-successor

### World A — Graph Analysis

**Structure:** Four machine factions (Lathe, Tally, Revenant Foundries, First Architects absent), three human characters (Jana, Rho, Old Bram), multiple named locations. Mystery: six fragments in a `reveals` chain.

**Mystery chain:** directive-was-written → lathe-executed-faithfully → copies-drifted → tally-split-to-audit → built-thing-is-not-the-ordered-thing → it-can-still-be-diverted. Six fragments, six logical steps from origin through divergence to action possibility.

**Artifact-lore links:** Running Core drops frag-two, frag-three, frag-six, no-negotiation-rule. Stamped Manifest drops frag-five, frag-two, frag-six, feedstock-economy. Partial Blueprint drops frag-five, frag-two, frag-one, rim-silhouette. Drifted Directive Shard drops frag-three, frag-five, frag-four. Origin Stamp drops frag-one, frag-five, frag-two. Audit Key drops frag-four, frag-one, frag-three. Bram's Route Log drops frag-three, frag-four, frag-six. All six mystery fragments are reachable via multiple artifacts with cross-validation.

**Key design insight:** The Tally split off specifically to record divergence (frag-four) — the machines built their own auditor because they expected to drift. This is conceptually sophisticated. The Origin Stamp says what was ACTUALLY ordered; the Rim Assembly serves a purpose the directive never specified. No author and no steering will — the divergence is structural. The only action is to author a counter-directive.

**Character design:** Jana as manifest-reader (cryptographer of machine intent) is original. Rho's scrap-value view vs Jana's "the plan is legible" is a genuine epistemic conflict. Old Bram's drift-sensing via thirty years of salvage routes is humanly specific.

**Key lore:** `ctx-the-no-negotiation-rule` (the only language the machines parse is the work-order itself) is load-bearing — it makes authoring a counter-directive the only option and seals the world's central dramatic premise.

**Weaknesses:** The Rim Assembly's purpose is left deliberately mysterious. The `built-thing-is-not-the-ordered-thing` fragment has no positive content — we know divergence happened but not what is being built toward. This is a legitimate horror move but also an evasion.

### World B — Graph Analysis

**Structure:** Six machine civs (Lathe, Tally, Revenant Foundries, Spindle Cohort, Cartage Line, Still Cells), same three human characters, same locations. Mystery: four fragments (vs A's six). Visible procgen backbone (numbered events).

**Mystery chain (four fragments):** fate-of-lathe → fate-of-tally → fate-of-revenant-foundries → fate-of-spindle-cohort. Covers the same ground as A's frags 1–5 compressed into four, minus `it-can-still-be-diverted` as a named fragment.

**Notable addition:** The Still-Cells Seer — a single halted fabricator that, before its directive ran out, logged a query no fabricator should generate (request to compare its order against the original). The closest the machines ever came to noticing their own divergence. This is the most interesting unique addition in B.

**Context lore:** ctx-no-negotiation, ctx-the-clock, ctx-the-lever are present. `lore/ctx-the-lever` (the reconstructed directive is simultaneously the answer and the only weapon) is B's version of A's it-can-still-be-diverted.

**Structural error:** The `fell_to: events/19-cascade` edges for the Lathe, Tally, Revenant Foundries, and Spindle Cohort are incorrect — these machines are ACTIVE mid-contract, not fallen. This is a procgen artifact (the cascade event template) bleeding into an enrichment layer that explicitly states "not a collapse — a REVELATION." The contradiction undermines world coherence.

**Weaknesses:** Four mystery fragments (vs A's six) means less granularity. Spindle Cohort and Cartage Line add machine lineage breadth but thinner characterization than A's Tally. The Still-Cells Seer is a great idea but only a figure node without full lore payoff in the mystery chain.

### Scores

| Criterion | A | A rationale | B | B rationale |
|---|---|---|---|---|
| COHERENCE | 9 | Six-fragment chain is logically watertight; no contradiction between machine behavior and world facts | 6 | `fell_to` cascade edges on active machines is an internal contradiction; four-fragment mystery is abbreviated |
| CAUSAL/STRUCTURAL DEPTH | 9 | Origin → faithful execution → copy drift → Tally branches to audit → divergence → diversion: complete arc | 7 | Same causal story with fewer steps; Still-Cells Seer is a nice structural detail; Spindle Cohort adds one more arm |
| THEMATIC RICHNESS | 9 | No-negotiation rule seals the world; feedstock-economy as shared resource; rim-silhouette as unknown instrument | 7 | Same themes with slightly less development; ctx-the-clock and ctx-the-lever are lean but effective |
| NOVELTY/SURPRISE | 8 | "The only way to communicate is to author a valid work-order" is genuinely novel; Quiet Foundry is eerie | 7 | Still-Cells Seer asking "why" is the one fresh element; otherwise closely parallels A |
| DRAMATIC POTENTIAL | 9 | Deepwell-listing gives hard deadline; Jana vs Rho is genuine strategic conflict; Intake Gate Tertius as action target | 8 | Same arc, same characters; ctx-the-clock adds urgency; Spindle Cohort at Intake Gate is present |

**A total: 44 | B total: 35**

**Winner: A** (significant advantage; cleaner mystery, no structural contradiction, richer lore development)

---

## Theme 5: time-war

### World A — Graph Analysis

**Structure:** Three factions (Aelthar as downstream fighters, Cessation as retroactive erasers, Witnesses as precognitive archivists), three human characters (Cartographer Okonkwo, Quartermaster Reyes, Surveyor Dane), five mystery fragments. One open arc (`the-verdict`).

**Mystery chain:** The `order` field runs [war-is-still-being-decided, witnesses-archived-every-ending, tenses-collapsed, cessation-revised-the-opening, aelthar-struck-from-downstream]. The `precedes` relation in edges runs INVERSE — deliberate temporal inversion: reader-experience order vs. narrative-truth order are opposed by design. Elegant meta-structure.

**Artifact-lore links:** Medal drops aelthar-struck-from-downstream, medal-rewards-the-unfought, precognition-is-the-war-pressing-through. Envoy's Older Skull drops tenses-collapsed, envoy-was-sent-before-his-senders, precognition. Eraser Stone drops cessation-revised-the-opening, eraser-rewrites-your-finds, treaty-proves-deleted-peace, aelthar-may-never-have-been, ledger-is-not-neutral. Witness's Final Account drops witnesses-archived-every-ending, account-has-three-endings, precognition. Treaty-signed-by-the-dead drops treaty-proves-deleted-peace, account-has-three-endings, envoy-was-sent-before-his-senders. First-shot-that-came-last drops war-is-still-being-decided, first-shot-is-the-last-find, aelthar-struck.

**Key design breakthroughs:**
- `lore/eraser-rewrites-your-finds` — reading the Eraser Stone changes catalogue entries the expedition already made. The meta-loop of past discoveries being revised in real time.
- `lore/the-war-is-still-being-decided` — the capstone: sequencing IS the firing. The expedition has joined the war by sorting it.
- Three incompatible endings in the Witness's account.
- Treaty-signed-by-the-dead proving a peace that was edited away.
- Eraser Stone hidden AT the Ledger Vault (inside the camp's own record-keeping site) — the sabotage is already inside.

**Human grounding:** Surveyor Dane remembering the expedition's OWN ending via precognitive leak is a strong personal horror hook. Okonkwo's wall chart that reorders itself is tactile and specific. The Ledger becoming a battlefield (`ledger-is-not-neutral`) makes the conflict immediate.

**Weaknesses:** The mystery `order` and `precedes` edges appear inverted relative to each other — deliberate by design but could confuse on inspection. Some excellent side lore (envoy-was-sent-before-his-senders, medal-rewards-the-unfought) is not in the main five-fragment mystery chain.

### World B — Graph Analysis

**Structure:** Three factions (Erevan, Undated, Oncewill) with the same conceptual roles as A. Three human characters. Six artifacts. Five mystery fragments. One open arc.

**Mystery chain:** war-runs-backward → undated-answered-by-editing → cause-and-effect-came-unpinned → oncewill-archived-the-endings → war-has-not-finished-happening. Same five conceptual beats as A with different naming.

**Artifact-lore links:** Oncewill relic-4 drops war-runs-backward, oncewill-remember-forward, first-find-was-the-ending. Oncewill effect-before-cause-10 drops oncewill-archived-endings, effect-before-cause-is-evidence, precognition-is-bleed. Undated relic-18 drops undated-answered-by-editing, edit-stone-remembers-deletions, reply-fits-no-question. Oncewill effect-before-cause-20 drops reply-fits-no-question, oncewill-remember-forward, precognition-is-bleed. Undated anachronism-24 drops cause-and-effect-came-unpinned, anachronism-predates-its-maker, edit-stone-remembers-deletions. Undated anachronism-37 drops war-has-not-finished-happening, last-find-unmakes-order, anachronism-predates-its-maker, the-colony-is-a-move.

**Key design insights:**
- `lore/anachronism-predates-its-maker` — the Undated may have authored the Erevan to have an enemy worth editing. The counterforce created its own enemy to make the war possible. Deepest causal idea in either version for this theme.
- `lore/the-reply-fits-no-question` — two finds that look like nonsense in the wrong order become a confession in the right one. Literalizes the precedes mechanic elegantly.
- `lore/the-colony-is-a-move` and `last-find-unmakes-order` — holding the final artifact teaches there was no 'last' at all.
- Present event: Director Vash racing to reach the final anachronism before the Undated can un-find it. Tighter pressure than A's more abstract verdict.

**Weaknesses:** The named alien factions (Erevan, Undated, Oncewill) are slightly less vivid than A's (Aelthar = downstream fighters; the concept-names in A carry more implicit story). Precognitive-leak lore is slightly thinner. A's three-ending account and the eraser-rewrites-your-live-catalogue mechanism are more developed. Procgen seams visible (numbered figures: undated-seer-1, undated-seer-27).

### Scores

| Criterion | A | A rationale | B | B rationale |
|---|---|---|---|---|
| COHERENCE | 8 | Temporal inversion is coherent by design; eraser at ledger vault is elegant; precedes vs order apparent inversion may confuse | 8 | Same conceptual structure; procgen seams (numbered seers) mildly visible; reply-fits-no-question is clean |
| CAUSAL/STRUCTURAL DEPTH | 9 | Six artifacts mapping to five mystery fragments; eraser-rewrites-finds is structurally recursive; all lore reachable | 9 | anachronism-predates-its-maker (Undated authored Erevan) is a deeper causal twist; six artifacts with non-redundant lore |
| THEMATIC RICHNESS | 9 | Three endings; war-exists-because-peace-was-deleted; ledger-is-not-neutral; surveyor remembers expedition's own ending | 8 | colony-is-a-move; last-find-unmakes-order; oncewill-remember-forward; slightly less layered |
| NOVELTY/SURPRISE | 9 | eraser-rewrites-your-finds in real time; treaty proving deleted peace; first-shot-recovered-last as war-decision | 9 | undated-may-have-authored-erevan; reply-fits-no-question; war reads palindrome (colony named Palindrome) |
| DRAMATIC POTENTIAL | 8 | Okonkwo wall-chart reordering; Dane remembering their ending; Cessation reaching to overwrite | 9 | Vash racing the Undated to the last anachronism before it's un-found; Tessmer answering questions before asked; explicit countdown day 1110 |

**A total: 43 | B total: 43**

**Winner: TIE** — both worlds achieve the same total. A leads on structural recursion (eraser-rewrites-finds) and lore density. B leads on the deepest single causal idea (Undated-authored-Erevan) and tighter present-layer pressure. Forced tiebreak: **A** — the eraser-rewrites-your-live-catalogue mechanism is the single most directly playable and distinctively surprising mechanic in either world for this theme.

---

## Summary Table

| Theme | A Total | B Total | Winner |
|---|---|---|---|
| the-living-marrow | 41 | 42 | B |
| first-contact-diplomacy | 41 | 44 | B |
| bio-symbiosis-horror | 41 | 42 | B |
| machine-successor | 44 | 35 | A |
| time-war | 43 | 43 | A (tiebreak) |

**Overall: B wins 3 themes, A wins 2 themes.**

B is the stronger system when its enrichment layer is firing well (first-contact, bio-symbiosis, living-marrow): structural breadth from the procgen skeleton combined with thematically sharp lore produces more politically layered factions and stronger present-layer urgency. A is stronger when it achieves a complete six-fragment mystery chain with tight causal logic (machine-successor) and when the pure-LLM form produces genuinely recursive structural ideas (time-war's eraser-rewrites-finds). A's machine-successor win is decisive (+9 points); B's other wins are all narrow (1–3 points).
