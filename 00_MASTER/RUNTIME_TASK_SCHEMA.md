# RUNTIME_TASK_SCHEMA.md — Canonical Persistent Task Schema

## 1. Purpose

This document defines the platform-wide persistent task envelope for future runtime execution.
It defines data shape and ownership boundaries, not module activation and not a runnable queue.

Current repository status:
- No executable persistent Task Store exists.
- No executable Goal/Batch/Queue runtime exists.
- LORA_PRODUCTION remains PAUSED.
- FESTIVAL_WALLPAPER remains ACTIVE / MANUAL_DESIGN.

## 2. Authority

Runtime authority remains:
USER INTENT → RUNTIME_STATE → MODULE_REGISTRY → AUTHORITY_MATRIX → ACTIVE MODULE PROTOCOL → MODULE-OWNED STATE

This schema does not override RUNTIME_STATE, MODULE_REGISTRY, or module-owned rules.
Generic fields defined here are platform fields. Module-specific design fields remain owned by the selected module.

## 3. Record identity

| Field | Required | Meaning |
|---|---|---|
| SCHEMA_VERSION | YES | Version of this task schema |
| TASK_ID | YES | Globally unique task identity |
| MODULE_ID | YES | Owning production module |
| GOAL_ID | NO | Parent goal when the module uses goals |
| BATCH_ID | NO | Parent batch when the module uses batches |
| CREATED_AT | YES | Immutable creation timestamp |
| UPDATED_AT | YES | Latest persisted record timestamp |
| STATE_VERSION | YES | Monotonic version used for CAS |
| STATUS | YES | Current lifecycle state |

TASK_ID is immutable. A task must never change MODULE_ID after creation.

## 4. Lifecycle status

Normal production lifecycle: QUEUED → CLAIMED → GENERATING → IMAGE_CREATED
Failure: GENERATING → FAILED
Uncertain execution: GENERATING → UNKNOWN → RECOVERY_REQUIRED

A task in UNKNOWN must not be converted directly to QUEUED, CLAIMED, or GENERATING.
BLOCKED may be used when execution is explicitly prevented by an authoritative condition.
QA states are downstream and are not part of the production generation lifecycle.

## 5. Persistent task envelope

Canonical conceptual fields:

SCHEMA_VERSION
TASK_ID
MODULE_ID
GOAL_ID (optional)
BATCH_ID (optional)
STATUS
CREATED_AT
UPDATED_AT
STATE_VERSION

DESIGN:
- DESIGN_LOCK
- FORMAT_LOCK
- EXPECTED_OUTPUT_COUNT
- MODULE_PAYLOAD_REF

EXECUTION:
- ATTEMPT_COUNT
- GENERATION_RESULT
- RESULT_REFERENCE
- OUTPUT_COUNT

CLAIM:
- CLAIM_ID
- WORKER_ID
- CLAIMED_AT
- LEASE_EXPIRES_AT

RECOVERY:
- RECOVERY_STATUS
- RECOVERY_REASON
- RECOVERY_EVENT_ID

ERROR:
- ERROR_CODE
- ERROR_MESSAGE

INTEGRITY:
- CURRENT_EVENT_ID
- IDEMPOTENCY_KEY

This is a schema illustration, not an executable task record.

## 6. Field ownership

### Platform-owned

The runtime layer owns SCHEMA_VERSION, TASK_ID, MODULE_ID, GOAL_ID, BATCH_ID, STATUS, CREATED_AT, UPDATED_AT, STATE_VERSION, EXECUTION, CLAIM, RECOVERY, ERROR, and INTEGRITY.

### Module-owned

The module owns the contents referenced by DESIGN.MODULE_PAYLOAD_REF.
Wallpaper modules may own viewpoint, shot, composition, action, clothing, hairstyle, scene, prompt, and wallpaper format details.
LoRA may own identity/reference data, dataset-specific attributes, LoRA-specific prompt/design information, and candidate/dataset metadata.

A module must not place another module's authority data inside its payload merely to bypass boundaries.

## 7. Design locks

A task may declare DESIGN_LOCK, FORMAT_LOCK, and EXPECTED_OUTPUT_COUNT.
For wallpaper tasks, detailed meaning is defined by 00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md.
A locked design must not be silently replaced by a Worker.
If required design data is incomplete or contradictory, execution stops and the state conflict is recorded.

