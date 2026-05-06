# Design Audit Checklist — Reconciliation Transaction

> **วัตถุประสงค์**: เทียบ Implementation กับ Figma Design อย่างเป็นระบบ สำหรับ Design Agent ใช้ตรวจสอบ
> **Figma Reference Node**: `32:26428` (Unfit variant)
> **Page**: Reconciliation Transaction
> **Last Audit**: 2026-02-18

---

## วิธีใช้ Checklist นี้

1. เปิด Figma MCP tools พร้อมกับ checklist นี้
2. ทำทีละ section — ใช้ `get_screenshot` ดูภาพ + `get_design_context` ดูค่า CSS
3. เทียบค่าใน column "Figma Spec" กับ code จริง
4. ใส่ ✅ / ❌ / ⚠️ ใน column "Status"
5. ถ้าพบ discrepancy ให้บันทึกใน "Notes" พร้อม line number ของ code

**สัญลักษณ์**:
- ✅ = ตรงกับ Figma
- ❌ = ไม่ตรง ต้องแก้
- ⚠️ = ใกล้เคียงแต่มีส่วนต่างเล็กน้อย
- 🔍 = ต้องตรวจสอบเพิ่ม (ไม่สามารถเทียบจาก code อย่างเดียว)

---

## 1. Page Layout Structure

> **Figma Source**: `get_metadata(32:26437)` — Frame layout coordinates
> **Key Principle**: Layout structure ต้องตรง ก่อนจะดู detail

### 1.1 Overall Page Structure

| # | Check Item | Figma Spec | Figma Node | Status | Notes |
|---|-----------|-----------|------------|--------|-------|
| 1.1.1 | Page has title bar row | Full width, h=62px | 32:26438 | | |
| 1.1.2 | Title bar: title left + nav buttons right | Title w=1035, Buttons w=368 | 32:26439, 32:26443 | | |
| 1.1.3 | Nav buttons count = 3 | เปิดหน้าจอ 2, Holding, Holding Detail | 32:26444-32:26454 | | |
| 1.1.4 | Below title: top row = Scanner + Info Card side by side | Scanner w≈1071, Info w≈316, gap≈16px | 32:26460, 32:26511 | | |
| 1.1.5 | Below top row: 3 panels side by side | Left+Center+Right, gap=8px | 32:26681, 32:26774, 32:26535 | | |
| 1.1.6 | Info Card aligned with Right Panel vertically | Both w≈316px | 32:26512, 32:26535 | | |

### 1.2 Panel Proportions

| # | Check Item | Figma Spec (px) | Figma Ratio | CSS Equivalent | Status | Notes |
|---|-----------|----------------|-------------|---------------|--------|-------|
| 1.2.1 | Left panel width | 445px | ~3.0 | flex: 3 | | |
| 1.2.2 | Center panel width | 607px | ~4.1 | flex: 4 | | |
| 1.2.3 | Right panel width | 316px | ~2.1 | flex: 2 ⚠️ | | Current code: flex:3 |
| 1.2.4 | Scanner section width | 1071px | ~7.1 | flex: 7 | | |
| 1.2.5 | Info card width | 316px | ~2.1 | flex: 3 ⚠️ | | Should match right panel |
| 1.2.6 | Gap between panels | ~8-16px | | gap: 8px | | |

### 1.3 Section Placement

| # | Check Item | Figma Spec | Status | Notes |
|---|-----------|-----------|--------|-------|
| 1.3.1 | Info Card is NOT inside right panel | Info card = separate element next to scanner | | |
| 1.3.2 | Info Card is NOT below scanner | Info card = same vertical level as scanner | | |
| 1.3.3 | Right panel only contains "Header Card from Machine" | No "Info" header in right panel | | |
| 1.3.4 | Filter row is inside scanner card | Not a separate section | | |
| 1.3.5 | Tables start below scanner+info row | y≈298 (after title+scanner) | | |

---

## 2. Colors

> **Figma Source**: `get_variable_defs(2:36001)` + `get_design_context` per component
> **Key Principle**: ใช้ค่า hex จาก design tokens เท่านั้น อย่าเดาสี

### 2.1 Background Colors

