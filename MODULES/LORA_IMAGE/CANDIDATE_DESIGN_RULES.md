# LORA_IMAGE Candidate Design Rules

These rules guide prompt design before generation. They are not a post-generation QA checklist and do not authorize the producer to self-approve, reject, repair, or regenerate a completed image.

## Prefer designs with

- clear conditional identity-preservation instructions: during `/LORA_CONSOLE V5.0`, describe the person-reference image that the user will provide later in their own image-generation conversation; do not require an image during design or claim to have inspected one;
- readable face and hair where the chosen framing makes them relevant;
- natural body proportions and plausible posture;
- stable, understandable hand and foot actions;
- believable hand-to-object contact and physically connected wearables;
- meaningful pose/action variation;
- useful clothing, accessory, hairstyle-arrangement, and footwear variation without changing the person's core identity arbitrarily;
- deliberate framing and viewpoint variation;
- an explicit per-Task output-format choice: portrait 9:16 or landscape 16:9, with composition designed for that format;
- a scene that supports the subject instead of obscuring important identity/anatomy information.

## Avoid designing

- unnecessary mirror/reflection compositions that create two independently readable subject instances;
- unstable or needlessly intricate hand interactions;
- excessive occlusion that makes the main action or identity evidence hard to understand;
- decorative particles, branches, straps, or background edges around fingers/toes;
- any animals or pets, without Task-specific exceptions;
- extreme perspective that makes body proportions unreliable;
- confusing limb crossings or objects that obscure limb origins;
- near-duplicate combinations of action, pose, outfit, background, and framing;
- complex visual concepts that add little training value but increase anatomy or identity risk.

## Simplification rule

If a complex idea does not materially improve training-set coverage, choose the simpler and more stable design. Do not sacrifice anatomy stability, identity consistency, or readable composition for novelty.

## Boundaries

- Follow `00_MASTER/ANATOMY_STABILITY.md` and `00_MASTER/DRAWING_INSTRUCTIONS.md` for shared anatomy and generation-stability requirements; do not fork or weaken them here.
- Do not assume a fixed person, age, hairstyle, outfit, or rendering style beyond what the current task and reference establish.
- LORA_IMAGE prompts and images must not include or depict any animals or pets, even when an individual Task explicitly requests them.
- Do not run IMAGE_QA automatically. QA remains a separate, currently paused system.


## Reference-supported body-shape fidelity

For every prompt, require the generated subject's body build and relative proportions to follow the reference image supplied during production; if no image was actually available during prompt design, phrase these as conditional preservation instructions rather than observed measurements. Generic wording such as “natural proportions,” “actual build,” “slim,” or “elegant” is not sufficient on its own when the current task supplies a body-visible reference.

Prompt design must explicitly protect the following where visible and supported by the actual reference. If no design-stage image was supplied, these are conditional requirements for the later production reference, not claims that the designer has observed those features:
- shoulder width and shoulder-to-torso relationship;
- upper-arm and forearm thickness;
- torso and waist shape;
- pelvis and hip width;
- thigh and calf thickness and their relative relationship;
- ankle and wrist proportions;
- overall body volume, muscularity, fullness, slimness, and silhouette.

Do not introduce unexplained thickening, thinning, lengthening, added curves, muscularity, or body-volume changes as a generic beautification or fashion-model effect. Changing clothing, pose, scene, lighting, camera, or crop does not authorize redesigning the person's body.

Interpret apparent shape changes in context: pose, perspective, lens/viewpoint, foreshortening, clothing, lighting, and occlusion can legitimately change the visible contour. Do not demand identical silhouettes across different poses, and do not invent exact numeric tolerances or promise a percentage-level match that the image tool cannot guarantee.

If a body region is hidden, cropped out, or not reliably comparable, do not claim it was preserved or assessed. Keep the prompt grounded in visible reference evidence and prioritize a composition that makes important body regions readable when the task requires them.

This is a generation-design requirement only. The Producer generates the image and records the observable result; it does not self-QA, self-reject, repair, or regenerate. Post-generation acceptance and cross-image consistency belong to the independent IMAGE_QA system, which remains governed by its own activation status.


## Output format

For each new V5.0 candidate, randomly choose `TASK_OUTPUT_TYPE=PHONE_9_16` or `TASK_OUTPUT_TYPE=DESKTOP_16_9` independently, without a Session-wide fixed format or quota. Record each choice in `INDEX.md` only; the complete English plain-text `TASK_NNN.txt` body naturally describes the corresponding portrait or landscape composition. Historical locked Batches retain their old metadata and lock conventions. Prompt wording cannot guarantee exact generated pixel dimensions without interface control.
