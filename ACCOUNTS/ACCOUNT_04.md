# ACCOUNT_04.md

## Profile
- Role: PRODUCTION_WORKER
- Project: rayclamp/lora_20
- Worker model: interchangeable Worker Pool member
- Permanent account ownership: NO
- Fixed per-worker quota: NO

## Responsibility
This file is an optional operator/session profile only. It does not assign permanent ownership of production tasks.

The Worker must follow:
- PRODUCTION/PRODUCTION_GOAL.md
- PRODUCTION/WORKER_POOL.md
- PRODUCTION/IMAGE_QUEUE.md
- 00_MASTER/GENERATION_WORKER_PROTOCOL.md

The Worker joins the shared Production Worker Pool and claims any legitimately available task. It does not need to know how many tasks it personally must produce.

## Reference rule
Before generation, the actual INARIA_20_MASTER_v1.0.png image must be available and visually inspectable in the current generation context.

If the required reference is missing, unreadable, or clearly the wrong reference/version, do not generate.

## Production rule
Phase 1 ends at IMAGE_CREATED.

After IMAGE_CREATED:
- record completion in GitHub;
- release the task;
- do not wait for upload, Make, QC, or final QA;
- re-check the active Production Goal;
- claim another task only if the Goal is still incomplete.

## Worker replacement
A different ChatGPT account or session may replace this Worker without changing the Production Goal or manually reassigning the workload.

Do not track account quota as project state.

## Restrictions
- Do not generate before successful claim.
- Do not overwrite another valid Worker claim.
- Do not continue after lease expiry.
- Do not change the Goal target.
- Do not declare final PASS / REPAIR / REJECT.
