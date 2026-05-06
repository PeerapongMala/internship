# Design Tokens — Verify Auto Selling

Extracted from Figma MCP `get_design_context` on node `2:20263` (Auto Selling - Unsort CC - Default)  
Date: 2026-02-19

## Colors

### Primary Colors

| Token            | Value                 | Usage               |
| ---------------- | --------------------- | ------------------- |
| Primary Blue     | `#003366`             | Buttons, Navigation |
| Text Primary     | `#212121` / `#212529` | Main text           |
| Background White | `#FFFFFF`             | Page background     |

### State & Status Colors

| Token                 | Value     | Usage                         |
| --------------------- | --------- | ----------------------------- |
| Success Green         | `#198754` | Count numbers, success states |
| Danger Red            | `#DC3545` | Error states                  |
| Warning Yellow BG     | `#FEFCE8` | Badge background              |
| Warning Yellow Border | `#FACC15` | Badge border                  |
| Warning Yellow Text   | `#713F12` | Badge text                    |

### Backgrounds & Borders

| Token              | Value                 | Usage                        |
| ------------------ | --------------------- | ---------------------------- |
| Info Panel Pink    | `#F8D7DA`             | Date info background         |
| Table Header BG    | `#D6E0E0`             | Column headers               |
| Alternating Row BG | `#F2F6F6`             | Every other table row        |
| Border Gray        | `#CED4DA` / `#CBD5E1` | Input borders, table borders |
| Border Secondary   | `#DEE2E6`             | General borders              |
| Gray 600           | `#6C757D`             | Secondary text               |
| Gray 400           | `#CED4DA`             | Form borders                 |
| Gray 800           | `#343A40`             | Dark text                    |

## Typography

### Font Family

**Pridi** (Google Font) → **Implement as `'bss-pridi'`**

- Regular (400)
- Medium (500)
- SemiBold (600)
- Bold (700)

### Text Styles

| Element             | Font  | Size | Weight | Line Height  | Letter Spacing |
| ------------------- | ----- | ---- | ------ | ------------ | -------------- |
| Page Title          | Pridi | 30px | 600    | 1.2 (36px)   | 0.675px        |
| Section Header      | Pridi | 16px | 500    | 1.2 (19.2px) | 0.4px          |
| Button Text (Large) | Pridi | 20px | 500    | 1.5 (30px)   | 0.5px          |
| Button Text (Small) | Pridi | 16px | 500    | 1.5 (24px)   | 0.4px          |
| Form Label          | Pridi | 14px | 400    | 1 (14px)     | 0.35px / 2.5px |
| Body Text           | Pridi | 14px | 400    | 1.5 (21px)   | 0.35px         |
| Table Header        | Pridi | 13px | 500    | 1 (13px)     | 0.299px        |
| Table Body          | Pridi | 13px | 400    | 1 (13px)     | 0.286px        |
| Info Text Small     | Pridi | 12px | 400    | 1.5 (18px)   | 0.3px          |
| Count Number (Bold) | Pridi | 14px | 700    | normal       | 0.308px        |

## Spacing

### Gaps & Margins

| Token                | Value |
| -------------------- | ----- |
| Section Gap Large    | 30px  |
| Section Gap Standard | 16px  |
| Section Gap Compact  | 8px   |
| Filter Dropdown Gap  | 8px   |
| Button Gap           | 16px  |
| Info Panel Gap       | 4px   |

### Padding

| Element          | Padding                            |
| ---------------- | ---------------------------------- |
| Title Section    | 18.5px horizontal                  |
| Filter Bar       | 24px horizontal × 16px top         |
| Info Panel       | 8px all sides                      |
| Table Header     | 16px horizontal × 8px vertical     |
| Table Body Cells | 8px horizontal × 6px vertical      |
| Button Small     | 16px horizontal × 4px vertical     |
| Button Large     | 17px horizontal × 9px vertical     |
| Select Dropdown  | 9px left, 13px right, 5px vertical |

## Border & Border Radius

### Border Width

| Element            | Width |
| ------------------ | ----- |
| Standard           | 1px   |
| Badge              | 1px   |
| Denomination Badge | 2px   |

### Border Radius

| Element         | Radius        |
| --------------- | ------------- |
| Info Panel      | 12px          |
| Tables          | 12px          |
| Button Small    | 4px           |
| Button Medium   | 6px           |
| Button Large    | 8px           |
| Select Dropdown | 4px           |
| Status Badge    | 23.5px (pill) |
| Checkbox        | 4px           |

## Layout Dimensions

| Section           | Width × Height |
| ----------------- | -------------- |
| Page              | 1440 × 900px   |
| Navigation Header | 1440 × 40px    |
| Title Bar         | 1440 × 62px    |
| Filter Bar        | 1408 × 63px    |
| Tables Container  | 1408 × 663px   |
| Bottom Actions    | 1408 × 64px    |
| Left Table Panel  | 844.8px        |
| Right Panel       | 555.2px        |
