# Make Integration — LoRA Production

## Status

PAUSED with LORA_PRODUCTION.

This directory contains Make/OpenAI automation data that belongs exclusively to the LORA_PRODUCTION module.

## Ownership

Make integration data here is module-specific. It must not be loaded by CORE or UNIVERSAL_WALLPAPER.

## Runtime load order

1. `00_MASTER/CORE_RULES.md`
2. `00_MASTER/LORA_PRODUCTION_PROTOCOL.md`
3. `00_MASTER/LORA_PRODUCTION/MAKE_INTEGRATION/MAKE_RUNTIME_CONTEXT.md`
4. LoRA Goal / queue / state
5. Approved LoRA reference assets
6. Applicable LoRA prompt and dataset rules

## Reference

The approved age-20 LoRA reference is an input to the future Make/OpenAI production workflow. The binary reference asset is stored separately from text automation rules.

## Boundary

Make automation may execute LoRA production only when LORA_PRODUCTION is explicitly ACTIVE. Universal Wallpaper must not load this directory.
