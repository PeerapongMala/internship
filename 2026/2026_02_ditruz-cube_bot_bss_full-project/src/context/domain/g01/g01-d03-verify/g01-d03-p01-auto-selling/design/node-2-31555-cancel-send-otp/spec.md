# Layout Spec - Cancel Send Popup OTP - 3

**Node ID:** 2:31555
**Date:** 2026-02-19
**Source:** Figma MCP `get_design_context` + `get_screenshot`

## Important Note

Despite the name "Cancel Send Popup OTP - 3", this design does **NOT** contain OTP input fields, a timer, or a resend button. This appears to be **Step 3** of a cancel-send flow -- the **Manager Approval Confirmation** step (post-OTP). The actual OTP entry likely occurs in a separate node (step 1 or 2).

## Modal Container

| Property | Value |
|----------|-------|
| Width | 560px |
| Height | 500px |
| Min Height | 360px |
| Background | #FFFFFF (white) |
| Border | 1px solid #EEEEEE |
| Border Radius | 12px |
| Overflow | clip |
| Layout | Flex column |
| Gap | 33px |

## Overlay / Backdrop

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 900px |
| Background | rgba(12, 12, 12, 0.38) |
| Positioning | Centered absolute |

## Top Bar (Title)

| Property | Value |
|----------|-------|
| Height | 59px |
| Padding | 16px top, 8px bottom, 16px left/right |
| Border Bottom | 1px solid var(--slate/300, #cbd5e1) |
| Background | white |
| Title Text | "Cancel Send" |
| Title Font | Pridi Medium, 24px, weight 500 |
| Title Line Height | 1.2 |
| Title Color | black |
| Title Letter Spacing | 0.6px |

## Content Area

| Property | Value |
|----------|-------|
| Height | 306px |
| Padding | 24px all sides |
| Layout | Flex column |
| Gap | 16px |

### Info Rows Section

| Property | Value |
|----------|-------|
| Padding | 8px all sides |
| Gap | 8px between rows |
| Layout | Flex column |

Each row is a flex row with `justify-between`:

1. **Header Card row**
   - Left: "Header Card" -- Pridi Regular, 16px, black
   - Right: "0054941525" -- Pridi Regular, 16px, black

2. **ชนิดราคา row**
   - Left: "ชนิดราคา" -- Pridi Regular, 16px, black
   - Right: MoneyType badge (47px x 24px, bg #fbf8f4, border 2px solid #9f7d57, text "1000" in #4f3e2b)

3. **จำนวน (ฉบับ) row**
   - Left: "จำนวน (ฉบับ)" -- Pridi Regular, 16px, black
   - Right: "997" -- Pridi Regular, 16px, black

### Confirmation Section

| Property | Value |
|----------|-------|
| Padding | 8px all sides |
| Gap | 16px |
| Max Width | 540px |

- **Sub-heading**: "ยืนยัน Cancel Send" -- Pridi Medium, 24px, weight 500, black
- **Manager Select Label**: "เลือก Manager" -- Pridi Regular, 14px, color #212121
- **Label-to-select gap**: 4px (Space/s-xxxsm)

### Manager Dropdown Select

| Property | Value |
|----------|-------|
| Width | 291px (parent) / full width |
| Background | white |
| Border | 1px solid #ced4da |
| Border Radius | 6px |
| Padding | 7px vertical, 13px horizontal |
| Placeholder/Value text | Pridi Regular, 16px, #6c757d |
| Icon | Chevron down SVG |

## Footer Bar

| Property | Value |
|----------|-------|
| Border Top | 1px solid var(--slate/300, #cbd5e1) |
| Padding | 16px (Space/s-md) all sides |
| Background | white |
| Layout | Flex row, justify-between, align-end |

### Cancel Button (Left)

| Property | Value |
|----------|-------|
| Width | 160px |
| Min Width | 160px |
| Background | var(--secondary, #6c757d) |
| Border | 1px solid var(--secondary, #6c757d) |
| Border Radius | 6px |
| Padding | 7px 13px |
| Text | "ยกเลิก" |
| Text Style | Pridi Regular, 16px, white |
| Letter Spacing | 0.4px |

### Confirm Button (Right)

| Property | Value |
|----------|-------|
| Min Width | 160px |
| Background | #003366 (Primary) |
| Border | 1px solid #003366 |
| Border Radius | 6px |
| Padding | 7px 13px |
| Text | "ส่งคำขออนุมัติแก้ไข" |
| Text Style | Pridi Regular, 16px, white |
| Letter Spacing | 0.4px |

## Figma Node IDs Reference

| Element | Node ID |
|---------|---------|
| Root | 2:31555 |
| Overlay template | 2:31556 |
| Modal Dialog | 2:31557 |
| Top Bar | 2:31558 |
| Title text | 2:31559 |
| Content frame | 2:31560 |
| Info rows container | 2:31561 |
| Header Card row | 2:31562 |
| ชนิดราคา row | 2:31565 |
| จำนวน row | 2:31568 |
| Confirm section | 2:31571 |
| Sub-heading text | 2:31572 |
| Manager select frame | 2:31573 |
| Select label | 2:31575 |
| Select dropdown | 2:31577 |
| Footer | 2:31578 |
| Cancel button | 2:31579 |
| Confirm button | 2:31580 |
