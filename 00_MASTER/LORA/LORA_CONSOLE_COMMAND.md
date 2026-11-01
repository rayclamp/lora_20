# `/LORA_CONSOLE` — LoRA 圖片提示詞製造者啟動指令

## 1. 指令用途與最高優先原則

本指令用於啟動一個全新的 LoRA 圖片提示詞設計工作階段。

`/LORA_CONSOLE` 是提示詞製造者啟動指令，不是一般的文字生圖提示詞。

本指令只負責提示詞設計、Session／Batch 建立、GitHub 紀錄、讀回驗證與提示詞鎖定，不負責實際生圖或圖片品管。

**啟動規則：使用者設定好 `IMAGE_COUNT` 並貼上本指令後，立即開始執行，不得再次詢問確認，不得要求使用者補充已經明確設定的資料。**

### 核心分工

- **使用者：** 自行指定本次需要製作的圖片提示詞數量。
- **ChatGPT 製造者：** 讀取正式規範、規劃整批內容、設計完整提示詞、建立紀錄、寫入 GitHub、讀回驗證並鎖定提示詞。
- **GitHub：** 保存正式規範、提示詞、Task 佇列與生產紀錄，是資料庫而非 runtime controller。
- **ChatGPT 生產者：** 在實際生產聊天室取得使用者提供的人物參考圖片後，讀取鎖定提示詞並執行生圖。
- **QA 系統：** 負責後續獨立圖片品管，目前維持 `PAUSED`；本指令不得啟動 QA。

不得因簡化流程而省略必要的規範讀取、提示詞保存、紀錄驗證或鎖定步驟。

---

## 2. 使用者設定

每次執行前，使用者只需要自行修改 `IMAGE_COUNT`。

`MODULE=LORA_IMAGE`

`IMAGE_COUNT=50`

`CHARACTER=INARIA`

`OUTPUT_TYPE=MIXED_PER_TASK`

以上 `MODULE`、預設 `CHARACTER` 與 Batch `OUTPUT_TYPE` 不需要使用者每次重設。`OUTPUT_TYPE=MIXED_PER_TASK` 僅為 LoRA Batch 正式格式宣告；每個 Task 的實際比例由 `TASK_OUTPUT_TYPE` 個別決定，不代表固定配額。

### 數量設定規則

1. `IMAGE_COUNT` 是本次唯一需要使用者自行設定的操作參數。
2. 不得因數量較多而擅自減少 Task、合併提示詞或只製作部分內容。
3. 若使用者沒有填入有效的正整數，或指定數量超出系統實際可執行的限制，才可停止並清楚回報具體原因；不得自行猜測數量。
4. 除非本次使用者明確指定合法的 `CHARACTER=NONE` 或正式規範另有要求，否則使用 `CHARACTER=INARIA` 作為預設角色設計方向；不得把 Inaria 身份強加於 `CHARACTER=NONE`。這不是要求使用者每次另填角色欄位。

### 直接啟動規則

設定有效後，貼上本指令即開始工作。

不得額外詢問：
- 是否開始。
- 是否確認數量。
- 是否建立 Session 或 Batch。
- 是否開始規劃提示詞。
- 是否先提供人物參考圖片。

本指令的製造者不需要人物參考圖片，人物參考圖片由生產者在實際生產聊天室使用。

---

## 3. 第一步：連線 GitHub 並讀取正式規範

Repository：

`rayclamp/lora_20`

正式分支：

`main`

在開始提示詞設計或寫入任何新資料之前，必須先確認 GitHub 連線正常，並讀取以下正式文件。

### 核心規範

