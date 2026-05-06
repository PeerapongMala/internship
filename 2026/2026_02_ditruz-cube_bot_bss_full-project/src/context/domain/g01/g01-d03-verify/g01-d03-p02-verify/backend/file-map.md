# Backend File Map — Verify Confirmation

## Base Path: `project/backend/BSS_API/`

## Shared with p01 Auto Selling

หน้า Verify Confirmation ใช้ API endpoints ร่วมกับ p01 — ไม่ต้องสร้างไฟล์ใหม่ฝั่ง backend

| ประเภท | Path | Notes |
|--------|------|-------|
| **Controller** | `Controllers/VerifyTransactionController.cs` | Shared — ใช้ endpoint `Verify`, `GetVerifyDetail` |
| **Service** | `Services/TransactionVerifyTranService.cs` | Shared |
| **Service Interface** | `Services/Interface/ITransactionVerifyTranService.cs` | Shared |
| **Repository** | `Repositories/TransactionVerifyTranRepository.cs` | Shared |
| **Repository Interface** | `Repositories/Interface/ITransactionVerifyTranRepository.cs` | Shared |
| **Entity** | `Models/Entities/TransactionVerifyTran.cs` | Shared |
| **Entity** | `Models/Entities/TransactionVerify.cs` | Shared |

## API Endpoints Used by p02

| Method | Path | Description |
|--------|------|-------------|
| GET | `GetVerifyDetail/{id}` | ดึงรายละเอียด denomination breakdown สำหรับแสดงในตาราง |
| POST | `Verify` | ยืนยัน verify action (ต้อง OTP) |

## Request/Response Models Used

| Model | Type | Path |
|-------|------|------|
| `VerifyActionRequest` | Request | `Models/RequestModels/VerifyActionRequest.cs` |
| `VerifyDetailResponse` | Response | `Models/ResponseModels/VerifyDetailResponse.cs` |

## New Files (p02-specific)

ไม่มี — reuse ทั้งหมดจาก p01

> หมายเหตุ: ถ้าต้องการ endpoint ใหม่เฉพาะหน้า confirmation (เช่น summary endpoint) ให้เพิ่มที่นี่
