# Reconsile

จัดการ Reconsile (หน้าที่ 2 ใน Reconciliation domain)

- **Route:** `/Reconcilation/Reconsile`
- **API Route:** `api/ReconsileTransaction`

## เอกสาร

| ส่วน | Frontend | Backend |
|------|----------|---------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) | [backend/file-map.md](./backend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) | [backend/business-logic.md](./backend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) | [backend/changelog.md](./backend/changelog.md) |

## สรุปย่อ

- รองรับ 4 variants: Unfit, Unsort CC, Unsort CA Member, Unsort CA Non-Member
- Scaffold จาก g01-d02-p01-transcation (Reconcile Transaction) — business logic TBD pending client
- DB มีแล้ว (ลูกค้าเตรียม) — table/PK names เป็น placeholder

## Status

- Backend: Scaffold complete (TODO stubs)
- Frontend Data Layer: Complete
- Frontend UI: Complete (Figma-based) — Design QA pixel fixes done
- Frontend Modals: Edit confirm flow + Delete confirm flow + Success modals
- Frontend Sort: Both denom table + summary table — clickable headers with icon toggle
- Frontend Mock Data: M key toggle (minimal / full)
- Design Docs: Complete (4 node folders, design-tokens.md, figma-specs.css)

## Figma

- **File:** `OAMmUhXjYQKdYn5TAXGnAN`
- **Root:** `3652:16991` (01.02.02 Reconciliation <>)
- **Page:** `1:11716` (Page - Reconcile 20260202)
- Section 1 (`1:17307`): Reconciliation UI — All Types
  - `1:18004` — Reconcile - Unfit (base layout)
  - `1:17314` — Reconcile - Unsort CC
  - `1:17534` — Reconcile - Unsort CC Member
  - `1:17764` — Reconcile - Unsort CC Non Member
- Section 2 (`1:18725`): Input Types — Result All Options
  - `1:18726` — UNFIT - Type Reject
  - `1:18956` — UNFIT - กรณีชำรุด
  - `1:19206` — UNFIT - กรณีปลอม
  - `1:19437`–`1:19964` — UNFIT - กรณีต่างๆ (เพิ่มเติม)
- Section 3 (`1:20244`): Example - Reconcile Unfit - All Conditions
  - `1:20245` — Condition - 12 (Cancel)
  - `1:20476` — Condition - 13 (Reconciled)
  - `1:20707` — Condition - 14
  - `1:20958` — Condition - 15
  - `1:21191` — Condition - 16 (Approved)
  - `1:21433` — Condition - 17 (Verify)
- Section 4 (`1:21676`): Edit Summary Reconcile
  - `1:21677` — Edit Summary Reconcile - 02
  - `1:21708` — Condition - 11 (Pending)
  - `1:21940` — Condition - 10
  - `1:22171` — Condition - 9
  - `1:22404`–`1:22415` — Delete Single Item
  - `1:22426` — ลบข้อมูลสำเร็จ
  - `1:22435` — ยืนยัน
