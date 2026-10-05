# UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md

## Purpose

This is the canonical storage format for Universal Wallpaper ChatGPT-as-Worker production.

It provides the smallest persistent record needed to resume a multi-image wallpaper session without introducing a separate runtime database.

## 1. Canonical storage location

Active and resumable Universal Wallpaper batch records belong under:

`MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`

One batch uses **one record file**.

The batch record contains both:
- session state;
- ordered per-image task records.

Do not create a separate database, queue service, runtime engine, or per-worker state store for this purpose.

## 2. Record authority

The batch record is the authoritative persistent record for that Universal Wallpaper batch.

It may record:
- session identity and progress;
- task identity and design;
- prompt preview;
- generation result;
- checkpoint.

It does not override:
- `RUNTIME_STATE.md`;
- `MODULE_REGISTRY.md`;
- CORE rules;
- wallpaper rules;
- higher-level authority.

A batch record cannot activate a paused module.

## 3. Batch record minimum structure

Each batch record must contain:

```text
# Universal Wallpaper Batch: <BATCH_ID>

## SESSION
SESSION_ID:
BATCH_ID:
TARGET_COUNT:
COMPLETED_COUNT:
CURRENT_TASK_ID:
SESSION_STATUS:
PAUSE_REASON:
PAUSE_EVIDENCE:
PAUSE_EVIDENCE_SOURCE:
PAUSE_EVIDENCE_STATUS:
TERMINATION_STATUS:
STOP_REASON:
STOP_EVIDENCE:
STOP_EVIDENCE_SOURCE:
STOP_EVIDENCE_STATUS:
LAST_RESULT:
CHECKPOINT:
PROMPT_SET_STATUS:
FAILED_COUNT:
PENDING_COUNT:

## BATCH INPUT
WALLPAPER_TYPE:
OUTPUT_TYPE:
ASPECT_RATIO:
ORIENTATION:
THEME:
SCENE:
WEATHER:
TIME:
PET_ALLOWED:
REFERENCE:

REFERENCE_OUTFIT_POLICY:
REFERENCE_POSE_POLICY:
CHARACTER_REFERENCE_OUTFIT_POLICY:
WALLPAPER_OUTFIT_MODE:

## TASKS

### IMAGE 01
TASK_ID:
IMAGE_ID:
TASK_STATUS:
OWNERSHIP_STATUS:
WORKER_ID:
CLAIM_ID:
CLAIMED_AT:
LEASE_EXPIRES_AT:
STATE_VERSION:
DESIGN_STATUS:
DESIGN_LOCK:
OUTPUT_TYPE:
ASPECT_RATIO:
ORIENTATION:
VIEWPOINT:
SHOT_SIZE:
CHARACTER_POSITION:
POSE:
EXPRESSION:
MAIN_ACTION:
HAND_ACTION:
LEG_POSITION:
HAIRSTYLE:
CLOTHING:
ACCESSORIES:
SHOES:
MAKEUP:
SCENE:
WEATHER:
TIME:
LIGHTING:
CAMERA_LENS:
STABILITY_CONSTRAINTS:
REFERENCE_OUTFIT_POLICY:
REFERENCE_POSE_POLICY:
CHARACTER_REFERENCE_OUTFIT_POLICY:
WALLPAPER_OUTFIT_MODE:
DIVERSITY_ROLE:
DIVERSITY_VALIDATION_STATUS:
FINAL_EXECUTABLE_PROMPT:
NEGATIVE_STABILITY_PROMPT:
PROMPT_PREVIEW_STATUS:
PROMPT_PRESENTATION_STATUS:
PROMPT_PRESENTATION_CHECKPOINT:
PROMPT_PRESENTATION_VERIFICATION:
GENERATION_GATE_STATUS:
CAN_GENERATE:
GENERATION_AUTHORIZATION_STATUS:
PROMPT_EXECUTION_STATUS:
EXECUTED_PROMPT_REFERENCE:
EXECUTION_VERIFICATION_STATUS:
GENERATION_RESULT:
RESULT_COUNT:
RESULT_REFERENCE:
TARGET_SUCCESS_COUNT:
MAX_ATTEMPTS_PER_TASK:
GENERATION_ATTEMPT_COUNT:
CONSECUTIVE_FAILURE_COUNT:
RECOVERY_STATUS:
LAST_FAILURE_REASON:
EVENT_HISTORY:
CHECKPOINT_STATUS:
STOP_REASON:

### IMAGE 02
...
```

