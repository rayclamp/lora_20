# Character Runtime Context

- Department: 01_CHARACTER
- Active project target: Inaria age 20.
- Identity: Inaria, Taiwanese/Asian adult woman; age-20 standard portrait is the primary reference.
- Identity-critical: recognizable face, face shape/major facial structure, core facial proportions, dark blue-black hair color, blue eyes, intended body proportions, active age presentation.
- Hairstyle is variable unless explicitly locked; preserve character identity and hair color.
- Expressions may vary naturally without redesigning facial structure.
- Body and anatomy must remain plausible; visible hands should have five plausible fingers and bare feet five plausible toes.
- Dataset teaches the person, not one outfit, hairstyle, pose, scene, camera, or lighting condition.
- Character prompt module: `inr20, Inaria, 20-year-old adult woman, consistent facial identity, established dark blue-black long hair, blue eyes, slender feminine proportions, [expression]`.
- Character baseline negatives: identity drift, wrong face shape, distorted facial features, wrong age appearance, wrong hair color, deformed/extra/missing/fused/duplicated fingers or toes, extra limbs, malformed anatomy, impossible joints, severe proportion distortion, plastic skin, excessive smoothing, exaggerated makeup.
- Repair localized defects only when identity remains correct; otherwise reject.
