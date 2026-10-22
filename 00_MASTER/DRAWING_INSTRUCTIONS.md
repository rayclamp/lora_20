# DRAWING_INSTRUCTIONS.md — Shared Drawing Stability Instructions

## Authority

This document is mandatory for every Production Worker during task design and image generation.

For anatomy, pose stability, object contact, and generation-stability details, `00_MASTER/ANATOMY_STABILITY.md` is the project-wide hard authority.

These rules are **generation rules, not QA rules**. Production Workers must use them while designing the Prompt and before generation. They do not judge the generated image after generation.

## Composition

- Output format is task-defined.
- Viewpoint and shot are module-specific.
- FULL-BODY does not mean distant shot; applicable wallpaper rules define composition diversity.
- Keep hands away from image edges.
- Keep important background objects and effects away from hands and fingers.
- Avoid unnecessary effects around fingers and toes.

# MANDATORY DRAWING-STABILITY RULES

The following rules are directly confirmed by the project owner and must be applied during composition and Prompt design.

### 1. Stability before action flourish

For every image, prioritize hand-generation stability before visual action complexity or elegance.

When a visually impressive action conflicts with a stable action, choose the stable action.

### 2. Stable action is selected at composition time

Choose the most stable and easiest-to-generate hand action during composition.

Do not design a difficult action first and rely on post-generation repair.

### 3. Conceptual drawing order

Plan the image in this order:

1. fingers and toes;
2. body and limb structure;
3. clothing and accessories;
4. background, props, effects, and decorative complexity.

This is a conceptual generation-planning order, not a literal claim about the model's internal rendering process.

### 4. Anatomy before decoration

Prioritize:

1. fingers and toes;
2. human ergonomics and structural connections;
3. body support, center of gravity, joints, and load;
4. background and effects.

### 5. Hand/background separation

Backgrounds and important objects must not overlap important hand structures.

During composition, keep rails, branches, flower stems, hair strands, straps, furniture edges, floor seams, patterns, and strong shadows from visually continuing through the palm or splitting finger outlines. Keep palm-to-finger attachment and hand-to-object contact easy to read. If boundaries are unclear, move the hand or object, simplify the local background, or choose a simpler action before generation.

### 6. Effect clearance around fingers

Do not place unnecessary effects around fingers. Prefer no effects immediately around fingers.

### 7. Safe natural occlusion

When compositionally appropriate, fingers may be hidden naturally behind an object, clothing, or the body.

Do not force visible fingers when natural occlusion produces a more stable image.

### 8. At least one clear hand

Keep at least one hand clear, complete, and easy to identify.

Avoid placing both hands simultaneously in high-difficulty poses, deep occlusion, or near the image edge.

### 9. One task per hand

One hand performs one primary task at a time.

### 10. Natural grips

Prefer common real-life grips with broad contact surfaces.

Avoid two- or three-fingertip pinching and difficult fingertip poses unless the task explicitly requires them.

### 11. Palm-facing-camera stability

When the palm faces the camera, avoid excessive perspective distortion.

### 12. Finger separation

Avoid fingers crossing or completely overlapping.

Maintain natural spacing whenever practical.

### 13. Hand separation — MANDATORY, NO INTERLACING

The two hands must remain clearly distinct during composition and prompt design. **Never design interlaced, interwoven, or ten-finger-interlocked poses.** This includes prayer or clasping actions if they imply that fingers from the two hands weave between each other.

This rule must change the action choice itself. It is not sufficient to write a high-risk action such as “hands clasped together” and append “do not interlace fingers” or “correct anatomy.” If the proposed action could lead to interlacing or merged finger contours, replace it before finalizing the prompt.

Do not design:
- interlaced or interwoven fingers;
- ten-finger-interlocked hands;
- prayer/clasping poses that imply interlaced fingers;
- crossed, stacked, or overlapping hands that obscure which fingers belong to which hand;
- both hands on the same knee or together on one thigh;
- hands so close that palm or finger boundaries become ambiguous.

