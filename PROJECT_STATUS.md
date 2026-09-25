# PROJECT_STATUS.md — Age-20 Inaria LoRA Project Status

## Current architecture
- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_01–05, ACCOUNT_07–08 = GENERATION_WORKER
- GitHub = shared persistent state
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image production state
- MASTER_IMAGE/INARIA_20_MASTER_v1.0.png = Character + Visual Style Reference

## Current master rules
The current mandatory standards are:
1. 00_MASTER/MASTER_SPEC.md
2. 00_MASTER/STYLE_MASTER.md
3. 00_MASTER/IDENTITY_MASTER.md
4. 00_MASTER/ANATOMY_STABILITY.md
5. 00_MASTER/GENERATION_RULES.md
6. 00_MASTER/DRAWING_INSTRUCTIONS.md
7. 00_MASTER/GENERATION_WORKER_PROTOCOL.md
8. 00_MASTER/QUALITY_CONTROL.md
9. 00_MASTER/PRODUCTION_PROTOCOL.md

## Production status
T107 — IMAGE_PRODUCTION
- Status: PAUSED_FOR_VALIDATION
- Target: 20
- Historical candidates: 5
- Valid production candidates: 0
- Final PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 5
- QUEUED: 15
- Active claims: 0
- Generating: 0
- Uploaded: 0
- QC_PENDING: 0

## Why production is paused
The first five candidates were generated before the current reference-style, anatomy-stability, and production-asset gates were fully enforced. They are retained only as historical evidence and are not valid training images.

## Validation gate before resuming T107
1. Use the current MASTER_IMAGE directly.
2. Generate one controlled test.
3. Confirm Japanese anime reference matching.
4. Confirm no extra/missing/fused limbs or digits.
5. Confirm stable hand/foot and object contact.
6. Confirm the candidate can be transferred to production storage with lineage.
7. ACCOUNT_06 reviews the test before resuming the queue.

## Queue lock
FETCH → SELECT → CLAIM(CAS) → VERIFY → GENERATING → GENERATE → IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING

Claim ownership is determined only by successful conditional update using the latest queue blob SHA.

Lease:
- ChatGPT manual: 120 minutes
- Make/OpenAI: 30 minutes

Do not rely on staggered account startup.

## Continuation rule
Do not resume IMG_01–IMG_20 production until the validation gate passes.