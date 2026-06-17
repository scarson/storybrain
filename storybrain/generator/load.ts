#!/usr/bin/env bun
// Phase 4: load the LLM-generated world into the SQLite ship store, run the
// Director multi-tick on it, and prove the central mystery reconstructs.
// Run:  bun storybrain/generator/load.ts
import { Database } from "bun:sqlite";
import { validateWorld, reconstructMystery, type World } from "./schema.ts";

const path = new URL("./world-scifi.json", import.meta.url).pathname;
const w: World = JSON.parse(await Bun.file(path).text());
const v = validateWorld(w);
if (!v.ok) { console.error("INVALID world; refusing to load:\n" + v.errors.join("\n")); process.exit(1); }

// ---- load into the ship schema --------------------------------------------
const db = new Database(":memory:");
db.run(`CREATE TABLE nodes(slug TEXT PRIMARY KEY,type TEXT,tension REAL,day INT,facts TEXT)`);
db.run(`CREATE TABLE edges(src TEXT,verb TEXT,dst TEXT,day INT,PRIMARY KEY(src,verb,dst))`);
db.run(`CREATE INDEX e_dst ON edges(dst)`);
for (const n of w.nodes)
  db.run("INSERT OR REPLACE INTO nodes VALUES(?,?,?,?,?)",[n.slug,n.type,n.tension??0.2,n.day??0,JSON.stringify(n.facts??{})]);
for (const e of w.edges)
  db.run("INSERT OR IGNORE INTO edges VALUES(?,?,?,?)",[e[0],e[1],e[2],e[3]??0]);
console.log(`Loaded ${w.nodes.length} nodes, ${w.edges.length} edges into SQLite.\n`);

// ---- a few catalog queries on the GENERATED world -------------------------
const q=(s:string,...a:any[])=>db.query(s).all(...a);
console.log("=== catalog queries on the generated world ===");
console.log("artifact_provenance(kaels-bore-codex):",
  q("SELECT verb,dst FROM edges WHERE src='artifacts/kaels-bore-codex' AND verb IN ('forged_by','owned_by','lost_in','drops') LIMIT 4"));
console.log("who drops the first mystery fragment ("+w.mystery.order[0]+"):",
  q("SELECT src FROM edges WHERE verb='drops' AND dst=?", w.mystery.order[0]).map((r:any)=>r.src));
const civTension = q("SELECT slug,tension FROM nodes WHERE type='faction' ORDER BY tension DESC");
console.log("factions by tension:", civTension);

// ---- Director multi-tick (normalized scorer + top-K + fixation guard) -----
const HALF=40, TOPK=3, W={cb:0.45,char:0.10,tens:0.20,rep:0.25,fix:0.25};
const TODAY = Math.max(...w.nodes.map(n=>n.day??0), 400);
const factions = w.nodes.filter(n=>n.type==='faction').map(n=>n.slug);
const tens=(s:string)=>(db.query("SELECT tension FROM nodes WHERE slug=?").get(s) as any)?.tension??0.2;
const rec=(d:number)=>Math.pow(0.5,(TODAY-d)/HALF);
// callback counts STAKE edges (grudges, seekers, reveals) — NOT the Director's
// own `involves` event bookkeeping, which would otherwise snowball the target's
// score each tick it fires (the finding-05 "count narratable stakes" lesson,
// resurfacing as a feedback loop on a real generated world).
const STAKE_VERBS = new Set(["rival_of","betrayed_by","killed_by","sought_by","owned_by","reveals","worships","forged_by"]);
function callbackTopK(f:string){
  const inc=(db.query("SELECT src,verb,day FROM edges WHERE dst=?").all(f) as any[])
            .filter(e=>STAKE_VERBS.has(e.verb));
  const c=inc.map(e=>({v:tens(e.src)*rec(e.day),col:e.src.startsWith("colonists/")?e.src:null}))
             .sort((a,b)=>b.v-a.v).slice(0,TOPK);
  return {cb:c.reduce((s,x)=>s+x.v,0)/TOPK, chars:new Set(c.map(x=>x.col).filter(Boolean)).size};
}
console.log("\n=== Director: 6 ticks on the generated world ===");
const hist:Array<{kind:string;faction?:string}>=[]; let day=TODAY;
for(let t=0;t<6;t++){
  const recent=hist.slice(-4);
  const cands = [
    ...factions.map(f=>({id:"stir-"+f.split("/")[1], kind:"incursion", faction:f})),
    {id:"discovery", kind:"discovery", faction:undefined as string|undefined},
  ];
  const scored = cands.map(c=>{
    const F=c.faction; const {cb,chars}=F?callbackTopK(F):{cb:0,chars:0};
    const tensFit=F?1-Math.abs(tens(F)-0.7):0.4;
    const rep=recent.filter(h=>h.kind===c.kind).length/Math.max(recent.length,1);
    const fix=F?recent.filter(h=>h.faction===F).length/Math.max(recent.length,1):0;
    return {...c, r: W.cb*cb + W.char*(Math.min(chars,3)/3) + W.tens*tensFit - W.rep*rep - W.fix*fix};
  }).sort((a,b)=>b.r-a.r);
  const win=scored[0];
  hist.push({kind:win.kind,faction:win.faction});
  db.run("INSERT OR REPLACE INTO nodes VALUES(?,?,?,?,?)",[`events/${day}-${win.id}`,"event",0.7,day,"{}"]);
  if(win.faction) db.run("INSERT OR IGNORE INTO edges VALUES(?,?,?,?)",[`events/${day}-${win.id}`,"involves",win.faction,day]);
  console.log(`  day ${day}: FIRE ${win.id.padEnd(22)} r=${win.r.toFixed(3)}`);
  day+=15;
}
console.log("  sequence:", hist.map(h=>h.faction?h.faction.split("/")[1]:h.kind).join(" → "));
console.log("  distinct targets:", new Set(hist.map(h=>h.faction??h.kind)).size, "(not a treadmill)");

// ---- mystery reconstruction (theme-agnostic — uses the declared relation) ---
const REL = w.mystery.order_relation ?? "caused_by";
console.log(`\n=== mystery reconstruction (order relation: ${REL}) ===`);
console.log("Reveal fragments as artifacts are found, then follow the relation:");
for(const f of w.mystery.fragments){ const n=w.nodes.find(x=>x.slug===f); if(n){n.facts=n.facts??{}; n.facts.revealed=true;} }
const chain = reconstructMystery(w);
console.log(`  reconstructed ${REL} chain (mystery.order, all revealed):`);
for(let i=0;i<chain.length;i++) console.log(`    ${i+1}. ${chain[i]}`);
// verify the relation edges connect consecutive fragments (either direction)
let chainOk=true;
for(let i=1;i<w.mystery.order.length;i++){
  const a=w.mystery.order[i-1], b=w.mystery.order[i];
  const linked = (db.query("SELECT 1 FROM edges WHERE src=? AND verb=? AND dst=?").get(b,REL,a))
              || (db.query("SELECT 1 FROM edges WHERE src=? AND verb=? AND dst=?").get(a,REL,b));
  if(!linked) chainOk=false;
}
console.log(`  ${REL} chain connects all consecutive fragments: ${chainOk ? "YES ✓" : "NO"}`);
console.log(`  full mystery reconstructable from artifact finds: ${chain.length===w.mystery.fragments.length ? "YES ✓" : "NO"}`);
