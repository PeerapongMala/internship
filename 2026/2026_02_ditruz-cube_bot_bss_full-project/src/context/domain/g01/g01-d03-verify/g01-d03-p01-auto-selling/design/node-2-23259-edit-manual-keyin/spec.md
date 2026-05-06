# Design Spec - Edit & Manual Key-in Unsort CC

**Date:** 2026-02-19
**Figma Node ID:** 2:23259
**Page Dimensions:** 1440 x 900

## Page Layout

Full-page layout (not a modal/popup). Structure:
```
[Navigation Header]          height: 40px
[Page Title Area]            height: 62px
[Header Card Row]            height: 48px (inside content area)
[Form Section + Info Panel]  height: 300px (flex row, gap: 10px)
[Results Table]              height: 370px (flex column)
[Footer / Save Button]       height: 64px
```

Content area starts at y=40 (below nav), total content height: 860px.
Left/right padding: 16px. Inner content width: 1408px.

---

## 1. Header Card Row (node 2:23536)

- **Container:** White bg, border 1px #cbd5e1, rounded 16px, padding 8px 24px
- **Left:** "Header Card:" (Pridi Regular 20px, #212121) + Badge "0054941526" (Pridi Bold 20px, #212121, bg #e4e6e9, rounded 8px, padding 4px 12px, width 152px)
- **Right:** "Date:" + "21/7/2568 16:26" (Pridi Regular 20px, #212121)

---

## 2. Form Section (node 2:23554, left side)

- **Container:** White bg, border 1px #cbd5e1, rounded 12px, padding 16px 24px
- **Width:** Flex 1 (fills remaining space, ~998px)
- **Title:** "เพิ่มผลการนับคัดธนบัตร" (Pridi Medium 16px, #212121)

### 2.1 Radio Group Row (gap 30px between the two groups)

**ประเภทธนบัตร (Banknote Type):**
- Label: Pridi SemiBold 14px, #212121
- Radio group: Flex wrap, gap 4px 0px
- Options: ดี, เสีย, ทำลาย, Reject, ปลอม, ชำรุด
- Radio item: padding 4px 8px, gap 16px between radio + text
- Selected state: bg rgba(0,0,0,0.05), rounded 8px
- Radio circle: 16px, checked = bg #003366 + white 8px inner circle
- Unchecked: bg white, border 1px #dee2e6
- Text: Pridi Regular 16px, #212529, line-height 1.5

**ชนิดราคา (Denomination):**
- Label: Pridi SemiBold 14px, #212121
- Radio group: Flex wrap, gap 4px
- Options: 1000, 500, 100, 50, 20 (displayed as MoneyType badges)
- Badge size: 47px x 24px, border 2px solid, text Pridi Bold 13px
- Selected state: bg rgba(0,0,0,0.05), rounded 8px
- Badge colors: see Denomination Badge Colors in variables.md

### 2.2 Form Fields Row (gap 30px)

**แบบ (Series) - Select:**
- Label: Pridi Regular 14px, #212121, gap 4px below
- Select: full width (460px), height 48px, bg white, border 1px #ced4da, rounded 8px
- Padding: 9px 13px (right) 9px 17px (left)
- Placeholder/value: Pridi Light 20px, #6c757d
- Dropdown icon on right

**จำนวน (Quantity) - Input:**
- Label: Pridi Regular 14px, #212121, gap 4px below
- Input: full width (460px), height 48px, bg white, rounded 8px
- Normal state: border 1px #ced4da
- Focused state: border 1px #86b7fe, box-shadow 0 0 0 4px rgba(13,110,253,0.25)
- Padding: 9px 17px
- Text: Pridi Light 20px

### 2.3 Submit Button

- Alignment: right-aligned within form
- Container: padding-top 16px
- Button: width 300px, height 46px, bg #198754, rounded 8px, padding 8px 16px
- Text: "บันทึกผลนับคัด" (Pridi Medium 20px, white)

---

## 3. Info Panel (node 2:23622, right side)

- **Container:** White bg, border 1px #cbd5e1, rounded 12px, padding 16px 12px
- **Width:** Fixed 400px
- **Font:** Pridi Regular 16px, #212121, line-height 1.5
- **Layout:** 3 groups of key-value rows, gap 4px between rows within group

### Group 1 (node 2:23623)
- บาร์โค้ดรายห่อ: -
- บาร์โค้ดรายมัด: -
- ธนาคาร: BBL
- ศูนย์เงินสด: ธ.กรุงเทพ สีลม

### Group 2 (node 2:23640)
- วันเวลาเตรียม: 21/07/2568 14:00
- วันเวลานับคัด: 21/07/2568 14:01

### Group 3 (node 2:23649)
- Prepare: วิไล บัวงาม
- Sorter: ประภาส ช่างงาม
- Reconcile: อาภา เรืองรอง
- Supervisor ที่แก้ไข: สมสวัสดิ์ มาดี

Each row: flex, justify-between, padding 0 4px. Labels left-aligned, values right-aligned.

---

## 4. Results Table (node 2:23668)

- **Container:** White bg, border 1px #cbd5e1, rounded 12px, overflow-x clip, overflow-y auto

### Table Header Bar (node 2:23669)
- Height: min 45px, padding 8px 16px, border-bottom 1px #cbd5e1
- Left: "แสดงผลการนับคัด" (Pridi Medium 16px, #212121)
- Center: "จำนวนก่อน:" (Pridi Regular 14px) + "1002" (Pridi Bold 14px, #b45309) + "ฉบับ"
- Right: "จำนวนหลัง:" (Pridi Regular 14px) + "0" (Pridi Bold 14px, #b45309) + "ฉบับ"

### Column Headers (node 2:23680)
- Height: 30px, bg #d6e0e0, border-bottom 1px #cbd5e1, padding 0 8px
- Font: Pridi Medium 13px, #212121
- Columns (6 equal flex): ชนิดราคา, ประเภท, แบบ, ก่อนปรับ (ฉบับ), หลังปรับ (ฉบับ), Action
- ก่อนปรับ and หลังปรับ: right-aligned
- Action: center-aligned
- Sort icons: 12px, next to column header text

### Data Rows
- Alternating colors: odd white, even #f2f6f6
- Row border-bottom: 1px #cbd5e1
- Padding: 0 8px (row level), cells: 6px 8px
- Cell font: Pridi Regular 12px, #212529, line-height 13px
- Number columns (ก่อนปรับ, หลังปรับ): Pridi Regular 14px, text-align right, line-height 1.5
- Empty rows height: 34px

### Action Buttons
- 2 buttons per row, gap 10px, centered
- Each button: 26x26px, bg transparent, border 1px black, rounded 4px
- Edit button: pencil-fill icon (16px)
- Delete button: trash3-fill icon (16px)

---

## 5. Footer (node 2:23833)

- Height: 64px, padding 8px 0
- Content: flex, justify-end, gap 16px
- **Save Button:** width 229px, bg #003366, border 1px #003366, rounded 8px, padding 9px 17px
- Text: "บันทึกข้อมูล" (Pridi Medium 20px, white)

---

## Component References (Bootstrap 5.3)

- Radio buttons: [Bootstrap Checks & Radios](https://getbootstrap.com/docs/5.1/forms/checks-radios/)
- Select: [Bootstrap Select](https://getbootstrap.com/docs/5.3/forms/select/)
- Input: [Bootstrap Form Control](https://getbootstrap.com/docs/5.3/forms/form-control/)
- Buttons: [Bootstrap Buttons](https://getbootstrap.com/docs/5.3/components/buttons/)

## Key Node IDs Reference

| Section | Node ID |
|---------|---------|
| Full page | 2:23259 |
| Background | 2:23260 |
| Navigation | 2:23267 |
| Page title | 2:23491 |
| Header card row | 2:23536 |
| Form section (left) | 2:23554 |
| Radio - banknote type | 2:23563 |
| Radio - denomination | 2:23583 |
| Select (series) | 2:23614 |
| Input (quantity) | 2:23619 |
| Form submit button | 2:23621 |
| Info panel (right) | 2:23622 |
| Table container | 2:23668 |
| Table header bar | 2:23669 |
| Column headers | 2:23680 |
| Data row 1 | 2:23704 |
| Data row 2 | 2:23782 |
| Data row 3 | 2:23797 |
| Footer | 2:23833 |
| Save button | 2:23835 |