Fields may be omitted only when the field is genuinely not applicable to the selected wallpaper mode. Required integrity fields must not be omitted.

## 4. Task lifecycle

A task uses these logical states:

`NOT_STARTED → DESIGN_READY → DESIGN_LOCKED → GENERATING → SUCCESS`

Failure/recovery states:

`FAILED`, `UNKNOWN / RECOVERY_REQUIRED`, `OUTPUT_COUNT_MISMATCH`, `INVALID_IMAGE_ID`, `ABANDONED`

A Worker must not skip the design/prompt-preview gate.

## 5. Design lock

`DESIGN_LOCK: YES` means the task design is frozen for generation.

After the lock:
- the Worker may not silently change the design;
- a legitimate redesign requires an explicit task update before generation;
- generation must use the locked executable prompt.

## 6. Prompt preview record

Before generation:

`PROMPT_PREVIEW_STATUS: SHOWN`

For AUTOMATED mode, the Prompt Preview is also a mandatory external presentation gate:
- `PROMPT_PRESENTATION_STATUS: NOT_SHOWN | SHOWN | FAILED`
- `PROMPT_PRESENTATION_CHECKPOINT:` records when the complete locked prompt set was presented
- `PROMPT_PRESENTATION_VERIFICATION: VERIFIED | NOT_VERIFIABLE | FAILED`
- `GENERATION_GATE_STATUS: BLOCKED | READY`
- `CAN_GENERATE: YES | NO`

The stored `FINAL_EXECUTABLE_PROMPT` must be the same system-generated prompt shown to the user and used for generation.

`PROMPT_PRESENTATION_STATUS: SHOWN` is valid only after the complete `FINAL_EXECUTABLE_PROMPT` for every planned IMAGE_ID has actually been presented to the user. A hidden/internal prompt, summary, excerpt, hash, or self-reported state does not satisfy the gate.

For AUTOMATED mode, user confirmation is not required. However, generation is forbidden until: `PROMPT_SET_STATUS=LOCKED` + `PROMPT_PRESENTATION_STATUS=SHOWN` + `GENERATION_GATE_STATUS=READY` + `CAN_GENERATE=YES`.

If any prerequisite is missing, `CAN_GENERATE` MUST remain `NO` and no generation event may be invoked.

If any prompt changes after presentation, invalidate the presentation gate and present the complete changed prompt set again before generation.

The user is not required to provide the Prompt. The Prompt is system-owned and must be constructed by the Image Production System from the user requirement and applicable production rules. In MANUAL mode, generation is forbidden until explicit USER_CONFIRMED_GENERATION is recorded.

If the prompt changes after preview, update the record and show the new complete prompt again before generation.

## 6A. Batch design phase and Prompt Set Lock

For automated multi-image Wallpaper production, the batch must complete the design phase before the first generation event.

Required batch-level state:
- `PROMPT_SET_STATUS: DESIGNING | VALIDATED | LOCKED`
- `DESIGN_PHASE_COMPLETE: YES | NO`
- `PROMPT_SET_LOCKED_AT:` when observable

`PROMPT_SET_STATUS: LOCKED` means all planned IMAGE_ID tasks have validated designs and locked `FINAL_EXECUTABLE_PROMPT` artifacts. Generation must use those exact locked prompts.

A failed generation never authorizes silent redesign. Any legitimate prompt revision requires revalidation and a new Prompt Set Lock before generation of that task.

For `IMAGE_COUNT > 1`, the design pass must explicitly validate at minimum: CLOTHING/OUTFIT, HAIRSTYLE, ACCESSORIES, SHOES, SCENE/ENVIRONMENT, and POSE diversity.

## 6C. Mandatory Prompt Presentation Gate

For every automated Universal Wallpaper batch, Prompt Presentation is a hard generation prerequisite, not an optional preview.

Required lifecycle:

DESIGNING → VALIDATED → LOCKED → PROMPT_PRESENTATION_STATUS: SHOWN → GENERATION_GATE_STATUS: READY → CAN_GENERATE: YES → GENERATING

The Worker MUST present the complete locked FINAL_EXECUTABLE_PROMPT for every planned IMAGE_ID before the first generation event of the batch.

