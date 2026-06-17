# Plan — Model-driven fact-skeleton generator (sci-fi StoryBrain POC)

**Goal:** LLM-generate a coherent sci-fi world (factions, alien civs, artifacts,
lore facts, edges) that loads into the storybrain SQLite store and drives the
Director; artifacts reveal a central mystery (why a civilization fell / resource
exploitation gone terribly wrong).
**Architecture:** staged generation (canon seed → artifacts → validate/link) per
`docs/superpowers/specs/2026-06-17-fact-generator-design.md`.
**Tech stack:** TypeScript, `bun:sqlite`, `bun test`; LLM via Agent tool (POC) /
Anthropic API (prod: `claude-opus-4-8` seed, `claude-haiku-4-5` artifacts).

## Living Document Contract

This plan is a living document. Every executing agent MUST update it as execution
progresses, not only at completion (banners flip to 🚧/✅/⏸ with SHAs). Rationale:
`/writing-plans-enhanced` Step 5 — writing at ship time is cheap; reconstruction is
expensive. (Solo autonomous run; banners kept current for the record.)

## Execution Status
**Overall:** 0/4 phases shipped.

| Phase | Status | Notes |
|---|---|---|
| 1 — schema + validator (TDD) | ⬜ Not started | deterministic, no LLM |
| 2 — generation prompts | ⬜ Not started | canon + artifacts |
| 3 — generate world via model | ⬜ Not started | Agent tool call |
| 4 — load + Director + mystery check | ⬜ Not started | integration |

## Phase 1 — schema + validator (TDD)
**Execution Status:** ⬜ NOT STARTED
- `generator/schema.ts`: types `WorldNode`, `Edge`, `World` + `validateWorld(w)`
  returning `{ok, errors[]}`. Checks: every edge.src/dst is a declared node slug;
  every `artifact` node has ≥3 facts in `facts.latent[]`; `mystery.fragments` all
  exist and are `lore` nodes; mystery coverage = every fragment is the dst of some
  artifact `drops`/`reveals` edge.
- TDD: write `generator/schema.test.ts` FIRST — cases: valid world passes; dangling
  edge fails; artifact with 2 facts fails; uncovered mystery fragment fails.
- Done when `bun test generator/schema.test.ts` green.

## Phase 2 — generation prompts
**Execution Status:** ⬜ NOT STARTED
- `generator/prompt-canon.md`, `generator/prompt-artifacts.md`. Embed the JSON
  schema + setting + the "decompose the fall into ordered mystery-fragment facts"
  and "reference only declared canon slugs" constraints. No code.

## Phase 3 — generate the world via a model
**Execution Status:** ⬜ NOT STARTED
- Dispatch a Claude subagent (Agent tool) with prompt-canon → canon JSON; then with
  canon-in-context + prompt-artifacts → artifacts JSON. Merge → `world-scifi.json`.
- Run `validateWorld`; if errors, regenerate the failing stage (bounded) — fail
  loud on persistent failure (R3-01 lesson: no silent success).

## Phase 4 — load + Director + mystery reconstruction
**Execution Status:** ⬜ NOT STARTED
- `generator/load.ts`: validate → load into the ship SQLite schema → run a
  Director multi-tick (reuse sim scorer) → assert: (a) varied sequence, (b)
  revealing all mystery fragments lets `causal_chain` reconstruct the why-it-fell
  order. Record `findings/08-*.md`.
- After this group: review from ≥3 perspectives; commit + push.

## Pitfalls to avoid (from this session)
- NO silent error-swallowing in generation/validation (R3-01).
- NO unbounded Σ in any scorer reuse — top-K (finding 05).
- Validator is the model↔store contract; if it passes, the world is loadable+coherent.
</content>
