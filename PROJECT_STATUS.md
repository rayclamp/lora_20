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
- Goal ID: T107_GOAL_20260925_20
- Target Phase 1 images: 20
- Phase 1 completed: 0
- Phase 1 remaining: 20
- Goal status: ACTIVE
- Completion event: IMAGE_CREATED
- Production mode: MANUAL

The target is team-level. No Worker has a fixed image quota. A Worker may stop or become unavailable at any point; another Worker can take over recoverable team tasks through the queue claim/lease protocol.

## T107 production status
- Status: ACTIVE_MANUAL_PHASE1
- Target: 20 new Phase 1 candidates
- Historical candidates retained: 5
- Valid Phase 1 production candidates before this run: 0
- Final PASS: 0
- REPAIR: 0
- REJECT: 0
- QUEUED: 20
- CLAIMED: 0
- GENERATING: 0
- IMAGE_CREATED: 0
- UPLOADING: 0
- UPLOADED: 0
- QC_PENDING: 0
- BLOCKED: 0
- FAILED: 0

IMG_01–IMG_05 are historical candidates that require regeneration and are therefore re-queued as production tasks. They do not count toward the new Goal until a new IMAGE_CREATED event occurs.

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
When Phase 1 completed reaches the active Goal target, Workers must stop claiming new tasks for that Goal.

## Queue ownership
Claim ownership is determined only by successful conditional update using the latest queue blob SHA.

Lease:
- ChatGPT manual: 120 minutes
- Make/OpenAI: 30 minutes

Do not track account quota as a project state. Worker replacement is handled by the Worker Pool and normal release/lease recovery.
