# Backend File Map — Revoke

## Base Path: `project/backend/BSS_API/`

### Entities (reuse)
| File | Description |
|------|-------------|
| `Models/Entities/TransactionVerifyTran.cs` | Shared entity → `bss_txn_verify_tran` (filter `is_revoke = true`) |
| `Models/Entities/TransactionVerify.cs` | Detail entity → `bss_txn_verify` |

### Request Models (`Models/RequestModels/`)
| File | Description |
|------|-------------|
| `RevokeTransactionFilterRequest.cs` | Filter for paged list |
| `RevokeScanRequest.cs` | Scan header card |
| `EditRevokeTranRequest.cs` | Edit transaction |
| `DeleteRevokeTranRequest.cs` | Delete transaction |
| `RevokeActionRequest.cs` | Revoke action + denomination items |
| `CancelRevokeRequest.cs` | Cancel revoke |
| `RevokeCountRequest.cs` | Count request |

### Response Models (`Models/ResponseModels/`)
| File | Description |
|------|-------------|
| `RevokeTransactionResponse.cs` | Full transaction response |
| `RevokeScanResponse.cs` | Scan result |
| `RevokeHeaderCardDetailResponse.cs` | Header card detail |
| `EditRevokeTranResponse.cs` | Edit result |
| `DeleteRevokeTranResponse.cs` | Delete result |
| `RevokeDetailResponse.cs` | Denomination breakdown |
| `RevokeCountResponse.cs` | Count totals |

### Repository
| File | Description |
|------|-------------|
| `Repositories/Interface/ITransactionRevokeTranRepository.cs` | Repository interface |
| `Repositories/TransactionRevokeTranRepository.cs` | Implementation (GenericRepository, filter is_revoke=true) |

### Service
| File | Description |
|------|-------------|
| `Services/Interface/ITransactionRevokeTranService.cs` | Service interface |
| `Services/TransactionRevokeTranService.cs` | Implementation (TODO stubs for Revoke/CancelRevoke) |

### Controller
| File | Description |
|------|-------------|
| `Controllers/RevokeTransactionController.cs` | API controller, route `api/[controller]` |

### Modified Files (Registration)
| File | Change |
|------|--------|
| `Repositories/Interface/IUnitofWork.cs` | Added `TransactionRevokeTranRepos` |
| `Repositories/UnitOfWork.cs` | Added property + constructor init |
