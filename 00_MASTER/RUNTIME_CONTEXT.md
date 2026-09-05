# Lora20 Runtime Context

- Project: rayclamp/lora_20
- Active target: Inaria age-20 identity LoRA dataset.
- Authority order: explicit current user instruction > Master rules > approved references > specialist rules > temporary implementation.
- Identity: Inaria, 20-year-old adult version, use the designated age-20 standard portrait as primary identity reference.
- Preserve recognizable facial identity, face structure, established dark blue-black hair color, blue eyes, and intended body proportions. Do not invent permanent numeric measurements.
- Generation priorities: identity/proportions > explicit task locks > anatomy/stability > pose/camera/composition > clothing/scene > lighting/style > decorative detail.
- Anatomy hard gate: plausible five-finger hands and five-toe bare feet; no extra/missing/fused/duplicated digits, extra limbs, impossible joints, severe deformation, or implausible balance.
- Style direction: romantic, refined, dreamy Japanese-inspired atmosphere; delicate light/shadow; natural translucent-looking skin; clean detailed rendering; believable anatomy; avoid plastic/overly artificial appearance.
- Dataset diversity: intentionally vary hairstyle, clothing, scene, pose, camera/framing, expression, lighting, and composition without creating accidental identity signals.
- Candidate statuses: PASS, REPAIR, REJECT. Local repair is allowed only when identity/design remain fundamentally valid; every repaired asset requires full recheck.
- Final dataset gate: correct identity/age, anatomy, clothing, scene, pose/camera, quality, no unwanted text/watermark/logo, useful variation, caption, traceable metadata, version lineage, Director approval.
- GitHub is shared project memory. Every handoff must identify locked constraints, intentional variations, status, and unresolved issues.
