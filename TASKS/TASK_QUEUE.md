# TASK_QUEUE.md

# 20歲依娜莉亞 LoRA 任務佇列

## 使用規則

所有帳號從本文件取得工作。

任務狀態：UNASSIGNED、ASSIGNED、IN_PROGRESS、REVIEW、DONE、NEED_REWORK、BLOCKED。

優先處理自己的 ASSIGNED / IN_PROGRESS 任務；沒有自己的可執行任務時，才取得 UNASSIGNED 任務。

不得重做 DONE 任務，除非任務被改為 NEED_REWORK。

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
- Notes: 現有 v1.1 已完整涵蓋 20 歲身份、鎖定特徵、允許變化、LoRA 選圖、修復／淘汰、Prompt 結構與跨部門 handoff；不得為填充任務而重做。

### T102 — CLOTHING 服裝資料
- Status: IN_PROGRESS
- Account: ACCOUNT_02
- Theme: 服裝／鞋履／配件
- Project Area: `02_CLOTHING`
- Goal: 建立第一輪正式 LoRA 生產所需的服裝與配件多樣性資料。
- Target: 20 個互不高度重複的服裝設計單元
- Completed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Input: T101 Character Specification v1.1
- Deliverable: 版本化 Clothing Handoff，20 個服裝／鞋履／配件設計單元。
- Notes: 不直接生成最終圖片；先建立可供 Scene、Pose/Camera、Prompt 使用的結構化服裝資料。

### T103 — SCENE 場景資料
- Status: IN_PROGRESS
- Account: ACCOUNT_03
- Theme: 場景／環境／光線
- Project Area: `03_SCENE`
- Goal: 建立第一輪正式 LoRA 生產所需的場景與環境多樣性資料。
- Target: 20 個互不高度重複的場景設計單元
- Completed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Input: T101 Character Specification v1.1；T102 Clothing Handoff 可作為已完成服裝條件參考，但不得改寫服裝規格。
- Deliverable: 版本化 Scene Handoff，20 個場景／環境／時間／天候／光線設計單元。
- Notes: 使用 `00_MASTER/GENERATION_RULES.md` 作為生成規則來源；不再以不存在的 `WORKFLOW/GENERATION_RULES.md` 作為 blocker。

### T104 — POSE_CAMERA 姿勢與鏡位資料
- Status: IN_PROGRESS
- Account: ACCOUNT_04
- Theme: 姿勢／動作／鏡位／構圖
- Project Area: `04_POSE_CAMERA`
- Goal: 建立第一輪正式 LoRA 生產所需的人體工學姿勢、動作、視角、景別與構圖資料。
- Target: 20 個互不高度重複的 Pose/Camera 設計單元
- Completed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Input: T101 Character Specification v1.1；T102 Clothing Handoff 與 T103 Scene Handoff 可作為相容性參考。
- Deliverable: 版本化 Pose/Camera Handoff，20 個姿勢／動作／鏡位／構圖設計單元。
- Notes: 生成穩定性、人體工學、五指／五趾與清楚構圖優先。

### T105 — PROMPT 提示詞資料
- Status: ASSIGNED
- Account: ACCOUNT_05
- Theme: 提示詞／生成指令
- Project Area: `05_PROMPT`
- Goal: 將第一輪 Character、Clothing、Scene、Pose/Camera 條件整合成可執行的 Prompt Package。
- Target: 20 個 Prompt Package
- Completed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- Priority: P1
- Input: T101 Character Specification v1.1 + T102/T103/T104 版本化 Handoff；上游未完成前保持 ASSIGNED，不開始最終整合。
- Deliverable: 20 個版本化 Prompt Package，分離 Character / Clothing / Scene / Pose-Camera / Lighting-Style / Negative。
- Notes: 使用 `00_MASTER/GENERATION_RULES.md` 與各 Master / Department 規則；不得引入歷史聊天室畫風。

### T106 — FINAL REVIEW 第一輪最終整合審查
- Status: UNASSIGNED
- Account: ACCOUNT_06
- Theme: 最終品質驗收
- Project Area: Final Quality Control
- Goal: 依 `WORKFLOW/QUALITY_CONTROL.md` 對第一輪正式生產圖片進行 PASS / REVIEW / REJECT 判定。
- Target: 第一輪正式圖片實際生產量；目前規劃 20 張
- Completed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- Priority: P0
- Gate: T105 完成後進入圖片生成，再由 ACCOUNT_06 審查。

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

任務之間應盡量避免高度重複，並補足不同資料維度。每個任務應明確定義主題、服裝、髮型、配件、姿勢／動作、構圖比例、目標圖片數、已完成數、PASS / REVIEW / REJECT 與備註。

---

## 任務更新規則

帳號完成工作後必須更新任務狀態、已完成數量、PASS / REVIEW / REJECT、主要生成方向與是否需要重新生成。

任務完成後才能標記 DONE。若只有部分圖片合格，不可假設全部完成。

ACCOUNT_06 的審查結果為最終品質閘門；若需要重工，應退回對應負責帳號處理。
