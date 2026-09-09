# T105 — PROMPT PACKAGE Handoff v1.0

- Account: ACCOUNT_05
- Task: T105 — PROMPT 提示詞資料
- Target: 20 Prompt Packages
- Completed: 20 / 20
- Status: PASS
- Upstream: T101 Character v1.1 + T102 Clothing v1.0 + T103 Scene v1.0 + T104 Pose/Camera v1.0
- Identity trigger: `inr20`
- Identity reference: `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- Prompt spec: `05_PROMPT/PROMPT_SPEC.md` v002
- Generation authority: `00_MASTER/GENERATION_RULES.md`
- Style authority: `WORKFLOW/STYLE_MASTER.md`

## Common Character Module
`inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, subtle natural expression`

## Common Style Module
`romantic, refined high-end beauty, dreamy Japanese airy aesthetic, delicate natural light and shadow, naturally luminous skin, realistic natural texture, believable materials, clean detailed rendering, ultra-clear, ultra-high-resolution, 8K-quality detail, restrained contrast`

## Common Negative Module
`different person, identity drift, wrong face shape, distorted facial features, severe facial asymmetry, wrong age appearance, wrong hair color, deformed hands, extra fingers, missing fingers, fused fingers, duplicated fingers, elongated fingers, malformed feet, extra toes, missing toes, fused toes, duplicated toes, extra limbs, missing limbs, malformed anatomy, impossible joints, unnatural limb angles, severe body-proportion distortion, plastic-looking skin, excessive facial smoothing, exaggerated makeup, low quality, blur, noisy rendering, severe artifacts, over-processed AI appearance, text, watermark, logo, unrelated people, unwanted objects, extreme wide-angle distortion, extreme foreshortening, busy effects around hands or feet`

All packages below are modular `Character + Clothing + Scene + Pose/Camera + Lighting/Style + Negative`. The 20 packages use one approved Cxx, Sxx and Pxx each, with deliberate one-to-one coverage. Hairstyle is a permitted identity-preserving variation; dark blue-black hair color remains locked. The 95–99% identity recognizability target is applied as a production objective, without inventing permanent facial measurements.

---

## PP01 — C01 / S01 / P01
**Character:** Common Character Module; long loose hair, natural center part.
**Clothing:** C01 ivory lightweight long-sleeve shirt, lavender high-waist pleated midi skirt, cream low-heel loafers, small lavender shoulder bag, silver studs, slim watch.
**Scene:** S01 Taipei high-rise terrace, spring early morning, clear with very light haze, pale-gray stone, low glass railing, sparse greenery, distant skyline/mountains, soft side-front morning light.
**Pose/Camera:** P01 front natural standing, feet naturally separated below shoulder width, even weight, arms relaxed at sides, gaze to camera, eye-level standard lens, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, long loose dark blue-black hair with center part, ivory lightweight long-sleeve shirt, lavender pleated midi skirt, cream low-heel loafers, small lavender shoulder bag, silver stud earrings, slim watch, modern Taipei high-rise terrace in spring early morning, very light haze, pale-gray stone, low glass railing, sparse greenery, distant skyline and mountains, soft side-front morning light, front natural standing pose, feet naturally separated, arms relaxed at sides, gaze to camera, eye-level standard lens, full body, vertical 9:16, clean negative space around face hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, naturally luminous skin, realistic natural texture, ultra-clear, ultra-high-resolution, restrained contrast.`
**Negative:** Common Negative Module + `skyline behind head, railing crossing hands, terrace clutter, crowds, dense signage`.

## PP02 — C02 / S02 / P02
**Character:** Common Character Module; low ponytail, natural side part.
**Clothing:** C02 water-blue fine-knit short-sleeve top, beige high-waist A-line long skirt, light-brown round-toe ballet flats, ivory small crossbody bag, pearl studs.
**Scene:** S02 Taiwanese historic street lane, spring morning after rain, wet stone paving, old facades, simple arcade, sparse plants, soft reflected light.
**Pose/Camera:** P02 30–45° three-quarter standing, one leg bearing weight, other half-step forward, near hand relaxed, other lightly at waist, face toward camera, eye-level slight front-side, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, low ponytail with side part, water-blue fine-knit short-sleeve top, beige A-line long skirt, light-brown ballet flats, ivory small crossbody bag, pearl studs, Taiwanese historic street lane after spring rain, wet stone paving, old low-rise facades, wooden windows, simple arcade, sparse plants, soft post-rain reflected light, three-quarter standing pose, one leg bearing weight, other naturally half-step forward, one hand relaxed at side, other lightly at waist, face toward camera, eye-level slight front-side camera, full body, vertical 9:16, clean wall and lane negative space around hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic natural texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `doorframes or wires crossing hair, debris across feet, readable shop signs, vehicles, unrelated people`.

