# REFERENCE_POLICY.md — Universal Wallpaper Reference Authority

## Purpose

This document is the module-owned visual reference policy for Universal Wallpaper.

It defines **which authority may establish the visual person reference for a Universal Wallpaper task**. It does not define character semantics, prompt execution, task state, or generation runtime.

## Authority boundary

Universal Wallpaper owns this reference policy.

System Automation, Dispatch, and the Shared Worker Runtime may enforce this policy, but they must not invent or substitute a visual reference.

The Inaria Character Specification at `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` is a **character-semantic authority**. It is not a visual reference asset and must never be treated as one.

LoRA reference assets are outside this module and must never be imported as Universal Wallpaper references.

## Allowed reference sources

A Universal Wallpaper task may establish visual person identity through exactly one of these routes:

1. **EXPLICIT_TASK_REFERENCE**
   - A visual person reference is supplied with the current task/request.
   - That reference is authoritative for the visual person for that task.

2. **MODULE_APPROVED_REFERENCE**
   - The Universal Wallpaper module provides a canonical, module-owned reference through a future/active module reference registry.
   - The registry entry must be explicitly marked approved for Universal Wallpaper.
   - The Worker must record the resolved registry identity and provenance.

3. **NO_REFERENCE**
   - No visual reference is available.
   - The Worker may use the Inaria Character Specification as fallback character identity semantics only when the task explicitly requests Inaria.
   - The Worker must not claim that a visual reference was resolved.

## Forbidden behavior

The Worker / Automation Engine MUST NOT:

- search another production module for a reference;
- use a LoRA Master Image as a Wallpaper reference;
- infer a visual reference from the character name alone;
- treat `INARIA_CHARACTER_SPEC.md` as an image/reference asset;
- copy a reference from another module because it depicts the same character;
- silently substitute a different image when the selected reference is unavailable;
- claim `REFERENCE_AUTHORITY_RESOLVED` when the source is not observable.

## Reference resolution states

- `EXPLICIT_TASK_REFERENCE`
- `MODULE_APPROVED_REFERENCE`
- `NO_REFERENCE`
- `REFERENCE_BLOCKED`

If a task requires a visual reference and the selected source cannot be resolved, execution must stop with `REFERENCE_BLOCKED`.

If no visual reference is required by the applicable task/module rules, `NO_REFERENCE` is valid and must be recorded explicitly.

## Required trace

The Worker should preserve:

- `REFERENCE_SOURCE_TYPE`
- `REFERENCE_AUTHORITY_STATUS`
- `REFERENCE_ID` when observable
- `REFERENCE_PROVENANCE`
- `REFERENCE_VERIFICATION_STATUS`

Unobservable fields must be recorded as `NOT_OBSERVABLE`; never fabricate them.

## Core invariant

**Character semantics identify who the task is about. The module-owned Reference Policy identifies which visual evidence, if any, may establish the visual person. These authorities are separate.**
