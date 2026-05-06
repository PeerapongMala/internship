# Design Spec: Verify Confirmation

**Figma Node:** `1:9829`
**Date Fetched:** 2026-02-20
**Source:** Figma MCP (get_metadata + get_variable_defs + get_screenshot) + SVG export

---

## Overall Layout

- **Page Size:** 1440 x 900 px (full viewport)
- **Content Width:** 640px centered (x=400 to x=1040 in SVG)
- **Background:** `#EDEDED` base + gradient overlay (varies by BnType variant)
- **Background Gradient (Unsort CC):** `#F5A783` → `#F9ECD8`
- **Font Family:** Pridi (registered as `bss-pridi` in CSS)
- **Layout:** Single-column, vertically stacked cards

---

## 1. Navigation Header (shared with p01)

- **Size:** 1440 x 40px
- **Background (Unsort CC):** `#F2B091` solid + `#F5A783` at opacity 0.85 overlay
- **Content:** BOT logo, system name, "Verify" dropdown menu, user profile
- **Reuses:** `_Layout.cshtml` shared navigation, NavColorClass from ViewData

---

## 2. Title Bar

- **Layout:** Flex row, space-between
- **Left:** Page title
- **Right:** "Print Data" button

### 2a. Page Title
- **Text:** "Verify {BnTypeName}" (e.g., "Verify UNSORT CC")
- **Font:** bss-pridi, 30px, weight 600 (SemiBold)
- **Color:** #212121
- **Letter spacing:** 0.675px

### 2b. Print Data Button
- **Size:** 127 x 36px
- **Background:** #003366 (Primary navy)
- **Text:** "Print Data", white, 14px, weight 500
- **Icon:** Printer icon, 16px, white
- **Border radius:** 6px (rx=6 from SVG)
- **Padding:** 8px 20px
- **Gap (icon-text):** 8px

---

## 3. Info Card

- **Container:** White bg (#fff), border 1px solid #CBD5E1, border-radius 12px
- **Width:** 640px, **Height:** 104px (from Figma metadata)
- **Card padding:** 16px vertical, 0 horizontal
- **Rows:** 3 rows, each 24px tall, no gap
- **Row padding:** 4px 12px
- **Row borders:** 1px solid #CBD5E1

### 3a. Date Row (special)
- **Background:** #F8D7DA (light pink/red alert)
- **Height:** 24px (same as other rows)
- **Label:** "Date:" — bss-pridi, 16px, weight 500
- **Value:** "DD/M/BBBB HH:MM" — bss-pridi, 16px, weight 400
- **Alert icon:** Red octagon (#DC3545), 14x14px

### 3b. Supervisor Row
- **Background:** white
- **Padding:** 4px 12px
- **Border bottom:** 1px solid #CBD5E1

### 3c. Sorting Machine Row
- **Background:** white
- **Padding:** 4px 12px
- **No border bottom (last child)**

---

## 4. Detail Table — "รายละเอียดธนบัตร"

- **Container:** White bg (#fff), border 1px solid #CBD5E1, border-radius 12px
- **Title:** "รายละเอียดธนบัตร" — bss-pridi, 16px, weight 600, padding 8px, height 35px
- **Title border bottom:** 1px solid #CBD5E1

### Column Headers
- **Background:** `#D6E0E0` (from SVG)
- **Height:** 30px (y=248 to y=278)
- **Border bottom:** 1px solid #CBD5E1
- **Font:** bss-pridi, 13px, weight 600, color #4a5568

| Column | Thai | Width | Alignment |
|--------|------|-------|-----------|
| ชนิดราคา | Denomination badge | 83px | left |
| ประเภท | Type | 83px | left |
| แบบ | Series | 83px | left |
| จำนวนฉบับ | Count | 125px | right |
| จำนวนขาด(ฉบับ) | Shortage | 125px | center |
| จำนวนเกิน(ฉบับ) | Excess | 125px | center |

### Data Rows
- **Height:** 34px (from SVG: each row spans 34px)
- **Font:** bss-pridi, 14px, weight 400, color #212529
- **Alternating:** even rows `#F2F6F6` (from SVG)
- **Hover:** #f1f5f9
- **Border bottom:** 1px solid #CBD5E1
- **Denomination badge:** 47x24px, bg `#FBF8F4` (from SVG), reuses `.qty-badge` from `all.css`
- **Quantity cells:** text-align right, weight 500
- **Center cells (shortage/excess):** text-align center, color #6c757d
- **Empty rows:** 34px height, same border pattern

### Data (from Figma)
| ชนิดราคา | ประเภท | แบบ | จำนวนฉบับ | ขาด | เกิน |
|-----------|--------|-----|-----------|-----|------|
| 1000 | ดี | 17 | 2,986 | - | - |
| 1000 | ทำลาย | 17 | 3 | - | - |
| 1000 | Reject | 16 | 11 | - | - |
| 1000 | ปลอม | — | 1 | - | - |

---

## 5. Summary Card

- **Container:** White bg (#fff), border 1px solid #CBD5E1, border-radius 12px
- **Size:** 640 x 243px (from Figma metadata)
- **Padding:** 16px 12px
- **Layout:** Flex column, gap 4px

### Summary Rows (6 + total)
- **Layout:** Flex row, label (flex:1) + value (min-width 80px, right-aligned) + unit (40px)
- **Row height:** 25px
- **Row gap:** 4px
- **Font:** bss-pridi, 16px

| Line | Sign | Value Color | Font Weight |
|------|------|-------------|-------------|
| รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น | (+) | #212121 (black) | 700 |
| รวมธนบัตร Reject จำนวนทั้งสิ้น | (+) | **#DC2626 (red)** | 700 |
| รวมธนขาด จำนวนทั้งสิ้น | (+) | **#DC2626 (red)** | 700 |
| รวมธนบัตรเกิน จำนวนทั้งสิ้น | (-) | **#DC2626 (red)** | 700 |
| ธนบัตรชำรุด จำนวนทั้งสิ้น | (O) | #212121 (black) | 700 |
| ธนบัตรปลอม จำนวนทั้งสิ้น | (O) | #212121 (black) | 700 |
| **รวมทั้งสิ้น** | — | #212121 | **700, 18px** |

### Total Row (special)
- **Height:** 33px (from Figma metadata)
- **Border top:** 1px solid #CBD5E1
- **Margin top:** 8px
- **Padding top:** 8px
- **Label:** font-weight 700
- **Value:** font-size 18px

---

## 6. Footer Buttons

- **Layout:** Flex row, gap 61px (SVG verified)
- **Margin top:** 8px
- **Total width:** 639px (289 + 61 gap + 289)
- **Container height:** 47px (SVG verified)

### 6a. "กลับไปหน้า Auto Selling" Button
- **Size:** 289 x 47px (SVG verified)
- **Background:** #6C757D (gray / Theme Colors/Secondary)
- **Border:** 1px solid #6C757D
- **Hover:** #5a6268
- **Color:** white
- **Font:** bss-pridi, 18px, weight 500
- **Border radius:** 7.5px (SVG verified: rx=7.5)

### 6b. "Verify" Button
- **Size:** 289 x 47px (SVG verified)
- **Background:** #003366 (navy / Primary)
- **Border:** 1px solid #003366
- **Hover:** #002244
- **Color:** white
- **Font:** bss-pridi, 18px, weight 500
- **Border radius:** 7.5px (SVG verified: rx=7.5)
