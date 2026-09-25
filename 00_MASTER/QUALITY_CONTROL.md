# QUALITY_CONTROL.md — Inaria Age-20 LoRA Quality Standard

## 1. Purpose
Select images with real training value, not merely attractive appearance.

## 2. Final decisions
- PASS: all hard gates pass and the image has dataset value.
- REPAIR: identity/task/design are valid and the defect is localized and safely repairable.
- REJECT: severe structural/style/task failure or insufficient dataset value.
ACCOUNT_06 is the only final decision-maker.

## 3. Reference Match Gate
The image must match MASTER_IMAGE/INARIA_20_MASTER_v1.0.png as both Character and Visual Style Reference.

Check face identity, eye rendering, hair rendering, proportions, line-art language, coloring, shading, lighting language, and overall anime illustration finish.

Reject as a target-style match if the image is photorealistic, photographic/live-action, 3D/CGI, semi-photorealistic, or another anime/manga/game/illustration style.

A generic Japanese anime appearance without meaningful MASTER_IMAGE visual-language matching is insufficient.

## 4. Anatomy hard gate
Check:
- exactly two hands and two legs;
- five fingers on every visible hand;
- five toes on every visible bare foot;
- correct left/right anatomy;
- natural shoulder/arm/wrist/palm connections;
- natural hip/leg/ankle/foot connections;
- plausible center of gravity;
- no extra/missing/fused/duplicated digits;
- no false limbs from clothing, straps, props, furniture, plants, or background.

Hand-action gate:
- single-hand single-task;
- natural grips;
- no unnecessary fingertip pinching;
- at least one clear hand when practical;
- no hand-edge crop risk;
- no busy effects around fingers.

Object-contact gate:
- hand actually contacts held object;
- handle is connected and held naturally;
- bags/straps connect to object and body;
- containers are structurally complete;
- no floating or unsupported objects.

Lower-body gate:
- legs traceable from hips to feet;
- support and weight distribution plausible;
- no unnecessary twisting, entangling, or ambiguous overlap;
- long-skirt sofa poses follow ANATOMY_STABILITY.md.

Any clear hard-gate failure cannot be PASS. If a digit or structure is genuinely hidden and cannot be evaluated, require human inspection rather than guessing.

## 5. Task gate
Verify the current Prompt Package: clothing, hairstyle, scene, pose/action, camera/composition, accessories, colors, flowers/props, aspect ratio, and every other explicit requirement.

## 6. Image integrity
Reject or repair as appropriate for severe face deformation, major generation artifacts, text/watermark/logo, severe object fusion, severe crop damage, or duplicate body/limb/object.

## 7. Local repair
Repair only the necessary region when feasible. After any repair, repeat complete QA. A repair never becomes PASS automatically.

## 8. Dataset value
Evaluate controlled pose, clothing, hairstyle, scene, camera/composition, lighting/environment diversity, and non-redundancy. Dataset value never overrides a hard gate.

## 9. Final PASS checklist
All must be true:
- age-20 Inaria identity matches;
- MASTER_IMAGE visual style matches;
- anatomy hard gates pass;
- task requirements pass;
- image integrity passes;
- dataset value is sufficient;
- asset/lineage is recorded;
- no unresolved blocker remains.