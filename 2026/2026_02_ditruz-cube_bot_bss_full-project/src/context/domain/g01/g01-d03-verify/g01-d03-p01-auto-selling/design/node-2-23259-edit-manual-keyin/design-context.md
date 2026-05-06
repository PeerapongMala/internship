# Raw Design Context - Node 2:23259

**Date:** 2026-02-19
**Node:** Edit & Manual Key-in Unsort CC
**Figma Node ID:** 2:23259

> Note: The root node was too large for a single `get_design_context` call.
> The metadata (XML structure) was returned for the root, then `get_design_context`
> was called on 4 key sub-nodes: 2:23553, 2:23666, 2:23536, 2:23833.

---

## Root Node Metadata (XML)

```xml
<frame id="2:23259" name="Edit &amp; Manual Key-in Unsort CC" x="10456" y="1416" width="1440" height="900">
  <frame id="2:23260" name="Background" x="0" y="0" width="1440" height="900">
    <rounded-rectangle id="2:23261" name="Background" ... />
    <frame id="2:23262" name="Forground Color" ... />
  </frame>
  <frame id="2:23267" name="Navigation Header Prepare" x="0" y="0" width="1440" height="40">
    <!-- Nav bar with logo, menu, profile -->
  </frame>
  <frame id="2:23490" name="Frame" x="0" y="40" width="1440" height="860">
    <frame id="2:23491" name="Frame 6187" ... > <!-- Page title area, 62px -->
    <frame id="2:23502" name="Frame 6116" ... > <!-- Main content area -->
      <frame id="2:23536" name="Unsort - CC" ... > <!-- Header Card Row -->
      <frame id="2:23551" name="Frame 6159" ... > <!-- Form + Info + Table -->
        <frame id="2:23553" name="Frame 6208" ... > <!-- Form + Info Panel -->
        <frame id="2:23666" name="Frame 6203" ... > <!-- Results Table -->
      </frame>
    </frame>
    <frame id="2:23833" name="Frame 6186" ... > <!-- Footer with save button -->
  </frame>
</frame>
```

---

## Sub-node: 2:23536 — Header Card Row (Unsort - CC)

### Styles Used
- Heading/H5: Font(family: "Pridi", style: Medium, size: 20, weight: 500, lineHeight: 1.2, letterSpacing: 2.5)

### Key Properties
- Container: bg white, border 1px #cbd5e1, rounded 16px, padding 8px 24px, gap 8px
- Header Card label: "Header Card:" — Pridi Regular 20px, #212121
- Badge: bg #e4e6e9, rounded 8px, width 152px, Pridi Bold 20px, #212121, text "0054941526"
- Date: "Date:" + "21/7/2568 16:26" — Pridi Regular 20px, #212121, right-aligned (max-width 300px)

---

## Sub-node: 2:23553 — Form Section + Info Panel

### Styles Used
- Title 1: Font(Pridi Medium 16px, weight 500, lineHeight 100, letterSpacing 2.2)
- Primary: #003366
- Gray/White: #FFFFFF
- Body Text/Body Color: #212529
- Body/Regular: Font(Pridi Regular 16px, weight 400, lineHeight 1.5)
- Theme/Body Background: #FFFFFF
- Theme/Border: #DEE2E6
- Form Value 2: Font(Pridi SemiBold 16px, weight 600)
- Form Label 2: Font(Pridi Regular 14px, weight 400)
- Gray/600: #6C757D
- Body/Lead: Font(Pridi Light 20px, weight 300, lineHeight 1.5)
- Gray/400: #CED4DA
- Components/Input/Focus Border: #86B7FE
- Focus Ring/Default: box-shadow 0 0 0 4px rgba(13,110,253,0.25)
- Theme/Success: #198754

### Component Descriptions
- **components/radio** (Node 2:14039): Bootstrap 5.1 checks/radios
- **select** (Node 1:5950): Bootstrap 5.3 select
- **input** (Node 2:14726): Bootstrap 5.3 form-control
- **button** (Node 1:385): Bootstrap 5.3 buttons

### Form Card (left, flex: 1)
- bg white, border 1px #cbd5e1, rounded 12px, padding 16px 24px
- Title: "เพิ่มผลการนับคัดธนบัตร" — Pridi Medium 16px, #212121

#### Radio Group — ประเภทธนบัตร (Banknote Type)
- Label: Pridi SemiBold 14px, #212121
- Flex wrap, gap 4px 0
- Options: ดี, เสีย, ทำลาย, Reject, ปลอม, ชำรุด
- Item: padding 4px 8px, gap 16px, rounded 8px
- Selected: bg rgba(0,0,0,0.05)
- Radio checked: bg #003366, border #003366, inner circle 8px white
- Radio unchecked: bg white, border 1px #dee2e6
- Text: Pridi Regular 16px, #212529, lineHeight 1.5

