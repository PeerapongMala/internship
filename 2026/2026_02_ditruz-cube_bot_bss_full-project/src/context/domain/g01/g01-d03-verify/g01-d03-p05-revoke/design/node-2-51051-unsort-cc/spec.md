# Revoke UNSORT CC - Design Spec (Figma Node 2:51051)

## Page Overview
Full-width page (1440px) for revoking unsorted CC header cards. Contains a top navigation bar, page title with date/supervisor info, a filter bar, two data tables, and a Revoke action button.

## Design Tokens (from Figma)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#003366` (`#036`) | Revoke button background, nav active link |
| Body Text / Body Color | `#212529` | Main text color |
| Text Neutral Primary | `#212121` | Page title, table headers, labels |
| Gray/White | `#FFFFFF` | Page background, table background, card background |
| Gray/400 | `#CED4DA` | Input borders, select borders |
| Gray/600 | `#6C757D` | Placeholder text color |
| Gray/800 | `#343A40` | (available for dark text) |
| Theme/Danger | `#DC3545` | (available for error states) |
| Theme/Border | `#DEE2E6` | Checkbox border, table separators |
| Theme/Body Background | `#FFFFFF` | Page background |
| Separator Opaque | `#CBD5E1` | Table outer border, row borders |
| Table Header BG | `#D6E0E0` | Table header row background |
| Selected Row BG | `#D1E5FA` | Selected row background |
| Selected Row Border | `#297ED4` | Selected row border (2px) |
| Alternating Row BG | `#F2F6F6` | Zebra striping for table rows |
| Nav Bar BG | `#F2B091` (rgba(245,167,131,0.85)) | Top navigation background |
| Denomination Badge BG | `#FBF8F4` | Denomination badge background |
| Denomination Badge Border | `#9F7D57` | Denomination badge border (2px) |
| Denomination Badge Text | `#4F3E2B` | Denomination badge text |
| Filter Button BG | `#036` (Primary) | Filter button fill |

### Typography (Font: Pridi)
| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| Heading H6 (SemiBold) | 30px | 600 | 1.2 | 0.675px | Page title "Revoke UNSORT CC" |
| Section Title (SemiBold) | 16px | 600 | 1.2 | 0.4px | Section headers (e.g. "รายการ Header Card") |
| Table Header (Medium) | 13px | 500 | normal | ~0.3px | Table column headers |
| Body/Small (Regular) | 14px | 400 | 1.5 | 0.35px | Filter labels, info text |
| Table Cell (Regular) | 12px | 400 | 13px | 0.3px | Table cell data |
| Table Cell Number (Regular) | 14px | 400 | 1.5 | 0.35px | Numeric values (right-aligned) |
| Select Placeholder (Regular) | 14px | 400 | 1.5 | 0.35px | Dropdown placeholder "Please select" |
| Button Text (Medium) | 20px | 500 | 1.5 | 0.5px | Revoke button label |
| Nav System Text (Medium) | 13px | 500 | normal | 0.325px | Nav bar system name |
| Denomination Badge (Bold) | 13px | 700 | normal | 0.325px | "1000" badge text |
| Info Text (Regular) | 12px | 400 | normal | 0.3px | Date/Supervisor labels |

### Spacing & Sizing
| Property | Value | Usage |
|----------|-------|-------|
| Page padding (horizontal) | 16px | Main content horizontal padding |
| Title row height | 62px | Title + date/supervisor area |
| Title row gap | 30px | Gap between title and info |
| Filter bar padding | 12px top/bottom, 16px horizontal | Filter row padding |
| Filter gap | 4px | Gap between label and select |
| Select border-radius | 4px (small) | Filter dropdowns |
| Select padding | 5px top/bottom, 9px left, 13px right | Small select |
| Table border-radius | 12px | Table card corners |
| Table border | 1px solid #CBD5E1 | Table outer border |
| Table header min-height | 45px (section), 30px (column headers) | Table header rows |
| Table header padding | 16px horizontal, 8px vertical (section) | Section header |
| Table header cell padding | 8px | Column header cells |
| Table row height | 33px (Table 1), 40px (Table 2) | Data row height |
| Table row cell padding | 8px horizontal, 6px vertical | Data cell padding |
| Checkbox size | 16px x 16px | Checkbox input |
| Checkbox border-radius | 4px | Unchecked checkbox |
| Sort icon size | 12px x 12px | Column sort indicator |
| Denomination badge | 47px x 24px | Currency denomination badge |
| Revoke button | 229px wide | Button width |
| Revoke button padding | 17px horizontal, 9px vertical | Button padding |
| Revoke button border-radius | 8px | Button corners |
| Gap between tables | inherent flex gap | Space between Table 1 and Table 2 |
| Bottom action row padding | 8px vertical | Row containing Revoke button |
| Gap in action row | 16px | Between spacer and button |

