# `/LORA_PRODUCE` — LoRA 圖片生產者啟動指令

> **P0-03 核准版 — LoRA 生產者正式指令**
>
> 依使用者上傳的 `/LORA_PRODUCE` 11 節原稿及既有 P0-03 修正版本核對；持續遵循現行 CORE、LoRA Module、Schema 與已鎖定 `/LORA_CONSOLE` 交接契約。GitHub 為規範與生產記錄資料庫，實際生圖由 ChatGPT 生產者執行。本文不自動啟動 QA，不變更既有 Session／Batch，也不將歷史 ARCHIVE 視為現行規範。

## 1. 指令用途與最高優先原則

本指令用於接續既有的 `LORA_IMAGE` 生產工作，依照 GitHub 已建立並鎖定的提示詞逐一產生圖片，並將實際執行結果寫回指定 Batch。

本指令是生產執行指令，不是提示詞設計指令。

收到本指令後：

1. 先確認使用者指定的 Module、Session 與 Batch。
2. 連線 GitHub 並讀取指定 Batch 的正式紀錄及鎖定提示詞。
3. 確認目前聊天室已提供人物參考圖片。
4. 依照任務佇列逐一執行生圖。
5. 每個 Task 都必須依實際結果更新 GitHub 紀錄。
6. 完成指定 Batch 的可執行任務後，回報結果並停止。

不得自行建立新 Batch、猜測 Batch、替換指定 Batch，或把其他模組的任務混入本次工作。

## 2. 必填輸入

使用者必須指定以下三個欄位：

```text
/LORA_PRODUCE
MODULE=LORA_IMAGE
SESSION_ID=<指定的 Session ID>
BATCH_ID=<指定的 Batch ID>
```

不得自行猜測或替使用者補上不確定的識別碼。

若欄位缺失、格式錯誤，或指定的 Batch 不存在，應停止並回報需要修正的欄位或實際查到的問題，不得擅自改用其他 Batch。

## 3. 人物參考圖片是生產必要條件

**生產者必須取得使用者在目前生產聊天室提供的人物參考圖片，才能開始第一次生圖呼叫。**

執行規則：

1. 檢查目前聊天室是否有可供生圖工具使用的人物參考圖片。
2. 若有圖片，將其作為本次生產的視覺人物身份依據。
3. 若沒有圖片、圖片無法使用，或無法確認應使用哪張圖片，停止在第一次生圖呼叫之前，請使用者上傳或明確指出參考圖片。
4. 不得使用 GitHub 內的舊參考圖片、過去聊天室的圖片，或自行搜尋的其他人物圖片替代。
5. 不得因製造者階段沒有圖片而否定已鎖定的提示詞；參考圖片本來就是在生產階段提供。
6. 不得聲稱已經使用參考圖片，除非實際生圖呼叫確實使用了該圖片。

### 參考圖片的用途

參考圖片是人物視覺身份依據，不是整張圖片的複製模板。

應在符合生圖工具實際能力的情況下，保留參考人物可辨識的身份特徵與合理的外貌一致性，同時依照鎖定提示詞執行指定的服裝、姿勢、構圖、髮型整理、配件、鞋款、場景與其他變化。

除非該 Task 明確要求保留，否則不得無條件繼承參考圖中的原始服裝、姿勢、配件或背景。

## 4. 先連線 GitHub，再開始生產

連線至：

`rayclamp/lora_20`

正式分支：`main`。

依照正式規範讀取必要的共用規則與指定 Batch 資料，包括：

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
- `MODULES/LORA_IMAGE/MODULE.md`
- `MODULES/LORA_IMAGE/REFERENCE_POLICY.md`
- `MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md`
- `MODULES/LORA_IMAGE/DATASET_DIVERSITY.md`
- `MODULES/LORA_IMAGE/CANDIDATE_DESIGN_RULES.md`

當需核對現行 Console → Producer 交接契約時，讀取已登錄的 `00_MASTER/LORA/LORA_CONSOLE_COMMAND.md`；此檔只用於確認既有 Session／Batch、Prompt Lock 與 Task 格式約定，**不允許生產者重新啟動設計或修改提示詞**。不得載入 `ARCHIVE/LEGACY_LORA_PRODUCTION/` 作為現行規範，也不得混入其他模組的專屬設定。

