# Error Modal — Figma Spec

> Node: `1:10210` | File: `LeJRPqvfhVR3AnjdDqIZsn` (verify-ver-2 / CO9)
> Frame: "Verify / Verify - Unsort CC - Error Case - 5"
> Inner modal: `1:11076` ("Modal Alert")

## Dimensions

| Property | Value |
|----------|-------|
| Modal card | **560 × 360 px** |
| Background | `#FFFFFF` (White) |
| Border radius | ~12px |
| Box shadow | Subtle drop shadow |
| Overlay | Semi-transparent dark backdrop |

## Structure (3 sections)

### Section 1: Top Bar (`1:11077`) — 560 × 141 px

**Icon** (`1:11078`):
| Property | Value |
|----------|-------|
| Size | 48 × 48 px |
| Position | Centered, 32px from top |
| Type | Circle with exclamation "!" |
| Color | `#DC3545` (`Theme/Danger` — red) |
| Symbol | White "!" on red circle |

**Title** (`1:11079`):
| Property | Value |
|----------|-------|
| Text | "การแจ้งเตือน" |
| Font | Pridi, Medium (500) |
| Size | 20–24px (`Heading/H4` or `H5`) |
| Line height | 1.2 |
| Letter spacing | 2.5px |
| Color | `#212529` (`Body Text/Body Color`) |
| Position | Centered, 96px from top |

### Section 2: Body (`1:11080`) — 560 × 88 px

**Message** (`1:11081`):
| Property | Value |
|----------|-------|
| Text | "มีข้อผิดพลาดในการ Verify" |
| Font | Pridi, Regular (400) |
| Size | 16px (`Body/Regular`) |
| Line height | 1.5 |
| Letter spacing | 2.5px |
| Color | `#212529` |
| Padding | 32px left, 32px top |
| Alignment | Center |

### Section 3: Button Area (`1:11082`) — 560 × 70 px

**Border top**: Subtle separator line, likely `#cbd5e1` (`Slate/300`)

**Button** (`1:11083`):
| Property | Value |
|----------|-------|
| Text | "ตกลง" |
| Size | 160 × 38 px |
| Background | `#003366` (`Primary` — dark navy) |
| Text color | `#FFFFFF` |
| Font | Pridi, ~16px |
| Border radius | ~6px |
| Position | Centered, 16px from section top |

## Spacing Summary

| Spacing | Value |
|---------|-------|
| Icon top padding | 32px |
| Icon → title gap | 16px |
| Body text padding | 32px left, 32px top |
| Button area padding | 16px top, 16px bottom |
| Base spacing unit | 16px (`Space/s-md`) |

## Design Variables

| Variable | Value |
|----------|-------|
| `Body Text/Body Color` | `#212529` |
| `Theme/Danger` | `#DC3545` |
| `Gray/White` | `#FFFFFF` |
| `Slate/300` | `#cbd5e1` |
| `Primary` | `#003366` |
| `Heading/H4` | Pridi Medium 24px, weight 500, line-height 1.2, letter-spacing 2.5 |
| `Heading/H5` | Pridi Medium 20px, weight 500, line-height 1.2, letter-spacing 2.5 |
| `Body/Regular` | Pridi Regular 16px, weight 400, line-height 1.5, letter-spacing 2.5 |
| `Space/s-md` | 16px |

## Key Differences from Current Implementation

| Aspect | Current Code | Figma Spec |
|--------|-------------|------------|
| Icon | `.bi-exclamation-diamond-fill` (Bootstrap) | Circle with "!" in `#DC3545` red |
| Title | "การแจ้งเตือน" | "การแจ้งเตือน" (same) |
| Message | "เกิดข้อผิดพลาด" | "มีข้อผิดพลาดในการ Verify" |
| Button color | `.btn-blue` (shared) | `#003366` (navy primary) |
| Button | Uses `.btn.btn-blue` | Custom 160×38px, 6px radius |
| Modal layout | Bootstrap default `.modal-content` | Custom 560×360 3-section layout |
| Button text | "ตกลง" | "ตกลง" (same) |

## Behavior

- Shown after API returns error
- Click "ตกลง" → close error modal → **stay on page** (user can retry)
- Unlike success modal which redirects to p01
