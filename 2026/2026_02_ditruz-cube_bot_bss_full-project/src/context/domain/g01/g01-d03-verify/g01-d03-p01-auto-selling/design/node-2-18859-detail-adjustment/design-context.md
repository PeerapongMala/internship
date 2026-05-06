# Design Context — Node 2:18859

> **Date**: 2026-02-19
> **Figma Node**: `2:18859`
> **Name**: Auto Selling - Unsort CC มัดขาด-เกิน แสดงรายละเอียดการปรับยอดธนบัตร

---

## Main Frame Structure (Sparse Metadata)

The main node `2:18859` was too large for a single `get_design_context` call. Below is the sparse metadata (node IDs + positions) for the full page, followed by detailed code for the key NEW sub-nodes.

### Top-Level Structure

```xml
<frame id="2:18859" name="Auto Selling - Unsort CC มัดขาด-เกิน แสดงรายระเอียดการปรับยอดธนบัตร" width="1440" height="900">
  <frame id="2:18860" name="Background" width="1440" height="900" />
  <frame id="2:18867" name="Navigation Header Prepare" width="1440" height="40" />
  <frame id="2:19090" name="Frame" y="40" width="1440" height="860">
    <!-- Title + metadata + action buttons -->
    <frame id="2:19091" name="Frame" width="1403" height="62" />
    <!-- Main data area -->
    <frame id="2:19131" name="Frame" y="62" width="1408" height="734">
      <!-- Filter bar -->
      <frame id="2:19132" name="Frame" width="1408" height="63" />
      <!-- Data panels -->
      <frame id="2:19153" name="Frame 6208" y="71" width="1408" height="663">
        <!-- LEFT PANEL -->
        <frame id="2:19154" name="Frame" width="844.8" height="663">
          <frame id="2:19155" name="Table" y="0" height="215.67" />      <!-- มัดครบจำนวน -->
          <frame id="2:19238" name="Table" y="223.67" height="215.67" /> <!-- มัดรวมครบจำนวน -->
          <frame id="2:19399" name="Frame" y="447.33" height="215.67" /> <!-- ★ DETAIL PANEL (NEW) -->
        </frame>
        <!-- RIGHT PANEL -->
        <frame id="2:19508" name="Frame" x="852.8" width="555.2" height="663">
          <instance id="2:19509" name="Table - Auto Selling - A" height="143.33" />  <!-- มัดขาด-เกิน -->
          <instance id="2:19510" name="Table - Auto Selling - B" y="151.33" height="143.33" /> <!-- มัดรวมขาด-เกิน -->
          <instance id="2:19511" name="Table - Auto Selling - C" y="302.67" height="143.33" /> <!-- มัดเกินโดยขอจากเครื่องจักร -->
          <frame id="2:19512" name="Editor View" y="454" width="555.2" height="209" />  <!-- ★ ADJUSTMENT PANEL (NEW) -->
        </frame>
      </frame>
    </frame>
    <!-- Footer buttons -->
    <frame id="2:19553" name="Frame" y="796" width="1408" height="64" />
  </frame>
</frame>
```

---

## Detail Panel — get_design_context for Node 2:19399

**Title**: "แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก"

### Key Design Properties Extracted

**Container** (2:19399):
- `background: white`
- `border: 1px solid #cbd5e1`
- `border-radius: 12px`
- `overflow: clip`
- `display: flex; gap: 0`

**Section Header** (2:19402):
- `border-bottom: 1px solid #cbd5e1`
- `padding: 8px 16px`
- `gap: 16px`
- Title text: Pridi Medium 16px, color `#212121`, letter-spacing 0.4px
- Count "997": Pridi Bold 14px, color `#b45309` (warning)
- "ฉบับ": Pridi Regular 14px, color `#212121`

**Table Header Row** (2:19409):
- `background: #d6e0e0`
- `border-bottom: 1px solid #cbd5e1`
- `height: 30px`
- `padding: 0 8px`
- Column text: Pridi Medium 13px, color `#212121`, letter-spacing 0.299px
- Sort icon: 12x12px

**8 Columns** (all flex:1 except ชนิดราคา):
1. Header Card (2:19410) — flex:1, left-aligned
2. ธนาคาร (2:19414) — flex:1, left-aligned
3. Cashpoint (2:19418) — flex:1, left-aligned
4. ชนิดราคา (2:19422) — **fixed width 80px** (min 60, max 100), right-aligned
5. ประเภท (2:19425) — flex:1, left-aligned
6. แบบ (2:19429) — flex:1, **center-aligned**
7. จำนวนฉบับ (2:19433) — flex:1, **right-aligned**
8. มูลค่า (2:19437) — flex:1, **right-aligned**

**Table Body Rows**:
- Odd rows: white bg
- Even rows: `#f2f6f6`
- Row min-height: 36px
- Cell padding: 6px 8px
- Text: Pridi Regular 13px, color `#212529`, letter-spacing 0.286px
- Denomination badge: 47x24px, bg `#fbf8f4`, border 2px `#9f7d57`, text bold 13px `#4f3e2b`

### Sample Data Rows
| Header Card | ธนาคาร | Cashpoint | ชนิดราคา | ประเภท | แบบ | จำนวนฉบับ | มูลค่า |
|-------------|---------|-----------|----------|--------|-----|-----------|--------|
| 0054941525 | BBL | สีลม | 1000 | ทำลาย | 17 | 990 | 990,000 |
| 0054941525 | BBL | สีลม | 1000 | ดี | 17 | 4 | 4,000 |
| 0054941525 | BBL | สีลม | 1000 | Reject | 17 | 3 | 3,000 |

