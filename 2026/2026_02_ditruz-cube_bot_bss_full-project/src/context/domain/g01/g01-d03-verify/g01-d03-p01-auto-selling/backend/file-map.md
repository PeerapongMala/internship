# Backend File Map — Verify Auto Selling

## Base Path: `project/backend/BSS_API/`

### Entities
| File | Description |
|------|-------------|
| `Models/Entities/TransactionVerifyTran.cs` | Main transaction entity → `bss_txn_verify_tran` |
| `Models/Entities/TransactionVerify.cs` | Detail entity → `bss_txn_verify` |

### Request Models (`Models/RequestModels/`)
| File | Description |
|------|-------------|
| `VerifyTransactionFilterRequest.cs` | Filter for paged list |
| `VerifyScanRequest.cs` | Scan header card |
| `EditVerifyTranRequest.cs` | Edit transaction |
| `DeleteVerifyTranRequest.cs` | Delete transaction |
| `VerifyActionRequest.cs` | Verify action + denomination items |
| `CancelVerifyRequest.cs` | Cancel verify |
| `VerifyCountRequest.cs` | Count request |

### Response Models (`Models/ResponseModels/`)
| File | Description |
|------|-------------|
| `VerifyTransactionResponse.cs` | Full transaction response |
| `VerifyScanResponse.cs` | Scan result |
| `VerifyHeaderCardDetailResponse.cs` | Header card detail |
| `EditVerifyTranResponse.cs` | Edit result |
| `DeleteVerifyTranResponse.cs` | Delete result |
| `VerifyDetailResponse.cs` | Denomination breakdown |
| `VerifyCountResponse.cs` | Count totals |

### Repository
| File | Description |
|------|-------------|
| `Repositories/Interface/ITransactionVerifyTranRepository.cs` | Repository interface |
| `Repositories/TransactionVerifyTranRepository.cs` | Implementation (GenericRepository) |

### Service
| File | Description |
|------|-------------|
| `Services/Interface/ITransactionVerifyTranService.cs` | Service interface |
| `Services/TransactionVerifyTranService.cs` | Implementation (TODO stubs) |

### Controller
| File | Description |
|------|-------------|
| `Controllers/VerifyTransactionController.cs` | API controller, route `api/[controller]` |

### Modified Files (Registration)
| File | Change |
|------|--------|
| `Repositories/Interface/IUnitofWork.cs` | Added `TransactionVerifyTranRepos` |
| `Repositories/UnitOfWork.cs` | Added property + constructor init |
| `Models/ApplicationDbContext.cs` | Added DbSets + OnModelCreating |
