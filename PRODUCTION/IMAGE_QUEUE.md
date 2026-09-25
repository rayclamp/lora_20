# IMAGE_QUEUE.md — Age-20 Inaria LoRA Production Queue

## Purpose
This is the shared per-image work queue and authoritative task state source for the age-20 Inaria LoRA production Goal.

It serves the interchangeable Production Worker Pool, future Make/OpenAI workers, and ACCOUNT_06 final QA.

## Active Goal
See PRODUCTION/PRODUCTION_GOAL.md.

Current Goal:
- Goal ID: T107_GOAL_20260925_20
- Target Phase 1 images: 20
- Completion event: IMAGE_CREATED
- Completed at Goal start: 0

The Goal is team-level. Workers do not have fixed image quotas.

## Production phases

### Phase 1 — Worker production
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

Generation error branches:
- GENERATION_TOOL_ERROR → retry policy / DEFERRED / system pause
- SAFETY_BLOCKED → Director Review
- BLOCKED → prerequisite recovery
- FAILED → technical recovery

IMAGE_CREATED is the Worker completion point and counts +1 toward the active Goal.

Once IMAGE_CREATED is recorded, the Worker is released immediately.

### Phase 2 — Delivery and QA
IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → PASS / REPAIR / REJECT

Phase 2 is asynchronous and must not block Phase 1.

## Queue rules
1. Only QUEUED jobs without valid ownership may be claimed.
2. Claim must succeed in GitHub before generation.
3. Claim uses the latest queue blob SHA as the optimistic concurrency guard.
4. A failed/conflicted claim means no ownership and no generation.
5. CLAIMED → GENERATING must be written before image generation.
6. Ownership lasts only through the valid lease.
7. IMAGE_CREATED completes Phase 1 for that task.
8. Phase 2 must not block the Worker from starting another task.
9. ACCOUNT_06 is the only final PASS / REPAIR / REJECT gate.
10. NEED_REGENERATE explicitly authorizes another generation attempt.
11. GENERATION_TOOL_ERROR follows PRODUCTION/GENERATION_RETRY_POLICY.md and does not count toward IMAGE_CREATED.
12. A task reaches DEFERRED after 3 failed generation attempts by default.
13. Three consecutive GENERATION_TOOL_ERROR events pause new generation claims while preserving QUEUED tasks.
14. SAFETY_BLOCKED is not automatically retried and requires Director Review.
15. Workers must re-fetch the queue and active Goal after every completed or released job.
16. No new task may be claimed once the active Goal target has been reached.

## State definitions
- QUEUED: available for claim.
- CLAIMED: exclusive lease acquired, generation not started.
- GENERATING: generation started.
- IMAGE_CREATED: candidate successfully generated; Phase 1 complete.
- UPLOADING: Phase 2 asset transfer is in progress.
- UPLOADED: production asset exists and lineage is recorded.
- QC_PENDING: asset is ready for ACCOUNT_06 review.
- PASS: final approved by ACCOUNT_06.
- REPAIR: localized repair required.
- REJECT: candidate not accepted.
- NEED_REGENERATE: explicit instruction to create a replacement candidate.
- BLOCKED: temporary prerequisite prevents progress.
- FAILED: technical failure requiring recovery.
- DEFERRED: generation attempts exhausted for the current retry policy; not a final QA decision.
- SAFETY_BLOCKED: ChatGPT explicitly blocked the generation for safety; Director Review required.

## Lease
- ChatGPT manual worker: 120 minutes.
- Make/OpenAI worker: 30 minutes.
- Expired ownership must never be reused; the job must be re-claimed with a new Claim ID.

## Claim protocol
FETCH latest queue + SHA → SELECT available task → CLAIM using exact SHA → VERIFY ownership → GENERATING → GENERATE → IMAGE_CREATED.

Reading QUEUED does not equal ownership. Successful conditional update is the only ownership event.

## First-round 20 jobs

