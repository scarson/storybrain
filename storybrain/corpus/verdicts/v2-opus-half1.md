# Blind2 Judging — Opus, Half 1

Blind judge of generated sci-fi game worlds. Story = the graph. Scoring 0-10 on
COHERENCE, CAUSAL/STRUCTURAL DEPTH, THEMATIC RICHNESS, NOVELTY/SURPRISE, DRAMATIC POTENTIAL.

---

## Theme 1: the-living-marrow

Both worlds share an identical premise: dark "ore" is the dormant nerve-marrow of a
planet-organism; the crystalline Velt mined it, the psychic Choir tried to sing the wound
down, the planet learned their frequency and the cascade vitrified everyone; humans
(Drosselmeyer charter) now sit on the largest seam. The mystery is the same 5-step
`caused_by` chain (marrow-was-alive → extraction-was-amputation → the-wound-sang →
choir-tried-to-sing-it-down → cascade). So this comes down to which graph builds the more
complete, dramatic, surprising *machine* around that shared spine.

**World A** is the richer build by a wide margin:
- A **fourth civilization** (`civs/the-pale-wing`, augur-merchants who *sold tickets to the
  apocalypse*) — fully integrated with its own event (`events/the-pale-wing-sells-the-doom`),
  artifact (`artifacts/the-pale-wing-ledger`, "the last entry is unsold"), and lore
  (`lore/the-pale-wing-knew-and-sold-it`). A genuinely novel, thematically pointed addition
  (complicity / profiteering on doom) absent from B.
- A **dated event timeline** (`events/the-first-bore` day 100 → `events/the-waking-of-the-wounded-world`
  day 700) with explicit `caused_by` edges between events, plus a flagged pivot
  (`is_pivot: true`) whose text recapitulates all three civ fates in one instant. B has NO
  event nodes at all — its history exists only as lore prose, never as causal structure.
- A **present-day arc** (`arc/the-second-waking`) with present_stakes / win_condition /
  fail_state / next_beat_trigger — the colony drill is days from re-cutting the seam,
  literally repeating the original mistake under a human town.
- **Four live colonists** with opposed stances driving that arc: `director-imre-vask`
  (drill on schedule, shard rewiring his desires), `archivist-soln` (knows the truth, can't
  stop him — `rival_of` Vask), `drill-chief-bren-okafor` (`betrayed_by` Vask), and
  `the-listener-yuki` (going resonant-sensitive, `races_to_stop` the arc, `sought_by` the
  Choir). This is a complete dramatic engine.

**World B** is essentially A's lore-and-relic layer with the present-tense machinery stripped
out. It keeps the Velt, Choir, locations, the same 7 artifacts, and an overlapping lore set,
and adds `powers/resonant-sympathy` + `powers/lithomancy` plus `grants`/`sought_by` edges and
two extra lore fragments (`lore/the-choir-had-no-bodies`, `lore/the-velt-built-the-engine-too-late`).
But: no events, no timeline, no arc, no live cast, no antagonist, no clock. `figures/archivist-soln`
is an inert flavor node (one note, no stance, no edges into any conflict). Its mystery block even
omits `order_relation`. B is a well-furnished museum; A is a museum with a bomb ticking in it.

Minor knock on A: a couple of mild redundancies (`reveals` and `caused_by` lore both restate the
cascade; the shard/codex both drop `extraction-was-amputation`) — but these are convergent
multi-source corroboration, not dead filler. B has its own near-duplicate
(`the-velt-built-the-engine-too-late` vs `silence-is-borrowed`).

