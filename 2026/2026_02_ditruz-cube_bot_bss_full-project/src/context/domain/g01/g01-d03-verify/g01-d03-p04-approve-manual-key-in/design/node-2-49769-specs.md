# Figma Node 2-49769 — Page Header Specs
## Page: Approve Manual Key-in

---

## Screenshot
> Visual: Dark blue gradient header bar with title on left, date/user info in center-right, filter button on far right.

---

## Colors

| Element              | CSS Value         | Description                        |
|----------------------|-------------------|------------------------------------|
| Header background    | `#003366`         | Deep navy blue (Primary variable)  |
| Header background 2  | (gradient/dark)   | Darker blue toward right           |
| Title text           | `#FFFFFF`         | White (Gray/White variable)        |
| Label text           | `#FFFFFF`         | White (Date:, ธปท:, labels)        |
| Value text           | `#FFFFFF`         | White (date value, user name)      |
| Separator            | `#cbd5e1`         | Light slate (Separators/seprator-opaque) |
| Body text color      | `#212529`         | Dark (Body Text/Body Color — general) |
| Filter button bg     | `#0d6efd`         | Bootstrap primary blue             |
| Filter button text   | `#FFFFFF`         | White                              |

---

## Typography

| Element         | Font Family | Size | Weight | Letter-spacing | Line-height |
|-----------------|-------------|------|--------|---------------|-------------|
| Page Title      | `Pridi`     | 18px | 700    | 2.5px         | 1.5         |
| Label (Date:, ธปท:) | `Pridi` | 14px | 400    | 2.5px         | 1.5         |
| Value (date, user)  | `Pridi` | 14px | 400    | 2.5px         | 1.5         |
| Filter button   | `Pridi`     | 14px | 400    | 2.5px         | 1.5         |

> Base body font: `font-family: "Pridi"`, `font-size: 16px`, `font-weight: 400`, `letter-spacing: 2.5px`, `line-height: 1.5`

---

## Layout

| Property         | Value         | Notes                                |
|------------------|---------------|--------------------------------------|
| Header height    | ~44px         | Estimated from screenshot            |
| Padding X        | ~16px–24px    | Left/right padding                   |
| Padding Y        | ~8px–12px     | Top/bottom padding                   |
| Gap (items)      | ~16px         | Between info groups                  |
| Border-radius    | `12px` (r-sm) | Applied to rounded elements          |
| Layout direction | `row`         | Flexbox horizontal                   |
| Align items      | `center`      | Vertical center                      |
| Justify content  | `space-between` | Title left, info right              |

---

## Filter Button

| Property         | Value           |
|------------------|-----------------|
| Background color | `#0d6efd`       |
| Text color       | `#FFFFFF`        |
| Border-radius    | `12px` (r-sm)   |
| Icon             | Filter icon (funnel/sliders, e.g. `bi bi-funnel` or similar) |
| Icon + label     | "Filter" text with icon prefix                               |
| Padding          | ~8px 16px       |
| Font size        | 14px            |
| Font weight      | 400             |

---

## CSS-Ready Variables

```css
/* Page Header — Node 2-49769 */
:root {
  /* Colors */
  --header-bg: #003366;
  --header-text: #FFFFFF;
  --header-label-color: #FFFFFF;
  --header-value-color: #FFFFFF;
  --filter-btn-bg: #0d6efd;
  --filter-btn-text: #FFFFFF;
  --separator-color: #cbd5e1;
  --primary-color: #003366;
  --primary-bootstrap: #0d6efd;

  /* Typography */
  --font-family: "Pridi", sans-serif;
  --font-size-base: 16px;
  --font-size-header-title: 18px;
  --font-size-label: 14px;
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  --letter-spacing: 2.5px;
  --line-height: 1.5;

  /* Layout */
  --header-height: 44px;
  --header-padding-x: 20px;
  --header-padding-y: 10px;
  --header-gap: 16px;
  --border-radius-sm: 12px;
}
```

---

## CSS Implementation

```css
.page-header {
  background-color: var(--header-bg, #003366);
  color: var(--header-text, #FFFFFF);
  height: var(--header-height, 44px);
  padding: var(--header-padding-y, 10px) var(--header-padding-x, 20px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--header-gap, 16px);
  font-family: "Pridi", sans-serif;
  letter-spacing: 2.5px;
  line-height: 1.5;
}

.page-header__title {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.page-header__info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #FFFFFF;
}

.page-header__label {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.page-header__value {
  font-weight: 400;
  color: #FFFFFF;
}

.btn-filter {
  background-color: #0d6efd;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-family: "Pridi", sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
```

---

## Variable Defs (Raw from Figma)

```json
{
  "Gray/White": "#FFFFFF",
  "Body/Regular": "Font(family: \"Pridi\", style: Regular, size: 16, weight: 400, lineHeight: 1.5, letterSpacing: 2.5)",
  "Rounded/r-sm": "12",
  "Separators/seprator-opaque": "#cbd5e1",
  "Body Text/Body Color": "#212529",
  "HitBox": "#FFFFFF",
  "Theme Colors/Primary": "#0d6efd",
  "Primary": "#003366"
}
```

---

*Extracted: 2026-02-20 | Node: 2-49769 | Page: Approve Manual Key-in*
