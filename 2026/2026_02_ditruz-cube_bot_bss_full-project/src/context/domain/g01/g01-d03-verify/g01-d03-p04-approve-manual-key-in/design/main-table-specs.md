# Main Table Section Specs - Figma Node 2:49978

**Date:** 2026-02-20
**Figma URL:** https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=2-49978
**Component:** Approve Manual Key-in Main Table Section

## Container

- **Dimensions:** 2053px × 421px (min-height: 215px)
- **Background:** #FFFFFF (white)
- **Border:** 1px solid #CBD5E1 (var(--separators/seprator-opaque))
- **Border radius:** 12px (var(--rounded/r-sm))
- **Padding:** 0px

## Table Header

- **Background:** #D6E0E0 (teal-gray)
- **Text color:** #212121 (var(--texts/text-neutral-primary))
- **Font:** 13px / Pridi Medium (500) / line-height normal
- **Letter spacing:** 0.286px - 0.299px
- **Padding:** 8px (cells)
- **Border bottom:** 1px solid #CBD5E1 (var(--gray-300))
- **Contains sort icons:** 12px × 12px SVG

## Table Body Cells

- **Text color:** #212529 (Body Text/Body Color)
- **Font:** 14px / Pridi Regular (400) / line-height 1.5
- **Letter spacing:** 0.35px (standard), 0.286px - 0.308px (some cells)
- **Padding:** 6px 8px (vertical 6px, horizontal 8px)
- **Border bottom:** 1px solid #CBD5E1 (var(--strokes/stroke-neutral-primary))
- **Text overflow:** ellipsis for long content

## Row States

- **Default (white):** Background #FFFFFF, border bottom #CBD5E1
- **Alternating (gray):** Background #F2F6F6 (light gray), border bottom #CBD5E1
- **Hover:** Background #e8f4ff (light blue)
- **Selected/Active:** Background #D1E5FA (light blue), border 2px solid #297ED4 (blue)
- **Empty rows:** Height 34px, border bottom #CBD5E1, alternate white/gray backgrounds

## CSS Implementation

```css
/* Main Table Section - Node 2:49978 */
.approve-main-table-section {
  width: 100%;
  margin-bottom: 16px;
}

.approve-table-wrapper {
  width: 100%;
  max-height: 407px;
  overflow-y: auto;
  border: 1px solid #CBD5E1;
  border-radius: 12px;
  background-color: #FFFFFF;
}

.approve-main-table thead {
  background-color: #D6E0E0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.approve-main-table th {
  padding: 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.286px;
  color: #212121;
  border-bottom: 1px solid #CBD5E1;
}

.approve-main-table td {
  padding: 6px 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.35px;
  color: #212529;
  border-bottom: 1px solid #CBD5E1;
}

/* Row States */
.approve-main-table tbody tr:nth-child(even) {
  background-color: #F2F6F6;
}

.approve-main-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.approve-main-table tbody tr:hover {
  background-color: #e8f4ff;
  cursor: pointer;
}

.approve-main-table tbody tr.selected {
  background-color: #D1E5FA !important;
  border: 2px solid #297ED4;
}
```

## Design Variables

### Colors
- **Texts/text-neutral-primary:** #212121
- **Body Text/Body Color:** #212529
- **Texts/text-neutral-tertiary:** #909090
- **Gray-300:** #cbd5e1
- **Separators/seprator-opaque:** #cbd5e1
- **Strokes/stroke-neutral-primary:** #cbd5e1
- **Background:** #FFFFFF

### Typography
- **Table header:** Font(family: "Pridi", style: Medium, size: 13px, weight: 500, lineHeight: normal, letterSpacing: 0.286px)
- **Table body:** Font(family: "Pridi", style: Regular, size: 14px, weight: 400, lineHeight: 1.5, letterSpacing: 0.35px)

### Spacing
- **Space/s-zero:** 0
- **Space/s-xxxxsm:** 2px
- **Space/s-xxxsm:** 4px
- **Space/s-xsm:** 8px
- **Space/s-md:** 16px

### Border Radius
- **Rounded/r-sm:** 12px
