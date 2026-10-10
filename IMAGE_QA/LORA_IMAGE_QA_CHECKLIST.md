# LORA_IMAGE_QA — Operational Checklist

## A. Candidate-level input gate

- [ ] Correct candidate/image exists, is readable, and is bound to the intended Task
- [ ] `QA_REVIEW_ID`, `TASK_ID`, `CANDIDATE_ID` / image reference, and `SOURCE_MODULE` are known
- [ ] Correct reference image from the same production request is available when required
- [ ] Current task requirements and applicable `LORA_IMAGE` rules are available
- [ ] `CHARACTER` selection is known and applied correctly
- [ ] No permanent identity, fixed age, or age-20 assumption has been introduced
- [ ] If source module is `FESTIVAL_WALLPAPER`, stop: out of scope; preserve the original and do not route to LoRA

Missing required input: report `QA_INPUT_INCOMPLETE`. Conflicting authoritative requirements: report `QA_DATA_CONFLICT`.

## B. Candidate-level visual inspection

### Identity and rendering
- [ ] Identity anchors, face, and hair are consistent with the correct uploaded reference where visible
- [ ] Apparent age is checked only when specified and supported by evidence
- [ ] Applicable rendering style and current task requirements are satisfied
- [ ] No fixed camera gaze, face angle, pose, or framing is imposed unless required

### Body-shape fidelity — not only generic anatomy
- [ ] Compared visible body shape with the correct reference, not only with generic human proportions
- [ ] Overall build remains consistent with reference-supported evidence
- [ ] Shoulder/arm, torso/waist, pelvis/hip, thigh/calf, ankle/wrist shapes and relative relationships were considered where visible
- [ ] No material unexplained thickening/thinning, fullness/muscularity change, body-region ratio shift, or silhouette drift is present
- [ ] Pose, perspective, foreshortening, crop, clothing, lighting, and occlusion were considered before judging differences
- [ ] No unseen body region was inferred or claimed to pass
- [ ] Unobservable or ambiguous regions are marked REVIEW/uncertain rather than guessed
- [ ] Different poses are not required to have identical silhouettes

### Anatomy, objects, and wearables
- [ ] Limb count and topology are plausible; no extra/missing/false limb
- [ ] Hands/wrists/palms and finger count/separation are assessed only where sufficiently visible
- [ ] Legs/feet/toes and support are assessed only where sufficiently visible
- [ ] Required hand-object contact is plausible
- [ ] Wearable straps and attachments are complete and physically connected
- [ ] No severe anatomy/background fusion or duplicated-body error
- [ ] Natural occlusion is not automatically treated as failure

### Task and dataset value
- [ ] Requested output format, framing, composition, clothing/accessories, and other task constraints are satisfied
- [ ] Accidental animals/pets are absent unless explicitly allowed
- [ ] Candidate-level suitability is judged from this image and its authorized reference evidence
- [ ] Any issue has a concrete observation, affected region, applicable rule, and reason/severity

## C. Candidate-level decision

Choose exactly one:
- [ ] `PASS`
- [ ] `REVIEW`
- [ ] `REPAIR`
- [ ] `REJECT`

- [ ] Missing required inputs are not treated as PASS
- [ ] Clearly visible hard failures do not PASS
- [ ] Original image and generation history are preserved
- [ ] QA does not trigger generation, prompt edits, or automatic repair

## D. Dataset-level review — only when explicitly requested and comparison inputs exist

### Dataset input
- [ ] `DATASET_ID` and dataset scope/version or snapshot are recorded
- [ ] Dataset purpose and selected character option are known
- [ ] Exact candidate/task/image IDs and links in scope are listed
- [ ] Applicable reference image(s) and candidate-to-reference mapping are explicit
- [ ] Candidate-level QA results are linked where available
- [ ] Stable traits and allowed variation are defined from current rules

### Cross-image checks
- [ ] Identity and apparent age (when specified) are coherent across the set
- [ ] Overall build, limb thickness, and body-region ratios have no material unexplained drift
- [ ] Pose/perspective/framing/clothing/lighting/occlusion effects are separated from genuine drift
- [ ] Rendering style is coherent for the intended dataset
- [ ] Near-duplicates and superficial-only variation are considered
- [ ] Framing, viewpoint, and pose variation provide useful coverage without invented rigid quotas
- [ ] Candidate-level outcomes remain separate from the dataset-level result
- [ ] If comparison inputs or reference mapping are unavailable, use `NOT_ASSESSED` or `REVIEW`, never dataset PASS by assumption

Record a separate immutable dataset QA record identifying the exact reviewed snapshot, reference mappings, candidates, evidence, result, unresolved dimensions, and recommended next action. Do not overwrite earlier reviews.

## E. Preservation and activation boundary

- [ ] Original images, candidate QA results, and earlier dataset reviews are preserved
- [ ] Any separately authorized repair creates a new candidate/version and requires new inspection
- [ ] QA remains PAUSED unless activation is explicitly authorized and execution capability is verified

Candidate result: `PASS / REVIEW / REPAIR / REJECT`

Dataset result (when applicable): `PASS / REVIEW / REPAIR / REJECT / NOT_ASSESSED`
