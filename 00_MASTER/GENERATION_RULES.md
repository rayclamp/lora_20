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
12. Generation Workers do not self-QA.
13. A returned image is not automatically a successful Task.
14. One Task must produce exactly the output count required by the active Task contract; wallpaper defaults to one independent image.
15. Locked prompts are immutable during generation, retry, and resume.
16. The exact locked prompt must be bound to GENERATION_INPUT before generation.
17. Prompt Binding Integrity and actual generator delivery evidence are separate.
18. The exact GENERATION_INPUT MUST be used to construct a GENERATION_DECLARATION immediately before the actual image-generation call.
19. GENERATION_DECLARATION MUST contain the complete GENERATION_INPUT verbatim. It MUST NOT use only PROMPT_ID, TASK_ID, a summary, an IMAGE_ID, a task description, or an abstract adapter/binding label in place of the full prompt.
20. GENERATION_DECLARATION MUST explicitly state that the following text is the exact locked generation prompt and MUST be executed as written.
21. GENERATION_DECLARATION is an execution bridge, not a new Prompt and not a modification of PROMPT_SET.
22. The Producer MUST NOT call the image-generation interface until the declaration has been prepared with the validated exact GENERATION_INPUT.
23. If actual-generator delivery telemetry is not exposed by the current interface, record that limitation as evidence state (NOT_EXPOSED / UNVERIFIED) after generation; it does not permit skipping the declaration.
24. The prompt shown to the user before generation MUST equal the same GENERATION_INPUT used in the declaration.
25. Result count and result-to-Task provenance must be recorded before SUCCESS.
26. Generation Workers do not perform visual QA.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.