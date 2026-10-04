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
