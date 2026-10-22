# ANATOMY_STABILITY.md — Shared Human Anatomy & Generation Stability Standard

## Authority
This is the project-wide hard standard for human anatomy, pose stability, object contact, and generation-stability planning. It applies to all Production Workers during prompt/design construction and generation. Downstream QA may use it as an inspection reference.

If another project file conflicts with this document, this document is authoritative for anatomy and generation stability.

## Core priority
Generation stability first → anatomy correctness → body ergonomics → background/effects → decorative complexity.

When an attractive but unstable action conflicts with a simpler stable action, use the stable action.

Conceptual drawing order: fingers/toes → body → background/effects.


## Pose, head-direction, gaze, and scene coherence — HARD RULE

Natural, physically plausible, scene-appropriate body language takes priority over pose novelty or batch diversity. Apply this rule to every character, visual style, camera angle, and wallpaper module.

### Coherence requirements
1. Design the main action from the actual scene, activity, clothing, props, and story context. The pose must look like a plausible action the person would naturally perform in that setting.
2. Treat torso orientation, shoulder line, neck position, head direction, facial orientation, and eye gaze as a coordinated system. They may differ when a clear, natural action explains the difference; do not make them point in conflicting directions without a believable reason.
3. The eye gaze must have a plausible target: the camera, the direction of travel, an object being handled, nearby scenery, another person, or a deliberate distant focal point.
4. Avoid conspicuous mismatches such as the head turned right while both eyes strongly look left, or the head bowed while the eyes unnaturally roll upward. For a downward head tilt, prefer a naturally lower gaze; for an upward head tilt, prefer a naturally forward or upward gaze, unless the scene clearly requires otherwise.
5. A slight eye movement or a natural over-the-shoulder glance is allowed when anatomically plausible and motivated by the action. Do not impose a rigid rule that head and eyes must always point in exactly the same direction.
6. Make neck rotation, chin angle, shoulder orientation, and torso twist physically compatible. Do not create a pose by specifying each body part independently without checking the resulting whole-body relationship.
7. When a requested or proposed action conflicts with anatomical stability, scene logic, or visual harmony, simplify or replace the action while preserving the theme and intended mood.
8. Do not force a unique pose for every image. Reusing a simple, natural action is preferable to inventing an awkward pose merely to increase variety.

### Priority order
**Natural anatomy and balance → head/neck/face/gaze coherence → action appropriate to scene and clothing → overall composition and mood → pose diversity and decorative flourish.**

This is a prompt-design and generation-planning rule. It does not require the Producer to perform post-generation QA or to rewrite an already locked Prompt.

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


### Whole-body structural continuity and torso–pelvis connection — HARD RULE

The body must read as one continuous, connected human structure, not as independently assembled upper- and lower-body parts. This rule applies to every pose, viewpoint, clothing style, and production module.

Required structural chain:
- head → neck → shoulder girdle / rib cage;
- rib cage → waist / lumbar region → pelvis;
- pelvis → left and right hip joints → thighs → knees → calves → ankles → feet.

Requirements:
1. Keep the torso, waist, pelvis, and both legs anatomically connected and spatially consistent. No detached-looking upper/lower body, broken or displaced waist, duplicated or misaligned pelvis, impossible torso-to-hip transition, or legs that appear to originate from the wrong location.
2. The rib cage and pelvis may tilt, rotate, lean, or twist independently within a plausible human range. Their relative angles must still read as a continuous spine-and-waist connection; do not force a rigid straight torso, but do not allow unexplained gaps, abrupt dislocations, or incompatible orientations.
3. Clothing, hair, skirts, swimwear, belts, furniture, props, shadows, and strong occlusion must not create the appearance that the torso is detached from the pelvis or that the legs are disconnected from the hips.
4. Preserve plausible body volume and transitions through the waist, abdomen, lower back, hips, and upper thighs. Avoid sudden changes of scale, impossible pinching, disconnected silhouettes, or perspective transitions that make the body appear cut apart.
5. Plan the body's major masses and connections before adding clothing folds, accessories, dramatic perspective, or decorative effects. If the requested pose makes the torso–pelvis relationship difficult to keep clear, simplify the pose while preserving the scene's intent.
6. This is broader than limb counting: a figure can have exactly two arms and two legs and still violate this rule if the torso, pelvis, or hip connections are structurally incoherent.

