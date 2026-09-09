# T104 — POSE_CAMERA Handoff v1.0

- Account: ACCOUNT_04
- Task: T104 — POSE_CAMERA 姿勢與鏡位資料
- Target: 20 pose/camera design units
- Completed: 20 / 20
- PASS: 20
- REVIEW: 0
- REJECT: 0
- Status: PASS
- Purpose: 提供 ACCOUNT_05 可直接組合的第一輪姿勢、動作、人體工學、鏡位、景別與構圖設計單元。
- Identity reference: `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- Character source: T101 `01_CHARACTER/CHARACTER_SPEC.md` v1.1
- Style source: `WORKFLOW/STYLE_MASTER.md`
- Generation source: `00_MASTER/GENERATION_RULES.md`

## Handoff rules

1. MASTER_IMAGE 只用於確認 20 歲依娜莉亞的人物身份與外觀一致性，不複製其既有構圖、服裝、姿勢、背景、鏡位或畫風。
2. 本 handoff 只定義 Pose/Camera；服裝由 T102、場景由 T103、人物身份由 T101 決定。
3. 所有單元以人體穩定性與生成穩定性優先；不以高難度動作換取表面華麗度。
4. 每張最終圖必須維持合理重心、自然關節角度與可成立的支撐關係。
5. 手部優先採用自然垂放、輕放、輕握、扶持、放入口袋或簡單交疊等穩定方案；避免複雜手勢、手指張開展示、雙手在臉前交錯或大量細節穿過手指。
6. 每隻手固定五指、每隻腳固定五趾；若最終服裝穿鞋，仍不得出現鞋體穿模或異常足部。
7. 場景物件不得遮擋主要手部。若使用椅子、牆面、欄杆、包帶等接觸點，必須保持手腕與手掌關係清楚。
8. 不使用極端廣角、極端俯視、極端仰視或過度透視，以降低臉部與四肢比例失真。
9. 20 個單元刻意分散正面、3/4、側面、背側回望、靜態、步行、坐姿、輕靠、不同景別與不同鏡位；避免只更換手的位置形成近似重複。
10. PASS 代表本 T104 設計資料完成結構化交付，不代表尚未生成的最終圖片已通過 T106 圖片品質驗收。

## 20 Pose/Camera Design Units

### P01 — 正面自然站姿
- Pose: 雙腳自然分開約肩寬以下，重量平均分配，身體正面朝鏡頭。
- Hands: 雙臂自然垂放於身側，手掌略朝大腿，手指自然放鬆。
- Head/Gaze: 頭部自然正向，視線看鏡頭。
- Camera: 平視高度，標準焦段。
- Framing: 全身，直式 9:16。
- Stability: 最基礎身份與全身比例樣本；手腳輪廓清楚，不安排物件遮擋。

### P02 — 3/4 重心轉移站姿
- Pose: 身體轉向約 30–45 度，一腳承受主要重量，另一腳自然向前半步。
- Hands: 近鏡頭側手自然垂放；另一手輕放於腰側，不做複雜叉腰。
- Head/Gaze: 臉部回轉至鏡頭，保留清楚五官。
- Camera: 平視略偏側前方。
- Framing: 全身至 3/4 身，直式 9:16。
- Stability: 以骨盆與肩線輕微反向形成自然曲線，避免扭轉過度。

### P03 — 側身靜立回望
- Pose: 身體接近側面，雙腳前後自然排列，後腳穩定支撐。
- Hands: 雙手自然沿身體兩側垂放。
- Head/Gaze: 頭部輕微回轉看向鏡頭，不超過自然頸部舒適角度。
- Camera: 側前方平視。
- Framing: 全身，直式 9:16。
- Stability: 用身體方向與臉部方向差異增加多樣性，但不使用誇張扭腰。

### P04 — 輕步行側前方
- Pose: 平穩步行中的自然瞬間，前腳已接近承重，後腳離地幅度小。
- Hands: 兩臂依正常步態自然前後擺動，手指放鬆。
- Head/Gaze: 視線略向前方，不必直視鏡頭。
- Camera: 側前方跟拍感，平視。
- Framing: 全身，橫式 16:9。
- Stability: 選擇低動態步幅，避免奔跑、跨大步或裙擺造成肢體混亂。

### P05 — 正面緩步朝鏡頭
- Pose: 一腳穩定向前，另一腳自然跟進，身體保持直立。
- Hands: 雙臂自然低幅度擺動，不握複雜物件。
- Head/Gaze: 自然看向鏡頭或略高於鏡頭。
- Camera: 平視正前方，標準焦段。
- Framing: 全身，直式 9:16。
- Stability: 與 P04 的側向運動區隔，保持雙腿可辨識且不交叉遮擋。

### P06 — 雙手輕握於身前
- Pose: 自然站立，雙腳一前一後極小距離，重量主要落在後腳。
- Hands: 雙手在下腹前方輕鬆相握，手指自然重疊，不交錯成複雜手勢。
- Head/Gaze: 微笑或中性表情，正視鏡頭。
- Camera: 平視。
- Framing: 膝上至全身，直式 9:16。
- Stability: 手部集中於單一乾淨區域，避免背景雜物穿過手指。

### P07 — 一手放入口袋
- Pose: 身體 3/4 朝鏡頭，一腳承重，另一腳自然放鬆。
- Hands: 一手自然放入外套或褲裙可用口袋；另一手垂放。
- Head/Gaze: 臉部朝鏡頭，表情自然。
- Camera: 平視略偏側前方。
- Framing: 3/4 身至全身，橫式 16:9。
- Stability: 隱藏一隻手的複雜指節，同時保留另一隻手作清楚人體參考。

### P08 — 雙臂自然交疊
- Pose: 穩定站立，雙腳自然平行，重量平均。
- Hands: 前臂鬆弛交疊於胸下或上腹前，手掌自然貼於對側手臂，不露出誇張手指。
- Head/Gaze: 身體略 3/4，臉部看鏡頭。
- Camera: 平視。
- Framing: 半身至大腿中段，直式 9:16。
- Stability: 採鬆弛交疊，不壓迫肩膀、不做緊抱姿勢。

### P09 — 一手輕扶另一側手肘
- Pose: 身體正面略偏 15–20 度，雙腳穩定。
- Hands: 一前臂自然橫於腹前；另一手輕扶前臂靠近手肘處。
- Head/Gaze: 視線略偏鏡頭旁，再回到臉部可辨識角度。
- Camera: 平視，輕微 3/4 側前。
- Framing: 腰上中景，橫式 16:9。
- Stability: 手與手臂形成清楚接觸，不要求手指分離展示。

### P10 — 輕靠牆面
- Pose: 肩胛與上背輕靠平整牆面，雙腳仍完全承重；一腳可微向前。
- Hands: 雙手自然垂放，或其中一手輕放於大腿側。
- Head/Gaze: 頭部自然朝鏡頭或略向側方。
- Camera: 平視，略側前。
- Framing: 全身，直式 9:16。
- Stability: 牆面僅作背部接觸，不讓牆角、植物或裝飾遮擋手部。

### P11 — 低台階單腳上階
- Pose: 一腳踩在低且安全的單一台階上，另一腳平穩站地；身體保持直立。
- Hands: 靠近抬起腿的一手自然輕放於大腿上方；另一手垂放。
- Head/Gaze: 視線略向前方。
- Camera: 平視或略低於腰線，但不使用誇張仰視。
- Framing: 全身，直式 9:16。
- Stability: 台階高度低，避免高抬腿與大幅膝關節折疊。

### P12 — 坐姿正面，雙手置膝
- Pose: 坐在穩定椅面前緣或中央，背部自然直立，雙腳平放地面。
- Hands: 雙手平放於各自大腿或膝上，手指自然靠攏。
- Head/Gaze: 正視或略偏鏡頭。
- Camera: 平視，鏡頭高度接近上半身。
- Framing: 3/4 身，橫式 16:9。
- Stability: 對稱坐姿有利人體比例判讀；避免交叉腿造成下肢遮擋。

### P13 — 坐姿 3/4，腳踝自然靠近
- Pose: 坐在長椅或簡潔椅子上，身體轉約 30 度，雙腳同向，腳踝自然靠近。
- Hands: 一手放於大腿，另一手輕放在椅面旁。
- Head/Gaze: 臉部回向鏡頭。
- Camera: 側前方平視。
- Framing: 大腿以上至 3/4 身，直式 9:16。
- Stability: 手部各自有獨立乾淨位置，避免兩手重疊。

### P14 — 坐姿側向回望
- Pose: 坐姿身體接近側面，雙腳自然朝同一方向並穩定著地。
- Hands: 近鏡頭手放於大腿；另一手自然放於椅面。
- Head/Gaze: 頭部回轉看向鏡頭。
- Camera: 側前方，平視。
- Framing: 3/4 身，橫式 16:9。
- Stability: 與 P03 相同「身體與臉部不同方向」概念，但改為坐姿與不同支撐關係。

### P15 — 輕持單一包袋
- Pose: 自然站立，身體 3/4 朝鏡頭。
- Hands: 一手以簡單握持方式拿小型包袋提把或肩帶下端；另一手自然垂放。
- Head/Gaze: 自然看鏡頭。
- Camera: 平視。
- Framing: 大腿中段至全身，直式 9:16。
- Stability: 包袋為單一清楚物件；提把不穿過多根手指，不使用多條細繩。

### P16 — 身體前傾極小幅度的迎向鏡頭
- Pose: 自然站立後從髖部做非常小幅度前傾，雙腳保持穩定，非深彎腰。
- Hands: 雙手自然放在大腿外側附近，不壓在膝蓋。
- Head/Gaze: 視線直接看鏡頭，形成較親近的互動感。
- Camera: 平視。
- Framing: 腰上中近景，橫式 16:9。
- Stability: 前傾幅度低，避免臉部透視與背部曲線失真。

### P17 — 斜向前行、回頭微笑
- Pose: 身體沿畫面對角線緩步前行，步幅小；上半身保持自然。
- Hands: 兩臂隨步態低幅度擺動。
- Head/Gaze: 頭部輕微回向鏡頭。
- Camera: 後側偏前可見臉部的 3/4 跟拍角度，不使用真正背面主視圖。
- Framing: 全身，橫式 16:9。
- Stability: 人物臉部必須仍可辨識；不以背面取代身份資訊。

### P18 — 欄杆旁輕扶
- Pose: 自然站立於欄杆旁，雙腳穩定，一腳略前。
- Hands: 一手輕放於寬而平整的欄杆頂部，另一手自然垂放。
- Head/Gaze: 身體略 3/4，臉部看鏡頭或遠方。
- Camera: 側前方平視。
- Framing: 全身或 3/4 身，直式 9:16。
- Stability: 只使用單一寬欄杆，避免細密柵欄穿過手指或遮擋手掌。

### P19 — 微低鏡位的穩定站姿
- Pose: 雙腳自然分開，重量平均，身體 3/4。
- Hands: 一手自然垂放，另一手輕放於外套或裙褲側縫附近。
- Head/Gaze: 視線略低向鏡頭。
- Camera: 比眼睛低少量的自然低鏡位，標準至中長焦，禁止極端仰拍。
- Framing: 全身，直式 9:16。
- Stability: 以小幅鏡位差提供視角多樣性，不犧牲臉部與腿部比例。

### P20 — 高機位半身回轉
- Pose: 穩定站立，身體略轉向一側，肩線自然。
- Hands: 畫面內可見的一手自然垂放；另一手可放在身後但不得產生多餘肢體錯覺。
- Head/Gaze: 臉部向上微看鏡頭。
- Camera: 輕微高於眼睛的自然高機位，不使用俯拍變形。
- Framing: 胸上至腰上中近景，橫式 16:9。
- Stability: 以鏡位與景別補足資料多樣性，保留清楚臉部與至少一側自然肩頸關係。

## Diversity Coverage Summary

- Static standing: P01, P02, P03, P06, P07, P08, P09, P10, P15, P16, P18, P19, P20
- Walking / directional movement: P04, P05, P17
- Step interaction: P11
- Seated: P12, P13, P14
- Front / near-front: P01, P05, P06, P12, P16
- 3/4 orientation: P02, P07, P08, P10, P15, P18, P19, P20
- Side-oriented: P03, P04, P14
- Back-side return with visible face: P17 only; no back-facing primary composition
- Full body: P01, P02, P03, P04, P05, P10, P11, P17, P19
- 3/4 body: P07, P12, P13, P14, P15, P18
- Medium / close identity-supporting framing: P08, P09, P16, P20
- Eye-level camera: majority
- Slight low camera: P11, P19
- Slight high camera: P20
- Vertical 9:16: P01, P02, P03, P05, P06, P08, P10, P11, P13, P15, P18, P19
- Horizontal 16:9: P04, P07, P09, P12, P14, P16, P17, P20
- Hand-stability strategies: natural side placement, simple lap placement, simple forearm support, pocket placement, single wide support surface, single simple bag handle
- Intentional exclusions: acrobatic balance, jumping, running, deep squatting, extreme backbend, crossed/entangled arms, hands directly in front of face, finger-spread display poses, complex sign gestures, extreme foreshortening, extreme wide-angle distortion, back-facing identity samples.

## ACCOUNT_05 Integration Notes

1. Select one Pxx unit for each final Prompt Package and preserve its core body orientation, action, hand placement, camera height, framing and aspect ratio.
2. Clothing from T102 must not force a pose that breaks the Pxx ergonomic logic. If a clothing unit lacks a pocket, do not use P07 unchanged; select another Pxx or explicitly adapt the hand to a stable equivalent.
3. Scene from T103 may supply a chair, wall, low step or wide rail only when compatible with the selected Pxx; do not add an object merely to decorate the pose.
4. Do not place busy flowers, foliage, props, water splashes, text or small architectural details across the hands.
5. Keep Character / Clothing / Scene / Pose-Camera / Lighting-Style / Negative sections modular.
6. Final generated images must still pass `WORKFLOW/QUALITY_CONTROL.md`; this handoff's PASS status does not replace T106 final image review.
