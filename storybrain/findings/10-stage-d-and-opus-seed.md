# Finding 10 — Stage D (live stakes) + Opus seed-gen close the drama gap

Two changes the user asked for, both shipped and validated:

## 1. Opus for Stage A (seed-gen), up from Haiku

`templates-v2.json` (Opus) is markedly richer than the Haiku seed: four distinct
archetypes (the-tessellate fractal-hive, the-pale-cartographers time-folding
navigators, the-nullborn anti-psychic ascetics, the-glasswrights bioforge
collective) and a dangerous resource with a real concept — **soultide (0.95): "the
substance that thinks back."** Procgen on it (seed 2024) → 50-node history, **28
`caused_by` edges** (vs 19 on the Haiku seed) — the better seed produced a deeper
mechanical history before any enrichment.

## 2. Stage D — live present-tense colony stakes

`prompt-stageD.md` + an Opus pass turned the post-mortem history into a live game
seed. `hybrid-v2-world.json` (67 nodes, 135 edges, **VALID**) adds, on top of the
deep fall-history:

- **4 named human colonists** present now: Mara Okonkwo (drill lead), Dr. Idris
  Vale (xenoarchaeologist, holds the wayfinding-stone), Senna Rho (deep-drill
  foreman, *first human to dream the soultide*), Jonah Pike (company liaison /
  traitor).
- **An OPEN arc — "The Second Bore" (phase: rising, unresolved)**: the colony is
  days from drilling into the exact coordinates of the ancient wound that killed
  four civilizations.
- **15 present-stake edges** (`rival_of`, `betrayed_by`, `owns`, `sought_by`,
  `threatens`) wiring the colonists, factions, and artifacts into live conflict —
  Pike selling the seal's location to the surviving Cartographers; Vale unable to
  stop Okonkwo's bore order; Rho already touched by the unanimous dream.

**The deep lore now PAYS OFF as present peril:** the post-mortem set up in Stages
A–C detonates into an unresolved, human-stakes crisis. This directly targets the
one dimension pure-LLM beat the hybrid on in finding 09 (dramatic potential —
"live human stakes vs a post-mortem"). The hybrid now has BOTH the deep consistent
history (its finding-09 strength) AND live drama (its finding-09 weakness).

## Status

A formal re-judge of Stage-D-hybrid vs pure-LLM on dramatic potential belongs to
the bigger multi-seed, cross-model eval (which the 10-theme sample set now being
built will power). Structurally, the gap is closed: the hybrid went from 0 live
human colonists + 0 open arcs to 4 + 1, with 15 present-tense stake edges, while
keeping its 28-edge causal history. Pipeline is now Opus at every LLM stage
(A seed, C enrich, D stakes) + deterministic procgen between.
</content>
