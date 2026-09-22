# Inaria LoRA Image QA Specification

## Purpose and Scope

This specification defines a repeatable, read-only quality-assurance process for images considered for the Inaria LoRA dataset. It does not authorize changing, redrawing, moving, deleting, renaming, or otherwise modifying original images. Any file organization or modification requires explicit user instruction.

## 1. General Principle

QA decisions must be based only on content that is actually visible in the image.

- Do not infer or invent information that is invisible or cannot be reliably confirmed.
- If resolution, occlusion, pose, or another condition prevents a reliable decision, use `REVIEW` rather than guessing `PASS` or `FAIL`.
- Use `FAIL` only for a clearly observable violation.

## 2. Character QA

Evaluate the following:

1. There is only one primary character.
2. The character is female.
3. Hair color is within Inaria's dark blue-black range.
4. Hair is long.
5. Bangs match Inaria's primary appearance characteristics.
6. Eyes are within the blue color range.
7. The face and overall appearance match the Inaria Character Specification.
8. Overall body proportions are natural.

Use [INARIA_CHARACTER_SPEC.md](INARIA_CHARACTER_SPEC.md) as the authoritative reference for character identity and appearance. If there is insufficient information for a reliable comparison, mark the relevant check as `REVIEW`.

## 3. Anatomy QA

Evaluate the following:

1. Normal human body structure is present.
2. There are two hands.
3. Each visible hand has five fingers.
4. There are no extra fingers.
5. There are no missing fingers.
6. There are no fused fingers.
7. There are no extra arms.
8. There are no missing arms.
9. There are no extra legs.
10. There are no missing legs.
11. Palms, wrists, and arms connect naturally.
12. Legs connect naturally to the body.
13. No other obvious generated-anatomy errors are present.
14. Body balance and posture are plausible.

### Anatomy Priority

The stability of hands and feet takes priority over decoration, complex poses, or background effects. When a complex pose prevents reliable evaluation of fingers, toes, or limbs, use `REVIEW`.

## 4. Feet QA

When feet or toes are visible, evaluate the following:

1. Each visible foot has five toes.
2. There are no extra toes.
3. There are no missing toes.
4. There are no fused toes.
5. Toe and foot structure is natural.

If shoes, clothing, or another object obscure the feet so that they cannot be confirmed, use `REVIEW`; do not assign `FAIL` solely because the feet cannot be seen.

## 5. Clothing QA

Evaluate the following:

1. Clothing is worn normally.
2. Clothing connects naturally to the body.
3. No obvious clipping through the body is present.
4. No unnatural clothing fusion is present.
5. No obvious generation damage is present.
6. When the image has a specified outfit requirement, the outfit matches that job specification.

Do not assign `FAIL` solely because clothing differs from other dataset images, unless the relevant job specification explicitly requires outfit consistency.

## 6. Wearable Object QA

When a backpack, crossbody bag, handbag, shoulder bag, or other wearable object is present, evaluate the following:

1. Straps connect completely to the object.
2. Straps contact the body naturally.
3. Straps do not pass through the body.
4. Straps do not break or disappear unnaturally.
5. The object does not float.
6. The object has plausible physical support.
7. The object does not merge unnaturally with the body.

If no such object is present, use `N/A`. Do not assign `FAIL` merely because a backpack or other wearable object is absent.

## 7. Image Quality QA

Evaluate the following:

1. No obvious generation artifacts are present.
2. No unnatural object fusion is present.
3. The body and background do not merge severely.
4. No obvious duplicate objects are present.
5. No extra limbs are present.
6. No significant background anomalies are present.
7. No major visual issue would adversely affect LoRA training.

## 8. Dataset Suitability

Determine whether the image is suitable for inclusion in the Inaria LoRA dataset.

- An image need not be perfect to receive `REVIEW`.
- Use `FAIL` only for major, clearly observable errors.
- Use `REVIEW` for insufficient evidence or details that require human confirmation.

## 9. Result Definitions

### PASS

The image clearly meets the applicable rules and has no major quality issue.

### REVIEW

The image may be usable, but has one or more of the following:

- Details that cannot be reliably confirmed.
- Occlusion.
- Resolution limitations.
- Character consistency that cannot be fully confirmed.
- Another issue requiring human judgment.

### FAIL

The image has a clear issue that is sufficient to affect dataset quality, such as:

- Obvious extra fingers.
- Obvious missing fingers.
- Obvious extra limbs.
- Obvious anatomical errors.
- Obvious clipping.
- Obvious generation damage.
- A severe issue affecting character recognition.
- Another issue that makes the image unsuitable for the Inaria LoRA dataset.

## 10. QA Output Format

Use the following structure for every QA run.

### QA Table

| # | Check Item | Result | Evidence |
| --- | --- | --- | --- |
| 1 | _Describe the evaluated requirement_ | `PASS` / `REVIEW` / `FAIL` / `N/A` | _Observed visual evidence only_ |

The `Result` field may contain only `PASS`, `REVIEW`, `FAIL`, or `N/A`.

### Overall Result

`PASS` / `REVIEW` / `FAIL`

### Critical Issues

List major issues. If there are none, write `None`.

### Minor Issues

List minor issues. If there are none, write `None`.

### Human Review Required

List items that require human confirmation. If there are none, write `None`.

### Summary

Briefly state whether the image is suitable for inclusion in the Inaria LoRA dataset.

## 11. Important QA Rules

- Do not assign `FAIL` because an object is absent.
- Do not assign `FAIL` because clothing differs, unless the job specification explicitly requires it.
- Do not assign `FAIL` because the pose differs, unless the job specification explicitly requires it.
- Do not guess unseen fingers, toes, or anatomy.
- If it cannot be seen, use `REVIEW`.
- If it is uncertain, use `REVIEW`.
- Use `FAIL` only for a clear error.
- Keep QA read-only unless the user explicitly requests file organization or modification.
- Never independently modify, redraw, move, or delete original images during QA.

## 12. Reference

Character identity and appearance must be evaluated against [INARIA_CHARACTER_SPEC.md](INARIA_CHARACTER_SPEC.md).

This specification defines the quality-control process; the Character Specification defines the character itself.
