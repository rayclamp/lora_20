# LORA_IMAGE_QA Checklist

## Inputs
- [ ] Correct reference image from the same production request is available
- [ ] Current task requirements and applicable LORA_IMAGE rules are available
- [ ] CHARACTER selection is known and applied correctly
- [ ] No fixed age/person assumption has been introduced

## Identity and rendering
- [ ] Identity matches the current uploaded reference
- [ ] Face and hair remain consistent with the reference
- [ ] Natural body proportions
- [ ] No stretched thighs, calves, torso, or other body regions

## Anatomy and contact
- [ ] Hands and wrists are stable
- [ ] Five fingers when the hand is fully visible
- [ ] Feet are stable
- [ ] Five toes when sufficiently visible
- [ ] Natural object contact
- [ ] Wearable straps and attachments are complete
- [ ] No false limbs, duplicated-body errors, or anatomy/background fusion

## Dataset and task value
- [ ] Requested framing and composition are satisfied
- [ ] Candidate adds useful non-redundant dataset value
- [ ] No accidental animal/pet unless explicitly allowed


## Body-shape fidelity
- [ ] Compared visible body shape with the correct reference, not only against generic human proportions
- [ ] Overall build remains consistent with reference-supported evidence
- [ ] Shoulder/arm, torso/waist, pelvis/hip, thigh/calf, and ankle/wrist shapes show no unexplained material drift where visible
- [ ] Apparent differences caused by pose, perspective, clothing, lighting, or occlusion were considered before judging
- [ ] Unobservable or ambiguous regions are marked uncertain/REVIEW rather than guessed

## Cross-image / dataset-level review (only when a comparison set is available)
- [ ] Same-person facial identity and apparent age remain coherent across the set
- [ ] Overall build and visible body-region shapes remain coherent across the set
- [ ] Differences are separated into reasonable pose/view effects versus unexplained shape drift
- [ ] Rendering style remains coherent for the intended dataset
- [ ] Near-duplicates and superficial variation have been considered
- [ ] Framing/viewpoint/pose coverage adds useful information without forcing rigid quotas
- [ ] If comparison inputs are unavailable, dataset-level consistency is marked NOT_ASSESSED / pending, not PASS
- [ ] Candidate-level result and dataset-level assessment are recorded separately

## Decision
- [ ] Uncertain anatomy or insufficient evidence is marked REVIEW
- [ ] Clearly visible hard failures do not PASS
- [ ] Original image and audit history are preserved
- [ ] QA does not trigger generation or automatic repair

Result: PASS / REVIEW / REPAIR / REJECT
