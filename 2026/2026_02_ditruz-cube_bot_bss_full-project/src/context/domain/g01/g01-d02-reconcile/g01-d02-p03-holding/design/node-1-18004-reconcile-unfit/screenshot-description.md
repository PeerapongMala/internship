# Node 1:18004 - Reconcile - Unfit

## Overview

This screenshot shows the "Reconciliation UNFIT" page — a full-page interface (1440x900) for classifying and reconciling unfit banknotes. The page has a dark navy/teal gradient header area with decorative watermark imagery, and a white content area organized into distinct sections.

## Page Sections (Top to Bottom)

### Title Bar
- **"Reconciliation UNFIT"** in large, bold, dark navy text
- Positioned at the top-left of the content area
- Background has a subtle watermark/seal pattern (faded teal/gray)

### Header Info Bar
A horizontal bar with three key pieces of information:
- **Left:** "Header Card:" followed by `0054941201` in a bordered input box
- **Center:** "จำนวนมัด/Header Card: **1**"
- **Right:** "Date/Time: **21/07/2568 14:05:39**"

### Main Content — Two-Column Layout

#### Left Column — Header Card Table (692px wide)
A data table with 3 columns:
| Column | Sort Icon | Sample Data |
|--------|-----------|-------------|
| Header Card | Yes (diamond) | 0054941201 |
| ชนิดราคา (Price Type) | Yes (diamond) | Green badge: `100` |
| จำนวนมัด (Bundle Count) | Yes (diamond) | 1 |

- One populated data row
- 7 empty rows (alternating background pattern)
- Table header background: teal/gray (`#D6E0E0`)
- Row height: 36-40px

#### Right Column — Classification Form (692px wide)
A form panel with the following controls:

1. **ประเภทธนบัตร** (Banknote Type) — Radio button group:
   - **Reject** (selected — filled blue radio)
   - ปลอม (Counterfeit)
   - ชำรุด (Damaged)

2. **ชนิดราคา** (Denomination) — Radio button group with bordered badge labels:
   - `1000`, `500`, **`100`** (selected), `50`, `20`
   - Each denomination shown inside a bordered box with currency imagery

3. **แบบ** (Series/Version) — Dropdown select showing `17`

4. **จำนวน** (Quantity) — Empty text input field

5. **Green button** — "บันทึกตารางสรุปยอด" (Save Summary Table)
   - Green background (#198754 or similar), white text
   - Width: 300px, positioned right-aligned

### Summary Table — "ตารางสรุปยอด"
A full-width data table with 9 columns:

| Header Card | เวลานับคัด | ชนิดราคา | แบบ | ประเภท | จำนวน (ฉบับ) | มูลค่า (บาท) | หมายเหตุ | Action |
|-------------|-----------|----------|-----|--------|-------------|-------------|----------|--------|
| 0054941201 | 21/7/2568 14:00 | Red badge: 100 | 17 | Reject | 7 | 700 | - | Edit, Delete |
| 0054941201 | 21/7/2568 14:00 | Red badge: 100 | 16 | Reject | 1 | 100 | - | Edit, Delete |

- **Denomination badges** in this table use **red/dark red border** (different from green in left table)
- Action column has **edit** (pencil) and **delete** (trash) icon buttons
- Remaining rows are empty (36px height)

### Footer Action Bar
Full-width bar at the bottom with two buttons:
- **Left:** "ยกเลิกกระทบยอด" (Cancel Reconciliation) — outlined/bordered style, 300 x 48
- **Right:** "กระทบยอด" (Reconcile) — solid dark navy button (#003366), white text, 300 x 48

## Color Summary

| Element | Color |
|---------|-------|
| Page title | Dark navy (#003366) |
| Background gradient | Navy/teal to white |
| Header info bar | Light gray/white with border |
| Selected radio buttons | Blue filled |
| Green badge (left table) | Green border, white fill |
| Red badge (summary table) | Red/dark red border, white fill |
| Save button | Green (#198754), white text |
| Footer buttons bg | Dark navy (#003366) |
| Table header bg | Teal/gray (#D6E0E0) |
| Separator/border | #CBD5E1 |
| Text primary | #212121 |

## Typography
- Font family: **Pridi** throughout
- Title: Medium weight, ~20px
- Table header: Medium 13px
- Table body: Regular 13px
- Form labels: Regular 13px
- Thai and English text mixed throughout
