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
13. A production Task is successful when the expected image result is received, counted, recorded, and bound to its Task; this does not imply QA acceptance.
14. One Task must produce exactly the output count required by the active Task contract; wallpaper defaults to one independent image.
15. Locked prompts are immutable during generation, retry, and resume.
16. For a new-format Batch, use `PROMPT_SET.md` only as the manifest to locate `PROMPTS/<TASK_ID>.md`, then read the complete, non-empty locked Prompt text inside that file's explicit delimiters and confirm it is bound to the current Task. `PROMPT_SET.md` must not contain full prompt bodies. Existing combined-file Batches remain legacy and must not be silently migrated. Reading the full Prompt first is mandatory.
17. After reading it, the Producer MUST submit the entire complete locked Prompt verbatim as the generation input for that Task.
18. The Producer MUST NOT shorten, summarize, paraphrase, translate, reorder, rewrite, omit, add to, polish, or otherwise alter the locked Prompt when preparing the generation call. No replacement or derived version is permitted.
19. If the complete Prompt cannot be read, its Task binding is unclear, or the exact full text cannot be supplied unchanged, do not generate that Task; isolate/block it and record the specific failure. Missing hidden-payload telemetry alone does not prove a mismatch and must be recorded honestly; do not claim transport verification that is unavailable.
20. If the Producer knowingly submitted different text, record the known execution deviation honestly. If the submitted payload is not exposed and no deviation is known, record NOT_EXPOSED/UNVERIFIED without claiming exact transport verification.
21. Actual-generator delivery telemetry is evidence only. If it is not exposed by the current interface, record that limitation as evidence state; it is not a pre-generation block.
22. Result count and result-to-Task binding must be recorded before production SUCCESS. If no image is received, record the confirmed failure reason.
23. Generation Workers must not perform routine post-generation hidden-payload equality audits or visual QA. Before generation, the Producer must read the complete locked Prompt from its authoritative per-Task file (or the documented legacy source for an existing Batch), confirm Task binding, and submit the complete locked Prompt verbatim without any transformation. Record the generation-input mode as `FULL_LOCKED_PROMPT`; image correctness is decided by the independent QA workflow.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.

## Producer No-QA Rule — Current Override

After generation, the Producer MUST NOT inspect or evaluate the image for QA, including prompt compliance, visual quality, identity, anatomy, composition, style, or dataset suitability. Do not compare the image with the locked prompt and do not decide whether the image is acceptable.

Record only whether an image was received, the actual number of returned images, result/Task attribution, prompt consumption, and durable record status. Any confirmed image receipt counts as one successful Task output; record multiple returned files separately in the actual image count. QA belongs exclusively to a separate downstream QA process and must not trigger regeneration or change production success.