## Layout Structure

### 1. Navigation Bar (top, full width 1440px, h=40px)
- BG: `#F2B091` with 85% opacity
- Contains: BSS logo, system name "ระบบตรวจสอบการนับคัดธนบัตร Version 1.0.0"
- Menu items: Pre-Preparation Unsort, Auto Selling, **Revoke** (active), Approve Manual Key-in, Report
- Right side: user avatar, notification bell, user info

### 2. Page Title Row (h=62px)
- Left: "Revoke UNSORT CC" (Pridi SemiBold 30px, color #212121)
- Right: Date "21/7/2568 16:26", Supervisor name

### 3. Filter Bar
- Contained in a row with border-bottom
- 4 dropdowns in a flex row:
  1. **ธนาคาร:** (Bank) - Select small, "Please select"
  2. **Zone:** - Select small, "Please select"
  3. **Cashpoint:** - Select small, "Please select"
  4. **ชนิดราคา:** (Denomination) - Select small, "Please select"
- **Filter button** (right side): Primary blue (#036) with white filter icon, rounded 8px, text "Filter"

### 4. Table 1: "รายการ Header Card" (Header Card List)
- Card container: white bg, 1px border #CBD5E1, border-radius 12px
- Section header: "รายการ Header Card" (Pridi SemiBold 16px)
- Column header row: bg #D6E0E0, border-bottom #CBD5E1
- **Columns (7):** Checkbox | Header Card | ธนาคาร | Zone | Cashpoint | วันเวลาเตรียม | วันเวลานับคัด | shift
- Each column header: Pridi Medium 13px, with sort icon (12px)
- Row height: ~33px
- Selected row: bg #D1E5FA, 2px border #297ED4, with checked checkbox
- Unselected rows: white bg, unchecked checkbox
- Zebra striping not visible in Table 1 (all white except selected)
- Sample data: "0054231020", "ธ.กรุงเทพ", "Z.002", "ธ.กรุงเทพ สาขาเพลินจิต"

### 5. Table 2: "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้"
- Card container: white bg, 1px border #CBD5E1, border-radius 12px
- Section header: above text (Pridi Medium 16px)
- Column header row: bg #D6E0E0, h=30px
- **Columns (4):** ชนิดราคา (Denomination) | ประเภท (Type) | แบบ (Pattern) | จำนวนฉบับ (Quantity, right-aligned)
- Row height: 40px
- Zebra striping: odd rows #F2F6F6, even rows white
- **Denomination badge:** 47x24px, bg #FBF8F4, 2px border #9F7D57, text "1000" in Pridi Bold 13px #4F3E2B
- Cell data: Pridi Regular 12px, #212529
- Quantity column: right-aligned, Pridi Regular 14px
- Sample data rows:
  - 1000 | ดี | 17 | 995
  - 1000 | ทำลาย | 17 | 1
  - 1000 | Reject | 17 | 4
- Empty rows with alternating bg below data

### 6. Action Row (bottom)
- Flex row, justify-end, padding 8px vertical
- **Revoke Button:** w=229px, bg #003366, border 1px #003366, border-radius 8px, padding 17px/9px
  - Text: "Revoke" (Pridi Medium 20px, white, tracking 0.5px)

## Component Tree
```
Page (1440px)
  +-- Background (gradient overlay images)
  +-- NavigationBar (h=40px, bg=#F2B091)
  +-- Content Area (px=16px)
      +-- Title Row (h=62px)
      |     +-- "Revoke UNSORT CC" (left)
      |     +-- Date + Supervisor (right)
      +-- Filter Bar
      |     +-- ธนาคาร: [Select]
      |     +-- Zone: [Select]
      |     +-- Cashpoint: [Select]
      |     +-- ชนิดราคา: [Select]
      |     +-- [Filter Button]
      +-- Table 1: รายการ Header Card
      |     +-- Section Header
      |     +-- Column Headers (with checkboxes + sort icons)
      |     +-- Data Rows (selectable with checkbox)
      +-- Table 2: แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้
      |     +-- Section Header
      |     +-- Column Headers (with sort icons)
      |     +-- Data Rows (with denomination badges)
      +-- Action Row
            +-- [Revoke Button] (right-aligned)
```