## PP03 — C03 / S03 / P04
**Character:** Common Character Module; high ponytail with softly curved ends.
**Clothing:** C03 blush-pink airy short-sleeve blouse, dark denim high-waist straight jeans, white low-top canvas sneakers, navy canvas tote, thin silver necklace, simple ring.
**Scene:** S03 Tamsui riverside path, spring golden hour, partly cloudy, broad river, low grass, clean path, distant bridge and city, warm side-backlight with facial fill.
**Pose/Camera:** P04 low-dynamic side-front walking moment, front foot nearing support, rear foot only slightly lifted, natural arm swing, eye-level tracking feel, full body, 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, high ponytail with softly curved ends, blush-pink airy blouse, dark denim straight jeans, white canvas sneakers, navy canvas tote, thin silver necklace, simple ring, Tamsui riverside path in spring golden hour, partly cloudy sky, broad river, low grass, clean path, distant bridge beside subject, distant city silhouette, warm side-back sunlight with soft facial fill, low-dynamic natural walking pose, front foot nearing support, rear foot only slightly lifted, natural low-amplitude arm swing, eye-level side-front tracking camera, full body, horizontal 16:9, clean negative space around hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic natural texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `bridge crossing head, face blackout, crowds, grass covering shoes, running stride, strong flare`.

## PP04 — C04 / S05 / P10
**Character:** Common Character Module; half-up long hair with loose lengths.
**Clothing:** C04 white T-shirt, light-gray lightweight short trench jacket, water-blue high-waist cropped wide-leg pants, white casual sneakers, gray-blue crossbody bag, slim watch.
**Scene:** S05 premium independent bookstore cafe, spring afternoon, overcast outside, light wood shelves, ivory walls, sparse greenery, diffuse window light and subtle warm interior light.
**Pose/Camera:** P10 lightly leaning against flat wall, both feet fully supporting, one foot slightly forward, arms relaxed, eye-level slightly front-side, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, half-up long dark blue-black hair with loose lengths, white cotton T-shirt, light-gray short trench jacket, water-blue cropped wide-leg pants, white casual sneakers, gray-blue crossbody bag, slim watch, premium independent bookstore cafe in spring afternoon, overcast daylight, light wood shelves, ivory walls, sparse greenery, clean activity area, diffuse window light with subtle warm interior light, lightly leaning against flat wall, both feet weight-bearing, one foot slightly forward, arms relaxed, eye-level slightly front-side camera, full body, vertical 9:16, shelves and furniture kept away from face hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic natural texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `bookshelves crossing face or limbs, readable book covers, other customers, cluttered tables`.

## PP05 — C05 / S04 / P05
**Character:** Common Character Module; low ponytail with softly curved ends.
**Clothing:** C05 butter-cream sleeveless top, pale-blue high-waist midi A-line skirt, beige low-heel lace-up shoes, cream shoulder bag, small pale-gold earrings.
**Scene:** S04 modern harbor waterfront promenade, summer morning, clear with light coastal haze, pale paving, simple railing, sea, distant harbor and low skyline, soft bright coastal light.
**Pose/Camera:** P05 natural walk toward camera, upright, one foot forward and stable, other following, low-amplitude arm swing, eye-level front standard lens, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, low ponytail with softly curved ends, butter-cream sleeveless top, pale-blue high-waist A-line midi skirt, beige low-heel lace-up shoes, cream shoulder bag, pale-gold earrings, modern Taiwan harbor waterfront promenade in summer morning, clear light coastal haze, pale paving, simple railing, open sea, distant harbor facilities and low skyline, bright soft coastal light, natural walk toward camera, upright body, stable forward foot, low-amplitude arm swing, eye-level front camera, full body, vertical 9:16, open sea-sky negative space, romantic refined high-end beauty, dreamy Japanese airy aesthetic, naturally luminous skin, realistic natural texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `railing crossing hands, tropical resort clutter, palms, neon signs, overexposure, exaggerated stride`.

