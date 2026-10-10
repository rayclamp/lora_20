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

## Decision
- [ ] Uncertain anatomy or insufficient evidence is marked REVIEW
- [ ] Clearly visible hard failures do not PASS
- [ ] Original image and audit history are preserved
- [ ] QA does not trigger generation or automatic repair

Result: PASS / REVIEW / REPAIR / REJECT
