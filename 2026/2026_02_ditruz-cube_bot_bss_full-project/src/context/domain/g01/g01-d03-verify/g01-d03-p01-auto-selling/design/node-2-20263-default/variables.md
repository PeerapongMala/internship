# Design Variables: Auto Selling - Unsort CC - Default State

**Figma Node:** `2:20263`
**Date Fetched:** 2026-02-19

---

## Raw Variable Definitions

```json
{
  "Font Size/text-md-base": "13",
  "Texts/text-neutral-primary": "#212121",
  "HitBox": "#FFFFFF",
  "Color/neutral-text-primary": "#212121",
  "Font Size/text-xs": "11",
  "Space/s-xxxsm": "4",
  "Space/s-zero": "0",
  "Space/s-xxxxsm": "2",
  "Space/s-sm": "12",
  "Body Text/Body Color": "#212529",
  "Theme/Danger": "#DC3545",
  "Rounded/r-sm": "12",
  "Separators/seprator-opaque": "#cbd5e1",
  "Gray/White": "#FFFFFF",
  "Theme Colors/Primary": "#0d6efd",
  "Primary": "#003366",
  "Form Label 2": "Font(family: \"Pridi\", style: Regular, size: 14, weight: 400, lineHeight: 100, letterSpacing: 2.5)",
  "Body/Small": "Font(family: \"Pridi\", style: Regular, size: 14, weight: 400, lineHeight: 1.5, letterSpacing: 2.5)",
  "Gray/800": "#343A40",
  "Theme/Body Background": "#FFFFFF",
  "Gray/400": "#CED4DA",
  "Space/s-lg": "24",
  "Heading/H6": "Font(family: \"Pridi\", style: Medium, size: 16, weight: 500, lineHeight: 1.2, letterSpacing: 2.5)",
  "Green/500": "#198754",
  "Body": "Font(family: \"Pridi\", style: Regular, size: 14, weight: 400, lineHeight: 100, letterSpacing: 2.2)",
  "Space/s-md": "16",
  "Gray-300": "#cbd5e1",
  "Theme/Border": "#DEE2E6",
  "Table header": "Font(family: \"Pridi\", style: Medium, size: 13, weight: 500, lineHeight: 100, letterSpacing: 2.3)",
  "Gray/600": "#6C757D",
  "Table body": "Font(family: \"Pridi\", style: Regular, size: 13, weight: 400, lineHeight: 1, letterSpacing: 2.2)",
  "Form Label": "Font(family: \"Pridi\", style: Regular, size: 13, weight: 400, lineHeight: 100, letterSpacing: 2.5)",
  "Yellow/900": "#713f12",
  "Yellow/50": "#fefce8",
  "Yellow/400": "#facc15",
  "Icons/icon-black": "#000000",
  "Space/s-xsm": "8",
  "Slate/50": "#f8fafc",
  "Strokes/stroke-neutral-primary": "#cbd5e1",
  "Red/950": "#450a0a",
  "Components/Progress/Label": "Font(family: \"Pridi\", style: Regular, size: 12, weight: 400, lineHeight: 1.5, letterSpacing: 0)",
  "Red/100": "#fee2e2",
  "Red/400": "#f87171",
  "Texts/text-neutral-tertiary": "#909090"
}
```

---

## Organized by Category

### Color Tokens

| Token Name | Value | Usage |
|-----------|-------|-------|
| Primary | #003366 | Brand primary (dark navy) |
| Theme Colors/Primary | #0d6efd | Interactive elements (blue) |
| Theme/Danger | #DC3545 | Error/danger states |
| Theme/Body Background | #FFFFFF | Page background |
| Theme/Border | #DEE2E6 | Default border color |
| Texts/text-neutral-primary | #212121 | Primary text color |
| Color/neutral-text-primary | #212121 | Primary text color (alias) |
| Texts/text-neutral-tertiary | #909090 | Muted/tertiary text |
| Body Text/Body Color | #212529 | Body text default |
| Icons/icon-black | #000000 | Black icons |
| HitBox | #FFFFFF | Hit area (transparent/white) |

