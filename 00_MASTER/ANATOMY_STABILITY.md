# ANATOMY_STABILITY.md — Shared Human Anatomy & Generation Stability Standard

## Authority
This is the project-wide hard standard for human anatomy, pose stability, object contact, and generation-stability planning. It applies to all Production Workers during prompt/design construction and generation. Downstream QA may use it as an inspection reference.

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


### Hand topology and handedness lock
Hand correctness must be evaluated as a connected anatomical structure, not as an isolated five-finger count.

For every visible hand, verify the chain in order:
1. character's shoulder;
2. upper arm;
3. forearm;
4. wrist;
5. palm;
6. fingers.

The hand must remain connected to the correct side of the character's body throughout this chain.

### Left/right handedness rule
- Left/right is defined from the character's own anatomical perspective, never from the viewer's screen-left/screen-right position.
- Do not determine handedness from the final hand position alone.
- Trace shoulder → upper arm → forearm → wrist → palm to confirm whether the hand is truly the character's left or right hand.
- If a task specifies a left/right hand action, the specified hand must remain on the correct anatomical side.
- Never accept a mirrored or swapped hand merely because the pose looks visually plausible.

### Back-view handedness high-risk rule
BACK and BACK_3/4 views require additional handedness verification because the character's left/right sides are visually reversed from the viewer's intuitive screen orientation and the arms may be partially hidden by the torso, hair, or clothing.

For BACK/BACK_3/4:
- keep the two arms spatially separated whenever practical;
- avoid hands crossing or wrapping ambiguously across the center of the back/body;
- avoid placing both hands so close together that their arm origins cannot be traced;
- if one hand performs a task, keep its shoulder-to-hand path visually traceable;
- if the correct left/right identity cannot be established from visible evidence, classify as REVIEW rather than guessing.

### Hand-structure failure rule
If the wrist, palm, or arm topology is visibly malformed, do not treat a correct five-finger count as a PASS. A malformed palm can propagate errors into finger shape, count, orientation, and attachment.

Therefore QA must check both:
- **topology:** correct shoulder → arm → wrist → palm connection and correct left/right identity;
- **digit structure:** five natural fingers with correct attachment, separation, orientation, and proportion.

Priority:
**correct anatomical side + continuous limb topology + natural palm/wrist structure > finger count alone.**

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

### Hand-separation high-risk rule
Both visible hands must remain clearly separated whenever the composition allows it.

Do NOT design:
- crossed hands;
- overlapping or stacked hands;
- both hands resting on the same knee;
- both hands placed together on one thigh;
- interlocked fingers;
- hands positioned so closely that fingers or palm boundaries overlap or become difficult to distinguish.

For seated poses, the phrase "hands on knees" does NOT mean both hands may be placed together. Prefer clearly separated placement, such as:
- left hand naturally resting on the left knee and right hand naturally resting on the right knee;
- one hand resting naturally on a thigh while the other remains clearly separated;
- both hands naturally relaxed beside the body.

The rule is about spatial separation, not a blanket ban on seated poses or hands resting on knees.

If a planned pose causes the two hands to overlap, touch, merge visually, or obscure each other's fingers, redesign the hand action before generation.

Priority:
**clear left/right hand separation > pose complexity > decorative hand positioning.**

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

## 9. Anatomy–background separation

Correct anatomy is not sufficient if fingers, toes, hands, or feet visually merge into the background. Generation planning must protect both **anatomical correctness** and **anatomical readability**.

### Core rule
Visible fingers/toes and important hand/foot contours must have sufficient visual separation from the background to remain clearly distinguishable.

Do NOT place high-risk background detail directly behind or through important anatomy, including:
- thin branches, rails, wires, window frames, foliage, flower stems, grass, hair strands, or decorative lines behind fingers;
- dense leaves, flowers, gravel, patterned flooring, wood grain, or other high-frequency textures behind bare toes or feet;
- background elements with skin-like, clothing-like, or accessory-like colors that can visually merge with hands or feet;
- high-contrast edges that cut directly through fingers, toes, palms, wrists, ankles, or foot contours;
- particles, lighting effects, straps, props, or decorative elements that visually break the silhouette around hands or feet.

### Visual-clearance rule
A complex background is allowed. The background does **not** need to be plain, empty, or heavily blurred. However, the local area immediately surrounding important hands/feet must provide enough contrast, negative space, depth separation, or controlled detail for the anatomy to remain readable.

Use one or more of the following when needed:
- cleaner background area behind the hand/foot;
- depth-of-field separation;
- tonal or color contrast;
- controlled lighting separation;
- repositioning the limb away from dense background detail;
- simplifying only the local background region rather than the whole scene.

### Design-time requirement
Background selection must be evaluated together with pose and anatomy during task design. Do not assume that a correct hand/foot pose will remain correct after a visually confusing background is added.

