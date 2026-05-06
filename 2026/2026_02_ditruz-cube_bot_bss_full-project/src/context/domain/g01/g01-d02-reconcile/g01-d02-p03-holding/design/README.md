# Holding Detail UNFIT — Design

Figma design specs สำหรับ Holding Detail UNFIT

## Figma Source

- **File:** Figma_BSS---Reconciliation--rev_1-
- **URL:** https://www.figma.com/design/OAMmUhXjYQKdYn5TAXGnAN/Figma_BSS---Reconciliation--rev_1-?node-id=1-18004&m=dev
- **Main node:** `1-18004` (Reconcile - Unfit)

## Layout Overview

- **Page:** Full viewport (92vh), 2-column × 3-row grid inside `.main-wrapper` (1410px)
- **Left column:** 60% — มัดครบ panels (count = green)
- **Right column:** 40% — มัดขาด-เกิน panels (count = orange, title = orange)
- **Title bar:** h1 left, 2×2 info pairs center, nav buttons right

## Title Bar Info (2×2 flex pairs)

| Row | Left Pair | Right Pair |
|-----|-----------|------------|
| 1 | Date: `value` (pink highlight `#FEE2E2`) | Supervisor: `value` |
| 2 | Sorting Machine: `value` | Shift: `value` |

- Labels: `#212121`, 13px, weight 400
- Values: `#212121`, 14px, weight 600
- Pair gap (label→value): 6px
- Column separator: `padding-left: 32px`

## Panel Structure

### Panel Header
- Background: `#f8f9fa`
- Border bottom: `1px solid #e2e8f0`
- Title font: 13px, weight 700, color `#212121`
- Title orange variant: color `#B45309`
- Count: "จำนวน: **N** ฉบับ"
  - Green: `#16a34a` (panels 1, 2, 3)
  - Orange: `#D97706` (panels 4, 5, 6)

### Table
- Header bg: `#D6E0E0`
- Header font: 12px, bold, color `#000`
- Cell font: 12px
- Borders: `1px solid #CBD5E1` (separate, spacing 0)
- Alternating rows: `#f2f6f6` (even)
- Hover: `#f1f5f9`
- Active row: `#D1E5FA` with blue border `#297ED4`
- Sort icon: `bi-diamond` (◇)
- Row height: 36px

### Column Widths (colgroup)
- 4-column tables (P1, P2, P4, P5, P6): `32% | 14% | 34% | 20%`
- 6-column table (P3): `24% | 12% | 14% | 10% | 16% | 24%`

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Panel header bg | `#f8f9fa` | `.hd-panel-hdr` |
| Panel header border | `#e2e8f0` | `.hd-panel-hdr` border-bottom |
| Table header bg | `#D6E0E0` | `thead th` |
| Table border | `#CBD5E1` | All cell borders |
| Even row bg | `#f2f6f6` | `tr:nth-child(even)` |
| Hover row bg | `#f1f5f9` | `tr:hover` |
| Active row bg | `#D1E5FA` | `tr.active-row` |
| Active row border | `#297ED4` | `tr.active-row td` |
| Green count | `#16a34a` | `.is-green` |
| Orange count | `#D97706` | `.is-orange` |
| Orange title | `#B45309` | `.hd-panel-title.is-orange` |
| Date highlight bg | `#FEE2E2` | `.info-pair.date-highlight` |
| Label text | `#212121` | `.title-info-label`, `.title-info-value` |
| Alert icon fill | `#DC3545` | SVG alert icon |
| Denom badge bg | `#DCFCE7` | `.denom-badge` |
| Denom badge text | `#16a34a` | `.denom-badge` |
| Nav button bg | `#003366` | `.btn-nav-filled` |

## Figma Node Index

| Node ID | Description | Status | Detail Folder |
|---------|-------------|--------|---------------|
| `1-18004` | Reconcile - Unfit — main page | Implemented | [node-1-18004-reconcile-unfit/](./node-1-18004-reconcile-unfit/) |

## Node Detail Folders

- **[node-1-18004-reconcile-unfit/](./node-1-18004-reconcile-unfit/)** — design-context.md, metadata.xml, screenshot-description.md, variables.json
- **ref.svg** — Reference SVG export for the page
