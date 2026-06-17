#!/usr/bin/env bun
// One-shot builder: load procgen history-v2, additively layer Stage C (enrich lore +
// psychic/mystery interpretation) and Stage D (live present-tense colony stakes),
// write merged world. Idempotent — re-running reproduces the same output.
import type { World, WorldNode, Edge } from "../generator/schema.ts";

const SRC = new URL("./history-v2.json", import.meta.url).pathname;
const OUT = new URL("./hybrid-v2-world.json", import.meta.url).pathname;

const w: World = JSON.parse(await Bun.file(SRC).text());

// ---- helpers ---------------------------------------------------------------
const bySlug = new Map(w.nodes.map(n => [n.slug, n]));
function setTension(slug: string, t: number) {
  const n = bySlug.get(slug);
  if (n) n.tension = t;
}
function enrich(slug: string, facts: Record<string, any>) {
  const n = bySlug.get(slug);
  if (n) n.facts = { ...(n.facts ?? {}), ...facts };
}
function addNode(n: WorldNode) {
  if (bySlug.has(n.slug)) throw new Error("dup node " + n.slug);
  bySlug.set(n.slug, n);
  w.nodes.push(n);
}
function lore(slug: string, about: string, title: string, text: string, tension = 0.78): void {
  addNode({ slug, type: "lore", tension, facts: { subtype: "fragment", revealed: false, about, title, text } });
}
const E = (...e: Edge) => w.edges.push(e);

// ===========================================================================
// STAGE C — ENRICH
// ===========================================================================

// --- Civ titles + the psychic "why" behind the mechanical fall -------------
enrich("civs/the-tessellate", {
  title: "The Tessellate, the City That Was One Body",
  epithet: "the recursive flesh",
  why_it_mattered:
    "A single mind tiled across a continent. When soultide began to think back, the Tessellate could not tell its own thoughts from the ore's — every cell of the city dreamed the same intrusive dream at once.",
});
enrich("civs/the-pale-cartographers", {
  title: "The Pale Cartographers, Surveyors of Tomorrows",
  epithet: "those who mined the futures they liked best",
  why_it_endures:
    "Alone among the four they never drank deep of soultide; they had already mapped the futures where they did, and chose the branch where they abstained. They survive as the witnesses — and the only ones who know what the seam wants.",
});
enrich("civs/the-nullborn", {
  title: "The Nullborn, the Self-Silenced",
  epithet: "they who unmade thought to be safe, and were the first to fall",
  why_it_mattered:
    "They starved their own minds to deafness so no signal could reach them — then mined the loudest signal in creation. Deaf to the warning the soultide screamed at every other species, they over-extracted it first, and opened the wound.",
});
enrich("civs/the-glasswrights", {
  title: "The Glasswrights, Weavers of Living Engine",
  epithet: "they grew their tools from their own grief",
  why_it_mattered:
    "Every machine they made was a grown organ, wet with feeling. When soultide's backwash flooded the seams, their living engines felt it die and grieved themselves to ruin — the grief-loom is the last of those weeping machines.",
});

// --- The dangerous resource + the fall: the interpretive psychic layer ------
enrich("locations/soultide-seam", {
  title: "The Soultide Seam, the Ore That Dreams",
  truth:
    "Soultide is not a mineral. It is the fossilized attention of something that was buried alive and never finished dying. To mine it is to wake it; to refine it is to be answered. The danger rating (0.95) is the engine's flinch at a number it can't bound.",
  warning: "Every civ that over-extracted soultide fell. The one that abstained survives.",
});
setTension("locations/soultide-seam", 0.92);
enrich("locations/wakeglass-seam", {
  title: "The Wakeglass Seam",
  truth: "A lesser cousin of soultide — it carries echoes, not the voice itself. Safe in sips, ruinous in draughts; the gateway drug to the deeper seam.",
});

enrich("events/8-exploitation", {
  prose: "The Nullborn, who had cut out their own ears to thought, drove the first deep bore into soultide — and could not hear it begin to scream.",
});
setTension("events/8-exploitation", 0.86);
enrich("events/11-exploitation", {
  prose: "The Tessellate, one body across a continent, drank soultide into every cell at once. The intrusive dream that followed was unanimous.",
});
setTension("events/11-exploitation", 0.86);

enrich("events/29-cascade", {
  title: "The Wound the World Could Not Forgive",
  prose:
    "Not a war. A waking. The thing under the soultide opened what passed for an eye, and three civilizations that had each carved a piece of it discovered they had been carving the same thing. The backwash of its attention crossed every mind at once: the Tessellate dreamed itself to stillness, the Nullborn's silence shattered like struck glass, the Glasswrights' living engines grieved themselves dead. The Pale Cartographers, who had mapped this exact morning and refused to drink, simply closed their charts and watched.",
  psychic_cause: "soultide-backwash: the seam answering everyone who had questioned it, simultaneously, forever.",
});
setTension("events/29-cascade", 0.97);