### Seated-pose biomechanics and support — HARD RULE

For every seated pose, explicitly design a coherent relationship among the rib cage, spine/waist, pelvis, hip joints, thighs, seat, and lower legs.

- Establish where the pelvis contacts and is supported by the seat or other surface. Do not place the torso as if seated while the pelvis floats, is displaced, or points in an incompatible direction.
- Make each thigh visibly or plausibly originate from the correct side of the pelvis. Maintain a coherent pelvis-to-hip-to-thigh relationship even when one thigh is foreshortened, crossed, turned sideways, or partly hidden.
- Align the torso's lean and rotation with a plausible waist/spinal transition and pelvic orientation. Leaning forward, reclining, or twisting is allowed when the body connection and balance remain believable.
- Give the body a plausible center of gravity and contact/support relationship with the seat, backrest, floor, and/or feet as appropriate to the pose. Do not require feet to touch the floor if the seat height or pose makes that implausible; the support relationship must nevertheless make sense.
- Avoid complicated leg crossing, deep curling, extreme torso twist, and heavy clothing occlusion when these combine to obscure the pelvis or make the leg origins ambiguous.
- Do not treat “sitting naturally,” “stable posture,” or “correct anatomy” as sufficient by themselves. Describe a clear, simple torso/pelvis/leg arrangement in the prompt when the pose is seated.
- A relaxed or asymmetrical pose is allowed. The target is anatomical continuity and plausible support, not a rigid medical or military posture.

Priority:
**continuous torso–waist–pelvis–hip structure + plausible support and balance > pose complexity, dramatic twist, or decorative styling.**

### Floor side-sitting and crossed-leg stability — HARD RULE

Floor side-sitting is an allowed, common, graceful pose and must not be removed from pose variety by default. However, side-sitting with folded or overlapping legs is a high-risk configuration for thigh thickening, merged silhouettes, broken lower-leg continuity, and ambiguous knee/ankle/foot attachment. Design the leg arrangement explicitly rather than relying on the phrase “sitting on the floor with legs crossed to one side.”

Before adding clothing, hands, props, or background detail, establish:
- the pelvis's exact position on the floor and its natural support relationship;
- which leg is in front and which is behind;
- each thigh's direction from its own hip;
- the direction and bend of each knee;
- each calf's continuation toward its own ankle and foot, if visible;
- the front-to-back overlap order and the portions of each leg that remain readable.

Requirements:
1. Prefer a relaxed, lightly overlapping side-sit in which both legs fold naturally toward the same side and their main contours remain distinguishable. A natural asymmetrical arrangement is allowed; the pose need not be perfectly mirrored.
2. Keep each leg traceable as its own continuous chain: hip → thigh → knee → calf → ankle → foot. Even when the rear leg is partly hidden, its visible segments must agree with a plausible continuous limb path.
3. Make the near/far order clear around the thighs, knees, calves, and ankles. Avoid long tangencies where two leg contours merge into one thick mass, fork into an ambiguous shape, or appear to switch from one leg to the other.
4. Preserve the person's natural, reference-supported body build. Do not compensate for overlap by inflating the visible thigh/calf, widening both legs into one mass, artificially thinning a limb, or stretching the legs to expose more of them.
5. Keep the pelvis-to-hip transitions and knee directions plausible. Do not let a rear lower leg appear suddenly from beneath the front thigh, let a foot appear attached to the wrong leg, or make the knee, calf, ankle, and foot orientations contradict one another.
6. Clothing may cover part of the legs, but skirts, folds, shadows, and floor contact must not obscure every structural clue at the same joint or create a false leg contour. Avoid heavy fabric bunching directly over the main leg-overlap junction.
7. Use a three-quarter side view or another viewpoint that reveals the leg arrangement when appropriate. Do not force a frontal view if it compresses both legs into one silhouette.
8. Choose medium, three-quarter, or full-body framing according to the scene. Do not force head-to-toe visibility or both feet into a narrow frame if that makes the legs crowded or distorted.
9. If deep crossing, tight curling, extreme foreshortening, or clothing occlusion makes the leg paths ambiguous, reduce the overlap or switch to a simpler side-sitting variation while preserving the scene's mood. Do not ban all floor side-sitting; prefer a stable variant over an unnecessarily intricate one.

