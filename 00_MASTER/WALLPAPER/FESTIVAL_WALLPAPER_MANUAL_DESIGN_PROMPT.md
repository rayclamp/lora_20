# FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md

# INARIA 通用特殊節日桌布設計母指令
## Manual Design Master Prompt v2.0

## 0. 指令定位

本指令用於手動設計特殊節日桌布系列。

本文件是 Festival Wallpaper 的內容與設計規範，不是獨立 Worker、Dispatch 或 Runtime 系統。若 Festival 任務進入自動化生產，依 `00_MASTER/SYSTEM_ARCHITECTURE.md` 與 `00_MASTER/PRODUCTION_RECORD_SCHEMA.md` 的共用自動化架構執行；本文件只提供 Festival-specific identity/data/design constraints。

本指令負責：
1. 從 GitHub Festival Database 讀取正式節慶資料。
2. 選擇節慶與文化素材。
3. 根據 Wallpaper Type 路由 Anime 或 Realistic Wallpaper 規則。
4. 設計人物、服裝、節慶元素、活動、動作、視角、景別、構圖、場景、相機與光線。
5. 輸出完整圖片設計與 Prompt。

本指令：
- 不載入 LoRA Production 的 identity、dataset、Goal、Batch、Queue、Task、Worker state 或 QA profile。
- Do not import LoRA Dataset or LoRA Production workflow/state.
- 不以 LoRA 規則取代 Festival Wallpaper 的文化資料或 Wallpaper 規則。
- 不自動生成圖片。
- 不直接控制 ComfyUI。
- 不執行 Worker 生產流程。
- 不執行 QA。
- 不修改 LoRA Dataset。

固定：
`EXECUTION_MODE: MANUAL_DESIGN`

## 1. INPUT PARAMETERS

```
CHARACTER_REFERENCE:
IMAGE_COUNT:
WALLPAPER_TYPE:
OUTPUT_TYPE:
ASPECT_RATIO:

FESTIVAL:
REGION / CULTURAL_SCOPE:
SEASON:
WEATHER:
SCENE:
PET:
```

### WALLPAPER_TYPE

有效值：
- `ANIME WALLPAPER`
- `REALISTIC WALLPAPER`

不再使用「電腦桌布 / 手機桌布」作為 WALLPAPER_TYPE。

### OUTPUT_TYPE

有效值：
- `DESKTOP`
- `PHONE`

此欄位只表示桌布目標裝置類型，不得把比例編碼進欄位值。

### ASPECT_RATIO

有效值：
- `16:9`
- `9:16`

此欄位單獨指定圖片比例。不得使用 `DESKTOP_16_9` 等把裝置類型與比例重複寫入的值，也不得另設 `ORIENTATION`。Aspect ratio 與 Wallpaper Type 完全獨立。

## 2. CHARACTER_REFERENCE

目前使用者提供的 `CHARACTER_REFERENCE` 是本批次人物身份與外觀的主要視覺參考。

必須：
- 維持人物身份一致。
- 不因 GitHub 中存在其他 Master Image 而自行替換。
- 不因參考圖的單一臉部方向而固定整個系列的臉部方向。
- 可以改變姿勢、身體方向、臉部方向、鏡頭、景別與構圖，但不得破壞身份一致性。

## 3. WALLPAPER_TYPE ROUTING

### ANIME WALLPAPER

讀取：
`00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`

結果必須維持動漫 / 插畫視覺語言。

### REALISTIC WALLPAPER

讀取：
`00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`

結果必須維持真人攝影 / photorealistic 視覺語言、自然人體比例與物理合理性。

### Unknown

如果 WALLPAPER_TYPE 缺失或無法判斷：
> 停止設計並要求使用者指定。

不得自行猜測。

## 4. GITHUB FESTIVAL DATABASE

特殊節日資料的最高優先級來源：

Repository:
`rayclamp/lora_20`

Database:
`FESTIVAL_COSTUME_DATABASE/`

Core Index:
`FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md`

讀取順序：

