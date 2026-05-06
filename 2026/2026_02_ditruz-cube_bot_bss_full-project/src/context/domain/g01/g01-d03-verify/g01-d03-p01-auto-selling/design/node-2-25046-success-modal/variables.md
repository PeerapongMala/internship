# Variable Definitions — Raw Output (Node 2:25046)

**Figma Node:** `2:25046` — "บันทึกข้อมูลสำเร็จ"
**Date Extracted:** 2026-02-19

---

## Raw JSON

```json
{
  "Body Text/Body Color": "#212529",
  "Theme/Success": "#198754",
  "HitBox": "#FFFFFF",
  "Heading/H4": "Font(family: \"Pridi\", style: Medium, size: 24, weight: 500, lineHeight: 1.2000000476837158, letterSpacing: 2.5)",
  "Slate/300": "#cbd5e1",
  "Heading/H5": "Font(family: \"Pridi\", style: Medium, size: 20, weight: 500, lineHeight: 1.2000000476837158, letterSpacing: 2.5)",
  "Gray/White": "#FFFFFF",
  "Body/Regular": "Font(family: \"Pridi\", style: Regular, size: 16, weight: 400, lineHeight: 1.5, letterSpacing: 2.5)",
  "Space/s-md": "16"
}
```

---

## Color Variables

| Variable Name | Value | Usage |
|---------------|-------|-------|
| `Body Text/Body Color` | `#212529` | Default body text color |
| `Theme/Success` | `#198754` | Success accent — icon, button background, button border |
| `HitBox` | `#FFFFFF` | Transparent hit area (white) |
| `Slate/300` | `#cbd5e1` | Footer top border separator |
| `Gray/White` | `#FFFFFF` | White background |

---

## Typography Variables

| Variable Name | Family | Style | Size | Weight | Line Height | Letter Spacing |
|---------------|--------|-------|------|--------|-------------|----------------|
| `Heading/H4` | Pridi | Medium | 24px | 500 | 1.2 | 2.5% |
| `Heading/H5` | Pridi | Medium | 20px | 500 | 1.2 | 2.5% |
| `Body/Regular` | Pridi | Regular | 16px | 400 | 1.5 | 2.5% |

**Note on letterSpacing:** Figma reports `2.5` which in Figma means `2.5%` of font size. In CSS this translates to:
- H4 (24px): `24 * 0.025 = 0.6px` -> `letter-spacing: 0.6px`
- H5 (20px): `20 * 0.025 = 0.5px` -> `letter-spacing: 0.5px`
- Body/Regular (16px): `16 * 0.025 = 0.4px` -> `letter-spacing: 0.4px`

---

## Spacing Variables

| Variable Name | Value | Usage |
|---------------|-------|-------|
| `Space/s-md` | `16px` | Footer padding (all sides) |

---

## CSS Custom Properties Mapping

```css
:root {
  --body-text-color: #212529;
  --theme-success: #198754;
  --slate-300: #cbd5e1;
  --gray-white: #FFFFFF;
  --space-s-md: 16px;
}
```
