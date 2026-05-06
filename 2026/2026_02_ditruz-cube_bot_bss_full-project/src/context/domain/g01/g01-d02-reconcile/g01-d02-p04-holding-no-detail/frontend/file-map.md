# Frontend File Map — Holding (No Detail)

## Base Path: `project/frontend/BSS_WEB/`

## Shared Files

| ประเภท | Path | Notes |
|--------|------|-------|
| **Controller** | `Controllers/ReconcilationController.cs` | Shared with p01, p02 — added `Holding()` action |

## New Files (p04-specific)

### View

| File | Description |
|------|-------------|
| `Views/Holding/HoldingNoDetail/Index.cshtml` | หน้า Holding summary (info card + table + summary + reject button) |
| `Views/Holding/HoldingNoDetail/Index.cshtml.cs` | ViewModel (BnTypeName, CssVariantClass, BnTypeCode, Sorter, Reconciliator, SortingMachine, ShiftName) |

### CSS

| File | Description |
|------|-------------|
| `wwwroot/css/holding/holdingNoDetail.css` | Base stylesheet — info card, table, summary, footer, modals |
| `wwwroot/css/holding/holding-unsort-cc.css` | Variant: orange gradient (Unsort CC) |
| `wwwroot/css/holding/holding-ca-member.css` | Variant: green gradient (CA Member) |
| `wwwroot/css/holding/holding-ca-non-member.css` | Variant: purple gradient (CA Non-Member) |

### JavaScript

| File | Description |
|------|-------------|
| `wwwroot/js/holding/holdingNoDetail.js` | Mock data + table render + summary calc + modal handlers |

## UI Architecture

### Page Structure (from Figma node 41:28771)

```
Nav Bar
  ├── BOT Logo + System Name
  ├── "Reconciliation" dropdown
  └── User Info (name + role)

Title Bar
  ├── "Holding {BnTypeName}" (h1)
  ├── "Reconcile Transaction" button
  └── "Print Data" button (top-right)

Content Panel (centered, 760px)
  ├── Info Header (2-column grid)
  │   ├── Left: Date (pink bg + alert icon), Sorter, Reconciliator
  │   └── Right: Sorting Machine, Shift
  │
  ├── Summary Table — "สรุปยอดผลการนับคัด"
  │   ├── Columns: ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ
  │   └── Rows: denomination breakdown
  │
  ├── Summary Footer
  │   ├── รวมธนบัตร ดี/เสีย/ทำลาย (+): black
  │   ├── รวมธนบัตร Reject (+): red
  │   ├── ธนบัตร ปลอม/ชำรุด (O): red
  │   ├── เกินจำนวน (ระบบ) (O): blue
  │   └── รวมทั้งสิ้น (bold)
  │
  └── "ส่งยอด Reject" button (full-width, navy)
```
