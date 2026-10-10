# LORA_IMAGE Dataset Design Specification

## Purpose and scope

Define the LoRA-specific image-design requirements for candidate training images. These rules apply to any subject selected for a current LORA_IMAGE request; they do not assume Inaria, a fixed age, a permanent identity, or a fixed rendering style.

This file supplements the shared CORE rules. It does not replace them, repeat their full anatomy protocol, perform post-generation QA, or define a runtime/dispatch system.

## Subject and identity consistency

- Use the reference image uploaded for the current request as the sole visual identity authority.
- Keep the subject recognizably consistent with that reference across the requested set, including stable facial identity cues and natural body-proportion characteristics supported by the reference.
- Preserve apparent age unless the user explicitly requests an age change. Do not assume a fixed target age.
- Do not use diversity as a reason to redesign the person's identity, exaggerate facial/body features, or normalize the person toward unrelated character data.
- Unless the task explicitly requires otherwise, design one primary subject instance per image. Do not add a second independently readable version of the same subject merely for decoration.
- The current task defines the requested rendering style. Do not automatically import anime, realistic-photography, wallpaper, or festival styling from another module.
- The reference image establishes identity, not automatic permission to copy its pose, composition, clothing, accessories, or scene. Follow the current task and dataset variation requirements when designing those elements.

## Anatomy and generation stability

- All shared CORE drawing, anatomy, object-contact, and generation-stability rules are mandatory during prompt design.
- Stable anatomy and believable body mechanics take priority over complex action, decorative effects, or forced novelty.
- Design hands, feet, limb paths, clothing connections, and held-object contact with the shared CORE rules before adding background detail.
- Keep important anatomy visually readable against the background. Do not add effects or high-detail edges around fingers/toes when they reduce clarity.
- Maintain natural human proportions. Slimness or elegance must not become exaggerated leg length, stretched torso/limbs, or fashion-model proportions.
- Natural occlusion is acceptable. Do not contort a pose just to expose every digit; use simple, stable actions when a complex pose creates avoidable risk.
- Do not add animals or pets unless the current task explicitly permits them.
- Mirror/reflection compositions must obey the shared CORE mirror/reflection hard rule. Prefer a single readable subject instance.

## Composition and framing

Use intentional framing variety across the dataset, as appropriate to the subject and task:

- CLOSE-UP;
- BUST / HALF-BODY;
- MEDIUM SHOT;
- CHARACTER-DOMINANT FULL-BODY;
- ENVIRONMENTAL FULL-BODY when the environment adds useful context.

FULL-BODY does not mean distant framing. Full-body images should keep the subject sufficiently large and readable when the task is intended to show the subject. Environmental full-body framing is useful when the environment itself contributes meaningful training information.

Do not make the dataset a mannequin sheet. Images should depict purposeful poses, expressions, actions, or natural presentation rather than only static catalog-like standing poses.

Composition variety must remain compatible with identity consistency, natural anatomy, and the current task. Avoid extreme perspective that makes the subject's proportions unreliable unless specifically required.

## Candidate-design intent

Design each candidate to contribute useful training information: clear identity evidence, understandable anatomy, deliberate framing, meaningful presentation, or a distinct but coherent variation. Prefer a simpler stable composition when extra visual complexity does not materially improve dataset coverage.

These are design-time requirements. Final image acceptance, PASS/REVIEW/REPAIR/REJECT classification, and any repair decision belong to the separate IMAGE_QA system when it is explicitly activated.
