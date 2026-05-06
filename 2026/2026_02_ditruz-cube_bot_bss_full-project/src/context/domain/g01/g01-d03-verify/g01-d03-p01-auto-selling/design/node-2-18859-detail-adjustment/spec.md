# Node 2:18859 — Auto Selling - Unsort CC มัดขาด-เกิน แสดงรายละเอียดการปรับยอดธนบัตร

> **Date**: 2026-02-19
> **Figma Node**: `2:18859`
> **State**: User clicked a Header Card from the RIGHT panel (มัดขาด-เกิน) — both detail panel AND adjustment panel are now visible

---

## Overall Layout

- **Page size**: 1440 x 900px
- **Main content area** (below nav+toolbar): starts at y=40, frame `2:19090` (1440 x 860px)
- **Filter bar**: `2:19132` — 1408 x 63px, 5 dropdown filters (Header Card, ธนาคาร, Zone, Cashpoint, ชนิดราคา)
- **Data area** (`2:19153`): 1408 x 663px — split into LEFT (844.8px) and RIGHT (555.2px)

## What's DIFFERENT from Default State (2:20263)

### Key Change: Click Header Card in RIGHT panel triggers TWO new panels

In the **default state**, the LEFT panel shows 3 tables stacked vertically (มัดครบจำนวน, มัดรวมครบจำนวน, and empty space). In this state:

1. **Detail Panel** appears in the BOTTOM-LEFT (position y=447.33 within left panel)
2. **Adjustment Panel (Editor View)** appears in the BOTTOM-RIGHT (position y=454 within right panel)
3. The **selected row** in the RIGHT panel (มัดขาด-เกิน table) is highlighted with a blue checkbox and "Edited" badge

---

## LEFT Panel — 3 Sections (844.8px wide)

### Section 1: มัดครบจำนวน ครบมูลค่า (2:19155)
- **Position**: y=0, height ~215.67px
- **List Header** (`2:19156`): brown/gold bar, text "มัดครบจำนวน ครบมูลค่า" + "จำนวน: 1,000 ฉบับ"
- **Table columns**: Checkbox(20px) | Header Card(137.45px) | ชนิดราคา(80px) | วันเวลานับคัด(101px) | จำนวนฉบับ(137.45px) | มูลค่า(137.45px) | สถานะ(137.45px) | Action(78px)
- 1 data row shown (0054941520, 1000, 21/07/2568 14:00, 1,000, 1,000,000, Auto Selling)

### Section 2: มัดรวมครบจำนวน ครบมูลค่า (2:19238)
- **Position**: y=223.67, height ~215.67px
- **List Header** (`2:19239`): "มัดรวมครบจำนวน ครบมูลค่า" + "จำนวน: 2,000 ฉบับ"
- **Table columns**: Checkbox(20px) | Header Card(125.56px) | ชนิดราคา(80px) | วันเวลานับคัด(101px) | จำนวนฉบับ(125.56px) | มูลค่า(125.56px) | สถานะ(125.56px) | Action(125.56px)
- 2 data rows (0054941537: 1,995 / 1,995,000; 0054941538: 5 / 5,000)

### Section 3: แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก (2:19399) — NEW IN THIS STATE
- **Position**: y=447.33, height ~215.67px
- **Container**: white bg, border `#cbd5e1`, border-radius 12px
- **Title bar** (`2:19402`): "แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก" + "จำนวนธนบัตร: **997** ฉบับ" (997 in bold orange/warning color `#b45309`)
- **Table header** (`2:19409`): bg `#d6e0e0`, height 30px
- **8 columns** (all flex:1 except ชนิดราคา=80px fixed):
  - Header Card | ธนาคาร | Cashpoint | ชนิดราคา(80px) | ประเภท | แบบ | จำนวนฉบับ | มูลค่า
- **Data rows**:
  - Row 1: 0054941525, BBL, สีลม, 1000, ทำลาย, 17, 990, 990,000
  - Row 2 (alt bg `#f2f6f6`): 0054941525, BBL, สีลม, 1000, ดี, 17, 4, 4,000
  - Row 3: 0054941525, BBL, สีลม, 1000, Reject, 17, 3, 3,000

---

## RIGHT Panel — 4 Sections (555.2px wide, node 2:19508)

### Section A: มัดขาด-เกิน (Instance 2:19509)
- Height: ~143.33px
- Title: "มัดขาด-เกิน" in red/danger color + "จำนวน: **997** ฉบับ"
- Selected row: 0054941525 (1000, 21/07/2568 14:00, 997, 997,000, **Edited** badge)
- Row is highlighted with blue checkbox checked

