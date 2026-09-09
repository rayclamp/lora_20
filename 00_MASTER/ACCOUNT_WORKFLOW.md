# ACCOUNT_WORKFLOW.md — 多帳號工作規則

## 1. 共用原則

六個 ChatGPT 帳號是同一個 LoRA 專案的工作站，不是六種不同畫風。所有帳號製作同一個 20 歲依娜莉亞。

## 2. 帳號狀態

每個帳號只維護自己的 `ACCOUNTS/ACCOUNT_XX.md`，記錄任務、完成數量、品質結果、使用過的資料維度與下一步。不得把個人審美偏好寫入帳號狀態。

## 3. 任務來源

任務以 `TASKS/TASK_QUEUE.md` 為準。優先執行已分配任務；不得自行重做 DONE 任務，除非明確標記 NEED_REWORK。

## 4. 工作分工

- ACCOUNT_01：CHARACTER
- ACCOUNT_02：CLOTHING
- ACCOUNT_03：SCENE
- ACCOUNT_04：POSE_CAMERA
- ACCOUNT_05：PROMPT / GENERATION / DATASET
- ACCOUNT_06：FINAL_REVIEWER / QA

實際任務以 TASK_QUEUE 為準。ACCOUNT_06 不建立獨立畫風，也不取代前五個專業規格。

## 5. 生成前讀取順序

1. `START_HERE.md`
2. `PROJECT_STATUS.md`
3. `00_MASTER/MASTER_SPEC.md`
4. `00_MASTER/MASTER_WORKFLOW.md`
5. `00_MASTER/ACCOUNT_WORKFLOW.md`
6. `00_MASTER/GENERATION_RULES.md`
7. `00_MASTER/STYLE_MASTER.md`
8. `00_MASTER/DRAWING_INSTRUCTIONS.md`
9. `00_MASTER/IDENTITY_MASTER.md`
10. `00_MASTER/QUALITY_CONTROL.md`
11. `TASKS/TASK_QUEUE.md`
12. 自己的 `ACCOUNTS/ACCOUNT_XX.md`
13. 需要圖片生成時使用聊天室中由使用者直接上傳的 `MASTER_IMAGE`

## 6. 生成原則

人物身份由 MASTER_IMAGE 鎖定；風格由 `00_MASTER/STYLE_MASTER.md` 鎖定；長期繪圖規則由 `00_MASTER/DRAWING_INSTRUCTIONS.md` 鎖定；具體內容由當前 TASK 決定。歷史聊天室風格不得介入。

## 7. 品質判定

每張候選圖都必須經過統一 QA。正式狀態使用 `PASS / REPAIR / REJECT`；`REVIEW` 如仍出現在舊紀錄，只視為歷史兼容標記，新的最終決策應轉為三態之一。

## 8. 額度與斷點續作

使用 `PRODUCTION/IMAGE_QUEUE.md` 管理 IMG_01–IMG_20。生成額度耗盡時不重做已完成項目；恢復後從最小編號的未完成項目繼續。

## 9. 完成後

更新自己的 ACCOUNT 檔案、任務狀態與必要的生產紀錄。不要修改其他帳號的進度，也不要把暫時討論升格為永久規則。