- `START_HERE.md`
- `00_MASTER/SYSTEM_ARCHITECTURE.md`
- `00_MASTER/MODULE_REGISTRY.md`
- `00_MASTER/CORE_RULES.md`
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/GENERATION_RULES.md`
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
- `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`
- `00_MASTER/CANONICAL_PATH_REGISTRY.md`

### LoRA 圖片模組規範

- `MODULES/LORA_IMAGE/MODULE.md`
- `MODULES/LORA_IMAGE/REFERENCE_POLICY.md`
- `MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md`
- `MODULES/LORA_IMAGE/DATASET_DIVERSITY.md`
- `MODULES/LORA_IMAGE/CANDIDATE_DESIGN_RULES.md`

### 生產交接邊界（僅供核對，不得執行）

- `00_MASTER/LORA/LORA_PRODUCE_COMMAND.md`

讀取生產者指令只為確認正式欄位、路徑、Prompt Lock 與後續交接方式一致；不得因此啟動 `/LORA_PRODUCE`、要求現在上傳參考圖，或把生產階段任務移入 Console。

### 角色規範

當 `CHARACTER=INARIA` 時，另行讀取：

- `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`

如果正式文件引用其他必要的**現行**依賴，也必須讀取；`ARCHIVE/LEGACY_LORA_PRODUCTION/` 是歷史保存資料，不能當作現行規範，且不得將 Wallpaper／Festival 專屬規範混入 LoRA。

### 讀取失敗處理

若 GitHub 無法連線、必要文件無法讀取，或正式規範存在會影響本次執行的重大衝突：

1. 停止本次製造流程。
2. 回報實際失敗的文件或操作。
3. 不得猜測缺失的規範。
4. 不得假裝已完成初始化、提示詞寫入或鎖定。
5. 不得因初始化失敗而改用一般文字生圖流程。

GitHub 是規範與紀錄資料庫，不得將其描述成自動控制圖片生成工具的 runtime controller。

---

## 4. 第二步：建立新的 Session 與 Batch

每次啟動都必須建立全新的 Session 與 Batch，不得覆蓋既有資料。

### Session／Batch ID 強制命名規範

每次建立新的 Session 與 Batch 時，必須嚴格遵守以下命名格式，不得使用其他格式，不得自行變更、縮短或省略格式。

- `SESSION_ID`：`SE-YYYYMMDD-HHMMSS`
- `BATCH_ID`：`BA-YYYYMMDD-HHMMSS`

命名規則：

1. `YYYYMMDD` 代表建立日期，格式為四位數年份、兩位數月份及兩位數日期。
2. `HHMMSS` 代表建立時間，採用 24 小時制，精確至秒。
3. 日期與時間一律使用台灣時間（UTC+8）。
4. Session 與 Batch 必須分別依照各自實際建立的日期與時間產生 ID，不得以其他日期、預估時間或固定範例代替。
5. 禁止使用 `SESSION_...`、`BATCH_001` 或其他不符合上述格式的命名方式。
6. 本規範適用於 `LORA_IMAGE` 模組的所有新建 Session 與 Batch。
7. 此規範只適用於新建立的 ID；不得為了符合新格式而擅自重新命名既有 Session、Batch 或移動既有生產記錄。
8. 實際建立前確認目標路徑未被既有 Session／Batch 使用。若秒級時間戳造成 ID／路徑碰撞，不得覆寫或自行加尾碼；依當下實際台灣時間重新產生符合格式的唯一 ID，仍無法確認唯一性時停止並回報。
9. 同一次工作遇到中斷、讀回失敗或需恢復時，不得把「接續未完成工作」誤當作全新啟動而額外建立替代 Session／Batch；僅在原 ID、授權及既有 GitHub 紀錄可以確認時依原工作恢復，不能推測缺失狀態。

標準路徑：

`PRODUCTION_RECORDS/LORA_IMAGE/<SESSION_ID>/<BATCH_ID>/`

實際路徑必須以 `00_MASTER/CANONICAL_PATH_REGISTRY.md` 為準。

### 必須建立的標準文件

- `SESSION_CONTRACT.md`
- `BATCH_RECORD.md`
- `TASK_QUEUE.md`
- `PROMPT_SET.md`
- `EXECUTION_LOG.md`

### 個別提示詞的正式儲存路徑

每個 Task 的完整提示詞必須獨立保存：

- `PROMPTS/TASK_001.md`
- `PROMPTS/TASK_002.md`
- 依序延伸至本次指定數量的最後一個 Task。

例如：

- `IMAGE_COUNT=20`：建立 20 個 Task 和 20 份獨立提示詞。
- `IMAGE_COUNT=50`：建立 50 個 Task 和 50 份獨立提示詞。
- `IMAGE_COUNT=100`：建立 100 個 Task 和 100 份獨立提示詞。

`PROMPT_SET.md` 只用於提示詞索引、集合狀態及必要的 manifest 資料，不得將所有完整提示詞正文集中塞入其中。

`SESSION_CONTRACT.md` 應保留當次授權的 `MODULE`、`CHARACTER`、`IMAGE_COUNT`、`OUTPUT_TYPE=MIXED_PER_TASK` 等適用契約資訊；`BATCH_RECORD.md` 與 `TASK_QUEUE.md` 依正式 Schema 建立設計階段的實際初始狀態。尚未生圖，不得虛構生成呼叫、圖片接收、Task SUCCESS、已完成數量或 QA 結果。狀態欄位及計數器以目前有效 Schema 為準，不自行創造列舉值。

不得自行更改正式目錄結構，不得將個別提示詞存放到錯誤路徑。

---

## 5. 第三步：規劃整批 LoRA 資料集

在撰寫個別提示詞之前，必須先完成整批內容的多樣性規劃。

規劃數量必須完全等於使用者指定的 `IMAGE_COUNT`。

規劃目標是建立適合後續 LoRA 訓練的多樣化候選圖片，避免產生大量構圖、姿勢或服裝高度相似的圖片。

### 必須考慮的多樣性維度

1. **人物姿勢：** 站立、坐姿、行走、轉身、自然動態及其他合理姿勢。
2. **身體方向：** 正面、四分之三側面、側面、背面及其他合理方向。
3. **手部動作：** 自然垂放、手持物品、整理頭髮、互動姿勢及其他合理動作。
4. **服裝類型：** 日常、正式、休閒、季節性服裝及其他適合資料集的服裝。
5. **髮型：** 直髮、自然波浪、不同分線、編髮及其他合理變化。
6. **配件：** 依照服裝與場景適當變化，不要求每張都佩戴配件。
7. **鞋款：** 依服裝和場景選擇合理鞋款，避免固定重複同一類型。
8. **景別與構圖：** 全身、中景、半身、近景及其他合適構圖。
9. **拍攝角度：** 眼平視角、高低角度、側向視角及其他自然視角。
10. **背景與場景：** 室內、戶外、生活空間、城市環境及其他合理場景。
11. **光線：** 自然光、柔和室內光、側光及其他符合本次指定畫風與場景的光線；不得預設全部都是寫實攝影。
12. **輸出格式：** 每個 Task 分別獨立隨機選擇 `PHONE_9_16` 或 `DESKTOP_16_9`，不設固定張數比例；依選定格式設計真正適合的構圖。

風格由本次任務與現行 LoRA 設計規範決定，不得擅自匯入其他模組的固定動漫、寫實攝影或節慶風格。

以上維度應依照整批數量合理分配，不要求每個維度都以相同比例出現。

### 多樣性限制

- 不得讓所有圖片都是正面、全身、站立的相同構圖。
- 不得只透過改變服裝顏色、背景顏色或少量配件製造表面差異。
- 不得讓整批圖片持續重複相同姿勢、相同鏡位與相同服裝輪廓。
- 可以使用背面、側面、坐姿與動態姿勢。
- 不得加入貓、狗或其他寵物。
- 不得混入 Universal Wallpaper 或 Festival Wallpaper 專用規則。
- 不得將舊版固定年齡 20 歲的 Inaria 參考圖當成現行人物身份的唯一標準。
- 不得以犧牲人體結構、手部合理性或人物一致性為代價追求多樣性。

數量較少時，在有限數量內盡可能提高變化；數量較多時，擴大題材、構圖、姿勢與場景的組合，不得單純複製既有設計。

---

## 6. 第四步：撰寫每個 Task 的完整提示詞

依照已完成的整批規劃，逐一撰寫完整且可獨立執行的生圖提示詞。

每個 Task 都必須保存至對應的 `PROMPTS/TASK_###.md`。

