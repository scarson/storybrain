// Blind hybrid2 (abstract-procgen, clothed) vs pure for the 4 retested themes.
import { mkdirSync, writeFileSync } from "node:fs";
const themes = ["uplift-nursery-world","extinction-plague-vector","crowded-trade-federation","generation-ship-identity"];
const dir = new URL("./blind2/", import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
function rng(s:number){return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const r = rng(20260617);
const sanitize=(w:any)=>{for(const k of Object.keys(w))if(k.startsWith("_"))delete w[k];return w;};
const map:Record<string,{A:string,B:string}>={};
for(const t of themes){
  const hybrid=sanitize(JSON.parse(await Bun.file(`storybrain/corpus/${t}.hybrid2.json`).text()));
  const pure=sanitize(JSON.parse(await Bun.file(`storybrain/corpus/${t}.pure.json`).text()));
  const hybridIsA = r()<0.5;
  writeFileSync(`${dir}${t}.A.json`, JSON.stringify(hybridIsA?hybrid:pure,null,2));
  writeFileSync(`${dir}${t}.B.json`, JSON.stringify(hybridIsA?pure:hybrid,null,2));
  map[t]={A:hybridIsA?"hybrid2":"pure",B:hybridIsA?"pure":"hybrid2"};
}
writeFileSync(`${dir}MAPPING.json`, JSON.stringify(map,null,2));
console.log("blinded:", JSON.stringify(map));
