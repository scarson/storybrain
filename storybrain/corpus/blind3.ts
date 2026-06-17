#!/usr/bin/env bun
// Blind hybrid-v3 (Stage E: character-deep) vs hybrid-v2 (pre-Stage-E) for all 10.
// Isolates whether the character work raised judged quality. Fresh random A/B;
// secret mapping; strips all _-keys + leftover scaffold fields.
import { readFileSync, writeFileSync } from "node:fs";
const THEMES=["the-living-marrow","first-contact-diplomacy","bio-symbiosis-horror","machine-successor","time-war","generation-ship-identity","megastructure-absent-architects","extinction-plague-vector","crowded-trade-federation","uplift-nursery-world"];
const dir=new URL("./",import.meta.url).pathname;
function san(w:any){for(const k of Object.keys(w))if(k.startsWith("_"))delete w[k];for(const n of w.nodes??[])if(n.facts)for(const k of ["placeholder","abstract_kind","magnitude"])delete n.facts[k];return w;}
const map:Record<string,{A:string;B:string}>={}; let s=773311;
const r=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;};
for(const t of THEMES){
  const v3=san(JSON.parse(readFileSync(`${dir}${t}.hybrid3.json`,"utf8")));
  const v2=san(JSON.parse(readFileSync(`${dir}${t}.hybrid2.json`,"utf8")));
  const aIs3=r()<0.5;
  writeFileSync(`${dir}blind3/${t}.A.json`,JSON.stringify(aIs3?v3:v2,null,2));
  writeFileSync(`${dir}blind3/${t}.B.json`,JSON.stringify(aIs3?v2:v3,null,2));
  map[t]={A:aIs3?"v3":"v2",B:aIs3?"v2":"v3"};
}
writeFileSync(`${dir}blind3/MAPPING.json`,JSON.stringify(map,null,2));
console.log("blinded v3-vs-v2:",JSON.stringify(map));
