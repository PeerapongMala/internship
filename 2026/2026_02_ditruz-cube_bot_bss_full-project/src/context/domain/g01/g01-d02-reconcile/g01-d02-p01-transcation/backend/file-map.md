# Reconciliation Transaction — Backend File Map

Path ทั้งหมด relative จาก `project/backend/BSS_API/`

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/ReconcileTransactionController.cs` |
| **Service** | `Services/TransactionReconcileTranService.cs` |
| **Service Interface** | `Services/Interface/ITransactionReconcileTranService.cs` |
| **Repository** | `Repositories/TransactionReconcileTranRepository.cs` |
| **Repository Interface** | `Repositories/Interface/ITransactionReconcileTranRepository.cs` |
| **Entity** | `Models/Entities/TransactionReconcileTran.cs` *(existing)* |
| **Entity** | `Models/Entities/TransactionReconcile.cs` *(existing)* |

## Request Models

| Path |
|------|
| `Models/RequestModels/ReconcileTransactionFilterRequest.cs` |
| `Models/RequestModels/ReconcileScanRequest.cs` |
| `Models/RequestModels/EditReconcileTranRequest.cs` |
| `Models/RequestModels/DeleteReconcileTranRequest.cs` |
| `Models/RequestModels/ReconcileActionRequest.cs` |
| `Models/RequestModels/CancelReconcileRequest.cs` |
| `Models/RequestModels/ReconcileCountRequest.cs` |

## Response Models

| Path |
|------|
| `Models/ResponseModels/ReconcileTransactionResponse.cs` |
| `Models/ResponseModels/ReconcileHeaderCardDetailResponse.cs` |
| `Models/ResponseModels/ReconcileScanResponse.cs` |
| `Models/ResponseModels/EditReconcileTranResponse.cs` |
| `Models/ResponseModels/DeleteReconcileTranResponse.cs` |
| `Models/ResponseModels/ReconcileDetailResponse.cs` |
| `Models/ResponseModels/ReconcileCountResponse.cs` |
