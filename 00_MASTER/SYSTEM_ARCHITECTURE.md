# SYSTEM_ARCHITECTURE.md

## New LoRA V5.0 standalone design architecture — current scope
New `/LORA_CONSOLE V5.0` Sessions are design-and-archive only, following `00_MASTER/LORA/LORA_CONSOLE_COMMAND.md`: User → ChatGPT Designer → current CORE and LoRA design rules → diverse `IMAGE_COUNT` candidates → one actual Taiwan-time Session → `PROMPTS/LORA_IMAGE/<SESSION_ID>/INDEX.md` plus complete independent English `TASK_NNN.txt` prompts → read back and compare every complete file → display full prompt bodies → STOP. No Batch, prompt lock, Producer, generation, QA, queue or production records. The user manually copies prompts and supplies identity images in later generation conversations. All Batch/Producer/lock/record statements below apply only to wallpaper and historically existing locked LoRA Batches and must not be imported into new V5.0 Sessions or used to migrate old records.


The repository is the project's image-production reference and persistence database, not an execution engine.

## 0.5 Three-Role System Definition — NON-NEGOTIABLE
User — Command Giver; ChatGPT — Operator / Producer; GitHub — Database.
User gives commands → ChatGPT operates / produces → GitHub provides data and records data.

## Session Access Policy
A production Session belongs to the ChatGPT context that created it by default. A new context does not automatically take over another Session. Explicit User authorization may identify another SESSION_ID. SESSION_ID is an identifier, not an access token. GitHub does not enforce Session access. Cross-Session operations must be recorded.

## Core Architecture
User → ChatGPT → internal production mechanisms → GitHub
GitHub provides reusable reference data and stores durable production records.

## Manual Production
User Command → ChatGPT → Read References → Design Prompt(s) → Return Prompt(s)

## Automated Production — Separate Design and Producer Stages
The design/lock command and the image-production/continuation command are **separate stages** with different authority. Neither stage may silently perform the other's job. ChatGPT operates the stage; GitHub stores canonical rules, locked prompts and durable records, but never autonomously orchestrates generation.

**Phase A — Design/lock (Console):** User → ChatGPT Designer → Read authoritative rules → Create Session/Batch → Design ALL prompts → Write per-Task prompt files and manifest → Read back and verify → Lock → Report identifiers → STOP (no generation).

**Phase B — Execution/resume (Producer):** User specifies/authorizes existing Session/Batch → ChatGPT Producer reconnects and verifies current records → Select eligible Task → Read its complete canonical locked Prompt → Prepare effective Task-specific generation input (FULL_LOCKED_PROMPT by default; authorized condensation only when necessary) → Immediately invoke image generation → Observe image / confirmed no image / UNKNOWN → If condensation was used, preserve the exact fixed input **after the first actual generation call** → Persist and readback-verify events, Task states, execution-input evidence and checkpoint as applicable → Reconcile before retry, PAUSED recovery, or another independent Task → Close Batch only when every required Task is terminal and the durable completion record is verified.

For `UNIVERSAL_WALLPAPER` / `FESTIVAL_WALLPAPER`, the commands remain `/WALLPAPER_CONSOLE` and `/WALLPAPER_PRODUCE`. New `LORA_IMAGE` prompt-only design uses `/LORA_CONSOLE V5.0` with NO producer handoff; `/LORA_PRODUCE` is retained only for existing historical locked LoRA Batches. Never create a replacement Session/Batch during historical production continuation.

### Phase A — Design/lock (Console)
1. Create the authorized unique SESSION_ID and BATCH_ID for **design**, not in the Producer.
2. Read and apply the selected module's authoritative rules; design all Tasks before generation.
3. Create one dedicated `PROMPTS/<TASK_ID>.md` file for each new Task, with explicit prompt-text delimiters and Task/prompt metadata.
4. Create `PROMPT_SET.md` as an index/manifest only; verify the one-to-one Task-to-file mapping and each full prompt by GitHub write/readback.
5. Lock only verified prompt files and manifest; report the Session/Batch and lock status, then STOP without image generation.

### Phase B — Execution/resume (Producer)
For every Task:
TASK → COMPLETE_LOCKED_PROMPT_READ → EFFECTIVE_TASK_INPUT_PREPARATION (FULL BY DEFAULT; AUTHORIZED_CONDENSATION ONLY WHEN NECESSARY) → IMMEDIATE_GENERATION_CALL → IMAGE_RECEIVED_OR_CONFIRMED_NO_IMAGE_OR_UNKNOWN → OPTIONAL_FIXED_CONDENSED_INPUT_PRESERVATION_AFTER_FIRST_CALL → RECORD_RESULT_OR_FAILURE → READBACK_AND_TASK_STATUS → RETRY_OR_PAUSED_OR_NEXT_ELIGIBLE_TASK

