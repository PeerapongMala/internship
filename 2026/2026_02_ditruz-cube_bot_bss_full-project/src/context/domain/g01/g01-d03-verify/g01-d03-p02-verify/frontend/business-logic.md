# Business Logic — Verify Confirmation (Frontend)

## Page Flow

1. User อยู่ที่หน้า Auto Selling (p01) → กดปุ่ม "ตรวจสอบ"
2. Redirect มาหน้า Verify Confirmation (p02) พร้อม verify_tran_id หรือ context
3. หน้า p02 โหลดข้อมูลสรุป denomination breakdown จาก API
4. User ตรวจสอบยอด → มี 2 choices:
   - กด "กลับไปหน้า Auto Selling" → redirect back to p01
   - กด "Verify" → เปิด OTP Confirm modal

## Modal Flow (Verify button)

```
[Verify] click
    │
    ▼
OTP Confirm Modal (560×360)
  │
  ├── [ยกเลิก] → close modal, stay on page
  │
  └── [ยืนยัน] → call API POST Verify
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
  to p01     stay on page
```

### OTP Confirm Modal
- Trigger: Click "Verify" button
- Icon: Blue ℹ (#3D8BFD)
- Title: "Verify"
- Message: "คุณแน่ใจหรือไม่ที่ต้องการ Verify ข้อมูลนี้"
- Buttons: [ยกเลิก] grey + [ยืนยัน] navy
- Confirm action: Call API → show Success or Error modal

### Success Modal
- Trigger: API returns success
- Icon: Green ✓ (#198754)
- Title: "สำเร็จ"
- Message: "บันทึกข้อมูลสำเร็จ"
- Button: [ตกลง] green (#198754)
- Action: Close all modals → redirect to `/Verify/VerifyAutoSelling`

### Error Modal
- Trigger: API returns error
- Icon: Red ! (#DC3545)
- Title: "การแจ้งเตือน"
- Message: "มีข้อผิดพลาดในการ Verify" (or dynamic error message)
- Button: [ตกลง] navy (#003366)
- Action: Close error modal → stay on page (user can retry)

## UI Sections

### Info Card
- แสดง Date (+ alert icon ถ้ามีปัญหา), Supervisor, Sorting Machine
- Date row มี background สีชมพู (#f8d7da)
- ข้อมูลมาจาก session/claims (เหมือน p01)

### Detail Table — "รายละเอียดธนบัตร"
- 6 columns: ชนิดราคา, ประเภท, แบบ, จำนวนฉบับ, จำนวนขาด(ฉบับ), จำนวนเกิน(ฉบับ)
- Sortable columns (▽ icon)
- ชนิดราคา แสดงเป็น denomination badge (เช่น [1000])
- ประเภท: ดี, ทำลาย, Reject, ปลอม
- Scrollable: max 6 visible rows, sticky header
- Data source: API `GetVerifyDetail/{id}` หรือ endpoint ใหม่

### Summary Card
- 7 summary rows + total:

| Label | Sign | Value Color |
|-------|------|-------------|
| รวมธนบัตร ดี/เสีย/ทำลาย ทั้งสิ้น | (+) | black |
| รวมธนบัตร Reject จำนวนทั้งสิ้น | (+) | red |
| รวมธนขาด จำนวนทั้งสิ้น | (+) | red |
| รวมธนบัตรเกิน จำนวนทั้งสิ้น | (-) | red |
| ธนบัตรชำรุด จำนวนทั้งสิ้น | (O) | black |
| ธนบัตรปลอม จำนวนทั้งสิ้น | (O) | black |
| **รวมทั้งสิ้น** | | **bold** |

- Values: right-aligned + "ฉบับ" suffix
- Calculated from detail table data

## Button Actions

### "Print Data" (top-right)
- พิมพ์ report / export PDF ของหน้า summary

### "กลับไปหน้า Auto Selling" (footer-left, grey)
- Navigate back to `/Verify/VerifyAutoSelling`
- ไม่ต้อง confirm

### "Verify" (footer-right, dark blue)
- เปิด OTP Confirm modal → ตาม modal flow ด้านบน
- สำเร็จ → status เปลี่ยนจาก Verify(17) → SendToCBMS(18)

## BnType Variant Handling
- เหมือน p01: อ่าน BnType จาก session/claims
- เปลี่ยน title text + CSS class + gradient ตาม variant
- 4 variants: UF, UC, CA, CN

## AJAX Service Paths
- `$.requestAjax({ service: 'Verify/GetVerifyDetail' })` — ดึงข้อมูล detail
- `$.requestAjax({ service: 'Verify/VerifyAction' })` — ยืนยัน verify

## การตัดสินใจ / เปลี่ยนแปลง Logic

| Date | Decision |
|------|----------|
| 2026-02-23 | OTP modal ไม่ใช่ OTP input — เป็น confirm dialog แค่ "คุณแน่ใจหรือไม่" |
| 2026-02-23 | Success/Error modals อยู่ใน Figma file คนละไฟล์ (verify-ver-2 / CO9) |
| 2026-02-23 | ทั้ง 3 modals ใช้ layout เดียวกัน: 560×360, 3-section, custom `.vc-modal-*` classes |
