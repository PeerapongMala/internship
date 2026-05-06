# Design Tokens — Verify Confirmation

> Shared tokens inherited from p01 Auto Selling (same Figma file `r8wLwGvG3I4vYU6SLQ1jec`).
> Page-specific values verified from SVG export (`Verify - Unsort CC - 4.svg`).

## Colors

### Brand & Theme
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #003366 | Brand primary (dark navy) — buttons, nav |
| Theme Colors/Primary | #0d6efd | Interactive elements (blue) |
| Theme/Danger | #DC2626 | Error/danger — red summary values (SVG verified) |
| Theme/Body Background | #FFFFFF | Page background |
| Theme/Border | #DEE2E6 | Default border color |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| Texts/text-neutral-primary | #212121 | Primary text, page title, labels |
| Color/neutral-text-primary | #212121 | Alias for primary text |
| Body Text/Body Color | #212529 | Body text default |
| Texts/text-neutral-tertiary | #909090 | Muted/placeholder text |

### Gray Scale
| Token | Value | Usage |
|-------|-------|-------|
| Gray/White | #FFFFFF | Card backgrounds |
| Gray/400 | #CED4DA | Input borders |
| Gray/600 | #6C757D | Back button bg, disabled text |
| Gray/800 | #343A40 | Dark text |
| Gray-300 | #cbd5e1 | Card borders, separators |
| Table header bg | #D6E0E0 | Table header background (SVG verified) |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| Green/500 | #198754 | Success states |
| Red/100 | #fee2e2 | Error background |
| Red/400 | #f87171 | Error accent |
| Red/950 | #450a0a | Error dark text |

### Page-Specific Colors
| Token | Value | Usage |
|-------|-------|-------|
| Info card date bg | #f8d7da | Date row alert background |
| Info card row border | #CBD5E1 | Row separator (SVG verified) |
| Table header bg | #D6E0E0 | Column header background (SVG verified) |
| Table header text | #4a5568 | Column header text |
| Sort icon | #94a3b8 | Sort arrow color |
| Even row bg | #F2F6F6 | Alternating row stripe (SVG verified) |
| Hover row bg | #f1f5f9 | Row hover state |
| Summary unit text | #4a5568 | "ฉบับ" suffix |
| Back button hover | #5a6268 | Gray button hover |
| Verify button hover | #002244 | Navy button hover |
| Print button hover | #002244 | Print button hover |

### Strokes & Separators
| Token | Value | Usage |
|-------|-------|-------|
| Separators/seprator-opaque | #cbd5e1 | Card borders |
| Strokes/stroke-neutral-primary | #cbd5e1 | Card borders (alias) |

### Denomination Badge
| Token | Value | Usage |
|-------|-------|-------|
| Badge border | #c4a35a (est.) | Gold/brown border |
| Badge text | matching border | Badge text color |
| Badge bg | #FBF8F4 | Badge background (SVG verified) |

## Typography

### Font Tokens (shared with p01)
| Token | Family | Size | Weight | Line Height | Letter Spacing |
|-------|--------|------|--------|-------------|---------------|
| Table header | Pridi | 13px | 500 (Medium) | 100% | 2.3px |
| Table body | Pridi | 13px | 400 (Regular) | 1.0 | 2.2px |
| Form Label | Pridi | 13px | 400 (Regular) | 100% | 2.5px |
| Form Label 2 | Pridi | 14px | 400 (Regular) | 100% | 2.5px |
| Body | Pridi | 14px | 400 (Regular) | 100% | 2.2px |
| Body/Small | Pridi | 14px | 400 (Regular) | 1.5 | 2.5px |
| Heading/H6 | Pridi | 16px | 500 (Medium) | 1.2 | 2.5px |

### Page-Specific Typography
| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Page title | 30px | 600 (SemiBold) | "Verify {BnTypeName}" |
| Info card labels | 16px | 500 | "Date:", "Supervisor:", etc. |
| Info card values | 16px | 400 | Date/name values |
| Table headers (th) | 13px | 600 | Column headers with sort |
| Table data (td) | 14px | 400 | Cell values |
| Table qty cells | 14px | 500 | Right-aligned count values |
| Summary labels | 16px | 400 | Line descriptions |
| Summary values | 16px | 700 | Bold numbers |
| Summary total value | 18px | 700 | Grand total larger |
| Footer buttons | 18px | 500 | Button text |
| Print button | 14px | 500 | Smaller button |