### 每份獨立提示詞檔案的必要結構

每個正式鎖定的 `PROMPTS/<TASK_ID>.md` 檔案必須有符合當次 Schema 的中繼資料，至少明確包含：`TASK_ID`、`PROMPT_ID`、`PROMPT_VERSION`、`PROMPT_STATUS=LOCKED`、`TASK_OUTPUT_TYPE`，以及該 Task 完整可獨立執行的提示詞正文。

將**完整且唯一**的生圖提示詞正文放在以下兩個明確標記之間，標記以外放中繼資料，不得混入第二份提示詞正文：

```text
BEGIN_LOCKED_PROMPT_TEXT
（此處是該 Task 的完整生圖提示詞正文）
END_LOCKED_PROMPT_TEXT
```

以上是檔案結構示意，不是實際 Task 提示詞；每個 Task 必須寫入自己的完整正文。`TASK_ID`、`PROMPT_ID`、版本、格式、檔案路徑與索引映射必須相互一致，且正式鎖定後不得無聲修改提示詞文字或改指向其他 Task。尚未完成驗證的檔案／集合不得對外宣稱已鎖定。

### 提示詞設計原則

1. 每個 Task 必須明確描述主體、姿勢、身體方向、服裝、構圖、場景、光線及必要的畫面品質要求。
2. 各 Task 必須具有實質差異，不得只修改少量形容詞。
3. 每份提示詞都必須完整到生產者可以直接使用，不得依賴其他 Task 的正文才能理解。
4. 必須遵守 GitHub 中的核心繪圖規範、人體結構規範及影像安全規範。
5. 必須保留生產階段使用人物參考圖片的規則。
6. 不得假裝製造者已經看過參考圖片。
7. 不得要求使用者在本聊天室上傳參考圖片。
8. 不得把未曾讀取的圖片內容寫成已知事實。
9. 不得將人物參考圖片錯誤地當成必須複製服裝、姿勢、背景或配件的模板。
10. 不得加入與正式規範衝突的自行創造規則。

