# g01-d03-p05 — Revoke

## Overview
หน้า Revoke — ย้อน transaction ที่ส่ง CBMS แล้ว (status 18 = SendToCBMS) กลับไปสถานะก่อนหน้า

## Status Flow
```
SendToCBMS (18) → Revoke → กลับไป Verify (17)
Cancel Revoke → กลับไป SendToCBMS (18)
```

## Routes

| Type | Route |
|------|-------|
| Frontend URL | `/Revoke/Index` → redirect → `/Revoke/RevokeAutoSelling` |
| API Base | `api/RevokeTransaction/` |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `GetRevokeTransactions` | ดึงรายการ revoke transactions (paged) |
| POST | `ScanHeaderCard` | สแกน header card เพื่อ revoke |
| GET | `GetHeaderCardDetail/{id}` | ดึงรายละเอียด header card |
| PUT | `EditRevokeTran` | แก้ไข revoke transaction |
| DELETE | `DeleteRevokeTran` | ลบ revoke transaction |
| GET | `GetRevokeDetail/{id}` | ดึงรายละเอียด denomination breakdown |
| POST | `Revoke` | ยืนยันการ revoke (อาจต้อง OTP) |
| POST | `CancelRevoke` | ยกเลิก revoke |
| POST | `GetRevokeCount` | นับจำนวน revoke แล้ว/รอ |

## Database Tables
- `bss_txn_verify_tran` — reuse จาก Verify โดย filter `is_revoke = true`
- `bss_txn_verify` — Detail / denomination breakdown (FK: verify_tran_id)

## BnType Variants
| Code | Name | CSS Class | Nav Color |
|------|------|-----------|-----------|
| UF | UNFIT | revoke-unfit | nav-blue-light |
| UC | UNSORT CC | revoke-unsort-cc | nav-orange |
| CA | UNSORT CA MEMBER | revoke-ca-member | nav-green |
| CN | UNSORT CA NON-MEMBER | revoke-ca-non-member | nav-purple |

## Figma
- File: `r8wLwGvG3I4vYU6SLQ1jec`
- Node: `2-51049` (main page)

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Request/Response Models | Done | 7 request + 7 response models |
| Backend Repository | Done | Standalone class (ไม่ extend GenericRepository เพื่อเลี่ยง Scrutor duplicate) |
| Backend Service | Done | Scan/Revoke/CancelRevoke มี logic จริงแล้ว |
| Backend Controller | Done | 9 endpoints |
| Backend Registration (UoW) | Done | |
| Frontend Models + Service | Done | 7 request + 5 result + service |
| Frontend Controller (BnType) | Done | 4 variants |
| Frontend View (.cshtml) | Done | Scaffold from Verify (709 lines) |
| Frontend CSS | Done | Scaffold from Verify (1524 lines + 3 variants) |
| Frontend JS | Done | API integration, USE_MOCK_DATA=false |
| Domain docs | Done | index, file-map, business-logic, changelog |
| Backend real logic | Done | ScanHC → IsRevoke=true, Revoke → status 18→17, Cancel → IsRevoke=false |
| API integration | Done | JS เรียก API จริง (GetRevokeTransactions, GetRevokeCount) |
| Figma design specs | TODO | ดึง spec จาก node 2-51049 (ต้อง config Figma MCP ก่อน) |
| UI refinement from Figma | TODO | ปรับ UI ตาม Figma spec จริง |

## Pattern Source
- Backend: Scaffolded from **Verify Auto-Selling** (g01-d03-p01-auto-selling) with naming map
- Frontend UI: Scaffold from **Verify** — pending Figma refinement