Design preference by risk:
- Preferred: lightly overlapping legs folded naturally to one side, with readable knee and calf contours.
- Use when clear: front leg angled slightly forward and rear leg folded farther back, with a consistent near/far relationship.
- High risk: tightly stacked thighs, deeply entangled legs, both knees and calves compressed into one area, or heavy skirt coverage combined with a narrow/full-body frame. Simplify these before generation.

Priority:
**two distinct continuous leg paths + natural body proportions + clear front/back order > deep crossing, complete foot visibility, or decorative pose complexity.**

This is a prompt-design and generation-planning rule. It does not require the Producer to perform post-generation QA or to rewrite an already locked Prompt.

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

### Hand-separation and no-interlacing rule — HARD RULE

Both hands must remain anatomically distinct and visually traceable. **Do not design a pose in which fingers from the left and right hands interlace, weave between one another, or become intricately interlocked.** Treat interlaced-finger poses as prohibited during prompt design, including ten-finger interlocking, clasped prayer hands with interwoven fingers, and similar hand-to-hand configurations.

This is a design prohibition, not merely a negative-prompt suggestion. Do not first specify an interlaced or high-risk hand action and then attempt to cancel it with wording such as “do not interlace fingers,” “no complex finger crossing,” or “correct hand anatomy.” Remove the high-risk action from the proposed composition before writing the final prompt.

Do NOT design:
- interlaced, interwoven, or ten-finger-interlocked hands;
- prayer/clasping poses that require the fingers of both hands to weave between each other;
- crossed, stacked, or overlapping hands that obscure finger ownership or palm boundaries;
- both hands placed together on one knee or one thigh;
- hands positioned so closely that fingers merge visually or their left/right ownership cannot be read.

Prefer a clear alternative that preserves the scene's intent without interlacing, such as one hand resting on the chest and the other relaxed separately, each hand resting on a different knee, one hand holding a simple object while the other remains apart, or both hands visibly separated with natural, uncomplicated fingers. Do not use “hands together,” “clasped hands,” or “praying hands” as a default if the phrase could imply interlaced fingers; specify a safe alternative action instead.

For seated poses, the phrase “hands on knees” does NOT mean both hands may be placed together. Prefer clearly separated placement, such as:
- left hand naturally resting on the left knee and right hand naturally resting on the right knee;
- one hand resting naturally on a thigh while the other remains clearly separated;
- both hands naturally relaxed beside the body.

If a requested scene implies an interlaced-finger pose, preserve the theme or emotion but replace the hand action before generation. The rule is about preventing interlacing and ambiguous hand boundaries; it is not a blanket ban on all poses where the hands are near each other.

Priority:
**no interlaced fingers + clearly distinct left/right hand anatomy > requested hand gesture detail > decorative hand positioning.**

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

### Leg overlap and occlusion clarity — HARD RULE
When the legs cross, overlap, or partially hide one another, design the front-to-back order before adding clothing, footwear, or background detail.

- Each leg must remain a single continuous limb from its own hip through its thigh, knee, calf, ankle, and foot. Do not let the visible portion of one leg appear to continue into the other leg.
- Make the near/far relationship unambiguous at the knees, calves, ankles, and feet. Avoid tangencies where two limb contours touch for a long distance and merge into one thick or forked shape.
- Do not place a foot at an angle or position that makes it appear attached to the wrong leg. The visible ankle must lead naturally into that leg's own foot.
- If a crossed-leg pose makes the knee direction, leg origin, or ankle-to-foot connection unclear, simplify the crossing, separate the legs, or choose a more stable pose. Do not rely on shadows or clothing folds to explain an otherwise ambiguous structure.
- Skirts, long dresses, coats, blankets, furniture, and strong shadows may conceal parts of the legs, but must not imply extra legs, severed legs, impossible joints, or a leg emerging from the wrong side of the pelvis.
- Natural occlusion is acceptable; a limb that cannot be traced reliably must not be made artificially visible through invented anatomy.

