# Design — Verify Auto Selling

## Figma References
- **File**: `r8wLwGvG3I4vYU6SLQ1jec`
- **Main Page Node**: `2:17435` — "Page Auto Selling" (28318 x 18272 px)

## Page Structure Overview

Root node `2:17435` มี **5 sections** หลัก:

| Section ID | Name | Frames | Description |
|---|---|---|---|
| `2:17436` | Auto Selling UNSORT CC 20251104 | 21 frames | Main screens — default, detail, edit, OTP |
| `2:26691` | Section 4 20251104 | 11 frames | Additional screen states, error cases |
| `2:31554` | Cancel Send 20251104 | 5 frames | Cancel/Send flow + OTP |
| `2:31623` | แทรก/แทน (Insert/Replace) 20251105 | 2 frames | Replace flow |

## Layout: 2-Column x 3-Row (ไม่เหมือน Reconcile)

**ต่างจาก Reconcile (3-panel)** — หน้านี้เป็น **6-panel layout**:

### Left Panel (~845px) — 3 stacked tables:
| # | Node ID | Table Title | Key Columns |
|---|---|---|---|
| 1 | `2:17733` | มัดครบจำนวน ครบมูลค่า | Checkbox, Header Card, ชนิดราคา, วันเวลานับคัด, จำนวนฉบับ, มูลค่า, สถานะ, Action |
| 2 | `2:17815` | มัดรวมครบจำนวน ครบมูลค่า | Same as Table 1 |
| 3 | `2:17977` | แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก | Header Card, ธนาคาร, Cashpoint, ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, มูลค่า |

### Right Panel (~555px) — 3 stacked summary tables (component instances):
| # | Node ID | Component Name |
|---|---|---|
| A | `2:18087` | Table - Auto Selling - A |
| B | `2:18088` | Table - Auto Selling - B |
| C | `2:18089` | Table - Auto Selling - C |

Plus hidden edit form `2:18090` "Unsort - CC" (toggle between summary/edit view)

## Screen Structure (1440 x 900 px each)

1. **Navigation Header** (`2:17445`) — 1440 x 40 px
2. **Title Bar** (`2:17669`) — 1403 x 62 px: page title, shift/session info, 3 action buttons
3. **Filter Bar** (`2:17710`) — 1408 x 63 px: **5 dropdown select filters** (+ 1 hidden)
4. **Content Panel** (`2:17731`) — 1408 x 663 px: 2-column layout (left + right panels)

## Key Differences from Reconcile Transaction

1. **6-panel layout** (2 columns x 3 rows) ไม่ใช่ 3-panel
2. **Left tables** มี full structure, **right tables** เป็น component instances
3. **Table 3** (detail) มี columns ต่างจาก Table 1-2 (Bank, Cashpoint, Type, Form)
4. **Tables 1-2 มี checkbox**, Table 3 ไม่มี
5. **Hidden edit form** ใน right panel — toggle view
6. **5 filter dropdowns** (Reconcile มีน้อยกว่า)
7. **Multiple popup types**: Modal Dialog, Modal Alert, OTP Template

## All 41 Screen Variant Frames

### Section 1: Auto Selling UNSORT CC (`2:17436`) — 21 frames
| Node ID | Name |
|---|---|
| `2:17437` | Auto Selling - Unsort CC - 1 มัดครบจำนวนครบมูลค่า แสดงรายระเอียด |
| `2:18136` | Auto Selling - Unsort CC มัดรวมครบจำนวนครบมูลค่า แสดงรายระเอียด |
| `2:18859` | Auto Selling - Unsort CC มัดขาด-เกิน แสดงรายระเอียดการปรับยอดธนบัตร |
| `2:19560` | Auto Selling - Unsort CC แสดงรายระเอียดการปรับยอดธนบัตร |
| `2:20263` | Auto Selling - Unsort CC - Default |
| `2:21286` | Auto Selling - Unsort CC |
| `2:22272` | Auto Selling - Unsort CC |
| `2:23259` | Edit & Manual Key-in Unsort CC |
| `2:23836` | Edit & Manual Key-in Unsort CC |
| `2:24413` | Edit & Manual Key-in Unsort CC |
| `2:24990` | Group 7 |
| `2:24996` | Edit / Edit & Manual Key-in Unsort CC |
| `2:25021` | Edit / Edit & Manual Key-in Unsort CC |
| `2:25046` | บันทึกข้อมูลสำเร็จ |
| `2:25055` | บันทึกข้อมูลสำเร็จ |
| `2:25070` | Group 5 |
| `2:25077` | Edit Single Item / Preparation - Edit Single Item - 13 |
| `2:25186` | Edit Single Item / Preparation - Edit Single Item - 14 |
| `2:25308` | Edit Single Item / Preparation - Edit Single Item - 15 |
| `2:25429` | บันทึกข้อมูลสำเร็จ |
| `2:25441` | Auto Selling - Unsort CC |

