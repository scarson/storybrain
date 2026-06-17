# StoryBrain — Adversarial Review, Round 3 of 3 (FINAL)

> Hostile expert review of `storybrain/DESIGN.md` (v4). Mandate: VERIFY rounds 1–2
> fixes are actually resolved in v4, then find what is STILL wrong, NEWLY broken by
> v4's changes, or never addressed. Do not re-litigate resolved findings; verify
> them. Each finding appended as discovered (container may restart). Severity:
> FATAL / HIGH / MEDIUM / LOW.

## Method

- Read DESIGN.md v4 in full; rounds 1 & 2 reviews; findings 01–04; the actual
  prototype code (`director.ts`, `seed.sh`, generated `world.json`); DECISIONS.md.
- Re-derived the prototype scores by hand to check the finding-03 claims and
  whether the result is cherry-picked by construction.
- Attacked the emergence claim, the procgen hand-wave, reveal-order determinism,
  the §0 recommendation, and v4-internal consistency.

## Findings

<!-- appended below as discovered -->