| # | Element | Figma Color | Token Name | CSS Selector | Status | Notes |
|---|---------|------------|------------|-------------|--------|-------|
| 2.1.1 | Page background (Unfit) | `linear-gradient(98.93deg, #BFD7E1 0.74%, #8B9DAF 100%)` | — | `body::before` | | From Style.css |
| 2.1.2 | Scanner card bg | `#FFFFFF` | Gray/White | `.scanner-section` | | |
| 2.1.3 | Info card bg | `#FFFFFF` | Gray/White | `.info-card` | | |
| 2.1.4 | Panel bg | `#FFFFFF` | Gray/White | `.panel` | | |
| 2.1.5 | Panel header bg | `#FFFFFF` | Gray/White | `.panel-header` | | NOT colored! |
| 2.1.6 | Table header bg | `#d6e0e0` | — | `.data-table thead th` | | |
| 2.1.7 | Table row odd bg | `#FFFFFF` | — | `tr:nth-child(odd)` | | |
| 2.1.8 | Table row even bg | `#f2f6f6` | — | `tr:nth-child(even)` | | |
| 2.1.9 | Table row hover bg | `#e8eef4` | — | `tr:hover` | | |
| 2.1.10 | Warning row bg | `#F8D7DA` | Callout Danger BG | `tr.row-warning` | | |
| 2.1.11 | Selected row bg | `#d4edfc` | — | `tr.row-selected` | | |
| 2.1.12 | Scanner input bg | `#d1e5fa` | — | `.scanner-input` | | |
| 2.1.13 | Button primary bg | `#003366` | Primary | `.btn-filter, .btn-refresh` | | |
| 2.1.14 | Action button bg (normal) | `transparent` / `white` | — | `.btn-action` | | |
| 2.1.15 | Action button bg (danger) | `#dc3545` | Danger | `.btn-action-danger` | | |
| 2.1.16 | Empty row stripe bg | alternating white/#f2f6f6 | — | `.panel-table-scroll` gradient | | |

### 2.2 Text Colors

| # | Element | Figma Color | Token Name | CSS Property | Status | Notes |
|---|---------|------------|------------|-------------|--------|-------|
| 2.2.1 | Page title | `#212121` | text-neutral-primary | `.main-title h1` | | |
| 2.2.2 | Panel header title | `#212121` | text-neutral-primary | `.panel-title` | | |
| 2.2.3 | Scanner title | `#212121` | text-neutral-primary | `.scanner-title` | | |
| 2.2.4 | Table header text | `#212121` | text-neutral-primary | `thead th` | | |
| 2.2.5 | Table body text | `#013661` | — | `tbody td` | | Dark navy blue |
| 2.2.6 | Count badge "100" | `#b45309` | text-warning-primary | `.count-badge` | | Bold orange |
| 2.2.7 | Warning row text | `#991b1b` | text-negative-primary | `.row-warning td` | | |
| 2.2.8 | No data text | `#909090` | text-neutral-tertiary | `.no-data-row td` | | |
| 2.2.9 | Info label text | `#212121` | text-neutral-primary | `.info-row-label` | | |
| 2.2.10 | Info value text | `#212529` | Body Text | `.info-row` | | |
| 2.2.11 | Filter select placeholder | `#6c757d` | Gray/600 | `.filter-select` | | |
| 2.2.12 | Button text | `#FFFFFF` | white | `.btn-filter, .btn-nav` | | |

### 2.3 Border Colors

| # | Element | Figma Color | Token Name | CSS Property | Status | Notes |
|---|---------|------------|------------|-------------|--------|-------|
| 2.3.1 | Panel header border-bottom | `#cbd5e1` | Gray-300/Separator | `.panel-header` | | |
| 2.3.2 | Table cell border | `#cbd5e1` | Gray-300/Separator | `td, th` border | | |
| 2.3.3 | Scanner input outer border | `rgba(41,126,212,0.5)` 5px | — | `.scanner-input-wrapper` | | |
| 2.3.4 | Scanner input inner border | `#297ed4` 3px | — | `.scanner-input` | | |
| 2.3.5 | Filter select border | `#ced4da` 1px | Gray/400 | `.filter-select` | | |
| 2.3.6 | Action button border (normal) | `black` / `#000000` 1px | icons/icon-black | `.btn-action` | | |
| 2.3.7 | Action button border (danger) | `#dc3545` 1px | Danger | `.btn-action-danger` | | |
| 2.3.8 | Denom badge border | Per denomination, 2px | — | `.denom-badge-*` | | |

