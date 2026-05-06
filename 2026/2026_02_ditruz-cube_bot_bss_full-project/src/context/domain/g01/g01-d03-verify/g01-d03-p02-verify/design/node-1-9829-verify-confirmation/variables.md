# Design Variables: Verify Confirmation

**Figma Node:** `1:9829`
**Date:** 2026-02-19
**Source:** Inherited from p01 Auto Selling (node 2:20263) + SVG export verification
**SVG Source:** `Verify - Unsort CC - 4.svg` (Figma export)

---

## Shared Variables (same Figma file as p01)

These tokens are shared across the BSS-Verify Figma file and confirmed from p01's `get_variable_defs` fetch:

```json
{
  "Font Size/text-md-base": "13",
  "Font Size/text-xs": "11",
  "Texts/text-neutral-primary": "#212121",
  "Color/neutral-text-primary": "#212121",
  "Body Text/Body Color": "#212529",
  "Theme/Danger": "#DC2626",
  "Theme/Body Background": "#FFFFFF",
  "Theme/Border": "#DEE2E6",
  "Primary": "#003366",
  "Theme Colors/Primary": "#0d6efd",
  "Separators/seprator-opaque": "#cbd5e1",
  "Strokes/stroke-neutral-primary": "#cbd5e1",
  "Gray/White": "#FFFFFF",
  "Gray/400": "#CED4DA",
  "Gray/600": "#6C757D",
  "Gray/800": "#343A40",
  "Slate/50": "#f8fafc",
  "Green/500": "#198754",
  "Red/100": "#fee2e2",
  "Red/400": "#f87171",
  "Red/950": "#450a0a",
  "Rounded/r-sm": "12",
  "Space/s-zero": "0",
  "Space/s-xxxxsm": "2",
  "Space/s-xxxsm": "4",
  "Space/s-xsm": "8",
  "Space/s-sm": "12",
  "Space/s-md": "16",
  "Space/s-lg": "24",
  "Table header": "Font(family: \"Pridi\", style: Medium, size: 13, weight: 500, lineHeight: 100, letterSpacing: 2.3)",
  "Table body": "Font(family: \"Pridi\", style: Regular, size: 13, weight: 400, lineHeight: 1, letterSpacing: 2.2)",
  "Form Label": "Font(family: \"Pridi\", style: Regular, size: 13, weight: 400, lineHeight: 100, letterSpacing: 2.5)",
  "Form Label 2": "Font(family: \"Pridi\", style: Regular, size: 14, weight: 400, lineHeight: 100, letterSpacing: 2.5)",
  "Body": "Font(family: \"Pridi\", style: Regular, size: 14, weight: 400, lineHeight: 100, letterSpacing: 2.2)",
  "Heading/H6": "Font(family: \"Pridi\", style: Medium, size: 16, weight: 500, lineHeight: 1.2, letterSpacing: 2.5)"
}
```

---

## Page-Specific Variables (SVG verified)

| Token | Value | Usage in p02 |
|-------|-------|-------------|
| Info card date bg | #f8d7da | Date row background (alert state) |
| Info card row border | #CBD5E1 | Row separator |
| Table header bg | #D6E0E0 | Column header background |
| Table header text | #4a5568 | Column header text color |
| Sort icon color | #94a3b8 | Sort arrow icon color |
| Even row bg | #F2F6F6 | Alternating row stripe |
| Hover row bg | #f1f5f9 | Row hover state |
| Danger value | #DC2626 | Red values (Reject/ขาด/เกิน) |
| Summary unit color | #4a5568 | "ฉบับ" suffix text |
| Badge bg | #FBF8F4 | Denomination badge background |
| Back button bg | #6c757d | Gray back button |
| Back button hover | #5a6268 | Gray back button hover |
| Back button border | 1px solid #6c757d | Button stroke |
| Verify button bg | #003366 | Navy verify button |
| Verify button hover | #002244 | Navy verify button hover |
| Verify button border | 1px solid #003366 | Button stroke |
| Print button bg | #003366 | Navy print button |
| Content width | 640px | x=400 to x=1040 in SVG |
| Button size | 289 x 47px | Footer buttons |
| Button radius | 7.5px | rx=7.5 from SVG |

---

## CSS Variable Mapping

```css
/* Page-specific variables for Verify Confirmation */
:root {
  /* Info Card */
  --vc-info-date-bg: #f8d7da;
  --vc-info-row-border: #CBD5E1;

  /* Table */
  --vc-table-header-bg: #D6E0E0;
  --vc-table-header-text: #4a5568;
  --vc-table-sort-icon: #94a3b8;
  --vc-table-even-row: #F2F6F6;
  --vc-table-hover-row: #f1f5f9;

  /* Summary */
  --vc-danger: #DC2626;
  --vc-summary-unit: #4a5568;

  /* Buttons */
  --vc-btn-back: #6c757d;
  --vc-btn-back-hover: #5a6268;
  --vc-btn-verify: #003366;
  --vc-btn-verify-hover: #002244;
  --vc-btn-print: #003366;
  --vc-btn-print-hover: #002244;
}
```