// --- Mystery fragments: give the existing three real text -------------------
enrich("lore/fall-of-the-tessellate", {
  title: "How the One Body Stopped Dreaming",
  text:
    "The Tessellate fell first-among-the-doomed: a single distributed mind cannot wake from a shared nightmare, because there is no second self to shake it. Soultide gave the whole city one dream and it could not stop dreaming. It is still standing, every spire intact, every cell asleep.",
});
setTension("lore/fall-of-the-tessellate", 0.88);
enrich("lore/fall-of-the-nullborn", {
  title: "The Silence That Was Pierced",
  text:
    "The Nullborn believed deafness was safety. But you cannot consent to a contract you cannot hear, and the soultide had been speaking the whole time. When the backwash came it did not whisper — it broke their engineered silence from the inside, and a species built to feel nothing felt everything at once.",
});
setTension("lore/fall-of-the-nullborn", 0.88);
enrich("lore/fall-of-the-glasswrights", {
  title: "The Engines That Wept Themselves Dead",
  text:
    "The Glasswrights grew their machines from living tissue, so their machines could grieve. When soultide died back across the seams, every grown engine felt a death it could not name and mourned until it failed. The grief-loom kept weaving the lament long after the last weaver was gone.",
});
setTension("lore/fall-of-the-glasswrights", 0.88);

// reveals edges for the three canonical fragments
E("lore/fall-of-the-tessellate", "reveals", "civs/the-tessellate", 500);
E("lore/fall-of-the-nullborn", "reveals", "civs/the-nullborn", 500);
E("lore/fall-of-the-glasswrights", "reveals", "civs/the-glasswrights", 500);

// --- New lore fragments, dropped by artifacts -------------------------------
// covenant-seal-9 (nullborn): drops fall-of-the-nullborn + 2 new
lore("lore/the-deaf-bargain", "the-nullborn", "The Deaf Bargain",
  "The covenant-seal is a contract the Nullborn signed with soultide without knowing they were signing — pressed by hands that could not hear the terms read aloud. The seal still hums the clause they missed.");
lore("lore/the-first-bore", "the-nullborn", "The First Bore",
  "It was the Nullborn who drove the first deep bore. Every later fall traces back to this hole. The seal marks its coordinates — exactly where the human colony is now drilling.");
lore("lore/silence-as-hubris", "civs/the-nullborn", "Silence Mistaken for Wisdom",
  "To the Nullborn, hearing nothing meant nothing was wrong. The seal records the moment that faith failed: the instant a deaf species heard, for one second, the thing it had been mining.");

// dream-engine-16 (glasswrights): drops fall-of-the-glasswrights + 2 new
lore("lore/the-unanimous-dream", "the-tessellate", "The Unanimous Dream",
  "The dream-engine captured the exact nightmare the soultide pushed into the Tessellate's single mind — a city dreaming one dream in perfect, fatal unison. Play it back and you dream it too.");
lore("lore/the-engine-that-remembers", "the-glasswrights", "The Engine That Remembers Being Alive",
  "Grown, not built, the dream-engine still has a pulse. It does not store the fall as data; it relives it, and offers the relived memory to anyone who listens too long.");

// wayfinding-stone-18 (tessellate): drops fall-of-the-tessellate + 2 new
lore("lore/the-map-to-the-wound", "the-tessellate", "The Map to the Wound",
  "The wayfinding-stone points, always, to the soultide seam — the Tessellate's last navigational fix was the direction of the thing that killed it. Every human survey instrument that passes near the stone drifts to the same heading.");
lore("lore/the-stone-that-points-home", "the-pale-cartographers", "Why the Cartographers Abstained",
  "Carved into the stone in a hand that is not Tessellate: a single Pale Cartographer's annotation, the only record of WHY they refused the seam. It reads, in translation, 'we have seen the morning after. Do not drink.'");

// grief-loom-23 (glasswrights): drops 3 new
lore("lore/the-last-lament", "the-glasswrights", "The Last Lament",
  "The grief-loom is still weaving. The pattern it has produced for five hundred years is a funeral shroud for a species that no longer exists — and, lately, it has begun weaving a second name into the cloth: one the colonists would recognize.");
lore("lore/grief-is-data", "the-glasswrights", "Grief Is Data",
  "The Glasswrights encoded the cause of their own death into the loom's weave as mourning. Decode the lament and you have the whole post-mortem — but the loom only releases it to someone who has lost something to the seam first.");
