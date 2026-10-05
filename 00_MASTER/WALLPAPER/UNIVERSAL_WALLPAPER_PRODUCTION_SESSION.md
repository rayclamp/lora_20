# UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md

## Purpose

This is the lightweight production-session contract for Universal Wallpaper when ChatGPT itself is the Production Worker.

It does **not** implement a separate runtime engine, scheduler, distributed Claim/Lease/CAS service, ComfyUI adapter, or GitHub Actions image-generation system.

GitHub remains the persistent Source of Truth. ChatGPT is the execution Worker for the current session.

## 1. Session loop

`USER COMMAND → READ GITHUB → DESIGN IMAGE N → VALIDATE DESIGN → BUILD PROMPT → SHOW PROMPT → USER GENERATION CONFIRMATION → GENERATE IMAGE N → RECORD RESULT → CHECKPOINT → IMAGE N+1`

One task represents one intended successful wallpaper output. A task may require more than one bounded generation attempt when an attempt explicitly fails validation.

## 2. Session Contract and state

The Session Contract is the user-defined production contract created by START. It is not optional metadata and must be persisted in the canonical batch record before execution.

The canonical persistent record is `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`. Track the Session Contract and runtime state there.

Required Session Contract fields:
- MODULE
- PRODUCTION_TYPE
- CHARACTER
- TARGET_COUNT / IMAGE_COUNT
- OUTPUT_TYPE
- resolved ASPECT_RATIO
- resolved ORIENTATION
- THEME / FESTIVAL_SCOPE
- SCENE
- SEASON
- WEATHER
- TIME
- PET_ALLOWED
- REFERENCE_IMAGE authority/status

`OUTPUT_TYPE` is the user-facing choice. `ASPECT_RATIO` and `ORIENTATION` are derived technical locks, not duplicate user inputs.

When CHARACTER is INARIA, the batch must explicitly record that the Inaria Character Specification is semantic/context authority and that a supplied reference image is the sole visual person reference.

- SESSION_ID
- BATCH_ID
- TARGET_COUNT
- COMPLETED_COUNT
- CURRENT_TASK_ID
- SESSION_STATUS
- GENERATION_AUTHORIZATION_STATUS
- STOP_REASON
- STOP_EVIDENCE
- STOP_EVIDENCE_SOURCE
- STOP_EVIDENCE_STATUS
- LAST_RESULT
- CHECKPOINT

Session statuses:
`NOT_STARTED`, `ACTIVE`, `PAUSED`, `STOPPED`, `COMPLETED`, `RECOVERY_REQUIRED`

Manual generation authorization states:
`NOT_REQUIRED`, `WAITING_USER_CONFIRMATION`, `USER_CONFIRMED_GENERATION`, `USER_REQUESTED_REVISION`, `USER_DECLINED_GENERATION`.

`WAITING_USER_CONFIRMATION` is not a generation failure, quota stop, UNKNOWN result, or batch completion. The session may remain ACTIVE while waiting for the user's decision.

Stop reasons:
`USER_STOP`, `CHATGPT_FORCED_STOP`, `QUOTA_LIMIT_REACHED`, `GENERATION_UNAVAILABLE`, `SYSTEM_ERROR`, `UNKNOWN_RECOVERY_REQUIRED`, `COMPLETED`

GitHub must not invent or predict a remaining platform quota.

A quota/rate-limit/generation-unavailable stop is valid only when explicit platform evidence exists. Worker inference or expectation is not evidence. If evidence is absent and availability is uncertain, record UNKNOWN / RECOVERY_REQUIRED rather than claiming a quota stop.

## 3. Prompt Preview and Manual Confirmation Gate

The Worker designs the image and constructs the complete executable Prompt from the user requirement plus the applicable CORE and Wallpaper rules. The user is not required to provide the Prompt.

Before generating each image in MANUAL mode, the Worker MUST show the complete executable prompt to the user and receive explicit generation confirmation.

Required order:

1. resolve current task;
2. design image;
3. perform stability check;
4. finalize executable prompt;
5. lock the final prompt;
6. **show prompt to user**;
7. **wait for explicit USER_GENERATION_CONFIRMATION**;
8. invoke generation using that locked prompt;
9. count the invocation against `GENERATION_ATTEMPT_COUNT`;
10. enforce `MAX_ATTEMPTS_PER_TASK` before any further generation;
11. record the generation execution event/status;
12. confirm result count and actual format;
13. record result;
14. evaluate retry/recovery against the hard attempt limit;
15. checkpoint;
16. continue only when safe.

The shown prompt must be the exact prompt intended for the current generation event.

Prompt preview is NOT proof of prompt execution. User confirmation is authorization to generate, not proof that generation occurred. The task record must separately track:
- `PROMPT_EXECUTION_STATUS`;
- `EXECUTED_PROMPT_REFERENCE`;
- `EXECUTION_VERIFICATION_STATUS`.

If the runtime exposes an execution/request identifier or executed-prompt payload, record it. If the platform does not expose this information, record `NOT_OBSERVABLE`; never fabricate execution evidence.

