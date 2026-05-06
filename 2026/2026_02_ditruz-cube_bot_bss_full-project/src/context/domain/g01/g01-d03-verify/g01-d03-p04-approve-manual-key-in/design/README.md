# Design Documentation — Approve Manual Key-in

**Page**: g01-d03-p04-approve-manual-key-in
**Domain**: Verify (g01-d03)
**Figma File**: [Figma_BSS-Verify](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify)
**Last Updated**: 2026-02-19

---

## Overview

The **Approve Manual Key-in** page allows authorized users to review and approve or deny manual banknote count entries that were submitted by operators. This is a verification step in the BSS workflow.

---

## Figma Node IDs

| Node ID | Component Name | Description | Priority |
|---------|----------------|-------------|----------|
| 2:49536 | Section container | Full page with all variants side-by-side | Reference |
| 2:49537 | Main layout frame | Primary implementation target (1440×900) | ⭐ High |
| 2:49545 | Navigation header | BSS header with logo, menu, user profile | Medium |
| 2:49769 | Page header | Title "Approve Manual Key-in" + Export button | High |
| 2:49792 | Filter section | 2 rows of filter dropdowns (9 filters total) | High |
| 2:49978 | Table symbol | Main transaction table component | ⭐ High |
| 2:49833 | Detail breakdown table | Denomination type breakdown (ดี/เสีย/Reject) | ⭐ High |
| 2:49964 | Action panel | Notes textarea + Approve/Denied buttons | ⭐ High |
| 2:50280 | Approve modal | Confirmation dialog | High |
| 2:50270 | Success modal | Success message dialog | Medium |

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Navigation Header (40px) — BSS Logo │ Menu │ User Profile       │
├─────────────────────────────────────────────────────────────────┤
│ Page Header (62px) — "Approve Manual Key-in" │ Export Button    │
├─────────────────────────────────────────────────────────────────┤
│ Filter Section (102px)                                          │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────┐             │
│ │ Filter1 │ Filter2 │ Filter3 │ Filter4 │ Filter5 │ (Row 1)     │
│ └─────────┴─────────┴─────────┴─────────┴─────────┘             │
│ ┌──────────┬──────────┬──────────┬──────────┐                   │
│ │ Filter 6 │ Filter 7 │ Filter 8 │ Filter 9 │ (Row 2)           │
│ └──────────┴──────────┴──────────┴──────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Main Transaction Table (1408×407)                               │
│ [Table with multiple columns, pagination, row selection]        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Bottom Section (1408×249) — 2 columns:                          │
│ ┌────────────────────────────┬──────────────────────┐           │
│ │ Detail Breakdown (900px)   │ Action Panel (500px) │           │
│ │                            │                      │           │
│ │ Header: "แสดงผลการนับคัด..." │ "หมายเหตุ" label    │           │
│ │                            │                      │           │
│ │ Table:                     │ [Notes textarea]     │           │
│ │ ┌─────┬─────┬────┬─────┐  │                      │           │
│ │ │ชนิด │ประเภท│แบบ │จำนวน│  │ [Approve Button]     │           │
│ │ ├─────┼─────┼────┼─────┤  │ ─────────────────    │           │
│ │ │ดี   │ 17  │ 4  │     │  │ [Denied Button]      │           │
│ │ │เสีย │ 17  │995 │     │  │                      │           │
│ │ │Reject│17  │ 1  │     │  │                      │           │
│ │ └─────┴─────┴────┴─────┘  │                      │           │
│ └────────────────────────────┴──────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘

