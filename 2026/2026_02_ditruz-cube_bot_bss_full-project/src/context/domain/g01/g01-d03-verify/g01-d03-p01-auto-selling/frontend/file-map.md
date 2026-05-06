# Frontend File Map — Verify Auto Selling

## Base Path: `project/frontend/BSS_WEB/`

### Request Models (`Models/ObjectModel/`)
| File | Description |
|------|-------------|
| `VerifyTransactionFilterRequest.cs` | Filter for paged list |
| `VerifyScanRequest.cs` | Scan header card |
| `EditVerifyTranRequest.cs` | Edit transaction |
| `DeleteVerifyTranRequest.cs` | Delete transaction |
| `VerifyActionRequest.cs` | Verify action + denomination items |
| `CancelVerifyRequest.cs` | Cancel verify |
| `VerifyCountRequest.cs` | Count request |

### Service Result Models (`Models/ServiceModel/Verify/`)
| File | Description |
|------|-------------|
| `VerifyTransactionResult.cs` | Transaction list item |
| `VerifyScanResult.cs` | Scan result |
| `VerifyHeaderCardDetailResult.cs` | Header card detail |
| `VerifyDetailResult.cs` | Denomination breakdown |
| `VerifyCountResult.cs` | Count totals |

### Service
| File | Description |
|------|-------------|
| `Interfaces/IVerifyTransactionService.cs` | Service interface (9 methods) |
| `Services/VerifyTransactionService.cs` | Implementation (BaseApiClient) |

### Controller
| File | Description |
|------|-------------|
| `Controllers/VerifyController.cs` | MVC controller with BnType variant logic |

### View
| File | Description |
|------|-------------|
| `Views/Verify/VerifyAutoSelling/Index.cshtml` | Main page (~709 lines, Figma-based 6-panel layout) |
| `Views/Verify/VerifyAutoSelling/Index.cshtml.cs` | ViewModel (IndexModel) |

### CSS (`wwwroot/css/verify/`)
| File | Description |
|------|-------------|
| `verifyTransaction.css` | Base stylesheet (~1524 lines, built from Figma specs) |
| `verify-unsort-cc.css` | Orange gradient variant |
| `verify-ca-member.css` | Green gradient variant |
| `verify-ca-non-member.css` | Purple gradient variant |

### JavaScript (`wwwroot/js/verify/`)
| File | Description |
|------|-------------|
| `verifyTransaction.js` | Main JS (~876 lines, USE_MOCK_DATA=true) |

### Modified Files
| File | Change |
|------|--------|
| `Infrastructure/ItemServiceCollectionExtensions.cs` | Added DI registration |

## UI Architecture

### Page Structure (from Figma node 2:20263 default state)
```
Title Bar
  ├── Page Title (ตรวจสอบการนับคัดธนบัตรประเภท {BnType})
  ├── Info Panel (Machine, Verifier, Shift)
  └── Action Buttons (Filter Toggle, Refresh, Settings)

Filter Bar (hidden by default, 5 dropdowns)
  ├── Header Card
  ├── ธนาคาร
  ├── Zone
  ├── Cashpoint
  └── ชนิดราคา

Content Panels (2-column flex: 845 | 555)
  ├── Panel Left
  │   ├── Table 1: มัดครบจำนวน ครบมูลค่า
  │   ├── Table 2: มัดรวมครบจำนวน ครบมูลค่า
  │   └── Detail Panel (hidden, shows on HC click in right panel)
  └── Panel Right
      ├── Table A: มัดขาด-เกิน
      ├── Table B: มัดรวมขาด-เกิน
      ├── Table C: มัดเกินโดยขอจากเครื่องจักร
      └── Adjustment Panel (hidden, shows on HC click)

Footer Bar
  ├── Cancel Button
  ├── Verify Button
  └── Send to CBMS Button
```

### Interaction: HC Click in Right Panel (from Figma node 2:18859)
1. Click row in Table A → row highlighted with blue checkbox + "Edited" badge
2. Detail Panel (bottom-left) appears: breakdown by type (ทำลาย/ดี/Reject)
3. Adjustment Panel (bottom-right) appears: form to adjust counts
4. Adjustment form: HC (readonly), denomination dropdown, type dropdown, qty input
5. Radio groups: เพิ่ม/ลด + Normal/Add-on/Ent.JAM
6. Save button (บันทึก) → updates data

### Popup Modals (from Figma specs)
| Modal | Figma Node | Description |
|-------|-----------|-------------|
| Edit & Manual Key-in | `2:23259` | Edit form with manual key-in option |
| Edit Single Item | `2:25077` | Edit single preparation item |
| Success | `2:25046` | Save confirmation modal |
| Cancel Send OTP | `2:31555` | Cancel/Send with OTP verification |
