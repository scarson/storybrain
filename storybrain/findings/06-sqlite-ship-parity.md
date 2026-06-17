# Finding 06 — The SQLite ship store works and matches gbrain (the §0 recommendation, proven)

The committed recommendation (DESIGN §0) is "build a small SQLite `edges` store;
gbrain is only a prototype REPL." This finding makes that concrete and tested.
Code: `storybrain/ship/storybrain.ts` (self-contained, `bun:sqlite`, no gbrain).
Run: `bun storybrain/ship/storybrain.ts`.

## What it is

~200 lines implementing the ENTIRE World-Memory the Director needs:
- **Schema:** `nodes(slug,type,body,facts JSON,tension,day)` + `edges(src,verb,dst,
  day)` + indices + an FTS5 lore index (available in bun's SQLite).
- **All 10 catalog queries (DESIGN §10)** as plain SQL, including recursive CTEs
  for `causal_chain` (caused_by*) and `relationship_between` (shortest typed path).
- **The Director tick** with the top-K scorer (finding 05).

## Parity results (verbatim)

Catalog queries return correct answers against the seeded world, e.g.:
- `open_grudges(iron-empire)` → vera (rival_of).
- `owned_but_sought()` → ashmark / iron-empire.
- `causal_chain(famine)` → famine → blight → sabotage (recursive CTE).
- `relationship_between(ashmark, iron-empire)` → `-sought_by->` path.
- `artifact_provenance(ashmark)` → forged_by grey-smith, owned_by vera.
- `who_has_skill(surgery)` → vera (14) — a JSON skill-stat lookup, NOT retrieval.

Director tick:
```
   raid-iron  3.197      ← IDENTICAL to the gbrain prototype (finding 03)
   raid-ash   0.489
   flare      0.210
   → WINNER: raid-iron
```

The SQLite store reproduces the gbrain prototype's exact Director score (3.197) and
pick. **Behavioral parity confirmed.**

## What this proves

1. **The port is real and tiny.** The "gbrain → SQLite" graduation (R1-08, R2-07)
   isn't hand-waving: it's ~200 lines, in-process, no Bun runtime to ship, no WASM
   Postgres, no HTTP sidecar — exactly what a Unity/Godot/C++ game can embed
   (SQLite or libSQL bindings exist for all of them).
2. **gbrain adds nothing the ship needs here.** Every catalog query is plain SQL /
   a recursive CTE; gbrain's `traverse_graph` IS such a CTE. The features gbrain
   uniquely provides (hybrid RRF, LLM contradiction, salience, trajectory) are all
   discarded by this use case.
3. **The recommendation is now evidence-backed, not asserted.** §0 says "build
   SQLite"; this is the SQLite, working, matching the prototype.

## Remaining honest gaps (not closed here)

- No write-throughput / async-batch path benchmarked (still a pre-ship TODO).
- Lore GENERATION (the fact-skeleton authoring/procgen, DESIGN §5) is modeled in
  the schema (`facts` JSON, `revealed` flag) but the generative content pipeline
  itself is unbuilt — that's the real remaining work, and it's game-design +
  content, not store engineering.
- The blind-rater "feels authored" metric is still unrun.

## Verdict

The store half of StoryBrain is **done and proven portable** — gbrain prototype
and SQLite ship store agree to the third decimal. What's left is the genuinely
hard, genuinely game-specific half: how the game stamps `tension`, and how lore
fact-skeletons are authored/generated (DESIGN §5). Neither is a store problem;
both are the friend's game-design work.
</content>
