# COUNCIL_ROUND12_CROSS_MODULE_RUNTIME_VERIFICATION.md

## Status

**IN PROGRESS — CI verification pending**

## Objective

Verify that Universal Wallpaper, Festival Wallpaper, and LoRA Production are separate production modules that share one Worker Runtime rather than three independent production systems.

## Required invariants

1. All production modules route through `00_MASTER/PRODUCTION_WORKER_RUNTIME.md`.
2. Dispatch is shared and does not become module-owned.
3. Claim / Lease / CAS remains shared ownership authority.
4. Module-specific identity/reference/data/state remain isolated.
5. Universal Wallpaper cannot read LoRA or Festival production state.
6. Festival Wallpaper cannot read LoRA or Universal production state.
7. LoRA cannot read Wallpaper production state or Festival cultural data as production state.
8. LoRA remains PAUSED and cannot become executable through the runtime test.
9. Artifact persistence remains an Output boundary, not a module-specific Worker system.
10. No module may declare a second Worker or Dispatch system.

## Verification method

The deterministic self-test `scripts/test_cross_module_runtime.mjs` verifies shared runtime routing, module-owned state paths, cross-module forbidden references, shared Dispatch and Output boundaries, paused LoRA non-activation, and module Worker adapter boundaries.

This is a contract/invariant test, not image generation.

## CI requirement

The exact branch commit and corresponding GitHub Actions run must pass:

- architecture validation;
- architecture validator self-test;
- Universal Wallpaper batch validator;
- batch validator self-test;
- concurrency self-test;
- Worker Pool self-test;
- cross-module runtime self-test.

## Finalization rule

Only after the exact tested commit and CI run are verified successful may this document be promoted to **PASS**.
