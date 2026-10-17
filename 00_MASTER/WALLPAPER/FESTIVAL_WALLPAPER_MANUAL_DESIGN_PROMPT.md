# FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md

# Festival Wallpaper Design Rules
## Festival Design Constraints v2.1

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
CHARACTER:
IMAGE_COUNT:
WALLPAPER_TYPE:
OUTPUT_TYPE:

FESTIVAL_SCOPE:
REGION / CULTURAL_SCOPE:
SEASON:
WEATHER:
SCENE:
TIME:
PET_ALLOWED:
CUSTOM_INSTRUCTIONS:
```

### WALLPAPER_TYPE

有效值：
- `ANIME WALLPAPER`
- `REALISTIC WALLPAPER`

不再使用「電腦桌布 / 手機桌布」作為 WALLPAPER_TYPE。

### OUTPUT_TYPE

有效值：
- `DESKTOP_16_9`
- `PHONE_9_16`

此欄位是唯一的輸出格式控制欄位，分別代表 16:9 桌面桌布與 9:16 手機桌布。不得再另外建立 `ASPECT_RATIO` 或 `ORIENTATION` 欄位。輸出格式與 `WALLPAPER_TYPE` 完全獨立。

## 2. CHARACTER AND OPTIONAL VISUAL REFERENCE

`CHARACTER` 指定本批次的角色設計方向，不代表使用者已提供人物參考圖片。設計者不得要求或等待人物參考圖片，也不得宣稱已看過未提供的圖片。

如使用者在實際生產聊天室另外提供視覺人物參考，該圖片是否可用及其權限由 `MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md` 決定；提示詞可描述如何條件式使用該參考，但不得假設圖片必然存在。

必須：
- 維持指定角色的語義一致性。
- 不因 GitHub 中存在其他 Master Image 而自行替換視覺參考。
- 若生產階段有明確參考圖，不因該圖的單一臉部方向而固定整個系列的臉部方向。
- 沒有參考圖時，不得宣稱已解析或驗證人物視覺參考。
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
- Action 必須符合節慶活動、場景、服裝、道具用途與人物當下的情境。
- 優先使用自然、容易理解且人體穩定性高的 Action。
- 動作多樣性是次要目標；不得為了避免重複而安排與節慶或背景不相關、彆扭或難以成立的動作。
- 規劃頭部方向、頸部角度、臉部朝向與眼神目標，使其共同服務於同一個自然動作。
- 避免頭部明顯朝向一側、眼睛卻強烈看向相反方向，或低頭時眼睛不自然向上看的姿勢；除非該視線有清楚、合理的情境目的。
- 可接受符合人體結構的輕微眼神偏移或自然回望，不要求頭部與眼睛在所有情況下完全同向。
- 若姿勢與場景、道具或服裝互動不協調，優先簡化姿勢，不得為追求差異犧牲自然感。

## 14. HAND / ANATOMY STABILITY

必須遵守以下共用規範，並以它們作為一般人體與生成穩定性的唯一詳細依據：

- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`

本節只規定 Festival 設計時如何應用共用規範，不重複維護一般手部、腿部、腳趾或肢體解剖條文。若細節需要判斷，以 `ANATOMY_STABILITY.md` 為共用人體穩定性權威。

Festival 設計階段必須：

1. 先選擇與節慶活動、服裝及道具相容、且人體動作容易讀懂的主要 Action。
2. 為每隻手指定清楚的主要任務；若使用節慶道具，先確定道具結構，再安排自然、可理解的手部接觸。
3. 規劃腿部姿勢與遮擋關係，確保姿勢自然且輪廓清楚；不要只為了系列多樣性加入難以辨識的交叉或扭轉姿勢。
4. 讓手、腳與重要肢體輪廓和背景、道具、服裝邊緣及裝飾效果保持足夠分離。
5. 當服裝、傳統道具、活動動作或場景使肢體結構難以辨識時，先簡化動作、道具互動或局部背景，再加入裝飾細節。

節慶專用限制：

- 手部動作必須符合該節慶的文化情境、實際活動與道具用途。
- 不得為了展示傳統道具而安排不自然或難以辨識的手部接觸。
- 不得讓節慶服裝、袖口、飄帶、飾物或道具遮擋到使關鍵肢體連接關係變得含糊。
- `Slim ≠ Long Legs`；`Elegant ≠ Model Proportions`。不得以節慶服裝的修長視覺效果為理由，刻意拉長或扭曲人體比例。

本文件不執行生圖後的圖片品管，也不要求 Producer 在生圖後自行判定、拒收、修補或重生；圖片驗收仍由獨立 QA 流程負責。

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

不得因角色設定或生產階段可能提供的單一參考圖臉部方向造成固定角度偏置。

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

`PET_ALLOWED` 是本批次獨立參數。

如果：
`PET_ALLOWED = NOT_ALLOWED`
則不得加入寵物或其他非必要動物。

如果：
`PET_ALLOWED = ALLOWED`
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

**優先順序：自然人體與平衡 → 頭部/頸部/臉部/眼神協調 → 動作符合節慶與場景 → 構圖與氣氛 → 動作多樣性。**

允許重複使用自然且符合情境的動作；不得為了形式上的差異，犧牲動作合理性或整體畫面協調。

避免「同一張人物換衣服」，但不得以強迫不同姿勢的方式解決系列重複。

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
- CHARACTER 身份語義與任何在生產階段明確提供之視覺參考的一致性；
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