| Axis | World A | World B |
|---|---|---|
| Coherence | 9 — events, lore, arc all interlock; pivot text matches the 5-step chain; colonist roles map cleanly onto the original civ roles | 8 — clean and consistent, but no event layer to keep honest; mystery lacks `order_relation` |
| Causal/Structural Depth | 10 — dual causal spine (event `caused_by` chain + lore `caused_by` chain) plus arc next_beat wiring into the pivot | 6 — only the 5-link lore chain; history is prose, not structure; no present-day causality |
| Thematic Richness | 9 — addiction-as-golden-age, complicity-for-profit (Pale Wing), borrowed silence, "they paved their graves" | 8 — same core themes, powers add a psychic-inheritance angle, but lighter without the Pale Wing |
| Novelty/Surprise | 9 — Pale Wing selling apocalypse tickets; planet answering in stolen voices; shard rewriting the director's desires | 7 — strong shared images but no surprise B owns alone; powers are conventional |
| Dramatic Potential | 10 — ticking drill, turncoat director, racing listener, betrayed chief: a playable crisis right now | 5 — all backstory; nothing in the present demands action; no antagonist, no clock |
| **Total** | **47** | **34** |

**WINNER: World A** — A wraps the shared lore in a fully-wired present-day crisis (events,
arc, live opposed cast, a fourth complicit civilization); B is the same lore with the drama
and the timeline removed.

---

## Theme 2: first-contact-diplomacy

Shared premise (and a strong one): living elder aliens vet a young human delegation/colony by
lending technology one piece at a time; each gift is *both* a moral test and a physically
encoded bearing to a buried cache; a hard-line splinter faction salts/forges the gifts to make
humanity convict itself; a neutral mediator caste adjudicates a misread. Same mystery shape (a
`reveals`-chain ending in the truth about what the vetting is *for*). This is the closest matchup
of the five — both are genuinely strong builds, differing in where they invest.

**World A** (the-suhl / Aperture Wardens) — invests in *concrete, morally-specific gift design*:
- Each lent gift carries a distinct, vivid ethical test rather than a generic "worthiness"
  label: `the-listening-bead` (warms to honesty, cools at a lie — "use it to listen or to
  interrogate"), `the-folding-lens` (resolves only when two hold it — cooperation made
  physical), `the-empty-cup` (fills only when offered to another first; the Wardens' salted
  version fills when *grasped*, convicting the grasper). This is the diplomacy literally
  encoded into objects.
- A real terminal twist: `lore/the-vetting-is-a-mirror` (via `the-ninth-ledger`) — the Suhl
  don't vet to filter the unworthy; every species that opens the caches *gains the power to vet
  the next*, so they're choosing their own successors-and-judges. "Test whether you'd become a
  fair gatekeeper, not merely a worthy guest." Genuinely surprising and recontextualizing.
- Superb supporting texture: `the-eighth-witness` (a mute living survivor of the prior failed
  species — "what 'refused' looks like: alive, present, forever outside the table"), Arbiter
  `uun` who *scores the pause, not the error*, the doctrine `beliefs/the-reach-is-the-answer`
  ("we watch how you reach"), and `vossa-watches-the-first-ten-seconds` (instinct is the exam).
- Weaknesses: no formal `arc`/`event` nodes — present-day stakes live in lore + figure placement
  (Idris at the salt-flat road) rather than a dedicated arc structure. A few malformed edges:
  `civs/the-suhl owned_by artifacts/the-ninth-ledger` (inverted) and
  `the-eighth-witness rival_of warden-thren` (a mute gallery survivor as the saboteur's rival
  is a stretch). The lore `reveals`-chain is also somewhat artificial (clue order ≠ logical
  reveal order).

**World B** (the-irenni / Saalvane / Mendicant) — invests in *present-tense dramatic machinery*:
- Cleanest formal spine of the two: an explicit `arc/the-race-to-the-lattice-vault` (phase,
  stakes, next_beat_event, resolution: undecided), a paired event timeline
  (`first-contact-the-first-gift-lent` → `the-first-cache-earned-open`, `culmination: true`),
  and a full faction triad with `splintered_from` wiring the Saalvane to the Irenni.
- A real ideological engine: opposed `beliefs/the-earned-open-creed` vs `beliefs/the-take-it-creed`,
  `held_by` rival figures (Mara vs decoder Jonas Rhee, `rival_of`, `opposes`). The internal human
  split (earn it honestly vs crack it before the rival seals it) is the live dilemma and it's
  fully structured.
