# PRODUCTION_OUTPUT_PROTOCOL.md — Shared Output / Persistence Boundary

## Purpose

This document separates production-result recording from optional image-artifact persistence.

## Result record

Every production Worker records the generation result in the canonical task/batch state required by its selected module.

Generation result recording is shared Worker Runtime behavior.

## Artifact persistence

An image artifact may additionally be persisted through an Output Adapter.

Examples:

- local output;
- GitHub artifact upload;
- future storage provider.

The destination is an output requirement, not a separate Worker system.

## GitHub Image Artifact Upload

A module may require:

`GENERATION SUCCESS → ARTIFACT UPLOAD → GITHUB`

The upload contract must define:

- source artifact;
- destination path;
- naming;
- idempotency;
- success/failure state;
- retry/recovery;
- authorization;
- ownership of the resulting artifact record.

The upload mechanism may be implemented by Make or another authorized integration.

## Important boundary

Canonical task/result state and image-file artifact storage are distinct:

- Task/result state answers **what happened to the task**.
- Artifact storage answers **where the generated image file is stored**.

A module must not duplicate Worker, Queue, Claim, or Dispatch logic merely because it requires GitHub artifact upload.

## QA boundary

Artifact upload does not equal QA PASS.

QA remains downstream and independent.


## Phase-30 Artifact Persistence Gate

When a task declares `artifactPersistenceRequired: true`, provider `SUCCESS` is not task `SUCCESS` until the Output Adapter returns a verifiable artifact record containing `artifactId`, `uri`, and `sha256`.

The Worker binds the artifact to `BATCH_ID`, `TASK_ID`, `GENERATION_ATTEMPT`, `GENERATION_IDEMPOTENCY_KEY`, `PROMPT_HASH`, and `EXECUTION_CONTEXT_HASH` and persists that binding in canonical task state.

Persistence semantics:
- explicit verified storage failure → `FAILED`;
- storage/transport uncertainty → `UNKNOWN / RECOVERY_REQUIRED`;
- malformed/unverifiable artifact record → `UNKNOWN / RECOVERY_REQUIRED`;
- missing required Output Adapter → `UNKNOWN / RECOVERY_REQUIRED`.

Therefore: `PROVIDER_SUCCESS + ARTIFACT_NOT_VERIFIED != TASK_SUCCESS`.

Artifact persistence recovery must reuse the same generation idempotency key and must not create a second Worker/Queue/Dispatch system.


## Artifact Existence / Retrieval Verification

Artifact persistence is not sufficient by itself to establish task success. When an output adapter supports retrieval verification, the Worker Runtime MUST verify that the persisted URI resolves to the expected artifact and that the retrieved content integrity matches the recorded SHA-256. Verified hash mismatch is FAILED; verified missing artifact is FAILED; storage/retrieval uncertainty is UNKNOWN / RECOVERY_REQUIRED. Task SUCCESS is forbidden until artifact existence and integrity are verified or an upstream persistence adapter explicitly supplies an equivalent verified retrieval result.
