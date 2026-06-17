#!/usr/bin/env bash
# Seed a small StoryBrain world into a live PGLite gbrain, using REAL pages +
# explicit typed edges (the engine-emitted mechanism proven in finding 02).
# Also emits world.json: the per-node `tension` scalars the game engine would
# stamp (simulated here) for the Director's resonance scorer.
#
# Usage:  GBRAIN_HOME=/tmp/storybrain-brain bash storybrain/prototype/seed.sh
# Idempotent-ish: re-running overwrites pages and re-adds edges (dupes ignored).
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
GB(){ bun src/cli.ts "$@" >/dev/null 2>&1; }
PUT(){ GB put "$1" --content "$2"; echo "  page $1"; }
LINK(){ GB link "$1" "$2" --link-type "$3" --link-source manual; echo "  edge $1 --$3--> $2"; }

echo "[seed] pages…"
PUT colonists/vera   $'---\ntype: colonist\ntension: 0.5\n---\n# Vera\nColony surgeon; translated the Ashmark inscription. Carries a grudge against the Empire that razed her birth-hold.'
PUT colonists/bjorn  $'---\ntype: colonist\ntension: 0.4\n---\n# Bjorn\nHunter and tracker. Lost his brother to an Ash-Clan ambush.'
PUT colonists/mira   $'---\ntype: colonist\ntension: 0.3\n---\n# Mira\nYoung researcher. Vera'"'"'s kin.'

PUT factions/iron-empire $'---\ntype: faction\ntension: 0.6\n---\n# The Iron Empire\nAncient imperial remnant. Hunts every shard of the Ashmark to erase the proof a king was slain.'
PUT factions/ash-clan    $'---\ntype: faction\ntension: 0.4\n---\n# The Ash-Clan\nNomad raiders of the northern wastes. Covet the Weeping Crown.'

PUT locations/ruins/sunken-vault  $'---\ntype: location\n---\n# The Sunken Vault\nA flooded ruin beneath the marsh.'
PUT locations/ruins/frostmere     $'---\ntype: location\n---\n# Frostmere Ruin\nA glacier-locked keep in the north.'

PUT artifacts/ashmark        $'---\ntype: artifact\ntier: relic\ntension: 0.7\nowned: true\n---\n# The Ashmark\nA blade forged to end a dynasty.'
PUT artifacts/weeping-crown  $'---\ntype: artifact\ntier: relic\nfragment_of_set: true\ntension: 0.5\nowned: false\n---\n# The Weeping Crown\nOne of three shards of the Sorrow Diadem.'

PUT lore/ashmark-forged $'---\ntype: lore\nsubtype: fragment\nrevealed: true\nrevealed_on_day: 412\ntension: 0.7\narc: arcs/iron-empire-reckoning\n---\n# The Ashmark Was Forged to Kill a King\nVera translated the inscription: the Grey Smith forged it to end the Iron Empire'"'"'s line. They still hunt every shard.'

PUT powers/kingsbane $'---\ntype: power\ntension: 0.4\n---\n# Kingsbane\n+ melee against faction leaders.'
PUT curses/the-hunger $'---\ntype: curse\ntension: 0.5\n---\n# The Hunger\nThe wielder must feed the blade or sicken.'

PUT arcs/iron-empire-reckoning $'---\ntype: arc\nphase: rising\nday_started: 400\ndays_since_advance: 18\nnext_beat_kind: raid\nnext_beat_faction: factions/iron-empire\ntension: 0.8\n---\n# The Iron Empire'"'"'s Reckoning\nThe Empire knows the Ashmark has surfaced. They are coming.'

echo "[seed] edges…"
# artifact spine
LINK artifacts/ashmark        colonists/vera          owned_by
LINK artifacts/ashmark        factions/iron-empire    sought_by
LINK artifacts/ashmark        locations/ruins/sunken-vault hidden_at
LINK artifacts/ashmark        powers/kingsbane        grants
LINK artifacts/ashmark        curses/the-hunger       bears
LINK artifacts/ashmark        lore/ashmark-forged     drops
LINK lore/ashmark-forged      factions/iron-empire    reveals
LINK artifacts/weeping-crown  factions/ash-clan       sought_by
LINK artifacts/weeping-crown  locations/ruins/frostmere hidden_at
# social / history
LINK colonists/vera   factions/iron-empire   rival_of
LINK colonists/bjorn  factions/ash-clan       rival_of
LINK colonists/mira   colonists/vera          kin_of
# arc wiring
LINK lore/ashmark-forged arcs/iron-empire-reckoning advances

echo "[seed] world.json (engine-stamped tension scalars)…"
cat > "$ROOT/storybrain/prototype/world.json" <<'JSON'
{
  "today": 430,
  "half_life_days": 30,
  "arc_weight": 1.8,
  "tension": {
    "colonists/vera": 0.5,
    "colonists/bjorn": 0.4,
    "colonists/mira": 0.3,
    "factions/iron-empire": 0.6,
    "factions/ash-clan": 0.4,
    "artifacts/ashmark": 0.7,
    "artifacts/weeping-crown": 0.5,
    "lore/ashmark-forged": 0.7,
    "arcs/iron-empire-reckoning": 0.8
  },
  "edge_day": {
    "lore/ashmark-forged->factions/iron-empire": 412,
    "colonists/vera->factions/iron-empire": 405,
    "artifacts/ashmark->factions/iron-empire": 415,
    "colonists/bjorn->factions/ash-clan": 360
  },
  "open_arcs": [
    {"slug": "arcs/iron-empire-reckoning", "phase": "rising",
     "days_since_advance": 18, "next_beat_kind": "raid",
     "next_beat_faction": "factions/iron-empire", "tension": 0.8}
  ]
}
JSON
echo "[seed] done."
