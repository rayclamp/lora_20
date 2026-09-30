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

## Inaria costume color system
依娜莉亞的服裝設計具有長期的參考色彩基礎，但這些顏色屬於「視覺參考色」，不是固定制服配色，也不是每套服裝都必須使用的硬性規則。

### Reference palette
- **Primary Reference Color：水藍色**
- **Secondary Reference Color：藏青色**
- **Supporting Reference Color：白色**

### Color design rules
1. 水藍色、藏青色、白色是依娜莉亞長期服裝設計的主要參考色，用於維持角色整體的視覺連貫性。
2. 每套服裝不要求必須使用上述三種顏色。可以使用其中一種、兩種、三種，或在適當情況下完全使用其他色系。
3. 服裝配色應根據季節、天氣、場景、活動、服裝類型、光線、整體畫面氛圍與系列色彩規劃進行設計。
4. 可以加入其他自然且協調的色彩，例如米白、奶油色、淡粉、淡紫、淺綠、棕色、酒紅、灰藍、銀白等，但應避免無理由的高飽和、螢光或與整體人物視覺明顯衝突的配色。
5. 不要為了強行維持水藍色、藏青色或白色，而破壞服裝本身的設計合理性、季節感、場景協調性或主題正確性。
6. 同一系列桌布應具有整體色彩協調性，但不同圖片之間應保留合理的服裝色彩變化，不得只因角色識別而讓所有服裝固定使用相同配色。
7. 特殊節慶、傳統服飾與具有文化意義的服裝，以該節慶或文化的正確服裝與色彩資料為最高優先。不得為了套用 Inaria Reference Palette 而任意修改傳統服裝的核心配色。
8. 當服裝沒有明確文化色彩限制時，設計者可以自由選擇最適合該圖片的色彩方案；水藍色、藏青色與白色應視為優先參考，而非強制要求。

### Core principle
**「水藍色＋藏青色＋白色」是依娜莉亞的長期視覺參考色，而不是固定服裝配色規則。**

服裝設計應優先追求角色一致性、場景協調、季節合理、系列多樣性與整體美感，再自然地使用 Inaria Reference Palette。

## Color direction
- 水藍色是常用主色系，但不是每套服裝的強制主色。
- 藏青色是常用副色系，但不是每套服裝的強制副色。
- 白色是常用輔助色系，但不是每套服裝的強制配色。
- 當前 TASK 未指定固定配色時，設計者可依照上述 costume color system 自由設計；不得讓單一固定色彩成為人物身份的硬性訊號。
- 節慶或文化服裝的正式色彩資料優先於一般 Inaria Reference Palette。

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
