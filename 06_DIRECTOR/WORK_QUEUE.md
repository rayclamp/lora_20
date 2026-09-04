# WORK QUEUE

## Status Definitions

| Status | Meaning |
|---|---|
| `QUEUED` | Job exists and is waiting for Director preflight. |
| `PREFLIGHT` | Dependencies and constraints are being verified. |
| `DESIGNING` | Specialist design outputs are being coordinated. |
| `GENERATING` | Candidate images are being produced. |
| `REVIEWING` | Candidates are undergoing QA. |
| `REPAIR` | One or more candidates are undergoing targeted repair. |
| `RECHECK` | Repaired candidates are being fully re-evaluated. |
| `APPROVED` | Requested final candidates passed all gates. |
| `FINALIZED` | Assets and metadata are released to `FINAL/`. |
| `BLOCKED` | Work cannot proceed because a dependency or decision is missing. |
| `REJECTED` | Candidate/job failed acceptance and will not proceed. |
| `CANCELLED` | Work was explicitly stopped. |

## Queue Record

```yaml
job_id: JOB-YYYYMMDD-###
status: QUEUED
priority: NORMAL
owner: DIRECTOR
requested_count: 0
completed_count: 0
repair_count: 0
rejected_count: 0
next_action: ""
blocking_reason: ""
updated_at: YYYY-MM-DDTHH:MM:SS
```

## State Transition Rules

- `QUEUED` → `PREFLIGHT` when Director starts validation.
- `PREFLIGHT` → `DESIGNING` only when required dependencies are available.
- `DESIGNING` → `GENERATING` only when the integrated design package is coherent.
- `GENERATING` → `REVIEWING` when candidates are available.
- `REVIEWING` → `PASS/REPAIR/REJECT` per QA rules.
- `REPAIR` → `RECHECK` after a repair is completed.
- `RECHECK` → `APPROVED` only when the repaired candidate passes full QA.
- `APPROVED` → `FINALIZED` after dataset and metadata audit.
- Any stage → `BLOCKED` if a required dependency is unavailable.
- A candidate may move to `REJECTED` at any review gate.

## Queue Discipline

1. Never skip a required QA gate.
2. Never mark a repaired image final without recheck.
3. Never silently replace an approved reference.
4. Keep rejected candidates traceable.
5. Record the next action whenever a job stops.
6. Update counts after each review batch.
