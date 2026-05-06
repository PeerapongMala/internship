# Frontend Changelog — Revoke

## 2026-02-19 (2)
- API integration: เปลี่ยน `USE_MOCK_DATA = false`
- เพิ่ม `getRevokeTransactionsAsync()` — เรียก `Revoke/GetRevokeTransactionsDetailAsync`
- เพิ่ม `getRevokeCountAsync()` — เรียก `Revoke/GetRevokeCount`
- เขียน `loadAllData()` ใหม่ — เรียก API จริง, แบ่งข้อมูลเข้าตาราง (pending/warning/revoked)
- เพิ่ม `loadRevokeCount()` — แสดงจำนวน revoke summary

## 2026-02-19
- Initial scaffold: สร้างทุกไฟล์ frontend (models, service, controller, view, CSS, JS)
- Pattern: คัดลอกจาก Verify Auto-Selling (g01-d03-p01) ปรับ naming เป็น Revoke
- View/CSS/JS: scaffold จาก Verify — รอ Figma spec (node 2-51049) เพื่อปรับ UI
- Controller: 4 BnType variants + 9 AJAX endpoints
- DI: เพิ่ม IRevokeTransactionService ใน ItemServiceCollectionExtensions.cs