### QA rule
If fingers/toes are visibly present but their boundaries are materially obscured by background fusion, treat the anatomy as **not reliably readable**. If the structure cannot be determined from visible evidence, report REVIEW rather than guessing PASS. A clearly fused or malformed result remains FAIL.

Priority:
**anatomical correctness + anatomical readability > background complexity/decorative detail.**

## 10. Local repair priority
1. Fingers / toes.
2. Wrist / palm / arm / shoulder connections.
3. Hip / leg / knee / ankle / foot connections.
4. Center of gravity and body ergonomics.
5. Hand-object or wearable connections.
6. Background, props, and effects.

Prefer localized repair; do not redesign the whole image when a local correction is sufficient.

## 11. QA hard gates
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

## 12. Module-specific dataset boundary
Anatomical stability is a project-wide image-quality requirement. Whether a candidate is suitable for a particular training dataset is determined by that module's dataset and QA specifications. This CORE document does not define LoRA-specific dataset acceptance.

## 13. Mirror / reflection composition risk

Mirror/reflection compositions are high-risk because the image model may generate two independently interpreted instances of the same character. Typical failure modes include:
- mirror and real character have different poses/actions;
- mirror character has malformed, blurred, duplicated, missing, or otherwise unstable limbs/digits;
- mirror and real character have inconsistent clothing, accessories, hairstyle, or appearance;
- both character instances individually appear plausible but their pose relationship is inconsistent.

### Mirror hard rule
Do not design a composition containing both a fully visible real character and a fully visible mirror/reflection character.

If a mirror is required, only these two configurations are permitted:

**A. Mirror-only character**
- Only the character inside the mirror is visible.
- No separately readable real-world character appears outside the mirror.
- Treat the mirror character as the single primary character instance.

**B. Dominant mirror character + minimal real-world partial presence**
- The mirror character is complete, clear, and the sole fully readable character.
- The real-world character may appear only as a small partial/back view or similarly limited fragment.
- The outside character must not expose enough body structure to become a second independently readable pose.
- Avoid readable full arms, hands, legs, feet, or other pose-defining structures outside the mirror.

**C. Prohibited**
- Fully readable character outside the mirror + fully readable character inside the mirror.
- Two independently readable character instances whose poses can be compared.

### Design priority
Prevent mirror ambiguity during composition design rather than relying on downstream QA to rescue the image. Prefer a simpler single-character composition over a visually attractive but high-risk dual-instance mirror composition. If the mirror does not materially improve the task, remove or avoid the reflection.

## 14. Body-proportion stability

Human body proportions are a project-wide anatomy requirement, not a style preference.

The character's natural body proportions must remain consistent with the applicable MASTER / CHARACTER REFERENCE, including:
- torso length;
- pelvis proportion;
- thigh length;
- lower-leg length;
- total leg length;
- leg-to-torso relationship;
- overall limb proportions.

Do not elongate the legs or torso because of:
- elegance;
- beauty or fashion styling;
- model-like appearance;
- full-body composition;
- wide-angle perspective;
- low-angle photography;
- dynamic walking poses;
- clothing design;
- high heels.

**Slim does not mean long-legged. Elegant does not mean fashion-model proportions.**

### Seated-pose rule
Seated, crouching, kneeling, stair, and similar poses may visually shorten or distort the apparent leg length. These images may remain in the dataset, but they must not be used alone as the primary reference for natural leg proportions.

If a seated image makes body proportion difficult to judge because of leg overlap, clothing occlusion, perspective, or pose, classify it as **REVIEW**, not automatic FAIL.

### High-heel rule
High heels are allowed in the dataset. However, heel height, foot angle, and the resulting visual leg-line effect must not be interpreted as a change to the character's underlying body proportions.

A high-heel image should be reviewed for actual anatomy and proportion rather than judged by apparent leg length alone.

### Reliable proportion-reference images
Dataset proportion assessment should prioritize images with:
- standing posture;
- full-body visibility;
- front or front 3/4 view;
- natural stance;
- clearly visible legs;
- limited perspective distortion;
- minimal clothing occlusion;
- no reliance on high heels to create a long-leg appearance.

These images provide stronger evidence for the character's natural body-proportion baseline.

### Body-proportion QA classification
**PASS** — natural proportions are clearly consistent with the applicable reference.

**REVIEW** — pose, footwear, clothing, occlusion, or perspective makes the natural proportion difficult to determine reliably.

**FAIL** — clear unnatural leg/torso elongation, abnormal thigh/lower-leg ratio, or obvious fashion-model-style body stretching is visible.

The goal is not to make every image appear to have identical leg length. The goal is to preserve the same underlying natural body proportions across different poses, footwear, cameras, and scenes.
