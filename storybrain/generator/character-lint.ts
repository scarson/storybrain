#!/usr/bin/env bun
// Character & polish LINT — quality gate beyond validateWorld (which only checks
// loadability). Reports/►enforces the character-depth the corpus analysis found
// missing: colonist skills, a dense colonist<->colonist social graph, named alien
// figures, and the recurring judge nits (lore over-spread, malformed edges).
// Exit 0 if all gates pass, 1 otherwise. Usage: bun character-lint.ts <world.json>
import type { World } from "./schema.ts";
const path = process.argv[2]; if(!path){console.error("usage: character-lint.ts <world>");process.exit(2);}
const w: World = JSON.parse(await Bun.file(path).text());
const issues: string[] = [];
const colonists = w.nodes.filter(n => n.type === "colonist");
const colSlugs = new Set(colonists.map(n => n.slug));
const CHAR_REL = new Set(["kin_of","rival_of","lover_of","ally_of","killed","betrayed","saved","owes","grudge_against",
  // richer directional relationships (v2) — these also power secondhand artifact bonds
  "mentor_of","mentored_by","role_model_of","reveres","protege_of","predecessor_of","successor_of",
  "ancestor_of","descendant_of","commands","served","estranged_from"]);

// 1. every colonist has skills + a want/drive
const noSkill = colonists.filter(n => !(n.facts && (n.facts.skills || n.facts.skill)));
const noWant  = colonists.filter(n => !(n.facts && (n.facts.want || n.facts.drive || n.facts.goal || n.facts.motive)));
if (noSkill.length) issues.push(`${noSkill.length}/${colonists.length} colonists lack skills (need facts.skills): ${noSkill.slice(0,4).map(n=>n.slug).join(", ")}`);
if (noWant.length)  issues.push(`${noWant.length}/${colonists.length} colonists lack a want/drive: ${noWant.slice(0,4).map(n=>n.slug).join(", ")}`);

// 2. colonist<->colonist social graph density >= ~1.0 edge per colonist
const ccEdges = w.edges.filter(e => colSlugs.has(e[0]) && colSlugs.has(e[2]) && CHAR_REL.has(e[1]));
const density = colonists.length ? ccEdges.length / colonists.length : 0;
if (density < 1.0) issues.push(`thin social graph: ${ccEdges.length} colonist<->colonist relationship edges for ${colonists.length} colonists (density ${density.toFixed(2)}, want >=1.0)`);

// 3. at least one named ALIEN character (a colonist tied to an alien faction, or a figure)
const alienFactions = new Set(w.nodes.filter(n => n.type==="faction" && n.facts?.alien_type).map(n=>n.slug));
const alienChars = colonists.filter(n => n.facts && (n.facts.faction && alienFactions.has(n.facts.faction) || n.facts.species==="alien" || n.facts.alien));
if (alienChars.length === 0) issues.push(`no named ALIEN characters (all ${colonists.length} colonists read as human) — add 1-2 alien figures for cross-species drama`);

// 4. lore over-spread: an artifact dropping the SAME fragment as many others dilutes attribution
const drops = w.edges.filter(e => e[1]==="drops");
const fragDroppers: Record<string,number> = {};
for (const e of drops) fragDroppers[e[2]] = (fragDroppers[e[2]]||0)+1;
const overspread = Object.entries(fragDroppers).filter(([,c]) => c > 3);
if (overspread.length) issues.push(`lore over-spread: ${overspread.length} fragments dropped by >3 artifacts (dilutes attribution): ${overspread.slice(0,3).map(([f,c])=>f+"×"+c).join(", ")}`);

// 5. malformed edges (object-as-subject of a person verb, e.g. artifact owns faction)
const typeOf = new Map(w.nodes.map(n=>[n.slug,n.type]));
const PERSON_SUBJ = new Set(["owns","rival_of","betrayed","kin_of","lover_of","wants","commands"]);
const malformed = w.edges.filter(e => PERSON_SUBJ.has(e[1]) && ["artifact","faction","lore","location"].includes(typeOf.get(e[0])||"") && e[1]!=="owns" ? false : (e[1]==="owns" && typeOf.get(e[2])==="faction"));
if (malformed.length) issues.push(`malformed edges (e.g. X owns a faction): ${malformed.slice(0,3).map(e=>e.join(" ")).join("; ")}`);

if (issues.length === 0) {
  console.log(`CHARACTER-OK: ${colonists.length} colonists, ${ccEdges.length} social edges (density ${density.toFixed(2)}), ${alienChars.length} alien chars.`);
  process.exit(0);
} else {
  console.error(`CHARACTER-LINT: ${issues.length} issue(s):`); for(const i of issues) console.error("  - "+i);
  process.exit(1);
}
