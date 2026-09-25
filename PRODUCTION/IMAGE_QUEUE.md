# IMAGE_QUEUE.md — Age-20 Inaria LoRA Production Queue

## Purpose
This is the shared work queue and authoritative per-image production state source for the first 20-image dataset.

It serves ChatGPT Generation Workers, future Make/OpenAI workers, and ACCOUNT_06 final QA.

## Current production gate
The first five historical candidates were generated before the current Reference Style Lock, anatomy stability rules, and asset-transfer gate were fully enforced.

Therefore:
- IMG_01–IMG_05 are not approved training images.
- Their previous candidate results remain historical in STATUS/PRODUCTION_LOG.md.
- They must not be treated as valid completed production.
- IMG_01–IMG_05 require controlled regeneration.
- T107 remains paused until the controlled generation test passes.

## Queue rules
1. Only QUEUED jobs without valid ownership may be claimed.
2. Claim must succeed in GitHub before generation.
3. Claim uses the latest queue blob SHA as the optimistic concurrency guard.
4. A failed/conflicted claim means no ownership and no generation.
5. CLAIMED → GENERATING must be written before image generation.
6. Ownership lasts only through the valid lease.
7. A generated candidate is not QC-ready until its production asset and lineage are recorded.
8. ACCOUNT_06 is the only final PASS / REPAIR / REJECT gate.
9. NEED_REGENERATE explicitly authorizes another generation attempt.
10. Workers must re-fetch the queue after every completed or released job.

## State definitions
- QUEUED: available for claim.
- CLAIMED: exclusive lease acquired, generation not started.
- GENERATING: generation started.
- IMAGE_CREATED: candidate exists in the generating environment.
- UPLOADING: asset transfer is in progress.
- UPLOADED: production asset exists and lineage is recorded.
- QC_PENDING: asset is ready for ACCOUNT_06 review.
- PASS: final approved by ACCOUNT_06.
- REPAIR: localized repair required.
- REJECT: candidate not accepted.
- NEED_REGENERATE: explicit instruction to create a new candidate.
- BLOCKED: temporary prerequisite prevents progress.
- FAILED: technical failure requiring recovery.

## Lease
- ChatGPT manual worker: 120 minutes.
- Make/OpenAI worker: 30 minutes.
- Expired ownership must never be reused; the job must be re-claimed with a new Claim ID.

## Claim protocol
FETCH latest queue + SHA → SELECT lowest available QUEUED → CLAIM using exact SHA → VERIFY ownership → GENERATING → GENERATE.

Reading QUEUED does not equal ownership. Successful conditional update is the only ownership event.

## First-round 20 jobs

| ID | Character | Clothing | Scene | Pose/Camera | Prompt | Worker | Status | Claim ID | Lease Until | Attempts | Final QC |
|---|---|---|---|---|---|---|---|---|---|---:|---|
| IMG_01 | C01 | C01 | S01 | P01 | Prompt 01 | - | NEED_REGENERATE | - | - | 1 | - |
| IMG_02 | C01 | C02 | S02 | P02 | Prompt 02 | - | NEED_REGENERATE | - | - | 1 | - |
| IMG_03 | C01 | C03 | S03 | P04 | Prompt 03 | - | NEED_REGENERATE | - | - | 1 | - |
| IMG_04 | C01 | C04 | S04 | P04 | Prompt 04 | - | NEED_REGENERATE | - | - | 1 | - |
| IMG_05 | C01 | C05 | S05 | P05 | Prompt 05 | - | NEED_REGENERATE | - | - | 1 | - |
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
- Target: 20
- Historical candidates: 5
- Valid production candidates: 0
- Final PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 5
- CLAIMED: 0
- GENERATING: 0
- IMAGE_CREATED: 0
- UPLOADING: 0
- UPLOADED: 0
- QC_PENDING: 0
- QUEUED: 15
- BLOCKED: 0
- FAILED: 0

## Worker continuation rule
After every job, re-fetch the latest queue.

Never:
- use an old queue snapshot for a new claim;
- generate before successful claim;
- assume startup order grants ownership;
- treat ChatGPT output-area existence as uploaded production asset;
- declare final PASS;
- continue after lease expiry.

## Related authoritative files
- 00_MASTER/MASTER_SPEC.md
- 00_MASTER/ANATOMY_STABILITY.md
- 00_MASTER/GENERATION_WORKER_PROTOCOL.md
- 00_MASTER/PRODUCTION_PROTOCOL.md
- 00_MASTER/QUALITY_CONTROL.md
- 05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md
- STATUS/PRODUCTION_LOG.md
