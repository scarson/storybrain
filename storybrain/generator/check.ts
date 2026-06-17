#!/usr/bin/env bun
// Validate a generated world JSON against the schema contract. Used by the
// generator (self-check loop) and CI. Exits nonzero with precise errors on
// failure — NO silent success (the R3-01 lesson).
import { validateWorld, type World } from "./schema.ts";
const path = process.argv[2] ?? new URL("./world-scifi.json", import.meta.url).pathname;
let w: World;
try { w = JSON.parse(await Bun.file(path).text()); }
catch (e) { console.error(`cannot read/parse ${path}: ${e}`); process.exit(2); }
const r = validateWorld(w);
if (r.ok) {
  const n = w.nodes.length, e = w.edges.length, m = w.mystery.fragments.length;
  const arts = w.nodes.filter(x => x.type === "artifact").length;
  const civs = w.nodes.filter(x => x.type === "faction" && x.facts?.alien_type).length;
  console.log(`VALID: ${n} nodes (${arts} artifacts, ${civs} alien civs), ${e} edges, ${m} mystery fragments.`);
  process.exit(0);
} else {
  console.error(`INVALID (${r.errors.length} errors):`);
  for (const err of r.errors) console.error("  - " + err);
  process.exit(1);
}
