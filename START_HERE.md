# START_HERE.md — Inaria Age-20 LoRA Project Startup

## 1. Authority
This is an age-20 Inaria LoRA project. Read current 00_MASTER rules first. Do not rely on deleted legacy documents or historical chat instructions.

## 2. Current architecture
- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- Generation accounts/sessions form one interchangeable PRODUCTION WORKER POOL
- GitHub = shared persistent state, production coordination layer, and official reference authority
- MASTER_IMAGE/INARIA_20_MASTER_v1.0.png = single official Character + Visual Style Reference
- `PRODUCTION/PRODUCTION_GOAL.md` = compatibility pointer to the active Goal
- `PRODUCTION/IMAGE_QUEUE.md` = compatibility pointer to the active Queue
- T109 active Goal = `PRODUCTION/T109_PRODUCTION_GOAL.md`
- T109 active Queue = `PRODUCTION/T109_IMAGE_QUEUE.md`
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
9. 00_MASTER/DATASET_DIVERSITY.md
10. 00_MASTER/DRAWING_INSTRUCTIONS.md
11. 00_MASTER/GENERATION_WORKER_PROTOCOL.md
12. 00_MASTER/QUALITY_CONTROL.md
13. 00_MASTER/PRODUCTION_PROTOCOL.md
14. 00_MASTER/PRODUCTION_MODES.md
15. PRODUCTION/IMAGE_QUEUE.md
16. `PRODUCTION/T109_PRODUCTION_GOAL.md`
17. `PRODUCTION/T109_IMAGE_QUEUE.md`
18. current approved Prompt Package
19. current reference image supplied to the generation context

## 4. Active Goal lock
**T109 is the current active production Goal.**

`T108` is historical and complete. Never stop T109 because T108 reached completion.

T109 target semantics are **150 Production Task Coverage**. This means MASTER DIRECTOR created 150 executable tasks for the Worker Pool. It does not mean the current worker must generate 150 images, and it does not require 150 successful or QA-approved images.

T109 current state at startup:
- Goal: `T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION`
- Queue: `PRODUCTION/T109_IMAGE_QUEUE.md`
- Task target: 150
- Task Coverage: 0 / 150
- QUEUED: 150
- IMAGE_CREATED: 0
- QA: PAUSED
- Generation System: ACTIVE

## 5. Reference Style Lock
The official MASTER_IMAGE is the single Character + Visual Style Reference.

It must be supplied as an actual image input through either:
- AUTO MODE: automated image-input bridge;
- MANUAL MODE: operator manually uploads the official MASTER_IMAGE.

The delivery mode does not change the generation standard.

The worker must visually inspect the actual reference before generation. A GitHub path, filename, SHA, text description, or generic Japanese anime label is not a substitute.

Preserve line art, face/eyes, hair, proportions, colors, shading, lighting, and illustration finish.

Do not switch to photorealistic, photographic/live-action, 3D/CGI, semi-photorealistic, or another anime/game/illustration style.

## 6. Reference verification lock
Required before generation:
- actual image available;
- image visually inspectable;
- official age-20 MASTER_IMAGE confirmed;
- no alternate identity reference substituted.

If any item fails, stop and do not generate.

## 7. Anatomy hard lock
Use 00_MASTER/ANATOMY_STABILITY.md before generation.

Exactly two hands and two legs; five fingers per visible hand; five toes per visible bare foot; traceable limb connections; plausible support/center of gravity; no false limbs; natural hand-object and wearable contact.

## 8. Universal Worker startup command
Read the latest GitHub project state and **always resolve the active Goal and Queue by the current pointer files**. For this production round the active Goal is T109 and the active Queue is `PRODUCTION/T109_IMAGE_QUEUE.md`.

You are an interchangeable Generation Worker in the Production Worker Pool.

Do not ask how many images you personally must make. Do not depend on a fixed account number or prior production history.

Check whether the active Goal still has QUEUED T109 tasks. If yes, claim one available T109 job using the queue lock before generation. Use the verified MASTER_IMAGE as the direct Character + Visual Style Reference. Follow the task and Prompt Package exactly.

After successful generation, update the task to IMAGE_CREATED. IMAGE_CREATED immediately releases the worker. Do not wait for upload, Make, QC, or final QA.

Workers are GENERATE-ONLY. Do not self-QA, reject a successful candidate because it is imperfect, redesign the task, or repeatedly regenerate the same design merely to improve it.

If SAFETY_BLOCKED occurs, record it according to the safety/retry policy and move on; never rewrite a prompt to bypass the safety system.

If the active T109 Goal is reached, stop claiming new T109 work and report completion through project state.

If reference verification or claim fails, do not generate. If a pre-generation blocker prevents work, safely release the task to QUEUED. Do not write after lease expiry.

## 9. Master Director
ACCOUNT_06 owns Goal creation, integrated design, queue planning, Worker Pool coordination rules, Codex QA integration, and final PASS / REPAIR / REJECT.

## 10. Production readiness
T109 is the final production-architecture validation. If the Worker/Queue behavior is successful, this architecture becomes the reusable production framework for future character LoRA projects.