---

## Adjustment Panel (Editor View) — get_design_context for Node 2:19512

**Title**: "ปรับข้อมูลผลนับคัด"

### Key Design Properties Extracted

**Container** (2:19512):
- `background: white`
- `border: 1px solid #cbd5e1`
- `border-radius: 12px`
- `overflow: clip`
- `padding: 12px 16px` (py-12, px-16)
- `display: flex; flex-direction: column; gap: 4px`
- `width: 555.2px; height: 209px`

**Title** (2:19514):
- Pridi Medium 16px, color `#212121`, letter-spacing 0.4px
- "ปรับข้อมูลผลนับคัด"

**Form Fields Row** (2:19516):
- `display: flex; gap: 24px`
- 4 equal-width fields (flex: 1 0 0)

**Field 1 — Header Card** (2:19517 → 2:19519):
- Label: "Header Card" — Pridi Regular 14px, color `#212121`, tracking 0.35px
- Input (read-only): bg `#ededed`, border `#e0dfe2`, border-radius 8px, height 36px, padding 8px 12px
- Value: "0054941525" — Pridi **SemiBold 16px**, color `#212121`, tracking 0.4px

**Field 2 — ชนิดราคา** (2:19521 → 2:19525):
- Label: "ชนิดราคา"
- Dropdown: white bg, border `#e0dfe2`, border-radius 8px, height 36px
- Value: "1000" — Pridi Regular 13px, **right-aligned**, tracking 0.325px
- Angle-down icon: 20x20px

**Field 3 — แบบ** (2:19528 → 2:19530):
- Label: "แบบ"
- Dropdown: same style as ชนิดราคา
- Value: "17" — left-aligned

**Field 4 — จำนวน (ฉบับ)** (2:19533 → 2:19535):
- Label: "จำนวน (ฉบับ)"
- Text input: white bg, border `#e0dfe2`, border-radius 8px, height 36px
- Value: "3" — right-aligned, width ~88.8px

**Remark Field** (2:19537 → 2:19540):
- Label: "หมายเหตุ" — Pridi Regular 14px
- Full-width text input: same style, height 36px

**Radio + Save Row** (2:19542):
- Height: 38px
- `display: flex; gap: 8px; align-items: flex-end`

**Radio Group 1 — Direction** (2:19543):
- "เพิ่ม" (2:19544) — **checked** (blue `#0d6efd`)
- "ลด" (2:19545) — unchecked
- Radio circle: 16px, checked = blue bg + white 8px inner circle
- Label: Pridi Regular 14px, color `#212529`, line-height 1.5

**Separator** (2:19546):
- `width: 1px; background: #d9d9d9`

**Radio Group 2 — Category** (2:19547):
- "Normal" (2:19548) — **checked**
- "Add-on" (2:19549) — unchecked
- "Ent. JAM" (2:19550) — unchecked
- Each radio: flex: 1 0 0

**Separator** (2:19551):
- Same as above

**Save Button** (2:19552):
- `background: #198754` (Theme/Success)
- `border: 1px solid #198754`
- `border-radius: 6px`
- `width: 120px; height: 38px`
- `padding: 7px 13px`
- Text: "บันทึก" — Pridi Regular 16px, white, line-height 1.5, tracking 0.4px
- Component: Bootstrap button variant (`btn-success`)

---

## Right Panel Tables — get_design_context for Node 2:19508

The full output was too large (115.5KB) and saved to:
`/home/vscode/.claude/projects/-workspaces-project/62e059e0-781a-4fe6-8b4d-f3cd95c67f9d/tool-results/toolu_01AotDXPKTXH4uqJMAuaFLvS.json`

### Key Instances:
- **Table A** (2:19509): "มัดขาด-เกิน" — with selected row showing "Edited" badge
- **Table B** (2:19510): "มัดรวมขาด-เกิน"
- **Table C** (2:19511): "มัดเกินโดยขอจากเครื่องจักร"
- **Editor View** (2:19512): Adjustment panel (detailed above)

### Component Descriptions from Figma:
- **components/radio** (Node 2:14039): Bootstrap radio with interaction. Documentation: https://getbootstrap.com/docs/5.1/forms/checks-radios/
- **button** (Node 1:385): Bootstrap button. Documentation: https://getbootstrap.com/docs/5.3/components/buttons/
- **icon-wrapper** (Node 1:22): Icon with multi-size

### Design Styles Referenced:
- `Heading/H6`: Pridi Medium 16px, weight 500, line-height 1.2, tracking 2.5px
- `Form Label 2`: Pridi Regular 14px, weight 400, tracking 2.5px
- `Form Value 2`: Pridi SemiBold 16px, weight 600, tracking 2.5px
- `Form Value`: Pridi Regular 13px, weight 400, tracking 2.5px
- `Body/Small`: Pridi Regular 14px, line-height 1.5, tracking 2.5px
- `Body/Regular`: Pridi Regular 16px, line-height 1.5, tracking 2.5px
- `Table header`: Pridi Medium 13px, weight 500, tracking 2.3px
- `Table body`: Pridi Regular 13px, weight 400, tracking 2.2px

### Color tokens used:
- `Theme/Success`: #198754
- `Theme/Border`: #DEE2E6
- `Body Text/Body Color`: #212529
- `WMS Admin/gray`: #E0DFE2
- `WMS Admin/white`: #FFFFFF
- `Theme Colors/Primary`: #0d6efd (radio checked)