## PP06 — C06 / S14 / P09
**Character:** Common Character Module; long loose hair, side part.
**Clothing:** C06 white breathable short-sleeve shirt, navy high-waist straight trousers, light-gray loafers, navy work tote, silver watch, simple studs.
**Scene:** S14 modern museum white exhibition hall, autumn overcast afternoon, white walls, pale-gray concrete, skylight, sparse abstract installations, diffuse even light.
**Pose/Camera:** P09 torso 15–20° off front, one forearm across abdomen, other hand lightly supporting near elbow, stable feet, eye-level slight 3/4 side-front, waist-up, 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, long loose side-parted dark blue-black hair, white breathable short-sleeve shirt, navy straight trousers, light-gray loafers, navy work tote, silver watch, simple studs, modern museum white exhibition hall in autumn afternoon, overcast outside, white walls, pale-gray floor, skylight, sparse installations away from subject, diffuse even light, torso slightly off front, forearm resting naturally across abdomen, opposite hand lightly supporting near elbow, stable feet, eye-level slight 3/4 side-front camera, waist-up framing, horizontal 16:9, broad clean wall space around face and hands, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `art installations overlapping body, text walls, logos, crowded gallery, finger-spread gesture, distorted perspective`.

## PP07 — C07 / S08 / P15
**Character:** Common Character Module; high ponytail, smooth base, loose ends.
**Clothing:** C07 light-gray sleeveless top with wide stable straps, medium-blue denim A-line midi skirt, white platform canvas sneakers, ivory canvas shoulder bag, optional blue hair tie.
**Scene:** S08 east-coast Taiwan coastal observation path, summer late morning, clear, gravel shore, low wind-tolerant plants, blue bay and distant rocky coast, bright natural side light.
**Pose/Camera:** P15 3/4 standing, one hand simply holding a single bag handle/lower strap end, other relaxed, eye-level, thigh-to-full-body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, high ponytail with smooth base and loose ends, light-gray sleeveless top with wide straps, medium-blue denim A-line midi skirt, white platform canvas sneakers, ivory canvas shoulder bag with one clear handle, small blue hair tie, east-coast Taiwan coastal observation path in summer late morning, clear sky, gravel shore, sparse low coastal plants, stable viewing platform, blue bay and distant rocky coast, bright natural side light with sea-reflected fill, 3/4 standing pose, one hand simply holding bag handle, other relaxed at side, eye-level camera, thigh-to-full-body framing, vertical 9:16, clean sea-sky negative space, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic natural texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `cliff danger, plants touching fingers, gravel around ankles, strap crossing fingers, waves obscuring feet`.

## PP08 — C08 / S18 / P12
**Character:** Common Character Module; long loose soft waves.
**Clothing:** C08 pale-blue short-sleeve A-line dress, lightly fitted waist, below-knee to upper-calf hem, light-brown woven flat sandals, straw shoulder bag, narrow woven belt, small gold earrings.
**Scene:** S18 mountain lake grassy slope and wood platform, summer sunset/early dusk, clear, calm lake, distant mountains, soft side sunset light with lake fill.
**Pose/Camera:** P12 front seated, back naturally upright, both feet flat, hands on respective knees/thighs, eye-level, 3/4 body, 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, long loose soft waves, pale-blue short-sleeve A-line dress, light-brown woven flat sandals, straw shoulder bag beside seat, narrow woven belt, small gold earrings, mountain lake grassy slope and wooden platform in summer sunset to early dusk, clear weather, calm lake, distant mountains and open sky, soft side sunset light with lake fill, seated upright on stable simple seat, both feet flat, hands naturally resting on respective knees, fingers naturally close together, eye-level camera, three-quarter body, horizontal 16:9, open lake-sky negative space, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `steep lake edge, crossed legs, floating feet, dense grass over feet, hands hidden behind body, excessive flare`.

