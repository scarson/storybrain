# Finding 03 — The Director loop runs end-to-end against a live brain

Resolves R1-04 ("nothing was run") and partially R2-02 ("no Director/scorer/spiral
ran"). Code: `storybrain/prototype/seed.sh` + `director.ts`. Reproduce:

```
GBRAIN_HOME=/tmp/storybrain-brain bash storybrain/prototype/seed.sh
GBRAIN_HOME=/tmp/storybrain-brain bun storybrain/prototype/director.ts
```

## What ran

A real `sense → score → fire → write-back` tick against a live PGLite gbrain:
- **Sense:** real `gbrain backlinks <faction> --json` queries (not mocked).
- **Score:** the DESIGN §5 `callback_strength` + resonance formula.
- **Fire + write-back:** `put` an event page, emit `involves`/`advances` edges,
  re-`put` the arc page advanced to `climax`.

## Result (verbatim scores)

| candidate | resonance | why |
|---|---|---|
| **raid-iron** | **3.197** | cited 3 high-tension edges (vera rival_of, ashmark sought_by, lore reveals) × **1.8 arc multiplier** (advances the open reckoning arc) |
| raid-ash | 0.989 | 2 edges, no arc advance |
| heist-crown | 0.989 | same faction backlinks, no arc advance |
| flare (disaster) | 0.210 | **no graph history → no callbacks** (correctly sinks) |

The pick is **coherent and arc-aligned**, and the disaster with no history
correctly loses — exactly the anti-word-salad behavior R1-07 worried about. The
narration cites the real reason ("They have not forgotten the Ashmark — and Vera
least of all"). Post-fire, `graph-query arcs/iron-empire-reckoning --direction in`
shows the new event wired into the arc — the loop closed; next tick would see it.

## Honest caveats (carried to v4)

1. **`tension` is engine state, not a gbrain concept.** Here it's read from
   `world.json` (simulated engine sim-state), NOT from the graph. This is correct
   architecture — the game holds node tension in memory and need not round-trip
   the store (no N+1 fan-out, contra R2-04's hot-path worry) — but it means the
   demo tension VALUES are illustrative game-design inputs, not derived facts. The
   scorer's quality depends entirely on how the real game stamps tension.
2. **One tick, tiny world.** Not a multi-tick playthrough; no repetition/fixation
   pressure exercised (both 0 at tick 1). Scale tested separately (finding 04).
3. **arcMul applied per-candidate**, a documented simplification of DESIGN's
   per-edge arc_bonus. Same intent (arc-aligned callbacks dominate).
4. **Lore TEXT here is a hand-written stub.** Generation is the real open problem
   (R2-05) — addressed as a first-class section in DESIGN v4, not the prototype.

## Verdict

The memory + selection half of the system is now **demonstrated working on real
gbrain**, not asserted. The resonance scorer produces legible, plot-advancing
picks. What remains genuinely unsolved is lore GENERATION + its determinism
(round 2 R2-05/06) and the hunt-as-fun-loop (R2-08) — the half the friend actually
asked about.
</content>
