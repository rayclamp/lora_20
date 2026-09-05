# Inaria AI Studio — Character Department Specification

- **Department:** 01_CHARACTER — Character Design
- **Version:** v1.1
- **Last Updated:** 2026-09-05
- **Purpose:** Establish a reusable, long-term specification for Inaria's character identity, age variants, consistency evaluation, LoRA dataset selection, repair/rejection criteria, and character prompt standards. This document is subordinate to `00_MASTER/` and must not redefine or silently override Master rules.

---

## 1. Department Scope

The Character Department is responsible for:

- character identity
- facial appearance and facial consistency
- hair and hair color
- eye appearance
- age presentation
- body/proportion consistency
- expressions
- character-specific dataset selection criteria
- character-specific prompt and negative-prompt guidance
- handoff of character constraints to the next specialist

The Character Department is **not** the owner of clothing, scene, pose/camera, prompt-generation workflow, or final project-wide QA decisions belonging to other departments.

Character requirements supplied to other departments are handoff constraints, not permission to redesign their domains.

---

## 2. Character Standard — Inaria

### 2.1 Stable identity

- **Name:** 依娜莉亞 (Inaria)
- **Sex:** Female
- **Ethnicity/background:** Taiwanese / Asian
- **Default setting:** modern Taiwan, 2026
- **Birthday:** 1990-04-03
- **Default age reference:** 36 years old
- **Age 20:** use the user's designated age-20 standard portrait as the primary visual reference when an age-20 task is active.
- **Age 36:** use the designated age-36 standard portrait as the primary visual reference when no other age/reference is specified.

The character identity must remain recognizable across clothing, scene, pose, camera, lighting, and composition changes.

### 2.2 Identity-critical traits

The following are identity-critical and should remain stable unless a task explicitly authorizes a change:

1. Overall facial identity.
2. Face shape and major facial structure.
3. Core facial proportions and placement of major features.
4. Character-defining hair color.
5. Overall body proportions.
6. The explicitly active age presentation.

The current Master files do **not** define numeric facial landmark measurements, exact iris color codes, exact hair length, or exact body measurements. Those values must not be invented as permanent project rules.

If future work formally locks such details, they should be approved by the project owner/director and recorded through the appropriate project-controlled document.

### 2.3 Age-20 visual reference observations

The designated age-20 standard portrait supplied for this project establishes the visual identity reference for the 20-year-old adult version. The reference visibly establishes the following character-level traits:

- youthful adult female presentation
- long, dark blue-black hair
- blue eyes
- light, natural-looking skin
- slender, feminine overall body proportions
- soft and youthful facial presentation

These observations describe the reference image and are intended to support identity matching. They do **not** lock the reference portrait's clothing, pose, background, footwear, or composition as permanent character traits.

### 2.4 Hair

Hair is identity-sensitive, but **hairstyle is a variable dataset dimension** unless a specific task locks it.

- Preserve the established dark blue-black character hair color unless explicitly changed by an approved task.
- Hairstyle may vary across dataset images to prevent the LoRA from binding identity to one hairstyle.
- Acceptable variations include changes in arrangement, parting, ponytail/bun styles, loose hair, waves, and other plausible styles appropriate to the active age version.
- Hairstyle changes must still read as the same character.
- Avoid hair changes that effectively create a different character.

### 2.5 Eyes

Eye appearance is identity-sensitive.

- Preserve the established blue eye color.
- Preserve the recognizable overall eye structure and placement.
- Expression may vary while eye identity remains consistent.
- Do not introduce arbitrary eye-color changes merely for visual novelty.

No numeric iris color code or exact eye-landmark measurement is currently locked.

### 2.6 Face and expression

The face is the highest-priority identity region.

A valid variation may change:

- smile intensity
- neutral/serious expression
- gentle happiness
- mild surprise
- other natural expressions

A valid variation should **not** substantially change:

- face shape
- relative placement of eyes, nose, and mouth
- recognizable facial proportions
- overall identity impression

Expression changes must not be mistaken for facial redesign.

### 2.7 Body and anatomy

- Preserve intended body proportions across the dataset.
- Anatomy must remain humanly plausible.
- Each hand must have exactly five fingers.
- Each foot must have exactly five toes.
- No fused, duplicated, missing, elongated, or anatomically impossible fingers/toes.
- Limb angles, joints, balance, and center of gravity must remain plausible.
- Prefer stable poses over unnecessarily complicated gestures.

These requirements follow the Character Master and Generation Rules.

---

## 3. Age Variants — 20 vs 36

### 3.1 Age 20

- Primary reference: the user's designated age-20 standard portrait.
- Represents Inaria as a **20-year-old adult**.
- Preserve the same underlying character identity while maintaining a clearly adult, youthful presentation.
- Do not use the age-36 portrait as the primary identity target when an explicit age-20 task is active.
- Age-appropriate differences should come from the designated reference rather than invented stereotypes about youth.

### 3.2 Age 36