Modals (overlays):
┌────────────────────────┐  ┌────────────────────────┐
│ Approve Confirmation   │  │ Success Message        │
│ [Icon]                 │  │ [Icon]                 │
│ "Approve"              │  │ "สำเร็จ"               │
│ "คุณแน่ใจหรือไม่..."     │  │ "บันทึกข้อมูลสำเร็จ"    │
│ [Cancel] [Confirm]     │  │ [OK]                   │
└────────────────────────┘  └────────────────────────┘
```

---

## Page Dimensions

| Element | Width | Height | Notes |
|---------|-------|--------|-------|
| Page container | 1440px | 900px | Full page viewport |
| Content area | 1408px | - | 16px margins on sides |
| Navigation header | 1440px | 40px | Fixed |
| Page header | 1440px | 62px | Fixed |
| Filter section | 1408px | 102px | 2 rows of dropdowns |
| Main table | 1408px | 407px | Scrollable content |
| Bottom section | 1408px | 249px | 2-column layout |
| Detail table | 900px | 249px | Left column |
| Action panel | 500px | 249px | Right column (8px gap) |
| Approve modal | 560px | 360px | Centered overlay |
| Success modal | 560px | 360px | Centered overlay |

---

## Color Theme

**Primary color**: Blue (#003366)

This page uses the **blue theme** (different from other BSS pages that may use orange/green/purple gradients).

---

## Components

### 1. Navigation Header
- Shared component across all BSS pages
- Contains: Logo, system title, menu navigation, user profile
- Height: 40px
- Background: Dark/navy

### 2. Filter Section
- **Row 1**: 5 filters at 256px width each with spacing
- **Row 2**: 4 filters at 326px width each with spacing
- Each filter: Label (left) + Dropdown select (right)
- Height: 31px per dropdown

### 3. Main Transaction Table
- Full-width data table component
- Instance of symbol node 2:49978
- Features: sortable columns, row selection, pagination
- **To be queried separately for detailed specs**

### 4. Detail Breakdown Table
- 4 columns: ชนิดราคา (Denomination), ประเภท (Type), แบบ (Form), จำนวนฉบับ (Quantity)
- Header: "แสดงผลการนับคัดตามรายการ Header Card ที่เลือกไว้"
- Shows 3 types: ดี (Good), เสีย (Damaged), Reject
- Includes denomination badge images

### 5. Action Panel
- Card with rounded corners (r-sm = 12px)
- Notes textarea (468×36px)
- Approve button (468×46px, success color)
- Thin separator line (1px)
- Denied button (468×48px, danger color)

### 6. Modals
- **Approve Confirmation**: Question/warning icon, message, Cancel + Confirm buttons
- **Success**: Checkmark icon, success message, single OK button
- Both: 560×360px, centered with backdrop overlay

---

## Design Files

| File | Purpose |
|------|---------|
| `design-tokens.md` | All colors, fonts, spacing values extracted from Figma |
| `component-map.md` | Node IDs mapped to pixel measurements + ASCII layout |
| `figma-specs.css` | Raw CSS specifications (reference only, not linked) |
| `css-specs-from-figma.md` | Ready-to-use CSS converted from Tailwind |
| `node-2-49536-approve-manual-key-in/` | Per-node Figma MCP outputs (4 files) |

---

## Implementation Notes

1. **Node 2:49536** is a container showing multiple variants — implement **node 2:49537** (main frame) instead
2. **Query child nodes separately** for detailed CSS (table, filters, action panel)
3. **Design tokens** already extracted in `variables.json` and `design-tokens.md`
4. **Font mapping**: Figma shows 'Pridi' → implement as 'bss-pridi' (project font face)
5. **SVG assets**: Check for existing denomination badge SVGs before creating new ones
6. **Global CSS**: Scan `all.css` and `Style.css` for overrides before writing component CSS
7. **Blue theme**: Unlike other pages with orange/green/purple gradients, this page uses blue primary

---

## Next Steps for Implementation

1. Query **node 2:49537** (main frame) for detailed CSS specifications
2. Query **node 2:49978** (table symbol) for table component structure
3. Query individual sections (filters, detail table, action panel) for precise measurements
4. Check for existing denomination badge SVG files in `wwwroot/`
5. Scan global CSS files for button/table/form overrides
6. Implement page following the pattern from g01-d02-p01 (ReconcileTransaction reference)