### 2.4 Denomination Badge Colors

| # | Denom | Background | Border Color | Text Color | Figma Node | Status |
|---|-------|-----------|-------------|-----------|------------|--------|
| 2.4.1 | 20 | `#f1f9f1` | `#55b254` | `#55b254` | — | | |
| 2.4.2 | 50 | `#f0f8ff` | `#35a0fd` | `#015cab` | — | | |
| 2.4.3 | 100 | `#fff5f5` | `#c07575` | `#8f4242` | 32:26806 | | |
| 2.4.4 | 500 | `#f8f5ff` | `#6a509d` | `#3d2e5b` | — | | |
| 2.4.5 | 1000 | `#fbf8f4` | `#9f7d57` | `#4f3e2b` | — | | |

---

## 3. Typography

> **Figma Source**: `get_variable_defs` → Typography tokens + `get_design_context` per element
> **Key Principle**: ทุก text element ต้องมี font-family, size, weight, letter-spacing ตรงกับ Figma

### 3.1 Font Family

| # | Check Item | Figma Spec | Status | Notes |
|---|-----------|-----------|--------|-------|
| 3.1.1 | All text uses Pridi font | `font-family: 'Pridi', sans-serif` | | Loaded via all.css |
| 3.1.2 | Font loaded correctly (via CSS/link) | @import or `<link>` in layout | | |

### 3.2 Text Specifications

| # | Element | Size | Weight | Letter Spacing | Line Height | Figma Node | Status |
|---|---------|------|--------|---------------|-------------|------------|--------|
| 3.2.1 | Page title H1 | 16px? | 500 (Medium) | 2.5px | 1.2 | — | 🔍 |
| 3.2.2 | Panel header title | 16px | 500 (Medium) | 0.4px | 1.2 | 32:29201 | | |
| 3.2.3 | Scanner title | 16px | 500 (Medium) | 0.352px | normal | 32:26462 | | |
| 3.2.4 | Scanner field label | 14px | 400 (Regular) | 0.35px | normal | 32:26466 | | |
| 3.2.5 | Count text | 20px | 400 (Regular) | 0.5px | 1.5 | 32:26475 | | |
| 3.2.6 | Count badge "100" | 20px | 700 (Bold) | 0.5px | 1.5 | 32:26476 | | |
| 3.2.7 | Location row | 16px | 500 (Medium) | 0.352px | normal | 32:26479 | | |
| 3.2.8 | Table header text | 13px | 500 (Medium) | 0.299px | normal | 32:29204 | | |
| 3.2.9 | Table body text | 13px | 400 (Regular) | 0.286px | normal | 32:29220 | | |
| 3.2.10 | Table datetime text | 12px | 400 (Regular) | 0.264px | 13px | 32:29222 | | Smaller! |
| 3.2.11 | Denom badge text | 13px | 700 (Bold) | — | normal | 32:26808 | | |
| 3.2.12 | Filter label | 14px | 400 (Regular) | 0.35px | normal | 32:26497 | | |
| 3.2.13 | Filter select text | 14px/16px | 400 (Regular) | 0.35px/0.4px | 1.5 | — | | Small vs Medium |
| 3.2.14 | Button text | 14px | 500 (Medium) | 0.35px | 1.5 | 32:26485 | | |
| 3.2.15 | Info card label | 13px | 600? (Medium) | — | normal | 32:26514 | 🔍 | |
| 3.2.16 | Info card value | 13px | 400 (Regular) | — | normal | 32:26517 | 🔍 | |

---

## 4. Icons

> **Figma Source**: `get_design_context` per button/action node
> **Key Principle**: Icon style (fill vs outline), size, และ color ต้องตรง — AI มักเลือก style ผิด

### 4.1 Icon Style & Type