`CORE_FESTIVAL_INDEX → FESTIVAL → TAGS → CATEGORY ITEMS`

首先確認：
- FESTIVAL_ID
- Festival Name
- Culture
- Region
- Cultural Scope
- Festival 是否存在

如果節慶不存在：
> 不得自行創造 GitHub 節慶資料。

## 5. FESTIVAL DATA CATEGORIES

目前分類：
1. CLOTHING
2. ACCESSORIES
3. SOCKS
4. SHOES
5. HEADWEAR
6. HAIRSTYLE
7. MAKEUP
8. BODY_DECORATION
9. PROPS
10. OTHER

不要求每個節慶都使用所有分類。

只讀取與該節慶設計真正相關的分類。

## 6. GITHUB DATA VS CREATIVE DESIGN

GitHub 負責：
- Festival Identity
- Cultural Data
- Regional Data
- Traditional Clothing
- Accessories
- Hairstyle
- Makeup
- Body Decoration
- Festival Props
- Material / Cultural Boundaries

設計模型負責：
- Character Presentation
- Outfit Combination
- Activity
- Pose
- Hand Action
- Leg Position
- Camera
- Composition
- Lighting
- Scene
- Visual Focus
- Wallpaper Value

核心原則：

> GitHub 決定「這個節慶可以如何被正確表現」；設計模型決定「如何把它設計成具有 Wallpaper Value 的圖片」。

## 7. CULTURAL ACCURACY

不得：
- 混淆不同文化的服裝。
- 任意拼接不同地區的傳統服飾。
- 把未驗證元素宣稱為節慶傳統。
- 用一般網路印象取代 GitHub 已驗證資料。

如果資料不足，標記：
`GITHUB_DATA_MISSING`

如果資料互相衝突，標記：
`DATA_CONFLICT`

不得假裝資料確定。

## 8. OUTFIT DESIGN

每張圖建立：
`OUTFIT_ARCHETYPE`

可依節慶資料形成：
- Traditional Festival Attire
- Modernized Traditional Attire
- Ceremonial Attire
- Festival Performance Attire
- Festival Visitor Attire
- Elegant Cultural Interpretation

實際名稱依 GitHub 資料調整。

不要求所有分類全部出現。

## 9. FESTIVAL RECOGNIZABILITY

每張圖片必須能回答：

> 為什麼觀眾能看出這是哪個節慶？

至少建立一個主要辨識核心：
- Clothing
- Headwear
- Accessory
- Body Decoration
- Prop
- Festival Activity
- Scene

建議：
`1 個主要辨識核心 + 1–3 個輔助元素`

避免所有節慶元素堆疊。

## 10. CHARACTER COLOR SYSTEM

如果人物為 INARIA，可將：
- WATER BLUE
- NAVY
- WHITE
- LIGHT COLORS

作為人物整體和諧參考。

但不得強迫所有節慶服裝使用相同配色。

節慶文化本身具有明確色彩時，優先遵守節慶資料。

## 11. COMPOSITION RULES

依 Wallpaper Type 路由：
- Anime → `00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`
- Realistic → `00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`

每張圖獨立設計：
- FRAMING
- CHARACTER_OCCUPANCY
- SHOT_DISTANCE
- CHARACTER_POSITION
- VISUAL_FOCUS

可使用：
- CLOSE-UP
- BUST / HALF-BODY
- MEDIUM SHOT
- CHARACTER-DOMINANT FULL-BODY
- ENVIRONMENTAL FULL-BODY

重要：
> FULL-BODY ≠ DISTANT SHOT

## 12. CLOSE-UP

Close-up 可用於：
- Festival Makeup
- Headwear
- Hair Ornament
- Face Decoration
- Jewelry
- Upper Costume
- Traditional Textile
- Cultural Prop

Close-up 必須具有明確 VISUAL_FOCUS，而不是單純放大臉部。

## 13. ACTION DESIGN

每張圖片必須有：
- MAIN_ACTION
- HAND_ACTION
- LEG_POSITION

先建立完整：
`ACTION_LIST`

