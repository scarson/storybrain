#!/usr/bin/env bun
// SECONDHAND (transitive) bond roller. A character inherits a relationship to an
// artifact THROUGH someone they're tied to: C --R1--> P, and P is tied to the
// artifact A (made it, held it, died for it, covets it, is its maker-people). The
// secondhand bond's TYPE and VALENCE are a function of the PAIR (R1, R2) — your
// ancestor forged it → you're heir_to it; your mentor died for it → you must_finish
// it; your rival covets it → you deny_to them; your dead lover bonded to it → you
// grieve_through it. Unforced by construction: the chain must actually exist.
//
// Run: bun storybrain/generator/bond-roller-secondhand.ts <world.json> [seed]

type Node={slug:string;type:string;facts?:any}; type Edge=[string,string,string,number?];
const path=process.argv[2]; const SEED=Number(process.argv[3]??7);
if(!path){console.error("usage: bond-roller-secondhand.ts <world>");process.exit(2);}
const w=JSON.parse(await Bun.file(path).text()) as {nodes:Node[];edges:Edge[]};
const T=new Map(w.nodes.map(n=>[n.slug,n.type]));
const isArt=(s:string)=>T.get(s)==="artifact"; const isCol=(s:string)=>T.get(s)==="colonist";
const facts=(s:string)=>w.nodes.find(n=>n.slug===s)?.facts??{};
function rng(s0:number){let s=s0>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const r=rng(SEED);

// social edges OUT of a colonist (C --R1--> P). Includes the richer vocabulary.
const SOCIAL=new Set(["kin_of","descendant_of","ancestor_of","successor_of","predecessor_of",
  "mentored_by","mentor_of","reveres","role_model_of","protege_of","lover_of","rival_of",
  "grudge_against","owes","ally_of","betrayed_by","served","commands","estranged_from"]);
// artifact-side relations (P --R2--> A) OR ownership facts. Plus maker-people path.
const ARTREL=new Set(["forged","forged_by","owned","owned_by","wielded","bonded_to","covets",
  "heir_to","sought_by","destroyed","sealed","died_for","haunted_by","created"]);

// closeness of the carrier relationship (how strongly it transmits)
const CLOSE:Record<string,number>={kin_of:1,descendant_of:1,ancestor_of:.9,successor_of:.8,predecessor_of:.7,
  lover_of:.95,mentored_by:.85,mentor_of:.8,reveres:.8,role_model_of:.8,protege_of:.8,
  rival_of:.7,grudge_against:.75,betrayed_by:.8,owes:.6,ally_of:.5,served:.6,commands:.55,estranged_from:.7};
const INTENS:Record<string,number>={forged:1,forged_by:1,created:1,died_for:1,destroyed:1,bonded_to:.85,
  wielded:.8,owned:.7,owned_by:.7,heir_to:.7,sealed:.7,haunted_by:.7,covets:.6,sought_by:.55};

// (carrier-class, artifact-class) -> secondhand bond type. carrier-class groups R1.
function carrierClass(R1:string){
  if(["kin_of","descendant_of","ancestor_of","successor_of","predecessor_of"].includes(R1))return "lineage";
  if(["mentored_by","mentor_of","reveres","role_model_of","protege_of"].includes(R1))return "legacy";
  if(["rival_of","grudge_against","betrayed_by","estranged_from"].includes(R1))return "antagonism";
  if(["lover_of"].includes(R1))return "grief";
  if(["owes","served","commands","ally_of"].includes(R1))return "obligation";
  return "tie";
}
function artClass(R2:string){
  if(["forged","forged_by","created","wielded","bonded_to","owned","owned_by","heir_to"].includes(R2))return "held";
  if(["died_for","destroyed","sealed","haunted_by"].includes(R2))return "fate";
  if(["covets","sought_by"].includes(R2))return "wants";
  return "held";
}
// the secondhand relation name from (carrierClass, artClass)
const MAP:Record<string,Record<string,string>>={
  lineage:{held:"heir_to",fate:"burdened_by",wants:"inherits_the_hunt_for"},
  legacy:{held:"lives_up_to",fate:"must_finish",wants:"chases_their_mentors_dream_of"},
  antagonism:{held:"spites",fate:"vindicated_by",wants:"denies_to"},
  grief:{held:"grieves_through",fate:"mourns_through",wants:"haunted_by_their_wish_for"},
  obligation:{held:"obligated_over",fate:"bound_by",wants:"owes_the_pursuit_of"},
  tie:{held:"recognizes",fate:"marked_by",wants:"drawn_to"},
};

// resolve P's ties to artifacts: direct (P--R2-->A), individual-maker (A--forged_by/owned_by-->P),
// or maker-people (P.faction==F and A--forged_by/owned_by-->F).
function pArtifactTies(P:string):{a:string;R2:string;via:string}[]{
  const out:{a:string;R2:string;via:string}[]=[];
  for(const e of w.edges){
    if(e[0]===P && ARTREL.has(e[1]) && isArt(e[2])) out.push({a:e[2],R2:e[1],via:"direct"});
    if(isArt(e[0]) && (e[1]==="forged_by"||e[1]==="owned_by") && e[2]===P) out.push({a:e[0],R2:e[1]==="forged_by"?"forged":"owned",via:"as maker/holder"});
  }
  const fac=facts(P).faction;
  if(fac) for(const e of w.edges) if(isArt(e[0])&&(e[1]==="forged_by"||e[1]==="owned_by")&&e[2]===fac)
    out.push({a:e[0],R2:e[1]==="forged_by"?"forged":"owned",via:`their people (${fac.split("/").pop()})`});
  return out;
}

const THRESHOLD=0.5;
console.log(`=== Secondhand bonds on ${path.split("/").pop()} (seed ${SEED}) ===`);
const seen=new Set<string>(); let formed=0;
for(const C of w.nodes.filter(n=>n.type==="colonist")){
  for(const e of w.edges){
    if(e[0]!==C.slug || !SOCIAL.has(e[1]) || !isCol(e[2])) continue;
    const P=e[2], R1=e[1];
    for(const {a,R2,via} of pArtifactTies(P)){
      if(a===undefined) continue;
      const transmission=(CLOSE[R1]??.5)*(INTENS[R2]??.5);
      if(transmission<THRESHOLD) continue;
      const rel=MAP[carrierClass(R1)][artClass(R2)];
      const key=C.slug+"|"+rel+"|"+a; if(seen.has(key))continue; seen.add(key);
      const Pn=P.split("/").pop(), An=a.split("/").pop();
      console.log(`★ ${C.slug.split("/").pop()} --${rel}--> ${An}  (via ${Pn}, ${R1.replace(/_/g," ")}; ${Pn} ${R2.replace(/_/g," ")} it ${via==="direct"?"":"— "+via}; transmission ${transmission.toFixed(2)})`);
      formed++;
    }
  }
}
if(formed===0) console.log("  (no secondhand chains — cast lacks carrier→artifact links; needs richer relationship edges)");
console.log(`\nformed ${formed} secondhand bond(s). Each required a real C→P→artifact chain (unforced).`);
