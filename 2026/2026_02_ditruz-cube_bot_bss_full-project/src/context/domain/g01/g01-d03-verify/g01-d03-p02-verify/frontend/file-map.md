# Frontend File Map — Verify Confirmation

## Base Path: `project/frontend/BSS_WEB/`

## Shared with p01 Auto Selling

| ประเภท | Path | Notes |
|--------|------|-------|
| **Controller** | `Controllers/VerifyController.cs` | Shared — added `VerifyConfirmation()` action method |
| **Service** | `Services/VerifyTransactionService.cs` | Shared — reuse Verify/GetVerifyDetail |
| **Interface** | `Interfaces/IVerifyTransactionService.cs` | Shared |

## New Files (p02-specific)

### View

| File | Description |
|------|-------------|
| `Views/Verify/VerifyConfirmation/Index.cshtml` | หน้า Verify Confirmation (summary + verify button) |
| `Views/Verify/VerifyConfirmation/Index.cshtml.cs` | ViewModel (Supervisor, SortingMachine, BnTypeName, CssVariantClass, BnTypeCode) |

### CSS

| File | Description |
|------|-------------|
| `wwwroot/css/verify/verifyConfirmation.css` | Base stylesheet — cards, table, summary, footer buttons |

### JavaScript

| File | Description |
|------|-------------|
| `wwwroot/js/verify/verifyConfirmation.js` | Mock data + table render + summary calc + button handlers |

## UI Architecture

### Page Structure (from Figma node 1:9829)

```
Nav Bar
  ├── BOT Logo + System Name
  ├── "Verify" dropdown
  └── User Info (name + Supervisor)

Title Bar
  ├── "Verify {BnTypeName}" (h1)
  └── "Print Data" button (top-right)

Info Card (centered, ~600px)
  ├── Date row (pink bg + alert icon)
  ├── Supervisor row
  └── Sorting Machine row

Detail Table — "รายละเอียดธนบัตร"
  ├── Columns: ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, จำนวนขาด, จำนวนเกิน
  └── Rows: denomination breakdown (badges + data)

Summary Card
  ├── รวมธนบัตร ดี/เสีย/ทำลาย
  ├── รวมธนบัตร Reject (red)
  ├── รวมธนขาด (red)
  ├── รวมธนบัตรเกิน (red)
  ├── ธนบัตรชำรุด
  ├── ธนบัตรปลอม
  └── รวมทั้งสิ้น (bold)

Footer
  ├── "กลับไปหน้า Auto Selling" (grey button)
  └── "Verify" (dark blue button)
```