## 8. Claim and lease fields

A claimed task must persist all of:
- CLAIM_ID
- TASK_ID
- WORKER_ID
- CLAIMED_AT
- LEASE_EXPIRES_AT
- STATE_VERSION

Claim acquisition must be atomic.
A Worker may update a task only while it owns a valid live claim/lease.
An expired lease does not grant permission to silently reuse ownership.

## 9. CAS / version rule

Every mutable task update must identify the STATE_VERSION it was based on.
Successful persistence increments STATE_VERSION.
If the authoritative version differs:
1. reject the stale write;
2. do not assume the write succeeded;
3. re-read authoritative state;
4. determine whether recovery is possible;
5. never generate a second candidate merely because a persistence operation conflicted.

## 10. Generation result

GENERATION_RESULT may be SUCCESS, FAILED, UNKNOWN, or null before generation.

Rules:
- SUCCESS → STATUS becomes IMAGE_CREATED.
- FAILED → STATUS becomes FAILED.
- UNKNOWN → STATUS becomes UNKNOWN and then RECOVERY_REQUIRED through the recovery contract.
- UNKNOWN is never treated as FAILED.
- A successful result must persist its result reference and actual output count when available.

Generation success does not mean QA acceptance.

## 11. Output-count integrity

The default is EXPECTED_OUTPUT_COUNT = 1.
Actual output count must be recorded independently.
If actual output count differs from expected, use ERROR_CODE = OUTPUT_COUNT_MISMATCH.
The extra output must not silently become another TASK_ID.
A new task requires a new authorized task record.

## 12. Idempotency

Every executable task needs a stable IDEMPOTENCY_KEY.
The runtime must prevent:
- duplicate completion of the same task;
- regeneration of an already recorded IMAGE_CREATED task during restart;
- automatic regeneration of UNKNOWN;
- creation of a second task identity from an output-count anomaly.

Idempotency is a runtime responsibility, not a prompt instruction.

## 13. Recovery fields

RECOVERY_STATUS may include NONE, RECOVERY_REQUIRED, RECOVERED, and BLOCKED.
Recovery must preserve the original event/result.
The recovery process must not rewrite UNKNOWN into a false SUCCESS or FAILED result.

## 14. Batch and Goal relationship

GOAL_ID and BATCH_ID are optional because not every module needs the same hierarchy.
When present: GOAL → BATCH → TASK.
A child record cannot activate its parent module.
A Task cannot create authority for a Goal or Batch merely by existing.
Module-specific batch structures remain inside the module.

## 15. Queue relationship

A Queue is an execution mechanism over persistent task records. It is not the source of task identity.
Canonical relationship: TASK RECORD → QUEUE ELIGIBILITY → CLAIM → GENERATION.
A queue must reference existing valid TASK_ID values.
A queue must not invent task identity from filenames, image counts, conversation memory, or generated outputs.

## 16. Immutable history

The following facts must be preserved once recorded:
- TASK_ID
- original MODULE_ID
- creation timestamp
- claim identity for completed attempts
- attempt identity
- generation result
- output count
- recovery events
- error events

Current STATUS and other mutable coordination fields may change according to the state-machine contract.
History must not be rewritten merely to make a failed or uncertain execution appear valid.

## 17. Required future persistence components

This schema becomes operational only when implemented with:
1. persistent Task Store;
2. atomic claim/lease mechanism;
3. CAS/version enforcement;
4. append-only execution event persistence;
5. state-transition validator;
6. UNKNOWN recovery handler;
7. retry/circuit-breaker evaluator;
8. runtime smoke tests.

Until these exist, this document is DOCUMENTED, not EXECUTABLE.

## 18. Isolation rule

The generic schema must never become a cross-module execution shortcut.
Workers must resolve MODULE_ID through authoritative runtime state before loading module payloads.
A task from one module must never import another module's identity authority, Goal/Batch/Queue/Task state, QA decision authority, or production workflow.

## 19. Current readiness

This schema advances Round 6 from a manual/design contract toward a persistent runtime data contract.
It does not raise the repository to Automation Ready.
Current Round 6 readiness remains Level 1 — Manual Operation Ready.