| # | Location | Icon Name | Style | Size | Color | Figma Node | Status | Notes |
|---|---------|-----------|-------|------|-------|------------|--------|-------|
| 4.1.1 | Action: Edit btn | pencil / pencil-fill | 🔍 Fill or Outline? | 14px | `black` / `#333` | 32:29228 | | Check via screenshot |
| 4.1.2 | Action: Delete btn | trash / trash-fill | 🔍 Fill or Outline? | 14px | `black` / `#333` | 32:29229 | | Check via screenshot |
| 4.1.3 | Action: Danger delete | trash-fill | Fill | 14px | `white` | — | | On red bg |
| 4.1.4 | Filter button icon | filter-circle | 🔍 | 16px | `white` | 32:26483 | | |
| 4.1.5 | Refresh button icon | arrow-clockwise | 🔍 | 16px | `white` | 32:26488 | | |
| 4.1.6 | Nav: เปิดหน้าจอ 2 | TV / display icon | 🔍 | 16px | `white` | 32:26445 | | |
| 4.1.7 | Warning indicator | exclamation-circle-fill | Fill | 12-14px | `#dc3545` (red) | 32:26860 | | Next to header card text |
| 4.1.8 | Sort icon (table header) | sort / caret arrows | — | 12px | — | 32:29206 | | |
| 4.1.9 | Date notification dot | circle-fill | Fill | 14px | red | 32:26518 | | Next to datetime in info card |

### 4.2 Common AI Icon Mistakes

| # | Mistake | Description |
|---|---------|------------|
| 4.2.1 | Outline vs Fill | AI มักใช้ `bi-pencil` (outline) แทน `bi-pencil-fill` (fill) — ต้องตรวจ Figma ว่าใช้ style ไหน |
| 4.2.2 | Icon library mismatch | Figma ใช้ custom icon แต่ AI เลือก Bootstrap Icons ที่ไม่ตรง |
| 4.2.3 | Icon size wrong | Figma กำหนด 14px แต่ AI ใช้ default 16px |
| 4.2.4 | Missing icons | AI ลืมใส่ warning indicator icon ข้าง text |
| 4.2.5 | Icon color wrong | Icon ใน dark bg ต้องเป็นสีขาว แต่ AI ใช้ default color |

---

## 5. Components

> **Key Principle**: ทุก component ต้องเทียบ dimensions, padding, border-radius, shadow

### 5.1 Scanner Section

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.1.1 | Container bg | white | `.scanner-section` | | |
| 5.1.2 | Container border-radius | 12px | `.scanner-section` | | |
| 5.1.3 | Container padding | 16px 24px | `.scanner-section` | | |
| 5.1.4 | Container gap (flex-col) | 8px | `.scanner-section` | | |
| 5.1.5 | Input wrapper outer border | 5px solid rgba(41,126,212,0.5) | `.scanner-input-wrapper` | | |
| 5.1.6 | Input wrapper border-radius | 8px | `.scanner-input-wrapper` | | |
| 5.1.7 | Input width | 390.5px | `.scanner-input-wrapper` | | |
| 5.1.8 | Input height | 41px | `.scanner-input-wrapper` | | |
| 5.1.9 | Input inner border | 3px solid #297ed4 | `.scanner-input` | | |
| 5.1.10 | Input bg | #d1e5fa | `.scanner-input` | | |
| 5.1.11 | Filter/Refresh btn height | 41px | `.btn-filter, .btn-refresh` | | |
| 5.1.12 | Filter/Refresh btn bg | #003366 | `.btn-filter, .btn-refresh` | | |
| 5.1.13 | Filter/Refresh btn border-radius | 4px | `.btn-filter, .btn-refresh` | | |
| 5.1.14 | Filter/Refresh btn gap (icon+text) | 8px | `.btn-filter, .btn-refresh` | | |
| 5.1.15 | Clear Filter btn height | 31px | `.btn-clear-filter` | | |
| 5.1.16 | Clear Filter btn bg | #003366 | `.btn-clear-filter` | | |

### 5.2 Info Card

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.2.1 | Card bg | white | `.info-card` | | |
| 5.2.2 | Card border-radius | 12px | `.info-card` | | |
| 5.2.3 | Card padding | 12-16px | `.info-card` | | |
| 5.2.4 | Card width matches right panel | ~316px (flex: 3 or flex: 2) | `.info-card` flex | | |
| 5.2.5 | Number of info rows | 5 (Date, Sorter, Reconciliator, Sorting Machine, Shift) | HTML | | |
| 5.2.6 | Info row height | ~20px per row | `.info-row` | | |
| 5.2.7 | Label min-width | ~120px | `.info-row-label` | | |
| 5.2.8 | Has date notification dot (red) | Red circle icon next to date value | HTML | | |
| 5.2.9 | No "Info" title/header | Info card has NO panel-header | HTML | | |

