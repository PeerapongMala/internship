# OTP Confirm Modal — Figma Spec

> Node: `1:11085` | File: `r8wLwGvG3I4vYU6SLQ1jec` (Figma_BSS-Verify)
> Frame: "Verify / Verify - Unsort CC - 02 - Popup ยืนยัน Verify"
> Inner modal: `1:11086` ("Modal Alert")

## Dimensions

| Property | Value |
|----------|-------|
| Modal card | **560 × 360 px** |
| Background | `#FFFFFF` (`Gray/White`) |
| Border radius | ~12px |
| Box shadow | Subtle drop shadow |

## Structure (3 sections)

### Section 1: Top Bar (`1:11087`) — 560 × 141 px

**Icon** (`1:11088`):
| Property | Value |
|----------|-------|
| Size | 48 × 48 px |
| Position | Centered, 32px from top |
| Type | Circled "i" info icon |
| Color | `#3D8BFD` (`Blue/400`) with white "i" |

**Title** (`1:11089`):
| Property | Value |
|----------|-------|
| Text | "Verify" |
| Font | Pridi, Medium (500) |
| Size | 24px (`Heading/H4`) |
| Line height | 1.2 |
| Letter spacing | 2.5px |
| Color | `#212529` (`Body Text/Body Color`) |
| Position | Centered, 96px from top (16px gap below icon) |

### Section 2: Body (`1:11090`) — 560 × 72 px

**Message** (`1:11091`):
| Property | Value |
|----------|-------|
| Text | "คุณแน่ใจหรือไม่ที่ต้องการ Verify ข้อมูลนี้" |
| Font | Pridi, Regular (400) |
| Size | 16px (`Body/Regular`) |
| Line height | 1.5 |
| Letter spacing | 2.5px |
| Color | `#212529` |
| Position | Centered, 24px padding from section top |

### Section 3: Button Row (`1:11092`) — 560 × 70 px

| | Cancel Button (`1:11093`) | Confirm Button (`1:11094`) |
|---|---|---|
| Text | "ยกเลิก" | "ยืนยัน" |
| Size | 160 × 38 px | 158 × 38 px |
| Background | `#6c757d` (`Secondary`) | `#003366` (`Primary`) |
| Text color | `#FFFFFF` | `#FFFFFF` |
| Border radius | ~6px | ~6px |
| Gap between | 24px |
| Position | Centered, 16px from section top |

## Spacing Summary

| Spacing | Value |
|---------|-------|
| Icon top padding | 32px |
| Icon → title gap | 16px |
| Top bar → body gap | section stacked (37px visual gap) |
| Body text top padding | 24px |
| Body → button gap | section stacked (37px visual gap) |
| Button area padding | 16px top, 16px bottom |
| Button gap | 24px |
| Base spacing unit | 16px (`Space/s-md`) |

## Design Variables

| Variable | Value |
|----------|-------|
| `Body Text/Body Color` | `#212529` |
| `Blue/400` | `#3D8BFD` |
| `Gray/White` | `#FFFFFF` |
| `Slate/300` | `#cbd5e1` |
| `Theme Colors/Secondary` | `#6c757d` |
| `Primary` | `#003366` |
| `Heading/H4` | Pridi Medium 24px, weight 500, line-height 1.2, letter-spacing 2.5 |
| `Body/Regular` | Pridi Regular 16px, weight 400, line-height 1.5, letter-spacing 2.5 |
| `Space/s-md` | 16px |

## Notes

- No close (X) button — dismissal only via Cancel button
- This is a confirmation prompt, not an OTP input form
- The "02" in frame name indicates step 2 in the verify flow
- Arrow vector in Figma suggests flow continues after confirm
