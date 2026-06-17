# Finding 09 — Hybrid (LLM→procgen→LLM) beats pure-LLM, blind-judged

The experiment the user asked for: does a multi-stage **LLM-seeds-procgen →
procgen-runs → LLM-enriches** pipeline produce a better world than pure-LLM, as
scored by a **blind Opus judge**? Answer: **yes, on causal depth, thematic
richness, and novelty — though pure-LLM wins playable drama.** Modest-but-robust
on a small n=2 counterbalanced eval.

## Method

- **Hybrid arm** (`hybrid/hybrid-world.json`, 48 nodes/89 edges): Stage A (Haiku)
  seeds templates → procgen (deterministic, seed 1337) → 37-node history with a
  19-edge `caused_by` chain → Stage C (Opus) enriches with lore + meaning.
- **Pure-LLM arm** (`hybrid/pure-llm-world.json`, 49 nodes/85 edges): one Opus call
  generates the whole world directly, same theme, size-matched. **Same final model
  (Opus) as the hybrid's enrichment** — so the comparison isolates the *procgen
  scaffold*, not model strength.
- **Judge:** two blind Opus judges (`judge-run1.md`, `judge-run2.md`), A/B labels
  **swapped between runs** (counterbalances position bias). Judge told nothing
  about pipelines; scored 0–10 on coherence, causal depth, thematic richness,
  novelty, dramatic potential.

## Result — hybrid won both runs

| | Run 1 (hybrid=A) | Run 2 (hybrid=B) | Hybrid total | Pure total |
|---|---|---|---|---|
| **Overall winner** | **hybrid** (40 v 35) | **hybrid** (41 v 39) | — | — |

Per-dimension, aggregated across both runs (hybrid vs pure, out of 20):

| Dimension | Hybrid | Pure-LLM | Edge |
|---|---|---|---|
| Coherence | 16 | 16 | tie |
| Causal depth | 16 | 14 | **hybrid +2** |
| Thematic richness | 18 | 14 | **hybrid +4** |
| Novelty / surprise | 17 | 13 | **hybrid +4** |
| Dramatic potential | 14 | 17 | **pure +3** |
| **Total** | **81** | **74** | **hybrid +7** |

The winner is **robust to label position** (hybrid won as both "A" and "B").

## What each judge actually said (consistent across runs)

- **Hybrid's strength = depth + theme + surprise.** Both judges praised the dense,
  interwoven event braid (~21 procgen events, ~15–19 `caused_by` across 4 civs
  converging on one cascade) and the *ruthless single cause* the LLM layered on top
  (`psychic-ruin` = the pulverized, still-dreaming mind of a murdered civilization;
  a "contagion of individuation" that taught each body to say *I*). This is the
  thesis confirmed: **procgen supplies consistent causal scale cheaply; the LLM
  supplies meaning.** Neither alone produced both.
- **Pure-LLM's strength = playable drama.** It won "dramatic potential" in BOTH
  runs: named colonists in live, present-tense conflict, a still-open arc, 7
  artifacts (vs 3) with converging paths to each truth. The hybrid read as a
  *post-mortem* (the civs already fell, no live colony stakes).
- **Hybrid's flagged weaknesses:** coarse chronology (procgen clusters events into
  few day-stamps; the cascade fires fast, compressing the timeline), and only the
  3 fall-fragments are sequenced in `mystery.order` while 12 enrichment-lore nodes
  float as flavor.

## The actionable conclusion

**The hybrid approach has demonstrable value — specifically for deep, consistent,
surprising LORE (a knowledge base), which is exactly StoryBrain's job.** The clean
division: procgen owns *causal scale + global consistency* (its 19-edge chain is
mechanically guaranteed; pure-LLM had to hand-build and hold its 6-link chain in
one context), the LLM owns *meaning + theme*.

The one place pure-LLM wins — **live, present-tense, human-stakes drama** — is a
fixable gap in the hybrid, not an inherent loss: add a **Stage D** (or extend
Stage C) that injects the human colony's open arc and named live stakes ON TOP of
the deep historical skeleton. That would combine hybrid's depth with pure-LLM's
playability — plausibly beating both. (Filed as the next experiment.)

## Honest limitations

- **n=2 judgments, one judge model (Opus).** Opus judging Opus-enriched content
  risks self-preference — though BOTH arms used Opus for generation, which controls
  for it somewhat. A robust claim needs multiple seeds/worlds and cross-model judges
  (Sonnet, a non-Anthropic model).
- **Blinding is imperfect:** procgen slugs (`events/12-exploitation`) look
  different from hand-named ones; the judge wasn't told what that means, but a
  determined judge could infer "procedural." Counterbalancing mitigates position
  bias, not style tells.
- **Both worlds converged on "the mined resource was a living mind"** — the
  strongest reading of the theme. The comparison is about execution, not premise.
- Margins are modest (5 and 2 points). The honest claim is **"hybrid adds real,
  judge-visible value for lore depth,"** not "hybrid dominates."

## Verdict

The user's hypothesis holds on this eval: **LLM→procgen→LLM is worth it beyond pure
LLM**, for the depth/consistency that a storyteller knowledge base lives on.
Reproducible end to end (`hybrid/procgen.ts` deterministic; prompts + worlds +
judge verdicts all committed). Next: a Stage D for live stakes, and a bigger
multi-seed, cross-model judged run to harden the claim.
</content>