Priority:
**two distinct, continuous leg paths + clear front-to-back order + plausible joint and foot connections > complicated crossing or pose styling.**

### Crossed-leg foot ownership and toe orientation — HARD RULE

Crossed legs are a higher-risk pose because overlap can make the lower leg appear to continue into the wrong foot, and can cause the left/right foot or toe direction to be reversed. Do not introduce this pose by default when the prompt only asks for a seated person.

- If crossing is not required by the intended pose, prefer uncrossed legs or a simpler folded-leg arrangement. Do not use crossing as an automatic embellishment for a full-body seated image.
- If a crossed-leg pose is intentionally selected, define which leg is in front, which leg is behind, and where each knee, ankle, and foot belongs before generation.
- Preserve anatomical left/right ownership: trace each foot from its own hip through thigh, knee, calf, and ankle. Do not mirror, swap, or attach the visible foot to the opposite leg to make the crossing look simpler.
- The toes must point in a direction consistent with that same foot's ankle, arch, heel, and orientation. Do not reverse the toe line, create a mirrored foot, or let the toes appear to belong to the other leg.
- At the crossing point, keep the front/back order readable and avoid merging the lower-leg contours. The lower leg underneath must continue plausibly behind the upper leg and emerge from a spatially consistent ankle/foot position.
- Do not force both feet or all toes to be visible. Natural occlusion or framing that hides a high-risk foot is preferable to exposing a malformed, reversed, or ambiguously attached foot.
- If the leg crossing, skirt hem, perspective, or crop makes left/right foot ownership unclear, simplify or remove the crossing before generation. Do not rely on “correct feet,” “correct toes,” or negative wording alone to rescue an unstable pose.

Priority:
**correct left/right foot ownership + continuous ankle-to-foot connection + coherent toe orientation > crossed-leg styling or forced visibility of both feet.**

### Duck-sit (wariza / legs folded outward) stability

Duck-sit is an optional seated-pose choice, not a required pose for every batch. Because names vary by language and region, describe the geometry instead of relying on the label alone.

- The pelvis/buttocks rest on the floor, with both knees bent and the lower legs folded outward to either side of the hips.
- Keep each thigh connected to its own hip and each lower leg connected through its own knee and ankle; do not merge both legs into one broad shape.
- Keep the left and right feet naturally aligned with their respective ankles and lower legs. Do not twist a foot around merely to make both feet visible.
- Avoid forcing a perfectly symmetrical knee spread or full visibility of both feet when that makes the pose stiff or anatomically ambiguous.
- Plan skirt drape and hem coverage together with the pose. Fabric may naturally conceal parts of the legs or feet, but must not suggest broken joints, extra limbs, or feet emerging from the wrong side.
- If the pose becomes crowded in the selected shot, simplify the leg spread, adjust the camera angle, allow natural cropping, or choose another seated pose.

Priority:
**two continuous leg paths + natural knee/ankle/foot orientation + outfit-appropriate drape > perfect symmetry or full visibility of both feet.**

### Bare toes and open-toe footwear — HARD RULE
When bare toes or toes visible through open-toe footwear are shown, preserve a coherent foot structure and a clearly readable toe arrangement.

- A visible bare foot has five toes; do not create extra, missing, duplicated, fused, forked, or merged toes.
- Toes must emerge from the front of the same foot in a plausible anatomical order and scale. Do not turn shoe straps, shadows, floor lines, highlights, or nearby objects into apparent extra toes.
- For sandals, open-toe heels, slippers, and other open-toe shoes, keep the toe area, shoe upper/straps, footbed, and sole as distinct, physically coherent parts. Straps may cross the foot but must not look like cut-off toes, extra digits, or fused skin.
- The foot must sit naturally inside the footwear: toes should emerge from the correct opening, the heel/ankle should align with the shoe, and the foot must not float above, sink through, or extend impossibly beyond the footbed.
- Do not force toe visibility when the shoe design or camera angle would naturally conceal them. Fully enclosed shoes and naturally occluded toes are not failures merely because individual toes cannot be counted.
- If toe anatomy is difficult to render clearly, prefer a simpler footwear design, a less obstructed angle, or a composition that does not prominently expose the toes.

