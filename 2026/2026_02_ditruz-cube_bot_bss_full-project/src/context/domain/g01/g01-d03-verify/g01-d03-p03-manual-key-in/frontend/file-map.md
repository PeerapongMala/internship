# Frontend File Map — Manual Key-in

## Base Path: `project/frontend/BSS_WEB/`

### View
| File | Description |
|------|-------------|
| `Views/Verify/ManualKeyIn/Index.cshtml` | Main page + 4 modals (~320 lines) |
| `Views/Verify/ManualKeyIn/Index.cshtml.cs` | ViewModel (IndexModel) |

### CSS (`wwwroot/css/verify/`)
| File | Description |
|------|-------------|
| `manualKeyIn.css` | Base stylesheet (~580 lines, mk- prefix) |
| `verify-unsort-cc.css` | Orange gradient variant (shared with Auto Selling) |
| `verify-ca-member.css` | Green gradient variant (shared with Auto Selling) |
| `verify-ca-non-member.css` | Purple gradient variant (shared with Auto Selling) |

### JavaScript (`wwwroot/js/verify/`)
| File | Description |
|------|-------------|
| `manualKeyIn.js` | Main JS (~444 lines, USE_MOCK_DATA=true) |

### Controller
| File | Description |
|------|-------------|
| `Controllers/VerifyController.cs` | Shared controller — added `ManualKeyIn()` action |

### Modified Files
| File | Change |
|------|--------|
| `Controllers/VerifyController.cs` | Added `ManualKeyIn()` action with BnType variant logic |

## UI Architecture

### Page Structure
```
Title Bar
  └── Page title + BnType info

Header Card Row (white bg, rounded border)
  ├── Header Card code badge
  └── Date

Content Area (flex row)
  ├── Form Section (left, flex:1)
  │   ├── ประเภทธนบัตร radio group (6 options)
  │   ├── ชนิดราคา denomination badges (5 options)
  │   ├── แบบ dropdown
  │   ├── จำนวน input
  │   └── บันทึกผลนับคัด button
  └── Info Panel (right, ~400px)
      └── 10 key-value rows

Results Table (div-based)
  ├── Header bar (count before/after)
  ├── Column headers
  └── Dynamic rows with edit/delete actions

Footer Bar
  └── บันทึกข้อมูล button
```

### Modals
| Modal ID | Figma Screen | Description |
|----------|-------------|-------------|
| `#editItemModal` | 1.1 | แก้ไขข้อมูล — edit single item qty |
| `#confirmSaveModal` | 1.2 | ยืนยันบันทึก — confirm save |
| `#successModal` | 1.3 / 1.7 | สำเร็จ — success message |
| `#reviewModal` | 1.5 / 1.6 | ตรวจสอบการแก้ไข — 2-step (review + OTP) |