## PP09 — C09 / S07 / P03
**Character:** Common Character Module; low ponytail, natural side part.
**Clothing:** C09 ivory linen short-sleeve top, olive high-waist wide-leg trousers, ivory sandals, small brown leather crossbody bag, slim wooden bracelet.
**Scene:** S07 Alishan tea plantation slope, spring early morning, light mist, terraced tea rows, earth-stone path, layered mountains, diffuse morning light.
**Pose/Camera:** P03 near side-profile standing, feet naturally front/back, rear foot stable, both hands relaxed, head gently turned toward camera, eye-level side-front, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, low ponytail with side part, ivory linen short-sleeve top, olive wide-leg trousers, ivory sandals, small brown leather crossbody bag, wooden bracelet, Alishan tea plantation slope and path in spring early morning, light mist, orderly tea rows, layered mountains, diffuse morning light, near side-profile standing pose, feet naturally front and back with rear foot stable, hands relaxed at sides, head gently turned to camera, eye-level side-front camera, full body, vertical 9:16, clean path around feet and low tea bushes below hand level, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `mist covering face, tea branches touching hands, unrelated blossoms, dense foliage, unstable footing, extreme twist`.

## PP10 — C10 / S19 / P06
**Character:** Common Character Module; simple side ponytail.
**Clothing:** C10 lavender fine-knit short-sleeve top, white high-waist straight cropped trousers, light-gray rounded low heels, lavender shoulder bag, pearl studs, thin silver bracelet.
**Scene:** S19 independent pottery studio, spring late morning, overcast, concrete walls, wooden worktables, ceramics, tool racks, skylight, warm-gray/terracotta accents.
**Pose/Camera:** P06 natural standing, feet slightly staggered and stable, both hands lightly clasped at lower abdomen with naturally overlapping fingers, eye-level, knee-up to full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, simple side ponytail, lavender fine-knit short-sleeve top, white cropped straight trousers, light-gray low heels, lavender shoulder bag at side, pearl studs, thin silver bracelet, independent pottery studio with skylight in spring late morning, overcast weather, light-gray concrete walls, wooden worktables, neatly spaced ceramics and limited tool racks, diffuse skylight and soft work light, stable standing pose, feet slightly staggered, hands lightly clasped at lower abdomen, fingers naturally overlapping, eye-level camera, knee-up to full-body vertical 9:16, tools and furniture away from hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `tools overlapping fingers, loose cords, cluttered workbench, ceramics covering hands, readable labels`.

## PP11 — C11 / S06 / P17
**Character:** Common Character Module; high ponytail with softly curved ends.
**Clothing:** C11 water-blue sleeveless top, white lightweight open long-sleeve shirt, white high-waist wide-leg trousers, pale-blue low-top casual shoes, navy shoulder bag, thin silver necklace, simple studs.
**Scene:** S06 luxury hotel glass atrium/indoor garden, summer afternoon, ivory stone, tall glass skylight, sparse large foliage, small controlled water feature, diffuse daylight.
**Pose/Camera:** P17 small-step diagonal forward walk, natural upper body, low-amplitude arm swing, head gently turning toward camera, rear-side 3/4 tracking, full body, 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, high ponytail with softly curved ends, water-blue sleeveless top, white lightweight open long-sleeve shirt, white wide-leg trousers, pale-blue casual shoes, navy shoulder bag, thin silver necklace, simple studs, luxury modern hotel glass atrium in summer afternoon, ivory stone, tall glass skylight, sparse foliage, small water feature at safe distance, diffuse natural daylight, diagonal forward walking with small stable steps, low-amplitude arm swing, head gently turning toward camera, rear-side three-quarter tracking camera, full body, horizontal 16:9, clean floor and architecture around hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `foliage covering hands, water feature near feet, glass lines through face, exaggerated turn, back-facing composition, crowds`.

## PP12 — C12 / S17 / P10
**Character:** Common Character Module; long loose straight hair, side part.
**Clothing:** C12 khaki short lightweight jacket, black cotton T-shirt, cream high-waist straight trousers, black low-heel loafers, dark-brown leather shoulder bag, slim metal watch.
**Scene:** S17 modern city pedestrian-bridge underpass plaza, summer dusk after rain, wet stone, concrete columns, glass bridge, sparse lamps and greenery, blue-gray sky with restrained warm light.
**Pose/Camera:** P10 lightly leaning against flat structural surface, feet fully supporting, one slightly forward, arms relaxed, eye-level slightly front-side, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, long loose straight side-parted hair, khaki short lightweight jacket, black T-shirt, cream straight trousers, black low-heel loafers, dark-brown shoulder bag, slim watch, modern city pedestrian-bridge underpass plaza in summer dusk after rain, wet stone, concrete columns and glass bridge kept clear of subject, sparse streetlights and greenery, blue-gray sky with restrained warm amber light, soft face fill, lightly leaning against flat structure, both feet weight-bearing, one foot slightly forward, arms relaxed, eye-level slightly front-side camera, full body vertical 9:16, clean negative space around hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `columns crossing body, mirror-like reflections, neon overload, rain effects around fingers, traffic crowds, heavy blue grading`.

