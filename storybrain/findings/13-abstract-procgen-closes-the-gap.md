# Finding 13 — Abstracting the procgen closes the hybrid↔pure gap (Sam was right)

Finding 12 showed pure-LLM beating the procgen hybrid because the fall-specific
procgen leaked forcing functions (status:fallen, `over-extracts`/`cascade` labels,
`wound`/`from_history` fields, inert numbered seers) that an LLM-clothed world then
carried. Sam's fix: make procgen ABSTRACT — since an LLM runs on the output, the
skeleton only needs to supply a consistent causal TOPOLOGY, not themed mechanics.
**Result: it works. The gap nearly vanished.**

## What changed

- `procgen-abstract.ts`: emits entities + a dense dated `caused_by` topology + a
  NEUTRAL climax + mystery fragments in the configured `order_relation`, with NO
  status:fallen / fell_to / wound / from_history / over-extract / cascade / seer.
  Verified scaffold-clean. Guarantees a climax even if momentum stays low.
- `prompt-stageCD-abstract.md`: the LLM CLOTHES the skeleton (renames every
  placeholder to theme content, sets per-theme fates — never default "fallen"),
  and crucially **PRUNES inert nodes**. In practice the clothe agents dropped
  ~13–22 of ~21–25 filler events per world, keeping only the causal spine.

## The measurement (clean Opus, blind, 4 themes pure won decisively in finding 12)

| Theme | hybrid-v1 vs pure (f12) | hybrid-v2 vs pure (now) | Δ margin |
|---|---|---|---|
| uplift-nursery-world | pure **+11** (45–34) | **hybrid +3** (43–40) | **+14 → hybrid wins** |
| extinction-plague-vector | pure **+15** (44–29) | pure +4 (43–39) | +11 |
| crowded-trade-federation | pure **+8** (42–34) | pure +1 (41–40, wash) | +7 |
| generation-ship-identity | pure **+12** (44–32) | pure +3 (46–43) | +9 |

- **Average pure margin: +11.5 → +1.25.** The abstract procgen erased ~90% of the
  deficit. Hybrid-v2 **won one** theme outright and the other three are washes
  (≤4 pts).
- Hybrid scores ROSE on every theme (plague 29→39, gen-ship 32→43, trade 34→40,
  uplift 34→43) — the lift is the removed forcing functions + pruning.

## The mechanism, confirmed

The judge (unprompted) found the procgen-filler signature **largely gone** and the
remaining nits **split across both arms**, not concentrated on the hybrid:
- pure leaked a `STEP 1…STEP 5` template string into uplift's fragment prose;
- hybrid left one authoring-directive placeholder in gen-ship (`(Per this world: …)`)
  and a slot-fill edge error in trade (`colonist owns factions/humans`).
These are **Stage-C quality nits, not procgen-structural** — both fixable with a
tighter clothe prompt / a post-gen lint. The two strongest worlds (plague,
gen-ship) are now "near-twins decided by execution density."

## What this means

- **The hybrid is rehabilitated.** Finding 12's "pure wins" was an artifact of the
  fall-specific procgen, exactly as Sam diagnosed — not an inherent hybrid defect.
  With an abstract skeleton, hybrid-v2 is **at parity** with pure (pure +1.25 avg,
  inside noise; hybrid won 1/4).
- **At parity, the tiebreaker is purpose.** Pure is simpler (one call); the hybrid
  buys a deterministic, internally-consistent causal skeleton the LLM doesn't have
  to invent or hold in-context. That advantage is untested-but-plausible to GROW at
  larger world sizes / longer histories, where a single LLM pass strains to keep
  causal consistency — the natural next experiment.
- **Updated recommendation:** the abstract-procgen hybrid is now a viable generator,
  on par with pure at ~35-node scale and the better bet if you want
  deterministic/seedable causal scaffolding or push to larger worlds. For small
  one-off worlds, pure is still the simplest. Either feeds the same SQLite store
  (finding 06).

## Honest limitations

n = 4 themes (the ones pure won worst — chosen to make improvement measurable),
single clean Opus judge, 1 world per arm. A full 10-theme + cross-model re-judge
(the leak-free files + abstract pipeline are ready) would firm up "parity" vs
"hybrid edges ahead." Two minor Stage-C leaks remain (above) — add a clothe-output
lint that rejects `STEP n`, `(Per this world…)`, and `owns factions/*` slot errors.
</content>
