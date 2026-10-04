# Runtime Verification — Phase 3 Control Runtime

## Purpose

Phase 3 introduces the smallest executable Worker Runtime core required to move beyond contract-only verification.

It is intentionally provider-neutral and uses dependency injection for persistence and generation.

## Implemented

- persisted JSON state store with atomic temp-file replacement;
- Automation Scope enforcement for Universal/Festival only;
- task request creation;
- task claim ownership;
- system-owned prompt lock and prompt hash;
- ordered execution trace;
- deterministic generation adapter interface;
- SUCCESS / FAILED / UNKNOWN result semantics;
- bounded attempts;
- checkpoint persistence;
- terminal-success fencing;
- retry only from RETRY_READY.

## Deliberate non-claims

This is a control-runtime core, not the final production deployment.

It does not yet provide:
- GitHub API persistence adapter;
- real image-provider adapter;
- distributed lease/CAS across independent processes;
- real external automation webhook ingress;
- visual output validation;
- production deployment.

Therefore this phase does not activate Wallpaper Automation and does not change Module Registry or Runtime State.

## Verification

Run:

node scripts/test_production_runtime.mjs

Expected:

Production Runtime Level-2 control-plane probe: PASS

The generation provider in this test is a deterministic mock.