## PP13 — C13 / S09 / P19
**Character:** Common Character Module; simple low bun with a few loose strands.
**Clothing:** C13 burgundy fine-knit long-sleeve top, taupe-brown straight midi skirt, dark-brown low-heel ankle boots, milk-tea shoulder bag, small gold studs.
**Scene:** S09 low-mountain forest park wooden boardwalk, autumn afternoon, partly cloudy, evergreen and seasonal leaves, sparse ferns, soft controlled dappled light.
**Pose/Camera:** P19 stable 3/4 standing, feet naturally apart, even weight, one hand relaxed, other near side seam, slightly low natural camera, standard-to-medium telephoto, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, low bun with a few natural loose strands, burgundy fine-knit long-sleeve top, taupe-brown straight midi skirt, dark-brown low-heel ankle boots, milk-tea shoulder bag, gold studs, low-mountain forest park wooden boardwalk in autumn afternoon, partly cloudy, evergreen and limited seasonal foliage, sparse ferns, soft controlled dappled light, stable three-quarter standing pose, feet naturally apart, even weight, one hand relaxed at side, other near outer garment seam, slightly low natural camera, standard-to-medium telephoto perspective, full body vertical 9:16, clean boardwalk around feet, tree trunks kept away from face and limbs, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `tree trunks crossing head or limbs, harsh facial spots, dense vines, extreme low angle, muddy boardwalk, leaves covering boots`.

## PP14 — C14 / S13 / P08
**Character:** Common Character Module; half-up long hair with loose lengths.
**Clothing:** C14 oatmeal long-sleeve shirt, dark forest-green thin knit vest, dark green fine-pleated long skirt, dark-brown loafers, brown tote, amber earrings.
**Scene:** S13 Japanese rural rice-field lane, early autumn early morning, clear with light haze, golden rice fields, flat farm road, low farmhouse, distant mountains, soft side-back light with facial fill.
**Pose/Camera:** P08 stable standing, feet parallel, even weight, forearms loosely overlapped below chest/upper abdomen, eye-level, half-body to mid-thigh, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, half-up long hair with loose lengths, oatmeal long-sleeve shirt, forest-green thin knit vest, dark green pleated long skirt, dark-brown loafers, brown tote, amber earrings, Japanese rural rice-field lane in early autumn early morning, golden rice fields, flat farm road, low farmhouse, distant mountains, soft side-back morning light with facial fill, stable standing pose, feet parallel, even weight, forearms loosely overlapped below chest, hands relaxed without finger display, eye-level camera, half-body to mid-thigh, vertical 9:16, clean road and open field negative space, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `rice covering hands, dense props, oversized rural decorations, tight crossed arms, readable farm signs`.

## PP15 — C15 / S15 / P14
**Character:** Common Character Module; long loose soft waves, side part.
**Clothing:** C15 deep navy long-sleeve A-line midi dress, gray short knit cardigan, black round-toe low heels, gray-blue small crossbody bag, silver studs.
**Scene:** S15 luxury hotel indoor pool relaxation area, winter daytime, rain outside, pale stone, water, large windows, warm wood deck, sparse foliage, balanced cool window light and warm indoor light.
**Pose/Camera:** P14 seated side-oriented, feet same direction and grounded, near hand on thigh, other on seat, head turned toward camera, eye-level side-front, 3/4 body, 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, long loose soft waves with side part, deep navy long-sleeve A-line midi dress, gray short knit cardigan, black round-toe low heels, gray-blue small crossbody bag, silver studs, luxury hotel indoor pool relaxation area in winter daytime, rain outside, pale stone, calm water, large windows, warm wood deck, sparse foliage, dry activity area away from pool edge, balanced cool window light and warm indoor light, seated side-oriented pose, both feet grounded same direction, near hand on thigh, other on seat, head turned naturally toward camera, eye-level side-front camera, three-quarter body, horizontal 16:9, clear floor around hands and feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `pool edge touching feet, wet floor around shoes, reflections creating extra legs, glass frame through face, other swimmers`.

