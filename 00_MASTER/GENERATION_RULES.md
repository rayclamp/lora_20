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
13. A production Task is successful when at least one image is confirmed received and durably recorded against its Task; this does not imply QA acceptance. Each Task counts once, and actual returned-file count is recorded separately.
14. One Task is one planned image output. Any confirmed image receipt counts as one successful Task output even if multiple files are returned; record the actual file count separately. Wallpaper prompts default to one independent image.
15. Locked prompts are immutable during generation, retry, and resume.
16. The design stage validates and locks each Prompt. In production, the only pre-generation check is whether the complete assigned locked Prompt was successfully read.
17. Immediately after a successful full-prompt read, invoke the image-generation interface using the locked Prompt as the authoritative specification and intended input. Do not insert intermediate analysis, validation, prompt display, transformation, or unrelated operations. Do not deliberately redesign or casually rewrite the locked Prompt; however, the interface may impose input/transport limits or hide the exact payload. Byte-for-byte transport fidelity is not a production-success requirement, and inability to verify or pass the entire text verbatim must not by itself block generation.
18. The Producer MUST NOT revalidate the locked Prompt's content, format, semantics, correctness, quality, or task binding. If the complete Prompt was not successfully read, do not guess or reconstruct it; record the read failure and stop that Task.
19. The Producer's only generation-result judgment is whether an image result was actually received. Record the observed outcome, actual returned-file count, and confirmed no-image reason when available.
20. Do not inspect the image or compare it with the Prompt. QA owns visual quality and prompt compliance.
21. Retry only a confirmed no-image generation failure, using the same unchanged locked Prompt for the same Task. Stop that Task after three consecutive confirmed no-image generation failures in total, counting the initial call. GitHub read/write/readback failures, prompt-file access failures, metadata/status errors, and other non-generation errors do not count toward this limit or lock the next independent Task. Never retry after image receipt or while the outcome is unknown.
22. Keep generation outcome separate from GitHub persistence outcome. A confirmed image receipt must remain recorded as received even if writing the record fails; record persistence failure separately and do not trigger another generation call.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.

## Producer No-QA Rule — Current Override

After generation, the Producer MUST NOT inspect or evaluate the image for QA, including prompt compliance, visual quality, identity, anatomy, composition, style, or dataset suitability. Do not compare the image with the locked prompt and do not decide whether the image is acceptable.

Record only whether an image was received, the actual number of returned images, result/Task attribution, prompt consumption, and durable record status. Any confirmed image receipt counts as one successful Task output; record multiple returned files separately in the actual image count. QA belongs exclusively to a separate downstream QA process and must not trigger regeneration or change production success.
