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

## Automated Production
User Command → ChatGPT → Create Session/Batch → Read References → Design ALL Prompts → Write one PROMPTS/<TASK_ID>.md per Task → Verify and lock prompt files + manifest → Execute each Task from its own file → Persist Results/Checkpoints → Complete

### Phase A — Design
1. Create unique SESSION_ID.
2. Create unique BATCH_ID.
3. Read applicable reference data.
4. Design all prompts before generation.
5. Create one dedicated `PROMPTS/<TASK_ID>.md` file for each Task, with explicit prompt-text delimiters and Task/prompt metadata.
6. Create `PROMPT_SET.md` as a manifest/index only; verify one-to-one Task-to-file mapping and all prompt files, then lock the manifest and files.

### Phase B — Execution
For every Task:
TASK → CURRENT_LOCKED_PROMPT_READINESS → GENERATION_CALL → IMAGE_RECEIVED_OR_NO_IMAGE → RECORD_RESULT_OR_FAILURE → TASK_STATUS

Execution records must distinguish generation started, image result received, result recording still pending, pre-generation readiness blocked, confirmed no-image failure, output-count mismatch, and production SUCCESS.
A received image is recorded regardless of visual quality. Production SUCCESS requires the expected output count and reliable result-to-Task binding; it does not mean visual compliance or QA PASS.

### Prompt Readiness
For a new-format Batch, use the assigned Task's prompt file as the source. The design/lock stage is responsible for Task-to-file mapping and prompt metadata. During production, the only prompt-related pre-generation check is whether the complete locked Prompt text can be read. If the complete Prompt is successfully read, immediately submit that exact text unchanged to the generation tool; do not insert any additional validation, metadata check, Task-binding check, payload audit, display, transformation, or unrelated action. If the complete Prompt cannot be read, record the read failure and stop that Task rather than guessing or reconstructing it. Record `FULL_PROMPT_READ_STATUS` and `GENERATION_INPUT_MODE` as observable facts; unavailable hidden transport telemetry is not a gate.

### Result Integrity
Production records should preserve the observed facts: complete Prompt read status, generation call outcome, whether an image was received, actual returned-file count, available result references, and recording status. Do not add output-count equality, post-read Task-binding validation, payload comparison, or visual compliance as a generation gate. Result attribution limitations are recorded separately from image receipt.

A Task does not need to be SUCCESS for the Batch to complete. The Batch completes when every required Task has a valid terminal state.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1 as a design target. Record the actual number of returned files without using count equality to block the generation call or erase a confirmed image receipt. Do not make prompt-payload or visual-compliance judgments in the Producer workflow.

### False-Success Prevention
Image receipt, production result recording, and QA acceptance are distinct facts. Record available Task/result attribution and actual file count after the generation call, but do not use count equality or post-read binding validation to interrupt generation or erase a confirmed image receipt. Visual compliance is exclusively a QA responsibility.

### Recovery
Preserve SESSION_ID, BATCH_ID, and locked prompts. Do not redesign or reuse consumed prompts. Before resuming, verify pre-generation readiness for each eligible Task. After generation, record whether an image was received, actual count, result binding, or confirmed failure reason. Do not perform post-generation prompt-payload comparison or visual QA as part of Producer recovery.

## Production Records
Canonical path: PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/
MODULE determines the production-record directory. PRODUCTION_TYPE is metadata and must never become the storage root.
Standard records: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md (manifest/index only), EXECUTION_LOG.md. Every executable Task in a new-format Batch additionally requires its own `PROMPTS/<TASK_ID>.md` file. Existing combined-file Batches remain legacy and are not silently migrated.
Detailed execution evidence: 00_MASTER/PRODUCTION_RECORD_SCHEMA.md and 00_MASTER/GENERATION_WORKER_PROTOCOL.md.

## Strict Boundary
GitHub does NOT control Session creation, Batch creation, Worker/runtime lifecycle, prompt execution, queues, scheduling, retries, stop/resume, orchestration, or image generation.
GitHub DOES provide canonical image-design references, persisted production records, checkpoints, and historical execution evidence.

## Production Entry Gates

Before `/START_AUTO`, verify GitHub database access and load the applicable current Canonical Rules. Before `/RESUME_AUTO`, repeat those checks, then recover the existing Session/Batch and checkpoint.

If either gate fails, do not generate. Resume must preserve the existing Session/Batch and locked prompts; it must not create replacements or redesign prompts. For new-format Batches, recover each Task's dedicated prompt file through the manifest. Do not silently migrate existing legacy Batches.

The authoritative shared requirements are in `00_MASTER/CORE_RULES.md`; execution details are in `00_MASTER/GENERATION_WORKER_PROTOCOL.md`.
