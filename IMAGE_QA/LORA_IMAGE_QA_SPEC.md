# LORA_IMAGE_QA — Image Acceptance Specification

## Purpose

This is the LoRA-specific acceptance profile used by the independent IMAGE_QA system. It evaluates whether an existing candidate image is suitable for the intended LoRA dataset.

## Required comparison context

- Use the reference person image supplied for the same production request.
- Follow the current task contract and applicable `MODULES/LORA_IMAGE/` rules.
- Respect the selected `CHARACTER` option. `INARIA` may use shared CORE information as contextual guidance, but the uploaded image remains the visual identity authority. `NONE` must not apply Inaria-specific identity data.
- Do not assume age 20, a fixed identity, or a permanent reference image.

## Inspection criteria

Check:
- identity consistency against the current uploaded reference;
- face, hair, and other visible identity anchors;
- natural body proportions;
- hand and finger stability;
- foot and toe stability;
- natural object contact and complete wearable connections;
- task framing and requested composition;
- useful dataset diversity and non-redundancy;
- severe artifacts, false limbs, duplicated-body errors, or anatomy/background fusion;
- accidental animals or pets unless explicitly allowed by the current task contract.

## Evidence and uncertainty

Use visible evidence only. Natural occlusion is not automatically a failure. If occlusion or image quality prevents reliable judgment, mark REVIEW rather than guessing.

A clearly visible hard failure cannot PASS.

## Result classification

- `PASS`: applicable criteria pass and no material unresolved issue remains.
- `REVIEW`: evidence is insufficient for a reliable decision.
- `REPAIR`: a localized defect may be correctable through a separately authorized rework process.
- `REJECT`: the candidate is materially unsuitable or outside the authorized repair path.

Generation SUCCESS is not QA PASS. QA results do not retroactively change generation status.

## Preservation and action boundary

Inspect and report; do not silently overwrite or delete the original candidate. Do not generate a replacement, modify the locked prompt, or trigger regeneration as a consequence of QA. Any repair must create a new candidate/version and preserve the original audit trail.
