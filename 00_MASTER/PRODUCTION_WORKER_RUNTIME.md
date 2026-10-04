# PRODUCTION_WORKER_RUNTIME.md — Shared Production Worker Runtime

## Purpose

This is the shared execution contract for all production modules.

It defines **HOW a production task is executed**. It does not define what a module produces, which identity/reference it uses, or what dataset/cultural/wallpaper rules apply.

Production modules supply domain-specific rules. The Worker Runtime supplies the common execution machinery.

## Applies to

- UNIVERSAL_WALLPAPER
- FESTIVAL_WALLPAPER
- LORA_PRODUCTION
- future production modules

## Shared execution pipeline

`DISPATCH → RESOLVE MODULE → LOAD MODULE RULES → SELECT TASK → CLAIM → DESIGN → VALIDATE DESIGN → PROMPT → PROMPT PREVIEW → GENERATE → VALIDATE OUTPUT → RECORD RESULT → CHECKPOINT → NEXT TASK`

The exact stages may be shortened when a module or dispatch mode does not require a stage, but no module may weaken CORE safety, ownership, or state-integrity rules.

## Shared responsibilities

The Worker Runtime owns:

- Worker lifecycle;
- task selection contract;
- Claim / Lease / CAS;
- ownership verification and stale-worker fencing;
- task-state transitions;
- generation outcome semantics;
- SUCCESS / FAILED / UNKNOWN handling;
- recovery gates;
- common prompt-execution contract;
- common generation recording;
- continuation / stop conditions.

## Module responsibilities

A production module owns:

- identity/reference policy;
- content/domain rules;
- prompt content requirements;
- dataset or cultural rules;
- module-specific diversity;
- module-specific task requirements;
- module-specific QA profile;
- module-specific output requirements.

A module must not recreate Claim/Lease/CAS, Worker lifecycle, or Dispatch as a second independent system.

## Dispatch boundary

Dispatch answers:

> Who starts production, and in which mode?

Supported modes:

- MANUAL — a user starts a Worker session directly;
- AUTOMATED — an external automation layer starts or coordinates Worker execution.

Both modes use the same Worker Runtime and the same canonical task/ownership rules.

Automated Dispatch is an additive integration layer. It must not replace or fork the manual execution path.

## Prompt Preview

Prompt Preview is a Worker Runtime capability.

MANUAL dispatch requires the executable prompt to be shown to the user before generation.

AUTOMATED dispatch may satisfy the preview requirement through an automation audit/event record instead of an interactive user display, if the selected automated contract explicitly permits that behavior.

A Worker must never generate from a silently changed prompt.

## Generation result

Production generation has three primary outcomes:

- SUCCESS
- FAILED
- UNKNOWN

UNKNOWN requires recovery and is never silently converted into retryable work.

Generation SUCCESS means the image/candidate was created. It does not mean QA PASS.

## Output boundary

After generation, the Worker records the canonical generation result.

If the production module requires an image artifact to be persisted, the Worker invokes an Output Adapter defined by the shared Output/Persistence contract.

Artifact upload is not a reason to create a second module-specific Worker system.

## Non-goals

This runtime does not itself implement:

- OpenAI dispatch;
- Make orchestration;
- Worker discovery;
- ComfyUI orchestration;
- visual QA;
- a specific storage provider.

Those are integration or downstream capabilities.


## Mandatory continuation gate

A successful task does not terminate an active multi-task production session.

For an ACTIVE batch:
- if the current task is SUCCESS and `COMPLETED_COUNT < TARGET_COUNT`, the Worker MUST resolve the next authoritative incomplete task;
- the Worker MUST NOT stop, return control to the user, or wait for another command merely because one task succeeded;
- the Worker may stop only when a defined stop condition applies: target completed, user/system stop, quota/platform failure, UNKNOWN/recovery state, or an execution-critical conflict;
- the next task must begin from the authoritative GitHub task state, not conversational memory.

Therefore:

`SUCCESS + REMAINING_TASKS + ACTIVE = NEXT_TASK_REQUIRED`

## Mandatory prompt-preview gate

For MANUAL dispatch, generation is forbidden until the complete executable prompt for the current task has actually been shown to the user.

`PROMPT_PREVIEW_STATUS: SHOWN` is a record of an event; it is not permission by itself. The Worker must perform the preview action before generation.

If the executable prompt changes after preview, the Worker must show the complete replacement prompt again before generation.

## Mandatory design-validation gate

Before DESIGN_LOCK, validate all module-required design fields and batch-level diversity constraints. A Worker must not lock an incomplete or non-compliant design.

## Mandatory output-format validation

Where the generation result exposes actual image dimensions or equivalent output metadata, the Worker/output adapter MUST validate the actual result against the task's `ASPECT_RATIO`, `OUTPUT_TYPE`, and `ORIENTATION` requirements before recording terminal SUCCESS.

If actual format metadata is available and mismatches the task:
- record the actual result;
- record a format mismatch / task-compliance failure;
- do not mark the task as compliant SUCCESS.

If the actual format cannot be determined reliably, record `UNKNOWN / RECOVERY_REQUIRED` when format compliance is a required execution gate. Do not infer compliance from the prompt text alone.