The Worker MUST NOT:
- generate before all planned prompts are presented;
- replace presentation with a statement such as "prompt ready" or "prompt locked";
- present only summaries/excerpts instead of the complete prompt;
- mark PROMPT_PRESENTATION_STATUS: SHOWN without actually presenting the complete prompts;
- interpret AUTOMATED mode as permission to skip prompt presentation.

Automated mode differs from Manual mode only in confirmation: after the mandatory presentation gate passes, Automated mode may proceed automatically without waiting for user confirmation.

This gate exists so the user can inspect the exact executable design before runtime execution and so cross-batch prompt similarity can be audited.

## 6B. Session count vs task output count

`TARGET_COUNT` / `IMAGE_COUNT` is the number of wallpaper tasks required by the production session.

`EXPECTED_OUTPUT_COUNT` is the number of image candidates allowed from one individual generation attempt, normally exactly `1`.

`TARGET_SUCCESS_COUNT` is the number of validated successful outputs required to complete one task, normally exactly `1`.

`MAX_ATTEMPTS_PER_TASK` is the absolute maximum number of generation attempts permitted for that task. It must not reset after an intermediate failure or partial recovery.

Therefore:
- `TARGET_COUNT: 12` means twelve separate wallpaper tasks are required for the session;
- `EXPECTED_OUTPUT_COUNT: 1` means each generation attempt may return only one candidate;
- `TARGET_SUCCESS_COUNT: 1` means the task needs one validated successful output;
- `MAX_ATTEMPTS_PER_TASK: 3` means the task may never invoke a fourth generation attempt;
- `OUTPUT COUNT LOCK` must never be interpreted as a one-image limit for the entire session.

A prompt line such as `one image candidate only` is a per-task output lock. It must not reduce the persisted session target.

## 7. Result record

After each generation attempt, record:

- `GENERATION_RESULT`: `SUCCESS`, `FAILED`, or `UNKNOWN`;
- `RESULT_COUNT`;
- `RESULT_REFERENCE` when available;
- `GENERATION_ATTEMPT_COUNT`;
- `CONSECUTIVE_FAILURE_COUNT`;
- `RECOVERY_STATUS`;
- `LAST_FAILURE_REASON`;
- `EVENT_HISTORY`;
- `CHECKPOINT_STATUS`.

Only a validated `SUCCESS` counts toward `COMPLETED_COUNT`.

A generation attempt that returns an image with an invalid format, invalid output count, or other execution-level contract violation is not a successful output. It increments `GENERATION_ATTEMPT_COUNT` and does not consume `TARGET_SUCCESS_COUNT`.

`UNKNOWN` requires recovery and stops the session.

Extra outputs never create extra IMAGE_IDs.

## 7A. Task attempt and output-success boundary

The task has three independent counters/limits:

- `GENERATION_ATTEMPT_COUNT` — how many generation events have been invoked;
- `TARGET_SUCCESS_COUNT` — how many validated successful outputs are required;
- `MAX_ATTEMPTS_PER_TASK` — the hard ceiling on generation events.

The correct invariant is:

`GENERATION_ATTEMPT_COUNT <= MAX_ATTEMPTS_PER_TASK`

A failed candidate never increases `COMPLETED_COUNT`. A retry is permitted only after explicit failure analysis/recovery authorization. Retry is controlled recovery, not blind regeneration. When `GENERATION_ATTEMPT_COUNT == MAX_ATTEMPTS_PER_TASK`, no further generation event is permitted; set `RECOVERY_REQUIRED` and stop the task/session according to the failure protocol.

A successful output ends the task immediately because `TARGET_SUCCESS_COUNT: 1` has been satisfied. Do not generate a second successful candidate under the same task identity.

## 7B. Prompt execution integrity

`FINAL_EXECUTABLE_PROMPT` is the canonical prompt artifact for the task. `PROMPT_PREVIEW_STATUS: SHOWN` proves only that the prompt was shown; it does not prove that the generation operation received or executed that exact prompt.

Before generation, establish a prompt execution event:
- `PROMPT_EXECUTION_STATUS: READY` — the exact final prompt is locked and is the payload intended for the generation event.
- `PROMPT_EXECUTION_STATUS: SENT` — the generation operation was invoked using the locked prompt.
- `PROMPT_EXECUTION_STATUS: UNKNOWN` — the Worker cannot reliably establish whether the locked prompt was the prompt executed.

