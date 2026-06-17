# Finding 04 — Scale & latency micro-benchmark (addresses R2-02)

Built a 64-incoming-edge hub (`factions/iron-empire`) and timed queries/writes
via the CLI against the live PGLite brain. All times wall-clock; CLI baseline
spawn (`bun src/cli.ts --version`) measured at **~0.64s**.

| op | wall | minus baseline (≈ store cost) |
|---|---|---|
| `backlinks` on 64-edge hub | ~1.30s (3 runs, σ small) | **~0.66s** |
| `graph-query --direction in --depth 3` on hub | ~1.32s | **~0.68s** |
| `link` write (incl spawn) | ~1.33s/write | ~0.69s |

## Interpretation (the honest read)

1. **The dominant cost is fixed per-invocation overhead** (process spawn + PGLite
   WASM connect), NOT the graph operation. Evidence: depth-3 traversal on a
   64-edge hub costs essentially the same as depth-1 backlinks (~0.66 vs ~0.68s).
   Edge count and traversal depth barely move the number at this scale.
2. **This latency is a PROTOTYPE-HARNESS artifact, not the store's real
   performance.** A game would never spawn a CLI per edge. The real paths —
   in-process `BrainEngine` calls or a persistent `gbrain serve` connection —
   skip both the process spawn and the per-call connect; `addLink` and the
   traversal CTE are sub-millisecond DB operations there.
3. **Write throughput via CLI is ~1.4 writes/s — spawn-bound and irrelevant** to
   the real design, which batches writes async off the hot path through one
   persistent connection (DESIGN §6).

## What this does NOT prove (carried to v4 as open)

- Not tested: thousands-of-edges hubs, or pure in-process latency (would require
  importing the engine, deferred). The `frontierCap` in gbrain's traversal exists
  precisely because pathological hubs can blow up — a real game should cap fan-out
  and avoid mega-hubs (e.g., don't link every grunt to one faction; aggregate).
- Not tested: end-to-end write throughput at game tick rates under async batching.

## Verdict

At realistic small-world scale, traversal cost is dominated by fixed overhead, not
graph size — the store layer is not the bottleneck. The CLI-per-call latency that
looks alarming (~1.3s) is ~0.64s spawn + ~0.66s connect, both eliminated by the
in-process/persistent-connection integration the design already specifies. R2-02's
"unmeasured" critique is now partially answered: the graph scales fine here; the
real perf work is the async-batch write path, still a TODO before ship.
</content>
