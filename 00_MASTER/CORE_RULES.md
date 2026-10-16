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
4. Production SUCCESS means at least one image was confirmed received and the result was durably recorded against its Task. Each such Task counts as one successful Task output, regardless of prompt compliance or actual returned-file count; record actual file count separately. SUCCESS does not imply visual QA acceptance.
5. Generation Workers do not perform visual QA or decide whether an image complies with its prompt. QA is a separate downstream responsibility.
6. UNKNOWN state must be recovered from authoritative stored information, not guessed.
7. Current GitHub reference content is authoritative for image-design rules.
8. User intent cannot silently activate a paused module.
9. New modules load CORE rather than copying another module's workflow.
10. GitHub reference files define how images should be designed; they do not define GitHub as the mechanism that controls Workers.
11. Automated production may write durable production/checkpoint/execution evidence to GitHub when required for interruption recovery.
12. Manual production does not require automated production persistence.
13. A confirmed image receipt plus durable result recording against the Task is sufficient for production success; QA is separate.
14. A Task may be SUCCESS once at least one image is confirmed received and durably recorded against that Task. Output-count equality and visual compliance are not success gates; actual returned-file count is recorded separately.
15. If required execution evidence is unavailable, record the affected evidence as UNVERIFIED; do not invent evidence or success.
16. One Task represents one planned image output. Once one or more image files are confirmed received for that Task, count exactly one successful Task output; record the actual number of returned files separately. Wallpaper prompts are designed for one independent image, but multiple returned files do not increase the Task output count.
17. Every confirmed received image must be counted and recorded. The Producer reports observable production facts only: image received/count/result binding, or no image plus the confirmed failure reason. The Producer MUST NOT compare the submitted payload against the locked prompt or judge visual compliance. `PROMPT_MATCH_STATUS` is not a Producer-assessed field; leave it `NOT_ASSESSED` or unset. QA owns visual compliance and image-quality decisions.
18. A production Batch closes when every required Task has a recorded terminal outcome, whether successful or unsuccessful. Do not keep producing or leave the Batch open solely because a result is mismatched or unsuccessful.
19. The design stage validates and locks each Prompt. In production, the only pre-generation check is whether the complete assigned locked Prompt was successfully read. Do not revalidate its content, format, semantics, correctness, quality, or task binding.
20. Immediately after a successful full-prompt read, invoke the generation interface using the locked Prompt as the authoritative production specification and intended input. Do not insert intermediate analysis, validation, prompt display, transformation, or unrelated operations. The locked Prompt must not be deliberately redesigned or casually rewritten by the Producer, but the interface may impose input or transport limitations and may not expose the exact payload it receives. Byte-for-byte transport fidelity is NOT a production-success requirement. Do not block or stop a Task solely because the interface cannot accept, transmit, or verify the entire prompt verbatim in one call. If the complete source Prompt itself cannot be read, do not guess or reconstruct it; record the read failure and stop that Task. Missing optional hidden-payload telemetry is not a generation gate.
21. The Producer's only generation-result judgment is whether an image result was actually received. Record the observed result and any confirmed no-image failure reason. Do not perform QA or compare the image with the Prompt. Retry only a confirmed no-image generation failure using the same unchanged locked Prompt for the same Task. Stop that Task after three consecutive confirmed no-image generation failures in total, counting the initial generation call; do not interpret this as three separate Tasks failing, and do not count non-generation errors toward this limit. Never retry after image receipt or while the outcome is unknown.
22. Keep generation outcome separate from GitHub persistence outcome. A confirmed image receipt must remain recorded as received even if writing the record fails; record persistence failure separately and do not trigger another generation call.
23. This minimal prompt-to-generation rule overrides conflicting runtime wording in older documents and historical Session/Batch records. Historical records remain immutable evidence; they do not add new prompt-validation gates to current production.

## 2. Required Shared Documents
- DRAWING_INSTRUCTIONS.md
- ANATOMY_STABILITY.md
- IMAGE_GENERATION_SAFETY_SPEC.md
- GENERATION_WORKER_PROTOCOL.md

## 3.1 WALLPAPER COMMAND ENTRY AND CONTINUATION GATE — NON-NEGOTIABLE

For `MODULE=UNIVERSAL_WALLPAPER` or `MODULE=FESTIVAL_WALLPAPER`, the only current wallpaper command pair is defined in `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`:

1. `/WALLPAPER_CONSOLE` creates a new Session/Batch, designs all prompts, writes and reads back the required records, and locks the Prompt Set. It MUST NOT generate images.
2. `/WALLPAPER_PRODUCE` executes only an existing locked Batch. Before module-specific routing or Batch reads, it MUST receive the user's explicit `MODULE`, `SESSION_ID`, and `BATCH_ID`.
3. The Producer MUST verify that all three supplied values match the authoritative GitHub Batch path and records. Missing, invalid, unreadable, or mismatched values block execution; do not infer or substitute identifiers.
4. Every operation MUST load the current applicable canonical rules and verify required GitHub reads. Required reads/writes/readbacks that fail must stop the affected operation; never fall back to memory, cache, guesses, or generic image generation.
5. Continuing an interrupted Batch uses `/WALLPAPER_PRODUCE` with the same `MODULE`, `SESSION_ID`, and `BATCH_ID`. It must not create a replacement Batch or redesign locked prompts.
6. These wallpaper rules do not rename or redefine the separate `LORA_IMAGE` design workflow.

## 3.2 TASK-LOCAL RECOVERY AND BLOCKING SCOPE — NON-NEGOTIABLE

