# Finding 01 — storybrain-base.yaml validates against gbrain's real parser

Verified `storybrain/schema/storybrain-base.yaml` field-by-field against
`src/core/schema-pack/manifest-v1.ts` (the Zod schema gbrain actually uses to
load packs):

- `api_version: gbrain-schema-pack-v1` — matches `SCHEMA_PACK_API_VERSION` literal.
- Primitives used (`entity`, `media`, `temporal`, `concept`) are all in the closed
  `PACK_PRIMITIVES` enum `['entity','media','temporal','annotation','concept']`.
  (We don't use `annotation`; fine.)
- `page_types[].{primitive,path_prefixes,subtypes,extractable,expert_routing}` —
  all present and correctly typed. `extractable` accepts `boolean` (v0.38 shape).
- `subtypes[].when` uses `path_pattern` / `frontmatter_field` / `frontmatter_value`
  — exactly the `SubtypeMatchSchema` fields.
- `link_types[].{name,inverse}` — matches `LinkTypeSchema` (inverse optional).
- `gbrain_min_version` matches the required `\d+\.\d+\.\d+(\.\d+)?` regex.
- `takes_kinds` custom values allowed (free string array).
- No `mapping_rules` (greenfield pack, not a migration) — `migration_from` is
  optional, so this is valid.

CONCLUSION: the pack is structurally loadable. The remaining unknown is RUNTIME
behavior (does `gbrain schema use` accept it, does auto-link wire the custom link
types) — to be confirmed in the prototype phase by actually loading it into a
PGLite brain.