當指定 Batch 的角色設定為 `CHARACTER=INARIA` 時，依規範讀取 `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`。

再讀取指定 Batch 路徑中的：

- `SESSION_CONTRACT.md`
- `BATCH_RECORD.md`
- `TASK_QUEUE.md`
- `PROMPT_SET.md`
- `EXECUTION_LOG.md`
- 依據正式佇列與索引、**在每個 Task 即將執行時**讀取其各自的完整鎖定提示詞檔案

指定 Batch 的正式路徑為：

`PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/`

每個 Task 的完整提示詞必須從 Canonical Path Registry 所規定的獨立檔案讀取，例如：

`PROMPTS/TASK_001.md`

`PROMPT_SET.md` 只作為索引，不得把它當成完整提示詞正文的替代來源。

如果 GitHub 無法連線、必要共用規範無法讀取、指定 Batch 身份無法確認，或發生影響所有任務的權限／安全限制，停止整批並回報實際問題。若只有單一 Task 的必要資料不可讀，隔離該 Task 並依現行 Schema 記錄，不得以猜測資料執行；只有當其他 Task 的身份、正式記錄和完整提示詞仍可由 GitHub 獨立讀取，且結果歸屬與持久化安全性可確認時，才允許繼續其他 Task。不得改用其他 Batch 或快取／記憶中的提示詞。


## 5. 鎖定提示詞是唯一生圖依據

開始生產前，確認使用者指定的 Batch 身份、Prompt Set 鎖定狀態、Task 佇列及正式 Task-to-prompt-file 對應。**只有 `PROMPT_SET_STATUS=LOCKED` 與 `PROMPT_SET_LOCKED=YES` 一致，且 Task／Prompt 對應可從正式 GitHub 記錄確認時，才可開始選取可執行 Task。** LoRA Batch 使用 `OUTPUT_TYPE=MIXED_PER_TASK`，各 Task 的 `TASK_OUTPUT_TYPE` 為 `PHONE_9_16` 或 `DESKTOP_16_9`，以既有鎖定紀錄為準，不能在生產階段重新抽選。這些工作屬於「選定 Task 與讀取 Prompt 之前」的準備，不得在完整鎖定提示詞成功讀取之後插入新的確認關卡；避免將設計階段已驗證的中繼資料檢查重複成生圖阻擋條件。

每個 Task 必須遵守：

1. 先依 GitHub 目前正式的 Session／Batch 紀錄選定可執行 Task，確認其既有任務身分、狀態與已鎖定提示詞的正式來源。不得自行建立替代 Task。
2. 讀取該 Task 官方提示詞檔案中 `BEGIN_LOCKED_PROMPT_TEXT` 與 `END_LOCKED_PROMPT_TEXT` 標記之間的**完整鎖定提示詞正文**；對既有合法舊式 Batch，僅依其正式記錄允許的來源讀取，不得自動遷移。若完整正文不可讀，只停止、標記並處理該 Task 的讀取問題；不得猜測、補寫或重建提示詞。
3. **完整提示詞成功讀取後，先以完整原文作為預設有效 Task 專屬生成指示（`FULL_LOCKED_PROMPT`）**。僅當有具體的生圖介面輸入限制，確實導致完整 Prompt 無法提交時，才依 `00_MASTER/GENERATION_WORKER_PROTOCOL.md` 準備一次必要且忠實的 `AUTHORIZED_CONDENSED_PROMPT`。完成有效生成指示的準備後，**立即**依生圖介面支援的方式呼叫生圖工具，並搭配目前生產聊天室提供的人物參考圖片。每次生成都必須攜帶當次 Task 的主要繪圖要求；不得只憑人物參考圖片自由生成，也不得在準備完成後插入額外審查或無關操作。
4. 若使用 `AUTHORIZED_CONDENSED_PROMPT`，精簡內容必須保留人物身份、服裝、姿勢、構圖、場景、畫風、Task 輸出格式、所有重要限制、例外與原始意圖；不得新增設計要求、移除獨立需求或改寫 GitHub 鎖定 Prompt。必要精簡只用於解決具體介面輸入限制，屬於同一次直接交接，不是重新設計或修改原始鎖定提示詞。
5. 首次**實際生圖呼叫**所使用的生成指示成為該 Task 的固定執行輸入。若首次使用精簡版，**在首次呼叫後**，將實際固定的完整精簡文字另存 `EXECUTION_INPUTS/<TASK_ID>.md`，並完成 GitHub 讀回驗證。每個 Task 最多一份固定精簡版；成功保存後不得覆寫、重新精簡、翻譯、替換或切換輸入模式。 `EXECUTION_LOG.md` 只記錄輸入路徑與事件，不重複保存完整精簡正文。
6. 讀取完整 Prompt 後不得再執行提示詞正確性、語義、格式、Task 綁定、構圖或品質審查；不得展示提示詞、重新設計、額外讀取 GitHub 或插入無關工作。必要且忠實的精簡準備屬於同一次直接交接，不授權更改原始鎖定 Prompt。生圖介面可能限制輸入長度或不公開隱藏負載；缺少逐字傳輸證據本身不是生圖失敗、重試或阻擋依據。依工具實際能力使用該 Task 已鎖定的 `TASK_OUTPUT_TYPE`，不可宣稱未驗證的精確輸出尺寸。
7. 只有實際生圖呼叫已確認無圖且仍有可用次數時，才可依第 8 節使用**同一份固定生成指示**重試。同一 Task 的固定輸入如暫時無法於新呼叫前提交，進入 `TASK_STATUS=PAUSED`，保留原輸入與剩餘次數，不計新增生圖失敗。已收到圖片、結果 UNKNOWN、達三次上限或安全政策禁止重試時，絕不可再次生圖。

