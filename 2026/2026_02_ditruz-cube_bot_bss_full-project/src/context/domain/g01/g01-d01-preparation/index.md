# โดเมน Preparation

โดเมน Preparation จัดการเรื่องการคัดแยกและเตรียมธนบัตร ครอบคลุมการจัดประเภทธนบัตร unfit, unsorted CA (สมาชิก/ไม่ใช่สมาชิก) และ unsorted CC

## รายชื่อหน้า

| หน้า | Path | คำอธิบาย |
|------|------|----------|
| [Preparation Unfit](./unfit/index.md) | `/Preparation/PreparationUnfit` | จัดการธนบัตรที่ไม่เหมาะสม (unfit) |
| [Unsort CA Member](./unsort-ca-member/index.md) | `/Preparation/PreparationUnsortCAMember` | ธนบัตร unsorted CA สำหรับธนาคารสมาชิก |
| [Unsort CA Non-Member](./unsort-ca-nonmember/index.md) | `/Preparation/PreparationUnsortCANonMember` | ธนบัตร unsorted CA สำหรับธนาคารที่ไม่ใช่สมาชิก |
| [Unsort CC](./unsort-cc/index.md) | `/Preparation/PreparationUnsoftCC` | ธนบัตร unsorted CC |

## Shared Backend Files

ทั้ง 4 หน้าใช้ไฟล์ backend หลักร่วมกัน (relative จาก `project/backend/BSS_API/`):

| ประเภท | Path |
|--------|------|
| Service | `Services/TransactionPreparationService.cs` |
| Service Interface | `Services/Interface/ITransactionPreparationService.cs` |
| Repository | `Repositories/TransactionPreparationRepository.cs` |
| Repository Interface | `Repositories/Interface/ITransactionPreparationRepository.cs` |
| Entity | `Models/Entities/TransactionPreparation.cs` |
| Shared Request | `Models/RequestModels/CreatePreparationRequest.cs` |
| Shared Request | `Models/RequestModels/UpdatePreparationRequest.cs` |
| Shared Response | `Models/ResponseModels/PreparationAllTypeResponse.cs` |
| View Data | `Models/RequestModels/TransactionPreparationViewData.cs` |
| Display Model | `Models/ObjectModels/TransactionPreparationViewDispaly.cs` |

## Shared Frontend Files

ทั้ง 4 หน้าใช้ไฟล์ frontend หลักร่วมกัน (relative จาก `project/frontend/BSS_WEB/`):

| ประเภท | Path |
|--------|------|
| Controller | `Controllers/PreparationController.cs` |
| Controller (Pre-Prep) | `Controllers/PrePreparationUnsortController.cs` |
| Display Model | `Models/DisplayModel/TransactionPreparationDisplay.cs` |
| Shared Service Models | `Models/ServiceModel/Preparation/CreateTransactionPreparationRequest.cs` |
| | `Models/ServiceModel/Preparation/GetAllPreparationResult.cs` |
| | `Models/ServiceModel/Preparation/GetPreparationByIdResult.cs` |
| | `Models/ServiceModel/Preparation/TransactionPreparationViewData.cs` |
| | `Models/ServiceModel/Preparation/UpdateTransactionPreparationRequest.cs` |
