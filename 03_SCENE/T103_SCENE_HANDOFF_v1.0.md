# T103 — SCENE Handoff v1.0

- **Account:** ACCOUNT_03
- **Task:** T103 — SCENE 場景資料
- **Department:** 03_SCENE
- **Target:** 20 scene design units
- **Completed:** 20 / 20
- **Status:** PASS
- **Purpose:** 提供 ACCOUNT_05 可直接整合、並供 ACCOUNT_04 進行姿勢／鏡位相容設計的第一輪場景素材。
- **Identity reference:** `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- **Character source:** `01_CHARACTER/CHARACTER_SPEC.md` v1.1
- **Scene source:** `03_SCENE/SCENE_SPEC.md` v001
- **Generation source:** `00_MASTER/GENERATION_RULES.md`
- **Style source:** `WORKFLOW/STYLE_MASTER.md`

## Handoff rules

1. 本 handoff 只定義場景、環境、時間、天候、光線、空間與背景可讀性；不改寫 Character、Clothing、Pose/Camera 的責任範圍。
2. MASTER_IMAGE 僅用於人物身份確認，不複製其服裝、姿勢、構圖、背景、鏡位或單張畫面安排。
3. 20 個單元刻意分散城市、郊區、自然、室內與過渡空間，並輪換季節、時間、天候與光線；避免以單一場景成為人物身份的隱性綁定。
4. 每個場景都保留人物周圍的清楚 negative space，尤其是臉、手、腳、頭髮輪廓與服裝邊界。
5. 背景不得安排穿過頭部、手指、腳踝或身體輪廓的高對比線性物件；手腳附近維持乾淨視覺區。
6. 天候與光效應服務人物，不以雨滴、霧、粒子、逆光 flare 或大量前景物件遮擋身份與服裝資訊。
7. 20 個單元為可組合 Scene Design Unit，不等同已生成圖片；最終圖片仍須經統一 QUALITY_CONTROL 驗收。

## 20 Scene Design Units

### S01 — 台北城市高樓露台・春季清晨
- **Location:** 現代台北高樓住宅／飯店露台
- **Region:** Taiwan
- **Season:** Spring
- **Weather:** clear, very light morning haze
- **Time:** early morning
- **Environment:** 淺灰石材露台、低矮玻璃欄杆、少量盆栽綠植，遠方城市高樓與山線
- **Foreground:** 一小段失焦植栽葉片，保持稀疏
- **Midground:** 人物所在露台活動區，地面乾淨、無雜物
- **Background:** 台北城市天際線與淡淡遠山，建築密度中等
- **Lighting:** 柔和低角度晨光由側前方進入，弱補光，陰影柔軟
- **Color/Tone:** ivory gray / soft green / pale blue, restrained contrast
- **Atmosphere:** 清新、安靜、高級
- **Environmental Storytelling:** 露台小圓桌與尚未收起的早餐杯具，數量極少
- **Character Separation:** 天際線遠離頭部；玻璃欄杆不切過手臂與手部
- **Hand/Foot Clearance:** 手部後方留完整天空／牆面視覺區；腳下保持單一石材平面
- **Scene-specific Constraints:** 不加入大量招牌、車流或人群；避免過度都市噪點
- **Dependencies from Character/Clothing:** 背景以低彩度中性材質支援不同服裝顏色
- **Notes for Pose/Camera:** 適合中景或全身直式構圖；可配合自然站姿或輕靠欄杆

### S02 — 老街石板巷・春季雨後上午
- **Location:** 台灣歷史街區的窄巷與老屋騎樓
- **Region:** Taiwan
- **Season:** Spring
- **Weather:** post-rain
- **Time:** morning
- **Environment:** 洗石子牆、木窗、簡潔騎樓、濕潤石板路、少量盆栽
- **Foreground:** 一小段濕潤路面反光
- **Midground:** 人物所在巷道較寬區段，確保足部完整
- **Background:** 老屋立面逐漸退入景深，遠端巷口透出自然光
- **Lighting:** 雨後柔光從巷口斜射，反射光補足臉部
- **Color/Tone:** warm gray / muted green / wet blue-gray
- **Atmosphere:** 溫柔、懷舊、清爽
- **Environmental Storytelling:** 雨傘收納架與幾盆耐陰植物，避免商業招牌堆疊
- **Character Separation:** 不讓門框或電線穿過頭髮與肩線
- **Hand/Foot Clearance:** 手部後方以完整牆面或柔和巷口光作乾淨背景；地面無橫向雜物
- **Scene-specific Constraints:** 不出現無關人物、密集車輛、文字水印；雨後地面應有一致濕潤感
- **Dependencies from Character/Clothing:** 可支援淺色或深色服裝，不鎖定單一色系
- **Notes for Pose/Camera:** 適合 9:16，人物沿巷道方向取得自然縱深

### S03 — 淡水河岸步道・春季傍晚
- **Location:** 河岸景觀步道
- **Region:** Taiwan
- **Season:** Spring
- **Weather:** partly cloudy
- **Time:** golden hour
- **Environment:** 寬闊河面、低矮草坡、木質或石材步道、遠方橋體
- **Foreground:** 少量低草，避免遮腳
- **Midground:** 人物與河岸步道形成清楚水平線
- **Background:** 河面與遠方城市輪廓，橋體位於人物側後方而非頭頂
- **Lighting:** 低角度暖陽側逆光，柔和輪廓光，臉部保留填光
- **Color/Tone:** warm gold / river blue / soft green
- **Atmosphere:** 浪漫、開闊、寧靜
- **Environmental Storytelling:** 遠方少量自行車道標記，但不使用可讀文字
- **Character Separation:** 天空與河面形成大面積乾淨區域
- **Hand/Foot Clearance:** 手部外側不與橋欄重疊；腳下步道保持連續
- **Scene-specific Constraints:** 避免夕陽直射造成臉部全黑；不加入大量遊客
- **Dependencies from Character/Clothing:** 暖光可改變服裝感受，但不得造成身份特徵難辨
- **Notes for Pose/Camera:** 適合全身或 3/4 身，能提供明確水平縱深

### S04 — 港區海濱長廊・夏季清晨
- **Location:** 現代港區海濱步道
- **Region:** Taiwan
- **Season:** Summer
- **Weather:** clear with light coastal haze
- **Time:** morning
- **Environment:** 淺色鋪面、簡潔欄杆、海面、遠方港灣設施與低密度建築
- **Foreground:** 稀疏海濱草葉，避免貼近人物腳部
- **Midground:** 寬闊步道與開放海面
- **Background:** 海港、遠方山丘與低矮城市輪廓
- **Lighting:** 明亮但柔和的海岸晨光，天空散射光充足
- **Color/Tone:** pale cyan / sand beige / navy accents
- **Atmosphere:** 清爽、明亮、度假感但不浮誇
- **Environmental Storytelling:** 遠處停泊船隻作尺度參考
- **Character Separation:** 海天背景保持低細節；欄杆高度不得穿過手部
- **Hand/Foot Clearance:** 人物兩側留海天負空間；腳下無複雜鋪面圖案
- **Scene-specific Constraints:** 不使用大量棕櫚樹、霓虹或熱帶度假符號
- **Dependencies from Character/Clothing:** 支援水藍、白、藏青及中性色服裝
- **Notes for Pose/Camera:** 適合橫式 16:9 或全身直式 9:16

### S05 — 城市書店咖啡角・春季午後
- **Location:** 高級獨立書店內的咖啡閱讀區
- **Region:** Taiwan
- **Season:** Spring
- **Weather:** overcast outside
- **Time:** afternoon
- **Environment:** 淺木書架、米白牆面、少量綠植、木桌與布質座椅
- **Foreground:** 一角桌面或書脊作低對比框景
- **Midground:** 人物活動區保持寬敞
- **Background:** 書架呈規律垂直節奏，遠離人物頭部
- **Lighting:** 大窗戶漫射自然光＋少量暖色室內燈
- **Color/Tone:** cream / light wood / muted blue-gray
- **Atmosphere:** 安靜、知性、溫柔、高級
- **Environmental Storytelling:** 書本與咖啡杯少量擺放，避免可讀封面文字
- **Character Separation:** 書架細節降對比，人物臉部位於單純牆面／窗光區
- **Hand/Foot Clearance:** 桌角與椅腳避開手腳輪廓；地面保持完整
- **Scene-specific Constraints:** 不出現其他顧客；避免密集文字與品牌 Logo
- **Dependencies from Character/Clothing:** 中性室內色調，讓服裝成為次級但清楚的視覺資訊
- **Notes for Pose/Camera:** 可配合站立閱讀、靠桌或簡單行走姿態

### S06 — 飯店玻璃中庭・夏季午後
- **Location:** 高級現代飯店的玻璃中庭／室內花園
- **Region:** Taiwan
- **Season:** Summer
- **Weather:** bright outside
- **Time:** afternoon
- **Environment:** 高挑玻璃天窗、米白石材、少量大型觀葉植物、水景小池
- **Foreground:** 少量葉片作柔和框景，不遮人物
- **Midground:** 開放石材地坪與人物活動區
- **Background:** 玻璃結構與遠景綠意，線條保持整齊
- **Lighting:** 天窗漫射自然光，局部反射光，無硬烈直射
- **Color/Tone:** ivory / sage green / pale cyan
- **Atmosphere:** 豪華、通透、寧靜
- **Environmental Storytelling:** 小型水景與休憩座椅，數量受控
- **Character Separation:** 玻璃結構線避開臉部與身體中心線
- **Hand/Foot Clearance:** 水景邊緣不靠近手腳；地坪紋理低對比
- **Scene-specific Constraints:** 不做巨大室內瀑布或過度繁茂植物牆
- **Dependencies from Character/Clothing:** 適合不同服裝輪廓與鞋型，地面應清楚
- **Notes for Pose/Camera:** 適合全身與中景，能提供高級室內空間尺度

### S07 — 阿里山茶園坡地・春季清晨薄霧
- **Location:** 山坡茶園與茶園小徑
- **Region:** Taiwan
- **Season:** Spring
- **Weather:** light mist
- **Time:** early morning
- **Environment:** 規律茶樹梯田、土石小徑、遠山層次
- **Foreground:** 少量茶樹葉緣，避免覆蓋腳部
- **Midground:** 人物所在茶園小徑與低矮茶樹
- **Background:** 山谷與層疊山脈被薄霧柔化
- **Lighting:** 清晨漫射光，霧中柔和高光，臉部保持清楚
- **Color/Tone:** fresh green / mist blue-gray / warm earth
- **Atmosphere:** 清新、安靜、夢幻
- **Environmental Storytelling:** 茶園行列與簡單木樁呈現農業環境
- **Character Separation:** 茶樹高度低於腰部附近，避免遮擋身體與手
- **Hand/Foot Clearance:** 小徑邊緣留乾淨土路；避免枝葉纏繞手部
- **Scene-specific Constraints:** 不加入櫻花、竹林等無關符號；霧不能遮臉
- **Dependencies from Character/Clothing:** 自然綠背景可與淡色及水藍服裝形成清楚對比
- **Notes for Pose/Camera:** 適合直式縱深構圖，人物可站在小徑中央或偏側

### S08 — 海岸礫石步道與藍色海灣・夏季上午
- **Location:** 台灣東部海岸觀景步道
- **Region:** Taiwan
- **Season:** Summer
- **Weather:** clear
- **Time:** late morning
- **Environment:** 礫石海岸、低矮耐風植物、藍色海灣、遠方岩岸
- **Foreground:** 稀疏礫石與少量海岸植物
- **Midground:** 穩定平坦觀景平台／步道
- **Background:** 海灣與遠方山脊，地平線清楚
- **Lighting:** 側上方自然日光，海面反光作柔和 fill
- **Color/Tone:** ocean blue / stone gray / muted green
- **Atmosphere:** 自由、清澈、明亮
- **Environmental Storytelling:** 海岸地形本身作主要敘事，不加入大量人造物
- **Character Separation:** 人物與海天之間保留大面積乾淨負空間
- **Hand/Foot Clearance:** 礫石不堆到腳踝；手部後方主要為天空或遠海
- **Scene-specific Constraints:** 避免危險懸崖邊站位；不讓海浪直接遮腳
- **Dependencies from Character/Clothing:** 支援夏季輕量服裝與多種鞋型
- **Notes for Pose/Camera:** 適合全身直式與寬景橫式兩種後續構圖

### S09 — 林間木棧道・秋季午後
- **Location:** 低山森林公園木棧道
- **Region:** Taiwan
- **Season:** Autumn
- **Weather:** partly cloudy
- **Time:** afternoon
- **Environment:** 常綠與少量季節變色樹葉、木棧道、林下蕨類、遠方林徑
- **Foreground:** 少量散落葉片，不堆積到腳邊
- **Midground:** 寬木棧道與人物活動區
- **Background:** 樹幹與林間亮處形成柔和透視
- **Lighting:** 樹冠間斑駁但柔和的日光，避免高對比光斑落在臉上
- **Color/Tone:** moss green / warm brown / muted gold
- **Atmosphere:** 沉靜、自然、成熟
- **Environmental Storytelling:** 木質導覽牌可作遠景，但不得有可讀文字
- **Character Separation:** 避免樹幹延伸穿過頭髮與四肢
- **Hand/Foot Clearance:** 棧道扶手與腳部錯開；人物周圍保留平整木板
- **Scene-specific Constraints:** 不做密集藤蔓或強烈光斑特效
- **Dependencies from Character/Clothing:** 秋季背景可承接暖色或冷色服裝，不鎖定
- **Notes for Pose/Camera:** 適合沿棧道行走或自然站姿

### S10 — 山城觀景平台・秋季藍調時刻
- **Location:** 山城高處的現代觀景平台
- **Region:** Taiwan
- **Season:** Autumn
- **Weather:** clear after rain
- **Time:** blue hour
- **Environment:** 深色石材平台、簡潔金屬欄杆、山城燈火與遠山
- **Foreground:** 一小段低矮欄杆，保持低對比
- **Midground:** 人物所在平台中央區域
- **Background:** 山谷城市燈光呈散景，遠山輪廓仍可辨識
- **Lighting:** 天空殘光＋城市環境光＋非常柔和人物補光
- **Color/Tone:** deep blue / cool gray / warm amber lights
- **Atmosphere:** 浪漫、安靜、電影感但寫實
- **Environmental Storytelling:** 遠方住宅燈火提供尺度，不使用霓虹招牌
- **Character Separation:** 人物頭部後方以較暗、均勻天空或遠山留出乾淨區
- **Hand/Foot Clearance:** 欄杆不切手指；平台地面避免複雜反射
- **Scene-specific Constraints:** 不使用白天級環境亮度；不做過度星空特效
- **Dependencies from Character/Clothing:** 深色背景需保留臉部與服裝輪廓分離
- **Notes for Pose/Camera:** 適合半身、3/4 身或全身靜態構圖

### S11 — 日式庭園茶室外廊・春季午後
- **Location:** 傳統日式庭園的木質外廊與茶室入口
- **Region:** Japan
- **Season:** Spring
- **Weather:** clear, mild
- **Time:** afternoon
- **Environment:** 木質緣側、庭石、苔地、修剪灌木、簡潔拉門
- **Foreground:** 少量庭石與低矮苔地
- **Midground:** 木廊與人物站立區
- **Background:** 庭園層次與簡潔茶室立面
- **Lighting:** 樹影下柔和側光，室內暖色光極弱
- **Color/Tone:** cedar brown / moss green / cream
- **Atmosphere:** 雅致、平靜、日系空氣感
- **Environmental Storytelling:** 一個簡潔茶室入口與庭園構成地域線索
- **Character Separation:** 拉門垂直線避開頭部與身體中心
- **Hand/Foot Clearance:** 木廊地面平整；庭石與手腳保持距離
- **Scene-specific Constraints:** 不堆疊鳥居、燈籠、櫻花等符號；維持單一 coherent garden language
- **Dependencies from Character/Clothing:** 背景中性，可支援不同服裝色彩
- **Notes for Pose/Camera:** 適合站在外廊或庭園交界，形成室內外過渡感

### S12 — 日本海邊小鎮車站月台・夏季傍晚
- **Location:** 小型地方鐵路車站月台
- **Region:** Japan
- **Season:** Summer
- **Weather:** partly cloudy
- **Time:** golden hour
- **Environment:** 簡潔月台、木質或淺色候車亭、鐵道遠景、海岸方向天空
- **Foreground:** 月台邊界保持距離，不讓人物站在危險位置
- **Midground:** 候車區與乾淨月台地面
- **Background:** 單線鐵道延伸至遠方、低密度小鎮與海天
- **Lighting:** 斜向暖陽＋天空散射光
- **Color/Tone:** pale gold / sky blue / weathered wood
- **Atmosphere:** 青春、安靜、懷舊但寫實
- **Environmental Storytelling:** 小型時刻表板可存在但文字不可讀或不突出
- **Character Separation:** 月台柱體不穿過頭髮；鐵軌線保持遠離腳部
- **Hand/Foot Clearance:** 人物腳下為完整安全平台；欄杆與手部錯開
- **Scene-specific Constraints:** 不加入其他乘客；不站在軌道邊緣
- **Dependencies from Character/Clothing:** 適合日常、夏季或輕旅行服裝
- **Notes for Pose/Camera:** 適合側身、面向遠方或回頭等後續 Pose/Camera 設計

### S13 — 日本鄉間稻田小路・初秋清晨
- **Location:** 低密度鄉村稻田道路
- **Region:** Japan
- **Season:** Autumn
- **Weather:** clear with light morning haze
- **Time:** early morning
- **Environment:** 金黃稻田、窄水泥農路、低矮農舍、遠山
- **Foreground:** 農路平整，少量稻葉位於道路外側
- **Midground:** 人物所在農路與田埂形成簡潔透視
- **Background:** 稻田、農舍、遠山層層退遠
- **Lighting:** 柔和晨光從側後方照亮稻穗，人物臉部保留填光
- **Color/Tone:** muted gold / green-brown / pale blue
- **Atmosphere:** 平和、溫暖、鄉間寧靜
- **Environmental Storytelling:** 小型灌溉水道與農舍提供真實尺度
- **Character Separation:** 稻田高度低於腰部，遠山作乾淨背景
- **Hand/Foot Clearance:** 手部後方以田野或天空為主；道路無雜物
- **Scene-specific Constraints:** 不加入大量稻草人、紅色花海等非必要裝飾
- **Dependencies from Character/Clothing:** 背景暖色較強，服裝需保留輪廓與對比
- **Notes for Pose/Camera:** 適合全身直式構圖，強調鄉間縱深

### S14 — 現代美術館白色展廳・秋季陰天
- **Location:** 現代美術館的白色主展廳
- **Region:** Taiwan
- **Season:** Autumn
- **Weather:** overcast outside
- **Time:** afternoon
- **Environment:** 白色牆面、淺灰水泥地、天窗、少量大型抽象裝置
- **Foreground:** 一件遠離人物的低對比展品邊角
- **Midground:** 寬闊空間與人物
- **Background:** 幾何牆面與天窗形成簡潔建築線條
- **Lighting:** 天窗漫射光＋弱均勻室內補光，無硬陰影
- **Color/Tone:** white / pale gray / restrained blue accent
- **Atmosphere:** 極簡、優雅、安靜
- **Environmental Storytelling:** 以空間尺度與少量展品傳達美術館，不靠文字
- **Character Separation:** 大面積單色牆面提供臉部、手部與服裝負空間
- **Hand/Foot Clearance:** 地面清楚，展品不靠近手腳
- **Scene-specific Constraints:** 不使用密集藝術品、文字牆或品牌 Logo
- **Dependencies from Character/Clothing:** 特別適合檢驗不同服裝色彩與輪廓
- **Notes for Pose/Camera:** 可支援直式全身或橫式環境人像

### S15 — 高級飯店室內泳池休憩區・冬季白天
- **Location:** 高級飯店室內泳池旁休憩空間
- **Region:** Taiwan
- **Season:** Winter
- **Weather:** rainy outside
- **Time:** daytime
- **Environment:** 淺色石材、水面、大片窗戶、木質休憩平台、少量觀葉植物
- **Foreground:** 水面反光或低矮植物作柔和前景
- **Midground:** 乾燥休憩平台與人物活動區，遠離泳池邊緣
- **Background:** 落地窗外的陰雨城市／山景，室內保持溫暖
- **Lighting:** 窗外冷色漫射光＋室內暖白光平衡
- **Color/Tone:** cream / pale blue / warm wood / cool gray
- **Atmosphere:** 豪華、舒適、靜謐
- **Environmental Storytelling:** 毛巾與休憩椅少量配置，不形成雜亂
- **Character Separation:** 水面與人物之間保留完整乾燥地帶；玻璃框線避開臉部
- **Hand/Foot Clearance:** 不讓泳池邊緣、椅腳或水面反光製造額外腿部錯覺
- **Scene-specific Constraints:** 不讓人物站在濕滑邊緣；避免泳池人群
- **Dependencies from Character/Clothing:** 可搭配正式、休閒或度假服裝，但服裝需與室內高級材質協調
- **Notes for Pose/Camera:** 適合中景與全身，提供不同於戶外的反射光環境

### S16 — 河畔玻璃溫室植物園・冬季午後
- **Location:** 植物園玻璃溫室內部步道
- **Region:** Taiwan
- **Season:** Winter
- **Weather:** overcast outside
- **Time:** afternoon
- **Environment:** 玻璃結構、熱帶／亞熱帶植物分層、石材步道、小型水池
- **Foreground:** 一兩片大葉作遠離人物的框景
- **Midground:** 寬闊石材步道與人物
- **Background:** 植物層次與玻璃天窗，深度清楚
- **Lighting:** 柔和頂光與側向自然光，綠色反射受控
- **Color/Tone:** deep green / glass gray / soft water blue
- **Atmosphere:** 清新、夢幻、濕潤但高級
- **Environmental Storytelling:** 植物標示可存在於遠景但不可成為可讀文字焦點
- **Character Separation:** 重要臉部區域後方選擇較均勻的玻璃光或暗綠背景
- **Hand/Foot Clearance:** 大葉與枝條不接觸手指；水池邊與腳部保持距離
- **Scene-specific Constraints:** 不做植物過度密集到吞沒人物；不使用誇張霓虹植物燈
- **Dependencies from Character/Clothing:** 深綠背景要求人物輪廓有足夠亮度分離
- **Notes for Pose/Camera:** 適合行走、站立、回望等簡單動作

### S17 — 雨後城市天橋下・夏季傍晚
- **Location:** 現代城市人行天橋下方的開放式廣場
- **Region:** Taiwan
- **Season:** Summer
- **Weather:** post-rain
- **Time:** dusk
- **Environment:** 濕潤石材、現代混凝土柱、玻璃天橋、少量街燈與綠化
- **Foreground:** 濕地反射保持低對比，不製造鏡像人物
- **Midground:** 廣場開放區，人物與柱體有明確距離
- **Background:** 天橋結構與遠處城市燈光
- **Lighting:** 天空藍調＋暖色街燈，人物受柔和 fill
- **Color/Tone:** blue-gray / warm amber / wet charcoal
- **Atmosphere:** 都市、浪漫、雨後清爽
- **Environmental Storytelling:** 雨後積水與亮起的街燈建立時間與天氣
- **Character Separation:** 柱體避開人物頭部與手腳；地面反射不複製肢體輪廓
- **Hand/Foot Clearance:** 手部附近不放欄杆、柱角或雨滴特效；腳下保持平整
- **Scene-specific Constraints:** 不使用車流或路人造成背景混亂；避免過度霓虹
- **Dependencies from Character/Clothing:** 深淺服裝均可，濕地反射需保持自然
- **Notes for Pose/Camera:** 適合 3/4 身、全身或簡單行走姿勢

### S18 — 湖畔草坡與木平台・夏季黃昏
- **Location:** 山間湖泊旁低矮草坡與木平台
- **Region:** Taiwan
- **Season:** Summer
- **Weather:** clear
- **Time:** sunset / early dusk
- **Environment:** 平靜湖面、木平台、草坡、遠山與天空
- **Foreground:** 少量柔軟草葉，避開腳部
- **Midground:** 木平台與人物所在草坡
- **Background:** 湖面與遠山形成大面積開放背景
- **Lighting:** 柔和夕陽側光，湖面反射提供 fill
- **Color/Tone:** lake blue / warm cream / soft green
- **Atmosphere:** 浪漫、平靜、夢幻
- **Environmental Storytelling:** 木平台與湖岸自然關係清楚，不加入大量道具
- **Character Separation:** 背景以湖天為主，避免枝葉貼近頭部
- **Hand/Foot Clearance:** 平台邊緣與腳部保持安全距離；草坡不覆蓋鞋面
- **Scene-specific Constraints:** 不讓人物靠近陡峭湖岸；不添加煙霧、粒子等強效果
- **Dependencies from Character/Clothing:** 水藍與米白服裝可自然融入，但背景仍保留輪廓對比
- **Notes for Pose/Camera:** 適合坐姿或站姿的後續設計，但 Scene 不鎖定姿勢

### S19 — 小型陶藝工作室・春季陰天
- **Location:** 有天窗的獨立陶藝工作室
- **Region:** Taiwan
- **Season:** Spring
- **Weather:** overcast
- **Time:** late morning
- **Environment:** 淺灰水泥牆、木質工作桌、陶土作品、工具架、天窗
- **Foreground:** 一小段工作桌邊緣或模糊陶器
- **Midground:** 人物所在乾淨活動區
- **Background:** 陶藝作品架與工作空間，物件有規律間距
- **Lighting:** 天窗漫射自然光＋側面柔和工作燈
- **Color/Tone:** warm gray / terracotta / cream / muted blue
- **Atmosphere:** 溫暖、文藝、真實、安靜
- **Environmental Storytelling:** 少量半成品陶器、木工具與工作痕跡建立職人空間
- **Character Separation:** 陶器架不靠近人物頭部；背景細節降低對比
- **Hand/Foot Clearance:** 工具與桌角不靠近手部；地面保持無雜物區
- **Scene-specific Constraints:** 不讓小工具、線材、細繩大量散落；避免手部與道具重疊
- **Dependencies from Character/Clothing:** 服裝若含細節需避免與陶器架產生視覺混淆
- **Notes for Pose/Camera:** 可供簡單站立、觀察物件或走動構圖，不指定手部操作

### S20 — 海邊高級旅館庭院夜景・夏季夜晚
- **Location:** 面海高級旅館的開放式庭院與觀景平台
- **Region:** Taiwan
- **Season:** Summer
- **Weather:** clear night
- **Time:** night
- **Environment:** 米白石材平台、低矮景觀植栽、遠方海面、少量暖色庭院燈、深色天空
- **Foreground:** 少量低矮葉片與一盞遠離人物的地燈
- **Midground:** 寬闊石材平台與人物活動區
- **Background:** 深藍海面、遠方微弱海岸燈火與夜空
- **Lighting:** 暖色庭院燈作側前方 key，柔和冷色月光／天空光作 fill，陰影保持細膩
- **Color/Tone:** deep navy / warm ivory / muted water blue
- **Atmosphere:** 高級、浪漫、寧靜、夢幻但寫實
- **Environmental Storytelling:** 海景與旅館庭院材質本身提供敘事，不堆疊度假裝飾
- **Character Separation:** 人物頭部後方保持較均勻深藍天空或遠海；暖燈不直接打爆臉部
- **Hand/Foot Clearance:** 地燈與植栽避開手腳；石材地面保持清楚且不產生多重影子
- **Scene-specific Constraints:** 不加入霓虹、煙霧、漂浮粒子、過量星星；夜景仍須保留人物身份可辨識度
- **Dependencies from Character/Clothing:** 深色環境需確保人物臉部、頭髮輪廓與服裝邊界清楚
- **Notes for Pose/Camera:** 適合夜間全身或 3/4 身資料，作為第一輪夜景環境代表

## Diversity / Coverage Check

- **Urban / civic / commercial:** S01, S02, S05, S06, S14, S17
- **Rural / agricultural:** S07, S13
- **Natural landscape / water:** S03, S04, S08, S09, S10, S18
- **Japanese regional environments:** S11, S12, S13
- **Interior:** S05, S06, S14, S15, S16, S19
- **Hybrid / transitional:** S01, S02, S11, S12, S17, S18, S20
- **Spring:** S01, S02, S03, S05, S07, S11, S19
- **Summer:** S04, S06, S08, S12, S15, S17, S18, S20
- **Autumn:** S09, S10, S13, S14
- **Winter:** S15, S16
- **Morning / early day:** S01, S02, S04, S07, S08, S13, S16, S19
- **Afternoon:** S05, S06, S09, S11, S14, S16
- **Golden hour / dusk / blue hour / night:** S03, S10, S12, S17, S18, S20
- **Weather diversity:** clear, partly cloudy, overcast, post-rain, light mist, coastal haze, rainy outside

## Self-QA Before Handoff

- 20 / 20 scene units structurally complete.
- No unit requires a specific character identity redesign.
- No unit copies MASTER_IMAGE composition, pose, clothing, background, or lighting.
- Scene backgrounds preserve negative space around face, hands, feet, hair silhouette, and clothing edges.
- Regional cues are kept coherent rather than mixed arbitrarily.
- Lighting and weather are physically coherent at the design level.
- Scene diversity is controlled; not every variable changes simultaneously.
- Scene units are modular and ready for ACCOUNT_05 Prompt integration.
- This is a design handoff, not a claim that final images have passed image-level QC.
