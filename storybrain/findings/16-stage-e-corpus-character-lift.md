# Finding 16 — Stage E applied to all 10: a measurable character-depth lift

Answers "how do we make the best versions better?" — executed across the whole
corpus, not just described. Every winning world got a Stage-E "characters & polish"
pass, gated by `character-lint.ts`. Result: **all 10 go from 4–6 character-depth
issues each to CHARACTER-OK.**

## Before → after (objective, corpus-wide)

| metric | hybrid-v2 (before) | hybrid-v3 (after, Stage E) |
|---|---|---|
| worlds passing character-lint | **0 / 10** | **10 / 10** |
| colonists with skill stats | ~0 (only gen-ship) | **65 / 65** |
| colonist↔colonist social edges | thin (1–4/world) | **111 total, avg density 1.71/colonist** |
| named alien characters | ~0 | **24** (2–5/world) |

Per world (`col / social-edges / density / alien`): marrow 6/10/1.67/2 ·
first-contact 9/13/1.44/5 · bio-symbiosis 6/12/2.00/2 · machine 6/12/2.00/2 ·
time-war 6/9/1.50/2 · gen-ship 6/11/1.83/2 · megastructure 6/12/2.00/2 ·
plague 7/11/1.57/2 · trade 6/9/1.50/2 (was 0.25) · uplift 7/12/1.71/3.

Polish also landed everywhere: lore over-spread fixed (no fragment dropped by >3
artifacts), malformed/inverted edges removed (the f12 `colonist owns factions/*`
slot error, object-as-subject person-verbs), slug prefixes normalized.

## What got added (the emergent-drama fuel)

1. **Skills + passions + a concrete `want`** on every colonist — Rimworld-style,
   role-fitted (decoder research 20, scout shooting 18, envoy social 19), and
   Director-queryable via `who_has_skill`.
2. **A dense, story-bearing social graph** — kin/rival/lover/owes/grudge among the
   cast, wired into the arc, not random. Representative relationships the Stage-E
   agents produced (these are the payload):
   - **marrow:** Bren *owes* Vask a debt chaining him to the doomsday drill; Vask
     *betrayed* him on the safe-quota promise; Bren's *lover* Yuki is racing to
     stop that very drill.
   - **bio-symbiosis:** the "first whole host" is medic Elias's own grafted
     mentor/kin — the thing his creed calls a death wearing her face.
   - **time-war:** Okonkwo *loves* Sael, an envoy who grieves her *before* they
     part — a romance running backward through time.
   - **gen-ship:** the Mercy Vault opens for Iris because she shares blood with the
     ancestor-recording she's raising — the "it was us" reveal lands through kinship.
   - **trade:** Mara *owes* the alien navigator who broke caste to write the one
     un-forgeable record — a cross-species debt around the load-bearing artifact.
3. **Named alien characters** fit to each theme's status — living emissaries
   (first-contact, trade), dormant sleepers whose waking is the breach (plague),
   recorded/ancestral traces (gen-ship, megastructure), an indifferent
   machine-subprocess anomaly (machine), out-of-time figures (time-war), a glimpsed
   gardener / a ripening colonist-child (uplift) — each with ≥1 cross-species tie.

## Why this is the right "make it better" lever

The corpus analysis (finding 15) showed characters were the thinnest layer, and the
judges had repeatedly credited hybrid-v2's *present-tense wiring* for its wins.
Stage E deepens exactly that: it turns a static cast into a social graph the
Director can weave, gives colonists gameplay-real stats, and makes the alien side
populated by individuals (so cross-species drama exists). It runs on EITHER arm —
applying it to pure would close pure's biggest deficit (its near-inert cast) too.

## Status & honest next step

Objective character depth is lifted and enforced (lint-gated) across all 10 worlds.
What is NOT yet measured: whether the added depth raises *judged* quality. The
clean comparative re-judge — **hybrid-v3 vs hybrid-v2** (does Stage E lift the
score?) and/or **hybrid-v3 vs pure** (new state of the art) — is the queued
confirmation; the blinded harness + leak-free sanitizer are ready. Expectation:
positive, since judges reward present-tense character wiring, but it must be
measured, not assumed. (Cross-model second judge still pending Codex availability.)
</content>
