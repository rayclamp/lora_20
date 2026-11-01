# SYSTEM_ARCHITECTURE.md

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

**Phase B — Execution/resume (Producer):** User specifies/authorizes existing Session/Batch → ChatGPT Producer reconnects and verifies current records → Select eligible Task → Read its complete locked Prompt → Immediately invoke image generation → Observe outcome → Persist and readback-verify events, Task states and checkpoint → Reconcile before another eligible Task → Close Batch only when its terminal-state and durable-completion conditions are met.

For `UNIVERSAL_WALLPAPER` / `FESTIVAL_WALLPAPER`, the commands are `/WALLPAPER_CONSOLE` and `/WALLPAPER_PRODUCE`. For `LORA_IMAGE`, they are `/LORA_CONSOLE` and `/LORA_PRODUCE`. Only the appropriate module rules and command contract apply; never create a replacement Session/Batch during continuation.

### Phase A — Design/lock (Console)
1. Create the authorized unique SESSION_ID and BATCH_ID for **design**, not in the Producer.
2. Read and apply the selected module's authoritative rules; design all Tasks before generation.
3. Create one dedicated `PROMPTS/<TASK_ID>.md` file for each new Task, with explicit prompt-text delimiters and Task/prompt metadata.
4. Create `PROMPT_SET.md` as an index/manifest only; verify the one-to-one Task-to-file mapping and each full prompt by GitHub write/readback.
5. Lock only verified prompt files and manifest; report the Session/Batch and lock status, then STOP without image generation.

### Phase B — Execution/resume (Producer)
For every Task:
TASK → CURRENT_LOCKED_PROMPT_READINESS → GENERATION_CALL → IMAGE_RECEIVED_OR_NO_IMAGE → RECORD_RESULT_OR_FAILURE → TASK_STATUS

Execution records must distinguish a generation attempt, observed image receipt, unresolved/pending durable recording, verified result attribution, prompt consumption, confirmed no-image failure, UNKNOWN outcome, and formally recorded Task SUCCESS. `RESULT_COUNT_MISMATCH` is a **legacy/historical status only** and must not be assigned to new Tasks or events solely because returned-file count differs from the planned count.
Receipt of one or more images is an **observed generation fact** and immediately prevents another generation call for that Task; it does not by itself count as formal SUCCESS. Assign `TASK_STATUS=SUCCESS` and increment `COMPLETED_COUNT` once per Task **only when** the received result is correctly attributed to that Task and the required result event/Task record are durably written to GitHub and readback-verified. Before then preserve result-bearing unresolved state; never regenerate due to recording failure. Count actual received files separately. Visual quality, output-count equality, and independent QA do not determine production SUCCESS.

### Prompt Readiness
For a new-format Batch, use the assigned Task's prompt file as the source. The design/lock stage is responsible for Task-to-file mapping and prompt metadata. During production, the only prompt-related pre-generation check is whether the complete locked Prompt text can be read. If the complete Prompt is successfully read, immediately submit that exact text unchanged to the generation tool; do not insert any additional validation, metadata check, Task-binding check, payload audit, display, transformation, or unrelated action. If the complete Prompt cannot be read, record the read failure and stop that Task rather than guessing or reconstructing it. Record `FULL_PROMPT_READ_STATUS` and `GENERATION_INPUT_MODE` as observable facts; unavailable hidden transport telemetry is not a gate.

### Result Integrity
Production records preserve **observable** complete-Prompt-read status, actual generation call/attempt, received-image YES/NO/UNKNOWN, returned-file count, result references, Task attribution, prompt state, persistence/write/readback outcome, and derived counters. A tool invocation or status label alone is not proof of image receipt. Record known limitations without inventing evidence.

The Batch may finish with terminal non-SUCCESS Tasks, but only after **every required Task has a valid terminal state**, attempt/Task evidence and counters are reconciled, and the final Batch completion record has been durably written and readback-verified. UNKNOWN, unverified received results, or unresolved required persistence prevent formal Batch completion.
For wallpaper production, `EXPECTED_OUTPUT_COUNT=1` is only the planned per-Task output; multiple returned files do not create multiple successful Tasks. Do not assign new `RESULT_COUNT_MISMATCH` statuses, demand byte-identical hidden prompt transport, insert a post-read Task-binding validation gate, or assess image/prompt visual compliance as part of the Producer.

### False-Success Prevention
**Keep three independent facts separate:** (1) image receipt is observed; (2) formal Task SUCCESS requires correct Task attribution and durable result/Task-state write/readback; (3) QA acceptance is a different, currently `PAUSED` downstream process and cannot change production-success counts or trigger regeneration. An unknown generation outcome never authorizes retry. A confirmed no-image outcome may be retried for that same Task with its unchanged locked Prompt only within the current three-confirmed-failures-total limit, initial call included; non-generation read/write/metadata errors do not increment this count.

