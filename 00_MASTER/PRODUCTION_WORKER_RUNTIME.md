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

`DISPATCH → RESOLVE MODULE → LOAD MODULE RULES → SELECT TASK → CLAIM → DESIGN → VALIDATE DESIGN → BUILD FINAL EXECUTABLE PROMPT → PROMPT LOCK → PROMPT PREVIEW → CONFIRMATION/EXECUTION DECISION → EXECUTE LOCKED PROMPT → VALIDATE OUTPUT → RECORD RESULT → CHECKPOINT → NEXT TASK`

For Image Production, DESIGN → VALIDATE DESIGN → PROMPT is system-owned in both MANUAL and AUTOMATED modes. The user supplies the image requirement, not an executable Prompt.

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
- immutable final Prompt execution-lock contract;
- prompt execution event/telemetry contract;
- common generation recording;
- continuation / stop conditions.

## Module responsibilities

### Attempt/output boundary

The shared runtime distinguishes three independent concepts:
- `GENERATION_ATTEMPT_COUNT` — generation events invoked for the current task;
- `TARGET_SUCCESS_COUNT` — validated successful outputs required for task completion;
- `MAX_ATTEMPTS_PER_TASK` — absolute generation-attempt ceiling.

The runtime MUST enforce `GENERATION_ATTEMPT_COUNT <= MAX_ATTEMPTS_PER_TASK`. A returned candidate that fails an output contract (for example, wrong aspect ratio) is a `FAILED` task result, not a successful output. It increments the attempt counter but not `COMPLETED_COUNT`. Retry is controlled recovery and requires failure analysis/recovery authorization. When the hard attempt ceiling is reached, no additional generation event is allowed; transition to `RECOVERY_REQUIRED` and stop according to the module failure protocol.

`TARGET_SUCCESS_COUNT: 1` means one validated successful output is required. Once it is reached, the task is terminal and must not generate a second candidate under the same task identity.

### Module responsibilities

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

- MANUAL — a user starts the Image Production session directly. The system designs the image and Prompt, shows it to the user, and waits for explicit generation confirmation;
- AUTOMATED — the approved System Automation path starts or coordinates Worker execution. The system still designs the image and Prompt.

Both modes use the same Worker Runtime and the same canonical task/ownership rules.

System Automation is an additive entry mode over the shared production core. It must not replace or fork the manual execution path.

External automation providers are not part of the Worker Runtime. They may later connect through an explicit System Automation adapter, but they must not define, replace, or fork the Automation or Worker architecture.

## Prompt Preview and Manual Confirmation

Prompt Preview is a Worker Runtime capability.

For Image Production MANUAL mode, the executable Prompt must be designed and validated by the system, shown to the user, and followed by an explicit USER_GENERATION_CONFIRMATION gate. A valid Prompt alone is never permission to generate.

Manual confirmation states are:
- DESIGN_READY_FOR_USER_CONFIRMATION;
- USER_CONFIRMED_GENERATION;
- USER_REQUESTED_REVISION;
- USER_DECLINED_GENERATION.

USER_REQUESTED_REVISION returns to DESIGN and requires a new validation/Prompt Preview before generation. USER_DECLINED_GENERATION terminates the current design execution without generation.

AUTOMATED dispatch may satisfy the preview requirement through an automation audit/event record instead of an interactive user display, if the selected automated contract explicitly permits that behavior.

A Worker must never generate from a silently changed prompt.

Prompt Preview and Prompt Execution are separate controls. Preview proves what was shown; it does not by itself prove what the generation operation received. When the runtime exposes execution telemetry, the Worker must record the execution event and verify prompt correspondence. When telemetry is not exposed, record `EXECUTION_VERIFICATION_STATUS: NOT_OBSERVABLE` rather than inventing evidence.

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
- external automation-provider orchestration;
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
- the Worker may stop only when a defined stop condition applies: target completed, user/system stop, VERIFIED quota/platform failure, UNKNOWN/recovery state, or an execution-critical conflict;
- a quota/rate-limit/generation-unavailable stop MUST be backed by explicit platform evidence; Worker inference or expectation is not sufficient;
- the next task must begin from the authoritative GitHub task state, not conversational memory.