### Section 2: Section 4 (`2:26691`) — 11 frames
| Node ID | Name |
|---|---|
| `2:26692` | Auto Selling - Unsort CC - Default |
| `2:27529` | Auto Selling - Unsort CC |
| `2:28269` | Auto Selling - Unsort CC |
| `2:29015` | Auto Selling - Unsort CC |
| `2:29750` | Auto Selling - Unsort CC |
| `2:30477` | Edit Users |
| `2:30538` | Edit Shift - 3 |
| `2:30590` | Edit Shift - 4 |
| `2:30644` | Auto Selling Error Case |

### Section 3: Cancel Send (`2:31554`) — 5 frames
| Node ID | Name |
|---|---|
| `2:31555` | Cancel Send Popup OTP - 3 |
| `2:31581` | Cancel Send Popup OTP - 4 |
| `2:31518` | Group 8 |
| `2:31523` | Cancel Send สำเร็จ |
| `2:31610` | Cancel Send สำเร็จ |

### Section 4: Insert/Replace (`2:31623`) — 2 frames
| Node ID | Name |
|---|---|
| `2:31624` | Auto Selling / แทรกแทน - Unsort CC - 6 |
| `2:32278` | Auto Selling / แทรกแทน - Unsort CC - 7 |

## Node Folder Pattern (5 files per node)

Every Figma MCP fetch saves 5 files to `node-{id}-{name}/`:
```
node-{id}-{name}/
├── spec.md              # Layout, colors, spacing, typography summary
├── screenshot.md        # Screenshot image (embedded or link)
├── design-context.md    # Raw design context data from get_design_context
├── variables.md         # Design variables/tokens from get_variable_defs
└── styles.css           # Extracted CSS styles ready to use
```

## Fetched Node Specs (5-file folders)

| Folder | Node | Status | Used For |
|--------|------|--------|----------|
| `node-2-17435-page-auto-selling/` | `2:17435` | spec only | Page metadata overview |
| `node-2-20263-default/` | `2:20263` | 5 files + SVG | Default state — main layout, tables, title bar, filter bar |
| `node-2-18859-detail-adjustment/` | `2:18859` | 5 files + SVG | Detail panel + Adjustment panel (HC click state) |
| `node-2-23259-edit-manual-keyin/` | `2:23259` | 5 files | Edit & Manual Key-in popup |
| `node-2-25046-success-modal/` | `2:25046` | 5 files | Save success confirmation modal |
| `node-2-25077-edit-single-item/` | `2:25077` | 5 files | Edit single item popup |
| `node-2-31555-cancel-send-otp/` | `2:31555` | 5 files | Cancel Send with OTP popup |

## Design Tokens
See `design-tokens.md` (to be populated from detailed node specs)

## CSS Variant Gradients (temporary — copied from Reconcile)
| Variant | Gradient |
|---------|----------|
| Unfit (default) | No override (uses base) |
| Unsort CC | `linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%)` |
| CA Member | `linear-gradient(90deg, #afc5aa, #d3e3cd)` |
| CA Non-Member | `linear-gradient(90deg, #bac0d1, #c3d0de)` |

> These values are copied from Reconcile. Update from Figma spec when available.