## PP16 — C16 / S16 / P20
**Character:** Common Character Module; simple low ponytail.
**Clothing:** C16 cream medium-weight turtleneck knit sweater, caramel A-line long skirt, dark-brown ankle boots, milk-tea leather shoulder bag, small gold earrings.
**Scene:** S16 glass greenhouse botanical garden, winter afternoon, overcast outside, clean stone path, controlled subtropical foliage, glass skylight, small water pool at safe distance, controlled green reflections.
**Pose/Camera:** P20 stable standing, body slightly turned, one visible hand naturally at side, other behind body without extra-limb illusion, face slightly upward, natural high camera, chest-to-waist 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, simple low ponytail, cream turtleneck knit sweater, caramel A-line long skirt, dark-brown ankle boots, milk-tea leather shoulder bag, small gold earrings, glass greenhouse botanical garden in winter afternoon, overcast outside, clean stone path, controlled subtropical foliage, glass skylight, small water pool at safe distance, soft top and side natural light with controlled green reflections, stable standing pose with body slightly turned, one visible hand relaxed at side, other behind body without extra-limb illusion, face slightly upward toward camera, natural high camera slightly above eye level, chest-to-waist medium close framing, horizontal 16:9, relatively uniform background around face and visible hand, romantic refined high-end beauty, dreamy Japanese airy aesthetic, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `dense foliage swallowing body, leaves touching fingers, water near feet, extreme overhead view, green cast overpowering skin, extra-arm illusion`.

## PP17 — C17 / S10 / P02
**Character:** Common Character Module; side-part long loose hair.
**Clothing:** C17 light-gray knit cardigan, water-blue long-sleeve shirt, navy high-waist wide-leg trousers, dark-gray low-heel loafers, thin gray socks, navy work bag, silver watch.
**Scene:** S10 mountain-town observation platform, autumn blue hour after rain, dark stone, simple railing, warm distant town lights, mountain silhouettes, restrained cool sky and warm fill.
**Pose/Camera:** P02 30–45° three-quarter standing, one leg bearing weight, other half-step forward, near hand relaxed, other lightly at waist, eye-level slight front-side, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, side-part long loose hair, light-gray knit cardigan, water-blue long-sleeve shirt, navy wide-leg trousers, dark-gray low-heel loafers, thin gray socks, navy work bag, silver watch, mountain-town observation platform in autumn blue hour after rain, dark stone, simple railing away from hands, distant warm town lights, mountain silhouettes, restrained cool sky light and warm ambient fill, three-quarter standing pose, one leg bearing weight, other half-step forward, near hand relaxed, other lightly at waist, eye-level slight front-side camera, full body vertical 9:16, head separated against uniform sky/mountain background, clean platform around feet, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `railing crossing hands, over-dark face, excessive blue saturation, neon signs, heavy fog, extreme perspective`.