任一 Task 的正式提示詞缺失、來源對應不可靠或無法完整讀取時，記錄真實問題並隔離該 Task。只有確定問題影響整個 Batch 的識別、Prompt 對應或安全結果歸屬，才停止整批。

## 6. 直接執行生圖，不增加不必要的判斷

對每個已由正式資料確認符合執行條件的 Task：

1. 在讀取該 Task 完整提示詞之前，完成必要的 Batch／Task 識別、既有任務狀態選取及目前生產聊天室人物參考圖片的確認。
2. 完整讀取鎖定提示詞後，以 `FULL_LOCKED_PROMPT` 為優先；僅在具體介面輸入限制確實妨礙原文提交時，依共用契約準備一次必要且忠實的 `AUTHORIZED_CONDENSED_PROMPT`，隨即攜帶有效 Task 指示及必要人物參考圖呼叫生圖工具。不得插入新的內容審查、Prompt 重新設計或無關 GitHub 操作。
3. 首次實際生成呼叫固定該 Task 後續重試使用的生成指示。根據生圖工具實際回傳內容，確認是否收到一張或以上圖片；記錄實際回傳圖片張數、可取得的識別資訊與呼叫結果。不能確認時必須標示 UNKNOWN。
4. 若使用授權精簡，首次呼叫後保存同一份**實際使用的完整精簡文字**至 `EXECUTION_INPUTS/<TASK_ID>.md`，讀回驗證後供後續可允許的重試使用。若持久化失敗，依第 9 節隔離、恢復或建立完整且讀回驗證的安全檢查點，絕不可重新精簡或補發生圖呼叫來修復紀錄。
5. 一旦確實收到圖片，立即保留「圖片已收到」的觀察事實，停止該 Task 後續生成；**不得把收到圖片與 GitHub 已成功寫入或 Task 已正式完成混為一談**。
6. 依正式 Schema 將生成嘗試、固定執行輸入路徑、結果、Prompt 使用狀態、Task 狀態及相關 Batch 統計寫入 GitHub，讀回並確認與原始觀察一致。GitHub 寫入失敗時只能恢復紀錄，不得重生。
7. 若固定指示在新的呼叫開始前暫時無法提交，記錄 `PAUSED`，保留已知嘗試、固定指示及剩餘次數；不得建立生成嘗試事件。只有前一 Task 的結果及固定輸入證據已安全保存、讀回驗證，或有完整且驗證通過的 Task-local 安全恢復檢查點，才可評估下一個可獨立執行的 Task。

生產者只判定**實際有圖／已確認無圖／結果 UNKNOWN**；不判定圖片是否美觀、是否符合提示詞或是否適合資料集。不可把「工具呼叫成功」或「預期應該有圖」當成實際收到圖片的證據。

## 7. 任務完成的判定

