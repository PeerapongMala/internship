# Frontend File Map — Revoke

## Base Path: `project/frontend/BSS_WEB/`

### Request Models (`Models/ObjectModel/`)
| File | Description |
|------|-------------|
| `RevokeTransactionFilterRequest.cs` | Filter for paged list |
| `RevokeScanRequest.cs` | Scan header card |
| `EditRevokeTranRequest.cs` | Edit transaction |
| `DeleteRevokeTranRequest.cs` | Delete transaction |
| `RevokeActionRequest.cs` | Revoke action + denomination items |
| `CancelRevokeRequest.cs` | Cancel revoke |
| `RevokeCountRequest.cs` | Count request |

### Service Result Models (`Models/ServiceModel/Revoke/`)
| File | Description |
|------|-------------|
| `RevokeTransactionResult.cs` | Transaction list item |
| `RevokeScanResult.cs` | Scan result |
| `RevokeHeaderCardDetailResult.cs` | Header card detail |
| `RevokeDetailResult.cs` | Denomination breakdown |
| `RevokeCountResult.cs` | Count totals |

### Service
| File | Description |
|------|-------------|
| `Interfaces/IRevokeTransactionService.cs` | Service interface (9 methods) |
| `Services/RevokeTransactionService.cs` | Implementation (BaseApiClient) |

### Controller
| File | Description |
|------|-------------|
| `Controllers/RevokeController.cs` | MVC controller with BnType variant logic |

### View
| File | Description |
|------|-------------|
| `Views/Revoke/RevokeAutoSelling/Index.cshtml` | Main page (scaffold from Verify, 709 lines) |
| `Views/Revoke/RevokeAutoSelling/Index.cshtml.cs` | ViewModel (IndexModel) |
| `Views/Revoke/Index.cshtml` | Stub (unused, controller redirects) |

### CSS (`wwwroot/css/revoke/`)
| File | Description |
|------|-------------|
| `revokeTransaction.css` | Base stylesheet (scaffold from Verify) |
| `revoke-unsort-cc.css` | Orange gradient variant |
| `revoke-ca-member.css` | Green gradient variant |
| `revoke-ca-non-member.css` | Purple gradient variant |

### JavaScript (`wwwroot/js/revoke/`)
| File | Description |
|------|-------------|
| `revokeTransaction.js` | Main JS (scaffold from Verify, USE_MOCK_DATA=true) |

### Modified Files
| File | Change |
|------|--------|
| `Infrastructure/ItemServiceCollectionExtensions.cs` | Added DI registration for IRevokeTransactionService |