### Gray Scale

| Token Name | Value |
|-----------|-------|
| Gray/White | #FFFFFF |
| Gray/400 | #CED4DA |
| Gray/600 | #6C757D |
| Gray/800 | #343A40 |
| Gray-300 | #cbd5e1 |
| Slate/50 | #f8fafc |

### Semantic Colors

| Token Name | Value | Usage |
|-----------|-------|-------|
| Green/500 | #198754 | Success/confirm |
| Yellow/50 | #fefce8 | Warning background |
| Yellow/400 | #facc15 | Warning accent |
| Yellow/900 | #713f12 | Warning text |
| Red/100 | #fee2e2 | Error background |
| Red/400 | #f87171 | Error accent |
| Red/950 | #450a0a | Error dark text |

### Stroke/Separator

| Token Name | Value |
|-----------|-------|
| Separators/seprator-opaque | #cbd5e1 |
| Strokes/stroke-neutral-primary | #cbd5e1 |

### Spacing Tokens

| Token Name | Value |
|-----------|-------|
| Space/s-zero | 0px |
| Space/s-xxxxsm | 2px |
| Space/s-xxxsm | 4px |
| Space/s-xsm | 8px |
| Space/s-sm | 12px |
| Space/s-md | 16px |
| Space/s-lg | 24px |

### Font Size Tokens

| Token Name | Value |
|-----------|-------|
| Font Size/text-xs | 11px |
| Font Size/text-md-base | 13px |

### Border Radius

| Token Name | Value |
|-----------|-------|
| Rounded/r-sm | 12px |

### Typography Tokens

| Token Name | Family | Size | Weight | Line Height | Letter Spacing |
|-----------|--------|------|--------|-------------|---------------|
| Table header | Pridi | 13px | 500 (Medium) | 100% | 2.3px |
| Table body | Pridi | 13px | 400 (Regular) | 1.0 | 2.2px |
| Form Label | Pridi | 13px | 400 (Regular) | 100% | 2.5px |
| Form Label 2 | Pridi | 14px | 400 (Regular) | 100% | 2.5px |
| Body | Pridi | 14px | 400 (Regular) | 100% | 2.2px |
| Body/Small | Pridi | 14px | 400 (Regular) | 1.5 | 2.5px |
| Heading/H6 | Pridi | 16px | 500 (Medium) | 1.2 | 2.5px |
| Components/Progress/Label | Pridi | 12px | 400 (Regular) | 1.5 | 0px |

---

## CSS Variable Mapping

```css
:root {
  /* Colors */
  --color-primary: #003366;
  --color-theme-primary: #0d6efd;
  --color-danger: #DC3545;
  --color-success: #198754;
  --color-body-bg: #FFFFFF;
  --color-border: #DEE2E6;
  --color-text-primary: #212121;
  --color-text-body: #212529;
  --color-text-tertiary: #909090;
  --color-icon-black: #000000;

  /* Grays */
  --gray-white: #FFFFFF;
  --gray-300: #cbd5e1;
  --gray-400: #CED4DA;
  --gray-600: #6C757D;
  --gray-800: #343A40;
  --slate-50: #f8fafc;

  /* Semantic */
  --yellow-50: #fefce8;
  --yellow-400: #facc15;
  --yellow-900: #713f12;
  --red-100: #fee2e2;
  --red-400: #f87171;
  --red-950: #450a0a;

  /* Strokes */
  --stroke-separator: #cbd5e1;
  --stroke-neutral: #cbd5e1;

  /* Spacing */
  --space-zero: 0px;
  --space-xxxxsm: 2px;
  --space-xxxsm: 4px;
  --space-xsm: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;

  /* Font Sizes */
  --font-xs: 11px;
  --font-md-base: 13px;

  /* Border Radius */
  --rounded-sm: 12px;
}
```
