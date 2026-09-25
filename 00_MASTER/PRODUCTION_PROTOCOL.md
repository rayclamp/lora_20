# PRODUCTION_PROTOCOL.md — Inaria Production Protocol

## 1. Purpose
GitHub is the shared project state layer, production coordination layer, and official reference authority.

- Master Director/operator owns Goal/task design and operational decisions.
- All generation accounts/sessions = interchangeable Production Workers.
- Final QA is performed by the Codex/local QA workflow; Generation Workers do not perform final QA.
- PRODUCTION/PRODUCTION_GOAL.md = authoritative team-level production target.
- PRODUCTION/WORKER_POOL.md = authoritative worker-pool behavior.
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image production state.

Reference delivery is separate from project authority. The official MASTER_IMAGE may be delivered through AUTO MODE or MANUAL MODE as defined in 00_MASTER/PRODUCTION_MODES.md.

## 2. Two-phase production model

### Generation error branches

Phase 1 has controlled error branches:

QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

From GENERATING:
- GENERATION_TOOL_ERROR → retry policy / DEFERRED / system pause
- SAFETY_BLOCKED → record block → release Worker → skip task → continue with another available task
- BLOCKED → prerequisite recovery
- FAILED → technical recovery

See PRODUCTION/GENERATION_RETRY_POLICY.md for limits and circuit-breaker behavior.

### Phase 1 — Generation
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

Phase 1 completion occurs at IMAGE_CREATED.

The Worker is released immediately after IMAGE_CREATED.

### Phase 2 — Delivery and QA
IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → PASS / REPAIR / REJECT

Phase 2 is asynchronous and must not block Phase 1 generation.

Make credit exhaustion, upload failure, GitHub binary-transfer limitations, or QC delay must not stop available Workers from continuing Phase 1.

## 3. Production Goal
The active Production Goal defines how many Phase 1 images the Team must produce.

The Goal is team-level, not worker-level.

Only IMAGE_CREATED counts toward the Phase 1 Goal.

When completed >= target, Workers must stop claiming new tasks for that Goal.

The Master Director owns Goal creation and completion reporting.

## 4. Reference-first generation
Every production image must use the actual official INARIA_20_MASTER_v1.0.png as the direct Character + Visual Style Reference.

The reference may be supplied by AUTO MODE or MANUAL MODE. The same reference and the same identity/style/anatomy/generation/QA rules apply in both modes.

The worker must not generate if the actual reference image is missing, unreadable, or clearly the wrong reference/version.

## 5. Queue ownership
FETCH → SELECT → CLAIM(CAS) → VERIFY → GENERATING → GENERATE → IMAGE_CREATED

The claim update must use the exact queue blob SHA fetched immediately before the claim. A failed/conflicted claim means no ownership and no generation.

A task belongs to the Team. A Worker only holds temporary execution ownership through a valid Claim ID and lease.

## 6. Lease and takeover
- ChatGPT manual worker: 120 minutes.
- Make/OpenAI worker: 30 minutes.
- Renew before expiry when necessary.
- After expiry, re-fetch and re-claim with a new Claim ID.

If a Worker becomes unavailable before IMAGE_CREATED, the task is recoverable only through the normal release/lease recovery mechanism. Another Worker may take it when it becomes legitimately available.

Do not track account quota as a production state.

## 7. Recovery and retry control

Before an image exists:
- prerequisite blocker → record BLOCKED, clear ownership, return to QUEUED after resolution;
- GENERATION_TOOL_ERROR → follow the retry policy;
- third failed generation attempt for the same task → DEFERRED;
- SAFETY_BLOCKED → preserve task information, release the Worker, skip the task for the current run, and continue with another available task; do not automatically retry or rewrite the prompt;
- technical failure not covered above → FAILED and recover through the normal recovery process.

A DEFERRED task is not a final REJECT. It may be explicitly returned to QUEUED by the Master Director.

The generation system uses a circuit breaker:
MAX_CONSECUTIVE_GENERATION_ERRORS = 3 by default.

Three consecutive GENERATION_TOOL_ERROR events pause new generation claims. Successful IMAGE_CREATED resets the consecutive-error counter to 0.

When paused, preserve QUEUED tasks and do not mass-mark them as failed. Resume requires an explicit operational decision.

After IMAGE_CREATED: preserve the candidate and treat Phase 1 as complete. Phase 2 may continue independently.
Before an image exists: record blocker, clear ownership, return to QUEUED.
After IMAGE_CREATED: preserve the candidate and treat Phase 1 as complete. Phase 2 may continue independently.

A generated candidate must not be regenerated merely because another Worker becomes available.

## 8. Final review
Final QA is performed by the Codex/local QA workflow outside the Generation Worker session. Generation Workers only report Phase 1 IMAGE_CREATED and must not declare final PASS, REPAIR, or REJECT.

## 9. Final dataset
Only assets that pass the external Codex/local QA workflow, have complete lineage and required metadata/caption, and have no unresolved blocker may enter FINAL/.
