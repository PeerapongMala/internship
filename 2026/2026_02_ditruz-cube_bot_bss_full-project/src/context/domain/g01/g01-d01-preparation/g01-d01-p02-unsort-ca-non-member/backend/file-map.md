# Preparation Unsort CA Non-Member — Backend File Map

Path ทั้งหมด relative จาก `project/backend/BSS_API/`

> ไฟล์ shared (Service, Repository, Entity) ดูที่ [domain index](../../index.md)

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/PreparationUnsortCaNonmemberController.cs` |
| **Service** | `Services/TransactionPreparationService.cs` *(shared)* |
| **Service Interface** | `Services/Interface/ITransactionPreparationService.cs` *(shared)* |
| **Repository** | `Repositories/TransactionPreparationRepository.cs` *(shared)* |
| **Repository Interface** | `Repositories/Interface/ITransactionPreparationRepository.cs` *(shared)* |
| **Entity** | `Models/Entities/TransactionPreparation.cs` *(shared)* |

## Request Models

| Path |
|------|
| `Models/RequestModels/PreparationUnsortCaNonMemberRequest.cs` |
| `Models/RequestModels/DeletePreparationUnsortCaNonMemberRequest.cs` |
| `Models/RequestModels/EditPreparationUnsortCaNonMemberRequest.cs` |

## Response Models

| Path |
|------|
| `Models/ResponseModels/PreparationUnsortCaNonMemberResponse.cs` |
| `Models/ResponseModels/DeletePreparationUnsortCaNonMemberResponse.cs` |
| `Models/ResponseModels/EditPreparationUnsortCaNonMemberResponse.cs` |

## Report Models

| Path |
|------|
| `Models/Report/Preparation/PreparationUnsortCANonMemberReportModel.cs` |
| `Models/Report/Preparation/PreparationUnsortCANonMemberReportRequest.cs` |
