# PROJECT_STATUS.md — Age-20 Inaria LoRA Project Status

## Current architecture
- Master Director/operator = Goal and production-control authority
- Generation accounts/sessions = interchangeable Production Worker Pool
- Codex/local workflow = external QA authority; Generation Workers do not perform final QA
- GitHub = shared persistent state, production coordination layer, and official reference authority
- MASTER_IMAGE/INARIA_20_MASTER_v1.0.png = single official Character + Visual Style Reference
- Reference delivery modes: AUTO and MANUAL
- PRODUCTION/PRODUCTION_GOAL.md = authoritative team-level target
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image production state
- PRODUCTION/WORKER_POOL.md = authoritative worker-pool behavior

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
10. 00_MASTER/PRODUCTION_MODES.md
11. PRODUCTION/PRODUCTION_GOAL.md
12. PRODUCTION/WORKER_POOL.md

## Production Goal
- Goal ID: T108_GOAL_20260925_40_CAPACITY_TEST
- Target production task coverage: 40
- Task coverage: 40 / 40 processed
- Generation attempts observed: 35
- Unique successful candidate images observed: 25
- Duplicate generation outcomes observed: 10
- Goal status: COMPLETED_FOR_FIRST_ROUND_COVERAGE
- IMAGE_CREATED remains an event-level generation outcome, not the task-coverage metric
- Production mode: MANUAL

The target is team-level. No Worker has a fixed image quota. A Worker may stop or become unavailable at any point; another Worker can take over recoverable team tasks through the queue claim/lease protocol.

## T108 production status
- Status: FIRST_ROUND_TASK_COVERAGE_COMPLETE
- Target: 40 designed production tasks processed once
- Task Coverage: 40 / 40
- Generation attempts observed: 35
- Unique successful candidate images observed: 25
- Duplicate generation outcomes observed: 10
- Final PASS: 0 (QA paused)
- REPAIR: 0
- REJECT: 0
- Current queue may now contain only newly designed replacement tasks; do not reopen the original 40 solely to force success

T108 is the active 40-task capacity test. Current queue state is authoritative; historical T107 records remain preserved separately.

## Reference delivery status
### AUTO MODE
Status: PAUSED_PENDING_MAKE_CREDITS_AND_OPENAI_IMAGE_BRIDGE_VALIDATION
Path:
GitHub MASTER_IMAGE → Make → OpenAI image input → generation → Make → GitHub

### MANUAL MODE
Status: ACTIVE_FOR_PHASE1_PRODUCTION
Path:
Operator uploads official MASTER_IMAGE to a generation Worker → Worker verifies image → generation → IMAGE_CREATED → Worker released

Both modes use the same MASTER_IMAGE and the same project-wide rules.

## Validation result
The controlled MANUAL MODE reference test succeeded:
- official MASTER_IMAGE was supplied directly;
- the worker visually used the reference;
- Japanese anime reference matching was clean;
- character appearance and anatomy were stable;
- no major limb/hand/foot defect was observed.

This validation result allows T107 Phase 1 production to proceed.

## Phase separation
Phase 1:
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

Phase 1 completion releases the Worker immediately.

Phase 2:
IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → final QA

Phase 2 is asynchronous and must not block Phase 1 production.

## Goal stop rule
For a coverage-based Goal, Workers stop claiming tasks when the designed Task Coverage target has been processed. A completed coverage round does not imply that the candidate pool is large enough for LoRA training. MASTER DIRECTOR may then create a new Goal/batch containing new replacement designs.

## Queue ownership
Claim ownership is determined only by successful conditional update using the latest queue blob SHA.

Lease:
- ChatGPT manual: 120 minutes
- Make/OpenAI: 30 minutes

Do not track account quota as a project state. Worker replacement is handled by the Worker Pool and normal release/lease recovery.


## Dataset diversity direction
The project now explicitly treats clothing as a major dataset variable. Do not use the original MASTER_IMAGE outfit for most future production tasks. Maintain stable Inaria identity/style while varying clothing, hairstyle, action, pose, viewpoint, scene, and camera. See `00_MASTER/DATASET_DIVERSITY.md`.

The first serious LoRA training cycle should be planned around approximately 60–80 QA-approved images from a larger candidate pool, with later targeted replacement batches based on QA and LoRA test results.


## Current active production Goal
- Goal ID: T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION
- Target: 150 production tasks
- Task Coverage: 0 / 150
- QUEUED: 150
- IMAGE_CREATED: 0
- QA: PAUSED
- Queue: PRODUCTION/T109_IMAGE_QUEUE.md
- T108 remains historical and is not overwritten.
