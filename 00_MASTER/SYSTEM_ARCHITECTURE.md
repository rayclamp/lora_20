# SYSTEM_ARCHITECTURE.md

The repository is the project's **image-production reference and persistence database**, not an execution engine.

## 0.5 Three-Role System Definition — NON-NEGOTIABLE

The entire system is defined by three simple roles:

1. **User — Command Giver**
   - The user gives instructions.

2. **ChatGPT — Operator / Producer**
   - ChatGPT receives the user's instructions.
   - ChatGPT operates the production system and performs production work.
   - ChatGPT reads required reference information from GitHub.
   - ChatGPT writes production results, checkpoints, and records to GitHub.

3. **GitHub — Database**
   - GitHub provides data for ChatGPT to read.
   - GitHub stores data recorded by ChatGPT.
   - GitHub does not independently make decisions, execute commands, operate production, or control ChatGPT.

**Canonical simple rule:**

> **User gives commands → ChatGPT operates / produces → GitHub provides data and records data.**

GitHub is a database/reference repository only. Any Runtime, Producer, Worker, State Machine, Scheduler, Retry, Stop, Recovery, or other execution mechanism is an internal implementation used by ChatGPT to perform the user's instructions; these mechanisms do not give GitHub control authority.

### Control Boundary

A global command such as `/STOP_ALL` is issued by the user to ChatGPT. ChatGPT receives and executes that command. GitHub only records the resulting state when ChatGPT tells it to do so.

A GitHub field or file is never itself a live command. For example, `GLOBAL_STOP=TRUE`, `STATUS=STOPPED`, `TASK_OWNER`, or `LEASE_ID` are records only.


## Session Access Policy

A production Session belongs to the ChatGPT context that created it by default, but Session ownership is not an absolute cross-context prohibition.

- A new ChatGPT context does not automatically discover or operate other Sessions.
- The mere presence of a Session record in GitHub does not make that Session available for automatic takeover.
- If the User explicitly identifies and authorizes a target SESSION_ID, ChatGPT may read that Session's Production Record and operate it according to the User's command.
- SESSION_ID is only an identifier. It is not an access token, lock, lease, or permission credential.
- GitHub does not grant or enforce Session access authority.
- Therefore, /STOP without a target Session applies only to the active/current Session context. A command explicitly naming another Session, such as /STOP <SESSION_ID> or /RESUME <SESSION_ID>, may target that Session when the User has explicitly authorized it.

This policy preserves both default Session isolation and User-authorized cross-Session control.

## Core Architecture

`User → ChatGPT → internal production mechanisms → GitHub`

ChatGPT uses internal production mechanisms as needed to perform the user's command. These may include prompt design, generation execution, task handling, retry handling, stop/resume handling, and checkpointing. They are implementation mechanisms of ChatGPT, not independent top-level system roles.

GitHub provides reusable reference data to ChatGPT and stores durable production records written by ChatGPT.

## Manual Production

`User Command → ChatGPT → Read References → Design Prompt(s) → Return Prompt(s)`

Manual production does not require production-state persistence unless explicitly requested.

## Automated Production

`User Command → ChatGPT → Create Session/Batch → Read References → Design ALL Prompt(s) → Persist Locked Prompt Set → Return Prompt Set → Execute Prompt(s) → Persist Results/Checkpoints → Complete`

The automated workflow has two distinct phases:

### Phase A — Design

1. ChatGPT creates a unique `SESSION_ID` for the current production session.
2. ChatGPT creates a unique `BATCH_ID` within that session.
3. ChatGPT reads the applicable GitHub reference data.
4. ChatGPT designs **all prompts for the requested batch before image generation begins**.
5. ChatGPT records the completed prompt set and associated production data in GitHub.
6. The locked prompt set becomes the stored execution input for that batch.
7. ChatGPT returns the complete prompt set to the user.

### Phase B — Execution

1. ChatGPT executes the stored prompts according to the active production instruction.
2. ChatGPT records task results, errors, retries, interruptions, and checkpoints in the Production Record.
3. If execution is interrupted, ChatGPT uses the persisted Production Record to determine what has already been recorded and what remains.
4. ChatGPT must not redesign a stored locked prompt merely because execution is being resumed.
5. When the batch is complete, ChatGPT records the final completion state.

**Important boundary:** GitHub does not create the Session, start the Batch, execute prompts, decide retries, or resume production. GitHub only stores the identifiers, prompts, states, results, errors, and checkpoints produced by ChatGPT.

## Production Records

Automated production records are stored under:

`PRODUCTION_RECORDS/<PRODUCTION_TYPE>/<SESSION_ID>/<BATCH_ID>/`

The standard record set is:

- `SESSION_CONTRACT.md` — fixed contract and user-requested production parameters.
- `BATCH_RECORD.md` — current batch-level state, counters, checkpoint, and completion summary.
- `TASK_QUEUE.md` — per-task current status and task metadata.
- `PROMPT_SET.md` — complete locked prompts used as the execution input.
- `EXECUTION_LOG.md` — append-only historical record of execution events, errors, retries, stops, recovery, and completion.

The detailed data schema is defined in `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`.

## Strict Boundary

GitHub does **not** control:
- Session creation
- Batch creation
- Worker/runtime lifecycle
- prompt execution gates
- queues
- scheduling
- retries
- stop/resume
- orchestration
- image generation

GitHub **does** provide:
- canonical image-design references
- persisted production records
- checkpoints and historical execution records needed for continuity

Manual and automated production share the same design rules; automation adds image execution and durable production recording.
