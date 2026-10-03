# ARCHITECTURE_ENFORCEMENT_SPEC.md — Council Round 5

## Purpose

This document defines the enforcement layer for the current INARIA AI STUDIO architecture.

The architecture documents define what the system is.
This enforcement specification defines what must be mechanically provable before the repository is considered structurally valid.

## Enforcement principle

> A declared architecture relationship is not considered enforced unless the validator can verify it from the current repository.

The validator must fail closed for execution-critical inconsistencies.

## Required contracts

### 1. Registry ↔ Runtime

For every registered module:

- the module exists in MODULE_REGISTRY;
- the module has a valid ACTIVE or PAUSED state;
- RUNTIME_STATE contains the same module;
- RUNTIME_STATE contains the same state.

A mismatch is a hard failure.

### 2. Active workflow ↔ active module

The Runtime ACTIVE_WORKFLOW must:

- name an existing registered module;
- point only to an ACTIVE module;
- use a mode recognized by that module's current protocol.

A paused module cannot be selected as the active workflow.

### 3. Module ↔ protocol

Every registered module must have its current canonical execution/behavior contract.

Current contracts:

- UNIVERSAL_WALLPAPER → UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md
- FESTIVAL_WALLPAPER → FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md
- LORA_PRODUCTION → MODULE.md + current production chain
- QA → QA_MODULE.md + QA_PROTOCOL.md
- IMAGE_DELIVERY → IMAGE_DELIVERY_MODULE.md

### 4. Authority Matrix ↔ filesystem

Every canonical file or directory named by AUTHORITY_MATRIX.md must exist.

The Authority Matrix may not point to deleted, superseded, or invented paths.

### 5. CORE isolation

CORE must remain cross-system only.

The validator rejects module-specific authority markers such as:

- age-20
- LoRA dataset
- festival cultural data
- wallpaper-specific workflow
- account-specific authority

This is a structural guard, not a substitute for semantic review.

### 6. Legacy exclusion

The current repository must not contain:

- old T109/T108 task state;
- account-number Worker authority;
- root-level legacy LoRA production paths;
- old handoff pipeline;
- deprecated Master Image authority;
- superseded wallpaper composition authority.

Legacy path and token checks are mandatory.

### 7. Module activation guards

A PAUSED module must not expose an executable current state.

When LoRA is PAUSED:

- no Goal is active;
- no Queue is executable;
- Worker execution is blocked.

When QA is PAUSED:

- QA_MODULE and QA_PROTOCOL remain explicitly PAUSED.

When Image Delivery is PAUSED:

- its module contract remains explicitly PAUSED.

If a module is later activated, its activation chain must be verified before execution.

### 8. QA boundary

The validator must preserve the distinction:

Generation SUCCESS → IMAGE_CREATED → QA inspection

Generation success is not QA PASS.

QA must route through SOURCE_MODULE and must have explicit incomplete/conflict handling.

### 9. Wallpaper task integrity

The Universal Wallpaper task contract must enforce the existence of:

- DESIGN_LOCK;
- IMAGE_ID_LOCK;
- FORMAT_LOCK;
- EXPECTED_OUTPUT_COUNT;
- OUTPUT_COUNT_MISMATCH;
- INVALID_IMAGE_ID;
- UNKNOWN / RECOVERY_REQUIRED.

Task identity, task coverage, generation result, and QA acceptance remain separate concepts.

### 10. Worker safety

The generic Worker contract must retain:

- atomic task claim;
- Claim/Lease verification;
- SUCCESS / FAILED / UNKNOWN states;
- UNKNOWN recovery;
- no self-QA.

## What this validator does not claim

This validator does not prove:

- visual image quality;
- cultural correctness of every festival record;
- semantic equivalence of all prose rules;
- model behavior;
- external service availability;
- ComfyUI execution success.

Those remain the responsibility of their respective modules and QA processes.

## Phase 2 — Validator Self-Test / Failure Injection

The repository must contain a deterministic self-test harness:

- `scripts/test_architecture_validator.mjs`

The self-test must:

1. verify a clean fixture is accepted;
2. inject Registry ↔ Runtime mismatch and require rejection;
3. inject ACTIVE workflow → PAUSED module and require rejection;
4. inject an Authority Matrix → nonexistent canonical path and require rejection;
5. remove required QA contract evidence and require rejection;
6. activate LoRA while its execution chain remains blocked and require rejection;
7. inject a forbidden legacy path and require rejection;
8. inject a forbidden legacy token and require rejection;
9. restore a clean fixture and require acceptance.

The harness must run against isolated temporary fixtures and must never mutate the real repository.

The production validator supports an optional `--root <path>` argument specifically so the self-test can execute isolated fixtures without changing the validator's default behavior.

## Round 5 completion condition

Council Round 5 is structurally complete when:

1. the enforcement validator exists;
2. cross-file contracts are checked;
3. legacy exclusion is checked;
4. module activation guards are checked;
5. QA/task/worker boundaries are checked;
6. the validator has a deterministic failure-injection self-test;
7. the self-test returns PASS;
8. the validator returns PASS on the current repository.

The repository then moves from:

Architecture Defined

to:

Architecture Mechanically Enforced.
