# CORE_RULES.md — Cross-System Core Rules

CORE contains only rules shared across production modules.

## 0. GitHub Repository Role — NON-NEGOTIABLE
This repository is the project's image-production reference and persistence database.
GitHub is NOT the production runtime or control system.

## 0.5 Three-Role System Definition — NON-NEGOTIABLE
User gives commands → ChatGPT operates / produces → GitHub provides data and records data.
GitHub stores production information but does not independently execute, schedule, resume, retry, or control production.

GitHub MAY store production records, prompts, completed/pending image records, checkpoints, interruption/recovery information, and execution evidence.
GitHub MUST NOT be treated as a Worker controller, scheduler, queue executor, lifecycle controller, prompt execution gate, generation controller, retry engine, worker pool manager, or runtime orchestrator.

## 0.6 SESSION ACCESS POLICY — NON-NEGOTIABLE
1. ChatGPT MUST create a new SESSION_ID for a new production session.
2. By default, a ChatGPT context operates only its current Session.
3. A new context MUST NOT automatically take over another Session.
4. Explicit User authorization may identify another SESSION_ID.
5. SESSION_ID is an identifier, not an access credential.
6. GitHub does not enforce Session access.
7. Cross-Session operations must be recorded in EXECUTION_LOG.md.

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
10. GitHub reference files define how images should be designed; they do not define GitHub as the mechanism that controls Workers.
11. Automated production may write durable production/checkpoint/execution evidence to GitHub when required for interruption recovery.
12. Manual production does not require automated production persistence.
13. An image result alone is never sufficient evidence of Task success.
14. A Task may be SUCCESS only after the applicable Prompt Binding, generation-call, result-count, and result-provenance gates pass.
15. If required execution evidence is unavailable, record the affected evidence as UNVERIFIED; do not invent evidence or success.
16. One Task equals the output count specified by its contract; wallpaper production defaults to exactly one independent image.
17. Each locked Prompt may be submitted to image generation exactly once. Image QA failure, generation failure, service failure, quota exhaustion, or interruption never authorizes a second generation call for the same Prompt/version.
18. Only verified AI-policy/safety/content-policy interruptions may increment the per-Prompt Policy Interruption Counter. After three consecutive countable Policy/Safety interruptions across explicit user-authorized continuations, the Prompt is terminally skipped. Non-policy system/resource/GitHub errors do not count.
19. Automated production must persist the state/evidence produced by each discrete production step to GitHub and verify the write before proceeding to the next step. Failure to read/write/verify required current GitHub state is a hard stop.
20. The generation handoff is immutable: LOCKED_PROMPT → EXACT_READBACK → EXACT_BINDING → GENERATION_INPUT_FROZEN → GENERATION_CALL. GENERATION_INPUT_FROZEN must be text-for-text identical to the current locked prompt and is the only Prompt Input permitted for the generation call. No command, request, reference, rule, runtime context, redesign, summary, translation, reconstruction, addition, removal, or substitution may replace or modify it after freezing.

## 2. Required Shared Documents
- DRAWING_INSTRUCTIONS.md
- ANATOMY_STABILITY.md
- IMAGE_GENERATION_SAFETY_SPEC.md
- GENERATION_WORKER_PROTOCOL.md

## 3.1 /START_AUTO ENTRY GATE — NON-NEGOTIABLE
1. Any automated production initiated by /START_AUTO MUST first load the applicable current GitHub Canonical Rules before any image-generation call.
2. Successful Canonical Rule Loading is a mandatory Production Entry Gate prerequisite.
3. If the Producer cannot access, load, or verify the applicable Canonical Rules, it MUST enter ENTRY_GATE_BLOCKED and MUST NOT call the image-generation interface.
4. The Producer MUST NOT fall back to ordinary image-generation behavior merely because GitHub is unavailable.
5. The absence of Canonical Rule Loading evidence MUST be treated as failure of the Production Entry Gate, not as permission to proceed.
6. This is a Producer Runtime precondition. It does NOT make GitHub a runtime controller, scheduler, execution gate, or generation controller.
7. Manual image requests that are not initiated through /START_AUTO remain governed by the applicable manual-production workflow.


## 3.2 /RESUME_AUTO ENTRY GATE — NON-NEGOTIABLE

Any automated production initiated by /RESUME_AUTO MUST re-verify the current GitHub database connection and reload the applicable current Canonical Rules before resuming Generation.

1. Existing Session/Batch records may be used only after the current GitHub connection is verified.
2. The Producer MUST reload and verify the applicable current Canonical Rules before continuing.
3. If connection verification or rule loading fails, resume is BLOCKED and no Generation call may be made.
4. Resume MUST use the existing SESSION_ID, BATCH_ID, TASK_QUEUE, and LOCKED PROMPT_SET.
5. Resume MUST NOT create a replacement Session/Batch or redesign a locked prompt.
6. Resume selects the first Task that has not reached valid terminal SUCCESS.
7. This gate is a Producer Runtime precondition; it does not make GitHub a runtime controller.