If the prompt changes after preview, the previous preview/execution lock is invalid. Update `FINAL_EXECUTABLE_PROMPT`, show the complete replacement prompt again, and create a new execution event.

A prompt execution mismatch or unresolvable execution identity is an execution-integrity issue, not a successful generation.

## 4. Per-image result

Minimum logical result states:

- `NOT_STARTED`
- `SUCCESS`
- `FAILED`
- `UNKNOWN`

`SUCCESS`: preserve the candidate and mark generation complete.

`FAILED`: do not count the task as complete; increment the attempt counter; perform failure analysis; retry only when explicitly permitted and only while `GENERATION_ATTEMPT_COUNT < MAX_ATTEMPTS_PER_TASK`.

`UNKNOWN`: record `UNKNOWN / RECOVERY_REQUIRED` and stop. Never silently regenerate an UNKNOWN result.

## 5. Checkpoint ownership

The canonical persistent record is defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md` and stored at `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`.

Checkpoint information is authoritative only when written to that authorized batch record. The Session Contract does not authorize changing `RUNTIME_STATE` directly or creating another persistence layer.

If the batch record does not yet exist, it must be created before a multi-image session claims persistent resumability. Until then, conversation memory is not a persistent recovery source.

## 6. Continuation and turn boundary

After confirmed SUCCESS:

`CHECKPOINT → RESOLVE NEXT VALID TASK`

If the execution environment permits another generation event in the same worker execution, continue with the next task.

If the image-generation operation ends the current assistant execution before another generation can be invoked, the Worker MUST NOT silently terminate an ACTIVE incomplete session. Instead it must persist an explicit resumable state.

The persisted record must include:
- `CURRENT_TASK_ID` for the next unresolved task;
- `COMPLETED_COUNT`;
- `LAST_RESULT`;
- `CHECKPOINT`;
- the full Session Contract;
- the reason/evidence for the execution boundary.

A subsequent RESUME must restore the batch record and continue from the next authoritative task. It must never treat an assistant-turn boundary as quota exhaustion or generation failure.

There must be no silent endpoint:

`ACTIVE + COMPLETED_COUNT < TARGET_COUNT` must resolve to either another executable task event or an explicitly persisted resumable/stop/recovery state with a reason.

The session continues across explicit RESUME operations until the target is completed, the user stops it, a verified platform stop occurs, generation becomes unavailable, UNKNOWN/recovery occurs, or an execution-critical conflict occurs.

## 7. Resume

On RESUME, ChatGPT must reread current GitHub state.

Resolve:

1. active session/batch;
2. current task;
3. last result;
4. task-integrity and format locks;
5. next safe action.

Decision:
- SUCCESS → next valid task;
- FAILED → current retry/recovery rule;
- UNKNOWN → stop for recovery;
- NOT_STARTED → continue the authoritative current task.

Do not redesign an existing task from conversation memory.

\n## 7A. Failure / recovery\n\nFailure and recovery are governed by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`.\n\n- `FAILED + RETRY_READY` → retry the same task identity and checkpoint the attempt.\n- Three consecutive FAILED attempts → `RECOVERY_REQUIRED` + `STOPPED`; no fourth automatic attempt.\n- `UNKNOWN / RECOVERY_REQUIRED` → STOP; resolve the unknown event before any retry.\n- `ABANDONED` → terminal for that identity; replacement requires a new task identity.\n- `SUCCESS` → terminal; never regenerate the completed task.\n
## 7B. Execution gates

The following are hard gates, not advisory instructions:

1. Prompt Preview must actually occur before generation.
2. The design must pass module/batch diversity validation before DESIGN_LOCK.
3. The declared output format must be a HARD DESIGN LOCK before composition and generation.
4. Actual output format must be validated when technically determinable.
5. A failed format attempt does not satisfy the task and does not consume the successful-output slot.
6. `MAX_ATTEMPTS_PER_TASK` is an absolute hard ceiling; no fourth attempt is permitted when the limit is 3.
7. After SUCCESS, the next authoritative task must be resolved when the batch remains incomplete.

A worker must never treat the existence of a field such as `PROMPT_PREVIEW_STATUS: SHOWN` as a substitute for performing the corresponding action.

## 7C. Silent termination prohibition

A Worker must never finish an execution with no recorded state transition after a generated candidate.

After every generation attempt, one of the following must be observable in the authoritative record:
- `SUCCESS` + checkpoint + next-task resolution;
- `FAILED` + recovery/checkpoint;
- `UNKNOWN / RECOVERY_REQUIRED` + stop/checkpoint;
- explicit execution/turn boundary state + resumable checkpoint.

Silence is not a valid state.

## 8. Count integrity

`TARGET_COUNT` is a batch target, not a quota prediction.

Only confirmed SUCCESS counts as generation-complete.

Extra outputs do not create extra tasks.

**ONE TASK = ONE IMAGE DESIGN = ONE TARGET SUCCESSFUL OUTPUT; EACH GENERATION ATTEMPT IS A SEPARATE BOUNDED GENERATION EVENT**

## 9. Architecture boundary

This session contract intentionally does not require:

- distributed Worker scheduling;
- server-side Claim/Lease/CAS;
- external queue services;
- automatic retry engines;
- ComfyUI runtime adapters;
- GitHub Actions image generation;
- automatic quota discovery.

These are separate future requirements and must not be reintroduced merely to support ChatGPT-as-Worker production.

## 10. Worker boundary

ChatGPT may read rules, design, show the prompt, generate, record the result, checkpoint, and continue.

ChatGPT must not activate PAUSED modules, bypass runtime state, invent missing task state, silently redesign DESIGN-LOCKED tasks, self-QA, or silently regenerate UNKNOWN results.

## 11. Core principle

**GitHub defines HOW. ChatGPT executes ONE IMAGE at a time. The checkpoint defines WHERE TO RESUME.**

## 7D. Explicit STOP / Terminal Session Rule

/STOP is a permanent user termination command, not a resumable pause.

The existing SESSION_STATUS: STOPPED state is retained for both recoverable and terminal stops. Terminality is distinguished by TERMINATION_STATUS.

Allowed values:
- TERMINATION_STATUS: NONE
- TERMINATION_STATUS: NON_TERMINAL
- TERMINATION_STATUS: TERMINAL

For explicit user /STOP:
- SESSION_STATUS: STOPPED
- STOP_REASON: USER_STOP
- TERMINATION_STATUS: TERMINAL
- the Batch must no longer be treated as executable runtime work
- the authoritative Batch Record remains preserved as historical/audit data.

A terminal user stop MUST NOT be converted back to ACTIVE, PAUSED, or RECOVERY_REQUIRED by /RESUME.

If the user wants the same production again after a terminal stop, /START MUST create a new Batch and new Task identities. The old Batch is never resurrected.

Task handling during terminal batch stop:
- confirmed SUCCESS tasks remain SUCCESS;
- unfinished tasks lose execution eligibility under the terminated Batch;
- an unfinished current task may be recorded as ABANDONED when the stop operation explicitly terminalizes that task;
- no task already in terminal SUCCESS may be rewritten as ABANDONED;
- no abandoned identity may be reused.

STOPPED + TERMINATION_STATUS: NON_TERMINAL = potentially resumable.
STOPPED + TERMINATION_STATUS: TERMINAL = permanently terminated, never resumable.


## 7E. Automated Universal Wallpaper Control Gates

For `PRODUCTION_TYPE: AUTOMATED`, Universal Wallpaper execution MUST enable the shared runtime visual-adherence gate.

The authoritative automated task contract MUST persist:
- `VISUAL_ADHERENCE_REQUIRED: true`;
- `FINAL_EXECUTABLE_PROMPT`;
- `FINAL_EXECUTION_CONTEXT`;
- `PROMPT_LOCK_STATUS: LOCKED`;
- `EXECUTION_CONTEXT_LOCK_STATUS: LOCKED`;
- `PROMPT_HASH`;
- `EXECUTION_CONTEXT_HASH`;
- `VISUAL_DESIGN_ADHERENCE_RESULT` when evaluation occurs.

Automated generation is forbidden unless all of the following gates have passed:

1. Design Validation / DESIGN_LOCK;
2. Final Prompt Lock;
3. Final Execution Context Lock;
4. Automation Prompt Preview/Audit;
5. Exact locked Prompt + Context execution authorization;
6. Technical output validation;
7. `VISUAL_DESIGN_ADHERENCE_PASS`.

Therefore:

`AUTOMATED UNIVERSAL WALLPAPER TASK_SUCCESS = DESIGN_VALIDATION_PASS + PROMPT_LOCK + EXECUTION_CONTEXT_LOCK + EXECUTION_AUTHORIZATION + TECHNICAL_OUTPUT_VALIDATION_PASS + VISUAL_DESIGN_ADHERENCE_PASS`.

`VISUAL_DESIGN_NONCOMPLIANCE` is a bounded FAILED recovery state. `VISUAL_DESIGN_UNKNOWN` is `UNKNOWN / RECOVERY_REQUIRED` and MUST stop.

The user does not need to manually confirm each automated image. The persisted preview/audit event satisfies visibility; it does not weaken any execution-integrity or visual-adherence gate.

`VISUAL_ADHERENCE_REQUIRED` MUST NOT be set to false for an Automated Universal Wallpaper task as a shortcut around the evaluator. If the evaluator is unavailable, generation cannot reach normal TASK_SUCCESS.


## 7F. Automatic authoritative batch continuation

For an `AUTOMATED` Universal Wallpaper batch, a terminal `SUCCESS` MUST trigger authoritative next-task resolution without requiring a new user command.

The continuation operation is bounded to:
1. confirm the current task has terminal `SUCCESS`;
2. checkpoint the completed task;
3. resolve the next incomplete task from the authoritative Batch Record;
4. dispatch that task through the existing Production Dispatch / Worker Runtime path;
5. if no incomplete task remains, mark the batch `COMPLETED`.

The continuation resolver MUST NOT use conversation memory, an in-memory guessed sequence, or a second queue as the source of truth.

A successful task MUST NOT remain intentionally idle while the batch is still incomplete unless an explicit stop/recovery condition exists.

This is continuation control, not a new scheduler or queue service.
