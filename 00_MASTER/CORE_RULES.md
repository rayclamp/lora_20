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
4. An observed image receipt is a generation fact, NOT itself formal `TASK_STATUS=SUCCESS`. Formal SUCCESS requires one or more received image files correctly attributed to the Task, the required result event and Task state durably written to GitHub, AND the write readback-verified. Count the Task once in `COMPLETED_COUNT` only then. Record actual returned-file count separately; output-count equality, visual compliance, and QA PASS are not SUCCESS gates.
5. Generation Workers do not perform visual QA or decide whether an image complies with its prompt. QA is a separate downstream responsibility.
6. UNKNOWN state must be recovered from authoritative stored information, not guessed.
7. Current GitHub reference content is authoritative for image-design rules.
8. User intent cannot silently activate a paused module.
9. New modules load CORE rather than copying another module's workflow.
10. GitHub reference files define how images should be designed; they do not define GitHub as the mechanism that controls Workers.
11. Automated production may write durable production/checkpoint/execution evidence to GitHub when required for interruption recovery.
12. Manual production does not require automated production persistence.
13. Confirmed image receipt PLUS correct Task attribution AND verified durable result-event/Task-state write/readback are sufficient for formal production SUCCESS; mere receipt, an unverified GitHub write, or a Producer narrative is not. QA remains separate.
14. A Task may be `SUCCESS` only after confirmed image receipt, correct Task/result attribution, and required persistence with successful readback. Until then keep known receipt as `RESULT_RECEIVED_UNVERIFIED` or another applicable Schema recovery state, never count a formal SUCCESS or regenerate. Actual returned files are recorded separately regardless of expected count or visual compliance.
15. If REQUIRED evidence or attribution is unavailable, preserve the affected result as UNVERIFIED/unresolved and do not invent formal SUCCESS. Missing OPTIONAL execution-integrity or hidden-transport telemetry alone does not invalidate an otherwise verified SUCCESS; treat evidence fields separately from Task status under `PRODUCTION_RECORD_SCHEMA.md`.
16. One Task represents one PLANNED image output. A confirmed image receipt permanently prohibits generation again for that Task, but does NOT increment `COMPLETED_COUNT` until correct attribution and durable record/readback are verified. Count the Task at most once, and record every actually received image file separately even if multiple files are returned. Wallpaper plans one independent image; new `RESULT_COUNT_MISMATCH` statuses are prohibited.
17. Every confirmed image receipt and actual returned-file count must be preserved as OBSERVABLE facts, even when the official record has not yet been saved; do not falsely claim durable recording or verified counters. Record image received / confirmed no image / UNKNOWN, Task/result attribution and persistence/readback separately. The Producer MUST NOT compare the submitted payload to the Prompt or inspect visual compliance. Keep `PROMPT_MATCH_STATUS` `NOT_ASSESSED` or unset; QA owns image quality.
18. A Batch is `BATCH_COMPLETED` only after every required Task has a VALID RECORDED TERMINAL outcome, Task/attempt evidence and counters reconcile, and the final completion record is written AND readback-verified. A terminal failed/deferred/blocked Task alone need not keep the Batch open; UNKNOWN, unverified image receipt or unresolved required persistence does. `RESULT_COUNT_MISMATCH` is historical only and cannot be assigned to new results.
19. The design stage validates and locks each Prompt. In production, the Producer reads the complete assigned locked Prompt and does not repeat design-stage content validation.

20. FULL_LOCKED_PROMPT is the default generation input.

    If a concrete interface input limitation prevents
    submission of the complete Prompt, the Producer may
    prepare one AUTHORIZED_CONDENSED_PROMPT for that Task.

    Condensation must preserve the Task's essential
    drawing requirements, restrictions, exceptions,
    priorities, identifiers, output format, reference
    requirements, and intended meaning.

    The canonical locked Prompt must never be modified.

    The exact condensed execution input must be preserved
    after the first actual generation call.

    Save it as:
    EXECUTION_INPUTS/<TASK_ID>.md

    Read back and verify the saved content.

    Only one fixed condensed execution input may exist
    for the same Task.

    All subsequent retries must use that exact same
    condensed input. Never overwrite, rewrite, or
    regenerate it.

    Missing hidden transport telemetry is not a
    generation gate.

21. Retry only an actual generation call with a confirmed
    no-image outcome.

    Every retry must use the same original locked Prompt
    reference and the same fixed execution input.

    Three consecutive confirmed no-image generation
    calls in total, including the initial call, terminate
    the Task's retry eligibility.

    A temporary pre-call submission failure does not
    consume a generation attempt.

    If execution-input persistence fails after the first
    call, isolate the affected Task and preserve the
    exact input through a complete safe recovery
    checkpoint.

    Do not retry until the same execution input can
    be recovered and verified.

    Never retry after image receipt or UNKNOWN outcome.

22. Keep three facts separate:
    (1) observed image/no-image/UNKNOWN outcome;
    (2) correct Task/result attribution;
    (3) actual GitHub write/readback status.

    A confirmed receipt remains an observed fact even
    when GitHub recording fails.

    Never regenerate to repair persistence.

    Recover persistence using the original result and
    execution evidence.