- Primary reference: the designated age-36 standard portrait when no other age/reference is specified.
- Represents the same underlying character with a mature adult presentation appropriate to age 36.
- Do not unintentionally regress the character toward the age-20 visual target.

### 3.3 Shared identity vs age-specific variation

Shared across both versions:

- underlying facial identity
- core face structure
- recognizable facial features
- established hair color
- intended body proportions, subject to the active age reference

Allowed to vary by age:

- apparent facial maturity
- age-specific styling
- age-specific expression/presentation
- other visual characteristics explicitly established by the designated reference

When an age-variant distinction is unclear, the designated reference image takes priority over inferred age styling.

---

## 4. Character Consistency Evaluation

Character consistency must be judged as a **whole-person identity problem**, not by matching one isolated feature.

### 4.1 Tier A — Identity-critical failure

A severe failure in any of the following normally makes the image unsuitable for the character dataset:

- clearly different facial identity
- major face-shape mismatch
- major change to core facial proportions
- wrong locked hair color
- wrong active age version when the difference is visually substantial
- severe body-proportion distortion
- major body deformation
- anatomically impossible hands or feet
- extra or missing limbs

### 4.2 Tier B — Important but potentially repairable

Examples include:

- mild facial asymmetry caused by rendering
- slight hairstyle drift while identity and hair color remain intact
- small expression-induced changes in eye or mouth shape
- minor proportion drift that does not alter identity
- minor finger/toe rendering defects that can be cleanly corrected
- isolated local hair or facial artifacts

### 4.3 Tier C — Primarily non-character issues

Unless they affect identity, these belong to other departments:

- clothing construction/styling
- scene/background
- camera/composition
- lighting/style

Character should flag such issues rather than silently redefine another department's domain.

### 4.4 Practical consistency test

An image passes the character check when all of the following are true:

1. It is immediately recognizable as Inaria against the active reference.
2. The face is structurally consistent, not merely generically similar.
3. Hair color and core identity traits are preserved.
4. The correct age variant is represented.
5. Body proportions remain plausible and consistent.
6. Hands, feet, and major anatomy are clean enough for dataset use.
7. Changes in hairstyle, expression, pose, clothing, scene, camera, and lighting read as variations of the same person rather than a different person.

---

## 5. LoRA Dataset Image Selection Standard

The dataset should teach **the person**, not one outfit, pose, scene, or composition.

### 5.1 Selection priority

Use this order when selecting candidate images:

1. Character identity
2. Facial consistency
3. Anatomy and generation stability
4. Age-version correctness
5. Useful variation
6. Composition and visual quality
7. Decorative richness

A spectacular image with weak identity is inferior to a simple image with strong identity and clean anatomy.

### 5.2 Required dataset variation

Across the dataset, intentionally vary:

- hairstyle
- clothing
- scene/background
- pose
- camera angle and framing
- expression
- lighting
- composition

Identity should remain stable while external conditions vary.

### 5.3 Avoid identity leakage

The dataset must not accidentally teach that Inaria is defined by:

- one hairstyle
- one outfit
- one background
- one pose
- one camera angle
- one lighting condition

Where practical, avoid long runs of near-identical images. Repetition is acceptable only when it contributes meaningful identity or controlled variation.

### 5.4 Dataset rejection triggers

Reject an image when it contains:

- a different-looking face that cannot reasonably be repaired
- major age-version confusion
- wrong locked hair color
- severe facial deformation
- missing, extra, fused, duplicated, or severely malformed fingers/toes that cannot be reliably corrected
- extra limbs or major anatomical impossibility
- severe body-proportion distortion
- a repair that would require reconstructing a large portion of the character
- repeated near-duplicate imagery that adds little useful character information

### 5.5 Repair before rejection

Repair is appropriate only when:

- the underlying identity is already correct
- the defect is localized
- the repair can preserve the original identity and surrounding image
- the repair is technically reliable

If those conditions are not met, replace the image rather than forcing a large reconstruction.

---

## 6. Repairable vs Rejectable Character Errors

### 6.1 Generally repairable

An error is generally repairable when the identity is correct and the change can be localized.

Examples:

- one or a few mildly malformed fingers
- minor toe rendering defect
- small facial asymmetry
- isolated hair-strand artifact
- small hairstyle rendering artifact
- minor local facial rendering artifact
- small proportion drift that does not alter identity
- minor expression rendering problem

When repairing, preserve the original face, hair, body, lighting, composition, and all non-requested regions whenever technically feasible.

### 6.2 Generally reject

Reject rather than repair when:

- the face has become a different person
- facial structure is substantially wrong
- the wrong age variant dominates the image
- hair color is fundamentally wrong and affects identity
- multiple major anatomical errors occur
- hands or feet require extensive reconstruction
- body proportions are substantially distorted
- repair would alter the identity or a large part of the image
- the replacement can be generated more reliably than the repair

The purpose of repair is to rescue a fundamentally valid character image, not to turn a failed generation into a substantially different image.

---

## 7. Character Prompt Standard

Character prompts should be modular and clearly separated from clothing, scene, pose/camera, lighting/style, and negative constraints.

