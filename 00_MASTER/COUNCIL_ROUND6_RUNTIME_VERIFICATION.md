# COUNCIL_ROUND6_RUNTIME_VERIFICATION.md

## Status
Council Round 6 — Runtime Execution Verification

This record is updated only from executable deterministic evidence.

## Verification levels
- DOCUMENTED: contract exists.
- EXECUTABLE: runtime code exists.
- RUNTIME-VERIFIED: deterministic test executed successfully.

## Phase 4–10
Runtime implementation and smoke tests are maintained under scripts/runtime_engine.mjs and scripts/test_runtime_engine.mjs.

## Phase 11
Final verification requires:
- all required contracts present;
- runtime self-test PASS;
- state-machine transitions enforced;
- Claim/Lease/CAS enforced;
- event persistence enforced;
- UNKNOWN recovery enforced;
- retry/circuit breaker enforced;
- cross-module activation guard enforced;
- no architecture regression.

The final result must distinguish:
1. repository runtime harness verification;
2. external ComfyUI/model verification;
3. visual QA verification.

No external integration may be marked verified merely because the harness passes.
