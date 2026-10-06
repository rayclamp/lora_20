# FESTIVAL ITEM LINK MATRIX

This matrix connects every core festival to the categories currently relevant to image design. Category links were expanded to ensure workers can retrieve traditional footwear, accessories, and headwear where documented.

| ID | FESTIVAL | RELEVANT CATEGORIES |
|---|---|---|
| F001 | Christmas | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F002 | Halloween | PROPS,OTHER |
| F003 | New Year's Day | CLOTHING,PROPS,OTHER |
| F004 | Lunar New Year / Chinese New Year | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F005 | Valentine's Day | CLOTHING,ACCESSORIES,SHOES,PROPS |
| F006 | Easter | CLOTHING,ACCESSORIES,SHOES,PROPS |
| F007 | Thanksgiving | CLOTHING,ACCESSORIES,SHOES,PROPS |
| F008 | St. Patrick's Day | CLOTHING,ACCESSORIES,SHOES,PROPS |
| F009 | Carnival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F010 | Oktoberfest | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F011 | Day of the Dead | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,MAKEUP,BODY_DECORATION,PROPS,OTHER |
| F012 | Diwali | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,MAKEUP,BODY_DECORATION,PROPS,OTHER |
| F013 | Holi | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,MAKEUP,BODY_DECORATION,PROPS |
| F014 | Ramadan | CLOTHING,ACCESSORIES,HEADWEAR,MAKEUP,PROPS,OTHER |
| F015 | Eid al-Fitr | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,MAKEUP,PROPS,OTHER |
| F016 | Eid al-Adha | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,MAKEUP,PROPS,OTHER |
| F017 | Nowruz | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F018 | Chinese Mid-Autumn Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F019 | Dragon Boat Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F020 | Qingming Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F021 | Lantern Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F022 | Japanese New Year | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F023 | Tanabata | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS |
| F024 | Gion Matsuri | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F025 | Hanami | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F026 | Obon | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F027 | Setsubun | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F028 | Vietnamese Mid-Autumn Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F029 | Songkran | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F030 | Vesak | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F031 | Korean Seollal | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F032 | Korean Chuseok | CLOTHING,ACCESSORIES,SOCKS,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F033 | Taiwanese Mid-Autumn Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F034 | Taiwanese Dragon Boat Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F035 | Taiwan Lantern Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F036 | Taiwan Ghost Festival / Zhongyuan | CLOTHING,ACCESSORIES,SHOES,PROPS,OTHER |
| F037 | Mazu Pilgrimage / Birthday Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F038 | Qingming / Tomb-Sweeping Memorial Focus (overlaps F020; not a separate holiday) | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F039 | East Asian Mid-Autumn Festival | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F040 | Valentine's Day / White Day Cultural Season | CLOTHING,ACCESSORIES,SHOES,PROPS |
| F041 | Bastille Day | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F042 | Independence Day | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F043 | Canada Day | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F044 | Day of the Dead – Andean / Latin American Variants (region-specific item coverage gap) | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,MAKEUP,BODY_DECORATION,PROPS,OTHER |
| F045 | Mardi Gras | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F046 | Midsummer | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,HAIRSTYLE,PROPS,OTHER |
| F047 | St. Nicholas Day | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |
| F048 | Christmas Eve / Advent Season | CLOTHING,ACCESSORIES,SHOES,HEADWEAR,PROPS,OTHER |

## RULE

The festival record's `CATEGORY_LINKS` is authoritative. This matrix is a navigation index and must match each festival record's declared category set; it must not silently expand or narrow that set. If a mismatch is found, stop item selection for that festival, report `CATEGORY_LINK_MISMATCH`, and reconcile the record and matrix before production.

A listed category means the worker may look for verified items there. It does not mean every item in that category is culturally appropriate for that festival. Festival tags, region, historical context, and cultural-sensitivity fields must still match.

Traditional items should be preferred. Modern items are supplemental and should remain a minority when a documented traditional option exists.

## COVERAGE STATUS

The accessory, shoe, and headwear catalogs form an expanded candidate pool. The matrix itself does not store per-item source citations, and catalog inclusion is not proof of cultural verification. Treat an item as verified only when its item record contains explicit SOURCE_REFERENCES and VERIFICATION_STATUS: VERIFIED. This pool is not an exhaustive representation of every local/regional variant.
