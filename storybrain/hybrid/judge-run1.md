# Blind Judge Evaluation — Run 1

Two procedurally/AI-generated sci-fi worlds judged as emergent-storyteller knowledge bases.
Worlds labeled A and B only; production pipeline unknown and not speculated about.

- WORLD A = `hybrid-world.json`
- WORLD B = `pure-llm-world.json`

---

## Structural audit (what's actually in the graph)

### World A
- **Nodes:** 5 factions/civs + 1 human faction, 4 location seams, 21 events, 3 artifacts, 1 figure, 14 lore fragments.
- **caused_by chains (per-civ event tracks, each within one civ):**
  - Shroud: 0→1→7→8→12→13 (length 6 — the deepest single chain).
  - Deep Architects: 3→4→10→16→17 (length 5).
  - Ephemera: 5→6→11→18→19 (length 5).
  - Luminaries: 2→9→14→15 (length 4).
  - Meta fall-chain: cascade → fall-of-shroud → fall-of-deep-architects → fall-of-ephemera (a stated "first/second/third link" causal ladder).
- **Inter-civ causation:** present *thematically* (salted stellar-dust as vector; shared substrate-crystal as copy-medium) but NOT encoded as cross-track `caused_by` edges — the event tracks run parallel and only converge at the cascade and in the fall lore. This is a real structural weakness: the "every later fall traces back to the first wound" claim is asserted in prose, only partially realized as edges.
- **Artifact→lore drops:** mind-archive drops 4, void-anchor drops 6, last-broadcast drops 4 = 14 distinct lore nodes, all reachable. The void-anchor is overloaded (drops Deep-Architect, Luminary AND seer lore that it has no diegetic reason to contain — a Shroud device "knowing" the Deep Architects' bedrock fate is a soft coherence seam).
- **Mystery:** only 3 fragments (the three fall-of-X), ordered as a causal ladder. The other 11 lore nodes are rich but sit *outside* the mystery sequence.

### World B
- **Nodes:** 4 alien factions + 1 human faction, 7 locations, 3 colonists, 3 powers, 1 belief, 1 curse, 7 artifacts, 15 lore (6 mystery fragments + 9 context), 6 events, 1 arc.
- **caused_by chains:**
  - Event spine: vael-first-tap → delver-deep-bore → the-waking → the-great-silencing → the-final-encoding → human-arrival (length 6, clean linear).
  - Lore fragment chain: mineral-was-a-mind → vael-tapped-it → delvers-cut-deep → mind-woke-in-pain → silence-spread → keepers-recorded-it (length 6, clean linear, parallels the event spine 1:1).
- **Two parallel 6-long chains** that mirror each other — high legibility, low branching.
- **Artifact→lore drops:** 7 artifacts each drop 3 lore (mix of mystery-fragment + context), with deliberate overlap (frag-the-silence-spread dropped by both deathmask and prophecy-plate; frag-the-keepers-recorded-it by both seed and river-stone) — so multiple artifact paths converge on the same fragment, good for an artifact hunt.
- **Mystery:** 6 fragments in strict causal order — a fully-formed whodunit that exactly reconstructs the event spine.
- **Coherence seams:** edge direction oddities — `faction/the-vael forged_by artifact/the-first-tuning-fork` reads backwards (a faction forged by its own relic); `aethel-survey-corps worships lore/human-repeat-mistake` and `colonist owned_by faction` are awkward verb reuse from a generic schema. The `caused_by` lore chain root `frag-the-mineral-was-a-mind` is uncaused (fine — it's the premise).

---

## Per-dimension scores

### 1. COHERENCE (internal consistency, no contradictions)
- **A: 7** — Tight thematic logic (dissolution → forgetting → un-being is consistent everywhere), but the Shroud's void-anchor "dropping" Deep-Architect/Luminary/seer lore it has no diegetic access to is a real seam, and the famous "every fall traces to the first wound" is claimed harder than the edges support.
- **B: 8** — The two parallel chains never contradict; powers (dreamtide/deep-sight/silence-touch) map cleanly to their factions; the human-repeats-the-mistake loop is airtight. Loses a point only for backwards/generic schema verbs (`faction forged_by artifact`, `worships lore`, `owned_by`) that read as template artifacts, not authored relations.
- *A 7 / B 8*

### 2. CAUSAL DEPTH (richness/length/branching of cause-and-effect)
- **A: 8** — Four interleaved per-civ chains (lengths 6/5/5/4) PLUS a 3-link meta fall-ladder, with secondary mechanisms (salted seam as vector, honest-lattice as copy-medium, addiction-relapse loop in events 12-13). Far more branching and texture; weakened by those mechanisms living in prose rather than as cross-track edges.
- **B: 6** — Two clean 6-long chains, but they are linear and mirror each other 1:1 with essentially zero branching: tap→bore→wake→silence→encode→arrive. Elegant and complete, but a single rope, not a web.
- *A 8 / B 6*

### 3. THEMATIC RICHNESS (alien-civ distinctiveness, psychic layer, mystery)
- **A: 9** — Four genuinely distinct alien ontologies with mechanically-load-bearing traits: hive that dies of individuation (`the choir cannot survive a soloist`), silicon people whose *greed is for certainty* (`the substance that feels more certain the more it lies`), time-ghosts erased by being convinced the loop "was never theirs", energy-beings who survive *because they have no matter to corrode*. Each psychic signature ("the first throat the silence learned to use") is distinct. Psychic-ruin as a murdered god's dreaming corpse is a strong unifying conceit.
- **B: 7** — Four solid archetypes (psychic cetaceans, sunless hive-engineers, oracle-aristocracy who *sold* the prophecy, fungal archivists) and the planet-mind-as-nerve premise is clean, but the distinctiveness is one layer thinner — the factions differ by silhouette more than by an inner contradiction that kills them. Pale Wing selling prophecies and Orchard Keepers' "to mine is to flay" are the standouts.
- *A 9 / B 7*

### 4. NOVELTY / SURPRISE (recontextualizes, avoids cliché)
- **A: 9** — Real recontextualizations: the danger rating reframed as "a measure of how much it wants you"; death-by-remembering rather than war; the void-anchor that *half-works* and so freezes a billion minds mid-death "in the present tense, forever"; the wars being the loud decoy while the true killer is silent. The mind-archive as "a coroner's ledger disguised as a hard drive" is a genuine twist.
- **B: 6** — "Mining a sleeping god awake" and "the artifacts are a warning not a treasure" are evocative but closer to known sci-fi beats (the slumbering-planet-mind, the colonists repeating the ancients' sin). The twitching core-sample and futures-that-all-end-at-one-instant are nice, but fewer ideas actively subvert expectation.
- *A 9 / B 6*

### 5. DRAMATIC POTENTIAL (would this seed compelling emergent stories / artifact hunts?)
- **A: 7** — Tremendous lore payload (14 fragments, layered reveals) and a haunting cascade, BUT it is almost entirely *backstory of the dead* — only one living-ish agent hook (the dimming Luminaries / the seer, both past-tense) and the human "Latecomers" are a flavor faction with no named characters, no present-tense stakes, no factional friction to play out. Great to read, harder to *play*.
- **B: 8** — Weaker prose but a far better game seed: three named colonists in live conflict (Myne suspects warning / Tovar wants extraction on schedule / Sefa the latent psychic the orchard answers), a present-tense ticking clock (the Unmaking Silence still spreading, Corps drilling toward its edge), 7 artifacts at 5 distinct sites with overlapping lore-drop paths and gating relics (Wingbone Key opens the Spire; River Stone lets a human survive the Silence Touch). The central `arc` node states the playable question outright.
- *A 7 / B 8*

---

## Score table

| Dimension | World A | World B |
|---|---|---|
| Coherence | 7 | 8 |
| Causal depth | 8 | 6 |
| Thematic richness | 9 | 7 |
| Novelty / surprise | 9 | 6 |
| Dramatic potential | 7 | 8 |
| **Total** | **40** | **35** |

---

## OVERALL WINNER: World A

World A wins on the strength of its worldbuilding and causal texture: four alien civilizations whose extinction mechanism is inseparable from their nature (the Shroud dying of individuation, the Deep Architects of their hunger for certainty), a unifying conceit — psychic-ruin as a murdered god's still-dreaming corpse that "wants" to dissolve all borders — that pays off in genuinely surprising images, and four interleaved causal chains plus a fall-ladder versus B's two clean-but-linear ropes. World B is the more *playable* artifact — present-tense conflict among three named colonists, a live spreading curse, and a tighter, fuller 6-fragment mystery with converging artifact-hunt paths — and it is more internally coherent at the edge level. A's main liabilities are real: it is overwhelmingly backstory-of-the-dead with thin present-tense agency, and several of its boldest causal claims ("every fall traces to the first wound") live in prose rather than in actual cross-track edges, while one artifact (the Shroud's void-anchor) implausibly "drops" lore about civilizations it never touched. But for a *knowledge base* meant to seed emergent storytelling, A's depth and density of distinctive, recombinable material outweighs B's cleaner-but-shallower spine.

**Single biggest quality difference:** World A's causal-and-thematic depth is markedly higher (four branching civ-tracks + a fall-ladder, each civilization's death encoded in its own nature), whereas World B trades that richness for a single clean linear chain that is more legible and more immediately playable but far less surprising.
