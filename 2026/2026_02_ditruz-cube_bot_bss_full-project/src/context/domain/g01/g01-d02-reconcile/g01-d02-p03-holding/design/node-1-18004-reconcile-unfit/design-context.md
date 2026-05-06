# Design Context: Reconcile - Unfit

**Figma Node ID:** `1:18004`
**Node Name:** Reconcile - Unfit
**Type:** WEB_PAGE_OR_APP_SCREEN
**Dimensions:** 1440 x 900

## Overview

This is the "Reconciliation UNFIT" page — a form-based interface for reconciling unfit banknotes
(Reject, Counterfeit, Damaged). It shows a two-column layout with a header card detail table on the
left and a classification form on the right, plus a summary table below.

## Page Structure

### 1. Title Bar (Frame 6126)
- Node `1:18013` — "Reconciliation UNFIT" heading
- Full width, 1403 x 36

### 2. Main Content (Frame 6116)
- Node `1:18017` — 1408 x 840

#### 2a. Top Section (Frame 6160) — 1408 x 402
- **Header Info Bar** (Frame 6113, node `1:18019`):
  - Header Card: `0054941201` (bordered input box)
  - จำนวนมัด/Header Card: `1`
  - Date/Time: `21/07/2568 14:05:39`

- **Split Panel** (Frame 6161, node `1:18031`):
  - **Left — Table** (node `1:18033`, 692 x 322):
    - 3 columns: Header Card, ชนิดราคา (price type), จำนวนมัด (bundle count)
    - Sort icons on each column header
    - 1 data row + 7 empty rows (36px height each)
  - **Right — Form** (Frame 6152, node `1:18077`, 692 x 322):
    - Radio group: ประเภทธนบัตร (Reject / ปลอม / ชำรุด)
    - Radio group: ชนิดราคา (1000 / 500 / 100 / 50 / 20) — badge-style labels
    - Select dropdown: แบบ (series)
    - Input field: จำนวน (quantity)
    - Button: "บันทึกตารางสรุปยอด" (save summary table) — green, 300 x 46

#### 2b. Summary Table (node `1:18146`, 1403 x 350)
- Title: "ตารางสรุปยอด"
- 9 columns: Header Card, เวลานับคัด, ชนิดราคา, แบบ, ประเภท, จำนวน (ฉบับ), มูลค่า (บาท), หมายเหตุ, Action
- Sort icons on all columns except Action
- 2 data rows with edit/delete action buttons
- Empty rows below (36px height)

#### 2c. Footer (Frame 6158, node `1:18236`, 1408 x 56)
- Left button: "ยกเลิกกระทบยอด" (cancel reconciliation) — 300 x 48
- Right button: "กระทบยอด" (reconcile) — 300 x 48, positioned at x=1108

## Variables

See `variables.json` for the complete set of 33 design tokens. Key tokens:

- **Primary**: `#003366`
- **Texts/text-neutral-primary**: `#212121`
- **Body Text/Body Color**: `#212529`
- **Separators/seprator-opaque**: `#cbd5e1`
- **Theme/Success**: `#198754`
- **Texts/text-warning-primary**: `#b45309`
- **Table header**: Pridi Medium 13px, weight 500
- **Table body**: Pridi Regular 13px, weight 400
- **Form Label**: Pridi Regular 13px, weight 400
- **Heading/H5**: Pridi Medium 20px
- **Heading/H6**: Pridi Medium 16px
- **Rounded/r-sm**: `12`
- **Space/s-md**: `16`, **Space/s-lg**: `24`, **Space/s-xsm**: `8`

## Key Node IDs

| Node ID | Component | Dimensions |
|---------|-----------|------------|
| `1:18004` | Root frame (Reconcile - Unfit) | 1440 x 900 |
| `1:18005` | Background (gradient + images) | 1440 x 900 |
| `1:18013` | Title bar | 1403 x 36 |
| `1:18019` | Header info bar | 1392 x 48 |
| `1:18033` | Left table (Header Card list) | 692 x 322 |
| `1:18077` | Right form panel | 692 x 322 |
| `1:18146` | Summary table | 1403 x 350 |
| `1:18236` | Footer buttons | 1408 x 56 |

## Existing Files

- Metadata XML: `metadata.xml`
- Variables: `variables.json`
- Screenshot description: `screenshot-description.md`
- Reference SVG: `../ref.svg`
