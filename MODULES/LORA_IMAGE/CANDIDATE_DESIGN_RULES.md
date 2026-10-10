# LORA_IMAGE Candidate Design Rules

These rules guide prompt design before generation. They are not a post-generation QA checklist and do not authorize the producer to self-approve, reject, repair, or regenerate a completed image.

## Prefer designs with

- clear, recognizable identity cues grounded in the current uploaded reference;
- readable face and hair where the chosen framing makes them relevant;
- natural body proportions and plausible posture;
- stable, understandable hand and foot actions;
- believable hand-to-object contact and physically connected wearables;
- meaningful pose/action variation;
- useful clothing, accessory, hairstyle-arrangement, and footwear variation without changing the person's core identity arbitrarily;
- deliberate framing and viewpoint variation;
- a scene that supports the subject instead of obscuring important identity/anatomy information.

## Avoid designing

- unnecessary mirror/reflection compositions that create two independently readable subject instances;
- unstable or needlessly intricate hand interactions;
- excessive occlusion that makes the main action or identity evidence hard to understand;
- decorative particles, branches, straps, or background edges around fingers/toes;
- accidental animals or pets when not explicitly permitted;
- extreme perspective that makes body proportions unreliable;
- confusing limb crossings or objects that obscure limb origins;
- near-duplicate combinations of action, pose, outfit, background, and framing;
- complex visual concepts that add little training value but increase anatomy or identity risk.

## Simplification rule

If a complex idea does not materially improve training-set coverage, choose the simpler and more stable design. Do not sacrifice anatomy stability, identity consistency, or readable composition for novelty.

## Boundaries

- Follow `00_MASTER/ANATOMY_STABILITY.md` and `00_MASTER/DRAWING_INSTRUCTIONS.md` for shared anatomy and generation-stability requirements; do not fork or weaken them here.
- Do not assume a fixed person, age, hairstyle, outfit, or rendering style beyond what the current task and reference establish.
- Do not add pets unless explicitly permitted by the current task.
- Do not run IMAGE_QA automatically. QA remains a separate, currently paused system.
