# Business Logic — Verify Auto Selling (Frontend)

## Page Flow
1. User enters from VerifySetting → `/Verify/Index` → redirect → `/Verify/VerifyAutoSelling`
2. BnType determines variant (CSS class, gradient, Thai text)
3. Page loads with 6-panel layout (2 columns x 3 rows)
4. Tables populated from API (or mock data if `USE_MOCK_DATA = true`)

## Mock Data Mode
- `USE_MOCK_DATA = true` in `verifyTransaction.js`
- Generates mock data for all 5 tables + detail panel
- Set to `false` when backend API is available

## UI Layout (6-Panel, NOT 3-Panel like Reconcile)

### Title Bar
- Page title with BnType name
- Info panel: Machine name, Verifier name, Shift time range
- 3 action buttons: Filter toggle, Refresh, Settings gear

### Filter Bar (hidden by default)
- 5 dropdown filters: Header Card, ธนาคาร, Zone, Cashpoint, ชนิดราคา
- Toggle visibility via filter button in title bar

### Left Panel (~845px wide)
| Table | Title | Features |
|-------|-------|----------|
| Table 1 | มัดครบจำนวน ครบมูลค่า | Checkbox, Header Card, denomination, datetime, qty, value, status, action |
| Table 2 | มัดรวมครบจำนวน ครบมูลค่า | Same columns as Table 1 |
| Detail Panel | แสดงรายละเอียดข้อมูลตาม HeaderCard ที่เลือก | 8 columns (HC, bank, cashpoint, denomination, type, typeNum, qty, value) |

### Right Panel (~555px wide)
| Table | Title | Features |
|-------|-------|----------|
| Table A | มัดขาด-เกิน | Clickable rows → triggers detail + adjustment panels |
| Table B | มัดรวมขาด-เกิน | Summary view only |
| Table C | มัดเกินโดยขอจากเครื่องจักร | Summary view only |
| Adjustment Panel | ปรับข้อมูลผลนับคัด | Editor form (appears on HC click) |

## Interaction Patterns

### Click HC in Right Panel (Table A)
1. Row becomes selected (blue checkbox, "Edited" badge)
2. Detail Panel (bottom-left) shows breakdown: ทำลาย / ดี / Reject
3. Adjustment Panel (bottom-right) shows editor form
4. User fills: ชนิดราคา, แบบ, จำนวน(ฉบับ), หมายเหตุ
5. Selects radio: เพิ่ม/ลด + Normal/Add-on/Ent.JAM
6. Clicks บันทึก → saves adjustment

### Table Rendering (3 modes)
- `left` mode: checkbox column + action column (edit/delete buttons)
- `right` mode: clickable rows, HC cell triggers `selectRightRow()`
- `right-no-action` mode: display-only summary tables

### Modal Flows
1. **Edit Flow**: Edit Form → Review Table → OTP Supervisor → OTP Manager → Success
2. **Delete Flow**: Confirm Table → Reconfirm → OTP Supervisor → OTP Manager → Success → Print Report
3. **Verify Flow**: TODO (requires OTP implementation)

## Alert System
- `HasAlert` → Red text on Header Card cell + octagon icon
- `IsWarning` → Pink background entire row
- Mutually exclusive per row

## AJAX Service Paths
All calls go through `$.requestAjax({ service: 'Verify/...' })`

## DI Registration
Manual registration in `ItemServiceCollectionExtensions.cs`:
```csharp
services.AddScoped<IVerifyTransactionService, VerifyTransactionService>();
```

## Footer Actions
| Button | Description |
|--------|-------------|
| ยกเลิก | Cancel verify → status back to Approved(16) |
| ตรวจสอบ | Confirm verify → status to Verify(17), requires OTP |
| ส่ง CBMS | Send to CBMS → status to SendToCBMS(18) |
