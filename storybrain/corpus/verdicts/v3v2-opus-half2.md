# Blind3 Verdicts — half2 (Opus)

Blind judge. Scoring 0-10 per axis: Coherence, Causal/Structural Depth, Thematic Richness, Novelty/Surprise, Dramatic Potential. Cast weighed explicitly into Richness + Dramatic Potential.

---

## Theme: generation-ship-identity

The two worlds share an IDENTICAL backbone — same factions (`civs/the-erased`, `the-redactors`, `the-refusers`), same 6-fragment mystery chain (`lore/the-hands-that-fit` → `lore/it-was-us`), same artifacts, same `arc/the-second-choice` climax, same prose. The ONLY material divergence is the cast layer, so judgment turns almost entirely on the colonists and their social web.

**Cast diff:**
- **A:** 6 colonists. Four living (`mara-okonkwo`, `tomas-vey`, `iris-sandoval`, `elder-juno`) carry full quantified `skills` dicts, `crew_role`, `passions`, and a pointed `want`. PLUS two ancestor-revenant colonists (`colonists/the-recorded-doubter`, `colonists/the-sleeper-of-the-erased`) — preserved makers who wire the deep-time backstory directly into the present cast, with `kin_of` edges back to `figures/first-doubter`. Social web is dense and arc-wired: `iris-sandoval lover_of mara-okonkwo`, `iris kin_of the-recorded-doubter` (she carries the line that cut the seal — pays off her `want`), `elder-juno kin_of iris` + `ally_of tomas`, `tomas grudge_against the-sleeper`. The ancestors `want` to be heard by a descendant; Iris's hand opens the vault. Causally closed loop.
- **B:** 4 colonists only. `skills` are bare string arrays (`["relic-reading","ancestral-memory sensitivity"]`) — no quantification, no crew_role, no `want`. No ancestor-colonists at all. Social web is thinner and partly incoherent: `tomas-vey threatens iris` AND `iris betrayed_by tomas` are near-redundant; `iris owns artifacts/the-mercy-vault` is an odd filler edge (you don't "own" a sealed ancestral vault you're trying to open). No lover_of, no kin lattice, ancestors absent.

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 8 | 7 | Identical lore = both coherent; B docked for `iris owns the-mercy-vault` (filler) + redundant threatens/betrayed pair |
| Causal/Structural Depth | 9 | 7 | A's `iris kin_of the-recorded-doubter kin_of first-doubter` closes the deep-time loop into the present hand; B drops the ancestor nodes that carry that causality |
| Thematic Richness | 9 | 8 | Shared lore is superb on both; A's `want` fields ("read 'It Was Us' aloud whatever it costs her" vs Tomas's "re-seal before the chain completes") sharpen the central identity dilemma |
| Novelty/Surprise | 8 | 8 | Same surprises (the self-erasure-as-mercy premise, "the makers are us") — tie on shared content |
| Dramatic Potential | 9 | 6 | A's live web — lover/rival/kin/grudge + two waiting ancestors keyed to Iris's hand — is a vastly richer scene engine than B's flat 4-person triangle |

**A total: 43 / B total: 36 — WINNER: A**

Rationale: Worlds are clones above the cast line; A wins decisively on the cast. A's colonists have fitting quantified skills (`iris` engineering 19 / eva 17 = "the hand that cracks vaults"), pointed conflicting wants, and a social lattice that literally closes the mystery's deep-time loop (`iris kin_of the-recorded-doubter`, the ancestor she descends from cut the seal she must open). B strips skills to strings, deletes the ancestor-revenants, and pads with a redundant/illogical edge pair (`threatens`+`betrayed_by`, `owns` a vault). Same story, half the dramatic machinery.

---

## Theme: megastructure-absent-architects