Execution records must distinguish a generation attempt, observed image receipt, unresolved/pending durable recording, verified result attribution, prompt consumption, confirmed no-image failure, UNKNOWN outcome, and formally recorded Task SUCCESS. `RESULT_COUNT_MISMATCH` is a **legacy/historical status only** and must not be assigned to new Tasks or events solely because returned-file count differs from the planned count.
Receipt of one or more images is an **observed generation fact** and immediately prevents another generation call for that Task; it does not by itself count as formal SUCCESS. Assign `TASK_STATUS=SUCCESS` and increment `COMPLETED_COUNT` once per Task **only when** the received result is correctly attributed to that Task and the required result event/Task record are durably written to GitHub and readback-verified. Before then preserve result-bearing unresolved state; never regenerate due to recording failure. Count actual received files separately. Visual quality, output-count equality, and independent QA do not determine production SUCCESS.


### Prompt Readiness

The complete canonical locked Prompt is the authoritative design specification and remains immutable. For a new-format Batch, the assigned per-Task locked Prompt file remains the original source. The design/lock stage owns Task-to-file mapping and prompt metadata.

The Producer must successfully read the complete assigned locked Prompt before generation. FULL_LOCKED_PROMPT is the default and preferred generation instruction. Only a concrete interface input limitation that prevents complete submission permits one AUTHORIZED_CONDENSED_PROMPT under the shared Generation Worker Protocol. It must preserve the Task's essential drawing requirements, restrictions, exceptions, priorities, identifiers, output format, reference requirements, and intended meaning. Authorized condensation is part of the immediate handoff, not redesign or renewed Prompt validation.

The instruction used for the first actual image-generation call becomes the Task's fixed execution input. If condensation was used, preserve the exact fixed text **after the first actual generation call** in the one dedicated `EXECUTION_INPUTS/<TASK_ID>.md` record and read it back before any permitted retry or unsafe progression. Do not overwrite the verified condensed record, create another version, re-condense, or switch modes. `PROMPTS/<TASK_ID>.md` remains unchanged.

If the complete locked Prompt cannot be read, record the read failure and stop the affected Task rather than guessing or reconstructing it. No additional content, metadata, Task-binding, format, payload equality, visual QA, or unrelated-operation gate may be inserted into the immediate Prompt-to-generation path. Unavailable hidden transport telemetry alone does not block generation; record `FULL_PROMPT_READ_STATUS`, `GENERATION_INPUT_MODE`, and other observable evidence honestly.

### Result Integrity
Production records preserve **observable** complete-Prompt-read status, actual generation call/attempt, received-image YES/NO/UNKNOWN, returned-file count, result references, Task attribution, prompt state, persistence/write/readback outcome, and derived counters. A tool invocation or status label alone is not proof of image receipt. Record known limitations without inventing evidence.

The Batch may finish with terminal non-SUCCESS Tasks, but only after **every required Task has a valid terminal state**, `PAUSED_COUNT=0`, attempt/Task evidence and counters are reconciled, and the final Batch completion record has been durably written and readback-verified. A required PAUSED Task is non-terminal; UNKNOWN, unverified received results, or unresolved required persistence also prevent formal Batch completion.
For wallpaper production, `EXPECTED_OUTPUT_COUNT=1` is only the planned per-Task output; multiple returned files do not create multiple successful Tasks. Do not assign new `RESULT_COUNT_MISMATCH` statuses, demand byte-identical hidden prompt transport, insert a post-read Task-binding validation gate, or assess image/prompt visual compliance as part of the Producer.


### False-Success Prevention

**Keep three independent facts separate:** (1) image receipt is observed; (2) formal Task SUCCESS requires correct Task attribution and durable result/Task-state write/readback; (3) QA acceptance is a different, currently `PAUSED` downstream process and cannot change production-success counts or trigger regeneration.

A confirmed no-image outcome may be retried for the same Task only with the exact generation instruction fixed at its first actual generation call and the same immutable canonical Prompt reference. The maximum remains three consecutive confirmed no-image generation failures in total, including the initial call. Non-generation read/write/metadata errors and temporary **pre-call** inability to submit the same fixed input do not increment generation attempt or no-image failure counts.

A temporary pre-call inability to submit the fixed instruction enters non-terminal `TASK_STATUS=PAUSED`, preserving prior attempt history and remaining retry eligibility. Resume only with the unchanged fixed instruction; never use PAUSED to evade safety/policy restrictions. A received image prohibits all further generation for that Task, and an UNKNOWN outcome cannot be retried.


### Recovery and Safe Continuation

Preserve the original `SESSION_ID`, `BATCH_ID`, immutable Task-to-Prompt mapping, exact Task execution input where applicable, attempt history, and prompt-consumption state. Resume only from **current authoritative GitHub records**; never infer prior outcomes, replace a Session/Batch, redesign a locked Prompt, retry after image receipt, or retry an UNKNOWN outcome. Reconcile suspicious/non-terminal Tasks using verified per-attempt events and actual known result evidence, not status labels or a prior Producer's narrative.

If authorized condensation was used, recover its one exact fixed execution input from `EXECUTION_INPUTS/<TASK_ID>.md`. If ordinary input persistence failed, a complete readback-verified safe recovery checkpoint may preserve the exact fixed text, original Prompt identity, Task/Batch identity, all known attempts and observed results, prompt-consumption state, remaining retry budget, result attribution and persistence state. Do not reconstruct a missing condensed input from memory, re-condense it, or replace it with a different instruction. A path, hash, or narrative alone is not a complete recovery record.