- Weaknesses: the gifts are *functional, not moral* — `lattice-lantern`, `triangulating-token`,
  `worthiness-stylus` test "use it correctly" but lack A's specific ethical signatures (no
  cup-that-empties-when-grasped equivalent). No terminal twist: the climax fragment
  `frag-earn-the-open` is "earn the open," a restatement of the premise rather than a reveal.
  Some near-duplicate lore (`two-bearings-fix-a-cache`, `the-stylus-grades-the-hand` largely
  restate node facts). One odd edge: `quartermaster-lena-vasquez betrayed_by the-corrupted-gift`
  (an object as betrayer).

| Axis | World A | World B |
|---|---|---|
| Coherence | 8 — premise fully realized; a couple inverted/strained edges (suhl←ledger, witness rival warden) cost it | 9 — arc/events/beliefs/factions all interlock tightly; minor object-as-actor edge |
| Causal/Structural Depth | 8 — rich figure web + lending sequence, but no arc/event scaffolding; reveals-chain is loose | 9 — explicit arc + culmination event + splintered_from + opposed-belief engine |
| Thematic Richness | 10 — diplomacy carved into specific objects (bead/lens/cup); reach-is-the-answer; refusal = forever-outside-the-table | 8 — strong themes (earn vs take) but gifts are generic, theme carried by prose not object design |
| Novelty/Surprise | 10 — the "successors-and-judges" mirror twist + the living mute Witness are real surprises | 7 — well-executed but no twist; the splinter/forgery beats are the expected ones |
| Dramatic Potential | 9 — Uun-scores-the-pause, salted cup, Witness in the gallery: enormous playable tension despite no arc node | 9 — explicit undecided arc, racing scout, unflagged forgery, split delegation: a crisis you can play immediately |
| **Total** | **45** | **42** |

**WINNER: World A** (narrowly) — B has the cleaner formal scaffolding (arc, events, opposed
beliefs) and would be easier to run as-is, but A wins on the two axes that matter most for an
emergent storyteller: thematically-specific artifact design (the gifts ARE the diplomacy) and a
genuine terminal twist (vetting-as-choosing-your-successors). A's edges to clean up; B's lore to
de-duplicate. Both are top-tier; this is the one theme where B is a credible winner.

---

## Theme 3: bio-symbiosis-horror

Shared premise: a survey colony lives INSIDE a living planet-organism (the Green Cathedral /
Canopy Mind); its "tools" are grown organs that must be GRAFTED into the body to use, each graft
threading the host into an overt shared awareness; a Pale Ward immune-caste tests/rejects hosts;
the grafts form an ordered set that, completed, makes a host into the Cathedral's "first whole
voice." Same mystery: a 5-fragment `prerequisite` chain. Both builds are strong; they split on
*where* the symbiosis-horror actually lands.

**World A** (Canopy Mind / arc-the-last-graft) — invests in a *live present-tense dilemma*:
- A fully-wired `arc/the-last-graft`: `recruit-sana-reyes` is one graft from completing the set,
  the `canopy-communion-node` has "gone ripe in the heartwood," and the colony can't agree to let
  her, stop her, or take her place. `resolution: undecided`, `next_beat_event: the-communion`.
