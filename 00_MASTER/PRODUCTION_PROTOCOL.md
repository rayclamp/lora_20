# PRODUCTION_PROTOCOL.md — Inaria Production Protocol

## 1. Purpose
GitHub is the shared project state layer, production coordination layer, and official reference authority.

- ACCOUNT_06 = Master Director / Final Reviewer / QA.
- All other generation accounts/sessions = interchangeable Production Workers.
- PRODUCTION/PRODUCTION_GOAL.md = authoritative team-level production target.
- PRODUCTION/WORKER_POOL.md = authoritative worker-pool behavior.
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image production state.

Reference delivery is separate from project authority. The official MASTER_IMAGE may be delivered through AUTO MODE or MANUAL MODE as defined in 00_MASTER/PRODUCTION_MODES.md.

## 2. Two-phase production model

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

## 7. Recovery
Before an image exists: record blocker, clear ownership, return to QUEUED.
After IMAGE_CREATED: preserve the candidate and treat Phase 1 as complete. Phase 2 may continue independently.

A generated candidate must not be regenerated merely because another Worker becomes available.

## 8. Final review
ACCOUNT_06 uses 00_MASTER/QUALITY_CONTROL.md to review the actual production asset. Only ACCOUNT_06 may set final PASS, REPAIR, or REJECT.

## 9. Final dataset
Only assets with final PASS, complete lineage, required metadata/caption, and no unresolved blocker may enter FINAL/.
