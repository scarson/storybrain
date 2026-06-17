# Finding 15 — Character entities: present but shallow; the "make-it-better" plan

Answers Sam's two questions: (1) does generation include character entities? and
(2) how do we make the best versions better?

## Q2: Yes — characters exist as `colonist` nodes, but they're under-developed

Every world generates 3–7 `colonist` characters (the dramatis personae). Measured
across the 10-theme corpus:

| signal | hybrid-v2 (Stage D) | pure |
|---|---|---|
| colonists / world | 4–7 | 3–6 |
| have a drive/role | ~all | varies |
| have **skill stats** | **0** (only gen-ship) | ~0 |
| **colonist↔colonist** edges | 1–4 (thin) | **often 0** |
| colonist→plot edges | 4–8 | often **0** |

`character-lint.ts` flags **4–6 issues on every world**. The three real gaps:

1. **No skill stats.** Biggest miss for a Rimworld-type game — colonists need
   shooting/medicine/social/research/passions, and the Director's own
   `who_has_skill` query depends on `facts.skills`. Generation almost never
   produces them.
2. **Thin social graph.** Characters relate to the PLOT (artifacts, factions, arc)
   far more than to EACH OTHER. Emergent drama is fueled by colonist↔colonist ties
   (kin, rivals, lovers, debts) — currently ~1–4/world. This is the single highest-
   leverage gap for emergent storytelling.
3. **No named alien characters.** Alien CIVS exist; individual alien NPCs
   (emissary, defector, last sleeper) don't — so cross-species relationships can't
   form.

Also notable: **pure worlds barely wire characters at all** (relationship edges = 0
on first-contact/plague/trade/uplift). Stage D wiring is a big reason hybrid-v2
won the corpus — and the obvious way to lift pure.

## Q1: How to make the best versions better — Stage E (characters & polish)

A post-generation pass (`prompt-stageE.md`), gated by `character-lint.ts`:

- **Skills + a passion + a concrete `want`** on every colonist (Rimworld-style) →
  gameplay-real and Director-queryable.
- **Dense colonist social graph** (≥1.0 edge/colonist): `kin_of`/`rival_of`/
  `lover_of`/`ally_of`/`owes`/`grudge_against`, specific and story-bearing.
- **1–2 named alien characters** wired with ≥1 cross-species relationship.
- **Polish lint**: no fragment dropped by >3 artifacts (attribution), fix
  malformed/inverted edges (`X owns a faction`), consistent slug prefixes.

Enforced, not hoped: `character-lint.ts` exits nonzero until skills exist, social
density ≥1.0, and ≥1 alien character are present. Stage E runs on EITHER arm —
applying it to pure closes pure's biggest deficit (inert cast) too.

## Higher-leverage ideas beyond Stage E (for the genuinely best versions)

- **Make `tension`/`want` engine-live per character** so the Director scores
  individuals, not just factions (ties to the §6 scorer — a colonist with a hot
  grudge against the incoming faction should spike callback_strength).
- **Character↔artifact bonds** (a colonist who discovered / obsesses over / is
  changed by a specific relic — bio-symbiosis's grafts are the model) so the
  artifact hunt has personal stakes.
- **A "relationship-arc" mini-spine** (a feud or romance with its own beats) so the
  social graph isn't static — it advances like the mystery does.
- **Two-pass generation** for the winners: generate → lint → Stage-E amplify →
  re-judge; keep only if it scores higher (the skillopt pattern).

## Status

`character-lint.ts` + `prompt-stageE.md` built and committed; lint run shows the
gap on all 10. Stage E demonstrated on the top world (the-living-marrow); roll
across the corpus + a re-judge of amplified-vs-current is the next step.
</content>
