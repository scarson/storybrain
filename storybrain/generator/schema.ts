// World fact-skeleton schema + deterministic validator.
// The CONTRACT between the (non-deterministic) LLM generator and the
// (deterministic) store: if validateWorld().ok, the world is loadable AND
// internally coherent (no dangling edges, artifacts carry enough lore, the
// central mystery is fully reconstructable from artifact finds).

export type WorldNode = {
  slug: string;
  type: string;            // colonist|faction|artifact|lore|location|figure|belief|power|curse|event|arc
  tension?: number;        // engine-stamped dramatic charge ∈ [0,1]
  day?: number;
  facts?: Record<string, any>;
};
export type Edge = [string, string, string] | [string, string, string, number]; // src verb dst [day]
export type World = {
  nodes: WorldNode[];
  edges: Edge[];
  mystery: { fragments: string[]; order: string[] };  // the why-it-fell chain
};

export type ValidationResult = { ok: boolean; errors: string[] };

const MIN_ARTIFACT_FACTS = 3;

export function validateWorld(w: World): ValidationResult {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const typeOf = new Map<string, string>();

  // unique slugs
  for (const n of w.nodes) {
    if (slugs.has(n.slug)) errors.push(`duplicate slug: ${n.slug}`);
    slugs.add(n.slug);
    typeOf.set(n.slug, n.type);
  }

  // edges reference declared nodes
  for (const e of w.edges) {
    const [src, verb, dst] = e;
    if (!slugs.has(src)) errors.push(`edge src not a declared node: ${src} (--${verb}--> ${dst})`);
    if (!slugs.has(dst)) errors.push(`edge dst not a declared node: ${dst} (${src} --${verb}-->)`);
  }

  // each artifact drops >= MIN_ARTIFACT_FACTS lore facts
  const drops = w.edges.filter(e => e[1] === "drops");
  for (const n of w.nodes) {
    if (n.type !== "artifact") continue;
    const dropped = drops.filter(e => e[0] === n.slug);
    const loreDropped = dropped.filter(e => typeOf.get(e[2]) === "lore");
    if (loreDropped.length < MIN_ARTIFACT_FACTS)
      errors.push(`artifact ${n.slug} drops only ${loreDropped.length} lore facts; need >= ${MIN_ARTIFACT_FACTS}`);
  }

  // mystery fragments exist, are lore, and are COVERED (dropped by some artifact)
  const droppedLore = new Set(drops.map(e => e[2]));
  for (const frag of w.mystery.fragments) {
    if (!slugs.has(frag)) { errors.push(`mystery fragment not a declared node: ${frag}`); continue; }
    if (typeOf.get(frag) !== "lore") errors.push(`mystery fragment ${frag} is type ${typeOf.get(frag)}, expected lore`);
    if (!droppedLore.has(frag)) errors.push(`mystery fragment ${frag} is not covered: no artifact drops it`);
  }

  // mystery.order is a permutation of fragments
  const fSet = new Set(w.mystery.fragments);
  const oSet = new Set(w.mystery.order);
  if (fSet.size !== oSet.size || [...fSet].some(f => !oSet.has(f)))
    errors.push(`mystery.order must be a permutation of mystery.fragments`);

  return { ok: errors.length === 0, errors };
}

/** Reconstruct the why-it-fell chain by following caused_by among revealed mystery
 *  fragments (used by the integration test to prove the mystery assembles). */
export function reconstructFall(w: World): string[] {
  // ordered fragments whose node facts.revealed === true
  const revealed = new Set(w.nodes.filter(n => n.facts?.revealed === true).map(n => n.slug));
  return w.mystery.order.filter(f => revealed.has(f));
}
