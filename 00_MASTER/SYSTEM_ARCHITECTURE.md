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
User Command → ChatGPT → Create Session/Batch → Read References → Design ALL Prompt(s) → Persist Locked Prompt Set → Execute Prompt(s) → Persist Results/Checkpoints → Complete

### Phase A — Design
1. Create unique SESSION_ID.
2. Create unique BATCH_ID.
3. Read applicable reference data.
4. Design all prompts before generation.
5. Persist the complete prompt set.
6. Lock the prompt set.

### Phase B — Execution
For every Task:
TASK → LOCKED_PROMPT → EXACT_READBACK → EXACT_BINDING → GENERATION_INPUT_FROZEN → PROMPT_BINDING_CHECK → GENERATION_CALL → RESULT_RECEIVED → RESULT_VERIFICATION → TASK_STATUS

Execution states must distinguish GENERATION_STARTED, IMAGE_RESULT_RECEIVED, RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, GENERATION_FAILED, and SUCCESS.
A returned image is not automatically a successful Task.

### Prompt Integrity
Level 1: read the complete, non-empty Locked Prompt for the current Task, verify Task/Prompt association, and explicitly use the original prompt as the generation instruction. Length/hash checks may be used as local supporting evidence but are not mandatory runtime gates.
Level 2: when the generation interface exposes verifiable request/input information, record the available delivery evidence. When it does not, record delivery evidence as UNVERIFIED/NOT_EXPOSED. Missing hidden payload telemetry alone MUST NOT block generation; block only when the prompt is missing, empty, mismatched to the current Task, or cannot be supplied as a usable instruction.

### Result Integrity
Before Task SUCCESS: generation was initiated; a result was received; expected output count equals actual output count; result can be bound to the Task/generation attempt when required; no Level 1 prompt-binding conflict exists.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1.
If more than one output is returned, the Task cannot be SUCCESS.

### False-Success Prevention
IMAGE_RESULT_RECEIVED ≠ TASK_SUCCESS.
An unverified image result must not be converted to SUCCESS merely because an image exists.

### Recovery
Preserve SESSION_ID, BATCH_ID, and locked prompts. Do not redesign. Do not treat unverified results as completed Tasks. Re-run applicable integrity gates before a new attempt.

## Production Records
Canonical path: PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/
MODULE determines the production-record directory. PRODUCTION_TYPE is metadata and must never become the storage root.
Standard records: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, EXECUTION_LOG.md.
Detailed execution evidence: 00_MASTER/PRODUCTION_RECORD_SCHEMA.md and 00_MASTER/GENERATION_WORKER_PROTOCOL.md.

## Strict Boundary
GitHub does NOT control Session creation, Batch creation, Worker/runtime lifecycle, prompt execution, queues, scheduling, retries, stop/resume, orchestration, or image generation.
GitHub DOES provide canonical image-design references, persisted production records, checkpoints, and historical execution evidence.

## Production Entry Gates

Before `/START_AUTO`, verify GitHub database access and load the applicable current Canonical Rules. Before `/RESUME_AUTO`, repeat those checks, then recover the existing Session/Batch and checkpoint.

If either gate fails, do not generate. Resume must preserve the existing Session/Batch and locked prompts; it must not create replacements or redesign prompts.

The authoritative shared requirements are in `00_MASTER/CORE_RULES.md`; execution details are in `00_MASTER/GENERATION_WORKER_PROTOCOL.md`.