After generation, write the observed event, Task attribution, result references/count, prompt state, fixed-input record when applicable, and relevant counters; read back and verify before retry or unsafe progression. If a Task-local write/readback fails, preserve the actual received-image fact **without regenerating** and isolate its recovery. Continue to another independent Task only after the affected Task's known result/attribution and required fixed-input evidence have been durably preserved, or a **complete** safe recovery checkpoint has been written and readback-verified, and the next Task's own current authoritative records and full locked Prompt are directly readable. If preservation cannot be verified, pause progression; a Task-local failure alone is not Batch-wide blocking. Stop the entire Batch only for a verified non-isolatable shared access/identity/contract/mapping/result-attribution/persistence-safety issue.

If the exact fixed input temporarily cannot be submitted **before a new generation call begins**, record `TASK_STATUS=PAUSED` without increasing generation attempts or no-image failures. Preserve all previous attempt evidence, the fixed input and remaining retry eligibility. A PAUSED Task remains non-terminal even when unrelated independent Tasks continue, and must eventually reach a valid terminal outcome before Batch completion. Never use PAUSED after confirmed image receipt, UNKNOWN generation outcome, retry exhaustion, or to bypass a safety/policy restriction.

Once an eligible Task is selected, read the complete assigned locked Prompt and immediately prepare and submit its full or necessarily condensed effective Task-specific generation instruction under the shared Worker Protocol, without unrelated analysis, extra GitHub operations, metadata revalidation, prompt display, or visual QA. If authorized condensation was used, preserve its exact text **after the first actual generation call**. No post-generation visual QA or hidden-payload comparisons are permitted in Producer recovery.

## Production Records
Canonical path: PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/
MODULE determines the production-record directory. PRODUCTION_TYPE is metadata and must never become the storage root.
Standard records: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md (manifest/index only), EXECUTION_LOG.md. Every executable Task in a new-format Batch additionally requires its own `PROMPTS/<TASK_ID>.md` file. Optional production-time evidence: `EXECUTION_INPUTS/<TASK_ID>.md` for the one fixed authorized condensed input saved after its first actual generation call, and `RECOVERY_CHECKPOINTS/<TASK_ID>.md` for verified Task-local safe recovery when normal persistence fails. Neither optional file is a Console design/lock prerequisite, replaces the canonical locked Prompt, or silently migrates historical records. Existing combined-file Batches remain legacy and are not silently migrated.
Detailed execution evidence: 00_MASTER/PRODUCTION_RECORD_SCHEMA.md and 00_MASTER/GENERATION_WORKER_PROTOCOL.md.

## Strict Boundary
GitHub does NOT control Session creation, Batch creation, Worker/runtime lifecycle, prompt execution, queues, scheduling, retries, stop/resume, orchestration, or image generation.
GitHub DOES provide canonical image-design references, persisted production records, checkpoints, and historical execution evidence.

## Production Entry Gates

For `UNIVERSAL_WALLPAPER` and `FESTIVAL_WALLPAPER`, use `/WALLPAPER_CONSOLE` for design/lock and `/WALLPAPER_PRODUCE` for execution, as defined in `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`. The same command names cover both wallpaper modules; `MODULE` selects module-specific rules and paths. The design command does not request or accept a reference-image input. A reference image separately supplied in the production conversation is handled only by the active module's Reference Policy. Neither wallpaper command loads LoRA-specific rules.

For wallpaper production, `/WALLPAPER_CONSOLE` is the only design-and-lock entry point and `/WALLPAPER_PRODUCE` is the only execution/continuation entry point. Before executing, the user must explicitly provide `MODULE`, `SESSION_ID`, and `BATCH_ID`; verify that all three match the current GitHub records. If a required value or read is missing, invalid, or mismatched, do not generate. Continuation reuses the same identifiers and locked prompts; it never creates replacements or redesigns prompts. For new-format Batches, recover each Task's dedicated prompt file through the manifest. Do not silently migrate existing legacy Batches.

For NEW `MODULE=LORA_IMAGE` work, `/LORA_CONSOLE V5.0` creates only one Session with `INDEX.md` and independently written English `TASK_NNN.txt`, verifies full GitHub readback and displays all complete prompts; it does not require a reference image at design time or perform any Batch/lock/producer/generation/QA operations. Later generation is controlled by the user and uses the reference image they supply in that separate chat. `/LORA_PRODUCE` only resumes expressly authorized existing historically locked Batches with their original metadata, reference rules and records. V5.0 formats are independently selected per Task and indexed in `INDEX.md`; historical Batch metadata stays unchanged.

Single-Producer operation does **not** require GitHub Task Claim, Lease, execution locks, or a GitHub runtime coordinator. A future multi-Worker coordination design is not active here. QA remains independent and `PAUSED`.

The authoritative shared requirements are in `00_MASTER/CORE_RULES.md`; execution details are in `00_MASTER/GENERATION_WORKER_PROTOCOL.md` and `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`.
