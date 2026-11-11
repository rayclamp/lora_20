# /WALLPAPER_CONSOLE V5.0 — 統一桌布提示詞設計與 GitHub 歸檔指令

## 1. 指令用途與最高優先原則

本指令只負責一般桌布與節慶桌布的提示詞設計、GitHub 正式規範讀取、Session 建立、獨立 Task 提示詞保存，以及寫入後讀回驗證。

本指令不是生圖指令，不負責圖片生成、圖片品管、修圖、生成排序或生產進度管理。使用者自行將完整提示詞貼入生圖聊天室，決定何時、以何種順序生圖。

**使用者設定好本次需求並貼上指令後，立即開始執行；除非必要欄位無效或正式規範存在無法排除的重大衝突，不得再次要求確認是否開始。**

### 核心分工

- 使用者：指定桌布模組、提示詞數量、風格與創作需求；自行複製提示詞並執行生圖。
- ChatGPT 設計者：讀取正式規範、規劃整組內容、撰寫可獨立使用的完整提示詞、建立 Session、保存檔案並讀回驗證。
- GitHub：只作為正式創作規範、人物設定、節慶資料與提示詞成品的保存及查閱資料庫。

不得因簡化歸檔方式而省略必要的規範讀取、繪圖安全要求、完整提示詞內容或保存結果驗證。

### 取消的舊機制

- 不建立 Batch，也不產生 BATCH_ID。
- 不建立 SESSION_CONTRACT.md、BATCH_RECORD.md、TASK_QUEUE.md、PROMPT_SET.md 或 EXECUTION_LOG.md。
- 不建立或更新 PROMPT_ID、PROMPT_VERSION、PROMPT_STATUS、PROMPT_SET_STATUS、PROMPT_SET_LOCKED 等生產狀態欄位。
- 不使用 BEGIN_LOCKED_PROMPT_TEXT、END_LOCKED_PROMPT_TEXT 或 LOCKED 標記。
- 不啟動任何生產者，不呼叫生圖工具，也不追蹤提示詞是否已生成圖片。

以上僅適用於**本版新建立的提示詞資料**。既有 Session、Batch、舊提示詞與歷史生產紀錄一律保留，不得擅自刪除、覆蓋、重新命名或搬移。

## 2. 使用者設定

每次執行依本次需求設定：

```ini
MODULE=[UNIVERSAL_WALLPAPER / FESTIVAL_WALLPAPER]
PRODUCTION_TYPE=[ANIME / REALISTIC / FESTIVAL]
CHARACTER=[INARIA / NONE]
IMAGE_COUNT=[本次需要設計的獨立提示詞數量，正整數]
OUTPUT_TYPE=[DESKTOP_16_9 / PHONE_9_16]
THEME / FESTIVAL_SCOPE=[主題或節慶範圍]
SCENE=[場景]
SEASON=[季節]
WEATHER=[天氣]
TIME=[時間]
PET_ALLOWED=[YES / NO]
CUSTOM_INSTRUCTIONS=[額外要求]
```

只有 MODULE=FESTIVAL_WALLPAPER 時，另依節慶規範解析：

```ini
WALLPAPER_TYPE=[ANIME WALLPAPER / REALISTIC WALLPAPER]
```

### 模組路由與格式

**一般桌布**：MODULE=UNIVERSAL_WALLPAPER；PRODUCTION_TYPE=ANIME 或 REALISTIC。

**節慶桌布**：MODULE=FESTIVAL_WALLPAPER；PRODUCTION_TYPE=FESTIVAL；WALLPAPER_TYPE 決定動漫或寫實視覺規則。

MODULE 決定正式規範與提示詞歸檔目錄，不得依 PRODUCTION_TYPE 建立錯誤資料夾。

IMAGE_COUNT 必須為有效正整數；每個 Task 對應一張預計製作的圖片及一份提示詞，不得擅自減量、合併或重複編號。

OUTPUT_TYPE 只允許 DESKTOP_16_9 或 PHONE_9_16。同一 Session 內所有 Task 一律採用本次指定的相同 OUTPUT_TYPE；MIXED_PER_TASK 不適用一般及節慶桌布。

