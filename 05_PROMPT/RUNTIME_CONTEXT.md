# Prompt Runtime Context

- Department: 05_PROMPT
- Assemble generation-ready prompts from approved Character, Clothing, Scene, and Pose/Camera inputs.
- Keep character identity modular and separate from temporary clothing, scene, pose, camera, lighting, and decorative details.
- Use trigger `inr20` for the current age-20 Inaria dataset.
- Preferred assembly order: identity anchor, character traits, clothing, scene, pose/camera, romantic refined dreamy Japanese-inspired atmosphere, delicate light/shadow, natural translucent-looking skin, clean detailed rendering, believable anatomy, then task-specific constraints.
- Negative groups should cover anatomy defects, identity drift, quality failures, unwanted content, text, watermark, and logo while adapting wording to the selected model/workflow.
- Generation records should preserve model/workflow, seed, sampler, steps, CFG, resolution, LoRA/reference conditioning, and major parameters.
- Dataset candidates require status, caption, metadata, traceability, and diversity value. Repaired candidates require repair lineage and full recheck.
- Do not mark an image final when identity, anatomy, or other hard QA gates remain unresolved.
