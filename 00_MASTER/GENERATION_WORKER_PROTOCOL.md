# GENERATION_WORKER_PROTOCOL.md — Generation Worker Protocol

## 1. Purpose
All Generation Workers use the same operational protocol.

A Worker is an interchangeable execution session in the Production Worker Pool. It is not a permanent account identity.

Final QA is performed by the external Codex/local QA workflow and is not performed by Generation Workers. Generation Workers are not permanent account identities and are not assigned fixed per-account tasks.

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
3. Select one available task whose Task Record state is QUEUED. Do not treat FAILED or SAFETY_BLOCKED as automatically recoverable.
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

## 8. FORCED-STOP AND QUOTA HANDLING

### QUOTA_EXHAUSTED
If the platform explicitly reports that this Worker/account has exhausted its image-generation quota:
- This is NOT a task failure and NOT a GENERATION_TOOL_ERROR.
- Change CLAIMED or GENERATING → QUEUED if GitHub is still writable.
- Release the Claim/Lease.
- Record the quota event if supported.
- Stop this Worker session after the state is safely written.
- Another Worker may claim the returned task.

**Quota exhaustion releases work; it does not fail work.**

### SYSTEM_POLICY_STOP
If the platform explicitly reports that the current task is forcibly stopped because of a system rule/policy:
- Change CLAIMED or GENERATING → FAILED if GitHub is still writable.
- Preserve the original Prompt Package and task history.
- Do not rewrite the prompt to bypass the rule.
- Release the Claim/Lease.
- Do not return the task to QUEUED.

**System/policy forced stop closes the current task; quota exhaustion returns it to the pool.**

## 8. Generation error handling

### GENERATION_TOOL_ERROR
Examples include the image-generation tool not appearing, a generic retry response such as "Please try again", or an internal generation-tool error.

- Do not assume the Prompt Package is wrong.
- Increment the task attempt counter.
- Follow PRODUCTION/GENERATION_RETRY_POLICY.md.
- Retry the same task only while the per-image retry limit and global circuit breaker permit it.
- After the per-image limit is reached, close/defer the task according to the retry policy and move to another QUEUED task. Do not return the same design to the ordinary queue for another Worker.
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

A generation error is not IMAGE_CREATED and must never be counted as Phase 1 completion. Quota exhaustion is also not IMAGE_CREATED; it returns the task to QUEUED rather than FAILED.

## 9. Post-generation completion
After a successful image is generated:
1. Do NOT perform visual QA, task-compliance judgment, PASS/REPAIR/REJECT judgment, or subjective acceptance screening.
2. Do NOT regenerate the task merely because the Worker believes the candidate could be improved.
3. Re-fetch the queue.
4. Verify the active Claim ID and lease.
5. Update GENERATING → IMAGE_CREATED using the latest queue SHA.
6. Record the generation completion event required by the current queue schema.
7. Treat IMAGE_CREATED as Phase 1 completion.
8. Release the Worker immediately.
9. Re-check the active Goal before claiming another task.

The Worker may perform only the minimum operational checks required to confirm that generation actually returned a candidate and that the Worker can safely record the event. Those checks are not QA and must not be used to reject, repair, or regenerate a candidate.

IMAGE_CREATED means a generation candidate was successfully produced. It does NOT mean the candidate passed final QA.

A generated candidate must be preserved for downstream QA even when the Worker believes the pose, composition, anatomy, style match, or task compliance could be improved. Final judgment belongs to the external Codex/local QA workflow.

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
- A prerequisite-blocked pre-generation job may return to QUEUED only after the prerequisite is resolved; this is a distinct prerequisite-recovery path, not a retry of FAILED or SAFETY_BLOCKED.
- A GENERATION_TOOL_ERROR follows the retry policy; after three failed attempts the task becomes DEFERRED.
- A SAFETY_BLOCKED task is recorded, released, skipped for the current run, and is not automatically retried. Another available task should be claimed next.
- If a Worker becomes unavailable after claiming but before IMAGE_CREATED, the task may be taken over by another Worker only after the claim/lease is legitimately recoverable. An active valid Claim always excludes other Workers.
- A generated candidate is preserved and must not be regenerated merely because another worker becomes available.

## 12. Worker restrictions
Workers must not:
- redesign identity or global style;
- generate before successful claim;
- generate without successful reference verification;
- use a stale queue snapshot;
- declare final PASS;
- perform final QA;
- continue writing after lease expiry;
- change the active Goal target;
- wait for Phase 2 before starting another task;
- substitute another identity reference.

Only ACCOUNT_06 can make final PASS / REPAIR / REJECT decisions.


## 13. Task-level synchronization and summary tolerance

The Worker Pool uses **Task-level exclusive Claim/Lease** as the primary synchronization mechanism.

- One task may have at most one active Worker owner.
- CLAIMED and GENERATING tasks are skipped by other Workers.
- Workers continue scanning for other QUEUED tasks instead of waiting for another Worker.
- Stale or inconsistent summary counters in PROJECT_STATUS.md, Goal summaries, or Queue summaries do not by themselves stop production.
- The Worker stops claiming only when it cannot safely resolve/read the authoritative active queue, cannot safely determine the specific task state, cannot safely establish Claim/Lease ownership, or an explicit system-wide stop condition applies.
- IMAGE_CREATED, FAILED, and SAFETY_BLOCKED are terminal task outcomes and do not automatically return to QUEUED.
- FAILED means the design is closed for automatic Worker retry; another Worker must not be sent back to the same failed design.
- SAFETY_BLOCKED is closed for automatic retry and must not be rewritten to bypass safety.
- MASTER DIRECTOR creates replacement designs as new Tasks when additional candidate coverage is needed.
- GENERATION_TOOL_ERROR is the only controlled retry path and follows GENERATION_RETRY_POLICY.md.
