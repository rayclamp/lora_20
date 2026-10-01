# MAKE_AUTOMATION_CONTRACT.md — LoRA Production

## Purpose

Define the data boundary between Make/OpenAI automation and the LORA_PRODUCTION module.

## Make inputs

Make must obtain, from module-owned sources:

- active LoRA Goal
- task / queue item
- approved age-20 reference asset
- applicable LoRA prompt/design rules
- generation parameters required by the task
- runtime Worker identity / lease information when the queue requires it

## Make outputs

Make must record:

- task identifier
- generation attempt/result
- generated asset reference or delivery handoff identifier
- prompt/design metadata required by the module
- execution timestamp
- Worker/runtime identifier
- recovery state when generation result is UNKNOWN or execution cannot safely continue

## State rules

- SUCCESS means generation actually returned a generated image.
- FAILED means the generation operation explicitly failed.
- UNKNOWN means the result cannot be reliably determined.
- UNKNOWN requires recovery and must not trigger blind regeneration.
- Queue/state ownership remains inside LORA_PRODUCTION.
- Make must not rewrite CORE rules to complete a task.

## Reference rule

The age-20 master reference is a stable module-owned input. Make must not substitute a Universal Wallpaper reference image.

## QA boundary

Generation completion is not QA acceptance. Downstream QA remains independent.

## Future integration

When LORA_PRODUCTION is activated, Make scenarios may load this contract and the runtime context above. Scenario-specific implementation details should remain in Make rather than being promoted into CORE.
