# Preparation Unsort CA Non-Member

จัดการรายการเตรียมธนบัตร unsorted CA สำหรับธนาคารที่ไม่ใช่สมาชิก

- **Route:** `/Preparation/PreparationUnsortCANonMember`
- **API Route:** `api/PreparationUnsortCaNonmember`

## เอกสาร

| ส่วน | Frontend | Backend |
|------|----------|---------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) | [backend/file-map.md](./backend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) | [backend/business-logic.md](./backend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) | [backend/changelog.md](./backend/changelog.md) |

## สรุปย่อ

- รองรับ CRUD สำหรับรายการเตรียมธนบัตร unsorted CA ของธนาคารที่ไม่ใช่สมาชิก
- มีหน้ารายการ, แก้ไข, ลบ, และพิมพ์
- Second screen สำหรับแสดงผลบนจอที่ 2 (dual-monitor)
- สร้างรายงานผ่าน Excel template
