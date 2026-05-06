# Design Context: Holding UNFIT — Main Page

**Figma Node ID:** `41:28771`
**Node Name:** Holdin - Unfit
**Dimensions:** 1440 x 900
**Type:** WEB_PAGE_OR_APP_SCREEN

## Overview

Full-page Holding (No Detail) view for the UNFIT banknote type variant. Contains navigation header, page title with action buttons, info card, sorting results table, summary footer, and reject action button.

## Asset References

| Asset | Figma Node | Purpose |
|-------|-----------|---------|
| imgVector | 1:129 | Printer icon fill |
| imgImage1 | 41:28777 | Background watermark (20% opacity) |
| imgImage2 | 41:29093 | Denomination badge watermark (30% opacity) |
| imgGradientForground | 41:28776 | Gradient mask |
| imgGroupCopy | 41:28783 | Logo icon (30x30) |
| imgGroupCopy1 | 41:28966 | Logo label |
| imgVector1 | 41:28998 | Dropdown chevron icon |
| imgAvatar | 41:29015 | User avatar (30x30) |
| imgIconWrapper | 41:29046 | Alert icon (14x14) |
| imgWrapper | 41:29046 | Calendar/alert icon in date row |
| imgWrapper1 | 41:29076 | Sort icon in table headers |

## Root Container (41:28771)

- Background: `#e8e8e8`
- Layout: `flex flex-col items-start`
- Size: 1440 x 900

### Background Layer (41:28772)

- Base: `#ededed` (1440.5 x 899.1)
- Foreground Color (41:28774): 1440 x 450
  - Gradient: `linear-gradient(116.695deg, rgb(185, 213, 225) 0.744%, rgb(223, 226, 227) 100%)`
  - Border radius: `7px`
  - Background images at `opacity: 20%`

## Navigation Header (41:28779)

- Background: `rgba(185, 213, 225, 0.85)`
- Border bottom: `rgba(0, 0, 0, 0.05)` solid
- Height: 40px, Width: 1440px
- Padding: horizontal `12px` (`--space/s-sm`)
- Gap: 8px

### Logo Area (41:28782)
- Size: 306 x 34px
- Logo icon: 30x30px
- System name: "ระบบตรวจสอบการนับคัดธนบัตร" — Pridi Medium 13px, `#212121`, letterSpacing 0.325px
- Version: "Version 1.0.0" — 10px, `#212121`, letterSpacing 0.25px

### Navigation Menu (41:28991)
- Gap: 30px
- "Reconciliation": Pridi SemiBold 16px, `#212121`, letterSpacing 0.4px
- Dropdown icon: 12x12px chevron

### Profile Section (41:29009)
- Gap: 4px (`--space/s-xxxsm`)
- Padding-left: 8px (`--space/s-xsm`)
- User name: Pridi Regular 13px (`--font-size/text-md-base`), `#212121`, letterSpacing 0.286px
- Role: Pridi Regular 11px (`--font-size/text-xs`), letterSpacing 0.242px
- Avatar: 30x30px

## Page Title Area (41:29019)

- Height: 62px, Width: 1440px
- Padding: horizontal 16px

### Title (41:29023): "Holding UNFIT"
- Font: Pridi SemiBold 30px
- Color: `#212121` (`--texts/text-neutral-primary`)
- Letter spacing: 0.675px
- Line height: 1.2

### Action Buttons (41:29025)
- Gap: 16px

**"Reconcile Transaction" (41:29026):**
- Background: `#003366`
- Padding: 8px horizontal, 4px vertical
- Border radius: 4px
- Text: Pridi Medium 16px, white, letterSpacing 0.4px

**"Print Data" (41:29031):**
- Background: `#003366`
- Padding: 12px horizontal, 6px vertical
- Border radius: 6px
- Icon + text gap: 8px
- Text: Pridi Medium 16px, white, letterSpacing 0.4px

## Main Content Area (41:29036)

- Height: 798px, Width: 1440px
- Padding: vertical 16px
- Layout: flex column, items-center

### Content Container (41:29037)
- Width: 760px (centered)

## Info Card (41:29039)

- Background: white
- Border: 1px solid `#cbd5e1` (`--separators/seprator-opaque`)
- Border radius: 12px (`--rounded/r-sm`)
- Padding: 16px vertical, 12px horizontal
- Gap: 24px (between columns)
- Height: 113px

### Left Column (41:29040) — 356px wide

**Date Row (41:29041):**
- Background: `#f8d7da`
- Border radius: 4px
- Padding: 4px
- Height: 27px
- Labels: Pridi Regular 18px, `#212121`
- Alert icon: 14x14px

**Sorter Row (41:29047):**
- Labels: Pridi Regular 18px, `#212121`
- Height: 27px

**Reconciliator Row (41:29051):**
- Labels: Pridi Regular 18px
- Right text width: 100px
- Height: 27px

### Right Column (41:29055) — 356px wide

