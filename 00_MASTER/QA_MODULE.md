# QA_MODULE.md — Independent Quality Assurance Module

## Status

**PAUSED**

This module is preserved for future activation.

## Purpose

Own post-generation visual and dataset quality evaluation.

## Boundary

QA is downstream of generation.

A Production Worker must not perform QA in order to decide whether a successful generation event counts as generation success.

QA may inspect:
- anatomy;
- hands and feet;
- identity/reference consistency;
- composition;
- style;
- dataset suitability;
- module-specific acceptance criteria.

## Activation

When activated, this module must define:
- input state;
- inspection criteria;
- PASS / FAIL / REPAIR / REJECT semantics where applicable;
- repair/rework ownership;
- reporting and state transitions.

Existing QA implementation and historical records remain preserved while PAUSED.

## CORE dependency

QA loads CORE rules plus its own QA-specific acceptance criteria. It does not inherit the production workflow of another module.
