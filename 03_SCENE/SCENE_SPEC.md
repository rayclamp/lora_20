# Inaria AI Studio — Scene Department Specification

- **Department:** ③ Scene Designer / Scene Department
- **Version:** v001
- **Last Updated:** 2026-09-05
- **Purpose:** Define a complete, reusable scene and environmental design standard for the Inaria age-20 LoRA project. Scene design exists to support character identity, clothing, pose, readability, and training-data diversity; the background must not compete with the character as the primary subject.

---

## 1. Scope and Design Principles

### 1.1 Core principle
The scene serves the character, not the reverse.

Priority:
1. Preserve character identity and proportions.
2. Preserve approved upstream clothing and other locked elements.
3. Maintain anatomy and generation stability.
4. Establish a clear, believable environment.
5. Add lighting, atmosphere, and environmental storytelling.
6. Add decorative richness only when it does not reduce character readability.

### 1.2 Scene department responsibilities
The Scene Department designs:
- location and environmental category;
- season;
- weather;
- time of day;
- background architecture and natural elements;
- lighting direction and quality;
- color relationship and atmosphere;
- environmental storytelling;
- spatial relationship between character and background;
- scene-specific generation constraints.

It does not independently alter locked character identity, approved clothing, or approved pose/camera decisions.

---

## 2. Scene Classification

### 2.1 City / Urban
Use for streets, commercial districts, stations, plazas, waterfront urban areas, rooftops, alleys, parks within cities, and modern architecture.

Design variables:
- dense / open urban density;
- modern / historic architecture;
- residential / commercial / civic character;
- street furniture, signage, windows, vegetation, pavement, transit elements;
- day / dusk / night variation.

Background rule: urban detail should establish place without creating a wall of high-contrast objects immediately behind the face or hands.

### 2.2 Rural / Suburban
Use for village roads, farm areas, countryside houses, orchards, fields, tea-growing areas, small-town streets, and low-density residential environments.

Design variables:
- cultivated / semi-natural land;
- traditional / contemporary houses;
- irrigation, fences, utility poles, small roads, gardens, agricultural structures.

Avoid repetitive or implausibly dense buildings.

### 2.3 Natural Landscape
Use for forests, mountains, lakes, rivers, coastlines, beaches, meadows, waterfalls, gardens, wetlands, and scenic overlooks.

Design variables:
- terrain depth;
- vegetation layers;
- water / rock / soil relationships;
- atmospheric distance;
- foreground, midground, and background separation.

Natural scenery should provide depth and mood while leaving a clean visual area around important character details.

### 2.4 Interior
Use for bedrooms, living rooms, cafés, restaurants, studios, libraries, galleries, shops, hotels, traditional rooms, and other enclosed environments.

Design variables:
- architecture;
- furniture;
- windows and doors;
- floor and wall materials;
- practical light sources;
- controlled decorative objects.

Interior backgrounds should remain believable and avoid excessive object density.

### 2.5 Hybrid / Transitional
Use for balconies, verandas, covered arcades, station platforms, garden cafés, hotel terraces, shrine approaches, waterfront promenades, and similar spaces combining interior and exterior qualities.

---

## 3. Seasonal Rules

### Spring
Core cues:
- fresh vegetation;
- soft new green foliage;
- flowering plants where appropriate;
- mild, clean daylight;
- light haze or post-rain freshness when appropriate.

Avoid making every spring scene depend on cherry blossoms. Seasonal identity should also come from vegetation, light, temperature cues, and local environment.

### Summer
Core cues:
- mature dense greenery;
- strong but controllable sunlight;
- humid atmosphere where appropriate;
- bright skies, coastal light, or warm evening light;
- seasonal flowers and vegetation when contextually appropriate.

Avoid excessive blown highlights and visually noisy tropical decoration.

### Autumn
Core cues:
- changing foliage where regionally appropriate;
- warm or neutral daylight;
- lower-angle sunlight;
- dry leaves, harvest, or seasonal landscape cues where appropriate.

Do not force red/orange foliage in regions where such vegetation is uncommon.

### Winter
Core cues:
- reduced vegetation density where appropriate;
- cooler daylight;
- bare branches in suitable climates;
- mist, rain, frost, or snow only when geographically plausible.

Winter must not automatically imply snow.

---

## 4. Regional Rules

### 4.1 Taiwan
Favor environmental cues that plausibly reflect Taiwan without turning the scene into a stereotype:
- subtropical vegetation;
- humid or rain-washed surfaces;
- mountains and dense urban development where appropriate;
- scooters, utility infrastructure, signage, arcades, tiled or concrete architecture only when context supports them;
- coastal, rural, tea-growing, market, historic, and modern-city environments.

Taiwan scenes should feel geographically coherent: weather, vegetation, architecture, and terrain should agree with one another.

### 4.2 Japan
Use regionally coherent Japanese environmental language:
- traditional or modern architecture as appropriate;
- residential streets, gardens, shrines, stations, cafés, shopping streets, coast, mountain, or countryside settings;
- seasonal vegetation and weather consistent with the selected region.

