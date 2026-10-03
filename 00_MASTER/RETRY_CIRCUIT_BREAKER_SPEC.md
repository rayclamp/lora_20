# RETRY_CIRCUIT_BREAKER_SPEC.md — Council Round 6 Phase 9

## Retry
Only explicit FAILED results are retryable.
UNKNOWN requires recovery first.

Default module policy:
- maximum 3 genuine generation-tool attempts per task unless a stricter active Goal exists;
- three consecutive genuine generation-tool errors pause new generation claims;
- successful IMAGE_CREATED resets the consecutive error counter.

## Circuit breaker
States:
- CLOSED: claims allowed;
- OPEN: new claims blocked;
- HALF_OPEN: optional future controlled probe state.

A circuit breaker never changes a task result.
It only controls whether new claims may begin.

## Safety
SAFETY_BLOCKED is not a generation-tool error and must never be rewritten to bypass safety restrictions.
