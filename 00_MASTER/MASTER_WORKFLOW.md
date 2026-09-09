# MASTER_WORKFLOW.md — 20歲依娜莉亞 LoRA 生產總流程

## 1. 專案定位

建立可長期維護、可由多個 ChatGPT 帳號共同執行的 20 歲依娜莉亞 LoRA 圖片資料集。

GitHub 是跨聊天室的持久化規則、任務、版本與進度來源；聊天室只負責當前工作階段。

## 2. 唯一核心來源

- 人物身份：`MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- 全域規則：`00_MASTER/MASTER_SPEC.md`
- 生成規則：`00_MASTER/GENERATION_RULES.md`
- 視覺風格：`00_MASTER/STYLE_MASTER.md`
- 長期繪圖指令：`00_MASTER/DRAWING_INSTRUCTIONS.md`
- 身份規則：`00_MASTER/IDENTITY_MASTER.md`
- 品質驗收：`00_MASTER/QUALITY_CONTROL.md`
- 多帳號工作規則：`00_MASTER/ACCOUNT_WORKFLOW.md`
- 生產流程：`00_MASTER/PRODUCTION_PROTOCOL.md`
- 任務：`TASKS/TASK_QUEUE.md`
- 逐張生產狀態：`PRODUCTION/IMAGE_QUEUE.md`

## 3. 標準流程

```text
START_HERE
→ PROJECT_STATUS
→ 00_MASTER 核心規則
→ TASK_QUEUE
→ 自己的 ACCOUNT 狀態
→ MASTER_IMAGE（身份）
→ 取得/確認生產任務
→ 生成候選
→ ACCOUNT_06 最終 QA
→ PASS / REPAIR / REJECT
→ 更新 queue / log / account
→ FINAL
```

## 4. 生產優先級

1. 人物身份與年齡
2. 人體、手腳與生成穩定性
3. 當前任務的鎖定要求
4. 構圖與 Pose/Camera
5. 服裝與場景
6. 光影與整體風格
7. 裝飾細節
8. LoRA 訓練價值與多樣性

## 5. 多帳號分工

- ACCOUNT_01：CHARACTER
- ACCOUNT_02：CLOTHING
- ACCOUNT_03：SCENE
- ACCOUNT_04：POSE_CAMERA
- ACCOUNT_05：PROMPT / GENERATION / DATASET
- ACCOUNT_06：FINAL_REVIEWER / QA

ACCOUNT_06 不再使用舊 Director Workspace；最終審查以 `00_MASTER/QUALITY_CONTROL.md`、`PRODUCTION/IMAGE_QUEUE.md` 與實際圖片為準。

## 6. 歷史風格隔離

舊聊天室、舊圖片、其他專案或帳號過往畫風不得成為本專案的隱性規則。新聊天室視為風格重置；衝突時依 `MASTER_SPEC.md` 的權威階層處理。

## 7. 任務完成

工作單元只有在輸出存在、狀態已記錄、必要 QA 已完成、帳號與任務狀態已同步後才算完成。不得重做已完成任務，除非明確標記需要重工。

## 8. 圖片額度中斷

第一輪 20 張由 `PRODUCTION/IMAGE_QUEUE.md` 逐張管理。達到 ChatGPT 圖片生成額度時立即停止在目前位置；保留已完成項目，額度恢復後從下一個未完成項目繼續，不得因額度中斷而重做已完成圖片。
