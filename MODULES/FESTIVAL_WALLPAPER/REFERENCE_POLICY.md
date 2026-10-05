# REFERENCE_POLICY.md — Festival Wallpaper Reference Authority

## Purpose

This document is the module-owned visual reference policy for Festival Wallpaper.

It defines visual person-reference authority only. Festival cultural data, scene design, prompt execution, and task state remain owned by their respective canonical authorities.

## Authority boundary

Festival Wallpaper owns this reference policy.

ChatGPT's internal production mechanisms may apply this policy, but they must not invent or substitute a visual reference.

The Inaria Character Specification at `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` is a **character-semantic authority**. It is not a visual reference asset.

LoRA reference assets are outside this module and must never be imported as Festival Wallpaper references.

## Allowed reference sources

A Festival Wallpaper task may establish visual person identity through:

1. **EXPLICIT_TASK_REFERENCE**
   - A visual person reference supplied with the current task/request.

2. **MODULE_APPROVED_REFERENCE**
   - A canonical reference explicitly approved by this Festival Wallpaper module through a future/active module reference registry.

3. **NO_REFERENCE**
   - No visual reference is available and the applicable Festival Wallpaper task rules permit semantic character construction without one.

The selected source and provenance must be recorded.

## Forbidden behavior

The production mechanism MUST NOT:

- search another production module for a reference;
- use a LoRA Master Image as a Festival Wallpaper reference;
- treat `INARIA_CHARACTER_SPEC.md` as a visual image/reference;
- infer a visual reference from the character name alone;
- silently substitute another module's reference;
- claim reference resolution without observable evidence.

## Reference resolution states

- `EXPLICIT_TASK_REFERENCE`
- `MODULE_APPROVED_REFERENCE`
- `NO_REFERENCE`
- `REFERENCE_BLOCKED`

If the applicable task requires a visual reference and none can be legally resolved, execution must stop.

## Required trace

Preserve when observable:

- `REFERENCE_SOURCE_TYPE`
- `REFERENCE_AUTHORITY_STATUS`
- `REFERENCE_ID`
- `REFERENCE_PROVENANCE`
- `REFERENCE_VERIFICATION_STATUS`

Use `NOT_OBSERVABLE` when the runtime cannot expose a value.

## Core invariant

**Festival cultural authority and character semantic authority do not become visual reference authority. Visual reference authority belongs to this module's reference policy.**
