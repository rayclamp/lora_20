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
18. If actual-generator delivery telemetry is not exposed by the current interface, record that limitation as evidence state; it is not a pre-generation block. A valid generation call may proceed after Level 1 Prompt Binding passes.
19. Result count and result-to-Task provenance must be recorded before SUCCESS.
20. Generation Workers do not perform visual QA.
21. Each locked Prompt may be generated exactly once. No retry, regeneration, resubmission, or second Generation Call is permitted for the same Prompt/version.
22. Image QA, when explicitly used for recording, only classifies the single generated result as PASS, FAIL, or UNVERIFIED and never triggers regeneration.
23. Only verified Policy/Safety interruptions count toward the per-Prompt three-interruption limit. Generation service errors, quota/rate limits, GitHub failures, system/runtime errors, and unknown interruptions do not count.
24. After three consecutive verified Policy/Safety interruptions across explicit user-authorized continuations, the Prompt is permanently skipped with PROMPT_SKIPPED_POLICY_LIMIT.

Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
No age-specific identity or LoRA-specific dataset rule belongs here.