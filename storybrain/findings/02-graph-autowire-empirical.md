# Finding 02 — The typed graph works, but NOT the way DESIGN v2 claimed

**This is the empirical resolution of adversarial finding R1-01 (FATAL).** Run
against a real PGLite brain (gbrain 0.42.47.0) with `storybrain-base` active.
Reproduction commands and exact outputs below.

## Setup that worked (itself a finding)

- `GBRAIN_HOME` is a **parent** dir; gbrain appends `.gbrain`. Packs live at
  `$GBRAIN_HOME/.gbrain/schema-packs/<name>/pack.yaml` (NOT a flat file).
- The pack loader **rejects flow-style YAML** (`{ name: x, inverse: y }`) and
  inline list comments. Must be pure block style. (First draft failed with 31
  Zod errors; block-style rewrite validated clean: 12 page types, 31 link verbs.)
- `gbrain init --pglite --no-embedding` stands up a brain in ~seconds with no API
  key. `schema use storybrain-base` activates it. Both confirmed.

## Test A — prose wikilinks in custom dirs: **NO edges (R1-01 CONFIRMED)**

Wrote a lore page whose body contained `[[colonist/vera]]`,
`[[artifact/ashmark]]`, `[[faction/iron-empire]]`:

```
gbrain graph lore/ashmark-forged --depth 2
→ "links": []          # ZERO edges extracted
```

Root cause verified in source: `src/core/link-extraction.ts:86`
```
const DIR_PATTERN = '(?:people|companies|meetings|concepts|deal|civic|project|
projects|source|media|yc|tech|finance|personal|openclaw|entities)';
```
Our dirs (`colonists`, `artifacts`, `factions`, `lore`, `events`, `arcs`, …) are
NOT in it, so the qualified/unqualified wikilink regexes never match. They fall
to the generic `[[bare-name]]` pass (`WIKILINK_GENERIC_RE`), which (a) is gated
behind opt-in global-basename resolution (default OFF) and (b) emits an UNTYPED
`wikilink_basename` edge, never our verbs. Editing the pack does NOT extend
`DIR_PATTERN`. **The "free self-wiring typed graph from prose" claim is false for
a custom game domain.**

## Test B — explicit typed links with CUSTOM verbs: **WORKS PERFECTLY**

```
gbrain link artifacts/ashmark colonists/vera        --link-type owned_by
gbrain link colonists/vera   factions/iron-empire   --link-type rival_of
gbrain link artifacts/ashmark factions/iron-empire  --link-type sought_by
gbrain link artifacts/ashmark locations/ruins/sunken-vault --link-type hidden_at
gbrain link lore/ashmark-forged artifacts/ashmark   --link-type reveals
```
All return `status: ok`. Then:

```
gbrain graph-query artifacts/ashmark
[depth 0] artifacts/ashmark
  --owned_by-> colonists/vera (depth 1)
    --rival_of-> factions/iron-empire (depth 2)     ← MULTI-HOP works
  --sought_by-> factions/iron-empire (depth 1)
  --hidden_at-> locations/ruins/sunken-vault (depth 1)
```

Custom verbs are accepted as-is (no allowlist), persisted, and traversed
multi-hop. **Zero LLM calls** — `link` is a direct DB write.

## Test C — reverse Director queries: **WORK via direction, not via inverse**

The pack declares `inverse:` for every link type, but inverse edges are **NOT
auto-materialized on write**. `graph-query colonists/vera` shows only the
explicit `rival_of` edge, no `owns` inverse from the `ashmark--owned_by-->vera`
edge. HOWEVER, directional traversal answers the reverse queries:

```
gbrain backlinks factions/iron-empire
→ [{rival_of from colonists/vera}, {sought_by from artifacts/ashmark}]

gbrain graph-query factions/iron-empire --direction in
[depth 0] factions/iron-empire
  <-sought_by-- artifacts/ashmark (depth 1)
    <-reveals-- lore/ashmark-forged (depth 2)
  <-rival_of-- colonists/vera (depth 1)
    <-owned_by-- artifacts/ashmark (depth 2)
```

So the Director's marquee query — *"a raid by faction X: does anyone `rival_of`
them AND do we `own` an artifact they `seek`?"* — is answerable today with
`graph-query --direction in` + a depth-2 walk. **Query Catalog items 1
(open_grudges), 2 (owned_but_sought), 6 (relationship_between), 9
(artifact_provenance) are empirically validated.**

## Corrected thesis (feeds DESIGN v3)

1. The emergent typed graph is **real, zero-LLM, multi-hop, custom-verb** — the
   core bet survives.
2. It is **engine-driven, not prose-driven**: the game emits explicit
   `add_link(src, verb, dst)` calls. For a game this is *better* than prose
   extraction — deterministic, exact, no guessing, no NLP. The engine already
   knows "Vera now rivals the Iron Empire"; it should not have to write a
   sentence and hope an extractor infers it.
3. **Drop the "self-wiring from wikilinks" language entirely.** Replace with
   "explicit typed-edge emission." Optionally: a ~5-line patch adding our dirs to
   `DIR_PATTERN` would enable prose extraction too, but it's unnecessary and
   contradicts "unmodified fork."
4. Reverse queries use **directional traversal**, not materialized inverses. If
   the game wants both directions as first-class outgoing edges, it writes both
   (cheap) — or just queries `--direction in`.
5. The phase-split port spec (embedded SQLite `edges` table) is *strengthened*:
   what we actually rely on is `INSERT INTO edges` + recursive traversal, which
   is trivially portable. We are NOT relying on the prose extractor, so we lose
   nothing by porting.

## What this does to the gbrain-vs-roll-your-own question

It moves the needle toward "roll your own is viable" for the SHIP, because the
single hardest-to-replicate gbrain feature (prose→typed-graph extraction) turns
out not to be usable here anyway. gbrain's remaining differentiated value for the
PROTOTYPE: instant stand-up, the CLI/MCP surface you can drive with an agent,
hybrid search when you do want it, and `think` synthesis for narration. Verdict
from finding 02: **gbrain is an excellent prototyping + design-REPL substrate;
the shipped store is a modest SQLite port.** Consistent with R1-08.
</content>
