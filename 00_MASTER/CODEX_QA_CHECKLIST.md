# CODEX_QA_CHECKLIST.md — Visual Inspection Checklist

## Status

**PAUSED**

Use only after QA is explicitly activated. This is a supplemental, non-executable anatomy/visual inspection checklist for the existing `LORA_IMAGE_QA` profile, not a separate QA authority, source-module routing rule, or permission to run QA. Follow `00_MASTER/QA_MODULE.md`, `00_MASTER/QA_PROTOCOL.md`, `IMAGE_QA/LORA_IMAGE_QA_SPEC.md`, and `IMAGE_QA/LORA_IMAGE_QA_CHECKLIST.md`. QA remains `PAUSED`.

## A. Image and authorized input
- [ ] QA has been separately activated; otherwise stop without inspection
- [ ] `SOURCE_MODULE=LORA_IMAGE` has been verified from authoritative Task/result records; other modules are out of the current QA profile scope
- [ ] Required candidate image, Task association, current task contract, and correctly mapped production-time reference image are available; missing inputs are `QA_INPUT_INCOMPLETE`, not PASS
- [ ] Image available and readable
- [ ] Expected subject present
- [ ] No severe corruption

## B. Limb topology
- [ ] Two arms/hands where applicable
- [ ] Two legs/feet where applicable
- [ ] No extra limbs
- [ ] No missing limbs
- [ ] Arm sources trace to shoulders
- [ ] Leg sources trace to hips
- [ ] No false limb from clothing, props, straps, or background

## C. Hands
For each sufficiently visible hand:
- [ ] Correct anatomical left/right
- [ ] Shoulder → arm → wrist → palm connection traceable
- [ ] Natural palm/wrist
- [ ] Five fingers when fully visible
- [ ] No fused fingers
- [ ] No duplicated fingers
- [ ] No missing fingers
- [ ] Natural finger attachment/orientation
- [ ] Real object contact when required
- [ ] No handle through palm

If naturally occluded:
- [ ] REVIEW rather than guessing

## D. Legs / feet
- [ ] Hip → thigh → knee → calf → ankle → foot traceable
- [ ] Natural joints
- [ ] Stable support
- [ ] No severe crossing/twisting/entanglement
- [ ] No exaggerated leg elongation
- [ ] Five toes when bare foot is sufficiently visible
- [ ] Shoes do not reveal malformed feet

Do not automatically fail covered toes or fully enclosed shoes.

## E. Proportions
- [ ] Natural human proportions
- [ ] No stretched thighs
- [ ] No stretched calves
- [ ] No vertically stretched body
- [ ] Slimness not converted to exaggerated long legs
- [ ] Elegance not converted to exaggerated model proportions

## F. Objects / wearables
- [ ] Held objects are actually supported
- [ ] Handles connect to object bodies
- [ ] No floating object
- [ ] Complete bag straps
- [ ] Straps connect naturally to bag and body
- [ ] No body-penetrating strap
- [ ] No strap creating a false limb
- [ ] Containers structurally coherent

## G. Anatomy readability
- [ ] Hands separated from confusing background detail
- [ ] Feet/toes readable when visible
- [ ] No branch/wire/rail through fingers
- [ ] No dense texture materially obscuring toes
- [ ] No effect/particle crossing important anatomy
- [ ] No background edge creating false limb

Ambiguous evidence:
- [ ] REVIEW

## H. Identity / reference
When required:
- [ ] Identity consistent
- [ ] Face consistent
- [ ] Required apparent age consistent
- [ ] Hair consistent
- [ ] Body proportions consistent
- [ ] Required identity characteristics preserved

Do not require identical angle/pose/framing unless explicitly required.

## I. Clothing / accessories
- [ ] Required clothing present
- [ ] Clothing coherent
- [ ] Accessories physically attached
- [ ] No impossible wearable structure
- [ ] No accidental identity-changing element

## J. Composition
- [ ] Correct format when applicable
- [ ] Correct subject placement
- [ ] Required framing/shot satisfied
- [ ] FULL-BODY is not unnecessarily distant
- [ ] Scene readable
- [ ] Applicable mirror/reflection restrictions satisfied

## K. Current QA source-module scope
- [ ] Verified `SOURCE_MODULE=LORA_IMAGE` and applied the active `MODULES/LORA_IMAGE/` rules and the `LORA_IMAGE_QA` acceptance profile
- [ ] Applied only relevant shared CORE anatomy, drawing, safety, and task-specific requirements
- [ ] Checked pet/animal permission against the authorized LORA_IMAGE Task, not another module's default
- [ ] Did not import ANIME_WALLPAPER, REALISTIC_WALLPAPER, FESTIVAL_WALLPAPER, or archived `LORA_PRODUCTION` requirements as applicable QA rules

If `SOURCE_MODULE` is not an approved QA source, stop under the applicable `QA_SOURCE_MODULE_OUT_OF_SCOPE` gate. In particular, `FESTIVAL_WALLPAPER` is excluded. This checklist does not add any new QA profile or activate QA.

## L. Final result
- [ ] PASS
- [ ] REVIEW
- [ ] REPAIR
- [ ] REJECT

For non-PASS:
- Result:
- Reason code:
- Severity:
- Region:
- Observation:
- Applicable rule:
- Recommended next action:

## Critical rule

Do not guess hidden anatomy.

Natural occlusion may pass.
Uncertain anatomy → REVIEW.
Clearly malformed anatomy → REPAIR or REJECT according to scope.

QA never changes the historical fact that generation succeeded.
