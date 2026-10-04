# CURRENT_ARCHITECTURE_VERIFICATION.md

## Purpose

This file defines the verification contract for the current repository HEAD.

It is not a permanent claim that the architecture is correct forever. Any architecture, authority, module-state, or validator change requires a new verification run.

## Required command

`node scripts/validate_architecture.mjs --root .`

A historical Council verification document does not substitute for validation of the current HEAD.

## Canonical-state requirements

ACTIVE modules with persistent state must have real module-owned canonical storage.

- Universal Wallpaper: `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/`
- LoRA: `MODULES/LORA_PRODUCTION/BATCHES/`

## Authority requirements

- Festival execution authority: `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
- Festival cultural data authority: `FESTIVAL_COSTUME_DATABASE/`
- The cultural database must not contain a second Festival Wallpaper master instruction.

## Verification rule

Do not mark this document VERIFIED unless the validator has been run against the exact current commit and the result is PASS.
