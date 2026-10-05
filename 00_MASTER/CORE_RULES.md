# CORE_RULES.md — Cross-System Core Rules

CORE contains only rules shared across production modules.

## 0. GitHub Repository Role — NON-NEGOTIABLE

This repository is the project's **image-production reference and persistence database**.

GitHub is **NOT** the production runtime or control system.

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

GitHub MUST NOT be used as:
- Worker controller
- Task scheduler
- Queue executor
- Worker lifecycle controller
- Prompt execution gate
- Generation controller
- Retry engine
- Worker pool manager
- Runtime orchestrator

GitHub **MAY** store production information required for durable continuity of automated production, including:
- production records
- designed prompts
- completed-image records
- pending-image records
- checkpoints
- interruption/recovery information

This persistence data is storage only. GitHub does not independently execute, schedule, resume, retry, or control the Worker.

### Production Modes

**Manual production**
- Read GitHub references.
- Design the requested images.
- Return FINAL PROMPTs.
- No production checkpoint or runtime record is required unless explicitly requested.

**Automated production**
- Uses the same image-design process as manual production.
- Executes the designed FINAL PROMPTs through the image-generation system.
- MUST persist sufficient production information to GitHub so an interrupted production can later determine what has already been completed and continue with the remaining images.
- Persistence must not change GitHub into an execution controller.

The canonical conceptual flow is:

`User Production Command → Worker → GitHub Reference Data → Image Design → FINAL PROMPT → Image Generator`

For automated production, durable recording is added:

`Automated Production → GitHub Production Record / Checkpoint`

The distinction is:

**GitHub stores information; the Worker/runtime performs actions.**

## 1. Core Rules

1. CORE hard rules cannot be weakened by a module.
2. Modules may add stricter rules.
3. Module-specific identity, style, dataset, cultural, and QA rules remain inside their module.
4. Generation success does not imply visual QA acceptance.
5. Generation Workers do not perform final QA unless explicitly instructed by the applicable QA workflow.
6. UNKNOWN state must be recovered from authoritative stored information, not guessed.
7. Current GitHub reference content is authoritative for image-design rules.
8. User intent cannot silently activate a paused module.
9. New modules load CORE rather than copying another module's workflow.
10. GitHub reference files define **how images should be designed**; they do not define GitHub as the mechanism that **controls Workers**.
11. Automated production may write durable production/checkpoint information to GitHub when required for interruption recovery.
12. Manual production does not require automated production persistence.

## 2. Required Shared Documents

- DRAWING_INSTRUCTIONS.md
- ANATOMY_STABILITY.md
- IMAGE_GENERATION_SAFETY_SPEC.md
- GENERATION_WORKER_PROTOCOL.md
