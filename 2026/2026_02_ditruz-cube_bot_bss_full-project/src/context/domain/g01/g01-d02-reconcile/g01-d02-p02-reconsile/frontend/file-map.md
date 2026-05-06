# Frontend File Map — Reconsile

## Controller

- `project/frontend/BSS_WEB/Controllers/ReconcilationController.cs` — added Reconsile view action + 9 AJAX endpoints

## View

- `project/frontend/BSS_WEB/Views/Reconcilation/Reconsile/Index.cshtml` — Figma-based UI (node 1:18004)
- `project/frontend/BSS_WEB/Views/Reconcilation/Reconsile/Index.cshtml.cs` — IndexModel

## Service

- `project/frontend/BSS_WEB/Services/ReconsileTransactionService.cs`
- `project/frontend/BSS_WEB/Interfaces/IReconsileTransactionService.cs`

## Object Models (Request)

- `project/frontend/BSS_WEB/Models/ObjectModel/ReconsileFilterRequest.cs`
- `project/frontend/BSS_WEB/Models/ObjectModel/ReconsileScanRequest.cs`
- `project/frontend/BSS_WEB/Models/ObjectModel/EditReconsileTranRequest.cs`
- `project/frontend/BSS_WEB/Models/ObjectModel/DeleteReconsileTranRequest.cs`
- `project/frontend/BSS_WEB/Models/ObjectModel/ReconsileActionRequest.cs`
- `project/frontend/BSS_WEB/Models/ObjectModel/CancelReconsileRequest.cs`
- `project/frontend/BSS_WEB/Models/ObjectModel/ReconsileCountRequest.cs`

## Service Models (Result)

- `project/frontend/BSS_WEB/Models/ServiceModel/Reconsile/ReconsileTransactionResult.cs`
- `project/frontend/BSS_WEB/Models/ServiceModel/Reconsile/ReconsileHeaderCardDetailResult.cs`
- `project/frontend/BSS_WEB/Models/ServiceModel/Reconsile/ReconsileScanResult.cs`
- `project/frontend/BSS_WEB/Models/ServiceModel/Reconsile/ReconsileDetailResult.cs`
- `project/frontend/BSS_WEB/Models/ServiceModel/Reconsile/ReconsileCountResult.cs`

## Static Assets

- CSS Base: `project/frontend/BSS_WEB/wwwroot/css/reconsile/reconsileTransaction.css`
- CSS Variant: `project/frontend/BSS_WEB/wwwroot/css/reconsile/reconsile-unfit.css`
- CSS Variant: `project/frontend/BSS_WEB/wwwroot/css/reconsile/reconsile-unsort-cc.css`
- CSS Variant: `project/frontend/BSS_WEB/wwwroot/css/reconsile/reconsile-ca-member.css`
- CSS Variant: `project/frontend/BSS_WEB/wwwroot/css/reconsile/reconsile-ca-non-member.css`
- JS: `project/frontend/BSS_WEB/wwwroot/js/reconsile/reconsileTransaction.js`

## DI Registration (Modified)

- `project/frontend/BSS_WEB/Infrastructure/ItemServiceCollectionExtensions.cs` — added `IReconsileTransactionService`