## Spacing

### Spacing Tokens (shared with p01)
| Token | Value |
|-------|-------|
| Space/s-zero | 0px |
| Space/s-xxxxsm | 2px |
| Space/s-xxxsm | 4px |
| Space/s-xsm | 8px |
| Space/s-sm | 12px |
| Space/s-md | 16px |
| Space/s-lg | 24px |

### Page-Specific Spacing
| Element | Value | Notes |
|---------|-------|-------|
| Wrapper max-width | 640px | Centered content area (SVG: x=400 to x=1040) |
| Wrapper padding | 16px 0 24px | Top / sides / bottom |
| Card gap | 8px | Between stacked cards (SVG verified: ~7-8px) |
| Card border-radius | 12px | Rounded/r-sm |
| Card padding | 16px–24px | Varies by card type |
| Info card padding | 16px 0 | Card vertical padding (Figma verified) |
| Info row padding | 4px 20px | Row padding, 24px row height (SVG verified) |
| Table header padding | 4.5px 8px | th padding, 30px header height (Figma verified) |
| Table cell padding | 7.5px 8px | td padding, 34px row height (Figma verified) |
| Detail title padding | 8px 8px | Title area, 35px height (Figma verified) |
| Summary card padding | 16px 12px | Card padding (Figma verified) |
| Summary row height | 25px | Row height (Figma verified) |
| Summary row gap | 4px | Between summary lines (Figma verified) |
| Summary total height | 33px | Total row height (Figma verified) |
| Footer button width | 289px | Each button (SVG verified) |
| Footer button height | 47px | Each button (SVG verified) |
| Footer button gap | 61px | Between buttons (SVG verified) |
| Print button padding | 8px 20px | Smaller button |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| Rounded/r-sm | 12px | Cards |
| Button radius | 7.5px | Footer buttons (SVG verified: rx=7.5) |
| Print button radius | 6px | Print Data button |

### Font Size Tokens
| Token | Value |
|-------|-------|
| Font Size/text-xs | 11px |
| Font Size/text-md-base | 13px |

## Components

### Denomination Badge
- Reuses `.qty-badge` from `all.css`
- Size: 47 x 24px
- Gold/brown border (#c4a35a estimated)
- Matching text color
- Bordered box, minimal radius

### Alert Icon
- Red circle icon next to Date value
- ~16px size
- Indicates alert/warning state (date highlight)

## CSS Variable Mapping

```css
:root {
  /* Brand */
  --color-primary: #003366;
  --color-theme-primary: #0d6efd;
  --color-danger: #DC2626;
  --color-success: #198754;
  --color-body-bg: #FFFFFF;
  --color-border: #DEE2E6;

  /* Text */
  --color-text-primary: #212121;
  --color-text-body: #212529;
  --color-text-tertiary: #909090;

  /* Grays */
  --gray-white: #FFFFFF;
  --gray-300: #cbd5e1;
  --gray-400: #CED4DA;
  --gray-600: #6C757D;
  --gray-800: #343A40;
  --vc-table-header-bg: #D6E0E0;

  /* Semantic */
  --red-100: #fee2e2;
  --red-400: #f87171;
  --red-950: #450a0a;

  /* Strokes */
  --stroke-separator: #cbd5e1;

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

  /* Page-specific (Verify Confirmation) */
  --vc-info-date-bg: #f8d7da;
  --vc-info-row-border: #CBD5E1;
  --vc-table-header-text: #4a5568;
  --vc-table-sort-icon: #94a3b8;
  --vc-table-even-row: #F2F6F6;
  --vc-table-hover-row: #f1f5f9;
  --vc-summary-unit: #4a5568;
  --vc-btn-back: #6c757d;
  --vc-btn-back-hover: #5a6268;
  --vc-btn-verify: #003366;
  --vc-btn-verify-hover: #002244;
}
```