Priority:
**coherent foot anatomy + correct toe arrangement + clear separation from straps and shoe structure > intricate open-toe footwear detail.**

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
Visible fingers/toes and important hand/foot contours must have sufficient visual separation from the background to remain clearly distinguishable. This includes preserving the boundaries between adjacent fingers/toes, between the digits and the palm/foot, and between anatomy and nearby objects.

Do NOT place high-risk background detail directly behind or through important anatomy, including:
- thin branches, rails, wires, window frames, foliage, flower stems, grass, hair strands, or decorative lines behind fingers;
- dense leaves, flowers, gravel, patterned flooring, wood grain, or other high-frequency textures behind bare toes or feet;
- background elements with skin-like, clothing-like, or accessory-like colors that can visually merge with hands or feet;
- high-contrast edges that cut directly through fingers, toes, palms, wrists, ankles, or foot contours;
- particles, lighting effects, straps, props, or decorative elements that visually break the silhouette around hands or feet;
- background lines or object edges that align with a finger or toe and appear to extend it, split it, or create an additional digit;
- narrow gaps or dark seams that merge with finger/toe boundaries and make adjacent digits appear fused or duplicated.

For hands, do not treat a visible cluster of finger-like shapes as sufficient. The palm-to-finger attachment, individual finger boundaries, and overall hand silhouette must remain coherent. When a hand touches or holds an object, distinguish the hand's contour from the object's edge and show a plausible contact point rather than merging the two silhouettes.

For feet, distinguish the toe line from shoe straps, sandal edges, footbed borders, floor seams, and shadows. Do not let these elements create a false toe count or obscure the foot's connection to the ankle.

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

## Character body-shape fidelity and cross-image stability — HARD RULE

Anatomical correctness and plausible proportions are necessary, but they are not sufficient to preserve a specific person's body shape. A figure may remain within a broad range of normal human proportions while still visibly drifting away from the supplied reference or established character baseline.

### Shape-fidelity requirements
1. When the applicable reference clearly shows a body region, preserve its visible shape and relative dimensions as part of the person's recognizable build. This includes shoulder width; upper-arm and forearm thickness; torso and waist width; pelvis and hip silhouette; thigh and calf width; ankle and wrist thickness; and the relative transitions among these regions.
2. Do not arbitrarily add or remove apparent body volume, muscularity, fullness, slimness, or contour definition. A result can be anatomically plausible yet still fail shape fidelity if the person's build has materially changed without a task-based reason.
3. Changing pose, clothing, footwear, scene, lighting, crop, or camera composition does not by itself authorize redesigning the person's build.
4. Allow differences that are reasonably explained by pose, foreshortening, perspective, occlusion, clothing construction, or lighting. Do not mistake every apparent pixel-width change for a body-shape change; judge the visible anatomy in context.
5. Do not use beauty styling, fashion-model conventions, athletic styling, or a generic ideal body as a substitute for the actual reference person's build.
6. If the relevant region is not sufficiently visible or the view is too distorted to judge, do not claim exact preservation. Use only the supported evidence and mark the relevant assessment uncertain when QA is responsible for the decision.
7. Do not enforce a single silhouette across genuinely different poses. Preserve the underlying build while allowing natural pose-dependent contour changes.

### Cross-image stability
For a set intended to depict the same person, stable identity and body-shape traits must remain coherent across images. Review not only whether each image looks individually plausible, but also whether the set introduces unexplained changes in facial identity, apparent age, body build, limb thickness, body-region ratios, or rendering style.

A candidate may pass basic anatomy checks and still be unsuitable for a same-person dataset if its visible shape materially conflicts with the established reference or reliable comparison images.

Priority:
**structural anatomy + reference-supported body-shape fidelity + natural pose-dependent variation > generic beautification or arbitrary redesign.**