## PP18 — C18 / S20 / P01
**Character:** Common Character Module; long loose soft waves, natural center part.
**Clothing:** C18 blue-gray short wool coat, ivory knit top and straight midi knit skirt, black ankle boots, dark-blue shoulder bag, silver studs.
**Scene:** S20 seaside luxury hotel courtyard, summer clear night, ivory stone, sparse low plants, distant sea, few warm garden lamps, deep-blue sky, soft cool sky/moon fill.
**Pose/Camera:** P01 front natural standing, feet naturally separated, even weight, arms relaxed, gaze camera, eye-level standard lens, full body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, long loose soft waves with center part, blue-gray short wool coat, ivory knit top, ivory straight midi knit skirt, black ankle boots, dark-blue small shoulder bag, silver studs, seaside luxury hotel courtyard and observation platform in summer clear night, ivory stone, sparse low plants, distant sea and faint coastline lights, deep-blue sky, few warm garden lamps away from subject, warm side-front light balanced by soft cool sky or moon fill, front natural standing pose, feet naturally separated, even weight, arms relaxed, gaze toward camera, eye-level standard lens, full body vertical 9:16, clean dark-sky or sea negative space behind head and hands, refined realistic night exposure, romantic high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution, restrained contrast.`
**Negative:** Common Negative Module + `neon, excessive stars, smoke, floating particles, multiple shadows, blown highlights, over-saturated deep-blue grading, plants or lamps near hands or feet`.

## PP19 — C19 / S05 / P16
**Character:** Common Character Module; neat natural high ponytail.
**Clothing:** C19 black fitted single-breasted suit jacket, light-gray simple blouse, deep-blue high-waist straight suit trousers, black low-heel rounded-point shoes, black structured shoulder bag, slim silver watch.
**Scene:** S05 premium independent bookstore cafe, spring afternoon, overcast outside, light wood shelves, ivory walls, sparse greenery, diffuse window light and subtle warm interior light.
**Pose/Camera:** P16 very small hip-origin forward lean, both feet stable, hands relaxed beside outer thighs, direct gaze, eye-level, waist-up medium-close, 16:9.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, neat natural high ponytail, black fitted single-breasted suit jacket, light-gray simple blouse, deep-blue straight suit trousers, black low-heel rounded-point shoes, black structured shoulder bag, slim silver watch, premium independent bookstore cafe in spring afternoon, overcast outside, light wood shelves, ivory walls, sparse greenery, diffuse window light with subtle warm interior light, very small natural hip-origin forward lean, both feet stable, hands relaxed beside outer thighs, direct gaze, eye-level camera, waist-up medium-close framing, horizontal 16:9, clean low-detail wall or window-light background around face and hands, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `deep forward bend, furniture crossing body, readable books, crowded cafe, distorted face perspective, hands hidden behind furniture`.

## PP20 — C20 / S12 / P13
**Character:** Common Character Module; low ponytail with softly curved ends.
**Clothing:** C20 blush-pink soft long-sleeve shirt, dark-brown high-waist corduroy A-line long skirt, ivory low-heel round-toe ankle boots, burgundy small shoulder bag, small gold earrings, narrow belt.
**Scene:** S12 small Japanese seaside-town railway platform, summer golden hour, partly cloudy, simple safe platform, pale wood waiting shelter, single railway line receding into distance, low-density town and sea-facing sky, warm slant light.
**Pose/Camera:** P13 seated 3/4, body turned about 30°, both feet same direction, ankles naturally close, one hand on thigh, other lightly on bench, side-front eye-level, thigh-up to 3/4 body, 9:16.
**Positive:** `inr20, Inaria, 20-year-old adult woman, consistent recognizable facial identity, stable face shape and facial proportions, long dark blue-black hair, blue eyes, light natural-looking skin, slender feminine proportions, natural human anatomy, low ponytail with softly curved ends, blush-pink soft long-sleeve shirt, dark-brown corduroy A-line long skirt, ivory low-heel round-toe ankle boots, burgundy small shoulder bag beside seat, small gold earrings, narrow belt, small Japanese seaside-town railway platform in summer golden hour, partly cloudy, simple safe platform, pale wood waiting shelter, single railway line receding into distance, low-density town and sea-facing sky, warm slant light with soft sky fill, seated three-quarter pose, body turned about 30 degrees, both feet grounded same direction with ankles naturally close, one hand on thigh, other lightly on bench, face naturally toward camera, side-front eye-level camera, thigh-up to three-quarter framing, vertical 9:16, railway edge and lines safely away from feet and hands, romantic refined high-end beauty, dreamy Japanese airy aesthetic, delicate light and shadow, realistic texture, ultra-clear, high-resolution.`
**Negative:** Common Negative Module + `standing on track, platform-edge danger, other passengers, readable timetable text, hands across face, crossed legs, excessive flare`.

---

## Coverage / Validation

- Clothing coverage: C01–C20 each used exactly once.
- Scene coverage: S01–S20 each used exactly once.
- Pose/Camera coverage: P01–P20 each used exactly once.
- Aspect ratios follow the approved Pxx units; both 9:16 and 16:9 are represented.
- Character identity remains modular and stable; hairstyle varies without changing the locked dark blue-black hair color.
- Every package preserves five-finger / five-toe anatomy requirements and stable pose logic.
- Scene-specific negative-space constraints are retained; no busy effects are placed around fingers or feet.
- No package copies MASTER_IMAGE clothing, pose, scene, composition, camera or style.
- No historical-chat or unrelated-project art style is imported.
- These Prompt Packages are design handoff assets only. Final image generation and T106 image-level PASS/REVIEW/REJECT remain separate.
