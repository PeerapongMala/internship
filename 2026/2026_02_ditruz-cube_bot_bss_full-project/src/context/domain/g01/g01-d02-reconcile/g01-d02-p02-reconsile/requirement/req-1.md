# REQ-1: Reconsile Page — Initial Scaffold

## Entry Point

OperationSetting → Reconciliation → Reconsile

Route: `/Reconcilation/Reconsile`

## Figma Reference

- **File:** `OAMmUhXjYQKdYn5TAXGnAN`
- **Root Section:** `3652:16991` (01.02.02 Reconciliation <>)

เป็น flow รวม:

`3652:16991` → `1:11716` (Page - Reconcile 20260202)

เป็นหน้าหลัก:

`1:18004` (Reconcile - Unfit — base layout)

## 4 CSS Variants

| Variant | BnType | Figma Node | Nav Color |
|---------|--------|------------|-----------|
| Unfit | UF | `1:18004` | nav-blue-light |
| Unsort CC | UC | `1:17314` | nav-orange |
| CA Member | CA | `1:17534` | nav-green |
| CA Non-Member | CN | `1:17764` | nav-purple |

## Scope

อ้างอิง g01-d02-p01-transcation

- Backend API scaffold (9 endpoints) — business logic TBD (ลูกค้าส่ง logic ให้ทีหลัง)
- Frontend data layer (models, service, DI, controller)
- Frontend UI from Figma (Phase 3 — pending)
- DB มีให้ — ยังไม่ต้องคิดใหม่

## Notes

- Table/PK names เป็น placeholder (`bss_txn_reconsile_tran`, `bss_txn_reconsile`) — จะปรับเมื่อลูกค้ายืนยัน
- Business requirements pending client confirmation
- Thai text labels TBD
