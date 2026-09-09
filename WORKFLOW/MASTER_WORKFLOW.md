# MASTER_WORKFLOW.md

# 20歲依娜莉亞 LoRA 生產總流程

## 1. 專案目標

建立可長期維護、可由多個 ChatGPT 帳號共同生產的 20 歲依娜莉亞 LoRA 圖片資料集。

GitHub 是專案的持久化規則與進度來源；ChatGPT 聊天室只負責當前工作階段。

---

## 2. 核心資料來源

### 人物身份

`MASTER/20歲 MASTER_IMAGE.png`

用於確認「這個人是誰」。

### 視覺風格

`WORKFLOW/STYLE_MASTER.md`

用於確認「圖片應該長什麼樣」。

### 長期繪圖規則

`WORKFLOW/DRAWING_INSTRUCTIONS.md`

### 身份規則

`WORKFLOW/IDENTITY_MASTER.md`

### 品質驗收

`WORKFLOW/QUALITY_CONTROL.md`

### 帳號工作規則

`WORKFLOW/ACCOUNT_WORKFLOW.md`

---

## 3. 標準生產流程

```text
啟動聊天室
  ↓
讀取 START_HERE
  ↓
讀取專案狀態
  ↓
讀取全域工作規則
  ↓
確認 ACCOUNT_XX
  ↓
取得 TASK
  ↓
讀取 MASTER_IMAGE / 身份規則 / 風格規則
  ↓
建立本次生成內容
  ↓
生成圖片
  ↓
QUALITY_CONTROL 驗收
  ↓
PASS / REVIEW / REJECT
  ↓
記錄結果
  ↓
更新 ACCOUNT_XX
  ↓
任務完成？
  ├─ 否 → 繼續目前任務
  └─ 是 → 接下一個任務或等待
```

---

## 4. 生成與驗收的核心優先順序

1. 人物身份。
2. 人體與手腳正確性。
3. 統一視覺風格。
4. 當前任務正確性。
5. 構圖完整性。
6. 畫面品質。
7. LoRA 訓練價值。
8. 資料多樣性。

---

## 5. 歷史內容隔離

舊聊天室、舊生成圖片、其他專案的風格不得成為本專案的隱性規則。

每個新聊天室都必須重新依 GitHub 文件建立工作上下文。

如果歷史內容與專案文件衝突，以專案文件與當前 TASK 為準。

---

## 6. 多帳號資料分工

多帳號不是用來複製同一批圖片，而是分散不同的資料維度。

每個 ACCOUNT 應避免與其他 ACCOUNT 大量重複：

- 場景。
- 姿勢。
- 視角。
- 服裝。
- 髮型。
- 配件。
- 光線。
- 動作。

所有結果最後匯入同一個 LoRA dataset。

---

## 7. 品質控制

所有圖片必須經過 `QUALITY_CONTROL.md`。

未經驗收的圖片不能直接視為正式訓練資料。

---

## 8. 任務完成定義

一個 TASK 只有在：

- 要求數量達成；且
- 圖片完成驗收；且
- PASS / REVIEW / REJECT 狀態已記錄；且
- ACCOUNT 狀態已更新；

才算工作單元完成。

---

## 9. 最終目標

建立一個可以在未來持續擴充的生產系統：

> GitHub 保存規則與記憶 → TASK_QUEUE 分配工作 → 多個 ChatGPT 帳號生產 → 統一 QC → 合格資料集中化 → 用於 20 歲依娜莉亞 LoRA 訓練。