### 人物身份規則

當 `CHARACTER=INARIA` 時，依照核心角色資料提供角色設計方向。

但是，實際生產階段由使用者提供的人物參考圖片，才是生產者應使用的當次視覺身份依據。GitHub 的角色文字資料不得取代當次提供的參考圖片。

製造者只能為生產階段的參考圖片預留適當的身份一致性要求，不得宣稱自己已經確認參考圖片中的實際外貌。每個 Task 的設計應明確要求保留當次生產參考圖**實際可見且有證據支持**的臉部、年齡外觀、自然體型及肩臂、軀幹、腰臀、腿部等相對輪廓，不得以 Inaria 文字資料取代圖片本人，也不得捏造看不到的身材數值；具體視覺辨識由生產階段參考圖提供，真正圖片驗收歸獨立 QA。

當正式規範允許 `CHARACTER=NONE` 時，不得擅自加入 Inaria 專屬的外貌特徵。

### 每個 Task 的輸出格式

每個 Task 都必須**獨立隨機選擇**以下其中一種格式；不得由上一張格式直接推定下一張、強制固定配額或刻意湊成 50/50：

- `PHONE_9_16`
- `DESKTOP_16_9`

將選擇結果記錄為 `TASK_OUTPUT_TYPE`，並在 `TASK_QUEUE.md`、每個 Task 的提示詞檔案中繼資料與 `PROMPT_SET.md` 索引中保持完全一致；完整提示詞明確描述相符的畫面比例、主體位置及構圖。不得宣稱單靠提示詞文字就保證生成介面的實際像素尺寸。

不得額外引入 `ASPECT_RATIO` 或 `ORIENTATION` 作為另一組控制欄位。

---

## 7. 第五步：建立 Task 佇列與提示詞索引

依照使用者指定的 `IMAGE_COUNT` 建立完整 Task 佇列。

每個 Task 必須具有：

- 唯一的 Task ID。
- 明確的執行順序。
- 對應的獨立提示詞檔案路徑。
- 對應的 `TASK_OUTPUT_TYPE`。
- 一致且可追溯的 `PROMPT_ID`、`PROMPT_VERSION`、`PROMPT_STATUS` 與 `PROMPTS/<TASK_ID>.md` 映射。
- 符合正式 Schema 的必要狀態欄位與尚未開始生成的真實初始狀態。

`TASK_QUEUE.md` 必須包含全部指定 Task。

`PROMPT_SET.md` 必須列出所有提示詞檔案及其狀態，但不得取代各 Task 的獨立提示詞正文。

必須確認：

- Task 數量等於 `IMAGE_COUNT`。
- Task ID 沒有重複。
- 每個 Task 都指向正確的提示詞檔案。
- 沒有遺漏任何指定 Task。
- 沒有建立超出指定數量的 Task。
- 每一個 Task 在佇列、提示詞檔案中繼資料與 `PROMPT_SET.md` 的 `TASK_OUTPUT_TYPE`、`PROMPT_ID`、`PROMPT_VERSION` 和實際檔案路徑完全吻合。
- 每份正式提示詞只有一對 `BEGIN_LOCKED_PROMPT_TEXT`／`END_LOCKED_PROMPT_TEXT`，兩者之間的正文完整、非空白且可獨立理解。

---

## 8. 第六步：寫入並驗證 GitHub

所有提示詞與紀錄都必須實際寫入 GitHub。

寫入完成後，必須重新讀取相關文件，確認資料已成功保存。

### 必須驗證的項目

