# Inaria AI Studio — Character Department Specification

- **Department:** 01_CHARACTER — Character Design
- **Version:** v1.0
- **Last Updated:** 2026-09-05
- **Purpose:** Establish a reusable, long-term specification for Inaria's character identity, age variants, consistency evaluation, LoRA dataset selection, repair/rejection criteria, and character prompt standards. This document is subordinate to `00_MASTER/` and must not redefine or silently override Master rules.

---

## 1. Department Scope

The Character Department is responsible for character identity, appearance, hair, expression, age presentation, and character consistency.

It is **not** the owner of clothing, scene, pose/camera, prompt-generation workflow, or final QA decisions belonging to other departments. Character-related requirements supplied to other departments are handoff constraints, not permission to redesign their domains.

---

## 2. Character Standard — Inaria

### 2.1 Stable identity

- Name: 依娜莉亞 (Inaria)
- Sex: Female
- Ethnicity/background: Taiwanese / Asian
- Default setting: modern Taiwan, 2026
- Birthday: 1990-04-03
- Default age reference: 36 years old
- Age 20 tasks: use the user's designated age-20 standard portrait as the primary visual reference.
- Age 36 tasks: use the designated age-36 standard portrait as the primary visual reference when no other age/reference is specified.

The character identity must remain recognizable across clothing, scene, pose, camera, lighting, and composition changes.

### 2.2 Locked identity dimensions

The following are identity-critical and should remain stable unless a task explicitly authorizes a change:

1. Facial identity and overall facial structure.
2. Face shape.
3. Core facial proportions and placement of major features.
4. Character-defining hair color.
5. Overall body proportions.
6. Explicitly locked age presentation for the active age variant.

The available Master files do not define a more granular numeric specification for facial landmarks, exact hair length, exact eye geometry, or exact body measurements. Such values must **not** be invented in this specification. If future project work locks these details, they should be approved and documented through the project owner/director.

### 2.3 Hair

Hair is an important visual identity component, but hairstyle is a variable dataset dimension unless a specific task locks it.

- Preserve the established character hair color unless explicitly changed.
- Hairstyle may vary across dataset images to prevent the LoRA from binding identity to one hairstyle.
- Variations should remain plausible for the same character and age.
- Avoid changes that visually imply a different character rather than a hairstyle variation.

### 2.4 Eyes

Eye appearance is identity-sensitive.

- Preserve the established eye color and overall character identity.
- Do not introduce eye changes merely for visual novelty.
- Expression may vary while eye identity remains consistent.

The Master files do not provide a numeric iris color specification or exact eye geometry; therefore no invented color code or landmark measurement is locked here.

### 2.5 Body and anatomy

- Preserve intended body proportions across the dataset.
- Anatomy must remain humanly plausible.
- Each hand must have exactly five fingers.
- Each foot must have exactly five toes.
- No fused, duplicated, missing, elongated, or anatomically impossible fingers/toes.
- Limb angles, joints, balance, and center of gravity must remain plausible.
- Stable poses are preferred over unnecessarily complicated gestures.

These requirements follow the Character Master and Generation Rules.

---

## 3. Age Variants: 20 vs 36

### 3.1 Age 20

- Primary reference: the user's designated age-20 standard portrait.
- Goal: preserve Inaria's identity while presenting the character consistently as a 20-year-old adult.
- Age presentation must be visibly adult and internally consistent across face, styling, expression, and body presentation.
- Do not use age-36 references as the primary visual identity target when an explicit age-20 task is active.

### 3.2 Age 36

- Primary reference: the designated age-36 standard portrait when no other reference is specified.
- Goal: preserve the same underlying character identity with a mature adult presentation appropriate to age 36.
- Do not unintentionally regress the character toward the age-20 appearance.

### 3.3 Shared identity vs age-specific variation

Shared across both versions:

- Inaria's underlying facial identity.
- Core face structure and recognizable features.
- Established hair color.
- Intended body proportions, subject to explicit age-reference requirements.

Allowed to vary by age:

- Apparent maturity of facial presentation.
- Age-appropriate styling and expression.
- Age-specific visual reference characteristics explicitly established by the designated portrait.

If an age-variant distinction is unclear, the designated reference image takes priority over inferred age styling.

