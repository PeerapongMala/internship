# Plan: Verify Confirmation Modals

> Date: 2026-02-23
> Status: **PLAN — to be re-implemented**
> Previous implementation had wrong modal layout (used p01 patterns, not matching Figma)

## Overview

เมื่อกด "Verify" button บนหน้า VerifyConfirmation จะแสดง modal flow:

```
[Verify button click]
       │
       ▼
┌─────────────────────┐
│  OTP Confirm Modal   │  560×360px
│  Figma: r8wL... / 1:11085
│                     │
│  ℹ (blue #3D8BFD)  │
│  "Verify"           │
│  "คุณแน่ใจหรือไม่    │
│   ที่ต้องการ Verify   │
│   ข้อมูลนี้"          │
│                     │
│  [ยกเลิก] [ยืนยัน]  │
└─────────────────────┘
       │ ยืนยัน
       ▼
  ┌── API Call ──┐
  │              │
  ▼ Success      ▼ Error
┌──────────┐  ┌──────────┐
│ Success  │  │ Error    │
│ Modal    │  │ Modal    │
│ 560×360  │  │ 560×360  │
│          │  │          │
│ Figma:   │  │ Figma:   │
│ LeJRP..  │  │ LeJRP..  │
│ /1:10201 │  │ /1:10210 │
│          │  │          │
│ ✓ green  │  │ ! red    │
│ #198754  │  │ #DC3545  │
│ "สำเร็จ"  │  │ "การแจ้ง │
│ "บันทึก   │  │  เตือน"   │
│  ข้อมูล   │  │ "มีข้อผิด│
│  สำเร็จ"   │  │  พลาดใน  │
│          │  │  การ      │
│ [ตกลง]   │  │  Verify" │
│ green    │  │          │
│ #198754  │  │ [ตกลง]   │
└──────────┘  │ navy     │
  │           │ #003366  │
  ▼           └──────────┘
redirect        │
to p01          ▼
              close modal,
              stay on page
```

## Figma Node Reference (CORRECTED)