**圖片確實收到，是生成成功的觀察事實；已收到結果可靠歸屬、持久化並讀回驗證，才是正式 Task SUCCESS 的記錄條件。** 兩者必須分開保存、分開回報。

- **圖片已收到：** 該 Task 的 Prompt 不得再次生成；記錄 IMAGE_RECEIVED=YES（或現行 Schema 的等價正式欄位）、實際圖片數量及可取得的結果證據。即使 GitHub 寫入失敗，也不得改寫這項已確認事實。
- **正式 SUCCESS：** 一張或以上圖片已確認收到，結果可靠歸屬到正確 Task，且必需的正式紀錄已寫入 GitHub 並讀回驗證。此時將該 Task 計為 **一個**完成的 Task；每個 Task 最多計一次。
- **收到圖片但紀錄未完成：** 保留收到圖片的事實，使用正式 Schema 的未驗證／待恢復狀態；不得假稱已持久化成功、不得算入已驗證的 COMPLETED_COUNT，也不得重生圖片。
- **實際圖片總數：** 記錄工具真正回傳的每一張圖。若某 Task 一次回傳兩張或以上圖片，仍只算一個生產完成的 Task，但所有實際收到圖片都計入 ACTUAL_IMAGE_COUNT；不得只因實際回傳張數與預期不同，就對新 Task 使用歷史狀態 `RESULT_COUNT_MISMATCH`。
- **QA 與提示詞符合度：** 不得作為生產者的完成條件，不得由生產者評估，也不得因此重生。QA 目前屬獨立、PAUSED 的後續流程。

依正式 Schema 更新 TASK_QUEUE.md、EXECUTION_LOG.md、BATCH_RECORD.md 及其他適用紀錄；事件紀錄需保留歷次呼叫的真實證據，不得覆寫歷史嘗試或憑空補造結果。應明確分別記錄生成結果、實際圖片數、Task 歸屬、GitHub 寫入／讀回狀態及必要的恢復資訊。

## 8. 失敗、UNKNOWN 與重試規則

### 已確認沒有圖片的實際生圖失敗

重試只適用於**已經實際呼叫生成工具、並確認該次呼叫沒有收到任何圖片**的同一個 Task。每次重試使用首次實際呼叫所固定的**同一份執行指示**與同一份原始鎖定 Prompt 身份；不得改寫、重新精簡、切換 `FULL_LOCKED_PROMPT`／`AUTHORIZED_CONDENSED_PROMPT` 模式，或更換／新增 Task 取代失敗結果。

**最多三次連續、已確認無圖的生成嘗試，包含初次呼叫：**

1. 第一次呼叫：若確認沒有圖片，記為第 1 次生成失敗；符合政策及工具限制時可重試。
2. 第二次呼叫：若仍確認沒有圖片，記為第 2 次生成失敗；符合政策及工具限制時可最後重試一次。
3. 第三次呼叫：若再次確認沒有圖片，記為第 3 次生成失敗，將該 Task 設為適用的終止失敗狀態，不再呼叫該 Prompt。

此規定是**初次呼叫加最多兩次重試**，不是「第一次以外還能重試三次」。每個實際生成嘗試都必須依 Schema 保留獨立事件與可以確認的結果、原因、次數；不得藉由新增 Task 或更換提示詞重置上限。

### 非生圖錯誤

GitHub 連線、檔案讀取、寫入、讀回、Prompt 本身無法讀取、Task 狀態或中繼資料問題、固定指示在新呼叫前暫時無法提交、工具隱藏傳輸資訊不可見等，均不算「已確認無圖片的生成嘗試」，**不得增加生成失敗計數**。依影響範圍隔離與恢復，不可把非生圖錯誤當作重試生圖的理由。

若因配額、速率或平台政策限制而無法發起生成呼叫，記錄適當阻擋原因；沒有實際呼叫就不計為生成失敗。若已實際呼叫且確認無圖，依正式 Schema 如實記錄，但絕不可為了重試而繞過配額或安全政策。


### PAUSED — 固定指示暫時無法提交

當已準備或首次生成後固定的同一份有效 Task 指示，因暫時性的非政策介面限制，無法在**新的實際生圖呼叫開始前**提交時，依正式 Schema 記錄 `TASK_STATUS=PAUSED`，並保留原始 Prompt 身份、同一份執行指示、前次生成事件、已確認無圖失敗次數及剩餘可用次數。暫停或恢復事件本身不建立新的 `GENERATION_STARTED`／`ATTEMPT_ID`，也不消耗一次生圖機會。

