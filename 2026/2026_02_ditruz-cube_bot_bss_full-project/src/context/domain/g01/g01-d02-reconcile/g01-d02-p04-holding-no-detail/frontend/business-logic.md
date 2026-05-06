# Business Logic — Holding No Detail (Frontend)

## Page Flow

1. User อยู่ที่หน้า Reconcile Transaction (p01) → กดปุ่ม
2. Redirect มาหน้า Holding (p04) พร้อม context
3. หน้า p04 โหลดข้อมูลสรุป denomination breakdown จาก API
4. User ตรวจสอบยอด → กด "ส่งยอด Reject"

## Modal Flow (ส่งยอด Reject button)

```
[ส่งยอด Reject] click
    │
    ▼
Confirm Modal (560×360)
  │
  ├── [ยกเลิก] → close modal, stay on page
  │
  └── [ยืนยัน] → call API
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Success   Error
  Modal     Modal
    │         │
    ▼         ▼
  [ตกลง]    [ตกลง]
  redirect   close,
             stay on page
```

### Confirm Reject Modal
- Trigger: Click "ส่งยอด Reject" button
- Icon: Blue info circle (#3D8BFD)
- Title: "ส่งยอด Reject"
- Message: "ยืนยันการส่งยอด Reject"
- Buttons: [ยกเลิก] grey #6c757d + [ยืนยัน] navy #003366
- Confirm action: Call API → show Success or Error modal

### Success Modal
- Trigger: API returns success
- Icon: Green checkmark (#198754)
- Title: "สำเร็จ"
- Message: "ส่งข้อมูลสำเร็จ"
- Button: [ตกลง] green (#198754)
- Action: Close all modals → redirect to Reconcile Transaction

### Error Modal
- Trigger: API returns error
- Icon: Red exclamation (#DC3545)
- Title: "การแจ้งเตือน"
- Message: dynamic error message
- Button: [ตกลง] navy (#003366)
- Action: Close error modal → stay on page (user can retry)

## UI Sections

### Info Header
- 2-column grid layout (760px wide)
- Left: Date (pink bg #f8d7da + alert icon), Sorter, Reconciliator
- Right: Sorting Machine, Shift
- Data from session/claims (via ViewModel)

### Summary Table — "สรุปยอดผลการนับคัด"
- 4 columns: ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ
- Sortable columns (chevron-expand icon)
- ชนิดราคา แสดงเป็น denomination badge (เช่น [1000])
- ประเภท: ดี, ทำลาย, Reject, ปลอม
- Scrollable table with sticky header
- Data source: API endpoint (TBD)

### Summary Footer
- 4 summary lines + total:

| Label | Sign | Value Color |
|-------|------|-------------|
| รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น | (+) | black #212121 |
| รวมธนบัตร Reject จำนวนทั้งสิ้น | (+) | red #dc2626 |
| ธนบัตร ปลอม/ชำรุด จำนวนทั้งสิ้น | (O) | red #dc2626 |
| เกินจำนวน (ระบบ) จำนวนทั้งสิ้น | (O) | blue #2563eb |
| **รวมทั้งสิ้น** | | **bold #212121** |

- Values: right-aligned + "ฉบับ" suffix

## Button Actions

### "Reconcile Transaction" (title-right, outlined)
- Navigate to `/Reconcilation/ReconcileTransaction`

### "Print Data" (title-right, filled navy)
- Print page / export

### "ส่งยอด Reject" (content-bottom, full-width navy)
- Open Confirm modal → modal flow above

## BnType Variant Handling
- อ่าน BnType จาก session/claims
- เปลี่ยน title text + CSS class + gradient ตาม variant
- 4 variants: UF (blue), UC (orange), CA (green), CN (purple)

## การตัดสินใจ / เปลี่ยนแปลง Logic

| Date | Decision |
|------|----------|
| 2026-02-24 | Initial scaffold — based on Verify Confirmation (p02) pattern |
| 2026-02-24 | Summary has 4 rows (not 6 like Verify): ดี/ทำลาย, Reject, ปลอม/ชำรุด, เกินจำนวน |
| 2026-02-24 | Single full-width "ส่งยอด Reject" button instead of 2 buttons |
| 2026-02-24 | Info header uses 2-column grid (Date/Sorter/Reconciliator + Machine/Shift) |