| Modal | Figma File | Node | URL |
|-------|-----------|------|-----|
| OTP Confirm | `r8wLwGvG3I4vYU6SLQ1jec` | `1:11085` | [Figma](https://www.figma.com/design/r8wLwGvG3I4vYU6SLQ1jec/Figma_BSS-Verify?node-id=1-11085&m=dev) |
| Success | `LeJRPqvfhVR3AnjdDqIZsn` | `1:10201` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/verify-ver-2?node-id=1-10201&m=dev) |
| Error | `LeJRPqvfhVR3AnjdDqIZsn` | `1:10210` | [Figma](https://www.figma.com/design/LeJRPqvfhVR3AnjdDqIZsn/verify-ver-2?node-id=1-10210&m=dev) |

> **สำคัญ:** Success/Error modals อยู่ใน Figma file คนละไฟล์กับ OTP Modal

## Shared Modal Layout (all 3 modals)

ทุก modal มี layout เดียวกัน: **560 × 360 px, 3-section vertical**

```
┌─────────────────── 560px ───────────────────┐
│                                               │
│  Top Bar (560 × 141px)                        │
│    ┌──────┐                                   │
│    │ Icon │  48×48, centered, 32px from top    │
│    └──────┘                                   │
│    Title — Pridi Medium 24px, centered         │
│            16px below icon                     │
│                                               │
│  Body (560 × variable)                        │
│    Message — Pridi Regular 16px, centered      │
│              24px from section top              │
│                                               │
│  ─────── border-top: 1px solid #cbd5e1 ─────  │
│  Button Area (560 × 70px)                     │
│    Button(s) — 160×38, centered, 16px padding  │
│    Button gap: 24px (if 2 buttons)             │
│    Border radius: ~6px                         │
│                                               │
└───────────────────────────────────────────────┘
```

## Per-Modal Specs

### OTP Confirm Modal (node 1:11085)

| Element | Value |
|---------|-------|
| Icon | Circled "i" info, `#3D8BFD` (`Blue/400`) |
| Title | "Verify" |
| Body | "คุณแน่ใจหรือไม่ที่ต้องการ Verify ข้อมูลนี้" |
| Cancel button | "ยกเลิก", 160×38, `#6c757d` (`Secondary`) |
| Confirm button | "ยืนยัน", 158×38, `#003366` (`Primary`) |
| Button gap | 24px |
| Action (Cancel) | Close modal, stay on page |
| Action (Confirm) | Call API → show Success or Error |

### Success Modal (node 1:10201)

| Element | Value |
|---------|-------|
| Icon | Circle checkmark, `#198754` (`Theme/Success`) |
| Title | "สำเร็จ" |
| Body | "บันทึกข้อมูลสำเร็จ" |
| Button | "ตกลง", 160×38, `#198754` (green) |
| Footer border | 1px solid `#cbd5e1` |
| Action | Close modal → redirect to `/Verify/VerifyAutoSelling` |

### Error Modal (node 1:10210)

| Element | Value |
|---------|-------|
| Icon | Circle "!", `#DC3545` (`Theme/Danger`) |
| Title | "การแจ้งเตือน" |
| Body | "มีข้อผิดพลาดในการ Verify" |
| Button | "ตกลง", 160×38, `#003366` (navy) |
| Footer border | 1px solid `#cbd5e1` |
| Action | Close modal → **stay on page** (can retry) |

## Design Tokens (shared across all modals)

| Token | Value |
|-------|-------|
| `Body Text/Body Color` | `#212529` |
| `Gray/White` | `#FFFFFF` |
| `Slate/300` | `#cbd5e1` |
| `Blue/400` | `#3D8BFD` |
| `Primary` | `#003366` |
| `Theme Colors/Secondary` | `#6c757d` |
| `Theme/Success` | `#198754` |
| `Theme/Danger` | `#DC3545` |
| `Heading/H4` | Pridi Medium 24px, weight 500, line-height 1.2, letter-spacing 2.5px |
| `Body/Regular` | Pridi Regular 16px, weight 400, line-height 1.5, letter-spacing 2.5px |
| `Space/s-md` | 16px |

## Typography

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---------|------|------|--------|-------------|----------------|
| Modal title | Pridi | 24px | 500 (Medium) | 1.2 | 2.5px |
| Body message | Pridi | 16px | 400 (Regular) | 1.5 | 2.5px |
| Button text | Pridi | 16px | 400-500 | — | — |

## Files to Modify

### Modified (2 files)

| # | File | Changes |
|---|------|---------|
| 1 | `Views/Verify/VerifyConfirmation/Index.cshtml` | Replace 3 modal HTML blocks with custom `.vc-modal-*` layout |
| 2 | `wwwroot/css/verify/verifyConfirmation.css` | Update modal CSS to match 560×360 3-section layout |

### Already Done (no changes needed)

| # | File | Status |
|---|------|--------|
| 3 | `wwwroot/js/verify/verifyConfirmation.js` | Modal functions already exist, may need text updates |

### NO new files needed

All CSS goes in `verifyConfirmation.css`. JS is already in `verifyConfirmation.js`.

## What Needs to Change from Current Code

### Current State (wrong)

The current code has 2 different modal patterns:
1. **OTP modal** — uses custom `.vc-modal-*` classes (560×360) ← close to correct
2. **Success/Error modals** — uses Bootstrap default `.modal-popup` with `.modal-success-title` / `.modal-warning-title` ← **wrong layout, needs rewrite**

### Required Changes

| Modal | Current Pattern | Needed Pattern |
|-------|----------------|----------------|
| OTP Confirm | `.vc-modal-alert` custom (close) | Keep, verify sizing/spacing |
| Success | Bootstrap `.modal-popup` default | Rewrite to `.vc-modal-*` 560×360 layout |
| Error | Bootstrap `.modal-popup` default | Rewrite to `.vc-modal-*` 560×360 layout |

### Specific Text Changes

| Modal | Current Text | Figma Text |
|-------|-------------|------------|
| Success title | "สำเร็จ!" | "สำเร็จ" |
| Success message | "Verify สำเร็จแล้ว" | "บันทึกข้อมูลสำเร็จ" |
| Success button | `.btn-green` generic | Green `#198754`, 160×38 |
| Error message | "เกิดข้อผิดพลาด" | "มีข้อผิดพลาดในการ Verify" |
| Error button | `.btn-blue` generic | Navy `#003366`, 160×38 |

### Icon Changes

| Modal | Current Icon | Figma Icon |
|-------|-------------|------------|
| OTP | Blue info SVG (inline) | Blue `#3D8BFD` circled "i" — ✓ matches |
| Success | `.bi-check-circle-fill` Bootstrap | Green `#198754` circle checkmark — needs custom |
| Error | `.bi-exclamation-diamond-fill` Bootstrap | Red `#DC3545` circle "!" — needs custom |

## Implementation Checklist

- [ ] Rewrite Success modal HTML to `.vc-modal-*` 560×360 layout (matching OTP pattern)
- [ ] Rewrite Error modal HTML to `.vc-modal-*` 560×360 layout (matching OTP pattern)
- [ ] Add Success icon SVG (green `#198754` circle checkmark, 48×48)
- [ ] Add Error icon SVG (red `#DC3545` circle "!", 48×48)
- [ ] Update Success modal text: title "สำเร็จ", message "บันทึกข้อมูลสำเร็จ"
- [ ] Update Error modal text: message "มีข้อผิดพลาดในการ Verify"
- [ ] Success button: green `#198754`, 160×38, 6px radius
- [ ] Error button: navy `#003366`, 160×38, 6px radius
- [ ] Add CSS for `.vc-modal-btn--success` (green variant)
- [ ] Verify OTP modal matches spec (already close)
- [ ] Test: Verify → OTP confirm → Success → ตกลง → redirect to p01
- [ ] Test: Verify → OTP confirm → Error → ตกลง → stay on page
- [ ] Test: Cancel at OTP → modal closes, stay on page
