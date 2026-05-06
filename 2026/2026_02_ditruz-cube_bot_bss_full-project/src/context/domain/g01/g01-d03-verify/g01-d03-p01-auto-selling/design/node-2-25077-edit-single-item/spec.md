# Spec - Edit Single Item (Node 2:25077)

**Node:** Edit Single Item / Preparation - Edit Single Item - 13
**Date:** 2026-02-19

## What is "Edit Single Item"?

"Edit Single Item" is a **review and confirmation popup** for editing a single header card's banknote counting data in the Auto-Selling verification workflow.

### How it differs from "Edit & Manual Key-in"
- **Edit Single Item** = edits **one header card** at a time (the title says "เตรียมแก้ไขข้อมูล 1 รายการ" = "Prepare to edit data for 1 item")
- It shows a **before/after comparison table** of denomination counts for that specific header card
- The user reviews changes already made and must **select a Manager** to approve the edit
- This is a **confirmation/review step** (ตรวจสอบการแก้ไข = "Review the edit"), not a data-entry screen

## Modal Dimensions

| Property | Value |
|----------|-------|
| Viewport overlay | 1440 x 900px, bg: rgba(12,12,12,0.38) |
| Modal width | 1280px (min: 560px, max: 1280px) |
| Modal height | 700px |
| Border radius | 12px |
| Border | 1px solid #eeeeee |
| Background | white (#ffffff) |

## Layout Sections

### 1. Top Bar
| Property | Value |
|----------|-------|
| Padding | 16px top, 8px bottom, 16px left/right |
| Border bottom | 1px solid #cbd5e1 (slate/300) |
| Background | white |
| Title text | "ตรวจสอบการแก้ไข" |
| Title font | Pridi Medium 24px, lh: 1.2, ls: 0.6px, color: black |

### 2. Content Area
| Property | Value |
|----------|-------|
| Padding | 24px all sides |
| Gap | 16px between children |
| Layout | flex-col, flex: 1 0 0 |

#### 2a. Sub-heading
- **"เตรียมแก้ไขข้อมูล 1 รายการ"** - Pridi Medium 24px, black
- **"Header Card  0054941526"** - Pridi Regular 16px, black, gap: 16px between label and value

#### 2b. Summary Table

**Table outer container:**
- Border: 1px solid #cbd5e1
- Border radius: 12px
- Overflow: clip-x, auto-y

**Summary header row:**
- Min-height: 45px, px: 16px, py: 8px, gap: 16px
- Left: "แสดงผลการนับคัด" (H6: 16px Medium, #212121)
- Right: Before/After counts with bold orange numbers (#b45309)
- Font for counts: 14px, ls: 0.308px

**Column header row:**
- Height: 30px, px: 8px
- Background: #d6e0e0 (teal-gray)
- Border bottom: 1px solid #cbd5e1
- Font: Pridi Medium 13px, #212121, ls: 0.299px
- Sort icons: 12x12px per column

**Columns:**

| Column | Name | Alignment | Header Color |
|--------|------|-----------|-------------|
| 1 | ชนิดราคา (Denomination) | left | #212121 |
| 2 | ประเภท (Type) | left | #212121 |
| 3 | แบบ (Series) | left | #212121 |
| 4 | ก่อนปรับ (ฉบับ) (Before) | right | #212121 |
| 5 | หลังปรับ (ฉบับ) (After) | right | #ca6510 (orange) |

**Data rows:**
- Height: 38px (approx), px: 8px
- Border bottom: 1px solid #cbd5e1
- Alternating: white / #f2f6f6
- Body text: Pridi Regular 12-13px, #212529
- "After" values: #ca6510 (orange), 13-14px
- Empty cells when no change occurred
- MoneyType badge in denomination column (47x24px)

#### 2c. Confirmation Section

| Property | Value |
|----------|-------|
| Container width | 400px |
| Padding | 8px |
| Gap | 16px |
| Section title | "ยืนยันการแก้ไข" - Pridi Medium 24px, black |

**Manager Select Field:**
| Property | Value |
|----------|-------|
| Label | "เลือก Manager" - Pridi Regular 14px, #212121 |
| Label-to-select gap | 4px |
| Select border | 1px solid #ced4da |
| Select border-radius | 6px |
| Select padding | 13px horizontal, 7px vertical |
| Select font | Pridi Regular 16px, #212529 |
| Full width | yes (within 400px container) |
| Type | Bootstrap 5.3 select dropdown |

### 3. Bottom Bar (Footer)
| Property | Value |
|----------|-------|
| Padding | 16px all sides |
| Border top | 1px solid #cbd5e1 (slate/300) |
| Background | white |
| Layout | flex, justify-between, align-end |

**Buttons:**

| Button | Text | Background | Border | Min Width | Padding | Border Radius | Font |
|--------|------|-----------|--------|-----------|---------|---------------|------|
| Back | ย้อนกลับ | #6c757d | #6c757d | 160px | 13px h / 7px v | 6px | Pridi Regular 16px white |
| Submit | ส่งคำขออนุมัติแก้ไข | #003366 | #003366 | 160px | 13px h / 7px v | 6px | Pridi Regular 16px white |

## Form Fields Present

| # | Field | Type | Description |
|---|-------|------|-------------|
| 1 | Manager select | Dropdown (Bootstrap select) | Choose approving manager |

Note: This popup has **only 1 form field** (Manager select). The table is read-only display. The user reviews the before/after data and selects a manager to submit the edit approval request.

## Color Summary

| Usage | Color | Token |
|-------|-------|-------|
| Modal background | #ffffff | Theme/Body Background |
| Overlay backdrop | rgba(12,12,12,0.38) | - |
| Modal border | #eeeeee | - |
| Separator borders | #cbd5e1 | Slate/300, Gray-300 |
| Table header bg | #d6e0e0 | - |
| Alternating row bg | #f2f6f6 | - |
| Default text | #212121 | Texts/text-neutral-primary |
| Body text | #212529 | Body Text/Body Color |
| Warning/highlight numbers | #b45309 | Texts/text-warning-primary |
| Changed values / "After" col | #ca6510 | Orange/600 |
| Primary button | #003366 | Primary |
| Secondary button | #6c757d | Theme Colors/Secondary |
| Form input border | #ced4da | Gray/400 |
| Denomination badge bg | #fbf8f4 | - |
| Denomination badge border | #9f7d57 | - |
| Denomination badge text | #4f3e2b | - |

## Typography Summary

| Usage | Font | Weight | Size | Line Height | Color |
|-------|------|--------|------|-------------|-------|
| Modal title / Section titles | Pridi | 500 (Medium) | 24px | 1.2 | black |
| Table summary label | Pridi | 500 (Medium) | 16px | 1.2 | #212121 |
| Body text | Pridi | 400 (Regular) | 16px | 1.5 | black / #212529 |
| Summary counts | Pridi | 400/700 | 14px | normal | #212121 / #b45309 |
| Table header | Pridi | 500 (Medium) | 13px | normal | #212121 |
| Table "After" header | Pridi | 500 (Medium) | 13px | normal | #ca6510 |
| Table body cells | Pridi | 400 (Regular) | 12-13px | 13px/normal | #212529 |
| Table "After" values | Pridi | 400 (Regular) | 13-14px | normal/1.5 | #ca6510 |
| Form label | Pridi | 400 (Regular) | 14px | normal | #212121 |
| Select value | Pridi | 400 (Regular) | 16px | 1.5 | #212529 |
| Button text | Pridi | 400 (Regular) | 16px | 1.5 | white |
