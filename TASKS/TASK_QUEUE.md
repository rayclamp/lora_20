# TASK_QUEUE.md

# 20歲依娜莉亞 LoRA 任務佇列

## 使用規則

所有帳號從本文件取得工作。

任務狀態：UNASSIGNED、ASSIGNED、IN_PROGRESS、REVIEW、DONE、NEED_REWORK、BLOCKED。

優先處理自己的 ASSIGNED / IN_PROGRESS 任務；沒有自己的可執行任務時，才取得 UNASSIGNED 任務。

不得重做 DONE 任務，除非任務被改為 NEED_REWORK。

圖片生產另受 `PRODUCTION/IMAGE_QUEUE.md` 管理；圖片額度中斷時必須從佇列目前位置續作，不得重置。

---

## 第一階段：系統驗證任務

### T001 — 20歲 MASTER_IMAGE 驗證
- Status: DONE
- Account: ACCOUNT_06
- Goal: 確認 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 已正式存在，並作為所有帳號共同人物身份基準。
- Target: 1
- Completed: 1
- Priority: P0
- Result: PASS

### T002 — 六帳號新聊天室啟動測試
- Status: DONE
- Account: ACCOUNT_01～ACCOUNT_06
- Goal: 確認六個 ChatGPT 帳號都能依 `START_HERE.md` 找到專案規則、任務與自己的帳號狀態；ACCOUNT_06 另確認最終審查規則。
- Target: 6
- Completed: 6
- Priority: P0
- Result: PASS
- Notes: ACCOUNT_01～ACCOUNT_05 均已完成新聊天室啟動檢查；ACCOUNT_06 已完成自身啟動與最終審查規則確認。

---

## 第二階段：角色分工資料生產

### T101 — CHARACTER 人物資料
- Status: DONE
- Account: ACCOUNT_01
- Theme: 人物身份／外觀一致性
- Project Area: `01_CHARACTER`
- Goal: 建立穩定的 20 歲依娜莉亞人物特徵與身份資料。
- Target: 1 個正式 Character Specification / Handoff 單元
- Completed: 1
- Priority: P1
- Result: PASS
- Deliverable: `01_CHARACTER/CHARACTER_SPEC.md` v1.1

### T102 — CLOTHING 服裝資料
- Status: DONE
- Account: ACCOUNT_02
- Theme: 服裝／鞋履／配件
- Project Area: `02_CLOTHING`
- Goal: 建立第一輪正式 LoRA 生產所需的服裝與配件多樣性資料。
- Target: 20
- Completed: 20
- PASS: 20
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Deliverable: `02_CLOTHING/T102_CLOTHING_HANDOFF_v1.0.md`
- Result: PASS

### T103 — SCENE 場景資料
- Status: DONE
- Account: ACCOUNT_03
- Theme: 場景／環境／光線
- Project Area: `03_SCENE`
- Goal: 建立第一輪正式 LoRA 生產所需的場景與環境多樣性資料。
- Target: 20
- Completed: 20
- PASS: 20
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Deliverable: `03_SCENE/T103_SCENE_HANDOFF_v1.0.md`
- Result: PASS

### T104 — POSE_CAMERA 姿勢與鏡位資料
- Status: DONE
- Account: ACCOUNT_04
- Theme: 姿勢／動作／鏡位／構圖
- Project Area: `04_POSE_CAMERA`
- Goal: 建立第一輪正式 LoRA 生產所需的人體工學姿勢、動作、視角、景別與構圖資料。
- Target: 20
- Completed: 20
- PASS: 20
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Deliverable: `04_POSE_CAMERA/T104_POSE_CAMERA_HANDOFF_v1.0.md`
- Result: PASS

### T105 — PROMPT 提示詞資料
- Status: DONE
- Account: ACCOUNT_05
- Theme: 提示詞／生成指令
- Project Area: `05_PROMPT`
- Goal: 將第一輪 Character、Clothing、Scene、Pose/Camera 條件整合成可執行的 Prompt Package。
- Target: 20
- Completed: 20
- PASS: 20
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Deliverable: `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- Result: PASS
- Notes: C01–C20、S01–S20、P01–P20 各使用一次；Character / Clothing / Scene / Pose-Camera / Lighting-Style / Negative 模組分離；未引入歷史聊天室或其他專案畫風。

---

## 第三階段：第一輪正式圖片生產

### T107 — IMAGE_PRODUCTION 第一輪 20 張圖片
- Status: UNASSIGNED
- Account: 待正式指定圖片生產帳號
- Theme: 第一輪正式 LoRA 圖片生成
- Project Area: `PRODUCTION`
- Goal: 使用 T105 的 20 個 Prompt Package 產生第一輪 20 張候選圖片。
- Target: 20
- Completed: 0
- GENERATED: 0
- QC_PENDING: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- NEED_REGENERATE: 0
- NOT_STARTED: 20
- Priority: P0
- Input: `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- Queue: `PRODUCTION/IMAGE_QUEUE.md`
- Rule: 每張圖片獨立記錄；遇到圖片生成額度上限時保留進度，額度恢復後從下一個未完成項目續作，不重做已完成圖片。
- Result: NOT_STARTED

### T106 — FINAL REVIEW 第一輪最終整合審查
- Status: UNASSIGNED
- Account: ACCOUNT_06
- Theme: 最終品質驗收
- Project Area: Final Quality Control
- Goal: 依 `WORKFLOW/QUALITY_CONTROL.md` 對第一輪正式生產圖片進行 PASS / REVIEW / REJECT 判定。
- Target: 第一輪正式圖片實際生產量；規劃 20 張
- Completed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- Priority: P0
- Gate: T107 圖片生成完成後進入 T106；不得把預計數量視為實際完成數量。

---

## 正式帳號分工

- ACCOUNT_01 → `01_CHARACTER` → CHARACTER
- ACCOUNT_02 → `02_CLOTHING` → CLOTHING
- ACCOUNT_03 → `03_SCENE` → SCENE
- ACCOUNT_04 → `04_POSE_CAMERA` → POSE_CAMERA
- ACCOUNT_05 → `05_PROMPT` → PROMPT
- ACCOUNT_06 → Final Reviewer → 最終品質審查

六個帳號共同使用同一份 MASTER_IMAGE、STYLE_MASTER、IDENTITY_MASTER、DRAWING_INSTRUCTIONS、GENERATION_RULES 與 QUALITY_CONTROL。

任何帳號都不得建立與專案衝突的個人長期畫風。

---

## 任務設計原則

第一輪以 **20 個最終圖片生產單元** 為規模；前置專業部門以 20 個可組合設計單元建立素材庫，Character 部門則以 1 份正式且完整的 Character Specification / Handoff 作為身份基準。

圖片生產以 `PRODUCTION/IMAGE_QUEUE.md` 為逐張狀態來源；不得因 ChatGPT 圖片生成額度、帳號切換或等待額度恢復而重置已完成圖片。

---

## 任務更新規則

帳號完成工作後必須更新任務狀態、已完成數量、PASS / REVIEW / REJECT、主要生成方向與是否需要重新生成。

任務完成後才能標記 DONE。若只有部分圖片合格，不可假設全部完成。

ACCOUNT_06 的審查結果為最終品質閘門；若需要重工，應退回對應負責帳號處理。
