# ANATOMY_STABILITY.md — Inaria 人體與生成穩定性硬性規範

## Core priority
Hands / feet stability first → body ergonomics → background / effects.

## Body topology lock
- Exactly two hands and two legs.
- Every visible hand: exactly five fingers.
- Every visible bare foot: exactly five toes.
- Correct left/right hand and foot identity.
- No extra, missing, fused, duplicated, split, or mutated digits.
- Natural shoulder → arm → wrist → palm connection.
- Natural hip → leg → ankle → foot connection.
- No extra limbs created by sleeves, clothing, props, bags, straps, plants, furniture, or background shapes.

## Hand stability
- Natural finger, knuckle, palm, wrist, and arm proportions.
- Prefer simple stable hand poses over complicated finger spreads, crossing, gripping, or multiple contacts.
- Reasonable occlusion by clothing, body, or an object is acceptable when it improves stability.
- Keep effects, particles, flowers, straps, rails, furniture, and background lines away from hands.
- Do not allow background or accessories to visually merge with hands or arms.

## Feet and legs
- Visible bare feet must have five naturally arranged toes.
- Shoes must not reveal malformed or duplicated toes/feet.
- Two legs must remain clearly connected to the hips.
- Keep weight distribution, support surface, and joints physically plausible.
- Avoid unnecessary extreme leg crossing, twisting, or impossible joint angles.

## False-limb prevention
Check sleeves, skirts, coats, bags, straps, props, plants, rails, furniture, cups, books, phones, and the opposite arm for shapes that could look like an additional limb.
Any convincing third-hand, third-arm, third-leg, or extra-foot illusion is a high-risk defect.

## Wearables and straps
- Every bag strap/handle must remain connected to the bag.
- Straps must naturally contact the shoulder/body.
- No broken, vanishing, floating, or body-penetrating straps.
- Straps must not cross through an arm or create a false limb.
- If a bag causes difficult occlusion, simplify or remove the bag. Human anatomy has priority.

## Pose design order
1. Establish two hands and two legs and their shoulder/hip connections.
2. Establish fingers/toes.
3. Establish center of gravity, support, and joint ergonomics.
4. Add clothing/accessories.
5. Add background, props, flowers, lighting effects, and decorative details.

## Local repair order
1. Fingers / toes.
2. Wrist / arm / shoulder connections.
3. Leg / knee / ankle / hip connections.
4. Center of gravity and body ergonomics.
5. Background, props, wearables, and effects.

## QA hard rejection
Do not PASS when there is an obvious extra/missing limb, wrong limb count, incorrect five-finger/five-toe structure, fused/duplicated digits, impossible limb connection, or obvious false-limb structure.
Natural occlusion alone is not a failure; if a digit count cannot be determined, mark it for human inspection.

## Dataset rule
A beautiful image with obvious anatomy failure is not a valid LoRA training image. Anatomy stability is a first-class dataset requirement.