# g01-d03-p01 — Verify Auto Selling

## Overview
หน้าตรวจสอบการนับคัดธนบัตร (Verify Auto Selling) — ตรวจสอบว่าข้อมูลที่กระทบยอดแล้ว (Reconciled) ถูกต้องก่อนส่ง CBMS

## Status Flow
```
Approved (16) → Verify (17) → SendToCBMS (18)
```
- Cancel verify → กลับไป Approved (16)

## Routes

| Type | Route |
|------|-------|
| Frontend URL | `/Verify/Index` → redirect → `/Verify/VerifyAutoSelling` |
| API Base | `api/VerifyTransaction/` |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `GetVerifyTransactions` | ดึงรายการ verify transactions (paged) |
| POST | `ScanHeaderCard` | สแกน header card เพื่อ verify |
| GET | `GetHeaderCardDetail/{id}` | ดึงรายละเอียด header card |
| PUT | `EditVerifyTran` | แก้ไข verify transaction |
| DELETE | `DeleteVerifyTran` | ลบ verify transaction |
| GET | `GetVerifyDetail/{id}` | ดึงรายละเอียด denomination breakdown |
| POST | `Verify` | ยืนยันการ verify (ต้อง OTP) |
| POST | `CancelVerify` | ยกเลิก verify (ต้อง OTP) |
| POST | `GetVerifyCount` | นับจำนวน verify แล้ว/รอ |

## Database Tables
- `bss_txn_verify_tran` — Transaction header (PK: verify_tran_id)
- `bss_txn_verify` — Transaction detail / denomination breakdown (PK: verify_id, FK: verify_tran_id)

## BnType Variants
| Code | Name | CSS Class | Nav Color |
|------|------|-----------|-----------|
| UF | UNFIT | verify-unfit | nav-blue-light |
| UC | UNSORT CC | verify-unsort-cc | nav-orange |
| CA | UNSORT CA MEMBER | verify-ca-member | nav-green |
| CN | UNSORT CA NON-MEMBER | verify-ca-non-member | nav-purple |

## Figma
- File: `r8wLwGvG3I4vYU6SLQ1jec`
- Node: `2-17435` (main page)
- Key states: `2:20263` (default), `2:18859` (detail+adjustment)
- Popups: `2:23259` (edit), `2:25046` (success), `2:25077` (edit single), `2:31555` (cancel OTP)

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Entities | Done | Scaffold stubs |
| Backend Request/Response Models | Done | Scaffold stubs |
| Backend Repository + Service | Done | Scaffold stubs, TODO logic |
| Backend Controller | Done | 9 endpoints, stub responses |
| Backend Registration (UoW, DbContext) | Done | |
| Frontend Models + Service | Done | Scaffold stubs |
| Frontend Controller (BnType) | Done | 4 variants |
| Frontend View (.cshtml) | Done | Built from Figma spec (709 lines) |
| Frontend CSS | Done | Built from Figma spec (1524 lines) |
| Frontend JS | Done | Mock data mode (876 lines) |
| Popup Figma specs | Done | 4 popup node folders (5 files each) |
| Domain docs | Done | file-map, business-logic, changelog |
| Popup UI implementation | TODO | Build from fetched specs |
| Backend real logic | TODO | Replace stubs with DB queries |
| API integration | TODO | Set USE_MOCK_DATA=false |

## Pattern Source
- Backend: Scaffolded from **Reconcile Transaction** (g01-d02-p01-transcation) with naming map
- Frontend UI: Built from **Figma design** — NOT copied from Reconcile
- Layout: 6-panel (2 columns x 3 rows) — different from Reconcile's 3-panel
