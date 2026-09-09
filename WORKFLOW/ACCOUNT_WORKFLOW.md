# ACCOUNT_WORKFLOW.md

# 多帳號工作規則

## 1. 帳號角色

每一個 ChatGPT 帳號都是同一個 LoRA 專案的「生產工作站」。

不同帳號不是不同角色版本，也不是不同畫風作者。

所有帳號共同製作同一個 20 歲依娜莉亞 LoRA 資料集。

---

## 2. 每個帳號只負責自己的 ACCOUNT 檔案

每個帳號對應一個：

`ACCOUNTS/ACCOUNT_XX.md`

該檔案記錄：

- 本帳號目前工作批次。
- 已完成數量。
- PASS 數量。
- REVIEW 數量。
- REJECT 數量。
- 已使用的場景／服裝／髮型／姿勢方向。
- 下一個工作項目。

不得把個人審美偏好寫入 ACCOUNT 檔案。

---

## 3. 任務來源

帳號必須從：

`TASKS/TASK_QUEUE.md`

取得工作。

優先處理已分配給自己的任務。

如果沒有指定任務，才可以取得未分配任務。

不得自行重做其他帳號已完成的任務，除非 TASK 明確要求補圖。

---

## 4. 任務分配原則

為避免資料集過度重複，不以「每個帳號生成完全相同的圖片」為目標。

應以「每個帳號負責不同的資料維度」分工。

例如：

- ACCOUNT_01：室內生活場景。
- ACCOUNT_02：城市場景。
- ACCOUNT_03：海邊／水域場景。
- ACCOUNT_04：自然景觀。
- ACCOUNT_05：節慶／特殊場景。

實際分配以 TASK_QUEUE.md 為準。

---

## 5. 資料多樣性規則

新任務應盡可能增加尚未充分覆蓋的資訊：

- 身體角度。
- 姿勢。
- 手部動作。
- 髮型。
- 服裝。
- 配件。
- 場景。
- 光線。
- 拍攝距離。
- 視角。

不得為了湊數量而大量生成幾乎相同的圖片。

---

## 6. 生成前流程

每次開始工作前依序讀取：

1. START_HERE.md
2. PROJECT_STATUS.md
3. WORKFLOW/MASTER_WORKFLOW.md
4. WORKFLOW/ACCOUNT_WORKFLOW.md
5. WORKFLOW/GENERATION_RULES.md
6. WORKFLOW/STYLE_MASTER.md
7. WORKFLOW/DRAWING_INSTRUCTIONS.md
8. WORKFLOW/IDENTITY_MASTER.md
9. WORKFLOW/QUALITY_CONTROL.md
10. TASKS/TASK_QUEUE.md
11. 自己的 ACCOUNTS/ACCOUNT_XX.md

若某文件尚未建立，不得自行假設其內容；繼續使用已存在的文件並在狀態中標記缺失文件。

---

## 7. 生成規則

生成時：

- 以 MASTER_IMAGE 維持人物身份。
- 以 STYLE_MASTER 維持統一視覺風格。
- 以 DRAWING_INSTRUCTIONS 維持使用者長期繪圖規則。
- 以當前 TASK 決定本次具體場景與構圖。
- 不使用歷史聊天室中的無關風格作為生成依據。

若不同來源發生衝突，依專案規則中的優先級處理，不得自行創造新的長期風格。

---

## 8. 圖片驗收

每張生成圖片完成後，必須依照：

`WORKFLOW/QUALITY_CONTROL.md`

進行 PASS / REVIEW / REJECT 判斷。

不能因為圖片漂亮就忽略手腳、身份、人體或任務錯誤。

---

## 9. 失敗處理

### REJECT

- 不進入正式 LoRA 資料集。
- 記錄主要失敗原因。
- 如果任務要求的數量尚未完成，可以重新生成替代圖。

### REVIEW

- 不直接視為合格。
- 保留圖片。
- 記錄需要人工確認的問題。

### PASS

- 視為可以進入資料集。
- 記錄該圖片的任務與特徵。

---

## 10. 帳號狀態更新

完成一個工作單元後更新自己的 ACCOUNT_XX.md：

- 完成項目。
- PASS / REVIEW / REJECT 數量。
- 目前使用過的場景與動作。
- 是否需要重新生成。
- 下一步。

不得修改其他 ACCOUNT 的進度。

---

## 11. 任務交接

如果本帳號完成目前任務：

1. 將任務標記 DONE。
2. 更新自己的 ACCOUNT_XX.md。
3. 若 TASK_QUEUE 有下一個未分配任務，可以接續工作。
4. 如果沒有下一個任務，等待新的任務。

不得重新處理 DONE 任務，除非它被標記為 NEED_REWORK。

---

## 12. 最重要原則

所有帳號：

> 同一個人物、同一套身份標準、同一套風格標準、同一套品質標準；只負責不同的資料生產任務。

帳號之間可以產生自然的生成差異，但不得產生不同的「依娜莉亞版本」。
