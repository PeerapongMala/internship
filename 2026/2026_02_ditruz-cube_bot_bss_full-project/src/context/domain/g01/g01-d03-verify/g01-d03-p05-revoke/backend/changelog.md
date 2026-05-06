# Backend Changelog — Revoke

## 2026-02-19 (2)
- Fix: Scrutor DuplicateTypeRegistrationException — เอา `GenericRepository<TransactionVerifyTran>` inheritance ออกจาก `TransactionRevokeTranRepository`
- Repository ใช้ standalone class แทน + เพิ่ม `Update()` method เอง
- Interface เปลี่ยนจาก `IGenericRepository<TransactionVerifyTran>` เป็น standalone interface
- เพิ่ม `FindByHeaderCardForRevokeAsync()` สำหรับค้นหา record ที่ StatusId=18 และยังไม่ได้ mark revoke
- Implement real logic:
  - `ScanHeaderCardAsync` — ค้นหา verify tran ที่ StatusId=18, set IsRevoke=true
  - `RevokeAsync` — เปลี่ยน StatusId จาก 18 (SendToCBMS) → 17 (Verify)
  - `CancelRevokeAsync` — set IsRevoke=false, คง StatusId=18

## 2026-02-19
- Initial scaffold: สร้างทุกไฟล์ backend (request/response models, repository, service, controller)
- Pattern: คัดลอกจาก Verify Auto-Selling (g01-d03-p01) ปรับ naming เป็น Revoke
- Repository: reuse TransactionVerifyTran entity, เพิ่ม filter `is_revoke = true`
- Service: Edit/Delete มี logic จริง, Scan/Revoke/CancelRevoke ยังเป็น stub
- Registration: เพิ่มใน IUnitOfWork + UnitOfWork
- Controller: 9 API endpoints ตาม Verify pattern
