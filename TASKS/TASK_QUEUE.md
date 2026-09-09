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
- Status: ASSIGNED
- Account: ACCOUNT_06
- Goal: 確認 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 已正式存在，並作為所有帳號共同人物身份基準。
- Target: 1
- Priority: P0

### T002 — 六帳號新聊天室啟動測試
- Status: IN_PROGRESS
- Account: ACCOUNT_01～ACCOUNT_06
- Goal: 確認六個 ChatGPT 帳號都能依 `START_HERE.md` 找到專案規則、任務與自己的帳號狀態；ACCOUNT_06 另確認最終審查規則。
- Target: 6
- Priority: P0
- Progress: ACCOUNT_01 startup verification completed; remaining accounts not yet verified in this workspace.

---

## 第二階段：角色分工資料生產

### T101 — CHARACTER 人物資料
- Status: UNASSIGNED
- Account: ACCOUNT_01
- Theme: 人物身份／外觀一致性
- Project Area: `01_CHARACTER`
- Goal: 建立穩定的 20 歲依娜莉亞人物特徵與身份資料。
- Target: 待定
- Priority: P1

### T102 — CLOTHING 服裝資料
- Status: UNASSIGNED
- Account: ACCOUNT_02
- Theme: 服裝／鞋履／配件
- Project Area: `02_CLOTHING`
- Goal: 建立服裝與配件多樣性，同時維持人物與全域風格一致。
- Target: 待定
- Priority: P1

### T103 — SCENE 場景資料
- Status: BLOCKED
- Account: ACCOUNT_03
- Theme: 場景／環境／光線
- Project Area: `03_SCENE`
- Goal: 建立不同環境、季節、時間與光線條件，避免資料高度重複。
- Target: 待定
- Priority: P1
- Blocker: 尚未提供本批次具體圖片數量、場景／環境方向等可執行規格；`WORKFLOW/GENERATION_RULES.md` 亦不存在於 repository。

### T104 — POSE_CAMERA 姿勢與鏡位資料
- Status: UNASSIGNED
- Account: ACCOUNT_04
- Theme: 姿勢／動作／鏡位／構圖
- Project Area: `04_POSE_CAMERA`
- Goal: 建立人體工學正確且高度多樣的姿勢、動作、視角與景別資料。
- Target: 待定
- Priority: P1

### T105 — PROMPT 提示詞資料
- Status: UNASSIGNED
- Account: ACCOUNT_05
- Theme: 提示詞／生成指令
- Project Area: `05_PROMPT`
- Goal: 將人物、服裝、場景、姿勢與鏡位條件整合成可穩定執行的生成提示詞。
- Target: 待定
- Priority: P1

### T106 — FINAL REVIEW 最終整合審查
- Status: UNASSIGNED
- Account: ACCOUNT_06
- Theme: 最終品質驗收
- Project Area: Final Quality Control
- Goal: 依 `WORKFLOW/QUALITY_CONTROL.md` 對各帳號成果進行最終 PASS / REVIEW / REJECT 判定。
- Target: 依實際生產量
- Priority: P0

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

任務之間應盡量避免高度重複，並補足不同資料維度。每個任務應明確定義主題、服裝、髮型、配件、姿勢／動作、構圖比例、目標圖片數、已完成數、PASS / REVIEW / REJECT 與備註。

---

## 任務更新規則

帳號完成工作後必須更新任務狀態、已完成數量、PASS / REVIEW / REJECT、主要生成方向與是否需要重新生成。

任務完成後才能標記 DONE。若只有部分圖片合格，不可假設全部完成。

ACCOUNT_06 的審查結果為最終品質閘門；若需要重工，應退回對應負責帳號處理。
