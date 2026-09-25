# GENERATION_WORKER_PROTOCOL.md — Generation Worker Protocol

## 1. Purpose
All Generation Workers use the same operational protocol.

A Worker is an interchangeable execution session in the Production Worker Pool. It is not a permanent account identity.

ACCOUNT_06 is the Master Director / Final Reviewer / QA and is not part of ordinary Worker claiming.

## 2. Required startup
Read:
1. START_HERE.md
2. PROJECT_STATUS.md
3. PRODUCTION/PRODUCTION_GOAL.md
4. PRODUCTION/WORKER_POOL.md
5. 00_MASTER/MASTER_SPEC.md
6. 00_MASTER/STYLE_MASTER.md
7. 00_MASTER/IDENTITY_MASTER.md
8. 00_MASTER/ANATOMY_STABILITY.md
9. 00_MASTER/GENERATION_RULES.md
10. 00_MASTER/DRAWING_INSTRUCTIONS.md
11. 00_MASTER/QUALITY_CONTROL.md
12. 00_MASTER/PRODUCTION_PROTOCOL.md
13. 00_MASTER/PRODUCTION_MODES.md
14. PRODUCTION/IMAGE_QUEUE.md
15. current approved Prompt Package
16. current reference image supplied to this generation context
17. PRODUCTION/GENERATION_RETRY_POLICY.md

## 3. Universal Worker startup
Read the latest rayclamp/lora_20 project state.

You are an interchangeable Generation Worker in the Production Worker Pool.

Do not ask how many images you personally must produce.

Do not depend on:
- a fixed account number;
- a previous account identity;
- previous production history;
- remaining account quota;
- startup order.

Check the active Production Goal.

If the Goal is already complete, stop.

If the Goal still needs Phase 1 output, find one available task and claim it using the Queue Lock Protocol.

Before generation, confirm that the official age-20 MASTER_IMAGE is actually available and visually inspectable in the current generation context.

Use the actual official MASTER_IMAGE as the direct Character + Visual Style Reference.

## 4. Claim protocol
1. Fetch latest queue and blob SHA.
2. Re-check the active Goal before claiming.
3. Select one available task whose state is QUEUED or an explicitly recoverable state.
4. Create a unique Claim ID.
5. Update the queue using the exact fetched SHA.
6. If the conditional update conflicts/fails, do not generate; re-fetch.
7. Verify Worker, Claim ID, and Lease.

A successful claim gives temporary execution ownership only.

## 5. Generation start
Immediately before generation:
1. Re-fetch queue.
2. Verify Worker, Claim ID, and Lease.
3. Change CLAIMED → GENERATING using the latest queue SHA.
4. Only after that update succeeds, generate.

## 6. Reference-first generation
Use the actual official INARIA_20_MASTER_v1.0.png supplied in the current generation context as the direct Character + Visual Style Reference.

Preserve line-art, face, eyes, hair, proportions, coloring, shading, lighting language, and illustration finish.

The Prompt Package may change only explicitly assigned clothing, scene, pose, camera, composition, accessories, and context.

Never substitute photorealistic, photographic, live-action, 3D, CGI, semi-photorealistic, or another anime/game/illustration style.

## 7. Pre-generation stability
Before generation:
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

## 8. Generation error handling

### GENERATION_TOOL_ERROR
Examples include the image-generation tool not appearing, a generic retry response such as "Please try again", or an internal generation-tool error.

- Do not assume the Prompt Package is wrong.
- Increment the task attempt counter.
- Follow PRODUCTION/GENERATION_RETRY_POLICY.md.
- Retry the same task only while the per-image retry limit and global circuit breaker permit it.
- After the per-image limit is reached, set the task to DEFERRED and move to another task.
- After the global consecutive-error limit is reached, stop claiming new tasks and treat the generation system as paused.

### SAFETY_BLOCKED
If ChatGPT explicitly reports a safety-policy block:
- stop the task;
- record SAFETY_BLOCKED;
- preserve the original Prompt Package;
- do not repeatedly rewrite the prompt to bypass the safety system;
- release the Worker;
- send the task to Director Review.

### BLOCKED
If a required prerequisite is unavailable before generation, record BLOCKED and follow the normal recovery path.

A generation error is not IMAGE_CREATED and must never be counted as Phase 1 completion.

## 9. Post-generation completion
After a successful image is generated:
1. Perform the required worker self-check.
2. Re-fetch the queue.
3. Verify the active Claim ID and lease.
4. Update GENERATING → IMAGE_CREATED using the latest queue SHA.
5. Record the generation completion event required by the current queue schema.
6. Treat IMAGE_CREATED as Phase 1 completion.
7. Release the Worker immediately.
8. Re-check the active Goal before claiming another task.

IMAGE_CREATED is not final QA PASS.

## 10. Phase 2 separation
Do not wait for:
- UPLOADING
- UPLOADED
- QC_PENDING
- Codex
- ACCOUNT_06
- final PASS

The Worker is finished with the task at IMAGE_CREATED.

If binary upload is unavailable, the task still remains Phase 1 complete.

## 11. Lease and recovery
- ChatGPT manual worker lease: 120 minutes.
- Make/OpenAI worker lease: 30 minutes.
- Renew before expiry when needed.
- After expiry, re-fetch and re-claim with a new Claim ID.
- A prerequisite-blocked pre-generation job returns to QUEUED after the blocker is resolved.
- A GENERATION_TOOL_ERROR follows the retry policy; after three failed attempts the task becomes DEFERRED.
- A SAFETY_BLOCKED task is sent to Director Review and is not automatically retried.
- A generated candidate is preserved and must not be regenerated merely because another worker becomes available.

## 12. Worker restrictions
Workers must not:
- redesign identity or global style;
- generate before successful claim;
- generate without successful reference verification;
- use a stale queue snapshot;
- declare final PASS;
- continue writing after lease expiry;
- change the active Goal target;
- wait for Phase 2 before starting another task;
- substitute another identity reference.

Only ACCOUNT_06 can make final PASS / REPAIR / REJECT decisions.