恢復時只能提交原本固定的指示，不得重新精簡、切換模式、修改提示詞或重設三次上限。若首次生圖尚未發生，`PROMPT_CONSUMED=NOT_ATTEMPTED`；若此前已確認無圖，則維持 `PROMPT_CONSUMED=NO`。PAUSED 為**非終止**狀態，該 Task 未達終止狀態前不得宣稱 `BATCH_COMPLETED`。

不得對已收到圖片、實際呼叫結果 UNKNOWN、三次確認無圖已達上限或安全政策禁止重試的 Task 使用 PAUSED 取得新的生成資格。若固定精簡版無法保存，須依第 9 節記錄與安全恢復，不得靠記憶重建或改用其他精簡文字。

### 結果 UNKNOWN

若無法可靠判定某次呼叫是否收到圖片：

- 記錄 GENERATION_RESULT=UNKNOWN、PROMPT_CONSUMED=UNKNOWN、PROMPT_STATE=UNKNOWN，以及適用的恢復狀態。
- 不得把 UNKNOWN 視為已確認失敗、已完成或未生成圖片；不得重試該 Task。
- 不得刪除、覆寫、猜測既有證據；必須等待可驗證資訊解決該 Task 的歸屬與生成結果。
- 不影響其他 Task 的前提是它們完全獨立、其正式資料可由 GitHub 現況讀取，而且結果可安全辨識與保存。

### Task-local 與 Batch-wide 的停止範圍

- **Task-local：** 單一 Task 的 Prompt 讀取失敗、結果 UNKNOWN、生成失敗達三次、固定指示暫時無法提交（PAUSED）、該 Task 的精簡版或結果紀錄寫入／讀回問題等，先隔離該 Task。不得僅因上述情況就自動停止或鎖定其他 Task；PAUSED 仍是未完成的非終止 Task。
- **Batch-wide：** 只有經確認整個 Batch 身份／契約、共用 Prompt 對應、必要存取、結果歸屬或持久化安全性發生無法隔離的問題，才停止整批。
- **繼續條件：** 在前一 Task 的已知結果、歸屬與需要保存的固定執行指示已可靠地記錄／讀回，或其未解問題的**完整固定指示全文與已知 Task／嘗試／結果資訊**已依正式 Schema 建立並讀回驗證安全恢復檢查點，且不會導致重複生圖或歸屬混淆，並確認下一 Task 的完整正式資料可以獨立讀取時，方可繼續。若收到圖片但結果尚未安全保存，應先停止推進並恢復紀錄，不得只憑記憶繼續。
- **參考圖片不可用：** 如果當次生產所需的人物參考圖片無法供工具使用，停止新的生圖呼叫並回報，直到必要條件恢復；不得改用其他人物圖片或無圖模式強行繼續。

## 9. GitHub 記錄、讀回與恢復規則

GitHub 是正式規範、提示詞與生產紀錄資料庫，**不是 Runtime Controller、Claim／Lease 服務或重試引擎**。現行 Single-Producer 工作流程不要求 GitHub Task Claim、Lease 或額外執行鎖。

每個 Task 均須依實際觀察結果保存至少以下資訊（欄位名稱與允許狀態依正式 Schema，不得自行發明衝突欄位）：

- Task 編號及正式提示詞來源路徑。
- 完整 Prompt 是否成功讀取：依 Schema 記錄 `FULL_PROMPT_READ_STATUS`、`GENERATION_INPUT_MODE`（`FULL_LOCKED_PROMPT` 或必要且授權的 `AUTHORIZED_CONDENSED_PROMPT`）、`EXECUTION_INPUT_PATH`、`EXECUTION_INPUT_RECORD_STATUS`、`FIRST_ATTEMPT_ID`（如有）、實際生成呼叫事件、嘗試次數及可取得的呼叫識別資訊。若介面不暴露獨立傳輸證據，`DELIVERY_INTEGRITY_STATUS` 如實記為 `NOT_EXPOSED`／`UNVERIFIED` 等適用值；不能虛構負載逐字一致的證據。
- 圖片是否確實收到：YES、NO 或 UNKNOWN；如實記錄實際回傳張數和可用結果參照。
- 已確認無圖的生成失敗次數、實際已知的失敗原因與政策／配額限制。
- `PROMPT_CONSUMED`（未曾實際呼叫時 `NOT_ATTEMPTED`；已收到圖片／確認無圖／結果不明則依事實使用 `YES`／`NO`／`UNKNOWN`）、`PROMPT_STATE`、Task 結果及適用的恢復狀態。
- `PAUSE_REASON`、`PAUSED_AT`、`RESUMED_AT`、`REMAINING_GENERATION_ATTEMPTS`（有實際證據時），以及 Batch 的 `PAUSED_COUNT`。
- GitHub 寫入成功、寫入失敗、讀回完成或未驗證等持久化狀態。
- 適用的 Batch 統計欄位；只根據可驗證的 Task 與嘗試事件更新，不憑推測估算。

