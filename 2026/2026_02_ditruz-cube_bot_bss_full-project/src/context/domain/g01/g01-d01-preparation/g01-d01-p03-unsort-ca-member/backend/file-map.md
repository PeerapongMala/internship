# Preparation Unsort CA Member — Backend File Map

Path ทั้งหมด relative จาก `project/backend/BSS_API/`

> ไฟล์ shared (Service, Repository, Entity) ดูที่ [domain index](../../index.md)

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/PreparationUnsortCaMemberController.cs` |
| **Service** | `Services/TransactionPreparationService.cs` *(shared)* |
| **Service Interface** | `Services/Interface/ITransactionPreparationService.cs` *(shared)* |
| **Repository** | `Repositories/TransactionPreparationRepository.cs` *(shared)* |
| **Repository Interface** | `Repositories/Interface/ITransactionPreparationRepository.cs` *(shared)* |
| **Entity** | `Models/Entities/TransactionPreparation.cs` *(shared)* |

## Request Models

| Path |
|------|
| `Models/RequestModels/PreparationUnsortCaMemberRequest.cs` |
| `Models/RequestModels/DeletePreparationUnsortCaMemberRequest.cs` |
| `Models/RequestModels/EditPreparationUnsortCaMemberRequest.cs` |

## Response Models

| Path |
|------|
| `Models/ResponseModels/PreparationUnsortCaMemberResponse.cs` |
| `Models/ResponseModels/DeletePreparationUnsortCaMemberResponse.cs` |
| `Models/ResponseModels/EditPreparationUnsortCaMemberResponse.cs` |

## Report Models

| Path |
|------|
| `Models/Report/Preparation/PreparationUnsortCAMemberReportModel.cs` |
| `Models/Report/Preparation/PreparationUnsortCAMemberReportRequest.cs` |