**Sorting Machine Row (41:29056):**
- Labels: Pridi Regular 18px

**Shift Row (41:29060):**
- Right text width: 100px

## Data Table (41:29064)

- Background: white
- Border: 1px solid `#cbd5e1`
- Border radius: 12px
- Height: 378px
- Overflow: `overflow-x-clip overflow-y-auto`

### Table Title (41:29066)
- Text: "สรุปยอดผลการนับคัด"
- Font: Pridi Medium 20px, `#212121`, letterSpacing 0.5px
- Border bottom: `#cbd5e1`
- Padding: 16px horizontal, 8px vertical
- Height: 40px

### Table Header Row (41:29073)
- Background: `#d6e0e0`
- Height: 30px
- Padding: horizontal 8px
- Border bottom: `#cbd5e1`
- Font: Pridi Medium 16px, `#212121`, letterSpacing 0.4px
- Column widths: 186px each (4 columns)
- Sort icon: 12x12px per column

### Table Data Rows
- **Odd rows:** white background
- **Even rows:** `#f2f6f6` background
- Row height: 40px (with data), 36px (empty)
- Padding: horizontal 8px
- Border bottom: `#cbd5e1`
- Text: Pridi Regular 18px, `#212529`, letterSpacing 0.45px

### Denomination Badge
- Background: `#fbf8f4`
- Border: 2px solid `#9f7d57`
- Size: 47 x 24px
- Text: Pridi Bold 13px, `#4f3e2b`
- Background image at 30% opacity, mix-blend-mode: color-burn

### Scrollbar (41:29155)
- Width: 8px, right edge
- Background: white
- Border: left and right `#cbd5e1`
- Thumb: `#909090`, height 52px, border-radius 26px, width 4px

## Summary Card (41:29160)

- Background: white
- Border: 1px solid `#cbd5e1`
- Border radius: 12px
- Padding: 16px vertical, 12px horizontal
- Gap: 8px
- Font: Pridi Regular 18px, letterSpacing 0.45px

### Summary Lines

| Row | Label | Value Color |
|-----|-------|-------------|
| 1 | รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น (+) | `#212121` (bold) |
| 2 | รวมธนบัตร Reject จำนวนทั้งสิ้น (+) | `#dc2626` (bold, `--texts/text-negative-secondary`) |
| 3 | ธนบัตร ปลอม/ชำรุด จำนวนทั้งสิ้น (0) | `#212121` (bold) |
| 4 | เกินจำนวน (ระบบ) จำนวนทั้งสิ้น (0) | `#2563eb` (bold, `--texts/text-info-primary`) |

### Total Row (41:29182)
- Border top: `#cbd5e1`
- Padding top: 8px
- Label: bold
- Gap between number and unit: 8px

## Action Button (41:29189)

- Text: "ส่งยอด Reject"
- Background: `#003366`
- Border: 1px solid `#003366`
- Border radius: 8px
- Padding: 17px horizontal, 9px vertical
- Text: Pridi Medium 20px, white, letterSpacing 0.5px
- Width: 376px (flex: 1 sharing row with empty spacer)

## Design Tokens Referenced

| Token | Value |
|-------|-------|
| `--space/s-zero` | 0px |
| `--space/s-xxxxsm` | 2px |
| `--space/s-xxxsm` | 4px |
| `--space/s-xsm` | 8px |
| `--space/s-sm` | 12px |
| `--space/s-md` | 16px |
| `--font-size/text-xs` | 11px |
| `--font-size/text-md-base` | 13px |
| `--rounded/r-sm` | 12px |
| `--separators/seprator-opaque` | `#cbd5e1` |
| `--strokes/stroke-neutral-primary` | `#cbd5e1` |
| `--gray-300` | `#cbd5e1` |
| `--texts/text-neutral-primary` | `#212121` |
| `--texts/text-neutral-tertiary` | `#909090` |
| `--texts/text-negative-secondary` | `#dc2626` |
| `--texts/text-info-primary` | `#2563eb` |
| `--color/neutral-text-primary` | `#212121` |
| Gray/800 | `#343A40` |
| Gray/600 | `#6C757D` |
| Gray/White | `#FFFFFF` |
| Primary | `#003366` |
| Body Text/Body Color | `#212529` |
| Theme/Danger | `#DC3545` |

## Typography Tokens

| Token | Family | Style | Size | Weight | Line Height | Letter Spacing |
|-------|--------|-------|------|--------|-------------|----------------|
| Body Large | Pridi | Regular | 18px | 400 | 1.5 | 2.5px |
| Heading/H5 | Pridi | Medium | 20px | 500 | 1.2 | 2.5px |
| Form Label | Pridi | Regular | 13px | 400 | 100 | 2.5px |

## Bootstrap Component References

- **button (1:7625):** Bootstrap 5.3 button — https://getbootstrap.com/docs/5.3/components/buttons/
- **icon-wrapper (1:14):** Icon with multi-size
- **text/text (1:222):** Text Bullet List
