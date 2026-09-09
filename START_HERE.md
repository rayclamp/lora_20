# START_HERE.md

# 20歲依娜莉亞 LoRA 專案啟動文件

## 新聊天室啟動

新聊天室只需要知道自己負責哪一個帳號：

`ACCOUNT_XX`

啟動後必須先讀取本文件，再依照 `WORKFLOW/ACCOUNT_WORKFLOW.md` 的順序讀取專案規則。

### 建議啟動指令

請讀取 GitHub 的 `rayclamp/lora_20` 專案。

本聊天室負責：`ACCOUNT_XX`

請按照 `START_HERE.md` 開始，讀取目前專案狀態、工作規則、任務佇列，以及本帳號的進度。

我另外上傳了 20 歲依娜莉亞的 MASTER_IMAGE，請將它視為本專案的人物身份視覺基準。

確認目前可以執行的工作後直接繼續，不要重做已完成的工作。

除非需要我操作、需要等待，或目前工作階段已完成，否則不需要回報中間過程。

---

## MASTER_IMAGE 上傳規則

由於 ChatGPT 未必能直接從 GitHub repository 取得並解析 PNG 的實際像素內容，因此：

**每一個負責圖片／人物相關工作的全新 ChatGPT 聊天室，啟動時都應由使用者直接上傳：**

`MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`

上傳的 MASTER_IMAGE 是 20 歲依娜莉亞的最高優先人物身份視覺參考。

### MASTER_IMAGE 的用途

MASTER_IMAGE 只用於確認：

- 人物身份
- 臉部與五官特徵
- 髮型與髮色等人物外觀特徵
- 人物整體辨識度
- 身份一致性

### MASTER_IMAGE 不代表

不得因 MASTER_IMAGE 本身而強制複製：

- 原本的構圖
- 原本的姿勢
- 原本的服裝
- 原本的背景
- 原本的場景
- 原本的鏡位
- 原本的光影
- 原本的單張圖片畫面安排

實際生成風格與任務要求，仍以本 repository 的專案規則及目前 TASK 為準。

### 身份與風格分離

- `MASTER_IMAGE` 回答「她是誰」。
- `STYLE_MASTER.md` 回答「圖片應該怎麼呈現」。
- `DRAWING_INSTRUCTIONS.md` 回答「使用者長期要求怎麼畫」。
- `TASK_QUEUE.md` 回答「這次要做什麼」。
- `QUALITY_CONTROL.md` 回答「結果是否合格」。

如果 MASTER_IMAGE 的既有畫面風格與 `STYLE_MASTER.md` 或目前 TASK 發生衝突，**不得照抄 MASTER_IMAGE 的畫風，必須依專案風格規則執行。**

---

## 啟動後必做事項

1. 確認 repository：`rayclamp/lora_20`。
2. 確認目前 branch：`main`，除非專案狀態另有指定。
3. 讀取 `PROJECT_STATUS.md`。
4. 讀取 `WORKFLOW/MASTER_WORKFLOW.md`。
5. 讀取 `WORKFLOW/ACCOUNT_WORKFLOW.md`。
6. 讀取 `WORKFLOW/GENERATION_RULES.md`。
7. 讀取 `WORKFLOW/STYLE_MASTER.md`。
8. 讀取 `WORKFLOW/DRAWING_INSTRUCTIONS.md`。
9. 讀取 `WORKFLOW/IDENTITY_MASTER.md`。
10. 讀取 `WORKFLOW/QUALITY_CONTROL.md`。
11. 讀取 `TASKS/TASK_QUEUE.md`。
12. 讀取自己的 `ACCOUNTS/ACCOUNT_XX.md`。
13. 確認 MASTER_IMAGE 是否存在於 repository。
14. 如果使用者已上傳 MASTER_IMAGE，直接使用該圖片作為 20 歲依娜莉亞人物身份視覺基準。
15. 將 MASTER_IMAGE 視為唯一主要身份基準，不得自行建立另一個人物身份版本。
16. 找出目前可執行且尚未完成的任務。
17. 直接繼續工作，不重做 DONE 任務。

---

## 風格重置規則

每一個新聊天室都視為一次風格重置。

不得使用：

- 舊聊天室的無關畫風。
- 其他專案的畫風。
- 過去生成圖片中與本專案無關的風格。
- 帳號本身曾經產生的個人風格偏好。

目前專案的風格只能由專案文件與當前 TASK 決定。

如果歷史聊天內容與專案規則衝突，忽略歷史聊天內容。

---

## 身份基準

20 歲依娜莉亞的身份以：

`MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`

為最高優先的視覺身份參考。

MASTER_IMAGE 用於回答「她是誰」。

STYLE_MASTER.md 用於回答「圖片應該怎麼呈現」。

DRAWING_INSTRUCTIONS.md 用於回答「使用者長期要求怎麼畫」。

TASK_QUEUE.md 用於回答「這次要做什麼」。

QUALITY_CONTROL.md 用於回答「結果是否合格」。

---

## 不確定時的處理方式

如果缺少必要文件、任務、MASTER_IMAGE 或使用者操作：

- 不得自行捏造專案規則。
- 優先確認 GitHub 是否已有相關資料。
- 如果 GitHub 有 MASTER_IMAGE 但無法取得或解析圖片本體，應使用使用者在聊天室上傳的 MASTER_IMAGE。
- 只有真的需要使用者操作時才通知使用者。

如果只是一般生成差異，不應中斷工作要求使用者確認。

---

## 完成後

完成工作單元後：

- 更新自己的 ACCOUNT_XX.md。
- 更新 TASK_QUEUE.md 中任務狀態。
- 必要時更新 PROJECT_STATUS.md。
- 記錄 PASS / REVIEW / REJECT。
- 確保其他帳號可以從 GitHub 狀態直接接續。
