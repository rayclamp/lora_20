# TASK_QUEUE.md

| ORDER | TASK_ID | PROMPT_ID | PROMPT_VERSION | PROMPT_STATUS | TASK_STATUS | GENERATION_STATUS | EXPECTED_OUTPUT_COUNT | LOCKED_PROMPT_LENGTH |
|---:|---|---|---|---|---|---|---:|---:|
| 1 | TASK_001 | PROMPT_001 | v1 | LOCKED | EXECUTION_INTEGRITY_BLOCKED | FAILED | 1 | 2903 |
| 2 | TASK_002 | PROMPT_002 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 2493 |
| 3 | TASK_003 | PROMPT_003 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 2514 |
| 4 | TASK_004 | PROMPT_004 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 2474 |
| 5 | TASK_005 | PROMPT_005 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 2470 |
| 6 | TASK_006 | PROMPT_006 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 2534 |

All six locked prompts were read back exactly from GitHub main before execution. Generation input must equal the complete readback text for its Task. Level 2 delivery telemetry is recorded according to the current image-generation interface.

TASK_001 ATTEMPT_001: Generation result was returned, but the delivered generation request did not equal the locked prompt; the observed request omitted/changed locked constraints. RESULT NOT BOUND. Do not count as success.
