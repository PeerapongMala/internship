# Design Context — Approve Manual Key-in (Node 2:49536)

**Extracted**: 2026-02-19
**Figma Node**: 2:49536 - "Approve Manual Key-in - All Types 20251104"
**Source**: get_design_context via Figma MCP

---

## Overview

This is a **section-level node** containing the full Approve Manual Key-in page with all variants (Unsort CC, CA Member, CA Non-Member, etc.) displayed side-by-side in the Figma canvas.

The node structure returned by `get_design_context` is identical to `get_metadata`, indicating this is a container frame. To get detailed CSS/layout specifications for implementation, **individual child nodes should be queried separately**.

---

## Main Components (Child Nodes)

### 1. Main Layout Frame (2:49537)
- **Size**: 1440×900px
- **Contains**: Complete page layout with gradient background

### 2. Navigation Header (2:49545)
- **Size**: 1440×40px
- **Elements**:
  - BSS Logo (30×30px)
  - System title: "ระบบตรวจสอบการนับคัดธนบัตร"
  - Version: "Version 1.0.0"
  - Navigation menu
  - User profile: "พัฒนา วิไล" (Officer)

### 3. Page Header (2:49769)
- **Size**: 1440×62px
- **Title**: "Approve Manual Key-in"
- **Controls**: Export button (92×36px)

### 4. Filter Section (2:49792)
- **Size**: 1408×102px
- **Layout**: 2 rows of filter dropdowns
  - Row 1: 5 filters (256px each with spacing)
  - Row 2: 4 filters (326px each with spacing)

### 5. Main Table (2:49830)
- **Component**: "Table - Approve Manual Key In" instance
- **Size**: 1408×407px
- **Symbol ID**: 2:49978

### 6. Detail Breakdown Section (2:49831)
- **Size**: 1408×249px
- **Layout**: 2-column split
  - Left (900px): Detail table with denomination breakdown
  - Right (500px): Action panel with notes + Approve/Denied buttons

#### Detail Table (2:49833)
- **Header**: "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้"
- **Columns**: ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ
- **Data Rows**:
  - ดี: 17, 4
  - เสีย: 17, 995
  - Reject: 17, 1

#### Action Panel (2:49964)
- **Title**: "Unsort - CC"
- **Notes Field**: Textarea (468×36px)
- **Buttons**:
  - Approve (468×46px)
  - Separator line (468×1px)
  - Denied (468×48px)

### 7. Modal Dialogs

#### Approve Confirmation (2:50280)
- **Size**: 560×360px
- **Title**: "Approve"
- **Message**: "คุณแน่ใจหรือไม่ที่ต้องการ Approve ข้อมูลนี้"
- **Buttons**: Cancel (160×38px), Confirm (158×38px)

#### Success Modal (2:50270)
- **Size**: 560×360px
- **Title**: "สำเร็จ"
- **Message**: "บันทึกข้อมูลสำเร็จ"
- **Button**: OK (160×38px)

---

## Key Node IDs for Detailed Extraction

To implement this page accurately, query these child nodes individually:

| Node ID | Component | Priority |
|---------|-----------|----------|
| 2:49537 | Main layout frame | High |
| 2:49545 | Navigation header | Medium |
| 2:49769 | Page header | High |
| 2:49792 | Filter section | High |
| 2:49978 | Table symbol/component | High |
| 2:49833 | Detail breakdown table | High |
| 2:49964 | Action panel | High |
| 2:50280 | Approve modal | High |
| 2:50270 | Success modal | Medium |

---

## Implementation Notes

1. **This node (2:49536) is a section container** — it contains multiple page variants side-by-side for design comparison
2. **For implementation**, extract **individual child nodes** (especially 2:49537 for the main layout)
3. **Design tokens** (colors, typography, spacing) are already extracted in `variables.json`
4. **Text content** is embedded in metadata.xml with coordinates
5. **Background gradient** is defined in node 2:49540 (Forground Color frame)

---

## Next Steps

1. Query node **2:49537** (main frame) with `get_design_context` for detailed CSS
2. Query node **2:49978** (table symbol) for table component specs
3. Query individual sections (filters, detail table, action panel) for precise spacing/styling
4. Extract SVG screenshot for visual reference
