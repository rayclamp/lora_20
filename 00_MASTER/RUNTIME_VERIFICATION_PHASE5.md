# Runtime Verification — Phase 5 Canonical Context Enforcement

## Purpose

Phase 5 verifies that the executable Worker Runtime refuses to design-lock or generate when required reference authority or Scene Intent context is invalid, blocked, or incomplete.

## Implemented

- explicit runtime validation of allowed reference states;
- REFERENCE_BLOCKED hard fence;
- required Scene Intent state validation;
- MISSING, CONFLICT, and BLOCKED Scene Intent hard fences;
- enforcement of all seven required Scene Intent fields;
- trace recording of reference status, reference provenance, Scene Intent status, provenance, and resolved fields;
- deterministic context-gate probe in scripts/test_runtime_context_gates.mjs;
- CI coverage for the Phase-5 context-gate probe.

## What this proves

The Worker Runtime has an executable control-plane boundary that prevents prompt lock and generation from proceeding with invalid canonical-context states.

The deterministic probe verifies:

1. valid NO_REFERENCE plus resolved Scene Intent can reach prompt lock and successful execution;
2. blocked reference context is rejected;
3. missing Scene Intent is rejected;
4. conflicting Scene Intent is rejected;
5. incomplete Scene Intent is rejected;
6. invalid reference state is rejected.

## Important limitation

This phase validates the runtime gate, not automatic resolution from the repository's canonical documents.

The current runtime receives structured reference and sceneIntent context from its caller. It does not yet:

- parse CANONICAL_PATH_REGISTRY.md automatically;
- load the selected module Reference Policy itself;
- resolve a reference source from module policy;
- resolve Theme into Scene Intent from module-approved deterministic rules;
- verify visual reference assets;
- prove that upstream automation supplied truthful provenance.

Those capabilities belong to the next context-resolver phase.

## What this does not prove

This phase does not claim:

- live production Wallpaper Automation;
- real image generation;
- visual QA;
- real provider integration;
- live remote GitHub mutation;
- production webhook ingress;
- distributed leases or heartbeats;
- full canonical repository context resolution.

## Verification

Run:

    node scripts/test_runtime_context_gates.mjs

Expected:

    Worker Runtime Phase-5 canonical context gate probe: PASS

## Current maturity

LEVEL_2_CONTROL_RUNTIME + LEVEL_2_CAS_BOUNDARY + LEVEL_2_CONTEXT_ENFORCEMENT

This remains below PRODUCTION_AUTOMATION_VERIFIED.