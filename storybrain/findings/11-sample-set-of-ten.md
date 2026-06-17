# Finding 11 — The 10-theme sample set (+ the one gap to using it)

Built the curated seed corpus for the bigger multi-seed eval: theme #0 (validated,
findings 08/09) + 5 (batch 1) + 4 (batch 2), each new set hardened by **3 rounds
of adversarial Opus review**. Full index + breadth matrix:
`storybrain/tagsets/SAMPLE-SET.md`. Machine-readable: `tagsets/batch1.json`,
`batch2.json`. Review logs: `tagsets/reviews/batch{1,2}-round{1,2,3}.md`.

**Breadth achieved:** 6 distinct alien statuses (fallen/living/active/ambiguous/
absent/dormant/hidden), psychic on only 4/10 (per Sam — not piled on), resource
none→core, ten tones, and — the axis the reviews proved decisive — ten distinct
mystery-ORDER meanings (purpose / containment-recipe / provenance / re-sequence /
it-was-us / …), not ten re-skins of #0's death chain.

**The converged blocker (R3-D), with a correction:** the reviewers claimed the
pipeline hard-codes #0. Verified at source — the *validator* (`validateWorld`) is
already theme-agnostic (only checks edges→nodes, ≥3 artifact drops, order =
permutation of fragments), so these seeds VALIDATE today. The coercion is only in
the *generation prompt* (`prompt-canon.md` hard-codes a `caused_by` fall) +
`reconstructFall`'s name. **Next eng task (fully specced):** generalize the canon
prompt to carry a per-seed `order_relation` (`caused_by|enables|prerequisite|
precedes|reveals`), relax the role vocab, rename `reconstructFall`→
`reconstructMystery`. No schema change. Then generate all 10 and run the
finding-09 cross-model blind judge to harden the hybrid claim beyond n=2.
