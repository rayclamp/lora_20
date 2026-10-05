# CORE_RULES.md — Cross-System Core Rules

CORE contains only rules shared across production modules.

## 0. GitHub Repository Role — NON-NEGOTIABLE

This repository is a **reference/data database for image production**.

GitHub is **NOT** the production runtime or control system.

GitHub MUST NOT be used as:
- Worker controller
- Task scheduler
- Queue
- Session manager
- Runtime state machine
- Prompt execution gate
- Generation controller
- Retry engine
- Worker pool manager
- Production persistence/state system

The Worker reads the required GitHub reference data, designs the requested image(s), and produces the final prompt(s). Image generation is performed by the image-generation system, not controlled by GitHub.

The canonical production flow is:

`User Production Command → Worker → GitHub Reference Data → Image Design → FINAL PROMPT → Image Generator`

GitHub is therefore **read-only reference data during production**, unless the user explicitly requests a repository maintenance/documentation change.

Production results, runtime state, tasks, queues, sessions, locks, retries, and worker status MUST NOT be written back to GitHub merely because an image-production request was executed.

## 1. Core Rules

1. CORE hard rules cannot be weakened by a module.
2. Modules may add stricter rules.
3. Module-specific identity, style, dataset, cultural, and QA rules remain inside their module.
4. Generation success does not imply visual QA acceptance.
5. Generation Workers do not perform final QA unless explicitly instructed by the applicable QA workflow.
6. UNKNOWN state must be recovered, not guessed.
7. Current GitHub reference content is authoritative for image-design rules.
8. User intent cannot silently activate a paused module.
9. New modules load CORE rather than copying another module's workflow.
10. GitHub reference files describe **how images should be designed**; they do not describe **how GitHub should control Workers**.

## 2. Required Shared Documents

- DRAWING_INSTRUCTIONS.md
- ANATOMY_STABILITY.md
- IMAGE_GENERATION_SAFETY_SPEC.md
- GENERATION_WORKER_PROTOCOL.md
