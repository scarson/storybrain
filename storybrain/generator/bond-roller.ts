#!/usr/bin/env bun
// Artifact <-> character BOND ROLLER. When an item is discovered, this rolls a
// POTENTIAL relationship to an existing character — but ONLY where they already
// resonate on a concrete signal, and it DECLINES (no bond) when nothing fits. That
// gate is what makes the links feel earned, not forced.
//
// Philosophy (same as the Director's resonance scorer): never roll flat. Enumerate
// (character, relation) candidates, score each by FIT to real fields (skills,
// want, provenance, faction, curse), keep only fit>=threshold, then seeded-weighted
// roll among the survivors with a dramatic bonus for links that create tension or
// advance an arc. No survivor -> the item stays an item.
//
// Run: bun storybrain/generator/bond-roller.ts <world.json> [seed]

type Node={slug:string;type:string;facts?:any};
type Edge=[string,string,string,number?];
const path=process.argv[2]; const SEED=Number(process.argv[3]??7);
if(!path){console.error("usage: bond-roller.ts <world.json> [seed]");process.exit(2);}
const w=JSON.parse(await Bun.file(path).text()) as {nodes:Node[];edges:Edge[]};
const bySlug=new Map(w.nodes.map(n=>[n.slug,n]));
const cast=w.nodes.filter(n=>n.type==="colonist");
const arts=w.nodes.filter(n=>n.type==="artifact");
const out=(s:string,v:string)=>w.edges.filter(e=>e[0]===s&&e[1]===v).map(e=>e[2]);
const social=(c:string)=>w.edges.filter(e=>e[0]===c&&["kin_of","rival_of","grudge_against","owes","lover_of","ally_of","member_of"].includes(e[1]));
function rng(seed:number){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const r=rng(SEED);
const sk=(c:Node,...keys:string[])=>Math.max(0,...keys.map(k=>(c.facts?.skills?.[k]??0)))/20;
const wantHas=(c:Node,...kw:string[])=>{const t=(c.facts?.want??"").toLowerCase();return kw.some(k=>t.includes(k))?1:0;};
const artText=(a:Node)=>((a.facts?.title||"")+" "+(a.facts?.detail||"")+" "+(a.facts?.archetype||"")).toLowerCase();

// the (relation -> fit) candidate set for one (character, artifact)
function candidates(c:Node,a:Node){
  const cands:{rel:string;fit:number;why:string}[]=[];
  const arche=(a.facts?.archetype||"").toLowerCase();
  const maker=out(a.slug,"forged_by").concat(out(a.slug,"owned_by"));      // who made/held it
  const seekers=out(a.slug,"sought_by");
  const curses=out(a.slug,"bears"); const powers=out(a.slug,"grants");
  const soc=social(c.slug);
  const tiedTo=(slug:string)=>soc.find(e=>e[2]===slug);
  const isOfFaction=(f:string)=> c.facts?.faction===f || soc.some(e=>e[1]==="member_of"&&e[2]===f);

  // 1) PROVENANCE — the strongest "makes sense": the item is tied to someone the
  //    character is tied to (their maker's people, kin, or rival).
  for(const m of maker){
    if(isOfFaction(m)) cands.push({rel:"heir_to",fit:0.9,why:`it was made by their own people (${m.split("/").pop()})`});
    const t=tiedTo(m);
    if(t){ const v=t[1];
      if(["kin_of"].includes(v)) cands.push({rel:"heir_to",fit:0.85,why:`its maker ${m.split("/").pop()} is their kin`});
      else if(["rival_of","grudge_against"].includes(v)) cands.push({rel:"vendetta_over",fit:0.8,why:`its maker ${m.split("/").pop()} is someone they ${v.replace("_"," ")}`});
      else cands.push({rel:"recognizes",fit:0.62,why:`its maker ${m.split("/").pop()} is tied to them (${v})`});
    }
  }
  for(const f of seekers){ const t=tiedTo(f); if(t&&["rival_of","grudge_against"].includes(t[1]))
    cands.push({rel:"denies_to",fit:0.72,why:`a faction they ${t[1].replace("_"," ")} (${f.split("/").pop()}) also wants it`}); }

  // 2) SKILL/ROLE — the item suits what they're good at.
  if(/codex|tablet|ledger|monument|cylinder|record|archive|stele|chart|log/.test(arche)||/inscri|decode|writ|glyph|map/.test(artText(a)))
    { const s=sk(c,"xeno","research","sensors"); if(s>0) cands.push({rel:"decoded",fit:0.4+0.5*s,why:`a ${c.facts?.crew_role||c.facts?.role||"specialist"} who reads it (xeno/research ${Math.round(s*20)})`}); }
  if(/weapon|blade|gun|kingsbane|sword|lance/.test(arche+artText(a)))
    { const s=sk(c,"gunnery","combat","melee","eva"); if(s>0) cands.push({rel:"wields",fit:0.4+0.5*s,why:`a fighter who can wield it (${Math.round(s*20)})`}); }
  if(/key|sigil|core|control|engine|loom|machine/.test(arche+artText(a)))
    { const s=sk(c,"engineering","piloting","crafting"); if(s>0) cands.push({rel:"operates",fit:0.4+0.5*s,why:`an engineer who can run it (${Math.round(s*20)})`}); }

  // 3) PASSION/POWER — attunement to what it grants.
  for(const p of powers){ const dom=p.split("/").pop()!.replace(/-/g," ");
    if((c.facts?.passions||[]).some((ps:string)=>dom.includes(ps)||artText(a).includes(ps)))
      cands.push({rel:"attuned_to",fit:0.6,why:`its power resonates with their passion`}); }

  // 4) WANT — they crave exactly what it offers.
  if(wantHas(c,...artText(a).split(/\W+/).filter(x=>x.length>5).slice(0,8)))
    cands.push({rel:"covets",fit:0.66,why:`it speaks directly to their want`});

  // 5) CURSE/VALENCE — it frightens or marks the vulnerable.
  if(curses.length && (wantHas(c,"fear","lose","lost","guilt","grief","afraid","cost")|| sk(c,"life_support","social")<0.35))
    cands.push({rel:"haunted_by",fit:0.58,why:`it bears a curse and they are exposed to it`});

  return cands;
}

const THRESHOLD=0.5;   // below this, NO bond — the unforced gate
const P_BOND=0.7;      // rarity: even with a fit, only sometimes does a bond form
const perChar=new Map<string,number>(); const CAP=2;

console.log(`=== Bond roller on ${path.split("/").pop()} (seed ${SEED}) ===`);
console.log(`cast ${cast.length}, artifacts ${arts.length}. threshold ${THRESHOLD}, p_bond ${P_BOND}, cap ${CAP}/char\n`);
let formed=0, declined=0;
for(const a of arts){
  // who already bonded to this artifact (for the rival_claim dramatic bonus)
  const existingBonders=new Set(w.edges.filter(e=>e[2]===a.slug&&["heir_to","vendetta_over","covets","wields","decoded","operates","attuned_to","haunted_by","recognizes","denies_to"].includes(e[1])).map(e=>e[0]));
  // build scored, gated candidate pool across the cast
  let pool:{c:Node;rel:string;fit:number;why:string;score:number}[]=[];
  for(const c of cast){
    if((perChar.get(c.slug)??0)>=CAP) continue;
    for(const cand of candidates(c,a)){
      if(cand.fit<THRESHOLD) continue;
      let dramatic=0;
      if(existingBonders.size>0) dramatic+=0.3;                 // rival claim tension
      if(pool.some(p=>p.c.slug!==c.slug)) {/* handled below */}
      const score=cand.fit+0.25*dramatic;
      pool.push({c,rel:cand.rel,fit:cand.fit,why:cand.why,score});
    }
  }
  if(pool.length===0){ console.log(`· ${a.slug.split("/").pop()} — no resonant character; stays unbonded (correct: not forced)`); declined++; continue; }
  // rarity gate: sometimes a fitting item still forms no NEW bond
  if(r()>P_BOND){ console.log(`· ${a.slug.split("/").pop()} — ${pool.length} fit candidate(s) but roll declined (rarity)`); declined++; continue; }
  // seeded weighted pick by score; bonus if it creates a rival claim
  pool.sort((x,y)=>y.score-x.score);
  const top=pool.slice(0,3); const tot=top.reduce((s,p)=>s+p.score,0); let pick=r()*tot, chosen=top[0];
  for(const p of top){ pick-=p.score; if(pick<=0){chosen=p;break;} }
  perChar.set(chosen.c.slug,(perChar.get(chosen.c.slug)??0)+1);
  const rival=existingBonders.size>0?`  [+rival claim: ${[...existingBonders][0].split("/").pop()} also bonded]`:"";
  console.log(`★ ${chosen.c.slug.split("/").pop()} --${chosen.rel}--> ${a.slug.split("/").pop()}  (fit ${chosen.fit.toFixed(2)}) — ${chosen.why}${rival}`);
  formed++;
}
console.log(`\nformed ${formed} bond(s), ${declined} item(s) left unbonded. Bonds only where a real signal resonated.`);
