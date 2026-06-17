#!/usr/bin/env bun
// Stage B (v2) — ABSTRACT deterministic procgen. Emits a consistent, dense causal
// TOPOLOGY (entities + dated caused_by event chains + a neutral climax + a mystery
// fragment chain in the configured order_relation) with NO theme-forcing and NO
// leak fields. The LLM (Stage C) then CLOTHES it per theme.
//
// Why this exists (finding 12): the original procgen.ts hard-coded a resource→fall
// mechanic whose labels ("over-extracts", "wars on", "cascade", "the wound"),
// forced status:fallen + fell_to edges, scaffolding fields (wound, from_history),
// and inert numbered *-seer figures LEAKED into the enriched output and degraded
// hybrid judge scores on non-fall themes. This version removes every one of those
// forcing functions while keeping the procgen VALUE: a deterministic, internally
// consistent causal skeleton at a scale the LLM doesn't have to invent or keep
// straight.
//
// Run:  bun storybrain/hybrid/procgen-abstract.ts [seed] <templatesFile> > skeleton.json

import type { World, WorldNode, Edge } from "../generator/schema.ts";
import type { Templates } from "./procgen.ts";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const slug = (t: string, n: string) => `${t}/${n}`;

// Abstract event kinds — NEUTRAL structural roles, not theme actions. Stage C
// renames them. No "war"/"exploit"/"schism"/"cascade".
type AbsKind = "initiative" | "interaction" | "commitment" | "turn";

export function runAbstractProcgen(tpl: Templates, seed: number): World {
  const r = rng(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const nodes: WorldNode[] = [];
  const edges: Edge[] = [];
  const add = (n: WorldNode) => { nodes.push(n); return n.slug; };
  const link = (s: string, v: string, d: string, day: number) => { edges.push([s, v, d, day]); };
  const REL = tpl.order_relation ?? "caused_by";

  // entities: themed names from the template, but NO fate forced. Neutral status
  // the LLM overrides; NO wound / from_history fields shipped.
  add({ slug: "factions/humans", type: "faction", tension: 0.4, facts: { role: "newcomers" } });
  for (const c of tpl.civs)
    add({ slug: slug("civs", c.name), type: "faction", tension: 0.55,
          facts: { alien_type: c.archetype, trait: c.trait } });   // no `status`, no `wound`
  for (const res of tpl.resources)
    add({ slug: slug("locations", res.name + "-site"), type: "location",
          tension: 0.3 + res.danger * 0.25, facts: { subject: res.name } });

  const ents = tpl.civs.map(c => ({ name: c.name, weight: c.greed, last: "" as string }));
  let momentum = 0, day = 0, n = 0;
  const fragments: string[] = [];
  let climaxed = false;

  const event = (kind: AbsKind, actor: string, mag: number, cause?: string) => {
    const s = slug("events", `${n++}-${kind}`);
    // NEUTRAL placeholder text — Stage C MUST rename. No theme verbs.
    add({ slug: s, type: "event", tension: 0.4 + mag * 0.3,
          facts: { abstract_kind: kind, actor, magnitude: Number(mag.toFixed(2)), placeholder: true } });
    link(s, "involves", slug("civs", actor), day);
    if (cause) link(s, "caused_by", cause, day);
    return s;
  };

  const fireClimax = () => {
    climaxed = true;
    const climax = event("turn", ents[0].name, 0.95);
    (nodes.find(x => x.slug === climax)!.facts as any).climax = true;
    let prev = climax;
    const involved = ents.slice().sort((a, b) => b.weight - a.weight).slice(0, Math.min(4, ents.length));
    for (const ent of involved) {
      const frag = add({ slug: slug("lore", `thread-of-${ent.name}`), type: "lore", tension: 0.8,
        facts: { subtype: "fragment", revealed: false, about: ent.name, placeholder: true } });
      link(frag, REL, prev, day);              // chain in the CONFIGURED relation
      link(slug("civs", ent.name), "involved_in", climax, day);   // neutral, not fell_to
      fragments.push(frag); prev = frag;
    }
  };

  for (let e = 0; e < tpl.epochs; e++) {
    day += 100;
    for (const ent of ents) {
      const roll = r();
      const kind: AbsKind = roll < 0.5 ? "commitment" : roll < 0.8 ? "interaction" : "initiative";
      const mag = 0.3 + r() * 0.6 * ent.weight;
      const ev = event(kind, ent.name, mag, ent.last || undefined);
      if (kind === "commitment") {
        const res = pick(tpl.resources);
        link(ev, "concerns", slug("locations", res.name + "-site"), day);
        momentum += res.danger * ent.weight * 0.5;
      }
      if (kind === "interaction") {
        const other = pick(ents.filter(o => o.name !== ent.name) ?? ents);
        if (other && other.last) link(ev, "caused_by", other.last, day);
      }
      ent.last = ev;
    }
    if (momentum >= tpl.cascadeThreshold) { fireClimax(); break; }   // neutral CLIMAX, not a "fall"
  }
  if (!climaxed) fireClimax();   // guarantee a climax + mystery even if momentum stayed low

  return { nodes, edges, mystery: { fragments, order: [...fragments], order_relation: REL as any } };
}

if (import.meta.main) {
  const seed = Number(process.argv[2] ?? 42);
  const tplPath = process.argv[3];
  if (!tplPath) { console.error("usage: procgen-abstract.ts <seed> <templatesFile>"); process.exit(2); }
  const tpl = JSON.parse(await Bun.file(tplPath).text());
  process.stdout.write(JSON.stringify(runAbstractProcgen(tpl, seed), null, 2));
}