23. This minimal prompt-to-generation rule overrides
    conflicting older runtime wording. Historical records
    remain immutable.

## 2. Required Shared Documents
- DRAWING_INSTRUCTIONS.md
- ANATOMY_STABILITY.md
- IMAGE_GENERATION_SAFETY_SPEC.md
- GENERATION_WORKER_PROTOCOL.md

## 3.1 WALLPAPER COMMAND ENTRY AND CONTINUATION GATE — NON-NEGOTIABLE

This is the SINGLE CORE wallpaper entry/continuation rule. `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md` remains the detailed authoritative command contract. Do not maintain a second competing entry definition in CORE.

1. For `MODULE=UNIVERSAL_WALLPAPER` or `MODULE=FESTIVAL_WALLPAPER`, `/WALLPAPER_CONSOLE` is the only design/lock command: load current applicable canonical rules, create the new authorized Session/Batch, design all prompts, persist and readback-verify per-Task Prompt files and Batch records, and lock the verified Prompt Set. It MUST NOT generate.
2. `/WALLPAPER_PRODUCE` is the only wallpaper execution/continuation command and operates ONLY on an existing locked Batch. BEFORE module-specific routing or Batch reads, the user MUST explicitly provide `MODULE`, `SESSION_ID`, and `BATCH_ID`. Validate all three against the authoritative GitHub Batch path/records. Missing, invalid, mismatched or unreadable identity blocks the affected execution; do not infer or substitute IDs.
3. Both wallpaper commands serve both modules; `MODULE` selects the correct specialized rules, paths and reference policy. Neither may load LoRA-specific rules/assets. These requirements do not rename, import, or replace the separate LoRA design and production workflow.
4. Wallpaper DESIGN must NOT require or request a reference-image input. A reference image supplied separately in the PRODUCTION conversation is handled only under the active wallpaper module's Reference Policy; never silently substitute another module's image.
5. Continuation reuses the same explicit identifiers and immutable locked Task prompts. No replacement Session/Batch, redesign, implicit migration of legacy records or ordinary text-to-image fallback. Reload the current authoritative records and applicable canonical rules before choosing a Task.
6. Verify required GitHub reads/writes/readbacks and report their actual failures; never substitute stale memory, cache, guesses or a generic generation call. Stop the affected operation/Task as needed. A Task-local failure must NOT automatically lock independent Tasks, but the durable outcome/readback or verified safe recovery checkpoint gate in Section 3.2 MUST be met before progression. Stop the Batch only for a verified non-isolatable shared access, mapping, attribution or persistence-safety issue.
## 3.2 TASK-LOCAL RECOVERY AND BLOCKING SCOPE — NON-NEGOTIABLE

1. A blocking condition MUST be scoped to the smallest affected unit: evidence field, Task, or Batch.
2. Isolate a Task-local conflict, missing readback, or unresolved result; this must not automatically invalidate unrelated Tasks. BEFORE progressing, durably preserve/readback-verify the prior known attempt's result and attribution or a safe explicit recovery checkpoint for its persistence failure. If a known receipt cannot be preserved or verified, pause progression for persistence recovery. A narrative alone is not durable evidence.
3. For an eligible Task, read its assigned authoritative
   locked Prompt.

   FULL_LOCKED_PROMPT is the default generation input.

   If a concrete interface input limitation prevents
   full submission, prepare one authorized condensed
   execution input while preserving the Task's essential
   drawing requirements.

   After the first actual generation call, save the
   exact condensed input to its independent execution
   record and verify the saved content.

   Do not add separate content, metadata, semantic,
   format, or Task-binding validation gates.
4. An UNKNOWN result remains unresolved for that Task: do not retry it. A confirmed image receipt, even if its record is not yet verified, also permanently prohibits regeneration. Unrelated Tasks may continue only AFTER the prior attempt's observed outcome and attribution have been durably preserved/readback-verified or a safe recovery checkpoint has been recorded and readback-verified, and their own current inputs are readable.
5. Batch-wide stopping requires a verified NON-ISOLATABLE shared identity/contract, manifest/Task mapping, result attribution, or persistence-safety defect. A Task-local failure may temporarily pause progression until a safe record/checkpoint is verified; it is not by itself a Batch-wide failure.
6. Visual-quality defects or visual differences from a Prompt are QA observations, not proof of generation-input mismatch. QA findings MUST NOT automatically change execution-integrity status or trigger regeneration.
7. Missing nonessential delivery telemetry alone is NOT a blocking condition. Record NOT_EXPOSED/UNVERIFIED honestly.
8. The retry limit is three consecutive confirmed
   no-image generation attempts in total for the same
   Task, including the initial call.

   All retries must use the same fixed execution input.

   A temporary pre-call submission interruption does
   not count as a generation failure.

   An execution-input persistence failure must be
   isolated and safely recovered before another retry.

   Non-generation errors never increment the
   generation-failure count.
