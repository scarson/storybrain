# Finding 19 — Secondhand (inherited) bonds + richer relationships, on all 10

Sam's ask: (a) secondhand relationships — a character's ancestor/mentor/etc. having
a relationship with an item that colors theirs; (b) richer character↔character
relationship types (mentor, role-model, rival, …). Both built, baked into the
pipeline, and run on the full corpus.

## The mechanic: a secondhand bond is typed by the PAIR of relations in the chain

`bond-roller-secondhand.ts` walks `C --R1--> P --R2--> artifact` (or P's
maker-people own/forged it) and emits a bond whose **type + valence are a function
of (carrier-class(R1), artifact-class(R2))**:

| carrier (R1) | × held | × fate (died_for/sealed) | × wants |
|---|---|---|---|
| **lineage** (ancestor/descendant/successor) | `heir_to` | `burdened_by` | `inherits_the_hunt_for` |
| **legacy** (mentor/role-model/protege/reveres) | `lives_up_to` | `must_finish` | `chases_their_mentors_dream_of` |
| **antagonism** (rival/grudge/betrayed/estranged) | `spites` | `vindicated_by` | `denies_to` |
| **grief** (lover) | `grieves_through` | `mourns_through` | — |
| **obligation** (owes/served/commands/ally) | `obligated_over` | `bound_by` | `owes_the_pursuit_of` |

Transmission strength = closeness(R1) × intensity(R2); below threshold → no bond.
**Unforced by construction:** both links (C→P and P→artifact) must already exist —
the system never invents a tie, it only propagates one that's real.

## The richer relationship vocabulary (now in pipeline)

Added directional verbs: `mentor_of`/`mentored_by`, `role_model_of`/`reveres`,
`protege_of`, `predecessor_of`/`successor_of`, `ancestor_of`/`descendant_of`,
`commands`/`served`, `estranged_from`. Baked into the Stage-E prompt and credited
by `character-lint` (CHAR_REL set extended). These are *what create the chains*:
direction matters (a protege inherits the mentor's burden, not the reverse).

## Run on all 10 (Stage F enrichment + roller)

A relationship-enrichment pass added these directional ties + intermediary
forebear→artifact links (a grandmother who `died_for` a relic, a mentor who
`bonded_to` one, a rival's people who `forged` one). All 10 stay VALID +
CHARACTER-OK. Secondhand bonds, baseline → after:

| theme | secondhand bonds (before → after) |
|---|---|
| the-living-marrow | 0 → 9 |
| first-contact-diplomacy | 2 → 11 |
| bio-symbiosis-horror | 3 → 14 |
| machine-successor | 0 → 4 |
| time-war | 0 → 10 |
| generation-ship-identity | 0 → 9 |
| megastructure-absent-architects | 0 → 8 |
| extinction-plague-vector | 10 → 25 |
| crowded-trade-federation | 0 → 8 |
| uplift-nursery-world | 5 → 18 |
| **total** | **20 → 116** |

Relation-type spread (116 bonds): `heir_to` 31, `lives_up_to` 28, `spites` 20,
`must_finish` 19, `burdened_by` 19, `obligated_over` 15, + a few want-class. A
healthy mix of inheritance, legacy, antagonism, and obligation — not one note.

## The bonds it produced (the point — intergenerational object-weight)

- **lineage/fate:** *drill-chief Bren is `burdened_by` the vitrified-map his
  grandmother `died_for` finishing* (marrow); *Imani is `burdened_by` the
  founding-work-order her grandmother `died_for`* (machine).
- **lineage/held:** *Iris is `heir_to` the vault holding her ancestor's sealed
  memory* (gen-ship — the "it was us" reveal landing through bloodline); *Korl is
  `heir_to` the ring his backward-marching ancestor forged across reversed time*
  (time-war).
- **legacy/fate:** *the medic `must_finish` the graft his mentor bonded to and died
  completing* (bio); *the archivist `must_finish` the key her mentor `died_for`*
  (megastructure); *Quen `must_finish` the relic his murdered mentor `died_for`*
  (trade); *warden Halden `must_finish` the seal her predecessor died sealing*
  (plague).
- **grief/lineage compound:** *the midwife is `burdened_by` the gene-loom a
  harvested ancestor `died_for` — the same loom now tilting his own daughter toward
  ripeness* (uplift).
- **antagonism:** *Mira `spites` the artifacts forged by her rival's people* (bio).

Each is unforced: the chain was already in the graph; the roller only named the
inherited weight.

## How it feeds the storyteller

Secondhand bonds are even richer Director fuel than firsthand: when a
`burdened_by`/`must_finish`/`heir_to` artifact surfaces, the inheriting character's
tension spikes AND the dead forebear's story is in scope — so the Director can
stage a beat that pays off two generations at once (the granddaughter at the relic
her grandmother died for). They also DEEPEN over play (a `lives_up_to` can become
`must_finish` if the mentor dies), reusing the same resonance check.

## Honest limits / next

- The (R1,R2)→relation MAP is hand-authored; reasonable but untuned by playtest.
- `lives_up_to` is high (28) — mentor/role-model carriers are generous; may want a
  per-carrier cap so secondhand doesn't out-mass firsthand.
- Forebears were added as deceased `colonist` nodes (the roller requires P to be a
  colonist); a dedicated `figure`/`ancestor` subtype would be cleaner.
- Same calibration caveat as firsthand: thresholds + rarity want playtest data.
- Complete seed-7 data for all 10 is committed (`bond-rolls-secondhand/`) as a
  baseline for tuning.
</content>