1. A blocking condition MUST be scoped to the smallest affected unit: evidence field, Task, or Batch.
2. A Task-local state conflict, missing Task-local readback, or unresolved result MUST NOT automatically stop unrelated Tasks. Isolate the affected Task, preserve its state, and evaluate the next Task independently.
3. For an eligible Task, read its assigned authoritative locked Prompt. The only prompt-related pre-generation check is whether the complete Prompt was successfully read; do not add a separate content, metadata, or Task-binding validation gate.
4. An unresolved generation outcome remains unresolved for that Task: do not retry or reuse the same locked Prompt. This does not by itself forbid independent later Tasks from running.
5. Stop the entire Batch only when a verified issue affects Batch-wide identity/contract, global prompt-manifest integrity or per-Task prompt-file mapping, or result attribution in a way that cannot safely be isolated to a Task.
6. Visual-quality defects or visual differences from a Prompt are QA observations, not proof of generation-input mismatch. QA findings MUST NOT automatically change execution-integrity status or trigger regeneration.
7. Missing nonessential delivery telemetry alone is NOT a blocking condition. Record NOT_EXPOSED/UNVERIFIED honestly.
8. The three-failure limit applies only to consecutive, confirmed no-image outcomes from actual image-generation attempts for the same Task, counting the initial call. GitHub read/write/readback failures, prompt-file read failures, task-status/metadata errors, and other non-generation errors MUST NOT increment this counter. Handle those as operation/Task-local errors; do not lock, retire, or skip the next independent Task merely because an earlier Task had a non-generation error. Continue only when the next Task's own authoritative prompt and required inputs are readable; pause the Batch only for a verified Batch-wide access/integrity problem that prevents safe independent execution.

## 3.4 MULTI-WORKER HANDOFF AND FAILURE ISOLATION — NON-NEGOTIABLE

1. A Worker MUST base execution decisions on the current authoritative Task record, per-Task prompt file (or documented legacy prompt source for an existing Batch), and Batch records and directly available result evidence, not solely on a previous Worker's narrative, completion message, or unverified status claim.
2. A missing, late, incomplete, or contradictory report from one Worker MUST be scoped to the affected Task/result unless verified evidence shows a Batch-wide identity, contract, Prompt Set, or attribution conflict.
3. Before prompt reading, select the next Task from the existing authoritative Session/Batch records. Once that Task's complete locked Prompt is successfully read, call the generation tool immediately; do not insert a separate Task-binding, metadata, or prerequisite validation step between reading and generation.
4. Do not infer success from missing reports. Preserve unresolved Tasks as unresolved; do not retry or reuse a consumed/retired Prompt when the previous outcome is unknown.
5. A missing field blocks execution only when that field is an explicit necessary prerequisite for the specific operation. Optional telemetry, nonessential narrative, or unrelated Task outcome fields MUST NOT become implicit global gates.
6. Batch-wide stop is reserved for a verified conflict that makes the identity, contract, prompt assignment, or safe result attribution of other Tasks unreliable and cannot be isolated.
7. This rule separates continuity from acceptance: continuing independent work does not mark the unresolved Task successful, repair its record, or make its image eligible for LoRA training.

## 2.1 SMALL ACCESSORY RESTRICTION — NON-NEGOTIABLE
Unless the user explicitly requests otherwise, do not add tiny accessories or decorative objects that are too small to render clearly and are likely to become dirt-like marks, dark specks, stains, or anatomical artifacts. This includes rings and other finger jewelry. Apply the detailed shared rule in DRAWING_INSTRUCTIONS.md. Modules may impose stricter restrictions but must not weaken this core default.

## 1.1 PRODUCER NO-QA BOUNDARY — CURRENT OVERRIDING RULE

During production, the Producer MUST NOT perform any post-generation QA or image/prompt comparison. This prohibition includes visually inspecting the generated image to judge prompt compliance, image quality, anatomy, identity, composition, style, dataset suitability, or whether the result should be accepted.

The Producer's post-generation duties are limited to observable production facts: confirm whether an image result was received; record the number of images actually returned; bind the result to the correct Task and generation event when possible; consume and retire the prompt after any confirmed image receipt; update production records and verify the write.

Any confirmed image receipt counts as exactly one successfully produced Task output, regardless of visual compliance or how many image files the generator returns for that Task. Record the actual returned image count separately. QA is a separate downstream process and must never change production counts, production success, prompt-consumption state, or trigger regeneration.

This rule overrides any older wording in CORE that could be interpreted as requiring the Producer to inspect, compare, accept, reject, or QA a generated image.


## 3.5 WALLPAPER COMMAND ENTRY GATE — NON-NEGOTIABLE

For `MODULE=UNIVERSAL_WALLPAPER` or `MODULE=FESTIVAL_WALLPAPER`, use the unified wallpaper command contract in `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`:

- `/WALLPAPER_CONSOLE` is the design-and-lock command. It must load the current applicable canonical rules, create a new Session/Batch, persist and read back all required prompt records, and lock the Prompt Set. It must not call the image-generation tool.
- `/WALLPAPER_PRODUCE` is the production command. It requires the user's explicit `MODULE`, `SESSION_ID`, and `BATCH_ID`, verifies all three against GitHub, reloads applicable rules and records, and executes only the existing locked prompts.
- Both commands support Universal and Festival Wallpaper; `MODULE` determines module-specific rules and paths.
- Wallpaper design must not request or require a reference image. A separately supplied production-conversation reference, if any, is handled only under the active wallpaper module's Reference Policy.
- Neither wallpaper command may load LoRA-specific rules or assets.
- If GitHub access or any required canonical read/write/readback fails, stop and report the actual failure. Do not fall back to memory, cache, guesses, or ordinary text-to-image behavior.