`EXECUTED_PROMPT_REFERENCE` identifies the execution event when the runtime provides an event/request identifier. If the platform does not expose one, record `NOT_OBSERVABLE` rather than inventing one.

`EXECUTION_VERIFICATION_STATUS` values:
- `VERIFIED` — the runtime exposes enough information to verify prompt correspondence;
- `NOT_OBSERVABLE` — the platform does not expose the executed prompt payload;
- `MISMATCH` — an observable executed prompt differs from the locked prompt;
- `UNKNOWN` — execution identity or correspondence cannot be reliably determined.

Rules:
1. A changed prompt after preview requires a new preview and resets execution status.
2. `MISMATCH` is an execution-integrity failure and must not be recorded as normal SUCCESS.
3. `UNKNOWN` must not be silently converted to VERIFIED.
4. Prompt preview alone never proves prompt execution.

## 8. Checkpoint rule

A checkpoint is valid only after the corresponding task result has been recorded.

For SUCCESS:

`TASK SUCCESS → COMPLETED_COUNT update → CURRENT_TASK_ID advance → CHECKPOINT`

For FAILED:

`TASK FAILED → update attempt/failure counters → apply recovery rule → CHECKPOINT`

For UNKNOWN:

`TASK UNKNOWN → RECOVERY_REQUIRED → STOP → CHECKPOINT`

Never advance to the next task before the current task has a recorded terminal result.

## 9. Resume rule

On RESUME, reread the batch record.

Use the first authoritative task that is not safely completed.

- SUCCESS → advance to the next valid task;
- NOT_STARTED / DESIGN_READY / DESIGN_LOCKED → continue the authoritative task;
- FAILED + RETRY_READY → retry the same task identity;
- FAILED + RECOVERY_REQUIRED → stop until explicitly recovered;
- UNKNOWN → stop for recovery;
- ABANDONED → do not reuse the identity; create a legitimate replacement if coverage is still required;
- OUTPUT_COUNT_MISMATCH → stop/review;
- invalid or contradictory record → stop.

Do not reconstruct task state from conversation memory when the batch record exists.

## 10. Failure/recovery contract

For automated multi-image Wallpaper, the canonical behavior is defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_AUTOMATED_BATCH_EXECUTION_SPEC.md`. A terminally failed image after the maximum attempts is skipped for execution purposes and the Worker proceeds to the next pending task. It is not counted as successful output.

Failure and recovery behavior is defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`.

A retry is another generation attempt of the same task and does not create a new `IMAGE_ID`.

Three consecutive FAILED attempts on one task terminalize that task and allow an active automated multi-image batch to continue to the next pending task. UNKNOWN always requires recovery and stops the session. ABANDONED is terminal for that task identity and may only be replaced by a new task identity.

## 11. Batch completion

For automated multi-image Wallpaper, the batch is complete when every planned IMAGE_ID has a terminal coverage result:
- `SUCCESS`, or
- `FAILED` after `MAX_ATTEMPTS_PER_TASK` is exhausted.

`PENDING_COUNT = 0` → `SESSION_STATUS: COMPLETED`.

`COMPLETED_COUNT` counts only successful images. `FAILED_COUNT` counts terminally failed images. Failed images do not satisfy the success target, but they are resolved and are not regenerated.

No additional image may be silently added to the batch.

## 11A. Production pause and continuation

Temporary production interruptions are batch-level pauses, not per-image FAILED results, when they prevent execution before a generation event is invoked.

Canonical `PAUSE_REASON` values:
- `QUOTA_PAUSED`
- `GENERATION_SERVER_PAUSED`
- `PROMPT_SYSTEM_PAUSED`
- `PLATFORM_PAUSED`

Examples include exhausted quota/rate limits, an unavailable or unhealthy image-generation server/runtime, and a prompt submission/validation/execution system that cannot accept the locked prompt.

For a verified pause:
- `SESSION_STATUS: PAUSED`
- `PAUSE_REASON:` one canonical value above
- `TERMINATION_STATUS: NON_TERMINAL`
- preserve all prompt/design/task/attempt/checkpoint state.

A pause before generation does not increment `GENERATION_ATTEMPT_COUNT` or `CONSECUTIVE_FAILURE_COUNT` and does not mark the IMAGE_ID FAILED.

