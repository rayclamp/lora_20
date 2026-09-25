# START_HERE.md — Inaria Age-20 LoRA Project Startup

## 1. Authority
This is an age-20 Inaria LoRA project. Read current 00_MASTER rules first. Do not rely on deleted legacy documents or historical chat instructions.

## 2. Current architecture
- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_01–05, ACCOUNT_07–08 = GENERATION_WORKER
- GitHub = shared persistent state and official reference authority
- MASTER_IMAGE/INARIA_20_MASTER_v1.0.png = single official Character + Visual Style Reference
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image queue

## 3. Required reading order
1. PROJECT_STATUS.md
2. 00_MASTER/MASTER_SPEC.md
3. 00_MASTER/STYLE_MASTER.md
4. 00_MASTER/IDENTITY_MASTER.md
5. 00_MASTER/ANATOMY_STABILITY.md
6. 00_MASTER/GENERATION_RULES.md
7. 00_MASTER/DRAWING_INSTRUCTIONS.md
8. 00_MASTER/GENERATION_WORKER_PROTOCOL.md
9. 00_MASTER/QUALITY_CONTROL.md
10. 00_MASTER/PRODUCTION_PROTOCOL.md
11. 00_MASTER/PRODUCTION_MODES.md
12. PRODUCTION/IMAGE_QUEUE.md
13. current approved Prompt Package
14. current reference image supplied to the generation context

## 4. Reference Style Lock
The official MASTER_IMAGE is the single Character + Visual Style Reference.

It must be supplied as an actual image input through either:
- AUTO MODE: automated image-input bridge;
- MANUAL MODE: operator manually uploads the official MASTER_IMAGE.

The delivery mode does not change the generation standard.

The worker must visually inspect the actual reference before generation. A GitHub path, filename, SHA, text description, or generic Japanese anime label is not a substitute.

Preserve line art, face/eyes, hair, proportions, colors, shading, lighting, and illustration finish.

Do not switch to photorealistic, photographic/live-action, 3D/CGI, semi-photorealistic, or another anime/game/illustration style.

## 5. Reference verification lock
Required before generation:
- actual image available;
- image visually inspectable;
- official age-20 MASTER_IMAGE confirmed;
- no alternate identity reference substituted.

If any item fails, stop and do not generate.

## 6. Anatomy hard lock
Use 00_MASTER/ANATOMY_STABILITY.md before generation.

Exactly two hands and two legs; five fingers per visible hand; five toes per visible bare foot; traceable limb connections; plausible support/center of gravity; no false limbs; natural hand-object and wearable contact.

## 7. Worker startup command
Read the latest rayclamp/lora_20 project state. You are a Generation Worker. Read the required 00_MASTER documents, PRODUCTION/IMAGE_QUEUE.md, the current Prompt Package, and the current reference image. Determine AUTO or MANUAL mode from PRODUCTION_MODES.md. Verify the actual official MASTER_IMAGE is available and visually inspectable before generating. Claim one available job using the queue lock before generation. Use the verified MASTER_IMAGE as the direct Character + Visual Style Reference. Follow the Prompt Package exactly. Do not redesign identity or global style. If reference verification or claim fails, do not generate. If a prerequisite or quota blocks generation before an image exists, release the job to QUEUED. Do not write after lease expiry.

## 8. Master Director
ACCOUNT_06 does not use the worker startup command. ACCOUNT_06 owns integrated design, queue planning, Codex QA integration, and final PASS / REPAIR / REJECT.

## 9. Production readiness
IMG_01–IMG_05 are historical candidates generated before the current reference/style/anatomy/asset gates were fully enforced. They are not approved training images. T107 must remain paused until one controlled test confirms reference-matched anime style, anatomy stability, and real production asset transfer.
