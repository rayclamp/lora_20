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
7. Return the prompt set to the user when the active production instruction requires display.

### Phase B — Execution
For every Task:
TASK → LOCKED_PROMPT → EXACT_READBACK → GENERATION_INPUT → PROMPT_BINDING_CHECK → GENERATION_CALL → RESULT_RECEIVED → RESULT_VERIFICATION → TASK_STATUS

Execution states must distinguish GENERATION_STARTED, IMAGE_RESULT_RECEIVED, RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, GENERATION_FAILED, and SUCCESS.
A returned image is not automatically a successful Task.

### Prompt Integrity
Level 1: exact locked prompt readback and GENERATION_INPUT binding; compare hash/length when available.
Level 2: establish, when the interface supports it, that the actual generation call received the same input. Displaying the prompt or preparing GENERATION_INPUT does not prove actual delivery.
If required delivery evidence is unavailable, DELIVERY_INTEGRITY = UNVERIFIED and the Task MUST NOT be SUCCESS.

### Result Integrity
Before Task SUCCESS: generation was initiated; a result was received; expected output count equals actual output count; result can be bound to the Task/generation attempt when required; no execution-integrity conflict exists.
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

## Production Entry Gate — Canonical Rule Loading
The /START_AUTO workflow has a mandatory entry gate before Session/Batch execution or any image-generation call.

### Gate Order
1. Receive /START_AUTO and Production Request.
2. Load the applicable current GitHub Canonical Rules.
3. Verify that the required rules were successfully loaded and are usable.
4. If loading/verification fails: set ENTRY_GATE = BLOCKED, record the reason when persistence is available, and perform NO image-generation call.
5. Only after the gate passes may the Producer create/operate the production Session/Batch and continue to Prompt Design, Prompt Lock, and Generation.

### Hard Invariant
`CANONICAL_RULE_LOADING = PASS` is a mandatory prerequisite for /START_AUTO Generation.

A Producer MUST NOT interpret IMAGE_COUNT, Task semantics, Prompt Lock semantics, or other automated-production rules from the user request alone when the applicable Canonical Rules have not been loaded.

If GitHub is unavailable, inaccessible, or the required Canonical Rules cannot be verified, the correct outcome is `ENTRY_GATE_BLOCKED`, not fallback image generation.

This is a Producer Runtime precondition. GitHub remains a reference and persistence database and does not itself grant or deny runtime permission.