### 7.1 Standard character structure

`[trigger], [subject], [age variant], [facial identity], [hair], [eyes], [body/proportion], [expression]`

For the current age-20 LoRA project, the designated trigger is:

`inr20`

### 7.2 Prompt principles

- Put identity-critical information before decorative detail.
- Explicitly state the active age variant when required.
- Keep character descriptors consistent across the dataset.
- Do not add unapproved traits merely to make a prompt longer.
- Do not encode clothing or scene details as permanent character traits.
- Keep character, clothing, scene, pose/camera, and lighting/style modular.
- Other departments may append their own sections without changing the Character identity specification.

### 7.3 Recommended modular prompt layout

**Character**

`inr20, Inaria, 20-year-old adult woman, consistent facial identity, established dark blue-black long hair, blue eyes, slender feminine proportions, [expression]`

**Clothing**

Supplied by the Clothing Department.

**Scene**

Supplied by the Scene Department.

**Pose / Camera**

Supplied by the Pose/Camera Department.

**Lighting / Style**

Supplied according to `ART_STYLE_MASTER.md` and the active task.

**Negative**

Fixed character-related exclusions plus task-specific exclusions.

The exact syntax may be adapted to the selected model/workflow by the Prompt/Generation Department, but the semantic separation of character identity from external conditions should be preserved.

---

## 8. Fixed Character Negative Prompt Items

Use the following as the baseline character-related exclusions where supported by the selected generation workflow:

- different person / identity drift
- wrong face shape
- distorted facial features
- severe facial asymmetry or deformation
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

These are semantic baseline requirements, not mandatory literal tokens for every model. The Prompt/Generation Department may adapt wording to the selected model and workflow while preserving the intended exclusions.

---

## 9. Cross-Department Conflict Notes

### 9.1 Clothing Department

Clothing and hairstyle may interact. If a clothing design requires a hairstyle change, it must remain a plausible variation of Inaria and must not alter identity.

Clothing must not become an accidental identity lock in the dataset.

**Potential conflict:** Clothing may prefer a visually specific hairstyle to complement an outfit, while Character requires hairstyle diversity for LoRA training. For dataset construction, identity stability and controlled variation take priority over keeping one hairstyle attached to one outfit.

### 9.2 Scene Department

Environmental lighting and color may change the perceived appearance of skin, hair, or eyes.

Character evaluation should distinguish harmless environmental color influence from an actual identity change.

**Potential conflict:** Strong colored lighting can make the established hair or eye color difficult to verify. If the identity-critical feature cannot be reliably evaluated, the image should not be preferred as a primary identity sample.

### 9.3 Pose / Camera Department

Camera angle can distort facial and body proportions.

**Potential conflict:** Extreme angles or difficult poses may produce technically attractive images but make identity verification or anatomy unreliable. Character recommends avoiding such images for core identity samples when cleaner alternatives exist.

### 9.4 Prompt / Generation Department

Prompt wording must not introduce new permanent character traits.

**Potential conflict:** Prompt optimization may encourage verbose or highly specific descriptors. Character identity descriptors should remain stable and modular; decorative specificity must not silently become an identity lock.

### 9.5 Director / QA

Character Department provides the character-specific standard and recommendations. Final project-wide approval, conflict resolution, and promotion of permanent rules remain with the Director / Project Owner.

---

## 10. Change Control

This document is a department specification, not a replacement for `00_MASTER/`.

- Do not silently modify Master rules.
- New permanent character traits require project-owner/director approval before becoming locked rules.
- Use versioned revisions (`v001`, `v002`, etc.) for substantial future changes where appropriate.
- If another department proposes a conflicting requirement, record the conflict and escalate it rather than silently overriding the other department.
- Do not alter another department's files merely to resolve a Character concern.

---

## 11. Handoff to the Next Specialist

The Character Department should hand off:

1. Active age variant and designated reference.
2. Locked identity traits.
3. Allowed character variations.
4. Character consistency pass/reject criteria.
5. Repairable vs rejectable character-error criteria.
6. Character-specific prompt structure and negative baseline.
7. Known identity-sensitive constraints.
8. Unresolved cross-department conflicts.

For the current project, the central handoff principle is:

> **Keep Inaria's identity stable while allowing the dataset's external conditions to vary.**

---

## 12. Authority and Source Notes

This specification is based on the current repository Master files, the Character Department README, and the designated age-20 standard portrait supplied for this project.

Primary repository sources:

- `00_MASTER/PROJECT_MASTER.md`
- `00_MASTER/CHARACTER_MASTER.md`
- `00_MASTER/ART_STYLE_MASTER.md`
- `00_MASTER/GENERATION_RULES.md`
- `01_CHARACTER/README.md`

Where the repository sources do not specify a numeric or highly granular character attribute, this document intentionally leaves it unspecified rather than inventing a permanent value.

The designated age-20 portrait is treated as a visual reference for identity and age presentation. Its clothing, pose, background, footwear, and composition are not permanent character locks unless separately approved.
