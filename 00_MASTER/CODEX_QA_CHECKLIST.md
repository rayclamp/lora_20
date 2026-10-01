# CODEX_QA_CHECKLIST.md — Visual Inspection Checklist

## Status

**PAUSED**

Use only after QA is explicitly activated.

## A. Image
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

## K. Source-module checks
- [ ] Anime rules if source is ANIME_WALLPAPER
- [ ] Realistic rules if source is REALISTIC_WALLPAPER
- [ ] Festival rules if applicable
- [ ] Pet permission if applicable
- [ ] LoRA dataset rules if source is LORA_PRODUCTION

Never import unrelated module requirements.

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