Prefer a safe, scene-appropriate alternative: one hand resting on the chest while the other stays separate, each hand placed on a different knee, one hand holding a simple object while the other remains apart, or both hands relaxed with clearly separate outlines. Preserve the scene's mood while changing the hand action.

If hand-to-hand proximity is not essential, separate the hands. If a requested action implies interlacing, redesign the action before generation rather than relying on a negative prompt.

Apply 00_MASTER/ANATOMY_STABILITY.md as the authoritative hard standard. This is a prompt-design and generation-planning rule, not permission to perform post-generation QA, reject, repair, or regenerate an image.

### 14. Hand clearance from frame edge

Do not place important hands near the image edge where cropping may damage the structure.

### 15. Physical support for held objects

When a character holds an object, the object must provide a plausible physical support relationship.

### 16. Large/simple hand references

When a specific finger pose is required, prefer large, simple objects with clear shapes and natural contact surfaces.

### 17. Support and center of gravity

Before generation, confirm:
- support surface;
- center of gravity;
- joint direction;
- force/load;
- natural body support.

If no clear support exists, do not design limbs that require unnatural hovering.

### 18. Structure before visual flourish

First establish correct human structure and character-to-object connections.

Only then add visual complexity, decorative effects, or highly stylized action.

## 19. Whole-body continuity and seated-pose structure

Treat the person as one connected anatomical system, not separate upper- and lower-body pieces.

Before generation, define a clear connection path:
head/neck → rib cage → waist/lumbar region → pelvis → hip joints → thighs → knees → lower legs → ankles/feet.

For seated, reclining, side-sitting, or strongly twisted poses:
- establish the pelvis position and its contact/support surface first;
- connect the waist and rib cage to the pelvis with a plausible spine/soft-tissue transition;
- connect each thigh to the correct hip location;
- make torso lean, pelvic tilt/rotation, thigh direction, and the support surface mutually plausible;
- keep body volume and silhouette continuous through the waist, abdomen, lower back, hips, and upper thighs;
- simplify the pose if clothing, perspective, crossed legs, or occlusion makes these connections ambiguous.

Do not generate a figure whose torso appears detached from the pelvis, whose waist looks broken or displaced, whose legs appear disconnected from the hips, or whose upper- and lower-body orientations contradict each other without a plausible anatomical transition.

Natural bending, leaning, asymmetry, pelvic tilt, and torso rotation remain allowed. Do not force a rigid upright pose; require continuity, plausible joint relationships, and believable support instead.

A correct limb count alone is not enough. Structural continuity of the torso, pelvis, and hip connections is mandatory.

# SPECIAL STABILITY RULES

## 1. Wearable object connection

Backpacks, shoulder bags, and similar wearable objects must have a complete and believable connection between strap and object body.

Straps must naturally contact the shoulder, chest, or body contour.

Forbidden:
- disappearing straps;
- broken straps;
- straps passing through the body;
- floating straps;
- unsupported bags;
- straps creating false limbs.

If a bag requires complex front/back occlusion to work, simplify the bag or remove it.

## 2. Limb-count and limb-source verification

The character must maintain normal human limb counts:

- two arms/hands;
- two legs/feet.

During composition, trace every visible hand back to its shoulder/arm source.

Do not allow:
- third hands;
- duplicate palms;
- independent palms;
- ambiguous arm sources;
- props, sleeves, clothing, furniture, or background structures that resemble extra limbs.

If an action requires complex arm crossing or overlapping, simplify the hand configuration.

## 3. Hand-object contact

When holding an object, the palm/fingers and object must have clear physical contact.

For handles:
- fingers should naturally wrap the handle when a handle grip is intended;
- the handle must remain connected to the object;
- the handle must not pass through the palm;
- the hand must not appear to grip empty air.

For bags, tote bags, umbrellas, cups, and similar objects, prefer broad stable contact.

If a small handle creates high finger risk, use palm support on the larger object body when the task permits.

If the handheld prop is not necessary, remove it.