### Recovery and Safe Continuation
Preserve the original `SESSION_ID`, `BATCH_ID`, immutable Task-to-Prompt mapping, attempt history and prompt-consumption state. Resume only from **current GitHub authoritative records**; never invent prior outcomes, replace a Session/Batch, redesign a locked Prompt, retry a Task after image receipt, or retry an UNKNOWN outcome. Reconcile suspicious/non-terminal Tasks using verified per-attempt events and actual known result evidence, not status labels or a prior Producer's narrative.

After generation, write the observed event, Task attribution, result references/count, prompt state and relevant counters; read back and verify before selecting another Task. If a Task-local write/readback fails, preserve the received-image fact **without regenerating** and isolate its recovery. Continue to an independent Task only after the known prior result/attribution is durably preserved or a safe recovery checkpoint is explicitly recorded and verified, **and** the next Task's own current authoritative records and full locked Prompt are readable. If the known result cannot safely be preserved, pause progression for persistence recovery. A Task-local error alone is not Batch-wide blocking; stop the entire Batch only for a verified non-isolatable shared access/identity/mapping/result-attribution/persistence-safety issue.

Once an eligible Task is selected, read its complete assigned locked Prompt; the only prompt-related pre-generation check is whether that read succeeds. If it succeeds, call the generation tool **immediately** with no intervening validation, analysis, display, unrelated GitHub operation, or deliberate rewrite. Do not conduct post-generation image QA or hidden-payload comparisons during Producer recovery. Batch completion requires verified terminal-state reconciliation and final write/readback as described above.

## Production Records
Canonical path: PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/
MODULE determines the production-record directory. PRODUCTION_TYPE is metadata and must never become the storage root.
Standard records: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md (manifest/index only), EXECUTION_LOG.md. Every executable Task in a new-format Batch additionally requires its own `PROMPTS/<TASK_ID>.md` file. Existing combined-file Batches remain legacy and are not silently migrated.
Detailed execution evidence: 00_MASTER/PRODUCTION_RECORD_SCHEMA.md and 00_MASTER/GENERATION_WORKER_PROTOCOL.md.

## Strict Boundary
GitHub does NOT control Session creation, Batch creation, Worker/runtime lifecycle, prompt execution, queues, scheduling, retries, stop/resume, orchestration, or image generation.
GitHub DOES provide canonical image-design references, persisted production records, checkpoints, and historical execution evidence.

## Production Entry Gates

For `UNIVERSAL_WALLPAPER` and `FESTIVAL_WALLPAPER`, use `/WALLPAPER_CONSOLE` for design/lock and `/WALLPAPER_PRODUCE` for execution, as defined in `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`. The same command names cover both wallpaper modules; `MODULE` selects module-specific rules and paths. The design command does not request or accept a reference-image input. A reference image separately supplied in the production conversation is handled only by the active module's Reference Policy. Neither wallpaper command loads LoRA-specific rules.

For wallpaper production, `/WALLPAPER_CONSOLE` is the only design-and-lock entry point and `/WALLPAPER_PRODUCE` is the only execution/continuation entry point. Before executing, the user must explicitly provide `MODULE`, `SESSION_ID`, and `BATCH_ID`; verify that all three match the current GitHub records. If a required value or read is missing, invalid, or mismatched, do not generate. Continuation reuses the same identifiers and locked prompts; it never creates replacements or redesigns prompts. For new-format Batches, recover each Task's dedicated prompt file through the manifest. Do not silently migrate existing legacy Batches.

For `MODULE=LORA_IMAGE`, use `/LORA_CONSOLE` solely for prompt design, Session/Batch creation, GitHub persistence/readback and lock; **the design stage does not require a person-reference image**. Use `/LORA_PRODUCE` to execute only the explicitly authorized existing Session/Batch and already locked prompts according to `00_MASTER/LORA/LORA_PRODUCE_COMMAND.md`. Before its first generation call, the **current Producer conversation must contain a supplied person-reference image** as the visual identity authority. If missing/inaccessible/ambiguous, stop LoRA generation and request it; do not silently substitute a GitHub image, a past conversation or a different module's reference. The absent image does not retroactively invalidate the completed design/lock stage. LoRA Task output orientation may vary by Task as recorded in its locked Task contract.

Single-Producer operation does **not** require GitHub Task Claim, Lease, execution locks, or a GitHub runtime coordinator. A future multi-Worker coordination design is not active here. QA remains independent and `PAUSED`.

The authoritative shared requirements are in `00_MASTER/CORE_RULES.md`; execution details are in `00_MASTER/GENERATION_WORKER_PROTOCOL.md` and `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`.
