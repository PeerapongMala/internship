# Design — Revoke Transaction

## Figma References
- **File**: `r8wLwGvG3I4vYU6SLQ1jec`
- **Main Page Node**: `2:51049` — "Revoke" (parent frame)

## Page Structure Overview

Root node `2:51049` มี **4 variants** ตาม BnType:

| Node ID | Name | Variant | Columns (HC Table) |
|---------|------|---------|--------------------|
| `2:51051` | Revoke Unsort CC | revoke-unsort-cc | ☐ HC, ธนาคาร, Zone, Cashpoint, วันเตรียม, วันนับคัด, shift |
| `2:52386` | Revoke UNFIT | revoke-unfit | ☐ บาร์โค้ดรายห่อ, บาร์โค้ดรายมัด, HC, ธนาคาร, ศูนย์เงินสด, วันเตรียม, วันนับคัด, shift |
| `2:51248` | Revoke CA Member | revoke-ca-member | ☐ HC, ธนาคาร, Zone, Cashpoint, วันเตรียม, วันนับคัด, shift |
| `2:51641` | Revoke CA Non-Member | revoke-ca-non-member | ☐ บาร์โค้ดรายห่อ, บาร์โค้ดรายมัด, HC, ธนาคาร, ศูนย์เงินสด, วันเตรียม, วันนับคัด, shift |

## Layout: Single-Column (ต่างจาก Verify 6-panel)

Revoke ใช้ **single-column layout** — ไม่มี right panel:

### Content Area:
| # | Section | Description |
|---|---------|-------------|
| 1 | Title Bar | "Revoke {VARIANT}" + Date + Supervisor |
| 2 | Filter Bar | Dropdowns (3-4 ตาม variant) + Filter button |
| 3 | Table 1: รายการ Header Card | HC list with checkboxes, sortable columns |
| 4 | Table 2: แสดงผลการนับคัด | Denomination detail (ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ) |
| 5 | Action Row | Revoke button (right-aligned) |

### Variant Differences:
| Feature | CC / CA Member | UNFIT / CA Non-Member |
|---------|---------------|----------------------|
| HC Table columns | 8 cols (Zone + Cashpoint) | 10 cols (บาร์โค้ดรายห่อ + รายมัด + ศูนย์เงินสด) |
| Filter dropdowns | 4 (ธนาคาร, Zone, Cashpoint, ชนิดราคา) | 3 (ธนาคาร, ศูนย์เงินสด, ชนิดราคา) |
| Nav color | nav-orange / nav-green | nav-blue-light / nav-purple |
| BG gradient | orange or green | blue-grey or purple-grey |

## Confirm Modal (node 2:52202 / 2:52791)

- Modal with selected HC items table
- Manager select dropdown
- Confirm / Cancel buttons

## Node Folder Pattern (5 files per node)

Every Figma MCP fetch saves 5 files to `node-{id}-{name}/`:
```
node-{id}-{name}/
├── spec.md              # Layout, colors, spacing, typography summary
├── screenshot.md        # Screenshot image description
├── design-context.md    # Raw design context data from get_design_context
├── variables.md         # Design variables/tokens from get_variable_defs
└── styles.css           # Extracted CSS styles ready to use
```

## Fetched Node Specs

| Folder | Node | Status | Used For |
|--------|------|--------|----------|
| `node-2-51049-revoke/` | `2:51049` | spec.md only | Parent frame overview — from existing implementation |
| `node-2-51051-unsort-cc/` | `2:51051` | spec.md only | Unsort CC variant — fetched via Figma MCP |
| `node-2-52386-unfit/` | `2:52386` | TODO | UNFIT variant — Figma MCP rate limited |
| `node-2-51248-ca-member/` | `2:51248` | TODO | CA Member variant |
| `node-2-51641-ca-non-member/` | `2:51641` | TODO | CA Non-Member variant |
| `node-2-52202-confirm-modal/` | `2:52202` | TODO | Revoke confirm modal |

## Design Tokens
See `design-tokens.md`

## CSS Variant Gradients
| Variant | CSS File | Gradient |
|---------|----------|----------|
| Unsort CC | `revoke-unsort-cc.css` | `linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%)` |
| CA Member | `revoke-ca-member.css` | `linear-gradient(90deg, #afc5aa, #d3e3cd)` |
| CA Non-Member | `revoke-ca-non-member.css` | `linear-gradient(90deg, #bac0d1, #c3d0de)` |
| UNFIT | (ยังไม่มี — ใช้ base) | TBD from Figma |