### 每次生成後的必要步驟

1. 先記錄可直接觀察到的事實，不因記錄寫入失敗而否定已收到的圖片。若當次實際生圖使用了授權精簡版，則在**首次實際生圖呼叫後**，另行保存同一份精簡全文至 `EXECUTION_INPUTS/<TASK_ID>.md`，完成讀回驗證；`EXECUTION_LOG.md` 只記錄路徑與事件，不能把未完成保存宣稱為已驗證。
2. 將嘗試事件、Task 當前狀態和相關 Batch 統計寫入 GitHub；需要更新的檔案依正式 Schema 判定，包含 TASK_QUEUE.md、EXECUTION_LOG.md 等。
3. **從 GitHub 讀回驗證**，核對嘗試次數、實際收到圖片張數、Prompt 消耗狀態、Task 狀態及相關 Batch 統計一致。
4. 若寫入或讀回失敗，停止受影響的操作並記錄／回報。不得將其偽裝為成功、重新執行已收到圖片的 Prompt，或覆蓋並行的其他更新。
5. **進入下一 Task 前：** 確認前一 Task 的已知結果、歸屬與必要的固定執行指示全文已持久化且讀回驗證，或依現行 Schema 建立**保存固定全文及全部已知 Task／嘗試／結果狀態、且已持久化並讀回驗證的完整安全恢復檢查點**。若發生 Task-local 持久化錯誤，必須先安全保全並明確協調，使已收到圖片不會丟失／重生、狀態不會混淆；只有下一 Task 的當前正式紀錄與完整 Prompt 亦可獨立讀取時才能接續。若無法可靠保全與驗證，暫停推進以恢復紀錄，而不是靠敘述或記憶繼續。
6. 修正已確認的紀錄錯誤時，保留可追溯的修正事件與原始歷史證據；不得默默覆寫先前生成結果。

### 生圖成功但 GitHub 寫入失敗

- 保留「已收到圖片、尚未持久化」的真實情況；重試／恢復**記錄操作**，不是重試**生圖操作**。
- 如無法將失敗本身寫回 GitHub，明確回報 GITHUB_RECORDING_FAILED，不得謊稱其已同步。
- 單一 Task 的記錄故障不是自動停止整批的理由；但只有安全保全、身份對應、其他 Task 的獨立資料讀取與持久化條件均成立時才可繼續。否則先暫停恢復。
- 不得改寫或刪除歷史正式 Prompt、既有 Session／Batch、已收到圖片或已有證據。


### 精簡版保存失敗與安全恢復

- 若正常 `EXECUTION_INPUTS/<TASK_ID>.md` 保存／讀回失敗，隔離受影響 Task，保留實際生成結果，不得為修復紀錄而重新生圖，也不得重新精簡、變更第一次使用的內容或覆寫已驗證的固定檔案。
- 必要時建立 `RECOVERY_CHECKPOINTS/<TASK_ID>.md`，完整保存**當次使用的固定精簡文字全文**、原始 `PROMPT_ID`／`PROMPT_VERSION`、Task／Session／Batch 身份、已知生成呼叫與結果、已確認無圖次數、`PROMPT_CONSUMED`／`PROMPT_STATE`、剩餘可用生成次數、結果歸屬及 GitHub 持久化狀態。只有檔案路徑、雜湊或敘述不能代替精簡文字全文。
- 檢查點必須成功寫入且讀回驗證，方能作為唯一有效的恢復來源；不得同時讓兩份不同精簡文字成為同一 Task 的有效執行指示。
- 只有已知結果與固定全文被正式保存或由完整檢查點安全保全、且下一 Task 的獨立正式資料可讀，才允許接續其他 Task。
- 如符合剩餘重試資格但固定輸入尚未能安全提交，Task 保持 `PAUSED`；已收到圖片的 Task 則依正式 Schema 保留結果已收但紀錄待驗證狀態，不得改為可重試的 PAUSED。

