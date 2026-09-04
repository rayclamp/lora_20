# HANDOFF PROTOCOL

## 1. Purpose

This is the common handoff format for the six-account production system. It prevents information loss, ambiguous ownership, and silent rule changes.

## 2. Department IDs

- `CHARACTER` — Account 1
- `CLOTHING` — Account 2
- `SCENE` — Account 3
- `POSE_CAMERA` — Account 4
- `PROMPT_GENERATION_DATASET` — Account 5
- `DIRECTOR` — Account 6

## 3. Handoff Record

Every department handoff should use this structure:

```yaml
job_id: JOB-YYYYMMDD-###
from: DEPARTMENT
stage: PREFLIGHT|DESIGNING|GENERATING|REVIEWING|REPAIR|RECHECK|FINAL
spec_version: ""
input_refs: []
request: ""
decisions: []
locked_constraints: []
intentional_variations: []
output_refs: []
issues: []
next_owner: ""
status: READY|WAITING|BLOCKED|DONE
notes: ""
```

## 4. Ownership

### Character
Owns identity definition and identity-preservation decisions. Does not decide scene composition or garment design unless explicitly requested.

### Clothing
Owns clothing/accessory/footwear design. Must respect character identity and pose feasibility.

### Scene
Owns environment and atmosphere. Must not visually overpower the character or create avoidable anatomy/hand conflicts.

### Pose/Camera
Owns pose, gesture, framing, perspective and camera logic. Stability has priority over spectacle.

### Prompt/Generation/Dataset
Owns prompt assembly, generation configuration, captioning, metadata and dataset packaging. It must not silently redefine character identity or other department rules.

### Director
Owns integration, conflict resolution, approval gates, repair routing and final release.

## 5. Conflict Handling

If two departments disagree:

1. identify the exact conflict
2. check explicit user instructions
3. check Master rules
4. check approved references
5. check both specialist specs
6. choose the solution that preserves higher-priority constraints
7. record the decision

No conflict should be hidden by simply rewriting one department's output.

## 6. Handoff Quality Requirements

A handoff is incomplete if it lacks:

- job identity
- source/version
- clear ownership
- usable output references
- locked constraints
- unresolved issues
- next owner

## 7. Director Acceptance

The Director may return a handoff when it is:

- ambiguous
- internally contradictory
- missing required constraints
- missing references
- based on an obsolete specification
- likely to cause downstream rework

## 8. Minimal Handoff Principle

Pass only information needed by the next stage, but never omit information that can change generation, QA, or final dataset decisions.
