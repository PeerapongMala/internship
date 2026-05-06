# Preparation Unsort CC — Backend File Map

Path ทั้งหมด relative จาก `project/backend/BSS_API/`

> ไฟล์ shared (Service, Repository, Entity) ดูที่ [domain index](../../index.md)

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/PreparationUnsortCCController.cs` |
| **Service** | `Services/TransactionPreparationService.cs` *(shared)* |
| **Service Interface** | `Services/Interface/ITransactionPreparationService.cs` *(shared)* |
| **Repository** | `Repositories/TransactionPreparationRepository.cs` *(shared)* |
| **Repository Interface** | `Repositories/Interface/ITransactionPreparationRepository.cs` *(shared)* |
| **Entity** | `Models/Entities/TransactionPreparation.cs` *(shared)* |

## Request Models

| Path |
|------|
| `Models/RequestModels/PreparationUnsortCCRequest.cs` |
| `Models/RequestModels/DeletePreparationUnsortCCRequest.cs` |
| `Models/RequestModels/EditPreparationUnsortCCRequest.cs` |

## Response Models

| Path |
|------|
| `Models/ResponseModels/PreparationUnsortCCResponse.cs` |
| `Models/ResponseModels/DeletePreparationUnsortCCResponse.cs` |
| `Models/ResponseModels/EditPreparationUnsortCCResponse.cs` |

## Report Models

| Path |
|------|
| `Models/Report/Preparation/PreparationUnsortCCReportModel.cs` |
| `Models/Report/Preparation/PreparationUnsortCCReportRequest.cs` |
