# UNIVERSAL_WALLPAPER_AUTOMATED_BATCH_EXECUTION_SPEC.md

## Purpose

This is the canonical execution extension for multi-image Universal Wallpaper automated production.

It defines the behavior agreed for Goal 2:

USER REQUEST → DESIGN ALL IMAGES → LOCK PROMPT SET → RETURN ALL PROMPTS → GENERATE → CHECKPOINT → NEXT IMAGE

This document applies only to automated multi-image Wallpaper production. It does not activate paused modules, define visual QA, or replace CORE safety rules.

## 1. Design-first batch rule

For an automated batch with IMAGE_COUNT > 1:

1. Resolve the user Session Contract.
2. Read all applicable CORE, Wallpaper, Character, Festival, and Reference Policy rules.
3. Design the complete image series before the first generation event.
4. Validate series diversity before locking.
5. Build and validate every task's FINAL_EXECUTABLE_PROMPT.
6. Lock the complete Prompt Set.
7. Return the complete Prompt Set to the user.
8. Only then begin image generation.

The production Worker must not design IMAGE 02 only after IMAGE 01 has already generated when the batch design phase can be completed before execution.

This design-first rule exists specifically to prevent cross-image repetition of clothing, hairstyle, accessories, shoes, scene, pose, and other presentation variables.

## 2. Prompt Set Lock

After the complete batch design is validated:

PROMPT_SET_STATUS: LOCKED

Each task must have:
- IMAGE_ID
- TASK_ID
- DESIGN_LOCK
- FINAL_EXECUTABLE_PROMPT
- NEGATIVE_STABILITY_PROMPT
- PROMPT_LOCK_STATUS: LOCKED

After Prompt Set Lock:
- generation executes the exact locked prompt;
- the Worker must not silently redesign a task;
- a failed generation does not authorize a new creative design;
- changing a prompt requires an explicit design revision, revalidation, and a new Prompt Set Lock before that task can generate again.

A retry is another generation attempt of the same designed task.

## 3. Series diversity hard requirement

For IMAGE_COUNT > 1, the design pass must deliberately vary at minimum:

- OUTFIT / CLOTHING
- HAIRSTYLE
- ACCESSORIES
- SHOES
- SCENE / ENVIRONMENT
- POSE

Where applicable, also vary:
- VIEWPOINT
- SHOT_SIZE
- CHARACTER_POSITION
- MAIN_ACTION
- HAND_ACTION
- LEG_POSITION
- CAMERA / LENS
- LIGHTING
- VISUAL_FOCUS

Identity anchors remain consistent. Presentation variables must not become accidental duplicates.

The six minimum variables above are mandatory series-design checks, not merely creative suggestions.

## 4. Generation success boundary

Generation success means that the generation event produced a valid candidate satisfying required execution-level output contracts.

Generation SUCCESS does NOT mean:
- visual QA PASS;
- aesthetic approval;
- prompt semantic adherence;
- LoRA suitability.

Visual QA remains a separate downstream function.

## 5. Per-image bounded generation

Each IMAGE_ID is one target image task.

Defaults:

TARGET_SUCCESS_COUNT: 1
EXPECTED_OUTPUT_COUNT: 1
MAX_ATTEMPTS_PER_TASK: 3

Attempt counting includes the first generation event.

Example:

Attempt 1 FAILED
Attempt 2 FAILED
Attempt 3 FAILED
→ IMAGE FAILED
→ no Attempt 4

The locked design and IMAGE_ID are retained throughout all attempts.

## 6. Failure behavior

For explicit FAILED results:

- increment GENERATION_ATTEMPT_COUNT;
- preserve the locked design and Prompt;
- checkpoint the result;
- retry the same IMAGE_ID while attempts remain and retry is technically authorized.

When the third attempt fails:

- TASK_STATUS: FAILED
- RECOVERY_STATUS: TERMINAL_FAILED
- GENERATION_ATTEMPT_COUNT: 3
- do not generate the task again;
- move to the next pending IMAGE_ID when the batch remains executable.

A failed image is not counted as SUCCESS and is not silently replaced by a newly designed image.

FAILED is a task result.
SKIP is the execution behavior after the task becomes terminally failed.

## 7. UNKNOWN behavior

UNKNOWN is different from FAILED.

If the Worker cannot reliably determine whether generation occurred or whether a candidate exists:

- TASK_STATUS: UNKNOWN / RECOVERY_REQUIRED
- SESSION_STATUS: RECOVERY_REQUIRED
- STOP_REASON: UNKNOWN_RECOVERY_REQUIRED
- checkpoint immediately
- do not silently regenerate

UNKNOWN must never be treated as a normal retryable failure.

## 8. Production interruption / pause

A production batch may become temporarily non-executable for reasons other than image-generation failure. These are **PAUSE conditions**, not per-image FAILED results, and therefore do not consume `MAX_ATTEMPTS_PER_TASK` unless a generation event was actually invoked.

Canonical pause reasons include:
- `QUOTA_PAUSED` — quota/rate limit/usage limit prevents generation;
- `GENERATION_SERVER_PAUSED` — the image-generation server/runtime is unavailable or unhealthy;
- `PROMPT_SYSTEM_PAUSED` — the prompt submission/validation/execution system rejects or cannot accept the locked prompt set/task for a system-level reason;
- `PLATFORM_PAUSED` — another verified platform-level condition prevents production.

