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
16. Before generation, read the current complete locked prompt, confirm it is non-empty and associated with the current Task, and use it directly as the generation instruction.
17. Do not redesign, summarize, translate, omit, replace, or silently alter a locked prompt before generation.
18. Actual-generator delivery telemetry is evidence only. If it is not exposed by the current interface, record that limitation as evidence state; it is not a pre-generation block.
19. Result count and result-to-Task provenance must be recorded before SUCCESS.
20. Generation Workers do not perform visual QA.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.