Therefore:

`SUCCESS + REMAINING_TASKS + ACTIVE = NEXT_TASK_REQUIRED`

Execution-turn boundary rule:

If the generation environment ends the current Worker execution before another generation event can be invoked, the Worker MUST persist an explicit resumable state before control returns. An ACTIVE incomplete batch must never disappear into an unrecorded endpoint.

The valid outcomes after a generation event are:
- continue to the next task in the same execution when supported;
- persist an explicit paused/resumable boundary state;
- persist FAILED/UNKNOWN/recovery state;
- persist a verified platform stop;
- complete the batch.

The Worker must not reinterpret a normal assistant-turn boundary as quota exhaustion, generation failure, or completion.

## Mandatory prompt-execution gate

For every generation event, the final executable prompt must be locked before invocation. After lock, the Worker MUST execute that exact locked artifact and MUST NOT reconstruct, summarize, expand, shorten, translate, append, prepend, substitute, or otherwise mutate it. Any Prompt revision invalidates the prior lock and requires a new validation → lock → preview cycle.

The runtime must track, when supported:
- `PROMPT_EXECUTION_STATUS`;
- `EXECUTED_PROMPT_REFERENCE`;
- `EXECUTION_VERIFICATION_STATUS`.

A preview event is not execution proof. If the platform exposes no executed-prompt telemetry, `NOT_OBSERVABLE` is the correct value. Never fabricate a hash, request ID, or executed payload.

An observable prompt mismatch is an execution-integrity failure and must not be recorded as normal SUCCESS.

### Generation idempotency boundary

Every generation attempt MUST carry a deterministic `GENERATION_IDEMPOTENCY_KEY` derived from the immutable batch/task identity and the generation attempt number. The key must be forwarded unchanged through the Worker Runtime and Image Provider Adapter to the provider transport.

The production provider contract MUST explicitly support the supplied idempotency key. This protects the crash boundary where provider generation may complete but the subsequent GitHub CAS checkpoint fails: recovery may invoke the same generation attempt again, but it must address the same provider operation rather than create an untracked duplicate artifact.

Therefore:

`GENERATION_IDEMPOTENCY_KEY = STABLE(BATCH_ID, TASK_ID, GENERATION_ATTEMPT)`

`PROVIDER_RETRY(SAME_KEY) = SAME_LOGICAL_GENERATION_OPERATION`

A provider that cannot honor this contract is not production-eligible for automatic generation.

If the provider transport throws or otherwise returns an execution outcome that cannot be reliably classified, the Worker MUST convert that boundary uncertainty into `UNKNOWN / RECOVERY_REQUIRED`, release the task lease/ownership, and checkpoint the uncertainty. It must not let a raw transport exception escape while leaving the authoritative task in an ambiguous claimed state. Recovery may later retry the same generation attempt using the same idempotency key.

## Mandatory prompt-preview gate

For MANUAL Image Production, generation is forbidden until the complete system-generated executable Prompt has actually been shown to the user and the user has explicitly confirmed generation.

`PROMPT_PREVIEW_STATUS: SHOWN` is a record of an event; it is not permission by itself. The Worker must perform the preview action before generation. In MANUAL mode, USER_GENERATION_CONFIRMATION is an additional required gate.

If the executable prompt changes after preview, the Worker must show the complete replacement prompt again before generation.

## Mandatory design-validation gate

Before DESIGN_LOCK, validate all module-required design fields, batch-level diversity constraints, and the HARD output-format composition lock. The task's `OUTPUT_TYPE → ASPECT_RATIO → ORIENTATION` must constrain composition before prompt generation. A Worker must not lock an incomplete or non-compliant design.

## Mandatory output-format validation

Where the generation result exposes actual image dimensions or equivalent output metadata, the Worker/output adapter MUST validate the actual result against the task's `ASPECT_RATIO`, `OUTPUT_TYPE`, and `ORIENTATION` requirements before recording terminal SUCCESS.

If actual format metadata is available and mismatches the task:
- record the actual result;
- record `FAILED / OUTPUT_FORMAT_MISMATCH`;
- increment the generation-attempt counter;
- do not mark the task as compliant SUCCESS;
- evaluate retry only through the bounded failure/recovery protocol.

