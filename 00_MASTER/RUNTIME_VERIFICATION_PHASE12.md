# Runtime Verification Phase 12 — Provider Activation Enforcement

## Objective

Make the Phase-11 fail-closed provider registry an executable Runtime boundary without selecting or activating any real provider.

## Changes

- Added `scripts/runtime/provider_registry_gate.mjs`.
- Production execution requires a complete provider registration.
- Only `STATUS: VERIFIED` is production-eligible.
- Missing registration, incomplete registration, non-VERIFIED status, or missing supported output types fail closed.
- Worker Runtime now forwards `taskId` and `traceRunId` to the provider boundary.
- Existing deterministic harnesses remain provider-neutral and do not require live-provider registration.

## Verification

Phase-12 integration test proves:

`REQUEST → CLAIM → DESIGN → LOCKED PROMPT → VERIFIED PROVIDER GATE → PROVIDER BOUNDARY`

and verifies that:

- the exact locked Prompt reaches the provider boundary;
- task identity reaches the provider boundary;
- trace identity reaches the provider boundary;
- an `AUTHORIZED`, but not `VERIFIED`, provider is rejected before transport invocation.

## Safety Boundary

This phase does **not**:

- select a real provider;
- store credentials;
- activate ComfyUI;
- activate Make;
- generate a real image;
- change the current provider registry state from `UNREGISTERED`.

The next production gate remains exactly one controlled real-image E2E after an explicit provider is selected and authorized.
