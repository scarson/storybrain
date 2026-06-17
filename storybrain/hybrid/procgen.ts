#!/usr/bin/env bun
// Stage B — DETERMINISTIC procgen (no LLM). Dwarf-Fortress-"legends"-style
// history simulation. Takes LLM-seeded templates (Stage A) + a seed, runs T
// epochs, and emits a structured world history (schema.ts-compatible World) with
// a real caused_by chain and a resource-exploitation cascade ("fall").
//
// Run standalone with the built-in default templates:
//   bun storybrain/hybrid/procgen.ts [seed] [templatesFile] > history.json
//
// The point: procgen gives SCALE + GLOBAL CAUSAL CONSISTENCY cheaply (no per-fact
// LLM cost), which pure-LLM generation struggles to keep coherent. Stage C (LLM)
// then enriches this skeleton with meaning.

import type { World, WorldNode, Edge } from "../generator/schema.ts";

// ---- seeded PRNG (mulberry32) — reproducible histories --------------------
function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---- template shape (Stage A produces this; default below) ----------------
export type Templates = {
  setting: string;
  civs: Array<{ name: string; archetype: string; trait: string; greed: number }>; // greed ∈ [0,1]
  resources: Array<{ name: string; danger: number }>;   // danger ∈ [0,1] (hidden cost of exploiting)
  artifactKinds: string[];
  epochs: number;
  cascadeThreshold: number;   // global pressure at which the CLIMAX fires
  // GENERALIZED (corpus eval): the climax need not be a "fall". order_relation is
  // the verb linking the mystery fragments (the spine meaning); climax_label names
  // the culminating event. Stage C reframes the procgen skeleton to the theme.
  order_relation?: string;    // caused_by|enables|prerequisite|precedes|reveals
  climax_label?: string;      // e.g. "the fall", "the structure completed", "the outbreak peak"
};

export const DEFAULT_TEMPLATES: Templates = {
  setting: "Humans arrive long after an advanced alien civilization fell; resource exploitation gone terribly wrong.",
  civs: [
    { name: "the-velt",   archetype: "crystalline-slow-life", trait: "patient, mineral-bound cognition", greed: 0.8 },
    { name: "the-choir",  archetype: "psychic-gestalt",        trait: "bodiless standing-wave of minds",  greed: 0.4 },
    { name: "the-sable",  archetype: "machine-intelligence",   trait: "self-replicating logic-swarm",      greed: 0.95 },
  ],
  resources: [
    { name: "marrow-ore",     danger: 0.95 }, // the dangerous one
    { name: "lumen-salt",     danger: 0.2 },
    { name: "void-glass",     danger: 0.6 },
  ],
  artifactKinds: ["weapon-relic", "lost-codex", "cursed-idol", "key-map", "living-relic", "prophecy-object"],
  epochs: 7,
  cascadeThreshold: 1.6,
  order_relation: "caused_by",
  climax_label: "the wound the world could not forgive",
};

const slug = (t: string, n: string) => `${t}/${n}`;