If the cause cannot be reliably determined, use `UNKNOWN / RECOVERY_REQUIRED` rather than inventing a pause reason.

`/CONTINUE` must reread the Batch Record and continue the same authoritative incomplete task after the blocking condition is resolved. It must never reconstruct state from conversation memory. A terminal batch cannot be resumed.

## 12. Separation from platform runtime

This record is a persistent production ledger, not a runtime engine.

It does not provide:
- automatic scheduling;
- distributed locking;
- Claim/Lease/CAS;
- automatic quota discovery;
- automatic retries;
- GitHub Actions generation;
- ComfyUI execution.

Those capabilities require separate architecture and must not be inferred from this record format.

## 13. Stop-reason evidence invariant

For any stop caused by quota, rate limiting, or generation unavailability, the batch record must preserve:

- `STOP_REASON`;
- `STOP_EVIDENCE`;
- `STOP_EVIDENCE_SOURCE`;
- `STOP_EVIDENCE_STATUS`.

`STOP_EVIDENCE_STATUS` must be one of:
- `VERIFIED` — explicit platform evidence exists;
- `NOT_VERIFIED` — no explicit platform evidence was available;
- `NOT_APPLICABLE` — stop reason is unrelated to platform availability.

A Worker MUST NOT record a platform pause reason as verified without corresponding evidence. `PAUSE_EVIDENCE_STATUS` uses the same evidence discipline as `STOP_EVIDENCE_STATUS`.

If platform availability cannot be reliably determined, use `UNKNOWN / RECOVERY_REQUIRED` rather than inventing a quota or availability state.

## 14. Minimality principle

**One batch = one record. One task identity = one designed image target. One active owner per task. Each retry is an attempt on that same task identity. One checkpoint = one authoritative resume point.**

The record exists only to preserve production identity, design, result, and resume state.


## 13A. Production Session Contract

Every authoritative batch record must persist the user-defined Production Session Contract.

Required fields:
- `MODULE`
- `PRODUCTION_TYPE`
- `CHARACTER`
- `IMAGE_COUNT` / `TARGET_COUNT`
- `OUTPUT_TYPE`
- `ASPECT_RATIO` (derived technical lock)
- `ORIENTATION` (derived technical lock)
- `THEME / FESTIVAL_SCOPE`
- `SCENE`
- `SEASON`
- `WEATHER`
- `TIME`
- `PET_ALLOWED`
- `REFERENCE_IMAGE`
- `REFERENCE_IMAGE_STATUS`
- `CHARACTER_AUTHORITY_STATUS`

For an explicit Inaria task with a supplied person reference:
- `CHARACTER: INARIA`
- `REFERENCE_IMAGE_STATUS: AVAILABLE` only when the actual image is available and readable;
- the reference image is the sole visual person identity authority;
- Inaria Character Specification is contextual/semantic authority;
- canonical Inaria visual/body fields are fallback only when no task-specific person reference exists.

A batch must not enter generation if a required reference is declared but unavailable.

`OUTPUT_TYPE` is the user-facing output requirement. `ASPECT_RATIO` and `ORIENTATION` are derived and locked from it; they are not separate duplicate user choices.

## 14. Batch diversity fields

For multi-image batches, the batch record must preserve enough structured design data to validate presentation diversity.

Each task should explicitly record, when applicable:
- HAIRSTYLE
- CLOTHING
- ACCESSORIES
- SHOES
- MAKEUP
- DIVERSITY_ROLE

`DIVERSITY_VALIDATION_STATUS` must be recorded before DESIGN_LOCK.

A batch must not be considered design-ready when its planned variation is effectively limited to scene/background and pose while presentation variables remain materially identical across the series.

Identity consistency and presentation diversity are separate requirements:
- identity anchors remain stable;
- presentation variables are deliberately varied.

## 15. Continuation invariant

For an ACTIVE batch:

`SUCCESS + COMPLETED_COUNT < TARGET_COUNT` requires resolution of the next authoritative incomplete task.

The batch may not remain ACTIVE with a terminal SUCCESS followed by an intentionally idle current task unless a documented stop/recovery condition exists.

## 16. Actual format invariant

The task's declared `ASPECT_RATIO`, `OUTPUT_TYPE`, and `ORIENTATION` describe the required output, not proof of the actual result.

