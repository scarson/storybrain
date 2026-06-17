#!/usr/bin/env bun
// Blind hybrid-v2 (abstract procgen) vs pure for all 10 themes. Fresh random A/B
// per theme; secret mapping recorded. Sanitizes ALL _-prefixed keys + leftover
// scaffold fields so the judge can't infer the arm.
import { readFileSync, writeFileSync } from "node:fs";
const THEMES = ["the-living-marrow","first-contact-diplomacy","bio-symbiosis-horror",
  "machine-successor","time-war","generation-ship-identity","megastructure-absent-architects",
  "extinction-plague-vector","crowded-trade-federation","uplift-nursery-world"];
const dir = new URL("./", import.meta.url).pathname;
function sanitize(w: any) {
  for (const k of Object.keys(w)) if (k.startsWith("_")) delete w[k];
  for (const n of w.nodes ?? []) if (n.facts) for (const k of ["placeholder","abstract_kind","magnitude"]) delete n.facts[k];
  return w;
}
const mapping: Record<string,{A:string;B:string}> = {};
let seed = 20260617;
const rnd = () => { seed = (seed*1103515245+12345) & 0x7fffffff; return seed/0x7fffffff; };
for (const t of THEMES) {
  const hyb = sanitize(JSON.parse(readFileSync(`${dir}${t}.hybrid2.json`,"utf8")));
  const pur = sanitize(JSON.parse(readFileSync(`${dir}${t}.pure.json`,"utf8")));
  const hybIsA = rnd() < 0.5;
  writeFileSync(`${dir}blind2/${t}.A.json`, JSON.stringify(hybIsA?hyb:pur,null,2));
  writeFileSync(`${dir}blind2/${t}.B.json`, JSON.stringify(hybIsA?pur:hyb,null,2));
  mapping[t] = { A: hybIsA?"hybrid2":"pure", B: hybIsA?"pure":"hybrid2" };
}
writeFileSync(`${dir}blind2/MAPPING.json`, JSON.stringify(mapping,null,2));
console.log("blinded 10 themes. mapping:", JSON.stringify(mapping));
