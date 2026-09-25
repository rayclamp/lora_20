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
9. Natural hand-object contact.
10. Complete bag/strap connections.
11. Complete cup/mug/teapot/container structure.
12. Task-specific clothing, scene, pose, camera, composition, and accessories.
13. No major artifact, text, watermark, logo, duplicate body, or severe crop damage.
14. Sufficient dataset value.

## Reference provenance
QA must treat the official INARIA_20_MASTER_v1.0.png as the reference identity/style baseline regardless of whether the candidate was generated through AUTO MODE or MANUAL MODE.

## Important
If anatomy or reference match cannot be reliably observed because of occlusion or missing reference evidence, do not invent a PASS or FAIL. Report REVIEW.

A beautiful image with a clear anatomy or reference-style failure is not a valid final dataset image.
