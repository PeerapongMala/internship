# Success Modal — Figma Spec

> Node: `1:10201` | File: `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9)
> Inner modal: `1:10202` ("Modal Alert")

## Dimensions

| Property | Value |
|----------|-------|
| Modal card | **560 × 360 px** |
| Background | `#FFFFFF` (`Gray/White`) |
| Border radius | ~12px |
| Box shadow | Subtle drop shadow |

## Structure (3 sections)

### Section 1: Top Bar (`1:10203`) — 560 × 141 px

**Icon** (`1:10204`):
| Property | Value |
|----------|-------|
| Size | 48 × 48 px |
| Position | Centered, 32px from top |
| Type | Circle with checkmark |
| Color | `#198754` (`Theme/Success` — dark green) |
| Checkmark | White |

**Title** (`1:10205`):
| Property | Value |
|----------|-------|
| Text | "สำเร็จ" |
| Font | Pridi, Medium (500) |
| Size | 24px (`Heading/H4`) |
| Line height | 1.2 |
| Letter spacing | 2.5px |
| Color | `#212529` (`Body Text/Body Color`) |
| Position | Centered, 96px from top (16px gap below icon) |

### Section 2: Body (`1:10206`) — 560 × 143 px

**Message** (`1:10207`):
| Property | Value |
|----------|-------|
| Text | "บันทึกข้อมูลสำเร็จ" |
| Font | Pridi, Regular (400) |
| Size | 16px (`Body/Regular`) |
| Line height | 1.5 |
| Letter spacing | 2.5px |
| Color | `#212529` |
| Position | Centered, 24px from section top |

### Section 3: Button Area (`1:10208`) — 560 × 70 px

**Border top**: 1px solid `#cbd5e1` (`Slate/300`)

**Button** (`1:10209`):
| Property | Value |
|----------|-------|
| Text | "ตกลง" |
| Size | 160 × 38 px |
| Background | `#198754` (`Theme/Success` — green) |
| Text color | `#FFFFFF` |
| Font | Pridi, ~16px |
| Border radius | ~6px |
| Position | Centered, 16px from section top |

## Spacing Summary

| Spacing | Value |
|---------|-------|
| Icon top padding | 32px |
| Icon → title gap | 16px |
| Body text top padding | 24px |
| Button area top border | 1px solid `#cbd5e1` |
| Button area padding | 16px top, 16px bottom |
| Base spacing unit | 16px (`Space/s-md`) |

## Design Variables

| Variable | Value |
|----------|-------|
| `Body Text/Body Color` | `#212529` |
| `Theme/Success` | `#198754` |
| `Gray/White` | `#FFFFFF` |
| `Slate/300` | `#cbd5e1` |
| `Heading/H4` | Pridi Medium 24px, weight 500, line-height 1.2, letter-spacing 2.5 |
| `Body/Regular` | Pridi Regular 16px, weight 400, line-height 1.5, letter-spacing 2.5 |
| `Space/s-md` | 16px |

## Key Differences from Current Implementation

| Aspect | Current Code | Figma Spec |
|--------|-------------|------------|
| Icon color | Uses Bootstrap `.bi-check-circle-fill` (green) | `#198754` (specific green) |
| Title | "สำเร็จ!" (with !) | "สำเร็จ" (no !) |
| Message | "Verify สำเร็จแล้ว" | "บันทึกข้อมูลสำเร็จ" |
| Button color | `.btn-green` (shared) | `#198754` (green, same as icon) |
| Button | Uses `.btn.btn-green` | Custom 160×38px, 6px radius |
| Modal layout | Bootstrap default `.modal-content` | Custom 560×360 3-section layout |
| Border top on footer | None | 1px solid `#cbd5e1` |
