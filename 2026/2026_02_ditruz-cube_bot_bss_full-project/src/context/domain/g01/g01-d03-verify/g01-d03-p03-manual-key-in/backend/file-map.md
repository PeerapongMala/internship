# Backend File Map — Manual Key-in

## Status: Not Started

Backend ยังไม่ได้สร้าง — รอ business logic จากลูกค้า

## Planned Structure (อิงจาก Auto Selling pattern)

### Entities (TBD)
| File | Description |
|------|-------------|
| `Models/Entities/TransactionManualKeyInTran.cs` | Main transaction entity |
| `Models/Entities/TransactionManualKeyIn.cs` | Detail entity |

### Request Models (TBD)
| File | Description |
|------|-------------|
| `ManualKeyInSaveRequest.cs` | Save counting results |

### Response Models (TBD)
| File | Description |
|------|-------------|
| `ManualKeyInSaveResponse.cs` | Save result |

### Repository (TBD)
| File | Description |
|------|-------------|
| `Interface/ITransactionManualKeyInTranRepository.cs` | Repository interface |
| `TransactionManualKeyInTranRepository.cs` | Implementation |

### Service (TBD)
| File | Description |
|------|-------------|
| `Interface/ITransactionManualKeyInTranService.cs` | Service interface |
| `TransactionManualKeyInTranService.cs` | Implementation |

### Controller (TBD)
| File | Description |
|------|-------------|
| `Controllers/ManualKeyInTransactionController.cs` | API controller |

> Note: อาจจะใช้ร่วมกับ VerifyTransaction controller ได้ — ต้องรอ confirm จากทีม
