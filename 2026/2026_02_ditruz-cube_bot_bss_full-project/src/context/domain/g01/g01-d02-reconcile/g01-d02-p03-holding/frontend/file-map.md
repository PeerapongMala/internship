# Holding Detail UNFIT — Frontend File Map

Path ทั้งหมด relative จาก `project/frontend/BSS_WEB/`

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/HoldingController.cs` |
| **View** | `Views/holding/unfit/Index.cshtml` |

## Static Assets

| ประเภท | Path |
|--------|------|
| CSS (base) | `wwwroot/css/holding/holdingUnfit.css` |

## Shared/Global Files (read-only reference)

| ประเภท | Path | หมายเหตุ |
|--------|------|----------|
| Global CSS | `wwwroot/css/master/all.css` | `.main-wrapper`, `.main-title`, `.layout` |
| Layout | `Views/Shared/_Layout.cshtml` | Base layout, scripts, Bootstrap 5 |

## Notes

- ยังไม่มี Service/Interface (ใช้ mock data ใน View inline JS)
- ยังไม่มี Object/Service Models (ไม่มี API calls)
- JS ฝังอยู่ใน `Index.cshtml` ใน `@section Scripts` (ไม่มีไฟล์ `.js` แยก)
- เมื่อเชื่อม API จริง ต้องสร้าง:
  - `Services/HoldingDetailService.cs`
  - `Interfaces/IHoldingDetailService.cs`
  - `Models/ObjectModel/HoldingDetail*.cs` (request models)
  - `Models/ServiceModel/HoldingDetail/HoldingDetail*.cs` (result models)
  - `wwwroot/js/holding/holdingDetail.js` (แยก JS ออกจาก View)
