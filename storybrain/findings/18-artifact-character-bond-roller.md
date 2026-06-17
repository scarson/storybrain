# Finding 18 — Artifact↔character bonds: a resonance-gated roller (earned, not forced)

Sam's ask: a system where discovered items can roll *interesting* relationships to
characters — without feeling forced. Built + demonstrated: `bond-roller.ts`.

## The core principle (why it's not forced)

**Never roll flat. Roll resonance, and decline by default.** When an item is
discovered, the system enumerates (character, relation) candidates, scores each by
FIT to concrete shared signals, and forms a bond ONLY where fit clears a threshold.
**No signal → no bond — the item stays an item.** This is the same discipline that
fixed the Director (top-K resonance) and the procgen (abstract, no forcing): a
link appears exactly when the world already justifies it.

## Relation vocabulary (character → artifact)

Provenance: `heir_to` (its maker is their people/kin), `vendetta_over` (its maker
is a rival), `recognizes` (a looser tie), `denies_to` (a faction they oppose also
wants it). Skill/role: `decoded`/`studies`, `wields`, `operates`. Affinity:
`attuned_to` (power matches a passion), `covets` (it answers their `want`).
Valence: `haunted_by` (it bears a curse and they're exposed). (All are plain link
verbs; the schema already accepts them.)

## The fit signals (in priority order)

1. **Provenance (strongest, most "of course")** — the item is tied (via
   `forged_by`/`owned_by`/`sought_by`) to someone the character is tied to (their
   faction, kin, or rival). The link is pre-justified by the graph.
2. **Skill/role** — the item suits what they're good at (a translator `decoded`s a
   codex; an engineer `operates` a core; a gunner `wields` a blade).
3. **Passion/power** — `attuned_to` when the artifact's `grants` power matches a passion.
4. **Want** — `covets` when the artifact's lore speaks to the character's `want`.
5. **Curse/valence** — `haunted_by` for the vulnerable when it `bears` a curse.

Fit = the keyed signal's strength ∈ [0,1]; below `THRESHOLD` (0.5) the candidate is
ineligible. That threshold is the unforced gate.

## The dials that keep it interesting AND sparse

- **Rarity (`P_BOND`)**: even a fitting item only *sometimes* forms a new bond — so
  bonds feel special, not spammed onto every pickup.
- **Per-character cap**: spreads bonds across the cast instead of one magnet hoarding.
- **Dramatic bonus**: a candidate scores higher if forming it creates CONFLICT — a
  *rival claim* (someone already bonded to this item), a bond that cuts against an
  existing social tie, or one that advances an open arc. "Interesting" = high fit
  **and** high tension, not just a static match.
- **Determinism**: seeded roll (reproducible per save); the one-line "why" is
  templated now and can be LLM-rendered + cached (facts-vs-prose discipline).

## Demonstrated (real worlds, seed 7)

| world | sample bonds formed | declines |
|---|---|---|
| gen-ship | `recorded-doubter --decoded--> scarred-stele` (xeno 20); `mara --denies_to--> mercy-vault` (a faction she rivals wants it); `sleeper --operates--> refusers-vault` (eng 17) | 2 (rarity) |
| bio-symbiosis | `ward-antibody-voice --heir_to--> pale-ward-graft-seed` ("made by their own people"); `first-whole-host --covets--> communion-node` | 3 (incl. "no resonant character — correct, not forced") |
| first-contact | `mendicant-broker --heir_to--> mendicant-seal-key` | **5 unbonded** — the alien gift-artifacts simply don't resonate with the human envoy crew, so the roller correctly abstains |
| machine | `imani --covets--> founding-work-order`; `vale --operates--> still-cell-running-core` (eng 16) | 4 |

The first-contact result is the proof the gate works: rather than forcing bonds,
the roller leaves most items unbonded because nothing fits — exactly the behavior
that prevents "forced."

## How it closes the loop with the Director

A bond is **callback fuel**. When an artifact carrying a `covets`/`vendetta_over`/
`heir_to`/`haunted_by` bond surfaces in an event (a rival raids for it, it's found,
it's used), the bonded character's `tension` spikes, which raises the Director's
`callback_strength` for events involving them — so the Director naturally stages a
beat around the person who has a stake in that object. Items → character bonds →
director beats → events that deepen the bond. The artifact-hunt becomes personal.

## Two layers + progression

- **Worldgen (offline):** Stage E already seeds the few story-defining bonds
  (bio-symbiosis grafts, gen-ship's ancestor relic). Keep those authored.
- **Runtime (this roller):** newly discovered items roll bonds against the LIVE
  cast — including characters who arrived/changed since worldgen.
- **Deepening:** a bond can escalate on later triggers (study/use/crisis):
  `recognizes → covets → wields → bonded_to → defined_by`, like progressive lore
  reveal. Each step is another resonance check, not an automatic upgrade.

## Honest limitations / next

- `want`-matching is keyword/token overlap today; an LLM (or embedding) would do
  semantic match far better — and render the "why" as one evocative line (cached).
- Relation→signal keying and thresholds are hand-tuned; need playtest calibration
  (how often should a discovery bond? what cap?).
- Not yet wired into a runtime loop or the Director's scorer — designed for it
  (above), not integrated. The roller is a pure, deterministic function ready to
  drop into either the worldgen Stage E+ or an in-game discovery event.
- Add the relation verbs to a `bond` link-type group + let `character-lint` credit
  artifact-bonds (currently it only scores colonist↔colonist).
</content>
