# START_HERE.md — Inaria Age-20 LoRA Project Startup

## 1. Authority
This is an age-20 Inaria LoRA project. Read current 00_MASTER rules first. Do not rely on deleted legacy documents or historical chat instructions.

## 2. Current architecture
- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- Generation accounts/sessions form one interchangeable PRODUCTION WORKER POOL
- GitHub = shared persistent state, production coordination layer, and official reference authority
- MASTER_IMAGE/INARIA_20_MASTER_v1.0.png = single official Character + Visual Style Reference
- PRODUCTION/PRODUCTION_GOAL.md = authoritative team-level production target
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image task state
- PRODUCTION/WORKER_POOL.md = authoritative worker-pool behavior

A worker/session is not a permanent account identity. The team owns the production goal; workers temporarily execute tasks.

## 3. Required reading order
1. PROJECT_STATUS.md
2. PRODUCTION/PRODUCTION_GOAL.md
3. PRODUCTION/WORKER_POOL.md
4. 00_MASTER/MASTER_SPEC.md
5. 00_MASTER/STYLE_MASTER.md
6. 00_MASTER/IDENTITY_MASTER.md
7. 00_MASTER/ANATOMY_STABILITY.md
8. 00_MASTER/GENERATION_RULES.md
9. 00_MASTER/DRAWING_INSTRUCTIONS.md
10. 00_MASTER/GENERATION_WORKER_PROTOCOL.md
11. 00_MASTER/QUALITY_CONTROL.md
12. 00_MASTER/PRODUCTION_PROTOCOL.md
13. 00_MASTER/PRODUCTION_MODES.md
14. PRODUCTION/IMAGE_QUEUE.md
15. current approved Prompt Package
16. current reference image supplied to the generation context

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

## 7. Universal Worker startup command
Read the latest rayclamp/lora_20 project state, the active Production Goal, the Worker Pool rules, and PRODUCTION/IMAGE_QUEUE.md. You are an interchangeable Generation Worker in the Production Worker Pool.

Do not ask how many images you personally must make. Do not depend on a fixed account number or prior production history.

Check whether the active Goal still needs Phase 1 output. If yes, claim one available job using the queue lock before generation. Use the verified MASTER_IMAGE as the direct Character + Visual Style Reference. Follow the task and Prompt Package exactly.

After successful generation, update the task to IMAGE_CREATED. IMAGE_CREATED completes Phase 1 for that task and immediately releases the worker. Do not wait for upload, Make, QC, or final QA.

If the Goal is reached, stop claiming new work and report completion through the project state.

If reference verification or claim fails, do not generate. If a pre-generation blocker prevents work, safely release the task to QUEUED. Do not write after lease expiry.

## 8. Master Director
ACCOUNT_06 owns Goal creation, integrated design, queue planning, Worker Pool coordination rules, Codex QA integration, and final PASS / REPAIR / REJECT.

## 9. Production readiness
The current MANUAL MODE controlled validation confirmed that the supplied official MASTER_IMAGE can be visually used to produce a clean reference-matched Japanese anime standing image with stable basic anatomy. T107 may now proceed under the active Phase 1 Goal and current Worker Pool rules.