A pause condition must have sufficient evidence to identify the reason. If the Worker cannot reliably determine the cause, use `UNKNOWN / RECOVERY_REQUIRED` instead of inventing a pause reason.

When a verified pause occurs:

SESSION_STATUS: PAUSED
PAUSE_REASON: one of the canonical pause reasons above
TERMINATION_STATUS: NON_TERMINAL

Preserve:
- current IMAGE_ID;
- completed count;
- failed count;
- pending tasks;
- attempt counters;
- locked prompts;
- Prompt Set Lock;
- full event history;
- stop evidence.

Do not mark the batch COMPLETED.

Do not restart from IMAGE 01.

## 9. /CONTINUE

/CONTINUE is a resumable continuation command for a non-terminal paused batch.

Before continuing:
1. Read the authoritative Batch Record.
2. Verify TERMINATION_STATUS != TERMINAL.
3. Verify the module is still ACTIVE.
4. Resolve the first authoritative incomplete task.

Resolution order:

SUCCESS → next pending task
FAILED + attempts remaining → retry same task only when RETRY_READY
FAILED + TERMINAL_FAILED → skip and continue to next pending task
PENDING / NOT_STARTED / DESIGN_LOCKED → execute the existing locked design
UNKNOWN / RECOVERY_REQUIRED → stop
TERMINATED → reject continuation

/CONTINUE must never reconstruct prompts or task state from conversation memory.

## 10. Batch completion

The batch is COMPLETED only when every planned IMAGE_ID has reached a terminal coverage result:

- SUCCESS, or
- FAILED after the maximum allowed attempts.

Therefore:

COMPLETED_COUNT = successful images
FAILED_COUNT = terminally failed images
PENDING_COUNT = images not yet terminal
TARGET_COUNT = COMPLETED_COUNT + FAILED_COUNT + PENDING_COUNT

When PENDING_COUNT = 0:

SESSION_STATUS: COMPLETED

A terminally FAILED image is not counted as a successful image, but it is considered resolved for batch execution coverage.

## 11. /STOP

/STOP is a permanent termination command for the current production Batch.

On explicit /STOP:

- stop new generation immediately;
- checkpoint the authoritative state;
- preserve all prompts, designs, results, attempts, and event history;
- SESSION_STATUS: STOPPED
- STOP_REASON: USER_STOP
- TERMINATION_STATUS: TERMINAL
- remove execution eligibility from unfinished tasks;
- do not permit /CONTINUE or /RESUME to reactivate the Batch.

Successful images remain SUCCESS.
Unfinished tasks may be recorded as ABANDONED.
History is never deleted.

A future production request must create a new Batch and new Task identities. /STOP does not prohibit unrelated future work.

## 12. No visual QA in this phase

This execution extension does not perform final visual QA.

It may verify execution-level facts such as:
- generation event occurred;
- output exists;
- output count;
- actual dimensions when observable;
- prompt execution telemetry when observable.

It must not declare:
PASS / REPAIR / REJECT

based on visual quality.

## 13. State integrity

The Batch Record remains the authoritative persistent state.

Conversation memory is not authoritative for:
- prompt contents;
- task status;
- attempt count;
- completion count;
- failed count;
- current task;
- termination status.

Every generation attempt must checkpoint before moving to another task.

## 14. Canonical execution model

For automated multi-image Wallpaper:

DESIGN PHASE
→ resolve all tasks
→ design all images
→ validate diversity
→ build all prompts
→ PROMPT_SET_LOCK
→ return all prompts

PRODUCTION PHASE
→ IMAGE 01
→ attempt ≤ 3
→ SUCCESS or terminal FAILED
→ checkpoint
→ IMAGE 02
→ ...
→ final batch summary

Production interruption:
→ PAUSED
→ record PAUSE_REASON and evidence
→ preserve checkpoint
→ /CONTINUE after the blocking condition is resolved

Permanent cancellation:
→ /STOP
→ TERMINATED
→ never resume old Batch

## 15. Authority and conflict rule

This document is a module-specific automated execution extension.

It may add stricter Wallpaper rules to shared protocols.

For automated multi-image Wallpaper production, where older Universal Wallpaper text describes:
- designing only one task before execution;
- stopping the whole session after three failures on one task;
- treating every FAILED task as requiring manual recovery before the next task;

this document supersedes those behaviors with:
- design the complete batch before generation;
- after three FAILED attempts, terminalize that IMAGE_ID and continue to the next pending image;
- pause the whole session for a verified temporary production interruption (quota, generation server, prompt system, or platform);
- stop the whole session for UNKNOWN, explicit /STOP, execution-critical conflict, or another higher-authority stop condition.

CORE hard constraints, Runtime State, Module activation, Reference Policy, and safety rules remain higher authority.


## 16. Pause vs FAILED boundary

A production pause is not an image-generation failure.

If the system blocks before a generation event is invoked, for example because the generation server is unavailable or the prompt system does not accept the locked prompt, then:
- do not increment GENERATION_ATTEMPT_COUNT;
- do not increment CONSECUTIVE_FAILURE_COUNT;
- do not mark the IMAGE_ID FAILED;
- checkpoint the batch as PAUSED;
- preserve the locked Prompt Set and current task;
- /CONTINUE resumes the same authoritative task after the blocking condition is resolved.

If a generation event was actually invoked and returns an explicit failed generation result, it is a normal FAILED attempt and counts toward the three-attempt ceiling.
