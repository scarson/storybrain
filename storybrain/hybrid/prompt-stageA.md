# Stage A prompt — LLM seeds the procgen templates

> Production: `claude-haiku-4-5` or `claude-opus-4-8`. Output = a Templates JSON
> consumed by procgen.ts. The LLM injects THEME + NOVELTY into the generators;
> the procgen then expands them combinatorially.

Generate a `Templates` JSON for a sci-fi "legends" simulation. Theme: humans
arrive long after advanced alien civilizations fell; psychic powers; ancient
mystery; **resource exploitation gone TERRIBLY wrong**. Be inventive — distinct
alien archetypes, evocative resource names, one resource whose `danger` is very
high (the thing that should never have been mined).

Output ONLY this JSON shape:
{
  "setting": "<one sentence>",
  "civs": [ {"name":"kebab","archetype":"<distinct type>","trait":"<phrase>","greed":0.0-1.0}, ... 3-4 ],
  "resources": [ {"name":"kebab","danger":0.0-1.0}, ... 3-4; exactly one with danger>=0.9 ],
  "artifactKinds": ["weapon-relic","lost-codex", ... 5-7],
  "epochs": 6-9,
  "cascadeThreshold": 1.2-2.0
}
