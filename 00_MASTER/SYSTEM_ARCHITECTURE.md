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

## Core Architecture

`User Production Command → Worker → GitHub References → Prompt Design → Image Generation`

GitHub stores reusable reference material.

For automated production, GitHub may also store durable production records and checkpoints so interrupted work can be recovered. These records are storage/persistence only; GitHub does not execute, schedule, resume, retry, or orchestrate the Worker.

## Manual Production

`User Command → Worker → Read References → Design Prompt(s) → Return Prompt(s)`

Manual production does not require production-state persistence unless explicitly requested.

## Automated Production

`User Command → Worker → Read References → Design Prompt(s) → Image Generation → Persist Production Record / Checkpoint`

If production is interrupted, the Worker/runtime reads the persisted production information and continues the remaining work.

## Strict Boundary

GitHub does **not** control:
- Worker lifecycle
- repository discovery when the repository is explicitly supplied
- prompt execution gates
- queues
- scheduling
- retries
- orchestration

GitHub **does** provide:
- canonical image-design references
- automated-production persistence/checkpoint data needed for recovery

Manual and automated production share the same design process; automation adds image execution and durable production recording.
