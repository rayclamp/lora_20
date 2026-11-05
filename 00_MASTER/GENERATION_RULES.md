# GENERATION_RULES.md — Shared Generation Constraints

1. Output format is defined by the active task.
2. Character identity and reference are defined by the active module.
3. Never substitute a reference from another module.
4. Maintain natural human proportions.
5. Prefer stable hand/foot actions over unnecessary complexity.
6. Keep important anatomy readable against the background.
7. Held objects and wearables must have coherent physical connections.
8. FULL-BODY does not mean distant framing.
9. Do not add animals or pets unless the active task explicitly permits them.
10. Do not import props, accessories, or style rules from another module.
11. Module-specific dataset rules remain inside the module.
12. Generation Workers do not self-QA or judge visual prompt compliance.
13. A confirmed image receipt is an observable **generation result**, not immediate formal `TASK_STATUS=SUCCESS`. Formal Task SUCCESS requires at least one image actually received, verified attribution to the correct Task, and the required result event and Task state **durably written to GitHub and readback-verified**. Increment `COMPLETED_COUNT` once per Task only after those conditions are met. Record actual file count separately; neither output-count equality nor visual QA acceptance is a production-success condition.
14. One Task is one **planned** image output; wallpaper prompts plan one independent image. Any confirmed receipt immediately consumes the Task's locked Prompt and forbids further generation, but does not count as a formal successful Task until correct Task attribution and durable record/readback are verified. If multiple files were received, preserve their actual count and available result references separately in `ACTUAL_IMAGE_COUNT`; multiple files never become multiple successful Tasks. Do not assign new `RESULT_COUNT_MISMATCH` dispositions solely for a returned-file-count difference.
15. Canonical locked Prompts are immutable during
    generation, retry, and resume.

    An authorized condensed execution input is a
    separate operational derivative. It must never
    modify or replace the canonical locked Prompt.

16. The design stage validates and locks each Prompt.

    In production, the Producer reads the complete
    assigned locked Prompt.

    FULL_LOCKED_PROMPT is the default generation input.

    The Producer must not repeat design-stage content,
    format, semantic, correctness, quality, or Task-binding
    validation.

17. FULL_LOCKED_PROMPT is the default generation input.

    If a concrete interface input limitation prevents
    submission of the complete Prompt, the Producer may
    prepare one AUTHORIZED_CONDENSED_PROMPT.

    Condensation must preserve the Task's essential
    drawing requirements, restrictions, exceptions,
    priorities, identifiers, output format, reference
    requirements, and intended meaning.

    The canonical locked Prompt must never be modified.

    After the first actual generation call, save the
    exact condensed input separately:

    EXECUTION_INPUTS/<TASK_ID>.md

    Read back and verify the saved content.

    Only one fixed condensed execution input may exist
    for the same Task.

    Every subsequent retry must use that exact same
    condensed input.

    Never overwrite, rewrite, or regenerate it.

    If execution-input persistence fails, isolate the
    affected Task and preserve the exact input through
    a complete safe recovery checkpoint.

    Missing hidden transport telemetry is not a
    generation gate.

18. The Producer MUST NOT revalidate the locked Prompt's
    content, format, semantics, correctness, quality,
    or Task binding.

    If the complete Prompt was not successfully read,
    do not guess or reconstruct it.

    Record the read failure and stop that Task.

    Authorized execution-input condensation under
    Rule 17 is not a redesign or replacement of the
    canonical locked Prompt.
19. The Producer's only **generation-result** judgment is direct observation: image received, confirmed no image, or UNKNOWN. Record the actual returned-file count, available references, confirmed no-image reason, Task/result attribution, and persistence/readback evidence as separate facts. Do not infer receipt from a tool call, prior report, expectation, or unverified status field. A missing optional integrity/transport field alone is not a reason to downgrade an otherwise verified formal SUCCESS.
20. Do not inspect the image or compare it with the Prompt. QA owns visual quality and prompt compliance.
21. Retry only an actual generation call with a
    confirmed no-image outcome.

    Every retry must use the same unchanged locked
    Prompt reference and the same fixed execution input.

    Stop the Task after three consecutive confirmed
    no-image generation failures in total, including
    the initial generation call.

    A temporary pre-call submission failure does
    not consume a generation attempt.

    If execution-input persistence fails, isolate
    the affected Task and recover its exact fixed
    execution input before retrying.

    A Task that cannot temporarily submit its
    execution input enters PAUSED.

    PAUSED preserves all previous attempt counts
    and remaining retry eligibility.

    Resume only with the same fixed execution input.

    Never retry after image receipt or while outcome
    is UNKNOWN.

    Other independent Tasks may continue only when
    the affected Task's known state and execution
    input are safely preserved and verified.

    Stop the Batch only for a verified non-isolatable
    Batch-wide access/integrity/attribution/
    persistence-safety defect.
22. Keep three facts separate: (1) observed image receipt / confirmed no-image / UNKNOWN; (2) correct Task/result attribution; (3) actual GitHub write **and readback verification**. Confirmed receipt remains an observed fact even if GitHub recording fails, but must **not** be described as durably stored or formal Task SUCCESS until verified. Preserve/report the received-image fact and failure (`GITHUB_RECORDING_FAILED` if the failure itself cannot be persisted), keep the applicable received-but-unverified recovery state, and recover **only persistence**, never regeneration. Do not increment verified completion counters or advance unsafely on an unpersisted narrative.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.

## Producer No-QA Rule — Current Override

After generation, the Producer MUST NOT inspect or evaluate the image for QA, including prompt compliance, visual quality, identity, anatomy, composition, style, or dataset suitability. Do not compare the image with the locked prompt and do not decide whether the image is acceptable.

Record only observable generation outcome (received / confirmed no image / UNKNOWN), actual image-file count and references, Task/result attribution, prompt consumption, and the **actual GitHub write/readback status**. A received image **prohibits further generation** but does not itself establish formal SUCCESS; count a Task once only after its result and correct Task attribution are durably written/readback-verified. If the required record remains unresolved, preserve receipt without adding to `COMPLETED_COUNT` and without regeneration. Count multiple returned image files independently from successful Tasks. QA is a separate downstream system, currently `PAUSED`, and does not inspect during production, trigger regeneration or retroactively change generation/status counters.