1. Session 與 Batch 路徑正確。
2. 五份標準 Batch 文件均已建立。
3. Task 數量與 `IMAGE_COUNT` 完全一致。
4. 每個 Task 都有對應的獨立提示詞檔案。
5. 所有提示詞檔案都存在且有實際正文。
6. `TASK_QUEUE.md` 包含全部指定 Task。
7. `PROMPT_SET.md` 索引完整，且沒有集中放入全部提示詞正文。
8. 每個 Task 都有合法的 `TASK_OUTPUT_TYPE`。
9. 必要紀錄欄位符合正式 Schema。
10. 實際讀回的內容足以確認提示詞已成功保存，且每份提示詞正文與本次準備寫入的完整內容一致。
11. 每個 Task 的 `TASK_ID`、`PROMPT_ID`、`PROMPT_VERSION`、`PROMPT_STATUS`、正文起訖標記與 `TASK_OUTPUT_TYPE` 均符合現行 Schema。
12. Batch `OUTPUT_TYPE=MIXED_PER_TASK`，而所有 Task 的輸出格式在 Task Queue、提示詞檔案與 manifest 三處吻合。
13. 尚未生圖的 Task 不得記成已生產成功；未完成鎖定的 Prompt Set 不得記成 `LOCKED`。

不得只因 GitHub 回傳寫入成功訊息，就忽略必要的讀回驗證。

若寫入或讀回驗證失敗，必須依照正式規範處理，並如實回報；不得將未驗證成功的 Batch 宣稱為已完成。保存已經**實際寫入並讀回確認**的進度及失敗位置，不得因部分失敗重建、覆蓋或重複生成同一次工作中的 Session、Batch 或 Task，也不得憑記憶宣稱成功。僅在權限與原紀錄均可核實時，依已授權的同一工作續作未完成項目；無法安全續作時停止並回報剩餘工作。

---

## 9. 第七步：鎖定提示詞集合

只有在全部指定數量的提示詞、Task 佇列、索引及必要紀錄均成功寫入並完成讀回驗證，且每份 Prompt 的身份、版本、格式、檔案映射與完整正文標記均核對無誤後，才可以同步設定：

`PROMPT_SET_STATUS=LOCKED`

`PROMPT_SET_LOCKED=YES`

正式鎖定時，個別 Prompt 檔案的 `PROMPT_STATUS=LOCKED`、Prompt Set 的上述兩個欄位及必要索引資料必須一致。若任何項目未達成，不得留下 `PROMPT_SET_STATUS=LOCKED` 與 `PROMPT_SET_LOCKED=NO` 的矛盾紀錄，也不得用敘述代替正式寫入。鎖定寫入完成後，再次從 GitHub 讀回確認，並依正式 Schema 將 `DESIGN_COMPLETE`、`PROMPT_SET_LOCKED` 等實際發生的設計事件記錄到 `EXECUTION_LOG.md`，記錄結果同樣須讀回驗證。

鎖定後：

- 不得在生產階段自行改寫提示詞。
- 不得因預期圖片效果而任意替換提示詞。
- 不得將未完成驗證的提示詞集合標記為已鎖定。
- 不得擅自啟動生產者。
- 不得呼叫圖片生成工具。
- 不得執行圖片 QA 或修圖。

若本次未能完成全部必要工作，必須如實記錄目前狀態，不得虛報鎖定成功。

---

## 10. 執行範圍與禁止事項

本指令只負責：

1. 讀取正式規範。
2. 建立新的 Session 與 Batch。
3. 規劃整批資料集。
4. 撰寫使用者指定數量的獨立提示詞。
5. 建立 Task 佇列與提示詞索引。
6. 將資料寫入 GitHub。
7. 重新讀取並驗證資料。
8. 在符合條件時鎖定提示詞集合。
9. 記錄實際執行結果。

本指令不得：

- 呼叫圖片生成工具。
- 要求使用者先提供人物參考圖片。
- 進行圖片品質判定。
- 啟動目前維持 `PAUSED` 的 QA、修圖或重生。
- 自動啟動 `/LORA_PRODUCE`。
- 更改使用者指定的 `IMAGE_COUNT`。
- 覆蓋既有 Session 或 Batch。
- 將所有完整提示詞塞入 `PROMPT_SET.md`。
- 使用未經讀取驗證的規範作為已確認的事實。
- 虛報 GitHub 寫入、讀回驗證或鎖定成功。

---

## 11. 完成後回報

完成後，以簡潔報告回報：

- `MODULE`
- `SESSION_ID`
- `BATCH_ID`
- 使用者指定的 `IMAGE_COUNT`
- 實際建立的 Task 數量
- 實際建立的獨立提示詞檔案數量
- `PROMPT_SET_STATUS`
- `PROMPT_SET_LOCKED`
- Batch `OUTPUT_TYPE=MIXED_PER_TASK` 與 Task 格式一致性驗證結果
- Batch 根目錄路徑
- GitHub 寫入與讀回驗證結果
- 尚未完成的工作或實際錯誤

若所有工作均已成功完成，明確回報提示詞集合已鎖定。

若任何必要工作未完成，必須清楚說明原因與實際狀態。

完成回報後立即停止，不得自行開始生圖。