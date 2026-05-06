# Figma Spec: Select Component (Node 2:47563)

## Component Overview
A **select/dropdown** component following Bootstrap 5.3 select pattern. Displays a value ("17") with a chevron-down icon on the right side. Used for collecting user-provided information from a list of options.

Reference: https://getbootstrap.com/docs/5.3/forms/select/

---

## Layout

- **Element type**: `<button>` (or `<select>` in Bootstrap context)
- **Display**: Flex column, items centered, justify center
- **Width**: Fills container (100%)
- **Border-radius**: 8px
- **Padding**: 9px top/bottom, 17px left, 13px right

### Inner Structure
- **wrapper**: Full-width container
  - **Inner flex row**: `gap: 8px`, items center
    - **selection-item**: Flex 1 (takes remaining space), overflow clipped
      - **placeholder**: Contains the text value
    - **icon-down**: Chevron-down icon, 16px height

---

## Typography

| Property        | Value            |
|-----------------|------------------|
| Font Family     | `Pridi`          |
| Font Style      | Light            |
| Font Size       | `20px`           |
| Font Weight     | `300`            |
| Line Height     | `1.5` (30px)     |
| Letter Spacing  | `0.5px`          |
| Color           | `#6C757D` (Gray/600) |
| Text Align      | Left             |

**Design token name**: `Body/Lead`

---

## Colors

| Element         | Property        | Value                        |
|-----------------|-----------------|------------------------------|
| Background      | background      | `#FFFFFF` (White)            |
| Border          | border-color    | `#CED4DA` (Gray/400)        |
| Text            | color           | `#6C757D` (Gray/600)        |
| Icon (chevron)  | color           | `#343A40` (Gray/800)        |

---

## Spacing

| Property        | Value            |
|-----------------|------------------|
| Padding Top     | `9px`            |
| Padding Bottom  | `9px`            |
| Padding Left    | `17px`           |
| Padding Right   | `13px`           |
| Inner Gap       | `8px` (between text and icon) |

---

## Border

| Property        | Value            |
|-----------------|------------------|
| Border Width    | `1px`            |
| Border Style    | `solid`          |
| Border Color    | `#CED4DA`        |
| Border Radius   | `8px`            |

---

## Icon (Chevron Down)

- SVG chevron-down arrow
- Size: 16px height
- Rotated -90deg from a right-pointing chevron
- Asset URL: `http://localhost:3845/assets/9b46f694587bc0ce3a4bf4af6b8d3588f93a95fa.svg`

---

## Design Tokens Referenced

- `Gray/600`: `#6C757D`
- `Gray/800`: `#343A40`
- `Gray/400`: `#CED4DA`
- `Theme/Body Background`: `#FFFFFF`
- `HitBox`: `#FFFFFF`
- `Body/Lead`: Pridi Light 20px/1.5, letter-spacing 0.5px