規則：
- 每張圖片一個主要 Action。
- 不重複完全相同的主要 Action。
- Action 必須符合節慶、場景與服裝。
- 優先使用人體穩定性高的 Action。

## 14. HAND / ANATOMY STABILITY

必須遵守：
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`

設計順序：
1. Stable Hand Action
2. Fingers / toes / limb-source
3. Body ergonomics / support
4. Hand-object / wearable connections
5. Background / effect clearance
6. Decorative complexity

手部規則：
- 一手一個主要任務。
- 優先簡單、寬接觸面握持。
- 避免雙手交錯。
- 避免雙手重疊放在同一膝蓋或大腿。
- 避免手指交錯。
- 避免不必要的小物件指尖捏取。
- 避免手靠近畫面邊緣。
- 避免特效穿過手指。
- 至少一隻可見手應具有清楚結構。

腿部：
- 避免交叉、纏繞、扭轉。
- 清楚建立 hip → thigh → knee → shin → ankle → foot。
- 不得刻意拉長腿部。

重要：
> Slim ≠ Long Legs
>
> Elegant ≠ Model Proportions

## 15. WEARABLES / PROPS

帽子、眼鏡、包包、背帶、腰帶、飾品等必須具有自然支撐。

避免不必要的高風險手部互動：
- Adjusting Hat
- Touching Glasses
- Removing Glasses
- Holding Tiny Jewelry
- Finger Pinching

如果使用節慶道具：
> 先建立道具結構，再建立手與道具的自然接觸。

## 16. SCENE

場景必須服務：
- Festival Recognition
- Character Story
- Wallpaper Value
- Visual Depth
- Composition

可以使用：
- Festival Street
- Temple / Shrine Area
- Traditional Village
- City Festival
- Ceremonial Space
- Festival Market
- Seasonal Outdoor Area
- Indoor Cultural Venue
- Traditional Architecture
- Modern Festival Venue

實際選擇必須與節慶文化資料相容。

## 17. CAMERA

每張圖獨立設計：
- CAMERA_VIEW
- CAMERA_HEIGHT
- LENS
- SHOT_DISTANCE

可使用：
- Front
- 3/4 Front
- Side-front
- Side
- Slight High Angle
- Eye Level
- Slight Low Angle

不得因 CHARACTER_REFERENCE 的單一臉部方向造成固定角度偏置。

Realistic Wallpaper 特別避免極端廣角造成臉、手、腳變形。

## 18. LIGHTING

光線同時服務：
- Festival Atmosphere
- Face Readability
- Clothing Detail
- Background Separation
- Wallpaper Mood

可依季節與節慶使用：
- Soft Daylight
- Golden Hour
- Warm Festival Lights
- Lantern Light
- Cool Evening Light
- Moonlight
- Indoor Warm Light

## 19. PET

`PET` 是本批次獨立參數。

如果：
`PET = NOT_ALLOWED`
則不得加入寵物或其他非必要動物。

如果：
`PET = ALLOWED`
仍必須確保動物不遮擋人物、不搶走節慶焦點，並遵守穩定性規則。

不得從 LoRA Production 引入 age-20 動物排除規則。

## 20. SERIES DIVERSITY

當 IMAGE_COUNT > 1，系列應具有合理變化：
- Festival
- Outfit
- Hairstyle
- Action
- Pose
- Camera
- Shot
- Composition
- Character Position
- Visual Focus
- Scene

不要求平均分配。

多樣性必須服務：
- Festival
- Character
- Story
- Composition
- Wallpaper Value

避免「同一張人物換衣服」。

## 21. MULTIPLE FESTIVAL SELECTION

若使用者指定單一節慶：
> 使用指定節慶。

若要求多個節慶：
從 GitHub Core Festival Database 選擇，考慮：
- Cultural Diversity
- Regional Diversity
- Seasonal Diversity
- Visual Diversity
- Clothing Diversity
- Scene Diversity
- Prop Diversity
- Action Diversity

不得單純依 Database 順序選擇。

## 22. FESTIVAL-SPECIFIC RESTRICTIONS

若該節慶有專用規則，例如禁止 BACK / BACK_3/4，必須遵守較嚴格規則。

即使沒有禁止背面：
> 不得為了形式上的多樣性而無意義使用背面構圖。

## 23. RULE PRECEDENCE

衝突時依下列層級處理：

### 1. USER INTENT
使用者當前明確要求定義「WHAT」：希望產生什麼結果、主題、數量、Wallpaper Type、Aspect Ratio，以及其他明確創作目標。

使用者意圖不得直接覆蓋系統執行條件、模組狀態、CORE 硬性規則或其他更高層級的安全與一致性限制。

### 2. SYSTEM / RUNTIME / MODULE AUTHORITY
系統架構、目前適用的模組規範與 ChatGPT 的內部生產機制決定「WHETHER / HOW」：是否可以執行、由哪個模組處理、使用哪些流程與狀態。

PAUSED 模組不得因使用者要求而被啟用。

### 3. APPLICABLE CONTENT CONSTRAINTS
依目前任務適用：
- CHARACTER_REFERENCE 身份與視覺一致性；
- GitHub Festival Database 文化資料；
- Wallpaper Type Rules；
- Festival-specific restrictions。

這些規則決定可使用的身份、文化素材、視覺類型與專用限制。

### 4. CORE HARD CONSTRAINTS
CORE_RULES、DRAWING_INSTRUCTIONS、ANATOMY_STABILITY、IMAGE_GENERATION_SAFETY_SPEC 等 CORE 硬性規則不可被使用者意圖、文化設計或創意降低。

模組可以增加更嚴格限制，但不得削弱 CORE。

### 5. CREATIVE DESIGN
在上述條件均滿足後，才由設計模型決定：
- Composition
- Action
- Pose
- Camera
- Lighting
- Visual Focus
- Decorative Creativity

不得使用創意覆蓋文化資料、模組限制、目前生產狀態或 CORE 硬性規則。

### Authority principle

> USER INTENT 決定「想做什麼」；SYSTEM / RUNTIME / MODULE AUTHORITY 決定「能不能做、由誰做、怎麼做」；CORE 決定不可削弱的共同硬性限制；CREATIVE DESIGN 只在剩餘自由度內完成設計。

## 24. DESIGN WORKFLOW

`INPUT → WALLPAPER ROUTING → FESTIVAL INDEX → FESTIVAL DATA → CULTURAL ANALYSIS → FESTIVAL_SELECTION → ACTION_LIST → SERIES_COMPOSITION_PLAN → IMAGE DESIGN → FULL_PROMPT → NEGATIVE_PROMPT → TEXT STABILITY CHECK → OUTPUT`

## 25. FESTIVAL_SELECTION

先輸出：

```
Festival 01
- FESTIVAL_ID:
- Festival Name:
- Region:
- Cultural Scope:
- Core Identity:
- Main Visual Elements:
- Selected Categories:
- Selection Reason:
```

## 26. ACTION_LIST

```
IMAGE 01
MAIN_ACTION:
HAND_ACTION:
LEG_POSITION:

IMAGE 02
MAIN_ACTION:
HAND_ACTION:
LEG_POSITION:
```

確認沒有完全重複的主要 Action。

## 27. SERIES_COMPOSITION_PLAN

至少列出：

```
IMAGE_ID
FESTIVAL
FRAMING
SHOT_DISTANCE
CHARACTER_OCCUPANCY
CHARACTER_POSITION
VISUAL_FOCUS
CAMERA_VIEW
MAIN_ACTION
```

目的：
> 確認整個系列不是同一張圖換衣服。

## 28. IMAGE DESIGN OUTPUT

每張圖輸出：

```
IMAGE_ID:
FESTIVAL:
FESTIVAL_ID:
REGION / CULTURAL_SCOPE:
OUTPUT_TYPE:
ASPECT_RATIO:

OUTFIT_ARCHETYPE:

CLOTHING:
ACCESSORIES:
SOCKS:
SHOES:
HEADWEAR:
HAIRSTYLE:
MAKEUP:
BODY_DECORATION:
PROPS:

SCENE:
MAIN_ACTION:
HAND_ACTION:
LEG_POSITION:

CAMERA_VIEW:
CAMERA_HEIGHT:
LENS:
SHOT_DISTANCE:
FRAMING:
CHARACTER_OCCUPANCY:
CHARACTER_POSITION:
VISUAL_FOCUS:

BACKGROUND:
COMPOSITION:

LIGHTING:
WEATHER:
SEASON:

FESTIVAL_RECOGNITION:
CULTURAL_REASON:

WALLPAPER_VALUE:

STABILITY_CHECK:

FULL_PROMPT:

NEGATIVE_PROMPT:
```

## 29. FULL_PROMPT

必須包含：
- Character Identity
- Wallpaper Type
- Festival Identity
- Verified Festival Elements
- Outfit
- Hair / Makeup
- Accessories
- Props
- Main Action
- Stable Pose
- Camera
- Composition
- Scene
- Lighting
- Weather
- Season
- Wallpaper Context

Anime 必須維持 Anime / Illustration 視覺語言。

Realistic 必須維持 Photorealistic / realistic human visual language。

不得混用兩套視覺規則。

## 30. NEGATIVE_PROMPT

依 WALLPAPER_TYPE、Festival、Pose、Hand Action、Camera 動態建立。

視需要加入：

```
extra fingers
missing fingers
fused fingers
deformed hands
duplicate hands
extra arms
detached hands
incorrect hand anatomy
crossed hands
interlaced fingers
extra legs
crossed legs
twisted legs
entangled legs
unnaturally long legs
elongated limbs
broken leg anatomy
broken straps
floating straps
detached straps
strap through body
floating accessories
```

Realistic 可加入：
```
anime face
illustration
plastic skin
beauty filter
over-smoothed skin
exaggerated proportions
extreme wide-angle distortion
```

Anime 可加入：
```
photorealistic face
live-action appearance
real-human rendering
```

## 31. TEXT-LEVEL STABILITY CHECK

逐張確認：
- Hand action simple enough
- No crossed/interlaced hands
- Hand-object contact plausible
- Intended finger visibility clear
- Two arms/hands and two legs
- Legs have clear paths
- Natural body proportions
- Wearable straps connect naturally
- Festival ID verified
- Cultural scope verified
- Wallpaper type correct
- Character identity preserved
- Composition has a clear purpose
- Wallpaper value exists

## 32. SERIES-LEVEL FINAL CHECK

確認：
- Festival diversity
- Cultural diversity
- Outfit diversity
- Hairstyle diversity
- Action diversity
- Pose diversity
- Camera diversity
- Shot diversity
- Composition diversity
- Visual focus diversity
- Scene diversity
- Character identity consistency
- Pet rule compliance
- No unnecessary mannequin-like repetition
- No systematic face-angle bias
- No systematic distant-full-body bias

## 33. WALLPAPER_VALUE

每張圖必須具有：
- Mood
- Visual Hierarchy
- Character Appeal
- Festival Identity
- Background Depth
- Useful Composition

並考慮：
- Desktop / Mobile Safe Area
- Clock / Icon Space
- Text-free Areas
- Subject Placement
- Visual Balance

## 34. FINAL EXECUTION BOUNDARY

完成：
- FESTIVAL_SELECTION
- ACTION_LIST
- SERIES_COMPOSITION_PLAN
- ALL IMAGE DESIGNS
- FULL PROMPTS
- NEGATIVE PROMPTS
- TEXT-LEVEL STABILITY CHECK

之後停止。

不得：
- 自動生成圖片
- 自動控制 ComfyUI
- 自動建立 Worker Task
- 自動修改 LoRA Dataset
- 自動執行 QA
- 自動宣稱圖片已生成

## 35. FINAL COMMAND

先完成所有節日選擇、GitHub 素材分析、ACTION_LIST、SERIES_COMPOSITION_PLAN，再輸出所有桌布的文字構圖與完整 Prompt。

**先不要生圖。**