- A genuine opposed-belief engine: `beliefs/the-communion-creed` (Mira: "a gift, not a death")
  vs `beliefs/the-single-self-creed` (Elias: "a completed host is no longer the person who
  consented"), `held_by` rival figures, with Elias `resists` / Mira `urges` / first-whole-host
  `threatens` / Sana `must_decide` all wired onto the arc. This is a playable crisis right now.
- The graft-set is a clean `prerequisite` chain (spore→organ→graft-seed→spore-tool→marker→node).
- Weakness — and it's the decisive one for THIS theme: the grafts are abstractly named
  (`the-shared-sense-grown-organ`, `the-deep-reach-spore-tool`) and the *body-horror cost* is
  generic ("the body it enters is changed to fit it"; `grafts-do-not-come-out-clean`). The
  transformation is asserted in lore, not embodied in each artifact. The horror is told.

**World B** (Spore Cathedral / the-Editing) — invests in *the corruption ladder itself*:
- The standout feature of either world for this theme: each of the 6 grafts carries an explicit
  `graft_order` + a paired `boon` AND `edit` (the horror cost): `the-lung-of-listening` (1:
  "breathe spores without madness" / "you stop being able to be truly alone in your head"),
  `the-sap-tongue` (2: "speak the Cathedral's chemical language" / "human food turns to ash; you
  crave the sap"), `the-ward-eye` (3: "see as the Ward sees" / "you sort people accept/reject by
  instinct"), `the-lineage-marrow` (4: "seed the lineage" / "your private memories begin to be
  shared down the lineage"), `the-communion-node` (5), `the-whole-mark` (6: "the person who
  started hunting is gone — the Cathedral wearing them"). This is symbiosis-horror as a designed,
  escalating, *specific* ladder — every graft trades a named human limit for an alien capacity.
  A's grafts have no equivalent per-step cost.
- Superb supporting horror: `curse/the-editing` (a first-class node), `locations/the-rejection-cocoons`
  ("rejected hosts kept dreaming, half-folded into the wall"), `lore/lineage-bleed-note` (a child
  recalling a memory three hosts up the chain → `figures/the-three-up-grafter`), `ward-reject-record`
  ("forty skipped the Ward test, forty rejected"). A timestamped event chain (day 100→210) and a
  creed-war (`belief/the-rationing` vs `belief/the-becoming`, `becoming-vs-rationing`).
- Weaknesses: the present-tense is weaker — `event/the-communion` has already happened (past
  tense), there's no live undecided arc node like A's Sana; the first-whole-host is a fait accompli
  rather than a ticking threat. A couple of duplicate edges (`dr-ines-vallar bonds the-lung` listed
  twice). `sap-tongue-note` is dropped by both Lung and Sap-Tongue (minor over-spread).

| Axis | World A | World B |
|---|---|---|
| Coherence | 9 — arc/events/beliefs/prereq-chain interlock cleanly; very tight | 8 — coherent and timestamped, but a duplicated edge and lore double-drops; no live-arc capstone |
| Causal/Structural Depth | 8 — prereq chain + arc next_beat, but transformation cost is asserted not structured | 9 — prereq chain PLUS a per-graft boon/edit cost ladder + dated event timeline; deeper mechanical structure |
| Thematic Richness | 8 — the consent/erasure theme is strong but carried by belief prose | 10 — theme is built INTO every artifact (boon/edit), the Editing curse, the dreaming cocoons |
| Novelty/Surprise | 7 — strong but familiar hive-assimilation beats; surprise is the live dilemma | 9 — the specific edits (food turns to ash; sorting people by instinct; inherited memories) + half-folded dreaming cocoons are vivid and fresh |
| Dramatic Potential | 10 — Sana one graft out, Elias prepping a removal he may not survive, undecided NOW | 8 — rich, but the climax is in the past; the live tension (rationing creed) is present but not staged as an undecided beat |
| **Total** | **42** | **44** |

**WINNER: World B** (narrowly) — A has the better *staged* present-tense crisis (Sana's
undecided last graft, opposed creeds, a removal that may kill the surgeon) and would run as a
scene immediately. But for the symbiosis-HORROR theme specifically, B's per-graft boon/edit
corruption ladder is the strongest artifact design in either world — the horror is embodied in
the objects rather than narrated around them — and the dreaming-cocoon / inherited-memory texture
is fresher. B edges it on richness, novelty, and mechanical depth; A on dramatic immediacy.

---

## Theme 4: machine-successor

The richest matchup of the five — both worlds are full builds with event timelines, arcs, opposed
beliefs, and a live colonist conflict. Shared premise: self-replicating fabricators (the Lathe)
are mid-contract eating dead worlds to build a galaxy-spanning structure (the Rim Assembly); a
Tally audit-lineage holds the founding order; Revenant Foundries are drift-corrupted off-spec
cells; humans are late-arriving salvors competing for the same feedstock. The mystery in both is
that the thing being built is no longer the thing that was ordered. They differ on whether the
core question is *cosmic* (who ordered this, and can it be re-steered) or *structural* (a tidy
dated causal chain across more factions).

**World A** (Driftborn Consortium / 5 factions incl. the First Architects):
- A 6-fragment `reveals`-chain that doubles as the full causal *history of the machine project*:
  directive written → Lathe executed faithfully → copies drifted → Tally split to audit →
  `the-built-thing-is-not-the-ordered-thing` → `it-can-still-be-diverted`. The terminal fragment
  is a real twist WITH agency: the build follows directive-shards not a central will, so an
  authored counter-directive at an intake seam could bend the next phase — "the reconstructed plan
  is also the lever; reading the intent is how you change it."
- The strongest single conceptual node in either world: `lore/ctx-the-no-negotiation-rule`
  ("Why It Will Not Speak") — the machines have NO listening channel; the only language they parse
  is the work-order itself, so the only way to communicate is to author one. This makes the whole
  cryptography-as-diplomacy premise cohere.
- It keeps the **First Architects (the-makers-absent)** — "signed a galaxy-scale work-order and
  walked offstage before the first cut." The most haunting question in the theme (who ordered this,
  and where did they go) lives here. The `the-origin-stamp` "does not match what is being built" is
  the answer at the bottom of the hunt.
- Rich context lore (`ctx-the-rim-silhouette` resembling no known structure; `ctx-feedstock-is-the-economy`
  zero-sum), 4-event causal timeline, opposed beliefs (`machines-are-mindless` vs `plan-can-be-read`),
  an open arc. Weaknesses: the arc node `involves` almost everything (loose), and a couple of
  inverted edges (`jana sought_by the-origin-stamp`, `commander-rho sought_by running-core` — objects
  seeking people). Some lore is spread across many droppers (corroboration, not filler).

**World B** (6 fabricator lineages, dated 100→500):
- More differentiated faction taxonomy: adds `the-spindle-cohort` (erects the Rim), `the-cartage-line`
  (haulage that strips inhabited systems on schedule), and `the-still-cells` (stalled graveyard,
  "the safest place to read the plan"). Each has a distinct role and agenda; the Cartage-Line's
  "does not target colonists, simply does not route around them" is a chilling indifference beat.
- The cleanest dated causal spine: an 8-event chain day 100→400 with explicit `caused_by` links and
  an `is_climax: true` divergence event that converges four lineages. Tighter event scaffolding than A.
- Excellent colonist-convergence mechanic: four colonists each OWN one work-order
  (`imani-rourke`/founding-order, `desh-okonkwo`/spindle-manifest, `sister-vale`/audit-key,
  `anker-foss`/running-core), and the arc's next_beat is literally pooling them before the Cartage
  Line strips Vale's compute-grid (a one-week clock). Strong, specific, playable.
- Weaknesses (decisive): only a **4-fragment** mystery vs A's 6, and the fragments tell more than
  they turn (the climax is "the directive diverged," an event, not a recontextualizing reveal). And
  B **drops the original makers entirely** — there is no First Architects, no "whose intent, and where
  did they go"; the founding order is just the Lathe's own. That removes the theme's deepest question.
  The Spindle vs Lathe distinction also partly overlaps. Many lore double/triple-drops (corroboration,
  but heavier than A's).

| Axis | World A | World B |
|---|---|---|
| Coherence | 8 — strong, but the catch-all arc `involves` edges and a couple object-seeks-person inversions | 9 — dated `caused_by` chain is airtight; colonist conflict web is clean |
| Causal/Structural Depth | 9 — 6-step reveal-chain that IS the project's history + the divert lever; 4-event timeline | 9 — 8-event dated chain + climax convergence + 4-fragment-across-4-owners mechanic |
| Thematic Richness | 10 — no-negotiation-rule, absent makers who walked offstage, rim-silhouette-of-unknown-purpose, zero-sum feedstock economy | 8 — strong indifference theme (Cartage routes through you), more factions, but no "whose intent / where did they go" |
| Novelty/Surprise | 9 — "reading the plan IS the lever," the origin stamp that doesn't match, communication-only-by-authoring-a-work-order | 7 — well-built but the beats are the expected drift beats; 4-fragment climax is an event restatement |
| Dramatic Potential | 9 — Deepwell on a manifest with redacted date, strip-and-run vs read-the-plan, intake-gate injection point | 9 — four owners, one-week Cartage clock on Vale's grid, traitor Anker, profiteer Desh: immediately runnable |
| **Total** | **45** | **42** |

**WINNER: World A** — B has the cleaner dated event spine and a tighter "four owners, four
work-orders" convergence that would run beautifully, and its extra fabricator lineages are
well-differentiated. But A wins on the axes that define this theme: the no-negotiation-rule and the
absent First Architects give it the deeper, stranger central question (drifted from WHOSE intent,
and where did they go), its 6-step chain is both longer and a genuine reveal rather than an event
recap, and "reading the plan is the lever to change it" is the best single idea in the matchup.
Both are top-tier; A is the more thematically complete machine.

---

## Theme 5: time-war

The most conceptually ambitious theme, and both worlds rise to it superbly. Shared premise: a
human survey/expedition excavates relics of a war fought across tense — a belligerent fighting
backward from its own future (Erevan / Aelthar), a retroactive counterforce that edits the
opening moves after they happened (Undated / Cessation), and precognitive neutral witnesses who
remember outcomes that haven't occurred (Oncewill / Witnesses). The mystery is a `precedes`-chain
whose TRUE order inverts surface dates, and in both the act of sequencing the finds is itself a
move in the war. This is the closest matchup after first-contact; both are near-flawless.

**World A** (Concordance Survey / Erevan–Undated–Oncewill):
- The framing device IS the theme: the Survey's job "is not to excavate but to ORDER — to decide
  which find caused which, knowing each new piece can retro-edit the meaning of all the ones
  already shelved." The premise and the mystery-mechanic are the same object.
- Every artifact carries an explicit `function_changed` clause — the inversion is mechanized INTO
  each object, not just narrated: `the-retro-editing-stylus` (a reader's already-filed notes
  silently change to a consistent-but-different account — "the only artifact that edits the archive
  that holds it"), `the-undated-anachronism` (the silt refuses to sediment around it; placing it
  anywhere is valid, which is why it breaks the sequence), `the-effect-before-cause` (a wound whose
  weapon is still buried), `the-fold-loop-ring` (engraved with its own future erosion, showing the
  loop "closed AND open in the same engraving, and will not pick one").
- A structural layer B lacks: `echoes` edges map each artifact to its specific war-event, and a
  dated event timeline (100→700) with `caused_by` links culminating in "an engagement that is
  simultaneously won, lost, and never-begun." The arc is explicitly "AMBIGUOUS by construction…
  no certified verdict survives the next find."
- Colonists embody the bleed precisely: Cross (her own notes editing themselves; "can no longer
  tell which conclusions she actually reached"), Renn (remembering findings before they're made),
  the Recruit Who Arrived Twice (two incompatible arrival dates — an Undated edit walking the camp).
- Weaknesses: the mystery is only 3 fragments (the node set holds more lore than the chain uses),
  and all 7 artifacts drop all 3 mystery fragments (heavy over-spread — corroboration past the
  point of distinction).

**World B** (Second Draft expedition / Aelthar–Cessation–Witnesses):
- A richer fragment chain: 5 `precedes` fragments (aelthar-struck → cessation-revised →
  tenses-collapsed → witnesses-archived → war-is-still-being-decided), with `mystery.order` correctly
  inverted to latest-first true order. Strong terminal reveal: "the relic you place last picks the
  winner — and whether the Aelthar were ever real. The expedition has joined the war by sorting it."
- A genuinely fresh bootstrap idea A doesn't have: `the-envoy-was-sent-before-his-senders` — the
  Aelthar reached back to plant their own first ambassador, "bootstrapping their existence by acting
  before they existed" (the skull dated centuries before the species). And `the-medal-rewards-the-unfought`
  ("a promise the timeline is obligated to keep: the battle WILL be fought, because the reward already
  exists") is a lovely causal-loop beat.
- Good present-tense scaffolding: dated NOW events (day 900/905), an arc in `climax` phase ("holds
  five of six finds; the sixth decides the war"), the camp on ground "that was a crater yesterday
  and a meadow tomorrow," Dane remembering the expedition's own ending.
- Weaknesses: fewer artifacts carry a per-placement "function changes" mechanic, so the inversion
  is more told than built into objects (A's `function_changed` is the decisive difference). Some
  over-loading: `the-eraser-stone` is `hidden_at` TWO locations (palimpsest-city AND ledger-vault)
  and drops 5 different fragments — a single object doing too much. No `echoes` artifact→event
  mapping layer.

| Axis | World A | World B |
|---|---|---|
| Coherence | 9 — framing, mystery, artifacts, echoes-layer all express the same inversion mechanic; tight | 8 — excellent, but the eraser-stone in two places + dropping 5 frags is over-loaded |
| Causal/Structural Depth | 10 — `function_changed` per artifact + `echoes` event-mapping + dated `caused_by` timeline; the inversion is structural | 8 — 5-fragment chain + dated NOW events + arc, but inversion carried more by prose than object mechanics |
| Thematic Richness | 9 — survey-that-orders, silt-that-reorders-as-you-watch, residue that leaks future memories as your own | 9 — bootstrapped envoy, medal-as-obligation, treaty-signed-by-the-dead, ledger-as-battleground |
| Novelty/Surprise | 9 — the stylus editing the reader's own notes; the ring closed-AND-open; the recruit who arrived twice | 9 — the self-planting ambassador and "the reward exists so the battle must happen" are first-rate |
| Dramatic Potential | 9 — Cross must publish a sequence that may be the move that wins/loses the war; the fold-loop ring won't pick | 9 — five of six finds held, the sixth picks the winner, Cessation reaching back to overwrite the choice |
| **Total** | **46** | **43** |

**WINNER: World A** (narrowly) — B is genuinely excellent and has the richer fragment chain plus
two ideas A lacks (the self-bootstrapping envoy, the medal-as-timeline-obligation). But A wins on
rigor: it mechanizes the theme's central trick (the picture inverts because something is still
rewriting it) INTO every artifact via `function_changed`, adds an `echoes` artifact→event layer B
doesn't have, and its framing (a Survey whose act of ordering IS the war move) is tighter than B's
expedition. A's flaw is over-spread lore; B's is an over-loaded eraser-stone. Both are the
strongest pair in the set; A is the more structurally complete realization of an extremely hard
concept.

---

## Summary

| Theme | World A | World B | Winner |
|---|---|---|---|
| the-living-marrow | 47 | 34 | **A** |
| first-contact-diplomacy | 45 | 42 | **A** |
| bio-symbiosis-horror | 42 | 44 | **B** |
| machine-successor | 45 | 42 | **A** |
| time-war | 46 | 43 | **A** |
| **TOTAL** | **225** | **205** | **A (4–1)** |

World A wins 4 of 5 themes; B's sole win (bio-symbiosis-horror) is earned on the strength of its
per-graft boon/edit corruption ladder. A's recurring edge across themes is fully-wired present-tense
drama (events + arcs + opposed live casts) plus deeper terminal twists; B's recurring strength is
clean formal scaffolding (explicit arcs, dated `caused_by` event chains, opposed `held_by` beliefs)
and, in the horror theme, theme-into-artifact design. The two closest contests (first-contact 45–42,
time-war 46–43) are both genuine photo-finishes.
