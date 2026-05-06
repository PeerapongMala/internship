# g01-d03-p03 — Manual Key-in

## Overview
หน้า Edit & Manual Key-in — สำหรับเพิ่ม/แก้ไขผลการนับคัดธนบัตรแบบ Manual
เป็น 1 ใน 5 หน้าของ Verify domain (g01-d03)

## Routes

| Type | Route |
|------|-------|
| Frontend URL | `/Verify/ManualKeyIn` |
| API Base | ยังไม่มี (ใช้ mock data) |

## BnType Variants
| Code | Name | CSS Class | Nav Color |
|------|------|-----------|-----------|
| UF | UNFIT | verify-unfit | nav-blue-light |
| UC | UNSORT CC | verify-unsort-cc | nav-orange |
| CA | UNSORT CA MEMBER | verify-ca-member | nav-green |
| CN | UNSORT CA NON-MEMBER | verify-ca-non-member | nav-purple |

## Figma
- File: `r8wLwGvG3I4vYU6SLQ1jec`
- Node: `2:23259` (Edit & Manual Key-in Unsort CC)
- Screens: 1.0–1.7 (main page, edit modal, confirm, success, review, OTP)
- PNG references: `/png/` folder (8 screenshots)

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend | Not started | FE only per CTO directive |
| Frontend ViewModel | Done | IndexModel with BnType props |
| Frontend Controller | Done | ManualKeyIn() action in VerifyController |
| Frontend View (.cshtml) | Done | Main page + 4 modals (~320 lines) |
| Frontend CSS | Done | manualKeyIn.css (~580 lines, mk- prefix) |
| Frontend JS | Done | manualKeyIn.js (~444 lines, USE_MOCK_DATA=true) |
| Domain docs | Done | file-map, business-logic, changelog |
| Backend real logic | TODO | รอ business logic จากลูกค้า |
| API integration | TODO | Set USE_MOCK_DATA=false |

## Pattern Source
- Frontend UI: Built from **Figma PNG screenshots** (1.0–1.7)
- Layout: Form section (left) + Info panel (right) + Results table — different from Auto Selling's 6-panel
- Reference: อิงโครงสร้างจาก Auto Selling (g01-d03-p01)

## Scope (จาก CTO directive)
- **Frontend UI + Mock Data เท่านั้น**
- Backend ยังไม่ต้องทำ (รอ business logic)
- Deadline: ภายในวันถัดไป