### 5.3 Panel Headers

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.3.1 | Header bg | white (NOT colored) | `.panel-header` | | |
| 5.3.2 | Header padding | 8px 16px | `.panel-header` | | |
| 5.3.3 | Header border-bottom | 1px solid #cbd5e1 | `.panel-header` | | |
| 5.3.4 | Header text | Pridi Medium 16px #212121 | `.panel-title` | | |
| 5.3.5 | Left panel: "Preparation" | ✓ | HTML | | |
| 5.3.6 | Center panel: "Preparation + Data from Machine" | ✓ | HTML | | |
| 5.3.7 | Right panel: "Header Card from Machine" | NOT "Info" | HTML | | |

### 5.4 Denomination Badge

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.4.1 | Badge width | 47px | `.denom-badge` | | |
| 5.4.2 | Badge height | 24px | `.denom-badge` | | |
| 5.4.3 | Badge border-width | 2px | `.denom-badge` | | |
| 5.4.4 | Badge border-radius | 0 (square corners) | `.denom-badge` | | |
| 5.4.5 | Badge text size | 13px Bold | `.denom-badge` | | |
| 5.4.6 | Badge text centered | display: inline-flex + align/justify center | `.denom-badge` | | |
| 5.4.7 | Badge has banknote watermark image | mix-blend-color-burn opacity 0.3 | — | | Optional decorative |
| 5.4.8 | Badge not distorted/clipped | overflow visible, proper box-sizing | `.denom-badge` | | |

### 5.5 Action Buttons

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.5.1 | Button size (normal) | 20x20px | `.btn-action` | | ⚠️ Current: 28x28 |
| 5.5.2 | Button border | 1px solid black | `.btn-action` | | |
| 5.5.3 | Button bg (normal) | transparent / white | `.btn-action` | | |
| 5.5.4 | Button border-radius | 4px | `.btn-action` | | |
| 5.5.5 | Button gap between edit+delete | 6px | `.action-btns` gap | | |
| 5.5.6 | Button icon size | 14px (wrapper) | `.btn-action` font-size | | |
| 5.5.7 | Normal row: 2 buttons (edit + delete) | Both outline | render function | | |
| 5.5.8 | Warning row: varies by status | Some have 1 btn (delete only), some have 2 | render function | | Context-dependent |
| 5.5.9 | Danger button: red bg, white icon | bg #dc3545, color white | `.btn-action-danger` | | |

### 5.6 Table Structure

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.6.1 | Table border-collapse | collapse | `.data-table` | | |
| 5.6.2 | Table font-size | 13px | `.data-table` | | |
| 5.6.3 | Header row height | ~30px | `thead th` padding | | |
| 5.6.4 | Body row height | ~40px | `tbody td` padding | | |
| 5.6.5 | Header cell padding | 8px | `thead th` | | |
| 5.6.6 | Body cell padding | 6px 8px | `tbody td` | | |
| 5.6.7 | Sticky header | position: sticky; top: 0 | `thead` | | |
| 5.6.8 | Empty rows show striped bg | repeating-linear-gradient | `.panel-table-scroll` | | |
| 5.6.9 | Stripe row height | ~33px per stripe | gradient stops | | |
| 5.6.10 | Stripe offset for header | background-position-y: 35px | `.panel-table-scroll` | | |
| 5.6.11 | Sort icons in header cells | 12px sort/caret icon per column | HTML/CSS | | |
| 5.6.12 | Scrollbar visible | Custom scrollbar (4px wide) | `.panel-table-scroll` | | Optional |

### 5.7 Filter Section

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.7.1 | Filter inside scanner card | Not separate section | HTML structure | | |
| 5.7.2 | Filter layout | flex, justify-end, gap 24px | `.filter-row` | | |
| 5.7.3 | Select border | 1px solid #ced4da | `.filter-select` | | |
| 5.7.4 | Select border-radius | 4px | `.filter-select` | | |
| 5.7.5 | Select padding | 5px 9px-13px | `.filter-select` | | |
| 5.7.6 | Select placeholder color | #6c757d | `.filter-select` | | |
| 5.7.7 | Header Card select width | ~200px | `.filter-select` | | |
| 5.7.8 | ชนิดราคา select width | ~150px | `.filter-select` | | |