Same pattern: identical megastructure backbone — three nested absent civs (`civs/the-architects` builders → `civs/the-keepers` caretakers → `civs/the-listeners` prior inheritors), the gorgeous "banked, not abandoned / the shell is an outward EMITTER / the purpose was DEPARTURE / the core fires ONCE" 5-fragment chain, the keyed location ladder (outer ring → cradles → mid-rings → spire → codex → core), and the `arc/turn-the-last-key` dilemma with branching `next_beat_if_pressed`/`if_held`. The structure here is excellent in BOTH (the `enables` artifact-chain mirroring the `enables` lore-chain is a clean dungeon-as-argument design). Divergence is again the cast.

**Cast diff:**
- **A:** 4 living colonists with full quantified `skills`, `passions`, `crew_role`, AND a sharp `want` distinct from `drive` (e.g. `archivist-sole` want: "publish the Listeners' refusal in full so the colony votes to leave the core unturned"; `engineer-davies` want: "restore mid-ring current before the winter-side modules drop below survivable temperature" — a third, survival-pressure axis between Rust's zealotry and Sole's caution). PLUS two trace-colonists: `keeper-steward-echo` (a Keeper log-personality that `want`s an inheritor to confirm aloud the rings were banked on purpose) and `architect-purpose-construct` (a maintenance machine that recites the makers' intent and lets the finder choose). These turn the absent civs into interactive present voices. Dense social web: `keyfinder-rust lover_of engineer-davies` (and `davies wants arc` — the romance is wired across the central split, since Rust wants to fire and Davies just wants heat), `mara kin_of archivist-sole`, `rust owes mara`, `sole grudge_against davies`, `sole ally_of keeper-steward-echo` (archivist allied with the caretaker-trace who also wants restraint — thematically perfect).
- **B:** Same 4 colonists but stripped to `role`+`drive` only — NO skills, NO want, NO crew_role. NO trace-colonists (both `keeper-steward-echo` and `architect-purpose-construct` deleted, so the absent civs stay fully mute). Social web is just `rust rival_of sole` + the two opposed beliefs + a filler `archivist-sole sought_by keyfinder-rust` edge that means little.

**Filler/contradiction trace:** A has one genuine contradiction — `keyfinder-rust rival_of architect-purpose-construct` AND `architect-purpose-construct ally_of keyfinder-rust` (asymmetric/contradictory pair on the same dyad). Minor, costs A ~1 coherence point. B has the vague `archivist-sole sought_by keyfinder-rust` (sought for what? unmotivated). B also drops `lore/keeper-echo-still-answers` and `lore/construct-kept-the-lights-on` since their referent colonists are gone — internally consistent, but a thinner world.

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 8 | 8 | B slightly cleaner (no rival/ally contradiction); A docked for the rust↔construct asymmetric pair |
| Causal/Structural Depth | 9 | 8 | Shared `enables`-chain is superb in both; A's trace-colonists add a second interaction layer onto the absent civs |
| Thematic Richness | 9 | 7 | A's `keeper-steward-echo` (wants confirmation the rings were banked ON PURPOSE) + `architect-purpose-construct` (recites intent, refuses to decide) deepen the "absent but speaking" theme; B leaves the makers silent |
| Novelty/Surprise | 8 | 8 | Same core reveals (emitter / departure / fires-once) — tie |
| Dramatic Potential | 9 | 6 | A's wired romance-across-the-split (rust/davies), the third survival axis (Davies' freezing modules), and the trace-voices give a director far more to stage; B is a flat two-creed debate |

**A total: 43 / B total: 37 — WINNER: A**

Rationale: Identical world-skeleton and an equally strong mystery; A wins on cast depth and the two trace-colonists that make the absent architects/keepers actually present in scenes. A's `want` fields create a genuine three-body problem (fire it / refuse it / just keep us warm), and the `rust lover_of davies` edge stretches the romance across the central fault line — exactly the kind of arc-wired social web that scores. B keeps the structure and beliefs but guts the people: no skills, no wants, no traces, leaving a clean but inert debate. A's lone cost is one contradictory rival/ally dyad.

---

## Theme: extinction-plague-vector

