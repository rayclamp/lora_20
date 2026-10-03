# LoRA Worker Protocol

## Preconditions
Before claiming work:
- LoRA is ACTIVE in Runtime State;
- LoRA is ACTIVE in Module Registry;
- a current Goal and Batch are executable;
- a valid reference asset is registered;
- CORE rules are loaded.

## Worker loop
1. resolve current Goal/Batch/Queue;
2. read current task;
3. claim one task atomically;
4. verify Claim/Lease;
5. design only within current LoRA rules;
6. apply CORE anatomy/drawing constraints;
7. generate;
8. record SUCCESS / FAILED / UNKNOWN;
9. release according to state rules;
10. continue only while the Goal remains executable.

## Isolation
Do not consult or recreate previous project task IDs, old prompts, old queues, or account profiles.

Generation ends at IMAGE_CREATED. QA is independent.
