# Bond-roller results — all 10 worlds (seed 7, hybrid3 casts)

Deterministic run of `bond-roller.ts` across the full corpus, for comparison data.
Per-world detail in `bond-rolls/<theme>.txt`. Reproduce:
`for t in ...; do bun storybrain/generator/bond-roller.ts storybrain/corpus/$t.hybrid3.json 7; done`

## Per-world

| Theme | bonds formed | left unbonded | relation mix |
|---|---|---|---|
| the-living-marrow | 4 | 3 | decoded×2, covets, wields |
| first-contact-diplomacy | 1 | 5 | heir_to |
| bio-symbiosis-horror | 3 | 3 | heir_to×2, covets |
| machine-successor | 3 | 4 | covets×2, operates |
| time-war | 3 | 4 | covets×3 |
| generation-ship-identity | 4 | 2 | decoded×2, denies_to, operates |
| megastructure-absent-architects | 5 | 2 | operates×2, covets, decoded, heir_to |
| extinction-plague-vector | 4 | 2 | operates×2, covets, heir_to |
| crowded-trade-federation | 2 | 4 | covets×2 |
| uplift-nursery-world | 4 | 2 | heir_to×2, operates, covets |

**Totals: 33 bonds formed, 31 items left unbonded (~52% bond rate).** A healthy
"not everything bonds" rate — the unforced gate is doing real work across the board.

## Relation distribution (33 bonds)

`covets` 12 · `heir_to` 7 · `operates` 7 · `decoded` 5 · `wields` 1 · `denies_to` 1.

## Observations (for calibration / comparison)

1. **`covets` is over-represented (36%).** It fires on keyword overlap between a
   colonist's (rich, sentence-long) `want` and the artifact's text — too easy to
   trigger. This is the strongest argument for the planned upgrade: replace the
   keyword `want`-match with an LLM/embedding **semantic** match so `covets` only
   fires on a genuine alignment, not incidental shared words. (finding 18 next-step.)
2. **Provenance (`heir_to`/`denies_to`) fires exactly where it should** — worlds
   with named alien-remnant characters sharing a faction with an artifact's maker
   (bio-symbiosis, megastructure, plague, uplift, gen-ship). The strongest, most
   "of course" bonds cluster there. Human-only-cast worlds lean on skill/want.
3. **first-contact stays the deliberate outlier** (1 formed / 5 unbonded): its
   alien gift-artifacts don't resonate with the human envoy crew, so the roller
   abstains — the clearest proof the gate prevents forced links. (A design read:
   if the friend wants those gifts to bond, the fix is in-world — give the crew a
   xeno-specialist or let the alien emissaries be the bonders — not in the roller.)
4. **Skill bonds (`decoded`/`operates`/`wields`) track the skill profile**: codex/
   record artifacts → `decoded` (xeno/research); key/core/engine → `operates`
   (engineering); weapon → `wields`. Ship-crew vs colonist skill flavors both feed
   it correctly.

## Status

Complete bond data now exists for all 10 worlds (committed), so future changes
(semantic `want`-match, threshold tuning, deepening) can be compared against this
seed-7 baseline. Nothing here is wired into a runtime loop yet — these are the
roller's offline rolls over the current casts.
</content>