9. PAUSED Task handling:

   PAUSED is a non-terminal state.

   Use PAUSED when:
   - the exact execution input cannot temporarily
     be submitted before a generation call;
   - a confirmed no-image Task cannot safely retry
     because its fixed execution input requires
     persistence recovery.

   Preserve all previous generation attempts,
   confirmed no-image counts, remaining retry budget,
   and the exact execution input.

   Do not use PAUSED for:
   - confirmed image receipts;
   - UNKNOWN generation outcomes;
   - exhausted retry budgets;
   - safety/policy prohibitions.

   Resume only with the same fixed execution input.

   PAUSED Tasks prevent Batch completion.

## 3.3 Reserved — No Active Rule

## 3.4 MULTI-WORKER HANDOFF AND FAILURE ISOLATION — NON-NEGOTIABLE

1. A Worker MUST base execution decisions on the current authoritative Task record, per-Task prompt file (or documented legacy prompt source for an existing Batch), and Batch records and directly available result evidence, not solely on a previous Worker's narrative, completion message, or unverified status claim.
2. A missing, late, incomplete, or contradictory Worker report is Task-local unless a verified non-isolatable shared identity/contract/Prompt Set/attribution/persistence-safety defect exists. Before continuing independent work, verify durable preservation/readback of known prior outcomes or an explicit safe recovery checkpoint. A report alone is not evidence of image receipt.
3. BEFORE selecting the next Task, satisfy the
   preceding attempt's durable-result/readback or
   verified safe-recovery checkpoint gate.

   Then select the eligible Task using current
   authoritative Session/Batch records.

   Read its complete assigned locked Prompt.

   Use the complete Prompt directly unless a concrete
   interface limitation requires authorized condensation.

   After the first actual generation call, preserve
   the exact condensed input in its independent
   execution record.

   Do not insert additional content validation,
   metadata checks, Task-binding checks, or unrelated
   operations into the generation path.
4. Do not infer success from missing reports. Preserve unresolved Tasks as unresolved; do not retry or reuse a consumed/retired Prompt when the previous outcome is unknown.
5. A missing field blocks execution only when that field is an explicit necessary prerequisite for the specific operation. Optional telemetry, nonessential narrative, or unrelated Task outcome fields MUST NOT become implicit global gates.
6. Batch-wide stop is reserved for a verified conflict that makes the identity, contract, prompt assignment, or safe result attribution of other Tasks unreliable and cannot be isolated.
7. Continuing independent work does not resolve the isolated Task, imply a missing event was saved, establish formal SUCCESS, or qualify an image for LoRA training. Only verified receipt plus correct attribution and durable result/Task-state readback may increment `COMPLETED_COUNT`; reconcile any unresolved Task independently.
8. Safe execution-input recovery:

   If execution-input persistence fails, isolate
   the affected Task.

   A complete recovery checkpoint must preserve:
   - exact execution-input text;
   - original Prompt ID/version;
   - Task ID and Batch ID;
   - generation input mode;
   - all known generation attempts and outcomes;
   - remaining retry budget;
   - prompt-consumption state;
   - known result attribution and persistence state.

   The checkpoint becomes authoritative only after
   successful GitHub write and readback verification.

   Independent Tasks may continue only when the
   affected Task's complete recovery state is verified
   and their own authoritative inputs remain readable.

   Never reconstruct the fixed execution input from
   memory or replace it with a newly condensed version.

## 3.5 SMALL ACCESSORY RESTRICTION — NON-NEGOTIABLE
Unless the user explicitly requests otherwise, do not add tiny accessories or decorative objects that are too small to render clearly and are likely to become dirt-like marks, dark specks, stains, or anatomical artifacts. This includes rings and other finger jewelry. Apply the detailed shared rule in DRAWING_INSTRUCTIONS.md. Modules may impose stricter restrictions but must not weaken this core default.

## 3.6 PRODUCER NO-QA BOUNDARY — CURRENT OVERRIDING RULE

During production, the Producer MUST NOT perform any post-generation QA or image/prompt comparison. This prohibition includes visually inspecting the generated image to judge prompt compliance, image quality, anatomy, identity, composition, style, dataset suitability, or whether the result should be accepted.

The Producer's post-generation duties are limited to observable production facts: confirm whether an image result was received; record the number of images actually returned; bind the result to the correct Task and generation event when possible; consume and retire the prompt after any confirmed image receipt; update production records and verify the write.

Any confirmed image receipt consumes the Prompt and forbids generation again for the Task, but NOT automatically formal SUCCESS. Verify correct Task attribution and durable result-event/Task-state write/readback before `TASK_STATUS=SUCCESS` and one `COMPLETED_COUNT` increment. Preserve received-but-unverified facts as unresolved, never regenerate; record actual file count separately. QA is independent, currently `PAUSED`, and cannot change production success, counts or retry eligibility.

This rule overrides any older wording in CORE that could be interpreted as requiring the Producer to inspect, compare, accept, reject, or QA a generated image.
