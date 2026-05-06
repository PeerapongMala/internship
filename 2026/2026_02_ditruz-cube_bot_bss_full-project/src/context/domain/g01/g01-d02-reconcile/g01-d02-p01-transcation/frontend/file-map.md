# Reconciliation Transaction — Frontend File Map

Path ทั้งหมด relative จาก `project/frontend/BSS_WEB/`

## Core Files

| ประเภท | Path |
|--------|------|
| **Controller** | `Controllers/ReconcilationController.cs` |
| **View** | `Views/Reconcilation/ReconcileTransaction/Index.cshtml` |
| View Code-Behind | `Views/Reconcilation/ReconcileTransaction/Index.cshtml.cs` |
| **Service** | `Services/ReconcileTransactionService.cs` |
| **Interface** | `Interfaces/IReconcileTransactionService.cs` |

## Models (Object)

| Path |
|------|
| `Models/ObjectModel/ReconcileTransactionFilterRequest.cs` |
| `Models/ObjectModel/ReconcileScanRequest.cs` |
| `Models/ObjectModel/EditReconcileTranRequest.cs` |
| `Models/ObjectModel/DeleteReconcileTranRequest.cs` |
| `Models/ObjectModel/ReconcileActionRequest.cs` |
| `Models/ObjectModel/CancelReconcileRequest.cs` |

## Models (Service)

| Path |
|------|
| `Models/ServiceModel/Reconcile/ReconcileTransactionResult.cs` |
| `Models/ServiceModel/Reconcile/ReconcileHeaderCardDetailResult.cs` |
| `Models/ServiceModel/Reconcile/ReconcileScanResult.cs` |
| `Models/ServiceModel/Reconcile/ReconcileDetailResult.cs` |
| `Models/ServiceModel/Reconcile/ReconcileCountResult.cs` |

## Static Assets

| ประเภท | Path |
|--------|------|
| CSS (base) | `wwwroot/css/reconcile/reconcileTransaction.css` |
| CSS (Unfit) | `wwwroot/css/reconcile/reconcile-unfit.css` |
| CSS (Unsort CC) | `wwwroot/css/reconcile/reconcile-unsort-cc.css` |
| CSS (CA Member) | `wwwroot/css/reconcile/reconcile-unsort-ca-member.css` |
| CSS (CA Non-Member) | `wwwroot/css/reconcile/reconcile-unsort-ca-non-member.css` |
| JS | `wwwroot/js/reconcile/reconcileTransaction.js` |
