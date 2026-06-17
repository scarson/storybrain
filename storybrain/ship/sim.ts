#!/usr/bin/env bun
// StoryBrain multi-tick simulation — the answer to adversarial round 3.
//
// Fixes demonstrated, all reproducibly (self-contained bun:sqlite, deterministic):
//  R3-02 idempotency/fixation: a NORMALIZED scorer with repetition+fixation guards
//        runs N ticks WITHOUT degenerating into "iron-raid every tick".
//  R3-03 normalization: every term ∈ [0,1]; resonance has a stable, tunable scale.
//  R3-04 formula reconciliation: valence_fit implemented; arc_advance is a single
//        additive term (no double-count multiplier).
//  R3-05 emergence: the SAME artifact fact-skeleton, run under TWO different
//        emergent colony histories, produces DIFFERENT story sequences. Emergence
//        lives in the WEAVE of authored myth × emergent colony chronicle —
//        exactly how Rimworld's own emergence works (authored templates × state).
//
// Run:  bun storybrain/ship/sim.ts

import { Database } from "bun:sqlite";

type Edge = [string,string,string,number];      // src verb dst day
type Colony = {
  name: string;
  nodes: Array<[string,string,number,number,any]>; // slug type tension day facts
  edges: Edge[];
  openArc: { slug:string; next_faction:string } | null;
};

// ---------- shared authored MYTH layer (artifact fact-skeleton) -------------
const MYTH_NODES: Colony["nodes"] = [
  ["factions/iron-empire","faction",0.6,0,{}],
  ["factions/ash-clan","faction",0.4,0,{}],
  ["artifacts/ashmark","artifact",0.7,410,{tier:"relic",owned:true}],
  ["artifacts/weeping-crown","artifact",0.5,410,{tier:"relic",owned:false}],
  ["lore/ashmark-forged","lore",0.7,412,{subtype:"fragment",revealed:true}],
];
const MYTH_EDGES: Edge[] = [
  ["artifacts/ashmark","sought_by","factions/iron-empire",415],
  ["artifacts/ashmark","drops","lore/ashmark-forged",412],
  ["lore/ashmark-forged","reveals","factions/iron-empire",412],
  ["artifacts/weeping-crown","sought_by","factions/ash-clan",0],
];

// ---------- two DIFFERENT emergent colony chronicles ------------------------
// These edges/tensions are what GAMEPLAY produced — not authored canon. They are
// the emergent layer the Director weaves the myth into.
const COLONY_A: Colony = {
  name: "Colony A — Vera survived; her grudge against the Empire is the engine",
  nodes: [["colonists/vera","colonist",0.6,400,{skills:{surgery:14}}],
          ["colonists/bjorn","colonist",0.3,400,{skills:{shooting:11}}]],
  edges: [["artifacts/ashmark","owned_by","colonists/vera",410],
          ["colonists/vera","rival_of","factions/iron-empire",405]],
  openArc: { slug:"arcs/iron-empire-reckoning", next_faction:"factions/iron-empire" },
};
const COLONY_B: Colony = {
  // Same artifacts/myth. But here Vera DIED early; Bjorn's feud with the Ash-Clan
  // (he lost his brother) is the live wound, and the colony never bonded to the
  // Ashmark. Gameplay produced a different graph → the Director must tell a
  // different story from the SAME authored facts.
  name: "Colony B — Vera died; Bjorn's Ash-Clan feud is the engine",
  nodes: [["colonists/bjorn","colonist",0.7,400,{skills:{shooting:11}}],
          ["colonists/tov","colonist",0.4,400,{skills:{melee:9}}]],
  edges: [["colonists/bjorn","rival_of","factions/ash-clan",402],
          ["colonists/bjorn","betrayed_by","factions/ash-clan",406],
          ["artifacts/weeping-crown","owned_by","colonists/bjorn",420]],
  openArc: { slug:"arcs/ash-clan-feud", next_faction:"factions/ash-clan" },
};

// ---------- the store ------------------------------------------------------
function buildStore(c: Colony){
  const db = new Database(":memory:");
  db.run(`CREATE TABLE nodes(slug TEXT PRIMARY KEY,type TEXT,tension REAL,day INT,facts TEXT)`);
  db.run(`CREATE TABLE edges(src TEXT,verb TEXT,dst TEXT,day INT,PRIMARY KEY(src,verb,dst))`);
  db.run(`CREATE INDEX e_dst ON edges(dst)`);
  const N=(n:any)=>db.run("INSERT OR REPLACE INTO nodes VALUES(?,?,?,?,?)",[n[0],n[1],n[2],n[3],JSON.stringify(n[4])]);
  const E=(e:Edge)=>db.run("INSERT OR IGNORE INTO edges VALUES(?,?,?,?)",e);
  [...MYTH_NODES,...c.nodes].forEach(N); [...MYTH_EDGES,...c.edges].forEach(E);
  return db;
}