When actual output dimensions/metadata are available, they must be recorded or validated before terminal SUCCESS. A mismatch must not be silently accepted as format-compliant success.


## 17. Reference-decoupling task invariant

For REALISTIC WALLPAPER tasks using a person reference:
- `REFERENCE_OUTFIT_POLICY` must be `REPLACE` unless the user explicitly requests outfit preservation.
- `REFERENCE_POSE_POLICY` must be `IGNORE` unless the user explicitly requests pose preservation.

`REPLACE` means a complete new outfit must be designed. "Source outfit + jacket" or "source outfit + shoes" is not a valid replacement.

`IGNORE` means the source pose cannot be copied as the generated pose template. The Worker must independently design the generated pose/action.

These fields must be resolved before DESIGN_LOCK.


## 17. Character presentation isolation contract

When `CHARACTER_NAME` is explicitly Inaria / 依娜莉亞, the Worker must load the canonical Inaria Character Specification.

The original/reference outfit stored in that character specification is **character-reference data only**. It has no automatic inheritance into wallpaper presentation.

For wallpaper tasks, the default values are:
- `CHARACTER_REFERENCE_OUTFIT_POLICY: DO_NOT_INHERIT`
- `WALLPAPER_OUTFIT_MODE: INDEPENDENT_REDESIGN`

The Worker must independently design the complete wallpaper outfit. It must not reuse individual garments, accessories, decorative motifs, or the original outfit's overall clothing construction merely because the character is Inaria.

Only an explicit user request to preserve/reuse the original Inaria outfit may change this policy.

This is separate from `REFERENCE_OUTFIT_POLICY`, which controls the outfit in the user-supplied visual reference image.

## 18. User design intent contract

The canonical Universal Wallpaper design model follows the user's normal design sequence:

1. REFERENCE PERSON — use the user-supplied image as the sole person/identity reference for the current task.
2. PRESENTATION REDESIGN — independently design a new hairstyle, complete outfit, accessories, and shoes unless the user explicitly requests preservation.
3. SCENE — design the requested location/environment and contextual details.
4. POSE / ACTION — independently design the character's body pose and main action; do not copy the reference pose unless explicitly requested.
5. EXPRESSION — explicitly design the character's facial expression appropriate to the scene/action.
6. WALLPAPER OUTPUT — resolve whether the task is a DESKTOP_WALLPAPER or PHONE_WALLPAPER and apply the corresponding technical format lock.

The task record must represent these decisions explicitly before DESIGN_LOCK.

For person-reference wallpaper tasks, the reference image establishes who the person is. It is not automatically an outfit, hairstyle, pose, or composition template.

Default presentation policies:
- REFERENCE_OUTFIT_POLICY: REPLACE
- REFERENCE_POSE_POLICY: IGNORE
- CHARACTER_REFERENCE_OUTFIT_POLICY: DO_NOT_INHERIT
- WALLPAPER_OUTFIT_MODE: INDEPENDENT_REDESIGN

A user may explicitly override either policy by requesting preservation.

## 19. Session termination and resume eligibility

Every authoritative batch record must preserve:
- TERMINATION_STATUS

Allowed values:
- NONE
- NON_TERMINAL
- TERMINAL

Rules:
1. Normal batches use TERMINATION_STATUS: NONE unless a terminal completion event requires otherwise.
2. A recoverable interruption may use SESSION_STATUS: STOPPED or RECOVERY_REQUIRED with TERMINATION_STATUS: NON_TERMINAL.
3. Explicit user /STOP MUST use SESSION_STATUS: STOPPED, STOP_REASON: USER_STOP, and TERMINATION_STATUS: TERMINAL.
4. A batch with TERMINATION_STATUS: TERMINAL MUST NOT be resumed or reactivated.
5. Repeating a previously terminated production requires /START and a new BATCH_ID and new Task identities.
6. Confirmed SUCCESS tasks remain successful when a batch is terminated.
7. Unfinished tasks in a terminal batch may be marked ABANDONED when the stop operation explicitly terminalizes them.
8. Terminalization never deletes the batch, task, prompt, attempt, result, or checkpoint history.

Resume eligibility invariant:
RESUME_ELIGIBLE = session/recovery rules allow + TERMINATION_STATUS != TERMINAL

A terminal batch has permanently lost execution eligibility even though its record remains readable.