## 10. 生產者禁止事項

本指令不得：

- 建立新的 Session 或 Batch 來替代使用者指定的工作。
- 自行猜測、替換或混用 Module、Session、Batch。
- 在沒有目前聊天室參考圖片時呼叫第一次生圖。
- 修改、重寫、翻譯、解鎖或重新分配 GitHub 原始鎖定 Prompt，或未經授權精簡其執行指示。唯一例外為首次生成前因具體介面輸入限制，依共用契約建立一次忠實必要精簡；首次實際生圖固定後不得重新精簡、翻譯、改寫、覆寫或切換模式。
- 在成功讀取完整 Prompt 與生成呼叫間插入額外品質／內容驗證、設計調整或無關 GitHub 操作；必要且忠實的精簡準備屬於核准的直接交接程序。
- 把多個 Task 合併成一張拼貼圖或多格聯圖。
- 因為品質不佳、風格偏好或主觀 QA 判斷而重新生成已成功收到圖片的 Task。
- 在已收到圖片或結果 UNKNOWN 時重試，或超過同一 Task 的三次確認無圖生成嘗試上限。
- 把 GitHub 讀寫／讀回或提示詞取得失敗計入生成失敗，或因 Task-local 錯誤無理由阻擋其他獨立 Task。
- 繞過平台安全、政策、配額或速率限制進行生成。
- 執行 PASS／REVIEW／REPAIR／REJECT 等圖片品質分類；QA 未經授權不得自行啟動。
- 自行修圖或改動已完成圖片。
- 將未收到圖片的任務記錄為生成成功。
- 將未成功寫入並讀回驗證的 Task 記錄宣稱為已正式 SUCCESS。
- 遇到已確認無法隔離的系統性問題仍假裝可以正常執行。
- 修改 UNIVERSAL_WALLPAPER、FESTIVAL_WALLPAPER 或其他無關模組的資料。
- 把 ARCHIVE/LEGACY_LORA_PRODUCTION/ 當作目前有效規範。

## 11. 完成條件與回報

當指定 Batch 的可執行任務已逐一處理，或因已確認問題而需要停止／暫停時，回報：

- MODULE、SESSION_ID、BATCH_ID。
- 實際處理的 Task 數量與實際生成呼叫／重試次數。
- **確實收到圖片的 Task 數量**（即使個別任務的 GitHub 同步仍待恢復，也要如實表達其觀察結果）。
- **已持久化並讀回驗證的正式 SUCCESS Task 數量**。
- 實際收到的圖片總張數及可確認的結果參照；不得把圖片數與成功 Task 數混為一談。
- 確認無圖失敗達上限的 Task、結果 UNKNOWN 的 Task、仍待恢復的 Task，及各自實際原因。
- GitHub 寫入、讀回驗證與待同步情況。
- 尚未執行或尚未完成的 Task、`PAUSED_COUNT`、每個 PAUSED Task 的原因／固定指示路徑／剩餘可用生成次數，以及停止／暫停原因。
- 使用授權精簡之 Task 的固定輸入保存及讀回狀態、完整安全恢復檢查點（如有）與尚未解決的 GitHub 持久化問題。
- Batch 是否已真正完成、是否仍有未解決狀態；獨立 QA 仍為 `PAUSED`，生產階段不執行圖片品管。

**不得把「可執行任務已處理完」或「已收到圖片」逕行宣稱為 BATCH_COMPLETED。** 只要仍有必要 Task 處於非終止 `PAUSED`（`PAUSED_COUNT>0`）就不得結案；只有全部必要 Task 均有符合正式 Schema 的終止結果、統計與事件可核對，且 Batch 完成紀錄寫入並讀回驗證後，才可回報整批正式完成。

回報完成或停止原因後，結束本次生產工作；不得自行切換其他 Batch，也不得自動啟動 QA。