### 5.8 Nav Buttons

| # | Check Item | Figma Spec | CSS Selector | Status | Notes |
|---|-----------|-----------|-------------|--------|-------|
| 5.8.1 | Button bg | #003366 | `.btn-nav` | | |
| 5.8.2 | Button height | 36px | `.btn-nav` | | |
| 5.8.3 | Button border-radius | 4px | `.btn-nav` | | |
| 5.8.4 | Button text | Pridi Medium 14px white | `.btn-nav` | | |
| 5.8.5 | 3 buttons: เปิดหน้าจอ 2, Holding, Holding Detail | | HTML | | |

---

## 6. Spacing & Sizing

> **Key Principle**: Gap, margin, padding ต้องใช้ค่าจาก Design Tokens

### 6.1 Design Token Spacing Values

| Token | Value | Usage |
|-------|-------|-------|
| Space/s-zero | 0 | — |
| Space/s-xxxxsm | 2px | Sort icon gap |
| Space/s-xxxsm | 4px | Label-to-input gap, info row gap |
| Space/s-xsm | 8px | Main gaps, padding, panel gaps |
| Space/s-sm | 12px | Info card padding |
| Space/s-md | 16px | Panel header padding, scanner py |
| Space/s-lg | 24px | Scanner px, filter gap, button gap |

### 6.2 Critical Spacings

| # | Element | Figma Spec | CSS Property | Status | Notes |
|---|---------|-----------|-------------|--------|-------|
| 6.2.1 | Gap between scanner and info card | 8-16px | `.top-row` gap | | |
| 6.2.2 | Gap between panels | 8px | `.main-content` gap | | |
| 6.2.3 | Gap between top-row and panels | 8px | margin between sections | | |
| 6.2.4 | Scanner internal gap (flex-col) | 8px | `.scanner-section` gap | | |
| 6.2.5 | Scanner main-row gap | 8px | `.scanner-main-row` gap | | |
| 6.2.6 | Filter/Refresh button gap | 24px | `.scanner-actions` gap | | |
| 6.2.7 | Location row gap | 32px | `.scanner-location-row` gap | | |
| 6.2.8 | Action button gap | 6px | `.action-btns` gap | | |
| 6.2.9 | Info row gap | 4px | `.info-list` gap | | |

### 6.3 Border Radius

| # | Element | Figma Spec | CSS Selector | Status |
|---|---------|-----------|-------------|--------|
| 6.3.1 | Scanner card | 12px | `.scanner-section` | |
| 6.3.2 | Info card | 12px | `.info-card` | |
| 6.3.3 | Panels | 12px | `.panel` | |
| 6.3.4 | Scanner input | 8px | `.scanner-input-wrapper` | |
| 6.3.5 | Buttons (filter/nav/clear) | 4px | `.btn-filter, .btn-nav` | |
| 6.3.6 | Action buttons | 4px | `.btn-action` | |
| 6.3.7 | Filter select | 4px | `.filter-select` | |
| 6.3.8 | Denom badge | 0 (square) | `.denom-badge` | |

---

## 7. Variant CSS (4 BnType themes)

> **Figma Source**: Separate variant nodes (32:25438, 2:36001, 2:36565, 2:37129)
> **Key Principle**: เฉพาะ `body::before` gradient เปลี่ยน — component colors คงเดิมทุก variant

### 7.1 Background Gradients

| # | Variant | Gradient | CSS File | Status |
|---|---------|---------|---------|--------|
| 7.1.1 | Unfit (UF) | `linear-gradient(98.93deg, #BFD7E1 0.74%, #8B9DAF 100%)` | Style.css (default) | |
| 7.1.2 | Unsort CC (UC) | `linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%)` | reconcile-unsort-cc.css | |
| 7.1.3 | CA Member (CA) | `linear-gradient(90deg, #afc5aa, #d3e3cd)` | reconcile-ca-member.css | |
| 7.1.4 | CA Non-Member (CN) | `linear-gradient(90deg, #bac0d1, #c3d0de)` | reconcile-ca-non-member.css | |

