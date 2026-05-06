# Design Tokens — Revoke Transaction

> Extracted from Figma Node `2:51051` (Unsort CC) + implementation

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#003366` | Revoke button background, nav active link |
| Primary Hover | `#002244` | Button hover state |
| Body Text | `#212529` | Main text color, table cell text |
| Text Neutral Primary | `#212121` | Page title, table headers, labels |
| White | `#FFFFFF` | Page background, table background, card background |
| Gray/400 | `#CED4DA` | Input borders, select borders |
| Gray/600 | `#6C757D` | Placeholder text, checkbox border |
| Theme/Danger | `#DC3545` | Error states |
| Theme/Border | `#DEE2E6` | Checkbox border, table row separators |
| Separator Opaque | `#CBD5E1` | Table outer border |
| Table Header BG | `#D6E0E0` | Table header row background |
| Table Header Hover | `#C5D0D0` | Header hover state |
| Selected Row BG | `#D1E5FA` | Selected/checked row background |
| Selected Row Border | `#297ED4` | Selected row left border (2px) |
| Alternating Row BG | `#F2F6F6` | Zebra striping odd rows |
| Denomination Badge BG | `#FBF8F4` | Denomination badge background |
| Denomination Badge Border | `#9F7D57` | Denomination badge border (2px) |
| Denomination Badge Text | `#4F3E2B` | Denomination badge text |
| Filter Button BG | `#003366` | Filter button fill |
| Badge Status Send | `#fff3cd` bg / `#856404` text | SendToCBMS badge |
| Badge Status Revoked | `#d4edda` bg / `#155724` text | Revoked badge |
| Badge Status Edited | `#fee2e2` bg / `#DC3545` text | Edited badge |
| Scrollbar Thumb | `#909090` | Scrollbar thumb color |

## Typography (Font: bss-pridi)

| Style | Size | Weight | Letter Spacing | Usage |
|-------|------|--------|----------------|-------|
| Page Title | 30px | 600 (SemiBold) | 0.675px | "Revoke UNSORT CC" |
| Section Title | 16px | 600 (SemiBold) | 0.4px | "รายการ Header Card" section header |
| Table Header | 13px | 500 (Medium) | ~0.3px | Column headers |
| Body/Small | 14px | 400 (Regular) | 0.35px | Filter labels, info text |
| Table Cell | 12px | 400 (Regular) | 0.3px | Table cell data |
| Table Cell Number | 14px | 400 (Regular) | 0.35px | Numeric values |
| Select Placeholder | 14px | 400 (Regular) | 0.35px | "Please select" |
| Button Text | 20px | 500 (Medium) | 0.5px | Revoke button label |
| Denomination Badge | 13px | 700 (Bold) | 0.325px | "1000" badge text |
| Info Text | 12px | 400 (Regular) | 0.3px | Date/Supervisor labels |

## Spacing & Sizing

| Property | Value | Usage |
|----------|-------|-------|
| Page padding (horizontal) | 16px | Main content horizontal padding |
| Title row height | 62px | Title + date/supervisor area |
| Filter bar padding | 12px top/bottom, 16px horizontal | Filter row |
| Filter gap | 4px | Gap between label and select |
| Select border-radius | 4px | Filter dropdowns |
| Table border-radius | 12px | Table card corners |
| Table border | 1px solid #CBD5E1 | Table outer border |
| Table header height | 30px | Column header row |
| Table 1 row height | 33px | HC table data rows |
| Table 2 row height | 40px | Detail table data rows |
| Table cell padding | 8px horizontal, 6px vertical | Data cell padding |
| Checkbox size | 16px x 16px | Checkbox input |
| Checkbox border-radius | 4px | Unchecked checkbox corner |
| Sort icon size | 12px x 12px | Column sort indicator |
| Denomination badge | 47px x 24px | Currency badge |
| Revoke button width | 229px | Button width |
| Revoke button padding | 17px horizontal, 9px vertical | Button padding |
| Revoke button border-radius | 8px | Button corners |
| Gap between tables | 8px | flex gap |
| Action row padding | 8px vertical | Row containing Revoke button |

## Components

### Checkbox
- Native browser checkbox
- `accent-color: #003366`
- `border: 1.5px solid #6c757d`
- `border-radius: 3px`
- Size: 16 x 16 px

### Denomination Badge
- `border-radius: 0` (สี่เหลี่ยม)
- `font-weight: 700`
- `display: flex; justify-content: center; align-items: center`
- Colors from all.css `.qty-badge` + `.qty-{price}` classes

### Revoke Button
- BG: `#003366`, hover: `#002244`
- Text: white, 20px, weight 500
- Border-radius: 8px
- Width: 229px

### Sort Icon
- Bootstrap icon `bi-chevron-expand` (12px)
- Shown on all sortable column headers
