#!/usr/bin/env bun
// Scorer robustness test — proves the Director's pick is INPUT-DRIVEN, not a
// tautology of a world seeded to make one candidate win (addresses R3-03).
//
// Same live graph (real backlinks queries); only the in-memory engine inputs
// (pacing budget, which arc is open, per-node tension) are perturbed across
// scenarios. If the winner changes sensibly with inputs, the scorer responds to
// state rather than hardcoding raid-iron.
//
// Run:  GBRAIN_HOME=/tmp/storybrain-brain bun storybrain/prototype/robustness.ts

import { spawnSync } from "node:child_process";
const ROOT = new URL("../../", import.meta.url).pathname;
function gb(a: string[]) { return spawnSync("bun", ["src/cli.ts", ...a], { cwd: ROOT, encoding: "utf8", env: { ...process.env }, maxBuffer: 1<<24 }).stdout || ""; }
function backlinks(s: string){ try { return JSON.parse(gb(["backlinks", s, "--json"])) as Array<{from_slug:string;link_type:string}>; } catch { return []; } }

type Cand = { id:string; kind:string; faction?:string };
const cands: Cand[] = [
  { id:"raid-iron", kind:"raid", faction:"factions/iron-empire" },
  { id:"raid-ash",  kind:"raid", faction:"factions/ash-clan" },
  { id:"flare",     kind:"disaster" },
];
const HALF=30, ARCW=1.8;
const W={cb:1.0,arc:0.5,char:0.2,tens:0.3};
// TOPK fix: narration cites only a few named stakes, not every edge. Summing ALL
// backlinks lets a hub of many low-tension edges swamp a few high-charge ones
// (volume beats drama). Cap to the top-K highest-contribution edges.
const TOPK = 3;

// per-scenario inputs
type Scn = { name:string; today:number; budget:number;
  openArcFaction:string|null; tension:Record<string,number>; edgeDay:Record<string,number> };
const baseTension={ "colonists/vera":0.5,"colonists/bjorn":0.4,"artifacts/ashmark":0.7,
  "artifacts/weeping-crown":0.5,"lore/ashmark-forged":0.7 };
// many grunts now rival iron-empire (from finding 04 hub); give them low tension
const gruntT:Record<string,number>={}; for(let i=1;i<=60;i++) gruntT[`colonists/grunt-${i}`]=0.1;
const edgeDay={ "lore/ashmark-forged->factions/iron-empire":412,
  "colonists/vera->factions/iron-empire":405,"artifacts/ashmark->factions/iron-empire":415,
  "colonists/bjorn->factions/ash-clan":360 };

const scenarios: Scn[] = [
  { name:"A baseline (arc=iron, budget .7)", today:430, budget:0.7,
    openArcFaction:"factions/iron-empire", tension:{...baseTension,...gruntT}, edgeDay },
  { name:"B open arc switched to ash-clan", today:430, budget:0.7,
    openArcFaction:"factions/ash-clan", tension:{...baseTension,...gruntT}, edgeDay },
  { name:"C no open arc at all", today:430, budget:0.7,
    openArcFaction:null, tension:{...baseTension,...gruntT}, edgeDay },
  { name:"D tensions flipped (ash high, iron low) + no arc", today:430, budget:0.4,
    openArcFaction:null,
    tension:{ "colonists/vera":0.1,"colonists/bjorn":0.9,"artifacts/ashmark":0.1,
      "artifacts/weeping-crown":0.9,"lore/ashmark-forged":0.1,...gruntT }, edgeDay },
];

function recency(key:string, today:number, ed:Record<string,number>){ const d=ed[key]; return d==null?1:Math.pow(0.5,(today-d)/HALF); }
function score(c:Cand, s:Scn, topk:boolean){
  const F=c.faction; const inc=F?backlinks(F):[];
  const contribs = inc.map(e => ({
    v: (s.tension[e.from_slug]??0.2)*recency(`${e.from_slug}->${F}`,s.today,s.edgeDay),
    col: e.from_slug.startsWith("colonists/") ? e.from_slug : null }));
  contribs.sort((a,b)=>b.v-a.v);
  const used = topk ? contribs.slice(0, TOPK) : contribs;
  let raw=0; const cols=new Set<string>();
  for(const x of used){ raw += x.v; if(x.col) cols.add(x.col); }
  const adv = !!F && s.openArcFaction===F && c.kind==="raid";
  const cb = raw*(adv?ARCW:1);
  const tensFit = F ? 1-Math.abs((s.tension[F]??(F==="factions/iron-empire"?0.6:0.4))-s.budget) : 1-Math.abs(0.4-s.budget);
  return W.cb*cb + W.arc*(adv?1:0) + W.char*cols.size + W.tens*tensFit;
}

for(const mode of [false, true]){
  console.log(`\n############ ${mode ? "TOP-"+TOPK+" (fixed)" : "Σ ALL backlinks (broken: volume-dominated)"} ############`);
  for(const s of scenarios){
    const ranked = cands.map(c=>({id:c.id,r:score(c,s,mode)})).sort((a,b)=>b.r-a.r);
    console.log(`[${s.name}]`);
    for(const x of ranked) console.log(`   ${x.id.padEnd(10)} ${x.r.toFixed(3)}`);
    console.log(`   → WINNER: ${ranked[0].id}`);
  }
}
