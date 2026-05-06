# Backend Business Logic — Revoke

## Data Model
- **Reuse** ตาราง `bss_txn_verify_tran` โดย filter `is_revoke = true`
- Repository เป็น standalone class (ไม่ extend GenericRepository เพื่อเลี่ยง Scrutor duplicate)
- Repository queries เพิ่ม `.Where(x => x.IsRevoke == true)` ทุก method
- ไม่ต้องเพิ่ม DbSet ใหม่ใน ApplicationDbContext

## Status Flow
```
SendToCBMS (18) → ScanHeaderCard → IsRevoke=true (ปรากฏในหน้า Revoke)
                → RevokeAction → StatusId 18→17 (Verify)
                → CancelRevoke → IsRevoke=false, StatusId=18 (กลับ SendToCBMS)
```

## Status Constants
| StatusId | Name | Description |
|----------|------|-------------|
| 16 | Approved | อนุมัติ (entry point สำหรับ Verify) |
| 17 | Verify | ตรวจสอบแล้ว (target หลัง Revoke) |
| 18 | SendToCBMS | ส่งผลนับคัดเข้า CBMS (source สำหรับ Revoke) |

## API Endpoints (9 ตัว)
1. **GetRevokeTransactions** — query paged, filter `is_revoke=true`, `is_active=true`
2. **ScanHeaderCard** — ค้นหา HC ที่ StatusId=18 + IsRevoke=false → set IsRevoke=true
3. **GetHeaderCardDetail** — query by ID, filter `is_revoke=true`
4. **EditRevokeTran** — update HC code + remark
5. **DeleteRevokeTran** — soft delete (`is_active=false`)
6. **GetRevokeDetail** — query with denomination breakdown (Include TransactionVerify)
7. **Revoke** — เปลี่ยน StatusId 18→17 (SendToCBMS → Verify)
8. **CancelRevoke** — set IsRevoke=false, คง StatusId=18 (ยกเลิก revoke)
9. **GetRevokeCount** — count by status (revoked=17, pending=18, warning)

## Implemented Logic

### ScanHeaderCardAsync
1. Validate HeaderCardCode ไม่ว่าง
2. ค้นหา `TransactionVerifyTran` ที่ `HeaderCardCode` ตรง, `StatusId=18`, `IsRevoke=false/null`, `IsActive=true`
3. ถ้าไม่พบ → return error "ไม่พบรายการที่สถานะ SendToCBMS"
4. Set `IsRevoke=true`, update audit fields
5. Save + return success

### RevokeAsync
1. ค้นหาด้วย `GetRevokeTranByIdAsync` (filter IsRevoke=true)
2. Validate `StatusId == 18`
3. เปลี่ยน `StatusId` จาก 18 → 17
4. Update audit fields, save

### CancelRevokeAsync
1. ค้นหาด้วย `GetRevokeTranByIdAsync` (filter IsRevoke=true)
2. Set `IsRevoke=false`, คง `StatusId=18`
3. บันทึก Remark, update audit fields, save