### 7.2 Variant Consistency Checks

| # | Check Item | Expected | Status | Notes |
|---|-----------|---------|--------|-------|
| 7.2.1 | Panel headers stay white in all variants | `background: white` | | Override variant class |
| 7.2.2 | Table header bg stays #d6e0e0 in all variants | Not affected by variant | | |
| 7.2.3 | Button colors stay same in all variants | #003366 | | |
| 7.2.4 | Scanner input style stays same in all variants | #d1e5fa + #297ed4 border | | |
| 7.2.5 | Denom badge colors stay same in all variants | Per-denomination colors | | |

---

## 8. Responsive & Overflow

| # | Check Item | Expected | Status | Notes |
|---|-----------|---------|--------|-------|
| 8.1 | Table horizontal scroll | overflow-x: auto on scroll container | | |
| 8.2 | Table vertical scroll | overflow-y: auto, flex: 1, min-height: 0 | | |
| 8.3 | Panel min-width: 0 | Prevents flex overflow | | |
| 8.4 | Text overflow in table cells | text-overflow: ellipsis where needed | | |
| 8.5 | Long header card codes fit | No wrapping or clipping | | |

---

## 9. Warning/Error State

| # | Check Item | Figma Spec | Status | Notes |
|---|-----------|-----------|--------|-------|
| 9.1 | Warning row background | `#F8D7DA` | | |
| 9.2 | Warning row text color | `#991b1b` | | |
| 9.3 | Warning icon (exclamation) | red circle icon next to header card text | | |
| 9.4 | Warning row action buttons | Context-dependent: some rows only delete (red), some have both edit+delete | | |
| 9.5 | Delete button in warning row | Red bg #dc3545, white trash-fill icon | | |

---

## 10. Common AI Coding Mistakes (Patterns to Watch)

> บันทึก patterns ที่ AI ทำผิดซ้ำๆ เพื่อใช้เป็น reference สำหรับ audit ในอนาคต

### 10.1 Layout Mistakes

| # | Mistake | Description | How to Detect |
|---|---------|------------|--------------|
| L1 | **Wrong section nesting** | AI ใส่ Info Card ไว้ใน Right Panel แทนที่จะวางข้าง Scanner | เทียบ parent-child relationship กับ Figma metadata |
| L2 | **Wrong flex proportions** | AI ใช้ flex: 3:4:3 แต่ Figma คือ 3:4:2 | วัด px จาก Figma metadata แล้วคำนวณ ratio |
| L3 | **Missing wrapper divs** | AI ไม่สร้าง top-row wrapper ทำให้ scanner กับ info card ไม่ได้อยู่ในแถวเดียวกัน | ตรวจ HTML structure ว่ามี flex container ครบ |
| L4 | **Incorrect alignment** | AI ใช้ align-items: center แทน flex-end หรือกลับกัน | เทียบ Figma Tailwind class (items-center vs items-end) |

### 10.2 Color Mistakes

