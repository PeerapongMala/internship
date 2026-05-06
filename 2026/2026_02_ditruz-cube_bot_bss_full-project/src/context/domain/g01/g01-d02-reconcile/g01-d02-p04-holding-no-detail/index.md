# g01-d02-p04 — Holding (No Detail)

## Overview

หน้าสรุปยอด Holding — แสดงสรุปจำนวนธนบัตรก่อนกดส่งยอด Reject

ต่อจากหน้า Reconcile Transaction (p01) ในขั้นตอนการทำงาน:
1. Reconcile Transaction (p01) → กดปุ่ม → มาที่หน้านี้ (p04)
2. ตรวจสอบยอดรวม → กด "ส่งยอด Reject"
3. Confirm modal → กด "ยืนยัน" → API call
4. สำเร็จ → Success modal → redirect
5. ผิดพลาด → Error modal → อยู่หน้าเดิม retry ได้

## Routes

| Type | Route |
|------|-------|
| Frontend URL | `/Reconcilation/Holding` |
| API Base | TBD |

## BnType Variants

| Code | Title | NavColorClass |
|------|-------|---------------|
| UF | Holding UNFIT | nav-blue-light |
| UC | Holding UNSORT CC | nav-orange |
| CA | Holding UNSORT CA MEMBER | nav-green |
| CN | Holding UNSORT CA NON-MEMBER | nav-purple |

## Figma References

| Component | Figma File | Node | URL |
|-----------|-----------|------|-----|
| Main Page (Unfit) | `BsIzHq1P3dX7lrAmWJp6BC` | `41:28771` | [Figma](https://www.figma.com/design/BsIzHq1P3dX7lrAmWJp6BC/-Reconciliation-ver-2----CO9---BSS--Reconciliation--20260219-?node-id=41-28771&m=dev) |
| Confirm Reject Modal | `BsIzHq1P3dX7lrAmWJp6BC` | `41:30417` | [Figma](https://www.figma.com/design/BsIzHq1P3dX7lrAmWJp6BC/-Reconciliation-ver-2----CO9---BSS--Reconciliation--20260219-?node-id=41-30417&m=dev) |
| Success Modal | `BsIzHq1P3dX7lrAmWJp6BC` | `41:30408` | [Figma](https://www.figma.com/design/BsIzHq1P3dX7lrAmWJp6BC/-Reconciliation-ver-2----CO9---BSS--Reconciliation--20260219-?node-id=41-30408&m=dev) |

## เอกสาร

| ส่วน | Frontend |
|------|----------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) |

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Documentation scaffold | Done | Template + Figma specs |
| Frontend View (.cshtml) | Done | Info card + summary table + summary footer + button |
| Frontend CSS | Done | holdingNoDetail.css + variant CSS |
| Frontend JS | Done | Mock data mode (USE_MOCK_DATA=true) |
| Confirm Reject modal | Done | HTML/CSS done, uses `.hn-modal-*` layout |
| Success modal | Done | HTML/CSS done, uses `.hn-modal-*` layout |
| Backend API | TODO | Needs API endpoints |
| API integration | TODO | Set USE_MOCK_DATA=false |