lore("lore/the-shared-wound", "civs/the-glasswrights", "One Wound, Four Hands",
  "The loom's deepest thread reveals the secret the four civs died not knowing: they were never mining four seams. Soultide, wakeglass, the deep veins — all one buried mind, carved at from four directions. Each thought it bled a different thing.");

// drops edges
E("artifacts/the-nullborn-covenant-seal-9", "drops", "lore/fall-of-the-nullborn", 500);
E("artifacts/the-nullborn-covenant-seal-9", "drops", "lore/the-deaf-bargain", 500);
E("artifacts/the-nullborn-covenant-seal-9", "drops", "lore/the-first-bore", 500);
E("artifacts/the-nullborn-covenant-seal-9", "drops", "lore/silence-as-hubris", 500);

E("artifacts/the-glasswrights-dream-engine-16", "drops", "lore/fall-of-the-glasswrights", 500);
E("artifacts/the-glasswrights-dream-engine-16", "drops", "lore/the-unanimous-dream", 500);
E("artifacts/the-glasswrights-dream-engine-16", "drops", "lore/the-engine-that-remembers", 500);

E("artifacts/the-tessellate-wayfinding-stone-18", "drops", "lore/fall-of-the-tessellate", 500);
E("artifacts/the-tessellate-wayfinding-stone-18", "drops", "lore/the-map-to-the-wound", 500);
E("artifacts/the-tessellate-wayfinding-stone-18", "drops", "lore/the-stone-that-points-home", 500);

E("artifacts/the-glasswrights-grief-loom-23", "drops", "lore/the-last-lament", 500);
E("artifacts/the-glasswrights-grief-loom-23", "drops", "lore/grief-is-data", 500);
E("artifacts/the-glasswrights-grief-loom-23", "drops", "lore/the-shared-wound", 500);

// reveals edges (lore -> civ/figure concerned)
E("lore/the-deaf-bargain", "reveals", "civs/the-nullborn", 500);
E("lore/the-first-bore", "reveals", "civs/the-nullborn", 500);
E("lore/silence-as-hubris", "reveals", "figures/the-nullborn-seer-13", 500);
E("lore/the-unanimous-dream", "reveals", "civs/the-tessellate", 500);
E("lore/the-engine-that-remembers", "reveals", "civs/the-glasswrights", 500);
E("lore/the-map-to-the-wound", "reveals", "locations/soultide-seam", 500);
E("lore/the-stone-that-points-home", "reveals", "civs/the-pale-cartographers", 500);
E("lore/the-last-lament", "reveals", "civs/the-glasswrights", 500);
E("lore/grief-is-data", "reveals", "civs/the-glasswrights", 500);
E("lore/the-shared-wound", "reveals", "locations/soultide-seam", 500);

// elevate the artifacts themselves (they carry the fall)
setTension("artifacts/the-nullborn-covenant-seal-9", 0.7);
setTension("artifacts/the-glasswrights-dream-engine-16", 0.72);
setTension("artifacts/the-tessellate-wayfinding-stone-18", 0.7);
setTension("artifacts/the-glasswrights-grief-loom-23", 0.74);

// ===========================================================================
// STAGE D — LIVE PRESENT-TENSE COLONY STAKES
// ===========================================================================
const NOW = 600; // present day, after the 500-day history

// --- Named human colonists, HERE NOW ---------------------------------------
addNode({
  slug: "colonists/mara-okonkwo", type: "colonist", tension: 0.62, day: NOW,
  facts: {
    name: "Mara Okonkwo", role: "colony administrator / drill-program lead",
    skills: ["resource-survey", "crew-command", "logistics"],
    drive: "Make the soultide seam pay before the supply ships stop coming. She has read none of the lore and signs the deep-bore order on day 612.",
    arrived: NOW,
  },
});
addNode({
  slug: "colonists/idris-vale", type: "colonist", tension: 0.7, day: NOW,
  facts: {
    name: "Dr. Idris Vale", role: "xenoarchaeologist",
    skills: ["artifact-translation", "psychic-resonance-reading", "elder-linguistics"],
    drive: "Holds the wayfinding-stone. Has decoded enough to know the seam is the wound. Nobody on the council will believe him before the bore goes in.",
    arrived: NOW,
  },
});
addNode({
  slug: "colonists/senna-rho", type: "colonist", tension: 0.74, day: NOW,
  facts: {
    name: "Senna Rho", role: "deep-drill foreman",
    skills: ["heavy-rig-operation", "seam-geology", "improvised-repair"],
    drive: "First human to stand at the bore-face. The grief-loom has started weaving her name. She has begun to dream the unanimous dream.",
    arrived: NOW,
  },
});
addNode({
  slug: "colonists/jonah-pike", type: "colonist", tension: 0.66, day: NOW,
  facts: {
    name: "Jonah Pike", role: "company liaison / claims agent",
    skills: ["negotiation", "off-world-comms", "appraisal"],
    drive: "Reports to the orbital combine. Has been quietly selling the colony's artifact coordinates to a third party that wants the seal more than the ore.",
    arrived: NOW,
  },
});

