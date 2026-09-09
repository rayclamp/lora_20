# ACCOUNT_05.md

# ChatGPT 帳號工作站狀態

## Account

- Account: ACCOUNT_05
- Role: PROMPT
- Project Area: `05_PROMPT`
- Status: DONE
- Current Task: T105 — PROMPT 提示詞資料

## Responsibility

負責生成提示詞、場景與人物條件整合、提示詞結構化與生成指令品質。

提示詞必須遵守目前專案規則，不得引入與專案衝突的歷史畫風或舊聊天室風格。

## Progress

- Generated: 20
- PASS: 20
- REVIEW: 0
- REJECT: 0

## Startup / Upstream Verification

- 2026-09-09: ACCOUNT_05 re-read the current `START_HERE.md`, `PROJECT_STATUS.md`, `TASKS/TASK_QUEUE.md`, `WORKFLOW/GENERATION_RULES.md`, `WORKFLOW/STYLE_MASTER.md`, `WORKFLOW/IDENTITY_MASTER.md`, and this account state.
- `WORKFLOW/GENERATION_RULES.md` is the workflow-facing alias; authoritative generation rules remain `00_MASTER/GENERATION_RULES.md`.
- Uploaded age-20 MASTER_IMAGE is the active visual identity reference; it is used only for identity / appearance consistency, not as a fixed clothing, pose, composition, background, camera, or style template.
- T102 / ACCOUNT_02: DONE / PASS, 20 of 20; `02_CLOTHING/T102_CLOTHING_HANDOFF_v1.0.md` verified available.
- T103 / ACCOUNT_03: DONE / PASS, 20 of 20; `03_SCENE/T103_SCENE_HANDOFF_v1.0.md` verified available.
- T104 / ACCOUNT_04: DONE / PASS, 20 of 20; `04_POSE_CAMERA/T104_POSE_CAMERA_HANDOFF_v1.0.md` verified available.
- Required upstream handoff set is complete and versioned; T105 final integration was therefore executed.

## Current Task

T105 — PROMPT 提示詞資料

Status: DONE / PASS.

Deliverable:
- `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- 20 complete modular Prompt Packages: PP01–PP20

Integration result:
- T101 Character v1.1 integrated as the fixed identity module.
- T102 C01–C20 integrated once each.
- T103 S01–S20 integrated once each.
- T104 P01–P20 integrated once each.
- Identity trigger `inr20` used consistently.
- Character identity target: preserve high recognizability (95–99% production objective) while avoiding invented permanent facial measurements.
- Five-finger / five-toe anatomy rules and stable-generation constraints are encoded in the common negative module and package-specific negatives.
- Approved project style is used; historical chats and unrelated project styles were not imported.

## Prompt Package Structure

Each package separates:
1. Character
2. Clothing
3. Scene
4. Pose / Camera
5. Lighting / Style
6. Negative constraints

The 20 packages intentionally cover both 9:16 and 16:9, varied hair arrangements, four seasons, urban/rural/natural/interior environments, and distinct stable poses/camera compositions without creating new upstream design units.

## QA / Scope Boundary

- PASS means the Prompt Package handoff is complete and structurally compliant.
- It does not mean the final images have passed image-level QC.
- Model/workflow-specific generation parameters remain to be recorded when actual images are generated.
- T106 remains the final image-quality gate.

## Next Step

T105 is complete. The next project stage is first-round image generation from the 20 approved Prompt Packages, followed by ACCOUNT_06 final PASS / REVIEW / REJECT review.

## Notes

- Do not redo T105 unless the task is explicitly changed to NEED_REWORK or a new revision is requested.
- Do not change upstream Character, Clothing, Scene, or Pose/Camera specifications from the Prompt department.
- Do not promote hairstyle, clothing, scene, pose, or camera details into permanent character identity traits.
