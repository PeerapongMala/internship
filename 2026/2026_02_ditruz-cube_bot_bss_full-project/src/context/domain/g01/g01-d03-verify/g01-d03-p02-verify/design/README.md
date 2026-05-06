# Design — Verify Confirmation

## Figma References

### File 1: `r8wLwGvG3I4vYU6SLQ1jec` (Figma_BSS-Verify)

| Component | Node | URL |
|-----------|------|-----|
| Main Page | `1:9829` | [Figma](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=1-9829&m=dev) |
| OTP Confirm Modal | `1:11085` | [Figma](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=1-11085&m=dev) |

### File 2: `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9)

| Component | Node | URL |
|-----------|------|-----|
| Success Modal | `1:10201` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/verify-ver-2?node-id=1-10201&m=dev) |
| Error Modal | `1:10210` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/verify-ver-2?node-id=1-10210&m=dev) |

> **สำคัญ:** Main Page + OTP Modal อยู่ใน file 1, แต่ Success/Error Modal อยู่ใน file 2

## Page Structure Overview

Root node `1:9829` is a **single-page confirmation screen** (unlike p01's multi-panel layout):

| Section | Component | Description |
|---------|-----------|-------------|
| Nav Bar | Shared `_Layout.cshtml` | BOT logo, Verify menu, user profile |
| Title Bar | Title + Print button | "Verify {BnTypeName}" + Print Data |
| Info Card | 3-row card | Date (alert bg), Supervisor, Machine |
| Detail Table | 6-column table | ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, ขาด, เกิน |
| Summary Card | 7+1 rows | Totals by category + grand total |
| Footer | 2 buttons | Back to Auto Selling + Verify |

## Layout: Centered Single Column (~640px)

```
┌────────────────────────────── 1440px ──────────────────────────────┐
│  Nav Bar (shared, 1440 x 40)                                       │
│                                                                     │
│  Title Bar (outside wrapper)     [Print Data]                       │
│  ┌──────────────── ~640px centered ────────────────┐               │
│  │ ┌─ Info Card ─────────────────────────────────┐ │               │
│  │ │ Date row (pink bg) │ Supervisor │ Machine   │ │               │
│  │ └─────────────────────────────────────────────┘ │               │
│  │ ┌─ Detail Table (scrollable, max 6 rows) ─────┐ │               │
│  │ │ รายละเอียดธนบัตร                            │ │               │
│  │ │ 6 columns × N rows (sticky header)           │ │               │
│  │ └─────────────────────────────────────────────┘ │               │
│  │ ┌─ Summary Card ──────────────────────────────┐ │               │
│  │ │ 7 summary lines + total                     │ │               │
│  │ └─────────────────────────────────────────────┘ │               │
│  │ [กลับไปหน้า Auto Selling]    [      Verify     ]│               │
│  └─────────────────────────────────────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

## Modal Flow (Verify button click)

All 3 modals share the same layout pattern: **560 × 360 px, 3-section vertical layout**:

```
┌─────────────────── 560px ───────────────────┐
│  Top Bar (141px)                              │
│    Icon (48×48, centered, 32px from top)      │
│    Title (centered, 16px below icon)          │
│                                               │
│  Body (variable height)                       │
│    Message text (centered)                    │
│                                               │
│  ─────── border-top: 1px #cbd5e1 ──────────  │
│  Button Area (70px)                           │
│    [Button(s)] centered, 16px padding         │
└───────────────────────────────────────────────┘
```

| Modal | Icon | Title | Button(s) |
|-------|------|-------|-----------|
| OTP Confirm | ℹ blue `#3D8BFD` | "Verify" | [ยกเลิก `#6c757d`] [ยืนยัน `#003366`] |
| Success | ✓ green `#198754` | "สำเร็จ" | [ตกลง `#198754`] |
| Error | ! red `#DC3545` | "การแจ้งเตือน" | [ตกลง `#003366`] |

## Fetched Node Specs

| Folder | Node | File | Status | Description |
|--------|------|------|--------|-------------|
| `node-1-9829-verify-confirmation/` | `1:9829` | File 1 | Done | Full page — info card, detail table, summary, footer |
| `node-1-11085-otp-modal/` | `1:11085` | File 1 | Done | OTP confirmation modal (560×360) |
| `node-1-10201-success-modal/` | `1:10201` | File 2 | Done | Success modal (560×360) |
| `node-1-10210-error-modal/` | `1:10210` | File 2 | Done | Error modal (560×360) |

## Shared Modal Design Tokens

All 3 modals share these tokens (from Figma variables):

| Token | Value | Usage |
|-------|-------|-------|
| `Body Text/Body Color` | `#212529` | All text |
| `Gray/White` | `#FFFFFF` | Modal background |
| `Slate/300` | `#cbd5e1` | Border/divider |
| `Primary` | `#003366` | Navy buttons |
| `Theme Colors/Secondary` | `#6c757d` | Cancel button |
| `Theme/Success` | `#198754` | Success icon + button |
| `Theme/Danger` | `#DC3545` | Error icon |
| `Blue/400` | `#3D8BFD` | OTP info icon |
| `Heading/H4` | Pridi Medium 24px | Modal titles |
| `Body/Regular` | Pridi Regular 16px | Body text |
| `Space/s-md` | 16px | Base spacing |

## Components

### 1. Nav Bar
- BOT logo (left)
- "Verify" dropdown menu (center-left)
- User avatar + name + "Supervisor" label (right)
- Background: dark navy (#003366)

### 2. Title Section
- "Verify {BnTypeName}" — bold, large font (Pridi/bss-pridi)
- "Print Data" button — dark blue, printer icon, top-right

### 3. Info Card
- Container: white bg, rounded corners, centered ~640px wide
- Date row: pink/red background (#f8d7da), Date value + red alert icon
- Supervisor row: white bg
- Sorting Machine row: white bg
- Font: bss-pridi, ~16px

### 4. Detail Table — "รายละเอียดธนบัตร"
- Container: white bg, rounded corners
- Title: "รายละเอียดธนบัตร" (bold)
- Scrollable: max-height for 6 rows, sticky header
- 6 columns (all sortable):

| Column | Thai | Width |
|--------|------|-------|
| ชนิดราคา | Denomination badge | 83px |
| ประเภท | Type (ดี/ทำลาย/Reject/ปลอม) | 83px |
| แบบ | Series number | 83px |
| จำนวนฉบับ | Count (right-aligned) | 125px |
| จำนวนขาด(ฉบับ) | Shortage (center) | 125px |
| จำนวนเกิน(ฉบับ) | Excess (center) | 125px |

### 5. Summary Card
- Container: white bg, rounded corners
- 7 summary lines + total:

| Line | Sign | Color |
|------|------|-------|
| รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น | (+) | black |
| รวมธนบัตร Reject จำนวนทั้งสิ้น | (+) | **red** (#dc3545) |
| รวมธนขาด จำนวนทั้งสิ้น | (+) | **red** (#dc3545) |
| รวมธนบัตรเกิน จำนวนทั้งสิ้น | (-) | **red** (#dc3545) |
| ธนบัตรชำรุด จำนวนทั้งสิ้น | (O) | black |
| ธนบัตรปลอม จำนวนทั้งสิ้น | (O) | black |
| **รวมทั้งสิ้น** | — | **bold black, 18px** |

### 6. Footer Buttons
- "กลับไปหน้า Auto Selling" — grey bg (#6c757d), 289×47, radius 7.5px
- "Verify" — dark blue bg (#003366), 289×47, radius 7.5px
- Gap: 61px

## BnType Variants

| Code | Title | Nav Color | Background Gradient |
|------|-------|-----------|---------------------|
| UF | Verify UNFIT | nav-blue-light | Blue (default) |
| UC | Verify UNSORT CC | nav-orange | `linear-gradient(98.93deg, #f5a986 0.74%, #f8d4ba 100%)` |
| CA | Verify UNSORT CA MEMBER | nav-green | `linear-gradient(90deg, #afc5aa, #d3e3cd)` |
| CN | Verify UNSORT CA NON-MEMBER | nav-purple | `linear-gradient(90deg, #bac0d1, #c3d0de)` |

## Design Tokens

See `design-tokens.md` for full token reference with organized categories and CSS variable mapping.
