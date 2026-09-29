# INARIA_QA_SPEC.md — Codex QA Adapter

## Authority
This file defines how Codex reports first-layer QA. It does not create independent project rules.

Primary authority:
- 00_MASTER/MASTER_SPEC.md
- 00_MASTER/STYLE_MASTER.md
- 00_MASTER/IDENTITY_MASTER.md
- 00_MASTER/ANATOMY_STABILITY.md
- 00_MASTER/QUALITY_CONTROL.md
- 00_MASTER/PRODUCTION_MODES.md

## QA principle
Use only visible evidence.
- PASS when a requirement is clearly satisfied.
- REVIEW when evidence is insufficient or occluded.
- FAIL when a violation is clearly visible.

Codex first-layer QA does not make the final production decision. ACCOUNT_06 is the final PASS / REPAIR / REJECT gate.

## Required checks
1. Age-20 Inaria identity.
2. MASTER_IMAGE reference-style match.
3. Japanese anime illustration target.
4. Exactly two hands and two legs where visible.
5. Five fingers per visible hand.
6. Five toes per visible bare foot.
7. Natural limb connections and center of gravity.
8. No false limbs from clothing, props, straps, furniture, plants, or background.
9. Hand/foot readability against the background; no material silhouette fusion with foliage, rails, patterns, effects, or other background detail.
10. Hand topology and handedness: trace shoulder → upper arm → forearm → wrist → palm and confirm the correct anatomical left/right hand.
11. Back/BACK_3/4 handedness: do not infer left/right from screen position; if the anatomical side cannot be established, report REVIEW.
12. Natural wrist/palm structure; a correct five-finger count does not PASS a visibly malformed hand topology.
13. Natural hand-object contact.
14. Complete bag/strap connections.
15. Complete cup/mug/teapot/container structure.
16. Task-specific clothing, scene, pose, camera, composition, and accessories.
17. No major artifact, text, watermark, logo, duplicate body, or severe crop damage.
18. Sufficient dataset value.

## Reference provenance
QA must treat the official INARIA_20_MASTER_v1.0.png as the reference identity/style baseline regardless of whether the candidate was generated through AUTO MODE or MANUAL MODE.

## Important
If anatomy or reference match cannot be reliably observed because of occlusion or missing reference evidence, do not invent a PASS or FAIL. Report REVIEW.

A beautiful image with a clear anatomy or reference-style failure is not a valid final dataset image.


## Body-proportion QA
Codex must separately inspect natural body proportion when the image provides sufficient evidence.

Check:
1. Overall body proportion matches the applicable MASTER / CHARACTER REFERENCE.
2. Thigh, lower-leg, and total-leg proportions remain natural.
3. No obvious fashion-model-style leg elongation or vertical body stretching.
4. Perspective from wide-angle or low-angle photography has not become an actual proportion error.
5. Seated, crouching, kneeling, stair, heavily occluded, or high-heel images are not judged from apparent leg length alone.
6. If pose, footwear, clothing, occlusion, or perspective makes the underlying proportion unreliable to determine, report REVIEW rather than guessing PASS or FAIL.

Reliable proportion evidence should prioritize standing, full-body, front/front-3/4, naturally posed images with clear legs and limited perspective distortion.

A high-heel image is not automatically a proportion failure. A seated image is not automatically a proportion failure. The QA question is whether the underlying human proportions are clearly inconsistent with the applicable reference.


## Framing and crop QA

Framing is evaluated according to the task specification, not according to a universal full-body requirement.

For CLOSE-UP, HEAD-AND-SHOULDERS, BUST/HALF-BODY, or other cropped tasks:
- do not fail the candidate merely because hands or feet are outside the frame;
- do not infer missing anatomy from naturally cropped regions;
- inspect only the body parts that are actually visible;
- natural cropping and reasonable occlusion are not anatomy failures by themselves.

If a task explicitly requires CLOSE-UP but the result is clearly a distant or full-body composition, report the framing requirement as a task/composition failure.

For full-body tasks, visible hands and feet remain subject to the normal anatomy rules.