If the actual format cannot be determined reliably, record `UNKNOWN / RECOVERY_REQUIRED` when format compliance is a required execution gate. Do not infer compliance from the prompt text alone.


## Mandatory stop-reason evidence gate

A Worker MUST NOT claim that a production session stopped because of quota, rate limiting, or generation unavailability unless the platform actually returned an explicit corresponding signal.

Required distinction:

- `VERIFIED_QUOTA_LIMIT` — explicit platform quota/usage-limit message or error;
- `VERIFIED_RATE_LIMIT` — explicit platform rate-limit message or error;
- `VERIFIED_GENERATION_UNAVAILABLE` — explicit platform statement that generation is unavailable;
- `UNVERIFIED` — Worker inference, expectation, or assumption without explicit platform evidence.

`UNVERIFIED` MUST NOT be converted into a quota/platform stop reason.

If no explicit platform evidence exists, the Worker must continue when generation remains available. If the Worker cannot reliably determine whether generation is available, record `UNKNOWN / RECOVERY_REQUIRED` and stop rather than inventing a quota state.

Any verified platform stop must preserve the evidence in the canonical batch record.


## Automated context-resolution gate

Before DESIGN, Automated Dispatch MUST validate the Automation Execution Contract and load canonical rules through the Canonical Path Registry.

For wallpaper production, a broad Theme/Scene input MUST pass Scene Intent Resolution before presentation design or prompt assembly. The resolved intent must include ACTIVITY, LOCATION, ACTION, TIME, WEATHER, SOCIAL_CONTEXT, and ENVIRONMENTAL_CUES when materially applicable, with provenance recorded as EXPLICIT, AUTOMATION_INPUT, WORKER_RESOLVED, RULE_DEFAULT, or NOT_OBSERVABLE.

A missing canonical rule, unresolved required Scene Intent, or conflicting context is a context/design gate failure and blocks generation. The Worker must not silently substitute an obsolete rule path or invent upstream provenance.

Automated execution must record the trace events defined by 00_MASTER/AUTOMATION_EXECUTION_CONTRACT.md whenever observable. Unknown automation telemetry remains NOT_OBSERVABLE/UNKNOWN and is never fabricated.

## Final Execution Context Lock

After the final Prompt is validated, the Worker must also construct and lock the complete generation execution context.

The locked context must include, at minimum:
- reference authority and reference identifiers;
- model identity/version;
- OUTPUT_TYPE;
- ASPECT_RATIO;
- generation parameters;
- provider-specific parameters.

The runtime records an execution-context hash alongside the Prompt hash.

Generation is forbidden when:
- the execution context is missing;
- the execution-context hash does not match the persisted context;
- the Worker would need to reconstruct context from defaults.

The provider adapter receives the exact locked execution context. If provider telemetry is exposed, the runtime records VERIFIED or MISMATCH; otherwise it records NOT_OBSERVABLE.

Prompt integrity and execution-context integrity are separate controls. Neither one proves visual adherence.
## Visual Design Adherence Gate

Generation success does not mean task success. After technical output validation, image-production tasks that require design compliance must pass a separate Visual Design Adherence Evaluator.

The evaluator compares the generated artifact against the locked Design Record for applicable fields such as outfit, hairstyle, action, pose, scene, viewpoint, shot size, and required major props. Only an explicit VISUAL_DESIGN_ADHERENCE_PASS satisfies this gate.

The evaluator may return VISUAL_DESIGN_NONCOMPLIANCE or VISUAL_DESIGN_UNKNOWN. Noncompliance enters bounded task recovery. Unknown requires recovery/review and must not be converted to PASS.

The Worker must not self-declare visual adherence. The evaluator is an adapter boundary and must not create a second Worker Runtime, Dispatch system, or task queue.

TASK_SUCCESS therefore requires GENERATION_SUCCESS + TECHNICAL_OUTPUT_VALIDATION_PASS + VISUAL_DESIGN_ADHERENCE_PASS.

Visual adherence is distinct from downstream LoRA QA and from Prompt/Execution-Context integrity.
