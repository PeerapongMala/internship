# Design Spec: Auto Selling - Unsort CC - Default State

**Figma Node:** `2:20263`
**Date Fetched:** 2026-02-19

---

## Overall Layout

- **Page Size:** 1440 x 900 px
- **Background:** Full-width gradient with decorative background images
- **Font Family:** Pridi (registered as `bss-pridi` in CSS)

---

## 1. Navigation Header (node 2:20271)

- **Position:** x=0, y=0
- **Size:** 1440 x 40 px
- **Content padding:** x=12, y=3
- **Logo:** 30 x 30 px (node 2:20276)
- **System name text:** "ระบบตรวจสอบการนับคัดธนบัตร" (node 2:20481)
- **Version text:** "Version 1.0.0" (node 2:20482), font-size: 16px area
- **Menu nav:** instance at x=306, y=4.5, width=1002, height=25 (node 2:20483)
- **Profile section:** x=1308, width=108, height=34
  - Username: "สมสวัสดิ์ มาดี" (node 2:20487)
  - Role: "Operator" (node 2:20488)
  - Avatar: 30 x 30 px (node 2:20491)

---

## 2. Title Bar Area (node 2:20495)

- **Position:** x=18.5, y=40 (relative to content frame 2:20494)
- **Size:** 1403 x 62 px

### 2a. Page Title (node 2:20496)
- **Text:** "Auto Selling UNSORT CC" (node 2:20498)
- **Size:** 547 x 36 px
- **Font:** Pridi, ~24px (estimated from 36px height)

### 2b. Info Panel (node 2:20500)
- **Position:** x=577, y=5
- **Size:** 414 x 52 px
- **Contains:**
  - Date: "21/7/2568 16:26" with info icon (14 x 14 px)
  - Sorting Machine: "กรุงเทพฯ M7-1 สพท."
  - Supervisor: "สมสวัสดิ์ มาดี"
  - Shift: "ผลัดบ่าย"
- **Label font:** Pridi, 13px (from `Form Label` token)
- **Value font:** Pridi, 13px

### 2c. Action Buttons (node 2:20519)
- **Position:** x=1021, y=13
- **Size:** 382 x 36 px
- **Button 1 - Filter:** 98 x 36 px (node 2:20520)
  - Icon: 16 x 16 px, padding-left: 16px
  - Text: "Filter", padding-left: 40px
- **Button 2 - Open Screen 2:** 125 x 36 px (node 2:20525)
  - Icon: 16 x 16 px, padding-left: 8px
  - Text: "เปิดหน้าจอ 2", padding-left: 32px
- **Button 3 - Print Data:** 127 x 36 px (node 2:20530)
  - Icon: 16 x 16 px, padding-left: 12px
  - Text: "Print Data", padding-left: 36px
- **Gap between buttons:** ~16px

---

## 3. Filter Bar (node 2:20536)

- **Position:** x=0, y=62 (within content area)
- **Size:** 1408 x 63 px
- **Inner padding:** 24px horizontal, 16px vertical

### Filter Fields (5 dropdowns in a row):
| Filter | Label | Label Width | Select Width | Total Width |
|--------|-------|-------------|-------------|-------------|
| Header Card | "Header Card:" | 85px | 155px | 248px |
| ธนาคาร | "ธนาคาร:" | 47px | 193px | 248px |
| Zone | "Zone:" | 33px | 207px | 248px |
| Cashpoint | "Cashpoint:" | 70px | 170px | 248px |
| ชนิดราคา | "ชนิดราคา:" | 57px | 183px | 248px |

- **Label font:** Pridi Regular 13px (Form Label token)
- **Select height:** 31px
- **Gap between fields:** ~30px

---

## 4. Content Area - Two-Panel Layout (node 2:20557)

- **Position:** x=0, y=71 (below filter bar)
- **Size:** 1408 x 663 px
- **Left panel width:** ~844.8px (60.0%)
- **Right panel width:** ~555.2px (39.4%)
- **Gap between panels:** ~8px (852.8 - 844.8)

---

## 5. Left Panel Tables

### 5a. Table 1 - "มัดครบจำนวน ครบมูลค่า" (node 2:20559)
- **Size:** 844.8 x 327.5 px
- **Section Header (node 2:20560):** 844.8 x 38 px
  - Title: "มัดครบจำนวน ครบมูลค่า" (font: Pridi, ~14-16px)
  - Count badge: "จำนวน: **1,000** ฉบับ" (bold number)
  - Padding: 16px left, 8px top

#### Column Headers (node 2:20576, height: 30px):
| Column | Header Text | Width | Alignment |
|--------|------------|-------|-----------|
| Checkbox | - | 20px | center |
| Header Card | "Header Card" | 133.7px | left |
| ชนิดราคา | "ชนิดราคา" | 80px | left |
| วันเวลานับคัด | "วันเวลานับคัด" | 116px | left |
| จำนวนฉบับ | "จำนวนฉบับ" | 133.7px | right |
| มูลค่า | "มูลค่า" | 133.7px | right |
| สถานะ | "สถานะ" | 133.7px | center |
| Action | "Action" | 78px | center |

