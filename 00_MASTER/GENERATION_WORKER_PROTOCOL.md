# GENERATION_WORKER_PROTOCOL.md — Generation Worker Protocol

## 1. Purpose

All Generation Workers use the same generic operational protocol.

A Worker is an interchangeable execution session. This document defines only cross-module generation behavior. It must NOT define a character, Master Image, wallpaper type, LoRA dataset, festival database, fixed account, or QA authority.

Final visual QA belongs to the applicable downstream QA workflow and is not performed by Generation Workers.

## 2. Module boundary

The Worker must first determine the active module from:
- `START_HERE.md`
- `00_MASTER/MODULE_REGISTRY.md`
- `00_MASTER/MASTER_SPEC.md`

The active module owns:
- its task/queue/state;
- its reference policy;
- its prompt/design rules;
- its module-specific production goal.

This protocol supplies only generic generation execution and safety rules.

## 3. Required startup

At minimum read:
1. `START_HERE.md`
2. `00_MASTER/MODULE_REGISTRY.md`
3. `00_MASTER/CORE_RULES.md`
4. `00_MASTER/MASTER_SPEC.md`
5. `00_MASTER/DRAWING_INSTRUCTIONS.md`
6. `00_MASTER/ANATOMY_STABILITY.md`
7. `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`
8. the active module protocol
9. the active module's current task/queue/state
10. the active module's current reference/prompt package

Do not load another module's reference, queue, dataset, or production goal unless the active module explicitly requires it.

## 4. Generic task ownership

When the active module uses a queue:
1. Fetch the latest authoritative queue/state.
2. Re-check the active module goal.
3. Select one compatible QUEUED task.
4. Create a unique runtime Claim ID.
5. Update the queue using the exact fetched SHA/CAS mechanism.
6. If the conditional update conflicts or fails, do not generate; re-fetch.
7. Verify Worker ID, Claim ID, and Lease before generation.

A successful claim gives temporary execution ownership only.

If the active module does not use a queue, follow that module's own execution contract.

## 5. Generation start

Immediately before generation:
1. Re-fetch authoritative task state when required by the module.
2. Verify Claim/Lease ownership when applicable.
3. Change the task to its generation state using the latest state SHA.
4. Generate only after the state transition succeeds.

Never generate from a stale or uncertain task state.

## 6. Reference policy

The active module defines the reference policy.

The generic Worker must NOT assume:
- a universal Master Image;
- a specific character;
- a specific age;
- a specific visual style;
- a specific filename;
- a fixed camera angle.

Use only the reference explicitly authorized by the active module and current generation context.

## 7. Pre-generation stability

Before generation, apply the complete current rules in:
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`

Prioritize:
1. stable hand action;
2. finger/toe and limb-source clarity;
3. body ergonomics, support, center of gravity, and joint direction;
4. hand/object and wearable/object connections;
5. lower-body stability;
6. background/effect clearance around anatomy;
7. decorative complexity.

Conceptual planning order:
`fingers/toes → body → clothing/accessories → background/effects`

Simplify an unstable action, prop, strap, container, leg pose, or occlusion BEFORE generation.

## 8. Generic anatomy and contact checks

Before generation:
- confirm the planned pose has exactly two arms/hands and two legs;
- confirm intended finger/toe visibility;
- confirm shoulder/hip and limb-source clarity;
- confirm support surface and center of gravity;
- identify false-limb risks from clothing, bags, straps, props, furniture, or background;
- ensure held objects visibly contact the hand;
- ensure handles remain connected to objects;
- ensure wearable straps connect naturally and do not float, break, or pass through the body.

Hand design should prefer simple, stable actions and broad natural grips. Avoid unnecessary fingertip pinches, interlaced fingers, crossed hands, or effects near fingers.

## 9. Generation result states

Only three generation outcomes are valid:

### SUCCESS
The generation operation explicitly returned a generated image candidate.

Record the module's success state and preserve the candidate.

### FAILED
The generation operation explicitly failed.

Follow the active module's retry/recovery policy.

### UNKNOWN
The Worker cannot reliably determine whether generation succeeded.

Record:
`GENERATION_RESULT: UNKNOWN`
and the module's recovery state, such as `RECOVERY_REQUIRED`.

STOP.

Never regenerate an UNKNOWN result merely because its status is uncertain.

## 10. Post-generation boundary

After SUCCESS:
1. Confirm only that the generation operation returned a candidate.
2. Do NOT perform visual QA.
3. Do NOT judge PASS / REPAIR / REJECT.
4. Do NOT regenerate merely because the candidate could be improved.
5. Re-fetch state as required by the active module.
6. Record the successful generation event.
7. Preserve the candidate.
8. Release the task/Worker according to the active module.
9. Continue only if the active module authorizes another task.

A successful generation is not equivalent to final QA acceptance.

## 11. Quota exhaustion

If the platform explicitly reports that the current Worker/session has exhausted its generation quota:
- this is not a design failure;
- safely release the current task when no successful generation result exists;
- follow the active module's queue/state recovery rule;
- stop this Worker session.

Quota exhaustion must not be converted into a false FAILED result unless the active module explicitly defines otherwise.

## 12. System or policy stop

If the platform explicitly reports a system/policy stop:
- preserve the original task and prompt;
- do not rewrite the prompt to bypass the restriction;
- record the module-defined blocked/failed state;
- release the claim/lease;
- stop or follow the module's recovery contract.

## 13. Generation tool errors

For a tool error where generation status is explicitly FAILED:
- follow the active module's retry policy;
- do not assume the prompt is wrong;
- do not silently change the design;
- respect per-task and global retry/circuit-breaker limits.

If generation status cannot be determined, use UNKNOWN/RECOVERY_REQUIRED instead.

## 14. Worker restrictions

Workers must not:
- redesign global identity or style outside the active module's authority;
- generate before successful task ownership when a queue is used;
- use a stale queue snapshot;
- declare final QA acceptance;
- perform final QA;
- continue writing after lease expiry;
- change the active module goal;
- import another module's rules merely for convenience;
- substitute another module's reference;
- regenerate an UNKNOWN result;
- rewrite prompts to bypass a safety restriction.

## 15. QA separation

Generation Workers stop at generation completion.

Downstream QA, data curation, upload, delivery, or human review belongs to the applicable module(s). No account number or named Worker is permanently assigned final QA authority by this generic protocol.

## 16. Core principle

`CORE → MODULE → MODULE-OWNED DATA / STATE`

The generic Generation Worker executes the active module. It does not redefine that module.