This is the widest A/B gap of the half. Shared backbone: the "they SEALED rather than died" twist (`factions/the-cradlekeepers` makers + `the-stillborn-host` carriers + `the-vector` biological-memetic plague), the ordered seal protocol (`proof → identify → trigger → keystone → assemble`, `order_relation: prerequisite`), the brilliant `which-vault-holds-which` ambiguity (open a vault and you wake an ally OR the outbreak), and the live `arc/the-containment-race` with a salt-clock. But the two worlds diverge HARD on three axes at once: cast, dropped lore, and even the `drops`-graph fidelity.

**Cast diff (decisive):**
- **A:** 7 colonists. Five humans (`mara-okonkwo` containment-lead, `devrant-isk` reckless relic-runner, `ilse-vantar` glyph-translator, `the-archivist-soren`, `halden-ree` vault-warden) with full quantified `skills`, `passions`, and a sharp `want`. PLUS — and this is the killer feature — TWO sleeper-colonists that turn the dormant factions into actual characters: `the-sleeper-vael` (a Cradlekeeper sealed mid-protocol, `want`: "wake into hands that read the cold-glyph first, so she can finish the seal she sealed herself behind") and `the-quarantined-tsenn` (a Stillborn Host survivor whose `want` is "to be let sleep — every stir toward consciousness is the strain reaching for a body"). Tsenn is the single most haunting node in the half: the monster that begs not to be woken. The social web is dense AND arc-wired: `devrant lover_of ilse` (and ilse is `threatened_by the-vector` because she reads glyphs — the romance is hostage to the central danger), `devrant owes halden-ree`, `the-archivist-soren kin_of ilse` + `soren ally_of the-sleeper-vael` (the archivist who wants to wake a maker is allied with the dormant maker), `halden-ree grudge_against soren` + `grudge_against the-quarantined-tsenn` (the warden's hatred of the thing he guards), `mara rival_of the-sleeper-vael`. Every edge is motivated by the seal dilemma.
- **B:** Only 4 thin human colonists (`mara`, `devrant`, `ilse`, `soren`) — NO skills, NO want, just role+stance. NO sleeper-colonists at all (both Vael and Tsenn deleted), so the dormant factions are pure abstractions with no face. NO `halden-ree`. Social web collapses to a single `devrant rival_of mara` edge plus the structural ones.

**Dropped-lore diff:** A carries SIX flavor-lore nodes that thicken the world — `the-wired-sample-chamber` (read the deck but never pry the housing), `the-host-lines-confession` (the host volunteered to be carriers so the makers could study the strain — gut-punch backstory), `the-held-condition` (a temperature, a cadence, a refusal to read aloud), `the-unset-lattice`, `the-out-of-order-clause` ("do the steps out of order and you do not fail the seal, you reseed the strain"), `which-vault-holds-which`. B drops ALL SIX. They're not decoration: the out-of-order clause is the mechanical spine of the whole fail-state, and B simply omits its textual statement.

**Drops-graph fidelity (B regression):** A's `drops` edges mostly respect the prerequisite ladder (e.g. `the-failed-trial-deck drops proof` + flavor, not future steps). B's `drops` edges are scrambled forward — `the-failed-trial-deck drops proof AND identify AND find-the-dormancy-trigger`, `the-sealwrights-recipe drops proof` (step 0 from the final recipe?). With the flavor-lore deleted, B back-filled the drop-slots with out-of-sequence fragments, muddying the "discover in order" design that the `prerequisite` chain promises. Minor filler in both: the `X sought_by artifact` edges (`mara sought_by the-sealwrights-recipe` in both; A also `ilse sought_by the-vector`) are slightly awkward but thematically readable in A (the vector hunts the reader).

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 8 | 7 | A's drops respect prerequisite order; B's are scrambled forward (`trial-deck drops trigger`, `recipe drops proof`) |
| Causal/Structural Depth | 9 | 7 | Same `prerequisite` chain, but A's sleeper-colonists + 6 flavor nodes wire far more cross-links; B is the skeleton only |
| Thematic Richness | 9 | 6 | A's `the-host-lines-confession` (volunteered carriers) + Tsenn's "let me sleep" + the held-condition flavor make the plague tragic; B states only the bare mechanics |
| Novelty/Surprise | 9 | 7 | The "wake an ally OR the outbreak, and the ledger is scrambled" core is in both; A's `the-quarantined-tsenn` (the monster pleading to stay asleep) is a genuine fresh image B lacks |
| Dramatic Potential | 9 | 5 | A's wired web (lover-hostage-to-vector, warden-hates-his-charge, archivist-allied-with-sleeper) + two playable sleepers vs B's lone rival edge and faceless factions |

**A total: 44 / B total: 32 — WINNER: A (decisively)**

Rationale: Same premise, but A is a populated, textured world and B is its wireframe. A's two sleeper-colonists (`the-sleeper-vael`, `the-quarantined-tsenn`) convert the dormant factions into the cast's most dramatic pieces — the ally who can teach the seal and the carrier who begs to stay under — and the human social web is fully motivated by the seal dilemma (the translator-lover the vector targets, the warden who hates what he guards). B deletes both sleepers, all five extra humans' skills/wants, all six flavor-lore nodes, AND scrambles its `drops` ordering to back-fill the emptied slots. Widest gap in the half.

---

## Theme: crowded-trade-federation

Best mystery-design of the half on the shared layer — a market-fraud thriller where five LIVING houses (`the-vossan-syndics` forgers, `the-khariti-drift` honest-memory nomads, `the-oseni-assayers` bribable authenticators, `the-melun-cartel` counterfeit-flooders, `the-rho-collectors` purity-obsessed hoarders) all converge on `events/the-contested-deal`. The 4-fragment chain (`amber-was-never-mined → seal-can-be-unmade → relic-is-honest-paper-is-not → drift-knows-the-real-source`, `order_relation: precedes`) lands a genuinely good escalating reveal: the founding forgery, the seal that can undo it, the honest-object-in-a-lying-wrapper, and the kicker — the amber's "source" is ALIVE. Causal event-chain is clean in both (`caused_by` ladder day 100→400). Divergence is, once more, the cast plus B regressions.

**Cast diff:**
- **A:** 6 colonists, each holding one link of the chain. Four humans (`mara-osei-vance` log-holder, `dev-haldane` Cartel-payroll rival, `sable-ferreira` confession-smuggling fixer, `quen-arden` estranged Rho agent) with full quantified `skills`, `passions`, `crew_role`, and pointed `want`s that conflict (Mara wants to sell the log ONCE; Haldane wants to BURN it). PLUS two alien faction-colonists who are exactly the figures the lore names: `iruwe-sael` (the Khariti navigator who broke custom and wrote the songs into the route-log — `want`: settle her debt before the caste erases her name) and `voss-tahel` (the dissident Oseni on the confession cylinder — `want`: "re-strike the master seal on the TRUE chain just once before her caste catches her, to die having told the truth in metal"). These two convert two beautiful lore beats (`oseni-schism`, `khariti-leak-the-log`) into living stakes. Dense, motivated web: `quen-arden lover_of sable-ferreira` (and Quen's want includes "before Sable is killed for the matching half" — romance wired to the plot), `mara owes iruwe-sael` (the debt that motivated the leak), `dev-haldane betrayed sable-ferreira`, `voss-tahel ally_of sable`, `iruwe grudge_against haldane`, `voss-tahel rival_of iruwe`. Every relationship maps to a chain-link transaction.
- **B:** Only the 4 human colonists, stripped to `name`+`role`+`stake` — NO skills, NO want, NO crew_role. Both alien faction-colonists (`iruwe-sael`, `voss-tahel`) deleted, so the dissident assayer and the rogue navigator exist only as faceless lore. Social web thins to `dev rival_of mara`, `sable betrayed_by dev`, plus structural ownership.

**B regressions (multiple genuine bugs):** B has THREE malformed/contradictory edges A does not. (1) `mara-osei-vance owns factions/humans` — a colonist "owns" her own faction; should be `member_of` (A has it right). (2) `civs/the-rho-collectors sought_by quen-arden` — direction reversed; the house seeks its estranged agent, not vice-versa (A correctly has `quen-arden sought_by the-rho-collectors`). (3) the final edge `[arc, involves, quen-arden]` is missing its timestamp element — a structural malformation. Plus B's `drops` graph is scrambled: every artifact drops nearly every fragment regardless of `precedes` order (the Vossan scroll "drops" `seal-can-be-unmade` AND `relic-is-honest`, the route-log "drops" `amber-was-never-mined`), collapsing the discover-in-order design. A's `drops` are disciplined: the scroll drops only the first fragment + Syndic color, the route-log drops the source-reveal + Drift color.

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 9 | 6 | B has 3 broken edges (`mara owns humans`, reversed `rho sought_by quen`, timestamp-less arc edge) + scrambled drops; A is clean |
| Causal/Structural Depth | 9 | 7 | Same event `caused_by` ladder; A's `drops` respect `precedes`, B's don't; A's 2 faction-colonists add cross-faction links |
| Thematic Richness | 9 | 7 | A's 6 color-lore (`syndic-ink-never-fades` = "trapped in their own first lie", `assayer-oath` = "a seal is the caste's word made metal", `ledger-salt-balances-every-book") thicken a fraud economy; B drops all six |
| Novelty/Surprise | 8 | 8 | Same killer reveal (the source is alive; the honest relic in a forged wrapper) — tie on shared content |
| Dramatic Potential | 9 | 5 | A's `voss-tahel` ("die having told the truth in metal") + the lover-hostage + the debt that caused the leak give a heist-thriller cast; B is four nodes with stakes-lines and two edges |

**A total: 44 / B total: 33 — WINNER: A (decisively)**

Rationale: Excellent shared market-fraud mystery, but A is the only one that's actually clean AND populated. A turns the two pivotal lore figures (the rogue navigator, the dissident assayer) into playable colonists with the half's best single `want` line ("to die having told the truth in metal"), wires a full debt/romance/betrayal web onto the four chain-links, and keeps its `drops` graph faithful to the `precedes` order. B strips skills/wants, deletes both faction-colonists and all six color nodes, scrambles its drops, and ships three malformed edges (a colonist owning her own faction, a reversed sought_by, a timestamp-less arc edge). On a fraud story whose whole point is custody-chain fidelity, B's own graph integrity is the casualty.

---

## Theme: uplift-nursery-world

The reversal of the half: here B is the cast-rich world and A is the thin one. Shared backbone (excellent in both): the Gardeners are PRESENT and acting (`civs/the-gardeners` hidden-stewards + `civs/the-loam-tenders` undercaste + `civs/the-first-cultivars` the prior lineage "harvested, not killed — taken UP"), the 5-fragment `reveals` chain climaxing on `frag-we-are-the-next-row`, the artifact `enables` ladder ending on `the-attention-bell` (ringing it CALLS a harvest), and the opposed creeds (`grateful-guest` vs `fallow`). The horror premise — gentleness as cultivation, the bell as a reaping signal — is equally strong in both.

**Cast diff (B wins it):**
- **A:** ALL colonists are thin. The four humans (`steward-imani-bayode`, `seedwright-cole-vance`, `reader-noor-haddad`, `midwife-tomas-reyes`) carry only `role` + `drive` — NO skills, NO want, NO passions. The two alien trace-colonists (`the-first-cultivar-elder`, `the-loam-tender-near-hand`) have just role+civ. Social web is sparse: `cole rival_of noor`, the two opposed beliefs, and one dangling `midwife sought_by the-loam-tenders` with no payoff. No native-born-child node despite the arc note ("the colony's first native-born children are testing ripe").
- **B:** ALL colonists fully fleshed — quantified `skills`, `passions`, `species`, AND a pointed `want` on every one (including the two alien traces: the elder `want`s "to finish singing the steps of the growing so the next row knows what it is being grown into before the bell sounds"; the loam-tender `want`s "to leave just enough of itself half-glimpsed that a clever guest finds the truth before ripening"). And B adds the single best node across BOTH halves of this theme: `figures/the-ripening-child` — the midwife's loom-bent native-born daughter, `faction: civs/the-gardeners`, "born human on the terraces... her parents see their daughter, the shrines read a finished cultivar — the Gardeners' newest product wearing a colonist's face," whose `want` is "to follow the warm pull toward the shrines... not understanding it is a harvest calling her home." That node makes the abstract "we are the next row" reveal personal and devastating. B's web is correspondingly dense and tragic: `midwife kin_of the-ripening-child`, `the-loam-tender-near-hand saved midwife` + `midwife owes` it (the undercaste already intervened), `cole lover_of imani` + `imani owes cole`, `reader-noor ally_of midwife`, `the-first-cultivar-elder ally_of noor` (the harvested voice allied with the refuse-to-ripen creed), `civs/the-gardeners ripens the-ripening-child`.

**Filler/contradiction trace:** B has redundant symmetric duplicate edges — `cole rival_of noor` AND `noor rival_of cole`; `midwife kin_of child` AND `child kin_of midwife` (kin/rival are inherently mutual, so the back-edge is filler). Also `noor grudge_against cole` co-exists with the `rival_of` pair (slightly piled-on, but readable). These are cosmetic, not contradictions. A's only blemish is the dangling unpaid `midwife sought_by the-loam-tenders` and the absence of the child the arc explicitly promises.

| Axis | A | B | Note |
|---|---|---|---|
| Coherence | 8 | 7 | A cleaner edge-wise; B has duplicate symmetric `rival_of`/`kin_of` pairs (filler) |
| Causal/Structural Depth | 8 | 9 | Same `reveals`+`enables` chains, but B's `the-ripening-child` + `gardeners ripens child` + the saved/owes loop add live causal hooks A leaves abstract |
| Thematic Richness | 7 | 9 | B's `the-ripening-child` ("the Gardeners' product wearing a colonist's face") and the elder's lullaby-want embody the uplift horror; A states it only in lore |
| Novelty/Surprise | 8 | 9 | Both share the reveal; B's child-who-is-already-harvest-ripe is a fresh, specific image that personalizes the twist |
| Dramatic Potential | 6 | 9 | A's thin cast (role+drive, one rival edge) vs B's wired family tragedy: a father who owes the undercaste that saved him, a daughter being called home to a harvest, a lover-steward who must ring or refuse the bell |

**A total: 37 / B total: 43 — WINNER: B**

Rationale: The lone theme where the richer cast sits on the B side, and it wins for exactly the reasons A won the other four. B fleshes every colonist with skills + a conflicting `want`, gives the two hidden castes interactive voices, and — decisively — adds `the-ripening-child`, the loom-bent daughter who reads as a finished Gardeners' cultivar while her parents still see their child. That single node turns "we are the next row" from a lore claim into a family in crisis, and the surrounding web (the midwife's debt to the undercaste that saved him, the harvested elder allied with the fallow creed, the lover-steward holding the bell) is fully motivated by the harvest dilemma. A keeps the same superb mystery but populates it with role+drive stubs, omits the child the arc itself promises, and leaves one social edge dangling. B's only cost is a few redundant mirror-edges.

---

## Summary

| Theme | A total | B total | Winner |
|---|---|---|---|
| generation-ship-identity | 43 | 36 | A |
| megastructure-absent-architects | 43 | 37 | A |
| extinction-plague-vector | 44 | 32 | A |
| crowded-trade-federation | 44 | 33 | A |
| uplift-nursery-world | 37 | 43 | B |

Pattern: in 4 of 5 themes the two worlds share an identical lore/mystery backbone, and the winner is decided entirely by which side carries the fleshed cast — quantified skills, pointed `want`s, extra alien/ancestor/trace colonists, and an arc-wired social web (lover/kin/owes/grudge/ally). That richer cast is on the A side in themes 1-4 and on the B side in theme 5; in every case it took the theme. The thin variant repeatedly strips skills to bare strings or omits them, deletes flavor-lore and faction-colonists, and tends to introduce filler or malformed edges (`owns` own-faction, reversed `sought_by`, a timestamp-less edge, scrambled `drops` ordering).
