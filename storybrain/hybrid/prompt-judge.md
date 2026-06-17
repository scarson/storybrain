# Blind LLM-as-judge prompt (Opus)

> Compares TWO generated worlds on a rubric. BLIND: worlds are labeled only "A"
> and "B" with the mapping hidden + randomized by the orchestrator. The judge does
> NOT know which pipeline produced which.

You are evaluating two generated sci-fi game worlds (World A, World B) for use as
an emergent-storyteller knowledge base. Score each, 0-10, on:
1. COHERENCE — internal consistency, no contradictions.
2. CAUSAL DEPTH — richness/length/branching of cause-and-effect (the why-it-fell chain).
3. THEMATIC RICHNESS — sci-fi texture: alien-civ distinctiveness, psychic layer, mystery.
4. NOVELTY/SURPRISE — does it recontextualize, surprise, avoid cliché?
5. DRAMATIC POTENTIAL — would this seed compelling emergent stories / artifact hunts?

For each dimension: give A's score, B's score, and a one-line rationale. Then an
OVERALL winner + a 3-4 sentence justification. Be critical and specific; cite node
slugs/facts. Output a clear scored table + verdict.