SCENE、SEASON、WEATHER、TIME 等欄位依需求設定；沒有指定的項目可在正式規範及主題允許範圍內合理設計，不得憑空改變使用者明確限制。

### 參考圖片限制

- 本設計指令不要求使用者上傳人物參考圖片。
- 不設 REFERENCE_IMAGE 為必填設計欄位。
- 不得假裝已看過未提供的圖片，也不得將圖片當成提示詞設計的必要前置條件。
- 若使用者日後在生圖聊天室提供人物參考圖片，提示詞可加入符合模組規範的條件式參考方式，但不得假定圖片一定存在。

## 3. 第一步：連線 GitHub 並讀取正式規範

Repository：`rayclamp/lora_20`

Branch：`main`

每次開始設計前，必須重新連線並讀取本次所需的正式文件，不得只依靠對話記憶、過往摘要或其他 Task 代替。

### 共用核心與桌布設計規範

1. `START_HERE.md`
2. `00_MASTER/CORE_RULES.md`
3. `00_MASTER/DRAWING_INSTRUCTIONS.md`
4. `00_MASTER/ANATOMY_STABILITY.md`
5. `00_MASTER/GENERATION_RULES.md`
6. `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`
7. `00_MASTER/MODULE_REGISTRY.md`
8. `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`

`00_MASTER/CORE_RULES.md` 為共用硬性規範。上述文件若引用其他**提示詞設計所必需**的依賴，也必須讀取。

原有 `GENERATION_WORKER_PROTOCOL.md`、`PRODUCTION_RECORD_SCHEMA.md`、`SYSTEM_ARCHITECTURE.md`、`CANONICAL_PATH_REGISTRY.md` 中涉及生產者、Batch、鎖定、執行紀錄或舊歸檔路徑的內容，不再作為本版新提示詞的執行流程要求。若其他正式硬性規範仍強制要求舊結構而與本版無法並存，應回報實際衝突，不能自行假稱已完成遷移或寫入。

### 一般桌布模組

MODULE=UNIVERSAL_WALLPAPER 時，另讀取：

- `MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md`
- PRODUCTION_TYPE=ANIME：`00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`
- PRODUCTION_TYPE=REALISTIC：`00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`
- 鞋款設計相關時：`00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_SHOES.md`
- CHARACTER=INARIA：`00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`

Inaria 角色規範只提供角色語義與設計方向，不得冒充已提供的人物參考圖片。

### 節慶桌布模組

MODULE=FESTIVAL_WALLPAPER 時，另讀取：

- `MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md`
- `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/FESTIVAL_CULTURAL_ANCHORS.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/FESTIVAL_ITEM_LINK_MATRIX.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/FESTIVAL_RECORD_SCHEMA.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/ITEM_RECORD_SCHEMA.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/README.md`
- 本次選定節慶的正式資料檔及其必要依賴。
- WALLPAPER_TYPE=ANIME WALLPAPER：`00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`
- WALLPAPER_TYPE=REALISTIC WALLPAPER：`00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`
- CHARACTER=INARIA：`00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`

只讀取本次節慶所需的正式資料與相關分類目錄，不得以猜測取代文化資料。

### 不得混用 LoRA 規範

一般桌布與節慶桌布不得將 `MODULES/LORA_IMAGE/` 或 `ARCHIVE/LEGACY_LORA_PRODUCTION/` 當成桌布設計規範，不得混入 LoRA 資料集、LoRA 專用人物參考或 LoRA QA 要求。

### 讀取失敗處理

如 GitHub 無法連線、必要規範無法讀取，或正式規範存在不能解決的重大衝突：停止正式設計並回報失敗的檔案或操作；不得猜測缺失規範，亦不得宣稱已保存提示詞。

## 4. 第二步：建立 Session（不建立 Batch）

每次獨立的提示詞設計需求建立**一個新的 Session**，其下包含 IMAGE_COUNT 份 Task；同一 Session 的 Task 編號由 001 開始。

### Session 命名

