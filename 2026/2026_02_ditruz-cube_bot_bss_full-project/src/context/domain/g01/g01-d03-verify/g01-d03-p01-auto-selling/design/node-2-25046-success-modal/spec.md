# Success Modal Spec (Node 2:25046)

**Figma Node:** `2:25046` — "บันทึกข้อมูลสำเร็จ" (Save Data Successful)
**Date Extracted:** 2026-02-19

---

## Modal Overlay

| Property | Value |
|----------|-------|
| Background | `rgba(12, 12, 12, 0.38)` |
| Covers | Full viewport |

## Modal Container (Node 2:25047 — "Modal Alert")

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border | `1px solid #EEEEEE` |
| Border Radius | `12px` |
| Min Width | `560px` |
| Max Width | `960px` |
| Min Height | `360px` |
| Max Height | `760px` |
| Overflow | Clip |
| Position | Centered (50%, 50%) with translate(-50%, -50%) |
| Layout | Flex column |

## Top Bar Section (Node 2:25048)

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Padding | `32px 16px 16px 16px` (top/right/bottom/left) |
| Gap | `16px` |
| Alignment | Center (both axes) |
| Layout | Flex column |

### Success Icon (Node 2:25049)

| Property | Value |
|----------|-------|
| Type | SVG icon — green circle with white checkmark |
| Size | `48px x 48px` |
| Color | Green (`#198754` — Theme/Success) with white checkmark |
| Source | `http://localhost:3845/assets/e2fa57036822e1301a933f53a2a76a82d3cf874a.svg` |

### Title Text "สำเร็จ" (Node 2:25050)

| Property | Value |
|----------|-------|
| Font Family | Pridi (use `'bss-pridi'` in CSS) |
| Font Weight | 500 (Medium) — Heading/H4 style |
| Font Size | `24px` |
| Line Height | `1.2` |
| Letter Spacing | `0.6px` |
| Color | `#000000` (black) |
| Alignment | Center |

## Content Section (Node 2:25051)

| Property | Value |
|----------|-------|
| Height | `143px` |
| Padding | `24px 32px` |
| Layout | Flex column, items center |

### Message Text "แก้ไขข้อมูลสำเร็จ" (Node 2:25052)

| Property | Value |
|----------|-------|
| Font Family | Pridi (use `'bss-pridi'` in CSS) |
| Font Weight | 500 (Medium) — Heading/H5 style |
| Font Size | `20px` |
| Line Height | `1.2` |
| Letter Spacing | `0.5px` |
| Color | `#000000` (black) |
| Alignment | Center |

## Footer / Button Section (Node 2:25053)

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border Top | `1px solid #cbd5e1` (Slate/300) |
| Padding | `16px` (Space/s-md) |
| Layout | Flex, items center, justify center |

### OK Button "ตกลง" (Node 2:25054)

| Property | Value |
|----------|-------|
| Background | `#198754` (Theme/Success) |
| Border | `1px solid #198754` |
| Border Radius | `6px` |
| Min Width | `160px` |
| Width | `160px` |
| Padding | `7px 13px` |
| Gap | `8px` |
| Layout | Flex, items center, justify center |
| Overflow | Clip |

#### Button Text "ตกลง"

| Property | Value |
|----------|-------|
| Font Family | Pridi (use `'bss-pridi'` in CSS) |
| Font Weight | 400 (Regular) — Body/Regular style |
| Font Size | `16px` |
| Line Height | `1.5` |
| Letter Spacing | `0.4px` |
| Color | `#FFFFFF` (white) |

---

## Design Tokens Used

| Token | Value |
|-------|-------|
| `Body Text/Body Color` | `#212529` |
| `Theme/Success` | `#198754` |
| `Gray/White` | `#FFFFFF` |
| `Slate/300` | `#cbd5e1` |
| `Space/s-md` | `16px` |
| `Heading/H4` | Pridi Medium 24px, line-height 1.2 |
| `Heading/H5` | Pridi Medium 20px, line-height 1.2 |
| `Body/Regular` | Pridi Regular 16px, line-height 1.5 |

## Animation

No animation data found in the Figma node. Consider using SweetAlert2 built-in animations or a CSS fade-in for the overlay + scale-up for the modal card.

## Component References

- **icon-wrapper** (Node 1:22): Multi-size icon wrapper
- **button** (Node 1:385): Bootstrap 5.3-based button component — [Bootstrap Buttons Docs](https://getbootstrap.com/docs/5.3/components/buttons/)
