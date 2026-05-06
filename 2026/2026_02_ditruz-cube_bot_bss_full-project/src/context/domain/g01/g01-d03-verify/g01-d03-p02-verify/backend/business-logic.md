# Business Logic — Verify Confirmation (Backend)

## Status Flow

Approved (16) → Verify (17) → **SendToCBMS (18)**

หน้า p02 ทำ transition: Verify (17) → SendToCBMS (18) เมื่อกด "Verify"

## Key Business Rules

### Get Verify Detail (shared with p01)
- Input: verifyTranId
- Return: denomination breakdown — ชนิดราคา, ประเภท (ดี/ทำลาย/Reject/ปลอม), แบบ, จำนวนฉบับ, ขาด, เกิน
- Data source: `bss_txn_verify` joined with `bss_txn_verify_tran`

### Verify Action (shared with p01)
- Input: VerifyTranId, denomination items, SupervisorId, OtpCode
- Validate OTP from supervisor
- Update status: Verify (17) → SendToCBMS (18)
- อาจต้อง OTP จาก Manager ด้วย (เหมือน Reconcile flow)

### Summary Calculation (frontend-side)
- รวมธนบัตร ดี/เสีย/ทำลาย = SUM(จำนวนฉบับ) WHERE ประเภท IN (ดี, ทำลาย)
- รวม Reject = SUM(จำนวนฉบับ) WHERE ประเภท = Reject
- รวมขาด = SUM(จำนวนขาด)
- รวมเกิน = SUM(จำนวนเกิน)
- ธนบัตรชำรุด = TBD (อาจเป็น field แยกใน entity)
- ธนบัตรปลอม = SUM(จำนวนฉบับ) WHERE ประเภท = ปลอม
- รวมทั้งสิ้น = ดี/ทำลาย + Reject + ปลอม (or all types)

> หมายเหตุ: ถ้า summary calculation ซับซ้อน อาจต้องสร้าง API endpoint ใหม่แยกจาก GetVerifyDetail

## DI Registration

ไม่ต้องเพิ่ม — reuse ทั้งหมดจาก p01

## การตัดสินใจ / เปลี่ยนแปลง Logic

*(ยังไม่มีรายการ)*