Avoid mixing unrelated Japanese architectural eras or inserting stereotypical elements solely to signal “Japan.”

### 4.3 Other Regions
When another region is approved, establish a small geographic identity set first:
- architecture;
- vegetation;
- terrain;
- climate;
- infrastructure;
- culturally specific objects.

Do not mix region-specific cues arbitrarily. Regional authenticity is subordinate to character readability.

---

## 5. Character–Background Spatial Relationship

### 5.1 Layering
Design scenes as:
- **Foreground:** optional framing elements, kept sparse;
- **Midground:** character and immediate environment;
- **Background:** architecture, landscape, sky, distant objects.

The character should occupy the clearest visual layer.

### 5.2 Negative-space principle
Maintain usable negative space around:
- face;
- hair silhouette;
- hands;
- feet;
- clothing edges;
- important accessories.

Avoid placing high-contrast poles, branches, rails, signs, door frames, or similar linear objects through the head or body silhouette.

### 5.3 Depth
Prefer readable depth over flat wallpaper-like backgrounds. Use distance, atmospheric perspective, scale variation, and restrained foreground framing.

### 5.4 Visual hierarchy
The strongest visual emphasis should normally be:
1. face / character;
2. approved clothing and pose;
3. immediate environment;
4. distant environmental detail.

Background contrast, saturation, and detail should generally decrease as they approach areas where character readability is critical.

---

## 6. Hands and Feet Non-Interference Rules

### 6.1 General
Background design must not create ambiguity around hands or feet.

### 6.2 Hands
Avoid:
- branches or railings crossing fingers;
- signage, furniture edges, straps, cables, or props visually merging with hands;
- bright effects immediately around fingers;
- clutter directly behind complex hand positions.

Prefer a calm background patch behind important hand silhouettes.

### 6.3 Feet
Avoid:
- floor lines or shadows that appear to become extra legs;
- furniture, rocks, plants, or rails intersecting ankles and feet;
- clutter around toes when footwear exposes them.

### 6.4 Stability rule
When a scene and pose conflict, simplify the scene before making the pose harder to render. Stable anatomy has priority over environmental spectacle.

---

## 7. Lighting, Time, Weather, Color, and Atmosphere

### 7.1 Time of day
Use a controlled distribution across:
- early morning;
- morning;
- midday;
- afternoon;
- golden hour;
- dusk;
- blue hour;
- night.

Time should be visually communicated through sun angle, sky luminance, practical lights, and shadow behavior—not merely named in a prompt.

### 7.2 Lighting
Specify:
- primary light direction;
- light quality: soft / diffuse / directional;
- approximate intensity;
- fill level;
- practical light sources when indoors or at night;
- shadow softness;
- atmospheric response.

Avoid lighting that destroys facial readability or creates extreme contrast without purpose.

### 7.3 Weather
Supported concepts include:
- clear;
- partly cloudy;
- overcast;
- light rain;
- post-rain;
- fog / mist;
- seasonal conditions appropriate to region.

Weather effects must remain subordinate to the character. Rain, mist, snow, particles, and lens effects should not obscure the face, hands, or important clothing details.

### 7.4 Color and tone
Use a coherent scene palette. Water blue and navy are preferred project accents when compatible with the approved clothing and scene, but they are not mandatory.

Background color should support clothing contrast rather than duplicate the character's dominant color everywhere.

### 7.5 Atmosphere
Possible atmosphere descriptors:
- calm;
- romantic;
- refined;
- dreamy;
- refreshing;
- nostalgic;
- elegant;
- peaceful;
- lively but controlled.

The atmosphere should emerge from the combination of environment, light, weather, and color rather than from excessive effects.

---

## 8. Scene Prompt Standard

Use this structure for scene prompts:

```text
[SCENE]
Location: <specific location>
Region: <Taiwan / Japan / other approved region>
Season: <spring / summer / autumn / winter>
Weather: <weather condition>
Time: <time of day>
Environment: <architecture / terrain / vegetation / major environmental elements>
Foreground: <optional restrained framing elements>
Midground: <character's immediate environment>
Background: <distant environmental elements>
Lighting: <direction, quality, intensity, practical sources if applicable>
Color/Tone: <coherent palette and contrast relationship>
Atmosphere: <mood>
Environmental Storytelling: <small contextual details>
Character Separation: <how background remains visually subordinate>
Hand/Foot Clearance: <clean zones around hands and feet>
Generation Constraints: <scene-specific exclusions>
```

### Prompt writing rules
- Describe concrete visual conditions rather than abstract adjectives alone.
- Keep scene information separate from character, clothing, pose/camera, and negative constraints.
- Do not introduce unapproved character changes.
- Do not add background objects merely to make the prompt longer.
- Prefer a small number of coherent environmental anchors over many unrelated details.

---

## 9. Common Background Generation Errors

