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
TASK → CURRENT_LOCKED_PROMPT_READINESS → GENERATION_CALL → IMAGE_RECEIVED_OR_NO_IMAGE → RECORD_RESULT_OR_FAILURE → TASK_STATUS

Execution records must distinguish generation started, image result received, result recording still pending, pre-generation readiness blocked, confirmed no-image failure, output-count mismatch, and production SUCCESS.
A received image is recorded regardless of visual quality. Production SUCCESS requires the expected output count and reliable result-to-Task binding; it does not mean visual compliance or QA PASS.

### Prompt Readiness
Before generation, read the current complete locked prompt, confirm it is non-empty and associated with the current Task, and use it directly as the generation instruction. Do not redesign, summarize, translate, omit, replace, or silently alter it. Hidden transport telemetry is evidence only; if unavailable, record UNVERIFIED/NOT_EXPOSED rather than blocking the generation call.

### Result Integrity
Before production Task SUCCESS: the current complete, non-empty LOCK PROMPT was read and assigned to the correct Task before generation; generation was initiated; an image result was received; actual output count equals the Task contract; and the result is recorded and bound to the Task. The Producer MUST NOT compare the submitted payload with LOCK PROMPT after generation or judge visual compliance.

A Task does not need to be SUCCESS for the Batch to complete. The Batch completes when every required Task has a valid terminal state.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1.
If the output count differs from the Task contract, record RESULT_COUNT_MISMATCH and preserve the actual count and all received images. Do not make prompt-payload or visual-compliance judgments in the Producer workflow.

### False-Success Prevention
Image receipt, production success, and QA acceptance are distinct facts. A received image with the expected count and reliable Task binding may be production SUCCESS; this does not imply QA PASS. If result binding or count remains unresolved, record the applicable result state and preserve all known output facts. Visual compliance is exclusively a QA responsibility.

### Recovery
Preserve SESSION_ID, BATCH_ID, and locked prompts. Do not redesign or reuse consumed prompts. Before resuming, verify pre-generation readiness for each eligible Task. After generation, record whether an image was received, actual count, result binding, or confirmed failure reason. Do not perform post-generation prompt-payload comparison or visual QA as part of Producer recovery.

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