| ID | Character | Clothing | Scene | Pose/Camera | Prompt | Worker | Status | Claim ID | Lease Until | Attempts | Last Error | Final QC |
|---|---|---|---|---|---|---|---|---|---|---:|---|---|
| IMG_01 | C01 | C01 | S01 | P01 | Prompt 01 | rayclamp | IMAGE_CREATED | CLAIM-T107-IMG_01-RAYCLAMP-20260925T2144 | 2026-09-25 23:44 +08:00 | 1 | - | - |
| IMG_02 | C01 | C02 | S02 | P02 | Prompt 02 | - | SAFETY_BLOCKED | - | - | 1 | EXPLICIT_SAFETY_BLOCK | - |
| IMG_03 | C01 | C03 | S03 | P04 | Prompt 03 | ChatGPT-Generation-Worker | GENERATING | CLAIM-T107-IMG_03-CHATGPT-20260925T2224 | 2026-09-26 00:24 +08:00 | 1 | - | - |
| IMG_04 | C01 | C04 | S04 | P04 | Prompt 04 | - | QUEUED | - | - | 1 | - |
| IMG_05 | C01 | C05 | S05 | P05 | Prompt 05 | - | QUEUED | - | - | 1 | - |
| IMG_06 | C01 | C06 | S06 | P06 | Prompt 06 | - | QUEUED | - | - | 1 | - |
| IMG_07 | C01 | C07 | S07 | P07 | Prompt 07 | - | QUEUED | - | - | 0 | - |
| IMG_08 | C01 | C08 | S08 | P08 | Prompt 08 | - | QUEUED | - | - | 0 | - |
| IMG_09 | C01 | C09 | S09 | P09 | Prompt 09 | - | QUEUED | - | - | 0 | - |
| IMG_10 | C01 | C10 | S10 | P10 | Prompt 10 | - | QUEUED | - | - | 0 | - |
| IMG_11 | C01 | C11 | S11 | P11 | Prompt 11 | - | QUEUED | - | - | 0 | - |
| IMG_12 | C01 | C12 | S12 | P12 | Prompt 12 | - | QUEUED | - | - | 0 | - |
| IMG_13 | C01 | C13 | S13 | P13 | Prompt 13 | - | QUEUED | - | - | 0 | - |
| IMG_14 | C01 | C14 | S14 | P14 | Prompt 14 | - | QUEUED | - | - | 0 | - |
| IMG_15 | C01 | C15 | S15 | P15 | Prompt 15 | - | QUEUED | - | - | 0 | - |
| IMG_16 | C01 | C16 | S16 | P16 | Prompt 16 | - | QUEUED | - | - | 0 | - |
| IMG_17 | C01 | C17 | S17 | P17 | Prompt 17 | - | QUEUED | - | - | 0 | - |
| IMG_18 | C01 | C18 | S18 | P18 | Prompt 18 | - | QUEUED | - | - | 0 | - |
| IMG_19 | C01 | C19 | S19 | P19 | Prompt 19 | - | QUEUED | - | - | 0 | - |
| IMG_20 | C01 | C20 | S20 | P20 | Prompt 20 | - | QUEUED | - | - | 0 | - |

## Current reconciled count
- Goal target: 20
- Phase 1 IMAGE_CREATED: 1
- Phase 1 remaining: 19
- Generation system state: ACTIVE
- Consecutive GENERATION_TOOL_ERROR count: 0
- QUEUED: 17
- CLAIMED: 1
- GENERATING: 0
- IMAGE_CREATED: 1
- UPLOADING: 0
- UPLOADED: 0
- QC_PENDING: 0
- PASS: 0
- REPAIR: 0
- REJECT: 0
- BLOCKED: 0
- FAILED: 0
- DEFERRED: 0
- SAFETY_BLOCKED: 1

## Historical candidates
IMG_01–IMG_05 were previously generated under an obsolete production gate. Their historical outputs remain in STATUS/PRODUCTION_LOG.md but do not count toward the active Goal.

Their production tasks are re-queued above with Attempts preserved for traceability.

## Worker continuation rule
After every Phase 1 completion:
1. Re-fetch the latest queue.
2. Re-fetch the active Production Goal.
3. If the Goal is incomplete, claim another available task.
4. If the Goal is complete, stop claiming.

Never:
- use an old queue snapshot for a new claim;
- generate before successful claim;
- assume startup order grants ownership;
- treat ChatGPT output-area existence as UPLOADED;
- declare final PASS;
- continue after lease expiry;
- wait for Phase 2 upload or QA before continuing Phase 1.

## Related authoritative files
- 00_MASTER/MASTER_SPEC.md
- 00_MASTER/ANATOMY_STABILITY.md
- 00_MASTER/GENERATION_WORKER_PROTOCOL.md
- 00_MASTER/PRODUCTION_PROTOCOL.md
- 00_MASTER/PRODUCTION_MODES.md
- 00_MASTER/QUALITY_CONTROL.md
- PRODUCTION/PRODUCTION_GOAL.md
- PRODUCTION/WORKER_POOL.md
- 05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md
- STATUS/PRODUCTION_LOG.md
