# GENERATION_WORKER_PROTOCOL.md — Generation Worker Protocol

## 1. Purpose
All Generation Workers use the same operational protocol.

- ACCOUNT_01–05, ACCOUNT_07–08 = Generation Workers.
- ACCOUNT_06 = Master Director / Final Reviewer / QA.
- Workers do not redesign project-wide character or visual style.

## 2. Required startup
Read:
1. START_HERE.md
2. PROJECT_STATUS.md
3. 00_MASTER/MASTER_SPEC.md
4. 00_MASTER/STYLE_MASTER.md
5. 00_MASTER/IDENTITY_MASTER.md
6. 00_MASTER/ANATOMY_STABILITY.md
7. 00_MASTER/GENERATION_RULES.md
8. 00_MASTER/DRAWING_INSTRUCTIONS.md
9. 00_MASTER/QUALITY_CONTROL.md
10. 00_MASTER/PRODUCTION_PROTOCOL.md
11. 00_MASTER/PRODUCTION_MODES.md
12. PRODUCTION/IMAGE_QUEUE.md
13. current approved Prompt Package
14. current reference image supplied to this generation context

Do not use deleted legacy documents as instructions.

## 3. Standard startup command
Read the latest rayclamp/lora_20 project state and PRODUCTION/IMAGE_QUEUE.md. You are a Generation Worker. Determine the active reference delivery mode from 00_MASTER/PRODUCTION_MODES.md.

Before claiming/generating, confirm that the official age-20 MASTER_IMAGE is actually available and visually inspectable in the current generation context. The official image may be supplied through AUTO MODE or MANUAL MODE. A GitHub filename, path, SHA, text description, or generic style label is not an acceptable substitute for the image.

Claim the next available job using the Queue Lock Protocol before generating. Use the actual official MASTER_IMAGE as the direct Character + Visual Style Reference. Follow the current Prompt Package exactly. Do not redesign identity, global style, clothing, scene, pose, camera, or prompt architecture. If reference verification fails, do not generate. If claim fails, do not generate; re-fetch the queue. If a prerequisite or quota blocks generation before an image exists, release the job safely to QUEUED. Do not continue writing after lease expiry.

## 4. Pre-generation checklist
Before generation:
- confirm current account;
- confirm active reference mode;
- confirm the official MASTER_IMAGE is actually available in this chat/generation context;
- confirm the image is visually inspectable;
- confirm the reference is INARIA_20_MASTER_v1.0.png;
- confirm current Prompt Package;
- confirm successful queue claim;
- confirm exactly two hands and two legs in the planned pose;
- confirm intended finger/toe visibility;
- confirm stable shoulder/hip connections;
- confirm support surface and center of gravity;
- identify false-limb risks from sleeves, skirts, bags, straps, props, furniture, or background;
- simplify high-risk hand, leg, prop, strap, or occlusion design.

Hand-action requirements:
- one simple main action per hand;
- broad natural grips;
- avoid unnecessary fingertip pinches;
- keep at least one hand clear and away from image edges;
- no busy effects around fingers.

Object-contact requirements:
- held objects must visibly contact the hand;
- handles must remain connected to the object;
- bags and straps must connect to the bag and naturally contact the body;
- containers must be structurally complete before hand placement.

## 5. Claim protocol
1. Fetch latest queue and blob SHA.
2. Select lowest-numbered available QUEUED job.
3. Create unique Claim ID.
4. Update queue with exact fetched SHA.
5. If update conflicts/fails, claim failed. Do not generate.
6. Only after successful claim may generation begin.

## 6. Generation start
Immediately before generation:
1. Re-fetch queue.
2. Verify Worker, Claim ID, and Lease.
3. Change CLAIMED → GENERATING using latest queue SHA.
4. Only after that update succeeds, generate.

## 7. Reference-first generation
Use the actual official INARIA_20_MASTER_v1.0.png supplied in the current generation context as the direct Character + Visual Style Reference.

Preserve line-art, face, eyes, hair, proportions, coloring, shading, lighting language, and illustration finish.

The Prompt Package may change only explicitly assigned clothing, scene, pose, camera, composition, accessories, and context.

Never substitute photorealistic, photographic, live-action, 3D, CGI, semi-photorealistic, or another anime/game/illustration style.

## 8. Post-generation self-check
Before submitting a candidate:
- verify Japanese anime illustration matches MASTER_IMAGE;
- verify no obvious extra/missing/fused/duplicated fingers or toes;
- verify exactly two hands/two legs where visible;
- verify limb connections and center of gravity;
- verify no false limb from clothing/props/background;
- verify hand-object contact;
- verify bag/strap continuity;
- verify container structure;
- verify task requirements.

If a hard defect is obvious, do not describe the candidate as clean or final.

## 9. Asset state
A generated image is not automatically QC-ready because it exists in the ChatGPT output area.

Use:
GENERATING → IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING

QC_PENDING requires a real production asset and lineage record.

If binary export/upload is unavailable, stop at the appropriate state and record the blocker.

## 10. Lease and recovery
- ChatGPT manual worker lease: 120 minutes.
- Make/OpenAI worker lease: 30 minutes.
- Renew before expiry when needed.
- After expiry, re-claim with a new Claim ID.
- A blocked pre-generation job returns to QUEUED.
- A generated candidate is preserved and must not be regenerated merely because another worker becomes available.

## 11. Worker restrictions
Workers must not redesign identity or global style, generate before successful claim, generate without successful reference verification, use a stale queue snapshot, declare final PASS, continue writing after lease expiry, regenerate without explicit NEED_REGENERATE, or substitute another identity reference.

Only ACCOUNT_06 can make final PASS / REPAIR / REJECT decisions.
