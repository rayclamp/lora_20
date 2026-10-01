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

### 13. Hand separation

Avoid hands covering each other.

If hand-to-hand contact is necessary, designate one primary hand and one auxiliary hand.

Do not design:
- crossed hands;
- stacked hands;
- both hands on the same knee;
- both hands together on one thigh;
- interlocked fingers;
- hands so close that palm or finger boundaries become ambiguous.

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