### 9.1 Object merging
Examples:
- poles through heads;
- branches through hair;
- rails appearing attached to arms;
- furniture merging into bodies.

**Action:** reject or regenerate if the error affects character readability.

### 9.2 Spatial inconsistency
Examples:
- impossible doors and windows;
- distorted stairs;
- floating furniture;
- roads or paths with impossible perspective;
- water flowing in contradictory directions.

**Action:** reject when clearly visible or when it compromises scene credibility.

### 9.3 Repetition artifacts
Examples:
- duplicated windows;
- repeated plants;
- cloned signs;
- identical people or objects unintentionally appearing multiple times.

**Action:** regenerate or simplify the environment.

### 9.4 Excessive detail
Symptoms:
- background becomes more visually dominant than the character;
- face loses contrast against the background;
- hands disappear into clutter;
- clothing silhouette becomes difficult to read.

**Action:** reduce object count, contrast, saturation, or depth complexity.

### 9.5 Lighting mismatch
Examples:
- sun direction contradicts shadows;
- indoor practical lights disagree with overall illumination;
- rain scene with implausibly dry surfaces;
- night scene with daylight-level ambient light without justification.

**Action:** regenerate if mismatch is conspicuous.

### 9.6 Regional mismatch
Examples:
- architecture, vegetation, weather, and infrastructure do not belong together;
- Japanese cues mixed with unrelated regional cues;
- Taiwan scene rendered with implausible climate indicators.

**Action:** simplify to a coherent regional identity.

### 9.7 Perspective and scale errors
Examples:
- oversized furniture;
- miniature doors;
- impossible horizon height;
- inconsistent object scale around the character.

**Action:** reject if clearly visible and distracting.

---

## 10. Image Screening Standard

Every candidate scene image should be evaluated in this order:

### A. Character readability — mandatory
- Face remains clearly readable.
- Character silhouette is not swallowed by background.
- Clothing remains distinguishable.

### B. Anatomy clearance — mandatory
- Hands are not visually merged with background objects.
- Feet and legs are not visually merged with floor/background elements.
- No environmental object creates apparent extra limbs.

### C. Scene coherence — mandatory
- Location, season, weather, time, architecture, vegetation, and lighting agree.
- Perspective and scale are believable.

### D. Visual hierarchy — mandatory
- Character remains the primary subject.
- Background does not contain stronger competing focal points.
- Decorative detail does not overpower the character.

### E. Quality
Reject or regenerate for:
- severe background deformation;
- obvious duplicated objects;
- severe perspective errors;
- distracting artifacts;
- text, watermark, or logo when not intentionally required;
- excessive artificial/plastic visual appearance.

### Screening decision
- **PASS:** all mandatory categories are satisfactory.
- **REVIEW:** minor background issue that does not materially affect character identity, anatomy, or readability.
- **REJECT:** any major anatomy interference, character occlusion, severe spatial inconsistency, or background dominance.

A beautiful scene is not sufficient for PASS if it compromises the character.

---

## 11. Scene Diversity Guidance for LoRA Dataset

Scene diversity should vary environmental factors without creating uncontrolled noise.

Across a dataset, deliberately vary:
- urban / rural / natural / interior;
- Taiwan / Japan / other approved regions;
- spring / summer / autumn / winter;
- morning / midday / afternoon / dusk / night;
- clear / cloudy / rain / post-rain / mist where appropriate;
- near / medium / distant background depth;
- architectural and natural environments.

Avoid repeating the same combination of location + season + weather + time + lighting + background arrangement so often that the scene becomes an accidental character identifier.

At the same time, do not vary everything simultaneously in every image. Controlled variation is preferable to random variation.

---

## 12. Handoff to Pose / Camera Department

Each completed scene design should be handed off with:

```text
Scene ID: <ID>
Version: <v###>
Location:
Region:
Season:
Weather:
Time:
Environment:
Foreground:
Midground:
Background:
Lighting:
Color/Tone:
Atmosphere:
Environmental Storytelling:
Character Separation:
Hand/Foot Clearance:
Scene-specific Constraints:
Dependencies from Character/Clothing:
Notes for Pose/Camera:
```

The handoff must clearly distinguish:
- **locked scene requirements**;
- **preferred but adjustable details**;
- **elements that must not interfere with the character**.

The next department may adapt framing to improve character readability, provided approved scene requirements remain intact.

---

## 13. Versioning and Change Control

- Scene documents use versioned filenames where applicable (`v001`, `v002`, etc.).
- `03_SCENE/` is the Scene Department workspace.
- Do not modify `00_MASTER/` to solve a one-off scene problem.
- Permanent project-wide rule changes require Director approval and promotion to `00_MASTER/` by the project owner/director.
- Do not silently overwrite another specialist's work.

---

## 14. Final Scene Department Principle

**The best scene is not the most elaborate scene. It is the scene that makes the character look unmistakably like the intended Inaria, preserves anatomical and visual clarity, communicates a believable place and moment, and adds useful training diversity without becoming the subject itself.**
