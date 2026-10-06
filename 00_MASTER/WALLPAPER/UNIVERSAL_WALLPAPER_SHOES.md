# UNIVERSAL_WALLPAPER_SHOES.md

## Authority

This document defines the canonical footwear allowlist for the UNIVERSAL_WALLPAPER module.

It applies to both ANIME WALLPAPER and REALISTIC WALLPAPER when they operate under UNIVERSAL_WALLPAPER.

Festival Wallpaper footwear catalogs are module-specific and MUST NOT be treated as Universal Wallpaper footwear options.

## 1. Universal Wallpaper footwear allowlist

Universal Wallpaper may use ONLY these nine footwear types:

1. 高跟鞋
2. 娃娃鞋
3. 側面雙扣短靴
4. 短靴
5. 厚底靴
6. 涼鞋
7. 運動鞋
8. 瑪莉珍鞋
9. 拖鞋

Equivalent English labels may be used in prompts when needed:

- High heels
- Mary Jane flats / doll shoes
- Side-double-buckle ankle boots
- Ankle boots
- Platform boots
- Sandals
- Sneakers
- Mary Jane shoes
- Slippers

## 2. Forbidden cross-module inference

The Worker MUST NOT infer Universal Wallpaper footwear availability from:

- FESTIVAL_COSTUME_DATABASE
- Festival Wallpaper SHOES catalogs
- another production module's footwear list
- historical footwear items that are not in this Universal allowlist

The existence of a footwear item in GitHub does not make it valid for Universal Wallpaper.

## 3. Loafers

Loafers are NOT an allowed Universal Wallpaper footwear type.

Any Universal Wallpaper design containing loafers, unless the user explicitly changes the Universal allowlist in a future authoritative rule update, MUST fail footwear validation and be redesigned before Prompt Lock.

## 4. Design-stage requirement

When footwear is visible or intentionally designed, the Producer MUST:

1. select the footwear type from this allowlist;
2. record the selected type in the SHOES design field;
3. verify the selected type against this allowlist before final prompt construction;
4. ensure batch diversity stays within the allowlist.

Do not treat a missing Universal footwear rule as permission to invent a new footwear category.

## 5. Module boundary invariant

Universal Wallpaper and Festival Wallpaper have separate footwear authorities.

A Festival footwear catalog MAY be used by Festival Wallpaper when authorized by Festival rules, but it MUST NOT be imported, inherited, or silently reused by Universal Wallpaper.

**Universal Wallpaper footwear authority = this allowlist.**
