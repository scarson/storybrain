# Finding 12 — Full-corpus judge eval REVERSES finding 09

> ## ⚠️ AUTHORITATIVE CORRECTION (clean re-judge) — read this first
>
> The original headline below said "19/20." That number was **inflated** — it
> counted a Sonnet run that proved unreliable. After a Sonnet half-1 re-run gave a
> **contradictory** result (one run all-pure, the other 3-hybrid/2-pure → Sonnet is
> too high-variance to count here) AND the disclosed `_arm` blinding leak, I ran a
> **clean re-judge with Opus (the stable judge — two prior passes agreed) on
> leak-free files**. Authoritative result:
>
> **Clean Opus, leak-free: PURE 9, HYBRID 1 of 10 themes.**
>
> | Theme | Winner | Margin |
> |---|---|---|
> | the-living-marrow (#0) | PURE | 41–40 (wash) |
> | first-contact-diplomacy | HYBRID | 44–43 (wash) |
> | bio-symbiosis-horror | PURE | 43–41 |
> | machine-successor | PURE | 43–34 |
> | time-war | PURE | 44–43 (wash) |
> | generation-ship-identity | PURE | 44–32 |
> | megastructure-absent-architects | PURE | 43–39 |
> | extinction-plague-vector | PURE | 44–29 |
> | crowded-trade-federation | PURE | 42–34 |
> | uplift-nursery-world | PURE | 45–34 |
>
> **The leak did NOT change the verdict.** Leaky-Opus and clean-Opus both give
> **9 pure / 1 hybrid**; the leak only *shuffled which near-tie theme* the lone
> hybrid win landed on (#0 under leaky, first-contact under clean — both 1-point
> washes). Pure wins **decisively** (margin ≥6) on 5 themes (machine, gen-ship,
> plague, trade, uplift); hybrid never wins by more than 1 point. **Conclusion
> unchanged and now leak-robust: pure-LLM beats the hybrid; the honest number is
> 9/10 (clean Opus), not 19/20.** Sonnet is reported below as directionally
> pure-leaning but too variable to count. Everything below is the original
> (contested) write-up, preserved for the record.

---


The hardening run the user asked for: generalize the pipeline (finding 11 / commit
71e7cfa), generate all 10 themes × {hybrid, pure}, and blind-judge with TWO models.
**Result: pure-LLM decisively beats the LLM→procgen→LLM hybrid — 19 of 20 blind
cross-model judgments.** This overturns finding 09 (single-theme, single-judge,
pre-generalization), and the reason is specific and useful.

## Setup

- 10 themes (the 3-round-reviewed sample set). For each: a HYBRID world (Stage A
  Opus seed → procgen → Stage C+D enrich+live-stakes) and a PURE-LLM world (single
  Opus pass), both ~40 nodes, both validated. #0 reused hybrid-v2 + the finding-09
  pure baseline.
- Blinded to A/B (random, secret mapping). Judged by **Opus and Sonnet** (cross-
  model, addressing finding 09's single-Opus limitation), each over all 10, plus an
  independent Opus recheck of 2 themes.

## Result (de-blinded; 20 theme-judgments)

| Theme | Opus | Sonnet | Consensus |
|---|---|---|---|
| the-living-marrow (#0) | **hybrid** (40–40 tiebreak) | pure (43–36) | **split / wash** |
| first-contact-diplomacy | pure | pure | **pure** |
| bio-symbiosis-horror | pure | pure | **pure** |
| machine-successor | pure (×2 Opus passes) | pure | **pure** |
| time-war | pure (×2 Opus passes) | pure | **pure** |
| generation-ship-identity | pure | pure | **pure** |
| megastructure-absent-architects | pure | pure | **pure** |
| extinction-plague-vector | pure | pure | **pure** |
| crowded-trade-federation | pure | pure | **pure** |
| uplift-nursery-world | pure | pure | **pure** |

**Tally: PURE 19, HYBRID 1** (the lone hybrid win is an Opus tiebreak on #0, not
corroborated by Sonnet). **9/10 themes: both models pick pure outright. #0 is a
wash.**

## Why (the judges' graph-level mechanism, identified unprompted)

Both models, inspecting the actual graphs, converged on the same fault: when the
fall-specific procgen is forced onto themes it doesn't natively model, the HYBRID
world carries **filler + scaffolding leakage** that dilutes it:
- numbered `*-seer-*` figures and templated `*-war` / `over-extracts` events, all
  stamped the same day, that feed neither the mystery nor the live arc;
- `wound: 0` / `from_history: true` scaffolding fields and even meta-text in lore
  ("the climax the **procgen history** calls a cascade");
- weaker mystery-relation fit (a `prerequisite`/`reveals` spine bolted onto a chain
  procgen generated as a fall);
- occasional contradictions (machine-successor hybrid: civs `status: active` yet
  `fell_to` a cascade its own lore says "is not a collapse").

PURE worlds won on tighter authored causal chains, evocative individually-named
artifacts that work as hunt hooks (`the-treaty-signed-by-the-dead`,
`the-medal-for-a-battle-not-yet-fought`), and clean in-fiction surface. The
hybrid's one consistent edge — stronger LIVE present arcs from Stage D — did not
outweigh its procgen drag.

**Even on #0 — the resource-fall theme procgen WAS built for — it's now a wash**
(Opus tiebreak hybrid; Sonnet pure), where finding 09 had hybrid winning clearly.
Cleaner pure baseline + a second model erased the home-field advantage.

## Honest limitations (do not over-read this)

1. **Blinding leak in the judged run (disclosed).** The blinded files still carried
   `_arm`/`_pipeline`/`_flavor_note` fields naming the pipeline (sanitize was too
   narrow; fixed in commit 9dd55aa, clean files re-blinded). Both judges *flagged
   these and stated they ignored them*, and the decisive mechanism they cite is
   graph-structural (numbered slugs, filler events, contradictions) — visible
   independent of the `_arm` text. If anything the leak labeled the hybrid as the
   "fancy procgen" arm, which would bias toward it; pure won anyway. Still, a clean
   re-blind + re-judge (files are ready) is the right confirmation and is the
   obvious next step.
2. n = 10 themes, 2 judge models, **1 world per arm per theme** (no seed variance).
3. ~40-node worlds. At much larger scale, procgen's causal-consistency value
   (which pure must hold in one context) might matter more — untested.

## What this means (the actionable conclusion)

- **As built, the hybrid loses.** The procgen scaffold's filler/leakage costs more
  than its causal-scale benefit for LLM-authored ~40-node story worlds. Finding 09
  was a favorable special case (one theme, one judge, weaker pure baseline,
  pre-Stage-D), and did **not** generalize.
- **It's the IMPLEMENTATION, not the idea.** The hybrid could still win if (a)
  procgen is generalized PER-SPINE so it isn't forced into a fall shape, and (b)
  Stage C **prunes** the procgen scaffolding (drop inert seers/events, strip
  history-meta) before enriching. The eval shows exactly what to fix.
- **Recommended generation stack today:** **pure-LLM generation** of a structured
  fact-skeleton (finding 08) + the **Stage-D live-stakes** layer (finding 10),
  loaded into the **SQLite edges store** (finding 06). Simpler than the hybrid and
  judged better across the corpus. Keep procgen only for the resource-fall family
  (#0) where it's at worst a wash, or revisit it after the two fixes above.

## Bottom line

The user's instinct to test the hybrid "beyond pure" was right — and the honest
answer is that, at this scale and implementation, **pure-LLM is better (19/20).**
The exploration's recommended pipeline is pure-LLM fact-skeleton + Stage-D stakes +
SQLite store; the procgen hybrid is not validated at corpus scale and has a clear
fix-list if revisited.
</content>