### Section B: มัดรวมขาด-เกิน (Instance 2:19510)
- Height: ~143.33px
- Title: "มัดรวมขาด-เกิน" + "จำนวน: 1,998 ฉบับ"
- Columns: Header Card | ชนิดราคา | วันเวลานับคัด | จำนวนฉบับ | มูลค่า | สถานะ

### Section C: มัดเกินโดยขอจากเครื่องจักร (Instance 2:19511)
- Height: ~143.33px
- Title: "มัดเกินโดยขอจากเครื่องจักร" + "จำนวน: 1,002 ฉบับ เกิน: **2** ฉบับ" (2 in red/bold)

### Section D: ปรับข้อมูลผลนับคัด — Editor View (2:19512) — NEW IN THIS STATE
- **Position**: y=454, height 209px
- **Container**: white bg, border `#cbd5e1`, border-radius 12px, padding 16px horizontal / 12px vertical, gap 4px between children
- **Title**: "ปรับข้อมูลผลนับคัด" — font Pridi Medium, 16px, weight 500, color `#212121`
- **Form fields** (4 columns, gap 24px between them):
  1. **Header Card** (read-only): bg `#ededed`, border `#e0dfe2`, rounded 8px, value "0054941525" in SemiBold 16px
  2. **ชนิดราคา** (dropdown): white bg, border `#e0dfe2`, rounded 8px, value "1000" + angle-down icon
  3. **แบบ** (dropdown): white bg, border `#e0dfe2`, rounded 8px, value "17" + angle-down icon
  4. **จำนวน (ฉบับ)** (input): white bg, border `#e0dfe2`, rounded 8px, value "3"
- **หมายเหตุ** (remark): full-width text input, same style as above, height 36px
- **Radio buttons row** (height 38px):
  - Group 1 (เพิ่ม/ลด): "เพิ่ม" selected (blue radio `#0d6efd`), "ลด" unselected
  - Separator: 1px line, color `#d9d9d9`
  - Group 2 (Normal/Add-on/Ent. JAM): "Normal" selected, "Add-on", "Ent. JAM" unselected
  - Separator: 1px line
  - **บันทึก button**: bg `#198754` (success green), text white "บันทึก", width 120px, height 38px, rounded 6px

---

## Typography Summary

| Element | Font | Size | Weight | Color | Letter-spacing |
|---------|------|------|--------|-------|----------------|
| Panel title (H6) | Pridi | 16px | Medium (500) | `#212121` | 0.4px |
| Table header | Pridi | 13px | Medium (500) | `#212121` | 0.299px |
| Table body | Pridi | 13px | Regular (400) | `#212529` | 0.286px |
| Form label | Pridi | 14px | Regular (400) | `#212121` | 0.35px |
| Form value (read-only) | Pridi | 16px | SemiBold (600) | `#212121` | 0.4px |
| Form value (editable) | Pridi | 13px | Regular (400) | `#212121` | 0.325px |
| Radio label | Pridi | 14px | Regular (400) | `#212529` | 0.35px |
| Button text | Pridi | 16px | Regular (400) | `#FFFFFF` | 0.4px |
| Count badge (warning) | Pridi | 14px | Bold (700) | `#b45309` | — |

## Color Summary

| Usage | Color |
|-------|-------|
| Primary text | `#212121` |
| Body text | `#212529` |
| Border / separator | `#cbd5e1` |
| Table header bg (detail) | `#d6e0e0` |
| Alt row bg | `#f2f6f6` |
| Form read-only bg | `#ededed` |
| Form input border | `#e0dfe2` |
| Radio divider | `#d9d9d9` |
| Radio checked | `#0d6efd` |
| Save button bg | `#198754` |
| Warning count text | `#b45309` |
| Denomination badge bg | `#fbf8f4` |
| Denomination badge border | `#9f7d57` |
| Denomination badge text | `#4f3e2b` |
| Panel container bg | `#FFFFFF` |
| Panel border-radius | 12px |

## Interaction Pattern

1. User clicks a row (Header Card) in the RIGHT panel "มัดขาด-เกิน" table
2. The row becomes selected (blue checkbox, "Edited" badge)
3. Bottom-left panel appears: **Detail panel** showing breakdown by ประเภท (ทำลาย/ดี/Reject) for that Header Card
4. Bottom-right panel appears: **Adjustment panel** (Editor View) pre-filled with the Header Card data
5. User can adjust: ชนิดราคา, แบบ, จำนวน(ฉบับ), หมายเหตุ
6. User selects เพิ่ม/ลด and Normal/Add-on/Ent. JAM
7. User clicks "บันทึก" to save