#### Radio Group — ชนิดราคา (Denomination)
- Label: Pridi SemiBold 14px, #212121
- Flex wrap, gap 4px
- Badge (MoneyType): 47x24px, border 2px solid
  - 1000: bg #fbf8f4, border #9f7d57, text #4f3e2b (Pridi Bold 13px)
  - 500: bg #f8f5ff, border #6a509d, text #3d2e5b (Pridi SemiBold 16px large)
  - 100: bg #fff5f5, border #c07575, text #8f4242
  - 50: bg #f0f8ff, border #35a0fd, text #025cab
  - 20: bg #f1f9f1, border #55b254, text #336c32

#### Select — แบบ (Series)
- Label: Pridi Regular 14px, #212121
- Select: width 460px, height 48px, bg white, border 1px #ced4da, rounded 8px
- Padding: 9px 13px right, 9px 17px left
- Value: Pridi Light 20px, #6c757d

#### Input — จำนวน (Quantity)
- Label: Pridi Regular 14px, #212121
- Input: width 460px, height 48px, bg white, rounded 8px
- Normal: border 1px #ced4da
- Focus: border 1px #86b7fe, shadow 0 0 0 4px rgba(13,110,253,0.25)
- Padding: 9px 17px
- Text: Pridi Light 20px

#### Submit Button (บันทึกผลนับคัด)
- Right-aligned, padding-top 16px
- Width 300px, height 46px, bg #198754, rounded 8px, padding 8px 16px
- Text: Pridi Medium 20px, white

### Info Panel (right, fixed 400px)
- bg white, border 1px #cbd5e1, rounded 12px, padding 16px 12px
- Font: Pridi Regular 16px, #212121, lineHeight 1.5
- 3 groups, gap 4px within, rows flex justify-between, padding 0 4px
- Group 1: บาร์โค้ดรายห่อ, บาร์โค้ดรายมัด, ธนาคาร, ศูนย์เงินสด
- Group 2: วันเวลาเตรียม, วันเวลานับคัด
- Group 3: Prepare, Sorter, Reconcile, Supervisor ที่แก้ไข

---

## Sub-node: 2:23666 — Results Table

### Styles Used
- Heading/H6: Font(Pridi Medium 16px, weight 500, lineHeight 1.2)
- Body: Font(Pridi Regular 14px, weight 400, lineHeight 100)
- Table header: Font(Pridi Medium 13px, weight 500)
- Body/Small: Font(Pridi Regular 14px, weight 400, lineHeight 1.5)
- Form Label: Font(Pridi Regular 13px, weight 400)
- Texts/text-warning-primary: #b45309

### Component Descriptions
- **button** (Node 1:7290): Bootstrap 5.3 buttons (edit/delete action buttons)

### Table Container
- bg white, border 1px #cbd5e1, rounded 12px
- overflow-x clip, overflow-y auto

### Table Header Bar (List Header, node 2:23669)
- Min-height 45px, padding 8px 16px, border-bottom 1px #cbd5e1
- 3 flex sections (equal):
  1. "แสดงผลการนับคัด" — Pridi Medium 16px, #212121
  2. "จำนวนก่อน:" + "1002" (Bold, #b45309) + "ฉบับ" — right-aligned
  3. "จำนวนหลัง:" + "0" (Bold, #b45309) + "ฉบับ" — center-aligned

### Column Headers (node 2:23680)
- Height 30px, bg #d6e0e0, border-bottom 1px #cbd5e1, padding 0 8px
- 6 equal flex columns, each: padding 8px, gap 2px
- Font: Pridi Medium 13px, #212121
- Columns: ชนิดราคา, ประเภท, แบบ, ก่อนปรับ (ฉบับ) [right], หลังปรับ (ฉบับ) [right], Action [center]
- Sort icon: 12px SVG next to text

### Data Rows
- Padding 0 8px, border-bottom 1px #cbd5e1
- Odd rows: white bg
- Even rows: #f2f6f6 bg
- Cell padding: 6px 8px
- Cell text: Pridi Regular 12px, #212529, lineHeight 13px, text-ellipsis
- Number cells: Pridi Regular 14px, #212529, lineHeight 1.5, text-align right
- MoneyType badge in first column: 47x24px

### Action Buttons
- 2 per row, gap 10px, centered
- Size: 26x26px, bg transparent, border 1px black, rounded 4px
- Padding: 5px 9px
- Icons: pencil-fill (edit), trash3-fill (delete), 16x16px

### Empty Rows
- Height 34px, alternating bg

---

## Sub-node: 2:23833 — Footer

### Styles Used
- Primary: #003366
- Gray/White: #FFFFFF

### Component: Save Button
- Container: flex, justify-end, padding 8px, gap 16px
- Left spacer: flex 1 (empty)
- Button: width 229px, bg #003366, border 1px #003366, rounded 8px, padding 9px 17px
- Text: "บันทึกข้อมูล" — Pridi Medium 20px, white
