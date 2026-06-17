# Spec — Model-driven fact-skeleton generator for StoryBrain (sci-fi)

> Date: 2026-06-17. Brainstormed + self-approved autonomously (user asleep, standing
> override to self-answer). Feeds `writing-plans-enhanced` next.

## Goal

Generate the StoryBrain world's lore **with an LLM, not by hand** (explicit user
requirement). Produce a coherent sci-fi world fact-skeleton — factions, alien
civilizations, artifacts, figures, locations, lore facts, powers/curses, historical
events — plus the typed edges between them, that **loads into the storybrain
`edges` store (finding 06) and drives the Director**. Artifacts are the spine: each
carries latent lore facts (`revealed:false`) that, when revealed through play,
reconstruct the central mystery.

## Setting (from the user)

Sci-fi. Humans discovering advanced alien civilization(s) **of different types**.
Psychic powers. Ancient mysteries. **Piecing together why a civilization fell.**
**Resource exploitation gone wrong — terribly wrong** (the central mystery's spine).

## Architecture — staged generation (coherence by construction)

```
 Stage 1: CANON SEED  (Opus-class; one call)
   → world bible JSON: 2-3 alien civilizations (distinct TYPES), the central
     mystery decomposed into N "mystery-fragment" facts (the why-it-fell chain),
     3-5 factions (incl. human), key figures, the psychic-power system, a few
     locations. This is the authority.
        │  canon nodes + slugs handed forward
        ▼
 Stage 2: ARTIFACTS  (Haiku/Sonnet-class; batched, canon in context)
   → M artifacts (various archetypes per DESIGN §4.1), each with ≥3 latent facts.
     Each fact, when revealed, points (via edges) at Stage-1 canon (a civ, a
     figure, a mystery-fragment). Instructed: reference ONLY declared canon slugs.
        │
        ▼
 Stage 3: VALIDATE + LINK  (deterministic code, no LLM)
   → reject/repair: every edge dst must be a declared node; every artifact ≥3
     facts; the union of artifact-revealed mystery-fragments must COVER the full
     why-it-fell chain (else regenerate the gap). Emits world-scifi.json.
        │
        ▼
 LOAD → SQLite edges store (ship/storybrain.ts schema) → Director multi-tick run.
```

POC executes Stages 1–2 via the **Agent tool** (a real Claude model call) writing
JSON to disk. Production swaps in the Anthropic API with the identical prompts
(`claude-opus-4-8` seed, `claude-haiku-4-5` artifacts). The prompts + schema +
validator are the portable, reusable artifacts.

## Components (each small, single-purpose)

1. `generator/schema.ts` — the world JSON shape + a deterministic validator
   (nodes, edges, artifact-fact constraints, mystery-coverage check). No LLM.
2. `generator/prompt-canon.md` — Stage-1 prompt (setting + schema + "decompose the
   fall into ordered mystery-fragment facts").
3. `generator/prompt-artifacts.md` — Stage-2 prompt (canon in context; emit
   artifacts whose latent facts reveal canon; reference only declared slugs).
4. `generator/load.ts` — validate → load into SQLite (reuse ship schema) → run a
   Director multi-tick → assert mystery reconstructs via `causal_chain`.
5. `generator/world-scifi.json` — the generated artifact (committed as evidence).

## Data flow / interfaces

- World JSON: `{ nodes: [{slug,type,tension,day,facts}], edges: [[src,verb,dst,day]],
  mystery: {fragments: [slug…], order: [slug…]} }`. Same `nodes`/`edges` shape as
  `ship/storybrain.ts`, so the loader is trivial.
- Validator is the contract between the (non-deterministic) model and the
  (deterministic) store: if it passes, the world is loadable + coherent.

## Error handling

- Model output not valid JSON / missing fields → validator reports precise errors;
  regenerate that stage (bounded retries) or fail loud (NO silent success — the
  R3-01 lesson).
- Edge to undeclared slug → rejected (the consistency guarantee).
- Mystery not fully covered by artifact reveals → flag the missing fragments;
  Stage 2 regenerates artifacts to cover them.

## Testing

- Unit: validator catches bad JSON, dangling edges, under-covered mystery, <3
  facts/artifact (TDD — write these first).
- Integration: generated `world-scifi.json` validates; loads into SQLite; Director
  produces a varied multi-tick sequence (not single-faction treadmill); revealing
  all mystery fragments makes `causal_chain` reconstruct the why-it-fell order.

## Success criteria

1. A real model call generated the facts (Agent tool; production-swappable).
2. Themes present: ≥2 alien civ types, psychic powers, resource-exploitation-gone-
   wrong as the mystery spine, ancient-mystery reconstruction.
3. Validates, loads, Director runs, mystery reconstructs. Recorded in `findings/`.

## Out of scope (YAGNI)

UI, live game integration, real Anthropic API wiring (no key here), procgen rules
engine, multiplayer. One coherent generation→load→drive POC.
</content>