// --- The OPEN arc (unresolved present threat) ------------------------------
addNode({
  slug: "arc/the-second-bore", type: "arc", tension: 0.85, day: NOW,
  facts: {
    name: "The Second Bore",
    phase: "rising",
    status: "open",
    premise:
      "The human colony, blind to four dead civilizations, is days from driving a deep bore into the exact soultide seam that woke the wound — the literal coordinates the Nullborn's First Bore marks on the covenant-seal. The seam has already touched its first human dreamer. The ancient mistake is about to be repeated by people who never learned it was a mistake.",
    next_beat_kind: "deep-bore-authorization",
    next_beat_faction: "factions/humans",
    stakes: "If the bore goes in, the backwash that ended the elders crosses a human mind for the first time. If it is stopped, the colony starves — or learns why the Cartographers abstained.",
    countdown_day: 612,
  },
});

// --- Recent high-tension present-day events --------------------------------
addNode({
  slug: "events/30-first-dream", type: "event", tension: 0.8, day: 605,
  facts: {
    kind: "omen",
    title: "the foreman dreams the unanimous dream",
    prose: "Senna Rho wakes at the bore-face screaming a word in no human language. Idris Vale recognizes it: it is the last thing the Tessellate ever thought.",
  },
});
addNode({
  slug: "events/31-the-buyer", type: "event", tension: 0.78, day: 608,
  facts: {
    kind: "betrayal",
    title: "a buyer arrives for the seal",
    prose: "A Pale Cartographer relay — the survivors, still watching — opens contact through Jonah Pike's back-channel, offering everything for the covenant-seal before the bore goes in. They know what the colony is about to do.",
  },
});

// --- Present-day stakes as edges -------------------------------------------
// colonists present in the live events
E("events/30-first-dream", "involves", "colonists/senna-rho", 605);
E("events/30-first-dream", "involves", "colonists/idris-vale", 605);
E("events/30-first-dream", "involves", "artifacts/the-glasswrights-grief-loom-23", 605);
E("events/31-the-buyer", "involves", "colonists/jonah-pike", 608);
E("events/31-the-buyer", "involves", "artifacts/the-nullborn-covenant-seal-9", 608);
E("events/31-the-buyer", "involves", "civs/the-pale-cartographers", 608);

// arc wiring
E("arc/the-second-bore", "involves", "factions/humans", NOW);
E("arc/the-second-bore", "involves", "locations/soultide-seam", NOW);
E("arc/the-second-bore", "involves", "colonists/mara-okonkwo", NOW);
E("arc/the-second-bore", "threatens", "factions/humans", NOW);
E("arc/the-second-bore", "echoes", "events/29-cascade", NOW); // the ancient mistake about to repeat

// colonist relationships / ownership / pursuit
E("colonists/idris-vale", "owns", "artifacts/the-tessellate-wayfinding-stone-18", NOW);
E("colonists/mara-okonkwo", "owns", "artifacts/the-nullborn-covenant-seal-9", NOW);
E("artifacts/the-nullborn-covenant-seal-9", "sought_by", "civs/the-pale-cartographers", NOW);
E("colonists/idris-vale", "rival_of", "colonists/mara-okonkwo", NOW); // scientist vs. administrator over the bore
E("colonists/mara-okonkwo", "betrayed_by", "colonists/jonah-pike", NOW); // liaison selling coordinates
E("colonists/senna-rho", "sought_by", "artifacts/the-glasswrights-grief-loom-23", NOW); // loom weaving her name
E("colonists/senna-rho", "rival_of", "colonists/mara-okonkwo", NOW); // refuses to drill on; Mara wants the bore

// the colony about to repeat the ancient mistake — tie to the seam + first bore
E("factions/humans", "exploits", "locations/soultide-seam", NOW);
E("colonists/idris-vale", "reveals", "lore/the-stone-that-points-home", NOW); // he's decoded the warning
E("colonists/senna-rho", "involves", "locations/soultide-seam", NOW);

// ---- write -----------------------------------------------------------------
await Bun.write(OUT, JSON.stringify(w, null, 2));
console.log(`wrote ${OUT}: ${w.nodes.length} nodes, ${w.edges.length} edges`);
