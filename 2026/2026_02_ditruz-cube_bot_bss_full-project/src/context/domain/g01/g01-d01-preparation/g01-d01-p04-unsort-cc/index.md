# Preparation Unsort CC

จัดการรายการเตรียมธนบัตร unsorted CC

- **Route:** `/Preparation/PreparationUnsoftCC`
- **API Route:** `api/PreparationUnsortCC`

> **หมายเหตุ:** view และ CSS/JS ใช้ชื่อ "UnsoftCC" (ชื่อเดิม) แต่ controller/service ใช้ "UnsortCC" — หมายถึงหน้าเดียวกัน

## เอกสาร

| ส่วน | Frontend | Backend |
|------|----------|---------|
| File Map | [frontend/file-map.md](./frontend/file-map.md) | [backend/file-map.md](./backend/file-map.md) |
| Business Logic | [frontend/business-logic.md](./frontend/business-logic.md) | [backend/business-logic.md](./backend/business-logic.md) |
| Changelog | [frontend/changelog.md](./frontend/changelog.md) | [backend/changelog.md](./backend/changelog.md) |

## สรุปย่อ

- รองรับ CRUD สำหรับรายการเตรียมธนบัตร unsorted CC
- มีหน้ารายการ, แก้ไข, ลบ, และพิมพ์
- Second screen สำหรับแสดงผลบนจอที่ 2 (dual-monitor)
- สร้างรายงานผ่าน Excel template