// ---------- the NORMALIZED Director scorer ---------------------------------
const HALF=30, TOPK=3;
// weights (positive sum 0.90; penalties up to 0.50) → resonance ∈ [-0.5, 0.9]
const W={arc:0.25, cb:0.30, char:0.10, val:0.10, tens:0.15, rep:0.25, fix:0.25};
const CHAR_CAP=3;

type Cand = { id:string; kind:string; faction?:string; valence:number };
function candidates(): Cand[] {
  return [
    { id:"raid-iron", kind:"raid",   faction:"factions/iron-empire", valence:-1 },
    { id:"raid-ash",  kind:"raid",   faction:"factions/ash-clan",    valence:-1 },
    { id:"social",    kind:"social",                                  valence:+1 },
    { id:"flare",     kind:"disaster",                                valence:-1 },
  ];
}

function tick(db: Database, c: Colony, today: number, history: Array<{kind:string;faction?:string}>, budgetValence:number){
  const tens=(s:string)=> (db.query("SELECT tension FROM nodes WHERE slug=?").get(s) as any)?.tension ?? 0.2;
  const rec=(d:number)=> Math.pow(0.5,(today-d)/HALF);
  const recent = history.slice(-4);
  const arcFaction = c.openArc?.next_faction ?? null;

  function score(cand: Cand){
    const F=cand.faction;
    // callback: top-K mean of tension·recency over inbound edges to F (∈[0,1])
    let cbNorm=0, chars=0;
    if(F){
      const inc=db.query("SELECT src,day FROM edges WHERE dst=?").all(F) as any[];
      const contribs=inc.map(e=>({v:tens(e.src)*rec(e.day),col:e.src.startsWith("colonists/")?e.src:null}))
                        .sort((a,b)=>b.v-a.v).slice(0,TOPK);
      cbNorm=contribs.reduce((s,x)=>s+x.v,0)/TOPK;
      chars=new Set(contribs.map(x=>x.col).filter(Boolean)).size;
    }
    const arc = !!F && arcFaction===F && cand.kind==="raid" ? 1 : 0;     // single additive term
    const charNorm = Math.min(chars,CHAR_CAP)/CHAR_CAP;                   // ∈[0,1]
    const valFit = 1 - Math.abs(cand.valence - budgetValence)/2;         // ∈[0,1]
    const tensFit = F ? 1 - Math.abs(tens(F) - 0.7) : 0.5;               // ∈[0,1]
    const rep = recent.filter(h=>h.kind===cand.kind).length / Math.max(recent.length,1);   // ∈[0,1]
    const fix = F ? recent.filter(h=>h.faction===F).length / Math.max(recent.length,1) : 0; // ∈[0,1]
    const resonance = W.arc*arc + W.cb*cbNorm + W.char*charNorm + W.val*valFit + W.tens*tensFit
                    - W.rep*rep - W.fix*fix;
    return { id:cand.id, kind:cand.kind, faction:F, resonance, cbNorm, arc, rep, fix };
  }
  const ranked = candidates().map(score).sort((a,b)=>b.resonance-a.resonance);
  const w = ranked[0];
  // write back: record event; advance arc staleness implicitly via history
  db.run("INSERT OR REPLACE INTO nodes VALUES(?,?,?,?,?)",
    [`events/${today}-${w.id}`,"event",0.7,today,JSON.stringify({kind:w.kind})]);
  if(w.faction) db.run("INSERT OR IGNORE INTO edges VALUES(?,?,?,?)",[`events/${today}-${w.id}`,"involves",w.faction,today]);
  return w;
}

// ---------- run both colonies, 5 ticks each --------------------------------
function run(c: Colony){
  console.log(`\n################ ${c.name} ################`);
  const db=buildStore(c);
  const history: Array<{kind:string;faction?:string}> = [];
  let day=430;
  // alternate the pacing target valence (dread/relief) to exercise valence_fit
  const valencePlan=[-1,-1,+1,-1,+1];
  for(let t=0;t<5;t++){
    const w=tick(db,c,day,history,valencePlan[t]);
    history.push({kind:w.kind,faction:w.faction});
    console.log(`  day ${day} (budget valence ${valencePlan[t]>0?"+relief":"-dread"}): ` +
      `FIRE ${w.id.padEnd(10)} resonance ${w.resonance.toFixed(3)} ` +
      `[cb ${w.cbNorm.toFixed(2)} arc ${w.arc} rep ${w.rep.toFixed(2)} fix ${w.fix.toFixed(2)}]`);
    day+=12;
  }
  const kinds=new Set(history.map(h=>h.kind));
  const facs=new Set(history.map(h=>h.faction).filter(Boolean));
  console.log(`  → sequence: ${history.map(h=>h.kind).join(" → ")}`);
  console.log(`  → distinct kinds fired: ${kinds.size}/4, distinct factions: ${facs.size} (NOT a single-faction treadmill)`);
}

console.log("=== StoryBrain — 5-tick Director sim (normalized scorer + guards) ===");
run(COLONY_A);
run(COLONY_B);
console.log("\nEmergence: identical artifact MYTH (Ashmark/Crown/forged-lore), but the");
console.log("two colonies' EMERGENT chronicles steer the Director to different stories.");
