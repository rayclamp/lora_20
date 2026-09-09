# TASK_QUEUE.md

# 20歲依娜莉亞 LoRA 任務佇列

## 使用規則

所有帳號從本文件取得工作。

任務狀態：

- UNASSIGNED：尚未分配。
- ASSIGNED：已分配給指定帳號。
- IN_PROGRESS：帳號正在處理。
- REVIEW：等待人工確認。
- DONE：已完成。
- NEED_REWORK：需要重新生成或修正。
- BLOCKED：因外部條件暫時無法進行。

優先處理自己的 ASSIGNED / IN_PROGRESS 任務。
沒有自己的可執行任務時，才取得 UNASSIGNED 任務。

不得重做 DONE 任務，除非任務被改為 NEED_REWORK。

---

## 任務設計原則

每個任務應明確定義：

- Task ID
- 負責帳號
- 主題／場景
- 服裝
- 髮型
- 配件
- 姿勢／動作方向
- 構圖比例
- 目標圖片數
- 已完成數
- PASS / REVIEW / REJECT
- 備註

任務之間應盡量避免高度重複。

分工的目的不是讓所有帳號生成相同內容，而是讓不同帳號補足不同資料維度。

---

## 第一階段：系統驗證任務

### T001 — 20歲 MASTER_IMAGE 驗證

- Status: UNASSIGNED
- Account: TBD
- Goal: 確認 repository 中的 20 歲 MASTER_IMAGE 可以作為所有帳號共同的人物身份基準。
- Target: 1
- Priority: P0

### T002 — 新聊天室啟動測試

- Status: UNASSIGNED
- Account: TBD
- Goal: 使用最短啟動指令，確認新 ChatGPT 聊天室能依 START_HERE.md 找到專案規則、任務與帳號狀態。
- Target: 1
- Priority: P0

---

## 第二階段：LoRA 資料生產

### T101 — 室內生活場景

- Status: UNASSIGNED
- Account: TBD
- Theme: 室內／生活感
- Goal: 建立室內生活類人物資料，避免與其他場景重複。
- Target: 待定
- Priority: P1

### T102 — 城市場景

- Status: UNASSIGNED
- Account: TBD
- Theme: 現代城市
- Goal: 建立城市環境、街景與都市光線資料。
- Target: 待定
- Priority: P1

### T103 — 海邊／水域場景

- Status: UNASSIGNED
- Account: TBD
- Theme: 海邊／水域／夏季
- Goal: 建立海邊、水域、夏季光線與戶外人物資料。
- Target: 待定
- Priority: P1

### T104 — 自然景觀

- Status: UNASSIGNED
- Account: TBD
- Theme: 山林／草地／花田／自然環境
- Goal: 建立自然環境中的人物資料與不同光線條件。
- Target: 待定
- Priority: P1

### T105 — 節慶／特殊場景

- Status: UNASSIGNED
- Account: TBD
- Theme: 節慶／特殊環境
- Goal: 增加特殊服裝、配件、環境與動作資料。
- Target: 待定
- Priority: P2

---

## 任務分配原則

第一批實際生產帳號應依不同資料維度分配，而不是所有帳號同時生成同一場景。

例如：

- ACCOUNT_01 → T101
- ACCOUNT_02 → T102
- ACCOUNT_03 → T103
- ACCOUNT_04 → T104
- ACCOUNT_05 → T105

以上只是建議映射；正式分配前由目前專案狀態確認實際可用帳號數量。

---

## 任務更新規則

帳號完成工作後必須更新：

1. 任務狀態。
2. 已完成數量。
3. PASS / REVIEW / REJECT。
4. 主要生成方向。
5. 是否需要重新生成。

任務完成後才能標記 DONE。

若只有部分圖片合格，任務不可假設全部完成；應依目標數量與 QC 結果判定。
