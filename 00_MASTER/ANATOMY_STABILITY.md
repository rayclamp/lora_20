# ANATOMY_STABILITY.md — Inaria Anatomy & Generation Stability Standard

## Authority
This is the project-wide hard standard for human anatomy, pose stability, object contact, and generation-stability planning. It applies to ACCOUNT_06 design, all Generation Workers, prompt construction, generation, repair, Codex QA, and final QA.

If another project file conflicts with this document, this document is authoritative for anatomy and generation stability.

## Core priority
Generation stability first → anatomy correctness → body ergonomics → background/effects → decorative complexity.

When an attractive but unstable action conflicts with a simpler stable action, use the stable action.

Conceptual drawing order: fingers/toes → body → background/effects.

## 1. Basic human topology lock
- Exactly two hands and two legs.
- Every visible hand exactly five fingers.
- Every visible bare foot exactly five toes.
- Correct left/right hand and foot identity.
- No extra, missing, fused, duplicated, split, or mutated digits.
- Every hand has a traceable shoulder → upper arm → forearm → wrist → palm connection.
- Every leg has a traceable hip → thigh → knee → calf → ankle → foot connection.
- Center of gravity and support must be plausible.
- Sleeves, clothing, props, bags, straps, plants, furniture, background shapes, and effects must never create convincing false limbs.

## 2. Pose-design rules
1. Choose the most stable/easy-to-generate hand action during composition.
2. Do not design a difficult action first and rely on post-generation repair.
3. Confirm support, center of gravity, joint direction, and force/load before action flourish.
4. Limbs must not hover without clear physical support.
5. Keep hands and feet away from image edges where possible.
6. Keep important background objects and decorative effects away from hands.
7. Avoid complex effects, particles, straps, rails, foliage, or object edges around fingers.
8. Natural occlusion by clothing, body, or a suitable object is acceptable when it improves stability.
9. At least one hand should remain clear, complete, and easy to identify.
10. Avoid both hands simultaneously being in high-difficulty poses, deep occlusion, or edge crops.

## 3. Hand-action rules
- Single-hand single-task: one hand performs one main action at a time.
- Prefer common real-life grips with broad, natural contact surfaces.
- Avoid pinching with only two or three fingertips unless specifically required.
- When the palm faces the camera, avoid excessive perspective distortion.
- Avoid fingers crossing or completely overlapping when they can be separated naturally.
- Avoid both hands covering each other. If contact is necessary, one hand is primary and the other auxiliary.
- When holding an object, let the object provide visible physical support.
- For explicit finger poses, prefer large, simple objects with clear contact surfaces.
- If a handheld prop is not essential and creates anatomy risk, simplify or remove it.

## 4. Hand-object contact
- Palm/fingers must actually contact the object.
- A handle must not pass through a palm.
- A hand must not appear to grip empty air.
- Objects must not float without support.
- For handbags, tote bags, umbrellas, cups, mugs, and similar handled objects, fingers should naturally wrap the handle when a handle grip is specified.
- If a small handle is error-prone, prefer palm support on the larger object body.
- If the prop is nonessential, cancel it rather than forcing an unstable grip.

## 5. Feet and lower-body stability
- Prefer simple, natural, ergonomic two-leg poses.
- Avoid wide crossing, twisting, entangling, or ambiguous leg overlap.
- Avoid excessive knee/lower-leg bending when unnecessary.
- Each leg must remain traceable from hip to foot.
- Keep legs visually separated where practical.
- For seated, crouching, stair, or similar poses, use an easily identifiable support relationship.
- Do not create difficult leg poses merely for variation.
- Shoes must not reveal malformed or duplicated feet/toes.

### Long-skirt + sofa restriction
When Inaria wears a long skirt while sitting on a sofa:
- do not use highly curled, deeply crossed, fully tucked-under, or heavily occluded legs;
- prefer both legs naturally forward, both naturally to one side, or one leg naturally down with the other extended;
- keep feet reasonably visible and spatially understandable;
- if a natural curled feeling conflicts with stable feet, change the pose instead of forcing the curl.

## 6. Wearables and straps
- Every strap must visibly connect to the bag/object body.
- Straps must naturally contact the shoulder, chest, or body contour.
- No disappearing, broken, floating, unsupported, or body-penetrating straps.
- Straps must not pass through an arm or create a false limb.
- The bag must have believable physical support.
- If complex occlusion threatens anatomy stability, simplify or remove the bag.

## 7. Container-object structure
For cups, mugs, teapots, pots, and similar containers:
1. Establish complete object structure first.
2. Establish hand placement and contact second.
3. Integrate the object into the composition third.

Cup/mug: body and handle must be connected; no missing, detached, duplicated, or floating handle; hand must contact handle or body when held.

Teapot: body, handle, and spout must form one coherent object; normally one main handle; spout naturally connected; no duplicate handles, missing spout, broken handle, or detached parts.

If a small handle is too difficult, use palm support on the larger body when the task permits.

## 8. False-limb prevention
Inspect sleeves, skirts, coats, bags, straps, cups, books, phones, umbrellas, plants, rails, furniture, background structures, clothing folds, and the opposite arm. No background or object may create a convincing third hand, third arm, third leg, or extra foot.

## 9. Local repair priority
1. Fingers / toes.
2. Wrist / palm / arm / shoulder connections.
3. Hip / leg / knee / ankle / foot connections.
4. Center of gravity and body ergonomics.
5. Hand-object or wearable connections.
6. Background, props, and effects.

Prefer localized repair; do not redesign the whole image when a local correction is sufficient.

## 10. QA hard gates
An image cannot PASS when clearly showing:
- extra/missing limb;
- extra/missing/fused/duplicated fingers or toes;
- wrong limb topology;
- impossible joint or body connection;
- obvious false limb;
- unsupported floating limb;
- broken or body-penetrating wearable strap;
- hand gripping empty air when contact is required;
- detached/floating container parts;
- clearly malformed feet or legs.

Natural occlusion is not automatically a failure. If a digit or structure cannot be reliably determined, require human inspection rather than guessing.

## 11. Dataset rule
A beautiful or high-resolution image with an obvious anatomy or structural failure is not a valid LoRA training image. Anatomy stability is a first-class dataset requirement.