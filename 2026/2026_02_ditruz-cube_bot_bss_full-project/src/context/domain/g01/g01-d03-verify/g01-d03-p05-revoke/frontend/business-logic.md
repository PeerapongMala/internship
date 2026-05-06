# Frontend Business Logic — Revoke

## Page Load
1. Controller ดึง BnType จาก `_appShare.BnType` → กำหนด CSS variant class + nav color
2. ดึง machine info จาก `IMasterMachineService`
3. Render view `~/Views/Revoke/RevokeAutoSelling/Index.cshtml` พร้อม ViewModel

## BnType Variants
- UF → `revoke-unfit` / `nav-blue-light`
- UC → `revoke-unsort-cc` / `nav-orange`
- CA → `revoke-ca-member` / `nav-green`
- CN → `revoke-ca-non-member` / `nav-purple`

## AJAX Flow
1. **GetRevokeTransactions** — โหลดตาราง (filter DepartmentId จาก session)
2. **ScanHeaderCard** — สแกน HC → สร้าง/อัปเดต revoke record
3. **GetHeaderCardDetail** — คลิก row → แสดงรายละเอียด
4. **EditRevokeTran** — แก้ไข HC assignment
5. **DeleteRevokeTran** — ลบ record (soft delete)
6. **GetRevokeDetail** — แสดง denomination breakdown
7. **RevokeAction** — ยืนยัน revoke (status 18→17, อาจต้อง OTP)
8. **CancelRevoke** — ยกเลิก revoke (กลับไป 18)
9. **GetRevokeCount** — นับสรุป

## Status Flow ที่แสดงบนหน้าจอ
- รอ Revoke (status 18) → ยืนยัน → Revoked (status 17)
- Cancel → กลับไป SendToCBMS (18)

## Mock Data Mode
- JS ใช้ `USE_MOCK_DATA = true` ระหว่าง dev
- เมื่อ backend logic พร้อม → เปลี่ยนเป็น `false`