- **Header font:** Pridi Medium 13px, weight 500 (Table header token)
- **Sort icon:** 12 x 12 px

#### Data Rows (height: 36px each):
- **Checkbox:** 16 x 16 px
- **Body font:** Pridi Regular 13px, weight 400 (Table body token)
- **Denomination badge:** 47 x 24 px with pattern background (e.g., "1000")
- **Status badge:** "Auto Selling" badge, 94 x 19 px
- **Action buttons:** 26 x 26 px each, 2 buttons (edit + delete), gap ~10px
- **Cell padding:** 8px left

### 5b. Table 2 - "มัดรวมครบจำนวน ครบมูลค่า" (node 2:20642)
- **Size:** 844.8 x 327.5 px
- **Gap from Table 1:** 8px (335.5 - 327.5)
- **Section Header:** Same style, title "มัดรวมครบจำนวน ครบมูลค่า"
- **Count badge:** "จำนวน: **2,000** ฉบับ"

#### Columns (same structure, slightly different widths):
| Column | Header Text | Width |
|--------|------------|-------|
| Checkbox | - | 20px |
| Header Card | "Header Card" | 119.76px |
| ชนิดราคา | "ชนิดราคา" | 80px |
| วันเวลานับคัด | "วันเวลานับคัด" | 130px |
| จำนวนฉบับ | "จำนวนฉบับ" | 119.76px |
| มูลค่า | "มูลค่า" | 119.76px |
| สถานะ | "สถานะ" | 119.76px |
| Action | "Action" | 119.76px |

---

## 6. Right Panel - Three Tables (node 2:20971)

- **Size:** 555.2 x 663 px
- **Three equal-height tables:** each ~215.67 px tall
- **Gap between tables:** ~8px

### 6a. Table A - "มัดขาด-เกิน" (instance 2:20972)
- **Height:** 215.67 px
- **Count badge:** "จำนวน: **997** ฉบับ"
- **Columns:** Header Card, ชนิดราคา, วันเวลานับคัด, จำนวนฉบับ, มูลค่า, สถานะ

### 6b. Table B - "มัดรวมขาด-เกิน" (instance 2:20973)
- **Height:** 215.67 px
- **Count badge:** "จำนวน: **1,998** ฉบับ"

### 6c. Table C - "มัดเก็บโดยยอดจากเครื่องจักร" (instance 2:20974)
- **Height:** 215.67 px
- **Count badge:** "จำนวน: **1,002** ฉบับ เก็บ: **2** ฉบับ"

---

## 7. Footer Buttons (node 2:21014)

- **Position:** x=16, y=796
- **Size:** 1408 x 64 px
- **Button padding:** y=8

### Buttons:
| Button | Width | Height | Position | Style |
|--------|-------|--------|----------|-------|
| Refresh | 229px | 48px | x=0 | Green/outlined |
| Manual Key-in | 173px | 48px | x=990 | Teal/solid |
| ดูรายการสรุปทั้งหมด | 229px | 48px | x=1179 | Gold/solid |

---

## Design Tokens Summary

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #003366 | Primary brand color |
| Theme/Primary | #0d6efd | Theme primary blue |
| Neutral text primary | #212121 | Main text color |
| Neutral text tertiary | #909090 | Secondary/muted text |
| Body Color | #212529 | Body text |
| Separator | #cbd5e1 | Borders, dividers |
| Theme/Border | #DEE2E6 | Table borders |
| Gray/White | #FFFFFF | Backgrounds |
| Gray/400 | #CED4DA | Input borders |
| Gray/600 | #6C757D | Disabled/placeholder |
| Gray/800 | #343A40 | Dark text |
| Theme/Danger | #DC3545 | Danger/error |
| Green/500 | #198754 | Success/confirm |
| Yellow/50 | #fefce8 | Warning background |
| Yellow/400 | #facc15 | Warning accent |
| Yellow/900 | #713f12 | Warning text |
| Red/100 | #fee2e2 | Error background |
| Red/400 | #f87171 | Error accent |
| Red/950 | #450a0a | Error text |
| Slate/50 | #f8fafc | Light background |

### Typography
| Token | Family | Size | Weight | Line Height | Letter Spacing |
|-------|--------|------|--------|-------------|---------------|
| Table header | Pridi | 13px | 500 (Medium) | 100% | 2.3px |
| Table body | Pridi | 13px | 400 (Regular) | 1 | 2.2px |
| Form Label | Pridi | 13px | 400 | 100% | 2.5px |
| Form Label 2 | Pridi | 14px | 400 | 100% | 2.5px |
| Body | Pridi | 14px | 400 | 100% | 2.2px |
| Body/Small | Pridi | 14px | 400 | 1.5 | 2.5px |
| Heading/H6 | Pridi | 16px | 500 (Medium) | 1.2 | 2.5px |
| Progress Label | Pridi | 12px | 400 | 1.5 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| s-zero | 0 |
| s-xxxxsm | 2px |
| s-xxxsm | 4px |
| s-xsm | 8px |
| s-sm | 12px |
| s-md | 16px |
| s-lg | 24px |

### Border Radius
| Token | Value |
|-------|-------|
| r-sm | 12px |
