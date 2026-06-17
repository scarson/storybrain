#!/usr/bin/env bun
// Blind the 10 theme-pairs for judging: for each theme, randomly (seeded) assign
// the pure/hybrid worlds to labels A/B, copy them to blind/<theme>.{A,B}.json with
// any pipeline-identifying provenance fields stripped, and record the secret
// arm→label mapping to blind/MAPPING.json (NEVER given to the judge).
//
// Run:  bun storybrain/corpus/blind.ts
import { mkdirSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname;
const CORPUS = ROOT + "storybrain/corpus/";
mkdirSync(CORPUS + "blind", { recursive: true });

// theme id -> {pure, hybrid} file paths (#0 reuses the Stage-D'd + baseline worlds)
const THEMES: Record<string, { pure: string; hybrid: string }> = {
  "the-living-marrow": { pure: ROOT + "storybrain/hybrid/pure-llm-world.json", hybrid: ROOT + "storybrain/hybrid/hybrid-v2-world.json" },
};
for (const id of ["first-contact-diplomacy","bio-symbiosis-horror","machine-successor","time-war",
  "generation-ship-identity","megastructure-absent-architects","extinction-plague-vector",
  "crowded-trade-federation","uplift-nursery-world"])
  THEMES[id] = { pure: `${CORPUS}${id}.pure.json`, hybrid: `${CORPUS}${id}.hybrid.json` };

// seeded coin (reproducible) — but the mapping file stays secret from the judge
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const coin = rng(20260617);

// strip fields that could leak which pipeline made a world (procgen leaves numbered
// slugs; we can't rename slugs without breaking edges, so we only strip obvious
// provenance and note the residual caveat in the finding).
function sanitize(w: any) {
  delete w._note; delete w._provenance; delete w.pipeline; delete w.arm;
  return w;
}

const mapping: Record<string, { A: string; B: string }> = {};
for (const [id, paths] of Object.entries(THEMES)) {
  let pure: any, hybrid: any;
  try { pure = JSON.parse(await Bun.file(paths.pure).text()); hybrid = JSON.parse(await Bun.file(paths.hybrid).text()); }
  catch (e) { console.error(`SKIP ${id}: ${e}`); continue; }
  const hybridIsA = coin() < 0.5;
  const A = sanitize(hybridIsA ? hybrid : pure);
  const B = sanitize(hybridIsA ? pure : hybrid);
  await Bun.write(`${CORPUS}blind/${id}.A.json`, JSON.stringify(A, null, 2));
  await Bun.write(`${CORPUS}blind/${id}.B.json`, JSON.stringify(B, null, 2));
  mapping[id] = { A: hybridIsA ? "hybrid" : "pure", B: hybridIsA ? "pure" : "hybrid" };
  console.log(`${id}: A=${mapping[id].A}  B=${mapping[id].B}`);
}
await Bun.write(`${CORPUS}blind/MAPPING.json`, JSON.stringify(mapping, null, 2));
console.log(`\nWrote ${Object.keys(mapping).length} blinded pairs + MAPPING.json (secret).`);
