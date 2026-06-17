// TDD (Phase 1): written BEFORE schema.ts. Defines the model↔store contract.
import { test, expect } from "bun:test";
import { validateWorld, type World } from "./schema.ts";

function validWorld(): World {
  return {
    nodes: [
      { slug: "factions/humans", type: "faction" },
      { slug: "civs/the-weavers", type: "faction", facts: { alien_type: "hive-mind" } },
      { slug: "artifacts/relay-core", type: "artifact" },
      { slug: "lore/fall-1", type: "lore", facts: { subtype: "fragment", revealed: false } },
      { slug: "lore/fall-2", type: "lore", facts: { subtype: "fragment", revealed: false } },
      { slug: "lore/fall-3", type: "lore", facts: { subtype: "fragment", revealed: false } },
    ],
    edges: [
      ["artifacts/relay-core", "drops", "lore/fall-1", 0],
      ["artifacts/relay-core", "drops", "lore/fall-2", 0],
      ["artifacts/relay-core", "drops", "lore/fall-3", 0],
      ["lore/fall-1", "reveals", "civs/the-weavers", 0],
    ],
    mystery: { fragments: ["lore/fall-1", "lore/fall-2", "lore/fall-3"],
               order: ["lore/fall-1", "lore/fall-2", "lore/fall-3"] },
  };
}

test("a well-formed world passes", () => {
  const r = validateWorld(validWorld());
  expect(r.ok).toBe(true);
  expect(r.errors).toEqual([]);
});

test("dangling edge dst is rejected", () => {
  const w = validWorld();
  w.edges.push(["artifacts/relay-core", "hidden_at", "locations/nowhere", 0]);
  const r = validateWorld(w);
  expect(r.ok).toBe(false);
  expect(r.errors.some(e => e.includes("locations/nowhere"))).toBe(true);
});

test("artifact with fewer than 3 dropped facts is rejected", () => {
  const w = validWorld();
  w.edges = w.edges.filter(e => e[2] !== "lore/fall-3"); // now only 2 drops
  const r = validateWorld(w);
  expect(r.ok).toBe(false);
  expect(r.errors.some(e => e.includes("relay-core") && e.includes("3"))).toBe(true);
});

test("a mystery fragment not dropped by any artifact is rejected (uncovered)", () => {
  const w = validWorld();
  w.nodes.push({ slug: "lore/fall-4", type: "lore", facts: { subtype: "fragment" } });
  w.mystery.fragments.push("lore/fall-4");
  w.mystery.order.push("lore/fall-4");
  const r = validateWorld(w);
  expect(r.ok).toBe(false);
  expect(r.errors.some(e => e.includes("lore/fall-4") && e.toLowerCase().includes("cover"))).toBe(true);
});

test("duplicate slugs are rejected", () => {
  const w = validWorld();
  w.nodes.push({ slug: "artifacts/relay-core", type: "artifact" });
  const r = validateWorld(w);
  expect(r.ok).toBe(false);
  expect(r.errors.some(e => e.toLowerCase().includes("duplicate"))).toBe(true);
});

test("mystery.order must be a permutation of fragments", () => {
  const w = validWorld();
  w.mystery.order = ["lore/fall-1", "lore/fall-2"]; // missing fall-3
  const r = validateWorld(w);
  expect(r.ok).toBe(false);
  expect(r.errors.some(e => e.toLowerCase().includes("order"))).toBe(true);
});