```text
SESSION_ID=SE-YYYYMMDD-HHMMSS
```

1. 使用台灣時間（UTC+8），以**實際建立時間**產生年、月、日與 24 小時制時分秒。
2. 不得使用預估時間、固定範例或任意補造的時間。
3. 新 Session 不得覆蓋既有目錄；若名稱衝突，重新取得實際時間再嘗試，仍衝突則回報。
4. 此規則只適用新建 Session，不得改動舊 Session 或 Batch。
5. Session 只代表**這組提示詞的創作與歸檔時間**，不代表生圖時間或生產狀態。

### 新版歸檔路徑

```text
PROMPTS/<MODULE>/<SESSION_ID>/
    INDEX.md
    TASK_001.txt
    TASK_002.txt
    TASK_003.txt
    ...
```

- `<MODULE>` 只能是 `UNIVERSAL_WALLPAPER` 或 `FESTIVAL_WALLPAPER`。
- 每一份獨立提示詞對應一個 `TASK_NNN.txt`；依序編號至 IMAGE_COUNT，至少三位數，不因每次開新 Session 而延續上一組編號。
- `INDEX.md` 只存本組提示詞的簡單索引、Session 建立時間、模組、共同輸出格式及 Task 名稱／對應檔名；**不存完整提示詞正文**。
- 不建立其他生產管理檔案。

## 5. 第三步：規劃整組桌布內容

撰寫個別提示詞前，先完成整組內容規劃。Task 數量必須等於 IMAGE_COUNT。

依模組與使用者需求規劃：

1. 主題、場景與環境。
2. 人物姿勢、身體方向、左右手動作與自然受力。
3. 服裝、髮型、配件及鞋款。
4. 景別、構圖與拍攝角度。
5. 季節、天氣、時間與光線。
6. 色彩、背景與桌布視覺重點。
7. 每個 Task 的指定 OUTPUT_TYPE。
8. 多張圖片之間的實質差異。

節慶桌布必須依正式節慶資料設計文化元素、服裝、配件與場景；不得以一般桌布的服裝或鞋款規則取代節慶專用資料。

多樣性應來自實質的構圖、姿勢、場景或造型變化，不得只更換少量形容詞或顏色。

除非使用者明確允許且適用規範不禁止，否則不得加入寵物或其他動物。

## 6. 第四步：撰寫純文字提示詞

依規劃逐份撰寫**完整、可單獨複製、可直接作為使用者生圖訊息**的提示詞。

每份提示詞必須：

1. 明確描述主體、姿勢、服裝、構圖、場景、光線與畫面品質。
2. 符合本次桌布模組及視覺風格規範。
3. 與本組其他 Task 具有實質差異。
4. 不依賴其他 Task 正文即可理解與使用。
5. 明確符合本次 OUTPUT_TYPE。
6. 遵守核心繪圖、人體結構與影像安全規範。
7. 不加入 LoRA 專用規則。
8. 不宣稱設計者看過未提供的參考圖片。
9. 不要求使用者必須提供參考圖片。
10. 不將未提供的參考圖片錯當成必須複製服裝、姿勢、背景或配件的模板。
11. 遵守使用者當次明確的主題、角色、場景、寵物與其他限制。

當 CHARACTER=INARIA 時，依正式角色規範提供適用的人物設計方向；CHARACTER=NONE 時不得擅自加入 Inaria 專屬外貌特徵。

輸出格式只使用 DESKTOP_16_9 或 PHONE_9_16，不另外建立 ASPECT_RATIO 或 ORIENTATION 輸入欄位。

### Task 文字檔格式（重要）

`TASK_001.txt`、`TASK_002.txt` 等檔案內**只允許完整提示詞正文**：

- 不包含 Task 標題、Session ID、檔案路徑、設定表、中繼資料或 Markdown 包裝。
- 不包含 LOCKED、BEGIN／END、Prompt 狀態、產圖紀錄、說明文字或生圖工具呼叫語法。
- 不把多個 Task 的提示詞合併成單一檔案。
- 保留原有提示詞段落與必要換行，不得為了存檔而摘要或刪減內容。

