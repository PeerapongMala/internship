# Holding Detail UNFIT — Backend File Map

Path ทั้งหมด relative จาก `project/backend/BSS_API/`

## สถานะ: ยังไม่ได้สร้าง

Backend API สำหรับ Holding Detail ยังไม่ได้สร้าง — frontend ใช้ mock data

## ไฟล์ที่ต้องสร้าง (เมื่อมี business logic)

| ประเภท | Path (คาดการณ์) |
|--------|------|
| Controller | `Controllers/HoldingDetailController.cs` |
| Service | `Services/HoldingDetailService.cs` |
| Service Interface | `Services/Interface/IHoldingDetailService.cs` |
| Repository | `Repositories/HoldingDetailRepository.cs` |
| Repository Interface | `Repositories/Interface/IHoldingDetailRepository.cs` |

## Registration Files (ต้อง MODIFY เมื่อสร้าง)

| File | What to Add |
|------|-------------|
| `Repositories/Interface/IUnitofWork.cs` | Repository property |
| `Repositories/UnitOfWork.cs` | Property + constructor init |
| `Models/ApplicationDbContext.cs` | DbSets (ถ้ามี entity ใหม่) |
