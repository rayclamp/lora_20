# LoRA Production Worker Adapter

## Purpose

LoRA Production does not own a separate Worker system.

All Worker lifecycle, task selection, Claim/Lease/CAS, generation outcome, recovery, and common result-recording mechanics are defined by:

- `00_MASTER/PRODUCTION_WORKER_RUNTIME.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
- `00_MASTER/PRODUCTION_DISPATCH_PROTOCOL.md`
- `00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md`

This file exists only as the LoRA-specific Worker adapter.

## Preconditions

Before execution:
- LoRA is ACTIVE in Runtime State;
- LoRA is ACTIVE in Module Registry;
- the current LoRA Goal/Batch/Task is executable;
- the approved age-20 identity/reference is available;
- CORE rules are loaded;
- the shared Worker Runtime is loaded.

## LoRA-specific execution constraints

The Worker must:
1. load LoRA identity/reference authority;
2. load LoRA dataset and diversity rules;
3. design only within the current LoRA production requirements;
4. apply CORE anatomy/drawing/safety rules;
5. obey the shared Worker Runtime ownership and state contract;
6. record generation results through the shared result contract;
7. use the shared Output/Persistence contract when the current LoRA batch requires GitHub image-artifact upload.

## Output requirement

If the current LoRA production task requires:

`GENERATION SUCCESS → IMAGE ARTIFACT → GITHUB`

that is an output/persistence requirement, not a LoRA-specific Worker or Dispatch system.

The upload mechanism may be implemented by the future Automated Dispatch / Make integration, provided canonical task/result state remains authoritative.

## Isolation

Do not import Wallpaper workflow, Festival cultural authority, another module's task state, another module's identity/reference, or another module's QA profile.

Generation SUCCESS remains distinct from QA PASS.

---END