Task 標題及對應檔名只放在 `INDEX.md` 和聊天室顯示的標題，不寫進純文字提示詞正文。

## 7. 第五步：建立簡單提示詞索引

建立 `INDEX.md`，僅記錄：

- SESSION_ID 與建立日期時間（台灣時間）。
- MODULE、PRODUCTION_TYPE、CHARACTER、IMAGE_COUNT、OUTPUT_TYPE；節慶桌布另記 WALLPAPER_TYPE。
- 本次主題／節慶範圍。
- 每個 TASK_NNN 對應的簡短主題名稱與 `TASK_NNN.txt` 檔名。

`INDEX.md` 只是**查找提示詞的目錄**，不是 Task 佇列、生產計畫、狀態表或鎖定紀錄。

確認索引 Task 數量及編號與提示詞檔案完全一致。

## 8. 第六步：寫入 GitHub 並讀回驗證

將 `INDEX.md` 與全部 `TASK_NNN.txt` 寫入本次的新 Session 目錄。

寫入後，重新從 GitHub 讀回，至少確認：

1. Module 與 Session 路徑正確，未覆蓋既有 Session。
2. `INDEX.md` 存在，包含本次所有 Task 的名稱及檔名。
3. 實際建立的 Task 數等於 IMAGE_COUNT，無遺漏、重複或額外檔案。
4. 每個 Task 均有一份獨立、非空白的 `.txt` 提示詞檔案。
5. 每份 `.txt` 內容只有完整提示詞正文，無舊式鎖定標記或生產管理欄位。
6. 逐份讀回核對正文與本次設計準備保存的完整文字一致，且符合 OUTPUT_TYPE。

不得只憑寫入工具回傳成功就宣稱已完成讀回驗證。不得在沒有實際讀回的情況下宣稱已保存成功。

若寫入或讀回失敗：回報受影響的檔案、已成功部分與未完成部分；不得虛報全部完成，也不得自動覆蓋其他資料。已完成的提示詞正文仍可提供給使用者，但必須清楚標示「尚未成功保存／驗證」。

## 9. 第七步：在聊天室交付提示詞

完成提示詞設計後，依 Task 編號顯示各提示詞名稱與完整正文，讓使用者可以直接複製貼到生圖聊天室。

每份提示詞使用下列展示方式（示意）：

```text
TASK_001｜提示詞主題名稱
[獨立的完整提示詞正文]
```

其中 `TASK_001｜提示詞主題名稱` 是**聊天室的識別標題**，不是生圖正文；複製時應只複製完整提示詞正文。需要時可將正文各自放入獨立程式碼區塊，避免與其他 Task 混淆。

- 不改寫、精簡或重新組合已歸檔的提示詞；聊天室交付的正文應與讀回檔案一致。
- 不以標題、摘要或 GitHub 路徑代替使用者所需的完整提示詞。
- 如單則回覆長度不足以容納全部提示詞，必須明確標示已展示與尚未展示的 Task；不得宣稱所有提示詞已在聊天室完整交付。可另提供含完整正文的文字附件，但仍不得發起生圖。
- 使用者貼上其中任一提示詞後，該次生圖流程由使用者掌控，與 GitHub 歸檔及本指令的工作無關。

## 10. 完成後回報與停止條件

完成後於聊天室回報：

- MODULE
- SESSION_ID（台灣時間）
- PRODUCTION_TYPE
- CHARACTER
- IMAGE_COUNT 與實際建立的 Task 數量
- OUTPUT_TYPE（節慶另列 WALLPAPER_TYPE）
- Session 根目錄路徑
- `INDEX.md` 與獨立 `.txt` 檔案數量
- GitHub 寫入結果、逐份讀回驗證結果
- 已完整交付的 Task 範圍、未完成工作或實際錯誤

**不回報 BATCH_ID、PROMPT_SET_STATUS、PROMPT_SET_LOCKED、生成狀態或執行紀錄。**

**完成提示詞設計、歸檔、驗證及聊天室交付後立即停止，不得自行呼叫圖片生成工具、開始 QA、修圖或重生。**