---

## 4. Character Consistency Evaluation

Character consistency should be evaluated as a whole, not by one isolated facial feature.

### 4.1 Tier A — Identity-critical

A severe failure in these areas normally makes the image unsuitable for the character dataset:

- Clearly different face identity.
- Major face-shape mismatch.
- Major alteration of core facial proportions.
- Wrong locked hair color.
- Wrong active age variant when the age difference is visually substantial.
- Severe body-proportion distortion.
- Anatomically impossible hands/feet or major body deformation.

### 4.2 Tier B — Important but potentially repairable

- Mild facial asymmetry caused by rendering.
- Slight hairstyle drift while hair color and identity remain intact.
- Small expression-induced changes in eye or mouth shape.
- Minor proportion drift that does not change the character's identity.
- Minor hand/finger rendering defects that can be cleanly corrected without changing pose or character identity.

### 4.3 Tier C — Non-identity issues

These belong primarily to other departments unless they affect character identity:

- Clothing construction or styling problems.
- Scene/background problems.
- Camera/composition problems.
- Lighting/style inconsistencies.

Such issues should be handed to the responsible department rather than silently redefined by Character.

### 4.4 Practical consistency test

An image passes the character check when:

1. It is immediately recognizable as Inaria when compared with the active reference.
2. The face remains structurally consistent rather than merely sharing generic features.
3. Hair color and core identity traits are preserved.
4. The active age presentation is correct.
5. Body proportions remain plausible and consistent.
6. Hands, feet, and anatomy contain no severe defects.
7. Variations in hairstyle, expression, pose, camera, clothing, and scene read as variations of the same person rather than a different person.

---

## 5. LoRA Dataset Image Selection Standard

The dataset should teach **the person**, not one outfit, pose, scene, or composition.

### 5.1 Required variation

Across the dataset, intentionally vary:

- Hairstyle.
- Clothing.
- Scene/background.
- Pose.
- Camera angle and framing.
- Expression.
- Lighting.
- Composition.

Character identity should remain stable while external conditions vary.

### 5.2 Character-first selection

A visually spectacular image should not be selected if its character identity is weak. A simpler image with strong identity and clean anatomy is preferable.

### 5.3 Dataset rejection triggers

Reject an image when it contains:

- A different-looking face that cannot reasonably be repaired.
- Major age-variant confusion.
- Wrong locked hair color.
- Severe facial deformation.
- Missing/extra/fused/duplicated fingers or toes that cannot be reliably corrected.
- Extra limbs or major anatomical impossibility.
- Severe body-proportion distortion.
- A correction that would require changing a large portion of the character or reconstructing identity from scratch.
- Repeated near-duplicate imagery that adds little character information.

### 5.4 Dataset balance principle

Do not allow the dataset to accidentally teach:

- one hairstyle as the identity,
- one outfit as the identity,
- one background as the identity,
- one pose as the identity,
- one camera angle as the identity.

---

## 6. Repairable vs Rejectable Errors

### 6.1 Generally repairable

An error is repairable when the underlying character identity is already correct and the correction can be localized.

Examples:

- Minor finger shape/spacing defect.
- Minor toe rendering defect.
- Small facial asymmetry.
- Small hair strand or hairstyle artifact.
- Minor local facial rendering artifact.
- Small proportion drift that does not alter identity.
- Minor expression rendering issue.

When repairing an image, preserve the original face, hair, body, lighting, composition, and other non-requested regions whenever technically feasible.

### 6.2 Generally reject

Reject rather than repair when:

- The face has become a different person.
- Facial structure is substantially wrong.
- The wrong age variant dominates the image.
- Hair color is fundamentally wrong and identity is affected.
- Multiple major anatomical errors occur.
- Hands/feet require extensive reconstruction.
- Body proportions are substantially distorted.
- Repair would introduce more uncertainty than generating a clean replacement.

The purpose of repair is to rescue a fundamentally valid character image, not to turn a failed generation into a different image through extensive reconstruction.

---

## 7. Character Prompt Standard

Character prompts should be modular and clearly separated from clothing, scene, pose/camera, lighting/style, and negative constraints.

### 7.1 Standard structure

