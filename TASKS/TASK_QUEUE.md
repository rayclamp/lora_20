# TASK_QUEUE.md — 20歲依娜莉亞 LoRA 任務佇列

## 使用規則

所有帳號從本文件取得工作。

任務狀態：UNASSIGNED、ASSIGNED、IN_PROGRESS、REVIEW、DONE、NEED_REWORK、BLOCKED。

優先處理自己的 ASSIGNED / IN_PROGRESS 任務；沒有自己的可執行任務時，才取得 UNASSIGNED 任務。

不得重做 DONE 任務，除非任務被改為 NEED_REWORK。

圖片生產另受 `PRODUCTION/IMAGE_QUEUE.md` 管理；圖片額度中斷時必須從佇列目前位置續作，不得重置。

---

## 第一階段：系統驗證

### T001 — 20歲 MASTER_IMAGE 驗證
- Status: DONE / PASS
- Account: ACCOUNT_06
- Target: 1
- Completed: 1
- Priority: P0

### T002 — 六帳號新聊天室啟動測試
- Status: DONE / PASS
- Account: ACCOUNT_01～ACCOUNT_06
- Target: 6
- Completed: 6
- Priority: P0

---

## 第二階段：角色分工資料生產

### T101 — CHARACTER 人物資料
- Status: DONE / PASS
- Account: ACCOUNT_01
- Target: 1
- Completed: 1
- Priority: P1
- Deliverable: `01_CHARACTER/CHARACTER_SPEC.md` v1.1

### T102 — CLOTHING 服裝資料
- Status: DONE / PASS
- Account: ACCOUNT_02
- Target: 20
- Completed: 20
- Priority: P1
- Deliverable: `02_CLOTHING/T102_CLOTHING_HANDOFF_v1.0.md`

### T103 — SCENE 場景資料
- Status: DONE / PASS
- Account: ACCOUNT_03
- Target: 20
- Completed: 20
- Priority: P1
- Deliverable: `03_SCENE/T103_SCENE_HANDOFF_v1.0.md`

### T104 — POSE_CAMERA 姿勢與鏡位資料
- Status: DONE / PASS
- Account: ACCOUNT_04
- Target: 20
- Completed: 20
- Priority: P1
- Deliverable: `04_POSE_CAMERA/T104_POSE_CAMERA_HANDOFF_v1.0.md`

### T105 — PROMPT 提示詞資料
- Status: DONE / PASS
- Account: ACCOUNT_05
- Target: 20
- Completed: 20
- Priority: P1
- Deliverable: `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- Notes: C01–C20、S01–S20、P01–P20 各使用一次；Character / Clothing / Scene / Pose-Camera / Lighting-Style / Negative 模組分離；未引入歷史聊天室或其他專案畫風。

---

## 第三階段：第一輪正式圖片生產

### T107 — IMAGE_PRODUCTION 第一輪 20 張圖片
- Status: UNASSIGNED
- Account: 待正式指定圖片生產帳號
- Project Area: `PRODUCTION`
- Goal: 使用 T105 的 20 個 Prompt Package 產生第一輪 20 張候選圖片。
- Target: 20
- Completed: 0
- GENERATED: 0
- QC_PENDING: 0
- PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 0
- NOT_STARTED: 20
- Priority: P0
- Input: `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- Queue: `PRODUCTION/IMAGE_QUEUE.md`
- Rule: 每張圖片獨立記錄；遇到圖片生成額度上限時保留進度，額度恢復後從下一個未完成項目續作，不重做已完成圖片。

### T106 — FINAL REVIEW 第一輪最終整合審查
- Status: UNASSIGNED
- Account: ACCOUNT_06
- Project Area: Final Quality Control
- Goal: 依 `00_MASTER/QUALITY_CONTROL.md` 對第一輪正式生產圖片進行 PASS / REPAIR / REJECT 判定。
- Target: 實際生產量；規劃 20 張
- Completed: 0
- PASS: 0
- REPAIR: 0
- REJECT: 0
- Priority: P0
- Gate: T107 圖片生成完成後進入 T106；不得把預計數量視為實際完成數量。

---

## 正式帳號分工

- ACCOUNT_01 → `01_CHARACTER` → CHARACTER
- ACCOUNT_02 → `02_CLOTHING` → CLOTHING
- ACCOUNT_03 → `03_SCENE` → SCENE
- ACCOUNT_04 → `04_POSE_CAMERA` → POSE_CAMERA
- ACCOUNT_05 → `05_PROMPT` → PROMPT / GENERATION / DATASET
- ACCOUNT_06 → Final Reviewer → 最終品質審查

六個帳號共同使用同一份 MASTER_IMAGE 與 `00_MASTER/` 核心規則。

---

## 任務設計原則

第一輪以 20 個最終圖片生產單元為規模；前置專業部門以 20 個可組合設計單元建立素材庫，Character 部門以 1 份正式 Character Specification 作身份基準。

圖片生產以 `PRODUCTION/IMAGE_QUEUE.md` 為逐張狀態來源；不得因 ChatGPT 圖片生成額度、帳號切換或等待額度恢復而重置已完成圖片。

## 任務更新規則

帳號完成工作後更新任務狀態、完成數量與品質結果。只有真正完成才標記 DONE。ACCOUNT_06 的審查結果是最終圖片品質閘門；需要重工時退回對應負責帳號。
