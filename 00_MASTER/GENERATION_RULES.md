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
16. Before generation, read the current complete, non-empty locked Prompt from the authoritative PROMPT_SET and confirm it is bound to the current Task. Reading the full Prompt first is mandatory.
17. After reading it, the Producer may submit it unchanged or create a shortened generation input derived only from that exact Prompt. A shortened input must preserve Task-specific intent and essential details, including scene, identity requirements, pose, expression, clothing, composition, and explicit exclusions where present.
18. Do not create a replacement from the Session theme, prior Tasks, memory, assumptions, or a generic template. Do not edit or silently rewrite the locked Prompt Set; any shortened text is a one-Task generation input, not a new locked prompt.
19. Record full-prompt-read status separately from generation-input mode. If the Prompt is unreadable, incorrectly bound, or cannot be shortened without losing essential requirements, isolate/block that Task rather than improvising. Missing hidden-payload telemetry alone does not block generation; record what is known and what is not exposed without guessing.
20. If the Producer knowingly submitted different text, record the known execution deviation honestly. If the submitted payload is not exposed and no deviation is known, record NOT_EXPOSED/UNVERIFIED without claiming exact transport verification.
21. Actual-generator delivery telemetry is evidence only. If it is not exposed by the current interface, record that limitation as evidence state; it is not a pre-generation block.
22. Result count and result-to-Task binding must be recorded before production SUCCESS. If no image is received, record the confirmed failure reason.
23. Generation Workers must not perform routine post-generation hidden-payload equality audits or visual QA. Before generation, the Producer must read the complete locked Prompt and confirm Task binding, then use either the full Prompt unchanged or a shortened input derived only from that exact Prompt under Rules 16–19. Record the selected input mode; image correctness is decided by the independent QA workflow.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.