## 4. Lower-body stability

Prefer simple, natural, ergonomic leg positions.

Avoid:
- large leg crossings;
- twisting;
- entangling;
- ambiguous overlaps;
- excessive knee/lower-leg bending;
- positions where the leg source cannot be traced.

Maintain a clear:

hip → thigh → knee → calf → ankle → foot

path for each leg.

Do not create difficult leg poses merely to increase variation.

## 4A. Floor side-sitting and crossed-leg stability

Floor side-sitting is a valid, common pose and must remain available. Do not ban it by default. Because folded and overlapping legs can merge into thick shapes or create broken rear-leg contours, explicitly plan the leg geometry during composition.

Before generation, specify:
- where the pelvis rests on the floor;
- which leg is in front and which is behind;
- each thigh's direction from its own hip;
- the bend and direction of each knee;
- how each visible calf continues toward its own ankle/foot;
- which leg contours remain visible and which are naturally occluded.

Mandatory design rules:
- Prefer light, natural overlap with distinguishable thigh/knee/calf contours over tightly stacked or deeply entangled legs.
- Maintain two separate, continuous paths: each hip → thigh → knee → calf → ankle → foot. A hidden segment must not cause the visible segments to contradict one another.
- Avoid long contour tangencies that fuse the thighs or calves into one oversized mass. Do not use “slim legs” as a substitute for defining the front-to-back arrangement.
- Preserve the character's natural body shape. Do not artificially thicken the visible thigh/calf, merge both legs into one broad silhouette, or unnaturally thin/stretch a leg to solve the overlap.
- Keep the rear leg's visible knee, calf, ankle, and foot spatially consistent. Do not let a lower leg suddenly emerge from under the front leg or appear attached to the wrong hip.
- Keep skirt folds, shadows, and floor contact from obscuring every clue at the same joint. Avoid heavy fabric bunching at the main overlap junction.
- Prefer a three-quarter side view when it makes the leg arrangement easier to read. Do not force a frontal view when it compresses both legs into one silhouette.
- Select medium, three-quarter, or full-body framing based on the scene. Do not force full-body visibility or both feet into a narrow composition if that makes the legs crowded or distorted.
- If deep crossing, tight curling, strong foreshortening, or clothing occlusion makes the limb paths ambiguous, reduce the crossing or choose a simpler side-sitting variation. Preserve the pose's graceful mood rather than discarding side-sitting entirely.

Risk preference:
1. Preferred: lightly overlapping legs folded naturally to one side.
2. Acceptable when readable: front leg angled slightly forward, rear leg folded farther back.
3. High risk: tightly stacked thighs, deeply entangled legs, compressed knees/calves, or heavy skirt occlusion combined with a narrow frame; simplify before generation.

Priority: two distinct continuous leg paths, preserved body proportions, and clear front/back order take priority over deep crossing, full foot visibility, or decorative complexity.

Apply 00_MASTER/ANATOMY_STABILITY.md as the authoritative shared standard. This is a prompt-design rule, not permission for post-generation QA, rejection, repair, or regeneration.

## 5. Long skirt + sofa

When wearing a long skirt while sitting on a sofa, avoid:
- deeply curled legs;
- highly bent legs;
- crossed legs;
- fully tucked legs under the skirt;
- heavy leg occlusion.

Prefer:
- both legs naturally forward;
- both legs naturally to one side;
- one leg naturally down and one naturally extended.

Keep both feet spatially understandable when visible.

If natural curled comfort conflicts with stable leg structure, change the pose.

## 6. Containers

For cups, mugs, teapots, pots, and similar containers:

1. establish the container structure;
2. establish hand placement;
3. establish physical contact;
4. integrate the object into the composition.

### Cup / mug

- cup body and handle must form one connected object;
- hand must contact the handle or body when held;
- no missing, detached, duplicate, or floating handle;
- no hand gripping empty air.

### Teapot

Maintain a coherent:

body + one main handle + spout

structure.

The spout must connect naturally to the body.

