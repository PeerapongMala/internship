# Preparation Unfit — Backend File Map

Path ทั้งหมด relative จาก `project/backend/BSS_API/`

> ไฟล์ shared (Service, Repository, Entity) ดูที่ [domain index](../../index.md)

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/PreparationUnfitController.cs` |
| **Service** | `Services/TransactionPreparationService.cs` *(shared)* |
| **Service Interface** | `Services/Interface/ITransactionPreparationService.cs` *(shared)* |
| **Repository** | `Repositories/TransactionPreparationRepository.cs` *(shared)* |
| **Repository Interface** | `Repositories/Interface/ITransactionPreparationRepository.cs` *(shared)* |
| **Entity** | `Models/Entities/TransactionPreparation.cs` *(shared)* |

## Request Models

| Path |
|------|
| `Models/RequestModels/PreparationUnfitRequest.cs` |
| `Models/RequestModels/DeletePreparationUnfitRequest.cs` |
| `Models/RequestModels/EditPreparationUnfitRequest.cs` |
| `Models/RequestModels/UpdatePreparationUnfitRequest.cs` |

## Response Models

| Path |
|------|
| `Models/ResponseModels/PreparationUnfitResponse.cs` |
| `Models/ResponseModels/DeletePreparationUnfitResponse.cs` |
| `Models/ResponseModels/EditPreparationUnfitResponse.cs` |

## Report Models

| Path |
|------|
| `Models/Report/Preparation/PreparationUnfitReportModel.cs` |
| `Models/Report/Preparation/PreparationUnfitReportRequest.cs` |
