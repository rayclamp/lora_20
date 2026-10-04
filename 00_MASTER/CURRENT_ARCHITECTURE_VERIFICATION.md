# CURRENT_ARCHITECTURE_VERIFICATION.md

## Purpose

This file defines the verification contract for the current repository HEAD.

It is not a permanent claim that the architecture is correct forever. Any architecture, authority, module-state, validator, or workflow change requires a new verification run.

## Current verification status

**PENDING RUNTIME VERIFICATION**

This file must remain PENDING until the validator and self-test have been executed against the exact current repository HEAD.

## Required commands

`node scripts/validate_architecture.mjs --root .`

`node scripts/test_architecture_validator.mjs`

Both must return PASS before this document may be marked VERIFIED.

## Canonical-state requirements

ACTIVE modules with persistent state must have real module-owned canonical storage.

- Universal Wallpaper: `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/`
- LoRA: `MODULES/LORA_PRODUCTION/BATCHES/`

## Authority requirements

- Festival execution authority: `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
- Festival cultural data authority: `FESTIVAL_COSTUME_DATABASE/`
- The cultural database must not contain a second Festival Wallpaper master instruction.

## Verification rule

Do not mark this document VERIFIED unless both required commands have been run against the exact current commit and both results are PASS.

The verification record must identify:
- exact verified commit SHA;
- validator result;
- self-test result;
- verification date;
- verifier/runtime context.

## Historical evidence boundary

Historical Council documents may describe prior verification states, but they never substitute for verification of the current HEAD.
