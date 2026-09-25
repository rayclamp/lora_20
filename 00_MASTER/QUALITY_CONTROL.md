# QUALITY_CONTROL.md — 20歲依娜莉亞 LoRA 最終品質標準

## 1. 目的

挑選真正具有 20 歲依娜莉亞 LoRA 訓練價值的圖片，而不只是挑選漂亮圖片。所有帳號使用同一標準。

## 2. 新版決策狀態

- `PASS`：硬性條件通過，具足夠資料集價值，可進入正式資料集。
- `REPAIR`：身份與整體設計有效，缺陷局部且可安全修復。
- `REJECT`：身份、人體、任務、構圖或渲染失敗嚴重，或資料集價值不足。

舊紀錄中的 `REVIEW` 可保留作歷史相容標記，但新的最終決策必須轉為上述三態之一。

## 3. Hard gates

### Identity
- 必須為 20 歲依娜莉亞。
- 臉部與核心辨識度須符合 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`。
- 不得明顯變成另一人物。

### Anatomy
- 每隻可見手具合理五指結構。
- 每隻可見赤腳具合理五趾結構。
- 無多餘、缺失、融合、重複手指/腳趾。
- 無多餘肢體、嚴重變形或不可能關節。
- 重心與動作合理。

### Face and image integrity
- 無嚴重五官錯位、臉部崩壞或塑膠/娃娃感。
- 無文字、水印、Logo、邊框或嚴重 AI artifact。
- 人物不得無理由被畫面邊界截斷。

## 3.5 Anatomy stability hard gate
- 必須只有兩隻手、兩條腿。
- 每隻可見手必須五指；每隻可見赤腳必須五趾。
- 左右手/腳正確，肩/手臂/手腕/手掌與髖/腿/腳連接自然。
- 檢查袖子、衣物、包袋、背帶、道具、植物與背景是否形成假肢。
- 背帶必須完整連接包體並自然貼合身體。
- 明顯多肢、少肢、錯誤五指/五趾、斷裂肢體或假肢不得 PASS。
- 自然遮擋本身不是缺陷；無法判定的手指/腳趾標記人工檢查。

## 4. Style gate

遵守 `00_MASTER/STYLE_MASTER.md` 與 MASTER_IMAGE 的 Reference Style Lock：必須是以 `INARIA_20_MASTER_v1.0.png` 為直接視覺參考的日系動漫插畫，並盡可能維持其線稿、臉部繪製、眼睛、頭髮、比例、上色、陰影、光影、色彩與整體插畫完成度。

以下任一項成立不得 PASS：
- photorealistic / live-action / photographic rendering
- 3D / CGI / semi-photorealistic conversion
- 與 MASTER_IMAGE 明顯不同的另一種 anime / manga / game / illustration style
- 僅符合「動漫」但沒有維持 MASTER_IMAGE 的主要視覺語言

「漂亮」或「高品質」不能取代 Reference Style Match。

## 5. Task gate

確認場景、服裝、髮型、配件、鞋子/赤腳、動作、姿勢、花卉、構圖比例及其他明確要求全部符合當前 TASK。核心要求錯誤通常 REJECT。

## 6. Flower and color rules

常用花卉為日本藍星花與藍色粉蝶花；每個場景主要花種只選一種，不要求兩種同時出現。水藍色/藏青色為常用色系，但當前 TASK 明確指定其他配色時，以 TASK 為準。

## 7. Local repair

局部修復只修改必要區域，盡可能保留未指定的臉部、髮型、服裝、背景、光影、色調與構圖。修復後必須從頭重新 QA；修復不會自動變成 PASS。

## 8. Dataset value and diversity

優先保留能增加姿勢、身體角度、視角、手部動作、服裝、髮型、配件、場景、光線與環境資訊的圖片。高度近似的圖片應降低優先級。

## 9. 最終 PASS checklist

- 20 歲身份正確
- 臉部身份穩定
- 人體與手腳合理
- 當前任務完整正確
- 構圖完整
- 風格正確且無歷史污染
- 無文字/水印/Logo
- 品質足夠
- 具 LoRA 訓練價值
- 必要 caption / metadata / lineage 完整

只有全部成立才可 PASS。
