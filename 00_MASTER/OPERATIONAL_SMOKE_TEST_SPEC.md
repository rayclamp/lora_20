# OPERATIONAL_SMOKE_TEST_SPEC.md — Council Round 6 Phase 10

## Required smoke scenarios
1. QUEUED → CLAIMED → GENERATING → IMAGE_CREATED
2. FAILED → retry under policy
3. UNKNOWN → RECOVERY_REQUIRED → explicit recovery
4. live claim blocks second Worker
5. expired/stale lease cannot mutate current state
6. CAS conflict rejects stale write
7. duplicate completion is idempotent
8. output-count mismatch is recorded
9. circuit breaker blocks new claims after threshold
10. paused module blocks new claims

## Pass criterion
Every scenario must be deterministic and assert both final state and relevant event/history invariants.

A smoke test is not an image-quality test.
