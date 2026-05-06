# Backend File Map — Reconsile

## Controller

- `project/backend/BSS_API/Controllers/ReconsileTransactionController.cs`

## Service

- `project/backend/BSS_API/Services/TransactionReconsileTranService.cs`
- `project/backend/BSS_API/Services/Interface/ITransactionReconsileTranService.cs`

## Repository

- `project/backend/BSS_API/Repositories/TransactionReconsileTranRepository.cs`
- `project/backend/BSS_API/Repositories/Interface/ITransactionReconsileTranRepository.cs`

## Entities

- `project/backend/BSS_API/Models/Entities/TransactionReconsileTran.cs`
- `project/backend/BSS_API/Models/Entities/TransactionReconsile.cs`

## Request Models

- `project/backend/BSS_API/Models/RequestModels/ReconsileFilterRequest.cs`
- `project/backend/BSS_API/Models/RequestModels/ReconsileScanRequest.cs`
- `project/backend/BSS_API/Models/RequestModels/EditReconsileTranRequest.cs`
- `project/backend/BSS_API/Models/RequestModels/DeleteReconsileTranRequest.cs`
- `project/backend/BSS_API/Models/RequestModels/ReconsileActionRequest.cs`
- `project/backend/BSS_API/Models/RequestModels/CancelReconsileRequest.cs`
- `project/backend/BSS_API/Models/RequestModels/ReconsileCountRequest.cs`

## Response Models

- `project/backend/BSS_API/Models/ResponseModels/ReconsileTransactionResponse.cs`
- `project/backend/BSS_API/Models/ResponseModels/ReconsileScanResponse.cs`
- `project/backend/BSS_API/Models/ResponseModels/ReconsileHeaderCardDetailResponse.cs`
- `project/backend/BSS_API/Models/ResponseModels/EditReconsileTranResponse.cs`
- `project/backend/BSS_API/Models/ResponseModels/DeleteReconsileTranResponse.cs`
- `project/backend/BSS_API/Models/ResponseModels/ReconsileDetailResponse.cs`
- `project/backend/BSS_API/Models/ResponseModels/ReconsileCountResponse.cs`

## Registration (Modified)

- `project/backend/BSS_API/Repositories/Interface/IUnitofWork.cs` — added `TransactionReconsileTranRepos`
- `project/backend/BSS_API/Repositories/UnitOfWork.cs` — added property + constructor init
- `project/backend/BSS_API/Models/ApplicationDbContext.cs` — added DbSets + OnModelCreating
