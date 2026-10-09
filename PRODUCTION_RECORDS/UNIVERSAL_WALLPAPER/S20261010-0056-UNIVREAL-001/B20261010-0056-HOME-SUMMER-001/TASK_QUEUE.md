# TASK_QUEUE.md

| ORDER | TASK_ID | PROMPT_ID | PROMPT_VERSION | PROMPT_STATUS | TASK_STATUS | GENERATION_STATUS | ATTEMPT_COUNT | EXPECTED_OUTPUT_COUNT | ACTUAL_OUTPUT_COUNT | PROMPT_CONSUMED | PROMPT_STATE |
|---:|---|---|---|---|---|---|---:|---:|---:|---|---|
| 1 | T01 | P01 | v1 | DRAFT | PENDING | NOT_STARTED | 0 | 1 | 0 | NO | AVAILABLE |
| 2 | T02 | P02 | v1 | DRAFT | PENDING | NOT_STARTED | 0 | 1 | 0 | NO | AVAILABLE |
| 3 | T03 | P03 | v1 | DRAFT | PENDING | NOT_STARTED | 0 | 1 | 0 | NO | AVAILABLE |
| 4 | T04 | P04 | v1 | DRAFT | PENDING | NOT_STARTED | 0 | 1 | 0 | NO | AVAILABLE |
| 5 | T05 | P05 | v1 | DRAFT | PENDING | NOT_STARTED | 0 | 1 | 0 | NO | AVAILABLE |
| 6 | T06 | P06 | v1 | DRAFT | PENDING | NOT_STARTED | 0 | 1 | 0 | NO | AVAILABLE |

Global task contract:
- One Task = one independent image.
- EXPECTED_OUTPUT_COUNT = 1 for every wallpaper Task.
- Current visual reference: uploaded reference image, sole visual identity authority.
- SOURCE OUTFIT MUST BE REPLACED; SOURCE POSE MUST BE IGNORED.
- PET_ALLOWED = NO.
- Every image must include a skirt.
- Prompt Set must be locked before execution.