Avoid:
- two main handles;
- missing spout;
- broken handle;
- detached parts.

If a small handle is too difficult, use palm support on the larger body when the task permits.

## 7. Background and anatomy readability

Background complexity must never be allowed to compromise hand/foot readability.

Avoid placing branches, rails, wires, foliage, flower stems, hair strands, dense textures, straps, particles, or decorative edges directly through important fingers, toes, palms, wrists, ankles, or feet.

Use local negative space, contrast, depth separation, lighting separation, or local background simplification when needed.

## 8. Body-proportion stability

Maintain natural human proportions.

In particular:

- do not elongate thighs;
- do not elongate calves;
- do not vertically stretch the body;
- do not convert slimness into exaggerated long legs;
- do not convert elegance into fashion-model proportions.

Perspective, high heels, clothing, or dynamic poses must not be used as excuses for intentionally distorted proportions.

## 9. Mirror/reflection risk

Mirror/reflection compositions are high-risk for character datasets.

Do not intentionally create two fully readable character instances with independently readable poses.

Prefer a single-character composition.

# GENERATION WORKER APPLICATION

Before generation, the Worker must apply these rules while designing the Prompt and selecting the action, pose, object interaction, and background.

The Worker must simplify unstable designs before generation.

After generation, the Worker must **not** use these rules as a reason to self-QA, reject, repair, or regenerate the generated candidate. That is the responsibility of the downstream QA/rework pipeline.

## 19A. Scene-led action and head/gaze coherence

- Choose the main action because it naturally belongs in the scene, not merely because the batch needs a different pose.
- Before finalizing a prompt, coordinate torso direction, shoulder alignment, neck angle, head direction, facial orientation, and eye gaze as one coherent action.
- Give the gaze a plausible target such as the camera, path ahead, a held object, nearby scenery, or a distant focal point.
- Avoid obvious contradictions such as a head turned right with eyes strongly looking left, or a bowed head with eyes unnaturally looking upward, unless a clear and believable action explains it.
- Small natural gaze offsets and motivated over-the-shoulder glances are allowed; exact alignment is not mandatory in every image.
- If pose novelty makes the body, neck, face, or gaze awkward, simplify the pose. Do not trade naturalness for diversity.
- Scene logic and whole-body coherence take priority over unique action quotas. Similar natural poses may recur across a batch when they fit the scene.

## 20. Character body-shape preservation during prompt design

Correct anatomy and broadly natural proportions do not guarantee that the reference person's build has been preserved. During prompt design, explicitly protect the visible body shape when the task is to depict the same person.

- Where the reference provides clear evidence, preserve the person's overall build and the relative width/shape of shoulders, arms, torso, waist, pelvis/hips, thighs, calves, ankles, and wrists.
- Do not let “natural proportions,” “actual build,” “slim,” “elegant,” or similar general wording stand in for the explicit requirement to preserve the reference-supported body shape.
- Do not arbitrarily thicken or thin limbs, add muscularity/fullness, reshape the waist/hips, or change the overall silhouette to match a generic beauty or fashion ideal.
- Pose, clothing, footwear, scene, lighting, and camera changes may cause reasonable visual differences but are not permission to redesign the person's underlying build.
- Avoid unsupported numeric promises such as an exact percentage of width preservation when the generation interface cannot reliably enforce or measure that value.
- If the requested pose or framing makes body shape hard to judge, choose a clearer and more stable composition when compatible with the task. Do not contort the pose merely to expose every body region.
- This is a generation-time instruction only. The Producer must not perform post-generation visual QA, approve/reject the result, or regenerate a consumed prompt. The independent IMAGE_QA process owns acceptance decisions.

Apply 00_MASTER/ANATOMY_STABILITY.md as the authoritative shared standard.


## 20A. Framing must not override body-shape preservation

During prompt design, do not treat full-body framing as a default requirement. Choose close-up, bust/half-body, medium, three-quarter, or full-body framing according to the specific task. A wallpaper does not need to show the entire person in every image.

