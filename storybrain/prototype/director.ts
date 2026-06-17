#!/usr/bin/env bun
// StoryBrain Director — prototype tick.
//
// Demonstrates the §5 loop against a LIVE gbrain brain:
//   SENSE (real graph queries via `gbrain backlinks --json`)
//   → SCORE (the callback_strength + resonance formula from DESIGN.md §5)
//   → FIRE (pick winner) → WRITE BACK (event page + explicit edges + advance arc)
//
// Tension scalars are engine-stamped (simulated via world.json) — the one input
// the game owns; everything structural is read from the real graph.
//
// Run:  GBRAIN_HOME=/tmp/storybrain-brain bun storybrain/prototype/director.ts
//
// NOTE on a deliberate simplification: DESIGN's callback_strength folds arc_bonus
// per-edge. Here we apply the arc multiplier to the whole candidate when it
// advances an open arc ("narration that advances the open plot gets its callbacks
// amplified"). Same intent, less per-edge bookkeeping. Flagged in the trace.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ROOT = new URL("../../", import.meta.url).pathname;
const world = JSON.parse(readFileSync(ROOT + "storybrain/prototype/world.json", "utf8"));

function gb(args: string[]): string {
  const r = spawnSync("bun", ["src/cli.ts", ...args], { cwd: ROOT, encoding: "utf8",
    env: { ...process.env }, maxBuffer: 1 << 24 });
  return (r.stdout || "") + (r.status === 0 ? "" : "");
}
function backlinks(slug: string): Array<{from_slug:string; link_type:string}> {
  try { return JSON.parse(gb(["backlinks", slug, "--json"])); } catch { return []; }
}
const tension = (s: string): number => world.tension[s] ?? 0.2;
function recency(fromTo: string): number {
  const d = world.edge_day[fromTo];
  if (d == null) return 1.0;
  return Math.pow(0.5, (world.today - d) / world.half_life_days);
}

// ---- candidate events the Director could fire this tick ----
type Cand = { id: string; kind: string; faction?: string; artifact?: string; blurb: string };
const candidates: Cand[] = [
  { id: "raid-iron",   kind: "raid",     faction: "factions/iron-empire", blurb: "Iron Empire raids the colony" },
  { id: "raid-ash",    kind: "raid",     faction: "factions/ash-clan",    blurb: "Ash-Clan raids the colony" },
  { id: "heist-crown", kind: "raid",     faction: "factions/ash-clan",    artifact: "artifacts/weeping-crown", blurb: "Ash-Clan strikes for the Weeping Crown" },
  { id: "flare",       kind: "disaster",                                   blurb: "A solar flare knocks out power" },
];

const openArcs = world.open_arcs as Array<any>;
function advancesArc(c: Cand): any | null {
  return openArcs.find(a => a.next_beat_kind === c.kind && a.next_beat_faction === c.faction) ?? null;
}

// ---- score each candidate ----
const W = { cb: 1.0, arc: 0.5, char: 0.2, tens: 0.3, rep: 0.4, fix: 0.3 };
const BUDGET = 0.7; // pacing target tension magnitude this tick

type Scored = Cand & { rawCb:number; arcMul:number; cb:number; arcAdv:number;
  charStakes:number; tensFit:number; resonance:number; cites:string[] };

function score(c: Cand): Scored {
  const target = c.faction;
  const incoming = target ? backlinks(target) : [];
  let rawCb = 0; const cites: string[] = []; const colonists = new Set<string>();
  for (const e of incoming) {
    const contrib = tension(e.from_slug) * recency(`${e.from_slug}->${target}`);
    rawCb += contrib;
    cites.push(`${e.from_slug} --${e.link_type}--> ${target} (t=${tension(e.from_slug).toFixed(2)}, r=${recency(`${e.from_slug}->${target}`).toFixed(2)})`);
    if (e.from_slug.startsWith("colonists/")) colonists.add(e.from_slug);
  }
  const arc = advancesArc(c);
  const arcMul = arc ? world.arc_weight : 1.0;
  const cb = rawCb * arcMul;
  const arcAdv = arc ? 1 : 0;
  const charStakes = colonists.size;
  const tensFit = c.faction ? 1 - Math.abs(tension(c.faction) - BUDGET) : 1 - Math.abs(0.4 - BUDGET);
  const repetition = 0, fixation = 0; // tick 1: no history
  const resonance = W.cb*cb + W.arc*arcAdv + W.char*charStakes + W.tens*tensFit - W.rep*repetition - W.fix*fixation;
  return { ...c, rawCb, arcMul, cb, arcAdv, charStakes, tensFit, resonance, cites };
}

console.log("=== StoryBrain Director — tick (day " + world.today + ") ===\n");
console.log("Pacing: target tension budget = " + BUDGET + "\n");
const scored = candidates.map(score).sort((a,b) => b.resonance - a.resonance);

for (const s of scored) {
  console.log(`• ${s.id}  [${s.kind}${s.faction ? " / "+s.faction.split("/")[1] : ""}]`);
  console.log(`    resonance = ${s.resonance.toFixed(3)}`);
  console.log(`      callback_strength = rawCb ${s.rawCb.toFixed(3)} × arcMul ${s.arcMul.toFixed(1)} = ${s.cb.toFixed(3)}  (w ${W.cb})`);
  console.log(`      arc_advance ${s.arcAdv} (w ${W.arc}) · char_stakes ${s.charStakes} (w ${W.char}) · tension_fit ${s.tensFit.toFixed(2)} (w ${W.tens})`);
  if (s.cites.length) for (const c of s.cites) console.log(`        cites: ${c}`);
  else console.log(`        cites: (none — no graph history) → cold/random beat`);
  console.log();
}

const winner = scored[0];
console.log("=== WINNER: " + winner.id + " (resonance " + winner.resonance.toFixed(3) + ") ===");

// ---- narration stub: the "reason the player can read" ----
const topCite = winner.cites[0] ?? "the colony's recent troubles";
console.log("NARRATION: " + winner.blurb + ". " +
  (winner.faction === "factions/iron-empire"
    ? "They have not forgotten the Ashmark — and Vera least of all."
    : "Trouble rarely travels alone.") + "\n");

// ---- WRITE BACK: event page + explicit edges + advance arc ----
const day = world.today;
const evSlug = `events/${day}-${winner.id}`;
const content = `---\ntype: event\nkind: ${winner.kind}\nday: ${day}\ntension: 0.8\n---\n# ${winner.blurb}\nFired by the Director on day ${day}.`;
gb(["put", evSlug, "--content", content]);
console.log("wrote " + evSlug);
if (winner.faction) gb(["link", evSlug, winner.faction, "--link-type", "involves", "--link-source", "manual"]);
gb(["link", evSlug, "colonists/vera", "--link-type", "involves", "--link-source", "manual"]);
const arc = advancesArc(winner);
if (arc) {
  gb(["link", evSlug, arc.slug, "--link-type", "advances", "--link-source", "manual"]);
  // advance the arc: reset staleness, escalate phase
  const arcContent = `---\ntype: arc\nphase: climax\nday_started: 400\ndays_since_advance: 0\nnext_beat_kind: raid\nnext_beat_faction: factions/iron-empire\ntension: 0.85\n---\n# The Iron Empire's Reckoning\nThe raid on day ${day} escalated the reckoning to its climax.`;
  gb(["put", arc.slug, "--content", arcContent]);
  console.log("advanced arc " + arc.slug + " → phase climax, days_since_advance=0");
}

console.log("\n=== resulting graph around the arc (real query) ===");
process.stdout.write(gb(["graph-query", "arcs/iron-empire-reckoning", "--direction", "in"]));
