# Finding 14 — Full-ten, leak-free: abstract-procgen hybrid BEATS pure (6–4)

The definitive run Sam asked for: all 10 themes × {hybrid-v2 (abstract procgen +
clothe/prune), pure}, blinded leak-free, judged by clean Opus (Codex/cross-model
unavailable this session, so single-judge — noted as the main caveat). **The
abstract-procgen hybrid wins the corpus, reversing finding 12.**

## Result (de-blinded, all 10)

| Theme | Winner | Score (win–lose) | f12 (hybrid-v1) |
|---|---|---|---|
| the-living-marrow (#0) | **HYBRID-v2** | 47–34 | hybrid (tiebreak) |
| time-war | **HYBRID-v2** | 46–43 | pure |
| megastructure-absent-architects | **HYBRID-v2** | 42–38 | pure |
| extinction-plague-vector | **HYBRID-v2** | 41–37 | pure |
| crowded-trade-federation | **HYBRID-v2** | 42–38 | pure |
| uplift-nursery-world | **HYBRID-v2** | 43–41 | pure |
| first-contact-diplomacy | pure | 45–42 | pure |
| bio-symbiosis-horror | pure | 44–42 | pure |
| machine-successor | pure | 45–42 | pure |
| generation-ship-identity | pure | 43–38 | pure |

**Tally: HYBRID-v2 6, PURE 4. Aggregate points: hybrid-v2 425 vs pure 408 (+17).**

### The swing, vs finding 12 (hybrid-v1, old fall-procgen)

- finding 12: **pure 9, hybrid 1.**
- finding 14: **hybrid 6, pure 4.**
- Same 10 themes, same pure baselines, same judge model, leak-free both times. The
  only change is **procgen.ts (fall-specific) → procgen-abstract.ts (neutral
  topology) + a clothe prompt that prunes the scaffold.** That single change moved
  the hybrid from losing 1/10 to winning 6/10. **The forcing functions were the
  entire deficit — exactly Sam's diagnosis.**

## Why it flipped (judge findings, unprompted)

- The procgen-filler signature is **gone**: clothe agents pruned ~16–25 inert
  events per world down to a meaningful spine; no `status:fallen`/`fell_to`/`wound`/
  `over-extracts`/numbered-`seer` leaks survived (verified: scaffold-grep clean on
  all 10).
- Hybrid-v2's recurring EDGE is now its **fully-wired present-tense layer** — `event`
  timelines with `caused_by`, an `arc` node with explicit stakes/win/fail, and a
  live opposed cast — on top of a consistent causal backstory. The most lopsided
  result, the-living-marrow 47–34, was precisely the pure world being "the hybrid's
  lore layer with the events, arc, live colonists, and a whole fourth civilization
  stripped out."
- Pure still wins where a single authored pass produced a tighter single conceit:
  bio-symbiosis (pure's per-graft boon/edit corruption ladder was the best
  artifact design in the set), first-contact, machine, gen-ship — all by ≤5 pts.

## Honest caveats

- **Single judge model (Opus).** Codex/cross-model was unavailable this session, so
  no cross-model confirmation. Opus is the judge that was stable across finding-12's
  two passes, and the leak-free files remove the earlier blinding flaw — but a
  second model is the right confirmation when available. (Sonnet was dropped after
  it gave two contradictory runs in finding 12.)
- **Margins are mostly narrow** (6 of 10 within ≤5 pts); the-living-marrow (+13) is
  the one decisive gap. So "hybrid-v2 ≈ wins, and is at least at parity" is the
  safe reading; "hybrid-v2 dominates" is not.
- n = 1 world per arm per theme; ~30–43-node worlds. Minor edge-quality nits remain
  in BOTH arms (a few inverted/malformed edges, lore over-spread) — a post-gen lint
  would clean both.

## Updated recommendation (supersedes finding 12 and finding 13)

**The abstract-procgen hybrid is now the recommended generator**: Stage A (Opus
seed) → `procgen-abstract.ts` (deterministic neutral causal topology, configured
`order_relation`, guaranteed climax) → clothe+prune+Stage D (Opus) → the SQLite
edges store (finding 06). It wins the corpus 6–4, is strongest exactly where a
single LLM pass strains (deep causal history + a wired live layer: marrow, time-war,
the present-stakes themes), and it adds **determinism + seedability** pure can't —
re-run a seed, get the same skeleton. Pure remains a fine, simpler fallback for
one-off small worlds and still edges a few tight-single-conceit themes.

Net arc of the whole eval thread: finding 09 (hybrid wins, 1 theme, contested) →
finding 12 (pure wins 9–1, full corpus, fall-procgen) → finding 13 (abstract
procgen closes the gap on 4 themes) → **finding 14 (abstract procgen wins 6–4 on
the full ten).** The procgen idea was right; the fall-specific implementation was
the bug; abstracting it — because an LLM clothes the output — is the fix.
</content>