Only require head-to-toe visibility or visible footwear when that is a meaningful task-specific goal. Do not automatically append “full-length,” “no cropping,” “head and feet fully visible,” or equivalent wording to every prompt. If a full-body composition would force the person to be made unusually small, pushed into an awkward pose, or distorted to fit the frame, choose a natural crop or a more character-dominant composition instead.

Preserve the reference-supported silhouette and relative width of thighs, calves, knees, ankles, hips, and torso before optimizing framing, negative space, background visibility, or outfit completeness. Use plausible camera distance and lens perspective; do not compensate for a difficult frame by widening limbs, stretching the body, or exaggerating perspective. Do not invent numeric body-width guarantees that the generation interface cannot reliably enforce.

The prompt designer must make a deliberate shot-size choice for each Task and must not blindly inherit a universal full-body template. Framing diversity is encouraged when natural for the scene, but no shot type or crop is mandatory for every image.

This is a prompt-design rule, not a post-generation QA instruction. Existing locked prompts and historical production records remain unchanged.


## 21. Small accessory and tiny-detail restriction

Unless the user explicitly requests otherwise, do not add tiny accessories or decorative objects that cannot be rendered with clear shape, material, and structure at the intended image scale.

Default exclusions include:
- rings, bands, and other small finger jewelry;
- tiny stud earrings, miniature jewelry, and similarly indistinct ear accessories;
- micro-decorations on fingers, fingernails, or the skin surface;
- other miniature adornments likely to appear as dirt, dark specks, stains, blurry marks, or anatomical defects.

Generation requirements:
- Keep fingers and visible skin surfaces clean and natural; do not add unexplained dots, stains, or accessory-like marks.
- Do not add tiny accessories merely to make a character look more detailed or elegant.
- Do not replace a prohibited tiny accessory with a dark dot, color spot, or other ambiguous mark.
- Larger, clearly readable accessories remain allowed when compatible with the selected module's rules and the user's request.
- If the user explicitly requests a small accessory, design it only when it can be made clearly visible and structurally recognizable; otherwise clarify or simplify the design rather than representing it as an ambiguous mark.

This is a generation-time design restriction shared by all modules, including UNIVERSAL_WALLPAPER, FESTIVAL_WALLPAPER, and LORA_IMAGE. It is not a post-generation QA instruction and does not authorize automatic regeneration.

## 22. Eye-closure state fidelity — HARD RULE

Eye state is a deliberate expression/composition choice and must be specified precisely during Prompt design. This rule applies whenever the Prompt Designer chooses a closed-eye expression or action; it does NOT depend on the user separately reminding the system.

### When closed eyes are intended

- Require both eyes to be fully and naturally closed: the upper and lower eyelids meet and the eye opening is completely shut.
- Do not show any visible iris, pupil, or white of the eye.
- Do not substitute half-closed eyes, drowsy eyes, squinting, lowered upper eyelids, or eyes that remain slightly open for fully closed eyes.
- State the closure requirement explicitly in the generated Prompt whenever closed eyes are selected; the words “relaxed,” “peaceful,” “sleepy,” “gentle expression,” or “closed eyes” alone must not be treated as sufficient precision.
- Keep the eyelids and surrounding facial muscles natural and relaxed. Do not force a strained squeeze, exaggerated wrinkles, or an unnatural facial expression merely to communicate complete closure.
- Apply this to any suitable scene, including sleep, rest, enjoying sunlight or a breeze, kissing, or interacting affectionately with a pet, whenever the designed expression calls for closed eyes.

### When open eyes are intended

- Preserve the designed open-eye state. Do not change an explicitly open-eyed expression into closed eyes.
- Coordinate eyelid state with the facial expression, head direction, gaze, and scene.

This is a shared prompt-design and generation-planning rule for all applicable image modules and visual styles. It is not a requirement to close the eyes in every image, and it does not authorize post-generation self-QA, rejection, repair, or regeneration. Existing locked prompts and historical production records remain unchanged.