`[trigger], [subject], [age variant], [facial identity], [hair], [eyes], [body/proportion], [expression]`

Recommended project trigger for the age-20 LoRA task, when approved by the project specification: `inr20`.

### 7.2 Prompt principles

- Put identity-critical information before decorative detail.
- Describe the active age variant explicitly when needed.
- Keep character descriptors consistent across the dataset.
- Do not add unapproved traits simply to make a prompt more elaborate.
- Avoid encoding clothing or scene details as permanent character traits.
- Other departments may append their own modular sections without changing the Character identity specification.

### 7.3 Example modular layout

**Character:** trigger + subject + age variant + facial identity + hair + eyes + body/proportion + expression

**Clothing:** supplied by Clothing Department

**Scene:** supplied by Scene Department

**Pose / Camera:** supplied by Pose/Camera Department

**Lighting / Style:** supplied according to Art Style Master and task requirements

**Negative:** fixed character-related exclusions + task-specific exclusions

---

## 8. Fixed Character Negative Prompt Items

Use the following character-related exclusions as the baseline where supported by the generation workflow:

- different person / identity drift
- wrong face shape
- distorted facial features
- asymmetrical facial deformation
- wrong age appearance when age is locked
- wrong hair color
- deformed hands
- extra fingers
- missing fingers
- fused fingers
- duplicated fingers
- elongated fingers
- deformed feet
- extra toes
- missing toes
- fused toes
- duplicated toes
- extra limbs
- missing limbs
- malformed anatomy
- unnatural limb angles
- impossible joints
- severe body-proportion distortion
- plastic-looking skin
- excessive facial smoothing
- exaggerated makeup

Do not treat every negative item as an absolute universal token requirement. The final Prompt/Generation department should adapt syntax to the selected model/workflow while preserving the intent of these exclusions.

---

## 9. Cross-Department Conflict Notes

### 9.1 Clothing Department

Clothing and hairstyle may interact. If a clothing design requires a hairstyle change, the hairstyle should remain a plausible variation of Inaria rather than alter identity. Clothing must not become an accidental identity lock.

### 9.2 Scene Department

Scene lighting and environmental color may visually alter perceived skin, hair, or eye color. Character identity should be judged against the underlying appearance rather than rejecting harmless environmental color influence. However, lighting must not obscure or fundamentally change locked identity traits.

### 9.3 Pose / Camera Department

Camera angle can distort facial proportions and body proportions. Extreme angles should be avoided when they make identity verification unreliable. Stable poses remain preferable to unnecessarily complex hand configurations.

### 9.4 Prompt / Generation Department

Prompt wording must not introduce new permanent character traits. Character descriptors should remain modular and consistent. If a prompt optimization conflicts with a locked character rule, the locked character rule takes priority.

### 9.5 Director / QA

Character Department provides the character-specific standard and recommendations. Final project-wide approval, conflict resolution, and promotion of permanent rules remain with the Director / Project Owner.

---

## 10. Change Control

This document is a department specification, not a replacement for `00_MASTER/`.

- Do not silently modify Master rules.
- New permanent character traits require project-owner/director approval before becoming locked rules.
- Use versioned revisions (`v001`, `v002`, etc.) for substantial future changes where appropriate.
- If another department proposes a conflicting requirement, record the conflict and escalate it rather than silently overriding the other department.

---

## 11. Handoff to the Next Specialist

The Character Department should hand off:

1. The active age variant and its designated reference.
2. The locked identity traits.
3. Allowed character variations.
4. Character consistency pass/reject criteria.
5. Any known identity-sensitive constraints.
6. Any unresolved cross-department conflicts.

For the current project, the key principle is:

> **Keep Inaria's identity stable while allowing the dataset's external conditions to vary.**

---

## 12. Source and Authority Notes

This specification is based on the repository's current Master files and Character Department README, especially:

- `00_MASTER/PROJECT_MASTER.md`
- `00_MASTER/CHARACTER_MASTER.md`
- `00_MASTER/ART_STYLE_MASTER.md`
- `00_MASTER/GENERATION_RULES.md`
- `01_CHARACTER/README.md`

Where those sources do not specify a numeric or highly granular character attribute, this document intentionally leaves it unspecified rather than inventing a permanent value.