export function runProcgen(tpl: Templates, seed: number): World {
  const r = rng(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const nodes: WorldNode[] = [];
  const edges: Edge[] = [];
  const add = (n: WorldNode) => { nodes.push(n); return n.slug; };
  const link = (s: string, v: string, d: string, day: number) => { edges.push([s, v, d, day]); };

  // seed nodes
  add({ slug: "factions/humans", type: "faction", tension: 0.4, facts: { role: "late-arrivals" } });
  for (const c of tpl.civs)
    add({ slug: slug("civs", c.name), type: "faction", tension: 0.55,
          facts: { alien_type: c.archetype, trait: c.trait, status: "extant", wound: 0 } });
  for (const res of tpl.resources)
    add({ slug: slug("locations", res.name + "-seam"), type: "location", tension: 0.3 + res.danger * 0.3,
          facts: { resource: res.name, danger: res.danger } });

  const alive = new Map(tpl.civs.map(c => [c.name, { ...c, wound: 0, fell: false, lastEvent: "" as string }]));
  let pressure = 0;
  let day = 0;
  let eventN = 0;
  const fallFragments: string[] = [];
  const newEvent = (kind: string, title: string, tension: number, civ?: string, cause?: string) => {
    const s = slug("events", `${eventN++}-${kind}`);
    add({ slug: s, type: "event", tension, day, facts: { kind, title } });
    if (civ) link(s, "involves", slug("civs", civ), day);
    if (cause) link(s, "caused_by", cause, day);
    return s;
  };

  // epochs
  for (let e = 0; e < tpl.epochs; e++) {
    day += 100;
    for (const [name, c] of alive) {
      if (c.fell) continue;
      const roll = r();
      if (roll < 0.55) {
        // discover + exploit a resource
        const res = pick(tpl.resources);
        const disc = newEvent("discovery", `${name} taps ${res.name}`, 0.4, name, c.lastEvent || undefined);
        link(slug("civs", name), "exploits", slug("locations", res.name + "-seam"), day);
        c.wound += res.danger * c.greed;
        pressure += res.danger * c.greed * 0.5;
        c.lastEvent = newEvent("exploitation", `${name} over-extracts ${res.name}`, 0.5 + res.danger * 0.3, name, disc);
        // dramatic moment → artifact
        if (r() < 0.5) {
          const ak = pick(tpl.artifactKinds);
          const art = add({ slug: slug("artifacts", `${name}-${ak}-${eventN}`), type: "artifact",
            tension: 0.6, facts: { archetype: ak, maker: name } });
          link(art, "forged_by", slug("civs", name), day);
          link(c.lastEvent, "involves", art, day);
        }
      } else if (roll < 0.75) {
        // war with another living civ
        const others = [...alive.values()].filter(o => o.name !== name && !o.fell);
        if (others.length) {
          const foe = pick(others);
          c.lastEvent = newEvent("war", `${name} wars on ${foe.name}`, 0.6, name, c.lastEvent || undefined);
          link(slug("civs", name), "rival_of", slug("civs", foe.name), day);
        }
      } else {
        // schism → a figure
        const fig = add({ slug: slug("figures", `${name}-seer-${eventN}`), type: "colonist", tension: 0.4,
          facts: { role: "schismatic seer", civ: name } });
        c.lastEvent = newEvent("schism", `a seer rises among ${name}`, 0.45, name, c.lastEvent || undefined);
        link(c.lastEvent, "involves", fig, day);
      }
    }
    // climax check — generalized (a fall by default; Stage C may reframe)
    if (pressure >= tpl.cascadeThreshold) {
      const REL = tpl.order_relation ?? "caused_by";
      const cascade = newEvent("cascade", tpl.climax_label ?? "the climax", 0.9);
      // mystery fragments: a chain linked by the theme's order_relation
      let prev = cascade;
      for (const [name, c] of alive) {
        if (c.fell) continue;
        if (c.wound > 0.5) {
          c.fell = true;
          const civNode = nodes.find(n => n.slug === slug("civs", name));
          if (civNode) civNode.facts!.status = "fallen";
          const frag = add({ slug: slug("lore", `fate-of-${name}`), type: "lore", tension: 0.8,
            facts: { subtype: "fragment", revealed: false, about: name } });
          link(frag, REL, prev === cascade ? cascade : prev, day);
          link(slug("civs", name), "fell_to", cascade, day);
          fallFragments.push(frag);
          prev = frag;
        }
      }
      break; // the climax ends the history
    }
  }

  // mystery: the fragments, ordered as generated, linked by order_relation
  return { nodes, edges, mystery: { fragments: fallFragments, order: [...fallFragments],
    order_relation: (tpl.order_relation ?? "caused_by") as any } };
}

// ---- CLI ------------------------------------------------------------------
if (import.meta.main) {
  const seed = Number(process.argv[2] ?? 42);
  let tpl = DEFAULT_TEMPLATES;
  if (process.argv[3]) tpl = JSON.parse(await Bun.file(process.argv[3]).text());
  const world = runProcgen(tpl, seed);
  process.stdout.write(JSON.stringify(world, null, 2));
}