| # | Mistake | Description | How to Detect |
|---|---------|------------|--------------|
| C1 | **Guessing colors** | AI ใช้สีที่ "ดูเหมือน" แทนค่า hex จาก Figma (เช่น #f8f9fa แทน #d6e0e0) | เทียบ hex ทุกค่ากับ design tokens |
| C2 | **Panel header colored** | AI ใส่ variant gradient/color ให้ panel header แต่ Figma เป็น white | ตรวจ panel-header background ทุก variant |
| C3 | **Wrong text color** | AI ใช้ default black/inherit แต่ Figma กำหนด #013661 สำหรับ table body | ตรวจ color property ของ text elements |

### 10.3 Typography Mistakes

| # | Mistake | Description | How to Detect |
|---|---------|------------|--------------|
| T1 | **Missing letter-spacing** | AI มักข้าม letter-spacing — Figma กำหนดทุก text element | ตรวจ letter-spacing ใน CSS |
| T2 | **Wrong font-weight** | AI ใช้ 600 แทน 500 (Medium vs SemiBold) | เทียบ Figma font style name กับ weight |
| T3 | **Font size mismatch** | DateTime ใน table body คือ 12px ไม่ใช่ 13px | ตรวจ font-size per element type |

### 10.4 Icon Mistakes

| # | Mistake | Description | How to Detect |
|---|---------|------------|--------------|
| I1 | **Outline vs Fill** | AI ใช้ `bi-pencil` (outline) แทน `bi-pencil-fill` (fill) | เทียบ Figma screenshot ดู icon shape |
| I2 | **Wrong icon name** | AI เลือก `bi-funnel` แต่ Figma ใช้ `filter-circle` | ตรวจ icon ใน Figma design-context |
| I3 | **Missing status icons** | AI ลืมใส่ warning/notification icons ที่ติดอยู่กับ text | ตรวจ Figma metadata ว่ามี icon-wrapper ที่ซ่อนอยู่ |
| I4 | **Icon size wrong** | Action button icon ควร 14px แต่ AI ใช้ default 16px | ตรวจ size property ใน Figma node |

### 10.5 Component Mistakes

| # | Mistake | Description | How to Detect |
|---|---------|------------|--------------|
| CP1 | **Button size wrong** | Figma action button 20x20px แต่ AI ทำ 28x28px | ตรวจ width/height จาก Figma metadata |
| CP2 | **Badge distorted** | Fixed width+overflow:hidden ทำให้ text ถูก clip | ใช้ min-width + padding แทน fixed width |
| CP3 | **Border-radius wrong** | Denom badge ควรเป็น 0 (square) แต่ AI ใส่ rounded | ตรวจ border-radius จาก design-context |
| CP4 | **Double border pattern missed** | Scanner input มี 2 ชั้น (outer+inner) แต่ AI ทำชั้นเดียว | ตรวจ nested border structure จาก Figma |
| CP5 | **Empty table rows not striped** | AI ลืมทำ repeating-linear-gradient สำหรับ empty space | ตรวจ background ของ scroll container |

### 10.6 Data/Content Mistakes

| # | Mistake | Description | How to Detect |
|---|---------|------------|--------------|
| D1 | **Missing fields** | AI ลืม field เช่น "Sorter:" ใน info card | เทียบจำนวน rows/fields กับ Figma |
| D2 | **Wrong column headers** | AI ใช้ชื่อ column ไม่ตรง (เช่น "วันเวลา" vs "วันเวลาเตรียม") | เทียบ text content กับ Figma metadata |
| D3 | **Wrong number of panels** | AI สร้าง 2 panels แทน 3 หรือจัดแบ่งผิด | นับจำนวน panels จาก Figma metadata |

---

## Appendix A: Figma Node Reference

| Component | Node ID | MCP Tool |
|-----------|---------|----------|
| Full page (Unfit) | `32:26428` | get_screenshot |
| Page content area | `32:26437` | get_metadata |
| Scanner section | `32:26461` | get_design_context |
| Info card area | `32:26512` | get_metadata |
| Panel header (left) | `32:29199` | get_design_context |
| Table header row | `32:29202` | get_design_context |
| Table body row (normal) | `32:29217` | get_design_context |
| Denomination badge (100) | `32:26806` | get_design_context |
| Full page (Unsort CC) | `2:36001` | get_screenshot |
| Full page (CA Member) | `2:36565` | get_screenshot |
| Full page (CA Non-Member) | `2:37129` | get_screenshot |
| Popup section | `2:41247` | get_metadata |

## Appendix B: File Map

| File | Purpose |
|------|---------|
| `Views/Reconcilation/ReconcileTransaction/Index.cshtml` | HTML structure |
| `wwwroot/css/reconcile/reconcileTransaction.css` | Base CSS |
| `wwwroot/css/reconcile/reconcile-unsort-cc.css` | Unsort CC variant gradient |
| `wwwroot/css/reconcile/reconcile-ca-member.css` | CA Member variant gradient |
| `wwwroot/css/reconcile/reconcile-ca-non-member.css` | CA Non-Member variant gradient |
| `wwwroot/js/reconcile/reconcileTransaction.js` | JS logic + render functions |

## Appendix C: Audit History

| Date | Auditor | Issues Found | Issues Fixed |
|------|---------|-------------|-------------|
| 2026-02-18 | Claude Opus 4.6 | Initial audit — checklist created | — |
