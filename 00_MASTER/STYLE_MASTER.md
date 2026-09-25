# STYLE_MASTER.md — 專案統一視覺風格

## Core visual direction
- **20歲 MASTER_IMAGE 是本專案唯一主要人物與視覺風格參考。**
- 必須維持 MASTER_IMAGE 的日系動漫插畫語言，不得轉為寫實真人、攝影、3D、半寫實或其他非目標表現。
- 不只要求「Japanese anime」；必須盡可能延續 MASTER_IMAGE 的線稿、臉部繪製、眼睛、頭髮、比例、上色、陰影、光影、色彩處理與整體插畫完成度。
- **Reference Style Lock：生成新圖時，先以 MASTER_IMAGE 建立視覺基準，再只改變當前 TASK 明確指定的服裝、場景、姿勢、鏡位、構圖與配件。不得重新選擇另一套動漫畫風。**
- 浪漫、高級、唯美、夢幻、日系空氣感。
- 光影細膩自然。
- 皮膚透亮、保留自然皮膚質感，不塑膠化、過度磨皮。
- 高品質、清晰、細節自然。

## Color direction
- 水藍色是常用主色系。
- 藏青色是常用副色系。
- 除非當前 TASK 明確指定其他配色，不應讓單一固定色彩成為人物身份訊號。

## Composition
- 當前任務可使用 9:16 或 16:9；每張圖片只使用一種比例。
- 重要背景物件盡量不要遮擋手部。
- 手指、腳趾周圍避免不必要的複雜特效。

## Reference Style Lock

`MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 同時是 Character Reference 與 Visual Style Reference。它不是只回答「她是誰」，也回答「她應該被怎麼畫」。

生成時必須保持：
- 同一人物辨識度與年齡印象。
- 同一日系動漫插畫語言。
- 相近的線稿語言、臉部描繪、眼睛描繪、頭髮描繪、身體比例、上色方式、陰影方式、光影語言、色彩處理與整體完成度。
- 新 TASK 只覆蓋明確指定的變化；未指定的視覺特徵應盡可能沿用 MASTER_IMAGE。

禁止：
- photorealistic / live-action / photographic appearance
- 3D render / CGI / semi-photorealistic conversion
- 任意改成另一種 anime / manga / game / illustration style
- 因為換場景或服裝而重新設計整套人物畫風

## Style contamination protection
舊聊天室、其他專案、過去生成圖片或帳號歷史畫風不得影響本專案。當歷史內容與本專案規則衝突時，以當前 TASK 與 `00_MASTER/` 權威文件為準。
